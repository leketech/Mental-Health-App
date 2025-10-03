# AWS Certificate Manager Configuration
# This file manages SSL certificates for the application

# Fetch the issued certificate from AWS Certificate Manager
data "aws_acm_certificate" "issued" {
  domain   = var.domain_name != "" ? var.domain_name : "unwindmind.life"
  statuses = ["ISSUED"]
  most_recent = true
}

# HTTPS Listener using the fetched certificate
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  protocol          = "HTTPS"
  port              = 443
  certificate_arn   = data.aws_acm_certificate.issued.arn
  ssl_policy        = "ELBSecurityPolicy-2016-08"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

# Redirect HTTP → HTTPS
resource "aws_lb_listener" "http_redirect" {
  load_balancer_arn = aws_lb.main.arn
  protocol          = "HTTP"
  port              = 80

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# Listener rules for HTTPS traffic
resource "aws_lb_listener_rule" "https_frontend" {
  listener_arn = aws_lb_listener.https.arn
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

resource "aws_lb_listener_rule" "https_backend" {
  listener_arn = aws_lb_listener.https.arn
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