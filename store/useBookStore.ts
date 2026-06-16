import { useState, useEffect } from 'react';

export interface Book {
  id: string;
  title: string;
  author: string;
  progress: number;
  pages: number;
  category: string;
  coverImage: string;
  description: string;
}

interface LibraryState {
  books: Book[];
  readingGoalCompleted: number;
  readingGoalTarget: number;
}

// Global state container initialized with the Stitch reference data
let state: LibraryState = {
  books: [
    {
      id: '1',
      title: 'منطق الطير',
      author: 'فريد الدين العطار',
      progress: 45,
      pages: 280,
      category: 'التصوف والروحانيات',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyOlZqS6JQ712CDSSwNJJwrO9cGL4vn43cKPpyH5hpKvLWIoAp4Fw-BfHomJHPb84TfD-kR1D4TN7rWDCEqzAuGlempw5YfICb5duYdzxEHNFXkrVhr_4ospWnuKBLjBvwHhBzVOyGypge_sSaRF0AK8sl8fyz3NWBU7WJgKWedTzZqTRHGzLjF1eCQa6snkZKwjflNVIpEtjnSV3NUVSxM022lAaEDDqc1vVs9upugygz64fzS64a89gO0yJU0bmTCBooHWl_Wtc',
      description: 'منظومة شعرية صوفية تتحدث عن رحلة الطيور بحثاً عن السيمرغ (ملك الطيور)، وترمز هذه الرحلة إلى السلوك العرفاني وتصفية النفس.'
    },
    {
      id: '2',
      title: 'فلسفة التوحيد',
      author: 'د. طه عبد الرحمن',
      progress: 82,
      pages: 310,
      category: 'الفلسفة الإسلامية',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKKPjqqGtiJ_Ui2IRxntpDv4UAvqH94mZlygK23sybCKa09dUtlp6iPVEX3Tt647GdUthf826gonhGL-PvfbrGHE-OMlmTJ62BZJAAVpIFPgTghTM4twRn5s0MpbQ8r-aqqB0fwUWO2uX9vREyDL8177wRUBCUnwmO0HEq-jPaqF78hhVqQm4ysFB62d9O4XSv6Qs3VrKWn7wUt_nH01MBMrVGjc2Zy0VrqPZwtDv1PjmolosQjoaX4WOA2MeVDGDHOylT6--wwJM',
      description: 'كتاب يبحث في الأصول الفلسفية للتوحيد وإعادة قراءة العقلانية الإسلامية بمنهجية نقدية حديثة تزاوج بين المنطق والروح.'
    }
  ],
  readingGoalCompleted: 7,
  readingGoalTarget: 10
};

const listeners = new Set<() => void>();

const updateState = (newState: Partial<LibraryState>) => {
  state = { ...state, ...newState };
  listeners.forEach(listener => listener());
};

export const useBookStore = () => {
  const [currentState, setCurrentState] = useState(state);

  useEffect(() => {
    const listener = () => setCurrentState(state);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const updateBookProgress = (bookId: string, progress: number) => {
    const updatedBooks = state.books.map(book => {
      if (book.id === bookId) {
        return { ...book, progress: Math.min(100, Math.max(0, progress)) };
      }
      return book;
    });
    
    // Recalculate goal completed books if progress is 100%
    const completedCount = updatedBooks.filter(b => b.progress === 100).length + 5; // Base completed of 5
    updateState({ 
      books: updatedBooks,
      readingGoalCompleted: Math.min(state.readingGoalTarget, completedCount)
    });
  };

  const addBook = (title: string, author: string, pages: number, category: string) => {
    const newBook: Book = {
      id: Date.now().toString(),
      title,
      author,
      progress: 0,
      pages,
      category,
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200',
      description: 'كتاب مضاف حديثاً إلى المكتبة الذكية لمتابعة القراءة والدراسة.'
    };
    updateState({ books: [newBook, ...state.books] });
  };

  const deleteBook = (bookId: string) => {
    updateState({ books: state.books.filter(b => b.id !== bookId) });
  };

  return {
    ...currentState,
    updateBookProgress,
    addBook,
    deleteBook
  };
};
