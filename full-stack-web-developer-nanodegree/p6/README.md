# Project 6: Linux Server Configuration

This is the final project for [Udacity's](https://www.udacity.com/) [Full Stack Web Developer Nanodegree](https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd004)
This project uses an instance of [Amazon Lightsail](https://aws.amazon.com/lightsail/?nc1=h_ls) as a baseline installation of an Ubuntu server.
This server is then configured to enable SSH access from a newly created user (`grader`), aswell as security improvement (port management and firewall configuration). It is then prepared to host Flask web application **Item Catalog** from project 4 using Apache as an HTTP server and PostgreSQL as database.

## IP address and SSH port

**Public IP** : 52.35.206.69
**SSH port** : 2200

SSH private key and `grader` user password provided in the *Notes to Reviewer* section

## Complete Hosted URL

**Web App URL** : [http://ec2-52-35-206-69.us-west-2.compute.amazonaws.com/](http://ec2-52-35-206-69.us-west-2.compute.amazonaws.com/)

## Summary of configuration steps and installed software

### Create a server on an AWS Lightsail Instance

1. [Create an Amazon LightSail instance](https://aws.amazon.com/lightsail/?nc1=h_ls) ([instructions](https://classroom.udacity.com/nanodegrees/nd004-br/parts/0f666851-42d4-4bb1-a4dc-8c3451aba04f/modules/faeee229-124b-44c7-a669-a0ed107bbbcf/lessons/5ca31566-edf5-4bd3-9475-fff39f04ec40/concepts/c4cbd3f2-9adb-45d4-8eaf-b5fc89cc606e))
1. Access the server through the Amazon console on the Web browser
1. Update server by running:
```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get dist-upgrade
```

### Timezone configuration
1. Configure timezone to UTC by running:
```
sudo timedatectl set-timezone UTC
```
1. You can check the date and time by running:
```
date
```

### User management

#### Create a new user named `grader`
1. Create a user:
```
sudo adduser grader
```
1. Prompt grader to provide new password on first login to the server:
```
sudo chage -d 0 grader
```
1. Grant `grader` superuser permissions, so it can configure the server:
```
sudo usermod -aG sudo grader
```

#### Generating SSH key pair for secure access


1. On your local machine:

    1. Run the following command to generate a SSH key pair:
    ```
    ssh-keygen
    ```
    1. This command will generate the SSH key pair and prompt your for a name (`grader-key`)
    1. When prompted for a password just press `ENTER` to keep it empty
    1. The generated key pair will be your `~/.ssh` directory by default
    1. There will be 2 keys:
        + `id_rsa` (private key, stored on your local machine)
        + `id_rsa.pub` (public key, which will be stored in your remote server)
    1. Run the following command to print the content of your public key to your terminal:
    ```
    cat ~/.ssh/id_rsa.pub
    ```
    1. Copy the content


1. On your remote server:

    1. Create a `.ssh` directory to store public key:
    ```
    sudo mkdir /home/grader/.ssh
    ```
    1. Give ownership of the folder to `grader`:
    ```
    sudo chown grader:grader /home/grader/.ssh
    ```
    1. Create an `authorized_keys` file to store public key:
    ```
    sudo touch /home/grader/.ssh/authorized_keys
    ```
    1. Open `authorized_keys` file and edit it with the contents of your copied public key on your local machine:
    ```
    sudo nano /home/grader/.ssh/authorized_keys
    ```
    1. Give the necessary permissions to folder and file:
    ```
    sudo chmod 700 /home/grader/.ssh
    sudo chmod 644 /home/grader/.ssh/authorized_keys
    ```
    1. Reload your SSH service:
    ```
    sudo service ssh restart
    ```
1. All set! Now you can access the remote server from your local machine using:
```
# ssh -i <private_key_file_path> <user>@<host_ip>
ssh -i ~/.ssh/id_rsa grader@52.35.206.69
```

### Security Configuration

#### Disabling root

1. On your server, run:
```
sudo nano /etc/ssh/sshd_config
```
1. Edit the file, and make sure that the following lines are set as described:
    + EDIT: `PermitRootLogin <some_parameter>` to `PermitRootLogin no`
    + EDIT: `PasswordAuthentication yes` to `PasswordAuthentication no`
    + ADD: `DenyUsers root`

#### Changing the SSH port from 22 to 2200

1. To increase security of the SSH connection, it is necessary to change the default access port.
1. On your server terminal, run:
```
sudo nano /etc/ssh/sshd_config
```
1. Edit the line `Port 22` to `Port 2200`
1. Restart the SSH service:
```
sudo service ssh restart  
```

#### Configure the Uncomplicated Firewall (UFW)

+ **Warning:**
Before you change the SSH port, make sure that the firewall is open for port 2200 first. This ensures that you won't lock yourself out of the server.
After the SSH port is changed, the Lightsail instance will no longer be accessible through the web app `Connect using SSH` button. The button assumes the default port (22) is being used.

1. To ensure our server security, the UFW must be configured to only allow incoming connections for SSH (on port 2200), HTTP (on port 80), and NTP (on port 123)
1. On the server, run the following commands:
```
sudo ufw status                 # check ufw status
sudo ufw default deny incoming  # initially block all incoming requests
sudo ufw default allow outgoing # default rule for outgoing connections
sudo ufw allow 2200/tcp         # allow SSH on port 2200
sudo ufw allow www              # allow HTTP on port 80
sudo ufw allow ntp              # allow NTP on port 123
sudo ufw enable                 # enable firewall
sudo ufw status                 # check ufw status
```
1. On your Amazon Lightsail Instance console, check the Firewall configuration on the `Network` tab
1. Make sure that it only allows connections on ports 2200, 80 and 123. If necessary add or remove ports to match the corresponding configurations of the server firewall

#### Update server
1. Make sure the server is up-to-date by running:
```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get dist-upgrade
```
1. This is required for the next steps, which involve installing Apache PostgreSQL to prepare for deployment
1. If necessary, restart the server by running:
```
sudo reboot
```

### Deploying Item Catalog

#### Setup Apache to serve a Python mod_wsgi application
1. Install Apache:
```
sudo apt-get install apache2
```
1. Install mod_wsgi:
```
sudo apt-get install python-setuptools libapache2-mod-wsgi
```
1. Restart Apache:
```
sudo service apache2 restart
```

#### Install and configure PostgreSQL

1. Install PostgreSQL:
```
sudo apt-get install postgresql
```
1. Make sure remote connections to database are disabled:
```
sudo nano /etc/postgresql/9.5/main/pg_hba.conf
```
1. Login as user `postgres`:
```
sudo su - postgres
```
1. Get into PostgreSQL shell using `psql`
1. Create a new database named `catalog`:
```
postgres=# CREATE DATABASE catalog;
```
1. Create `catalog` user:
```
postgres=# CREATE USER catalog;
```
1. Define a password for `catalog` user:
```
postgres=# ALTER ROLE catalog WITH PASSWORD 'udacity';
```
1. Give user `catalog` permission to `catalog` application database:
```
postgres=# GRANT ALL PRIVILEGES ON DATABASE catalog TO catalog;
```
1. Quit PostgreSQL shell:
```
postgres=# \q
```
1. Exit from user `postgres`:
```
exit
```

#### Install git, clone and setup your Item Catalog App from the Github repository
1. Install Git:
```
sudo apt-get install git
```
1. Move into the `/var/www` directory:
```
cd /var/www
```
1. Create the application directory:
```
sudo mkdir catalog
```
1. Move inside this directory:
```
cd catalog
```
1. Clone the Item Catalog App to the virtual machine:
```
# git clone https://github.com/<YOUR_USER_HERE>/<ITEM_CATALOG_DIRECTORY>.git
# In my case, I had to clone the root directory where I stored all projects and move files inside the server
git clone https://github.com/lucasefdias/udacity.git
# Moved p4 files to catalog directory
sudo mv udacity/full-stack-web-developer-nanodegree/p4/catalog .
# Delete remaining root directory
sudo rm -r udacity
```
1. Clone the Item Catalog App to the virtual machine:
```
git clone https://github.com/<YOUR_USER_HERE>/<ITEM_CATALOG_DIRECTORY>.git
```
1. Move to the inner `catalog` directory:
```
cd catalog
```
1. Rename `application.py` to `__init__.py`:
```
sudo mv application.py __init__.py
```
1. Edit  `database_setup.py` and `db.py`, changing `engine = create_engine('sqlite:///catalog.db')` to `engine = create_engine('postgresql://catalog:udacity@localhost/catalog')`
```
sudo mv website.py __init__.py catalog
```
1. Install `pip`:
```
sudo apt-get install python-pip
```
1. Use `pip` to install project dependencies from `requirements.txt`:
```
sudo pip install -r requirements.txt
```
1. Install `psycopg2`:
```
sudo apt-get -qqy install postgresql python-psycopg2
```
1. Create database schema:
```
sudo pip install -r requirements.txt
```
1. Populate database:
```
sudo python populate_database.py
```

#### Configure .wsgi file
1. Create `.wsgi` file:
```
sudo nano catalog.wsgi
```
1. Add the following code to the `catalog.wsgi` file:
```
#!/usr/bin/python
import sys
import logging
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0,"/var/www/catalog/")
from catalog import app as application
application.secret_key = '<YOUR_SECRET_KEY>'
```

#### Configure and Enable a New Virtual Host

1. Create `catalog.conf` file to edit:
```
sudo nano /etc/apache2/sites-available/catalog.conf
```
1. Add the following lines of code to the file to configure the virtual host:
```
<VirtualHost *:80>
	ServerName ec2-52-35-206-69.us-west-2.compute.amazonaws.com/
	ServerAdmin danielpaladar@gmail.com
	WSGIScriptAlias / /var/www/catalog/catalog.wsgi
	<Directory /var/www/catalog/catalog/>
		Order allow,deny
		Allow from all
	</Directory>
	Alias /static /var/www/catalog/catalog/static
	<Directory /var/www/catalog/catalog/static/>
		Order allow,deny
		Allow from all
	</Directory>
	ErrorLog ${APACHE_LOG_DIR}/error.log
	LogLevel warn
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

1. Enable the virtual host:
```
sudo a2ensite catalog
```
1. Restart Apache:
```
sudo service apache2 restart
```
1. Access the [application URL](http://ec2-52-35-206-69.us-west-2.compute.amazonaws.com/)
1. If it shows a default page, it means that Apache is setup correctly. Only necessary step is to remove the default config file:
```
sudo rm /etc/apache2/sites-available/000-default.conf
```


## List of third-party resources used as reference for this project

* [How to create a sudo user on Ubunutu](https://www.digitalocean.com/community/tutorials/how-to-create-a-sudo-user-on-ubuntu-quickstart)
* [Restart Linux using command prompt](https://phoenixnap.com/kb/restart-linux-using-command-prompt)
* [SSH commands](https://www.ssh.com/ssh/command/)
* [Set up SSH for your Linux/Unix-based Lightsail instances](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/lightsail-how-to-set-up-ssh)
* [Ufw uncomplicated-firewall-on-ubuntu-15-04/](https://www.howtoforge.com/tutorial/ufw-uncomplicated-firewall-on-ubuntu-15-04/)
* [How to deploy a Flask application on an Ubuntu VPS](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-flask-application-on-an-ubuntu-vps)
* [SSH Connection timed out Troubleshooting](https://unix.stackexchange.com/questions/229431/why-are-all-my-ssh-attempts-failing-due-to-timeout)
* [AWS VPC DHCP Options](https://docs.aws.amazon.com/pt_br/vpc/latest/userguide/VPC_DHCP_Options.html)
* [andrevst/fsnd-p6-linux-server-configuration](https://github.com/andrevst/fsnd-p6-linux-server-configuration)
* [jungleBadger/-nanodegree-linux-server](https://github.com/jungleBadger/-nanodegree-linux-server)
* [bcko/Ud-FS-LinuxServerConfig-LightSail](https://github.com/bcko/Ud-FS-LinuxServerConfig-LightSail)

## Licence

[MIT](https://opensource.org/licenses/MIT)
