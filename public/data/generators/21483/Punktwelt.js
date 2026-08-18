let seed, spacing, fSpacing, bSpacing, posVarRatio, sizeVar, gridXFactor, gridYFactor, bg, rMean, rVar, posVar, sizeMean
let w = 800, h = 1000, segs = 10, margin, scale, displayScale, colors
let projR, projF, projP, horizon, axo, gridOffset, grid1, grid2, grid3
let gridSizeFactor, oneLayer, separate, fillRatio, separateFactor, displaceFactor, gridFactor
let xs, ys, xc, yc, polygons, boolMode, svgG, svgDone = false, makeSVG = false, pD

function setup() {
  //SEED
  seed = fxri(1e10)
  randomSeed(seed)
  console.log({fxhash,seed})

  //CANVAS AND LAYOUT
  if (fxr() < 0.2) w = h
  if (w != h && fxr() < 0.5) h = 1200
  margin = fxri(25, 100)
  fillRatio = qr(0.78, 0.90, 0.01)
  console.log({margin,fillRatio,w,h})

  //PROJECTION
  axo = fxr()<0.25
  projR = fxr([0.25, 0.33, 0.33, 0.33, 0.5,  0.5,  0.5, 0.66, 0.75])
  projF = fxr([1, 1, 1.25, 1.5])
  projP = fxr([-1, 1])
  console.log({axo,projR, projF, projP})

  //PIGMENTS
  bg = fxr([[250,249,246], [248,247,244], [246,245,242], [244,243,240], [255, 254, 252], [255, 253, 249], [255, 251, 242], [254, 247, 229]])
  colors = fxr(palettes)
  horizon = (fxr()<0.35) ? fxr([1/3,1/3,1/2,1/4,1/4]) : false
  grid1 = fxr()<0.05, grid2 = fxr()<0.02, grid3 = fxr()<0.008
  if (grid1 || grid2 || grid3) horizon = false
  if (grid3) grid2 = false, grid1 = false
  if (grid2) grid1 = false
  if (fxr()<0.25) {
    gridFactor = fxr([0, 0.25, 0.5])
    if (gridFactor == 0) {
      grid1 = false, grid2 = false, grid3 = false, horizon = false
    }
  } else {
    gridFactor = 1
  }
  console.log(bg, colors, {grid1, grid2, grid3, horizon, gridFactor})

  //STIPPLING, SPACING AND SIZES
  rMean = qr(0.9, 1.1, 0.01)
  rVar = qr(0.08, 0.2, 0.01)
  posVarRatio = qr(0.025,0.06, 0.01)
  sizeVar = qr(0.05,0.15, 0.01)
  gridSizeFactor = qr(0.65, 0.80, 0.01)
  gridOffset = fxr([0,0,0,0.33,0.5,0.5,0.5,0.5])
  gridXFactor = 1, gridYFactor = 1
  if (fxr()<0.1) {
    if (fxr()<0.5) {
      gridXFactor = fxr([0.72,0.78,1.1,1.5,2,2])
    } else {
      gridYFactor = fxr([0.66,0.78,1.1])
    }
  }
  fSpacing = qr(3, 6, 0.1)
  bSpacing = fSpacing + fxr([-2,2])
  if (bSpacing < 3) bSpacing = fSpacing + 2
  if (bSpacing > 7.5) bSpacing = fSpacing - 2
  separate = fxr() < 0.75
  oneLayer = (!separate && fxr() < 0.02)
  separateFactor = fxr([1,0.95,0.9])
  displaceFactor = (separate) ? 1: fxr([0.5,0.75])

  console.log({posVarRatio, sizeVar, gridSizeFactor, gridOffset})
  console.log({gridXFactor, gridYFactor, bSpacing, fSpacing})
  console.log({separate, oneLayer, separateFactor, displaceFactor})

  //BOOLEANS
  boolMode = fxr([0,0,0,1,1])
  let coverage = 0
  while (coverage < 0.35) {
    xs = [], ys = []
    createMesh()
    xc = (max(xs)+min(xs))/2, yc = (max(ys)+min(ys))/2
    if (max(xs)-min(xs) > max(ys)-min(ys)) {
      [w, h] = [max(h,w), min(h,w)]
    } else {
      [w, h] = [min(h,w), max(h,w)]
    }
    setDisplayScale()
    scale = fillRatio * min((w-margin*2) / (max(xs)-min(xs)), (h-margin*2) / (max(ys)-min(ys)))  
    coverage = measureCoverage()
  }
  console.log({boolMode, coverage},'faces',polygons.length)

  window.$fxhashFeatures = {
    "Axonometric": axo,
    "Horizon": ((gridFactor != 0) && (horizon > 0) && (colors[0] != colors[colors.length-1])),
    "One layer": oneLayer,
    "Pigments": colors.map(x => pigments[x]).toString(),
    "Figure spacing": nf(fSpacing, 1, 1),
    "No background": (gridFactor == 0),
    "Background color": ((gridFactor == 0) ? 'None' : pigments[colors[0]]),
    "Background spacing": ((gridFactor == 0) ? '0.0' : nf(bSpacing, 1, 1)),
    "Background banded": ((gridFactor == 0) ? false : grid1),
    "Background striped": ((gridFactor == 0) ? false : (grid2 || grid3))
  }
  console.log(window.$fxhashFeatures)

  createCanvas(int(w*displayScale), int(h*displayScale))
  pD = max(1, pixelDensity())
  svgG = createGraphics(int(w*displayScale), int(h*displayScale), SVG)
  noStroke_()

  plot()
  fxpreview()
}

function setDisplayScale() {
  displayScale = (windowWidth >= windowHeight*w/h) ? windowHeight/h : windowWidth/w
  if (isFxpreview) displayScale = 1
}

function plot() {
  background_(bg)
  randomSeed(seed)
  if (gridFactor > 0) plotGrid()
  plotPolygons()
}

function plotGrid() {
  setSpacing(bSpacing)
  fill_(pigments[colors[0]])
  let k = 0
  for (let y = margin, j = 0; y <= h-margin; y += spacing, j++) {
    if (grid1 && random() < 0.02) fill_(pigments[random(colors)])
    if (horizon>0 && y > horizon*h) fill_(pigments[colors[colors.length-1]])
    if (grid2) fill_(pigments[colors[j%2]])
    for (let x = margin + (gridOffset*spacing*j % spacing); x <= w-margin; x += spacing, k++) {
      let px = x+randomGaussian(0,posVar)
      let py = y+randomGaussian(0,posVar)
      if (polygonsAt(x,y).length == 0) {
        if (grid3) fill_(pigments[colors[k%2]])
        let dotSize = gridFactor*randomGaussian(sizeMean,sizeVar)
        beginShape_()
        for (let i = 0; i < segs; i++) {
          let m = cos(2*PI*i/segs)*randomGaussian(rMean, rVar)*dotSize*gridSizeFactor*gridXFactor
          let n = sin(2*PI*i/segs)*randomGaussian(rMean, rVar)*dotSize*gridSizeFactor*gridYFactor
          curveVertex_(displayScale*(m+px), displayScale*(n+py))
        }
        endShape_(CLOSE)
      }
    }
  }
}

function plotPolygons(p) {
  setSpacing(fSpacing)
  for (let y = margin; y <= h-margin; y += spacing) {
    for (let x = margin; x <= w-margin; x += spacing) {
      let pols = polygonsAt(x,y), j = 0
      if (pols.length > 0) {
        if (oneLayer) pols = [pols[pols.length-1]]
        for (let p of pols) {
          fill_(p.color)
          let px = x+randomGaussian(0,posVar), py = y+randomGaussian(0,posVar), dotSize=randomGaussian(sizeMean,sizeVar)
          if (separate) dotSize *= separateFactor
          beginShape_()
          for (let i = 0; i < segs; i++) {
            let m = cos(2*PI*i/segs)*randomGaussian(rMean, rVar)*dotSize*p.sizeFactor + sizeMean*cos(PI*j/pols.length) * displaceFactor
            let n = sin(2*PI*i/segs)*randomGaussian(rMean, rVar)*dotSize*p.sizeFactor + sizeMean*sin(PI*j/pols.length) * displaceFactor
            curveVertex_(displayScale*(m+px),displayScale*(n+py))
          }
          endShape_(CLOSE)
          j++
        }
      }
    }
  }
}

function createMesh() {  
  let c1w = qr(1,2,0.25), c1l = qr(1,2,0.25), c1h = qr(1,3,0.25)
  let faces = CSG.cube({center:[0,0,0], radius:[c1w, c1l, c1h]})

  if (fxr()<0.15) {
    faces = faces.subtract(CSG.cube({center:[0, 0, 0], radius:[0.5,5,0.5]}))
    if (faces.polygons.length == 0) return createMesh()  
  } else if (fxr()<0.15) {
    faces = faces.subtract(CSG.cube({center:[0, fxr([0,-0.5,-1]), 0], radius:[fxr([0.5,0.75]),fxr([0.5,0.75]),5]}))
    if (faces.polygons.length == 0) return createMesh()  
  }
  if (fxr()<0.05) {
    faces = faces.subtract(CSG.cube({center:[0, 0, 0], radius:[0.5,5,5]}))
    if (faces.polygons.length == 0) return createMesh()  
  }

  let subtractions = fxri(3,5.5)
  for (let i = 0; i < subtractions; i++) {
    let c2x, c2y, c2z, c2w = qr(0.5,3,0.25), c2l = qr(0.5,3,0.25), c2h = qr(0.5,3,0.25)
    if (boolMode == 0) {
      let vP = fxr(getVertices(faces))
      c2x = vP.x, c2y = vP.y, c2z = vP.z  
    } else {
      c2x = qr(-c1w, c1w, 0.25), c2y = qr(-c1l, c1l, 0.25), c2z = qr(-c1h, c1h, 0.25)
    }
    let cube2 = CSG.cube({center:[c2x, c2y, c2z], radius:[c2w,c2l,c2h]})
    faces = faces.subtract(cube2)
    if (faces.polygons.length == 0) return createMesh()  
  }

  if (faces.polygons.length <= 25) return createMesh()
  if (getArea(faces) < 20) return createMesh()
  polygons = faces.toPolygons().map(evaluatePolygon)
}

const transform = (x, y, z) => createVector((x-y*projR*projP), (-y*projR*projF-z))

function polygonsAt(x, y) {
  let pols = []
  for (const p of polygons) {
    if (inPolygon([(x-w/2)/scale, (y-h/2)/scale], p.points)) pols.push(p)
  }
  return pols
}
  
function inPolygon(point, vertices) {
  let x = point[0]+xc, y = point[1]+yc, inside = false
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      let xi = vertices[i].x, yi = vertices[i].y, xj = vertices[j].x, yj = vertices[j].y
      let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
      if (intersect) inside = !inside
  }
  return inside
}

function getArea(fs) {
  area = 0
  for (let p of fs.polygons) {
    let pvs = []
    for (let v of p.vertices) {
      pvs.push(createVector(v.pos.x, v.pos.y, v.pos.z))
    }
    let sides = [max(pvs.map(x => x.x))-min(pvs.map(x => x.x)), 
      max(pvs.map(x => x.y))-min(pvs.map(x => x.y)), 
      max(pvs.map(x => x.z))-min(pvs.map(x => x.z))]
    sides.sort((a,b) => a-b)
    area += sides[1]*sides[2]
  }
  return area
}

function getVertices(fs) {
  let vs = []
  for (let p of fs.polygons) {
    for (let v of p.vertices) {
      vs.push(createVector(v.pos.x, v.pos.y, v.pos.z))
    }
  }
  return vs
}

function evaluatePolygon(polygon) {
  let points = []
  for (const v of polygon.vertices) {
    if (axo) {
      let rv = createVector(v.pos.x, v.pos.y)
      rv.rotate(projP*PI/6)
      points.push(transform(rv.x, rv.y, v.pos.z))
    } else {
      points.push(transform(v.pos.x, v.pos.y, v.pos.z))
    }
  }

  for (const p of points) {
    xs.push(p.x)
    ys.push(p.y)
  }  

  let c, normal = polygon.plane.normal
  let normals = [abs(normal.x),abs(normal.y), abs(normal.z)]
  let maxDim = normals.indexOf(max(normals))
  if (maxDim == 0 && normal.x == -1) c = pigments[colors[1]]
  if (maxDim == 0 && normal.x == 1) c = pigments[colors[2]]
  if (maxDim == 1 && normal.y == -1) c = pigments[colors[3]]
  if (maxDim == 1 && normal.y == 1) c = pigments[colors[4]]
  if (maxDim == 2 && normal.z == -1) c = pigments[colors[5]]
  if (maxDim == 2 && normal.z == 1) c = pigments[colors[6]]
  c=color(c)
  c.setAlpha(fxr(220,250))

  return {points: points, polygon: polygon, normal: normal, color: c, sizeFactor: fxr(0.8,1.2)}
}

function measureCoverage() {
  setSpacing(bSpacing)
  let figure = 0, ground = 0
  for (let y = margin; y <= h-margin; y += spacing) {
    for (let x = margin; x <= w-margin; x += spacing) {
      if (polygonsAt(x,y).length == 0) {
        ground++
      } else {
        figure++
      }
    }
  }
  return (figure/(figure+ground))
}

const q = (a, b) => floor(a/b) * b
const qr = (a, b, c) => q(fxr(a, b), c)
const fxri = (min, max) => floor(fxr(min, max))

function fxr(a, b) {
  if (typeof a == 'undefined') {
    return fxrand()
  } else if (Array.isArray(a)) {
    return a[Math.floor(fxrand() * a.length)]
  } else {
    if (typeof b == 'undefined') {
      b = a
      a = 0
    }
    return fxrand()*(b-a)+a
  }
}

function fxshuffle(l) {
  let m = l.length, t, i
  while (m) {
    i = floor(fxr() * m--)
    t = l[m]
    l[m] = l[i]
    l[i] = t
  }
  return l
}

function setSpacing(s) {
  spacing = s
  posVar = posVarRatio * spacing
  sizeMean = spacing/2
}

function keyPressed() {
  if (key.toLowerCase() === "s") {
    saveCanvas()
  }
  if (key === "4") {
    displayScale = 4
    resizeCanvas(int(w*displayScale), int(h*displayScale))
    pixelDensity(1)
    plot()
    saveCanvas()
  }
  if (key === "8") {
    displayScale = 8
    resizeCanvas(int(w*displayScale), int(h*displayScale))
    pixelDensity(1)
    plot()
    saveCanvas()
  }
  if (key.toLowerCase() === "e") {
    makeSVG = true
    plot()
    makeSVG = false
    svgDone = true
    svgG.save('print.svg')
  }
}

function windowResized() {
  setDisplayScale()
  resizeCanvas(int(w*displayScale), int(h*displayScale))
  pixelDensity(pD)
  if (!svgDone) svgG = createGraphics(int(w*displayScale), int(h*displayScale), SVG)
  noStroke_()
  plot()
}

function background_(a) {
  background(a)
  if (!svgDone && makeSVG) svgG.background(a)
}

function fill_(a) {
  fill(a)
  if (!svgDone && makeSVG) svgG.fill(a)
}

function endShape_(a) {
  endShape(a)
  if (!svgDone && makeSVG) svgG.endShape(a)
}

function curveVertex_(a, b) {
  curveVertex(a, b)
  if (!svgDone && makeSVG) svgG.curveVertex(a, b)
}

function beginShape_() {
  beginShape()
  if (!svgDone && makeSVG) svgG.beginShape()
}

function noStroke_() {
  noStroke()
  svgG.noStroke()
}