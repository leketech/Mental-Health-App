cat > terraform/variables.tf << 'EOF'
variable "region" {
  default = "us-east-1"
}

variable "instance_type" {
  default = "t3.medium"
}
EOF