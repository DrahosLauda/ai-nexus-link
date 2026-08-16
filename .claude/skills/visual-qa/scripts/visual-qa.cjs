#!/usr/bin/env node
/**
 * visual-qa — preklikaj bežiaci frontend, odfoť desktop/tablet/mobil a odmeraj
 * vizuálne veci, ktoré statická kontrola nechytí.
 *
 * Použitie:
 *   NODE_PATH="$(npm root -g)" node visual-qa.cjs \
 *     --base http://localhost:4123 \
 *     --routes /ukazky,/ukazky/kvetinarstvo,/ukazky/kvetinarstvo/kontakt \
 *     --out /tmp/visual-qa-out
 *
 * Výstup: screenshoty `<cesta>__<viewport>.png` + `findings.json` v --out.
 * Cloud: GLOBÁLNY Playwright (`require('playwright')` cez NODE_PATH) +
 * predinštalovaný Chromium. Žiadny npm install, žiadny playwright install, žiadny Bun.
 */
const fs = require('fs');
const path = require('path');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (e) {
  console.error(
    'CHYBA: nenašiel sa balík `playwright`. Spusti s NODE_PATH na globálne moduly:\n' +
    '  NODE_PATH="$(npm root -g)" node visual-qa.cjs --base <url> --routes <cesty> --out <priecinok>'
  );
  process.exit(1);
}

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const base = (arg('base', 'http://localhost:4123')).replace(/\/$/, '');
const routes = arg('routes', '/ukazky').split(',').map((r) => r.trim()).filter(Boolean);
const out = arg('out', '/tmp/visual-qa-out');
fs.mkdirSync(out, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

const slug = (r) => (r === '/' ? 'root' : r.replace(/^\//, '').replace(/\//g, '_')) || 'root';

(async () => {
  const browser = await chromium.launch();
  const findings = [];

  for (const route of routes) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });
      const consoleErrors = [];
      const badResponses = [];
      page.on('pageerror', (err) => consoleErrors.push(String(err.message || err)));
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('response', (res) => {
        if (res.status() >= 400) badResponses.push(res.status() + ' ' + res.url());
      });

      const url = base + route;
      let ok = true;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch (e) {
        ok = false;
        findings.push({ route, viewport: vp.name, severity: 'blocker', check: 'load',
          detail: 'Stránka sa nenačítala: ' + e.message });
      }

      if (ok) {
        await page.waitForTimeout(300);

        const metrics = await page.evaluate(() => {
          const de = document.documentElement;
          const horizontal =
            de.scrollWidth > de.clientWidth + 1 || document.body.scrollWidth > de.clientWidth + 1;
          const overflowBy = Math.max(de.scrollWidth, document.body.scrollWidth) - de.clientWidth;
          const h1s = document.querySelectorAll('h1').length;
          const imgs = Array.from(document.images);
          const broken = imgs
            .filter((img) => img.complete && img.naturalWidth === 0)
            .map((img) => img.currentSrc || img.src || '(bez src)');
          return { horizontal, overflowBy, h1s, imgCount: imgs.length, broken };
        });

        // fokus: po prvom Tab-e over, či je viditeľný outline/box-shadow
        let focusVisible = null;
        try {
          await page.keyboard.press('Tab');
          focusVisible = await page.evaluate(() => {
            const el = document.activeElement;
            if (!el || el === document.body) return null;
            const s = getComputedStyle(el);
            const has =
              (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) ||
              (s.boxShadow && s.boxShadow !== 'none');
            return { tag: el.tagName.toLowerCase(), visible: has };
          });
        } catch (_) { /* ignoruj */ }

        const shot = path.join(out, `${slug(route)}__${vp.name}.png`);
        await page.screenshot({ path: shot, fullPage: true });

        if (metrics.horizontal) {
          findings.push({ route, viewport: vp.name, severity: 'blocker', check: 'horizontal-scroll',
            detail: `Horizontálny scroll / pretečenie o ~${metrics.overflowBy}px.`, screenshot: shot });
        }
        if (metrics.h1s !== 1) {
          findings.push({ route, viewport: vp.name, severity: 'major', check: 'h1-count',
            detail: `Počet <h1> = ${metrics.h1s} (má byť 1).`, screenshot: shot });
        }
        if (metrics.broken.length) {
          findings.push({ route, viewport: vp.name, severity: 'major', check: 'broken-images',
            detail: `Rozbité obrázky (${metrics.broken.length}): ${metrics.broken.slice(0, 5).join(' | ')}`, screenshot: shot });
        }
        if (consoleErrors.length) {
          findings.push({ route, viewport: vp.name, severity: 'major', check: 'console-errors',
            detail: `Chyby v konzole (${consoleErrors.length}): ${consoleErrors.slice(0, 5).join(' | ')}` });
        }
        if (badResponses.length) {
          findings.push({ route, viewport: vp.name, severity: 'major', check: 'failed-requests',
            detail: `Zlyhané requesty (${badResponses.length}): ${badResponses.slice(0, 5).join(' | ')}` });
        }
        if (focusVisible && focusVisible.visible === false) {
          findings.push({ route, viewport: vp.name, severity: 'minor', check: 'focus-visible',
            detail: `Prvý fokusovateľný prvok (<${focusVisible.tag}>) nemá viditeľný fokus (outline/box-shadow).` });
        }

        console.log(`OK ${route} @ ${vp.name}  h1=${metrics.h1s} imgs=${metrics.imgCount}` +
          `${metrics.horizontal ? ' HSCROLL!' : ''}${consoleErrors.length ? ' CONSOLE-ERR!' : ''}`);
      }

      await page.close();
    }
  }

  await browser.close();

  const summary = {
    base, routes, viewports: VIEWPORTS.map((v) => v.name),
    total_findings: findings.length,
    blockers: findings.filter((f) => f.severity === 'blocker').length,
    findings,
  };
  const jsonPath = path.join(out, 'findings.json');
  fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2));
  console.log(`\nHotovo. Nálezov: ${findings.length} (blokery: ${summary.blockers}). ` +
    `Report: ${jsonPath}\nScreenshoty: ${out}`);
})().catch((err) => {
  console.error('CHYBA pri QA:', err.message);
  process.exit(1);
});
