# 🚀 Quick Railway Deployment

Deploy the Legal Due Diligence Platform to Railway in under 10 minutes.

## One-Click Setup

### 1. Create Railway Account
Visit [railway.app](https://railway.app) and sign up (free tier available).

### 2. Deploy from GitHub

Click the button below or follow manual steps:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

Or manually:
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select this repository
4. Railway will auto-detect backend and frontend

### 3. Add Databases

**PostgreSQL**:
- Click **"+ New"** → **"Database"** → **"PostgreSQL"**
- Railway auto-configures `DATABASE_URL`

**Redis**:
- Click **"+ New"** → **"Database"** → **"Redis"**
- Railway auto-configures `REDIS_URL`

### 4. Configure Environment Variables

#### Backend Service

Click backend service → **Variables** → **Raw Editor** → Paste:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=CHANGE_THIS_SECRET_KEY_TO_SOMETHING_SECURE_32_CHARS
JWT_REFRESH_SECRET=CHANGE_THIS_REFRESH_KEY_TO_SOMETHING_SECURE_32_CHARS
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
ANTHROPIC_API_KEY=your_anthropic_api_key_here
LOG_LEVEL=info
```

**Important**:
- `DATABASE_URL` and `REDIS_URL` are automatically set by Railway
- Generate secure secrets: `openssl rand -base64 32`
- Add your Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

#### Frontend Service

After backend deploys, get its URL, then configure frontend:

```env
NODE_ENV=production
```

**NEXT_PUBLIC_API_URL will be set via Railway's service variables**

### 5. Configure Service Settings

#### Backend
1. Settings → **Root Directory**: `backend`
2. Settings → **Build Command**: (auto-detected)
3. Settings → **Start Command**: `npm run start:migrate`
4. Deploy!

#### Frontend
1. Settings → **Root Directory**: `frontend`
2. Variables → Add: `NEXT_PUBLIC_API_URL` = `https://YOUR_BACKEND_URL.railway.app/api`
3. Deploy!

### 6. Update CORS

Once frontend deploys:
1. Copy frontend URL (e.g., `https://your-app-abc123.railway.app`)
2. Go to backend → Variables
3. Add: `FRONTEND_URL=https://your-app-abc123.railway.app`
4. Redeploy backend

## ✅ Verify Deployment

### Test Backend
```bash
curl https://your-backend-url.railway.app/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Test Frontend
Visit: `https://your-frontend-url.railway.app`

### Login with Demo User
- Email: `admin@legaldd.demo`
- Password: `Demo123!`

## 📋 Service URLs

After deployment, you'll have:
- **Frontend**: `https://your-app-abc123.railway.app`
- **Backend**: `https://your-backend-def456.railway.app`
- **PostgreSQL**: Internal Railway URL
- **Redis**: Internal Railway URL

Save these URLs!

## 🔧 Post-Deployment

### Generate Secure Secrets
```bash
# Generate JWT secrets
openssl rand -base64 32
openssl rand -base64 32
```

Update backend variables with these secrets.

### Optional: Custom Domain
1. Backend service → Settings → Domains → Add Custom Domain
2. Frontend service → Settings → Domains → Add Custom Domain
3. Update DNS records as instructed

## 🐛 Troubleshooting

### Backend won't start
- Check logs: Click backend service → Deployments → View Logs
- Verify `DATABASE_URL` is set
- Confirm migrations ran: Look for "Migration successful" in logs

### Frontend can't reach backend
- Verify `NEXT_PUBLIC_API_URL` includes `/api` at the end
- Check CORS: Backend `FRONTEND_URL` must match frontend domain
- Test backend health endpoint directly

### Database connection errors
- PostgreSQL service must be running
- Check database is in same Railway project
- Verify `DATABASE_URL` format

### "Module not found" errors
- Check `node_modules` are being installed
- Verify `package.json` is present
- Try manual rebuild: Settings → Redeploy

## 💰 Cost

Railway free tier includes:
- **$5 free credit/month**
- **500 hours execution time**
- Perfect for testing and MVP

Estimated usage:
- Backend: ~$3-5/month (hobby plan)
- Frontend: ~$2-3/month
- PostgreSQL: Included
- Redis: Included

## 🔒 Security Checklist

Before going live:
- [ ] Change all default secrets
- [ ] Add Anthropic API key
- [ ] Configure S3 for file storage (or use Railway volumes)
- [ ] Enable HTTPS (automatic with Railway)
- [ ] Set up monitoring (Sentry, LogDNA)
- [ ] Review CORS settings
- [ ] Test all demo user accounts
- [ ] Set up database backups

## 📚 Next Steps

1. **Test Everything**: Try uploading documents, AI analysis, etc.
2. **Configure Storage**: Set up AWS S3 for production document storage
3. **Add Monitoring**: Integrate Sentry for error tracking
4. **Custom Domain**: Add your own domain name
5. **Invite Team**: Share frontend URL with your team

## 🆘 Need Help?

- **Full Guide**: See [RAILWAY_DEPLOYMENT.md](./docs/RAILWAY_DEPLOYMENT.md)
- **API Docs**: See [docs/api/README.md](./docs/api/README.md)
- **Demo Users**: See [docs/DEMO_USERS.md](./docs/DEMO_USERS.md)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)

---

**Deployed successfully?** 🎉

Share your frontend URL and start using the platform!
