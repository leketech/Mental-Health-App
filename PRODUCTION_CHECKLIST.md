# 🚀 Production Deployment Checklist

## ✅ **CRITICAL SECURITY REQUIREMENTS**

### **Environment Variables (REQUIRED)**
- [ ] `JWT_SECRET` - **MUST be 32+ characters, cryptographically secure**
- [ ] `DATABASE_URL` - Railway PostgreSQL connection string
- [ ] `CORS_ORIGIN` - **MUST be your exact frontend domain, never \"*\"**
- [ ] `NODE_ENV=production` or `ENV=production`
- [ ] `PORT` - Set to `${{RAILWAY_PORT}}` for Railway

### **Security Validations**
- [ ] JWT secret is minimum 32 characters
- [ ] CORS is restricted to your domain only
- [ ] No hardcoded passwords in code
- [ ] Database credentials are environment variables only
- [ ] All secrets are in Railway environment variables (never in code)

## 🗄️ **Database Setup**

### **Railway PostgreSQL**
- [ ] PostgreSQL service added to Railway project
- [ ] `DATABASE_URL` automatically set by Railway
- [ ] Database migrations run automatically on startup
- [ ] Connection tested via `/health` endpoint

### **Database Tables Created Automatically**
- [ ] `users` - User accounts
- [ ] `moods` - Mood tracking entries
- [ ] `journals` - Journal entries
- [ ] `refresh_tokens` - JWT refresh tokens
- [ ] `blacklisted_tokens` - Revoked tokens

## 🌐 **Frontend Configuration**

### **Domain Setup**
- [ ] Frontend deployed to `https://www.unwindmind.life`
- [ ] Backend CORS_ORIGIN set to frontend domain
- [ ] Frontend API_URL points to Railway backend
- [ ] SSL certificates working (HTTPS only)

## 🚂 **Railway Deployment**

### **Required Environment Variables**
```bash
# CRITICAL: Set these in Railway dashboard
DATABASE_URL=postgresql://postgres:...
JWT_SECRET=your-32-character-minimum-secret-here
CORS_ORIGIN=https://www.unwindmind.life
NODE_ENV=production
PORT=${{RAILWAY_PORT}}
```

### **Deployment Commands**
```bash
# Using Railway CLI
railway login
railway link [your-project-id]
railway variables set JWT_SECRET=\"your-secure-32-char-secret\"
railway variables set CORS_ORIGIN=\"https://www.unwindmind.life\"
railway variables set NODE_ENV=\"production\"
railway up
```

## 🔍 **Production Verification**

### **Health Checks**
- [ ] `GET /health` returns 200 OK
- [ ] Database connection successful in health check
- [ ] Server binds to correct port
- [ ] CORS headers properly set

### **API Endpoints Testing**
- [ ] `POST /api/register` - User registration
- [ ] `POST /api/login` - User authentication
- [ ] `POST /api/refresh` - Token refresh
- [ ] `POST /api/logout` - User logout
- [ ] `GET /api/moods` - Protected route (requires auth)
- [ ] `POST /api/moods` - Create mood entry

### **Security Testing**
- [ ] JWT tokens required for protected routes
- [ ] Invalid tokens rejected with 401
- [ ] CORS prevents unauthorized domains
- [ ] Passwords properly hashed in database
- [ ] Token blacklisting works on logout

## 📊 **Monitoring & Logs**

### **Railway Monitoring**
- [ ] Application logs visible in Railway dashboard
- [ ] Database connection logs show success
- [ ] No error logs during normal operation
- [ ] Health check endpoint responding

### **Performance Metrics**
- [ ] Response times < 500ms for API calls
- [ ] Database queries optimized
- [ ] Memory usage stable
- [ ] CPU usage within limits

## 🚨 **Common Production Issues**

### **If Deployment Fails**
1. Check Railway logs for error messages
2. Verify all environment variables are set
3. Ensure JWT_SECRET is 32+ characters
4. Confirm DATABASE_URL is correct
5. Check CORS_ORIGIN matches frontend domain

### **If Database Connection Fails**
1. Verify PostgreSQL service is added to Railway
2. Check DATABASE_URL in environment variables
3. Ensure database is running and accessible
4. Review database migration logs

### **If Authentication Fails**
1. Verify JWT_SECRET is set and consistent
2. Check token expiration times
3. Ensure passwords are properly hashed
4. Verify user exists in database

## ✅ **Final Production Checklist**

- [ ] **Security**: All secrets in environment variables
- [ ] **Database**: PostgreSQL connected and migrated
- [ ] **CORS**: Restricted to frontend domain only
- [ ] **JWT**: 32+ character secret configured
- [ ] **Health**: `/health` endpoint returns 200
- [ ] **Logs**: No errors in Railway dashboard
- [ ] **Testing**: All API endpoints working
- [ ] **Frontend**: Successfully connecting to backend
- [ ] **Domain**: HTTPS working correctly
- [ ] **Performance**: Response times acceptable

## 🎉 **Post-Deployment**

1. **Test Complete User Flow**:
   - Register new account
   - Login with credentials
   - Create mood entries
   - Write journal entries
   - Logout successfully

2. **Monitor for 24 Hours**:
   - Check logs for any errors
   - Monitor response times
   - Verify database performance
   - Test from different devices/locations

3. **Backup Strategy**:
   - Railway automatically backs up PostgreSQL
   - Consider additional backup strategy for critical data
   - Document recovery procedures

**🚀 Your UnwindMind app is now production-ready! 🎊**