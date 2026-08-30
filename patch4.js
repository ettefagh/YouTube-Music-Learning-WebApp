const fs = require('fs');
const file = 'piano-companion/src/routes/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

const scriptSettings = `
  let showSettingsModal = $state(false);
  let requiresSettingsUnlock = $state(false);

  // Settings
  let currentThemeColor = $state('#f4f0ec');

  onMount(() => {
    const savedTheme = localStorage.getItem('themeColor');
    if (savedTheme) {
        currentThemeColor = savedTheme;
        document.body.style.backgroundColor = savedTheme;
    }
  });

  function openSettings() {
     if (!teacherAuth.isUnlocked) {
        requiresSettingsUnlock = true;
        showTeacherGate = true;
     } else {
        showSettingsModal = true;
     }
  }

  function applyTheme(color: string) {
      currentThemeColor = color;
      localStorage.setItem('themeColor', color);
      document.body.style.backgroundColor = color;
  }

  async function forceUpdateApp() {
      if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (let registration of registrations) {
              await registration.unregister();
          }
          window.location.reload();
      } else {
          window.location.reload();
      }
  }
`;

content = content.replace(
  `let showTeacherGate = $state<boolean>(false);`,
  `let showTeacherGate = $state<boolean>(false);\n${scriptSettings}`
);

// We need to modify the logic in onSuccess of TeacherGate
const newGateLogic = `
      onSuccess={() => {
        teacherAuth.unlock();
        showTeacherGate = false;
        if (requiresSettingsUnlock) {
            requiresSettingsUnlock = false;
            showSettingsModal = true;
        } else {
            startTeacherRecord();
        }
      }}
      onCancel={() => {
          showTeacherGate = false;
          requiresSettingsUnlock = false;
      }}
`;

content = content.replace(
  /onSuccess=\{\(\) => \{\s*teacherAuth\.unlock\(\);\s*showTeacherGate = false;\s*\}\}\s*onCancel=\{\(\) => showTeacherGate = false\}/,
  newGateLogic
);

// Add the settings button to the UI Header
const settingsButtonUI = `
  <div class="top-nav-bar">
    <button class="neo-btn outline settings-btn" onclick={openSettings}>⚙️ Settings</button>
  </div>

  <!-- Provider Selector -->
`;

content = content.replace(`<!-- Provider Selector`, settingsButtonUI);

// Add the Settings Modal UI
const settingsModalUI = `
  {#if showSettingsModal}
    <div class="modal-backdrop">
      <div class="modal-content neo-card">
        <h2>App Settings</h2>

        <div class="setting-row">
            <label>Theme Color:</label>
            <div class="theme-picker">
                <button class="color-btn" style="background: #f4f0ec" onclick={() => applyTheme('#f4f0ec')}></button>
                <button class="color-btn" style="background: #E8F5E9" onclick={() => applyTheme('#E8F5E9')}></button>
                <button class="color-btn" style="background: #E3F2FD" onclick={() => applyTheme('#E3F2FD')}></button>
                <button class="color-btn" style="background: #FCE4EC" onclick={() => applyTheme('#FCE4EC')}></button>
                <button class="color-btn" style="background: #FFF9C4" onclick={() => applyTheme('#FFF9C4')}></button>
            </div>
        </div>

        <div class="setting-row">
            <label>Force App Update (Clear Cache):</label>
            <button class="neo-btn primary" onclick={forceUpdateApp}>Refresh App Version</button>
        </div>

        <button class="neo-btn outline" onclick={() => showSettingsModal = false}>Close</button>
      </div>
    </div>
  {/if}
`;

content = content.replace(`{#if showTeacherGate}`, settingsModalUI + `\n  {#if showTeacherGate}`);

// Add some styles
const extraStyles = `
  .top-nav-bar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 16px;
  }
  .settings-btn {
      width: auto;
      margin-top: 0;
      padding: 8px 16px;
  }
  .modal-backdrop {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  .modal-content {
    background: white;
    padding: 24px;
    max-width: 400px;
    width: 90%;
    font-family: system-ui, sans-serif;
  }
  .setting-row {
      margin: 20px 0;
  }
  .setting-row label {
      display: block;
      font-weight: bold;
      margin-bottom: 8px;
  }
  .theme-picker {
      display: flex;
      gap: 12px;
  }
  .color-btn {
      width: 40px;
      height: 40px;
      border: 3px solid #000;
      border-radius: 50%;
      cursor: pointer;
  }
`;

content = content.replace(`/* Neo-brutalism Utilities */`, extraStyles + `\n  /* Neo-brutalism Utilities */`);

fs.writeFileSync(file, content);
