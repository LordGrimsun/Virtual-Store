import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Starting Toolbar & Map Verification...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:5173/#platform', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4500));

  // 1. Capture Top-Right Floating Toolbar (showing 8 clean, non-overlapping buttons)
  console.log('1. Capturing unified non-overlapping top-right toolbar...');
  await page.screenshot({ path: 'verify_unified_toolbar_full.png' });

  // Close-up clip of the top-right toolbar area
  await page.screenshot({
    path: 'verify_unified_toolbar_close.png',
    clip: { x: 1050, y: 0, width: 550, height: 140 }
  });
  console.log('Saved: verify_unified_toolbar_close.png');

  // 2. Click the Interactive Campus Map button in the toolbar
  console.log('2. Clicking Campus Map button in toolbar...');
  const mapBtnClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const mapBtn = btns.find(b => b.title && b.title.includes('Campus Map'));
    if (mapBtn) {
      mapBtn.click();
      return true;
    }
    return false;
  });
  console.log('Map button clicked:', mapBtnClicked);
  await new Promise(r => setTimeout(r, 1200));

  // Capture open Campus Map modal
  await page.screenshot({ path: 'verify_campus_map_modal_open.png' });
  console.log('Saved: verify_campus_map_modal_open.png');

  // 3. Test teleporting via Map modal quick button (e.g., Auditorium)
  console.log('3. Teleporting to Auditorium via Map modal quick button...');
  const teleportClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const audBtn = btns.find(b => b.textContent && b.textContent.includes('Auditorium'));
    if (audBtn) {
      audBtn.click();
      return true;
    }
    return false;
  });
  console.log('Teleport button clicked:', teleportClicked);
  await new Promise(r => setTimeout(r, 1500));

  // 4. Capture the elevated Radar Minimap HUD in the bottom-right (above the 52px bottom dock)
  console.log('4. Capturing elevated Radar Minimap HUD...');
  await page.screenshot({
    path: 'verify_elevated_minimap_hud.png',
    clip: { x: 1350, y: 780, width: 250, height: 220 }
  });
  console.log('Saved: verify_elevated_minimap_hud.png');

  // 5. Test pressing 'M' key to toggle map
  console.log('5. Testing "M" keyboard shortcut to open map...');
  await page.keyboard.press('KeyM');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'verify_map_keyboard_shortcut.png' });
  console.log('Saved: verify_map_keyboard_shortcut.png');

  await browser.close();
  console.log('🎉 Toolbar & Map Verification Complete!');
})();
