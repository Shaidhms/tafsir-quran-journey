#!/bin/bash
cd "$(dirname "$0")"

# Create individual HTML files for each SVG option, then screenshot them
NAMES=("1-agent-head-ns" "2-circuit-nodes-ns" "3-silhouette-ns" "4-shield-ns" "5-pulse-ns" "6-gear-ns")

for name in "${NAMES[@]}"; do
  # Create a minimal HTML that just shows the SVG at 256x256
  cat > "favicon-options/${name}.html" << 'HTMLEOF'
<!DOCTYPE html><html><head><style>
body { margin: 0; padding: 0; width: 256px; height: 256px; overflow: hidden; }
svg { width: 256px; height: 256px; }
</style></head><body>
HTMLEOF

  # Extract SVG from render.html
  python3 -c "
import re
with open('favicon-options/render.html') as f:
    html = f.read()
match = re.search(r'id=\"${name}\"[^>]*>(.*?)</div>', html, re.DOTALL)
if match:
    print(match.group(1))
" >> "favicon-options/${name}.html"

  echo '</body></html>' >> "favicon-options/${name}.html"

  # Screenshot at 256px
  npx playwright screenshot --browser chromium --viewport-size="256,256" "file://$(pwd)/favicon-options/${name}.html" "favicon-options/${name}-256.png" 2>/dev/null
  echo "Generated: ${name}-256.png"
done

echo "Done!"
