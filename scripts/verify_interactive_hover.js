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

    // Jump to boardroom
    await page.evaluate(() => {
      window.__spotJumpToRoom?.('boardroom');
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Find the projected 2D coordinates of the boardroom screen or chairs in the scene
    const interactiveCoords = await page.evaluate(() => {
      const canvas = document.querySelector('main canvas');
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      
      // Let's project the boardroom presentation display or conference chairs
      // Boardroom display is at x: -23, y: 2.2, z: -17.8
      // Or we can find objects in scene.children:
      return {
        canvasRect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
      };
    });
    console.log('Canvas coordinates:', interactiveCoords);

    // Let's test hover across multiple points on the screen
    // Middle of upper screen is typically the Boardroom screen in front of spawn
    const testPoints = [
      { name: 'Open Floor (Idle)', x: 720, y: 800 },
      { name: 'Boardroom Screen / Wall Area', x: 720, y: 380 },
      { name: 'Boardroom Left Table / Chairs', x: 600, y: 550 },
      { name: 'Boardroom Right Table / Chairs', x: 840, y: 550 }
    ];

    for (const pt of testPoints) {
      await page.mouse.move(pt.x, pt.y);
      await new Promise((r) => setTimeout(r, 150));
      const cursor = await page.evaluate(() => {
        const canvas = document.querySelector('main canvas');
        return canvas ? window.getComputedStyle(canvas).cursor : null;
      });
      console.log(`Point "${pt.name}" at (${pt.x}, ${pt.y}) -> Cursor: "${cursor}"`);
    }

    // Now test drag from (720, 700) to (820, 700)
    console.log('Testing drag sequence...');
    await page.mouse.move(720, 700);
    await page.mouse.down();
    const cursorOnMouseDown = await page.evaluate(() => {
      const canvas = document.querySelector('main canvas');
      return {
        canvas: canvas ? window.getComputedStyle(canvas).cursor : null,
        body: window.getComputedStyle(document.body).cursor
      };
    });
    console.log('Cursor immediately on pointerdown:', cursorOnMouseDown);

    await page.mouse.move(800, 700);
    const cursorOnDragMove = await page.evaluate(() => {
      const canvas = document.querySelector('main canvas');
      return {
        canvas: canvas ? window.getComputedStyle(canvas).cursor : null,
        body: window.getComputedStyle(document.body).cursor
      };
    });
    console.log('Cursor while dragging:', cursorOnDragMove);

    await page.mouse.up();
    await new Promise((r) => setTimeout(r, 100));
    const cursorAfterMouseUp = await page.evaluate(() => {
      const canvas = document.querySelector('main canvas');
      return {
        canvas: canvas ? window.getComputedStyle(canvas).cursor : null,
        body: window.getComputedStyle(document.body).cursor
      };
    });
    console.log('Cursor after pointerup:', cursorAfterMouseUp);

    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_cursor_hover_drag.png` });
    console.log('Captured screenshot verify_cursor_hover_drag.png');
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
