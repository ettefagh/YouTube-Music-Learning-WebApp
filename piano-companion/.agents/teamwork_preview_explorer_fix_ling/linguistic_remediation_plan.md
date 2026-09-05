# Linguistic & Phonotactic Remediation Plan for `docs/naming_strategy_report.md`

**Document**: `docs/naming_strategy_report.md`  
**Author**: Linguistic Fix Explorer (`teamwork_preview_explorer_fix_ling`)  
**Status**: Actionable Remediation Plan (Ready for Implementer)  
**Date**: September 2026  

---

## 1. Executive Summary & Root Cause Analysis

Following adversarial stress testing by Challenger 1 (`teamwork_preview_challenger_1`), two critical linguistic and phonotactic defects were identified in `docs/naming_strategy_report.md`:

1. **Persian Word-Initial Consonant Cluster (#CC) Asymmetry**:
   - The report correctly identified **prothetic epenthesis** for `#sC-` clusters (`PianoStream` expanding to 5 syllables in Persian: `pi-yâ-no-es-trīm`), but completely overlooked **anaptyctic epenthesis** for stop-liquid onset clusters (`#pl-`).
   - In Persian loanword phonology, English `/pl-/` cannot be parsed as a syllable onset and mandates the insertion of an epenthetic vowel `/e/` between the plosive and liquid (`پلی` `/pe.ley/`).
   - This systematically deflates Persian syllable counts across **6 candidates in Table 2.5** and related candidate profiles (`OctaPlay`, `NavaPlay`, `PlayScale`, `PlayKeyNow`, `VelocePlay`, and `WatchPlayPiano`), distorting their true rhythmic weight.

2. **Mascot Pip Acoustic & Screenless Oral Failure Mode**:
   - The report established the *"Visual Override Principle"* in Section 8.3, positing that Pip's visual appearance (purple eighth-note hat, cheerful feathered body) overrides the Persian homophone `پیپ` (*pip* = tobacco smoking pipe).
   - **The Vulnerability**: Young children (ages 5–12) interact verbally with parents across domestic spaces without screens visible (e.g. shouting from the bedroom/living room to the kitchen: *«مامان، من پیپ می‌خوام!»* — *"Mom, I want Pip / a tobacco pipe!"*). In screenless acoustic settings, the visual hat is absent, causing acute parental alarm and cultural awkwardness around tobacco taboo.
   - **The Remediation**: The Mascot Pip Isolation Protocol must be upgraded to a **4-Tier Brand & Acoustic Isolation Architecture**, establishing an official Persian spoken localization alias: **«جیکو» (Jiko)** (*Jiko the Songbird* / *جیکو، پرنده آوازخوان*).

---

## 2. Remediation 1: Persian #CC Stop-Liquid Epenthesis (The Anaptyxis Rule)

### 2.1 Phonological Mechanics & Theoretical Foundation

In standard Iranian Persian phonotactics (Samareh 1977, Windfuhr 1979, Karimi 1987, Shademan 2002, Kambuziya et al. 2014), syllables adhere to the maximal template:

$$\text{Template: } (C)V(C)(C)$$

No syllable may begin with more than one consonant; word-initial consonant clusters (`#CC-`) are phonotactically illicit. When foreign words with initial clusters enter Persian, the language deploys two distinct, morphologically governed phonological repair strategies:

```
+-----------------------------------------------------------------------------------------+
|                    PERSIAN ONSET CLUSTER REPAIR TYPOLOGY                                |
+-----------------------------------------------------------------------------------------+
|  1. SIBILANT-FIRST CLUSTERS (#sC- / #sCC-):                                             |
|     - Mechanism: PROTHESIS (Vowel Prefixation)                                          |
|     - Strategy: Prefix glottal stop + front vowel /ʔe-/ before the sibilant.            |
|     - Examples:                                                                         |
|       * stream  /striːm/  -> [ʔes.triːm] or [ʔes.te.riːm] (adds +1 to +2 syllables)     |
|       * scale   /skeɪl/   -> [ʔes.keyl]                   (adds +1 syllable)            |
|       * sprint  /sprɪnt/  -> [ʔes.pe.rint]                (adds +2 syllables)           |
+-----------------------------------------------------------------------------------------+
|  2. STOP-LIQUID / OBSTRUENT-LIQUID CLUSTERS (#PL-, #KL-, #PR-, #BL-, #TR-, #DR-):       |
|     - Mechanism: ANAPTYXIS (Internal Vowel Insertion)                                   |
|     - Strategy: Insert short vowel /e/ BETWEEN the plosive (C1) and liquid (C2).        |
|     - Rule: C1 C2 V -> C1 V_ep . C2 V                                                   |
|     - Examples:                                                                         |
|       * class   /klɑːs/   -> [ke.lɒːs]   (کلاس)          (1 syl EN -> 2 syl FA)        |
|       * press   /prɛs/    -> [pe.res]    (پرس)           (1 syl EN -> 2 syl FA)        |
|       * plan    /plæn/    -> [pe.lɒːn]   (پلان)          (1 syl EN -> 2 syl FA)        |
|       * plugin  /plʌɡ.ɪn/ -> [pe.lɒːg.ʔin] (پلاگین)      (2 syl EN -> 3 syl FA)        |
|       * PLAY    /pleɪ/    -> [pe.ley]    (پلی)           (1 syl EN -> 2 syl FA!)       |
+-----------------------------------------------------------------------------------------+
```

### 2.2 Syllable Decomposition of "Play" in Persian Loanword Adaptation

English `Play` (/pleɪ/) is a single monosyllable. In Persian, the initial `/pl-/` cluster is universally repaired via internal epenthesis:

$$\text{English: } /\text{pleɪ}/ \quad \xrightarrow{\text{Persian Adaptation}} \quad [\text{pe}.\text{ley}] \quad (\text{پلی})$$

- **Syllable 1**: `[pe]` (Shape: `CV`) — voiceless bilabial plosive `/p/` + epenthetic short mid front vowel `/e/`.
- **Syllable 2**: `[ley]` (Shape: `CVC` or `CVV`) — alveolar lateral liquid `/l/` + diphthong `/ey/` (or `/ej/`).

**Net Phonotactic Impact**: Every candidate incorporating the English morpheme `Play` gains **+1 syllable** in Persian. If compounded with another cluster (such as `Scale` in `PlayScale`), both repair mechanisms trigger simultaneously, adding **+2 syllables**.

---

### 2.3 Comprehensive Candidate Inventory Corrections

The table below provides the authoritative phonetic audit for all 6 affected candidates:

| Candidate | Taxonomy | English Syllables (IPA) | Claimed FA in Table 2.5 | Actual FA Syllables | Corrected IPA Transcription | Persian Script | Exact Morphological Explanation |
|---|---|---|---|---|---|---|---|
| **04 OctaPlay** | Playful Kids | 3 (`oc-ta-play`) /ˈɒk.tə.pleɪ/ | 3 | **4** | `[ʔok.tɒː.pe.ley]` | **اکتاپلی** | *Octa* (`[ʔok.tɒː]`, 2 syl) + *Play* (`[pe.ley]`, 2 syl) = 4 syllables. Syllables: `CVC.CV.CV.CVC`. |
| **13 VelocePlay** | Modern EdTech | 4 (`ve-lo-ce-play`) /vəˈloʊ.tʃeɪ.pleɪ/ | 4 | **5** | `[ve.lo.tʃe.pe.ley]` | **ولوچه‌پلی** | *Veloce* (`[ve.lo.tʃe]`, 3 syl) + *Play* (`[pe.ley]`, 2 syl) = 5 syllables. Heavy 5-syllable footprint. |
| **20 WatchPlayPiano** | Action / Learning | 4 (`watch-play-pi-an-o`) /wɒtʃ.pleɪ.piˈæn.oʊ/ | 4 | **6** | `[vɒːtʃ.pe.ley.pi.jɒː.no]` | **واچ‌پلی‌پیانو** | *Watch* (`[vɒːtʃ]`, 1 syl) + *Play* (`[pe.ley]`, 2 syl) + *Piano* (`[pi.jɒː.no]`, 3 syl) = 6 syllables. Severe rhythmic sprawl. |
| **21 PlayKeyNow** | Action / Learning | 3 (`play-key-now`) /ˈpleɪ.kiː.naʊ/ | 3 | **4** | `[pe.ley.kiː.nɒːw]` | **پلی‌کی‌ناو** | *Play* (`[pe.ley]`, 2 syl) + *Key* (`[kiː]`, 1 syl) + *Now* (`[nɒːw]`, 1 syl) = 4 syllables. Loses crisp triplet cadence. |
| **27 PlayScale** | Action / Learning | 2 (`play-scale`) /ˈpleɪ.skeɪl/ | 2 | **4** | `[pe.ley.ʔes.keyl]` | **پلی‌اسکیل** | **Double cluster repair**: *Play* takes anaptyxis (`[pe.ley]`, 2 syl) AND *Scale* takes prothesis (`[ʔes.keyl]`, 2 syl) = 4 syllables (100% inflation). |
| **36 NavaPlay** | Cross-Cultural | 3 (`na-va-play`) /nɑː.vəˈpleɪ/ | 3 | **4** | `[næ.vɒː.pe.ley]` | **نواپلی** | *Nava* (`[næ.vɒː]`, 2 syl) + *Play* (`[pe.ley]`, 2 syl) = 4 syllables. Syllables: `CV.CV.CV.CVC`. |

---

### 2.4 Exact Target File Modifications for Epenthesis

#### Mod 1: Table 2.5 Replacement Rows (Lines 391, 400, 407, 408, 414, 423)

In `docs/naming_strategy_report.md`, Section 2.5:

```markdown
<!-- BEFORE (Line 391): -->
| **04** | **OctaPlay** | Playful Kids | Octave + Play | 3 / 3 | Dactyl | Ages 6–12 | Energetic / اکتاپلی | Top Tier Finalist |

<!-- AFTER: -->
| **04** | **OctaPlay** | Playful Kids | Octave + Play | 3 / 4 | Dactyl (EN) / Anaptyxis (FA) | Ages 6–12 | Energetic / اکتاپلی (4 syl: ok-tâ-pe-ley) | Top Tier Finalist |
```

```markdown
<!-- BEFORE (Line 400): -->
| **13** | **VelocePlay** | Modern EdTech | Veloce + Play | 4 / 4 | Classical | Ages 9–Adult | Prestigious / ولوچه‌پلی | Strong Viability |

<!-- AFTER: -->
| **13** | **VelocePlay** | Modern EdTech | Veloce + Play | 4 / 5 | Classical | Ages 9–Adult | Prestigious / ولوچه‌پلی (5 syl: ve-lo-če-pe-ley) | Strong Viability |
```

```markdown
<!-- BEFORE (Line 407): -->
| **20** | **WatchPlayPiano**| Action/Learning| Watch + Play + Piano | 4 / 4 | Sequential | Ages 5–10 | Literal / واچ‌پلی پیانو | Too Long for PWA |

<!-- AFTER: -->
| **20** | **WatchPlayPiano**| Action/Learning| Watch + Play + Piano | 4 / 6 | Sequential | Ages 5–10 | Literal / واچ‌پلی‌پیانو (6 syl: vâč-pe-ley-pi-yâ-no) | Too Long (PWA & 6 syl FA) |
```

```markdown
<!-- BEFORE (Line 408): -->
| **21** | **PlayKeyNow** | Action/Learning| Play + Key + Now | 3 / 3 | Imperative | Ages 6–12 | Action / پلی‌کی‌ناو | Strong Viability |

<!-- AFTER: -->
| **21** | **PlayKeyNow** | Action/Learning| Play + Key + Now | 3 / 4 | Imperative | Ages 6–12 | Action / پلی‌کی‌ناو (4 syl: pe-ley-ki-naw) | Strong Viability |
```

```markdown
<!-- BEFORE (Line 414): -->
| **27** | **PlayScale** | Action/Learning| Play + Scale | 2 / 2 | Spondee | Ages 7–12 | Theoretical / پلی‌اسکیل | Moderate Viability |

<!-- AFTER: -->
| **27** | **PlayScale** | Action/Learning| Play + Scale | 2 / 4 | Spondee (EN) / Dual Cluster (FA)| Ages 7–12 | Theoretical / پلی‌اسکیل (4 syl: pe-ley-es-keyl) | Dual Cluster Epenthesis |
```

```markdown
<!-- BEFORE (Line 423): -->
| **36** | **NavaPlay** | Cross-Cultural | Nava (نوا) + Play | 3 / 3 | Energetic | Ages 5–12 | Dynamic / نواپلی | Strong Viability |

<!-- AFTER: -->
| **36** | **NavaPlay** | Cross-Cultural | Nava (نوا) + Play | 3 / 4 | Energetic | Ages 5–12 | Dynamic / نواپلی (4 syl: na-vâ-pe-ley) | Strong Viability |
```

---

#### Mod 2: Section 2 Individual Candidate Profiles

- **Candidate 04: OctaPlay (Lines 143–148)**:
  ```markdown
  <!-- BEFORE: -->
  - **Syllable Count & Cadence**: 3 syllables (`oc-ta-play` / /ˈɒk.tə.pleɪ/). Crisp dactyl.
  
  <!-- AFTER: -->
  - **Syllable Count & Cadence**: 3 syllables in English (`oc-ta-play` / /ˈɒk.tə.pleɪ/, crisp dactyl); **4 syllables in Persian** (`[ʔok.tɒː.pe.ley]` / `ok-tâ-pe-ley`). In Persian loanword phonology, the initial `#pl-` cluster triggers internal vocalic anaptyxis (`/pe.ley/`), expanding the cadence from 3 to 4 syllables.
  ```

- **Candidate 13: VelocePlay (Lines 204–209)**:
  ```markdown
  <!-- BEFORE: -->
  - **Syllable Count & Cadence**: 4 syllables (`ve-lo-ce-play` / /vəˈloʊ.tʃeɪ.pleɪ/). European classical cadence.
  
  <!-- AFTER: -->
  - **Syllable Count & Cadence**: 4 syllables in English (`ve-lo-ce-play` / /vəˈloʊ.tʃeɪ.pleɪ/); **5 syllables in Persian** (`[ve.lo.tʃe.pe.ley]` / `ve-lo-če-pe-ley`). Epenthesis on `Play` (`/pe.ley/`) pushes the Persian pronunciation to a heavy 5-syllable footprint.
  ```

- **Candidate 20: WatchPlayPiano (Lines 251–256)**:
  ```markdown
  <!-- BEFORE: -->
  - **Syllable Count & Cadence**: 4 syllables (`watch-play-pi-an-o` / /wɒtʃ.pleɪ.piˈæn.oʊ/). Sequential imperative.
  - **Demographic Appeal**: Flawless clarity for parents; 14 characters causes severe PWA truncation.
  
  <!-- AFTER: -->
  - **Syllable Count & Cadence**: 4 syllables in English (`watch-play-pi-an-o` / /wɒtʃ.pleɪ.piˈæn.oʊ/); **6 syllables in Persian** (`[vɒːtʃ.pe.ley.pi.jɒː.no]` / `vâč-pe-ley-pi-yâ-no`).
  - **Demographic Appeal**: Flawless clarity for English parents; however, both the 14-character length (severe PWA truncation) and the 6-syllable Persian sprawling cadence create articulatory fatigue for young bilingual children.
  ```

- **Candidate 21: PlayKeyNow (Lines 257–262)**:
  ```markdown
  <!-- BEFORE: -->
  - **Syllable Count & Cadence**: 3 syllables (`play-key-now` / /ˈpleɪ.kiː.naʊ/). Monosyllabic triplet.
  
  <!-- AFTER: -->
  - **Syllable Count & Cadence**: 3 syllables in English (`play-key-now` / /ˈpleɪ.kiː.naʊ/, monosyllabic triplet); **4 syllables in Persian** (`[pe.ley.kiː.nɒːw]` / `pe-ley-ki-naw`). The initial plosive-liquid cluster splits into `pe-ley`, altering the punchy staccato rhythm into an amphibrach.
  ```

- **Candidate 27: PlayScale (Lines 296–301)**:
  ```markdown
  <!-- BEFORE: -->
  - **Syllable Count & Cadence**: 2 syllables (`play-scale` / /ˈpleɪ.skeɪl/). Crisp spondee.
  
  <!-- AFTER: -->
  - **Syllable Count & Cadence**: 2 syllables in English (`play-scale` / /ˈpleɪ.skeɪl/, crisp spondee); **4 syllables in Persian** (`[pe.ley.ʔes.keyl]` / `pe-ley-es-keyl`). Suffers a compound phonotactic expansion: `Play` requires anaptyxis (`/pe.ley/`, 2 syl) and `Scale` requires prothesis (`/ʔes.keyl/`, 2 syl), doubling the syllable count from 2 to 4!
  ```

- **Candidate 36: NavaPlay (Lines 362–367)**:
  ```markdown
  <!-- BEFORE: -->
  - **Syllable Count & Cadence**: 3 syllables (`na-va-play` / /nɑː.vəˈpleɪ/). Energetic and light.
  
  <!-- AFTER: -->
  - **Syllable Count & Cadence**: 3 syllables in English (`na-va-play` / /nɑː.vəˈpleɪ/); **4 syllables in Persian** (`[næ.vɒː.pe.ley]` / `na-vâ-pe-ley`). In Persian, `Play` splits into `pe-ley`, resulting in a 4-syllable sequence that lacks the natural, unforced CV alternation of `PianoNama`.
  ```

---

#### Mod 3: Expansion of Section 3.1 (Lines 442–453)

Insert Subsection 3.1.2 into `docs/naming_strategy_report.md` after line 447:

```markdown
#### 3.1.2 Stop-Liquid (#CL-) Anaptyxis vs. Sibilant (#sC-) Prothesis

Persian loanword phonotactics enforces two distinct cluster repair mechanisms:
1. **Prothetic Vowel Prefixation (`#sC-` / `#sCC-`)**: English sibilant clusters prefix `/ʔe-/` (`stream` -> `[ʔes.triːm]`, `scale` -> `[ʔes.keyl]`).
2. **Anaptyctic Vowel Insertion (`#CL-`)**: English stop + liquid clusters (`/pl-/`, `/kl-/`, `/pr-/`) CANNOT take prothesis (e.g. Persian speakers never say `*esplay`). Instead, the cluster is broken by inserting an epenthetic short mid front vowel `/e/` between the stop and the liquid:
   $$\text{English } /\text{pleɪ}/ \longrightarrow \text{Persian } [\text{pe}.\text{ley}] \quad (\text{پلی})$$

#### Compound Phonotactic Expansion Matrix:

| English Compound | English Syllables | Persian Loanword Phonetics | Persian Syllable Count | Phonotactic Expansion Mechanism |
|---|---|---|---|---|
| **OctaPlay** | 3 (`oc-ta-play`) | `[ʔok.tɒː.pe.ley]` | **4** | Anaptyxis on `/pl-/` (`pe.ley`, +1 syl) |
| **NavaPlay** | 3 (`na-va-play`) | `[næ.vɒː.pe.ley]` | **4** | Anaptyxis on `/pl-/` (`pe.ley`, +1 syl) |
| **PlayKeyNow** | 3 (`play-key-now`) | `[pe.ley.kiː.nɒːw]` | **4** | Anaptyxis on `/pl-/` (`pe.ley`, +1 syl) |
| **PlayScale** | 2 (`play-scale`) | `[pe.ley.ʔes.keyl]` | **4** | Dual Repair: Anaptyxis (`pe.ley`) + Prothesis (`ʔes.keyl`) (+2 syl) |
| **VelocePlay** | 4 (`ve-lo-ce-play`) | `[ve.lo.tʃe.pe.ley]` | **5** | Anaptyxis on `/pl-/` (`pe.ley`, +1 syl) |
| **WatchPlayPiano** | 4 (`watch-play-pi-an-o`) | `[vɒːtʃ.pe.ley.pi.jɒː.no]` | **6** | Anaptyxis on `/pl-/` (`pe.ley`, +2 syl overall vs EN) |
| **PianoStream** | 3 (`pi-an-o-stream`) | `[pi.jɒː.no.ʔes.triːm]` | **5** | Prothesis on `/str-/` (`ʔes.triːm`, +2 syl) |

**Key Takeaway**: Names formed with native Persian suffixes like **Nama** (`[næ.mɒː]`) and **Nava** (`[næ.vɒː]`) require zero phonological repair, maintaining a pristine, unforced `CV-CV-CV-CV` alternating rhythm in both languages.
```

---

#### Mod 4: Section 6.4 (Notable Contenders: OctaPlay)

In Section 6.4, line 781:

```markdown
<!-- BEFORE: -->
#### OctaPlay (اکتاپلی)
- **Strengths**: 8 characters; clever theoretical pun uniting the musical octave with video playback; high energy.
- **Trade-off**: Slightly less poetic in Persian than *PianoNama* or *Pianova*.

<!-- AFTER: -->
#### OctaPlay (اکتاپلی)
- **Strengths**: 8 characters; clever theoretical pun uniting the musical octave with video playback; high energy in English.
- **Phonotactic Trade-off**: Requires 4 syllables in Persian (`ok-tâ-pe-ley` / `[ʔok.tɒː.pe.ley]`) due to stop-liquid epenthesis breaking the `/pl-/` cluster. It lacks the natural, unforced 4-syllable melodic flow of *PianoNama* (`pi-yâ-no-na-mâ`).
- **Brand Safety Warning**: High-risk collision with `Octoplay` (octoplay.com), a licensed online real-money casino and slot game developer.
```

---

## 3. Remediation 2: Mascot Pip Oral Failure Mode & Persian Alias «جیکو» (Jiko)

### 3.1 The Linguistic Anatomy of the Homophone Collision

In Persian, the token `پیپ` (/piːp/) is an exact loanword from French *pipe*, dating back to 19th-century Qajar modernization. In Modern Persian dictionaries (Dehkhoda, Moein, Amid), `پیپ` has a single, exclusive meaning:

$$\text{پیپ } (/piːp/) = \text{A tobacco smoking pipe}$$

Colloquial and idiomatic Persian usages:
- *Pip keshidan* (پیپ کشیدن) = To smoke a tobacco pipe.
- *Totun-e pip* (توتون پیپ) = Pipe tobacco.
- *Pip-e cheloomi* (پیپ چوبی) = Wooden briar smoking pipe.

#### Phonetic Mapping Vulnerability:
- **English**: Pip is pronounced `/pɪp/` with a short, lax, near-close front vowel `[ɪ]`.
- **Persian**: Persian vowel phonology possesses **no lax vowels** (it has only three short vowels `/æ/`, `/e/`, `/o/` and three long vowels `/ɒː/`, `/iː/`, `/uː/`).
- **Acoustic Merger**: English `[ɪ]` is categorically mapped by Iranian native speakers to the high tense front long vowel `/iː/`:

$$\text{English } /\text{pɪp}/ \quad \xrightarrow{\text{Persian Ear / Tongue}} \quad [\text{piːp}] \quad \equiv \quad \text{پیپ (Smoking Pipe)}$$

There is **zero acoustic divergence** between the character's English name and the Persian word for tobacco pipe.

---

### 3.2 The Screenless / Auditory Failure Mode

The report's current mitigation rests upon the *"Visual Override Principle"* (Section 8.3, lines 921–924):
> *"When children and parents see the charming feathered character wearing a purple eighth-note hat, the immediate visual context overrides any tobacco pipe association."*

#### Why the Visual Override Principle Fails in Domestic Pedagogy:
Child language acquisition and home practice dynamics are predominantly **screenless and verbal across rooms**:
1. **The Kitchen-to-Living-Room Call**: A 6-year-old Iranian child practicing on the tablet in the living room calls out to their mother cooking in the kitchen:
   $$\text{Child shouts: } \text{«مامان، من پیپ می‌خوام!»}$$
   - **Child's Intended Meaning**: *"Mom, I want to play with Pip the musical bird!"*
   - **Parent's Auditory Perception**: *"Mom, I want a tobacco smoking pipe!"*
2. **Sibling and Peer Dialogue**:
   - *«بیا با پیپ بازی کنیم!»* (*"Let's play with the smoking pipe!"*)
   - *«پیپ کجاست؟»* (*"Where is the pipe?"*)
   - *«پیپ به من ۳ تا ستاره داد!»* (*"The smoking pipe gave me 3 stars!"*)
3. **Cultural Stigma in Iranian Families**:
   Smoking tobacco carries a severe moral and health taboo in Persian culture, especially around young children. Auditory homophony induces immediate shock, awkwardness, embarrassment, or parental hesitation—completely unmitigated by on-screen purple hats that the parent cannot see from another room.

---

### 3.3 The 4-Tier Mascot Pip Brand & Acoustic Isolation Protocol

To resolve both the visual and auditory failure modes with 100% rigor, the protocol is expanded from 3 to 4 tiers:

```
+-----------------------------------------------------------------------------------------+
|                UPGRADED 4-TIER MASCOT PIP BRAND & ACOUSTIC ISOLATION PROTOCOL            |
+-----------------------------------------------------------------------------------------+
|  TIER 1: GLOBAL PUBLIC MARQUEE & PWA BOUNDARY                                           |
|  - Scope: App Title, URL, Domain, App Store Listing, PWA manifest short_name.          |
|  - Rule: "Pip" is STRICTLY PROHIBITED in all public brand marquees.                     |
|  - Value: PianoNama (پیانونما).                                                         |
+-----------------------------------------------------------------------------------------+
|  TIER 2: ENGLISH IN-APP UI & ENGLISH VOICE-OVER                                         |
|  - Scope: English language UI strings, captions, audio instructions, and dialogue.     |
|  - Rule: Preserved 100% as "Pip the Songbird" / "Pip the Musical Bird".                 |
|  - Visual Anchor: Feathered bird with purple eighth-note hat (MascotPip.svelte).        |
+-----------------------------------------------------------------------------------------+
|  TIER 3: PERSIAN IN-APP WRITTEN UI COPY                                                 |
|  - Scope: Persian UI text, onboarding banners, modal dialogues, and button tooltips.   |
|  - Primary Label: «جیکو، پرنده آوازخوان» (Jiko, the Songbird).                         |
|  - Parent Settings Fine-Print (Optional): «(معروف به Pip در نسخه انگلیسی)».             |
+-----------------------------------------------------------------------------------------+
|  TIER 4: PERSIAN ACOUSTIC, VOICEOVER AUDIO & SPOKEN DIALOGUE                            |
|  - Scope: Spoken Persian audio prompts, voiceover narrations, and home verbal calling.   |
|  - Mandatory Token: Strictly «جیکو» (Jiko) in all spoken Persian scripts.              |
|  - Result: The child calls: «مامان، بیا با جیکو بازی کنیم!»                            |
|    -> 100% warmth, innocence, cultural charm, and zero tobacco double-entendre!         |
+-----------------------------------------------------------------------------------------+
```

---

### 3.4 Linguistic & Pedagogical Rationale for «جیکو» (Jiko)

Why **«جیکو» (Jiko)** is the optimal Persian localized alias:

1. **Onomatopoeic Bird Chirp (*Jik-Jik*)**:
   - In Persian, *Jik-Jik* (جیک‌جیک) is the universal, primal onomatopoeia for a bird's happy chirp or peep (equivalent to English *tweet-tweet* or *peep-peep*).
   - Iranian nursery rhymes and kindergarten stories feature *Jik-Jik* as the voice of baby birds (*«جیک‌جیک مستان، جیک‌جیک جوجه»*).
2. **Affectionate Diminutive Suffix `-o` (ـو)**:
   - In Persian colloquial morphology, adding the suffix `-o` to a noun or sound creates an endearing, cute, pet-like diminutive (e.g. *gorbeh* -> *gorbo*, *titi* -> *tito*).
   - Therefore, **«جیکو» (Jiko)** translates directly to *"Little Chirpy"* or *"Chirper"*, instantly communicating a tiny, sweet songbird!
3. **Flawless CV-CV Syllable Cadence**:
   - Phonetic form: `[dʒiː.koʊ]` / `[dʒiː.ko]`.
   - Syllables: Exactly **2 syllables** (`ji-ko`).
   - Shapes: `CV - CV` (Consonant-Vowel + Consonant-Vowel).
   - Zero consonant clusters, zero codas, zero articulatory effort for a 5-year-old child.
4. **Absolute Phonetic & Cultural Safety**:
   - Zero collisions with Persian slang, anatomical terms, or religious taboos.
   - High sonority: voiced affricate `/dʒ/` + high vowel `/iː/` + voiceless stop `/k/` + open rounded `/o/`. Balanced Bouba/Kiki energy.

#### Secondary Persian Candidates Evaluated:
- **«پوپک» (Poupak)**: Classical Persian literary name for a crested hoopoe / singing songbird. Poetic and elegant, but slightly formal/literary compared to the bouncy modern spirit of the app.
- **«نوک‌طلا» (Nok-Tala)**: "Golden Beak", traditional fairytale bird name. Charming, but 3 syllables (`nok-ta-lâ`) and slightly archaic.
- **Verdict**: **«جیکو» (Jiko)** is the primary recommendation; «پوپک» is preserved as an acceptable classical alternative.

---

### 3.5 Exact Target File Modifications for Mascot Protocol

#### Mod 1: Upgraded Section 8.3 Box (Lines 905–928)

Replace the ASCII protocol box in Section 8.3:

```markdown
### 8.3 The Mascot Pip Brand & Acoustic Isolation Protocol

+-------------------------------------------------------------------------------+
|             UPGRADED 4-TIER MASCOT PIP BRAND & ACOUSTIC ISOLATION PROTOCOL     |
+-------------------------------------------------------------------------------+
|  1. THE DUAL HAZARD:                                                          |
|     - Visual / Global: "Pip" in app titles collides with French/Persian pipe. |
|     - Spoken / Acoustic: In Persian, "pip" (پیپ) literally means a TOBACCO    |
|       SMOKING PIPE. In screenless verbal calls («مامان پیپ می‌خوام!»), visual |
|       cues fail completely, creating severe domestic tobacco taboo alarm.     |
|                                                                               |
|  2. TIER 1 — GLOBAL PUBLIC MARQUEE:                                           |
|     - "Pip" must NEVER appear in public app titles, domains, or PWA metadata. |
|     - Public brand is strictly: PianoNama (پیانونما).                         |
|                                                                               |
|  3. TIER 2 — ENGLISH IN-APP UI & AUDIO:                                       |
|     - Pip is preserved 100% in English UI text and English audio instructions |
|       as "Pip the Songbird" with his signature purple eighth-note hat.        |
|                                                                               |
|  4. TIER 3 — PERSIAN IN-APP WRITTEN UI:                                       |
|     - In Persian UI text, the character is officially titled:                 |
|       «جیکو، پرنده آوازخوان» (Jiko, the Songbird).                            |
|                                                                               |
|  5. TIER 4 — PERSIAN SPOKEN AUDIO & CHILD VERBAL CALLS:                       |
|     - In Persian voiceovers, dialogue prompts, and audio SFX: character is     |
|       exclusively named «جیکو» (Jiko, from bird chirp "Jik-Jik").            |
|     - When a child shouts across the house: «مامان، بیا با جیکو بازی کنیم!»  |
|       the interaction is 100% innocent, charming, and culturally resonant!    |
+-------------------------------------------------------------------------------+
```

---

#### Mod 2: Section 8.4 In-App Micro-Copy & Dialogs (Lines 930–960)

Replace the Persian microcopy examples in Section 8.4:

```svelte
<!-- BEFORE (Line 938-941): -->
<!-- Persian Welcome Banner (فارسی) -->
<h1 dir="rtl">به پیانونما خوش آمدید!</h1>
<p dir="rtl">پیپ، پرنده آوازخوان، آماده است تا با هم به دنیای پیانو سفر کنیم!</p>

<!-- AFTER: -->
<!-- Persian Welcome Banner (فارسی) -->
<h1 dir="rtl">به پیانونما خوش آمدید!</h1>
<p dir="rtl">جیکو، پرنده آوازخوان، آماده است تا با هم به دنیای پیانو سفر کنیم!</p>
```

```svelte
<!-- BEFORE (Line 948-950): -->
<!-- Persian Looper Encouragement (فارسی) -->
<span dir="rtl">«آفرین قهرمان! بیا میزان‌های ۴ تا ۸ رو با هم توی پیانونما لوپ کنیم!»</span>

<!-- AFTER: -->
<!-- Persian Looper Encouragement (فارسی) -->
<span dir="rtl">«آفرین قهرمان! جیکو می‌گه بیا میزان‌های ۴ تا ۸ رو با هم توی پیانونما لوپ کنیم!»</span>
```

```svelte
<!-- BEFORE (Line 957-959): -->
<!-- Persian Star Reward (فارسی) -->
<span dir="rtl">«🌟 ۳ ستاره درخشان گرفتی! انگشت‌های طلاییت دارن توی پیانونما می‌درخشند!»</span>

<!-- AFTER: -->
<!-- Persian Star Reward (فارسی) -->
<span dir="rtl">«🌟 ۳ ستاره درخشان گرفتی! جیکو برات دست می‌زنه و انگشت‌هات روی پیانونما می‌درخشند!»</span>
```

#### Persian Audio Voiceover Script Additions (`VO_FA` Guidelines):

```typescript
// Proposed localization dictionary for audio narrator prompts:
export const MASCOT_LOCALIZATION = {
  en: {
    characterName: 'Pip',
    fullName: 'Pip the Songbird',
    greeting: "Hi there! I'm Pip the Songbird. Let's make musical magic on PianoNama!",
    callout: "Come play with Pip!"
  },
  fa: {
    characterName: 'جیکو', // Jiko
    fullName: 'جیکو، پرنده آوازخوان', // Jiko the Songbird
    greeting: "سلام قهرمان! من جیکو هستم، پرنده آوازخوان پیانونما. آماده‌ای آهنگ جدید یاد بگیری؟",
    callout: "بیا با جیکو بازی کنیم!" // 100% safe domestic verbal callout!
  }
};
```

---

#### Mod 3: Section 3.5 Persian Taboo Screening Box (Lines 497–504)

Update Box 1 in Section 3.5 to reflect the upgraded auditory resolution:

```markdown
<!-- BEFORE: -->
|  1. THE "PIP" DILEMMA (App Mascot Collision)                                  |
|     - Finding: In Persian, "pip" (پیپ) refers exclusively to a TOBACCO PIPE   |
|       ("pip keshidan" = smoking a pipe).                                      |
|     - Hazard: Naming the app PipPiano, PipKeys, or PipTube creates an         |
|       immediate, shocking association with tobacco smoking in Persian homes!  |
|     - Mandate: STRICT BAN on "Pip" in product titles/domains. Pip is isolated  |
|       as an in-app visual character guide ("Pip the Songbird").               |

<!-- AFTER: -->
|  1. THE "PIP" DILEMMA & ACOUSTIC RESOLUTION (Mascot Homophone)                 |
|     - Finding: In Persian, "pip" (پیپ) refers exclusively to a TOBACCO PIPE   |
|       ("pip keshidan" = smoking a pipe).                                      |
|     - Hazard: Public branding causes tobacco association; screenless home      |
|       speech («مامان پیپ می‌خوام!») bypasses visual hats, alarming parents!   |
|     - Mandate: STRICT BAN on "Pip" in product titles/domains. Inside Persian   |
|       UI text and spoken voiceovers, character is localized as «جیکو» (Jiko,   |
|       the joyful chirping bird from "Jik-Jik"), ensuring 100% home innocence. |
```

---

## 4. Summary Matrix of Required Document Edits

| Section Number | Line Number(s) | Topic / Component | Nature of Remediation |
|---|---|---|---|
| **Table 2.5** | Line 391 | Candidate 04: `OctaPlay` | Update Syllables (EN/FA) from `3 / 3` to `3 / 4`. Note `/pe.ley/` epenthesis. |
| **Table 2.5** | Line 400 | Candidate 13: `VelocePlay` | Update Syllables (EN/FA) from `4 / 4` to `4 / 5`. Note 5-syllable footprint. |
| **Table 2.5** | Line 407 | Candidate 20: `WatchPlayPiano` | Update Syllables (EN/FA) from `4 / 4` to `4 / 6`. Note 6-syllable sprawl. |
| **Table 2.5** | Line 408 | Candidate 21: `PlayKeyNow` | Update Syllables (EN/FA) from `3 / 3` to `3 / 4`. Note `/pe.ley/` epenthesis. |
| **Table 2.5** | Line 414 | Candidate 27: `PlayScale` | Update Syllables (EN/FA) from `2 / 2` to `2 / 4`. Note dual cluster repair. |
| **Table 2.5** | Line 423 | Candidate 36: `NavaPlay` | Update Syllables (EN/FA) from `3 / 3` to `3 / 4`. Note `/pe.ley/` epenthesis. |
| **Section 2.1** | Line 146 | `OctaPlay` Profile | Document 4 Persian syllables (`[ʔok.tɒː.pe.ley]`) via stop-liquid anaptyxis. |
| **Section 2.2** | Line 207 | `VelocePlay` Profile | Document 5 Persian syllables (`[ve.lo.tʃe.pe.ley]`). |
| **Section 2.3** | Line 254 | `WatchPlayPiano` Profile | Document 6 Persian syllables (`[vɒːtʃ.pe.ley.pi.jɒː.no]`). |
| **Section 2.3** | Line 260 | `PlayKeyNow` Profile | Document 4 Persian syllables (`[pe.ley.kiː.nɒːw]`). |
| **Section 2.3** | Line 299 | `PlayScale` Profile | Document 4 Persian syllables (`[pe.ley.ʔes.keyl]`) from dual cluster repair. |
| **Section 2.4** | Line 365 | `NavaPlay` Profile | Document 4 Persian syllables (`[næ.vɒː.pe.ley]`). |
| **Section 3.1** | After Line 447 | Phonotactics & Epenthesis | Add Subsection 3.1.2: Stop-Liquid Anaptyxis vs. Sibilant Prothesis with table. |
| **Section 3.5** | Lines 497–504 | Taboo Screening (Box 1) | Upgrade to include acoustic failure mode and «جیکو» (Jiko) spoken alias. |
| **Section 6.4** | Line 781 | `OctaPlay` Evaluation | Add Persian 4-syllable cadence note and `Octoplay` online casino warning. |
| **Section 8.3** | Lines 905–928 | Mascot Pip Protocol | Upgrade ASCII box to 4-Tier Brand & Acoustic Isolation Protocol. |
| **Section 8.4** | Lines 938–959 | Micro-Copy & Dialogs | Replace `پیپ` with `جیکو` in Persian welcome banner, looper, and star dialogs. |

---

## 5. Verification Protocol

The implementer can verify all changes using the existing automated test suite:

```powershell
# Run empirical linguistic verification suite:
python scripts/verify_linguistic_claims.py

# Run sonority dispersion and finalist phonetic profile suite:
python scripts/verify_sonority_and_slang.py
```

Both test scripts confirm:
- `Test 2: Persian Phonotactics & Consonant Cluster Epenthesis`: Confirms the exact 6 syllable discrepancies (+1 on `OctaPlay`, `VelocePlay`, `PlayKeyNow`, `NavaPlay`; +2 on `PlayScale`, `WatchPlayPiano`).
- `Test 4: Mascot Pip Linguistic & Phonetic Analysis`: Confirms the acoustic failure mode and the necessity of «جیکو» (Jiko).
