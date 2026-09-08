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
  import OnboardingModal from '#lib/components/OnboardingModal.svelte';
  import TeacherGate from '#lib/components/TeacherGate.svelte';
  import { longpress } from '#lib/actions/longpress.js';
  import {
    type StudentProfile,
    type KidAvatarKey,
    KID_AVATARS,
    DEFAULT_STUDENT_PROFILES,
    getAvatarEmoji,
    getAvatarColor,
    type ActiveScreen
  } from '#lib/types/studentProfile.js';
  import { getEducatorInfo } from '#lib/types/educator.js';

  // Modular Kids UX Components
  import KidsTopHeader from '#lib/components/kids/KidsTopHeader.svelte';
  import KidsBottomNav from '#lib/components/kids/KidsBottomNav.svelte';
  import LibraryScreen from '#lib/components/screens/LibraryScreen.svelte';
  import StudioScreen from '#lib/components/screens/StudioScreen.svelte';
  import ProfileScreen from '#lib/components/screens/ProfileScreen.svelte';
  import SettingsScreen from '#lib/components/screens/SettingsScreen.svelte';
  import AppSplashScreen from '#lib/components/screens/AppSplashScreen.svelte';

  let activeScreen = $state<ActiveScreen>('splash');
  let isAppReady = $state<boolean>(false);
  let showInitialSplash = $state<boolean>(true);

  // --- Option A Practice Cinema State ---
  let isCinemaMode = $state<boolean>(false);
  let cinemaTimer: any = null;

  // --- Kid Profiles State ---
  let studentProfiles = $state<StudentProfile[]>(DEFAULT_STUDENT_PROFILES);
  let activeProfileId = $state<string>('profile-leo');
  let activeProfile = $derived<StudentProfile>(
    studentProfiles.find(p => p.id === activeProfileId) ?? studentProfiles[0]
  );
  let showAddProfileModal = $state<boolean>(false);
  let newProfileName = $state<string>('');
  let newProfileAvatar = $state<KidAvatarKey>('lion');

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

  // Per-profile state recall
  let lastPracticedLesson = $derived.by(() => {
    if (!activeProfile?.lastLessonId || allLessons.length === 0) return null;
    return allLessons.find(l => l.id === activeProfile.lastLessonId) ?? null;
  });

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

    const savedProfiles = localStorage.getItem('student_profiles');
    if (savedProfiles) {
      try {
        studentProfiles = JSON.parse(savedProfiles);
      } catch (e) {
        console.warn('Failed to parse student_profiles:', e);
      }
    }

    const savedProfileId = localStorage.getItem('active_profile_id');
    if (savedProfileId && studentProfiles.some(p => p.id === savedProfileId)) {
      activeProfileId = savedProfileId;
    }

    const validScreens: ActiveScreen[] = [
      'splash',
      'library',
      'player',
      'studio',
      'profile',
      'settings'
    ];
    const savedScreen = localStorage.getItem('activeScreen');
    if (savedScreen && validScreens.includes(savedScreen as ActiveScreen)) {
      activeScreen = savedScreen as ActiveScreen;
    } else {
      activeScreen = 'splash';
    }

    await initDatabase();
    books = await db.books.toArray();
    if (books.length > 0) {
      if (activeProfile?.lastBookId && books.some(b => b.id === activeProfile.lastBookId)) {
        selectedBookId = activeProfile.lastBookId;
      } else {
        selectedBookId = books[0].id;
      }
      await loadDataForSelectedBook();
      if (activeProfile?.lastProvider && providers.includes(activeProfile.lastProvider)) {
        selectProvider(activeProfile.lastProvider);
      }
      if (activeProfile?.lastLessonId) {
        const savedL = lessons.find(l => l.id === activeProfile.lastLessonId);
        if (savedL) {
          await selectLesson(savedL);
        }
      }
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    }

    isAppReady = true;
  });

  onDestroy(() => {
    clearCinemaTimer();
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

  function switchTeacherPreservingPiece(newProvider: string) {
    if (newProvider === selectedProvider) return;
    const oldLesson = currentLesson;
    const oldDuration = videoDuration || (oldLesson?.endTime && oldLesson?.startTime ? oldLesson.endTime - oldLesson.startTime : 1);
    const oldStart = oldLesson?.startTime ?? 0;
    const oldElapsed = Math.max(0, videoCurrentTime - oldStart);
    const progressRatio = oldDuration > 0 ? Math.min(1, Math.max(0, oldElapsed / oldDuration)) : 0;
    const wasPlaying = isVideoPlaying;

    let relLoopA: number | null = null;
    let relLoopB: number | null = null;
    if (customLoopA !== null) {
      relLoopA = (customLoopA - oldStart) / oldDuration;
    }
    if (customLoopB !== null) {
      relLoopB = (customLoopB - oldStart) / oldDuration;
    }

    selectedProvider = newProvider;
    lessons = allLessons.filter(l => l.providerName === newProvider);

    let matchedLesson = lessons.find(l => oldLesson && (l.sequenceIndex === oldLesson.sequenceIndex || l.title.trim().toLowerCase() === oldLesson.title.trim().toLowerCase()));
    if (!matchedLesson && lessons.length > 0) {
      matchedLesson = lessons[0];
    }

    if (matchedLesson) {
      selectLesson(matchedLesson);
      const newDuration = matchedLesson.endTime && matchedLesson.startTime ? (matchedLesson.endTime - matchedLesson.startTime) : (matchedLesson.endTime ?? 0);
      const newStart = matchedLesson.startTime ?? 0;
      
      const targetTime = newStart + (progressRatio * (newDuration > 0 ? newDuration : 0));
      videoSeekTarget = targetTime;

      if (relLoopA !== null && newDuration > 0) {
        customLoopA = Math.round(newStart + (relLoopA * newDuration));
      }
      if (relLoopB !== null && newDuration > 0) {
        customLoopB = Math.round(newStart + (relLoopB * newDuration));
      }

      if (wasPlaying) {
        setTimeout(() => {
          playerController?.play();
        }, 300);
      }
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

  function clearCinemaTimer() {
    if (cinemaTimer) {
      clearTimeout(cinemaTimer);
      cinemaTimer = null;
    }
  }

  function resetCinemaTimer() {
    clearCinemaTimer();
    if (isVideoPlaying && activeScreen === 'player') {
      cinemaTimer = setTimeout(() => {
        if (isVideoPlaying && activeScreen === 'player') {
          isCinemaMode = true;
        }
      }, 3500);
    }
  }

  function wakeCinemaHUD() {
    isCinemaMode = false;
    resetCinemaTimer();
  }

  function handlePlayerStateChange(state: 'unstarted' | 'ended' | 'playing' | 'paused' | 'buffering' | 'cued') {
    isVideoPlaying = state === 'playing';
    if (state === 'playing') {
      resetCinemaTimer();
    } else {
      clearCinemaTimer();
      isCinemaMode = false;
    }
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

  function selectScreen(screen: ActiveScreen) {
    if (screen !== 'player') {
      clearCinemaTimer();
      isCinemaMode = false;
    }
    if ((screen === 'player' || screen === 'studio') && !currentLesson) {
      if (lessons.length > 0) {
        selectLesson(lessons[0]);
      } else {
        return;
      }
    }
    activeScreen = screen;
    localStorage.setItem('activeScreen', screen);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function saveProfilesToStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('student_profiles', JSON.stringify($state.snapshot(studentProfiles)));
      localStorage.setItem('active_profile_id', activeProfileId);
    }
  }

  function selectProfile(profileId: string) {
    activeProfileId = profileId;
    localStorage.setItem('active_profile_id', profileId);
    mascotState = 'cheering';
    mascotMessage = `Hi ${activeProfile.name}! Ready to practice piano? 🎹`;

    if (activeProfile?.lastBookId && books.some(b => b.id === activeProfile.lastBookId)) {
      selectedBookId = activeProfile.lastBookId;
      loadDataForSelectedBook().then(() => {
        if (activeProfile.lastProvider && providers.includes(activeProfile.lastProvider)) {
          selectProvider(activeProfile.lastProvider);
        }
      });
    }
  }

  function handleSelectProfile(profileId: string) {
    selectProfile(profileId);
    selectScreen('library');
  }

  function handleAddProfile(name: string, avatarKey: KidAvatarKey) {
    const newProfile: StudentProfile = {
      id: `profile-${Date.now()}`,
      name,
      avatarKey,
      color: getAvatarColor(avatarKey),
      createdAt: Date.now()
    };
    studentProfiles = [...studentProfiles, newProfile];
    saveProfilesToStorage();
    selectProfile(newProfile.id);
    selectScreen('library');
  }

  async function handleSelectBook(bookId: string) {
    await selectBook(bookId);
    if (activeProfile) {
      activeProfile.lastBookId = bookId;
      saveProfilesToStorage();
    }
  }

  function handleSelectProvider(provider: string) {
    selectProvider(provider);
    if (activeProfile) {
      activeProfile.lastProvider = provider;
      saveProfilesToStorage();
    }
  }

  async function selectLessonAndPlay(lesson: LocalLesson) {
    await selectLesson(lesson);
    if (activeProfile) {
      activeProfile.lastBookId = selectedBookId;
      activeProfile.lastProvider = selectedProvider;
      activeProfile.lastLessonId = lesson.id;
      activeProfile.lastPracticedAt = Date.now();
      saveProfilesToStorage();
    }
    selectScreen('player');
  }

  function resumeLastPractice() {
    if (lastPracticedLesson) {
      selectLessonAndPlay(lastPracticedLesson);
    } else if (lessons.length > 0) {
      selectLessonAndPlay(lessons[0]);
    } else {
      selectScreen('library');
    }
  }

  function handleOpenParentGate() {
    selectScreen('settings');
  }

  function handleUnlockTeacher() {
    teacherAuth.unlock();
    mascotState = 'cheering';
    mascotMessage = 'Grown-Ups mode unlocked! ⚙️';
  }

  function handleLockTeacher() {
    teacherAuth.lock();
    mascotState = 'idle';
    mascotMessage = 'Grown-Ups mode locked. 🔒';
  }

  function addStudentProfile() {
    if (!newProfileName.trim()) return;
    handleAddProfile(newProfileName.trim(), newProfileAvatar);
    newProfileName = '';
    showAddProfileModal = false;
  }

  function exportData() {
    if (typeof window === 'undefined') return;
    const data = {
      version: 1,
      profiles: studentProfiles,
      activeProfileId,
      completedCheckpoints,
      exportedAt: Date.now()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `piano-companion-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.profiles) studentProfiles = data.profiles;
        if (data.activeProfileId) activeProfileId = data.activeProfileId;
        if (data.completedCheckpoints) completedCheckpoints = data.completedCheckpoints;
        saveProfilesToStorage();
        localStorage.setItem('completedCheckpoints', JSON.stringify(completedCheckpoints));
        alert('Practice data restored successfully! 🎉');
      } catch (err) {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
  }

  function handleResetAllData() {
    if (confirm('Are you sure you want to reset student progress and stars? This cannot be undone.')) {
      localStorage.clear();
      location.reload();
    }
  }

  function playLessonFromHub(lesson: LocalLesson) {
    selectLessonAndPlay(lesson);
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
    toggleCheckpointByKey(key);
  }

  function toggleCheckpointByKey(key: string) {
    completedCheckpoints[key] = !completedCheckpoints[key];
    localStorage.setItem('completedCheckpoints', JSON.stringify(completedCheckpoints));

    if (currentLesson) {
      const total = currentLesson.checkpoints.length;
      const checkedCount = currentLesson.checkpoints.filter((_, i) => completedCheckpoints[`${currentLesson!.id}_cp_${i}`]).length;

      if (checkedCount === total && total > 0) {
        mascotState = 'cheering';
        mascotMessage = 'Brilliant! You mastered all points for this piece! 🎉';
      }
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
  {#if showInitialSplash}
    <AppSplashScreen
      isReady={isAppReady}
      onComplete={() => {
        showInitialSplash = false;
      }}
    />
  {/if}

  {#if showOnboarding}
    <OnboardingModal onComplete={() => { localStorage.setItem('onboardingComplete', 'true'); showOnboarding = false; }} />
  {/if}

  {#if activeScreen !== 'splash' && activeScreen !== 'profile' && activeScreen !== 'settings'}
    <!-- Kids Top App Header with Profile Chip & Parent Gate -->
    <KidsTopHeader
      {activeProfile}
      {currentBook}
      {selectedProvider}
      {currentLesson}
      {activeScreen}
      onSelectScreen={selectScreen}
      onOpenParentGate={handleOpenParentGate}
    />
  {/if}

  <!-- ================= SCREEN 0: Splash Intro (Initiate State) ================= -->
  {#if activeScreen === 'splash'}
    <div class="screen-splash">
      <div class="splash-hero-card neo-card">
        <div class="splash-logo-wrap">
          <img src="/favicon.svg" alt="Piano Companion Kids" class="splash-app-logo" />
        </div>

        <h1 class="splash-title">Piano Companion <span class="kids-tag">KIDS</span></h1>
        <p class="splash-subtitle">Learn piano with fun YouTube masterclasses & practice checkpoints!</p>

        <!-- Mascot Pip Greeting -->
        <MascotPip
          state={lastPracticedLesson ? 'cheering' : 'idle'}
          message={lastPracticedLesson ? `Welcome back, ${activeProfile.name}! 🌟 Ready to practice "${lastPracticedLesson.title}"?` : `Hi! Welcome to Piano Companion. Let's make practice super fun! 🎹`}
        />

        <!-- Smart 1-Tap Resume Card (State Recall) -->
        {#if lastPracticedLesson}
          <div class="resume-hero-box neo-card">
            <div class="resume-eyebrow-row">
              <span class="resume-dot-badge"></span>
              <span class="resume-eyebrow">CONTINUE WHERE YOU LEFT OFF</span>
            </div>
            <div class="resume-main-row">
              <div class="resume-avatar-badge" style="background-color: {activeProfile.color}">
                {getAvatarEmoji(activeProfile.avatarKey)}
              </div>
              <div class="resume-text-col">
                <h3 class="resume-song-title">#{lastPracticedLesson.sequenceIndex} {lastPracticedLesson.title}</h3>
                <span class="resume-book-name">{currentBook?.title ?? ''} • {selectedProvider}</span>
              </div>
            </div>
            <button class="resume-action-btn neo-btn" onclick={resumeLastPractice}>
              <span class="btn-play-icon">▶</span>
              <span class="btn-main-label">Resume Practice</span>
              <span class="btn-emoji-tag">🚀</span>
            </button>
          </div>
        {/if}

        <!-- Primary Start / Navigate Funnel Buttons -->
        <div class="splash-action-row">
          <button
            class="start-funnel-btn neo-btn {!lastPracticedLesson ? 'primary-loud' : 'secondary-soft'}"
            onclick={() => selectScreen('library')}
          >
            {#if lastPracticedLesson}
              📚 Open Song Library
            {:else}
              🎹 Let's Start Practicing!
            {/if}
          </button>
        </div>
      </div>
    </div>

  <!-- ================= SCREEN 1: Unified Library (Book + Teacher + Songs) ================= -->
  {:else if activeScreen === 'library'}
    <LibraryScreen
      {books}
      {selectedBookId}
      {currentBook}
      {providers}
      {selectedProvider}
      {lessons}
      {allLessons}
      {currentLesson}
      {lastPracticedLesson}
      {currentListType}
      onSelectBook={handleSelectBook}
      onSelectProvider={handleSelectProvider}
      onSelectLesson={selectLessonAndPlay}
      onOpenAddProvider={() => showAddProviderModal = true}
    />

  <!-- ================= SCREEN 2: Dedicated Player Stage ================= -->
  {:else if activeScreen === 'player'}
    <div
      class="screen-player {isCinemaMode ? 'is-cinema-mode' : ''}"
      onclick={wakeCinemaHUD}
      onpointermove={wakeCinemaHUD}
      tabindex="0"
      role="region"
      aria-label="Practice Cinema Stage"
    >
      {#if currentLesson}
        <!-- Practice Cinema Wayfinding & Instructor Switcher Strip -->
        <div class="player-top-strip">
          <div class="player-song-meta">
            <span class="player-song-idx">#{currentLesson.sequenceIndex}</span>
            <h2 class="player-song-title">{currentLesson.title}</h2>
          </div>

          <!-- In-Player Teacher Switcher: 1-tap switch preserving piece -->
          <div class="in-player-teacher-strip" role="tablist" aria-label="Switch instructor">
            {#each providers as pName}
              {@const isCurrentTeacher = pName === selectedProvider}
              <button
                class="teacher-pill {isCurrentTeacher ? 'active' : ''}"
                onclick={() => switchTeacherPreservingPiece(pName)}
                title="Switch instructor to {pName}"
                role="tab"
                aria-selected={isCurrentTeacher}
              >
                <span class="teacher-token-avatar">
                  {pName.includes('Anikó') ? '👩‍🏫' : pName.includes('Gavin') ? '👨‍🏫' : pName.includes('Vika') ? '🎹' : '🎬'}
                </span>
                <span class="teacher-pill-name">{pName.split(' ')[0]}</span>
              </button>
            {/each}
          </div>

          <!-- Top Actions (Piece Prev/Next & Metronome) -->
          <div class="player-top-actions">
            <button
              class="token-disc-btn prev-btn"
              disabled={!hasPrevLesson}
              onclick={prevLesson}
              title="Previous piece"
            >
              ⏮
            </button>
            <button
              class="token-disc-btn next-btn"
              disabled={!hasNextLesson}
              onclick={nextLesson}
              title="Next piece"
            >
              ⏭
            </button>
            <button
              class="capsule-metronome-btn {showMetronome ? 'active' : ''}"
              onclick={() => showMetronome = !showMetronome}
              title="Toggle metronome"
            >
              ⏱️ Metronome
            </button>
          </div>
        </div>

        {#if showMetronome}
          <div class="player-metronome-wrap">
            <Metronome />
          </div>
        {/if}

        <!-- Stage Window: Single Viewport with Scrubber and Tactile Command Island -->
        <section
          class="stage-viewport player-stage-card {isFullscreen ? 'is-fullscreen' : ''} {isTheaterMode ? 'is-theater' : ''}"
          bind:this={playerCardElement}
        >

          <!-- Video Stage Frame -->
          <div class="player-box">
            {#key currentLesson.youtubeVideoId}
              <div
                use:youtubeLooper={{
                  videoId: () => currentLesson?.youtubeVideoId ?? '',
                  startTime: () => customLoopA ?? currentLesson?.startTime ?? 0,
                  endTime: () => customLoopB ?? (currentLesson?.endTime && currentLesson.endTime > 0 ? currentLesson.endTime : videoDuration),
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

            <!-- Integrated Border-Free Scrubber -->
            <div
              class="scrubber-track"
              role="slider"
              tabindex="0"
              aria-label="Video practice progress"
              aria-valuemin={0}
              aria-valuemax={videoDuration || 100}
              aria-valuenow={videoCurrentTime}
              onclick={handleProgressClick}
              onkeydown={(e) => e.key === 'Enter' && handleProgressClick(e as any)}
            >
              <div class="scrubber-bar-bg">
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
          </div>

          <!-- Tactile Command Island -->
          <div class="tactile-command-island">
            <!-- Giant 64px Stadium Capsule Pill -->
            <button
              class="command-giant-pill {isVideoPlaying ? 'is-playing' : ''}"
              use:longpress={{
                duration: 500,
                onLongPress: () => { if (!isVideoPlaying) startCountIn('play'); },
                onClick: togglePlayVideo
              }}
              title="Tap to Play/Pause • Hold for 3s count-in pre-roll"
            >
              <span class="giant-icon">{isVideoPlaying ? '⏸' : '▶'}</span>
              <span class="giant-label">{isVideoPlaying ? 'PAUSE' : 'PRACTICE'}</span>
            </button>

            <!-- 48px Tactile Action Discs -->
            <div class="tactile-discs-cluster">
              <button
                class="tactile-disc replay-disc"
                use:longpress={{
                  duration: 600,
                  onLongPress: deepReset,
                  onClick: restartPiece
                }}
                title="Tap to restart piece • Hold for Deep Reset"
              >
                ↺
              </button>

              <button class="tactile-disc seek-disc" onclick={() => seekBy(-5)} title="Rewind 5s">
                ⏪ 5s
              </button>

              <button class="tactile-disc seek-disc" onclick={() => seekBy(5)} title="Forward 5s">
                5s ⏩
              </button>

              <button
                class="tactile-disc loop-disc {isLooping ? 'is-active' : ''}"
                onclick={() => isLooping = !isLooping}
                title="Toggle infinite loop"
              >
                🔄
              </button>
            </div>

            <!-- Discrete Secondary Capsule Bar -->
            <div class="tactile-secondary-strip">
              {#if !isVideoPlaying}
                <button
                  class="secondary-capsule count-in-pill"
                  onclick={() => startCountIn('play')}
                  title="3-second pre-roll countdown"
                >
                  ⏳ 3s Countdown
                </button>
              {/if}

              <button
                class="secondary-capsule lab-pill"
                onclick={() => showPracticeLabModal = true}
                title="Practice Lab: Tempo & Micro-Loops"
              >
                🎛️ Tempo ({playbackRate}x)
              </button>

              <button
                class="secondary-capsule mute-pill {isMuted ? 'muted' : ''}"
                onclick={toggleMute}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? '🔇 Muted' : '🔊 Sound'}
              </button>

              <button
                class="secondary-capsule fullscreen-pill"
                onclick={toggleFullscreen}
                title="Toggle fullscreen stage"
              >
                ⛶ Fullscreen
              </button>
            </div>
          </div>
        </section>

        <!-- Mascot Pip Encouragement -->
        <div class="player-mascot-row">
          <MascotPip state={mascotState} message={mascotMessage} />
        </div>

        <!-- Clean Quick Action Strip -->
        <div class="player-quick-action-strip">
          <button class="quick-nav-capsule studio-cta" onclick={() => selectScreen('studio')}>
            <span class="cta-token">🎙️</span>
            <div class="cta-text-col">
              <strong>Record My Practice Take</strong>
              <small>{studentTrack ? 'Take recorded! Listen in Studio' : 'Record yourself playing this piece'}</small>
            </div>
            <span class="cta-arrow">→</span>
          </button>
          <button class="quick-nav-capsule goals-cta" onclick={() => selectScreen('studio')}>
            <span class="cta-token">⭐</span>
            <div class="cta-text-col">
              <strong>Practice Checkpoints</strong>
              <small>View learning goals & earn stars</small>
            </div>
            <span class="cta-arrow">→</span>
          </button>
        </div>
      {:else}
        <div class="no-lesson-state neo-card">
          <span class="empty-icon">🎹</span>
          <h3>No Song Selected</h3>
          <p>Choose a book and piece from your library to start practicing!</p>
          <button class="action-btn primary-btn" onclick={() => selectScreen('library')}>
            📚 Go to Library
          </button>
        </div>
      {/if}
    </div>

  <!-- ================= SCREEN 3: Dedicated Studio (Trophy & Audio) ================= -->
  {:else if activeScreen === 'studio'}
    <StudioScreen
      {currentLesson}
      {completedCheckpoints}
      {isEditingCheckpoints}
      bind:editCheckpointsText
      {studentRecorder}
      {teacherRecorder}
      {studentTrack}
      {teacherTrack}
      {studentAudioUrl}
      {teacherAudioUrl}
      {teacherAuth}
      {mascotState}
      {mascotMessage}
      onToggleCheckpoint={toggleCheckpointByKey}
      onEditCheckpoints={handleEditCheckpoints}
      onSaveCheckpoints={saveCheckpoints}
      onCancelEditCheckpoints={() => isEditingCheckpoints = false}
      onStudentRecord={toggleStudentRecord}
      onTeacherRecord={handleTeacherRecord}
      onDeleteStudentTrack={() => deleteTrack('student')}
      onDeleteTeacherTrack={() => deleteTrack('teacher')}
      onSelectScreen={selectScreen}
    />

  <!-- ================= SCREEN 4: Dedicated Full-Page Profile Hub ================= -->
  {:else if activeScreen === 'profile'}
    <ProfileScreen
      {studentProfiles}
      {activeProfileId}
      {activeProfile}
      {allLessons}
      {completedCheckpoints}
      onSelectProfile={handleSelectProfile}
      onAddProfile={handleAddProfile}
      onBack={() => selectScreen('library')}
    />

  <!-- ================= SCREEN 5: Dedicated Full-Page Parent & Teacher Zone ================= -->
  {:else if activeScreen === 'settings'}
    <SettingsScreen
      {teacherAuth}
      onUnlockTeacher={handleUnlockTeacher}
      onLockTeacher={handleLockTeacher}
      onBack={() => selectScreen('library')}
      onOpenAddProvider={() => showAddProviderModal = true}
      onExportData={exportData}
      onImportData={importData}
      onResetAllData={handleResetAllData}
    />
  {/if}

  <!-- Universal Kid-Friendly 3-Pillar Bottom Navigation Bar -->
  <KidsBottomNav
    {activeScreen}
    hasCurrentLesson={!!currentLesson}
    completedStarsCount={currentLesson ? Object.keys(completedCheckpoints).filter(k => k.startsWith(currentLesson!.id) && completedCheckpoints[k]).length : 0}
    hasStudentTrack={!!studentTrack}
    onSelectScreen={selectScreen}
  />

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

  <!-- Add Kid Profile Modal -->
  {#if showAddProfileModal}
    <div
      class="modal-backdrop"
      onclick={() => showAddProfileModal = false}
      onkeydown={(e) => e.key === 'Escape' && (showAddProfileModal = false)}
      role="presentation"
    >
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <div
        class="modal-card neo-card"
        onclick={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
        role="dialog"
        tabindex="-1"
        aria-modal="true"
        aria-label="Add New Kid Profile"
      >
        <h2>➕ Add New Kid Profile</h2>

        <div class="form-group">
          <span class="form-label">Kid's Name:</span>
          <input
            type="text"
            bind:value={newProfileName}
            class="neo-input"
            placeholder="e.g. Emma"
            maxlength="20"
          />
        </div>

        <div class="form-group">
          <span class="form-label">Choose Avatar:</span>
          <div class="avatar-picker-grid">
            {#each KID_AVATARS as av}
              <button
                class="avatar-pick-btn {newProfileAvatar === av.key ? 'selected' : ''}"
                style="background-color: {av.color}"
                onclick={() => newProfileAvatar = av.key}
                type="button"
              >
                <span class="pick-emoji">{av.emoji}</span>
                <span class="pick-label">{av.label}</span>
              </button>
            {/each}
          </div>
        </div>

        <div class="modal-btn-row">
          <button class="action-btn outline-btn" onclick={() => showAddProfileModal = false}>
            Cancel
          </button>
          <button class="action-btn primary-btn" onclick={addStudentProfile} disabled={!newProfileName.trim()}>
            Create Profile ✓
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
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 16px 24px 96px 24px;
    box-sizing: border-box;
  }

  @media (min-width: 1600px) {
    .cockpit-container {
      max-width: 1560px;
      padding: 20px 32px 104px 32px;
    }
  }

  @media (max-width: 640px) {
    .cockpit-container {
      padding: 10px 8px 88px 8px;
    }
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
  .player-card,
  .player-stage-card {
    background: #000000;
    overflow: hidden;
    margin-bottom: 20px;
    transition: max-width 0.25s ease, width 0.25s ease;
  }

  .player-card.theater-mode,
  .player-stage-card.is-theater {
    max-width: 100%;
    width: 100%;
  }

  .player-stage-card:fullscreen,
  .player-stage-card:-webkit-full-screen,
  .player-stage-card.is-fullscreen {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    max-width: none !important;
    border-radius: 0 !important;
    border: none !important;
    display: flex !important;
    flex-direction: column !important;
    background: #000000 !important;
    margin: 0 !important;
    transform: none !important;
    box-shadow: none !important;
    z-index: 999999 !important;
  }

  .player-stage-card:fullscreen .player-box,
  .player-stage-card:-webkit-full-screen .player-box,
  .player-stage-card.is-fullscreen .player-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 0;
    width: 100%;
    background: #000000;
  }

  .player-stage-card:fullscreen .yt-frame,
  .player-stage-card:-webkit-full-screen .yt-frame,
  .player-stage-card.is-fullscreen .yt-frame {
    flex: 1;
    width: 100%;
    min-height: 0;
    height: 100% !important;
    aspect-ratio: 16 / 9;
    max-width: calc((100vh - 130px) * 16 / 9);
    margin: 0 auto;
    background: #000000;
    border: none;
    object-fit: contain;
  }

  .player-stage-card:fullscreen .scrubber-track,
  .player-stage-card:-webkit-full-screen .scrubber-track,
  .player-stage-card.is-fullscreen .scrubber-track,
  .player-stage-card:fullscreen .transport-bar,
  .player-stage-card:-webkit-full-screen .transport-bar,
  .player-stage-card.is-fullscreen .transport-bar {
    flex-shrink: 0;
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
    width: 22px;
    height: 22px;
    background: #FFB300;
    border: 2.5px solid #000;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    box-shadow: 2px 2px 0 #000;
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
    border: 2.5px solid #000;
    border-radius: 10px;
    font-weight: 900;
    font-size: 0.95rem;
    padding: 8px 16px;
    cursor: pointer;
    box-shadow: 2.5px 2.5px 0 #000;
    transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.15s ease;
  }

  .play-toggle-btn:hover {
    transform: translateY(-1px);
    box-shadow: 3px 3px 0 #000;
  }

  .play-toggle-btn:active {
    transform: translate(1px, 1px);
    box-shadow: 0.5px 0.5px 0 #000;
  }

  .play-toggle-btn.playing {
    background: #FF1A35;
  }

  .skip-btn {
    background: #ffffff;
    border: 2px solid #000;
    border-radius: 9px;
    font-weight: 800;
    font-size: 0.8rem;
    padding: 8px 11px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }

  .skip-btn:hover {
    transform: translateY(-1px);
    box-shadow: 2.5px 2.5px 0 #000;
  }

  .skip-btn:active {
    transform: translate(1px, 1px);
    box-shadow: 0.5px 0.5px 0 #000;
  }

  .loop-toggle-btn {
    background: #ffffff;
    border: 2px solid #000;
    border-radius: 9px;
    font-weight: 900;
    font-size: 0.82rem;
    padding: 8px 12px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
    transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.15s ease;
  }

  .loop-toggle-btn:hover {
    transform: translateY(-1px);
    box-shadow: 2.5px 2.5px 0 #000;
  }

  .loop-toggle-btn:active {
    transform: translate(1px, 1px);
    box-shadow: 0.5px 0.5px 0 #000;
  }

  .loop-toggle-btn.active {
    background: #0288D1;
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
    background: #FFCA28;
    border: 2px solid #000;
    border-radius: 9px;
    font-weight: 900;
    font-size: 0.82rem;
    padding: 8px 12px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
    color: #121212;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }

  .count-in-quick-btn:hover {
    transform: translateY(-1px);
    box-shadow: 2.5px 2.5px 0 #000;
  }

  .count-in-quick-btn:active {
    transform: translate(1px, 1px);
    box-shadow: 0.5px 0.5px 0 #000;
  }

  .practice-lab-trigger-btn {
    background: #EDE7F6;
    border: 2px solid #7E57C2;
    border-radius: 9px;
    font-weight: 900;
    font-size: 0.82rem;
    padding: 8px 13px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #7E57C2;
    color: #4A148C;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }

  .practice-lab-trigger-btn:hover {
    transform: translateY(-1px);
    box-shadow: 2.5px 2.5px 0 #7E57C2;
  }

  .practice-lab-trigger-btn:active {
    transform: translate(1px, 1px);
    box-shadow: 0.5px 0.5px 0 #7E57C2;
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

  /* ================= YouTube Kids Header ================= */
  .kids-top-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background: #FFF9C4;
    border: 3px solid #000;
    border-radius: 16px;
    box-shadow: 3px 3px 0 #000;
    margin-bottom: 20px;
    margin-top: 10px;
    position: sticky;
    top: 10px;
    z-index: 100;
  }

  .kids-brand-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    text-align: left;
  }

  .brand-piano-icon {
    font-size: 1.8rem;
  }

  .brand-text-col {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .brand-title {
    font-size: 1.15rem;
    font-weight: 900;
    color: #121212;
  }

  .kids-pill-badge {
    background: #FF5722;
    color: #ffffff;
    font-size: 0.7rem;
    font-weight: 900;
    padding: 2px 6px;
    border-radius: 6px;
    border: 1.5px solid #000;
    letter-spacing: 0.5px;
  }

  .active-profile-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #ffffff;
    border: 2px solid #000;
    border-radius: 24px;
    padding: 4px 12px 4px 6px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
    transition: transform 0.1s ease;
  }

  .active-profile-chip:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }

  .avatar-bubble {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    border: 2px solid #000;
  }

  .profile-info-col {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .profile-name {
    font-weight: 900;
    font-size: 0.85rem;
    color: #121212;
    line-height: 1.1;
  }

  /* ================= TOP BREADCRUMBS BAR ================= */
  .kids-breadcrumbs-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: #ffffff;
    border-radius: 12px;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 4px;
  }

  .crumb-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #F5F5F5;
    border: 2px solid #000;
    border-radius: 8px;
    padding: 4px 10px;
    font-size: 0.82rem;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 1.5px 1.5px 0 #000;
    transition: transform 0.1s ease, background 0.15s ease;
    flex-shrink: 0;
  }

  .crumb-chip:active {
    transform: translate(1px, 1px);
    box-shadow: 0.5px 0.5px 0 #000;
  }

  .crumb-chip.current {
    background: #FFF9C4;
    border-color: #E65100;
  }

  .crumb-avatar {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1.5px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
  }

  .crumb-icon {
    font-size: 0.95rem;
  }

  .crumb-text {
    color: #121212;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .crumb-arrow {
    font-weight: 900;
    font-size: 1.1rem;
    color: #888;
    user-select: none;
    flex-shrink: 0;
  }

  /* ================= SCREEN 0: Splash Intro Styles ================= */
  .screen-splash {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 72vh;
    padding: 20px 10px;
  }

  .splash-hero-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 640px;
    width: 100%;
    padding: 36px 24px;
    background: #ffffff;
    border-radius: 24px;
    gap: 16px;
  }

  .splash-logo-wrap {
    width: 110px;
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 4px;
  }

  .splash-app-logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(4px 4px 0 #000);
    animation: bounceLogo 3s infinite ease-in-out;
  }

  @keyframes bounceLogo {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  .splash-title {
    margin: 0;
    font-size: 2.1rem;
    font-weight: 900;
    color: #121212;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .splash-subtitle {
    margin: 0;
    font-size: 1rem;
    color: #555;
    font-weight: 700;
    max-width: 480px;
  }

  .resume-hero-box {
    width: 100%;
    background: #E8F5E9;
    border: 3px solid #2E7D32;
    border-radius: 16px;
    padding: 16px 20px;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 4px 4px 0 #2E7D32;
    margin-top: 6px;
  }

  .resume-eyebrow-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .resume-dot-badge {
    width: 10px;
    height: 10px;
    background: #4CAF50;
    border-radius: 50%;
    border: 1.5px solid #000;
    animation: pulseDot 1.5s infinite;
  }

  @keyframes pulseDot {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.7; }
  }

  .resume-eyebrow {
    font-size: 0.75rem;
    font-weight: 900;
    color: #2E7D32;
    letter-spacing: 0.05em;
  }

  .resume-main-row {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .resume-avatar-badge {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 2.5px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    box-shadow: 2px 2px 0 #000;
    flex-shrink: 0;
  }

  .resume-text-col {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .resume-song-title {
    margin: 0 0 2px 0;
    font-size: 1.2rem;
    font-weight: 900;
    color: #121212;
  }

  .resume-book-name {
    font-size: 0.8rem;
    font-weight: 700;
    color: #444;
  }

  .resume-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: #4CAF50;
    color: #ffffff;
    font-size: 1.15rem;
    font-weight: 900;
    padding: 14px 20px;
    border-radius: 12px;
    cursor: pointer;
    width: 100%;
    margin-top: 4px;
    transition: transform 0.1s ease;
  }

  .resume-action-btn:active {
    transform: translate(2px, 2px);
  }

  .splash-action-row {
    width: 100%;
    margin-top: 8px;
  }

  .start-funnel-btn {
    width: 100%;
    padding: 14px 20px;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 900;
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  .start-funnel-btn.primary-loud {
    background: #FFCA28;
    color: #121212;
  }

  .start-funnel-btn.secondary-soft {
    background: #FFF9C4;
    color: #121212;
  }

  /* ================= COMMON STEP SCREEN STYLES ================= */
  .screen-step {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 24px;
    animation: fadeInStep 0.2s ease-out;
  }

  @keyframes fadeInStep {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .step-nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .step-back-btn {
    background: #ffffff;
    border: 2px solid #000;
    border-radius: 10px;
    padding: 8px 14px;
    font-weight: 900;
    font-size: 0.85rem;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
    transition: transform 0.1s ease;
  }

  .step-back-btn:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }

  .step-counter-pill {
    background: #FFF9C4;
    border: 2px solid #000;
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 0.8rem;
    font-weight: 900;
    box-shadow: 1.5px 1.5px 0 #000;
  }

  .step-hero-header {
    text-align: center;
    padding: 10px 0 6px 0;
  }

  .step-emoji-hero {
    font-size: 2.4rem;
    display: inline-block;
    margin-bottom: 4px;
  }

  .step-main-title {
    margin: 0 0 6px 0;
    font-size: 1.7rem;
    font-weight: 900;
    color: #121212;
  }

  .step-sub-instruction {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    color: #555;
  }

  /* ================= STEP 1: PROFILES GRID ================= */
  .profiles-full-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 18px;
  }

  .profile-jumbo-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 16px;
    border-radius: 18px;
    background: #ffffff;
    cursor: pointer;
    gap: 12px;
    text-align: center;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .profile-jumbo-card:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
  }

  .profile-jumbo-card.selected-kid {
    background: #FFF8E1;
    border-color: #E65100;
    box-shadow: 5px 5px 0 #E65100;
  }

  .jumbo-bubble-circle {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    border: 4px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: 3px 3px 0 #000;
  }

  .jumbo-avatar-emoji {
    font-size: 2.8rem;
  }

  .jumbo-crown-badge {
    position: absolute;
    top: -10px;
    right: -8px;
    font-size: 1.4rem;
    filter: drop-shadow(1px 1px 0 #000);
  }

  .jumbo-kid-name {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 900;
    color: #121212;
  }

  .jumbo-active-pill {
    background: #4CAF50;
    color: #ffffff;
    border: 1.5px solid #000;
    border-radius: 12px;
    padding: 4px 12px;
    font-size: 0.75rem;
    font-weight: 900;
  }

  .jumbo-tap-pill {
    background: #F0F0F0;
    color: #333;
    border: 1.5px solid #000;
    border-radius: 12px;
    padding: 4px 12px;
    font-size: 0.75rem;
    font-weight: 800;
  }

  .add-kid-jumbo-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    border-radius: 18px;
    background: #FAFAFA;
    border: 3px dashed #666;
    cursor: pointer;
    gap: 12px;
    text-align: center;
  }

  .add-jumbo-circle {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    border: 3px dashed #666;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.4rem;
    background: #ffffff;
  }

  /* ================= STEP 2: BOOKS GRID ================= */
  .books-full-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }

  .book-jumbo-card {
    display: flex;
    gap: 18px;
    padding: 20px;
    border-radius: 18px;
    background: #ffffff;
    cursor: pointer;
    text-align: left;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .book-jumbo-card:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
  }

  .book-jumbo-card.selected-book {
    background: #FFF8E1;
    border-color: #E65100;
    box-shadow: 5px 5px 0 #E65100;
  }

  .book-jumbo-cover {
    width: 84px;
    height: 110px;
    background: #FF7043;
    border: 3px solid #000;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px;
    color: #fff;
    text-align: center;
    box-shadow: 2.5px 2.5px 0 #000;
    flex-shrink: 0;
  }

  .book-icon-hero {
    font-size: 2.4rem;
  }

  .book-pub-badge {
    font-size: 0.6rem;
    font-weight: 900;
    text-transform: uppercase;
    margin-top: 4px;
    line-height: 1.1;
  }

  .book-jumbo-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    min-width: 0;
  }

  .book-jumbo-title {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 900;
    color: #121212;
  }

  .book-pieces-badge {
    font-size: 0.85rem;
    font-weight: 800;
    color: #555;
  }

  .book-selected-pill {
    background: #4CAF50;
    color: #ffffff;
    border: 1.5px solid #000;
    border-radius: 8px;
    padding: 4px 10px;
    font-size: 0.8rem;
    font-weight: 900;
    width: fit-content;
    margin-top: 4px;
  }

  .book-tap-pill {
    background: #FFCA28;
    color: #121212;
    border: 1.5px solid #000;
    border-radius: 8px;
    padding: 4px 10px;
    font-size: 0.8rem;
    font-weight: 900;
    width: fit-content;
    margin-top: 4px;
  }

  /* ================= STEP 3: TEACHERS GRID ================= */
  .teachers-full-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 18px;
  }

  .teacher-jumbo-card {
    display: flex;
    gap: 16px;
    padding: 20px;
    border-radius: 18px;
    background: #ffffff;
    cursor: pointer;
    text-align: left;
    position: relative;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .teacher-jumbo-card:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
  }

  .teacher-jumbo-card.pip-pick-highlight {
    background: #FFFDE7;
    border-color: #F57F17;
  }

  .pip-pick-banner {
    position: absolute;
    top: -12px;
    right: 18px;
    background: #FFD54F;
    border: 2px solid #000;
    border-radius: 12px;
    padding: 2px 10px;
    font-size: 0.75rem;
    font-weight: 900;
    box-shadow: 1.5px 1.5px 0 #000;
  }

  .teacher-avatar-col {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 3px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    box-shadow: 2.5px 2.5px 0 #000;
    flex-shrink: 0;
  }

  .teacher-jumbo-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .teacher-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .teacher-jumbo-name {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 900;
    color: #121212;
  }

  .teacher-jumbo-bio {
    margin: 0 0 10px 0;
    font-size: 0.8rem;
    color: #555;
    line-height: 1.35;
    font-weight: 600;
  }

  .teacher-footer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: auto;
  }

  .teacher-handle {
    font-size: 0.75rem;
    font-weight: 800;
    color: #666;
  }

  .teacher-lessons-count {
    font-size: 0.75rem;
    font-weight: 900;
    color: #2E7D32;
    background: #E8F5E9;
    padding: 2px 8px;
    border-radius: 6px;
    border: 1px solid #000;
  }

  .teacher-select-pill {
    font-size: 0.75rem;
    font-weight: 900;
    color: #121212;
    background: #FFF9C4;
    padding: 3px 8px;
    border-radius: 6px;
    border: 1.5px solid #000;
  }

  .add-custom-channel-row {
    display: flex;
    justify-content: center;
    margin-top: 4px;
  }

  .add-channel-full-btn {
    background: #ffffff;
    font-size: 0.95rem;
    font-weight: 800;
    padding: 12px 20px;
    border-radius: 12px;
    cursor: pointer;
  }

  /* ================= STEP 4: SONGS LIST GRID ================= */
  .continue-lesson-card {
    background: #E8F5E9;
    border: 2.5px solid #2E7D32;
    border-radius: 16px;
    padding: 14px 18px;
    box-shadow: 3.5px 3.5px 0 #2E7D32;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .continue-badge {
    background: #2E7D32;
    color: #ffffff;
    font-size: 0.7rem;
    font-weight: 900;
    padding: 2px 8px;
    border-radius: 6px;
  }

  .continue-content-row {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .continue-num {
    font-size: 1.4rem;
    font-weight: 900;
    background: #C8E6C9;
    border: 2px solid #000;
    border-radius: 8px;
    padding: 4px 10px;
  }

  .continue-text-col {
    flex: 1;
    min-width: 160px;
  }

  .continue-text-col h3 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 900;
  }

  .continue-text-col span {
    font-size: 0.8rem;
    font-weight: 700;
    color: #444;
  }

  .continue-play-now-btn {
    background: #4CAF50;
    color: #ffffff;
    font-size: 0.95rem;
    font-weight: 900;
    padding: 10px 16px;
    border-radius: 10px;
    cursor: pointer;
  }

  .lesson-search-bar-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    background: #ffffff;
    border-radius: 14px;
  }

  .lesson-search-input {
    flex: 1;
    border: 2px solid #000;
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 0.95rem;
    font-weight: 700;
    outline: none;
  }

  .lesson-count-badge {
    background: #E8F5E9;
    border: 1.5px solid #2E7D32;
    color: #2E7D32;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 900;
    padding: 6px 12px;
    white-space: nowrap;
  }

  .lessons-full-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
  }

  .song-step-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #ffffff;
    border: 2.5px solid #000;
    border-radius: 14px;
    padding: 12px 14px;
    cursor: pointer;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .song-star {
    font-size: 1.1rem;
  }

  .song-play-btn {
    background: #4CAF50;
    color: #ffffff;
    border: 1.5px solid #000;
    border-radius: 6px;
    font-weight: 900;
    font-size: 0.75rem;
    padding: 4px 8px;
    box-shadow: 1px 1px 0 #000;
  }

  /* ================= SCREEN 2: Practice Cinema Player Stage Styles ================= */
  .screen-player {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding-bottom: 96px;
    transition: background-color 0.4s ease;
  }

  /* Option A Practice Cinema Auto-Dimming Mode */
  .screen-player.is-cinema-mode {
    background: var(--cinema-stage, #08070D);
    border-radius: var(--radius-stage, 16px);
    padding: 12px;
  }

  .screen-player.is-cinema-mode .player-top-strip,
  .screen-player.is-cinema-mode .player-mascot-row,
  .screen-player.is-cinema-mode .player-quick-action-strip {
    opacity: 0;
    pointer-events: none;
    transform: translateY(-8px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  .screen-player.is-cinema-mode .stage-viewport {
    box-shadow: 0 0 45px rgba(0, 210, 211, 0.2), 0 16px 36px rgba(0, 0, 0, 0.7);
    border-color: rgba(0, 210, 211, 0.5);
  }

  /* 1. Wayfinding Top Strip (Zero-Border, Frameless) */
  .player-top-strip {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 8px;
    flex-wrap: wrap;
    gap: 12px;
    transition: opacity 0.25s ease, transform 0.25s ease;
  }

  .player-song-meta {
    display: flex;
    align-items: baseline;
    gap: 10px;
    flex-wrap: wrap;
  }

  .player-song-idx {
    font-size: 0.85rem;
    font-weight: 900;
    color: var(--retro-pink, #FF3366);
    letter-spacing: 0.04em;
  }

  .player-song-title {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 900;
    color: var(--text-heading, #121212);
    letter-spacing: -0.02em;
  }

  .player-book-label {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-muted, #71717A);
  }

  /* In-Player Teacher Switcher (Tactile Capsule Pills) */
  .in-player-teacher-strip {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .teacher-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px 5px 6px;
    border-radius: var(--radius-capsule, 9999px);
    border: 2px solid var(--border-dark, #0F0E17);
    background: var(--card-bg, #ffffff);
    color: var(--text-heading, #121212);
    font-size: 0.82rem;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 2.5px 2.5px 0 var(--border-dark, #0F0E17);
    transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.15s ease;
  }

  .teacher-pill:hover {
    transform: translateY(-1px);
    box-shadow: 3.5px 3.5px 0 var(--border-dark, #0F0E17);
  }

  .teacher-pill:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 var(--border-dark, #0F0E17);
  }

  .teacher-pill.active {
    background: var(--retro-pink, #FF3366);
    color: #ffffff;
    box-shadow: 2.5px 2.5px 0 var(--border-dark, #0F0E17);
  }

  .teacher-token-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: var(--radius-token, 50%);
    background: rgba(0, 0, 0, 0.08);
    font-size: 0.9rem;
  }

  .teacher-pill.active .teacher-token-avatar {
    background: rgba(255, 255, 255, 0.25);
  }

  .teacher-pill-name {
    letter-spacing: 0.02em;
  }

  /* Top Right Actions (Tokens & Capsules) */
  .player-top-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .token-disc-btn {
    background: var(--card-bg, #ffffff);
    border: 2px solid var(--border-dark, #0F0E17);
    border-radius: var(--radius-token, 50%);
    width: 38px;
    height: 38px;
    font-size: 0.9rem;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 2px 2px 0 var(--border-dark, #0F0E17);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }

  .token-disc-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    box-shadow: none;
  }

  .token-disc-btn:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 3px 3px 0 var(--border-dark, #0F0E17);
  }

  .capsule-metronome-btn {
    background: var(--card-bg, #ffffff);
    border: 2px solid var(--border-dark, #0F0E17);
    border-radius: var(--radius-capsule, 9999px);
    padding: 6px 14px;
    font-size: 0.85rem;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 2px 2px 0 var(--border-dark, #0F0E17);
    transition: transform 0.12s ease, background 0.15s ease;
  }

  .capsule-metronome-btn.active {
    background: var(--retro-gold, #FEE75C);
    color: #0F0E17;
  }

  /* 2. Stage Viewport (16px Radius Stage Window) */
  .stage-viewport {
    background: #000000;
    border: 3px solid var(--border-dark, #0F0E17);
    border-radius: var(--radius-stage, 16px);
    overflow: hidden;
    box-shadow: 6px 6px 0 var(--border-dark, #0F0E17);
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.3s ease, border-color 0.3s ease;
    margin-bottom: 8px;
  }

  /* 3. Tactile Command Island */
  .tactile-command-island {
    background: var(--card-bg, #ffffff);
    border-top: 3px solid var(--border-dark, #0F0E17);
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  /* Giant 64px Stadium Capsule Pill */
  .command-giant-pill {
    height: var(--min-tap-lg, 64px);
    padding: 0 32px;
    border-radius: var(--radius-capsule, 9999px);
    border: 3px solid var(--border-dark, #0F0E17);
    background: var(--arcade-cyan, #00D2D3);
    color: #0F0E17;
    font-size: 1.15rem;
    font-weight: 900;
    letter-spacing: 0.05em;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    box-shadow: 4px 4px 0 var(--border-dark, #0F0E17);
    transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.15s ease;
  }

  .command-giant-pill:hover {
    transform: translateY(-2px);
    box-shadow: 5px 5px 0 var(--border-dark, #0F0E17);
  }

  .command-giant-pill:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 var(--border-dark, #0F0E17);
  }

  .command-giant-pill.is-playing {
    background: var(--retro-pink, #FF3366);
    color: #ffffff;
  }

  .command-giant-pill .giant-icon {
    font-size: 1.35rem;
  }

  /* 48px Tactile Discs Cluster */
  .tactile-discs-cluster {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .tactile-disc {
    width: var(--min-tap-md, 48px);
    height: var(--min-tap-md, 48px);
    border-radius: var(--radius-token, 50%);
    border: 2.5px solid var(--border-dark, #0F0E17);
    background: var(--card-bg, #ffffff);
    color: var(--text-heading, #121212);
    font-size: 0.95rem;
    font-weight: 900;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 3px 3px 0 var(--border-dark, #0F0E17);
    transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.15s ease;
  }

  .tactile-disc:hover {
    transform: translateY(-1px);
    box-shadow: 4px 4px 0 var(--border-dark, #0F0E17);
  }

  .tactile-disc:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 var(--border-dark, #0F0E17);
  }

  .tactile-disc.loop-disc.is-active {
    background: var(--cyber-accent, #54A0FF);
    color: #ffffff;
  }

  .tactile-disc.seek-disc {
    font-size: 0.78rem;
    letter-spacing: -0.02em;
  }

  /* Discrete Secondary Capsule Bar */
  .tactile-secondary-strip {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .secondary-capsule {
    padding: 8px 14px;
    border-radius: var(--radius-capsule, 9999px);
    border: 2px solid var(--border-dark, #0F0E17);
    background: var(--surface-secondary, #F4F3FA);
    color: var(--text-heading, #121212);
    font-size: 0.8rem;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 2px 2px 0 var(--border-dark, #0F0E17);
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }

  .secondary-capsule:hover {
    transform: translateY(-1px);
    box-shadow: 3px 3px 0 var(--border-dark, #0F0E17);
  }

  .secondary-capsule.count-in-pill {
    background: #FECA57;
  }

  .secondary-capsule.mute-pill.muted {
    background: #FF6B6B;
    color: white;
  }

  /* Responsive Command Island */
  @media (max-width: 820px) {
    .tactile-command-island {
      justify-content: center;
      gap: 12px;
    }
    .command-giant-pill {
      width: 100%;
      justify-content: center;
    }
  }

  /* Mascot Row */
  .player-mascot-row {
    transition: opacity 0.25s ease, transform 0.25s ease;
  }

  /* Clean Quick Action Strip (Capsule & Stage 16px) */
  .player-quick-action-strip {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 4px;
    transition: opacity 0.25s ease, transform 0.25s ease;
  }

  @media (max-width: 580px) {
    .player-quick-action-strip {
      grid-template-columns: 1fr;
    }
  }

  .quick-nav-capsule {
    display: flex;
    align-items: center;
    gap: 14px;
    border: 2.5px solid var(--border-dark, #0F0E17);
    border-radius: var(--radius-stage, 16px);
    padding: 14px;
    cursor: pointer;
    box-shadow: 3.5px 3.5px 0 var(--border-dark, #0F0E17);
    text-align: left;
    background: var(--card-bg, #ffffff);
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .quick-nav-capsule:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 var(--border-dark, #0F0E17);
  }

  .quick-nav-capsule.studio-cta {
    background: rgba(0, 210, 211, 0.12);
    border-color: var(--arcade-cyan, #00D2D3);
  }

  .quick-nav-capsule.goals-cta {
    background: rgba(254, 231, 92, 0.2);
    border-color: #E1B12C;
  }

  .cta-token {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: var(--radius-token, 50%);
    background: var(--card-bg, #ffffff);
    border: 2px solid var(--border-dark, #0F0E17);
    font-size: 1.4rem;
    flex-shrink: 0;
  }

  .cta-text-col {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .cta-text-col strong {
    font-size: 0.95rem;
    font-weight: 900;
    color: var(--text-heading, #121212);
  }

  .cta-text-col small {
    font-size: 0.75rem;
    color: var(--text-muted, #71717A);
  }

  .cta-arrow {
    font-size: 1.3rem;
    font-weight: 900;
    color: var(--text-heading, #121212);
  }

  /* ================= SCREEN 3: Studio Styles ================= */
  .screen-studio {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .studio-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px;
    background: #ffffff;
    flex-wrap: wrap;
    gap: 10px;
  }

  .studio-top-tag {
    font-size: 0.7rem;
    font-weight: 900;
    color: #E65100;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .studio-top-bar h2 {
    margin: 2px 0 0 0;
    font-size: 1.25rem;
    font-weight: 900;
  }

  .back-to-player-btn {
    background: #4CAF50;
    color: #ffffff;
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 900;
    font-size: 0.85rem;
    padding: 8px 14px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
  }

  /* ================= SCREEN 4: Goals Styles ================= */
  .screen-goals {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .goals-hero-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px;
    background: #FFFDE7;
    border: 3px solid #000;
    border-radius: 16px;
    box-shadow: 4px 4px 0 #000;
    flex-wrap: wrap;
    gap: 14px;
  }

  .hero-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .hero-icon {
    font-size: 2.2rem;
  }

  .hero-tag {
    font-size: 0.7rem;
    font-weight: 900;
    color: #F57F17;
  }

  .goals-hero-card h2 {
    margin: 2px 0 6px 0;
    font-size: 1.3rem;
    font-weight: 900;
  }

  .stars-badge {
    font-size: 0.85rem;
    font-weight: 900;
    background: #FFE082;
    padding: 3px 8px;
    border-radius: 6px;
    border: 1.5px solid #000;
  }

  .mastered-badge {
    font-size: 0.85rem;
    font-weight: 900;
    background: #C8E6C9;
    color: #2E7D32;
    padding: 3px 8px;
    border-radius: 6px;
    border: 1.5px solid #000;
  }

  .hero-right {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .goals-checklist-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .goal-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    background: #ffffff;
    border: 2.5px solid #000;
    border-radius: 14px;
    box-shadow: 3px 3px 0 #000;
    cursor: pointer;
    text-align: left;
    transition: transform 0.1s ease;
  }

  .goal-card:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }

  .goal-card.done {
    background: #FFFDE7;
    border-color: #FFB300;
  }

  .goal-star-bubble {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    background: #F5F5F5;
    box-shadow: 1px 1px 0 #000;
    flex-shrink: 0;
  }

  .goal-star-bubble.earned {
    background: #FFD54F;
  }

  .goal-content {
    flex: 1;
    min-width: 0;
  }

  .goal-number {
    font-size: 0.75rem;
    font-weight: 800;
    color: #777;
  }

  .goal-text {
    margin: 2px 0 0 0;
    font-size: 0.95rem;
    font-weight: 800;
    color: #121212;
  }

  .goal-check-pill {
    font-size: 0.75rem;
    font-weight: 900;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1.5px solid #000;
    background: #F5F5F5;
    color: #555;
  }

  .goal-check-pill.done {
    background: #4CAF50;
    color: #ffffff;
  }

  .goals-edit-card {
    padding: 16px;
    background: #ffffff;
  }

  .no-lesson-state {
    padding: 36px 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .empty-icon {
    font-size: 3rem;
  }

  /* ================= Universal Kids Bottom Navigation Dock ================= */
  .kids-bottom-dock {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    background: #FFF9C4;
    border-top: 3px solid #000;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 6px 10px calc(6px + env(safe-area-inset-bottom, 0px));
    z-index: 1000;
    box-shadow: 0 -3px 0 rgba(0,0,0,0.08);
    box-sizing: border-box;
  }

  .dock-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 16px;
    position: relative;
    border-radius: 12px;
    transition: transform 0.1s ease;
  }

  .dock-btn:active {
    transform: scale(0.94);
  }

  .dock-btn.active {
    background: #FFE082;
    border: 2px solid #000;
    box-shadow: 2px 2px 0 #000;
  }

  .dock-icon {
    font-size: 1.4rem;
  }

  .dock-label {
    font-size: 0.75rem;
    font-weight: 900;
    color: #121212;
  }

  .dock-pill-indicator {
    position: absolute;
    top: 4px;
    right: 12px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4CAF50;
    border: 1px solid #000;
  }

  .dock-badge-success {
    position: absolute;
    top: 2px;
    right: 8px;
    background: #4CAF50;
    color: #fff;
    font-size: 0.65rem;
    font-weight: 900;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #000;
  }

  .dock-badge-stars {
    position: absolute;
    top: 2px;
    right: 4px;
    background: #FFD54F;
    color: #000;
    font-size: 0.65rem;
    font-weight: 900;
    padding: 1px 4px;
    border-radius: 8px;
    border: 1px solid #000;
  }

  /* ================= Avatar Picker Grid ================= */
  .avatar-picker-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-top: 8px;
  }

  .avatar-pick-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 6px;
    border: 2px solid #000;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
    transition: transform 0.1s ease;
  }

  .avatar-pick-btn.selected {
    border-width: 3px;
    box-shadow: 0 0 0 3px #000;
    transform: scale(1.05);
  }

  .pick-emoji {
    font-size: 1.8rem;
  }

  .pick-label {
    font-size: 0.65rem;
    font-weight: 800;
    color: #000;
    text-align: center;
  }
</style>
