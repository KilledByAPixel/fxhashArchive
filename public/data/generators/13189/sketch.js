let w = 2500;
let x, y, canvascolor, isbehindclouds;
let treevar,
  texturevar,
  treebranchvar,
  plantvar,
  plant2var,
  plant3var,
  createlandscapevar,
  bgnoisevar,
  hillsvar,
  hills2var,
  spherevar,
  cloudsvar,
  scaleset,
  scalesetm,
  colorsvar,
  colorsplant3,
  plantcolor3,
  canhaveplant3,
  hasgradient;
let strokecolor,
  watercolor,
  reflectioncolor,
  spherecolor,
  treetrunkcolor,
  treebranchcolor,
  plantcolor,
  plant2color,
  cloudcolor,
  wallcolor,
  noisecolor,
  skycolor,
  riveredgecolor,
  weathervar,
  plant2lot;

function setup() {
  let seed = floor(999999 * fxrand());
  randomSeed(seed);
  noiseSeed(seed);
  let tempcan = createCanvas(w, w * 1.5);
  tempcan.parent("fullscreen");
  pixelDensity(1);
  colorsvar = new Colors();
  colorsvar.choose();
  colorsplant3 = [
    canvascolor,
    skycolor,
    strokecolor,
    reflectioncolor,
    spherecolor,
    treetrunkcolor,
    treebranchcolor,
    riveredgecolor,
    plant2color,
    cloudcolor,
    wallcolor,
  ];
  plantcolor3 = random(colorsplant3);
  background(skycolor);
  hasgradient = random(1);
  if (hasgradient > 0.3) {
    for (var yg = 0; yg < height; yg++) {
      m = map(yg, 0, height / 2, 0, 1);
      var gradientboth = lerpColor(canvascolor, skycolor, m);
      stroke(gradientboth);
      line(0, yg, height, yg);
    }
  }
  stroke(0);
  strokeWeight(2);
  noLoop();
  weathervar = new Weather();
  plant2lot = int(random(1, 10.99));
  canhaveplant3 = random(1);
  isbehindclouds = random(1);
  texturevar = new Texture1();
  cloudsvar = new Clouds();
  spherevar = new Skysphere();
  hillsvar = new Hills();
  hills2var = new Hills2();
  treevar = new Tree(400, height / 2 + 50);
  treebranchvar = new TreeBranch();
  plantvar = new Plant();
  plant2var = new Plant2();
  plant3var = new Plant3();
  createlandscapevar = new CreateLandscape();
  bgnoisevar = new BGnoise();
  scaleset = random(1, 3.5);
  scalesetm = scaleset * 100;
}

function draw() {
  push();
  scale(scaleset, scaleset);
  if (scaleset > 1.1) {
    translate(scaleset * scalesetm * -1, scaleset * scalesetm * -1);
  } else {
    translate(0, scaleset * scalesetm * -1);
  }
  bgnoisevar.draw();
  hills2var.draw();
  if (isbehindclouds >= 0.5) {
    cloudsvar.draw();
    spherevar.draw();
    cloudsvar.draw();
    texturevar.draw();
  } else {
    spherevar.draw();
    cloudsvar.draw();
    texturevar.draw();
  }
  hillsvar.draw();
  createlandscapevar.draw();
  weathervar.draw();
  pop();
  stroke(canvascolor);
  noFill();
  strokeWeight(75);
  rect(0, 0, width, height);
  loadPixels();
  for (g = 0; g < height; g++) {
    for (f = 0; f < width; f++) {
      var rgbs = (f + g * width) * 4;
      pixels[rgbs + 0] = pixels[rgbs + 0] - random(50);
      pixels[rgbs + 1] = pixels[rgbs + 1] - random(50);
      pixels[rgbs + 2] = pixels[rgbs + 2] - random(50);
      pixels[rgbs + 3] = pixels[rgbs + 3] - random(75);
    }
  }
  updatePixels();
  fxpreview();
}
