import fs from 'fs';

const data = JSON.parse(fs.readFileSync('ytInitialData.json', 'utf8'));

// Try searching for generic video renders just in case
function findVideos(obj, results = []) {
  if (Array.isArray(obj)) {
    obj.forEach(item => findVideos(item, results));
  } else if (typeof obj === 'object' && obj !== null) {
    if (obj.videoId && obj.title && obj.title.runs && obj.title.runs[0] && obj.title.runs[0].text) {
      // Avoid generic metadata matches
      if (!['Description', 'Playback', 'Keyboard shortcuts', 'General'].includes(obj.title.runs[0].text)) {
         results.push({ videoId: obj.videoId, title: obj.title.runs[0].text });
      }
    }
    Object.values(obj).forEach(val => findVideos(val, results));
  }
  return results;
}

const items = findVideos(data);

const uniqueVideos = [];
const seenIds = new Set();
for (const v of items) {
    if (!seenIds.has(v.videoId)) {
        seenIds.add(v.videoId);
        v.sequenceIndex = uniqueVideos.length + 1;
        uniqueVideos.push(v);
    }
}

fs.writeFileSync('extracted-playlist.json', JSON.stringify(uniqueVideos, null, 2));
console.log(`Extracted ${uniqueVideos.length} unique videos.`);
