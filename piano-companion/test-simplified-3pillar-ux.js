import { chromium } from 'playwright';
import path from 'path';

async function runSimplified3PillarUxTest() {
  console.log('🚀 Launching Playwright Chrome in iPad touch mode (1024x768)...');
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome'
  });
  const context = await browser.newContext({
    viewport: { width: 1024, height: 768 },
    hasTouch: true,
    isMobile: true
  });
  const page = await context.newPage();

  page.on('console', msg => console.log(`[BROWSER] ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => console.log(`[PAGE ERROR] ${err.message}`));

  await page.addInitScript(() => {
    localStorage.setItem('onboardingComplete', 'true');
  });

  const brainDir = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\d366347d-0184-4c6c-ab32-02bbc3a951fe';
  const targetUrl = 'http://localhost:4173/';

  try {
    console.log(`Navigating to ${targetUrl} ...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });

    // ==========================================
    // 0. VERIFY ANIMATED SPLASH SCREEN
    // ==========================================
    console.log('0️⃣ Checking Animated Bouncing App Icon Splash Screen...');
    const splashOverlay = page.locator('.app-splash-overlay');
    if (await splashOverlay.isVisible()) {
      console.log('Found .app-splash-overlay! Capturing animated logo...');
      const animSplashImg = path.join(brainDir, 'screenshot-0a-animated-splash.png');
      await page.screenshot({ path: animSplashImg });
      console.log('📸 Captured:', animSplashImg);
    }

    console.log('Waiting for splash loading & exit animation (2.5s)...');
    await page.waitForTimeout(2800);

    // ==========================================
    // 1. VERIFY SCREEN 0: SPLASH HUB
    // ==========================================
    console.log('1️⃣ Checking Splash Hub Screen...');
    const splashHero = page.locator('.screen-splash');
    if (await splashHero.isVisible()) {
      const splashImg = path.join(brainDir, 'screenshot-0b-splash-hub.png');
      await page.screenshot({ path: splashImg });
      console.log('📸 Captured:', splashImg);

      console.log('Tapping Start Practice to enter Library...');
      await page.click('.start-funnel-btn');
      await page.waitForTimeout(1000);
    }

    // ==========================================
    // 2. VERIFY SCREEN 1: UNIFIED LIBRARY
    // ==========================================
    console.log('2️⃣ Checking .screen-library & .kids-bottom-dock...');
    await page.waitForSelector('.screen-library', { timeout: 10000 });
    await page.waitForSelector('.kids-bottom-dock', { timeout: 10000 });

    const libraryImg = path.join(brainDir, 'screenshot-1-library.png');
    await page.screenshot({ path: libraryImg });
    console.log('📸 Captured:', libraryImg);

    const bookTitle = await page.textContent('.shelf-title');
    console.log('📖 Active Book:', bookTitle);

    const teacherPillCount = await page.locator('.teacher-pill-btn').count();
    console.log(`👩‍🏫 Found ${teacherPillCount} teacher filter pills`);

    const songCount = await page.locator('.song-grid-card').count();
    console.log(`🎵 Found ${songCount} songs in library list`);

    // ==========================================
    // 3. VERIFY SCREEN 2: PRACTICE PLAYER
    // ==========================================
    console.log('3️⃣ Tapping Practice tab on 3-Pillar Dock...');
    const practiceDockBtn = page.locator('.dock-btn', { hasText: 'Practice' });
    await practiceDockBtn.click();
    await page.waitForTimeout(1000);

    await page.waitForSelector('.screen-player', { timeout: 10000 });
    const playerImg = path.join(brainDir, 'screenshot-2-player.png');
    await page.screenshot({ path: playerImg });
    console.log('📸 Captured:', playerImg);

    // ==========================================
    // 4. VERIFY SCREEN 3: MY STUDIO (COMBINED)
    // ==========================================
    console.log('4️⃣ Tapping My Studio tab on 3-Pillar Dock...');
    const studioDockBtn = page.locator('.dock-btn', { hasText: 'My Studio' });
    await studioDockBtn.click();
    await page.waitForTimeout(1000);

    await page.waitForSelector('.screen-studio-combined', { timeout: 10000 });
    console.log('Studio Screen open!');

    const studioImg = path.join(brainDir, 'screenshot-3-studio.png');
    await page.screenshot({ path: studioImg });
    console.log('📸 Captured:', studioImg);

    // ==========================================
    // 5. VERIFY SCREEN 4: PROFILE HUB (WHO'S PRACTICING?)
    // ==========================================
    console.log('5️⃣ Tapping Active Kid Avatar Chip in Header...');
    const profileChip = page.locator('.active-profile-chip');
    await profileChip.click();
    await page.waitForTimeout(1000);

    await page.waitForSelector('.screen-profile-full', { timeout: 10000 });
    const profileTitle = await page.textContent('.hero-title');
    console.log('👑 Profile Hub Title:', profileTitle);

    const dockVisibleInProfile = await page.locator('.kids-bottom-dock').isVisible();
    console.log('Bottom Dock Hidden in Profile Hub:', !dockVisibleInProfile);

    const profileImg = path.join(brainDir, 'screenshot-4-profile.png');
    await page.screenshot({ path: profileImg });
    console.log('📸 Captured:', profileImg);

    // Return back to Library from Profile
    console.log('Returning back to Library from Profile...');
    await page.click('.profile-nav-strip .back-btn');
    await page.waitForTimeout(800);

    // ==========================================
    // 6. VERIFY SCREEN 5: SETTINGS / PARENT ZONE
    // ==========================================
    console.log('6️⃣ Tapping Grown-Ups Gear Button...');
    const gearBtn = page.locator('.top-gear-btn');
    await gearBtn.click();
    await page.waitForTimeout(1000);

    await page.waitForSelector('.screen-settings-full', { timeout: 10000 });
    console.log('Settings Screen open!');

    const settingsImg = path.join(brainDir, 'screenshot-5-settings.png');
    await page.screenshot({ path: settingsImg });
    console.log('📸 Captured:', settingsImg);

    console.log('🎉 ALL 6 STATIONS SUCCESSFULLY VERIFIED!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    throw err;
  } finally {
    await browser.close();
  }
}

runSimplified3PillarUxTest();
