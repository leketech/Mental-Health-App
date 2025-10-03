variable "region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t3.medium"
}

variable "certificate_arn" {
  description = "ARN of the SSL certificate for HTTPS"
  type        = string
  default     = ""
  validation {
    condition     = var.certificate_arn == "" || length(regexall("^arn:aws:acm:", var.certificate_arn)) > 0
    error_message = "Certificate ARN must be empty or a valid AWS ACM ARN starting with 'arn:aws:acm:'."
  }
}

variable "db_username" {
  description = "Database username"
  default     = "mental_user"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Database name"
  default     = "mental_db"
  type        = string
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

variable "cors_origin" {
  description = "CORS origin for the application"
  default     = "https://yourdomain.com"
  type        = string
}

variable "environment" {
  description = "Environment name"
  default     = "production"
  type        = string
}

variable "domain_name" {
  description = "Custom domain name for the application"
  type        = string
  default     = ""
  validation {
    condition     = var.domain_name == "" || can(regex("^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\\.[a-zA-Z]{2,}$", var.domain_name))
    error_message = "Domain name must be empty or a valid domain format (e.g., example.com)."
  }
}

variable "create_route53_records" {
  description = "Whether to create Route 53 records"
  type        = bool
  default     = false
}

variable "ec2_instance_type" {
  description = "EC2 instance type for direct deployment"
  default     = "t3.small"
}

variable "ec2_key_name" {
  description = "EC2 key pair name for SSH access"
  type        = string
  default     = ""
}

variable "deploy_to_ec2" {
  description = "Whether to deploy to EC2 instances"
  type        = bool
  default     = false
}

variable "deploy_to_elastic_beanstalk" {
  description = "Whether to deploy to Elastic Beanstalk"
  type        = bool
  default     = false
}

variable "eb_application_name" {
  description = "Elastic Beanstalk application name"
  default     = "mental-health-app"
}

variable "eb_environment_name" {
  description = "Elastic Beanstalk environment name"
  default     = "mental-health-app-prod"
}

variable "use_lets_encrypt" {
  description = "Whether to use Let's Encrypt for SSL certificates"
  type        = bool
  default     = false
}

variable "lets_encrypt_email" {
  description = "Email address for Let's Encrypt registration"
  type        = string
  default     = ""
}