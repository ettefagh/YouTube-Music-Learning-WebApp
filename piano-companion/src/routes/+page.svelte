<script lang="ts">
  import { onMount } from 'svelte';
  import {
    db,
    initDatabase,
    detectListType,
    type LocalLesson,
    type LocalAudioTrack,
    type LocalBook,
    type LessonListType
  } from '$lib/db/db';
  import { youtubeLooper, type YouTubePlayerController } from '$lib/actions/youtubePlayer.svelte';
  import { AudioRecorderEngine } from '$lib/audio/audioRecorder.svelte';
  import { teacherAuth } from '$lib/stores/teacherAuth.svelte';
  import MascotPip from '$lib/components/MascotPip.svelte';
  import Metronome from '$lib/components/Metronome.svelte';
  import ChapterTimeline from '$lib/components/ChapterTimeline.svelte';
  import OnboardingModal from '$lib/components/OnboardingModal.svelte';
  import TeacherGate from '$lib/components/TeacherGate.svelte';

  // --- Curriculum & Book State ---
  let books = $state<LocalBook[]>([]);
  let selectedBookId = $state<string>('');
  let currentBook = $derived(books.find(b => b.id === selectedBookId) ?? null);

  let providers = $state<string[]>([]);
  let selectedProvider = $state<string>('');
  let defaultProvider = $state<string>('');

  let allLessons = $state<LocalLesson[]>([]);
  let lessons = $state<LocalLesson[]>([]);
  let currentLesson = $state<LocalLesson | null>(null);

  // Lesson list type detection
  let currentListType = $derived<LessonListType>(detectListType(lessons, selectedProvider));

  // Search & Navigation
  let lessonSearch = $state<string>('');
  let isDropdownOpen = $state<boolean>(false);

  let filteredLessons = $derived(
    lessons.filter(l =>
      l.title.toLowerCase().includes(lessonSearch.toLowerCase()) ||
      l.sequenceIndex.toString() === lessonSearch.trim()
    )
  );

  let currentIndex = $derived(lessons.findIndex(l => l.id === currentLesson?.id));
  let hasPrevLesson = $derived(currentIndex > 0);
  let hasNextLesson = $derived(currentIndex >= 0 && currentIndex < lessons.length - 1);

  // --- Player & Looper State ---
  let playerController = $state<YouTubePlayerController | null>(null);
  let isVideoPlaying = $state<boolean>(false);
  let playbackRate = $state<number>(1.0);
  let isLooping = $state<boolean>(true);
  let autoAdvance = $state<boolean>(false);

  let videoCurrentTime = $state<number>(0);
  let videoDuration = $state<number>(0);
  let videoSeekTarget = $state<number | null>(null);

  // Custom A/B Looping
  let customLoopA = $state<number | null>(null);
  let customLoopB = $state<number | null>(null);

  // --- Metronome ---
  let showMetronome = $state<boolean>(false);

  // --- Dual Audio Studio State ---
  let hideAudioTakes = $state<boolean>(false);
  const studentRecorder = new AudioRecorderEngine();
  const teacherRecorder = new AudioRecorderEngine();

  let studentTrack = $state<LocalAudioTrack | null>(null);
  let teacherTrack = $state<LocalAudioTrack | null>(null);
  let studentAudioUrl = $state<string | null>(null);
  let teacherAudioUrl = $state<string | null>(null);

  // --- Checkpoints State ---
  let isEditingCheckpoints = $state<boolean>(false);
  let editCheckpointsText = $state<string>('');
  let completedCheckpoints = $state<Record<string, boolean>>({});

  // --- Mascot State ---
  let mascotState = $state<'idle' | 'listening' | 'cheering'>('idle');
  let mascotMessage = $state<string>('Welcome! Ready to play?');

  // --- Modals & Settings ---
  let showOnboarding = $state<boolean>(false);
  let showSettingsModal = $state<boolean>(false);
  let showAddProviderModal = $state<boolean>(false);
  let showTeacherGate = $state<boolean>(false);
  let pendingTeacherAction = $state<'edit' | 'record' | 'settings' | null>(null);
  let currentThemeColor = $state<string>('#f5f0ea');

  // Add Provider State
  let newProviderName = $state<string>('');
  let newProviderType = $state<'singles' | 'playlist' | 'chapters'>('singles');
  let newProviderInput = $state<string>('');
  let isAddingProvider = $state<boolean>(false);
  let addProviderError = $state<string>('');

  // --- Lifecycle ---
  onMount(async () => {
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    if (!onboardingComplete) {
      showOnboarding = true;
    }

    const savedDefault = localStorage.getItem('defaultProvider');
    if (savedDefault) {
      defaultProvider = savedDefault;
    }

    const savedHideTakes = localStorage.getItem('hideAudioTakes');
    if (savedHideTakes !== null) {
      hideAudioTakes = savedHideTakes === 'true';
    }

    const savedTheme = localStorage.getItem('themeColor');
    if (savedTheme) {
      currentThemeColor = savedTheme;
      document.body.style.backgroundColor = savedTheme;
    }

    await initDatabase();
    books = await db.books.toArray();
    if (books.length > 0) {
      selectedBookId = books[0].id;
      await loadDataForSelectedBook();
    }
  });

  async function loadDataForSelectedBook() {
    allLessons = await db.lessons.where('bookId').equals(selectedBookId).sortBy('sequenceIndex');

    const uniqueProviders = Array.from(new Set(allLessons.map(l => l.providerName)));
    providers = uniqueProviders;

    if (providers.length > 0) {
      if (defaultProvider && providers.includes(defaultProvider)) {
        selectProvider(defaultProvider);
      } else {
        selectProvider(providers[0]);
      }
    } else {
      lessons = [];
      currentLesson = null;
    }
  }

  async function selectBook(bookId: string) {
    if (selectedBookId === bookId) return;
    selectedBookId = bookId;
    await loadDataForSelectedBook();
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
    lessonSearch = '';
    customLoopA = null;
    customLoopB = null;
    completedCheckpoints = {};
    mascotState = 'idle';
    mascotMessage = `Let's practice "${lesson.title}"!`;

    // Revoke previous URLs to free memory
    if (studentAudioUrl) URL.revokeObjectURL(studentAudioUrl);
    if (teacherAudioUrl) URL.revokeObjectURL(teacherAudioUrl);

    studentTrack = (await db.audioTracks.where('[lessonId+trackType]').equals([lesson.id, 'student']).first()) ?? null;
    teacherTrack = (await db.audioTracks.where('[lessonId+trackType]').equals([lesson.id, 'teacher']).first()) ?? null;

    studentAudioUrl = studentTrack ? URL.createObjectURL(studentTrack.audioBlob) : null;
    teacherAudioUrl = teacherTrack ? URL.createObjectURL(teacherTrack.audioBlob) : null;
  }

  function prevLesson() {
    if (hasPrevLesson) selectLesson(lessons[currentIndex - 1]);
  }

  function nextLesson() {
    if (hasNextLesson) selectLesson(lessons[currentIndex + 1]);
  }

  // --- Player Transport Controls ---
  function handleTimeUpdate(time: number, duration: number) {
    videoCurrentTime = time;
    videoDuration = duration;
  }

  function handlePlayerStateChange(state: 'unstarted' | 'ended' | 'playing' | 'paused' | 'buffering' | 'cued') {
    isVideoPlaying = state === 'playing';
  }

  function handleSegmentComplete() {
    if (autoAdvance && hasNextLesson) {
      mascotState = 'cheering';
      mascotMessage = `Great work! Auto-advancing to next song: "${lessons[currentIndex + 1].title}"! 🌟`;
      nextLesson();
      setTimeout(() => {
        playerController?.play();
      }, 400);
    } else if (!isLooping) {
      mascotState = 'cheering';
      mascotMessage = 'Piece completed! Play again or tap Next!';
    }
  }

  function togglePlayVideo() {
    if (playerController) {
      playerController.togglePlay();
    }
  }

  function seekBy(deltaSeconds: number) {
    if (playerController) {
      playerController.seekBy(deltaSeconds);
    }
  }

  function handleProgressClick(e: MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    videoSeekTarget = percentage * videoDuration;
  }

  function setLoopA() {
    customLoopA = Math.floor(videoCurrentTime);
    if (customLoopB !== null && customLoopA >= customLoopB) {
      customLoopB = null;
    }
    isLooping = true;
    mascotState = 'cheering';
    mascotMessage = `Loop start set to ${formatTime(customLoopA)}!`;
  }

  function setLoopB() {
    customLoopB = Math.ceil(videoCurrentTime);
    if (customLoopA !== null && customLoopB <= customLoopA) {
      customLoopA = 0;
    }
    isLooping = true;
    mascotState = 'cheering';
    mascotMessage = `Loop end set to ${formatTime(customLoopB)}! Looping active!`;
  }

  function resetLoopAB() {
    customLoopA = null;
    customLoopB = null;
    mascotState = 'idle';
    mascotMessage = 'Loop points reset to default.';
  }

  function changePlaybackRate(rate: number) {
    playbackRate = rate;
    if (playerController) {
      playerController.setRate(rate);
    }
  }

  // --- Dual Audio Recording Studio ---
  async function toggleStudentRecord() {
    if (studentRecorder.isRecording) {
      const { blob, mimeType, durationSeconds } = await studentRecorder.stop();
      mascotState = 'cheering';
      mascotMessage = 'Awesome take! Listen to your sound!';

      const track: LocalAudioTrack = {
        id: studentTrack ? studentTrack.id : crypto.randomUUID(),
        lessonId: currentLesson!.id,
        trackType: 'student',
        mimeType,
        durationSeconds,
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
      pendingTeacherAction = 'record';
      showTeacherGate = true;
    } else {
      startTeacherRecord();
    }
  }

  async function startTeacherRecord() {
    if (teacherRecorder.isRecording) {
      const { blob, mimeType, durationSeconds } = await teacherRecorder.stop();
      const track: LocalAudioTrack = {
        id: teacherTrack ? teacherTrack.id : crypto.randomUUID(),
        lessonId: currentLesson!.id,
        trackType: 'teacher',
        mimeType,
        durationSeconds,
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

  async function deleteTrack(type: 'student' | 'teacher') {
    if (!currentLesson) return;
    const targetTrack = type === 'student' ? studentTrack : teacherTrack;
    if (targetTrack) {
      await db.audioTracks.delete(targetTrack.id);
      if (type === 'student') {
        if (studentAudioUrl) URL.revokeObjectURL(studentAudioUrl);
        studentTrack = null;
        studentAudioUrl = null;
      } else {
        if (teacherAudioUrl) URL.revokeObjectURL(teacherAudioUrl);
        teacherTrack = null;
        teacherAudioUrl = null;
      }
    }
  }

  // --- Checkpoints & Completion ---
  function toggleLessonCompletion() {
    if (currentLesson) {
      currentLesson.isCompleted = !currentLesson.isCompleted;
      db.lessons.put($state.snapshot(currentLesson));
      if (currentLesson.isCompleted) {
        mascotState = 'cheering';
        mascotMessage = `Congratulations! You finished "${currentLesson.title}"! 🌟`;
      }
    }
  }

  function toggleCheckpoint(index: number) {
    if (!currentLesson) return;
    const key = `${currentLesson.id}_cp_${index}`;
    completedCheckpoints[key] = !completedCheckpoints[key];

    const total = currentLesson.checkpoints.length;
    const checkedCount = currentLesson.checkpoints.filter((_, i) => completedCheckpoints[`${currentLesson!.id}_cp_${i}`]).length;

    if (checkedCount === total && total > 0) {
      mascotState = 'cheering';
      mascotMessage = 'Brilliant! You mastered all points for this piece! 🎉';
    }
  }

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

  // --- Settings & Themes ---
  function openSettings() {
    if (!teacherAuth.isUnlocked) {
      pendingTeacherAction = 'settings';
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
      for (const reg of registrations) {
        await reg.unregister();
      }
    }
    window.location.reload();
  }

  // --- Custom Provider Handler ---
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
        providerName: newProviderName.trim(),
        startTime: 0,
        endTime: 0,
        checkpoints: ['Master note accuracy', 'Keep a steady rhythm'],
        isCompleted: false,
        listType: newProviderType
      };

      if (newProviderType === 'singles') {
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

        const parsedChapters: Array<{ time: string; title: string }> = [];
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

  function formatTime(seconds: number) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
</script>

<div class="cockpit-container">
  {#if showOnboarding}
    <OnboardingModal onComplete={() => { localStorage.setItem('onboardingComplete', 'true'); showOnboarding = false; }} />
  {/if}

  <!-- Top Navigation & Curriculum Bar -->
  <nav class="curriculum-bar">
    <div class="book-tabs">
      {#each books as book}
        <button
          class="book-tab {selectedBookId === book.id ? 'active' : ''}"
          onclick={() => selectBook(book.id)}
        >
          <span class="book-icon">📖</span>
          <span class="book-name">{book.title}</span>
        </button>
      {/each}
    </div>

    <button
      class="top-icon-btn metronome-toggle {showMetronome ? 'active' : ''}"
      onclick={() => showMetronome = !showMetronome}
      title="Toggle Metronome"
    >
      ⏱️ Metronome
    </button>
  </nav>

  <!-- Provider Pill Bar with List Type Indicators -->
  <div class="provider-bar">
    <span class="provider-badge">Channel:</span>
    <div class="provider-pill-scroll">
      {#each providers as provider}
        {@const pLessons = allLessons.filter(l => l.providerName === provider)}
        {@const pType = detectListType(pLessons, provider)}
        <button
          class="provider-pill {selectedProvider === provider ? 'active' : ''}"
          onclick={() => selectProvider(provider)}
        >
          <span class="type-icon">{pType === 'chapters' ? '🔖' : pType === 'playlist' ? '📑' : '🎬'}</span>
          {provider}
        </button>
      {/each}
      <button
        class="provider-add-pill"
        onclick={() => showAddProviderModal = true}
        title="Add custom provider"
      >
        + Add Source
      </button>
    </div>
  </div>

  <!-- Neobrutalist Header & Lesson Dropdown -->
  <header class="neo-header">
    <div class="header-main-card neo-card">
      <div class="header-left">
        <span class="header-icon">🎹</span>
        <div class="header-info">
          <div class="meta-row">
            <span class="book-label">{currentBook?.title ?? 'Piano Practice'}</span>
            <!-- List Type Status Badge -->
            {#if currentListType === 'chapters'}
              <span class="mode-badge chapters">🔖 Bookmarked Video</span>
            {:else if currentListType === 'playlist'}
              <span class="mode-badge playlist">📑 YouTube Playlist</span>
            {:else}
              <span class="mode-badge singles">🎬 Individual Videos</span>
            {/if}
          </div>

          <div class="title-row">
            <button
              class="completion-btn {currentLesson?.isCompleted ? 'completed' : ''}"
              onclick={toggleLessonCompletion}
              title={currentLesson?.isCompleted ? 'Completed! Click to unmark' : 'Mark as completed'}
              aria-label="Toggle song completion"
            >
              {currentLesson?.isCompleted ? '✓' : '○'}
            </button>
            <button
              class="dropdown-trigger-btn"
              onclick={() => isDropdownOpen = !isDropdownOpen}
              aria-expanded={isDropdownOpen}
            >
              <h1 class="lesson-title">
                {currentLesson ? `${currentLesson.sequenceIndex}. ${currentLesson.title}` : 'Select a lesson...'}
              </h1>
              <span class="dropdown-arrow {isDropdownOpen ? 'open' : ''}">▼</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Nav Buttons & Playlist Position -->
      <div class="lesson-nav-actions">
        <button
          class="nav-btn prev-btn"
          disabled={!hasPrevLesson}
          onclick={prevLesson}
          title="Previous Lesson"
        >
          ⏮ Prev
        </button>
        <button
          class="nav-btn next-btn"
          disabled={!hasNextLesson}
          onclick={nextLesson}
          title="Next Lesson"
        >
          Next ⏭
        </button>
      </div>
    </div>

    <!-- Expandable Searchable Lesson Dropdown -->
    {#if isDropdownOpen}
      <div class="lesson-dropdown-panel neo-card">
        <div class="search-bar-row">
          <input
            type="text"
            bind:value={lessonSearch}
            placeholder="🔍 Search song or number..."
            class="dropdown-search-input"
          />
          <span class="lesson-count">{filteredLessons.length} songs</span>
        </div>

        <ul class="dropdown-list">
          {#each filteredLessons as l}
            <li>
              <button
                class="dropdown-item {currentLesson?.id === l.id ? 'active' : ''}"
                onclick={() => selectLesson(l)}
              >
                <span class="item-status">{l.isCompleted ? '✅' : '⚪'}</span>
                <span class="item-seq">#{l.sequenceIndex}</span>
                <span class="item-title">{l.title}</span>
                {#if currentListType === 'chapters' && l.endTime > 0}
                  <span class="item-timestamp">({formatTime(l.startTime)} – {formatTime(l.endTime)})</span>
                {/if}
              </button>
            </li>
          {/each}
          {#if filteredLessons.length === 0}
            <li class="no-matches">No songs matching "{lessonSearch}"</li>
          {/if}
        </ul>
      </div>
    {/if}
  </header>

  <!-- Built-in Metronome Widget -->
  {#if showMetronome}
    <Metronome />
  {/if}

  {#if currentLesson}
    <main class="practice-cockpit">
      <!-- Specialized Chapter Timeline for Bookmarked Video Mode -->
      {#if currentListType === 'chapters'}
        <ChapterTimeline
          {lessons}
          currentLessonId={currentLesson.id}
          {videoCurrentTime}
          {videoDuration}
          onSelectChapter={selectLesson}
        />
      {/if}

      <!-- Video Player Card -->
      <div class="player-card neo-card">
        <!-- YouTube Frame with Looper Action -->
        {#key `${currentLesson.youtubeVideoId}_${selectedProvider}`}
          <div
            use:youtubeLooper={{
              videoId: () => currentLesson?.youtubeVideoId,
              startTime: () => currentLesson?.startTime ?? 0,
              endTime: () => currentLesson?.endTime ?? 0,
              customLoopStart: () => customLoopA,
              customLoopEnd: () => customLoopB,
              playbackRate: () => playbackRate,
              isLooping: () => isLooping,
              onReady: (controller) => {
                playerController = controller;
              },
              onPlayerStateChange: handlePlayerStateChange,
              onSegmentComplete: handleSegmentComplete,
              onTimeUpdate: handleTimeUpdate,
              seekTarget: () => videoSeekTarget,
              _trigger: [playbackRate, isLooping, currentLesson?.youtubeVideoId, videoSeekTarget, customLoopA, customLoopB, autoAdvance]
            }}
            class="yt-frame"
          ></div>
        {/key}

        <!-- Interactive Progress Scrubber with A/B Loop Markers & Chapter Boundaries -->
        <div
          class="scrubber-track"
          role="slider"
          tabindex="0"
          aria-valuemin="0"
          aria-valuemax={videoDuration}
          aria-valuenow={videoCurrentTime}
          onclick={handleProgressClick}
          onkeydown={(e) => e.key === 'Enter' && handleProgressClick(e as any)}
        >
          <div class="scrubber-bar-bg">
            <!-- Active Loop / Chapter Region Highlight -->
            {#if videoDuration > 0}
              {@const startSec = customLoopA ?? currentLesson.startTime ?? 0}
              {@const endSec = (customLoopB ?? (currentLesson.endTime > 0 ? currentLesson.endTime : videoDuration))}
              {@const leftPct = (startSec / videoDuration) * 100}
              {@const widthPct = Math.max(0, ((endSec - startSec) / videoDuration) * 100)}
              <div
                class="loop-range-highlight"
                style="left: {leftPct}%; width: {widthPct}%;"
              ></div>
            {/if}

            <div
              class="scrubber-fill"
              style="width: {videoDuration ? (videoCurrentTime / videoDuration) * 100 : 0}%"
            ></div>

            <!-- Loop Marker Pins -->
            {#if customLoopA !== null && videoDuration > 0}
              <div
                class="loop-marker marker-a"
                style="left: {(customLoopA / videoDuration) * 100}%"
                title="Loop Point A: {formatTime(customLoopA)}"
              >
                A
              </div>
            {/if}
            {#if customLoopB !== null && videoDuration > 0}
              <div
                class="loop-marker marker-b"
                style="left: {(customLoopB / videoDuration) * 100}%"
                title="Loop Point B: {formatTime(customLoopB)}"
              >
                B
              </div>
            {/if}

            <div
              class="scrubber-knob"
              style="left: {videoDuration ? (videoCurrentTime / videoDuration) * 100 : 0}%"
            ></div>
          </div>

          <div class="scrubber-times">
            <span class="time-current">{formatTime(videoCurrentTime)}</span>
            {#if currentListType === 'chapters' && currentLesson.endTime > 0}
              <span class="chapter-readout">
                Chapter: {formatTime(currentLesson.startTime)} → {formatTime(currentLesson.endTime)} ({currentLesson.endTime - currentLesson.startTime}s)
              </span>
            {:else if customLoopA !== null || customLoopB !== null}
              <span class="loop-badge">
                A/B: {formatTime(customLoopA ?? currentLesson.startTime)} → {formatTime(customLoopB ?? (currentLesson.endTime > 0 ? currentLesson.endTime : videoDuration))}
              </span>
            {:else if currentListType === 'playlist'}
              <span class="playlist-badge">
                Track {currentIndex + 1} of {lessons.length}
              </span>
            {/if}
            <span class="time-duration">{formatTime(videoDuration)}</span>
          </div>
        </div>

        <!-- Master Transport Controls Bar -->
        <div class="transport-bar">
          <div class="transport-left">
            <button
              class="play-toggle-btn {isVideoPlaying ? 'playing' : ''}"
              onclick={togglePlayVideo}
              aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
            >
              {isVideoPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button class="skip-btn" onclick={() => seekBy(-5)} title="Rewind 5 seconds">⏪ 5s</button>
            <button class="skip-btn" onclick={() => seekBy(5)} title="Forward 5 seconds">5s ⏩</button>
          </div>

          <div class="transport-middle">
            <button
              class="loop-toggle-btn {isLooping ? 'active' : ''}"
              onclick={() => { isLooping = !isLooping; if (isLooping) autoAdvance = false; }}
              title="Loop current piece continuously"
            >
              🔄 Loop {isLooping ? 'ON' : 'OFF'}
            </button>

            <!-- Auto Advance / Continuous Play Toggle -->
            <button
              class="auto-advance-btn {autoAdvance ? 'active' : ''}"
              onclick={() => { autoAdvance = !autoAdvance; if (autoAdvance) isLooping = false; }}
              title={currentListType === 'chapters' ? 'Auto-advance to next chapter bookmark on finish' : 'Auto-advance to next song on finish'}
            >
              {autoAdvance ? '⏩ Continuous ON' : '⏭️ Auto-Next OFF'}
            </button>

            <!-- A/B Marker Controls -->
            <button class="ab-btn {customLoopA !== null ? 'set' : ''}" onclick={setLoopA} title="Set Loop Start at current time">
              🚩 {customLoopA !== null ? `A: ${formatTime(customLoopA)}` : 'Set A'}
            </button>
            <button class="ab-btn {customLoopB !== null ? 'set' : ''}" onclick={setLoopB} title="Set Loop End at current time">
              🏁 {customLoopB !== null ? `B: ${formatTime(customLoopB)}` : 'Set B'}
            </button>
            {#if customLoopA !== null || customLoopB !== null}
              <button class="ab-reset-btn" onclick={resetLoopAB} title="Clear A/B loop points">✖</button>
            {/if}
          </div>

          <div class="speed-selector">
            {#each [0.5, 0.7, 0.85, 1.0, 1.25] as rate}
              <button
                class="speed-chip {playbackRate === rate ? 'active' : ''}"
                onclick={() => changePlaybackRate(rate)}
              >
                {rate}x
              </button>
            {/each}
          </div>
        </div>
      </div>

      <!-- Mascot Pip Companion -->
      <MascotPip state={mascotState} message={mascotMessage} />

      <!-- Dual Audio Recording Studio -->
      {#if !hideAudioTakes}
        <section class="audio-studio-grid">
          <!-- Student Practice Take Card -->
          <div class="studio-card student-card neo-card">
            <div class="studio-header">
              <div class="title-wrap">
                <span class="studio-icon">🧒</span>
                <h3>My Practice Take</h3>
              </div>
              {#if studentTrack}
                <button
                  class="trash-btn"
                  onclick={() => deleteTrack('student')}
                  title="Delete take"
                >
                  🗑️
                </button>
              {/if}
            </div>

            {#if studentAudioUrl}
              <audio src={studentAudioUrl} controls class="audio-player"></audio>
              {#if studentTrack?.durationSeconds}
                <div class="take-meta">Take length: {formatTime(studentTrack.durationSeconds)}</div>
              {/if}
            {:else}
              <p class="empty-state">No take recorded yet. Press below to start!</p>
            {/if}

            <button
              class="record-btn student {studentRecorder.isRecording ? 'recording' : ''}"
              onclick={toggleStudentRecord}
            >
              {#if studentRecorder.isRecording}
                ⏹ Stop Recording ({formatTime(studentRecorder.recordingSeconds)})
              {:else}
                🎙️ {studentAudioUrl ? 'Re-record My Take' : 'Record My Take'}
              {/if}
            </button>

            {#if studentRecorder.isRecording}
              <div class="vu-wrapper neo-border">
                <div class="vu-fill student" style="width: {studentRecorder.volumeLevel * 100}%"></div>
              </div>
            {/if}
          </div>

          <!-- Teacher Reference Card -->
          <div class="studio-card teacher-card neo-card">
            <div class="studio-header">
              <div class="title-wrap">
                <span class="studio-icon">👩‍🏫</span>
                <h3>Teacher Reference</h3>
              </div>
              {#if teacherTrack && teacherAuth.isUnlocked}
                <button
                  class="trash-btn"
                  onclick={() => deleteTrack('teacher')}
                  title="Delete reference"
                >
                  🗑️
                </button>
              {/if}
            </div>

            {#if teacherAudioUrl}
              <audio src={teacherAudioUrl} controls class="audio-player"></audio>
              {#if teacherTrack?.durationSeconds}
                <div class="take-meta">Reference: {formatTime(teacherTrack.durationSeconds)}</div>
              {/if}
            {:else}
              <p class="empty-state">No master reference track recorded.</p>
            {/if}

            <button
              class="record-btn teacher {teacherRecorder.isRecording ? 'recording' : ''}"
              onclick={handleTeacherRecord}
            >
              {#if teacherRecorder.isRecording}
                ⏹ Stop Recording ({formatTime(teacherRecorder.recordingSeconds)})
              {:else}
                {teacherAuth.isUnlocked ? '🎙️ Record Reference' : '🔒 Teacher Unlock'}
              {/if}
            </button>

            {#if teacherRecorder.isRecording}
              <div class="vu-wrapper neo-border">
                <div class="vu-fill teacher" style="width: {teacherRecorder.volumeLevel * 100}%"></div>
              </div>
            {/if}
          </div>
        </section>
      {/if}

      <!-- Interactive Learning Checkpoints -->
      <section class="checkpoints-card neo-card">
        <div class="checkpoints-top">
          <div class="title-group">
            <span class="checkpoints-icon">🎯</span>
            <h3>Practice Checkpoints</h3>
          </div>
          {#if !isEditingCheckpoints}
            <button class="edit-checkpoints-btn" onclick={handleEditCheckpoints}>
              {teacherAuth.isUnlocked ? '✏️ Edit Points' : '🔒 Teacher Edit'}
            </button>
          {/if}
        </div>

        {#if isEditingCheckpoints}
          <p class="edit-instructions">Enter each learning point on a separate line:</p>
          <textarea bind:value={editCheckpointsText} class="neo-textarea" rows="4"></textarea>
          <div class="edit-btn-row">
            <button class="action-btn primary-btn" onclick={saveCheckpoints}>Save Points</button>
            <button class="action-btn outline-btn" onclick={() => isEditingCheckpoints = false}>Cancel</button>
          </div>
        {:else}
          <ul class="checkpoints-checklist">
            {#each currentLesson.checkpoints as pt, i}
              {@const key = `${currentLesson.id}_cp_${i}`}
              <li>
                <button
                  class="checkpoint-item {completedCheckpoints[key] ? 'done' : ''}"
                  onclick={() => toggleCheckpoint(i)}
                >
                  <span class="check-box">{completedCheckpoints[key] ? '✅' : '⬜'}</span>
                  <span class="check-text">{pt}</span>
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </section>
    </main>
  {/if}

  <!-- Footer Controls -->
  <footer class="neo-footer">
    <button class="footer-settings-btn" onclick={openSettings}>
      ⚙️ App Settings & Preferences
    </button>
  </footer>

  <!-- Add Custom Provider Modal -->
  {#if showAddProviderModal}
    <div class="modal-overlay">
      <div class="modal-card neo-card">
        <h2>➕ Add Custom Channel / Source</h2>

        <div class="form-group">
          <span class="form-label">Provider / Channel Name:</span>
          <input
            type="text"
            bind:value={newProviderName}
            class="neo-input"
            placeholder="e.g. My Piano Teacher"
          />
        </div>

        <div class="form-group">
          <span class="form-label">Lesson List Type:</span>
          <div class="type-selector-pills">
            <button
              class="type-pill {newProviderType === 'singles' ? 'active' : ''}"
              onclick={() => newProviderType = 'singles'}
            >
              🎬 Individual Videos
            </button>
            <button
              class="type-pill {newProviderType === 'playlist' ? 'active' : ''}"
              onclick={() => newProviderType = 'playlist'}
            >
              📑 YouTube Playlist
            </button>
            <button
              class="type-pill {newProviderType === 'chapters' ? 'active' : ''}"
              onclick={() => newProviderType = 'chapters'}
            >
              🔖 Video with Bookmarks
            </button>
          </div>
        </div>

        <div class="form-group">
          <span class="form-label">Source Input:</span>
          {#if newProviderType === 'singles'}
            <p class="field-hint">Paste one YouTube Video ID per line (e.g. <code>CUvzy7Tu6TE</code>).</p>
            <textarea
              bind:value={newProviderInput}
              class="neo-textarea"
              rows="4"
              placeholder="CUvzy7Tu6TE&#10;DPyC2_Q1yhY&#10;gTTaiCd8fsQ"
            ></textarea>
          {:else if newProviderType === 'playlist'}
            <p class="field-hint">Paste the YouTube Playlist ID (e.g. <code>PL10p3mlGiANOP_3RdrSZYv3kG5AzDmONh</code>).</p>
            <textarea
              bind:value={newProviderInput}
              class="neo-textarea"
              rows="2"
              placeholder="PL10p3mlGiANOP_3RdrSZYv3kG5AzDmONh"
            ></textarea>
          {:else if newProviderType === 'chapters'}
            <p class="field-hint">Line 1: Video ID. Following lines: "MM:SS Chapter Title".</p>
            <textarea
              bind:value={newProviderInput}
              class="neo-textarea"
              rows="5"
              placeholder="lguxe5bEqXo&#10;0:00 Schaukeln&#10;1:08 Gespräch in der Höhle&#10;1:44 Gespenster?"
            ></textarea>
          {/if}
        </div>

        {#if addProviderError}
          <p class="form-error">{addProviderError}</p>
        {/if}

        <div class="modal-btn-row">
          <button class="action-btn primary-btn" onclick={handleAddProvider} disabled={isAddingProvider}>
            {isAddingProvider ? 'Adding...' : 'Add Channel'}
          </button>
          <button class="action-btn outline-btn" onclick={() => showAddProviderModal = false}>Cancel</button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Settings Modal -->
  {#if showSettingsModal}
    <div class="modal-overlay">
      <div class="modal-card neo-card">
        <h2>⚙️ Companion Settings</h2>

        <div class="form-group">
          <span class="form-label">Active Book:</span>
          <select
            bind:value={selectedBookId}
            class="neo-select"
            onchange={() => loadDataForSelectedBook()}
          >
            {#each books as book}
              <option value={book.id}>{book.title}</option>
            {/each}
          </select>
        </div>

        <div class="form-group">
          <span class="form-label">Default Channel:</span>
          <select
            bind:value={defaultProvider}
            class="neo-select"
            onchange={() => localStorage.setItem('defaultProvider', defaultProvider)}
          >
            <option value="">(None)</option>
            {#each providers as p}
              <option value={p}>{p}</option>
            {/each}
          </select>
        </div>

        <div class="form-group">
          <span class="form-label">Audio Studio Visibility:</span>
          <button
            class="action-btn {hideAudioTakes ? 'primary-btn' : 'outline-btn'}"
            onclick={() => {
              hideAudioTakes = !hideAudioTakes;
              localStorage.setItem('hideAudioTakes', hideAudioTakes.toString());
            }}
          >
            {hideAudioTakes ? 'Studio Takes Hidden' : 'Studio Takes Visible'}
          </button>
        </div>

        <div class="form-group">
          <span class="form-label">Theme Background:</span>
          <div class="theme-palette">
            <button class="color-dot" style="background: #f5f0ea" aria-label="Default Sand" onclick={() => applyTheme('#f5f0ea')}></button>
            <button class="color-dot" style="background: #E8F5E9" aria-label="Soft Mint" onclick={() => applyTheme('#E8F5E9')}></button>
            <button class="color-dot" style="background: #E3F2FD" aria-label="Sky Blue" onclick={() => applyTheme('#E3F2FD')}></button>
            <button class="color-dot" style="background: #FCE4EC" aria-label="Pastel Pink" onclick={() => applyTheme('#FCE4EC')}></button>
            <button class="color-dot" style="background: #FFF9C4" aria-label="Warm Butter" onclick={() => applyTheme('#FFF9C4')}></button>
          </div>
        </div>

        <div class="form-group">
          <span class="form-label">PWA Version & Updates:</span>
          <button class="action-btn outline-btn" onclick={forceUpdateApp}>
            🔄 Check for Updates / Refresh App
          </button>
        </div>

        <div class="modal-btn-row">
          <button class="action-btn primary-btn" onclick={() => showSettingsModal = false}>Done</button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Teacher Gate Verification Modal -->
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
        } else if (pendingTeacherAction === 'settings') {
          showSettingsModal = true;
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
  /* Layout Root */
  .cockpit-container {
    max-width: 860px;
    margin: 0 auto;
    padding: 16px 12px 32px 12px;
  }

  /* Neo-brutalist Base Cards */
  .neo-card {
    background: #ffffff;
    border: 3px solid #000000;
    border-radius: 12px;
    box-shadow: 4px 4px 0px #000000;
  }

  .neo-border {
    border: 2px solid #000000;
    border-radius: 8px;
  }

  /* Top Navigation & Book Tabs */
  .curriculum-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .book-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .book-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #ffffff;
    border: 2px solid #000000;
    border-radius: 20px;
    padding: 6px 14px;
    font-weight: 800;
    font-size: 0.85rem;
    color: #121212;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
    transition: transform 0.1s, background 0.1s;
  }

  .book-tab:active {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 #000;
  }

  .book-tab.active {
    background: #FFD54F;
    border-width: 3px;
  }

  .top-icon-btn {
    border: 2px solid #000;
    border-radius: 20px;
    background: #fff;
    padding: 6px 12px;
    font-size: 0.85rem;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
  }

  .top-icon-btn.active {
    background: #FFCA28;
  }

  /* Provider Pill Bar */
  .provider-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .provider-badge {
    font-weight: 800;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #444;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  .provider-pill-scroll {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 4px;
    align-items: center;
  }

  .provider-pill {
    background: #ffffff;
    border: 2px solid #000000;
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 0.8rem;
    font-weight: 700;
    color: #121212;
    cursor: pointer;
    white-space: nowrap;
    box-shadow: 2px 2px 0 #000;
    transition: transform 0.08s;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .provider-pill:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }

  .provider-pill.active {
    background: #42A5F5;
    color: #ffffff;
  }

  .type-icon {
    font-size: 0.85rem;
  }

  .provider-add-pill {
    background: #E8F5E9;
    border: 2px dashed #000;
    border-radius: 16px;
    padding: 4px 10px;
    font-size: 0.75rem;
    font-weight: 800;
    cursor: pointer;
    color: #2E7D32;
    white-space: nowrap;
  }

  /* Header Card */
  .neo-header {
    position: relative;
    margin-bottom: 20px;
    z-index: 40;
  }

  .header-main-card {
    background: #E8F5E9;
    padding: 12px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 250px;
  }

  .header-icon {
    font-size: 2.2rem;
  }

  .header-info {
    flex: 1;
  }

  .meta-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
    flex-wrap: wrap;
  }

  .book-label {
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #2E7D32;
  }

  .mode-badge {
    font-size: 0.7rem;
    font-weight: 800;
    padding: 1px 6px;
    border: 1.5px solid #000;
    border-radius: 6px;
    text-transform: uppercase;
  }

  .mode-badge.chapters {
    background: #FFE082;
    color: #000;
  }

  .mode-badge.playlist {
    background: #BBDEFB;
    color: #000;
  }

  .mode-badge.singles {
    background: #C8E6C9;
    color: #000;
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .completion-btn {
    background: #ffffff;
    border: 2px solid #000;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    font-weight: 900;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    box-shadow: 1px 1px 0 #000;
    flex-shrink: 0;
  }

  .completion-btn.completed {
    background: #66BB6A;
    color: #ffffff;
  }

  .dropdown-trigger-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
  }

  .lesson-title {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 900;
    color: #000;
    line-height: 1.2;
  }

  .dropdown-arrow {
    font-size: 0.9rem;
    transition: transform 0.2s;
  }

  .dropdown-arrow.open {
    transform: rotate(180deg);
  }

  .lesson-nav-actions {
    display: flex;
    gap: 6px;
  }

  .nav-btn {
    border: 2px solid #000;
    background: #fff;
    border-radius: 8px;
    padding: 8px 12px;
    font-weight: 800;
    font-size: 0.85rem;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
  }

  .nav-btn:active:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 #000;
  }

  .nav-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* Searchable Lesson Dropdown Panel */
  .lesson-dropdown-panel {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 8px;
    background: #FFF9C4;
    padding: 12px;
    max-height: 380px;
    display: flex;
    flex-direction: column;
    z-index: 100;
  }

  .search-bar-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .dropdown-search-input {
    flex: 1;
    border: 2px solid #000;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 0.95rem;
    font-weight: 600;
    background: #fff;
  }

  .lesson-count {
    font-size: 0.8rem;
    font-weight: 800;
    color: #555;
    white-space: nowrap;
  }

  .dropdown-list {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    border: 2px solid #000;
    border-radius: 8px;
    background: #ffffff;
  }

  .dropdown-item {
    width: 100%;
    text-align: left;
    padding: 10px 14px;
    background: none;
    border: none;
    border-bottom: 1px solid #ddd;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .dropdown-item:hover {
    background: #FFF176;
  }

  .dropdown-item.active {
    background: #FFD54F;
  }

  .item-status {
    font-size: 0.85rem;
  }

  .item-seq {
    color: #D32F2F;
    font-weight: 900;
    min-width: 28px;
  }

  .item-title {
    flex: 1;
    color: #121212;
  }

  .item-timestamp {
    font-size: 0.75rem;
    color: #666;
    font-weight: 700;
  }

  .no-matches {
    padding: 16px;
    text-align: center;
    font-style: italic;
    color: #777;
  }

  /* Player Card & Scrubber */
  .player-card {
    background: #000000;
    overflow: hidden;
    margin-bottom: 20px;
  }

  .yt-frame {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-bottom: 3px solid #000;
    background: #111;
  }

  .scrubber-track {
    background: #ffffff;
    padding: 10px 16px 6px 16px;
    border-bottom: 3px solid #000;
    cursor: pointer;
    user-select: none;
  }

  .scrubber-bar-bg {
    height: 14px;
    background: #E0E0E0;
    border: 2px solid #000;
    border-radius: 7px;
    position: relative;
    overflow: visible;
  }

  .loop-range-highlight {
    position: absolute;
    top: 0;
    height: 100%;
    background: rgba(255, 193, 7, 0.45);
    border-left: 2px solid #FF9800;
    border-right: 2px solid #FF9800;
    pointer-events: none;
  }

  .scrubber-fill {
    height: 100%;
    background: #4CAF50;
    border-radius: 5px;
    pointer-events: none;
  }

  .scrubber-knob {
    width: 20px;
    height: 20px;
    background: #FFB300;
    border: 2px solid #000;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    box-shadow: 1px 1px 0 #000;
  }

  .loop-marker {
    position: absolute;
    top: -18px;
    transform: translateX(-50%);
    font-size: 0.65rem;
    font-weight: 900;
    padding: 1px 4px;
    border-radius: 4px;
    border: 1px solid #000;
    color: #fff;
    pointer-events: none;
  }

  .marker-a {
    background: #E91E63;
  }

  .marker-b {
    background: #3F51B5;
  }

  .scrubber-times {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    font-weight: 800;
    margin-top: 6px;
    gap: 8px;
  }

  .chapter-readout {
    background: #FFF9C4;
    border: 1px solid #000;
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 0.75rem;
    color: #333;
  }

  .playlist-badge {
    background: #E3F2FD;
    border: 1px solid #000;
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 0.75rem;
    color: #1565C0;
  }

  .loop-badge {
    background: #FFF9C4;
    border: 1px solid #000;
    border-radius: 6px;
    padding: 1px 6px;
    font-size: 0.75rem;
  }

  /* Transport Controls Bar */
  .transport-bar {
    background: #FAFAFA;
    padding: 10px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .transport-left, .transport-middle, .speed-selector {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .play-toggle-btn {
    background: #4CAF50;
    color: #ffffff;
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 900;
    font-size: 0.95rem;
    padding: 8px 16px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
  }

  .play-toggle-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 #000;
  }

  .play-toggle-btn.playing {
    background: #FF9800;
  }

  .skip-btn {
    background: #ffffff;
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 800;
    font-size: 0.8rem;
    padding: 8px 10px;
    cursor: pointer;
    box-shadow: 1px 1px 0 #000;
  }

  .loop-toggle-btn {
    background: #ffffff;
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 800;
    font-size: 0.8rem;
    padding: 8px 10px;
    cursor: pointer;
    box-shadow: 1px 1px 0 #000;
  }

  .loop-toggle-btn.active {
    background: #2196F3;
    color: #ffffff;
  }

  .auto-advance-btn {
    background: #ffffff;
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 800;
    font-size: 0.8rem;
    padding: 8px 10px;
    cursor: pointer;
    box-shadow: 1px 1px 0 #000;
  }

  .auto-advance-btn.active {
    background: #9C27B0;
    color: #ffffff;
  }

  .ab-btn {
    background: #ffffff;
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 800;
    font-size: 0.8rem;
    padding: 8px 8px;
    cursor: pointer;
    box-shadow: 1px 1px 0 #000;
  }

  .ab-btn.set {
    background: #E1BEE7;
  }

  .ab-reset-btn {
    background: #FFCDD2;
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 800;
    padding: 8px 8px;
    cursor: pointer;
  }

  .speed-chip {
    background: #ffffff;
    border: 2px solid #000;
    border-radius: 6px;
    font-weight: 800;
    font-size: 0.75rem;
    padding: 6px 8px;
    cursor: pointer;
    box-shadow: 1px 1px 0 #000;
  }

  .speed-chip.active {
    background: #212121;
    color: #ffffff;
  }

  /* Audio Studio */
  .audio-studio-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }

  @media (max-width: 640px) {
    .audio-studio-grid {
      grid-template-columns: 1fr;
    }
  }

  .studio-card {
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .student-card {
    background: #E8F5E9;
  }

  .teacher-card {
    background: #E3F2FD;
  }

  .studio-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .studio-icon {
    font-size: 1.4rem;
  }

  .studio-card h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 900;
  }

  .trash-btn {
    background: none;
    border: 1px solid #000;
    border-radius: 4px;
    cursor: pointer;
    padding: 2px 6px;
    font-size: 0.9rem;
  }

  .audio-player {
    width: 100%;
    margin-top: 4px;
  }

  .take-meta {
    font-size: 0.75rem;
    font-weight: 700;
    color: #555;
  }

  .empty-state {
    font-size: 0.85rem;
    font-style: italic;
    color: #666;
    margin: 4px 0;
  }

  .record-btn {
    width: 100%;
    border: 3px solid #000;
    border-radius: 8px;
    font-weight: 900;
    font-size: 0.95rem;
    padding: 10px 14px;
    cursor: pointer;
    box-shadow: 3px 3px 0 #000;
    margin-top: 6px;
    transition: transform 0.1s;
  }

  .record-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 #000;
  }

  .record-btn.student {
    background: #4CAF50;
    color: #ffffff;
  }

  .record-btn.teacher {
    background: #ffffff;
    color: #000000;
  }

  .record-btn.recording {
    background: #F44336;
    color: #ffffff;
    animation: pulse 1s infinite;
  }

  .vu-wrapper {
    height: 12px;
    background: #ffffff;
    overflow: hidden;
    margin-top: 6px;
  }

  .vu-fill {
    height: 100%;
    transition: width 0.05s ease;
  }

  .vu-fill.student {
    background: #4CAF50;
  }

  .vu-fill.teacher {
    background: #2196F3;
  }

  /* Checkpoints Card */
  .checkpoints-card {
    background: #EDE7F6;
    padding: 14px 18px;
    margin-bottom: 24px;
  }

  .checkpoints-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .title-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .checkpoints-icon {
    font-size: 1.3rem;
  }

  .checkpoints-card h3 {
    margin: 0;
    font-weight: 900;
    font-size: 1.2rem;
  }

  .edit-checkpoints-btn {
    border: 2px solid #000;
    background: #ffffff;
    border-radius: 6px;
    font-weight: 800;
    font-size: 0.8rem;
    padding: 4px 10px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
  }

  .checkpoints-checklist {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .checkpoint-item {
    width: 100%;
    text-align: left;
    background: #ffffff;
    border: 2px solid #000;
    border-radius: 8px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
    transition: background 0.1s, transform 0.05s;
  }

  .checkpoint-item:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }

  .checkpoint-item.done {
    background: #C8E6C9;
    text-decoration: line-through;
    color: #2E7D32;
  }

  .check-box {
    font-size: 1.1rem;
  }

  .check-text {
    font-weight: 700;
    font-size: 0.95rem;
  }

  .edit-instructions {
    font-size: 0.85rem;
    color: #444;
    margin-bottom: 6px;
  }

  .neo-textarea {
    width: 100%;
    border: 3px solid #000;
    border-radius: 8px;
    padding: 10px;
    font-family: inherit;
    font-size: 0.95rem;
    box-sizing: border-box;
  }

  .edit-btn-row {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 8px;
  }

  /* Footer */
  .neo-footer {
    border-top: 3px solid #000;
    padding-top: 20px;
    text-align: center;
  }

  .footer-settings-btn {
    border: 3px solid #000;
    border-radius: 8px;
    background: #ffffff;
    padding: 10px 20px;
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
    box-shadow: 3px 3px 0 #000;
  }

  .footer-settings-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 #000;
  }

  /* Modals */
  .modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-card {
    background: #ffffff;
    padding: 24px;
    max-width: 480px;
    width: 90%;
    box-sizing: border-box;
  }

  .modal-card h2 {
    margin-top: 0;
    font-size: 1.3rem;
    font-weight: 900;
  }

  .form-group {
    margin: 16px 0;
  }

  .form-label {
    display: block;
    font-weight: 800;
    font-size: 0.85rem;
    margin-bottom: 6px;
    color: #222;
  }

  .type-selector-pills {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .type-pill {
    border: 2px solid #000;
    border-radius: 16px;
    background: #fff;
    padding: 6px 12px;
    font-weight: 800;
    font-size: 0.8rem;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
  }

  .type-pill.active {
    background: #FFCA28;
    border-width: 3px;
  }

  .neo-input, .neo-select {
    width: 100%;
    border: 3px solid #000;
    border-radius: 8px;
    padding: 10px;
    font-size: 0.95rem;
    background: #fff;
    box-sizing: border-box;
  }

  .field-hint {
    font-size: 0.8rem;
    color: #666;
    margin: 4px 0 6px 0;
  }

  .form-error {
    color: #D32F2F;
    font-weight: 800;
    font-size: 0.85rem;
  }

  .modal-btn-row {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
  }

  .action-btn {
    border: 3px solid #000;
    border-radius: 8px;
    font-weight: 800;
    padding: 10px 16px;
    cursor: pointer;
    font-size: 0.9rem;
    box-shadow: 2px 2px 0 #000;
  }

  .action-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 #000;
  }

  .action-btn.primary-btn {
    background: #FFCA28;
    color: #000;
  }

  .action-btn.outline-btn {
    background: #ffffff;
    color: #000;
  }

  .theme-palette {
    display: flex;
    gap: 10px;
  }

  .color-dot {
    width: 36px;
    height: 36px;
    border: 3px solid #000;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(0.97); }
    100% { transform: scale(1); }
  }
</style>
