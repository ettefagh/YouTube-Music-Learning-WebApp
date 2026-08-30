<script lang="ts">
  import { onMount } from 'svelte';
  import { db, initDatabase, type LocalLesson, type LocalAudioTrack } from '$lib/db/db';
  import { youtubeLooper } from '$lib/actions/youtubePlayer.svelte';
  import { AudioRecorderEngine } from '$lib/audio/audioRecorder.svelte';
  import { teacherAuth } from '$lib/stores/teacherAuth.svelte';
  import MascotPip from '$lib/components/MascotPip.svelte';
  import TeacherGate from '$lib/components/TeacherGate.svelte';

  let allLessons = $state<LocalLesson[]>([]);
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

  let showSettingsModal = $state(false);

  let isEditingCheckpoints = $state(false);
  let editCheckpointsText = $state('');

  function handleEditCheckpoints() {
      if (!teacherAuth.isUnlocked) {
          showTeacherGate = true;
          // After unlock, the UI naturally reflects unlocked state, we just need to re-click or we can auto-trigger
      } else {
          isEditingCheckpoints = true;
          editCheckpointsText = currentLesson?.checkpoints.join('\n') || '';
      }
  }

  async function saveCheckpoints() {
      if (currentLesson) {
          currentLesson.checkpoints = editCheckpointsText.split('\n').filter(c => c.trim().length > 0);
          await db.lessons.put($state.snapshot(currentLesson));
          isEditingCheckpoints = false;
      }
  }

  let requiresSettingsUnlock = $state(false);

  // Settings
  let currentThemeColor = $state('#f4f0ec');

  onMount(() => {
    const savedTheme = localStorage.getItem('themeColor');
    if (savedTheme) {
        currentThemeColor = savedTheme;
        document.body.style.backgroundColor = savedTheme;
    }
  });

  function openSettings() {
     if (!teacherAuth.isUnlocked) {
        requiresSettingsUnlock = true;
        showTeacherGate = true;
     } else {
        showSettingsModal = true;
     }
  }

  function applyTheme(color: string) {
      currentThemeColor = color;
      localStorage.setItem('themeColor', color);
      document.body.style.backgroundColor = color;
  }

  async function forceUpdateApp() {
      if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (let registration of registrations) {
              await registration.unregister();
          }
          window.location.reload();
      } else {
          window.location.reload();
      }
  }


  // Layout states
  let isDropdownOpen = $state<boolean>(false);

  // Providers logic
  let providers = $state<string[]>([]);
  let selectedProvider = $state<string>('');

  let providerMode = $state<'video' | 'playlist'>('video');

  let videoCurrentTime = $state(0);
  let videoDuration = $state(0);
  let videoSeekTarget = $state<number | null>(null);

  function handleTimeUpdate(time: number, duration: number) {
      videoCurrentTime = time;
      videoDuration = duration;
  }

  function handleProgressClick(e: MouseEvent) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      videoSeekTarget = percentage * videoDuration;
  }

  const playlistId = 'PL10p3mlGiANOP_3RdrSZYv3kG5AzDmONh';

  // Instantiate two separate recording engines to fix logic flaw
  const studentRecorder = new AudioRecorderEngine();
  const teacherRecorder = new AudioRecorderEngine();

  onMount(async () => {
    await initDatabase();
    allLessons = await db.lessons.orderBy('sequenceIndex').toArray();

    // Extract unique providers
    const uniqueProviders = new Set(allLessons.map(l => l.providerName));
    providers = Array.from(uniqueProviders);

    if (providers.length > 0) {
      selectProvider(providers[0]);
    }
  });

  function selectProvider(providerName: string) {
    selectedProvider = providerName;
    lessons = allLessons.filter(l => l.providerName === providerName);
    if (lessons.length > 0) {
      selectLesson(lessons[0]);
    } else {
      currentLesson = null;
    }
  }

  async function selectLesson(lesson: LocalLesson) {
    currentLesson = lesson;
    isDropdownOpen = false;
    mascotState = 'idle';
    mascotMessage = `Let's practice "${lesson.title}"!`;

    // Revoke previous URLs to free memory
    if (studentAudioUrl) URL.revokeObjectURL(studentAudioUrl);
    if (teacherAudioUrl) URL.revokeObjectURL(teacherAudioUrl);

    // Use the new compound index if we were making explicit calls, or multiple `where` clauses
    // db.audioTracks.where('[lessonId+trackType]').equals([lesson.id, 'student']).first()
    studentTrack = (await db.audioTracks.where('[lessonId+trackType]').equals([lesson.id, 'student']).first()) ?? null;
    teacherTrack = (await db.audioTracks.where('[lessonId+trackType]').equals([lesson.id, 'teacher']).first()) ?? null;

    studentAudioUrl = studentTrack ? URL.createObjectURL(studentTrack.audioBlob) : null;
    teacherAudioUrl = teacherTrack ? URL.createObjectURL(teacherTrack.audioBlob) : null;
  }

  async function toggleStudentRecord() {
    if (studentRecorder.isRecording) {
      const { blob, mimeType } = await studentRecorder.stop();
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
      await studentRecorder.start();
      mascotState = 'listening';
      mascotMessage = 'Pip is listening to your piano!';
    }
  }

  function handleTeacherRecord() {
    if (!teacherAuth.isUnlocked) {
      requiresSettingsUnlock = false;
      showTeacherGate = true;
    } else {
      startTeacherRecord();
    }
  }

  async function startTeacherRecord() {
    if (teacherRecorder.isRecording) {
      const { blob, mimeType } = await teacherRecorder.stop();
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
      await teacherRecorder.start();
    }
  }
</script>

<div class="cockpit-container">




  <!-- Provider Selector -->
 (Lower visual hierarchy, placed above main header) -->
  <div class="provider-selector">
    <span class="provider-label">Provider:</span>
    <div class="provider-pill-group">
      {#each providers as provider}
        <button
          class="provider-pill {selectedProvider === provider ? 'active' : ''}"
          onclick={() => selectProvider(provider)}
        >
          {provider}
        </button>
      {/each}
    </div>
  </div>

  <!-- Neobrutalist Header & Lesson Selector -->
  <header class="neo-header">
    <div
      class="header-card"
      role="button"
      tabindex="0"
      onclick={() => isDropdownOpen = !isDropdownOpen}
      onkeydown={(e) => e.key === 'Enter' && (isDropdownOpen = !isDropdownOpen)}
    >
      <div class="header-content">
        <span class="icon">🎹</span>
        <div class="title-area">
          <span class="subtitle">Tastenzauberei 1</span>
          <h1 class="lesson-title">{currentLesson ? currentLesson.title : 'Loading...'}</h1>
        </div>
        <span class="dropdown-arrow" class:open={isDropdownOpen}>▼</span>
      </div>
    </div>

    {#if isDropdownOpen}
      <div class="lesson-dropdown neo-card">
        <ul>
          {#each lessons as l}
            <li>
              <button
                class="lesson-btn {currentLesson?.id === l.id ? 'active' : ''}"
                onclick={() => selectLesson(l)}
              >
                <span class="seq">{l.sequenceIndex}.</span> {l.title}
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </header>

  {#if currentLesson}
    <main class="practice-body">
      <!-- Video Player Cockpit (Keyed to force total unmount on provider change) -->

        <div class="player-wrapper neo-card">
          <div
            use:youtubeLooper={{
              videoId: () => currentLesson!.youtubeVideoId,

              startTime: () => currentLesson!.startTime,
              endTime: () => currentLesson!.endTime,

              playbackRate: () => playbackRate,
              isLooping: () => isLooping,
              onTimeUpdate: handleTimeUpdate,
              seekTarget: () => videoSeekTarget,
              _trigger: [playbackRate, isLooping, currentLesson?.youtubeVideoId, videoSeekTarget]
            }}
            class="yt-frame"
          ></div>


          <!-- Custom Kid-friendly Progress Bar -->
          <div class="progress-container" role="button" tabindex="0" onclick={handleProgressClick} onkeydown={(e) => e.key === 'Enter' && handleProgressClick(e as any)}>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: {videoDuration ? (videoCurrentTime / videoDuration) * 100 : 0}%"></div>
                <div class="progress-knob" style="left: {videoDuration ? (videoCurrentTime / videoDuration) * 100 : 0}%"></div>
            </div>
            <div class="time-readout">
                <span>{Math.floor(videoCurrentTime / 60)}:{(Math.floor(videoCurrentTime % 60)).toString().padStart(2, '0')}</span>
                <span>{Math.floor(videoDuration / 60)}:{(Math.floor(videoDuration % 60)).toString().padStart(2, '0')}</span>
            </div>
          </div>

          <div class="video-controls">
            <button class="control-btn {isLooping ? 'active' : ''}" onclick={() => isLooping = !isLooping}>
              🔄 Loop {isLooping ? 'ON' : 'OFF'}
            </button>
            <div class="speed-toggles">
              <button class="control-btn {playbackRate === 0.5 ? 'active' : ''}" onclick={() => playbackRate = 0.5}>0.5x</button>
              <button class="control-btn {playbackRate === 0.75 ? 'active' : ''}" onclick={() => playbackRate = 0.75}>0.75x</button>
              <button class="control-btn {playbackRate === 1.0 ? 'active' : ''}" onclick={() => playbackRate = 1.0}>1.0x</button>
            </div>
          </div>
        </div>
      <!-- Dual Audio Studio -->
      <section class="audio-studio">
        <div class="track-card neo-card teacher-card">
          <h3>👩‍🏫 Teacher Reference</h3>
          {#if teacherAudioUrl}
            <audio src={teacherAudioUrl} controls></audio>
          {:else}
            <p class="empty-state">No reference track yet.</p>
          {/if}
          <button
            class="neo-btn {teacherRecorder.isRecording ? 'recording' : 'outline'}"
            onclick={handleTeacherRecord}
          >
            {#if teacherRecorder.isRecording}
               ⏹ Stop Recording
            {:else}
               {teacherAuth.isUnlocked ? '🎙️ Record Reference' : '🔒 Teacher Unlock'}
            {/if}
          </button>
          {#if teacherRecorder.isRecording}
            <div class="vu-meter neo-border">
              <div class="vu-fill" style="width: {teacherRecorder.volumeLevel * 100}%"></div>
            </div>
          {/if}
        </div>

        <div class="track-card neo-card student-card">
          <h3>🧒 My Practice Take</h3>
          {#if studentAudioUrl}
            <audio src={studentAudioUrl} controls></audio>
          {/if}
          <button
            class="neo-btn {studentRecorder.isRecording ? 'recording' : 'primary'}"
            onclick={toggleStudentRecord}
          >
            {studentRecorder.isRecording ? '⏹ Stop Recording' : '⏺ Record My Take'}
          </button>
          {#if studentRecorder.isRecording}
            <div class="vu-meter neo-border">
              <div class="vu-fill" style="width: {studentRecorder.volumeLevel * 100}%"></div>
            </div>
          {/if}
        </div>
      </section>


      <!-- Checkpoints -->
      <section class="checkpoints neo-card highlight">
        <div class="checkpoints-header">
            <h3>🎯 Learning Points</h3>
            {#if !isEditingCheckpoints}
                <button class="neo-btn outline small-btn" onclick={handleEditCheckpoints}>
                    {teacherAuth.isUnlocked ? '✏️ Edit' : '🔒 Edit'}
                </button>
            {/if}
        </div>
        {#if isEditingCheckpoints}
            <textarea bind:value={editCheckpointsText} class="neo-textarea" rows="4"></textarea>
            <div class="edit-actions">
                <button class="neo-btn primary small-btn" onclick={saveCheckpoints}>Save</button>
                <button class="neo-btn outline small-btn" onclick={() => isEditingCheckpoints = false}>Cancel</button>
            </div>
        {:else}
            <ul>
              {#each currentLesson.checkpoints as pt}
                <li>{pt}</li>
              {/each}
            </ul>
        {/if}
      </section>


      <!-- Mascot Guidance -->
      <MascotPip state={mascotState} message={mascotMessage} />
    </main>
  {/if}



  <footer class="neo-footer">
      <button class="neo-btn outline settings-btn" onclick={openSettings}>⚙️ Settings</button>
  </footer>

  {#if showSettingsModal}
    <div class="modal-backdrop">
      <div class="modal-content neo-card">
        <h2>App Settings</h2>

        <div class="setting-row">
            <span class="label">Theme Color:</span>
            <div class="theme-picker">
                <button class="color-btn" aria-label="Theme Cream" style="background: #f4f0ec" onclick={() => applyTheme('#f4f0ec')}></button>
                <button class="color-btn" aria-label="Theme Green" style="background: #E8F5E9" onclick={() => applyTheme('#E8F5E9')}></button>
                <button class="color-btn" aria-label="Theme Blue" style="background: #E3F2FD" onclick={() => applyTheme('#E3F2FD')}></button>
                <button class="color-btn" aria-label="Theme Pink" style="background: #FCE4EC" onclick={() => applyTheme('#FCE4EC')}></button>
                <button class="color-btn" aria-label="Theme Yellow" style="background: #FFF9C4" onclick={() => applyTheme('#FFF9C4')}></button>
            </div>
        </div>

        <div class="setting-row">
            <span class="label">Force App Update (Clear Cache):</span>
            <button class="neo-btn primary" onclick={forceUpdateApp}>Refresh App Version</button>
        </div>

        <button class="neo-btn outline" onclick={() => showSettingsModal = false}>Close</button>
      </div>
    </div>
  {/if}

  {#if showTeacherGate}
    <TeacherGate

      onSuccess={() => {
        teacherAuth.unlock();
        showTeacherGate = false;
        if (requiresSettingsUnlock) {
            requiresSettingsUnlock = false;
            showSettingsModal = true;
        } else {
            startTeacherRecord();
        }
      }}
      onCancel={() => {
          showTeacherGate = false;
          requiresSettingsUnlock = false;
      }}

    />
  {/if}
</div>

<style>
  :global(body) {
    background-color: #f4f0ec;
    margin: 0;
  }

  .cockpit-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px 16px;
    font-family: system-ui, -apple-system, sans-serif;
  }



  .settings-btn {
      width: auto;
      margin-top: 0;
      padding: 8px 16px;
  }
  .modal-backdrop {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  .modal-content {
    background: white;
    padding: 24px;
    max-width: 400px;
    width: 90%;
    font-family: system-ui, sans-serif;
  }
  .setting-row {
      margin: 20px 0;
  }
  .setting-row label {
      display: block;
      font-weight: bold;
      margin-bottom: 8px;
  }
  .theme-picker {
      display: flex;
      gap: 12px;
  }
  .color-btn {
      width: 40px;
      height: 40px;
      border: 3px solid #000;
      border-radius: 50%;
      cursor: pointer;
  }


  .checkpoints-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
  }
  .checkpoints-header h3 { margin: 0; }
  .small-btn {
      width: auto;
      margin-top: 0;
      padding: 6px 12px;
      font-size: 0.85rem;
  }
  .neo-textarea {
      width: 100%;
      border: 3px solid #000;
      border-radius: 8px;
      padding: 12px;
      font-family: inherit;
      font-size: 1rem;
      resize: vertical;
      box-sizing: border-box;
  }
  .edit-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 8px;
  }
  .neo-footer {
      margin-top: 32px;
      text-align: center;
      border-top: 4px solid #000;
      padding-top: 24px;
  }

  /* Neo-brutalism Utilities */
  .neo-card {
    background: white;
    border: 4px solid #000;
    border-radius: 12px;
    box-shadow: 6px 6px 0px #000;
  }

  .neo-btn {
    border: 3px solid #000;
    border-radius: 8px;
    font-weight: 800;
    padding: 12px 16px;
    cursor: pointer;
    box-shadow: 4px 4px 0px #000;
    transition: transform 0.1s, box-shadow 0.1s;
    width: 100%;
    margin-top: 12px;
    font-size: 1rem;
  }

  .neo-btn:active {
    transform: translate(4px, 4px);
    box-shadow: 0px 0px 0px #000;
  }

  .neo-btn.primary { background: #FFB300; color: #000; }
  .neo-btn.outline { background: #fff; color: #000; }
  .neo-btn.recording { background: #FF5252; color: #fff; animation: pulse 1s infinite; }

  .neo-border {
    border: 3px solid #000;
    border-radius: 8px;
  }

  /* Provider Selector */
  .provider-selector {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    padding: 0 4px;
  }

  .provider-label {
    font-weight: 700;
    font-size: 0.9rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .provider-pill-group {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 4px; /* for focus ring */
  }

  .provider-pill {
    background: #E0E0E0;
    border: 2px solid #9E9E9E;
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #424242;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .provider-pill:hover {
    background: #EEEEEE;
  }

  .provider-pill.active {
    background: #212121;
    color: #FFF;
    border-color: #212121;
  }

  /* Header Design */
  .neo-header {
    position: relative;
    margin-bottom: 24px;
    z-index: 50;
  }

  .header-card {
    background: #E8F5E9;
    border: 4px solid #000;
    border-radius: 16px;
    box-shadow: 8px 8px 0px #000;
    padding: 16px 24px;
    cursor: pointer;
    transition: transform 0.1s;
  }

  .header-card:active {
    transform: translate(4px, 4px);
    box-shadow: 4px 4px 0px #000;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .icon {
    font-size: 2.5rem;
  }

  .title-area {
    flex-grow: 1;
  }

  .subtitle {
    font-size: 0.9rem;
    font-weight: 700;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .lesson-title {
    margin: 4px 0 0 0;
    font-size: 1.8rem;
    font-weight: 900;
    color: #000;
  }

  .dropdown-arrow {
    font-size: 1.5rem;
    transition: transform 0.2s;
  }
  .dropdown-arrow.open {
    transform: rotate(180deg);
  }

  .lesson-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 12px;
    background: #FFF9C4;
    max-height: 300px;
    overflow-y: auto;
  }

  .lesson-dropdown ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .lesson-btn {
    width: 100%;
    text-align: left;
    padding: 16px 24px;
    background: none;
    border: none;
    border-bottom: 3px solid #000;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    gap: 12px;
  }
  .lesson-dropdown li:last-child .lesson-btn { border-bottom: none; }
  .lesson-btn:hover { background: #FFF176; }
  .lesson-btn.active { background: #FFD54F; }
  .seq { color: #d32f2f; }




  /* Progress Bar */
  .progress-container {
    padding: 12px 16px;
    background: #FFF;
    border-bottom: 3px solid #000;
    cursor: pointer;
  }
  .progress-bar-bg {
    height: 16px;
    background: #E0E0E0;
    border: 3px solid #000;
    border-radius: 8px;
    position: relative;
  }
  .progress-bar-fill {
    height: 100%;
    background: #4CAF50;
    width: 0%;
  }
  .progress-knob {
    width: 24px;
    height: 24px;
    background: #FFB300;
    border: 3px solid #000;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .time-readout {
    display: flex;
    justify-content: space-between;
    font-weight: 800;
    margin-top: 8px;
    font-size: 0.9rem;
  }

  /* Video Player */
  .player-wrapper {
    overflow: hidden;
    margin-bottom: 24px;
    background: #000;
  }

  .yt-frame {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-bottom: 4px solid #000;
  }

  .video-controls {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    background: #FFF;
  }

  .control-btn {
    background: #E0E0E0;
    border: 3px solid #000;
    border-radius: 6px;
    padding: 8px 16px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 2px 2px 0px #000;
  }

  .control-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 0px 0px 0px #000;
  }

  .control-btn.active {
    background: #2196F3;
    color: white;
  }

  .speed-toggles {
    display: flex;
    gap: 8px;
  }

  /* Audio Studio */
  .audio-studio {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  .track-card {
    padding: 16px;
  }

  .teacher-card { background: #E3F2FD; }
  .student-card { background: #FCE4EC; }

  .track-card h3 {
    margin-top: 0;
    margin-bottom: 12px;
    font-weight: 900;
  }

  audio { width: 100%; border-radius: 8px; margin-bottom: 8px; }
  .empty-state { font-style: italic; color: #757575; }

  .vu-meter {
    height: 12px;
    background: #fff;
    margin-top: 12px;
    overflow: hidden;
  }
  .vu-fill {
    height: 100%;
    background: #4CAF50;
    transition: width 0.05s ease;
  }

  /* Checkpoints */
  .checkpoints {
    padding: 20px;
    margin-bottom: 24px;
    background: #D1C4E9;
  }
  .checkpoints h3 {
    margin-top: 0;
    font-weight: 900;
    font-size: 1.4rem;
  }
  .checkpoints ul {
    margin: 0;
    padding-left: 20px;
    font-size: 1.1rem;
    font-weight: 600;
  }
  .checkpoints li { margin-bottom: 8px; }

  @keyframes pulse {
    0% { transform: scale(1); box-shadow: 4px 4px 0px #000; }
    50% { transform: scale(0.98) translate(2px, 2px); box-shadow: 2px 2px 0px #000; background: #D32F2F;}
    100% { transform: scale(1); box-shadow: 4px 4px 0px #000; }
  }

  @media (max-width: 600px) {
    .audio-studio { grid-template-columns: 1fr; }
    .lesson-title { font-size: 1.4rem; }
  }
</style>
