<script lang="ts">
  import type { LocalLesson, LocalAudioTrack } from '#lib/db/db.js';
  import type { ActiveScreen } from '#lib/types/studentProfile.js';
  import MascotPip from '#lib/components/MascotPip.svelte';

  let {
    currentLesson,
    completedCheckpoints,
    isEditingCheckpoints,
    editCheckpointsText = $bindable(''),
    studentRecorder,
    teacherRecorder,
    studentTrack,
    teacherTrack,
    studentAudioUrl = null,
    teacherAudioUrl = null,
    teacherAuth,
    mascotState,
    mascotMessage,
    onToggleCheckpoint,
    onEditCheckpoints,
    onSaveCheckpoints,
    onCancelEditCheckpoints,
    onStudentRecord,
    onTeacherRecord,
    onDeleteStudentTrack,
    onDeleteTeacherTrack,
    onSelectScreen
  } = $props<{
    currentLesson: LocalLesson | null;
    completedCheckpoints: Record<string, boolean>;
    isEditingCheckpoints: boolean;
    editCheckpointsText: string;
    studentRecorder: { isRecording: boolean; recordingSeconds: number; volumeLevel: number };
    teacherRecorder: { isRecording: boolean; recordingSeconds: number; volumeLevel: number };
    studentTrack: LocalAudioTrack | null;
    teacherTrack: LocalAudioTrack | null;
    studentAudioUrl?: string | null;
    teacherAudioUrl?: string | null;
    teacherAuth: { isUnlocked: boolean };
    mascotState: 'idle' | 'listening' | 'cheering' | 'sleeping';
    mascotMessage: string;
    onToggleCheckpoint: (key: string) => void;
    onEditCheckpoints: () => void;
    onSaveCheckpoints: () => void;
    onCancelEditCheckpoints: () => void;
    onStudentRecord: () => void;
    onTeacherRecord: () => void;
    onDeleteStudentTrack: () => void;
    onDeleteTeacherTrack: () => void;
    onSelectScreen: (screen: ActiveScreen) => void;
  }>();

  let studentAudioEl = $state<HTMLAudioElement | null>(null);
  let teacherAudioEl = $state<HTMLAudioElement | null>(null);

  function formatTime(seconds: number) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  let completedCount = $derived(
    currentLesson
      ? Object.keys(completedCheckpoints).filter(k => k.startsWith(currentLesson.id) && completedCheckpoints[k]).length
      : 0
  );

  let totalCount = $derived(currentLesson ? currentLesson.checkpoints.length : 0);
  let isMastered = $derived(totalCount > 0 && completedCount === totalCount);
</script>

<div class="screen-studio-combined">
  {#if !currentLesson}
    <div class="no-lesson-box neo-card">
      <span class="empty-icon">🎵</span>
      <h3>No Song Selected</h3>
      <p>Pick a song from the library to record your playing and collect practice stars!</p>
      <button class="primary-btn neo-btn" onclick={() => onSelectScreen('library')}>
        📚 Open Song Library
      </button>
    </div>
  {:else}
    <!-- Song Header Banner -->
    <section class="song-target-strip neo-card">
      <div class="target-left">
        <span class="target-badge">PRACTICE STUDIO FOR</span>
        <h2 class="target-song-title">#{currentLesson.sequenceIndex} {currentLesson.title}</h2>
      </div>
      <div class="target-right">
        <button class="switch-to-player-btn neo-btn" onclick={() => onSelectScreen('player')}>
          🎹 Practice Video ▶
        </button>
      </div>
    </section>

    <!-- Part 1: Star Trophy Room & Learning Goals -->
    <section class="trophy-room-card neo-card">
      <div class="trophy-header-row">
        <div class="title-with-badge">
          <span class="room-icon">⭐</span>
          <div>
            <h3 class="room-title">Learning Goals & Star Checkpoints</h3>
            <span class="room-subtitle">Tap each star when you master that skill!</span>
          </div>
        </div>

        <div class="stars-counter-badge {isMastered ? 'mastered' : ''}">
          <span>{completedCount} / {totalCount} Stars</span>
          {#if isMastered}
            <span class="sparkle-tag">🎉 Mastered!</span>
          {/if}
        </div>
      </div>

      {#if isEditingCheckpoints}
        <div class="edit-checkpoints-panel">
          <p class="edit-hint">Enter one practice checkpoint per line:</p>
          <textarea
            class="checkpoints-textarea"
            rows="5"
            bind:value={editCheckpointsText}
          ></textarea>
          <div class="edit-actions-row">
            <button class="save-btn neo-btn" onclick={onSaveCheckpoints}>Save Goals</button>
            <button class="cancel-btn" onclick={onCancelEditCheckpoints}>Cancel</button>
          </div>
        </div>
      {:else}
        <div class="checkpoints-list">
          {#if currentLesson.checkpoints.length === 0}
            <p class="no-goals-hint">No specific goals set yet for this piece. You can add them via Teacher Edit!</p>
          {:else}
            {#each currentLesson.checkpoints as cp, index}
              {@const key = `${currentLesson.id}_cp_${index}`}
              {@const isChecked = !!completedCheckpoints[key]}
              <button
                class="checkpoint-item {isChecked ? 'checked' : ''}"
                onclick={() => onToggleCheckpoint(key)}
              >
                <div class="star-bubble {isChecked ? 'lit' : ''}">
                  {isChecked ? '⭐' : '○'}
                </div>
                <span class="checkpoint-label">{cp}</span>
                {#if isChecked}
                  <span class="done-tag">Done!</span>
                {/if}
              </button>
            {/each}
          {/if}
        </div>

        <div class="goals-footer-row">
          <button class="teacher-edit-goals-btn" onclick={onEditCheckpoints}>
            {teacherAuth.isUnlocked ? '✏️ Edit Goals' : '🔒 Teacher Edit Goals'}
          </button>
        </div>
      {/if}
    </section>

    <!-- Part 2: Audio Recording & Comparison Booth -->
    <section class="audio-booth-card neo-card">
      <div class="booth-header-row">
        <div class="title-with-badge">
          <span class="room-icon">🎙️</span>
          <div>
            <h3 class="room-title">Audio Recording Booth</h3>
            <span class="room-subtitle">Record yourself playing and compare with teacher reference</span>
          </div>
        </div>
      </div>

      <div class="booth-split-grid">
        <!-- Student Track -->
        <div class="booth-track-card student-booth">
          <div class="track-card-header">
            <span class="track-badge student">🦁 Student Take</span>
            {#if studentTrack}
              <span class="recorded-tag">✓ Recorded</span>
            {/if}
          </div>

          <div class="track-action-area">
            {#if studentRecorder.isRecording}
              <button class="record-trigger-btn stop-rec" onclick={onStudentRecord}>
                ⏹ Stop Recording ({formatTime(studentRecorder.recordingSeconds)})
              </button>
              <div class="vu-meter-bar">
                <div class="vu-fill student" style="width: {studentRecorder.volumeLevel * 100}%"></div>
              </div>
            {:else}
              <button class="record-trigger-btn start-rec" onclick={onStudentRecord}>
                🔴 Record My Take
              </button>
            {/if}

            {#if studentTrack && studentAudioUrl}
              <div class="playback-controls">
                <audio
                  bind:this={studentAudioEl}
                  src={studentAudioUrl}
                  controls
                  class="audio-player"
                ></audio>
                <button class="delete-track-btn" onclick={onDeleteStudentTrack} title="Delete take">
                  🗑️
                </button>
              </div>
            {/if}
          </div>
        </div>

        <!-- Teacher Reference Track -->
        <div class="booth-track-card teacher-booth">
          <div class="track-card-header">
            <span class="track-badge teacher">👩‍🏫 Teacher Reference</span>
            {#if teacherTrack}
              <span class="recorded-tag">✓ Ready</span>
            {/if}
          </div>

          <div class="track-action-area">
            {#if teacherRecorder.isRecording}
              <button class="record-trigger-btn stop-rec teacher" onclick={onTeacherRecord}>
                ⏹ Stop Teacher Recording ({formatTime(teacherRecorder.recordingSeconds)})
              </button>
              <div class="vu-meter-bar">
                <div class="vu-fill teacher" style="width: {teacherRecorder.volumeLevel * 100}%"></div>
              </div>
            {:else}
              <button class="record-trigger-btn teacher-rec" onclick={onTeacherRecord}>
                {teacherAuth.isUnlocked ? '🎙️ Record Teacher Demo' : '🔒 Teacher Unlock'}
              </button>
            {/if}

            {#if teacherTrack && teacherAudioUrl}
              <div class="playback-controls">
                <audio
                  bind:this={teacherAudioEl}
                  src={teacherAudioUrl}
                  controls
                  class="audio-player"
                ></audio>
                <button class="delete-track-btn" onclick={onDeleteTeacherTrack} title="Delete teacher take">
                  🗑️
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </section>

    <!-- Pip Cheer Banner -->
    <MascotPip state={mascotState} message={mascotMessage} />
  {/if}
</div>

<style>
  .screen-studio-combined {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 84px;
  }

  .no-lesson-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 36px 20px;
    gap: 12px;
    background: #ffffff;
    border-radius: 18px;
  }

  .empty-icon {
    font-size: 2.8rem;
  }

  /* Song Target Strip */
  .song-target-strip {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px;
    background: #FFF9C4;
    border-radius: 16px;
    gap: 12px;
    flex-wrap: wrap;
  }

  .target-badge {
    font-size: 0.68rem;
    font-weight: 900;
    color: #E65100;
    letter-spacing: 0.04em;
  }

  .target-song-title {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 900;
    color: #121212;
  }

  .switch-to-player-btn {
    background: #4CAF50;
    color: #fff;
    font-size: 0.95rem;
    font-weight: 900;
    padding: 10px 18px;
    border-radius: 12px;
    cursor: pointer;
  }

  /* Trophy Room */
  .trophy-room-card {
    padding: 20px;
    background: #ffffff;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .trophy-header-row, .booth-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .title-with-badge {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .room-icon {
    font-size: 1.8rem;
  }

  .room-title {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 900;
    color: #121212;
  }

  .room-subtitle {
    font-size: 0.8rem;
    color: #555;
    font-weight: 700;
  }

  .stars-counter-badge {
    background: #FFF9C4;
    border: 2px solid #000;
    border-radius: 12px;
    padding: 6px 14px;
    font-weight: 900;
    font-size: 0.95rem;
    box-shadow: 2px 2px 0 #000;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .stars-counter-badge.mastered {
    background: #C8E6C9;
    border-color: #2E7D32;
    color: #2E7D32;
  }

  .sparkle-tag {
    font-size: 0.8rem;
    font-weight: 900;
  }

  .checkpoints-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .checkpoint-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #FAFAFA;
    border: 2px solid #000;
    border-radius: 12px;
    padding: 10px 14px;
    cursor: pointer;
    text-align: left;
    box-shadow: 2px 2px 0 #000;
    transition: all 0.12s ease;
  }

  .checkpoint-item:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }

  .checkpoint-item.checked {
    background: #E8F5E9;
    border-color: #2E7D32;
  }

  .star-bubble {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 2px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    background: #ffffff;
    flex-shrink: 0;
  }

  .star-bubble.lit {
    background: #FFD54F;
    color: #E65100;
  }

  .checkpoint-label {
    flex: 1;
    font-size: 0.95rem;
    font-weight: 800;
    color: #121212;
  }

  .done-tag {
    background: #4CAF50;
    color: #fff;
    border-radius: 6px;
    font-size: 0.72rem;
    font-weight: 900;
    padding: 2px 6px;
    border: 1px solid #000;
  }

  .goals-footer-row {
    display: flex;
    justify-content: flex-end;
    margin-top: 4px;
  }

  .teacher-edit-goals-btn {
    background: none;
    border: none;
    font-size: 0.8rem;
    font-weight: 800;
    color: #555;
    cursor: pointer;
    text-decoration: underline;
  }

  .edit-checkpoints-panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .checkpoints-textarea {
    border: 2px solid #000;
    border-radius: 10px;
    padding: 10px;
    font-family: inherit;
    font-size: 0.95rem;
    outline: none;
  }

  .edit-actions-row {
    display: flex;
    gap: 10px;
  }

  .save-btn {
    background: #4CAF50;
    color: #fff;
    font-weight: 900;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
  }

  .cancel-btn {
    background: #eee;
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 800;
    padding: 8px 14px;
    cursor: pointer;
  }

  /* Audio Booth */
  .audio-booth-card {
    padding: 20px;
    background: #ffffff;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .booth-split-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 14px;
  }

  .booth-track-card {
    border: 2.5px solid #000;
    border-radius: 14px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: #FAFAFA;
    box-shadow: 3px 3px 0 #000;
  }

  .booth-track-card.student-booth {
    border-color: #000;
    background: #FFFDE7;
  }

  .booth-track-card.teacher-booth {
    border-color: #000;
    background: #EDE7F6;
  }

  .track-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .track-badge {
    font-weight: 900;
    font-size: 0.85rem;
    padding: 3px 8px;
    border-radius: 6px;
    border: 1.5px solid #000;
  }

  .track-badge.student {
    background: #FFF9C4;
  }

  .track-badge.teacher {
    background: #D1C4E9;
  }

  .recorded-tag {
    font-size: 0.72rem;
    font-weight: 800;
    color: #2E7D32;
  }

  .track-action-area {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .record-trigger-btn {
    padding: 12px 16px;
    border-radius: 10px;
    font-weight: 900;
    font-size: 0.95rem;
    border: 2px solid #000;
    cursor: pointer;
    box-shadow: 2px 2px 0 #000;
    transition: transform 0.1s ease;
  }

  .record-trigger-btn:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }

  .record-trigger-btn.start-rec {
    background: #FF5252;
    color: #ffffff;
  }

  .record-trigger-btn.stop-rec {
    background: #D32F2F;
    color: #ffffff;
    animation: pulseRed 1.5s infinite;
  }

  .record-trigger-btn.teacher-rec {
    background: #7E57C2;
    color: #ffffff;
  }

  @keyframes pulseRed {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.75; }
  }

  .vu-meter-bar {
    width: 100%;
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    border: 1px solid #000;
    overflow: hidden;
  }

  .vu-fill {
    height: 100%;
    transition: width 0.05s ease-out;
  }

  .vu-fill.student {
    background: #4CAF50;
  }

  .vu-fill.teacher {
    background: #7E57C2;
  }

  .playback-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .audio-player {
    flex: 1;
    height: 38px;
  }

  .delete-track-btn {
    background: #F5F5F5;
    border: 1.5px solid #000;
    border-radius: 8px;
    width: 36px;
    height: 36px;
    cursor: pointer;
  }
</style>
