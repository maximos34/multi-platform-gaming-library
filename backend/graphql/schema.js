const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Game {
    id: ID!
    title: String!
    description: String
    releaseDate: String
    developer: String
    publisher: String
    genres: [String!]!
    platforms: [String!]!
    coverImage: String
    screenshots: [String!]!
    trailerUrl: String
    steamAppId: String
    epicGameId: String
    xboxGameId: String
    playstationGameId: String
    metacriticScore: Int
    averagePlaytime: Int
    systemRequirements: SystemRequirements
    achievements: [Achievement!]!
    createdAt: String!
    updatedAt: String!
  }

  type SystemRequirements {
    minimum: Requirement
    recommended: Requirement
  }

  type Requirement {
    os: String
    processor: String
    memory: String
    graphics: String
    storage: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
    profileImage: String
    bio: String
    connectedAccounts: ConnectedAccounts
    preferences: UserPreferences
    stats: UserStats
    userGames: [UserGame!]!
    createdAt: String!
    updatedAt: String!
  }

  type ConnectedAccounts {
    steam: SteamAccount
    epic: EpicAccount
    xbox: XboxAccount
    playstation: PlaystationAccount
  }

  type SteamAccount {
    id: String
    username: String
    avatar: String
  }

  type EpicAccount {
    id: String
    username: String
  }

  type XboxAccount {
    id: String
    gamertag: String
    avatar: String
  }

  type PlaystationAccount {
    id: String
    onlineId: String
    avatar: String
  }

  type UserPreferences {
    theme: String
    language: String
    notifications: NotificationPreferences
  }

  type NotificationPreferences {
    email: Boolean
    push: Boolean
  }

  type UserStats {
    totalGames: Int!
    completedGames: Int!
    totalAchievements: Int!
    unlockedAchievements: Int!
  }

  type Achievement {
    id: ID!
    name: String!
    description: String!
    gameId: ID!
    steamAchievementId: String
    epicAchievementId: String
    xboxAchievementId: String
    playstationAchievementId: String
    globalPercentage: Float
    points: Int
    icon: String
    iconLocked: String
    isHidden: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type UserGame {
    id: ID!
    userId: ID!
    gameId: ID!
    status: String!
    playtime: Int!
    lastPlayed: String
    isManuallyAdded: Boolean!
    platform: String
    achievements: [UserAchievement!]!
    totalAchievements: Int!
    unlockedAchievements: Int!
    notes: String
    rating: Int
    tags: [String!]!
    categories: [String!]!
    game: Game!
    addedAt: String!
    updatedAt: String!
  }

  type UserAchievement {
    achievementId: ID!
    unlocked: Boolean!
    unlockDate: String
    achievement: Achievement!
  }

  type Query {
    # Game queries
    games(limit: Int, offset: Int, search: String, genre: String, platform: String): [Game!]!
    game(id: ID!): Game
    
    # User queries
    users(limit: Int, offset: Int): [User!]!
    user(id: ID!): User
    me: User
    
    # Achievement queries
    achievements(gameId: ID, limit: Int, offset: Int): [Achievement!]!
    achievement(id: ID!): Achievement
    
    # UserGame queries
    userGames(userId: ID!, limit: Int, offset: Int, status: String): [UserGame!]!
    userGame(id: ID!): UserGame
    
    # Stats queries
    dashboardStats: DashboardStats
  }

  type DashboardStats {
    totalGames: Int!
    completedGames: Int!
    totalPlaytime: Int!
    totalAchievements: Int!
    unlockedAchievements: Int!
  }

  type Mutation {
    # Game mutations
    createGame(input: CreateGameInput!): Game!
    updateGame(id: ID!, input: UpdateGameInput!): Game!
    deleteGame(id: ID!): Boolean!
    
    # User mutations
    register(input: RegisterInput!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    connectSteamAccount(input: SteamAccountInput!): User!
    connectEpicAccount(input: EpicAccountInput!): User!
    connectXboxAccount(input: XboxAccountInput!): User!
    connectPlaystationAccount(input: PlaystationAccountInput!): User!
    
    # Achievement mutations
    createAchievement(input: CreateAchievementInput!): Achievement!
    updateAchievement(id: ID!, input: UpdateAchievementInput!): Achievement!
    deleteAchievement(id: ID!): Boolean!
    
    # UserGame mutations
    addUserGame(input: AddUserGameInput!): UserGame!
    updateUserGame(id: ID!, input: UpdateUserGameInput!): UserGame!
    removeUserGame(id: ID!): Boolean!
    
    # UserAchievement mutations
    unlockAchievement(userGameId: ID!, achievementId: ID!): UserGame!
    lockAchievement(userGameId: ID!, achievementId: ID!): UserGame!
  }

  input CreateGameInput {
    title: String!
    description: String
    releaseDate: String
    developer: String
    publisher: String
    genres: [String!]!
    platforms: [String!]!
    coverImage: String
    screenshots: [String!]!
    trailerUrl: String
    steamAppId: String
    epicGameId: String
    xboxGameId: String
    playstationGameId: String
    metacriticScore: Int
    averagePlaytime: Int
    systemRequirements: SystemRequirementsInput
  }

  input SystemRequirementsInput {
    minimum: RequirementInput
    recommended: RequirementInput
  }

  input RequirementInput {
    os: String
    processor: String
    memory: String
    graphics: String
    storage: String
  }

  input UpdateGameInput {
    title: String
    description: String
    releaseDate: String
    developer: String
    publisher: String
    genres: [String!]
    platforms: [String!]
    coverImage: String
    screenshots: [String!]
    trailerUrl: String
    steamAppId: String
    epicGameId: String
    xboxGameId: String
    playstationGameId: String
    metacriticScore: Int
    averagePlaytime: Int
    systemRequirements: SystemRequirementsInput
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input UpdateUserInput {
    username: String
    email: String
    profileImage: String
    bio: String
    preferences: UserPreferencesInput
  }

  input UserPreferencesInput {
    theme: String
    language: String
    notifications: NotificationPreferencesInput
  }

  input NotificationPreferencesInput {
    email: Boolean
    push: Boolean
  }

  input SteamAccountInput {
    id: String!
    username: String!
    avatar: String
  }

  input EpicAccountInput {
    id: String!
    username: String!
  }

  input XboxAccountInput {
    id: String!
    gamertag: String!
    avatar: String
  }

  input PlaystationAccountInput {
    id: String!
    onlineId: String!
    avatar: String
  }

  input CreateAchievementInput {
    name: String!
    description: String!
    gameId: ID!
    steamAchievementId: String
    epicAchievementId: String
    xboxAchievementId: String
    playstationAchievementId: String
    globalPercentage: Float
    points: Int
    icon: String
    iconLocked: String
    isHidden: Boolean!
  }

  input UpdateAchievementInput {
    name: String
    description: String
    gameId: ID
    steamAchievementId: String
    epicAchievementId: String
    xboxAchievementId: String
    playstationAchievementId: String
    globalPercentage: Float
    points: Int
    icon: String
    iconLocked: String
    isHidden: Boolean
  }

  input AddUserGameInput {
    gameId: ID!
    platform: String
    status: String
    tags: [String!]
    categories: [String!]
  }

  input UpdateUserGameInput {
    status: String
    playtime: Int
    lastPlayed: String
    notes: String
    rating: Int
    tags: [String!]
    categories: [String!]
  }

  type AuthPayload {
    user: User!
    token: String!
  }
`;

module.exports = typeDefs;