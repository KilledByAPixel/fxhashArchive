const rndNum = (max, min = 0) => min + (Math.floor(fxrand() * (max - min)));
const rndArr = (items) => items[rndNum(items.length)];

console.log(fxhash)

let genChance = rndNum(101,0);
const pieValue = 0.003067959;
const oneValue = 0.000976562;
let colourChoiceArray;
if (genChance >= 100) {
  colourChoiceArray = rndArr([18,19,21]);
} else if (genChance > 95) {
  switch (rndNum(0,3)) {
    case 1:
      colourChoiceArray = rndArr([4,10,14]);
      break;
    default:
      colourChoiceArray = rndArr([0,1,3,5,6,7,8,9,11,12,13,15,16,17]);
  }
} else {
  colourChoiceArray = rndArr([0,1,3,5,6,7,8,9,11,12,13,15,16,17]);
}
let colourChoice = colourChoiceArray;

let mainCanvas,canDi,wWidth,wHeight,noiseImage,blurImage,finalImage,hairColourBase,hairChoice,hatChoice,bgThickLinesChoice,iterator,bgThickLineStart,makeClown;
let addBeard =  rndNum(0,20);
let getBaldHorns = rndNum(0,10);
let getClown = rndNum(0,15);
let crosskullsChoice = rndNum(0,5);
let captured = false;
let specialTrait = "none";
let teamChoice = "neutral";
const baseColourList = {
  yellow: [65,100,50],
  blue: [224,100,53],
  red: [8,100,53],
  green: [132,100,48],
  magenta: [303,100,50],
}

let acolyteEyeColour = rndArr([baseColourList.yellow,baseColourList.green,baseColourList.magenta]);

const colourList = [
  {
    name: 'Vanilla',
    bg: [325,95,22],
    base: [19,91,83],
    base2: [19,91,75],
    compliment: [162,58,39],
    mask: [18,60,70],
    highlight: [85,100,54],
    darkaccent: [351,71,13],
    teeth:[0,0,100],
    outline:[351,71,13],
    hex: '#6D0341'
  },
  {
    name: 'Mocha',
    bg: [235,47,49],
    base: [19,34,40],
    base2: [19,50,63],
    compliment: [254,55,32],
    mask: [19,43,34],
    highlight: [189,100,76],
    darkaccent: [266,100,8],
    teeth:[52,0,90],
    outline:[351,71,13],
    hex: '#424CB8'
  },
  {
    name: 'Coffee',
    bg: [40,90,45],
    base: [1,38,24],
    base2: [1,38,24],
    compliment: [323,90,58],
    mask: [1,55,29],
    highlight: [51,100,60],
    darkaccent: [204,49,53],
    teeth:[194,81,96],
    outline:[351,71,13],
    hex: '#D9940B'
  },
  {
    name: 'Chocolate',
    bg: [40,94,60],
    base: [338,48,15],
    base2: [1,38,24],
    compliment: [162,58,39],
    mask: [340,48,28],
    highlight: [206,100,60],
    darkaccent: [266,100,8],
    teeth:[0,0,100],
    outline:[351,71,13],
    hex: '#F9B939'
  },
  {
    name: 'Vampire',
    bg: [341,90,23],
    base: [201,100,36],
    base2: [200,80,95],
    compliment: [190,100,42],
    mask: [189,75,75],
    highlight: [37,100,50],
    darkaccent: [239,94,19],
    teeth:[39,69,58],
    outline:[230,36,23],
    hex: '#6f0627'
  },
  {
    name: 'Sickly Sweet',
    bg: [239,94,19],
    base: [333,93,56],
    base2: [54,93,46],
    compliment: [194,85,62],
    mask: [48,67,79],
    highlight: [60,100,50],
    darkaccent: [333,65,28],
    teeth:[60,100,50],
    outline:[333,100,72],
    hex: '#03045e'
  },
  {
    name: 'DeSat',
    bg: [15,25,9],
    base: [190,24,87],
    base2: [151,24,84],
    compliment: [353,56,51],
    mask: [190,75,37],
    highlight: [194,100,57],
    darkaccent: [333,65,28],
    teeth:[194,100,74],
    outline:[15,25,9],
    hex: '#1d1411'
  },
  {
    name: 'Dreadnaught',
    bg: [8,100,43],
    base: [360,35,5],
    base2: [7,85,31],
    compliment: [0,75,12],
    mask: [0,0,0],
    highlight: [190,24,87],
    darkaccent: [341,77,10],
    teeth:[190,24,87],
    outline:[360,100,61],
    hex: '#db1d00'
  },
  {
    name: 'Synth',
    bg: [60,7,8],
    base: [168,87,58],
    base2: [169,82,42],
    compliment: [219,27,41],
    mask: [206,83,58],
    highlight: [40,93,57],
    darkaccent: [14,77,54],
    teeth:[169,82,42],
    outline:[4,99,66],
    hex: '#161613'
  },
  {
    name: "Hallow's Eve",
    bg: [321,79,12],
    base: [60,100,50],
    base2: [31,100,50],
    compliment: [24,100,50],
    mask: [41,100,60],
    highlight: [47,100,92],
    darkaccent: [347,80,18],
    teeth:[47,100,80],
    outline:[41,100,33],
    hex: '#370626'
  },
  {
    name: 'Zombie',
    bg: [88,38,15],
    base: [101,55,42],
    base2: [77,55,52],
    compliment: [8,100,43],
    mask: [70,100,40],
    highlight: [60,100,62],
    darkaccent: [76,60,8],
    teeth:[60,100,62],
    outline:[88,38,12],
    hex: '#273518'
  },
  {
    name: 'Ouija',
    bg: [337,100,8],
    base: [354,93,22],
    base2: [344,93,22],
    compliment: [48,96,45],
    mask: [358,97,31],
    highlight: [60,100,50],
    darkaccent: [334,100,10],
    teeth:[60,100,50],
    outline:[337,100,15],
    hex: '#290010'
  },
  {
    name: '80s Slasher',
    bg: [287,100,8],
    base: [276,91,38],
    base2: [266,91,38],
    compliment: [0,100,50],
    mask: [266,47,90],
    highlight: [52,100,53],
    darkaccent: [316,100,47],
    teeth:[52,100,53],
    outline:[217,100,50],
    hex: '#200029'
  },
  {
    name: 'Cyanide Bubblegum',
    bg: [312,100,50],
    base: [180,100,50],
    base2: [150,100,70],
    compliment: [201,100,36],
    mask: [266,47,90],
    highlight: [60,100,50],
    darkaccent: [321,79,12],
    teeth:[312,100,70],
    outline:[180,100,30],
    hex: '#ff00cc'
  },
  {
    name: 'G3NXYZ',
    bg: [60,100,40],
    base: [220,100,12],
    base2: [250,100,12],
    compliment: [234,60,38],
    mask: [220,100,20],
    highlight: [0,0,100],
    darkaccent: [261,55,6],
    teeth: [60,100,60],
    outline: [50,100,50],
    hex: '#cccc00'
  },
  {
    name: 'Herbal XXX',
    bg: [331,52,21],
    base: [88,18,90],
    base2: [166,24,85],
    compliment: [88,31,72],
    mask: [88,32,76],
    highlight: [183,100,63],
    darkaccent: [20,68,44],
    teeth: [88,31,66],
    outline: [30,100,12],
    hex: '#511a35'
  },
  {
    name: 'Let Susan Dance',
    bg: [359,94,62],
    base: [21,89,56],
    base2: [201,97,57],
    compliment: [33,94,55],
    mask: [42,93,64],
    highlight: [94,38,59],
    darkaccent: [162,43,46],
    teeth:[178,30,43],
    outline:[208,25,45],
    hex: '#f94346'
  },
  {
    name: 'CR0$$KULL',
    bg: [216,100,4],
    base: [217,100,21],
    base2: [217,100,21],
    compliment: [247,67,25],
    mask: [276,100,20],
    highlight: [60,100,50],
    darkaccent: [168,24,4],
    teeth:[62,86,28],
    outline:[69,62,4],
    hex: '#000814'
  },
  {
    name: 'Acolyte',
    bg: [216,100,4],
    base: [281,100,8],
    base2: [281,100,8],
    compliment: [211,100,24],
    mask: [193,100,52],
    highlight: [183,100,50],
    darkaccent: [209,100,20],
    teeth:[178,100,51],
    outline:[196,43,35],
    hex: '#000814'
  },
  {
    name: 'Ballpoint',
    bg: [31,49,89],
    base: [31,49,89],
    base2: [31,49,89],
    compliment: [200,94,25],
    mask: [0,100,50],
    highlight: [0,0,100],
    darkaccent: [239,94,5],
    teeth:[0,100,50],
    outline:[239,94,25],
    hex: '#F1E4D6'
  },
  {
    name: "Unicorn Barf",
    bg: [267,72,63],
    base: [324,84,65],
    base2: [334,84,65],
    compliment: [18,90,73],
    mask: [195,100,49],
    highlight: [52,99,62],
    darkaccent: [309,33,19],
    teeth:[172,100,48],
    outline:[178,60,32],//[120,100,0],
    hex: '#9B5DE5'
  },
  {
    name: "Pot o' Gold",
    bg: [38,100,50],
    base: [29,100,50],
    base2: [31,100,48],
    compliment: [32,100,50],
    mask: [44,100,50],
    highlight: [55,100,50],
    darkaccent: [35,100,36],
    teeth:[52,100,50],
    outline:[43,100,50],
    hex: '#FFA200'
  },
  {
    name: "DeSatXXX",
    bg: [0,0,10],
    base: [0,0,50],
    base2: [0,0,60],
    compliment: [0,0,75],
    mask: [0,0,80],
    highlight: [0,0,100],
    darkaccent: [0,0,5],
    teeth:[0,0,90],
    outline:[0,0,0],
    hex: '#1a1a1a'
  },
  {
    name: "Rainbow",
    bg: [218,100,63],
    base: [212,80,42],
    base2: [202,80,42],
    compliment: [174,100,29],
    mask: [88,50,53],
    highlight: [45,100,51],
    darkaccent: [36,100,50],
    teeth:[4,90,58],
    outline:[334,79,38],
    hex: '#448AFF'
  },
  {
    name: "beige",
    bg: [21,100,85],
    base: [12,100,82],
    base2: [32,100,82],
    compliment: [358,60,75],
    mask: [348,25,61],
    highlight: [132,100,76],
    darkaccent: [263,6,43],
    teeth:[175,39,75],
    outline:[40,7,8],
    hex: '#FFCDB2'
  },
]

const hairColourChange = [1,2,3,6,9,15];
let colPal = colourList[colourChoice];

function setup() {
  wWidth = windowWidth;
  wHeight = windowHeight;

  if (wWidth < wHeight) {
    canDi = wWidth;
  } else {
    canDi = wHeight;
  }

  mainCanvas = createCanvas(canDi, canDi);
  noLoop();
  colorMode(HSL);

  return canvas;
}

function draw() {

  // create noise image
  createMaskNoise();
  noiseImage = get();

  if (colourChoice === 18) {
    background(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
    createGlitchBlocks(50,[0,canDi],[canDi*0.45,canDi*0.495],acolyteEyeColour);
    specialTrait = "acolyte";
  } else {
    background(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
  }
  changeBackground(colPal.hex);

  //rare text logo background
  if ([18,19,21].includes(colourChoice)) {
  } else {
    switch (rndNum(0,30)) {
      //rndNum(0,30)
      case 1:
        let grapicTextFull
        if (colPal.bg[2] > 40) {
          grapicTextFull = 10;
        } else {
          grapicTextFull = 60;
        }
        stroke(colPal.bg[0],colPal.bg[1],grapicTextFull);
        switch (rndNum(0,5)) {
          case 1:
            iterator = 0;
            for (var i = 0; i < 3; i++) {
              drawLetter('c',0,iterator);
              drawLetter('u',canDi*0.25,iterator);
              drawLetter('l',canDi*0.495,iterator);
              drawLetter('t',canDi*0.7,iterator);
              iterator += canDi*0.345;
            }
            specialTrait = 'CULT';
            break;
          case 2:
            let vertIterator = 0;
            let wordArr = [['d','a','s'],['o','c','c'],['u','l','t']];
            for (var i = 0; i < wordArr.length; i++) {
              iterator = 0;
              for (var j = 0; j < wordArr[i].length; j++) {
                drawLetter(wordArr[i][j],iterator,vertIterator);
                iterator += canDi*0.35;
              }
              vertIterator += canDi*0.345;
            }
            specialTrait = 'DAS OCCULT';
            break;
          case 3:
            iterator = 0;
            push();
            translate(0,canDi*0.05);
            scale(0.75);
            for (var i = 0; i < 3; i++) {
              drawLetter('o',0,iterator);
              drawLetter('c',canDi*0.225,iterator);
              drawLetter('c',canDi*0.45,iterator);
              drawLetter('u',canDi*0.65,iterator);
              drawLetter('l',canDi*0.875,iterator);
              drawLetter('t',canDi*1.05,iterator);
              iterator += canDi*0.45;
            }
            pop();
            specialTrait = 'OCCULT';
            break;
          case 4:
            push();
            translate(0,canDi*0.05);
            scale(0.75);
            drawLetter('o',0);
            drawLetter('c',canDi*0.225);
            drawLetter('c',canDi*0.45);
            drawLetter('u',canDi*0.65);
            drawLetter('l',canDi*0.875);
            drawLetter('t',canDi*1.05);
            translate(0,canDi*0.475);
            drawLetter('m',0);
            drawLetter('y',canDi*0.165);
            drawLetter('s',canDi*0.345);
            drawLetter('t',canDi*0.51);
            drawLetter('e',canDi*0.715);
            drawLetter('r',canDi*0.925);
            drawLetter('y',canDi*1.05);
            translate(0,canDi*0.425);
            drawLetter('s',0);
            drawLetter('e',canDi*0.2);
            drawLetter('r',canDi*0.42);
            drawLetter('v',canDi*0.57);
            drawLetter('i',canDi*0.7);
            drawLetter('c',canDi*0.87);
            drawLetter('e',canDi*1.05);
            pop();
            specialTrait = 'MYSTERY';
            break;
          default:
            drawGXYZ();
            drawGXYZ(canDi*0.355);
            drawGXYZ(canDi*0.7);
            specialTrait = 'GXYZ';
        }
        break;
      default:
    }
  }
  strokeCap(ROUND);
  //bg lines
  let bgLinesChoice;
  if (colourChoice === 18) {
    bgLinesChoice = rndArr([1,2]);
  } else if (colourChoice === 19) {
    bgLinesChoice = rndArr([5]);
  } else {
    bgLinesChoice = rndArr([0,1,2,3,4]);
  }
  if (colPal.bg[2] > 40) {
    grapicTextFull = -10;
  } else {
    grapicTextFull = 5;
  }
  stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]+grapicTextFull);
  strokeWeight(canDi*0.005);
  iterator = 0;
  switch (bgLinesChoice) {
    case 0:
      break;
    case 1:
      for (let bgStrokes = 0; bgStrokes < 79; bgStrokes++) {
        line(canDi*0.013+iterator,0,canDi*0.013+iterator,rndNum(canDi*0.25,canDi));
        iterator += canDi*0.015;
      }
      break;
    case 2:
      for (let bgStrokes = 0; bgStrokes < 39; bgStrokes++) {
        line(canDi*0.025+iterator,0,canDi*0.025+iterator,rndNum(canDi*0.25,canDi));
        iterator += canDi*0.025;
      }
      break;
    case 3:
      for (let bgStrokes = 0; bgStrokes < 39; bgStrokes++) {
        line(canDi*0.025+iterator,canDi,canDi*0.025+iterator,rndNum(0,canDi*0.85));
        iterator += canDi*0.025;
      }
      break;
    case 4:
      for (let bgStrokes = 0; bgStrokes < 79; bgStrokes++) {
        line(canDi*0.013+iterator,canDi,canDi*0.013+iterator,rndNum(0,canDi*0.85));
        iterator += canDi*0.015;
      }
      break;
    case 5:
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]+20,0.5);
      strokeWeight(canDi*0.005);
      for (let bgStrokes = 0; bgStrokes < 15; bgStrokes++) {
        line(0,canDi*0.013+iterator,canDi,canDi*0.013+iterator);
        iterator += canDi*0.075;
      }
      break;
  }

  //scruff marks
  function drawScuffMarks(scuffChoice){
    let iterator = 0;
    let vertIterator = 0;
    switch (scuffChoice) {
      case 1:
        xSS = canDi*0.995;
        ySS = 0;
        for (var i = 0; i < rndNum(150,550); i++) {
          line(xSS+iterator,ySS,xSS+iterator,ySS+rndNum(canDi*0.015,canDi*0.45)-vertIterator);
          iterator -= canDi*0.0015;
          vertIterator += canDi*0.0015;
        }
        break;
      case 2:
        xSS = canDi*0.995;
        ySS = canDi;
        for (var i = 0; i < rndNum(150,550); i++) {
          line(xSS+iterator,ySS,xSS+iterator,ySS-rndNum(canDi*0.015,canDi*0.45)+vertIterator);
          iterator -= canDi*0.0015;
          vertIterator += canDi*0.0015;
        }
        break;
      case 3:
        xSS = canDi*0.005;
        ySS = canDi;
        for (var i = 0; i < rndNum(150,550); i++) {
          line(xSS+iterator,ySS,xSS+iterator,ySS-rndNum(canDi*0.015,canDi*0.45)+vertIterator);
          iterator += canDi*0.0015;
          vertIterator += canDi*0.0015;
        }
        break;
      default:
        xSS = canDi*0.005;
        ySS = 0;
        for (var i = 0; i < rndNum(150,550); i++) {
          line(xSS+iterator,ySS,xSS+iterator,ySS+rndNum(canDi*0.015,canDi*0.45)-vertIterator);
          iterator += canDi*0.0015;
          vertIterator += canDi*0.0015;
        }
    }
  }
  if ([18,19].includes(colourChoice)) {
  } else {
    switch (rndNum(0,20)) {
      case 1:
        let xSS, ySS;//scruff marks starting points
        if (colPal.bg[2] < 70) {
          stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]+20,0.35);
        } else {
          stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]-20,0.35);
        }
        strokeWeight(canDi*0.0025);
        let scuffArray = rndArr([[0,1,3],[1,2],[0,3],[0,1,2],[1,2,3],[0,2,3],[1,3],[0,1,2,3]]);
        specialTrait = 'scuff marks';
        for (var i = 0; i < scuffArray.length; i++) {
          iterator = 0;
          drawScuffMarks(scuffArray[i]);
        }
        break;
      default:
    }
  }


  //possibly add dripping paint to the BG
  if ([18,19].includes(colourChoice)) {
    //pass
  } else {
    switch (rndNum(0,20)) {
      case 1:
        stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]+5);
        strokeWeight(canDi*0.015);
        bgThickLinesChoice = rndArr([0,0,1]);
        iterator = 0;
        bgThickLineStart = rndNum(canDi*0.05,canDi*0.075);
        specialTrait = "wet paint?";
        for (let slasherStrokes = 0; slasherStrokes < rndNum(4,16); slasherStrokes++) {
          line(bgThickLineStart+iterator,0,bgThickLineStart+iterator,rndNum(canDi*0.05,canDi*0.45));
          iterator += canDi*0.015;
        }
        for (let slasherStrokes = 0; slasherStrokes < rndNum(1,7); slasherStrokes++) {
          line(bgThickLineStart+canDi*0.7+iterator,0,bgThickLineStart+canDi*0.7+iterator,rndNum(canDi*0.05,canDi*0.95));
          iterator += canDi*0.015;
        }
        break;
      default:
    }
  }

  //bg guide
  //setGuide(colPal,canDi);

  //get random choices for all traits
  let headChoice = rndArr([0,0,0,1,1,2]);
  let headBaseColour = rndArr([0,1]);
  let overlayChoice;
  if (colourChoice === 18) {
    overlayChoice = rndArr([0,1,2,3,4]);
  } else {
    overlayChoice = rndArr([0,1,2,3,4,5]);
  }
  let mouthChoice;
  if (colourChoice === 18){
    mouthChoice = rndArr([8,9,10,11,12,15,18,19]);
  } else {
    mouthChoice = rndArr([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]);
  }
  let noseChoice = rndArr([0,1,2,3,4,5,6,7,8,9,10,11,12,13]);
  if ((colourChoice === 12) && (getClown === 1)) {
    makeClown = 1;
    mouthChoice = rndArr([7,18]);
    noseChoice = 1;
  } else {
    makeClown = 0;
  }
  let socketChoice;
  if (colourChoice === 18) {
    socketChoice = rndArr([1,3,5,6,10,11]);
  } else {
    socketChoice = rndArr([0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12]);
  }
  let clothingChoice = rndArr([0,0,0,1,1,2,3,3,4]);
  if (colourChoice === 18){
    hairChoice = rndArr([0,1,2,3,7,8,9,10,11,12,13,14,15,16,17,18]);
  } else {
    hairChoice = rndArr([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]);
  }
  switch (hairChoice) {
    case 0:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13]);
      break;
    case 1:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,13]);
      break;
    case 2:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,13]);
      break;
    case 3:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13]);
      break;
    case 4:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13]);
      break;
    case 5:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,3,4,5,6,7,8]);
      break;
    case 6:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,3,4,5,6,7,8]);
      break;
    case 7:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,3,4,5,6,7,8]);
      break;
    case 8:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,3,4,5,9,10,11]);
      break;
    case 9:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13]);
      break;
    case 10:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,3,4,5,12]);
      break;
    case 11:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13]);
      break;
    case 12:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13]);
      break;
    case 13:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,3,4,5,9,10,11,12,13]);
      break;
    case 14:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,1,2,3,4,5,9,10,11,12,13]);
      break;
    case 15:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,3,4,5,9,10,11]);
      break;
    case 16:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13]);
      break;
    case 17:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13]);
      break;
    case 18:
      hatChoice = rndArr([0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13]);

  }
  let hairColourChoice;
  switch (hairChoice) {
    case 1:
      hairColourChoice = 0;
      break;
    case 2:
      hairColourChoice = rndArr([0,2]);
      break;
    case 3:
      hairColourChoice = rndArr([0,2,4]);
      break;
    case 4:
      hairColourChoice = rndArr([0,2,4]);
      break;
    case 5:
      hairColourChoice = rndArr([0,1,2,3,4]);
      break;
    case 6:
      hairColourChoice = rndArr([0,2]);
      break;
    case 7:
      hairColourChoice = rndArr([2,3]);
      break;
    case 8:
      hairColourChoice = rndArr([0,1,2]);//2 ONLY?
      break;
    case 9:
      hairColourChoice = rndArr([0]);
      break;
    case 10:
      hairColourChoice = rndArr([0,2]);
      break;
    case 11:
      hairColourChoice = rndArr([0,1,2,3,4]);
      break;
    case 12:
      hairColourChoice = rndArr([0,1,2,3,4]);
      break;
    case 13:
      hairColourChoice = rndArr([0,2,3,4]);
      break;
    case 14:
      hairColourChoice = rndArr([3,5]);
      break;
    case 15:
      hairColourChoice = rndArr([0,3,5]);
      break;
    case 16:
      hairColourChoice = rndArr([0,1,2,3,4]);
      break;
    case 17:
      hairColourChoice = rndArr([0,1,2,3,4]);
      break;
    case 18:
      hairColourChoice = rndArr([0,1,2,3,4]);
    default:
  }
  switch (hairColourChoice) {
    case 1:
      hairColourBase = [colPal.darkaccent[0],colPal.darkaccent[1],colPal.mask[2]];
      break;
    case 2:
      hairColourBase = [colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]];
      break;
    case 3:
      hairColourBase = [colPal.mask[0],colPal.mask[1],colPal.darkaccent[2]];
      break;
    case 4:
      hairColourBase = [colPal.compliment[0],colPal.compliment[1],colPal.outline[2]];
      break;
    case 5:
      hairColourBase = [colPal.mask[0],colPal.mask[1],colPal.compliment[2]];
      break;
    default:
      hairColourBase = [colPal.darkaccent[0],colPal.darkaccent[1],colPal.compliment[2]];
  }
  let earChoice = rndArr([0,1,2,3,4]);
  let eyeChoice;
  if (colourChoice === 18) {
    eyeChoice = 24;
  } else {
    eyeChoice = rndArr([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,18,19,20,21,23,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,23,25]);
  }
  switch (rndNum(0,150)) {
    case 99:
      eyeChoice = 26;
      specialTrait = 'l@Z3r';
      break;
    default:
  }
  if (colourChoice == 9) {
      switch (rndNum(0,100)) {
        case 1:
          overlayChoice = 0;
          socketChoice = 0;
          noseChoice = 14;
          eyeChoice = 22;
          specialTrait = 'pumpkin';
          break;
        default:
      }
  }

  //declare variables to store choices for the $fxhashFeatures
  let headSelection, hatSelection, mouthSelection, hairSelection, eyesSelection, noseSelection;
  //set the back hair
  setBackHair(hairChoice,hatChoice,colPal,canDi);
  //set clothing
  setClothingBack(clothingChoice,headChoice,colPal,canDi)
  //create the head
  headSelection = setHead(headChoice,headBaseColour,colourChoice,colPal,canDi);
  //create the overlay
  setOverlay(overlayChoice,headBaseColour,headChoice,hairChoice,colPal,canDi);
  //set the eye sockets
  setSockets(socketChoice,colPal,canDi);
  //set clothing
  setClothing(clothingChoice,headChoice,colPal,canDi)

  if ([15,16,17,25].includes(eyeChoice)) {
    //set the hair
    hairSelection = setHair(hairChoice,hatChoice,colPal,canDi);
    //set the hat
    hatSelection = setHat(hatChoice,colPal,canDi);
    //set eye extras
    setEyeExtras(eyeChoice,colPal,canDi);
    //set an ear
    setEar(earChoice,colPal,headBaseColour,canDi);
  } else if ([6].includes(hairChoice)) {
    //set eye extras
    setEyeExtras(eyeChoice,colPal,canDi);
    //set an ear
    setEar(earChoice,colPal,headBaseColour,canDi);
    //set the hair
    hairSelection = setHair(hairChoice,hatChoice,colPal,canDi);
    //set the hat
    hatSelection = setHat(hatChoice,colPal,canDi);
  } else {
    //set eye extras
    setEyeExtras(eyeChoice,colPal,canDi);
    //set the hair
    hairSelection = setHair(hairChoice,hatChoice,colPal,canDi);
    //set the hat
    hatSelection = setHat(hatChoice,colPal,canDi);
    //set an ear
    setEar(earChoice,colPal,headBaseColour,canDi);
  }

  drawBeardHair(canDi*0.445,canDi*0.5,headChoice,hairChoice,mouthChoice,addBeard);
  //set the mouth
  mouthSelection = setMouth(mouthChoice,eyeChoice,colPal,canDi);
  //set the nose
  noseSelection = setNose(noseChoice,colPal,canDi);
  //set the Eyes
  eyesSelection = setEyes(eyeChoice,colPal,canDi);


  //final processing on images
  if (colourChoice === 19) {
    createMaskNoise(5000,[0,canDi],[0,canDi],canDi*0.0025,100,1);
    specialTrait = 'doodle';
  }

  if (colourChoice === 21) {
    specialTrait = 'golden';
  }

  if (colourChoice === 18 ) {
    postProcessGlitch(canDi*0.0075);
  } else {
    postProcess(canDi*0.0013);
  }
  window.$fxhashFeatures = {
    "palette": colPal.name,
    "size": headSelection,
    "hair": hairSelection,
    "hat": hatSelection,
    "mouth": mouthSelection,
    "nose": noseSelection,
    "eyes": eyesSelection,
    "special": specialTrait,
    "team": teamChoice,
  }

  if (!captured) {
    if (fxpreview != undefined) fxpreview();
    captured = true;
  }
}

function drawMustache(mCrds=[canDi*0.625,canDi*0.73,canDi*0.675,canDi*0.72],hairChoice,mouthChoice,addBeard=0,stacheLength=9){
  stroke(hairColourBase);
  let stacheRow,sA;
  strokeWeight(rndNum(canDi*0.01,canDi*0.015));
  noFill();
  switch (addBeard) {
    case 1:
      if ([0,2,3,4,5,6,7,8,9,10,13,14,15].includes(hairChoice)) {
        if ([1,2,3].includes(mouthChoice)) {
          stroke(hairColourBase);
          strokeWeight(rndNum(canDi*0.02,canDi*0.025));
          noFill();
          createMustache(mCrds);
        }
      }
      break;
    default:
  }
  function createMustache(){
    iterator = 0;
    vertIterator = 0;
    let sA = canDi*0.045;
    let nCrds = [mCrds[0]-(sA*0.65),
    mCrds[1]-sA,
    (mCrds[0]-(sA*0.65))+(((mCrds[2]+sA)-(mCrds[0]-(sA*0.65)))/2),
    (mCrds[3]-(sA*0.65))-(((mCrds[3]-(sA*0.65))-(mCrds[1]-sA))/2)-canDi*0.0085,
    mCrds[2]+(sA*0.5),
    mCrds[3]-(sA*0.65)];
    beginShape();
    curveVertex(nCrds[0],nCrds[1]);
    curveVertex(nCrds[0],nCrds[1]);
    curveVertex(nCrds[2],nCrds[3]);
    curveVertex(nCrds[4],nCrds[5]);
    curveVertex(nCrds[4],nCrds[5]);
    endShape();

    let c1 = createVector(nCrds[0],nCrds[1]);
    let c2 = createVector(nCrds[4],nCrds[5]);
    iterator = 0;
    vertIterator = c1.y;
    for (var i = 0; i < stacheLength; i++) {
      line(c1.x+iterator,vertIterator,c1.x+iterator+rndNum(-canDi*0.015,canDi*0.015),vertIterator+canDi*0.025);
      iterator += canDi*0.015;
      vertIterator += (c2.y-vertIterator)/((stacheLength+1)-(i+1));
    }

  }
}
function drawSoulPatch(x,y,hairChoice,mouthChoice,addBeard=0){
  stroke(hairColourBase);
  let stacheRow;
  strokeWeight(rndNum(canDi*0.01,canDi*0.015));
  noFill();
  switch (addBeard) {
    case 1:
      if ([0,2,3,4,5,6,7,8,9,10,13,14,15].includes(hairChoice)) {
        if ([1,2,3].includes(mouthChoice)) {
          stroke(hairColourBase);
          strokeWeight(rndNum(canDi*0.01,canDi*0.015));
          noFill();
          createPatch(x,y);
        }
      }
      break;
    default:
  }
  function createPatch(){
    stacheRow = [1,2,4,6,3];
    iterator = 0
    for (var i = 0; i < stacheRow.length; i++) {
      for (var j = 0; j < stacheRow[i]; j++) {
        line(x,y,x+rndNum(-canDi*0.015,canDi*0.035),y+rndNum(canDi*0.05,canDi*0.075));
        line(x+rndNum(-canDi*0.015,canDi*0.015),y+iterator,x+rndNum(-canDi*0.015,canDi*0.035),y+rndNum(canDi*0.05,canDi*0.075)+iterator);
        iterator += canDi*0.0015;
      }
    }
  }
}
function drawBeardHair(x,y,widthRange=0,hairChoice,mouthChoice,addBeard=0){
  switch (addBeard) {
    case 1:
      if ([0,2,3,4,5,6,7,8,9,10,13,14,15].includes(hairChoice)) {
        if ([1,2,3].includes(mouthChoice)) {
          stroke(hairColourBase);
          strokeWeight(canDi*0.025);//rndNum(canDi*0.01,canDi*0.015));
          fill(hairColourBase);
          specialTrait = 'beard';
          let xOffset = 0;
          let lineRows = 10;
          let lineColumns = 26;
          let vertIterator = 0;
          beginShape();
          curveVertex(x-canDi*0.015,y-canDi*0.015);
          curveVertex(x-canDi*0.015,y-canDi*0.015);
          curveVertex(x,y);
          curveVertex(x+canDi*0.015,y+canDi*0.1);
          curveVertex(x+canDi*0.04,y+canDi*0.2);
          curveVertex(x+canDi*0.075,y+canDi*0.275);
          curveVertex(x+canDi*0.175,y+canDi*0.3);
          curveVertex(x+canDi*0.25,y+canDi*0.3);
          curveVertex(x+canDi*0.275,y+canDi*0.275);
          curveVertex(x+canDi*0.275,y+canDi*0.35);
          curveVertex(x+canDi*0.2,y+canDi*0.395);
          curveVertex(x+canDi*0.1,y+canDi*0.38);
          curveVertex(x+canDi*0.025,y+canDi*0.325);
          curveVertex(x-canDi*0.015,y+canDi*0.25);
          curveVertex(x-canDi*0.015,y+canDi*0.15);
          curveVertex(x-canDi*0.015,y-canDi*0.015);
          curveVertex(x-canDi*0.015,y-canDi*0.015);
          endShape();
          noFill();
          for (var i = 0; i < lineRows; i++) {
            let colChange;
            let iterator = 0;
            switch (i) {
              case 0:
                colChange = 0;
                break;
              case 1:
                colChange = 0;
                break;
              case 2:
                colChange = 0;
                break;
              case 3:
                colChange = 2;
                break;
              case 4:
                colChange = 2;
                break;
              case 5:
                colChange = 2;
                break;
              case 6:
                colChange = 2;
                break;
              case 7:
                colChange = 2;
                break;
              case 8:
                colChange = 2;
                break;
              default:
                colChange = lineColumns;
            }
            for (var j = 0; j < colChange; j++) {
              let xRand = rndNum(-canDi*0.05,canDi*0.05);
              let yRand = rndNum(canDi*0.05,canDi*0.1);
              let xChange = rndNum(-canDi*0.01,canDi*0.01);
              line(x+iterator,y+vertIterator,x+xRand+iterator,y+yRand+vertIterator);
              line(x+iterator,y+vertIterator,x+xRand+iterator+rndNum(-canDi*0.015,canDi*0.015),y+yRand+vertIterator);
              line(x+xChange+iterator,y+xChange+vertIterator,x+xChange+xRand+iterator,y+yRand+vertIterator);
              iterator = iterator + canDi*0.011;
            }
            if (i > 4) {
              vertIterator += canDi*0.03;
            } else {
              vertIterator += canDi*0.0365;
            }
          }
        }
      }
      break;
    default:
  }
}
function changeBackground(color) {
   document.body.style.backgroundColor = color;
}
function setGuide(colPal,canDi) {
  stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
  fill(0,0,0,0);
  strokeWeight(canDi*0.004);
  circle(canDi*0.5,canDi*0.5,canDi*0.992)
}
async function postProcessGlitch(shiftAmount){
  //postProcess(canDi*0.0035);
  let img = await canvasToImage(mainCanvas.canvas);
  createGlitchBlocks(10,[canDi*0.35,canDi*0.75],[canDi*0.15,canDi*0.85],baseColourList.green);


  blendMode(LIGHTEST);
  img.filter(ERODE);
  tint(110,100,62);//green
  image(img,shiftAmount+rndArr([-canDi*0.015,canDi*0.015]),shiftAmount+rndNum(canDi*0.015,canDi*0.015)*-1,canDi,canDi);
  //postProcess(canDi*0.0035);

  blendMode(LIGHTEST);
  img.filter(THRESHOLD);
  tint(0,100,56);//red
  image(img,shiftAmount+rndArr([-canDi*0.015,canDi*0.015]),shiftAmount+rndArr([-canDi*0.015,canDi*0.015]),canDi,canDi);
  //postProcess(canDi*0.0035);
  createGlitchBlocks(10,[canDi*0.35,canDi*0.75],[canDi*0.15,canDi*0.85],baseColourList.yellow);

  blendMode(LIGHTEST);
  img.filter(ERODE);
  tint(281,100,52);//magenta
  image(img,shiftAmount+rndArr([-canDi*0.015,canDi*0.015]),shiftAmount+rndArr([-canDi*0.015,canDi*0.015]),canDi,canDi);

  postProcess(canDi*0.0035);
  createGlitchBlocks(10,[canDi*0.35,canDi*0.75],[canDi*0.15,canDi*0.85],baseColourList.blue);
  // add the eyes
  //blendMode(BLEND);
  setEnlightenedEyes(acolyteEyeColour);
  //createGlitchBlocks(50,[canDi*0.5,canDi*0.6],[canDi*0.375,canDi*0.575],acolyteEyeColour);
  createGlitchBlocks(50,[0,canDi],[canDi*0.425,canDi*0.475],acolyteEyeColour);
  stroke(colPal.base[0],colPal.base[1],colPal.base[2]);
  noFill();
  strokeWeight(canDi*0.0085);
  for (let eyeStrokes = 0; eyeStrokes < rndNum(1,5); eyeStrokes++) {
    drawEyeX();
  }
  for (let eyeStrokes = 0; eyeStrokes < rndNum(1,5); eyeStrokes++) {
    drawEyeX(1);
  }
  final_img.mask(noiseImage);
  image(final_img,canDi*0.00175*rndArr([-1,1]),canDi*0.00175*rndArr([-1,1]),canDi,canDi);
  postProcess(canDi*0.0035);
}
async function postProcess(shiftAmount){
  let img = await canvasToImage(mainCanvas.canvas);
  img.mask(noiseImage);
  image(img,shiftAmount*rndArr([-1,1]),shiftAmount*rndArr([-1,1]),canDi,canDi);
}

//trait functions
function setHead(headChoice,headBaseColour,colourChoice,colPal,canDi) {
  let xP1;
  strokeWeight(canDi*0.015);
  baseColourChange(headBaseColour);
  switch (rndArr([0,0,1])) {
    case 1:
      noStroke();
      break;
    default:
      switch (headBaseColour) {
        case 1:
          stroke(colPal.base2[0],colPal.base2[1],colPal.base2[2]);
          break;
        default:
          stroke(colPal.base[0],colPal.base[1],colPal.base[2]);
      }
  }
  if (colourChoice === 18) {
    stroke(colPal.base[0],colPal.base[1],colPal.base[2]);
    fill(colPal.base[0],colPal.base[1],colPal.base[2]);
    ellipse(canDi*0.526,canDi*0.426,canDi*0.43,canDi*0.4);
    //moving parts
    xP1 = canDi*0.65;
    rect(xP1-canDi*0.27,canDi*0.35,xP1-canDi*0.52,canDi*0.65);
    //cheek ellipse
    ellipse(xP1-canDi*0.05,canDi*0.625,canDi*0.25,canDi*0.45);
    //chin ellipse
    ellipse(xP1-canDi*0.055,canDi*0.8,canDi*0.235,canDi*0.1);
    strokeWeight(canDi*0.025);
    noFill();
    //back of head curve
    bezier(canDi*0.338,canDi*0.495,canDi*0.36,canDi*0.55,canDi*0.36,canDi*0.62,canDi*0.362,canDi*0.62);
    //full face curve
    bezier(canDi*0.728,canDi*0.425,canDi*0.73,canDi*0.49,canDi*0.717,canDi*0.59,canDi*0.7,canDi*0.8);
    stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
    strokeWeight(rndNum(canDi*0.0065,canDi*0.0085));
    noFill();
    beginShape();
    curveVertex(canDi*0.735,canDi*0.4);
    curveVertex(canDi*0.735,canDi*0.4);
    curveVertex(canDi*0.715,canDi*0.7);
    curveVertex(canDi*0.71,canDi*0.8);
    curveVertex(canDi*0.65,canDi*0.84);
    curveVertex(canDi*0.52,canDi*0.84);
    curveVertex(canDi*0.52,canDi*0.84);
    endShape();
    beginShape();
    curveVertex(canDi*0.52,canDi*0.838);
    curveVertex(canDi*0.52,canDi*0.838);
    curveVertex(canDi*0.523,canDi*0.9);
    curveVertex(canDi*0.52,canDi+canDi*0.1);
    curveVertex(canDi*0.52,canDi+canDi*0.1);
    endShape();
    beginShape();
    curveVertex(canDi*0.335,canDi*0.52);
    curveVertex(canDi*0.335,canDi*0.52);
    curveVertex(canDi*0.35,canDi*0.575);
    curveVertex(canDi*0.353,canDi*0.7);
    curveVertex(canDi*0.356,canDi*0.82);
    curveVertex(canDi*0.36,canDi+canDi*0.1);
    curveVertex(canDi*0.36,canDi+canDi*0.1);
    endShape();
    beginShape();
    curveVertex(canDi*0.335,canDi*0.52);
    curveVertex(canDi*0.335,canDi*0.52);
    curveVertex(canDi*0.32,canDi*0.45);
    curveVertex(canDi*0.33,canDi*0.35);
    curveVertex(canDi*0.4,canDi*0.27);
    curveVertex(canDi*0.475,canDi*0.235);
    curveVertex(canDi*0.55,canDi*0.235);
    curveVertex(canDi*0.65,canDi*0.265);
    curveVertex(canDi*0.71,canDi*0.33);
    curveVertex(canDi*0.735,canDi*0.4);
    curveVertex(canDi*0.735,canDi*0.4);
    endShape();
    let bgNoise = 150;
    while (bgNoise > 0) {
      createFibers(1,[canDi*0.375,canDi*0.52],[canDi*0.85,canDi],colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      bgNoise--;
    }
  } else {
    switch (headChoice) {
      case 0:
        //base head
        beginShape();
        curveVertex(canDi*0.52,canDi+canDi*0.1);
        curveVertex(canDi*0.531,canDi*0.9);
        curveVertex(canDi*0.55,canDi*0.845);
        curveVertex(canDi*0.65,canDi*0.84);
        curveVertex(canDi*0.71,canDi*0.8);
        curveVertex(canDi*0.715,canDi*0.7);
        curveVertex(canDi*0.735,canDi*0.4);
        curveVertex(canDi*0.715,canDi*0.32);
        curveVertex(canDi*0.65,canDi*0.265);
        curveVertex(canDi*0.55,canDi*0.235);
        curveVertex(canDi*0.475,canDi*0.235);
        curveVertex(canDi*0.4,canDi*0.27);
        curveVertex(canDi*0.33,canDi*0.35);
        curveVertex(canDi*0.32,canDi*0.45);
        curveVertex(canDi*0.335,canDi*0.52);
        curveVertex(canDi*0.353,canDi*0.7);
        curveVertex(canDi*0.356,canDi*0.82);
        curveVertex(canDi*0.376,canDi+canDi*0.1);
        endShape(CLOSE);
        break;
      case 1:
        //thin neck head
        beginShape();
        curveVertex(canDi*0.51,canDi+canDi*0.1);
        curveVertex(canDi*0.515,canDi*0.9);
        curveVertex(canDi*0.54,canDi*0.845);
        curveVertex(canDi*0.65,canDi*0.843);
        curveVertex(canDi*0.71,canDi*0.8);
        curveVertex(canDi*0.715,canDi*0.7);
        curveVertex(canDi*0.735,canDi*0.4);
        curveVertex(canDi*0.715,canDi*0.32);
        curveVertex(canDi*0.65,canDi*0.265);
        curveVertex(canDi*0.55,canDi*0.235);
        curveVertex(canDi*0.475,canDi*0.235);
        curveVertex(canDi*0.4,canDi*0.27);
        curveVertex(canDi*0.33,canDi*0.35);
        curveVertex(canDi*0.32,canDi*0.45);
        curveVertex(canDi*0.335,canDi*0.52);
        curveVertex(canDi*0.373,canDi*0.7);
        curveVertex(canDi*0.376,canDi*0.82);
        curveVertex(canDi*0.385,canDi+canDi*0.1);
        endShape(CLOSE);
        break;
      case 2:
        //thick neck head
        beginShape();
        curveVertex(canDi*0.57,canDi+canDi*0.1);
        curveVertex(canDi*0.57,canDi+canDi*0.1);
        curveVertex(canDi*0.575,canDi*0.9);
        curveVertex(canDi*0.595,canDi*0.855);
        curveVertex(canDi*0.65,canDi*0.84);
        curveVertex(canDi*0.71,canDi*0.8);
        curveVertex(canDi*0.715,canDi*0.7);
        curveVertex(canDi*0.735,canDi*0.4);
        curveVertex(canDi*0.715,canDi*0.32);
        curveVertex(canDi*0.65,canDi*0.265);
        curveVertex(canDi*0.55,canDi*0.235);
        curveVertex(canDi*0.475,canDi*0.235);
        curveVertex(canDi*0.4,canDi*0.27);
        curveVertex(canDi*0.33,canDi*0.35);
        curveVertex(canDi*0.32,canDi*0.45);
        curveVertex(canDi*0.335,canDi*0.52);
        curveVertex(canDi*0.353,canDi*0.7);
        curveVertex(canDi*0.356,canDi*0.82);
        curveVertex(canDi*0.38,canDi+canDi*0.1);
        endShape(CLOSE);
        break;
    }1
  }
  let headDescription = {0:'MM',1:'SM',2:'LG'};
  return headDescription[headChoice];
}
function setOverlay(overlayChoice,headBaseColour,headChoice,hairChoice,colPal,canDi) {
  let iterator = 0;
  let tempXRange,headLinesChoice,neckWidth,xStart;
  switch(overlayChoice) {
    case 0:
      //no overlay
      break;
    case 1:
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      fill(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      strokeWeight(canDi*0.0175);
      beginShape();
      curveVertex(canDi*0.36,canDi*0.525);
      curveVertex(canDi*0.36,canDi*0.525);
      curveVertex(canDi*0.7,canDi*0.395);
      curveVertex(canDi*0.65,canDi*0.275);
      curveVertex(canDi*0.525,canDi*0.24);
      curveVertex(canDi*0.428,canDi*0.26);
      curveVertex(canDi*0.35,canDi*0.33);
      curveVertex(canDi*0.33,canDi*0.45);
      curveVertex(canDi*0.36,canDi*0.525);
      curveVertex(canDi*0.36,canDi*0.525);
      endShape();
      noFill();
      for (let headStrokes = 0; headStrokes < 11; headStrokes++) {
        line(canDi*0.365+iterator,canDi*0.365,canDi*0.365+iterator,rndNum(canDi*0.575,canDi*0.75));
        iterator = iterator + canDi*0.035;
      }
      iterator = 0;
      for (let headStrokes = 0; headStrokes < 10; headStrokes++) {
        line(canDi*0.3825+iterator,canDi*0.41,canDi*0.3825+iterator,rndNum(canDi*0.5,canDi*0.62));
        iterator = iterator + canDi*0.035;
      }
      break;
    case 2:
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      fill(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      strokeWeight(rndNum(canDi*0.0015,canDi*0.0085));
      ellipse(canDi*0.526,canDi*0.415,canDi*0.4,canDi*0.32);
      rect(canDi*0.48,canDi*0.38,canDi*0.26,canDi*0.245,canDi*0.0078,canDi*0.0078,canDi*0.0078,canDi*0.0078);
      rect(canDi*0.54,canDi*0.58,canDi*0.16,canDi*0.1,canDi*0.0078,canDi*0.0078,canDi*0.1,canDi*0.1);
      strokeWeight(canDi*0.023);
      dripSpine();
      stroke(colPal.base[0],colPal.base[1],colPal.base[2]);
      fill(colPal.base[0],colPal.base[1],colPal.base[2]);
      strokeWeight(canDi*0.02);
      stroke(colPal.base[0],colPal.base[1],colPal.base[2]);
      strokeWeight(canDi*0.01);
      iterator = 0;
      for (let headStrokes = 0; headStrokes < 7; headStrokes++) {
        line(canDi*0.52+iterator,rndNum(canDi*0.4,canDi*0.425),canDi*0.52+iterator,rndNum(canDi*0.575,canDi*0.625));
        iterator = iterator + canDi*0.015;
      }
      iterator = 0;
      for (let headStrokes = 0; headStrokes < 4; headStrokes++) {
        line(canDi*0.675+iterator,rndNum(canDi*0.4,canDi*0.425),canDi*0.675+iterator,rndNum(canDi*0.575,canDi*0.625));
        iterator = iterator + canDi*0.015;
      }
      let dripJaw = rndArr([0,1]);
      switch (dripJaw) {
        case 0:
          break;
        case 1:
          stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
          strokeWeight(canDi*0.015);
          iterator = 0;
          for (let headStrokes = 0; headStrokes < 11; headStrokes++) {
            line(canDi*0.545+iterator,canDi*0.65,canDi*0.545+iterator,rndNum(canDi*0.695,canDi*0.8));
            iterator = iterator + canDi*0.015;
          }
          break;
      }
      break;
    case 3:
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      fill(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      strokeWeight(rndNum(canDi*0.0015,canDi*0.0085));
      ellipse(canDi*0.526,canDi*0.415,canDi*0.4,canDi*0.32);
      rect(canDi*0.48,canDi*0.38,canDi*0.26,canDi*0.245,canDi*0.0078,canDi*0.0078,canDi*0.0078,canDi*0.0078);
      rect(canDi*0.54,canDi*0.58,canDi*0.16,canDi*0.1,canDi*0.0078,canDi*0.0078,canDi*0.0078,canDi*0.0078);
      stroke(colPal.base[0],colPal.base[1],colPal.base[2]);
      strokeWeight(canDi*0.02);
      line(canDi*0.6485,canDi*0.55,canDi*0.6485,canDi*0.635);
      iterator = 0;
      strokeWeight(canDi*0.015);
      for (let headStrokes = 0; headStrokes < 5; headStrokes++) {
        line(canDi*0.37+iterator,canDi*0.75,canDi*0.37+iterator,rndNum(canDi*0.35,canDi*0.5));
        iterator = iterator + canDi*0.035;
      }
      strokeWeight(canDi*0.01);
      iterator = 0;
      for (let headStrokes = 0; headStrokes < 4; headStrokes++) {
        line(canDi*0.675+iterator,rndNum(canDi*0.4,canDi*0.425),canDi*0.675+iterator,rndNum(canDi*0.575,canDi*0.625));
        iterator = iterator + canDi*0.015;
      }
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      strokeWeight(canDi*0.015);
      iterator = 0;
      strokeWeight(canDi*0.015);
      for (let headStrokes = 0; headStrokes < 5; headStrokes++) {
        line(canDi*0.37+iterator,canDi,canDi*0.37+iterator,rndNum(canDi*0.5,canDi*0.75));
        iterator = iterator + canDi*0.035;
      }
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      strokeWeight(canDi*0.015);
      iterator = 0;
      for (let headStrokes = 0; headStrokes < 11; headStrokes++) {
        line(canDi*0.545+iterator,canDi*0.65,canDi*0.545+iterator,rndNum(canDi*0.695,canDi*0.8));
        iterator = iterator + canDi*0.015;
      }
      break;
    case 4:
      //ooze from the top and bottom
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      strokeWeight(canDi*0.0098);
      switch (headChoice) {
        case 1:
          neckWidth = 18;
          xStart = canDi*0.3825;
          break;
        case 2:
          neckWidth = 27;
          xStart = canDi*0.37;
          break;
        default:
          neckWidth = 22;
          xStart = canDi*0.37;
      }
      for (let headStrokes = 0; headStrokes < neckWidth; headStrokes++) {
        line(xStart+iterator,canDi,xStart+iterator,rndNum(canDi*0.6,canDi*0.85));
        iterator = iterator + canDi*0.0075;
      }
      iterator = 0;
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      strokeWeight(canDi*0.0098);
      for (let headStrokes = 0; headStrokes < neckWidth/2; headStrokes++) {
        line(xStart+iterator,canDi,xStart+iterator,rndNum(canDi*0.81,canDi*0.95));
        iterator = iterator + canDi*0.015;
      }
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      beginShape();
      curveVertex(canDi*0.36,canDi*0.525);
      curveVertex(canDi*0.36,canDi*0.525);
      curveVertex(canDi*0.7,canDi*0.395);
      curveVertex(canDi*0.65,canDi*0.275);
      curveVertex(canDi*0.525,canDi*0.24);
      curveVertex(canDi*0.428,canDi*0.26);
      curveVertex(canDi*0.35,canDi*0.33);
      curveVertex(canDi*0.33,canDi*0.45);
      curveVertex(canDi*0.36,canDi*0.525);
      curveVertex(canDi*0.36,canDi*0.525);
      endShape();
      noFill();
      iterator = 0;
      for (let headStrokes = 0; headStrokes < 50; headStrokes++) {
        line(canDi*0.355+iterator,canDi*0.365,canDi*0.355+iterator,rndNum(canDi*0.5,canDi*0.65));
        iterator = iterator + canDi*0.0075;
      }
      iterator = 0;
      for (let headStrokes = 0; headStrokes < 23; headStrokes++) {
        line(canDi*0.365+iterator,canDi*0.45,canDi*0.365+iterator,rndNum(canDi*0.65,canDi*0.8));
        iterator = iterator + canDi*0.015;
      }
      break;
    case 5:
      //large ooze from the top and bottom
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      strokeWeight(canDi*0.0098);
      beginShape();
      curveVertex(canDi*0.36,canDi*0.525);
      curveVertex(canDi*0.36,canDi*0.525);
      curveVertex(canDi*0.7,canDi*0.395);
      curveVertex(canDi*0.65,canDi*0.275);
      curveVertex(canDi*0.525,canDi*0.24);
      curveVertex(canDi*0.428,canDi*0.26);
      curveVertex(canDi*0.35,canDi*0.33);
      curveVertex(canDi*0.33,canDi*0.45);
      curveVertex(canDi*0.36,canDi*0.525);
      curveVertex(canDi*0.36,canDi*0.525);
      endShape();
      noFill();
      iterator = 0;
      switch (headBaseColour) {
        case 1:
          stroke(colPal.base2[0],colPal.base2[1],colPal.base2[2]);
          break;
        default:
          stroke(colPal.base[0],colPal.base[1],colPal.base[2]);
      }
      strokeWeight(canDi*0.015);
      for (let headStrokes = 0; headStrokes < 23; headStrokes++) {
        line(canDi*0.38+iterator,canDi*0.75,canDi*0.37+iterator,rndNum(canDi*0.35,canDi*0.4));
        iterator = iterator + canDi*0.015;
      }
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      strokeWeight(canDi*0.015);
      iterator = 0;
      for (let headStrokes = 0; headStrokes < rndNum(1,3); headStrokes++) {
        line(canDi*0.46+iterator,canDi*0.3,canDi*0.45+iterator,rndNum(canDi*0.8,canDi*0.95));
        iterator = iterator + canDi*0.035;
      }
      iterator = 0;
      for (let headStrokes = 0; headStrokes < 5; headStrokes++) {
        line(canDi*0.51+iterator,canDi*0.3,canDi*0.5+iterator,rndNum(canDi*0.45,canDi*0.7));
        iterator = iterator + canDi*0.025;
      }
      strokeWeight(canDi*0.05);
      iterator = 0;
      for (let headStrokes = 0; headStrokes < rndNum(1,3); headStrokes++) {
        line(canDi*0.51+iterator,canDi*0.3,canDi*0.5+iterator,rndNum(canDi*0.45,canDi*0.55));
        iterator = iterator + canDi*0.1;
      }
      break;
  }
  let xP = rndNum(canDi*0.4,canDi*0.45);
  let yP = rndNum(canDi*0.6,canDi*0.65);
  drawFaceLines(xP,yP);
  switch (rndArr([0,0,1])) {
    case 0:
      break;
    default:
      drawVerticalHatches(canDi*0.375,canDi*0.65,headChoice)
  }

  // draw facial hair
  if ([2,3,4,5,6,7,8,9,10,11,13,14,15].includes(hairChoice)) {
      switch (rndArr([0,0,0,1])) {
        case 1:
          drawFaceScruff(canDi*0.445,canDi*0.5,headChoice);
          break;
        default:
      }
  }
  drawHeadOutline(headChoice);

  //draw dripping something or ouija tats
  if (colourChoice === 12) {
    switch (rndNum(0,10)) {
      case 1:
        createBloodSplatter();
        specialTrait = "splattered";
        break;
      default:
    }
  } else if ((colourChoice === 11) && (headChoice === 0)) {
    switch (rndNum(0,10)) {
      case 1:
        drawRandomLetters();
        specialTrait = "ouija tats";
        break;
      default:
    }
  } else {}

  function createBloodSplatter(fiberNum=50,xRange=[canDi*0.5,canDi*0.7],yRange=[canDi*0.5,canDi*0.8]) {
    for (let i = 0; i < fiberNum; i++) {
      let x1 = rndNum(xRange[0],xRange[1]);
      let y1 = rndNum(yRange[0],yRange[1]);
      let theta = parseInt(rndNum(0,canDi*oneValue)) * parseInt(canDi*0.0019) * canDi*pieValue;
      let segmentLength = rndArr([canDi*0.001,canDi*0.0075]) * canDi*0.0048 + canDi*0.0019;
      let x2 = x1 - segmentLength/rndArr([1,2,3]);
      let y2 = y1 - segmentLength/rndArr([1,2,3]);
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2],rndArr([0.65,0.75,0.85]));
      strokeWeight(rndNum(canDi*0.005,canDi*0.0125));
      line(x1,y1,x2,y2);
    }
    for (let i = 0; i < fiberNum; i++) {
      let x1 = rndNum(xRange[0]+canDi*0.1,xRange[1]);
      let y1 = rndNum(yRange[0]+canDi*0.2,yRange[1]);
      let theta = parseInt(rndNum(0,canDi*oneValue)) * parseInt(canDi*0.0019) * canDi*pieValue;
      let segmentLength = rndArr([canDi*0.001,canDi*0.0075]) * canDi*0.0048 + canDi*0.0019;
      let x2 = x1 - segmentLength/rndArr([1,2,3]);
      let y2 = y1 - segmentLength/rndArr([1,2,3]);
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2],rndArr([0.65,0.75,0.85]));
      strokeWeight(canDi*0.0125);
      line(x1,y1,x2,y2);
    }
    switch (rndArr([0,1])) {
      case 1:
        for (let i = 0; i < fiberNum; i++) {
          let x1 = rndNum(xRange[0]+canDi*0.1,xRange[1]+canDi*0.0435);
          let y1 = rndNum(yRange[0]-canDi*0.1,yRange[1]-canDi*0.2);
          let theta = parseInt(rndNum(0,canDi*oneValue)) * parseInt(canDi*0.0019) * canDi*pieValue;
          let segmentLength = rndArr([canDi*0.001,canDi*0.0075]) * canDi*0.0048 + canDi*0.0019;
          let x2 = x1 - segmentLength/rndArr([1,2,3]);
          let y2 = y1 - segmentLength/rndArr([1,2,3]);
          stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2],rndArr([0.65,0.75,0.85]));
          strokeWeight(canDi*0.0125);
          line(x1,y1,x2,y2);
        }
        break;
      default:

    }
  }
  function drawHeadOutline(headChoice) {
    switch (headChoice) {
      case 0:
        stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
        strokeWeight(rndNum(canDi*0.0065,canDi*0.0085));
        noFill();
        beginShape();
        curveVertex(canDi*0.52,canDi+canDi*0.1);
        curveVertex(canDi*0.52,canDi+canDi*0.1);
        curveVertex(canDi*0.53,canDi*0.9);
        curveVertex(canDi*0.54,canDi*0.84);
        curveVertex(canDi*0.54,canDi*0.84);
        endShape();
        beginShape();
        curveVertex(canDi*0.52,canDi*0.84);
        curveVertex(canDi*0.52,canDi*0.84);
        curveVertex(canDi*0.65,canDi*0.84);
        curveVertex(canDi*0.71,canDi*0.8);
        if ([2,3].includes(overlayChoice)) {
          curveVertex(canDi*0.715,canDi*0.7);
          curveVertex(canDi*0.72,canDi*0.645);
          curveVertex(canDi*0.74,canDi*0.625);
          curveVertex(canDi*0.744,canDi*0.55);
          curveVertex(canDi*0.742,canDi*0.4);
          curveVertex(canDi*0.715,canDi*0.32);
        } else {
          curveVertex(canDi*0.715,canDi*0.7);
          curveVertex(canDi*0.735,canDi*0.4);
          curveVertex(canDi*0.715,canDi*0.32);
        }
        curveVertex(canDi*0.65,canDi*0.265);
        curveVertex(canDi*0.55,canDi*0.235);
        curveVertex(canDi*0.475,canDi*0.235);
        curveVertex(canDi*0.4,canDi*0.27);
        curveVertex(canDi*0.33,canDi*0.35);
        curveVertex(canDi*0.32,canDi*0.45);
        curveVertex(canDi*0.335,canDi*0.52);
        curveVertex(canDi*0.353,canDi*0.7);
        curveVertex(canDi*0.356,canDi*0.82);
        curveVertex(canDi*0.36,canDi+canDi*0.1);
        curveVertex(canDi*0.36,canDi+canDi*0.1);
        endShape();
        if ([2,3].includes(overlayChoice)) {
          beginShape();
          curveVertex(canDi*0.475,canDi*0.6);
          curveVertex(canDi*0.475,canDi*0.6);
          curveVertex(canDi*0.5,canDi*0.62);
          curveVertex(canDi*0.535,canDi*0.635);
          curveVertex(canDi*0.545,canDi*0.65);
          curveVertex(canDi*0.545,canDi*0.69);
          curveVertex(canDi*0.545,canDi*0.69);
          endShape();
        } else {}
        break;
      case 1:
        stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
        strokeWeight(rndNum(canDi*0.0065,canDi*0.0085));
        noFill();
        beginShape();
        curveVertex(canDi*0.51,canDi+canDi*0.1);
        curveVertex(canDi*0.51,canDi+canDi*0.1);
        curveVertex(canDi*0.513,canDi*0.9);
        curveVertex(canDi*0.53,canDi*0.84);
        curveVertex(canDi*0.53,canDi*0.84);
        endShape();
        beginShape();
        curveVertex(canDi*0.51,canDi*0.84);
        curveVertex(canDi*0.51,canDi*0.84);
        curveVertex(canDi*0.65,canDi*0.84);
        curveVertex(canDi*0.71,canDi*0.8);
        if ([2,3].includes(overlayChoice)) {
          curveVertex(canDi*0.715,canDi*0.7);
          curveVertex(canDi*0.72,canDi*0.645);
          curveVertex(canDi*0.74,canDi*0.625);
          curveVertex(canDi*0.744,canDi*0.55);
          curveVertex(canDi*0.742,canDi*0.4);
          curveVertex(canDi*0.715,canDi*0.32);
        } else {
          curveVertex(canDi*0.715,canDi*0.7);
          curveVertex(canDi*0.735,canDi*0.4);
          curveVertex(canDi*0.715,canDi*0.32);
        }
        curveVertex(canDi*0.65,canDi*0.265);
        curveVertex(canDi*0.55,canDi*0.235);
        curveVertex(canDi*0.475,canDi*0.235);
        curveVertex(canDi*0.4,canDi*0.27);
        curveVertex(canDi*0.33,canDi*0.35);
        curveVertex(canDi*0.32,canDi*0.45);
        curveVertex(canDi*0.335,canDi*0.52);
        curveVertex(canDi*0.373,canDi*0.7);
        curveVertex(canDi*0.376,canDi*0.82);
        curveVertex(canDi*0.37,canDi+canDi*0.1);
        curveVertex(canDi*0.37,canDi+canDi*0.1);
        endShape();
        if ([2,3].includes(overlayChoice)) {
          beginShape();
          curveVertex(canDi*0.475,canDi*0.6);
          curveVertex(canDi*0.475,canDi*0.6);
          curveVertex(canDi*0.5,canDi*0.62);
          curveVertex(canDi*0.535,canDi*0.635);
          curveVertex(canDi*0.545,canDi*0.65);
          curveVertex(canDi*0.545,canDi*0.69);
          curveVertex(canDi*0.545,canDi*0.69);
          endShape();
        } else {}
        break;
      case 2:
        stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
        strokeWeight(rndNum(canDi*0.0065,canDi*0.0085));
        noFill();
        beginShape();
        curveVertex(canDi*0.57,canDi+canDi*0.1);
        curveVertex(canDi*0.57,canDi+canDi*0.1);
        curveVertex(canDi*0.573,canDi*0.9);
        curveVertex(canDi*0.59,canDi*0.85);
        curveVertex(canDi*0.59,canDi*0.85);
        endShape();
        beginShape();
        curveVertex(canDi*0.57,canDi*0.85);
        curveVertex(canDi*0.57,canDi*0.85);
        curveVertex(canDi*0.65,canDi*0.84);
        curveVertex(canDi*0.71,canDi*0.8);
        if ([2,3].includes(overlayChoice)) {
          curveVertex(canDi*0.715,canDi*0.7);
          curveVertex(canDi*0.72,canDi*0.645);
          curveVertex(canDi*0.74,canDi*0.625);
          curveVertex(canDi*0.744,canDi*0.55);
          curveVertex(canDi*0.742,canDi*0.4);
          curveVertex(canDi*0.715,canDi*0.32);
        } else {
          curveVertex(canDi*0.715,canDi*0.7);
          curveVertex(canDi*0.735,canDi*0.4);
          curveVertex(canDi*0.715,canDi*0.32);
        }
        curveVertex(canDi*0.65,canDi*0.265);
        curveVertex(canDi*0.55,canDi*0.235);
        curveVertex(canDi*0.475,canDi*0.235);
        curveVertex(canDi*0.4,canDi*0.27);
        curveVertex(canDi*0.33,canDi*0.35);
        curveVertex(canDi*0.32,canDi*0.45);
        curveVertex(canDi*0.335,canDi*0.52);
        curveVertex(canDi*0.353,canDi*0.7);
        curveVertex(canDi*0.356,canDi*0.82);
        curveVertex(canDi*0.36,canDi+canDi*0.1);
        curveVertex(canDi*0.36,canDi+canDi*0.1);
        endShape();
        if ([2,3].includes(overlayChoice)) {
          beginShape();
          curveVertex(canDi*0.475,canDi*0.6);
          curveVertex(canDi*0.475,canDi*0.6);
          curveVertex(canDi*0.5,canDi*0.62);
          curveVertex(canDi*0.535,canDi*0.635);
          curveVertex(canDi*0.545,canDi*0.65);
          curveVertex(canDi*0.545,canDi*0.69);
          curveVertex(canDi*0.545,canDi*0.69);
          endShape();
        } else {}
        break;
    }
  }
  function drawFaceScruff(x,y,widthRange=0){
    stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
    strokeWeight(rndNum(canDi*0.0065,canDi*0.0085));
    noFill();
    let xOffset = 0;
    let lineRows = 8;
    let lineColumns = 23;
    let vertIterator = 0;
    let scruffType = rndArr([0,1]);
    for (var i = 0; i < lineRows; i++) {
      let colChange;
      let iterator = 0;
      switch (i) {
        case 0:
          colChange = 2;
          break;
        case 1:
          colChange = 3;
          break;
        case 2:
          colChange = 4;
          break;
        case 3:
          colChange = 6;
          break;
        case 7:
          colChange = lineColumns - 1;
          break;
        case 8:
          colChange = lineColumns - 3;
          break;
        default:
          colChange = lineColumns;
      }
      for (var j = 0; j < colChange; j++) {
        let xRand = rndNum(-canDi*0.0095,canDi*0.0095);
        let yRand = rndNum(-canDi*0.01,canDi*0.012);
        switch (scruffType) {
          case 0:
            line(x+xOffset+xRand+iterator,y+yRand+vertIterator,x+xOffset+xRand+iterator,y+canDi*0.025+yRand+vertIterator);
            break;
          default:
            point(x+xOffset+xRand+iterator,y+yRand+vertIterator);
            point(x+xOffset+xRand+iterator,y+canDi*0.025+yRand+vertIterator);
        }
        iterator = iterator + canDi*0.012;
      }
      vertIterator = vertIterator + canDi*0.0425;
    }
  }
  function drawFaceLines(x,y,drawCount=rndNum(0,6)){
    stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
    strokeWeight(rndNum(canDi*0.0065,canDi*0.0085));
    noFill();
    let iterator = 0;
    let x2 = x+canDi*0.015;
    let y2 = y+canDi*0.02;
    let x3 = x+canDi*0.035;
    let y3 = y+canDi*0.035;
    for (var i = 0; i < drawCount; i++) {
      let randPlacement = rndNum(-canDi*0.035,canDi*0.065);
      beginShape();
      curveVertex(x+iterator,y+iterator+randPlacement);
      curveVertex(x+iterator,y+iterator+randPlacement);
      curveVertex(x2+iterator,y2+iterator+randPlacement);
      curveVertex(x3+iterator,y3+iterator+randPlacement);
      curveVertex(x3+iterator,y3+iterator+randPlacement);
      endShape();
      iterator = iterator + canDi*0.022;
    }
  }
  function drawVerticalHatches(x,y,widthRange=0){
    stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
    strokeWeight(rndNum(canDi*0.0065,canDi*0.0085));
    noFill();
    let xOffset,lineRows,lineColumns;
    switch (widthRange) {
      case 1:
        xOffset = canDi*0.015;
        lineRows = 7;
        lineColumns = 6;
        break;
      case 2:
        xOffset = 0;
        lineRows = 7;
        lineColumns = 9;
        break;
      default:
        xOffset = 0;
        lineRows = 7;
        lineColumns = 7;
    }
    let vertIterator = 0;
    for (var i = 0; i < lineRows; i++) {
      let colChange;
      let iterator = 0;
      switch (i) {
        case 0:
          colChange = 2;
          break;
        case 1:
          colChange = 4;
          break;
        case 2:
          colChange = 6;
          break;
        case 3:
          colChange = lineColumns - 1;
          break;
        default:
          colChange = lineColumns;
      }
      for (var j = 0; j < colChange; j++) {
        let xRand = rndNum(-canDi*0.0095,canDi*0.0095);
        let yRand = rndNum(-canDi*0.01,canDi*0.012);
        line(x+xOffset+xRand+iterator,y+yRand+vertIterator,x+xOffset+xRand+iterator,y+canDi*0.025+yRand+vertIterator);
        iterator = iterator + canDi*0.022;
      }
      vertIterator = vertIterator + canDi*0.05;
    }
  }
}
function setSockets(socketChoice,colPal,canDi) {
  let socketStroke = canDi*0.015;
  switch(socketChoice) {
    case 1:
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      strokeWeight(socketStroke/2);
      ellipse(canDi*0.565,canDi*0.49,canDi*0.12,canDi*0.18);
      ellipse(canDi*0.7,canDi*0.49,canDi*0.06,canDi*0.16);
      break;
    case 2:
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      strokeWeight(socketStroke/2);
      drawSockets(0,1);
      break;
    case 3:
      stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      strokeWeight(socketStroke/2);
      drawSockets(0,1);
      break;
    case 4:
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      fill(colPal.base[0],colPal.base[1],colPal.base[2]);
      strokeWeight(socketStroke/2);
      drawSockets();
      break;
    case 5:
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      strokeWeight(socketStroke/2);
      drawSockets();
      break;
    case 6:
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      strokeWeight(socketStroke/2);
      drawSockets();
      break;
    case 7:
      stroke(colPal.base[0],colPal.base[1],colPal.base[2]);
      noFill();
      strokeWeight(socketStroke/2);
      drawSockets(1,0);
      break;
    case 8:
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      noFill();
      strokeWeight(socketStroke/2);
      drawSockets(1,0);
      break;
    case 9:
      stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      noFill();
      strokeWeight(socketStroke/2);
      drawSockets(1,0);
      break;
    case 10:
      stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      strokeWeight(socketStroke/2);
      rect(canDi*0.51,canDi*0.4,canDi*0.1125,rndArr([canDi*0.1758,canDi*0.2148]),canDi*0.1,canDi*0.1,canDi*0.1,canDi*0.1);
      ellipse(canDi*0.7,canDi*0.49,rndNum(canDi*0.04,canDi*0.06),rndNum(canDi*0.13,canDi*0.16));
      break;
    case 11:
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      strokeWeight(socketStroke/2);
      ellipse(canDi*0.565,canDi*0.49,rndNum(canDi*0.10,canDi*0.12),rndNum(canDi*0.14,canDi*0.18));
      rect(canDi*0.67,canDi*0.4,canDi*0.0555,rndArr([canDi*0.1758,canDi*0.2148]),canDi*0.1,canDi*0.1,canDi*0.1,canDi*0.1);
      break;
    case 12:
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      strokeWeight(socketStroke/2);
      ellipse(canDi*0.565,canDi*0.49,canDi*0.12,canDi*0.18);
      ellipse(canDi*0.7,canDi*0.49,canDi*0.06,canDi*0.16);
      break;
    default:
  }
}
function setEyeExtras(eyeChoice,colPal,canDi) {
  let eXP1 = rndArr([0,1]);
  let eYP1, eyeShiftX;
  let frameAttach = rndNum(canDi*0.46,canDi*0.475);
  let frameShift = rndNum(canDi*0.005,canDi*0.005);
  let frameEndShift = rndNum(0,canDi*0.02);
  let eyeStrokeWeight = rndNum(canDi*0.015,canDi*0.0175);
  switch(eyeChoice) {
    case 1:
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]+10);
      noStroke();
      ellipse(canDi*0.565,canDi*0.49,canDi*0.11,canDi*0.16);
      rect(canDi*0.67,canDi*0.4,canDi*0.0555,rndArr([canDi*0.1758,canDi*0.2148]),canDi*0.1,canDi*0.1,canDi*0.1,canDi*0.1);
      break;
    case 2:
      if (colourChoice == 17) {
        switch (crosskullsChoice) {
          case 1:
            stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
            fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
            strokeWeight(0);
            rect(canDi*0.51,canDi*0.4,canDi*0.1125,rndArr([canDi*0.1758,canDi*0.2148]),canDi*0.0146,canDi*0.0146,canDi*0.0146,canDi*0.0146);
            rect(canDi*0.67,canDi*0.4,canDi*0.0555,rndArr([canDi*0.1758,canDi*0.2148]),canDi*0.0146,canDi*0.0146,canDi*0.0146,canDi*0.0146);
            break;
          default:
        }
      }
      break;
    case 6:
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.highlight[2]);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.highlight[2]);
      strokeWeight(eyeStrokeWeight/2);
      ellipse(canDi*0.565,canDi*0.49,rndNum(canDi*0.02,canDi*0.08),rndNum(canDi*0.06,canDi*0.12));
      ellipse(canDi*0.7,canDi*0.49,rndNum(canDi*0.02,canDi*0.06),rndNum(canDi*0.06,canDi*0.12));
      break;
    case 7:
      stroke(colPal.compliment[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      fill(colPal.compliment[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      noStroke();
      rect(canDi*0.51,canDi*0.4,canDi*0.1125,rndArr([canDi*0.1758,canDi*0.2148]),canDi*0.1,canDi*0.1,canDi*0.1,canDi*0.1);
      ellipse(rndNum(canDi*0.69,canDi*0.71),canDi*0.49,canDi*0.06,rndNum(canDi*0.13,canDi*0.16));
      break;
    case 8:
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      strokeWeight(eyeStrokeWeight);
      break;
    case 11:
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      strokeWeight(eyeStrokeWeight/2);
      ellipse(canDi*0.565,canDi*0.49,rndNum(canDi*0.08,canDi*0.12),rndNum(canDi*0.14,canDi*0.18));
      ellipse(canDi*0.7,canDi*0.49,rndNum(canDi*0.04,canDi*0.06),rndNum(canDi*0.12,canDi*0.16));
      break;
    case 12:
      stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      strokeWeight(eyeStrokeWeight*0.75);
      rect(canDi*0.51,canDi*0.45,canDi*0.1125,rndArr([canDi*0.1258,canDi*0.1448]),canDi*0.1,canDi*0.1,canDi*0.1,canDi*0.1);
      rect(canDi*0.67,canDi*0.45,canDi*0.0555,rndArr([canDi*0.0958,canDi*0.1148]),canDi*0.1,canDi*0.1,canDi*0.1,canDi*0.1);
      break;
    case 13:
      stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      strokeWeight(eyeStrokeWeight);
      ellipse(canDi*0.565,canDi*0.49,rndNum(canDi*0.10,canDi*0.12),rndNum(canDi*0.14,canDi*0.18));
      break;
    case 14:
      stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      strokeWeight(eyeStrokeWeight);
      ellipse(canDi*0.7,canDi*0.49,rndNum(canDi*0.04,canDi*0.06),rndNum(canDi*0.13,canDi*0.16));
      break;
    case 15:
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      noFill();
      strokeWeight(eyeStrokeWeight*1.5);
      beginShape();
      curveVertex(canDi*0.27+frameEndShift,frameAttach+frameShift+canDi*0.08);
      curveVertex(canDi*0.27+frameEndShift,frameAttach+frameShift+canDi*0.08);
      curveVertex(canDi*0.32,frameAttach+frameShift+canDi*0.003);
      curveVertex(canDi*0.39,frameAttach+frameShift);
      curveVertex(canDi*0.55,frameAttach);
      curveVertex(canDi*0.55,frameAttach);
      endShape();
      break;
    case 16:
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      noFill();
      strokeWeight(eyeStrokeWeight*1.5);
      beginShape();
      curveVertex(canDi*0.245+frameEndShift,frameAttach+frameShift+canDi*0.1);
      curveVertex(canDi*0.245+frameEndShift,frameAttach+frameShift+canDi*0.1);
      curveVertex(canDi*0.295,frameAttach+frameShift+canDi*0.01);
      curveVertex(canDi*0.39,frameAttach+frameShift+canDi*0.003);
      curveVertex(canDi*0.55,frameAttach);
      curveVertex(canDi*0.55,frameAttach);
      endShape();
      break;
    case 17:
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      noFill();
      strokeWeight(eyeStrokeWeight*1.5);
      beginShape();
      curveVertex(canDi*0.245+frameEndShift,frameAttach+frameShift+canDi*0.1);
      curveVertex(canDi*0.245+frameEndShift,frameAttach+frameShift+canDi*0.1);
      curveVertex(canDi*0.295,frameAttach+frameShift+canDi*0.01);
      curveVertex(canDi*0.39,frameAttach+frameShift+canDi*0.003);
      curveVertex(canDi*0.55,frameAttach);
      curveVertex(canDi*0.55,frameAttach);
      endShape();
      break;
    case 18:
      //sockets
      stroke(colPal.compliment[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      noStroke();
      rect(canDi*0.51,canDi*0.42,canDi*0.1125,rndArr([canDi*0.15,canDi*0.1648]),canDi*0.1,canDi*0.1,canDi*0.1,canDi*0.1);
      rect(canDi*0.67,canDi*0.42,canDi*0.0555,rndArr([canDi*0.15,canDi*0.1648]),canDi*0.1,canDi*0.1,canDi*0.1,canDi*0.1);
      break;
    case 22:
      //pumpkin eyes back
      eXP1 = canDi*0.565;
      eXP2 = eXP1+canDi*0.135;
      strokeWeight(canDi*0.0075);
      stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      strokeJoin(ROUND);
      fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      push();
      switch (rndNum(0,3)) {
        case 1:
          translate(canDi*0.035,-canDi*0.05);
          rotate(PI / rndNum(40,42));
          break;
        case 2:
          translate(-canDi*0.045,canDi*0.05);
          rotate(PI / rndNum(-40,-42));
          break;
        default:

      }
      beginShape();
      vertex(eXP1,rndNum(canDi*0.4,canDi*0.445));
      vertex(eXP1+canDi*0.06,canDi*0.55);
      vertex(eXP1-canDi*0.05,canDi*0.55);
      endShape(CLOSE);
      pop();
      push();
      switch (rndNum(0,3)) {
        case 1:
          translate(canDi*0.035,-canDi*0.05);
          rotate(PI / rndNum(40,42));
          break;
        case 2:
          translate(-canDi*0.045,canDi*0.05);
          rotate(PI / rndNum(-40,-42));
          break;
        default:

      }
      beginShape();
      vertex(eXP2,rndNum(canDi*0.4,canDi*0.445));
      vertex(eXP2+canDi*0.03,canDi*0.55);
      vertex(eXP2-canDi*0.03,canDi*0.55);
      endShape(CLOSE);
      pop();
      break;
    case 25:
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      noFill();
      strokeWeight(eyeStrokeWeight*1.5);
      beginShape();
      curveVertex(canDi*0.245+frameEndShift,frameAttach+frameShift+canDi*0.1);
      curveVertex(canDi*0.245+frameEndShift,frameAttach+frameShift+canDi*0.1);
      curveVertex(canDi*0.295,frameAttach+frameShift+canDi*0.01);
      curveVertex(canDi*0.39,frameAttach+frameShift+canDi*0.003);
      curveVertex(canDi*0.55,frameAttach);
      curveVertex(canDi*0.55,frameAttach);
      endShape();
      break;
    case 26:
      noStroke();
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      strokeWeight(eyeStrokeWeight);
      beginShape();
      curveVertex(canDi*0.515,canDi*0.51);
      curveVertex(canDi*0.515,canDi*0.51);
      curveVertex(canDi*0.565,canDi*0.485);
      curveVertex(canDi*0.615,canDi*0.505);
      curveVertex(canDi*0.595,canDi*0.535);
      curveVertex(canDi*0.55,canDi*0.535);
      curveVertex(canDi*0.515,canDi*0.51);
      curveVertex(canDi*0.515,canDi*0.51);
      endShape();
      beginShape();
      curveVertex(canDi*0.67,canDi*0.505);
      curveVertex(canDi*0.67,canDi*0.505);
      curveVertex(canDi*0.705,canDi*0.485);
      curveVertex(canDi*0.73,canDi*0.505);
      curveVertex(canDi*0.715,canDi*0.53);
      curveVertex(canDi*0.69,canDi*0.53);
      curveVertex(canDi*0.67,canDi*0.505);
      curveVertex(canDi*0.67,canDi*0.505);
      endShape();
      break;
    default:
  }
}
function setEyes(eyeChoice,colPal,canDi) {
  let eXP1 = rndArr([0,1]);
  let eYP1,eyeShiftX,xP1,xP2,iterator;
  let eyeStrokeWeight = rndNum(canDi*0.015,canDi*0.0175);
  switch(eyeChoice) {
    case 0:
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      strokeWeight(eyeStrokeWeight);
      eyeShiftX = [[canDi*0.55,canDi*0.135],[canDi*0.595,canDi*0.115]];
      eYP1 = rndNum(canDi*0.45,canDi*0.475);
      line(eyeShiftX[eXP1][0],eYP1,eyeShiftX[eXP1][0],eYP1+canDi*0.075);
      line(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1,eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1+canDi*0.075);
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      break;
    case 1:
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      strokeWeight(eyeStrokeWeight);
      eyeShiftX = [[canDi*0.55,canDi*0.135],[canDi*0.595,canDi*0.115]];
      eYP1 = rndNum(canDi*0.475,canDi*0.5);
      line(eyeShiftX[eXP1][0],eYP1,eyeShiftX[eXP1][0],eYP1+canDi*0.05);
      //line(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1,eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1+canDi*0.05);
      strokeWeight(eyeStrokeWeight/2);
      beginShape();
      vertex(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1]+canDi*0.0085,eYP1);
      vertex(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1]+canDi*0.0085,eYP1);
      vertex(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1]-canDi*0.0085,eYP1+canDi*0.05);
      vertex(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1]-canDi*0.0085,eYP1+canDi*0.05);
      endShape();
      beginShape();
      vertex(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1]-canDi*0.0085,eYP1);
      vertex(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1]-canDi*0.0085,eYP1);
      vertex(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1]+canDi*0.0085,eYP1+canDi*0.05);
      vertex(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1]+canDi*0.0085,eYP1+canDi*0.05);
      endShape();
      break;
    case 2:
      if (colourChoice === 17) {
        switch (crosskullsChoice) {
          case 1:
            stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
            noFill();
            strokeWeight(eyeStrokeWeight*1.15);
            eyeShiftX = [[canDi*0.51,canDi*0.2],[canDi*0.6,canDi*0.19]];
            eYP1 = rndNum(canDi*0.475,canDi*0.485);
            let xP1,yP1,xP2,yP2;
            for (var i = 0; i < rndArr([1,2,3]); i++) {
              xP1 = rndNum(canDi*0.48,canDi*0.5);
              yP1 = rndNum(canDi*0.415,canDi*0.425);
              xP2 = rndNum(canDi*0.63,canDi*0.65);
              yP2 = rndNum(canDi*0.6,canDi*0.62);
              line(xP1,yP1,xP2,yP2);
              line(xP2,yP1,xP1,yP2);
            }
            //rt side X
            for (var i = 0; i < rndArr([1,2,3]); i++) {
              xP1 = rndNum(canDi*0.66,canDi*0.67);
              yP1 = rndNum(canDi*0.415,canDi*0.425);
              xP2 = rndNum(canDi*0.75,canDi*0.77);
              yP2 = rndNum(canDi*0.6,canDi*0.61);
              line(xP1,yP1,xP2,yP2);
              line(xP2,yP1,xP1,yP2);
            }
            specialTrait = 'cr0$$kulls';
            break;
          default:
            stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
            fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
            strokeWeight(eyeStrokeWeight);
            for (let eyeStrokes = 0; eyeStrokes < rndNum(1,5); eyeStrokes++) {
              drawEyeX();
            }
            for (let eyeStrokes = 0; eyeStrokes < rndNum(1,5); eyeStrokes++) {
              drawEyeX(1);
            }
        }
      } else if (colourChoice === 14) {
        switch (rndNum(0,10)) {
          case 1:
            noStroke();
            fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
            eyeShiftX = [[canDi*0.51,canDi*0.2],[canDi*0.6,canDi*0.19]];
            eYP1 = rndNum(canDi*0.475,canDi*0.485);
            //eye star
            drawEyeStars();
            specialTrait = 'st@r$';
            break;
          default:
            stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
            fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
            strokeWeight(eyeStrokeWeight);
            for (let eyeStrokes = 0; eyeStrokes < rndNum(1,5); eyeStrokes++) {
              drawEyeX();
            }
            for (let eyeStrokes = 0; eyeStrokes < rndNum(1,5); eyeStrokes++) {
              drawEyeX(1);
            }
        }
      } else {
        stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
        fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
        strokeWeight(eyeStrokeWeight);
        for (let eyeStrokes = 0; eyeStrokes < rndNum(1,5); eyeStrokes++) {
          drawEyeX();
        }
        for (let eyeStrokes = 0; eyeStrokes < rndNum(1,5); eyeStrokes++) {
          drawEyeX(1);
        }
      }
      break;
    case 3:
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      noFill();
      let eye3XChoice  = rndArr([1,2]);
      for (let eyeStrokes = 0; eyeStrokes < rndNum(3,5); eyeStrokes++) {
        drawEyeX();
        eyeShiftX = [[canDi*0.55,canDi*0.135],[canDi*0.595,canDi*0.115]];
        eYP1 = rndNum(canDi*0.45,canDi*0.475);
        strokeWeight(eyeStrokeWeight);
        line(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1,eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1+canDi*0.075);
      }
      break;
    case 4:
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      strokeWeight(eyeStrokeWeight/2);
      noFill();
      for (let eyeStrokes = 0; eyeStrokes < rndNum(1,4); eyeStrokes++) {
        drawEyeEllipse();
      }
      for (let eyeStrokes = 0; eyeStrokes < rndNum(3,5); eyeStrokes++) {
        drawEyeX(1);
      }
      break;
    case 5:
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      strokeWeight(eyeStrokeWeight/2);
      noFill();
      for (let eyeStrokes = 0; eyeStrokes < rndNum(3,5); eyeStrokes++) {
        drawEyeX();
      }
      for (let eyeStrokes = 0; eyeStrokes < rndNum(1,4); eyeStrokes++) {
        drawEyeEllipse(1);
      }
      break;
    case 6:
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      strokeWeight(eyeStrokeWeight/2);
      noFill();
      for (let eyeStrokes = 0; eyeStrokes < rndNum(1,4); eyeStrokes++) {
        drawEyeEllipse();
      }
      for (let eyeStrokes = 0; eyeStrokes < rndNum(2,4); eyeStrokes++) {
        drawEyeEllipse(1);
      }
      break;
    case 7:
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      strokeWeight(eyeStrokeWeight);
      eyeShiftX = [[canDi*0.55,canDi*0.135],[canDi*0.595,canDi*0.115]];
      eYP1 = rndNum(canDi*0.45,canDi*0.475);
      strokeWeight(eyeStrokeWeight*3);
      point(eyeShiftX[eXP1][0],eYP1+canDi*0.035)
      strokeWeight(eyeStrokeWeight);
      line(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1,eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1+canDi*0.075);
      break;
    case 8:
      eyeShiftX = [[canDi*0.55,canDi*0.135],[canDi*0.595,canDi*0.115]];
      eYP1 = rndNum(canDi*0.45,canDi*0.475);
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      strokeWeight(eyeStrokeWeight);
      line(eyeShiftX[eXP1][0],eYP1,eyeShiftX[eXP1][0],eYP1+canDi*0.075);
      for (let eyeStrokes = 0; eyeStrokes < rndNum(2,5); eyeStrokes++) {
        drawEyeEllipse(1);
      }
      break;
    case 9:
      //suspicious
      eyeShiftX = [[canDi*0.55,canDi*0.135],[canDi*0.595,canDi*0.115]];
      eYP1 = rndNum(canDi*0.5,canDi*0.515);
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      strokeWeight(eyeStrokeWeight);
      beginShape();
      curveVertex(canDi*0.515,canDi*0.51);
      curveVertex(canDi*0.515,canDi*0.51);
      curveVertex(canDi*0.565,canDi*0.485);
      curveVertex(canDi*0.615,canDi*0.505);
      curveVertex(canDi*0.565,canDi*0.53);
      curveVertex(canDi*0.515,canDi*0.51);
      curveVertex(canDi*0.515,canDi*0.51);
      endShape();
      beginShape();
      curveVertex(canDi*0.67,canDi*0.505);
      curveVertex(canDi*0.67,canDi*0.505);
      curveVertex(canDi*0.705,canDi*0.485);
      curveVertex(canDi*0.73,canDi*0.505);
      curveVertex(canDi*0.705,canDi*0.53);
      curveVertex(canDi*0.67,canDi*0.505);
      curveVertex(canDi*0.67,canDi*0.505);
      endShape();
      stroke(colPal.teeth[0],colPal.teeth[1],colPal.teeth[2]);
      strokeWeight(eyeStrokeWeight*3);
      point(eyeShiftX[eXP1][0],eYP1);
      point(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1);
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      noFill();
      strokeWeight(eyeStrokeWeight);
      beginShape();
      curveVertex(canDi*0.515,canDi*0.505);
      curveVertex(canDi*0.515,canDi*0.505);
      curveVertex(canDi*0.565,canDi*0.48);
      curveVertex(canDi*0.615,canDi*0.49);
      curveVertex(canDi*0.615,canDi*0.49);
      endShape();
      beginShape();
      curveVertex(canDi*0.67,canDi*0.49);
      curveVertex(canDi*0.67,canDi*0.49);
      curveVertex(canDi*0.705,canDi*0.48);
      curveVertex(canDi*0.73,canDi*0.49);
      curveVertex(canDi*0.73,canDi*0.49);
      endShape();
      strokeWeight(eyeStrokeWeight/2);
      beginShape();
      curveVertex(canDi*0.525,canDi*0.55);
      curveVertex(canDi*0.525,canDi*0.55);
      curveVertex(canDi*0.565,canDi*0.57);
      curveVertex(canDi*0.615,canDi*0.555);
      curveVertex(canDi*0.615,canDi*0.555);
      endShape();
      beginShape();
      curveVertex(canDi*0.68,canDi*0.55);
      curveVertex(canDi*0.68,canDi*0.55);
      curveVertex(canDi*0.705,canDi*0.56);
      curveVertex(canDi*0.73,canDi*0.55);
      curveVertex(canDi*0.73,canDi*0.55);
      endShape();
      break;
    case 10:
      eyeShiftX = [[canDi*0.55,canDi*0.135],[canDi*0.595,canDi*0.115]];
      eYP1 = rndNum(canDi*0.5,canDi*0.515);
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      strokeWeight(eyeStrokeWeight*3);
      point(eyeShiftX[eXP1][0],eYP1);
      point(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1);
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      noFill();
      strokeWeight(eyeStrokeWeight);
      beginShape();
      curveVertex(canDi*0.515,canDi*0.505);
      curveVertex(canDi*0.515,canDi*0.505);
      curveVertex(canDi*0.565,canDi*0.48);
      curveVertex(canDi*0.615,canDi*0.49);
      curveVertex(canDi*0.615,canDi*0.49);
      endShape();
      beginShape();
      curveVertex(canDi*0.67,canDi*0.49);
      curveVertex(canDi*0.67,canDi*0.49);
      curveVertex(canDi*0.705,canDi*0.48);
      curveVertex(canDi*0.73,canDi*0.49);
      curveVertex(canDi*0.73,canDi*0.49);
      endShape();
      strokeWeight(eyeStrokeWeight/2);
      beginShape();
      curveVertex(canDi*0.525,canDi*0.55);
      curveVertex(canDi*0.525,canDi*0.55);
      curveVertex(canDi*0.565,canDi*0.57);
      curveVertex(canDi*0.615,canDi*0.555);
      curveVertex(canDi*0.615,canDi*0.555);
      endShape();
      beginShape();
      curveVertex(canDi*0.68,canDi*0.55);
      curveVertex(canDi*0.68,canDi*0.55);
      curveVertex(canDi*0.705,canDi*0.56);
      curveVertex(canDi*0.73,canDi*0.55);
      curveVertex(canDi*0.73,canDi*0.55);
      endShape();
      break;
    case 11:
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      strokeWeight(eyeStrokeWeight/2);
      //ellipse(canDi*0.565,canDi*0.49,rndNum(canDi*0.08,canDi*0.12),rndNum(canDi*0.14,canDi*0.18));
      //ellipse(canDi*0.7,canDi*0.49,rndNum(canDi*0.04,canDi*0.06),rndNum(canDi*0.12,canDi*0.16));
      for (let eyeStrokes = 0; eyeStrokes < rndNum(3,7); eyeStrokes++) {
        let tempXPoint = rndNum(canDi*0.54,canDi*0.61);
        line(tempXPoint,canDi*0.535,tempXPoint,rndNum(canDi*0.75,canDi));
      }
      for (let eyeStrokes = 0; eyeStrokes < rndNum(1,4); eyeStrokes++) {
        let tempXPoint = rndNum(canDi*0.705,canDi*0.72);
        line(tempXPoint,canDi*0.535,tempXPoint,rndNum(canDi*0.8,canDi));
      }
      if (colourChoice === 5) {
          switch (rndNum(0,5)) {
            case 1:
              seeRainbows();
              break;
            default:
          }
      } else{}
      break;
    case 12:
      stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      strokeWeight(eyeStrokeWeight*0.75);
      //rect(canDi*0.51,canDi*0.45,canDi*0.1125,rndArr([canDi*0.1258,canDi*0.1448]),canDi*0.1,canDi*0.1,canDi*0.1,canDi*0.1);
      //rect(canDi*0.67,canDi*0.45,canDi*0.0555,rndArr([canDi*0.0958,canDi*0.1148]),canDi*0.1,canDi*0.1,canDi*0.1,canDi*0.1);
      for (let eyeStrokes = 0; eyeStrokes < rndNum(3,7); eyeStrokes++) {
        let tempXPoint = rndNum(canDi*0.52,canDi*0.63);
        line(tempXPoint,canDi*0.535,tempXPoint,rndNum(0,canDi*0.35));
      }
      for (let eyeStrokes = 0; eyeStrokes < rndNum(1,4); eyeStrokes++) {
        let tempXPoint = rndNum(canDi*0.68,canDi*0.71);
        line(tempXPoint,canDi*0.535,tempXPoint,rndNum(0,canDi*0.35));
      }
      break;
    case 13:
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      strokeWeight(eyeStrokeWeight);
      eyeShiftX = [[canDi*0.55,canDi*0.135],[canDi*0.595,canDi*0.115]];
      eYP1 = rndNum(canDi*0.45,canDi*0.475);
      line(eyeShiftX[eXP1][0],eYP1,eyeShiftX[eXP1][0],eYP1+canDi*0.075);
      break;
    case 14:
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      strokeWeight(eyeStrokeWeight);
      eyeShiftX = [[canDi*0.55,canDi*0.135],[canDi*0.595,canDi*0.115]];
      eYP1 = rndNum(canDi*0.45,canDi*0.475);
      line(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1,eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1+canDi*0.075);
      break;
    case 15:
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      strokeWeight(eyeStrokeWeight);
      beginShape();
      curveVertex(canDi*0.475,canDi*0.45);
      curveVertex(canDi*0.475,canDi*0.45);
      curveVertex(canDi*0.775,canDi*0.46);
      curveVertex(canDi*0.815,canDi*0.47);
      curveVertex(canDi*0.795,canDi*0.56);
      curveVertex(canDi*0.7,canDi*0.56);
      curveVertex(canDi*0.675,canDi*0.5);
      curveVertex(canDi*0.635,canDi*0.5);
      curveVertex(canDi*0.61,canDi*0.56);
      curveVertex(canDi*0.5,canDi*0.56);
      curveVertex(canDi*0.475,canDi*0.45);
      curveVertex(canDi*0.475,canDi*0.45);
      endShape();
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      beginShape();
      vertex(canDi*0.7,canDi*0.475);
      vertex(canDi*0.7,canDi*0.475);
      vertex(canDi*0.79,canDi*0.475);
      vertex(canDi*0.8,canDi*0.485);
      curveVertex(canDi*0.785,canDi*0.55);
      curveVertex(canDi*0.71,canDi*0.55);
      vertex(canDi*0.7,canDi*0.475);
      vertex(canDi*0.7,canDi*0.475);
      endShape();
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      beginShape();
      vertex(canDi*0.5,canDi*0.465);
      vertex(canDi*0.5,canDi*0.465);
      vertex(canDi*0.61,canDi*0.472);
      vertex(canDi*0.62,canDi*0.478);
      curveVertex(canDi*0.6,canDi*0.55);
      curveVertex(canDi*0.51,canDi*0.55);
      vertex(canDi*0.5,canDi*0.465);
      vertex(canDi*0.5,canDi*0.465);
      endShape();
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]+20);
      noFill();
      strokeWeight(eyeStrokeWeight);
      eyeShiftX = [[canDi*0.51,canDi*0.2],[canDi*0.6,canDi*0.19]];
      eYP1 = rndNum(canDi*0.475,canDi*0.485);
      line(eyeShiftX[eXP1][0],eYP1,eyeShiftX[eXP1][0],eYP1+canDi*0.025);
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]+20);
      line(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1,eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1+canDi*0.025);
      break;
    case 16:
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      strokeWeight(eyeStrokeWeight);
      beginShape();
      curveVertex(canDi*0.475,canDi*0.45);
      curveVertex(canDi*0.475,canDi*0.45);
      curveVertex(canDi*0.775,canDi*0.46);
      curveVertex(canDi*0.815,canDi*0.47);
      curveVertex(canDi*0.795,canDi*0.58);
      curveVertex(canDi*0.7,canDi*0.58);
      curveVertex(canDi*0.675,canDi*0.5);
      curveVertex(canDi*0.635,canDi*0.5);
      curveVertex(canDi*0.61,canDi*0.58);
      curveVertex(canDi*0.5,canDi*0.58);
      curveVertex(canDi*0.475,canDi*0.45);
      curveVertex(canDi*0.475,canDi*0.45);
      endShape();
      stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      beginShape();
      vertex(canDi*0.7,canDi*0.475);
      vertex(canDi*0.7,canDi*0.475);
      vertex(canDi*0.79,canDi*0.475);
      vertex(canDi*0.8,canDi*0.485);
      curveVertex(canDi*0.785,canDi*0.57);
      curveVertex(canDi*0.71,canDi*0.57);
      vertex(canDi*0.7,canDi*0.475);
      vertex(canDi*0.7,canDi*0.475);
      endShape();
      beginShape();
      vertex(canDi*0.5,canDi*0.465);
      vertex(canDi*0.5,canDi*0.465);
      vertex(canDi*0.61,canDi*0.465);
      vertex(canDi*0.62,canDi*0.485);
      curveVertex(canDi*0.6,canDi*0.57);
      curveVertex(canDi*0.51,canDi*0.57);
      vertex(canDi*0.5,canDi*0.465);
      vertex(canDi*0.5,canDi*0.465);
      endShape();
      stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]+20);
      noFill();
      strokeWeight(eyeStrokeWeight);
      eyeShiftX = [[canDi*0.51,canDi*0.2],[canDi*0.6,canDi*0.19]];
      eYP1 = rndNum(canDi*0.475,canDi*0.485);
      line(eyeShiftX[eXP1][0],eYP1,eyeShiftX[eXP1][0],eYP1+canDi*0.025);
      line(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1,eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1+canDi*0.025);
      break;
    case 17:
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      fill(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      strokeWeight(eyeStrokeWeight);
      beginShape();
      curveVertex(canDi*0.475,canDi*0.45);
      curveVertex(canDi*0.475,canDi*0.45);
      curveVertex(canDi*0.775,canDi*0.46);
      curveVertex(canDi*0.815,canDi*0.47);
      curveVertex(canDi*0.795,canDi*0.58);
      curveVertex(canDi*0.7,canDi*0.58);
      curveVertex(canDi*0.675,canDi*0.5);
      curveVertex(canDi*0.635,canDi*0.5);
      curveVertex(canDi*0.61,canDi*0.58);
      curveVertex(canDi*0.5,canDi*0.58);
      curveVertex(canDi*0.475,canDi*0.45);
      curveVertex(canDi*0.475,canDi*0.45);
      endShape();
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.compliment[2]);
      fill(colPal.highlight[0],colPal.highlight[1],colPal.compliment[2]);
      beginShape();
      vertex(canDi*0.7,canDi*0.475);
      vertex(canDi*0.7,canDi*0.475);
      vertex(canDi*0.79,canDi*0.475);
      vertex(canDi*0.8,canDi*0.485);
      curveVertex(canDi*0.785,canDi*0.57);
      curveVertex(canDi*0.71,canDi*0.57);
      vertex(canDi*0.7,canDi*0.475);
      vertex(canDi*0.7,canDi*0.475);
      endShape();
      beginShape();
      vertex(canDi*0.5,canDi*0.465);
      vertex(canDi*0.5,canDi*0.465);
      vertex(canDi*0.61,canDi*0.465);
      vertex(canDi*0.62,canDi*0.485);
      curveVertex(canDi*0.6,canDi*0.57);
      curveVertex(canDi*0.51,canDi*0.57);
      vertex(canDi*0.5,canDi*0.465);
      vertex(canDi*0.5,canDi*0.465);
      endShape();
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2],0.25);
      strokeWeight(eyeStrokeWeight/2);
      iterator = 0;
      for (let headStrokes = 0; headStrokes < 9; headStrokes++) {
        line(canDi*0.5+iterator,canDi*0.46,canDi*0.5+iterator,rndNum(canDi*0.535,canDi*0.575));
        iterator = iterator + canDi*0.015;
      }
      iterator = 0;
      for (let headStrokes = 0; headStrokes < 8; headStrokes++) {
        line(canDi*0.7+iterator,canDi*0.46,canDi*0.7+iterator,rndNum(canDi*0.535,canDi*0.575));
        iterator = iterator + canDi*0.015;
      }
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]+20);
      noFill();
      strokeWeight(eyeStrokeWeight);
      eyeShiftX = [[canDi*0.51,canDi*0.2],[canDi*0.6,canDi*0.19]];
      eYP1 = rndNum(canDi*0.475,canDi*0.485);
      line(eyeShiftX[eXP1][0],eYP1,eyeShiftX[eXP1][0],eYP1+canDi*0.025);
      line(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1,eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1+canDi*0.025);
      break;
    case 18:
      //Alien Eyes ??? Vampire?
      //pupils
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      strokeWeight(eyeStrokeWeight*3);
      eyeShiftX = [[canDi*0.55,canDi*0.135],[canDi*0.595,canDi*0.115]];
      eYP1 = rndNum(canDi*0.475,canDi*0.5);
      point(eyeShiftX[eXP1][0],eYP1+canDi*0.025);
      point(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1+canDi*0.025);
      //line(eyeShiftX[eXP1][0],eYP1,eyeShiftX[eXP1][0],eYP1+canDi*0.065);
      //line(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1,eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1+canDi*0.065);
      stroke(baseColourList.red[0],baseColourList.red[1],baseColourList.red[2]);
      fill(baseColourList.red[0],baseColourList.red[1],baseColourList.red[2]);
      strokeWeight(rndArr([eyeStrokeWeight,eyeStrokeWeight*2]));
      point(eyeShiftX[eXP1][0],eYP1+canDi*0.025);
      point(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1+canDi*0.025);
      //line(eyeShiftX[eXP1][0],eYP1+canDi*0.01,eyeShiftX[eXP1][0],eYP1+canDi*0.05);
      //line(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1+canDi*0.01,eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1+canDi*0.05);
      break;
    case 19:
      eyeShiftX = [[canDi*0.55,canDi*0.135],[canDi*0.595,canDi*0.115]];
      eYP1 = rndNum(canDi*0.5,canDi*0.515);
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      strokeWeight(eyeStrokeWeight);
      beginShape();
      curveVertex(canDi*0.515,canDi*0.51);
      curveVertex(canDi*0.515,canDi*0.51);
      curveVertex(canDi*0.565,canDi*0.485);
      curveVertex(canDi*0.615,canDi*0.505);
      curveVertex(canDi*0.595,canDi*0.535);
      curveVertex(canDi*0.55,canDi*0.535);
      curveVertex(canDi*0.515,canDi*0.51);
      curveVertex(canDi*0.515,canDi*0.51);
      endShape();
      beginShape();
      curveVertex(canDi*0.67,canDi*0.505);
      curveVertex(canDi*0.67,canDi*0.505);
      curveVertex(canDi*0.705,canDi*0.485);
      curveVertex(canDi*0.73,canDi*0.505);
      curveVertex(canDi*0.715,canDi*0.53);
      curveVertex(canDi*0.69,canDi*0.53);
      curveVertex(canDi*0.67,canDi*0.505);
      curveVertex(canDi*0.67,canDi*0.505);
      endShape();
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      noFill();
      strokeWeight(eyeStrokeWeight*0.75);
      beginShape();
      curveVertex(canDi*0.515,canDi*0.505);
      curveVertex(canDi*0.515,canDi*0.505);
      curveVertex(canDi*0.565,canDi*0.48);
      curveVertex(canDi*0.615,canDi*0.49);
      curveVertex(canDi*0.615,canDi*0.49);
      endShape();
      beginShape();
      curveVertex(canDi*0.67,canDi*0.49);
      curveVertex(canDi*0.67,canDi*0.49);
      curveVertex(canDi*0.705,canDi*0.48);
      curveVertex(canDi*0.73,canDi*0.49);
      curveVertex(canDi*0.73,canDi*0.49);
      endShape();
      strokeWeight(eyeStrokeWeight/2);
      beginShape();
      curveVertex(canDi*0.525,canDi*0.53);
      curveVertex(canDi*0.525,canDi*0.53);
      curveVertex(canDi*0.565,canDi*0.55);
      curveVertex(canDi*0.615,canDi*0.535);
      curveVertex(canDi*0.615,canDi*0.535);
      endShape();
      beginShape();
      curveVertex(canDi*0.68,canDi*0.53);
      curveVertex(canDi*0.68,canDi*0.53);
      curveVertex(canDi*0.705,canDi*0.54);
      curveVertex(canDi*0.73,canDi*0.53);
      curveVertex(canDi*0.73,canDi*0.53);
      endShape();
      break;
    case 20:
      eyeShiftX = [[canDi*0.55,canDi*0.135],[canDi*0.595,canDi*0.115]];
      eYP1 = rndNum(canDi*0.5,canDi*0.515);
      //lt eye (our left)
      push();
      translate(-canDi*0.15,-canDi*0.13);
      scale(1.25);
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      strokeWeight(eyeStrokeWeight);
      beginShape();
      curveVertex(canDi*0.515,canDi*0.51);
      curveVertex(canDi*0.515,canDi*0.51);
      curveVertex(canDi*0.565,canDi*0.485);
      curveVertex(canDi*0.615,canDi*0.505);
      curveVertex(canDi*0.595,canDi*0.535);
      curveVertex(canDi*0.55,canDi*0.535);
      curveVertex(canDi*0.515,canDi*0.51);
      curveVertex(canDi*0.515,canDi*0.51);
      endShape();
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      strokeWeight(eyeStrokeWeight);
      ellipse(eyeShiftX[eXP1][0],eYP1,canDi*0.0065,canDi*0.015);
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      noFill();
      strokeWeight(eyeStrokeWeight/2);
      beginShape();
      curveVertex(canDi*0.515,canDi*0.505);
      curveVertex(canDi*0.515,canDi*0.505);
      curveVertex(canDi*0.565,canDi*0.48);
      curveVertex(canDi*0.615,canDi*0.49);
      curveVertex(canDi*0.615,canDi*0.49);
      endShape();
      beginShape();
      curveVertex(canDi*0.525,canDi*0.53);
      curveVertex(canDi*0.525,canDi*0.53);
      curveVertex(canDi*0.565,canDi*0.55);
      curveVertex(canDi*0.615,canDi*0.535);
      curveVertex(canDi*0.615,canDi*0.535);
      endShape();
      pop();
      //rt eye
      push();
      translate(-canDi*0.17,-canDi*0.13);
      scale(1.25);
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      strokeWeight(eyeStrokeWeight);
      beginShape();
      curveVertex(canDi*0.67,canDi*0.505);
      curveVertex(canDi*0.67,canDi*0.505);
      curveVertex(canDi*0.705,canDi*0.485);
      curveVertex(canDi*0.73,canDi*0.505);
      curveVertex(canDi*0.715,canDi*0.53);
      curveVertex(canDi*0.69,canDi*0.53);
      curveVertex(canDi*0.67,canDi*0.505);
      curveVertex(canDi*0.67,canDi*0.505);
      endShape();
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      strokeWeight(eyeStrokeWeight);
      ellipse(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1,canDi*0.0035,canDi*0.013);
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      noFill();
      strokeWeight(eyeStrokeWeight/2);
      beginShape();
      curveVertex(canDi*0.67,canDi*0.49);
      curveVertex(canDi*0.67,canDi*0.49);
      curveVertex(canDi*0.705,canDi*0.48);
      curveVertex(canDi*0.73,canDi*0.49);
      curveVertex(canDi*0.73,canDi*0.49);
      endShape();
      beginShape();
      curveVertex(canDi*0.68,canDi*0.53);
      curveVertex(canDi*0.68,canDi*0.53);
      curveVertex(canDi*0.705,canDi*0.54);
      curveVertex(canDi*0.73,canDi*0.53);
      curveVertex(canDi*0.73,canDi*0.53);
      endShape();
      pop();
      break;
    case 21:
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      strokeWeight(eyeStrokeWeight*1.25);
      eyeShiftX = [[canDi*0.525,canDi*0.15],[canDi*0.575,canDi*0.135]];
      eYP1 = rndNum(canDi*0.5,canDi*0.525);
      line(eyeShiftX[eXP1][0],eYP1,eyeShiftX[eXP1][0]+canDi*0.045,eYP1);
      line(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1,eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1]+canDi*0.045,eYP1);
      break;
    case 22:
      //pumpkin eyes
      strokeWeight(eyeStrokeWeight*3);
      eyeShiftX = [[canDi*0.55,canDi*0.135],[canDi*0.595,canDi*0.115]];
      eYP1 = rndNum(canDi*0.475,canDi*0.5);
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      strokeWeight(eyeStrokeWeight);
      ellipse(eyeShiftX[eXP1][0],eYP1+canDi*0.025,canDi*0.0005,canDi*0.025);
      ellipse(eyeShiftX[eXP1][0]+eyeShiftX[eXP1][1],eYP1+canDi*0.025,canDi*0.0005,canDi*0.025);
      break;
    case 23:
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      noFill();
      strokeWeight(canDi*0.01);
      switch (rndArr([0,1])) {
        case 1:
          switch (rndArr([0,0,0,0,0,0,1])) {
            case 1:
              iterator = 0;
              strokeShrink = 0;
              for (var i = 0; i < 50; i++) {
                strokeWeight(canDi*0.008-strokeShrink);
                circle(canDi*0.565,canDi*0.5,canDi*0.125+iterator);
                iterator = (iterator + canDi*0.05) / 0.95;
                strokeShrink = strokeShrink + canDi*0.00075;
              }
              specialTrait = 'Hypnotized';
              break;
            default:
              circle(canDi*0.565,canDi*0.5,canDi*0.125);
          }
          break;
        default:
          circle(canDi*0.565,canDi*0.5,canDi*0.125);
      }
      strokeWeight(canDi*0.01);
      circle(canDi*0.7,canDi*0.5,canDi*0.095);
      fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      switch (rndArr([0,1])) {
        case 1:
          circle(canDi*0.565,canDi*0.5,rndNum(canDi*0.03,canDi*0.075));
          break;
        default:
      }
      switch (rndArr([0,1])) {
        case 1:
          circle(canDi*0.7,canDi*0.5,rndNum(canDi*0.01,canDi*0.05));
          break;
        default:
      }
      break;
    case 24:
      //leave blank for enligthened eyes
      break;
    case 25:
      //bling glasses
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      strokeWeight(eyeStrokeWeight*0.75);
      beginShape();
      curveVertex(canDi*0.53,canDi*0.43);
      curveVertex(canDi*0.76,canDi*0.43);
      curveVertex(canDi*0.815,canDi*0.47);
      curveVertex(canDi*0.8,canDi*0.59);
      curveVertex(canDi*0.7,canDi*0.59);
      curveVertex(canDi*0.67,canDi*0.5);
      curveVertex(canDi*0.65,canDi*0.5);
      curveVertex(canDi*0.61,canDi*0.6);
      curveVertex(canDi*0.48,canDi*0.6);
      curveVertex(canDi*0.465,canDi*0.45);
      endShape(CLOSE);
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]+20);
      noFill();
      strokeWeight(eyeStrokeWeight*1.5);
      eyeShiftX = [[canDi*0.51,canDi*0.2],[canDi*0.6,canDi*0.19]];
      eYP1 = rndNum(canDi*0.475,canDi*0.485);
      let xP1,yP1,xP2,yP2;
      xP1 = rndNum(canDi*0.45,canDi*0.47);
      yP1 = rndNum(canDi*0.415,canDi*0.425);
      xP2 = rndNum(canDi*0.63,canDi*0.65);
      yP2 = rndNum(canDi*0.6,canDi*0.62);
      line(xP1,yP1,xP2,yP2);
      line(xP2,yP1,xP1,yP2);
      //rt side X
      xP1 = rndNum(canDi*0.68,canDi*0.7);
      yP1 = rndNum(canDi*0.415,canDi*0.425);
      xP2 = rndNum(canDi*0.8,canDi*0.82);
      yP2 = rndNum(canDi*0.6,canDi*0.61);
      line(xP1,yP1,xP2,yP2);
      line(xP2,yP1,xP1,yP2);
      break;
    case 26:
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      strokeWeight(canDi*0.01);
      fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      circle(canDi*0.565,canDi*0.5,rndNum(canDi*0.03,canDi*0.075));
      circle(canDi*0.7,canDi*0.5,rndNum(canDi*0.01,canDi*0.05));
      let vC = rndNum(-canDi*0.09,canDi*0.09);//vector change
      line(canDi*0.565,canDi*0.5,canDi,canDi*0.5+vC);
      line(canDi*0.7,canDi*0.5,canDi,canDi*0.5+(vC/2));
      break;
  }
  if ([0,1,2,3,4,5,6,7,8,9,10,12,13,14,18,19,20,21].includes(eyeChoice)) {
    drawEyeLines(canDi*0.565,canDi*0.6);
  }else{}
  function seeRainbows(x=canDi*0.6,y=canDi*0.5){
    let colArr = [[colPal.outline[0],colPal.outline[1],70],[colPal.teeth[0],colPal.teeth[1],70],[250,colPal.bg[1],70],[colPal.bg[0],colPal.bg[1],50]];
    stroke(colPal.bg[0],colPal.bg[1],50);
    strokeJoin(ROUND);
    noFill();
    let xCrds = [x*rndArr([1.0075,0.9925]),x*rndArr([1.005,0.995]),x*rndArr([1.0075,0.9925]),x*rndArr([1.005,0.995])];
    let yCrds = [y*0.85+rndNum(-canDi*0.015,canDi*0.015),y*0.65+rndNum(-canDi*0.015,canDi*0.015),y*0.45+rndNum(-canDi*0.015,canDi*0.015),y*0.25+rndNum(-canDi*0.015,canDi*0.015)];
    iterator = 0;
    let itr2 = 0;
    let xO = canDi*0.115;//x offset
    let yOArr = [0,canDi*0.015,canDi*0.015,0];
    for (var i = 0; i < colArr.length; i++) {
      strokeWeight(canDi*0.02);
      stroke(colArr[i]);
      beginShape();
      curveVertex(x+iterator,y-yOArr[i]);
      curveVertex(x+iterator,y-yOArr[i]);
      curveVertex(xCrds[0]+iterator,yCrds[0]);
      curveVertex(xCrds[1]+iterator,yCrds[1]);
      curveVertex(xCrds[2]+iterator,yCrds[2]);
      curveVertex(xCrds[3]+iterator,yCrds[3]);
      curveVertex(x+iterator,0);
      curveVertex(x+iterator,0);
      endShape();
      stroke(colArr[i]);
      strokeWeight(canDi*0.0175);
      beginShape();
      curveVertex(x+itr2+xO,y-yOArr[i]);
      curveVertex(x+itr2+xO,y-yOArr[i]);
      curveVertex(xCrds[0]+itr2+xO,yCrds[0]);
      curveVertex(xCrds[1]+itr2+xO,yCrds[1]);
      curveVertex(xCrds[2]+itr2+xO,yCrds[2]);
      curveVertex(xCrds[3]+itr2+xO,yCrds[3]);
      curveVertex(x+itr2+xO,0);
      curveVertex(x+itr2+xO,0);
      endShape();
      iterator -= canDi*0.0175;
      itr2 -= canDi*0.01;
    }
    specialTrait = 'rainbows';
  }
  function drawEyeLines(x,y){
    noFill();
    let lineCount = rndArr([0,1,2]);
    let dC,iterator;//dimension change
    strokeWeight(canDi*0.0075);
    switch (lineCount) {
      case 0:
        break;
      case 1:
        dC = rndArr([1,0.5,0.75]);
        beginShape();
        curveVertex(x+(canDi*0.05*dC),y-(canDi*0.025*dC));
        curveVertex(x+(canDi*0.05*dC),y-(canDi*0.025*dC));
        curveVertex(x+(canDi*0.04*dC),y-(canDi*0.015*dC));
        curveVertex(x,y);
        curveVertex(x-(canDi*0.04*dC),y-(canDi*0.015*dC));
        curveVertex(x-(canDi*0.05*dC),y-(canDi*0.025*dC));
        curveVertex(x-(canDi*0.05*dC),y-(canDi*0.025*dC));
        endShape();
        break;
      case 2:
        iterator = 0;
        for (var i = 0; i < 2; i++) {
          dC = rndArr([1,0.5,0.75]);
          beginShape();
          curveVertex(x+(canDi*0.05*dC),y+iterator-(canDi*0.025*dC));
          curveVertex(x+(canDi*0.05*dC),y+iterator-(canDi*0.025*dC));
          curveVertex(x+(canDi*0.04*dC),y+iterator-(canDi*0.015*dC));
          curveVertex(x,y+iterator);
          curveVertex(x-(canDi*0.04*dC),y+iterator-(canDi*0.015*dC));
          curveVertex(x-(canDi*0.05*dC),y+iterator-(canDi*0.025*dC));
          curveVertex(x-(canDi*0.05*dC),y+iterator-(canDi*0.025*dC));
          endShape();
          iterator = iterator + canDi*0.015;
        }
        break;
    }
  }
  function drawEyeEllipse(side=0) {
    let xP1,yP1,ellipseWidth, ellipseHeight;
    switch (side) {
      case 1:
        xP1 = rndNum(canDi*0.7,canDi*0.72);
        yP1 = rndNum(canDi*0.485,canDi*0.5);
        ellipseWidth = rndNum(canDi*0.02,canDi*0.08);
        ellipseHeight = rndNum(canDi*0.08,canDi*0.15);
        strokeWeight(canDi*0.0095);
        ellipse(xP1,yP1,ellipseWidth,ellipseHeight);
        switch (rndArr([0,0,1])) {
          case 1:
            strokeWeight(canDi*0.025);
            point(xP1,yP1);
            break;
          default:
        }
        break;
      default:
        xP1 = rndNum(canDi*0.56,canDi*0.565);
        yP1 = rndNum(canDi*0.485,canDi*0.5);
        ellipseWidth = rndNum(canDi*0.04,canDi*0.1);
        ellipseHeight = rndNum(canDi*0.05,canDi*0.15);
        strokeWeight(canDi*0.0095);
        ellipse(xP1,yP1,ellipseWidth,ellipseHeight);
        switch (rndArr([0,0,1])) {
          case 1:
            strokeWeight(canDi*0.025);
            point(xP1,yP1);
          break;
        default:
      }
    }
  }
  let eyesDescription = {0:'twin lines',1:'IX',2:'XX',3:'XI',4:'OX',5:'XO',6:'OO',7:'oI',8:'IO',9:'suspicious',10:'oo',11:'bleeding sockets',12:'rising sockets',13:'RI',14:'LI',15:'3D',16:'DG',17:'GG',18:'intense',19:'blank',20:'cartoon',21:'flat lines',22:'pumpkin eyes',23:'bullseye',24:'enligthened',25:'BLING',26:'--------'};
  return eyesDescription[eyeChoice];
}
function setNose(noseChoice,colPal,canDi) {
  let nXP1,nYP1,nYP2,nP2,nP3
  let noseColour = rndArr([0,1]);
  let noseOutline = canDi*0.015;
  let nC1,nC2,nC3;
  switch (noseChoice) {
    case 0:
      //no nose
      break;
    case 1:
      //line nose
      if (colourChoice === 12) {
        switch (makeClown) {
          case 1:
            strokeWeight(noseOutline*1.25);
            drawClownNose(canDi*0.6485,canDi*0.65);
            break;
          default:
          stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
          noFill();
          strokeWeight(noseOutline*1.25);
          line(canDi*0.6485,canDi*0.55,canDi*0.6485,canDi*0.65);
        }
      } else {
        stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
        noFill();
        strokeWeight(noseOutline*1.25);
        line(canDi*0.6485,canDi*0.55,canDi*0.6485,canDi*0.65);
      }
      break;
    case 2:
      //bruiser
      switch (noseColour) {
        case 0:
          nC1 = [colPal.darkaccent[0],colPal.compliment[1],colPal.compliment[2]];
          nC2 = [colPal.compliment[0],colPal.darkaccent[1],colPal.darkaccent[2]];
          nC3 = [colPal.bg[0],colPal.bg[1],colPal.bg[2]];
          nC4 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          break;
        case 1:
          nC1 = [colPal.base[0],colPal.base[1],colPal.base[2]-5];
          nC2 = nC1;
          nC3 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          nC4 = nC3;
          break;
      }
      stroke(nC1[0],nC1[1],nC1[2]);
      fill(nC1[0],nC1[1],nC1[2]);
      strokeWeight(noseOutline*2.25);
      nXP1 = rndNum(canDi*0.6465,canDi*0.6485);
      nYP1 = rndNum(canDi*0.63,canDi*0.65);
      nP2 = rndNum(-canDi*0.005,canDi*0.005);
      nP3 = rndNum(-canDi*0.005,canDi*0.005);
      line(nXP1,rndNum(canDi*0.45,canDi*0.55),nXP1,nYP1);
      stroke(nC2[0],nC2[1],nC2[2]);
      fill(nC2[0],nC2[1],nC2[2]);
      line(nXP1-canDi*0.035,nYP1+nP2,nXP1+canDi*0.035,nYP1+nP3);
      stroke(nC3[0],nC3[1],nC3[2]);
      fill(nC3[0],nC3[1],nC3[2]);
      strokeWeight(noseOutline);
      drawNostril(nXP1-canDi*0.035,nYP1+nP2);
      drawNostril(nXP1+canDi*0.035,nYP1+nP3,1);
      stroke(nC4[0],nC4[1],nC4[2]);
      noFill();
      strokeWeight(noseOutline/2);
      beginShape();
      curveVertex(nXP1+canDi*0.0475,nYP1+canDi*0.015);
      curveVertex(nXP1+canDi*0.0475,nYP1+canDi*0.015);
      curveVertex(nXP1+canDi*0.055,nYP1);
      curveVertex(nXP1+canDi*0.0475,nYP1-canDi*0.0175);
      curveVertex(nXP1+canDi*0.02,nYP1-canDi*0.03);
      curveVertex(nXP1+canDi*0.02,nYP1-canDi*0.1);
      curveVertex(nXP1+canDi*0.02,nYP1-canDi*0.1);
      endShape();
      break;
    case 3:
      //
      switch (noseColour) {
        case 0:
          nC1 = [colPal.compliment[0],colPal.darkaccent[1],colPal.darkaccent[2]];
          nC2 = [colPal.darkaccent[0],colPal.compliment[1],colPal.compliment[2]];
          nC3 = [colPal.bg[0],colPal.bg[1],colPal.bg[2]];
          nC4 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          break;
        case 1:
          nC1 = [colPal.base[0],colPal.base[1],colPal.base[2]-5];
          nC2 = nC1;
          nC3 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          nC4 = nC3;
          break;
      }
      stroke(nC1[0],nC1[1],nC1[2]);
      fill(nC1[0],nC1[1],nC1[2]);
      strokeWeight(noseOutline*2.25);
      nXP1 = rndNum(canDi*0.6465,canDi*0.6485);
      nYP1 = rndNum(canDi*0.63,canDi*0.65);
      nP2 = rndNum(-canDi*0.005,canDi*0.005);
      nP3 = rndNum(-canDi*0.005,canDi*0.005);
      line(nXP1,rndNum(canDi*0.45,canDi*0.55),nXP1,nYP1);
      stroke(nC2[0],nC2[1],nC2[2]);
      fill(nC2[0],nC2[1],nC2[2]);
      line(nXP1,nYP1+nP2,nXP1+canDi*0.035,nYP1+nP3);
      stroke(nC3[0],nC3[1],nC3[2]);
      fill(nC3[0],nC3[1],nC3[2]);
      strokeWeight(noseOutline*2.25);
      strokeWeight(noseOutline);
      drawNostril(nXP1,nYP1+nP2);
      stroke(nC4[0],nC4[1],nC4[2]);
      noFill();
      strokeWeight(noseOutline/2);
      beginShape();
      curveVertex(nXP1+canDi*0.0475,nYP1+canDi*0.015);
      curveVertex(nXP1+canDi*0.0475,nYP1+canDi*0.015);
      curveVertex(nXP1+canDi*0.055,nYP1);
      curveVertex(nXP1+canDi*0.0475,nYP1-canDi*0.0175);
      curveVertex(nXP1+canDi*0.02,nYP1-canDi*0.03);
      curveVertex(nXP1+canDi*0.02,nYP1-canDi*0.1);
      curveVertex(nXP1+canDi*0.02,nYP1-canDi*0.1);
      endShape();
      break;
    case 4:
      //
      switch (noseColour) {
        case 0:
          nC1 = [colPal.compliment[0],colPal.darkaccent[1],colPal.darkaccent[2]];
          nC2 = [colPal.darkaccent[0],colPal.compliment[1],colPal.compliment[2]];
          nC3 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          nC4 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          break;
        case 1:
          nC1 = [colPal.base[0],colPal.base[1],colPal.base[2]-5];
          nC2 = nC1;
          nC3 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          nC4 = nC3;
          break;
      }
      stroke(nC1[0],nC1[1],nC1[2]);
      fill(nC1[0],nC1[1],nC1[2]);
      strokeWeight(noseOutline*2.25);
      nXP1 = rndNum(canDi*0.6465,canDi*0.6485);
      nYP1 = rndNum(canDi*0.63,canDi*0.65);
      nYP2 = rndNum(canDi*0.45,canDi*0.55);
      nP2 = rndNum(-canDi*0.005,canDi*0.005);
      nP3 = rndNum(-canDi*0.005,canDi*0.005);
      line(nXP1,rndNum(canDi*0.45,canDi*0.55),nXP1,nYP1);
      stroke(nC2[0],nC2[1],nC2[2]);
      fill(nC2[0],nC2[1],nC2[2]);
      line(nXP1,nYP2,nXP1+canDi*0.035,nYP1+nP3);
      line(nXP1-canDi*0.035,nYP1+nP2,nXP1+canDi*0.035,nYP1+nP3);
      stroke(nC3[0],nC3[1],nC3[2]);
      fill(nC3[0],nC3[1],nC3[2]);
      strokeWeight(noseOutline);
      drawNostril(nXP1-canDi*0.015,nYP1+nP2,1);
      noFill();
      strokeWeight(noseOutline/2);
      beginShape();
      curveVertex(nXP1-canDi*0.015,nYP1+canDi*0.0175);
      curveVertex(nXP1-canDi*0.015,nYP1+canDi*0.0175);
      curveVertex(nXP1+canDi*0.0435,nYP1+canDi*0.015);
      curveVertex(nXP1+canDi*0.055,nYP1);
      curveVertex(nXP1+canDi*0.049,nYP1-canDi*0.0175);
      curveVertex(nXP1+canDi*0.048,nYP1-canDi*0.03);
      curveVertex(nXP1+canDi*0.015,nYP2);
      curveVertex(nXP1+canDi*0.015,nYP2);
      endShape();
      break;
    case 5:
      //hawk
      switch (noseColour) {
        case 0:
          nC1 = [colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]];
          nC2 = [colPal.compliment[0],colPal.compliment[1],colPal.darkaccent[2]];
          nC3 = [colPal.bg[0],colPal.bg[1],colPal.bg[2]];
          nC4 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          break;
        case 1:
          nC1 = [colPal.base[0],colPal.base[1],colPal.base[2]-5];
          nC2 = nC1;
          nC3 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          nC4 = nC3;
          break;
      }
      stroke(nC1[0],nC1[1],nC1[2]);
      fill(nC1[0],nC1[1],nC1[2]);
      strokeWeight(noseOutline*2.25);
      nXP1 = rndNum(canDi*0.6465,canDi*0.6485);
      nYP1 = rndNum(canDi*0.63,canDi*0.65);
      nYP2 = rndNum(canDi*0.45,canDi*0.55);
      nP2 = rndNum(-canDi*0.005,canDi*0.005);
      nP3 = rndNum(-canDi*0.005,canDi*0.005);
      line(nXP1,rndNum(canDi*0.45,canDi*0.55),nXP1,nYP1);
      stroke(nC2[0],nC2[1],nC2[2]);
      fill(nC2[0],nC2[1],nC2[2]);
      line(nXP1,nYP2,nXP1+canDi*0.035,nYP1+nP3);
      line(nXP1,nYP1+nP2,nXP1+canDi*0.035,nYP1+nP3);
      stroke(nC3[0],nC3[1],nC3[2]);
      fill(nC3[0],nC3[1],nC3[2]);
      strokeWeight(noseOutline);
      drawNostril(nXP1,nYP1+nP2);
      stroke(nC4[0],nC4[1],nC4[2]);
      noFill();
      strokeWeight(noseOutline/2);
      beginShape();
      curveVertex(nXP1-canDi*0.005,nYP1+canDi*0.0175);
      curveVertex(nXP1-canDi*0.005,nYP1+canDi*0.0175);
      curveVertex(nXP1+canDi*0.0435,nYP1+canDi*0.015);
      curveVertex(nXP1+canDi*0.055,nYP1);
      curveVertex(nXP1+canDi*0.049,nYP1-canDi*0.0175);
      curveVertex(nXP1+canDi*0.048,nYP1-canDi*0.03);
      curveVertex(nXP1+canDi*0.015,nYP2);
      curveVertex(nXP1+canDi*0.015,nYP2);
      endShape();
      break;
    case 6:
      //
      switch (noseColour) {
        case 0:
          nC1 = [colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]];
          nC2 = [colPal.bg[0],colPal.bg[1],colPal.bg[2]];
          nC3 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          break;
        case 1:
          nC1 = [colPal.base[0],colPal.base[1],colPal.base[2]-5];
          nC2 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          nC3 = nC2;
          break;
      }
      stroke(nC1[0],nC1[1],nC1[2]);
      fill(nC1[0],nC1[1],nC1[2]);
      strokeWeight(noseOutline*2.25);
      nXP1 = rndNum(canDi*0.6465,canDi*0.6485);
      nYP1 = rndNum(canDi*0.63,canDi*0.65);
      nYP2 = rndNum(canDi*0.45,canDi*0.55);
      nP2 = rndNum(-canDi*0.005,canDi*0.005);
      nP3 = rndNum(-canDi*0.005,canDi*0.005);
      line(nXP1-canDi*0.035,nYP1+nP2,nXP1+canDi*0.035,nYP1+nP3);
      stroke(nC2[0],nC2[1],nC2[2]);
      fill(nC2[0],nC2[1],nC2[2]);
      strokeWeight(noseOutline);
      drawNostril(nXP1-canDi*0.035,nYP1+nP2);
      drawNostril(nXP1+canDi*0.035,nYP1+nP3,1);
      stroke(nC3[0],nC3[1],nC3[2]);
      noFill();
      strokeWeight(noseOutline/2);
      beginShape();
      curveVertex(nXP1+canDi*0.0475,nYP1+canDi*0.015);
      curveVertex(nXP1+canDi*0.0475,nYP1+canDi*0.015);
      curveVertex(nXP1+canDi*0.055,nYP1);
      curveVertex(nXP1+canDi*0.0475,nYP1-canDi*0.0175);
      curveVertex(nXP1+canDi*0.01,nYP1-canDi*0.03);
      curveVertex(nXP1+canDi*0.01,nYP2);
      curveVertex(nXP1+canDi*0.01,nYP2);
      endShape();
      break;
    case 7:
      //
      switch (noseColour) {
        case 0:
          nC1 = [colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]];
          nC2 = [colPal.bg[0],colPal.bg[1],colPal.bg[2]];
          nC3 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          break;
        case 1:
          nC1 = [colPal.base[0],colPal.base[1],colPal.base[2]-5];
          nC2 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          nC3 = nC2;
          break;
      }
      stroke(nC1[0],nC1[1],nC1[2]);
      strokeWeight(noseOutline*2.25);
      nXP1 = rndNum(canDi*0.6465,canDi*0.6485);
      nYP1 = rndNum(canDi*0.63,canDi*0.65);
      nYP2 = rndNum(canDi*0.45,canDi*0.55);
      nP2 = rndNum(-canDi*0.005,canDi*0.005);
      nP3 = rndNum(-canDi*0.005,canDi*0.005);
      line(nXP1,nYP1+nP2,nXP1+canDi*0.035,nYP1+nP3);
      stroke(nC2[0],nC2[1],nC2[2]);
      fill(nC2[0],nC2[1],nC2[2]);
      strokeWeight(noseOutline);
      drawNostril(nXP1,nYP1+nP2);
      stroke(nC3[0],nC3[1],nC3[2]);
      noFill();
      strokeWeight(noseOutline/2);
      beginShape();
      curveVertex(nXP1+canDi*0.0475,nYP1+canDi*0.015);
      curveVertex(nXP1+canDi*0.0475,nYP1+canDi*0.015);
      curveVertex(nXP1+canDi*0.055,nYP1);
      curveVertex(nXP1+canDi*0.0475,nYP1-canDi*0.0175);
      curveVertex(nXP1+canDi*0.01,nYP1-canDi*0.03);
      curveVertex(nXP1+canDi*0.01,nYP2);
      curveVertex(nXP1+canDi*0.01,nYP2);
      endShape();
      break;
    case 8:
      //
      switch (noseColour) {
        case 0:
          nC1 = [colPal.darkaccent[0],colPal.compliment[1],colPal.compliment[2]];
          nC2 = [colPal.bg[0],colPal.bg[1],colPal.bg[2]];
          nC3 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          break;
        case 1:
          nC1 = [colPal.base[0],colPal.base[1],colPal.base[2]-5];
          nC2 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          nC3 = nC2;
          break;
      }
      stroke(nC1[0],nC1[1],nC1[2]);
      fill(nC1[0],nC1[1],nC1[2]);
      strokeWeight(noseOutline*2.25);
      nXP1 = rndNum(canDi*0.6465,canDi*0.6485);
      nYP1 = rndNum(canDi*0.6,canDi*0.62);
      nYP2 = rndNum(canDi*0.45,canDi*0.55);
      nP2 = rndNum(-canDi*0.005,canDi*0.005);
      nP3 = rndNum(-canDi*0.005,canDi*0.005);
      rect(nXP1,nYP1+nP2,canDi*0.05,canDi*0.025,canDi*0.0049,canDi*0.0049,canDi*0.0049,canDi*0.0049);
      stroke(nC2[0],nC2[1],nC2[2]);
      fill(nC2[0],nC2[1],nC2[2]);
      strokeWeight(noseOutline);
      drawNostril(nXP1,nYP1+nP2+canDi*0.025);
      stroke(nC3[0],nC3[1],nC3[2]);
      noFill();
      strokeWeight(noseOutline/2);
      beginShape();
      curveVertex(nXP1-canDi*0.005,nYP1+nP2+canDi*0.045);
      curveVertex(nXP1-canDi*0.005,nYP1+nP2+canDi*0.045);
      curveVertex(nXP1+canDi*0.058,nYP1+canDi*0.0435);
      curveVertex(nXP1+canDi*0.065,nYP1);
      curveVertex(nXP1+canDi*0.055,nYP1-canDi*0.0175);
      curveVertex(nXP1+canDi*0.01,nYP1-canDi*0.03);
      curveVertex(nXP1+canDi*0.01,nYP2);
      curveVertex(nXP1+canDi*0.01,nYP2);
      endShape();
      break;
    case 9:
      //
      switch (noseColour) {
        case 0:
          nC1 = [colPal.darkaccent[0],colPal.compliment[1],colPal.compliment[2]];
          nC2 = [colPal.bg[0],colPal.bg[1],colPal.bg[2]];
          nC3 = [colPal.teeth[0],colPal.teeth[1],colPal.teeth[2]];
          break;
        case 1:
          nC1 = [colPal.base[0],colPal.base[1],colPal.base[2]-5];
          nC2 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          nC3 = nC2;
          break;
      }
      stroke(nC1[0],nC1[1],nC1[2]);
      fill(nC1[0],nC1[1],nC1[2]);
      strokeWeight(noseOutline*2.25);
      nXP1 = rndNum(canDi*0.6465,canDi*0.6485);
      nYP1 = rndNum(canDi*0.6,canDi*0.62);
      nYP2 = rndNum(canDi*0.45,canDi*0.55);
      nP2 = rndNum(-canDi*0.005,canDi*0.005);
      nP3 = rndNum(-canDi*0.005,canDi*0.005);
      line(nXP1,nYP2,nXP1,nYP1);
      rect(nXP1,nYP1+nP2,canDi*0.05,canDi*0.025,canDi*0.0049,canDi*0.0049,canDi*0.0049,canDi*0.0049);
      stroke(nC2[0],nC2[1],nC2[2]);
      fill(nC2[0],nC2[1],nC2[2]);
      strokeWeight(noseOutline);
      drawNostril(nXP1,nYP1+nP2+canDi*0.025);
      stroke(nC3[0],nC3[1],nC3[2]);
      noFill();
      strokeWeight(noseOutline/2);
      beginShape();
      curveVertex(nXP1-canDi*0.005,nYP1+nP2+canDi*0.045);
      curveVertex(nXP1-canDi*0.005,nYP1+nP2+canDi*0.045);
      curveVertex(nXP1+canDi*0.058,nYP1+canDi*0.0435);
      curveVertex(nXP1+canDi*0.065,nYP1);
      curveVertex(nXP1+canDi*0.055,nYP1-canDi*0.0175);
      curveVertex(nXP1+canDi*0.02,nYP1-canDi*0.03);
      curveVertex(nXP1+canDi*0.02,nYP2);
      curveVertex(nXP1+canDi*0.02,nYP2);
      endShape();
      break;
    case 10:
      //stout
      switch (noseColour) {
        case 0:
          nC1 = [colPal.darkaccent[0],colPal.compliment[1],colPal.compliment[2]];
          nC2 = [colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]];
          nC3 = [colPal.bg[0],colPal.bg[1],colPal.bg[2]];
          nC4 = [colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]];
          break;
        case 1:
          nC1 = [colPal.base[0],colPal.base[1],colPal.base[2]-5];
          nC2 = nC1;
          nC3 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          nC4 = nC3;
          break;
      }
      stroke(nC1[0],nC1[1],nC1[2]);
      fill(nC1[0],nC1[1],nC1[2]);
      strokeWeight(noseOutline*2.25);
      nXP1 = rndNum(canDi*0.6465,canDi*0.6485);
      nYP1 = rndNum(canDi*0.6,canDi*0.62);
      nP2 = rndNum(-canDi*0.005,canDi*0.005);
      nP3 = rndNum(-canDi*0.005,canDi*0.005);
      line(nXP1,rndNum(canDi*0.45,canDi*0.55),nXP1,nYP1);
      stroke(nC2[0],nC2[1],nC2[2]);
      fill(nC2[0],nC2[1],nC2[2]);
      line(nXP1,rndNum(canDi*0.45,canDi*0.55),nXP1+canDi*0.035,nYP1+nP3);
      rect(nXP1,nYP1+nP2,canDi*0.05,canDi*0.025,canDi*0.0049,canDi*0.0049,canDi*0.0049,canDi*0.0049);
      stroke(nC3[0],nC3[1],nC3[2]);
      fill(nC3[0],nC3[1],nC3[2]);
      strokeWeight(noseOutline);
      drawNostril(nXP1,nYP1+nP2+canDi*0.025);
      stroke(nC4[0],nC4[1],nC4[2]);
      noFill();
      strokeWeight(noseOutline/2);
      beginShape();
      curveVertex(nXP1-canDi*0.005,nYP1+nP2+canDi*0.045);
      curveVertex(nXP1-canDi*0.005,nYP1+nP2+canDi*0.045);
      curveVertex(nXP1+canDi*0.058,nYP1+canDi*0.0415);
      curveVertex(nXP1+canDi*0.065,nYP1);
      curveVertex(nXP1+canDi*0.055,nYP1-canDi*0.0175);
      curveVertex(nXP1+canDi*0.055,nYP1-canDi*0.0175);
      endShape();
      break;
    case 11:
      //
      switch (noseColour) {
        case 0:
          nC1 = [colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]];
          nC2 = [colPal.compliment[0],colPal.compliment[1],colPal.mask[2]];
          nC3 = [colPal.bg[0],colPal.bg[1],colPal.bg[2]];
          nC4 = [colPal.teeth[0],colPal.teeth[1],colPal.teeth[2]];
          break;
        case 1:
          nC1 = [colPal.base[0],colPal.base[1],colPal.base[2]-5];
          nC2 = nC1;
          nC3 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          nC4 = nC3;
          break;
      }
      stroke(nC1[0],nC1[1],nC1[2]);
      fill(nC1[0],nC1[1],nC1[2]);
      strokeWeight(noseOutline*2.25);
      nXP1 = rndNum(canDi*0.6465,canDi*0.6485);
      nYP1 = rndNum(canDi*0.6,canDi*0.62);
      nP2 = rndNum(-canDi*0.005,canDi*0.005);
      nP3 = rndNum(-canDi*0.005,canDi*0.005);
      line(nXP1,rndNum(canDi*0.45,canDi*0.55),nXP1,nYP1);
      line(nXP1,rndNum(canDi*0.45,canDi*0.55),nXP1+canDi*0.035,nYP1+nP3);
      stroke(nC2[0],nC2[1],nC2[2]);
      fill(nC2[0],nC2[1],nC2[2]);
      rect(nXP1,nYP1+nP2,canDi*0.05,canDi*0.025,canDi*0.0049,canDi*0.0049,canDi*0.0049,canDi*0.0049);
      stroke(nC3[0],nC3[1],nC3[2]);
      fill(nC3[0],nC3[1],nC3[2]);
      strokeWeight(noseOutline);
      drawNostril(nXP1,nYP1+nP2+canDi*0.025);
      stroke(nC4[0],nC4[1],nC4[2]);
      noFill();
      strokeWeight(noseOutline/2);
      beginShape();
      curveVertex(nXP1-canDi*0.005,nYP1+nP2+canDi*0.045);
      curveVertex(nXP1-canDi*0.005,nYP1+nP2+canDi*0.045);
      curveVertex(nXP1+canDi*0.058,nYP1+canDi*0.0435);
      curveVertex(nXP1+canDi*0.065,nYP1);
      curveVertex(nXP1+canDi*0.055,nYP1-canDi*0.0175);
      curveVertex(nXP1+canDi*0.055,nYP1-canDi*0.0175);
      endShape();
      break;
    case 12:
      //sharp
      switch (noseColour) {
        case 0:
          nC1 = [colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]];
          nC2 = [colPal.compliment[0],colPal.compliment[1],colPal.mask[2]];
          nC3 = [colPal.bg[0],colPal.bg[1],colPal.bg[2]];
          break;
        case 1:
          nC1 = [colPal.base[0],colPal.base[1],colPal.base[2]-10];
          nC2 = [colPal.base[0],colPal.base[1],colPal.base[2]-5];
          nC3 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
          break;
      }
      stroke(nC1[0],nC1[1],nC1[2]);
      fill(nC1[0],nC1[1],nC1[2]);
      strokeWeight(noseOutline*2.25);
      nXP1 = rndNum(canDi*0.6465,canDi*0.6485);
      nYP1 = rndNum(canDi*0.63,canDi*0.65);
      nP2 = rndNum(-canDi*0.005,canDi*0.005);
      nP3 = rndNum(-canDi*0.005,canDi*0.005);
      line(nXP1,rndNum(canDi*0.45,canDi*0.55),nXP1,nYP1);
      stroke(nC2[0],nC2[1],nC2[2]);
      fill(nC2[0],nC2[1],nC2[2]);
      line(nXP1,rndNum(canDi*0.45,canDi*0.55),nXP1+canDi*0.035,nYP1+nP3);
      line(nXP1,nYP1+nP2,nXP1+canDi*0.035,nYP1+nP3);
      stroke(nC3[0],nC3[1],nC3[2]);
      fill(nC3[0],nC3[1],nC3[2]);
      strokeWeight(noseOutline);
      drawNostril(nXP1,nYP1+nP2);
      break;
    case 13:
      //keeper
      stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      noFill();
      strokeWeight(noseOutline*1.35);
      nXP1 = canDi*0.6485;
      nYP1 = rndNum(canDi*0.545,canDi*0.565);
      line(nXP1,nYP1,nXP1-canDi*0.014,nYP1+canDi*0.085);
      line(nXP1,nYP1,nXP1+canDi*0.014,nYP1+canDi*0.085);
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      strokeWeight(noseOutline/2);
      beginShape();
      curveVertex(nXP1-canDi*0.015,nYP1-canDi*0.015);
      curveVertex(nXP1-canDi*0.015,nYP1-canDi*0.015);
      curveVertex(nXP1,nYP1-canDi*0.0195);
      curveVertex(nXP1+canDi*0.015,nYP1-canDi*0.015);
      curveVertex(nXP1+canDi*0.015,nYP1-canDi*0.015);
      endShape();
      break;
    case 14:
      //pumpkin
      nXP1 = canDi*0.65;
      nXP2 = nXP1+canDi*0.135;
      strokeWeight(canDi*0.0075);
      stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      strokeJoin(ROUND);
      fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      beginShape();
      vertex(nXP1,rndNum(canDi*0.535,canDi*0.575));
      vertex(nXP1+canDi*0.02,rndNum(canDi*0.635,canDi*0.65));
      vertex(nXP1-canDi*0.02,rndNum(canDi*0.645,canDi*0.65));
      endShape(CLOSE);
      break;
    case 15:
      //clown nose
      break;
  }
  function drawClownNose(x,y){
    switch (noseColour) {
      case 0:
        nC1 = [colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]];
        nC2 = [colPal.bg[0],colPal.bg[1],colPal.bg[2]];
        nC3 = nC2;
        break;
      case 1:
        nC1 = [colPal.outline[0],colPal.outline[1],colPal.outline[2]];
        nC2 = [colPal.bg[0],colPal.bg[1],colPal.bg[2]];
        nC3 = nC2;
        break;
    }
    let yChange = rndNum(0,canDi*0.045);
    stroke(nC1[0],nC1[1],nC1[2]);
    fill(nC1[0],nC1[1],nC1[2]);
    circle(x+canDi*0.025,y-yChange,canDi*0.075,canDi*0.075);
    stroke(nC1[0],nC1[1],70);
    noFill();
    arc(x+canDi*0.025,y-yChange,canDi*0.055,canDi*0.055,rndArr([PI+QUARTER_PI,QUARTER_PI-HALF_PI]), 0, OPEN);
    stroke(nC2[0],nC2[1],nC2[2]);
    strokeWeight(canDi*0.0075);
    fill(nC2[0],nC2[1],nC2[2]);
    beginShape();
    curveVertex(x-canDi*0.075,y);
    curveVertex(x-canDi*0.085,y-canDi*0.005);
    curveVertex(x-canDi*0.075,y-canDi*0.045);
    curveVertex(x-canDi*0.065,y-canDi*0.005);
    endShape(CLOSE);
    specialTrait = 'clown';
  }
  let noseDescription = {0:'none',1:'slit',2:'bruiser',3:'squeeky',4:'eagle',5:'hawk',6:'broad',7:'tiny',8:'8',9:'brawny',10:'stout',11:'knocked',12:'sharp',13:'keeper',14:'pumpkin'};
  return noseDescription[noseChoice];
}
function setMouth(mouthChoice,eyeChoice,colPal,canDi) {
  let eXP1 = canDi*0.5;
  let eYP1,mX,mX2,mY,mY2,mS,snarl,mCrds,numTeeth,tempXRange,specialLolli,specialTraitChance;
  let lipsStrokeWeight = rndNum(canDi*0.0165,canDi*0.0195);
  let lipMove1 = rndNum(canDi*0.05,canDi*0.07);
  let lipMove2 = rndNum(canDi*0.07,canDi*0.09);
  let rotationChoice = rndArr([0,1,2]);
  if ([18,19].includes(colourChoice)) {
    specialLolli = 0;
  } else {
    specialLolli = rndNum(0,30);
  }
  if ([15].includes(colourChoice)) {
    specialTraitChance = rndNum(0,10);
  } else {
    specialTraitChance = 0;
  }
  switch(mouthChoice) {
    case 0:
      //no mouth
      break;
    case 1:
      //smirk
      mCrds = [canDi*0.625,rndNum(canDi*0.73,canDi*0.74),canDi*0.675,rndNum(canDi*0.7,canDi*0.72)];
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      strokeWeight(lipsStrokeWeight);
      noFill();
      line(mCrds[0],mCrds[1],mCrds[2],mCrds[3]);
      drawCornerWrinkleLines(mCrds[0],mCrds[1]);
      drawSoulPatch(mCrds[2]-((mCrds[2]-mCrds[0])*0.35),mCrds[1],hairChoice,mouthChoice,addBeard);
      drawMustache(mCrds,hairChoice,mouthChoice,addBeard,9);
      if (colourChoice === 13 && eyeChoice != 11) {
        if (rndNum(0,3) === 1) {
          specialTrait = "bubblegum";
          stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
          fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
          strokeWeight(lipsStrokeWeight*0.015);
          circle(mCrds[2]+canDi*0.085,mCrds[3]+canDi*0.025,canDi*0.2);
          stroke(colPal.highlight[0],colPal.highlight[1],80);
          strokeWeight(lipsStrokeWeight*2);
          point(mCrds[2]+canDi*0.115,mCrds[3]-canDi*0.035);
        } else {}
      } else {
        drawLollipop(mCrds[2],mCrds[3],specialLolli,1);
      }
      break;
    case 2:
      //slight smile
      mY = rndNum(canDi*0.69,canDi*0.71);
      mCrds = [rndNum(canDi*0.57,canDi*0.6),mY,canDi*0.625,mY+rndNum(canDi*0.01,canDi*0.04),rndNum(canDi*0.65,canDi*0.675),canDi*0.73];
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      strokeWeight(lipsStrokeWeight);
      noFill();
      beginShape();
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[2],mCrds[3]);
      curveVertex(mCrds[4],mCrds[5]);
      curveVertex(mCrds[4],mCrds[5]);
      endShape();
      drawSoulPatch(mCrds[2],mCrds[3],hairChoice,mouthChoice,addBeard);
      drawMustache([mCrds[0],mCrds[1],mCrds[4],mCrds[5]],hairChoice,mouthChoice,addBeard,9);
      if (colourChoice === 13 && eyeChoice != 11) {
        if (rndNum(0,3) === 1) {
          specialTrait = "bubblegum";
          stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
          fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
          strokeWeight(lipsStrokeWeight*0.015);
          circle(mCrds[2]+canDi*0.085,mCrds[3]+canDi*0.045,canDi*0.2);
          stroke(colPal.highlight[0],colPal.highlight[1],80);
          strokeWeight(lipsStrokeWeight*2);
          point(mCrds[2]+canDi*0.115,mCrds[3]-canDi*0.015);
        } else {}
      } else {
        drawLollipop(mCrds[4],mCrds[5],specialLolli,1);
      }
      break;
    case 3:
      //sneer
      mX = rndNum(canDi*0.515,canDi*0.55);
      mY = rndNum(canDi*0.73,canDi*0.76);
      mCrds = [mX,mY,mX+canDi*0.02,mY-rndNum(canDi*0.02,canDi*0.04),canDi*0.6,mY-rndNum(canDi*0.03,canDi*0.05),mX+rndNum(canDi*0.12,canDi*0.15),mY+rndNum(0,canDi*0.01)];
      push();
      switch (rotationChoice) {
        case 0:
          break;
        case 1:
          translate(-canDi*0.2,canDi*0.275);
          rotate(PI / -8);
          break;
        case 2:
          translate(canDi*0.11,-canDi*0.085);
          rotate(PI / rndNum(20,23));
          break;
      }
      noStroke();
      fill(colPal.teeth[0],colPal.teeth[1],colPal.teeth[2]);
      strokeWeight(lipsStrokeWeight*0.75);
      if (colourChoice === 4) {
        specialTrait = "fangs";
        drawTooth(mCrds[2],mCrds[3],0,1);
      } else {}
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      strokeWeight(lipsStrokeWeight);
      noFill();
      beginShape();
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[2],mCrds[3]);
      curveVertex(mCrds[4],mCrds[5]);
      curveVertex(mCrds[6],mCrds[7]);
      curveVertex(mCrds[6],mCrds[7]);
      endShape();
      drawCornerWrinkleLines(mCrds[0],mCrds[1]);
      drawSoulPatch(mCrds[2],mCrds[3],hairChoice,mouthChoice,addBeard,9);
      drawMustache([mCrds[0],mCrds[1],mCrds[6],mCrds[7]],hairChoice,mouthChoice,addBeard,15);
      drawLollipop(mCrds[6],mCrds[7],specialLolli,1);
      pop();
      break;
    case 4:
      //coy
      mX = rndNum(canDi*0.515,canDi*0.55);
      mY = rndNum(canDi*0.66,canDi*0.68);
      mCrds = [mX,mY,mX+canDi*0.02,mY+rndNum(canDi*0.01,canDi*0.03),canDi*0.6,mY+rndNum(canDi*0.03,canDi*0.05),canDi*0.7,mY+rndNum(canDi*0.04,canDi*0.06)];
      push();
      switch (rotationChoice) {
        case 0:
          break;
        case 1:
          translate(-canDi*0.175,canDi*0.25);
          rotate(PI / rndNum(-10,-11));
          break;
        case 2:
          translate(canDi*0.11,-canDi*0.085);
          rotate(PI / rndNum(20,23));
          break;
      }
      noStroke();
      fill(colPal.teeth[0],colPal.teeth[1],colPal.teeth[2]);
      strokeWeight(lipsStrokeWeight*0.75);
      if (colourChoice === 4) {
        specialTrait = "fangs";
        drawTooth(mCrds[2],mCrds[3]+canDi*0.01,0,1);
      } else {}
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      strokeWeight(lipsStrokeWeight);
      noFill();
      beginShape();
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[2],mCrds[3]);
      curveVertex(mCrds[4],mCrds[5]);
      curveVertex(mCrds[6],mCrds[7]);
      curveVertex(mCrds[6],mCrds[7]);
      endShape();
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      beginShape();
      curveVertex(mCrds[4],mCrds[5]+canDi*0.03);
      curveVertex(mCrds[4],mCrds[5]+canDi*0.03);
      curveVertex(mCrds[6]-canDi*0.05,mCrds[7]+canDi*0.03);
      curveVertex(mCrds[6]-canDi*0.05,mCrds[7]+canDi*0.03);
      endShape();
      // make an upside down option
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      drawCornerWrinkleLines(mCrds[0],mCrds[1],0,1);
      drawLollipop(mCrds[6],mCrds[7],specialLolli,1);
      pop();
      break;
    case 5:
      //confused
      mCrds = [canDi*0.55,rndNum(canDi*0.725,canDi*0.775),rndNum(canDi*0.535,canDi*0.575),canDi*0.675,canDi*0.6,canDi*0.675,canDi*0.65,rndNum(canDi*0.725,canDi*0.775),canDi*0.6,rndNum(canDi*0.715,canDi*0.735)];

      if (colourChoice === 10) {
        specialTrait = "zombie drool";
        strokeWeight(lipsStrokeWeight);
        tempXRange = [canDi*0.55,canDi*0.56];
        iterator = 0;
        for (let step = 0; step < rndArr([1,2]); step++) {
            let droolColour = rndArr([[colPal.highlight[0],colPal.highlight[1],colPal.darkaccent[2]],[colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]]])
            stroke(droolColour[0],droolColour[1],droolColour[2]);
            createRandomCurvedLine(tempXRange[0]+iterator,tempXRange[1]+iterator,canDi*0.73,rndNum(canDi*0.775,canDi*0.9));
            iterator = iterator  + canDi*0.05;
        }
      } else {
        stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
        beginShape();
        curveVertex(mCrds[6]-canDi*0.03,mCrds[7]+canDi*0.03)
        curveVertex(mCrds[6]-canDi*0.03,mCrds[7]+canDi*0.03);
        curveVertex(mCrds[0]+canDi*0.03,mCrds[1]+canDi*0.03);
        curveVertex(mCrds[0]+canDi*0.03,mCrds[1]+canDi*0.03);
        endShape();
      }
      push();
      switch (rotationChoice) {
        case 0:
          break;
        case 1:
          translate(-canDi*0.115,canDi*0.115);
          rotate(PI / rndNum(-17,-20));
          break;
        case 2:
          translate(canDi*0.11,-canDi*0.085);
          rotate(PI / rndNum(20,23));
          break;
      }
      noStroke();
      strokeWeight(lipsStrokeWeight);
      fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      beginShape();
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[2],mCrds[3]);
      curveVertex(mCrds[4],mCrds[5]);
      curveVertex(mCrds[6],mCrds[7]);
      curveVertex(mCrds[8],mCrds[9]);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      endShape();
      drawLollipop(mCrds[8]+canDi*0.005,mCrds[9]-canDi*0.015,specialLolli,0);
      noStroke();
      fill(colPal.teeth[0],colPal.teeth[1],colPal.teeth[2]);
      if (colourChoice === 4) {
        drawTooth(mCrds[2]+canDi*0.01,mCrds[3],0,1);
        specialTrait = "fangs";
      } else {
        drawTooth(mCrds[2]+canDi*0.01,mCrds[3]);
      }
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      strokeWeight(lipsStrokeWeight);
      noFill();
      beginShape();
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[2],mCrds[3]);
      curveVertex(mCrds[4],mCrds[5]);
      curveVertex(mCrds[6],mCrds[7]);
      curveVertex(mCrds[8],mCrds[9]);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      endShape();
      drawCornerWrinkleLines(mCrds[0],mCrds[1]);
      drawCornerWrinkleLines(mCrds[6],mCrds[7],1);
      drawLollipop(mCrds[8]+canDi*0.005,mCrds[9]-canDi*0.015,specialLolli,1);
      pop();
      break;
    case 6:
      //aghast
      if (colourChoice === 10) {
        specialTrait = "zombie drool";
        strokeWeight(lipsStrokeWeight);
        tempXRange = [canDi*0.61,canDi*0.6175];
        iterator = 0;
        for (let step = 0; step < rndArr([0,1,2]); step++) {
          let droolColour = rndArr([[colPal.highlight[0],colPal.highlight[1],colPal.darkaccent[2]],[colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]]])
          stroke(droolColour[0],droolColour[1],droolColour[2]);
          createRandomCurvedLine(tempXRange[0]+iterator,tempXRange[1]+iterator,canDi*0.75,rndNum(canDi*0.82,canDi*0.9));
          iterator = iterator  + canDi*0.05;
        }
      } else {}
      mCrds = [rndNum(canDi*0.525,canDi*0.545),canDi*0.75,canDi*0.6,rndNum(canDi*0.68,canDi*0.7),canDi*0.675,rndNum(canDi*0.665,canDi*0.685),canDi*0.7,canDi*0.72];
      push();
      switch (rotationChoice) {
        case 0:
          break;
        case 1:
          translate(-canDi*0.115,canDi*0.135);
          rotate(PI / rndNum(-17,-20));
          break;
        case 2:
          translate(canDi*0.11,-canDi*0.065);
          rotate(PI / rndNum(20,23));
          break;
      }
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      strokeWeight(lipsStrokeWeight+canDi*0.025);
      noFill();
      beginShape();
      curveVertex(mCrds[0]+canDi*0.025,mCrds[1]+canDi*0.015);
      curveVertex(mCrds[0]+canDi*0.025,mCrds[1]+canDi*0.015);
      curveVertex(mCrds[2]+canDi*0.005,mCrds[3]+canDi*0.035);
      curveVertex(mCrds[4]-canDi*0.015,mCrds[5]+canDi*0.025);
      curveVertex(mCrds[6]-canDi*0.025,mCrds[7]+canDi*0.025);
      curveVertex(mCrds[6]-canDi*0.025,mCrds[7]+canDi*0.025);
      endShape();
      drawLollipop(mCrds[6]-canDi*0.025,mCrds[7]+canDi*0.025,specialLolli,0);
      noStroke();
      fill(colPal.teeth[0],colPal.teeth[1],colPal.teeth[2]);
      strokeWeight(lipsStrokeWeight);
      numTeeth = rndArr([0,1]);
      if (colourChoice === 4) {
        drawTooth(mCrds[2],mCrds[3]+canDi*0.01,0,1);
        specialTrait = "fangs";
      } else {
        drawTooth(mCrds[2],mCrds[3]+canDi*0.01);
      }
      switch (numTeeth) {
        case 1:
          drawTooth(mCrds[4]-canDi*0.045,mCrds[5]+canDi*0.015);
          break;
        default:
          drawTooth(mCrds[4]-canDi*0.045,mCrds[5]+canDi*0.015);
          drawTooth(mCrds[4]-canDi*0.015,mCrds[5]+canDi*0.015);
      }
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      strokeWeight(lipsStrokeWeight);
      noFill();
      beginShape();
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[2],mCrds[3]);
      curveVertex(mCrds[4],mCrds[5]);
      curveVertex(mCrds[6],mCrds[7]);
      curveVertex(mCrds[6],mCrds[7]);
      endShape();
      noFill();
      beginShape();
      curveVertex(mCrds[2],mCrds[3]+canDi*0.07);
      curveVertex(mCrds[2],mCrds[3]+canDi*0.07);
      curveVertex(mCrds[2]+canDi*0.04,mCrds[3]+canDi*0.055);
      curveVertex(mCrds[4],mCrds[5]+canDi*0.08);
      curveVertex(mCrds[4],mCrds[5]+canDi*0.08);
      endShape();
      drawCornerWrinkleLines(mCrds[0]+canDi*0.025,mCrds[1]+canDi*0.015);
      drawCornerWrinkleLines(mCrds[6]-canDi*0.025,mCrds[7]+canDi*0.025,1);
      drawLollipop(mCrds[6]-canDi*0.025,mCrds[7]+canDi*0.025,specialLolli,1);
      pop();
      if ([1,2,3,4,5].includes(eyeChoice) && (colourChoice === 15)) {
        switch (specialTraitChance) {
          case 1:
            drawHerbalBreath(mCrds[6],mCrds[7]);
            break;
          default:
        }
      }
      break;
    case 7:
      //WIDE open mouth
      mX = rndNum(canDi*0.71,canDi*0.73);
      mY = rndNum(canDi*0.7,canDi*0.68);
      mCrds = [mX,mY,mX-rndNum(canDi*0.1,canDi*0.15),canDi*0.67,canDi*0.52,canDi*0.7,canDi*0.5,canDi*0.75,canDi*0.52,canDi*0.8,canDi*0.6,canDi*0.83,mX+rndNum(-canDi*0.02,canDi*0.02),canDi*0.82];
      push();
      switch (rotationChoice) {
        case 0:
          break;
        case 1:
          translate(-canDi*0.115,canDi*0.115);
          rotate(PI / rndNum(-17,-20));
          break;
        case 2:
          translate(canDi*0.11,-canDi*0.085);
          rotate(PI / rndNum(20,23));
          break;
      }
      noStroke();
      fill(colPal.base[0],colPal.base[1],colPal.base[2]);
      beginShape();
      curveVertex(mCrds[12]-canDi*0.05,mCrds[7]);
      curveVertex(mCrds[12]-canDi*0.05,mCrds[7]);
      curveVertex(mCrds[12]-canDi*0.025,mCrds[5]);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[2],mCrds[3]);
      curveVertex(mCrds[4],mCrds[5]);
      curveVertex(mCrds[6],mCrds[7]);
      curveVertex(mCrds[8],mCrds[9]);
      curveVertex(mCrds[10],mCrds[11]);
      curveVertex(mCrds[12],mCrds[13]);
      curveVertex(mCrds[12]-canDi*0.025,mCrds[9]);
      curveVertex(mCrds[12]-canDi*0.05,mCrds[7]);
      curveVertex(mCrds[12]-canDi*0.05,mCrds[7]);
      endShape();
      drawLollipop(mCrds[12]-canDi*0.025,mCrds[9],specialLolli,0);
      noStroke();
      fill(colPal.teeth[0],colPal.teeth[1],colPal.teeth[2]);
      strokeWeight(lipsStrokeWeight*0.25);
      numTeeth = rndArr([0,1,2]);
      if (colourChoice === 4) {
        drawTooth(mCrds[0]-canDi*0.05,mCrds[1],0,1);
        drawTooth(mCrds[2]-canDi*0.025,mCrds[3]+canDi*0.01,0,1);
        specialTrait = "fangs";
      } else {
        drawTooth(mCrds[0]-canDi*0.05,mCrds[1]);
        drawTooth(mCrds[2]-canDi*0.025,mCrds[3]+canDi*0.01);
      }
      switch (numTeeth) {
        case 1:
          drawTooth(mCrds[2]+canDi*0.025,mCrds[3]+canDi*0.01);
          drawTooth(mCrds[12]-canDi*0.05,mCrds[13]-canDi*0.01,1);
          drawTooth(mCrds[10]-canDi*0.025,mCrds[11]-canDi*0.01,1);
          break;
        case 2:
          drawTooth(mCrds[2]+canDi*0.025,mCrds[3]+canDi*0.01);
          drawTooth(mCrds[12]-canDi*0.05,mCrds[13]-canDi*0.01,1);
          drawTooth(mCrds[10]-canDi*0.025,mCrds[11]-canDi*0.01,1);
          break;
        default:
          drawTooth(mCrds[2]+canDi*0.025,mCrds[3]+canDi*0.011);
          drawTooth(mCrds[2],mCrds[3]+canDi*0.01);
          drawTooth(mCrds[12]-canDi*0.05,mCrds[13]-canDi*0.01,1);
          drawTooth(mCrds[10]+canDi*0.025,mCrds[11]-canDi*0.011,1);
          drawTooth(mCrds[10]-canDi*0.025,mCrds[11]-canDi*0.01,1);
      }
      if (colourChoice === 12) {
        switch (makeClown) {
          case 1:
            stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
            break;
          default:
          stroke(colPal.outline[0],colPal.outline[1],colPal.mask[2]);
        }
      } else {
        stroke(colPal.outline[0],colPal.outline[1],colPal.mask[2]);
      }
      strokeWeight(lipsStrokeWeight);
      noFill();
      beginShape();
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[2],mCrds[3]);
      curveVertex(mCrds[4],mCrds[5]);
      curveVertex(mCrds[6],mCrds[7]);
      curveVertex(mCrds[8],mCrds[9]);
      curveVertex(mCrds[10],mCrds[11]);
      curveVertex(mCrds[12],mCrds[13]);
      curveVertex(mCrds[12],mCrds[13]);
      endShape();
      drawCornerWrinkleLines(mCrds[8],mCrds[9]);
      drawLollipop(mCrds[12]-canDi*0.025,mCrds[9],specialLolli,1);
      pop();
      if (colourChoice === 10) {
        specialTrait = "zombie drool";
        strokeWeight(lipsStrokeWeight);
        tempXRange = [canDi*0.58,canDi*0.585];
        iterator = 0;
        for (let step = 0; step < rndArr([0,1,2,3]); step++) {
          let droolColour = rndArr([[colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]],[colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]]])
          stroke(droolColour[0],droolColour[1],droolColour[2]);
          createRandomCurvedLine(tempXRange[0]+iterator,tempXRange[1]+iterator,canDi*0.83,rndNum(canDi*0.87,canDi*0.95));
          iterator = iterator  + canDi*0.025;
        }
      } else if ([1,2,3,4,5].includes(eyeChoice) && (colourChoice === 15)) {
        switch (specialTraitChance) {
          case 1:
            drawHerbalBreath(mCrds[6]+canDi*0.23,mCrds[7]+canDi*0.03);
            break;
          default:
        }
      } else {}
      break;
    case 8:
      //aghast
      mX = rndNum(canDi*0.71,canDi*0.73);
      mY = rndNum(canDi*0.7,canDi*0.68);
      mCrds = [mX,mY,mX-rndNum(canDi*0.1,canDi*0.15),canDi*0.67,canDi*0.52,canDi*0.7,canDi*0.5,canDi*0.75,canDi*0.52,canDi*0.8,canDi*0.6,canDi*0.83,mX+rndNum(-canDi*0.008,canDi*0.008),canDi*0.82];
      push();
      switch (rotationChoice) {
        case 0:
          drawCornerWrinkleLines(mCrds[8],mCrds[9]);
          break;
        case 1:
          translate(-canDi*0.115,canDi*0.115);
          rotate(PI / rndNum(-17,-20));
          stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
          break;
        case 2:
          translate(canDi*0.11,-canDi*0.085);
          rotate(PI / rndNum(20,23));
          drawCornerWrinkleLines(mCrds[8],mCrds[9]);
          break;
      }
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      strokeWeight(0);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      beginShape();
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[2],mCrds[3]);
      curveVertex(mCrds[4],mCrds[5]);
      curveVertex(mCrds[6],mCrds[7]);
      curveVertex(mCrds[8],mCrds[9]);
      curveVertex(mCrds[10],mCrds[11]);
      curveVertex(mCrds[12],mCrds[13]);
      curveVertex(mCrds[6]+canDi*0.2,mCrds[7]+canDi*0.03);
      curveVertex(mCrds[4]+canDi*0.19,mCrds[5]+canDi*0.03);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      endShape();
      drawLollipop(mCrds[6]+canDi*0.19,mCrds[7]+canDi*0.03,specialLolli,0);
      noStroke();
      fill(colPal.teeth[0],colPal.teeth[1],colPal.teeth[2]);
      strokeWeight(lipsStrokeWeight);
      numTeeth = rndArr([0,1,2]);
      if (colourChoice === 4) {
        drawTooth(mCrds[0]-canDi*0.045,mCrds[1]+canDi*0.005,0,1);
        drawTooth(mCrds[2]-canDi*0.035,mCrds[3]+canDi*0.01,0,1);
        specialTrait = "fangs";
      } else {
        drawTooth(mCrds[0]-canDi*0.045,mCrds[1]+canDi*0.005);
        drawTooth(mCrds[2]-canDi*0.035,mCrds[3]+canDi*0.01);
      }
      switch (numTeeth) {
        case 1:
          drawTooth(mCrds[2]+canDi*0.045,mCrds[3]+canDi*0.01);
          //bottom
          drawTooth(mCrds[12]-canDi*0.05,mCrds[13],1);
          drawTooth(mCrds[10]+canDi*0.005,mCrds[11]-canDi*0.01,1);
          drawTooth(mCrds[10]-canDi*0.025,mCrds[11]-canDi*0.01,1);
          break;
        case 2:
          drawTooth(mCrds[2]+canDi*0.045,mCrds[3]+canDi*0.01);
          drawTooth(mCrds[2]+canDi*0.015,mCrds[3]+canDi*0.01);
          //bottom
          drawTooth(mCrds[12]-canDi*0.05,mCrds[13],1);
          drawTooth(mCrds[10]+canDi*0.005,mCrds[11]-canDi*0.01,1);
          drawTooth(mCrds[10]+canDi*0.045,mCrds[11]-canDi*0.005,1);
          break;
        default:
          drawTooth(mCrds[2]+canDi*0.045,mCrds[3]+canDi*0.01);
          drawTooth(mCrds[2]+canDi*0.015,mCrds[3]+canDi*0.01);
          //bottom
          drawTooth(mCrds[12]-canDi*0.05,mCrds[13],1);
          drawTooth(mCrds[10]+canDi*0.005,mCrds[11]-canDi*0.01,1);
          drawTooth(mCrds[10]-canDi*0.025,mCrds[11]-canDi*0.01,1);
          drawTooth(mCrds[10]+canDi*0.045,mCrds[11]-canDi*0.005,1);
      }
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      strokeWeight(lipsStrokeWeight);
      noFill();
      beginShape();
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[2],mCrds[3]);
      curveVertex(mCrds[4],mCrds[5]);
      curveVertex(mCrds[6],mCrds[7]);
      curveVertex(mCrds[8],mCrds[9]);
      curveVertex(mCrds[10],mCrds[11]);
      curveVertex(mCrds[12],mCrds[13]);
      curveVertex(mCrds[6]+canDi*0.2,mCrds[7]+canDi*0.03);
      curveVertex(mCrds[4]+canDi*0.19,mCrds[5]+canDi*0.03);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      endShape();
      drawLollipop(mCrds[6]+canDi*0.19,mCrds[7]+canDi*0.03,specialLolli,1);
      pop();
      if (colourChoice === 10) {
        specialTrait = "zombie drool";
        strokeWeight(lipsStrokeWeight);
        tempXRange = [canDi*0.58,canDi*0.585];
        iterator = 0;
        for (let step = 0; step < rndArr([0,1,2,3]); step++) {
          let droolColour = rndArr([[colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]],[colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]]])
          stroke(droolColour[0],droolColour[1],droolColour[2]);
          createRandomCurvedLine(tempXRange[0]+iterator,tempXRange[1]+iterator,canDi*0.81,rndNum(canDi*0.85,canDi*0.95));
          iterator = iterator  + canDi*0.025;
        }
      } else {}
      break;
    case 9:
      //nauseous
      mX = rndNum(canDi*0.67,canDi*0.69);
      mY = rndNum(canDi*0.7,canDi*0.68);
      mCrds = [mX,mY,
        mX-rndNum(canDi*0.1,canDi*0.15),canDi*0.69,
        canDi*0.5,canDi*0.71,
        canDi*0.48,canDi*0.75,
        canDi*0.5,canDi*0.8,
        canDi*0.6,canDi*0.78,
        mX+rndNum(-canDi*0.008,canDi*0.008),canDi*0.82];
      push();
      switch (rotationChoice) {
        case 0:
          break;
        case 1:
          translate(-canDi*0.1,canDi*0.1);
          rotate(PI / rndNum(-17,-20));
          break;
        case 2:
        translate(canDi*0.13,-canDi*0.1);
        rotate(PI / rndNum(20,23));
          break;
      }
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      strokeWeight(0);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      beginShape();
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[2],mCrds[3]);
      curveVertex(mCrds[4],mCrds[5]);
      curveVertex(mCrds[6],mCrds[7]);
      curveVertex(mCrds[8],mCrds[9]);
      curveVertex(mCrds[10],mCrds[11]);
      curveVertex(mCrds[12],mCrds[13]);
      curveVertex(mCrds[6]+canDi*0.23,mCrds[7]+canDi*0.03);
      curveVertex(mCrds[4]+canDi*0.2,mCrds[5]);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      endShape();
      drawLollipop(mCrds[12],mCrds[13]-canDi*0.025,specialLolli,0);
      noStroke();
      fill(colPal.teeth[0],colPal.teeth[1],colPal.teeth[2]);
      strokeWeight(lipsStrokeWeight-canDi*0.005);
      numTeeth = rndArr([0,1,2]);
      if (colourChoice === 6) {
        switch (rndNum(0,3)) {
          case 1:
            fngS = [0,1];
            specialTrait = 'predator';
            break;
          default:
            fngS = [0,0];
        }
      } else {
        fngS = [0,0];
      }
      if (colourChoice == 4) {
        drawTooth(mCrds[0]-canDi*0.03,mCrds[1],0,1);
        drawTooth(mCrds[2],mCrds[3],0,1);
        specialTrait = 'fangs';
      } else {
        drawTooth(mCrds[0]-canDi*0.03,mCrds[1],fngS[0],fngS[1]);
        drawTooth(mCrds[2],mCrds[3],fngS[0],fngS[1]);
      }
      switch (numTeeth) {
        case 1:
          drawTooth(mCrds[2]-canDi*0.03,mCrds[3]+canDi*0.01,fngS[0],fngS[1]);
          drawTooth(mCrds[2]+canDi*0.03,mCrds[3],fngS[0],fngS[1]);
          drawTooth(mCrds[8]+canDi*0.03,mCrds[9]-canDi*0.015,fngS[0]+1,fngS[1]);
          drawTooth(mCrds[10],mCrds[11],fngS[0]+1,fngS[1]);
          drawTooth(mCrds[12],mCrds[13],fngS[0]+1,fngS[1]);
          break;
        case 2:
          drawTooth(mCrds[0]-canDi*0.06,mCrds[1],fngS[0],fngS[1]);
          drawTooth(mCrds[2]+canDi*0.03,mCrds[3],fngS[0],fngS[1]);
          drawTooth(mCrds[2]-canDi*0.03,mCrds[3]+canDi*0.01,fngS[0],fngS[1]);
          drawTooth(mCrds[8]+canDi*0.03,mCrds[9]-canDi*0.015,fngS[0]+1,fngS[1]);
          drawTooth(mCrds[10],mCrds[11],fngS[0]+1,fngS[1]);
          drawTooth(mCrds[12]-canDi*0.03,mCrds[13]-canDi*0.02,fngS[0]+1,fngS[1]);
          break;
        default:
          drawTooth(mCrds[0]-canDi*0.06,mCrds[1],fngS[0],fngS[1]);
          drawTooth(mCrds[2]+canDi*0.03,mCrds[3],fngS[0],fngS[1]);
          drawTooth(mCrds[2]-canDi*0.03,mCrds[3]+canDi*0.01,fngS[0],fngS[1]);
          drawTooth(mCrds[8]+canDi*0.03,mCrds[9]-canDi*0.015,fngS[0]+1,fngS[1]);
          drawTooth(mCrds[10]-canDi*0.03,mCrds[11],fngS[0]+1,fngS[1]);
          drawTooth(mCrds[10],mCrds[11],fngS[0]+1,fngS[1]);
          drawTooth(mCrds[12],mCrds[13],fngS[0]+1,fngS[1]);
          drawTooth(mCrds[12]-canDi*0.03,mCrds[13]-canDi*0.02,fngS[0]+1,fngS[1]);
      }
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      strokeWeight(lipsStrokeWeight);
      noFill();
      beginShape();
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[2],mCrds[3]);
      curveVertex(mCrds[4],mCrds[5]);
      curveVertex(mCrds[6],mCrds[7]);
      curveVertex(mCrds[8],mCrds[9]);
      curveVertex(mCrds[10],mCrds[11]);
      curveVertex(mCrds[12],mCrds[13]);
      curveVertex(mCrds[6]+canDi*0.23,mCrds[7]+canDi*0.03);
      curveVertex(mCrds[4]+canDi*0.2,mCrds[5]);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      endShape();
      if (colourChoice === 10) {
        specialTrait = "zombie drool";
        strokeWeight(lipsStrokeWeight);
        tempXRange = [mCrds[10],mCrds[10]+canDi*0.005];
        iterator = 0;
        for (let step = 0; step < rndArr([1,2]); step++) {
          let droolColour = rndArr([[colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]],[colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]]])
          stroke(droolColour[0],droolColour[1],droolColour[2]);
          createRandomCurvedLine(tempXRange[0]+iterator,tempXRange[1]+iterator,mCrds[11],rndNum(canDi*0.81,canDi*0.95));
          iterator = iterator  + canDi*0.025;
        }
      } else {}
      drawCornerWrinkleLines(mCrds[8],mCrds[9]);
      drawLollipop(mCrds[12],mCrds[13]-canDi*0.025,specialLolli,1);
      pop();
      if ([1,2,3,4,5].includes(eyeChoice) && (colourChoice === 15)) {
        switch (specialTraitChance) {
          case 1:
            drawHerbalBreath(mCrds[6]+canDi*0.23,mCrds[7]+canDi*0.03);
            break;
          default:
        }
      }
      break;
    case 10:
      //skeleton jaw 1
      mX = rndNum(canDi*0.69,canDi*0.7);
      mY = rndNum(canDi*0.7,canDi*0.68);
      mCrds = [mX,mY,mX-rndNum(canDi*0.1,canDi*0.15),canDi*0.69,canDi*0.5,canDi*0.71,canDi*0.48,canDi*0.75,canDi*0.5,canDi*0.8,canDi*0.6,canDi*0.78,mX+rndNum(-canDi*0.008,canDi*0.008),canDi*0.82];
      //dead space
      stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      strokeWeight(lipsStrokeWeight);
      beginShape();
      curveVertex(canDi*0.534,canDi*0.65);
      curveVertex(canDi*0.534,canDi*0.65);
      curveVertex(canDi*0.548,canDi*0.71);
      curveVertex(canDi*0.69,canDi*0.71);
      curveVertex(canDi*0.7175,canDi*0.67);
      curveVertex(canDi*0.715,canDi*0.655);
      curveVertex(canDi*0.715,canDi*0.76);
      curveVertex(canDi*0.7,canDi*0.82);
      curveVertex(canDi*0.64,canDi*0.83);
      curveVertex(canDi*0.51,canDi*0.785);
      curveVertex(canDi*0.48,canDi*0.636);
      curveVertex(canDi*0.534,canDi*0.65);
      curveVertex(canDi*0.534,canDi*0.65);
      endShape();
      push();
      switch (rotationChoice) {
        case 0:
          translate(canDi*0.1175,-canDi*0.075);
          rotate(PI / rndNum(20,23));
          break;
        case 1:
          translate(canDi*0.11,-canDi*0.075);
          rotate(PI / rndNum(23,25));
          break;
        case 2:
        translate(-canDi*0.075,canDi*0.1);
        rotate(PI / rndNum(-22,-25));
          break;
      }
      //lower jaw
      drawLollipop(mCrds[12],mCrds[13]-canDi*0.075,specialLolli,0);
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      strokeWeight(lipsStrokeWeight/2);
      beginShape();
      curveVertex(canDi*0.5,canDi*0.65);
      curveVertex(canDi*0.5,canDi*0.65);
      curveVertex(canDi*0.525,canDi*0.755);
      curveVertex(canDi*0.7,canDi*0.76);
      curveVertex(canDi*0.71,canDi*0.805);
      curveVertex(canDi*0.67,canDi*0.8275);
      curveVertex(canDi*0.51,canDi*0.825);
      curveVertex(canDi*0.465,canDi*0.77);
      curveVertex(canDi*0.455,canDi*0.65);
      curveVertex(canDi*0.5,canDi*0.65);
      curveVertex(canDi*0.5,canDi*0.65);
      endShape();
      //lower teeth
      //stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      noStroke();
      fill(colPal.teeth[0],colPal.teeth[1],colPal.teeth[2]);
      strokeWeight(lipsStrokeWeight);
      drawTooth(mCrds[10]-canDi*0.03,mCrds[11],1);
      drawTooth(mCrds[10],mCrds[11],1);
      drawTooth(mCrds[12],mCrds[13]-canDi*0.05,1);
      drawTooth(mCrds[12]-canDi*0.03,mCrds[13]-canDi*0.05,1);
      drawLollipop(mCrds[12],mCrds[13]-canDi*0.075,specialLolli,1);
      pop();
      if (colourChoice === 10) {
        specialTrait = "zombie drool";
        strokeWeight(lipsStrokeWeight);
        tempXRange = [canDi*0.58,canDi*0.585];
        iterator = 0;
        for (let step = 0; step < rndArr([0,1,2,3]); step++) {
          let droolColour = rndArr([[colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]],[colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]]]);
          stroke(droolColour[0],droolColour[1],droolColour[2]);
          createRandomCurvedLine(tempXRange[0]+iterator,tempXRange[1]+iterator,canDi*0.77,rndNum(canDi*0.83,canDi*0.95));
          iterator = iterator  + canDi*0.035;
        }
      } else {}
      //teeth
      noStroke();
      fill(colPal.teeth[0],colPal.teeth[1],colPal.teeth[2]);
      strokeWeight(lipsStrokeWeight*0.2);
      // upper teeth
      drawTooth(mCrds[0]-canDi*0.005,mCrds[1]+canDi*0.01);
      if (colourChoice === 4) {
        drawTooth(mCrds[0]-canDi*0.03,mCrds[1],0,1);
        drawTooth(mCrds[2]+canDi*0.03,mCrds[3],0,1);
        specialTrait = "fangs";
      } else {
        drawTooth(mCrds[0]-canDi*0.03,mCrds[1]);
        drawTooth(mCrds[2]+canDi*0.03,mCrds[3]);
      }
      drawTooth(mCrds[0]-canDi*0.06,mCrds[1]);
      drawTooth(mCrds[2],mCrds[3]);
      break;
    case 11:
      //pumpkin mouth
      noStroke();
      fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      strokeWeight(lipsStrokeWeight/2);
      eXP1 = rndNum(canDi*0.45,canDi*0.47);
      eXP2 = rndNum(canDi*0.49,canDi*0.51);
      eYP1 = rndNum(canDi*0.62,canDi*0.65);
      beginShape();
      vertex(eXP1,eYP1);
      vertex(eXP2,canDi*0.67);
      vertex(eXP2+canDi*0.01,rndNum(canDi*0.745,canDi*0.76));
      vertex(eXP2+canDi*0.08,canDi*0.68);
      vertex(canDi*0.63,rndNum(canDi*0.75,canDi*0.76));
      vertex(canDi*0.66,canDi*0.68);
      vertex(canDi*0.69,rndNum(canDi*0.725,canDi*0.74));
      vertex(canDi*0.71,canDi*0.65);
      vertex(canDi*0.71,canDi*0.8);
      vertex(canDi*0.67,rndNum(canDi*0.735,canDi*0.75));
      vertex(canDi*0.63,canDi*0.82);
      vertex(canDi*0.58,rndNum(canDi*0.735,canDi*0.75));
      vertex(canDi*0.52,canDi*0.8);
      vertex(eXP1+canDi*0.02,canDi*0.78);
      vertex(eXP1,canDi*0.74);
      vertex(eXP1,eYP1);
      endShape(CLOSE);
      stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      strokeWeight(lipsStrokeWeight);
      strokeJoin(ROUND);
      beginShape();
      curveVertex(eXP1+canDi*0.055,canDi*0.79);
      curveVertex(eXP1+canDi*0.055,canDi*0.79);
      curveVertex(eXP1,canDi*0.76);
      curveVertex(eXP1-canDi*0.01,canDi*0.68);
      curveVertex(eXP1,eYP1+canDi*0.01);
      curveVertex(eXP1,eYP1+canDi*0.01);
      endShape();
      break;
    case 12:
      //gawking
      mX = rndNum(canDi*0.71,canDi*0.73);
      mY = rndNum(canDi*0.7,canDi*0.68);
      mCrds = [mX,mY,mX-rndNum(canDi*0.1,canDi*0.15),canDi*0.67,canDi*0.52,canDi*0.7,canDi*0.5,canDi*0.75,canDi*0.52,canDi*0.8,canDi*0.6,canDi*0.83,mX+rndNum(-canDi*0.02,canDi*0.02),canDi*0.82];
      if (colourChoice === 6) {
        switch (rndNum(0,3)) {
          case 1:
            fngS = [0,1];
            specialTrait = 'predator';
            break;
          default:
            fngS = [0,0];
        }
      } else {
        fngS = [0,0];
      }
      push();
      switch (rotationChoice) {
        case 0:
          break;
        case 1:
          translate(-canDi*0.12,canDi*0.12);
          rotate(PI / rndNum(-17,-20));
          break;
        case 2:
        translate(canDi*0.11,-canDi*0.09);
        rotate(PI / rndNum(20,23));
          break;
      }
      //BG mouth hole
      fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      noStroke();
      beginShape();
      curveVertex(mCrds[0]-canDi*0.005,mCrds[1]);
      curveVertex(mCrds[0]-canDi*0.005,mCrds[1]);
      curveVertex(mCrds[2],mCrds[3]);
      curveVertex(mCrds[4],mCrds[5]);
      curveVertex(mCrds[6],mCrds[7]);
      curveVertex(mCrds[8],mCrds[9]);
      curveVertex(mCrds[10],mCrds[11]);
      curveVertex(mCrds[12]-canDi*0.01,mCrds[13]);
      curveVertex(mCrds[12]-canDi*0.01,mCrds[13]);
      endShape();
      stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      strokeWeight(lipsStrokeWeight);
      beginShape();
      curveVertex(mCrds[0]-canDi*0.005,mCrds[1]);
      curveVertex(mCrds[0]-canDi*0.005,mCrds[1]);
      curveVertex(mCrds[6]+canDi*0.2,mCrds[7]);
      curveVertex(mCrds[12]-canDi*0.01,mCrds[13]);
      curveVertex(mCrds[12]-canDi*0.01,mCrds[13]);
      endShape();
      drawLollipop(mCrds[12],mCrds[13]-canDi*0.025,specialLolli,0);
      //teeth
      noStroke();
      fill(colPal.teeth[0],colPal.teeth[1],colPal.teeth[2]);
      strokeWeight(lipsStrokeWeight);
      numTeeth = rndArr([0,1,2]);
      if (colourChoice == 4) {
        drawTooth(mCrds[0]-canDi*0.02,mCrds[1],0,1);
        drawTooth(mCrds[2]-canDi*0.025,mCrds[3]+canDi*0.01,0,1);
        specialTrait = 'fangs';
      } else {
        drawTooth(mCrds[0]-canDi*0.02,mCrds[1],fngS[0],fngS[1]);
        drawTooth(mCrds[2]-canDi*0.025,mCrds[3]+canDi*0.01,fngS[0],fngS[1]);
      }
      switch (numTeeth) {
        case 1:
          drawTooth(mCrds[2]+canDi*0.025,mCrds[3]+canDi*0.01,fngS[0],fngS[1]);
          drawTooth(mCrds[12]-canDi*0.05,mCrds[13]-canDi*0.0075,fngS[0]+1,fngS[1]);
          drawTooth(mCrds[10]-canDi*0.025,mCrds[11]-canDi*0.01,fngS[0]+1,fngS[1]);
          break;
        case 2:
          drawTooth(mCrds[0]-canDi*0.05,mCrds[1],fngS[0],fngS[1]);
          drawTooth(mCrds[2]+canDi*0.025,mCrds[3]+canDi*0.01,fngS[0],fngS[1]);
          drawTooth(mCrds[12]-canDi*0.05,mCrds[13]-canDi*0.0075,fngS[0]+1,fngS[1]);
          drawTooth(mCrds[10]-canDi*0.025,mCrds[11]-canDi*0.01,fngS[0]+1,fngS[1]);
          break;
        default:
          drawTooth(mCrds[0]-canDi*0.06,mCrds[1],fngS[0],fngS[1]);
          drawTooth(mCrds[2]+canDi*0.025,mCrds[3]+canDi*0.01,fngS[0],fngS[1]);
          drawTooth(mCrds[12]-canDi*0.05,mCrds[13]-canDi*0.0075,fngS[0]+1,fngS[1]);
          drawTooth(mCrds[10]+canDi*0.025,mCrds[11]-canDi*0.01,fngS[0]+1,fngS[1]);
          drawTooth(mCrds[10]-canDi*0.025,mCrds[11]-canDi*0.01,fngS[0]+1,fngS[1]);
      }

      stroke(colPal.outline[0],colPal.mask[1],colPal.mask[2]);
      strokeWeight(lipsStrokeWeight);
      noFill();
      beginShape();
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[2],mCrds[3]);
      curveVertex(mCrds[4],mCrds[5]);
      curveVertex(mCrds[6],mCrds[7]);
      curveVertex(mCrds[8],mCrds[9]);
      curveVertex(mCrds[10],mCrds[11]);
      curveVertex(mCrds[12],mCrds[13]);
      curveVertex(mCrds[12],mCrds[13]);
      endShape();
      drawCornerWrinkleLines(mCrds[8],mCrds[9]);
      drawLollipop(mCrds[12],mCrds[13]-canDi*0.025,specialLolli,1);
      pop();
      if (colourChoice === 10) {
        specialTrait = "zombie drool";
        strokeWeight(lipsStrokeWeight);
        tempXRange = [canDi*0.58,canDi*0.585];
        iterator = 0;
        for (let step = 0; step < rndArr([0,1,2,3]); step++) {
            let droolColour = rndArr([[colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]],[colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]]]);
            stroke(droolColour[0],droolColour[1],droolColour[2]);
            createRandomCurvedLine(tempXRange[0]+iterator,tempXRange[1]+iterator,canDi*0.83,rndNum(canDi*0.85,canDi*0.95));
            iterator = iterator  + canDi*0.015;
        }
      } else {}
      break;
    case 13:
      //stitched mouth
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      strokeWeight(lipsStrokeWeight*0.75);
      noFill();
      eXP1 = rndNum(canDi*0.68,canDi*0.705);
      eYP1 = rndNum(canDi*0.735,canDi*0.765);
      push();
      switch (rotationChoice) {
        case 0:
          break;
        case 1:
          translate(-canDi*0.12,canDi*0.08);
          rotate(PI / rndNum(-17,-20));
          break;
        case 2:
        translate(canDi*0.185,-canDi*0.15);
        rotate(PI / rndNum(12,15));
          break;
      }
      //horizontal line
      line(canDi*0.52,rndNum(canDi*0.735,canDi*0.765),eXP1,eYP1)
      //vertical lines
      iterator = 0;
      for (let mouthStrokes = 0; mouthStrokes < rndNum(2,5); mouthStrokes++) {
        stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
        strokeWeight(lipsStrokeWeight*0.75);
        let xS1 = rndNum(-canDi*0.015,canDi*0.015);
        let xS2 = rndNum(-canDi*0.015,canDi*0.015);
        line(canDi*0.55+iterator+xS1,rndNum(canDi*0.7,canDi*0.735),canDi*0.55+iterator+xS2,rndNum(canDi*0.775,canDi*0.8));
        stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
        strokeWeight(lipsStrokeWeight*0.45);
        line(canDi*0.55+iterator+xS1+canDi*0.0035,rndNum(canDi*0.7,canDi*0.735),canDi*0.55+iterator+xS2+canDi*0.0045,rndNum(canDi*0.775,canDi*0.8));
        iterator = iterator + canDi*0.045;
      }
      if (colourChoice === 13 && rotationChoice != 1 && eyeChoice != 11) {
        if (rndArr([0,0,1]) === 1) {
          specialTrait = "bubblegum";
          stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
          fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
          strokeWeight(lipsStrokeWeight*0.015);
          circle(eXP1+canDi*0.05,eYP1+canDi*0.025,canDi*0.2);
          stroke(colPal.highlight[0],colPal.highlight[1],80);
          strokeWeight(lipsStrokeWeight*2);
          point(eXP1+canDi*0.075,eYP1-canDi*0.035);
        } else {}
      } else {}
      pop();
      break;
    case 14:
      //WIDE closed mouth
      mX = rndNum(canDi*0.71,canDi*0.73);
      mY = rndNum(canDi*0.7,canDi*0.68);
      mCrds = [mX,mY,mX-rndNum(canDi*0.025,canDi*0.045),canDi*0.68,canDi*0.52,canDi*0.68,canDi*0.5,canDi*0.71,canDi*0.52,canDi*0.7,canDi*0.6,canDi*0.695,mX+rndNum(-canDi*0.02,canDi*0.02),canDi*0.69];
      push();
      switch (rotationChoice) {
        case 0:
          break;
        case 1:
          translate(-canDi*0.1,canDi*0.12);
          rotate(PI / rndNum(-17,-20));
          break;
        case 2:
        translate(canDi*0.165,-canDi*0.1);
        rotate(PI / rndNum(12,15));
          break;
      }
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      strokeWeight(lipsStrokeWeight);
      noFill();
      beginShape();
      curveVertex(mCrds[6],mCrds[7]);
      curveVertex(mCrds[6],mCrds[7]);
      curveVertex(mCrds[8],mCrds[9]);
      curveVertex(mCrds[10],mCrds[11]);
      curveVertex(mCrds[12]-canDi*0.025,mCrds[13]);
      curveVertex(mCrds[12]-canDi*0.025,mCrds[13]);
      endShape();
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      strokeWeight(lipsStrokeWeight);
      beginShape();
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[0],mCrds[1]);
      curveVertex(mCrds[2],mCrds[3]);
      curveVertex(mCrds[4],mCrds[5]);
      curveVertex(mCrds[6],mCrds[7]);
      curveVertex(mCrds[6],mCrds[7]);
      endShape();
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      drawCornerWrinkleLines(mCrds[6],mCrds[7]);
      drawLollipop(mCrds[0]-canDi*0.015,mCrds[1],specialLolli,1);
      pop();
      if (colourChoice === 10) {
        specialTrait = "zombie drool";
        strokeWeight(lipsStrokeWeight);
        tempXRange = [canDi*0.58,canDi*0.585];
        iterator = 0;
        for (let step = 0; step < rndArr([0,1,2]); step++) {
            let droolColour = rndArr([[colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]],[colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]]]);
            stroke(droolColour[0],droolColour[1],droolColour[2]);
            createRandomCurvedLine(tempXRange[0]+iterator,tempXRange[1]+iterator,canDi*0.7,rndNum(canDi*0.775,canDi*0.95));
            iterator = iterator  + canDi*0.015;
        }
      } else {}
      break;
    case 15:
      //dark skeleton jaw
      mX = rndNum(canDi*0.69,canDi*0.7);
      mY = rndNum(canDi*0.7,canDi*0.68);
      mCrds = [mX,mY,mX-rndNum(canDi*0.1,canDi*0.15),canDi*0.69,canDi*0.5,canDi*0.71,canDi*0.48,canDi*0.75,canDi*0.5,canDi*0.8,canDi*0.6,canDi*0.78,mX+rndNum(-canDi*0.008,canDi*0.008),canDi*0.82];
      //dead space
      stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      strokeWeight(lipsStrokeWeight);
      beginShape();
      curveVertex(canDi*0.534,canDi*0.65);
      curveVertex(canDi*0.534,canDi*0.65);
      curveVertex(canDi*0.548,canDi*0.71);
      curveVertex(canDi*0.69,canDi*0.71);
      curveVertex(canDi*0.7175,canDi*0.67);
      curveVertex(canDi*0.715,canDi*0.655);
      curveVertex(canDi*0.715,canDi*0.76);
      curveVertex(canDi*0.685,canDi*0.82);
      curveVertex(canDi*0.51,canDi*0.785);
      curveVertex(canDi*0.48,canDi*0.636);
      curveVertex(canDi*0.534,canDi*0.65);
      curveVertex(canDi*0.534,canDi*0.65);
      endShape();
      noStroke();
      push();
      switch (rotationChoice) {
        case 0:
          translate(canDi*0.1175,-canDi*0.075);
          rotate(PI / rndNum(20,23));
          break;
        case 1:
          translate(canDi*0.11,-canDi*0.075);
          rotate(PI / rndNum(23,25));
          break;
        case 2:
        translate(-canDi*0.075,canDi*0.1);
        rotate(PI / rndNum(-20,-23));
          break;
      }
      //jaw bone
      drawLollipop(canDi*0.6,canDi*0.75,specialLolli,0);
      noStroke();
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      beginShape();
      curveVertex(canDi*0.51,canDi*0.66);
      curveVertex(canDi*0.51,canDi*0.66);
      curveVertex(canDi*0.525,canDi*0.755);
      curveVertex(canDi*0.7,canDi*0.76);
      curveVertex(canDi*0.71,canDi*0.805);
      curveVertex(canDi*0.67,canDi*0.8275);
      curveVertex(canDi*0.525,canDi*0.825);
      curveVertex(canDi*0.46,canDi*0.77);
      curveVertex(canDi*0.45,canDi*0.65);
      curveVertex(canDi*0.51,canDi*0.66);
      curveVertex(canDi*0.51,canDi*0.66);
      endShape();
      //lower teeth
      noStroke();
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      drawTooth(mCrds[10]-canDi*0.03,mCrds[11],1);
      drawTooth(mCrds[10],mCrds[11],1);
      drawTooth(mCrds[12],mCrds[13]-canDi*0.05,1);
      drawTooth(mCrds[12]-canDi*0.03,mCrds[13]-canDi*0.05,1);
      drawLollipop(canDi*0.6,canDi*0.75,specialLolli,1);
      pop();
      fill(colPal.teeth[0],colPal.teeth[1],colPal.teeth[2]);
      // upper teeth
      drawTooth(mCrds[0]-canDi*0.025,mCrds[1]+canDi*0.01);
      if (colourChoice === 4) {
        drawTooth(mCrds[0]-canDi*0.005,mCrds[1],0,1);
        drawTooth(mCrds[2]+canDi*0.03,mCrds[3],0,1);
        specialTrait = "fangs";
      } else {
        drawTooth(mCrds[0]-canDi*0.005,mCrds[1]-canDi*0.005);
        drawTooth(mCrds[2]+canDi*0.03,mCrds[3]);
      }
      drawTooth(mCrds[0]-canDi*0.06,mCrds[1]);
      drawTooth(mCrds[2],mCrds[3]);
      if (colourChoice === 10) {
        specialTrait = "zombie drool";
        strokeWeight(lipsStrokeWeight);
        tempXRange = [canDi*0.53,canDi*0.535];
        iterator = 0;
        for (let step = 0; step < rndArr([0,1,3]); step++) {
            let droolColour = rndArr([[colPal.compliment[0],colPal.compliment[1],colPal.bg[2]],[colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]]]);
            stroke(droolColour[0],droolColour[1],droolColour[2]);
            createRandomCurvedLine(tempXRange[0]+iterator,tempXRange[1]+iterator,canDi*0.74,rndNum(canDi*0.85,canDi*0.95));
            iterator = iterator  + canDi*0.015;
        }
      } else {}
      break;
    case 16:
      //luscious lips
      mX = rndNum(canDi*0.63,canDi*0.65);
      mY = rndNum(canDi*0.7,canDi*0.72);
      push();
      switch (rotationChoice) {
        case 0:
          break;
        case 1:
          translate(canDi*0.17,canDi*0.175);
          scale(0.75)
          break;
        case 2:
          translate(canDi*0.065,canDi*0.075);
          scale(0.9);
          break;
      }
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      strokeWeight(lipsStrokeWeight*2.5);
      noFill();
      beginShape();
      curveVertex(mX-canDi*0.045,mY+canDi*0.01);
      curveVertex(mX-canDi*0.045,mY+canDi*0.01);
      curveVertex(mX+canDi*0.03,mY+canDi*0.01);
      curveVertex(mX+canDi*0.03,mY+canDi*0.01);
      endShape();
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      strokeWeight(lipsStrokeWeight*2.5);
      noFill();
      beginShape();
      curveVertex(mX-canDi*0.045,mY+canDi*0.035);
      curveVertex(mX-canDi*0.045,mY+canDi*0.035);
      curveVertex(mX+canDi*0.03,mY+canDi*0.035);
      curveVertex(mX+canDi*0.03,mY+canDi*0.035);
      endShape();
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]-10);
      strokeWeight(lipsStrokeWeight*2);
      beginShape();
      curveVertex(mX-canDi*0.018,mY-canDi*0.019);
      curveVertex(mX-canDi*0.018,mY-canDi*0.019);
      curveVertex(mX-canDi*0.075,mY+canDi*0.02);
      curveVertex(mX-canDi*0.075,mY+canDi*0.02);
      endShape();
      beginShape();
      curveVertex(mX+canDi*0.018,mY-canDi*0.019);
      curveVertex(mX+canDi*0.018,mY-canDi*0.019);
      curveVertex(mX+canDi*0.05,mY+canDi*0.02);
      curveVertex(mX+canDi*0.05,mY+canDi*0.02);
      endShape();
      strokeWeight(lipsStrokeWeight*2);
      point(mX,mY);
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      strokeWeight(lipsStrokeWeight*0.65);
      beginShape();
      curveVertex(mX-canDi*0.075,mY+canDi*0.03);
      curveVertex(mX-canDi*0.075,mY+canDi*0.03);
      curveVertex(mX-canDi*0.025,mY+canDi*0.0095);
      curveVertex(mX,mY+canDi*0.015);
      curveVertex(mX+canDi*0.025,mY+canDi*0.0095);
      curveVertex(mX+canDi*0.05,mY+canDi*0.03);
      curveVertex(mX+canDi*0.05,mY+canDi*0.03);
      endShape();
      if ([4,10].includes(colourChoice)) {
        strokeWeight(lipsStrokeWeight);
        tempXRange = [canDi*0.57,canDi*0.575];
        iterator = 0;
        for (let step = 0; step < rndArr([0,1]); step++) {
            let droolColour;
            if (colourChoice === 4) {
              droolColour = [colPal.bg[0],colPal.bg[1],colPal.bg[2]];
            } else {
              droolColour = rndArr([[colPal.compliment[0],colPal.compliment[1],colPal.bg[2]],[colPal.compliment[0],colPal.compliment[1],colPal.darkaccent[2]]]);
            }
            stroke(droolColour[0],droolColour[1],droolColour[2]);
            createRandomCurvedLine(tempXRange[0]+iterator,tempXRange[1]+iterator,canDi*0.74,rndNum(canDi*0.85,canDi*0.95));
            iterator = iterator  + canDi*0.015;
            switch (colourChoice) {
              case 4:
                specialTrait = "blood drip";
                break;
              default:
                specialTrait = "zombie drool";
            }
        }
      } else {}
      drawLollipop(mX+canDi*0.05,mY+canDi*0.03,specialLolli,1);
      pop();
      break;
    case 17:
      //oozing mouth
      mX = rndNum(canDi*0.61,canDi*0.63);
      mY = rndNum(canDi*0.68,canDi*0.7);
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      drawCornerWrinkleLines(mX-canDi*0.12,mY+canDi*0.05);
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      //stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      strokeWeight(canDi*0.015);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      beginShape();
      curveVertex(mX-canDi*0.12,mY+canDi*0.05);
      curveVertex(mX-canDi*0.12,mY+canDi*0.05);
      curveVertex(mX-canDi*0.11,mY+canDi*0.015);
      curveVertex(mX-canDi*0.05,mY+canDi*0.0025);
      curveVertex(mX,mY);
      curveVertex(mX+canDi*0.075,mY+canDi*0.005);
      curveVertex(mX+canDi*0.0775,mY+canDi*0.05);
      curveVertex(mX+canDi*0.035,mY+canDi*0.025);
      curveVertex(mX,mY+canDi*0.025);
      curveVertex(mX-canDi*0.04,mY+canDi*0.0325);
      curveVertex(mX-canDi*0.095,mY+canDi*0.065);
      curveVertex(mX-canDi*0.12,mY+canDi*0.05);
      curveVertex(mX-canDi*0.12,mY+canDi*0.05);
      endShape();

      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      iterator = 0;
      for (var i = 0; i < rndNum(2,9); i++) {
        strokeWeight(rndArr([lipsStrokeWeight*0.75,lipsStrokeWeight*0.25,lipsStrokeWeight*0.5]));
        line(mX-canDi*0.1+iterator,mY+canDi*0.025,mX-canDi*0.1+iterator,rndNum(canDi*0.9,canDi));
        iterator = iterator + canDi*0.01;
      }
      iterator = 0;
      for (var i = 0; i < rndNum(2,5); i++) {
        strokeWeight(rndArr([lipsStrokeWeight*0.75,lipsStrokeWeight*0.25,lipsStrokeWeight*0.5]));
        line(mX+canDi*0.05+iterator,mY+canDi*0.025,mX+canDi*0.05+iterator,rndNum(canDi*0.9,canDi));
        iterator = iterator + canDi*0.01;
      }
      if ([1,2,3,4,5].includes(eyeChoice) && (colourChoice === 15)) {
        switch (specialTraitChance) {
          case 1:
            drawHerbalBreath(mX+canDi*0.0775,mY+canDi*0.05);
            break;
          default:
        }
      }
      break;
    case 18:
      //sly mouth
      mX = rndNum(canDi*0.65,canDi*0.68);
      mY = rndNum(canDi*0.75,canDi*0.78);
      mX2 = canDi*0.5;
      mY2 = canDi*0.7;
      snarl = rndNum(0,canDi*0.025);
      mS = rndNum(canDi*0.035,canDi*0.045);//mouth shift
      fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      noStroke();
      beginShape();
      curveVertex(mX,mY-mS);
      curveVertex(mX-((mX-mX2)*0.35),mY-((mY-mY2)*0.1)-mS);
      curveVertex(mX-((mX-mX2)*0.75),mY-((mY-mY2)*0.35)-mS-snarl);
      curveVertex(mX2,mY2-mS-snarl);
      curveVertex(mX2-mS,mY2);
      curveVertex(mX-((mX-mX2)*0.75),mY-((mY-mY2)*0.35)+mS);
      curveVertex(mX-((mX-mX2)*0.35),mY-((mY-mY2)*0.1)+mS);
      curveVertex(mX,mY+mS);
      endShape(CLOSE);
      drawLollipop(mX+canDi*0.05,mY+canDi*0.02,specialLolli,0);
      noStroke();
      fill(colPal.teeth[0],colPal.teeth[1],colPal.teeth[2]);
      //bottom teeth
      drawTooth(mX-((mX-mX2)*0.9),mY-((mY-mY2)*0.5)+mS,1);
      drawTooth(mX-((mX-mX2)*0.8),mY-((mY-mY2)*0.35)+mS,1);
      drawTooth(mX-((mX-mX2)*0.6),mY-((mY-mY2)*0.1)+mS,1);
      drawTooth(mX-((mX-mX2)*0.4),mY-((mY-mY2)*0.1)+mS,1);
      drawTooth(mX-((mX-mX2)*0.2),mY-((mY-mY2)*0.05)+mS,1);
      drawTooth(mX,mY+mS,1);
      drawTooth(mX+((mX-mX2)*0.1),mY-((mY-mY2)*0.15)+mS,1);
      //top teeth
      drawTooth(mX-((mX-mX2)*0.95),mY-((mY-mY2)*0.5)-mS-snarl);
      drawTooth(mX-((mX-mX2)*0.75),mY-((mY-mY2)*0.35)-mS-(snarl/2));
      drawTooth(mX-((mX-mX2)*0.55),mY-((mY-mY2)*0.1)-mS);
      if (colourChoice === 4) {
        drawTooth(mX-((mX-mX2)*0.35),mY-((mY-mY2)*0.1)-mS+canDi*0.005,0,1);
        drawTooth(mX+((mX-mX2)*0.25),mY-((mY-mY2)*0.15)-mS+canDi*0.005,0,1);
        specialTrait = 'fangs';
      } else {
        drawTooth(mX-((mX-mX2)*0.35),mY-((mY-mY2)*0.1)-mS);
        drawTooth(mX+((mX-mX2)*0.25),mY-((mY-mY2)*0.15)-mS);
      }
      drawTooth(mX-((mX-mX2)*0.175),mY-((mY-mY2)*0.05)-mS);
      drawTooth(mX,mY-mS);

      if (colourChoice === 12) {
        switch (makeClown) {
          case 1:
            stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
            break;
          default:
          stroke(colPal.outline[0],colPal.outline[1],colPal.mask[2]);
        }
      } else {
        stroke(colPal.outline[0],colPal.outline[1],colPal.mask[2]);
      }
      strokeWeight(canDi*0.015);
      noFill();
      beginShape();
      curveVertex(mX+((mX-mX2)*0.35),mY-((mY-mY2)*0.15)-mS);
      curveVertex(mX+((mX-mX2)*0.35),mY-((mY-mY2)*0.15)-mS);
      curveVertex(mX,mY-mS);
      curveVertex(mX-((mX-mX2)*0.35),mY-((mY-mY2)*0.1)-mS);
      curveVertex(mX-((mX-mX2)*0.75),mY-((mY-mY2)*0.35)-mS-snarl);
      curveVertex(mX2,mY2-mS-snarl);
      curveVertex(mX2-mS,mY2);
      curveVertex(mX-((mX-mX2)*0.75),mY-((mY-mY2)*0.35)+mS);
      curveVertex(mX-((mX-mX2)*0.35),mY-((mY-mY2)*0.1)+mS);
      curveVertex(mX,mY+mS);
      curveVertex(mX+((mX-mX2)*0.35),mY-((mY-mY2)*0.15)+mS);
      curveVertex(mX+((mX-mX2)*0.35),mY-((mY-mY2)*0.15)+mS);
      endShape();
      drawLollipop(mX+canDi*0.05,mY+canDi*0.02,specialLolli,1);
      break;
    case 19:
      mX = rndNum(canDi*0.65,canDi*0.68);
      mY = rndNum(canDi*0.75,canDi*0.78);
      mX2 = canDi*0.5;
      mY2 = canDi*0.7;
      snarl = rndNum(0,canDi*0.025);
      mS = rndNum(canDi*0.025,canDi*0.035);//mouth shift
      switch (rndArr([0,1])) {
        case 1:
          fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
          noStroke();
          beginShape();
          curveVertex(mX,mY-(mS*2.5));
          curveVertex(mX-((mX-mX2)*0.35),mY-((mY-mY2)*0.1)-(mS*2.5));
          curveVertex(mX-((mX-mX2)*0.75),mY-((mY-mY2)*0.35)-(mS*1.75)-snarl);
          curveVertex(mX2,mY2-mS-snarl);
          curveVertex(mX2-mS,mY2);
          curveVertex(mX-((mX-mX2)*0.75),mY-((mY-mY2)*0.35)+(mS*1.75));
          curveVertex(mX-((mX-mX2)*0.35),mY-((mY-mY2)*0.1)+(mS*2));
          curveVertex(mX,mY+(mS*2));
          endShape(CLOSE);
          break;
        default:
      }
      drawLollipop(mX+canDi*0.05,mY+canDi*0.02,specialLolli,0);
      noStroke();
      fill(colPal.teeth[0],colPal.teeth[1],colPal.teeth[2]);
      noStroke();
      if (colourChoice === 6) {
        switch (rndNum(0,3)) {
          case 1:
            fngS = [0,1];
            specialTrait = 'predator';
            break;
          default:
            fngS = [0,0];
        }
      } else {
        fngS = [0,0];
      }
      //bottom teeth
      drawTooth(mX-((mX-mX2)*0.9),mY-((mY-mY2)*0.5)+mS,fngS[0]+1,fngS[1]);
      drawTooth(mX-((mX-mX2)*0.8),mY-((mY-mY2)*0.35)+(mS*1.25),fngS[0]+1,fngS[1]);
      drawTooth(mX-((mX-mX2)*0.6),mY-((mY-mY2)*0.1)+(mS*1.5),fngS[0]+1,fngS[1]);
      drawTooth(mX-((mX-mX2)*0.4),mY-((mY-mY2)*0.1)+(mS*2),fngS[0]+1,fngS[1]);
      drawTooth(mX-((mX-mX2)*0.2),mY-((mY-mY2)*0.05)+(mS*2),fngS[0]+1,fngS[1]);
      drawTooth(mX,mY+(mS*2),fngS[0]+1,fngS[1]);
      drawTooth(mX+((mX-mX2)*0.1),mY-((mY-mY2)*0.15)+(mS*2),fngS[0]+1,fngS[1]);
      //top teeth
      drawTooth(mX-((mX-mX2)*0.95),mY-((mY-mY2)*0.5)-(mS*1.85)-snarl,fngS[0],fngS[1]);
      drawTooth(mX-((mX-mX2)*0.75),mY-((mY-mY2)*0.35)-(mS*1.85)-(snarl/2),fngS[0],fngS[1]);
      drawTooth(mX-((mX-mX2)*0.55),mY-((mY-mY2)*0.1)-(mS*2.1),fngS[0],fngS[1]);
      if (colourChoice === 4) {
        drawTooth(mX-((mX-mX2)*0.35),mY-((mY-mY2)*0.1)-(mS*2.1),0,1);
        drawTooth(mX+((mX-mX2)*0.25),mY-((mY-mY2)*0.15)-(mS*2.3),0,1);
        specialTrait = 'fangs';
      } else {
        drawTooth(mX-((mX-mX2)*0.35),mY-((mY-mY2)*0.1)-(mS*2.1),fngS[0],fngS[1]);
        drawTooth(mX+((mX-mX2)*0.25),mY-((mY-mY2)*0.15)-(mS*2.3),fngS[0],fngS[1]);
      }
      drawTooth(mX-((mX-mX2)*0.175),mY-((mY-mY2)*0.05)-(mS*2.1),fngS[0],fngS[1]);
      drawTooth(mX,mY-(mS*2.5),fngS[0],fngS[1]);
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      strokeWeight(canDi*0.015);
      noFill();
      beginShape();
      curveVertex(mX+((mX-mX2)*0.35),mY-((mY-mY2)*0.15)-(mS*2.5));
      curveVertex(mX+((mX-mX2)*0.35),mY-((mY-mY2)*0.15)-(mS*2.5));
      curveVertex(mX,mY-(mS*2.5));
      curveVertex(mX-((mX-mX2)*0.35),mY-((mY-mY2)*0.1)-(mS*2.25));
      curveVertex(mX-((mX-mX2)*0.75),mY-((mY-mY2)*0.35)-(mS*2)-snarl);
      curveVertex(mX2,mY2-mS-snarl);
      curveVertex(mX2-mS,mY2);
      curveVertex(mX-((mX-mX2)*0.75),mY-((mY-mY2)*0.35)+(mS*1.5));
      curveVertex(mX-((mX-mX2)*0.35),mY-((mY-mY2)*0.1)+(mS*2));
      curveVertex(mX,mY+(mS*2));
      curveVertex(mX+((mX-mX2)*0.35),mY-((mY-mY2)*0.15)+(mS*2));
      curveVertex(mX+((mX-mX2)*0.35),mY-((mY-mY2)*0.15)+(mS*2));
      endShape();
      drawLollipop(mX+canDi*0.05,mY+canDi*0.02,specialLolli,1);
      break;
  }
  function drawHerbalBreath(x,y) {
    bCol = [colPal.mask[0],colPal.mask[1],colPal.mask[2]];//bubble colour
    let xChange,yChange,strokeSize;
    stroke(bCol[0],bCol[1],bCol[2]);
    noFill();
    /*strokeWeight(rndNum(canDi*0.0015,canDi*0.005));
    beginShape();
    xChange = rndNum(canDi*0.05,canDi*0.075);
    yChange = rndNum(canDi*0.045,canDi*0.065);
    curveVertex(x+xChange,y-yChange);
    curveVertex(x+xChange,y-yChange);
    xChange = rndNum(canDi*0.065,canDi*0.095);
    yChange = rndNum(canDi*0.085,canDi*0.115);
    curveVertex(x+xChange,y-yChange);
    xChange = rndNum(canDi*0.065,canDi*0.095);
    yChange = rndNum(canDi*0.195,canDi*0.235);
    curveVertex(x+xChange,y-yChange);
    xChange = rndNum(canDi*0.1,canDi*0.15);
    yChange = rndNum(canDi*0.385,canDi*0.45);
    curveVertex(x+xChange,y-yChange);
    curveVertex(x+xChange,y-yChange);
    endShape();*/

    strokeSize = rndNum(canDi*0.025,canDi*0.05);

    strokeWeight(strokeSize);
    xChange = rndNum(canDi*0.025,canDi*0.045);
    yChange = rndNum(canDi*0.045,canDi*0.065);
    point(x+xChange,y-yChange);
    stroke(bCol[0],bCol[1],bCol[2]+20);
    strokeWeight(strokeSize/8);
    arc(x+xChange,y-yChange,strokeSize*0.5,strokeSize*0.5,rndArr([PI+QUARTER_PI,QUARTER_PI-HALF_PI]), 0, OPEN);

    stroke(bCol[0],bCol[1],bCol[2]);
    strokeSize = rndNum(canDi*0.025,canDi*0.05);
    strokeWeight(strokeSize);
    xChange = rndNum(canDi*0.065,canDi*0.095);
    yChange = rndNum(canDi*0.085,canDi*0.115);
    point(x+xChange,y-yChange);
    stroke(bCol[0],bCol[1],bCol[2]+20);
    strokeWeight(strokeSize/8);
    arc(x+xChange,y-yChange,strokeSize*0.5,strokeSize*0.5,rndArr([PI+QUARTER_PI,QUARTER_PI-HALF_PI]), 0, OPEN);

    stroke(bCol[0],bCol[1],bCol[2]);
    strokeSize = rndNum(canDi*0.025,canDi*0.05);
    strokeWeight(strokeSize);
    xChange = rndNum(canDi*0.065,canDi*0.095);
    yChange = rndNum(canDi*0.195,canDi*0.235);
    point(x+xChange,y-yChange);
    stroke(bCol[0],bCol[1],bCol[2]+20);
    strokeWeight(strokeSize/8);
    arc(x+xChange,y-yChange,strokeSize*0.5,strokeSize*0.5,rndArr([PI+QUARTER_PI,QUARTER_PI-HALF_PI]), 0, OPEN);

    stroke(bCol[0],bCol[1],bCol[2]);
    strokeSize = rndNum(canDi*0.025,canDi*0.05);
    strokeWeight(strokeSize);
    xChange = rndNum(canDi*0.1,canDi*0.15);
    yChange = rndNum(canDi*0.385,canDi*0.45);
    point(x+xChange,y-yChange);
    stroke(bCol[0],bCol[1],bCol[2]+20);
    strokeWeight(strokeSize/8);
    arc(x+xChange,y-yChange,strokeSize*0.5,strokeSize*0.5,rndArr([PI+QUARTER_PI,QUARTER_PI-HALF_PI]), 0, OPEN);

    specialTrait = 'XXX';
  }
  function drawCornerWrinkleLines(x,y,side=0,flip=0) {
    noFill();
    let lineCount = rndArr([0,1,2]);
    switch (side) {
      case 0:
        sideChoice1 = -1;
        sideChoice2 = 1;
        break;
      case 1:
        sideChoice1 = 1;
        sideChoice2 = -1;
        break;
    }
    switch (flip) {
      case 0:
        flipChoice = 1;
        break;
      case 1:
        flipChoice = -1;
        break;
    }
    switch (lineCount) {
      case 0:
        break;
      case 1:
        strokeWeight(canDi*0.0075);
        beginShape();
        curveVertex(x+(canDi*0.025*sideChoice1),y);
        curveVertex(x+(canDi*0.025*sideChoice1),y);
        curveVertex(x+(canDi*0.01*sideChoice1),y+(canDi*0.025*flipChoice));
        curveVertex(x+(canDi*0.025*sideChoice2),y+(canDi*0.025*flipChoice));
        curveVertex(x+(canDi*0.025*sideChoice2),y+(canDi*0.025*flipChoice));
        endShape();
        break;
      case 2:
        strokeWeight(canDi*0.0075);
        beginShape();
        curveVertex(x+(canDi*0.025*sideChoice1),y);
        curveVertex(x+(canDi*0.025*sideChoice1),y);
        curveVertex(x+(canDi*0.01*sideChoice1),y+(canDi*0.025*flipChoice));
        curveVertex(x+(canDi*0.025*sideChoice2),y+(canDi*0.025*flipChoice));
        curveVertex(x+(canDi*0.025*sideChoice2),y+(canDi*0.025*flipChoice));
        endShape();
        beginShape();
        curveVertex(x+(canDi*0.045*sideChoice1),y);
        curveVertex(x+(canDi*0.045*sideChoice1),y);
        curveVertex(x+(canDi*0.025*sideChoice1),y+(canDi*0.045*flipChoice));
        curveVertex(x+(canDi*0.012*sideChoice1),y+(canDi*0.055*flipChoice));
        curveVertex(x+(canDi*0.012*sideChoice1),y+(canDi*0.055*flipChoice));
        endShape();
        break;
    }
  }
  let mouthDescription = {0:'no mouth',1:'smirk',2:'slight smile',3:'sneer',4:'coy',5:'confused',6:'doing math',7:'shock',8:'aghast',9:'nauseous',10:'mony boney',11:'pumpkin',12:'gawking',13:'stitched',14:'gulping',15:'creeper',16:'luscious',17:'leaking',18:'sly',19:'wide'};
  return mouthDescription[mouthChoice];
}
function setEar(earChoice,colPal,headBaseColour,canDi) {
  let eXP1 = canDi*0.375;
  let eYP1 = canDi*0.55;
  let earStrokeWeight = canDi*0.0085;
  let rotationChoice = rndArr([0,1,2]);
  let earCoords = [canDi*0.43,canDi*0.55,canDi*0.41,canDi*0.498,canDi*0.36,canDi*0.475,canDi*0.31,canDi*0.495,canDi*0.3,canDi*0.55,canDi*0.335,canDi*0.65,canDi*0.39,canDi*0.665,canDi*0.415,canDi*0.63]
  switch (earChoice) {
    case 0:
      //earCheekBone(colPal.base);
      strokeWeight(earStrokeWeight);
      stroke(colPal.base[0],colPal.base[1],colPal.base[2]);
      makeCheeckboneBase();
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      newStrokeColour = baseColourChange(headBaseColour);
      push();
      switch (rotationChoice) {
        case 0:
          break;
        case 1:
          translate(-canDi*0.075,canDi*0.06);
          rotate(PI / rndNum(-20,-23));
          break;
        case 2:
          translate(canDi*0.085,-canDi*0.045);
          rotate(PI / rndNum(20,23));
          break;
      }
      drawEar(0,colPal.compliment,newStrokeColour);
      pop();
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      strokeWeight(earStrokeWeight);
      noFill();
      drawEarChinLine();
      break;
    case 1:
      stroke(colPal.base[0],colPal.base[1],colPal.base[2]);
      makeCheeckboneBase();
      earCheekBone(colPal.base);
      strokeWeight(earStrokeWeight*3);
      point(earCoords[2],earCoords[3]+canDi*0.015);
      point(earCoords[12],earCoords[13]-canDi*0.015);
      strokeWeight(earStrokeWeight);
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      newStrokeColour = baseColourChange(headBaseColour);
      push();
      switch (rotationChoice) {
        case 0:
          break;
        case 1:
          translate(-canDi*0.075,canDi*0.06);
          rotate(PI / rndNum(-20,-23));
          break;
        case 2:
          translate(canDi*0.085,-canDi*0.045);
          rotate(PI / rndNum(20,23));
          break;
      }
      drawEar(1,colPal.outline,newStrokeColour);
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      noFill();
      drawEarChinLine();
      pop();
      break;
    case 2:
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      makeCheeckboneBase();
      earCheekBone(colPal.compliment);
      strokeWeight(earStrokeWeight);
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      push();
      switch (rotationChoice) {
        case 0:
          break;
        case 1:
          translate(-canDi*0.075,canDi*0.06);
          rotate(PI / rndNum(-20,-23));
          break;
        case 2:
          translate(canDi*0.085,-canDi*0.045);
          rotate(PI / rndNum(20,23));
          break;
      }
      drawEar(0,colPal.outline,colPal.compliment);
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      noFill();
      drawEarChinLine();
      pop();
      break;
    case 3:
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      makeCheeckboneBase();
      earCheekBone(colPal.compliment);
      strokeWeight(earStrokeWeight*3);
      point(earCoords[2],earCoords[3]+canDi*0.015);
      point(earCoords[12],earCoords[13]-canDi*0.015);
      strokeWeight(earStrokeWeight);
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      push();
      switch (rotationChoice) {
        case 0:
          break;
        case 1:
          translate(-canDi*0.075,canDi*0.06);
          rotate(PI / rndNum(-20,-23));
          break;
        case 2:
          translate(canDi*0.085,-canDi*0.045);
          rotate(PI / rndNum(20,23));
          break;
      }
      drawEar(1,colPal.outline,colPal.compliment);
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      noFill();
      drawEarChinLine();
      pop();
      break;
    case 4:
      stroke(colPal.base[0],colPal.base[1],colPal.base[2]);
      makeCheeckboneBase();
      earCheekBone(colPal.base);
      strokeWeight(earStrokeWeight);
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      newStrokeColour = baseColourChange(headBaseColour);
      push();
      switch (rotationChoice) {
        case 0:
          break;
        case 1:
          translate(-canDi*0.075,canDi*0.06);
          rotate(PI / rndNum(-20,-23));
          break;
        case 2:
          translate(canDi*0.085,-canDi*0.045);
          rotate(PI / rndNum(20,23));
          break;
      }
      drawEar(0,colPal.compliment,newStrokeColour);
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      beginShape();
      curveVertex(canDi*0.325,canDi*0.52);
      curveVertex(canDi*0.325,canDi*0.52);
      curveVertex(canDi*0.345,canDi*0.5);
      curveVertex(canDi*0.39,canDi*0.515);
      curveVertex(canDi*0.41,canDi*0.575);
      curveVertex(canDi*0.41,canDi*0.575);
      endShape();
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      beginShape();
      curveVertex(canDi*0.425,canDi*0.6);
      curveVertex(canDi*0.425,canDi*0.6);
      curveVertex(canDi*0.45,canDi*0.6);
      curveVertex(canDi*0.48,canDi*0.65);
      curveVertex(canDi*0.535,canDi*0.685);
      curveVertex(canDi*0.535,canDi*0.685);
      endShape();
      beginShape();
      curveVertex(canDi*0.335,canDi*0.6);
      curveVertex(canDi*0.335,canDi*0.6);
      curveVertex(canDi*0.365,canDi*0.645);
      curveVertex(canDi*0.395,canDi*0.62);
      curveVertex(canDi*0.395,canDi*0.62);
      endShape();
      pop();
      break;
  }
  function drawEar(style=0,col1=[0,0,0],col2=[0,0,100]) {
    strokeWeight(earStrokeWeight);
    switch (style) {
      case 1:
        createEarNoise(style,col2);
        stroke(col1[0],col1[1],col1[2]);
        beginShape();
        curveVertex(earCoords[2],earCoords[3]);
        curveVertex(earCoords[2],earCoords[3]);
        curveVertex(earCoords[4],earCoords[5]);
        curveVertex(earCoords[6],earCoords[7]);
        curveVertex(earCoords[8],earCoords[9]);
        curveVertex(earCoords[10],earCoords[11]);
        curveVertex(earCoords[12],earCoords[13]);
        curveVertex(earCoords[12],earCoords[13]);
        endShape();
        break;
      default:
        createEarNoise(style,col2);
        stroke(col1[0],col1[1],col1[2]);
        beginShape();
        curveVertex(earCoords[0],earCoords[1]);
        curveVertex(earCoords[0],earCoords[1]);
        curveVertex(earCoords[2],earCoords[3]);
        curveVertex(earCoords[4],earCoords[5]);
        curveVertex(earCoords[6],earCoords[7]);
        curveVertex(earCoords[8],earCoords[9]);
        curveVertex(earCoords[10],earCoords[11]);
        curveVertex(earCoords[12],earCoords[13]);
        curveVertex(earCoords[14],earCoords[15]);
        curveVertex(earCoords[14],earCoords[15]);
        endShape();
    }
    function createEarNoise(style=0,strokeColour=[0,0,0]) {
      let fiberNum,xRange,yRange;
      switch (style) {
        case 1:
          fiberNum = 300;
          xRange = [canDi*0.375,canDi*0.425];
          yRange = [canDi*0.5,canDi*0.665];
          break;
        default:
          fiberNum = 100;
          xRange = [canDi*0.4,canDi*0.45];
          yRange = [canDi*0.55,canDi*0.635];

      }
      let strokeSize = canDi*0.0085;
      stroke(strokeColour);
      for (let i = 0; i < fiberNum; i++) {
        let x1 = rndNum(xRange[0],xRange[1]);
        let y1 = rndNum(yRange[0],yRange[1]);
        let theta = parseInt(rndNum(0,canDi*oneValue)) * parseInt(canDi*0.0019) * canDi*pieValue;
        let segmentLength = rndArr([canDi*0.0009,canDi*0.0019]) * canDi*0.0048 + canDi*0.0019;
        let x2 = segmentLength + x1;
        let y2 = y1;
        strokeWeight(strokeSize);
        point(x1,y1);
      }
    }
  }
  function earCheekBone(colorArrayChosen) {
    let cheekXStartPoint = rndNum(canDi*0.015,canDi*0.025);
    let cheekYStartPoint = rndNum(canDi*0.045,canDi*0.065);
    let cheekXEndPoint = rndNum(canDi*0.065,canDi*0.075);
    let cheekYEndPoint = rndNum(canDi*0.05,canDi*0.085);
    stroke(colorArrayChosen[0],colorArrayChosen[1],colorArrayChosen[2]);
    noFill();
    strokeWeight(canDi*0.015);
    beginShape();
    curveVertex(earCoords[0]-canDi*0.02,earCoords[1]-canDi*0.02);
    curveVertex(earCoords[0]-canDi*0.02,earCoords[1]-canDi*0.02);
    curveVertex(earCoords[0]+cheekXStartPoint,earCoords[1]+cheekYStartPoint);
    curveVertex(earCoords[0]+cheekXStartPoint,earCoords[1]+cheekYStartPoint);
    endShape();
    beginShape();
    curveVertex(earCoords[0]-canDi*0.02,earCoords[1]-canDi*0.02);
    curveVertex(earCoords[0]-canDi*0.02,earCoords[1]-canDi*0.02);
    curveVertex(earCoords[0]+cheekXStartPoint,earCoords[1]+cheekYStartPoint);
    curveVertex(earCoords[0]+cheekXEndPoint,earCoords[1]+cheekYEndPoint);
    curveVertex(earCoords[0]+cheekXEndPoint,earCoords[1]+cheekYEndPoint);
    endShape();
  }
  function makeCheeckboneBase(){
    strokeWeight(earStrokeWeight);
    let iterator = 0;
    for (var i = 0; i < rndArr([0,3,5]); i++) {
      let rN1 = rndNum(0,canDi*0.035);
      let rN2 = rndNum(canDi*0.01,canDi*0.035);
      noFill();
      beginShape();
      curveVertex(eXP1+canDi*0.025,eYP1-canDi*0.015+iterator);
      curveVertex(eXP1+canDi*0.025,eYP1-canDi*0.015+iterator);
      curveVertex(eXP1+canDi*0.045+rN1,eYP1+iterator+rN1);
      curveVertex(eXP1+canDi*0.075+rN2,eYP1+canDi*0.045+iterator);
      curveVertex(eXP1+canDi*0.075+rN2,eYP1+canDi*0.045+iterator);
      endShape();
      switch (rndArr([0,1])) {
        case 1:
          let rN3 = rndNum(canDi*0.03,canDi*0.05);
          beginShape();
          curveVertex(eXP1+canDi*0.075+rN2+canDi*0.015,eYP1+canDi*0.045+iterator);
          curveVertex(eXP1+canDi*0.075+rN2+canDi*0.015,eYP1+canDi*0.045+iterator);
          curveVertex(eXP1+canDi*0.075+rN2+canDi*0.03,eYP1+canDi*0.045+iterator+rN3);
          curveVertex(eXP1+canDi*0.075+rN2+canDi*0.03,eYP1+canDi*0.045+iterator+rN3);
          endShape();
          break;
        default:
      }
      iterator = iterator + canDi*0.025;
    }
  }
  function drawEarChinLine(){
    beginShape();
    curveVertex(canDi*0.325,canDi*0.52);
    curveVertex(canDi*0.325,canDi*0.52);
    curveVertex(canDi*0.345,canDi*0.5);
    curveVertex(canDi*0.39,canDi*0.515);
    curveVertex(canDi*0.425,canDi*0.6);
    curveVertex(canDi*0.45,rndNum(canDi*0.6,canDi*0.65));
    switch (rndArr([0,1,2])) {
      case 1:
        curveVertex(canDi*0.48,canDi*0.65);
        curveVertex(canDi*0.535,canDi*0.685);
        curveVertex(canDi*0.535,canDi*0.685);
        endShape();
        beginShape();
        curveVertex(canDi*0.435,canDi*0.65);
        curveVertex(canDi*0.435,canDi*0.65);
        curveVertex(canDi*0.48,canDi*0.7);
        curveVertex(canDi*0.505,canDi*0.725);
        curveVertex(canDi*0.505,canDi*0.725);
        break;
      case 2:
        curveVertex(canDi*0.48,canDi*0.65);
        curveVertex(canDi*0.535,canDi*0.685);
        curveVertex(canDi*0.535,canDi*0.685);
        endShape();
        stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
        beginShape();
        curveVertex(canDi*0.335,canDi*0.6);
        curveVertex(canDi*0.335,canDi*0.6);
        curveVertex(canDi*0.365,canDi*0.645);
        curveVertex(canDi*0.4,canDi*0.645);
        curveVertex(canDi*0.4,canDi*0.645);
        endShape();
        stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
        beginShape();
        curveVertex(canDi*0.435,canDi*0.65);
        curveVertex(canDi*0.435,canDi*0.65);
        curveVertex(canDi*0.45,canDi*0.68);
        curveVertex(canDi*0.505,canDi*0.725);
        curveVertex(canDi*0.505,canDi*0.725);
        break;
      default:
        curveVertex(canDi*0.48,canDi*0.65);
        curveVertex(canDi*0.525,canDi*0.675);
        curveVertex(canDi*0.525,canDi*0.675);
    }
    endShape();
  }
  let earringChance = rndNum(0,6);
  if (earringChance === 5) {
    drawRandomEarrings();
  } else {}
}
function setHair(hairChoice,hatChoice,colPal,canDi) {
  let xP1,xP2,xP3,yP1,yP2,yP3,rectWidth,tempXRange,iterator,hairAccents,hCoords;
  let shadeChoice = rndArr([0,10]);
  let shadeChoice2 = rndArr([0,10,20]);
  let logoChoice = rndArr([0,1]);
  let rotationChoice = rndArr([0,1,2]);
  let hairStrokeWeight = canDi*0.01;

  switch (hairChoice) {
    case 0:
      if (colourChoice === 7 && hatChoice === 0 && hairChoice === 0) {
        switch (getBaldHorns) {
          case 1:
            stroke(colPal.base[0],colPal.base[1],colPal.base[2]);
            fill(colPal.base[0],colPal.base[1],colPal.base[2]);
            strokeWeight(canDi*0.015);
            beginShape();
            vertex(canDi*0.275,canDi*0.175);
            vertex(canDi*0.275,canDi*0.175);
            curveVertex(canDi*0.25,canDi*0.3);
            curveVertex(canDi*0.325,canDi*0.39);
            curveVertex(canDi*0.4,canDi*0.4);
            curveVertex(canDi*0.4,canDi*0.3);
            curveVertex(canDi*0.35,canDi*0.3);
            curveVertex(canDi*0.295,canDi*0.265);
            vertex(canDi*0.275,canDi*0.175);
            vertex(canDi*0.275,canDi*0.175);
            endShape();
            specialTrait = 'horns';
            break;
          default:
        }
      } else {}
      break;
    case 1:
      //tight curls ponytail
      stroke(hairColourBase);
      fill(hairColourBase);
      strokeWeight(hairStrokeWeight);
      beginShape();
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.45,canDi*0.45);
      curveVertex(canDi*0.52,canDi*0.35);
      curveVertex(canDi*0.73,canDi*0.35);
      curveVertex(canDi*0.65,canDi*0.25);
      curveVertex(canDi*0.525,canDi*0.22);
      curveVertex(canDi*0.4,canDi*0.25);
      curveVertex(canDi*0.32,canDi*0.32);
      curveVertex(canDi*0.3,canDi*0.45);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      endShape();
      break;
    case 2:
      //tight curls front long
      stroke(hairColourBase);
      fill(hairColourBase);
      strokeWeight(hairStrokeWeight);
      beginShape();
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.45,canDi*0.45);
      curveVertex(canDi*0.52,canDi*0.35);
      curveVertex(canDi*0.73,canDi*0.35);
      curveVertex(canDi*0.65,canDi*0.25);
      curveVertex(canDi*0.525,canDi*0.22);
      curveVertex(canDi*0.4,canDi*0.25);
      curveVertex(canDi*0.32,canDi*0.32);
      curveVertex(canDi*0.3,canDi*0.45);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      endShape();
      xP1 = canDi*0.33;
      yP1 = canDi*0.4;
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.mask[2]);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.mask[2]);
      strokeWeight(rndNum(canDi*0.0125,canDi*0.0175));
      iterator = 0;
      for (var hBS = 0; hBS < 3; hBS++) {
        beginShape();
        curveVertex(xP1+iterator,yP1);
        curveVertex(xP1+iterator,yP1);
        curveVertex(xP1+canDi*0.015+iterator,yP1+rndArr([-canDi*0.0075,canDi*0.0075]));
        curveVertex(xP1+canDi*0.025+iterator,yP1);
        curveVertex(xP1+canDi*0.025+iterator,yP1);
        endShape();
        beginShape();
        curveVertex(xP1+iterator,yP1+canDi*0.045);
        curveVertex(xP1+iterator,yP1+canDi*0.045);
        curveVertex(xP1+canDi*0.015+iterator,yP1+canDi*0.045+rndArr([-canDi*0.0075,canDi*0.0075]));
        curveVertex(xP1+canDi*0.025+iterator,yP1+canDi*0.045);
        curveVertex(xP1+canDi*0.025+iterator,yP1+canDi*0.045);
        endShape();
        iterator = iterator + canDi*0.05;
      }
      break;
    case 3:
      //short combed straight hair
      hCoords = [canDi*0.35,canDi*0.55,canDi*0.45,canDi*0.45,canDi*0.52,canDi*0.35,canDi*0.73,canDi*0.35,canDi*0.65,canDi*0.25,canDi*0.525,canDi*0.22,canDi*0.4,canDi*0.25,canDi*0.33,canDi*0.32,canDi*0.31,canDi*0.45];
      stroke(hairColourBase);
      fill(hairColourBase);
      strokeWeight(hairStrokeWeight);
      beginShape();
      curveVertex(hCoords[0],hCoords[1]);
      curveVertex(hCoords[0],hCoords[1]);
      curveVertex(hCoords[2],hCoords[3]);
      curveVertex(hCoords[4],hCoords[5]);
      curveVertex(hCoords[6],hCoords[7]);
      curveVertex(hCoords[8],hCoords[9]);
      curveVertex(hCoords[10],hCoords[11]);
      curveVertex(hCoords[12],hCoords[13]);
      curveVertex(hCoords[14],hCoords[15]);
      curveVertex(hCoords[16],hCoords[17]);
      curveVertex(hCoords[0],hCoords[1]);
      curveVertex(hCoords[0],hCoords[1]);
      endShape();
      xP1 = rndNum(canDi*0.3,canDi*0.35);
      yP1 = rndNum(canDi*0.2,canDi*0.225);
      if ([1,2,12,13].includes(hatChoice)) {
      } else {
        strokeWeight(hairStrokeWeight*6);
        beginShape();
        curveVertex(canDi*0.375,canDi*0.275);
        curveVertex(canDi*0.375,canDi*0.275);
        curveVertex(rndNum(canDi*0.5,canDi*0.55),canDi*0.21);
        curveVertex(rndNum(canDi*0.66,canDi*0.68),rndNum(canDi*0.195,canDi*0.21));
        curveVertex(rndNum(canDi*0.74,canDi*0.75),rndNum(canDi*0.235,canDi*0.275));
        curveVertex(canDi*0.733,canDi*0.32);
        curveVertex(canDi*0.733,canDi*0.32);
        endShape();
        stroke(colPal.base[0],colPal.base[1],colPal.base[2]);
        noFill();fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.compliment[2]);
        strokeWeight(hairStrokeWeight*1.5);
        beginShape();
        curveVertex(hCoords[4],hCoords[5]);
        curveVertex(hCoords[4],hCoords[5]);
        curveVertex(hCoords[14]+(hCoords[4]-hCoords[14])/2,hCoords[5]-rndNum(canDi*0.025,canDi*0.035));
        curveVertex(hCoords[14]+canDi*0.05,hCoords[15]);
        curveVertex(hCoords[14]+canDi*0.05,hCoords[15]);
        endShape();
        stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.compliment[2]);
        noFill();
        strokeWeight(hairStrokeWeight);
        beginShape();
        curveVertex(canDi*0.4,canDi*0.25);
        curveVertex(canDi*0.4,canDi*0.25);
        curveVertex(rndNum(canDi*0.35,canDi*0.375),canDi*0.225);
        curveVertex(xP1,yP1);
        curveVertex(xP1,yP1);
        endShape();
        xP2 = rndNum(canDi*0.7,canDi*0.75);
        yP2 = rndNum(canDi*0.15,canDi*0.2);
        beginShape();
        curveVertex(canDi*0.6,canDi*0.2);
        curveVertex(canDi*0.6,canDi*0.2);
        curveVertex(rndNum(canDi*0.65,canDi*0.675),canDi*0.15);
        curveVertex(xP2,yP2);
        curveVertex(xP2,yP2);
        endShape();
        stroke(colPal.compliment[0],colPal.compliment[1],colPal.bg[2]);
        noFill();
        xP3 = rndNum(canDi*0.7,canDi*0.756);
        yP3 = rndNum(canDi*0.175,canDi*0.22);
        beginShape();
        curveVertex(canDi*0.495,canDi*0.315);
        curveVertex(canDi*0.495,canDi*0.315);
        curveVertex(rndNum(canDi*0.55,canDi*0.575),canDi*0.245);
        curveVertex(xP3,yP3);
        curveVertex(xP3,yP3);
        endShape();
      }
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.bg[2]);
      strokeWeight(hairStrokeWeight);
      noFill();
      beginShape();
      curveVertex(canDi*0.445,canDi*0.425);
      curveVertex(canDi*0.445,canDi*0.425);
      curveVertex(rndNum(canDi*0.35,canDi*0.375),yP1+canDi*0.25+rndNum(canDi*0.005,canDi*0.0075));
      curveVertex(xP1*0.95,yP1+canDi*0.235);
      curveVertex(xP1*0.95,yP1+canDi*0.235);
      endShape();
      break;
    case 4:
      //afro
      stroke(hairColourBase);
      fill(hairColourBase);
      strokeWeight(hairStrokeWeight);
      beginShape();
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.45,canDi*0.45);
      curveVertex(canDi*0.52,canDi*0.35);
      curveVertex(canDi*0.73,canDi*0.35);
      curveVertex(canDi*0.65,canDi*0.25);
      curveVertex(canDi*0.525,canDi*0.22);
      curveVertex(canDi*0.4,canDi*0.25);
      curveVertex(canDi*0.33,canDi*0.32);
      curveVertex(canDi*0.31,canDi*0.45);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      endShape();
      break;
    case 5:
      //buzzed medium front straight
      stroke(hairColourBase);
      fill(hairColourBase);
      strokeWeight(hairStrokeWeight);
      beginShape();
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.45,canDi*0.45);
      curveVertex(canDi*0.52,canDi*0.35);
      curveVertex(canDi*0.73,canDi*0.35);
      curveVertex(canDi*0.65,canDi*0.25);
      curveVertex(canDi*0.525,canDi*0.22);
      curveVertex(canDi*0.4,canDi*0.25);
      curveVertex(canDi*0.33,canDi*0.32);
      curveVertex(canDi*0.31,canDi*0.45);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      endShape();
      stroke(hairColourBase);
      if ([1,2,12,13].includes(hatChoice)) {
      } else {
        stroke(hairColourBase);
        noFill();
        strokeWeight(hairStrokeWeight);
        iterator = 0;
        for (let hairStrokes = 0; hairStrokes < 6; hairStrokes++) {
          createStraightHair(canDi*0.75+iterator,rndNum(canDi*0.4,canDi*0.43),1);
          iterator = iterator + canDi*0.0045;
        }
        iterator = 0;
        for (let hairStrokes = 0; hairStrokes < 12; hairStrokes++) {
          createStraightHair(canDi*0.67+iterator,rndNum(canDi*0.3,canDi*0.32),0);
          iterator = iterator + canDi*0.0075;
        }
        stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.mask[2]);
        noFill();
        strokeWeight(hairStrokeWeight);
        iterator = 0;
        for (let hairStrokes = 0; hairStrokes < 4; hairStrokes++) {
          createStraightHair(canDi*0.675+iterator,rndNum(canDi*0.275,canDi*0.325),0);
          iterator = iterator + canDi*0.01;
        }
        stroke(hairColourBase);
        noFill();
        strokeWeight(hairStrokeWeight);
        iterator = 0;
        for (let hairStrokes = 0; hairStrokes < 2; hairStrokes++) {
          createStraightHair(canDi*0.675+iterator,rndNum(canDi*0.275,canDi*0.325),0);
          iterator = iterator + canDi*0.01;
        }
        iterator = 0;
        for (var i = 0; i < 2; i++) {
          xP1 = rndNum(canDi*0.66,canDi*0.68)+iterator;
          xP2 = xP1+rndNum(canDi*0.125,canDi*0.15);
          xP3 = xP1+rndNum(canDi*0.1,canDi*0.15);
          yP1 = rndNum(canDi*0.262,canDi*0.264)+iterator;
          yP2 = yP1+rndNum(canDi*0.2,canDi*0.25);
          yP3 = yP2+rndNum(canDi*0.3,canDi*0.35);
          beginShape();
          curveVertex(xP1,yP1);
          curveVertex(xP1,yP1);
          curveVertex(xP1+rndNum(canDi*0.1,canDi*0.112),yP1+rndNum(canDi*0.05,canDi*0.075));
          curveVertex(xP2,yP2);
          curveVertex(xP3,yP3);
          curveVertex(xP3,yP3);
          endShape();
          iterator = iterator + canDi*0.025;
        }
      }
      break;
    case 6:
      //long thick dreads
      stroke(hairColourBase);
      fill(hairColourBase);
      strokeWeight(hairStrokeWeight);
      beginShape();
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.45,canDi*0.45);
      curveVertex(canDi*0.52,canDi*0.35);
      curveVertex(canDi*0.73,canDi*0.35);
      curveVertex(canDi*0.65,canDi*0.25);
      curveVertex(canDi*0.525,canDi*0.22);
      curveVertex(canDi*0.4,canDi*0.25);
      curveVertex(canDi*0.33,canDi*0.32);
      curveVertex(canDi*0.31,canDi*0.45);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      endShape();
      createShagDreadsHair([canDi*0.35,canDi*0.65],[canDi*0.225,canDi*0.35],25,1);
      if ([1,2,12,13].includes(hatChoice)) {

      } else {
        noFill();
        iterator = 0;
        for (let hairStrokes = 0; hairStrokes < 6; hairStrokes++) {
          stroke(hairColourBase);
          strokeWeight(hairStrokeWeight*4);
          createStraightHair(canDi*0.75+iterator,rndNum(canDi*0.4,canDi*0.43),1);
          iterator = iterator + canDi*0.0045;
        }
        iterator = 0;
        for (let hairStrokes = 0; hairStrokes < 12; hairStrokes++) {
          stroke(hairColourBase);
          strokeWeight(hairStrokeWeight*4);
          createStraightHair(canDi*0.67+iterator,rndNum(canDi*0.3,canDi*0.32),0);
          iterator = iterator + canDi*0.0075;
        }
        iterator = 0;
        for (let hairStrokes = 0; hairStrokes < 4; hairStrokes++) {
          stroke(hairColourBase);
          strokeWeight(hairStrokeWeight*4);
          createStraightHair(canDi*0.675+iterator,rndNum(canDi*0.275,canDi*0.325),0);
          iterator = iterator + canDi*0.01;
        }
        iterator = 0;
        for (let hairStrokes = 0; hairStrokes < 2; hairStrokes++) {
          stroke(hairColourBase);
          strokeWeight(hairStrokeWeight*4);
          createStraightHair(canDi*0.675+iterator,rndNum(canDi*0.275,canDi*0.325),0);
          iterator = iterator + canDi*0.01;
        }
        iterator = 0;
        for (var i = 0; i < 2; i++) {
          xP1 = rndNum(canDi*0.66,canDi*0.68)+iterator;
          xP2 = xP1+rndNum(canDi*0.125,canDi*0.15);
          xP3 = xP1+rndNum(canDi*0.1,canDi*0.15);
          yP1 = rndNum(canDi*0.262,canDi*0.264)+iterator;
          yP2 = yP1+rndNum(canDi*0.2,canDi*0.25);
          yP3 = yP2+rndNum(canDi*0.3,canDi*0.35);
          stroke(hairColourBase);
          strokeWeight(hairStrokeWeight*4);
          beginShape();
          curveVertex(xP1,yP1);
          curveVertex(xP1,yP1);
          curveVertex(xP1+rndNum(canDi*0.1,canDi*0.112),yP1+rndNum(canDi*0.05,canDi*0.075));
          curveVertex(xP2,yP2);
          curveVertex(xP3,yP3);
          curveVertex(xP3,yP3);
          endShape();
          stroke(colPal.compliment[0],colPal.mask[1],colPal.mask[2]);
          strokeWeight(hairStrokeWeight);
          beginShape();
          curveVertex(xP1,yP1);
          curveVertex(xP1,yP1);
          curveVertex(xP2,yP2);
          curveVertex(xP3+rndNum(-canDi*0.075,canDi*0.075),yP3-rndNum(canDi*0.175,canDi*0.25));
          curveVertex(xP3,yP3);
          curveVertex(xP3,yP3);
          endShape();
          iterator = iterator + canDi*0.025;
        }
        iterator = 0;
        for (var i = 0; i < 2; i++) {
          let xP2,xP3,yP2,yP3;
          let xP1 = rndNum(canDi*0.35,canDi*0.375)+iterator;
          let yP1 = rndNum(canDi*0.35,canDi*0.365)+iterator;
          xP2 = xP1-rndNum(canDi*0.035,canDi*0.075);
          yP2 = yP1+rndNum(canDi*0.035,canDi*0.075);
          xP3 = xP2-rndNum(canDi*0.035,canDi*0.075);
          yP3 = yP1+rndNum(canDi*0.35,canDi*0.45);
          stroke(hairColourBase);
          strokeWeight(hairStrokeWeight*4);
          beginShape();
          curveVertex(xP1,yP1);
          curveVertex(xP1,yP1);
          curveVertex(xP2,yP2);
          curveVertex(xP3+rndNum(-canDi*0.075,canDi*0.075),yP3-rndNum(canDi*0.175,canDi*0.25));
          curveVertex(xP3,yP3);
          curveVertex(xP3,yP3);
          endShape();
          stroke(colPal.compliment[0],colPal.mask[1],colPal.mask[2]);
          strokeWeight(hairStrokeWeight);
          beginShape();
          curveVertex(xP1,yP1);
          curveVertex(xP1,yP1);
          curveVertex(xP2,yP2);
          curveVertex(xP3+rndNum(-canDi*0.075,canDi*0.075),yP3-rndNum(canDi*0.175,canDi*0.25));
          curveVertex(xP3,yP3);
          curveVertex(xP3,yP3);
          endShape();
          iterator = iterator + canDi*0.05;
        }
        iterator = 0;
        for (var i = 0; i < 2; i++) {
          let xP2,xP3,yP2,yP3;
          let xP1 = rndNum(canDi*0.4,canDi*0.425)+iterator;
          let yP1 = rndNum(canDi*0.275,canDi*0.3)+iterator;
          xP2 = xP1-rndNum(canDi*0.035,canDi*0.075);
          yP2 = yP1+rndNum(canDi*0.035,canDi*0.075);
          xP3 = xP2-rndNum(canDi*0.035,canDi*0.075);
          yP3 = yP1+rndNum(canDi*0.45,canDi*0.55);
          stroke(hairColourBase);
          strokeWeight(hairStrokeWeight*4);
          beginShape();
          curveVertex(xP1,yP1);
          curveVertex(xP1,yP1);
          curveVertex(xP2,yP2);
          curveVertex(xP3+rndNum(-canDi*0.075,canDi*0.075),yP3-rndNum(canDi*0.175,canDi*0.25));
          curveVertex(xP3,yP3);
          curveVertex(xP3,yP3);
          endShape();
          stroke(colPal.compliment[0],colPal.mask[1],colPal.mask[2]);
          strokeWeight(hairStrokeWeight);
          beginShape();
          curveVertex(xP1,yP1);
          curveVertex(xP1,yP1);
          curveVertex(xP2,yP2);
          curveVertex(xP3+rndNum(-canDi*0.075,canDi*0.075),yP3-rndNum(canDi*0.175,canDi*0.25));
          curveVertex(xP3,yP3);
          curveVertex(xP3,yP3);
          endShape();
          iterator = iterator + canDi*0.05;
        }
      }
      break;
    case 7:
      //spiky dreads
      stroke(hairColourBase);
      fill(hairColourBase);
      strokeWeight(hairStrokeWeight);
      beginShape();
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.45,canDi*0.45);
      curveVertex(canDi*0.52,canDi*0.35);
      curveVertex(canDi*0.73,canDi*0.35);
      curveVertex(canDi*0.65,canDi*0.25);
      curveVertex(canDi*0.525,canDi*0.22);
      curveVertex(canDi*0.4,canDi*0.25);
      curveVertex(canDi*0.33,canDi*0.32);
      curveVertex(canDi*0.31,canDi*0.45);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      endShape();
      if ([5,6,7,8].includes(hatChoice)) {
        //in crown
        createDreadHair(canDi*0.49,rndNum(canDi*0.25,canDi*0.275),canDi*0.075,hairColourBase,colPal.mask);
        createDreadHair(canDi*0.5,rndNum(canDi*0.25,canDi*0.275),canDi*0.075,hairColourBase,colPal.mask);
        createDreadHair(canDi*0.52,rndNum(canDi*0.25,canDi*0.275),canDi*0.075,hairColourBase,colPal.mask);
        createDreadHair(canDi*0.585,rndNum(canDi*0.25,canDi*0.275),canDi*0.075,hairColourBase,colPal.mask);
        createDreadHair(canDi*0.675,rndNum(canDi*0.32,canDi*0.325),canDi*0.075,hairColourBase,colPal.mask);
        createDreadHair(canDi*0.51,rndNum(canDi*0.3,canDi*0.315),canDi*0.075,hairColourBase,colPal.mask);
        createDreadHair(canDi*0.6,rndNum(canDi*0.3,canDi*0.315),canDi*0.075,hairColourBase,colPal.mask);
      } else {
        createDreadHair(canDi*0.49,rndNum(canDi*0.25,canDi*0.275),canDi*0.075,hairColourBase,colPal.mask);
        createDreadHair(canDi*0.5,rndNum(canDi*0.25,canDi*0.275),canDi*0.075,hairColourBase,colPal.mask);
        createDreadHair(canDi*0.52,rndNum(canDi*0.25,canDi*0.275),canDi*0.075,hairColourBase,colPal.mask);
        createDreadHair(canDi*0.585,rndNum(canDi*0.25,canDi*0.275),canDi*0.075,hairColourBase,colPal.mask);
        createDreadHair(canDi*0.675,rndNum(canDi*0.32,canDi*0.325),canDi*0.075,hairColourBase,colPal.mask);
        createDreadHair(canDi*0.51,rndNum(canDi*0.3,canDi*0.315),canDi*0.075,hairColourBase,colPal.mask);
        createDreadHair(canDi*0.6,rndNum(canDi*0.3,canDi*0.315),canDi*0.075,hairColourBase,colPal.mask);

        createDreadHair(canDi*0.42,rndNum(canDi*0.26,canDi*0.285),canDi*0.075,hairColourBase,colPal.mask);
        createDreadHair(canDi*0.4,rndNum(canDi*0.35,canDi*0.375),canDi*0.075,hairColourBase,colPal.mask);
        createDreadHair(canDi*0.4,rndNum(canDi*0.35,canDi*0.365),canDi*0.075,hairColourBase,colPal.mask);
      }
      //different colour
      //createDreadHair(canDi*0.39,rndNum(canDi*0.28,canDi*0.305),canDi*0.075,colPal.compliment,colPal.mask);
      //createDreadHair(canDi*0.35,rndNum(canDi*0.35,canDi*0.375),canDi*0.075,colPal.compliment,colPal.mask);
      //createDreadHair(canDi*0.35,rndNum(canDi*0.45,canDi*0.465),canDi*0.075,colPal.compliment,colPal.mask);

      break;
    case 8:
      //bad hair day
      stroke(hairColourBase);
      fill(hairColourBase);
      strokeWeight(hairStrokeWeight);
      beginShape();
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.45,canDi*0.45);
      curveVertex(canDi*0.52,canDi*0.35);
      curveVertex(canDi*0.73,canDi*0.35);
      curveVertex(canDi*0.65,canDi*0.25);
      curveVertex(canDi*0.525,canDi*0.22);
      curveVertex(canDi*0.4,canDi*0.25);
      curveVertex(canDi*0.32,canDi*0.32);
      curveVertex(canDi*0.3,canDi*0.45);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      endShape();
      createBadHair(canDi*0.49,rndNum(canDi*0.25,canDi*0.275),canDi*0.015,hairColourBase,hairColourBase);
      createBadHair(canDi*0.42,rndNum(canDi*0.26,canDi*0.285),canDi*0.015,hairColourBase,hairColourBase);
      createBadHair(canDi*0.39,rndNum(canDi*0.28,canDi*0.305),canDi*0.015,hairColourBase,hairColourBase);
      createBadHair(canDi*0.35,rndNum(canDi*0.35,canDi*0.375),canDi*0.015,hairColourBase,hairColourBase);
      createBadHair(canDi*0.35,rndNum(canDi*0.45,canDi*0.465),canDi*0.015,hairColourBase,hairColourBase);
      createBadHair(canDi*0.37,rndNum(canDi*0.45,canDi*0.465),canDi*0.015,hairColourBase,hairColourBase);
      createBadHair(canDi*0.37,rndNum(canDi*0.35,canDi*0.375),canDi*0.015,hairColourBase,hairColourBase);
      createBadHair(canDi*0.4,rndNum(canDi*0.45,canDi*0.465),canDi*0.015,hairColourBase,hairColourBase);
      createBadHair(canDi*0.4,rndNum(canDi*0.35,canDi*0.375),canDi*0.015,hairColourBase,hairColourBase);
      //front hair
      createBadHair(canDi*0.5,rndNum(canDi*0.25,canDi*0.275),canDi*0.015,hairColourBase,hairColourBase);
      createBadHair(canDi*0.52,rndNum(canDi*0.25,canDi*0.275),canDi*0.015,hairColourBase,hairColourBase);
      createBadHair(canDi*0.585,rndNum(canDi*0.25,canDi*0.275),canDi*0.015,hairColourBase,hairColourBase);
      createBadHair(canDi*0.7,rndNum(canDi*0.32,canDi*0.325),canDi*0.015,hairColourBase,hairColourBase);
      //foreground hair
      createBadHair(canDi*0.51,rndNum(canDi*0.3,canDi*0.315),canDi*0.015,hairColourBase,hairColourBase);
      createBadHair(canDi*0.6,rndNum(canDi*0.3,canDi*0.315),canDi*0.015,hairColourBase,hairColourBase);
      createBadHair(canDi*0.55,rndNum(canDi*0.3,canDi*0.315),canDi*0.015,hairColourBase,hairColourBase);
      createBadHair(canDi*0.685,rndNum(canDi*0.3,canDi*0.315),canDi*0.015,hairColourBase,hairColourBase);
      iterator = 0;
      for (var i = 0; i < 20; i++) {
        createBadHair(canDi*0.375+iterator,rndNum(canDi*0.25,canDi*0.3),canDi*0.015,hairColourBase,hairColourBase);
        iterator = iterator + canDi*0.015;
      }
      break;
    case 9:
      //buzzed hair
      stroke(hairColourBase);
      fill(hairColourBase);
      strokeWeight(hairStrokeWeight);
      beginShape();
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.45,canDi*0.45);
      curveVertex(canDi*0.52,canDi*0.35);
      curveVertex(canDi*0.73,canDi*0.35);
      curveVertex(canDi*0.65,canDi*0.25);
      curveVertex(canDi*0.525,canDi*0.22);
      curveVertex(canDi*0.4,canDi*0.25);
      curveVertex(canDi*0.33,canDi*0.32);
      curveVertex(canDi*0.31,canDi*0.45);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      endShape();
      stroke(hairColourBase[0],colPal.compliment[1],colPal.compliment[2]);
      strokeWeight(hairStrokeWeight*1.5);
      xP1 = canDi*0.31;
      yP1 = canDi*0.4;
      iterator = 0;
      for (var hB = 0; hB < 4; hB++) {
        line(xP1+canDi*0.17+iterator,yP1+rndNum(0,canDi*0.005)-canDi*0.19,xP1+canDi*0.17+iterator-rndNum(canDi*0.008,canDi*0.012),yP1+rndNum(-canDi*0.008,canDi*0.008)-canDi*0.19);
        iterator = iterator + canDi*0.03;
      }
      iterator = 0;
      for (var hB = 0; hB < 8; hB++) {
        line(xP1+canDi*0.12+iterator,yP1+rndNum(0,canDi*0.005)-canDi*0.17,xP1+canDi*0.12+iterator-rndNum(canDi*0.008,canDi*0.012),yP1+rndNum(-canDi*0.008,canDi*0.008)-canDi*0.17);
        iterator = iterator + canDi*0.03;
      }
      iterator = 0;
      for (var hB = 0; hB < 11; hB++) {
        line(xP1+canDi*0.07+iterator,yP1+rndNum(0,canDi*0.005)-canDi*0.145,xP1+canDi*0.07+iterator-rndNum(canDi*0.008,canDi*0.012),yP1+rndNum(-canDi*0.008,canDi*0.008)-canDi*0.145);
        iterator = iterator + canDi*0.03;
      }
      iterator = 0;
      for (var hB = 0; hB < 13; hB++) {
        line(xP1+canDi*0.03+iterator,yP1+rndNum(0,canDi*0.005)-canDi*0.115,xP1+canDi*0.03+iterator-rndNum(canDi*0.008,canDi*0.012),yP1+rndNum(-canDi*0.008,canDi*0.008)-canDi*0.115);
        iterator = iterator + canDi*0.03;
      }
      iterator = 0;
      for (var hB = 0; hB < 14; hB++) {
        line(xP1+canDi*0.02+iterator,yP1+rndNum(0,canDi*0.005)-canDi*0.09,xP1+canDi*0.02+iterator-rndNum(canDi*0.008,canDi*0.012),yP1+rndNum(-canDi*0.008,canDi*0.008)-canDi*0.09);
        iterator = iterator + canDi*0.03;
      }
      iterator = 0;
      for (var hB = 0; hB < 15; hB++) {
        line(xP1+canDi*0.01+iterator,yP1+rndNum(0,canDi*0.005)-canDi*0.06,xP1+canDi*0.01+iterator-rndNum(canDi*0.008,canDi*0.012),yP1+rndNum(-canDi*0.008,canDi*0.008)-canDi*0.06);
        iterator = iterator + canDi*0.03;
      }
      iterator = 0;
      for (var hB = 0; hB < 7; hB++) {
        line(xP1+iterator,yP1+rndNum(0,canDi*0.005)-canDi*0.03,xP1+iterator-rndNum(canDi*0.008,canDi*0.012),yP1+rndNum(-canDi*0.008,canDi*0.008)-canDi*0.03);
        iterator = iterator + canDi*0.03;
      }
      iterator = 0;
      for (var hB = 0; hB < 6; hB++) {
        line(xP1+iterator,yP1+rndNum(0,canDi*0.005),xP1+iterator-rndNum(canDi*0.008,canDi*0.012),yP1+rndNum(-canDi*0.008,canDi*0.008));
        line(xP1+iterator,yP1+rndNum(0,canDi*0.005)+ canDi*0.03,xP1+iterator-rndNum(canDi*0.008,canDi*0.012),yP1+rndNum(-canDi*0.008,canDi*0.008)+ canDi*0.03);
        iterator = iterator + canDi*0.03;
      }
      iterator = 0;
      for (var hB = 0; hB < 6; hB++) {
        line(xP1+iterator,yP1+rndNum(0,canDi*0.005)+ canDi*0.06,xP1+iterator-rndNum(canDi*0.008,canDi*0.012),yP1+rndNum(-canDi*0.008,canDi*0.008)+ canDi*0.06);
        iterator = iterator + canDi*0.03;
      }
      break;
    case 10:
      //house party
      stroke(hairColourBase);
      fill(hairColourBase);
      strokeWeight(hairStrokeWeight);
      beginShape();
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.45,canDi*0.45);
      curveVertex(canDi*0.52,canDi*0.35);
      curveVertex(canDi*0.73,canDi*0.35);
      curveVertex(canDi*0.65,canDi*0.25);
      curveVertex(canDi*0.525,canDi*0.22);
      curveVertex(canDi*0.4,canDi*0.25);
      curveVertex(canDi*0.33,canDi*0.32);
      curveVertex(canDi*0.31,canDi*0.45);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      endShape();
      strokeWeight(hairStrokeWeight*4);
      iterator = 0;
      for (let hairStrands = 0; hairStrands < 5; hairStrands++) {
        line(canDi*0.325+iterator,canDi*0.4,canDi*0.325+iterator,rndNum(canDi*0.1,canDi*0.175));
        iterator = iterator + canDi*0.035;
      }
      iterator = 0;
      for (let hairStrands = 0; hairStrands < 8; hairStrands++) {
        line(canDi*0.47+iterator,canDi*0.32,canDi*0.47+iterator,rndNum(canDi*0.1,canDi*0.175));
        iterator = iterator + canDi*0.0352;
      }
      break;
      break;
    case 11:
      //medium straight
      stroke(hairColourBase);
      fill(hairColourBase);
      strokeWeight(hairStrokeWeight*2);
      beginShape();
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.45,canDi*0.45);
      curveVertex(canDi*0.52,canDi*0.35);
      curveVertex(canDi*0.73,canDi*0.35);
      curveVertex(canDi*0.65,canDi*0.25);
      curveVertex(canDi*0.525,canDi*0.22);
      curveVertex(canDi*0.4,canDi*0.25);
      curveVertex(canDi*0.33,canDi*0.32);
      curveVertex(canDi*0.31,canDi*0.45);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      endShape();
      createStraightHair(canDi*0.345,rndNum(canDi*0.45,canDi*0.465),1);
      createStraightHair(canDi*0.35,rndNum(canDi*0.45,canDi*0.465),1);
      createStraightHair(canDi*0.365,rndNum(canDi*0.45,canDi*0.465),1);
      stroke(hairColourBase[0],hairColourBase[1],colPal.mask[2]);
      strokeWeight(hairStrokeWeight);
      createStraightHair(canDi*0.35,rndNum(canDi*0.45,canDi*0.465),1,1);
      createStraightHair(canDi*0.365,rndNum(canDi*0.45,canDi*0.465),1,1);
      xP1 = rndNum(canDi*0.515,canDi*0.535);
      yP1 = rndNum(canDi*0.38,canDi*0.42);
      noFill();
      stroke(hairColourBase);
      strokeWeight(hairStrokeWeight*2);
      beginShape();
      curveVertex(canDi*0.6,canDi*0.325);
      curveVertex(canDi*0.6,canDi*0.325);
      curveVertex(xP1,yP1);
      curveVertex(canDi*0.375,canDi*0.475);
      curveVertex(canDi*0.375,canDi*0.475);
      endShape();
      stroke(hairColourBase[0],hairColourBase[1],colPal.mask[2]);
      strokeWeight(hairStrokeWeight);
      beginShape();
      curveVertex(canDi*0.6,canDi*0.325);
      curveVertex(canDi*0.6,canDi*0.325);
      curveVertex(xP1,yP1);
      curveVertex(canDi*0.375,canDi*0.475);
      curveVertex(canDi*0.375,canDi*0.475);
      endShape();
      break;
    case 12:
      //long curly
      if (hairColourChange.includes(colourChoice)) {
        stroke(colPal.mask[0],colPal.mask[1],colPal.darkaccent[2]);
        fill(colPal.mask[0],colPal.mask[1],colPal.darkaccent[2]);
      } else {
        stroke(hairColourBase);
        fill(hairColourBase);
      }
      if ([1,2,3,4,13].includes(hatChoice)) {
        strokeWeight(hairStrokeWeight*2);
      } else {
        strokeWeight(hairStrokeWeight*4);
      }
      beginShape();
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.45,canDi*0.45);
      curveVertex(canDi*0.52,canDi*0.35);
      curveVertex(canDi*0.73,canDi*0.35);
      curveVertex(canDi*0.65,canDi*0.25);
      curveVertex(canDi*0.525,canDi*0.22);
      curveVertex(canDi*0.4,canDi*0.25);
      curveVertex(canDi*0.33,canDi*0.32);
      curveVertex(canDi*0.31,canDi*0.45);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      endShape();
      //noFill();
      createCurlyHair(canDi*0.345,rndNum(canDi*0.45,canDi*0.465));
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      noFill();
      strokeWeight(hairStrokeWeight);
      createCurlyHair(canDi*0.345,rndNum(canDi*0.45,canDi*0.465),2,1);
      createCurlyHair(canDi*0.355,rndNum(canDi*0.45,canDi*0.465),2,1);
      if (hairColourChange.includes(colourChoice)) {
        stroke(colPal.mask[0],colPal.mask[1],colPal.darkaccent[2]);
      } else {
        stroke(hairColourBase);
      }
      strokeWeight(hairStrokeWeight*5);
      beginShape();
      curveVertex(canDi*0.7,canDi*0.325);
      curveVertex(canDi*0.7,canDi*0.325);
      curveVertex(canDi*0.525,canDi*0.375);
      curveVertex(canDi*0.375,canDi*0.34);
      curveVertex(canDi*0.375,canDi*0.34);
      endShape();
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      noFill();
      strokeWeight(hairStrokeWeight);
      beginShape();
      curveVertex(canDi*0.7,canDi*0.325);
      curveVertex(canDi*0.7,canDi*0.325);
      curveVertex(canDi*0.525,canDi*0.375);
      curveVertex(canDi*0.375,canDi*0.34);
      curveVertex(canDi*0.375,canDi*0.34);
      endShape();
      break;
    case 13:
      //mohawk
      stroke(hairColourBase);
      strokeWeight(hairStrokeWeight*1.5);
      xP1 = canDi*0.335;
      yP1 = canDi*0.4;
      iterator = 0;
      for (var hB = 0; hB < 9; hB++) {
        point(xP1+iterator,yP1+rndNum(0,canDi*0.005)-canDi*0.025);
        iterator = iterator + canDi*0.0195;
      }
      iterator = 0;
      for (var hB = 0; hB < 8; hB++) {
        point(xP1+iterator+canDi*0.11,yP1+rndNum(0,canDi*0.005)-canDi*0.15);
        point(xP1+iterator,yP1+rndNum(0,canDi*0.005));
        point(xP1+iterator,yP1+rndNum(0,canDi*0.005)+canDi*0.025);
        point(xP1+iterator,yP1+rndNum(0,canDi*0.005)+canDi*0.05);
        point(xP1+iterator,yP1+rndNum(0,canDi*0.005)+canDi*0.075);
        iterator = iterator + canDi*0.0195;
      }
      iterator = 0;
      for (var hB = 0; hB < 15; hB++) {
        point(xP1+iterator+canDi*0.012,yP1+rndNum(0,canDi*0.005)-canDi*0.05);
        iterator = iterator + canDi*0.0195;
      }
      iterator = 0;
      for (var hB = 0; hB < 15; hB++) {
        point(xP1+iterator+canDi*0.07,yP1+rndNum(0,canDi*0.005)-canDi*0.125);
        point(xP1+iterator+canDi*0.05,yP1+rndNum(0,canDi*0.005)-canDi*0.1);
        point(xP1+iterator+canDi*0.03,yP1+rndNum(0,canDi*0.005)-canDi*0.075);
        iterator = iterator + canDi*0.0195;
      }
      stroke(hairColourBase);
      if ([12,13].includes(hatChoice)) {
      } else {
        noFill();
        createMohawkHair(canDi*0.535,canDi*0.235);
        createMohawkHair(canDi*0.55,canDi*0.24);
        createMohawkHair(canDi*0.585,canDi*0.265);
        createMohawkHair(canDi*0.6,canDi*0.28);
        createMohawkHair(canDi*0.625,canDi*0.29);
        createMohawkHair(canDi*0.64,canDi*0.305);
        createMohawkHair(canDi*0.65,canDi*0.315);

        stroke(hairColourBase[0],hairColourBase[1],hairColourBase[2]+5);
        strokeWeight(hairStrokeWeight);
        createMohawkHair(canDi*0.535,canDi*0.235);
        createMohawkHair(canDi*0.55,canDi*0.24);
        createMohawkHair(canDi*0.585,canDi*0.265);
        createMohawkHair(canDi*0.625,canDi*0.29);
        createMohawkHair(canDi*0.65,canDi*0.315);
      }
      break;
    case 14:
      //spiked front hair
      stroke(hairColourBase);
      fill(hairColourBase);
      strokeWeight(hairStrokeWeight);
      beginShape();
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.45,canDi*0.45);
      curveVertex(canDi*0.52,canDi*0.35);
      curveVertex(canDi*0.73,canDi*0.35);
      curveVertex(canDi*0.65,canDi*0.25);
      curveVertex(canDi*0.525,canDi*0.22);
      curveVertex(canDi*0.4,canDi*0.25);
      curveVertex(canDi*0.33,canDi*0.32);
      curveVertex(canDi*0.31,canDi*0.45);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      endShape();
      if ([1,2,12,13].includes(hatChoice)) {

      } else {
        strokeWeight(hairStrokeWeight*4);
        iterator = 0;
        for (let hairStrands = 0; hairStrands < 5; hairStrands++) {
          line(canDi*0.47+iterator,canDi*0.32,canDi*0.47+iterator,rndNum(canDi*0.15,canDi*0.2));
          iterator = iterator + canDi*0.0352;
        }
        iterator = 0;
        for (let hairStrands = 0; hairStrands < 5; hairStrands++) {
          line(canDi*0.6+iterator,canDi*0.32,canDi*0.6+iterator,rndNum(canDi*0.075,canDi*0.125));
          iterator = iterator + canDi*0.031;
        }
        stroke(hairColourBase[0],hairColourBase[1],hairColourBase[2]-10);
        strokeWeight(hairStrokeWeight);
        iterator = 0;
        for (let hairStrands = 0; hairStrands < 8; hairStrands++) {
          line(canDi*0.5+iterator,rndNum(canDi*0.275,canDi*0.295),canDi*0.5+iterator,rndNum(canDi*0.2,canDi*0.25));
          iterator = iterator + canDi*0.031;
        }
      }
      stroke(hairColourBase[0],hairColourBase[1],hairColourBase[2]-10);
      strokeWeight(hairStrokeWeight);
      iterator = 0;
      for (let hairStrands = 0; hairStrands < 5; hairStrands++) {
        line(canDi*0.32+iterator,rndNum(canDi*0.45,canDi*0.475),canDi*0.32+iterator,rndNum(canDi*0.35,canDi*0.375));
        iterator = iterator + canDi*0.031;
      }
      break;
    case 15:
      //chart
      stroke(hairColourBase);
      fill(hairColourBase);
      strokeWeight(hairStrokeWeight);
      beginShape();
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.45,canDi*0.45);
      curveVertex(canDi*0.52,canDi*0.35);
      curveVertex(canDi*0.73,canDi*0.35);
      curveVertex(canDi*0.65,canDi*0.25);
      curveVertex(canDi*0.525,canDi*0.22);
      curveVertex(canDi*0.4,canDi*0.25);
      curveVertex(canDi*0.33,canDi*0.32);
      curveVertex(canDi*0.31,canDi*0.45);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      endShape();
      strokeWeight(hairStrokeWeight);
      iterator = 0;
      for (let hairStrands = 0; hairStrands < 47; hairStrands++) {
        line(canDi*0.31+iterator,canDi*0.48,canDi*0.31+iterator,rndNum(canDi*0.05,canDi*0.225));
        iterator = iterator + canDi*0.0095;
      }
      break;
    case 16:
      //medium curly
      if (hairColourChange.includes(colourChoice)) {
        stroke(colPal.mask[0],colPal.mask[1],colPal.darkaccent[2]);
        fill(colPal.mask[0],colPal.mask[1],colPal.darkaccent[2]);
      } else {
        stroke(hairColourBase);
        fill(hairColourBase);
      }
      if ([1,2,3,4,13].includes(hatChoice)) {
        strokeWeight(hairStrokeWeight*2);
      } else {
        strokeWeight(hairStrokeWeight*4);
      }
      beginShape();
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.45,canDi*0.45);
      curveVertex(canDi*0.52,canDi*0.35);
      curveVertex(canDi*0.73,canDi*0.35);
      curveVertex(canDi*0.65,canDi*0.25);
      curveVertex(canDi*0.525,canDi*0.22);
      curveVertex(canDi*0.4,canDi*0.25);
      curveVertex(canDi*0.33,canDi*0.32);
      curveVertex(canDi*0.31,canDi*0.45);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      endShape();
      //noFill();
      createCurlyHair(canDi*0.345,rndNum(canDi*0.45,canDi*0.465),1);
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      noFill();
      strokeWeight(hairStrokeWeight);
      createCurlyHair(canDi*0.345,rndNum(canDi*0.45,canDi*0.465),1,1);
      createCurlyHair(canDi*0.355,rndNum(canDi*0.45,canDi*0.465),1,1);
      if (hairColourChange.includes(colourChoice)) {
        stroke(colPal.mask[0],colPal.mask[1],colPal.darkaccent[2]);
      } else {
        stroke(hairColourBase);
      }
      strokeWeight(hairStrokeWeight*5);
      beginShape();
      curveVertex(canDi*0.7,canDi*0.325);
      curveVertex(canDi*0.7,canDi*0.325);
      curveVertex(canDi*0.525,canDi*0.375);
      curveVertex(canDi*0.375,canDi*0.34);
      curveVertex(canDi*0.375,canDi*0.34);
      endShape();
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      noFill();
      strokeWeight(hairStrokeWeight);
      beginShape();
      curveVertex(canDi*0.7,canDi*0.325);
      curveVertex(canDi*0.7,canDi*0.325);
      curveVertex(canDi*0.525,canDi*0.375);
      curveVertex(canDi*0.375,canDi*0.34);
      curveVertex(canDi*0.375,canDi*0.34);
      endShape();
      break;
    case 17:
      //long straight
      stroke(hairColourBase);
      fill(hairColourBase);
      strokeWeight(hairStrokeWeight*2);
      beginShape();
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.45,canDi*0.45);
      curveVertex(canDi*0.52,canDi*0.35);
      curveVertex(canDi*0.73,canDi*0.35);
      curveVertex(canDi*0.65,canDi*0.25);
      curveVertex(canDi*0.525,canDi*0.22);
      curveVertex(canDi*0.4,canDi*0.25);
      curveVertex(canDi*0.33,canDi*0.32);
      curveVertex(canDi*0.31,canDi*0.45);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      endShape();
      createStraightHair(canDi*0.345,rndNum(canDi*0.45,canDi*0.465),2,1);
      createStraightHair(canDi*0.35,rndNum(canDi*0.45,canDi*0.465),2,1);
      createStraightHair(canDi*0.365,rndNum(canDi*0.45,canDi*0.465),2,1);
      createStraightHair(canDi*0.345,rndNum(canDi*0.45,canDi*0.465),2,1);
      createStraightHair(canDi*0.35,rndNum(canDi*0.45,canDi*0.465),2,1);
      createStraightHair(canDi*0.365,rndNum(canDi*0.45,canDi*0.465),2,1);
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.mask[2]);
      strokeWeight(hairStrokeWeight);
      createStraightHair(canDi*0.35,rndNum(canDi*0.45,canDi*0.465),2,1);
      createStraightHair(canDi*0.365,rndNum(canDi*0.45,canDi*0.465),2,1);
      xP1 = rndNum(canDi*0.515,canDi*0.535);
      yP1 = rndNum(canDi*0.38,canDi*0.42);
      noFill();
      stroke(hairColourBase);
      strokeWeight(hairStrokeWeight*2);
      beginShape();
      curveVertex(canDi*0.6,canDi*0.325);
      curveVertex(canDi*0.6,canDi*0.325);
      curveVertex(xP1,yP1);
      curveVertex(canDi*0.375,canDi*0.475);
      curveVertex(canDi*0.375,canDi*0.475);
      endShape();
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.mask[2]);
      strokeWeight(hairStrokeWeight);
      beginShape();
      curveVertex(canDi*0.6,canDi*0.325);
      curveVertex(canDi*0.6,canDi*0.325);
      curveVertex(xP1,yP1);
      curveVertex(canDi*0.375,canDi*0.475);
      curveVertex(canDi*0.375,canDi*0.475);
      endShape();
      break;
    case 18:
      //chelsea
      stroke(hairColourBase);
      fill(hairColourBase);
      strokeWeight(hairStrokeWeight);
      beginShape();
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.45,canDi*0.45);
      curveVertex(canDi*0.52,canDi*0.35);
      curveVertex(canDi*0.73,canDi*0.35);
      curveVertex(canDi*0.65,canDi*0.25);
      curveVertex(canDi*0.525,canDi*0.22);
      curveVertex(canDi*0.4,canDi*0.25);
      curveVertex(canDi*0.33,canDi*0.32);
      curveVertex(canDi*0.31,canDi*0.45);
      curveVertex(canDi*0.35,canDi*0.55);
      curveVertex(canDi*0.35,canDi*0.55);
      endShape();
      if ([1,2,12,13].includes(hatChoice)) {

      } else {
        stroke(hairColourBase);
        noFill();
        strokeWeight(hairStrokeWeight*2);
        iterator = 0;
        for (let hairStrokes = 0; hairStrokes < 6; hairStrokes++) {
          createStraightHair(canDi*0.75+iterator,rndNum(canDi*0.4,canDi*0.43),1);
          iterator = iterator + canDi*0.0045;
        }
        iterator = 0;
        for (let hairStrokes = 0; hairStrokes < 12; hairStrokes++) {
          createStraightHair(canDi*0.67+iterator,rndNum(canDi*0.3,canDi*0.32),0);
          iterator = iterator + canDi*0.0075;
        }
        stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.mask[2]);
        noFill();
        strokeWeight(hairStrokeWeight);
        iterator = 0;
        for (let hairStrokes = 0; hairStrokes < 4; hairStrokes++) {
          createStraightHair(canDi*0.675+iterator,rndNum(canDi*0.275,canDi*0.325),0);
          iterator = iterator + canDi*0.01;
        }
        stroke(hairColourBase);
        noFill();
        strokeWeight(hairStrokeWeight*2);
        iterator = 0;
        for (let hairStrokes = 0; hairStrokes < 2; hairStrokes++) {
          createStraightHair(canDi*0.675+iterator,rndNum(canDi*0.275,canDi*0.325),0);
          iterator = iterator + canDi*0.01;
        }
        iterator = 0;
        for (var i = 0; i < 2; i++) {
          xP1 = rndNum(canDi*0.66,canDi*0.68)+iterator;
          xP2 = xP1+rndNum(canDi*0.125,canDi*0.15);
          xP3 = xP1+rndNum(canDi*0.1,canDi*0.15);
          yP1 = rndNum(canDi*0.262,canDi*0.264)+iterator;
          yP2 = yP1+rndNum(canDi*0.2,canDi*0.25);
          yP3 = yP2+rndNum(canDi*0.3,canDi*0.35);
          beginShape();
          curveVertex(xP1,yP1);
          curveVertex(xP1,yP1);
          curveVertex(xP1+rndNum(canDi*0.1,canDi*0.112),yP1+rndNum(canDi*0.05,canDi*0.075));
          curveVertex(xP2,yP2);
          curveVertex(xP3,yP3);
          curveVertex(xP3,yP3);
          endShape();
          iterator = iterator + canDi*0.025;
        }
      }
      break;
  }

  let hairDescription = {0:'hairless',1:'tight curls ponytail',2:'curly up front',3:'dapper',4:'afro',5:'crazed',6:'long dreads',7:'dreads on top',8:'bad hair day',9:'buzzed',10:'house party',11:'medium straight hair',12:'long curly hair',13:'mohawk',14:'attention',15:'chart',16:'medium curly hair',17:'long straight hair',18:'chelsea'};
  return hairDescription[hairChoice];
}
function setBackHair(hairChoice,hatChoice,colPal,canDi) {
  let xP1,xP3,yP1,yP2,rectWidth,tempXRange,iterator;
  let shadeChoice = rndArr([0,10]);
  let shadeChoice2 = rndArr([0,10,20]);
  let logoChoice = rndArr([0,1]);
  let rotationChoice = rndArr([0,1,2]);
  let hairStrokeWeight = canDi*0.01;
  switch (hairChoice) {
    case 0:
      if (colourChoice === 7 && hatChoice === 0 && hairChoice === 0) {
        switch (getBaldHorns) {
          case 1:
            stroke(colPal.base[0],colPal.base[1],colPal.base[2]);
            fill(colPal.base[0],colPal.base[1],colPal.base[2]);
            strokeWeight(canDi*0.015);
            beginShape();
            vertex(canDi*0.75,canDi*0.2);
            vertex(canDi*0.75,canDi*0.2);
            curveVertex(canDi*0.77,canDi*0.3);
            curveVertex(canDi*0.72,canDi*0.39);
            curveVertex(canDi*0.62,canDi*0.4);
            curveVertex(canDi*0.62,canDi*0.3);
            curveVertex(canDi*0.72,canDi*0.3);
            curveVertex(canDi*0.75,canDi*0.265);
            vertex(canDi*0.75,canDi*0.2);
            vertex(canDi*0.75,canDi*0.2);
            endShape();
            break;
          default:
        }
      } else {}
      break;
    case 1:
      //tight curls ponytail
      stroke(hairColourBase);
      fill(hairColourBase);
      if ([1,2,3,5,6,7,8,12,13].includes(hatChoice)) {
        createSpheres([canDi*0.25,canDi*0.4],[canDi*0.6,canDi*0.75]);
        createSpheres([canDi*0.33,canDi*0.5],[canDi*0.45,canDi*0.575]);
      } else {
        createSpheres([canDi*0.3,canDi*0.6],[canDi*0.25,canDi*0.35]);
        createSpheres([canDi*0.25,canDi*0.4],[canDi*0.15,canDi*0.35]);
        createSpheres([canDi*0.33,canDi*0.5],[canDi*0.4,canDi*0.6]);
      }
      break;
    case 2:
      //tight curls front long
      stroke(hairColourBase);
      fill(hairColourBase);
      if ([1,2,12,13].includes(hatChoice)) {
      } else {
        createSpheres([canDi*0.4,canDi*0.7],[canDi*0.25,canDi*0.35]);
        createSpheres([canDi*0.55,canDi*0.8],[canDi*0.15,canDi*0.35]);
      }
      break;
    case 3:
      //dapper
      break;
    case 4:
      //afro
      stroke(hairColourBase);
      fill(hairColourBase);
      if ([1,2,12,13].includes(hatChoice)) {
        createSpheres([canDi*0.25,canDi*0.5],[canDi*0.475,canDi*0.65],100);
        createSpheres([canDi*0.6,canDi*0.75],[canDi*0.475,canDi*0.65],100);
      } else {
        createSpheres([canDi*0.2,canDi*0.5],[canDi*0.2,canDi*0.45],100);
        createSpheres([canDi*0.3,canDi*0.5],[canDi*0.2,canDi*0.45],50);
        createSpheres([canDi*0.25,canDi*0.5],[canDi*0.35,canDi*0.65],100);
        createSpheres([canDi*0.3,canDi*0.65],[canDi*0.1,canDi*0.35],100);
        createSpheres([canDi*0.55,canDi*0.8],[canDi*0.15,canDi*0.35]);
      }
      break;
    case 5:
    //crazed
      stroke(hairColourBase);
      noFill();
      strokeWeight(hairStrokeWeight);
      drawShaggyHair();
      // adding medium straight
      iterator = 0;
      for (let hairStrokes = 0; hairStrokes < 20; hairStrokes++) {
        createStraightHair(canDi*0.32+iterator,rndNum(canDi*0.45,canDi*0.465),1);
        iterator = iterator + canDi*0.02;
      }
      iterator = 0;
      for (let hairStrokes = 0; hairStrokes < 40; hairStrokes++) {
        createStraightHair(canDi*0.35+iterator,rndNum(canDi*0.45,canDi*0.465),1);
        iterator = iterator + canDi*0.0075;
      }
      //adding chelsea cut
      iterator = 0;
      for (let hairStrokes = 0; hairStrokes < 8; hairStrokes++) {
        createStraightHair(canDi*0.6+iterator,rndNum(canDi*0.45,canDi*0.465),1);
        iterator = iterator + canDi*0.02;
      }
      break;
    case 6:
      stroke(hairColourBase);
      noFill();
      strokeWeight(hairStrokeWeight*4);
      createShagDreadsHair();
      // adding medium straight
      stroke(hairColourBase);
      //stroke(hairColourBase);
      strokeWeight(canDi*0.045);
      iterator = 0;
      for (let hairStrokes = 0; hairStrokes < 20; hairStrokes++) {
        createStraightHair(canDi*0.32+iterator,rndNum(canDi*0.45,canDi*0.465),1);
        iterator = iterator + canDi*0.02;
      }
      iterator = 0;
      for (let hairStrokes = 0; hairStrokes < 40; hairStrokes++) {
        createStraightHair(canDi*0.35+iterator,rndNum(canDi*0.45,canDi*0.465),1);
        iterator = iterator + canDi*0.0075;
      }
      //adding chelsea cut
      iterator = 0;
      for (let hairStrokes = 0; hairStrokes < 8; hairStrokes++) {
        createStraightHair(canDi*0.6+iterator,rndNum(canDi*0.45,canDi*0.465),1);
        iterator = iterator + canDi*0.02;
      }
      break;
    case 7:
      //spikey dreads
      break;
    case 8:
      //bad hair day
      break;
    case 9:
      //buzzed
      break;
    case 10:
      //house party
      break;
    case 11:
      //medium straight
      stroke(hairColourBase);
      noFill();
      strokeWeight(hairStrokeWeight*2);
      iterator = 0;
      for (let hairStrokes = 0; hairStrokes < 20; hairStrokes++) {
        createStraightHair(canDi*0.32+iterator,rndNum(canDi*0.45,canDi*0.465),1);
        iterator = iterator + canDi*0.02;
      }
      iterator = 0;
      for (let hairStrokes = 0; hairStrokes < 40; hairStrokes++) {
        createStraightHair(canDi*0.35+iterator,rndNum(canDi*0.45,canDi*0.465),1);
        iterator = iterator + canDi*0.0075;
      }
      break;
      break;
    case 12:
      //long curly
      if (hairColourChange.includes(colourChoice)) {
        stroke(colPal.mask[0],colPal.mask[1],colPal.darkaccent[2]);
        fill(colPal.mask[0],colPal.mask[1],colPal.darkaccent[2]);
      } else {
        stroke(hairColourBase);
        fill(hairColourBase);
      }
      strokeWeight(hairStrokeWeight*2);
      iterator = 0;
      for (let hairStrokes = 0; hairStrokes < 10; hairStrokes++) {
        createCurlyHair(canDi*0.32+iterator,rndNum(canDi*0.45,canDi*0.465));
        iterator = iterator + canDi*0.035;
      }
      iterator = 0;
      for (let hairStrokes = 0; hairStrokes < 10; hairStrokes++) {
        createCurlyHair(canDi*0.35+iterator,rndNum(canDi*0.45,canDi*0.465));
        iterator = iterator + canDi*0.035;
      }
      break;
    case 13:
      //mohawk
      if ([1,2,12,13].includes(hatChoice)) {

      } else {
        stroke(hairColourBase);
        noFill();
        strokeWeight(hairStrokeWeight*1.5);
        noFill();
        createMohawkHair(canDi*0.49,rndNum(canDi*0.235,canDi*0.23));
        createMohawkHair(canDi*0.48,rndNum(canDi*0.235,canDi*0.23));
        createMohawkHair(canDi*0.45,rndNum(canDi*0.245,canDi*0.25));
        createMohawkHair(canDi*0.43,rndNum(canDi*0.25,canDi*0.265));
        createMohawkHair(canDi*0.39,rndNum(canDi*0.29,canDi*0.31));
        createMohawkHair(canDi*0.38,rndNum(canDi*0.3,canDi*0.32));
        stroke(hairColourBase[0],hairColourBase[1],hairColourBase[2]+5);
        strokeWeight(hairStrokeWeight);
        createMohawkHair(canDi*0.49,rndNum(canDi*0.235,canDi*0.23));
        createMohawkHair(canDi*0.45,rndNum(canDi*0.245,canDi*0.25));
        createMohawkHair(canDi*0.39,rndNum(canDi*0.29,canDi*0.31));
      }
      break;
    case 14:
      //attention
      break;
    case 15:
      //chart
      break;
    case 16:
      //medium curly
      if (hairColourChange.includes(colourChoice)) {
        stroke(colPal.mask[0],colPal.mask[1],colPal.darkaccent[2]);
        fill(colPal.mask[0],colPal.mask[1],colPal.darkaccent[2]);
      } else {
        stroke(hairColourBase);
        fill(hairColourBase);
      }
      strokeWeight(hairStrokeWeight*2);
      iterator = 0;
      for (let hairStrokes = 0; hairStrokes < 10; hairStrokes++) {
        createCurlyHair(canDi*0.32+iterator,rndNum(canDi*0.45,canDi*0.465),1);
        iterator = iterator + canDi*0.035;
      }
      iterator = 0;
      for (let hairStrokes = 0; hairStrokes < 10; hairStrokes++) {
        createCurlyHair(canDi*0.35+iterator,rndNum(canDi*0.45,canDi*0.465),1);
        iterator = iterator + canDi*0.035;
      }
      break;
    case 17:
      //long straight
      stroke(hairColourBase);
      noFill();
      strokeWeight(hairStrokeWeight*2);
      iterator = 0;
      for (let hairStrokes = 0; hairStrokes < 20; hairStrokes++) {
        createStraightHair(canDi*0.32+iterator,rndNum(canDi*0.45,canDi*0.465));
        iterator = iterator + canDi*0.02;
      }
      iterator = 0;
      for (let hairStrokes = 0; hairStrokes < 40; hairStrokes++) {
        createStraightHair(canDi*0.35+iterator,rndNum(canDi*0.45,canDi*0.465));
        iterator = iterator + canDi*0.0075;
      }
      break;
    case 18:
      //chelsea
      stroke(hairColourBase);
      noFill();
      strokeWeight(hairStrokeWeight*2);
      iterator = 0;
      for (let hairStrokes = 0; hairStrokes < 8; hairStrokes++) {
        createStraightHair(canDi*0.6+iterator,rndNum(canDi*0.45,canDi*0.465),1);
        iterator = iterator + canDi*0.0185;
      }
      break;
  }
}
function setHat(hatChoice,colPal,canDi) {
  let xP1,xP2,xP3,yP1,yP2, rectWidth,tempXRange,iterator,hornsChoice;
  let shadeChoice = rndArr([0,10]);
  let shadeChoice2 = rndArr([10,20]);
  let logoChoice = rndArr([0,1]);
  let rotationChoice = rndArr([0,1,2,3]);
  switch (hatChoice) {
    case 0:
      //no hat
      break;
    case 1:
      //front ballcap
      xP1 = canDi*0.7425;
      yP1 = rndNum(canDi*0.375,canDi*0.45);
      push();
      switch (rotationChoice) {
        case 1:
          translate(canDi*0.015,canDi*0.0048);
          rotate(PI / rndNum(65,85));
          break;
        case 2:
          translate(-canDi*0.015,canDi*0.0048);
          rotate(PI / rndNum(-65,-85));
          break;
        default:
      }
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]-shadeChoice);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]-shadeChoice);
      strokeWeight(rndNum(canDi*0.0325,canDi*0.0375));
      arc(canDi*0.5225,yP1-canDi*0.09,canDi*0.425,canDi*0.35, PI, 0, OPEN)
      rect(canDi*0.31,yP1-canDi*0.1,canDi*0.425,canDi*0.1,0,0,canDi*0.0146,canDi*0.0146);
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]-shadeChoice2);
      noFill();
      line(canDi*0.31,yP1,canDi*0.7425,yP1);
      //hat brim
      drawHatBrim();
      strokeWeight(rndNum(canDi*0.0065,canDi*0.0095));
      arc(canDi*0.5225,yP1-canDi*0.09,canDi*0.425,canDi*0.35, rndArr([0,PI,PI+QUARTER_PI,QUARTER_PI-HALF_PI]), 0, OPEN);
      // cap X design
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      strokeWeight(rndNum(canDi*0.0125,canDi*0.0239));
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      switch(logoChoice) {
        case 0:
          fill(0,0,0,0);
          ellipse(rndNum(canDi*0.66,canDi*0.665),yP1-rndNum(canDi*0.1,canDi*0.125),rndNum(canDi*0.075,canDi*0.1),rndNum(canDi*0.125,canDi*0.15));
          teamChoice = 'O';
          break;
        case 1:
          line(rndNum(canDi*0.6,canDi*0.625),rndNum(canDi*0.25,canDi*0.265),rndNum(canDi*0.7,canDi*0.72),rndNum(canDi*0.355,canDi*0.36));
          line(rndNum(canDi*0.7,canDi*0.72),rndNum(canDi*0.25,canDi*0.265),rndNum(canDi*0.6,canDi*0.625),rndNum(canDi*0.355,canDi*0.36));
          teamChoice = 'X';
          break;
      }
      pop();
      break;
    case 2:
      //back ballcap
      xP1 = canDi*0.31;
      yP1 = rndNum(canDi*0.375,canDi*0.45);
      push();
      switch (rotationChoice) {
        case 1:
          translate(canDi*0.015,canDi*0.0048);
          rotate(PI / rndNum(65,85));
          break;
        case 2:
          translate(-canDi*0.015,canDi*0.0048);
          rotate(PI / rndNum(-65,-85));
          break;
        default:
      }
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]-shadeChoice);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]-shadeChoice);
      strokeWeight(rndNum(canDi*0.0225,canDi*0.0275));
      arc(canDi*0.5225,yP1-canDi*0.09,canDi*0.425,canDi*0.35, PI, 0, OPEN)
      rect(canDi*0.31,yP1-canDi*0.1,canDi*0.425,canDi*0.1,0,0,canDi*0.0146,canDi*0.0146);
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]-shadeChoice2);
      noFill();
      line(canDi*0.31,yP1,canDi*0.7425,yP1);
      drawHatBrim(1);
      strokeWeight(rndNum(canDi*0.0065,canDi*0.0095));
      arc(canDi*0.5225,yP1-canDi*0.09,canDi*0.425,canDi*0.35, rndArr([0,PI,PI+QUARTER_PI,QUARTER_PI-HALF_PI]), 0, OPEN);
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      rect(xP1+canDi*0.05,yP1-canDi*0.015,canDi*0.025,canDi*0.015);
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      strokeWeight(rndNum(canDi*0.005,canDi*0.0065));
      switch(logoChoice) {
        case 0:
          noFill();
          ellipse(xP1+canDi*0.06,yP1-canDi*0.009,canDi*0.015,canDi*0.025);
          teamChoice = 'O';
          break;
        case 1:
          line(xP1+canDi*0.055,yP1-canDi*0.017,xP1+canDi*0.065,yP1+canDi*0.001);
          line(xP1+canDi*0.065,yP1-canDi*0.017,xP1+canDi*0.055,yP1+canDi*0.001);
          teamChoice = 'X';
          break;
      }
      pop();
      break;
    case 3:
      //headband
      xP1 = canDi*0.7425;
      yP1 = rndNum(canDi*0.375,canDi*0.45);
      push();
      switch (rotationChoice) {
        case 1:
          translate(canDi*0.025,canDi*0.0048);
          rotate(PI / rndNum(65,85));
          break;
        case 2:
          translate(-canDi*0.015,canDi*0.0048);
          rotate(PI / rndNum(-65,-85));
          break;
        default:
      }
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]+shadeChoice);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]+shadeChoice);
      strokeWeight(rndNum(canDi*0.0225,canDi*0.0275));
      rect(canDi*0.3,yP1-canDi*0.1,canDi*0.445,canDi*0.1,canDi*0.0078,canDi*0.0078,canDi*0.0078,canDi*0.0078);
      if (colPal.compliment[2] > 70){
        stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]-shadeChoice2);
        fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]-shadeChoice2);
      } else {
        stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]+shadeChoice2);
        fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]+shadeChoice2);
      }
      strokeWeight(rndNum(canDi*0.0225,canDi*0.0275));
      rect(canDi*0.3,yP1-canDi*0.065,canDi*0.445,canDi*0.03);
      if (colPal.highlight[2] > 70){
        stroke(colPal.compliment[0],colPal.highlight[1],colPal.highlight[2]-40);
      } else {
        stroke(colPal.compliment[0],colPal.highlight[1],colPal.highlight[2]+30);
      }
      noFill();
      strokeWeight(rndNum(canDi*0.01,canDi*0.015));
      iterator = 0;
      switch (logoChoice) {
        case 1:
          for (var hBS = 0; hBS < 7; hBS++) {
            strokeWeight(rndNum(canDi*0.0075,canDi*0.0115));
            beginShape(LINES);
            curveVertex(rndNum(canDi*0.3,canDi*0.31)+iterator,yP1-rndNum(canDi*0.063,canDi*0.065));
            curveVertex(rndNum(canDi*0.33,canDi*0.34)+iterator,yP1-rndNum(canDi*0.03,canDi*0.031));
            endShape();
            beginShape(LINES);
            curveVertex(rndNum(canDi*0.33,canDi*0.34)+iterator,yP1-rndNum(canDi*0.063,canDi*0.065));
            curveVertex(rndNum(canDi*0.3,canDi*0.31)+iterator,yP1-rndNum(canDi*0.03,canDi*0.031));
            endShape();
            iterator = iterator + canDi*0.0675;
          }
          teamChoice = 'X';
          break;
        default:
          ellipse(rndNum(canDi*0.62,canDi*0.72)+iterator,yP1-rndNum(canDi*0.05,canDi*0.0525),rndNum(canDi*0.045,canDi*0.05),rndNum(canDi*0.035,canDi*0.04));
          teamChoice = 'O';
      }
      pop();
      break;
    case 4:
      //fast food cap
      xP1 = canDi*0.7425;
      yP1 = rndNum(canDi*0.375,canDi*0.45);
      push();
      switch (rotationChoice) {
        case 1:
          translate(canDi*0.015,canDi*0.0048);
          rotate(PI / rndNum(65,85));
          break;
        case 2:
          translate(-canDi*0.015,canDi*0.0048);
          rotate(PI / rndNum(-65,-85));
          break;
        default:
      }
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]-shadeChoice);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]-shadeChoice);
      strokeWeight(rndNum(canDi*0.0325,canDi*0.0375));
      rect(canDi*0.31,yP1-canDi*0.05,canDi*0.425,canDi*0.03,canDi*0.0146,canDi*0.0146,0,0);
      rect(canDi*0.51,yP1-canDi*0.1,canDi*0.225,canDi*0.1,canDi*0.0146,canDi*0.0146,0,0);
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]-shadeChoice2);
      noFill();
      line(canDi*0.31,yP1,canDi*0.7425,yP1)
      drawHatBrim();
      // cap X design
      stroke(colPal.compliment[0],colPal.compliment[1],70);
      strokeWeight(rndNum(canDi*0.0125,canDi*0.0239));
      switch(logoChoice) {
        case 0:
        fill(0,0,0,0);
          ellipse(rndNum(canDi*0.66,canDi*0.665),yP1-rndNum(canDi*0.05,canDi*0.065),rndNum(canDi*0.065,canDi*0.08),rndNum(canDi*0.08,canDi*0.09));
          teamChoice = 'O';
          break;
        case 1:
          line(rndNum(canDi*0.6,canDi*0.625),rndNum(canDi*0.32,canDi*0.345),rndNum(canDi*0.7,canDi*0.72),rndNum(canDi*0.415,canDi*0.43));
          line(rndNum(canDi*0.7,canDi*0.72),rndNum(canDi*0.32,canDi*0.345),rndNum(canDi*0.6,canDi*0.625),rndNum(canDi*0.415,canDi*0.43));
          teamChoice = 'X';
          break;
      }
      pop();
      break;
    case 5:
      //plain crown
      xP1 = canDi*0.29;
      xP3 = xP1+canDi*0.35;
      yP1 = rndNum(canDi*0.25,canDi*0.3);
      yP2 = yP1-rndNum(canDi*0.05,canDi*0.065);
      push();
      switch (rotationChoice) {
        case 1:
          translate(canDi*0.015,canDi*0.0048);
          rotate(PI / rndNum(65,85));
          break;
        case 2:
          translate(-canDi*0.015,canDi*0.0048);
          rotate(PI / rndNum(-65,-85));
          break;
        default:
      }
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      strokeWeight(canDi*0.003);
      triangle(xP1,yP2,xP1,yP1,xP1+canDi*0.1,yP1);
      triangle(xP1+canDi*0.175,yP2,xP1+canDi*0.1,yP1,xP3-canDi*0.1,yP1);
      triangle(xP3-canDi*0.025,yP2,xP3+canDi*0.05,yP1,xP3-canDi*0.1,yP1);
      triangle(xP3+canDi*0.125,yP2,xP3+canDi*0.125,yP1,xP3+canDi*0.05,yP1);
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      strokeWeight(canDi*0.003);
      rect(xP1,yP1,canDi*0.475,canDi*0.15,0,0,canDi*0.0146,canDi*0.0146);
      pop();
      break;
    case 6:
      //hatch crown
      push();
      switch (rotationChoice) {
        case 1:
          translate(canDi*0.075,-canDi*0.075);
          rotate(PI / rndNum(20,25));
          break;
        case 2:
          translate(-canDi*0.1,canDi*0.15);
          rotate(PI / rndNum(-10,-12));
          break;
        case 3:
          scale(0.85);
          translate(canDi*0.015,canDi*0.1);
          rotate(PI / rndNum(-20,-21));
          break;
        default:
      }
      createCrown();
      pop();
      break;
    case 7:
      //XO crown
      xP1 = canDi*0.29;
      xP3 = xP1+canDi*0.475;
      yP1 = rndNum(canDi*0.25,canDi*0.265);
      yP2 = yP1-rndNum(canDi*0.1,canDi*0.15);
      push();
      switch (rotationChoice) {
        case 1:
          translate(canDi*0.015,canDi*0.0048);
          rotate(PI / rndNum(65,85));
          break;
        case 2:
          translate(-canDi*0.015,canDi*0.0048);
          rotate(PI / rndNum(-65,-85));
          break;
        case 3:
          scale(0.85);
          translate(canDi*0.015,canDi*0.1);
          rotate(PI / rndNum(-20,-21));
          break;
        default:
      }
      createCrown(1,logoChoice);
      pop();
      break;
    case 8:
      //ringcrown
      xP1 = canDi*0.32;
      xP3 = xP1+canDi*0.415;
      rectWidth = canDi*0.415;
      yP1 = rndNum(canDi*0.2,canDi*0.215);
      yP2 = yP1-rndNum(canDi*0.1,canDi*0.15);
      push();
      switch (rotationChoice) {
        case 1:
          translate(canDi*0.075,-canDi*0.075);
          rotate(PI / rndNum(20,25));
          break;
        case 2:
          translate(-canDi*0.1,canDi*0.15);
          rotate(PI / rndNum(-10,-12));
          break;
        case 3:
          scale(0.85);
          translate(canDi*0.015,canDi*0.1);
          rotate(PI / rndNum(-20,-21));
          break;
        default:
      }
      createCrown(2);
      pop();
      break;
    case 9:
      //bg crown
      xP1 = canDi*0.4;
      xP3 = xP1+canDi*0.175;
      yP1 = rndNum(canDi*0.15,canDi*0.2);
      yP2 = yP1-rndNum(canDi*0.05,canDi*0.1);
      push();
      switch (rotationChoice) {
        case 1:
          translate(canDi*0.25,-canDi*0.1);
          rotate(PI / rndNum(8,10));
          break;
        case 2:
          translate(-canDi*0.1,canDi*0.2);
          rotate(PI / rndNum(-8,-10));
          break;
        default:
      }
      stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      strokeWeight(canDi*0.003);
      triangle(xP1,yP2,xP1,yP1,xP1+canDi*0.05,yP1);
      triangle(xP1+canDi*0.0875,yP2,xP1+canDi*0.05,yP1,xP3-canDi*0.05,yP1);
      triangle(xP3,yP2,xP3,yP1,xP3-canDi*0.05,yP1);
      rect(xP1,yP1,canDi*0.175,canDi*0.1,0,0,canDi*0.0146,canDi*0.0146);
      //shifting line strokes
      let smallRedCrownOutline = rndArr([0,1]);
      switch (smallRedCrownOutline) {
        case 0:
          stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
          break;
        case 1:
          stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
          break;

      }

      noFill();
      strokeWeight(rndNum(canDi*0.005,canDi*0.009));
      beginShape();
      vertex(xP1,yP2);
      vertex(xP1,yP2);
      vertex(xP1,yP1+canDi*0.1);
      vertex(xP3,yP1+canDi*0.1);
      vertex(xP3,yP2);
      vertex(xP3-canDi*0.05,yP1);
      vertex(xP1+canDi*0.0875,yP2);
      vertex(xP1+canDi*0.05,yP1);
      vertex(xP1,yP2);
      vertex(xP1,yP2);
      endShape();
      pop();
      break;
    case 10:
      //small bright crown
      xP1 = canDi*0.4;
      xP3 = xP1+canDi*0.175;
      yP1 = rndNum(canDi*0.15,canDi*0.2);
      yP2 = yP1-rndNum(canDi*0.05,canDi*0.1);
      push();
      switch (rotationChoice) {
        case 1:
          translate(canDi*0.25,-canDi*0.1);
          rotate(PI / rndNum(8,10));
          break;
        case 2:
          translate(-canDi*0.1,canDi*0.2);
          rotate(PI / rndNum(-8,-10));
          break;
        default:
      }
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      strokeWeight(canDi*0.003);
      triangle(xP1,yP2,xP1,yP1,xP1+canDi*0.05,yP1);
      triangle(xP1+canDi*0.0875,yP2,xP1+canDi*0.05,yP1,xP3-canDi*0.05,yP1);
      triangle(xP3,yP2,xP3,yP1,xP3-canDi*0.05,yP1);
      rect(xP1,yP1,canDi*0.175,canDi*0.1,0,0,canDi*0.0146,canDi*0.0146);
      strokeWeight(canDi*0.0098);
      stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
      strokeWeight(rndNum(canDi*0.0125,canDi*0.0239));
      switch(logoChoice) {
        case 0:
          noFill();
          ellipse(canDi*0.49,yP1+canDi*0.045,rndNum(canDi*0.05,canDi*0.065),rndNum(canDi*0.065,canDi*0.085));
          teamChoice = 'O';
          break;
        case 1:
          line(xP1+canDi*0.05,yP1+rndNum(canDi*0.01,canDi*0.025),xP1+canDi*0.125,yP1+rndNum(canDi*0.085,canDi*0.095));
          line(xP1+canDi*0.125,yP1+rndNum(canDi*0.01,canDi*0.035),xP1+canDi*0.05,yP1+rndNum(canDi*0.085,canDi*0.095));
          teamChoice = 'X';
          break;
      }
      pop();
      break;
    case 11:
      //small black crown
      xP1 = canDi*0.4;
      xP3 = xP1+canDi*0.175;
      yP1 = rndNum(canDi*0.15,canDi*0.2);
      yP2 = yP1-rndNum(canDi*0.05,canDi*0.1);
      push();
      switch (rotationChoice) {
        case 1:
          translate(canDi*0.25,-canDi*0.1);
          rotate(PI / rndNum(8,10));
          break;
        case 2:
          translate(-canDi*0.1,canDi*0.2);
          rotate(PI / rndNum(-8,-10));
          break;
        default:
      }
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      strokeWeight(canDi*0.003);
      triangle(xP1,yP2,xP1,yP1,xP1+canDi*0.05,yP1);
      triangle(xP1+canDi*0.0875,yP2,xP1+canDi*0.05,yP1,xP3-canDi*0.05,yP1);
      triangle(xP3,yP2,xP3,yP1,xP3-canDi*0.05,yP1);
      rect(xP1,yP1,canDi*0.175,canDi*0.1,0,0,canDi*0.0146,canDi*0.0146);
      //shifting line strokes
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      noFill();
      strokeWeight(rndNum(canDi*0.005,canDi*0.009));
      beginShape();
      vertex(xP1,yP2);
      vertex(xP1,yP2);
      vertex(xP1,yP1+canDi*0.1);
      vertex(xP3,yP1+canDi*0.1);
      vertex(xP3,yP2);
      vertex(xP3-canDi*0.05,yP1);
      vertex(xP1+canDi*0.0875,yP2);
      vertex(xP1+canDi*0.05,yP1);
      vertex(xP1,yP2);
      vertex(xP1,yP2);
      endShape();
      iterator = 0;
      for (let headStrokes = 0; headStrokes < 12; headStrokes++) {
        line(canDi*0.4+iterator,yP1+canDi*0.1,canDi*0.4+iterator,rndNum(yP1,yP1+canDi*0.05));
        iterator = iterator + canDi*0.015;
      }
      pop();
      break;
    case 12:
      //guard hat
      if (colourChoice === 7) {
        hornsChoice = rndNum(0,10);
      } else {
      }
      xP1 = canDi*0.7425;
      yP1 = rndNum(canDi*0.375,canDi*0.45);
      push();
      switch (rotationChoice) {
        case 1:
          translate(canDi*0.015,canDi*0.0048);
          rotate(PI / rndNum(65,85));
          break;
        case 2:
          translate(-canDi*0.015,canDi*0.0048);
          rotate(PI / rndNum(-65,-85));
          break;
        default:
      }
      stroke(colPal.base[0],colPal.base[1],colPal.base[2]);
      fill(colPal.base[0],colPal.base[1],colPal.base[2]);
      switch (hornsChoice) {
        case 1:
          specialTrait = "grand poobah";
          strokeWeight(canDi*0.015);
          beginShape();
          vertex(canDi*0.83,canDi*0.2);
          vertex(canDi*0.83,canDi*0.2);
          curveVertex(canDi*0.85,canDi*0.3);
          curveVertex(canDi*0.8,canDi*0.39);
          curveVertex(canDi*0.7,canDi*0.4);
          curveVertex(canDi*0.7,canDi*0.3);
          curveVertex(canDi*0.8,canDi*0.3);
          curveVertex(canDi*0.83,canDi*0.265);
          vertex(canDi*0.83,canDi*0.2);
          vertex(canDi*0.83,canDi*0.2);
          endShape();
          break;
        default:
      }
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      strokeWeight(rndNum(canDi*0.0325,canDi*0.0375));
      beginShape();
      curveVertex(canDi*0.28,canDi*0.425);
      curveVertex(canDi*0.28,canDi*0.425);
      curveVertex(canDi*0.425,canDi*0.395);
      curveVertex(canDi*0.575,canDi*0.395);
      curveVertex(canDi*0.74,canDi*0.425);
      curveVertex(canDi*0.76,canDi*0.35);
      curveVertex(canDi*0.73,canDi*0.1);
      curveVertex(canDi*0.3,canDi*0.1);
      curveVertex(canDi*0.28,canDi*0.425);
      curveVertex(canDi*0.28,canDi*0.425);
      endShape();
      strokeWeight(canDi*0.015);
      iterator = 0;
      vertIterator = 0;
      for (var i = 0; i < 30; i++) {
        if (i <= 7) {
          line(canDi*0.29+iterator,canDi*0.095+vertIterator,rndNum(canDi*0.295,canDi*0.315)+iterator,canDi*0.065+vertIterator);
          vertIterator -= canDi*0.0017;
        } else if ((i > 7) && i < 15) {
          line(canDi*0.29+iterator,canDi*0.085+vertIterator,rndNum(canDi*0.295,canDi*0.315)+iterator,canDi*0.065+vertIterator);
          vertIterator -= canDi*0.0025;
        } else if ((i >= 15) && i < 23) {
          line(canDi*0.29+iterator,canDi*0.085+vertIterator,rndNum(canDi*0.295,canDi*0.315)+iterator,canDi*0.065+vertIterator);
          vertIterator += canDi*0.0025;
        } else {
          line(canDi*0.29+iterator,canDi*0.085+vertIterator,rndNum(canDi*0.295,canDi*0.315)+iterator,canDi*0.065+vertIterator);
          vertIterator += canDi*0.0045;
        }
        iterator += canDi*0.015;
      }
      if (hornsChoice === 1){
        stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
        strokeWeight(rndNum(canDi*0.0125,canDi*0.0239));
        switch(logoChoice) {
          case 0:
            noFill();
            ellipse(rndNum(canDi*0.66,canDi*0.665),yP1-rndNum(canDi*0.1,canDi*0.125),rndNum(canDi*0.075,canDi*0.1),rndNum(canDi*0.125,canDi*0.15));
            teamChoice = 'O';
            break;
          case 1:
            line(rndNum(canDi*0.6,canDi*0.625),rndNum(canDi*0.25,canDi*0.265),rndNum(canDi*0.7,canDi*0.72),rndNum(canDi*0.355,canDi*0.36));
            line(rndNum(canDi*0.7,canDi*0.72),rndNum(canDi*0.25,canDi*0.265),rndNum(canDi*0.6,canDi*0.625),rndNum(canDi*0.355,canDi*0.36));
            teamChoice = 'X';
            break;
        }
      } else {
        stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
        strokeWeight(rndNum(canDi*0.0125,canDi*0.0239));
        switch(logoChoice) {
          case 0:
            noFill();
            ellipse(rndNum(canDi*0.66,canDi*0.665),yP1-rndNum(canDi*0.1,canDi*0.125),rndNum(canDi*0.075,canDi*0.1),rndNum(canDi*0.125,canDi*0.15));
            teamChoice = 'O';
            break;
          case 1:
            line(rndNum(canDi*0.6,canDi*0.625),rndNum(canDi*0.25,canDi*0.265),rndNum(canDi*0.7,canDi*0.72),rndNum(canDi*0.355,canDi*0.36));
            line(rndNum(canDi*0.7,canDi*0.72),rndNum(canDi*0.25,canDi*0.265),rndNum(canDi*0.6,canDi*0.625),rndNum(canDi*0.355,canDi*0.36));
            teamChoice = 'X';
            break;
        }
      }
      switch (hornsChoice) {
        case 1:
          stroke(colPal.base[0],colPal.base[1],colPal.base[2]);
          fill(colPal.base[0],colPal.base[1],colPal.base[2]);
          strokeWeight(canDi*0.015);
          beginShape();
          vertex(canDi*0.175,canDi*0.175);
          vertex(canDi*0.175,canDi*0.175);
          curveVertex(canDi*0.15,canDi*0.3);
          curveVertex(canDi*0.225,canDi*0.39);
          curveVertex(canDi*0.3,canDi*0.4);
          curveVertex(canDi*0.3,canDi*0.3);
          curveVertex(canDi*0.25,canDi*0.3);
          curveVertex(canDi*0.195,canDi*0.265);
          vertex(canDi*0.175,canDi*0.175);
          vertex(canDi*0.175,canDi*0.175);
          endShape();
          break;
        default:
      }
      pop();
      break;
    case 13:
      strokeWeight(rndNum(canDi*0.0325,canDi*0.0375));
      push();
      switch (rotationChoice) {
        case 1:
          translate(canDi*0.015,canDi*0.0048);
          rotate(PI / rndNum(65,85));
          break;
        case 2:
          translate(-canDi*0.015,canDi*0.0048);
          rotate(PI / rndNum(-65,-85));
          break;
        default:
      }
      xP1 = rndNum(canDi*0.775,canDi*0.8);
      yP1 = rndNum(canDi*0.3,canDi*0.325);
      xP2 = rndNum(canDi*0.725,canDi*0.75);
      yP2 = rndNum(canDi*0.375,canDi*0.385);
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      beginShape();
      curveVertex(canDi*0.325,canDi*0.375);
      curveVertex(canDi*0.325,canDi*0.375);
      curveVertex(canDi*0.35,canDi*0.225);
      curveVertex(canDi*0.475,canDi*0.15);
      curveVertex(rndNum(canDi*0.675,canDi*0.7),rndNum(canDi*0.145,canDi*0.165));
      curveVertex(canDi*0.73,canDi*0.225);
      curveVertex(canDi*0.735,canDi*0.375);
      curveVertex(canDi*0.735,canDi*0.375);
      endShape();
      rect(canDi*0.25,canDi*0.35,canDi*0.2,rndNum(-canDi*0.0175,-canDi*0.025),0,canDi*0.015,canDi*0.05,canDi*0.035);
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.darkaccent[2]);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.darkaccent[2]);
      rect(canDi*0.325,canDi*0.35,canDi*0.42,rndNum(-canDi*0.015,-canDi*0.05));
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      beginShape();
      curveVertex(canDi*0.5,yP2);
      curveVertex(canDi*0.5,yP2);
      curveVertex(xP2+rndNum(canDi*0.0075,canDi*0.015),yP2);
      curveVertex(canDi*0.8,yP1);
      curveVertex(canDi*0.6,yP1+rndNum(canDi*0.0075,canDi*0.015));
      curveVertex(canDi*0.5,yP2);
      curveVertex(canDi*0.5,yP2);
      endShape();
      noFill();
      beginShape();
      curveVertex(canDi*0.25,canDi*0.325);
      curveVertex(canDi*0.25,canDi*0.325);
      curveVertex(canDi*0.3,canDi*0.375);
      curveVertex(xP2,yP2);
      curveVertex(xP1,yP1);
      curveVertex(xP1,yP1);
      endShape();
      pop();
      break;
  }
  function drawHatBrim(facing=0) {
    let bX,bY,bM;
    switch (facing) {
      case 1:
        bX = rndNum(canDi*0.15,canDi*0.175);
        bY = rndNum(canDi*0.425,canDi*0.45);
        break;
      default:
        bX = rndNum(canDi*0.865,canDi*0.89);
        bY = rndNum(canDi*0.4,canDi*0.425);
    }
    if (bY > yP1) {
      bM = 0;
    } else {
      bM = canDi*0.015;
    }
    beginShape();
    switch (facing) {
      case 1:
        curveVertex(xP1,yP1);
        curveVertex(xP1,yP1);
        break;
      default:
        curveVertex(xP1-canDi*0.02,yP1);
        curveVertex(xP1-canDi*0.02,yP1);
    }
    curveVertex(bX-((bX-(xP1-canDi*0.02))/2),bY-((bY-yP1)/2)+bM);
    curveVertex(bX,bY);
    curveVertex(bX,bY);
    endShape();
  }
  function createCrown(crownType=0,logoChoice=0) {
    strokeJoin(ROUND);
    strokeCap(ROUND);
    switch (crownType) {
      case 1:
        stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
        fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
        break;
      case 2:
        stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
        fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
        break;
      default:
        stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
        fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
    }
    strokeWeight(canDi*0.003);
    xP1 = canDi*0.32;
    xP3 = xP1+canDi*0.415;
    pointShift = rndNum(0,canDi*0.065);
    rectWidth = canDi*0.415;
    yP1 = rndNum(canDi*0.2,canDi*0.215);
    yP2 = yP1-rndNum(canDi*0.1,canDi*0.15);
    triangle(xP1,yP2+pointShift,xP1,yP1,xP1+canDi*0.125,yP1);
    triangle(xP1+canDi*0.215,yP2+pointShift,xP1+canDi*0.125,yP1,xP3-canDi*0.125,yP1);
    triangle(xP3,yP2+pointShift,xP3,yP1,xP3-canDi*0.125,yP1);
    rect(xP1,yP1,rectWidth,canDi*0.18,0,0,canDi*0.0146,canDi*0.0146);
    if ([0,2].includes(crownType)) {
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
    } else {
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]+5);
    }
    strokeWeight(rndNum(canDi*0.005,canDi*0.009));
    noFill();
    strokeJoin(ROUND);
    strokeCap(ROUND);
    beginShape();
    vertex(xP1,yP2+pointShift);
    vertex(xP1,yP2+pointShift);
    vertex(xP1,yP1+canDi*0.175);
    vertex(xP3,yP1+canDi*0.175);
    vertex(xP3,yP2+pointShift);
    vertex(xP3-canDi*0.125,yP1);
    vertex(xP1+canDi*0.215,yP2+pointShift);
    vertex(xP1+canDi*0.125,yP1);
    vertex(xP1,yP2+pointShift);
    vertex(xP1,yP2+pointShift);
    endShape();
    switch (crownType) {
      case 1:
        //add X or O
        stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
        strokeWeight(canDi*0.0098);
        stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
        strokeWeight(rndNum(canDi*0.0125,canDi*0.0239));
        switch(logoChoice) {
          case 0:
            noFill();
            ellipse(canDi*0.535,yP1+rndNum(canDi*0.065,canDi*0.085),rndNum(canDi*0.075,canDi*0.1),rndNum(canDi*0.125,canDi*0.15));
            teamChoice = 'O';
            break;
          case 1:
            line(rndNum(canDi*0.475,canDi*0.485),rndNum(canDi*0.23,canDi*0.235),rndNum(canDi*0.575,canDi*0.6),rndNum(canDi*0.335,canDi*0.34));
            line(rndNum(canDi*0.575,canDi*0.6),rndNum(canDi*0.23,canDi*0.235),rndNum(canDi*0.475,canDi*0.485),rndNum(canDi*0.335,canDi*0.34));
            teamChoice = 'X';
            break;
        }
        stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
        break;
      case 2:
        //ring strokes
        stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
        strokeWeight(canDi*0.0058);
        iterator = 0;
        let yChg;
        let expG = canDi*0.0075;
        let ySpace = rndNum(canDi*0.005,canDi*0.015);
        for (var i = 0; i < 9; i++) {
          switch (rndArr([0,1,1])) {
            case 1:
              line(xP1,yP1+canDi*0.18-yChg-iterator,xP1+rectWidth,yP1+canDi*0.18-yChg-iterator);
              break;
            default:
          }
          yChg = pow(3,(i/1024)-canDi*0.0029);
          iterator = iterator + ySpace;
        }

        break;
      default:
        //light shifting line strokes
        stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
        strokeWeight(canDi*0.01);
        let lightCrownLinesChoice = rndArr([0,1,2]);
        switch (lightCrownLinesChoice) {
         case 0:
           tempXRange = [xP1+canDi*0.04,xP1+canDi*0.045];
           iterator = 0;
           for (let step = 0; step < 3; step++) {
               createRandomCurvedLine(tempXRange[0]+iterator,tempXRange[1]+iterator,canDi*0.25,canDi*0.35);
               iterator = iterator  + canDi*0.16;
           }
           break;
         case 1:
           tempXRange = [xP1+canDi*0.04,xP1+canDi*0.045];
           iterator = 0;
           for (let step = 0; step < 4; step++) {
               createRandomCurvedLine(tempXRange[0]+iterator,tempXRange[1]+iterator,canDi*0.25,canDi*0.35);
               iterator = iterator  + canDi*0.11;
           }
           break;
         case 2:
           tempXRange = [xP1+canDi*0.04,xP1+canDi*0.045];
           iterator = 0;
           for (let step = 0; step < 7; step++) {
               createRandomCurvedLine(tempXRange[0]+iterator,tempXRange[1]+iterator,canDi*0.25,canDi*0.35);
               iterator = iterator  + canDi*0.056;
           }
          break;
        }
        strokeWeight(canDi*0.0098);
        iterator = 0;
        for (let headStrokes = 0; headStrokes < 27; headStrokes++) {
          line(xP1+canDi*0.015+iterator,yP1+canDi*0.168,xP1+canDi*0.015+iterator,rndNum(yP1+canDi*0.09,yP1+canDi*0.14));
          iterator = iterator + canDi*0.015;
        }
    }
    strokeJoin(MITER);
    strokeCap(ROUND);
  }
  let hatDescription = {0:'no hat',1:'ball cap',2:'reversed ball cap',3:'headband',4:'fry cook',5:'plain crown',6:'hatch crown',7:'XO crown',8:'ring crown',9:'bg crown',10:'small bright crown',11:'small hatch crown',12:'guard hat/grand poobah',13:'bowler'};
  return hatDescription[hatChoice];
}
function setClothing(clothingChoice,headChoice,colPal,canDi) {
  let xP1,xP2,xP3,yP1,yP2,rectWidth,tempXRange,iterator,detailAmount;
  let shadeChoice = rndArr([0,10]);
  let shadeChoice2 = rndArr([0,10,20]);
  let logoChoice = rndArr([0,1]);
  let rotationChoice = rndArr([0,1,2]);
  switch (headChoice) {
    case 1:
      xP1 = rndNum(canDi*0.44,canDi*0.46);
      xP2 = canDi*0.355;
      xP3 = canDi*0.53;
      yP1 = rndNum(canDi*0.89,canDi*0.905);
      detailAmount = 13;
      break;
    case 2:
      xP1 = rndNum(canDi*0.48,canDi*0.51);
      xP2 = canDi*0.335;
      xP3 = canDi*0.6035;
      yP1 = rndNum(canDi*0.89,canDi*0.905);
      detailAmount = 20;
      break;
    default:
      xP1 = rndNum(canDi*0.43,canDi*0.46);
      xP3 = canDi*0.55;
      xP2 = canDi*0.335;
      yP1 = rndNum(canDi*0.89,canDi*0.905);
      detailAmount = 16;
  }
  strokeWeight(canDi*0.0125);
  switch (clothingChoice) {
    case 0:
      break;
    case 1:
      //t-shirt
      noStroke();
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      beginShape();
      curveVertex(xP2-canDi*0.01,canDi);
      curveVertex(xP2-canDi*0.01,canDi);
      curveVertex(xP2,canDi*0.975);
      curveVertex(xP1-canDi*0.05,yP1+canDi*0.085);
      curveVertex(xP1,yP1+canDi*0.09);
      curveVertex(xP1+canDi*0.05,yP1+canDi*0.085);
      curveVertex(xP3,canDi*0.975);
      curveVertex(xP3+canDi*0.01,canDi);
      curveVertex(xP3+canDi*0.01,canDi);
      endShape();
      noFill();
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      beginShape();
      curveVertex(xP2+canDi*0.015,canDi*0.975);
      curveVertex(xP2+canDi*0.015,canDi*0.975);
      curveVertex(xP2+((xP1-xP2)/2),yP1+canDi*0.089);
      curveVertex(xP1,yP1+canDi*0.092);
      curveVertex(xP1+((xP3-xP1)/2),yP1+canDi*0.089);
      curveVertex(xP3-canDi*0.01,canDi*0.975);
      curveVertex(xP3-canDi*0.01,canDi*0.975);
      endShape();
      break;
    case 2:
      //turtleneck
      noStroke();
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      beginShape();
      curveVertex(xP2,canDi);
      curveVertex(xP2,canDi);
      curveVertex(xP2,canDi*0.89);
      curveVertex(xP1-canDi*0.0575,yP1+((yP1-canDi*0.884)/2));
      curveVertex(xP1,yP1+canDi*0.015);
      curveVertex(xP1+canDi*0.05,yP1+((yP1-canDi*0.884)/2));
      curveVertex(xP3,canDi*0.89);
      curveVertex(xP3,canDi);
      curveVertex(xP3,canDi);
      endShape();
      noFill();
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      beginShape();
      curveVertex(xP2+canDi*0.015,canDi*0.884);
      curveVertex(xP2+canDi*0.015,canDi*0.884);
      curveVertex(xP2+((xP1-xP2)/2),yP1+((yP1-canDi*0.884)/2));
      curveVertex(xP1,yP1+canDi*0.015);
      curveVertex(xP1+((xP3-xP1)/2),yP1+((yP1-canDi*0.884)/2));
      curveVertex(xP3-canDi*0.01,canDi*0.884);
      curveVertex(xP3-canDi*0.01,canDi*0.884);
      endShape();
      if (colPal.compliment[2] > 60) {
          stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]-10);
      } else {
        stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]+10);
      }
      iterator = 0;
      for (var i = 0; i < detailAmount; i++) {
        let yRange;
        if ( i < detailAmount*0.15 || i > detailAmount*0.85 ) {
          yRange = rndNum(canDi*0.91,canDi*0.925);
        } else if (((i >= detailAmount*0.15) && (i <= detailAmount*0.35)) || ((i >= detailAmount*0.65) && (i <= detailAmount*0.85))) {
          yRange = rndNum(canDi*0.935,canDi*0.95);
        } else {
          yRange = rndNum(canDi*0.965,canDi*0.985);
        }
        let x = xP2+canDi*0.006;
        line(x+iterator,canDi,x+iterator,yRange);
        iterator = iterator + canDi*0.0135;
      }
      break;
    case 3:
      //collar shirt
      xP1 = xP2+((xP3-xP2)*0.75);
      stroke(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      fill(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      beginShape();
      curveVertex(xP2-canDi*0.025,canDi);
      curveVertex(xP2-canDi*0.025,canDi);
      curveVertex(xP2-canDi*0.015,canDi*0.9);
      curveVertex(xP2+canDi*0.05,yP1+canDi*0.03);
      curveVertex(xP3-((xP3-xP2)/2),yP1+canDi*0.03);
      curveVertex(xP1-canDi*0.015,canDi);
      curveVertex(xP1-canDi*0.015,canDi);
      endShape();
      beginShape();
      curveVertex(xP3,canDi);
      curveVertex(xP3,canDi);
      curveVertex(xP3+canDi*0.005,canDi*0.9);
      curveVertex(xP3+canDi*0.015,yP1+canDi*0.03);
      curveVertex(xP3+canDi*0.035,canDi);
      curveVertex(xP3+canDi*0.035,canDi);
      endShape();
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      strokeWeight(canDi*0.0085);
      beginShape();
      curveVertex(xP3-((xP3-xP2)/2)+canDi*0.005,yP1+canDi*0.055);
      curveVertex(xP3-((xP3-xP2)/2)+canDi*0.005,yP1+canDi*0.055);
      curveVertex(xP3-((xP3-xP2)/2)-canDi*0.01,yP1+canDi*0.05);
      curveVertex(xP3-((xP3-xP2)/2)-canDi*0.035,canDi);
      curveVertex(xP3-((xP3-xP2)/2)-canDi*0.035,canDi);
      endShape();
      beginShape();
      curveVertex(xP3+canDi*0.005,yP1+canDi*0.03);
      curveVertex(xP3+canDi*0.005,yP1+canDi*0.03);
      curveVertex(xP3+canDi*0.025,canDi);
      curveVertex(xP3+canDi*0.025,canDi);
      endShape();
      noFill();
      beginShape();
      curveVertex(xP2,canDi*0.9);
      curveVertex(xP2,canDi*0.9);
      curveVertex(xP2+canDi*0.055,yP1+canDi*0.03);
      curveVertex(xP3-((xP3-xP2)/2),yP1+canDi*0.03);
      curveVertex(xP1-canDi*0.005,canDi);
      curveVertex(xP1-canDi*0.005,canDi);
      endShape();
      noStroke();
      fill(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      ellipse(xP3-((xP3-xP2)/2)+canDi*0.01,yP1+canDi*0.08,canDi*0.02,canDi*0.03);
      break;
    case 4:
      //zip crew neck
      xP4 = xP2+((xP3-xP2)*0.75);
      noStroke();
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      beginShape();
      curveVertex(xP2,canDi);
      curveVertex(xP2,canDi*0.89);
      curveVertex(xP1-canDi*0.0575,yP1+((yP1-canDi*0.884)/2));
      curveVertex(xP1,yP1+canDi*0.015);
      curveVertex(xP4-canDi*0.007,yP1+((yP1-canDi*0.86)/2));
      curveVertex(xP4-canDi*0.007,canDi);
      endShape(CLOSE);
      beginShape();
      curveVertex(xP4+canDi*0.007,canDi);
      curveVertex(xP4+canDi*0.007,yP1+((yP1-canDi*0.86)/2));
      curveVertex(xP3,canDi*0.89);
      curveVertex(xP3,canDi);
      endShape(CLOSE);
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      strokeWeight(canDi*0.015);
      line(xP4,yP1+canDi*0.02,xP4,canDi+canDi*0.05);
      stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      strokeWeight(canDi*0.005);
      iterator = 0
      for (var i = 0; i < 8; i++) {
        point(xP4,yP1+canDi*0.02+iterator);
        iterator = iterator + canDi*0.012;
      }
      fill(colPal.outline[0],colPal.outline[1],colPal.outline[2]+10);
      noStroke();
      rect(xP4-canDi*0.005,yP1+canDi*0.02,canDi*0.005,canDi*0.05);
      rect(xP4-canDi*0.005,yP1+canDi*0.02,canDi*0.015,canDi*0.025);
      rect(xP4+canDi*0.005,yP1+canDi*0.02,canDi*0.005,canDi*0.05);
      rect(xP4-canDi*0.005,yP1+canDi*0.06,canDi*0.015,canDi*0.01);
      break;
  }
  let clothingDescription = {0:'no clothes',1:'t-shirt',2:'turtleneck',3:'collared',4:'fry cook',5:'plain crown',6:'gold crown',7:'black crown',8:'red crown',9:'small red crown',10:'small black crown',11:'small gold crown',12:'guard hat/grand poobah',13:'bowler'};
  return clothingDescription[clothingChoice];
}
function setClothingBack(clothingChoice,headChoice,colPal,canDi) {
  let xP1,xP2,xP3,yP1,yP2,rectWidth,tempXRange,iterator;
  let shadeChoice = rndArr([0,10]);
  let shadeChoice2 = rndArr([0,10,20]);
  let logoChoice = rndArr([0,1]);
  let rotationChoice = rndArr([0,1,2]);
  if (headChoice === 2) {
    xP1 = rndNum(canDi*0.48,canDi*0.51);
    xP2 = canDi*0.335;
    xP3 = canDi*0.6035;
    yP1 = rndNum(canDi*0.89,canDi*0.905);
  } else if (headChoice === 1) {
    xP1 = rndNum(canDi*0.44,canDi*0.46);
    xP2 = canDi*0.355;
    xP3 = canDi*0.53;
    yP1 = rndNum(canDi*0.89,canDi*0.905);
  } else {
    xP1 = rndNum(canDi*0.43,canDi*0.46);
    xP2 = canDi*0.335;
    xP3 = canDi*0.55;
    yP1 = rndNum(canDi*0.89,canDi*0.905);
  }
  strokeWeight(canDi*0.0095);
  switch (clothingChoice) {
    case 0:
      break;
    case 1:
      //t-shirt
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      beginShape();
      curveVertex(xP2-canDi*0.01,canDi);
      curveVertex(xP2-canDi*0.01,canDi);
      curveVertex(xP2,canDi*0.96);
      curveVertex(xP1,canDi*0.96);
      curveVertex(xP3,canDi*0.96);
      curveVertex(xP3+canDi*0.01,canDi);
      curveVertex(xP3+canDi*0.01,canDi);
      endShape();
      break;
    case 2:
      //turtleneck
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      beginShape();
      curveVertex(xP2,canDi);
      curveVertex(xP2,canDi);
      curveVertex(xP2,canDi*0.87);
      curveVertex(xP1,yP1-canDi*0.0095);
      curveVertex(xP3,canDi*0.87);
      curveVertex(xP3,canDi);
      curveVertex(xP3,canDi);
      endShape();
      break;
    case 3:
      //collared
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      fill(colPal.mask[0],colPal.mask[1],colPal.mask[2]);
      beginShape();
      curveVertex(xP2-canDi*0.035,canDi);
      curveVertex(xP2-canDi*0.035,canDi);
      curveVertex(xP2-canDi*0.025,canDi*0.885);
      curveVertex(xP1-canDi*0.05,yP1-canDi*0.0095);
      curveVertex(xP1,yP1);
      curveVertex(xP1+canDi*0.05,yP1-canDi*0.0095);
      curveVertex(xP3+canDi*0.01,canDi*0.885);
      curveVertex(xP3+canDi*0.05,canDi);
      curveVertex(xP3+canDi*0.05,canDi);
      endShape();
      break;
    case 4:
      //zip crew
      stroke(colPal.outline[0],colPal.outline[1],colPal.outline[2]);
      fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
      beginShape();
      curveVertex(xP2,canDi);
      curveVertex(xP2,canDi);
      curveVertex(xP2,canDi*0.87);
      curveVertex(xP1,yP1-canDi*0.0095);
      curveVertex(xP3,canDi*0.87);
      curveVertex(xP3,canDi);
      curveVertex(xP3,canDi);
      endShape();
      break;
  }
}

function canvasToImage(c){
  return new Promise(resolve=>{
    loadImage(c.toDataURL(),(res)=>{
      resolve(res)
    })
  })
}

function createMaskNoise(fiberNum=15000,xRange=[0,canDi],yRange=[0,canDi],strokeSize=canDi*0.0085,colourValue=100,opacityType=0) {
  for (let i = 0; i < fiberNum; i++) {
    let x1 = rndNum(xRange[0],xRange[1]);
    let y1 = rndNum(yRange[0],yRange[1]);
    let theta = parseInt(rndNum(0,canDi*oneValue)) * parseInt(canDi*0.0019) * canDi*pieValue;
    let segmentLength = rndArr([canDi*0.0009,canDi*0.0019]) * canDi*0.0048 + canDi*0.0019;
    let x2 = segmentLength + x1;
    let y2 = y1;
    switch (opacityType) {
      case 0:
        stroke(0,0,colourValue,rndArr([0.65,0.75,0.85]));
        break;
      case 1:
        stroke(0,0,colourValue,rndArr([0.10,0.30,0.50]));
        break;
    }
    strokeWeight(strokeSize);
    point(x1,y1);
  }
}
function createFibers(fiberNum,xRange=[0,canDi],yRange=[0,canDi],color1,color2,color3) {
  for (let i = 0; i < fiberNum; i++) {
    let x1 = rndNum(xRange[0],xRange[1]);
    let y1 = rndNum(yRange[0],yRange[1]);
    let theta = parseInt(rndNum(0,canDi*oneValue)) * parseInt(canDi*0.0019) * canDi*pieValue;
    let segmentLength = rndArr([canDi*0.0009,canDi*0.0019]) * canDi*0.0048 + canDi*0.0019;
    let x2 = x1;
    let y2 = y1 + segmentLength;
    stroke(color1,color2,color3);
    strokeWeight(canDi*0.005);
    line(x1,y1,x2,y2);
  }
}
function createRandomCurvedLine(xRangeStart,xRangeEnd,yRangeStart,yRangeEnd) {
  let yMidPoint = yRangeEnd-((yRangeEnd-yRangeStart)/2);
  let halfwayMidPoint = yMidPoint -((yMidPoint-yRangeStart)/2);
  let halfwayEndPoint = yRangeEnd -((yRangeEnd-yMidPoint)/2);
  let randomFactor = rndNum(-(yMidPoint/4),(yMidPoint/4));
  let coords = [rndNum(xRangeStart,xRangeEnd),yRangeStart,rndNum(xRangeStart,xRangeEnd),halfwayMidPoint,rndNum(xRangeStart,xRangeEnd),yMidPoint,rndNum(xRangeStart,xRangeEnd),halfwayEndPoint,rndNum(xRangeStart,xRangeEnd),yRangeEnd]
  noFill();
  beginShape();
  curveVertex(coords[0],coords[1]);
  curveVertex(coords[0],coords[1]);
  curveVertex(coords[2],coords[3]);
  curveVertex(coords[4],coords[5]);
  curveVertex(coords[6],coords[7]);
  curveVertex(coords[8],coords[9]);
  curveVertex(coords[8],coords[9]);
  endShape();
}
function createZombieDrool(xRangeStart,xRangeEnd,yRangeStart,yRangeEnd) {
  let yMidPoint = yRangeEnd-((yRangeEnd-yRangeStart)/2);
  let halfwayMidPoint = yMidPoint -((yMidPoint-yRangeStart)/2);
  let halfwayEndPoint = yRangeEnd -((yRangeEnd-yMidPoint)/2);
  let randomFactor = rndNum(-(yMidPoint/4),(yMidPoint/4));
  let coords = [rndNum(xRangeStart,xRangeEnd),yRangeStart,rndNum(xRangeStart,xRangeEnd),halfwayMidPoint,rndNum(xRangeStart,xRangeEnd),yMidPoint,rndNum(xRangeStart,xRangeEnd),halfwayEndPoint,rndNum(xRangeStart,xRangeEnd),yRangeEnd]
  noFill();
  beginShape();
  curveVertex(coords[0],coords[1]);
  curveVertex(coords[0],coords[1]);
  curveVertex(coords[2],coords[3]);
  curveVertex(coords[4],coords[5]);
  curveVertex(coords[6],coords[7]);
  curveVertex(coords[8],coords[9]);
  curveVertex(coords[8],coords[9]);
  endShape();
}
function createDreadHair(xP1,yP1,dreadThickness,hairColour,hairHighlight) {
  let dreadLength = rndNum(canDi*0.1,canDi*0.15);
  if (xP1 > canDi*0.48 && xP1< canDi*0.52) {
    xP3 = xP1+rndArr([-canDi*0.075,canDi*0.075]);
    xP2 = (xP1-xP3)/2+xP3;
    yP3 = yP1-dreadLength;
    yP2 = yP1-(dreadLength/2)-canDi*0.015;
  } else if (xP1 <= canDi*0.48) {
    xP3 = xP1-rndNum(canDi*0.12,canDi*0.15);
    xP2 = (xP1-xP3)/2+xP3;
    yP3 = yP1-dreadLength;
    yP2 = yP1-(dreadLength/2)-canDi*0.015;
  } else {
    xP3 = xP1+rndNum(canDi*0.12,canDi*0.15);
    xP2 = (xP1-xP3)/2+xP3;
    yP3 = yP1-dreadLength;
    yP2 = yP1-(dreadLength/2)-canDi*0.015;
  }
  stroke(hairColour[0],hairColour[1],hairColour[2]);
  strokeWeight(dreadThickness);
  noFill();
  beginShape();
  curveVertex(xP1,yP1);
  curveVertex(xP1,yP1);
  curveVertex(xP2,yP2);
  curveVertex(xP3,yP3);
  curveVertex(xP3,yP3);
  endShape();

  stroke(hairHighlight[0],hairHighlight[1],hairHighlight[2]);
  strokeWeight(dreadThickness/8);
  beginShape();
  curveVertex(xP1+rndNum(-canDi*0.025,canDi*0.025),yP1+rndNum(-canDi*0.025,canDi*0.025));
  curveVertex(xP1+rndNum(-canDi*0.025,canDi*0.025),yP1+rndNum(-canDi*0.025,canDi*0.025));
  curveVertex(xP2+rndNum(-canDi*0.025,canDi*0.025),yP2+rndNum(-canDi*0.025,canDi*0.025));
  curveVertex(xP3+rndNum(-canDi*0.025,canDi*0.025),yP3+rndNum(-canDi*0.025,canDi*0.025));
  curveVertex(xP3+rndNum(-canDi*0.025,canDi*0.025),yP3+rndNum(-canDi*0.025,canDi*0.025));
  endShape();
}
function createBadHair(xP1,yP1,dreadThickness,hairColour,hairHighlight) {
  let dreadLength = rndNum(canDi*0.1,canDi*0.15);
  if (xP1 >= canDi*0.55) {
    xP3 = xP1+rndArr([canDi*0.075,canDi*0.095]);
    xP2 = (xP1-xP3)/2+xP3;
    yP3 = yP1-dreadLength;
    yP2 = yP1-(dreadLength/2)-canDi*0.015;
  } else if (xP1 < canDi*0.55 && xP1 > canDi*0.45) {
    xP3 = xP1+rndNum(-canDi*0.12,canDi*0.15);
    xP2 = (xP1-xP3)/2+xP3;
    yP3 = yP1-dreadLength;
    yP2 = yP1-(dreadLength/2)-canDi*0.015;
  } else {
    xP3 = xP1-rndNum(canDi*0.12,canDi*0.15);
    xP2 = (xP1-xP3)/2+xP3;
    yP3 = yP1-dreadLength;
    yP2 = yP1-(dreadLength/2)-canDi*0.015;
  }
  stroke(hairColour[0],hairColour[1],hairColour[2]);
  strokeWeight(dreadThickness);
  noFill();
  beginShape();
  curveVertex(xP1,yP1);
  curveVertex(xP1,yP1);
  curveVertex(xP2,yP2);
  curveVertex(xP3,yP3);
  curveVertex(xP3,yP3);
  endShape();

  stroke(hairHighlight[0],hairHighlight[1],hairHighlight[2]);
  strokeWeight(dreadThickness/8);
  beginShape();
  curveVertex(xP1+rndNum(-canDi*0.05,canDi*0.05),yP1+rndNum(-canDi*0.05,canDi*0.05));
  curveVertex(xP1+rndNum(-canDi*0.05,canDi*0.05),yP1+rndNum(-canDi*0.05,canDi*0.05));
  curveVertex(xP2+rndNum(-canDi*0.05,canDi*0.05),yP2+rndNum(-canDi*0.05,canDi*0.05));
  curveVertex(xP3+rndNum(-canDi*0.05,canDi*0.05),yP3+rndNum(-canDi*0.05,canDi*0.05));
  curveVertex(xP3+rndNum(-canDi*0.05,canDi*0.05),yP3+rndNum(-canDi*0.05,canDi*0.05));
  endShape();
}
function drawShaggyHair(xRange=[canDi*0.35,canDi*0.65],yRange=[canDi*0.22,canDi*0.35],seedCount=200){
  for (var i = 0; i < seedCount; i++) {
    let xP2,xP3,yP2,yP3;
    let xP1 = rndNum(xRange[0],xRange[1]);
    let yP1 = rndNum(yRange[0],yRange[1]);
    if (yP1 < canDi*0.275) {
      yP2 = yP1+rndNum(-canDi*0.05,canDi*0.085);
      yP3 = yP2+rndNum(-canDi*0.09,canDi*0.25);
      if (xP1 > canDi*0.55) {
        xP2 = xP1+rndNum(canDi*0.075,canDi*0.15);
        xP3 = xP2+rndNum(canDi*0.075,canDi*0.15);
      } else if (xP1 > canDi*0.45) {
        xP2 = xP1+rndNum(-canDi*0.15,canDi*0.15);
        xP3 = xP2+rndNum(-canDi*0.15,canDi*0.15);
      } else {
        xP2 = xP1-rndNum(canDi*0.075,canDi*0.15);
        xP3 = xP2-rndNum(canDi*0.075,canDi*0.15);
      }
    } else if (yP1 < canDi*0.3) {
      yP2 = yP1+rndNum(canDi*0.1,canDi*0.15);
      yP3 = yP1+rndNum(canDi*0.3,canDi*0.35);
      if (xP1 > canDi*0.55) {
        xP2 = xP1+rndNum(canDi*0.1,canDi*0.15);
        xP3 = xP2+rndNum(-canDi*0.05,canDi*0.05);
      } else if (xP1 > canDi*0.45) {
        xP2 = xP1+rndNum(-canDi*0.05,canDi*0.05);
        xP3 = xP2+rndNum(-canDi*0.1,canDi*0.1);
      } else {
        xP2 = xP1-rndNum(canDi*0.1,canDi*0.15);
        xP3 = xP2+rndNum(-canDi*0.05,canDi*0.05);
      }
    } else {
      yP2 = yP1+rndNum(canDi*0.2,canDi*0.25);
      yP3 = yP1+rndNum(canDi*0.5,canDi*0.55);
      if (xP1 > canDi*0.55) {
        xP2 = xP1+rndNum(canDi*0.1,canDi*0.15);
        xP3 = xP2+rndNum(-canDi*0.05,canDi*0.05);
      } else if (xP1 > canDi*0.45) {
        xP2 = xP1+rndNum(-canDi*0.05,canDi*0.05);
        xP3 = xP2+rndNum(-canDi*0.1,canDi*0.1);
      } else {
        xP2 = xP1-rndNum(canDi*0.1,canDi*0.15);
        xP3 = xP2+rndNum(-canDi*0.05,canDi*0.05);
      }
    }
    beginShape();
    curveVertex(xP1,yP1);
    curveVertex(xP1,yP1);
    curveVertex(xP2,yP2);
    curveVertex(xP3,yP3);
    curveVertex(xP3,yP3);
    endShape();
  }
}
function createShagDreadsHair(xRange=[canDi*0.35,canDi*0.65],yRange=[canDi*0.225,canDi*0.35],seedCount=25,front=0){
  let dreadThickness = canDi*0.015;
  for (var i = 0; i < seedCount; i++) {
    let xP2,xP3,yP2,yP3;
    let xP1 = rndNum(xRange[0],xRange[1]);
    let yP1 = rndNum(yRange[0],yRange[1]);
    if (xP1 > canDi*0.55) {
      xP2 = xP1+rndNum(canDi*0.1,canDi*0.15);
      yP2 = yP1-rndNum(canDi*0.001,canDi*0.05);
      xP3 = xP2+rndNum(canDi*0.05,canDi*0.075);
      yP3 = yP1+rndNum(canDi*0.225,canDi*0.45);
    } else if (xP1 > canDi*0.45) {
      xP2 = xP1+rndNum(-canDi*0.1,canDi*0.1);
      yP2 = yP1-rndNum(canDi*0.05,canDi*0.05);
      xP3 = xP2;
      yP3 = yP1+canDi*0.6;
    } else {
      xP2 = xP1-rndNum(canDi*0.1,canDi*0.15);
      yP2 = yP1-rndNum(canDi*0.001,canDi*0.05);
      xP3 = xP2-rndNum(canDi*0.05,canDi*0.075);
      yP3 = yP1+rndNum(canDi*0.5,canDi*0.65);
    }
    stroke(hairColourBase);
    strokeWeight(dreadThickness*3);
    noFill();
    if (front === 1) {
      if (xP1 <= canDi*0.425 || xP1 >= canDi*0.6) {
        beginShape();
        curveVertex(xP1,yP1);
        curveVertex(xP1,yP1);
        curveVertex(xP2,yP2);
        curveVertex(xP3+rndNum(-canDi*0.075,canDi*0.075),yP3-rndNum(canDi*0.175,canDi*0.25));
        curveVertex(xP3,yP3);
        curveVertex(xP3,yP3);
        endShape();
        stroke(colPal.compliment[0],colPal.mask[1],colPal.mask[2]);
        strokeWeight(dreadThickness);
        beginShape();
        curveVertex(xP1+rndNum(-canDi*0.025,canDi*0.025),yP1+rndNum(-canDi*0.025,canDi*0.025));
        curveVertex(xP1+rndNum(-canDi*0.025,canDi*0.025),yP1+rndNum(-canDi*0.025,canDi*0.025));
        curveVertex(xP2+rndNum(-canDi*0.025,canDi*0.025),yP2+rndNum(-canDi*0.025,canDi*0.025));
        curveVertex(xP3+rndNum(-canDi*0.075,canDi*0.075),yP3-rndNum(canDi*0.175,canDi*0.25));
        curveVertex(xP3+rndNum(-canDi*0.025,canDi*0.025),yP3+rndNum(-canDi*0.025,canDi*0.025));
        curveVertex(xP3+rndNum(-canDi*0.025,canDi*0.025),yP3+rndNum(-canDi*0.025,canDi*0.025));
        endShape();
      }
    } else {
      beginShape();
      curveVertex(xP1,yP1);
      curveVertex(xP1,yP1);
      curveVertex(xP2,yP2);
      curveVertex(xP3+rndNum(-canDi*0.075,canDi*0.075),yP3-rndNum(canDi*0.175,canDi*0.25));
      curveVertex(xP3,yP3);
      curveVertex(xP3,yP3);
      endShape();
      stroke(colPal.compliment[0],colPal.mask[1],colPal.mask[2]);
      strokeWeight(dreadThickness);
      beginShape();
      curveVertex(xP1+rndNum(-canDi*0.025,canDi*0.025),yP1+rndNum(-canDi*0.025,canDi*0.025));
      curveVertex(xP1+rndNum(-canDi*0.025,canDi*0.025),yP1+rndNum(-canDi*0.025,canDi*0.025));
      curveVertex(xP2+rndNum(-canDi*0.025,canDi*0.025),yP2+rndNum(-canDi*0.025,canDi*0.025));
      curveVertex(xP3+rndNum(-canDi*0.075,canDi*0.075),yP3-rndNum(canDi*0.175,canDi*0.25));
      curveVertex(xP3+rndNum(-canDi*0.025,canDi*0.025),yP3+rndNum(-canDi*0.025,canDi*0.025));
      curveVertex(xP3+rndNum(-canDi*0.025,canDi*0.025),yP3+rndNum(-canDi*0.025,canDi*0.025));
      endShape();
    }
  }
}
function createStraightHair(xP1,yP1,hairLength=2,highlight=0) {
  switch (hairLength) {
    case 0:
    hXCoords = [rndNum(canDi*0.05,canDi*0.075),rndNum(canDi*0.06,canDi*0.012)];
    hYCoords = [rndNum(canDi*0.05,canDi*0.075),rndNum(canDi*0.35,canDi*0.375)];
      break;
    case 1:
      hXCoords = [rndNum(-canDi*0.02,canDi*0.02),rndNum(-canDi*0.06,canDi*0.06)];
      hYCoords = [rndNum(canDi*0.25,canDi*0.3),rndNum(canDi*0.15,canDi*0.175)];
      break;
    case 2:
    hXCoords = [rndNum(-canDi*0.05,canDi*0.05),rndNum(-canDi*0.09,canDi*0.09)];
    hYCoords = [rndNum(canDi*0.5,canDi*0.75),rndNum(canDi*0.25,canDi*0.275)];
      break;
  }
  let xP2 = xP1+hXCoords[0];
  let xP3 = xP2+hXCoords[1];
  let yP2 = yP1+hYCoords[0];
  let yP3 = yP2+hYCoords[1];
  noFill();
  beginShape();
  switch (highlight) {
    case 0:
      curveVertex(xP1,yP1);
      break;
    case 1:
      let xPShift = rndNum(canDi*0.01,canDi*0.1);
      let xPShift2 = xPShift+rndNum(canDi*0.085,canDi*0.185);
      curveVertex(xP1+xPShift2,yP1-canDi*0.175);
      curveVertex(xP1+xPShift2,yP1-canDi*0.175);
      curveVertex(xP1+xPShift,yP1-canDi*0.125);
      break;
  }
  curveVertex(xP1,yP1);
  curveVertex(xP2,yP2);
  curveVertex(xP3,yP3);
  curveVertex(xP3,yP3);
  endShape();
}
function createCurlyHair(xP1,yP1,hairLength=2,highlight=0) {
  let xP2,xP3,xP4,yP2,yP3,yP4,hCoords;
  switch (hairLength) {
    case 0:
      break;
    case 1:
      hXCoords = [rndNum(canDi*0.09,canDi*0.115),rndNum(canDi*0.03,canDi*0.05),rndNum(canDi*0.03,canDi*0.05)];
      hYCoords = [rndNum(canDi*0.125,canDi*0.175),rndNum(canDi*0.115,canDi*0.125),rndNum(canDi*0.1,canDi*0.115)];
      break;
    case 2:
      hXCoords = [rndNum(canDi*0.09,canDi*0.115),rndNum(canDi*0.09,canDi*0.115),rndNum(canDi*0.06,canDi*0.1)];
      hYCoords = [rndNum(canDi*0.125,canDi*0.175),rndNum(canDi*0.15,canDi*0.165),rndNum(canDi*0.15,canDi*0.165)];
      break;
  }
  if (xP1 < canDi*0.5) {
    xP2 = xP1-hXCoords[0];
    xP3 = xP2+hXCoords[1];
    xP4 = xP3-hXCoords[2];
    yP2 = yP1+hYCoords[0];
    yP3 = yP2+hYCoords[1];
    yP4 = yP3+hYCoords[2];
  } else if (xP1 < canDi*0.6) {
    xP2 = xP1+(hXCoords[0]/2);
    xP3 = xP2-(hXCoords[1]/2);
    xP4 = xP3+(hXCoords[2]/2);
    yP2 = yP1+hYCoords[0];
    yP3 = yP2+hYCoords[1];
    yP4 = yP3+hYCoords[2];
  } else {
    xP2 = xP1+hXCoords[0];
    xP3 = xP2-hXCoords[1];
    xP4 = xP3+hXCoords[2];
    yP2 = yP1+hYCoords[0];
    yP3 = yP2+hYCoords[1];
    yP4 = yP3+hYCoords[2];
  }
  switch (highlight) {
    case 0:
      strokeWeight(canDi*0.025);
      break;
    case 1:
      strokeWeight(canDi*0.0085);
      break;
  }
  beginShape();
  switch (highlight) {
    case 0:
      curveVertex(xP1,yP1);
      break;
    case 1:
      let xPShift = rndNum(canDi*0.085,canDi*0.185);
      let xPShift2 = rndNum(canDi*0.085,canDi*0.185);
      curveVertex(xP1+xPShift2,yP1-canDi*0.175);
      curveVertex(xP1+xPShift2,yP1-canDi*0.175);
      curveVertex(xP1+xPShift,yP1-canDi*0.125);
      curveVertex(xP1+xPShift/2,yP1-canDi*0.075);
      break;
  }
  curveVertex(xP1,yP1);
  curveVertex(xP2,yP2);
  curveVertex(xP3,yP3);
  curveVertex(xP4,yP4);
  curveVertex(xP4,yP4);
  endShape();
  switch (highlight) {
    case 0:
      strokeWeight(canDi*0.15);
      point(xP2,yP2);
      point(xP3,yP3);
      point(xP4,yP4);
      break;
    case 1:
      break;
  }
}
function createCurlyHairHighlight(xP1,yP1,hairLength=2) {
  let xP2,xP3,xP4,yP2,yP3,yP4;
  switch (hairLength) {
    case 0:
      break;
    case 1:
      hXCoords = [rndNum(canDi*0.09,canDi*0.115),rndNum(canDi*0.03,canDi*0.05),rndNum(canDi*0.03,canDi*0.05)];
      hYCoords = [rndNum(canDi*0.125,canDi*0.175),rndNum(canDi*0.115,canDi*0.125),rndNum(canDi*0.1,canDi*0.115)];
      break;
    case 2:
      hXCoords = [rndNum(canDi*0.085,canDi*0.125),rndNum(canDi*0.065,canDi*0.1),rndNum(canDi*0.06,canDi*0.1)];
      hYCoords = [rndNum(canDi*0.125,canDi*0.175),rndNum(canDi*0.15,canDi*0.165),rndNum(canDi*0.15,canDi*0.165)];
      break;
  }

  xP2 = xP1-hXCoords[0];
  xP3 = xP2+hXCoords[1];
  xP4 = xP3-hXCoords[2];
  yP2 = yP1+hYCoords[0];
  yP3 = yP2+hYCoords[1];
  yP4 = yP3+hYCoords[2];

  let xPShift = rndNum(canDi*0.075,canDi*0.125);
  beginShape();
  curveVertex(xP1+xPShift,yP1-canDi*0.125);
  curveVertex(xP1+xPShift,yP1-canDi*0.125);
  curveVertex(xP1+xPShift/2,yP1-canDi*0.075);
  curveVertex(xP1,yP1);
  curveVertex(xP2,yP2);
  curveVertex(xP3,yP3);
  curveVertex(xP4,yP4);
  curveVertex(xP4,yP4);
  endShape();
}
function createMohawkHair(xP1,yP1) {
  let xP2,xP3,xP4,yP2,yP3,yP4;
  if (xP1 > canDi*0.575) {
    xP2 = xP1+rndNum(canDi*0.045,canDi*0.065);
    xP3 = xP2+rndNum(canDi*0.01,canDi*0.05);
    yP2 = yP1-rndNum(canDi*0.075,canDi*0.085);
    yP3 = yP2-rndNum(canDi*0.075,canDi*0.085);
  } else if (xP1 > canDi*0.52) {
    xP2 = xP1+rndNum(canDi*0.015,canDi*0.025);
    xP3 = xP2+rndNum(canDi*0.005,canDi*0.01);
    yP2 = yP1-rndNum(canDi*0.065,canDi*0.085);
    yP3 = yP2-rndNum(canDi*0.065,canDi*0.085);
  } else if (xP1 > canDi*0.04){
    xP2 = xP1-rndNum(canDi*0.005,canDi*0.015);
    xP3 = xP2-rndNum(canDi*0.0025,canDi*0.005);
    yP2 = yP1-rndNum(canDi*0.065,canDi*0.075);
    yP3 = yP2-rndNum(canDi*0.05,canDi*0.075);
  } else {
    xP2 = xP1-rndNum(canDi*0.05,canDi*0.075);
    xP3 = xP2-rndNum(canDi*0.05,canDi*0.075);
    yP2 = yP1-rndNum(canDi*0.05,canDi*0.075);
    yP3 = yP2-rndNum(canDi*0.05,canDi*0.05);
  }
  beginShape();
  curveVertex(xP1,yP1);
  curveVertex(xP1,yP1);
  curveVertex(xP2,yP2);
  curveVertex(xP3,yP3);
  curveVertex(xP3,yP3);
  endShape();
  beginShape();
  curveVertex(xP1-canDi*0.035,yP1-canDi*0.015);
  curveVertex(xP1-canDi*0.035,yP1-canDi*0.015);
  curveVertex(xP2-canDi*0.05,yP2-canDi*0.015);
  curveVertex(xP3-canDi*0.05,yP3);
  curveVertex(xP3-canDi*0.05,yP3);
  endShape();
  beginShape();
  curveVertex(xP1-canDi*0.015,yP1);
  curveVertex(xP1-canDi*0.015,yP1);
  curveVertex(xP2-canDi*0.025,yP2-canDi*0.015);
  curveVertex(xP3-canDi*0.025,yP3);
  curveVertex(xP3-canDi*0.025,yP3);
  endShape();
  beginShape();
  curveVertex(xP1+canDi*0.025,yP1+canDi*0.015);
  curveVertex(xP1+canDi*0.025,yP1+canDi*0.015);
  curveVertex(xP2+canDi*0.025,yP2-canDi*0.015);
  curveVertex(xP3+canDi*0.025,yP3+canDi*0.015);
  curveVertex(xP3+canDi*0.025,yP3+canDi*0.015);
  endShape();


}

function drawGXYZ(ofstTxt=0){
  //stroke(0,0,100);
  strokeWeight(canDi*0.035);
  strokeCap(SQUARE);
  noFill();
  function rndMv(){
      return rndNum(-canDi*0.005,canDi*0.005);
  }
  //G
  xCrds = [canDi*0.255+rndMv(),canDi*0.215+rndMv(),canDi*0.145+rndMv(),canDi*0.085+rndMv(),canDi*0.06+rndMv(),
    canDi*0.08+rndMv(),canDi*0.14,canDi*0.205+rndMv(),canDi*0.255+rndMv(),canDi*0.26+rndMv(),canDi*0.175+rndMv()];
  yCrds = [canDi*0.06+ofstTxt+rndMv(),canDi*0.04+ofstTxt+rndMv(),canDi*0.037+ofstTxt+rndMv(),
    canDi*0.075+ofstTxt+rndMv(),canDi*0.15+ofstTxt+rndMv(),canDi*0.22+ofstTxt+rndMv(),
    canDi*0.26+ofstTxt+rndMv(),canDi*0.26+ofstTxt+rndMv(),canDi*0.225+ofstTxt+rndMv(),canDi*0.16+ofstTxt+rndMv(),canDi*0.16+ofstTxt+rndMv()];
  beginShape();
  curveVertex(xCrds[0],yCrds[0]);
  curveVertex(xCrds[0],yCrds[0]);
  curveVertex(xCrds[1],yCrds[1]);
  curveVertex(xCrds[2],yCrds[2]);
  curveVertex(xCrds[3],yCrds[3]);
  curveVertex(xCrds[4],yCrds[4]);
  curveVertex(xCrds[5],yCrds[5]);
  curveVertex(xCrds[6],yCrds[6]);
  curveVertex(xCrds[7],yCrds[7]);
  curveVertex(xCrds[8],yCrds[8]);
  curveVertex(xCrds[9],yCrds[9]);
  curveVertex(xCrds[9],yCrds[9]);
  endShape();
  beginShape(LINES);
  curveVertex(xCrds[9]+canDi*0.0185,yCrds[9]);
  curveVertex(xCrds[10],yCrds[10]);
  endShape();
  //X
  xCrds = [canDi*0.34+rndMv(),canDi*0.49+rndMv()];
  yCrds = [canDi*0.03+ofstTxt+rndMv(),canDi*0.257+ofstTxt+rndMv()];
  beginShape(LINES);
  curveVertex(xCrds[0],yCrds[0]);
  curveVertex(xCrds[1],yCrds[1]);
  endShape();
  beginShape(LINES);
  curveVertex(xCrds[1],yCrds[0]);
  curveVertex(xCrds[0],yCrds[1]);
  endShape();
  //Y
  xCrds = [canDi*0.57+rndMv(),canDi*0.645+rndMv(),canDi*0.725+rndMv()];
  yCrds = [canDi*0.03+ofstTxt+rndMv(),canDi*0.15+ofstTxt+rndMv(),canDi*0.27+ofstTxt+rndMv()];
  beginShape(LINES);
  curveVertex(xCrds[0],yCrds[0]);
  curveVertex(xCrds[1],yCrds[1]);
  endShape();
  beginShape(LINES);
  curveVertex(xCrds[1],yCrds[1]);
  curveVertex(xCrds[2],yCrds[0]);
  endShape();
  beginShape(LINES);
  curveVertex(xCrds[1],yCrds[1]);
  curveVertex(xCrds[1],yCrds[2]);
  endShape();
  //Z
  xCrds = [canDi*0.78+rndMv(),canDi*0.965+rndMv()];
  yCrds = [canDi*0.04+ofstTxt+rndMv(),canDi*0.255+ofstTxt+rndMv()];
  beginShape(LINES);
  curveVertex(xCrds[0],yCrds[0]);
  curveVertex(xCrds[1],yCrds[0]);
  endShape();
  beginShape(LINES);
  curveVertex(xCrds[1]-canDi*0.0125,yCrds[0]+canDi*0.0045);
  curveVertex(xCrds[0],yCrds[1]-canDi*0.0045);
  endShape();
  beginShape(LINES);
  curveVertex(xCrds[0]-canDi*0.0125,yCrds[1]);
  curveVertex(xCrds[1],yCrds[1]);
  endShape();
  strokeCap(ROUND);
}
function drawLetter(ltr='A',xOfst=0,yOfst=0,fontScaleChange=1){
  //stroke(0,0,100);
  strokeWeight(canDi*0.035);
  strokeCap(SQUARE);
  noFill();
  function rndMv(){
      return rndNum(-canDi*0.005,canDi*0.005);
  }
  let ltrSelect = {
    'a':1,
    'b':2,
    'c':3,
    'd':4,
    'e':5,
    'f':6,
    'g':7,
    'h':8,
    'i':9,
    'j':10,
    'k':11,
    'l':12,
    'm':13,
    'n':14,
    'o':15,
    'p':16,
    'q':17,
    'r':18,
    's':19,
    't':20,
    'u':21,
    'v':22,
    'w':23,
    'x':24,
    'y':25,
    'z':26
}
  push();
  scale(fontScaleChange);
  switch (ltrSelect[ltr]) {
    case 1:
      //A
      xCrds = [canDi*0.055+xOfst+rndMv(),canDi*0.2+xOfst+rndMv()];
      yCrds = [canDi*0.04+yOfst+rndMv(),canDi*0.275+yOfst+rndMv()];
      beginShape(LINES);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])*.15),yCrds[1]-((yCrds[1]-yCrds[0])*0.25));
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])*.85),yCrds[1]-((yCrds[1]-yCrds[0])*0.25));
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[0],yCrds[1]);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])/2),yCrds[0]);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])/2),yCrds[0]);
      curveVertex(xCrds[1],yCrds[1]);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])/2),yCrds[0]-canDi*0.0075);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])/2),yCrds[0]+canDi*0.045);
      endShape();
      strokeCap(ROUND);
      break;
    case 2:
      //B
      xCrds = [canDi*0.055+xOfst+rndMv(),canDi*0.2+xOfst+rndMv()];
      yCrds = [canDi*0.04+yOfst+rndMv(),canDi*0.28+yOfst+rndMv()];
      beginShape(LINES);
      curveVertex(xCrds[0],yCrds[0]-canDi*0.0185);
      curveVertex(xCrds[0],yCrds[1]);
      endShape();

      beginShape();
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[0],yCrds[0]);

      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])*.3),yCrds[0]+canDi*0.005);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])*.2),yCrds[1]-((yCrds[1]-yCrds[0])*.8));
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])*.3),yCrds[1]-((yCrds[1]-yCrds[0])*.62));

      curveVertex(xCrds[0],yCrds[1]-((yCrds[1]-yCrds[0])*.6));
      curveVertex(xCrds[0],yCrds[1]-((yCrds[1]-yCrds[0])*.6));
      endShape();

      beginShape();
      curveVertex(xCrds[0],yCrds[1]-((yCrds[1]-yCrds[0])*.6));
      curveVertex(xCrds[0],yCrds[1]-((yCrds[1]-yCrds[0])*.6));

      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])*.2),yCrds[1]-((yCrds[1]-yCrds[0])*.58));
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])*.05),yCrds[1]-((yCrds[1]-yCrds[0])*.4));
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])*.15),yCrds[1]-((yCrds[1]-yCrds[0])*.1));

      curveVertex(xCrds[0],yCrds[1]-canDi*0.0185);
      curveVertex(xCrds[0],yCrds[1]-canDi*0.0185);
      endShape();
      break;
    case 3:
      //C
      xCrds = [
        canDi*0.2+xOfst+rndMv(),
        canDi*0.195+xOfst+rndMv(),canDi*0.14+xOfst+rndMv(),
        canDi*0.08+xOfst+rndMv(),canDi*0.06+xOfst+rndMv(),
        canDi*0.09+xOfst+rndMv(),canDi*0.16+xOfst+rndMv(),
        canDi*0.2+xOfst+rndMv(),canDi*0.21+xOfst+rndMv(),
      ];
      yCrds = [
        canDi*0.09+yOfst+rndMv(),
        canDi*0.06+yOfst+rndMv(),canDi*0.035+yOfst+rndMv(),
        canDi*0.0675+yOfst+rndMv(),canDi*0.15+yOfst+rndMv(),
        canDi*0.245+yOfst+rndMv(),canDi*0.265+yOfst+rndMv(),
        canDi*0.25+yOfst+rndMv(),canDi*0.22+yOfst+rndMv(),
      ];
      strokeCap(SQUARE);
      strokeJoin(ROUND);
      beginShape();
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[1],yCrds[1]);
      curveVertex(xCrds[2],yCrds[2]);
      curveVertex(xCrds[3],yCrds[3]);
      curveVertex(xCrds[4],yCrds[4]);
      curveVertex(xCrds[5],yCrds[5]);
      curveVertex(xCrds[6],yCrds[6]);
      curveVertex(xCrds[7],yCrds[7]);
      curveVertex(xCrds[8],yCrds[8]);
      curveVertex(xCrds[8],yCrds[8]);
      endShape();
      strokeCap(SQUARE);
      strokeJoin(MITER);
      break;
    case 4:
      //D
      xCrds = [
        canDi*0.06+xOfst+rndMv(),
        canDi*0.12+xOfst+rndMv(),
        canDi*0.195+xOfst+rndMv(),
        canDi*0.21+xOfst+rndMv(),
        canDi*0.21+xOfst+rndMv(),
        canDi*0.195+xOfst+rndMv(),
        canDi*0.12+xOfst+rndMv(),
        canDi*0.06+xOfst+rndMv(),
      ];
      yCrds = [
        canDi*0.035+yOfst+rndMv(),
        canDi*0.035+yOfst+rndMv(),
        canDi*0.055+yOfst+rndMv(),
        canDi*0.15+yOfst+rndMv(),
        canDi*0.2+yOfst+rndMv(),
        canDi*0.25+yOfst+rndMv(),
        canDi*0.265+yOfst+rndMv(),
        canDi*0.265+yOfst+rndMv(),
      ];
      strokeCap(SQUARE);
      strokeJoin(MITER);
      beginShape();
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[1],yCrds[1]);
      curveVertex(xCrds[2],yCrds[2]);
      curveVertex(xCrds[3],yCrds[3]);
      curveVertex(xCrds[4],yCrds[4]);
      curveVertex(xCrds[5],yCrds[5]);
      curveVertex(xCrds[6],yCrds[6]);
      curveVertex(xCrds[7],yCrds[7]);
      curveVertex(xCrds[7],yCrds[7]);
      endShape();
      beginShape();
      curveVertex(xCrds[0]+canDi*0.019,yCrds[0]-canDi*0.0185);
      curveVertex(xCrds[0]+canDi*0.019,yCrds[7]+canDi*0.0185);
      endShape(CLOSE);
      strokeCap(SQUARE);
      strokeJoin(MITER);
      break;
    case 5:
      //E
      xCrds = [canDi*0.055+xOfst+rndMv(),canDi*0.24+xOfst+rndMv()];
      yCrds = [canDi*0.04+yOfst+rndMv(),canDi*0.255+yOfst+rndMv()];
      beginShape(LINES);
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[1]-canDi*0.0165,yCrds[0]);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[0],yCrds[0]+canDi*0.1);
      curveVertex(xCrds[1]-canDi*0.05,yCrds[0]+canDi*0.1);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[0]+canDi*0.0165,yCrds[0]);
      curveVertex(xCrds[0]+canDi*0.0165,yCrds[1]);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[0],yCrds[1]);
      curveVertex(xCrds[1],yCrds[1]);
      endShape();
      strokeCap(ROUND);
      break;
    case 7:
      //G
      xCrds = [canDi*0.255+xOfst+rndMv(),canDi*0.215+xOfst+rndMv(),canDi*0.145+xOfst+rndMv(),canDi*0.085+xOfst+rndMv(),canDi*0.06+xOfst+rndMv(),
        canDi*0.08+xOfst+rndMv(),canDi*0.14+xOfst+rndMv(),canDi*0.205+xOfst+rndMv(),canDi*0.255+xOfst+rndMv(),canDi*0.26+xOfst+rndMv(),canDi*0.175+xOfst+rndMv()];
      yCrds = [canDi*0.06+yOfst+rndMv(),canDi*0.04+yOfst+rndMv(),canDi*0.037+yOfst+rndMv(),
        canDi*0.075+yOfst+rndMv(),canDi*0.15+yOfst+rndMv(),canDi*0.22+yOfst+rndMv(),
        canDi*0.26+yOfst+rndMv(),canDi*0.26+yOfst+rndMv(),canDi*0.225+yOfst+rndMv(),canDi*0.16+yOfst+rndMv(),canDi*0.16+yOfst+rndMv()];
      beginShape();
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[1],yCrds[1]);
      curveVertex(xCrds[2],yCrds[2]);
      curveVertex(xCrds[3],yCrds[3]);
      curveVertex(xCrds[4],yCrds[4]);
      curveVertex(xCrds[5],yCrds[5]);
      curveVertex(xCrds[6],yCrds[6]);
      curveVertex(xCrds[7],yCrds[7]);
      curveVertex(xCrds[8],yCrds[8]);
      curveVertex(xCrds[9],yCrds[9]);
      curveVertex(xCrds[9],yCrds[9]);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[9]+canDi*0.0185,yCrds[9]);
      curveVertex(xCrds[10],yCrds[10]);
      endShape();
      break;
    case 8:
      //H
      xCrds = [canDi*0.055+xOfst+rndMv(),canDi*0.2+xOfst+rndMv()];
      yCrds = [canDi*0.04+yOfst+rndMv(),canDi*0.255+yOfst+rndMv()];
      beginShape(LINES);
      curveVertex(xCrds[0],yCrds[0]+canDi*0.1);
      curveVertex(xCrds[1]-canDi*0.05,yCrds[0]+canDi*0.1);
      endShape();

      beginShape(LINES);
      curveVertex(xCrds[0]+canDi*0.0165,yCrds[0]);
      curveVertex(xCrds[0]+canDi*0.0165,yCrds[1]);
      endShape();

      beginShape(LINES);
      curveVertex(xCrds[1]-canDi*0.0165,yCrds[0]);
      curveVertex(xCrds[1]-canDi*0.0165,yCrds[1]);
      endShape();
      strokeCap(ROUND);
      break;
    case 9:
      //I
      xCrds = [canDi*0.055+xOfst+rndMv(),canDi*0.24+xOfst+rndMv()];
      yCrds = [canDi*0.04+yOfst+rndMv(),canDi*0.275+yOfst+rndMv()];
      beginShape(LINES);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])/2),yCrds[0]);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])/2),yCrds[1]);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])*.25),yCrds[0]);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])*.75),yCrds[0]);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])*.15),yCrds[1]);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])*.85),yCrds[1]);
      endShape();
      strokeCap(ROUND);
      break;
    case 12:
      //L
      xCrds = [canDi*0.055+xOfst+rndMv(),canDi*0.24+xOfst+rndMv()];
      yCrds = [canDi*0.02+yOfst+rndMv(),canDi*0.255+yOfst+rndMv()];
      beginShape(LINES);
      curveVertex(xCrds[0]+canDi*0.0165,yCrds[0]);
      curveVertex(xCrds[0]+canDi*0.0165,yCrds[1]);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[0],yCrds[1]);
      curveVertex(xCrds[1],yCrds[1]);
      endShape();
      strokeCap(ROUND);
      break;
    case 13:
      //M
      xCrds = [canDi*0.055+xOfst+rndMv(),canDi*0.2+xOfst+rndMv()];
      yCrds = [canDi*0.04+yOfst+rndMv(),canDi*0.28+yOfst+rndMv()];
      beginShape(LINES);
      curveVertex(xCrds[0],yCrds[0]-canDi*0.015);
      curveVertex(xCrds[0],yCrds[1]);
      endShape();

      beginShape(LINES);
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])/2),yCrds[1]);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])/2),yCrds[1]);
      curveVertex(xCrds[1],yCrds[0]);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])/2),yCrds[1]+canDi*0.0075);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])/2),yCrds[1]-canDi*0.045);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[1],yCrds[0]-canDi*0.015);
      curveVertex(xCrds[1],yCrds[1]);
      endShape();
      break;
    case 14:
      //N
      xCrds = [canDi*0.085+xOfst+rndMv(),canDi*0.22+xOfst+rndMv()];
      yCrds = [canDi*0.025+yOfst+rndMv(),canDi*0.275+yOfst+rndMv()];
      beginShape(LINES);
      curveVertex(xCrds[0]+canDi*0.0165,yCrds[0]);
      curveVertex(xCrds[0]+canDi*0.0165,yCrds[1]);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[0]+canDi*0.0165,yCrds[0]+canDi*0.008);
      curveVertex(xCrds[1],yCrds[1]-canDi*0.008);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[1],yCrds[0]);
      curveVertex(xCrds[1],yCrds[1]);
      endShape();
      break;
    case 15:
      //O
      xCrds = [
        canDi*0.06+xOfst+rndMv(),canDi*0.08+xOfst+rndMv(),
        canDi*0.14+xOfst+rndMv(),canDi*0.195+xOfst+rndMv(),
        canDi*0.21+xOfst+rndMv(),canDi*0.195+xOfst+rndMv(),
        canDi*0.14+xOfst+rndMv(),canDi*0.08+xOfst+rndMv(),
      ];
      yCrds = [
        canDi*0.15+yOfst+rndMv(),canDi*0.0675+yOfst+rndMv(),
        canDi*0.035+yOfst+rndMv(),canDi*0.06+yOfst+rndMv(),
        canDi*0.15+yOfst+rndMv(),canDi*0.23+yOfst+rndMv(),
        canDi*0.265+yOfst+rndMv(),canDi*0.23+yOfst+rndMv(),
      ];
      strokeCap(ROUND);
      strokeJoin(ROUND);
      beginShape();
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[1],yCrds[1]);
      curveVertex(xCrds[2],yCrds[2]);
      curveVertex(xCrds[3],yCrds[3]);
      curveVertex(xCrds[4],yCrds[4]);
      curveVertex(xCrds[5],yCrds[5]);
      curveVertex(xCrds[6],yCrds[6]);
      curveVertex(xCrds[7],yCrds[7]);
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[0],yCrds[0]);
      endShape();
      strokeCap(SQUARE);
      strokeJoin(MITER);
      break;
    case 17:
      //Q
      xCrds = [
        canDi*0.06+xOfst+rndMv(),canDi*0.08+xOfst+rndMv(),
        canDi*0.14+xOfst+rndMv(),canDi*0.195+xOfst+rndMv(),
        canDi*0.21+xOfst+rndMv(),canDi*0.195+xOfst+rndMv(),
        canDi*0.14+xOfst+rndMv(),canDi*0.08+xOfst+rndMv(),
      ];
      yCrds = [
        canDi*0.15+yOfst+rndMv(),canDi*0.0675+yOfst+rndMv(),
        canDi*0.035+yOfst+rndMv(),canDi*0.06+yOfst+rndMv(),
        canDi*0.15+yOfst+rndMv(),canDi*0.23+yOfst+rndMv(),
        canDi*0.265+yOfst+rndMv(),canDi*0.23+yOfst+rndMv(),
      ];
      strokeCap(ROUND);
      strokeJoin(ROUND);
      beginShape();
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[1],yCrds[1]);
      curveVertex(xCrds[2],yCrds[2]);
      curveVertex(xCrds[3],yCrds[3]);
      curveVertex(xCrds[4],yCrds[4]);
      curveVertex(xCrds[5],yCrds[5]);
      curveVertex(xCrds[6],yCrds[6]);
      curveVertex(xCrds[7],yCrds[7]);
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[0],yCrds[0]);
      endShape();
      strokeCap(SQUARE);
      strokeJoin(MITER);
      beginShape(LINES);
      curveVertex(xCrds[4]-((xCrds[4]-xCrds[0])*.45),yCrds[6]-((yCrds[6]-yCrds[2])*.3));
      curveVertex(xCrds[4]+canDi*0.015,yCrds[6]+canDi*0.015);
      endShape();
      strokeCap(SQUARE);
      strokeJoin(MITER);
      break;
    case 18:
      //R
      xCrds = [canDi*0.055+xOfst+rndMv(),canDi*0.2+xOfst+rndMv()];
      yCrds = [canDi*0.04+yOfst+rndMv(),canDi*0.28+yOfst+rndMv()];
      beginShape(LINES);
      curveVertex(xCrds[0],yCrds[0]-canDi*0.0185);
      curveVertex(xCrds[0],yCrds[1]);
      endShape();

      beginShape();
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[0],yCrds[0]);

      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])*.3),yCrds[0]+canDi*0.005);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])*.2),yCrds[1]-((yCrds[1]-yCrds[0])*.8));
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])*.3),yCrds[1]-((yCrds[1]-yCrds[0])*.62));

      curveVertex(xCrds[0],yCrds[1]-((yCrds[1]-yCrds[0])*.6));
      curveVertex(xCrds[0],yCrds[1]-((yCrds[1]-yCrds[0])*.6));
      endShape();

      beginShape(LINES);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])*.35),yCrds[1]-((yCrds[1]-yCrds[0])*.65));
      curveVertex(xCrds[1],yCrds[1]);
      endShape();
      break;
    case 19:
      //S
      xCrds = [
        canDi*0.195+xOfst+rndMv(),canDi*0.14+xOfst+rndMv(),
        canDi*0.08+xOfst+rndMv(),canDi*0.1+xOfst+rndMv(),
        canDi*0.2+xOfst+rndMv(),canDi*0.22+xOfst+rndMv(),
        canDi*0.12+xOfst+rndMv(),canDi*0.06+xOfst+rndMv(),
      ];
      yCrds = [
        canDi*0.06+yOfst+rndMv(),canDi*0.035+yOfst+rndMv(),
        canDi*0.0675+yOfst+rndMv(),canDi*0.13+yOfst+rndMv(),
        canDi*0.15+yOfst+rndMv(),canDi*0.23+yOfst+rndMv(),
        canDi*0.265+yOfst+rndMv(),canDi*0.23+yOfst+rndMv(),
      ];
      strokeCap(SQUARE);
      strokeJoin(ROUND);
      beginShape();
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[1],yCrds[1]);
      curveVertex(xCrds[2],yCrds[2]);
      curveVertex(xCrds[3],yCrds[3]);
      curveVertex(xCrds[4],yCrds[4]);
      curveVertex(xCrds[5],yCrds[5]);
      curveVertex(xCrds[6],yCrds[6]);
      curveVertex(xCrds[7],yCrds[7]);
      curveVertex(xCrds[7],yCrds[7]);
      endShape();
      strokeCap(SQUARE);
      strokeJoin(MITER);
      break;
    case 20:
      //T
      xCrds = [canDi*0.055+xOfst+rndMv(),canDi*0.24+xOfst+rndMv()];
      yCrds = [canDi*0.04+yOfst+rndMv(),canDi*0.275+yOfst+rndMv()];
      beginShape(LINES);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])/2),yCrds[0]);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])/2),yCrds[1]);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[1],yCrds[0]);
      endShape();
      strokeCap(ROUND);
      break;
    case 21:
      //U
      xCrds = [
        canDi*0.08+xOfst+rndMv(),canDi*0.07+xOfst+rndMv(),
        canDi*0.19+xOfst+rndMv(),canDi*0.2+xOfst+rndMv(),
      ];
      yCrds = [
        canDi*0.025+yOfst+rndMv(),canDi*0.15+yOfst+rndMv(),
        canDi*0.2+yOfst+rndMv(),canDi*0.245+yOfst+rndMv(),
        canDi*0.265+yOfst+rndMv(),canDi*0.245+yOfst+rndMv(),
        canDi*0.2+yOfst+rndMv(),canDi*0.15+yOfst+rndMv(),
        canDi*0.025+yOfst+rndMv(),
      ];
      strokeCap(SQUARE);
      strokeJoin(ROUND);
      beginShape();
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[1],yCrds[1]);
      curveVertex(xCrds[3]-((xCrds[3]-xCrds[0])*0.975),yCrds[2]);
      curveVertex(xCrds[3]-((xCrds[3]-xCrds[0])*0.9),yCrds[3]);
      curveVertex(xCrds[3]-((xCrds[3]-xCrds[0])*0.5),yCrds[4]);
      curveVertex(xCrds[3]-((xCrds[3]-xCrds[0])*0.1),yCrds[5]);
      curveVertex(xCrds[3]-((xCrds[3]-xCrds[0])*0.025),yCrds[6]);
      curveVertex(xCrds[2],yCrds[7]);
      curveVertex(xCrds[3],yCrds[8]);
      curveVertex(xCrds[3],yCrds[8]);
      endShape();
      strokeCap(SQUARE);
      strokeJoin(MITER);
      break;
    case 22:
      //V
      xCrds = [
        canDi*0.08+xOfst+rndMv(),canDi*0.2+xOfst+rndMv(),
      ];
      yCrds = [
        canDi*0.025+yOfst+rndMv(),canDi*0.265+yOfst+rndMv(),
      ];
      strokeCap(SQUARE);
      strokeJoin(BEVEL);
      beginShape(LINES);
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])*0.5),yCrds[1]);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])*0.5),yCrds[1]);
      curveVertex(xCrds[1],yCrds[0]);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])/2),yCrds[1]+canDi*0.0075);
      curveVertex(xCrds[1]-((xCrds[1]-xCrds[0])/2),yCrds[1]-canDi*0.045);
      endShape();
      strokeCap(SQUARE);
      strokeJoin(MITER);
      break;
    case 24:
      //X
      xCrds = [canDi*0.085+xOfst+rndMv(),canDi*0.235+xOfst+rndMv()];
      yCrds = [canDi*0.03+yOfst+rndMv(),canDi*0.257+yOfst+rndMv()];
      beginShape(LINES);
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[1],yCrds[1]);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[1],yCrds[0]);
      curveVertex(xCrds[0],yCrds[1]);
      endShape();
      break;
    case 25:
      //Y
      xCrds = [canDi*0.085+xOfst+rndMv(),canDi*0.16+xOfst+rndMv(),canDi*0.235+xOfst+rndMv()];
      yCrds = [canDi*0.03+yOfst+rndMv(),canDi*0.15+yOfst+rndMv(),canDi*0.27+yOfst+rndMv()];
      beginShape(LINES);
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[1],yCrds[1]);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[1],yCrds[1]);
      curveVertex(xCrds[2],yCrds[0]);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[1],yCrds[1]);
      curveVertex(xCrds[1],yCrds[2]);
      endShape();
      break;
    case 26:
      //Z
      xCrds = [canDi*0.085+xOfst+rndMv(),canDi*0.27+xOfst+rndMv()];
      yCrds = [canDi*0.04+yOfst+rndMv(),canDi*0.255+yOfst+rndMv()];
      beginShape(LINES);
      curveVertex(xCrds[0],yCrds[0]);
      curveVertex(xCrds[1],yCrds[0]);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[1]-canDi*0.0125,yCrds[0]+canDi*0.0045);
      curveVertex(xCrds[0],yCrds[1]-canDi*0.0045);
      endShape();
      beginShape(LINES);
      curveVertex(xCrds[0]-canDi*0.0125,yCrds[1]);
      curveVertex(xCrds[1],yCrds[1]);
      endShape();
      strokeCap(ROUND);
      break;
    default:

  }
  pop();
}
function baseColourChange(headBaseColour){
  switch (headBaseColour) {
    case 1:
      fill(colPal.base2[0],colPal.base2[1],colPal.base2[2]);
      return colPal.base2;
      break;
    default:
      fill(colPal.base[0],colPal.base[1],colPal.base[2]);
      return colPal.base;
  }
}
function drawNostril(x,y,noseSide=0){
  switch (noseSide) {
    case 1:
      line(x,y,rndNum(x-canDi*0.015,x),y);
      break;
    default:
      line(x,y,rndNum(x,x+canDi*0.015),y);
  }
}
function drawTooth(x,y,direction=0,toothType=0){
  let yShift;
  if (direction === 1){
    y = y + canDi*0.0065;
  } else {
    y = y - canDi*0.0065;
  }
  if ((direction === 1) && (toothType === 1)) {
    direction = 2;
  }
  switch (direction) {
    case 0:
      if (toothType === 1) {
        beginShape();
        curveVertex(x,y);
        curveVertex(x,y);
        curveVertex(x+canDi*0.01,y-canDi*0.0025);
        curveVertex(x+canDi*0.025,y);
        curveVertex(x+canDi*0.025,y+canDi*0.02);
        curveVertex(x+canDi*0.015,y+canDi*0.065);
        curveVertex(x,y+canDi*0.015);
        curveVertex(x,y);
        curveVertex(x,y);
        endShape();
      } else {
        rect(x,y,rndNum(canDi*0.02,canDi*0.0225),rndNum(canDi*0.035,canDi*0.065),canDi*0.015,canDi*0.015,0,0);
      }
      break;
    case 1:
      rect(x,y,rndNum(canDi*0.02,canDi*0.0225),rndNum(-canDi*0.055,-canDi*0.035),canDi*0.015,canDi*0.015,0,0);
      break;
    case 2:
    let yNO = canDi*0.012;//y offset for fangs
      beginShape();
      curveVertex(x,y-yNO);
      curveVertex(x,y-yNO);
      curveVertex(x-canDi*0.01,y+canDi*0.0025-yNO);
      curveVertex(x-canDi*0.025,y-yNO);
      curveVertex(x-canDi*0.025,y-canDi*0.02-yNO);
      curveVertex(x-canDi*0.015,y-canDi*0.065-yNO);
      curveVertex(x,y-canDi*0.015-yNO);
      curveVertex(x,y-yNO);
      curveVertex(x,y-yNO);
      endShape();
      break;
  }
}
function drawRandomLetters() {
  stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
  textSize(canDi*0.05);
  textFont('sans-serif');
  textAlign(LEFT);
  let xP1 = rndNum(canDi*0.375,canDi*0.395);
  let yP1 = rndNum(canDi*0.75,canDi*0.77);
  let vertIterator = 0;
  push();
  scale(0.15);
  for (let symbolStrokes = 0; symbolStrokes < 7; symbolStrokes++) {
    let iterator = 0;
    let letterChoice = rndArr([['y','e','s'],['n','o']]);
    for (var i = 0; i < letterChoice.length; i++) {
      drawLetter(letterChoice[i],iterator+canDi*2.5,vertIterator+canDi*4.85);
      iterator += canDi*0.215;
    }
    vertIterator += canDi*0.275;
  }
  pop();
}
function drawRandomSymbols() {
  stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
  noFill();
  strokeWeight(canDi*0.0095);
  let xP1 = rndNum(canDi*0.415,canDi*0.42);
  let yP1 = rndNum(canDi*0.815,canDi*0.825);
  let shapeChoice = rndArr([0,1,2,3,4,5]);
    switch (shapeChoice) {
      case 0:
        beginShape();
        curveVertex(xP1,yP1-canDi*0.05);
        curveVertex(xP1,yP1-canDi*0.05);
        curveVertex(xP1,yP1);
        curveVertex(xP1,yP1+canDi*0.05);
        curveVertex(xP1,yP1+canDi*0.05);
        endShape();
        beginShape();
        curveVertex(xP1+canDi*0.025,yP1-canDi*0.05);
        curveVertex(xP1+canDi*0.025,yP1-canDi*0.05);
        curveVertex(xP1,yP1-canDi*0.05);
        curveVertex(xP1-canDi*0.045,yP1-canDi*0.05);
        curveVertex(xP1-canDi*0.045,yP1-canDi*0.05);
        endShape();
        point(xP1-canDi*0.025,yP1-canDi*0.025)
        point(xP1-canDi*0.025,yP1)
        break;
      case 1:
        beginShape();
        curveVertex(xP1,yP1-canDi*0.05);
        curveVertex(xP1,yP1-canDi*0.05);
        curveVertex(xP1,yP1);
        curveVertex(xP1,yP1+canDi*0.05);
        curveVertex(xP1,yP1+canDi*0.05);
        endShape();
        point(xP1+canDi*0.025,yP1);
        break;
      case 2:
        beginShape();
        curveVertex(xP1,yP1);
        curveVertex(xP1,yP1);
        curveVertex(xP1+canDi*0.025,yP1-canDi*0.05);
        curveVertex(xP1+canDi*0.05,yP1);
        curveVertex(xP1+canDi*0.025,yP1+canDi*0.05);
        curveVertex(xP1,yP1);
        curveVertex(xP1,yP1);
        endShape();
        point(xP1+canDi*0.025,yP1);
        break;
      case 3:
        beginShape();
        curveVertex(xP1,yP1-canDi*0.15);
        curveVertex(xP1,yP1-canDi*0.15);
        curveVertex(xP1,yP1);
        curveVertex(xP1,yP1+canDi*0.15);
        endShape();
        beginShape();
        curveVertex(xP1,yP1);
        curveVertex(xP1,yP1);
        curveVertex(xP1-canDi*0.05,yP1);
        curveVertex(xP1-canDi*0.15,yP1-canDi*0.05);
        endShape();
        point(xP1+canDi*0.015,yP1);
        point(xP1-canDi*0.015,yP1-canDi*0.15);
        break;
      case 4:
        beginShape();
        curveVertex(xP1,yP1-canDi*0.05);
        curveVertex(xP1,yP1-canDi*0.05);
        curveVertex(xP1,yP1);
        curveVertex(xP1,yP1+canDi*0.05);
        curveVertex(xP1+canDi*0.023,yP1+canDi*0.023);
        curveVertex(xP1+canDi*0.023,yP1-canDi*0.023);
        curveVertex(xP1+canDi*0.023,yP1-canDi*0.023);
        endShape();
        point(xP1-canDi*0.025,yP1);
        point(xP1-canDi*0.025,yP1+canDi*0.05);
        break;
      case 5:
        beginShape();
        curveVertex(xP1,yP1-canDi*0.04);
        curveVertex(xP1,yP1-canDi*0.04);
        curveVertex(xP1-canDi*0.02,yP1-canDi*0.02);
        curveVertex(xP1-canDi*0.02,yP1-canDi*0.02);
        endShape();
        beginShape();
        curveVertex(xP1,yP1+canDi*0.0175);
        curveVertex(xP1,yP1+canDi*0.0175);
        curveVertex(xP1,yP1);
        curveVertex(xP1,yP1-canDi*0.075);
        curveVertex(xP1,yP1-canDi*0.075);
        endShape();
        point(xP1-canDi*0.03,yP1);
        point(xP1+canDi*0.03,yP1);
        break;
    }
}
function drawEyeX(side=0) {
  strokeWeight(rndArr([canDi*0.015,canDi*0.02]));
  let xP1,yP1,xP2,yP2;
  switch (side) {
    case 1:
    switch (rndArr([0,1])) {
      case 1:
        xP1 = rndNum(canDi*0.68,canDi*0.695);
        yP1 = rndNum(canDi*0.445,canDi*0.475);
        xP2 = rndNum(canDi*0.705,canDi*0.725);
        yP2 = rndNum(canDi*0.53,canDi*0.555);
        line(xP1,yP1,xP2,yP2);
        line(xP2,yP1,xP1,yP2);
        break;
      default:
        xP1 = rndNum(canDi*0.65,canDi*0.68);
        yP1 = rndNum(canDi*0.415,canDi*0.425);
        xP2 = rndNum(canDi*0.725,canDi*0.75);
        yP2 = rndNum(canDi*0.555,canDi*0.57);
        line(xP1,yP1,xP2,yP2);
        line(xP2,yP1,xP1,yP2);
        break;
    }
      break;
    default:
    switch (rndArr([0,1])) {
      case 1:
        xP1 = rndNum(canDi*0.515,canDi*0.535);
        yP1 = rndNum(canDi*0.415,canDi*0.425);
        xP2 = rndNum(canDi*0.605,canDi*0.635);
        yP2 = rndNum(canDi*0.555,canDi*0.57);
        line(xP1,yP1,xP2,yP2);
        line(xP2,yP1,xP1,yP2);
        break;
      default:
        xP1 = rndNum(canDi*0.545,canDi*0.565);
        yP1 = rndNum(canDi*0.445,canDi*0.475);
        xP2 = rndNum(canDi*0.585,canDi*0.625);
        yP2 = rndNum(canDi*0.53,canDi*0.555);
        line(xP1,yP1,xP2,yP2);
        line(xP2,yP1,xP1,yP2);
        break;
    }
  }
}
function drawRandomEarrings() {
  let logoChoice;
  let xP1 = rndNum(canDi*0.37,canDi*0.385);
  let yP1 = rndNum(canDi*0.65,canDi*0.67);
  let earringChoice = rndArr([0,1,2,3]);
  switch (earringChoice) {
    case 0:
      strokeWeight(canDi*0.0015);
      noStroke();
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      circle(xP1,yP1,canDi*0.045);
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      strokeWeight(canDi*0.0055);
      logoChoice = rndArr([0,1]);
      switch(logoChoice) {
        case 0:
          noFill();
          ellipse(xP1,yP1,canDi*0.02,canDi*0.02);
          break;
        case 1:
          line(xP1-canDi*0.005,yP1-canDi*0.012,xP1+canDi*0.005,yP1+canDi*0.012);
          line(xP1+canDi*0.005,yP1-canDi*0.012,xP1-canDi*0.005,yP1+canDi*0.012);
          break;
      }
      break;
    case 1:
      strokeWeight(canDi*0.0015);
      noStroke();
      fill(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      rect(xP1-canDi*0.03,yP1-canDi*0.02,canDi*0.06,canDi*0.04,15,15,15,15);
      rect(xP1-canDi*0.015,yP1+canDi*0.01,canDi*0.03,canDi*0.03,15,15,15,15);
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      strokeWeight(canDi*0.0055);
      logoChoice = rndArr([0,1]);
      switch(logoChoice) {
        case 0:
          noFill();
          ellipse(xP1-canDi*0.01,yP1,canDi*0.012,canDi*0.018);
          ellipse(xP1+canDi*0.01,yP1,canDi*0.012,canDi*0.018);
          break;
        case 1:
          line(xP1-canDi*0.015,yP1-canDi*0.012,xP1-canDi*0.0075,yP1+canDi*0.012);
          line(xP1-canDi*0.0075,yP1-canDi*0.012,xP1-canDi*0.015,yP1+canDi*0.012);
          line(xP1+canDi*0.015,yP1-canDi*0.012,xP1+canDi*0.0075,yP1+canDi*0.012);
          line(xP1+canDi*0.0075,yP1-canDi*0.012,xP1+canDi*0.015,yP1+canDi*0.012);
          break;
      }
      line(xP1-canDi*0.0075,yP1+canDi*0.02,xP1-canDi*0.0075,yP1+canDi*0.03);
      line(xP1,yP1+canDi*0.02,xP1,yP1+canDi*0.03);
      line(xP1+canDi*0.0075,yP1+canDi*0.02,xP1+canDi*0.0075,yP1+canDi*0.03);
      break;
    case 2:
      strokeWeight(canDi*0.01);
      stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]);
      fill(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      beginShape();
      vertex(xP1,yP1-canDi*0.012);
      vertex(xP1,yP1-canDi*0.012);
      vertex(xP1-canDi*0.009,yP1+canDi*0.015);
      vertex(xP1-canDi*0.025,yP1+canDi*0.015);
      vertex(xP1-canDi*0.012,yP1+canDi*0.03);
      vertex(xP1-canDi*0.015,yP1+canDi*0.05);
      vertex(xP1,yP1+canDi*0.04);
      vertex(xP1+canDi*0.015,yP1+canDi*0.05);
      vertex(xP1+canDi*0.012,yP1+canDi*0.03);
      vertex(xP1+canDi*0.025,yP1+canDi*0.015);
      vertex(xP1+canDi*0.009,yP1+canDi*0.015);
      vertex(xP1,yP1-canDi*0.012);
      vertex(xP1,yP1-canDi*0.012);
      endShape();
      break;
    case 3:
      strokeWeight(canDi*0.06);
      stroke(colPal.darkaccent[0],colPal.darkaccent[1],colPal.darkaccent[2]);
      point(xP1,yP1);
      break;
    case 4:
      point(xP1,yP1);
      break;
    case 5:
      point(xP1,yP1);
      break;
    }
}
function drawEyeStars(){
  const strArr = [
    {
      size:1.5,
      shift:canDi*0.05,
    },
    {
      size:2,
      shift:canDi*0.0265,
    },
    {
      size:2.5,
      shift:canDi*0.0185,
    },
    {
      size:3,
      shift:0,
    },
  ]
  let xP1 = rndNum(canDi*0.57,canDi*0.585);
  let yP1 = rndNum(canDi*0.4,canDi*0.42);
  let sYP = rndArr([0,1,2,3]);//get placement
  let strS = strArr[sYP].size;//change the size of the star
  yP1 = yP1+strArr[sYP].shift;//change the position of the star based on size
  let strCrds = [canDi*0.009*strS,canDi*0.013*strS,canDi*0.016*strS,canDi*0.025*strS,canDi*0.03*strS,canDi*0.04*strS,canDi*0.05*strS];
  beginShape();
  vertex(xP1,yP1-(strCrds[1]*0.65));
  vertex(xP1,yP1-(strCrds[1]*0.65));
  vertex(xP1-strCrds[0],yP1+strCrds[2]);
  vertex(xP1-strCrds[3],yP1+strCrds[2]);
  vertex(xP1-strCrds[1],yP1+strCrds[4]);
  vertex(xP1-strCrds[2],yP1+strCrds[6]);
  vertex(xP1,yP1+strCrds[5]);
  vertex(xP1+strCrds[2],yP1+strCrds[6]);
  vertex(xP1+strCrds[1],yP1+strCrds[4]);
  vertex(xP1+strCrds[3],yP1+strCrds[2]);
  vertex(xP1+strCrds[0],yP1+strCrds[2]);
  vertex(xP1,yP1-(strCrds[1]*0.65));
  vertex(xP1,yP1-(strCrds[1]*0.65));
  endShape();
  yP1 = rndNum(canDi*0.4,canDi*0.42);
  sYP = rndArr([0,1,2,3]);//get placement
  strS = strArr[sYP].size;//change the size of the star
  yP1 = yP1+strArr[sYP].shift;//change the position of the star based on size
  let rP1 = xP1+canDi*0.15-(strArr[sYP].shift)/2;//shift doubled star over to the right side of the canvas
  strCrds = [canDi*0.009*strS,canDi*0.013*strS,canDi*0.016*strS,canDi*0.025*strS,canDi*0.03*strS,canDi*0.04*strS,canDi*0.05*strS];
  beginShape();
  vertex(rP1,yP1-(strCrds[1]*0.65));
  vertex(rP1,yP1-(strCrds[1]*0.65));
  vertex(rP1-strCrds[0],yP1+strCrds[2]);
  vertex(rP1-strCrds[3],yP1+strCrds[2]);
  vertex(rP1-strCrds[1],yP1+strCrds[4]);
  vertex(rP1-strCrds[2],yP1+strCrds[6]);
  vertex(rP1,yP1+strCrds[5]);
  vertex(rP1+strCrds[2],yP1+strCrds[6]);
  vertex(rP1+strCrds[1],yP1+strCrds[4]);
  vertex(rP1+strCrds[3],yP1+strCrds[2]);
  vertex(rP1+strCrds[0],yP1+strCrds[2]);
  vertex(rP1,yP1-(strCrds[1]*0.65));
  vertex(rP1,yP1-(strCrds[1]*0.65));
  endShape();
}
function drawLollipop(x,y,specialLolli=0,stem=1){
  stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
  fill(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
  strokeWeight(canDi*0.0075);
  let v1 = createVector(x,y);
  let v2 = createVector(x+canDi*0.1,y+rndNum(canDi*0.0025,canDi*0.1));
  switch (specialLolli) {
    case 1:
      switch (stem) {
        case 1:
          stroke(colPal.highlight[0],colPal.highlight[1],colPal.highlight[2]+20);
          noFill();
          line(v1.x,v1.y,v2.x,v2.y);
          break;
        default:
          ellipse(v1.x-canDi*0.025,v1.y-canDi*0.015,canDi*0.05,canDi*0.05);
          stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]+20);
          noFill();
          arc(v1.x-canDi*0.025,v1.y-canDi*0.015,canDi*0.045,canDi*0.045,rndArr([PI,PI+QUARTER_PI,QUARTER_PI-HALF_PI]), 0, OPEN);
      }
      specialTrait = 'lollipop';
      break;
    default:
  }
}
function dripSpine(numItor=5,spaceInt=0.075){
  let spIterator = 0;
  for (let spineSegments = 0; spineSegments < numItor; spineSegments++) {
    iterator = 0;
    for (let headStrokes = 0; headStrokes < 2; headStrokes++) {
      line(canDi*0.39+iterator,canDi*0.63+spIterator,canDi*0.39+iterator,rndNum(canDi*0.66+spIterator,canDi*0.67+spIterator));
      iterator = iterator + canDi*0.1;
    }
    iterator = 0;
    for (let headStrokes = 0; headStrokes < 2; headStrokes++) {
      line(canDi*0.41+iterator,canDi*0.64+spIterator,canDi*0.41+iterator,rndNum(canDi*0.66+spIterator,canDi*0.68+spIterator));
      iterator = iterator + canDi*0.06;
    }
    iterator = 0;
    for (let headStrokes = 0; headStrokes < 2; headStrokes++) {
      line(canDi*0.43+iterator,canDi*0.66+spIterator,canDi*0.43+iterator,rndNum(canDi*0.68+spIterator,canDi*0.69+spIterator));
      iterator = iterator + canDi*0.02;
    }
    spIterator = spIterator + canDi*spaceInt;
  }
}
function createSpheres(xRange=[canDi*0.35,canDi*0.75],yRange=[canDi*0.35,canDi*0.75],sphereAmount=50,sphereSize=canDi*0.1){
  for (var i = 0; i < sphereAmount; i++) {
    circle(rndNum(xRange[0],xRange[1]),rndNum(yRange[0],yRange[1]),sphereSize)
  }
}
function drawMultiEyes(xRange=[canDi*0.55,canDi*0.6],yRange=[canDi*0.45,canDi*0.6],seedCount=rndNum(6,12)){
  stroke(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
  fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
  drawSockets(extend=0,emptyChange=1);
  stroke(colPal.compliment[0],colPal.compliment[1],colPal.compliment[2]);
  fill(colPal.bg[0],colPal.bg[1],colPal.bg[2]);
  for (var i = 0; i < seedCount; i++) {
    circle(rndNum(xRange[0],xRange[1]),rndNum(yRange[0],yRange[1]),canDi*0.025)
  }
}
function drawSockets(extend=1,emptyChange=1){
  let yPC1,yPC2;
  let xP1 = canDi*0.508;
  let yP1 = canDi*0.475;
  switch (extend) {
    case 0:
      yPC1 = canDi*0.015;
      yPC2 = 0;
      break;
    case 1:
      yPC1 = rndNum(canDi*0.01,canDi*0.075);
      yPC2 = rndNum(canDi*0.01,canDi*0.055);
      break;
  }
  let xShft = canDi*0.164;
  let widthCoords = [canDi*0.115,canDi*0.05];
  switch (emptyChange) {
    case 0:
      //eye lines
      line(xP1,yP1,xP1,yP1+yPC1);
      line(xP1+widthCoords[0],yP1,xP1+widthCoords[0],yP1+yPC1);
      line(xP1+xShft,yP1,xP1+xShft,yP1+yPC2);
      line(xP1+xShft+widthCoords[1],yP1,xP1+xShft+widthCoords[1],yP1+yPC2);
      break;
    case 1:
      //eye rectangles
      rect(xP1,yP1-canDi*0.0065,widthCoords[0],yPC1+canDi*0.015);
      rect(xP1+xShft,yP1-canDi*0.0065,widthCoords[1],yPC2+canDi*0.015);
      break;
  }
  //left eye
  bezier(xP1,yP1,xP1,yP1-canDi*0.1,xP1+widthCoords[0],yP1-canDi*0.1,xP1+widthCoords[0],yP1);
  bezier(xP1,yP1+yPC1,xP1,yP1+yPC1+canDi*0.1,xP1+widthCoords[0],yP1+yPC1+canDi*0.1,xP1+widthCoords[0],yP1+yPC1);
  //right eye
  bezier(xP1+xShft,yP1,xP1+xShft,yP1-canDi*0.1,xP1+xShft+widthCoords[1],yP1-canDi*0.1,xP1+xShft+widthCoords[1],yP1);
  bezier(xP1+xShft,yP1+yPC2,xP1+xShft,yP1+yPC2+canDi*0.1,xP1+xShft+widthCoords[1],yP1+yPC2+canDi*0.1,xP1+xShft+widthCoords[1],yP1+yPC2);
}
// functions specific to Acolyte palette
function setEnlightenedEyes(acolyteEyeColour){
  stroke(acolyteEyeColour[0],acolyteEyeColour[1],acolyteEyeColour[2]);
  fill(acolyteEyeColour[0],acolyteEyeColour[1],acolyteEyeColour[2]);
  strokeWeight(canDi*0.0065);
  drawSockets();
  for (let eyeStrokes = 0; eyeStrokes < rndNum(3,7); eyeStrokes++) {
    let tempXPoint = rndNum(canDi*0.54,canDi*0.61);
    line(tempXPoint,canDi*0.535,tempXPoint,rndNum(canDi*0.75,canDi));
  }
  for (let eyeStrokes = 0; eyeStrokes < rndNum(1,4); eyeStrokes++) {
    let tempXPoint = rndNum(canDi*0.705,canDi*0.72);
    line(tempXPoint,canDi*0.535,tempXPoint,rndNum(canDi*0.8,canDi));
  }
  for (let eyeStrokes = 0; eyeStrokes < rndNum(3,7); eyeStrokes++) {
    let tempXPoint = rndNum(canDi*0.52,canDi*0.63);
    line(tempXPoint,canDi*0.535,tempXPoint,rndNum(0,canDi*0.35));
  }
  for (let eyeStrokes = 0; eyeStrokes < rndNum(1,4); eyeStrokes++) {
    let tempXPoint = rndNum(canDi*0.68,canDi*0.71);
    line(tempXPoint,canDi*0.535,tempXPoint,rndNum(0,canDi*0.35));
  }
  stroke(0,0,100,0.5);
  strokeWeight(canDi*0.0065);
  xP1 = rndNum(canDi*0.55,canDi*0.565);
  xP2 = rndNum(canDi*0.69,canDi*0.705);
  xP1 = rndNum(canDi*0.57,canDi*0.58);
  iterator = 0;
  for (var i = 0; i < 3; i++) {
    line(xP1+iterator,rndNum(canDi*0.51,canDi*0.65),xP1+iterator,rndNum(0,canDi*0.015));
    iterator = iterator + canDi*0.0055;
  }
  xP2 = rndNum(canDi*0.69,canDi*0.705);
  iterator = 0;
  for (var i = 0; i < 3; i++) {
    line(xP2+iterator,rndNum(canDi*0.51,canDi*0.65),xP2+iterator,rndNum(0,canDi*0.015));
    iterator = iterator + canDi*0.0055;
  }
}
function createGlitchBlocks(fiberNum,xRange,yRange,acolyteEyeColour) {
  let numFibers = fiberNum;
  let randomX, randomY,randomX2, randomY2;
  //let randomColour = rndArr([baseColourList.yellow,baseColourList.green,baseColourList.magenta]);
  for (let i = 0; i < numFibers; i++) {
    let x1 = rndNum(xRange[0],xRange[1]);
    let y1 = rndNum(yRange[0],yRange[1]);
    let theta = parseInt(rndNum(0,canDi*oneValue)) * parseInt(canDi*0.0019) * canDi*pieValue;
    let segmentLength = rndArr([canDi*0.0009,canDi*0.0019]) * canDi*0.0048 + canDi*0.0019;
    let x2 = segmentLength + x1;
    let y2 = y1;
    //stroke(randomColour[0],randomColour[1],randomColour[2],0.25);
    noStroke();
    fill(acolyteEyeColour[0],acolyteEyeColour[1],acolyteEyeColour[2],0.5);
    strokeWeight(canDi*0.05);
    rect(x1, y1,rndNum(canDi*0.02,canDi*0.05),rndNum(canDi*0.02,canDi*0.05));
    //randomColour = rndArr([baseColourList.yellow,baseColourList.green,baseColourList.magenta])
    //stroke(randomColour[0],randomColour[1],randomColour[2],0.25);
    //fill(randomColour[0],randomColour[1],randomColour[2],0.25);
    //strokeWeight(canDi*0.05);
    randomX2 = rndNum(-canDi*0.0125,canDi*0.0125);
    randomY2 = rndNum(-canDi*0.0125,canDi*0.0125);
    rect(x1+randomX, y1+randomY,rndNum(canDi*0.02,canDi*0.05),rndNum(canDi*0.02,canDi*0.05));
    //randomColour = rndArr([baseColourList.yellow,baseColourList.green,baseColourList.magenta])
    //stroke(randomColour[0],randomColour[1],randomColour[2],0.25);
    //fill(randomColour[0],randomColour[1],randomColour[2],0.25);
    //strokeWeight(canDi*0.05);
    randomX2 = rndNum(-canDi*0.0125,canDi*0.0125);
    randomY2 = rndNum(-canDi*0.0125,canDi*0.0125);
    rect(x1+randomX2, y1+randomY2,rndNum(canDi*0.02,canDi*0.05),rndNum(canDi*0.02,canDi*0.05));
  }
}
