//"Southern Gothic" by George Willard
//Created in 2022

let sizeFactor=fxrand();
let colFactorA=fxrand();
let houseSize=fxrand();
let houseCol=fxrand();
let curtainCol=fxrand();
let midA, lowA, lowestA;
let treeSite1;
let housePick=fxrand();
let swingCol=fxrand();
let cemA;
let cemB;
let cemC;
let cemD;
let cemE;
let cemF;
let cemG;
let sunMoon=fxrand();
let hedge=fxrand();
let season=fxrand();
let weather=fxrand();
let overgrown=fxrand();
let time=fxrand();
let anyoneHome=fxrand();
let outside;
let condition;
let subject;



function setup() {
  
  longEdge=max(windowWidth, windowHeight);
  hiResEdge=3000;
  buffer=longEdge*1.2;
  
  if (longEdge<400){
    longEdge=400;
  }
  
  if (sizeFactor>.75){
    width=longEdge;
    height=width/1.5;
  }
   else if (sizeFactor>.35){
    width=longEdge;
    height=width;
  }
  else {
    width=longEdge/1.5;
    height=width*1.5;
  }
  

  createCanvas(width, height);
  if ((weather>.65 && season>.75 && swingCol>.25)&&time>.4){background("white");}
  else if((weather>.65 && season>.75 && swingCol>.25)){background("grey");}
  else if (time>.4){background("tan");}
  else{background("black");}
  rectMode(CENTER);
  treeSite1=fxrand()*width;
   treeSite2=fxrand()*width;
   treeSite3=fxrand()*width;
   treeSite4=fxrand()*width;
   treeSite5=fxrand()*width;
   treeSite6=fxrand()*width;
   treeSite7=fxrand()*width;
   treeSite8=fxrand()*width;
  noStroke();
    if (houseSize>.95){
    midA=3.5;
  }
   else if (houseSize>.85){
    midA=4;
  }
   else if (houseSize>.65){
    midA=3;
  }
   else if (houseSize>.45){
    midA=2;
  }
   else if (houseSize>.25){
    midA=1.5;
     
  }
  else {
    midA=1.75;
  }


  lowA = midA*2;
  lowestA = midA*4;
}

if (weather<=.65){outside=1;}
      else if (weather>.65 && season>.75){outside=3;}
      else {outside=2;}

if (((sizeFactor>.75 && houseSize>=.65)||(sizeFactor<.75 && houseSize<=.45))&&overgrown>.5){condition=1;}
else if (season<.75 && housePick<.25 && houseSize>=.65 && (sizeFactor<.35 || sizeFactor>.75)){condition=1;}
else {condition=2;}


if (housePick<.25 && houseSize<.65){subject=2;}
else if (housePick>.75 && houseSize<.85){subject=1;}
else if (((housePick>.25 && housePick<.75)) && (houseSize>.85 && houseSize<.95)){subject=3;}
else if (((housePick>.25 && housePick<.75)) && (houseSize<.85 || houseSize>.95)){subject=2;}
else if ((housePick<.25 && houseSize>=.65 && sizeFactor>.35 && sizeFactor<.75) && (houseSize>.85 && houseSize<.95)){subject=7;}
else if (houseSize>.85 && houseSize<.95){subject=4;}
else if (housePick<.25 && houseSize>=.65 && sizeFactor>.35 && sizeFactor<.75){subject=6;}
else {subject=5;}

function random_num(r, o) {
    return r + (o - r) * fxrand()
}
function random_int(r, o) {
    return Math.floor(random_num(r, o))
}

function random_num(min, max) {
  return fxrand() * (max - min) + min;
}

  




  function getCondition(value){
if (value>.9 && value<1.2) return "Overgrown"
else if (value > 1.5) return "Abandoned"
    }

if (((sizeFactor>.75 && houseSize>=.65)||(sizeFactor<.75 && houseSize<=.45))&&overgrown>.5){console.log("Condition: Overgrown");}
else if (season<.75 && housePick<.25 && houseSize>=.65 && (sizeFactor<.35 || sizeFactor>.75)){console.log("Condition: Overgrown");}
else {console.log("Condition: Abandoned");}




function getWeather(value) {
  if (value >.9 && value< 1.2) return "Clear"
  else if (value > 1.5 && value < 2.4) return "Raining"
  else if (value > 2.6) return "Snowing"
}
      
      if (weather<=.65){console.log("Weather: Clear");}
      else if (weather>.65 && season>.75){console.log("Weather: Snowing");}
      else {console.log("Weather: Raining");;}
      
      
    function getTime(value) {
  if (value <= 0.4) return "Night"
  else if (value <.7) return "Morning"
  else if (value >=.7) return "Afternoon"
}

 



   function getSubject(value) {
 if (value > .9 && value < 1.2) return "The Church"
  else if (value > 1.9 && value < 2.2) return "A House"
  else if (value > 2.9 && value < 3.2) return "A House & Swing Set"
  else if (value > 3.9 && value < 4.2) return "A Swing Set"
  else if (value > 4.9 && value < 5.2) return "An Empty Field"
  else if (value > 5.9 && value < 6.2) return "The Cemetery"
  else if (value > 6.7) return "A Swing Set in the Cemetery"
}


if (housePick<.25 && houseSize<.65){console.log("Subject: A House");}
else if (housePick>.75 && houseSize<.85){console.log("Subject: The Church");}
else if (((housePick>.25 && housePick<.75)) && (houseSize>.85 && houseSize<.95)){console.log("Subject: A House & Swing Set");}
else if (((housePick>.25 && housePick<.75)) && (houseSize<.85 || houseSize>.95)){console.log("Subject: A House");}
else if ((housePick<.25 && houseSize>=.65 && sizeFactor>.35 && sizeFactor<.75) && (houseSize>.85 && houseSize<.95)){console.log("Subject: A Swing Set in the Cemetery");}
else if (houseSize>.85 && houseSize<.95){console.log("Subject: A Swing Set");}
else if (housePick<.25 && houseSize>=.65 && sizeFactor>.35 && sizeFactor<.75){console.log("Subject: The Cemetery");}
else {console.log("Subject: An Empty Field");}

function draw() {
  

  //sun & moon
  if (sunMoon>.6){
  fill("white");}
  else if (sunMoon>.2){
    fill("coral");}
  else {fill("white");}
  circle(random_num(0,width),random_num(0, height/4-width/20),random_num(width/20,width/5));
  
  
  //vertical hatch

  for (let i = 0; i < width; i += 3) {
  stroke("white")
    strokeWeight(.15)
    line(i, 0, i, height);
  }
  
  //horizontal hatch
    for (let i = 0; i < height; i += 3) {
  stroke("white")
    strokeWeight(.15)
    line(0, i, width, i);
  }
  
  //textures
   for (let o = 1; o < 10000; o++) {
        let o = random_num(0,buffer)
        if (weather>.65 && season>.75){stroke("white");}
     else if (colFactorA>.6){
      stroke("brown");} 
      else if (colFactorA>.4){
      stroke("pink");} 
      else if (colFactorA>.2){
       stroke("gold");} 
      else {
       stroke("green");}  
     noFill();
     strokeWeight(.05)
      angleMode(DEGREES)
circle(random_num(-width/2, width+width/2), random_num(-height/2, height+height/2), o);}
  
  
  
    //sky hatch
    for (let i = 0; i < height/midA+height/20; i += 1) {
  stroke("cyan")
    strokeWeight(.15)
    line(0, i, width, i);
  }
  
   noStroke();
  
   
  
  //Trees behind
  if (midA<3){
  push();
  rectMode(CORNER)
   fill("#555555")
  rect(treeSite1, 0,random_num(width/100,width/60), height/midA+height/20+random_num(width/80,width/45));
rect(treeSite1, 0,random_num(width/100,width/60), height/midA+height/20+random_num(width/80,width/45));
  rect(treeSite2, 0,random_num(width/100,width/60), height/midA+height/20+random_num(width/80,width/45));
  rect(treeSite3, 0,random_num(width/100,width/60), height/midA+height/20+random_num(width/80,width/45));
  rect(treeSite4, 0,random_num(width/100,width/60), height/midA+height/20+random_num(width/80,width/45));
  rect(treeSite5, 0,random_num(width/100,width/60), height/midA+height/20+random_num(width/80,width/45));
  rect(treeSite6, 0,random_num(width/100,width/60), height/midA+height/20+random_num(width/80,width/45));
  rect(treeSite7, 0,random_num(width/100,width/60), height/midA+height/20+random_num(width/80,width/45));
  rect(treeSite8, 0,random_num(width/100,width/60), height/midA+height/20+random_num(width/80,width/45));
  pop();}
  
  //House A 
  
  if (housePick>.25 && housePick<.75){
    
  //House A Chimney
    fill("brown")
  push();
  translate(0,-height/20)
  rect(width/midA-longEdge/lowestA, height/midA-longEdge/lowestA, width/30, longEdge/lowA);
  pop();
  
   //House A Back Elevation
    if (houseCol>.75){fill("CCCFFF");} 
                     else if(houseCol>.5){fill("#eeeef0");}
                     else if (houseCol>.15){fill("#e3e9f0");}
                     else{fill("linen");}
  rect(width/midA-longEdge/lowestA, height/midA, longEdge/lowA, longEdge/lowA)
  
  //House A Roof
  fill("black")
  rect(width/midA-longEdge/lowestA, height/midA-longEdge/lowestA, longEdge/lowA, longEdge/lowA)
  triangle(width/midA,height/midA-longEdge/lowA, width/midA-longEdge/lowestA, height/midA-longEdge/lowestA, width/midA+longEdge/lowestA, height/midA-longEdge/lowestA);
  
  //House A Front Elevation
  push();
  translate(-width/20, height/800);
  if (houseCol>.75){fill("CCCFFF");} 
                     else if(houseCol>.5){fill("cccac0");}
                     else if (houseCol>.15){fill("#d9e9f0");}
                     else{fill("bdd3d2");}
  rect(width/midA, height/midA, longEdge/lowA, longEdge/lowA)
  triangle(width/midA,height/midA-longEdge/lowA, width/midA-longEdge/lowestA, height/midA-longEdge/lowestA, width/midA+longEdge/lowestA, height/midA-longEdge/lowestA);
    if (houseCol>.75){fill("CCCFFF");} 
                     else if(houseCol>.5){fill("cccac0");}
                     else if (houseCol>.15){fill("#d9e9f0");}
                     else{fill("linen");}
  rect(width/midA+longEdge/lowestA, height/midA,width/20,longEdge/lowA);

    
        //Shrubs (Landscape Canvas)
        rectMode(CORNER)
     if (sizeFactor>.75 && hedge>.6 && season<.75){
  fill(random_num(15,80),random_num(80,160),random_num(15,90));  
      rect(width/midA+(longEdge/random_num(80,90)*random_num(-1,1)), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.52));  
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
      rect(width/midA+(longEdge/random_num(80,90)*random_num(-1,1)), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.52));  
         fill(random_num(15,80),random_num(80,160),random_num(15,90));  
      rect(width/midA+(longEdge/random_num(80,90)*random_num(-1,1)), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.52));  
         fill(random_num(15,80),random_num(80,160),random_num(15,90));  
      rect(width/midA+(longEdge/random_num(80,90)*random_num(-1,1)), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.52));  
       
      
         fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
            fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
   fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
    fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
     fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
     fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
 fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
     fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
            fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
   fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
    fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
     fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
     fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
 fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
            fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
   fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
    fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
     fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
     fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
 fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
            fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
   fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
    fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
     fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
     fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
 fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
            fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
   fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
    fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
     fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
     fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
 fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), height/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), height/midA-(longEdge/(lowA))*random_num(1.52,1.53));
     
     }
    
    
    
    
    //Shrubs (Square Canvas)
        rectMode(CORNER)
     if (sizeFactor>.35 && sizeFactor<.75 && hedge>.6 && season<.75){
  fill(random_num(15,80),random_num(80,160),random_num(15,90));  
      rect(width/midA+(longEdge/random_num(80,90)*random_num(-1,1)), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));  
         fill(random_num(15,80),random_num(80,160),random_num(15,90));  
      rect(width/midA+(longEdge/random_num(80,90)*random_num(-1,1)), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2)); 
         fill(random_num(15,80),random_num(80,160),random_num(15,90));  
      rect(width/midA+(longEdge/random_num(80,90)*random_num(-1,1)), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2)); 
         fill(random_num(15,80),random_num(80,160),random_num(15,90));  
      rect(width/midA+(longEdge/random_num(80,90)*random_num(-1,1)), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
         fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
   fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));   
        fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
        fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       
        fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
        fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       
       
        fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2)); fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
        fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
       fill(random_num(15,80),random_num(80,160),random_num(15,90));  
       rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+longEdge/(lowA*random_num(1.80,1.95)), (longEdge/lowA+width/20)/random_num(7.8,8.2), width/midA-(longEdge/(lowA))*random_num(2.2,2.2));
     
     }
    
    //Shrubs (Portrait Canvas)

    if (sizeFactor<.35 && fxrand()>.55 && hedge>.6 && houseSize<.85 && season<.75){
  fill(random_num(15,80),random_num(80,160),random_num(15,90));  
      rect(width/midA+(longEdge/random_num(80,90)*random_num(-1,1)), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
      fill(random_num(15,80),random_num(80,160),random_num(15,90));  
      rect(width/midA+(longEdge/random_num(80,90)*random_num(-1,1)), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17)); 
      fill(random_num(15,80),random_num(80,160),random_num(15,90));  
      rect(width/midA+(longEdge/random_num(80,90)*random_num(-1,1)), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17)); 
      fill(random_num(15,80),random_num(80,160),random_num(15,90));  
      rect(width/midA+(longEdge/random_num(80,90)*random_num(-1,1)), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));    
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
           fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17))    
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));   
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
           fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));   
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
      fill(random_num(15,80),random_num(80,160),random_num(15,90));
       rect(width/midA-(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));  
 rect(width/midA+(longEdge/(lowA*random_num(1.75,10))), width/midA+(longEdge/(lowA))-random_num(0,longEdge/80), (longEdge/lowA+width/20)/random_num(7.8,8.2), longEdge/random_num(15,17));
    }
    
    
    
    
    
  pop();
  
  //House A Window Frame + Curtains
   fill("black")
  rect(width/midA-longEdge/lowestA, height/midA, lowestA+width/50, height/lowestA);
   rect(width/midA, height/midA, lowestA+width/50, height/lowestA);
  if (houseSize<.65){ if (curtainCol>.75){fill("#F27778");} 
                     else if(curtainCol>.5){fill("cadetblue");}
                     else if (curtainCol>.15){fill("#113355");}
                     else{fill("snow");}
  rect(width/midA, height/midA, lowestA+width/7.5, height/lowestA);
rect(width/midA-longEdge/lowestA, height/midA, lowestA+width/15, height/lowestA);}
  
   //House A Windows 

   if (anyoneHome>.05){fill(80*fxrand()+40);}
    else {fill("darkkhaki");}
  rect(width/midA-longEdge/lowestA, height/midA, lowestA+width/80, height/lowestA-height/400);
   rect(width/midA, height/midA, lowestA+width/80, height/lowestA-height/400);
  if (houseSize<.65){rect(width/midA, height/midA, lowestA+width/9.5, height/lowestA);
rect(width/midA-longEdge/lowestA, height/midA, lowestA+width/19, height/lowestA);}
  if (houseCol>.75){fill("CCCFFF");} 
                     else if(houseCol>.5){fill("cccac0");}
                     else if (houseCol>.15){fill("c0c6ce");}
                     else{fill("bdd3d2");}
   rect(width/midA-longEdge/lowestA, height/midA, width/400, height/lowestA);
   rect(width/midA, height/midA, width/400, height/lowestA);
  rect(width/midA-longEdge/lowestA, height/midA, lowestA+width/80, height/400);
   rect(width/midA, height/midA, lowestA+width/80, height/400);
if (houseSize<.65){rect(width/midA, height/midA, lowestA+width/9.5, height/400);
rect(width/midA-longEdge/lowestA, height/midA, lowestA+width/19, height/400);}}
  
  
  push();
  if (houseSize>.85 && houseSize<.95){
  
  //Swing Set Structure
 
  if (swingCol>.75){
  stroke("red");}
  else if(swingCol>.5){stroke("black");}
  else if (swingCol>.25){stroke("blue");}
  else {stroke("white");}
     if (houseSize>.95){
    strokeWeight(2.3);
  }
   else if (houseSize>.85){
    strokeWeight(2);
  }
   else if (houseSize>.65){
    strokeWeight(3);
  }
   else if (houseSize>.45){
    strokeWeight(3.5);
  }
   else if (houseSize>.25){
    strokeWeight(5);
  }
  else {
   strokeWeight(4);
  }
  line(width/midA+width/10, (height/midA+height/10)/3, (width/midA+width/10)*1.2, height/midA+height/10);
    line(width/midA+width/10, (height/midA+height/10)/3, (width/midA+width/10)/1.2, height/midA+height/10);
  line(width/midA+width/10, (height/midA+height/10)/3, (width/midA+width/10)+(width/midA+width/10), (height/midA+height/10)/3);
    line((width/midA+width/10)+(width/midA+width/10), (height/midA+height/10)/3, ((width/midA+width/10)+(width/midA+width/10))*1.09, (height/midA+height/10));
   line((width/midA+width/10)+(width/midA+width/10), (height/midA+height/10)/3, ((width/midA+width/10)+(width/midA+width/10))/1.09, (height/midA+height/10));
 

  
  // Swing Set Chains
  
  push();
  strokeWeight(2);
  stroke("black");
     line((width/midA+width/10)+(width/midA+width/10)/4, (height/midA+height/10)/3, (width/midA+width/10)+(width/midA+width/10)/4, (height/midA+height/10)/1.2);
     line((width/midA+width/10)+(width/midA+width/10)/2.75, (height/midA+height/10)/3, (width/midA+width/10)+(width/midA+width/10)/2.75, (height/midA+height/10)/1.2);
    line((width/midA+width/10)+(width/midA+width/10)/1.58, (height/midA+height/10)/3, (width/midA+width/10)+(width/midA+width/10)/1.58, (height/midA+height/10)/1.2);
     line((width/midA+width/10)+(width/midA+width/10)/1.33333333, (height/midA+height/10)/3, (width/midA+width/10)+(width/midA+width/10)/1.33333333, (height/midA+height/10)/1.2);
  pop();
  
  //Swing Set Seats
  
  push();
    noStroke();
  fill("red")
       rect((width/midA+width/10)+(width/midA+width/10)/1.44, (height/midA+height/10)/1.2, ((width/midA+width/10)+(width/midA+width/10)/1.3)-((width/midA+width/10)+(width/midA+width/10)/1.58), ((height/midA+height/10)/1.2)-((height/midA+height/10)/1.175));
        rect((width/midA+width/10)+(width/midA+width/10)/3.25, (height/midA+height/10)/1.2, ((width/midA+width/10)+(width/midA+width/10)/1.3)-((width/midA+width/10)+(width/midA+width/10)/1.58), ((height/midA+height/10)/1.2)-((height/midA+height/10)/1.175));
    pop();
  }
    pop();
  
  
    //House B 
  
  if (housePick<.25 && midA<3){
    
  //House B Chimney
    fill("brown")
  push();
  translate(0,-height/20)
  rect(width/midA-longEdge/lowestA, height/midA-longEdge/lowestA, width/30, longEdge/lowA);
  pop();
  
  
  //House B Roof
    
    push();
    
  fill("black")
  rect((width/midA)/2, height/midA-longEdge/lowestA, (longEdge/lowA)/.75, longEdge/lowA)
 
    pop();
  
  //House B Front Elevation
  push();
  
  if (houseCol>.75){fill("CCCFFF");} 
                     else if(houseCol>.5){fill("cccac0");}
                     else if (houseCol>.15){fill("#d9e9f0");}
                     else{fill("bdd3d2");}
  rect((width/midA)/2, height/midA, (longEdge/lowA)/.75, longEdge/lowA)

  
  
  //House B Window Frame + Curtains
    push();
    translate(-width/5, height/800);
   fill("black")
  rect(width/midA-longEdge/lowestA, height/midA, lowestA+width/50, height/lowestA);
   rect(width/midA, height/midA, lowestA+width/50, height/lowestA);
  if (houseSize<.65){ if (curtainCol>.75){fill("#F27778");} 
                     else if(curtainCol>.5){fill("#204240");}
                     else if (curtainCol>.15){fill("#113355");}
                     else{fill("snow");}
  rect(width/midA, height/midA, lowestA+width/7.5, height/lowestA);
rect(width/midA-longEdge/lowestA, height/midA, lowestA+width/15, height/lowestA);}
    pop();
  
   //House B Windows 
push();
    translate(-width/5, height/800);
   fill(80*fxrand()+40)
  rect(width/midA-longEdge/lowestA, height/midA, lowestA+width/80, height/lowestA-height/400);
   rect(width/midA, height/midA, lowestA+width/80, height/lowestA-height/400);
  if (houseSize<.65){rect(width/midA, height/midA, lowestA+width/9.5, height/lowestA);
rect(width/midA-longEdge/lowestA, height/midA, lowestA+width/19, height/lowestA);}
  if (houseCol>.75){fill("CCCFFF");} 
                     else if(houseCol>.5){fill("cccac0");}
                     else if (houseCol>.15){fill("c0c6ce");}
                     else{fill("bdd3d2");}
   rect(width/midA-longEdge/lowestA, height/midA, width/400, height/lowestA);
   rect(width/midA, height/midA, width/400, height/lowestA);
  rect(width/midA-longEdge/lowestA, height/midA, lowestA+width/80, height/400);
   rect(width/midA, height/midA, lowestA+width/80, height/400);
if (houseSize<.65){rect(width/midA, height/midA, lowestA+width/9.5, height/400);
rect(width/midA-longEdge/lowestA, height/midA, lowestA+width/19, height/400);}
  
  
  pop();
  }

  
  //pool of blood
  
    push();
  if (fxrand()>0){
    rotate(random_num(-20,20))
    fill("brown");
    ellipse(random_num(0,width), (longEdge/midA)*2+width/10, width/10, width/20);
    
  }
  pop();
  
  
  
   //Church
  if (housePick>.75 && houseSize<.85){
    
    
    //Church Chimney
    fill("brown")
  push();

  rect(width/midA-longEdge/lowestA, height/midA-longEdge/lowestA, width/30, longEdge/lowA);
  pop();
  

  

  
  //Church Front Elevation Part I
  push();

  if (houseCol>.75){fill("CCCFFF");} 
                     else if(houseCol>.5){fill("cccac0");}
                     else if (houseCol>.15){fill("#d9e9f0");}
                     else{fill("bdd3d2");}

 rect(width/midA, height/(midA/1.09), longEdge/(midA/.75), height/(midA/.7));
       rect(width/midA+longEdge/(midA/.75)/2, height/(midA/1.09), longEdge/(midA/.75), height/(midA/.7));

      //Church Roof
  fill("black")
  rect(width/midA+longEdge/lowestA, height/midA-longEdge/lowestA, longEdge/midA, longEdge/lowA)
      rect(width/midA-longEdge/lowestA, height/midA-longEdge/lowestA, longEdge/lowestA, longEdge/lowA);
    rect(width/midA+longEdge/(midA/.75)/2, height/midA-longEdge/lowestA, longEdge/(midA/.75),longEdge/lowA);
    
    //Church Front Elevation Part II
    
    if (houseCol>.75){fill("CCCFFF");} 
                     else if(houseCol>.5){fill("cccac0");}
                     else if (houseCol>.15){fill("#d9e9f0");}
                     else{fill("bdd3d2");}
  triangle(width/midA,(height/midA-longEdge/lowA)+height/80, width/midA-longEdge/lowestA, height/midA-longEdge/(lowestA-height/2), width/midA+longEdge/lowestA, height/midA-longEdge/(lowestA-height/2));
    
    //Church Windows
    fill ("darkgrey")
    circle(width/midA,height/midA, (longEdge/lowestA)/2);
    
    
    //Church Door

     fill("lightgrey")
     rect(width/midA, (height/(midA/1.09))/.75, (longEdge/lowestA)/3, height/(midA/.085));
    fill("black")
    rect(width/midA, (height/(midA/1.09))/.85, (longEdge/lowestA)/3, height/(midA/.25));
       fill("brown")
    rect(width/midA, (height/(midA/1.09))/.846, (longEdge/lowestA)/3.5, height/(midA/.245));
    
    fill("white")
     rect(width/midA, ((height/midA-longEdge/lowA)+height/80)-(height/(8*midA)/2), (longEdge/lowestA)/40.5, height/(8*midA));
     rect(width/midA, ((height/midA-longEdge/lowA)+height/200)-(height/(8*midA)/2), (longEdge/lowestA)/4.5, height/(100*midA));
   
  }
  
  
  
  
   //Cemetery
  
  if (housePick<.25 && midA>=3 && sizeFactor>.35 && sizeFactor<.75){
    
    cemA=random_num(20,200);
    cemB=random_num(5, 7.5);
    cemC=random_num(3, 5);
    cemD=random_num(2.5,3);
     cemE=random_num(1.75,2.25);
  cemF=random_num(1,1.6);
    cemG=random_num(20,100);
    
    
  //Crosses
    push();
   fill("white");
    noStroke();
  rect(width/midA-longEdge/lowestA, (height/midA)/.8, width/(midA*50), (height/midA)/.8-(height/midA));
    rect(width/midA-longEdge/lowestA, (height/midA)/.825, width/(midA*5), (height/midA)/.98-(height/midA));
  
     rect(width/midA-longEdge/lowestA+width/cemA, ((height/midA)/.8)+height/cemB, width/(midA*50), (height/midA)/.8-(height/midA));
    rect(width/midA-longEdge/lowestA+width/cemA, ((height/midA)/.825)+height/cemB, width/(midA*5), (height/midA)/.98-(height/midA)); 
    
  
     rect(width/midA-longEdge/lowestA+width/cemB, ((height/midA)/.8)+height/cemD, width/(midA*50), (height/midA)/.8-(height/midA));
    rect(width/midA-longEdge/lowestA+width/cemB, ((height/midA)/.825)+height/cemD, width/(midA*5), (height/midA)/.98-(height/midA)); 
    
     rect(width/midA-longEdge/lowestA+width/cemC, ((height/midA)/.8)+height/cemC, width/(midA*50), (height/midA)/.8-(height/midA));
    rect(width/midA-longEdge/lowestA+width/cemC, ((height/midA)/.825)+height/cemC, width/(midA*5), (height/midA)/.98-(height/midA)); 
    
         rect(width/midA-longEdge/lowestA+width/cemD, ((height/midA)/.8)+height/cemF, width/(midA*50), (height/midA)/.8-(height/midA));
    rect(width/midA-longEdge/lowestA+width/cemD, ((height/midA)/.825)+height/cemF, width/(midA*5), (height/midA)/.98-(height/midA)); 
    
         rect(width/midA-longEdge/lowestA+width/cemE, ((height/midA)/.8)+height/cemE, width/(midA*50), (height/midA)/.8-(height/midA));
    rect(width/midA-longEdge/lowestA+width/cemE, ((height/midA)/.825)+height/cemE, width/(midA*5), (height/midA)/.98-(height/midA)); 
    
         rect(width/midA-longEdge/lowestA+width/cemF, ((height/midA)/.8)+height/cemA, width/(midA*50), (height/midA)/.8-(height/midA));
    rect(width/midA-longEdge/lowestA+width/cemF, ((height/midA)/.825)+height/cemA, width/(midA*5), (height/midA)/.98-(height/midA)); 
    
  pop();
  
  
  }
  
  //snow & rain
  
  if (weather>.65){
    for (let i = 0; i < width*2; i += width/80) {
  
      if (season>.75){fill("white");}
      else {fill(random_num(0,20), random_num(0,20),random_num(90,130));}
      push();
  rotate(45*fxrand())
  rect(i, longEdge, width/600, width/((200*fxrand())+100));
      rect(i, longEdge/2, width/600, width/((200*fxrand())+100));
     rect(i, longEdge/4, width/600, width/((200*fxrand())+100));
       rect(i, longEdge/8, width/600, width/((200*fxrand())+100));
    rect(i, longEdge/16, width/600, width/((200*fxrand())+100));
      rect(i, longEdge/32, width/600, width/((200*fxrand())+100));
      rect(i, -longEdge/32, width/600, width/((200*fxrand())+100));
      pop();
  }}
  
  //Grass
  
  if (((sizeFactor>.75 && houseSize>=.65)||(sizeFactor<.75 && houseSize<=.45))&&overgrown>.5){
  for (let i = 0; i < width; i += width/800) {
  
      if (weather>.65 && season>.75){fill(random_num(200,255));}
    else{
    fill(random_num(50,120), random_num(100,120),random_num(10,30));}
      push();
  rotate(1*fxrand()-2*fxrand()*fxrand());
   
  rect(i, longEdge/(midA-.5), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-.2), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-.3), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-.4), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-.55), width/600, width/random_num(4,8));
     rect(i, longEdge/(midA-.1), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
      rect(i, longEdge/(midA-.15), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
   rect(i, longEdge, width/600, width/random_num(8,38));
    rotate(1*fxrand()-2*fxrand()*fxrand());
      rect(i, longEdge/(midA-.25), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-.65), width/600, width/random_num(4,8));
     rect(i, longEdge/(midA-.6), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
      rect(i, longEdge/(midA-.7), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-.75), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-.85), width/600, width/random_num(4,8));
     rect(i, longEdge/(midA-.8), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
      rect(i, longEdge/(midA-.35), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-.95), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
     rect(i, longEdge/(midA-.9), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
      rect(i, longEdge/(midA-.45), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
     rect(i, longEdge/(midA-1), width/600, width/random_num(4,8));
     rotate(1*fxrand()-2*fxrand()*fxrand());
     rect(i, longEdge/(midA-1.05), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
      rect(i, longEdge/(midA-.15), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.1), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.15), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.2), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.25), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.3), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.35), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.45), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.55), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.65), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.75), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.85), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.95), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.4), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.5), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.6), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.7), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.8), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.9), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2), width/600, width/random_num(8,18));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.05), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.15), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.25), width/600, width/random_num(8,28));
          rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.35), width/600, width/random_num(8,28));
          rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.45), width/600, width/random_num(8,28));
          rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.55), width/600, width/random_num(8,28));
          rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.65), width/600, width/random_num(8,28));
          rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.75), width/600, width/random_num(8,28));
          rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.85), width/600, width/random_num(8,28));
          rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.95), width/600, width/random_num(8,28));
          rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-3.05), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.1), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.2), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.3), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.4), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.5), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.6), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.7), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.8), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.9), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-3), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-3.1), width/600, width/random_num(8,18));
         rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-3.2), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-3.3), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-3.4), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-3.5), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-3.6), width/600, width/random_num(8,18));
      pop();
  }}
  
  //flowerfield
 
    
    if (season<.75 && housePick<.25 && houseSize>=.65 && (sizeFactor<.35 || sizeFactor>.75)) {
      
      
      for (let i = 0; i < width*1.2; i += width/800) {
      
  
      if (weather>.65 && season>.75){fill(random_num(200,255));}
    else{
    fill(random_num(50,120), random_num(100,120),random_num(10,30));}
      push();
  rotate(1*fxrand()-2*fxrand()*fxrand());
   
        push();
        fill("gold")
     
  rect(i, random_num(longEdge/midA, height), width/70, width/50);
         pop();
        
        if (fxrand()>.5){
          push();
        fill("red")
     
  rect(i, random_num(longEdge/midA, height), width/70, width/50);
         pop();}
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-.2), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-.3), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-.4), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-.55), width/600, width/random_num(4,8));
     rect(i, longEdge/(midA-.1), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
      rect(i, longEdge/(midA-.15), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
   rect(i, longEdge, width/600, width/random_num(8,38));
    rotate(1*fxrand()-2*fxrand()*fxrand());
      rect(i, longEdge/(midA-.25), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-.65), width/600, width/random_num(4,8));
     rect(i, longEdge/(midA-.6), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
      rect(i, longEdge/(midA-.7), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-.75), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-.85), width/600, width/random_num(4,8));
     rect(i, longEdge/(midA-.8), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
      rect(i, longEdge/(midA-.35), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-.95), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
     rect(i, longEdge/(midA-.9), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
      rect(i, longEdge/(midA-.45), width/600, width/random_num(4,8));
    rotate(1*fxrand()-2*fxrand()*fxrand());
     rect(i, longEdge/(midA-1), width/600, width/random_num(4,8));
     rotate(1*fxrand()-2*fxrand()*fxrand());
     rect(i, longEdge/(midA-1.05), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
      rect(i, longEdge/(midA-.15), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.1), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.15), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.2), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.25), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.3), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.35), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.45), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.55), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.65), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.75), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.85), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.95), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.4), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.5), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.6), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.7), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.8), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-1.9), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2), width/600, width/random_num(8,18));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.05), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.15), width/600, width/random_num(8,28));
      rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.25), width/600, width/random_num(8,28));
          rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.35), width/600, width/random_num(8,28));
          rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.45), width/600, width/random_num(8,28));
          rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.55), width/600, width/random_num(8,28));
          rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.65), width/600, width/random_num(8,28));
          rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.75), width/600, width/random_num(8,28));
          rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.85), width/600, width/random_num(8,28));
          rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.95), width/600, width/random_num(8,28));
          rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-3.05), width/600, width/random_num(8,28));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.1), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.2), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.3), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.4), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.5), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.6), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.7), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.8), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-2.9), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-3), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-3.1), width/600, width/random_num(8,18));
         rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-3.2), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-3.3), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-3.4), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-3.5), width/600, width/random_num(8,18));
    rotate(1*fxrand()-2*fxrand()*fxrand());
    rect(i, longEdge/(midA-3.6), width/600, width/random_num(8,18));
      
      pop();
  }}
      

  
  //More Texture
  
  for (let o = 1; o < 10000; o++) {
        let o = random_num(0,buffer)
      stroke("snow")
     noFill();
     strokeWeight(.03)
      angleMode(DEGREES)
circle(random_num(-width/2, width+width/2), random_num(-height/2, height+height/2), o);}
  
    for (let o = 1; o < 10000; o++) {
        let o = random_num(0,buffer)
      stroke("white")
     noFill();
     strokeWeight(.03)
      angleMode(DEGREES)
circle(random_num(-width/2, width+width/2), random_num(-height/2, height+height/2), o);}
  
   //horizontal hatch
    for (let i = 0; i < height; i += 3) {
  stroke("navy")
    strokeWeight(.15)
    line(0, i, width, i);
  }
  
  noLoop();
  fxpreview();
  
  
}

 window.$fxhashFeatures = {
  
   "Subject": getSubject(subject),
   "Time of Day": getTime(time),
   "Weather": getWeather(outside),
   "Condition":getCondition(condition)
   
  }


if (time<=.4){console.log("Time of Day: Night");}
  else if (time<.7){console.log("Time of Day: Morning");}
  else {console.log("Time of Day: Afternoon");}

function keyPressed(){
  
  if (keyCode === DOWN_ARROW) {
    saveCanvas("SouthernGothic", "png");
  }

  noLoop();

}