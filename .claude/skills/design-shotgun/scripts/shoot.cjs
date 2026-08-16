#!/usr/bin/env node
/**
 * design-shotgun — vyrenderuj statické HTML náhľady na screenshoty (desktop + mobil).
 *
 * Použitie:
 *   NODE_PATH="$(npm root -g)" node shoot.cjs <priecinok_s_variant-*.html> [glob]
 *
 * Renderuje každý súbor `variant-*.html` (alebo <glob>) v priečinku a uloží
 * vedľa neho `<nazov>.desktop.png` a `<nazov>.mobile.png`.
 *
 * Cloud: používa GLOBÁLNE nainštalovaný Playwright (`require('playwright')` cez
 * NODE_PATH) + predinštalovaný Chromium (PLAYWRIGHT_BROWSERS_PATH). Žiadny
 * `npm install`, žiadny `playwright install`, žiadny Bun.
 */
const fs = require('fs');
const path = require('path');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (e) {
  console.error(
    'CHYBA: nenašiel sa balík `playwright`. Spusti skript s NODE_PATH na globálne moduly:\n' +
    '  NODE_PATH="$(npm root -g)" node ' + path.basename(__filename) + ' <priecinok>'
  );
  process.exit(1);
}

const dir = process.argv[2];
const pattern = process.argv[3] || '^variant-.*\\.html$';
if (!dir || !fs.existsSync(dir)) {
  console.error('CHYBA: zadaj existujúci priečinok s HTML náhľadmi. Napr.:\n' +
    '  NODE_PATH="$(npm root -g)" node shoot.cjs frontend/.design-shotgun/hero');
  process.exit(1);
}

const re = new RegExp(pattern);
const files = fs.readdirSync(dir).filter((f) => re.test(f)).sort();
if (files.length === 0) {
  console.error(`CHYBA: v ${dir} nie sú žiadne súbory podľa vzoru /${pattern}/`);
  process.exit(1);
}

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

(async () => {
  const browser = await chromium.launch();
  try {
    for (const file of files) {
      const abs = path.resolve(dir, file);
      const base = file.replace(/\.html$/, '');
      for (const vp of VIEWPORTS) {
        const page = await browser.newPage({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: 2,
        });
        await page.goto('file://' + abs, { waitUntil: 'networkidle' });
        // krátka pauza na dobehnutie prípadných CSS animácií/fontov
        await page.waitForTimeout(250);
        const out = path.join(dir, `${base}.${vp.name}.png`);
        await page.screenshot({ path: out, fullPage: true });
        await page.close();
        console.log('OK', path.relative(process.cwd(), out));
      }
    }
  } finally {
    await browser.close();
  }
  console.log(`\nHotovo: ${files.length} variantov × ${VIEWPORTS.length} viewportov.`);
})().catch((err) => {
  console.error('CHYBA pri renderovaní:', err.message);
  process.exit(1);
});
