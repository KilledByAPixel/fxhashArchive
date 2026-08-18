bgCols = [
  "#f1f1f1", //paper white
  "#EDE6E3",//"#eae5de", //warm paper white
  "#212121", //faded black
  "#383838", //charcoal
];

bgNames = [
  "Paper White",
  "Warm Paper",
  "Faded Black",
  "Charcoal"
];

//Background color parameters
bgNum = randomInt(0, bgCols.length-1);
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
  "#A6C8CA",
  "#097857",
  "#F1E8D9",
  "#E3CE61",
  "#E35A7E",
  frameCol,
  "#EE692A",
  "#BFCCD4",
  "#217F96",
  "#EBD5D7",
];

const shepard = ["#3D5A80", "#98C1D9", "#E0FBFC", "#FF4D21", "#293241", frameCol];

const bau = [
  "#1267b7",
  "#ec3e2b",
  "#f6b81a",
  "#E4D6C2",
  "#1D1F22",
]

const elliot = [
  "#E73542",
  "#F6A026",
  "#2CA8C4",
  "#EE7140",
  "#289C5B",
  "#F5E2CC",
  "#161117"
]
const vint = [
  'black',
  '#FDDEBD',
  '#3255A4',
  '#62A8E5',
  '#FF8E91'
]
const wildberry = [
  'black',
  '#62A8E5',
  '#BB76CF',
  '#407060',
  '#FF6C2F',
  '#fff0e0',
]
const achro = [
  "#000000",
"#ffffff",
"#636363",
"#c9c9c9",
"#262626",
]

const utah = [
  '#D2452B',
  '#004921',
  '#e4703a',
  '#ebb240',
  '#e9b9a9',
  '#fff0e0',
  "#161117"
]

const plummet = ["#e9502d","#41ab7a","#f0a7de","#fff6f6","#f5cc3a","#2f2f2f"]

const newPals = [bau, elliot, source, wildberry, utah, achro, vint, shepard, plummet]
const palNames = [
  'Bau',
  'Elliot',
  'Source',
  'Wildberry',
  "Utah",
  "Achromatic",
  "Vint",
  "Commander Shepard",
  "Plummet",
];

//Palette parameters
palNum = randomInt(0, newPals.length-1);
pal = newPals[palNum];
palName = palNames[palNum];

console.log(palName)

truePal = shuff(pal);

//Pass our palette back to the CSS spinner
let root = document.documentElement;
root.style.setProperty("--c1", truePal[0]);
root.style.setProperty("--c2", truePal[1]);
root.style.setProperty("--c3", truePal[2]);
root.style.setProperty("--c4", truePal[3]);
