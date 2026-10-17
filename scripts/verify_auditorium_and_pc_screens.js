import puppeteer from 'puppeteer';

(async () => {
  console.log('Starting Auditorium and PC Screens Verification...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:5173/#platform', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4500));

  // 1. Auditorium East Wall & Single Screen Verification (No monolith behind, open skyline visible)
  console.log('1. Capturing Auditorium Single Cinema Screen (Verifying NO monolith behind)...');
  await page.evaluate(() => {
    if (window.__spotJumpToRoom) {
      window.__spotJumpToRoom('Auditorium');
    }
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'verify_auditorium_single_screen.png' });
  console.log('Saved: verify_auditorium_single_screen.png');

  // 2. Seated in Auditorium Audience (Front Row) - Centered 14m Screen View matching Image 3
  console.log('2. Seating avatar in Auditorium Audience Front Row...');
  await page.evaluate(() => {
    if (window.__spotSitOnChair) {
      window.__spotSitOnChair('Auditorium Tier 1 Seat 4');
    }
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'verify_auditorium_seated_front_row.png' });
  console.log('Saved: verify_auditorium_seated_front_row.png');

  // 3. Seated in Auditorium Audience Back Row (Tier 2) - Beautiful Overview
  console.log('3. Seating avatar in Auditorium Audience Back Row (Tier 2)...');
  await page.evaluate(() => {
    if (window.__spotSitOnChair) {
      window.__spotSitOnChair('Auditorium Tier 2 Seat 5');
    }
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'verify_auditorium_seated_back_row.png' });
  console.log('Saved: verify_auditorium_seated_back_row.png');

  // 4. Test Seat Switching (Click front seat while already seated)
  console.log('4. Switching seats while seated...');
  await page.evaluate(() => {
    if (window.__spotSitOnChair) {
      window.__spotSitOnChair('Auditorium Tier 1 Seat 5');
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'verify_seat_switch_success.png' });
  console.log('Saved: verify_seat_switch_success.png');

  // 5. Workstation PC Screens: Enlarged 34" Ultrawide Monitors in Workspace A & Focus Cubicle
  console.log('5. Capturing Enlarged 34" Ultrawide PC Workstation Monitors...');
  await page.evaluate(() => {
    if (window.__spotJumpToRoom) {
      window.__spotJumpToRoom('Workspace A');
    }
    if (window.__spotSetCamera) {
      window.__spotSetCamera({ x: -4, y: 3.2, z: 18.8 }, { x: -4, y: 1.1, z: 16.0 });
    }
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'verify_workstation_pc_screens_overview.png' });
  console.log('Saved: verify_workstation_pc_screens_overview.png');

  // 6. Deep Zoom & Showcase on PC Monitor (Crisp 2K Retina High-Def Text)
  console.log('6. Inspecting PC Monitor in Close-Up Showcase Mode...');
  await page.evaluate(() => {
    if (window.__spotShowcaseScreen) {
      window.__spotShowcaseScreen('desk_1_s_left');
    }
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'verify_pc_screen_deep_zoom.png' });
  console.log('Saved: verify_pc_screen_deep_zoom.png');

  await browser.close();
  console.log('All Auditorium and PC screens verification screenshots captured successfully!');
})();
