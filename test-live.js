const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Collect console messages
  page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));

  // Collect page errors (uncaught exceptions)
  page.on('pageerror', exception => {
    console.log(`[BROWSER ERROR] Uncaught exception: "${exception}"`);
  });

  console.log('Navigating to https://piano-practice-companion.pages.dev/');
  try {
    await page.goto('https://piano-practice-companion.pages.dev/', { waitUntil: 'networkidle', timeout: 30000 });

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
