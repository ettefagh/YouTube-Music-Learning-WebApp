<script lang="ts">
  import type { ActiveScreen } from '#lib/types/studentProfile.js';

  let {
    activeScreen,
    hasCurrentLesson,
    completedStarsCount,
    hasStudentTrack,
    onSelectScreen
  } = $props<{
    activeScreen: ActiveScreen;
    hasCurrentLesson: boolean;
    completedStarsCount: number;
    hasStudentTrack: boolean;
    onSelectScreen: (screen: ActiveScreen) => void;
  }>();

  let isVisible = $derived(['library', 'player', 'studio'].includes(activeScreen));
</script>

{#if isVisible}
  <nav class="kids-bottom-dock">
    <div class="dock-inner">
      <!-- Tab 1: Library -->
      <button
        class="dock-btn {activeScreen === 'library' ? 'active' : ''}"
        onclick={() => onSelectScreen('library')}
      >
        <span class="dock-icon">📚</span>
        <span class="dock-label">Library</span>
      </button>

      <!-- Tab 2: Practice Player -->
      <button
        class="dock-btn {activeScreen === 'player' ? 'active' : ''}"
        onclick={() => onSelectScreen('player')}
      >
        <span class="dock-icon">🎹</span>
        <span class="dock-label">Practice</span>
        {#if hasCurrentLesson}
          <span class="dock-pill-indicator"></span>
        {/if}
      </button>

      <!-- Tab 3: Combined Studio (Trophy & Audio) -->
      <button
        class="dock-btn {activeScreen === 'studio' ? 'active' : ''}"
        onclick={() => onSelectScreen('studio')}
      >
        <span class="dock-icon">⭐</span>
        <span class="dock-label">My Studio</span>
        {#if completedStarsCount > 0}
          <span class="dock-badge-stars">{completedStarsCount}⭐</span>
        {:else if hasStudentTrack}
          <span class="dock-badge-success">🎙️</span>
        {/if}
      </button>
    </div>
  </nav>
{/if}

<style>
  .kids-bottom-dock {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 72px;
    background: #ffffff;
    border-top: 3.5px solid #000000;
    box-shadow: 0 -4px 0 rgba(0, 0, 0, 0.12);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 16px;
    z-index: 1000;
  }

  .dock-inner {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    max-width: 720px;
  }

  .dock-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    background: transparent;
    border: none;
    border-radius: 14px;
    padding: 6px 20px;
    cursor: pointer;
    position: relative;
    transition: all 0.12s ease;
    min-width: 90px;
    height: 58px;
  }

  .dock-btn:active {
    transform: scale(0.94);
  }

  .dock-btn.active {
    background: #FFF9C4;
    border: 2.5px solid #000000;
    box-shadow: 2.5px 2.5px 0 #000000;
    transform: translateY(-3px);
  }

  .dock-icon {
    font-size: 1.55rem;
    line-height: 1;
  }

  .dock-label {
    font-size: 0.85rem;
    font-weight: 900;
    color: #121212;
    letter-spacing: -0.01em;
  }

  .dock-pill-indicator {
    position: absolute;
    top: 6px;
    right: 22px;
    width: 9px;
    height: 9px;
    background: #4CAF50;
    border: 1.5px solid #000000;
    border-radius: 50%;
  }

  .dock-badge-stars {
    position: absolute;
    top: 4px;
    right: 12px;
    background: #FFD54F;
    color: #121212;
    border: 1.5px solid #000000;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 900;
    padding: 1px 6px;
    box-shadow: 1px 1px 0 #000000;
  }

  .dock-badge-success {
    position: absolute;
    top: 4px;
    right: 18px;
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    .dock-btn {
      padding: 6px 12px;
      min-width: 78px;
    }
    .dock-label {
      font-size: 0.78rem;
    }
  }
</style>
