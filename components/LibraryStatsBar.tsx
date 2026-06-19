import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens } from '../lib/designTokens';

interface LibraryStatsBarProps {
  totalBooks: number;
  pagesRead: number;
  finishedThisMonth: number;
}

export function LibraryStatsBar({ totalBooks, pagesRead, finishedThisMonth }: LibraryStatsBarProps) {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statBox}>
        <Text style={styles.statNumber}>{totalBooks}</Text>
        <Text style={styles.statLabel}>Books</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statNumber}>{pagesRead}</Text>
        <Text style={styles.statLabel}>Pages Read</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statNumber}>{finishedThisMonth}</Text>
        <Text style={styles.statLabel}>Finished (mo)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.m,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: tokens.spacing.s,
    backgroundColor: tokens.colors.elevated,
    borderRadius: tokens.radius,
    marginHorizontal: 4,
  },
  statNumber: {
    color: tokens.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  statLabel: {
    color: tokens.colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
});
