const fs = require('fs');

const path = 'piano-companion/src/routes/+page.svelte';
let code = fs.readFileSync(path, 'utf8');

// Using type casting properly
code = code.replace(/trackType: 'teacher' as 'teacher' \| 'student',/g, "trackType: 'teacher',");
code = code.replace(/const track = \{/g, "const track: LocalAudioTrack = {");

fs.writeFileSync(path, code);
