# AWS ECS Load Balancer Configuration Fix

## Issue
```
Error: creating ECS Service (mental-health-app-service): operation error ECS: CreateService, https response error StatusCode: 400, RequestID: bd39e02f-a0c3-46c4-9d9e-f8c5bdb672f3, InvalidParameterException: The target group with targetGroupArn arn:aws:elasticloadbalancing:us-east-1:907849381252:targetgroup/mental-health-app-frontend-tg/c6c8463c96767a19 does not have an associated load balancer.
```

## Root Cause
The issue was caused by incomplete load balancer configuration for HTTP-only deployments:

1. The HTTP listener was configured with a default action to forward traffic to the frontend target group, but there were no listener rules to handle backend API traffic.
2. The HTTPS listener and its associated rules were only created when a certificate ARN was provided, but the HTTP listener was missing its corresponding rules.
3. The ECS service had dependencies on HTTPS resources that might not exist in HTTP-only deployments.

## Solution
Updated the load balancer configuration to properly handle both HTTP and HTTPS traffic:

### Files Modified
1. `terraform/main.tf`:
   - Modified the HTTP listener to forward traffic to the frontend target group by default
   - Added an HTTP listener rule to forward `/api/*` paths to the backend target group
   - Updated the HTTPS listener to forward traffic to the frontend target group by default (instead of a fixed response)

2. `terraform/ecs.tf`:
   - Updated the ECS service `depends_on` block to include all necessary load balancer resources

## Changes Made

### In `terraform/main.tf`:

1. **HTTP Listener**: Changed from redirect to HTTPS to direct forwarding to frontend target group
2. **HTTP Listener Rule**: Added rule to forward `/api/*` paths to backend target group
3. **HTTPS Listener**: Changed from fixed response to forwarding to frontend target group

### In `terraform/ecs.tf`:

1. **ECS Service Dependencies**: Updated to include all load balancer resources that the service depends on

## Verification
The fix ensures that:
1. Both frontend and backend services are properly associated with the load balancer
2. HTTP traffic is correctly routed to the appropriate services
3. HTTPS traffic (when configured) is also properly routed
4. The ECS service waits for all necessary load balancer resources to be created

## How to Apply
1. Update the `terraform/main.tf` and `terraform/ecs.tf` files with the new configuration
2. Run `terraform init` to initialize the Terraform environment
3. Run `terraform plan` to verify the changes
4. Run `terraform apply` to apply the changes

## Prevention
For future deployments:
1. Ensure that all target groups are properly associated with load balancer listeners or rules
2. Test both HTTP and HTTPS configurations
3. Verify that conditional resources have appropriate dependencies