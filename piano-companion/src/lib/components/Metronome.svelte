<script lang="ts">
  import { onDestroy } from 'svelte';

  let isPlaying = $state(false);
  let bpm = $state(90);
  let beatsPerMeasure = $state(4);
  let currentBeat = $state(0);
  let isExpanded = $state(false);

  let audioCtx: AudioContext | null = null;
  let nextNoteTime = 0.0;
  let timerWorkerId: ReturnType<typeof setInterval> | null = null;
  const lookahead = 25.0; // ms
  const scheduleAheadTime = 0.1; // seconds

  // Tap tempo tracking
  let tapTimes: number[] = [];

  function scheduleNote(beatNumber: number, time: number) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    const isFirstBeat = beatNumber === 0;
    osc.frequency.setValueAtTime(isFirstBeat ? 1200 : 800, time);

    gain.gain.setValueAtTime(isFirstBeat ? 0.35 : 0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.06);

    // Schedule UI update
    const drawTime = Math.max(0, (time - audioCtx.currentTime) * 1000);
    setTimeout(() => {
      if (isPlaying) {
        currentBeat = beatNumber;
      }
    }, drawTime);
  }

  function nextNote() {
    const secondsPerBeat = 60.0 / bpm;
    nextNoteTime += secondsPerBeat;
    currentBeat = (currentBeat + 1) % beatsPerMeasure;
  }

  function scheduler() {
    if (!audioCtx) return;
    while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
      scheduleNote(currentBeat, nextNoteTime);
      nextNote();
    }
  }

  function toggleMetronome() {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  }

  function startMetronome() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    isPlaying = true;
    currentBeat = 0;
    nextNoteTime = audioCtx.currentTime + 0.05;

    timerWorkerId = setInterval(scheduler, lookahead);
  }

  function stopMetronome() {
    isPlaying = false;
    currentBeat = 0;
    if (timerWorkerId) {
      clearInterval(timerWorkerId);
      timerWorkerId = null;
    }
  }

  function adjustBpm(delta: number) {
    bpm = Math.min(220, Math.max(30, bpm + delta));
  }

  function handleTap() {
    const now = performance.now();
    tapTimes.push(now);

    // Filter taps older than 2.5 seconds
    tapTimes = tapTimes.filter(t => now - t < 2500);

    if (tapTimes.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < tapTimes.length; i++) {
        intervals.push(tapTimes[i] - tapTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      if (avgInterval > 0) {
        const calculatedBpm = Math.round(60000 / avgInterval);
        bpm = Math.min(220, Math.max(40, calculatedBpm));
      }
    }
  }

  function getTempoLabel(bpmVal: number) {
    if (bpmVal < 60) return 'Largo (Broad)';
    if (bpmVal < 76) return 'Adagio (Slow)';
    if (bpmVal < 108) return 'Andante (Walking)';
    if (bpmVal < 120) return 'Moderato (Medium)';
    if (bpmVal < 168) return 'Allegro (Fast)';
    return 'Presto (Very Fast)';
  }

  onDestroy(() => {
    stopMetronome();
    if (audioCtx) {
      audioCtx.close();
    }
  });
</script>

<div class="metronome-card neo-card">
  <div class="metronome-header">
    <div class="left-group">
      <span class="metronome-icon">⏱️</span>
      <span class="title">Practice Metronome</span>
      <span class="tempo-tag">{getTempoLabel(bpm)}</span>
    </div>
    <div class="right-group">
      <button
        class="neo-btn-pill {isPlaying ? 'running' : 'primary'}"
        onclick={toggleMetronome}
      >
        {isPlaying ? '⏹ Stop' : '▶ Start'}
      </button>
      <button
        class="toggle-expand-btn"
        onclick={() => isExpanded = !isExpanded}
        aria-label="Toggle metronome details"
      >
        {isExpanded ? '▲ Less' : '▼ More'}
      </button>
    </div>
  </div>

  <!-- Beat Indicator Visualizer -->
  <div class="beat-indicators">
    {#each Array(beatsPerMeasure) as _, i}
      <div
        class="beat-dot"
        class:active={isPlaying && currentBeat === i}
        class:accent={i === 0}
      >
        {i + 1}
      </div>
    {/each}
  </div>

  <div class="bpm-control-row">
    <button class="step-btn" onclick={() => adjustBpm(-5)}>-5</button>
    <button class="step-btn" onclick={() => adjustBpm(-1)}>-1</button>

    <div class="bpm-display">
      <span class="bpm-number">{bpm}</span>
      <span class="bpm-unit">BPM</span>
    </div>

    <button class="step-btn" onclick={() => adjustBpm(1)}>+1</button>
    <button class="step-btn" onclick={() => adjustBpm(5)}>+5</button>

    <button class="tap-btn" onclick={handleTap} title="Tap rhythm to set tempo">
      👆 Tap
    </button>
  </div>

  <input
    type="range"
    min="40"
    max="208"
    bind:value={bpm}
    class="neo-slider"
  />

  {#if isExpanded}
    <div class="expanded-controls">
      <div class="control-subgroup">
        <span class="sub-label">Time Signature:</span>
        <div class="preset-buttons">
          {#each [2, 3, 4, 6] as beats}
            <button
              class="preset-btn {beatsPerMeasure === beats ? 'active' : ''}"
              onclick={() => beatsPerMeasure = beats}
            >
              {beats}/4
            </button>
          {/each}
        </div>
      </div>

      <div class="control-subgroup">
        <span class="sub-label">Tempo Presets:</span>
        <div class="preset-buttons">
          <button class="preset-btn {bpm === 60 ? 'active' : ''}" onclick={() => bpm = 60}>60</button>
          <button class="preset-btn {bpm === 80 ? 'active' : ''}" onclick={() => bpm = 80}>80</button>
          <button class="preset-btn {bpm === 100 ? 'active' : ''}" onclick={() => bpm = 100}>100</button>
          <button class="preset-btn {bpm === 120 ? 'active' : ''}" onclick={() => bpm = 120}>120</button>
          <button class="preset-btn {bpm === 144 ? 'active' : ''}" onclick={() => bpm = 144}>144</button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .metronome-card {
    background: #FFFDE7;
    border: 3px solid #000;
    border-radius: 12px;
    box-shadow: 4px 4px 0 #000;
    padding: 12px 16px;
    margin-bottom: 20px;
  }

  .metronome-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .left-group {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .metronome-icon {
    font-size: 1.3rem;
  }

  .title {
    font-weight: 800;
    font-size: 1rem;
    color: #000;
  }

  .tempo-tag {
    font-size: 0.8rem;
    font-weight: 700;
    background: #FFE082;
    border: 2px solid #000;
    border-radius: 6px;
    padding: 2px 8px;
  }

  .right-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .neo-btn-pill {
    border: 2px solid #000;
    border-radius: 20px;
    font-weight: 800;
    padding: 6px 16px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
    font-size: 0.9rem;
    transition: transform 0.1s, box-shadow 0.1s;
  }

  .neo-btn-pill:active {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 #000;
  }

  .neo-btn-pill.primary {
    background: #4CAF50;
    color: #fff;
  }

  .neo-btn-pill.running {
    background: #FF5252;
    color: #fff;
    animation: pulse 1s infinite;
  }

  .toggle-expand-btn {
    background: none;
    border: 2px solid #000;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 4px 8px;
    cursor: pointer;
    background: #fff;
  }

  .beat-indicators {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 12px 0;
  }

  .beat-dot {
    width: 32px;
    height: 32px;
    border: 2px solid #000;
    border-radius: 50%;
    background: #FFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.85rem;
    transition: transform 0.08s, background 0.08s;
  }

  .beat-dot.accent {
    border-width: 3px;
  }

  .beat-dot.active {
    background: #FF9800;
    color: #fff;
    transform: scale(1.25);
    box-shadow: 0 0 8px #FF9800;
  }

  .beat-dot.accent.active {
    background: #E91E63;
    color: #fff;
    transform: scale(1.35);
    box-shadow: 0 0 10px #E91E63;
  }

  .bpm-control-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .step-btn {
    border: 2px solid #000;
    background: #fff;
    border-radius: 6px;
    font-weight: 800;
    font-size: 0.85rem;
    padding: 6px 10px;
    cursor: pointer;
    box-shadow: 1px 1px 0 #000;
  }

  .step-btn:active {
    transform: translate(1px, 1px);
    box-shadow: 0 0 0 #000;
  }

  .tap-btn {
    border: 2px solid #000;
    background: #E1BEE7;
    border-radius: 8px;
    font-weight: 800;
    font-size: 0.85rem;
    padding: 6px 12px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
    margin-left: 6px;
  }

  .tap-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 #000;
  }

  .bpm-display {
    min-width: 90px;
    text-align: center;
  }

  .bpm-number {
    font-size: 1.8rem;
    font-weight: 900;
    color: #000;
  }

  .bpm-unit {
    font-size: 0.75rem;
    font-weight: 700;
    color: #666;
    margin-left: 2px;
  }

  .neo-slider {
    width: 100%;
    accent-color: #FF9800;
    cursor: pointer;
    margin-top: 4px;
  }

  .expanded-controls {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 2px dashed #000;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .control-subgroup {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .sub-label {
    font-size: 0.8rem;
    font-weight: 700;
    min-width: 110px;
    color: #333;
  }

  .preset-buttons {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .preset-btn {
    border: 2px solid #000;
    background: #fff;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 700;
    padding: 3px 8px;
    cursor: pointer;
  }

  .preset-btn.active {
    background: #FFD54F;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(0.96); }
    100% { transform: scale(1); }
  }
</style>
