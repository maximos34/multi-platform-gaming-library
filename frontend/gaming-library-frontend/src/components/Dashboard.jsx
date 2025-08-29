import React, { useState, useEffect } from 'react';
import GameCard from './GameCard';

const Dashboard = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from your API
    const mockGames = [
      {
        id: 1,
        title: 'The Witcher 3: Wild Hunt',
        coverImage: 'https://via.placeholder.com/300x400/3b82f6/ffffff?text=TW3',
        platform: 'PC',
        status: 'completed',
        playtime: 120,
        totalAchievements: 120,
        unlockedAchievements: 120,
        rating: 9.5
      },
      {
        id: 2,
        title: 'Cyberpunk 2077',
        coverImage: 'https://via.placeholder.com/300x400/ef4444/ffffff?text=CP2077',
        platform: 'PC',
        status: 'playing',
        playtime: 45,
        totalAchievements: 80,
        unlockedAchievements: 32,
        rating: 7.2
      },
      {
        id: 3,
        title: 'Red Dead Redemption 2',
        coverImage: 'https://via.placeholder.com/300x400/10b981/ffffff?text=RDR2',
        platform: 'PlayStation',
        status: 'on-hold',
        playtime: 65,
        totalAchievements: 100,
        unlockedAchievements: 45,
        rating: 9.8
      },
      {
        id: 4,
        title: 'Hades',
        coverImage: 'https://via.placeholder.com/300x400/8b5cf6/ffffff?text=Hades',
        platform: 'Nintendo Switch',
        status: 'planned',
        playtime: 0,
        totalAchievements: 60,
        unlockedAchievements: 0,
        rating: 0
      }
    ];
    
    setTimeout(() => {
      setGames(mockGames);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || game.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">My Game Library</h1>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search games..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Games</option>
              <option value="playing">Playing</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
              <option value="dropped">Dropped</option>
              <option value="planned">Planned</option>
            </select>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Add Game
            </button>
          </div>
        </div>
      </div>
      
      {filteredGames.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No games found. Add some games to your library!</p>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Add Your First Game
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;