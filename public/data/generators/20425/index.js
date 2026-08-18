let theShader;
const a = 0.75;
let view = "p";
let pd = 2;
let loops = 0;
let bor = 1;
const xSeed = Math.floor(fxrand() * 80000 + 15000) / 1000;
const ySeed = Math.floor(fxrand() * 80000 + 15000) / 1000;
const mSeed = Math.floor(fxrand() * 80000 + 15000) / 1000;
const c = createPalette();
const format = weightedRandom([
  [15, [0, "Fill"]],
  [1, [1, "Vortex"]],
  [40, [2, "Horizontal"]],
  [25, [3, "Vertical"]],
  [10, [4, "Circle"]],
  [6, [5, "Down"]],
  [3, [6, "Up"]],
]);
const lac = weightedRandom([
  [c[6],
    [2.0, "Low"]
  ],
  [c[7],
    [2.2, "Mid"]
  ],
  [c[8],
    [2.5, "High"]
  ],
]);
const dir = weightedRandom([
  [1, 1],
  [1, -1],
]);
window.$fxhashFeatures = {
  "Format": format[1],
  "Palette": c[10],
  "Gnarliness": lac[1],
}

function preload() {
  theShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  pd = max(2.5, displayDensity());
  pixelDensity(pd);
  createCanvas(min(windowWidth, floor(windowHeight * a)), min(windowHeight, floor(windowWidth / a)), WEBGL);
  background(224, 219, 201);
}

function draw() {
  background(224, 219, 201);
  theShader.setUniform('u_resolution', [width * pd, height * pd]);

  theShader.setUniform('u_xSeed', xSeed);
  theShader.setUniform('u_ySeed', ySeed);
  theShader.setUniform('u_mSeed', mSeed);
  theShader.setUniform('u_lac', lac[0]);
  theShader.setUniform('u_format', format[0]);
  theShader.setUniform('u_dir', dir);
  theShader.setUniform('u_edge', c[9]);
  theShader.setUniform('u_bor', bor);

  theShader.setUniform('u_clr0', c[0]);
  theShader.setUniform('u_clr1', c[1]);
  theShader.setUniform('u_clr2', c[2]);
  theShader.setUniform('u_clr3', c[3]);
  theShader.setUniform('u_clr4', c[4]);
  theShader.setUniform('u_clr5', c[5]);

  shader(theShader);

  rect(0, 0, width, height);
  if (loops > 0) {
    noLoop();
    fxpreview();
  }
  loops++;
}

function weightedRandom(wArray_) {
  let wTotal = 0;
  let wOutput;
  for (let i = 0; i < wArray_.length; i++) {
    wTotal += wArray_[i][0];
  }
  let wRand = fxrand() * wTotal;
  let wCount = 0;
  for (let i = 0; i < wArray_.length; i++) {
    wCount += wArray_[i][0];
    if (wRand < wCount) {
      wOutput = wArray_[i][1];
      break;
    }
  }
  return wOutput;
}

function createPalette() {
  const allPalettes = [
    [8, ["cccccc", "005980", "00a8e8", "007ea7", "003459", "00171f", 30, 60, 10, 0.5, "Xenon"]],
    [8, ["ebc45b", "7a6706", "af9a11", "e49a11", "e17810", "c9500f", 30, 60, 10, 0.5, "Citra"]],
    [8, ["BDC9C3", "545b55", "A0BAB3", "5B7171", "645550", "1f1717", 30, 60, 10, 0.5, "Cement"]],
    [8, ["BAAB7F", "871a0e", "c93d30", "a31f18", "82240a", "4a1917", 30, 60, 10, 0.5, "Heirloom"]],
    [8, ["A7C495", "789660", "65b377", "3f7f6f", "274f54", "1A3340", 30, 60, 10, 0.5, "Succulent"]],

    [6, ["ACC48F", "28821C", "7cc953", "3c9e26", "146612", "143b0a", 30, 60, 10, 0.5, "Canopy"]],
    [6, ["4D1318", "691f25", "e4be55", "cf8e49", "af4b09", "860f07", 30, 60, 10, 0.25, "Ember"]],
    [6, ["988f2a", "202018", "82711e", "998e14", "db590d", "6b5224", 30, 60, 10, 0.25, "Lentil"]],
    [6, ["D5A021", "465C76", "9bb3d1", "627b99", "2a3d52", "122030", 33, 66, 1, 0.5, "Zea"]],
    [6, ["AB250E", "AB250E", "b8b4b5", "918d90", "4f4d4e", "1c1b1b", 33, 66, 1, 0.25, "Tenacious"]],
    [6, ["42361d", "605133", "a6add8", "a471b2", "96557b", "845f4d", 33, 66, 1, 0.25, "Range"]],

    [4, ["B5A58A", "525970", "8d99ae", "2b2d42", "EF233C", "A0031D", 30, 60, 10, 0.5, "Chimera"]],
    [4, ["C4947E", "faa275", "ff8c61", "ce6a85", "985277", "5c374c", 30, 60, 10, 0.5, "Gelato"]],
    [4, ["D6AEB8", "B476AC", "ec9ded", "c880b7", "9f6ba0", "4a2040", 30, 60, 10, 0.5, "Confection"]],
    [4, ["33261d", "33261d", "334e58", "fcbfb7", "a69888", "6b6d76", 33, 66, 1, 0.25, "Granite"]],
    [4, ["293745", "293745", "4f6272", "b7c3f3", "dd7596", "cf1259", 33, 66, 1, 0.25, "Nebula"]],
    [4, ["1D2E45", "1D2E45", "f79256", "fbd1a2", "7dcfb6", "3D9CA8", 33, 66, 1, 0.25, "Reef"]],

    [1, ["000000", "000000", "000000", "000000", "000000", "000000", 90, 9, 1, 0.0, "Black"]],
    [1, ["F7E8A8", "8C2719", "020122", "ff521b", "fc9e4f", "edd382", 90, 9, 1, 0.5, "Flux"]],

  ];
  let colorPalette = weightedRandom(allPalettes);
  for (let i = 0; i < 6; i++) {
    let hexClr = hexToRgb(colorPalette[i]);
    colorPalette[i] = [hexClr.r / 255, hexClr.g / 255, hexClr.b / 255]; // rgb
  }
  return colorPalette;
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    // convert then mix with background color
    r: parseInt(result[1], 16) * 0.925 + 16.8,
    g: parseInt(result[2], 16) * 0.925 + 16.4,
    b: parseInt(result[3], 16) * 0.925 + 15
  } : null;
}

function keyPressed() {
  if (key == "1" || key == "2" || key == "3" || key == "4" || key == "5" || key == "6" || key == "7" || key == "8" || key == "9") {
    clear();
    pd = 1 + (1 * key);
    pixelDensity(pd);
    loops = 0;
    draw();
    saveCanvas("Primordial-" + floor(width * pd) + "x" + floor(height * pd), 'png');
    return false;
  }
  if (key == "b" || key == "B") {
    bor *= -1;
    loops = 0;
    draw();
  }
  if (key == "l" || key == "L") {
    pd = displayDensity();
    pixelDensity(pd);
    resizeCanvas(min(windowWidth, floor(windowHeight / a)), min(windowHeight, floor(windowWidth * a)));
  }
  if (key == "s" || key == "S") {
    pd = displayDensity();
    pixelDensity(pd);
    resizeCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight));
  }
  if (key == "p" || key == "P") {
    pd = displayDensity();
    pixelDensity(pd);
    resizeCanvas(min(windowWidth, floor(windowHeight * a)), min(windowHeight, floor(windowWidth / a)));
  }
  if (key == "f" || key == "F") {
    pd = displayDensity();
    pixelDensity(pd);
    resizeCanvas(windowWidth, windowHeight);
  }
}
