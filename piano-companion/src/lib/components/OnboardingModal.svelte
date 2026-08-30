<script lang="ts">
  let { onComplete } = $props<{ onComplete: () => void }>();

  let currentStep = $state(0);

  const steps = [
    {
      title: "Welcome to Piano Companion!",
      emoji: "🎹",
      desc: "Your interactive practice partner. Learn songs with guided video loops and interactive checklists."
    },
    {
      title: "Dual Audio Studio",
      emoji: "🎙️",
      desc: "Listen to the teacher's reference track, then record your own take to compare your progress!"
    },
    {
      title: "Teacher Verification",
      emoji: "🔒",
      desc: "We keep settings and master recordings safe behind a Teacher Gate so kids can explore freely."
    }
  ];

  function nextStep() {
    if (currentStep < steps.length - 1) {
      currentStep++;
    } else {
      onComplete();
    }
  }
</script>

<div class="modal-backdrop">
  <div class="modal-content neo-card">
    <div class="slides-container" style="transform: translateX(-{currentStep * 100}%)">
      {#each steps as step}
        <div class="slide">
          <div class="slide-emoji">{step.emoji}</div>
          <h2>{step.title}</h2>
          <p>{step.desc}</p>
        </div>
      {/each}
    </div>

    <div class="dots">
      {#each steps as _, i}
        <span class="dot {i === currentStep ? 'active' : ''}"></span>
      {/each}
    </div>

    <button class="neo-btn primary" onclick={nextStep}>
      {currentStep === steps.length - 1 ? "Let's Play!" : "Next"}
    </button>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  .modal-content {
    background: white;
    padding: 32px 24px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    font-family: system-ui, sans-serif;
    overflow: hidden;
    position: relative;
  }
  .slides-container {
    display: flex;
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    width: 100%;
  }
  .slide {
    min-width: 100%;
    box-sizing: border-box;
    padding: 0 16px;
  }
  .slide-emoji {
    font-size: 5rem;
    margin-bottom: 16px;
  }
  .slide h2 {
    font-weight: 900;
    margin-top: 0;
    font-size: 1.5rem;
  }
  .slide p {
    color: #424242;
    line-height: 1.5;
    font-size: 1.1rem;
    font-weight: 500;
  }
  .dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin: 24px 0;
  }
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #E0E0E0;
    border: 2px solid #9E9E9E;
    transition: all 0.3s;
  }
  .dot.active {
    background: #FFB300;
    border-color: #000;
    transform: scale(1.2);
  }
</style>
