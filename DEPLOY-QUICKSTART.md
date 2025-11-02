# ⚡ Cloud Run Deployment - Quick Start

**Deploy Sahayak to Google Cloud Run in 5 minutes!**

## 🎯 Fastest Way to Deploy

### Step 1: Prerequisites (2 minutes)

```bash
# Install gcloud CLI (if not installed)
# Windows: https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe
# Mac: brew install google-cloud-sdk
# Linux: curl https://sdk.cloud.google.com | bash

# Login
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID
```

### Step 2: Enable APIs (1 minute)

```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com containerregistry.googleapis.com
```

### Step 3: Deploy! (2 minutes)

```bash
# One command to build & deploy
gcloud run deploy sahayak-mentalhealth \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi
```

**That's it! 🎉**

---

## 🔐 Add Environment Variables

After first deployment, add your secrets:

```bash
# Create secrets
echo -n "YOUR_CLERK_SECRET" | gcloud secrets create CLERK_SECRET_KEY --data-file=-
echo -n "YOUR_GEMINI_KEY" | gcloud secrets create GOOGLE_GENERATIVE_AI_API_KEY --data-file=-

# Update service to use secrets
gcloud run services update sahayak-mentalhealth \
  --region us-central1 \
  --set-secrets CLERK_SECRET_KEY=CLERK_SECRET_KEY:latest,GOOGLE_GENERATIVE_AI_API_KEY=GOOGLE_GENERATIVE_AI_API_KEY:latest
```

---

## 🔄 Set Up Auto-Deploy from GitHub

1. **Go to Cloud Build Console:**
   - https://console.cloud.google.com/cloud-build/triggers

2. **Connect GitHub:**
   - Click "Connect Repository"
   - Authorize GitHub
   - Select `HACKTHEMM/Sahayak-mentalhealth`

3. **Create Trigger:**
   - Name: `auto-deploy-main`
   - Event: Push to branch `Main`
   - Configuration: `cloudbuild.yaml`
   - Click "CREATE"

**Now every git push to Main = automatic deployment!** 🚀

---

## 🌐 Get Your App URL

```bash
gcloud run services describe sahayak-mentalhealth --region us-central1 --format 'value(status.url)'
```

---

## 📊 Monitor Your App

**View Logs:**
```bash
gcloud run services logs read sahayak-mentalhealth --region us-central1
```

**View in Browser:**
- [Cloud Run Console](https://console.cloud.google.com/run)

---

## 💡 Pro Tips

1. **Scale to Zero** = Pay only when users visit
2. **Free Tier** = 2 million requests/month FREE
3. **Auto HTTPS** = SSL certificate included
4. **Global CDN** = Fast worldwide

---

## ❓ Common Issues

**Build Fails?**
- Check `cloudbuild.yaml` exists
- Verify Docker builds locally: `docker build -t test .`

**Environment Variables Not Working?**
- Use Secret Manager (see above)
- Or add via Console: Cloud Run → Edit → Variables & Secrets

**Cold Starts?**
- Set min-instances to 1: `gcloud run services update sahayak-mentalhealth --min-instances 1`

---

**Need detailed instructions?** → See `DEPLOYMENT.md`

**Ready to deploy?** Run the Step 3 command above! 🚀
