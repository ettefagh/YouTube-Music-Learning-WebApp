import fs from 'fs';

const html = fs.readFileSync('page.html', 'utf8');

const regex = /"watchEndpoint":\{"videoId":"([^"]+)","playlistId":"PL10p3mlGiANOP_3RdrSZYv3kG5AzDmONh","playerParams":"[^"]+","loggingContext":[^}]+},"title":\{"runs":\[\{"text":"([^"]+)"/g;

// Or simpler approach: find titles associated with video ids in playlist
const simpleRegex = /"videoId":"([^"]+)".*?"title":\{"runs":\[\{"text":"([^"]+)"/g;

let match;
const videos = [];
let index = 1;

while ((match = simpleRegex.exec(html)) !== null) {
  // Discard generic matches
  if (['Description', 'Playback', 'Keyboard shortcuts', 'General'].includes(match[2])) continue;

  if (!videos.find(v => v.videoId === match[1])) {
      videos.push({
        sequenceIndex: index++,
        title: match[2].replace(/\\u0026/g, '&').replace(/\\u003e/g, '>').replace(/\\u003c/g, '<'),
        videoId: match[1]
      });
  }
}

fs.writeFileSync('extracted-playlist.json', JSON.stringify(videos, null, 2));
console.log(`Extracted ${videos.length} videos`);
