# Project 4: Item Catalog

This is the fourth project for [Udacity's](https://www.udacity.com/) [Full Stack Web Developer Nanodegree](https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd004)
This project uses [Flask](https://flask.palletsprojects.com/en/1.1.x/) to build a web application with full CRUD (Create, Read, Update and Delete) functionality.
The project also uses [Auth0](https://auth0.com/) to implement [Google Sign-In](https://developers.google.com/+/web/signin/).

## Project dependencies

* Python 2.7
* Flask 1.0.2
* Vagrant 1.8.5
* VirtualBox 5.1.38
* SQLAlchemy 1.2.17
* Authlib 0.11
* Six 1.12.0

## Instructions

For this project, a virtual machine (VM) is used to run the database and to run the Flask app.
Therefore, the VM must be installed and configured in your local operating system before running the application.

### Project structure

1. The project directory (`catalog/`) contains the following:

    * `static/` (directory that contains the CSS for the app to function):
    * `templates/` (directory for HTML templates):
        * `category.html` (template for displaying the items for a specific category)
        * `index.html` (template for the main page, which displays the latest items)
        * `item_delete.html` (template for the item delete page)
        * `item_edit.html` (template for the item edit page)
        * `item_new.html` (template for the item create page)
        * `item_show.html` (template for the item show page)
        * `layout.html` (base template extended for all other pages)
        * `login.html` (template for the login page)
    * `.gitignore` (contains all files that must be ignored when using git)
    * `application.py` (main file, containing app configuration and routes)
    * `database_setup.py` (script for creating the database)
    * `db.py` (contains the initial database setup)
    * `middleware.py` (contains all the middleware for the app)
    * `models.py` (contains all database models)
    * `populate_database.py` (script for populating the databse with initial data)
    * `query_all.py` (script for querying all data in database)
    * `README.md` (this file)
    * `requirements.txt` (requirements file created with `pip freeze` for easier installation of dependencies)

### Virtual Machine installation and configuration

1. Download the [VirtualBox 5.1.38 installer](https://www.virtualbox.org/wiki/Download_Old_Builds_5_1) for your operating system
1. Install VirtualBox
1. Download the [Vagrant 1.8.5 installer](https://releases.hashicorp.com/vagrant/1.8.5/) for your operating system
1. Install Vagrant
1. Download the file `fsnd-virtual-machine.zip` and extract its content. This will create a directory called **FSND-Virtual-Machine** containing all the VM files. Alternatively, clone [Udacity's Github repository](https://github.com/udacity/fullstack-nanodegree-vm) to obtain the file
1. Use the `cd` command in your terminal software and change to the **FSND-Virtual-Machine** directory
1. Inside this directory you will find a directory called **vagrant**. Use `cd` again and change to the **vagrant** directory
1. Inside the **vagrant** directory, run the command `vagrant up` start the VM configuration. This process can take a few minutes
1. After the configuration is finished, run the command `vagrant ssh` to log in to your VM

### Creating Google+ and Auth0 credentials

For Google+:
1. Go to [Google's Developer Console](https://console.developers.google.com)
1. Create an account if you don't have one
1. Create an application
1. Create the credentials (`client_id` and `client_secret`)

For Auth0:
1. Go to the [Auth0 page](https://auth0.com/)
1. Create an account if you don't have one
1. Create an application to obtain your credentials (`client_id` and `client_secret`)
1. Follow the [instructions in the Auth0 docs](https://auth0.com/docs/connections/social/google#access-google-s-api-) to configure the correct redirect URLs and authorized domains
1. After the configuration, input your parameters (`client_id`, `client_secret`, `api_base_url`, `access_token_url`, `access_token_url` and `audience`) in the `application.py` file (Auth0 configuration section)

### Creating and populating the database

1. Download the `catalog` directory that contains this project
1. Place `catalog` directory inside the **vagrant** directory **in your local machine**
1. Using the terminal **logged in your recently configured VM**, run the command `cd /vagrant`. You can run `ls` to see the files and directories inside this file. Run `cd catalog/` to move into the project directory
1. Run the command `pip install -r requirements.txt` to install project dependencies
1. Run the following commands:
    ```
    python database_setup.py
    ```
    ```
    python populate_database.py
    ```
1. These commands will create and populate the `catalog.db` database with initial data
1. To check if it worked, run:
    ```
    python query_all.py
    ```
1. You should see several categories and items in printed to your terminal
1. All set! Just one more command to run the application.

### Running the app

1. Inside `/vagrant/catalog` **logged into your VM**, run the following command to start the server:
    ```
    python application.py
    ```
1. Access your app on [http://localhost:8000](http://localhost:8000)
1. Have fun!

## Licence

[MIT](https://opensource.org/licenses/MIT)
