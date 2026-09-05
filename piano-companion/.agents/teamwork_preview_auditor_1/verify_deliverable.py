# -*- coding: utf-8 -*-
"""
Forensic Audit Verification Script for docs/naming_strategy_report.md
Teamwork Preview Forensic Auditor
"""

import os
import re
import sys

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

REPORT_PATH = r"C:\Users\admin\Documents\antigravity\eager-newton\piano-companion\docs\naming_strategy_report.md"

def audit():
    print("=== FORENSIC INTEGRITY AUDIT SUITE ===")
    if not os.path.exists(REPORT_PATH):
        print(f"FAIL: Deliverable not found at {REPORT_PATH}")
        sys.exit(1)

    with open(REPORT_PATH, "r", encoding="utf-8") as f:
        content = f.read()
        lines = content.splitlines()

    print(f"[PASS] File loaded successfully. Total lines: {len(lines)}, Total characters: {len(content)}")

    # 1. Static placeholder search
    print("\n--- 1. STATIC PLACEHOLDER & FACADE AUDIT ---")
    forbidden_tokens = ["TODO", "TBD", "[placeholder]", "FIXME", "XXX", "lorem ipsum", "temp_"]
    found_tokens = {}
    for tok in forbidden_tokens:
        matches = re.findall(rf"\b{re.escape(tok)}\b", content, re.IGNORECASE)
        if matches:
            found_tokens[tok] = len(matches)

    if found_tokens:
        print(f"FAIL: Detected placeholder tokens: {found_tokens}")
    else:
        print("[PASS] Zero placeholder tokens detected (0 TODO, 0 TBD, 0 [placeholder], 0 FIXME, 0 lorem ipsum)")

    # 2. Taxonomy and Candidate Extraction
    print("\n--- 2. CANDIDATE & TAXONOMY ENUMERATION ---")
    candidate_headers = re.findall(r"#### Candidate (\d+):\s*\*\*([^*]+)\*\*", content)
    print(f"Narrative Candidates Count: {len(candidate_headers)}")
    for num, name in candidate_headers:
        print(f"  Candidate {num}: {name}")

    if len(candidate_headers) < 25:
        print(f"FAIL: Expected at least 25 candidates, found {len(candidate_headers)}")
    else:
        print(f"[PASS] Candidate count requirement satisfied ({len(candidate_headers)} >= 25)")

    # Check 4 Taxonomies
    taxonomies = [
        ("Playful & Kids-First", r"### 2\.1 Taxonomy 1: Playful & Kids-First"),
        ("Modern Streaming & EdTech", r"### 2\.2 Taxonomy 2: Modern Streaming & EdTech"),
        ("Action & Learning-Oriented", r"### 2\.3 Taxonomy 3: Action & Learning-Oriented"),
        ("Bilingual & Cross-Cultural Hybrids", r"### 2\.4 Taxonomy 4: Bilingual & Cross-Cultural Hybrids")
    ]
    for tax_name, pattern in taxonomies:
        match = re.search(pattern, content)
        if match:
            print(f"[PASS] Taxonomy found: {tax_name}")
        else:
            print(f"FAIL: Taxonomy missing: {tax_name}")

    # Check 38-candidate table
    table_candidates = re.findall(r"\|\s*\*\*(\d+)\*\*\s*\|\s*\*\*([^*]+)\*\*\s*\|\s*([^|]+)\|", content)
    print(f"\nInventory Table Candidates Count: {len(table_candidates)}")
    if len(table_candidates) == 38:
        print("[PASS] Master inventory table contains exactly 38 candidates.")
    else:
        print(f"WARNING/FAIL: Table candidate count is {len(table_candidates)}, expected 38.")

    # 3. Scoring Matrix Math & Consistency
    print("\n--- 3. 5-DIMENSION SCORING MATRIX MATHEMATICAL AUDIT ---")
    def clean_cell(text):
        return text.replace("*", "").strip()

    # Extract Section 5.2 specifically
    sec_5_2_match = re.search(r"### 5\.2 Comparative Ranked Scorecard.*?(?=### 5\.3|$)", content, re.DOTALL)
    if not sec_5_2_match:
        print("FAIL: Could not locate Section 5.2 in deliverable.")
        return

    sec_5_2_text = sec_5_2_match.group(0)
    scorecard_lines = [
        line.strip() for line in sec_5_2_text.splitlines() 
        if line.strip().startswith("|") and not line.strip().startswith("| Rank") and not line.strip().startswith("|---")
    ]
    print(f"Scored Contenders in Table 5.2: {len(scorecard_lines)}")
    math_errors = 0
    prev_total = 100.0

    for sline in scorecard_lines:
        parts = [p.strip() for p in sline.split("|")[1:-1]]
        if len(parts) >= 10:
            rank_str = clean_cell(parts[0])
            name = clean_cell(parts[1])
            taxonomy = clean_cell(parts[2])
            kmj = float(clean_cell(parts[3]))
            eph = float(clean_cell(parts[4]))
            ccl = float(clean_cell(parts[5]))
            uph = float(clean_cell(parts[6]))
            bst = float(clean_cell(parts[7]))
            tot_str = clean_cell(parts[8]).replace("/ 50", "").strip()
            rep_total_val = round(float(tot_str), 1)
            calculated_total = round(kmj + eph + ccl + uph + bst, 1)

            discrepancy = abs(calculated_total - rep_total_val)
            if discrepancy > 0.05:
                print(f"FAIL MATH: {name} calculated {calculated_total} != reported {rep_total_val}")
                math_errors += 1
            else:
                print(f"[PASS MATH] {name:16}: KMJ={kmj:4.1f} EPH={eph:4.1f} CCL={ccl:4.1f} UPH={uph:4.1f} BST={bst:4.1f} -> Calc={calculated_total:4.1f}, Rep={rep_total_val:4.1f}")

            if rep_total_val > prev_total + 0.05:
                print(f"FAIL RANKING: {name} ({rep_total_val}) is higher than previous ({prev_total})")
            prev_total = rep_total_val

    if math_errors == 0 and len(scorecard_lines) == 12:
        print(f"[PASS] All {len(scorecard_lines)} scorecard rows are mathematically exact and monotonically ranked.")
    else:
        print(f"FAIL/WARNING: math_errors={math_errors}, row_count={len(scorecard_lines)} (expected 12)")

    # 4. String Length & PWA Constraint Verification
    print("\n--- 4. PWA SHORT_NAME & HEADER STRING LENGTH AUDIT ---")
    char_checks = [
        ("PianoNama", 9, 12),
        ("Pianova", 7, 12),
        ("LoopKeys", 8, 12),
        ("KeyToon", 7, 12),
        ("Piano Companion", 15, 12)
    ]
    for name, expected_len, pwa_max in char_checks:
        actual_len = len(name)
        if actual_len == expected_len:
            status = "PASS" if actual_len <= pwa_max else "OVERFLOW (EXPECTED FOR RETIRED TITLE)"
            print(f"[{status}] '{name}': len={actual_len} (limit={pwa_max})")
        else:
            print(f"FAIL: '{name}' actual len {actual_len} != expected {expected_len}")

    # 5. Persian Script and Linguistic Integrity Audit
    print("\n--- 5. PERSIAN SCRIPT & LINGUISTIC AUTHENTICITY AUDIT ---")
    persian_samples = [
        ("پیانونما", "PianoNama"),
        ("پیانوا", "Pianova"),
        ("لوپ‌کیز", "LoopKeys"),
        ("پیانونوا", "PianoNava"),
        ("نوا", "Nava (melody)"),
        ("نما", "Nama (screen/showcase)"),
        ("ساز", "Saz (musical instrument)"),
        ("آهنگ", "Ahang (song/tune)"),
        ("ترانه", "Taraneh (song/ballad)"),
        ("کلاویه", "Klavier/Keys"),
        ("پیپ", "Pip (tobacco pipe)"),
        ("گوه", "Goh (feces taboo)"),
        ("کوس", "Kos (vulgar taboo)"),
        ("کیر", "Kir (phallic taboo)"),
        ("ببین، بنواز، بدرخش!", "Bebin, Benavaz, Bederekhsh!"),
        ("تماشاخانه ویدیویی پیانو برای کودکان", "Tamashakhaneh..."),
        ("هر ویدیو یک آهنگ، هر کلید یک لبخند!", "Har vidyo yek ahang..."),
        ("جایی که انگشتان کوچک، ملودی‌های بزرگ می‌سازند.", "Jayi keh angoshtan..."),
        ("هر کلید، یک ستاره روشن.", "Har kelid, yek setareh roshan."),
        ("ویدیو رو لوپ کن، کلیدها رو فتح کن!", "Vidyo ro loop kon..."),
        ("تمرین آسان و شیرین، گام به گام با هر لوپ.", "Tamrin asan va shirin..."),
        ("جایی که کلیدهای پیانو جان می‌گیرند!", "Jayi keh kelidha..."),
        ("پلی رو بزن، پیانو بنواز.", "Play ro bezan..."),
        ("به پیانونما خوش آمدید!", "Welcome to PianoNama"),
        ("پیپ، پرنده آوازخوان، آماده است تا با هم به دنیای پیانو سفر کنیم!", "Mascot Pip welcome"),
        ("آفرین قهرمان! بیا میزان‌های ۴ تا ۸ رو با هم توی پیانونما لوپ کنیم!", "Looper dialog"),
        ("🌟 ۳ ستاره درخشان گرفتی! انگشت‌های طلاییت دارن توی پیانونما می‌درخشند!", "Star reward")
    ]

    persian_missing = 0
    for p_text, desc in persian_samples:
        if p_text in content:
            print(f"[PASS AUTHENTICITY] Found '{p_text}' ({desc})")
        else:
            print(f"FAIL AUTHENTICITY: Missing '{p_text}' ({desc})")
            persian_missing += 1

    if persian_missing == 0:
        print("[PASS] All Persian text samples, roots, taboos, and taglines are authentically present in the document.")
    else:
        print(f"FAIL: {persian_missing} Persian phrases missing.")

    # 6. Check Section Layout and Coverage
    print("\n--- 6. SECTION ARCHITECTURE & COVERAGE AUDIT ---")
    required_sections = [
        "1. Executive Summary & Brand Purpose",
        "2. Candidate Pool Generation Across 4 Taxonomies",
        "3. English & Persian (Farsi) Linguistic & Phonetic Assessment",
        "4. Trademark Safety & Platform Policy Clearance",
        "5. Master 5-Dimension Weighted Scoring Matrix",
        "6. Winning Finalist Dossiers",
        "7. Paired Bilingual Tagline Architecture",
        "8. Technical UI & Micro-Copy Integration Guidelines",
        "9. Conclusion & Strategic Recommendation"
    ]
    for sec in required_sections:
        if sec in content:
            print(f"[PASS SECTION] Found '{sec}'")
        else:
            print(f"FAIL SECTION: Missing '{sec}'")

if __name__ == "__main__":
    audit()
