const fs = require('fs');

const path = 'piano-companion/src/routes/+page.svelte';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/id: crypto\.randomUUID\(\),\s*lessonId: currentLesson!\.id,\s*trackType: 'student',/, "id: studentTrack ? studentTrack.id : crypto.randomUUID(),\n        lessonId: currentLesson!.id,\n        trackType: 'student',");
code = code.replace(/id: crypto\.randomUUID\(\),\s*lessonId: currentLesson!\.id,\s*trackType: 'teacher',/, "id: teacherTrack ? teacherTrack.id : crypto.randomUUID(),\n        lessonId: currentLesson!.id,\n        trackType: 'teacher',");

fs.writeFileSync(path, code);
