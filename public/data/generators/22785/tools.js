function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(fxrand() * (max - min + 1) + min); // The maximum is exclusive and the minimum is inclusive
}
function randomVal(min, max) {
  return fxrand() * (max - min) + min;
}
function map_range(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

function shuff(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(fxrand() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function keyTyped() {
  if (key === "s" || key === "S") {
    save("Attractor.png");
  }
  if (key === "t" || key === "T") {
    if(textured == false) {
      textured = true
    } else if(textured == true) {
      textured = false
    }
    shade.setUniform("textured", textured)
  }
  if (key === "p" || key === "P") {
    pixelDensity(4)
    redraw()
    console.log('Print Quality')
    save("AttractorPrintQuality.png");
  }
}

function randColor() {
  return chroma(truePal[randomInt(0, truePal.length-1)]).saturate(0).hex()
}

function plusOrMin(x) {
  n = fxrand()
  if(n < 0.5) {
    posNeg = 1
  } else {
    posNeg = -1
  }

  return x*posNeg
}

function angBetween(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
}

function ptFromAng(x, y, ang, dis) {
  xC = cos(ang)*dis
  yC = sin(ang)*dis

  return createVector((x+xC), (y+yC))
}

function getTriangleCentroid(arr){
	var centerX = (arr[0].x + arr[1].x + arr[2].x) / 3;
	var centerY = (arr[0].y + arr[1].y + arr[2].y) / 3;
	return createVector(centerX, centerY);
}

//////////////////////////////////////////////////////////////////////////


function bodies() {
  if(numBodies == 2) {
    gap = randomVal(3, 6)
  } else if(numBodies == 1) {
    gap = randomVal(6, 8)
  } else {
    gap = randomVal(2, 5)
  }
  startAng = randomVal(0, 360)
  ang = 360/numBodies
  padding = randomVal(-300, 300)
  skew = randomVal(100, -300)
  backSkew = randomVal(-ang/4, ang/4)
  triLength = 3

  sunCenterX = randomVal(1, 3)
  sunCenterY = randomVal(1, 3)
  centCellW = (w-(marg*2))/5
  centCellH = (h-(marg*2))/5
  center = createVector(marg+(centCellW*sunCenterX)+(centCellW/2), marg+(centCellH*sunCenterY)+(centCellH/2))//createVector(randomVal(marg*2, w-(marg*3)), randomVal(marg*2, h-(marg*3)))
  baseA = ptFromAng(w/2, h/2, (-ang+backSkew)/gap, -w*triLength)
  baseB = ptFromAng(w/2, h/2, (ang+backSkew)/gap, -w*triLength)

  p.strokeCap(SQUARE)
  p.strokeJoin(ROUND)

  for(let j = 0; j < numBodies; j++) {
    p.fill(chroma(randomVal(0, 255)).alpha(0.2+randomVal(-0.001, 0.001)).hex())
    p.stroke(chroma(randomVal(0, 255)).alpha(0.3+randomVal(-0.001, 0.001)).hex())

    p.push()
    p.translate(center.x, center.y)
    p.rotate(startAng+(ang*j)+randomVal(-ang*0.3, ang*0.3))
    p.translate(-center.x, -center.y)
    numLayers = borderDens
    for(let i = 0; i < numLayers; i++) {
      xShadow = fxrand()
      yShadow = fxrand()
      shadowCol = bgc
      dashSize = randomVal(minDash, maxDash)
      p.strokeWeight(randomVal(0.5, maxWeight))
      p.drawingContext.setLineDash([dashSize, dashSize])
      p.drawingContext.shadowOffsetX = map(xShadow, -1, 1, -raised, raised);
      p.drawingContext.shadowOffsetY = map(yShadow, -1, 1, -raised, raised);
      p.drawingContext.shadowBlur = 0;
      p.drawingContext.shadowColor = shadowCol;
      circR = center.dist(createVector(center.x+skew, center.y+padding))*circRRatio
      if(j == 0) {
        p.circle(center.x, center.y, circR)
      }
      if(type == 1) {
        tri(center.x+skew, center.y+padding, baseA.x, baseA.y, baseB.x, baseB.y)
      } else if(type == 2) {
        curveTri(center.x+skew, center.y+padding, baseA.x, baseA.y, baseB.x, baseB.y)
      }
    }
    p.pop()
  }
}

function gradLUT() {
scl = 100
  for(let y = 0; y < h; y+=w/scl) {
    for(let x = 0; x < w; x+=h/scl) {
      n = map(x, 0, w, 0, 1)
      nY = map(y, 0, h, 0, 1)
      colScale = chroma.scale(truePal.slice(0, numColors)).classes(numColors)
      hueCol = colScale(nY).desaturate(0)
      gradScale = chroma.scale([hilo[0], chroma(hueCol).hex(), hilo[1]]).padding(0.5)
      col = gradScale(n).hex()
      c.stroke(col)
      c.strokeWeight(scl)
      c.point(x, y)
    }
  }
}

function curveTri(xA, yA, xB, yB, xC, yC) {
  p.beginShape()
  p.curveVertex(xB, yB)
  p.curveVertex(xC, yC)
  p.curveVertex(xA, yA)
  p.curveVertex(xB, yB)
  p.curveVertex(xC, yC)
  p.endShape(CLOSE)
}

function tri(xA, yA, xB, yB, xC, yC) {
  split = map(tightness, 1, 0, 0, 800)
  p.beginShape()
  p.vertex(xC, yC)
  p.vertex(xB, yB)
  p.vertex(xA, yA+split/2)
  p.vertex(xA, yA-split/2)
  p.endShape(CLOSE)
}
