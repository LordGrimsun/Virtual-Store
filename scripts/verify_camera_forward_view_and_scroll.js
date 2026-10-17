import puppeteer from 'puppeteer';

const ARTIFACT_DIR = 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3';

async function run() {
  console.log('Connecting to dev server on http://localhost:5173/#platform...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('Loading Spot Platform...');
    await page.goto('http://localhost:5173/#platform', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 4000));

    // 1. Jump to Lounge C (where user encountered the floor lock in media_1792209019251.png)
    console.log('Step 1: Jumping to Lounge C...');
    await page.evaluate(() => {
      if (window.__spotJumpToRoom) {
        window.__spotJumpToRoom('Lounge C');
      }
    });
    await new Promise((r) => setTimeout(r, 2000));

    console.log('Step 2: Capturing Lounge C initial eye-level third-person view...');
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_lounge_c_eye_level_overview.png` });

    // 2. Test Mouse Wheel Scroll UP (deltaY < 0)
    console.log('Step 3: Simulating mouse wheel scroll UP (deltaY < 0)...');
    await page.mouse.move(720, 450);
    await page.mouse.wheel({ deltaY: -250 });
    await new Promise((r) => setTimeout(r, 1500));

    console.log('Step 4: Capturing view after scrolling UP (should zoom in and tilt up towards eye-level)...');
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_lounge_c_scroll_up_zoom_and_tilt.png` });

    // 3. Test Mouse Drag UP (deltaY < 0)
    console.log('Step 5: Simulating dragging mouse UP to tilt camera up...');
    await page.mouse.move(720, 500);
    await page.mouse.down({ button: 'left' });
    await page.mouse.move(720, 320, { steps: 12 });
    await page.mouse.up({ button: 'left' });
    await new Promise((r) => setTimeout(r, 1500));

    console.log('Step 6: Capturing view after dragging mouse UP (camera tilted up towards eye-level/horizon)...');
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_lounge_c_drag_up_pitch_view.png` });

    // 4. Test Recenter Button
    console.log('Step 7: Testing Recenter button...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[title*="Recenter"]');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));

    // 5. Test Auditorium Seated View
    console.log('Step 8: Jumping to Auditorium and sitting in front tier...');
    await page.evaluate(() => {
      if (window.__spotJumpToRoom) {
        window.__spotJumpToRoom('Auditorium');
      }
    });
    await new Promise((r) => setTimeout(r, 2000));

    await page.evaluate(() => {
      if (window.__spotSitOnChair) {
        window.__spotSitOnChair('Auditorium');
      }
    });
    await new Promise((r) => setTimeout(r, 2000));

    console.log('Step 9: Capturing Auditorium seated view...');
    await page.screenshot({ path: `${ARTIFACT_DIR}/verify_auditorium_forward_screen_view.png` });

    console.log('All verification screenshots captured successfully!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
