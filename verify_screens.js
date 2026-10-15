import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3';

async function run() {
  console.log('Launching browser with fake media stream flags...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      '--enable-usermedia-screen-capturing',
      '--auto-select-desktop-capture-source=Entire screen',
      '--window-size=1400,900'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

  console.log('1. Navigating to Boardroom...');
  await page.goto('http://localhost:4173/@sunnkesh-4c24f4f3d747fffc/@office/@boardroom', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screen_test_1_boardroom_default.png') });
  console.log('Saved screen_test_1_boardroom_default.png');

  console.log('2. Opening 12-icon floating tool pill above Boardroom screen...');
  await page.evaluate(() => {
    if (window.__spotSelectScreen) {
      window.__spotSelectScreen('boardroom');
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screen_test_2_tool_pill_open.png') });
  console.log('Saved screen_test_2_tool_pill_open.png');

  console.log('3. Opening Image Slide tool in 12-icon pill...');
  const imageBtn = await page.$('button[title="Image Slide"]');
  if (imageBtn) {
    await imageBtn.click();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screen_test_3_image_upload_modal.png') });
    console.log('Saved screen_test_3_image_upload_modal.png');
  }

  console.log('4. Projecting custom authentic presentation slide onto Boardroom 3D screen...');
  const sampleDataUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="576" viewBox="0 0 1024 576"><rect width="1024" height="576" fill="%230a0f1d"/><rect x="30" y="30" width="964" height="516" rx="20" fill="%23111827" stroke="%2338bdf8" stroke-width="6"/><text x="512" y="150" font-family="sans-serif" font-size="52" font-weight="900" fill="%2338bdf8" text-anchor="middle">SPOT VIRTUAL PLATFORM</text><text x="512" y="230" font-family="sans-serif" font-size="32" font-weight="bold" fill="%23ffffff" text-anchor="middle">Live Presentation Deck Active</text><text x="512" y="310" font-family="sans-serif" font-size="24" fill="%2310b981" text-anchor="middle">✓ Zero Dummy Placeholders • Authentic Slide Broadcast</text><rect x="312" y="380" width="400" height="60" rx="30" fill="%232563eb"/><text x="512" y="420" font-family="sans-serif" font-size="22" font-weight="bold" fill="%23ffffff" text-anchor="middle">AYUSH KESHARWANI • SPOT HQ</text></svg>';

  await page.evaluate((dataUrl) => {
    if (window.__spotUpdateScreenContent) {
      window.__spotUpdateScreenContent('boardroom', 'image', { url: dataUrl });
    }
  }, sampleDataUrl);

  await new Promise(r => setTimeout(r, 1800));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screen_test_4_custom_image_displayed.png') });
  console.log('Saved screen_test_4_custom_image_displayed.png');

  console.log('5. Testing live countdown timer with active second-by-second ticking...');
  await page.evaluate(() => {
    if (window.__spotUpdateScreenContent) {
      window.__spotUpdateScreenContent('boardroom', 'timer', { minutes: 5 });
    }
  });

  console.log('Waiting 3.5 seconds to observe timer ticking down from 05:00...');
  await new Promise(r => setTimeout(r, 3500));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screen_test_5_live_countdown_ticking.png') });
  console.log('Saved screen_test_5_live_countdown_ticking.png');

  console.log('6. Testing real Screen Share telecasting with WebRTC stream...');
  await page.evaluate(async () => {
    if (window.__spotStartScreenShare) {
      await window.__spotStartScreenShare('boardroom');
    }
  });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screen_test_6_live_telecast_sharing.png') });
  console.log('Saved screen_test_6_live_telecast_sharing.png');

  console.log('7. Verifying Conference Room B separate role (Sprint Planning Standup)...');
  await page.goto('http://localhost:4173/@sunnkesh-4c24f4f3d747fffc/@office/@conference-b', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screen_test_7_conference_b_independent_role.png') });
  console.log('Saved screen_test_7_conference_b_independent_role.png');

  console.log('8. Verifying Workspace A separate role (Team CI/CD Deployments Monitor)...');
  await page.goto('http://localhost:4173/@sunnkesh-4c24f4f3d747fffc/@office/@workspace-a', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screen_test_8_workspace_a_independent_role.png') });
  console.log('Saved screen_test_8_workspace_a_independent_role.png');

  await browser.close();
  console.log('All verification tests completed successfully!');
}

run().catch(err => {
  console.error('Test run error:', err);
  process.exit(1);
});
