# Backend Database Connection Fix

## Issue
Registration is failing with a 500 error when accessing:
```
http://mental-health-app-alb-1932297227.us-east-1.elb.amazonaws.com/register
```

## Root Cause
The backend application was not properly connecting to the RDS database because the database connection code was looking for the wrong environment variables. The ECS task definition was passing the correct environment variables:
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

But the Go application code was looking for different environment variables like:
- `RAILWAY_POSTGRES_HOST`
- `PGHOST`
- etc.

This caused the application to default to trying to connect to a host named "db" which doesn't exist in the ECS environment.

## Solution
Updated the database connection code in [mentalhealthwebapp/config/db.go](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/mentalhealthwebapp/config/db.go) to check for the correct environment variables first:
- Check `DB_HOST` before `RAILWAY_POSTGRES_HOST` and `PGHOST`
- Check `DB_PORT` before `RAILWAY_POSTGRES_PORT` and `PGPORT`
- Check `DB_USER` before `RAILWAY_POSTGRES_USER` and `PGUSER`
- Check `DB_PASSWORD` before `RAILWAY_POSTGRES_PASSWORD` and `PGPASSWORD`
- Check `DB_NAME` before `RAILWAY_POSTGRES_DATABASE` and `PGDATABASE`

## Verification Steps
1. Rebuild the backend Docker image:
   ```bash
   docker build -t mental-health-backend-test -f ./mentalhealthwebapp/Dockerfile ./mentalhealthwebapp
   ```

2. Push the updated image to ECR:
   ```bash
   ./deploy-aws.sh
   ```

3. Force a new deployment of the ECS service:
   ```bash
   aws ecs update-service --cluster mental-health-app-cluster --service mental-health-app-service --force-new-deployment
   ```

4. Monitor the service events:
   ```bash
   aws ecs describe-services --cluster mental-health-app-cluster --services mental-health-app-service --query 'services[0].events'
   ```

5. Check CloudWatch logs for database connection success:
   ```bash
   aws logs tail /ecs/mental-health-app --follow
   ```

## Prevention
To avoid similar issues in the future:
1. Ensure environment variable names are consistent between infrastructure code (Terraform) and application code
2. Test database connections in application startup
3. Add more detailed logging for connection failures
4. Use the same environment variable names across different deployment platforms

This fix should resolve the 500 error by allowing the backend application to properly connect to the RDS database.