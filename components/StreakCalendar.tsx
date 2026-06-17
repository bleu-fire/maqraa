import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

type Props = {
  // Array of reading intensities from 0 to 4 (like GitHub) for the past 30 days
  days: number[]; 
};

export const StreakCalendar: React.FC<Props> = ({ days }) => {
  // Group days into columns of 5 (for a 6x5 grid representation of 30 days)
  const columns = [];
  for (let i = 0; i < 30; i += 5) {
    columns.push(days.slice(i, i + 5));
  }

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return Colors.bgElevated;
      case 1: return 'rgba(62, 180, 137, 0.3)';
      case 2: return 'rgba(62, 180, 137, 0.5)';
      case 3: return 'rgba(62, 180, 137, 0.8)';
      case 4: return Colors.mint;
      default: return Colors.bgElevated;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reading Activity</Text>
        <Text style={styles.streakText}>18 Day Streak <Text style={styles.fireEmoji}>🔥</Text></Text>
      </View>
      
      <View style={styles.gridContainer}>
        {columns.map((col, colIndex) => (
          <View key={colIndex} style={styles.column}>
            {col.map((intensity, rowIndex) => (
              <View
                key={`${colIndex}-${rowIndex}`}
                style={[
                  styles.daySquare,
                  { backgroundColor: getIntensityColor(intensity) }
                ]}
              />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.legendContainer}>
        <Text style={styles.legendText}>Less</Text>
        <View style={[styles.legendSquare, { backgroundColor: getIntensityColor(0) }]} />
        <View style={[styles.legendSquare, { backgroundColor: getIntensityColor(1) }]} />
        <View style={[styles.legendSquare, { backgroundColor: getIntensityColor(2) }]} />
        <View style={[styles.legendSquare, { backgroundColor: getIntensityColor(3) }]} />
        <View style={[styles.legendSquare, { backgroundColor: getIntensityColor(4) }]} />
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.bgElevated,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.terracotta,
  },
  fireEmoji: {
    fontSize: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  column: {
    gap: 8,
  },
  daySquare: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    marginTop: 24,
  },
  legendText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginHorizontal: 4,
  },
  legendSquare: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
});
