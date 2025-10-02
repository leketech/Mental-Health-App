# EC2 instance configuration for direct Nginx deployment

# EC2 variables
# Variable declarations moved to variables.tf to avoid duplication

# Security group for EC2 instances
resource "aws_security_group" "ec2" {
  count       = var.deploy_to_ec2 ? 1 : 0
  name        = "mental-health-app-ec2-sg"
  description = "Security group for EC2 instances"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "mental-health-app-ec2-sg"
  }
}

# EC2 instance with Nginx
resource "aws_instance" "app" {
  count                       = var.deploy_to_ec2 ? 1 : 0
  ami                         = "ami-0aa2b7722dc1b5612" # Amazon Linux 2
  instance_type               = var.ec2_instance_type
  key_name                    = var.ec2_key_name != "" ? var.ec2_key_name : null
  vpc_security_group_ids      = [aws_security_group.ec2[0].id]
  subnet_id                   = aws_subnet.public[0].id
  associate_public_ip_address = true

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              amazon-linux-extras install nginx1 -y
              systemctl start nginx
              systemctl enable nginx
              
              # Install Docker
              amazon-linux-extras install docker -y
              systemctl start docker
              systemctl enable docker
              usermod -a -G docker ec2-user
              
              # Install Docker Compose
              curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              chmod +x /usr/local/bin/docker-compose
              
              # Create nginx config directory
              mkdir -p /etc/nginx/conf.d
              
              # Pull and run the application
              # (This would be customized based on your deployment needs)
              EOF

  tags = {
    Name = "mental-health-app-ec2"
  }
}

# Elastic IP for EC2 instance
resource "aws_eip" "ec2" {
  count    = var.deploy_to_ec2 ? 1 : 0
  instance = aws_instance.app[0].id
  domain   = "vpc"

  tags = {
    Name = "mental-health-app-ec2-eip"
  }
}