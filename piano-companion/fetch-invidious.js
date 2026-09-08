import https from 'https';
import fs from 'fs';

https.get('https://invidious.jing.rocks/api/v1/playlists/PL10p3mlGiANOP_3RdrSZYv3kG5AzDmONh', {
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
        fs.writeFileSync('extracted-playlist.json', JSON.stringify(videos, null, 2));
        console.log(`Extracted ${videos.length} videos from Invidious API.`);
      } else {
        console.log('No videos found in Invidious response.');
      }
    } catch(e) {
      console.log('Error parsing Invidious API:', e.message);
    }
  });
}).on('error', (e) => {
    console.error(e);
});
