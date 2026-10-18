import puppeteer from 'puppeteer';

const ARTIFACT_DIR = 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3';

async function run() {
  console.log('Launching browser to verify Room Settings modal and Build mode tooltip...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:5173/@sunnkesh-4c24f4f3d747fffc/@office/@lobby?skipOnboarding=true...');
  await page.goto('http://localhost:5173/@sunnkesh-4c24f4f3d747fffc/@office/@lobby?skipOnboarding=true', { waitUntil: 'networkidle2' });

  // Wait for 3D scene & assets to load
  await new Promise((r) => setTimeout(r, 4000));

  // Close left sidebar to match full view
  await page.evaluate(() => {
    if (window.__spotCloseSidebar) window.__spotCloseSidebar();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 1. Verify Room Settings: Overview Tab (matching media_1792295862715.png)
  console.log('Step 1: Opening Room Settings modal on Overview tab...');
  await page.evaluate(() => {
    if (window.__spotOpenRoomSettings) window.__spotOpenRoomSettings('overview');
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_room_settings_overview.png` });
  console.log('Saved verify_room_settings_overview.png');

  // 2. Verify Room Settings: Transcription Tab (matching media_1792295862717.png)
  console.log('Step 2: Switching to Transcription tab...');
  await page.evaluate(() => {
    if (window.__spotOpenRoomSettings) window.__spotOpenRoomSettings('transcription');
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_room_settings_transcription.png` });
  console.log('Saved verify_room_settings_transcription.png');

  // 3. Verify Room Settings: Advanced Tab
  console.log('Step 3: Switching to Advanced tab...');
  await page.evaluate(() => {
    if (window.__spotOpenRoomSettings) window.__spotOpenRoomSettings('advanced');
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_room_settings_advanced.png` });
  console.log('Saved verify_room_settings_advanced.png');

  // Close Room Settings Modal
  await page.evaluate(() => {
    if (window.__spotCloseRoomSettings) window.__spotCloseRoomSettings();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 4. Verify Build Mode Tooltip & Skyline (matching media_1792295911672.png)
  console.log('Step 4: Hovering over Hammer button to show "Build mode" tooltip...');
  // Find hammer button and hover over it
  const hammerFound = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    // Find button containing svg or with tooltip handler
    for (const b of buttons) {
      if (b.innerHTML.includes('lucide-hammer') || b.querySelector('svg.lucide-hammer')) {
        const rect = b.getBoundingClientRect();
        return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
      }
    }
    return null;
  });

  if (hammerFound) {
    await page.mouse.move(hammerFound.x, hammerFound.y);
  } else {
    // Fallback: move mouse to bottom left area where hammer is located
    await page.mouse.move(175, 875);
  }
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_build_mode_tooltip.png` });
  console.log('Saved verify_build_mode_tooltip.png');

  await browser.close();
  console.log('Verification finished successfully!');
}

run().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});
