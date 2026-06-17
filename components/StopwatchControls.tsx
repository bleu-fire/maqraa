import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  formattedTime: string;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  isRunning: boolean;
};

export const StopwatchControls: React.FC<Props> = ({
  formattedTime,
  onStart,
  onPause,
  onStop,
  isRunning,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>SESSION TIMER</Text>
      <Text style={styles.timerDisplay}>{formattedTime}</Text>

      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[styles.button, styles.startButton, isRunning && styles.buttonDisabled]}
          onPress={onStart}
          disabled={isRunning}
        >
          <Ionicons name="play" size={32} color="#FFFFFF" />
          <Text style={styles.buttonTextWhite}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.pauseButton, !isRunning && styles.buttonDisabled]}
          onPress={onPause}
          disabled={!isRunning}
        >
          <Ionicons name="pause" size={32} color={Colors.textPrimary} />
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={onStop}>
          <Ionicons name="stop" size={32} color={Colors.terracotta} />
          <Text style={[styles.buttonText, { color: Colors.terracotta }]}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1A24', // slightly lighter surface container high
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.bgElevated,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  label: {
    fontSize: 12,
    color: '#E2DFFF', // primary fixed
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 12,
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -1,
    marginBottom: 32,
    fontVariant: ['tabular-nums'],
  },
  controlsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 16,
  },
  button: {
    flex: 1,
    maxWidth: 100,
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startButton: {
    backgroundColor: Colors.majorelle,
  },
  pauseButton: {
    borderWidth: 1.5,
    borderColor: Colors.bgElevated,
  },
  stopButton: {
    backgroundColor: 'rgba(192, 113, 79, 0.1)', // Terracotta tinted background
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextWhite: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
});
