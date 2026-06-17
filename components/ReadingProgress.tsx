import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: string) => void;
};

export const ReadingProgress: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    const ratio = Math.min(Math.max(currentPage / totalPages, 0), 1);
    progressWidth.value = withTiming(ratio * 100, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [currentPage, totalPages]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });

  const percentage = Math.round((currentPage / totalPages) * 100) || 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.label}>PROGRESS</Text>
          <Text style={styles.progressText}>
            {currentPage} <Text style={styles.totalText}>/ {totalPages}</Text>
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Update Page</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={currentPage.toString()}
            onChangeText={onPageChange}
            maxLength={4}
          />
        </View>
      </View>

      <View style={styles.progressBarBg}>
        <Animated.View style={[styles.progressBarFill, animatedProgressStyle]} />
      </View>
      <Text style={styles.percentageText}>{percentage}% completed</Text>
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
    gap: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 12,
    color: Colors.majorelle,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  totalText: {
    color: Colors.textSecondary,
    fontSize: 24,
  },
  inputContainer: {
    alignItems: 'flex-end',
  },
  inputLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    width: 80,
    borderBottomWidth: 2,
    borderBottomColor: Colors.textSecondary,
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingBottom: 4,
  },
  progressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: Colors.bgElevated,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.majorelle,
    borderRadius: 6,
  },
  percentageText: {
    textAlign: 'right',
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
