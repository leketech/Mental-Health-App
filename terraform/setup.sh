#!/bin/bash

# Setup script for Terraform deployment

echo "Setting up Terraform environment..."

# Check if terraform.tfvars exists
if [ ! -f "terraform.tfvars" ]; then
    echo "Creating terraform.tfvars from example..."
    cp terraform.tfvars.example terraform.tfvars
    echo "✅ terraform.tfvars created"
else
    echo "✅ terraform.tfvars already exists"
fi

echo ""
echo "📝 Required variables to set in terraform.tfvars:"
echo "  - db_password: Database password for PostgreSQL (CHANGE FROM DEFAULT)"
echo "  - jwt_secret: Secret key for JWT token generation (CHANGE FROM DEFAULT)"
echo ""
echo "🌐 Optional variables for HTTPS:"
echo "  - certificate_arn: ARN of SSL certificate in ACM (for HTTPS with ACM)"
echo "  - domain_name: Your custom domain (if using Route 53 or Let's Encrypt)"
echo "  - use_lets_encrypt: Set to true for Let's Encrypt certificates"
echo "  - lets_encrypt_email: Email for Let's Encrypt registration"
echo ""
echo "🔧 To deploy:"
echo "  1. Edit terraform.tfvars with your values"
echo "  2. Run: terraform init"
echo "  3. Run: terraform validate"
echo "  4. Run: terraform plan"
echo "  5. Run: terraform apply"
echo ""
echo "📝 Note: For HTTP-only deployment, leave certificate_arn empty."
echo "         For HTTPS deployment, provide a valid certificate ARN or"
echo "         set use_lets_encrypt=true with domain_name configured."