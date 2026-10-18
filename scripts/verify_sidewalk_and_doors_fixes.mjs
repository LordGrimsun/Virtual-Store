import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
  console.log('🚀 Starting Sidewalk & Doors Verification...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR STACK:', err.stack || err.message));

  await page.goto('http://localhost:5173/#platform', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4500));

  const teleport = async (x, z) => {
    await page.evaluate((tx, tz) => {
      if (window.__spotTeleportPlayer) {
        window.__spotTeleportPlayer(tx, tz);
      }
    }, x, z);
    await new Promise(r => setTimeout(r, 1200));
  };

  const artifactDir = 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3';

  // 1. Executive Cabins Corridor: Verify Grand Glass Double Doors and parquet floor free of white sidewalk
  console.log('1. Teleporting to Executive Cabins corridor (-45, -24)...');
  await teleport(-45, -24);
  const shot1 = 'verify_executive_corridor_double_doors.png';
  await page.screenshot({ path: shot1 });
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(shot1, path.join(artifactDir, shot1));
  }
  console.log(`Saved: ${shot1}`);

  // 2. Inside CEO Suite: Verify 11m+ clearance from entrance glass double door to desk
  console.log('2. Teleporting inside CEO Suite (-52.25, -34)...');
  await teleport(-52.25, -34);
  const shot2 = 'verify_ceo_suite_11m_clearance.png';
  await page.screenshot({ path: shot2 });
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(shot2, path.join(artifactDir, shot2));
  }
  console.log(`Saved: ${shot2}`);

  // 3. Inside VP Suite: Verify spacious entrance clearance & deep desk position
  console.log('3. Teleporting inside VP Suite (-39.25, -34)...');
  await teleport(-39.25, -34);
  const shot3 = 'verify_vp_suite_11m_clearance.png';
  await page.screenshot({ path: shot3 });
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(shot3, path.join(artifactDir, shot3));
  }
  console.log(`Saved: ${shot3}`);

  // 4. Auditorium Corridor: Verify NO white road, street trees, or hedges cutting next to stadium tiers
  console.log('4. Teleporting behind/beside Auditorium (10, -22)...');
  await teleport(10, -22);
  const shot4 = 'verify_auditorium_corridor_clean.png';
  await page.screenshot({ path: shot4 });
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(shot4, path.join(artifactDir, shot4));
  }
  console.log(`Saved: ${shot4}`);

  await browser.close();
  console.log('✅ Sidewalk & doors verification finished!');
})();
