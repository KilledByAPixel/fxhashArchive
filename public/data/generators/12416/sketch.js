// Author: Nathaniel Sarkissian
// Date: May 4, 2022
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

let mainCanv;

let saveMode = false;
let nSaved = 0;
let nToSave = 400;

let hMap = [];
let craterMap = [];
let erodeMap = [];
let depositMap = [];
let colorMap = [];

let sNoise;
let noiseScale = 0.007;
let overallScale;
let noiseOffX = 0;
let noiseOffY = 0;

let hResX, hResY;

let targetAngle;
let currentAngle = -1;
let lightAngle, cs, sn;
let lightHeightAngle = -1;
let sunX, sunH, sun;
let minSunH, maxSunH;
let aoMax;
let dynamicLighting;

let darkRock;
let lightRock;
let sand1;
let sand2;

let mountainColor1, mountainColor2;
let terrainColor1, terrainColor2;
let craterColor, dikeColor, boulderColor;

let terrainTypeMask;

let windowAreaM;
let offScreenMargin = 100;

let theShader;
let hMapTex, colorMapTex, finalImg, frameImg;

let amp = 0;

let aspectRatio = 5 / 7.5;
let windowScale = 0;
let winWidth, winHeight;
let scaleMode = "discover";

let highlightCol, shadowCol;
let lighting;
let frame;

let eroding, settingUp = true;
let textSz1 = 18;
let textSz2 = 15;
let framesSinceDoneEroding;

let loadingFont;

let rSeed = Math.floor(fxrand() * 1000000000);
let nSeed = Math.floor(fxrand() * 1000000000);

function preload() {
  theShader = loadShader('shader.vert', 'shader.frag');
  loadingFont = loadFont('PrimoSerif.otf');
}

function setup() {
  minSunH = PI / 3;
  maxSunH = PI / 2.5;
  handleUrlParams();

  if (windowScale <= 1) {
    dynamicLighting = true;
  } else {
    dynamicLighting = false;
  }

  pixelDensity(1);
  winHeight = windowHeight;
  if (scaleMode == "scale") {
    winHeight = 1000;
  } else {
    winHeight = max(1000, windowHeight);
  }

  scaleAdjust = windowHeight / float(winHeight);
  print("scale adjust", scaleAdjust);

  let win_ht = winHeight * windowScale;
  let win_wd = floor(win_ht * aspectRatio);

  if (scaleAdjust >= 1) {
    mainCanv = createCanvas(win_wd, win_ht);
  } else {
    if (scaleMode == "discover") {
      mainCanv = createCanvas(win_wd * scaleAdjust, win_ht * scaleAdjust);
    } else {
      mainCanv = createCanvas(win_wd, win_ht);
    }
  }
  mainCanv.id('mycanvas');
  background(color('#212121'));
  fill(255);
  textFont(loadingFont);
  textSize(textSz1);
  text("Building Terrain", width / 2 - textWidth("Building Terrain") / 2, height / 2 - textSz1 / 2);


  print("width, height", width, height);
  print("windowWidth, windowHeight", windowWidth, windowHeight);

  noiseOffX = -win_wd / 2;
  noiseOffY = -win_ht / 2;

  hResX = win_wd;
  hResY = win_ht;
  if (scaleMode == "discover") {
    hResX += offScreenMargin;
    hResY += offScreenMargin;
  } else {
    hResX += offScreenMargin * windowScale;
    hResY += offScreenMargin * windowScale;
  }
  print("hresX, hResY", hResX, hResY);

  for (let i = 0; i < hResX; i++) {
    let row = [];
    let row2 = [];
    let row3 = [];
    let row4 = [];

    for (let j = 0; j < hResY; j++) {
      row.push(0);
      row2.push(0)
      row3.push(0.01);
      row4.push(0);
      colorMap.push(0);
      colorMap.push(0);
      colorMap.push(0);
    }
    erodeMap.push(row);
    depositMap.push(row2);
    hMap.push(row3);
    craterMap.push(row4);
  }

  hMapTex = createGraphics(hResX, hResY);
  colorMapTex = createGraphics(hResX, hResY);
  finalImg = createGraphics(hResX, hResY, WEBGL);
  frameImg = createGraphics(hResX, hResY);

  print("finalImg", finalImg.width, finalImg.height);
}

let va = 0;

function draw() {
  if (settingUp) {
    print("setting up");
    setupThings();
    settingUp = false;
    eroding = true;
  } else {
    if (eroding) {
      background(color('#212121'));
      fill(255);
      textFont(loadingFont);
      textSize(textSz1);
      text("Eroding", width / 2 - textWidth("Eroding") / 2, height / 2 - textSz1 / 2);

      if (erodeCount > 0) {
        let erodeAmt = min(50000, erodeCount);

        if (scaleMode == "scale") {
          if (windowScale == 1) {
            erode(hMap, erodeAmt, 1, 0);
          } else {
            erode(hMap, erodeAmt, 1, round(map(erodeCount, 500000 * windowAreaM, 0, sq(windowScale), 0)));
          }
        } else {
          erode(hMap, erodeAmt, 1, 0);
        }
        erodeCount -= erodeAmt;

        if (windowScale > 1) {
          textSize(textSz2);
          let progressText = (floor((100 - 100 * erodeCount / erodeTotal) * sq(windowScale)) / sq(windowScale)).toFixed(2) + "%";
          text(progressText, width / 2 - textWidth(progressText) / 2, height / 2 + textSz2 / 2);
        }
      } else {
        blurMap(hMap, 1, 0.2);
        updateHMapTex();
        eroding = false;
      }
    } else {
      background(0);
      framesSinceDoneEroding++;
      if (dynamicLighting) {
        targetAngle = createVector(1, 0);
        targetAngle.rotate(PI - atan2(mouseX - width / 2, mouseY - height / 2) + PI / 2);
        lightAngle = createVector(1, 0);
        lightAngle.rotate(currentAngle);
        let da = angBetween(targetAngle, lightAngle);

        let distFromCenter = dist(mouseX, mouseY, width / 2, height / 2);
        let targetSunHeight = constrain(map(distFromCenter, 0, width / 2, maxSunH, minSunH), minSunH, maxSunH);
        lightHeightAngle += constrain((targetSunHeight - lightHeightAngle) * 0.01, -0.0003, 0.0003);

        da = da * 0.005;
        if (da > 0) {
          da = min(da, PI / 800);
        } else {
          da = max(da, -PI / 800);
        }
        currentAngle += da;

        // if (da * va < 0) {
        //   va += (da * 0.005 - va) * 0.01;
        // } else {
        //   va = da * 0.005;
        // }

        // currentAngle += constrain(va, -PI / 900, PI / 900); //da * 0.005;
      }

      theShader.setUniform('mxmy', [mouseX / width, mouseY / height]);
      theShader.setUniform('u_resolution', [hResX, hResY]);
      theShader.setUniform('hMapTex', hMapTex);
      theShader.setUniform('colorMapTex', colorMapTex);
      theShader.setUniform('frameTex', frameImg);
      theShader.setUniform('mouse', [mouseX, mouseY]);
      theShader.setUniform('lightAngle', currentAngle);
      theShader.setUniform('lightHeightAngle', lightHeightAngle);
      theShader.setUniform('aoMax', aoMax);
      theShader.setUniform('minH', minH);
      theShader.setUniform('maxH', maxH);
      theShader.setUniform('highlightCol', [red(highlightCol), green(highlightCol), blue(highlightCol)]);
      theShader.setUniform('shadowCol', [red(shadowCol), green(shadowCol), blue(shadowCol)]);
      theShader.setUniform('lighting', lighting);
      theShader.setUniform('frame', frame);
      if (scaleMode == "scale") {
        theShader.setUniform('windowScale', sqrt(windowScale));
      } else {
        theShader.setUniform('windowScale', 1.0);
      }
      finalImg.shader(theShader);
      finalImg.background(0);
      finalImg.rect(0, 0, finalImg.width, finalImg.height);

      if (scaleAdjust >= 1) {
        if (scaleMode == "discover") {
          image(
            finalImg,
            -offScreenMargin / 2,
            -offScreenMargin / 2
          );
        } else {
          image(
            finalImg,
            -offScreenMargin * windowScale / 2,
            -offScreenMargin * windowScale / 2
          );
        }
      } else {
        if (scaleMode == "discover") {
          image(
            finalImg,
            -offScreenMargin * scaleAdjust / 2,
            -offScreenMargin * scaleAdjust / 2,
            finalImg.width * scaleAdjust,
            finalImg.height * scaleAdjust
          );
        } else {
          image(
            finalImg,
            -offScreenMargin * windowScale / 2,
            -offScreenMargin * windowScale / 2,
            finalImg.width,
            finalImg.height
          );
        }
      }


      if (framesSinceDoneEroding == 3) {
        if (saveMode) {
          print("saving");
          save(fxhash + ".png");
          nSaved++;
          if (nSaved < nToSave) {
            resetfxHash();
            settingUp = true;
            eroding = false;
          } else {
            noLoop();
          }
        }
        if (!dynamicLighting) {//windowScale >= 0.5) {
          noLoop();
        }
      }
    }
  }
}


window.$fxhashFeatures = {
  "Terrain Profile": "classified",
  "Obstacle Depth": "classified",
  "Spectral Range": "classified",
  "Ground Sample Distance": (fxrand()*100).toFixed(1),
  "Aging": "classified",
  "Occupants": "highly classified",
};