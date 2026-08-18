// Author: Nathaniel Sarkissian
// Date: February 26, 2022
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

let sc = 1;

let n = [];
let noiseScale,
  baseNoiseScale = 0.01;
let bN = [];
let fN = [];
let sNoise;
let blade;
let amp = 100,
  baseAmp = 100;
let startYOffset = 220;
let x = 0;
let y = -startYOffset; //-amp * 2; // * 2;
let z = 0;
let rowH = 2 / sc;
let xRes = 1;
let xOffset;
let noiseOffset;
let lightAngle;
let shadowDarkness;
let oakThresh;
let flowerThresh;
let thistleThresh, mustardThresh;
let baseFlowerType;

let c1, c2, c3, c4, shadowCol;
let o1, o2, o3, o4, oakShadowCol;
let flowerCols = [];
let flowerShadowCols = [];
let superBloomBase = -1;

let fencePosts = [];
let fenceStart, fenceEnd;

let baseW = 1000;
let baseH = 1000;

let hiResBuffer,
  hiResSc = 2,
  drawHiRes = !true;

function setup() {
  let nSeed = floor(fxrand() * 10000);
  let rSeed = floor(fxrand() * 10000);

  // nSeed = 1399;
  // rSeed = 2955; // bnw

  // nSeed = 7058;
  // rSeed = 4385; // bnw

  // nSeed = 7088;
  // rSeed = 610; // bnw

  // nSeed = 2672;
  // rSeed = 8263; // mustard super bloom

  // nSeed = 6322;
  // rSeed = 4245; // mustard super bloom

  // nSeed = 8543;
  // rSeed = 4461; // nice spring, some flowers

  // nSeed = 645;
  // rSeed = 1440; // nice summer

  // nSeed = 4854;
  // rSeed = 1623;

  // nSeed = 5708;
  // rSeed = 4287;
  //

  noiseSeed(nSeed);
  randomSeed(rSeed);

  print(nSeed, rSeed);

  createCanvas(min(3200, windowWidth) * sc, min(1600, windowHeight) * sc);
  // createCanvas(
  //   min(min(3200, windowWidth) * sc, min(1600, windowHeight) * sc),
  //   min(min(3200, windowWidth) * sc, min(1600, windowHeight) * sc)
  // );
  background(189, 238, 255);
  pixelDensity(1);

  hiResBuffer = createGraphics(width * hiResSc, height * hiResSc);
  hiResBuffer.background(189, 238, 255);

  colorMode(RGB, 255, 255, 255, 255);

  blade = createVector();
  xOffset = random(-baseW * 0.7, baseW * 0.7); //width / 2;
  let yScale = map(abs(xOffset), 0, baseW * 2, 1, 1.3);
  // lightAngle = random(PI, TWO_PI);
  lightAngle = random(PI + PI / 6, TWO_PI - PI / 6);
  lightW = 1;
  lightH = 1;
  noiseOffset = createVector(random(-1000, 1000), random(-1000, 1000));
  let r = floor(random(3));
  if (r == 0) {
    colorScheme = "summer";
  } else if (r == 1) {
    colorScheme = "spring";
  } else {
    colorScheme = "bnw";
  }

  sNoise = openSimplexNoise(random(42));

  if (colorScheme == "summer") {
    c1 = color(38, 30, 28);
    c2 = color(196, 120, 0);
    c3 = color(224, 211, 108);
    c4 = color(255, 243, 153);
    shadowCol = color(10, 2, 0);
    o1 = color(35, 38, 31);
    o2 = color(42, 46, 34);
    o3 = color(48, 54, 40);
    o4 = color(255 * 0.7, 244 * 0.7, 140 * 0.7);
    oakShadowCol = color(1, 15, 2);
    shadowDarkness = 0.12;
    oakThresh = random(0.35, 0.4) + 0.01;
    flowerThresh = 1;
  } else if (colorScheme == "bnw") {
    c1 = color(0);
    c2 = color(64);
    c3 = color(128);
    c4 = color(255);
    shadowCol = color(0);
    o1 = color(0);
    o2 = color(16);
    o3 = color(32);
    o4 = color(230);
    oakShadowCol = color(0);
    shadowDarkness = 0.15;
    oakThresh = random(0.35, 0.4);
    if (random(1) < 0.2) {
      oakThresh += 0.1;
    } else {
      oakThresh += 0.01;
    }
    flowerThresh = 1;
  } else if (colorScheme == "spring") {
    // 84, 113, 15;
    c1 = color(23, 12, 3);
    c2 = color(88, 107, 42);
    c3 = color(162, 189, 83);
    c4 = color(250, 255, 184);
    shadowCol = color(0);
    o1 = color(35 * 0.5, 38 * 0.5, 31 * 0.5);
    o2 = color(42 * 1, 46 * 1, 34 * 1);
    o3 = color(48, 54, 40);
    o4 = color(178, 170, 98);
    oakShadowCol = color(10 * 0.5, 18 * 0.5, 1 * 0.5);
    shadowDarkness = 0.1;
    if (random(1) < 10.5) {
      oakThresh = random(0.32, 0.35);
    } else {
      oakThresh = 0.001;
    }
    baseFlowerType = random(1) < 0.5 ? 1 : 2;
    let r = random(1);
    if (r < 0.1) {
      // lots of flowers
      // print("lots");
      superBloomBase = random(1) < 0.5 ? 1 : 2;
      flowerThresh = 0.35; //random(0.35, 0.54);
      thistleThresh = random(0.75, 1);
      mustardThresh = random(0.3, 1);
    } else if (r < 0.94) {
      // less flowers
      // print("less");
      flowerThresh = random(0.54, 0.6);
      thistleThresh = random(0.65, 1);
      mustardThresh = random(0.3, 1);
    } else {
      // mostly grass
      // print("grass");
      flowerThresh = random(0.8, 0.85);
      thistleThresh = random(0.65, 1);
      mustardThresh = random(0.3, 1);
    }
    flowerCols.push(color(101, 22, 171)); // thistle
    flowerShadowCols.push(color(27, 0, 51));
    flowerCols.push(color(230, 70, 0)); // poppy
    flowerShadowCols.push(color(50, 0, 0));
    flowerCols.push(color(255, 220, 105)); // mustard
    flowerShadowCols.push(color(107, 54, 0));
  }

  amp = 100;
  let iStart = -amp * 1;
  let iEnd = width / sc + amp * 2;
  let jStart = -amp * 3;
  let jEnd = height / sc + amp * 2;
  for (let i = iStart; i < iEnd; i++) {
    let row = [];
    for (let j = jStart; j < jEnd; j++) {
      let di = pow(1 / map(j, -amp * 3, baseH, 1, 1.9) + 0.1, 4);
      noiseScale = baseNoiseScale;

      let n1 = norm(
        sNoise.noise2D(
          (xOffset - i) * noiseScale * di * 0.5,
          j * noiseScale * di * yScale
        ),
        -1,
        1
      );
      let n2 = noise(
        (xOffset - i) * noiseScale * 0.5 * 10,
        j * noiseScale * 10 * yScale
      );
      let n3 = noise(
        (xOffset - i) * noiseScale * 0.5 * 20,
        j * noiseScale * 20 * yScale
      );

      let n2Factor = 0.035;
      row.push(n1 * (0.99 - n2Factor) + n2 * n2Factor + n3 * 0.01);
    }
    n.push(row);
  }

  for (let i = 0; i < width / sc + 200; i++) {
    let row = [];
    let row2 = [];
    let z = 0;
    for (let j = 0; j < height / sc + 300; j++) {
      let di = pow(1 / map(j, -amp * 3, baseH, 1, 2) + 0.1, 4);
      let n1 = noise(
        i * noiseScale * 1 * 0.8 * 0.5 + noiseOffset.x,
        j * noiseScale * 0.8 * 0.8 + noiseOffset.y,
        z * 0.005
      );
      let n2 = noise(
        i * noiseScale * 1 * 0.5 * 4 * 0.8 + noiseOffset.x,
        j * noiseScale * 0.8 * 4 * 0.8 + noiseOffset.y,
        z * 0.005
      );
      row.push(n1 * 0.8 + n2 * 0.2);

      let fNoise = noise(
        i * noiseScale * 0.5 * 0.5 + noiseOffset.x + 5,
        j * noiseScale * 0.5 + noiseOffset.y + 5,
        z * 0.01
      );

      row2.push(fNoise);
      z++;
    }
    bN.push(row);
    fN.push(row2);
  }
  blurMap(bN, 4);
  blurMap(fN, 4);
}

function mouseClicked() {
  if (drawHiRes) {
    saveCanvas(hiResBuffer, "hires", "png");
  }
}

function draw() {
  scale(sc, sc);
  if (drawHiRes) {
    hiResBuffer.push();
    hiResBuffer.scale(sc * hiResSc, sc * hiResSc);
  }
  let di = pow(1 / map(y, -amp * 3, baseH, 1, 2) + 0.1, 4);
  amp = min(300 * di, 250);
  noiseScale = baseNoiseScale;

  let a;
  let b = h(x, y);
  let c = h(x, y + rowH),
    d;

  // print("draw", y);
  x++;
  for (x = -30 + 1; x < width / sc + 30; x++) {
    let nx = x;
    let gy = y + random(rowH);
    a = b;
    b = h(x, gy);
    d = c;
    c = h(x, gy + rowH);

    let slope = h(x + 1, gy) - h(x, gy);

    let lineC = 255 * slope;
    let shadow = 1;

    let bio = biome(nx, gy, slope);
    let bn = biomeNoise(nx, gy);

    let nRayTraceSteps = 20;
    for (let k = 1; k < nRayTraceSteps; k++) {
      let km = map(k, 0, nRayTraceSteps, 0, 1);
      let b2 = h(
        x + km * 10 * lightW * cos(lightAngle),
        gy + km * 10 * lightH * sin(lightAngle)
      );
      let castX = nx + km * 5 * lightW * cos(lightAngle);
      let castY = gy + km * 5 * lightH * sin(lightAngle);
      bn2 = biomeNoise(castX, castY);
      if (b > b2) {
        // shadow = pow(map(b - b2, 0, 1, 1, 0), 4);
        // break;
        shadow = map(b - b2, 0, 2, 1, 0);
      } else if (
        bio == "grass" &&
        biome(
          nx + km * 20 * (1 - abs(slope)) * lightW * cos(lightAngle),
          gy + km * 20 * (1 - abs(slope)) * lightH * sin(lightAngle),
          slope
        ) == "oak"
      ) {
        shadow *= map(k, 0, nRayTraceSteps, 0.25, 0.5);
        break;
      } else if (
        bio == "grass" &&
        biome(
          nx + km * 10 * (1 - abs(slope)) * lightW * cos(lightAngle),
          gy + km * 10 * (1 - abs(slope)) * lightH * sin(lightAngle),
          slope
        ) == "flower"
      ) {
        // shadow = map(k, 0, nRayTraceSteps, 0.8, 1);
        // shadow = 0;
        // break;
      } else if (
        bio == "oak" &&
        biome(castX, castY, slope) == "oak" &&
        bn2 < bn
      ) {
        shadow = map(k, 0, nRayTraceSteps, 0, 1);
        break;
      } else if (
        bio == "flower" &&
        biome(
          nx + km * 20 * (1 - abs(slope)) * lightW * cos(lightAngle),
          gy + km * 20 * (1 - abs(slope)) * lightH * sin(lightAngle),
          slope
        ) == "oak"
      ) {
        shadow *= map(k, 0, nRayTraceSteps, 0.25, 0.5);
        break;
      }
    }
    shadow = constrain(shadow, shadowDarkness, 1);

    let slopeColor;
    let slopeM = map(slope, -1, 1, 0, 1);
    strokeWeight(2);
    slopeColor = color(
      lerp(red(c2), red(c3), slopeM),
      lerp(green(c2), green(c3), slopeM),
      lerp(blue(c2), blue(c3), slopeM)
    );
    stroke(grassColor(slopeM, 1 - shadow));
    fill(grassColor(slopeM, 1 - shadow));
    if (drawHiRes) {
      hiResBuffer.stroke(grassColor(slopeM, 1 - shadow));
      hiResBuffer.fill(grassColor(slopeM, 1 - shadow));
    }
    // stroke(slopeM * 255);
    // fill(slopeM * 255);
    beginShape();
    vertex(x - xRes, gy + a);
    vertex(x, gy + b);
    vertex(x, gy + c + rowH);
    vertex(x - xRes, gy + d + rowH);
    endShape(CLOSE);
    if (drawHiRes) {
      hiResBuffer.beginShape();
      hiResBuffer.vertex(x - xRes, gy + a);
      hiResBuffer.vertex(x, gy + b);
      hiResBuffer.vertex(x, gy + c + rowH);
      hiResBuffer.vertex(x - xRes, gy + d + rowH);
      hiResBuffer.endShape(CLOSE);
    }

    let angleNoise = sNoise.noise2D(
      nx * noiseScale * 2 * di,
      gy * noiseScale * 4 * di,
      z * 0.01
    );

    let grassNoise = biomeNoise(nx, gy);

    let lengthNoise =
      noise(
        nx * noiseScale * 0.5 * 2 + noiseOffset.x,
        gy * noiseScale * 2 + noiseOffset.y,
        z * 0.01
      ) *
        0.9 +
      0.1;

    if (bio == "grass") {
      let densityNoise =
        noise(nx * noiseScale * 0.5, gy * noiseScale) * 0.2 + 0.8;

      if (random(1) < densityNoise * 1.6 * di) {
        blade.set(0, -1);
        blade.mult(pow(lengthNoise + 0.1, 3) + random(1) * 0.2);
        blade.mult(100);
        blade.mult(z * 0.0005 + 0.3005);
        blade.rotate((angleNoise * PI) / 4);
        strokeWeight(1);
        push();
        translate(x, gy + b);
        if (drawHiRes) {
          hiResBuffer.strokeWeight(1);
          hiResBuffer.push();
          hiResBuffer.translate(x, gy + b);
        }
        let nSegs = 10;
        for (let ln = 0; ln < nSegs; ln++) {
          let x1 = map(ln, 0, nSegs, 0, blade.x);
          let y1 = map(ln, 0, nSegs, 0, blade.y);
          let x2 = map(ln + 1, 0, nSegs, 0, blade.x);
          let y2 = map(ln + 1, 0, nSegs, 0, blade.y);
          stroke(grassColor(map(ln, 0, nSegs - 1, 0, 1), 1 - shadow));
          line(x1, y1, x2, y2);
          if (drawHiRes) {
            hiResBuffer.stroke(
              grassColor(map(ln, 0, nSegs - 1, 0, 1), 1 - shadow)
            );
            hiResBuffer.line(x1, y1, x2, y2);
          }
        }
        if (drawHiRes) {
          hiResBuffer.pop();
        }
        pop();
      }
    }
    if (bio == "oak") {
      if (random(1) < 1) {
        //1.6 * di) {
        let oakNoise =
          (noise(nx * noiseScale * 0.5 * 2, gy * noiseScale * 2, z * 0.01) *
            0.8 +
            noise(
              nx * noiseScale * 0.5 * 4,
              gy * noiseScale * 4,
              z * 0.01 * 4
            ) *
              0.2) *
            0.3 +
          1;
        blade.set(0, -1);
        blade.mult(random(0.5, 2));
        blade.mult(oakNoise);
        blade.mult(100);
        // blade.mult(sin(map(grassNoise, 0, oakThresh, 0, PI)) * 0.5 + 0.5);
        blade.mult(
          map(grassNoise, 0, oakThresh, 2, 1) * pow(lengthNoise + 0.1, 2)
        );
        blade.mult(z * 0.00025 + 0.3005 * 1.2);
        // blade.mult(z * 0.001 + 0.3);
        // blade.rotate((random(-1, 1) * PI) / 6);
        blade.rotate(
          (PI / 16) * map(grassNoise, 0, oakThresh, 1, 2) * random(-1, 1)
        );
        strokeWeight(1);
        push();
        translate(x, gy + b);
        if (drawHiRes) {
          hiResBuffer.strokeWeight(1);
          hiResBuffer.push();
          hiResBuffer.translate(x, gy + b);
        }
        let nSegs = round(blade.mag() / 2);
        for (let ln = 0; ln <= nSegs; ln++) {
          let x1 = map(ln, 0, nSegs, 0, blade.x);
          let y1 = map(ln, 0, nSegs, 0, blade.y);
          let x2 = map(ln + 1, 0, nSegs, 0, blade.x);
          let y2 = map(ln + 1, 0, nSegs, 0, blade.y);
          noStroke();
          fill(
            oakColor(map(ln, 0, nSegs, 0, 1) + random(-1, 1) * 0.1, 1 - shadow)
          );
          if (drawHiRes) {
            hiResBuffer.noStroke();
            hiResBuffer.fill(
              oakColor(
                map(ln, 0, nSegs, 0, 1) + random(-1, 1) * 0.1,
                1 - shadow
              )
            );
          }
          let circleOffset = createVector(
            (nSegs / 5) * map(ln, 0, nSegs, 1, 0.5),
            0
          );
          circleOffset.rotate(random(TWO_PI));
          circle(
            x1 + circleOffset.x,
            y1 + circleOffset.y,
            random(2, 3) + z * 0.001
          );
          if (drawHiRes) {
            hiResBuffer.circle(
              x1 + circleOffset.x,
              y1 + circleOffset.y,
              random(2, 3) + z * 0.001
            );
          }
        }
        if (drawHiRes) {
          hiResBuffer.pop();
        }
        pop();
      }
    } else if (bio == "flower") {
      let densityNoise =
        noise(nx * noiseScale * 0.5, gy * noiseScale) * 0.2 + 0.8;

      if (random(1) < densityNoise * 1.6 * di) {
        let ind = flowerTypeNoise(x, gy);
        let fNoise = flowerNoise(x, y);
        blade.set(0, -1);
        blade.mult(pow(lengthNoise + 0.1, 3) + random(1) * 0.1);
        blade.mult(100 + random(5));
        blade.mult(random(1, 1.1));
        blade.mult(z * 0.0005 + 0.3005);
        blade.mult(
          pow(sin(map(fNoise, flowerThresh, 1, 0, PI)) * 0.2 + 1, 1.5)
          // pow(sin(map(grassNoise, flowerThresh, 1, 0, PI)) * 0.2 + 1, 1.5)
        );
        if (ind == 0 || ind == 2) {
          blade.mult(1.1);
        }
        blade.rotate((angleNoise * PI) / 4);
        strokeWeight(1);
        push();
        translate(x, gy + b);
        if (drawHiRes) {
          hiResBuffer.strokeWeight(1);
          hiResBuffer.push();
          hiResBuffer.translate(x, gy + b);
        }
        let nSegs = 10;
        for (let ln = 0; ln < nSegs; ln++) {
          let x1 = map(ln, 0, nSegs, 0, blade.x);
          let y1 = map(ln, 0, nSegs, 0, blade.y);
          let x2 = map(ln + 1, 0, nSegs, 0, blade.x);
          let y2 = map(ln + 1, 0, nSegs, 0, blade.y);
          stroke(grassColor(map(ln, 0, nSegs - 1, 0, 1), 1 - shadow));
          line(x1, y1, x2, y2);
          if (drawHiRes) {
            hiResBuffer.stroke(
              grassColor(map(ln, 0, nSegs - 1, 0, 1), 1 - shadow)
            );
            hiResBuffer.line(x1, y1, x2, y2);
          }
        }
        if (random(1) < map(fNoise, flowerThresh, 1, 0, 4)) {
          fill(flowerColor(ind, lerp(shadow, 1, 0.2)));
          noStroke();
          circle(blade.x, blade.y, random(2, 4) * 0.9 * (z * 0.0005 + 1));
          if (drawHiRes) {
            hiResBuffer.fill(flowerColor(ind, lerp(shadow, 1, 0.2)));
            hiResBuffer.noStroke();
            hiResBuffer.circle(
              blade.x,
              blade.y,
              random(2, 4) * 0.9 * (z * 0.0005 + 1)
            );
          }
        }
        if (drawHiRes) {
          hiResBuffer.pop();
        }
        pop();
      }
    }
  }

  if (drawHiRes) {
    hiResBuffer.pop();
  }

  y += max(0.3, map(y, 0, baseH, 2, 0.3)) / sc;
  z++;

  let frameWidth = 50;
  let frameColor = c2; //color(255);
  stroke(frameColor);
  fill(frameColor);
  strokeWeight(4);
  // rect(0, 0, frameWidth, height);
  // rect(width - frameWidth, 0, frameWidth, height);
  // rect(0, 0, width, frameWidth);
  // rect(0, height - frameWidth, width, frameWidth);

  if (y > (height + z / max(20, map(z, 0, 1600, 0, 30))) / sc) {
    //amp * max(1, map(height, 0, 1600, 0, 2))) / sc) {
    // for (let sy = 0; sy < height; sy++) {
    //   let di = pow(map(sy, 0, height, 1, 0), 2) * 3;
    //   amp = 60 * (di + 0.3);
    //   noiseScale = 0.005 * di;
    //   for (let sx = 0; sx < width; sx++) {
    //     let b1 = h(sx, sy);
    //     for (let k = 0; k < 10; k++) {
    //       let b2 = h(sx + k, sy - k);
    //       if (b1 > b2) {
    //         stroke(0);
    //         break;
    //       } else {
    //         stroke(255, 0, 0);
    //       }
    //     }
    //     point(sx, sy + b1);
    //   }
    // }
    print("done"); //, amp, y, z);
    // saveCanvas("grassy.png");
    noLoop();
  }
}

function flowerColor(i, br) {
  colorMode(HSL, 360, 100, 100);
  if (br > 0.5 && random(1) < br * 0.2) {
    return color(
      (hue(flowerCols[i]) + random(-1, 1) * 10) % 360,
      saturation(flowerCols[i]),
      constrain(lightness(flowerCols[i]) * 1.25, 0, 100)
    );
  }
  let c = color(
    (hue(flowerCols[i]) + random(-1, 1) * 10) % 360,
    saturation(flowerCols[i]),
    constrain(lightness(flowerCols[i]) + random(-1, 1) * 20, 0, 100)
  );
  let bri = constrain(br + random(1) * 0.1, 0, 1);
  colorMode(RGB, 255);
  return color(
    lerp(red(flowerShadowCols[i]), red(c), bri),
    lerp(green(flowerShadowCols[i]), green(c), bri),
    lerp(blue(flowerShadowCols[i]), blue(c), bri)
  );
}

function grassColor(i, br) {
  let t1 = 0.33;
  let t2 = 0.7;
  let c;
  colorMode(RGB, 255, 255, 255);
  if (i < t1) {
    c = color(
      lerp(map(i, 0, t1, red(c1), red(c2)), red(shadowCol), br),
      lerp(map(i, 0, t1, green(c1), green(c2)), green(shadowCol), br),
      lerp(map(i, 0, t1, blue(c1), blue(c2)), blue(shadowCol), br)
    );
  } else if (i < t2) {
    c = color(
      lerp(map(i, t1, t2, red(c2), red(c3)), red(shadowCol), br),
      lerp(map(i, t1, t2, green(c2), green(c3)), green(shadowCol), br),
      lerp(map(i, t1, t2, blue(c2), blue(c3)), blue(shadowCol), br)
    );
  } else {
    c = color(
      lerp(map(i, t2, 1, red(c3), red(c4)), red(shadowCol), br),
      lerp(map(i, t2, 1, green(c3), green(c4)), green(shadowCol), br),
      lerp(map(i, t2, 1, blue(c3), blue(c4)), blue(shadowCol), br)
    );
  }
  colorMode(HSL, 360, 100, 100, 100);
  c = color(
    (hue(c) + random(-1, 1) * 10) % 360,
    saturation(c),
    constrain(lightness(c) + random(-1, 1) * 10, 0, 255)
  );
  colorMode(RGB, 255, 255, 255, 255);
  return c;
}

function oakColor(i, br) {
  // if (br < 0.7 && random(1) < br * 0.1) {
  // return o4;
  // }
  let t1 = 0.43;
  let t2 = 0.8;
  if (i < t1) {
    return color(
      lerp(map(i, 0, t1, red(o1), red(o2)), red(oakShadowCol), br),
      lerp(map(i, 0, t1, green(o1), green(o2)), green(oakShadowCol), br),
      lerp(map(i, 0, t1, blue(o1), blue(o2)), blue(oakShadowCol), br)
    );
  } else if (i < t2) {
    return color(
      lerp(map(i, t1, t2, red(o2), red(o3)), red(oakShadowCol), br),
      lerp(map(i, t1, t2, green(o2), green(o3)), green(oakShadowCol), br),
      lerp(map(i, t1, t2, blue(o2), blue(o3)), blue(oakShadowCol), br)
    );
  } else {
    return color(
      lerp(map(i, t2, 1, red(o3), red(o4)), red(oakShadowCol), br),
      lerp(map(i, t2, 1, green(o3), green(o4)), green(oakShadowCol), br),
      lerp(map(i, t2, 1, blue(o3), blue(o4)), blue(oakShadowCol), br)
    );
  }
}

function h(x, y) {
  return n[floor(x + baseAmp)][floor(y + startYOffset)] * amp;
}

function flowerNoise(x, y) {
  let xi = x + 100;
  let yi = y + 199;
  if (xi >= 0 && xi < bN.length && yi >= 0 && yi < bN[0].length) {
    return fN[floor(xi)][floor(yi)];
  }
  return 0;
}

function biomeNoise(x, y) {
  let xi = x + 100;
  let yi = y + 199;
  if (xi >= 0 && xi < bN.length && yi >= 0 && yi < bN[0].length) {
    return bN[floor(xi)][floor(yi)];
  }
  return 0;
}

function biome(x, y, sl) {
  biomeN = biomeNoise(x, y);
  let fNoise = flowerNoise(x, y);
  if (biomeN > oakThresh) {
    // & abs(sl) < 0.5) {
    // if (biomeN > flowerThresh) {
    if (fNoise > flowerThresh) {
      return "flower";
    }
    return "grass";
  } else {
    return "oak";
  }
}

function flowerTypeNoise(x, y) {
  let fuzz = 0.12;
  let poppyNoise =
    noise(
      x * noiseScale * 0.5 * 3 + noiseOffset.x,
      y * noiseScale * 3 + noiseOffset.y,
      z * 0.01
    ) +
    random(-1, 1) * fuzz;

  let thistleNoise =
    noise(
      x * noiseScale * 0.5 * 3 + noiseOffset.x + 10,
      y * noiseScale * 3 + noiseOffset.y + 10,
      z * 0.01
    ) +
    random(-1, 1) * fuzz;

  let mustardNoise =
    noise(
      x * noiseScale * 0.5 * 2 + noiseOffset.x * 2,
      y * noiseScale * 2 + noiseOffset.y * 2,
      z * 0.01
    ) +
    random(-1, 1) * fuzz;

  let ind;

  if (thistleNoise > thistleThresh) {
    ind = 0;
  } else if (mustardNoise > mustardThresh) {
    if (superBloomBase != -1) {
      ind = superBloomBase;
    } else {
      ind = 1;
    }
  } else {
    if (superBloomBase != -1) {
      ind = superBloomBase == 1 ? 2 : 1;
    } else {
      ind = 2;
    }
  }

  // ind += random(-1, 1) * 0.0000000001;
  ind = constrain(floor(ind), 0, 2);

  return ind;
}
