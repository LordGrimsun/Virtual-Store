import puppeteer from 'puppeteer';

async function verifyLive() {
  console.log('Connecting to live production at https://spot-virtual.vercel.app ...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    page.on('console', (msg) => console.log('PAGE LOG:', msg.type(), msg.text()));
    page.on('pageerror', (err) => console.error('PAGE ERROR:', err.message));

    // Step 1: Join
    await page.goto('https://spot-virtual.vercel.app/#/@sunnkesh-4c24f4f3d747fffc/@office/@boardroom', {
      waitUntil: 'networkidle2'
    });
    await new Promise((r) => setTimeout(r, 2000));

    const nameInput = await page.waitForSelector('input[type="text"]');
    await nameInput.type('Ayush');

    // Continue to Step 2
    let buttons = await page.$$('button');
    for (const b of buttons) {
      const txt = await page.evaluate((el) => el.textContent, b);
      if (txt.includes('Continue')) {
        await b.click();
        break;
      }
    }

    // Step 2: Avatar Customizer
    console.log('Waiting for customizer canvas...');
    await page.waitForSelector('canvas', { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 4000));
    await page.screenshot({
      path: 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3/live_production_avatar_customizer.png'
    });
    console.log('Saved live_production_avatar_customizer.png');

    // Step 2 -> Step 3
    buttons = await page.$$('button');
    for (const b of buttons) {
      const txt = await page.evaluate((el) => el.textContent, b);
      if (txt.includes('Continue')) {
        await b.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 1500));

    // Step 3 -> Step 4
    buttons = await page.$$('button');
    for (const b of buttons) {
      const txt = await page.evaluate((el) => el.textContent, b);
      if (txt.includes('Continue')) {
        await b.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 1500));

    // Step 4: Waiting room -> Enter
    console.log('Waiting room... clicking Enter Space');
    buttons = await page.$$('button');
    for (const b of buttons) {
      const txt = await page.evaluate((el) => el.textContent, b);
      if (txt.includes('Enter')) {
        await b.click();
        break;
      }
    }

    // Wait for 3D Office
    console.log('Waiting for 3D office...');
    await new Promise((r) => setTimeout(r, 5000));
    await page.screenshot({
      path: 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3/live_production_office_and_cabin.png'
    });
    console.log('Saved live_production_office_and_cabin.png');

    // Live Screen Share
    console.log('Triggering screen share on live site...');
    await page.evaluate(() => {
      window.__spotStartScreenShare?.('boardroom');
    });
    await new Promise((r) => setTimeout(r, 3000));
    await page.screenshot({
      path: 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3/live_production_screen_share.png'
    });
    console.log('Saved live_production_screen_share.png');

    // Showcase mode
    console.log('Triggering showcase screen on live site...');
    await page.evaluate(() => {
      window.__spotShowcaseScreen?.('boardroom');
    });
    await new Promise((r) => setTimeout(r, 3000));
    await page.screenshot({
      path: 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3/live_production_showcase_mode.png'
    });
    console.log('Saved live_production_showcase_mode.png');

  } catch (err) {
    console.error('Error during live verification:', err);
  } finally {
    await browser.close();
    console.log('Live production verification complete!');
  }
}

verifyLive();
