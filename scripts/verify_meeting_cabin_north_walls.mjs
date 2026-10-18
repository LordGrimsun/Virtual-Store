import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
  console.log('🚀 Starting North Enclosing Walls Verification...');
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

  // Teleport to Meeting Cabin matching media_1792341093234.png
  await page.evaluate(() => {
    if (window.__spotTeleportPlayer) {
      window.__spotTeleportPlayer(-4, -15);
    }
    if (window.__spotSetCamera) {
      // Elevated camera looking north towards Z = -24
      window.__spotSetCamera(-4, 9, -5, -4, 1.5, -24);
    }
  });
  await new Promise(r => setTimeout(r, 1500));

  const artifactDir = 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3';

  // 1. Meeting Cabin & Boardroom elevated view matching media_1792341093234.png
  const shot1 = 'verify_meeting_cabin_north_walls_enclosed.png';
  await page.screenshot({ path: shot1 });
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(shot1, path.join(artifactDir, shot1));
  }
  console.log(`Saved: ${shot1}`);

  // 2. Inside Boardroom looking north towards new wall & double glass doors
  await page.evaluate(() => {
    if (window.__spotTeleportPlayer) {
      window.__spotTeleportPlayer(-23, -15);
    }
    if (window.__spotSetCamera) {
      window.__spotSetCamera(-23, 3, -12, -23, 1.4, -24);
    }
  });
  await new Promise(r => setTimeout(r, 1500));

  const shot2 = 'verify_boardroom_north_wall_enclosed.png';
  await page.screenshot({ path: shot2 });
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(shot2, path.join(artifactDir, shot2));
  }
  console.log(`Saved: ${shot2}`);

  await browser.close();
  console.log('✅ All north walls verification complete!');
})();
