var params = new URLSearchParams(window.location.search)

var timer = null;



let combinations = [
  ["Stargazers"], 
  ["Flytraps"], 
  ["Quasars"], 
  ["Firelillies"],
  ["Stargazers", "Flytraps"], 
  ["Stargazers", "Quasars"], 
  ["Stargazers", "Firelillies"],
  ["Flytraps", "Quasars"], 
  ["Flytraps", "Firelillies"],
  ["Quasars", "Firelillies"],
  ["Stargazers", "Flytraps", "Quasars"], 
  ["Stargazers", "Flytraps", "Firelillies"],
  ["Flytraps", "Quasars", "Firelillies"], 
  ["Quasars", "Firelillies", "Stargazers"],
  ["Stargazers", "Flytraps", "Quasars", "Firelillies"]
]

let combinationWeights = [3,3,3,3,7,7,7,7,7,7,7,7,7,7,18];

let spriteSheets_stargazers = { dest: "sprites/", fileName: "Stargazers_", sheetCount: 7, offSets: [25, 47, 26, 10, 85, 40, 17] } //offSets :[17,25,50,47,26,26,26,35,26] offSets :[0,0,0,0,0,0,0,0,0]
let spriteSheets_flytraps = { dest: "sprites/", fileName: "Flytraps_", sheetCount: 4, offSets: [17, 25, 40, 47] } //offSets :[17,25,50,47,26,26,26,35,26] offSets :[0,0,0,0,0,0,0,0,0]
let spriteSheets_quasars = { dest: "sprites/", fileName: "Quasars_", sheetCount: 8, offSets: [40, 40, 40, 40, 40, 40, 60, 17] } //offSets :[17,25,50,47,26,26,26,35,26] offSets :[0,0,0,0,0,0,0,0,0]
let spriteSheets_firelillies = { dest: "sprites/", fileName: "Firelillies_", sheetCount: 4, offSets: [17, 40, 40, 65] }   //0,2,8,10 from glyps [17,40,40,65]

let stargazerImages = [];
let flytrapImages = [];
let quasarImages = [];
let firelillyImages = [];



let blurHShader;
let blurVShader;
let bloomShader;

let layer;


let animCanvas;

let blurPassH;
let blurPassV;
let bloomPass;

let seed;
let gridSize;
let gridPosition;
let plants = []

let PD;

let allSprites = [];

let placementProbs;


let colorNames = ["Red", "Orange", "Yellow", "Green", "Teal", "Sky Blue", "Cobalt Blue", "Electric Blue", "Purple",  "Hot Pink"];

let potColors = ["#f71302", "#f76002", "#d19900", "#0ba100", "#02d697", "#02c1d6", "#0a7ef2", "#2121ff", "#7911f0",  "#ed079d"]
let ringColors = ["#f71302", "#f76002", "#d19900", "#0ba100", "#02d697", "#02c1d6", "#0a7ef2", "#2121ff", "#7911f0",  "#ed079d"]
let potColor;
let stemColor;
let ringColor;
let ringCount;
let isSymmetric;
let spriteCombination;

let ringColorName;
let potColorName;

let arrangementSelector;

let placementPoints = [];
let baseLengths = [];
let flowerCounts = [];
let flowerScale = false;

let fileName;

let exportSize;
let exporting = false;

const gridCellSize = 100;

function preload() {
  

  seed = xmur3(fxhash)();
  randomSeed(seed);

  // Load the shader
  blurHShader = loadShader('basic.vert', 'basic.frag');
  blurVShader = loadShader('basic.vert', 'basic.frag');
  bloomShader = loadShader('basic.vert', 'bloom.frag');

  //Load the spriteSheets  
  stargazerImages = loadFrames(spriteSheets_stargazers.dest, spriteSheets_stargazers.fileName, spriteSheets_stargazers.sheetCount);
  flytrapImages = loadFrames(spriteSheets_flytraps.dest, spriteSheets_flytraps.fileName, spriteSheets_flytraps.sheetCount);
  quasarImages = loadFrames(spriteSheets_quasars.dest, spriteSheets_quasars.fileName, spriteSheets_quasars.sheetCount);
  firelillyImages = loadFrames(spriteSheets_firelillies.dest, spriteSheets_firelillies.fileName, spriteSheets_firelillies.sheetCount);
  // Sprite placement settings
  gridSize = getWeightedfromArray([3,40,57],[1,3,4])

  isSymmetric = gridSize===1?false:getWeightedfromArray([35, 65], [true, false]);

  placementProbs = getPlacementProbs(gridSize);
  gridPosition = getGridPosition(gridSize);

  arrangementSelector = IntRandRange(0, placementProbs.length)
  let settingObj = placementProbs[arrangementSelector].options[IntRandRange(0, placementProbs[arrangementSelector].options.length)];

  placementPoints = placementProbs[arrangementSelector].loc;
  baseLengths = settingObj.len[IntRandRange(0, settingObj.len.length)];
  flowerCounts = settingObj.arr;
  flowerScale = settingObj.scale[IntRandRange(0, settingObj.scale.length)];

  potColor = potColors[IntRandRange(0, potColors.length)];
  ringColor = ringColors[IntRandRange(0, ringColors.length)];
  ringCount = IntRandRange(2, 5);

  ringColorName = colorNames[ringColors.indexOf(ringColor)];
  potColorName = colorNames[potColors.indexOf(potColor)];
  spriteCombination = getWeightedfromArray(combinationWeights,combinations)


  
  fileName = fxhash;

  window.$fxhashFeatures = {
    "Grid Size ": gridSize,
    "Pot Color ": potColorName,
    "Stem Color ": ringColorName,
    "Flowers " : spriteCombination.join(" "),
    "Symmetry " :isSymmetric,
    "Placement Points " : placementPoints.join(","),
    "Flower Count " : flowerCounts.join(","),
    "Ring Count " : ringCount-1
  } 



  if (params.has('exportsize')) {
    exporting=true;
    
    exportSize = params.get('exportsize');

  }
 
 


}

function getPlacementProbs(gridSize){
  let o = {"1": placementProbs1x1,"3":placementProbs3x3,"4":placementProbs4x4};
  return o[String(gridSize)]
}
  



function combinationMaker(combination) {

  let result = [];

  let stargazerImporter = new SpriteImporter(stargazerImages, 200, 200, spriteSheets_stargazers.offSets);
  stargazerImporter.loadSprites();
  let flytrapImporter = new SpriteImporter(flytrapImages, 200, 200, spriteSheets_flytraps.offSets);
  flytrapImporter.loadSprites();
  let quasarImporter = new SpriteImporter(quasarImages, 200, 200, spriteSheets_quasars.offSets);
  quasarImporter.loadSprites();
  let firelillyImporter = new SpriteImporter(firelillyImages, 200, 200, spriteSheets_firelillies.offSets);
  firelillyImporter.loadSprites();

  let spriteObjects = {
    'Stargazers': stargazerImporter.getAllSprites(),
    'Flytraps': flytrapImporter.getAllSprites(),
    'Quasars': quasarImporter.getAllSprites(),
    'Firelillies': firelillyImporter.getAllSprites()
  }
  console.log(spriteObjects['Flytraps'])
  console.log(combination)

  combination.forEach(e => {
    result.push(spriteObjects[e]);
  })
  // console.log(result)
  // console.log(result.flat())
  return  result.flat();
}




function setup() {
  createCanvas(500, 500);

  if (!exporting) {
    let w = min(window.innerWidth, window.innerHeight);
    resizeCanvas(w, w);
  } else if (exporting) {
    resizeCanvas(exportSize, exportSize);
  }

  console.log('Seed %d , opHash: %s', seed, fxhash)
  angleMode(DEGREES);
  colorMode(HSB);

  frameRate(15);

  PD = pixelDensity();
  blurPassH = createGraphics(width, height, WEBGL);
  blurPassV = createGraphics(width, height, WEBGL);
  bloomPass = createGraphics(width, height, WEBGL);
  animCanvas = createGraphics(width, height);

  animCanvas.imageMode(CENTER);
  blurPassH.imageMode(CENTER);
  blurPassV.imageMode(CENTER);
  bloomPass.imageMode(CENTER);
  animCanvas.rectMode(CENTER);

  layer = createGraphics(width, height);

  noStroke();

  blurPassH.pixelDensity(PD);
  blurPassV.pixelDensity(PD);
  bloomPass.pixelDensity(PD);
  layer.pixelDensity(PD);

  blurPassH.noStroke();
  blurPassV.noStroke();
  bloomPass.noStroke();
  layer.noStroke();
  animCanvas.colorMode(HSB)



  

  let sprites;


  sprites = combinationMaker(spriteCombination);

  let symmetricSpriteArray = [];
  
  if(isSymmetric){
    symmetricSpriteArray =createSymmetry(sprites, placementPoints, flowerCounts, gridSize);
  }
  

  grid = new IsoGrid(0.5, gridSize===1?1:gridPosition, gridSize===1?300:gridCellSize, gridSize, gridSize, animCanvas);
  grid.calculatePoints();
console.log(grid)

  isSymmetric ? symmetricPlants(symmetricSpriteArray, placementPoints, grid, flowerCounts, baseLengths, flowerScale) : randomPlants(sprites, placementPoints, grid, flowerCounts, baseLengths, flowerScale,);
 
  

}





function draw() {

  randomSeed(seed)
  animCanvas.background(0, 0, 0);

  grid.display(potColor);

  plants.forEach(plant => {
    plant.display();
  })

  //HORIZONTAL

  blurPassH.shader(blurHShader);

  blurHShader.setUniform("tex", animCanvas);
  blurHShader.setUniform("resolution", [width, height]);
  blurHShader.setUniform("direction", [1, 0]);
  blurHShader.setUniform("ts", width / 1920);

  blurPassH.rect(0, 0, width, height);

  //VERTICAL

  blurPassV.shader(blurVShader);

  blurVShader.setUniform("tex", blurPassH);  
  blurVShader.setUniform("resolution", [width, height]);
  blurVShader.setUniform("direction", [0, 1]);
  blurVShader.setUniform("ts", height / 1920);
  blurPassV.rect(0, 0, width, height);
  //Bloom stuff

  bloomPass.shader(bloomShader);
  bloomShader.setUniform("tex", animCanvas);
  bloomShader.setUniform("blurTex", blurPassV);
  bloomShader.setUniform("gradModifier", 4.0);

  bloomShader.setUniform("layer", layer);

  bloomPass.rect(0, 0, width, height);

  //Render Image to Screen

  image(bloomPass, 0, 0);
  image(layer, 0, 0);

 

fxpreview();

}


function touchStarted(){
  timer = setTimeout( saveG, 2000 );

}

function touchEnded(){
  clearTimeout( timer );
}

function saveG() {
  saveGif(fileName, 15, { delay: 0, units: 'frames' });
}


function keyPressed() {
  if (key === 's') {
    saveGif(fileName, 15, { delay: 0, units: 'frames' });
  }
  
}





function randomPlants(sprites, placementPoints, grid, flowerCounts, baseLengths, flowerScale) {
  for (let i = 0; i < placementPoints.length; i++) {
    np = new NeonPlant(
      animCanvas,
      grid.tiles[placementPoints[i]].midPoint,
      sprites,
      flowerCounts[i],
      baseLengths[i], random(0, 10), flowerScale, ringCount, ringColor);
    np.initPlant();
    plants.push(np);

  }

}


function symmetricPlants(sprites, placementPoints, grid, flowerCounts, baseLengths, flowerScale) {
  for (let i = 0; i < placementPoints.length; i++) {
    np = new NeonPlant(
      animCanvas,
      grid.tiles[placementPoints[i]].midPoint,
      sprites[i],
      flowerCounts[i],
      baseLengths[i], 1, flowerScale, ringCount, ringColor);
    np.initSymmetric();
    plants.push(np);

  }

}


function createSymmetry(spriteArr, placementArr, flowerCountArr, gridSize) {
  let arrToReturn = [];
  let spriteArray = [];
  let isLocLenEven = isEvenLocLen(placementArr);
  let halfLoc = isLocLenEven ? placementArr.length / 2 : (placementArr.length - 1) / 2;
  for (let i = 0; i < halfLoc; i++) {
    let sprites = [];
    for (let j = 0; j < flowerCountArr[i]; j++) {
      sprites.push(spriteArr[IntRandRange(0, spriteArr.length)]);
    }
    spriteArray.push(sprites);
  }

  if (isLocLenEven) {
    arrToReturn = spriteArray.concat([...spriteArray].reverse());

  } else {
    let midSprites = [];
    for (let i = 0; i < flowerCountArr[halfLoc]; i++) {
      midSprites.push(spriteArr[IntRandRange(0, spriteArr.length)]);
    }
    let g = [];
    g.push(midSprites);
    let arr1 = [...spriteArray];
    arrToReturn = spriteArray.concat(g).concat(arr1.reverse());
  }
  return arrToReturn;
}


function isEvenLocLen(placementArr) {
  return placementArr.length % 2 === 0 ? true : false;
}
function getGridPosition(gridSize) {
  return gridSize === 3 ? 0.80 : 0.75;
}