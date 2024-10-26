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

  # Install CloudWatch Agent
  provisioner "shell" {
    inline = [
      "echo 'Installing CloudWatch Agent...'",
      "sudo apt-get update -y",
      "sudo apt-get install -y amazon-cloudwatch-agent"
    ]
  }

  # Copy CloudWatch Agent configuration file
  provisioner "file" {
    content = <<EOF
{
  "agent": {
    "metrics_collection_interval": 60,
    "run_as_user": "root"
  },
  "metrics": {
    "append_dimensions": {
      "InstanceId": "\${aws:InstanceId}"
    },
    "aggregation_dimensions": [["InstanceId"]],
    "metrics_collected": {
      "mem": {
        "measurement": ["mem_used_percent"],
        "metrics_collection_interval": 60
      },
      "cpu": {
        "measurement": ["cpu_usage_active"],
        "metrics_collection_interval": 60
      }
    }
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/syslog",
            "log_group_name": "/aws/ec2/syslog",
            "log_stream_name": "{instance_id}",
            "timestamp_format": "%b %d %H:%M:%S"
          }
        ]
      }
    }
  }
}
EOF
    destination = "/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json"
  }

  # Enable CloudWatch Agent to start automatically
  provisioner "shell" {
    inline = [
      "sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s",
      "echo 'CloudWatch Agent configured and started'"
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