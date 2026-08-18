let s; //shader
let seed;
let dispDepth;
let colPal;
let secCol;
let stripe;
let spike;
let bg;


function preload() {
  s = loadShader("shader.vert", "shader.frag");
  seed = fxrand()
  dispDepth = window.$fxhashFeatures["Displacement level (0-9)"]*0.1
  colPal =cs[window.$fxhashFeatures[ "Color palette"]]
  secCol =cs[window.$fxhashFeatures["Tinge palette"]];
  stripe = window.$fxhashFeatures["Stripe level (0-9)"]*0.1
  spike = window.$fxhashFeatures["Spike level (0-9)"]*0.1
  bg = palette(
    bcs[window.$fxhashFeatures["Background color"]]*0.19,
    [0.5,0.5,0.5],
    [0.5,0.5,0.5],
    [1.0,0.7,0.4],
    [0.0,0.15,0.2]
  )
  
}
let bcs = {
  "Beige":0,
  "Clay":1,
  "Aubergine":2,
  "Pitch":3,
  "Mud":4,
  "Pollen":5,
  "Lime":6,
  "Green":7,
  "Teal":8,
  "Blueberry":9,
  "Neon":10,
}
function genBg() {
  let p = Math.floor(fxrand() * 11);
  switch (p) {
    case 0:
      return "Beige";
      break;
    case 1:
      return "Clay";
      break;
    case 2:
      return "Aubergine";
      break;
    case 3:
      return "Pitch";
      break;
    case 4:
      return "Mud";
      break;
    case 5:
      return "Pollen";
      break;
    case 6:
      return "Lime";
      break;
    case 7:
      return "Green";
      break;
    case 8:
      return "Teal";
      break;
    case 9:
      return "Blueberry";
      break;
    default:
      return "Neon";
  }
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  noStroke();
}

function getColPal(p) {
  if (p < 0.2) return 0;
  if (p < 0.4) return 1;
  if (p < 0.6) return 2;
  if (p < 0.8) return 3;
  return 4;
}
function quantize(p) {
  return Math.floor(p * 10);
}

function parseColor(c) {
  return `R: ${Math.round(red(c))} G: ${Math.round(green(c))} B: ${Math.round(
    blue(c)
  )}`;
}

let cs = {
  Tropicana: 0,
  Dusk: 1,
  Monochrome: 2,
  Spectrum: 3,
  Peachy: 4,
};

function getPalName(p) {
  switch (p) {
    case 0:
      return "Tropicana";
      break;
    case 1:
      return "Dusk";
      break;
    case 2:
      return "Monochrome";
      break;
    case 3:
      return "Spectrum";
      break;
    default:
      return "Peachy";
  }
}

function draw() {
  background(bg);
  orbitControl();
  //SHADER
  shader(s);
  s.setUniform("time", frameCount);
  s.setUniform("seed", seed);
  s.setUniform("disp", dispDepth);
  s.setUniform("pal", colPal);
  s.setUniform("spal", secCol);
  s.setUniform("str", stripe);
  s.setUniform("spk", spike);

  sphere(width * 0.2, 200, 200);
}
function fract(f) {
  return f % 1;
}
function hash11(p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

window.$fxhashFeatures = {
  "Displacement level (0-9)": quantize(hash11(fxrand() + fxrand())),
  "Color palette": getPalName(getColPal(hash11(fxrand() * 69))),
  "Stripe level (0-9)": quantize(hash11(hash11(fxrand()))),
  "Tinge palette": getPalName(getColPal(fxrand())),
  "Spike level (0-9)": quantize(hash11(fxrand() + hash11(fxrand() + 69))),
  "Background color": genBg(),
  // here define the token features
};

function palette(t, a, b, c, d) {
  let R = a[0] + b[0] * Math.cos(Math.PI * 2.0 * (c[0] * t + d[0]));
  let G = a[1] + b[1] * Math.cos(Math.PI * 2.0 * (c[1] * t + d[1]));
  let B = a[2] + b[2] * Math.cos(Math.PI * 2.0 * (c[2] * t + d[2]));
  return [R * 255, G * 255, B * 255];
}