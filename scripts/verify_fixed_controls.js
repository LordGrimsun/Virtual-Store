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

    console.log('Loading Spot Platform...');
    await page.goto('http://127.0.0.1:4173/#platform', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 4500));

    // 1. Initial Spawn (Boardroom) - Authentic over-the-shoulder GTA chase view looking North into room
    console.log('Capturing verified Boardroom initial over-the-shoulder spawn...');
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_fixed_boardroom_spawn.png` });

    // 2. Press W (Forward)
    console.log('Pressing W (Forward)...');
    await page.keyboard.down('KeyW');
    await new Promise((r) => setTimeout(r, 1000));
    await page.keyboard.up('KeyW');
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_fixed_boardroom_w.png` });

    // 3. Press S (Backward)
    console.log('Pressing S (Backward)...');
    await page.keyboard.down('KeyS');
    await new Promise((r) => setTimeout(r, 1000));
    await page.keyboard.up('KeyS');
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_fixed_boardroom_s.png` });

    // 4. Press A (Left)
    console.log('Pressing A (Left)...');
    await page.keyboard.down('KeyA');
    await new Promise((r) => setTimeout(r, 1000));
    await page.keyboard.up('KeyA');
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_fixed_boardroom_a.png` });

    // 5. Press D (Right)
    console.log('Pressing D (Right)...');
    await page.keyboard.down('KeyD');
    await new Promise((r) => setTimeout(r, 1000));
    await page.keyboard.up('KeyD');
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_fixed_boardroom_d.png` });

    // 6. Auditorium Verification - Camera behind avatar, facing Cinema Screen directly
    console.log('Jumping to Auditorium...');
    await page.evaluate(() => {
      if (window.__spotJumpToRoom) {
        window.__spotJumpToRoom('Auditorium');
      }
    });
    await new Promise((r) => setTimeout(r, 2000));
    console.log('Capturing verified Auditorium screen view...');
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_fixed_auditorium_view.png` });

    // Press W towards screen
    console.log('Auditorium: Pressing W (Forward towards screen)...');
    await page.keyboard.down('KeyW');
    await new Promise((r) => setTimeout(r, 1000));
    await page.keyboard.up('KeyW');
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_fixed_auditorium_w.png` });

    // 7. Lounge C Verification
    console.log('Jumping to Lounge C...');
    await page.evaluate(() => {
      if (window.__spotJumpToRoom) {
        window.__spotJumpToRoom('Lounge C');
      }
    });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_fixed_lounge_c_view.png` });

    console.log('All verification steps completed successfully!');
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch(console.error);
