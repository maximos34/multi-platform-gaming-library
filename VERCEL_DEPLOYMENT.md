<<<<<<< HEAD
# Vercel Deployment Guide

## Prerequisites

1. [Vercel Account](https://vercel.com/signup)
2. MongoDB Atlas account (or local MongoDB for development)
3. Node.js installed locally
4. Git repository

## Backend API Deployment

### 1. Prepare the Backend

Make sure your backend directory has these files:
```
backend/
├── server.js
├── vercel.json
├── package.json
├── .env.example
└── (other files)
```

### 2. Deploy to Vercel

Option 1: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to backend directory
cd backend

# Deploy
vercel --prod
```

Option 2: Using Git Integration
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Set the root directory to `backend`
6. Deploy

### 3. Configure Environment Variables

After deployment, go to your project settings in Vercel:
1. Click "Settings" → "Environment Variables"
2. Add these variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string for JWT tokens
   - `STEAM_API_KEY` - Your Steam API key (optional)

## Frontend Deployment

### 1. Prepare the Frontend

Navigate to the frontend directory:
```bash
cd frontend/gaming-library-frontend
```

### 2. Update API Configuration

Update the Vite configuration to point to your backend API:

Edit `vite.config.js`:
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://your-backend-url.vercel.app', // Update this
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
});
```

### 3. Deploy to Vercel

Option 1: Using Vercel CLI
```bash
# Navigate to frontend directory
cd frontend/gaming-library-frontend

# Deploy
vercel --prod
```

Option 2: Using Git Integration
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Set the root directory to `frontend/gaming-library-frontend`
6. Deploy

## Environment Variables for Frontend

Add these environment variables in your frontend project settings:
- `VITE_API_URL` - Your backend API URL (e.g., https://your-backend-url.vercel.app)

## Testing the Deployment

After deployment:

1. Visit your backend API: `https://your-backend-url.vercel.app`
2. You should see: `{"message":"Gaming Library API","version":"1.0.0"}`

3. Test an API endpoint: `https://your-backend-url.vercel.app/api/games`

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Make sure all required environment variables are set in Vercel project settings

2. **MongoDB Connection Failed**
   - Check your MongoDB connection string
   - Ensure IP whitelist is configured correctly
   - Verify MongoDB Atlas cluster is running

3. **CORS Errors**
   - Make sure your frontend URL is added to the backend CORS configuration

4. **Build Errors**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are listed in package.json

### Checking Logs

1. Go to your Vercel project dashboard
2. Click "Logs" to view real-time logs
3. Check for any error messages

## Continuous Deployment

Vercel automatically deploys new changes when you push to your Git repository:
- Push to `main` branch for production deployment
- Push to other branches for preview deployments

## Custom Domain

To use a custom domain:
1. Go to your Vercel project
2. Click "Settings" → "Domains"
3. Add your custom domain
=======
# Vercel Deployment Guide

## Prerequisites

1. [Vercel Account](https://vercel.com/signup)
2. MongoDB Atlas account (or local MongoDB for development)
3. Node.js installed locally
4. Git repository

## Backend API Deployment

### 1. Prepare the Backend

Make sure your backend directory has these files:
```
backend/
├── server.js
├── vercel.json
├── package.json
├── .env.example
└── (other files)
```

### 2. Deploy to Vercel

Option 1: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to backend directory
cd backend

# Deploy
vercel --prod
```

Option 2: Using Git Integration
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Set the root directory to `backend`
6. Deploy

### 3. Configure Environment Variables

After deployment, go to your project settings in Vercel:
1. Click "Settings" → "Environment Variables"
2. Add these variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string for JWT tokens
   - `STEAM_API_KEY` - Your Steam API key (optional)

## Frontend Deployment

### 1. Prepare the Frontend

Navigate to the frontend directory:
```bash
cd frontend/gaming-library-frontend
```

### 2. Update API Configuration

Update the Vite configuration to point to your backend API:

Edit `vite.config.js`:
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://your-backend-url.vercel.app', // Update this
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
});
```

### 3. Deploy to Vercel

Option 1: Using Vercel CLI
```bash
# Navigate to frontend directory
cd frontend/gaming-library-frontend

# Deploy
vercel --prod
```

Option 2: Using Git Integration
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Set the root directory to `frontend/gaming-library-frontend`
6. Deploy

## Environment Variables for Frontend

Add these environment variables in your frontend project settings:
- `VITE_API_URL` - Your backend API URL (e.g., https://your-backend-url.vercel.app)

## Testing the Deployment

After deployment:

1. Visit your backend API: `https://your-backend-url.vercel.app`
2. You should see: `{"message":"Gaming Library API","version":"1.0.0"}`

3. Test an API endpoint: `https://your-backend-url.vercel.app/api/games`

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Make sure all required environment variables are set in Vercel project settings

2. **MongoDB Connection Failed**
   - Check your MongoDB connection string
   - Ensure IP whitelist is configured correctly
   - Verify MongoDB Atlas cluster is running

3. **CORS Errors**
   - Make sure your frontend URL is added to the backend CORS configuration

4. **Build Errors**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are listed in package.json

### Checking Logs

1. Go to your Vercel project dashboard
2. Click "Logs" to view real-time logs
3. Check for any error messages

## Continuous Deployment

Vercel automatically deploys new changes when you push to your Git repository:
- Push to `main` branch for production deployment
- Push to other branches for preview deployments

## Custom Domain

To use a custom domain:
1. Go to your Vercel project
2. Click "Settings" → "Domains"
3. Add your custom domain
>>>>>>> 7543c830d80040942629e0aaa20beb6e09053829
4. Follow the DNS configuration instructions