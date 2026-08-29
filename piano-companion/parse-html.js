import fs from 'fs';

const html = fs.readFileSync('page.html', 'utf8');

// Look for ytInitialData script block
const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
if (match) {
  try {
    const data = JSON.parse(match[1]);
    const tabs = data.contents.twoColumnBrowseResultsRenderer.tabs;
    const tab = tabs.find(t => t.tabRenderer?.content?.sectionListRenderer);
    const contents = tab.tabRenderer.content.sectionListRenderer.contents;
    const itemSection = contents.find(c => c.itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer);
    const playlistContents = itemSection.itemSectionRenderer.contents[0].playlistVideoListRenderer.contents;

    const videos = playlistContents.map((item, index) => {
      if (!item.playlistVideoRenderer) return null;
      return {
        sequenceIndex: index + 1,
        title: item.playlistVideoRenderer.title.runs[0].text,
        videoId: item.playlistVideoRenderer.videoId
      };
    }).filter(Boolean);

    fs.writeFileSync('extracted-playlist.json', JSON.stringify(videos, null, 2));
    console.log(`Extracted ${videos.length} videos`);
  } catch (e) {
    console.error("Error parsing structure", e);
  }
} else {
  console.log("No ytInitialData found");
}
