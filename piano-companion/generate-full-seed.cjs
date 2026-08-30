const fs = require('fs');

const tz1Vika = JSON.parse(fs.readFileSync('extracted-playlist.json', 'utf8'));
const tz1Chapters = JSON.parse(fs.readFileSync('extracted-chapters.json', 'utf8'));
const tz2Playlist = JSON.parse(fs.readFileSync('extracted-band2-playlist.json', 'utf8'));
const tz2Chapters = JSON.parse(fs.readFileSync('extracted-band2-chapters.json', 'utf8'));

function timeToSeconds(timeStr) {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else {
        return parts[0] * 60 + parts[1];
    }
}

// 1. Tastenzauberei 1 Original Single Videos (from original prompt)
const tz1Originals = [
  { id: 'tz1-01-glocken', bookId: 'tastenzauberei-1', providerName: 'Anikó Drabon (Singles)', title: 'Glocken (Bells)', sequenceIndex: 1, youtubeVideoId: 'CUvzy7Tu6TE', startTime: 0.0, endTime: 40.0, checkpoints: ['Find the Middle-C hand position', 'Play smoothly with curved fingers', 'Count steady: 1 - 2 - 3 - 4'], isCompleted: false },
  { id: 'tz1-02-karussell', bookId: 'tastenzauberei-1', providerName: 'Anikó Drabon (Singles)', title: 'Das Karussell (The Carousel)', sequenceIndex: 2, youtubeVideoId: 'DPyC2_Q1yhY', startTime: 0.0, endTime: 36.0, checkpoints: ['Right hand (Red) plays the melody', 'Left hand (Blue) keeps the rhythm', 'Optional: Press right sustain pedal'], isCompleted: false },
  { id: 'tz1-03-alle-zusammen', bookId: 'tastenzauberei-1', providerName: 'Anikó Drabon (Singles)', title: 'Alle zusammen (All Together)', sequenceIndex: 3, youtubeVideoId: 'gTTaiCd8fsQ', startTime: 0.0, endTime: 45.0, checkpoints: ['Sing along: Dino sieht Hase, Elefant sieht Affe!', 'Watch the repeat sign at the end', 'Keep fingers relaxed like soft tiger paws'], isCompleted: false },
  { id: 'tz1-04-fingersport', bookId: 'tastenzauberei-1', providerName: 'Anikó Drabon (Singles)', title: 'Fingersport (Finger Exercise)', sequenceIndex: 4, youtubeVideoId: 'goytUNhbGoM', startTime: 0.0, endTime: 35.0, checkpoints: ['Lift each finger independently', 'Keep your wrist completely level', 'Do not rush—play with a slow, steady pulse'], isCompleted: false }
];

// 2. Tastenzauberei 1 VikaPiano Playlist
const tz1VikaMapped = tz1Vika.map(item => ({
    id: `vika1-${item.videoId}`,
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano (Playlist)',
    title: item.title,
    sequenceIndex: item.sequenceIndex,
    youtubeVideoId: item.videoId,
    startTime: 0,
    endTime: 0,
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
}));

// 3. Tastenzauberei 1 Video Chapters
const tz1UniqueChapters = [];
const seenTz1 = new Set();
tz1Chapters.forEach(item => {
    if (item.title !== 'Transcript' && !seenTz1.has(item.title)) {
        seenTz1.add(item.title);
        tz1UniqueChapters.push(item);
    }
});
const tz1ChapterMapped = tz1UniqueChapters.map((chapter, index) => {
    const startTime = timeToSeconds(chapter.time);
    const nextChapter = tz1UniqueChapters[index + 1];
    const endTime = nextChapter ? timeToSeconds(nextChapter.time) : startTime + 120;
    return {
        id: `ch1-${index}`, bookId: 'tastenzauberei-1', providerName: 'Piano Companion (Chapters)', title: chapter.title, sequenceIndex: index + 1, youtubeVideoId: 'lguxe5bEqXo', startTime, endTime, checkpoints: ['Focus on the rhythm and dynamics'], isCompleted: false
    };
});

// 4. Tastenzauberei 2 Anikó Drabon Playlist
const tz2PlaylistMapped = tz2Playlist.map(item => ({
    id: `tz2p-${item.videoId}`, bookId: 'tastenzauberei-2', providerName: 'Anikó Drabon (Playlist)', title: item.title, sequenceIndex: item.sequenceIndex, youtubeVideoId: item.videoId, startTime: 0, endTime: 0, checkpoints: ['Master Band 2 techniques'], isCompleted: false
}));

// 5. Tastenzauberei 2 Gavin Brady Video Chapters
const tz2UniqueChapters = [];
const seenTz2 = new Set();
tz2Chapters.forEach(item => {
    if (item.title !== 'Transcript' && !seenTz2.has(item.title)) {
        seenTz2.add(item.title);
        tz2UniqueChapters.push(item);
    }
});
const tz2ChapterMapped = tz2UniqueChapters.map((chapter, index) => {
    const startTime = timeToSeconds(chapter.time);
    const nextChapter = tz2UniqueChapters[index + 1];
    const endTime = nextChapter ? timeToSeconds(nextChapter.time) : startTime + 120;
    return {
        id: `ch2-${index}`, bookId: 'tastenzauberei-2', providerName: 'Gavin Brady (Chapters)', title: chapter.title, sequenceIndex: index + 1, youtubeVideoId: '8SyxKcHZanc', startTime, endTime, checkpoints: ['Follow the chapter timing accurately'], isCompleted: false
    };
});

const allLessons = [...tz1Originals, ...tz1VikaMapped, ...tz1ChapterMapped, ...tz2PlaylistMapped, ...tz2ChapterMapped];

const books = [
    { id: 'tastenzauberei-1', title: 'Tastenzauberei Band 1', publisher: 'Anikó Drabon / Mitras Music', coverImageR2Url: 'https://images.unsplash.com/photo-1520523839898-507127053c17?auto=format&fit=crop&w=400&q=80', updatedAt: Date.now() },
    { id: 'tastenzauberei-2', title: 'Tastenzauberei Band 2', publisher: 'Anikó Drabon / Mitras Music', coverImageR2Url: 'https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=400&q=80', updatedAt: Date.now() }
];

const tsContent = `// src/lib/db/seedData.ts
import type { LocalBook, LocalLesson } from './db';

export const SEED_BOOKS: LocalBook[] = ${JSON.stringify(books, null, 2)};

export const SEED_LESSONS: LocalLesson[] = ${JSON.stringify(allLessons, null, 2)};
`;

fs.writeFileSync('src/lib/db/seedData.ts', tsContent);
console.log('Regenerated seedData.ts with all requested providers and Band 2');
