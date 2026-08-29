const https = require('https');

https.get('https://www.youtube.com/playlist?list=PL10p3mlGiANOP_3RdrSZYv3kG5AzDmONh', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/var ytInitialData = (\{.*?\});<\/script>/);
    if (match) {
      const parsed = JSON.parse(match[1]);
      let items = [];
      try {
        // We have to safely dig into this nested object
        const tabs = parsed.contents?.twoColumnBrowseResultsRenderer?.tabs;
        const tab = tabs?.find(t => t.tabRenderer?.content?.sectionListRenderer);
        const contents = tab?.tabRenderer?.content?.sectionListRenderer?.contents;
        const playlistContents = contents?.find(c => c.itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer)?.itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer?.contents;

        items = playlistContents || [];
      } catch (e) {
        console.error(e);
      }

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
