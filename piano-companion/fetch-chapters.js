import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.youtube.com/watch?v=lguxe5bEqXo', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  // Accept cookies if presented
  try {
      const acceptBtn = await page.locator('button[aria-label="Accept all"]').first();
      if (await acceptBtn.isVisible()) {
          await acceptBtn.click();
          await page.waitForTimeout(2000);
      }
  } catch(e) {}

  // Open description to see all chapters if needed
  try {
    const expandBtn = await page.locator('#expand').first();
    if (await expandBtn.isVisible()) {
        await expandBtn.click();
        await page.waitForTimeout(1000);
    }
  } catch (e) {}

  const html = await page.content();
  fs.writeFileSync('video-page.html', html);

  // Extract chapters from the description text or macro markers
  const chapters = await page.evaluate(() => {
    // Sometimes YouTube formats chapters as specific macro markers
    const markers = Array.from(document.querySelectorAll('ytd-macro-markers-list-item-renderer'));
    if (markers.length > 0) {
       return markers.map(m => {
           const title = m.querySelector('#details h4')?.textContent?.trim();
           const time = m.querySelector('#time')?.textContent?.trim();
           return { title, time };
       });
    }

    // Otherwise extract from description text formatted like MM:SS Title
    const desc = document.querySelector('#description-inline-expander')?.textContent || '';
    const regex = /(\d+:\d{2}(?::\d{2})?)\s+(.*)/g;
    let match;
    const results = [];
    while ((match = regex.exec(desc)) !== null) {
      results.push({ time: match[1], title: match[2].trim() });
    }
    return results;
  });

  console.log(JSON.stringify(chapters, null, 2));
  fs.writeFileSync('extracted-chapters.json', JSON.stringify(chapters, null, 2));

  await browser.close();
})();
