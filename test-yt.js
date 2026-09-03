const https = require('https');

https.get('https://www.youtube.com/playlist?list=PL10p3mlGiANOP_3RdrSZYv3kG5AzDmONh', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/var ytInitialData = (\{.*?\});<\/script>/);
    if (match) {
      const parsed = JSON.parse(match[1]);
      const items = parsed.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents;

      const videos = items.map(item => {
        if (!item.playlistVideoRenderer) return null;
        return {
          id: item.playlistVideoRenderer.videoId,
          title: item.playlistVideoRenderer.title.runs[0].text,
          author: item.playlistVideoRenderer.shortBylineText?.runs[0]?.text
        };
      }).filter(Boolean);
      console.log(videos);
    } else {
      console.log('No match');
    }
  });
});
