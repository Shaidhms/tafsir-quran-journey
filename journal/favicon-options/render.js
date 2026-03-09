
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/favicon-options/render.html');

  const names = ["1-agent-head-ns", "2-circuit-nodes-ns", "3-silhouette-ns", "4-shield-ns", "5-pulse-ns", "6-gear-ns"];
  for (const name of names) {
    const el = await page.locator('#' + CSS.escape(name));
    await el.screenshot({ path: `favicon-options/${name}-256.png`, omitBackground: true });
  }
  await browser.close();
  console.log('Done! Generated ' + names.length + ' PNGs');
})();
