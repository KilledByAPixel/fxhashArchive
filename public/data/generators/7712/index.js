/* 

title : Sedimentary Dissolution

This piece is inspired by the geological processes related to sedimentary dissolution.
Dissolution is a form of weathering which contributes to the creation of new rocks.
In this piece, various algorithms take on the role of dissolution, producing 
visual recombinations of the original "sedimentary rock".

Instructions ::

p : save a hi-res image
e : toggle erosion on and off
s : toggle structure on and off
a : toggle all effects on and off

If offset, rgb dissolution or cross-bedding is true you can toggle it on and off.
If these features are false pressing the key will have no effect.

o : toggle offset on and off
r : toggle rgb dissolution on and off
c : toggle cross-bedding on and off

There are 20 versions you can explore, all using the same features.
Use the left and right arrow to change the random seed. 
Pressing space will reinstantiate the original random seed.
*/

let uniformsShader;

var canvas_storage, shader_seed, seed, seedIndex, seedSet;
var ranimg;

var staticChunkProb;
var currentDoRotate, currentDoOffset;
var enableDestroyProb, enableRGBFilter, enableDefault, enableRotate, enableOffset, enableShaderMode;

var dim;
var canvas;
var horizontalProb, limit, currentColor, colorChangeProb, useColorProb, boxCorners;
var doRotate, densityLevel, destroyProb, shaderMode, doOffset, useBG, colorIndex, rgbFilter, shaderRes;

const palettes = [
  "00a19dfff8e5 e05d5d 2c2e43595260b2b1b9ffd523",

  "fff8f3a3e4db1c6dd0fed1ef 2c2e43595260b2b1b9ffd523",

  "a2d2fffef9efff865efee440",

  "3db2ffffeddaffb830ff2442",

  "f0e4d7f5c0c0ff71719fd8df f4f9f9ccf2f4a4ebf3aaaaaa"
];

const palette_names = ["natural asphalt", "diatomite", "arkose", "hematite", "bauxite"];
const palette_names_old = ["primary", "bright", "muted 1.", "bold", "muted 2."];
const style_names = ["default", "flow field", "repeated shift", "rotate", "wobble", "repeated", "horizonal shift", "diagonal wave"];

/*
const capturer = new CCapture({
  framerate: 5,
  format: "png",
  name: "video_color",
  quality: 100,
  verbose: true,
});
*/

function preload() {
  pickFeatures(); // doesn't work in setup

  // begin generate random values to use in shader
  let n = 512;
  ranimg = createImage(n, n);
  ranimg.loadPixels();
  for (let i = 0; i < ranimg.width; i++) {
    for (let j = 0; j < ranimg.height; j++) {
      ranimg.set(i, j, [random(255),0,0,1.]);
    }
  }
  ranimg.updatePixels();
  // end generate random values to use in shader

  uniformsShader = loadShader('uniform.vert', 'uniform.frag');  
}

function scaled(x) {
  return (x / 950) * width;
}

function hexToRgb(hex) {
  var x = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return [parseInt(x[1],16),parseInt(x[2],16), parseInt(x[3],16)];
}

function rgbToHsv(r, g, b) {
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;
  var d = max - min;
  s = max === 0 ? 0 : d / max;
  if(max == min) {
      h = 0; // achromatic
  }
  else {
      switch(max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }
  return [h*360, s*100, v/255 * 100];
}

function parseHexStrings(hs) {
  let hexs = []
  hs = hs.replace(/\s/g, '');
  for (let i=0; i<hs.length/6; i++) {
    hexs.push( hexToRgb(hs.substring(i*6,(i+1)*6)) );
  }
  return hexs;
}

function randitem(lst) {
  return lst[randint(0,lst.length)];
}

function randfloat(min,max) {
  return random() * (max - min) + min;
}

function randint(min,max) {
  return Math.floor(min + ((max-0.00001) - min) * random());
}

const pick = (arr) => arr[(random() * arr.length) | 0];
function getWeightedOption(options) {
  let choices = [];
  for (let i in options)
    choices = choices.concat(new Array(options[i][1]).fill(options[i][0]));
  return pick(choices);
};

function adjust_color(color) {
  let cc = 15;
  let hsv = rgbToHsv(...color);
  return [
    hsv[0] + random(-cc,cc) * 0.1,
    hsv[1] + random(-cc,cc) * 0.1,
    hsv[2] + random(-cc,cc) * 0.5
  ];
}


function pickFeatures() {

  seedSet = [];
  seedIndex = 0;
  for (let i=0; i<20; i++) {
    seedSet.push( fxrand() * 72368239 );
  }

  seed = seedSet[seedIndex]
  randomSeed(seed);

  /*
  colorIndex = randint(0, palettes.length);
  useBG = Boolean(round(random()));
  doRotate = Boolean(round(random()));
  doOffset = Boolean(round(random()));
  densityLevel = Boolean(round(random()));
  destroyProb = randitem([0.1,0.25,1.0]);
  shaderMode = getWeightedOption([[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]]);
  rgbFilter = Boolean(round(random()));
  shaderRes = getWeightedOption([[16,1],[32,1],[64,1],[128,1]]);
  */

  // with biases
  colorIndex = getWeightedOption([[0,25],[1,30],[2,15],[3,20],[4,10]]);
  useBG = getWeightedOption([[false,6],[true,4]]);
  doRotate = getWeightedOption([[false,19],[true,1]]);
  doOffset = getWeightedOption([[false,8],[true,2]]);
  densityLevel = getWeightedOption([[false,2],[true,8]]);
  destroyProb = getWeightedOption([[0.1,1],[0.25,1],[1.0,1]]);
  shaderMode = getWeightedOption([[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]]);
  rgbFilter = getWeightedOption([[false,19],[true,1]]);
  shaderRes = getWeightedOption([[16,1],[32,2],[64,3],[128,2]]);

  staticChunkProb = getWeightedOption([[0.25,1],[0.75,1]]);

  colors = parseHexStrings(palettes[colorIndex]);

  if (shaderMode == 1) {
    densityLevel = true;
    shaderRes = getWeightedOption([[16,1],[32,1],[64,1]]);
  }
  if (shaderMode == 7) {
    doRotate = false;
    shaderRes = 128;
  }
  if (shaderMode == 3) {
    shaderRes = getWeightedOption([[32,1],[64,1],[128,1]]);
  }
  if (doRotate) {
    doOffset = false; // can't both be true
  }
  if (doRotate) {
    densityLevel = true; // sparse looks bad
  }

  enableDestroyProb = true;
  enableRGBFilter = true;
  enableShaderMode = true;
  enableOffset = true;
  enableRotate = true;
  enableDefault = false;

  window.$fxhashFeatures = {
    "Cross-bedding" : doRotate,
    "Dense" : densityLevel,
    "Erosion Probability" : destroyProb,
    "Has Pigmentation" : useBG,
    "Number of Layers" : shaderRes,
    "Offset" : doOffset,
    "RGB Dissolution" : rgbFilter,
    "Rock Type" : palette_names[colorIndex],
    "Structure" : style_names[shaderMode],
  };

  console.log(window.$fxhashFeatures);

}

function draw_base() {

  randomSeed(seed);
  clear();
  resetShader();
  rectMode(CORNER);

  stroke(0);

  shader_seed = random(912);

  currentDoOffset = int(enableOffset) * doOffset;
  currentDoRotate = int(enableRotate) * doRotate;

  colorMode(RGB, 255);

  background(0); // need this otherwise p5js won't change background
  if (useBG) {
    background(...randitem(colors));
  }
  else {
    background(245);
  }
  colorMode(HSB, 360, 100, 100, 255);
  
  //let marginFrac = 100000000;
  let margin = 0; //width / marginFrac;
  
  let numSeeds = randint(3, 8);

  horizontalProb = random() * 0.6 + 0.2;
  overlaps = 4; // 8
  boxCorners = true;
  
  let pr = 0.5; // 0.5
  let res = 16; // 16
  let divs = [3, 5, 7, 11, 15];

  let xs = split_interval(width - (2*margin), res, randitem(divs));
  let ys = split_interval(height - (2*margin), res, randitem(divs));

  let seeds = [];
  for (let i=0; i<numSeeds; i++) {
    seeds.push( random() * 912831237 );
  }
  
  for (let nn=0; nn<overlaps; nn++) {
    
    if ((overlaps > 1) && (nn===0)) {
      useColorProb = 1.0; //0.8;
      limit = scaled(250); //scaled(60); // 250
      chunkProb = staticChunkProb; //0.25; //0.25; //0.75;
      pr = 1.0;
      colorChangeProb = 0.1;
    }
    else {
      useColorProb = 0.5; //0.2;
      if (densityLevel) {
        limit = scaled(15);
        colorChangeProb = 0.01; 
      }
      else {
        limit = scaled(45);
        colorChangeProb = 0.1;
      }
      chunkProb = 0.5; //0.25;
      pr = 0.5;
           
    }
    
    /*
    let seeds = [];
    for (let i=0; i<numSeeds; i++) {
      seeds.push( random() * 912831237 );
    }
    */
      

    for (let i=0; i<xs.length - 1; i++) {
      for (let j=0; j<ys.length - 1; j++) {
        if (random() < chunkProb) {
  
          let x = xs[i] + margin;
          let y = ys[j] + margin;
          let w = xs[i+1]-xs[i];
          let h = ys[j+1]-ys[j];
          
          randomSeed(seeds[randint(0,seeds.length)]);
          currentColor = randitem(colors);
          colorChangeProb = random(0.1, 0.5)

          //limit = scaled(random(10, 40));
          
          rec(x - width/2, y - height/2, w, h, pr);
  
        } 
      }
    }
  }

  canvas_storage = get();

}

function dump_image() {
  canvas.canvas.toBlob((blob) => {
    let img = document.getElementById("dst");
    img.src = URL.createObjectURL(blob);
    document.body.appendChild(img);
  }, 'image/jpeg', 0.9);
}

function draw_shader() {

  noStroke();
  rectMode(CENTER);
  fill(245);
  rect(0, 0, dim, dim);
  shader(uniformsShader);

  let mu = [randfloat(-5,5), randfloat(-5,5)];
  uniformsShader.setUniform('seed', shader_seed);
  uniformsShader.setUniform('imgTex', canvas_storage);
  uniformsShader.setUniform('marg', 0.);
  uniformsShader.setUniform('mu', mu);
  uniformsShader.setUniform('ress', shaderRes);
  uniformsShader.setUniform('randvals', ranimg);

  uniformsShader.setUniform('mode', int(enableShaderMode) * shaderMode);
  uniformsShader.setUniform('rgbFilter', int(enableRGBFilter) * rgbFilter);
  uniformsShader.setUniform('agedProb', int(enableDestroyProb) * destroyProb);
  
  
  rect(0, 0, dim, dim);

  dump_image();
}



function setup() {

  dim = 4096;
  pixelDensity(1);
  canvas = createCanvas(dim, dim, WEBGL);
  strokeWeight(scaled(1.5));
  
}

function draw() {

  draw_base();
  draw_shader(); 
  fxpreview(); // do preview 
  noLoop();
  /*
  if (frameCount === 1) capturer.start();
  capturer.capture(canvas.canvas);
  if (frameCount === 25) {
      noLoop();
      capturer.stop();
      capturer.save();
  }
  pickFeatures();
  */
}

function split_interval(l, n, k) {
  let x = new Set();
  x.add( 0 );
  x.add( l );
  for (let i=0; i<k-1; i++) {
    x.add( randint(1,n) * (l/n) );
  }
  out = Array.from(x);
  out.sort(function(a, b) {
    return a - b;
  });
  return out;
}

function rec(x, y, w, h, pr) {
  if (min(w,h) < limit) {
    let prob = random();

    ar = pr;
    
    if (prob < ar) {
      room(x, y, w, h);
    }
    else if (prob < ar + ar * 0.2) {
      if (random() < 0) {
        tri_stair(x, y, w, h);
      }
      else {
        stair(x, y, w, h);
      }
    }
    return;
  }
  //let s = random() * 0.5 + 0.25;
  let s = 0.5;

  if (random() < colorChangeProb) {
    currentColor = randitem(colors);
  }

  if (random() < horizontalProb) {
    rec(x, y, w*s, h, pr);
    rec(x+w*s, y, (1-s)*w, h, pr);
  }
  else {
    rec(x, y, w, h*s, pr);
    rec(x, y+h*s, w, (1-s)*h, pr);
  }
}

function stair(x, y, w, h) {
  noFill();
  //let n = 10; //randint(5,20);
  let n = floor(min(10, max(w,h) / scaled(3)));
  if (w < h) {
    let u = h / n;
    for (let i=0; i<n; i++) {
      rect(x, y + i*u, w, u);
    }
  }
  else {
    let u = w / n;
    for (let i=0; i<n; i++) {
      rect(x + i*u, y, u, h);
    }
  }
}

function tri_stair(x, y, w, h) {
  noFill();
  let n = floor(min(20, max(w,h) / scaled(3)));
  rect(x, y, w, h);
  if (w < h) {
    let u = h / n;
    for (let i=0; i<n; i++) {
      line(x, y + i*u, x + w, y + (i+1)*u);
    }
  }
  else {
    let u = w / n;
    for (let i=0; i<n; i++) {
      line(x + i*u, y, x + (i+1)*u, y + h);
    }
  }
}

function room(x, y, w, h) {
  noFill();
  if (random() < useColorProb) {
    fill(...adjust_color(currentColor), 220); // 200
  }
  else {
    noFill();
  }
  
  let b = scaled(2);
  
  if (currentDoRotate) {
    push();
    translate(x+ width/16,y);
    rotate(0.25 * PI);
    rect(0, 0, w, h);
    pop();
  }
  else if (currentDoOffset) {
    rect(x + width/32, y + width/32, w, h);
  }
  else {
    rect(x, y, w, h);
  }

  if (boxCorners) {
    rect(x - 0.5*b, y - 0.5*b, b, b);
    rect(x + w - 0.5*b, y - 0.5*b, b, b);
    rect(x + w - 0.5*b, y + h - 0.5*b, b, b);
    rect(x - 0.5*b, y + h -0.5*b, b, b);
  }
}

function keyPressed() {
  
  if (keyCode === 80) {
    save("output.png");
  }
  else {
    let redraw = true;
    if (keyCode === 69) {
      enableDestroyProb = !enableDestroyProb;
    }
    else if (keyCode === 82) {
      enableRGBFilter = !enableRGBFilter;
    }
    else if (keyCode === 79) {
      enableOffset = !enableOffset;
    }
    else if (keyCode === 67) {
      enableRotate = !enableRotate;
    }
    else if (keyCode === 83) {
      enableShaderMode = !enableShaderMode;
    }
    else if (keyCode === 65) {
      // toggle between final and orig
      enableDestroyProb = enableDefault;
      enableRGBFilter = enableDefault;
      enableShaderMode = enableDefault;
      enableOffset = enableDefault;
      enableRotate = enableDefault;
      
      enableDefault = !enableDefault;
    }

    // control the seed
    else if (keyCode === 39) {
      seedIndex = (seedIndex + 1) % seedSet.length;
      seed = seedSet[seedIndex];
    }
    else if (keyCode === 37) {
      seedIndex = (seedIndex - 1 + seedSet.length) % seedSet.length;
      seed = seedSet[seedIndex];
    }
    else if (keyCode === 32) {
      seedIndex = 0;
      seed = seedSet[seedIndex];
    }
    else {
      redraw = false;
    }

    if (redraw) {
      draw_base();
      draw_shader();
    }
    
  }
  
}



