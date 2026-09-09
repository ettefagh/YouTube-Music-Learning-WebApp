const fs = require('fs');

const file = 'piano-companion/src/routes/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove Top Actions
const topActionsTarget = `
          <!-- Top Actions (Piece Prev/Next & Metronome) -->
          <div class="player-top-actions">
            <button
              class="token-disc-btn prev-btn"
              disabled={!hasPrevLesson}
              onclick={prevLesson}
              title="Previous piece"
            >
              ⏮
            </button>
            <button
              class="token-disc-btn next-btn"
              disabled={!hasNextLesson}
              onclick={nextLesson}
              title="Next piece"
            >
              ⏭
            </button>
            <button
              class="capsule-metronome-btn {showMetronome ? 'active' : ''}"
              onclick={() => showMetronome = !showMetronome}
              title="Toggle metronome"
            >
              ⏱️ Metronome
            </button>
          </div>
`;

content = content.replace(topActionsTarget, '');

const metronomeWrapTarget = `
        {#if showMetronome}
          <div class="player-metronome-wrap">
            <Metronome />
          </div>
        {/if}
`;
content = content.replace(metronomeWrapTarget, '');

// 2. Wrap Scrubber and Insert Prev/Next
const scrubberTarget = `
            <!-- Integrated Border-Free Scrubber -->
            <div
              class="scrubber-track"
`;

const scrubberReplace = `
            <!-- Integrated Border-Free Scrubber with Prev/Next -->
            <div class="scrubber-row-wrapper">
              <button
                class="token-disc-btn prev-btn scrubber-side-btn"
                disabled={!hasPrevLesson}
                onclick={prevLesson}
                title="Previous piece"
              >
                ⏮
              </button>
            <div
              class="scrubber-track"
`;
content = content.replace(scrubberTarget.trim(), scrubberReplace.trim());

const scrubberEndTarget = `
              </div>
            </div>
          </div>

          <!-- Tactile Command Island -->
`;

const scrubberEndReplace = `
              </div>
            </div>
              <button
                class="token-disc-btn next-btn scrubber-side-btn"
                disabled={!hasNextLesson}
                onclick={nextLesson}
                title="Next piece"
              >
                ⏭
              </button>
            </div>
          </div>

          {#if showMetronome}
            <div class="player-metronome-wrap">
              <Metronome />
            </div>
          {/if}

          <!-- Tactile Command Island -->
`;
content = content.replace(scrubberEndTarget.trim(), scrubberEndReplace.trim());

// 3. Add Metronome Button to Tactile Command Island
const tactileTarget = `
              <button
                class="tactile-disc loop-disc {isLooping ? 'is-active' : ''}"
                onclick={() => isLooping = !isLooping}
                title="Toggle A/B Loop or Chapter Repeat"
              >
                🔄
              </button>
            </div>
`;

const tactileReplace = `
              <button
                class="tactile-disc loop-disc {isLooping ? 'is-active' : ''}"
                onclick={() => isLooping = !isLooping}
                title="Toggle A/B Loop or Chapter Repeat"
              >
                🔄
              </button>
              <button
                class="tactile-disc metronome-disc {showMetronome ? 'is-active' : ''}"
                onclick={() => showMetronome = !showMetronome}
                title="Toggle metronome"
              >
                ⏱️
              </button>
            </div>
`;
content = content.replace(tactileTarget.trim(), tactileReplace.trim());

// 4. Update CSS
const cssTarget = `
  .scrubber-track {
    background: #ffffff;
    padding: 10px 16px 6px 16px;
    border-bottom: 3px solid #000;
    cursor: pointer;
    user-select: none;
  }
`;

const cssReplace = `
  .scrubber-row-wrapper {
    display: flex;
    align-items: center;
    background: #ffffff;
    border-bottom: 3px solid #000;
    padding: 6px 12px;
    gap: 12px;
  }

  .scrubber-side-btn {
    flex-shrink: 0;
  }

  .scrubber-track {
    flex-grow: 1;
    background: #ffffff;
    padding: 4px 4px 0 4px;
    cursor: pointer;
    user-select: none;
  }

  .tactile-disc.metronome-disc.is-active {
    background: var(--retro-gold, #FEE75C);
    transform: translateY(2px);
    box-shadow: 1px 1px 0 var(--border-dark, #0F0E17);
  }
`;
content = content.replace(cssTarget.trim(), cssReplace.trim());

fs.writeFileSync(file, content);
console.log('Buttons patched');
