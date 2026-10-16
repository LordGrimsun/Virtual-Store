import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3';

async function run() {
  console.log('Launching browser to test live production at https://spot-virtual.vercel.app ...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const liveUrl = 'https://spot-virtual.vercel.app/#/@sunnkesh-4c24f4f3d747fffc/@office/@boardroom';
  console.log('Navigating to', liveUrl);
  await page.goto(liveUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 4000));

  // Step 1: Submit Name "Pratu"
  const nameInput = await page.waitForSelector('input[type="text"]', { timeout: 15000 });
  await nameInput.type('Pratu');
  for (const b of await page.$$('button')) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt.includes('Continue')) {
      await b.click();
      break;
    }
  }

  // Step 2: Customizer
  console.log('Waiting for customizer to render in production...');
  await page.waitForSelector('canvas', { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 2000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_production_customizer_studio.png') });
  console.log('Saved live_production_customizer_studio.png');

  // Click Sarah
  const sarahCard = await page.$('[data-preset-id="sarah"]');
  if (sarahCard) {
    await sarahCard.click();
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_production_sarah_customizer.png') });
    console.log('Saved live_production_sarah_customizer.png');
  }

  // Click Continue to AV
  for (const b of await page.$$('button')) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt.includes('Continue')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1500));

  // Click Continue in AV
  for (const b of await page.$$('button')) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt.includes('Continue') || txt.includes('Enter')) {
      await b.click();
      break;
    }
  }

  // Wait for admission
  console.log('Waiting for admission in production...');
  await new Promise((r) => setTimeout(r, 5500));

  for (const b of await page.$$('button')) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt.includes('admitted') || txt.includes('Enter Office') || txt.includes('Enter Space')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 4500));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_production_office_live.png') });
  console.log('Saved live_production_office_live.png');

  await browser.close();
  console.log('Production verification complete!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Production test error:', err);
  process.exit(1);
});
