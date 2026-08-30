import Dexie, { type Table } from 'dexie';
import { SEED_BOOKS, SEED_LESSONS } from './seedData';

export interface LocalBook {
  id: string;
  title: string;
  publisher: string;
  coverImageR2Url: string;
  updatedAt: number;
}

export interface LocalLesson {
  id: string;
  bookId: string;
  providerName: string;
  title: string;
  sequenceIndex: number;
  youtubeVideoId: string;
  startTime: number;
  endTime: number;
  checkpoints: string[];
  sheetSnippetUrl?: string;
  isCompleted: boolean;
}

export interface LocalAudioTrack {
  id: string;
  lessonId: string;
  trackType: 'teacher' | 'student';
  mimeType: string;
  durationSeconds: number;
  createdAt: number;
  audioBlob: Blob; // Deliberately unindexed to prevent mobile WebKit crashes
}

export class PianoDatabase extends Dexie {
  books!: Table<LocalBook, string>;
  lessons!: Table<LocalLesson, string>;
  audioTracks!: Table<LocalAudioTrack, string>;

  constructor() {
    super('PianoCompanionDB');
    this.version(2).stores({ // Bumped version to 2 for schema change
      books: 'id, title, updatedAt',
      lessons: 'id, bookId, providerName, sequenceIndex, isCompleted',
      audioTracks: 'id, lessonId, [lessonId+trackType], trackType, createdAt' // Added compound index
    });
  }
}

export const db = new PianoDatabase();

export async function initDatabase() {
  if (typeof window !== 'undefined' && 'storage' in navigator && navigator.storage.persist) {
    await navigator.storage.persist();
  }
  const bookCount = await db.books.count();
  if (bookCount < 2) {
    await db.books.bulkPut(SEED_BOOKS);
  }

  // Since we added so many tracks, force seed injection if lesson count is low
  const lessonCount = await db.lessons.count();
  if (lessonCount < 100) {
      await db.lessons.clear();
      await db.lessons.bulkPut(SEED_LESSONS);
  }
}
