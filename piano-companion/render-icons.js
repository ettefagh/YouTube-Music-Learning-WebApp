// render-icons.js
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function renderIcons() {
  console.log('Rendering high-resolution icons from SVG...');
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome'
  });

  const staticDir = path.resolve('static');
  const iconsDir = path.join(staticDir, 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const standardSvg = fs.readFileSync(path.join(staticDir, 'favicon.svg'), 'utf8');
  const maskableSvg = fs.readFileSync(path.join(iconsDir, 'icon-maskable.svg'), 'utf8');

  const targets = [
    { svg: standardSvg, width: 32, height: 32, out: path.join(staticDir, 'favicon.png') },
    { svg: standardSvg, width: 180, height: 180, out: path.join(staticDir, 'apple-touch-icon.png') },
    { svg: standardSvg, width: 192, height: 192, out: path.join(iconsDir, 'icon-192.png') },
    { svg: standardSvg, width: 512, height: 512, out: path.join(iconsDir, 'icon-512.png') },
    { svg: maskableSvg, width: 192, height: 192, out: path.join(iconsDir, 'icon-maskable-192.png') },
    { svg: maskableSvg, width: 512, height: 512, out: path.join(iconsDir, 'icon-maskable-512.png') },
  ];

  for (const t of targets) {
    const page = await browser.newPage({
      viewport: { width: t.width, height: t.height },
      deviceScaleFactor: 1
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            html, body {
              margin: 0;
              padding: 0;
              width: ${t.width}px;
              height: ${t.height}px;
              overflow: hidden;
              background: transparent;
            }
            svg {
              width: ${t.width}px;
              height: ${t.height}px;
              display: block;
            }
          </style>
        </head>
        <body>
          ${t.svg}
        </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'load' });
    await page.screenshot({
      path: t.out,
      omitBackground: true
    });
    await page.close();
    console.log(`Generated: ${t.out} (${t.width}x${t.height})`);
  }

  await browser.close();
  console.log('All icons generated successfully!');
}

renderIcons().catch(err => {
  console.error('Failed to render icons:', err);
  process.exit(1);
});
