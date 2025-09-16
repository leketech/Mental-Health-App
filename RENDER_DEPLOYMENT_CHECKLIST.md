# Render Deployment Checklist

This checklist ensures all steps are completed for successful deployment of the UnwindMind application on Render.

## Pre-deployment Checklist

- [ ] Verify all code changes are committed and pushed to the repository
- [ ] Check that [render.yaml](render.yaml) is properly configured
- [ ] Verify [Dockerfile.backend](mentalhealthwebapp/Dockerfile.backend) builds correctly
- [ ] Confirm [frontend/Dockerfile](frontend/Dockerfile) builds correctly
- [ ] Test the application locally using docker-compose
- [ ] Review [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) documentation

## Deployment Steps

### 1. Database Service

- [ ] Create new PostgreSQL service on Render
- [ ] Name: `unwindmind-db`
- [ ] Database: `mental_db`
- [ ] User: `mental_user`
- [ ] Note the connection information

### 2. Backend Web Service

- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Name: `unwindmind-backend`
- [ ] Root Directory: `mentalhealthwebapp`
- [ ] Environment: `Docker`
- [ ] Dockerfile Path: `Dockerfile.backend`
- [ ] Environment Variables:
  - [ ] `JWT_SECRET` (32+ characters)
  - [ ] `CORS_ORIGIN=https://unwindmind-frontend.onrender.com`
  - [ ] `PORT=8080`
  - [ ] `DATABASE_URL` (from PostgreSQL service)
- [ ] Health Check Path: `/health`
- [ ] Deploy and verify service starts correctly

### 3. Frontend Static Site

- [ ] Create new Static Site on Render
- [ ] Connect GitHub repository
- [ ] Name: `unwindmind-frontend`
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm run build`
- [ ] Publish Directory: `build`
- [ ] Environment Variables:
  - [ ] `REACT_APP_API_URL=https://unwindmind-backend.onrender.com`
- [ ] Routes Configuration:
  ```yaml
  routes:
    - type: rewrite
      source: /*
      destination: /index.html
  ```
- [ ] Deploy and verify site builds correctly

## Post-deployment Verification

- [ ] Test frontend loads correctly
- [ ] Test API endpoints through frontend
- [ ] Test user registration flow
- [ ] Test user login flow
- [ ] Test protected routes (mood tracking, journaling)
- [ ] Test AI chat functionality
- [ ] Verify health check endpoints for both services
- [ ] Test database connectivity and data persistence

## Custom Domain Configuration (Optional)

### Frontend
- [ ] Add custom domain in Render dashboard
- [ ] Configure DNS records as instructed
- [ ] Verify SSL certificate is provisioned

### Backend
- [ ] Add custom domain in Render dashboard
- [ ] Configure DNS records as instructed
- [ ] Verify SSL certificate is provisioned

## Monitoring and Maintenance

- [ ] Set up monitoring alerts for both services
- [ ] Configure log retention policies
- [ ] Set up automated backups for the database
- [ ] Review and optimize resource usage
- [ ] Plan for scaling requirements

## Troubleshooting

If deployment fails:

1. Check build logs for specific error messages
2. Verify all environment variables are correctly set
3. Ensure the database connection string is correct
4. Check that the JWT_SECRET is properly configured
5. Verify CORS settings match the frontend domain
6. Confirm the PORT environment variable is set to 8080

## Rollback Plan

If issues occur after deployment:

1. Revert to previous working commit
2. Redeploy services using known good configuration
3. Restore database from backup if needed
4. Monitor services for stability after rollback

## Success Criteria

- [ ] Frontend loads without errors
- [ ] User can register and login successfully
- [ ] All API endpoints respond correctly
- [ ] Database operations work as expected
- [ ] AI chat functionality is operational
- [ ] Health checks pass for both services
- [ ] Performance meets acceptable standards