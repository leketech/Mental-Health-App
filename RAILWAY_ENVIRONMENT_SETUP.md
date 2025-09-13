# Railway Environment Variables Setup

## Fixed Issues
✅ **Database Connection**: Updated code to use Railway's `DATABASE_URL` environment variable  
✅ **JWT Secret**: Added fallback to prevent startup failures  
✅ **Environment Handling**: Improved error handling for missing variables  

## Required Environment Variables

### 1. Database (Automatic)
Railway automatically provides PostgreSQL database connection:
- `DATABASE_URL` - Automatically set by Railway when you add a PostgreSQL service
- **No manual configuration needed** - Railway handles this automatically

### 2. JWT Authentication (Required)
Set this in your Railway project:
- `JWT_SECRET` - Secret key for JWT token signing

### 3. AI Chat (Optional)
For AI chat functionality:
- `OPENAI_API_KEY` - Your OpenAI API key

### 4. CORS (Optional)
For frontend access:
- `CORS_ORIGIN` - Frontend URL (e.g., `https://your-frontend.com`)

## How to Set Environment Variables in Railway

### Method 1: Railway Dashboard
1. Go to your Railway dashboard
2. Select your project
3. Click on your backend service
4. Go to **Variables** tab
5. Click **+ New Variable**
6. Add the required variables:

```
Variable Name: JWT_SECRET
Variable Value: your-super-secret-jwt-key-minimum-32-characters-long

Variable Name: OPENAI_API_KEY  
Variable Value: sk-your-openai-api-key-here

Variable Name: CORS_ORIGIN
Variable Value: https://your-frontend-domain.com
```

### Method 2: Railway CLI
```bash
# Set JWT secret
railway variables --set JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"

# Set OpenAI API key
railway variables --set OPENAI_API_KEY="sk-your-openai-api-key-here"

# Set CORS origin
railway variables --set CORS_ORIGIN="https://your-frontend-domain.com"
```

## Generate Secure JWT Secret

Use one of these methods to generate a secure JWT secret:

### Option 1: OpenSSL
```bash
openssl rand -base64 32
```

### Option 2: Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Option 3: Online Generator
Visit: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
- Select "Encryption Key"
- Choose "256-bit"
- Click "Generate"

## Database Setup

### Automatic Setup (Recommended)
Railway automatically:
1. **Provides PostgreSQL service** when you add a database
2. **Sets DATABASE_URL** environment variable
3. **Handles connection string** formatting
4. **Manages database credentials**

### Manual Database Connection (If Needed)
If you need to connect to an external database:
```
DATABASE_URL=postgres://username:password@host:port/database_name?sslmode=require
```

## Verification

### Check Logs
After setting variables, check your Railway deployment logs:
```
✅ Starting UnwindMind API Server...
✅ Go version: go1.22.12
⚠️ .env file not found, using system env
✅ Database connected
✅ Database migrations completed
✅ Server starting on port 10000
```

### Test Health Endpoint
```bash
curl https://your-service-name.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "UnwindMind API",
  "version": "1.0.0",
  "port": "10000"
}
```

## Common Issues & Solutions

### Issue: "sql: connection is already closed"
**Solution**: Database environment variable not set
- Add PostgreSQL service in Railway dashboard
- Verify `DATABASE_URL` is automatically set

### Issue: "JWT_SECRET is not set"
**Solution**: Add JWT secret environment variable
```bash
railway variables --set JWT_SECRET="your-secure-secret-here"
```

### Issue: CORS errors from frontend
**Solution**: Set CORS_ORIGIN to your frontend URL
```bash
railway variables --set CORS_ORIGIN="https://your-frontend.com"
```

## Security Best Practices

1. **Use strong JWT secrets** (minimum 32 characters)
2. **Never commit secrets** to version control
3. **Rotate secrets regularly** in production
4. **Use Railway's secret management** for sensitive values
5. **Set CORS_ORIGIN** to specific domains in production (not "*")

## Next Steps

1. ✅ Set required environment variables in Railway
2. ✅ Deploy the updated code
3. ✅ Test the health endpoint
4. ✅ Verify database connectivity
5. ✅ Test authentication endpoints

Your Railway deployment should now work correctly with proper environment variable configuration! 🚀