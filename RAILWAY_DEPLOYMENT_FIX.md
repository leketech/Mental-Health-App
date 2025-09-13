# Railway Deployment Fix

## Issue Resolved
Fixed the GitHub Actions deployment error: `Unable to resolve action railwayapp/railway-deploy, repository not found`

## Root Cause
The `railwayapp/railway-deploy` GitHub Action has been deprecated and is no longer available in the GitHub marketplace. This action was previously used in the `deploy-backend.yml` workflow file.

## Solution Applied
Replaced the deprecated action with the official Railway CLI approach:

### Before (Deprecated):
```yaml
- name: Deploy to Railway
  uses: railwayapp/railway-deploy@v2
  with:
    service: unwindmind-api
    environment: production
  env:
    RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### After (Current Best Practice):
```yaml
- name: Install Railway CLI
  run: |
    npm install -g @railway/cli

- name: Deploy to Railway
  run: |
    railway up --service unwindmind-api
  env:
    RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## Benefits of the New Approach
1. **Official Support**: Uses Railway's official CLI tool
2. **Better Reliability**: No dependency on third-party GitHub Actions
3. **More Control**: Direct access to all Railway CLI features
4. **Future-Proof**: Official CLI is actively maintained by Railway

## Required Secrets
Ensure the following secret is configured in your GitHub repository:
- `RAILWAY_TOKEN`: Your Railway project token

## How to Get Railway Token
1. Go to your Railway dashboard
2. Navigate to your project
3. Go to Settings → Tokens
4. Generate a new Project Token
5. Add it to GitHub Secrets as `RAILWAY_TOKEN`

## Files Modified
- `.github/workflows/deploy-backend.yml` - Updated deployment workflow

## Testing
The deployment should now work correctly. The workflow will:
1. Install the Railway CLI
2. Deploy using `railway up --service unwindmind-api`
3. Perform a health check

## Additional Notes
- The Railway CLI approach is more flexible and allows for advanced deployment configurations
- If you need environment-specific deployments, you can use `--environment` flag
- For more CLI options, see: https://docs.railway.com/guides/cli