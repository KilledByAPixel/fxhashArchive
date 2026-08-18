function preload() {
  randomSeed(seed);
  noiseSeed(seed);

  chooser()

 
  // console.log("colorScheme: ", colorVariables[0][0].colorSchemeName);
  // console.log("bgTexture: ", bgTextureFeatName);
  // console.log("celestialObject: ", celestialObjectFeatName);
  // console.log("terrainQty: ", terrainQty);
  // console.log("terrainType: ", terrainModeFeatName);
  // console.log("terrainAccentStatus: ", terrainAccentStatus);
  // console.log("terrainDrippingType: ", terrainDrippingStatus);
  // console.log("frameStatus: ", frameStatus);


  colorSchemeRandomizer = random(colorVariables);
  
  window.$fxhashFeatures = {
    "Color Scheme": colorSchemeRandomizer[0].colorSchemeName[0],
    "Sky Texture": bgTextureFeatName,
    "Celestial Object": celestialObjectFeatName,
    "Terrain QTY.": terrainQty,
    "Terrain Type": terrainModeFeatName,
    "Terrain accent": terrainAccentStatus,
    "Dripping ridges": terrainDrippingStatus,
    "Frame": frameStatus,
  };
  colorBack = random(colorFinder(colorSchemeRandomizer, "colorBack"));
  colorBack01 = random(colorFinder(colorSchemeRandomizer, "colorBack01"));
  colorBack02 = random(colorFinder(colorSchemeRandomizer, "colorBack02"));
  colorBack03 = random(colorFinder(colorSchemeRandomizer, "colorBack03"));
  colorBack04 = random(colorFinder(colorSchemeRandomizer, "colorBack04"));
  colorBackAccent = random(colorFinder(colorSchemeRandomizer, "colorBackAccent"));

  colorFront = random(colorFinder(colorSchemeRandomizer, "colorFront"));
  colorFront01 = random(colorFinder(colorSchemeRandomizer, "colorFront01"));
  colorFront02 = random(colorFinder(colorSchemeRandomizer, "colorFront02"));
  colorFront04 = random(colorFinder(colorSchemeRandomizer, "colorFront04"));
  colorFront05 = random(colorFinder(colorSchemeRandomizer, "colorFront05"));
  colorFrontAccent = random(colorFinder(colorSchemeRandomizer, "colorFrontAccent"));


  // howManyTerrains = 1;
  howManyTerrains = terrainQty
  terrainSteps = int(map(seedSlice3, 100, 999, 200, 500));
  frameProportions = random([100, 200, 400, 600]);
  if (howManyTerrains < 2) {
    gridDunePosX = [800, 1000, 1200];
    gridDunePosXX = [800, 1000, 1200];
    gridPosY = [1035, 1150, 1200, 1380];
    terrainCeiling = random(25, 35);
  } else if (howManyTerrains === 2) {
    gridDunePosX = [600, 1000, 1400];
    gridPosY = [1035, 1150, 1200, 1380, 1610];
    terrainCeiling = random(25, 35);
  } else if (howManyTerrains === 3) {
    gridDunePosX = [600, 1000, 1400, 1550];
    gridPosY = [1035, 1150, 1200, 1380, 1610];
    terrainCeiling = random(22, 25);
  } else {
    gridDunePosX = [600, 600, 1000, 1400, 1700];
    gridPosY = [1035, 1150, 1200, 1380, 1610];
    terrainCeiling = 25;
  }
}

function setup() {
  createCanvas(2000, 2000 * 1.3);
  colorMode(HSB, 360, 100, 100, 1);
  background(colorBack);

  // sky
  for (let i = 0; i < 1; i++) {
    skyBase[i] = new Sky(0, 0, 0, 0, 0, 400, width, 0, random(3, 5), random(25, 40), random(0.01, 0.03), int(map(seedSlice3, 100, 999, 200, 500)));
  }

  // terrains
  for (let i = 0; i < howManyTerrains; i++) {
    let gridDunePosSelectorX = random(gridDunePosX);

    removeA(gridDunePosX, gridDunePosSelectorX);

    terrainBase[i] = new Terrain(
      gridDunePosSelectorX,
      random(gridPosY),
      1.5,
      random(200, 500),
      1.5,
      400,
      0,
      height + map(seedSlice3, 100, 999, 0, 500),
      random(3, 5),
      terrainCeiling, // CEILING
      random(0.01, 0.03),
      terrainSteps
    );
  }

  for (let i = 0; i < 1; i++) {
    celestialObjectsBase[i] = new CelestialObjects(int(map(seedSlice3, 100, 999, 300, 800)));
  }

  texture = new Texture();
  frame = new Frame(frameProportions);
}

function draw() {
  if (frameCount > 20 && frameCount < 40) {
    if(frameStatus) {
      frame.frameSequence();
    }
  }

  if (terrainIsDone) {
    if(bgLinesDiagonalPencilL) {
      texture.linesDiagonalPencilL()
    }
    if(bgLinesDiagonalPencilR) {
      texture.linesDiagonalPencilR()
    }
    if(bgLinesDiagonal) {
      texture.linesDiagonal()
    }
    if(bgLinesVertical) {
      texture.linesVertical()
    }
    if(bgLinesCrossDiagonal) {
      texture.linesCrossDiagonal();
    }
    if(bgNone) {
      skyIsDone = true;
    }
  }
  if(celestialObjectIsDone) {
    texture.paper();
  }

  if (frameCount > 50) {
    
    for (let i = 0; i < celestialObjectsBase.length; i++) {
      if (skyIsDone) {
          if(cOFireBurstTypeA) {
            celestialObjectsBase[i].celestialBurning()
          }
          if(cOFireBurstTypeB) {
            celestialObjectsBase[i].celestialBurning2();
          }
          if(cOEclipse) {
            celestialObjectsBase[i].celestialEclipse()
          }
          if(cOFlare) {
            celestialObjectsBase[i].celestialFlare();
          }
          if(cOVoid) {
            celestialObjectsBase[i].celestialSunVoid()
          }
      }

    }
    // terrain
    for (let i = 0; i < terrainBase.length; i++) {
   
        if(terrainDrippingStatus && terrainDrippingType === "Rock") {
          terrainBase[i].drippingRock();
        }
        if(terrainDrippingStatus && terrainDrippingType === "Sand") {
          terrainBase[i].drippingSand();
        }
        if(terrainAccentStatus && !terrainDrippingStatus) {
          terrainBase[i].terrainAccent()
        }
        
        if(terrainMode1) {
          terrainBase[i].terrainSandModel1();
        }
        if(terrainMode2) {
          terrainBase[i].terrainSandModel2();
        }
        if(terrainMode3) {
          terrainBase[i].terrainSandModel3();
        }
    }
  }
  if (!live) {
    console.log('👋');
    noLoop();
  }
}

function removeA(arr) {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
}

function keyPressed() {
  if (keyCode === BACKSPACE) {
    noLoop();
  }
  if (keyCode === ENTER) {
    loop();
  }
  if (keyCode === 80) {
    save(`momentary-${seed}.jpg`);
  }
}

// function keyPressed() {
//   if (keyCode === 80) {
//     save(`momentary-${seed}.jpg`);
//   }
// }
