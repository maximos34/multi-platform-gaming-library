const axios = require('axios');
require('dotenv').config();

// Mock SteamService for demonstration purposes
console.log('SteamService: Using mock implementation for demonstration');

class SteamService {
  async getUserProfile(steamId) {
    console.log(`SteamService: Getting profile for ${steamId}`);
    return {
      steamid: steamId,
      personaname: 'Mock User',
      avatar: 'https://via.placeholder.com/32x32'
    };
  }

  async getUserOwnedGames(steamId) {
    console.log(`SteamService: Getting owned games for ${steamId}`);
    return [
      {
        appid: 292030,
        name: 'The Witcher 3: Wild Hunt',
        playtime_forever: 7200
      },
      {
        appid: 1091500,
        name: 'Cyberpunk 2077',
        playtime_forever: 2700
      }
    ];
  }

  async getGameSchema(appId) {
    console.log(`SteamService: Getting schema for app ${appId}`);
    return {
      gameName: 'Mock Game',
      gameVersion: '1.0.0'
    };
  }

  async getUserAchievements(steamId, appId) {
    console.log(`SteamService: Getting achievements for user ${steamId} in app ${appId}`);
    return [
      {
        apiname: 'mock_achievement_1',
        name: 'Mock Achievement 1',
        description: 'This is a mock achievement',
        achieved: 1
      }
    ];
  }

  async getGameDetails(appId) {
    console.log(`SteamService: Getting details for app ${appId}`);
    return {
      name: 'Mock Game',
      short_description: 'This is a mock game for demonstration purposes',
      header_image: 'https://via.placeholder.com/460x215',
      screenshots: [
        { path_full: 'https://via.placeholder.com/600x338' }
      ]
    };
  }
}

module.exports = new SteamService();