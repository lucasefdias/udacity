# Projeto: Análise de logs

Primeiro projeto do módulo 2 (Backend) do curso [Nanodegree Desenvolvedor Web Full-Stack](https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd004) da [Udacity](https://www.udacity.com/).
Este projeto utiliza um código em Python para fazer consultas em um banco de dados PostgreSQL
e gerar um relatório em um arquivo de texto puro.

## Dependências do Projeto

* Python 2.7
* PostgreSQL (9.5.14)
* Vagrant 1.8.5
* VirtualBox 5.1.38


## Instruções de uso

Para este projeto, utiliza-se uma máquina virtual/virtual machine (VM) para rodar o banco de dados e executar o script Python. Dessa forma, deve-se, inicialmente, instalar e configurar a VM no sistema operacional local.

### Instalação e configuração da máquina virtual

1. Baixe o [instalador do VirtualBox 5.1.38](https://www.virtualbox.org/wiki/Download_Old_Builds_5_1) para o seu sistema operacional
1. Instale o VirtualBox
1. Baixe o [instalador do Vagrant 1.8.5](https://releases.hashicorp.com/vagrant/1.8.5/) para o seu sistema operacional
1. Instale o Vagrant
1. Baixe o arquivo `fsnd-virtual-machine.zip` e extraia o seu conteúdo. Isso irá gerar um diretório **FSND-Virtual-Machine** contendo todos os arquivos da VM. Alternativamente, clone o [repositório do Github da Udacity](https://github.com/udacity/fullstack-nanodegree-vm) para obter o arquivo.
1. Use o comando `cd` no seu terminal e mude para o diretório **FSND-Virtual-Machine**
1. Dentro desse diretório você encontrará um diretório chamado **vagrant**. Use novamente o comando `cd` no terminal e mude para o diretório **vagrant**
1. Dentro do diretório **vagrant**, execute o comando `vagrant up` para realizar a configuração da sua VM. Isso poderá demorar alguns minutos
1. Após a conclusão da configuração da VM, execute o comando `vagrant ssh` para logar na sua VM


### Criando as views auxiliares na base de dados

1. Usando o terminal **logado em sua VM recém configurada**, execute o comando `psql news`. Isso fará com que você acesse a base de dados `newsdata.sql`
1. Com o PostgreSQL em execução, execute os seguintes comandos:
    ```
    CREATE VIEW views_per_article AS
    SELECT articles.author, articles.title, count(*) AS views
    FROM articles LEFT JOIN log ON log.path LIKE '%' || articles.slug
    GROUP BY articles.author, articles.title;
    ```
    ```
    CREATE VIEW daily_requests AS
    SELECT time::date, count(*) as requests
    FROM log
    GROUP BY time::date
    ORDER BY time::date;
    ```
    ```
    CREATE VIEW daily_errors AS
    SELECT time::date, count(*) as errors
    FROM log
    WHERE status != '200 OK'
    GROUP BY time::date
    ORDER BY time::date;
    ```
    ```
    CREATE VIEW error_percentiles AS
    SELECT daily_requests.time, daily_requests.requests, daily_errors.errors,
    round(daily_errors.errors * 100.00/daily_requests.requests, 2) as error_percentile
    FROM daily_requests JOIN daily_errors
    ON daily_errors.time = daily_requests.time
    GROUP BY daily_requests.time, daily_requests.requests, daily_errors.errors
    ORDER BY daily_requests.time;
    ```
1. Pronto! Agora as views estão criadas e tudo está (quase) pronto para ser executado

### Baixando e executando o script

1. Baixe o arquivo de projeto `news.py`
1. Mova o arquivo `news.py` para o diretório **FSND-Virtual-Machine/vagrant** em sua máquina local (caso haja um arquivo com o mesmo nome, sobrescreva-o). Esse é o diretório compartilhado entre a sua VM e a sua máquina local (host)
1. Usando o terminal **logado em sua VM recém configurada**, navegue até a pasta `/vagrant/news`. Utilize os comandos `cd..` para ir para um diretório um nível acima , `cd <nome_do_diretório>` para mover para o diretório desejado e `ls` para visualizar todos os arquivos e diretórios no diretório atual
1. Ainda **no terminal logado em sua VM recém configurada**, execute o comando `python news.py`
1. Pronto! Abra o arquivo `report.txt` e veja o relatório gerado a partir do script!


## Licença

[MIT](https://opensource.org/licenses/MIT)
