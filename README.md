# Webapp
## Project Description 

This is Cloud native Web Application which is build under node.js, Express.js, mySQL. It includes RESTApi for checking health of the application.

## Requirements 

1. Node.js 
2. Mysql (Sequelize)
3. Postman (Any other REST client)
4. Digital Ocean 

## Build and Deploy Instructions


1. Create digital ocean account and select ubuntu VM then after create a new Droplet.
2. Create SSH key on terminal using 

        ssh keygen

3. connect to ubuntu VM using SSH command with your local machine.

        ssh root@IPV4 address


4. clone the webapp repository from the gitHub.
5. Transfer zip file from local machine to VM.
    
        scp /Users/aayushpatel/src/Webapp.zip root@IPV4:loc

6.Install the Dependencies using npm.

        apt-get update
        apt-get install node.js
        apt-get install npm
        apt install mysql server
        npm install express mysql2 sequelize bcryptjs email-validator dotenv
        npm install jest supertest --save-dev

7. Configure the database 

        sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
    
 then after in this file change bind address to 0.0.0.0 and restart the mysql server

        sudo systemctl restart mysql

8. Set password for the database root 

        mysql -u root
        ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
        exit

9. Setup .env file. 

        PORT= YOUR_PORT
        DATA_DIALECT= YOUR_DIALECT
        DATA_HOST= YOUR_HOST
        DATA_PORT= YOUR_PORT
        DATA_USER= YOUR_USER
        DATA_PASSWORD= YOUR_PASSWORD
        DATA_DATABASE= YOUR_DBNAME
5. Start the Application with the defined EC2 instance ipv4 address. 
#