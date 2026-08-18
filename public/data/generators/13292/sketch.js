let f;
let settings;

let seed;
let w;
let cell;

let scale = 4;
let currentScale;
let scaledCanvas;
let canvas;
let decorator;

let saveBol=false;



let isSaving = false;
let finished;

//======================Features Settins================
let style ;
let scaler;
let divLevel;
let palette;
let gradient;
let gradientName;
let gradientDirection;
let hasCircles;
let hasTriangles;
let hasHorizontalLines;
let hasCellStroke;
let areCirclesBlack;
let hl_count;
let cycle;
let sprawl;

function setup() {
//==========Features========
seed = xmur3(fxhash)();
randomSeed(seed)
colorMode(HSB);
let outComeStyle = (selectWithRarity(MetropolisStyles)) ;


scaler = getLayout();
divLevel = 5;
style = outComeStyle.func;
palette = selectWithRarity(outComeStyle.palette)


gradient = palette.gradients[intRandRange(0, palette.gradients.length)],
gradientName = gradient.alias;

gradientDirection = getDirection();
hasCircles = getBoolWeighted([99, 1]);
hasTriangles = getBoolWeighted([95, 5]);
hasHorizontalLines = getBoolWeighted([35, 65]);

areCirclesBlack = getBoolWeighted([60, 40]);

if(style.name ="Mondrian"){
  hasCellStroke = true;
}else if(style.name ==="Crystal" || style.name ==="Mondrian Crystal Dark"){
  hasCellStroke = false;
}else{
  hasCellStroke = getBoolWeighted([65,35]);
}
if(style.name ==="Mondrian Crystal Light" || style.name==="Mondrian Crystal Dark" ||style.name==="Crystal" || style.name ==="Chaotic" ){
  hasHorizontalLines = true;
}else {
  hasHorizontalLines = getBoolWeighted([35, 65]);
}
if(style.name ==="1 Chroma"){
  sprawl=false;
}else{
  sprawl = getBoolWeighted([3,97]);
}
if (hasHorizontalLines) { hl_count = getHorizontalCount(divLevel) } else { hl_count = "none" };
//===========================


  canvas = createCanvas(w, w);
  onWindowResized();
  scaledCanvas = createGraphics(w, w);
  currentScale = 1;
  
  colorMode(HSB);
  
  console.log("SEED: " + seed);
  console.log(fxhash);
  console.log("Murat Atimtay 2022 @fxhash. Made with love")
  
 
 let g ;
 if(style.name==="Rainbow"){
   g ="Rainbow"
 } if(style.name==="Chaotic"){
   g= "Chaotic"
 }else{
   g = gradientName;
 }

  window.$fxhashFeatures = {
    "Style: ":outComeStyle.name ,
    "Cycle": outComeStyle.cycle,
    "Object Palette: ": palette.alias,
    "Gradient: ": g,
    "Visible Floors": hasHorizontalLines,
    "Has Cell Borders": hasCellStroke,
    "Aspect Ratio": scaler===0.66?"2:3":"4:5",
    "Urban Sprawl": sprawl,
    "Gradient Direction": gradientDirection==="td"? "Vertical":"Horizontal",

  }
console.log(window.$fxhashFeatures);
 noLoop();

}

async function draw() {
 
  if (!isSaving) {
    onWindowResized();
  }

  randomSeed(seed);
  noiseSeed(seed);
 
background(255)


await style()

  fxpreview();
  if (saveBol) {
    saveBol=false;
    saveCanvas(canvas,style.name+fxhash,'png')

    setTimeout(function () {
        window.location.reload();
    }, 2000);
}
  noLoop()
  
  //location.reload();
 
}


function onWindowResized() {
  randomSeed(seed)
  w = min(window.innerWidth, window.innerHeight);

  resizeCanvas(w * scaler, w);
  f = (w / 1000);
  background(255);
}

function keyPressed() {
  isSaving = true;
  if(keyCode===49){
    exportPNG(1000)
  }
  if(keyCode===50){
    exportPNG(2000)
  }
  if(keyCode===51){
    exportPNG(3000)
  }
  if(keyCode===52){
    exportPNG(4000)
  }
  if(keyCode===53){
    exportPNG(5000)
  }
  if(keyCode===54){
    exportPNG(6000)
  }
  if(keyCode===55){
    exportPNG(7000)
  }
  if(keyCode===56){
    exportPNG(8000)
  }
  if(keyCode===57){
    exportPNG(12000)
  }
 


  if (keyCode === 77) {
    resizeCanvas(scaler * 1600, 1600)

    draw();
    let mo = createImage(900, 1600);
    mo.copy(canvas, width / 2 - 450, 0, 900, 1600, 0, 0, 900, 1600)
    mo.save("mobile", 'png')
    isSaving = false;
    draw();
  }
}

exportPNG =(resolution)=>{
  resizeCanvas(scaler * resolution, resolution)
    draw();
    save("metropolis" +resolution+"px")
    isSaving = false;
    draw();
}

function getLayout() {
  randomSeed(seed)
  let ratio = [0.66, 0.8];
  let r = fxrand_weighted([55, 45]);
  return ratio[r];
}

function getBoolWeighted(array) {
  let r = fxrand_weighted(array);
  return r < 1 ? true : false;
}

function getDivLevelWeighted() {
  let levels = [4, 5, 6]
}

function getDirection() {
  let dirs = ["rl", "td"];
  return dirs[intRandRange(0, 2)];
}

function getHorizontalCount(d) {
  c = d < 5 ? intRandRange(50, 120) : intRandRange(10,25)
  return c;
}

function getCellStrokeWeight(d) {
  c = d < 5 ? randRange(0.35, 0.55) : randRange(0.21, 0.35)
  return c;

}

function getDayNightCycle(){
  cycle = true?"Day":"Night";
  return cycle;
}

