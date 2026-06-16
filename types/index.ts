export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
}

export interface Book {
  id: string;
  title: string;
  author: string;
  progress: number;
  pages: number;
  category: "Hadith" | "Tafsir" | "Tajweed" | "History" | "Quranic Sciences";
  description: string;
}

export interface UserStats {
  streak: number;
  versesReadThisWeek: number;
  readingMinutes: number[];
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
  }[];
}
