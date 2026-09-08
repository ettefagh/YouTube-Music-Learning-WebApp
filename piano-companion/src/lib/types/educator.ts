// src/lib/types/educator.ts

export interface EducatorChannelInfo {
  name: string;
  educatorName: string;
  avatarEmoji: string;
  avatarBgColor: string;
  bannerColor: string;
  description: string;
  channelHandle?: string;
  avatarImg?: string;
}

export const KNOWN_EDUCATORS: Record<string, EducatorChannelInfo> = {
  'Anikó Drabon (Singles)': {
    name: 'Anikó Drabon (Singles)',
    educatorName: 'Anikó Drabon',
    avatarEmoji: '👩‍🏫',
    avatarBgColor: '#FFE082',
    bannerColor: '#FF8F00',
    description: 'Pianist, author & educator behind Tastenzauberei (Mitras Music). Step-by-step videos for each piece.',
    channelHandle: '@AnikoDrabon'
  },
  'VikaPiano (Playlist)': {
    name: 'VikaPiano (Playlist)',
    educatorName: 'Vika (VikaPiano)',
    avatarEmoji: '🎹',
    avatarBgColor: '#E1BEE7',
    bannerColor: '#8E24AA',
    description: 'Warm, expressive piano demonstrations in structured playlists for children and beginner pianists.',
    channelHandle: '@VikaPiano'
  },
  'Piano Companion (Chapters)': {
    name: 'Piano Companion (Chapters)',
    educatorName: 'Piano Companion Studio',
    avatarEmoji: '🎧',
    avatarBgColor: '#BBDEFB',
    bannerColor: '#1976D2',
    description: 'Comprehensive single-video masterclasses with precision YouTube chapter bookmarks for entire books.',
    channelHandle: '@PianoCompanion'
  },
  'Anikó Drabon (Playlist)': {
    name: 'Anikó Drabon (Playlist)',
    educatorName: 'Anikó Drabon',
    avatarEmoji: '🎼',
    avatarBgColor: '#C8E6C9',
    bannerColor: '#388E3C',
    description: 'Complete sequential playlist of all book exercises directly from the official series.',
    channelHandle: '@AnikoDrabon'
  },
  'Gavin Brady (Chapters)': {
    name: 'Gavin Brady (Chapters)',
    educatorName: 'Gavin Brady',
    avatarEmoji: '👨‍🏫',
    avatarBgColor: '#FFCDD2',
    bannerColor: '#D32F2F',
    description: 'Method specialist providing clear visual cues, bookmarked chapter guides, and finger number tips.',
    channelHandle: '@GavinBradyPiano'
  }
};

export function getEducatorInfo(providerName: string): EducatorChannelInfo {
  if (KNOWN_EDUCATORS[providerName]) {
    return KNOWN_EDUCATORS[providerName];
  }
  // Default fallback for custom channels
  return {
    name: providerName,
    educatorName: providerName.replace(/\s*\(.*?\)\s*/g, ''),
    avatarEmoji: '🎵',
    avatarBgColor: '#FFE082',
    bannerColor: '#FFB300',
    description: 'Custom YouTube learning channel curated for piano practice.',
    channelHandle: '@' + providerName.replace(/[^a-zA-Z0-9]/g, '')
  };
}
