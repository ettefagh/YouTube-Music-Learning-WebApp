import fs from 'fs';

const html = fs.readFileSync('page.html', 'utf8');

// A more robust regex extraction
const videoIdRegex = /"playlistVideoRenderer":\{"videoId":"([^"]+)".*?"title":\{"runs":\[\{"text":"([^"]+)"/g;
let match;
const videos = [];
let index = 1;

while ((match = videoIdRegex.exec(html)) !== null) {
  // Prevent duplicates (YouTube repeats this structure)
  if (!videos.find(v => v.videoId === match[1])) {
      videos.push({
        sequenceIndex: index++,
        title: match[2].replace(/\\u0026/g, '&'),
        videoId: match[1]
      });
  }
}

fs.writeFileSync('extracted-playlist.json', JSON.stringify(videos, null, 2));
console.log(`Extracted ${videos.length} videos`);
