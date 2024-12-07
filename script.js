document.getElementById('generateBtn').addEventListener('click', drawShape);
document.getElementById('downloadBtn').addEventListener('click', downloadPNG);

function drawShape() {
  const shape = document.getElementById('shapeSelect').value;
  const numParts = parseInt(document.getElementById('numPartsSelect').value,10);
  const partsToShade = parseInt(document.getElementById('partsToShadeSelect').value,10);
  const shadeColor = document.getElementById('shadeColor').value;

  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000';

  const cx = canvas.width/2;
  const cy = canvas.height/2;
  const size = 100;

  let coords = [];
  let parts = [];

  // Decide method: regular polygons & circle & stars -> angle-based.
  // Quadrilaterals -> vertical slicing.

  // Quadrilaterals: square, rectangle, rhombus, parallelogram, trapezoid
  // All others: angle-based

  let quadShapes = ['square','rectangle','rhombus','parallelogram','trapezoid'];

  switch(shape) {
    case 'circle':
      coords = circleCoords(cx, cy, size);
      drawPolygon(ctx, coords);
      parts = dividePolygonByAngle(coords, numParts);
      break;
    case 'triangle':
      coords = regularPolygonCoords(cx, cy, 3, size);
      drawPolygon(ctx, coords);
      parts = dividePolygonByAngle(coords, numParts);
      break;
    case 'pentagon':
      coords = regularPolygonCoords(cx, cy, 5, size);
      drawPolygon(ctx, coords);
      parts = dividePolygonByAngle(coords, numParts);
      break;
    case 'hexagon':
      coords = regularPolygonCoords(cx, cy, 6, size);
      drawPolygon(ctx, coords);
      parts = dividePolygonByAngle(coords, numParts);
      break;
    case 'star4':
      coords = starCoords(cx, cy, 4, size, size/2);
      drawPolygon(ctx, coords);
      parts = dividePolygonByAngle(coords, numParts);
      break;
    case 'star5':
      coords = starCoords(cx, cy, 5, size, size/2);
      drawPolygon(ctx, coords);
      parts = dividePolygonByAngle(coords, numParts);
      break;
    case 'heptagon':
      coords = regularPolygonCoords(cx, cy, 7, size);
      drawPolygon(ctx, coords);
      parts = dividePolygonByAngle(coords, numParts);
      break;
    case 'octagon':
      coords = regularPolygonCoords(cx, cy, 8, size);
      drawPolygon(ctx, coords);
      parts = dividePolygonByAngle(coords, numParts);
      break;
    case 'nonagon':
      coords = regularPolygonCoords(cx, cy, 9, size);
      drawPolygon(ctx, coords);
      parts = dividePolygonByAngle(coords, numParts);
      break;
    case 'decagon':
      coords = regularPolygonCoords(cx, cy, 10, size);
      drawPolygon(ctx, coords);
      parts = dividePolygonByAngle(coords, numParts);
      break;
    case 'star6':
      coords = starCoords(cx, cy, 6, size, size/2);
      drawPolygon(ctx, coords);
      parts = dividePolygonByAngle(coords, numParts);
      break;

    // Quadrilaterals use vertical slicing
    case 'square':
      coords = squareCoords(cx, cy, size);
      drawPolygon(ctx, coords);
      parts = dividePolygonByVerticalLines(coords, numParts);
      break;
    case 'rectangle':
      coords = rectangleCoords(cx, cy, size*2, size);
      drawPolygon(ctx, coords);
      parts = dividePolygonByVerticalLines(coords, numParts);
      break;
    case 'rhombus':
      // A rhombus: like a diamond, top and bottom horizontal
      coords = rhombusCoords(cx, cy, size);
      drawPolygon(ctx, coords);
      parts = dividePolygonByVerticalLines(coords, numParts);
      break;
    case 'parallelogram':
      // Parallelogram with horizontal top and bottom
      coords = parallelogramCoords(cx, cy, size*2, size, 40);
      drawPolygon(ctx, coords);
      parts = dividePolygonByVerticalLines(coords, numParts);
      break;
    case 'trapezoid':
      // Isosceles trapezoid: top shorter, bottom longer, both horizontal
      coords = trapezoidCoords(cx, cy, size*1.2, size*2, size);
      drawPolygon(ctx, coords);
      parts = dividePolygonByVerticalLines(coords, numParts);
      break;
  }

  // Shade requested parts
  for (let i=0; i<partsToShade && i<parts.length; i++) {
    fillPolygon(ctx, parts[i], shadeColor);
  }

  // Draw each part boundary
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000';
  for (let p of parts) {
    strokePolygon(ctx, p);
  }
}

function downloadPNG() {
  const canvas = document.getElementById('myCanvas');
  const link = document.createElement('a');
  link.download = 'shape.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ========================= SHAPE COORDS =========================
function circleCoords(cx, cy, r) {
  let coords = [];
  let steps = 100;
  for (let i=0;i<steps;i++){
    let angle = 2*Math.PI*i/steps;
    coords.push([cx + r*Math.cos(angle), cy + r*Math.sin(angle)]);
  }
  return coords;
}

function squareCoords(cx, cy, size) {
  return [
    [cx - size, cy - size],
    [cx + size, cy - size],
    [cx + size, cy + size],
    [cx - size, cy + size]
  ];
}

function rectangleCoords(cx, cy, w, h) {
  return [
    [cx - w/2, cy - h/2],
    [cx + w/2, cy - h/2],
    [cx + w/2, cy + h/2],
    [cx - w/2, cy + h/2]
  ];
}

function rhombusCoords(cx, cy, size) {
  return [
    [cx, cy - size],
    [cx + size, cy],
    [cx, cy + size],
    [cx - size, cy]
  ];
}

function parallelogramCoords(cx, cy, w, h, offset) {
  // top edge: (cx - w/2, cy - h/2) to (cx + w/2, cy - h/2)
  // bottom edge: shifted by offset
  return [
    [cx - w/2, cy - h/2],
    [cx + w/2, cy - h/2],
    [cx + w/2 + offset, cy + h/2],
    [cx - w/2 + offset, cy + h/2]
  ];
}

function trapezoidCoords(cx, cy, topW, bottomW, h) {
  // Isosceles trapezoid: top shorter, bottom longer
  // top line centered: (cx - topW/2, cy - h/2) to (cx + topW/2, cy - h/2)
  // bottom line: (cx - bottomW/2, cy + h/2) to (cx + bottomW/2, cy + h/2)
  return [
    [cx - topW/2, cy - h/2],
    [cx + topW/2, cy - h/2],
    [cx + bottomW/2, cy + h/2],
    [cx - bottomW/2, cy + h/2]
  ];
}

function regularPolygonCoords(cx, cy, sides, radius) {
  let coords = [];
  for (let i=0;i<sides;i++){
    let angle = 2*Math.PI*i/sides - Math.PI/2;
    coords.push([cx + radius*Math.cos(angle), cy + radius*Math.sin(angle)]);
  }
  return coords;
}

function starCoords(cx, cy, points, outerR, innerR) {
  let coords = [];
  for (let i=0; i<2*points; i++){
    let angle = Math.PI*i/points - Math.PI/2;
    let r = (i%2===0) ? outerR : innerR;
    coords.push([cx + r*Math.cos(angle), cy + r*Math.sin(angle)]);
  }
  return coords;
}

// ========================= DRAWING UTILS =========================
function drawPolygon(ctx, coords) {
  ctx.beginPath();
  ctx.moveTo(coords[0][0], coords[0][1]);
  for (let i=1;i<coords.length;i++){
    ctx.lineTo(coords[i][0], coords[i][1]);
  }
  ctx.closePath();
  ctx.stroke();
}

function strokePolygon(ctx, coords) {
  ctx.beginPath();
  ctx.moveTo(coords[0][0], coords[0][1]);
  for (let i=1; i<coords.length; i++){
    ctx.lineTo(coords[i][0], coords[i][1]);
  }
  ctx.closePath();
  ctx.stroke();
}

function fillPolygon(ctx, coords, color) {
  ctx.beginPath();
  ctx.moveTo(coords[0][0], coords[0][1]);
  for (let i=1;i<coords.length;i++){
    ctx.lineTo(coords[i][0], coords[i][1]);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function polygonCentroid(coords){
  let area=0, x=0, y=0;
  for (let i=0; i<coords.length;i++){
    let j=(i+1)%coords.length;
    let cross=(coords[i][0]*coords[j][1]-coords[j][0]*coords[i][1]);
    area+=cross;
    x+=(coords[i][0]+coords[j][0])*cross;
    y+=(coords[i][1]+coords[j][1])*cross;
  }
  area=area/2;
  x=x/(6*area);
  y=y/(6*area);
  return [x,y];
}

// ========================= DIVISION METHODS =========================
// Angle-based division for regular, symmetric shapes
function dividePolygonByAngle(coords, n) {
  if (n<=1) return [coords];
  let c = polygonCentroid(coords);
  let angleStep = 2*Math.PI/n;
  let startAngle = -Math.PI/2; // start slicing upwards
  let parts = [];

  for (let i=0; i<n; i++){
    let sector = clipPolygonAngular(coords, c, startAngle + i*angleStep, startAngle+(i+1)*angleStep);
    if (sector.length>2) parts.push(sector);
  }
  return parts;
}

function clipPolygonAngular(coords, center, startAngle, endAngle) {
  let poly = clipPolygonHalfPlane(coords, center, startAngle, true);
  poly = clipPolygonHalfPlane(poly, center, endAngle, false);
  return poly;
}

function clipPolygonHalfPlane(coords, center, angle, keepLeft) {
  let output = [];
  for (let i=0; i<coords.length; i++){
    let current = coords[i];
    let prev = coords[(i+coords.length-1)%coords.length];
    let cIn = pointIsInsideAngleLine(current, center, angle, keepLeft);
    let pIn = pointIsInsideAngleLine(prev, center, angle, keepLeft);

    if (pIn && cIn) {
      output.push(current);
    } else if (pIn && !cIn) {
      let inter = angleLineIntersection(prev, current, center, angle);
      if (inter) output.push(inter);
    } else if (!pIn && cIn) {
      let inter = angleLineIntersection(prev, current, center, angle);
      if (inter) output.push(inter);
      output.push(current);
    }
  }
  return output;
}

function pointIsInsideAngleLine(p, center, angle, keepLeft) {
  let dx = Math.cos(angle), dy = Math.sin(angle);
  let px = p[0]-center[0], py = p[1]-center[1];
  let leftTest = dx*py - dy*px;
  return keepLeft ? (leftTest>=-1e-12) : (leftTest<=1e-12);
}

function angleLineIntersection(p1, p2, center, angle) {
  const cx = center[0], cy = center[1];
  const x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1];
  const vx = x2 - x1, vy = y2 - y1;

  const dx = Math.cos(angle), dy = Math.sin(angle);
  // Line coefficients: A*X + B*Y + C=0
  const A = -dy;
  const B = dx;
  const C = dy*cx - dx*cy;

  const denom = A*vx + B*vy;
  if (Math.abs(denom)<1e-12) return null;

  const s = (-C - A*x1 - B*y1)/denom;
  if (s<0 || s>1) return null;

  return [x1 + vx*s, y1 + vy*s];
}

// Vertical division for quadrilaterals
function dividePolygonByVerticalLines(coords, n) {
  if (n<=1) return [coords];
  let xs = coords.map(c=>c[0]);
  let minX = Math.min(...xs), maxX = Math.max(...xs);
  let width = maxX - minX;
  let step = width / n;

  let parts = [];
  let currentPoly = coords;
  for (let i=1; i<n; i++){
    let xLine = minX + i*step;
    let leftSide = clipPolygon(currentPoly, p=>p[0]<=xLine, intersectVertical(xLine));
    let rightSide = clipPolygon(currentPoly, p=>p[0]>=xLine, intersectVertical(xLine));
    if (leftSide.length>2) {
      parts.push(leftSide);
      currentPoly = rightSide;
    } else {
      currentPoly = rightSide;
    }
  }
  if (currentPoly.length>2) parts.push(currentPoly);
  return parts;
}

function clipPolygon(coords, predicate, findIntersection) {
  let output = [];
  for (let i=0; i<coords.length; i++){
    let current = coords[i];
    let prev = coords[(i+coords.length-1)%coords.length];
    let cIn = predicate(current);
    let pIn = predicate(prev);

    if (pIn && cIn) {
      output.push(current);
    } else if (pIn && !cIn) {
      let inter = findIntersection(prev, current);
      if (inter) output.push(inter);
    } else if (!pIn && cIn) {
      let inter = findIntersection(prev, current);
      if (inter) output.push(inter);
      output.push(current);
    }
  }
  return output;
}

function intersectVertical(xLine) {
  return function(p1, p2) {
    let x1=p1[0], y1=p1[1], x2=p2[0], y2=p2[1];
    let vx = x2 - x1, vy = y2 - y1;
    if (Math.abs(vx)<1e-12) return null;
    let s=(xLine - x1)/vx;
    if (s>=0 && s<=1) {
      return [x1+vx*s, y1+vy*s];
    }
    return null;
  }
}
