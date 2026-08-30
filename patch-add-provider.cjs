const fs = require('fs');
const file = 'piano-companion/src/routes/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

// --- 1. State for Custom Provider Form & Default Provider ---
const providerStates = `
  // Default Provider Setting
  let defaultProvider = $state<string>('');

  // Add Provider States
  let showAddProviderModal = $state(false);
  let newProviderName = $state('');
  let newProviderType = $state<'list' | 'playlist' | 'chapters'>('list');
  let newProviderInput = $state('');
  let isAddingProvider = $state(false);
  let addProviderError = $state('');

  onMount(() => {
    const savedDefault = localStorage.getItem('defaultProvider');
    if (savedDefault) {
        defaultProvider = savedDefault;
    }
  });

  async function handleAddProvider() {
      isAddingProvider = true;
      addProviderError = '';

      if (!newProviderName.trim() || !newProviderInput.trim() || !selectedBookId) {
          addProviderError = 'Please fill out all fields.';
          isAddingProvider = false;
          return;
      }

      try {
          const newLessons: LocalLesson[] = [];
          const baseLessonParams = {
              bookId: selectedBookId,
              providerName: newProviderName,
              startTime: 0,
              endTime: 0,
              checkpoints: ['User generated content'],
              isCompleted: false
          };

          if (newProviderType === 'list') {
              const ids = newProviderInput.split('\\n').map(id => id.trim()).filter(id => id);
              ids.forEach((videoId, index) => {
                  newLessons.push({
                      ...baseLessonParams,
                      id: crypto.randomUUID(),
                      title: \`Custom Track \${index + 1}\`,
                      sequenceIndex: index + 1,
                      youtubeVideoId: videoId
                  });
              });
          } else if (newProviderType === 'playlist') {
              const res = await fetch(\`https://inv.nadeko.net/api/v1/playlists/\${newProviderInput.trim()}\`);
              if (!res.ok) throw new Error('Failed to fetch playlist.');
              const data = await res.json();
              if (!data.videos) throw new Error('Playlist has no videos.');
              data.videos.forEach((v: any, index: number) => {
                  newLessons.push({
                      ...baseLessonParams,
                      id: crypto.randomUUID(),
                      title: v.title,
                      sequenceIndex: index + 1,
                      youtubeVideoId: v.videoId
                  });
              });
          } else if (newProviderType === 'chapters') {
              // Expecting format: VIDEO_ID \n 00:00 Chapter 1 \n 01:20 Chapter 2
              const lines = newProviderInput.split('\\n').map(l => l.trim()).filter(l => l);
              const videoId = lines[0];
              const chapterLines = lines.slice(1);

              const timeToSeconds = (timeStr: string) => {
                  const parts = timeStr.split(':').map(Number);
                  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
                  return parts[0] * 60 + parts[1];
              };

              const parsedChapters = [];
              const regex = /(\\d+:\\d{2}(?::\\d{2})?)\\s+(.*)/;
              for (const line of chapterLines) {
                  const match = regex.exec(line);
                  if (match) {
                      parsedChapters.push({ time: match[1], title: match[2].trim() });
                  }
              }

              parsedChapters.forEach((ch, index) => {
                  const startTime = timeToSeconds(ch.time);
                  const nextCh = parsedChapters[index + 1];
                  const endTime = nextCh ? timeToSeconds(nextCh.time) : startTime + 120;
                  newLessons.push({
                      ...baseLessonParams,
                      id: crypto.randomUUID(),
                      title: ch.title,
                      sequenceIndex: index + 1,
                      youtubeVideoId: videoId,
                      startTime,
                      endTime
                  });
              });
          }

          if (newLessons.length > 0) {
              await db.lessons.bulkPut(newLessons);
              showAddProviderModal = false;
              newProviderName = '';
              newProviderInput = '';
              await loadDataForSelectedBook();
              selectProvider(newLessons[0].providerName);
          } else {
              addProviderError = 'No valid tracks could be generated.';
          }
      } catch (err: any) {
          addProviderError = err.message || 'An error occurred parsing input.';
      }
      isAddingProvider = false;
  }
`;

content = content.replace(
  `let pendingTeacherAction = $state<'edit' | 'record' | null>(null);`,
  `let pendingTeacherAction = $state<'edit' | 'record' | null>(null);\n${providerStates}`
);

// --- 2. Update Default Provider Logic ---
const loadLogicUpdate = `
    const uniqueProviders = new Set(allLessons.map(l => l.providerName));
    providers = Array.from(uniqueProviders);

    if (providers.length > 0) {
      if (providers.includes(defaultProvider)) {
          selectProvider(defaultProvider);
      } else {
          selectProvider(providers[0]);
      }
    } else {
`;

content = content.replace(
  /const uniqueProviders = new Set\(allLessons.map\(l => l.providerName\)\);\s*providers = Array.from\(uniqueProviders\);\s*if \(providers.length > 0\) \{\s*selectProvider\(providers\[0\]\);\s*\} else \{/,
  loadLogicUpdate
);

// --- 3. UI for Add Provider and Default Provider Settings ---
const newSettingsUI = `
        <div class="setting-row">
            <span class="label">Default Provider:</span>
            <select bind:value={defaultProvider} class="neo-select" onchange={() => localStorage.setItem('defaultProvider', defaultProvider)}>
                <option value="">(None)</option>
                {#each providers as provider}
                    <option value={provider}>{provider}</option>
                {/each}
            </select>
        </div>

        <div class="setting-row">
            <span class="label">Add Custom Provider:</span>
            <button class="neo-btn outline" onclick={() => showAddProviderModal = true}>➕ Add New Source</button>
        </div>
`;

content = content.replace(
    /<div class="setting-row">\s*<span class="label">Hide Audio Takes:<\/span>/,
    `${newSettingsUI}\n        <div class="setting-row">\n            <span class="label">Hide Audio Takes:</span>`
);

const addProviderModalUI = `
  {#if showAddProviderModal}
    <div class="modal-backdrop">
      <div class="modal-content neo-card">
        <h2>Add Custom Provider</h2>

        <div class="setting-row">
            <span class="label">Provider Name:</span>
            <input type="text" bind:value={newProviderName} class="neo-input" placeholder="e.g. My Piano Teacher" />
        </div>

        <div class="setting-row">
            <span class="label">Source Type:</span>
            <select bind:value={newProviderType} class="neo-select">
                <option value="list">List of Video IDs</option>
                <option value="playlist">YouTube Playlist ID</option>
                <option value="chapters">Bookmarked Video (Chapters)</option>
            </select>
        </div>

        <div class="setting-row">
            <span class="label">Source Input:</span>
            {#if newProviderType === 'list'}
                <p class="help-text">Enter one YouTube Video ID per line.</p>
            {:else if newProviderType === 'playlist'}
                <p class="help-text">Enter the YouTube Playlist ID (e.g. PL10p3mlGiAN...).</p>
            {:else if newProviderType === 'chapters'}
                <p class="help-text">First line: Video ID.<br/>Next lines: "MM:SS Chapter Title".</p>
            {/if}
            <textarea bind:value={newProviderInput} class="neo-textarea" rows="5"></textarea>
        </div>

        {#if addProviderError}
            <p class="error">{addProviderError}</p>
        {/if}

        <div class="edit-actions">
            <button class="neo-btn primary small-btn" onclick={handleAddProvider} disabled={isAddingProvider}>
                {isAddingProvider ? 'Adding...' : 'Add Provider'}
            </button>
            <button class="neo-btn outline small-btn" onclick={() => showAddProviderModal = false}>Cancel</button>
        </div>
      </div>
    </div>
  {/if}
`;

content = content.replace(
  `{#if showSettingsModal}`,
  `${addProviderModalUI}\n  {#if showSettingsModal}`
);

const additionalStyles = `
  .neo-input {
      width: 100%;
      padding: 10px;
      font-size: 1rem;
      border: 3px solid #000;
      border-radius: 8px;
      margin-top: 8px;
      box-sizing: border-box;
  }
  .help-text {
      font-size: 0.85rem;
      color: #666;
      margin: 4px 0 8px 0;
  }
`;

content = content.replace(
  `/* Neo-brutalism Utilities */`,
  additionalStyles + `\n  /* Neo-brutalism Utilities */`
);

fs.writeFileSync(file, content);
