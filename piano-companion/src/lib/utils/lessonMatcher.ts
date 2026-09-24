import type { LocalLesson } from '../db/db';

/**
 * Normalizes a piece title across different educators and formatting conventions
 * (e.g., handles quotes, German articles, author attributions, parentheticals).
 */
export function normalizePieceTitle(raw: string): string {
  if (!raw) return '';
  let s = raw.trim();

  // 1. Extract title inside quotation marks if present (e.g. "\"Die Spieluhr\" aus der Klavierschule...")
  const quoteMatch = s.match(/["“»](.+?)["”«]/);
  if (quoteMatch) {
    s = quoteMatch[1];
  }

  // 2. Remove parentheticals (e.g. "(Bells)", "(vierhändig)", "(Primo)", "(Secondo Stimme zum Mitspielen)")
  s = s.replace(/\s*\([^)]*\)\s*/g, ' ');

  // 3. Remove common pedagogical book boilerplate
  s = s.replace(/aus der Klavierschule.*/i, '');
  s = s.replace(/aus der ["“»]?Tastenzauberei["”«]?.*/i, '');
  s = s.replace(/von Anik[oó] Drabon.*/i, '');

  // 4. Strip remaining quotation characters
  s = s.replace(/["'“”«»]/g, '');

  // 5. Clean punctuation and excess whitespace to lowercase
  return s
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Clean title without leading German articles for robust fuzzy comparisons.
 */
function stripArticles(normTitle: string): string {
  return normTitle.replace(/^(der|die|das|ein|eine|einen|einem|einer)\s+/, '');
}

/**
 * Finds the corresponding lesson from a given provider's lesson list for a target piece.
 * Returns null if the provider does not have a video for this piece.
 */
export function findMatchingLesson(
  providerLessons: LocalLesson[],
  target: LocalLesson | null
): LocalLesson | null {
  if (!target || !providerLessons || providerLessons.length === 0) return null;

  // 1. Direct ID match
  const directMatch = providerLessons.find(l => l.id === target.id);
  if (directMatch && directMatch.youtubeVideoId) return directMatch;

  const targetNorm = normalizePieceTitle(target.title);
  const targetClean = stripArticles(targetNorm);

  // 2. Normalized title exact and clean match (preferred across educators)
  for (const l of providerLessons) {
    if (l.bookId && target.bookId && l.bookId !== target.bookId) continue;
    if (!l.youtubeVideoId) continue;

    const lNorm = normalizePieceTitle(l.title);
    const lClean = stripArticles(lNorm);

    if (lNorm && targetNorm && (lNorm === targetNorm || lClean === targetClean)) {
      return l;
    }

    // Substring match for compound / composite titles (minimum length 5 to avoid false positives)
    if (lClean.length >= 5 && targetClean.length >= 5) {
      if (lClean.includes(targetClean) || targetClean.includes(lClean)) {
        return l;
      }
    }
  }

  // 3. Exact sequenceIndex match if piece is from the same book and titles are not conflicting
  if (target.sequenceIndex && target.bookId) {
    const seqMatch = providerLessons.find(
      l => l.bookId === target.bookId && l.sequenceIndex === target.sequenceIndex && l.youtubeVideoId
    );
    if (seqMatch) {
      const sNorm = normalizePieceTitle(seqMatch.title);
      // Ensure the titles don't contradict each other (e.g. avoid matching "Im Regen" with "Die Spieluhr")
      if (
        !sNorm ||
        !targetNorm ||
        sNorm === targetNorm ||
        sNorm.includes(targetNorm) ||
        targetNorm.includes(sNorm)
      ) {
        return seqMatch;
      }
    }
  }

  return null;
}

/**
 * Filters the list of providers down to only those who actually have a video lesson
 * matching the given target piece in the book.
 */
export function getProvidersForLesson(
  allProviders: string[],
  allLessons: LocalLesson[],
  targetLesson: LocalLesson | null
): string[] {
  if (!targetLesson) return [];

  const matchedProviders: string[] = [];

  for (const pName of allProviders) {
    const pLessons = allLessons.filter(l => l.providerName === pName);
    const matched = findMatchingLesson(pLessons, targetLesson);
    if (matched && matched.youtubeVideoId) {
      matchedProviders.push(pName);
    }
  }

  // Ensure currentLesson's own provider is in the list if it has a video
  if (targetLesson.providerName && targetLesson.youtubeVideoId && !matchedProviders.includes(targetLesson.providerName)) {
    matchedProviders.unshift(targetLesson.providerName);
  }

  return matchedProviders;
}
