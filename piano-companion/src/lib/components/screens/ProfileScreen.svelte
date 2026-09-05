<script lang="ts">
  import type { StudentProfile, KidAvatarKey } from '#lib/types/studentProfile.js';
  import { KID_AVATARS, getAvatarEmoji, getAvatarColor } from '#lib/types/studentProfile.js';
  import type { LocalLesson } from '#lib/db/db.js';

  let {
    studentProfiles,
    activeProfileId,
    activeProfile,
    allLessons,
    completedCheckpoints,
    onSelectProfile,
    onAddProfile,
    onBack
  } = $props<{
    studentProfiles: StudentProfile[];
    activeProfileId: string;
    activeProfile: StudentProfile;
    allLessons: LocalLesson[];
    completedCheckpoints: Record<string, boolean>;
    onSelectProfile: (profileId: string) => void;
    onAddProfile: (name: string, avatarKey: KidAvatarKey) => void;
    onBack: () => void;
  }>();

  let showAddModal = $state(false);
  let newName = $state('');
  let newAvatarKey = $state<KidAvatarKey>('lion');

  function handleCreateKid() {
    if (!newName.trim()) return;
    onAddProfile(newName.trim(), newAvatarKey);
    newName = '';
    showAddModal = false;
  }
</script>

<div class="screen-profile-full">
  <!-- Nav Bar -->
  <div class="profile-nav-strip">
    <button class="back-btn neo-btn" onclick={onBack}>
      ← Back to App
    </button>
    <span class="station-tag">KID PROFILES</span>
  </div>

  <!-- Hero Header -->
  <div class="profile-hero-center">
    <span class="crown-hero">👑</span>
    <h1 class="hero-title">Who's Practicing Today?</h1>
    <p class="hero-subtitle">Tap your animal avatar to start playing and keep your stars safe!</p>
  </div>

  <!-- Kids Grid -->
  <div class="profiles-cards-grid">
    {#each studentProfiles as p}
      {@const isActive = activeProfileId === p.id}
      {@const lastLesson = allLessons.find((l: LocalLesson) => l.id === p.lastLessonId)}
      <button
        class="kid-jumbo-card neo-card {isActive ? 'active-kid' : ''}"
        onclick={() => onSelectProfile(p.id)}
      >
        <div class="jumbo-bubble" style="background-color: {p.color}">
          <span class="bubble-emoji">{getAvatarEmoji(p.avatarKey)}</span>
          {#if isActive}
            <span class="active-crown">👑</span>
          {/if}
        </div>

        <div class="kid-meta-center">
          <h3 class="kid-name">{p.name}</h3>
          {#if isActive}
            <span class="active-badge">Playing Now</span>
          {:else}
            <span class="tap-badge">Tap to Play</span>
          {/if}
        </div>

        {#if lastLesson}
          <div class="last-song-pill">
            <span class="last-tag">Last Piece:</span>
            <span class="last-title">#{lastLesson.sequenceIndex} {lastLesson.title}</span>
          </div>
        {/if}
      </button>
    {/each}

    <!-- Add Kid Card -->
    <button class="add-kid-jumbo-card neo-card" onclick={() => showAddModal = true}>
      <div class="add-plus-bubble">➕</div>
      <h3 class="kid-name">Add Kid</h3>
      <span class="tap-badge">New Profile</span>
    </button>
  </div>
</div>

<!-- Add Kid Modal -->
{#if showAddModal}
  <div class="modal-backdrop" onclick={() => showAddModal = false}>
    <div class="add-modal-card neo-card" onclick={(e) => e.stopPropagation()}>
      <div class="modal-header">
        <h3>Create New Kid Profile</h3>
        <button class="close-btn" onclick={() => showAddModal = false}>✕</button>
      </div>

      <div class="form-group">
        <label for="kid-name-input">Child's Name:</label>
        <input
          id="kid-name-input"
          type="text"
          class="name-input"
          placeholder="e.g. Emma"
          bind:value={newName}
        />
      </div>

      <div class="form-group">
        <span class="avatar-label">Choose Avatar:</span>
        <div class="avatars-picker-grid">
          {#each KID_AVATARS as av}
            <button
              class="avatar-pick-btn {newAvatarKey === av.key ? 'picked' : ''}"
              onclick={() => newAvatarKey = av.key}
              style="background-color: {av.color}"
            >
              <span class="pick-emoji">{av.emoji}</span>
            </button>
          {/each}
        </div>
      </div>

      <div class="modal-footer">
        <button class="create-btn neo-btn" onclick={handleCreateKid}>
          Save & Start Playing! 🎉
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .screen-profile-full {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 40px;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
  }

  .profile-nav-strip {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .back-btn {
    background: #ffffff;
    font-size: 0.9rem;
    font-weight: 900;
    padding: 8px 16px;
    border-radius: 12px;
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

  .profile-hero-center {
    text-align: center;
    padding: 10px 0;
  }

  .crown-hero {
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

  .profiles-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 18px;
  }

  .kid-jumbo-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 16px;
    background: #ffffff;
    border-radius: 20px;
    cursor: pointer;
    gap: 12px;
    text-align: center;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .kid-jumbo-card:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
  }

  .kid-jumbo-card.active-kid {
    background: #FFF8E1;
    border-color: #E65100;
    box-shadow: 5px 5px 0 #E65100;
  }

  .jumbo-bubble {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    border: 3.5px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 3px 3px 0 #000;
    position: relative;
  }

  .bubble-emoji {
    font-size: 2.8rem;
  }

  .active-crown {
    position: absolute;
    top: -10px;
    right: -8px;
    font-size: 1.4rem;
  }

  .kid-meta-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .kid-name {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 900;
    color: #121212;
  }

  .active-badge {
    background: #4CAF50;
    color: #fff;
    border: 1.5px solid #000;
    border-radius: 10px;
    padding: 3px 10px;
    font-size: 0.75rem;
    font-weight: 900;
  }

  .tap-badge {
    background: #FAFAFA;
    color: #444;
    border: 1.5px solid #000;
    border-radius: 10px;
    padding: 3px 10px;
    font-size: 0.75rem;
    font-weight: 800;
  }

  .last-song-pill {
    background: #E8F5E9;
    border: 1.5px solid #2E7D32;
    border-radius: 10px;
    padding: 4px 8px;
    display: flex;
    flex-direction: column;
    font-size: 0.72rem;
    width: 100%;
    box-sizing: border-box;
  }

  .last-tag {
    font-weight: 900;
    color: #2E7D32;
  }

  .last-title {
    font-weight: 800;
    color: #121212;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .add-kid-jumbo-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    background: #FAFAFA;
    border: 3px dashed #666;
    border-radius: 20px;
    cursor: pointer;
    gap: 12px;
    text-align: center;
  }

  .add-plus-bubble {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    border: 3px dashed #666;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.4rem;
    background: #ffffff;
  }

  /* Modal */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 16px;
  }

  .add-modal-card {
    background: #ffffff;
    max-width: 480px;
    width: 100%;
    border-radius: 20px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h3 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 900;
  }

  .close-btn {
    background: #eee;
    border: 2px solid #000;
    border-radius: 8px;
    width: 32px;
    height: 32px;
    cursor: pointer;
    font-weight: 900;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-align: left;
  }

  .form-group label, .avatar-label {
    font-size: 0.9rem;
    font-weight: 900;
  }

  .name-input {
    border: 2px solid #000;
    border-radius: 10px;
    padding: 10px;
    font-size: 1rem;
    font-weight: 800;
  }

  .avatars-picker-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .avatar-pick-btn {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 2.5px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  .avatar-pick-btn.picked {
    box-shadow: 0 0 0 3px #FFD54F, 3px 3px 0 #000;
    transform: scale(1.1);
  }

  .pick-emoji {
    font-size: 1.8rem;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }

  .create-btn {
    background: #FFD54F;
    font-size: 1rem;
    font-weight: 900;
    padding: 12px 20px;
    border-radius: 12px;
    cursor: pointer;
    width: 100%;
  }
</style>
