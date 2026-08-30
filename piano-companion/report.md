Implemented the engineered scope for this issue.

**Commit:** `9ae38c929f9514be9869049183537e0957dca7d3`

**Files touched:**
- `src/routes/+page.svelte`
- `src/lib/components/TeacherGate.svelte`
- `src/lib/components/MascotPip.svelte`
- `src/app.html`

**Behavior verified:**
- Added neo-brutalism design with thick borders and solid shadow styling (`box-shadow: 4px 4px 0 #000`) for the player frame, recording studio modules, setting panels, and `TeacherGate.svelte` modal, aligning with the visual design screenshots provided.
- Adapted kid-friendly color palettes (`#FFB300`, `#90A4AE`, `#A5D6A7`, `#FF5252`, `#E1BEE7`, `#FFF9C4`) directly mapped to visual elements.
- Implemented Dark Mode (`prefers-color-scheme: dark`) support via inline CSS overrides in `app.html` preserving contrast settings.
- Corrected database indexing bug where repeated records in the same lesson accumulated untracked IDs; now ensures a strictly bound 1:1 local state map, keeping previous records intact (`studentTrack.id`).

**Verification passed:**
- `npm run check` — No typescript/svelte syntax errors.
- `npm run build` — Successful Cloudflare SSG generation for `piano-practice-companion` project.

**Docs updated:**
- `README.md` — reviewed, no change needed.

**Deferred:** None
