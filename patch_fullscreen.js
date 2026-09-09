const fs = require('fs');

const file = 'piano-companion/src/routes/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

const toggleFullscreenTarget = `
  function toggleFullscreen() {
    if (!playerCardElement) return;
    if (!document.fullscreenElement) {
      if (playerCardElement.requestFullscreen) {
        playerCardElement.requestFullscreen().catch(err => console.warn('Fullscreen error:', err));
      } else if ((playerCardElement as any).webkitRequestFullscreen) {
        (playerCardElement as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.warn('Exit fullscreen error:', err));
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  }
`;

const toggleFullscreenReplace = `
  function toggleFullscreen() {
    if (!playerCardElement) return;

    // We try native fullscreen first, but always toggle the state variable
    // to allow our CSS "fake fullscreen" to kick in for mobile browsers (like iOS Safari).
    isFullscreen = !isFullscreen;

    if (isFullscreen) {
      if (playerCardElement.requestFullscreen) {
        playerCardElement.requestFullscreen().catch(err => console.warn('Fullscreen error:', err));
      } else if ((playerCardElement as any).webkitRequestFullscreen) {
        (playerCardElement as any).webkitRequestFullscreen();
      }
    } else {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(err => console.warn('Exit fullscreen error:', err));
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        }
      }
    }
  }
`;

content = content.replace(toggleFullscreenTarget.trim(), toggleFullscreenReplace.trim());

// Make sure our is-fullscreen CSS uses robust fixed positioning and z-index.
const cssTarget = `
  .player-stage-card:fullscreen,
  .player-stage-card:-webkit-full-screen,
  .player-stage-card.is-fullscreen {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    max-width: none !important;
    max-height: none !important;
    border-radius: 0 !important;
    z-index: 99999 !important;
    display: flex;
    flex-direction: column;
    margin: 0 !important;
  }
`;

if (!content.includes('z-index: 99999 !important;')) {
    const oldCss = `
  .player-stage-card:fullscreen,
  .player-stage-card:-webkit-full-screen,
  .player-stage-card.is-fullscreen {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    max-width: none !important;
    max-height: none !important;
    border-radius: 0 !important;
    z-index: 9999 !important;
    display: flex;
    flex-direction: column;
    margin: 0 !important;
  }
`;
    content = content.replace(oldCss.trim(), cssTarget.trim());
}

fs.writeFileSync(file, content);
console.log('Fullscreen patched');
