const fs = require('fs');

const path = 'piano-companion/src/routes/+page.svelte';
let code = fs.readFileSync(path, 'utf8');

// The top nav select wasn't matched properly in the last run because it probably wasn't defined in CSS.
// Let's add it.
if (!code.includes('.top-nav select {')) {
    code = code.replace('</style>', `
  .top-nav select { padding: 8px 12px; border-radius: 8px; border: 3px solid #000; font-weight: bold; box-shadow: 2px 2px 0 #000; background: white; cursor: pointer; }
</style>`);
}

// Add a settings container style to match neo-brutalism
code = code.replace(/\.settings-section \{[\s\S]*?\}/, '.settings-section { background: #E0E0E0; padding: 16px 20px; border-radius: 12px; margin-bottom: 24px; border: 3px solid #000; box-shadow: 4px 4px 0 #000; }');

if (!code.includes('.settings-section {')) {
     code = code.replace('</style>', `
  .settings-section { background: #E0E0E0; padding: 16px 20px; border-radius: 12px; margin-bottom: 24px; border: 3px solid #000; box-shadow: 4px 4px 0 #000; }
  .settings-btn { width: 100%; padding: 12px; border: 3px solid #000; border-radius: 8px; background: #fff; color: #000; font-weight: bold; cursor: pointer; box-shadow: 2px 2px 0 #000; transition: transform 0.1s, box-shadow 0.1s; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .settings-btn:active { transform: translate(2px, 2px); box-shadow: 0 0 0 #000; }
</style>`);
}

// And check that settings section is using it. I see in earlier implementation I added Settings panel
// Let's verify how it's styled.
fs.writeFileSync(path, code);

// For Dark mode support, SvelteKit + Tailwind usually uses class="dark" on html, but we have vanilla CSS here.
// I will add a simple media query or global body class for dark mode.
let appHtml = fs.readFileSync('piano-companion/src/app.html', 'utf8');
if (!appHtml.includes('theme=')) {
    // maybe we can add inline script to prevent flash of unstyled content
}

console.log("Refactored page css");
