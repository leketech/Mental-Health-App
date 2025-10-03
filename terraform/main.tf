provider "aws" {
  region = var.region
}

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

# VPC for the application
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "mental-health-app-vpc"
  }
}

# Public subnets
resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "mental-health-app-public-${count.index}"
  }
}

# Private subnets for database
resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index + 2)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "mental-health-app-private-${count.index}"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "mental-health-app-igw"
  }
}

# Route table for public subnets
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "mental-health-app-public-rt"
  }
}

# Associate public subnets with route table
resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Security group for the application load balancer
resource "aws_security_group" "alb" {
  name        = "mental-health-app-alb-sg"
  description = "Security group for ALB"
  vpc_id      = aws_vpc.main.id

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
    Name = "mental-health-app-alb-sg"
  }
}

# Security group for ECS tasks
resource "aws_security_group" "ecs" {
  name        = "mental-health-app-ecs-sg"
  description = "Security group for ECS tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "mental-health-app-ecs-sg"
  }
}

# Security group for RDS
resource "aws_security_group" "rds" {
  name        = "mental-health-app-rds-sg"
  description = "Security group for RDS instance"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "mental-health-app-rds-sg"
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "mental-health-app-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = false

  tags = {
    Name = "mental-health-app-alb"
  }
}

# Target group for frontend
resource "aws_lb_target_group" "frontend" {
  name        = "mental-health-app-frontend-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }

  tags = {
    Name = "mental-health-app-frontend-tg"
  }
}

# Target group for backend
resource "aws_lb_target_group" "backend" {
  name        = "mental-health-app-backend-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }

  tags = {
    Name = "mental-health-app-backend-tg"
  }
}

# HTTP listener for ALB (only created if no domain name is specified)
resource "aws_lb_listener" "http" {
  count             = var.domain_name == "" ? 1 : 0
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

# HTTP listener rule for backend API (only created if no domain name is specified)
resource "aws_lb_listener_rule" "http_backend" {
  count        = var.domain_name == "" ? 1 : 0
  listener_arn = aws_lb_listener.http[0].arn
  priority     = 200

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

# HTTPS listener for ALB (created only if certificate_arn is provided and valid, and no domain name is specified)
resource "aws_lb_listener" "https" {
  count             = var.certificate_arn != "" && var.domain_name == "" ? 1 : 0
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

# Listener rule for frontend (created only if HTTPS listener exists and no domain name is specified)
resource "aws_lb_listener_rule" "frontend" {
  count        = var.certificate_arn != "" && var.domain_name == "" ? 1 : 0
  listener_arn = aws_lb_listener.https[0].arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}

# Listener rule for backend API (created only if HTTPS listener exists and no domain name is specified)
resource "aws_lb_listener_rule" "backend" {
  count        = var.certificate_arn != "" && var.domain_name == "" ? 1 : 0
  listener_arn = aws_lb_listener.https[0].arn
  priority     = 200

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "mental-health-app-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "mental-health-app-cluster"
  }
}

# ECR repositories for Docker images
resource "aws_ecr_repository" "frontend" {
  name = "mental-health-app-frontend"

  tags = {
    Name = "mental-health-app-frontend"
  }
}

resource "aws_ecr_repository" "backend" {
  name = "mental-health-app-backend"

  tags = {
    Name = "mental-health-app-backend"
  }
}

# CloudWatch log group for ECS
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/mental-health-app"
  retention_in_days = 30

  tags = {
    Name = "mental-health-app-ecs-logs"
  }
}

# Validation to ensure proper SSL configuration
locals {
  # If domain_name is set, either certificate_arn or use_lets_encrypt must be true
  validate_ssl_config = var.domain_name != "" ? (var.certificate_arn != "" || var.use_lets_encrypt) : true
  # If certificate_arn is provided, it should look like a valid ARN
  validate_certificate_arn = var.certificate_arn != "" ? length(regexall("^arn:aws:acm:", var.certificate_arn)) > 0 : true
  # If domain_name is provided, it should be a valid domain format
  validate_domain_name = var.domain_name != "" ? length(regexall("^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\\.[a-zA-Z]{2,}$", var.domain_name)) > 0 : true
}

# Data source to get available AZs
data "aws_availability_zones" "available" {
  state = "available"
}
