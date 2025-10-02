# Route 53 configuration for custom domain

# Variables for Route 53
# Variable declarations moved to variables.tf to avoid duplication

# Route 53 Zone (use existing zone)
data "aws_route53_zone" "selected" {
  count = var.create_route53_records && var.domain_name != "" ? 1 : 0
  name  = var.domain_name
}

# Route 53 Record for frontend
resource "aws_route53_record" "frontend" {
  count   = var.create_route53_records && var.domain_name != "" ? 1 : 0
  zone_id = data.aws_route53_zone.selected[0].zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

# Route 53 Record for www subdomain
resource "aws_route53_record" "www" {
  count   = var.create_route53_records && var.domain_name != "" ? 1 : 0
  zone_id = data.aws_route53_zone.selected[0].zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}