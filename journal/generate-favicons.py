"""Generate PNG favicons from SVGs using Playwright"""
import subprocess, os, json

out = "favicon-options"
os.makedirs(out, exist_ok=True)

svgs = {
    "1-agent-head-ns": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><linearGradient id="a1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#E8652B"/><stop offset="100%" style="stop-color:#ff8c42"/></linearGradient></defs>
  <rect width="64" height="64" rx="14" fill="#0d1117"/>
  <rect width="64" height="64" rx="14" fill="none" stroke="#30363d" stroke-width="1.5"/>
  <circle cx="32" cy="16" r="7" fill="none" stroke="url(#a1)" stroke-width="2"/>
  <circle cx="29" cy="15.5" r="1.5" fill="#3fb950"/>
  <circle cx="35" cy="15.5" r="1.5" fill="#3fb950"/>
  <line x1="32" y1="9" x2="32" y2="5" stroke="#E8652B" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="32" cy="4" r="1.5" fill="#E8652B"/>
  <text x="17" y="50" font-family="system-ui, sans-serif" font-size="26" font-weight="900" fill="#e6edf3">N</text>
  <text x="37" y="50" font-family="system-ui, sans-serif" font-size="26" font-weight="900" fill="url(#a1)">S</text>
  <line x1="32" y1="23" x2="32" y2="28" stroke="#30363d" stroke-width="1.5" stroke-linecap="round"/>
</svg>''',

    "2-circuit-nodes-ns": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><linearGradient id="a2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#E8652B"/><stop offset="100%" style="stop-color:#ff8c42"/></linearGradient></defs>
  <rect width="64" height="64" rx="14" fill="#0d1117"/>
  <rect width="64" height="64" rx="14" fill="none" stroke="#30363d" stroke-width="1.5"/>
  <circle cx="10" cy="10" r="2" fill="#3fb950" opacity="0.6"/>
  <circle cx="54" cy="10" r="2" fill="#58a6ff" opacity="0.6"/>
  <circle cx="10" cy="54" r="2" fill="#58a6ff" opacity="0.6"/>
  <circle cx="54" cy="54" r="2" fill="#3fb950" opacity="0.6"/>
  <line x1="10" y1="10" x2="20" y2="20" stroke="#3fb950" stroke-width="1" opacity="0.3"/>
  <line x1="54" y1="10" x2="44" y2="20" stroke="#58a6ff" stroke-width="1" opacity="0.3"/>
  <line x1="10" y1="54" x2="20" y2="44" stroke="#58a6ff" stroke-width="1" opacity="0.3"/>
  <line x1="54" y1="54" x2="44" y2="44" stroke="#3fb950" stroke-width="1" opacity="0.3"/>
  <text x="14" y="44" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#e6edf3">N</text>
  <text x="36" y="44" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="url(#a2)">S</text>
</svg>''',

    "3-silhouette-ns": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><linearGradient id="a3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e6edf3"/><stop offset="50%" style="stop-color:#E8652B"/><stop offset="100%" style="stop-color:#ff8c42"/></linearGradient></defs>
  <rect width="64" height="64" rx="14" fill="#0d1117"/>
  <rect width="64" height="64" rx="14" fill="none" stroke="#30363d" stroke-width="1.5"/>
  <circle cx="32" cy="11" r="5" fill="url(#a3)" opacity="0.8"/>
  <path d="M22 8 Q18 11 22 14" fill="none" stroke="#E8652B" stroke-width="1.2" opacity="0.5"/>
  <path d="M42 8 Q46 11 42 14" fill="none" stroke="#E8652B" stroke-width="1.2" opacity="0.5"/>
  <path d="M27 16 L22 22" stroke="#8b949e" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
  <path d="M37 16 L42 22" stroke="#8b949e" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
  <text x="10" y="50" font-family="system-ui, sans-serif" font-size="30" font-weight="900" fill="#e6edf3" letter-spacing="-2">N</text>
  <text x="34" y="50" font-family="system-ui, sans-serif" font-size="30" font-weight="900" fill="#E8652B" letter-spacing="-2">S</text>
  <line x1="32" y1="24" x2="32" y2="50" stroke="#ff8c42" stroke-width="2" opacity="0.3"/>
</svg>''',

    "4-shield-ns": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><linearGradient id="a4" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#E8652B"/><stop offset="100%" style="stop-color:#ff8c42"/></linearGradient></defs>
  <rect width="64" height="64" rx="14" fill="#0d1117"/>
  <path d="M32 6 L52 16 L52 36 Q52 52 32 58 Q12 52 12 36 L12 16 Z" fill="none" stroke="url(#a4)" stroke-width="2.5"/>
  <circle cx="32" cy="22" r="4" fill="none" stroke="#3fb950" stroke-width="2"/>
  <circle cx="32" cy="22" r="1.5" fill="#3fb950"/>
  <text x="15" y="48" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#e6edf3">N</text>
  <text x="35" y="48" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="url(#a4)">S</text>
</svg>''',

    "5-pulse-ns": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><linearGradient id="a5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#E8652B"/><stop offset="100%" style="stop-color:#ff8c42"/></linearGradient></defs>
  <rect width="64" height="64" rx="14" fill="#0d1117"/>
  <rect width="64" height="64" rx="14" fill="none" stroke="#30363d" stroke-width="1.5"/>
  <circle cx="32" cy="32" r="28" fill="none" stroke="#E8652B" stroke-width="1" opacity="0.15"/>
  <circle cx="32" cy="32" r="24" fill="none" stroke="#E8652B" stroke-width="1.5" opacity="0.25"/>
  <circle cx="32" cy="12" r="4" fill="url(#a5)"/>
  <line x1="32" y1="16" x2="24" y2="22" stroke="#E8652B" stroke-width="1" opacity="0.4"/>
  <line x1="32" y1="16" x2="40" y2="22" stroke="#E8652B" stroke-width="1" opacity="0.4"/>
  <text x="12" y="48" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#e6edf3" opacity="0.9">N</text>
  <text x="32" y="48" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="url(#a5)" opacity="0.9">S</text>
</svg>''',

    "6-gear-ns": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><linearGradient id="a6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#E8652B"/><stop offset="100%" style="stop-color:#ff8c42"/></linearGradient></defs>
  <rect width="64" height="64" rx="14" fill="#0d1117"/>
  <rect width="64" height="64" rx="14" fill="none" stroke="#30363d" stroke-width="1.5"/>
  <circle cx="32" cy="14" r="6" fill="none" stroke="url(#a6)" stroke-width="2"/>
  <rect x="30" y="6" width="4" height="3" rx="1" fill="#E8652B"/>
  <rect x="30" y="19" width="4" height="3" rx="1" fill="#E8652B"/>
  <rect x="24" y="12" width="3" height="4" rx="1" fill="#E8652B"/>
  <rect x="37" y="12" width="3" height="4" rx="1" fill="#E8652B"/>
  <circle cx="32" cy="14" r="2" fill="#3fb950"/>
  <text x="10" y="50" font-family="system-ui, sans-serif" font-size="30" font-weight="900" fill="#e6edf3">N</text>
  <text x="35" y="50" font-family="system-ui, sans-serif" font-size="30" font-weight="900" fill="url(#a6)">S</text>
  <line x1="32" y1="20" x2="32" y2="26" stroke="#30363d" stroke-width="2" stroke-linecap="round"/>
</svg>''',
}

# Build an HTML page that renders all SVGs at 256px and use Playwright to screenshot each
html = '''<!DOCTYPE html><html><head><style>
body { margin: 0; background: transparent; }
.icon { width: 256px; height: 256px; display: block; }
</style></head><body>
'''
for name, svg in svgs.items():
    svg_with_size = svg.replace('viewBox="0 0 64 64">', 'viewBox="0 0 64 64" width="256" height="256">')
    html += f'<div id="{name}" class="icon">{svg_with_size}</div>\n'
html += '</body></html>'

with open(f'{out}/render.html', 'w') as f:
    f.write(html)

# Generate Playwright script
script = '''
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/favicon-options/render.html');

  const names = %s;
  for (const name of names) {
    const el = await page.locator('#' + CSS.escape(name));
    await el.screenshot({ path: `favicon-options/${name}-256.png`, omitBackground: true });
  }
  await browser.close();
  console.log('Done! Generated ' + names.length + ' PNGs');
})();
''' % json.dumps(list(svgs.keys()))

with open(f'{out}/render.js', 'w') as f:
    f.write(script)

print("Files ready. Run: node favicon-options/render.js")
