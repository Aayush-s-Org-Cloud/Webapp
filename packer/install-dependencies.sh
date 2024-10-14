#!/bin/bash

# Update and upgrade the system
sudo apt-get update -y
sudo apt-get upgrade -y

# Install zip and unzip utilities
sudo apt-get install zip unzip -y

# Install Node.js (latest stable version)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
 
# Install MySQL server
sudo apt-get install -y mysql-server

# Update MySQL configuration to allow remote connections
sudo sed -i "s/bind-address.*/bind-address = 0.0.0.0/" /etc/mysql/mysql.conf.d/mysqld.cnf

# Restart MySQL service to apply changes
sudo systemctl restart mysql.service
sudo systemctl enable mysql

# Create the MySQL user if it does not exist
sudo mysql -e "CREATE USER IF NOT EXISTS 'aayush'@'localhost' IDENTIFIED BY 'Aayush@456';"
# Set MySQL user authentication method
sudo mysql -e "ALTER USER 'aayush'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Aayush@456';"
# Grant all privileges on all databases to 'aayush'
sudo mysql -e "GRANT ALL PRIVILEGES ON *.* TO 'aayush'@'localhost' WITH GRANT OPTION;"

# Create the database
sudo mysql -e "CREATE DATABASE HealthChecker;"

# Flush privileges
sudo mysql -e "FLUSH PRIVILEGES;"

# Verify installations
node -v
mysql --version