// system β by Haxen Fan 20230127
// Increases in magnitude and decreases in computation
//+-*/
const winRatio = 0.707;
let cv, wid, hei,cnv;
let main, main_wid, main_hei = 2000;
let pointNum,lengthLimit,limitVar;
let lLimit0 = 1;
let pNum0 = 1;
let countL =1.1;
let points1 = [];
//line
let multLineSeed = fxrand();
let calAng_Y = fxrand();
let calLine_groupSeed_s2 = fxrand();
let calLine_groupSeed_s3 = fxrand();
let calLineSeed1 = fxrand();
let calLineSeed2 = fxrand();
//ro
let roSeed = fxrand();
let roSel1 = fxrand();
let roSel2 = fxrand();
//basic
let ampX,ampY,phaX,phaY,modFreqX,modFreqY,oriFreqX,oriFreqY;
let oriXseed = fxrand();
let oriYseed = fxrand();
let powSeed = fxrand();
let selAngSeedX0,selAngSeedY0,selAngSeedX1,selAngSeedY1;
//color
let clrstrokeSeed = fxrand();
let cp,clrPl;
let clrs = [];
let clrsMode = ['Random','By Order'];
let clrsSel;
let rangeSeed = fxrand();
let bkPalette ;

function setup() {
  canvasSetup();
  pointNum = 600;
  let apX = (45+Math.floor(random(16)))/10;
  let apY = (40+Math.floor(random(11)))/10;
  ampX = main.width/ apX;
  ampY = main.height/ apY;
  limitVar = map(apX+apY, 8.5, 11, 13, 10);
  lengthLimit = Math.floor(fxrand()*3+12)*limitVar;
  selAngSeedX0 = Math.floor(fxrand()*2);
  selAngSeedY0 = Math.floor(fxrand()*2);
  selAngSeedX1 = 3;
  selAngSeedY1 = 3;
  phaX  = (random(5000));
  phaY  = (random(5000));
  let oriNumber = f => {
    if(f>=0.75) return 1+Math.floor(random(9));
    else if(f>=0.15 && f<0.78) return ((10+random(1000)));
    else return pow(10,Math.floor(powSeed*6)) ; 
  }
  let magicNumber = (f) =>{
    let a = (1+Math.floor(f*20))*100;
    let b = random([33,66,99]);
    return a+b;
  }
  oriFreqX = oriNumber(oriXseed);
  oriFreqY = (oriXseed<0.18)? oriNumber(map(oriYseed,0,1,0.18,1)) : oriNumber(oriYseed);
  if(Math.floor(oriXseed*100)%3==0 && Math.floor(oriYseed*100)%3==0){
    oriFreqX = magicNumber(oriXseed);
    oriFreqY = magicNumber(oriYseed);
  }
  modFreqX = ( oriFreqX<=10 || Math.floor(oriXseed*100)%2 ==0 )? (10+random(10000)) : Math.floor(1+random(9));
  modFreqY = ( oriFreqY<=10 || Math.floor(oriYseed*99)%2 ==0 )?  (10+random(10000)) : Math.floor(1+random(9));
  if(oriFreqX == oriFreqY || oriFreqX == 1 || oriFreqY ==1 || oriFreqX%10==0 || oriFreqY%10==0){
     multLineSeed = 1;
  }
  if(oriFreqX%10==0 && oriFreqY!=1 || oriFreqX!=1 && oriFreqY%10==0){
    countL+=0.15;
  }
  cp = Math.floor(clrstrokeSeed*myColorPalette_beta.length);
  clrPl = myColorPalette_beta[cp].color; 
  bkPalette = [[64,8,87], [clrPl[0][0],clrPl[0][1],4]];
  
  clrsSel = (random()<0.6 ||cp>=18 )? clrsMode[0] : clrsMode[1];
  if(clrsSel == 'Random'){
    for(let c=0;c<pointNum;c++){
      clrs[c] = clrPl[Math.floor(fxrand()*clrPl.length)];
    }
  }else if (clrsSel == 'By Order'){
    for(let c=0;c<pointNum;c++){
      let clrPl1 = clrPl[Math.floor(fxrand()*clrPl.length/2)];
      let clrPl2 = clrPl[Math.floor(clrPl.length/2+fxrand()*clrPl.length/2)];
      let range1 = [0,0,0.1,0.1,0.16,0.25,0.5,0.6,0.75];
      let range2 = [0.35,0.8,0.5,0.9,0.6,0.75,0.7,0.95,1];
      let rangeSel1 = range1[Math.floor(rangeSeed*range1.length)];
      let rangeSel2 = range2[Math.floor(rangeSeed*range2.length)];
      clrs[c] = (c>=rangeSel1*pointNum && c<rangeSel2*pointNum)? clrPl1:clrPl2;
    }
  }
  if(cp == 0){
    bk =  bkPalette[0];
  }else if(cp == 1){
    bk =  bkPalette[1];
  }else{
    bk = random(bkPalette);
  }
  createPoints(points1,pointNum,ampX,ampY);
  window.$fxhashFeatures = {
    "X" : numberFeature(oriFreqX,"ori"),
    "Y" : numberFeature(oriFreqY,"ori"),
    "X'" : numberFeature(modFreqX,"mod"),
    "Y'" : numberFeature(modFreqY,"mod"),
    "Calculate" : (multLineSeed)<0.25? " * | / " : " + | - ",
    "Movement" : (calAng_Y<0.75)? "Self-determination":"Y follow X",
    "Offset" : (Math.floor(roSel1*100)%2!=0 || selAngSeedX1<=3 || Math.floor(roSel2*100)%2!=0 || selAngSeedY1<=3),
    "Arrangement" : clrsSel,  
    "Palette" : myColorPalette_beta[cp].name,
  } 
}

function draw() {
  if(lLimit0 < lengthLimit ){  
    let l = map(lLimit0,1,lengthLimit,0.01,1)*1;
    l =  easeInOutQuad(l);
    let p = map(pNum0,1,pointNum,0.01,1)*1;
    p = easeInOutExpo(p);
    main.background(bk);
    main.push();
      main.translate(main.width/2,main.height/2);
      createPoints(points1,p*pointNum,ampX,ampY);
      drawLine(points1,p*pointNum,l*lengthLimit);
    main.pop();
    image(main,0,0,width,height);
    lLimit0+=countL;
    pNum0+=8;
  }else{
    main.push();
      main.translate(main.width/2,main.height/2);
      drawLineMult(points1,pointNum,lengthLimit);
      drawLine(points1,pointNum,lengthLimit);
    main.pop();
    image(main,0,0,width,height);
    lLimit0 = 1;
    pNum0 = 1;
    noLoop();
    fxpreview();
  }
}
function createPoints(g,num,ampX,ampY){ 
  for(let i=0;i<num;i++){
    var angle = map(i,0,num,0,TAU);
    let x,y;
    let x0 = (calAng( selAngSeedX0, (angle*oriFreqX+phaX), 1 ).value) *ampX; 
    let y0 = (calAng( selAngSeedY0, (angle*oriFreqY+phaY), 1 ).value) *ampY;
    let x1 = ((angle)*modFreqX);
    let y1 = ((angle)*modFreqY);
    x = x0 * calAng( selAngSeedX1, x1, x0 ).value;
    y = y0 * calAng( selAngSeedY1, (calAng_Y<0.75)?y1:x, y0 ).value;
    g[i] = createVector(x,y);
  }
}
function drawLine(g,num,limit){
  let dis;
  let a;
  main.push()
  for(let i=0;i<num;i++){
    main.stroke(clrs[i][0],clrs[i][1],clrs[i][2]-a*10*i/num)
    for(let o=0;o<i;o++){
      dis = g[i].dist(g[o])
      a = pow(1/ (dis/limit + 1 ),4)
      let strw = a*5
      if(dis < limit ){
        main.noFill()
        main.strokeWeight(strw)
        main.line(g[i].x,g[i].y, g[o].x,g[o].y)
      }  
    }
  }
  main.pop();
}
function drawLineMult(g,num,limit){
  let dis;
  let a;
  main.push();
  for(let i=0;i<num;i++){
    let angle0 = map(i,0,num,0,TAU);
    for(let o=0;o<i;o++){
      dis = g[i].dist(g[o]);
      a = pow(1/ (dis/limit + 1 ),4);
      if(dis < limit ){
        main.noFill();
        main.stroke(clrs[i][0],clrs[i][1],clrs[i][2]-a*10*i/pointNum);
        let strw = i/num*a*5;
        let nNum = Math.floor(sqrt(i));
        if( multLineSeed >= 0.25 ){
          main.push();
          let ix,ox,iy,oy;
          for(let n=0;n<nNum;n++){
            calRotate(n/nNum,angle0,a);
            main.strokeWeight(strw*0.4);
            main.stroke(clrs[i][0],clrs[i][1],clrs[i][2]);
            if(calLineSeed1>=0.5 && calLineSeed1<=0.8 ||modFreqX<10){
              ix =  new CalLineAri(g[i].x,a,dis,n,calLineSeed1).addSub();
              ox =  new CalLineAri(g[o].x,a,dis,n,calLineSeed1).addSub();
            }else if(calLineSeed1<0.5 || calLineSeed1>0.8){
              ix = g[i].x;
              ox = g[o].x;
            }
            iy =  new CalLineAri(g[i].y,a,dis,n,calLineSeed2).addSub();
            oy =  new CalLineAri(g[o].y,a,dis,n,calLineSeed2).addSub();
            
            main.line(ix, iy, ox, oy);
          }
          main.pop();
        }else if(multLineSeed < 0.25 ){
          main.push();
          calLineSeed1 = (Math.floor(calLineSeed1*100)%2==0 )? calLineSeed1:1;
          if(calLineSeed1!=1 ){calLineSeed2 =1 }
          for(let n=0;n<nNum/2;n++){
            calRotate(1/calLineSeed1,angle0,a);
            let ix =  new CalLineAri(g[i].x,a,dis,n,calLineSeed1).mulDiv();
            let iy =  new CalLineAri(g[i].y,a,dis,n,calLineSeed2).mulDiv();
            let ox =  new CalLineAri(g[o].x,a,dis,n,calLineSeed1).mulDiv();
            let oy =  new CalLineAri(g[o].y,a,dis,n,calLineSeed2).mulDiv();
            main.strokeWeight((nNum-n)/nNum*strw*0.6);
            main.line(ix, iy, ox, oy);
          }
          main.pop();
        }
      }  
    }
  }
  main.pop();
}

function calAng(n,a,b){
  ang = 
  [ {name:"sin", value:sin(a)},
    {name:"cos", value:cos(a)},
    {name:"tan", value:tan(a*10)}, //a*20 分散
    {name:"atan", value:atan(a)},
    {name:"cosh", value:Math.cosh(a/10000)},
    {name:"tanh", value:Math.tanh(a/100)},
    {name:"atan2", value:atan2(a,b)},
  ];
  selAng = ang[n];
  return selAng;
}
function CalLineAri(pos,a,dis,n,calSeed){   
  let calOri = n/500*TAU;
  let calResult;
  let s2,s3,cal_addSub,cal_mulDiv;
  let s2_group = [ a, 1/a ];
  let s3_group = [ a, n, sqrt(dis/n), n/sqrt(dis), a*n ];
  
  this.addSub = function(){ 
    s2 = s2_group[1];
    s3 = pow( s3_group[0], s3_group[Math.floor(1+calLine_groupSeed_s3*(s3_group.length-1))] );
    cal_addSub = [pos+calOri*(s2/s3), pos-calOri*(s2/s3)];
    calResult = cal_addSub[Math.floor(calSeed*cal_addSub.length)];
    return calResult;
  }
  this.mulDiv = function(){
    let openRatio = Math.floor(1+calSeed*6);
    cal_mulDiv = [pos * s2_group[0]*pow(s3_group[1],s3_group[0]), 
                  pos * s2_group[0]/pow(s3_group[1],s3_group[0]) *openRatio ];
    calResult =  (calSeed === 1)? pos: cal_mulDiv[Math.floor(calSeed*cal_mulDiv.length)];
  
    return calResult;
  }
} 
function calRotate(prob,angle,a){
  let roSel = [ 0.008, 0.01, 0.012, 0.016, 0.02, 0.025, 0.032 ];
  let ro1 = ( Math.floor(roSel1*100)%2==0 || selAngSeedX1>3)?
            roSel[Math.floor(roSel1*roSel.length)]:0;
  let ro2 = ( Math.floor(roSel2*100)%2==0 || selAngSeedY1>3)?
            roSel[Math.floor(roSel2*roSel.length)]:0;
  if(roSeed>prob){
    main.rotate( atan(calAng(selAngSeedX0,angle*a).value)*ro1*1);
  }else if(roSeed<=prob){
    main.rotate( atan(calAng(selAngSeedY0,angle*a).value)*ro2*1);
  }
}

function numberFeature(num,name){
  let result;
  let numType = [ "1","10ⁿ", "Magic Numbers", "Integer < 10", "> 10" ];
  if(name == "ori"){
    if(num == 1){
      result = numType[0];
    }else if(num == pow(10,Math.floor(powSeed*6))){
      result = numType[1];
    }else if(Math.floor(oriXseed*100)%3==0 && Math.floor(oriYseed*100)%3==0){
      result = numType[2];
    }else if(num<10 && num!=1){
      result = numType[3];
    }else if(num>10){
      result = numType[4];
    }
  }else if(name == "mod"){
    if(num == 1){
      result = numType[0];
    }else if(num<10 && num!=1){
      result = numType[3];
    }else if(num>10){
      result = numType[4];
    }
  }
  return result;
}
function easeInOutExpo(x){
  return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? pow(2, 20 * x - 10) / 2
    : (2 - pow(2, -20 * x + 10)) / 2;
}
function easeInOutQuad(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function canvasSetup(){
  let seed = Math.floor(fxrand() * 1e5);
  randomSeed(seed);
  noiseSeed(seed);
  cnv = (innerWidth < innerHeight * winRatio) ? (innerWidth / winRatio) : innerHeight;
  wid = cnv * winRatio;
  hei = cnv;
  main_wid = main_hei * winRatio;
  cn = createCanvas(wid, hei);
  cn.id('haxen');
  pixelDensity(3);
  colorMode(HSB, 360, 100, 100);
  rectMode(CENTER);
  main = createGraphics(main_wid, main_hei);
  main.colorMode(HSB, 360, 100, 100);
  main.rectMode(CENTER);
  main.pixelDensity(2);
}
function keyPressed() {
  if (key === "s" || key === "S") {
    image(main,0,0,width,height);
    noLoop();
    saveCanvas("β_"+ fxhash, "png");
  }
  if (key === "d" || key === "D") {
    pixelDensity(8);
    image(main,0,0,width,height);
    saveCanvas("β_"+ fxhash, "png");
    noLoop();
    pixelDensity(3);
    image(main,0,0,width,height);
  }
  if (key === "w" || key === "W") {
    loop()
  }
  if(key === "1") {
    main.background(bk);
    main.push();
    main.translate(main.width/2,main.height/2);
    drawLineMult(points1,pointNum,lengthLimit);
    drawLine(points1,pointNum,lengthLimit);
  main.pop();
  image(main,0,0,width,height);
  }
  if(key === "2") {
    main.background(bk);
    main.push();
    main.translate(main.width/2,main.height/2);
    drawLine(points1,pointNum,lengthLimit);
  main.pop();
  image(main,0,0,width,height);
  }
  if(key === "3") {
    main.background(bk);
    main.push();
    main.translate(main.width/2,main.height/2);
      drawLineMult(points1,pointNum,lengthLimit);
    main.pop();
    image(main,0,0,width,height);
  }
}