/*
const capturer = new CCapture({
  framerate: 5,
  format: "png",
  name: "video_color",
  quality: 100,
  verbose: true,
});
*/

const DEFAULT_OFFSET = 92323748;
var MIN_NOISE = 0;
var MAX_NOISE = 0;
var NOISE_SCALE = 0.005 * 1000;
var HARD_CLIP = false;
var SAVE_PNG = false;

var whiteWash, style, num_strokes, palette, palettes, globalSize, globalDensity, strokeType, strokeFunc, paletteName;

var canvas;

function pickFeatures() {

  //palette = parseHexStrings("22577E5584AC95D1CCF6F2D4 97BFB4F5EEDCDD4A48 FFB319FFE194E8F6EFB8DFD8");

  //palette = parseHexStrings("f67280c06c846c5b7b355c7d2c2e43595260b2b1b9ffd523d82e3677a9bd285f88e1515800a591b5d9ceec7d3fffbb3a111b32e1d7c6ece4d9");

  palettes = {
    "winter" : parseHexStrings("261c2c3e2c415c527f6e85b2").concat( extraWhite(4) ),
    "sunset" : parseHexStrings("22577E5584AC95D1CCF6F2D4 97BFB4F5EEDCDD4A48 FFB319FFE194E8F6EFB8DFD8"), //.concat( extraWhite(8) ),
    "sunset (blue emphasis)" : parseHexStrings("22577E5584AC95D1CCF6F2D4 97BFB4F5EEDCDD4A48 FFB319FFE194E8F6EFB8DFD8").concat( extraHex("22577E", 32)),
    "sunset (red emphasis)" : parseHexStrings("22577E5584AC95D1CCF6F2D4 97BFB4F5EEDCDD4A48 FFB319FFE194E8F6EFB8DFD8").concat( extraHex("DD4A48", 32)),
    "pastel" : parseHexStrings("f67280c06c846c5b7b355c7d2c2e43595260b2b1b9ffd523d82e3677a9bd285f88e1515800a591b5d9ceec7d3fffbb3a111b32e1d7c6ece4d9"), //.concat( extraWhite(12) ),
    "pastel (green emphasis)" : parseHexStrings("f67280c06c846c5b7b355c7d2c2e43595260b2b1b9ffd523d82e3677a9bd285f88e1515800a591b5d9ceec7d3fffbb3a111b32e1d7c6ece4d9").concat( extraHex("00a591", 32)),
    "autumn" : parseHexStrings("e7e6e1f7f6e7f2a154314e52 f5e6cafb9300f54748343f56 ffd523"),
    "floral" : parseHexStrings("276b7a 61bf9c f8c8cf cdbb4b 28994d 132c19"),
    "saturated" : parseHexStrings("f05e8c ebc734 009c4b 006d96 e41820 ecd8bf 070b0a"),
  };

  palette_probs = {
    "winter" : 18,
    "sunset" : 17,
    "pastel" : 16,
    "saturated" : 15,
    "floral" : 14,
    "autumn" : 10,
    "sunset (blue emphasis)" : 4,
    "sunset (red emphasis)" : 4,
    "pastel (green emphasis)" : 2
  };
  
  let color_options = [];
  for (let pa in palettes) {
    color_options.push([pa, palette_probs[pa]]);
  }

  whites = extraHex("f0f0f0", 12);

  /*
  style = getWeightedOption(
    [["partial blur",1],["blur",1],["curves",2],["lines",2],["blocks",2]]);
  whiteWash = getWeightedOption([[true,1],[false,1]]);
  paletteName = getWeightedOption(color_options);
  globalSize = getWeightedOption([["small",2],["medium",2],["large",2]]);
  globalDensity = getWeightedOption([["low",2],["medium",2],["high",2]]);
  strokeType = getWeightedOption([["small",2],["medium",2],["large",2]]);
  */

  // with probabilities
  ///*
  style = getWeightedOption(
    [["partial blur",12],["blur",4],["curves",24],["lines",28],["blocks",32]]);
  whiteWash = getWeightedOption([[true,40],[false,60]]);
  paletteName = getWeightedOption(color_options);
  globalSize = getWeightedOption([["small",25],["medium",40],["large",35]]);
  globalDensity = getWeightedOption([["low",20],["medium",50],["high",30]]);
  strokeType = getWeightedOption([["small",25],["medium",40],["large",35]]);
  //*/

  palette = cloneArray( palettes[paletteName] );

  if (style == "blur") {
    whiteWash = false;
  }

  if (style == "curves" && globalSize == "medium") {
    // DO NOT ALLOW MEDIUM FOR DIAGONAL
    globalSize = getWeightedOption([["small",1],["large",1]]);
  }

  if (style !== "lines" && style !== "curves") {
    strokeType = "medium";
  }

  if (style == "blur" || style == "partial blur") {
    globalSize = "medium";
    globalDensity = "medium";
    HARD_CLIP = true;
  }
  else {
    HARD_CLIP = false;
  }

  if (style == "lines") {
    globalSize = "medium";
  }

  if (whiteWash) {
    palette = palette.concat( extraWhite(palette.length) );
  }
  shuffle( palette );

  window.$fxhashFeatures = {
    "Style" : style,
    "Size" : globalSize,
    "Density" : globalDensity,
    "Stroke Size" : strokeType,
    "Extra White" : whiteWash,
    "Palette" : paletteName
  }
  console.log(window.$fxhashFeatures);

}

function setup() {

  var mwh = max(min(window.innerWidth, window.innerHeight), 1000);
  canvas = createCanvas(mwh, mwh);
  strokeCap(SQUARE);
  pixelDensity(1);
  pickFeatures();

}

function draw() {
  // reset RNG
  fxrand = sfc32(...hashes);
  paint();
  /*
  if (frameCount === 1) capturer.start();
  capturer.capture(canvas.canvas);
  if (frameCount === 30) {
      noLoop();
      capturer.stop();
      capturer.save();
  }
  */
  if (SAVE_PNG) {
    save("output.png");
    SAVE_PNG = false;
  }
  noLoop();
}

function paint() {

  colorMode(RGB);
  background(250);
  colorMode(HSB, 360, 100, 100, 255);

  let wideStroke = function x() {return getWeightedOption([[30,1]]);};
  let mixedStroke = function x() {return getWeightedOption([[5,80],[30,20]]);};
  let otherStroke = function x() {return getWeightedOption([[5,5],[15,3],[30,2]])};
  let microStroke = function x() {return randfloat(1,4);};

  let thinStroke = function x() {return randfloat(scaled(2),scaled(10));};
  let variedSmallStroke = function x() {return randfloat(scaled(5),scaled(20));};
  let variedStroke = function x() {return randfloat(scaled(5),scaled(40));}; // (2,40)

  if (strokeType == "small") {
    strokeFunc = thinStroke;
  }
  else if (strokeType == "medium") {
    strokeFunc = variedSmallStroke;
  }
  else {
    strokeFunc = variedStroke;
  }

  // make centroids for each color
  let centroids = [];
  let numCentroids = min(max(palette.length, 6), 8);
  for (let i=0; i<numCentroids; i++) {
    centroids.push( [ranPoint(),ranPoint()] );
  }

  let noiseSeed = Math.floor(fxrand() * 18127312);
  let os = openSimplexNoise(noiseSeed);

  // pre-normalize noise on range
  for (let i=0; i<=100; i++) {
    let y = map(i,0,100,0,1);
    let x = os.noise2D(NOISE_SCALE * y, DEFAULT_OFFSET);
    if (i == 0 || x < MIN_NOISE) {
      MIN_NOISE = x;
    }
    if (i == 0 || x > MAX_NOISE) {
      MAX_NOISE = x;
    }
  }

  
  if (style == "blur") {
    let stroke = variedSmallStroke;
    for (let i=0; i<800; i++) {
      let param = randomStroke(
        scaled(80),scaled(160),-0.001,0.001,0,width/8);
      let cx = 0.5 * param[0] + 0.5 * param[6];
      let cy = 0.5 * param[1] + 0.5 * param[7];
      let index = closestIndex([cx,cy], centroids) % palette.length;
      if (fxrand() < 0.75) {
        bezierStroke(...param, [palette[index]], 0.15, stroke, 10);
      }
      else {
        bezierStroke(...param, palette, 0.15, stroke, 10);
      }
    }
  }

  else if (style == "partial blur") {
    for (let i=0; i<600; i++) {
      let param = SideSwipe(os);
      let cx = 0.5 * param[0] + 0.5 * param[6];
      let cy = 0.5 * param[1] + 0.5 * param[7];
      let index = closestIndex([cx,cy], centroids) % palette.length;
      if (fxrand() < 0.3) {
        index = randint(0, palette.length);
      }
      bezierStroke(...param, [palette[index]], 0.075, variedSmallStroke, 20);
    }
  }
  
  else if (style == "blocks") {
    // small medium large
    // work in density

    let numBlocks = 20;
    if (globalDensity == "medium") {
      numBlocks = 35;
    }
    else if (globalDensity == "high") {
      numBlocks = 50;
    }

    let minx, perBlock;
    if (globalSize == "small") {
      minx = width / 32;
      perBlock = 5;
      numBlocks *= 3;
    }
    if (globalSize == "medium") {
      minx = width / 16;
      perBlock = 10;
      numBlocks *= 2;
    }
    else if (globalSize == "large") {
      minx = width / 8;
      perBlock = 15;
    }

    let wave = scaled(10);
    for (let i=0; i<numBlocks; i++) {

      let cx = ranPoint();
      let cy = ranPoint();

      let w = randfloat(minx, minx * 2);
      let h = randfloat(width / 16, width / 8);

      let sx = qq(clamp_point(cx - 0.5*w, width, width/8), minx);
      let sy = qq(clamp_point(cy - 0.5*h, width, width/8), width/16);
      let ex = qq(clamp_point(cx + 0.5*w, width, width/8), minx);
      let ey = qq(clamp_point(cy + 0.5*h, width, width/8), width/16);

      let color = randitem(palette);
      for (let j=0; j<perBlock; j++) {
        let y = lerp(sy, ey, fxrand());
        if (fxrand() < 0.75) {
          let param = lineToStroke(sx, y, ex, y, wave);
          bezierStroke(...param, [color], 0.1, variedSmallStroke);
        }
        else {
          let param = lineToStroke(sx, y, ex, y, wave);
          bezierStroke(...param, [randitem(palette)], 0.1, variedSmallStroke);
        }
      }
    }
  }

  else if (style == "curves") {

    // width/64 width/16
    // width/32 width/16
    // width/16 width/8

    // thin and variedStroke and variedsmallStroke
    //let miny = width / 48;
    //let minx = width / 32;
    
    miny = width / 24;
    minx = width / 16;
    if (globalSize == "large") {
      miny = width / 12;
      minx = width / 8;
    }

    let numStrokes = 50;
    if (globalDensity == "medium") {
      numStrokes = 100;
    }
    else if (globalDensity == "high") {
      numStrokes = 200;
    }

    if (globalSize == "small") {
      numStrokes *= 2;
    }

    for (let i=0; i<numStrokes; i++) {
      let param = HorizontalStroke(miny,minx,true);
      bezierStroke(...param, palette, 0.05, strokeFunc);
    }
  }

  else if (style == "lines") {

    let numStrokes = 100;
    if (globalDensity == "medium") {
      numStrokes = 200;
    }
    else if (globalDensity == "high") {
      numStrokes = 400;
    }

    for (let i=0; i<numStrokes; i++) {
      bezierStroke(...mostlyDiagonalStroke(), palette, 0.05, strokeFunc);
    }
  }

  // WE SHOULD REMOVE SWIRL
  else if (style == "swirl") {
    let stroke = randitem([otherStroke, thinStroke]);
    let cu = randitem([(150/950)*width, (50/950)*width]);
    for (let i=0; i<num_strokes; i++) {
      bezierStroke(...bezierParam(cu,width/6), palette, 0.05, stroke); // variedSmallSroke
    }
  }

  /*
  if (whiteWash) {
    for (let i=0; i<40; i++) {
      bezierStroke(...mostlyHorizontalStroke(width/2,width,0.01,50/950*width), whites, 0.2, wideStroke);
    }
  }
  */
}

// ========================================
// COLOR UTILS

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
    hexs.push( rgbToHsv(...hexToRgb(hs.substring(i*6,(i+1)*6))) );
  }
  return hexs;
}

function extraWhite(n) {
  let cs = [];
  for (let i=0; i<n; i++) {
    cs.push( rgbToHsv(...[240,240,240]) );
  }
  return cs;
}

function extraHex(c,n) {
  let cs = [];
  let s = 5;
  let hsv = rgbToHsv(...hexToRgb(c));
  for (let i=0; i<n; i++) {
    cs.push( [
      hsv[0] + randfloat(-s,s),
      hsv[1],
      hsv[2] + randfloat(-s,s)
    ]);
  }
  return cs;
}


// ========================================
// UTILS

function closestIndex(p, ps) {
  let minValue = width * 100;
  let minIndex = 0;
  for (let i=0; i<ps.length; i++) {
    let v = dist(...p, ...ps[i]);
    if (v < minValue) {
      minValue = v;
      minIndex = i;
    }
  }
  return minIndex;
}

function inBounds(x, y, margin=width/8) {
  return (x >= margin) && (x <= width - margin) && (y >= margin) && (y <= height - margin);
}

function lerp2d(x1, y1, x2, y2, w) {
  return [lerp(x1, x2, w), lerp(y1, y2, w)]
}

function offset2d(x1, y1, x2, y2, w, m) {
  let c = lerp2d(x1,y1,x2,y2,w);
  let angle = atan2(y2-y1,x2-x1) + 0.5 * PI;
  return [c[0] + cos(angle)*m, c[1] + sin(angle)*m];
}

function ranPoint() {
  let margin = width / 8;
  return fxrand() * (width-2*margin) + margin;
}

function lineToStroke(x1, y1, x4, y4, wave) {
  let c1 = offset2d(x1,y1,x4,y4, 0.4, randfloat(-wave,wave));
  let c2 = offset2d(x1,y1,x4,y4, 0.6, randfloat(-wave,wave));
  return [x1, y1, ...c1, ...c2, x4, y4];
}

function clamp_point(x, dim, margin) {
  return min(max(x,margin), dim-margin);
}

// ===================================
// different stroke shapes / lines

// CURRENTLY UNUSED
function bezierParam(amount, margin) {
  amount = (typeof amount !== 'undefined') ? amount : scaled(10);
  margin = (typeof margin !== 'undefined') ? margin : width / 8;
  let x1 = fxrand() * (width-2*margin) + margin;
  let y1 = fxrand() * (height-2*margin) + margin;
  let x4 = fxrand() * (width-2*margin) + margin;
  let y4 = fxrand() * (height-2*margin) + margin;
  let c1 = offset2d(x1,y1,x4,y4, 0.4, randfloat(-amount,amount));
  let c2 = offset2d(x1,y1,x4,y4, 0.6, randfloat(-amount,amount));
  return [x1, y1, ...c1, ...c2, x4, y4];
}

// CURRENTLY UNUSED
function diagonals() {
  let margin = width/8;
  let x1 = fxrand() * (width-2*margin) + margin;
  let x4 = fxrand() * (width-2*margin) + margin;
  let b = fxrand(-50,50);
  let y1 = x1 + b;
  let y4 = x4 + b;
  let f = dist(x1,y1,x4,y4) / (sqrt(2) * (width-2*margin));
  let c1 = offset2d(x1,y1,x4,y4, 0.3, randfloat(-30*f,30*f));
  let c2 = offset2d(x1,y1,x4,y4, 0.7, randfloat(-30*f,30*f));
  return [x1, y1, ...c1, ...c2, x4, y4];
}

// CURRENTLY UNUSED
function mostlyHorizontalStroke(minSize=20, maxSize=160, angleAmount=0.05, wave=10/950 * width) {
  //let wave = 10/950 * width;
  let margin = width/8;

  let cx = fxrand() * (width-2*margin) + margin;
  let cy = fxrand() * (height-2*margin) + margin;
  let size = randfloat(minSize, maxSize);
  let angle = randfloat(-angleAmount, angleAmount) * 2 * PI;
  
  let x1 = clamp_point( cx + cos(angle) * size, width, margin);
  let y1 = clamp_point( cy + sin(angle) * size, height, margin);
  let x4 = clamp_point( cx - cos(angle) * size, width, margin);
  let y4 = clamp_point( cy - sin(angle) * size, height, margin);

  let c1 = offset2d(x1,y1,x4,y4, 0.4, randfloat(-wave,wave));
  let c2 = offset2d(x1,y1,x4,y4, 0.6, randfloat(-wave,wave));
  return [x1, y1, ...c1, ...c2, x4, y4];
}


// =====================================
// STROKES

function HorizontalStroke(q, qw, curved=true) {
  let wave = scaled(10);
  let margin = width/8;
  let x1 = qq(fxrand()*(width - 2*margin - qw) + margin, qw);
  let x2 = x1 + qw;
  let y1 = qq(fxrand()*(height - 2*margin - q) + margin, q);
  let y2 = y1 + q;
  let c1 = offset2d(x1,y1,x2,y2, 0.4, randfloat(-wave,wave));
  let c2 = offset2d(x1,y1,x2,y2, 0.6, randfloat(-wave,wave));
  if (curved) {
    c1[1] = y1;
    c2[1] = y2;
  }
  else {
    c1 = [lerp(x1,x2,0.4), lerp(y1,y2,0.4)];
    c2 = [lerp(x1,x2,0.6), lerp(y1,y2,0.6)];
  }
  return [x1, y1, ...c1, ...c2, x2, y2];
}

function SideSwipe(os) {
  let wave = scaled(10);
  let margin = width/8;
  let q = width / 256;
  let y1 = qq(fxrand() * (height - 2 * margin) + margin, q);
  let y2 = y1;
  let x1 = margin;

  let g = os.noise2D(NOISE_SCALE*(y1/height), DEFAULT_OFFSET);
  g = map(g, MIN_NOISE, MAX_NOISE, 0, 1);

  if (fxrand() < 0.25) {
    g = fxrand();
  }

  let x2 = fxrand() * (width - 3*margin)*g + 2 * margin;
  let f = dist(x1,y1,x2,y2) / (sqrt(2) * (width - 2 * margin));
  wave *= f;
  let c1 = offset2d(x1,y1,x2,y2, 0.4, randfloat(-wave,wave));
  let c2 = offset2d(x1,y1,x2,y2, 0.6, randfloat(-wave,wave));
  return [x1, y1, ...c1, ...c2, x2, y2];
}

function randomStroke(minLength, maxLength, minAngle, maxAngle, wave=(10/950)*width, margin=width/6) {
  let cx = fxrand() * (width-2*margin) + margin;
  let cy = fxrand() * (height-2*margin) + margin;
  let size = randfloat(minLength, maxLength);
  let angle = randfloat(minAngle, maxAngle) * 2 * PI;
  
  let x1 = cx + cos(angle) * size;
  let y1 = cy + sin(angle) * size;
  let x4 = cx - cos(angle) * size;
  let y4 = cy - sin(angle) * size;

  let c1 = offset2d(x1,y1,x4,y4, 0.4, randfloat(-wave,wave));
  let c2 = offset2d(x1,y1,x4,y4, 0.6, randfloat(-wave,wave));
  return [x1, y1, ...c1, ...c2, x4, y4];
}

function mostlyDiagonalStroke() {
  let wave = scaled(10);
  let margin = width/8;

  let cx = fxrand() * (width-2*margin) + margin;
  let cy = fxrand() * (height-2*margin) + margin;
  let size = randfloat(scaled(20), scaled(160));
  let angle = randfloat(-0.01, 0.01) * 2 * PI + 0.25 * PI;
  
  let x1 = clamp_point( cx + cos(angle) * size, width, margin);
  let y1 = clamp_point( cy + sin(angle) * size, height, margin);
  let x4 = clamp_point( cx - cos(angle) * size, width, margin);
  let y4 = clamp_point( cy - sin(angle) * size, height, margin);

  let c1 = offset2d(x1,y1,x4,y4, 0.4, randfloat(-wave,wave));
  let c2 = offset2d(x1,y1,x4,y4, 0.6, randfloat(-wave,wave));
  return [x1, y1, ...c1, ...c2, x4, y4];
}


// ===========================
// main painting functions

function bezierLength(x1, y1, x2, y2, x3, y3, x4, y4, res) {
  let length = 0;
  for (let i=1; i<=res; i++) {
    length += dist(
      bezierPoint(x1,x2,x3,x4,(i-1)/res),
      bezierPoint(y1,y2,y3,y4,(i-1)/res),
      bezierPoint(x1,x2,x3,x4,i/res),
      bezierPoint(y1,y2,y3,y4,i/res)
    );
  }
  return length;
}

function bezierPointSpread(x1, y1, x2, y2, x3, y3, x4, y4, t, m) {
  let x = bezierPoint(x1, x2, x3, x4, t);
  let y = bezierPoint(y1, y2, y3, y4, t);
  let tx = bezierTangent(x1, x2, x3, x4, t);
  let ty = bezierTangent(y1, y2, y3, y4, t);
  let angle = atan2(ty, tx) + HALF_PI;
  return [x + cos(angle)*m, y + sin(angle)*m];
}

function bezierStrokeSpread(x1, y1, x2, y2, x3, y3, x4, y4, dim, m, s, e, spread) {

  // left spread
  // right spread
  // edge percentage

  if (fxrand() < 0.5) {
    if (fxrand() < 0.5) {
      s = randfloat(-spread,spread);
    }
    else {
      e = 1 + randfloat(-spread,spread);
    }
  }

  let pr = null;
  let n = ceil(abs(e-s) * dim);
  for (let i=0; i<=n; i++) {
    let t = lerp(s,e,i/n);
    let p = bezierPointSpread(
      x1, y1, x2, y2, x3, y3, x4, y4, t, m);
    if (pr != null) {
      if ((!HARD_CLIP) || (inBounds(...pr) && inBounds(...p))) {
        line(...pr, ...p);
      }
    }
    pr = p;
  }
}

function bezierStroke(x1, y1, x2, y2, x3, y3, x4, y4, palette, density, sizeDist, spreadAmount=2) {
  noFill();

  color = (typeof palette !== 'undefined') ? palette[randint(0,palette.length)] : colors[randint(0,colors.length)];
  density = (typeof density !== 'undefined') ? density : randfloat(0.025, 0.05);

  let cc = 15;
  let size = sizeDist(); 
  let n = size / scaled(density);

  //let size = fxrand(5,20);
  //let size = fxrand(10,60);
  //getWeightedOption([[5,80],[30,20]]);
  //let size = getWeightedOption([[60,1]]);
  //let size = fxrand(5,20);  

  // determine what percentage of curve should be the edge
  let curveLength = bezierLength(x1, y1, x2, y2, x3, y3, x4, y4, 50);
  let spread = ((width/1000)*spreadAmount) / curveLength;

  for (let i=0; i<n; i++) {
    strokeWeight(scaled(0.95)); //fxrand()+0.5);
    stroke(
      color[0] + randfloat(-cc,cc) * 0.1,
      color[1] + randfloat(-cc,cc) * 0.1, 
      color[2] + randfloat(-cc,cc) * 0.5,
      fxrand() * 64 + 64);
    bezierStrokeSpread(
      x1, y1, x2, y2, x3, y3, x4, y4, 20, randfloat(-size,size), fxrand(), fxrand(), spread);
  } 
}

// =============================================

function keyPressed() {
  if (keyCode == 80) {
    SAVE_PNG = true;
    resizeCanvas(6000,6000);
  }
}

/*
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(fxrand() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}
*/

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(fxrand() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function cloneArray(arr) {
  return arr.map(a => {return {...a}});
}

function scaled(x) {
  return (x / 950) * width;
}

function randitem(lst) {
  return lst[randint(0,lst.length)];
}

function randfloat(min,max) {
  return fxrand() * (max - min) + min;
}

function randint(min,max) {
  return Math.floor(min + ((max-0.00001) - min) * fxrand());
}

const pick = (arr) => arr[(fxrand() * arr.length) | 0];
function getWeightedOption(options) {
  let choices = [];
  for (let i in options)
    choices = choices.concat(new Array(options[i][1]).fill(options[i][0]));
  return pick(choices);
};

function qq(x,q) {
  return round(x/q) * q;
}