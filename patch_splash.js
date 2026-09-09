const fs = require('fs');

const file = 'piano-companion/src/lib/components/screens/AppSplashScreen.svelte';
let content = fs.readFileSync(file, 'utf8');

const target = `
    // Ensure splash displays for at least 1.8s for a joyful kid experience
    const minTimer = setTimeout(() => {
      minTimeElapsed = true;
      checkCompletion();
    }, 1800);
`;

const replace = `
    // Ensure splash displays for at least 3s for a joyful kid experience
    const minTimer = setTimeout(() => {
      minTimeElapsed = true;
      checkCompletion();
    }, 3000);
`;

content = content.replace(target.trim(), replace.trim());
fs.writeFileSync(file, content);
console.log('Splash patched');
