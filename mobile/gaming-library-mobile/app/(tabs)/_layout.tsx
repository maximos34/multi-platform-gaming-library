import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Games',
          tabBarIcon: ({ color }) => <TabBarIcon name="game-controller" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabBarIcon(props: {
  name: string;
  color: string;
}) {
  // Simple icon component - in a real app you might use react-native-vector-icons
  return (
    <Text style={{ color: props.color, fontSize: 20 }}>
      {props.name === 'home' ? '🏠' : '🎮'}
    </Text>
  );
}

// Add this import at the top if not already present
import { Text } from 'react-native';