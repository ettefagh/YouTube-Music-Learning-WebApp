const fs = require('fs');

const path = 'piano-companion/src/lib/components/screens/LibraryScreen.svelte';
let content = fs.readFileSync(path, 'utf8');

// Import JourneyMapScreen
content = content.replace(
  "import { getEducatorInfo } from '#lib/types/educator.js';",
  "import { getEducatorInfo } from '#lib/types/educator.js';\n  import JourneyMapScreen from '../journey/JourneyMapScreen.svelte';"
);

// Add viewMode state
content = content.replace(
  "let lessonSearch = $state<string>('');",
  "let lessonSearch = $state<string>('');\n  \n  let viewMode = $state<'journey' | 'list'>(typeof window !== 'undefined' ? (localStorage.getItem('journey_view_mode') as 'journey' | 'list') || 'journey' : 'journey');\n  \n  function setViewMode(mode: 'journey' | 'list') {\n    viewMode = mode;\n    if (typeof window !== 'undefined') {\n        localStorage.setItem('journey_view_mode', mode);\n    }\n  }"
);

// Add view mode capsule in the header, above Tier 1
content = content.replace(
  '  <!-- Tier 1: Active Piano Book Shelf Card -->',
  `
  <!-- View Mode Switcher -->
  <div class="flex justify-center mb-6">
    <div class="bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-full flex gap-1 w-fit border border-slate-200 dark:border-slate-700/50">
      <button
        class="px-5 py-2 rounded-full font-bold text-sm transition-all {viewMode === 'journey' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}"
        onclick={() => setViewMode('journey')}
      >
        🗺️ Adventure Map
      </button>
      <button
        class="px-5 py-2 rounded-full font-bold text-sm transition-all {viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}"
        onclick={() => setViewMode('list')}
      >
        📑 Book Index
      </button>
    </div>
  </div>

  {#if viewMode === 'journey'}
    <div class="flex-1 w-full relative">
        <JourneyMapScreen
            {lessons}
            currentBookId={selectedBookId}
            activeLessonId={lastPracticedLesson?.id}
            onLessonSelect={onSelectLesson}
        />
    </div>
  {:else}
  <!-- Tier 1: Active Piano Book Shelf Card -->`
);


// Find end of main content (before Book Picker Modal) to close the #if
content = content.replace(
  '<!-- Book Picker Modal (When "Change Book" is tapped) -->',
  `  {/if}\n\n<!-- Book Picker Modal (When "Change Book" is tapped) -->`
);

fs.writeFileSync(path, content);
