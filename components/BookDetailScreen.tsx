import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { tokens } from '../lib/designTokens';
import { ProgressRingHeader } from './ProgressRingHeader';
import { BookBadges } from './BookBadges';

import { useBookStore } from '../store/useBookStore';

type Props = {
  bookId: string;
  coverUri?: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  language: 'ar' | 'fr' | 'tz';
  status: 'to-read' | 'in-progress' | 'finished';
  rating?: number; // 0‑5
};



export default function BookDetailScreen({
  bookId,
  coverUri,
  title,
  author,
  totalPages,
  currentPage: initialCurrentPage,
  language,
  status: initialStatus,
  rating = 0,
}: Props) {
  const addSession = useBookStore((state) => state.addSession);
  const deleteBook = useBookStore((state) => state.deleteBook);
  const router = useRouter();
  
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [status, setStatus] = useState(initialStatus);
  const [pageInput, setPageInput] = useState(String(currentPage));
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);


  // Sync external current page to input when it changes initially
  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  // Stopwatch Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStopwatchRunning(true);
  };

  const handlePause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStopwatchRunning(false);
  };

  const handleStop = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setStopwatchRunning(false);
    
    const currentParsedPage = parseInt(pageInput) || currentPage;
    const pagesReadDuringSession = Math.max(0, currentParsedPage - currentPage);

    // Save reading session to Zustand store
    if (elapsedSeconds > 0) {
      addSession({
        id: Math.random().toString(36).substring(7),
        bookTitle: title,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        pagesRead: pagesReadDuringSession,
        durationSec: elapsedSeconds,
      });
    }

    // Update local state (UI only for now, later we'll update the book's current page in store)
    setCurrentPage(currentParsedPage);
    setElapsedSeconds(0);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            deleteBook(bookId);
            router.back();
          }
        }
      ]
    );
  };

  const handleStatusChange = (newStatus: 'in-progress' | 'finished') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStatus(newStatus);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <AntDesign
          key={i}
          name={i <= rating ? 'star' : ('staro' as any)}
          size={16}
          color={tokens.colors.tertiary}
        />,
      );
    }
    return <View style={styles.starRow}>{stars}</View>;
  };

  const currentParsedPage = parseInt(pageInput) || currentPage;
  const progressPercent = totalPages > 0 ? Math.round((currentParsedPage / totalPages) * 100) : 0;
  const pagesReadDuringSession = Math.max(0, currentParsedPage - currentPage);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with cover image */}
      <View style={styles.header}>
        {coverUri ? (
          <Image source={{ uri: coverUri }} style={styles.cover} />
        ) : (
          <View style={styles.coverPlaceholder} />
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.author}>{author}</Text>
          <BookBadges language={language} status={status} />
          {renderStars()}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.statusActionRow}>
        <TouchableOpacity
          style={[styles.statusBtn, status === 'in-progress' && styles.statusBtnActive]}
          onPress={() => handleStatusChange('in-progress')}
        >
          <Text style={[styles.statusBtnText, status === 'in-progress' && styles.statusBtnTextActive]}>In Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusBtn, status === 'finished' && styles.statusBtnActive]}
          onPress={() => handleStatusChange('finished')}
        >
          <Text style={[styles.statusBtnText, status === 'finished' && styles.statusBtnTextActive]}>Finished</Text>
        </TouchableOpacity>
      </View>

      {/* Progress ring using shared component */}
      <ProgressRingHeader progressPercent={progressPercent} label="Reading progress" />

      {/* Page input */}
      <View style={styles.pageInputRow}>
        <Text style={styles.pageLabel}>Current page:</Text>
        <TextInput
          style={styles.pageInput}
          keyboardType="numeric"
          value={pageInput}
          onChangeText={(Text)=>{
            const numericText = Text.replace(/[^0-9]/g,'');
            if(numericText===''){
              setPageInput('');
              return
            }
            const num = parseInt(numericText,10);
            
            if(num > totalPages){
              setPageInput(String(totalPages));
            }else{
              setPageInput(String(num));
            }
          }}
        />
        <Text style={styles.pageSlash}>/ {totalPages}</Text>
      </View>

      {/* Stopwatch controls */}
      <View style={styles.stopwatchContainer}>
        <Text style={styles.stopwatchLabel}>Session timer</Text>
        <View style={styles.stopwatchButtons}>
          <TouchableOpacity style={[styles.stopwatchButton, stopwatchRunning && { backgroundColor: tokens.colors.tertiary }]} onPress={handleStart}>
            <AntDesign name="caret-right" size={20} color={tokens.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.stopwatchButton} onPress={handlePause}>
            <AntDesign name="pause" size={20} color={tokens.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.stopwatchButton, { backgroundColor: tokens.colors.secondary }]} onPress={handleStop}>
            <AntDesign name="stop" size={20} color={tokens.colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.counterText}>Time: {elapsedSeconds}s</Text>
        <Text style={styles.counterText}>Pages read: {pagesReadDuringSession}</Text>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <AntDesign name="delete" size={20} color="#ff4444" />
        <Text style={styles.deleteButtonText}>Delete Book</Text>
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
  header: {
    flexDirection: 'row',
    marginBottom: tokens.spacing.s,
  },
  cover: {
    width: 100,
    height: 150,
    borderRadius: tokens.radius,
    backgroundColor: tokens.colors.surface,
  },
  coverPlaceholder: {
    width: 100,
    height: 150,
    borderRadius: tokens.radius,
    backgroundColor: tokens.colors.surface,
  },
  headerInfo: {
    flex: 1,
    marginLeft: tokens.spacing.m,
    justifyContent: 'center',
  },
  title: {
    color: tokens.colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  author: {
    color: tokens.colors.textSecondary,
    fontSize: 16,
    marginBottom: tokens.spacing.s,
  },
  starRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  statusActionRow: {
    flexDirection: 'row',
    gap: tokens.spacing.m,
    marginBottom: tokens.spacing.l,
    justifyContent: 'center',
  },
  statusBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: tokens.radius,
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.elevated,
  },
  statusBtnActive: {
    backgroundColor: tokens.colors.primary,
    borderColor: tokens.colors.primary,
  },
  statusBtnText: {
    color: tokens.colors.textSecondary,
    fontWeight: '500',
  },
  statusBtnTextActive: {
    color: tokens.colors.textPrimary,
  },
  pageInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.l,
    justifyContent: 'center',
  },
  pageLabel: {
    color: tokens.colors.textPrimary,
    marginRight: tokens.spacing.s,
  },
  pageInput: {
    width: 60,
    height: 40,
    borderRadius: tokens.radius,
    backgroundColor: tokens.colors.surface,
    color: tokens.colors.textPrimary,
    textAlign: 'center',
    marginRight: 4,
    borderWidth: 1,
    borderColor: tokens.colors.elevated,
  },
  pageSlash: {
    color: tokens.colors.textSecondary,
  },
  stopwatchContainer: {
    padding: tokens.spacing.m,
    backgroundColor: tokens.colors.elevated,
    borderRadius: tokens.radius,
  },
  stopwatchLabel: {
    color: tokens.colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: tokens.spacing.s,
    textAlign: 'center',
  },
  stopwatchButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: tokens.spacing.s,
  },
  stopwatchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    color: tokens.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: tokens.spacing.l,
    padding: tokens.spacing.m,
    borderRadius: tokens.radius,
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: '#ff4444',
    gap: tokens.spacing.s,
  },
  deleteButtonText: {
    color: '#ff4444',
    fontWeight: '600',
    fontSize: 16,
  },
});
