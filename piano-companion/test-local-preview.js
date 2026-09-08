import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Collect console messages
  page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));

  // Collect page errors (uncaught exceptions)
  page.on('pageerror', exception => {
    console.log(`[BROWSER ERROR] Uncaught exception: "${exception}"`);
  });

  console.log('Navigating to http://localhost:4173/');
  try {
    const response = await page.goto('http://localhost:4173/', { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`Status Code: ${response.status()}`);

    // Check if the title rendered
    const titleText = await page.locator('h1').textContent();
    console.log(`[PAGE DOM] Found h1: ${titleText}`);

    // Check if Dexie populated the dropdown
    const selectOptions = await page.locator('select option').count();
    console.log(`[PAGE DOM] Dropdown has ${selectOptions} options`);

  } catch (error) {
    console.error(`[PLAYWRIGHT ERROR] ${error}`);
  }

  await browser.close();
})();
