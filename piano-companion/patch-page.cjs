const fs = require('fs');
const file = 'src/routes/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove stray text
content = content.replace(/<!-- Provider Selector \(Lower visual hierarchy, placed above main header\) -->/g, '');

// 2. Add new states and settings logic
const newStates = `
  import { onMount } from 'svelte';
  import { db, initDatabase, type LocalLesson, type LocalAudioTrack, type LocalBook } from '$lib/db/db';

  let books = $state<LocalBook[]>([]);
  let selectedBookId = $state<string>('');

  let hideAudioTakes = $state<boolean>(false);
  let pendingTeacherAction = $state<'edit' | 'record' | null>(null);
`;

content = content.replace(
  /import \{ onMount \} from 'svelte';\s*import \{ db, initDatabase, type LocalLesson, type LocalAudioTrack \} from '\$lib\/db\/db';/,
  newStates
);

// Load books and set initial config
const loadLogic = `
  onMount(async () => {
    await initDatabase();
    books = await db.books.toArray();
    if (books.length > 0) {
        selectedBookId = books[0].id;
    }

    const savedHideTakes = localStorage.getItem('hideAudioTakes');
    if (savedHideTakes !== null) {
        hideAudioTakes = savedHideTakes === 'true';
    }

    await loadDataForSelectedBook();
  });

  async function loadDataForSelectedBook() {
    allLessons = await db.lessons.where('bookId').equals(selectedBookId).sortBy('sequenceIndex');

    // Extract unique providers for this book
    const uniqueProviders = new Set(allLessons.map(l => l.providerName));
    providers = Array.from(uniqueProviders);

    if (providers.length > 0) {
      selectProvider(providers[0]);
    } else {
        lessons = [];
        currentLesson = null;
    }
  }

  $effect(() => {
     if (selectedBookId) {
         loadDataForSelectedBook();
     }
  });

  function toggleCompletion() {
      if (currentLesson) {
          currentLesson.isCompleted = !currentLesson.isCompleted;
          db.lessons.put($state.snapshot(currentLesson));
      }
  }
`;

content = content.replace(
  /onMount\(async \(\) => \{\s*await initDatabase\(\);\s*allLessons = await db.lessons.orderBy\('sequenceIndex'\).toArray\(\);[\s\S]*?if \(providers.length > 0\) \{\s*selectProvider\(providers\[0\]\);\s*\}\s*\}\);/,
  loadLogic
);

// Modify Teacher Auth logic to route actions properly
content = content.replace(
  /function handleEditCheckpoints\(\) \{[\s\S]*?editCheckpointsText = currentLesson\?.checkpoints.join\('\\n'\) \|\| '';\s*\}\s*\}/,
  `function handleEditCheckpoints() {
      if (!teacherAuth.isUnlocked) {
          pendingTeacherAction = 'edit';
          showTeacherGate = true;
      } else {
          isEditingCheckpoints = true;
          editCheckpointsText = currentLesson?.checkpoints.join('\\n') || '';
      }
  }`
);

content = content.replace(
  /function handleTeacherRecord\(\) \{[\s\S]*?startTeacherRecord\(\);\s*\}\s*\}/,
  `function handleTeacherRecord() {
    if (!teacherAuth.isUnlocked) {
      pendingTeacherAction = 'record';
      showTeacherGate = true;
    } else {
      startTeacherRecord();
    }
  }`
);

const newGateLogic = `
      onSuccess={() => {
        teacherAuth.unlock();
        showTeacherGate = false;

        if (pendingTeacherAction === 'edit') {
            isEditingCheckpoints = true;
            editCheckpointsText = currentLesson?.checkpoints.join('\\n') || '';
        } else if (pendingTeacherAction === 'record') {
            startTeacherRecord();
        }
        pendingTeacherAction = null;
      }}
      onCancel={() => {
          showTeacherGate = false;
          pendingTeacherAction = null;
      }}
`;

content = content.replace(
  /onSuccess=\{\(\) => \{[\s\S]*?\}\}\s*onCancel=\{\(\) => \{[\s\S]*?\}\}/,
  newGateLogic
);

// Progress Bar Black Background
content = content.replace(
    /background: #E0E0E0;/g,
    `background: #212121;` // make progress bar bg darker to match iframe
);

// Audio Studio Wrapper
content = content.replace(
    /<section class="audio-studio">/,
    `{#if !hideAudioTakes}\n      <section class="audio-studio">`
);
content = content.replace(
    /<\/section>\s*<!-- Checkpoints -->/,
    `</section>\n      {/if}\n\n      <!-- Checkpoints -->`
);

// Settings UI enhancements
const settingsEnhancements = `
        <div class="setting-row">
            <span class="label">Select Book:</span>
            <select bind:value={selectedBookId} class="neo-select">
                {#each books as book}
                    <option value={book.id}>{book.title}</option>
                {/each}
            </select>
        </div>

        <div class="setting-row">
            <span class="label">Hide Audio Takes:</span>
            <button
                class="neo-btn {hideAudioTakes ? 'primary' : 'outline'}"
                onclick={() => { hideAudioTakes = !hideAudioTakes; localStorage.setItem('hideAudioTakes', hideAudioTakes.toString()); }}
            >
                {hideAudioTakes ? 'Hidden' : 'Visible'}
            </button>
        </div>

        <div class="setting-row">
            <span class="label">Contact Curator:</span>
            <p style="font-size: 0.85rem; margin-top: 4px;">Got a bug or a feature request?</p>
            <a href="https://github.com/google-labs/piano-practice-companion/issues/new" target="_blank" class="neo-btn outline" style="display: block; text-align: center; text-decoration: none;">
                Submit to GitHub
            </a>
        </div>
`;

content = content.replace(
    /<div class="setting-row">\s*<span class="label">Theme Color:<\/span>/,
    `${settingsEnhancements}\n        <div class="setting-row">\n            <span class="label">Theme Color:</span>`
);

// Add Checkbox for completion
const checkboxUI = `
          <h1 class="lesson-title">
             <input type="checkbox" class="completion-box" checked={currentLesson?.isCompleted} onclick={toggleCompletion} title="Mark as completed" />
             {currentLesson ? currentLesson.title : 'Loading...'}
          </h1>
`;
content = content.replace(
    /<h1 class="lesson-title">\{currentLesson \? currentLesson.title : 'Loading\.\.\.'\}<\/h1>/,
    checkboxUI
);

// Additional styles
const moreStyles = `
  .neo-select {
      width: 100%;
      padding: 10px;
      font-size: 1rem;
      border: 3px solid #000;
      border-radius: 8px;
      margin-top: 8px;
      background: white;
  }
  .completion-box {
      width: 24px;
      height: 24px;
      cursor: pointer;
      accent-color: #4CAF50;
      vertical-align: middle;
      margin-right: 8px;
  }
`;

content = content.replace(
    /\/\* Neo-brutalism Utilities \*\//,
    moreStyles + `\n  /* Neo-brutalism Utilities */`
);

fs.writeFileSync(file, content);
console.log('UI refactored successfully.');
