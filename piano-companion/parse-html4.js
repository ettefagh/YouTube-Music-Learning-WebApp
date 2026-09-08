import fs from 'fs';

const html = fs.readFileSync('page.html', 'utf8');

const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
if (match) {
  const data = JSON.parse(match[1]);
  // Write to a temp file so we can inspect it manually via grep
  fs.writeFileSync('ytInitialData.json', JSON.stringify(data, null, 2));
}
