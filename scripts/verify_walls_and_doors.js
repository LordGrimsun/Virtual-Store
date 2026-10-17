import puppeteer from 'puppeteer';

(async () => {
  console.log('Starting Walls and Doors Verification...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:5173/#platform', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4500));

  // 1. Full Office Overview from High Above (Showing all walls and all doors)
  console.log('Capturing Full Overview of Organized Walls and Doors...');
  await page.evaluate(() => {
    if (window.__spotSetCamera) {
      window.__spotSetCamera({ x: 0, y: 44, z: 0 }, { x: 0, y: 0, z: 0 });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'verify_organized_walls_overview.png' });
  console.log('Saved: verify_organized_walls_overview.png');

  // 2. North Row: Boardroom and Meeting Cabin Doors & Glass Partition
  console.log('Capturing North Row (Boardroom & Meeting Cabin)...');
  await page.evaluate(() => {
    if (window.__spotSetCamera) {
      window.__spotSetCamera({ x: -14, y: 14, z: 4 }, { x: -14, y: 1.5, z: -10 });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'verify_north_doors_and_walls.png' });
  console.log('Saved: verify_north_doors_and_walls.png');

  // 3. South Row: Focus Cubicles 1 & 2 Enclosure & Doors
  console.log('Capturing Focus Cubicles Enclosure...');
  await page.evaluate(() => {
    if (window.__spotSetCamera) {
      window.__spotSetCamera({ x: -20, y: 12, z: 0 }, { x: -20, y: 1.2, z: 11 });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'verify_cubicles_enclosure_doors.png' });
  console.log('Saved: verify_cubicles_enclosure_doors.png');

  // 4. Workspace A Front Wall, Double Doors & Patio Glass Sliding Doors
  console.log('Capturing Workspace A & Patio Doors...');
  await page.evaluate(() => {
    if (window.__spotSetCamera) {
      window.__spotSetCamera({ x: -4, y: 15, z: -2 }, { x: -4, y: 1.5, z: 16 });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'verify_workspace_and_patio_doors.png' });
  console.log('Saved: verify_workspace_and_patio_doors.png');

  // 5. Test Walking into Boardroom via Double Doors
  console.log('Testing walking into Boardroom...');
  await page.evaluate(() => {
    if (window.__spotTeleportPlayer) {
      window.__spotTeleportPlayer(-23, -5); // Stand in front of Boardroom doors
    }
    if (window.__spotSetCamera) {
      window.__spotSetCamera({ x: -23, y: 5.5, z: 1.5 }, { x: -23, y: 1.5, z: -10 });
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  // Walk forward to trigger proximity door opening
  await page.evaluate(() => {
    if (window.__spotTeleportPlayer) {
      window.__spotTeleportPlayer(-23, -7.5);
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'verify_boardroom_door_open.png' });
  console.log('Saved: verify_boardroom_door_open.png');

  console.log('Verification completed successfully!');
  await browser.close();
})();
