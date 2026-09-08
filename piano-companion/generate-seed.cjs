const fs = require('fs');

const extracted = JSON.parse(fs.readFileSync('extracted-playlist.json', 'utf8'));

const vikaLessons = extracted.map(item => {
    return `  {
    id: 'vika-${item.videoId}',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: ${JSON.stringify(item.title)},
    sequenceIndex: ${item.sequenceIndex},
    youtubeVideoId: '${item.videoId}',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\\'s performance'],
    isCompleted: false
  }`;
});

const tsContent = `// src/lib/db/seedData.ts
import type { LocalBook, LocalLesson } from './db';

export const SEED_BOOK: LocalBook = {
  id: 'tastenzauberei-1',
  title: 'Tastenzauberei Band 1',
  publisher: 'Anikó Drabon / Mitras Music',
  coverImageR2Url: 'https://images.unsplash.com/photo-1520523839898-507127053c17?auto=format&fit=crop&w=400&q=80',
  updatedAt: Date.now()
};

export const SEED_LESSONS: LocalLesson[] = [
  // Original Provider: Anikó Drabon
  {
    id: 'tz1-01-glocken',
    bookId: 'tastenzauberei-1',
    providerName: 'Anikó Drabon',
    title: 'Glocken (Bells)',
    sequenceIndex: 1,
    youtubeVideoId: 'CUvzy7Tu6TE',
    startTime: 0.0,
    endTime: 40.0,
    checkpoints: [
      'Find the Middle-C hand position',
      'Play smoothly with curved fingers',
      'Count steady: 1 - 2 - 3 - 4'
    ],
    isCompleted: false
  },
  {
    id: 'tz1-02-karussell',
    bookId: 'tastenzauberei-1',
    providerName: 'Anikó Drabon',
    title: 'Das Karussell (The Carousel)',
    sequenceIndex: 2,
    youtubeVideoId: 'DPyC2_Q1yhY',
    startTime: 0.0,
    endTime: 36.0,
    checkpoints: [
      'Right hand (Red) plays the melody',
      'Left hand (Blue) keeps the rhythm',
      'Optional: Press right sustain pedal'
    ],
    isCompleted: false
  },
  {
    id: 'tz1-03-alle-zusammen',
    bookId: 'tastenzauberei-1',
    providerName: 'Anikó Drabon',
    title: 'Alle zusammen (All Together)',
    sequenceIndex: 3,
    youtubeVideoId: 'gTTaiCd8fsQ',
    startTime: 0.0,
    endTime: 45.0,
    checkpoints: [
      'Sing along: Dino sieht Hase, Elefant sieht Affe!',
      'Watch the repeat sign at the end',
      'Keep fingers relaxed like soft tiger paws'
    ],
    isCompleted: false
  },
  {
    id: 'tz1-04-fingersport',
    bookId: 'tastenzauberei-1',
    providerName: 'Anikó Drabon',
    title: 'Fingersport (Finger Exercise)',
    sequenceIndex: 4,
    youtubeVideoId: 'goytUNhbGoM',
    startTime: 0.0,
    endTime: 35.0,
    checkpoints: [
      'Lift each finger independently',
      'Keep your wrist completely level',
      'Do not rush—play with a slow, steady pulse'
    ],
    isCompleted: false
  },
  // Exact Extracted VikaPiano lessons (${vikaLessons.length})
${vikaLessons.join(',\n')}
];
`;

fs.writeFileSync('src/lib/db/seedData.ts', tsContent);
console.log('Regenerated seedData.ts');
