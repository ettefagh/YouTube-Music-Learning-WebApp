import https from 'https';
import fs from 'fs';

const instances = [
    'invidious.nerdvpn.de',
    'inv.nadeko.net',
    'invidious.lunar.icu'
];

function tryFetch(index) {
    if (index >= instances.length) {
        console.log('All instances failed.');
        return;
    }
    const host = instances[index];
    console.log(`Trying ${host}...`);
    https.get(`https://${host}/api/v1/playlists/PL10p3mlGiANOP_3RdrSZYv3kG5AzDmONh`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 5000
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
            console.log(`Extracted ${videos.length} videos from Invidious API (${host}).`);
          } else {
             console.log(`No videos found. Response: ${data.substring(0, 100)}`);
             tryFetch(index + 1);
          }
        } catch(e) {
          console.log(`Error parsing JSON on ${host}:`, e.message);
          tryFetch(index + 1);
        }
      });
    }).on('error', (e) => {
        console.log(`Error on ${host}:`, e.message);
        tryFetch(index + 1);
    });
}

tryFetch(0);
