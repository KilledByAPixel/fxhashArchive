const isMobile = window.navigator && window.navigator.userAgent && /Mobi|Android/i.test(window.navigator.userAgent)

  let LEAVES = [];

// 0-2 - Leaves  3 - Spikes 4 - wind and lights
LEAVES[0] = [[242, 12, 12], [170, 204, 150], [174, 78, 53], [43, 102, 145], [205, 103, 142]];
LEAVES[1] = [[90, 165, 70], [56, 89, 46], [60, 115, 22], [189, 217, 130], [207, 229, 66]];
LEAVES[2] = [[44, 64, 11], [81, 140, 22], [148, 191, 84], [137, 190, 20], [183, 242, 56]];
LEAVES[3] = [[242, 207, 41], [151, 192, 90], [191, 91, 5], [166, 138, 114], [172, 160, 100]];
LEAVES[4] = [[191, 167, 95], [218, 158, 106], [168, 190, 118], [67, 79, 13], [82, 88, 42]];
LEAVES[5] = [[88, 2, 1], [201, 200, 205], [70, 70, 70], [141, 191, 32], [205, 229, 89]];
LEAVES[6] = [[20, 37, 1], [78, 115, 2], [63, 89, 2], [131, 166, 2], [192, 217, 4]];
LEAVES[7] = [[124, 146, 167], [55, 89, 2], [98, 140, 4], [108, 51, 34], [114, 93, 88]];
LEAVES[8] = [[146, 111, 105], [93, 114, 45], [165, 191, 68], [188, 191, 100], [170, 204, 150]];
LEAVES[9] = [[66, 90, 42], [129, 167, 94], [96, 139, 31], [174, 191, 147], [242, 242, 242]];
LEAVES[10] = [[91, 115, 67], [130, 166, 56], [245, 59, 44], [229, 242, 188], [42, 195, 200]];
LEAVES[11] = [[1, 115, 19], [166, 155, 5], [217, 170, 82], [167, 82, 51], [114, 69, 28]];
LEAVES[12] = [[4, 64, 2], [2, 38, 2], [71, 115, 2], [120, 191, 11], [185, 101, 117]];
LEAVES[13] = [[204, 93, 38], [74, 115, 85], [129, 167, 94], [143, 167, 109], [177, 191, 158]];
LEAVES[14] = [[77, 115, 38], [128, 140, 38], [162, 167, 41], [78, 115, 82], [111, 177, 191]];
LEAVES[15] = [[165, 235, 59], [96, 194, 31], [21, 159, 50], [83, 220, 29], [197, 255, 204]];
LEAVES[16] = [[217, 66, 107], [78, 88, 115], [201, 224, 242], [233, 241, 243], [40, 36, 27]];
LEAVES[17] = [[79, 77, 140], [95, 93, 166], [144, 142, 191], [47, 65, 89], [40, 36, 27]];
LEAVES[18] = [[168, 102, 24], [116, 98, 74], [220, 94, 53], [110, 224, 165], [24, 168, 54]];
LEAVES[19] = [[192, 162, 136], [204, 93, 38], [81, 100, 34], [213, 97, 56], [82, 88, 42]];
LEAVES[20] = [[77, 77, 77], [63, 54, 59], [255, 68, 59], [111, 139, 114], [184, 171, 136]];
LEAVES[21] = [[216, 152, 116], [202, 59, 51], [167, 191, 143], [242, 167, 161], [190, 84, 84]];

// randomized blooms, bg and paspartu colors

let BLOOM = [];
BLOOM[0] = [[217, 67, 40], [53, 47, 83], [80, 113, 82], [255, 81, 60], [217, 88, 59]];
BLOOM[1] = [[219, 135, 65], [255, 243, 161], [205, 229, 89], [191, 75, 84], [242, 242, 240]];
BLOOM[2] = [[16, 59, 65], [241, 158, 56], [242, 119, 75], [217, 44, 4], [141, 34, 24]];
BLOOM[3] = [[40, 36, 27], [116, 108, 149], [171, 166, 167], [217, 149, 68], [131, 45, 44]];
BLOOM[4] = [[166, 32, 43], [217, 206, 150], [100, 109, 214], [166, 109, 79], [57, 69, 95]];
BLOOM[5] = [[234, 88, 89], [201, 60, 51], [161, 53, 51], [111, 63, 78], [170, 186, 183]];
BLOOM[6] = [[246, 133, 141], [204, 93, 38], [83, 99, 34], [211, 98, 56], [82, 88, 42]];
BLOOM[7] = [[37, 29, 88], [196, 225, 223], [70, 48, 123], [86, 116, 157], [217, 139, 139]];
BLOOM[8] = [[128, 204, 185], [106, 175, 191], [207, 229, 66], [117, 131, 129], [78, 119, 139]];
BLOOM[9] = [[44, 57, 73], [120, 4, 45], [7, 103, 185], [125, 90, 128], [242, 98, 46]];
BLOOM[10] = [[75, 69, 115], [119, 158, 189], [33, 39, 63], [191, 164, 147], [167, 109, 95]];
BLOOM[11] = [[254, 182, 4], [204, 93, 38], [81, 100, 34], [197, 202, 175], [82, 88, 42]];
BLOOM[12] = [[139, 22, 31], [172, 160, 100], [145, 77, 32], [88, 13, 10], [116, 110, 124]];
BLOOM[13] = [[9, 115, 137], [109, 20, 45], [242, 156, 107], [241, 104, 50], [242, 47, 29]];
BLOOM[14] = [[200, 108, 95], [114, 74, 85], [218, 72, 59], [219, 125, 79], [118, 87, 98]];
BLOOM[15] = [[129, 166, 132], [154, 164, 145], [166, 72, 64], [245, 59, 44], [190, 211, 204]];
BLOOM[16] = [[146, 111, 105], [64, 75, 81], [217, 170, 160], [165, 110, 105], [89, 41, 41]];
BLOOM[17] = [[143, 164, 191], [252, 185, 175], [1, 148, 204], [217, 120, 3], [217, 162, 131]];
BLOOM[18] = [[242, 207, 41], [104, 144, 86], [218, 216, 217], [218, 138, 109], [144, 42, 40]];
BLOOM[19] = [[140, 130, 77], [165, 129, 95], [192, 98, 44], [167, 82, 51], [242, 242, 242]];
BLOOM[20] = [[241, 121, 122], [76, 113, 191], [2, 147, 204], [165, 207, 205], [242, 169, 154]];
BLOOM[21] = [[233, 213, 202], [232, 4, 23], [217, 167, 72], [108, 120, 116], [155, 149, 149]];
BLOOM[22] = [[116, 28, 52], [235, 176, 143], [165, 103, 52], [164, 48, 35], [248, 212, 200]];
BLOOM[23] = [[150, 24, 10], [81, 107, 122], [200, 81, 56], [170, 84, 71], [88, 2, 1]];
BLOOM[24] = [[2, 40, 89], [63, 108, 167], [196, 217, 198], [27, 49, 135], [48, 59, 82]];
BLOOM[25] = [[111, 177, 191], [242, 242, 232], [217, 205, 145], [165, 129, 95], [140, 74, 75]];
BLOOM[26] = [[104, 82, 69], [25, 45, 101], [217, 166, 74], [217, 151, 116], [191, 70, 59]];

let MONOCOLOR = [];
MONOCOLOR[0] = [245, 59, 44];
MONOCOLOR[1] = [166, 32, 43];
MONOCOLOR[2] = [1, 148, 204];
MONOCOLOR[3] = [37, 29, 188];
MONOCOLOR[4] = [232, 4, 23];


let masterMult = 1;

let colors = [];
let blooms = [];
let BWcolor;

let paspartuCol;
let bgCol;
let mainSize;


let paintImage;
let feedbackImage;
let sourceImage;

var numWonders = 0;
var wonders = [];
let wonderNoiseSize = 0;

var tendrils = [];

let n = 0;

let leavesNumber = 0;

let currentStep = 0;
let blurSteps = 72;
let steps = 128;
let maxGrow = 0;

let dirRand = 0;

let wWidth = 1050;
let wHeight = 1500;

let numFlowers = 0;
let centerX = 0;
let centerY = 0;

let highRes = false;

let paspartuWidth = 0;
let paspartuSize = 0.12;

let blurLevel = 0.001;

let jumps = 0;
let prop = 1;
let time;
let ang;

let testBool = true;

let myFont;



function preload() {
  blurShader = loadShader('libraries/effect.vert', 'libraries/effect.frag');
  myFont = loadFont('libraries/SourceSerifPro-Light.ttf');
}

function setup() {

  setStyle();
  noiseSeed(hashes[0]);
  randomSeed(hashes[1]);
  createColorPalleteRGB();

  maxGrow = random(0, 0.1);
  dirRand = random(-0.25, 0.25);

  createCanvas(windowWidth, windowHeight);

  jumps = floor(random(1, 11));
  //jumps = 33;

  centerX = random(-0.25, 0.25);
  centerY = random(-0.25, 0.25);

  //centerX = 0;
  //centerY = 0;

  //print(centerX);

  for (let t = 0; t < numFlowers; t++)
  {
    mainSize = floor((107-numFlowers)/34 +1)/3;
    let size = random(mainSize/2, mainSize);

    let e = pow(random(0, 1), 1.5);
    let rX =  centerX + random(-0.8, 0.8)*e;
    let rY =  centerY + random(-0.8, 0.8)*e;

    if (t == 0)
    {
      size = mainSize;
      rX = centerX*0.75;
      rY = centerY*0.75;
    }

    for (let i = 0; i < leavesNumber; i++) createSpike( rX, rY, size, t);
  }

  wonderNoiseSize = random(0.001, 0.01);
  for (let i = 0; i < numbersWonders; i++) createWonder(i, random(-1, 1), random(-1, 1));


  paintImage = createGraphics(150, 105, WEBGL);
  feedbackImage = createGraphics(150, 105, WEBGL);
  sourceImage = createGraphics(150, 105, WEBGL);
  
  windowResized();

  //paintImage.setAttributes('premultipliedAlpha', true);
  paintImage.setAttributes('antialias', false);
  paintImage.setAttributes('alpha', true);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


function draw() {
  time =  currentStep / steps;

  if (time > 0.7)
  {
    time = 0.7;
    noLoop();
  }

  ang = dirRand;


  let dX = sin(ang*2*PI);
  let dY = cos(ang*2*PI);

  paintImage.clear();

  paintImage.push();
  paintImage.pointLight(255, 255, 255, wHeight, 0, wHeight*0.2);

  if (isMonochrome == "No") paintImage.pointLight(bgCol, -wHeight, 0, 0);
  else
    paintImage.pointLight(BWcolor, -wHeight, 0, 0);

  if (isStripes == "Yes")
    paintImage.ambientLight( 130 * (1+sin(time*1134.2)) + 31 );
  else
    paintImage.ambientLight( 120 * (1+sin(time*12-0.6) ) + 163 * noise(time * 1110.10)  );


  paintImage.rotateZ(ang*-PI*2);
  paintImage.rotateX(0.5);
  paintImage.translate(0, 0, pow(time, 0.5) * (masterMult*500));


  //  let tempCol = colors[4];


  for (let i=0; i < tendrils.length; i++) {
    tendrils[i].run();
  }


  for (let i=0; i < wonders.length; i++) {
    wonders[i].run();
  }

  paintImage.pop();
  ///////////////////////////////////////END DRAW ON PAINTIMAGE

  sourceImage.blendMode(BLEND);
  sourceImage.image(feedbackImage, -wWidth/2, -wHeight/2);

  sourceImage.blendMode(SCREEN);
  sourceImage.push();
  sourceImage.translate(-dX*5*masterMult, -dY*5*masterMult);
  sourceImage.image(paintImage, -wWidth/2, -wHeight/2);


  sourceImage.rotate(-0.01);
  sourceImage.image(paintImage, -wWidth/2, -wHeight/2);
  sourceImage.pop();

  sourceImage.blendMode(BLEND);
  createPaspartu();
  sourceImage.image(paintImage, -wWidth/2, -wHeight/2);


  let b = 0;

  if (blurSteps > currentStep )
  {
    b = (1-1 / wWidth) * 0.0002 + mainSize*0.0002;
    b = pow(0.7-time, 1.8) * b * 5.5;
  }

  feedbackImage.shader(blurShader);
  feedbackImage.rect(0, 0, wWidth, wHeight);
  blurShader.setUniform('tex0', sourceImage);
  blurShader.setUniform('texelSize', [b, b]);


  blurShader.setUniform('time', time);
  blurShader.setUniform('smearSize', smearSize);
  blurShader.setUniform('smearLevel', smearLevel*1.14+0.5);

  blurShader.setUniform('smearDir', [dX, dY]);


  blendMode(BLEND);


  let cutAt = 0.45;
  if (time > cutAt) image(sourceImage, windowWidth/2 -  windowHeight*0.7/2, 0, windowHeight*0.7, windowHeight);
  else
  {
    rect(windowWidth/2 -  windowHeight*0.1/2, windowHeight/2.5, (cutAt-(cutAt - time))* (1/cutAt) * windowHeight * 0.1, 1);
  }


  currentStep ++;
}

function windowResized() {

  if (isMobile)
  {

    wWidth = 105;
    wHeight = 150;
  }

  prop = wHeight/wWidth;

  masterMult = wHeight/1500;

  masterMultCanvas = windowHeight/1500;

  resizeCanvas(windowWidth, windowHeight);
  feedbackImage.resizeCanvas(wWidth, wHeight);
  sourceImage.resizeCanvas(wWidth, wHeight);
  paintImage.resizeCanvas(wWidth, wHeight);

  noStroke();
  clear();
  fill(paspartuCol);
  rect(windowWidth/2 -  windowHeight*0.7/2, 0, windowHeight*0.7, windowHeight);


  print(brightness(paspartuCol));

  fill(255);

  textFont(myFont);

  textSize(14*masterMultCanvas*1.8);
  textAlign(CENTER);
  text("Rococo", windowWidth/2, windowHeight/3);

  textSize(18*masterMultCanvas*1.8);
  text(bloomPalleteName + " " + basePalleteName, windowWidth/2, windowHeight/2.75);

  paintImage.background(0);
  paintImage.noStroke();

  feedbackImage.noStroke();
  feedbackImage.background(bgCol);


  sourceImage.noStroke();
  sourceImage.background(  bgCol);


  currentStep = 0;


  for (let i=0; i<tendrils.length; i++) {
    tendrils[i].reset();
  }

  for (let i=0; i<wonders.length; i++) {
    wonders[i].reset();
  }

  loop();
}

function createPaspartu()
{
  paintImage.fill(red(paspartuCol), green(paspartuCol), blue(paspartuCol), 255);

  let w = 0;
  if (wWidth < wHeight)
    w = (time * paspartuSize) * wWidth;
  else
    w = (time * paspartuSize) * wHeight;

  if (currentStep < blurSteps-9)
  {
    paintImage.push();


    //paintImage.translate(-wWdith/2, -wHeight/2);
    paintImage.translate(-wWidth/2, -wHeight/2, 0);

    paintImage.rect(w, 0, wWidth-w*2, w);
    paintImage.rect(0, 0, w, wHeight );
    paintImage.rect(w, wHeight, wWidth-w*2, -w);
    paintImage.rect(wWidth, 0, -w, wHeight );

    paintImage.pop();
  }
}

function keyTyped() {
  if (key === 's') {
    saveCanvas(sourceImage, 'Rococo', 'png');
  }



  if (key == 'p') {
    if (highRes) highRes = false;
    else highRes = true;

    if (highRes)
    {
      wWidth = 4200;
      wHeight = 6000;
    } else
    {
      wWidth = 1050;
      wHeight = 1500;
    }

    windowResized();
  }
}

function createColorPalleteRGB() {
  let LEAVES_NAMES = ["Van", "O'Keeffe", "Latour", "Bosschaert", "Ruysch", "Hunter", "Bonahuida", "Gogh", "Redon", "Haverman", "Matisse", "Redoute", "Huysum", "Aubriet", "North", "Robert", "Dali", "Kahlo", "de Vinci", "Monet", "Leyster", "Nolde", "Cassatt"];
  let BLOOM_NAME = ["Rachel", "Jacob", "Margaretha", "Barbara", "Clemntine", "Arnoldus", "Nicholas", "Amaile", "Ambrosius", "Maria", "Hiroshige", "Marianne", "Paul", "Elisabeth", "Peter", "Jan", "Clude", "Vincent", "Georgia", "Odioln", "Pierre", "Henri", "Valentine", "Johannes", "Catharina", "Emil", "Judith"];

  basePallete = LEAVES_NAMES.indexOf(basePalleteName, 0);
  bloomPallete = BLOOM_NAME.indexOf(bloomPalleteName, 0);

  print("----Leaves: " + basePallete);
  print("----Bloom: " + bloomPallete);

  let selectedColor = floor(random(0, 54.999)) % 5;

  if (isMonochrome == "No")
  {
    for (let i = 0; i < 5; i ++) colors[i] = color(LEAVES[basePallete][i][0], LEAVES[basePallete][i][1], LEAVES[basePallete][i][2]);
    for (let i = 0; i < 5; i ++) blooms[i] = color(BLOOM[bloomPallete][i][0], BLOOM[bloomPallete][i][1], BLOOM[bloomPallete][i][2]);

    bgCol = blooms[floor(random(0, 4.999))];

    paspartuCol = blooms[floor(random(0, 4.999))];
  } else
  {
    for (let i = 0; i < 5; i ++) blooms[i] = color(BLOOM[bloomPallete][i][0], BLOOM[bloomPallete][i][0], BLOOM[bloomPallete][i][0]);
    for (let i = 0; i < 5; i ++) colors[i] = color(LEAVES[basePallete][i][0], LEAVES[basePallete][i][0], LEAVES[basePallete][i][0]);


    BWcolor = color(MONOCOLOR[selectedColor][0], MONOCOLOR[selectedColor][1], MONOCOLOR[selectedColor][2]);

    colors[0] = BWcolor;
    colors[3] = BWcolor;


    bgCol = color(random(15));
    paspartuCol = color(random(15));
  }
}
