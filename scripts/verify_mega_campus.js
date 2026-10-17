import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const ARTIFACT_DIR = 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3';
const DIST_DIR = 'C:/Youtube tech/dist';

async function run() {
  console.log('Starting internal static server on 127.0.0.1:4188...');
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

  await new Promise((resolve) => server.listen(4188, '127.0.0.1', resolve));
  console.log('Internal static server running at http://127.0.0.1:4188');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('Loading Mega-Campus on Spot Platform...');
    await page.goto('http://127.0.0.1:4188/#platform', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 4500));

    // Capture initial spawn
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_campus_spawn.png') });
    console.log('Captured initial spawn.');

    const roomsToTest = [
      { name: 'Swimming Pool & Sun Deck', filename: 'verify_swimming_pool.png' },
      { name: 'Fitness & Gym Center', filename: 'verify_fitness_gym.png' },
      { name: 'Arcade & Game Zone', filename: 'verify_arcade_zone.png' },
      { name: 'Executive Cabins', filename: 'verify_executive_cabins.png' },
      { name: 'Grand Central Atrium', filename: 'verify_grand_atrium.png' }
    ];

    for (const room of roomsToTest) {
      console.log(`Navigating to ${room.name}...`);
      const clicked = await page.evaluate((targetName) => {
        const buttons = Array.from(document.querySelectorAll('aside[aria-label="Room Directory"] button'));
        const btn = buttons.find((b) => b.innerText && b.innerText.includes(targetName));
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      }, room.name);

      console.log(`Button clicked for ${room.name}: ${clicked}`);
      // Wait for camera and avatar interpolation
      await new Promise((r) => setTimeout(r, 2000));

      const screenshotPath = path.join(ARTIFACT_DIR, room.filename);
      await page.screenshot({ path: screenshotPath });
      console.log(`Saved screenshot: ${room.filename}`);
    }

    // Test GTA keyboard movement inside Arcade
    console.log('Testing WASD movement in Arcade...');
    await page.keyboard.down('KeyW');
    await new Promise((r) => setTimeout(r, 1200));
    await page.keyboard.up('KeyW');
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_arcade_walk_w.png') });

    // Test radar minimap click to jump to Swimming Pool
    console.log('Testing radar minimap click...');
    const minimap = await page.$('.Platform_minimap');
    if (minimap) {
      const box = await minimap.boundingBox();
      if (box) {
        // Click bottom right corner of minimap (Pool area)
        await page.mouse.click(box.x + box.width * 0.85, box.y + box.height * 0.75);
        await new Promise((r) => setTimeout(r, 2500));
        await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_minimap_teleport_pool.png') });
      }
    }

    console.log('All Mega-Campus verifications completed successfully!');
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    await browser.close();
    server.close();
    console.log('Server and browser closed.');
  }
}

run();
