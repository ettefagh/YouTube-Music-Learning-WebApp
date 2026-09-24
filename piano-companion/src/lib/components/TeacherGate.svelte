<script lang="ts">
  let { onSuccess, onCancel } = $props<{ onSuccess: () => void; onCancel: () => void }>();

  let mode = $state<'hold' | 'math'>('hold');

  // Math mode
  let num1 = $state(Math.floor(Math.random() * 8) + 2);
  let num2 = $state(Math.floor(Math.random() * 8) + 2);
  let mathAnswer = $state('');
  let mathError = $state(false);

  function checkMath() {
    if (parseInt(mathAnswer) === num1 * num2) {
      onSuccess();
    } else {
      mathError = true;
      mathAnswer = '';
    }
  }

  // Hold mode
  let holdTimer: ReturnType<typeof setTimeout> | null = null;
  let holdProgress = $state(0);
  let holdInterval: ReturnType<typeof setInterval> | null = null;

  function startHold() {
    holdProgress = 0;
    holdTimer = setTimeout(() => {
      stopHold();
      onSuccess();
    }, 3000);

    holdInterval = setInterval(() => {
      holdProgress += 100 / 30; // approx 100% in 3000ms with 100ms interval
    }, 100);
  }

  function stopHold() {
    if (holdTimer) clearTimeout(holdTimer);
    if (holdInterval) clearInterval(holdInterval);
    holdTimer = null;
    holdInterval = null;
    holdProgress = 0;
  }
</script>

<div class="modal-backdrop">
  <div class="modal-content">
    <h2 class="modal-title">Teacher Verification</h2>
    <p class="modal-desc">Please verify you are a teacher to record reference tracks.</p>

    <div class="tabs">
      <button class:active={mode === 'hold'} onclick={() => mode = 'hold'}>3-Second Hold</button>
      <button class:active={mode === 'math'} onclick={() => mode = 'math'}>Math Challenge</button>
    </div>

    {#if mode === 'hold'}
      <div class="hold-section">
        <button
          class="hold-btn"
          onmousedown={startHold}
          onmouseup={stopHold}
          onmouseleave={stopHold}
          ontouchstart={(e) => { e.preventDefault(); startHold(); }}
          ontouchend={(e) => { e.preventDefault(); stopHold(); }}
        >
          Press and Hold for 3s
          <div class="progress-bar" style="width: {holdProgress}%"></div>
        </button>
      </div>
    {:else}
      <div class="math-section">
        <p class="math-prompt">What is {num1} &times; {num2}?</p>
        <div class="input-group">
          <input
            type="number"
            class="math-input"
            bind:value={mathAnswer}
            placeholder="Answer"
            onkeydown={(e) => e.key === 'Enter' && checkMath()}
          />
          <button class="math-unlock-btn" onclick={checkMath}>Unlock</button>
        </div>
        {#if mathError}
          <p class="error">Incorrect answer, try again.</p>
        {/if}
      </div>
    {/if}

    <button class="cancel-btn" onclick={onCancel}>Cancel</button>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.55); backdrop-filter: blur(3px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
  }
  .modal-content {
    background: var(--card-bg, #ffffff);
    color: var(--text-main, #121212);
    padding: 32px 24px;
    border-radius: 24px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    font-family: system-ui, sans-serif;
    border: 3px solid var(--border-dark, #000);
    box-shadow: 4px 4px 0 var(--border-dark, #000);
  }
  .modal-title {
    font-size: 1.5rem;
    font-weight: 900;
    margin: 0 0 8px 0;
    color: var(--text-heading, #121212);
  }
  .modal-desc {
    margin: 0 0 24px 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-muted, #555);
  }
  .tabs {
    display: flex;
    margin-bottom: 24px;
    background: var(--surface-secondary, #f0f0f0);
    border: 2px solid var(--border-dark, #000);
    border-radius: 12px;
    overflow: hidden;
    padding: 4px;
    gap: 4px;
  }
  .tabs button {
    flex: 1;
    padding: 10px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.85rem;
    color: var(--text-muted, #666);
    transition: all 0.2s;
  }
  .tabs button.active {
    background: #FFD54F;
    font-weight: 900;
    color: #0F0E17;
    border: 1.5px solid #000;
    box-shadow: 1px 1px 0 #000;
  }
  .hold-section, .math-section {
    margin: 20px 0;
  }
  .math-prompt {
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--text-heading, #121212);
    margin-bottom: 12px;
  }
  .hold-btn {
    width: 100%;
    padding: 20px;
    font-size: 1.1rem;
    background: #2196F3;
    color: white;
    border: 2.5px solid #000;
    border-radius: 12px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    user-select: none;
    font-weight: 900;
    box-shadow: 3px 3px 0 #000;
    transition: transform 0.1s;
  }
  .hold-btn:active {
    transform: scale(0.98);
  }
  .progress-bar {
    position: absolute;
    top: 0; left: 0; height: 100%;
    background: rgba(0,0,0,0.25);
    transition: width 0.1s linear;
  }
  .input-group {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
  .math-input {
    padding: 10px;
    font-size: 1.1rem;
    font-weight: 800;
    width: 90px;
    text-align: center;
    background: var(--card-bg-subtle, #ffffff);
    color: var(--text-main, #121212);
    border: 2px solid var(--border-dark, #000);
    border-radius: 8px;
  }
  .math-unlock-btn {
    padding: 10px 18px;
    background: #4CAF50;
    color: white;
    font-weight: 900;
    border: 2px solid #000;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
  }
  .error {
    color: #f44336;
    font-weight: 800;
    margin-top: 8px;
  }
  .cancel-btn {
    margin-top: 16px;
    padding: 8px 16px;
    background: none;
    border: none;
    color: var(--text-muted, #757575);
    font-weight: 800;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
