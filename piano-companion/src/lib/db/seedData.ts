// src/lib/db/seedData.ts
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
  // Exact Extracted VikaPiano lessons (48)
  {
    id: 'vika-0l0sL8r2fXY',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Die Spieluhr\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 1,
    youtubeVideoId: '0l0sL8r2fXY',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-5LaJ35IlLpg',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Zauberspiegel\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 2,
    youtubeVideoId: '5LaJ35IlLpg',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-tiFsPuR3ynA',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Das Auflösungszeichen\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 3,
    youtubeVideoId: 'tiFsPuR3ynA',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-HgloKNfzxFY',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Unglaublich\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 4,
    youtubeVideoId: 'HgloKNfzxFY',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-fhB8EWUxTr0',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Feuer!\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 5,
    youtubeVideoId: 'fhB8EWUxTr0',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-MUjWoyCYVa4',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Treppensteigen\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 6,
    youtubeVideoId: 'MUjWoyCYVa4',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-f4MLFQLJrL8',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Traumlied\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 7,
    youtubeVideoId: 'f4MLFQLJrL8',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-oKoDKpEI2OQ',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Tanzparty\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 8,
    youtubeVideoId: 'oKoDKpEI2OQ',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-2hQgemOafhw',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Happy Birthday\" (Primo) aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 9,
    youtubeVideoId: '2hQgemOafhw',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-vf4OS0KQW7A',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Happy Birthday\" (Secondo) aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 10,
    youtubeVideoId: 'vf4OS0KQW7A',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-OkW6lF0cuBg',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Streiterei\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 11,
    youtubeVideoId: 'OkW6lF0cuBg',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-BV12MGFuhII',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Piratenlied\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 12,
    youtubeVideoId: 'BV12MGFuhII',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika--fhqzTpYsEE',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Pitsche-patsch\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 13,
    youtubeVideoId: '-fhqzTpYsEE',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-gYg9MDqmJnk',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Old Mac Donald\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 14,
    youtubeVideoId: 'gYg9MDqmJnk',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-zABVCkVu4y0',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Oh when the saints\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 15,
    youtubeVideoId: 'zABVCkVu4y0',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-mPrkJeLVzC4',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Noten lesen\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 16,
    youtubeVideoId: 'mPrkJeLVzC4',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-4NtnmdDeEAs',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Big Ben\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 17,
    youtubeVideoId: '4NtnmdDeEAs',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-BTMDMOqiTAI',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Der Besen\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 18,
    youtubeVideoId: 'BTMDMOqiTAI',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-j397skB58nc',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Der Fisch\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 19,
    youtubeVideoId: 'j397skB58nc',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-lhM8lNAGBqo',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Die Versetzungszeichen\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 20,
    youtubeVideoId: 'lhM8lNAGBqo',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-7qkd9YOY56o',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Im Regen\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 21,
    youtubeVideoId: '7qkd9YOY56o',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-AH-PvnvAX94',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Im Zirkus\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 22,
    youtubeVideoId: 'AH-PvnvAX94',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-vB1PZc971dk',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"J. Haydn: Thema aus der Paukenschlag-Symphonie\" aus der \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 23,
    youtubeVideoId: 'vB1PZc971dk',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-X5PIlzkZatA',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Glocken\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 24,
    youtubeVideoId: 'X5PIlzkZatA',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-0DI4AX4NuJc',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Bärentanz\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 25,
    youtubeVideoId: '0DI4AX4NuJc',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-goytUNhbGoM',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Fingersport\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 26,
    youtubeVideoId: 'goytUNhbGoM',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-4uT7BElWVxE',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Hopplaho!\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 27,
    youtubeVideoId: '4uT7BElWVxE',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-sbE4JKKTXUE',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Froschkonzert\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 28,
    youtubeVideoId: 'sbE4JKKTXUE',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-qRvKolTbw8M',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Gradeaus!\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 29,
    youtubeVideoId: 'qRvKolTbw8M',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-b4VuPukX2o0',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Yankee Doodle\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 30,
    youtubeVideoId: 'b4VuPukX2o0',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-ItesNYAITpA',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Alle zusammen\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 31,
    youtubeVideoId: 'ItesNYAITpA',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-8jATdLfSvjQ',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Morgen kommt der Weihnachtsmann\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 32,
    youtubeVideoId: '8jATdLfSvjQ',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-9TOrHoZ4u9M',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Alle Vögel sind schon da...\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 33,
    youtubeVideoId: '9TOrHoZ4u9M',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-TSqfoCfmlG8',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Jingle Bells\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 34,
    youtubeVideoId: 'TSqfoCfmlG8',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-pCF5w_aA4L4',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Legato - Staccato\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 35,
    youtubeVideoId: 'pCF5w_aA4L4',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-5A6veQ3HZx0',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Ferdinand und Geri\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 36,
    youtubeVideoId: '5A6veQ3HZx0',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-EfXEY4YNJN4',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Zwei Spechte\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 37,
    youtubeVideoId: 'EfXEY4YNJN4',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-ZMQo1lkLddw',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Kuckuck, Kuckuck\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 38,
    youtubeVideoId: 'ZMQo1lkLddw',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-h1tCy8HemrE',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Musik in der Nacht\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 39,
    youtubeVideoId: 'h1tCy8HemrE',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-YFPmfPTWR-M',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Laterne, laterne\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 40,
    youtubeVideoId: 'YFPmfPTWR-M',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-6c5iHHJ6AR8',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Regenwalzer\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 41,
    youtubeVideoId: '6c5iHHJ6AR8',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-lDYe92IgZdw',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Elefant und Affe\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 42,
    youtubeVideoId: 'lDYe92IgZdw',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-OpoBR_7mBmE',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Dino und Hase\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 43,
    youtubeVideoId: 'OpoBR_7mBmE',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-9RmSHNRZqH8',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Herr C\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 44,
    youtubeVideoId: '9RmSHNRZqH8',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-q1dhg9mmYR4',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Beethoven: An die Freude\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 45,
    youtubeVideoId: 'q1dhg9mmYR4',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-pXuxQiaVLKc',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Die Lokomotive\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 46,
    youtubeVideoId: 'pXuxQiaVLKc',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-L4CH1fPWRcs',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Das Karussell\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 47,
    youtubeVideoId: 'L4CH1fPWRcs',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  },
  {
    id: 'vika-zC1qL6Qb_gc',
    bookId: 'tastenzauberei-1',
    providerName: 'VikaPiano',
    title: "\"Hokuspo-Blues\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    sequenceIndex: 48,
    youtubeVideoId: 'zC1qL6Qb_gc',
    startTime: 0.0,
    endTime: 0.0, // Plays full
    checkpoints: ['Observe VikaPiano\'s performance'],
    isCompleted: false
  }
];
