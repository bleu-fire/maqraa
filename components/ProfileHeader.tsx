import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  name: string;
  level: string;
  avatarUri: string;
  totalBooks: number;
  totalHours: number;
};

export const ProfileHeader: React.FC<Props> = ({ name, level, avatarUri, totalBooks, totalHours }) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarGlow} />
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.level}>{level}</Text>
        <Text style={styles.name}>{name}</Text>
        
        <View style={styles.badgesRow}>
          <View style={styles.statBadge}>
            <Text style={styles.statBadgeText}>{totalBooks} Books Finished</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statBadgeText}>{totalHours} Hours Read</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  avatarGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.majorelle,
    opacity: 0.2,
    borderRadius: 50,
    transform: [{ scale: 1.1 }],
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.bgSurface,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.mint,
    borderRadius: 12,
    padding: 2,
    borderWidth: 2,
    borderColor: Colors.bgSurface,
  },
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  level: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.terracotta,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  statBadge: {
    backgroundColor: Colors.bgElevated,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.bgSurface,
  },
  statBadgeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
