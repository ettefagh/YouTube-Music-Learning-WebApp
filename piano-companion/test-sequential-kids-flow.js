import { chromium } from 'playwright';
import path from 'path';

async function runSequentialKidsFlowTest() {
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

  // Mark onboarding complete to avoid onboarding modal popup
  await page.addInitScript(() => {
    localStorage.setItem('onboardingComplete', 'true');
    localStorage.removeItem('activeScreen'); // start on splash
  });

  const brainDir = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\d366347d-0184-4c6c-ab32-02bbc3a951fe';
  const targetUrl = 'https://ddfcdf22.piano-practice-companion.pages.dev/';

  try {
    console.log(`Navigating to ${targetUrl} ...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // ==========================================
    // 1. VERIFY SCREEN 0: SPLASH SCREEN (INITIATE STATE)
    // ==========================================
    console.log('Verifying Splash screen...');
    const splashTitle = await page.textContent('.splash-title');
    console.log('Splash Title:', splashTitle);
    if (!splashTitle || !splashTitle.includes('Piano Companion')) {
      throw new Error('Splash title not found');
    }

    const splashScreenshot = path.join(brainDir, 'screenshot-step0-splash.png');
    await page.screenshot({ path: splashScreenshot });
    console.log('Captured:', splashScreenshot);

    // ==========================================
    // 2. ADVANCE TO STEP 1: WHO'S PRACTICING? (PROFILE PICKER)
    // ==========================================
    console.log('Tapping start on Splash to advance to Step 1 (Profiles)...');
    await page.click('.start-funnel-btn');
    await page.waitForTimeout(800);

    const step1Title = await page.textContent('.step-main-title');
    console.log('Step 1 Title:', step1Title);
    if (!step1Title || !step1Title.includes("Who's Practicing Today")) {
      throw new Error('Failed to advance to Step 1 Profile Selector');
    }

    const profileScreenshot = path.join(brainDir, 'screenshot-step1-profile.png');
    await page.screenshot({ path: profileScreenshot });
    console.log('Captured:', profileScreenshot);

    // ==========================================
    // 3. SELECT MIA AND ADVANCE TO STEP 2: BOOK SELECTOR
    // ==========================================
    console.log('Selecting Mia 🐰 to advance to Step 2 (Books)...');
    const miaCard = page.locator('.profile-jumbo-card', { hasText: 'Mia' });
    await miaCard.click();
    await page.waitForTimeout(1000);

    const step2Title = await page.textContent('.step-main-title');
    console.log('Step 2 Title:', step2Title);
    if (!step2Title || !step2Title.includes('Choose Your Piano Book')) {
      throw new Error('Failed to advance to Step 2 Book Selector');
    }

    const bookScreenshot = path.join(brainDir, 'screenshot-step2-book.png');
    await page.screenshot({ path: bookScreenshot });
    console.log('Captured:', bookScreenshot);

    // ==========================================
    // 4. SELECT BOOK 1 AND ADVANCE TO STEP 3: TEACHER SELECTOR
    // ==========================================
    console.log('Selecting Tastenzauberei Band 1 to advance to Step 3 (Teachers)...');
    const book1Card = page.locator('.book-jumbo-card', { hasText: 'Tastenzauberei Band 1' });
    await book1Card.click();
    await page.waitForTimeout(1000);

    const step3Title = await page.textContent('.step-main-title');
    console.log('Step 3 Title:', step3Title);
    if (!step3Title || !step3Title.includes('Pick Your YouTube Teacher')) {
      throw new Error('Failed to advance to Step 3 Teacher Selector');
    }

    const teacherScreenshot = path.join(brainDir, 'screenshot-step3-teacher.png');
    await page.screenshot({ path: teacherScreenshot });
    console.log('Captured:', teacherScreenshot);

    // ==========================================
    // 5. SELECT TEACHER AND ADVANCE TO STEP 4: LESSON SELECTOR
    // ==========================================
    console.log('Selecting Aniko Drabon to advance to Step 4 (Lessons)...');
    const teacherCard = page.locator('.teacher-jumbo-card', { hasText: 'Anikó Drabon' }).first();
    await teacherCard.click();
    await page.waitForTimeout(1000);

    const step4Title = await page.textContent('.step-main-title');
    console.log('Step 4 Title:', step4Title);
    if (!step4Title || !step4Title.includes('Pick a Piece to Practice')) {
      throw new Error('Failed to advance to Step 4 Lesson Selector');
    }

    const lessonScreenshot = path.join(brainDir, 'screenshot-step4-lesson.png');
    await page.screenshot({ path: lessonScreenshot });
    console.log('Captured:', lessonScreenshot);

    // ==========================================
    // 6. SELECT A PIECE AND ENTER PLAYER STAGE
    // ==========================================
    console.log('Selecting first piece to launch dedicated Player Stage...');
    const firstSong = page.locator('.song-step-card').first();
    const songTitle = await firstSong.locator('.song-step-title').textContent();
    console.log('Tapping song:', songTitle);
    await firstSong.click();
    await page.waitForTimeout(1500);

    const playerSongTitle = await page.textContent('.player-song-title');
    console.log('Song title in Player Stage:', playerSongTitle);
    const cleanTitle = (songTitle || '').trim();
    if (!playerSongTitle || !playerSongTitle.includes(cleanTitle)) {
      throw new Error(`Player stage song title mismatch: ${playerSongTitle} vs ${cleanTitle}`);
    }

    // Verify top breadcrumbs
    const breadcrumbText = await page.textContent('.kids-breadcrumbs-bar');
    console.log('Top breadcrumb bar readout:', breadcrumbText);
    if (!breadcrumbText || !breadcrumbText.includes('Mia') || !breadcrumbText.includes('Tastenzauberei')) {
      throw new Error('Breadcrumb bar missing Mia or Book information: ' + breadcrumbText);
    }

    const playerScreenshot = path.join(brainDir, 'screenshot-step5-player.png');
    await page.screenshot({ path: playerScreenshot });
    console.log('Captured:', playerScreenshot);

    // ==========================================
    // 7. TEST STATE RECALL: RELOAD TO SPLASH AND 1-TAP RESUME
    // ==========================================
    console.log('Testing State Recall: navigating to Splash screen...');
    await page.click('.kids-brand-btn');
    await page.waitForTimeout(1000);

    const resumeEyebrow = await page.textContent('.resume-eyebrow');
    console.log('Resume Eyebrow text:', resumeEyebrow);
    if (!resumeEyebrow || !resumeEyebrow.includes('CONTINUE WHERE YOU LEFT OFF')) {
      throw new Error('Smart 1-Tap Resume Card did not appear on Splash screen');
    }

    const resumeSong = await page.textContent('.resume-song-title');
    console.log('Resume Song Title on Splash:', resumeSong);
    if (!resumeSong || !resumeSong.includes(cleanTitle)) {
      throw new Error(`Resume card did not recall last practiced piece: ${resumeSong}`);
    }

    const splashResumeScreenshot = path.join(brainDir, 'screenshot-step0-splash-resume.png');
    await page.screenshot({ path: splashResumeScreenshot });
    console.log('Captured:', splashResumeScreenshot);

    console.log('Tapping 1-Tap Resume Button...');
    await page.click('.resume-action-btn');
    await page.waitForTimeout(1500);

    const resumedTitle = await page.textContent('.player-song-title');
    console.log('Resumed Song Title in Player Stage:', resumedTitle);
    if (!resumedTitle || !resumedTitle.includes(cleanTitle)) {
      throw new Error('1-Tap Resume failed to open player stage with last piece');
    }

    // ==========================================
    // 8. TEST INTERACTIVE BREADCRUMB JUMP
    // ==========================================
    console.log('Testing interactive breadcrumb jump: tapping Book crumb...');
    await page.click('.crumb-chip:has-text("Tastenzauberei")');
    await page.waitForTimeout(800);

    const jumpedStepTitle = await page.textContent('.step-main-title');
    console.log('Step title after breadcrumb jump:', jumpedStepTitle);
    if (!jumpedStepTitle || !jumpedStepTitle.includes('Choose Your Piano Book')) {
      throw new Error('Breadcrumb jump to Book Selector failed');
    }

    console.log('\n=========================================================');
    console.log('🎉 ALL SEQUENTIAL YOUTUBE KIDS FLOW & STATE RECALL TESTS PASSED!');
    console.log('=========================================================\n');
  } finally {
    await browser.close();
  }
}

runSequentialKidsFlowTest().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
