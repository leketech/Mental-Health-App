# Elastic Beanstalk configuration

# Elastic Beanstalk variables
# Variable declarations moved to variables.tf to avoid duplication

# Elastic Beanstalk application
resource "aws_elastic_beanstalk_application" "app" {
  count       = var.deploy_to_elastic_beanstalk ? 1 : 0
  name        = var.eb_application_name
  description = "Mental Health App"

  tags = {
    Name = "mental-health-app"
  }
}

# Elastic Beanstalk application version
resource "aws_elastic_beanstalk_application_version" "app" {
  count       = var.deploy_to_elastic_beanstalk ? 1 : 0
  name        = "mental-health-app-v1"
  application = aws_elastic_beanstalk_application.app[0].name
  description = "Application version created by Terraform"
  bucket      = aws_s3_bucket.app_static.id
  key         = "mental-health-app-v1.zip"

  depends_on = [
    aws_s3_bucket.app_static
  ]
}

# Elastic Beanstalk environment
resource "aws_elastic_beanstalk_environment" "app" {
  count       = var.deploy_to_elastic_beanstalk ? 1 : 0
  name        = var.eb_environment_name
  application = aws_elastic_beanstalk_application.app[0].name
  solution_stack_name = "64bit Amazon Linux 2 v3.4.0 running Docker"

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = aws_vpc.main.id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", aws_subnet.public[*].id)
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "AssociatePublicIpAddress"
    value     = "true"
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MinSize"
    value     = "2"
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = "4"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "LoadBalanced"
  }

  setting {
    namespace = "aws:elasticbeanstalk:healthreporting:system"
    name      = "SystemType"
    value     = "enhanced"
  }

  tags = {
    Name = "mental-health-app-env"
  }
}