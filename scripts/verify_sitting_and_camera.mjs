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

  console.log('Navigating directly to 3D platform http://localhost:4173/#platform...');
  await page.goto('http://localhost:4173/#platform', { waitUntil: 'networkidle2' });

  // Wait for 3D scene & avatars to mount
  await new Promise((r) => setTimeout(r, 3500));

  // 1. Initial Isometric Angel View
  console.log('Step 1: Capturing initial calibrated dollhouse angel view...');
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_step1_angel_view.png` });

  // 2. Avatar Close-Up (Character Design Verification)
  console.log('Step 2: Focusing on avatar close-up to verify stylized realistic humanoid model...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[title*="Avatar Close Focus"]');
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_step2_avatar_design.png` });

  // 3. Sitting on Sofa (Boardroom Sofa)
  console.log('Step 3: Sitting on West Sofa cushion with bent knees and proper elevation...');
  await page.evaluate(() => {
    const recenterBtn = document.querySelector('button[title*="Recenter"]');
    if (recenterBtn) recenterBtn.click();
    if (window.__spotSitOnChair) {
      window.__spotSitOnChair('Sofa');
    }
  });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_step3_sitting_sofa.png` });

  // 4. Sitting on Conference Chair
  console.log('Step 4: Sitting on Conference chair...');
  await page.evaluate(() => {
    if (window.__spotSitOnChair) {
      window.__spotSitOnChair('Conf B North Chair');
    }
  });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_step4_sitting_chair.png` });

  // 5. Mouse Drag 360° Orbit Rotation
  console.log('Step 5: Testing mouse drag camera rotation...');
  await page.mouse.move(700, 450);
  await page.mouse.down();
  await page.mouse.move(960, 400, { steps: 30 });
  await page.mouse.up();
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_step5_camera_rotation.png` });

  // 6. Showcase Screen View
  console.log('Step 6: Triggering Showcase Screen View...');
  await page.evaluate(() => {
    if (window.__spotShowcaseScreen) {
      window.__spotShowcaseScreen('boardroom');
    }
  });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_step6_showcase_screen.png` });

  // 7. Click screen to show floating toolbar with Showcase button
  console.log('Step 7: Opening screen toolbar with Showcase button...');
  await page.mouse.click(720, 450);
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_step7_screen_toolbar.png` });

  console.log('All verification screenshots captured successfully!');
  await browser.close();
  server.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
