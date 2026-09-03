const fs = require('fs');
const path = 'piano-companion/src/routes/+page.svelte';
let code = fs.readFileSync(path, 'utf8');

// Ensure Settings button class is updated to be blocky like in screenshot
code = code.replace(/<button class="neo-btn outline settings-btn" onclick=\{openSettings\}>⚙️ Settings<\/button>/g,
  '<button class="settings-btn" onclick={openSettings}>⚙️ Settings</button>');

// We already added .settings-btn styles in the previous script. Let's check if there are other styling issues
// We should make sure the teacher verification modal mode buttons are rendered correctly.
// Let's verify `TeacherGate.svelte` changes.

fs.writeFileSync(path, code);
