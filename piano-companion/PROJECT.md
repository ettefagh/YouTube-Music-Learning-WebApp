# Project: Kid-Friendly Piano Video Learning Web App - Naming Strategy & Brand Identity

## Architecture & Strategic Framework
- Multi-Agent strategic naming and linguistic evaluation fusing "Piano" with "Video", "YouTube", "Stream", "Cast", "Nama", "Nava".
- Target Demographics: Children aged 5–12, parents, and music educators across English and Persian (Farsi) speaking communities.
- Technical & Design Constraints:
  - Mobile sticky header space constraint (~85px–100px for brand title on 360px–375px viewports; max 11–12 characters).
  - PWA Web App Manifest: `name` vs `short_name` (strict constraint: `short_name` <= 12 characters to prevent home screen ellipsis truncation).
  - Google / YouTube Brand Policy: absolute prohibition on third-party apps using "YouTube", "YT", or direct derivations in app titles or API integrations (YouTube API ToS Section 10.2).
  - Trademark Collision: Disqualification of names colliding with Piano Companion (Songtive), Simply Piano (JoyTunes), Piano Kids (Orange Studios), Yousician, Flowkey, or Netflix.
  - Mascot Pip Isolation Protocol: In Persian, Pip (پیپ) refers to a tobacco smoking pipe. Pip is preserved as the friendly in-app cartoon guide (Pip the Songbird), localized as «جیکو» (Jiko) in Persian domestic audio/UI, and strictly excluded from the global brand name.

## Feature Inventory
| # | Feature / Work Item | Description | Milestone | Source |
|---|---------------------|-------------|-----------|--------|
| 1 | Candidate Pool Generation | 38 candidates across 4 taxonomies (Playful, EdTech, Action, Bilingual) | M1 | Survey Explorer 1 |
| 2 | English & Persian Linguistics & Phonetics | Phonotactics, mouthfeel, 5–12 age suitability, zero-slang safety, ZWNJ/transliteration, stop-liquid anaptyxis | M1 | Survey Explorer 2 & Fix Ling |
| 3 | Trademark & Platform Policy Clearance | YouTube/Google API branding guidelines (10.2), Nice classes, competitor collision check | M1 | Survey Explorer 3 & Fix TM |
| 4 | 5-Dimension Weighted Scoring Matrix | Ranked evaluation of all candidates across 5 criteria (1–10 scale) | M1 | Master synthesis & Fix Matrix |
| 5 | Winning Finalist Dossiers | In-depth profiles for top 5 winners with English & Persian rationale (#1 PianoNama, #2 LoopKeys, #3 KeyToon, #4 OctaPlay, #5 Pianova) | M1 | Master synthesis |
| 6 | Bilingual Taglines & Mascot/UI Micro-Copy | Paired English/Persian taglines, PWA short_name, 4-tier Mascot Pip/Jiko isolation rules | M1 | Master synthesis |
| 7 | Final Dossier Deliverable | Complete report authored to docs/naming_strategy_report.md (1,169 lines) | M1 | Master synthesis & Worker 2 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Master Brand Strategy Dossier | Synthesize matrix, finalists, taglines, micro-copy, and write docs/naming_strategy_report.md | Survey complete | DONE |

## Code & Deliverable Layout
- Deliverable: docs/naming_strategy_report.md
- Working Metadata: .agents/
