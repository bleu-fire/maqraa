import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { BookTopAppBar } from '../../components/BookTopAppBar';
import { BookHeader } from '../../components/BookHeader';
import { ReadingProgress } from '../../components/ReadingProgress';
import { StopwatchControls } from '../../components/StopwatchControls';


// Dummy data for visual layout (Student will replace this with Zustand store)
const MOCK_BOOK = {
  id: '3',
  title: "L'Art de la Simplicité",
  author: 'Dominique Loreau',
  language: 'fr' as const,
  status: 'in-progress' as const,
  coverUri: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=400',
  totalPages: 224,
  rating: 4.2,
};

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams();
  
  // UI State for demonstration (Student will implement real hooks)
  const [currentPage, setCurrentPage] = useState(65);
  const [isRunning, setIsRunning] = useState(false);

  const handlePageChange = (text: string) => {
    const val = parseInt(text) || 0;
    setCurrentPage(val);
  };

  return (
    <View style={styles.container}>
      <BookTopAppBar title={MOCK_BOOK.title} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BookHeader
          title={MOCK_BOOK.title}
          author={MOCK_BOOK.author}
          language={MOCK_BOOK.language}
          status={MOCK_BOOK.status}
          coverUri={MOCK_BOOK.coverUri}
          totalPages={MOCK_BOOK.totalPages}
          rating={MOCK_BOOK.rating}
        />

        <ReadingProgress
          currentPage={currentPage}
          totalPages={MOCK_BOOK.totalPages}
          onPageChange={handlePageChange}
        />

        <StopwatchControls
          formattedTime="00:24:15"
          isRunning={isRunning}
          onStart={() => setIsRunning(true)}
          onPause={() => setIsRunning(false)}
          onStop={() => setIsRunning(false)}
        />

        {/* Session Stats Component (inline for simplicity or can be extracted) */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Pages Session</Text>
            <Text style={[styles.statValue, { color: Colors.mint }]}>+12</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Time Elapsed</Text>
            <Text style={[styles.statValue, { color: Colors.majorelle }]}>24m</Text>
          </View>
        </View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgBase,
  },
  scrollContent: {
    paddingTop: 100, // accommodate for TopAppBar
    paddingBottom: 140, // accommodate for StatusActions at bottom
    gap: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 24,
    paddingHorizontal: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.bgSurface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.bgElevated,
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
});
