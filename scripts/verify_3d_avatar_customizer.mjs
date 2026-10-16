import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3';

async function run() {
  console.log('Starting preview server on port 4173...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    cwd: 'c:\\Youtube tech',
    shell: true
  });

  console.log('Waiting for preview server to respond...');
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

  console.log('Navigating to http://localhost:4173/#/@sunnkesh-4c24f4f3d747fffc/@office/@boardroom...');
  await page.goto('http://localhost:4173/#/@sunnkesh-4c24f4f3d747fffc/@office/@boardroom', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));

  // Step 1: Submit Name "Ayush"
  console.log('Entering name and clicking Continue...');
  const nameInput = await page.waitForSelector('input[type="text"]', { timeout: 10000 });
  await nameInput.type('Ayush');
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt.includes('Continue')) {
      await b.click();
      break;
    }
  }

  // Step 2: On Customize your avatar screen
  console.log('Waiting for 3D Avatar canvas in customizer...');
  await page.waitForSelector('canvas', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 2500));

  console.log('Capturing Step 1: Initial 3D Avatar Customizer (Authentic Spot Virtual Match)...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_customizer_step1_initial_3d.png') });

  // Test 360° Drag on the Canvas
  console.log('Performing mouse drag rotation on 3D avatar canvas...');
  const canvasElem = await page.$('canvas');
  const box = await canvasElem.boundingBox();
  if (box) {
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX - 100, centerY, { steps: 10 });
    await page.mouse.up();
    await new Promise((r) => setTimeout(r, 1200));
  }

  console.log('Capturing Step 2: After 360 Drag Orbit...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_customizer_step2_drag_rotated.png') });

  // Rotate back to face forward (0 degrees)
  if (box) {
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX + 100, centerY, { steps: 10 });
    await page.mouse.up();
    await new Promise((r) => setTimeout(r, 1200));
  }

  // Test Male Silhouette toggle
  console.log('Toggling to masculine style preset...');
  const masculineBtn = await page.$('button[title="Masculine Style"]');
  if (masculineBtn) {
    await masculineBtn.click();
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log('Capturing Step 3: Masculine Style 3D Avatar...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_customizer_step3_masculine_style.png') });

  // Switch back to female preset matching real_spot_after_continue.png
  console.log('Switching to Feminine Style (matching real_spot_after_continue.png)...');
  const feminineBtn = await page.$('button[title="Feminine Style"]');
  if (feminineBtn) {
    await feminineBtn.click();
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log('Capturing Step 5: Final Customizer matching real_spot_after_continue.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_customizer_step5_real_spot_match.png') });

  // Click Continue to proceed to Audio & Video setup
  console.log('Clicking Continue through onboarding...');
  const allBtns = await page.$$('button');
  for (const b of allBtns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt.trim() === 'Continue') {
      await b.click();
      break;
    }
  }

  // Audio & Video step
  await new Promise((r) => setTimeout(r, 2000));
  const avContinue = await page.$$('button');
  for (const b of avContinue) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt.includes('Continue to Space') || txt.includes('Continue')) {
      await b.click();
      break;
    }
  }

  // Waiting room / entering space
  console.log('Waiting for admitted button in waiting room...');
  await new Promise((r) => setTimeout(r, 4500));
  const allWaitingBtns = await page.$$('button');
  for (const b of allWaitingBtns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt.includes('Enter Office') || txt.includes('admitted')) {
      console.log('Found admitted button! Clicking to enter 3D office...');
      await b.click();
      break;
    }
  }

  console.log('Waiting for 3D office and player avatar to load...');
  await new Promise((r) => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_customizer_step6_office_entered.png') });

  await browser.close();
  try {
    server.kill();
  } catch (e) {}
  console.log('Verification run complete!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});
