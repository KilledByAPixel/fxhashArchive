////////////////////////////////////////////////////////////////////////////////////////////
// RAUSCH
// by Grasser Alexander. 2023 @grasser_alex

let fx=true;

let canvas;
let webglC;
let bT1, bT2, bT3, bT4;
let mT1, mT2, mT3, mT4;
let run1,run2,run2b,run3,run4,run5,run6,run;
run1=run2=run2b=run3=run4=run5=run6=run=0;
let runV1 =    false;
let runV1toV2= false;
let runV2toV1= false; 
let runV2 =    false;
let runV1toV3= false;
let runV3 =    false;
let runV3toV1= false;
let drun=false;
let runFrames=true;
let runFCl=0;
let recomputeAll= false;
let resized =false;
let shareSize=false;
let frames = [];
let framesDither = [];
let framesPIXEL = [];
let fV1 = [];
let fV1toV2 = [];
let fV2 = [];
let fV2toV1 = [];
let fV1toV3 = [];
let fV3 = [];
let fV3toV1 = [];
let distScaleW = [];
let distScaleH=[];
let rndW = [];
let rndSto = [];
let frCount = 12; 
let cSize1 = 128;
let cSize2 = 128;
let seed;
let rndEr;
let cSize5w;
let cSize5h;
let cSize4w; 
let cSize4h; 
let canvasSizeW; 
let canvasSizeH;
let anim=true;
let dit=true;  
let longGif=false;
let runLong=0;
let longestGif=false;
let runLong2=0;
let F_P,F_L,F_S,F_A4;
let cSSet1=["16:9","9:16","1:1","1:1","A4","9:16","A4","9:16","A4","9:16","1:1","A4"];
let cSz;
let moveV;
let moveR;
let runSet=["V1","V2","V3"];
let runStart;
let ditherScaleFPa =[1,1,1,1,2,2,2,2,2,2,2,2,4,4,4,4,4,4,6,6,6,8,8];
let ditherScaleF;
let ditherScaleFactors =[];
let ditherScalew;
let ditherScaleh;
let camdist; 
let cZFSet=[0.6,0.6,0.6,0.86,0.86,0.86,0.86,1.25,1.25,1.25,1.25];
let cZF;
let sizeFH, sizeFW1;
let stoSet = [1,2,2,2,3,3,3,3,3,3,3,3,4,4,4,4,4,5,5,5,5,5,5,5];
let sto;
let sizeBox;
let sizeBoxF=0.05;
let gsSet=[3,3,4,4,4,5,5,5,6,6,7];
let gs; 
let gsS00=[];
let gsS01=[7,6,5,4,3];
let gsS02=[3,4,5,6,7];
let gsSetAll=[gsS01,gsS02,gsS00,gsS00,gsS00]
let gsSet01;
let gsdT; 
let gTypeSet=[0,0,0,0,0,0,1,1,2,2,2,2,2,2,2];
let gType;
let gsdv;
let gsdF; 
let scalePlateSet =[1,1,1,1,1.1,1.2,1.2];
let scalePlate; 
let wbr = 0.1;
let tSSet= [1.5,1.5,1.5,1.5,1.5,1.5,2,2,2,2,2,2,2,2,2,2,2,4,4];
let tS;
let tSW=1; 
let scTexSet1 = [0.008,0.008,0.008,0.008,0.008,0.008,0.008,0.008,0.008,0.009,0.009,0.01,0.01,0.01,0.01,0.015,0.05,0.1,0.25];
let scaleTex; 
let strokeWPXLSet=[2,2,2,2,3,4];
let strokeWPXL;
let p01=["#EAEAEA","#00838a","#f2cdcf","#ff7477","#ffb511","#3D5588"];  let p01TX="LIGHTGRAY-TEAL-BISQUE-FLUOORANGE-SUNFLOWER-FEDBLUE";
let p02=["#E0E0E0","#303130","#ff665e","#3255a4"];  let p02TX="LIGHTGRAY-BLACK-RED-MEDBLUE";
let p03=["#E0E0E0","#303130","#3255a4","#ff665e"];  let p03TX="LIGHTGRAY-BLACK-MEDBLUE-RED";
let p04=["#D9D9D9","#00838a","#375e77","#ff7477"]; let p04TX="LIGHTGRAY-TEAL-STEEL-FLUOORANGE";
let p05=["#D9D9D9","#00838a","#ff7477","#375e77"]; let p05TX="LIGHTGRAY-TEAL-FLUOORANGE-STEEL";
let p06=["#F2F2F2","#ff48b0","#3255a4","#ffe800"]; let p06TX="LIGHTGRAY-FLUOPINK-MEDBLUE-YELLOW";
let p07=["#F2EADF","#0078bf","#ffe800","#ff665e"]; let p07TX="LIGHTGRAY-BLUE-YELLOW-RED";
let p08=["#F2EADF","#3D5588","#e45d50","#f2cdcf"]; let p08TX="LIGHTGRAY-FEDBLUE-CRIMSON-BISQUE";
let p09=["#F2F2F2","#303130","#3D5588","#ffb511"]; let p09TX="LIGHTGRAY-BLACK-FEDBLUE-SUNFLOWER";
let p10=["#F2E6D8","#ffb511","#e45d50","#00838a"];  let p10TX="LIGHTGRAY-SUNFLOWER-CRIMSON-TEAL";
let p11=["#F0F2F2","#ffe800","#3255a4","#ff665e"];  let p11TX="LIGHTGRAY-YELLOW-MEDBLUE-RED";
let p12=["#EAEAEA","#00838a","#ffb511","#e45d50","#f2cdcf"];  let p12TX="LIGHTGRAY-TEAL-SUNFLOWER-CRIMSON-BISQUE";
let p13=["#D5D5D5", "#303130", "#303130", "#303130"]; let p13TX="LIGHTGRAY-BLACK";
let pm1=["#FFFFFF", "#000000", "#000000", "#000000"]; 
let pd01 = ["#262526","#B8D9C0","#AD84BF","#FF4C65"]; let pd01TX="BLACK-MINT-PURPLE-FLUORED";
let pd02 = ["#2C2C2C","#05F29B","#FF4C65","#ff48b0","#F2F2F2"]; let pd02TX="BLACK-FLUOGREEN-FLUORED-FLUOPINK-LIGHTGRAY";
let pd03 = ["#010326","#3255a4","#FF4C65","#ffe800","#F2F2F2"]; let pd03TX="BLACK-MEDBLUE-FLUORED-YELLOW-LIGHTGRAY";
let pd04 = ["#000000","#00FF00","#FF0000","#0000FF"]; let pd04TX="BLACK-GREEN-RED-BLUE";
let pd05 = ["#000000","#FFFFFF","#FF0000","#0000FF"];  let pd05TX="BLACK-WHITE-RED-BLUE";
let pd06 = ["#000000","#FFFFFF","#0000FF","#FF0000"];  let pd06TX="BLACK-WHITE-BLUE-RED";
let pdm1 = ["#000000","#FFFFFF","#FFFFFF","#FFFFFF"];  
let pSet=[];
let pSel;
let sc;
let pRGB =[];
let monoPal01= [255, 0, 0, 255, 255, 255]; //RED
let monoPal02= [0, 255, 0, 255, 255, 255]; //GREEN
let monoPal03= [0, 0, 255, 255, 255, 255]; //BLUE
let monoPal04= [0, 0, 0, 255, 255, 255];   //BLACK-WHITE
let monoPal05= [242, 242, 242, 213, 213, 213]; //GRAY
let monoPal06= [242, 242, 242, 255, 116, 119];  //FLUOORANGE
let monoPal07= [242, 242, 242, 5, 242, 155];   //FLUOGREEN
let monoPal08= [242, 242, 242, 255, 72, 176 ];  //FLUOPINK
let monoPal09= [242, 242, 242, 255, 76, 101 ];  //FLUORED
let monoSet =    [monoPal01,monoPal02,monoPal03,monoPal04,monoPal05,monoPal06,monoPal07,monoPal08,monoPal09];
let monoSetTXT = ["RED","GREEN","BLUE","BLACK-WHITE","GRAY","FLUOORANGE","FLUOGREEN","FLUOPINK","FLUORED"];  
let palette2C;

//_______________________________________________________________________________________

let bg; 
let bgTXT;
if(!fx) {if(Math.random()<0.3) {bg=0; bgTXT="Dark"}else {bg=255; bgTXT="Bright";}}
   else {if(fxrand()<0.3)      {bg=0; bgTXT="Dark"}else {bg=255; bgTXT="Bright";}}

let monoMode; 
let monoModeTXT;

if (bg==0){
  if(!fx){if(Math.random()<0.25){monoMode=false;monoModeTXT="Polychrome";}else {monoMode=true;monoModeTXT="Monochrome";}}
   else{if(fxrand()<0.25)       {monoMode=false;monoModeTXT="Polychrome";}else {monoMode=true;monoModeTXT="Monochrome";}}  
}
if (bg==255){
  if(!fx){if(Math.random()<0.75){monoMode=false;monoModeTXT="Polychrome";}else {monoMode=true;monoModeTXT="Monochrome";}}
   else{if(fxrand()<0.75)       {monoMode=false;monoModeTXT="Polychrome";}else {monoMode=true;monoModeTXT="Monochrome";}}  
}


let errMode;
let err1=false;
let err2=false;
let err3=false;
let errModeTXT;
if(!fx){ if(Math.random()<0.2) {errMode=false;errModeTXT="OFF";}else {errMode=true; }}
   else{ if(fxrand()<0.2)     {errMode=false;errModeTXT="OFF";}else {errMode=true; }}

if(errMode){
if(!fx) { rndEr = Math.random();}
  else  { rndEr = fxrand();}
   if(rndEr<0.6)               {err1=true ; errModeTXT="ON_V1"; }
   if(rndEr>=0.6 && rndEr<=0.75){err2=true;  errModeTXT="ON_V2"; }
   if(rndEr>0.75)               {err3=true ; errModeTXT="ON_V3"; }   
}

let gsdTTXT;
if(!fx){if(Math.random()<0.33) {gsdT=false;gsdTTXT="ON";}else {gsdT=true;gsdTTXT="OFF";}}
  else{if(fxrand()<0.33)       {gsdT=false;gsdTTXT="ON";}else {gsdT=true;gsdTTXT="OFF";}}

//_______________________________________________________________________________________
if (errMode){
  if(err1)ditherScaleFPa =[1,1,1,1,1,1,1,1,2,2,2,2];
  if(err2)ditherScaleFPa =[1,1,2,2,2,2,2,2,4,4,4,6];
  if(err3)ditherScaleFPa =[1,1,1,1,1,2,2,2,2,2,2,2,2,2,4,4];
} 
for(let i =0; i <=2; i++){
  let ditherScaleFSel =getfxRange(0,ditherScaleFPa.length-1);
  ditherScaleF = ditherScaleFPa[ditherScaleFSel];
  ditherScaleFactors.push(ditherScaleF)
} let ditherScaleFTXT= ditherScaleFactors[0]+"-"+ditherScaleFactors[1]+"-"+ditherScaleFactors[2];

let cSSet1sel =getfxRange(0,cSSet1.length-1);
cSz = cSSet1[cSSet1sel];

let tSSetSel =getfxRange(0,tSSet.length-1);
tS = tSSet[tSSetSel];
if (tS > 4){scTexSet1=[0.05,0.1,0.25,0.25];}

let pSelscTex=getfxRange(0,scTexSet1.length-1);
  scaleTex = scTexSet1[pSelscTex];

let cZFSetSel =getfxRange(0,cZFSet.length-1);
  cZF = cZFSet[cZFSetSel];

//_______________________________________________________________________________________
let pSetTXT; 
if(bg==0){sc=255; 
          pSet=[pd01,pd02,pd03,pd04,pd05,pd06];
          pSetTXT=[pd01TX,pd02TX,pd03TX,pd04TX,pd05TX,pd06TX];
  if(monoMode) pSet= [pdm1]; 
}else{sc=0; 
      pSet=[p01,p02,p03,p04,p05,p06,p07,p08,p09,p10,p11,p12,p13,p13];
      pSetTXT=[p01TX,p02TX,p03TX,p04TX,p05TX,p06TX,p07TX,p08TX,p09TX,p10TX,p11TX,p12TX,p13TX,p13TX];
  if(monoMode) pSet= [pm1]; 
}    


let pSelInt=getfxRange(0, pSet.length-1);
  pSel = pSet[pSelInt];
let pSelTXT= pSetTXT[pSelInt];
  
let pSelMonoInt = getfxRange(0, monoSet.length-1);
  palette2C = monoSet[pSelMonoInt];  
let palette2CTXT= monoSetTXT[pSelMonoInt]; 

let paletteTXT=pSelTXT;
if(monoMode){paletteTXT=palette2CTXT;}

//_______________________________________________________________________________________


function getfxRange(min, max) { 
    min = Math.ceil(min);
    max = Math.floor(max);
   if(!fx){ return Math.floor(Math.random() * (max - min + 1)) + min;  }
      else{ return Math.floor(fxrand() * (max - min + 1)) + min; }
} 


window.$fxhashFeatures = {
  "Rauschen" : errModeTXT,
  "AspectRatio": cSz,
  "Background" : bgTXT,
  "ColorMode" : monoModeTXT,
  "Palette": paletteTXT,
  "PXLScale": ditherScaleFTXT,   
  "PatternSP":tS,
  "PatternSC":scaleTex,
  "Dense" : gsdTTXT,
  "Zoom":cZF

}

console.log("Rauschen: " + errModeTXT);
console.log("AspectRatio: "+ cSz);
console.log("Background: " + bgTXT);
console.log("ColorMode: " + monoModeTXT);
console.log("Palette: " + paletteTXT);
console.log("PXLScale: "+ ditherScaleFTXT);
console.log("PatternSP: "+tS);
console.log("PatternSC: "+scaleTex);
console.log("Dense: " + gsdTTXT);
console.log("Zoom: " + cZF);
////////////////////////////////////////////////////////


function setup() {
if(fx)seed= int(fxrand() * 100000000)
if(fx)console.log("Seed: " + seed); 
if(fx)randomSeed(seed); 
  
  setupRndP();
   
  setupAllCanv();
  setupT1();setupT2();setupT3(); setupT4();
 
  if (dit) {
    create3DScene();
    create3DSceneMove();    
    create3DSceneMove2();
    create3DSceneMove3();
    create3DSceneMove4();   
    scaleFramesDither();
    makeDitherStartFrame();
    makeDither();  
    sortPXLFrames(); 
    frames = [];
    framesDither = [];
    framesPIXEL = [];
  } 
}

function draw() {
frameRate(frCount);
if (frCount==24 && errMode)frameRate(frCount/2);
  
noSmooth();
   
if(runFrames){ 
if(anim){
  if (frameCount>frCount*5){
  if (frameCount % frCount*2 == 0){ 
     let rndF; 
     if (random()<0.2){
     rndF=floor(random(0,4)); 
     } 
 switch (rndF) {
    case 0:
    runV1toV2 = true;
    runV1=runV2toV1=runV2=runV1toV3=runV3=runV3toV1=false;
    break;
    case 1:  
    runV2toV1 = true;
    runV1=runV1toV2=runV2=runV1toV3=runV3=runV3toV1= false;
    break;
    case 2:  
    runV1toV3 = true;
    runV1=runV1toV2=runV2toV1=runV2=runV3= false;
    break;    
    case 3:
    runV3toV1 = true;
    runV1 = runV1toV2=runV2toV1=runV2=runV1toV3=runV3= false;   
    break;
 }
}
 }
}
/////////////////////////////////////////////   
gifExporter(); 
  
if(!recomputeAll){    
  if (dit) {
    if (drun) {     
      if (runV1) {
        image(fV1[run1], 0, 0, canvas.width, canvas.height);
        run1++;
        if (run1 >= fV1.length) run1 = 0;
      }
      if (runV1toV2) {
        image(fV1toV2[run2], 0, 0, canvas.width, canvas.height);
        run2++;
        if (run2 >= fV1toV2.length) {run2 = 0; runV1toV2 = false; runV2 = true; }
      }
      if (runV2) {
        image(fV2[run3], 0, 0, canvas.width, canvas.height);
        run3++;
        if (run3 >= fV2.length) run3 = 0;
      }
      if (runV2toV1) {
        image(fV2toV1[run2b], 0, 0, canvas.width, canvas.height);
        run2b++;
        if (run2b >= fV2toV1.length) {run2b = 0;runV2toV1 = false; runV1 = true; }
      }
      if (runV1toV3) {
        image(fV1toV3[run4], 0, 0,canvas.width, canvas.height);
        run4++;
        if (run4 >= fV1toV3.length) {run4 = 0; runV1toV3 = false; runV3 = true; }
      }
      if (runV3) {
        image(fV3[run5], 0, 0, canvas.width, canvas.height);
        run5++;
        if (run5 >= fV3.length) run5 = 0;
      }
      if (runV3toV1) {
        image(fV3toV1[run6], 0, 0, canvas.width, canvas.height);
        run6++;
        if (run6 >= fV3toV1.length) { run6 = 0; runV3toV1 = false; runV1 = true; }
      }
    }       
  }
} 
}
  
}

function setupRndP(){
moveV = floor(random(0, 5));
moveR = floor(random(5, 7));  
let runSetSel = floor(random(0, runSet.length));
  runStart = runSet[runSetSel];
  if(runStart=="V1") runV1 =true;
    if(runStart=="V2")runV2 =true;
      if(runStart=="V3")runV3 =true;

let pSelStoSet =floor(random(0,stoSet.length));
  sto = stoSet[pSelStoSet];
 
let gsSetSel =floor(random(0,gsSet.length));
  gs = gsSet[gsSetSel];
  gsdv=1;
  gsdF=gsdv; 
for(let i =0; i <5; i++){
  gsS00.push(gs);
}
  
let gsSetAllSel =floor(random(0,gsSetAll.length));
  gsSet01=gsSetAll[gsSetAllSel];
  
let scalePlateSetSel=floor(random(0,scalePlateSet.length));
  scalePlate=scalePlateSet[scalePlateSetSel];
  
let strokeWPXLSel=floor(random(0,strokeWPXLSet.length));
  strokeWPXL=strokeWPXLSet[strokeWPXLSel];  
  
let gTypeSetSel=floor(random(0,gTypeSet.length));
  gType=gTypeSet[gTypeSetSel];
  
for(let i =0; i <150; i++){
   let rndNR=floor(random(0,2));
  rndW.push(rndNR);    
    }
for(let i =0; i <100; i++){
  let rndNSto=floor(random(0,2));
  rndSto.push(rndNSto);    
    }
    
if (cSz=="16:9") {cSize5w=1920; cSize5h=1080;F_P= false; F_L= true;  F_S=false;F_A4=false;}
if (cSz=="9:16") {cSize5w=1080; cSize5h=1920;F_P= true;  F_L= false; F_S=false;F_A4=false;}
if (cSz=="1:1")  {cSize5w=1024; cSize5h=1024;F_P= true;  F_L= false; F_S=true;F_A4=false;} 
if (cSz=="A4")   {cSize5w=1000; cSize5h=1414;F_P= true;  F_L= false; F_S=false;F_A4=true;} 
  
cSize4w=cSize5w/2;
cSize4h=cSize5h/2;  
  
     if(sto == 1) { if(F_L)sizeFH=cSize5h*1.0;  if (F_P) sizeFH=cSize5h*1.14;} 
else if(sto == 2) { if(F_L)sizeFH=cSize5h*0.5;  if (F_P) sizeFH=cSize5h*0.58;} 
else if(sto == 3) { if(F_L)sizeFH=cSize5h*0.34; if (F_P) sizeFH=cSize5h*0.38;} 
else if(sto == 4) { if(F_L)sizeFH=cSize5h*0.25; if (F_P) sizeFH=cSize5h*0.29;} 
else if(sto == 5) { if(F_L)sizeFH=cSize5h*0.2;  if (F_P) sizeFH=cSize5h*0.23;}                    

if (F_L) sizeFW1= cSize5w*1.08;
if (F_P) sizeFW1= cSize5w*1.08;  
if (F_S){sizeFW1= cSize5w*1.08; sizeFH=sizeFH*0.9 }
if (F_A4){sizeFW1= cSize5w*1.08; sizeFH=sizeFH*1.1 }
  
sizeBox=sizeFH*sizeBoxF; 
  
  

  
if (F_L)camdist=cSize5w*cZF;
if (F_P)camdist=cSize5w*(cZF*2);
if (F_S)camdist=cSize5w*1.25*cZF;
if (F_A4)camdist=cSize5w*2*cZF;
  
for (let i = 0; i < pSel.length; i++) { pRGB.push(hexToR(pSel[i])); pRGB.push(hexToG(pSel[i])); pRGB.push(hexToB(pSel[i]));}
  palette = pRGB; 
}

function setupAllCanv() {
  noCursor(); 
  
  if(!resized){
if (F_L){canvasSizeW=windowWidth; canvasSizeH=int((canvasSizeW/16)*9);}
if (F_P){canvasSizeH=windowHeight;canvasSizeW=int((canvasSizeH/16)*9);}
if (F_S){canvasSizeW=windowHeight;canvasSizeH=windowHeight;}
if (F_A4){canvasSizeH=windowHeight;canvasSizeW=int((canvasSizeH/1.4142));}   
  canvas = createCanvas(canvasSizeW, canvasSizeH); 
 }else{
   canvas = createCanvas(cSize5w, cSize5h);   
 }  

if(shareSize){ 
if (F_L){canvasSizeW=960; canvasSizeH=int((canvasSizeW/16)*9);}
if (F_P){canvasSizeH=960;canvasSizeW=int((canvasSizeH/16)*9);}
if (F_S){canvasSizeW=512;canvasSizeH=512;}
if (F_A4){canvasSizeH=700;canvasSizeW=int(canvasSizeH/1.4142);}
  canvas = createCanvas(canvasSizeW, canvasSizeH); 
}
  
canvas.doubleClicked(fullScr)
  
  pixelDensity(1);
  webglC = createGraphics(cSize4w, cSize4h, WEBGL);
  webglC.pixelDensity(1);
  
let scaleTXW= sizeFW1 * scaleTex;
let scaleTXH= sizeFH * scaleTex ;
  
if(scaleTXW < 1) scaleTXW=1;
if(scaleTXH < 1) scaleTXH=1;
  
  bT1 = createGraphics(cSize2*2, cSize1);
  bT2 = createGraphics(sizeBox*2, scaleTXH);
  bT3 = createGraphics(scaleTXW*2, scaleTXH);
  bT4 = createGraphics(scaleTXW*2, scaleTXW);
  mT1 = createGraphics(cSize2, cSize1);
  mT2 = createGraphics(sizeBox, scaleTXH);
  mT3 = createGraphics(scaleTXW, scaleTXH);
  mT4 = createGraphics(scaleTXW, scaleTXH);
  canvas.imageSmoothingEnabled = false;
  noSmooth()  
}

function resetWebglCanv() {
  webglC = createGraphics(cSize4w, cSize4h, WEBGL);
  webglC.imageSmoothingEnabled = false;
  webglC.noSmooth();   
  webglC.rotateX(PI / 2);
  webglC.rotateZ(PI / 2);
  webglC.translate(-camdist, 0, -sizeBox / 4); 
  webglC.stroke(sc);
  webglC.strokeWeight(strokeWPXL);
  webglC.background(bg);
}

function sortPXLFrames() {
  for (let i = 0; i < framesPIXEL.length; i++) {
    let myPixelCanvas = createGraphics(cSize4w, cSize4h);
    myPixelCanvas.noSmooth();
    myPixelCanvas.imageSmoothingEnabled = false;
    myPixelCanvas.image(framesPIXEL[i], 0, 0, cSize4w, cSize4h);

    if (i < frCount)                          fV1.push(myPixelCanvas);
    if (i >= frCount && i < frCount * 2)      fV1toV2.push(myPixelCanvas);
    if (i >= frCount * 2 && i < frCount * 3)  fV2.push(myPixelCanvas);
    if (i >= frCount * 3 && i < frCount * 4)  fV1toV3.push(myPixelCanvas);
    if (i >= frCount * 4 && i < frCount * 5)  fV3.push(myPixelCanvas);
  }
  for (let i = fV1toV2.length - 1; i >= 0; i--) {
    let myPixelCanvas = createGraphics(cSize4w, cSize4h);
    myPixelCanvas.noSmooth();
    myPixelCanvas.imageSmoothingEnabled = false;
    myPixelCanvas.image(fV1toV2[i], 0, 0, cSize4w, cSize4h);
    fV2toV1.push(myPixelCanvas);
  }
  for (let i = fV1toV3.length - 1; i >= 0; i--) {
    let myPixelCanvas = createGraphics(cSize4w, cSize4h);
    myPixelCanvas.noSmooth();
    myPixelCanvas.imageSmoothingEnabled = false;
    myPixelCanvas.image(fV1toV3[i], 0, 0, cSize4w, cSize4h);
    fV3toV1.push(myPixelCanvas);
  }
}

function create3DScene() {
  for (let i = 0; i < frCount; i++) {
    resetWebglCanv();
    
    let speed = map(i, 0, frCount, 0, tS*2 );
    
    mT1.image(bT1, -bT1.width/2+ speed, 0); 
    mT2.image(bT2, -bT2.width/2+ speed, 0);
    mT3.image(bT3, -bT3.width/2+ speed, 0);
    mT4.image(bT4, -bT4.width/2+ speed, 0);

    createHouse();    

    let tmp_my2dCanvas = createGraphics(cSize4w, cSize4h);
    tmp_my2dCanvas.noSmooth();
    tmp_my2dCanvas.imageSmoothingEnabled = false;
    tmp_my2dCanvas.image(webglC, 0, 0);
    frames.push(tmp_my2dCanvas);
  }
}

function create3DSceneMove() {
  for (let i = 0; i < frCount; i++) {
    resetWebglCanv();

    webglC.push();

    mT1.image(bT1, 0, 0);
    mT2.image(bT2, 0, 0);
    mT3.image(bT3, 0, 0);
    mT4.image(bT4, 0, 0);

    //////////////////////////////////////////////
    if(moveR==5) webglC.rotateZ((PI / 2) * map(i, 0, frCount, 0, 1));
    if(moveR==6) webglC.rotateZ(-(PI / 2) * map(i, 0, frCount, 0, 1));
    //////////////////////////////////////////////////

    createHouse();

    let tmp_my2dCanvas = createGraphics(cSize4w, cSize4h);
    tmp_my2dCanvas.noSmooth();
    tmp_my2dCanvas.imageSmoothingEnabled = false;
    tmp_my2dCanvas.image(webglC, 0, 0);
    frames.push(tmp_my2dCanvas);

    webglC.pop();
  }
}

function create3DSceneMove2() {
  for (let i = 0; i < frCount; i++) {
    resetWebglCanv();

    let speed = map(i, 0, frCount, 0, tS*2 );
    
    mT1.image(bT1, -bT1.width/2+ speed, 0); 
    mT2.image(bT2, -bT2.width/2+ speed, 0);
    mT3.image(bT3, -bT3.width/2+ speed, 0);
    mT4.image(bT4, -bT4.width/2+ speed, 0);

    webglC.push();

    //////////////////////////////////////////////
      if(moveR==5) webglC.rotateZ(PI / 2);  
     if(moveR==6) webglC.rotateZ(-PI / 2);  
    //////////////////////////////////////////////////

    createHouse();

    let tmp_my2dCanvas = createGraphics(cSize4w, cSize4h);
    tmp_my2dCanvas.noSmooth();
    tmp_my2dCanvas.imageSmoothingEnabled = false;
    tmp_my2dCanvas.image(webglC, 0, 0);
    frames.push(tmp_my2dCanvas);

    webglC.pop();
  }
}

function create3DSceneMove3() {
  for (let i = 0; i < frCount; i++) {
    resetWebglCanv();

    webglC.push();

    mT1.image(bT1, 0, 0);
    mT2.image(bT2, 0, 0);
    mT3.image(bT3, 0, 0);
    mT4.image(bT4, 0, 0);

    //////////////////////////////////////////////
    //
    let stoFactor;
    if (sto==1)stoFactor=0.8;
     if (sto==2)stoFactor=0.6;
      if (sto==3)stoFactor=0.6;
       if (sto==4)stoFactor=0.6;
        if (sto==5)stoFactor=0.4;
    
     if(cSz=="1:1"||cSz=="16:9")stoFactor*0.6;
    
    if(moveV==0)webglC.translate(map(i, 0, frCount, 0, sizeFW1*0.8), 0, 0);
    if(moveV==1)webglC.translate(map(i, 0, frCount, 0, sizeFW1*0.8), map(i, 0, frCount, 0, (sizeFW1/4 )*stoFactor), map(i, 0, frCount, 0, (sizeFW1/4 )*stoFactor));
    if(moveV==2)webglC.translate(map(i, 0, frCount, 0, sizeFW1*0.8), map(i, 0, frCount, 0, (-sizeFW1/4)*stoFactor), map(i, 0, frCount, 0, (-sizeFW1/4)*stoFactor));
    if(moveV==3)webglC.translate(map(i, 0, frCount, 0, sizeFW1*0.8), map(i, 0, frCount, 0, (-sizeFW1/4)*stoFactor), map(i, 0, frCount, 0, (sizeFW1/4 )*stoFactor));
    if(moveV==4)webglC.translate(map(i, 0, frCount, 0, sizeFW1*0.8), map(i, 0, frCount, 0, (sizeFW1/4 )*stoFactor), map(i, 0, frCount, 0, (-sizeFW1/4)*stoFactor));
    
    //////////////////////////////////////////////////

    createHouse();

    let tmp_my2dCanvas = createGraphics(cSize4w, cSize4h);
    tmp_my2dCanvas.noSmooth();
    tmp_my2dCanvas.imageSmoothingEnabled = false;
    tmp_my2dCanvas.image(webglC, 0, 0);
    frames.push(tmp_my2dCanvas);

    webglC.pop();
  }
}

function create3DSceneMove4() {
  for (let i = 0; i < frCount; i++) {
    resetWebglCanv();

    let speed = map(i, 0, frCount, 0, tS*2 );
    
    mT1.image(bT1, -bT1.width/2+ speed, 0); 
    mT2.image(bT2, -bT2.width/2+ speed, 0);
    mT3.image(bT3, -bT3.width/2+ speed, 0);
    mT4.image(bT4, -bT4.width/2+ speed, 0);
    
    webglC.push();
    //////////////////////////////////////////////
    let stoFactor;
    
    if (sto==1)stoFactor=0.8;
     if (sto==2)stoFactor=0.6;
      if (sto==3)stoFactor=0.6;
        if (sto==4)stoFactor=0.6;
         if (sto==5)stoFactor=0.4;
    
    if(cSz=="1:1"||cSz=="16:9")stoFactor*0.6;
    
    if(moveV==0)webglC.translate(sizeFW1*0.8,0, 0);
    if(moveV==1)webglC.translate(sizeFW1*0.8, ( sizeFW1/4)*stoFactor, ( sizeFW1/4)*stoFactor);
    if(moveV==2)webglC.translate(sizeFW1*0.8, (-sizeFW1/4)*stoFactor, (-sizeFW1/4)*stoFactor);
    if(moveV==3)webglC.translate(sizeFW1*0.8, (-sizeFW1/4)*stoFactor, ( sizeFW1/4)*stoFactor);
    if(moveV==4)webglC.translate(sizeFW1*0.8, ( sizeFW1/4)*stoFactor, (-sizeFW1/4)*stoFactor);
    //////////////////////////////////////////////////

    createHouse();
    
    let tmp_my2dCanvas = createGraphics(cSize4w, cSize4h);
    tmp_my2dCanvas.noSmooth();
    tmp_my2dCanvas.imageSmoothingEnabled = false;
    tmp_my2dCanvas.image(webglC, 0, 0);
    frames.push(tmp_my2dCanvas);

    webglC.pop();
  }
}

function createHouse() {

  if (sto==1){
  webglC.push(); 
  webglC.translate(0, 0, sizeFH-(sizeFH / 2) + sizeBox / 4);
  drawFloorPlane();
  webglC.pop();    
  stackB(gsSet01[0],sto,0);
  }
 else if (sto==2){
      webglC.push();
         webglC.translate(0, 0,-sizeFH/2);
      
  webglC.push();
  webglC.translate(0, 0,(sizeFH*2) -(sizeFH / 2) + sizeBox / 4);
  drawFloorPlane();
  webglC.pop();
    
  webglC.push();
  webglC.translate(0, 0, sizeFH);
  webglC.rotateZ(PI / 2);
  stackB(gsSet01[1],sto,1);
  webglC.pop();
    
  stackB(gsSet01[0],sto,0);
    
  webglC.pop();
    
  }
  
  
  else if (sto==3){
  webglC.push();
  webglC.translate(0, 0,(sizeFH * 2) -(sizeFH / 2) + sizeBox / 4);
  drawFloorPlane();
  webglC.pop();
    
  webglC.push();
  webglC.translate(0, 0, sizeFH);
  webglC.rotateZ(PI / 2);
  stackB(gsSet01[2],sto,2);
  webglC.pop();
    
  stackB(gsSet01[1],sto,1);
    
  webglC.push();
  webglC.translate(0, 0, -sizeFH);
  webglC.rotateZ(-PI / 2);
  stackB(gsSet01[0],sto,0);
  webglC.pop();      
  }
  
    else if (sto==4){
        webglC.push();
      webglC.translate(0, 0,-sizeFH/2);
      
  webglC.push();
  webglC.translate(0, 0,(sizeFH * 3) -(sizeFH / 2) + sizeBox / 4);
  drawFloorPlane();
  webglC.pop();
    
   webglC.push();
  webglC.translate(0, 0, sizeFH*2);
  webglC.rotateZ(PI / 2);
  stackB(gsSet01[3],sto,3);
  webglC.pop();
    
  webglC.push();
  webglC.translate(0, 0, sizeFH);
  webglC.rotateZ(PI / 2);
  stackB(gsSet01[2],sto,2);
  webglC.pop();
    
  stackB(gsSet01[1],sto,1);
    
  webglC.push();
  webglC.translate(0, 0, -sizeFH);
  webglC.rotateZ(-PI / 2);
  stackB(gsSet01[0],sto,0);
  webglC.pop();      
      
        webglC.pop(); 
  }
  
  else if (sto==5){
  webglC.push();
  webglC.translate(0, 0,(sizeFH * 3) -(sizeFH / 2) + sizeBox / 4);
  drawFloorPlane();
  webglC.pop();
    
  webglC.push();
   webglC.translate(0, 0, sizeFH*2);
   webglC.rotateZ(PI / 2);
   stackB(gsSet01[4],sto,4);
  webglC.pop();
    
  webglC.push();
   webglC.translate(0, 0, sizeFH);
   webglC.rotateZ(PI / 2);
   stackB(gsSet01[3],sto,3);
  webglC.pop();
    
  stackB(gsSet01[2],sto,2);
    
  webglC.push();
   webglC.translate(0, 0, -sizeFH);
   webglC.rotateZ(-PI / 2);
   stackB(gsSet01[1],sto,1);
  webglC.pop();    
    
  webglC.push();
   webglC.translate(0, 0, -sizeFH*2);
   webglC.rotateZ(-PI / 2);
   stackB(gsSet01[0],sto,0);
  webglC.pop();    
  }  

}

function stackB(_gsSet01,_sto,_nr) {

  webglC.push();
   webglC.translate(0, 0, -(sizeFH / 2) + sizeBox / 4);
    drawFloorPlane();
  webglC.pop();

  webglC.push();
   webglC.translate(0, 0, sizeFH / 2 - sizeBox / 2 + sizeBox / 4);
    drawGridC(_gsSet01);
    drawGridR(_gsSet01);
  webglC.pop();

  let selRNDSto1=_sto+_nr+0;
 if(rndSto[selRNDSto1]==0){
  webglC.push();
   webglC.translate(-sizeFW1 / 2, 0, 0);
    drawWindow(_gsSet01);
  webglC.pop();
 }
  
    let selRNDSto2=_sto+_nr+1;
 if(rndSto[selRNDSto2]==0){
  webglC.push();
   webglC.rotateZ(PI / 2);
   webglC.translate(-sizeFW1 / 2, 0, 0);
    drawWindow(_gsSet01);
  webglC.pop();
 }
    let selRNDSto3=_sto+_nr+2;
 if(rndSto[selRNDSto3]==0){
  webglC.push();
   webglC.rotateZ(-PI / 2);
   webglC.translate(-sizeFW1 / 2, 0, 0);
    drawWindow(_gsSet01);
  webglC.pop();
 }  
}

function drawWindow(_gsSet01) {
  let gsdv2;
  gsdv2 = _gsSet01; 
  if(gsdT)gsdv2=1;
  
  webglC.push();
    webglC.texture(mT3);
    webglC.push();
   webglC.translate((sizeBox/4),0,-2);
    webglC.box(1, sizeFW1-sizeBox, sizeFH - 2 - sizeBox);
    webglC.pop();
  
    webglC.translate((sizeBox/4)-1, 0, 2+sizeBox / 2 - sizeFH / 2 + ((sizeFH - 2 - sizeBox) * wbr) / 2 );
    webglC.texture(mT4);
    webglC.box(sizeBox / 2, sizeFW1  , (sizeFH - 2 - sizeBox) * wbr);
  webglC.pop();

  webglC.push();
  webglC.translate(0, -sizeFW1 / 2 +sizeBox/2 , 0); 
  webglC.texture(mT2);
 for (let x = 0; x < _gsSet01* gsdv2; x++) {
      webglC.push();
      let d1 = map(x, 0, _gsSet01* gsdv2 - 1, 0, sizeFW1- sizeBox );     
      webglC.translate(sizeBox / 4 +1,d1, 0);
      webglC.box(sizeBox / 6, sizeBox / 6, sizeFH - 2 - sizeBox );
      webglC.pop();    
  }  
  webglC.pop();
}

function drawFloorPlane() {
  webglC.push();
  webglC.texture(mT4); 
  webglC.box(sizeFW1 * scalePlate, sizeFW1 * scalePlate, sizeBox / 2);
  webglC.pop();
}

function drawGridR(_gsSet01) {
  webglC.push();
  webglC.texture(mT2);
  webglC.translate(-sizeFW1 / 2 + sizeBox / 2, 0, 0);
  
  let gsdv2;
  gsdv2 = _gsSet01; 
  if(gsdT)gsdv2=1;
  
  for (let x = 0; x < _gsSet01 * gsdv2; x++) {
    webglC.push();
    let d = map(x, 0, _gsSet01 * gsdv2 - 1, 0, sizeFW1 - sizeBox);
    webglC.translate(d, 0, 0);
    webglC.box(sizeBox / 2, sizeFW1 * scalePlate, sizeBox / 2);
    webglC.pop();
  }
  webglC.pop();

  webglC.push();
  webglC.texture(mT2);
  webglC.translate(0, -sizeFW1 / 2 + sizeBox / 2, -2);
  for (let y = 0; y < _gsSet01 * gsdv2; y++) {
    webglC.push();
    let d = map(y, 0, _gsSet01 * gsdv2 - 1, 0, sizeFW1 - sizeBox);
    webglC.translate(0, d, 0);
    webglC.box(sizeFW1 * scalePlate, sizeBox / 2, sizeBox / 2);
    webglC.pop();
  }
  webglC.pop();
}

function drawGridC(_gsSet01) {
  //////////////////// columns
  webglC.push();
  webglC.texture(mT2); // mT1
  webglC.strokeWeight(strokeWPXL);
  webglC.translate(
    -sizeFW1 / 2 + sizeBox / 2,
    -sizeFW1 / 2 + sizeBox / 2,
    -sizeFH / 2 + sizeBox / 2
  );
  
  if (gType==0){
  for (let x = 1; x < _gsSet01-1; x++) {
    for (let y = 1; y < _gsSet01-1; y++) {
      webglC.push();
      let d1 = map(x, 0, _gsSet01 - 1, 0, sizeFW1 - sizeBox);
      let d2 = map(y, 0, _gsSet01 - 1, 0, sizeFW1 - sizeBox);
      webglC.translate(d1, d2, 0);
      webglC.box(sizeBox / 2, sizeBox / 2, sizeFH - 2 - sizeBox / 2);
      webglC.pop();
    }
  }
  }
  
  if (gType==1){
  for (let x = 1; x < _gsSet01-1; x++) {
    for (let y = 1; y < _gsSet01-1; y++) {
      webglC.push();
      let d1 = map(x, 0, _gsSet01 - 1, 0, sizeFW1 - sizeBox);
      let d2 = map(y, 0, _gsSet01 - 1, 0, sizeFW1 - sizeBox);
      webglC.translate(d1, d2, 0);
      webglC.push();
      webglC.translate(sizeBox*1, 0, 0);
        webglC.box(sizeBox * 1.45, sizeBox /2, sizeFH - 2 - sizeBox / 2);
      webglC.pop();
          webglC.push();
      webglC.translate(-sizeBox*1, 0, 0);
        webglC.box(sizeBox * 1.45, sizeBox /2, sizeFH - 2 - sizeBox / 2);
      webglC.pop();
    webglC.push();
      webglC.translate(0,sizeBox*1, 0);
        webglC.box( sizeBox /2,sizeBox * 1.45, sizeFH - 2 - sizeBox / 2);
      webglC.pop();
        webglC.push();
      webglC.translate(0,-sizeBox*1, 0);
        webglC.box( sizeBox /2,sizeBox * 1.45, sizeFH - 2 - sizeBox / 2);
      webglC.pop();      
      webglC.pop();
    }
  }
  }
  
   if (gType==2){
    let countR=0;
  for (let x = 1; x < _gsSet01-1; x++) {
    for (let y = 1; y < _gsSet01-1; y++) {
      webglC.push();
      let d1 = map(x, 0, _gsSet01 - 1, 0, sizeFW1 - sizeBox);
      let d2 = map(y, 0, _gsSet01 - 1, 0, sizeFW1 - sizeBox);
      webglC.translate(d1, d2, 0);  
      
      if(rndW[countR]==0)   {
           webglC.push();
           webglC.translate(-d1/2, 0, 0);
      webglC.box(d1, sizeBox / 2, sizeFH - 2 - sizeBox / 2);
       webglC.pop();
      }
          
      if(rndW[countR]==1){
           webglC.push();
         webglC.translate(0, -d2/2, 0);
      webglC.box(sizeBox / 2, d2, sizeFH - 2 - sizeBox / 2);
       webglC.pop();
      }

      countR++;
      webglC.pop();
    }
  }
   }
  webglC.pop();
}

function setupT1() {
  bT1.background(bg);
  bT1.strokeWeight(tSW);
  for (let i = 0; i < cSize2; i = i + tS * 2) {
    for (let j = 0; j < cSize1; j = j + tS * 2) {
      bT1.circle(tS + i, tS + j, tS);
      bT1.push();
      bT1.stroke(pSel[0]);
      bT1.line(i + tS, 0, i + tS + 0.0, 1000);
      bT1.pop();
    }
  }
}
function setupT2() {
  bT2.background(bg);
  bT2.strokeWeight(tSW);
  for (let i = 0; i < bT2.width; i = i + tS*2) {
    bT2.stroke(pSel[1]);
    bT2.line(i + tS, 0, i +tS+ tS * 2, 1000);
    bT2.line(0, i + tS, 1000, i + tS);

  } 
}
function setupT3() {
  bT3.background(bg);
  bT3.strokeWeight(tSW);
  for (let i = 0; i < bT3.width; i = i + tS * 2) {
    bT3.stroke(pSel[2]);
    bT3.line(i + tS, 0, i + tS +0.0, 1000);
    bT3.line(0, i + tS, 1000, i + tS);
  }
}
function setupT4() {
  bT4.background(bg);
  bT4.strokeWeight(tSW);
  for (let i = 0; i < bT4.width; i = i + tS * 2) {
    bT4.stroke(pSel[3]);
  //  bT4.line(i + tS, 0, i + tS + 500.0, 1000);
        bT4.line(i + tS, 0, i + tS, 1000);
    bT4.line(0, i + tS, 1000, i + tS);
  }
}

function mouseClicked() {
  runFCl++;
  if(runFCl>1)runFrames=!runFrames;  
}

function keyTyped() {
if (key === "s") {
    save("Grasser_RAUSCH_"+paletteTXT+"_" + canvas.width + "x" + canvas.height + ".png");
  }
if (key === "g") { anim=false;
                  run1=run2=run2b=run3=run4=run5=run6=run=0;
    if (frCount==24 && errMode){
      createLoop({duration: 2.0, gif: { render: false, download: true, fileName: "Grasser_RAUSCH_"+paletteTXT+"_"+frCount+"FPS_2_second_" + canvas.width + "x" + canvas.height + ".gif", },});
    }else{
    createLoop({duration: 1.0, gif: { render: false, download: true, fileName: "Grasser_RAUSCH_"+paletteTXT+"_"+frCount+"FPS_1_second_" + canvas.width + "x" + canvas.height + ".gif", },});
    }
}

if (key === "p") {
    anim=false;
    drun=false;
    run1=run2=run2b=run3=run4=run5=run6=run=0;
    runV1=runV1toV2=runV2toV1=runV2=runV1toV3=runV3=runV3toV1=false;
    if(runStart=="V1")runV1 =true;
    if(runStart=="V2")runV2 =true;
    if(runStart=="V3")runV3 =true;
    longestGif=true;
  
   if (frCount==24 && errMode){
     createLoop({duration: 24.0, gif: { render: false, download: true, fileName: "Grasser_RAUSCH_"+paletteTXT+"_"+frCount+"FPS_24_seconds_" + canvas.width + "x" + canvas.height + ".gif", },});
   }else{
     createLoop({duration: 12.0, gif: { render: false, download: true, fileName: "Grasser_RAUSCH_"+paletteTXT+"_"+frCount+"FPS_12_seconds_" + canvas.width + "x" + canvas.height + ".gif", },});     
   }  
}
      
if (key === "t") {
  shareSize=true;
  frCount = 12;  
    recompute();   
    anim=false;
    drun=false;
    run1=run2=run2b=run3=run4=run5=run6=run=0;
    runV1=runV1toV2=runV2toV1=runV2=runV1toV3=runV3=runV3toV1=false;
    if(runStart=="V1")runV1 =true;
    if(runStart=="V2")runV2 =true;
    if(runStart=="V3")runV3 =true;
    longestGif=true;
     if (frCount==24 && errMode){
     createLoop({duration: 24.0, gif: { render: false, download: true, fileName: "Grasser_RAUSCH_"+paletteTXT+"_"+frCount+"FPS_24_seconds_" + canvas.width + "x" + canvas.height + ".gif", },});
     }else{
     createLoop({duration: 12.0, gif: { render: false, download: true, fileName: "Grasser_RAUSCH_"+paletteTXT+"_"+frCount+"FPS_12_seconds_" + canvas.width + "x" + canvas.height + ".gif", },});
     }
}
  
if (key === "f") {
    frCount = 24;       
    recomputeAll=true;   
    recompute();     
    recomputeAll=false;
    console.log("FPS: 24");  
}
  
if (key === "b") {  
  monoMode=true;
  bg=0;
  pSel= pdm1; 
  pRGB=[];
  for (let i = 0; i < pSel.length; i++) {
    pRGB.push(hexToR(pSel[i])); pRGB.push(hexToG(pSel[i])); pRGB.push(hexToB(pSel[i]));
  }
  palette = pRGB; 
  palette2C = monoPal04;  
  recomputeAll=true;   
  recompute();     
  recomputeAll=false;
  console.log("BW");  
}
  
if (key === "6") {
  shareSize=false;
     console.log("A4 Portrait");
     recomputeAll=true;  
        resized=true; 
        cSz="A4";
   cSize5w=1000;
   cSize5h=1414;     
    recompute();     
    recomputeAll=false;
}
  
if (key === "7") {
    shareSize=false;
     console.log("16:9 Landscape");
     recomputeAll=true;  
     resized=true;    
     cSz="16:9";
   cSize5w=1920;
   cSize5h=1080;     
    recompute();     
    recomputeAll=false;
  }
if (key === "8") {
    shareSize=false;
     console.log("9:16 Portrait");
     recomputeAll=true;  
        resized=true; 
        cSz="9:16";
   cSize5w=1080;
   cSize5h=1920;     
    recompute();     
    recomputeAll=false;
  }
if (key === "9") {
    shareSize=false;
     console.log("1:1 Square");
     recomputeAll=true;  
       resized=true; 
        cSz="1:1";
   cSize5w=1024;
   cSize5h=1024;     
    recompute();     
    recomputeAll=false;
  }
  

if (key === "1") {
    runV1=runV2toV1=runV2=runV1toV3=runV3=runV3toV1= false;
    runV1toV2 = true;
  }
if (key === "2") {
    runV1=runV1toV2=runV2=runV1toV3=runV3=runV3toV1=false;
    runV2toV1 = true;
  }
if (key === "3") {
    runV1=runV1toV2=runV2toV1=runV2=runV3=runV3toV1=false;
    runV1toV3 = true;
  }
if (key === "4") {
    runV1=runV1toV2=runV2toV1=runV2=runV1toV3=runV3=false;
    runV3toV1 = true;
  }
}

function fullScr(){
   let fs = fullscreen();
   fullscreen(!fs); 
      shareSize=false;
  recomputeAll=true;    
  resized=true; 
   cSize5w=displayWidth;
   cSize5h=displayHeight;
  if (cSize5w >cSize5h)  cSz="16:9";
  if (cSize5w <cSize5h)  cSz="9:16";
  recompute();     
  recomputeAll=false;  
  runFrames=true;
}

function recompute(){
frames = [];
framesDither = [];
framesPIXEL = [];
fV1 = [];
fV1toV2 = [];
fV2 = [];
fV2toV1 = [];
fV1toV3 = [];
fV3 = [];
fV3toV1 = [];
distScaleW=[];
distScaleH=[];
   
if (cSz=="16:9") {F_P= false; F_L= true;  F_S=false;F_A4=false;}
if (cSz=="9:16") {F_P= true;  F_L= false; F_S=false;F_A4=false;}
if (cSz=="1:1")  {F_P= true;  F_L= false; F_S=true; F_A4=false;} 
if (cSz=="A4")   {F_P= false; F_L= false; F_S=false;F_A4=true;} 
  
cSize4w=cSize5w/2;
cSize4h=cSize5h/2;
  
     if(sto == 1) { if(F_L)sizeFH=cSize5h*1.0;  if (F_P) sizeFH=cSize5h*1.14;} 
else if(sto == 2) { if(F_L)sizeFH=cSize5h*0.5;  if (F_P) sizeFH=cSize5h*0.58;} 
else if(sto == 3) { if(F_L)sizeFH=cSize5h*0.34; if (F_P) sizeFH=cSize5h*0.38;} 
else if(sto == 4) { if(F_L)sizeFH=cSize5h*0.25; if (F_P) sizeFH=cSize5h*0.29;} 
else if(sto == 5) { if(F_L)sizeFH=cSize5h*0.2;  if (F_P) sizeFH=cSize5h*0.23;}            
if (F_L) sizeFW1= cSize5w*1.08;
if (F_P) sizeFW1= cSize5w*1.08;  
if (F_S){sizeFW1= cSize5w*1.08; sizeFH=sizeFH*0.9 }
if (F_A4){sizeFW1= cSize5w*1.08; sizeFH=sizeFH*1.1 }
 
sizeBox=sizeFH*sizeBoxF;  
  
if (F_L)camdist=cSize5w*cZF;
if (F_P)camdist=cSize5w*(cZF*2);
if (F_S)camdist=cSize5w*1.25*cZF;
if (F_A4)camdist=cSize5w*2*cZF;
  
setupAllCanv();
setupT1();setupT2();setupT3(); setupT4();
resetWebglCanv();
 
if (dit) {
    create3DScene();
    create3DSceneMove();
    create3DSceneMove2();
    create3DSceneMove3();
    create3DSceneMove4();
    scaleFramesDither();
    makeDitherStartFrame();
    makeDither();  
    sortPXLFrames(); 
    frames = [];
    framesDither = [];
    framesPIXEL = [];
}     
}

function gifExporter(){

if(longestGif){    
    if (runLong2<frCount*12){      
      if(runV1){
          if(runLong2<frCount)                          image(fV1[runLong2], 0, 0, canvas.width, canvas.height);
          if(runLong2>=frCount && runLong2<frCount*2)   image(fV1[runLong2-frCount], 0, 0, canvas.width, canvas.height);        
        if(runLong2>=frCount*2 && runLong2<frCount*3) image(fV1toV2[runLong2-frCount*2], 0, 0, canvas.width, canvas.height);       
          if(runLong2>=frCount*3 && runLong2<frCount*4) image(fV2[runLong2-frCount*3], 0, 0, canvas.width, canvas.height);
          if(runLong2>=frCount*4 && runLong2<frCount*5) image(fV2[runLong2-frCount*4], 0, 0, canvas.width, canvas.height);        
        if(runLong2>=frCount*5 && runLong2<frCount*6) image(fV2toV1[runLong2-frCount*5], 0, 0, canvas.width, canvas.height);        
          if(runLong2>=frCount*6 && runLong2<frCount*7) image(fV1[runLong2-frCount*6], 0, 0, canvas.width, canvas.height);
          if(runLong2>=frCount*7 && runLong2<frCount*8) image(fV1[runLong2-frCount*7], 0, 0, canvas.width, canvas.height);        
        if(runLong2>=frCount*8 && runLong2<frCount*9) image(fV1toV3[runLong2-frCount*8], 0, 0, canvas.width, canvas.height);        
          if(runLong2>=frCount*9 && runLong2<frCount*10) image(fV3[runLong2-frCount*9], 0, 0, canvas.width, canvas.height);
          if(runLong2>=frCount*10 && runLong2<frCount*11)image(fV3[runLong2-frCount*10], 0, 0, canvas.width, canvas.height);        
        if(runLong2>=frCount*11 && runLong2<frCount*12) image(fV3toV1[runLong2-frCount*11], 0, 0, canvas.width, canvas.height);
      }
      
     if(runV2){
          if(runLong2<frCount)                         image(fV2[runLong2], 0, 0, canvas.width, canvas.height);
          if(runLong2>=frCount && runLong2<frCount*2)  image(fV2[runLong2-frCount], 0, 0, canvas.width, canvas.height);      
        if(runLong2>=frCount*2 && runLong2<frCount*3) image(fV2toV1[runLong2-frCount*2], 0, 0, canvas.width, canvas.height);      
          if(runLong2>=frCount*3 && runLong2<frCount*4) image(fV1[runLong2-frCount*3], 0, 0, canvas.width, canvas.height);
          if(runLong2>=frCount*4 && runLong2<frCount*5) image(fV1[runLong2-frCount*4], 0, 0, canvas.width, canvas.height);
        if(runLong2>=frCount*5 && runLong2<frCount*6) image(fV1toV3[runLong2-frCount*5], 0, 0, canvas.width, canvas.height);      
          if(runLong2>=frCount*6 && runLong2<frCount*7) image(fV3[runLong2-frCount*6], 0, 0, canvas.width, canvas.height);
          if(runLong2>=frCount*7 && runLong2<frCount*8) image(fV3[runLong2-frCount*7], 0, 0, canvas.width, canvas.height);      
        if(runLong2>=frCount*8 && runLong2<frCount*9) image(fV3toV1[runLong2-frCount*8], 0, 0, canvas.width, canvas.height);      
          if(runLong2>=frCount*9 && runLong2<frCount*10) image(fV1[runLong2-frCount*9], 0, 0, canvas.width, canvas.height);
          if(runLong2>=frCount*10 && runLong2<frCount*11) image(fV1[runLong2-frCount*10], 0, 0, canvas.width, canvas.height);      
        if(runLong2>=frCount*11 && runLong2<frCount*12) image(fV1toV2[runLong2-frCount*11], 0, 0, canvas.width, canvas.height);
      }
      if(runV3){
          if(runLong2<frCount)                         image(fV3[runLong2], 0, 0, canvas.width, canvas.height);
          if(runLong2>=frCount && runLong2<frCount*2)  image(fV3[runLong2-frCount], 0, 0, canvas.width, canvas.height);     
        if(runLong2>=frCount*2 && runLong2<frCount*3) image(fV3toV1[runLong2-frCount*2], 0, 0, canvas.width, canvas.height);   
          if(runLong2>=frCount*3 && runLong2<frCount*4) image(fV1[runLong2-frCount*3], 0, 0, canvas.width, canvas.height);
          if(runLong2>=frCount*4 && runLong2<frCount*5) image(fV1[runLong2-frCount*4], 0, 0, canvas.width, canvas.height);     
        if(runLong2>=frCount*5 && runLong2<frCount*6) image(fV1toV2[runLong2-frCount*5], 0, 0, canvas.width, canvas.height);
          if(runLong2>=frCount*6 && runLong2<frCount*7) image(fV2[runLong2-frCount*6], 0, 0, canvas.width, canvas.height);
          if(runLong2>=frCount*7 && runLong2<frCount*8) image(fV2[runLong2-frCount*7], 0, 0, canvas.width, canvas.height);             
        if(runLong2>=frCount*8 && runLong2<frCount*9) image(fV2toV1[runLong2-frCount*8], 0, 0, canvas.width, canvas.height);           
          if(runLong2>=frCount*9 && runLong2<frCount*10) image(fV1[runLong2-frCount*9], 0, 0, canvas.width, canvas.height);
          if(runLong2>=frCount*10 && runLong2<frCount*11) image(fV1[runLong2-frCount*10], 0, 0, canvas.width, canvas.height);             
        if(runLong2>=frCount*11 && runLong2<frCount*12) image(fV1toV3[runLong2-frCount*11], 0, 0, canvas.width, canvas.height);
      }   

     runLong2++;
    if (runLong2 == frCount*12) {runLong2=0; longestGif=false;  drun=true; anim=true;}      

  }
}
  
}

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  return color(r, g, b);
}
function hexToR(hex) {
  hex = hex.replace("#", "");
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  return int(r);
}
function hexToG(hex) {
  hex = hex.replace("#", "");
  var bigint = parseInt(hex, 16);
  var g = (bigint >> 8) & 255;
  return int(g);
}
function hexToB(hex) {
  hex = hex.replace("#", "");
  var bigint = parseInt(hex, 16);
  var b = bigint & 255;
  return int(b);
}

//////////////////////////////////////////////////////////////////////////////// 

function scaleFramesDither() {
  for (let i = 0; i < frames.length; i++) {
      
    let ditherScalew1; 
    let ditherScaleh1;    
    
    if (i < frCount)                     {ditherScalew1=cSize4w/ditherScaleFactors[0]; ditherScaleh1=cSize4h/ditherScaleFactors[0];}   
    
    if (i >= frCount && i < frCount * 2) {    
                                          ditherScalew1=floor(cSize4w/map(i,frCount, frCount*2-1,ditherScaleFactors[0],ditherScaleFactors[1]))
                                          ditherScaleh1=floor(cSize4h/map(i,frCount, frCount*2-1,ditherScaleFactors[0],ditherScaleFactors[1]))
                                         }
    
    if (i >= frCount * 2 && i < frCount * 3)  {ditherScalew1=cSize4w/ditherScaleFactors[1]; ditherScaleh1=cSize4h/ditherScaleFactors[1];}   
    
    if (i >= frCount * 3 && i < frCount * 4) {     
                                          ditherScalew1=floor(cSize4w/map(i,frCount*3,frCount*4-1,ditherScaleFactors[0],ditherScaleFactors[2]))
                                          ditherScaleh1=floor(cSize4h/map(i,frCount*3,frCount*4-1,ditherScaleFactors[0],ditherScaleFactors[2]))
                                         }
    if (i >= frCount * 4 && i < frCount * 5)  {ditherScalew1=cSize4w/ditherScaleFactors[2]; ditherScaleh1=cSize4h/ditherScaleFactors[2];} 
    

    distScaleW.push(ditherScalew1);
    distScaleH.push(ditherScaleh1);
    
    let tmp_my2dCanvas = createGraphics(ditherScalew1, ditherScaleh1);
    tmp_my2dCanvas.noSmooth();
    tmp_my2dCanvas.imageSmoothingEnabled = false;
    tmp_my2dCanvas.image(frames[i], 0, 0, ditherScalew1, ditherScaleh1);
    framesDither.push(tmp_my2dCanvas);
  }
}

function makeDitherStartFrame() {
  let myPixelCanvas = createGraphics(distScaleW[0],distScaleH[0]);
  myPixelCanvas.noSmooth();
  myPixelCanvas.imageSmoothingEnabled = false;

  dither(framesDither[0], myPixelCanvas);
}

function makeDither() {
  for (let i = 1; i < framesDither.length; i++) {
    let myPixelCanvas = createGraphics(distScaleW[i],distScaleH[i]);
    myPixelCanvas.noSmooth();
    myPixelCanvas.imageSmoothingEnabled = false;

    dither(framesDither[i], myPixelCanvas);

    if (i == framesDither.length - 1) drun = true;
  }
}

function dither(img, myPixelCanvas) {
  img.loadPixels();
  let w = img.width;

  for (let i = 0; i < img.pixels.length; i += 4) {
    let oldR = img.pixels[i + 0];
    let oldG = img.pixels[i + 1];
    let oldB = img.pixels[i + 2];
    
    let bestIndex = closestClr(oldR, oldG, oldB,palette);
    let newR = palette[bestIndex + 0];
    let newG = palette[bestIndex + 1];
    let newB = palette[bestIndex + 2];    
        
    img.pixels[i + 0]=newR;
    img.pixels[i + 1]=newG;
    img.pixels[i + 2]=newB;      

    let errR = oldR - newR;
    let errG = oldG - newG;
    let errB = oldB - newB;
    distributeError(img, i, errR, errG, errB,w);
    
    if(monoMode){ 
    bestIndex = closestClr(newR, newG, newB,palette2C);
    img.pixels[i + 0]= palette2C[bestIndex + 0];
    img.pixels[i + 1]= palette2C[bestIndex + 1];
    img.pixels[i + 2]= palette2C[bestIndex + 2];  
    }          
  }
  
  img.updatePixels();
  myPixelCanvas.image(img, 0, 0);
  myPixelCanvas.filter(OPAQUE);
  framesPIXEL.push(myPixelCanvas);
}

function closestClr(oldR, oldG, oldB,_palette) {
  let smallestDist = Infinity;
  let dist;
  let bestIndex;

  for (let i = 0; i < _palette.length; i += 3) {
    dist = (oldR - _palette[i + 0]) ** 2 + (oldG - _palette[i + 1]) ** 2 + (oldB - _palette[i + 2]) ** 2;
    if (dist < smallestDist) {
      smallestDist = dist;
      bestIndex = i;
    }
  }
  return bestIndex;
}

function distributeError(img, i, errR, errG, errB,w) {  
 if(errMode){
    if(err1){
  addError (img, 1/16.0, i+4, errR, errG, errB);
  addError(img, 13/13.0, i+4*w-4, errR, errG, errB);
  addError(img, 5/6.0, i+4*w, errR, errG, errB);
  addError(img, 4/10.0, i+4*w+4, errR, errG, errB);
    }
     if(err2){
  addError(img, 1/16.0, i+4, errR, errG, errB);
  addError(img, 1/16.0, i+4*w-4, errR, errG, errB);
  addError(img, 1/16.0, i+4*w, errR, errG, errB);
  addError(img, 1/16.0, i+4*w+4, errR, errG, errB);
     }
   if(err3){
  addError(img, 1/8.0, i+4, errR, errG, errB);
  addError(img, 5/8.0, i+4*w-4, errR, errG, errB);
  addError(img, 3/8.0, i+4*w, errR, errG, errB);
  addError(img, 7/8.0, i+4*w+4, errR, errG, errB);
   }
   
 }else {
   addError(img, 7/16.0, i+4, errR, errG, errB);
  addError(img, 3/16.0, i+4*w-4, errR, errG, errB);
  addError(img, 5/16.0, i+4*w, errR, errG, errB);
  addError(img, 1/16.0, i+4*w+4, errR, errG, errB);
    }  
}

function addError(img, factor, i, errR, errG, errB) {  
    img.pixels[i + 0]=img.pixels[i + 0]+(errR*factor);
    img.pixels[i + 1]=img.pixels[i + 1]+(errG*factor);
    img.pixels[i + 2]=img.pixels[i + 2]+(errB*factor);     
}

// it is not allowed to use/exploit the saved outputs png and gif for minting on any other platforms.  
// made wiht P5js and P5.createLoop
// The Content CopyRight of all the minted artworks of this generative token remains with Grasser Alexander 2023 @grasser_alex. 