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

sudo mysql -e "CREATE USER IF NOT EXISTS '$DATA_USER'@'$DATA_HOST' IDENTIFIED BY '$DATA_PASSWORD';"
 
sudo mysql -e "ALTER USER '$DATA_USER'@'$DATA_HOST' IDENTIFIED WITH mysql_native_password BY '$DATA_PASSWORD';"
 
sudo mysql -e "GRANT ALL PRIVILEGES ON *.* TO '$DATA_USER'@'$DATA_HOST' WITH GRANT OPTION;"

# Create the database
sudo mysql -e "CREATE DATABASE $DATA_DATABASE;"

# Flush privileges
sudo mysql -e "FLUSH PRIVILEGES;"

# Verify installations
node -v
mysql --version
