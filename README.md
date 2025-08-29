# Gaming Library

A multi-platform application for managing games and tracking achievements across various gaming platforms.

## Features

- **Multi-platform Support**: Works on web, mobile, and desktop
- **Game Collection Management**: Organize your games with tags and categories
- **Achievement Tracking**: Monitor your progress in games
- **Data Collection**: Gather game information from Steam, Epic Games, Xbox, and PlayStation
- **Local Game Scanning**: Automatically detect installed games on your computer
- **Multiple Themes**: Customize the UI with different color schemes

## Technology Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** for primary database
- **Firebase** for authentication and additional services
- **Mongoose** for MongoDB object modeling

### Frontend
- **React** with **Vite** for web application
- **Tailwind CSS** for styling
- **React Router** for navigation

### Mobile
- **React Native** with **Expo** for cross-platform mobile development

### Desktop
- **Electron** for cross-platform desktop application

## Project Structure

```
.
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── package.json
├── frontend/
│   └── gaming-library-frontend/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── vite.config.js
├── mobile/
│   └── gaming-library-mobile/
│       ├── app/
│       ├── components/
│       ├── contexts/
│       ├── app.json
│       └── package.json
├── desktop/
│   └── gaming-library-desktop/
│       ├── main.js
│       ├── preload.js
│       ├── index.html
│       └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose (recommended) OR MongoDB installed locally
- npm or yarn

### Quick Start with Docker Compose (Recommended)

1. Make sure Docker Desktop is running
2. From the root directory, start all services:
   ```bash
   docker-compose up -d
   ```
3. The backend will be available at http://localhost:5000
4. MongoDB will be available at mongodb://localhost:27017

### Manual Setup

#### MongoDB Setup

Follow the instructions in [MONGODB_SETUP.md](MONGODB_SETUP.md) to set up MongoDB either locally or using MongoDB Atlas.

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and fill in your configuration:
   ```bash
   cp .env.example .env
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/gaming-library-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Mobile Setup

1. Navigate to the mobile directory:
   ```bash
   cd mobile/gaming-library-mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

### Desktop Setup

1. Navigate to the desktop directory:
   ```bash
   cd desktop/gaming-library-desktop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm run dev
   ```

## Deployment

### Automated Deployment

Run the deployment script to set up everything automatically:

```bash
# On Windows
deploy.bat

# On macOS/Linux
./deploy.sh
```

### Line Ending Configuration

This project uses CRLF line endings on Windows. The following files ensure consistent line endings across platforms:

- `.gitattributes` - Git configuration for line endings
- `.editorconfig` - Editor configuration for line endings

If you encounter line ending issues:
1. Make sure `core.autocrlf` is set to `true` on Windows:
   ```bash
   git config --global core.autocrlf true
   ```
2. Renormalize line endings:
   ```bash
   git add --renormalize .
   ```

### Manual Deployment Steps

1. **Initialize Database**:
   ```bash
   cd backend
   npm run init-db
   ```

2. **Deploy Backend**:
   ```bash
   cd backend
   npm start
   ```

3. **Deploy Frontend**:
   ```bash
   cd frontend/gaming-library-frontend
   npm run build
   npx serve dist
   ```

4. **Deploy Mobile App**:
   ```bash
   cd mobile/gaming-library-mobile
   npx expo export:web
   npx serve dist
   ```

5. **Deploy Desktop App**:
   ```bash
   cd desktop/gaming-library-desktop
   npm run build
   npm start
   ```

### Vercel Deployment

For cloud deployment, you can deploy the backend and frontend to Vercel:

1. **Backend Deployment**:
   - Create a MongoDB Atlas database
   - Set up environment variables in Vercel
   - Deploy using `vercel` CLI or Git integration

2. **Frontend Deployment**:
   - Update API URL in Vite configuration
   - Deploy using `vercel` CLI or Git integration

For detailed Vercel deployment instructions, see:
- [MongoDB Setup Guide](MONGODB_SETUP.md)
- [Vercel Deployment Guide](VERCEL_DEPLOYMENT.md)
- [Deployment Verification](VERIFY_DEPLOYMENT.md)
- [Deployment Status](DEPLOYMENT_STATUS.md)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/connect/steam` - Connect Steam account
- `POST /api/auth/connect/epic` - Connect Epic account
- `POST /api/auth/connect/xbox` - Connect Xbox account
- `POST /api/auth/connect/playstation` - Connect PlayStation account

### Games
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get game by ID
- `POST /api/games` - Create a new game
- `PUT /api/games/:id` - Update a game
- `DELETE /api/games/:id` - Delete a game
- `POST /api/games/steam/import` - Import games from Steam

### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/:id` - Get achievement by ID
- `POST /api/achievements` - Create a new achievement
- `PUT /api/achievements/:id` - Update an achievement
- `DELETE /api/achievements/:id` - Delete an achievement
- `POST /api/achievements/steam/import` - Import achievements from Steam

### User Games
- `GET /api/usergames` - Get all user games
- `GET /api/usergames/:id` - Get user game by ID
- `POST /api/usergames` - Add a game to user's collection
- `PUT /api/usergames/:id` - Update user game
- `DELETE /api/usergames/:id` - Remove game from user's collection
- `POST /api/usergames/:id/achievements/:achievementId` - Unlock an achievement
- `DELETE /api/usergames/:id/achievements/:achievementId` - Lock an achievement

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all the open-source projects that made this possible
- Special thanks to the gaming community for inspiration