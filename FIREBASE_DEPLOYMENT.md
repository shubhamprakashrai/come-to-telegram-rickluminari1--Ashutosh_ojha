# Firebase Deployment Guide

## Project Overview

This project is connected to Firebase and deployed using Firebase Hosting. This document provides all the information you need to manage and deploy your application.

---

## 🔥 Firebase Project Details

- **Project Name**: ashutosh-ojha
- **Project ID**: `ashutosh-ojha-18afc`
- **Project Number**: 344994341820
- **Hosting URL**: https://ashutosh-ojha-18afc.web.app
- **Firebase Console**: https://console.firebase.google.com/project/ashutosh-ojha-18afc/overview

---

## 📁 Project Structure

```
Ashutosh_ojha/
├── src/                    # Source code
├── dist/                   # Production build (generated)
├── firebase.json           # Firebase configuration
├── .firebaserc            # Firebase project settings
├── package.json           # NPM scripts and dependencies
└── FIREBASE_DEPLOYMENT.md # This file
```

---

## 🚀 Quick Deployment

### One-Command Deployment

The easiest way to deploy your application:

```bash
npm run deploy
```

This command will:
1. Build your project (`npm run build`)
2. Deploy to Firebase Hosting (`firebase deploy --only hosting`)

---

## 📝 Available NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server |
| `build` | `npm run build` | Build production bundle |
| `preview` | `npm run preview` | Preview production build locally |
| `lint` | `npm run lint` | Run ESLint |
| `deploy` | `npm run deploy` | Build and deploy to Firebase |

---

## 🔧 Firebase Configuration

### firebase.json

The hosting configuration is set up as follows:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**Key Settings:**
- **public**: `dist` - The directory containing production build files
- **rewrites**: Configured for Single Page Application (SPA) routing
- All routes redirect to `index.html` for client-side routing

### .firebaserc

```json
{
  "projects": {
    "default": "ashutosh-ojha-18afc"
  }
}
```

---

## 📋 Step-by-Step Deployment Process

### First Time Setup (Already Completed)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase** (Already done)
   ```bash
   firebase init hosting
   ```

### Regular Deployment Workflow

#### Option 1: Using the Deploy Script (Recommended)

```bash
npm run deploy
```

#### Option 2: Manual Steps

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy --only hosting
   ```

#### Option 3: Deploy Specific Files

If you only want to deploy without rebuilding:

```bash
firebase deploy --only hosting
```

---

## 🧪 Testing Before Deployment

### Local Development

```bash
npm run dev
```

Visit: http://localhost:5173 (or the port shown in terminal)

### Preview Production Build Locally

```bash
npm run build
npm run preview
```

This allows you to test the production build before deploying.

---

## 🔍 Firebase CLI Commands

### View Project Information

```bash
firebase projects:list
```

### Check Current Project

```bash
firebase use
```

### Switch Projects (if you have multiple)

```bash
firebase use <project-id>
```

### View Hosting Releases

```bash
firebase hosting:channel:list
```

### Rollback to Previous Version

1. Go to Firebase Console: https://console.firebase.google.com/project/ashutosh-ojha-18afc/hosting
2. Click on "Release History"
3. Select a previous version and click "Rollback"

---

## 🌐 Custom Domain Setup

To add a custom domain:

1. Go to [Firebase Console - Hosting](https://console.firebase.google.com/project/ashutosh-ojha-18afc/hosting)
2. Click "Add custom domain"
3. Follow the verification steps
4. Update DNS records as instructed

---

## 🔒 Security & Environment Variables

### For Sensitive Data

If you need to use environment variables:

1. Create a `.env` file (already in `.gitignore`)
2. Add variables with `VITE_` prefix:
   ```
   VITE_API_KEY=your-api-key
   VITE_AUTH_DOMAIN=your-auth-domain
   ```

3. Access in code:
   ```typescript
   const apiKey = import.meta.env.VITE_API_KEY;
   ```

> [!WARNING]
> Never commit `.env` files to version control. They are already ignored in `.gitignore`.

---

## 📊 Monitoring & Analytics

### View Deployment History

```bash
firebase hosting:channel:list
```

### Firebase Console

Monitor your app's performance and usage:
- **Hosting Dashboard**: https://console.firebase.google.com/project/ashutosh-ojha-18afc/hosting
- **Analytics**: https://console.firebase.google.com/project/ashutosh-ojha-18afc/analytics

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment Fails

```bash
# Re-authenticate with Firebase
firebase logout
firebase login
firebase deploy --only hosting
```

### Wrong Project

```bash
# Check current project
firebase use

# Switch to correct project
firebase use ashutosh-ojha-18afc
```

### Cache Issues

```bash
# Clear Firebase cache
firebase hosting:channel:delete preview
firebase deploy --only hosting
```

---

## 📦 Build Optimization

### Update Browserslist

If you see a warning about `caniuse-lite`:

```bash
npx update-browserslist-db@latest
```

### Analyze Bundle Size

```bash
npm run build
```

Check the output for file sizes. The build summary shows:
- Individual file sizes
- Gzipped sizes
- Total bundle size

---

## 🔄 CI/CD Integration (Optional)

### GitHub Actions Example

Create `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: ashutosh-ojha-18afc
```

---

## 📞 Support & Resources

### Firebase Documentation
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

### Vite Documentation
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

### Project Console
- [Firebase Console](https://console.firebase.google.com/project/ashutosh-ojha-18afc/overview)

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Test locally with `npm run dev`
- [ ] Run linter: `npm run lint`
- [ ] Build successfully: `npm run build`
- [ ] Preview production build: `npm run preview`
- [ ] Check for console errors
- [ ] Verify all links work
- [ ] Test on mobile devices
- [ ] Deploy: `npm run deploy`
- [ ] Verify live site: https://ashutosh-ojha-18afc.web.app
- [ ] Check Firebase Console for deployment status

---

## 📝 Notes

- The production build is created in the `dist/` folder
- The `dist/` folder is automatically generated and should not be committed to Git
- Firebase Hosting serves files from the `dist/` folder
- All routes are rewritten to `index.html` for SPA routing support
- Deployment typically takes 1-2 minutes to complete

---

**Last Updated**: November 23, 2025  
**Deployed By**: Firebase CLI v14.26.0
