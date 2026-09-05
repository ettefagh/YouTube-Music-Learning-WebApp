// src/lib/types/studentProfile.ts

export type KidAvatarKey = 'lion' | 'bunny' | 'panda' | 'fox' | 'unicorn' | 'owl' | 'bear' | 'cat';

export interface KidAvatarOption {
  key: KidAvatarKey;
  emoji: string;
  label: string;
  color: string;
}

export const KID_AVATARS: KidAvatarOption[] = [
  { key: 'lion', emoji: '🦁', label: 'Leo the Lion', color: '#FFB300' },
  { key: 'bunny', emoji: '🐰', label: 'Mia the Bunny', color: '#F06292' },
  { key: 'panda', emoji: '🐼', label: 'Sammy the Panda', color: '#009688' },
  { key: 'fox', emoji: '🦊', label: 'Felix the Fox', color: '#FF7043' },
  { key: 'unicorn', emoji: '🦄', label: 'Luna the Unicorn', color: '#AB47BC' },
  { key: 'owl', emoji: '🦉', label: 'Oliver the Owl', color: '#3F51B5' },
  { key: 'bear', emoji: '🐻', label: 'Benny the Bear', color: '#8D6E63' },
  { key: 'cat', emoji: '🐱', label: 'Chloe the Cat', color: '#FFCA28' }
];

export interface StudentProfile {
  id: string;
  name: string;
  avatarKey: KidAvatarKey;
  color: string;
  createdAt: number;
  // Per-profile session recall pointers
  lastBookId?: string;
  lastProvider?: string;
  lastLessonId?: string;
  lastPracticedAt?: number;
}

export const DEFAULT_STUDENT_PROFILES: StudentProfile[] = [
  {
    id: 'profile-leo',
    name: 'Leo',
    avatarKey: 'lion',
    color: '#FFB300',
    createdAt: 1788117000000
  },
  {
    id: 'profile-mia',
    name: 'Mia',
    avatarKey: 'bunny',
    color: '#F06292',
    createdAt: 1788117010000
  },
  {
    id: 'profile-sammy',
    name: 'Sammy',
    avatarKey: 'panda',
    color: '#009688',
    createdAt: 1788117020000
  }
];

export function getAvatarEmoji(key: KidAvatarKey): string {
  const match = KID_AVATARS.find(a => a.key === key);
  return match ? match.emoji : '🧒';
}

export function getAvatarColor(key: KidAvatarKey): string {
  const match = KID_AVATARS.find(a => a.key === key);
  return match ? match.color : '#FFCA28';
}

// 3-Pillar Kids UX Screen Routing
export type ActiveScreen =
  | 'splash'
  | 'library'
  | 'player'
  | 'studio'
  | 'profile'
  | 'settings';
