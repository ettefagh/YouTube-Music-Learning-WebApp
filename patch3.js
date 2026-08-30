const fs = require('fs');
const file = 'piano-companion/src/routes/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

const svelteScriptUpdates = `
  let videoCurrentTime = $state(0);
  let videoDuration = $state(0);
  let videoSeekTarget = $state<number | null>(null);

  function handleTimeUpdate(time: number, duration: number) {
      videoCurrentTime = time;
      videoDuration = duration;
  }

  function handleProgressClick(e: MouseEvent) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      videoSeekTarget = percentage * videoDuration;
  }
`;

content = content.replace(
  `let providerMode = $state<'video' | 'playlist'>('video');`,
  `let providerMode = $state<'video' | 'playlist'>('video');
  ${svelteScriptUpdates}`
);

const actionParams = `
              playbackRate: () => playbackRate,
              isLooping: () => isLooping,
              onTimeUpdate: handleTimeUpdate,
              seekTarget: () => videoSeekTarget,
              _trigger: [playbackRate, isLooping, currentLesson?.youtubeVideoId, videoSeekTarget]
            }}`;

content = content.replace(
  `              playbackRate: () => playbackRate,
              isLooping: () => isLooping,
              _trigger: [playbackRate, isLooping, currentLesson?.youtubeVideoId]
            }}`,
  actionParams
);

const progressBarUI = `
          <!-- Custom Kid-friendly Progress Bar -->
          <div class="progress-container" role="button" tabindex="0" onclick={handleProgressClick} onkeydown={(e) => e.key === 'Enter' && handleProgressClick(e as any)}>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: {videoDuration ? (videoCurrentTime / videoDuration) * 100 : 0}%"></div>
                <div class="progress-knob" style="left: {videoDuration ? (videoCurrentTime / videoDuration) * 100 : 0}%"></div>
            </div>
            <div class="time-readout">
                <span>{Math.floor(videoCurrentTime / 60)}:{(Math.floor(videoCurrentTime % 60)).toString().padStart(2, '0')}</span>
                <span>{Math.floor(videoDuration / 60)}:{(Math.floor(videoDuration % 60)).toString().padStart(2, '0')}</span>
            </div>
          </div>

          <div class="video-controls">`;

content = content.replace(`<div class="video-controls">`, progressBarUI);

const progressStyles = `
  /* Progress Bar */
  .progress-container {
    padding: 12px 16px;
    background: #FFF;
    border-bottom: 3px solid #000;
    cursor: pointer;
  }
  .progress-bar-bg {
    height: 16px;
    background: #E0E0E0;
    border: 3px solid #000;
    border-radius: 8px;
    position: relative;
  }
  .progress-bar-fill {
    height: 100%;
    background: #4CAF50;
    width: 0%;
  }
  .progress-knob {
    width: 24px;
    height: 24px;
    background: #FFB300;
    border: 3px solid #000;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .time-readout {
    display: flex;
    justify-content: space-between;
    font-weight: 800;
    margin-top: 8px;
    font-size: 0.9rem;
  }
`;

content = content.replace(`/* Video Player */`, progressStyles + `\n  /* Video Player */`);

fs.writeFileSync(file, content);
