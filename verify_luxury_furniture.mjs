import puppeteer from 'puppeteer';

const ARTIFACT_DIR = 'C:/Users/pratu/.gemini/antigravity/brain/14c498ae-ca0f-46ce-b2ce-abf945e067b3';

async function run() {
  console.log('Launching browser to capture luxury furniture visual inspections...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to app...');
  await page.goto('http://localhost:5173/@sunnkesh-4c24f4f3d747fffc/@office/@lobby?skipOnboarding=true', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 4000));

  await page.evaluate(() => {
    if (window.__spotCloseSidebar) window.__spotCloseSidebar();
  });
  await new Promise((r) => setTimeout(r, 600));

  // 1. Lobby Waiting Lounge: Luxury Nero Marquina Tea Table & Black Leather Designer Sofa
  console.log('Capturing Lobby Luxury Tea Table & Black Sofa...');
  await page.evaluate(() => {
    if (window.__spotTeleportPlayer) window.__spotTeleportPlayer(0, -40.0);
    if (window.__spotSetCamera) {
      window.__spotSetCamera(
        { x: 1.8, y: 1.25, z: -39.0 },
        { x: 0.0, y: 0.45, z: -42.2 }
      );
    }
  });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_luxury_lobby_teatable.png` });
  console.log('Saved verify_luxury_lobby_teatable.png');

  // 2. Boardroom: Smoked Walnut Executive Conference Table with Brass Edge, AV Trough & Cantilever Chairs
  console.log('Capturing Boardroom Executive Conference Table...');
  await page.evaluate(() => {
    if (window.__spotTeleportPlayer) window.__spotTeleportPlayer(-23.0, -12.0);
    if (window.__spotSetCamera) {
      window.__spotSetCamera(
        { x: -17.5, y: 1.9, z: -12.8 },
        { x: -23.0, y: 0.75, z: -16.0 }
      );
    }
  });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_luxury_boardroom_table.png` });
  console.log('Saved verify_luxury_boardroom_table.png');

  // 3. Cantilever Chairs Close-Up
  console.log('Capturing Cantilever Chairs close-up...');
  await page.evaluate(() => {
    if (window.__spotSetCamera) {
      window.__spotSetCamera(
        { x: -21.6, y: 1.15, z: -13.6 },
        { x: -22.4, y: 0.65, z: -15.0 }
      );
    }
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_luxury_cantilever_chairs.png` });
  console.log('Saved verify_luxury_cantilever_chairs.png');

  // 4. Lounge C: Tri-Material 3-Disc Overlapping Coffee Table Cluster
  console.log('Capturing Lounge C 3-Disc Coffee Table Cluster...');
  await page.evaluate(() => {
    if (window.__spotTeleportPlayer) window.__spotTeleportPlayer(-10.0, 7.0);
    if (window.__spotSetCamera) {
      window.__spotSetCamera(
        { x: -9.8, y: 1.6, z: 6.8 },
        { x: -10.0, y: 0.42, z: 4.0 }
      );
    }
  });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_luxury_lounge_c_cluster.png` });
  console.log('Saved verify_luxury_lounge_c_cluster.png');

  // 5. Lounge C Tub Armchairs
  console.log('Capturing Tub Armchairs with ivory bouclé and tapered brass legs...');
  await page.evaluate(() => {
    if (window.__spotSetCamera) {
      window.__spotSetCamera(
        { x: -4.0, y: 1.35, z: 4.4 },
        { x: -4.0, y: 0.55, z: 2.0 }
      );
    }
  });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: `${ARTIFACT_DIR}/verify_luxury_tub_armchairs.png` });
  console.log('Saved verify_luxury_tub_armchairs.png');

  await browser.close();
  console.log('All luxury furniture screenshots captured successfully!');
}

run().catch((err) => {
  console.error('Error running verification script:', err);
  process.exit(1);
});
