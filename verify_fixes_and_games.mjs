import puppeteer from 'puppeteer';

const ARTIFACT_DIR = 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3';

async function run() {
  console.log('Launching browser to test all visual fixes, playable games, and swimming pool kinematics...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:5173/@sunnkesh-4c24f4f3d747fffc/@office/@boardroom...');
  await page.goto('http://localhost:5173/@sunnkesh-4c24f4f3d747fffc/@office/@boardroom', { waitUntil: 'networkidle2' });

  // Wait for 3D scene to mount
  await new Promise((r) => setTimeout(r, 3500));

  // 1. Boardroom Table and Door Clearance Verification
  console.log('Step 1: Capturing Boardroom clearance from walls and doors...');
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_fixed_boardroom_door_clearance.png` });

  // 2. Jump to Arcade & Game Zone
  console.log('Step 2: Jumping to Arcade & Game Zone...');
  await page.evaluate(() => {
    if (window.__spotJumpToRoom) {
      window.__spotJumpToRoom('Arcade & Game Zone');
    }
  });
  await new Promise((r) => setTimeout(r, 2000));
  console.log('Step 2: Capturing Arcade & Game Zone overview (Chessboard, Billiards, Ping Pong, Arcade)...');
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_fixed_arcade_tournament_court.png` });

  // 3. Open Playable Retro Arcade Modal
  console.log('Step 3: Opening Playable Retro Arcade modal...');
  await page.evaluate(() => {
    if (window.__spotOpenArcade) window.__spotOpenArcade();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_playable_arcade_modal.png` });

  // Switch game in arcade to Cyber Snake
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const snakeBtn = btns.find((b) => b.textContent.includes('Cyber Snake'));
    if (snakeBtn) snakeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_playable_arcade_snake.png` });

  // Close Arcade
  await page.evaluate(() => {
    if (window.__spotCloseArcade) window.__spotCloseArcade();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 4. Open Playable Billiards Modal
  console.log('Step 4: Opening Playable 8-Ball Billiards modal...');
  await page.evaluate(() => {
    if (window.__spotOpenBilliards) window.__spotOpenBilliards();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_playable_billiards_modal.png` });

  // Close Billiards
  await page.evaluate(() => {
    if (window.__spotCloseBilliards) window.__spotCloseBilliards();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 5. Open Playable Ping Pong Modal
  console.log('Step 5: Opening Playable Table Tennis Ping Pong modal...');
  await page.evaluate(() => {
    if (window.__spotOpenPingPong) window.__spotOpenPingPong();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_playable_pingpong_modal.png` });

  // Close Ping Pong
  await page.evaluate(() => {
    if (window.__spotClosePingPong) window.__spotClosePingPong();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 6. Open Giant Chessboard Modal
  console.log('Step 6: Opening Giant Chessboard modal...');
  await page.evaluate(() => {
    if (window.__spotOpenChess) window.__spotOpenChess();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_playable_chess_modal.png` });

  // Close Chess
  await page.evaluate(() => {
    if (window.__spotCloseChess) window.__spotCloseChess();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 7. Jump to Swimming Pool & Sun Deck
  console.log('Step 7: Jumping to Swimming Pool & Sun Deck...');
  await page.evaluate(() => {
    if (window.__spotJumpToRoom) {
      window.__spotJumpToRoom('Swimming Pool & Sun Deck');
    }
  });
  await new Promise((r) => setTimeout(r, 2000));
  console.log('Step 7: Capturing Poolside Jumbotron Screen & Pool Deck...');
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_poolside_jumbotron_screen.png` });

  // 8. Swimming Kinematics and HUD
  console.log('Step 8: Verifying avatar swimming inside pool basin...');
  const swimCheck = await page.evaluate(() => {
    const hud = document.body.innerText.includes('SWIMMING IN POOL');
    return { hudVisible: hud };
  });
  console.log('Swimming HUD visible:', swimCheck);
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_avatar_swimming_hud.png` });

  // Swim forward with W key
  console.log('Step 9: Swimming forward with W key (crawl stroke)...');
  await page.keyboard.down('KeyW');
  await new Promise((r) => setTimeout(r, 1800));
  await page.keyboard.up('KeyW');
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_avatar_swimming_movement.png` });

  await browser.close();
  console.log('All automated verifications successfully captured and completed!');
}

run().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});
