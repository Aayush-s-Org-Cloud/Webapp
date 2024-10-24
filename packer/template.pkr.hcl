packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0, <2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

variable "subnet_id" {
  type    = string
   
}
variable "ami_users" {
  type    = list(string)
   
}
source "amazon-ebs" "ubuntu" {
  region                      = var.aws_region
  source_ami                  = var.source_ami
  instance_type               = "t2.medium"
  ssh_username                = var.ssh_username
  subnet_id                   = var.subnet_id
  ami_name                    = "custom-nodejs-mysql-ami-{{timestamp}}"
  associate_public_ip_address = true

  launch_block_device_mappings {
    device_name           = "/dev/sda1"
    volume_size           = 25
    volume_type           = "gp2"
    delete_on_termination = true
  }

  tags = {
    Name = "Packer-Build-NodeJS-MySQL"
  }

  ami_users                   = var.ami_users
}

build {
  name    = "nodejs-mysql-custom-ami"
  sources = ["source.amazon-ebs.ubuntu"]

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "shell" {
    script = "packer/create-user.sh"
  }

  # Unzip the application
  provisioner "shell" {
    script = "packer/unzip.sh"
  }

  provisioner "shell" {
    script = "packer/install-dependencies.sh"
  }

  provisioner "shell" {
    script = "packer/app-setup.sh"
  }
  provisioner "shell" {
    inline = [
      "if which git > /dev/null; then sudo apt-get remove -y git; fi",
      "echo 'Verified git is not installed'"
    ]
  }
  provisioner "shell" {
    inline = [
      "node --version",
     
      "echo 'Node.js and MySQL installed, app setup done!'"
    ]
  }
}
##