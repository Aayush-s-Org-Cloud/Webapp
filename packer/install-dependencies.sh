#!/bin/bash

# Update and upgrade the system
sudo apt-get update -y
sudo apt-get upgrade -y

# Install zip and unzip utilities
sudo apt-get install zip unzip -y

# Install Node.js (latest stable version)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs


# Verify installations
node -v

