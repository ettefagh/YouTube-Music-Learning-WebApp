import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.youtube.com/playlist?list=PL10p3mlGiANOP_3RdrSZYv3kG5AzDmONh');
  await page.waitForTimeout(5000);

  // Accept cookies if presented
  try {
      const acceptBtn = await page.locator('button[aria-label="Accept all"]').first();
      if (await acceptBtn.isVisible()) {
          await acceptBtn.click();
          await page.waitForTimeout(2000);
      }
  } catch(e) {}

  // Dump the raw HTML to see what's actually rendering
  const html = await page.content();
  fs.writeFileSync('page.html', html);

  await browser.close();
})();
