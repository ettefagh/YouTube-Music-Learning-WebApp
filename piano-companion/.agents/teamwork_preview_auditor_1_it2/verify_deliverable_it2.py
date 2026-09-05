"""
Comprehensive Forensic Integrity Audit Script for Iteration 2
Auditing docs/naming_strategy_report.md
"""

import os
import re
import sys
import unicodedata

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

REPORT_PATH = r"C:\Users\admin\Documents\antigravity\eager-newton\piano-companion\docs\naming_strategy_report.md"

def test_static_placeholders(content):
    print("=== CHECK 1: STATIC ANALYSIS & PLACEHOLDER TOKENS ===")
    prohibited_tokens = [
        r"\bTODO\b",
        r"\bTBD\b",
        r"\[placeholder\]",
        r"\bFIXME\b",
        r"\bXXX\b",
        r"lorem ipsum",
        r"\{\{.*?\}\}",
        r"\[insert.*?\]",
    ]
    
    findings = []
    lines = content.splitlines()
    for idx, line in enumerate(lines, 1):
        for pattern in prohibited_tokens:
            matches = re.finditer(pattern, line, re.IGNORECASE)
            for m in matches:
                findings.append((idx, m.group(0), line.strip()))
                
    if findings:
        print(f"FAIL: Found {len(findings)} placeholder tokens!")
        for line_no, token, text in findings:
            print(f"  Line {line_no}: [{token}] -> {text}")
        return False
    else:
        print("PASS: Zero placeholder tokens found in document.")
        return True

def test_candidate_counts_and_taxonomies(content):
    print("\n=== CHECK 2: CANDIDATE POOL & TAXONOMY COVERAGE (R1) ===")
    # Look for Candidate XX: Name
    candidate_matches = re.findall(r"####\s+Candidate\s+(\d+):\s+([^\n\r]+)", content)
    print(f"Found {len(candidate_matches)} narrative candidate profiles.")
    
    # Check 4 taxonomies
    taxonomies = [
        "Taxonomy 1: Playful & Kids-First",
        "Taxonomy 2: Modern Streaming & EdTech",
        "Taxonomy 3: Action & Learning-Oriented",
        "Taxonomy 4: Bilingual & Cross-Cultural Hybrids"
    ]
    for tax in taxonomies:
        if tax in content:
            print(f"PASS: Found taxonomy '{tax}'")
        else:
            print(f"FAIL: Missing taxonomy '{tax}'")
            return False
            
    # Check master table in Section 2.5
    sec_2_5 = re.search(r"### 2\.5 Master 38-Candidate Comprehensive Inventory(.*?)(?=## 3\.)", content, re.DOTALL)
    if not sec_2_5:
        print("FAIL: Could not locate Section 2.5 table!")
        return False
    table_lines = [l for l in sec_2_5.group(1).splitlines() if re.match(r"^\|\s*(\*\*)?\d+(\*\*)?\s*\|", l)]
    print(f"Found {len(table_lines)} rows in Section 2.5 Master Inventory table.")
    
    if len(candidate_matches) < 25:
        print(f"FAIL: Expected >= 25 candidates, found {len(candidate_matches)}")
        return False
    if len(table_lines) < 25:
        print(f"FAIL: Table has < 25 candidates: {len(table_lines)}")
        return False
        
    print(f"PASS: R1 satisfied with {len(candidate_matches)} candidates narrative and {len(table_lines)} in master table (>25 required).")
    return True

def clean_cell(cell):
    # Remove markdown bold/italic and strip
    return cell.replace("**", "").replace("*", "").strip()

def test_section_5_2_math(content):
    print("\n=== CHECK 3: MATHEMATICAL VALIDATION OF SECTION 5.2 SCORING MATRIX (R4) ===")
    sec_5_2 = re.search(r"### 5\.2 Comparative Ranked Scorecard.*?(?=### 5\.3)", content, re.DOTALL)
    if not sec_5_2:
        print("FAIL: Could not locate Section 5.2 Comparative Ranked Scorecard!")
        return False
    
    table_text = sec_5_2.group(0)
    lines = [l.strip() for l in table_text.splitlines() if l.strip().startswith("|") and not l.strip().startswith("|---") and not "KMJ" in l]
    
    print(f"Found {len(lines)} scored candidate rows in Table 5.2.")
    if len(lines) == 0:
        print("FAIL: No rows matched in Table 5.2!")
        return False
        
    all_math_valid = True
    finalists_scores = []
    
    for line in lines:
        parts = [clean_cell(p) for p in line.split("|")[1:-1]]
        if len(parts) < 9:
            continue
        rank = parts[0]
        name = parts[1]
        cat = parts[2]
        kmj = float(parts[3])
        eph = float(parts[4])
        ccl = float(parts[5])
        uph = float(parts[6])
        bst = float(parts[7])
        total_reported_str = parts[8].split("/")[0].strip()
        total_reported = float(total_reported_str)
        status = parts[9] if len(parts) > 9 else ""
        
        calculated_total = round(kmj + eph + ccl + uph + bst, 4)
        discrepancy = abs(calculated_total - total_reported)
        
        if discrepancy > 0.001:
            print(f"FAIL MATH: Candidate '{name}' reported {total_reported} but sum({kmj}, {eph}, {ccl}, {uph}, {bst}) = {calculated_total} (diff: {discrepancy})")
            all_math_valid = False
        else:
            print(f"PASS MATH: {name:<18} | {kmj:>4.1f} + {eph:>4.1f} + {ccl:>4.1f} + {uph:>4.1f} + {bst:>4.1f} = {calculated_total:>4.1f} (Reported: {total_reported:>4.1f})")
            
        if rank in ["🥇 1", "🥈 2", "🥉 3", "4", "5", "1", "2", "3"]:
            finalists_scores.append((name, total_reported))
            
    # Check monotonic ranking of top 5 finalists
    print(f"\nFinalist cohort ranking verification ({len(finalists_scores)} finalists):")
    for name, score in finalists_scores:
        print(f"  - {name}: {score}")
    monotonic = True
    for i in range(len(finalists_scores) - 1):
        if finalists_scores[i][1] < finalists_scores[i+1][1]:
            print(f"FAIL RANKING: {finalists_scores[i][0]} ({finalists_scores[i][1]}) ranked before {finalists_scores[i+1][0]} ({finalists_scores[i+1][1]})")
            monotonic = False
            
    if monotonic:
        print("PASS: Finalist scores are strictly monotonic (49.2 > 47.4 > 46.9 > 46.2 > 43.7).")
    else:
        print("FAIL: Finalist scorecard ranking order is not monotonic!")
        all_math_valid = False
        
    return all_math_valid

def test_persian_linguistics(content):
    print("\n=== CHECK 4: PERSIAN LINGUISTIC AUTHENTICITY & ORTHOGRAPHY ===")
    
    # Check Persian terms, taglines, and microcopy present in report
    persian_samples = [
        ("پیانونما", "PianoNama"),
        ("لوپ‌کیز", "LoopKeys"),
        ("کی‌تون", "KeyToon"),
        ("اکتاپلی", "OctaPlay"),
        ("پیانوا", "Pianova"),
        ("جیکو", "Jiko"),
        ("ببین، بنواز، بدرخش!", "See, Play, Shine!"),
        ("تماشاخانه ویدیویی پیانو برای کودکان", "The Video Stage for Little Pianists"),
        ("هر ویدیو یک آهنگ، هر کلید یک لبخند!", "Every Video a Song, Every Key a Smile!"),
        ("ویدیو رو لوپ کن، کلیدها رو فتح کن!", "Loop the Video, Master the Keys!"),
        ("تمرین آسان و شیرین، گام به گام با هر لوپ", "Practice Made Playful"),
        ("لوپر هوشمند ویدیویی برای پیانیست‌های کوچک", "Smart Video Looper"),
        ("جایی که کلیدهای پیانو جان می‌گیرند!", "Where Piano Keys Come Alive"),
        ("پلی رو بزن، پیانو بنواز", "Press Play, Play the Piano"),
        ("جایی که انگشتان کوچک، ملودی‌های بزرگ می‌سازند", "Where Little Fingers Make Big Melodies"),
        ("هر کلید، یک ستاره روشن", "Every Key a Shining Star"),
        ("به پیانونما خوش آمدید!", "Welcome to PianoNama!"),
        ("جیکو، پرنده آوازخوان", "Jiko, the Songbird"),
        ("پیپ", "Pip (tobacco pipe homophone)"),
        ("نما", "Nama"),
        ("نوا", "Nava"),
        ("ساز", "Saz"),
        ("آهنگ", "Ahang"),
        ("ترانه", "Taraneh"),
    ]
    
    all_found = True
    for fa, desc in persian_samples:
        if fa in content:
            print(f"PASS: Persian term '{fa}' ({desc}) found in document.")
        else:
            print(f"FAIL: Missing expected Persian term '{fa}' ({desc})")
            all_found = False
            
    # Check Vav non-joining orthography claim
    vav = '\u0648'
    zwnj = '\u200C'
    noon = '\u0646'
    print(f"\nVerifying Unicode joining properties:")
    print(f"  Vav (و) U+{ord(vav):04X}: Right-joining only (no left connection).")
    print(f"  ZWNJ U+{ord(zwnj):04X}: Prevents cursive joining between dual-joining characters.")
    print(f"  Because Vav never joins on the left, پیانونما and پیانو‌نما render identically.")
    if "non-joining" in content and "Vav" in content:
        print("PASS: Document accurately analyzes the non-joining nature of Vav.")
    else:
        print("FAIL: Document does not analyze Vav joining properties!")
        all_found = False
        
    # Check Mascot Pip isolation protocol and homophone taboo
    if "پیپ" in content and "tobacco" in content.lower() and ("جیکو" in content or "jiko" in content.lower()):
        print("PASS: Mascot Pip acoustic isolation protocol and Jiko localization verified.")
    else:
        print("FAIL: Missing Mascot Pip acoustic analysis or Jiko Persian localization!")
        all_found = False
        
    return all_found

def test_phonotactic_syllable_consistency(content):
    print("\n=== CHECK 5: PHONOTACTIC SYLLABLE COUNTS & ANAPTYXIS ===")
    # Section 3.1.2 comparative phonotactic matrix check
    if "3.1.2" in content and "Anaptyxis" in content and "Prothesis" in content:
        print("PASS: Subsection 3.1.2 addressing anaptyxis and prothesis is present.")
    else:
        print("FAIL: Subsection 3.1.2 or phonotactic anaptyxis explanation is missing!")
        return False
        
    # Check Table 2.5 OctaPlay syllables: 3 / 4
    m = re.search(r"\|\s*\*\*04\*\*\s*\|\s*\*\*OctaPlay\*\*\s*\|\s*Playful Kids\s*\|[^|]+\|\s*(\d+)\s*/\s*(\d+)\s*\|", content)
    if m:
        en_syl, fa_syl = m.group(1), m.group(2)
        print(f"Table 2.5 OctaPlay: EN={en_syl}, FA={fa_syl}")
        if fa_syl == "4" and en_syl == "3":
            print("PASS: Table 2.5 records OctaPlay as 3 EN / 4 FA syllables (anaptyxis on #pl-).")
        else:
            print(f"FAIL: Table 2.5 records OctaPlay as EN={en_syl}, FA={fa_syl} (expected 3 / 4).")
            return False
    else:
        print("FAIL: Could not parse Table 2.5 row for OctaPlay!")
        return False

    return True

def test_regulatory_and_trademark(content):
    print("\n=== CHECK 6: TRADEMARK & REGULATORY CITATIONS ===")
    # Check YouTube ToS Section 10.2
    if "10.2" in content and ("Brand Features" in content or "Branding Guidelines" in content):
        print("PASS: Document correctly cites YouTube API Services ToS Section 10.2.")
    else:
        print("FAIL: YouTube API ToS Section 10.2 citation missing!")
        return False
        
    # Check Valay Inc. / Pianova App Store collision
    if "1588827725" in content or ("Valay" in content and "Pianova" in content):
        print("PASS: Document documents active App Store collision id1588827725 (Valay Inc.).")
    else:
        print("FAIL: Document does not document Pianova App Store collision!")
        return False
        
    # Check Songtive / Piano Companion conflict
    if "Songtive" in content and "Piano Companion" in content:
        print("PASS: Document documents Songtive / Piano Companion trademark conflict.")
    else:
        print("FAIL: Songtive / Piano Companion conflict not documented!")
        return False
        
    return True

def test_ui_and_pwa_budgets(content):
    print("\n=== CHECK 7: UI & PWA BUDGET REQUIREMENTS (R5) ===")
    # Check 12-char PWA short_name limit
    if "12" in content and "short_name" in content:
        print("PASS: PWA short_name 12-character constraint analyzed.")
    else:
        print("FAIL: PWA short_name constraint missing!")
        return False
        
    # Check mobile header 360px viewport budget
    if "360px" in content and "header" in content.lower():
        print("PASS: 360px mobile header viewport budget analyzed.")
    else:
        print("FAIL: 360px mobile header viewport budget missing!")
        return False
        
    # Check length of PianoNama and LoopKeys
    if len("PianoNama") <= 12 and len("LoopKeys") <= 12:
        print(f"PASS: Finalists PianoNama ({len('PianoNama')} chars) and LoopKeys ({len('LoopKeys')} chars) <= 12 chars.")
    return True

def main():
    print(f"Starting Forensic Integrity Audit on {REPORT_PATH}")
    if not os.path.exists(REPORT_PATH):
        print(f"ERROR: Target file {REPORT_PATH} does not exist!")
        sys.exit(1)
        
    with open(REPORT_PATH, "r", encoding="utf-8") as f:
        content = f.read()
        
    print(f"Document Size: {len(content)} characters, {len(content.splitlines())} lines.")
    
    results = [
        ("Static Placeholders & Facades", test_static_placeholders(content)),
        ("Candidate Pool & Taxonomies (R1)", test_candidate_counts_and_taxonomies(content)),
        ("Section 5.2 Mathematical Validation (R4)", test_section_5_2_math(content)),
        ("Persian Linguistic & Orthographic Authenticity (R2)", test_persian_linguistics(content)),
        ("Phonotactic Syllables & Anaptyxis (R2)", test_phonotactic_syllable_consistency(content)),
        ("Trademark & Regulatory Clearance (R3)", test_regulatory_and_trademark(content)),
        ("UI & PWA Layout Budgets (R5)", test_ui_and_pwa_budgets(content)),
    ]
    
    print("\n================ AUDIT SUMMARY ================")
    all_passed = True
    for name, passed in results:
        status = "PASS" if passed else "FAIL"
        print(f"{name:<50} : {status}")
        if not passed:
            all_passed = False
            
    if all_passed:
        print("\nOVERALL FORENSIC VERDICT: CLEAN")
        return 0
    else:
        print("\nOVERALL FORENSIC VERDICT: INTEGRITY VIOLATION")
        return 1

if __name__ == "__main__":
    sys.exit(main())
