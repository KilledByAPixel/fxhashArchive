// 
// Clew, created by abstractment
// Collide functions are a modified version from https://github.com/bmoren/p5.collide2D
// Version v0; January 2022
// 
let result, hasher;
let pixelDens;
let saveON = 1;
let screenSizeBased = 0;
let lockALL = 0; 
let paused = false;
//------------------
let increaser = 0.05;
let fillTrans_Alpha = 0.15;
let size;
let forwardON = 1;
let iterations = 10; 
let paperBreak = 0.05; 
let paperAlpha2 = 0.2; 
let windowCenterX, windowCenterY;
let paperAlphaReduction = 0.005;
let pc1A = [];
let a;
let pc11A = [];
let c11 = [];
let pc12A = [];
let pc2A = [];
let pc3A = [];
let bodyColor = [];
let noiseLod = -1;
let noiseFall = 0.75;
// let noiseFall = 0.49;
let symmetryStyle, rSymmetry;
let pc4A = [];
let iWorm, innerWorm;
let splitStyle;
let hit;
let colorChange;
let edges, edgeMarker;
let fillDark = [];
let fillLight = [];
let fillColorsA = [];
let c2_9 = [];
let strokeColorsA = [];
let bigSurvive = 0;
let finalStroke;
let rNumMax, rBigSurvive, rNumWorms, rShape, rDirection, rEdges2, rSplitStyle, rNoise, rEdges, rbackground, rFillTranslucent2, rSymmetrical, rBackgroundDepth, rRotate, rcolorChange, rInnerWorm, rFillColors, r2, rHatched;
let cAdj1, cAdj2, cAdj2a, cAdj3, cAdj4, cAdj5, cAdj6, cAdj7, cAdj8;
let cAdj20, cAdj21;
let finalC1, finalC2, finalC3, finalC4, finalC5, finalC6, finalC7, finalC8;
let backgroundDepth;
let monoHue = [];
let rotateON = 0;
let rotateAmount = 0.0075;
let xStarter, yStarter, xEnder, yEnder;
let noiseON;
let pc11, pc12, pc13,  pc14,  pc15, pc16, pc17, pc18, pc19, pc20, pc21, pc22, pc23;
let pc24l = [];
let pc25d = [];
let unique;
let numWorms = 10;
let colorLength;
let fileName;
let rounder;
let colorCounter = 0;
let rInvert;
let rotateName;
let cTransparencyAlpha;
let paperUp;
let invertON;
let flexer = 0.01;
let flexer0 = 0.01;
let flexer1 = 0.01;
let fIncreaser = 0.02;
let arrayIncreaser = 1;
let sBigS = 0;
let totalRunsEst;
let ffCount = 0;
let paperCount2 = 0;
let colorPlacement;
let flowFieldCounter = 0;
let straightFibers, rMin, rMax, straightFibersRandom;
let paperAlpha, paperType;
let col_Alpha = 1;
let filledStrokeCol_Alpha = 0.25;
let filledCol_Alpha = 1;
let emptyStrokeCol_Alpha = 0.75;
let xStart, yStart, x, y, x2, y2;
let pc, rpc, pc1, pc2, pc3, pc4;
let filled = 0;
let mono = [];
let m;
let black, white, transparent;
let backgroundColor;
let blender = 1;
let symmetricalON;
let otherW = [];
let fields = [];
let counter = 0;
let colorName, paperColor;
let fillC10, c10;
let paperCount = 0;
let frame;
let gc1, gc2, gc3, gc4, gc5, gc6, gc7, gc8, strokeColorUniform, strokeColorUniform2;
let finalStrokeEmpty;
let fillColorName;
let fillTranslucent;
let fillColors;
let loc, angle, dir, vel, d; 
let numMax = 100; //                        
let noiseScale = 100; 
let noiseStrength = 4; 
let flowField = []; 
let i;
let pitchBlack = 0;
let other, overlaps;
let proximity;
let noiseAdj;
let frameSize = 0.05;
let frameSizeW, frameSizeH;
let fillBlack;
let blackStroke;
let fillWhite;
let wormDirection;
let iterate;
let emptyFillColor, emptyFillColor2;
let perspectiv;
let fillColorsALength;
let fAdj1;
let index = 2;
let indexer = 1;
let indexer2 = 2;
let indexer3 = 3;
let centerX;
let centerY;
let eclosionColor;

//Export Setup
let scaleRatio = 1;
let scaleRatio2 = 1;
let exportRatio = 6;
let buffer;
let canvas;
let body;
let w, h;
let t; 
let maxPixels
let s;
let wBase;
// let noiseSeeder = fxrand()*100;
// let randSeeder = fxrand()*100;
let sizeAdjust;
let sizeAdjustAlpha;
// var noiseSeeder;
// var randSeeder;

let a2Paper = {
  width: 3497,
  height: 4946,
};

  document.body.style.backgroundColor = "black";

  windowDimensions = window.innerWidth/window.innerHeight;
  w = a2Paper.width / exportRatio;
  wBase = a2Paper.width / exportRatio;
  h = a2Paper.height / exportRatio;
  paperDimensions = w/h;

  if (windowDimensions > paperDimensions) {
    w = wBase*(1+((window.innerHeight-h)/h));
    scaling = (a2Paper.width/exportRatio)/window.innerWidth;
    h = window.innerHeight;
    maxPixels = (16500/((w+h)/2))-0.5;
  } else if (windowDimensions < paperDimensions) {
    h = h*(1+((window.innerWidth-wBase)/wBase));
    w = window.innerWidth;
    scaling = (a2Paper.height/exportRatio)/window.innerHeight;
    maxPixels = 16500/((w+h)/2);
  }

if(navigator.userAgent.indexOf("HeadlessChrome") > -1) {
    // pixelDens = 1;
  } else {
let chooseQuality = prompt("Please enter a number from 1 (low quality) to 10 (high quality) for your output. During rendering, press spacebar to pause/unpause, R to reload, P to save as a PNG, and J to save as a JPEG. Enjoy.", "2");
let text;
 if (chooseQuality >0) {
    pixelDens = maxPixels*(chooseQuality/10);
}  else if (chooseQuality == null || chooseQuality == "") {
  // pixelDens = 3.5;
} else {
  
}
//  if (chooseQuality == "H" || chooseQuality == "h") {
//     pixelDens = maxPixels;
// } else if (chooseQuality == "L" || chooseQuality == "l") {
//     // pixelDens = maxPixels*0.1;
//     // pixelDens = pixelDens;
// } else if (chooseQuality == "M" || chooseQuality == "m") {
//     pixelDens = maxPixels*0.75;
// }  else if (chooseQuality == null || chooseQuality == "") {
//   pixelDens = 3.5;
// }
  }


function setup() {
// print(maxPixels);
  
let noiseSeeder = fxrand()*1000000000000000000;
let randSeeder = fxrand()*1000000000000000000;
  fileName = "Clew, by abstractment - " + fxhash;
   print(fxhash);
  noiseSeed(noiseSeeder);
  randomSeed(randSeeder);
  noiseAdj = TWO_PI;
   frameRate(60);
   colorMode(HSB, 360, 100, 100, 1.0);
  paperCount = 0;
  wWin = window.innerWidth;
  hWin = window.innerHeight;
  windowDimensions = windowWidth/windowHeight;
  w = a2Paper.width / exportRatio;
  wBase = a2Paper.width / exportRatio;
  h = a2Paper.height / exportRatio;
  s = Math.min(wWin, hWin);
  paperDimensions = w/h;
  widthRatio = w/windowWidth;
  heightRatio = h/windowHeight;
  if(pixelDens !=null ) {
  pixelDensity(pixelDens);
  }

  if (windowDimensions > paperDimensions) {
    w = wBase*(1+((windowHeight-h)/h));
    scaling = (a2Paper.width/exportRatio)/windowWidth;
    h = windowHeight;
  } else if (windowDimensions < paperDimensions) {
    h = h*(1+((windowWidth-wBase)/wBase));
    w = windowWidth;
    scaling = (a2Paper.height/exportRatio)/windowHeight;
  }
  sizeAdjust = w/wBase;
  sizeAdjustAlpha = (1 + sizeAdjust)/2;

  // const rw = (width / (100*sizeAdjust));

  increaser = 0.06*sizeAdjust; 
  // increaser = rw;
  buffer = createGraphics(w, h);
  canvas = createCanvas(w, h);
   windowCenterX = (windowWidth - w) / 2;
   windowCenterY = (windowHeight - h) / 2;
  centerX = width / 2;
  centerY = height / 2;
  frameSize = frameSize;
  frameSizeW = ((width+height)/2) * frameSize;
  frameSizeH = ((width+height)/2) * frameSize;
  canvas.position( max(0, windowCenterX), max(0, windowCenterY));
    iterations = 540;
  
  //=======
  let trash = random();
  let trash2 = randomGaussian();
  let trash3 = random(2,6);
  let trash4 = random();
  //=======
  
  rBigSurvive = random();
  
  if (rBigSurvive <=0.2) {
    bigSurvive ="Big";
  } else if (rBigSurvive <= 0.4) {
    bigSurvive = "Small";
  } else if (rBigSurvive <= 1) {
    bigSurvive = "Random";
  }

    rNumWorms = random(0, 1);
  
  if (rNumWorms <= 0.25) {
    wormEvent = "Gigaclew";
    numWorms = 200;
  } else if (rNumWorms <= 0.95) {
    numWorms = 140;
    wormEvent = "Megaclew";
  } else if (rNumWorms <= 0.995) {
    numWorms = 80;
    wormEvent = "Microclew";
  } else if (rNumWorms <= 1) {
    numWorms = 320;
    wormEvent = "Yottaclew";  
  } 

  cAdj2 = random(0.8, 0.99);
  cAdj3 = random(0.6, 0.79);
  cAdj4 = random(0.3, 0.59);
  cAdj5 = random(0, 0.29);
  
  let t = random(187,225);

    rShape = random(0, 1);

  if (rShape <= 0.25) {
    shape = "Square";
  } else if (rShape <= 0.75) {
    shape = "Circle";
  } else if (rShape <= 1) {
    shape = "Squircle";
  }

    rDirection = random(0, 1);
  
  if (rDirection < 0.95) {
    wormDirection = "Forward";
    sBigS = 0;
  } else if (rDirection < 1) {
    wormDirection = "Forward & Back";
    sBigS = 1;
  }
  forwardON = 1;

  noiseON = "None";
  perspectiv = "Direct";

    rSplitStyle = random(0, 1);

  if (rSplitStyle <= 0.1) {
    frame = "Background/Foreground";
      rEdges2 = random(0, 1);
    if (rEdges2 <= 0.5) {
      edges = "Clean";
    } else if (rEdges2 <= 1) {
      edges = "Rough";
    }
  } else if (rSplitStyle <= 0.3) {
    frame = "Foreground";
    edges = "N/A";

  } else if (rSplitStyle <= 0.35) {
    frame = "Background";
    let rEdges = random(0, 1);

      if (rEdges <= 0.5) {
        edges = "Clean";
      } else if (rEdges <= 1) {
        edges = "Rough";
      }      


  } else if (rSplitStyle <= 1) {
    frame = "None";
    edges = "N/A";

      rNoise = random(0, 1);

    if (rNoise <= 0.01) {
      // direction left
      noiseStrength = 2;
      noiseScale = 8;
      noiseAdj = -0.5
      noiseLod = 4
      noiseFall = 0.05;
      noiseON = 1;
      sBigS = 0;
      wormDirection = "Forward";
      increaser = increaser/2;
      perspectiv = "Indirect";
    } else if (rNoise <= 0.02) {
      // direction up
      noiseStrength = 2.6;
      noiseScale = 8;
      noiseAdj = 0.99;
      noiseLod = 4
      noiseFall = 0.90;
      noiseON = 2;
      sBigS = 0;
      wormDirection = "Forward";
      increaser = increaser / 2;
      perspectiv = "Indirect";
    } else if (rNoise <= 0.03) {                       
      // direction down
      noiseStrength = 0.93;
      noiseScale = 8;
      noiseAdj = 0.5
      noiseLod = 4
      noiseFall = 0.02;
      noiseON = 3;
      sBigS = 0;
      wormDirection = "Forward";
      increaser = increaser / 2;
      perspectiv = "Indirect";
    } else if (rNoise <= 0.04) {
      // direction right
      noiseStrength = 4;
      noiseScale = 10;
      noiseAdj = -0.05
      noiseLod = 4
      noiseFall = 0.32;
      noiseON = 4;
      sBigS = 0;
      wormDirection = "Forward";
      increaser = increaser / 2;
      perspectiv = "Indirect";
    // } else if (rNoise <= 0.045) {
    //   noiseScale = 0;
    //   noiseAdj = 0.0001
    //   noiseStrength = 1000
    //   noiseLod = 2
    //   noiseFall = 0.9;
    //   noiseON = 0;
    //   numWorms = numWorms * 1.25;
    //   sBigS = 0;
    //   wormDirection = "Forward";
    //   sBiS = 0;
    //   perspectiv = "Very Direct";
    }
  }

    rHatched = random(0, 1);
  
  if (rHatched <= 0.5) {
    hatchedON = 1;
    reproduction = "Eclosion";
  } else if (rHatched <= 1) {
    hatchedON = 0;
    reproduction = "Germination";
  }

    r2 = random(0, 1);
  
  setColors();
  cAdj2 = random(0.85, 0.99);
  cAdj3 = random(0.7, 0.84);
  cAdj4 = random(0.55, 0.69);
  cAdj5 = random(0.4, 0.54);
  cAdj6 = random(0.25, 0.39);
  cAdj7 = random(0.05, 0.24);
  let cAdjA = [cAdj2, cAdj3, cAdj4, cAdj5, cAdj6, cAdj7];
  
    rFillColors = random(0, 1);

  if (rFillColors < 0.50) {
    fillColors = fillBlack;
    fillColorName = "Translucent";
    filled = 0;

    rInnerWorm = random(0, 1);
    
    if (rInnerWorm <= 0.2) {
      innerWorm = "Translucent, External";
      iWorm = cAdj3;
    } else if (rInnerWorm <= 0.4) {
      innerWorm = "Translucent, Middle";
      iWorm = cAdj5;
    } else if (rInnerWorm <= 0.6) {
      innerWorm = "Translucent, Internal";
      iWorm = cAdj7;
    } else if (rInnerWorm <= 0.8) {
      innerWorm = "None";
    } else if (rInnerWorm <= 1) {
      innerWorm = "Dense";
      iWorm = cAdj5;
      filled = 0;
      fillColors = fillBlack;
      fillColorName = "Translucent";

    }}
     else if (rFillColors <= 0.55) {
      fillColorName = "Varied";
      let cAdj8 = random(cAdjA);
      innerWorm = "None";
    } 
    else if (rFillColors <= 1) {
    filled = 1;
    innerWorm = "N/A";
    fillColors = fillBlack;
    fillColorName = "Dense";

  }
  // r2 = 0.01
  chooseColor(r2);

  straightFibersRandom = random(0, 1);
  
  if (straightFibersRandom <= 0.1) {
    paperType = "Straight"; // set
  } else if (straightFibersRandom <= 0.2) {
    paperType = "Curved"; // set
    edges = "Rough";
  } else if (straightFibersRandom <= 0.35) {
    paperType = "Frothy"; // set
  } else if (straightFibersRandom <= 0.45) {
    paperType = "Linen"; // set
  } else if (straightFibersRandom <= 0.6) {
    paperType = "Confetti"; // set
  } else if (straightFibersRandom <= 0.75) {
    paperType = "Sand"; // set
  } else if (straightFibersRandom <= 0.85 && colorName != "Black && White") {
    pitchBlack = 1;
    paperType = "Flat Canvas";
    edges = "N/A";
    if (frame == "Foreground" || frame == "Background/Foreground") {
      frame = "Foreground";
    } else {
      frame = "N/A";
    }
   } else if (straightFibersRandom <= 1) {
    paperType = "Fuzz"; // set
} 

    rcolorChange = random(0, 1);

  if (rcolorChange <= 0.65) {
    colorChange = "Diverse";
  } else if (rcolorChange <= 0.75  && colorName != "Black && White") {
    colorChange = "Inside Out";
    wormDirection = "Forward";
    sBigS = 0;
    iterations = 600;

  } else if (rcolorChange <= 0.85) {
    colorChange = "Switch";
  } else if (rcolorChange <= 0.95) {
    colorChange = "Sporadic Chaos";
  } else if (rcolorChange <= 1) {
    colorChange = "Chaos";
  }
  
  if (noiseON<5) {
      colorChange = "Diverse";
  }

    totalRunsEst = numWorms * iterations;
  reproductionStopper = round(totalRunsEst * 0.9);


    rBackgroundDepth = random(0, 1);

  if (rBackgroundDepth <= 0.15) {
    backgroundDepth = "Shallow";
    paperBreak = 0.25;
  } else if (rBackgroundDepth <= 0.75) {
    backgroundDepth = "Medium";
    paperBreak = 0.45;
  } else if (rBackgroundDepth <= 1) {
    backgroundDepth = "Deep";
    paperBreak = 0.65;
  }
  
    if (paperType == "Flat Canvas") {
      backgroundDepth = "N/A";
    }
    
  paperIterations = (iterations * paperBreak) ;

  rRotate = random(0, 1);
  
  if (shape == "Circle") {
    rotateON = 0;
    rotateName = "Off"
  } else if (rRotate <= 0.5) {
    rotateON = 1;
    rotateName = "On"
  } else if (rRotate <= 1) {
    rotateON = 0;
    rotateName = "Off"
  }


    rSymmetrical = random(0, 1);
  
  if (rSymmetrical <= 0.04) {                  // Vertical
    symmetricalON = 1;
    numWorms = numWorms / 2;
    shape = "Circle";
    symmetryStyle = "Vertical";
  } else if (rSymmetrical <= 0.08) {            // Horizontal
    symmetricalON = 2;
    numWorms = numWorms / 2;
    shape = "Circle";
    symmetryStyle = "Horizontal";
  } else if (rSymmetrical <= 0.1) {              // Diagonal
    symmetricalON = 3;
    numWorms = numWorms / 2;
    symmetryStyle = "Diagonal";
  } else if (rSymmetrical <= 1) {                // None
    symmetricalON = 0;
    symmetryStyle = "None";
  }

  let rLeader = random(0,1);

  if (rLeader > 0.0805 && rLeader <=0.085) {
                                                          ////// good
    unique = "#lostNotLost";                        
    noiseLod = 1;
    noiseFall = 0.000001;
    noiseDetail(noiseLod,noiseFall);
    noiseAdj = TWO_PI
    noiseStrength = 4
    noiseScale = 100
    iterations = 540;
    frame = "None";
    noiseON = "None";
    colorChange = "Diverse";
    wormEvent = "Megaclew";
  } else if (rLeader > 0.085 && rLeader <=0.0895) {
                                                              ////// good
    unique = "#clewFoLlOWclew";
    noiseAdj = TWO_PI
    noiseStrength = 4
    noiseScale = 100
    noiseLod = -1;
    noiseFall = 0.001;
    noiseDetail(noiseLod,noiseFall);
    iterations = 540;
    colorChange = "Diverse";
    noiseON = "None";
    frame = "None";
    wormEvent = "Megaclew";
  } else {
    unique = "None";
    noiseDetail(noiseLod,noiseFall);
  } 
  
   totalRunsEst = numWorms * iterations;
  reproductionStopper = round(totalRunsEst * 0.9);
 
  emptyFillColor = random(fillColorsA);
  fillTranslucent = fillBlack;

  if (fillColorName == "Translucent") {
    rFillTranslucent2 = random(0, 1);

    if (rFillTranslucent2 <= 0.8  && colorName != "Black && White") {
      fillTranslucent = fillBlack;
      fillColorName = "Translucent: Black";
      
    } else if (rFillTranslucent2 <= 0.98) {
      fillColorName = "Translucent: Light & Dark";
      fillTranslucent = fillBlack;
    } else if (rFillTranslucent2 <= 1) {
      fillColorName = "Translucent: Palette";
      fillTranslucent = fillBlack;
    }
  }
  randomColorPick(r2);
  canvasColors();

    window.$fxhashFeatures = {
    "Shape": shape,
    "Clew Size": wormEvent,
    "Color Palette": colorName,
    "Color Distribution": colorChange,
    "Body Type": fillColorName,
    "Core": innerWorm,
    "Canvas": canvasColorName,
    "Background": paperType,
    "Background Depth": backgroundDepth,
    "Frame": frame,
    "Edges": edges,
    "Perspective": perspectiv,
    "Direction": wormDirection,
    "Symmetry": symmetryStyle,
    "Reproduction": reproduction,
    "Rotation": rotateName,
    "Survivors": bigSurvive,
    "Special": unique,
}
    print(window.$fxhashFeatures)

  // Flowfield Setup
  for (let i = 0; i < numWorms; i++) {
    var loc = createVector(width, height);
    var angle = 0; // initializing
    var dir = createVector(cos(angle), sin(angle));
    let r = 0;
    ffCount = 0;
    x = random(0, width);
    colorCounter = 0;
    let counter = 0;
    y = random(0, height);
    var speed = random(0.75, 1.75);
    fields[i] = new FlowField(loc, dir, speed, r, x, y, ffCount, i);
  }

  
  background(backgroundColor);
  finalStrokeEmpty = random(fillColorsA);
  colorLength = random(20, 60); 
  paperAlphaReduction = paperAlpha2 / paperIterations;
  
  // fileName = colorName + " - " + paperType + " - " + colorChange + " - " + fxhash;

}

function draw() {

  if (paused == false) {
  if (pitchBlack != 1) {
    if (paperCount <= paperIterations) {
      createPaper();
      paperCount = paperCount + 1;
    }
  }
  if (colorCounter > colorLength) {
    colorCounter = 0;
  }
  colorCounter = colorCounter + 1;

  if (counter < iterations) {
    if (ffCount <= totalRunsEst) {
      for (let f of fields) {
        f.getLocation();
        f.checkLocation();
        if (counter > iterations * 0.25) {    
          f.checkCollision(f);
        }
       f.display(f);
      }
      // noiseScale = max(noiseScale - (0.05), 1);
      // noiseScale = max(noiseScale - numWorms / (1000000), 1);
    }   

  } else {
    noLoop();

      fxpreview();

  }
        counter++;
  }
}


function keyReleased() {
  if (key == 'R' || key == 'r') {
    window.location.reload();
  }  else if (key == 'J' || key == 'j') {
      saveCanvas(fileName, "jpg");
  } else if (key == 'P' || key == 'p') {
      saveCanvas(fileName, "png");
  } else if (key == ' ') {
    paused = !paused;
  }
}

function windowResized() {
  // resizeCanvas(w, h);
  const w = windowWidth * 0.5
  resizeCanvas(w, w * 1.414)
  canvas.position( max(0, windowCenterX), max(0, windowCenterY));
    window.location.reload();
  // noiseSeed(noiseSeeder);
  // randomSeed(randSeeder);
}

