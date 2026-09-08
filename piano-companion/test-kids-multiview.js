import { chromium } from 'playwright';
import path from 'path';

async function runTest() {
  console.log('Launching Playwright Chrome in tablet touch mode...');
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

  // Set onboardingComplete before load
  await page.addInitScript(() => {
    localStorage.setItem('onboardingComplete', 'true');
  });

  const brainDir = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\d366347d-0184-4c6c-ab32-02bbc3a951fe';

  try {
    console.log('Navigating to https://a7cd4181.piano-practice-companion.pages.dev/ ...');
    await page.goto('https://a7cd4181.piano-practice-companion.pages.dev/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // 1. Verify Hub Screen Loaded
    console.log('Verifying Hub screen...');
    const brandText = await page.textContent('.brand-title');
    console.log('Brand title:', brandText);
    if (!brandText || !brandText.includes('Piano Companion')) {
      throw new Error('Kids header brand title not found');
    }

    // Capture Hub Screenshot
    const hubScreenshotPath = path.join(brainDir, 'screenshot-kids-hub.png');
    await page.screenshot({ path: hubScreenshotPath, fullPage: true });
    console.log('Captured:', hubScreenshotPath);

    // 2. Test switching profile to Mia
    console.log('Testing profile switch to Mia...');
    const miaBtn = page.locator('.profile-bubble-card', { hasText: 'Mia' });
    await miaBtn.click();
    await page.waitForTimeout(600);
    const headerProfileName = await page.textContent('.profile-name');
    console.log('Active profile in header:', headerProfileName);
    if (!headerProfileName || !headerProfileName.includes('Mia')) {
      throw new Error('Profile switch to Mia failed');
    }

    // 3. Test adding a new profile "Noah"
    console.log('Testing adding kid profile "Noah"...');
    await page.click('.add-kid-btn');
    await page.waitForSelector('.avatar-picker-grid');
    await page.fill('input[placeholder="e.g. Emma"]', 'Noah');
    // Pick fox avatar
    await page.click('.avatar-pick-btn:has-text("Felix the Fox")');
    await page.click('button:has-text("Create Profile ✓")');
    await page.waitForTimeout(600);
    const activeNoah = await page.textContent('.profile-name');
    console.log('Active profile after create:', activeNoah);
    if (!activeNoah || !activeNoah.includes('Noah')) {
      throw new Error('New profile Noah was not activated');
    }

    // 4. Test selecting a song and entering Player Stage
    console.log('Selecting song #1 Glocken to enter Player Stage...');
    const firstSongPlayBtn = page.locator('.song-hub-card', { hasText: 'Glocken' });
    await firstSongPlayBtn.click();
    await page.waitForTimeout(1500);

    const songTitleInPlayer = await page.textContent('.player-song-title');
    console.log('Song title in Player stage:', songTitleInPlayer);
    if (!songTitleInPlayer || !songTitleInPlayer.includes('Glocken')) {
      throw new Error('Failed to transition to player stage with Glocken');
    }

    // Capture Player Stage Screenshot
    const playerScreenshotPath = path.join(brainDir, 'screenshot-kids-player.png');
    await page.screenshot({ path: playerScreenshotPath, fullPage: false });
    console.log('Captured:', playerScreenshotPath);

    // 5. Test Bottom Dock: Switch to Studio
    console.log('Tapping Studio on bottom dock...');
    await page.click('.dock-btn:has-text("Studio")');
    await page.waitForTimeout(800);

    const studioHeading = await page.textContent('.studio-card.student-card h3');
    console.log('Studio student card heading:', studioHeading);
    if (!studioHeading || !studioHeading.includes("Noah's Practice Take")) {
      throw new Error("Studio student card heading does not reflect Noah's take");
    }

    // Capture Studio Screenshot
    const studioScreenshotPath = path.join(brainDir, 'screenshot-kids-studio.png');
    await page.screenshot({ path: studioScreenshotPath, fullPage: false });
    console.log('Captured:', studioScreenshotPath);

    // 6. Test Bottom Dock: Switch to Goals
    console.log('Tapping Goals on bottom dock...');
    await page.click('.dock-btn:has-text("Goals")');
    await page.waitForTimeout(800);

    const goalsHeroTag = await page.textContent('.hero-tag');
    console.log('Goals hero tag:', goalsHeroTag);
    if (!goalsHeroTag || !goalsHeroTag.includes('LEARNING GOALS FOR')) {
      throw new Error('Goals screen hero tag not found');
    }

    // Check off the first goal to earn a star!
    console.log('Tapping first practice goal...');
    const firstGoalCard = page.locator('.goal-card').first();
    await firstGoalCard.click();
    await page.waitForTimeout(500);

    const starsBadge = await page.textContent('.stars-badge');
    console.log('Stars badge readout:', starsBadge);
    if (!starsBadge || !starsBadge.includes('1 of') || !starsBadge.includes('Earned')) {
      throw new Error('Goal completion did not increment star count: ' + starsBadge);
    }

    // Verify dock badge displays star
    const dockStarBadge = await page.textContent('.dock-badge-stars');
    console.log('Dock star badge readout:', dockStarBadge);
    if (!dockStarBadge || !dockStarBadge.includes('1⭐')) {
      throw new Error('Dock stars badge not visible with 1⭐');
    }

    // Capture Goals Screenshot
    const goalsScreenshotPath = path.join(brainDir, 'screenshot-kids-goals.png');
    await page.screenshot({ path: goalsScreenshotPath, fullPage: false });
    console.log('Captured:', goalsScreenshotPath);

    // 7. Test returning to Hub via bottom dock
    console.log('Tapping Library on bottom dock to return to Hub...');
    await page.click('.dock-btn:has-text("Library")');
    await page.waitForTimeout(500);
    const hubHeading = await page.textContent('.hub-card-section h2');
    console.log('Hub section heading after return:', hubHeading);
    if (!hubHeading || !hubHeading.includes("Who's Practicing")) {
      throw new Error('Failed to return to Hub via bottom dock');
    }

    console.log('\n=============================================');
    console.log('🎉 ALL YOUTUBE KIDS MULTI-SCREEN TESTS PASSED!');
    console.log('=============================================\n');
  } finally {
    await browser.close();
  }
}

runTest().catch((e) => {
  console.error('Test failed with error:', e);
  process.exit(1);
});
