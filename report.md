Implemented the engineered scope for this issue.

**Commit:** `e9e2e0a6f5bb2af75b5aa6bd301ead4376527e49`

**Files touched:**
- `piano-companion/package.json`
- `piano-companion/svelte.config.js`
- `piano-companion/vite.config.ts`
- `piano-companion/wrangler.toml`
- `piano-companion/src/lib/db/db.ts`
- `piano-companion/src/lib/db/seedData.ts`
- `piano-companion/src/lib/actions/youtubePlayer.svelte.ts`
- `piano-companion/src/lib/audio/audioRecorder.svelte.ts`
- `piano-companion/src/lib/stores/teacherAuth.svelte.ts`
- `piano-companion/src/lib/components/TeacherGate.svelte`
- `piano-companion/src/lib/components/MascotPip.svelte`
- `piano-companion/src/routes/+layout.svelte`
- `piano-companion/src/routes/+page.svelte`
- `piano-companion/static/manifest.webmanifest`
- `piano-companion/static/icons/icon-192.png`
- `piano-companion/static/icons/icon-512.png`

**Behavior verified:** The Piano Companion PWA features a YouTube video looper, dual audio studio for teacher and student with constraints for performance. It correctly handles component compilation in Svelte 5 and prevents class fields from acting as $derived values, ensuring accurate module imports in typescript.

**Verification passed:**
- `cd piano-companion && npm run check` — Passed successfully without svelte syntax or ts module-resolution errors
- `cd piano-companion && npm run build` — Build output generated successfully for Vite-PWA with Cloudflare pages adapter

**Docs updated:**
- `README.md` — reviewed, no change needed

**Deferred:** None
