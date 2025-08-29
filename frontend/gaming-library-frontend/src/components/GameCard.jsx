import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
  const {
    id,
    title,
    coverImage,
    platform,
    status,
    playtime,
    totalAchievements,
    unlockedAchievements,
    rating
  } = game;

  // Calculate achievement percentage
  const achievementPercentage = totalAchievements > 0 
    ? Math.round((unlockedAchievements / totalAchievements) * 100) 
    : 0;

  // Status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'playing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'on-hold':
        return 'bg-yellow-500';
      case 'dropped':
        return 'bg-red-500';
      case 'planned':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Platform icon
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'PC':
        return '💻';
      case 'PlayStation':
        return '🎮';
      case 'Xbox':
        return '🎮';
      case 'Nintendo Switch':
        return '🎮';
      default:
        return '🎮';
    }
  };

  return (
    <Link to={`/game/${id}`} className="game-card block">
      <div className="relative">
        <img 
          src={coverImage} 
          alt={title} 
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-bold rounded ${getStatusBadgeClass(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <div className="absolute bottom-2 left-2 flex items-center bg-black bg-opacity-70 px-2 py-1 rounded">
          <span className="mr-1">{getPlatformIcon(platform)}</span>
          <span className="text-xs">{platform}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 truncate">{title}</h3>
        
        {playtime > 0 && (
          <p className="text-gray-400 text-sm mb-2">
            {playtime} hours played
          </p>
        )}
        
        {totalAchievements > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Achievements</span>
              <span>{unlockedAchievements}/{totalAchievements} ({achievementPercentage}%)</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${achievementPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {rating > 0 && (
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">★</span>
            <span>{rating}/10</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default GameCard;