const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push('PAGE ERROR: ' + err.message));

  await page.goto('https://karbon.monolithsoftware.com.tr', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Screenshot: hero
  await page.screenshot({ path: '/tmp/s1_hero.png', clip: { x:0, y:0, width:1440, height:900 } });

  // Scroll to attribution
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/s2_attribution.png', clip: { x:0, y:0, width:1440, height:900 } });

  // Scroll to problem
  await page.evaluate(() => window.scrollTo(0, 1800));
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/s3_problem.png', clip: { x:0, y:0, width:1440, height:900 } });

  // Scroll to modules
  await page.locator('#moduller').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/s4_modules.png', clip: { x:0, y:0, width:1440, height:900 } });

  // Click each module tab
  const moduleTabs = await page.locator('#moduller button').all();
  console.log(`Module tabs found: ${moduleTabs.length}`);
  for (let i = 0; i < moduleTabs.length; i++) {
    const tabText = await moduleTabs[i].textContent();
    await moduleTabs[i].click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `/tmp/s4_mod_${i}_${tabText?.trim().replace(/\s+/g,'_')}.png`, clip: { x:0, y:0, width:1440, height:900 } });
  }

  // Scroll to process
  await page.locator('#nasil-calisir').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/s5_process.png', clip: { x:0, y:0, width:1440, height:900 } });

  // Scroll to platform
  await page.locator('#platform').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/s6_platform.png', clip: { x:0, y:0, width:1440, height:900 } });

  // Click admin tab
  const platformButtons = await page.locator('#platform button').all();
  console.log(`Platform tabs found: ${platformButtons.length}`);
  if (platformButtons.length > 1) {
    await platformButtons[1].click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: '/tmp/s6b_platform_admin.png', clip: { x:0, y:0, width:1440, height:900 } });
  }

  // Scroll to plastik
  await page.locator('#plastik-sektoru').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/s7_plastik.png', clip: { x:0, y:0, width:1440, height:900 } });

  // Scroll to monolith
  await page.locator('#monolith').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/s8_monolith.png', clip: { x:0, y:0, width:1440, height:900 } });

  // Scroll to CTA
  await page.locator('#iletisim').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/s9_cta.png', clip: { x:0, y:0, width:1440, height:900 } });

  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/s10_footer.png', clip: { x:0, y:0, width:1440, height:900 } });

  // Mobile view check
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('https://karbon.monolithsoftware.com.tr', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/s_mobile_hero.png', clip: { x:0, y:0, width:390, height:844 } });

  // Scroll mobile to modules
  await page.locator('#moduller').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/tmp/s_mobile_modules.png', clip: { x:0, y:0, width:390, height:844 } });

  // Check h2 visibility after scroll
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('https://karbon.monolithsoftware.com.tr', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(500);
  
  // Scroll slowly and check h2 opacity
  console.log('\n--- H2 visibility check (scrolling through page) ---');
  const sections = ['#moduller h2', '#nasil-calisir h2', '#platform h2', '#plastik-sektoru h2', '#monolith h2', '#iletisim h2'];
  for (const sel of sections) {
    await page.locator(sel).first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    const opacity = await page.evaluate((s) => {
      const el = document.querySelector(s);
      return el ? window.getComputedStyle(el).opacity : 'NOT FOUND';
    }, sel);
    console.log(`  ${sel}: opacity=${opacity}`);
  }

  // Check bar chart bars
  console.log('\n--- Bar chart bars ---');
  await page.goto('https://karbon.monolithsoftware.com.tr', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  const barCount = await page.evaluate(() => document.querySelectorAll('.bar-inner').length);
  console.log(`  .bar-inner count: ${barCount}`);
  if (barCount > 0) {
    const firstBarTransform = await page.evaluate(() => {
      const el = document.querySelector('.bar-inner');
      return el ? window.getComputedStyle(el).transform : 'N/A';
    });
    console.log(`  First bar transform: ${firstBarTransform}`);
  }

  // Check header scroll behavior
  console.log('\n--- Header scroll check ---');
  const headerBefore = await page.evaluate(() => {
    const h = document.querySelector('header');
    return h ? window.getComputedStyle(h).backgroundColor : 'N/A';
  });
  console.log(`  Header bg before scroll: ${headerBefore}`);
  await page.evaluate(() => window.scrollTo(0, 200));
  await page.waitForTimeout(300);
  const headerAfter = await page.evaluate(() => {
    const h = document.querySelector('header');
    return h ? window.getComputedStyle(h).backgroundColor : 'N/A';
  });
  console.log(`  Header bg after scroll: ${headerAfter}`);

  console.log('\n--- All errors ---');
  errors.forEach(e => console.log('  ERROR:', e));
  if (!errors.length) console.log('  (none)');

  await browser.close();
  console.log('\nDone. Screenshots in /tmp/');
})();
