import https from 'https';
import fs from 'fs';

https.get('https://inv.nadeko.net/api/v1/playlists/PL10p3mlGiANN9MuQvfLahduyGg7jUZmJn', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.videos) {
        const videos = parsed.videos.map((v, i) => ({
          sequenceIndex: i + 1,
          title: v.title,
          videoId: v.videoId
        }));
        fs.writeFileSync('extracted-band2-playlist.json', JSON.stringify(videos, null, 2));
        console.log(`Extracted ${videos.length} videos from Band 2 Playlist.`);
      } else {
         console.log(`No videos found.`);
      }
    } catch(e) {
      console.log(`Error parsing JSON:`, e.message);
    }
  });
});
