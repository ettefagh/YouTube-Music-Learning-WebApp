const fs = require('fs');

const path = 'piano-companion/src/lib/components/screens/LibraryScreen.svelte';
let content = fs.readFileSync(path, 'utf8');

// We have:
// <div class="screen-library">
// ...
// </div>
// {/if}
// We should move {/if} inside <div class="screen-library"> or keep it inside.
// Right now the error says `</div>` attempted to close an element that was not open.
// This is because {/if} was incorrectly placed after </div>.

content = content.replace(
  `</div>\n\n  {/if}\n\n<!-- Book Picker Modal (When "Change Book" is tapped) -->`,
  `  {/if}\n</div>\n\n<!-- Book Picker Modal (When "Change Book" is tapped) -->`
);

fs.writeFileSync(path, content);
