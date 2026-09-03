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

  // Open description
  try {
    const expandBtn = await page.locator('tp-yt-paper-button#expand').first();
    if (await expandBtn.isVisible()) {
        await expandBtn.click();
        await page.waitForTimeout(1000);
    }
  } catch (e) {}

  const desc = await page.locator('#description-inline-expander').innerText();
  fs.writeFileSync('desc.txt', desc);

  const regex = /(\d+:\d{2}(?::\d{2})?)\s+-\s+(.*)/g;
  let match;
  const results = [];
  while ((match = regex.exec(desc)) !== null) {
    results.push({ time: match[1], title: match[2].trim() });
  }

  // YouTube uses a specific format, if ` - ` isn't present, try space
  if (results.length === 0) {
      const regex2 = /(\d+:\d{2}(?::\d{2})?)\s+(.*)/g;
      while ((match = regex2.exec(desc)) !== null) {
        results.push({ time: match[1], title: match[2].trim() });
      }
  }

  console.log(JSON.stringify(results, null, 2));
  fs.writeFileSync('extracted-chapters.json', JSON.stringify(results, null, 2));

  await browser.close();
})();
