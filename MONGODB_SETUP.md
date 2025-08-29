# MongoDB Setup for Gaming Library

## Option 1: MongoDB Atlas (Recommended)

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a New Cluster**
   - Select the free tier (M0 Sandbox)
   - Choose a cloud provider and region
   - Create the cluster

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a user with read and write permissions
   - Save the username and password

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development, add your current IP
   - For production, you can add `0.0.0.0/0` (allow all) but this is less secure

5. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `myFirstDatabase` with `gaming-library`

## Option 2: Local MongoDB Installation

1. **Install MongoDB**
   - Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Follow the installation instructions for your OS

2. **Start MongoDB Service**
   - On Windows: `net start MongoDB`
   - On macOS/Linux: `sudo systemctl start mongod`

3. **Verify Installation**
   - Run `mongo` in terminal to connect to the database

## Using a .env File (Local Development)

Create a `.env` file in the backend directory with:

```env
MONGODB_URI=mongodb://localhost:27017/gaming-library
JWT_SECRET=your-jwt-secret-key
STEAM_API_KEY=your-steam-api-key
```

For MongoDB Atlas, use:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/gaming-library?retryWrites=true&w=majority
JWT_SECRET=your-jwt-secret-key
STEAM_API_KEY=your-steam-api-key
```

## Vercel Environment Variables

After deploying to Vercel, add these environment variables in your project settings:

1. Go to your Vercel project
2. Click "Settings"
3. Click "Environment Variables"
4. Add:
   - `MONGODB_URI` with your MongoDB connection string
   - `JWT_SECRET` with a secure random string
   - `STEAM_API_KEY` with your Steam API key (optional)

## Testing the Connection

To test your MongoDB connection locally:

```bash
cd backend
npm run dev
```

Or to test the database connection specifically:

```bash
cd backend
node -e "require('./config/db')().then(() => console.log('Connected')).catch(e => console.error(e))"
```

## Sample Connection String

For local development:
```
mongodb://localhost:27017/gaming-library
```

For MongoDB Atlas:
```
mongodb+srv://username:password@cluster0.example.mongodb.net/gaming-library?retryWrites=true&w=majority
```

Replace:
- `username` with your MongoDB username
- `password` with your MongoDB password
- `cluster0.example.mongodb.net` with your cluster address