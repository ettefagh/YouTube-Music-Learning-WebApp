const fs = require('fs');
const file = 'piano-companion/src/routes/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

// Fix A11Y labels on settings buttons
content = content.replace(
  /<button class="color-btn" style="background: #f4f0ec" onclick=\{\(\) => applyTheme\('#f4f0ec'\)\}\><\/button>/g,
  `<button class="color-btn" aria-label="Theme Cream" style="background: #f4f0ec" onclick={() => applyTheme('#f4f0ec')}></button>`
);
content = content.replace(
  /<button class="color-btn" style="background: #E8F5E9" onclick=\{\(\) => applyTheme\('#E8F5E9'\)\}\><\/button>/g,
  `<button class="color-btn" aria-label="Theme Green" style="background: #E8F5E9" onclick={() => applyTheme('#E8F5E9')}></button>`
);
content = content.replace(
  /<button class="color-btn" style="background: #E3F2FD" onclick=\{\(\) => applyTheme\('#E3F2FD'\)\}\><\/button>/g,
  `<button class="color-btn" aria-label="Theme Blue" style="background: #E3F2FD" onclick={() => applyTheme('#E3F2FD')}></button>`
);
content = content.replace(
  /<button class="color-btn" style="background: #FCE4EC" onclick=\{\(\) => applyTheme\('#FCE4EC'\)\}\><\/button>/g,
  `<button class="color-btn" aria-label="Theme Pink" style="background: #FCE4EC" onclick={() => applyTheme('#FCE4EC')}></button>`
);
content = content.replace(
  /<button class="color-btn" style="background: #FFF9C4" onclick=\{\(\) => applyTheme\('#FFF9C4'\)\}\><\/button>/g,
  `<button class="color-btn" aria-label="Theme Yellow" style="background: #FFF9C4" onclick={() => applyTheme('#FFF9C4')}></button>`
);

content = content.replace(
  `<label>Theme Color:</label>`,
  `<span class="label">Theme Color:</span>`
);

content = content.replace(
  `<label>Force App Update (Clear Cache):</label>`,
  `<span class="label">Force App Update (Clear Cache):</span>`
);

fs.writeFileSync(file, content);
