# Handoff Report: Linguistic & Phonotactic Remediation Plan

**Target Document**: `docs/naming_strategy_report.md`  
**Working Directory**: `C:\Users\admin\Documents\antigravity\eager-newton\piano-companion\.agents\teamwork_preview_explorer_fix_ling`  
**Reporting Agent**: Linguistic Fix Explorer (`teamwork_preview_explorer_fix_ling`)  
**Parent Agent**: `3366f4ee-495a-41e0-bba3-9c64475f2f1f`  
**Status**: COMPLETE / READY FOR IMPLEMENTATION  
**Primary Deliverable**: `linguistic_remediation_plan.md` (in working directory)  

---

## 1. Observation

Direct empirical observations from `docs/naming_strategy_report.md` and test execution:

1. **Table 2.5 Syllable Counts Under-reporting (Lines 386–425)**:
   - Line 391: Candidate 04 `OctaPlay` lists `Syllables (EN/FA): 3 / 3`.
   - Line 400: Candidate 13 `VelocePlay` lists `Syllables (EN/FA): 4 / 4`.
   - Line 407: Candidate 20 `WatchPlayPiano` lists `Syllables (EN/FA): 4 / 4`.
   - Line 408: Candidate 21 `PlayKeyNow` lists `Syllables (EN/FA): 3 / 3`.
   - Line 414: Candidate 27 `PlayScale` lists `Syllables (EN/FA): 2 / 2`.
   - Line 423: Candidate 36 `NavaPlay` lists `Syllables (EN/FA): 3 / 3`.
   - In contrast, Candidate 11 `PianoStream` (Line 398) lists `Syllables (EN/FA): 3 / 5` with the explicit rationale: *"In Persian, requires initial vowel epenthesis, ballooning into 5 syllables (pi-yâ-no-es-trīm)"* (Line 196).

2. **Test Execution of `python scripts/verify_linguistic_claims.py`**:
   The automated test suite executed with exit code 0 and output:
   ```
   === TEST 2: PERSIAN PHONOTACTICS & CONSONANT CLUSTER EPENTHESIS ===
   Found 6 discrepancies in claimed Persian syllable counts:
     - OctaPlay: Claimed 3 syl, Actual 4 syl (Delta: +1) -> Unaccounted Persian epenthesis on initial cluster (#pl- in Play or #sk- in Scale)
     - VelocePlay: Claimed 4 syl, Actual 5 syl (Delta: +1) -> Unaccounted Persian epenthesis on initial cluster (#pl- in Play or #sk- in Scale)
     - WatchPlayPiano: Claimed 4 syl, Actual 6 syl (Delta: +2) -> Unaccounted Persian epenthesis on initial cluster (#pl- in Play or #sk- in Scale)
     - PlayKeyNow: Claimed 3 syl, Actual 4 syl (Delta: +1) -> Unaccounted Persian epenthesis on initial cluster (#pl- in Play or #sk- in Scale)
     - PlayScale: Claimed 2 syl, Actual 4 syl (Delta: +2) -> Unaccounted Persian epenthesis on initial cluster (#pl- in Play or #sk- in Scale)
     - NavaPlay: Claimed 3 syl, Actual 4 syl (Delta: +1) -> Unaccounted Persian epenthesis on initial cluster (#pl- in Play or #sk- in Scale)
   ```

3. **Phonotactics Section Asymmetry (Lines 435–452)**:
   - Line 436 acknowledges `/pl-/` as an onset cluster: `"Examples: /str-/ (stream), /skr-/ (screen), /pl-/ (play)"`.
   - However, lines 442–447 focus exclusively on sibilant prothesis (`stream` -> `[ʔes.triːm]`, `sprint` -> `[ʔes.pe.rint]`, `scale` -> `[ʔes.keyl]`), omitting the stop-liquid anaptyxis mechanism (`/pl-/` -> `/pe.ley/`).

4. **Mascot Pip Isolation Protocol Omission (Lines 905–928)**:
   - Lines 921–926:
     ```
     |  3. THE VISUAL OVERRIDE PRINCIPLE:
     |     - When children and parents see the charming feathered character wearing
     |       a purple eighth-note hat, the immediate visual context overrides any
     |       tobacco pipe association.
     |     - In Persian UI text, introduce the character with his descriptive title:
     |       «پیپ، پرنده آوازخوان» (Pip, the Songbird).
     ```
   - In Persian, `پیپ` (/piːp/) is an exact phonetic borrowing of French *pipe*, universally denoting a tobacco smoking pipe.
   - Child domestic speech is largely verbal and screenless (e.g. shouting across rooms: *«مامان، من پیپ می‌خوام!»*). Visual cues (the purple hat) are absent during verbal speech.

---

## 2. Logic Chain

1. **Step 1 (Persian Onset Constraint)**: Persian phonological grammar strictly enforces the syllable template `(C)V(C)(C)` (Windfuhr 1979, Samareh 1977, Karimi 1987). Syllable-initial consonant clusters (`#CC-`) are illegal.
2. **Step 2 (Divergent Cluster Repair Typology)**:
   - Sibilant clusters (`#sC-`, `#sCC-`) are repaired via **prothesis** (prefixing `/ʔe-/`).
   - Stop-liquid clusters (`#PL-`, `#KL-`, `#PR-`) CANNOT take prothesis (Persian does not allow `*esplay`). They are repaired via **anaptyxis** (internal vowel insertion: $C_1 C_2 V \to C_1 V_{ep} . C_2 V$).
3. **Step 3 (Morpheme "Play" in Persian)**: Under anaptyxis, English monosyllabic `/pleɪ/` is adapted into Persian as **`پلی` (`/pe.ley/` or `/pe.lej/`)**, which consists of two distinct syllables: `[pe]` (`CV`) + `[ley]` (`CVC`).
4. **Step 4 (Impact on Compounds)**:
   - Compounding any word with `Play` adds **+1 syllable** in Persian:
     - `OctaPlay`: 3 English syllables (`oc-ta-play`) $\to$ **4 Persian syllables** (`[ʔok.tɒː.pe.ley]`).
     - `NavaPlay`: 3 English syllables (`na-va-play`) $\to$ **4 Persian syllables** (`[næ.vɒː.pe.ley]`).
     - `PlayKeyNow`: 3 English syllables (`play-key-now`) $\to$ **4 Persian syllables** (`[pe.ley.kiː.nɒːw]`).
     - `VelocePlay`: 4 English syllables (`ve-lo-ce-play`) $\to$ **5 Persian syllables** (`[ve.lo.tʃe.pe.ley]`).
   - Compounding `Play` with another cluster-bearing word triggers dual repairs (+2 syllables):
     - `PlayScale`: `Play` takes anaptyxis (`/pe.ley/`, 2 syl) + `Scale` takes prothesis (`/ʔes.keyl/`, 2 syl) $\to$ **4 Persian syllables** (`[pe.ley.ʔes.keyl]`, a 100% inflation from 2 to 4).
     - `WatchPlayPiano`: `Watch` (1) + `Play` (2) + `Piano` (3) $\to$ **6 Persian syllables** (`[vɒːtʃ.pe.ley.pi.jɒː.no]`, a delta of +2).
5. **Step 5 (Acoustic Homophony and Domestic Calling)**:
   - English short lax vowel `/ɪ/` in /pɪp/ does not exist in Persian phonology and systematically merges into high tense long vowel `/iː/` (`/piːp/` / `پیپ`), creating a 100% acoustic homophone with tobacco smoking pipe.
   - In home environments, children aged 5–12 frequently communicate verbally without parents viewing the screen (*«مامان پیپ میخوام!»*).
   - In the absence of visual context, the *"Visual Override Principle"* fails completely, triggering immediate parental alarm around tobacco taboo.
6. **Step 6 (Acoustic Localization Resolution)**:
   - Authorizing the localized spoken Persian alias **«جیکو» (Jiko)** (derived from Persian bird-chirp onomatopoeia *Jik-Jik* + affectionate diminutive suffix `-o`) eliminates the homophone while preserving a charming 2-syllable `CV-CV` cadence (`[dʒiː.koʊ]`).
   - Upgrading the isolation protocol to a **4-Tier Architecture** cleanly separates global public branding (Tier 1: PianoNama), English UI/audio (Tier 2: Pip), Persian written UI (Tier 3: جیکو، پرنده آوازخوان), and Persian spoken voiceovers/dialogue (Tier 4: جیکو).

---

## 3. Caveats

- **Adult Fast Speech Reduction**: In rapid informal speech by adult bilinguals in North Tehran, foreign stop-liquid clusters are sometimes partially compressed; however, for children aged 5–12 and standard pedagogical Iranian Persian, anaptyctic `/pe.ley/` is obligatory and natural.
- **Scope Restriction**: This investigation is strictly read-only. No source files or documentation files outside the agent directory were modified. All concrete line edits are staged in `linguistic_remediation_plan.md` for the implementing agent.

---

## 4. Conclusion

The dossier `docs/naming_strategy_report.md` requires systematic linguistic remediation across 18 distinct locations to achieve publication-grade rigor:

1. **Table 2.5 Syllable Counts**: Amend Persian syllable counts for 6 candidates:
   - `OctaPlay`: `3 / 3` $\to$ `3 / 4`
   - `VelocePlay`: `4 / 4` $\to$ `4 / 5`
   - `WatchPlayPiano`: `4 / 4` $\to$ `4 / 6`
   - `PlayKeyNow`: `3 / 3` $\to$ `3 / 4`
   - `PlayScale`: `2 / 2` $\to$ `2 / 4`
   - `NavaPlay`: `3 / 3` $\to$ `3 / 4`
2. **Section 2 Candidate Profiles**: Update metric narratives for Candidates 04, 13, 20, 21, 27, and 36 to document Persian anaptyctic expansion.
3. **Section 3.1 Phonotactics**: Add Subsection 3.1.2 explicitly contrasting stop-liquid anaptyxis (`/pl-/` $\to$ `/pe.ley/`) with sibilant prothesis (`#sC-` $\to$ `/ʔe-/`), complete with a compound expansion matrix.
4. **Section 6.4 OctaPlay Evaluation**: Add Persian 4-syllable cadence note and cross-reference the online casino hazard (`Octoplay`).
5. **Section 8.3 Mascot Isolation Protocol**: Upgrade the ASCII protocol box to the **4-Tier Brand & Acoustic Isolation Protocol**, establishing **«جیکو» (Jiko)** as the spoken Persian localization alias.
6. **Section 8.4 In-App Micro-Copy**: Update Persian welcome banner, chapter looper feedback, and star reward dialogs from `پیپ` to `جیکو`. Add Persian voiceover script guidelines.
7. **Section 3.5 Taboo Screening**: Update Box 1 to document the domestic auditory failure mode and its resolution via «جیکو».

All exact before-and-after text blocks are detailed in `linguistic_remediation_plan.md`.

---

## 5. Verification Method

To verify these findings and test future modifications:

1. **Automated Phonotactic Test**:
   ```powershell
   python scripts/verify_linguistic_claims.py
   ```
   *Expected Output*: Test 2 flags discrepancies on the 6 candidates, matching the remediation plan deltas. Test 4 verifies the acoustic failure mode of `پیپ` and the validity of «جیکو».

2. **Automated Sonority and Profile Test**:
   ```powershell
   python scripts/verify_sonority_and_slang.py
   ```
   *Expected Output*: Demonstrates that `OctaPlay` has `epenthesis_required: True` and Persian syllable shape `CVC-CV-CV-CVC` (4 syllables).

3. **Invalidation Conditions**:
   - The findings are invalidated if standard Persian phonological rules permit `#pl-` onset clusters without vowel insertion in children's speech.
   - The findings are invalidated if `پیپ` does not mean tobacco smoking pipe in Modern Persian dictionaries.
   - The findings are invalidated if home parent-child practice is 100% accompanied by parent visual screen inspection.
