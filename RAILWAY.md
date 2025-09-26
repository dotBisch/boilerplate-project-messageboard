# Railway Deployment Guide for Anonymous Message Board

## 🚄 Railway Environment Variables

Set these in your Railway dashboard (Settings → Environment Variables):

```env
NODE_ENV=production
DB=mongodb+srv://db_user:dbUserPassword@cluster0.yie1irr.mongodb.net/messageboard?retryWrites=true&w=majority
```

**DO NOT set PORT** - Railway handles this automatically!

## 🔧 MongoDB Atlas Configuration for Railway

1. **IP Whitelist**: Add `0.0.0.0/0` to allow Railway servers
   - Go to Atlas → Network Access
   - Add IP Address → Allow Access from Anywhere
   - This is safe because Railway's network is secure

2. **Database User**: Ensure `db_user` has proper permissions
   - Username: `db_user`
   - Password: `dbUserPassword`
   - Privileges: Read and write to any database

## 🚀 Railway Deployment Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your Railway project
railway link

# Set environment variables
railway variables set NODE_ENV=production
railway variables set DB="mongodb+srv://db_user:dbUserPassword@cluster0.yie1irr.mongodb.net/messageboard?retryWrites=true&w=majority"

# Deploy
railway up
```

## 🔍 Railway Debugging Commands

```bash
# View logs
railway logs

# Check environment variables
railway variables

# Open Railway dashboard
railway open

# Run commands in Railway environment
railway run node railway-debug.js
```

## ⚠️ Common Railway Issues & Solutions

### Issue 1: Database Connection Timeout
**Solution**: Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`

### Issue 2: Environment Variables Not Loading
**Solution**: Use Railway dashboard to set variables, not .env file

### Issue 3: Build Failures
**Solution**: Ensure package.json has correct start script

### Issue 4: Port Issues
**Solution**: Never set PORT manually - let Railway handle it

## ✅ Verification Steps

1. Deploy to Railway
2. Check logs: `railway logs`
3. Test endpoints:
   - GET `https://your-app.railway.app/api/threads/test`
   - POST `https://your-app.railway.app/api/threads/test`