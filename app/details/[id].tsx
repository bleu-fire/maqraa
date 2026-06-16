import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useBookStore } from '../../store/useBookStore';

export default function ReadingView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const store = useBookStore();

  const book = store.books.find(b => b.id === id);

  // Focus Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (isTimerRunning) {
      // Pause
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsTimerRunning(false);
    } else {
      // Start
      intervalRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
      setIsTimerRunning(true);
    }
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  if (!book) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#787586" />
          <Text style={styles.notFoundText}>الكتاب غير موجود</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>العودة للمكتبة</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentPage = Math.round((book.progress / 100) * book.pages);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Top Navigation Header */}
      <View style={[styles.header, { paddingTop: insets.top, height: 56 + insets.top }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-forward" size={22} color="#4734c3" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Maqra</Text>

        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="bookmark-outline" size={22} color="#4734c3" />
        </TouchableOpacity>
      </View>

      {/* Main Reading Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
      >
        {/* Book Cover Hero Section */}
        <View style={styles.coverSection}>
          {/* Decorative Zellige Element */}
          <View style={styles.zelligeDecor} />

          <View style={styles.coverShadowWrapper}>
            <Image
              source={book.coverImage}
              style={styles.coverImage}
              contentFit="cover"
            />
          </View>

          {/* Bilingual Title */}
          <View style={styles.titleBlock}>
            <Text style={styles.titleEnglish}>The Architecture of Silence</Text>
            <Text style={styles.titleArabic}>{book.title}</Text>
            <Text style={styles.authorText}>{book.author}</Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressPageLabel}>
              صفحة {currentPage} من {book.pages}
            </Text>
            <Text style={styles.progressPercentLabel}>
              {book.progress}% مكتمل
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${book.progress}%` }]} />
          </View>

          {/* Quick Progress Adjust */}
          <View style={styles.progressAdjustRow}>
            <TouchableOpacity
              style={styles.progressAdjustBtn}
              onPress={() => store.updateBookProgress(book.id, Math.max(0, book.progress - 5))}
            >
              <Ionicons name="remove" size={18} color="#4734c3" />
            </TouchableOpacity>

            <View style={styles.progressChips}>
              <TouchableOpacity
                style={styles.chipBtn}
                onPress={() => store.updateBookProgress(book.id, Math.min(100, book.progress + 5))}
              >
                <Ionicons name="add" size={14} color="#4734c3" />
                <Text style={styles.chipText}>5 صفحات</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chipBtn}
                onPress={() => store.updateBookProgress(book.id, Math.min(100, book.progress + 10))}
              >
                <Ionicons name="add" size={14} color="#4734c3" />
                <Text style={styles.chipText}>10 صفحات</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.progressAdjustBtn}
              onPress={() => store.updateBookProgress(book.id, Math.min(100, book.progress + 5))}
            >
              <Ionicons name="add" size={18} color="#4734c3" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Focus Timer Section */}
        <View style={styles.timerCard}>
          {/* Subtle Zellige Watermark */}
          <View style={styles.timerWatermark} />

          <View style={styles.timerContent}>
            <Text style={styles.timerLabel}>جلسة تركيز</Text>
            <Text style={styles.timerDisplay}>{formatTime(timerSeconds)}</Text>

            <View style={styles.timerButtonRow}>
              {timerSeconds > 0 && (
                <TouchableOpacity style={styles.timerResetBtn} onPress={resetTimer}>
                  <Ionicons name="refresh" size={20} color="#787586" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.timerToggleBtn,
                  isTimerRunning && styles.timerToggleBtnPaused
                ]}
                onPress={toggleTimer}
              >
                <Ionicons
                  name={isTimerRunning ? 'pause' : 'play'}
                  size={22}
                  color="#ffffff"
                />
                <Text style={styles.timerToggleBtnText}>
                  {isTimerRunning ? 'إيقاف الجلسة' : 'بدء الجلسة'}
                </Text>
              </TouchableOpacity>

              {timerSeconds > 0 && (
                <View style={styles.timerResetBtn}>
                  {/* Invisible spacer for symmetry */}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Book Description Card */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>عن الكتاب</Text>
          <Text style={styles.descriptionText}>{book.description}</Text>
          <View style={styles.categoryRow}>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>{book.category}</Text>
            </View>
            <Text style={styles.pagesInfo}>{book.pages} صفحة</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F0E8', // Terracotta Dust background from Stitch
  },

  // Not Found State
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  notFoundText: {
    fontSize: 18,
    color: '#474554',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#4734c3',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 248, 241, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: '#eee7df',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4734c3',
  },

  // Scroll Content
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  // Cover Section
  coverSection: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  zelligeDecor: {
    position: 'absolute',
    top: -8,
    right: 40,
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4734c3',
    opacity: 0.08,
    transform: [{ rotate: '12deg' }],
  },
  coverShadowWrapper: {
    width: 200,
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: '#4734c3',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  titleBlock: {
    alignItems: 'center',
    marginTop: 24,
  },
  titleEnglish: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e1b17',
    textAlign: 'center',
  },
  titleArabic: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1e1b17',
    textAlign: 'center',
    marginTop: 4,
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  authorText: {
    fontSize: 16,
    color: '#787586',
    fontStyle: 'italic',
    marginTop: 6,
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },

  // Progress Section
  progressSection: {
    marginBottom: 32,
  },
  progressLabels: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressPageLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4734c3',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  progressPercentLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#787586',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#e8e1da',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4734c3',
    borderRadius: 4,
  },
  progressAdjustRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  progressAdjustBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e7e2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressChips: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  chipBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#c8c4d7',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 4,
  },
  chipText: {
    fontSize: 12,
    color: '#4734c3',
    fontWeight: '500',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },

  // Focus Timer Card
  timerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 40,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#4734c3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 20,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  timerWatermark: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: '#4734c3',
    opacity: 0.03,
    borderRadius: 20,
  },
  timerContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  timerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#787586',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 12,
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  timerDisplay: {
    fontSize: 56,
    fontWeight: '700',
    color: '#1e1b17',
    letterSpacing: -2,
    marginBottom: 28,
    fontVariant: ['tabular-nums'],
  },
  timerButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  timerToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4734c3',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 9999,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#4734c3',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  timerToggleBtnPaused: {
    backgroundColor: '#787586',
  },
  timerToggleBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  timerResetBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f4ede5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Description Card
  descriptionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee7df',
    ...Platform.select({
      ios: {
        shadowColor: '#4734c3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e1b17',
    marginBottom: 10,
    textAlign: 'right',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  descriptionText: {
    fontSize: 14,
    color: '#474554',
    lineHeight: 24,
    textAlign: 'right',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  categoryRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  categoryChip: {
    backgroundColor: '#e7e2ff',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  categoryChipText: {
    fontSize: 11,
    color: '#4734c3',
    fontWeight: 'bold',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
  pagesInfo: {
    fontSize: 12,
    color: '#787586',
    fontFamily: Platform.select({ ios: 'Geeza Pro', android: 'sans-serif' }),
  },
});
