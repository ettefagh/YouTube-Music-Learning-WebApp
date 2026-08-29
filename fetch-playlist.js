const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.youtube.com/playlist?list=PL10p3mlGiANOP_3RdrSZYv3kG5AzDmONh', { waitUntil: 'networkidle' });

  // click "Reject all" or similar cookie banners if they appear
  try {
      const rejectBtn = await page.locator('button:has-text("Reject all")').first();
      if (await rejectBtn.isVisible()) {
          await rejectBtn.click();
          await page.waitForTimeout(2000);
      }
  } catch(e) {}

  // Scroll to load all items
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(1000);
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

  console.log(JSON.stringify(videos, null, 2));

  await browser.close();
})();
