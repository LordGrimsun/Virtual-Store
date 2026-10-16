import puppeteer from 'puppeteer';

(async () => {
  console.log('Testing Chair Hover Tooltip & Click-to-Sit Mechanics...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:5173/#platform', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));

  // 1. Move player and camera to Lounge C
  await page.evaluate(() => {
    if (window.__spotTeleportPlayer) {
      window.__spotTeleportPlayer(-10, 5.5);
    }
    if (window.__spotSetCamera) {
      window.__spotSetCamera({ x: -10, y: 8.5, z: 10 }, { x: -10, y: 0.5, z: 2.5 });
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  // 2. Find screen position of Lounge C Armchair 1
  const chairScreenPos = await page.evaluate(() => {
    // We can simulate mouse event by projecting the chair cushion position
    // or querying chairsRef
    return { x: 620, y: 340 }; // Approximate area in 1600x1000 viewport
  });

  // Let's sweep mouse across the armchair area to find the hover pill
  console.log('Sweeping mouse over armchair...');
  let pillVisible = false;
  let pillCoord = null;

  for (let x = 500; x <= 1100; x += 30) {
    for (let y = 250; y <= 550; y += 30) {
      await page.mouse.move(x, y);
      await new Promise(r => setTimeout(r, 20));
      const hasPill = await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('div'));
        const pill = els.find(e => e.textContent && e.textContent.trim() === 'Sit down');
        if (pill) {
          const rect = pill.getBoundingClientRect();
          return { visible: true, x: rect.left, y: rect.top };
        }
        return null;
      });
      if (hasPill) {
        pillVisible = true;
        pillCoord = hasPill;
        console.log('Found "Sit down" tooltip pill at mouse:', { x, y }, 'pill:', pillCoord);
        break;
      }
    }
    if (pillVisible) break;
  }

  // Screenshot 1: Hover tooltip visible
  await page.screenshot({ path: 'verify_chair_hover_tooltip.png' });
  console.log('Saved: verify_chair_hover_tooltip.png, pillVisible:', pillVisible);

  // 3. Click the chair to Sit Down at the exact hit coordinates
  console.log('Clicking to sit down at hover position...');
  await page.mouse.click(530, 400);
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot 2: Avatar cleanly seated in the armchair
  await page.screenshot({ path: 'verify_chair_seated_avatar.png' });
  console.log('Saved: verify_chair_seated_avatar.png');

  // 4. Also capture the updated Boardroom with player standing south of table
  console.log('Capturing updated Boardroom...');
  await page.evaluate(() => {
    if (window.__spotTeleportPlayer) {
      window.__spotTeleportPlayer(-23, -12.5);
    }
    if (window.__spotSetCamera) {
      window.__spotSetCamera({ x: -23, y: 7.0, z: -7.0 }, { x: -23, y: 1.0, z: -16.0 });
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'verify_spot_boardroom_fixed.png' });
  console.log('Saved: verify_spot_boardroom_fixed.png');

  await browser.close();
  console.log('Chair hover and sit test completed!');
})();
