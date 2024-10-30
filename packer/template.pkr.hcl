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
    "curl -s https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb -o amazon-cloudwatch-agent.deb",
    "sudo dpkg -i -E ./amazon-cloudwatch-agent.deb",
    "sudo touch /var/log/syslog",
    "sudo touch /var/log/application.log",
     "sudo chown csye6225:csye6225 /var/log/application.log", 
      "sudo chown csye6225:csye6225 /var/log/syslog"
  ]
}

provisioner "file" {
  content = <<EOF
{
  "agent": {
    "metrics_collection_interval": 60,
    "run_as_user": "root"
  },
  "metrics": {
    "append_dimensions": {
      "InstanceId": "$${aws:InstanceId}"
    },
    "namespace": "MyAppMetrics",
    "metrics_collected": {
      "statsd": {
        "service_address": ":8125",
        "metrics_collection_interval": 15, 
        "metrics_aggregation_interval": 60
      },
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
          },
          {
            "file_path": "/var/log/amazon-cloudwatch-agent/amazon-cloudwatch-agent.log",
            "log_group_name": "amazon-cloudwatch-agent",
            "log_stream_name": "{instance_id}",
            "timestamp_format": "%b %d %H:%M:%S"
          },
          {
          "file_path": "/var/log/application.log",
          "log_group_name": "MyAppLogs",
          "log_stream_name": "{instance_id}",
          "timestamp_format": "YYYY-MM-DD HH:mm:ss"
        }
        ]
      }
    }
  }
}
EOF
  destination = "/tmp/amazon-cloudwatch-agent.json"
}

# Move the configuration file to the final location with sudo
provisioner "shell" {
  inline = [
    "sudo mkdir -p /opt/aws/amazon-cloudwatch-agent/etc/",
    "sudo mv /tmp/amazon-cloudwatch-agent.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json",
    "echo 'CloudWatch Agent configuration moved to final directory.'",
    "sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s"
  ]
}

  provisioner "shell" {
    inline = [
      "node --version",
     
      "echo 'Node.js and MySQL installed, app setup done!'"
    ]
  }
}
