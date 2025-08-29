import { gql } from '@apollo/client';

// Game Queries
export const GET_GAMES = gql`
  query GetGames($limit: Int, $offset: Int, $search: String, $genre: String, $platform: String) {
    games(limit: $limit, offset: $offset, search: $search, genre: $genre, platform: $platform) {
      id
      title
      coverImage
      platform: platforms
      status
      playtime
      totalAchievements
      unlockedAchievements
      rating
    }
  }
`;

export const GET_GAME = gql`
  query GetGame($id: ID!) {
    game(id: $id) {
      id
      title
      description
      coverImage
      screenshots
      platform: platforms
      status
      playtime
      totalAchievements
      unlockedAchievements
      rating
      genres
      developer
      publisher
      releaseDate
      metacriticScore
      averagePlaytime
    }
  }
`;

export const GET_GAME_ACHIEVEMENTS = gql`
  query GetGameAchievements($gameId: ID!) {
    achievements(gameId: $gameId) {
      id
      name
      description
      icon
      isHidden
      globalPercentage
    }
  }
`;

// User Queries
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      username
      email
      profileImage
      bio
      preferences {
        theme
        language
      }
      stats {
        totalGames
        completedGames
        totalAchievements
        unlockedAchievements
      }
    }
  }
`;

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalGames
      completedGames
      totalPlaytime
      totalAchievements
      unlockedAchievements
    }
  }
`;

// UserGame Queries
export const GET_USER_GAMES = gql`
  query GetUserGames($userId: ID!, $limit: Int, $offset: Int, $status: String) {
    userGames(userId: $userId, limit: $limit, offset: $offset, status: $status) {
      id
      status
      playtime
      lastPlayed
      totalAchievements
      unlockedAchievements
      game {
        id
        title
        coverImage
        platform: platforms
      }
    }
  }
`;

// Mutations
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        username
        email
        profileImage
      }
      token
    }
  }
`;

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        username
        email
      }
      token
    }
  }
`;

export const ADD_USER_GAME = gql`
  mutation AddUserGame($input: AddUserGameInput!) {
    addUserGame(input: $input) {
      id
      status
      playtime
      lastPlayed
      totalAchievements
      unlockedAchievements
      game {
        id
        title
        coverImage
      }
    }
  }
`;

export const UPDATE_USER_GAME = gql`
  mutation UpdateUserGame($id: ID!, $input: UpdateUserGameInput!) {
    updateUserGame(id: $id, input: $input) {
      id
      status
      playtime
      lastPlayed
      totalAchievements
      unlockedAchievements
      game {
        id
        title
        coverImage
      }
    }
  }
`;

export const REMOVE_USER_GAME = gql`
  mutation RemoveUserGame($id: ID!) {
    removeUserGame(id: $id)
  }
`;

export const UNLOCK_ACHIEVEMENT = gql`
  mutation UnlockAchievement($userGameId: ID!, $achievementId: ID!) {
    unlockAchievement(userGameId: $userGameId, achievementId: $achievementId) {
      id
      unlockedAchievements
      achievements {
        achievementId
        unlocked
        unlockDate
      }
    }
  }
`;

export const LOCK_ACHIEVEMENT = gql`
  mutation LockAchievement($userGameId: ID!, $achievementId: ID!) {
    lockAchievement(userGameId: $userGameId, achievementId: $achievementId) {
      id
      unlockedAchievements
      achievements {
        achievementId
        unlocked
        unlockDate
      }
    }
  }
`;