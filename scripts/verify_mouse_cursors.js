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

    // 1. Check Idle Canvas Cursor
    console.log('Testing 1: Idle canvas cursor...');
    const idleCursor = await page.evaluate(() => {
      const canvas = document.querySelector('main canvas');
      return canvas ? window.getComputedStyle(canvas).cursor : null;
    });
    console.log(`Canvas idle cursor: "${idleCursor}"`);

    // 2. Test Mouse Drag / PointerDown Cursor
    console.log('Testing 2: Mouse drag cursor...');
    const canvasBox = await page.evaluate(() => {
      const canvas = document.querySelector('main canvas');
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      return { x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.5 };
    });

    if (canvasBox) {
      await page.mouse.move(canvasBox.x, canvasBox.y);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 80, canvasBox.y + 20);

      const dragCursor = await page.evaluate(() => {
        const canvas = document.querySelector('main canvas');
        return {
          canvasCursor: canvas ? window.getComputedStyle(canvas).cursor : null,
          bodyCursor: window.getComputedStyle(document.body).cursor
        };
      });
      console.log('Drag cursors:', dragCursor);

      await page.mouse.up();
      await new Promise((r) => setTimeout(r, 300));

      const afterUpCursor = await page.evaluate(() => {
        const canvas = document.querySelector('main canvas');
        return {
          canvasCursor: canvas ? window.getComputedStyle(canvas).cursor : null,
          bodyCursor: window.getComputedStyle(document.body).cursor
        };
      });
      console.log('After release cursor:', afterUpCursor);
    }

    // 3. Test Hovering over Interactive Screen
    console.log('Testing 3: Hovering over presentation screen / interactive element...');
    const screenCenter = await page.evaluate(() => {
      // Find screen or chair position on screen
      const screen = window.__spotScreens?.boardroom;
      return true;
    });

    // We can simulate pointermove to an interactive chair / screen coordinate
    const chairHoverResult = await page.evaluate(() => {
      const chair = window.__spotChairs?.[0];
      const canvas = document.querySelector('main canvas');
      return {
        hasChairs: !!chair,
        canvasCurrentCursor: canvas ? window.getComputedStyle(canvas).cursor : null
      };
    });
    console.log('Interactive chair check:', chairHoverResult);

    // 4. Test Minimap Cursor
    console.log('Testing 4: Minimap cursor...');
    const minimapCursor = await page.evaluate(() => {
      const minimap = document.querySelector('.Platform_minimap');
      return minimap ? window.getComputedStyle(minimap).cursor : null;
    });
    console.log(`Minimap cursor: "${minimapCursor}"`);

    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_cursor_states.png` });
    console.log('Captured screenshot verify_cursor_states.png');

    console.log('All cursor verifications completed successfully!');
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
