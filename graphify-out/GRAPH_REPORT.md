# Graph Report - eager-newton  (2026-09-05)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 352 nodes · 273 edges · 96 communities (16 shown, 42 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 1,802 input · 907 output

## Graph Freshness
- Built from commit: `9c471477`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SvelteComponents
- AppPages
- BuildScripts
- TimeUtils
- EducatorPages
- Database
- KidsComponents
- YouTubePlayer
- TrademarkAudit
- TypeScriptConfig
- ChapterSeeds
- HTMLParser
- LongPressHandler
- TeacherAuth
- HTMLParser
- LinguisticVerification
- AudioRecorder
- PagePatches
- UIRefactor
- SeedGenerator
- DarkMode
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- PagePatches
- FetchInvidious
- HTMLParser
- HTMLParser
- HTMLParser
- HTMLParser
- PagePatches
- PagePatches
- LinguisticVerification
- FetchPlaylist
- MakePNGs
- App
- TestYT
- TestYT
- TestYT
- TestYT

## God Nodes (most connected - your core abstractions)
1. `scripts` - 8 edges
2. `TeacherAuthStore` - 5 edges
3. `AudioRecorderEngine` - 5 edges
4. `longpress()` - 5 edges
5. `youtubeLooper()` - 5 edges
6. `initPlayer()` - 4 edges
7. `compilerOptions` - 4 edges
8. `timeToSeconds()` - 3 edges
9. `startLoopWatcher()` - 3 edges
10. `stopLoopWatcher()` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (96 total, 42 thin omitted)

### Community 0 - "SvelteComponents"
Cohesion: 0.10
Nodes (21): devDependencies, playwright, svelte, svelte-check, @sveltejs/adapter-cloudflare, @sveltejs/kit, @sveltejs/vite-plugin-svelte, @types/youtube (+13 more)

### Community 2 - "BuildScripts"
Cohesion: 0.11
Nodes (17): dexie, dependencies, dexie, imports, #lib, name, private, scripts (+9 more)

### Community 3 - "TimeUtils"
Cohesion: 0.12
Nodes (17): allLessons, books, fs, seenTz1, seenTz2, timeToSeconds(), tz1ChapterMapped, tz1Chapters (+9 more)

### Community 4 - "EducatorPages"
Cohesion: 0.14
Nodes (8): EducatorChannelInfo, KNOWN_EDUCATORS, ActiveScreen, DEFAULT_STUDENT_PROFILES, KID_AVATARS, KidAvatarKey, KidAvatarOption, StudentProfile

### Community 5 - "Database"
Cohesion: 0.21
Nodes (8): db, LessonListType, LocalAudioTrack, LocalBook, LocalLesson, PianoDatabase, SEED_BOOKS, SEED_LESSONS

### Community 6 - "KidsComponents"
Cohesion: 0.20
Nodes (4): newName, showAddModal, isMastered, totalCount

### Community 7 - "YouTubePlayer"
Cohesion: 0.33
Nodes (8): LooperOptions, Window, youtubeLooper(), initPlayer(), loadYouTubeAPI(), startLoopWatcher(), stopLoopWatcher(), YouTubePlayerController

### Community 8 - "TrademarkAudit"
Cohesion: 0.22
Nodes (8): CANDIDATES, evaluated, fs, path, policyViolations, RULES, SCORECARD, TOP_3

### Community 9 - "TypeScriptConfig"
Cohesion: 0.22
Nodes (8): compilerOptions, rewriteRelativeImportExtensions, sourceMap, strict, extends, include, $app/tsconfig, src

### Community 10 - "ChapterSeeds"
Cohesion: 0.29
Nodes (7): extracted, fs, lessons, seedData, seenTitles, timeToSeconds(), uniqueChapters

### Community 11 - "HTMLParser"
Cohesion: 0.29
Nodes (5): data, items, seenIds, uniqueVideos, videos

### Community 12 - "LongPressHandler"
Cohesion: 0.33
Nodes (4): longpress(), clearTimer(), onPointerMove(), LongPressOptions

### Community 14 - "HTMLParser"
Cohesion: 0.33
Nodes (4): data, items, seenIds, uniqueVideos

### Community 17 - "PagePatches"
Cohesion: 0.50
Nodes (3): appHtml, code, fs

### Community 18 - "UIRefactor"
Cohesion: 0.50
Nodes (3): code, fs, mascotCode

### Community 19 - "SeedGenerator"
Cohesion: 0.50
Nodes (3): extracted, fs, vikaLessons

## Knowledge Gaps
- **160 isolated node(s):** `LongPressOptions`, `EducatorChannelInfo`, `ActiveScreen`, `KidAvatarKey`, `KidAvatarOption` (+155 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 254 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `SvelteComponents` to `BuildScripts`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `longpress()` (e.g. with `clearTimer()` and `onClick()`) actually correct?**
  _`longpress()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `LongPressOptions`, `EducatorChannelInfo`, `ActiveScreen` to the rest of the system?**
  _160 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SvelteComponents` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `AppPages` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `BuildScripts` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `TimeUtils` be split into smaller, more focused modules?**
  _Cohesion score 0.12418300653594772 - nodes in this community are weakly interconnected._