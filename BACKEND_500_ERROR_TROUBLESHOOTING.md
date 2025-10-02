# Backend 500 Error Troubleshooting Guide

## Issue
Registration is failing with a 500 Internal Server Error when trying to register at:
```
http://mental-health-app-alb-1608930324.us-east-1.elb.amazonaws.com/register
```

## Root Cause Analysis
Based on the CloudWatch logs and infrastructure configuration, the most likely causes are:

1. **Database Connection Issues** - The backend application may not be able to connect to the RDS database
2. **Database Schema Issues** - The required tables may not exist in the database
3. **Environment Variable Issues** - Incorrect database credentials or connection parameters

## Troubleshooting Steps

### 1. Check CloudWatch Logs for Database Errors
```bash
# Check for recent errors in backend logs
aws logs filter-log-events --log-group-name "/ecs/mental-health-app" --filter-pattern "database|error|Error|ERROR|500|register|panic" --start-time $(($(date +%s) - 3600))000
```

### 2. Verify Database Connectivity
```bash
# Get database endpoint
aws rds describe-db-instances --db-instance-identifier mental-health-app-db --query 'DBInstances[0].Endpoint.Address' --output text

# Test if the database is reachable (you'll need to run this from within the VPC or use a bastion host)
# telnet mental-health-app-db.ci9a6emem5ba.us-east-1.rds.amazonaws.com 5432
```

### 3. Check Database Tables
Connect to the database and verify that the required tables exist:
```sql
-- Connect to the database and run these queries:
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check if users table exists
SELECT * FROM users LIMIT 1;

-- Check if other required tables exist
SELECT * FROM moods LIMIT 1;
SELECT * FROM journals LIMIT 1;
SELECT * FROM refresh_tokens LIMIT 1;
SELECT * FROM blacklisted_tokens LIMIT 1;
```

### 4. Verify Environment Variables
Check that the ECS task definition has the correct environment variables:
- DB_HOST: Should be the RDS endpoint
- DB_PORT: Should be 5432
- DB_USER: Should be mental_user
- DB_PASSWORD: Should be the password from terraform.tfvars
- DB_NAME: Should be mental_db

### 5. Test Database Connection Manually
You can test the database connection by running a simple Go program or using psql:
```bash
# Install postgresql client
sudo apt-get install postgresql-client

# Connect to the database (replace with actual values)
psql -h mental-health-app-db.ci9a6emem5ba.us-east-1.rds.amazonaws.com -p 5432 -U mental_user -d mental_db
```

## Solutions

### Solution 1: Force Database Initialization
If the database tables don't exist, you may need to force the application to run the migrations:

1. Check the application logs for migration messages:
   ```bash
   aws logs filter-log-events --log-group-name "/ecs/mental-health-app" --filter-pattern "migration|Migration|database migrations" --start-time $(($(date +%s) - 3600))000
   ```

2. If migrations are failing, you may need to:
   - Check database credentials
   - Ensure the database user has proper permissions
   - Manually create the tables using the init.sql script

### Solution 2: Restart ECS Service
Force a new deployment to ensure the application restarts with proper configuration:
```bash
aws ecs update-service --cluster mental-health-app-cluster --service mental-health-app-service --force-new-deployment
```

### Solution 3: Check Security Groups
Verify that the security groups allow traffic between ECS and RDS:
```bash
# Check ECS security group
aws ec2 describe-security-groups --group-ids sg-xxxxxxxxx

# Check RDS security group
aws ec2 describe-security-groups --group-ids sg-yyyyyyyyy
```

The RDS security group should allow inbound traffic on port 5432 from the ECS security group.

## Prevention
To prevent similar issues in the future:
1. Add more detailed logging in the database connection code
2. Add health checks that verify database connectivity
3. Add monitoring for database connection failures
4. Ensure proper error handling and reporting in the application code