const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  const consoleErrors = [];
  const consoleWarnings = [];
  const networkErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
    if (msg.type() === 'warning') consoleWarnings.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push('PAGE ERROR: ' + err.message));
  page.on('requestfailed', req => networkErrors.push(`NETWORK FAIL: ${req.url()} — ${req.failure()?.errorText}`));

  console.log('=== Navigating to homepage ===');
  await page.goto('https://karbon.monolithsoftware.com.tr', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log('\n--- Page Title ---');
  console.log(await page.title());

  console.log('\n--- URL ---');
  console.log(page.url());

  console.log('\n--- Console Errors ---');
  consoleErrors.forEach(e => console.log('  ERROR:', e));
  if (!consoleErrors.length) console.log('  (none)');

  console.log('\n--- Console Warnings ---');
  consoleWarnings.slice(0,10).forEach(w => console.log('  WARN:', w));
  if (!consoleWarnings.length) console.log('  (none)');

  console.log('\n--- Network Failures ---');
  networkErrors.forEach(e => console.log(' ', e));
  if (!networkErrors.length) console.log('  (none)');

  // Take a screenshot
  await page.screenshot({ path: '/tmp/homepage_full.png', fullPage: false });
  console.log('\n--- Screenshot saved to /tmp/homepage_full.png ---');

  // Check key visual elements
  console.log('\n--- Element checks ---');
  const checks = [
    { sel: 'header', name: 'Header' },
    { sel: '#top', name: 'Hero section' },
    { sel: '.hero-title', name: 'Hero title (h1.hero-title)' },
    { sel: '.hero-eyebrow', name: 'Hero eyebrow' },
    { sel: '.hero-dash', name: 'Hero dashboard' },
    { sel: '.marquee-track', name: 'Marquee' },
    { sel: '#moduller', name: 'Modules section' },
    { sel: '#platform', name: 'Platform section' },
    { sel: 'footer', name: 'Footer' },
  ];
  for (const c of checks) {
    const el = page.locator(c.sel).first();
    const visible = await el.isVisible().catch(() => false);
    console.log(`  ${visible ? '✓' : '✗'} ${c.name} (${c.sel})`);
  }

  // Check opacity of hero elements (they should be > 0 after animation)
  console.log('\n--- Hero element opacity (after 3s, should be ~1) ---');
  const heroEls = ['.hero-eyebrow', '.hero-title', '.hero-body', '.hero-dash'];
  for (const sel of heroEls) {
    const opacity = await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) return 'NOT FOUND';
      return window.getComputedStyle(el).opacity;
    }, sel);
    console.log(`  ${sel}: opacity=${opacity}`);
  }

  await browser.close();
})();
