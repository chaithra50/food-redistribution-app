# Deployment Guide - FoodLink to Heroku

This guide will help you deploy the FoodLink application to Heroku.

## Prerequisites

1. **GitHub Account** - Already set up ✅
2. **Heroku Account** - [Create free account at heroku.com](https://www.heroku.com)
3. **Heroku CLI** - [Download and install](https://devcenter.heroku.com/articles/heroku-cli)
4. **MongoDB Atlas** - Free cloud MongoDB at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)

## Step 1: Set Up MongoDB Atlas

MongoDB localhost won't work on Heroku. You need MongoDB Atlas (cloud).

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user with password
5. Get the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/foodlink?retryWrites=true&w=majority
   ```

## Step 2: Login to Heroku

```bash
heroku login
```

This opens a browser to authenticate.

## Step 3: Create Heroku App

```bash
cd c:\Users\CHAITHRA\OneDrive\Desktop\food_redistribution_app
heroku create foodlink-app
```

Replace `foodlink-app` with a unique name (must be globally unique on Heroku).

## Step 4: Set Environment Variables

```bash
heroku config:set MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/foodlink?retryWrites=true&w=majority"
heroku config:set JWT_SECRET="your_secure_jwt_secret_key"
heroku config:set NODE_ENV="production"
```

## Step 5: Deploy to Heroku

```bash
git push heroku main
```

Heroku will:
1. Install backend dependencies
2. Install frontend dependencies  
3. Build React frontend → `frontend/build/`
4. Start the backend server serving both API and built React app

## Step 6: Monitor Deployment

```bash
heroku logs --tail
```

This shows live logs. Look for:
- ✅ "FoodLink Backend running on port {PORT}"
- ✅ "MongoDB connected successfully"

## Step 7: Open Your App

```bash
heroku open
```

Or visit: `https://your-app-name.herokuapp.com`

## Troubleshooting

**MongoDB Connection Error?**
- Verify MongoDB Atlas connection string is correct
- Make sure your IP is whitelisted in MongoDB Atlas (allow all IPs: 0.0.0.0/0)

**Build Failed?**
```bash
heroku logs --tail
```
Check error messages in logs

**Update/Redeploy?**
```bash
git push heroku main
```

## Using Custom Domain

1. Purchase domain from GoDaddy, Nameheap, etc.
2. In Heroku app settings: Add domain
3. Update DNS settings with Heroku records provided

## Free vs Paid

- **Free Tier**: Apps sleep after 30 mins of inactivity (slow to wake up)
- **Hobby Tier**: $7/month - always running
- **Dyno Hours**: ~550 free hours/month (enough for free tier)

## Next Steps

- Set up CI/CD for automatic deployment on git push
- Add error monitoring (Sentry)
- Add email notifications (SendGrid)
- Monitor performance (New Relic)

For more: [Heroku Node.js Deployment Guide](https://devcenter.heroku.com/articles/deploying-nodejs)
