import Dexie, { type Table } from 'dexie';
import { SEED_BOOKS, SEED_LESSONS } from './seedData';

export type LessonListType = 'singles' | 'playlist' | 'chapters';

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
  listType?: LessonListType;
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
    this.version(2).stores({
      books: 'id, title, updatedAt',
      lessons: 'id, bookId, providerName, sequenceIndex, isCompleted',
      audioTracks: 'id, lessonId, [lessonId+trackType], trackType, createdAt'
    });
  }
}

export const db = new PianoDatabase();

export function detectListType(lessons: LocalLesson[], providerName?: string): LessonListType {
  if (lessons.length > 0 && lessons[0].listType) {
    return lessons[0].listType;
  }

  const pName = (providerName || (lessons.length > 0 ? lessons[0].providerName : '')).toLowerCase();
  if (pName.includes('chapter') || pName.includes('bookmark')) {
    return 'chapters';
  }
  if (pName.includes('playlist')) {
    return 'playlist';
  }
  if (pName.includes('single')) {
    return 'singles';
  }

  // Structural heuristics:
  // If multiple lessons share the exact same video ID and have start/end times > 0, it's a chapter bookmarked video
  if (lessons.length > 1) {
    const firstVideoId = lessons[0].youtubeVideoId;
    const sameVideoCount = lessons.filter(l => l.youtubeVideoId === firstVideoId).length;
    const hasTimestamps = lessons.some(l => l.startTime > 0 || l.endTime > 0);
    if (sameVideoCount === lessons.length && hasTimestamps) {
      return 'chapters';
    }
    // If different video IDs and all startTime/endTime are 0, likely a playlist or singles
    if (lessons.length > 15) {
      return 'playlist';
    }
  }

  return 'singles';
}

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
