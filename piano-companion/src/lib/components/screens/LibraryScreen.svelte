<script lang="ts">
  import type { LocalBook, LocalLesson } from '#lib/db/db.js';
  import { getEducatorInfo } from '#lib/types/educator.js';
  import JourneyMapScreen from '../journey/JourneyMapScreen.svelte';

  let {
    books,
    selectedBookId,
    currentBook,
    providers,
    selectedProvider,
    lessons,
    allLessons,
    currentLesson,
    lastPracticedLesson,
    currentListType,
    onSelectBook,
    onSelectProvider,
    onSelectLesson,
    onOpenAddProvider
  } = $props<{
    books: LocalBook[];
    selectedBookId: string;
    currentBook: LocalBook | null;
    providers: string[];
    selectedProvider: string;
    lessons: LocalLesson[];
    allLessons: LocalLesson[];
    currentLesson: LocalLesson | null;
    lastPracticedLesson: LocalLesson | null;
    currentListType: 'chapters' | 'playlist' | 'singles';
    onSelectBook: (bookId: string) => Promise<void> | void;
    onSelectProvider: (provider: string) => void;
    onSelectLesson: (lesson: LocalLesson) => Promise<void> | void;
    onOpenAddProvider: () => void;
  }>();

  let showBookPickerModal = $state<boolean>(false);
  let lessonSearch = $state<string>('');
  let showAllProviders = $state<boolean>(false);

  let visibleProviders = $derived.by(() => {
    if (showAllProviders || providers.length <= 3) return providers;
    const selectedIdx = providers.indexOf(selectedProvider);
    if (selectedIdx < 3) {
      return providers.slice(0, 3);
    } else {
      return [providers[0], providers[1], selectedProvider];
    }
  });

  let hiddenProviderCount = $derived(Math.max(0, providers.length - 3));

  let viewMode = $state<'journey' | 'list'>(typeof window !== 'undefined' ? (localStorage.getItem('journey_view_mode') as 'journey' | 'list') || 'journey' : 'journey');

  function setViewMode(mode: 'journey' | 'list') {
    viewMode = mode;
    if (typeof window !== 'undefined') {
        localStorage.setItem('journey_view_mode', mode);
    }
  }

  let filteredLessons = $derived(
    lessons.filter((l: LocalLesson) =>
      l.title.toLowerCase().includes(lessonSearch.toLowerCase()) ||
      l.sequenceIndex.toString() === lessonSearch.trim()
    )
  );

  function formatTime(seconds: number) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function handleChooseBook(bookId: string) {
    onSelectBook(bookId);
    showBookPickerModal = false;
  }
</script>

<div class="screen-library">

  <!-- View Mode Switcher -->
  <div class="flex justify-center mb-6">
    <div class="bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-full flex gap-1 w-fit border border-slate-200 dark:border-slate-700/50">
      <button
        class="px-5 py-2 rounded-full font-bold text-sm transition-all {viewMode === 'journey' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}"
        onclick={() => setViewMode('journey')}
      >
        🗺️ Adventure Map
      </button>
      <button
        class="px-5 py-2 rounded-full font-bold text-sm transition-all {viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}"
        onclick={() => setViewMode('list')}
      >
        📑 Book Index
      </button>
    </div>
  </div>

  {#if viewMode === 'journey'}
    <div class="journey-viewport-frame w-full relative rounded-2xl overflow-hidden border-3 border-black shadow-[4px_4px_0_#000]">
        <JourneyMapScreen
            {lessons}
            currentBookId={selectedBookId}
            activeLessonId={lastPracticedLesson?.id}
            onLessonSelect={onSelectLesson}
        />
    </div>
  {:else}
  <!-- Tier 1: Active Piano Book Shelf Card -->
  <section class="book-active-shelf neo-card">
    <div class="shelf-left">
      <div class="book-3d-cover">
        <span class="cover-icon">📖</span>
        <span class="cover-publisher">{currentBook?.publisher ?? 'Mitras'}</span>
      </div>
      <div class="shelf-info">
        <span class="shelf-eyebrow">CURRENT PIANO BOOK</span>
        <h2 class="shelf-title">{currentBook?.title ?? 'Select a Book'}</h2>
        <span class="shelf-pieces-count">
          {allLessons.filter((l: LocalLesson) => l.bookId === selectedBookId).length} pieces in this book
        </span>
      </div>
    </div>
    <div class="shelf-right">
      <button
        class="change-book-btn neo-btn"
        onclick={() => showBookPickerModal = true}
        title="Switch to a different piano book"
      >
        <span>📚 Change Book</span>
      </button>
    </div>
  </section>

  <!-- Tier 2: YouTube Teacher Selector Pills -->
  <section class="teacher-selector-section neo-card">
    <div class="section-header-row">
      <div class="title-wrap">
        <span class="section-icon">📺</span>
        <h3 class="section-title">Pick Your YouTube Teacher</h3>
      </div>
      <button class="add-channel-chip" onclick={onOpenAddProvider} title="Add custom YouTube channel">
        + Add Channel
      </button>
    </div>

    <div class="teacher-pills-row">
      {#each visibleProviders as provider}
        {@const pLessons = allLessons.filter((l: LocalLesson) => l.providerName === provider && l.bookId === selectedBookId)}
        {@const ed = getEducatorInfo(provider)}
        {@const isPipPick = provider.includes('Anikó Drabon')}
        <button
          class="teacher-pill-btn {selectedProvider === provider ? 'selected' : ''}"
          onclick={() => onSelectProvider(provider)}
        >
          <div class="pill-avatar" style="background-color: {ed.avatarBgColor}">
            <span>{ed.avatarEmoji}</span>
          </div>
          <div class="pill-meta">
            <div class="pill-name-row">
              <span class="pill-name">{ed.educatorName}</span>
              {#if isPipPick}
                <span class="pip-star-badge">⭐ Pip's Pick</span>
              {/if}
            </div>
            <span class="pill-count">{pLessons.length} lessons • {ed.channelHandle}</span>
          </div>
          {#if selectedProvider === provider}
            <span class="pill-check">✓</span>
          {/if}
        </button>
      {/each}

      {#if providers.length > 3}
        <button
          class="teacher-pill-btn expand-pill-btn"
          onclick={() => showAllProviders = !showAllProviders}
          title={showAllProviders ? 'Show fewer teachers' : `Show ${hiddenProviderCount} more teachers`}
          aria-expanded={showAllProviders}
        >
          <div class="pill-avatar plus-avatar">
            <span>{showAllProviders ? '▲' : '➕'}</span>
          </div>
          <div class="pill-meta">
            <div class="pill-name-row">
              <span class="pill-name">{showAllProviders ? 'Show Less' : `+${hiddenProviderCount} More`}</span>
            </div>
            <span class="pill-count">{showAllProviders ? 'Collapse list' : 'View other teachers'}</span>
          </div>
        </button>
      {/if}
    </div>
  </section>

  <!-- Tier 3: Last Practiced Song Quick Resume (if in active book/provider) -->
  {#if lastPracticedLesson && lessons.some((l: LocalLesson) => l.id === lastPracticedLesson?.id)}
    <div class="quick-resume-box neo-card">
      <div class="resume-badge-tag">⭐ CONTINUE WHERE YOU LEFT OFF</div>
      <div class="resume-content-row">
        <div class="resume-num">#{lastPracticedLesson.sequenceIndex}</div>
        <div class="resume-text">
          <h4>{lastPracticedLesson.title}</h4>
          <span>Ready to practice today's lesson?</span>
        </div>
        <button class="resume-play-btn neo-btn" onclick={() => onSelectLesson(lastPracticedLesson!)}>
          Resume ▶
        </button>
      </div>
    </div>
  {/if}

  <!-- Tier 4: Song Search & Song Cards List -->
  <section class="songs-list-section neo-card">
    <div class="search-and-count-bar">
      <div class="search-input-wrap">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          class="song-search-input"
          placeholder="Search song title or piece #..."
          bind:value={lessonSearch}
        />
        {#if lessonSearch}
          <button class="clear-search-btn" onclick={() => lessonSearch = ''}>✕</button>
        {/if}
      </div>
      <span class="song-count-pill">{filteredLessons.length} Songs</span>
    </div>

    <div class="songs-grid">
      {#each filteredLessons as l}
        <button
          class="song-grid-card {currentLesson?.id === l.id ? 'current' : ''}"
          onclick={() => onSelectLesson(l)}
        >
          <div class="song-card-num">#{l.sequenceIndex}</div>
          <div class="song-card-content">
            <h4 class="song-card-title">{l.title}</h4>
            {#if currentListType === 'chapters' && l.endTime > 0}
              <span class="song-card-chapter">
                Chapter: {formatTime(l.startTime)} → {formatTime(l.endTime)}
              </span>
            {/if}
          </div>
          <div class="song-card-action">
            <span class="song-card-star">{l.isCompleted ? '⭐' : '○'}</span>
            <span class="song-play-tag">Play ▶</span>
          </div>
        </button>
      {/each}
    </div>
  </section>
  {/if}
</div>

<!-- Book Picker Modal (When "Change Book" is tapped) -->
{#if showBookPickerModal}
  <div class="modal-backdrop" onclick={() => showBookPickerModal = false}>
    <div class="book-picker-sheet neo-card" onclick={(e) => e.stopPropagation()}>
      <div class="picker-header">
        <div class="picker-title-wrap">
          <span class="modal-emoji">📚</span>
          <h3>Choose Your Piano Book</h3>
        </div>
        <button class="modal-close-btn" onclick={() => showBookPickerModal = false}>✕</button>
      </div>

      <div class="bookshelf-grid">
        {#each books as b}
          <button
            class="shelf-book-card {selectedBookId === b.id ? 'active-book' : ''}"
            onclick={() => handleChooseBook(b.id)}
          >
            <div class="shelf-book-cover">
              <span class="shelf-icon">📖</span>
              <span class="shelf-pub">{b.publisher}</span>
            </div>
            <div class="shelf-book-details">
              <h4>{b.title}</h4>
              <span class="shelf-lessons-avail">
                {allLessons.filter((l: LocalLesson) => l.bookId === b.id).length} pieces
              </span>
              {#if selectedBookId === b.id}
                <span class="shelf-selected-tag">✓ Currently Selected</span>
              {/if}
            </div>
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  .screen-library {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 96px; /* clearance for bottom dock */
  }

  .journey-viewport-frame {
    height: calc(100vh - 170px);
    min-height: 520px;
    background: var(--bg-canvas, #F5F3FF);
  }

  /* Active Shelf */
  .book-active-shelf {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px;
    background: #FFF8E1;
    border-radius: 18px;
    gap: 16px;
    flex-wrap: wrap;
  }

  .shelf-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .book-3d-cover {
    width: 72px;
    height: 92px;
    background: linear-gradient(135deg, #FF7043 0%, #E64A19 100%);
    border: 3px solid #000;
    border-right: 6px solid #FFCCBC;
    border-radius: 8px 12px 12px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 3.5px 3.5px 0 #000;
    color: #fff;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }

  .book-3d-cover::before {
    content: '';
    position: absolute;
    top: 0;
    left: 8px;
    bottom: 0;
    width: 2px;
    background: rgba(0, 0, 0, 0.25);
  }

  .cover-icon {
    font-size: 2rem;
  }

  .cover-publisher {
    font-size: 0.55rem;
    font-weight: 900;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .shelf-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .shelf-eyebrow {
    font-size: 0.72rem;
    font-weight: 900;
    color: #E65100;
    letter-spacing: 0.05em;
  }

  .book-active-shelf {
    background: var(--card-bg, #ffffff);
    color: var(--text-main, #121212);
    border-radius: 18px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .shelf-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .book-3d-cover {
    width: 62px;
    height: 80px;
    background: #FF5722;
    border: 2.5px solid #000;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 3px 3px 0 #000;
    color: #fff;
    flex-shrink: 0;
  }

  .cover-icon {
    font-size: 1.8rem;
  }

  .cover-publisher {
    font-size: 0.55rem;
    font-weight: 900;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .shelf-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .shelf-eyebrow {
    font-size: 0.68rem;
    font-weight: 900;
    color: #FF5722;
    letter-spacing: 0.04em;
  }

  .shelf-title {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 900;
    color: var(--text-main, #121212);
  }

  .shelf-pieces-count {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--text-muted, #555);
  }

  .change-book-btn {
    background: var(--tint-yellow, #FFF8E1);
    color: var(--text-main, #121212);
    border: 2px solid #000;
    font-size: 0.9rem;
    font-weight: 900;
    padding: 10px 16px;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
  }

  :global(.dark) .change-book-btn {
    background: #2B2618;
    color: #FFDE59;
    border-color: #FFA94D;
  }

  /* Teacher Pills */
  .teacher-selector-section {
    padding: 16px 18px;
    background: var(--card-bg, #ffffff);
    color: var(--text-main, #121212);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .section-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-icon {
    font-size: 1.3rem;
  }

  .section-title {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 900;
    color: var(--text-main, #121212);
  }

  .add-channel-chip {
    background: var(--card-bg-subtle, #F5F5F5);
    color: var(--text-main, #121212);
    border: 1.5px solid #000;
    border-radius: 8px;
    font-weight: 800;
    font-size: 0.75rem;
    padding: 4px 10px;
    cursor: pointer;
  }

  :global(.dark) .add-channel-chip {
    background: #242238;
    border-color: #A7A9BE;
    color: #FFFFFE;
  }

  .teacher-pills-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 10px;
  }

  .teacher-pill-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--card-bg-subtle, #FAFAFA);
    color: var(--text-main, #121212);
    border: 2px solid #000;
    border-radius: 14px;
    padding: 9px 13px;
    cursor: pointer;
    text-align: left;
    box-shadow: 2px 2px 0 #000;
    transition: transform 0.12s ease, box-shadow 0.12s ease, background-color 0.12s ease;
  }

  .teacher-pill-btn:hover {
    transform: translateY(-2px);
    box-shadow: 3px 3px 0 #000;
  }

  .teacher-pill-btn:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }

  .teacher-pill-btn.selected {
    background: #E8F5E9;
    border-color: #2E7D32;
    box-shadow: 3.5px 3.5px 0 #2E7D32;
  }

  :global(.dark) .teacher-pill-btn.selected {
    background: #15291E;
    border-color: #00FFA3;
    box-shadow: 3.5px 3.5px 0 #00FFA3;
  }

  .teacher-pill-btn.expand-pill-btn {
    background: #FFFDE7;
    border-style: dashed;
    border-color: #F57F17;
  }

  :global(.dark) .teacher-pill-btn.expand-pill-btn {
    background: #2B2618;
    border-style: dashed;
    border-color: #FFA94D;
  }

  .teacher-pill-btn.expand-pill-btn:hover {
    background: #FFF9C4;
  }

  :global(.dark) .teacher-pill-btn.expand-pill-btn:hover {
    background: #3B2E15;
  }

  .plus-avatar {
    background-color: #FFE082 !important;
    color: #121212;
    font-size: 1.1rem;
    font-weight: 900;
  }

  :global(.dark) .plus-avatar {
    background-color: #3B2E15 !important;
    color: #FFDE59;
  }

  .pill-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 2px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    flex-shrink: 0;
  }

  .pill-meta {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .pill-name-row {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .pill-name {
    font-size: 0.9rem;
    font-weight: 900;
    color: var(--text-main, #121212);
  }

  .pip-star-badge {
    background: #FFD54F;
    color: #0F0E17;
    border: 1px solid #000;
    border-radius: 6px;
    font-size: 0.65rem;
    font-weight: 900;
    padding: 1px 5px;
  }

  .pill-count {
    font-size: 0.72rem;
    color: var(--text-muted, #666);
    font-weight: 700;
  }

  .pill-check {
    font-weight: 900;
    color: #2E7D32;
    font-size: 1.1rem;
  }

  :global(.dark) .pill-check {
    color: #00FFA3;
  }

  /* Quick Resume Box */
  .quick-resume-box {
    background: #E8F5E9;
    border: 2.5px solid #2E7D32;
    border-radius: 14px;
    padding: 12px 16px;
    box-shadow: 3px 3px 0 #2E7D32;
  }

  :global(.dark) .quick-resume-box {
    background: #15291E;
    border-color: #00FFA3;
    box-shadow: 3px 3px 0 #00FFA3;
  }

  .resume-badge-tag {
    font-size: 0.68rem;
    font-weight: 900;
    color: #2E7D32;
    margin-bottom: 4px;
    letter-spacing: 0.04em;
  }

  :global(.dark) .resume-badge-tag {
    color: #00FFA3;
  }

  .resume-content-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .resume-num {
    font-size: 1.3rem;
    font-weight: 900;
    background: #C8E6C9;
    color: #121212;
    border: 2px solid #000;
    border-radius: 8px;
    padding: 4px 8px;
  }

  :global(.dark) .resume-num {
    background: #1F3F2E;
    color: #00FFA3;
  }

  .resume-text {
    flex: 1;
  }

  .resume-text h4 {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 900;
    color: var(--text-main, #121212);
  }

  .resume-text span {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted, #444);
  }

  .resume-play-btn {
    background: #4CAF50;
    color: #fff;
    font-weight: 900;
    font-size: 0.85rem;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
  }

  :global(.dark) .resume-play-btn {
    background: #00FFA3;
    color: #0F0E17;
  }

  /* Songs List */
  .songs-list-section {
    padding: 16px 18px;
    background: var(--card-bg, #ffffff);
    color: var(--text-main, #121212);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .search-and-count-bar {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .search-input-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    border: 2px solid #000;
    border-radius: 12px;
    padding: 6px 12px;
    background: var(--card-bg-subtle, #FAFAFA);
    color: var(--text-main, #121212);
  }

  .search-icon {
    font-size: 1rem;
    color: var(--text-muted, #666);
  }

  .song-search-input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.95rem;
    font-weight: 700;
    width: 100%;
    color: var(--text-main, #121212);
  }

  .clear-search-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 900;
    font-size: 0.9rem;
    color: var(--text-muted, #888);
  }

  .song-count-pill {
    background: #E8F5E9;
    border: 1.5px solid #2E7D32;
    color: #2E7D32;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 900;
    padding: 6px 12px;
    white-space: nowrap;
  }

  :global(.dark) .song-count-pill {
    background: #15291E;
    color: #00FFA3;
    border-color: #00FFA3;
  }

  .songs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 10px;
  }

  .song-grid-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--card-bg-subtle, #ffffff);
    color: var(--text-main, #121212);
    border: 2px solid #000;
    border-radius: 14px;
    padding: 12px 16px;
    cursor: pointer;
    text-align: left;
    box-shadow: 2.5px 2.5px 0 #000;
    transition: transform 0.12s ease, box-shadow 0.12s ease, background-color 0.15s ease;
  }

  .song-grid-card:hover {
    transform: translateY(-2px);
    box-shadow: 3.5px 3.5px 0 #000;
    background: var(--card-bg-elevated, #FAFAFA);
  }

  .song-grid-card:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }

  .song-grid-card.current {
    background: #FFF9C4;
    border-color: #E65100;
    box-shadow: 3.5px 3.5px 0 #E65100;
  }

  :global(.dark) .song-grid-card.current {
    background: #2B2618;
    border-color: #FFDE59;
    box-shadow: 3.5px 3.5px 0 #FFDE59;
  }

  .song-card-num {
    font-size: 0.95rem;
    font-weight: 900;
    background: var(--tint-purple, #EEEEEE);
    color: var(--text-main, #121212);
    border: 1.5px solid #000;
    border-radius: 7px;
    padding: 4px 7px;
    flex-shrink: 0;
  }

  :global(.dark) .song-card-num {
    background: #261638;
    color: #C084FC;
    border-color: #7C3AED;
  }

  .song-card-content {
    flex: 1;
    min-width: 0;
  }

  .song-card-title {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 900;
    color: var(--text-main, #121212);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .song-card-chapter {
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--text-muted, #666);
  }

  .song-card-action {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .song-card-star {
    font-size: 1.15rem;
  }

  .song-play-tag {
    background: #4CAF50;
    color: #fff;
    border: 1.5px solid #000;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 900;
    padding: 5px 10px;
    box-shadow: 1px 1px 0 #000;
    transition: transform 0.12s ease;
  }

  :global(.dark) .song-play-tag {
    background: #00FFA3;
    color: #0F0E17;
  }

  .song-grid-card:hover .song-play-tag {
    transform: scale(1.04);
  }

  /* Modal Backdrop & Drawer */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 16px;
  }

  .book-picker-sheet {
    background: var(--card-bg, #ffffff);
    color: var(--text-main, #121212);
    max-width: 580px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .picker-title-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .picker-title-wrap h3 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 900;
    color: var(--text-main, #121212);
  }

  .modal-close-btn {
    background: var(--card-bg-subtle, #EEEEEE);
    color: var(--text-main, #121212);
    border: 2px solid #000;
    border-radius: 8px;
    width: 32px;
    height: 32px;
    font-weight: 900;
    cursor: pointer;
  }

  :global(.dark) .modal-close-btn {
    background: #242238;
    color: #FFFFFE;
  }

  .bookshelf-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .shelf-book-card {
    display: flex;
    align-items: center;
    gap: 14px;
    background: var(--card-bg-subtle, #FFF8E1);
    color: var(--text-main, #121212);
    border: 2.5px solid #000;
    border-radius: 14px;
    padding: 12px;
    cursor: pointer;
    text-align: left;
    box-shadow: 2px 2px 0 #000;
  }

  :global(.dark) .shelf-book-card {
    background: #242238;
    color: #FFFFFE;
  }

  .shelf-book-card.active-book {
    border-color: #E65100;
    box-shadow: 3px 3px 0 #E65100;
    background: #FFF59D;
  }

  :global(.dark) .shelf-book-card.active-book {
    background: #2B2618;
    border-color: #FFDE59;
    box-shadow: 3px 3px 0 #FFDE59;
  }

  .shelf-book-cover {
    width: 54px;
    height: 70px;
    background: #FF7043;
    border: 2px solid #000;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
  }

  .shelf-icon {
    font-size: 1.5rem;
  }

  .shelf-pub {
    font-size: 0.5rem;
    font-weight: 900;
    text-transform: uppercase;
  }

  .shelf-book-details {
    flex: 1;
  }

  .shelf-book-details h4 {
    margin: 0 0 2px 0;
    font-size: 1.1rem;
    font-weight: 900;
    color: var(--text-main, #121212);
  }

  :global(.dark) .shelf-book-details h4 {
    color: #FFFFFE;
  }

  .shelf-lessons-avail {
    font-size: 0.78rem;
    color: var(--text-muted, #555);
    font-weight: 700;
  }

  .shelf-selected-tag {
    display: inline-block;
    margin-top: 4px;
    background: #4CAF50;
    color: #fff;
    font-size: 0.72rem;
    font-weight: 900;
    padding: 2px 6px;
    border-radius: 6px;
    border: 1px solid #000;
  }
</style>
