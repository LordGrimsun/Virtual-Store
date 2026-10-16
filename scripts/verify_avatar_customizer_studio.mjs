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
  for (let attempt = 0; attempt < 30; attempt++) {
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
  await page.goto('http://localhost:4173/#/@sunnkesh-4c24f4f3d747fffc/@office/@boardroom', { waitUntil: 'domcontentloaded', timeout: 60000 });
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
  await new Promise((r) => setTimeout(r, 2000));

  console.log('1. Capturing Presets Tab...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_customizer_tab_presets.png') });

  // Switch to Face Tab
  console.log('2. Switching to Face Tab...');
  const faceTabBtn = (await page.$$('button')).find(async (b) => (await page.evaluate(el => el.textContent, b)).includes('Face'));
  const allBtns = await page.$$('button');
  for (const b of allBtns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt.includes('Face')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_customizer_tab_face.png') });

  // Switch to Hair Tab
  console.log('3. Switching to Hair Tab...');
  for (const b of await page.$$('button')) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt.includes('Hair')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_customizer_tab_hair.png') });

  // Switch to Tops Tab
  console.log('4. Switching to Tops Tab...');
  for (const b of await page.$$('button')) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt.includes('Tops')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_customizer_tab_tops.png') });

  // Switch to Pants Tab
  console.log('5. Switching to Pants Tab...');
  for (const b of await page.$$('button')) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt.includes('Pants')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_customizer_tab_pants.png') });

  // Switch to Shoes Tab
  console.log('6. Switching to Shoes Tab...');
  for (const b of await page.$$('button')) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt.includes('Shoes')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_customizer_tab_shoes.png') });

  // Test Archetype Switch to Sarah (Female Preset)
  console.log('7. Switching to Presets and selecting Sarah (Female)...');
  for (const b of await page.$$('button')) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt.includes('Presets')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 800));

  const sarahCard = await page.$('[data-preset-id="sarah"]');
  if (sarahCard) {
    await sarahCard.click();
  }
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_customizer_sarah_female.png') });

  // Test Archetype Switch to Stefan (Cyber Techwear)
  console.log('8. Selecting Stefan (Cyber Techwear)...');
  const stefanCard = await page.$('[data-preset-id="stefan"]');
  if (stefanCard) {
    await stefanCard.click();
  }
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_customizer_stefan_cyber.png') });

  // Switch back to Ayush (Main Male Minifigure)
  console.log('9. Selecting Ayush (Streetwear Red Hoodie)...');
  const ayushCard = await page.$('[data-preset-id="ayush"]');
  if (ayushCard) {
    await ayushCard.click();
  }
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_customizer_ayush_red_hoodie.png') });

  // Click Continue to Audio/Video
  console.log('10. Clicking Continue to AV setup...');
  for (const b of await page.$$('button')) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt === 'Continue' || txt.includes('Continue')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1500));

  // Click Continue to Waiting Room / Admittance
  console.log('11. Clicking Continue in AV setup to enter space...');
  for (const b of await page.$$('button')) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt.includes('Continue') || txt.includes('Enter')) {
      await b.click();
      break;
    }
  }

  // Waiting room auto-admits after 4 seconds
  console.log('12. Waiting for workspace admission into 3D Office...');
  await new Promise((r) => setTimeout(r, 5500));

  // Check if "Enter Office" or "You were admitted!" button appeared
  for (const b of await page.$$('button')) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt.includes('admitted') || txt.includes('Enter Office') || txt.includes('Enter Space')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 4500));

  console.log('13. Capturing 3D Office with customized Minifigure player & teammates...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_customizer_office_entered.png') });

  console.log('All verification screenshots captured successfully!');
  await browser.close();
  server.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
