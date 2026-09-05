<script lang="ts">
  import TeacherGate from '#lib/components/TeacherGate.svelte';

  let {
    teacherAuth,
    onUnlockTeacher,
    onLockTeacher,
    onBack,
    onOpenAddProvider,
    onExportData,
    onImportData,
    onResetAllData
  } = $props<{
    teacherAuth: { isUnlocked: boolean };
    onUnlockTeacher: () => void;
    onLockTeacher: () => void;
    onBack: () => void;
    onOpenAddProvider: () => void;
    onExportData: () => void;
    onImportData: (event: Event) => void;
    onResetAllData: () => void;
  }>();

  let showGateModal = $state(!teacherAuth.isUnlocked);
</script>

<div class="screen-settings-full">
  <!-- Nav Bar -->
  <div class="settings-nav-strip">
    <button class="back-btn neo-btn" onclick={onBack}>
      ← Back to App
    </button>
    <div class="nav-right-actions">
      {#if teacherAuth.isUnlocked}
        <button class="lock-btn" onclick={onLockTeacher}>
          🔒 Lock Grown-Ups Mode
        </button>
      {/if}
      <span class="station-tag">GROWN-UPS & SETTINGS</span>
    </div>
  </div>

  <!-- Hero Header -->
  <div class="settings-hero">
    <span class="gear-hero">⚙️</span>
    <h1 class="hero-title">Parent & Teacher Zone</h1>
    <p class="hero-subtitle">Manage curriculum sources, audio calibration, and student data backups.</p>
  </div>

  {#if !teacherAuth.isUnlocked}
    <!-- Gated Notice Card -->
    <div class="gated-lock-card neo-card">
      <span class="lock-big-icon">🔒</span>
      <h2>Grown-Ups Verification Required</h2>
      <p>This section is reserved for parents and piano teachers to manage app settings.</p>
      <button class="unlock-btn neo-btn" onclick={() => showGateModal = true}>
        Pass Verification Challenge ➡️
      </button>
    </div>
  {:else}
    <!-- Full Settings Hub -->
    <div class="settings-sections-grid">
      <!-- Section 1: YouTube & Curriculum Sources -->
      <section class="settings-card neo-card">
        <div class="card-header">
          <span class="card-icon">📺</span>
          <div>
            <h3>Curriculum & Video Channels</h3>
            <span>Add YouTube playlists, channels, or book chapter bookmarks</span>
          </div>
        </div>
        <div class="card-body">
          <p class="desc">
            You can add custom YouTube videos with chapter timestamps (e.g. <code>0:15 - Song Name</code>) or full playlist links to add new piano books to the library.
          </p>
          <button class="action-btn primary-loud neo-btn" onclick={onOpenAddProvider}>
            + Add New YouTube Video / Playlist
          </button>
        </div>
      </section>

      <!-- Section 2: Audio & Metronome Calibration -->
      <section class="settings-card neo-card">
        <div class="card-header">
          <span class="card-icon">🎛️</span>
          <div>
            <h3>Audio & Recording Preferences</h3>
            <span>Microphone recording levels and audio playback</span>
          </div>
        </div>
        <div class="card-body">
          <div class="setting-row">
            <div class="setting-text">
              <strong>High-Fidelity Audio</strong>
              <small>Optimizes recording sample rate for acoustic piano timbre</small>
            </div>
            <span class="status-pill active">Enabled</span>
          </div>
          <div class="setting-row">
            <div class="setting-text">
              <strong>Metronome Sounds</strong>
              <small>Crisp wooden acoustic rim-shot sound for practice timing</small>
            </div>
            <span class="status-pill active">Classic Woodblock</span>
          </div>
        </div>
      </section>

      <!-- Section 3: Data Backup, Cloudflare & Storage -->
      <section class="settings-card neo-card">
        <div class="card-header">
          <span class="card-icon">💾</span>
          <div>
            <h3>Data Backup & Restore</h3>
            <span>Preserve student stars, recordings, and custom curriculum</span>
          </div>
        </div>
        <div class="card-body">
          <p class="desc">
            Export all student profiles, earned stars, and custom bookmarks as a JSON backup file to transfer between devices.
          </p>
          <div class="data-btn-row">
            <button class="action-btn neo-btn secondary" onclick={onExportData}>
              📤 Export Backup JSON
            </button>
            <label class="action-btn neo-btn secondary import-label">
              📥 Import Backup JSON
              <input type="file" accept=".json" onchange={onImportData} style="display: none;" />
            </label>
            <button class="action-btn danger-btn" onclick={onResetAllData}>
              ⚠️ Reset Practice Data
            </button>
          </div>
        </div>
      </section>
    </div>
  {/if}
</div>

<!-- Teacher Verification Modal -->
{#if showGateModal}
  <TeacherGate
    onSuccess={() => {
      onUnlockTeacher();
      showGateModal = false;
    }}
    onCancel={() => {
      showGateModal = false;
      if (!teacherAuth.isUnlocked) {
        onBack();
      }
    }}
  />
{/if}

<style>
  .screen-settings-full {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 40px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .settings-nav-strip {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  .nav-right-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .back-btn {
    background: #ffffff;
    font-size: 0.9rem;
    font-weight: 900;
    padding: 8px 16px;
    border-radius: 12px;
    cursor: pointer;
  }

  .lock-btn {
    background: #F5F5F5;
    border: 2px solid #000;
    border-radius: 10px;
    padding: 6px 12px;
    font-weight: 800;
    font-size: 0.78rem;
    cursor: pointer;
  }

  .station-tag {
    background: #FFF9C4;
    border: 2px solid #000;
    border-radius: 12px;
    padding: 4px 12px;
    font-size: 0.78rem;
    font-weight: 900;
  }

  .settings-hero {
    text-align: center;
    padding: 10px 0;
  }

  .gear-hero {
    font-size: 2.6rem;
    display: inline-block;
    margin-bottom: 4px;
  }

  .hero-title {
    margin: 0 0 6px 0;
    font-size: 2rem;
    font-weight: 900;
    color: #121212;
  }

  .hero-subtitle {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: #555;
  }

  /* Gated Card */
  .gated-lock-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 40px 24px;
    background: #ffffff;
    border-radius: 20px;
    gap: 12px;
  }

  .lock-big-icon {
    font-size: 3rem;
  }

  .gated-lock-card h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 900;
  }

  .gated-lock-card p {
    margin: 0;
    color: #666;
    font-size: 1rem;
    max-width: 440px;
  }

  .unlock-btn {
    margin-top: 10px;
    background: #FFD54F;
    font-size: 1rem;
    font-weight: 900;
    padding: 12px 24px;
    border-radius: 12px;
    cursor: pointer;
  }

  /* Settings Sections Grid */
  .settings-sections-grid {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .settings-card {
    padding: 20px;
    background: #ffffff;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .card-icon {
    font-size: 2rem;
  }

  .card-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 900;
    color: #121212;
  }

  .card-header span {
    font-size: 0.8rem;
    color: #555;
    font-weight: 700;
  }

  .card-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .desc {
    margin: 0;
    font-size: 0.9rem;
    color: #444;
    line-height: 1.4;
  }

  .primary-loud {
    background: #FFCA28;
    align-self: flex-start;
  }

  .setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background: #FAFAFA;
    border: 1.5px solid #000;
    border-radius: 12px;
  }

  .setting-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .setting-text strong {
    font-size: 0.95rem;
  }

  .setting-text small {
    font-size: 0.78rem;
    color: #666;
  }

  .status-pill {
    background: #E8F5E9;
    border: 1.5px solid #2E7D32;
    color: #2E7D32;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 900;
    padding: 3px 8px;
  }

  .data-btn-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .action-btn {
    padding: 10px 16px;
    border-radius: 10px;
    font-weight: 900;
    font-size: 0.88rem;
    cursor: pointer;
  }

  .action-btn.secondary {
    background: #ffffff;
  }

  .import-label {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }

  .danger-btn {
    background: #FFEBEE;
    border: 2px solid #C62828;
    color: #C62828;
    border-radius: 10px;
    font-weight: 900;
    padding: 10px 16px;
    cursor: pointer;
  }
</style>
