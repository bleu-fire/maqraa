import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { tokens } from '../lib/designTokens';
import { BookBadges } from './BookBadges';

export interface Book {
  id: string;
  title: string;
  author: string;
  language: string;
  status: string;
  currentPage: number;
  totalPages: number;
  coverUri: string | null;
}

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const isRtl = book.language === 'ar';
  const progressWidth = useSharedValue(0);
  const progressPercent = book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0;

  useEffect(() => {
    if (book.status === 'in-progress') {
      progressWidth.value = withTiming(progressPercent, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      });
    }
  }, [progressPercent, book.status]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });

  return (
    <View style={[styles.card, isRtl && styles.cardRtl]}>
      <View style={styles.coverPlaceholder} />
      <View style={styles.cardInfo}>
        <Text style={styles.title} numberOfLines={1}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>
        <BookBadges language={book.language} status={book.status} />
        {book.status === 'in-progress' && (
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                animatedProgressStyle,
              ]}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.elevated,
    borderRadius: tokens.radius,
    padding: tokens.spacing.s,
    marginBottom: tokens.spacing.m,
    alignItems: 'center',
  },
  cardRtl: {
    flexDirection: 'row-reverse',
  },
  coverPlaceholder: {
    width: 60,
    height: 90,
    backgroundColor: tokens.colors.surface,
    borderRadius: 4,
  },
  cardInfo: {
    flex: 1,
    marginLeft: tokens.spacing.s,
  },
  title: {
    color: tokens.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  author: {
    color: tokens.colors.textSecondary,
    fontSize: 14,
    marginBottom: tokens.spacing.s,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: tokens.colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: tokens.colors.primary,
  },
});
