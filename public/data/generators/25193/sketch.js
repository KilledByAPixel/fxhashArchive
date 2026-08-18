w= 2000
h = 2500
nSize = fxrand()
chanceNoMarg = 0.5
if(nSize < chanceNoMarg) {
  marg = randomVal(50, 100)
  matteMarg = marg*0.5
  mode = 'Wall'
} else {
  marg = randomVal(w*0.125, w*0.3)
  matteMarg = marg*0.3
  mode = 'Structure'
}

willReadFrequently = true
let shade;
function preload() {
  shade = loadShader("shader.vert", "shader.frag");
}
url = new URL(window.location.href)
urlParams = new URLSearchParams(url.search)
if(url.searchParams.has('size') == true) {
  pxSize = url.searchParams.get('size')
} else {
  url.searchParams.append('size', 1);
}
pxSize = url.searchParams.get('size')


//declarations
panels = []
panelSpawns = []
textured = true
shaderSeed = randomVal(0, 10)
nLayerMode = fxrand()

//parameters
if(nSize < chanceNoMarg) {
  maxAmt = 4
  numLayers = randomInt(1, 3)
} else {
  maxAmt = 5
  numLayers = randomInt(1, 2)
}

if(nLayerMode < 0.25) {
  numLayers = randomInt(10, 20)
  layerMode = 'Maximal'
} else {
  numLayers = randomInt(1, 3)
  layerMode = "Minimal"
}
console.log(numLayers)

maxAlph = 0.9

rows = randomInt(1, maxAmt)
if(rows > 1) {
  cols = randomInt(1, maxAmt)
  if(nSize < chanceNoMarg) {
    cols = 1
  }
} else if(rows == 1) {
  cols = randomInt(2, maxAmt)
}
numAccents = randomInt(1, 3)
totalCells = rows*cols
globalPlay = randomVal(20, 40)
minLineWeight = 1
maxLineWeight = map_range(Math.max(rows, cols), 2, 7, 10, 4)
chanceToFill = map_range(totalCells, 2, 25, 0.5, 0.1)
totalFilled = constrainNum(Math.round(totalCells*chanceToFill), 1, 10)

//filling cells
for(let y = 0; y < rows; y++) {
  panels[y] = []
  for(let x = 0; x < cols; x++) {
    panels[y][x] = false
  }
}
numFilled = 0
while(numFilled < totalFilled) {
thisRow = randomInt(0, rows-1)
thisCol = randomInt(0, cols-1)
  if(panels[thisRow][thisCol] == false) {
    panels[thisRow][thisCol] = true
    numFilled++
  }
}

percentNotSpawned = 0.25
totalSpawned = Math.floor(totalCells*percentNotSpawned)
numSpawned = 0
for(let y = 0; y < rows; y++) {
  panelSpawns[y] = []
  for(let x = 0; x < cols; x++) {
    panelSpawns[y][x] = true
  }
}
if(nSize > chanceNoMarg) {
  while(numSpawned < totalSpawned) {
    thisRow = randomInt(0, rows-1)
    thisCol = randomInt(0, cols-1)
      if(panelSpawns[thisRow][thisCol] == true) {
        panelSpawns[thisRow][thisCol] = false
        numSpawned++
      }
    }
}

window.$fxhashFeatures = {
  "Mode": mode,
  "Total Cells": totalCells,
  "Palette": palName,
  "Background Color": bgName,
  "Layers": numLayers,
  "Layering Mode": layerMode
}

function setup() {
  createCanvas(w, h, WEBGL);
  if(pxSize == 1) {
    pixelDensity(1)
  } else if (pxSize == 2) {
    pixelDensity(2)
  } else if (pxSize == 3) {
    pixelDensity(3)
  }

  p = createGraphics(w, h)
  c = createGraphics(w, h)
  g = createGraphics(w, h)
  angleMode(DEGREES)
  p.angleMode(DEGREES)
  c.angleMode(DEGREES)
  g.angleMode(DEGREES)
}

function draw() {
  if(frameCount == 1) {
    p.background(bgc)
    background(bgc)

    //Sketch
    p.noStroke()  
    for(let i = 0; i < numLayers; i++) {
      quadGridOverlap()
    }
    
    randQuads()

  }
  
  //Post processing
   bgc = color(bgc)
   shader(shade)
   shade.setUniform("u_resolution", [w, h]);
   shade.setUniform("p", p);
   shade.setUniform("seed", shaderSeed);
   shade.setUniform("startRot", randomVal(0, 6.28319));
   shade.setUniform("marg", map(matteMarg, 0, w, 0, 1));
   shade.setUniform("textured", textured);
   shade.setUniform("bgc", [
     bgc.levels[0] / 255,
     bgc.levels[1] / 255,
     bgc.levels[2] / 255,
   ]);
  

   rect(0, 0, w, h)
   if(frameCount == 2) {
    fxpreview()
   }
}
