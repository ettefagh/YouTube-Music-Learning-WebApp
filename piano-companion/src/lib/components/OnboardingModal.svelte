<script lang="ts">
  let { onComplete } = $props<{ onComplete: () => void }>();

  let currentStep = $state(0);

  const steps = [
    {
      title: "Welcome to Piano Companion!",
      emoji: "🎹",
      badge: "Get Started",
      badgeColor: "#FFE082",
      desc: "Your joyful practice companion. Learn Tastenzauberei pieces with synchronized video lessons, custom A-B loops, and fun checkpoints."
    },
    {
      title: "Multiple Top Instructors",
      emoji: "👩‍🏫",
      badge: "1-Tap Switch",
      badgeColor: "#FFCDD2",
      desc: "Switch between your favorite educators anytime—Anikó, Gavin, Vika, Maryna, Valentin, and Jess—preserving your song position seamlessly!"
    },
    {
      title: "Dual Audio Studio",
      emoji: "🎙️",
      badge: "Practice & Record",
      badgeColor: "#C8E6C9",
      desc: "Listen to the teacher's reference performance, then record your own takes to celebrate your progress and earn practice stars!"
    },
    {
      title: "Kid-Safe & Teacher Gate",
      emoji: "🔒",
      badge: "Grown-Ups Protected",
      badgeColor: "#E1BEE7",
      desc: "Settings and teacher recordings stay protected behind a friendly grown-ups gate, keeping the space safe and distraction-free."
    }
  ];

  function nextStep() {
    if (currentStep < steps.length - 1) {
      currentStep++;
    } else {
      onComplete();
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight' || e.key === 'Enter') {
      nextStep();
    } else if (e.key === 'ArrowLeft') {
      prevStep();
    } else if (e.key === 'Escape') {
      onComplete();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="modal-backdrop" role="dialog" aria-modal="true" aria-label="Welcome Onboarding">
  <div class="modal-content neo-card">
    <!-- Header: Step Indicator & Skip Button -->
    <div class="onboarding-top-bar">
      <span class="step-counter-pill">Step {currentStep + 1} of {steps.length}</span>
      <button class="skip-link-btn" onclick={onComplete} title="Skip onboarding and start playing">
        Skip ➔
      </button>
    </div>

    <!-- Carousel Viewport -->
    <div class="slides-viewport">
      <div class="slides-container" style="transform: translateX(-{currentStep * 100}%)">
        {#each steps as step, i}
          <div class="slide" aria-hidden={i !== currentStep}>
            <div class="slide-emoji-wrap">
              <span class="slide-emoji">{step.emoji}</span>
              <span class="slide-badge" style="background: {step.badgeColor}">{step.badge}</span>
            </div>
            <h2 class="slide-title">{step.title}</h2>
            <p class="slide-desc">{step.desc}</p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Dots Indicator -->
    <div class="dots-row">
      {#each steps as _, i}
        <button
          class="dot {i === currentStep ? 'active' : ''}"
          onclick={() => currentStep = i}
          aria-label="Go to step {i + 1}"
        ></button>
      {/each}
    </div>

    <!-- Action Buttons -->
    <div class="actions-row">
      {#if currentStep > 0}
        <button class="neo-btn secondary back-btn" onclick={prevStep}>
          ← Back
        </button>
      {/if}
      <button class="neo-btn primary next-btn" onclick={nextStep}>
        {currentStep === steps.length - 1 ? "Let's Play! 🚀" : "Next ➔"}
      </button>
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(6px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
    padding: 16px;
    box-sizing: border-box;
    animation: backdropFadeIn 0.3s ease-out;
  }

  @keyframes backdropFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-content {
    background: var(--card-bg, #ffffff);
    color: var(--text-main, #121212);
    border: 3px solid var(--border-dark, #0F0E17);
    border-radius: 24px;
    box-shadow: 6px 6px 0 var(--border-dark, #0F0E17);
    padding: 24px 20px 20px 20px;
    max-width: 440px;
    width: 100%;
    text-align: center;
    position: relative;
    box-sizing: border-box;
    animation: modalPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  @keyframes modalPop {
    from { transform: scale(0.92) translateY(12px); opacity: 0; }
    to { transform: scale(1) translateY(0); opacity: 1; }
  }

  .onboarding-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .step-counter-pill {
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--text-muted, #555555);
    background: var(--chip-bg, #F3F4F6);
    border: 1.5px solid var(--border-dark, #0F0E17);
    border-radius: 9999px;
    padding: 4px 12px;
  }

  .skip-link-btn {
    background: transparent;
    border: none;
    color: var(--text-muted, #555555);
    font-size: 0.85rem;
    font-weight: 800;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: color 0.15s ease, transform 0.1s ease;
  }

  .skip-link-btn:hover {
    color: var(--text-main, #121212);
    transform: translateX(2px);
  }

  .slides-viewport {
    overflow: hidden;
    width: 100%;
  }

  .slides-container {
    display: flex;
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    width: 100%;
  }

  .slide {
    min-width: 100%;
    box-sizing: border-box;
    padding: 8px 12px 16px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .slide-emoji-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .slide-emoji {
    font-size: 4.2rem;
    line-height: 1;
    filter: drop-shadow(2px 3px 0 rgba(0, 0, 0, 0.15));
  }

  .slide-badge {
    font-size: 0.72rem;
    font-weight: 900;
    color: #0F0E17;
    border: 1.5px solid #0F0E17;
    border-radius: 8px;
    padding: 2px 8px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    box-shadow: 1.5px 1.5px 0 #0F0E17;
  }

  .slide-title {
    font-weight: 900;
    margin: 4px 0 8px 0;
    font-size: 1.4rem;
    color: var(--text-main, #121212);
    letter-spacing: -0.01em;
  }

  .slide-desc {
    color: var(--text-muted, #555555);
    line-height: 1.45;
    font-size: 0.98rem;
    font-weight: 600;
    margin: 0;
    max-width: 360px;
  }

  .dots-row {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin: 16px 0 20px 0;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--chip-bg, #E0E0E0);
    border: 2px solid var(--border-dark, #0F0E17);
    padding: 0;
    cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s;
  }

  .dot.active {
    background: var(--retro-gold, #FFB300);
    transform: scale(1.35);
  }

  .actions-row {
    display: flex;
    gap: 12px;
    width: 100%;
  }

  .neo-btn {
    border: 2.5px solid var(--border-dark, #0F0E17);
    border-radius: 14px;
    padding: 12px 20px;
    font-size: 1.05rem;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 3px 3px 0 var(--border-dark, #0F0E17);
    transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.15s ease;
    user-select: none;
  }

  .neo-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 var(--border-dark, #0F0E17);
  }

  .neo-btn.primary {
    background: var(--retro-gold, #FFD54F);
    color: #0F0E17;
    flex: 1;
  }

  .neo-btn.primary:hover {
    background: #FFCA28;
    transform: translateY(-1px);
    box-shadow: 4px 4px 0 var(--border-dark, #0F0E17);
  }

  .neo-btn.secondary {
    background: var(--chip-bg, #F3F4F6);
    color: var(--text-main, #121212);
    min-width: 90px;
  }

  .neo-btn.secondary:hover {
    background: #E5E7EB;
  }
</style>
