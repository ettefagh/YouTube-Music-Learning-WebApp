<script lang="ts">

  import { onMount } from 'svelte';
  import { db, initDatabase, type LocalLesson, type LocalAudioTrack, type LocalBook } from '$lib/db/db';

  let books = $state<LocalBook[]>([]);
  let selectedBookId = $state<string>('');

  let hideAudioTakes = $state<boolean>(false);
  let pendingTeacherAction = $state<'edit' | 'record' | null>(null);

  // Default Provider Setting
  let defaultProvider = $state<string>('');

  // Add Provider States
  let showAddProviderModal = $state(false);
  let newProviderName = $state('');
  let newProviderType = $state<'list' | 'playlist' | 'chapters'>('list');
  let newProviderInput = $state('');
  let isAddingProvider = $state(false);
  let addProviderError = $state('');


  onMount(() => {

    const savedDefault = localStorage.getItem('defaultProvider');
    if (savedDefault) {
        defaultProvider = savedDefault;
    }
  });

  async function handleAddProvider() {
      isAddingProvider = true;
      addProviderError = '';

      if (!newProviderName.trim() || !newProviderInput.trim() || !selectedBookId) {
          addProviderError = 'Please fill out all fields.';
          isAddingProvider = false;
          return;
      }

      try {
          const newLessons: LocalLesson[] = [];
          const baseLessonParams = {
              bookId: selectedBookId,
              providerName: newProviderName,
              startTime: 0,
              endTime: 0,
              checkpoints: ['User generated content'],
              isCompleted: false
          };

          if (newProviderType === 'list') {
              const ids = newProviderInput.split('\n').map(id => id.trim()).filter(id => id);
              ids.forEach((videoId, index) => {
                  newLessons.push({
                      ...baseLessonParams,
                      id: crypto.randomUUID(),
                      title: `Custom Track ${index + 1}`,
                      sequenceIndex: index + 1,
                      youtubeVideoId: videoId
                  });
              });
          } else if (newProviderType === 'playlist') {
              const res = await fetch(`https://inv.nadeko.net/api/v1/playlists/${newProviderInput.trim()}`);
              if (!res.ok) throw new Error('Failed to fetch playlist.');
              const data = await res.json();
              if (!data.videos) throw new Error('Playlist has no videos.');
              data.videos.forEach((v: any, index: number) => {
                  newLessons.push({
                      ...baseLessonParams,
                      id: crypto.randomUUID(),
                      title: v.title,
                      sequenceIndex: index + 1,
                      youtubeVideoId: v.videoId
                  });
              });
          } else if (newProviderType === 'chapters') {
              const lines = newProviderInput.split('\n').map(l => l.trim()).filter(l => l);
              const videoId = lines[0];
              const chapterLines = lines.slice(1);

              const timeToSeconds = (timeStr: string) => {
                  const parts = timeStr.split(':').map(Number);
                  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
                  return parts[0] * 60 + parts[1];
              };

              const parsedChapters: Array<{time: string, title: string}> = [];
              const regex = /(\d+:\d{2}(?::\d{2})?)\s+(.*)/;
              for (const line of chapterLines) {
                  const match = regex.exec(line);
                  if (match) {
                      parsedChapters.push({ time: match[1], title: match[2].trim() });
                  }
              }

              parsedChapters.forEach((ch, index) => {
                  const startTime = timeToSeconds(ch.time);
                  const nextCh = parsedChapters[index + 1];
                  const endTime = nextCh ? timeToSeconds(nextCh.time) : startTime + 120;
                  newLessons.push({
                      ...baseLessonParams,
                      id: crypto.randomUUID(),
                      title: ch.title,
                      sequenceIndex: index + 1,
                      youtubeVideoId: videoId,
                      startTime,
                      endTime
                  });
              });
          }

          if (newLessons.length > 0) {
              await db.lessons.bulkPut(newLessons);
              showAddProviderModal = false;
              newProviderName = '';
              newProviderInput = '';
              await loadDataForSelectedBook();
              selectProvider(newLessons[0].providerName);
          } else {
              addProviderError = 'No valid tracks could be generated.';
          }
      } catch (err: any) {
          addProviderError = err.message || 'An error occurred parsing input.';
      }
      isAddingProvider = false;
  }


  import { youtubeLooper } from '$lib/actions/youtubePlayer.svelte';
  import { AudioRecorderEngine } from '$lib/audio/audioRecorder.svelte';
  import { teacherAuth } from '$lib/stores/teacherAuth.svelte';
  import MascotPip from '$lib/components/MascotPip.svelte';
  import OnboardingModal from '$lib/components/OnboardingModal.svelte';
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
          pendingTeacherAction = 'edit';
          showTeacherGate = true;
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



  let showOnboarding = $state(false);

  onMount(async () => {
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    if (!onboardingComplete) {
      showOnboarding = true;
    }

    await initDatabase();
    books = await db.books.toArray();
    if (books.length > 0) {
        selectedBookId = books[0].id;
    }

    const savedHideTakes = localStorage.getItem('hideAudioTakes');
    if (savedHideTakes !== null) {
        hideAudioTakes = savedHideTakes === 'true';
    }

    await loadDataForSelectedBook();
  });

  async function loadDataForSelectedBook() {
    allLessons = await db.lessons.where('bookId').equals(selectedBookId).sortBy('sequenceIndex');

    // Extract unique providers for this book

    const uniqueProviders = new Set(allLessons.map(l => l.providerName));
    providers = Array.from(uniqueProviders);

    if (providers.length > 0) {
      if (providers.includes(defaultProvider)) {
          selectProvider(defaultProvider);
      } else {
          selectProvider(providers[0]);
      }
    } else {

        lessons = [];
        currentLesson = null;
    }
  }

  $effect(() => {
     if (selectedBookId) {
         loadDataForSelectedBook();
     }
  });


  function handleOnboardingComplete() {
    localStorage.setItem('onboardingComplete', 'true');
    showOnboarding = false;
  }

  function toggleCompletion() {
      if (currentLesson) {
          currentLesson.isCompleted = !currentLesson.isCompleted;
          db.lessons.put($state.snapshot(currentLesson));
      }
  }


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

  function handleTeacherRecord() {
    if (!teacherAuth.isUnlocked) {
      pendingTeacherAction = 'record';
      showTeacherGate = true;
    } else {
      startTeacherRecord();
    }
  }

  async function startTeacherRecord() {
    if (teacherRecorder.isRecording) {
      const { blob, mimeType } = await teacherRecorder.stop();
      const track: LocalAudioTrack = {
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
</script>

<div class="cockpit-container">

  {#if showOnboarding}
    <OnboardingModal onComplete={handleOnboardingComplete} />
  {/if}





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

          <h1 class="lesson-title">
             <input type="checkbox" class="completion-box" checked={currentLesson?.isCompleted} onclick={toggleCompletion} title="Mark as completed" />
             {currentLesson ? currentLesson.title : 'Loading...'}
          </h1>

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
      {#if !hideAudioTakes}
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
      {/if}

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
      <button class="settings-btn" onclick={openSettings}>⚙️ Settings</button>
  </footer>


  {#if showAddProviderModal}
    <div class="modal-backdrop">
      <div class="modal-content neo-card">
        <h2>Add Custom Provider</h2>

        <div class="setting-row">
            <span class="label">Provider Name:</span>
            <input type="text" bind:value={newProviderName} class="neo-input" placeholder="e.g. My Piano Teacher" />
        </div>

        <div class="setting-row">
            <span class="label">Source Type:</span>
            <select bind:value={newProviderType} class="neo-select">
                <option value="list">List of Video IDs</option>
                <option value="playlist">YouTube Playlist ID</option>
                <option value="chapters">Bookmarked Video (Chapters)</option>
            </select>
        </div>

        <div class="setting-row">
            <span class="label">Source Input:</span>
            {#if newProviderType === 'list'}
                <p class="help-text">Enter one YouTube Video ID per line.</p>
            {:else if newProviderType === 'playlist'}
                <p class="help-text">Enter the YouTube Playlist ID (e.g. PL10p3mlGiAN...).</p>
            {:else if newProviderType === 'chapters'}
                <p class="help-text">First line: Video ID.<br/>Next lines: "MM:SS Chapter Title".</p>
            {/if}
            <textarea bind:value={newProviderInput} class="neo-textarea" rows="5"></textarea>
        </div>

        {#if addProviderError}
            <p class="error">{addProviderError}</p>
        {/if}

        <div class="edit-actions">
            <button class="neo-btn primary small-btn" onclick={handleAddProvider} disabled={isAddingProvider}>
                {isAddingProvider ? 'Adding...' : 'Add Provider'}
            </button>
            <button class="neo-btn outline small-btn" onclick={() => showAddProviderModal = false}>Cancel</button>
        </div>
      </div>
    </div>
  {/if}

  {#if showSettingsModal}
    <div class="modal-backdrop">
      <div class="modal-content neo-card">
        <h2>App Settings</h2>


        <div class="setting-row">
            <span class="label">Select Book:</span>
            <select bind:value={selectedBookId} class="neo-select">
                {#each books as book}
                    <option value={book.id}>{book.title}</option>
                {/each}
            </select>
        </div>


        <div class="setting-row">
            <span class="label">Default Provider:</span>
            <select bind:value={defaultProvider} class="neo-select" onchange={() => localStorage.setItem('defaultProvider', defaultProvider)}>
                <option value="">(None)</option>
                {#each providers as provider}
                    <option value={provider}>{provider}</option>
                {/each}
            </select>
        </div>

        <div class="setting-row">
            <span class="label">Add Custom Provider:</span>
            <button class="neo-btn outline" onclick={() => showAddProviderModal = true}>➕ Add New Source</button>
        </div>

        <div class="setting-row">
            <span class="label">Hide Audio Takes:</span>
            <button
                class="neo-btn {hideAudioTakes ? 'primary' : 'outline'}"
                onclick={() => { hideAudioTakes = !hideAudioTakes; localStorage.setItem('hideAudioTakes', hideAudioTakes.toString()); }}
            >
                {hideAudioTakes ? 'Hidden' : 'Visible'}
            </button>
        </div>

        <div class="setting-row">
            <span class="label">Contact Curator:</span>
            <p style="font-size: 0.85rem; margin-top: 4px;">Got a bug or a feature request?</p>
            <a href="https://github.com/google-labs/piano-practice-companion/issues/new" target="_blank" class="neo-btn outline" style="display: block; text-align: center; text-decoration: none;">
                Submit to GitHub
            </a>
        </div>

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

        if (pendingTeacherAction === 'edit') {
            isEditingCheckpoints = true;
            editCheckpointsText = currentLesson?.checkpoints.join('\n') || '';
        } else if (pendingTeacherAction === 'record') {
            startTeacherRecord();
        }
        pendingTeacherAction = null;
      }}
      onCancel={() => {
          showTeacherGate = false;
          pendingTeacherAction = null;
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


  .neo-select {
      width: 100%;
      padding: 10px;
      font-size: 1rem;
      border: 3px solid #000;
      border-radius: 8px;
      margin-top: 8px;
      background: white;
  }
  .completion-box {
      width: 24px;
      height: 24px;
      cursor: pointer;
      accent-color: #4CAF50;
      vertical-align: middle;
      margin-right: 8px;
  }


  .neo-input {
      width: 100%;
      padding: 10px;
      font-size: 1rem;
      border: 3px solid #000;
      border-radius: 8px;
      margin-top: 8px;
      box-sizing: border-box;
  }
  .help-text {
      font-size: 0.85rem;
      color: #666;
      margin: 4px 0 8px 0;
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
    background: #212121;
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
    background: #212121;
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
  .player-wrapper { background: #000; border-radius: 16px; overflow: hidden; margin-bottom: 24px; border: 3px solid #000; box-shadow: 4px 4px 0 #000; }

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
    background: #212121;
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

  .track-card { background: #90A4AE; padding: 16px; border-radius: 12px; border: 3px solid #000; box-shadow: 4px 4px 0 #000; display: flex; flex-direction: column; gap: 8px;}

  .teacher-card { background: #E3F2FD; }
  .student-card { background: #A5D6A7; }

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
  .checkpoints { background: #E1BEE7; padding: 16px 20px; border-radius: 12px; margin-bottom: 24px; border: 3px solid #000; box-shadow: 4px 4px 0 #000; }
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

  .top-nav select { padding: 8px 12px; border-radius: 8px; border: 3px solid #000; font-weight: bold; box-shadow: 2px 2px 0 #000; background: white; cursor: pointer; }

  .settings-section { background: #E0E0E0; padding: 16px 20px; border-radius: 12px; margin-bottom: 24px; border: 3px solid #000; box-shadow: 4px 4px 0 #000; }
  .settings-btn { width: 100%; padding: 12px; border: 3px solid #000; border-radius: 8px; background: #fff; color: #000; font-weight: bold; cursor: pointer; box-shadow: 2px 2px 0 #000; transition: transform 0.1s, box-shadow 0.1s; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .settings-btn:active { transform: translate(2px, 2px); box-shadow: 0 0 0 #000; }
</style>
