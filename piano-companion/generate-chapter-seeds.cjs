const fs = require('fs');

const extracted = JSON.parse(fs.readFileSync('extracted-chapters.json', 'utf8'));

// Filter out duplicates and Transcript
const uniqueChapters = [];
const seenTitles = new Set();
extracted.forEach(item => {
    if (item.title === 'Transcript') return;
    if (!seenTitles.has(item.title)) {
        seenTitles.add(item.title);
        uniqueChapters.push(item);
    }
});

function timeToSeconds(timeStr) {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else {
        return parts[0] * 60 + parts[1];
    }
}

const lessons = uniqueChapters.map((chapter, index) => {
    const startTime = timeToSeconds(chapter.time);
    const nextChapter = uniqueChapters[index + 1];
    const endTime = nextChapter ? timeToSeconds(nextChapter.time) : startTime + 120; // 2 min default for last

    return `  {
    id: 'ch-${index}',
    bookId: 'tastenzauberei-1',
    providerName: 'Anikó Drabon (Original)',
    title: ${JSON.stringify(chapter.title)},
    sequenceIndex: ${index + 1},
    youtubeVideoId: 'lguxe5bEqXo',
    startTime: ${startTime},
    endTime: ${endTime},
    checkpoints: ['Focus on the rhythm and dynamics'],
    isCompleted: false
  }`;
});

let seedData = fs.readFileSync('src/lib/db/seedData.ts', 'utf8');

// Replace everything inside SEED_LESSONS
seedData = seedData.replace(
    /export const SEED_LESSONS: LocalLesson\[\] = \[[\s\S]*?\];/,
    `export const SEED_LESSONS: LocalLesson[] = [\n${lessons.join(',\n')}\n];`
);

fs.writeFileSync('src/lib/db/seedData.ts', seedData);
console.log(`Generated ${lessons.length} chapter lessons.`);
