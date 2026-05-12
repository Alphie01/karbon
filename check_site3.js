const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push('PAGE ERROR: ' + err.message));

  console.log('Loading site...');
  await page.goto('https://karbon.monolithsoftware.com.tr', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2500);

  // Helper: scroll #main-scroll to a pixel offset (window.scrollTo doesn't work — scroll happens inside this div)
  const scrollTo = (px) => page.evaluate((y) => {
    const el = document.getElementById('main-scroll');
    if (el) el.scrollTop = y;
    else window.scrollTo(0, y); // fallback
  }, px);

  const scrollIntoView = (sel) => page.evaluate((s) => {
    const el = document.querySelector(s);
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  }, sel);

  // ── Hero ─────────────────────────────────────────────────────
  await page.screenshot({ path: '/tmp/v3_hero.png', clip: { x:0, y:0, width:1440, height:900 } });
  console.log('✓ hero screenshot');

  // ── Check hero animations ─────────────────────────────────────
  await page.waitForTimeout(1500); // let hero timeline finish
  const heroOpacities = await page.evaluate(() => {
    const sel = ['.hero-eyebrow', '.hero-title', '.hero-body', '.hero-dash'];
    return sel.map(s => {
      const el = document.querySelector(s);
      return { sel: s, opacity: el ? getComputedStyle(el).opacity : 'missing' };
    });
  });
  console.log('\n--- Hero animation state (should all be ~1) ---');
  heroOpacities.forEach(r => console.log(`  ${r.sel}: opacity=${r.opacity}`));

  // ── Scroll to modules ────────────────────────────────────────
  await scrollIntoView('#moduller');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/tmp/v3_modules.png', clip: { x:0, y:0, width:1440, height:900 } });
  console.log('\n✓ modules screenshot');

  // Check h2 in modules
  const modH2Opacity = await page.evaluate(() => {
    const el = document.querySelector('#moduller h2');
    return el ? getComputedStyle(el).opacity : 'missing';
  });
  console.log(`  #moduller h2 opacity: ${modH2Opacity} (should be ~1)`);

  // Check bar charts
  const barState = await page.evaluate(() => {
    const bars = document.querySelectorAll('.bar-inner');
    if (!bars.length) return { count: 0 };
    const first = bars[0];
    const style = getComputedStyle(first);
    return {
      count: bars.length,
      transform: style.transform,
      opacity: style.opacity,
    };
  });
  console.log(`  .bar-inner count: ${barState.count}`);
  console.log(`  first bar transform: ${barState.transform} (should NOT be matrix with scaleY=0)`);

  // Click all module tabs
  const moduleTabs = await page.locator('#moduller button').all();
  console.log(`  Module tabs found: ${moduleTabs.length}`);
  for (let i = 0; i < moduleTabs.length; i++) {
    const label = await moduleTabs[i].textContent();
    await moduleTabs[i].click();
    await page.waitForTimeout(500);
    const barStateAfter = await page.evaluate(() => {
      const bars = document.querySelectorAll('.bar-inner');
      if (!bars.length) return { count: 0, transform: 'N/A' };
      return { count: bars.length, transform: getComputedStyle(bars[0]).transform };
    });
    await page.screenshot({ path: `/tmp/v3_mod_${i}.png`, clip: { x:0, y:0, width:1440, height:900 } });
    console.log(`  Tab "${label?.trim()}": bars=${barStateAfter.count}, transform=${barStateAfter.transform}`);
  }

  // ── Scroll to process ────────────────────────────────────────
  await scrollIntoView('#nasil-calisir');
  await page.waitForTimeout(1500);
  const processH2 = await page.evaluate(() => {
    const el = document.querySelector('#nasil-calisir h2');
    return el ? getComputedStyle(el).opacity : 'missing';
  });
  console.log(`\n  #nasil-calisir h2 opacity: ${processH2} (should be ~1)`);
  await page.screenshot({ path: '/tmp/v3_process.png', clip: { x:0, y:0, width:1440, height:900 } });

  // ── Scroll to platform ───────────────────────────────────────
  await scrollIntoView('#platform');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/tmp/v3_platform.png', clip: { x:0, y:0, width:1440, height:900 } });
  const platformH2 = await page.evaluate(() => {
    const el = document.querySelector('#platform h2');
    return el ? getComputedStyle(el).opacity : 'missing';
  });
  console.log(`  #platform h2 opacity: ${platformH2} (should be ~1)`);

  // Platform tab switch
  const platformBtns = await page.locator('#platform button').all();
  if (platformBtns.length > 1) {
    await platformBtns[1].click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: '/tmp/v3_platform_admin.png', clip: { x:0, y:0, width:1440, height:900 } });
    console.log('  ✓ platform admin tab clicked');
  }

  // ── Remaining sections ───────────────────────────────────────
  for (const [id, label] of [['#plastik-sektoru','plastik'], ['#monolith','monolith'], ['#iletisim','cta']]) {
    await scrollIntoView(id);
    await page.waitForTimeout(1000);
    const h2Op = await page.evaluate((s) => {
      const el = document.querySelector(s + ' h2');
      return el ? getComputedStyle(el).opacity : 'missing';
    }, id);
    console.log(`  ${id} h2 opacity: ${h2Op}`);
    await page.screenshot({ path: `/tmp/v3_${label}.png`, clip: { x:0, y:0, width:1440, height:900 } });
  }

  // ── Mobile ───────────────────────────────────────────────────
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('https://karbon.monolithsoftware.com.tr', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/v3_mobile_hero.png', clip: { x:0, y:0, width:390, height:844 } });
  await page.evaluate(() => {
    const el = document.getElementById('main-scroll');
    if (el) el.scrollTop = 800;
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/v3_mobile_scroll.png', clip: { x:0, y:0, width:390, height:844 } });
  console.log('\n✓ mobile screenshots done');

  // ── JS errors ────────────────────────────────────────────────
  console.log('\n--- Console errors ---');
  if (errors.length) errors.forEach(e => console.log('  ERROR:', e));
  else console.log('  (none)');

  await browser.close();
  console.log('\nDone. Screenshots saved to /tmp/v3_*.png');
})();
