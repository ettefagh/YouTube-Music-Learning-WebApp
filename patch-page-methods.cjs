const fs = require('fs');

const path = 'piano-companion/src/routes/+page.svelte';
let code = fs.readFileSync(path, 'utf8');

// It looks like `handleTeacherRecord` and `startTeacherRecord` got removed or renamed during previous patching
// Let's add them back below toggleStudentRecord

if (!code.includes('async function startTeacherRecord() {')) {
    code = code.replace('</script>', `
  function handleTeacherRecord() {
    if (!teacherAuth.isUnlocked) {
      requestTeacherAuth('record');
    } else {
      startTeacherRecord();
    }
  }

  async function startTeacherRecord() {
    if (teacherRecorder.isRecording) {
      const { blob, mimeType } = await teacherRecorder.stop();
      const track = {
        id: teacherTrack ? teacherTrack.id : crypto.randomUUID(),
        lessonId: currentLesson!.id,
        trackType: 'teacher',
        mimeType,
        durationSeconds: 0,
        createdAt: Date.now(),
        audioBlob: blob
      };
      await db.audioTracks.put(track);
      teacherTrack = track;
      if (teacherAudioUrl) URL.revokeObjectURL(teacherAudioUrl);
      teacherAudioUrl = URL.createObjectURL(blob);
    } else {
      await teacherRecorder.start();
    }
  }
</script>`);
}

fs.writeFileSync(path, code);
