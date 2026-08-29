<script lang="ts">
  import { onMount } from 'svelte';
  import { db, initDatabase, type LocalLesson, type LocalAudioTrack } from '$lib/db/db';
  import { youtubeLooper } from '$lib/actions/youtubePlayer.svelte';
  import { AudioRecorderEngine } from '$lib/audio/audioRecorder.svelte';
  import { teacherAuth } from '$lib/stores/teacherAuth.svelte';
  import MascotPip from '$lib/components/MascotPip.svelte';
  import TeacherGate from '$lib/components/TeacherGate.svelte';

  let lessons = $state<LocalLesson[]>([]);
  let currentLesson = $state<LocalLesson | null>(null);
  let playbackRate = $state<number>(1.0);
  let isLooping = $state<boolean>(true);

  let studentTrack = $state<LocalAudioTrack | null>(null);
  let teacherTrack = $state<LocalAudioTrack | null>(null);
  let studentAudioUrl = $state<string | null>(null);
  let teacherAudioUrl = $state<string | null>(null);

  let mascotState = $state<'idle' | 'listening' | 'cheering'>('idle');
  let mascotMessage = $state<string>('Welcome! Ready to play?');
  let showTeacherGate = $state<boolean>(false);

  const recorder = new AudioRecorderEngine();

  onMount(async () => {
    await initDatabase();
    lessons = await db.lessons.orderBy('sequenceIndex').toArray();
    if (lessons.length > 0) {
      selectLesson(lessons[0]);
    }
  });

  async function selectLesson(lesson: LocalLesson) {
    currentLesson = lesson;
    mascotState = 'idle';
    mascotMessage = `Let's practice "${lesson.title}"!`;

    // Revoke previous URLs to free memory
    if (studentAudioUrl) URL.revokeObjectURL(studentAudioUrl);
    if (teacherAudioUrl) URL.revokeObjectURL(teacherAudioUrl);

    studentTrack = (await db.audioTracks.where({ lessonId: lesson.id, trackType: 'student' }).first()) ?? null;
    teacherTrack = (await db.audioTracks.where({ lessonId: lesson.id, trackType: 'teacher' }).first()) ?? null;

    studentAudioUrl = studentTrack ? URL.createObjectURL(studentTrack.audioBlob) : null;
    teacherAudioUrl = teacherTrack ? URL.createObjectURL(teacherTrack.audioBlob) : null;
  }

  async function toggleStudentRecord() {
    if (recorder.isRecording) {
      const { blob, mimeType } = await recorder.stop();
      mascotState = 'cheering';
      mascotMessage = 'Awesome take! Listen to your sound!';

      const track: LocalAudioTrack = {
        id: crypto.randomUUID(),
        lessonId: currentLesson!.id,
        trackType: 'student',
        mimeType,
        durationSeconds: 0,
        createdAt: Date.now(),
        audioBlob: blob
      };

      await db.audioTracks.put(track);
      studentTrack = track;
      if (studentAudioUrl) URL.revokeObjectURL(studentAudioUrl);
      studentAudioUrl = URL.createObjectURL(blob);
    } else {
      await recorder.start();
      mascotState = 'listening';
      mascotMessage = 'Pip is listening to your piano!';
    }
  }

  function handleTeacherRecord() {
    if (!teacherAuth.isUnlocked) {
      showTeacherGate = true;
    } else {
      startTeacherRecord();
    }
  }

  async function startTeacherRecord() {
    // Direct teacher recording flow
    if (recorder.isRecording) {
      const { blob, mimeType } = await recorder.stop();
      const track: LocalAudioTrack = {
        id: crypto.randomUUID(),
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
      await recorder.start();
    }
  }
</script>

<div class="cockpit-container">
  <!-- Top Bar -->
  <header class="top-nav">
    <h1>🎹 Tastenzauberei 1</h1>
    <select onchange={(e) => {
      const selected = lessons.find(l => l.id === (e.target as HTMLSelectElement).value);
      if (selected) selectLesson(selected);
    }}>
      {#each lessons as l}
        <option value={l.id}>{l.sequenceIndex}. {l.title}</option>
      {/each}
    </select>
  </header>

  {#if currentLesson}
    <!-- Video Player Cockpit -->
    <main class="practice-body">
      <div class="player-wrapper">
        <div
          use:youtubeLooper={{
            videoId: () => currentLesson!.youtubeVideoId,
            startTime: () => currentLesson!.startTime,
            endTime: () => currentLesson!.endTime,
            playbackRate: () => playbackRate,
            isLooping: () => isLooping
          }}
          class="yt-frame"
        ></div>

        <div class="video-controls">
          <button class:active={isLooping} onclick={() => isLooping = !isLooping}>
            🔄 Loop {isLooping ? 'ON' : 'OFF'}
          </button>
          <div class="speed-toggles">
            <button class:active={playbackRate === 0.75} onclick={() => playbackRate = 0.75}>0.75x</button>
            <button class:active={playbackRate === 1.0} onclick={() => playbackRate = 1.0}>1.0x</button>
          </div>
        </div>
      </div>

      <!-- Dual Audio Studio -->
      <section class="audio-studio">
        <div class="track-card">
          <h3>👩‍🏫 Teacher Reference</h3>
          {#if teacherAudioUrl}
            <audio src={teacherAudioUrl} controls></audio>
          {:else}
            <p class="empty-state">No reference track yet.</p>
          {/if}
          <button class="gate-btn" onclick={handleTeacherRecord}>
            {teacherAuth.isUnlocked ? '🎙️ Record Reference' : '🔒 Teacher Unlock'}
          </button>
        </div>

        <div class="track-card student-card">
          <h3>🧒 My Practice Take</h3>
          {#if studentAudioUrl}
            <audio src={studentAudioUrl} controls></audio>
          {/if}
          <button
            class="record-btn"
            class:recording={recorder.isRecording}
            onclick={toggleStudentRecord}
          >
            {recorder.isRecording ? '⏹ Stop Recording' : '⏺ Record My Take'}
          </button>
          {#if recorder.isRecording}
            <div class="vu-meter">
              <div class="vu-fill" style="width: {recorder.volumeLevel * 100}%"></div>
            </div>
          {/if}
        </div>
      </section>

      <!-- Checkpoints -->
      <section class="checkpoints">
        <h3>🎯 Learning Points</h3>
        <ul>
          {#each currentLesson.checkpoints as pt}
            <li>{pt}</li>
          {/each}
        </ul>
      </section>

      <!-- Mascot Guidance -->
      <MascotPip state={mascotState} message={mascotMessage} />
    </main>
  {/if}

  {#if showTeacherGate}
    <TeacherGate
      onSuccess={() => {
        teacherAuth.unlock();
        showTeacherGate = false;
      }}
      onCancel={() => showTeacherGate = false}
    />
  {/if}
</div>

<style>
  .cockpit-container {
    max-width: 768px;
    margin: 0 auto;
    padding: 16px;
    font-family: system-ui, -apple-system, sans-serif;
  }
  .top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .player-wrapper {
    background: #000;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 16px;
  }
  .yt-frame {
    width: 100%;
    aspect-ratio: 16 / 9;
  }
  .video-controls {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #212121;
  }
  .video-controls button {
    background: #424242;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
  }
  .video-controls button.active {
    background: #FFB300;
    color: black;
    font-weight: bold;
  }
  .audio-studio {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }
  .track-card {
    background: #F5F5F5;
    padding: 12px;
    border-radius: 12px;
  }
  .student-card {
    background: #E8F5E9;
  }
  .record-btn {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 8px;
    background: #4CAF50;
    color: white;
    font-weight: bold;
    cursor: pointer;
    margin-top: 8px;
  }
  .record-btn.recording {
    background: #E53935;
    animation: pulse 1s infinite;
  }
  .gate-btn {
    width: 100%;
    padding: 8px;
    border: 1px solid #BDBDBD;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 8px;
  }
  .vu-meter {
    height: 6px;
    background: #C8E6C9;
    border-radius: 3px;
    margin-top: 8px;
    overflow: hidden;
  }
  .vu-fill {
    height: 100%;
    background: #43A047;
    transition: width 0.05s ease;
  }
  .checkpoints {
    background: #EDE7F6;
    padding: 12px 16px;
    border-radius: 12px;
    margin-bottom: 16px;
  }
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
</style>
