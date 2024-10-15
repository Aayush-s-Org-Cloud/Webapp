#!/bin/bash

# Navigate to the app directory
sudo mkdir -p /opt/nodeapp
sudo chown -R csye6225:csye6225 /opt/nodeap

# Navigate to the app directory
cd /opt/nodeapp
if [ -f package.json ]; then
    echo "package.json found. Running npm install..."
    sudo npm install
else
    echo "Error: package.json not found in /opt/nodeapp"
    exit 1
fi

sudo mkdir -p /opt/nodeapp
sudo chown -R csye6225:csye6225 /opt/nodeapp
sudo touch /opt/nodeapp/.env
sudo chmod 664 /opt/nodeapp/.env

# Create the .env file with the required environment variables
sudo tee -a /opt/nodeapp/.env > /dev/null <<EOL
PORT=${PORT}
DATA_DIALECT=${DATA_DIALECT}
DATA_HOST=${DATA_HOST}
DATA_PORT=${DATA_PORT}
DATA_USER=${DATA_USER}
DATA_PASSWORD=${DATA_PASSWORD}
DATA_DATABASE=${DATA_DATABASE}
EOL
sudo chown csye6225:csye6225 /opt/nodeapp/.env
# Set up a systemd service to run your Node.js app
sudo bash -c 'cat > /etc/systemd/system/nodeapp.service <<EOL
[Unit]
Description=Node.js Application
After=network.target

[Service]
ExecStart=/usr/bin/node /opt/nodeapp/Webapp/server.js
Restart=always
User=csye6225
Group=csye6225
EnvironmentFile=/opt/nodeapp/Webapp/.env
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=/opt/nodeapp/Webapp
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=nodeapp
[Install]
WantedBy=multi-user.target
EOL'

# Reload systemd and enable the Node.js service
sudo systemctl daemon-reload
sudo systemctl enable nodeapp
sudo systemctl start nodeapp

# Print service status
sudo systemctl status nodeapp