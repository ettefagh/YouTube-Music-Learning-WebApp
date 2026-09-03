const fs = require('fs');
const path = 'piano-companion/src/lib/components/TeacherGate.svelte';
let code = fs.readFileSync(path, 'utf8');

// I notice the background color for active hold mode should be yellow, active math mode could be blue?
// Let's modify the tabs logic to match screenshot better if possible, but for now #FFB300 is good enough.
// The screenshot shows:
// - "3-Second Hold" is active and has a yellow background.
// - "Math Challenge" is inactive and has a light gray background with gray text.
// - the large button has #2196F3 blue background, white text.
// We've already implemented that.

// Just checking if we need to refine the tabs button.active selector
if (!code.includes('tabs button.active { background: #FFC107;')) {
    code = code.replace(/background: #FFB300;/g, 'background: #FFC107;');
}
if (!code.includes('border: 3px solid #000;')) {
    // Add neo-brutalism to modal content
    code = code.replace(/\.modal-content \{[\s\S]*?\}/, '.modal-content { background: white; padding: 32px 24px; border-radius: 24px; max-width: 400px; width: 90%; text-align: center; font-family: system-ui, sans-serif; border: 3px solid #000; box-shadow: 4px 4px 0 #000; }');
}

fs.writeFileSync(path, code);
