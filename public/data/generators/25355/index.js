// CANVAS
let DS = 1000;
let WIDTH;
let HEIGHT;
let ARS;
let AR_INDEX = 0;
let AR;
let M = 1;

let seed;

// GRAIN
let mainCanvas;
let grainBuffer;
let grainShader;

// SETTINGS
let highRes = false;
let disableGrain = false;

// VARIABLES
let scene;
let colors;
let skyStyle;
let borderWidth;
let duneType;
let duneShading;
let dunes;
let suns;
let monolithPosition;
let monoliths;
let mirror;
let outline;
let renderStyle;
let sunType;
let namedPalette;

function setup() {
  p5.disableFriendlyErrors = true;

  // ***********************
  // ******* CANVAS ********
  // ***********************
  ARS = [[1, 2]];
  AR = ARS[AR_INDEX % ARS.length];
  let whMult = min(windowWidth / AR[0], windowHeight / AR[1]);
  // let whMult = 1000;
  WIDTH = whMult * AR[0];
  HEIGHT = whMult * AR[1];
  mainCanvas = createCanvas(WIDTH, HEIGHT);
  DIM = Math.min(WIDTH, HEIGHT);
  M = DIM / DS;

  pixelDensity(highRes ? (disableGrain ? 8 : 4) : 2);

  grainBuffer = createGraphics(WIDTH, HEIGHT, WEBGL);
  // grainBuffer.pixelDensity(highRes ? 8 : 2);
  grainShader = grainBuffer.createShader(vert, frag);

  // Get seed
  seed = seed || ~~(fxrand() * 100000000);
  // seed = 90355327

  console.log({ seed });
  noiseSeed(seed);
  randomSeed(seed);

  colorMode(HSL, 360, 100, 100, 1);

  colors = {};

  let paletteRn = random();
  // paletteRn=0.71

  if (paletteRn < 0.05) {
    namedPalette = "Mui Ne";
    scene = "Day";
    colors.border = color("#f7f6ed");
    colors.background = color("#03809e");
    colors.monolith = color("#444");
    colors.left = color("#f4dab5");
    colors.right = color("#fefaef");
    colors.shadow = color("#888888");
    colors.sun = color("#f7f6ed");
  } else if (paletteRn < 0.1) {
    namedPalette = "Chebbi";
    scene = "Night";
    colors.border = color("#151718");
    colors.background = color("#7e8a84");
    colors.monolith = color("#333333");
    colors.left = color("#5f4726");
    colors.right = color("#c47c2b");
    colors.shadow = color("#666666");
    colors.sun = color("#eFeCd5");
  } else if (paletteRn < 0.15) {
    namedPalette = "Huacachina";
    scene = "Dusk";
    colors.border = color("#f7f6ed");
    colors.background = color("#74b7b2");
    colors.monolith = color("#555555");
    colors.left = color("#b17d71");
    colors.right = color("#ffce84");
    colors.shadow = color("#e77972");
    colors.sun = color("#eFeCd5");
  } else if (paletteRn < 0.2) {
    namedPalette = "Utah";
    scene = "Day";
    colors.border = color("#f7f6ed");
    colors.background = color("#00aea5");
    colors.monolith = color("#555555");
    colors.left = color("#ffbbd7");
    colors.right = color("#e1000e");
    colors.shadow = color("#777777");
    colors.sun = color("#ffffff");
  } else if (paletteRn < 0.25) {
    namedPalette = "Socorro";
    scene = "Night";
    colors.border = color("#151718");
    colors.background = color("#95242a");
    colors.monolith = color("#333333");
    colors.left = color("#173551");
    colors.right = color("#b00957");
    colors.shadow = color("#666666");
    colors.sun = color("#eFeCd5");
  } else if (paletteRn < 0.3) {
    namedPalette = "Seven Sisters";
    scene = "Day";
    colors.border = color("#f7f6ed");
    colors.background = color("#5c9ead");
    colors.monolith = color("#444444");
    colors.left = color("#fffffb");
    colors.right = color("#9eb25d");
    colors.shadow = color("#777777");
    colors.sun = color("#f7f6ed");
  } else if (paletteRn < 0.35) {
    namedPalette = "Badain Jaran";
    scene = "Day";
    colors.border = color("#f7f6ed");
    colors.background = color("#d9e4dd");
    colors.monolith = color("#555555");
    colors.left = color("#4982cf");
    colors.right = color("#ffae3b");
    colors.shadow = color("#f984ca");
    colors.sun = color("#ffffff");
  } else if (paletteRn < 0.4) {
    namedPalette = "Planum Boreum";
    scene = "Night";
    colors.border = color("#151718");
    colors.background = color("#596f7c");
    colors.monolith = color("#333333");
    colors.right = color("#01555f");
    colors.left = color("#2a363b");
    colors.shadow = color("#497c90");
    colors.sun = color("#fff");
  } else if (paletteRn < 0.45) {
    namedPalette = "Jakku";
    scene = "Day";
    colors.border = color("#f7f6ed");
    colors.background = color("#a7cecb");
    colors.monolith = color("#444444");
    colors.left = color("#ffd9da");
    colors.right = color("#8499b1");
    colors.shadow = color("#7f7876");
    colors.sun = color("#f7f6ed");
  } else if (paletteRn < 0.5) {
    namedPalette = "Karapınar";
    scene = "Day";
    colors.border = color("#f7f6ed");
    colors.background = color("#8cbcb9");
    colors.monolith = color("#444444");
    colors.left = color("#3f3f37");
    colors.right = color("#ee7674");
    colors.shadow = color("#9395d3");
    colors.sun = color("#f7f6ed");
  } else if (paletteRn < 0.55) {
    namedPalette = "Kalahari";
    scene = "Day";
    colors.border = color("#f7f6ed");
    colors.background = color("#c7ccb9");
    colors.monolith = color("#444444");
    colors.left = color("#f2cd60");
    colors.right = color("#ee2e31");
    colors.shadow = color("#b5d2cb");
    colors.sun = color("#fffef7");
  } else if (paletteRn < 0.6) {
    namedPalette = "Alamogordo";
    scene = "Day";
    colors.border = color("#f7f6ed");
    colors.background = color("#f18701");
    colors.monolith = color("#444444");
    colors.left = color("#eef5db");
    colors.right = color("#448fa3");
    colors.shadow = color("#267163");
    colors.sun = color("#f7f6ed");
  } else if (paletteRn < 0.65) {
    namedPalette = "Patara";
    scene = "Day";
    colors.border = color("#f7f6ed");
    colors.background = color("#7ea2aa");
    colors.monolith = color("#444444");
    colors.left = color("#723d46");
    colors.right = color("#e2de84");
    colors.shadow = color("#a5a3a6");
    colors.sun = color("#f7f6ed");
  } else if (paletteRn < 0.7) {
    namedPalette = "Herschel";
    scene = "Night";
    colors.border = color("#151718");
    colors.background = color("#297373");
    colors.monolith = color("#444444");
    colors.left = color("#433e0e");
    colors.right = color("#bf211e");
    colors.shadow = color("#3daab9");
    colors.sun = color("#f7f6ed");
  } else if (paletteRn < 0.75) {
    namedPalette = "Issaouane";
    scene = "Night";
    colors.border = color("#151718");
    colors.background = color("#7d7c84");
    colors.monolith = color("#333333");
    colors.left = color("#e2e8dd");
    colors.right = color("#788585");
    colors.shadow = color("#a98580");
    colors.sun = color("#eFeCd5");
  } else if (paletteRn < 0.8) {
    namedPalette = "Chech";
    scene = "Day";
    colors.border = color("#f7f6ed");
    colors.background = color("#bac7be");
    colors.monolith = color("#444444");
    colors.right = color("#ff331f");
    colors.left = color("#635c47");
    colors.shadow = color("#94a89a");
    colors.sun = color("#f7f6ed");
  } else if (paletteRn < 0.85) {
    namedPalette = "Badiya";
    scene = "Day";
    colors.border = color("#f7f6ed");
    colors.background = color("#c8ab83");
    colors.monolith = color("#444444");
    colors.left = color("#e85d75");
    colors.right = color("#e3c5bb");
    colors.shadow = color("#dcbdd2");
    colors.sun = color("#f7f6ed");
  } else if (paletteRn < 0.9) {
    namedPalette = "Taklamakan";
    scene = "Night";
    colors.border = color("#151718");
    colors.background = color("#4e4d5c");
    colors.monolith = color("#333333");
    colors.left = color("#e9b44c");
    colors.right = color("#ebacd2");
    colors.shadow = color("#717d9a");
    colors.sun = color("#eFeCd5");
  } else if (paletteRn < 0.95) {
    namedPalette = "Namib";
    scene = "Night";
    colors.border = color("#151718");
    colors.background = color("#2ec4b6");
    colors.monolith = color("#444444");
    colors.left = color("#5c3538");
    colors.right = color("#f9dc5c");
    colors.shadow = color("#914415");
    colors.sun = color("#eFeCd5");
  } else {
    namedPalette = "Rub' al Khali";
    scene = "Night";
    colors.border = color("#151718");
    colors.background = color("#bc412b");
    colors.monolith = color("#333333");
    colors.left = color("#f5e9e2");
    colors.right = color("#3f826d");
    colors.shadow = color("#a6a8ce");
    colors.sun = color("#eFeCd5");
  }

  let whiteMonolith = false;
  if (random() < 0.15) {
    colors.monolith = scene == "Night" ? "#cEcBd0" : "#eEeBf0";
    whiteMonolith = true;
  }

  let alternateSun = false;
  if (random() < 0.5) {
    colors.sun = color(scene == "Night" ? "#e85d75" : "#FEC12A");
    alternateSun = true;
  }

  colorMode(RGB);
  colors.sun = lerpColor(color(colors.sun), colors.right, random(0.025, 0.05));
  colors.border = lerpColor(color(colors.border), colors.background, 0.1);
  colorMode(HSL, 360, 100, 100, 1);

  renderStyle = weighted_random(["Flat", "Gradient"], [1, 6]);
  renderStyle = "Gradient";

  skyStyle = weighted_random(["Full Fade", "Half Fade"], [2, 2]);

  if (renderStyle == "Flat") skyStyle = "Flat";

  sunType = "Normal";
  if (scene == "Night") {
    if (random() < 0.15) sunType = "Crescent";
  }

  // BORDERS
  borderWidth = 50;

  duneType = weighted_random(
    ["Crest", "Smooth", "Sharp", "Wave"],
    [5, 5, 1, 5]
  );
  // duneType = "Crest";

  duneShading = weighted_random(
    ["Diagonal", "Horizontal", "Vertical"],
    [1, 1, 1]
  );

  if (renderStyle == "Flat") duneShading = "Flat";

  let monolithType = weighted_random(["Arch", "Solo", "Pair"], [1, 4, 3]);

  // monolithType = "Arch"

  outline = weighted_random([0, 12], [3, 2]);

  outline = 0;

  let duneHeightOption;
  duneHeight = random(0.1, 0.9);

  duneHeightOption =
    duneHeight < 0.26
      ? 0
      : duneHeight < 0.42
      ? 1
      : duneHeight < 0.58
      ? 2
      : duneHeight < 0.74
      ? 3
      : 4;

  dunes = [];
  monoliths = [];

  buildDune(duneType);

  buildMonoliths(monolithType);

  // for (let sun of suns) {
  //   sun.y-=0.3*DS*AR[1]
  //   sun.x-=0.2*DS*AR[0]
  // }

  // Sun tidy up
  for (let sun of suns) {
    // Move sun if it is hitting edge of canvas
    while (sun.x - sun.r < borderWidth + 50) {
      sun.x++;
    }
    while (sun.y - sun.r < borderWidth + 50) {
      sun.y++;
    }

    // Move sun up if too close to peak
    while (
      abs(dist(sun.x, sun.y, dunes[0].peak.x, dunes[0].peak.y) - sun.r) < 20 ||
      abs(
        dist(sun.x, sun.y, monoliths[0].x, monoliths[0].y - monoliths[0].h) -
          sun.r
      ) < 20 ||
      sun.y + 0.5 * sun.r + 50 > dunes[0].peak.y
    ) {
      sun.y--;
      // console.log("shift");
    }
  }

  mirror = random() < 0.5;
  // mirror = false;

  // Metadata
  window.$fxhashFeatures = {
    "Dune Height": [
      "Diminutive",
      "Short",
      "Average",
      "Prominent",
      "Formidable",
    ][duneHeightOption],
    "Dune Style": duneType,
    // Framing: framing,
    // Mirrored: mirror ? "Yes" : "No",
    Monolith: (whiteMonolith ? "White " : "") + monolithType,
    // Outline: outline ? "Yes" : "No",
    Palette: namedPalette,
    // Render: renderStyle,
    // Saturation: ["High", "Medium", "Low"][desatType],
    // Scene:
    //   (alternateSun ? "Alternate " : "") +
    //   scene +
    //   (sunType == "Crescent" ? " (Crescent)" : ""),
    // Sky: skyStyle,
  };

  console.table(window.$fxhashFeatures);
}

function draw() {
  clear();
  noStroke();

  if (mirror && disableGrain) {
    translate(width, 0);
    scale(-1, 1);
  }

  // BG
  drawBG();

  // Sun
  drawSuns();

  // Dunes
  for (let dune of dunes) drawDune(dune);

  // Monolith/s
  for (let monolith of monoliths) drawMonolith(monolith);

  // Grain
  if (!disableGrain) applyGrain();

  // Border
  drawBorder();

  // Preview
  fxpreview();
  noLoop();

  // save(seed + ".png");
  // setTimeout(() => {
  //   location.reload();
  // }, 2000);
}

buildDune = (shapeType) => {
  if (shapeType == "Crest") {
    buildDuneCrest();
  } else if (shapeType == "Ledge") {
    buildDuneLedge();
  } else if (shapeType == "Smooth") {
    buildDuneSmooth();
  } else if (shapeType == "Sharp") {
    buildDuneSharp();
  } else if (shapeType == "Wave") {
    buildDuneWave();
  }
};

buildDuneCrest = () => {
  let peakHeight = (0.25 + duneHeight * 0.45) * DS * AR[1];

  let peakOffset = random(-0.1, -0.05) * DS * AR[0];

  let leftHeight = peakHeight - random(0.125, 0.15) * DS * AR[1];

  let rightHeight = peakHeight - random(100, 200);

  // let centerEndX = 275;
  let centerEndX = borderWidth;

  let peak = {
    x: (DS * AR[0]) / 2 + peakOffset,
    y: DS * AR[1] - borderWidth - peakHeight,
  };

  let leftStartY = DS * AR[1] - borderWidth - leftHeight;
  let leftCurve = {
    x1: borderWidth,
    y1: leftStartY,
    x2: borderWidth + (peak.x - borderWidth) / 4,
    y2: leftStartY + (peak.y - leftStartY) / 4,
    x3: borderWidth + (peak.x - borderWidth) / 2,
    y3: leftStartY + (peak.y - leftStartY) / 2,
    x4: borderWidth + (3 * (peak.x - borderWidth)) / 4,
    y4: leftStartY + (3 * (peak.y - leftStartY)) / 4,
    x5: peak.x,
    y5: peak.y,
  };

  let rightEndY = DS * AR[1] - borderWidth - rightHeight;
  // let rightEndY = leftStartY - random(0.025,0.075)*DS*AR[1];
  let rightCurve = {
    x1: peak.x,
    y1: peak.y,
    x2: peak.x + (DS * AR[0] - borderWidth - peak.x) / 4,
    y2: peak.y + (rightEndY - peak.y) / 4,
    x3: peak.x + (DS * AR[0] - borderWidth - peak.x) / 2,
    y3: peak.y + (rightEndY - peak.y) / 2,
    x4: peak.x + (3 * (DS * AR[0] - borderWidth - peak.x)) / 4,
    y4: peak.y + (3 * (rightEndY - peak.y)) / 4,
    x5: DS * AR[0] - borderWidth,
    y5: rightEndY,
  };

  let centerCurve = {
    x1: peak.x,
    y1: peak.y,
    x2: peak.x + (centerEndX - peak.x) / 4,
    y2: peak.y + (DS * AR[1] - borderWidth - peak.y) / 4,
    x3: peak.x + (centerEndX - peak.x) / 2,
    y3: peak.y + (DS * AR[1] - borderWidth - peak.y) / 2,
    x4: peak.x + (3 * (centerEndX - peak.x)) / 4,
    y4: peak.y + (3 * (DS * AR[1] - borderWidth - peak.y)) / 4,
    x5: centerEndX,
    y5: DS * AR[1] - borderWidth,
  };

  // if (shapeType == "Curved") {
  //   // Shift left curve
  //   leftCurve.y2 += random(-20, 40);
  //   leftCurve.x4 += random(-20, 40);

  //   // Shift right curve
  //   rightCurve.y2 -= random(-10, 30);
  //   rightCurve.x4 += random(-10, 30);

  //   // Shift center curve
  //   centerCurve.x2 += random(100, 250);
  //   centerCurve.y2 += random(150, 250);
  //   centerCurve.x4 += random(50, 150);
  //   centerCurve.y4 -= random(25, 75);
  // }

  // Shift left curve
  leftCurve.y2 += random(0, 40);
  leftCurve.x4 += random(0, 40);

  // Shift right curve
  rightCurve.y2 += random([12.5, 25, 37.5]);
  rightCurve.x4 += random([12.5, 25, 37.5]);

  // Shift center curve
  centerCurve.x2 += random(400, 550);
  centerCurve.y2 += random(550, 650);
  centerCurve.x4 -= random(350, 450);
  centerCurve.y4 -= random(225, 375);

  centerCurve.y5 -= random(0.2) * peakHeight;

  dunes.push({
    duneType,
    peak,
    leftCurve,
    rightCurve,
    centerCurve,
  });

  // SUN POSN/SIZE
  suns = [
    {
      x: (DS * AR[0]) / 2 - random(0.1, 0.175) * DS * AR[0] + peakOffset,
      y:
        DS * AR[1] -
        borderWidth -
        random(0.2, 0.5) * DS * AR[1] -
        peakHeight +
        200,
      r:
        random(0.15, 0.275) *
        // 0.35*
        DS *
        min(1, max(0.65, dunes[0].peak.y / (DS * AR[1] * 0.75))),
    },
  ];

  // MONOLITH BASE
  monolithPosition = {
    x: (DS * AR[0]) / 2 + 80 + peakOffset,
    y: DS * AR[1] - borderWidth - peakHeight + 80,
  };
};

buildDuneLedge = () => {
  let peakHeight = (0.3 + duneHeight * 0.4) * DS * AR[1];

  let peakOffset = random(-0.1, -0.05) * DS * AR[0]; // needs to be non-negative (moves peak left)

  let leftHeight = peakHeight - random(0.125, 0.15) * DS * AR[1];

  let rightHeight = peakHeight - random(100, 200);

  // let centerEndX = 275;
  let centerEndX = borderWidth;

  let peak = {
    x: (DS * AR[0]) / 2 + peakOffset,
    y: DS * AR[1] - borderWidth - peakHeight,
  };

  let leftStartY = DS * AR[1] - borderWidth - leftHeight;
  let leftCurve = {
    x1: borderWidth,
    y1: leftStartY,
    x2: borderWidth + (peak.x - borderWidth) / 4,
    y2: leftStartY + (peak.y - leftStartY) / 4,
    x3: borderWidth + (peak.x - borderWidth) / 2,
    y3: leftStartY + (peak.y - leftStartY) / 2,
    x4: borderWidth + (3 * (peak.x - borderWidth)) / 4,
    y4: leftStartY + (3 * (peak.y - leftStartY)) / 4,
    x5: peak.x,
    y5: peak.y,
  };

  let rightEndY = DS * AR[1] - borderWidth - rightHeight;
  // let rightEndY = leftStartY - random(0.025,0.075)*DS*AR[1];
  let rightCurve = {
    x1: peak.x,
    y1: peak.y,
    x2: peak.x + (DS * AR[0] - borderWidth - peak.x) / 4,
    y2: peak.y + (rightEndY - peak.y) / 4,
    x3: peak.x + (DS * AR[0] - borderWidth - peak.x) / 2,
    y3: peak.y + (rightEndY - peak.y) / 2,
    x4: peak.x + (3 * (DS * AR[0] - borderWidth - peak.x)) / 4,
    y4: peak.y + (3 * (rightEndY - peak.y)) / 4,
    x5: DS * AR[0] - borderWidth,
    y5: rightEndY,
  };

  let centerCurve = {
    x1: peak.x,
    y1: peak.y,
    x2: peak.x + (centerEndX - peak.x) / 4,
    y2: peak.y + (DS * AR[1] - borderWidth - peak.y) / 4,
    x3: peak.x + (centerEndX - peak.x) / 2,
    y3: peak.y + (DS * AR[1] - borderWidth - peak.y) / 2,
    x4: peak.x + (3 * (centerEndX - peak.x)) / 4,
    y4: peak.y + (3 * (DS * AR[1] - borderWidth - peak.y)) / 4,
    x5: centerEndX,
    y5: DS * AR[1] - borderWidth,
  };

  // if (shapeType == "Curved") {
  //   // Shift left curve
  //   leftCurve.y2 += random(-20, 40);
  //   leftCurve.x4 += random(-20, 40);

  //   // Shift right curve
  //   rightCurve.y2 -= random(-10, 30);
  //   rightCurve.x4 += random(-10, 30);

  //   // Shift center curve
  //   centerCurve.x2 += random(100, 250);
  //   centerCurve.y2 += random(150, 250);
  //   centerCurve.x4 += random(50, 150);
  //   centerCurve.y4 -= random(25, 75);
  // }

  // Shift left curve
  leftCurve.y2 += random(0, 40);
  leftCurve.x4 += random(0, 40);

  // Shift right curve
  rightCurve.y2 += random([12.5, 25, 37.5]);
  rightCurve.x4 += random([12.5, 25, 37.5]);

  // Shift center curve
  // centerCurve.x2 += random(400, 550);
  // centerCurve.y2 += random(550, 650);
  // centerCurve.x4 -= random(350, 450);
  // centerCurve.y4 -= random(225, 375);

  centerCurve.x2 = leftCurve.x2 + random(100, 150);
  centerCurve.y2 += random(250, 350);
  centerCurve.y3 += random(0.1) * peakHeight;
  centerCurve.x4 = leftCurve.x4 + random(250, 450);
  centerCurve.y4 = leftCurve.y4 - random(-50, 150);
  centerCurve.y5 -= random(0.2) * peakHeight;

  dunes.push({
    duneType,
    peak,
    leftCurve,
    rightCurve,
    centerCurve,
  });

  // SUN POSN/SIZE
  suns = [
    {
      x: (DS * AR[0]) / 2 - random(0.1, 0.175) * DS * AR[0] + peakOffset,
      y:
        DS * AR[1] -
        borderWidth -
        random(0.2, 0.5) * DS * AR[1] -
        peakHeight +
        200,
      r:
        random(0.15, 0.275) *
        DS *
        min(1, max(0.65, dunes[0].peak.y / (DS * AR[1] * 0.75))),
    },
  ];

  // MONOLITH BASE
  monolithPosition = {
    x: (DS * AR[0]) / 2 + 50 + peakOffset,
    y: DS * AR[1] - borderWidth - peakHeight + 80,
  };
};

buildDuneSmooth = () => {
  let peakHeight = (0.25 + duneHeight * 0.45) * DS * AR[1];

  let peakOffset = random(-0.15, -0.05) * DS * AR[0]; // needs to be non-negative (moves peak left)

  let leftHeight = peakHeight - random(0.1, 0.15) * DS * AR[1];

  let rightHeight = peakHeight - random(100, 200);

  // let centerEndX = 275;
  let centerEndX = (DS * AR[0]) / 2 - random(175, 275);

  let peak = {
    x: (DS * AR[0]) / 2 + peakOffset,
    y: DS * AR[1] - borderWidth - peakHeight,
  };

  let leftStartY = DS * AR[1] - borderWidth - leftHeight;
  let leftCurve = {
    x1: borderWidth,
    y1: leftStartY,
    x2: borderWidth + (peak.x - borderWidth) / 4,
    y2: leftStartY + (peak.y - leftStartY) / 4,
    x3: borderWidth + (peak.x - borderWidth) / 2,
    y3: leftStartY + (peak.y - leftStartY) / 2,
    x4: borderWidth + (3 * (peak.x - borderWidth)) / 4,
    y4: leftStartY + (3 * (peak.y - leftStartY)) / 4,
    x5: peak.x,
    y5: peak.y,
  };

  let rightEndY = DS * AR[1] - borderWidth - rightHeight;
  // let rightEndY = leftStartY - random(0.025,0.075)*DS*AR[1];
  let rightCurve = {
    x1: peak.x,
    y1: peak.y,
    x2: peak.x + (DS * AR[0] - borderWidth - peak.x) / 4,
    y2: peak.y + (rightEndY - peak.y) / 4,
    x3: peak.x + (DS * AR[0] - borderWidth - peak.x) / 2,
    y3: peak.y + (rightEndY - peak.y) / 2,
    x4: peak.x + (3 * (DS * AR[0] - borderWidth - peak.x)) / 4,
    y4: peak.y + (3 * (rightEndY - peak.y)) / 4,
    x5: DS * AR[0] - borderWidth,
    y5: rightEndY,
  };

  let centerCurve = {
    x1: peak.x,
    y1: peak.y,
    x2: peak.x + (centerEndX - peak.x) / 4,
    y2: peak.y + (DS * AR[1] - borderWidth - peak.y) / 4,
    x3: peak.x + (centerEndX - peak.x) / 2,
    y3: peak.y + (DS * AR[1] - borderWidth - peak.y) / 2,
    x4: peak.x + (3 * (centerEndX - peak.x)) / 4,
    y4: peak.y + (3 * (DS * AR[1] - borderWidth - peak.y)) / 4,
    x5: centerEndX,
    y5: DS * AR[1] - borderWidth,
  };

  // Shift left curve
  leftCurve.y2 += random([-25, -12.5, 12.5, 25, 37.5, 50]);
  leftCurve.x4 += random([-25, -12.5, 12.5, 25, 37.5, 50]);

  // Shift right curve
  rightCurve.y2 -= random([-12.5, 12.5, 25, 37.5, 50]);
  rightCurve.x4 += random([-12.5, 12.5, 25, 37.5, 50]);

  // Shift center curve
  centerCurve.x2 += random(150, 250);
  centerCurve.y2 += random(150, 250);
  centerCurve.x4 += random(50, 150);
  centerCurve.y4 -= random(25, 75);
  centerCurve.x5 -= random(0.2) * peakHeight;

  dunes.push({
    duneType,
    peak,
    leftCurve,
    rightCurve,
    centerCurve,
  });

  // SUN POSN/SIZE
  suns = [
    {
      x: (DS * AR[0]) / 2 - random(0.05, 0.125) * DS * AR[0] + peakOffset,
      y:
        DS * AR[1] -
        borderWidth -
        random(0.2, 0.5) * DS * AR[1] -
        peakHeight +
        200,
      r:
        random(0.15, 0.275) *
        DS *
        min(1, max(0.65, dunes[0].peak.y / (DS * AR[1] * 0.75))),
    },
  ];

  // MONOLITH BASE
  monolithPosition = {
    x: (DS * AR[0]) / 2 + 80 + peakOffset,
    y: DS * AR[1] - borderWidth - peakHeight + 70,
  };
};

buildDuneSharp = () => {
  let peakHeight = (0.25 + duneHeight * 0.45) * DS * AR[1];

  let peakOffset = random(-0.15, -0.05) * DS * AR[0]; // needs to be non-negative (moves peak left)

  let leftHeight = peakHeight - random(0.1, 0.15) * DS * AR[1];

  let rightHeight = peakHeight - random(100, 200);

  let centerEndX = (DS * AR[0]) / 2 - random(175, 375);

  let peak = {
    x: (DS * AR[0]) / 2 + peakOffset,
    y: DS * AR[1] - borderWidth - peakHeight,
  };

  let leftStartY = DS * AR[1] - borderWidth - leftHeight;
  let leftCurve = {
    x1: borderWidth,
    y1: leftStartY,
    x2: borderWidth + (peak.x - borderWidth) / 4,
    y2: leftStartY + (peak.y - leftStartY) / 4,
    x3: borderWidth + (peak.x - borderWidth) / 2,
    y3: leftStartY + (peak.y - leftStartY) / 2,
    x4: borderWidth + (3 * (peak.x - borderWidth)) / 4,
    y4: leftStartY + (3 * (peak.y - leftStartY)) / 4,
    x5: peak.x,
    y5: peak.y,
  };

  let rightEndY = DS * AR[1] - borderWidth - rightHeight;
  // let rightEndY = leftStartY - random(0.025,0.075)*DS*AR[1];
  let rightCurve = {
    x1: peak.x,
    y1: peak.y,
    x2: peak.x + (DS * AR[0] - borderWidth - peak.x) / 4,
    y2: peak.y + (rightEndY - peak.y) / 4,
    x3: peak.x + (DS * AR[0] - borderWidth - peak.x) / 2,
    y3: peak.y + (rightEndY - peak.y) / 2,
    x4: peak.x + (3 * (DS * AR[0] - borderWidth - peak.x)) / 4,
    y4: peak.y + (3 * (rightEndY - peak.y)) / 4,
    x5: DS * AR[0] - borderWidth,
    y5: rightEndY,
  };

  let centerCurve = {
    x1: peak.x,
    y1: peak.y,
    x2: peak.x + (centerEndX - peak.x) / 4,
    y2: peak.y + (DS * AR[1] - borderWidth - peak.y) / 4,
    x3: peak.x + (centerEndX - peak.x) / 2,
    y3: peak.y + (DS * AR[1] - borderWidth - peak.y) / 2,
    x4: peak.x + (3 * (centerEndX - peak.x)) / 4,
    y4: peak.y + (3 * (DS * AR[1] - borderWidth - peak.y)) / 4,
    x5: centerEndX,
    y5: DS * AR[1] - borderWidth,
  };

  dunes.push({
    duneType,
    peak,
    leftCurve,
    rightCurve,
    centerCurve,
  });

  // SUN POSN/SIZE
  suns = [
    {
      x: (DS * AR[0]) / 2 - random(0.025, 0.125) * DS * AR[0] + peakOffset,
      y:
        DS * AR[1] -
        borderWidth -
        random(0.2, 0.5) * DS * AR[1] -
        peakHeight +
        400,
      r:
        random(0.15, 0.25) *
        DS *
        min(1, max(0.65, dunes[0].peak.y / (DS * AR[1] * 0.75))),
    },
  ];

  // MONOLITH BASE
  monolithPosition = {
    x: (DS * AR[0]) / 2 + 40 + peakOffset,
    y: DS * AR[1] - borderWidth - peakHeight + 70,
  };
};

buildDuneWave = () => {
  let peakHeight = (0.25 + duneHeight * 0.45) * DS * AR[1];

  let peakOffset = random(-0.15, -0.05) * DS * AR[0]; // needs to be non-negative (moves peak left)

  let leftHeight = peakHeight - random(0.075, 0.1) * DS * AR[1];

  let rightHeight = peakHeight - random(100, 150);

  let centerEndX = (DS * AR[0]) / 2 + random(-50, 100);

  let peak = {
    x: (DS * AR[0]) / 2 + peakOffset,
    y: DS * AR[1] - borderWidth - peakHeight,
  };

  let leftStartY = DS * AR[1] - borderWidth - leftHeight;
  let leftCurve = {
    x1: borderWidth,
    y1: leftStartY,
    x2: borderWidth + (peak.x - borderWidth) / 4,
    y2: leftStartY + (peak.y - leftStartY) / 4,
    x3: borderWidth + (peak.x - borderWidth) / 2,
    y3: leftStartY + (peak.y - leftStartY) / 2,
    x4: borderWidth + (3 * (peak.x - borderWidth)) / 4,
    y4: leftStartY + (3 * (peak.y - leftStartY)) / 4,
    x5: peak.x,
    y5: peak.y,
  };

  let rightEndY = DS * AR[1] - borderWidth - rightHeight;
  // let rightEndY = leftStartY - random(0.025,0.075)*DS*AR[1];
  let rightCurve = {
    x1: peak.x,
    y1: peak.y,
    x2: peak.x + (DS * AR[0] - borderWidth - peak.x) / 4,
    y2: peak.y + (rightEndY - peak.y) / 4,
    x3: peak.x + (DS * AR[0] - borderWidth - peak.x) / 2,
    y3: peak.y + (rightEndY - peak.y) / 2,
    x4: peak.x + (3 * (DS * AR[0] - borderWidth - peak.x)) / 4,
    y4: peak.y + (3 * (rightEndY - peak.y)) / 4,
    x5: DS * AR[0] - borderWidth,
    y5: rightEndY,
  };

  let centerCurve = {
    x1: peak.x,
    y1: peak.y,
    x2: peak.x + (centerEndX - peak.x) / 4,
    y2: peak.y + (DS * AR[1] - borderWidth - peak.y) / 4,
    x3: peak.x + (centerEndX - peak.x) / 2,
    y3: peak.y + (DS * AR[1] - borderWidth - peak.y) / 2,
    x4: peak.x + (3 * (centerEndX - peak.x)) / 4,
    y4: peak.y + (3 * (DS * AR[1] - borderWidth - peak.y)) / 4,
    x5: centerEndX,
    y5: DS * AR[1] - borderWidth,
  };

  // Shift left curve
  leftCurve.y2 += random([0, 12.5, 25, 37.5]);
  leftCurve.x4 += random([0, 12.5, 25, 37.5, 50]);

  // Shift right curve
  rightCurve.y2 -= random([-12.5, 12.5, 25, 37.5]);
  rightCurve.x4 += random([-12.5, 12.5, 25, 37.5, 50]);

  // Shift center curve
  centerCurve.x2 += random(100, 200);
  centerCurve.y2 += random(100, 300);
  centerCurve.x4 -= random(450, 650);
  centerCurve.y4 -= random(125, 275);
  centerCurve.x5 -= random(0.2) * peakHeight;

  dunes.push({
    duneType,
    peak,
    leftCurve,
    rightCurve,
    centerCurve,
  });

  // SUN POSN/SIZE
  suns = [
    {
      x: (DS * AR[0]) / 2 - random(0.05, 0.125) * DS * AR[0] + peakOffset,
      y:
        DS * AR[1] -
        borderWidth -
        random(0.2, 0.5) * DS * AR[1] -
        peakHeight +
        400,
      r:
        random(0.15, 0.25) *
        DS *
        min(1, max(0.65, dunes[0].peak.y / (DS * AR[1] * 0.75))),
    },
  ];

  // MONOLITH BASE
  monolithPosition = {
    x: (DS * AR[0]) / 2 + 87 + peakOffset,
    y: DS * AR[1] - borderWidth - peakHeight + 75,
  };
};

buildMonoliths = (monolithType) => {
  // monolithType = "Cube"

  let wmod = random(1.1, 1.5);
  let wmod2 = random(1.1, 1.75);
  let d = random(5, 10);

  if (monolithType == "Arch") {
    monoliths.push({
      type: "Arch",
      shadow: "Smooth",
      x: monolithPosition.x - 10 * wmod,
      y: monolithPosition.y + 5,
      w: 60 + 20 * wmod,
      h: random(100, 140) * sqrt(wmod),
      d,
    });
  } else if (monolithType == "Solo") {
    monoliths.push({
      type: "Regular",
      shadow: "Smooth",
      x: monolithPosition.x - 5 * wmod * wmod2,
      y: monolithPosition.y,
      w: 15 + 20 * wmod * wmod2,
      h: random(100, 150) * sqrt(wmod),
      d,
    });
  } else if (monolithType == "Pair") {
    let h = random(105, 150) * sqrt(wmod);
    let w = 25 + 10 * sqrt(wmod);
    let h1 = (h2 = h);
    h2 = h * random(0.5, 0.8);
    monoliths.push(
      {
        type: "Regular",
        shadow: "Smooth",
        x: monolithPosition.x - 15 + 5 * sqrt(wmod),
        y: monolithPosition.y,
        w,
        h: h1,
        d,
      },
      {
        type: "Regular",
        shadow: "Smooth",
        x: monolithPosition.x + 25 + 15 * sqrt(wmod),
        y: monolithPosition.y,
        w: w,
        h: h2,
        d,
      }
    );
  }
};

drawDune = (dune) => {
  if (duneType == "Crest") drawDuneSmooth(dune);
  else if (duneType == "Ledge") drawDuneSmooth(dune);
  else if (duneType == "Sharp") drawDuneSmooth(dune);
  else if (duneType == "Smooth") drawDuneSmooth(dune);
  else if (duneType == "Wave") drawDuneSmooth(dune);
};

drawDuneSmooth = (dune) => {
  let peak = dune.peak;
  let leftCurve = dune.leftCurve;
  let centerCurve = dune.centerCurve;
  let rightCurve = dune.rightCurve;

  let gradientRange = ~~random(10, 16);

  // OUTER DUNE
  if (duneShading == "Flat") {
    fill(colors.right);
    stroke(colors.right);
    strokeWeight(6 * M);
  } else {
    stroke("#fff");
    strokeWeight(6 * M);
    let gradient = drawingContext.createLinearGradient(
      peak.x * M,
      peak.y * M,
      duneShading == "Vertical" ? peak.x * M : width,
      duneShading == "Horizontal" ? peak.y * M : height
    );
    gradient.addColorStop(0, colorShift(colors.right, 0, 0, gradientRange));
    gradient.addColorStop(1, colorShift(colors.right, 0, 0, -gradientRange));
    drawingContext.fillStyle = gradient;
    drawingContext.strokeStyle = gradient;
  }
  strokeJoin(ROUND);

  beginShape();
  // Lower left corner
  vertex(borderWidth * M, (DS * AR[1] - borderWidth) * M);
  // Move to start of curve
  vertex(leftCurve.x1 * M, leftCurve.y1 * M);
  // Draw curve to peak
  bezierVertex(
    leftCurve.x2 * M,
    leftCurve.y2 * M,
    leftCurve.x4 * M,
    leftCurve.y4 * M,
    leftCurve.x5 * M,
    leftCurve.y5 * M
  );
  // Draw curve to right
  bezierVertex(
    rightCurve.x2 * M,
    rightCurve.y2 * M,
    rightCurve.x4 * M,
    rightCurve.y4 * M,
    rightCurve.x5 * M,
    rightCurve.y5 * M
  );
  // Move to lower right corner
  vertex((DS * AR[0] - borderWidth) * M, (DS * AR[1] - borderWidth) * M);
  endShape(CLOSE);

  // LEFT DUNE
  if (duneShading == "Flat") {
    fill(colors.left);
    stroke(colors.left);
  } else {
    let gradient = drawingContext.createLinearGradient(
      peak.x * M,
      peak.y * M,
      duneShading == "Vertical" ? peak.x * M : 0,
      duneShading == "Horizontal" ? peak.y * M : height
    );
    gradient.addColorStop(0, colors.left);
    gradient.addColorStop(1, colorShift(colors.left, 0, 0, -20));
    drawingContext.fillStyle = gradient;
    drawingContext.strokeStyle = gradient;
  }
  beginShape();
  // Lower left corner
  vertex(borderWidth * M, (DS * AR[1] - borderWidth) * M);
  // Move to start of curve
  vertex(leftCurve.x1 * M, leftCurve.y1 * M + outline * M);
  // Draw curve to peak
  bezierVertex(
    leftCurve.x2 * M,
    leftCurve.y2 * M + outline * M,
    leftCurve.x4 * M,
    leftCurve.y4 * M + outline * M,
    leftCurve.x5 * M,
    leftCurve.y5 * M + outline * M
  );
  // Draw curve to bottom
  bezierVertex(
    centerCurve.x2 * M,
    centerCurve.y2 * M,
    centerCurve.x4 * M,
    centerCurve.y4 * M,
    centerCurve.x5 * M,
    centerCurve.y5 * M
  );
  endShape(CLOSE);

  noStroke();
};

drawMonolith = (monolith) => {
  // Arch
  if (monolith.type == "Arch") {
    drawArchMonolith(monolith);
  } else if (monolith.type == "Regular") {
    drawRegularMonolith(monolith);
  }
};

drawArchMonolith = (monolith) => {
  // How wide are columns (ratio of width)
  let xRatio = random(0.3, 0.375);

  // How far does shadow stretch
  let shadowRatio = 0.65;

  // DRAW SHADOW
  // Done First because it sits under monolith

  // Take center of sun and move up 25% of radius
  // to get vanishing point for shadow
  for (let sun of suns) {
    let shadowStart = {
      x: sun.x,
      y: sun.y + 0.5 * sun.r,
      // y: sun.y,
    };

    let v1a = createVector(
      monolith.x + monolith.d - shadowStart.x,
      monolith.y + monolith.d - shadowStart.y
    );
    let v1b = createVector(
      monolith.x - shadowStart.x,
      monolith.y - shadowStart.y
    );

    let v21a = createVector(
      monolith.x + (1 - xRatio) * monolith.w + monolith.d - shadowStart.x,
      monolith.y + monolith.d - shadowStart.y
    );
    let v21b = createVector(
      monolith.x + (1 - xRatio) * monolith.w - shadowStart.x,
      monolith.y - shadowStart.y
    );

    // Get vector from vanishing point to front edges of monolith
    let v1 = v1a.heading() > v1b.heading() ? v1a : v1b;

    let v12 = createVector(
      monolith.x + xRatio * monolith.w + monolith.d - shadowStart.x,
      monolith.y + monolith.d - shadowStart.y
    );
    let v21 = v21a.heading() > v21b.heading() ? v21a : v21b;
    let v2 = createVector(
      monolith.x + monolith.w + monolith.d - shadowStart.x,
      monolith.y + monolith.d - shadowStart.y
    );

    v1.setHeading(v1.heading() + PI / 128);
    v2.setHeading(v2.heading() - PI / 128);

    // Set vector magnitudes to be 1000
    let mag =
      (sqrt(
        1000 /
          dist(
            monolith.x + monolith.w / 2,
            monolith.y,
            sun.x,
            sun.y + 0.5 * sun.r
          )
      ) *
        500 *
        (monolith.shadowMod || 1) *
        monolith.h) /
      100;
    v1.setMag(mag);
    v12.setMag(mag);
    v21.setMag(mag);
    v2.setMag(mag);

    // Default shadow fill
    colors.shadow.setAlpha(1);
    fill(colors.shadow);

    // Set smooth gradient if needed
    if ((monolith.shadow = "Smooth")) {
      setMonolithShadowFill(
        (monolith.x + monolith.w / 2 + monolith.d) * M,
        (monolith.y + monolith.d) * M,
        ((monolith.x +
          monolith.w +
          monolith.d +
          v2.x +
          (monolith.x + monolith.d + v1.x)) *
          M) /
          2,
        ((monolith.y + monolith.d + v2.y + (monolith.y + monolith.d + v1.y)) *
          M) /
          2,
        0
      );
    }

    // Draw shadow from front of monolith
    blendMode(MULTIPLY);
    beginShape();
    vertex(
      (monolith.x + (v1a.heading() > v1b.heading() ? monolith.d : 0)) * M,
      (monolith.y + (v1a.heading() > v1b.heading() ? monolith.d : 0)) * M
    );
    vertex(
      (monolith.x + xRatio * monolith.w + monolith.d) * M,
      (monolith.y + monolith.d) * M
    );
    vertex(
      (monolith.x + xRatio * monolith.w + monolith.d + v12.x * shadowRatio) * M,
      (monolith.y + monolith.d + v12.y * shadowRatio) * M
    );
    vertex(
      (monolith.x +
        (1 - xRatio) * monolith.w +
        monolith.d +
        v21.x * shadowRatio) *
        M,
      (monolith.y + monolith.d + v21.y * shadowRatio) * M
    );
    vertex(
      (monolith.x +
        (1 - xRatio) * monolith.w +
        (v21a.heading() > v21b.heading() ? monolith.d : 0)) *
        M,
      (monolith.y + (v21a.heading() > v21b.heading() ? monolith.d : 0)) * M
    );
    vertex(
      (monolith.x + monolith.w + monolith.d) * M,
      (monolith.y + monolith.d) * M
    );
    vertex(
      (monolith.x + monolith.w + monolith.d + v2.x) * M,
      (monolith.y + monolith.d + v2.y) * M
    );
    vertex(
      (monolith.x + monolith.d + v1.x) * M,
      (monolith.y + monolith.d + v1.y) * M
    );
    endShape(CLOSE);
  }
  blendMode(BLEND);

  // DRAW MONOLITH

  // Back
  let col = color(colors.monolith);
  // col = color(hue(col), saturation(col), lightness(col) + 5);
  fill(col);
  beginShape();
  vertex(monolith.x * M, monolith.y * M);
  vertex(monolith.x * M, (monolith.y - monolith.h) * M);
  vertex((monolith.x + monolith.w) * M, (monolith.y - monolith.h) * M);
  vertex(
    (monolith.x + monolith.w + monolith.d) * M,
    (monolith.y - monolith.h + monolith.d) * M
  );
  vertex(
    (monolith.x + monolith.w + monolith.d) * M,
    (monolith.y + monolith.d) * M
  );
  vertex(
    (monolith.x + (1 - xRatio) * monolith.w + monolith.d) * M,
    (monolith.y + monolith.d) * M
  );
  vertex(
    (monolith.x + (1 - xRatio) * monolith.w + monolith.d) * M,
    (monolith.y + monolith.d - monolith.h + xRatio * monolith.w) * M
  );
  vertex(
    (monolith.x + xRatio * monolith.w + monolith.d) * M,
    (monolith.y + monolith.d - monolith.h + xRatio * monolith.w) * M
  );
  vertex(
    (monolith.x + xRatio * monolith.w + monolith.d) * M,
    (monolith.y + monolith.d) * M
  );

  vertex((monolith.x + monolith.d) * M, (monolith.y + monolith.d) * M);
  endShape();

  // Top
  col = color(colors.monolith);
  col = color(hue(col), saturation(col), lightness(col) + 10);
  fill(col);
  quad(
    monolith.x * M,
    (monolith.y - monolith.h) * M,
    (monolith.x + monolith.w) * M,
    (monolith.y - monolith.h) * M,
    (monolith.x + monolith.w + monolith.d) * M,
    (monolith.y - monolith.h + monolith.d) * M,
    (monolith.x + monolith.d) * M,
    (monolith.y - monolith.h + monolith.d) * M
  );

  // Side
  col = color(colors.monolith);
  col = color(hue(col), saturation(col), lightness(col) + 5);
  fill(col);
  quad(
    monolith.x * M,
    (monolith.y - monolith.h) * M,
    (monolith.x + monolith.d) * M,
    (monolith.y - monolith.h + monolith.d) * M,
    (monolith.x + monolith.d) * M,
    (monolith.y + monolith.d) * M,
    monolith.x * M,
    monolith.y * M
  );
  quad(
    (monolith.x + (1 - xRatio) * monolith.w) * M,
    (monolith.y - monolith.h + xRatio * monolith.w) * M,
    (monolith.x + (1 - xRatio) * monolith.w + monolith.d) * M,
    (monolith.y - monolith.h + xRatio * monolith.w + monolith.d) * M,
    (monolith.x + (1 - xRatio) * monolith.w + monolith.d) * M,
    (monolith.y + monolith.d) * M,
    (monolith.x + (1 - xRatio) * monolith.w) * M,
    monolith.y * M
  );

  // Front
  fill(colors.monolith);
  // stroke(colors.monolith)
  // strokeWeight(M)

  // drawingContext.shadowOffsetX = -monolith.d*M;
  // drawingContext.shadowOffsetY = -monolith.d*M;
  // drawingContext.shadowBlur = 6*M;
  // drawingContext.shadowColor = '#FF6D30';

  beginShape();
  vertex((monolith.x + monolith.d) * M, (monolith.y + monolith.d) * M);
  vertex(
    (monolith.x + monolith.d) * M,
    (monolith.y - monolith.h + monolith.d) * M
  );
  vertex(
    (monolith.x + monolith.w + monolith.d) * M,
    (monolith.y - monolith.h + monolith.d) * M
  );
  vertex(
    (monolith.x + monolith.w + monolith.d) * M,
    (monolith.y - monolith.h + monolith.d) * M
  );
  vertex(
    (monolith.x + monolith.w + monolith.d) * M,
    (monolith.y + monolith.d) * M
  );
  vertex(
    (monolith.x + (1 - xRatio) * monolith.w + monolith.d) * M,
    (monolith.y + monolith.d) * M
  );
  vertex(
    (monolith.x + (1 - xRatio) * monolith.w + monolith.d) * M,
    (monolith.y + monolith.d - monolith.h + xRatio * monolith.w) * M
  );
  vertex(
    (monolith.x + xRatio * monolith.w + monolith.d) * M,
    (monolith.y + monolith.d - monolith.h + xRatio * monolith.w) * M
  );
  vertex(
    (monolith.x + xRatio * monolith.w + monolith.d) * M,
    (monolith.y + monolith.d) * M
  );

  vertex((monolith.x + monolith.d) * M, (monolith.y + monolith.d) * M);
  endShape();

  // stroke("#FF3D00");
  // strokeWeight(M*3)
  // drawingContext.shadowOffsetX = 0;
  // drawingContext.shadowOffsetY = 0;
  // drawingContext.shadowBlur = 8*M;
  // drawingContext.shadowColor = '#FF6D30';
  // line(
  //   (monolith.x + monolith.w/2+monolith.d/2) * M,
  //   (monolith.y - monolith.h + monolith.d/2-2.5) * M,
  //   (monolith.x + monolith.w/2) * M,
  //   0
  // )
  // drawingContext.shadowColor = 'rgba(0,0,0,0)';
};

drawRegularMonolith = (monolith) => {
  // DRAW SHADOW
  // Done First because it sits under monolith

  // Take center of sun and move up 25% of radius
  // to get vanishing point for shadow
  for (let sun of suns) {
    let shadowStart = {
      x: sun.x,
      y: sun.y + 0.5 * sun.r,
      // y: sun.y,
    };

    let v1a = createVector(
      monolith.x + monolith.d - shadowStart.x,
      monolith.y + monolith.d - shadowStart.y
    );
    let v1b = createVector(
      monolith.x - shadowStart.x,
      monolith.y - shadowStart.y
    );

    // Get vector from vanishing point to front edges of monolith
    let v1 = v1a.heading() > v1b.heading() ? v1a : v1b;
    let v2 = createVector(
      monolith.x + monolith.w + monolith.d - shadowStart.x,
      monolith.y + monolith.d - shadowStart.y
    );

    v1.setHeading(v1.heading() + PI / 128);
    v2.setHeading(v2.heading() - PI / 128);

    // Set vector magnitudes to be 1000
    let mag =
      (sqrt(
        1000 /
          dist(
            monolith.x + monolith.w / 2,
            monolith.y,
            sun.x,
            sun.y + 0.5 * sun.r
          )
      ) *
        500 *
        (monolith.shadowMod || 1) *
        monolith.h) /
      100;
    v1.setMag(mag);
    v2.setMag(mag);

    // Default shadow fill
    colors.shadow.setAlpha(1);
    fill(colors.shadow);

    // Set smooth gradient if needed
    if (monolith.shadow == "Smooth") {
      setMonolithShadowFill(
        (monolith.x + monolith.w / 2 + monolith.d) * M,
        (monolith.y + monolith.d) * M,
        ((monolith.x +
          monolith.w +
          monolith.d +
          v2.x +
          (monolith.x + monolith.d + v1.x)) *
          M) /
          2,
        ((monolith.y + monolith.d + v2.y + (monolith.y + monolith.d + v1.y)) *
          M) /
          2,
        0
      );
    }

    // Draw shadow from front of monolith
    blendMode(MULTIPLY);
    quad(
      (monolith.x + (v1a.heading() > v1b.heading() ? monolith.d : 0)) * M,
      (monolith.y + (v1a.heading() > v1b.heading() ? monolith.d : 0)) * M,
      (monolith.x + monolith.w + monolith.d) * M,
      (monolith.y + monolith.d) * M,
      (monolith.x + monolith.w + monolith.d + v2.x) * M,
      (monolith.y + monolith.d + v2.y) * M,
      (monolith.x + monolith.d + v1.x) * M,
      (monolith.y + monolith.d + v1.y) * M
    );
    blendMode(BLEND);
  }

  // DRAW MONOLITH

  // Back
  let col = color(colors.monolith);
  // col = color(hue(col), saturation(col), lightness(col) + 5);
  fill(col);
  beginShape();
  vertex(monolith.x * M, monolith.y * M);
  vertex(monolith.x * M, (monolith.y - monolith.h) * M);
  vertex((monolith.x + monolith.w) * M, (monolith.y - monolith.h) * M);
  vertex(
    (monolith.x + monolith.w + monolith.d) * M,
    (monolith.y - monolith.h + monolith.d) * M
  );
  vertex(
    (monolith.x + monolith.w + monolith.d) * M,
    (monolith.y + monolith.d) * M
  );
  vertex((monolith.x + monolith.d) * M, (monolith.y + monolith.d) * M);
  endShape();

  // Top
  col = color(colors.monolith);
  col = color(hue(col), saturation(col), lightness(col) + 10);
  fill(col);
  quad(
    monolith.x * M,
    (monolith.y - monolith.h) * M,
    (monolith.x + monolith.w) * M,
    (monolith.y - monolith.h) * M,
    (monolith.x + monolith.w + monolith.d) * M,
    (monolith.y - monolith.h + monolith.d) * M,
    (monolith.x + monolith.d) * M,
    (monolith.y - monolith.h + monolith.d) * M
  );

  // Side
  col = color(colors.monolith);
  col = color(hue(col), saturation(col), lightness(col) + 5);
  fill(col);
  quad(
    monolith.x * M,
    (monolith.y - monolith.h) * M,
    (monolith.x + monolith.d) * M,
    (monolith.y - monolith.h + monolith.d) * M,
    (monolith.x + monolith.d) * M,
    (monolith.y + monolith.d) * M,
    monolith.x * M,
    monolith.y * M
  );

  // Front
  fill(colors.monolith);
  // stroke(colors.monolith)
  // strokeWeight(M)

  // drawingContext.shadowOffsetX = -monolith.d*M;
  // drawingContext.shadowOffsetY = -monolith.d*M;
  // drawingContext.shadowBlur = 6*M;
  // drawingContext.shadowColor = '#FF6D30';

  quad(
    (monolith.x + monolith.d) * M,
    (monolith.y - monolith.h + monolith.d) * M,
    (monolith.x + monolith.w + monolith.d) * M,
    (monolith.y - monolith.h + monolith.d) * M,
    (monolith.x + monolith.w + monolith.d) * M,
    (monolith.y + monolith.d) * M,
    (monolith.x + monolith.d) * M,
    (monolith.y + monolith.d) * M
  );

  // stroke("#FF3D00");
  // strokeWeight(M*3)
  // drawingContext.shadowOffsetX = 0;
  // drawingContext.shadowOffsetY = 0;
  // drawingContext.shadowBlur = 8*M;
  // drawingContext.shadowColor = '#FF6D30';
  // line(
  //   (monolith.x + monolith.w/2+monolith.d/2) * M,
  //   (monolith.y - monolith.h + monolith.d/2-2.5) * M,
  //   (monolith.x + monolith.w/2) * M,
  //   0
  // )
  // drawingContext.shadowColor = 'rgba(0,0,0,0)';
  // noStroke()
};

setMonolithShadowFill = (x1, y1, x2, y2, endAlpha = 0) => {
  let gradient = drawingContext.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, colors.shadow);
  let shadowFade = color(colors.shadow);
  shadowFade.setAlpha(endAlpha);
  gradient.addColorStop(1, shadowFade);
  drawingContext.fillStyle = gradient;
};

drawBG = () => {
  // Background
  fill(colors.background);

  // Handle non-flat sky
  let gradient = drawingContext.createLinearGradient(
    0,
    0,
    0,
    (dunes[0].leftCurve.y1 + 200) * M
  );
  if (skyStyle == "Flat") {
    // Do nothing
  } else if (skyStyle == "Full Fade") {
    gradient.addColorStop(0, colorShift(colors.background, 0, 0, -25));
    gradient.addColorStop(0.5, colorShift(colors.background, 0, 0, 0));
    gradient.addColorStop(1, colorShift(colors.background, 0, 0, 25));
    drawingContext.fillStyle = gradient;
  } else if (skyStyle == "Half Fade") {
    gradient.addColorStop(0, colorShift(colors.background, 0, 0, -12));
    gradient.addColorStop(0.5, colorShift(colors.background, 0, 0, 0));
    gradient.addColorStop(1, colorShift(colors.background, 0, 0, 12));
    drawingContext.fillStyle = gradient;
  } else if (skyStyle == "Inversion") {
    gradient.addColorStop(0, colorShift(colors.background, 0, 0, -15));
    gradient.addColorStop(0.5, colorShift(colors.background, 45, 0, 0));
    gradient.addColorStop(1, colorShift(colors.background, 90, 0, 15));
    drawingContext.fillStyle = gradient;
  }
  rect(0, 0, width, height);

  // if(scene == "Night"){
  //   noStroke()
  //   for(let i =0;i<2000*dunes[0].leftCurve.y1/1500;i++){
  //     let col = color(hue(colors.sun),saturation(colors.sun),lightness(colors.sun))
  //     col.setAlpha(random(0.2,0.7))
  //     fill(col)
  //     circle(random(width),(borderWidth+15+ randomGaussian(0,dunes[0].leftCurve.y1/3))*M,random(1,3)*M)
  //   }
  // }
};

drawSuns = () => {
  fill(colors.sun);
  for (let sun of suns) {
    if (renderStyle == "Flat") {
      // Do nothing
    } else if (scene == "Night" || scene == "Lunar Eclipse") {
      let gradient = drawingContext.createRadialGradient(
        sun.x * M,
        sun.y * M,
        // (sun.r * M) / 1.25,
        0,
        sun.x * M,
        sun.y * M,
        sun.r * M
      );
      gradient.addColorStop(0, colors.sun);
      gradient.addColorStop(1, colorShift(colors.sun, 0, 5, -5));
      drawingContext.fillStyle = gradient;
    } else {
      let gradient = drawingContext.createLinearGradient(
        sun.x * M,
        (sun.y - sun.r) * M,
        (sun.x + 100) * M,
        (sun.y + sun.r) * M
      );
      gradient.addColorStop(0, colors.sun);
      gradient.addColorStop(1, colorShift(colors.sun, 5, 5, -5));
      drawingContext.fillStyle = gradient;
    }

    circle(sun.x * M, sun.y * M, sun.r * 2 * M);

    // Crescent
    if (sunType == "Crescent") {
      // Handle non-flat sky
      let gradient = drawingContext.createLinearGradient(
        0,
        0,
        0,
        (dunes[0].leftCurve.y1 + 200) * M
      );
      if (skyStyle == "Flat") {
        fill(colors.background);
      } else if (skyStyle == "Full Fade") {
        gradient.addColorStop(0, colorShift(colors.background, 0, 0, -25));
        gradient.addColorStop(0.5, colorShift(colors.background, 0, 0, 0));
        gradient.addColorStop(1, colorShift(colors.background, 0, 0, 25));
        drawingContext.fillStyle = gradient;
      } else if (skyStyle == "Half Fade") {
        gradient.addColorStop(0, colorShift(colors.background, 0, 0, -12));
        gradient.addColorStop(0.5, colorShift(colors.background, 0, 0, 0));
        gradient.addColorStop(1, colorShift(colors.background, 0, 0, 12));
        drawingContext.fillStyle = gradient;
      } else if (skyStyle == "Inversion") {
        gradient.addColorStop(0, colorShift(colors.background, 0, 0, -15));
        gradient.addColorStop(0.5, colorShift(colors.background, 45, 0, 0));
        gradient.addColorStop(1, colorShift(colors.background, 90, 0, 15));
        drawingContext.fillStyle = gradient;
      }
      circle((sun.x + sun.r * 0.25) * M, sun.y * M, sun.r * 1.65 * M);
    }
  }
};

drawBorder = () => {
  grainBuffer.rectMode(CORNER);
  noFill();
  stroke(colors.border);
  strokeWeight((borderWidth * 2 + 10) * M);
  rect(0, 0, WIDTH, HEIGHT);
  noStroke();
};

colorShift = (c, h, s, l = 0) => {
  let col = color(hue(c), saturation(c), lightness(c));
  col = color(
    (720 + hue(col) + h) % 360,
    saturation(col) + s,
    lightness(col) + l
  );
  // console.log((hue(col)))
  return col;
};

// WEIGHTED RANDOM
weighted_random = (o, w) => {
  let v = [...w]; // Clone chances
  let i;
  let l = v.length;
  for (i = 0; i < l; i++) v[i] += v[i - 1] || 0;
  let r = random() * v[l - 1];
  for (i = 0; i < l; i++) if (v[i] > r) break;
  return o[i];
};

keyPressed = (key) => {
  console.log({ key });
  if (key.key == "g") {
    disableGrain = !disableGrain;
    setup();
    loop();
  }
  if (key.key == "h") {
    highRes = !highRes;
    setup();
    loop();
  }
  if (key.key == "s") save("Erg" + ".png");
};
