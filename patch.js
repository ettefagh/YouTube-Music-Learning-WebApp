const fs = require('fs');
const file = 'piano-companion/src/routes/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

// The `use:action` in Svelte 5 won't run `update` automatically if the object reference doesn't change
// unless we use an $effect or re-bind it. A simple fix for Svelte 5 is wrapping the dependencies
// so that Svelte tracks the entire object, or we explicitly use an $effect inside the action.
// Let's modify the Svelte file to force re-evaluation of the object by creating a derived object.

content = content.replace(
  `use:youtubeLooper={{
            videoId: () => currentLesson!.youtubeVideoId,
            startTime: () => currentLesson!.startTime,
            endTime: () => currentLesson!.endTime,
            playbackRate: () => playbackRate,
            isLooping: () => isLooping
          }}`,
  `use:youtubeLooper={{
            videoId: () => currentLesson!.youtubeVideoId,
            startTime: () => currentLesson!.startTime,
            endTime: () => currentLesson!.endTime,
            playbackRate: () => playbackRate,
            isLooping: () => isLooping,
            _trigger: [playbackRate, isLooping, currentLesson?.youtubeVideoId]
          }}`
);

fs.writeFileSync(file, content);
