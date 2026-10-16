import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3';

async function run() {
  console.log('Starting vite preview server on port 4173...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    cwd: 'c:\\Youtube tech',
    shell: true
  });

  console.log('Waiting for preview server to be ready on port 4173...');
  for (let attempt = 0; attempt < 25; attempt++) {
    try {
      const res = await fetch('http://localhost:4173');
      if (res.ok || res.status === 200) {
        console.log('Server is ready!');
        break;
      }
    } catch (e) {}
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log('Launching Puppeteer browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Test Invited By Deep Link & Welcome Banner
  console.log('Step 1: Navigating to invite deep link with invitedBy=Sarah...');
  await page.goto('http://localhost:4173/#/@sunnkesh-4c24f4f3d747fffc/@office/@boardroom?invitedBy=Sarah', {
    waitUntil: 'networkidle2'
  });
  await new Promise((r) => setTimeout(r, 1200));

  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_onboarding_invited_banner.png` });
  console.log('Captured verify_onboarding_invited_banner.png');

  // Fill in name and advance
  await page.type('#spot_field_1', 'Alex Rivera');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1500));

  // Step 2.5: Advance through customize-avatar to choose-area
  console.log('Step 2: Advancing to Choose Starting Location...');
  await page.evaluate(() => {
    // Click Continue in customize-avatar
    const buttons = Array.from(document.querySelectorAll('button'));
    const contBtn = buttons.find((b) => b.textContent.includes('Continue'));
    if (contBtn) contBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_onboarding_choose_area.png` });
  console.log('Captured verify_onboarding_choose_area.png');

  // Select Auditorium
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div'));
    const audCard = cards.find((c) => c.textContent.includes('Auditorium') && c.textContent.includes('Cinema'));
    if (audCard) audCard.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  // Continue to AV
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const contBtn = buttons.find((b) => b.textContent.includes('Continue to Device Setup'));
    if (contBtn) contBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Continue to Waiting room / Enter
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const contBtn = buttons.find((b) => b.textContent.includes('Continue') && !b.textContent.includes('Device'));
    if (contBtn) contBtn.click();
  });
  await new Promise((r) => setTimeout(r, 4500)); // wait for auto-knock

  // Click Enter Office
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const enterBtn = buttons.find((b) => b.textContent.includes('Enter Office') || b.textContent.includes('admitted') || b.textContent.includes('Enter Space'));
    if (enterBtn) enterBtn.click();
  });
  await new Promise((r) => setTimeout(r, 4500));

  // 3. Auditorium Cinema Screen & Stadium Seating
  console.log('Step 3: Checking Auditorium Cinema Screen & Seating...');
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_auditorium_cinema_stage.png` });
  console.log('Captured verify_auditorium_cinema_stage.png');

  // Sit on theater chair
  await page.evaluate(() => {
    if (window.__spotSitOnChair) {
      window.__spotSitOnChair('Auditorium Theater');
    }
  });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_auditorium_theater_seated.png` });
  console.log('Captured verify_auditorium_theater_seated.png');

  // 4. Showcase Cinema Screen Mode (Unobstructed by Avatar Head)
  console.log('Step 4: Showcasing Auditorium Cinema Screen...');
  await page.evaluate(() => {
    if (window.__spotShowcaseScreen) {
      window.__spotShowcaseScreen('auditorium');
    }
  });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_showcase_cinema_unobstructed.png` });
  console.log('Captured verify_showcase_cinema_unobstructed.png');

  // Exit showcase with Escape key
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 1000));

  // 5. Workspace A: Monitors Facing Chairs
  console.log('Step 5: Teleporting to Workspace A to verify monitors face chairs...');
  await page.evaluate(() => {
    if (window.__spotJumpToRoom) {
      window.__spotJumpToRoom('Workspace A');
    }
  });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_workspace_monitors_facing_chairs.png` });
  console.log('Captured verify_workspace_monitors_facing_chairs.png');

  // 6. Focus Cubicle 1 & Single Door
  console.log('Step 6: Teleporting to Focus Cubicle 1...');
  await page.evaluate(() => {
    if (window.__spotJumpToRoom) {
      window.__spotJumpToRoom('Focus Cubicle 1');
    }
  });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_focus_cubicle_door.png` });
  console.log('Captured verify_focus_cubicle_door.png');

  // 7. Patio Terrace & Interactive Chessboard
  console.log('Step 7: Teleporting to Patio Terrace & Opening Chessboard...');
  await page.evaluate(() => {
    if (window.__spotJumpToRoom) {
      window.__spotJumpToRoom('Patio');
    }
  });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_patio_terrace_view.png` });

  // Open chessboard widget
  console.log('Opening Chessboard widget modal...');
  await page.evaluate(() => {
    if (window.__spotOpenChess) {
      window.__spotOpenChess();
    }
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_terrace_chessboard_interactive.png` });
  console.log('Captured verify_terrace_chessboard_interactive.png');

  // Close chessboard modal
  await page.evaluate(() => {
    if (window.__spotCloseChess) {
      window.__spotCloseChess();
    }
  });
  await new Promise((r) => setTimeout(r, 800));

  // 8. Boardroom Seating (zero fluctuation verification)
  console.log('Step 8: Teleporting to Boardroom and sitting on Sofa...');
  await page.evaluate(() => {
    if (window.__spotJumpToRoom) {
      window.__spotJumpToRoom('Boardroom');
    }
    if (window.__spotSitOnChair) {
      window.__spotSitOnChair('Sofa');
    }
  });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_boardroom_stable_seating.png` });
  console.log('Captured verify_boardroom_stable_seating.png');

  // 9. Open share invite modal
  console.log('Step 9: Opening Share Invite Link Modal...');
  await page.evaluate(() => {
    if (window.__spotOpenInvite) {
      window.__spotOpenInvite();
    }
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_spot_invite_modal.png` });
  console.log('Captured verify_spot_invite_modal.png');

  console.log('All verification steps completed!');
  await browser.close();
  try {
    server.kill();
  } catch (e) {}
  process.exit(0);
}

run().catch((err) => {
  console.error('Error running verification:', err);
  process.exit(1);
});
