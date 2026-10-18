import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Starting Market Hall & Fixes Verification...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR STACK:', err.stack || err.message));

  await page.goto('http://localhost:5173/#platform', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 5000));

  // Helper to teleport player via window.__spotTeleportPlayer
  const teleport = async (x, z) => {
    await page.evaluate((tx, tz) => {
      if (window.__spotTeleportPlayer) {
        window.__spotTeleportPlayer(tx, tz);
      }
    }, x, z);
    await new Promise(r => setTimeout(r, 1200));
  };

  // 1. Verify Executive Cabins (Hill is gone!)
  console.log('1. Teleporting to Executive Cabins...');
  await teleport(-45, -25);
  await page.screenshot({ path: 'verify_executive_cabins_no_hill.png' });
  console.log('Saved: verify_executive_cabins_no_hill.png');

  // 2. Verify Concourse Front Doors on both rooms along Z = 8
  console.log('2. Teleporting to Central Concourse facing Z = 8...');
  await teleport(-14, 4);
  await page.screenshot({ path: 'verify_concourse_both_front_doors.png' });
  console.log('Saved: verify_concourse_both_front_doors.png');

  // 3. Verify Arcade & Gym (Clear of sidewalk, street trees, and park benches)
  console.log('3. Teleporting to Retro Arcade & Game Zone...');
  await teleport(-9, 33);
  await page.screenshot({ path: 'verify_arcade_zone_no_sidewalk.png' });
  console.log('Saved: verify_arcade_zone_no_sidewalk.png');

  // 4. Verify Grand Event Market & Bazaar Hall behind Auditorium
  console.log('4. Teleporting to Grand Event Market & Bazaar Hall Center Plaza (X: 45, Z: -20)...');
  await teleport(45, -20);
  await page.screenshot({ path: 'verify_market_hall_center_plaza.png' });
  console.log('Saved: verify_market_hall_center_plaza.png');

  // Teleport deeper north into Market Hall to capture stalls 1-4
  console.log('5. Capturing North stalls (Coffee, Bakery, Electronics, Groceries)...');
  await teleport(45, -34);
  await page.screenshot({ path: 'verify_market_hall_north_stalls.png' });
  console.log('Saved: verify_market_hall_north_stalls.png');

  // Teleport south in Market Hall to capture stalls 5-8
  console.log('6. Capturing South stalls (Swag, Street Food, Books, Botanical Plants)...');
  await teleport(45, -8);
  await page.screenshot({ path: 'verify_market_hall_south_stalls.png' });
  console.log('Saved: verify_market_hall_south_stalls.png');

  // 7. Click a market stall to trigger shopping toast
  console.log('7. Clicking Artisan Coffee stall...');
  const clickedStall = await page.evaluate(() => {
    // Dispatch click on the canvas centered on the coffee stall
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const clickEvt = new MouseEvent('click', {
        clientX: rect.left + rect.width * 0.35,
        clientY: rect.top + rect.height * 0.5,
        bubbles: true
      });
      canvas.dispatchEvent(clickEvt);
      return true;
    }
    return false;
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'verify_market_stall_toast.png' });
  console.log('Saved: verify_market_stall_toast.png');

  // 8. Open Campus Map Modal to verify Grand Market Hall zone and teleport button
  console.log('8. Opening Campus Map Modal...');
  await page.keyboard.press('KeyM');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'verify_campus_map_with_market_hall.png' });
  console.log('Saved: verify_campus_map_with_market_hall.png');

  await browser.close();
  console.log('✅ All verification steps completed successfully!');
})();
