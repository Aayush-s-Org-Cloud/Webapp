#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e
sudo apt-get update -y
sudo apt-get install unzip -y
sudo mkdir -p /opt/nodeapp
if [ -f /tmp/webapp.zip ]; then
    sudo unzip /tmp/webapp.zip -d /opt/nodeapp
    echo "Unzipped /tmp/webapp.zip to /opt/nodeapp"
else
    echo "Error: /tmp/webapp.zip not found!"
    exit 1
fi
sudo chown -R csye6225:csye6225 /opt/nodeapp
echo "Changed ownership to csye6225 for /opt/nodeapp"
sudo rm /tmp/webapp.zip
echo "Removed /tmp/webapp.zip"
echo "Unzip and setup completed successfully."