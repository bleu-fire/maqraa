import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { tokens } from '../../lib/designTokens';
import { ProgressRingHeader } from '../../components/ProgressRingHeader';
import { LibraryFilterBar } from '../../components/LibraryFilterBar';
import { LibraryStatsBar } from '../../components/LibraryStatsBar';
import { BookCard, Book } from '../../components/BookCard';
import { useBookStore } from '../../store/useBookStore';

export default function LibraryScreen() {
  const router = useRouter();
  const books = useBookStore((state) => state.books);
  const profile = useBookStore((state) => state.profile);
  const stats = useBookStore((state) => state.stats);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterLang, setFilterLang] = useState<string | null>(null);

  // Filter the actual books from Zustand
  const filtered = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus ? b.status === filterStatus : true;
    // We didn't add language to the add-book form yet, so this might be undefined for new books. Let's handle it safely.
    const matchesLang = filterLang ? b.language === filterLang : true; 
    return matchesSearch && matchesStatus && matchesLang;
  });

  // Yearly goal dynamically from profile
  const yearlyGoal = profile.yearlyGoal;
  const finishedCount = books.filter((b) => b.status === 'finished').length;
  const goalPercent = yearlyGoal > 0 ? Math.round((finishedCount / yearlyGoal) * 100) : 0;

  // Stats dynamically from global state
  const totalBooks = stats.totalBooks;
  const pagesRead = stats.totalPages;
  const finishedThisMonth = 0; // Can be derived from history later

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProgressRingHeader progressPercent={goalPercent} label="Yearly Goal" />

      <LibraryStatsBar
        totalBooks={totalBooks}
        pagesRead={pagesRead}
        finishedThisMonth={finishedThisMonth}
      />

      <LibraryFilterBar
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterLang={filterLang}
        setFilterLang={setFilterLang}
      />

      {/* Book list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/book/${item.id}` as any)}>
            <BookCard book={item} />
          </TouchableOpacity>
        )}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/add-book' as any)}>
        <AntDesign name="plus" size={24} color={tokens.colors.textPrimary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.bgBase,
    padding: tokens.spacing.m,
  },
  listContent: {
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    right: tokens.spacing.l,
    bottom: tokens.spacing.l,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
