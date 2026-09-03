const fs = require('fs');
const file = 'piano-companion/src/routes/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

// Fix A11Y issues
content = content.replace(
  `<div class="header-card" onclick={() => isDropdownOpen = !isDropdownOpen}>`,
  `<div class="header-card" role="button" tabindex="0" onclick={() => isDropdownOpen = !isDropdownOpen} onkeydown={(e) => e.key === 'Enter' && (isDropdownOpen = !isDropdownOpen)}>`
);

fs.writeFileSync(file, content);
