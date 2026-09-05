"""
Sonority Dispersion, Phonetic Metric & Slang Collision Verification
"""

import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Sonority Scale (Clements 1990, Parker 2002)
# Plosives (1) < Affricates (2) < Fricatives (3) < Nasals (4) < Liquids (5) < Glides (6) < Vowels (7)
SONORITY = {
    'p': 1, 't': 1, 'k': 1, 'b': 1, 'd': 1, 'g': 1, 'ʔ': 1,
    'tʃ': 2, 'dʒ': 2,
    'f': 3, 'v': 3, 's': 3, 'z': 3, 'ʃ': 3, 'ʒ': 3, 'x': 3, 'h': 3,
    'm': 4, 'n': 4,
    'l': 5, 'r': 5, 'ɾ': 5,
    'j': 6, 'w': 6,
    'i': 7, 'e': 7, 'æ': 7, 'a': 7, 'u': 7, 'o': 7, 'ɒ': 7, 'ə': 7, 'ɪ': 7, 'ʊ': 7
}

FINALISTS_PHONETICS = {
    "PianoNama": {
        "fa_transcription": ["pi", "jɒː", "no", "næ", "mɒː"],
        "en_transcription": ["pi", "æn", "oʊ", "nɑː", "mə"],
        "fa_syllable_shapes": ["CV", "CV", "CV", "CV", "CV"],
        "initial_clusters": False,
        "coda_clusters": False,
        "epenthesis_required": False
    },
    "Pianova": {
        "fa_transcription": ["pi", "jɒː", "no", "vɒː"],
        "en_transcription": ["pi", "æn", "oʊ", "və"],
        "fa_syllable_shapes": ["CV", "CV", "CV", "CV"],
        "initial_clusters": False,
        "coda_clusters": False,
        "epenthesis_required": False
    },
    "LoopKeys": {
        "fa_transcription": ["lup", "kiz"],
        "en_transcription": ["luːp", "kiːz"],
        "fa_syllable_shapes": ["CVC", "CVC"],
        "initial_clusters": False,
        "coda_clusters": False,
        "epenthesis_required": False
    },
    "KeyToon": {
        "fa_transcription": ["ki", "tun"],
        "en_transcription": ["kiː", "tuːn"],
        "fa_syllable_shapes": ["CV", "CVC"],
        "initial_clusters": False,
        "coda_clusters": False,
        "epenthesis_required": False
    },
    "OctaPlay": {
        "fa_transcription": ["ʔok", "tɒː", "pe", "ley"],
        "en_transcription": ["ɒk", "tə", "pleɪ"],
        "fa_syllable_shapes": ["CVC", "CV", "CV", "CVC"],
        "initial_clusters": True,  # English has #pl-
        "coda_clusters": False,
        "epenthesis_required": True # Persian requires /pe.ley/
    },
    "PianoStream": {
        "fa_transcription": ["pi", "jɒː", "no", "ʔes", "te", "riːm"],
        "en_transcription": ["pi", "æn", "oʊ", "striːm"],
        "fa_syllable_shapes": ["CV", "CV", "CV", "CVC", "CV", "CVCC"],
        "initial_clusters": True,  # English has #str-
        "coda_clusters": True,
        "epenthesis_required": True # Persian requires /ʔes.te.riːm/
    }
}

def analyze_finalists():
    print("=== FINALIST PHONETIC & PHONOTACTIC PROFILE ===")
    for name, data in FINALISTS_PHONETICS.items():
        fa_syls = len(data["fa_transcription"])
        en_syls = len(data["en_transcription"])
        print(f"\nCandidate: {name}")
        print(f"  English Syllables ({en_syls}): {' - '.join(data['en_transcription'])}")
        print(f"  Persian Syllables ({fa_syls}): {' - '.join(data['fa_transcription'])}")
        print(f"  Persian Syllable Shapes: {' - '.join(data['fa_syllable_shapes'])}")
        print(f"  Epenthesis Required in Persian: {data['epenthesis_required']}")
        if data["initial_clusters"]:
            print(f"  WARNING: Initial consonant cluster detected! Causes Persian syllable inflation.")

if __name__ == "__main__":
    analyze_finalists()
