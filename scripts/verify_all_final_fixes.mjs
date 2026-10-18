import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Starting Comprehensive Fixes Verification...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:5173/#platform', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4500));

  // 1. Collaborative Suites 1 & 2 View (X: -26 to -14, Z: 8 to 20)
  console.log('1. Capturing Collaborative Breakout Suites 1 & 2...');
  await page.evaluate(() => {
    if (window.__spotSetCamera) {
      window.__spotSetCamera({ x: -20, y: 16, z: 2 }, { x: -20, y: 1.2, z: 14 });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'verify_collaborative_suites.png' });
  console.log('Saved: verify_collaborative_suites.png');

  // 2. Executive Cabins (Principal Suite & Executive Boardroom)
  console.log('2. Capturing Executive Suites (Oriented Monitors & Visitor Chairs)...');
  await page.evaluate(() => {
    if (window.__spotSetCamera) {
      window.__spotSetCamera({ x: -44, y: 14, z: -8 }, { x: -44, y: 1.0, z: -24 });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'verify_executive_pc_and_screens.png' });
  console.log('Saved: verify_executive_pc_and_screens.png');

  // 3. Promenade & Pool Wall (Showing chairs no longer clip into wall at Z = 8)
  console.log('3. Capturing Promenade & Pool Deck Divider Wall...');
  await page.evaluate(() => {
    if (window.__spotSetCamera) {
      window.__spotSetCamera({ x: 26, y: 12, z: 2 }, { x: 30, y: 1.0, z: 12 });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'verify_promenade_and_pool_wall.png' });
  console.log('Saved: verify_promenade_and_pool_wall.png');

  // 4. Fitness Gym Entrance (Showing double door is clear, screen on south wall)
  console.log('4. Capturing Fitness Gym Entrance & Equipment...');
  await page.evaluate(() => {
    if (window.__spotSetCamera) {
      window.__spotSetCamera({ x: -42, y: 14, z: 2 }, { x: -42, y: 1.5, z: 18 });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'verify_gym_door_and_screen.png' });
  console.log('Saved: verify_gym_door_and_screen.png');

  // 5. Auditorium Stadium Tiers (50 Cinema Seats)
  console.log('5. Capturing Auditorium 50-Seat Stadium Tiers...');
  await page.evaluate(() => {
    if (window.__spotSetCamera) {
      window.__spotSetCamera({ x: 10, y: 12, z: -10 }, { x: 28, y: 2.5, z: -10 });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'verify_auditorium_stadium_tiers.png' });
  console.log('Saved: verify_auditorium_stadium_tiers.png');

  // 6. Test Interactive Modals
  console.log('6. Testing Chess & Arcade widget triggers...');
  const canOpenChess = await page.evaluate(() => {
    if (window.__spotOpenChess) {
      window.__spotOpenChess();
      return true;
    }
    return false;
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'verify_chess_game_widget_open.png' });
  console.log('Saved: verify_chess_game_widget_open.png, success =', canOpenChess);

  await page.evaluate(() => {
    if (window.__spotCloseChess) window.__spotCloseChess();
    if (window.__spotOpenArcade) window.__spotOpenArcade();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'verify_arcade_game_widget_open.png' });
  console.log('Saved: verify_arcade_game_widget_open.png');

  await browser.close();
  console.log('🎉 Verification Complete!');
})();
