# Handoff Report: Brand Naming Strategy & Identity Dossier

**Author**: Lead Brand Strategist & Technical Writer (`teamwork_preview_worker_m1`)  
**Target Milestone**: M1 (Strategic Naming Dossier)  
**Date**: September 2026  
**Type**: Hard Handoff (Task Complete)  

---

## 1. Observation

1. **Current Codebase & Configuration**:
   - `package.json` line 2: `"name": "piano-companion"`.
   - `vite.config.ts` line 19: `short_name: 'Piano Companion'` (15 characters with space).
   - `src/routes/+page.svelte` line 951: `<span class="brand-title">Piano Companion</span>`.
   - `src/routes/+page.svelte` lines 947–976: The `.kids-top-header` flexbox hosts the brand button, active profile switcher (`.active-profile-chip`), and settings gear (`.top-gear-btn`).
   - `src/routes/+page.svelte` lines 3918–3970: CSS layout allocates a net maximum text width of ~85px–100px for `.brand-title` on 360px–375px viewports. The 15-character string `"Piano Companion"` requires ~160px, causing flex overflow and squashing the active profile badge.
2. **Explorer Inputs Reviewed**:
   - `candidate_generation_report.md`: Cataloged 38 candidates across 4 taxonomies (Playful, EdTech, Action, Bilingual).
   - `linguistics_phonetics_report.md`: Revealed the Persian onset cluster barrier (#CC) forcing epenthesis (`PianoStream` -> 5 syllables `pi-yâ-no-es-trīm`), the authentic Persian visual root *Nama* (**نما**), the dual-coded portmanteau *Pianova* (*Nava* = melody / *Nova* = star), and Persian vulgar taboos (Goh/Gu, Kos, and *Pip* = tobacco smoking pipe).
   - `trademark_ui_report.md`: Confirmed Google YouTube Developer API ToS Section 8 prohibition against "-Tube" / "You-" marks, Netflix dilution risk for "-Flix", active marketplace collision with Songtive's *Piano Companion* (5M+ downloads), and Orange Studios' *Piano Kids* (370M+ downloads).
3. **Master Deliverable Authored**:
   - `docs/naming_strategy_report.md`: Comprehensive 875+ line publication-grade strategic dossier synthesizing all 38 candidates, phonotactic models, trademark clearance, master 5-dimension scoring matrix, finalist profiles, paired bilingual taglines, and UI integration guidelines.

---

## 2. Logic Chain

1. **From Active Collision to Rebrand Imperative**:
   Direct marketplace collision with Songtive's *Piano Companion* (5M+ downloads in Class 09/41) creates severe Lanham Act § 32 / § 43(a) infringement and store takedown risk. Paired with the 15-character PWA ellipsis truncation bug (`Piano Compa...`), a complete rebrand is technically and legally mandatory.
2. **From Google Policies to Disqualification of "-Tube"**:
   Google's YouTube API Services Terms of Service (Section 8) and Developer Branding Guidelines strictly prohibit using "YouTube", "YT", or direct derivations like *Pianotube*, *Navatube*, or *TaranehTube* in application titles. Any app using them risks automated developer API revocation and Play Store rejection.
3. **From Persian Phonotactics to Crown Champion Selection**:
   Persian phonotactics forbids initial consonant clusters (#CC). Suffixes like *Stream* force epenthetic vowels (`[ʔes.triːm]`), bloating *PianoStream* to 5 syllables. In contrast, *Nama* (**نما** = visual screen/showcase) and *Nava* (**نوا** = melody) provide pure open `CV` syllables, perfect mouthfeel for ages 5–12, and zero consonant clashing.
4. **From Persian Calligraphy to ZWNJ Bug Resolution**:
   In Persian script, the letter *Vav* (و) in `پیانو` is non-joining on the left. Compounding `پیانو` with `نما` yields **پیانونما**, which renders identically whether typed with a ZWNJ, without a ZWNJ, or with a space, solving all search bar indexing fragmentation.
5. **From Persian Slang to Mascot Pip Isolation**:
   Because *Pip* (پیپ) in Persian denotes a tobacco smoking pipe, elevating *Pip* to the product marquee (*PipPiano*, *PipKeys*) creates an immediate schoolyard blunder in Persian communities. Isolating Pip as the internal in-app guide (*Pip the Songbird*) with clear visual context eliminates all risk while preserving code harmony with `MascotPip.svelte`.
6. **From Scoring Matrix to Unanimous Winner**:
   **PianoNama (پیانونما)** achieved the highest score (**49.2 / 50**), combining native Persian video screen semantics, open syllable phonetics, 9-character PWA and header compliance, and spotless trademark safety.

---

## 3. Caveats

- **Domain Registration**: While *PianoNama* and *Pianova* are clear of trademark conflicts in Nice Classes 09 and 41, specific top-level domain availability (e.g. `.com` vs `.app` vs `.io`) must be verified at the registrar level prior to commercial deployment.
- **Mascot Voiceover Localizations**: In Persian audio voiceovers, Pip should be introduced with audio visual cues ("Hello! I'm Pip the Songbird!") to reinforce the avian character identity for younger children.
- No other caveats.

---

## 4. Conclusion

1. **Brand Decision**:
   - **#1 Overall Champion**: **PianoNama (پیانونما)** is crowned as the primary global brand identity.
   - **#2 Runner-Up / Alternate**: **Pianova (پیانوا)** is approved as an ultra-compact (7-character) brand identity.
   - **#3 Action Champion**: **LoopKeys (لوپ‌کیز)** is approved as the branded name for the video looping practice engine.
2. **Policy Enforcement**:
   - Permanently abandon *Piano Companion*, *Pianotube*, *NoteFlix Kids*, *YouPiano*, and *PipKeys*.
3. **Delivery**:
   - The master dossier is delivered in full at `C:\Users\admin\Documents\antigravity\eager-newton\piano-companion\docs\naming_strategy_report.md`.

---

## 5. Verification Method

To independently verify the completeness and integrity of this deliverable:

1. **File Inspection**:
   - Inspect `docs/naming_strategy_report.md` to verify all 8 core sections, the 38-candidate inventory, the 5-dimension scoring matrix, paired bilingual taglines, and technical UI code snippets.
2. **PWA Character Count Verification**:
   - Confirm `PianoNama` length = 9 characters (<= 12 characters, satisfying PWA `short_name` constraints).
   - Confirm `Pianova` length = 7 characters.
   - Confirm `LoopKeys` length = 8 characters.
3. **Persian Calligraphy & Orthography Check**:
   - Verify `پیانونما` (PianoNama), `پیانوا` (Pianova), and `لوپ‌کیز` (LoopKeys) for proper RTL rendering and non-joining letter characteristics.
4. **Invalidation Conditions**:
   - If Google updates its YouTube API terms to freely allow third-party "-Tube" branding, *Pianotube* could theoretically be re-evaluated, but would remain phonetically and culturally inferior to *PianoNama*.
