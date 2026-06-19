import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  coverUri: string | null;
  status: 'to-read' | 'in-progress' | 'finished';
  language?: 'ar' | 'fr' | 'tz' | string;
}

export interface Session {
  id: string;
  bookTitle: string;
  date: string;
  pagesRead: number;
  durationSec: number;
}

interface AppState {
  profile: { name: string; avatarUri: string | null; yearlyGoal: number };
  stats: { totalBooks: number; totalPages: number; totalTimeSec: number; streakDays: number };
  history: Session[];
  books: Book[];
  
  // Actions
  updateProfileAvatar: (uri: string) => void;
  updateProfileName: (name: string) => void;
  addBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  addSession: (session: Session) => void;
}

export const useBookStore = create<AppState>()(
  persist(
    (set) => ({
      // --- Initial State (Using your mock data!) ---
      profile: {
        name: 'Ahmed Ben Ali',
        avatarUri: null,
        yearlyGoal: 12,
      },
      stats: {
        totalBooks: 27,
        totalPages: 8450,
        totalTimeSec: 52300, 
        streakDays: 5,
      },
      history: [
        { id: 's1', bookTitle: 'Muqaddimah', date: '2024-08-10', pagesRead: 45, durationSec: 1800 },
        { id: 's2', bookTitle: 'Les Misérables', date: '2024-08-09', pagesRead: 30, durationSec: 1500 },
        { id: 's3', bookTitle: 'Tawfiq', date: '2024-08-08', pagesRead: 60, durationSec: 2400 },
      ],
      books: [], // Start with no user-added books

      // --- Actions ---
      updateProfileAvatar: (uri) => 
        set((state) => ({ 
          profile: { ...state.profile, avatarUri: uri } 
        })),

      updateProfileName: (newName) => 
        set((state) => ({ 
          profile: { ...state.profile, name: newName } 
        })),
        
      addBook: (newBook) => 
        set((state) => ({ 
          books: [...state.books, newBook],
          stats: { ...state.stats, totalBooks: state.stats.totalBooks + 1 }
        })),

      deleteBook: (id) =>
        set((state) => {
          const bookExists = state.books.some((b) => b.id === id);
          if (!bookExists) return state;
          return {
            books: state.books.filter((b) => b.id !== id),
            stats: { ...state.stats, totalBooks: Math.max(0, state.stats.totalBooks - 1) },
          };
        }),

      addSession: (newSession) =>
        set((state) => ({
          history: [newSession, ...state.history],
          stats: { 
            ...state.stats, 
            totalPages: state.stats.totalPages + newSession.pagesRead,
            totalTimeSec: state.stats.totalTimeSec + newSession.durationSec 
          }
        })),

    }),
    {
      name: 'maqra-storage', // Key for AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);