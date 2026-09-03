import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Navigating to https://piano-practice-companion.pages.dev/index.html');
  try {
    const response = await page.goto('https://piano-practice-companion.pages.dev/', { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`Status Code: ${response.status()}`);
    console.log(await page.content());

  } catch (error) {
    console.error(`[PLAYWRIGHT ERROR] ${error}`);
  }

  await browser.close();
})();
