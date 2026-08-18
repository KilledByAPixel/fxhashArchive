// Author: Nathaniel Sarkissian
// Date: July 8, 2022
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

let randomCount = 0;
let segCount = 0;
let poppyCount = 0;
let daisyCount = 0;
let roseCount = 0;
let thistleCount = 0;
let lavenderCount = 0;

let saveMode = !true;
// let saveCount = 1;
let saving = false;
let saveTime = 0;


let hMap = [];
let erodeMap = [], depositMap = [];
let hMax = -1000, hMin = 1000;
let maxTerrH;
let mapW, mapH, baseArea = 400 * 400, areaM;
let baseHeight = 0;
let waterLevel = 15 + baseHeight;
let trim = 10;

let drawVectors = [];

let noiseScale;
let sNoise;
let worleyNoise;

let light;
let toEye;
let lightVector; // for shader

let hMapImg;
let rockMap, rockMapArr = [];
let lightMap;
let lightAngle, lightHeightAngle, sn, cs;

let rockCol;
let highlightCol, shadowCol, thirdCol, fourthCol;
let rockShadowCol, rockHighlightCol;
let waterCol;

let flowerTypes = ["poppy", "daisy", "rose", "thistle", "tall"];
let flowerType, daisyType;
let flowerArrangment;
let flowerNoiseScaleAdjust, flowerTypeNoiseScaleAdjust;
let drawFlowers;
let poppyCols = [];
let tallCols = [];
let flowerThresh; //0.35; //0.5;
// let flowerThresh = 0.37; //0.9;

let daisyCols = [];
let roseCols = [];
let thistleCols = [];
let lavenderCols = [];
let daisyMid1, daisyMid2, roseMid1, roseMid2;

let drawFloofs = true;
let floofCols = [];
let floofThresh = 0.7;
// let floofThresh = 0.94 + 0.01;

let drawSage = true;
let sageCols = [];
let sageThresh = 0.6; //0.84; // + 0.12;

let drawGrass = true;
let grassCols = []

let drawBees, drawDragonFlies;

let grassContrast = 0.5;
let sageContrast = 0.2;
// let grassContrast = 0.4;

let erosionEnabled = true;

let rocks = [];
let rockPlacement;

let loadingFont;

let theShader;
function preload() {
  theShader = loadShader('shader.vert', 'shader.frag');
  loadingFont = loadFont('georgia.ttf');
}

let mainAngle;

let rSeed, nSeed;

let mag = 1;
let overallZoom;
let aspectRatio;
let zAngle;

let targetRes = 1050;
let resScaleFactor;

let sinImg, cosImg, tanImg;
let xyFlip;

let canv;

function setup() {
  handleUrlParams();
  print("fxhash", fxhash);
  rSeed = floor(fxrand() * 1000000000);
  nSeed = floor(fxrand() * 1000000000);
  // print("rSeed", rSeed);
  // print("nSeed", nSeed);
  randomSeed(rSeed);
  noiseSeed(nSeed);

  pixelDensity(1);

  prepareTrigTextures();

  let zr = floor(frandA(10));
  if (zr < 3) {
    overallZoom = frandAB(0.19, 0.2);
    sageThresh = 0.69;
  } else if (zr < 6) {
    overallZoom = 0.4;
  } else {
    overallZoom = frandAB(0.6, 1);
  }
  aspectRatio = 1;
  zAngle = 0.4;

  xyFlip = floor(frandA(10)) < 5 ? -1 : 1;


  // print("overallZoom", overallZoom);

  let r = floor(frandA(10));
  if (r < 0.3) {
    setPalette(2);
  } else {
    setPalette(frandArr([0, 2, 3, 4, 5, 6]));
  }

  // frameRate(3);
  // print("attempted canvas:", min(windowWidth, windowHeight) * mag, min(windowWidth, windowHeight) * mag * aspectRatio);
  canv = createGraphics(min(windowWidth, windowHeight) * mag, min(windowWidth, windowHeight) * mag * aspectRatio);
  canv.background(grassCols[0]);
  createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight) * aspectRatio);
  // createCanvas(min(windowWidth, windowHeight) * mag, min(windowWidth, windowHeight) * mag * aspectRatio);
  // print("windowWidth", min(windowWidth, windowHeight));
  // print("width", canv.width);
  resScaleFactor = canv.width / targetRes;
  resScaleFactor /= 2;

  // print("resScaleFactor", resScaleFactor);

  // print("width:", canv.width);
  // print("height:", canv.height);

  mapW = floor(200 * overallZoom + trim * 2);
  mapH = floor((100 + fmap(aspectRatio, 0.5, 1, 0, 200)) * overallZoom * aspectRatio + trim * 2 + 200);
  // print("mapW", mapW);
  // print("mapH", mapH);

  // noSmooth();

  areaM = mapW * mapH / baseArea;
  mainAngle = 0;

  lightAngle = PI / 4;
  sn = round(sin(lightAngle));
  cs = round(cos(lightAngle));
  // print("sncs", sn, cs);

  // print("lightAngle", degrees(lightAngle));
  lightHeightAngle = PI / 2.5;
  lightMap = createGraphics(mapW, mapH, WEBGL);
  lightMap.background(0);
  if (overallZoom <= 0.2) {
    maxTerrH = 20;
  } else {
    maxTerrH = 40; //frandAB(40, 60); //80 * frandAB(0.5, 1);
  }

  sNoise = openSimplexNoise(nSeed);
  noiseScale = 0.005 * 0.8 * 0.8;//frandAB(0.2, 1.5);

  worleyNoise = new Worley();
  worleyNoise.setSeed(floor(frandA(1000000)));

  let rockLightAngle = lightAngle; //mainAngle - PI / 2;
  light = createVector(cos(rockLightAngle), -1, sin(rockLightAngle) - 2).normalize();
  toEye = createVector(0, 1, -1).normalize();

  lightVector = createVector(0.5, 0.5, 1).normalize();
  lightVector.x = Math.fround(floor(lightVector.x * 100));
  lightVector.y = Math.fround(floor(lightVector.y * 100));
  lightVector.z = Math.fround(floor(lightVector.z * 100));
  // lightVector = createVector(cos(lightAngle), sin(lightAngle), 1).normalize();

  if (overallZoom > 0.3) {
    flowerThresh = frandAB(0.6, 0.7); //frandAB(0.5, 0.8); //frandAB(0.7, 0.8);
  } else {
    flowerThresh = frandAB(0.7, 0.8);
  }
  // print("flowerThresh", flowerThresh);
  flowerType = frandArr(flowerTypes);
  // flowerType = "rose";
  flowerTypes = shuffle(flowerTypes);
  // print(flowerType);
  daisyType = floor(frandA(10)) < 105 ? "normal" : "down";
  // print(daisyType);
  flowerArrangment = floor(frandA(10)) < 5 ? "mixed" : "unmixed";
  flowerArrangment = "mixed";
  // print(flowerArrangment);
  flowerTypeNoiseScaleAdjust = frandAB(0.2, 1);
  if (overallZoom <= 0.2) {
    flowerTypeNoiseScaleAdjust = 0.2; //frandAB(0.2, 0.5);
  } else if (overallZoom == 0.4) {
    flowerNoiseScaleAdjust = 1.5;
  }
  drawFlowers = floor(frandA(10)) < 8;
  drawFloofs = floor(frandA(10)) < 8;
  drawSage = floor(frandA(10)) < 8;
  drawFloofs = drawFlowers = drawSage = true;
  drawBees = floor(frandA(10) < 8);
  drawDragonFlies = floor(frandA(10) < 8);
  // drawFlowers = false;

  floofThresh -= frandA(0.1);
  // sageThresh -= frandA(0.05);
  // flowerThresh -= frandA(0.2);

  // print("drawFlowers", drawFlowers);
  // print("drawFloofs", drawFloofs);
  // print("drawSage", drawSage);

}

let drawing = true;
let drawZ = -1;
let tintZ = 0;
let tintMax = 0;

let timer = 0;
let loadingSequence = 1;

function draw() {
  timer++;
  if (loadingSequence == 1) {
    // print("Building Landscape");
    canv.background(grassCols[0]);
    drawLoadingScreen();
    loadingSequence++;
    timer = 0;
  } else if (loadingSequence == 2) {
    prepareHeightmap();
    loadingSequence++;
  } else if (loadingSequence == 3) {
    // print("Placing Stones");
    loadingSequence++;
  } else if (loadingSequence == 4 && timer > 100) {
    canv.background(grassCols[0]);
    image(canv, 0, 0, width, height);
    prepareRocks();
    loadingSequence++;
  } else if (loadingSequence == 5) {
    prepareDrawingArray();
    loadingSequence++;
  } else if (loadingSequence == 6) {
    updateShading();
    updateShading();
    loadingSequence++;
  } else if (loadingSequence == 7) {
    canv.push();
    let sc = 5.5 * 1 / overallZoom + 0.2;
    sc *= 4 * (0.5 / zAngle);
    canv.scale(resScaleFactor, resScaleFactor);
    canv.scale(sc, sc);

    canv.translate(zAngle * mapW / 2 - trim / 2 - 1, zAngle * mapH / 4);
    canv.translate(0.75, 0);

    canv.scale(xyFlip, 1);


    if (drawing) {
      if (drawZ == -1) {
        // print("drawVector.length", drawVectors.length);
        updateShading();
        updateShading();
        drawVectors.sort(function (a, b) { return a[1] - b[1] });

        // print("-1");
        drawZ++;
        lightMap.loadPixels();
        rockMap.loadPixels();
      } else {
        let linesPerFrame;
        if (mag == 1) {
          linesPerFrame = 400;
        } else {
          linesPerFrame = 40 * overallZoom;
        }
        for (let i = 0; i < linesPerFrame; i++) {
          if (drawZ < drawVectors.length) {
            drawColumn(drawZ);
            drawZ++;
          } else {
            drawing = false;
            if (mag > 1) {
              print("saving high res");
              save(canv, fxhash + "_high_res.png");
            }
            print("done");
            fxpreview();
            if (saveMode) {
              saveCanvas(fxhash, 'png');
              saving = true;
            }
            break;
          }
        }
        if (mag > 1 && frameCount%10==0) {
          print( floor(100 * 100 * drawZ / drawVectors.length)/100 + "%");
        }
      }

      image(canv, 0, 0, width, height);
    } else if (saving) {
      saveTime++;
      if (saveTime > 20) {
        window.location.reload();
        noLoop();
      }
    }
    canv.pop();
  }
}