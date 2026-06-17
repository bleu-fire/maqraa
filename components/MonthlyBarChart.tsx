import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../constants/Colors';

type DataPoint = {
  day: string;
  pages: number;
};

type Props = {
  data: DataPoint[];
};

export const MonthlyBarChart: React.FC<Props> = ({ data }) => {
  const chartHeight = 150;
  const maxPages = Math.max(...data.map((d) => d.pages), 10); // Minimum 10 to avoid division by zero
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pages Read this Month</Text>
      <View style={styles.chartContainer}>
        <Svg width="100%" height={chartHeight} style={styles.svg}>
          <Defs>
            <LinearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={Colors.majorelle} stopOpacity="1" />
              <Stop offset="1" stopColor={Colors.majorelle} stopOpacity="0.2" />
            </LinearGradient>
          </Defs>
          {data.map((point, index) => {
            const barHeight = (point.pages / maxPages) * chartHeight;
            // Spread bars evenly. Simple percentage-based X position
            const barWidth = 8;
            const xPos = `${(index / Math.max(data.length - 1, 1)) * 100}%`;
            return (
              <Rect
                key={index}
                x={xPos}
                y={chartHeight - barHeight}
                width={barWidth}
                height={barHeight}
                fill="url(#barGradient)"
                rx={4}
                // Offset x by -4 (half width) to center align with the percentage
                transform={`translate(-4, 0)`}
              />
            );
          })}
        </Svg>
      </View>
      <View style={styles.labelsContainer}>
        {data.map((point, index) => {
          // Only show some labels to prevent overcrowding
          if (index % Math.ceil(data.length / 5) === 0 || index === data.length - 1) {
            return (
              <Text key={index} style={styles.label}>
                {point.day}
              </Text>
            );
          }
          return <View key={index} style={styles.labelPlaceholder} />;
        })}
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 24,
  },
  chartContainer: {
    height: 150,
    width: '100%',
  },
  svg: {
    overflow: 'visible',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  label: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  labelPlaceholder: {
    width: 20, // Approximate width of a label to maintain spacing
  },
});
