cat > terraform/ec2-rds-s3.tf << 'EOF'
resource "aws_rds_cluster" "mental_db" {
  cluster_identifier = "mental-health-db"
  engine             = "postgres"
  master_username    = "mental_user"
  master_password    = "mental_pass"
  db_subnet_group_name = "default"
  skip_final_snapshot = true
}

resource "aws_s3_bucket" "app_static" {
  bucket = "mental-health-app-static"
  acl    = "private"
}
EOF