# Railway Deployment Guide

This guide will help you deploy the Legal Due Diligence Platform to Railway.

## Prerequisites

1. A [Railway](https://railway.app) account (sign up for free)
2. Your GitHub repository connected to Railway
3. Basic familiarity with environment variables

## Deployment Steps

### Step 1: Create a New Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository (`claude-test`)

### Step 2: Add Services

Railway will automatically detect your services, but you need to add databases:

#### Add PostgreSQL
1. Click **"+ New"** in your project
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically provision and configure the database

#### Add Redis
1. Click **"+ New"** in your project
2. Select **"Database"** → **"Add Redis"**
3. Railway will automatically provision and configure Redis

### Step 3: Configure Backend Service

1. Click on your **backend** service
2. Go to **"Variables"** tab
3. Add the following environment variables:

```bash
# Application
NODE_ENV=production
PORT=3001

# Frontend URL (will update after frontend deployment)
FRONTEND_URL=https://your-frontend-url.railway.app

# Database (automatically set by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (automatically set by Railway)
REDIS_URL=${{Redis.REDIS_URL}}

# Authentication (CHANGE THESE!)
JWT_SECRET=your-strong-jwt-secret-here-change-me
JWT_REFRESH_SECRET=your-strong-refresh-secret-here-change-me
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# AI Services
ANTHROPIC_API_KEY=your-anthropic-api-key

# Storage (use Railway volumes or external S3)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=legaldd-documents-prod

# Logging
LOG_LEVEL=info
```

4. Go to **"Settings"** tab
5. Set **"Root Directory"** to `backend`
6. Set **"Start Command"** to `npm run start:migrate` (already configured)
7. Click **"Deploy"**

### Step 4: Configure Frontend Service

1. Click on your **frontend** service
2. Go to **"Variables"** tab
3. Add the following environment variables:

```bash
# API URL (use your backend Railway URL)
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api

NODE_ENV=production
```

4. Go to **"Settings"** tab
5. Set **"Root Directory"** to `frontend`
6. Click **"Deploy"**

### Step 5: Update CORS Settings

After both services are deployed:

1. Get your frontend URL from Railway (e.g., `https://your-app.railway.app`)
2. Update the backend **FRONTEND_URL** variable with your actual frontend URL
3. Redeploy the backend service

### Step 6: Generate Domain URLs (Optional)

Railway provides default domains, but you can add custom domains:

1. Go to **"Settings"** → **"Domains"**
2. Click **"Generate Domain"** for a Railway subdomain
3. Or click **"Custom Domain"** to use your own domain

## Post-Deployment

### Verify Deployment

1. **Backend Health Check**: Visit `https://your-backend-url.railway.app/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

2. **Frontend**: Visit `https://your-frontend-url.railway.app`
   - Should see the landing page

3. **Login with Demo User**:
   - Email: `admin@legaldd.demo`
   - Password: `Demo123!`

### Monitor Logs

- Click on each service to view real-time logs
- Check for any errors during startup
- Verify database migrations ran successfully

### Database Management

To access your database:

1. Click on the **PostgreSQL** service
2. Go to **"Data"** tab to browse tables
3. Or use **"Connect"** tab to get connection details for external tools

## Troubleshooting

### Database Connection Errors

**Problem**: Backend fails to connect to database

**Solution**:
- Verify `DATABASE_URL` is set correctly
- Check PostgreSQL service is running
- Look at backend logs for specific error messages

### Migration Failures

**Problem**: Prisma migrations fail on startup

**Solution**:
```bash
# Connect to Railway CLI
railway login
railway link

# Run migrations manually
railway run --service backend npm run migrate:prod
```

### Redis Connection Issues

**Problem**: Redis connection errors

**Solution**:
- Verify `REDIS_URL` is set correctly
- Check Redis service is running
- Redis is optional for MVP, can be removed temporarily

### Build Failures

**Problem**: Build fails with TypeScript errors

**Solution**:
- Check logs for specific errors
- Verify all dependencies are in `package.json`
- Ensure TypeScript configuration is correct

### Environment Variables Not Loading

**Problem**: App can't read environment variables

**Solution**:
- Redeploy the service after adding variables
- Check variable names match exactly (case-sensitive)
- Verify Railway references like `${{Postgres.DATABASE_URL}}` are correct

## Scaling

### Vertical Scaling (More Resources)
1. Go to service **"Settings"**
2. Click **"Change Plan"**
3. Select a higher tier for more CPU/RAM

### Horizontal Scaling (More Instances)
1. Update `railway.json`:
```json
{
  "deploy": {
    "numReplicas": 3
  }
}
```
2. Commit and push changes

## Cost Optimization

Railway free tier includes:
- $5 free credit per month
- Automatic sleep after inactivity
- Pay-as-you-go pricing

**Tips to reduce costs**:
- Use Railway volumes instead of S3 for development
- Enable auto-sleep for non-production environments
- Monitor usage in Railway dashboard

## Security Best Practices

### 1. Rotate Secrets
```bash
# Generate strong secrets
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For JWT_REFRESH_SECRET
```

### 2. Use Railway Secret Management
- Never commit secrets to Git
- Use Railway's variable management
- Enable "Variable Encryption" in settings

### 3. Set Up Domain SSL
- Railway provides automatic SSL for all domains
- Verify HTTPS is working before going live

### 4. Database Backups
- Railway automatically backs up PostgreSQL
- Enable point-in-time recovery in PostgreSQL settings
- Consider periodic manual backups for critical data

## CI/CD Setup

Railway automatically deploys on git push. To customize:

### Create `.railway.toml` in project root:
```toml
[build]
builder = "nixpacks"
buildCommand = "echo 'Building...'"

[deploy]
startCommand = "echo 'Starting...'"
healthcheckPath = "/health"
healthcheckTimeout = 30
restartPolicyType = "ON_FAILURE"
```

## Monitoring and Alerts

### Set Up Uptime Monitoring
1. Use [UptimeRobot](https://uptimerobot.com) (free)
2. Monitor your `/health` endpoint
3. Get alerts via email/SMS

### Application Monitoring
Consider adding:
- Sentry for error tracking
- LogDNA for log aggregation
- DataDog for APM (application performance monitoring)

## Alternative: Deploy Each Service Separately

If you want more control:

### Backend Only
1. Create new Railway project
2. Add PostgreSQL and Redis
3. Point to `backend` directory
4. Set environment variables
5. Deploy

### Frontend Only
1. Create separate Railway project (or use Vercel)
2. Set `NEXT_PUBLIC_API_URL` to backend URL
3. Deploy

## Migrate from Railway

If you need to migrate later:

1. **Export Database**: Use `pg_dump` with Railway connection details
2. **Export Environment Variables**: Download from Railway dashboard
3. **Deploy to new platform**: Follow their migration guides

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app

## Next Steps

After successful deployment:

1. Test all features thoroughly
2. Set up monitoring and alerts
3. Configure custom domain (optional)
4. Set up CI/CD workflows
5. Document your deployment process
6. Train your team on the platform

---

**Deployed successfully?** Update your README.md with the live URLs!

**Need help?** Check Railway logs first, then consult this guide.
