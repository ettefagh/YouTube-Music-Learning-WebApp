export interface LooperOptions {
  videoId: () => string;
  startTime: () => number;
  endTime: () => number;
  playbackRate: () => number;
  isLooping: () => boolean;
  onReady?: () => void;
  _trigger?: any; // Used to force Svelte update hook
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function youtubeLooper(node: HTMLElement, options: LooperOptions) {
  let player: any = null;
  let rafId: number | null = null;
  let isApiLoaded = false;

  function loadYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = () => initPlayer();
  }

  function initPlayer() {
    player = new window.YT.Player(node, {
      videoId: options.videoId(),
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3
      },
      events: {
        onReady: () => {
          player.setPlaybackRate(options.playbackRate());
          options.onReady?.();
          startLoopWatcher();
        },
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            startLoopWatcher();
          } else {
            stopLoopWatcher();
          }
        }
      }
    });
  }

  function startLoopWatcher() {
    if (rafId !== null) return;

    const earlySeekThreshold = 0.05;

    const checkTime = () => {
      if (player && player.getCurrentTime && options.isLooping()) {
        const currentTime = player.getCurrentTime();
        const start = options.startTime();
        const end = options.endTime();

        if (currentTime >= end - earlySeekThreshold || currentTime < start) {
          player.seekTo(start, true);
        }
      }
      rafId = requestAnimationFrame(checkTime);
    };

    rafId = requestAnimationFrame(checkTime);
  }

  function stopLoopWatcher() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  const handleVisibilityChange = () => {
    if (document.hidden && player?.pauseVideo) {
      player.pauseVideo();
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

  loadYouTubeAPI();

  return {
    update(newOptions: LooperOptions) {
      options = newOptions; // Keep reference to latest options
      if (player && player.setPlaybackRate) {
        player.setPlaybackRate(options.playbackRate());
      }
      if (player && player.loadVideoById) {
        const currentVideoUrl = player.getVideoUrl();
        if (!currentVideoUrl || !currentVideoUrl.includes(options.videoId())) {
            player.loadVideoById(options.videoId());
        }
      }
    },
    destroy() {
      stopLoopWatcher();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (player?.destroy) player.destroy();
    }
  };
}
