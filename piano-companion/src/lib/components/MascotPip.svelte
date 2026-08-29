<script lang="ts">
  type MascotState = 'idle' | 'listening' | 'cheering';
  let { state = 'idle' as MascotState, message = 'Let’s play together!' } = $props();

  function playChimeSFX() {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3); // G5
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }

  $effect(() => {
    if (state === 'cheering') {
      playChimeSFX();
    }
  });
</script>

<div class="mascot-card">
  <div class="mascot-avatar {state}">
    <svg viewBox="0 0 100 100" class="pip-svg">
      <!-- Mascot Head -->
      <circle cx="50" cy="50" r="38" fill="#FFB74D" />
      <circle cx="38" cy="45" r="4" fill="#3E2723" />
      <circle cx="62" cy="45" r="4" fill="#3E2723" />
      <!-- Cheeks -->
      <circle cx="30" cy="54" r="5" fill="#FF8A80" opacity="0.6" />
      <circle cx="70" cy="54" r="5" fill="#FF8A80" opacity="0.6" />
      <!-- Musical Note Hat -->
      <path d="M45 15 L58 12 L58 24 L45 27 Z" fill="#673AB7" />
      {#if state === 'cheering'}
        <path d="M40 60 Q50 72 60 60" stroke="#3E2723" stroke-width="3" fill="none" stroke-linecap="round" />
      {:else if state === 'listening'}
        <ellipse cx="50" cy="60" rx="4" ry="6" fill="#3E2723" />
      {:else}
        <path d="M42 58 Q50 64 58 58" stroke="#3E2723" stroke-width="2.5" fill="none" stroke-linecap="round" />
      {/if}
    </svg>
  </div>
  <div class="mascot-bubble">
    <p>{message}</p>
  </div>
</div>

<style>
  .mascot-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    background: #FFF8E1;
    border-radius: 20px;
    border: 2px solid #FFE082;
  }
  .pip-svg {
    width: 60px;
    height: 60px;
  }
  .mascot-avatar.cheering {
    animation: bounce 0.5s infinite alternate ease-in-out;
  }
  @keyframes bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-8px) scale(1.05); }
  }
  .mascot-bubble p {
    margin: 0;
    font-weight: 600;
    color: #5D4037;
    font-size: 0.95rem;
  }
</style>
