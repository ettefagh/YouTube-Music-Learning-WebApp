<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import {
    db,
    initDatabase,
    detectListType,
    type LocalLesson,
    type LocalAudioTrack,
    type LocalBook,
    type LessonListType
  } from '#lib/db/db.js';
  import { youtubeLooper, type YouTubePlayerController } from '#lib/actions/youtubePlayer.svelte.js';
  import { AudioRecorderEngine } from '#lib/audio/audioRecorder.svelte.js';
  import { teacherAuth } from '#lib/stores/teacherAuth.svelte.js';
  import MascotPip from '#lib/components/MascotPip.svelte';
  import Metronome from '#lib/components/Metronome.svelte';
  import ChapterTimeline from '#lib/components/ChapterTimeline.svelte';
  import OnboardingModal from '#lib/components/OnboardingModal.svelte';
  import TeacherGate from '#lib/components/TeacherGate.svelte';
  import { longpress } from '#lib/actions/longpress.js';

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

  const BUILTIN_PROVIDERS = [
    'Anikó Drabon (Singles)',
    'VikaPiano (Playlist)',
    'Piano Companion (Chapters)',
    'Anikó Drabon (Playlist)',
    'Gavin Brady (Chapters)'
  ];

  let providerSummaries = $derived(
    providers.map(pName => {
      const pLessons = allLessons.filter(l => l.providerName === pName);
      const type = detectListType(pLessons, pName);
      const isBuiltin = BUILTIN_PROVIDERS.includes(pName);
      return {
        name: pName,
        type,
        count: pLessons.length,
        isBuiltin
      };
    })
  );

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

  // --- Enhanced Player Controls State ---
  let isFullscreen = $state<boolean>(false);
  let isTheaterMode = $state<boolean>(false);
  let isMuted = $state<boolean>(false);
  let playerCardElement = $state<HTMLElement | null>(null);

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

  // --- Practice Lab Modal & Count-In Pre-Roll ---
  let showPracticeLabModal = $state<boolean>(false);
  let countInTimer = $state<number | null>(null);
  let countInTarget = $state<'play' | 'record' | null>(null);
  let countInInterval: any = null;

  // --- Collapsible Cards State ---
  let collapsedSections = $state<Record<string, boolean>>({
    timeline: false,
    metronome: false,
    studio: false,
    checkpoints: false
  });

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

    const savedCollapsed = localStorage.getItem('collapsedSections');
    if (savedCollapsed) {
      try {
        collapsedSections = { ...collapsedSections, ...JSON.parse(savedCollapsed) };
      } catch (e) {
        console.warn('Failed to parse collapsedSections:', e);
      }
    }

    await initDatabase();
    books = await db.books.toArray();
    if (books.length > 0) {
      selectedBookId = books[0].id;
      await loadDataForSelectedBook();
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    }
  });

  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    }
  });

  function handleFullscreenChange() {
    if (typeof document !== 'undefined') {
      isFullscreen = !!document.fullscreenElement;
    }
  }

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

  function toggleFullscreen() {
    if (!playerCardElement) return;
    if (!document.fullscreenElement) {
      if (playerCardElement.requestFullscreen) {
        playerCardElement.requestFullscreen().catch(err => console.warn('Fullscreen error:', err));
      } else if ((playerCardElement as any).webkitRequestFullscreen) {
        (playerCardElement as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.warn('Exit fullscreen error:', err));
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  }

  function toggleTheaterMode() {
    isTheaterMode = !isTheaterMode;
  }

  function toggleMute() {
    if (!playerController) return;
    if (isMuted) {
      playerController.unMute();
      isMuted = false;
    } else {
      playerController.mute();
      isMuted = true;
    }
  }

  function restartPiece() {
    const startTime = currentLesson?.startTime ?? 0;
    videoSeekTarget = startTime;
    if (playerController) {
      playerController.seekTo(startTime);
    }
  }

  function deepReset() {
    restartPiece();
    resetLoopAB();
    mascotState = 'cheering';
    mascotMessage = 'Fresh start! Song restarted & loop markers cleared.';
  }

  function toggleSection(sectionKey: string) {
    collapsedSections[sectionKey] = !collapsedSections[sectionKey];
    localStorage.setItem('collapsedSections', JSON.stringify(collapsedSections));
  }

  function startCountIn(target: 'play' | 'record') {
    if (countInTimer !== null) return;
    countInTarget = target;
    countInTimer = 3;

    if (countInInterval) clearInterval(countInInterval);
    countInInterval = setInterval(() => {
      if (countInTimer === null) {
        clearInterval(countInInterval);
        return;
      }
      if (countInTimer > 1) {
        countInTimer -= 1;
      } else {
        clearInterval(countInInterval);
        const action = countInTarget;
        countInTimer = null;
        countInTarget = null;
        if (action === 'play') {
          playerController?.play();
        } else if (action === 'record') {
          studentRecorder.start();
          mascotState = 'listening';
          mascotMessage = 'Pip is listening to your piano!';
        }
      }
    }, 1000);
  }

  function cancelCountIn() {
    if (countInInterval) clearInterval(countInInterval);
    countInTimer = null;
    countInTarget = null;
  }

  function nudgeLoopA(delta: number) {
    const current = customLoopA ?? currentLesson?.startTime ?? 0;
    const next = Math.max(0, current + delta);
    customLoopA = Math.round(next * 10) / 10;
    if (customLoopB !== null && customLoopA >= customLoopB) {
      customLoopB = customLoopA + 1;
    }
    isLooping = true;
  }

  function nudgeLoopB(delta: number) {
    const current = customLoopB ?? (currentLesson?.endTime && currentLesson.endTime > 0 ? currentLesson.endTime : videoDuration);
    const next = Math.max((customLoopA ?? 0) + 0.5, current + delta);
    customLoopB = Math.round(next * 10) / 10;
    isLooping = true;
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
  async function deleteCustomProvider(providerName: string) {
    if (BUILTIN_PROVIDERS.includes(providerName)) return;
    const confirmDelete = window.confirm(`Are you sure you want to remove channel "${providerName}" and all its tracks?`);
    if (!confirmDelete) return;

    const lessonIdsToDelete = allLessons
      .filter(l => l.providerName === providerName)
      .map(l => l.id);

    await db.lessons.bulkDelete(lessonIdsToDelete);

    if (defaultProvider === providerName) {
      defaultProvider = '';
      localStorage.removeItem('defaultProvider');
    }

    await loadDataForSelectedBook();

    if (selectedProvider === providerName) {
      if (providers.length > 0) {
        selectProvider(providers[0]);
      } else {
        currentLesson = null;
      }
    }
  }

  function extractYouTubeVideoId(input: string): string {
    const trimmed = input.trim();
    const urlMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
    if (urlMatch) return urlMatch[1];
    const idMatch = trimmed.match(/([a-zA-Z0-9_-]{11})/);
    return idMatch ? idMatch[1] : trimmed;
  }

  function extractYouTubePlaylistId(input: string): string {
    const trimmed = input.trim();
    const match = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : trimmed;
  }

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
        const lines = newProviderInput.split('\n').map(l => l.trim()).filter(l => l);
        lines.forEach((line, index) => {
          let title = `Piece ${index + 1}`;
          let videoUrlOrId = line;

          const separatorMatch = line.match(/^(.*?)\s*[-:]\s*(https?:\/\/.*|[a-zA-Z0-9_-]{11})$/);
          if (separatorMatch) {
            title = separatorMatch[1].trim() || title;
            videoUrlOrId = separatorMatch[2].trim();
          }

          const videoId = extractYouTubeVideoId(videoUrlOrId);
          if (videoId) {
            newLessons.push({
              ...baseLessonParams,
              id: crypto.randomUUID(),
              title,
              sequenceIndex: index + 1,
              youtubeVideoId: videoId
            });
          }
        });
      } else if (newProviderType === 'playlist') {
        const playlistId = extractYouTubePlaylistId(newProviderInput.trim());
        const res = await fetch(`https://inv.nadeko.net/api/v1/playlists/${playlistId}`);
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
        const videoId = extractYouTubeVideoId(lines[0]);
        const chapterLines = lines.slice(1);

        const timeToSeconds = (timeStr: string) => {
          const parts = timeStr.split(':').map(Number);
          if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
          return parts[0] * 60 + parts[1];
        };

        const parsedChapters: Array<{ time: string; title: string }> = [];
        const regex = /(?:^|\s)(\d{1,2}:\d{2}(?::\d{2})?)\s*[-:]?\s*(.*)/;
        for (const line of chapterLines) {
          const match = regex.exec(line);
          if (match) {
            parsedChapters.push({ time: match[1], title: match[2].trim() || `Chapter ${parsedChapters.length + 1}` });
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
        addProviderError = 'No valid tracks could be generated from the input.';
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
    <div class="cockpit-card-wrap">
      <button
        class="section-collapse-header"
        onclick={() => toggleSection('metronome')}
        aria-expanded={!collapsedSections.metronome}
      >
        <div class="collapse-title-row">
          <span class="collapse-chevron">{collapsedSections.metronome ? '▶' : '▼'}</span>
          <span class="collapse-title">⏱️ Interactive Metronome</span>
        </div>
        <span class="collapse-summary-badge">Rhythm Practice</span>
      </button>
      {#if !collapsedSections.metronome}
        <Metronome />
      {/if}
    </div>
  {/if}

  {#if currentLesson}
    <main class="practice-cockpit">
      <!-- Specialized Chapter Timeline for Bookmarked Video Mode -->
      {#if currentListType === 'chapters'}
        <div class="cockpit-card-wrap">
          <button
            class="section-collapse-header"
            onclick={() => toggleSection('timeline')}
            aria-expanded={!collapsedSections.timeline}
          >
            <div class="collapse-title-row">
              <span class="collapse-chevron">{collapsedSections.timeline ? '▶' : '▼'}</span>
              <span class="collapse-title">📖 Chapter Timeline</span>
            </div>
            <span class="collapse-summary-badge">
              {currentLesson.title} ({formatTime(currentLesson.startTime)} → {formatTime(currentLesson.endTime)})
            </span>
          </button>
          {#if !collapsedSections.timeline}
            <ChapterTimeline
              {lessons}
              currentLessonId={currentLesson.id}
              {videoCurrentTime}
              {videoDuration}
              onSelectChapter={selectLesson}
            />
          {/if}
        </div>
      {/if}

      <!-- Video Player Card -->
      <div
        class="player-card neo-card {isTheaterMode ? 'theater-mode' : ''} {isFullscreen ? 'is-fullscreen' : ''}"
        bind:this={playerCardElement}
      >
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

        <!-- Master Kid-First Transport Controls Bar -->
        <div class="transport-bar">
          <div class="transport-left">
            <button
              class="play-toggle-btn {isVideoPlaying ? 'playing' : ''}"
              use:longpress={{
                duration: 500,
                onLongPress: () => { if (!isVideoPlaying) startCountIn('play'); },
                onClick: togglePlayVideo
              }}
              aria-label={isVideoPlaying ? 'Pause video' : 'Play video (Hold for 3s count-in)'}
              title="Tap to Play/Pause • Hold for 3s Count-in"
            >
              {isVideoPlaying ? '⏸ Pause' : '▶ Play'}
            </button>

            {#if !isVideoPlaying}
              <button
                class="count-in-quick-btn"
                onclick={() => startCountIn('play')}
                title="Start playback with a 3-second visual count-in to get hands on the piano keys"
              >
                ⏳ 3s Play
              </button>
            {/if}

            <button
              class="skip-btn restart-btn"
              use:longpress={{
                duration: 500,
                onLongPress: deepReset,
                onClick: restartPiece
              }}
              title="Tap to restart lesson • Hold for Deep Reset (restart + clear loop points)"
            >
              ⏮ Restart
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

            <!-- Practice Lab Modal Trigger Button -->
            <button
              class="practice-lab-trigger-btn"
              onclick={() => showPracticeLabModal = true}
              title="Open Practice Lab for speed, A/B looping, and stage modes"
            >
              🎛️ Practice Lab ({playbackRate}x)
            </button>
          </div>

          <div class="transport-right">
            <!-- Mute / Unmute Toggle -->
            <button
              class="utility-btn mute-btn {isMuted ? 'muted' : ''}"
              onclick={toggleMute}
              title={isMuted ? 'Unmute video audio' : 'Mute video audio (practice visually with hands)'}
            >
              {isMuted ? '🔇 Unmute' : '🔊 Mute'}
            </button>

            <!-- Fullscreen Toggle -->
            <button
              class="utility-btn fullscreen-btn {isFullscreen ? 'active' : ''}"
              onclick={toggleFullscreen}
              title={isFullscreen ? 'Exit full screen' : 'Expand full screen'}
            >
              {isFullscreen ? '🗗 Exit' : '⛶ Fullscreen'}
            </button>
          </div>
        </div>
      </div>

      <!-- Mascot Pip Companion -->
      <MascotPip state={mascotState} message={mascotMessage} />

      <!-- Dual Audio Recording Studio -->
      {#if !hideAudioTakes}
        <div class="cockpit-card-wrap">
          <button
            class="section-collapse-header"
            onclick={() => toggleSection('studio')}
            aria-expanded={!collapsedSections.studio}
          >
            <div class="collapse-title-row">
              <span class="collapse-chevron">{collapsedSections.studio ? '▶' : '▼'}</span>
              <span class="collapse-title">🎙️ Audio Recording Studio</span>
            </div>
            <span class="collapse-summary-badge {studentTrack ? 'badge-success' : ''}">
              {studentTrack ? '✅ Take Recorded' : 'No take yet'}
            </span>
          </button>

          {#if !collapsedSections.studio}
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

                <div class="record-btn-row">
                  <button
                    class="record-btn student {studentRecorder.isRecording ? 'recording' : ''}"
                    use:longpress={{
                      duration: 500,
                      onLongPress: () => { if (!studentRecorder.isRecording) startCountIn('record'); },
                      onClick: toggleStudentRecord
                    }}
                    title="Tap to record • Hold for 3s count-in pre-roll"
                  >
                    {#if studentRecorder.isRecording}
                      ⏹ Stop Recording ({formatTime(studentRecorder.recordingSeconds)})
                    {:else}
                      🎙️ {studentAudioUrl ? 'Re-record Take' : 'Record My Take'}
                    {/if}
                  </button>

                  {#if !studentRecorder.isRecording}
                    <button
                      class="count-in-record-btn"
                      onclick={() => startCountIn('record')}
                      title="Start recording with 3-second pre-roll to get hands on the piano keys"
                    >
                      ⏳ 3s Pre-Roll
                    </button>
                  {/if}
                </div>

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
        </div>
      {/if}

      <!-- Interactive Learning Checkpoints -->
      <div class="cockpit-card-wrap">
        <button
          class="section-collapse-header"
          onclick={() => toggleSection('checkpoints')}
          aria-expanded={!collapsedSections.checkpoints}
        >
          <div class="collapse-title-row">
            <span class="collapse-chevron">{collapsedSections.checkpoints ? '▶' : '▼'}</span>
            <span class="collapse-title">🎯 Practice Checkpoints</span>
          </div>
          {#if currentLesson}
            {@const lesson = currentLesson}
            <span class="collapse-summary-badge {lesson.checkpoints.length > 0 && Object.keys(completedCheckpoints).filter(k => k.startsWith(lesson.id) && completedCheckpoints[k]).length === lesson.checkpoints.length ? 'badge-success' : ''}">
              {Object.keys(completedCheckpoints).filter(k => k.startsWith(lesson.id) && completedCheckpoints[k]).length} / {lesson.checkpoints.length} Done
            </span>
          {/if}
        </button>

        {#if !collapsedSections.checkpoints}
          <section class="checkpoints-card neo-card">
            <div class="checkpoints-top">
              <div class="title-group">
                <span class="checkpoints-icon">🎯</span>
                <h3>Learning Goals</h3>
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
        {/if}
      </div>
    </main>
  {/if}

  <!-- Footer Controls -->
  <footer class="neo-footer">
    <button class="footer-settings-btn" onclick={openSettings}>
      ⚙️ App Settings & Preferences
    </button>
  </footer>

  <!-- 3-Second Count-In Pre-Roll Overlay -->
  {#if countInTimer !== null}
    <div
      class="count-in-overlay"
      onclick={cancelCountIn}
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === 'Escape' && cancelCountIn()}
    >
      <div class="count-in-card neo-card" onclick={(e) => e.stopPropagation()} role="presentation">
        <span class="count-in-icon">🎹</span>
        <div class="count-in-number">{countInTimer}</div>
        <p class="count-in-label">
          {countInTarget === 'play' ? 'Hands on the keys... Starting!' : 'Get ready at the piano... Recording!'}
        </p>
        <button class="count-in-cancel-btn" onclick={cancelCountIn}>
          ✕ Tap to Cancel
        </button>
      </div>
    </div>
  {/if}

  <!-- Practice Lab & Advanced Tools Pop-Up Modal -->
  {#if showPracticeLabModal && currentLesson}
    <div
      class="modal-backdrop"
      onclick={() => showPracticeLabModal = false}
      onkeydown={(e) => e.key === 'Escape' && (showPracticeLabModal = false)}
      role="presentation"
    >
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <div
        class="modal-card neo-card practice-lab-modal"
        onclick={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
        role="dialog"
        tabindex="-1"
        aria-modal="true"
        aria-label="Practice Lab & Studio Tools"
      >
        <div class="modal-header">
          <div class="modal-title-row">
            <span class="modal-header-icon">🎛️</span>
            <h2>Practice Lab & Studio Tools</h2>
          </div>
          <button class="modal-close-btn" onclick={() => showPracticeLabModal = false}>✕</button>
        </div>

        <div class="lab-body">
          <!-- Playback Speed Section -->
          <div class="lab-section">
            <span class="lab-section-label">⚡ Practice Tempo & Speed</span>
            <div class="lab-speed-grid">
              {#each [0.5, 0.7, 0.85, 1.0, 1.25] as rate}
                <button
                  class="lab-speed-btn {playbackRate === rate ? 'active' : ''}"
                  onclick={() => changePlaybackRate(rate)}
                >
                  <span class="rate-number">{rate}x</span>
                  <span class="rate-desc">
                    {rate === 0.5 ? 'Slow Mo' : rate === 0.7 ? 'Practice' : rate === 0.85 ? 'Medium' : rate === 1.0 ? 'Normal' : 'Brisk'}
                  </span>
                </button>
              {/each}
            </div>
          </div>

          <!-- A/B Looper Precision Studio Section -->
          <div class="lab-section">
            <span class="lab-section-label">🔁 A/B Loop Precision Studio</span>
            <div class="lab-loop-grid">
              <!-- Point A -->
              <div class="loop-nudge-card">
                <div class="loop-nudge-header">
                  <span class="point-badge marker-a">🚩 Loop Start (A)</span>
                  <span class="point-time">{formatTime(customLoopA ?? currentLesson.startTime)}</span>
                </div>
                <div class="nudge-btn-row">
                  <button class="nudge-btn" onclick={() => nudgeLoopA(-0.5)}>-0.5s</button>
                  <button class="nudge-btn" onclick={() => nudgeLoopA(-0.1)}>-0.1s</button>
                  <button class="nudge-btn set-btn" onclick={setLoopA}>Set</button>
                  <button class="nudge-btn" onclick={() => nudgeLoopA(0.1)}>+0.1s</button>
                  <button class="nudge-btn" onclick={() => nudgeLoopA(0.5)}>+0.5s</button>
                </div>
              </div>

              <!-- Point B -->
              <div class="loop-nudge-card">
                <div class="loop-nudge-header">
                  <span class="point-badge marker-b">🏁 Loop End (B)</span>
                  <span class="point-time">{formatTime(customLoopB ?? (currentLesson.endTime > 0 ? currentLesson.endTime : videoDuration))}</span>
                </div>
                <div class="nudge-btn-row">
                  <button class="nudge-btn" onclick={() => nudgeLoopB(-0.5)}>-0.5s</button>
                  <button class="nudge-btn" onclick={() => nudgeLoopB(-0.1)}>-0.1s</button>
                  <button class="nudge-btn set-btn" onclick={setLoopB}>Set</button>
                  <button class="nudge-btn" onclick={() => nudgeLoopB(0.1)}>+0.1s</button>
                  <button class="nudge-btn" onclick={() => nudgeLoopB(0.5)}>+0.5s</button>
                </div>
              </div>
            </div>

            {#if customLoopA !== null || customLoopB !== null}
              <button class="lab-clear-loop-btn" onclick={resetLoopAB}>
                ✖ Reset Loop to Full Lesson Boundaries
              </button>
            {/if}
          </div>

          <!-- Fine Seeking Section -->
          <div class="lab-section">
            <span class="lab-section-label">🎯 Frame-by-Frame Precision Stepping</span>
            <div class="lab-seek-row">
              <button class="lab-seek-btn" onclick={() => seekBy(-1)}>◀ 1s Back</button>
              <button class="lab-seek-btn" onclick={() => seekBy(-5)}>⏪ 5s Rewind</button>
              <button class="lab-seek-btn restart-accent" onclick={restartPiece}>⏮ Restart</button>
              <button class="lab-seek-btn" onclick={() => seekBy(5)}>5s Forward ⏩</button>
              <button class="lab-seek-btn" onclick={() => seekBy(1)}>1s Forward ▶</button>
            </div>
          </div>

          <!-- View & Audio Modes -->
          <div class="lab-section">
            <span class="lab-section-label">📺 View & Playback Modes</span>
            <div class="lab-mode-grid">
              <button
                class="lab-mode-btn {isMuted ? 'active-muted' : ''}"
                onclick={toggleMute}
              >
                {isMuted ? '🔇 Audio Muted (Visual Only)' : '🔊 Audio Normal'}
              </button>

              <button
                class="lab-mode-btn {isTheaterMode ? 'active-theater' : ''}"
                onclick={toggleTheaterMode}
              >
                {isTheaterMode ? '🔳 Standard Cockpit' : '🔲 Wide Theater Stage'}
              </button>

              <button
                class="lab-mode-btn {isFullscreen ? 'active-fullscreen' : ''}"
                onclick={toggleFullscreen}
              >
                {isFullscreen ? '🗗 Exit Fullscreen' : '⛶ Fullscreen'}
              </button>

              <button
                class="lab-mode-btn {autoAdvance ? 'active-auto' : ''}"
                onclick={() => { autoAdvance = !autoAdvance; if (autoAdvance) isLooping = false; }}
              >
                {autoAdvance ? '⏩ Continuous ON' : '⏭️ Auto-Next OFF'}
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-primary-btn" onclick={() => showPracticeLabModal = false}>
            ✓ Done & Return to Practice
          </button>
        </div>
      </div>
    </div>
  {/if}

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
          <div class="channel-header-row">
            <span class="form-label">Curriculum Sources & Channels:</span>
            <button
              class="add-channel-btn-mini"
              onclick={() => { showSettingsModal = false; showAddProviderModal = true; }}
            >
              ➕ Add Source
            </button>
          </div>

          <div class="channels-manager-list neo-border">
            {#each providerSummaries as p}
              <div class="channel-row-item {selectedProvider === p.name ? 'active-channel' : ''}">
                <div class="channel-item-left">
                  <span class="type-icon">{p.type === 'chapters' ? '🔖' : p.type === 'playlist' ? '📑' : '🎬'}</span>
                  <div class="channel-meta-text">
                    <span class="channel-title">{p.name}</span>
                    <span class="channel-subtext">{p.count} tracks · {p.type}</span>
                  </div>
                </div>

                <div class="channel-item-right">
                  {#if p.isBuiltin}
                    <span class="builtin-badge">🔒 Built-in</span>
                  {:else}
                    <button
                      class="delete-channel-btn"
                      onclick={() => deleteCustomProvider(p.name)}
                      title="Remove custom channel"
                    >
                      🗑️ Remove
                    </button>
                  {/if}
                </div>
              </div>
            {/each}
            {#if providerSummaries.length === 0}
              <div class="no-channels-msg">No channels found for this book.</div>
            {/if}
          </div>
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
    transition: max-width 0.25s ease, width 0.25s ease;
  }

  .player-card.theater-mode {
    max-width: 1100px;
    width: min(96vw, 1100px);
    margin-left: 50%;
    transform: translateX(-50%);
  }

  .player-card:fullscreen,
  .player-card:-webkit-full-screen {
    width: 100vw !important;
    height: 100vh !important;
    max-width: none !important;
    border-radius: 0 !important;
    border: none !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    background: #000 !important;
    margin: 0 !important;
    transform: none !important;
    box-shadow: none !important;
  }

  .player-card:fullscreen .yt-frame,
  .player-card:-webkit-full-screen .yt-frame {
    flex: 1;
    height: auto !important;
    aspect-ratio: auto;
    max-height: calc(100vh - 130px);
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

  .transport-left, .transport-middle {
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

  .transport-right {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .utility-btn {
    background: #ffffff;
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 800;
    font-size: 0.8rem;
    padding: 8px 10px;
    cursor: pointer;
    box-shadow: 1px 1px 0 #000;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.15s ease;
  }

  .utility-btn:active {
    transform: translate(1px, 1px);
    box-shadow: 0 0 0 #000;
  }

  .utility-btn.active {
    background: #FFD54F;
    color: #000000;
  }

  .utility-btn.muted {
    background: #FFCDD2;
    color: #C62828;
    border-color: #C62828;
  }

  .restart-btn {
    background: #E8F5E9;
    color: #2E7D32;
    border-color: #2E7D32;
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
    max-width: 500px;
    width: 92%;
    max-height: 90vh;
    overflow-y: auto;
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

  /* Channels Manager in Settings Modal */
  .channel-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .add-channel-btn-mini {
    background: #E8F5E9;
    border: 2px solid #000;
    border-radius: 6px;
    font-weight: 800;
    font-size: 0.75rem;
    padding: 3px 8px;
    cursor: pointer;
    box-shadow: 1px 1px 0 #000;
  }

  .add-channel-btn-mini:active {
    transform: translate(1px, 1px);
    box-shadow: 0 0 0 #000;
  }

  .channels-manager-list {
    background: #FAFAFA;
    max-height: 180px;
    overflow-y: auto;
    border-radius: 8px;
  }

  .channel-row-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid #E0E0E0;
  }

  .channel-row-item:last-child {
    border-bottom: none;
  }

  .channel-row-item.active-channel {
    background: #FFFDE7;
  }

  .channel-item-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .channel-meta-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .channel-title {
    font-size: 0.85rem;
    font-weight: 800;
    color: #121212;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .channel-subtext {
    font-size: 0.7rem;
    font-weight: 700;
    color: #666;
    text-transform: capitalize;
  }

  .channel-item-right {
    flex-shrink: 0;
    margin-left: 8px;
  }

  .builtin-badge {
    font-size: 0.7rem;
    font-weight: 800;
    color: #555;
    background: #E0E0E0;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #999;
  }

  .delete-channel-btn {
    background: #FFEBEE;
    color: #D32F2F;
    border: 1.5px solid #D32F2F;
    border-radius: 6px;
    font-weight: 800;
    font-size: 0.75rem;
    padding: 3px 8px;
    cursor: pointer;
    box-shadow: 1px 1px 0 #000;
  }

  .delete-channel-btn:active {
    transform: translate(1px, 1px);
    box-shadow: 0 0 0 #000;
  }

  .no-channels-msg {
    padding: 12px;
    font-size: 0.8rem;
    color: #666;
    font-style: italic;
    text-align: center;
  }

  /* Collapsible Cockpit Sections */
  .cockpit-card-wrap {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .section-collapse-header {
    background: #ffffff;
    border: 3px solid #000;
    border-radius: 12px;
    padding: 10px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    box-shadow: 2px 2px 0 #000;
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .section-collapse-header:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }

  .collapse-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 900;
    font-size: 0.95rem;
    color: #121212;
  }

  .collapse-chevron {
    font-size: 0.8rem;
    width: 16px;
    display: inline-block;
  }

  .collapse-summary-badge {
    font-size: 0.75rem;
    font-weight: 800;
    background: #FFF9C4;
    border: 1.5px solid #000;
    border-radius: 6px;
    padding: 3px 8px;
    color: #333;
    max-width: 50%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .collapse-summary-badge.badge-success {
    background: #E8F5E9;
    color: #2E7D32;
    border-color: #2E7D32;
  }

  /* Quick Count-in & Practice Lab Transport Buttons */
  .count-in-quick-btn {
    background: #FFF9C4;
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 800;
    font-size: 0.8rem;
    padding: 8px 10px;
    cursor: pointer;
    box-shadow: 1px 1px 0 #000;
    color: #E65100;
    transition: transform 0.1s ease;
  }

  .count-in-quick-btn:active {
    transform: translate(1px, 1px);
  }

  .practice-lab-trigger-btn {
    background: #FFE082;
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 900;
    font-size: 0.85rem;
    padding: 8px 14px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
    color: #3E2723;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .practice-lab-trigger-btn:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }

  .record-btn-row {
    display: flex;
    gap: 8px;
    align-items: stretch;
    margin-top: 10px;
  }

  .record-btn-row .record-btn {
    flex: 1;
    margin-top: 0;
  }

  .count-in-record-btn {
    background: #FFF9C4;
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 800;
    font-size: 0.8rem;
    padding: 10px 12px;
    cursor: pointer;
    box-shadow: 1px 1px 0 #000;
    color: #E65100;
    white-space: nowrap;
  }

  /* 3-Second Visual Pre-Roll Count-in Overlay */
  .count-in-overlay {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
  }

  .count-in-card {
    background: #FFFDE7;
    border: 4px solid #000;
    border-radius: 24px;
    padding: 36px 40px;
    text-align: center;
    box-shadow: 8px 8px 0 #000;
    max-width: 380px;
    width: 88%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .count-in-icon {
    font-size: 2.8rem;
  }

  .count-in-number {
    font-size: 5.5rem;
    font-weight: 900;
    color: #FF6F00;
    line-height: 1;
    margin: 12px 0;
    text-shadow: 2px 2px 0 #000;
  }

  .count-in-label {
    font-size: 1.15rem;
    font-weight: 900;
    color: #212121;
    margin-bottom: 20px;
  }

  .count-in-cancel-btn {
    background: #ffffff;
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 800;
    padding: 8px 16px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
    font-size: 0.85rem;
  }

  /* Practice Lab Modal */
  .practice-lab-modal {
    max-width: 640px !important;
    width: 94% !important;
    border-radius: 16px !important;
    border: 4px solid #000 !important;
    box-shadow: 6px 6px 0 #000 !important;
    background: #FAF9F6 !important;
    max-height: 88vh !important;
    display: flex !important;
    flex-direction: column !important;
    padding: 0 !important;
    overflow: hidden !important;
  }

  .modal-backdrop {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(2px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1500;
  }

  .modal-header {
    padding: 14px 20px;
    border-bottom: 3px solid #000;
    background: #FFE082;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .modal-title-row h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 900;
  }

  .modal-header-icon {
    font-size: 1.4rem;
  }

  .modal-close-btn {
    background: #ffffff;
    border: 2px solid #000;
    border-radius: 8px;
    width: 34px;
    height: 34px;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
  }

  .lab-body {
    padding: 16px 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
  }

  .lab-section {
    background: #ffffff;
    border: 2.5px solid #000;
    border-radius: 12px;
    padding: 14px;
    box-shadow: 2px 2px 0 #000;
  }

  .lab-section-label {
    display: block;
    font-weight: 900;
    font-size: 0.9rem;
    margin-bottom: 10px;
    color: #212121;
  }

  .lab-speed-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 8px;
  }

  .lab-speed-btn {
    background: #ffffff;
    border: 2px solid #000;
    border-radius: 8px;
    padding: 8px 6px;
    cursor: pointer;
    text-align: center;
    box-shadow: 1px 1px 0 #000;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .lab-speed-btn.active {
    background: #FFD54F;
    border-width: 3px;
  }

  .rate-number {
    font-size: 1.05rem;
    font-weight: 900;
  }

  .rate-desc {
    font-size: 0.65rem;
    font-weight: 800;
    color: #666;
  }

  .lab-loop-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  @media (max-width: 550px) {
    .lab-loop-grid {
      grid-template-columns: 1fr;
    }
  }

  .loop-nudge-card {
    background: #F5F5F5;
    border: 2px solid #000;
    border-radius: 8px;
    padding: 10px;
  }

  .loop-nudge-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .point-badge {
    font-size: 0.75rem;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #000;
    color: #fff;
  }

  .point-time {
    font-size: 0.85rem;
    font-weight: 900;
  }

  .nudge-btn-row {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .nudge-btn {
    background: #ffffff;
    border: 1.5px solid #000;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 800;
    padding: 6px 6px;
    cursor: pointer;
    flex: 1;
    min-width: 38px;
    text-align: center;
  }

  .nudge-btn.set-btn {
    background: #E1BEE7;
  }

  .lab-clear-loop-btn {
    margin-top: 10px;
    width: 100%;
    background: #FFEBEE;
    color: #C62828;
    border: 2px solid #C62828;
    border-radius: 8px;
    font-weight: 800;
    font-size: 0.8rem;
    padding: 8px;
    cursor: pointer;
  }

  .lab-seek-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .lab-seek-btn {
    background: #ffffff;
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 800;
    font-size: 0.8rem;
    padding: 8px 12px;
    cursor: pointer;
    box-shadow: 1px 1px 0 #000;
  }

  .lab-seek-btn.restart-accent {
    background: #E8F5E9;
    color: #2E7D32;
    border-color: #2E7D32;
  }

  .lab-mode-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  @media (max-width: 550px) {
    .lab-mode-grid {
      grid-template-columns: 1fr;
    }
  }

  .lab-mode-btn {
    background: #ffffff;
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 800;
    font-size: 0.8rem;
    padding: 10px;
    cursor: pointer;
    text-align: center;
    box-shadow: 1px 1px 0 #000;
  }

  .lab-mode-btn.active-muted {
    background: #FFCDD2;
    color: #C62828;
    border-color: #C62828;
  }

  .lab-mode-btn.active-theater {
    background: #FFF9C4;
  }

  .lab-mode-btn.active-fullscreen {
    background: #E1F5FE;
  }

  .lab-mode-btn.active-auto {
    background: #E1BEE7;
  }

  .modal-footer {
    padding: 12px 20px;
    border-top: 2px solid #000;
    background: #ffffff;
    display: flex;
    justify-content: flex-end;
  }

  .modal-primary-btn {
    background: #4CAF50;
    color: #ffffff;
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 900;
    font-size: 0.95rem;
    padding: 10px 20px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
  }
</style>
