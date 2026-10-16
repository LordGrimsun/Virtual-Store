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

    // Step 1: Join form
    console.log('Step 1: Join form...');
    await page.goto('http://localhost:4173/#/@sunnkesh-4c24f4f3d747fffc/@office/@boardroom', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 2000));

    const nameInput = await page.waitForSelector('input[type="text"]');
    await nameInput.type('Ayush');

    // Click Continue
    let buttons = await page.$$('button');
    for (const b of buttons) {
      const txt = await page.evaluate((el) => el.textContent, b);
      if (txt.includes('Continue')) {
        await b.click();
        break;
      }
    }

    // Step 2: Customizer - Capture Male Minifigure
    console.log('Step 2: Male Minifigure Customizer...');
    await page.waitForSelector('canvas');
    await new Promise((r) => setTimeout(r, 2500));

    await page.screenshot({
      path: 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3/verify_male_minifigure.png'
    });
    console.log('Saved verify_male_minifigure.png');

    // Toggle to Female Minifigure (Top icon on right side)
    console.log('Toggling to Female Minifigure...');
    const genderButtons = await page.$$('button');
    // The feminine icon button is above the masculine one
    // Let's click the first icon button on the right
    const iconButtons = [];
    for (const b of genderButtons) {
      const isCircle = await page.evaluate((el) => {
        const cls = el.className || '';
        return cls.includes('rounded-full') && !el.textContent.includes('Continue') && !el.textContent.includes('Back');
      }, b);
      if (isCircle) iconButtons.push(b);
    }

    if (iconButtons.length >= 2) {
      await iconButtons[0].click(); // Female icon
      await new Promise((r) => setTimeout(r, 2000));
      await page.screenshot({
        path: 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3/verify_female_minifigure.png'
      });
      console.log('Saved verify_female_minifigure.png');

      // Click Male icon back
      await iconButtons[1].click();
      await new Promise((r) => setTimeout(r, 1000));
    }

    // Continue to Step 3 -> Step 4 -> Enter Office
    console.log('Entering office...');
    buttons = await page.$$('button');
    for (const b of buttons) {
      const txt = await page.evaluate((el) => el.textContent, b);
      if (txt.includes('Continue')) {
        await b.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 1200));

    buttons = await page.$$('button');
    for (const b of buttons) {
      const txt = await page.evaluate((el) => el.textContent, b);
      if (txt.includes('Continue')) {
        await b.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 1200));

    buttons = await page.$$('button');
    for (const b of buttons) {
      const txt = await page.evaluate((el) => el.textContent, b);
      if (txt.includes('Enter')) {
        await b.click();
        break;
      }
    }

    await new Promise((r) => setTimeout(r, 4500));
    await page.screenshot({
      path: 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3/verify_office_minifigures.png'
    });
    console.log('Saved verify_office_minifigures.png');

    console.log('All showcase captures complete!');
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch(console.error);
