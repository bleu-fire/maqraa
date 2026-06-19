import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { tokens } from '../lib/designTokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingHeaderProps {
  progressPercent: number;
  label: string;
}

export function ProgressRingHeader({ progressPercent, label }: ProgressRingHeaderProps) {
  const radius = 54;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progressPercent, {
      duration: 1200,
      easing: Easing.out(Easing.exp),
    });
  }, [progressPercent]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (circumference * animatedProgress.value) / 100;
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={styles.header}>
      <View style={styles.ringContainer}>
        <Svg width={120} height={120} style={styles.svg}>
          {/* Background Track */}
          <Circle
            cx={60}
            cy={60}
            r={radius}
            stroke={tokens.colors.surface}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Fill */}
          <AnimatedCircle
            cx={60}
            cy={60}
            r={radius}
            stroke={tokens.colors.tertiary}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            strokeLinecap="round"
          />
        </Svg>
        <View style={styles.textContainer}>
          <Text style={styles.progressText}>{progressPercent}%</Text>
        </View>
      </View>
      <Text style={styles.headerTitle}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: tokens.spacing.l,
  },
  ringContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: tokens.colors.textPrimary,
    fontSize: 24,
    fontWeight: '600',
  },
  headerTitle: {
    marginTop: tokens.spacing.s,
    color: tokens.colors.textSecondary,
    fontSize: 14,
  },
});
