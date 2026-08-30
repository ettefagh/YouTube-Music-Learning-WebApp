// src/lib/db/seedData.ts
import type { LocalBook, LocalLesson } from './db';

export const SEED_BOOKS: LocalBook[] = [
  {
    "id": "tastenzauberei-1",
    "title": "Tastenzauberei Band 1",
    "publisher": "Anikó Drabon / Mitras Music",
    "coverImageR2Url": "https://images.unsplash.com/photo-1520523839898-507127053c17?auto=format&fit=crop&w=400&q=80",
    "updatedAt": 1788117025732
  },
  {
    "id": "tastenzauberei-2",
    "title": "Tastenzauberei Band 2",
    "publisher": "Anikó Drabon / Mitras Music",
    "coverImageR2Url": "https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=400&q=80",
    "updatedAt": 1788117025732
  }
];

export const SEED_LESSONS: LocalLesson[] = [
  {
    "id": "tz1-01-glocken",
    "bookId": "tastenzauberei-1",
    "providerName": "Anikó Drabon (Singles)",
    "title": "Glocken (Bells)",
    "sequenceIndex": 1,
    "youtubeVideoId": "CUvzy7Tu6TE",
    "startTime": 0,
    "endTime": 40,
    "checkpoints": [
      "Find the Middle-C hand position",
      "Play smoothly with curved fingers",
      "Count steady: 1 - 2 - 3 - 4"
    ],
    "isCompleted": false
  },
  {
    "id": "tz1-02-karussell",
    "bookId": "tastenzauberei-1",
    "providerName": "Anikó Drabon (Singles)",
    "title": "Das Karussell (The Carousel)",
    "sequenceIndex": 2,
    "youtubeVideoId": "DPyC2_Q1yhY",
    "startTime": 0,
    "endTime": 36,
    "checkpoints": [
      "Right hand (Red) plays the melody",
      "Left hand (Blue) keeps the rhythm",
      "Optional: Press right sustain pedal"
    ],
    "isCompleted": false
  },
  {
    "id": "tz1-03-alle-zusammen",
    "bookId": "tastenzauberei-1",
    "providerName": "Anikó Drabon (Singles)",
    "title": "Alle zusammen (All Together)",
    "sequenceIndex": 3,
    "youtubeVideoId": "gTTaiCd8fsQ",
    "startTime": 0,
    "endTime": 45,
    "checkpoints": [
      "Sing along: Dino sieht Hase, Elefant sieht Affe!",
      "Watch the repeat sign at the end",
      "Keep fingers relaxed like soft tiger paws"
    ],
    "isCompleted": false
  },
  {
    "id": "tz1-04-fingersport",
    "bookId": "tastenzauberei-1",
    "providerName": "Anikó Drabon (Singles)",
    "title": "Fingersport (Finger Exercise)",
    "sequenceIndex": 4,
    "youtubeVideoId": "goytUNhbGoM",
    "startTime": 0,
    "endTime": 35,
    "checkpoints": [
      "Lift each finger independently",
      "Keep your wrist completely level",
      "Do not rush—play with a slow, steady pulse"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-0l0sL8r2fXY",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Die Spieluhr\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 1,
    "youtubeVideoId": "0l0sL8r2fXY",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-5LaJ35IlLpg",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Zauberspiegel\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 2,
    "youtubeVideoId": "5LaJ35IlLpg",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-tiFsPuR3ynA",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Das Auflösungszeichen\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 3,
    "youtubeVideoId": "tiFsPuR3ynA",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-HgloKNfzxFY",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Unglaublich\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 4,
    "youtubeVideoId": "HgloKNfzxFY",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-fhB8EWUxTr0",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Feuer!\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 5,
    "youtubeVideoId": "fhB8EWUxTr0",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-MUjWoyCYVa4",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Treppensteigen\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 6,
    "youtubeVideoId": "MUjWoyCYVa4",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-f4MLFQLJrL8",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Traumlied\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 7,
    "youtubeVideoId": "f4MLFQLJrL8",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-oKoDKpEI2OQ",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Tanzparty\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 8,
    "youtubeVideoId": "oKoDKpEI2OQ",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-2hQgemOafhw",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Happy Birthday\" (Primo) aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 9,
    "youtubeVideoId": "2hQgemOafhw",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-vf4OS0KQW7A",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Happy Birthday\" (Secondo) aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 10,
    "youtubeVideoId": "vf4OS0KQW7A",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-OkW6lF0cuBg",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Streiterei\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 11,
    "youtubeVideoId": "OkW6lF0cuBg",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-BV12MGFuhII",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Piratenlied\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 12,
    "youtubeVideoId": "BV12MGFuhII",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1--fhqzTpYsEE",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Pitsche-patsch\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 13,
    "youtubeVideoId": "-fhqzTpYsEE",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-gYg9MDqmJnk",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Old Mac Donald\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 14,
    "youtubeVideoId": "gYg9MDqmJnk",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-zABVCkVu4y0",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Oh when the saints\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 15,
    "youtubeVideoId": "zABVCkVu4y0",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-mPrkJeLVzC4",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Noten lesen\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 16,
    "youtubeVideoId": "mPrkJeLVzC4",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-4NtnmdDeEAs",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Big Ben\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 17,
    "youtubeVideoId": "4NtnmdDeEAs",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-BTMDMOqiTAI",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Der Besen\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 18,
    "youtubeVideoId": "BTMDMOqiTAI",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-j397skB58nc",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Der Fisch\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 19,
    "youtubeVideoId": "j397skB58nc",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-lhM8lNAGBqo",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Die Versetzungszeichen\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 20,
    "youtubeVideoId": "lhM8lNAGBqo",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-7qkd9YOY56o",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Im Regen\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 21,
    "youtubeVideoId": "7qkd9YOY56o",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-AH-PvnvAX94",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Im Zirkus\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 22,
    "youtubeVideoId": "AH-PvnvAX94",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-vB1PZc971dk",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"J. Haydn: Thema aus der Paukenschlag-Symphonie\" aus der \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 23,
    "youtubeVideoId": "vB1PZc971dk",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-X5PIlzkZatA",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Glocken\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 24,
    "youtubeVideoId": "X5PIlzkZatA",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-0DI4AX4NuJc",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Bärentanz\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 25,
    "youtubeVideoId": "0DI4AX4NuJc",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-goytUNhbGoM",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Fingersport\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 26,
    "youtubeVideoId": "goytUNhbGoM",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-4uT7BElWVxE",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Hopplaho!\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 27,
    "youtubeVideoId": "4uT7BElWVxE",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-sbE4JKKTXUE",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Froschkonzert\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 28,
    "youtubeVideoId": "sbE4JKKTXUE",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-qRvKolTbw8M",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Gradeaus!\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 29,
    "youtubeVideoId": "qRvKolTbw8M",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-b4VuPukX2o0",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Yankee Doodle\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 30,
    "youtubeVideoId": "b4VuPukX2o0",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-ItesNYAITpA",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Alle zusammen\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 31,
    "youtubeVideoId": "ItesNYAITpA",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-8jATdLfSvjQ",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Morgen kommt der Weihnachtsmann\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 32,
    "youtubeVideoId": "8jATdLfSvjQ",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-9TOrHoZ4u9M",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Alle Vögel sind schon da...\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 33,
    "youtubeVideoId": "9TOrHoZ4u9M",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-TSqfoCfmlG8",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Jingle Bells\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 34,
    "youtubeVideoId": "TSqfoCfmlG8",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-pCF5w_aA4L4",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Legato - Staccato\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 35,
    "youtubeVideoId": "pCF5w_aA4L4",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-5A6veQ3HZx0",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Ferdinand und Geri\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 36,
    "youtubeVideoId": "5A6veQ3HZx0",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-EfXEY4YNJN4",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Zwei Spechte\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 37,
    "youtubeVideoId": "EfXEY4YNJN4",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-ZMQo1lkLddw",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Kuckuck, Kuckuck\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 38,
    "youtubeVideoId": "ZMQo1lkLddw",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-h1tCy8HemrE",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Musik in der Nacht\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 39,
    "youtubeVideoId": "h1tCy8HemrE",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-YFPmfPTWR-M",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Laterne, laterne\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 40,
    "youtubeVideoId": "YFPmfPTWR-M",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-6c5iHHJ6AR8",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Regenwalzer\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 41,
    "youtubeVideoId": "6c5iHHJ6AR8",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-lDYe92IgZdw",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Elefant und Affe\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 42,
    "youtubeVideoId": "lDYe92IgZdw",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-OpoBR_7mBmE",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Dino und Hase\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 43,
    "youtubeVideoId": "OpoBR_7mBmE",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-9RmSHNRZqH8",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Herr C\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 44,
    "youtubeVideoId": "9RmSHNRZqH8",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-q1dhg9mmYR4",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Beethoven: An die Freude\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 45,
    "youtubeVideoId": "q1dhg9mmYR4",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-pXuxQiaVLKc",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Die Lokomotive\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 46,
    "youtubeVideoId": "pXuxQiaVLKc",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-L4CH1fPWRcs",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Das Karussell\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 47,
    "youtubeVideoId": "L4CH1fPWRcs",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "vika1-zC1qL6Qb_gc",
    "bookId": "tastenzauberei-1",
    "providerName": "VikaPiano (Playlist)",
    "title": "\"Hokuspo-Blues\" aus der Klavierschule \"Tastenzauberei\" Band 1 von Aniko Drabon",
    "sequenceIndex": 48,
    "youtubeVideoId": "zC1qL6Qb_gc",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Observe VikaPiano's performance"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-0",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Schaukeln",
    "sequenceIndex": 1,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 0,
    "endTime": 68,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-1",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Gespräch in der Höhle",
    "sequenceIndex": 2,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 68,
    "endTime": 104,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-2",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Gespenster?",
    "sequenceIndex": 3,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 104,
    "endTime": 150,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-3",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Nach dem Gewitter",
    "sequenceIndex": 4,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 150,
    "endTime": 172,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-4",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Pitsche - patsch",
    "sequenceIndex": 5,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 172,
    "endTime": 193,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-5",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Old Mac Donald",
    "sequenceIndex": 6,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 193,
    "endTime": 214,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-6",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Laterne, laterne",
    "sequenceIndex": 7,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 214,
    "endTime": 247,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-7",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Jingle Bells",
    "sequenceIndex": 8,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 247,
    "endTime": 285,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-8",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Morgen kommt der Weihnachtsmann",
    "sequenceIndex": 9,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 285,
    "endTime": 314,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-9",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Kuckuck, kuckuck",
    "sequenceIndex": 10,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 314,
    "endTime": 342,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-10",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Noten lesen & Ganztonleiter",
    "sequenceIndex": 11,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 342,
    "endTime": 395,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-11",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Der Zauberspiegel",
    "sequenceIndex": 12,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 395,
    "endTime": 424,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-12",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Herr C",
    "sequenceIndex": 13,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 424,
    "endTime": 457,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-13",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Im Zauberspiegel: Dino und Hase",
    "sequenceIndex": 14,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 457,
    "endTime": 486,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-14",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Regenwalzer",
    "sequenceIndex": 15,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 486,
    "endTime": 516,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-15",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Im Zauberspiegel: Elefant und Affe",
    "sequenceIndex": 16,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 516,
    "endTime": 543,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-16",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Feuer!",
    "sequenceIndex": 17,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 543,
    "endTime": 580,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-17",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Alle zusammen",
    "sequenceIndex": 18,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 580,
    "endTime": 611,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-18",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Legato - staccato",
    "sequenceIndex": 19,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 611,
    "endTime": 659,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-19",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Piratenlied",
    "sequenceIndex": 20,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 659,
    "endTime": 708,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-20",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Musik in der Nacht",
    "sequenceIndex": 21,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 708,
    "endTime": 753,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-21",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Im Zauberspiegel: Ferdinand und Geri",
    "sequenceIndex": 22,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 753,
    "endTime": 785,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-22",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Tanzparty",
    "sequenceIndex": 23,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 785,
    "endTime": 836,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-23",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Streiterei",
    "sequenceIndex": 24,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 836,
    "endTime": 870,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-24",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Gradeaus!",
    "sequenceIndex": 25,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 870,
    "endTime": 928,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-25",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Yankee Doodle",
    "sequenceIndex": 26,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 928,
    "endTime": 963,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-26",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Froschkonzert",
    "sequenceIndex": 27,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 963,
    "endTime": 1007,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-27",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Im Zauberspiegel: “Schlüssel-Geri” und “Schlüssel-Ferdinand”",
    "sequenceIndex": 28,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1007,
    "endTime": 1045,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-28",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Glocken",
    "sequenceIndex": 29,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1045,
    "endTime": 1093,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-29",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Treppensteigen",
    "sequenceIndex": 30,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1093,
    "endTime": 1127,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-30",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Joseph Haydn: Thema aus der Paukenschlag-Symphonie",
    "sequenceIndex": 31,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1127,
    "endTime": 1148,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-31",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Zwei Spechte",
    "sequenceIndex": 32,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1148,
    "endTime": 1178,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-32",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Happy Birthday",
    "sequenceIndex": 33,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1178,
    "endTime": 1232,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-33",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Finde die Quinte!",
    "sequenceIndex": 34,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1232,
    "endTime": 1251,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-34",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Hopplaho!",
    "sequenceIndex": 35,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1251,
    "endTime": 1289,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-35",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Spiegelbildlich und parallel",
    "sequenceIndex": 36,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1289,
    "endTime": 1309,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-36",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Fingersport",
    "sequenceIndex": 37,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1309,
    "endTime": 1355,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-37",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Im Regen",
    "sequenceIndex": 38,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1355,
    "endTime": 1399,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-38",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Unglaublich",
    "sequenceIndex": 39,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1399,
    "endTime": 1433,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-39",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Bärentanz",
    "sequenceIndex": 40,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1433,
    "endTime": 1499,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-40",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Traumlied",
    "sequenceIndex": 41,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1499,
    "endTime": 1581,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-41",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Im Zirkus",
    "sequenceIndex": 42,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1581,
    "endTime": 1614,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-42",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Die Versetzungszeichen",
    "sequenceIndex": 43,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1614,
    "endTime": 1643,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-43",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Der Fisch",
    "sequenceIndex": 44,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1643,
    "endTime": 1686,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-44",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Der Besen",
    "sequenceIndex": 45,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1686,
    "endTime": 1721,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-45",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Das Auflösungszeichen",
    "sequenceIndex": 46,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1721,
    "endTime": 1750,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-46",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Oh, When the Saints…",
    "sequenceIndex": 47,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1750,
    "endTime": 1786,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-47",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Alle Vögel…",
    "sequenceIndex": 48,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1786,
    "endTime": 1822,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-48",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Big Ben",
    "sequenceIndex": 49,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1822,
    "endTime": 1862,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-49",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Die Spieluhr",
    "sequenceIndex": 50,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1862,
    "endTime": 1900,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-50",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Das Karussell",
    "sequenceIndex": 51,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1900,
    "endTime": 1939,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-51",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Die Lokomotive",
    "sequenceIndex": 52,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1939,
    "endTime": 1990,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-52",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Hokuspo-Blues",
    "sequenceIndex": 53,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 1990,
    "endTime": 2032,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "ch1-53",
    "bookId": "tastenzauberei-1",
    "providerName": "Piano Companion (Chapters)",
    "title": "Beethoven: An die Freude",
    "sequenceIndex": 54,
    "youtubeVideoId": "lguxe5bEqXo",
    "startTime": 2032,
    "endTime": 2152,
    "checkpoints": [
      "Focus on the rhythm and dynamics"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-OWNuHmwqAqo",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Durch Berg und Tal\" (Primo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 1,
    "youtubeVideoId": "OWNuHmwqAqo",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-VMyoFH_KCyQ",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Durch Berg und Tal\" (Secondo Stimme zum Mitspielen)",
    "sequenceIndex": 2,
    "youtubeVideoId": "VMyoFH_KCyQ",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-D7PifYT8RLE",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Endlich Ferien!\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 3,
    "youtubeVideoId": "D7PifYT8RLE",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-OqfLg2WXbtA",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Hasen-Blues\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 4,
    "youtubeVideoId": "OqfLg2WXbtA",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-qQK51rWc5xY",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Sanfte Wellen\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 5,
    "youtubeVideoId": "qQK51rWc5xY",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-Cn0iilDVilM",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Indianertanz\" (William Gillock) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 6,
    "youtubeVideoId": "Cn0iilDVilM",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-A1p19_biuiI",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Honigglas-Boogie\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 7,
    "youtubeVideoId": "A1p19_biuiI",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-EijNAOmrGGE",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Wettrennen\" (Primo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 8,
    "youtubeVideoId": "EijNAOmrGGE",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-fYAmB2FudyM",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Wettrennen\" (Secondo Stimme zum Mitspielen)",
    "sequenceIndex": 9,
    "youtubeVideoId": "fYAmB2FudyM",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-bCz7_D5U7FI",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Dino spielt Schlagzeug\" (Primo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 10,
    "youtubeVideoId": "bCz7_D5U7FI",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-Wv2T7L1RgEE",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Dino spielt Schlagzeug\" (Secondo Stimme zum Mitspielen)",
    "sequenceIndex": 11,
    "youtubeVideoId": "Wv2T7L1RgEE",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-jBcSBQ6HiAo",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Allegretto\" (A. Diabelli) Primo-Stimme aus der Klavierschule \"Tastenzauberei\" Band 2 von A. Drabon",
    "sequenceIndex": 12,
    "youtubeVideoId": "jBcSBQ6HiAo",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-lZ35iurOTz4",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Allegretto\" (A. Diabelli) Secondo-Stimme aus der Klavierschule \"Tastenzauberei\" Band 2 von A.Drabon",
    "sequenceIndex": 13,
    "youtubeVideoId": "lZ35iurOTz4",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-FUgPrC4dZ9k",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Eile und Weile\" (Primo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 14,
    "youtubeVideoId": "FUgPrC4dZ9k",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-beq0NDgZ1eY",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Eile und Weile\" (Secondo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 15,
    "youtubeVideoId": "beq0NDgZ1eY",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-PSqjB2MtyOA",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Die Lok fährt weiter\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 16,
    "youtubeVideoId": "PSqjB2MtyOA",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-thWMuSHlj8U",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Das Meer\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 17,
    "youtubeVideoId": "thWMuSHlj8U",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-Uh9BvwSHvjg",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Tarantella\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 18,
    "youtubeVideoId": "Uh9BvwSHvjg",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-06ynDLCIXgU",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Autorennen\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 19,
    "youtubeVideoId": "06ynDLCIXgU",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-04T86aj33m8",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Bella Bimba\" (Primo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 20,
    "youtubeVideoId": "04T86aj33m8",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p--19sGP6s20c",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Bella Bimba\" (Secondo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 21,
    "youtubeVideoId": "-19sGP6s20c",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-zQVisF__T5U",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Fang mich doch!\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 22,
    "youtubeVideoId": "zQVisF__T5U",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-xket1QllO8g",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Der Mond ist aufgegangen\" (Primo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 23,
    "youtubeVideoId": "xket1QllO8g",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-LUOdNoTc1P8",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Der Mond ist aufgegangen\" (Secondo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 24,
    "youtubeVideoId": "LUOdNoTc1P8",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-46SBpiigpEs",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"What shall we do...\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 25,
    "youtubeVideoId": "46SBpiigpEs",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-ldM4pA7KF-8",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Der Wind\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 26,
    "youtubeVideoId": "ldM4pA7KF-8",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-CRsdv5GcWWc",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Die Affen rasen...\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 27,
    "youtubeVideoId": "CRsdv5GcWWc",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-_2TWj9gZHfg",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Vogel-Cha-Cha\" (Primo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 28,
    "youtubeVideoId": "_2TWj9gZHfg",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-a28iw-6i1XA",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Vogel-Cha-Cha\" (Secondo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 29,
    "youtubeVideoId": "a28iw-6i1XA",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-u9JRamO-Woo",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Wiegenlied\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 30,
    "youtubeVideoId": "u9JRamO-Woo",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-kr5jE-gltu8",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Bruder Jakob\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 31,
    "youtubeVideoId": "kr5jE-gltu8",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-KEm6TFhZ500",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Ungarischer Sprungtanz\" (Primo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 32,
    "youtubeVideoId": "KEm6TFhZ500",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-xDOT3E7eAuQ",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Ungarischer Sprungtanz\" (Secondo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 33,
    "youtubeVideoId": "xDOT3E7eAuQ",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-LB3dgy35-WI",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Kleine Sonate\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 34,
    "youtubeVideoId": "LB3dgy35-WI",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-w0w2xH5Ojj4",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Dur oder Moll?\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 35,
    "youtubeVideoId": "w0w2xH5Ojj4",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-5qgR_3dImn4",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Zwei kleine Wölfe\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 36,
    "youtubeVideoId": "5qgR_3dImn4",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-R1gBdekAA3I",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Auf der Wippe\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 37,
    "youtubeVideoId": "R1gBdekAA3I",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-iziEHoT-MG8",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Ballspiel\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 38,
    "youtubeVideoId": "iziEHoT-MG8",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-zdFDccUe3F4",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Luftballons\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 39,
    "youtubeVideoId": "zdFDccUe3F4",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-fdKv-CMqWww",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Neue Lagen\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 40,
    "youtubeVideoId": "fdKv-CMqWww",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-sP-ytVFMiD0",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Schwimmen\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 41,
    "youtubeVideoId": "sP-ytVFMiD0",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-zvyzUNW8pk4",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Kleiner Tanz\" von W. A. Mozart, aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 42,
    "youtubeVideoId": "zvyzUNW8pk4",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-H4O2DB1lMlA",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Alla turca\" (Türkischer Marsch) op. 149 No. 26 von Anton Diabelli (Secondo)",
    "sequenceIndex": 43,
    "youtubeVideoId": "H4O2DB1lMlA",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-35WlWzvJ69k",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Alla turca\" (Türkischer Marsch) op. 149 No. 26 von Anton Diabelli (Primo)",
    "sequenceIndex": 44,
    "youtubeVideoId": "35WlWzvJ69k",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-f5gXdPkYWfY",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Wanzentanz\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 45,
    "youtubeVideoId": "f5gXdPkYWfY",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-97vgoHVw0zc",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Bären-Boogie\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 46,
    "youtubeVideoId": "97vgoHVw0zc",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-b1UqI79iwbU",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Der fliegende Teppich\" (Secondo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 47,
    "youtubeVideoId": "b1UqI79iwbU",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-eplPCUXAWGA",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Der fliegende Teppich\" (Primo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 48,
    "youtubeVideoId": "eplPCUXAWGA",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-2FSicpwHIow",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Altes Lied\" (D.G.Türk) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 49,
    "youtubeVideoId": "2FSicpwHIow",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-qlNsTvd7jk0",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"New Song\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 50,
    "youtubeVideoId": "qlNsTvd7jk0",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-_u_e3F742is",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Rondino\" (Secondo) von A. Diabelli, aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 51,
    "youtubeVideoId": "_u_e3F742is",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-CE3A-erZVkw",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Rondino\" (Primo) von A. Diabelli, aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 52,
    "youtubeVideoId": "CE3A-erZVkw",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-FCLNq5tf1zY",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Ein trauriger Schultag\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 53,
    "youtubeVideoId": "FCLNq5tf1zY",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-dMKlbGtmVI0",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Eine kleine Nachtmusik\" (Secondo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 54,
    "youtubeVideoId": "dMKlbGtmVI0",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-0z2NCHv3DrA",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Eine kleine Nachtmusik\" (Primo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 55,
    "youtubeVideoId": "0z2NCHv3DrA",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-ei4jaufiDEM",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Gondellied\" (Secondo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 56,
    "youtubeVideoId": "ei4jaufiDEM",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-lIiAEm6bt0w",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Gondellied\" (Primo) aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 57,
    "youtubeVideoId": "lIiAEm6bt0w",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-T4JS3hRw94s",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Der reisende Affe (die Tonarten)\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 58,
    "youtubeVideoId": "T4JS3hRw94s",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-666bSjsvp-I",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Marsmännchen\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 59,
    "youtubeVideoId": "666bSjsvp-I",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-_E324ZxWo1M",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Scherzo\" (Secondo) von A. Diabelli, aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 60,
    "youtubeVideoId": "_E324ZxWo1M",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-dRfxI0eeySg",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Scherzo\" (Primo) von A. Diabelli, aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 61,
    "youtubeVideoId": "dRfxI0eeySg",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-PoCRKRnhbGs",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Nachricht aus dem Weltraum\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 62,
    "youtubeVideoId": "PoCRKRnhbGs",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p--6GU47XR5Dc",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Terzen-Rock\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 63,
    "youtubeVideoId": "-6GU47XR5Dc",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "tz2p-fJCQCrfarMo",
    "bookId": "tastenzauberei-2",
    "providerName": "Anikó Drabon (Playlist)",
    "title": "\"Eurovisionsmelodie\" aus der Klavierschule \"Tastenzauberei\" Band 2 von Aniko Drabon",
    "sequenceIndex": 64,
    "youtubeVideoId": "fJCQCrfarMo",
    "startTime": 0,
    "endTime": 0,
    "checkpoints": [
      "Master Band 2 techniques"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-0",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Wettrennen",
    "sequenceIndex": 1,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 0,
    "endTime": 70,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-1",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Ballspiel",
    "sequenceIndex": 2,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 70,
    "endTime": 100,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-2",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Auf der Wippe",
    "sequenceIndex": 3,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 100,
    "endTime": 141,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-3",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Durch Berg und Tal",
    "sequenceIndex": 4,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 141,
    "endTime": 190,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-4",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Luftballons",
    "sequenceIndex": 5,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 190,
    "endTime": 269,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-5",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Dino spielt Schlagzeug",
    "sequenceIndex": 6,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 269,
    "endTime": 306,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-6",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Schwimmen",
    "sequenceIndex": 7,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 306,
    "endTime": 381,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-7",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Wanzentanz",
    "sequenceIndex": 8,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 381,
    "endTime": 420,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-8",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Kleiner Tanz",
    "sequenceIndex": 9,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 420,
    "endTime": 454,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-9",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Eile und Weile",
    "sequenceIndex": 10,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 454,
    "endTime": 490,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-10",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Neue Lagen",
    "sequenceIndex": 11,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 490,
    "endTime": 530,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-11",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Fang mich doch!",
    "sequenceIndex": 12,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 530,
    "endTime": 566,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-12",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Honigglas-Boogie",
    "sequenceIndex": 13,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 566,
    "endTime": 623,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-13",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Der Mond ist aufgegangen",
    "sequenceIndex": 14,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 623,
    "endTime": 686,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-14",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Der Wind",
    "sequenceIndex": 15,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 686,
    "endTime": 731,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-15",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Ungarischer-Sprungtanz",
    "sequenceIndex": 16,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 731,
    "endTime": 780,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-16",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Vogel-Cha-Cha",
    "sequenceIndex": 17,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 780,
    "endTime": 835,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-17",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Dur oder Moll?",
    "sequenceIndex": 18,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 835,
    "endTime": 871,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-18",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Das Meer",
    "sequenceIndex": 19,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 871,
    "endTime": 926,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-19",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Autorennen",
    "sequenceIndex": 20,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 926,
    "endTime": 954,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-20",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Bruder Jakob",
    "sequenceIndex": 21,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 954,
    "endTime": 975,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-21",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "What shall we do…",
    "sequenceIndex": 22,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 975,
    "endTime": 1014,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-22",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Bella Bimba",
    "sequenceIndex": 23,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 1014,
    "endTime": 1064,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-23",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Tarantella",
    "sequenceIndex": 24,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 1064,
    "endTime": 1102,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-24",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Allegretto",
    "sequenceIndex": 25,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 1102,
    "endTime": 1192,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-25",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Die Lok fährt weiter",
    "sequenceIndex": 26,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 1192,
    "endTime": 1236,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-26",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Türkischer Marsch von Diabelli",
    "sequenceIndex": 27,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 1236,
    "endTime": 1349,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-27",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Die Affen rasen…",
    "sequenceIndex": 28,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 1349,
    "endTime": 1404,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-28",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Wiegenlied",
    "sequenceIndex": 29,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 1404,
    "endTime": 1468,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-29",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Der fliegende Teppich",
    "sequenceIndex": 30,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 1468,
    "endTime": 1521,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-30",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Gondellied",
    "sequenceIndex": 31,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 1521,
    "endTime": 1580,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-31",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Der reisende Affe",
    "sequenceIndex": 32,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 1580,
    "endTime": 1650,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-32",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Kleine Sonate",
    "sequenceIndex": 33,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 1650,
    "endTime": 1703,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-33",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Altes Lied",
    "sequenceIndex": 34,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 1703,
    "endTime": 1727,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-34",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Eurovisionsmelodie",
    "sequenceIndex": 35,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 1727,
    "endTime": 1770,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-35",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Nachricht aus dem Weltraum",
    "sequenceIndex": 36,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 1770,
    "endTime": 1814,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-36",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Marsmännchen",
    "sequenceIndex": 37,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 1814,
    "endTime": 1863,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-37",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Indianertanz",
    "sequenceIndex": 38,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 1863,
    "endTime": 1910,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-38",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Scherzo von Diabelli",
    "sequenceIndex": 39,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 1910,
    "endTime": 2013,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-39",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Hasen-Blues",
    "sequenceIndex": 40,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 2013,
    "endTime": 2072,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-40",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Bären-Boogie",
    "sequenceIndex": 41,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 2072,
    "endTime": 2135,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-41",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Sanfte Wellen",
    "sequenceIndex": 42,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 2135,
    "endTime": 2196,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-42",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Herzen-Rock",
    "sequenceIndex": 43,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 2196,
    "endTime": 2231,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-43",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Rondino von Diabelli",
    "sequenceIndex": 44,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 2231,
    "endTime": 2338,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-44",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Ein trauriger Schultag",
    "sequenceIndex": 45,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 2338,
    "endTime": 2384,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-45",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Endlich Ferien!",
    "sequenceIndex": 46,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 2384,
    "endTime": 2423,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-46",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Eine kleine Nachtmusik von Mozart",
    "sequenceIndex": 47,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 2423,
    "endTime": 381,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  },
  {
    "id": "ch2-47",
    "bookId": "tastenzauberei-2",
    "providerName": "Gavin Brady (Chapters)",
    "title": "Music",
    "sequenceIndex": 48,
    "youtubeVideoId": "8SyxKcHZanc",
    "startTime": 381,
    "endTime": 501,
    "checkpoints": [
      "Follow the chapter timing accurately"
    ],
    "isCompleted": false
  }
];
