import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function DashboardScreen() {
  const { colors } = useTheme();

  // Mock data for demonstration
  const games = [
    {
      id: '1',
      title: 'The Witcher 3: Wild Hunt',
      coverImage: 'https://via.placeholder.com/150x200/3b82f6/ffffff?text=TW3',
      platform: 'PC',
      status: 'completed',
      playtime: 120,
      totalAchievements: 120,
      unlockedAchievements: 120,
    },
    {
      id: '2',
      title: 'Cyberpunk 2077',
      coverImage: 'https://via.placeholder.com/150x200/ef4444/ffffff?text=CP2077',
      platform: 'PC',
      status: 'playing',
      playtime: 45,
      totalAchievements: 80,
      unlockedAchievements: 32,
    },
    {
      id: '3',
      title: 'Red Dead Redemption 2',
      coverImage: 'https://via.placeholder.com/150x200/10b981/ffffff?text=RDR2',
      platform: 'PlayStation',
      status: 'on-hold',
      playtime: 65,
      totalAchievements: 100,
      unlockedAchievements: 45,
    },
    {
      id: '4',
      title: 'Hades',
      coverImage: 'https://via.placeholder.com/150x200/8b5cf6/ffffff?text=Hades',
      platform: 'Nintendo Switch',
      status: 'planned',
      playtime: 0,
      totalAchievements: 60,
      unlockedAchievements: 0,
    },
  ];

  const renderGameItem = ({ item }: { item: any }) => {
    const achievementPercentage = item.totalAchievements > 0 
      ? Math.round((item.unlockedAchievements / item.totalAchievements) * 100) 
      : 0;

    return (
      <TouchableOpacity 
        style={[styles.gameCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Image source={{ uri: item.coverImage }} style={styles.gameCover} />
        <View style={styles.gameInfo}>
          <Text style={[styles.gameTitle, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.gamePlatform, { color: colors.text }]}>
            {item.platform}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${achievementPercentage}%`,
                  backgroundColor: colors.primary 
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: colors.text }]}>
            {item.unlockedAchievements}/{item.totalAchievements} achievements
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>My Game Library</Text>
      <FlatList
        data={games}
        renderItem={renderGameItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.gameList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  gameList: {
    paddingBottom: 16,
  },
  gameCard: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  gameCover: {
    width: 80,
    height: 100,
  },
  gameInfo: {
    flex: 1,
    padding: 12,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gamePlatform: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#374151',
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 12,
  },
});