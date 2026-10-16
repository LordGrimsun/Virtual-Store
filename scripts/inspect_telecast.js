import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      '--auto-select-desktop-capture-source=Entire screen'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5173/#platform', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));

  // Jump to Auditorium
  await page.evaluate(() => {
    // Jump avatar to Auditorium
    const items = Array.from(document.querySelectorAll('button, span, div'));
    const audItem = items.find(el => el.textContent && el.textContent.trim() === 'Auditorium');
    if (audItem) audItem.click();
  });

  await new Promise(r => setTimeout(r, 2000));

  // Inspect the Auditorium screen BEFORE telecast
  console.log('Selecting auditorium screen...');
  const selectRes = await page.evaluate(() => {
    return window.__spotSelectScreen ? window.__spotSelectScreen('auditorium') : false;
  });
  console.log('Select auditorium screen res:', selectRes);

  await new Promise(r => setTimeout(r, 1000));

  // Trigger telecast to auditorium
  console.log('Calling __spotStartScreenShare("auditorium")...');
  const res = await page.evaluate(async () => {
    return await window.__spotStartScreenShare('auditorium');
  });
  console.log('__spotStartScreenShare result:', res);

  // Wait 3 seconds for video stream and texture to tick
  await new Promise(r => setTimeout(r, 3000));

  const afterInfo = await page.evaluate(() => {
    // Access Three.js scene / activeVideoTexture
    const vid = window.__spotActiveVideoElement;
    const vidTex = window.__spotActiveVideoTexture;
    return {
      hasVid: !!vid,
      vidPaused: vid?.paused,
      vidReadyState: vid?.readyState,
      vidVideoWidth: vid?.videoWidth,
      vidVideoHeight: vid?.videoHeight,
      hasVidTex: !!vidTex,
      vidTexNeedsUpdate: vidTex?.needsUpdate,
      vidTexVersion: vidTex?.version
    };
  });
  console.log('After telecast video/texture info:', afterInfo);

  await page.screenshot({ path: 'verify_auditorium_telecast_detail.png' });
  await browser.close();
})();
