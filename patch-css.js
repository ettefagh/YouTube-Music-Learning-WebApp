const fs = require('fs');
const file = 'piano-companion/src/routes/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

// Remove unused CSS safely
content = content.replace(/\.top-nav-bar\s*{[^}]*}/, '');
content = content.replace(/\/\* Provider Tabs \*\/[\s\S]*?\.tab-btn\.active\s*{[^}]*}/, '');

fs.writeFileSync(file, content);
