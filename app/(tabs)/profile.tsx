import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Colors } from '../../constants/Colors';
import { ProfileHeader } from '../../components/ProfileHeader';
import { MonthlyBarChart } from '../../components/MonthlyBarChart';
import { StreakCalendar } from '../../components/StreakCalendar';
import { AchievementBadge } from '../../components/AchievementBadge';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock Data
const MOCK_USER = {
  name: 'Ahmad Al-Mansour',
  level: 'Scholar Level',
  avatarUri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  totalBooks: 42,
  totalHours: 124,
};

const MOCK_CHART_DATA = [
  { day: '1', pages: 12 }, { day: '2', pages: 45 }, { day: '3', pages: 20 },
  { day: '4', pages: 0 }, { day: '5', pages: 65 }, { day: '6', pages: 30 },
  { day: '7', pages: 40 }, { day: '8', pages: 10 }, { day: '9', pages: 5 },
  { day: '10', pages: 55 }, { day: '11', pages: 80 }, { day: '12', pages: 15 },
  { day: '13', pages: 0 }, { day: '14', pages: 0 }, { day: '15', pages: 25 },
];

// Generate 30 days of random intensity (0 to 4)
const MOCK_STREAK_DAYS = Array.from({ length: 30 }, () => Math.floor(Math.random() * 5));

const MOCK_ACHIEVEMENTS = [
  { id: '1', title: '7-Day Streak', description: 'Read 7 days in a row.', iconName: 'flame' as const, isUnlocked: true },
  { id: '2', title: 'Night Owl', description: 'Read past midnight.', iconName: 'moon' as const, isUnlocked: true },
  { id: '3', title: 'Bookworm', description: 'Finish 50 books.', iconName: 'library' as const, isUnlocked: false },
  { id: '4', title: 'Polyglot', description: 'Read in 3 languages.', iconName: 'language' as const, isUnlocked: false },
];

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
        <SafeAreaView>
                <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Profile & Stats</Text>
        <Ionicons name="settings-outline" size={24} color={Colors.textPrimary} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProfileHeader {...MOCK_USER} />

        <MonthlyBarChart data={MOCK_CHART_DATA} />

        <StreakCalendar days={MOCK_STREAK_DAYS} />

        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.badgesGrid}>
            {MOCK_ACHIEVEMENTS.map((badge) => (
              <View key={badge.id} style={styles.badgeWrapper}>
                <AchievementBadge {...badge} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
        </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgBase,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bgElevated,
    backgroundColor: Colors.bgSurface,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scrollContent: {
    paddingVertical: 32,
    gap: 32,
  },
  achievementsSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  badgeWrapper: {
    width: '47%', // 2 columns with gap
  },
});
