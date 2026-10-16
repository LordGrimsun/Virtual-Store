import puppeteer from 'puppeteer';

(async () => {
  console.log('Testing Presentation Telecast Stream (simulate user cancel)...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5173/#platform', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));

  // Jump to Auditorium
  await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('button, span, div'));
    const audItem = items.find(el => el.textContent && el.textContent.trim() === 'Auditorium');
    if (audItem) audItem.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  // Simulate user clicking Cancel on the browser screen picker dialog
  const res = await page.evaluate(async () => {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getDisplayMedia = async () => {
        const err = new Error('Permission denied by user');
        err.name = 'NotAllowedError';
        throw err;
      };
    }
    return await window.__spotStartScreenShare('auditorium');
  });
  console.log('startScreenShare result:', res);

  await new Promise(r => setTimeout(r, 2000));

  // Enter Showcase
  await page.evaluate(() => {
    const showcaseBtns = Array.from(document.querySelectorAll('button'));
    const btn = showcaseBtns.find(b => b.textContent && b.textContent.includes('Showcase'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: 'verify_auditorium_keynote_telecast.png' });
  console.log('Saved verify_auditorium_keynote_telecast.png');

  await browser.close();
})();
