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

<header class="kids-wayfinding-bar">
  <div class="wayfinding-left">
    <!-- Brand Logo Button -->
    <button class="brand-emblem-btn" onclick={() => onSelectScreen('splash')} title="Go to Intro Screen">
      <img src="/favicon.svg" alt="App Logo" class="brand-favicon-img" />
      <span class="kids-pill-badge">KIDS</span>
    </button>

    <!-- Archetype 3: Kid Identity Token (Tap to switch kid profile) -->
    <button
      class="identity-token-btn"
      style="background-color: {activeProfile.color}"
      onclick={() => onSelectScreen('profile')}
      title="Switch Kid ({activeProfile.name})"
    >
      <span class="token-emoji">{getAvatarEmoji(activeProfile.avatarKey)}</span>
      <span class="token-name">{activeProfile.name}</span>
    </button>

    <!-- Zero-Border Typography Breadcrumbs -->
    {#if ['library', 'player', 'studio'].includes(activeScreen)}
      <nav class="breadcrumb-trail" aria-label="Breadcrumb trail">
        <span class="crumb-separator">›</span>
        <button
          class="crumb-link {activeScreen === 'library' ? 'current' : ''}"
          onclick={() => onSelectScreen('library')}
          title="Go to Library"
        >
          <span class="crumb-icon">📖</span>
          <span class="crumb-label">{currentBook?.title ?? 'Library'}</span>
        </button>

        {#if currentLesson}
          <span class="crumb-separator">›</span>
          <button
            class="crumb-link crumb-song-focus {activeScreen === 'player' ? 'current' : ''}"
            onclick={() => onSelectScreen('player')}
            title="Active Song"
          >
            <span class="crumb-icon">🎵</span>
            <span class="crumb-label">#{currentLesson.sequenceIndex} {currentLesson.title}</span>
          </button>
        {/if}
      </nav>
    {/if}
  </div>

  <!-- Parent / Grown-Ups Trigger (Right) -->
  <div class="wayfinding-right">
    <button class="discrete-gear-btn" onclick={onOpenParentGate} title="Settings & Grown-Ups">
      <span class="gear-icon">⚙️</span>
      <span class="gear-label">Grown-Ups</span>
    </button>
  </div>
</header>

<style>
  .kids-wayfinding-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 6px 10px;
    background: transparent;
    margin-bottom: 8px;
    user-select: none;
    transition: opacity 0.35s ease, transform 0.35s ease;
  }

  .wayfinding-left {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .wayfinding-left::-webkit-scrollbar {
    display: none;
  }

  .brand-emblem-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 2px 4px;
    flex-shrink: 0;
  }

  .brand-favicon-img {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    filter: drop-shadow(2px 2px 0 #000);
  }

  .kids-pill-badge {
    background: var(--brand-red, #FF3366);
    color: #ffffff;
    font-size: 0.62rem;
    font-weight: 900;
    padding: 2px 6px;
    border-radius: 6px;
    border: 1.5px solid #000;
    box-shadow: 1px 1px 0 #000;
  }

  /* Archetype 3: Identity Token Pill */
  .identity-token-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 2px solid #000;
    border-radius: var(--radius-capsule, 9999px);
    padding: 3px 10px 3px 3px;
    box-shadow: 2px 2px 0 #000;
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
    flex-shrink: 0;
  }

  .identity-token-btn:hover {
    transform: translateY(-1px);
    box-shadow: 2.5px 2.5px 0 #000;
  }

  .identity-token-btn:active {
    transform: translate(1px, 1px);
    box-shadow: 0.5px 0.5px 0 #000;
  }

  .token-emoji {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1.5px solid #000;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.05rem;
  }

  .token-name {
    font-size: 0.85rem;
    font-weight: 900;
    color: #0F0E17;
  }

  /* Zero-Border Typography Breadcrumb Trail */
  .breadcrumb-trail {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.92rem;
    flex-shrink: 0;
  }

  .crumb-separator {
    color: #A7A9BE;
    font-weight: 900;
    font-size: 1.1rem;
    user-select: none;
  }

  .crumb-link {
    background: transparent;
    border: none;
    color: var(--text-muted, #5F5E6B);
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 6px;
    border-radius: 6px;
    transition: color 0.15s ease, background-color 0.15s ease;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .crumb-link:hover {
    color: var(--text-main, #0F0E17);
    background: rgba(0, 0, 0, 0.05);
  }

  .crumb-link.current,
  .crumb-song-focus {
    color: var(--text-main, #0F0E17);
    font-weight: 900;
    font-size: 0.95rem;
  }

  .crumb-song-focus .crumb-label {
    color: var(--brand-red, #FF3366);
  }

  /* Grown-Ups Action (Right) */
  .wayfinding-right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .discrete-gear-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    background: var(--card-bg, #ffffff);
    border: 2px solid #000;
    border-radius: 12px;
    padding: 5px 10px;
    font-size: 0.78rem;
    font-weight: 900;
    color: var(--text-main, #0F0E17);
    box-shadow: 2px 2px 0 #000;
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .discrete-gear-btn:hover {
    background: var(--tint-yellow, #FFF8E1);
  }

  .discrete-gear-btn:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }

  .gear-icon {
    font-size: 0.95rem;
  }

  @media (max-width: 680px) {
    .gear-label {
      display: none;
    }
    .crumb-link {
      max-width: 120px;
    }
  }
</style>
