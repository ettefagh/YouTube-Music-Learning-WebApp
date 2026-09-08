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
    <h2 style="font-size: 1.5rem; margin-bottom: 8px;">Teacher Verification</h2>
    <p style="margin-bottom: 24px; color: #333;">Please verify you are a teacher to record reference tracks.</p>

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
        <p>What is {num1} &times; {num2}?</p>
        <div class="input-group">
          <input
            type="number"
            bind:value={mathAnswer}
            placeholder="Answer"
            onkeydown={(e) => e.key === 'Enter' && checkMath()}
          />
          <button onclick={checkMath}>Unlock</button>
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
    background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  .modal-content { background: white; padding: 32px 24px; border-radius: 24px; max-width: 400px; width: 90%; text-align: center; font-family: system-ui, sans-serif; border: 3px solid #000; box-shadow: 4px 4px 0 #000; }
  .tabs { display: flex; margin-bottom: 24px; background: #f0f0f0; border-radius: 12px; overflow: hidden; padding: 4px; gap: 4px; }
  .tabs button { flex: 1; padding: 12px; border: none; background: transparent; cursor: pointer; border-radius: 8px; font-weight: 500; color: #555; transition: all 0.2s; }
  .tabs button.active { background: #FFC107; font-weight: 600; color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  .hold-section, .math-section {
    margin: 20px 0;
  }
  .hold-btn { width: 100%; padding: 20px; font-size: 1.1rem; background: #2196F3; color: white; border: none; border-radius: 12px; cursor: pointer; position: relative; overflow: hidden; user-select: none; font-weight: 500; transition: transform 0.1s; } .hold-btn:active { transform: scale(0.98); }
  .progress-bar {
    position: absolute;
    top: 0; left: 0; height: 100%;
    background: rgba(0,0,0,0.2);
    transition: width 0.1s linear;
  }
  .input-group {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
  .input-group input {
    padding: 8px;
    font-size: 1rem;
    width: 80px;
    text-align: center;
  }
  .input-group button {
    padding: 8px 16px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .error {
    color: #f44336;
    margin-top: 8px;
  }
  .cancel-btn {
    margin-top: 16px;
    padding: 8px 16px;
    background: none;
    border: none;
    color: #757575;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
