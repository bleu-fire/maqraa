import React, { useState } from 'react';
import { View, StyleSheet, FlatList,   } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { TopAppBar } from '../../components/TopAppBar';
import { StatsBar } from '../../components/StatsBar';
import { FilterBar } from '../../components/FilterBar';
import { BookCard, Language, Status } from '../../components/BookCard';
import { FAB } from '../../components/FAB';
import { ProgressRing } from '../../components/ProgressRing';

// Dummy data for visual layout (since we don't have the Zustand store yet)

const MOCK_BOOKS = [
  {
    id: '1',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    language: 'en' as Language,
    status: 'in-progress' as Status,
    coverUri: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    progressPercent: 65,
  },
  {
    id: '2',
    title: 'مقدمة ابن خلدون',
    author: 'ابن خلدون',
    language: 'ar' as Language,
    status: 'to-read' as Status,
    coverUri: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
    progressPercent: 0,
  },
  {
    id: '3',
    title: "L'Art de la Simplicité",
    author: 'Dominique Loreau',
    language: 'fr' as Language,
    status: 'finished' as Status,
    coverUri: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=400',
    progressPercent: 100,
  },
];

export default function LibraryDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <SafeAreaView style={styles.container}>
      <TopAppBar />
      
      <FlatList
        data={MOCK_BOOKS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            <View style={styles.progressContainer}>
              <ProgressRing current={12} goal={24} size={200} />
            </View>
            <StatsBar totalBooks={42} pagesRead={1850} finishedThisMonth={4} />
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterSelect={setActiveFilter}
            />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.bookCardWrapper}>
            <BookCard {...item} onPress={() => console.log('Book pressed', item.title)} />
          </View>
        )}
      />

      <FAB onPress={() => console.log('FAB pressed')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgBase,
  },
  listContent: {
    paddingBottom: 120, // space for FAB and potentially bottom nav
  },
  headerSection: {
    gap: 32,
    paddingVertical: 24,
  },
  progressContainer: {
    alignItems: 'center',
  },
  bookCardWrapper: {
    marginBottom: 16,
  },
});
