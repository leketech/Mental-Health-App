# Let's Encrypt configuration for EC2 instances

# Let's Encrypt variables
# Variable declarations moved to variables.tf to avoid duplication

# IAM policy for Route 53 access (needed for Let's Encrypt DNS validation)
resource "aws_iam_policy" "lets_encrypt_route53" {
  count       = var.use_lets_encrypt && var.create_route53_records ? 1 : 0
  name        = "mental-health-app-lets-encrypt-route53"
  description = "IAM policy for Let's Encrypt Route 53 access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "route53:GetChange",
          "route53:ListHostedZonesByName"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "route53:ChangeResourceRecordSets"
        ]
        Resource = "arn:aws:route53:::hostedzone/*"
      }
    ]
  })
}

# IAM policy attachment for Let's Encrypt
resource "aws_iam_role_policy_attachment" "lets_encrypt_route53" {
  count      = var.use_lets_encrypt && var.create_route53_records ? 1 : 0
  role       = var.deploy_to_ec2 ? aws_iam_role.ec2_role[0].name : aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.lets_encrypt_route53[0].arn
}

# IAM role for EC2 instances (if deploying to EC2)
resource "aws_iam_role" "ec2_role" {
  count = var.deploy_to_ec2 ? 1 : 0
  name  = "mental-health-app-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# IAM instance profile for EC2 instances
resource "aws_iam_instance_profile" "ec2_profile" {
  count = var.deploy_to_ec2 ? 1 : 0
  name  = "mental-health-app-ec2-profile"
  role  = aws_iam_role.ec2_role[0].name
}