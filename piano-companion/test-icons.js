import { chromium } from 'playwright';
import path from 'path';

async function verifyIcons() {
  console.log('Starting Playwright icon verification...');
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome'
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  const baseUrl = 'https://a6b9235d.piano-practice-companion.pages.dev';

  const iconUrls = [
    '/favicon.svg',
    '/favicon.png',
    '/apple-touch-icon.png',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/icon-maskable-192.png',
    '/icons/icon-maskable-512.png',
    '/manifest.webmanifest'
  ];

  for (const url of iconUrls) {
    const fullUrl = `${baseUrl}${url}`;
    const res = await page.goto(fullUrl);
    console.log(`[HTTP ${res.status()}] ${url}`);
    if (res.status() !== 200) {
      throw new Error(`Failed to fetch ${url} - HTTP status ${res.status()}`);
    }
  }

  // Verify manifest JSON contents
  console.log('Verifying manifest.webmanifest contents...');
  const manifestRes = await page.goto(`${baseUrl}/manifest.webmanifest`);
  const manifestJson = JSON.parse(await manifestRes.text());
  console.log('Manifest theme_color:', manifestJson.theme_color);
  if (manifestJson.theme_color !== '#FF0033') {
    throw new Error(`Unexpected theme_color in manifest: ${manifestJson.theme_color}`);
  }
  if (!manifestJson.icons || manifestJson.icons.length < 4) {
    throw new Error(`Manifest icons missing or incomplete: ${manifestJson.icons?.length}`);
  }

  // Verify app.html head tags
  console.log('Verifying app DOM tags...');
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  const faviconSvgHref = await page.getAttribute('link[type="image/svg+xml"]', 'href');
  const appleTouchHref = await page.getAttribute('link[rel="apple-touch-icon"]', 'href');
  const themeColor = await page.getAttribute('meta[name="theme-color"]', 'content');

  console.log('DOM favicon.svg href:', faviconSvgHref);
  console.log('DOM apple-touch-icon href:', appleTouchHref);
  console.log('DOM theme-color:', themeColor);

  if (!faviconSvgHref || !faviconSvgHref.includes('favicon.svg')) throw new Error('favicon.svg href mismatch in DOM: ' + faviconSvgHref);
  if (!appleTouchHref || !appleTouchHref.includes('apple-touch-icon.png')) throw new Error('apple-touch-icon href mismatch in DOM: ' + appleTouchHref);
  if (themeColor !== '#FF0033') throw new Error('theme-color mismatch in DOM: ' + themeColor);

  const brainDir = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\d366347d-0184-4c6c-ab32-02bbc3a951fe';
  const screenshotPath = path.join(brainDir, 'screenshot-app-with-icon.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Captured live screenshot:', screenshotPath);

  await browser.close();
  console.log('\n=============================================');
  console.log('🎉 ALL PWA & FAVICON VERIFICATIONS PASSED!');
  console.log('=============================================\n');
}

verifyIcons().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
