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

  return {
    chartTexture,
    kpiTexture,
    archTexture,
    featTexture,
    schedTexture,
    logoTexture,
    createNoMeetTexture
  };
}
