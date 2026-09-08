const fs = require('fs');
const file = 'piano-companion/src/routes/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

// Remove the obsolete malformed text comment
content = content.replace(`<!-- Provider Selector (Lower visual hierarchy, placed above main header) -->`, `<!-- Provider Selector -->`);

// Remove the old provider tabs since the UI handles them dynamically in the list now
const providerTabsRegex = /<!-- Player Mode Selector Tabs -->[\s\S]*?<\/div>\s*<!-- Video Player Cockpit/;
content = content.replace(providerTabsRegex, '<!-- Video Player Cockpit');

// Also remove {#key providerMode} since we don't switch players anymore
content = content.replace(/{#key providerMode}/g, '');
content = content.replace(/{\/key}\s*<!-- Dual Audio Studio -->/, '<!-- Dual Audio Studio -->');

// Simplify action parameters in `use:youtubeLooper`
content = content.replace(
    /playlistId: providerMode === 'playlist' \? \(\(\) => playlistId\) : undefined,/,
    ''
);
content = content.replace(
    /videoId: providerMode === 'video' \? \(\(\) => currentLesson!\.youtubeVideoId\) : undefined,/,
    `videoId: () => currentLesson!.youtubeVideoId,`
);
content = content.replace(
    /endTime: providerMode === 'video' \? \(\(\) => currentLesson!\.endTime\) : \(\(\) => 0\), \/\/ Loop full track on playlist/,
    `endTime: () => currentLesson!.endTime,`
);

// Add 0.5x speed toggle button
content = content.replace(
    `<button class="control-btn {playbackRate === 0.75 ? 'active' : ''}" onclick={() => playbackRate = 0.75}>0.75x</button>`,
    `<button class="control-btn {playbackRate === 0.5 ? 'active' : ''}" onclick={() => playbackRate = 0.5}>0.5x</button>\n              <button class="control-btn {playbackRate === 0.75 ? 'active' : ''}" onclick={() => playbackRate = 0.75}>0.75x</button>`
);

// Move Settings to Footer
content = content.replace(
    `<div class="top-nav-bar">\n    <button class="neo-btn outline settings-btn" onclick={openSettings}>⚙️ Settings</button>\n  </div>`,
    ``
);

// Add edit mode states
const editModeStates = `
  let isEditingCheckpoints = $state(false);
  let editCheckpointsText = $state('');

  function handleEditCheckpoints() {
      if (!teacherAuth.isUnlocked) {
          showTeacherGate = true;
          // After unlock, the UI naturally reflects unlocked state, we just need to re-click or we can auto-trigger
      } else {
          isEditingCheckpoints = true;
          editCheckpointsText = currentLesson?.checkpoints.join('\\n') || '';
      }
  }

  async function saveCheckpoints() {
      if (currentLesson) {
          currentLesson.checkpoints = editCheckpointsText.split('\\n').filter(c => c.trim().length > 0);
          await db.lessons.put($state.snapshot(currentLesson));
          isEditingCheckpoints = false;
      }
  }
`;

content = content.replace(
  `let showSettingsModal = $state(false);`,
  `let showSettingsModal = $state(false);\n${editModeStates}`
);

// Add Edit Button & Logic to Checkpoints section
const checkpointsUI = `
      <!-- Checkpoints -->
      <section class="checkpoints neo-card highlight">
        <div class="checkpoints-header">
            <h3>🎯 Learning Points</h3>
            {#if !isEditingCheckpoints}
                <button class="neo-btn outline small-btn" onclick={handleEditCheckpoints}>
                    {teacherAuth.isUnlocked ? '✏️ Edit' : '🔒 Edit'}
                </button>
            {/if}
        </div>
        {#if isEditingCheckpoints}
            <textarea bind:value={editCheckpointsText} class="neo-textarea" rows="4"></textarea>
            <div class="edit-actions">
                <button class="neo-btn primary small-btn" onclick={saveCheckpoints}>Save</button>
                <button class="neo-btn outline small-btn" onclick={() => isEditingCheckpoints = false}>Cancel</button>
            </div>
        {:else}
            <ul>
              {#each currentLesson.checkpoints as pt}
                <li>{pt}</li>
              {/each}
            </ul>
        {/if}
      </section>
`;

content = content.replace(
  /<!-- Checkpoints -->[\s\S]*?<\/section>/,
  checkpointsUI
);

// Append footer settings
const footerUI = `
  <footer class="neo-footer">
      <button class="neo-btn outline settings-btn" onclick={openSettings}>⚙️ Settings</button>
  </footer>
`;

content = content.replace(
  `{#if showSettingsModal}`,
  `${footerUI}\n  {#if showSettingsModal}`
);

// Add CSS for new elements
const extraCSS = `
  .checkpoints-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
  }
  .checkpoints-header h3 { margin: 0; }
  .small-btn {
      width: auto;
      margin-top: 0;
      padding: 6px 12px;
      font-size: 0.85rem;
  }
  .neo-textarea {
      width: 100%;
      border: 3px solid #000;
      border-radius: 8px;
      padding: 12px;
      font-family: inherit;
      font-size: 1rem;
      resize: vertical;
      box-sizing: border-box;
  }
  .edit-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 8px;
  }
  .neo-footer {
      margin-top: 32px;
      text-align: center;
      border-top: 4px solid #000;
      padding-top: 24px;
  }
`;

content = content.replace(
  `/* Neo-brutalism Utilities */`,
  extraCSS + `\n  /* Neo-brutalism Utilities */`
);

fs.writeFileSync(file, content);
