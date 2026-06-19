import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens } from '../lib/designTokens';

interface BookBadgesProps {
  language: string;
  status: string;
}

export function BookBadges({ language, status }: BookBadgesProps) {
  const languageBadge = () => {
    const safeLang = language || 'en'; // Default to 'en' if undefined
    switch (safeLang) {
      case 'ar':
        return { label: 'AR', bg: tokens.colors.badgeAr };
      case 'fr':
        return { label: 'FR', bg: tokens.colors.badgeFr };
      case 'tz':
        return { label: 'TZ', bg: tokens.colors.badgeTz };
      default:
        return { label: safeLang.toUpperCase(), bg: tokens.colors.secondary };
    }
  };

  const statusBadge = () => {
    const bg =
      status === 'to-read'
        ? tokens.colors.secondary
        : status === 'in-progress'
        ? tokens.colors.primary
        : tokens.colors.tertiary;
    return { label: status.replace('-', ' '), bg };
  };

  const lang = languageBadge();
  const stat = statusBadge();

  return (
    <View style={styles.badgeRow}>
      <View style={[styles.badge, { backgroundColor: lang.bg }]}>
        <Text style={styles.badgeText}>{lang.label}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: stat.bg }]}>
        <Text style={styles.badgeText}>{stat.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: 'row',
    gap: tokens.spacing.s,
    marginBottom: 4,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: tokens.spacing.s,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
});
