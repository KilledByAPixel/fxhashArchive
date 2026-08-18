// CONSTANTS

const palettes = [['#fefaf4', '#6399c8', '#8dac60', '#fcd424', '#638e74', '#d41b4b', '#f66d3a'],    
                  ['#1b1c1f', '#084ba4', '#739761', '#e9b130', '#da2845', '#123f2f', '#e3dbdb'],
                  ['#eae9e4', '#5b9fcc', '#5b9fcc', '#deab12', '#e62747', '#014e2e'],
                  ['#f1eee7', '#b8331a', '#32221e', '#f2a90e', '#8b884b', '#22608c', '#174f42', '#76aa68'],
                  ['#eae9e4', '#003588', '#056470', '#02203c'],
                  ['#473d3e', '#f5f2eb', '#f5f2eb'],
                  ['#faf9ee', '#e82822', '#fae808', '#598847', '#6397cc', '#f22e83', '#6d2924'],
                  ['#faf9ee', '#e82822', '#fae808', '#598847', '#6397cc', '#f22e83', '#6d2924'],
                  ['#fafbf6', '#4d67b2', '#d83e27', '#6b3d57', '#fff209', '#999db4', '#52745a', '#dd4a70'],
                  ['#e7193d', '#e5b103', '#e5b103', '#e4e1dc', '#e4e1dc', '#3b7340'],
                  ['#f7f3ed', '#013a9d', '#ce0139', '#402533', '#a3a9b9', '#0f6c50', '#7dad4b', '#efd855', '#f76722'],
                  ['#f7f3ed', '#013a9d', '#ce0139', '#402533', '#a3a9b9', '#0f6c50', '#7dad4b', '#efd855', '#f76722'],
                  ['#f5f2ea', '#04488a', '#1f7bfa', '#f20f1e', '#6e6968'],
                  ['#f2efe8', '#3b2321', '#676f94', '#676f94'],
                  ['#f4f6f8', '#7da825', '#0473c4', '#ee8605', '#aa090f', '#e2e0d2', '#01993b', '#e2e0d2', '#dc318b'],
                  ['#34303a', '#7da825', '#0473c4', '#ee8605', '#aa090f', '#e2e0d2', '#01993b', '#e2e0d2', '#dc318b'],
                  ['#080804', '#f8f8f4', '#f8f8f4'],
                  ['#080804', '#f8f8f4', '#f8f8f4'],
                  ['#f8f8f4', '#080804', '#080804'],
                  ['#f8f8f4', '#080804', '#080804'],
                  ['#f8f8f4', '#002b59', '#081b59'],
                  ['#f8f8f4', '#ac3235', '#ac3235']];

let sizes = [[16,32,64,128,256], [20,40,60,80,100,120,140,160], [100,200]];
let ranges = [[20,100,60,300], [20,100,60,300], [20,100,60,300], [10,100,60,500], [10,200,10,200]];

// VARIABLES

let colors, intensity, mirrorH, mirrorV, mirrorChromeShift, partialMirroring, mirrorRatio, mirrors = [];
let displayScale = 1, displayWidth, displayHeight;
let newDisplayScale, newDisplayWidth, newDisplayHeight;
let replot = false, replotStep = 0, doExport = false;
let circleDrawingMode = 0, circleDrawingDivider = 1;

let Engine = Matter.Engine, Runner = Matter.Runner, Bodies = Matter.Bodies, Composite = Matter.Composite, engine;
let bodies = [], steps = [];
let physicsWidth = 1200, physicsHeight = 1600;
let minTotalArea, circleRatio, timeFactor, border;
let staticArg = {isStatic: true};
let attStrength = 1e-5;
let attractorArg = {isStatic: true, plugin: { attractors: [ function(bodyA, bodyB) { return { x: (bodyA.position.x - bodyB.position.x) * attStrength, y: (bodyA.position.y - bodyB.position.y) * attStrength, } } ] } };
let setInv, splitH, splitV, shake, withAttractor;
let minFrame = 0, maxFrame = 900;
let tilt = false, endFrame;

// FXHASH

let fxrCycleIndex = 0, fxrCycleArr = [];
for (let i = 0; i < 500000; i++) {
  fxrCycleArr.push(fxrand());
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

function fxrc(a, b) {
  if (fxrCycleIndex >= fxrCycleArr.length) {
    fxrCycleIndex = 0;
  }
  let r = fxrCycleArr[fxrCycleIndex++];
  if (typeof a == 'undefined') {
    return r;
  } else if (Array.isArray(a)) {
    return a[Math.floor(r * a.length)];
  } else {
    if (typeof b == 'undefined') {
      b = a;
      a = 0;
    }
    return r*(b-a)+a;
  }
}

// INITIALIZE

function setup() {
  displayWidth = int(min(windowWidth, windowHeight*(3/4)));
  displayHeight = int(displayWidth/(3/4));
  displayScale = displayWidth/physicsWidth;
  pixelDensity(1);
  createCanvas(displayWidth, displayHeight);
  
  console.log(fxhash);

  // PARAMETERS
  timeFactor = fxr(0.85,1.3);
  maxFrame = int(maxFrame * timeFactor);
  minTotalArea = fxr(300000,650000);
  sizes = fxr(sizes);
  ranges = fxr(ranges);
  intensity = fxr(35,80);
  setInv = fxr() < 0.33;
  withAttractor = fxr() < 0.27;
  splitV = fxr() < 0.35;
  splitH = fxr() < 0.35; 
  shake = fxr() < 0.33; 
  border = fxr(75, 225);
  circleRatio = fxr([0.05,0.1,0.2,0.3,0.5,0.55,0.75]);
  mirrorV = fxr() < 0.1;
  if (mirrorV) {
    mirrorH = fxr() < 0.1;
  } else {
    mirrorH = fxr() < 0.5;
  }
  partialMirroring = fxr() < 0.75;
  mirrorChromeShift = fxr() < 0.75;
  mirrorRatio = fxr(0.2,0.8);
  alpha = int(fxr(32,80));
  alpha *= timeFactor;

  colors = fxr(palettes);
  colors = colors.map(x => color(x));
  for (let i = 1; i < colors.length; i++) {
    colors[i].setAlpha(alpha);
  }
  colors[0].setAlpha(255);
  background(colors[0]);

  circleDrawingMode = fxr([0,0,0,0,0,0,0,1]);
  circleDrawingDivider = fxr(0.1, 1);

  // INITIALIZE PHYSICS
  engine = Engine.create();

  // ATTRACTORS
  if (withAttractor) {
    Matter.use('matter-attractors');
    engine.world.gravity.scale *= fxr([0,0.25,0.5]);
    if (fxr() > circleRatio) {
      addRect(physicsWidth/2, physicsHeight*fxr([0.33,0.5,0.5,0.5,0.66]), fxr([32,64,128]),fxr([32,64,128]), attractorArg);
    } else {
      addCircle(physicsWidth/2, physicsHeight*fxr([0.33,0.5,0.5,0.5,0.66]), fxr([32,64,128]), attractorArg);
    }
  }

  // BOUNDARIES
  addRect(physicsWidth/2, border/2, physicsWidth, border, staticArg); // ceiling
  addRect(physicsWidth/2, physicsHeight-border/2, physicsWidth, border, staticArg); // ground
  addRect(border/2, physicsHeight/2, border, physicsHeight, staticArg); // left
  addRect(physicsWidth-border/2, physicsHeight/2, border, physicsHeight, staticArg); // right
 
  // DIVIDERS
  if (splitH) {
    let mids = int(fxr(1, 3));
    for (let i = 0; i < mids; i++) {
      addRect((i+1)*physicsWidth/(mids+1), physicsHeight/2, fxr([8,16,32,64,80]), physicsHeight, staticArg);
    }
  }

  if (splitV) {
    let mids = int(fxr(1,3));
    for (let i = 0; i < mids; i++) {
      addRect(physicsWidth/2, (i+1)*physicsHeight/(mids+1), physicsWidth, fxr([8,16,32,64,80]), staticArg);
    }
  }

  // INVISIBLE BODIES
  if (setInv) {
    let limit = fxr(2, 8);
    for (let i = 0; i < limit; i++) {
      addRect(fxr(border*1.2, physicsWidth-border*1.2), fxr(border*1.2, physicsHeight-border*1.2), fxr(20, 50), fxr(50, 75), staticArg);
    }
  }

  // VISIBLE BODIES
  let totalArea = 0;
  while (totalArea < minTotalArea) {
    let body;

    if (fxr() > circleRatio) {
      body = addRect(fxr(border*1.2, physicsWidth-border*1.2), fxr(border*1.2, physicsHeight-border*1.2), fxr(ranges[0], ranges[1]), fxr(ranges[2], ranges[3]), false);
    } else {
      body = addCircle(fxr(border*1.2, physicsWidth-border*1.2), fxr(border*1.2, physicsHeight-border*1.2), 0.5*fxr(sizes), false);
    }

    totalArea += body.area;
    bodies.push(body);
    mirrors.push(fxr()<mirrorRatio);
    Matter.Body.setAngle(body, fxr([0,0,0,PI*0.5])+fxr(-0.1,0.1));
  }

  engine.world.gravity.y = fxr([-1,-1,0,1,1,1,1]);
  if ((engine.world.gravity.y) != 1 && !shake) {
    shake = fxr() < 0.5; 
  }
  if (engine.world.gravity.y == 0) {
   engine.world.gravity.x = fxr([-1,1]);
  }  

  runner = Runner.create();
  Runner.run(runner, engine);
}

function addRect(x,y,w,h,args) {
  let body = Bodies.rectangle(x,y,w,h,args);
  Composite.add(engine.world, body);
  return body;
}

function addCircle(x,y,r,args) {
  let body = Bodies.circle(x,y,r,args);
  Composite.add(engine.world, body);
  return body;
}

// DRAWING

function windowResized() {
  newDisplayWidth = int(min(windowWidth, windowHeight*(3/4)));
  newDisplayHeight = int(newDisplayWidth/(3/4));
  newDisplayScale = newDisplayWidth/physicsWidth;
  replot = true;
  replotStep = 0;
}

function draw() {
  noStroke();

  if (shake) {
    if (frameCount == 10) {
      engine.world.gravity.y = fxr(-1,1);
      engine.world.gravity.x = fxr(-1,1);
    }
    if (frameCount == 55) {
      engine.world.gravity.y = fxr(-1,1);
      engine.world.gravity.x = fxr(-1,1);
    }
    if (frameCount == 100) {
      engine.world.gravity.y = 0;
      engine.world.gravity.x = 0;
    }  
  }  

  if (frameCount < maxFrame && frameCount >= minFrame) {
    let step = [];
    for (let i = 0; i < bodies.length; i++) {
      let body = bodies[i];
      let bodyCopy = {label: body.label, posx: body.position.x, posy: body.position.y, area: body.area, radius: body.circleRadius, v0x: body.vertices[0].x, v0y: body.vertices[0].y, v1x: body.vertices[1].x, v1y: body.vertices[1].y, v2x: body.vertices[2].x, v2y: body.vertices[2].y, v3x: body.vertices[3].x, v3y: body.vertices[3].y};
      step.push([bodyCopy,i])
      drawBody(bodyCopy, i);
    }
    steps.push(step);
  }

  if (frameCount == maxFrame) {
    console.log('First plot done, stopping engine')
    fxpreview();
    engine.enabled = false;
  }

  if ((frameCount > maxFrame) && tilt) {
    for (let i = 0; i < bodies.length; i++) {
      let body = bodies[i];
      let bodyCopy = {label: body.label, posx: body.position.x, posy: body.position.y, area: body.area, radius: body.circleRadius, v0x: body.vertices[0].x, v0y: body.vertices[0].y, v1x: body.vertices[1].x, v1y: body.vertices[1].y, v2x: body.vertices[2].x, v2y: body.vertices[2].y, v3x: body.vertices[3].x, v3y: body.vertices[3].y};
      drawBody(bodyCopy, i);
    }
  }

  if (frameCount == endFrame) {
    engine.enabled = false;
    tilt = false;
    engine.world.gravity.x = 0;
    engine.world.gravity.y = 0;
  }

  if (replot && (frameCount > maxFrame) && (replotStep < steps.length)) {
    if (replotStep == 0) {
      console.log('Replotting');
      displayScale = newDisplayScale;
      displayWidth = newDisplayWidth;
      displayHeight = newDisplayHeight;
      resizeCanvas(displayWidth, displayHeight);
      background(colors[0]);
      fxrCycleIndex = 0;
    }
    let step = steps[replotStep];
    for (let i = 0; i < step.length; i++) {
      drawBody(step[i][0], step[i][1]);
    }
    replotStep++;
    if (replotStep == steps.length) {
      console.log('Replot done');
      replot = false;
      replotStep = 0;
      if (doExport) {
        saveCanvas();
        doExport = false;
        console.log('Export done');
      }
    }
  }
}


function drawBody(b, c) {
  let fillCol = colors[c % (colors.length)];
  let mirrorCol = fillCol;

  if (mirrorChromeShift) {
    mirrorCol = colors[(c+1) % (colors.length)];
  }

  if (b.label == "Rectangle Body") {
    for (let i = 0; i < b.area/intensity; i++) {
      let a1 = fxrc(), a2 = fxrc();
      let p1 = [lerp(b.v0x, b.v1x, a1), lerp(b.v0y, b.v1y, a1)];
      let p2 = [lerp(b.v3x, b.v2x, a1), lerp(b.v3y, b.v2y, a1)];
      let p3 = [lerp(p1[0], p2[0], a2), lerp(p1[1], p2[1], a2)];
      drawPoint(p3[0], p3[1], c, fillCol, mirrorCol);
    }
  }

  if (b.label === "Circle Body") {
    for (let i = 0; i < b.area/intensity; i++) {
      let angle = fxrc()*2*PI;
      let d = b.radius*sqrt(fxrc());
      if (circleDrawingMode == 1) {
        d *= circleDrawingDivider;
        i += (1/circleDrawingDivider);
      }
      drawPoint((b.posx+cos(angle)*d), (b.posy+sin(angle)*d), c, fillCol, mirrorCol);
    }
  }
}

function drawPoint(x, y, c, fillCol, mirrorCol) {
  fill(fillCol);
  plotPoint(x, y);
  fill(mirrorCol);
  if (partialMirroring) {
    if (mirrors[c]) {
      mirrorH && plotPoint(physicsWidth-x,y);
      mirrorV && plotPoint(x,physicsHeight-y);
      mirrorH && mirrorV && plotPoint(physicsWidth-x,physicsHeight-y);  
    }
   } else {
      mirrorH && (fxrc()<mirrorRatio) && plotPoint(physicsWidth-x, y);
      mirrorV && (fxrc()<mirrorRatio) && plotPoint(x, physicsHeight-y);
      mirrorH && (fxrc()<mirrorRatio) && mirrorV && plotPoint(physicsWidth-x, physicsHeight-y);
    }
  }

function plotPoint(x,y) {
  ellipse(x*displayScale, y*displayScale, displayScale*(1.0+fxrc()));
}

function keyPressed() {
  if (key.toLowerCase() === "s") {
    console.log('Saving');
    saveCanvas();
  }
  if (key.toLowerCase() === "e") {
    console.log('Exporting');
    newDisplayWidth = 4000;
    newDisplayScale = newDisplayWidth/physicsWidth;
    newDisplayHeight = int(newDisplayScale*physicsHeight);
    replot = true, replotStep = 0, doExport = true;
  }
  if (key.toLowerCase() === "t") {
    console.log('Tilting');
    tilt = true;
    engine.enabled = true;
    engine.world.gravity.y = fxr(-1,1);
    engine.world.gravity.x = fxr(-1,1);
    endFrame = frameCount + maxFrame;
  }
  if (key.toLowerCase() === "c") {
    console.log('Clearing');
    background(colors[0]);
  }
}