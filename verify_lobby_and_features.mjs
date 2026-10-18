import puppeteer from 'puppeteer';

const ARTIFACT_DIR = 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3';

async function run() {
  console.log('Launching browser to verify Lobby and all Spot Virtual features...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:5173/@sunnkesh-4c24f4f3d747fffc/@office/@lobby?skipOnboarding=true...');
  await page.goto('http://localhost:5173/@sunnkesh-4c24f4f3d747fffc/@office/@lobby?skipOnboarding=true', { waitUntil: 'networkidle2' });

  await new Promise((r) => setTimeout(r, 2000));

  // Wait for 3D scene to mount
  await new Promise((r) => setTimeout(r, 3500));

  // Close sidebar to match fullscreen 3D view in user screenshots media_1792293223270.png & media_1792293223278.png
  await page.evaluate(() => {
    if (window.__spotCloseSidebar) window.__spotCloseSidebar();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 1. Lobby View matching media_1792293223270.png
  console.log('Step 1: Capturing Lobby view with black sofa, cream arms, potted plant, and skyline...');
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_lobby_view.png` });

  // 2. Invite people to Sunnkesh modal matching media_1792293223270.png
  console.log('Step 2: Testing and capturing Invite people to Sunnkesh modal...');
  await page.evaluate(() => {
    if (window.__spotOpenInvite) window.__spotOpenInvite();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_invite_modal_exact.png` });

  // Close invite modal
  await page.evaluate(() => {
    if (window.__spotCloseInvite) window.__spotCloseInvite();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 3. Objects & Widgets Menu matching media_1792293223278.png
  console.log('Step 3: Testing and capturing Objects & Widgets popover...');
  await page.evaluate(() => {
    if (window.__spotOpenObjectsMenu) window.__spotOpenObjectsMenu();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_objects_widgets_popover.png` });

  // Close objects menu
  await page.evaluate(() => {
    if (window.__spotCloseObjectsMenu) window.__spotCloseObjectsMenu();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 4. Room Actions 3-Dots Menu matching media_1792293223292.png
  console.log('Step 4: Testing and capturing Room Actions 3-dots popover...');
  await page.evaluate(() => {
    if (window.__spotOpenRoomMenu) window.__spotOpenRoomMenu();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_room_actions_popover.png` });

  // Close room menu
  await page.evaluate(() => {
    if (window.__spotCloseRoomMenu) window.__spotCloseRoomMenu();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 5. Room Chat Drawer ("Message Lobby") matching media_1792293238602.png
  console.log('Step 5: Testing and capturing Room Chat Drawer ("Message Lobby")...');
  await page.evaluate(() => {
    if (window.__spotOpenRoomChat) window.__spotOpenRoomChat();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_room_chat_drawer_exact.png` });

  // Close room chat drawer
  await page.evaluate(() => {
    if (window.__spotCloseRoomChat) window.__spotCloseRoomChat();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 6. Test Interactive Sticky Note Widget
  console.log('Step 6: Testing Sticky Note widget...');
  await page.evaluate(() => {
    if (window.__spotOpenStickyNote) window.__spotOpenStickyNote();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_widget_sticky_note.png` });
  await page.evaluate(() => {
    if (window.__spotCloseStickyNote) window.__spotCloseStickyNote();
  });
  await new Promise((r) => setTimeout(r, 500));

  // 7. Test Collaborative Shared Browser Widget
  console.log('Step 7: Testing Shared Browser widget...');
  await page.evaluate(() => {
    if (window.__spotOpenSharedBrowser) window.__spotOpenSharedBrowser();
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_widget_shared_browser.png` });
  await page.evaluate(() => {
    if (window.__spotCloseSharedBrowser) window.__spotCloseSharedBrowser();
  });
  await new Promise((r) => setTimeout(r, 500));

  // 8. Test Live Team Poll Widget
  console.log('Step 8: Testing Team Poll widget...');
  await page.evaluate(() => {
    if (window.__spotOpenPoll) window.__spotOpenPoll();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_widget_poll.png` });
  await page.evaluate(() => {
    if (window.__spotClosePoll) window.__spotClosePoll();
  });
  await new Promise((r) => setTimeout(r, 500));

  // 9. Test Synchronized YouTube Player Widget
  console.log('Step 9: Testing YouTube player widget...');
  await page.evaluate(() => {
    if (window.__spotOpenYouTube) window.__spotOpenYouTube();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_widget_youtube.png` });
  await page.evaluate(() => {
    if (window.__spotCloseYouTube) window.__spotCloseYouTube();
  });
  await new Promise((r) => setTimeout(r, 500));

  // 10. Test Productivity Focus Timer Widget
  console.log('Step 10: Testing Focus Timer widget...');
  await page.evaluate(() => {
    if (window.__spotOpenTimer) window.__spotOpenTimer();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_widget_timer.png` });
  await page.evaluate(() => {
    if (window.__spotCloseTimer) window.__spotCloseTimer();
  });
  await new Promise((r) => setTimeout(r, 500));

  // 11. Test Hovering Sofa to show "Sit down" Badge matching media_1792293223278.png
  console.log('Step 11: Testing Hover "Sit down" badge on sofa...');
  await page.evaluate(() => {
    if (window.__spotHoverSofa) window.__spotHoverSofa();
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_sit_down_badge.png` });

  await browser.close();
  console.log('Verification completed successfully! All screenshots saved.');
}

run().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});
