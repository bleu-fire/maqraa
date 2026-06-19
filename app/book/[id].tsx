import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import BookDetailScreen from '../../components/BookDetailScreen';
import { tokens } from '../../lib/designTokens';

import { useBookStore } from '../../store/useBookStore';

export default function BookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const books = useBookStore((state) => state.books);
  
  const book = books.find((b) => b.id === id);

  if (!book) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: tokens.colors.bgBase }}>
        <Text style={{ color: tokens.colors.textPrimary }}>Book not found</Text>
      </View>
    );
  }

  return (
    <BookDetailScreen
      bookId={book.id}
      coverUri={book.coverUri ?? undefined}
      title={book.title}
      author={book.author}
      totalPages={book.totalPages}
      currentPage={book.currentPage}
      language={book.language as any}
      status={book.status as any}
      rating={0} // Mock rating
    />
  );
}
