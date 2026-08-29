import Dexie, { type Table } from 'dexie';
import { SEED_BOOK, SEED_LESSONS } from './seedData';

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
  if (bookCount === 0) {
    await db.books.put(SEED_BOOK);
    await db.lessons.bulkPut(SEED_LESSONS);
  } else {
    // If the database exists but doesn't have the new lessons yet (e.g. user updating app)
    const vikaCount = await db.lessons.where('providerName').equals('VikaPiano').count();
    if (vikaCount === 0) {
       await db.lessons.bulkPut(SEED_LESSONS);
    }
  }
}
