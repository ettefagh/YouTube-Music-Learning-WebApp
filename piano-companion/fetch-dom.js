import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.youtube.com/playlist?list=PL10p3mlGiANOP_3RdrSZYv3kG5AzDmONh', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  // Accept cookies if presented
  try {
      const acceptBtn = await page.locator('button[aria-label="Accept all"]').first();
      if (await acceptBtn.isVisible()) {
          await acceptBtn.click();
          await page.waitForTimeout(2000);
      }
  } catch(e) {}

  await page.waitForSelector('ytd-playlist-video-renderer, ytd-playlist-panel-video-renderer', { timeout: 10000 }).catch(() => console.log('Timeout waiting for playlist renderer'));

  let previousHeight = 0;
  for (let i = 0; i < 10; i++) {
    const currentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(1500);
    if (currentHeight === previousHeight) break; // Reached bottom
    previousHeight = currentHeight;
  }

  const videos = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('ytd-playlist-video-renderer'));
    return items.map((item, index) => {
      const titleEl = item.querySelector('#video-title');
      const title = titleEl ? titleEl.textContent.trim() : '';
      const href = titleEl ? titleEl.getAttribute('href') : '';
      const videoIdMatch = href ? href.match(/v=([^&]+)/) : null;
      const videoId = videoIdMatch ? videoIdMatch[1] : '';
      return {
        sequenceIndex: index + 1,
        title,
        videoId
      };
    }).filter(v => v.videoId);
  });

  fs.writeFileSync('extracted-playlist.json', JSON.stringify(videos, null, 2));
  console.log(`Extracted ${videos.length} videos via Playwright DOM`);

  await browser.close();
})();
