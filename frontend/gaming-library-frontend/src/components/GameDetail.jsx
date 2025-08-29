import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from your API
    const mockGame = {
      id: id,
      title: 'The Witcher 3: Wild Hunt',
      description: 'The Witcher: Wild Hunt is a story-driven, open world RPG set in a visually stunning fantasy universe full of meaningful choices and impactful consequences. In The Witcher, you play as Geralt of Rivia, a monster hunter whose destiny is to find his missing adopted daughter, on the run from the Wild Hunt, an otherworldly force determined to prevent his prophesied role.',
      coverImage: 'https://via.placeholder.com/600x800/3b82f6/ffffff?text=TW3',
      screenshots: [
        'https://via.placeholder.com/600x338/3b82f6/ffffff?text=Screenshot+1',
        'https://via.placeholder.com/600x338/ef4444/ffffff?text=Screenshot+2',
        'https://via.placeholder.com/600x338/10b981/ffffff?text=Screenshot+3'
      ],
      platform: 'PC',
      status: 'completed',
      playtime: 120,
      totalAchievements: 120,
      unlockedAchievements: 120,
      rating: 9.5,
      genres: ['RPG', 'Open World', 'Fantasy'],
      developer: 'CD Projekt RED',
      publisher: 'CD Projekt',
      releaseDate: '2015-05-19',
      // Mock achievements
      achievements: [
        { id: 1, name: 'Blood on the Battlefield', description: 'Complete the prologue', icon: '🛡️', unlocked: true, unlockDate: '2023-01-15' },
        { id: 2, name: 'Loot Hunter', description: 'Find 100 items', icon: '💎', unlocked: true, unlockDate: '2023-01-20' },
        { id: 3, name: 'Monster Slayer', description: 'Kill 50 monsters', icon: '👹', unlocked: true, unlockDate: '2023-01-25' },
        { id: 4, name: 'Master Alchemist', description: 'Craft 20 potions', icon: '🧪', unlocked: false },
        { id: 5, name: 'Explorer', description: 'Discover 30 locations', icon: '🗺️', unlocked: true, unlockDate: '2023-02-01' }
      ]
    };
    
    setTimeout(() => {
      setGame(mockGame);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Game not found</p>
      </div>
    );
  }

  const achievementPercentage = game.totalAchievements > 0 
    ? Math.round((game.unlockedAchievements / game.totalAchievements) * 100) 
    : 0;

  return (
    <div>
      {/* Game Header */}
      <div className="relative mb-8">
        <img 
          src={game.coverImage} 
          alt={game.title} 
          className="w-full h-96 object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent rounded-lg"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-4xl font-bold mb-2">{game.title}</h1>
          <div className="flex flex-wrap items-center">
            <span className="bg-gray-700 px-2 py-1 rounded mr-2 mb-2">{game.platform}</span>
            {game.genres.map((genre, index) => (
              <span key={index} className="bg-blue-600 px-2 py-1 rounded mr-2 mb-2">{genre}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Status</div>
          <div className="text-lg font-bold capitalize">{game.status}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Playtime</div>
          <div className="text-lg font-bold">{game.playtime} hours</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Achievements</div>
          <div className="text-lg font-bold">{game.unlockedAchievements}/{game.totalAchievements} ({achievementPercentage}%)</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Rating</div>
          <div className="text-lg font-bold">{game.rating}/10</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'achievements'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'screenshots'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('screenshots')}
            >
              Screenshots
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-300 mb-6">{game.description}</p>
                
                <h2 className="text-2xl font-bold mb-4">Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400">Developer</div>
                    <div>{game.developer}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Publisher</div>
                    <div>{game.publisher}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Release Date</div>
                    <div>{game.releaseDate}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Platform</div>
                    <div>{game.platform}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">Progress</h2>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span>Status</span>
                      <span className="capitalize">{game.status}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span>Playtime</span>
                      <span>{game.playtime} hours</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${Math.min(100, game.playtime)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Achievements</span>
                      <span>{game.unlockedAchievements}/{game.totalAchievements}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${achievementPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors">
                      Update Progress
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Achievements ({game.unlockedAchievements}/{game.totalAchievements})</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {game.achievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`achievement-card ${
                    achievement.unlocked ? 'border-l-4 border-green-500' : 'opacity-70'
                  }`}
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold">{achievement.name}</h3>
                    <p className="text-gray-400 text-sm">{achievement.description}</p>
                    {achievement.unlocked && achievement.unlockDate && (
                      <p className="text-green-400 text-xs mt-1">
                        Unlocked on {achievement.unlockDate}
                      </p>
                    )}
                  </div>
                  {achievement.unlocked ? (
                    <div className="text-green-500">✓</div>
                  ) : (
                    <div className="text-gray-500">✕</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'screenshots' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Screenshots</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {game.screenshots.map((screenshot, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img 
                    src={screenshot} 
                    alt={`Screenshot ${index + 1}`} 
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameDetail;