import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

type Props = {
  totalBooks: number;
  pagesRead: number;
  finishedThisMonth: number;
};

export const StatsBar: React.FC<Props> = ({ totalBooks, pagesRead, finishedThisMonth }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Total</Text>
        <Text style={[styles.statValue, { color: Colors.majorelle }]}>{totalBooks}</Text>
        <Text style={styles.statUnit}>BOOKS</Text>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Reading</Text>
        <Text style={[styles.statValue, { color: Colors.mint }]}>{pagesRead}</Text>
        <Text style={styles.statUnit}>PAGES</Text>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Finished</Text>
        <Text style={[styles.statValue, { color: Colors.terracotta }]}>{finishedThisMonth}</Text>
        <Text style={styles.statUnit}>THIS MONTH</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.bgSurface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.bgElevated,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  statUnit: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
