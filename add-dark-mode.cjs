const fs = require('fs');

// Injecting CSS variables for dark mode support in app.html
let appHtml = fs.readFileSync('piano-companion/src/app.html', 'utf8');

if (!appHtml.includes('--bg-color')) {
    const styleInject = `
    <style>
      :root {
        --bg-color: #f7f7f7;
        --text-color: #000;
        --card-bg: #fff;
        --card-border: #000;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --bg-color: #222;
          --text-color: #fff;
          --card-bg: #333;
          --card-border: #000; /* Neo brutalism remains with black borders even in dark mode, or we can use thick borders */
        }
      }
      body {
        background-color: var(--bg-color);
        color: var(--text-color);
        transition: background-color 0.3s, color 0.3s;
      }
    </style>
    `;
    appHtml = appHtml.replace('</head>', styleInject + '</head>');
    fs.writeFileSync('piano-companion/src/app.html', appHtml);
}
console.log("Added dark mode CSS vars");
