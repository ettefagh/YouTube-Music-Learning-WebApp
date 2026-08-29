export interface LooperOptions {
  videoId?: () => string | undefined;
  playlistId?: () => string | undefined;
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

  function loadYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }
    if (!window.onYouTubeIframeAPIReady) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Save previous callback if it exists
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        initPlayer();
    };
  }

  function initPlayer() {
    const vId = options.videoId ? options.videoId() : undefined;
    const pId = options.playlistId ? options.playlistId() : undefined;

    let playerVars: any = {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3
    };

    if (pId) {
        playerVars.listType = 'playlist';
        playerVars.list = pId;
    }

    player = new window.YT.Player(node, {
      videoId: vId,
      playerVars: playerVars,
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

        // Prevent seeking if end is 0 (i.e. default or unknown length)
        if (end > 0 && (currentTime >= end - earlySeekThreshold || currentTime < start)) {
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
      options = newOptions;
      if (player && player.setPlaybackRate) {
        player.setPlaybackRate(options.playbackRate());
      }
      if (player && player.loadVideoById && options.videoId && options.videoId()) {
        const currentVideoUrl = player.getVideoUrl();
        const vId = options.videoId();
        if (vId && (!currentVideoUrl || !currentVideoUrl.includes(vId))) {
            player.loadVideoById(vId);
        }
      }
      if (player && player.loadPlaylist && options.playlistId && options.playlistId()) {
          // Playlist updates usually handled by destroying and recreating the iframe
          // but API provides cuePlaylist/loadPlaylist
      }
    },
    destroy() {
      stopLoopWatcher();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (player?.destroy) player.destroy();
    }
  };
}
