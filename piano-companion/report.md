Implemented the engineered scope for this issue.

**Commit:** `26c62dcc16b157e80a7023c831f58c4208e8b3aa`

**Files touched:**
- `piano-companion/src/lib/actions/longpress.ts`
- `piano-companion/src/routes/+page.svelte`

**Behavior verified:**
- **Touchscreen & Kid Ergonomics**: Upgraded all primary transport buttons to chunky 48px+ touch targets with tactile neo-brutalist styling, high-contrast borders, and touch suppression on long-press.
- **3-Second Pre-Roll Count-in**: Introduced visual count-in modal with 3-2-1 countdown for both practice playback (`⏳ 3s Play`) and take recording (`⏳ 3s Pre-Roll`), giving young students calm transition time to position their hands on the piano keys.
- **Practice Lab Pop-Up Modal**: Moved advanced teacher/parent tools (fine-grained tempo chips 0.5x–1.25x, frame-by-frame 1s/5s seeking, precision A/B micro-looping nudges with ±0.1s/0.5s steppers, theater/fullscreen/mute controls) into a dedicated pop-up modal launched via `🎛️ Practice Lab`.
- **Collapsible Cockpit Sections**: Built high-contrast accordion headers for Timeline, Audio Recording Studio, Interactive Metronome, and Practice Checkpoints with live status badges (`✅ Take Recorded`, `0/4 Done`) and `localStorage` state persistence.
- **Long-Press Gestures Engine**: Implemented `longpress` action enabling 500ms hold on Play (to start 3s count-in) and Restart (for Deep Reset with Pip cheering).

**Verification passed:**
- `npm run check` — 0 errors, 0 warnings.
- `npm run build` — Clean production build.
- Playwright E2E verification (`test-touch-kid-ux.js`) — Emulated touch device (iPad 1024x768), tested section collapse/expand, count-in pre-roll, Practice Lab speed adjustment to 0.7x, and long-press Deep Reset.
- Cloudflare Pages live deployment — Successfully deployed to production endpoint `https://11b3e7f9.piano-practice-companion.pages.dev` and verified with HTTP 200.

**Docs updated:**
- `README.md` — reviewed, no change needed.
- `piano-companion/report.md` — updated with completion record.

**Deferred:** None
