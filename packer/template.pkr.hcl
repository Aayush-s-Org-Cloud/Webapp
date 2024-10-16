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
  default = "ami-0cad6ee50670e3d0e"
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

variable "subnet_id" {
  type    = string
  default = "subnet-000265ec69f7365d5"
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

  ami_users = ["084828563934"]
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

  environment_vars = [
      "DATA_USER=${var.DATA_USER}",
      "DATA_PASSWORD=${var.DATA_PASSWORD}",
      "DATA_HOST=var.DATA_HOST",
      "DATA_PORT=${var.DATA_PORT}",
      "DATA_DATABASE=${var.DATA_DATABASE}",
      "PORT=${var.PORT}"
    ]
}

  provisioner "shell" {
    script = "packer/app-setup.sh"
  }

  provisioner "shell" {
    inline = [
      "node --version",
      "mysql --version",
      "echo 'Node.js and MySQL installed, app setup done!'"
    ]
  }
}