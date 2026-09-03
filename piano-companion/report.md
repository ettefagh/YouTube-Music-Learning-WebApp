Implemented the engineered scope for this issue.

**Commit:** `8b2407a0c87bb7d26b8da106de9cc4c59440fa98`

**Files touched:**
- `piano-companion/src/lib/actions/youtubePlayer.svelte.ts`

**Behavior verified:**
- **Autoplay Eliminated on App Open & Provider Changes**: Replaced aggressive video auto-loading (`loadVideoById`) with non-playing video preparation (`cueVideoById`) during lesson selection and curriculum provider switches. Videos only begin playing when the user explicitly clicks `▶ Play`.
- **Initialization Lifecycle Protection**: Removed premature `startLoopWatcher()` execution from `onReady`, ensuring loop boundary monitors only run while `controller.isPlaying()` is true.
- **Initial Chapter Cues**: Configured `onReady` to cue start seconds (`cueVideoById`) or ensure `player.pauseVideo()` is called after setting the playback rate.
- **Paused Chapter Jump Safety**: Ensured chapter jumps within the same video ID maintain paused state if the user was paused prior to selecting a chapter.

**Verification passed:**
- `npm run check` — 0 errors, 0 warnings.
- `npm run build` — Clean production build.
- Playwright E2E verification (`test-no-autoplay.js`) — Validated that video remains in paused state (`▶ Play`) upon initial app open, upon switching to singles provider (`Anikó Drabon`), upon switching to playlist provider (`VikaPiano`), and upon selecting next lesson.
- Cloudflare Pages live deployment — Deployed to production endpoint `https://5e1a9855.piano-practice-companion.pages.dev` and verified.

**Docs updated:**
- `README.md` — reviewed, no change needed.
- `piano-companion/report.md` — updated with completion record.

**Deferred:** None
