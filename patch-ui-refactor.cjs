const fs = require('fs');

const path = 'piano-companion/src/routes/+page.svelte';
let code = fs.readFileSync(path, 'utf8');

// The screenshot shows neobrutalism.
// Boxes have thick borders: border: 3px solid #000; box-shadow: 4px 4px 0 #000;
// We need to apply this to player-wrapper, audio-studio track-cards, checkpoints, etc.

code = code.replace(/\.player-wrapper \{[\s\S]*?\}/, '.player-wrapper { background: #000; border-radius: 16px; overflow: hidden; margin-bottom: 24px; border: 3px solid #000; box-shadow: 4px 4px 0 #000; }');
code = code.replace(/\.track-card \{[\s\S]*?\}/, '.track-card { background: #90A4AE; padding: 16px; border-radius: 12px; border: 3px solid #000; box-shadow: 4px 4px 0 #000; display: flex; flex-direction: column; gap: 8px;}');
// In the screenshot, teacher card has grey background, maybe #90A4AE or similar. Student card has green background #A5D6A7
code = code.replace(/\.student-card \{[\s\S]*?\}/, '.student-card { background: #A5D6A7; }');

// Gate btn and record btn
code = code.replace(/\.gate-btn \{[\s\S]*?\}/, '.gate-btn { width: 100%; padding: 12px; border: 3px solid #000; background: white; border-radius: 8px; cursor: pointer; margin-top: auto; font-weight: bold; box-shadow: 2px 2px 0 #000; transition: transform 0.1s, box-shadow 0.1s; } .gate-btn:active { transform: translate(2px, 2px); box-shadow: 0 0 0 #000; }');
code = code.replace(/\.record-btn \{[\s\S]*?\}/, '.record-btn { width: 100%; padding: 12px; border: 3px solid #000; border-radius: 8px; background: #FF5252; color: white; font-weight: bold; cursor: pointer; margin-top: auto; box-shadow: 2px 2px 0 #000; transition: transform 0.1s, box-shadow 0.1s; } .record-btn:active { transform: translate(2px, 2px); box-shadow: 0 0 0 #000; }');

// Video controls buttons
code = code.replace(/\.video-controls button \{[\s\S]*?\}/, '.video-controls button { background: #424242; color: white; border: 2px solid #000; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 2px 2px 0 #000; } .video-controls button:active { transform: translate(2px,2px); box-shadow: 0 0 0 #000;}');

// Mascot card
let mascotCode = fs.readFileSync('piano-companion/src/lib/components/MascotPip.svelte', 'utf8');
mascotCode = mascotCode.replace(/\.mascot-card \{[\s\S]*?\}/, '.mascot-card { display: flex; align-items: center; gap: 16px; padding: 12px 20px; background: #FFF9C4; border-radius: 20px; border: 3px solid #000; box-shadow: 4px 4px 0 #000; margin-bottom: 24px; }');
fs.writeFileSync('piano-companion/src/lib/components/MascotPip.svelte', mascotCode);

// Settings and checkpoints
code = code.replace(/\.checkpoints \{[\s\S]*?\}/, '.checkpoints { background: #E1BEE7; padding: 16px 20px; border-radius: 12px; margin-bottom: 24px; border: 3px solid #000; box-shadow: 4px 4px 0 #000; }');

// Top nav select
code = code.replace(/\.top-nav select \{[\s\S]*?\}/, '.top-nav select { padding: 8px 12px; border-radius: 8px; border: 3px solid #000; font-weight: bold; box-shadow: 2px 2px 0 #000; background: white; cursor: pointer; }');

fs.writeFileSync(path, code);
console.log('UI refactor patched');
