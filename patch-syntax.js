const fs = require('fs');
const file = 'piano-companion/src/routes/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

// The `split('\n')` inside the patch script actually executed a literal newline in the JS string
// Let's replace the broken code block
content = content.replace(
  /\/\/ Expecting format: VIDEO_ID \s*00:00 Chapter 1 \s*01:20 Chapter 2\s*const lines = newProviderInput.split\('n'\).map\(l => l.trim\(\)\).filter\(l => l\);/,
  `// Expecting format: VIDEO_ID \\n 00:00 Chapter 1 \\n 01:20 Chapter 2\n              const lines = newProviderInput.split('\\n').map(l => l.trim()).filter(l => l);`
);
content = content.replace(
    /const parsedChapters = \[\];/,
    `const parsedChapters: Array<{time: string, title: string}> = [];`
);

// We still have to fix the literal parsing issue in the original patch where `\n` turned into actual newlines in code
content = content.replace(
    /00:00 Chapter 1 \s*01:20 Chapter 2/,
    ''
);

// To be completely safe, let's just fix the method directly:
content = content.replace(
/\} else if \(newProviderType === 'chapters'\) \{[\s\S]*?if \(newLessons\.length > 0\) \{/m,
`} else if (newProviderType === 'chapters') {
              const lines = newProviderInput.split('\\n').map(l => l.trim()).filter(l => l);
              const videoId = lines[0];
              const chapterLines = lines.slice(1);

              const timeToSeconds = (timeStr: string) => {
                  const parts = timeStr.split(':').map(Number);
                  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
                  return parts[0] * 60 + parts[1];
              };

              const parsedChapters: Array<{time: string, title: string}> = [];
              const regex = /(\\d+:\\d{2}(?::\\d{2})?)\\s+(.*)/;
              for (const line of chapterLines) {
                  const match = regex.exec(line);
                  if (match) {
                      parsedChapters.push({ time: match[1], title: match[2].trim() });
                  }
              }

              parsedChapters.forEach((ch, index) => {
                  const startTime = timeToSeconds(ch.time);
                  const nextCh = parsedChapters[index + 1];
                  const endTime = nextCh ? timeToSeconds(nextCh.time) : startTime + 120;
                  newLessons.push({
                      ...baseLessonParams,
                      id: crypto.randomUUID(),
                      title: ch.title,
                      sequenceIndex: index + 1,
                      youtubeVideoId: videoId,
                      startTime,
                      endTime
                  });
              });
          }

          if (newLessons.length > 0) {`
);

fs.writeFileSync(file, content);
