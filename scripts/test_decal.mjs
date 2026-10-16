import * as THREE from 'three';

console.log('--- Checking CylinderGeometry Math ---');
const radius = 0.263;
const thetaStart = Math.PI * 1.65;
const thetaLength = Math.PI * 0.70;
const geo = new THREE.CylinderGeometry(radius, radius, 0.36, 28, 1, true, thetaStart, thetaLength);

const pos = geo.attributes.position;
const uvs = geo.attributes.uv;

console.log('Vertex count:', pos.count);
let minX = 999, maxX = -999, minZ = 999, maxZ = -999;
for (let i = 0; i < pos.count; i++) {
  const x = pos.getX(i);
  const z = pos.getZ(i);
  if (x < minX) minX = x;
  if (x > maxX) maxX = x;
  if (z < minZ) minZ = z;
  if (z > maxZ) maxZ = z;
}
console.log(`X range: [${minX.toFixed(3)}, ${maxX.toFixed(3)}]`);
console.log(`Z range: [${minZ.toFixed(3)}, ${maxZ.toFixed(3)}]`);

// Check center vertex at mid-arc
const midIdx = Math.floor(28 / 2);
console.log(`Mid vertex (approx center of face): X=${pos.getX(midIdx).toFixed(3)}, Z=${pos.getZ(midIdx).toFixed(3)}`);
console.log(`UV at i=0: [${uvs.getX(0)}, ${uvs.getY(0)}], pos: X=${pos.getX(0).toFixed(3)}, Z=${pos.getZ(0).toFixed(3)}`);
console.log(`UV at i=28: [${uvs.getX(28)}, ${uvs.getY(28)}], pos: X=${pos.getX(28).toFixed(3)}, Z=${pos.getZ(28).toFixed(3)}`);
