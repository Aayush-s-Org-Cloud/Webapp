#!/bin/bash

# Navigate to the app directory
sudo mkdir -p /opt/nodeapp
sudo chown -R csye6225:csye6225 /opt/nodeapp

# Navigate to the app directory
cd /opt/nodeapp
if [ -f package.json ]; then
    echo "package.json found. Running npm install..."
    sudo npm install
else
    echo "Error: package.json not found in /opt/nodeapp"
    exit 1
fi

 
sudo chmod 664 /opt/nodeapp/.env

sudo chown csye6225:csye6225 /opt/nodeapp/.env
# Set up a systemd service to run your Node.js app
sudo bash -c 'cat > /etc/systemd/system/nodeapp.service <<EOL
[Unit]
Description=Node.js Application
After=network.target

[Service]
ExecStart=/usr/bin/node /opt/nodeapp/server.js
Restart=always
User=csye6225
Group=csye6225
EnvironmentFile=/opt/nodeapp/.env
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=/opt/nodeapp
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