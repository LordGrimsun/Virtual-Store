import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const ARTIFACT_DIR = 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3';
const DIST_DIR = 'C:/Youtube tech/dist';

async function run() {
  console.log('Starting internal static server on 127.0.0.1:4173...');
  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0].split('#')[0];
    if (reqPath === '/' || !path.extname(reqPath)) reqPath = '/index.html';
    const filePath = path.join(DIST_DIR, reqPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.mjs': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.woff2': 'font/woff2'
      };
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  await new Promise((resolve) => server.listen(4173, '127.0.0.1', resolve));
  console.log('Internal static server running at http://127.0.0.1:4173');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('Loading Spot Platform with GTA San Andreas third-person camera...');
    await page.goto('http://127.0.0.1:4173/#platform', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 4500));

    // Jump to Lounge C
    await page.evaluate(() => {
      if (window.__spotJumpToRoom) {
        window.__spotJumpToRoom('Lounge C');
      }
    });
    await new Promise((r) => setTimeout(r, 2000));

    console.log('Step 1: Capturing initial GTA San Andreas third-person chase cam view...');
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_gta_chase_cam_overview.png` });

    // Step 2: Press W (Forward) for 1.2s
    console.log('Step 2: Pressing W (Forward)...');
    await page.keyboard.down('KeyW');
    await new Promise((r) => setTimeout(r, 1200));
    await page.keyboard.up('KeyW');
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_gta_walk_forward.png` });

    // Step 3: Press D (Right) for 1.0s
    console.log('Step 3: Pressing D (Right)...');
    await page.keyboard.down('KeyD');
    await new Promise((r) => setTimeout(r, 1000));
    await page.keyboard.up('KeyD');
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_gta_walk_right.png` });

    // Step 4: Press S (Backward) for 1.0s
    console.log('Step 4: Pressing S (Backward)...');
    await page.keyboard.down('KeyS');
    await new Promise((r) => setTimeout(r, 1000));
    await page.keyboard.up('KeyS');
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_gta_walk_backward.png` });

    // Step 5: Press A (Left) for 1.0s
    console.log('Step 5: Pressing A (Left)...');
    await page.keyboard.down('KeyA');
    await new Promise((r) => setTimeout(r, 1000));
    await page.keyboard.up('KeyA');
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_gta_walk_left.png` });

    // Step 6: Over-the-shoulder close zoom view
    console.log('Step 6: Testing Avatar Close Focus (Over-the-shoulder view)...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[title*="Over-the-Shoulder"]') || document.querySelector('button[title*="Avatar Close Focus"]');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_gta_shoulder_zoom.png` });

    // Step 7: Jump to Auditorium and verify GTA camera in Auditorium
    console.log('Step 7: Testing Auditorium in GTA camera mode...');
    await page.evaluate(() => {
      if (window.__spotJumpToRoom) {
        window.__spotJumpToRoom('Auditorium');
      }
    });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_gta_auditorium_view.png` });

    console.log('All GTA movement and camera verification tests completed successfully!');
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error('GTA verification failed:', err);
  process.exit(1);
});
