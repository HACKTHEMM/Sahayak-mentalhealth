# 🚀 Deploying Sahayak to Google Cloud Run

This guide will walk you through deploying your Sahayak mental health app to Google Cloud Run.

## 📋 Prerequisites

1. **Google Cloud Account** - [Sign up here](https://cloud.google.com/free)
2. **Google Cloud CLI** - [Install gcloud](https://cloud.google.com/sdk/docs/install)
3. **Docker** (optional, for local testing) - [Install Docker](https://docs.docker.com/get-docker/)
4. **Git** repository connected to GitHub

## 🎯 Quick Start (First-Time Setup)

### 1️⃣ Set Up Google Cloud Project

```bash
# Install gcloud CLI first, then:

# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create sahayak-mental-health --name="Sahayak Mental Health"

# Set the project as default
gcloud config set project sahayak-mental-health

# Get your project ID
gcloud config get-value project
```

### 2️⃣ Enable Required APIs

```bash
# Enable Cloud Run API
gcloud services enable run.googleapis.com

# Enable Container Registry API
gcloud services enable containerregistry.googleapis.com

# Enable Cloud Build API (for CI/CD)
gcloud services enable cloudbuild.googleapis.com

# Enable Secret Manager (for environment variables)
gcloud services enable secretmanager.googleapis.com
```

### 3️⃣ Set Up Environment Variables in Secret Manager

```bash
# Create secrets for sensitive data
echo -n "your-clerk-secret-key" | gcloud secrets create CLERK_SECRET_KEY --data-file=-
echo -n "your-supabase-anon-key" | gcloud secrets create SUPABASE_ANON_KEY --data-file=-
echo -n "your-gemini-api-key" | gcloud secrets create GOOGLE_GENERATIVE_AI_API_KEY --data-file=-
echo -n "your-smtp-password" | gcloud secrets create SMTP_PASS --data-file=-

# Grant Cloud Run access to secrets
PROJECT_NUMBER=$(gcloud projects describe sahayak-mental-health --format="value(projectNumber)")
gcloud secrets add-iam-policy-binding CLERK_SECRET_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Repeat for all secrets
gcloud secrets add-iam-policy-binding SUPABASE_ANON_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding GOOGLE_GENERATIVE_AI_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding SMTP_PASS \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## 🎬 Deployment Methods

### Method A: Manual Deployment (Quick Test)

```bash
# Build and deploy in one command
gcloud run deploy sahayak-mentalhealth \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --port 8080 \
  --set-env-vars NODE_ENV=production,NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in,NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up \
  --set-secrets CLERK_SECRET_KEY=CLERK_SECRET_KEY:latest,GOOGLE_GENERATIVE_AI_API_KEY=GOOGLE_GENERATIVE_AI_API_KEY:latest
```

### Method B: Docker Build + Deploy (Recommended)

```bash
# 1. Build Docker image locally
docker build -t gcr.io/sahayak-mental-health/sahayak-mentalhealth:latest .

# 2. Configure Docker to use gcloud credentials
gcloud auth configure-docker

# 3. Push to Google Container Registry
docker push gcr.io/sahayak-mental-health/sahayak-mentalhealth:latest

# 4. Deploy to Cloud Run
gcloud run deploy sahayak-mentalhealth \
  --image gcr.io/sahayak-mental-health/sahayak-mentalhealth:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --port 8080 \
  --set-env-vars NODE_ENV=production \
  --set-secrets CLERK_SECRET_KEY=CLERK_SECRET_KEY:latest
```

### Method C: Automatic CI/CD from GitHub (Best for Production)

1. **Connect GitHub Repository to Cloud Build:**

```bash
# Go to Cloud Build triggers page
# https://console.cloud.google.com/cloud-build/triggers

# Click "Connect Repository"
# Select GitHub and authorize
# Choose your repository: HACKTHEMM/Sahayak-mentalhealth
```

2. **Create a Build Trigger:**

```bash
# Or use gcloud command:
gcloud builds triggers create github \
  --name="sahayak-deploy" \
  --repo-name="Sahayak-mentalhealth" \
  --repo-owner="HACKTHEMM" \
  --branch-pattern="^Main$" \
  --build-config="cloudbuild.yaml"
```

3. **Push to GitHub - Auto Deploy:**

```bash
# Any push to Main branch will automatically trigger deployment!
git push origin Main
```

## 🔐 Setting Environment Variables in Cloud Run

### Via gcloud CLI:

```bash
gcloud run services update sahayak-mentalhealth \
  --region us-central1 \
  --update-env-vars \
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxx",\
  NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co",\
  SMTP_HOST="smtp.gmail.com",\
  SMTP_PORT="587",\
  SMTP_USER="your-email@gmail.com",\
  NOTIFICATION_FROM="sahayak@mentalhealth.app"

# For secrets:
gcloud run services update sahayak-mentalhealth \
  --region us-central1 \
  --set-secrets \
  CLERK_SECRET_KEY=CLERK_SECRET_KEY:latest,\
  SUPABASE_ANON_KEY=SUPABASE_ANON_KEY:latest,\
  GOOGLE_GENERATIVE_AI_API_KEY=GOOGLE_GENERATIVE_AI_API_KEY:latest,\
  SMTP_PASS=SMTP_PASS:latest
```

### Via Google Cloud Console:

1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Click on your service `sahayak-mentalhealth`
3. Click "EDIT & DEPLOY NEW REVISION"
4. Scroll to "Variables & Secrets"
5. Add environment variables or reference secrets
6. Click "DEPLOY"

## 🌐 Custom Domain Setup (Optional)

```bash
# Map your custom domain to Cloud Run
gcloud run domain-mappings create \
  --service sahayak-mentalhealth \
  --domain sahayak.yourdomain.com \
  --region us-central1
```

## 📊 Monitoring & Logs

```bash
# View logs
gcloud run services logs read sahayak-mentalhealth \
  --region us-central1 \
  --limit 100

# View service details
gcloud run services describe sahayak-mentalhealth \
  --region us-central1
```

## 💰 Cost Optimization

Cloud Run pricing:
- **FREE TIER**: 2 million requests/month
- **Compute**: $0.00002400 per vCPU-second
- **Memory**: $0.00000250 per GiB-second
- **Requests**: $0.40 per million requests

**Expected costs for your app:**
- Low traffic (< 10k requests/month): **~$2-5/month**
- Medium traffic (100k requests/month): **~$10-20/month**
- High traffic (1M requests/month): **~$50-100/month**

**Tips to reduce costs:**
- Keep `min-instances` at 0 (scale to zero)
- Use `--memory 1Gi` (sufficient for Next.js)
- Enable Cloud CDN for static assets

## 🔧 Troubleshooting

### Build Fails

```bash
# Check build logs
gcloud builds list --limit 5
gcloud builds log [BUILD_ID]
```

### Deployment Issues

```bash
# Check service status
gcloud run services describe sahayak-mentalhealth --region us-central1

# Check recent revisions
gcloud run revisions list --service sahayak-mentalhealth --region us-central1
```

### Environment Variables Not Working

```bash
# List all env vars
gcloud run services describe sahayak-mentalhealth \
  --region us-central1 \
  --format 'value(spec.template.spec.containers[0].env)'
```

### Cold Start Issues

```bash
# Set min-instances to 1 (costs more but eliminates cold starts)
gcloud run services update sahayak-mentalhealth \
  --region us-central1 \
  --min-instances 1
```

## 🎉 Success!

After deployment, your app will be available at:
```
https://sahayak-mentalhealth-[random-hash]-uc.a.run.app
```

Get the URL:
```bash
gcloud run services describe sahayak-mentalhealth \
  --region us-central1 \
  --format 'value(status.url)'
```

## 📚 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Next.js on Cloud Run Guide](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)

## 🆘 Need Help?

- Check the [GitHub Issues](https://github.com/HACKTHEMM/Sahayak-mentalhealth/issues)
- Review Cloud Run logs: `gcloud run services logs read sahayak-mentalhealth`
- Check build status: `gcloud builds list`

---

**Made with ❤️ for Sahayak Mental Health Companion**
