import puppeteer from 'puppeteer';

const ARTIFACT_DIR = 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3';

async function run() {
  console.log('Launching browser to verify nameplate culling and interactive avatar name popup...');
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

  // Close left sidebar to match fullscreen view
  await page.evaluate(() => {
    if (window.__spotCloseSidebar) window.__spotCloseSidebar();
  });
  await new Promise((r) => setTimeout(r, 800));

  // 1. Verify that Lobby view is completely clean with NO floating names hovering across the room/window
  console.log('Step 1: Capturing clean Lobby view without distant nameplates...');
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_lobby_no_floating_names.png` });
  console.log('Saved verify_lobby_no_floating_names.png');

  // Check how many floating nameplates exist on screen in Lobby
  const nameplateCount = await page.evaluate(() => {
    return document.querySelectorAll('main > div:not([style*="cursor: grab"])').length;
  });
  console.log(`Floating nameplates count in Lobby: ${nameplateCount}`);

  // 2. Verify interactive Avatar Profile Name Popup ("to find who is who")
  console.log('Step 2: Triggering Avatar Profile Name Popup (who is who)...');
  await page.evaluate(() => {
    if (window.__spotHoverAvatar) {
      window.__spotHoverAvatar('Phil');
    }
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_avatar_name_popup.png` });
  console.log('Saved verify_avatar_name_popup.png');

  // Close popup
  await page.evaluate(() => {
    if (window.__spotCloseAvatarPopup) window.__spotCloseAvatarPopup();
  });
  await new Promise((r) => setTimeout(r, 500));

  // 3. Verify AI Agent (DevBot) Profile Name Popup
  console.log('Step 3: Triggering AI Agent (DevBot) Profile Name Popup...');
  await page.evaluate(() => {
    if (window.__spotHoverAvatar) {
      window.__spotHoverAvatar('DevBot');
    }
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_devbot_name_popup.png` });
  console.log('Saved verify_devbot_name_popup.png');

  await browser.close();
  console.log('Verification script completed successfully!');
}

run().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});
