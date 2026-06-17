import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  current: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
};

export const ProgressRing: React.FC<Props> = ({ current, goal, size = 200, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressValue = useSharedValue(0);

  useEffect(() => {
    // Animate progress to current/goal
    const targetProgress = Math.min(Math.max(current / goal, 0), 1);
    progressValue.value = withTiming(targetProgress, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });
  }, [current, goal]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * (1 - progressValue.value),
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.bgElevated}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress fill */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.majorelle}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          // Rotate -90deg to start from the top
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFillObject, styles.textContainer]}>
        <Text style={styles.valueText}>
          {current} / {goal}
        </Text>
        <Text style={styles.label}>GOAL: 2024</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.majorelle,
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 4,
  },
});
