// Author: Nathaniel Sarkissian
// Date: January 12, 2023
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

let saveMode = !true;
let saving = false;
let saveTime = 0;
let doDownload = false;
let canv;

let shapes = [];
let paperColor;
let palettes = [], palette;
let treePalettes = [], treePalette;

let noiseScale = 0.01 * 1;

let hMap = [], lMap = [];
let erodeMap = [], depositMap = [];
let mapW, mapH;
let mapTrim = 0;
let minY = 10000000000000;
let maxY = -10000000000000;
let terrainHt;
let warpSz;

let targetSz = 400;
let sizeAdj;
let scl = 0.7;
let mag = 1;

let lightAngle, lgt;

let sNoise;
let nSeed, rSeed;

function setup() {
  print(fxhash);

  rSeed = floor(fxrand() * 100000000);
  nSeed = floor(fxrand() * 100000000);

  randomSeed(rSeed);
  noiseSeed(nSeed);
  sNoise = new openSimplexNoise(nSeed);

  handleUrlParams();

  let canvSz = min(windowWidth * mag, windowHeight * mag);
  sizeAdj = canvSz / targetSz;

  canv = createCanvas(canvSz, canvSz);

  paperColor = color('#dfd8ce');
  background(paperColor);


  let paletteIndex = random([
    0,
    1,
    2,
    3,
    4,
    5
  ]);
  preparePalette(paletteIndex);

  lightAngle = -PI / 2 + (random(1) < 0.5 ? -1 : 1) * PI / 3;
  lgt = _normalize(_createV(cos(lightAngle), sin(lightAngle), 0));

  terrainHt = -0.2 * targetSz;
  warpSz = 10;

  prepareHeightMap();
  prepareLigthMap();

  let nShapes = 8000;
  let nCircles = nShapes * 0.2;
  let treeToScrubThresh = random(0.18, 0.28);
  let plantThresh = constrain(random(0.3, 0.5), 0.3, 0.45);
  let plantSide = random([-1, 1]);
  let plantSlopeLeniency = random(0.01, 0.1);

  for (let i = 0; i < nCircles; i++) {
    let x = random(targetSz);
    let y = random(targetSz);
    let z = y + 10;

    let i = constrain(floor(map(x, 0, targetSz, mapTrim, mapW - 1 - mapTrim)), 0, mapW - 1);
    let j = constrain(floor(map(y, 0, targetSz, mapTrim, mapH - 1 - mapTrim)), 0, mapH - 1);
    let ns = hMap[i][j];

    x += cos(ns) * warpSz;
    y += sin(ns) * warpSz;
    y += map(ns, 0, 2 * TAU, 0, 1) * terrainHt;


    let nrm = _normalize(hMapNormal(i, j));
    let dt = _dot(nrm, lgt);

    if (ns != 0) {
      let nrm2 = hMapNormal2(i, j);

      let minStrokeLen = 4;
      let maxStrokeLen = 4;
      let r = random(minStrokeLen, maxStrokeLen);

      let nScribbles = 1;
      for (let k = 0; k < nScribbles; k++) {
        let offset = _createV(1, 0);
        offset = _rotate(
          offset,
          noise(x * noiseScale, y * noiseScale, random(TAU) * 0.1) * 2 * TAU,
          0,
          0,
        );
        offset = _scalarMult(offset, random(r));
        let scribble = new SketchyEllipse(
          x + offset.x,
          y + offset.y,
          r, r,
          1,
          !true
        );
        scribble.z = z;

        scribble.setWeight(2.5);
        scribble.setMaxV(0.3);
        scribble.setAcc(0.01);
        scribble.setDensity(1);
        scribble.setWobble(0.1);
        scribble.setAngle(random(TAU));

        let lightValue = norm(dt, -1, 1);
        let landValue = noise(i * noiseScale * 4 + 1000, j * noiseScale * 4 + 1000);


        let c = paletteColor(
          lerp(landValue, lightValue, constrain(abs(lightValue - 0.5) * 2 + random(-1, 1) * 0.1, 0, 1))
        );

        scribble.setColor(
          color(
            red(c),
            green(c),
            blue(c),
            64
          )
        );
        shapes.push(scribble);

        let treeNs = noise(i * noiseScale * 3 + 1234, j * noiseScale * 3 + 1234);
        if (abs(nrm.x) < plantThresh &&
          (
            plantSide < 0 ?
              (nrm2.x < random(plantSlopeLeniency)) :
              (nrm2.x > random(-plantSlopeLeniency))
          )

        ) {
          let shadowLength = 0.5;
          let treeHtNs = noise(i * noiseScale * 9 + 100, j * noiseScale * 9 + 123);
          if (treeNs > treeToScrubThresh) {
            if (ns < PI * 2.5 && j > 4) {
              addTree(x, y, z - 10, lightValue, map(treeHtNs, 0, 1, 10, 80));
              shadowLength = 1;
            }
            if (random(1) < 0.5) {
              addBush(x, y, z - 10 + 0.0001, lightValue, map(treeHtNs, 0, 1, 10, 100) * 0.5, i, j);
            }
          } else {
            addBush(x, y, z - 10 + 0.0001, lightValue, map(treeHtNs, 0, 1, 10, 100), i, j);
          }
          let w = map(treeHtNs, 0, 1, 4, 8) * shadowLength;
          let h = map(treeHtNs, 0, 1, 1, 3);
          for (let __i = -w; __i <= w; __i++) {
            for (let __j = -h; __j <= h; __j++) {
              let _i = floor(i + __i + cos(lightAngle) * w * 0.5);
              let _j = floor(j + __j + sin(lightAngle) * h * 0.5);
              if (_i < 0 || _i >= mapW || _j < 0 || _j >= mapH) {
              } else {
                lMap[_i][_j] = lerp(lMap[_i][_j], -1, 0.7);
              }
            }
          }
        }
      }
    }

  }

  for (let i = 0; i < nShapes; i++) {
    let x = random(targetSz);
    let y = random(targetSz);
    let z = y;

    let i = constrain(floor(map(x, 0, targetSz, mapTrim, mapW - 1 - mapTrim)), 0, mapW - 1);
    let j = constrain(floor(map(y, 0, targetSz, mapTrim, mapH - 1 - mapTrim)), 0, mapH - 1);
    let ns = hMap[i][j];

    x += cos(ns) * warpSz;
    y += sin(ns) * warpSz;
    y += map(ns, 0, 2 * TAU, 0, 1) * terrainHt;

    let nrm = _normalize(hMapNormal(i, j));
    let dt = lMap[i][j];

    let nrm2 = _magSq(hMapNormal2(i, j));
    let minStrokeLen = 15;
    let maxStrokeLen = 30 * 0.8;

    let nScribbles = max(1, floor(
      map(
        pow(abs(y - z), 1),
        0,
        pow(abs(terrainHt) + abs(warpSz), 1),
        1,
        random(1, 3)
      )
    ));

    for (let k = 0; k < nScribbles; k++) {
      let r = constrain(
        map(nrm2, 0.0001, 0.0008, maxStrokeLen, minStrokeLen),
        minStrokeLen,
        maxStrokeLen
      );

      let scribble = new SketchyEllipse(
        x,
        y,
        5, r * random(0.9, 1.1),
        random(1, 2)
      );
      scribble.z = z;

      scribble.setWeight(2.5);
      scribble.setMaxV(1);
      scribble.setAcc(0.02);
      scribble.setDensity(2);
      scribble.setWobble(0.2);
      scribble.setAngle(
        (map(nrm.x, 1, -1, 0, PI / 2) + PI / 4) +
        (round(random(1)) * 2 - 1) * PI +
        map(noise(x * noiseScale, y * noiseScale), 0, 1, -1, 1) * PI / 8 * 0
      );

      for (let i = 0; i < scribble.points.length; i++) {
        let pt = scribble.points[i];
        let ns = (noise(pt.x * noiseScale * 4 + 100, pt.y * noiseScale * 4 + 100) * 2 - 1) * 2 * TAU;
        pt.x += cos(ns) * 2;
        pt.y += sin(ns) * 2;
      }

      let lightValue = norm(dt, -1, 1);
      let landValue = noise(i * noiseScale * 4 + 1000, j * noiseScale * 4 + 1000);

      let c = paletteColor(
        lerp(landValue, lightValue, abs(lightValue - 0.5) * 2)
      );

      scribble.setColor(
        color(
          red(c),
          green(c),
          blue(c),
          64
        )
      );

      shapes.push(scribble);
    }
  }

  shapes.sort(function (a, b) {
    let dZ = -(a.z - b.z);
    return dZ;
  });
}

let renderingIndex = 0;
function draw() {
  if (!saving) {
    push();

    scale(scl * sizeAdj, scl * sizeAdj);
    translate(
      width * 0.5 / (scl * sizeAdj) - targetSz * 0.5,
      height * 0.5 / (scl * sizeAdj) - (maxY - minY) * 0.5
    );

    translate(0, -minY + 0);

    for (let i = 0; i < 2000; i++) {
      let shape = shapes[shapes.length - 1];
      let drawStatus = shape.update();
      if (drawStatus == "done") {
        renderingIndex++;
        shapes.pop();
        if (shapes.length == 0) {
          fxpreview();
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
    }
    pop();

    if (doDownload) {
      print("saving");
      saveCanvas(canv, fxhash, 'png');
      doDownload = false;
    }
  } else {
    saveTime++;
    if (saveTime > 80) {
      hMap = null;
      shapes = null;
      window.location.reload(true);
      noLoop();
    }
  }
}

function hMapNormal(i, j) {
  let _i, iDir = 1;
  let _j, jDir = 1;

  if (i == mapW - 1) {
    _i = i - 1;
    iDir = -1;
  } else {
    _i = i + 1;
  }

  if (j == mapH - 1) {
    _j = j - 1;
    jDir = -1;
  } else {
    _j = j + 1;
  }

  return _createV(
    (hMap[_i][j] - hMap[i][j]) * iDir,
    (hMap[i][_j] - hMap[i][j]) * jDir);
}

function hMapNormal2(i, j) {
  let _i, iDir = 1;
  let _j, jDir = 1;

  if (i == mapW - 1) {
    _i = i - 1;
    iDir = -1;
  } else {
    _i = i + 1;
  }

  if (j == mapH - 1) {
    _j = j - 1;
    jDir = -1;
  } else {
    _j = j + 1;
  }

  return _createV(
    (hMapNormal(_i, j).x - hMapNormal(i, j).x) * iDir,
    (hMapNormal(i, _j).y - hMapNormal(i, j).y) * jDir
  );
}

function addTree(x, y, z, lightValue, treeHt) {
  let trunkWiggle = 2;
  let trunk = new SketchyWeightedLine(
    x + random(-1, 1) * trunkWiggle,
    y + random(-1, 1) * trunkWiggle,
    x + random(-1, 1) * trunkWiggle,
    y - treeHt + random(-1, 1) * trunkWiggle,
    0.5,
    0.2
  );
  trunk.setWeight(1.5);
  trunk.setMaxV(0.3);
  trunk.setAcc(0.02);
  trunk.setDensity(1);
  trunk.setWobble(0.2);
  trunk.setAngle(0);
  trunk.z = z;


  let c = treePaletteColor(
    random(0.5)
  );

  trunk.setColor(
    color(
      red(c),
      green(c),
      blue(c),
      64
    )
  );

  shapes.push(trunk);

  let clumpOffset;
  let nClumps = round(random(4, 5));
  for (let j = 0; j < nClumps; j++) {
    let branchHt = random(0.1, 1);
    let branchStartY = lerp(y, y - treeHt, branchHt);

    clumpOffset = _createV(0, -random(treeHt * 0.7) * map(branchHt, 0.1, 1, 0.5, 0.8));
    clumpOffset = _rotate(clumpOffset, random(-1, 1) * PI / 2, 0, 0);
    clumpOffset.y *= random(1, 2);

    let branchLine = new SketchyWeightedLine(
      x,
      branchStartY,
      x + clumpOffset.x,
      y - treeHt + clumpOffset.y,
      0.25,
      0.1
    );
    branchLine.setWeight(1.5);
    branchLine.setMaxV(0.3);
    branchLine.setAcc(0.02);
    branchLine.setDensity(1);
    branchLine.setWobble(0.2);
    branchLine.z = z;


    let c = treePaletteColor(
      0
    );

    branchLine.setColor(
      color(
        red(c),
        green(c),
        blue(c),
        64
      )
    );

    shapes.push(branchLine);

    let offset;
    let nLeaves = round(random(2, 20));
    for (let i = 0; i < nLeaves; i++) {
      let r = random(2, 3) * map(i, 0, nLeaves, 1.5, 1);
      offset = _createV(random(r * 1.8), 0);
      offset = _rotate(offset, random(TAU), 0, 0);

      let folliage = new SketchyEllipse(
        x + offset.x + clumpOffset.x,
        y - treeHt + offset.y + clumpOffset.y,
        4, r * 2,
        random(1, 1.1),
        !true
      );
      folliage.z = z;
      folliage.setWeight(2.5);
      folliage.setMaxV(1);
      folliage.setAcc(0.02);
      folliage.setDensity(2);
      folliage.setWobble(0.2);
      folliage.setAngle(
        map(noise(folliage.x * noiseScale * 3, folliage.y * noiseScale * 3), 0, 1, -1, 1) * PI / 6
      );

      let normal = _normalize(
        _createV(
          -clumpOffset.x * 0.3 - offset.x,
          clumpOffset.y * 0.3 + offset.y + 6
        )
      );
      let br = pow(
        norm(
          _dot(normal, lgt),
          -1,
          1
        ),
        map(lightValue, 0, 1, 8, 1)) +
        map(lightValue, 0, 1, 0, 0.2);

      br += random(-1, 1) * 0.1;
      br = constrain(br, 0, 1);

      let c = treePaletteColor(
        constrain(br, 0, 1)
      );

      folliage.setColor(
        color(
          red(c),
          green(c),
          blue(c),
          64
        )
      );

      shapes.push(folliage);
    }
  }
}

function addBush(x, y, z, lightValue, rockHt, i, j) {
  let clumpOffset;
  let nClumps = round(random(4, 5));
  for (let j = 0; j < nClumps; j++) {
    clumpOffset = _createV(0, -random(rockHt * 0.1));
    clumpOffset = _rotate(clumpOffset, random(-1, 1) * PI / 2, 0, 0);
    clumpOffset.y = -abs(clumpOffset.y);

    let nrm = _normalize(hMapNormal(i, j));

    let offset;
    let nRocks = round(random(10, 20) * 0.4);
    for (let i = 0; i < nRocks; i++) {
      let r = random(2, 3) * map(i, 0, nRocks, 1.5, 1);
      offset = _createV(random(r * 1.5), 0);
      offset = _rotate(offset, random(TAU), 0, 0);
      offset.y = -abs(offset.y);

      let rocks = new SketchyEllipse(
        x + offset.x + clumpOffset.x,
        y + offset.y + clumpOffset.y,
        r * 2, 4,
        random(1, 1.1),
        !true
      );
      rocks.z = z;
      rocks.setWeight(1.5);
      rocks.setMaxV(1);
      rocks.setAcc(0.02);
      rocks.setDensity(2);
      rocks.setWobble(0.2);

      let normal = _normalize(
        _createV(
          -clumpOffset.x * 0.3 - offset.x,
          clumpOffset.y * 0.3 + offset.y + 6
        )
      );

      let br = pow(
        norm(
          _dot(normal, lgt),
          -1,
          1
        ),
        map(lightValue, 0, 1, 8, 1)) +
        map(lightValue, 0, 1, 0, 0.2);

      br += random(-1, 1) * 0.4;
      br = constrain(br, 0, 1);

      let c = treePaletteColor(
        constrain(br, 0, 1)
      );

      rocks.setColor(
        color(
          red(c),
          green(c),
          blue(c),
          64
        )
      );

      rocks.setAngle(
        (map(nrm.x, 1, -1, 0, PI / 2) + PI / 4) + (round(random(1)) * 2 - 1) * PI + PI / 2 +
        map(normal.x, -1, 1, 1, -1) * random(PI / 4, PI / 8)
      );

      shapes.push(rocks);
    }
  }
}