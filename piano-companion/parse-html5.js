import fs from 'fs';

const data = JSON.parse(fs.readFileSync('ytInitialData.json', 'utf8'));

function findPlaylistItems(obj, results = []) {
  if (Array.isArray(obj)) {
    obj.forEach(item => findPlaylistItems(item, results));
  } else if (typeof obj === 'object' && obj !== null) {
    if (obj.playlistVideoRenderer) {
      results.push(obj.playlistVideoRenderer);
    }
    if (obj.playlistPanelVideoRenderer) {
        results.push(obj.playlistPanelVideoRenderer);
    }
    Object.values(obj).forEach(val => findPlaylistItems(val, results));
  }
  return results;
}

const items = findPlaylistItems(data);
const videos = items.map((item, index) => {
    return {
        sequenceIndex: index + 1,
        title: item.title?.runs?.[0]?.text || item.title?.simpleText || 'Unknown Title',
        videoId: item.videoId
    }
}).filter(v => v.videoId && v.title !== 'Unknown Title');

// YouTube sometimes duplicates items in different UI layers, let's unique them
const uniqueVideos = [];
const seenIds = new Set();
for (const v of videos) {
    if (!seenIds.has(v.videoId)) {
        seenIds.add(v.videoId);
        v.sequenceIndex = uniqueVideos.length + 1; // Re-index after unique
        uniqueVideos.push(v);
    }
}

fs.writeFileSync('extracted-playlist.json', JSON.stringify(uniqueVideos, null, 2));
console.log(`Extracted ${uniqueVideos.length} unique videos.`);
