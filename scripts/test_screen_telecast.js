import puppeteer from 'puppeteer';

(async () => {
  console.log('Launching browser to test screen telecast...');
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

  // Dismiss onboarding if present
  try {
    const continueBtn = await page.$('button');
    if (continueBtn) {
      // Find button with "Get Started" or "Enter Office" or similar
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text && (text.includes('Get Started') || text.includes('Enter') || text.includes('Skip') || text.includes('Join'))) {
          console.log('Clicking onboarding button:', text.trim());
          await btn.click();
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }
  } catch (e) {
    console.log('Onboarding check error:', e.message);
  }

  // Jump to Auditorium
  await page.evaluate(() => {
    // Check if window.__spotJumpToRoom is available or click Auditorium in sidebar
    const items = Array.from(document.querySelectorAll('span, button, div'));
    const audItem = items.find(el => el.textContent && el.textContent.includes('Auditorium'));
    if (audItem) {
      console.log('Found auditorium item, clicking');
      audItem.click();
    }
  });

  await new Promise(r => setTimeout(r, 2000));

  // Inspect the auditorium screen mesh in Three.js scene
  const screenInfo = await page.evaluate(() => {
    // Look for screen_auditorium or auditorium
    let scene = null;
    let auditoriumMesh = null;
    // We can search through the canvas / three scene
    return {
      hasSpotStartScreenShare: typeof window.__spotStartScreenShare === 'function',
      hasSpotUpdateScreenContent: typeof window.__spotUpdateScreenContent === 'function',
    };
  });

  console.log('Screen global functions:', screenInfo);

  // Try calling __spotStartScreenShare('auditorium')
  console.log('Triggering __spotStartScreenShare("auditorium")...');
  const shareResult = await page.evaluate(async () => {
    try {
      if (typeof window.__spotStartScreenShare === 'function') {
        const res = await window.__spotStartScreenShare('auditorium');
        return { success: true, res };
      }
      return { success: false, reason: 'function not found' };
    } catch (e) {
      return { success: false, error: e.message, stack: e.stack };
    }
  });

  console.log('Share result:', shareResult);

  await new Promise(r => setTimeout(r, 2000));

  // Check state of screen sharing in page
  const shareState = await page.evaluate(() => {
    const video = document.querySelector('video');
    const livePip = document.querySelector('span');
    return {
      hasVideoTag: !!video,
      videoSrcObject: !!video?.srcObject,
      videoPaused: video?.paused,
      videoReadyState: video?.readyState
    };
  });

  console.log('Share state:', shareState);

  // Take screenshot
  await page.screenshot({ path: 'verify_screen_share_test.png' });
  console.log('Screenshot saved to verify_screen_share_test.png');

  await browser.close();
})();
