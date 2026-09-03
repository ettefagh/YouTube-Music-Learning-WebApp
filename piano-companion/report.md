Implemented the engineered scope for this issue.

**Commit:** `02bda5624853348f7298e80194398fb2ae39310b`

**Files touched:**
- `piano-companion/src/lib/actions/youtubePlayer.svelte.ts`
- `piano-companion/src/routes/+page.svelte`

**Behavior verified:**
- **Fullscreen Mode (`⛶ Fullscreen` / `🗗 Exit`)**: Integrated HTML5 Fullscreen API with webkit fallback and `fullscreenchange` event synchronization (esc key support). Maximizes the player card to full viewport while maintaining transport bar accessibility.
- **Theater Mode (`🔲 Theater` / `🔳 Standard`)**: Adds expanded wide-stage view expanding player width smoothly to `1100px` without taking over the full operating system display.
- **Mute / Audio Toggle (`🔊 Mute` / `🔇 Unmute`)**: Added controller methods `mute()`, `unMute()`, and `isMuted()` to `YouTubePlayerController` in `youtubePlayer.svelte.ts`. Students can mute YouTube audio to practice visually against the teacher's hand positions without sound collision.
- **Restart Piece (`⏮ Restart`)**: Instantly resets playback position to the start time of the active lesson or chapter (`startTime ?? 0`).
- **Precision 1s Fine Step (`◀ 1s` / `1s ▶`)**: Added 1-second backward and forward buttons alongside the 5-second skips for precise frame-by-frame analysis of complex piano chords and fingerings.

**Verification passed:**
- `npm run check` — 0 errors, 0 warnings.
- `npm run build` — Clean production build compiled with Cloudflare Pages adapter in 1.4s.
- Playwright E2E verification (`test-player-buttons.js`) — Successfully tested Restart, 1s steps, Mute/Unmute state toggling, Theater mode class expansion, and Fullscreen toggle.
- Cloudflare Pages live deployment — Deployed to production endpoint `https://30be854b.piano-practice-companion.pages.dev` and verified via curl and browser.

**Docs updated:**
- `README.md` — reviewed, no change needed.
- `piano-companion/report.md` — updated with completion record.

**Deferred:** None
