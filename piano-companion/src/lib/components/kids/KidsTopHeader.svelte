<script lang="ts">
  import type { StudentProfile, ActiveScreen } from '#lib/types/studentProfile.js';
  import { getAvatarEmoji } from '#lib/types/studentProfile.js';
  import type { LocalBook, LocalLesson } from '#lib/db/db.js';

  let {
    activeProfile,
    currentBook,
    selectedProvider,
    currentLesson,
    activeScreen,
    onSelectScreen,
    onOpenParentGate
  } = $props<{
    activeProfile: StudentProfile;
    currentBook: LocalBook | null;
    selectedProvider: string;
    currentLesson: LocalLesson | null;
    activeScreen: ActiveScreen;
    onSelectScreen: (screen: ActiveScreen) => void;
    onOpenParentGate: () => void;
  }>();
</script>

<header class="kids-top-header">
  <button class="kids-brand-btn" onclick={() => onSelectScreen('splash')} title="Go to Intro Screen">
    <img src="/favicon.svg" alt="App Logo" class="brand-favicon-img" />
    <div class="brand-text-col">
      <span class="brand-title">Piano Companion</span>
      <span class="kids-pill-badge">KIDS</span>
    </div>
  </button>

  <!-- Active Profile Chip (Tap to open full-page Profile Hub) -->
  <button
    class="active-profile-chip"
    onclick={() => onSelectScreen('profile')}
    title="Switch Kid Profile"
  >
    <div class="avatar-bubble" style="background-color: {activeProfile.color}">
      <span class="avatar-emoji">{getAvatarEmoji(activeProfile.avatarKey)}</span>
    </div>
    <div class="profile-info-col">
      <span class="profile-name">{activeProfile.name}</span>
      <span class="profile-switch-tag">Switch 🔄</span>
    </div>
  </button>

  <!-- Parent / Teacher Zone Trigger (Gated) -->
  <div class="top-bar-right">
    <button class="top-gear-btn" onclick={onOpenParentGate} title="Settings & Grown-Ups Mode">
      <span class="gear-icon">⚙️</span>
      <span class="gear-label">Grown-Ups</span>
    </button>
  </div>
</header>

<!-- Interactive Breadcrumbs Strip (Visible in Library, Practice, and Studio) -->
{#if ['library', 'player', 'studio'].includes(activeScreen)}
  <nav class="kids-breadcrumbs-bar neo-card">
    <button class="crumb-chip crumb-profile" onclick={() => onSelectScreen('profile')} title="Switch Kid Profile">
      <span class="crumb-avatar" style="background-color: {activeProfile.color}">
        {getAvatarEmoji(activeProfile.avatarKey)}
      </span>
      <span class="crumb-text">{activeProfile.name}</span>
    </button>

    <span class="crumb-arrow">›</span>

    <button
      class="crumb-chip crumb-book {activeScreen === 'library' ? 'current' : ''}"
      onclick={() => onSelectScreen('library')}
      title="Change Book or Song"
    >
      <span class="crumb-icon">📖</span>
      <span class="crumb-text">{currentBook?.title ?? 'Library'}</span>
    </button>

    {#if selectedProvider}
      <span class="crumb-arrow">›</span>
      <button
        class="crumb-chip crumb-teacher"
        onclick={() => onSelectScreen('library')}
        title="Teacher Filter"
      >
        <span class="crumb-icon">📺</span>
        <span class="crumb-text">{selectedProvider.replace(/\s*\(.*?\)/, '')}</span>
      </button>
    {/if}

    {#if currentLesson}
      <span class="crumb-arrow">›</span>
      <button
        class="crumb-chip crumb-song {activeScreen === 'player' ? 'current' : ''}"
        onclick={() => onSelectScreen('player')}
        title="Active Song"
      >
        <span class="crumb-icon">🎵</span>
        <span class="crumb-text">#{currentLesson.sequenceIndex} {currentLesson.title}</span>
      </button>
    {/if}
  </nav>
{/if}

<style>
  .kids-top-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    background: #ffffff;
    border: 3px solid #000000;
    border-radius: 16px;
    box-shadow: 4px 4px 0 #000000;
    margin-bottom: 8px;
  }

  .kids-brand-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    text-align: left;
  }

  .brand-favicon-img {
    width: 38px;
    height: 38px;
    border-radius: 8px;
    filter: drop-shadow(2px 2px 0 #000);
  }

  .brand-text-col {
    display: flex;
    flex-direction: column;
  }

  .brand-title {
    font-size: 1.15rem;
    font-weight: 900;
    color: #121212;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }

  .kids-pill-badge {
    display: inline-block;
    background: #FF0033;
    color: #ffffff;
    font-size: 0.65rem;
    font-weight: 900;
    padding: 1px 6px;
    border-radius: 6px;
    border: 1px solid #000;
    width: fit-content;
    margin-top: 2px;
  }

  .active-profile-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #FFF9C4;
    border: 2px solid #000;
    border-radius: 24px;
    padding: 4px 12px 4px 4px;
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
    border: 2px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar-emoji {
    font-size: 1.2rem;
  }

  .profile-info-col {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .profile-name {
    font-size: 0.85rem;
    font-weight: 900;
    color: #121212;
    line-height: 1.1;
  }

  .profile-switch-tag {
    font-size: 0.62rem;
    font-weight: 800;
    color: #666;
  }

  .top-bar-right {
    display: flex;
    align-items: center;
  }

  .top-gear-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #F5F5F5;
    border: 2px solid #000;
    border-radius: 12px;
    padding: 6px 10px;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
    transition: transform 0.1s ease;
  }

  .top-gear-btn:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }

  .gear-icon {
    font-size: 1rem;
  }

  .gear-label {
    font-size: 0.75rem;
    color: #333;
  }

  /* Interactive Top Breadcrumbs */
  .kids-breadcrumbs-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: #ffffff;
    border: 2.5px solid #000;
    border-radius: 12px;
    box-shadow: 3px 3px 0 #000;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 12px;
  }

  .crumb-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #FAFAFA;
    border: 2px solid #000;
    border-radius: 9px;
    padding: 4px 11px;
    font-size: 0.82rem;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
    transition: transform 0.12s ease, box-shadow 0.12s ease, background-color 0.15s ease;
    flex-shrink: 0;
  }

  .crumb-chip:hover {
    transform: translateY(-1px);
    box-shadow: 2.5px 2.5px 0 #000;
  }

  .crumb-chip:active {
    transform: translate(1px, 1px);
    box-shadow: 0.5px 0.5px 0 #000;
  }

  .crumb-chip.crumb-profile {
    background: #FFF9C4;
  }

  .crumb-chip.crumb-book {
    background: #FFE0B2;
  }
  .crumb-chip.crumb-book .crumb-text {
    color: #BF360C;
  }

  .crumb-chip.crumb-teacher {
    background: #E8F5E9;
  }
  .crumb-chip.crumb-teacher .crumb-text {
    color: #1B5E20;
  }

  .crumb-chip.crumb-song {
    background: #E1F5FE;
  }
  .crumb-chip.crumb-song .crumb-text {
    color: #0D47A1;
  }

  .crumb-chip.current {
    box-shadow: 3px 3px 0 #000;
    border-color: #E65100;
    outline: 2px solid #FF9800;
    outline-offset: 1px;
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

  @media (max-width: 600px) {
    .gear-label {
      display: none;
    }
    .brand-title {
      font-size: 1rem;
    }
  }
</style>
