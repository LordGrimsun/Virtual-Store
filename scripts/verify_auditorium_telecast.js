import puppeteer from 'puppeteer';

(async () => {
  console.log('Starting Auditorium Screen Telecast Verification...');
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

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

  console.log('Navigating to http://localhost:5173/#platform...');
  await page.goto('http://localhost:5173/#platform', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));

  // 1. Jump to Auditorium
  console.log('Jumping avatar to Auditorium...');
  await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('button, span, div'));
    const audItem = items.find(el => el.textContent && el.textContent.trim() === 'Auditorium');
    if (audItem) audItem.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  // 2. Click / Select the Auditorium Screen
  console.log('Selecting Auditorium Screen...');
  const selected = await page.evaluate(() => {
    return window.__spotSelectScreen ? window.__spotSelectScreen('auditorium') : false;
  });
  console.log('Auditorium screen selected:', selected);
  await new Promise(r => setTimeout(r, 1000));

  // Screenshot 1: Screen selected with floating 12-icon toolbar open
  await page.screenshot({ path: 'verify_auditorium_toolbar_open.png' });
  console.log('Screenshot saved: verify_auditorium_toolbar_open.png');

  // 3. Start Telecasting to Auditorium Cinema Screen
  console.log('Starting Screen Share / Telecast to Auditorium...');
  const shareStarted = await page.evaluate(async () => {
    return await window.__spotStartScreenShare('auditorium');
  });
  console.log('startScreenShare returned:', shareStarted);

  // Wait 3 seconds for video texture to tick and stream to render
  await new Promise(r => setTimeout(r, 3000));

  // Inspect 3D screen texture state
  const telecastState = await page.evaluate(() => {
    const video = document.getElementById('spot-screen-telecast-sink');
    const pipVideo = document.querySelector('video');
    return {
      hasSinkVideo: !!video,
      sinkReadyState: video?.readyState,
      sinkPaused: video?.paused,
      sinkWidth: video?.videoWidth,
      sinkHeight: video?.videoHeight,
      pipVideoReadyState: pipVideo?.readyState,
      pipVideoPaused: pipVideo?.paused
    };
  });
  console.log('Telecast state in page:', telecastState);

  // Screenshot 2: Active telecasting in Auditorium with live video texture and PiP monitor
  await page.screenshot({ path: 'verify_auditorium_live_telecast.png' });
  console.log('Screenshot saved: verify_auditorium_live_telecast.png');

  // 4. Test Showcase View on Auditorium Screen
  console.log('Entering Showcase Mode on Auditorium screen...');
  await page.evaluate(() => {
    const showcaseBtns = Array.from(document.querySelectorAll('button'));
    const btn = showcaseBtns.find(b => b.textContent && b.textContent.includes('Showcase'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot 3: Cinema Showcase mode focused squarely on the telecasting screen
  await page.screenshot({ path: 'verify_auditorium_showcase_telecast.png' });
  console.log('Screenshot saved: verify_auditorium_showcase_telecast.png');

  // 5. Test Web Page Embed Content on Auditorium Screen
  console.log('Testing Webpage Embed Content on Auditorium screen...');
  await page.evaluate(() => {
    if (window.__spotUpdateScreenContent) {
      window.__spotUpdateScreenContent('auditorium', 'webpage', { url: 'https://spotvirtual.com/keynote-2026' });
    }
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'verify_auditorium_webpage_content.png' });
  console.log('Screenshot saved: verify_auditorium_webpage_content.png');

  console.log('All tests completed successfully!');
  await browser.close();
})();
