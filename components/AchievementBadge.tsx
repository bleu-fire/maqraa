import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  isUnlocked: boolean;
};

export const AchievementBadge: React.FC<Props> = ({ title, description, iconName, isUnlocked }) => {
  return (
    <View style={[styles.container, !isUnlocked && styles.containerLocked]}>
      <View style={styles.iconContainer}>
        {isUnlocked && <View style={styles.iconGlow} />}
        <Ionicons 
          name={iconName} 
          size={32} 
          color={isUnlocked ? Colors.gold : Colors.textMuted} 
        />
      </View>
      <Text style={[styles.title, !isUnlocked && styles.textLocked]}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.bgElevated,
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  containerLocked: {
    opacity: 0.5,
  },
  iconContainer: {
    position: 'relative',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.bgElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.gold,
    opacity: 0.15,
    borderRadius: 32,
    transform: [{ scale: 1.2 }],
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  textLocked: {
    color: Colors.textSecondary,
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
