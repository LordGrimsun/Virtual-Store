import puppeteer from 'puppeteer';

async function verifyLive() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://spot-virtual.vercel.app/#/@sunnkesh-4c24f4f3d747fffc/@office/@boardroom', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  const nameInput = await page.waitForSelector('input[type="text"]');
  await nameInput.type('Ayush');
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt.includes('Continue')) {
      await b.click();
      break;
    }
  }
  await page.waitForSelector('canvas');
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3/live_production_avatar_customizer.png' });
  await browser.close();
  console.log('Live customizer captured!');
}
verifyLive();
