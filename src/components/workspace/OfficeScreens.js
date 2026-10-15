import * as THREE from 'three';

/**
 * Creates all high-definition procedural canvas textures for office displays,
 * dashboards, and whiteboards matching the Spot Virtual desktop client.
 */
export function createOfficeScreenTextures() {
  // 1. Blue Mountain Telemetry Area Chart
  const chartCanvas = document.createElement('canvas');
  chartCanvas.width = 1024;
  chartCanvas.height = 512;
  const cCtx = chartCanvas.getContext('2d');
  cCtx.fillStyle = '#ffffff';
  cCtx.fillRect(0, 0, 1024, 512);

  // Grid lines
  cCtx.strokeStyle = '#e2e8f0';
  cCtx.lineWidth = 2;
  for (let y = 60; y < 450; y += 60) {
    cCtx.beginPath();
    cCtx.moveTo(60, y);
    cCtx.lineTo(960, y);
    cCtx.stroke();
  }

  // Header & Title
  cCtx.fillStyle = '#0f172a';
  cCtx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  cCtx.fillText('Workspace Realtime Telemetry', 60, 48);

  const pts = [
    [80, 360], [140, 320], [200, 370], [260, 240], [320, 280],
    [380, 190], [440, 230], [500, 150], [560, 220], [620, 120],
    [680, 180], [740, 110], [800, 160], [860, 90], [940, 130]
  ];

  // Gradient area fill
  const grad = cCtx.createLinearGradient(0, 90, 0, 420);
  grad.addColorStop(0, 'rgba(37, 99, 235, 0.75)');
  grad.addColorStop(0.6, 'rgba(59, 130, 246, 0.25)');
  grad.addColorStop(1, 'rgba(59, 130, 246, 0.02)');
  cCtx.beginPath();
  cCtx.moveTo(pts[0][0], 420);
  pts.forEach(([px, py]) => cCtx.lineTo(px, py));
  cCtx.lineTo(pts[pts.length - 1][0], 420);
  cCtx.closePath();
  cCtx.fillStyle = grad;
  cCtx.fill();

  // Primary chart line
  cCtx.beginPath();
  pts.forEach(([px, py], i) => {
    if (i === 0) cCtx.moveTo(px, py);
    else cCtx.lineTo(px, py);
  });
  cCtx.strokeStyle = '#2563eb';
  cCtx.lineWidth = 6;
  cCtx.lineCap = 'round';
  cCtx.lineJoin = 'round';
  cCtx.stroke();

  // Peak dots
  pts.forEach(([px, py]) => {
    cCtx.fillStyle = '#ffffff';
    cCtx.beginPath();
    cCtx.arc(px, py, 6, 0, Math.PI * 2);
    cCtx.fill();
    cCtx.strokeStyle = '#1d4ed8';
    cCtx.lineWidth = 3;
    cCtx.stroke();
  });

  const chartTexture = new THREE.CanvasTexture(chartCanvas);

  // 2. Giant Digital LED KPI Scoreboard (168 161 47 34 34)
  const kpiCanvas = document.createElement('canvas');
  kpiCanvas.width = 1024;
  kpiCanvas.height = 512;
  const kCtx = kpiCanvas.getContext('2d');
  kCtx.fillStyle = '#090d16';
  kCtx.fillRect(0, 0, 1024, 512);

  // Grid border frame
  kCtx.strokeStyle = '#1e293b';
  kCtx.lineWidth = 4;
  kCtx.strokeRect(10, 10, 1004, 492);

  kCtx.font = 'bold 96px "Courier New", monospace';
  kCtx.textAlign = 'center';
  kCtx.textBaseline = 'middle';

  const topKPIs = [
    { text: '168', color: '#f43f5e', label: 'DEPLOYS', x: 115 },
    { text: '161', color: '#06b6d4', label: 'ACTIVE', x: 325 },
    { text: '47', color: '#22c55e', label: 'NODES', x: 535 },
    { text: '34', color: '#22c55e', label: 'ROOMS', x: 735 },
    { text: '34', color: '#22c55e', label: 'SFU', x: 915 }
  ];

  topKPIs.forEach(({ text, color, label, x }) => {
    kCtx.fillStyle = color;
    kCtx.shadowColor = color;
    kCtx.shadowBlur = 22;
    kCtx.fillText(text, x, 155);
    kCtx.shadowBlur = 0;
    kCtx.fillStyle = '#64748b';
    kCtx.font = 'bold 16px sans-serif';
    kCtx.fillText(label, x, 220);
    kCtx.font = 'bold 96px "Courier New", monospace';
  });

  const btmKPIs = [
    { text: '83', color: '#38bdf8', label: 'GATEWAY', x: 115 },
    { text: '85', color: '#38bdf8', label: 'PINGS', x: 325 },
    { text: '6', color: '#f8fafc', label: 'ZONES', x: 535 },
    { text: '52', color: '#38bdf8', label: 'MSGS/S', x: 735 },
    { text: '25', color: '#22c55e', label: 'AGENTS', x: 915 }
  ];

  btmKPIs.forEach(({ text, color, label, x }) => {
    kCtx.fillStyle = color;
    kCtx.shadowColor = color;
    kCtx.shadowBlur = 22;
    kCtx.fillText(text, x, 345);
    kCtx.shadowBlur = 0;
    kCtx.fillStyle = '#64748b';
    kCtx.font = 'bold 16px sans-serif';
    kCtx.fillText(label, x, 410);
    kCtx.font = 'bold 96px "Courier New", monospace';
  });

  const kpiTexture = new THREE.CanvasTexture(kpiCanvas);

  // 3. Technical Architecture Blueprint
  const archCanvas = document.createElement('canvas');
  archCanvas.width = 1024;
  archCanvas.height = 512;
  const aCtx = archCanvas.getContext('2d');
  aCtx.fillStyle = '#ffffff';
  aCtx.fillRect(0, 0, 1024, 512);

  // Title
  aCtx.fillStyle = '#0f172a';
  aCtx.font = 'bold 26px sans-serif';
  aCtx.fillText('Spot Distributed System Flow', 60, 48);

  aCtx.strokeStyle = '#94a3b8';
  aCtx.lineWidth = 3;
  aCtx.strokeRect(80, 70, 360, 380);
  aCtx.strokeRect(540, 70, 400, 380);

  aCtx.fillStyle = '#f8fafc';
  aCtx.fillRect(100, 100, 320, 60);
  aCtx.fillRect(100, 180, 320, 60);
  aCtx.fillRect(100, 260, 320, 60);

  aCtx.fillStyle = '#1e293b';
  aCtx.font = 'bold 18px sans-serif';
  aCtx.fillText('Three.js Viewport Layer', 120, 136);
  aCtx.fillText('WebRTC Spatial Audio Engine', 120, 216);
  aCtx.fillText('OpenClaw Tool Gateway (v0.2.0)', 120, 296);

  aCtx.fillStyle = '#fef08a';
  aCtx.fillRect(450, 100, 80, 60);
  aCtx.fillStyle = '#fbcfe8';
  aCtx.fillRect(450, 200, 80, 60);

  aCtx.strokeStyle = '#ef4444';
  aCtx.lineWidth = 4;
  aCtx.beginPath();
  aCtx.moveTo(420, 130);
  aCtx.lineTo(540, 130);
  aCtx.stroke();

  aCtx.beginPath();
  aCtx.moveTo(420, 230);
  aCtx.lineTo(540, 230);
  aCtx.stroke();

  const archTexture = new THREE.CanvasTexture(archCanvas);

  // 4. "New Features" Roadmap Board
  const featCanvas = document.createElement('canvas');
  featCanvas.width = 512;
  featCanvas.height = 512;
  const featCtx = featCanvas.getContext('2d');
  featCtx.fillStyle = '#ffffff';
  featCtx.fillRect(0, 0, 512, 512);

  featCtx.fillStyle = '#0f172a';
  featCtx.font = 'bold 36px sans-serif';
  featCtx.fillText('New Features', 40, 68);

  // Row 1: Calendar
  featCtx.fillStyle = '#f8fafc';
  featCtx.beginPath();
  featCtx.roundRect(40, 105, 432, 60, 8);
  featCtx.fill();
  featCtx.fillStyle = '#334155';
  featCtx.font = '600 24px sans-serif';
  featCtx.fillText('Calendar', 60, 144);
  featCtx.fillText('0%', 420, 144);

  // Row 2: Spot Prints (Highlighted in blue banner)
  featCtx.fillStyle = '#2563eb';
  featCtx.beginPath();
  featCtx.roundRect(40, 185, 432, 65, 8);
  featCtx.fill();
  featCtx.fillStyle = '#ffffff';
  featCtx.font = 'bold 24px sans-serif';
  featCtx.fillText('Spot Prints', 60, 226);
  featCtx.fillText('100%', 400, 226);

  // Row 3: Documents
  featCtx.fillStyle = '#f8fafc';
  featCtx.beginPath();
  featCtx.roundRect(40, 270, 432, 60, 8);
  featCtx.fill();
  featCtx.fillStyle = '#334155';
  featCtx.font = '600 24px sans-serif';
  featCtx.fillText('Documents', 60, 309);
  featCtx.fillText('0%', 420, 309);

  const featTexture = new THREE.CanvasTexture(featCanvas);

  // 5. Mobile Schedule Stand ("10:42 1 on 1 with Stan")
  const schedCanvas = document.createElement('canvas');
  schedCanvas.width = 512;
  schedCanvas.height = 768;
  const sCtx = schedCanvas.getContext('2d');
  sCtx.fillStyle = '#ffffff';
  sCtx.fillRect(0, 0, 512, 768);

  sCtx.fillStyle = '#0f172a';
  sCtx.font = 'bold 58px sans-serif';
  sCtx.fillText('10:42', 50, 95);

  const bColors = ['#f59e0b', '#ef4444', '#06b6d4', '#10b981', '#8b5cf6'];
  bColors.forEach((col, idx) => {
    sCtx.fillStyle = col;
    sCtx.fillRect(50 + idx * 75, 260 - (idx % 3) * 50, 65, 180 + (idx % 3) * 50);
  });

  sCtx.fillStyle = '#1e293b';
  sCtx.font = 'bold 32px sans-serif';
  sCtx.fillText('1 on 1 with Stan', 50, 520);

  sCtx.fillStyle = '#22c55e';
  sCtx.beginPath();
  sCtx.roundRect(50, 560, 180, 55, 12);
  sCtx.fill();
  sCtx.fillStyle = '#ffffff';
  sCtx.font = 'bold 22px sans-serif';
  sCtx.fillText('Schedule', 85, 595);

  const schedTexture = new THREE.CanvasTexture(schedCanvas);

  // 6. Generic "No meetings" Screen Generator
  const createNoMeetTexture = (timeStr) => {
    const nmCanvas = document.createElement('canvas');
    nmCanvas.width = 512;
    nmCanvas.height = 256;
    const nmCtx = nmCanvas.getContext('2d');
    nmCtx.fillStyle = '#ffffff';
    nmCtx.fillRect(0, 0, 512, 256);

    // Decorative graphic thumbnail
    nmCtx.fillStyle = '#38bdf8';
    nmCtx.fillRect(30, 30, 140, 196);
    nmCtx.fillStyle = '#fef08a';
    nmCtx.beginPath();
    nmCtx.arc(70, 70, 22, 0, Math.PI * 2);
    nmCtx.fill();
    nmCtx.fillStyle = '#22c55e';
    nmCtx.beginPath();
    nmCtx.arc(100, 226, 70, Math.PI, 0);
    nmCtx.fill();

    nmCtx.fillStyle = '#0f172a';
    nmCtx.font = 'bold 44px sans-serif';
    nmCtx.fillText(timeStr, 200, 95);
    nmCtx.fillStyle = '#64748b';
    nmCtx.font = '500 24px sans-serif';
    nmCtx.fillText('No meetings', 200, 148);

    return new THREE.CanvasTexture(nmCanvas);
  };

  // 7. Spot Logo Wall Sign Texture
  const logoCanvas = document.createElement('canvas');
  logoCanvas.width = 512;
  logoCanvas.height = 256;
  const lCtx = logoCanvas.getContext('2d');
  lCtx.fillStyle = '#05070a';
  lCtx.fillRect(0, 0, 512, 256);

  // Spot Green Dot
  lCtx.fillStyle = '#22c55e';
  lCtx.beginPath();
  lCtx.arc(120, 128, 38, 0, Math.PI * 2);
  lCtx.fill();

  // Spot Text
  lCtx.fillStyle = '#ffffff';
  lCtx.font = 'bold 84px sans-serif';
  lCtx.fillText('spot', 185, 156);

  const logoTexture = new THREE.CanvasTexture(logoCanvas);

  // 8. Starry Space Spot Galaxy Screensaver (Matching media_1791967521142.png)
  const createStarryLogoTexture = () => {
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 1024;
    sCanvas.height = 576;
    const sCtx = sCanvas.getContext('2d');

    // Deep space black backdrop
    sCtx.fillStyle = '#05070e';
    sCtx.fillRect(0, 0, 1024, 576);

    // Scattered twinkling stars
    for (let i = 0; i < 350; i++) {
      const sx = Math.random() * 1024;
      const sy = Math.random() * 576;
      const sr = Math.random() * 1.8 + 0.4;
      const alpha = Math.random() * 0.85 + 0.15;
      sCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      sCtx.beginPath();
      sCtx.arc(sx, sy, sr, 0, Math.PI * 2);
      sCtx.fill();
    }

    // Centered Glowing Green Spot Orb & Typography
    const centerX = 512;
    const centerY = 288;

    // Soft Radial Glow
    const glowGrad = sCtx.createRadialGradient(centerX - 110, centerY, 10, centerX - 110, centerY, 120);
    glowGrad.addColorStop(0, 'rgba(34, 197, 94, 0.45)');
    glowGrad.addColorStop(1, 'rgba(34, 197, 94, 0)');
    sCtx.fillStyle = glowGrad;
    sCtx.beginPath();
    sCtx.arc(centerX - 110, centerY, 120, 0, Math.PI * 2);
    sCtx.fill();

    // 3D Beveled Green Sphere
    const orbGrad = sCtx.createRadialGradient(centerX - 125, centerY - 15, 12, centerX - 110, centerY, 52);
    orbGrad.addColorStop(0, '#86efac');
    orbGrad.addColorStop(0.5, '#22c55e');
    orbGrad.addColorStop(1, '#15803d');
    sCtx.fillStyle = orbGrad;
    sCtx.beginPath();
    sCtx.arc(centerX - 110, centerY, 52, 0, Math.PI * 2);
    sCtx.fill();

    // White "spot" typography
    sCtx.fillStyle = '#ffffff';
    sCtx.font = 'bold 120px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    sCtx.textAlign = 'left';
    sCtx.textBaseline = 'middle';
    sCtx.fillText('spot', centerX - 25, centerY + 8);

    return new THREE.CanvasTexture(sCanvas);
  };

  // 9. Countdown Timer & Meeting Clock Texture
  const createTimerTexture = (timeString = '24:59', title = 'Lightning Talk Timer') => {
    const tCanvas = document.createElement('canvas');
    tCanvas.width = 1024;
    tCanvas.height = 512;
    const tCtx = tCanvas.getContext('2d');
    tCtx.fillStyle = '#0f172a';
    tCtx.fillRect(0, 0, 1024, 512);

    tCtx.strokeStyle = '#38bdf8';
    tCtx.lineWidth = 6;
    tCtx.strokeRect(20, 20, 984, 472);

    tCtx.fillStyle = '#94a3b8';
    tCtx.font = 'bold 32px sans-serif';
    tCtx.textAlign = 'center';
    tCtx.fillText(title.toUpperCase(), 512, 100);

    tCtx.fillStyle = '#38bdf8';
    tCtx.font = 'bold 160px "Courier New", monospace';
    tCtx.shadowColor = '#0284c7';
    tCtx.shadowBlur = 24;
    tCtx.fillText(timeString, 512, 280);
    tCtx.shadowBlur = 0;

    tCtx.fillStyle = '#22c55e';
    tCtx.font = 'bold 24px sans-serif';
    tCtx.fillText('● PRESENTATION ACTIVE &bull; SPOT SYNC', 512, 420);

    return new THREE.CanvasTexture(tCanvas);
  };

  // 10. Sprint Planning & Standup Kanban Board (Conference Room B)
  const createSprintBoardTexture = () => {
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 1024;
    sCanvas.height = 576;
    const ctx = sCanvas.getContext('2d');

    // Modern Dark Slate Background
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 0, 1024, 576);

    // Top Header Banner
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 1024, 76);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('⚡ SPRINT 42: PRODUCTION LAUNCH • CONFERENCE ROOM B', 36, 48);

    // Live Standup Badge
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(830, 20, 156, 36, 18);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('● LIVE STANDUP', 908, 44);
    ctx.textAlign = 'left';

    // 3 Kanban Columns
    const cols = [
      { title: 'TO DO (3)', x: 36, w: 296, color: '#f59e0b' },
      { title: 'IN PROGRESS (2)', x: 364, w: 296, color: '#38bdf8' },
      { title: 'DONE (6)', x: 692, w: 296, color: '#10b981' }
    ];

    cols.forEach((col) => {
      // Column Container
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(col.x, 96, col.w, 410, 10);
      ctx.fill();

      // Column Header
      ctx.fillStyle = col.color;
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(col.title, col.x + 18, 130);

      // Card 1
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(col.x + 12, 148, col.w - 24, 95, 8);
      ctx.fill();

      // Card 2
      ctx.beginPath();
      ctx.roundRect(col.x + 12, 255, col.w - 24, 95, 8);
      ctx.fill();

      // Card 3
      ctx.beginPath();
      ctx.roundRect(col.x + 12, 362, col.w - 24, 95, 8);
      ctx.fill();
    });

    // Cards content
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('[UX] Workstation Monitors', 54, 184);
    ctx.fillText('[Ops] Vercel CDN Cache', 54, 291);
    ctx.fillText('[Sec] WebRTC Key Auth', 54, 398);

    ctx.fillText('[3D] Screen Telecasting', 382, 184);
    ctx.fillText('[Kinematics] Avatar Sitting', 382, 291);
    ctx.fillText('[Audio] Spatial Range', 382, 398);

    ctx.fillText('[Rooms] 12 Authentic Spaces', 710, 184);
    ctx.fillText('[Build] Zero Lag 60 FPS', 710, 291);
    ctx.fillText('[Routing] Direct Room URLs', 710, 398);

    // Tags
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Assigned to: Steven • High Priority', 54, 215);
    ctx.fillText('Assigned to: Alex • Infra', 54, 322);
    ctx.fillText('Assigned to: Chloe • Security', 54, 429);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Assigned to: Ayush • In Review', 382, 215);
    ctx.fillText('Assigned to: Sarah • Polishing', 382, 322);
    ctx.fillText('Assigned to: Phil • Active', 382, 429);

    ctx.fillStyle = '#10b981';
    ctx.fillText('Verified by Ayush ✓', 710, 215);
    ctx.fillText('Merged to main ✓', 710, 322);
    ctx.fillText('Deployed to Vercel ✓', 710, 429);

    // Bottom Stats Bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 520, 1024, 56);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Sprint Progress: 28 of 34 Story Points (82% Completed) • 3 Days Remaining', 36, 555);

    return new THREE.CanvasTexture(sCanvas);
  };

  // 11. Auditorium Global All-Hands Keynote Screen
  const createAuditoriumKeynoteTexture = () => {
    const aCanvas = document.createElement('canvas');
    aCanvas.width = 1024;
    aCanvas.height = 576;
    const ctx = aCanvas.getContext('2d');

    // Deep cosmic indigo gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 576);
    bgGrad.addColorStop(0, '#030712');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 576);

    // Glowing stage lights accent
    const glow = ctx.createRadialGradient(512, 180, 20, 512, 180, 480);
    glow.addColorStop(0, 'rgba(129, 140, 248, 0.28)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1024, 576);

    // Top Live Badge
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(40, 36, 170, 38, 19);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('● LIVE KEYNOTE', 125, 61);

    // Audience Count
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(810, 36, 174, 38, 19);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText('👥 420 TUNED IN', 897, 61);

    // Title & Typography
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('SPOT GLOBAL ALL-HANDS 2026', 512, 210);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 28px sans-serif';
    ctx.fillText('The Future of Immersive Telepresence & Autonomous Spaces', 512, 270);

    // Speaker Pill
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(240, 340, 544, 76, 38);
    ctx.fill();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('🎤 Speaker: Ayush Kesharwani', 512, 374);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px sans-serif';
    ctx.fillText('Founder & Lead System Architect • Spot Virtual Platform', 512, 400);

    // Bottom Stage Footer
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('AUDITORIUM MAIN STAGE • RECORDING & LIVE SPATIAL AUDIO ACTIVE', 512, 490);
    ctx.textAlign = 'left';

    return new THREE.CanvasTexture(aCanvas);
  };

  // 12. Workspace A Team CI/CD & Deployments Monitor
  const createCiCdMonitorTexture = () => {
    const cCanvas = document.createElement('canvas');
    cCanvas.width = 1024;
    cCanvas.height = 576;
    const ctx = cCanvas.getContext('2d');

    // GitHub Dark background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, 1024, 576);

    // Header
    ctx.fillStyle = '#161b22';
    ctx.fillRect(0, 0, 1024, 70);
    ctx.fillStyle = '#58a6ff';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('🐙 GITHUB ACTIONS & PRODUCTION WORKFLOWS • WORKSPACE A', 36, 44);

    const pipelines = [
      { name: 'production-deploy', branch: 'main', commit: '#412 a43a975', time: '42s ago', status: '✓ Passed', color: '#238636' },
      { name: 'virtual-workspace-e2e', branch: 'main', commit: '#411 9oDDA8s', time: '12m ago', status: '✓ 24/24 Passed', color: '#238636' },
      { name: 'webrtc-sfu-mesh-cluster', branch: 'main', commit: '#410 7c89f1b', time: '1h ago', status: '✓ Healthy (14ms)', color: '#238636' },
      { name: 'spatial-audio-range-tests', branch: 'feat/audio', commit: '#409 e2a849c', time: '2h ago', status: '✓ 18/18 Passed', color: '#238636' }
    ];

    pipelines.forEach((p, idx) => {
      const y = 92 + idx * 82;
      ctx.fillStyle = '#161b22';
      ctx.beginPath();
      ctx.roundRect(36, y, 952, 68, 8);
      ctx.fill();

      ctx.strokeStyle = '#30363d';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Status pill
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(56, y + 16, 160, 36, 6);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(p.status, 136, y + 39);
      ctx.textAlign = 'left';

      // Pipeline info
      ctx.fillStyle = '#e6edf3';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(p.name, 236, y + 36);

      ctx.fillStyle = '#8b949e';
      ctx.font = '14px monospace';
      ctx.fillText(`Branch: ${p.branch}  |  Commit: ${p.commit}  |  Run: ${p.time}`, 236, y + 56);
    });

    // System Metrics Footer
    ctx.fillStyle = '#161b22';
    ctx.fillRect(0, 440, 1024, 136);

    const metrics = [
      { label: 'PRODUCTION UPTIME', val: '99.99%', color: '#3fb950' },
      { label: 'GLOBAL SFU LATENCY', val: '14.2 ms', color: '#58a6ff' },
      { label: 'DEPLOYMENTS TODAY', val: '168 Deploys', color: '#d29922' },
      { label: 'ACTIVE SPOT SCREENS', val: '16 Active', color: '#bc8cff' }
    ];

    metrics.forEach((m, idx) => {
      const mx = 60 + idx * 240;
      ctx.fillStyle = m.color;
      ctx.font = 'bold 32px monospace';
      ctx.fillText(m.val, mx, 495);
      ctx.fillStyle = '#8b949e';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(m.label, mx, 528);
    });

    return new THREE.CanvasTexture(cCanvas);
  };

  // 13. Developer IDE Code Editor (Chat A & Workstation Desk Monitors)
  const createCodeEditorTexture = (fileName = 'WorkspacePlatform.jsx') => {
    const eCanvas = document.createElement('canvas');
    eCanvas.width = 1024;
    eCanvas.height = 576;
    const ctx = eCanvas.getContext('2d');

    // VS Code Dark Theme
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, 0, 1024, 576);

    // Tab Bar
    ctx.fillStyle = '#252526';
    ctx.fillRect(0, 0, 1024, 46);

    // Active Tab
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(40, 0, 240, 46);
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 16px -apple-system, sans-serif';
    ctx.fillText(`⚛ ${fileName}`, 60, 29);

    // Inactive Tabs
    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px sans-serif';
    ctx.fillText('ScreenTelecast.ts', 310, 29);
    ctx.fillText('OfficeEnvironment.js', 470, 29);

    // Code lines
    const codeLines = [
      { num: 1, tokens: [{ t: 'import', c: '#c586c0' }, { t: ' { ScreenTelecast, SpatialAudio } ', c: '#9cdcfe' }, { t: 'from', c: '#c586c0' }, { t: " '@spot/core';", c: '#ce9178' }] },
      { num: 2, tokens: [{ t: '', c: '#ffffff' }] },
      { num: 3, tokens: [{ t: 'export', c: '#c586c0' }, { t: ' async', c: '#569cd6' }, { t: ' function', c: '#569cd6' }, { t: ' telecastToScreen', c: '#dcdcaa' }, { t: '(screenId, mediaStream) {', c: '#ffd700' }] },
      { num: 4, tokens: [{ t: '  // Connect dedicated WebRTC video track to 3D mesh', c: '#6a9955' }] },
      { num: 5, tokens: [{ t: '  const', c: '#569cd6' }, { t: ' targetMesh = ', c: '#9cdcfe' }, { t: 'getOfficeScreen', c: '#dcdcaa' }, { t: '(screenId);', c: '#ffd700' }] },
      { num: 6, tokens: [{ t: '  targetMesh.material.map = ', c: '#9cdcfe' }, { t: 'new', c: '#569cd6' }, { t: ' THREE.VideoTexture(mediaStream);', c: '#4ec9b0' }] },
      { num: 7, tokens: [{ t: '  targetMesh.material.needsUpdate = ', c: '#9cdcfe' }, { t: 'true;', c: '#569cd6' }] },
      { num: 8, tokens: [{ t: '  await', c: '#c586c0' }, { t: ' notifyRoomPeers', c: '#dcdcaa' }, { t: '(screenId, { isBroadcasting: ', c: '#9cdcfe' }, { t: 'true', c: '#569cd6' }, { t: ' });', c: '#ffd700' }] },
      { num: 9, tokens: [{ t: '  return', c: '#c586c0' }, { t: ' { ok: ', c: '#9cdcfe' }, { t: 'true', c: '#569cd6' }, { t: ', activeScreen: screenId, fps: 60 };', c: '#9cdcfe' }] },
      { num: 10, tokens: [{ t: '}', c: '#ffd700' }] },
      { num: 11, tokens: [{ t: '', c: '#ffffff' }] },
      { num: 12, tokens: [{ t: '// Standup Ready: 16 Screens Active in Spot Office', c: '#6a9955' }] }
    ];

    ctx.font = '16px "Courier New", monospace';
    codeLines.forEach((line, idx) => {
      const y = 84 + idx * 30;

      // Line number
      ctx.fillStyle = '#858585';
      ctx.textAlign = 'right';
      ctx.fillText(String(line.num), 45, y);
      ctx.textAlign = 'left';

      // Tokens
      let curX = 68;
      line.tokens.forEach((tok) => {
        ctx.fillStyle = tok.c;
        ctx.fillText(tok.t, curX, y);
        curX += ctx.measureText(tok.t).width;
      });
    });

    // Bottom Terminal Status Bar
    ctx.fillStyle = '#007acc';
    ctx.fillRect(0, 542, 1024, 34);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px -apple-system, sans-serif';
    ctx.fillText('⚡ SPOT WORKSPACE IDE • TypeScript 5.4 • UTF-8 • 60 FPS • Node.js v24.15', 24, 564);

    return new THREE.CanvasTexture(eCanvas);
  };

  // 14. Terminal & DevOps Console (Workstation Desk Monitor 2)
  const createTerminalLogsTexture = () => {
    const tCanvas = document.createElement('canvas');
    tCanvas.width = 1024;
    tCanvas.height = 576;
    const ctx = tCanvas.getContext('2d');

    // Terminal Black
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 1024, 576);

    // Terminal top bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 1024, 38);

    // Mac dots
    ['#ef4444', '#f59e0b', '#10b981'].forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(24 + i * 20, 19, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('ayush@spot-desktop: ~/virtual-store (zsh)', 100, 24);

    // Terminal output
    const lines = [
      { text: 'ayush@spot-desktop:~/virtual-store$ pnpm run dev --host', color: '#38bdf8' },
      { text: '  VITE v6.4.3  ready in 218 ms', color: '#10b981' },
      { text: '', color: '#ffffff' },
      { text: '  ➜  Local:   http://localhost:5173/@office/@conference-b', color: '#22c55e' },
      { text: '  ➜  Network: https://spot-virtual.vercel.app', color: '#38bdf8' },
      { text: '', color: '#ffffff' },
      { text: '[WebRTC] Spatial audio mesh connected: 12 peers in range', color: '#a855f7' },
      { text: '[Raycaster] Priority screen & workstation monitor detection active', color: '#facc15' },
      { text: '[Screens] Initialized 16 dedicated independent office screens', color: '#10b981' },
      { text: '[Telecast] Screen share VideoTexture pipe ready on port 4569', color: '#38bdf8' },
      { text: '✓ 1615 modules transformed. Watching for file changes...', color: '#64748b' }
    ];

    ctx.font = '16px "Courier New", monospace';
    lines.forEach((l, i) => {
      ctx.fillStyle = l.color;
      ctx.fillText(l.text, 24, 76 + i * 36);
    });

    return new THREE.CanvasTexture(tCanvas);
  };

  // 15. Figma / UI Design Canvas (Workstation Desk Monitor 3)
  const createDesignCanvasTexture = () => {
    const dCanvas = document.createElement('canvas');
    dCanvas.width = 1024;
    dCanvas.height = 576;
    const ctx = dCanvas.getContext('2d');

    // Figma dark canvas
    ctx.fillStyle = '#1e1e24';
    ctx.fillRect(0, 0, 1024, 576);

    // Header
    ctx.fillStyle = '#2c2c34';
    ctx.fillRect(0, 0, 1024, 44);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('🎨 Figma — Spot Virtual Design System v2.0', 36, 28);

    // Artboard 1: 12-Icon Tool Pill Mockup
    ctx.fillStyle = '#2b2b36';
    ctx.fillRect(40, 70, 440, 450);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('Artboard: 12-Icon Tool Pill', 60, 105);

    // Mock pill inside
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(60, 140, 400, 56, 10);
    ctx.fill();

    const pillIcons = ['🖥️', '📹', '🖼️', '🌐', '👥', '🟢', '📄', '📊', '▶️', '📅', '⏱️', '🔲'];
    ctx.font = '20px sans-serif';
    pillIcons.forEach((ico, idx) => {
      ctx.fillText(ico, 76 + idx * 32, 176);
    });

    // Artboard 2: Color Palette
    ctx.fillStyle = '#2b2b36';
    ctx.fillRect(520, 70, 460, 450);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('Design Tokens: Office Palette', 540, 105);

    const swatches = [
      { name: 'Spot Emerald', hex: '#22c55e' },
      { name: 'Sky Telecast', hex: '#38bdf8' },
      { name: 'Cosmic Indigo', hex: '#6366f1' },
      { name: 'Slate Acoustic', hex: '#334155' },
      { name: 'Amber Alert', hex: '#f59e0b' }
    ];

    swatches.forEach((sw, idx) => {
      const sy = 145 + idx * 64;
      ctx.fillStyle = sw.hex;
      ctx.beginPath();
      ctx.roundRect(540, sy, 52, 52, 8);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(sw.name, 610, sy + 25);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px monospace';
      ctx.fillText(sw.hex, 610, sy + 46);
    });

    return new THREE.CanvasTexture(dCanvas);
  };

  // 16. Social & Community Wall (Lounge A)
  const createSocialWallTexture = () => {
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 1024;
    sCanvas.height = 576;
    const ctx = sCanvas.getContext('2d');

    // Light modern clean background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 1024, 576);

    // Top banner
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(0, 0, 1024, 76);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px -apple-system, sans-serif';
    ctx.fillText('🎉 SPOT COMMUNITY WALL & ANNOUNCEMENTS • LOUNGE A', 36, 48);

    const posts = [
      { title: '🚀 Production Launch Complete!', body: 'Awesome work to Ayush and team on the pixel-perfect 3D Spot virtual office.', badge: 'Kudos', bg: '#dbeafe', bCol: '#1d4ed8', x: 40, y: 104, w: 450, h: 180 },
      { title: '☕ Friday Social & Game Night', body: 'Join us at 4:30 PM in Lounge B for Connect Four and music stream on the video wall.', badge: 'Events', bg: '#fef3c7', bCol: '#b45309', x: 530, y: 104, w: 450, h: 180 },
      { title: '🏆 Hackathon Winners Announced', body: 'Team Spot Virtual took 1st place with spatial audio integration and multi-screen sharing.', badge: 'Awards', bg: '#dcfce7', bCol: '#15803d', x: 40, y: 310, w: 450, h: 180 },
      { title: '👋 Welcome to New Team Members', body: 'Give a warm welcome to our 4 new engineers joining us in Workspace A today!', badge: 'Team', bg: '#f3e8ff', bCol: '#7e22ce', x: 530, y: 310, w: 450, h: 180 }
    ];

    posts.forEach((p) => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.w, p.h, 12);
      ctx.fill();

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Badge
      ctx.fillStyle = p.bg;
      ctx.beginPath();
      ctx.roundRect(p.x + 20, p.y + 18, 80, 28, 6);
      ctx.fill();
      ctx.fillStyle = p.bCol;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(p.badge, p.x + 36, p.y + 37);

      // Title
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(p.title, p.x + 115, p.y + 38);

      // Body
      ctx.fillStyle = '#475569';
      ctx.font = '15px sans-serif';
      ctx.fillText(p.body, p.x + 20, p.y + 85);
      ctx.fillText('● 12 Reactions • 4 Comments', p.x + 20, p.y + 145);
    });

    return new THREE.CanvasTexture(sCanvas);
  };

  // 17. High-Definition Live Telecast Display (Active Screen Share)
  const createTelecastLiveTexture = (screenName = 'Conference Screen', userName = 'Ayush Kesharwani') => {
    const tCanvas = document.createElement('canvas');
    tCanvas.width = 1024;
    tCanvas.height = 576;
    const ctx = tCanvas.getContext('2d');

    // Deep modern dark broadcast navy
    ctx.fillStyle = '#070c18';
    ctx.fillRect(0, 0, 1024, 576);

    // Top live broadcast banner
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 1024, 64);

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(36, 32, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.fillText(`LIVE TELECAST • ${screenName.toUpperCase()}`, 60, 40);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`BROADCASTING: ${userName.toUpperCase()} (YOU)`, 988, 40);
    ctx.textAlign = 'left';

    // Broadcast frame
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 84, 952, 420);

    // Inner preview simulation
    ctx.fillStyle = '#0b1329';
    ctx.fillRect(40, 88, 944, 412);

    // Desktop window preview UI
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(60, 110, 904, 38);

    ['#ef4444', '#f59e0b', '#10b981'].forEach((col, idx) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(84 + idx * 20, 129, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('Desktop Screen Mirror — Primary Display (1920x1080 @ 60 FPS)', 150, 134);

    // Chart inside preview
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('Spot Virtual Workspace Live Telecast', 120, 230);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '20px sans-serif';
    ctx.fillText('Sharing window and system audio directly to the 3D office display', 120, 275);

    // WebRTC connection indicators
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('● WebRTC MediaStream Active • Encrypted TLS 1.3 • Latency 14ms', 120, 360);
    ctx.fillText('● Resolution: 1080p 60 FPS • Codec: VP9 / Opus Spatial Audio', 120, 400);

    // Bottom status bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 526, 1024, 50);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Press "Screen Share" in bottom dock or screen tool pill to toggle telecast.', 36, 556);

    return new THREE.CanvasTexture(tCanvas);
  };

  // 18. YouTube Player Texture
  const createYoutubePlayerTexture = (url = '', title = 'Spot Virtual All-Hands Keynote') => {
    const yCanvas = document.createElement('canvas');
    yCanvas.width = 1024;
    yCanvas.height = 576;
    const ctx = yCanvas.getContext('2d');

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, 1024, 576);

    // Video backdrop gradient
    const vidGrad = ctx.createLinearGradient(0, 0, 1024, 576);
    vidGrad.addColorStop(0, '#111827');
    vidGrad.addColorStop(1, '#030712');
    ctx.fillStyle = vidGrad;
    ctx.fillRect(0, 0, 1024, 576);

    // Top Title Bar
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.fillText(`▶ YouTube • ${title}`, 40, 48);

    // Center Big Red Play Button with Glow
    const glow = ctx.createRadialGradient(512, 288, 20, 512, 288, 120);
    glow.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(512, 288, 120, 0, Math.PI * 2);
    ctx.fill();

    // Red pill
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(452, 248, 120, 80, 24);
    ctx.fill();

    // White triangle
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(502, 268);
    ctx.lineTo(534, 288);
    ctx.lineTo(502, 308);
    ctx.closePath();
    ctx.fill();

    // Bottom Scrubber Bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 510, 1024, 66);

    // Red progress bar
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(0, 510, 480, 6);
    ctx.fillStyle = '#4b5563';
    ctx.fillRect(480, 510, 544, 6);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('08:42 / 24:15  •  1080p HD  •  Spot Telecast Active', 40, 548);

    return new THREE.CanvasTexture(yCanvas);
  };

  // 19. Collaborative Document / Notes Texture
  const createDocumentDisplayTexture = (title = 'Meeting Architecture Manifesto', text = '') => {
    const docCanvas = document.createElement('canvas');
    docCanvas.width = 1024;
    docCanvas.height = 576;
    const ctx = docCanvas.getContext('2d');

    // Clean Notion White Paper
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1024, 576);

    // Left border accent
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(0, 0, 12, 576);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px -apple-system, sans-serif';
    ctx.fillText(`📄 ${title}`, 50, 68);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('Last edited by Ayush Kesharwani • Live collaborative document sync', 54, 105);

    // Horizontal line
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 125);
    ctx.lineTo(974, 125);
    ctx.stroke();

    const docItems = text ? text.split('\n') : [
      '• Phase 1: Rebuilt authentic 12-space layout matching Spot Virtual desktop reference.',
      '• Phase 2: Raycasting multi-hit hierarchy: Screens > Tabletop Widgets > Click-to-Sit > Floor.',
      '• Phase 3: Connected 12-icon floating tool pill for screen sharing, YouTube, and timer.',
      '• Phase 4: Each screen and workstation monitor possesses an independent role and state.',
      '• Phase 5: Verified real-time telecasting and full zero-lag 60 FPS performance.'
    ];

    ctx.fillStyle = '#1e293b';
    ctx.font = '500 20px -apple-system, sans-serif';
    docItems.slice(0, 7).forEach((item, idx) => {
      ctx.fillText(item, 50, 175 + idx * 46);
    });

    return new THREE.CanvasTexture(docCanvas);
  };

  const starryLogoTexture = createStarryLogoTexture();

  return {
    chartTexture,
    kpiTexture,
    archTexture,
    featTexture,
    schedTexture,
    logoTexture,
    starryLogoTexture,
    createNoMeetTexture,
    createStarryLogoTexture,
    createTimerTexture,
    createSprintBoardTexture,
    createAuditoriumKeynoteTexture,
    createCiCdMonitorTexture,
    createCodeEditorTexture,
    createTerminalLogsTexture,
    createDesignCanvasTexture,
    createSocialWallTexture,
    createTelecastLiveTexture,
    createYoutubePlayerTexture,
    createDocumentDisplayTexture
  };
}
