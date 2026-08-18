bgCols = [
  "#FFF5EE", //seashell
  "#fbf6e3", //canvas
  "#E6E0D4", //white coffee
  "#FDDEBD", //butter white
  "#F6FCFA", //white rose
  "#ECECEE", //christmas white
  "#1F201F", //retro black
  "#212122", //ink black
  "#1B1B1B", //eerie black
  "#242124", //raisin black
];

bgNames = [
  "SeaShell",
  "Canvas",
  "White Coffee",
  "Butter White",
  "White Rose",
  "Christmas White",
  "Retro Black",
  "Ink Black",
  "Eerie Black",
  "Raisin Black",
];
//Background color parameters
bgNum = 0//randomInt(0, 5);
bgc = bgCols[bgNum];
bgName = bgNames[bgNum];

//Make a color that always contrasts bgc
calcBgLum = chroma(bgc).luminance();
if (calcBgLum > 0.5) {
  frameCol = 'black'; //black
} else if( calcBgLum < 0.5) {
  frameCol = 'white'; //white
}

//Palettes
//Always include frameCol instead of black or white so our colors don't blend into bgc
const source = [
  'black',
  "#A6C8CA",
  "#F1E8D9",
  "#097857",
  "#E3CE61",
  "#E35A7E",
  "#EE692A",
  "#BFCCD4",
  "#217F96",
  "#EBD5D7",
];

const shepard = ['black', "#E0FBFC", "#3D5A80", "#98C1D9", "#E0FBFC", "#FF4D21", "#293241"];

const overlook = [
  "#282723",
  "#edd2b7",
  "#3d4d20",
"#ad0b08",
"#1d5473",
"#798b97",
"#b76439",
"#d2955f",

]

const pinkLeaf = [
  "#0a1d23",
  "#fce5e5",  
  "#d7753e",
"#505026",
"#f2a9ce",
"#8f7f4c",
"#97caff"]

const sash = [
  "#151117",
  "#efefef",
  "#eac8ae",
  "#d88039",
"#7aa4bc",
"#d83f35",
"#213d6d",
]

const moncler = [
  "#cfd7d9",
  "#080809",
  "#0d244a",
  "#72a7b0",
"#348270",
"#bb9872",
]

const blueHour = [
  'black',
  'white',
  "#28282a",
"#dfd2c5",
"#1a356e",
"#50709e",
"#99a0a9",
"#954433",
"#c26e3f",
"#dcbb91"]

const ren = [
  "#27282c",
  "white",
"#b1b88e",
"#2f6037",
"#b57170",
"#ae4e2e",
"#78a5a0",
"#6a6a5d",
"#ce8a4f"]

const achro = [
  "#000000",
"#ffffff",
"#636363",
"#c9c9c9",
"#636363",
"#c9c9c9",
"#636363",
"#c9c9c9",
"#262626",
]

const cyano = [
"#336699",
"#f6e6d5",
"#336699",
"#f6e6d5",
"#336699",
"#f6e6d5",
"#336699",
"#f6e6d5",
"#1a334b"
]
const cyano2 = [
  "#f6e6d5",
  "#1e2d3b",
  "#557EA2",
  "#f6e6d5",
  "#557EA2",
  "#f6e6d5",
  
]
const irPal = ['black', 'white', "#e69566","#dece66", "#e06e7e"]
const lavender = ['black', 'white', "#bd95da","#db97d5","#a29ddd", "#f8badd"]
const pistachio = ['black', 'white', "#a7c395","#99c79e","#c4c8a1"]

const palNames = [
  "Source",
  'Commander Shepard',
  "Pink Leaf",
  'Sash',
  "Moncler",
  "Blue Hour",
  'Ren',
  "Achromatic",
  "Cyanotype",
  "Pistachio",
  "Lavender",
  "IR",

];

finalPals = [
  source,
  shepard,
  pinkLeaf,
  sash, 
  moncler,
  blueHour,
  ren,
  achro,
  cyano2,
  pistachio,
  lavender,
  irPal,
]

//Palette parameters
palNum = randomInt(0, finalPals.length-1);
pal = finalPals[palNum];
palName = palNames[palNum];

//split palette into blacks/whites and colors
contrastPal = [pal[0], pal[1]]
//shuffle just the colors
colorPal = shuff(pal.slice(2, pal.length))

//Combine palettes and shuffle that full palette
fullPal = [].concat(contrastPal, colorPal, contrastPal);
numColors = fullPal.length
truePal = fullPal
hilo = [bgc, frameCol];


//Pass our palette back to the CSS spinner
let root = document.documentElement;
root.style.setProperty("--c1", truePal[0]);
root.style.setProperty("--c2", truePal[1]);
root.style.setProperty("--c3", truePal[2]);
root.style.setProperty("--c4", truePal[3]);
