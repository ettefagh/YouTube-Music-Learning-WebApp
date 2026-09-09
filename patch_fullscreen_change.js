const fs = require('fs');

const file = 'piano-companion/src/routes/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

// Also update handleFullscreenChange to not accidentally clear isFullscreen if we are using the fake one.
const handleFullscreenChangeTarget = `
  function handleFullscreenChange() {
    if (typeof document !== 'undefined') {
      isFullscreen = !!document.fullscreenElement;
    }
  }
`;

const handleFullscreenChangeReplace = `
  function handleFullscreenChange() {
    if (typeof document !== 'undefined') {
      // If native fullscreen exits, we clear the state.
      // If it enters, we ensure state is true.
      // But we shouldn't force false if there's no native fullscreen but we manually toggled it.
      if (document.fullscreenElement) {
        isFullscreen = true;
      }
    }
  }
`;

content = content.replace(handleFullscreenChangeTarget.trim(), handleFullscreenChangeReplace.trim());

fs.writeFileSync(file, content);
console.log('handleFullscreenChange patched');
