const fs = require('fs');

const path = 'piano-companion/src/routes/+page.svelte';
let code = fs.readFileSync(path, 'utf8');

// There is a slight bug: `db.audioTracks.put(track)` uses track.id.
// If we record again, crypto.randomUUID() generates a new ID, so it saves multiple tracks per lesson
// But `selectLesson` only gets the `.first()`. This means old tracks pile up in the database.
// To fix this, we should reuse the existing track ID if it exists, or just delete old ones.

code = code.replace(/const track: LocalAudioTrack = \{[\s\S]*?id: crypto.randomUUID\(\),[\s\S]*?lessonId: currentLesson!\.id,[\s\S]*?trackType: 'student',/g,
  "const track: LocalAudioTrack = {\n        id: studentTrack ? studentTrack.id : crypto.randomUUID(),\n        lessonId: currentLesson!.id,\n        trackType: 'student',");

code = code.replace(/const track: LocalAudioTrack = \{[\s\S]*?id: crypto.randomUUID\(\),[\s\S]*?lessonId: currentLesson!\.id,[\s\S]*?trackType: 'teacher',/g,
  "const track: LocalAudioTrack = {\n        id: teacherTrack ? teacherTrack.id : crypto.randomUUID(),\n        lessonId: currentLesson!.id,\n        trackType: 'teacher',");

fs.writeFileSync(path, code);
