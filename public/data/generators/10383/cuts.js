//Cuts by Todemashi - March 2022
const DEF_W = 1000;
let DEF_H = 1000;
let WH_DEF_R = DEF_W / DEF_H;
let myWIDTH = 2400;
let myHEIGHT = 2400;
let bc;
let resizing = false;
let WH_REAL_R = myWIDTH/myHEIGHT;
let M, canvasW, canvasH, darkGrainLayer, lightGrainLayer, palette, noiseGrainShader, shTexture, shLayer, darkGrainShader, lightGrainShader;
let cabs = [];
let maxWidth = 0;
let minWidth = 30;
let minGap = 60;
let maxGap = 580;
let gut = 10;
const palettes = [
  ["Danaus", "#fffcf2", "#fffcf2", "#ccc5b9", "#403d39", "#252422", "#eb5e28"],
  ["Danaus", "#fffcf2", "#fffcf2", "#ccc5b9", "#403d39", "#252422", "#eb5e28"],
  ["Danaus", "#fffcf2", "#fffcf2", "#ccc5b9", "#403d39", "#252422", "#eb5e28"],
  ["Sabinic", "#131415", "#000000", "#005eff", "#ffd100", "#ff6229", "#00c379", "#ffffff"],
  ["Sabinic", "#131415", "#000000", "#005eff", "#ffd100", "#ff6229", "#00c379", "#ffffff"],
  ["Sabinic", "#131415", "#000000", "#005eff", "#ffd100", "#ff6229", "#00c379", "#ffffff"],
  ["BW", "#252422", "#252422", "#fffefe", "#d9d9d9", "#a9a9a9", "#7b7b7b", "#565656", "#353535"],
  ["BW", "#252422", "#252422", "#fffefe", "#d9d9d9", "#a9a9a9", "#7b7b7b", "#565656", "#353535"],
  ["Garros", "#d94c32", "#3c3c3c", "#c8c8c8", "#dadada", "#c5c5c5", "#c8c8c8"],
  ["Garros", "#d94c32", "#3c3c3c", "#c8c8c8", "#dadada", "#c5c5c5", "#c8c8c8"],
  ["Whynot", "#0d0c1d", "#0d0c1d", "#474973", "#a69cac", "#929ed0", "#948064"],
  ["Rainbow", "#f5f6e6", "#ffffff", "#ebbf45", "#9ebf5a", "#4386b5", "#e8b0b7", "#b77dd1", "#d64040"],
  ["Chillout", "#f4f1de", "#ffffff", "#e07a5f", "#3d405b", "#81b29a", "#f2cc8f"],
  ["Lipstick", "#e7d7c1", "#ece4e2", "#8c1c13", "#bf4342", "#a78a7f", "#735751"],
  ["Emeralda", "#cadbc8", "#ffffff", "#02c39a", "#00a896", "#028090", "#05668d"],
  ["Unicorn", "#f7ffe8", "#ffffff", "#9b5de5", "#f15bb5", "#fee440", "#00bbf9", "#00f5d4"],
  ["Flock", "#e3e2df", "#eddcd2", "#ffffff", "#faf9f9", "#393939"],
  ["Liberty", "#5d576b", "#926c15", "#e6ebe0", "#dcd7c8"],
  ["Mandes", "#dfdae7", "#eeeeee", "#f18976", "#deac00", "#ee3400", "#21522f"],
  ["Atomica", "#e7ddc5", "#2d2016", "#f56831", "#95512a", "#1990b3"],
  ["Flamincut", "#800f2f", "#f48c06", "#d00000", "#6a040f", "#ae2012"],
  ["Psycless", "#282948", "#282728", "#a31e84", "#791d82", "#9756ac"],
  ["Cobalet", "#012a4a", "#c9e1ec", "#014f86", "#2a6f97", "#2c7da0", "#468faf", "#45a7cf", "#18628c", "#2e6891"],
  ["Ebriato", "#588886", "#ffffff", "#e9c3c0", "#b2a95f", "#706288", "#5fb290"],
  ["Cutcake", "#513948", "#2e3c44", "#d8cc8d", "#ff5781", "#836b57", "#7ac1af"],
  ["Retroid", "#001219", "#080808", "#005f73", "#0a9396", "#94d2bd", "#e9d8a6", "#ee9b00", "#ca6702", "#ae2012", "#79181b"],
  ["Kyoto", "#fadde1", "#ffffff", "#ffc4d6", "#ffa6c1", "#ff87ab", "#ff5d8f", "#f4acb7", "#dbcbd8"]
];
const sinFromCos = [];
//
let totW, nCabs, orientAngle, matchingColor, gapOrdering, gapPosition, sameGaps, sameWidths, coveredArea, overlapping, framed, plugs, assignedPlugs, cabsType;
let assignedTypes = [0,0];
let cc = 0;
let shaded = true;
let completed = false;
let firstDraw = true;
//
function preload(){
  darkGrainShader = loadShader('./shader-grain.vert', './shader-grain.frag');
  lightGrainShader = loadShader('./shader-grain.vert', './shader-grain.frag');
  noiseGrainShader = loadShader('./shader-noise.vert', './shader-noise.frag');
}

class Random {
  random_dec() { return fxrand();}
  random_num(a, b) { return a+(b-a)*this.random_dec();}
  random_int(a, b) { return Math.floor(this.random_num(a, b+1));}
}
const R = new Random()

//FEATURES
let dummy = R.random_int(0,255);
coveredArea = dummy >= 150 ? 1 : dummy >= 50 ? 0.6 : 0.3;
palette = palettes[R.random_int(0, palettes.length-1)];
paletteName = palette[0];
dummy = R.random_int(0, 5);
orientAngle = dummy > 4 ? 180 : dummy > 3 ? 0 : dummy > 2 ? -90 : dummy > 1 ? 45-(90*R.random_int(0,1)) : R.random_int(15, 30) + 90*R.random_int(0, 3);
matchingColor = R.random_int(0,255) < 68 ? true: false;
dummy = R.random_int(0,255);
maxGap = dummy > 220 ? minGap : dummy > 128 ? 150 : dummy > 40 ? 250 : dummy > 18 ? 350: 500;
if((R.random_dec()>0.8) || (minGap == maxGap)){
  minGap = maxGap;
  sameGaps = true;
}
dummy = R.random_int(0,255);
gapPosition = dummy >128 ? "Free" : dummy >60 ? "Middle" : dummy >30 ? "Top" : "Bottom";
dummy = R.random_int(0,255);
gapOrdering = dummy > 128 ? "None" : ((gapPosition != "Free")&&(!sameGaps))? "Ordered": "None";
sameWidths = R.random_int(0,255) > 180 ? true : false;
overlapping = R.random_int(0,255) > 120 ? true : false;
gut = overlapping ? gut : R.random_dec() > 0.5 ? R.random_int(4, 60) : gut;
framed = R.random_int(0,255) > 120 ? true : false;
plugs = R.random_int(0,255) > 90 ? true : false;
dummy = R.random_int(0,255);
maxWidth = dummy > 245 ? 650 : dummy > 190 ? 300 : 170;
dummy = R.random_int(0,255);
cabsType = dummy > 190 ? "Mixed" : dummy > 170 ? "Outlined" : "Filled";
if((R.random_dec() > 0.3)&&(coveredArea > 0.4)){
  coveredArea = 1;
  maxWidth = minWidth*3;
  gapPosition = "Free";
  plugs = true;
}
let f = {
  "Palette": palette[0],
  "Covered Area": (coveredArea >= 0.5 ? "> 50%": "< 50%"),
  "Orientation" : (((orientAngle == 0)||(orientAngle == 180)) ? "Vertical" : orientAngle == -90 ? "Horizontal" : "Diagonal"),
  "Overlapping": (overlapping? "Allowed" : "No"),
  "Thickness" : (sameWidths? "Matching" : "Free"),
  "Cut position" : (gapPosition == "Free" ? "Free" : "Fixed"),
  "Frame" : (framed? "Yes" : "No"),
  "Drawing Mode" : cabsType,
  "Extrusions" : (plugs? "Yes" : "No")
}
window.$fxhashFeatures = f;
//END
class Cab {
  constructor(width, gap, x, plug, plugH, wired, tp){
    this.w = width;
    this.ct = palette[R.random_int(3, palette.length-1)];
    this.cb = matchingColor ? this.ct : palette[R.random_int(3, palette.length-1)];
    this.gap = gap;
    this.x = x;
    this.tp = tp;
    this.plug = plug;
    this.plugH = plugH;
    this.wired = wired;
    this.bp = tp;
  }
  display(){
    let safer = 300;
    this.bp = createVector(this.x, this.tp.y + this.gap);
    bc.push(); 
    if(this.wired){
      bc.fill(palette[1]);
      bc.strokeWeight(2*M);
      bc.stroke(this.cb);
      bc.rect(this.bp.x-this.w/2, this.bp.y, this.w, myHEIGHT+safer*M);
      bc.ellipse(this.bp.x, this.bp.y, this.w, this.w/2);
      bc.fill(this.cb);
      bc.noStroke();
      bc.ellipse(this.bp.x, this.bp.y, this.w*0.6, this.w*0.3); 
      if(this.plug){
        bc.fill(this.cb);
        bc.ellipse(this.bp.x, this.bp.y-this.plugH, this.w*0.6, this.w*0.3);
        bc.stroke(this.cb);
        bc.strokeWeight(this.w*0.6);
        bc.strokeCap(SQUARE);
        bc.line(this.bp.x, this.bp.y, this.bp.x, this.bp.y-this.plugH);
        shadowGrain(this.w*0.6, this.bp.x-(this.w*0.6/2), this.bp.y-this.plugH, this.plugH, this.cb);   
        bc.noStroke();
        bc.fill(modifyColor(this.cb, +15));
        bc.ellipse(this.bp.x, this.bp.y-this.plugH, this.w*0.6, this.w*0.3);
        bc.strokeCap(ROUND);
      }
      bc.fill(palette[1]);
      bc.noStroke();
      bc.rect(this.x-this.w/2, -safer*M, this.w, this.tp.y+safer*M);
      bc.stroke(this.ct);
      bc.strokeWeight(2*M);
      bc.line(this.x-this.w/2, -safer*M, this.x-this.w/2, this.tp.y);
      bc.line(this.x+this.w/2, -safer*M, this.x+this.w/2, this.tp.y);
      bc.arc(this.x, this.tp.y-1, this.w, this.w/2, 0, 180, OPEN);
    }else{
      bc.strokeCap(SQUARE);
      if(overlapping){
        let sepC = modifyColor(this.cb, -15);
        bc.stroke(sepC);
        bc.strokeWeight(this.w+2*M);
        bc.line(this.bp.x, this.bp.y, this.bp.x, myHEIGHT+safer*M);
        bc.noStroke();
        bc.fill(sepC);
        bc.ellipse(this.bp.x, this.bp.y, this.w+2*M, this.w/2+2*M);
      }   
      bc.noStroke();
      let glb = this.bp.y+(this.w/2);
      bc.push();
      let gradientb = drawingContext.createLinearGradient(0, glb, 0, myHEIGHT > (glb + 80*M) ? myHEIGHT : myHEIGHT+300*M);
      gradientb.addColorStop(0, this.cb);
      gradientb.addColorStop(1, modifyColor(this.cb, -25));
      drawingContext.save();
      bc.drawingContext.fillStyle = gradientb;
      bc.drawingContext.fillRect(this.bp.x-this.w/2, this.bp.y, this.w, myHEIGHT-this.bp.y+safer*M);
      drawingContext.restore();
      bc.pop();
      shadowGrain(this.w, this.bp.x-this.w/2, this.bp.y, myHEIGHT-this.bp.y+safer*M, this.cb);
      bc.stroke(this.cb);
      let strW = overlapping? 1*M : 2*M;
      bc.strokeWeight(strW);
      bc.fill(palette[2]);
      bc.ellipse(this.bp.x, this.bp.y, this.w-strW, this.w/2-strW);
      bc.noStroke();
      if(this.plug){
        bc.fill(this.cb);
        bc.ellipse(this.bp.x, this.bp.y, this.w*0.6, this.w*0.3);
        bc.ellipse(this.bp.x, this.bp.y-this.plugH, this.w*0.6, this.w*0.3);
        bc.stroke(this.cb);
        bc.strokeWeight(this.w*0.6);
        bc.line(this.bp.x, this.bp.y, this.bp.x, this.bp.y-this.plugH);
        shadowGrain(this.w*0.6, this.bp.x-(this.w*0.6/2), this.bp.y-this.plugH, this.plugH, this.cb);
        bc.noStroke();
        bc.fill(modifyColor(this.cb, +15));
        bc.ellipse(this.bp.x, this.bp.y-this.plugH, this.w*0.6, this.w*0.3);
      }else{
        bc.fill(this.cb+"99");
        bc.ellipse(this.bp.x, this.bp.y, this.w*0.6, this.w*0.3);  
      }
      if(overlapping){
        let sepC = modifyColor(this.ct, -15);
        bc.stroke(sepC);
        bc.strokeWeight(this.w+2*M);
        bc.line(this.x, -safer*M, this.x, this.tp.y);
        bc.fill(sepC);
        bc.noStroke();
        bc.ellipse(this.x, this.tp.y, this.w+2*M, this.w/2+2*M);
      }
      bc.noStroke();
      let gl = this.tp.y-(this.w/2);
      bc.push();
      let gradientt = drawingContext.createLinearGradient(0, gl<80*M? gl-300*M : 0, 0, gl);
      gradientt.addColorStop(0.8, this.ct);
      gradientt.addColorStop(0, modifyColor(this.ct, -25));
      drawingContext.save();
      bc.drawingContext.fillStyle = gradientt;
      bc.drawingContext.fillRect(this.x-this.w/2, -safer*M, this.w, this.tp.y+safer*M);
      drawingContext.restore();
      bc.pop();
      bc.noStroke();
      bc.fill(this.ct);
      bc.ellipse(this.x, this.tp.y, this.w, this.w/2);
      shadowGrain(this.w, this.tp.x-this.w/2, -safer*M, this.tp.y+safer*M, this.ct);
    }
    bc.pop();
  }
}

function setup() {
  print(gapOrdering);
  for(let s = 0; s <= 100; s++){
    sinFromCos[s] = sin(acos(s/100))/2;
  }
  pixelDensity(1);
  M = WH_REAL_R >= WH_DEF_R ? myHEIGHT / DEF_H : myWIDTH / DEF_W;
  print (M);
  bc = createGraphics(myWIDTH, myHEIGHT);
  canvasW = window.innerWidth;
  canvasH = window.innerHeight;
  if(canvasW > canvasH){
    canvasW = canvasH;
  }else{
    canvasH = canvasW;
  }
  generateCabs();
  createCanvas(canvasW, canvasH);
  noLoop();
}

function generateCabs(){
  let defW = R.random_int(minWidth, maxWidth);
  let realW = Math.round(defW*M);
  totW = defW;
  let prevLimit = totW*M;
  let gapC = Math.ceil(R.random_int(minGap, maxGap)*M);
  let xC = Math.floor(realW/2);
  let plugC = false;
  let pH = 0;
  if(plugs && R.random_dec() >0.6){
    plugC = true;
    pH = Math.floor(R.random_num(10*M, gapC*0.7));
    assignedPlugs = true;
  }
  let outlinedC = false;
  if(cabsType == "Outlined"){
    outlinedC = true;
  }else if (cabsType == "Mixed"){
    let d = R.random_dec();
    outlinedC = d >= 0.5 ? true: false;
    assignedTypes[Math.round(d)]++;
  }
  let tp;
  if(gapPosition == "Middle"){
    tp = createVector(xC, (myHEIGHT - gapC)/2);
  }else if (gapPosition == "Free"){
    tp = createVector(xC, R.random_int(minWidth*M, myHEIGHT - minWidth*M - gapC));
    if(tp.y/M > (DEF_H-defW-(gapC/M))){
        tp.y -= 60*M;
      }
  }else if (gapPosition == "Top"){
    tp = createVector(xC, 130*M);
  }else{
    tp = createVector(xC, myHEIGHT - 130*M - gapC);
  }
  let genCab = new Cab(realW, gapC, xC, plugC, pH, outlinedC, tp);
  cabs.push(genCab);
  let assignedContrast = false;
  while((DEF_W/totW) > (1/coveredArea)){
    let deltaX = overlapping? R.random_int(Math.round(-defW/2+10), gut) : gut;
    if(!sameWidths && (R.random_dec() > 0.88) && !assignedContrast){
      defW = Math.min(400, maxWidth*2.5);
      assignedContrast = true;
    }else{
      defW = !sameWidths? R.random_int(minWidth, maxWidth) : defW;  
    }
    realW = Math.round(defW*M);
    
    if (deltaX < (-defW/2+10)){
      deltaX = Math.round(-defW/2+10);
    }
    gapC = Math.ceil(R.random_int(minGap, maxGap)*M);
    xC = prevLimit + deltaX*M + Math.round(realW/2);
    let pH = 0;
    let plugC = false;
    if(plugs && R.random_dec() >0.6){
      plugC = true;
      pH = Math.floor(R.random_num(10*M, gapC*0.7));
      assignedPlugs = true;
    }
    if(cabsType == "Outlined"){
      outlinedC = true;
    }else if (cabsType == "Mixed"){
      let d = R.random_dec();
      outlinedC = d >= 0.5 ? true: false;
      assignedTypes[Math.round(d)]++;
    }
    let tp;
    if(gapPosition == "Middle"){
      tp = createVector(xC, (myHEIGHT - gapC)/2); 
    }else if (gapPosition == "Free"){
      tp = createVector(xC, R.random_int(minWidth*M, myHEIGHT - minWidth*M - gapC));
      if(tp.y/M > (DEF_H-defW-(gapC/M))){
        tp.y -= 60*M;
      }
    }else if (gapPosition == "Top"){
      tp = createVector(xC, 130*M);
    }else{
      tp = createVector(xC, myHEIGHT - 130*M - gapC);
    }
    let genCab = new Cab(realW, gapC, xC, plugC, pH, outlinedC, tp);
    cabs.push(genCab);
    prevLimit += deltaX*M + realW;
    totW += (defW+deltaX);
  }
  nCabs = cabs.length;
  if((plugs && !assignedPlugs) || (plugs && ((orientAngle == 45 || orientAngle == -45) && coveredArea >=0.7))){
    print("Forced plug");
    cabs[Math.floor(nCabs/2)].plug=true;
  }
  if(cabsType == "Mixed"){
    if (assignedTypes[0] <= 0){
      cabs[Math.floor(nCabs/2)].wired = false;
    }else if (assignedTypes[1] <= 0){
      cabs[Math.floor(nCabs/2)].wired = true;
    }
  }
  if(gapOrdering == "Ordered"){
    let gaps = [];
    for (let i = 0; i < nCabs; i++){
      gaps.push(Math.ceil(R.random_int(minGap, maxGap)*M));
    }
    gaps.sort(compareNumbers);
    if(R.random_dec() > 0.5){
      gaps.reverse();  
    }
    for (let i = 0; i < nCabs; i++){
      cabs[i].gap = gaps[i];
      if(gapPosition == "Middle"){
        cabs[i].tp = createVector(cabs[i].x, (myHEIGHT - gaps[i])/2);
      }else if (gapPosition == "Free"){
        cabs[i].tp = createVector(cabs[i].x, R.random_int(minWidth*M, myHEIGHT - minWidth*M - gaps[i]));
        if(tp.y/M > (DEF_H-defW-(gaps[i]/M))){
          cabs[i].tp.y -= 60*M;
        }
      }else if (gapPosition == "Top"){
        cabs[i].tp = createVector(cabs[i].x, 130*M);
      }else{
        cabs[i].tp = createVector(cabs[i].x, myHEIGHT - 130*M - gaps[i]);
      }
      if(cabs[i].plug){
        cabs[i].plugH = Math.floor(R.random_num(10*M, gaps[i]*0.7));   
      }
    }
  }
  if(overlapping){
    for(let i = 0; i < nCabs-1; i++){
      if(cabs[i].ct == cabs[i+1].ct){
        cabs[i+1].ct = modifyColor(cabs[i].ct, -6)
      }
      if(cabs[i].cb == cabs[i+1].cb){
        cabs[i+1].cb = modifyColor(cabs[i].cb, -6)
      }
    }
  }
  cabs = shuffleA(cabs);
}

function draw() {
  if(!resizing){
  bc.push();
  if(!darkGrainLayer){
    darkGrainLayer = createGraphics(myWIDTH, myHEIGHT, WEBGL);
    lightGrainLayer = createGraphics(myWIDTH, myHEIGHT, WEBGL);
    shLayer = createGraphics(myWIDTH, myHEIGHT, WEBGL);
  }
  shLayer.noStroke();
  shLayer.angleMode(DEGREES);
  shLayer.shader(noiseGrainShader);
  noiseGrainShader.setUniform("col", [1.0, 1.0 ,1.0]);
  noiseGrainShader.setUniform("u_resolution", [myWIDTH, myHEIGHT]);
  shLayer.rect(0, 0, myWIDTH, myHEIGHT);
  bc.ellipseMode(CENTER);
  bc.angleMode(DEGREES);
  bc.strokeCap(ROUND);
  bc.push();
  bc.noStroke();
  bc.background("#FFFFFF");
  let gradient = drawingContext.createLinearGradient(0, 0, 0, myHEIGHT);
  gradient.addColorStop(0, modifyColor(palette[1], -10));
  gradient.addColorStop(0.3, palette[1]);
  gradient.addColorStop(0.7, palette[1]);
  gradient.addColorStop(1, modifyColor(palette[1], -30));
  drawingContext.save();
  bc.drawingContext.fillStyle = gradient;
  bc.drawingContext.fillRect(0, 0, myWIDTH, myHEIGHT);
  drawingContext.restore();
  bc.pop();
  addGrain(0.04, 0.1);
  bc.push();
  bc.translate(myWIDTH/2, myHEIGHT/2);
  bc.rotate(orientAngle);
  bc.translate(-myWIDTH/2, -myHEIGHT/2);
  bc.translate(Math.floor((myWIDTH - totW*M)/2), 0);
  for(let i = 0; i < nCabs; i++){
    cabs[i].display();
  }
  bc.pop();
  addGrain(0.105, 0.1);
  bc.blendMode(MULTIPLY);
  bc.image(shLayer, 0, 0);
  addFrame();
  bc.pop();
  image(bc, 0, 0, canvasW, canvasW);
  completed = true;
  if(firstDraw){
    fxpreview();
    firstDraw = false;
  }
  }
}

function shadowGrain(w, x, y, h, col){
  if(shaded){
    bc.push();
    bc.strokeWeight(0.55*M);
    let tlp = createVector(x,y);
    let d = 1.1*M;
    let p = 0.32;
    if(w<70*M){
      p = 0.25;
      bc.stroke(modifyColor(col, -70));
    }else{
      bc.stroke(modifyColor(col, -100));
    }
    let k = 1-p;
    let l = w*(1-p);
    let a = 1/p;
    let b = 1-a;
    let xR = tlp.x+w;
    let xL = tlp.x;
    let xM = xL+l;
    let lh = tlp.y+h-d;
    let r = w/2;
    h += w/4;
    for(let y = tlp.y; y < tlp.y+h ; y+=d){
      for(let x = xL; x < xR ; x+=d){
        let g = map(x, xL,xR, 0, 1);
        if(g > k){
          let js = Math.floor(map(g, 0.5, 1, 0, 100));
          let maxY = lh+(sinFromCos[js]*r);
          if(y < maxY){
            if(R.random_dec() < (a*g+b)){
              let deltaX = R.random_dec()*d - (d/2);
              let deltaY = R.random_dec()*d - (d/2);
              if(x+deltaX > xR){
                deltaX = 0;
              }
              bc.point(x+deltaX, y+deltaY);
            }  
          }
        }
      }
    }
    bc.pop();  
  }
}

function compareNumbers(a, b){
  return (a-b);
}

function addGrain(thD, thL){
  bc.push();
  darkGrainLayer.shader(darkGrainShader);
  darkGrainLayer.noStroke();
  darkGrainShader.setUniform("lum", 0.0);
  darkGrainShader.setUniform("th", thD);
  darkGrainShader.setUniform("ra", 12.9898)
  darkGrainLayer.rect(0, 0, myWIDTH, myHEIGHT);
  bc.blendMode(MULTIPLY);
  bc.image(darkGrainLayer, 0, 0);
  lightGrainLayer.shader(lightGrainShader);
  lightGrainLayer.noStroke();
  lightGrainShader.setUniform("lum", 1.0);
  lightGrainShader.setUniform("th", thL);
  lightGrainShader.setUniform("ra", 12.9734)
  lightGrainLayer.rect(0, 0, myWIDTH, myHEIGHT);
  bc.blendMode(SCREEN);
  bc.image(lightGrainLayer, 0, 0);
  bc.pop();
}

function addFrame(){
  if(framed){
    bc.push();
    bc.blendMode(BLEND);
    bc.noFill();
    bc.stroke(palette[2]);
    bc.strokeWeight(40*M);
    bc.rect(0,0,myWIDTH,myHEIGHT);
    bc.pop();
  }
}

function shuffleA(array) {
  let m = array.length, t, i;
  while (m) {
    i = Math.floor(R.random_dec() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function gradientRect(x, y, w, h, c1, c2) {
  bc.push();
  bc.noFill();
  bc.strokeWeight(1);
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    bc.stroke("#FF0000FF");
    bc.line(x, i, x + w, i);
  }
  bc.pop();
}

function modifyColor(color, deltaC) {
  let rgb = [parseInt(color.substring(1,3), 16), parseInt(color.substring(3,5), 16), parseInt(color.substring(5,7), 16)];
  for(let i=0; i<3; i++){
    rgb[i] = "0"+(Math.min(255, Math.max(0, rgb[i]+deltaC))).toString(16);
    rgb[i] = rgb[i].substring(rgb[i].length - 2);
  }
  let nc = "#"+rgb[0]+""+rgb[1]+""+rgb[2];
  return nc;
}

function keyTyped() {
  if (key === 's') {
    let fileName = "cuts-"+fxhash+".png";
    bc.save(fileName);
  }
  if (key === 't') {
    if(completed){
      completed = false;
      background(128);
      shaded = !shaded;
      resizing = false;
      setTimeout(redraw, 100);  
    }
  }
  if (key === 'f'){
    console.log("### Features ###\nPalette: "+f["Palette"]+"\nCovered Area: "+f["Covered Area"]+"\nOrientation: "+f["Orientation"]+"\nOverlapping: "+f["Overlapping"]+"\nThickness: "+f["Thickness"]+"\nCut position: "+f["Cut position"]+"\nFrame: "+f["Frame"]+"\nDrawing Mode: "+f["Drawing Mode"]+"\nExtrusions: "+f["Extrusions"]+"\n\n### Hash ###\n"+fxhash);
  }
  if (key === 'c'){
    alert("Cuts\nBy Todemashi\nMarch 2022\nLicensed under NFT License 2.0");
  }
  return false;
}

function windowResized() {
  if(windowWidth > windowHeight){
    resizing = true;
    resizeCanvas(windowHeight, windowHeight);
    canvasW = canvasH = windowHeight;
    image(bc, 0, 0, windowHeight, windowHeight);
  }else{
    resizing = true;
    resizeCanvas(windowWidth, windowWidth);
    canvasW = canvasH = windowWidth;
    image(bc, 0, 0, windowWidth, windowWidth);
  }
}