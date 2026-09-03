import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Navigating to https://piano-practice-companion.pages.dev/');
  await page.goto('https://piano-practice-companion.pages.dev/', { waitUntil: 'networkidle', timeout: 30000 });

  // Click the provider to change to VikaPiano
  await page.locator('button:has-text("VikaPiano")').click();
  await page.waitForTimeout(500);

  const titleText = await page.locator('h1.lesson-title').textContent();
  console.log(`[PAGE DOM] Found h1: ${titleText}`);

  // Open dropdown
  await page.locator('.header-card').click();
  await page.waitForTimeout(500);

  // Count the custom li elements
  const listItems = await page.locator('.lesson-dropdown li').count();
  console.log(`[PAGE DOM] Dropdown has ${listItems} options`);

  await browser.close();
})();
