import puppeteer from 'puppeteer';

(async () => {
  console.log('Starting Full Spot Layout Visual Verification...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      '--auto-select-desktop-capture-source=Entire screen'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

  console.log('Navigating to http://localhost:5173/#platform...');
  await page.goto('http://localhost:5173/#platform', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4500));

  // 1. Full Office Top-Down Overview (matching media_1792165933867.png)
  console.log('Capturing Full Office Overview...');
  await page.evaluate(() => {
    if (window.__spotSetCamera) {
      // Position camera high above center looking down
      window.__spotSetCamera({ x: 0, y: 38, z: 2 }, { x: 0, y: 0, z: -2 });
    }
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'verify_spot_overview_layout.png' });
  console.log('Saved: verify_spot_overview_layout.png');

  // 2. Auditorium Close-Up (matching media_1792165933914.png)
  console.log('Capturing Auditorium View...');
  await page.evaluate(() => {
    if (window.__spotSetCamera) {
      // In front of stepped seating facing East towards cinema screen
      window.__spotSetCamera({ x: 10, y: 7.5, z: -10 }, { x: 31.65, y: 4.4, z: -10 });
    }
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'verify_spot_auditorium_layout.png' });
  console.log('Saved: verify_spot_auditorium_layout.png');

  // 3. Meeting Cabin Close-Up (matching media_1792165933956.png)
  console.log('Capturing Meeting Cabin View...');
  await page.evaluate(() => {
    if (window.__spotSetCamera) {
      window.__spotSetCamera({ x: -4, y: 5.5, z: -9.5 }, { x: -4, y: 1.0, z: -16 });
    }
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'verify_spot_meeting_cabin_layout.png' });
  console.log('Saved: verify_spot_meeting_cabin_layout.png');

  // 4. Lounge C Concourse with 3-Disc Cluster and Hover Tooltip (matching media_1792165947435.png)
  console.log('Capturing Lounge C Concourse View with Sit Down Tooltip...');
  await page.evaluate(() => {
    if (window.__spotSetCamera) {
      window.__spotSetCamera({ x: -10, y: 8.5, z: 9 }, { x: -10, y: 0.5, z: 3.5 });
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  // Hover near the sofa / armchair to trigger hoveredSitPill
  const viewCenter = { x: 800, y: 500 };
  await page.mouse.move(viewCenter.x, viewCenter.y);
  await new Promise(r => setTimeout(r, 500));
  // Try moving around center area to hit a chair
  for (let dx = -100; dx <= 100; dx += 40) {
    for (let dy = -100; dy <= 100; dy += 40) {
      await page.mouse.move(viewCenter.x + dx, viewCenter.y + dy);
      await new Promise(r => setTimeout(r, 50));
    }
  }
  await page.screenshot({ path: 'verify_spot_lounge_c_layout.png' });
  console.log('Saved: verify_spot_lounge_c_layout.png');

  // 5. Boardroom View
  console.log('Capturing Boardroom View...');
  await page.evaluate(() => {
    if (window.__spotSetCamera) {
      window.__spotSetCamera({ x: -23, y: 6.5, z: -9.5 }, { x: -23, y: 1.0, z: -16 });
    }
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'verify_spot_boardroom_layout.png' });
  console.log('Saved: verify_spot_boardroom_layout.png');

  // 6. East Window Promenade View
  console.log('Capturing East Window Promenade...');
  await page.evaluate(() => {
    if (window.__spotSetCamera) {
      window.__spotSetCamera({ x: 26, y: 5.0, z: 5 }, { x: 29.5, y: 1.0, z: 18 });
    }
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'verify_spot_east_promenade_layout.png' });
  console.log('Saved: verify_spot_east_promenade_layout.png');

  console.log('Layout visual verification completed!');
  await browser.close();
})();
