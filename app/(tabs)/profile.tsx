import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Rect } from 'react-native-svg';

import { tokens } from '../../lib/designTokens';
import { formatTime } from '../../lib/utils';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

import { useBookStore } from '../../store/useBookStore';

const mockMonthly = [
  { month: 'Jan', finished: 2 },
  { month: 'Feb', finished: 1 },
  { month: 'Mar', finished: 3 },
  { month: 'Apr', finished: 0 },
  { month: 'May', finished: 1 },
  { month: 'Jun', finished: 2 },
];

export default function ProfileScreen() {
  const profile = useBookStore((state) => state.profile);
  const stats = useBookStore((state) => state.stats);
  const history = useBookStore((state) => state.history);
  const updateProfileAvatar = useBookStore((state) => state.updateProfileAvatar);
  const updateProfileName = useBookStore((state) => state.updateProfileName);

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      updateProfileAvatar(result.assets[0].uri);
    }
  };

  const renderHistoryItem = ({ item, index }: any) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()} 
      style={styles.historyItem}
    >
      <Text style={styles.historyTitle}>{item.bookTitle}</Text>
      <Text style={styles.historySubtitle}>{item.date}</Text>
      <View style={styles.historyStats}>
        <Text style={styles.statText}>📖 {item.pagesRead} pages</Text>
        <Text style={styles.statText}>⏱ {formatTime(item.durationSec)}</Text>
      </View>
    </Animated.View>
  );

  const renderBar = ({ item }: any) => <AnimatedSvgBar item={item} />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Profile Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePickAvatar} style={styles.avatarWrapper}>
          {profile.avatarUri ? (
            <Image source={{ uri: profile.avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <AntDesign name="user" size={48} color={tokens.colors.textSecondary} />
            </View>
          )}
        </TouchableOpacity>
        <TextInput 
          style={styles.nameInput}
          value={profile.name}
          onChangeText={updateProfileName}
          placeholder="Enter your name"
          placeholderTextColor={tokens.colors.textSecondary}
        />
      </View>

      {/* Cumulative Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.totalBooks}</Text>
          <Text style={styles.statLabel}>Books</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.totalPages}</Text>
          <Text style={styles.statLabel}>Pages</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{formatTime(stats.totalTimeSec)}</Text>
          <Text style={styles.statLabel}>Reading Time</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.streakDays}</Text>
          <Text style={styles.statLabel}>Streak (days)</Text>
        </View>
      </View>

      {/* Monthly Bar Chart */}
      <Text style={styles.sectionHeader}>Books Finished per Month</Text>
      <View style={styles.barChart}>
        <FlatList 
          data={mockMonthly} 
          renderItem={renderBar} 
          keyExtractor={item => item.month} 
          horizontal 
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Reading History */}
      <Text style={styles.sectionHeader}>Recent Sessions</Text>
      <FlatList 
        data={history} 
        renderItem={renderHistoryItem} 
        keyExtractor={item => item.id} 
        contentContainerStyle={styles.historyList} 
      />
    </SafeAreaView>
  );
}

function AnimatedSvgBar({ item }: { item: any }) {
  const animatedHeight = useSharedValue(0);
  const maxHeight = 80;
  const targetHeight = Math.min(item.finished * 20, maxHeight); // scale factor

  React.useEffect(() => {
    animatedHeight.value = withTiming(targetHeight, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, [targetHeight]);

  const animatedProps = useAnimatedProps(() => ({
    height: animatedHeight.value,
    y: maxHeight - animatedHeight.value, // push down to align bottom
  }));

  return (
    <View style={styles.barContainer}>
      <Text style={styles.barLabel}>{item.month}</Text>
      <View style={styles.svgWrapper}>
        <Svg width={20} height={maxHeight}>
          {/* Background Bar */}
          <Rect
            x={0}
            y={0}
            width={20}
            height={maxHeight}
            fill={tokens.colors.surface}
            rx={4}
          />
          {/* Animated Foreground Bar */}
          <AnimatedRect
            x={0}
            width={20}
            fill={tokens.colors.tertiary}
            rx={4}
            animatedProps={animatedProps}
          />
        </Svg>
      </View>
      <Text style={styles.barCount}>{item.finished}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.bgBase, padding: tokens.spacing.m },
  header: { alignItems: 'center', marginBottom: tokens.spacing.l },
  avatarWrapper: { marginBottom: tokens.spacing.s },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: tokens.colors.surface },
  avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: tokens.colors.surface, justifyContent: 'center', alignItems: 'center' },
  nameInput: { color: tokens.colors.textPrimary, fontSize: 20, fontWeight: '600', textAlign: 'center', minWidth: 150, padding: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: tokens.spacing.l },
  statBox: { flex: 1, alignItems: 'center', padding: tokens.spacing.s, backgroundColor: tokens.colors.elevated, borderRadius: tokens.radius, marginHorizontal: 4 },
  statNumber: { color: tokens.colors.textPrimary, fontSize: 18, fontWeight: '600' },
  statLabel: { color: tokens.colors.textSecondary, fontSize: 12 },
  sectionHeader: { color: tokens.colors.textPrimary, fontSize: 16, fontWeight: '500', marginBottom: tokens.spacing.s, marginTop: tokens.spacing.m },
  barChart: { marginBottom: tokens.spacing.l },
  barContainer: { alignItems: 'center', marginHorizontal: 8 },
  barLabel: { color: tokens.colors.textSecondary, fontSize: 12, marginBottom: 4 },
  svgWrapper: { width: 20, height: 80, overflow: 'hidden' },
  barCount: { color: tokens.colors.textPrimary, fontSize: 12, marginTop: 4 },
  historyList: { paddingBottom: 80 },
  historyItem: { backgroundColor: tokens.colors.elevated, borderRadius: tokens.radius, padding: tokens.spacing.s, marginBottom: tokens.spacing.s },
  historyTitle: { color: tokens.colors.textPrimary, fontSize: 14, fontWeight: '600' },
  historySubtitle: { color: tokens.colors.textSecondary, fontSize: 12, marginBottom: tokens.spacing.s },
  historyStats: { flexDirection: 'row', justifyContent: 'space-between' },
  statText: { color: tokens.colors.textSecondary, fontSize: 12 },
});
