# RDS Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "mental-health-app-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "mental-health-app-db-subnet-group"
  }
}

# RDS Instance
resource "aws_db_instance" "main" {
  identifier             = "mental-health-app-db"
  instance_class         = "db.t3.micro"
  engine                 = "postgres"
  engine_version         = "15.8"
  allocated_storage      = 20
  storage_type           = "gp2"
  username               = var.db_username
  password               = var.db_password
  db_name                = var.db_name
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  skip_final_snapshot    = true
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  tags = {
    Name = "mental-health-app-db"
  }
}

# S3 Bucket for static assets
resource "aws_s3_bucket" "app_static" {
  bucket = "unwindmind-${random_string.bucket_suffix.result}"

  tags = {
    Name = "mental-health-app-static"
  }
}

# Block public access to S3 bucket
resource "aws_s3_bucket_public_access_block" "app_static" {
  bucket = aws_s3_bucket.app_static.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Bucket Policy
resource "aws_s3_bucket_policy" "app_static" {
  bucket = aws_s3_bucket.app_static.id
  policy = data.aws_iam_policy_document.s3_bucket_policy.json
}

# S3 Bucket Server Side Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "app_static" {
  bucket = aws_s3_bucket.app_static.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Random string for unique bucket name
resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

# IAM policy for S3 bucket
data "aws_iam_policy_document" "s3_bucket_policy" {
  statement {
    sid    = "AllowSSLRequestsOnly"
    effect = "Deny"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "s3:*"
    ]

    resources = [
      "arn:aws:s3:::unwindmind-${random_string.bucket_suffix.result}",
      "arn:aws:s3:::unwindmind-${random_string.bucket_suffix.result}/*"
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}