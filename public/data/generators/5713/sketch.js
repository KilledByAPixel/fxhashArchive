var resize = {
  time: 0,
  delay: 300,
  handled: true
}

function rand(min, max) {
  return fxrand() * (max - min) + min;
}

var doodles = [];
var segments = [];
var done = false;
var drawn = false;
var doodleCount = 0;
var textureCanvas;
var coverCanvas;
var renderTime = 0;
var prevDim;
var pfiveready = false;

var numRendered = 0;
var first = true;

function setup() {
  createCanvas(cnvw, cnvh);
  colorMode(HSB, 360, 100, 100, 100);
  angleMode(DEGREES);
  noStroke();
  pixelDensity(1);

  strokeCap(ROUND);
  strokeJoin(ROUND);

  loadMapLand();

  pfiveready = true;
}

function loadMapLand(){
  noiseSeed(fxrand() * 1000);
  randomSeed(fxrand() * 4000);

  doodles = [];
  segments = [];
  doodleCount = 0;
  done = false;

  if (!first) settings();
  generateSegments();

    background(sx.palette.bg);

  if(sx.texture == "watercolor"){
    textureCanvas = createGraphics(cnvw, cnvh);
    coverCanvas = createGraphics(cnvw, cnvh);
    textureCanvas.angleMode(DEGREES);
    coverCanvas.strokeCap(ROUND);
    coverCanvas.strokeJoin(ROUND);
    createWatercolorTexture();
  }

  loop();
  first = false;
}

function generateSegments(){
  for (let i = 0; i < sx.numSegments; i++){
    let row = int(i / sx.numDivides);
    let col = i % sx.numDivides

    let x = col * sx.segmentWidth;
    let y = row * sx.segmentHeight;

    segments[i] = new Segment(x, y, col, row, i);
  }
}

function generateDoodle(attempt, type, burstNum){
  if (attempt > sx.numAttempts){
    return {
      valid: false
    }
  }
  else{
    let nd = {};
    let locX;
    let locY;

    if (type == "large"){
      locX = rand(0, width);
      locY = rand(0, height);

      let shape = rand(0, 1);
      if (shape < 0.3) nd = new StraightSidedShape(locX, locY, attempt, null, 3, true);
      else if (shape < 0.6) nd = new StraightSidedShape(locX, locY, attempt, null, 4, true);
      else nd = new Circ(locX, locY, attempt, null, null, true);

    }
    else if (type == "burst"){
      let a = rand(0, special.bursts.ranges[burstNum]) + special.bursts.tilts[burstNum];
      let d = rand(special.bursts.minRad[burstNum], special.bursts.maxRad[burstNum]);
      locX = special.bursts.locations[burstNum].x + sin(a) * d;
      locY = special.bursts.locations[burstNum].y + cos(a) * d;

      nd = new BurstDash(locX, locY, attempt, a, null, null, burstNum);
    }
    else if (type == "chevron"){
      if(rand(0,1) < special.chevrons.individualChance) nd = new Chevron(special.chevrons.x, special.chevrons.y, attempt);
      special.chevrons.x += sin(special.chevrons.a) * special.chevrons.xGap;
      special.chevrons.y += cos(special.chevrons.a) * special.chevrons.xGap;
      special.chevrons.col++;

      if (special.chevrons.col >= special.chevrons.cols){
        special.chevrons.row++;
        special.chevrons.col=0;
        special.chevrons.x = special.chevrons.startX + sin(special.chevrons.a+90) * special.chevrons.yGap;
        special.chevrons.y = special.chevrons.startY + cos(special.chevrons.a+90) * special.chevrons.yGap;
        special.chevrons.startX = special.chevrons.x + rand(-dim*0.01, dim*0.01);
        special.chevrons.startY = special.chevrons.y;
      }
    }
    else{
      locX = rand(0, width);
      locY = rand(0, height);

      let nx = map(locX, 0, width, 0, 1000) * sx.shapeDistribution.res;
      let ny = map(locY, 0, height, 0, 1000) * sx.shapeDistribution.res;

      let shape = noise(nx, ny);

      if (shape < 0.3){
        if (type == "dot") {
          nd = new Dot(locX, locY, attempt, null, 3);
        }
        else nd = new Circ(locX, locY, attempt);
      }
      else if (shape < 0.45){
        nd = new Dash(locX, locY, attempt);
      }
      else if (shape < 0.7){
        if (type == "dot") {
          nd = new Dot(locX, locY, attempt, null, 3);
        }
        else nd = new StraightSidedShape(locX, locY, attempt, null, 3);
      }
      else{
        if (type == "dot") {
          nd = new Dot(locX, locY, attempt, null, 3);
        }
        else nd = new StraightSidedShape(locX, locY, attempt, null, 4);
      }
    }

    if (nd.valid){
      return nd;
    }
    else{
      attempt++;
      return generateDoodle(attempt, type, burstNum);
    }
  }
}

function draw() {
  let m = millis();

  if (!done){
    while(millis() < m+16 ){
      let nd;
      if (special.mega.on && special.mega.count < special.mega.numDoodles) {
        nd = generateDoodle(0, "large");
        special.mega.count++;
      }
      else if (special.bursts.on && special.bursts.count < special.bursts.totalDoodles) {
        let burstNum = 0;
        if (special.bursts.count > special.bursts.numDoodles[0]) burstNum = 1;
        nd = generateDoodle(0, "burst", burstNum);
        special.bursts.count++;
      }
      else if (special.chevrons.on && special.chevrons.count < special.chevrons.numDoodles){
        nd = generateDoodle(0, "chevron");
        special.chevrons.count++;
      }
      else if (doodleCount < sx.numDoodles){
        nd = generateDoodle(0, "general");
        doodleCount++;
      }
      else if (special.dots.count < special.dots.numDoodles){
        nd = generateDoodle(0, "dot");
        special.dots.count++;
        if (special.dots.count >= special.dots.numDoodles){
          done = true;
          break;
        }
      }
      else{
        done = true;
        break;
      }
      if (nd.valid == true) {
        doodles.push(nd);
      }
    }
    loadingIcon();
  }
  else if (!drawn){
    //console.log(doodles);

    if (!sx.animate){
      background(sx.palette.bg);
      if(sx.texture != "flat") {
        image(textureCanvas,0,0);
        coverCanvas.background(sx.palette.bg);
        coverCanvas.blendMode(REMOVE);
        for (let i = 0; i < doodles.length; i++){
         if (doodles[i].large) doodles[i].display(coverCanvas);
        }
        image(coverCanvas,0,0);
        for (let i = 0; i < doodles.length; i++){
          if (!doodles[i].large) doodles[i].display(window);
        }
      }
      else{
        for (let i = 0; i < doodles.length; i++){
          doodles[i].display(window);
        }
      }
    }

    fxpreview();
    drawn = true;
  }

  if (!resize.handled){
    // Check the last time the window resized so we dont constantly deal with it
    // as someone is dragging the window size.
    // Instead, it waits for a pause in resizing.
    if (resize.time + resize.delay < millis() && done){
      handleResize();
      resize.handled = true;
    }
  }
}

// handle resizing and rejig appropriate variables
function handleResize(){
  prevDim = dim;
  if (window.innerWidth <= window.innerHeight){
    dim = Math.min(window.innerWidth, window.innerHeight);
  }
  else{
    dim = Math.min(window.innerWidth, window.innerHeight) * 0.97;
  }
  cnvw = dim;
  cnvh = dim;

  resizeCanvas(cnvw, cnvh);
  if(textureCanvas){
    textureCanvas.resizeCanvas(cnvw, cnvh);
    textureCanvas.clear();
    coverCanvas.resizeCanvas(cnvw, cnvh);
    coverCanvas.clear();
    coverCanvas.blendMode(BLEND);
  }

  for (let d of doodles){
    d.resize();
  }

  drawn = false;

  background(sx.palette.bg);

  if(sx.texture == "watercolor") {
    for (let w of watercolors){
      w.resize();
      w.display();
    }
  }
}

function loadingIcon(){
  let rad = map(sin(sx.loadingSize.t), -1, 1, sx.loadingSize.min, sx.loadingSize.max);
  let sw = map(rad, sx.loadingSize.min, sx.loadingSize.max, sx.loadingSize.swmax, sx.loadingSize.swmin)
  background(sx.palette.bg);
  stroke(sx.palette.loading);
  strokeWeight(sw);
  noFill();
  ellipse(width*0.5, height*0.5, rad);
  sx.loadingSize.t += sx.loadingSize.inc;
}

// Event called whenever the browser window is resized
function myResize() {
  if (pfiveready){
    resize.time = millis();
    resize.handled = false;
  }
}

window.addEventListener('resize', myResize);
