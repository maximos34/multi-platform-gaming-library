<<<<<<< HEAD
@echo off
title Gaming Library Deployment

echo 🚀 Starting Gaming Library Deployment...

REM 1. Set up MongoDB database
echo 📦 Setting up MongoDB database...
cd backend
npm run init-db
cd ..

REM 2. Start backend server
echo ⚙️ Starting backend server...
cd backend
start "Backend Server" cmd /k "npm start"
cd ..

REM 3. Build and deploy frontend
echo 🌐 Building and deploying frontend...
cd frontend\gaming-library-frontend
npm run build
npx serve dist
cd ..\..

echo ✅ Deployment process completed!
echo Backend should be running on http://localhost:5000
echo Frontend build is complete and can be served with "npx serve dist" in the frontend directory

=======
@echo off
title Gaming Library Deployment

echo 🚀 Starting Gaming Library Deployment...

REM 1. Set up MongoDB database
echo 📦 Setting up MongoDB database...
cd backend
npm run init-db
cd ..

REM 2. Start backend server
echo ⚙️ Starting backend server...
cd backend
start "Backend Server" cmd /k "npm start"
cd ..

REM 3. Build and deploy frontend
echo 🌐 Building and deploying frontend...
cd frontend\gaming-library-frontend
npm run build
npx serve dist
cd ..\..

echo ✅ Deployment process completed!
echo Backend should be running on http://localhost:5000
echo Frontend build is complete and can be served with "npx serve dist" in the frontend directory

>>>>>>> 7543c830d80040942629e0aaa20beb6e09053829
pause