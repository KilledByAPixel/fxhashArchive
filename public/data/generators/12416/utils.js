// Author: Nathaniel Sarkissian
// Date: May 4, 2022
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

function offsetNoise(x, y, z) {
  return noise(x, y, z);
}

function offsetSimplexNoise(x, nx, ox, y, ny, oy) {
  return sNoise.noise2D(x * nx + ox + noiseOffX * nx, y * ny + oy + noiseOffY * ny);
}


function offsetSimplexNoiseAngle(x, nx, ox, y, ny, oy, angle) {
  let v = createVector(
    x + noiseOffX,
    y + noiseOffY
  );
  v.rotate(angle);
  v.x *= nx;
  v.y *= ny;
  v.x += ox;
  v.y += oy;
  return sNoise.noise2D(v.x, v.y);
}


function percBr(col) {
  return (
    pow(red(col), 2) * 0.2126 +
    pow(green(col), 2) * 0.7152 +
    pow(blue(col), 2) * 0.0722
  );
}

function smin(a, b, k) {
  let _a = pow(a, k);
  let _b = pow(b, k);
  return pow((_a * _b) / (_a + _b), 1.0 / k);
}

function smax(a, b, k) {
  return smin(a, b, -k);
}

function smax2(a, b, k) {
  return log(exp(a * k) + exp(b * k)) / k;
}

function smin2(a, b, k) {
  return -log(exp(-a * k) + exp(-b * k)) / k;
}

function avg(a, b) {
  return (a + b) / 2;
}

function sigmoid(x, steepness) {
  return 1 / (1 + pow(2.71828, -steepness * x));
}

function blurMap(map, it, strength) {
  let i, j, k, sum, count;
  for (k = 0; k < it; k++) {
    for (i = 0; i < map.length; i++) {
      for (j = 0; j < map[0].length; j++) {
        sum = 0;
        count = 0;

        if (i > 0) {
          count++;
          sum += map[i - 1][j];
          if (j > 0) {
            count++;
            sum += map[i - 1][j - 1];
          }
          if (j < map[0].length - 1) {
            count++;
            sum += map[i - 1][j + 1];
          }
        }
        if (i < map.length - 1) {
          count++;
          sum += map[i + 1][j];
          if (j > 0) {
            count++;
            sum += map[i + 1][j - 1];
          }
          if (j < map[0].length - 1) {
            count++;
            sum += map[i + 1][j + 1];
          }
        }
        sum += map[i][j];
        count++;

        map[i][j] = lerp(map[i][j], sum / count, strength);
      }
    }
  }
}

function offsetPow(x, p, offset) {
  return pow(x * (1 - offset) + offset, p);
}

function angBetween(a, b) {
  let dot = a.x * b.x + a.y * b.y;
  let angle = acos(dot);
  let crossZ = a.x * b.y - a.y * b.x;
  if (-crossZ < 0) {
    angle = -angle;
  }
  if (isNaN(angle)) {
    return 0;
  }
  return angle;
}

function sign(p1, p2, p3) {
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

function pointInTriangle(pt, v1, v2, v3) {
  let d1, d2, d3;
  let has_neg, has_pos;

  d1 = sign(pt, v1, v2);
  d2 = sign(pt, v2, v3);
  d3 = sign(pt, v3, v1);

  has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

  return !(has_neg && has_pos);
}

// function mouseClicked() {
//   eroding = true;
// }

// function keyReleased() {
//   if (key == 'b') {
//     blurMap(hMap, 1, 0.1);
//     updateHMapTex();
//   } else if (key == 'l') {
//     let h1 = (hue(highlightCol) + 20) % 360;
//     let h2 = (h1 + 180) % 360;
//     colorMode(HSB, 360, 100, 100);
//     highlightCol = color(h1, 100, 100);
//     shadowCol = color(h2, 100, 100);
//     if (percBr(highlightCol) < percBr(shadowCol)) {
//       shadowCol = highlightCol;
//       highlightCol = color(h2, 100, 100);
//     }
//     colorMode(RGB, 255);
//   } else if (key == 'k') {
//     highlightCol = color(255);
//     shadowCol = color(0);
//   } else if (key == 's') {
//     lighting = !lighting;
//   }
// }

function updateHMapTex() {
  let c = 65536; //256 * 256;
  let b = 256;
  let a = 1;

  let maxHeight = 16777215; //256 * 256 * 255 + 256 * 255 + 255;
  colorMapTex.loadPixels();
  hMapTex.loadPixels();
  frameImg.loadPixels();
  for (let i = 0; i < hResX; i++) {
    for (let j = 0; j < hResY; j++) {
      let pixInd = (floor(i) + floor(j) * hResX) * 4;
      let _ht = h(i, j);
      let ht = floor(map(_ht, 0, 40, 0, maxHeight));
      let temp = ht;

      let d3 = 0;
      while (temp >= 0) {
        d3++;
        temp -= c;
      }
      d3--;
      temp += c;

      let d2 = 0;
      while (temp >= 0) {
        d2++;
        temp -= b;
      }
      d2--;
      temp += b;

      let d1 = 0;
      while (temp >= 0) {
        d1++;
        temp -= a;
      }
      d1--;


      hMapTex.pixels[pixInd + 0] = d3;
      hMapTex.pixels[pixInd + 1] = d2;
      hMapTex.pixels[pixInd + 2] = d1;

      let colInd = (i + j * hResX) * 3;

      colorMapTex.pixels[pixInd + 0] = colorMap[colInd];
      colorMapTex.pixels[pixInd + 1] = colorMap[colInd + 1];
      colorMapTex.pixels[pixInd + 2] = colorMap[colInd + 2];

      let n = norm(sNoise.noise2D(i * noiseScale, j * noiseScale), -1, 1);
      frameImg.pixels[pixInd + 0] = n * 255;
      frameImg.pixels[pixInd + 1] = n * 255;
      frameImg.pixels[pixInd + 2] = n * 255;
    }
  }
  frameImg.updatePixels();
  hMapTex.updatePixels();
  colorMapTex.updatePixels();
}

function handleUrlParams() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let validScale = false;
  let validMode = false;

  const scaleModeParam = urlParams.get('scaleMode')
  if (scaleModeParam == null) {
    print("no scale mode specified, setting scale mode to Discover");
    scaleMode = "discover";
  } else {
    print("Scale Mode:", scaleModeParam);
    if (scaleModeParam == "discover") {
      scaleMode = "discover";
      validMode = true;
    } else if (scaleModeParam == "scale") {
      scaleMode = "scale";
      validMode = true;
    } else {
      print("invalid scale mode, setting scale mode to Discover");
      scaleMode = "discover";
    }
  }

  const scaleParam = urlParams.get('scale')
  if (scaleParam == null) {
    print("no scale specified, setting scale to 1");
    windowScale = 1;
  } else {
    print("Scale:", scaleParam);
    if (float(scaleParam) > 0) {
      windowScale = max(float(scaleParam), 0.5);
      validScale = true;
    } else {
      print("invalid scale, setting scale mode to 1.0");
      windowScale = 1;
    }
  }

  if (validScale && !validMode) {
    print("Scale set, but not mode. Defaulting to Scale mode");
    scaleMode = "scale";
  }

  const sunAngleParam = urlParams.get('sunAngle')
  if (sunAngleParam == null) {
    print("no sun angle, setting sun angle to random number");
    currentAngle = -1;
  } else {
    print("Sun Angle:", sunAngleParam);
    if (float(sunAngleParam) >= 0) {
      currentAngle = radians(constrain(float(sunAngleParam), 0, 360));
    } else {
      print("invalid sun angle, setting sun angle to random number");
      currentAngle = -1;
    }
  }

  const sunHeightParam = urlParams.get('sunHeight')
  if (sunHeightParam == null) {
    print("no sun height, setting sun height to random number");
    lightHeightAngle = -1;
  } else {
    print("Sun Height:", sunHeightParam);
    if (float(sunHeightParam) >= 0 && float(sunHeightParam) <= 100) {
      let hPercent = constrain(float(sunHeightParam), 0, 100);
      lightHeightAngle = map(hPercent, 0, 100, minSunH, maxSunH);
    } else {
      print("invalid sun height, setting sun height to random number");
      lightHeightAngle = -1;
    }
  }
}

function resetfxHash() {
  fxhash = "oo" + Array(49).fill(0).map(_=>alphabet[(Math.random()*alphabet.length)|0]).join('');
  b58dec = str=>[...str].reduce((p,c)=>p*alphabet.length+alphabet.indexOf(c)|0, 0)
  fxhashTrunc = fxhash.slice(2)
  regex = new RegExp(".{" + ((fxhashTrunc.length/4)|0) + "}", 'g')
  hashes = fxhashTrunc.match(regex).map(h => b58dec(h))
  sfc32 = (a, b, c, d) => {
    return () => {
      a |= 0; b |= 0; c |= 0; d |= 0
      var t = (a + b | 0) + d | 0
      d = d + 1 | 0
      a = b ^ b >>> 9
      b = c + (c << 3) | 0
      c = c << 21 | c >>> 11
      c = c + t | 0
      return (t >>> 0) / 4294967296
    }
  }
  fxrand = sfc32(...hashes)
}

function setupThings() {
  // rSeed = floor(fxrand() * 1000000000);
  // nSeed = floor(fxrand() * 1000000000);

  // rSeed = 932408047;
  // nSeed = 503225154;

  print("random seed, noise seed:");
  print(rSeed, nSeed);
  randomSeed(rSeed);
  noiseSeed(nSeed);

  print("fxHash:", fxhash);

  noiseScale = 0.007;

  if (currentAngle == -1) {
    currentAngle = random(TAU);
  } else {
    random(1);
  }
  lightAngle = random(TAU) + PI / 2;
  cs = cos(lightAngle);
  sn = sin(lightAngle);

  if (lightHeightAngle == -1) {
    lightHeightAngle = random(minSunH, maxSunH);
  } else {
    random(1);
  }

  sunX = width + 5000;
  sunH = random(200, 300) + 400;
  sun = createVector(-sunX, 0);
  sun.rotate(lightAngle);
  sun.normalize();
  sun.mult(100);
  sun.z = 0;

  aoMax = 3000;

  print("sunH", sunH);
  print("sunAngle", degrees(currentAngle));
  print("sunHeight", degrees(lightHeightAngle), lightHeightAngle);
  print("minSunH", degrees(minSunH));
  print("maxSunH", degrees(maxSunH));
  print("aoMax", aoMax);

  let h1 = random(180, 240) % 360;
  let h2 = (h1 + 180) % 360;
  let sat = random(50, 100);
  let br = random(70, 100);
  colorMode(HSB, 360, 100, 100);
  highlightCol = color(h1, sat, br);
  shadowCol = color(h2, sat, br);
  if (percBr(highlightCol) < percBr(shadowCol)) {
    shadowCol = highlightCol;
    highlightCol = color(h2, sat, br);
  }
  print("highight hue", hue(highlightCol));
  print("shadow hue", hue(shadowCol));
  colorMode(RGB, 255);
  lighting = true;

  frame = random(1) < 0.5;

  sNoise = openSimplexNoise(random(42));

  if (random(100) < 10) {
    pyramidsOn = true;
  } else {
    pyramidsOn = false;
  }


  hMapTex.background(0);
  colorMapTex.background(0);
  frameImg.background(0);
  finalImg.background(0);

  minH = 100;
  maxH = -100;

  craterMin = 100;
  craterMax = -100;

  bigCratorProb = 1.7;

  prepHeightMap();
  updateHMapTex();

  settingUp = true;
  erodeCount = 500000 * windowAreaM;
  erodeTotal = erodeCount;
  eroding = !true;

  framesSinceDoneEroding = 0;
}