import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Language, Status } from './BookCard'; // Reusing types

type Props = {
  title: string;
  author: string;
  language: Language;
  status: Status;
  coverUri?: string;
  totalPages: number;
  rating: number;
};

export const BookHeader: React.FC<Props> = ({
  title,
  author,
  language,
  status,
  coverUri,
  totalPages,
  rating,
}) => {
  const getLanguageColor = (lang: Language) => {
    switch (lang) {
      case 'ar': return Colors.terracotta;
      case 'fr': return Colors.majorelle;
      case 'tz': return Colors.mint;
      default: return Colors.textSecondary;
    }
  };

  const getStatusText = (stat: Status) => {
    switch (stat) {
      case 'to-read': return 'To-Read';
      case 'in-progress': return 'In-Progress';
      case 'finished': return 'Finished';
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= Math.floor(rating) ? 'star' : i - rating <= 0.5 ? 'star-half' : 'star-outline'}
          size={16}
          color={Colors.gold}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <View style={styles.coverWrapper}>
        <View style={styles.coverGlow} />
        {coverUri ? (
          <Image source={{ uri: coverUri }} style={styles.cover} />
        ) : (
          <View style={styles.coverPlaceholder} />
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.badgeRow}>
          <View style={[styles.langBadge, { backgroundColor: getLanguageColor(language) }]}>
            <Text style={styles.langText}>{language.toUpperCase()}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{getStatusText(status)}</Text>
          </View>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <Text style={styles.author}>{author}</Text>
        </View>

        <View style={styles.ratingRow}>
          {renderStars()}
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>

        <Text style={styles.pagesText}>Total Pages: {totalPages}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  coverWrapper: {
    position: 'relative',
    width: 112,
    aspectRatio: 2 / 3,
  },
  coverGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.majorelle,
    opacity: 0.25,
    borderRadius: 12,
    transform: [{ scale: 1.05 }],
  },
  cover: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: Colors.bgElevated,
  },
  infoContainer: {
    flex: 1,
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  langBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  langText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusBadge: {
    backgroundColor: 'rgba(96, 80, 220, 0.15)', // Example default
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.majorelle,
  },
  titleSection: {
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 32,
  },
  author: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  pagesText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});
