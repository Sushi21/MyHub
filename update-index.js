#!/usr/bin/env node

/**
 * This script updates index.html with the correct asset paths from dist/index.html
 * Run this after building the React app
 */

const fs = require('fs');
const path = require('path');

const distIndexPath = path.join(__dirname, 'dist', 'index.html');
const rootIndexPath = path.join(__dirname, 'index.html');

// Read dist/index.html to extract asset paths
const distIndex = fs.readFileSync(distIndexPath, 'utf-8');

// Extract JS and CSS paths using regex
const jsMatch = distIndex.match(/src="\.\/assets\/(index-[^"]+\.js)"/);
const cssMatch = distIndex.match(/href="\.\/assets\/(index-[^"]+\.css)"/);

if (!jsMatch || !cssMatch) {
  console.error('❌ Could not find asset paths in dist/index.html');
  process.exit(1);
}

const jsPath = `./dist/assets/${jsMatch[1]}`;
const cssPath = `./dist/assets/${cssMatch[1]}`;

console.log('📦 Found assets:');
console.log('  JS:', jsPath);
console.log('  CSS:', cssPath);

// Create updated index.html content
const indexHtml = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Record Collection On Vinyl</title>

  <!-- Open Graph Tags -->
  <meta property="og:title" content="🎶 My Vinyl Collection" />
  <meta property="og:description" content="Browse my vinyl collection, preview songs, and check out tracklists from my favorite albums." />
  <meta property="og:image" content="https://thefrenchcoder.com/images/vinyl-cover.png" />
  <meta property="og:url" content="https://thefrenchcoder.com/" />
  <meta property="og:type" content="website" />

  <!-- React App Assets -->
  <script type="module" crossorigin src="${jsPath}"></script>
  <link rel="stylesheet" crossorigin href="${cssPath}">

  <!-- Handle GitHub Pages SPA redirect -->
  <script>
    (function() {
      var redirect = sessionStorage.redirect;
      delete sessionStorage.redirect;
      if (redirect && redirect != location.href) {
        history.replaceState(null, null, redirect);
      }
    })();
  </script>
</head>

<body>
  <div id="root"></div>
</body>

</html>
`;

// Write updated index.html
fs.writeFileSync(rootIndexPath, indexHtml);

console.log('✅ Updated index.html with new asset paths');
