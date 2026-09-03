// Quick correction to +page.svelte to not trigger startTeacherRecord on settings unlock
const fs = require('fs');
const file = 'piano-companion/src/routes/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `  function handleTeacherRecord() {
    if (!teacherAuth.isUnlocked) {
      showTeacherGate = true;
    } else {
      startTeacherRecord();
    }
  }`,
  `  function handleTeacherRecord() {
    if (!teacherAuth.isUnlocked) {
      requiresSettingsUnlock = false;
      showTeacherGate = true;
    } else {
      startTeacherRecord();
    }
  }`
);

fs.writeFileSync(file, content);
