// Author: Nathaniel Sarkissian
// Date: August 7, 2022
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

let saveMode = !true;
let saving = false;
let saveTime = 0;

let doDownload = false;

let drawArray = [];

let drawZ = 0;
let zAngle;
let divFactor;
let N, M;
let noiseScale;

let offsetType;
let iM, jM;
let hex;
let subdivDistribution;
let roofDistribution;
let htDistribution;
let roofSinePeriod;
let roofSineOffset;
let parabolaXHt;
let gradYDepth;
let gradXPow;
let htNoisePower;
let mainAngle;

let borderW = 15;

let lightDir;
let lightCol, midCol, darkCol, accentCol, strokeCol, speckleCol;
let colorR;
let shading, shadingGradient;
let speckledShading;


let canv;
let targetSz = 1000;
let screenAdj;

let mag = 1;
let renderSpeed = 0.005;

function setup() {
  print("fxhash:", fxhash);
  randomSeed(round(fxrand() * 1000000000));
  noiseSeed(round(fxrand() * 1000000000));

  handleUrlParams();

  createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight));
  background(0);

  screenAdj = width / targetSz;

  print(width, screenAdj);

  canv = createGraphics(width * mag, height * mag);
  print("canv size:", canv.width);


  let lightAngle = random(PI);
  lightDir = createVector(cos(lightAngle), 1, sin(lightAngle)).normalize();

  shading = random(["hard", "soft"]);
  shadingGradient = random(["flat", "noisy"]);
  speckledShading = false; //random(1) < 0.5;
  zAngle = random(0.2, 0.8); //0.7);
  offsetType = random([
    "noise","noise","noise","noise","noise","noise",
    "sine","sine","sine","sine","sine",
    "none"
  ]);
  iM = random(3);
  jM = random(3);
  hex = round(random(1));
  subdivDistribution = random([
    "height",
    "random",
    "none",
    "shading",
    "horizontal",
    "vertical",
  ]);
  roofDistribution = random([
    "skinny", "skinny",
    "wide", "wide",
    "noise",
  ]);
  htDistribution = random([
    "noise",
    "sine1",
    "sine2",
    "gradX1",
    "gradX2",
    "parabolaX",
    "parabolaY","parabolaY",
    "gradY"
  ]);

  divFactor = random(60, 300);

  if (htDistribution == "noise") {
    divFactor = constrain(divFactor, 30, 150); //90);
  } else if (htDistribution == "sine1" || htDistribution == "sine2") {
    divFactor = constrain(divFactor, 60, 300);
  }

  if (divFactor < 80) {
    roofDistribution = random([
      "skinny", "skinny",
      "wide", "wide",
    ]);
  }

  if (htDistribution == "sine1" || htDistribution == "sine2") {
    offsetType = random([
      "sine",
      "none"
    ]);
  }

  N = targetSz / divFactor;
  M = targetSz / divFactor / zAngle;
  noiseScale = 0.06;

  parabolaXHt = random(1.4, 1.6);
  gradYDepth = random(-1);
  gradXPow = floor(random(1, 4));
  htNoisePower = 3; //round(random(3));

  roofSinePeriod = random(0.8, 1);
  roofSineOffset = random(TAU);
  mainAngle = random(-1, 1) * PI / 8;

  if (divFactor > 200) {
    subdivDistribution = "shading";
    mainAngle = random(-1, 1) * PI / 16;
  }

  let vWidth = targetSz;
  let vHeight = 1.2 * targetSz / zAngle;

  pickPalette();
  canv.background(darkCol);

  let offsetNoiseScale = noiseScale * random(0.5, 0.8);
  let offsetNoiseStrength = random(50, 150);
  let offscreen = map(abs(mainAngle), 0, PI / 8, 0.2, 0.8)

  if (htDistribution == "parabolaX") {
    offsetNoiseStrength += 50;
  }

  print("subdivDistribution:", subdivDistribution);
  print("roofDistribution:", roofDistribution);
  print("htDistribution:", htDistribution);
  print("divFactor:", divFactor);
  print("palette index:", colorR);
  print("mainAngle:", degrees(mainAngle));
  print("offsetNoiseScale:", offsetNoiseScale);
  print("offsetNoiseStrength:", offsetNoiseStrength);
  print("offscreen:", offscreen);
  print("zAngle:", zAngle);
  print("gradYDepth:", gradYDepth);
  print("gradXPow:", gradXPow);
  print("roofSinePeriod:", roofSinePeriod);
  print("noiseScale:", noiseScale);
  print("iM:", iM);
  print("jM:", jM);

  print("offsetType", offsetType);
  N *= (1 + offscreen);
  for (let i = -N * offscreen; i < N * (1 + offscreen); i++) {
    for (let j = 0; j < M; j++) {
      let n, offset;
      if (offsetType == "noise") {
        n = noise(i * offsetNoiseScale, j * offsetNoiseScale) * TAU * 2;
        offset = createVector(cos(n), sin(n)).mult(offsetNoiseStrength);
      } else if (offsetType == "sine") {
        n = norm(sin((i * noiseScale * iM + j * noiseScale * jM)), -1, 1) * TAU * map(noise(i * noiseScale * 0.1, j * noiseScale * 0.1), 0, 1, 0, 1);
        offset = createVector(cos(n), sin(n)).mult(400);
      } else if (offsetType == "none") {
        offset = createVector();
      }

      let site = createVector(
        i * targetSz / N + (j % 2) * (hex * 0.5 * targetSz / N) + offset.x,
        j * 1.5 * targetSz / zAngle / M + offset.y
      );
      site.rotate(mainAngle);

      voronoiSite(
        site.x, site.y
      );
    }
  }

  voronoi(vWidth, vHeight, true);
  var cells = voronoiGetCells();
  preparePolys(cells);

  print("sorting");
  drawArray.sort(function (a, b) {
    return a[0][0] - b[0][0];
  });

}

function draw() {

  canv.strokeWeight(1);
  if (!saving) {
    canv.push();
    canv.scale(screenAdj, screenAdj);
    canv.scale(mag, mag);
    canv.strokeJoin(ROUND);
    for (let k = 0; k < max(drawArray.length * renderSpeed, 1); k++) {
      if (drawZ < drawArray.length) {
        let t = drawArray[drawZ];
        if (t[t.length - 1] == "tri") {
          let p1_x = t[3];
          let p1_y = t[4];
          let p1_z = t[5];

          let p2_x = t[6];
          let p2_y = t[7];
          let p2_z = t[8];

          let p3_x = t[9];
          let p3_y = t[10];
          let p3_z = t[11];

          let c_x = t[1];
          let c_y = t[2];
          let c_z = t[0];

          push();
          translate(c_x, c_y);
          triangle(
            p1_x, p1_y,
            p2_x, p2_y,
            p3_x, p3_y);
          pop();
        } else if (t[t.length - 1] == "quad") {
          let p1 = createVector(t[1], t[2], t[3]);
          let p2 = createVector(t[4], t[5], t[6]);
          let p3 = createVector(t[7], t[8], t[9]);
          let p4 = createVector(t[10], t[11], t[12]);

          let U = p5.Vector.sub(p2, p1);
          let V = p5.Vector.sub(p3, p1);
          let N = createVector(
            U.y * V.z - U.z * V.y,
            U.z * V.x - U.x * V.z,
            U.x * V.y - U.y * V.x
          ).normalize();
          let shade = abs(N.dot(lightDir));
          let d1 = createVector(p1.x, p1.z * zAngle - p1.y);
          let d2 = createVector(p2.x, p2.z * zAngle - p2.y);
          let d3 = createVector(p3.x, p3.z * zAngle - p3.y);
          let d4 = createVector(p4.x, p4.z * zAngle - p4.y);

          canv.fill(lightColor(shade));
          canv.stroke(strokeCol);
          canv.beginShape();
          canv.vertex(d1.x, d1.y);
          canv.vertex(d2.x, d2.y);
          canv.vertex(d3.x, d3.y);
          canv.vertex(d4.x, d4.y);
          canv.endShape(CLOSE);

          canv.stroke(speckleCol);
          if (shade > 0.8) {
            if (speckledShading) {
              let triArea1 = sqrt(triArea(d1, d2, d3));
              let triArea2 = sqrt(triArea(d1, d4, d3));
              let nPts = constrain(triArea1 * 0.05, 0, 20);
              for (let m = 0; m < nPts; m++) {
                let rndPtInTri = randomInTri(d1, d2, d3);
                canv.point(rndPtInTri.x, rndPtInTri.y);
              }
              nPts = constrain(triArea2 * 0.05, 0, 20);
              for (let m = 0; m < nPts; m++) {
                let rndPtInTri = randomInTri(d1, d4, d3);
                canv.point(rndPtInTri.x, rndPtInTri.y);
              }
            }
          }

        } else if (t[t.length - 1] == "poly") {

          let p1 = t[1];
          let p2 = t[2];
          let p3 = t[3];

          canv.stroke(strokeCol);
          canv.fill(accentCol);
          canv.beginShape();
          for (let i = 1; i < t.length - 1; i++) {
            let p = t[i];
            canv.vertex(p.x, p.z * zAngle - p.y);
          }
          canv.endShape(CLOSE);
        }
        drawZ++;
      } else {
        fxpreview();
        print("done");
        if (saveMode) {
          doDownload = true;
          saving = true;
        } else {
          if (mag > 1) {
            doDownload = true;
          }
          noLoop();
        }
        break;
      }
    }
    canv.pop();
    canv.noStroke()
    canv.fill(darkCol);
    canv.rect(0, 0, canv.width, borderW * screenAdj*mag);
    canv.rect(0, canv.height - borderW * screenAdj*mag, canv.width, borderW * screenAdj*mag);
    canv.rect(0, 0, borderW * screenAdj*mag, canv.height);
    canv.rect(canv.width - borderW * screenAdj*mag, 0, borderW * screenAdj*mag, canv.height);

    if (doDownload) {
      saveCanvas(canv, fxhash, 'png');
      doDownload = false;
    }

    image(canv, 0, 0, width, height);
  } else {
    saveTime++;
    if (saveTime > 40 * mag) {
      window.location.reload();
      noLoop();
    }
  }
}