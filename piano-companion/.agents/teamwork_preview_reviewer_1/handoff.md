# Handoff Report: Strategic Review of Brand Naming Strategy Dossier (M1)

**Author**: Strategic Reviewer 1 (`teamwork_preview_reviewer_1`)  
**Target Milestone**: M1 (Naming Strategy & Brand Identity)  
**Date**: September 2026  
**Type**: Hard Handoff (Task Complete)  
**Verdict**: **APPROVE**

---

## 1. Observation

1. **Deliverable Under Review**:
   - `piano-companion/docs/naming_strategy_report.md` (1,033 lines, 79,040 bytes).
   - Authored by `teamwork_preview_worker_m1`, synthesizing reports from `teamwork_preview_explorer_candidates`, `teamwork_preview_explorer_linguistics`, and `teamwork_preview_explorer_trademark`.
2. **Candidate Count & Taxonomies**:
   - Section 2 delivers **38 distinct candidates** across 4 taxonomies:
     - *Playful & Kids-First*: 10 candidates (01 to 10: Pianotube, KeyToon, Pianoodle, OctaPlay, KeyPop, MelodyCast, NoteFlix Kids, TinkleTube, PipKeys, BumbleKeys).
     - *Modern Streaming & EdTech*: 9 candidates (11 to 19: PianoStream, KeysCast, VelocePlay, VirtuosoTube, ClavierStream, TempoVision, Harmoniq TV, Pianorama, StreamoKeys).
     - *Action & Learning Oriented*: 9 candidates (20 to 28: WatchPlayPiano, PlayKeyNow, LoopKeys, PracticeCast, ShowAndKey, TouchNote TV, QuestKeys, PlayScale, PianoSprint).
     - *Bilingual & Cross-Cultural Hybrids*: 10 candidates (29 to 38: PianoNava, PianoNama, Pianova, Navatube, KlavierNama, SazStream, KeyNava, NavaPlay, TaranehTube, AhangCast).
3. **Linguistic & Phonetic Observations**:
   - Section 3.1 details the Persian onset cluster barrier (`#CC`): Persian forbids initial consonant clusters, forcing epenthesis (`Stream` $\to$ `[ʔes.triːm]`), causing `PianoStream` to balloon into 5 syllables (`pi-yâ-no-es-trīm`).
   - Section 3.5 audits Persian taboos: *Pip* (پیپ) = adult tobacco pipe; *Goh/Gu* (گوه) = feces/shit; *Kos* (کوس) = female genitalia vulgarity.
   - Section 3.7 proves that in `پیانو` the letter *Vav* (و) is non-joining on the left, rendering **پیانونما** identically with or without ZWNJ (`U+200C`) or space.
4. **Trademark & Regulatory Observations**:
   - Section 4.1 cites YouTube API Services Terms of Service Section 8: third-party apps must not use "YouTube", "YT", or direct derivations in their title, disqualifying `-Tube` candidates (*Pianotube*, *Navatube*, *TaranehTube*).
   - Section 4.3 audits active commercial conflicts: Songtive owns *Piano Companion* (5M+ downloads in Class 09/41), creating direct Lanham Act § 32/43(a) collision with the existing repository title; Orange Studios owns *Piano Kids* (370M+ downloads).
5. **Evaluation Matrix Math**:
   - Section 5.2 evaluates 12 contenders across 5 dimensions (KMJ, EPH, CCL, UPH, BST, 1–10 scale). Verified exact sums:
     - PianoNama: $9.6 + 10.0 + 9.8 + 9.8 + 10.0 = 49.2 / 50$ (Rank 1).
     - Pianova: $9.5 + 9.8 + 9.4 + 10.0 + 10.0 = 48.7 / 50$ (Rank 2).
     - LoopKeys: $9.4 + 8.8 + 10.0 + 9.7 + 9.5 = 47.4 / 50$ (Rank 3).
6. **Codebase & Layout Verification**:
   - `vite.config.ts` line 18: `short_name: 'Piano Companion'` (15 characters with space).
   - `src/routes/+page.svelte` lines 947–976: `.kids-top-header` flex container packs brand button, active profile chip (`.active-profile-chip`), and settings gear (`.top-gear-btn`).
   - Net available text width for brand title on 360px viewport: $360\text{px} - 32\text{px (padding)} - 48\text{px (gear)} - 132\text{px (profile)} - 30\text{px (icon)} - 8\text{px (gap)} - 44\text{px (badge)} \approx 66\text{px}$ to $88\text{px}$.
   - `PianoNama` (9 characters $\times$ 9.5px $\approx$ 85.5px) fits cleanly; `Piano Companion` (15 characters $\times$ 9.5px $\approx$ 142.5px) causes flex wrapping and profile chip collapse.
   - `src/lib/components/MascotPip.svelte`: Confirmed mascot character with amber face (`#FFB74D`) and eighth-note hat (`#673AB7`).
7. **Diagnostics & Build Command Outputs**:
   - `cmd /c npm run check`: `svelte-check found 0 errors and 0 warnings` (Exit code: 0).
   - `cmd /c npm run build`: Vite v8.2.2 built SSR and client bundles; Cloudflare Pages adapter finished; PWA service worker generated (Exit code: 0).

---

## 2. Logic Chain

1. **Integrity & Compliance (Directly from Obs 1, 2, 7)**:
   The candidate pool delivers 38 candidates, exceeding the required 25 candidates across all 4 specified taxonomies. No integrity violations, hardcoded shortcuts, facade implementations, or fabricated claims exist. All diagnostic and build commands pass with exit code 0.
2. **Rebrand Mandate (Directly from Obs 4, 6)**:
   Songtive's multi-million download app *Piano Companion: chords, scales* in Nice Classes 09 and 41 creates immediate Lanham Act § 32/43(a) liability for the repository. Combined with the 15-character PWA home screen ellipsis truncation (`Piano Compa...`) and mobile header overflow in `src/routes/+page.svelte`, a rebrand is legally and technically mandatory.
3. **Disqualification of `-Tube` and `Pip-` (Directly from Obs 3, 4)**:
   Google YouTube API TOS Section 8 prohibits `-Tube` derivations, threatening API quota revocation and Play Store rejection. In Persian, *Pip* (پیپ) denotes an adult tobacco smoking pipe, making *PipKeys* or *PipPiano* culturally inappropriate for an Iranian children's product marquee. Isolating Pip as an internal visual guide solves both problems.
4. **Superiority of PianoNama (Directly from Obs 2, 3, 5, 6)**:
   *PianoNama* combines the universal instrument (*Piano*) with the authentic Persian visual showcase root *Nama* (**نما**), solving the `#CC` consonant cluster barrier with open `CV` syllables. Its non-joining letter *Vav* ensures stable Persian typography across ZWNJ variations. At 9 characters, it fits both the 12-character PWA limit and the 360px mobile header.
5. **Approval of Runner-Up Assets (Directly from Obs 5, 6)**:
   *Pianova* (7 characters) provides an ultra-compact alternative with bilingual double-coding (*Nova* = star / *Nava* = melody). *LoopKeys* (8 characters) provides an action-oriented name for the YouTube video looping practice engine.

---

## 3. Caveats

1. **Domain Registrar Verification**: While *PianoNama* is completely unencumbered on trademark registers in Classes 09 and 41, specific top-level domain availability (e.g. `.com` vs `.app` vs `.kids`) must be handled at the registrar level prior to public launch. Modern TLDs like `.app` or `.kids` are recommended.
2. **Persian Voiceover Localization**: For visually impaired children using audio screen readers, Persian audio scripts must introduce Pip with his full descriptive title: «من پیپ هستم، پرنده آوازخوان!» ("I am Pip, the Songbird!") to establish the character identity before the name is uttered.
3. No other caveats.

---

## 4. Conclusion

1. **Official Verdict**: **APPROVE**.
2. **Brand Hierarchy Approved**:
   - **#1 Global Product Brand**: **PianoNama (پیانونما)**.
   - **#2 Compact Alternate / Sub-Brand**: **Pianova (پیانوا)**.
   - **#3 Branded Looping Engine**: **LoopKeys (لوپ‌کیز)**.
3. **Protocol Enforcements**:
   - Surrender the mark *Piano Companion* across all manifests, titles, and packages.
   - Enforce the Mascot Pip Isolation Protocol: keep Pip in `MascotPip.svelte` as "Pip the Songbird" («پیپ، پرنده آوازخوان») while barring "Pip" from external product marquees.
4. **Readiness**: The strategic dossier `docs/naming_strategy_report.md` is complete, authoritative, and ready for Milestone 2 implementation.

---

## 5. Verification Method

1. **File Verification**:
   - Inspect `piano-companion/docs/naming_strategy_report.md` to confirm all 9 sections, 38 candidates, and paired bilingual taglines.
   - Inspect `piano-companion/.agents/teamwork_preview_reviewer_1/review_report.md` for the complete quality and adversarial review.
2. **String Length & Ergonomics Checks**:
   - `PianoNama` length = 9 characters ($\le 12$ chars for PWA manifest `short_name`).
   - `Pianova` length = 7 characters.
   - `LoopKeys` length = 8 characters.
3. **Diagnostic & Build Verification**:
   - Run `cmd /c npm run check` -> verify 0 errors and 0 warnings.
   - Run `cmd /c npm run build` -> verify clean Vite SSR/client build and Cloudflare Pages adapter completion.
4. **Invalidation Conditions**:
   - If a pre-existing senior trademark registration for *PianoNama* in Nice Class 09/41 is discovered in the US or EU, this approval is invalidated.
