const fs = require('fs');

const path = 'piano-companion/src/lib/components/TeacherGate.svelte';
let code = fs.readFileSync(path, 'utf8');

// Update styling to match screenshot for TeacherGate
code = code.replace(/background: rgba\(0,0,0,0\.5\);/g, 'background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px);');
code = code.replace(/background: white;\n    padding: 24px;\n    border-radius: 12px;/g, 'background: white;\n    padding: 32px 24px;\n    border-radius: 24px;');
code = code.replace(/<h2>Teacher Verification<\/h2>/g, '<h2 style="font-size: 1.5rem; margin-bottom: 8px;">Teacher Verification</h2>');
code = code.replace(/<p>Please verify you are a teacher/g, '<p style="margin-bottom: 24px; color: #333;">Please verify you are a teacher');
code = code.replace(/\.tabs \{[\s\S]*?\}/, '.tabs { display: flex; margin-bottom: 24px; background: #f0f0f0; border-radius: 12px; overflow: hidden; padding: 4px; gap: 4px; }');
code = code.replace(/\.tabs button \{[\s\S]*?\}/, '.tabs button { flex: 1; padding: 12px; border: none; background: transparent; cursor: pointer; border-radius: 8px; font-weight: 500; color: #555; transition: all 0.2s; }');
code = code.replace(/\.tabs button\.active \{[\s\S]*?\}/, '.tabs button.active { background: #FFB300; font-weight: 600; color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }');

// wait, the screenshot has #FFB300 for active tab 1 and transparent for tab 2, but when active, the other tab is blue? Let's check screenshot details.
// Actually, active is #FFB300, blue button is #2196F3.
code = code.replace(/\.hold-btn \{[\s\S]*?\}/, '.hold-btn { width: 100%; padding: 20px; font-size: 1.1rem; background: #2196F3; color: white; border: none; border-radius: 12px; cursor: pointer; position: relative; overflow: hidden; user-select: none; font-weight: 500; transition: transform 0.1s; } .hold-btn:active { transform: scale(0.98); }');

fs.writeFileSync(path, code);
console.log('TeacherGate patched');
