export interface YouTubePlayerController {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seekTo: (seconds: number) => void;
  seekBy: (deltaSeconds: number) => void;
  setRate: (rate: number) => void;
  isPlaying: () => boolean;
}

export interface LooperOptions {
  videoId?: () => string | undefined;
  playlistId?: () => string | undefined;
  startTime: () => number;
  endTime: () => number;
  customLoopStart?: () => number | null;
  customLoopEnd?: () => number | null;
  playbackRate: () => number;
  isLooping: () => boolean;
  onReady?: (controller: YouTubePlayerController) => void;
  onPlayerStateChange?: (state: 'unstarted' | 'ended' | 'playing' | 'paused' | 'buffering' | 'cued') => void;
  onTimeUpdate?: (time: number, duration: number) => void;
  seekTarget?: () => number | null;
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
  let lastSeekTarget: number | null = null;

  const controller: YouTubePlayerController = {
    play: () => {
      if (player?.playVideo) player.playVideo();
    },
    pause: () => {
      if (player?.pauseVideo) player.pauseVideo();
    },
    togglePlay: () => {
      if (!player) return;
      if (player.getPlayerState && window.YT && player.getPlayerState() === window.YT.PlayerState.PLAYING) {
        player.pauseVideo();
      } else if (player.playVideo) {
        player.playVideo();
      }
    },
    seekTo: (seconds: number) => {
      if (player?.seekTo) player.seekTo(seconds, true);
    },
    seekBy: (deltaSeconds: number) => {
      if (player?.getCurrentTime && player?.seekTo) {
        const current = player.getCurrentTime();
        const duration = player.getDuration() || 0;
        const target = Math.max(0, Math.min(duration, current + deltaSeconds));
        player.seekTo(target, true);
      }
    },
    setRate: (rate: number) => {
      if (player?.setPlaybackRate) player.setPlaybackRate(rate);
    },
    isPlaying: () => {
      if (!player?.getPlayerState || !window.YT) return false;
      return player.getPlayerState() === window.YT.PlayerState.PLAYING;
    }
  };

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

    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (previousCallback) previousCallback();
      initPlayer();
    };
  }

  function initPlayer() {
    const vId = options.videoId ? options.videoId() : undefined;
    const pId = options.playlistId ? options.playlistId() : undefined;

    const playerVars: any = {
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
          options.onReady?.(controller);
          startLoopWatcher();
        },
        onStateChange: (event: any) => {
          let stateName: 'unstarted' | 'ended' | 'playing' | 'paused' | 'buffering' | 'cued' = 'unstarted';
          if (window.YT) {
            if (event.data === window.YT.PlayerState.PLAYING) stateName = 'playing';
            else if (event.data === window.YT.PlayerState.PAUSED) stateName = 'paused';
            else if (event.data === window.YT.PlayerState.ENDED) stateName = 'ended';
            else if (event.data === window.YT.PlayerState.BUFFERING) stateName = 'buffering';
            else if (event.data === window.YT.PlayerState.CUED) stateName = 'cued';
          }
          options.onPlayerStateChange?.(stateName);

          if (window.YT && event.data === window.YT.PlayerState.PLAYING) {
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
      if (player && player.getCurrentTime) {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration() || 0;

        if (options.onTimeUpdate) {
          options.onTimeUpdate(currentTime, duration);
        }

        if (options.isLooping()) {
          const customStart = options.customLoopStart ? options.customLoopStart() : null;
          const customEnd = options.customLoopEnd ? options.customLoopEnd() : null;

          const start = (customStart !== null && customStart !== undefined) ? customStart : options.startTime();
          const end = (customEnd !== null && customEnd !== undefined) ? customEnd : options.endTime();

          if (end > 0 && (currentTime >= end - earlySeekThreshold || currentTime < start)) {
            player.seekTo(start, true);
          }
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

      // Handle programmatic seek from parent UI
      if (options.seekTarget && player && player.seekTo) {
        const target = options.seekTarget();
        if (target !== null && target !== lastSeekTarget) {
          player.seekTo(target, true);
          lastSeekTarget = target;
        }
      }

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
    },
    destroy() {
      stopLoopWatcher();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (player?.destroy) player.destroy();
    }
  };
}
