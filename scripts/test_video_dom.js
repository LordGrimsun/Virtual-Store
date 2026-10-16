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
  await page.goto('http://localhost:5173/#platform', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  // Test 1: Detached video with getDisplayMedia stream
  const detachedResult = await page.evaluate(async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.srcObject = stream;
    try { await video.play(); } catch (e) {}
    await new Promise(r => setTimeout(r, 1000));
    return {
      readyState: video.readyState,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      paused: video.paused
    };
  });
  console.log('Detached video result:', detachedResult);

  // Test 2: Attached video in DOM with getDisplayMedia stream
  const attachedResult = await page.evaluate(async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const video = document.createElement('video');
    video.id = 'test-attached-video';
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.style.position = 'fixed';
    video.style.top = '-9999px';
    video.style.width = '100px';
    video.style.height = '100px';
    document.body.appendChild(video);
    video.srcObject = stream;
    try { await video.play(); } catch (e) {}
    await new Promise(r => setTimeout(r, 1000));
    const res = {
      readyState: video.readyState,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      paused: video.paused
    };
    video.remove();
    return res;
  });
  console.log('Attached video result:', attachedResult);

  await browser.close();
})();
