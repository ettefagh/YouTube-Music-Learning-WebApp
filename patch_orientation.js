const fs = require('fs');

const file = 'piano-companion/src/routes/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

const targetEffect = `
  $effect(() => {
    // 2. Play/Pause based on isVideoPlaying state
    if (playerController) {
`;

const replaceEffect = `
  $effect(() => {
    // 2. Play/Pause based on isVideoPlaying state
    if (playerController) {
`;

const mountTarget = `
  onMount(() => {
    // Set viewport meta for PWA / iOS Safari prevention of auto-zoom
    if (typeof document !== 'undefined') {
`;

const mountReplace = `
  onMount(() => {
    // Orientation change listener for scroll anchoring
    if (typeof window !== 'undefined') {
      const handleOrientationChange = () => {
        // Give layout a moment to update before scrolling
        setTimeout(() => {
          if (window.innerWidth > window.innerHeight && playerCardElement && !isFullscreen) {
            playerCardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      };

      window.addEventListener('orientationchange', handleOrientationChange);
      // also hook into resize just in case
      window.addEventListener('resize', () => {
         if (window.innerWidth > window.innerHeight && document.activeElement?.tagName !== 'INPUT') {
            handleOrientationChange();
         }
      });
    }

    // Set viewport meta for PWA / iOS Safari prevention of auto-zoom
    if (typeof document !== 'undefined') {
`;

content = content.replace(mountTarget.trim(), mountReplace.trim());

fs.writeFileSync(file, content);
console.log('Orientation patched');
