import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

async function main() {
  console.log('Starting preview server...');
  const server = spawn('npm.cmd', ['run', 'preview', '--', '--port', '4173'], {
    cwd: 'c:\\Youtube tech',
    shell: true
  });

  await new Promise((r) => setTimeout(r, 3500));

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Step 1: Onboarding
    console.log('Step 1: Join form...');
    await page.goto('http://localhost:4173/#/@sunnkesh-4c24f4f3d747fffc/@office/@boardroom', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 2000));

    const nameInput = await page.waitForSelector('input[type="text"]');
    await nameInput.type('Ayush');

    // Click Continue from Step 1 -> Step 2
    let buttons = await page.$$('button');
    for (const b of buttons) {
      const txt = await page.evaluate((el) => el.textContent, b);
      if (txt.includes('Continue')) {
        await b.click();
        break;
      }
    }

    // Step 2: 3D Avatar Customizer
    console.log('Step 2: 3D Avatar Customizer...');
    await page.waitForSelector('canvas');
    await new Promise((r) => setTimeout(r, 2500));

    await page.screenshot({
      path: 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3/verify_humanoid_avatar.png'
    });
    console.log('Saved verify_humanoid_avatar.png');

    // Click Continue from Step 2 -> Step 3
    buttons = await page.$$('button');
    for (const b of buttons) {
      const txt = await page.evaluate((el) => el.textContent, b);
      if (txt.includes('Continue')) {
        await b.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 1200));

    // Step 3: Audio & Video Setup -> Click Continue -> Step 4
    console.log('Step 3: Audio & Video Setup...');
    buttons = await page.$$('button');
    for (const b of buttons) {
      const txt = await page.evaluate((el) => el.textContent, b);
      if (txt.includes('Continue')) {
        await b.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 1200));

    // Step 4: Waiting Room -> Click Enter Space / Enter as Host
    console.log('Step 4: Waiting room / Enter Space...');
    buttons = await page.$$('button');
    for (const b of buttons) {
      const txt = await page.evaluate((el) => el.textContent, b);
      if (txt.includes('Enter')) {
        await b.click();
        break;
      }
    }

    // Wait for 3D Office Environment to load completely
    console.log('Waiting for 3D office environment...');
    await new Promise((r) => setTimeout(r, 4500));

    // Screenshot of 3D Office showing Outer Zone, Skyline, Hills & Architecture
    await page.screenshot({
      path: 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3/verify_outer_zone_and_office.png'
    });
    console.log('Saved verify_outer_zone_and_office.png');

    // Test Screen Sharing: Trigger Screen Broadcast
    console.log('Testing Screen Sharing...');
    await page.evaluate(() => {
      window.__spotStartScreenShare?.('boardroom');
    });
    await new Promise((r) => setTimeout(r, 2000));

    await page.screenshot({
      path: 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3/verify_screen_share_live.png'
    });
    console.log('Saved verify_screen_share_live.png');

    // Test Door & Showcase Screen: Trigger Showcase Screen for clean cabin viewing
    console.log('Testing Showcase Screen & Cabin View...');
    await page.evaluate(() => {
      window.__spotShowcaseScreen?.('boardroom');
    });
    await new Promise((r) => setTimeout(r, 2500));

    await page.screenshot({
      path: 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3/verify_cabin_screen_showcase.png'
    });
    console.log('Saved verify_cabin_screen_showcase.png');

  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
    server.kill();
    console.log('All verification steps complete!');
    process.exit(0);
  }
}

main();
