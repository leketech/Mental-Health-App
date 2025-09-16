# Complete Render Deployment Checklist

This checklist ensures all steps are completed for successful deployment of the UnwindMind application on Render.

## Pre-deployment Verification

- [ ] Verify all code changes are committed and pushed to the repository
- [ ] Check that [render.yaml](render.yaml) is properly configured with the correct DATABASE_URL
- [ ] Verify [Dockerfile.backend](mentalhealthwebapp/Dockerfile.backend) builds correctly
- [ ] Confirm [frontend/Dockerfile](frontend/Dockerfile) builds correctly
- [ ] Review [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) documentation
- [ ] Review [DEPLOYMENT_ARCHITECTURE_RENDER.md](DEPLOYMENT_ARCHITECTURE_RENDER.md) for understanding of the deployment architecture

## Required Environment Variables

### Backend Web Service

The following environment variables must be set in the Render dashboard for the backend service:

- [ ] `JWT_SECRET` - A random string at least 32 characters long for JWT token signing
- [ ] `CORS_ORIGIN` - `https://unwindmind-frontend.onrender.com` (or your custom domain)
- [ ] `DATABASE_URL` - `postgresql://postgres_w55i_user:X2Ql4NcLRRmdDcEq31o4K5qhsclQHToh@dpg-d33fa3odl3ps738rcem0-a.oregon-postgres.render.com/postgres_w55i`
- [ ] `PORT` - `8080`
- [ ] `OPENAI_API_KEY` - Your OpenAI API key for chat functionality (set securely through Render dashboard)

### Frontend Static Site

The following environment variables must be set in the Render dashboard for the frontend service:

- [ ] `REACT_APP_API_URL` - The URL of your backend service (e.g., `https://unwindmind-backend.onrender.com`)

## Deployment Steps

### 1. Database Service

- [ ] Verify the existing Render PostgreSQL database is accessible
- [ ] Confirm the connection string is correct:
  `postgresql://postgres_w55i_user:X2Ql4NcLRRmdDcEq31o4K5qhsclQHToh@dpg-d33fa3odl3ps738rcem0-a.oregon-postgres.render.com/postgres_w55i`

### 2. Backend Web Service

- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Name: `unwindmind-backend`
- [ ] Root Directory: `mentalhealthwebapp`
- [ ] Environment: `Docker`
- [ ] Dockerfile Path: `Dockerfile.backend`
- [ ] Environment Variables (as listed above)
- [ ] Health Check Path: `/health`
- [ ] Deploy and verify service starts correctly

### 3. Frontend Static Site

- [ ] Create new Static Site on Render
- [ ] Connect GitHub repository
- [ ] Name: `unwindmind-frontend`
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm run build`
- [ ] Publish Directory: `build`
- [ ] Environment Variables (as listed above)
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
- [ ] Test AI chat functionality (if OPENAI_API_KEY is set)
- [ ] Verify health check endpoints for both services
- [ ] Test database connectivity and data persistence

## Security Best Practices

### API Key Management
- [ ] Set OPENAI_API_KEY and other secrets through the Render dashboard
- [ ] Never hardcode API keys in configuration files that are committed to version control
- [ ] Ensure sensitive environment variables have "Sync" disabled in Render

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
- [ ] Review and optimize resource usage
- [ ] Plan for scaling requirements

## Troubleshooting

If deployment fails:

1. Check build logs for specific error messages
2. Verify all environment variables are correctly set
3. Ensure the database connection string is correct
4. Check that the JWT_SECRET is properly configured (at least 32 characters)
5. Verify CORS settings match the frontend domain
6. Confirm the PORT environment variable is set to 8080
7. Check that the OpenAI API key is valid (if using chat functionality)

## Rollback Plan

If issues occur after deployment:

1. Revert to previous working commit
2. Redeploy services using known good configuration
3. Monitor services for stability after rollback

## Success Criteria

- [ ] Frontend loads without errors
- [ ] User can register and login successfully
- [ ] All API endpoints respond correctly
- [ ] Database operations work as expected
- [ ] AI chat functionality is operational (if enabled)
- [ ] Health checks pass for both services
- [ ] Performance meets acceptable standards

## Common Issues and Solutions

### Database Connection Issues
- Verify the DATABASE_URL format is correct
- Ensure the database is accessible from the backend service
- Check that credentials are valid

### JWT Secret Issues
- Ensure JWT_SECRET is at least 32 characters long
- Generate a new secure secret if needed

### CORS Issues
- Verify CORS_ORIGIN matches the frontend domain
- Check that the frontend is making requests to the correct backend URL

### Health Check Failures
- Check logs for specific error messages
- Verify all required services are running
- Ensure proper port configuration

### Build Failures
- Check that all dependencies are properly declared
- Verify Dockerfile paths are correct
- Ensure build commands work locally

### Chat Functionality Issues
- Verify the OPENAI_API_KEY is correctly set through Render dashboard
- Check that the key has not expired
- Ensure the OpenAI API is accessible from the backend service