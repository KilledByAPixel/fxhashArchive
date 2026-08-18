// PHYSICS
const gravity = -10, margin = 0.05, m = 1.5;
let collConfig, dispatcher, broadphase, solver, physicsWorld, xform;
let bodies = [], initialized = false; worldReady = false;
let phIteration = 0, maxBodies = 3000;

// RENDERING
let texturesOn = true;
let colors = [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [100,64,30], [50,25,50], [230,30,130], [0,95,115], [230,90,0], [30,30,250], [30,30,250], [30,30,250], [20,140,20], [20,140,20], [210,30,30]];
let brickTextures = [], brickTextureIndices = [];
let scaling = 1;
let nTextures = 9;
let baseX = 1400, baseY = 1000;
let resX = baseX, resY = baseY;
let xArr = [], yArr = [], xMean = 0, yMean = 0;
let gridWidth = baseX*1.5;
let finishedDrawing = false;

// FX
let gridCycleArr = [], gridCycleIndex = 0;
for (let i = 0; i < 10000; i++) {
  gridCycleArr.push(fxrand());
}

let graphicsCycleArr = [], graphicsCycleIndex = 0;
for (let i = 0; i < 10000; i++) {
  graphicsCycleArr.push(fxrand());
}

// VARIATIONS
let sizeFactor = fxr(4.5, 8.5);
let gridIntensity = fxr(1.5, 2.5);
let hFactor = fxr([1,1,1,1,0.5,2]);
let brickL = 0.3 * sizeFactor;
let brickH = 0.07 * sizeFactor * hFactor;
let brickW = brickL * 0.5;
let weight = fxr(0.8, 2.3);
let aboveFactor = fxr(1.0, 1.3);
let phIterations = fxri(45,95);
let bg = fxri(238,252);
let fg = fxr(colors);
let gridSpacing = fxri(5,8);
let hatchType = fxr([0,0,1,1,2,3,4,5,5]);
let sWeight = fxri(2,5);
let view = fxr([0,0,0,0,1]);
let xrot = fxr([0,15,15,30,30,45,45,45,45,60,60,60,60,90]);
let zrot = fxr([0,0,5,15,30,45,45,45,45,60,60,60,60]);
if (xrot == 0) {
  zrot = fxr([0,0,45]);
}
let viewType = (view == 0) ? "Above" : "Below";
if (xrot == 90) {
  viewType = "Front";
}
if (xrot == 0) {
  viewType = "Top";
}

let buildTypes = [];
if (fxr()<0.1) buildTypes.push(0); // ROUND TOWERS
if (fxr()<0.7) buildTypes.push(1); // SQUARE TOWERS
if (fxr()<0.6) buildTypes.push(2); // PATHS
if (fxr()<0.9) buildTypes.push(3); // WALLS
if (fxr()<0.3) buildTypes.push(4); // RECTANGLES
if (fxr()<0.1) buildTypes.push(5); // STACKS
if (buildTypes.length == 0) buildTypes.push(3);


window.$fxhashFeatures = {
  "Round towers": buildTypes.includes(0),
  "Square towers": buildTypes.includes(1),
  "Paths": buildTypes.includes(2),
  "Walls": buildTypes.includes(3),
  "Rectangles": buildTypes.includes(4),
  "Stacks": buildTypes.includes(5),
  "x rotation": xrot,
  "z rotation": zrot,
  "View": viewType
}

//
// PHYSICS
//


Ammo().then(function (AmmoLib) {
  Ammo = AmmoLib;
  initialized = true;
  buildWorld();
  worldReady = true;
});

function buildWorld() {
  console.log('Building world');
  collConfig = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
  dispatcher = new Ammo.btCollisionDispatcher(collConfig);
  broadphase = new Ammo.btDbvtBroadphase();
  solver = new Ammo.btSequentialImpulseConstraintSolver();
  physicsWorld = new Ammo.btSoftRigidDynamicsWorld(dispatcher, broadphase, solver, collConfig);
  physicsWorld.getWorldInfo().set_m_gravity(new Ammo.btVector3(0, gravity, 0));
  physicsWorld.setGravity(new Ammo.btVector3(0, gravity, 0));
  xform = new Ammo.btTransform();
  createObjects();
  console.log('Number of bricks: ' + bodies.length);
  console.log('Applying gravity');
}


function createObjects() {

  // GROUND
  let groundThickness = 0.1;
  let pos = [0, -groundThickness/2, 0];
  let quat = [0.0, 0.0, 0.0, 1.0];
  createBox(500, groundThickness, 500, 0, pos, quat, false);

  // SQUARE TOWERS
  if (buildTypes.includes(1) || (xrot == 90)) {
    let n = fxri(1,4);
    for (let i = 0; i < n; i++) {
      let lengths = fxri(1,3);
      let levels = fxri(24,64);
      if (xrot == 90) {
        levels *= 2;
      }
      buildRect(fxri(-15,15), fxri(-15,15), lengths, lengths, levels, fxr(0.8,1.3), fxri(nTextures), 4);  
    }  
  }
  
  // 3: WALLS
  if (buildTypes.includes(3)) {
    let n = fxri(1,3);
    for (let i=0; i < n; i++) {
      let xLimit = 15, yLimit = 15;
      let startX = -xLimit, startY = fxri(-yLimit/2,yLimit/2)
      let lastX = startX, lastY = startY
      let wallHeight = fxri(8,24), wallMaterial = fxri(nTextures)
      while (lastX < xLimit) {
        let newX, newY;
        let lengths = fxri(2,10)
        if (fxr() < 0.5) {
          newX = lastX + lengths;
          buildRight(lastX*brickL, lastY*brickL, lengths, wallHeight, fxr(0.85, 1.0), wallMaterial);
          lastX = newX;
        } else { 
          if (fxr() < 0.5) {
            newY = lastY + lengths;
            if ((newY > -yLimit) && (newY < yLimit)) {
              buildUp(lastX*brickL, lastY*brickL, lengths, wallHeight, fxr(0.85, 1.0), wallMaterial);
              lastY = newY;
            }
          } else {
            newY = lastY - lengths;
            if ((newY > -yLimit) && (newY < yLimit)) {
              buildDown(lastX*brickL, lastY*brickL, lengths, wallHeight, fxr(0.85, 1.0), wallMaterial);
              lastY = newY;
            }
    
        }
      }    
      }
    }  
  }

  // 2: PATHS
  if (buildTypes.includes(2)) {
    let lengths = fxri(20,60);
    let pW = fxri(3,7);
    let pDiv = fxri(2,7);
    let n = fxri(1,3);
    for (let i = 0; i < n; i++) {
      if (fxr()<0.5) {
        let y = fxri(-10,10);
        for (let i = 0; i < pW; i++) {
          buildPathRight(-lengths/2+brickL*(i%2)/pDiv, y+i*brickW, lengths, 1, fxr(0.9,1.1),fxri(nTextures));
        }
      } else {
        let x = fxri(-10,10);
        for (let i = 0; i < pW; i++) {
          buildPathUp(x+i*brickW, -lengths/2+brickL*(i%2)/pDiv, lengths, 1, fxr(0.9,1.1),fxri(nTextures));
        }
      }  
    } 
  }

  // 4: RECTANGLES
  if (buildTypes.includes(4)) {
    let n = fxr(2);
    for (let i = 0; i < n; i++) {
      let levels = fxri(12,64);
      let xLengths = fxri(2,7);
      let yLengths = fxri(2,7);
      let nwalls = fxr([1,2,3,3,4,4,4]);
      let x = fxri(-10,10);
      let y = fxri(-10,10); 
      let reps = fxri(1,5);
      let gap = fxri(1,3);
      for (let j = 0; j < reps; j++) {
        if (x < y) {
          buildRect(x-xLengths/2 + (xLengths+gap)*j*brickL, y-yLengths/2, xLengths, yLengths, levels, fxr(0.8,1.0),fxri(nTextures), nwalls);
        } else {
          buildRect(x-xLengths/2, y-yLengths/2 + (yLengths+gap*j)*brickL, xLengths, yLengths, levels, fxr(0.8,1.0),fxri(nTextures), nwalls);
        }
      }
    }
  }

  // 0: ROUND TOWERS
  if (buildTypes.includes(0)) {
    let n = fxr(1.5);
    for (let i = 0; i < n; i++) {
      buildRing(fxri(-15,15), fxri(-15,15), fxr(3,7), fxr(24,72), fxr(0.65,1), 1, fxri(nTextures));
    }
  }

  // 5: STACKS
  if (buildTypes.includes(5)) {
    let bricksX = fxri(1,5);
    let bricksY = fxri(1,5);
    let levels = fxri(16,48);
    let completeness = fxri(0.95,1.1);
    for (let i = 0; i < bricksX; i++) {
      for (let j = 0; j < bricksY; j++) {
        for (let level = 0; level < levels; level++) {
          if (fxr()<completeness) createBox(brickL, brickH, brickW, m, [i*brickW, elevation(level), j*brickL], aq(0,90,0), fxri(nTextures));
        }
      }
    }
  }
  
}

function buildRing(centerX, centerY, radius, levels, tapering, completeness, textureIndex) {
  for (let level = 0; level < levels; level++) {
    let lradius = map(level, 0, levels, radius, radius*tapering);
    let circumference = lradius*2*PI;
    let n = 0.9*circumference/brickL;
    for (let i = 0; i < n; i++) {
      let a = (i+0.5*(level%2))*360/n;
      let quat = aq(0,90+a,0);
      let pos = [centerX+cos(a)*lradius, elevation(level), centerY+sin(a)*lradius];
      if (fxr()<completeness) createBox(brickL, brickH, brickW, m, pos, quat, textureIndex);
    }
  }
}

function buildPathRight(startX, startY, lengths, levels, completeness, textureIndex) {
  for (let level = 0; level < levels; level++) {
    let x = startX + (odd(level) ? brickL*0.75 : brickL*0.25);
    for (let i = 0; i < lengths; i++, x+=brickL) {
      if (fxr()<completeness) createBox(brickL, brickH, brickW, m, [x, elevation(level*3), startY], aq(0,0,0), textureIndex);
    } 
  }
}

function buildPathUp(startX, startY, lengths, levels, completeness, textureIndex) {
  for (let level = 0; level < levels; level++) {
    let y = startY + (odd(level) ? brickL*0.75 : brickL*0.25);
    for (let i = 0; i < lengths; i++, y+=brickL) {          
      if (fxr()<completeness) createBox(brickL, brickH, brickW, m, [startX, elevation(level*3), y], aq(0,90,0), textureIndex);
    } 
  }
}

function buildRight(startX, startY, lengths, levels, completeness, textureIndex) {
  for (let level = 0; level < levels; level++) {
    let x = startX + (odd(level) ? brickL*0.75 : brickL*0.25);
    for (let i = 0; i < lengths; i++, x+=brickL) {
      if (fxr()<completeness) createBox(brickL, brickH, brickW, m, [x, elevation(level), startY], aq(0,0,0), textureIndex);
    } 
  }
}

function buildUp(startX, startY, lengths, levels, completeness, textureIndex) {
  for (let level = 0; level < levels; level++) {
    let y = startY + (odd(level) ? brickL*0.75 : brickL*0.25);
    for (let i = 0; i < lengths; i++, y+=brickL) {          
      if (fxr()<completeness) createBox(brickL, brickH, brickW, m, [startX, elevation(level), y], aq(0,90,0), textureIndex);
    } 
  }
}

function buildLeft(startX, startY, lengths, levels, completeness, textureIndex) {
  for (let level = 0; level < levels; level++) {
    let x = startX - (odd(level) ? brickL*0.75 : brickL*0.25);
    for (let i = 0; i < lengths; i++, x-=brickL) {
      if (fxr()<completeness) createBox(brickL, brickH, brickW, m, [x, elevation(level), startY], aq(0,0,0), textureIndex);
    } 
  }
}

function buildDown(startX, startY, lengths, levels, completeness, textureIndex) {
  for (let level = 0; level < levels; level++) {
    let y = startY - (odd(level) ? brickL*0.75 : brickL*0.25);
    for (let i = 0; i < lengths; i++, y-=brickL) {          
      if (fxr()<completeness) createBox(brickL, brickH, brickW, m, [startX, elevation(level), y], aq(0,90,0), textureIndex);
    } 
  }
}

function buildRect(startX, startY, lengthsX, lengthsY, levels, completeness, textureIndex, nwalls) {
  buildRight(startX,   startY,   lengthsX, levels, completeness, textureIndex);
  (nwalls > 1) && buildUp(   startX+brickL*lengthsX, startY,   lengthsY, levels, completeness, textureIndex);
  (nwalls > 2) && buildLeft( startX+brickL*lengthsX, startY+brickL*lengthsY, lengthsX, levels, completeness, textureIndex);
  (nwalls > 3) && buildDown( startX,   startY+brickL*lengthsY, lengthsX, levels, completeness, textureIndex);
}

function elevation(level) {
  return brickH * aboveFactor*(level+0.5);
}

function createBox(sx, sy, sz, mass, pos, quat, textureIndex) {
  let lim = 30;
  if (bodies.length < maxBodies && (pos[0] > -lim) && (pos[0] < lim) && (pos[2] > -lim) && (pos[2] < lim)) {
    const shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos[0], pos[1], pos[2]));
    transform.setRotation(new Ammo.btQuaternion(quat[0], quat[1], quat[2], quat[3]));
    const motionState = new Ammo.btDefaultMotionState(transform);
    const localInertia = new Ammo.btVector3(0,0,0);
    shape.setMargin(margin);
    shape.calculateLocalInertia(mass, localInertia);
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    const body = new Ammo.btRigidBody(rbInfo);
    if (mass > 0) {
      bodies.push(body);
      brickTextureIndices.push(textureIndex);
      body.setActivationState(4);
    }
    physicsWorld.addRigidBody(body);
  }
}

function getPositions() {
  for (let i = 0; i < bodies.length; i++) {
    let ms = bodies[i].getMotionState();
    ms.getWorldTransform(xform);
    let p = xform.getOrigin();
    xArr.push(p.x());
    yArr.push(p.z());
  }
  xMean = arrMean(xArr);
  yMean = arrMean(yArr);
}


//
// GRAPHICS
//


function setup() {  
  setScale();
  createCanvas(resX, resY, WEBGL);
  background(bg);
  angleMode(DEGREES);
  createTextures();
}

function draw() {
  if (frameCount == 1) {
    drawGrid();
  }
  if (worldReady) {
    if (phIteration < phIterations) {
      physicsWorld.stepSimulation(1, 1);
      centerPen();
      int(bodies.length*phIteration/phIterations)
      for (let i = int(bodies.length*phIteration/phIterations); i < int(bodies.length*min(1, (phIteration+1)/phIterations)); i++) {
        drawBrick(i);
      }
      phIteration++;
    } else if ((phIteration >= phIterations) && (!finishedDrawing)) {
      getPositions();
      console.log('Drawing world');
      drawGrid();
      drawBricks();
      fxpreview();
      console.log('Finished drawing');
      finishedDrawing = true;
    }
  }

}

function centerPen() {
  resetMatrix();
  ortho(-width/2, width/2, -height/2, height/2, min(-7000,-7000*scaling), max(7000,7000*scaling));
  translate(0, height/8);
  (xrot == 90) && translate(0, height/4);
  (view == 1) && rotateY(-180);
  rotateX(xrot);
  rotateZ(zrot);
}

function drawBricks() {
  centerPen();
  for (let i = 0; i < bodies.length; i++) {
    drawBrick(i);
  }
}

function drawGrid() {
  background(bg);
  centerPen();
  let gridSize = gridWidth * scaling;
  push();
  (xrot == 90) && rotateX(-xrot);
  strokeWeight(scaling);
  stroke(fg);
  fill(fg);
  for (let x = -gridSize; x <= gridSize; x = x+gridSpacing*scaling) {
    for (let y = -gridSize; y <= gridSize; y = y+gridSpacing*scaling) {
      ellipse(x, y, gridIntensity*scaling*gridCycle(0.7,1.1));
    } 
  }   
  pop();
}

function createTextures() {
  for (let i = 0; i < nTextures; i++) {
    let cWeight = weight+graphicsCycle(-0.3,0.3);
    let cTextures = [];
    let hPx = int(64*hFactor);
    cTextures.push(createHatch(hPx, 128, cWeight));
    cTextures.push(createHatch(128, hPx, cWeight));
    cTextures.push(createHatch(128, 256, cWeight));
    cTextures.push(createHatch(256, 128, cWeight));
    cTextures.push(createHatch(256, hPx, cWeight));
    cTextures.push(createHatch(hPx, 256, cWeight));
    brickTextures.push(cTextures);
  }
}

function createHatch(w,h,cWeight) {
  if (texturesOn) {
    let graphics  = createGraphics(w,h);
    graphics.pixelDensity(1);
    let s = int(graphicsCycle(17,23)), sWeight = 5;
    cWeight = weight+graphicsCycle(-0.2,0.2);
    graphics.stroke(nearColor(fg));
    graphics.background(bg);
    graphics.noFill();
    switch (hatchType) {
      case 0: // squares
        for (x = 0; x < w; x += s) {
          graphics.strokeWeight(sWeight*cWeight*graphicsCycle(0.8,1));
          graphics.line(x,0,x,h);
        }
        for (y = 0; y < h; y += s) {
          graphics.strokeWeight(sWeight*cWeight*graphicsCycle(0.8,1));
          graphics.line(0,y,w,y);
        }
        break;
      case 1: //dots
        for (x = 0; x < w; x += s) {
          for (y = 0; y < h; y += s) {
            graphics.strokeWeight(sWeight*2*cWeight*graphicsCycle(0.8,1));
            graphics.point(x,y);
          }
        }
        break;
      case 2: // cross hatch
        for (x = -w*5; x < w*5; x += s*1.6) {
          graphics.strokeWeight(sWeight*1.5*cWeight*graphicsCycle(0.7,1.1));
          graphics.line(x,0,x+h,h*1.5);
          graphics.strokeWeight(sWeight*1.5*cWeight*graphicsCycle(0.7,1.1));
          graphics.line(x,0,x-h,h*1.5);
        }
        break;
      case 3: // hlines
        for (x = 0; x < w; x += s) {
          graphics.strokeWeight(sWeight*cWeight*graphicsCycle(0.8,1));
          graphics.line(x,0,x,h);
        }
        break;
      case 4: // vlines
        for (y = 0; y < h; y += s) {
          graphics.strokeWeight(sWeight*cWeight*graphicsCycle(0.8,1));
          graphics.line(0,y,w,y);
        }
        break;
      case 5: //strokes
        for (x = 0; x < w; x += s) {
          for (y = 0; y < h; y += s) {
            graphics.strokeWeight(sWeight*2*cWeight*graphicsCycle(0.8,1));
            graphics.line(x,y,x+s/3,y);
          }
        }
        break;
    }  
    return graphics;
  } else {
    return false;
  }
}


function drawBrick(i) {
  stroke(fg);
  noFill();
  let s = sizeFactor * 4;
  let ms = bodies[i].getMotionState();
  if (ms) {
    ms.getWorldTransform(xform);
    let p = xform.getOrigin();
    if (p.y() > 0) {
      let q = xform.getRotation();
      //q.normalize();
      let angles = qa(q.w(), q.x(),q.z(),q.y());
      strokeWeight(sWeight*weight*0.75*scaling);
      push();
      translate(s*(p.x()-xMean)*scaling, s*(p.z()-yMean)*scaling, s*p.y()*scaling);
      rotateZ(angles[0]);
      rotateY(angles[1]);
      rotateX(angles[2]);
      drawBox(s*brickL*scaling, s*brickW*scaling, s*brickH*scaling, brickTextureIndices[i]);
      pop();    
    }
  }
}


function drawFace(mat,a,b,c,x,y,z) {
  let d = 1;
  if (texturesOn) {
    texture(mat);
  } else {
    fill(bg);
  }
  push();
  translate(a,b,c);
  box((a==0)?x:d, (b==0)?y:d, (c==0)?z:d);
  pop();  
}

function drawBox(x,y,z,textureIndex) {
  drawFace(brickTextures[textureIndex][0],-x/2,0,0,x,y,z);
  drawFace(brickTextures[textureIndex][1],x/2,0,0,x,y,z);
  drawFace(brickTextures[textureIndex][2],0,0,-z/2,x,y,z);
  drawFace(brickTextures[textureIndex][3],0,0,z/2,x,y,z);
  drawFace(brickTextures[textureIndex][4],0,-y/2,0,x,y,z);
  drawFace(brickTextures[textureIndex][5],0,y/2,0,x,y,z);
} 


// HELPER FUNCTIONS


function qa(w,x,y,z) {
  return [atan2(2.0*(z*w+x*y), -1.0+2.0*(w*w+x*x)), asin(2.0*(y*w-z*x)), atan2(2.0*(z*y+w*x), 1.0-2.0*(x*x+y*y))];
}

function fxri(min, max) {
  return Math.floor(fxr(min,max));
 } 

function aq(x,y,z) {
  let cy = cos(x*0.5), sy = sin(x*0.5), cp = cos(y*0.5), sp = sin(y*0.5), cr = cos(z*0.5), sr = sin(z*0.5);
  return [cr*cp*cy+sr*sp*sy, sr*cp*cy-cr*sp*sy, cr*sp*cy+sr*cp*sy, cr*cp*sy-sr*sp*cy];
}

function keyPressed() {
  if (key.toLowerCase() === "s") {
    console.log('Saving');
    saveCanvas();
  }
  if (key.toLowerCase() === "e" && (phIteration >= phIterations)) {
    resX = 4000*(baseX/baseY);
    resY = 4000;
    scaling = resX/baseX;
    resizeCanvas(resX, resY);
    drawGrid();
    drawBricks();
    saveCanvas();
}
  if (key.toLowerCase() === "t") {
    texturesOn = !texturesOn;
    if (phIteration >= phIterations) {
      drawGrid();
      drawBricks();
    }
  }
}

function fxr(a, b) {
  if (typeof a == 'undefined') {
    return fxrand();
  } else if (Array.isArray(a)) {
    return a[Math.floor(fxrand() * a.length)];
  } else {
    if (typeof b == 'undefined') {
      b = a;
      a = 0;
    }
    return fxrand()*(b-a)+a;
  }
}

function gridCycle(a, b) {
  if (gridCycleIndex >= gridCycleArr.length) {
    gridCycleIndex = 0;
  }
  return gridCycleArr[gridCycleIndex++]*(b-a)+a;
}

function graphicsCycle(a, b) {
  if (graphicsCycleIndex >= graphicsCycleArr.length) {
    graphicsCycleIndex = 0;
  }
  return graphicsCycleArr[graphicsCycleIndex++]*(b-a)+a;
}

function nearColor(c) {
  let v = 16;
  let r = int(min(255,max(0,c[0]+graphicsCycle(-v,v))));
  let g = int(min(255,max(0,c[1]+graphicsCycle(-v,v))));
  let b = int(min(255,max(0,c[2]+graphicsCycle(-v,v))));
  return [r,g,b];
}

function windowResized() {
  setScale();
  resizeCanvas(resX, resY);
  if (phIteration >= phIterations) {
    drawGrid();
    drawBricks();
  }
}

function setScale() {
  resX = int(min(windowWidth, windowHeight*(baseX/baseY)));
  resY = int(resX/(baseX/baseY));
  scaling = resX/baseX;
}

function arrMean(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum/arr.length;
}

function even(x) {
  return (x % 2 == 0);
}

function odd(x) {
  return (x % 2 == 1);
}
