<script lang="ts">
  import { onMount } from 'svelte';

  let {
    isReady = false,
    onComplete
  } = $props<{
    isReady: boolean;
    onComplete: () => void;
  }>();

  let minTimeElapsed = $state(false);
  let isExiting = $state(false);
  let statusTextIndex = $state(0);

  const statusMessages = [
    'Warming up the piano keys... 🎹',
    'Tuning the music strings... 🎶',
    'Opening your music book... 📖',
    'Ready! Let’s make music! ✨'
  ];

  let currentStatusText = $derived(statusMessages[statusTextIndex]);

  onMount(() => {
    // Cycle playful kid status messages
    const textInterval = setInterval(() => {
      if (statusTextIndex < statusMessages.length - 1) {
        statusTextIndex++;
      }
    }, 600);

    // Ensure splash displays for at least 1.8s for a joyful kid experience
    const minTimer = setTimeout(() => {
      minTimeElapsed = true;
      checkCompletion();
    }, 1800);

    return () => {
      clearInterval(textInterval);
      clearTimeout(minTimer);
    };
  });

  $effect(() => {
    if (isReady && minTimeElapsed && !isExiting) {
      checkCompletion();
    }
  });

  function checkCompletion() {
    if (isReady && minTimeElapsed && !isExiting) {
      isExiting = true;
      setTimeout(() => {
        onComplete();
      }, 450); // wait for exit animation
    }
  }
</script>

<div class="app-splash-overlay {isExiting ? 'splash-exit' : ''}">
  <!-- Floating musical particles -->
  <div class="floating-notes-container">
    <span class="float-note note-1">♪</span>
    <span class="float-note note-2">♫</span>
    <span class="float-note note-3">⭐</span>
    <span class="float-note note-4">♬</span>
    <span class="float-note note-5">✨</span>
    <span class="float-note note-6">🎹</span>
    <span class="float-note note-7">🎵</span>
  </div>

  <div class="splash-center-content">
    <!-- Animated Bouncing App Icon -->
    <div class="bouncing-logo-wrapper">
      <svg class="splash-svg-logo" viewBox="0 0 512 512">
        <defs>
          <linearGradient id="splashYtRed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FF2430" />
            <stop offset="100%" stop-color="#D00018" />
          </linearGradient>
          <clipPath id="splashBadgeClip">
            <rect x="36" y="66" width="440" height="368" rx="96" ry="96" />
          </clipPath>
        </defs>

        <!-- Neo-brutalist Shadow -->
        <rect x="36" y="82" width="440" height="368" rx="96" ry="96" fill="#000000" />

        <!-- Main YouTube Red Badge -->
        <rect
          x="36"
          y="66"
          width="440"
          height="368"
          rx="96"
          ry="96"
          fill="url(#splashYtRed)"
          stroke="#000000"
          stroke-width="16"
        />

        <!-- Subtle Top Badge Highlight -->
        <path
          d="M 120 86 Q 256 74 392 86"
          fill="none"
          stroke="#FFFFFF"
          stroke-width="6"
          stroke-linecap="round"
          opacity="0.4"
        />

        <!-- Integrated Piano Keyboard with wave-press animation -->
        <g clip-path="url(#splashBadgeClip)">
          <rect x="36" y="276" width="440" height="170" fill="#000000" />

          <!-- White Keys with ripple wave animations -->
          <rect class="white-key k1" x="42" y="284" width="58" height="150" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="4" />
          <rect class="white-key k2" x="104" y="284" width="58" height="150" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="4" />
          <rect class="white-key k3" x="166" y="284" width="58" height="150" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="4" />
          <rect class="white-key k4" x="228" y="284" width="58" height="150" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="4" />
          <rect class="white-key k5" x="290" y="284" width="58" height="150" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="4" />
          <rect class="white-key k6" x="352" y="284" width="58" height="150" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="4" />
          <rect class="white-key k7" x="414" y="284" width="58" height="150" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="4" />

          <!-- Black Accidental Keys -->
          <rect class="black-key" x="84" y="284" width="36" height="92" rx="4" fill="#181818" stroke="#000000" stroke-width="3" />
          <rect class="black-key" x="146" y="284" width="36" height="92" rx="4" fill="#181818" stroke="#000000" stroke-width="3" />
          <rect class="black-key" x="270" y="284" width="36" height="92" rx="4" fill="#181818" stroke="#000000" stroke-width="3" />
          <rect class="black-key" x="332" y="284" width="36" height="92" rx="4" fill="#181818" stroke="#000000" stroke-width="3" />
          <rect class="black-key" x="394" y="284" width="36" height="92" rx="4" fill="#181818" stroke="#000000" stroke-width="3" />

          <rect x="36" y="276" width="440" height="10" fill="#000000" />
          <rect x="36" y="278" width="440" height="4" fill="#FFD54F" />
        </g>

        <!-- Central YouTube Play Triangle with Pulsing Glow -->
        <g class="pulsing-play-triangle">
          <path
            d="M 206 138 C 196 132 184 138 184 150 L 184 278 C 184 290 196 296 206 290 L 320 226 C 330 220 330 208 320 202 Z"
            fill="#FFFFFF"
            stroke="#000000"
            stroke-width="12"
            stroke-linejoin="round"
          />
        </g>
      </svg>
    </div>

    <!-- App Title with Kids Badge -->
    <div class="splash-brand-banner">
      <h1 class="splash-app-title">Piano Companion</h1>
      <span class="splash-kids-pill">KIDS</span>
    </div>

    <!-- Joyful Status Text -->
    <p class="splash-status-text">{currentStatusText}</p>

    <!-- Candy Striped Progress Loader -->
    <div class="candy-loader-track neo-border">
      <div class="candy-loader-bar"></div>
    </div>
  </div>
</div>

<style>
  .app-splash-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #FFFDE7;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .app-splash-overlay.splash-exit {
    opacity: 0;
    transform: scale(1.06);
    pointer-events: none;
  }

  /* Floating Kids Notes & Sparkles */
  .floating-notes-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
  }

  .float-note {
    position: absolute;
    bottom: -40px;
    font-size: 2.2rem;
    animation: floatUp 3.2s infinite ease-in;
    opacity: 0;
  }

  .note-1 { left: 12%; animation-delay: 0.1s; color: #FF7043; font-size: 2.4rem; }
  .note-2 { left: 24%; animation-delay: 0.8s; color: #42A5F5; font-size: 1.8rem; }
  .note-3 { left: 42%; animation-delay: 1.4s; color: #FFD54F; font-size: 2rem; }
  .note-4 { left: 62%; animation-delay: 0.4s; color: #AB47BC; font-size: 2.6rem; }
  .note-5 { left: 78%; animation-delay: 1.1s; color: #66BB6A; font-size: 2.2rem; }
  .note-6 { left: 88%; animation-delay: 0.6s; color: #FFA726; font-size: 1.9rem; }
  .note-7 { left: 50%; animation-delay: 1.7s; color: #EF5350; font-size: 2.3rem; }

  @keyframes floatUp {
    0% {
      transform: translateY(0) scale(0.6) rotate(0deg);
      opacity: 0;
    }
    20% {
      opacity: 0.85;
    }
    80% {
      opacity: 0.85;
    }
    100% {
      transform: translateY(-110vh) scale(1.3) rotate(45deg);
      opacity: 0;
    }
  }

  .splash-center-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    z-index: 2;
    padding: 24px;
    text-align: center;
    max-width: 440px;
    width: 90%;
  }

  /* Bouncing App Icon (Squash & Stretch YouTube Kids Style) */
  .bouncing-logo-wrapper {
    width: 150px;
    height: 150px;
    animation: ytKidsSquashBounce 1.8s infinite ease-in-out;
    filter: drop-shadow(4px 6px 0 #000000);
  }

  .splash-svg-logo {
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  @keyframes ytKidsSquashBounce {
    0%, 100% {
      transform: scale(1, 1) translateY(0) rotate(0deg);
    }
    25% {
      transform: scale(1.1, 0.9) translateY(4px) rotate(-2deg);
    }
    50% {
      transform: scale(0.92, 1.12) translateY(-24px) rotate(3deg);
    }
    75% {
      transform: scale(1.04, 0.96) translateY(2px) rotate(-1deg);
    }
  }

  /* Piano keys wave animation */
  .white-key {
    animation: keyWave 1.4s infinite ease-in-out;
    transform-origin: top;
  }
  .k1 { animation-delay: 0.0s; }
  .k2 { animation-delay: 0.15s; }
  .k3 { animation-delay: 0.3s; }
  .k4 { animation-delay: 0.45s; }
  .k5 { animation-delay: 0.6s; }
  .k6 { animation-delay: 0.75s; }
  .k7 { animation-delay: 0.9s; }

  @keyframes keyWave {
    0%, 100% { fill: #FFFFFF; }
    30% { fill: #FFF9C4; }
  }

  /* Pulsing Play Triangle */
  .pulsing-play-triangle {
    animation: playPulse 1.8s infinite ease-in-out;
    transform-origin: 256px 214px;
  }

  @keyframes playPulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.08);
    }
  }

  /* App Brand Banner */
  .splash-brand-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 6px;
  }

  .splash-app-title {
    margin: 0;
    font-size: 2rem;
    font-weight: 900;
    color: #121212;
    letter-spacing: -0.02em;
  }

  .splash-kids-pill {
    background: #FF0033;
    color: #ffffff;
    font-size: 0.9rem;
    font-weight: 900;
    padding: 3px 10px;
    border-radius: 10px;
    border: 2px solid #000000;
    box-shadow: 2px 2px 0 #000000;
  }

  /* Status Text */
  .splash-status-text {
    margin: 4px 0 10px 0;
    font-size: 1.05rem;
    font-weight: 800;
    color: #444;
    min-height: 28px;
  }

  /* Candy Striped Progress Loader */
  .candy-loader-track {
    width: 260px;
    height: 18px;
    background: #ffffff;
    border: 3px solid #000000;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    box-shadow: 3px 3px 0 #000000;
  }

  .candy-loader-bar {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      #FF5252,
      #FFD54F,
      #4CAF50,
      #42A5F5,
      #FF5252
    );
    background-size: 200% 100%;
    animation: candyFlow 1.6s linear infinite;
    border-radius: 12px;
  }

  @keyframes candyFlow {
    0% { background-position: 0% 0%; }
    100% { background-position: 200% 0%; }
  }

  @media (max-width: 480px) {
    .bouncing-logo-wrapper {
      width: 120px;
      height: 120px;
    }
    .splash-app-title {
      font-size: 1.6rem;
    }
    .splash-kids-pill {
      font-size: 0.75rem;
      padding: 2px 8px;
    }
  }
</style>
