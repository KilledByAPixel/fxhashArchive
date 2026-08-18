// Ordinary Places (2022)
// WILLARD

let var0=fxrand();
let var1=fxrand();
let var2=fxrand();
let var3=fxrand();
let var4=fxrand();
let var5=fxrand();
let var6=fxrand();
let var7=fxrand();
let var8=fxrand();
let var9=fxrand();
let time=fxrand();
let opt1, opt2, opt3, opt4;
let colTone=fxrand();
let ladder0, ladder1, ladder2;
let frontback=fxrand();
let ladderAB=fxrand();
let walkway;
let ladderShadow;
let signX;
let signY;
let gasMove;
let varA;
let gasStation=fxrand();
let sky=fxrand();
let barn=fxrand();
let barnPeak;
let framer=fxrand();
let barnAngle;
let overgrown=fxrand();
let mover=fxrand();
let tower=fxrand();
let varMin, varMax;
let backRoad=fxrand();
let blood=fxrand();
let rain=fxrand();
let section=fxrand();
let treeSite1, treeSite2, treeSite3, treeSite4, treeSite5, treeSite6, treeSite7, treeSite8;
let trees=fxrand();
let barnCol=fxrand();
let snowday=fxrand();
let skinnyTower=fxrand();
let nothing=fxrand();
let wild=fxrand();
let col2=fxrand();
let col3=fxrand();
let structure=fxrand();
let signage=fxrand();
let cem1x, cem1y, cem2x, cem2y, cem3x, cem3y, cem4x, cem4y, cem5x, cem5y, cem6x, cem6y, cem7x, cem7y, cem8x, cem8y, cem9x, cem9y, cem10x, cem10y;
let cemetery=fxrand();
let point1, point2, point3;
let graffiti;
let numbers=fxrand();
let num=fxrand();
let outside;
let subject;
let unordinary;



function setup() {
  
  longEdge=max(windowWidth, windowHeight);
  buffer=longEdge*1.2;
  
  if (longEdge<400){
    longEdge=400;
  }
  
  if (var1>.75){
    width=longEdge;
    height=width/1.5;
  }
   else if (var1>.35){
    width=longEdge;
    height=width;
  }
  else {
    width=longEdge/1.5;
    height=width*1.5;
  }
  
  if (ladderAB>.75){
  ladder0=random_num(10,13);
  ladder1=width/2 - width/ladder0;
  ladder2=width/2 - width/(ladder0+1);}
  else if (ladderAB>.5){
  ladder0=width/random_num(50,200);
  ladder1=width/2 - ladder0;
  ladder2=width/2 - (ladder0)*3;}
  else if (ladderAB>.25){
  ladder0=width/random_num(50,200);
  ladder1=width/2 + ladder0;
  ladder2=width/2 + (ladder0)*3;}
    else {ladder0=random_num(10,13);
  ladder1=width/2 + width/ladder0;
  ladder2=width/2 + width/(ladder0+1);}
  
  if (ladder2>width/2){walkway=width/2-width/11;}
  else {walkway=width/2+width/11;}
  
  if (var1>.075){}
  
 if (ladder2>width/2){walkway=width/2-width/11;}
  else {walkway=width/2+width/11;}
  
  varA=width;
  
  
  
  createCanvas(width, height);
 background("#777777");
  rectMode(CENTER);
  opt4=fxrand()*width;
  treeSite1=fxrand()*width;
   treeSite2=fxrand()*width;
   treeSite3=fxrand()*width;
   treeSite4=fxrand()*width;
   treeSite5=fxrand()*width;
   treeSite6=fxrand()*width;
   treeSite7=fxrand()*width;
   treeSite8=fxrand()*width;
  noStroke();
    if (var3>.95){
    opt1=3.5;
  }
   else if (var3>.85){
    opt1=4;
  }
   else if (var3>.65){
    opt1=3;
  }
   else if (var3>.45){
    opt1=2;
  }
   else if (var3>.25){
    opt1=1.5;
     
  }
  else {
    opt1=1.75;
  }


  opt2 = opt1*2;
  opt3 = opt1*4;
}

if (section<.15 && rain>.95 && overgrown>.6 && snowday<.05){outside=1;}
      else if (overgrown>.6 && snowday<.05){outside=2;}
  else if (section<.15 && rain>.95){outside=3;}
      else {outside=4;}

if (sky>.765){time=1;}
else if (sky>.525){time=2;}
  else if (sky>.35){time=3;}
else {time=4;}


if (gasStation>.5 && section>.15 && (tower<.5 || skinnyTower>.75) && barn>.5 && barnAngle<.25 && mover<.25){unordinary=1;}
else if (gasStation>.5 && section>.15 && tower>.5 && mover<.25 && skinnyTower<.75){unordinary=1;}
      else if (overgrown<.6 && cemetery>.35 && (section<.15 || gasStation<.5) && (graffiti<.2 || var1<.35 || var1>.75 || skinnyTower>.75)){unordinary=2;}
  else if (graffiti>.2 && tower>.5 && var1>.35 && var1<.75 && skinnyTower<.75 && (section<.15 || gasStation<.5)){unordinary=3;}
      else if (!(gasStation>.5 && section>.15 && (tower<.5 || skinnyTower>.75) && barn>.5 && barnAngle<.25 && mover<.25)) {unordinary=4;}
else {unordinary=1;}



if (tower>.5 && barn>.5 && gasStation<.5){subject=1;}
else if (tower>.5 && gasStation<.5){subject=2;}
else if (tower>.5 && barn>.5){subject=3;}
else if (barn>.5 && gasStation<.5){subject=4;}
else if (tower>.5){subject=5;}
else if (barn>.5){subject=6;}
  else if (gasStation<.5){subject=7;}
else if (barn<.5 && tower<.5 && gasStation>.5 && overgrown >.6 && nothing<.9){subject=6;}
  else if (barn<.5 && tower<.5 && gasStation>.5 && overgrown <.6 && nothing<.9){subject=7;}
else if (barn<=.5 && tower<=.5 && gasStation>=.5 && nothing>=.9){subject=8;}


function random_num(r, o) {
    return r + (o - r) * fxrand()
}
function random_int(r, o) {
    return Math.floor(random_num(r, o))
}

function random_num(min, max) {
  return fxrand() * (max - min) + min;
}



//features


if (gasStation>.5 && section>.15 && tower>.5 && mover<.25 && skinnyTower<.75) {console.log("Out of the Ordinary: Section Cut");}
else if (gasStation>.5 && section>.15 && tower<.5 && barn>.5 && barnAngle<.25 && mover<.25){console.log("Out of the Ordinary: Section Cut");}
else if (overgrown<.6 && cemetery>.35 && (section<.15 || gasStation<.5) && (graffiti<.2 || var1<.35 || var1>.75 || skinnyTower>.75)){console.log("Out of the Ordinary: Cemetery");}
else if (graffiti>.2 && tower>.5 && var1>.35 && var1<.75 && skinnyTower<.75 && (section<.15 || gasStation<.5)){console.log("Out of the Ordinary: Secret Message");}
else if (!(gasStation>.5 && section>.15 && (tower<.5 || skinnyTower>.75) && barn>.5 && barnAngle<.25 && mover<.25)) {console.log("Out of the Ordinary: Nothing");}
else {console.log("Out of the Ordinary: Section Cut");}




function getUnordinary(value){
  if (value > .1 && value  < 1.2) return "Section Cut"
  else if (value > 1.5 && value < 2.4) return "Cemetery"
  else if (value > 2.5 && value < 3.4) return "Secret Message"
  else if (value > 3.6) return "Nothing"
}

function getWeather(value) {
  if (value > 0 && value< 1.2) return "Freezing Rain"
  else if (value > 1.5 && value < 2.4) return "Snowday"
  else if (value > 2.5 && value < 3.4) return "Raining"
  else if (value > 3.6) return "Clear"
}
      
      if (section<.15 && rain>.95 && overgrown>.6 && snowday<.05){console.log("Weather: Freezing Rain");}
      else if (overgrown>.6 && snowday<.05){console.log("Weather: Snowday");}
 else if (section<.15 && rain>.95){console.log("Weather: Raining");}
      else {console.log("Weather: Clear");}
      
      
    function getTime(value) {
  if (value > .4 && value < 1.2) return "Night"
  else if (value > 1.5 && value < 2.4) return "Morning"
  else if (value > 2.5 && value < 3.4) return "Sunset"
  else if (value > 3.6) return "Afternoon"
}

 
if (sky>.765){console.log("Time of Day: Night");}
      else if (sky>.525){console.log("Time of Day: Morning");}
 else if (sky>.35){console.log("Time of Day: Sunset");}
      else {console.log("Time of Day: Afternoon");}


   function getSubject(value) {
 if (value > .9 && value < 1.2) return "Gas Station, Water Tower, & Barn"
  else if (value > 1.9 && value < 2.2) return "Gas Station & Water Tower"
  else if (value > 2.9 && value < 3.2) return "Water Tower & Barn"
  else if (value > 3.9 && value < 4.2) return "Gas Station & Barn"
  else if (value > 4.9 && value < 5.2) return "Water Tower"
  else if (value > 5.9 && value < 6.2) return "Barn"
  else if (value > 6.7 && value < 7.2) return "Gas Station"
      else if (value > 7.2) return "Sign"
     
}


if (tower>.5 && barn>.5 && gasStation<.5){console.log("Subject: Gas Station, Water Tower, & Barn");}
else if (tower>.5 && gasStation<.5){console.log("Subject: Gas Station & Water Tower");}
else if (tower>.5 && barn>.5){console.log("Subject: Water Tower & Barn");}
else if (barn>.5 && gasStation<.5){console.log("Subject: Gas Station & Barn");}
else if (tower>.5){console.log("Subject: Water Tower");}
else if (barn>.5){console.log("Subject: Barn");}
else if (gasStation<.5){console.log("Subject: Gas Station");}
else if (barn<.5 && tower<.5 && gasStation>.5 && overgrown >.6 && nothing<.9){console.log("Subject: Barn");}
else if (barn<.5 && tower<.5 && gasStation>.5 && overgrown <.6 && nothing<.9){console.log("Subject: Gas Station");}
else if (barn<=.5 && tower<=.5 && gasStation>=.5 && nothing>=.9) {console.log("Subject: Sign");}





signX=1.4;
signY=1.4;


function draw() {
  
  gasMove=random_num(-varA/4, varA/4);
  fill('white')
rect(width/2, height/2, width*9/10, height*9/10)
  
   
  
  //night sky
  if (sky>.975){
  fill("rgb(41,41,67)");
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);}
   else if (sky>.95){
  fill("rgb(0,0,0)");
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);}
else if (sky>.85){
  fill('#333333');
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);}
  else if(sky>.825){
    fill(65);
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);  
    fill(60);
  rect(width/2, height/2, 8.5*width/10, 7.5*height/10);  
    fill(50);
  rect(width/2, height/2, 8.5*width/10, 6.5*height/10);  
    fill(40);
  rect(width/2, height/2, 8.5*width/10, 5.5*height/10);  
    fill(30);
  rect(width/2, height/2, 8.5*width/10, 4.5*height/10);   
   fill(20);
  rect(width/2, height/2, 8.5*width/10, 3.5*height/10);
     fill(10);
  rect(width/2, height/2, 8.5*width/10, 2.5*height/10);
     fill(0);
  rect(width/2, height/2, 8.5*width/10, 1.5*height/10);}
    else if(sky>.80){
    fill("rgb(0,0,128)");
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);  
    fill("rgb(0,0,118)");
  rect(width/2, height/2, 8.5*width/10, 7.5*height/10);  
    fill("rgb(0,0,108)");
  rect(width/2, height/2, 8.5*width/10, 6.5*height/10);  
    fill("rgb(0,0,98)");
  rect(width/2, height/2, 8.5*width/10, 5.5*height/10);  
    fill("rgb(0,0,88)");
  rect(width/2, height/2, 8.5*width/10, 4.5*height/10);   
   fill("rgb(0,0,78)");
  rect(width/2, height/2, 8.5*width/10, 3.5*height/10);
     fill("rgb(0,0,68)");
  rect(width/2, height/2, 8.5*width/10, 2.5*height/10);
     fill("rgb(0,0,58)");
  rect(width/2, height/2, 8.5*width/10, 1.5*height/10);}
    else if(sky>.775){
    fill("rgb(88,0,0)");
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);  
    fill("rgb(78,0,0)");
  rect(width/2, height/2, 8.5*width/10, 7.5*height/10);  
    fill("rgb(68,0,0)");
  rect(width/2, height/2, 8.5*width/10, 6.5*height/10);  
    fill("rgb(58,0,0)");
  rect(width/2, height/2, 8.5*width/10, 5.5*height/10);  
    fill("rgb(48,0,0)");
  rect(width/2, height/2, 8.5*width/10, 4.5*height/10);   
   fill("rgb(38,0,0)");
  rect(width/2, height/2, 8.5*width/10, 3.5*height/10);
     fill("rgb(28,0,0)");
  rect(width/2, height/2, 8.5*width/10, 2.5*height/10);
     fill("rgb(18,0,0)");
  rect(width/2, height/2, 8.5*width/10, 1.5*height/10);}
   else if(sky>.765){
    fill("rgb(0,68,0)");
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);  
    fill("rgb(0,58,0)");
  rect(width/2, height/2, 8.5*width/10, 7.5*height/10);  
    fill("rgb(0,48,0)");
  rect(width/2, height/2, 8.5*width/10, 6.5*height/10);  
    fill("rgb(0,38,0)");
  rect(width/2, height/2, 8.5*width/10, 5.5*height/10);  
    fill("rgb(0,28,0)");
  rect(width/2, height/2, 8.5*width/10, 4.5*height/10);   
   fill("rgb(0,18,0)");
  rect(width/2, height/2, 8.5*width/10, 3.5*height/10);
     fill("rgb(0,08,0)");
  rect(width/2, height/2, 8.5*width/10, 2.5*height/10);
     fill("rgb(0,0,0)");
  rect(width/2, height/2, 8.5*width/10, 1.5*height/10);}
  
  //Morning sky
     else if(sky>.675){
    fill("rgb(100,100,100)");
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);  
    fill("rgb(110,110,110)");
  rect(width/2, height/2, 8.5*width/10, 8*height/10);  
    fill("rgb(120,120,120)");
  rect(width/2, height/2, 8.5*width/10, 7.5*height/10);  
    fill("rgb(130,130,130)");
  rect(width/2, height/2, 8.5*width/10, 7*height/10);  
    fill("rgb(140,140,140)");
  rect(width/2, height/2, 8.5*width/10, 6.5*height/10);   
   fill("rgb(150,150,150)");
  rect(width/2, height/2, 8.5*width/10, 6*height/10);
     fill("rgb(160,160,160)");
  rect(width/2, height/2, 8.5*width/10, 5.5*height/10);
     fill("rgb(170,170,170)");
  rect(width/2, height/2, 8.5*width/10, 5*height/10);
  fill("rgb(180,180,180)");
  rect(width/2, height/2, 8.5*width/10, 4.5*height/10);  
    fill("rgb(190,190,190)");
  rect(width/2, height/2, 8.5*width/10, 4*height/10);  
    fill("rgb(200,200,200)");
  rect(width/2, height/2, 8.5*width/10, 3.5*height/10);  
    fill("rgb(210,210,210)");
  rect(width/2, height/2, 8.5*width/10, 3*height/10);  
    fill("rgb(220 ,220,220)");
  rect(width/2, height/2, 8.5*width/10,2.5*height/10);   
   fill("rgb(230,230,230)");
  rect(width/2, height/2, 8.5*width/10, 2*height/10);
     fill("rgb(235,235,235)");
  rect(width/2, height/2, 8.5*width/10, 1.5*height/10);}
       else if(sky>.6){
    fill("rgb(100,100,150)");
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);  
    fill("rgb(110,110,160)");
  rect(width/2, height/2, 8.5*width/10, 8*height/10);  
    fill("rgb(120,120,170)");
  rect(width/2, height/2, 8.5*width/10, 7.5*height/10);  
    fill("rgb(130,130,180)");
  rect(width/2, height/2, 8.5*width/10, 7*height/10);  
    fill("rgb(140,140,190)");
  rect(width/2, height/2, 8.5*width/10, 6.5*height/10);   
   fill("rgb(150,150,200)");
  rect(width/2, height/2, 8.5*width/10, 6*height/10);
     fill("rgb(160,160,205)");
  rect(width/2, height/2, 8.5*width/10, 5.5*height/10);
     fill("rgb(170,170,210)");
  rect(width/2, height/2, 8.5*width/10, 5*height/10);
  fill("rgb(180,180,215)");
  rect(width/2, height/2, 8.5*width/10, 4.5*height/10);  
    fill("rgb(190,190,220)");
  rect(width/2, height/2, 8.5*width/10, 4*height/10);  
    fill("rgb(200,200,225)");
  rect(width/2, height/2, 8.5*width/10, 3.5*height/10);  
    fill("rgb(210,210,230)");
  rect(width/2, height/2, 8.5*width/10, 3*height/10);  
    fill("rgb(220 ,220,235)");
  rect(width/2, height/2, 8.5*width/10,2.5*height/10);   
   fill("rgb(230,230,240)");
  rect(width/2, height/2, 8.5*width/10, 2*height/10);
     fill("rgb(235,235,245)");
  rect(width/2, height/2, 8.5*width/10, 1.5*height/10);}
       else if(sky>.55){
    fill("rgb(50,160,160)");
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);  
    fill("rgb(60,160,170)");
  rect(width/2, height/2, 8.5*width/10, 8*height/10);  
    fill("rgb(70,170,170)");
  rect(width/2, height/2, 8.5*width/10, 7.5*height/10);  
    fill("rgb(80,170,170)");
  rect(width/2, height/2, 8.5*width/10, 7*height/10);  
    fill("rgb(90,170,170)");
  rect(width/2, height/2, 8.5*width/10, 6.5*height/10);   
   fill("rgb(100,170,180)");
  rect(width/2, height/2, 8.5*width/10, 6*height/10);
     fill("rgb(110,180,180)");
  rect(width/2, height/2, 8.5*width/10, 5.5*height/10);
     fill("rgb(120,180,180)");
  rect(width/2, height/2, 8.5*width/10, 5*height/10);
  fill("rgb(130,180,180)");
  rect(width/2, height/2, 8.5*width/10, 4.5*height/10);  
    fill("rgb(140,180,190)");
  rect(width/2, height/2, 8.5*width/10, 4*height/10);  
    fill("rgb(150,190,190)");
  rect(width/2, height/2, 8.5*width/10, 3.5*height/10);  
    fill("rgb(150,190,190)");
  rect(width/2, height/2, 8.5*width/10, 3*height/10);  
    fill("rgb(150,200,200)");
  rect(width/2, height/2, 8.5*width/10,2.5*height/10);   
   fill("rgb(150,210,210)");
  rect(width/2, height/2, 8.5*width/10, 2*height/10);
     fill("rgb(150,220,220)");
  rect(width/2, height/2, 8.5*width/10, 1.5*height/10);}
   else if(sky>.525){
    fill("rgb(220,150,130)");
     rect(width/2, height/2, 8.5*width/10, 8.5*height/10);}
  
  
  
  
  //sunset sky
     else if(sky>.5){
    fill("rgb(100,80,0)");
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);  
    fill("rgb(110,70,10)");
  rect(width/2, height/2, 8.5*width/10, 8*height/10);  
    fill("rgb(120,60,20)");
  rect(width/2, height/2, 8.5*width/10, 7.5*height/10);  
    fill("rgb(130,50,30)");
  rect(width/2, height/2, 8.5*width/10, 7*height/10);  
    fill("rgb(140,40,40)");
  rect(width/2, height/2, 8.5*width/10, 6.5*height/10);   
   fill("rgb(150,30,50)");
  rect(width/2, height/2, 8.5*width/10, 6*height/10);
     fill("rgb(160,20,60)");
  rect(width/2, height/2, 8.5*width/10, 5.5*height/10);
     fill("rgb(170,10,70)");
  rect(width/2, height/2, 8.5*width/10, 5*height/10);
  fill("rgb(180,20,80)");
  rect(width/2, height/2, 8.5*width/10, 4.5*height/10);  
    fill("rgb(190,30,90)");
  rect(width/2, height/2, 8.5*width/10, 4*height/10);  
    fill("rgb(200,40,100)");
  rect(width/2, height/2, 8.5*width/10, 3.5*height/10);  
    fill("rgb(210,50,110)");
  rect(width/2, height/2, 8.5*width/10, 3*height/10);  
    fill("rgb(220 ,60,120)");
  rect(width/2, height/2, 8.5*width/10,2.5*height/10);   
   fill("rgb(230,70,130)");
  rect(width/2, height/2, 8.5*width/10, 2*height/10);
     fill("rgb(240,80,140)");
  rect(width/2, height/2, 8.5*width/10, 1.5*height/10);
     fill("rgb(250,90,150)");
  rect(width/2, height/2, 8.5*width/10, 1*height/10);}
   else if(sky>.475){
    fill("rgb(50,120,200)");
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);  
    fill("rgb(60,110,190)");
  rect(width/2, height/2, 8.5*width/10, 8*height/10);  
    fill("rgb(70,100,180)");
  rect(width/2, height/2, 8.5*width/10, 7.5*height/10);  
    fill("rgb(80,90,170)");
  rect(width/2, height/2, 8.5*width/10, 7*height/10);  
    fill("rgb(90,80,160)");
  rect(width/2, height/2, 8.5*width/10, 6.5*height/10);   
   fill("rgb(100,70,150)");
  rect(width/2, height/2, 8.5*width/10, 6*height/10);
     fill("rgb(110,60,140)");
  rect(width/2, height/2, 8.5*width/10, 5.5*height/10);
     fill("rgb(120,50,130)");
  rect(width/2, height/2, 8.5*width/10, 5*height/10);
  fill("rgb(130,45,120)");
  rect(width/2, height/2, 8.5*width/10, 4.5*height/10);  
    fill("rgb(140,40,110)");
  rect(width/2, height/2, 8.5*width/10, 4*height/10);  
    fill("rgb(150,35,100)");
  rect(width/2, height/2, 8.5*width/10, 3.5*height/10);  
    fill("rgb(160,30,90)");
  rect(width/2, height/2, 8.5*width/10, 3*height/10);  
    fill("rgb(170,25,80)");
  rect(width/2, height/2, 8.5*width/10,2.5*height/10);   
   fill("rgb(180,20,70)");
  rect(width/2, height/2, 8.5*width/10, 2*height/10);
     fill("rgb(190,15,60)");
  rect(width/2, height/2, 8.5*width/10, 1.5*height/10);
     fill("rgb(200,10,50)");
  rect(width/2, height/2, 8.5*width/10, 1*height/10);}
    else if(sky>.35){
   fill("rgba(105,100,60,1)");
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);  
   fill("rgba(125,100,60,0.7)");
  rect(width/2, height/2, 8.5*width/10, 7.5*height/10);  
   fill("rgba(145,100,60,0.6)");
  rect(width/2, height/2, 8.5*width/10, 6.5*height/10);  
   fill("rgba(165,100,60,0.5)");
  rect(width/2, height/2, 8.5*width/10, 5.5*height/10);  
    fill("rgba(185,100,60,0.4)");
  rect(width/2, height/2, 8.5*width/10, 4.5*height/10);   
   fill("rgba(205,100,60,0.3)");
  rect(width/2, height/2, 8.5*width/10, 3.5*height/10);
    fill("rgba(225,100,60,0.2)");
  rect(width/2, height/2, 8.5*width/10, 2.5*height/10);
     fill("rgba(255,100,60,0.1)");
  rect(width/2, height/2, 8.5*width/10, 1.5*height/10);}
  
  
  //afternoon sky 
  
     else if(sky>.325){
    fill("rgb(225,160,105)");
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);}
   else if(sky>.25){
    fill("rgb(104,152,156)");
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);}
   else if(sky>.2){
    fill("rgb(204,216,229)");
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);}
   else if(sky>.175){
    fill("rgb(189,212,208)");
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);}
   else if(sky>.15){
    fill("rgb(197,197,197)");
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);}
     else if(sky>.1){
    fill("rgb(217,204,204)");
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);}
   else if(sky>.05){
    fill("rgb(209,222,223)");
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);}
   
  //section sky
  
  else if(sky>.04){
    fill(120);
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);}
   else if(sky>.03){
    fill(100)
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);}
   else if(sky>.02){
    fill(90);
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);}
     else if(sky>.01){
    fill(80);
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);}
   else {
    fill(50);
  rect(width/2, height/2, 8.5*width/10, 8.5*height/10);}
 
  
  // moon
  if (sky>.765){
    if (fxrand()>.5){
    if (fxrand()>.75){fill(255,190);}
    else if (fxrand()>.5){fill(200,200);}
    else if (fxrand()>.35){fill("rgba(244,232,200,0.61)");}
    else if (fxrand()>.25){fill("rgba(193,248,241,0.47)");}
    else if (fxrand()>.2){fill("rgba(255,247,221,0.52)");}
    else {fill(250,100);
         if(sky>.765 && sky<.775){fill("rgba(236,255,239,0.71)");}}
  circle (random_num(width/2.5, width/1.25), random_num(height/6,height/3), random_num(width/10, width/5));}}
  
    // Morning sun
  if (sky<.765 && sky>.525){
    if (fxrand()>.5){
    if (fxrand()>.75){fill(255,150);}
    else if (fxrand()>.5){fill(250,200);}
    else if (fxrand()>.35){fill("rgba(199,160,60,0.61)");}
    else if (fxrand()>.2){fill("rgba(255,97,0,0.52)");}
    else {fill(250,180);}
  circle (random_num(width/2.5, width/1.25), random_num(height/5.5,height/2.5), random_num(width/10, width/7.5));}}
  
      // sunset sun
  if (sky<.525 && sky>.35){
    if (fxrand()>.5){
    if (fxrand()>.75){fill("rgb(255,197,76)");}
    else if (fxrand()>.5){fill("rgba(255,250,81,0.59)");}
    else if (fxrand()>.35){fill("rgba(199,160,60,0.61)");}
    else if (fxrand()>.2){fill("rgba(255,97,0,0.52)");}
    else {fill("rgba(255,8,123,0.52)");}
  circle (random_num(width/2.5, width/1.25), random_num(height/3.5,height/2), random_num(width/10, width/5.5));}}
  
     // Morning sun
  if (sky<.35 && sky>.05){
    if (fxrand()>.75){
    if (fxrand()>.75){fill(250,150);}
    else if (fxrand()>.5){fill("rgba(251,250,211,0.59)");}
    else if (fxrand()>.35){fill("rgba(199,160,60,0.61)");}
    else if (fxrand()>.2){fill("rgba(255,97,0,0.52)");}
    else {fill(220,150);}
  circle (random_num(width/2.5, width/1.25), random_num(height/5.5,height/3.5), random_num(width/10, width/7.5));}}
  
  
  

  
  
  
  
  //trees back
  if (trees>.8){
  fill((random_num(125, 160),random_num(100, 140),random_num(100, 135)));
  noStroke();
  rect(treeSite1, height/4, width/random_num(60,100), height/random_num(1.95, 2.05));
  fill((random_num(125, 160),random_num(100, 140),random_num(100, 135)));
  rect(treeSite2, height/4, width/random_num(60,100), height/random_num(1.95, 2.05));
  fill((random_num(125, 160),random_num(100, 140),random_num(100, 135)));
  rect(treeSite3, height/4, width/random_num(60,100), height/random_num(1.95, 2.05));
  fill((random_num(125, 160),random_num(100, 140),random_num(100, 135)));
  rect(treeSite4, height/4, width/random_num(60,100), height/random_num(1.95, 2.05));
  fill((random_num(125, 160),random_num(100, 140),random_num(100, 135)));
  rect(treeSite5, height/4, width/random_num(60,100), height/random_num(1.95, 2.05));
  fill((random_num(125, 160),random_num(100, 140),random_num(100, 135)));
  rect(treeSite6, height/4, width/random_num(60,100), height/random_num(1.95, 2.05));
  fill((random_num(125, 160),random_num(100, 140),random_num(100, 135)));
  rect(treeSite7, height/4, width/random_num(60,100), height/random_num(1.95, 2.05));
  fill((random_num(125, 160),random_num(100, 140),random_num(100, 135)));
  rect(treeSite8, height/4, width/random_num(60,100), height/random_num(1.95, 2.05));
  }

  

  fill("rgb(144,118,118)");
  
  //ground
  if (sky>=.75){
     fill("rgb(144,118,118)")
    if (sky<.765 && sky>.75){fill("rgb(187,196,188)");}
rect(width/2, height*3.5/5, width*8.5/10, height/2.2);}
   else {fill("rgb(228,202,188)");
rect(width/2, height*3.5/5, width*8.5/10, height/2.2);}
  
  
    //in the distance
  
  
  cem1x= random_num(0,width)
    cem1y= random_num(height*3.5/5-height/(2*2.2)-min(width,height)/60,height*3.5/5-height/(2*2.2)-min(width,height)/60 + min(width,height)/30)
    cem2x= random_num(0,width)
    cem2y= random_num(height*3.5/5-height/(2*2.2)-min(width,height)/60,height*3.5/5-height/(2*2.2)-min(width,height)/60 + min(width,height)/30)
   cem3x= random_num(0,width)
    cem3y= random_num(height*3.5/5-height/(2*2.2)-min(width,height)/60,height*3.5/5-height/(2*2.2)-min(width,height)/60 + min(width,height)/30)
    cem4x= random_num(0,width)
    cem4y=random_num(height*3.5/5-height/(2*2.2)-min(width,height)/60,height*3.5/5-height/(2*2.2)-min(width,height)/60 + min(width,height)/30)
     cem5x= random_num(0,width)
    cem5y= random_num(height*3.5/5-height/(2*2.2)-min(width,height)/60,height*3.5/5-height/(2*2.2)-min(width,height)/60 + min(width,height)/30)
    cem6x= random_num(0,width)
    cem6y= random_num(height*3.5/5-height/(2*2.2)-min(width,height)/60,height*3.5/5-height/(2*2.2)-min(width,height)/60 + min(width,height)/30)
     cem7x= random_num(0,width)
    cem7y= random_num(height*3.5/5-height/(2*2.2)-min(width,height)/60,height*3.5/5-height/(2*2.2)-min(width,height)/60 + min(width,height)/30)
    cem8x= random_num(0,width)
    cem8y= random_num(height*3.5/5-height/(2*2.2)-min(width,height)/60,height*3.5/5-height/(2*2.2)-min(width,height)/60 + min(width,height)/30)
     cem9x= random_num(0,width)
    cem9y=random_num(height*3.5/5-height/(2*2.2)-min(width,height)/60,height*3.5/5-height/(2*2.2)-min(width,height)/60 + min(width,height)/30)
    cem10x= random_num(0,width)
    cem10y=random_num(height*3.5/5-height/(2*2.2)-min(width,height)/60,height*3.5/5-height/(2*2.2)-min(width,height)/60 + min(width,height)/30)
  
  if (overgrown<.6 && cemetery>.35 && (section<.15 || gasStation<.5) && (graffiti<.2 || var1<.35 || var1>.75 || skinnyTower>.75)){
    unordinary=2;
noStroke();
  fill("snow");
  rect(cem1x, cem1y, min(width,height)/300, min(width, height)/30);
  rect(cem1x, cem1y - min(width, height)/120, min(width, height)/45,min(width,height)/300);
  rect(cem2x, cem2y, min(width,height)/300, min(width, height)/30);
  rect(cem2x, cem2y - min(width, height)/120, min(width, height)/45,min(width,height)/300);
  rect(cem3x, cem3y, min(width,height)/300, min(width, height)/30);
  rect(cem3x, cem3y - min(width, height)/120, min(width, height)/45,min(width,height)/300);
  rect(cem4x, cem4y, min(width,height)/300, min(width, height)/30);
  rect(cem4x, cem4y - min(width, height)/120, min(width, height)/45,min(width,height)/300);
  rect(cem10x, cem10y, min(width,height)/300, min(width, height)/30);
  rect(cem10x, cem10y - min(width, height)/120, min(width, height)/45,min(width,height)/300);}

//Grass
  varMin=random_num(7,40);
  varMax=random_num(41, 100);
 
   if (overgrown>.6){
  fill(random_num(80,120), random_num(100,120),random_num(30,80));
   if (overgrown>.6 && snowday<.05){
    fill(random_num(245,250));}
rect(width/2, height*3.5/5, width*8.5/10, height/2.2);
    for (let i = width/14; i < width*2; i += width/1000) {
   fill(random_num(80,120), random_num(100,120),random_num(30,80));
   if (overgrown>.6 && snowday<.05){
    fill(random_num(245,250));}
      push();
      rect(i, height/2.135, width/1200, width/random_num(varMin,varMax));
    rotate(8*fxrand()-10*fxrand()*fxrand())
      pop();
      push();
      rect(i, height/2.1325, width/1200, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
      pop();
      push();
      rect(i, height/2.13, width/1200, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
      pop();
      push();
    rect(i, height/2.125, width/1200, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
      pop();
      push();
    rect(i, height/2.1, width/700, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
      pop();
      push();
       rect(i, height/2.05, width/700, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
      pop();
      push();
       rect(i, height/2.025, width/700, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
         rect(i, height/2, width/700, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
    rect(i, height/1.975, width/700, width/random_num(20,40));
    rotate(1*fxrand()-2.075*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.955, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.925, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.9, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
    rect(i, height/1.875, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.855, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.825, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
         rect(i, height/1.8, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
    rect(i, height/1.775, width/600, width/random_num(20,40));
    rotate(1*fxrand()-2.075*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.755, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.725, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
      rect(i, height/1.7, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
    rect(i, height/1.675, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.656, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.625, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
         rect(i, height/1.6, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
    rect(i, height/1.575, width/600, width/random_num(20,40));
    rotate(1*fxrand()-2.075*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.55, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.525, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.5, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
    rect(i, height/1.475, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.45, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand()); 
      pop();
      push();
       rect(i, height/1.425, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
         rect(i, height/1.4, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
    rect(i, height/1.375, width/600, width/random_num(20,40));
    rotate(1*fxrand()-2.075*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.35, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.325, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
        rect(i, height/1.3, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
    rect(i, height/1.275, width/600, width/random_num(20,40));
    rotate(1*fxrand()-2.075*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.25, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.225, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.2, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
    rect(i, height/1.175, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.15, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.125, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
         rect(i, height/1.1, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
 
      pop(); }}

  
  
  //trees front
  if (trees>.8){
  
  fill((random_num(125, 160),random_num(100, 140),random_num(100, 135)));
  noStroke();
  rect(treeSite1+width/5, height/4, width/random_num(60,100), height/random_num(1.95, 2.05));
  fill((random_num(125, 160),random_num(100, 140),random_num(100, 135)));
  rect(treeSite2+width/2.5, height/4, width/random_num(60,100), height/random_num(1.95, 2.05));
  fill((random_num(125, 160),random_num(100, 140),random_num(100, 135)));
  rect(treeSite3+width/8, height/4, width/random_num(60,100), height/random_num(1.95, 2.05));
  fill((random_num(125, 160),random_num(100, 140),random_num(100, 135)));
  rect(treeSite4+width/4.3, height/4, width/random_num(60,100), height/random_num(1.95, 2.05));
  fill((random_num(125, 160),random_num(100, 140),random_num(100, 135)));
  rect(treeSite5-width/6, height/4, width/random_num(60,100), height/random_num(1.95, 2.05));
  fill((random_num(125, 160),random_num(100, 140),random_num(100, 135)));
  rect(treeSite6-width/2.7, height/4, width/random_num(60,100), height/random_num(1.95, 2.05));
  fill((random_num(125, 160),random_num(100, 140),random_num(100, 135)));
  rect(treeSite7-width/4.5, height/4, width/random_num(60,100), height/random_num(1.95, 2.05));
  fill((random_num(125, 160),random_num(100, 140),random_num(100, 135)));
  rect(treeSite8-width/3, height/4, width/random_num(60,100), height/random_num(1.95, 2.05));
    if (overgrown>.6){
    
        for (let i = width/14; i < width*2; i += width/1000) {
   
      push();
       fill(random_num(80,120), random_num(100,120),random_num(30,80));
   if (overgrown>.6 && snowday<.05){
    fill(random_num(245,250));}
          noStroke();
      rect(i, height/2, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      
      
      
    }
    
    
    
  }}
  
    //concrete
    if (gasStation<.5 && snowday>.05){
  fill("rgb(151,151,151)")
     rect(width/2, height/1.055, width/.6, height/3)
     fill("rgb(190,190,190)")
     rect(width/2, height/1.05, width/.6, height/3);
  }
  


 
   //back road
  //square
  if (var1<.75 && var1>.35 && backRoad>.6 && snowday>.05){
  fill(150);
  rect(width/2, height/2+width/12, width, height/18);}
  if (var1<.75 && var1>.35 && backRoad>.6 && snowday>.05){
   for (let o = 1; o < 1000; o++) {
        let o = random_num(height/2+width/12-height/36, height/2+width/12+height/36)
        if (fxrand()>.5){stroke("rgb(185,195,207)");}
     else{stroke("rgb(231,235,237)");}
     noFill();
     strokeWeight(width/500)
      angleMode(DEGREES)
circle(random_num(width/15, (width*14)/15), random_num(height/2+width/12-height/36, height/2+width/12+height/36), fxrand()*.1);}}
    
        if (overgrown>.6) {
       
        for (let i = width/14; i < width*2; i += width/1000) {
   push();
      push()
           fill(random_num(80,120), random_num(100,120),random_num(30,80));
   if (overgrown>.6 && snowday<.05){
    fill(random_num(245,250));}
          noStroke();
      rect(i, height/1.59, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
  }}

   //portrait
  if (var1<.35 && backRoad>.6 && snowday>.05){
  fill(150);
  rect(width/2, height/2+width/12, width, height/18);
   for (let o = 1; o < 1000; o++) {
        let o = random_num(height/2+width/12-height/36, height/2+width/12+height/36)
        if (fxrand()>.5){stroke("rgb(185,195,207)");}
     else{stroke("rgb(240,248,252)");}
     noFill();
     strokeWeight(width/500)
      angleMode(DEGREES)
circle(random_num(width/15, (width*14)/15), random_num(height/2+width/12-height/36, height/2+width/12+height/36), fxrand()*.1);}
      if (overgrown>.6) {
       
        for (let i = width/14; i < width*2; i += width/1000) {
   push();
      push()
         fill(random_num(80,120), random_num(100,120),random_num(30,80));
   if (overgrown>.6 && snowday<.05){
    fill(random_num(245,250));}
          noStroke();
      rect(i, height/1.7, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
  }}
}
  
  //landscape
  if (var1>.75 && backRoad>.6 && snowday>.05){
  fill(150);
  rect(width/2, height/2+width/12, width, height/18);
   for (let o = 1; o < 1000; o++) {
        let o = random_num(height/2+width/12-height/36, height/2+width/12+height/36)
        if (fxrand()>.5){stroke("rgb(185,195,207)");}
     else{stroke("rgb(244,247,255)");}
     noFill();
     strokeWeight(height/500)
      angleMode(DEGREES)
circle(random_num(width/15, (width*14)/15), random_num(height/2+width/12-height/36, height/2+width/12+height/36), fxrand()*.1);}
     if (overgrown>.6) {
       
        for (let i = width/14; i < width*2; i += width/1000) {
   push();
      push()
        fill(random_num(80,120), random_num(100,120),random_num(30,80));
   if (overgrown>.6 && snowday<.05){
    fill(random_num(245,250));}
          noStroke();
      rect(i, height/1.48, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
  }}}
  
  if (barn>.5){
    
  //square barn
  barnAngle=fxrand();
   if (var1>=.35 && var1<=.75) {
     barnPeak=height/2-(height/5.5)
      //shadow
 if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6){
      fill ("#103611");}
       else if (sky>.765) {fill ("#474747");}
     else { 
           fill("#777777");}
     noStroke();
    
     quad (width/2+width/7+width/24,height/1.89,width/2+width/7+width/58,height/1.75,width/2-width/7-width/15, height/1.75, width/2-width/7-width/24, height/1.89);
     rect(width/2, height/1.85, width/3.5, height/24)
     triangle (width/2+width/7+width/58,height/1.75,width/2-width/7-width/15, height/1.75, width/2-width/15, height/1.7);
      triangle (width/2+width/16+width/58,height/1.75,width/2-width/16-width/15, height/1.75, width/2-width/15, height/1.68);
   
   

   if (barnAngle>.666){
  if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6){
      fill ("#103611");}
       else if (sky>.765) {fill ("#474747");}
     else { 
           fill("#777777");}
     noStroke();
     quad (width/2-width/7-width/18, height/1.75, width/2-width/7-width/28, height/1.9, width/2-width/3.3-width/24, height/1.9, width/2-width/3.22-width/15, height/1.75);
     
       if (overgrown>.6 && snowday<.05){fill(240);}
       else {fill("rgb(124,124,124)");}
       quad(width/2, barnPeak-width/300, width/2-width/9.5, barnPeak-width/300, width/2 -width/3.5,barnPeak+width/10, width/2, barnPeak+width/10)
  
     triangle(width/2-width/7-width/24-width/7-width/24,height/2.43, width/2, height/2.45, width/2-width/9, height/2-height/5.65)
     
     if (barnCol>.75){    fill("rgb(149,150,165)"); } else if (barnCol>.2){     fill("rgb(138,37,37)"); } else {     fill("rgb(111,103,103)"); }
     rect(width/2-width/7-width/24, (barnPeak+height/2-height/30+height/16)/2+height/21.75, 1.75*(width/7+width/24), height/8.5)
     rect(width/2, (barnPeak+height/2-height/30+height/16)/2+height/21.75, width/4, height/8.5);}
   
     else if (barnAngle>.333){
      if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6){
      fill ("#103611");}
       else if (sky>.765) {fill ("#474747");}
     else { 
           fill("#777777");}
     noStroke();
     quad (width/2+width/7, height/1.75, width/2+width/7+width/28, height/1.9, width/2+width/3.3+width/24, height/1.9, width/2+width/3.05, height/1.75);
         if (overgrown>.6 && snowday<.05){fill(240);}
       else {fill("rgb(124,124,124)");}
         quad(width/2, barnPeak-width/300, width/2+width/9.5, barnPeak-width/300, width/2 +width/3.5,barnPeak+width/10, width/2, barnPeak+width/10)
  
     triangle(width/2+width/7+width/24+width/7+width/24,height/2.43, width/2, height/2.45, width/2+width/9, height/2-height/5.65)
     
     if (barnCol>.75){    fill("rgb(149,150,165)"); } else if (barnCol>.2){     fill("rgb(138,37,37)"); } else {     fill("rgb(111,103,103)"); }
     rect(width/2+width/7+width/24, (barnPeak+height/2-height/30+height/16)/2+height/21.75, 1.75*(width/7+width/24), height/8.5);
       rect(width/2, (barnPeak+height/2-height/30+height/16)/2+height/21.75, width/4.25, height/8.5);
     
     
     }
     
     
     
      fill("rgb(73,51,48)")
      rect(width/2, height/2-height/35, width/4,height/10);
    if (barnCol>.75){   fill("rgb(178,179,195)"); } else if (barnCol>.2){     fill("rgb(185,83,83)"); } else {     fill("rgb(161,161,161)"); }

       rect(width/2, height/2-height/9, width/10.85,height/15);
      rect(width/2-width/7, height/2-height/30, width/12,height/8);
     rect(width/2+width/7, height/2-height/30, width/12,height/8);
    rect(width/2, height/2-height/15, (width/2+width/16+width/24)-(width/2-width/16-width/24),height/20);
     triangle(width/2, barnPeak, width/2-width/24, height/2-height/7.05, width/2+width/24, height/2-height/7.05);
       triangle(width/2-width/23.9, height/2-height/7.05, width/2-width/23.9, height/2-height/30-height/20, width/2-width/16-width/8.1, height/2 - height/30 - height/16.25);
      triangle(width/2+width/23.9, height/2-height/7.05, width/2+width/23.9, height/2-height/30-height/20, width/2+width/16+width/8.1, height/2 - height/30 - height/16.25);
     
     
     //barn doors
  
       stroke("rgb(220,227,227)")
   strokeWeight(width/250);
   line(width/2+(width/18+width/3.5)/2, height/2-height/22,width/2+(width/18+width/3.5)/2,height/2+height/50);
   line(width/2-(width/18+width/3.5)/2, height/2-height/22,width/2-(width/18+width/3.5)/2,height/2+height/50);
   line(width/2-(width/18+width/3.5)/3, height/2-height/22,width/2-(width/18+width/3.5)/3,height/2+height/50);   
   line(width/2+(width/18+width/3.5)/3, height/2-height/22,width/2+(width/18+width/3.5)/3,height/2+height/50);
    line(width/2+(width/18+width/3.5)/3, height/2+height/50,width/2+(width/18+width/3.5)/2,height/2+height/50);
    line(width/2-(width/18+width/3.5)/3, height/2+height/50,width/2-(width/18+width/3.5)/2,height/2+height/50);
    line(width/2-(width/18+width/3.5)/2, height/2+height/50,width/2-(width/18+width/3.5)/3,height/2-height/22);
       line(width/2+(width/18+width/3.5)/2, height/2+height/50,width/2+(width/18+width/3.5)/3,height/2-height/22);
     line(width/2-(width/18+width/3.5)/3, height/2+height/50,width/2-(width/18+width/3.5)/2,height/2-height/22);
       line(width/2+(width/18+width/3.5)/3, height/2+height/50,width/2+(width/18+width/3.5)/2,height/2-height/22);
     line(width/2+(width/18+width/3.5)/3, height/2+height/50,width/2+(width/18+width/3.5)/2,height/2-height/22);
     line(width/2-(width/18+width/3.5)/3, height/2-height/22,width/2-(width/18+width/3.5)/2,height/2-height/22);
     line(width/2+(width/18+width/3.5)/3, height/2-height/22,width/2+(width/18+width/3.5)/2,height/2-height/22);
     
        //frame add-on 1
     if (framer>.85){
   fill("rgb(220,227,227)")
   rect(width/2-width/24, height/2-height/9, width/200,height/16);
   rect(width/2+width/24, height/2-height/9, width/200,height/16)
   rect(width/2, height/2-height/9+height/32, width/12+width/3.5,width/200);
   rect(width/2, height/2-height/9+height/15.5, width/12+width/3.5,width/200);
   stroke("rgb(220,227,227)")
   strokeWeight(width/250);
   line(width/2, height/2-height/9+height/32, width/2, barnPeak)
   line(width/2-(width/16+width/3.5)/2, height/2-height/9+height/32, width/2-width/24, (height/2-height/9)-height/64);
     line(width/2+(width/16+width/3.5)/2, height/2-height/9+height/32, width/2+width/24, (height/2-height/9)-height/64);}
   
   
   //frame add-on 2
   if (framer>.875){
      stroke("rgb(220,227,227)")
   strokeWeight(width/250);
   line (width/2, height/2-height/9+height/32, width/2, height/2-height/9+height/15.5);}
   
   //frame add-on 3
   if (framer>.9){
      stroke("rgb(220,227,227)")
   strokeWeight(width/250);
    line (width/2-width/24, height/2-height/9+height/32, width/2-width/24, height/2-height/9+height/15.5);
     line (width/2+width/24, height/2-height/9+height/32, width/2+width/24, height/2-height/9+height/15.5);}
   
     //frame add-on 4
   if (framer>.925){
      stroke("rgb(220,227,227)")
   strokeWeight(width/250);
    line (width/2, height/2-height/9+height/32, width/2-width/24, height/2-height/9+height/15.5)
     line (width/2, height/2-height/9+height/32, width/2+width/24, height/2-height/9+height/15.5);}
     
        //barn roof
   
   strokeWeight(width/160)
   stroke("rgb(124,124,124)")
    line(width/2-(width/11+width/3.5)/2, height/2-height/9+height/50, width/2-width/24, (height/2-height/9)-height/32);
   line(width/2+(width/11+width/3.5)/2, height/2-height/9+height/50, width/2+width/24, (height/2-height/9)-height/32);
    line(width/2, barnPeak, width/2+width/24, (height/2-height/9)-height/32);
      line(width/2, barnPeak, width/2-width/24, (height/2-height/9)-height/32);
     
  }
  
  //portrait barn
  
 if (var1<.35) {
       barnAngle=fxrand();
     barnPeak=height/2-(height/5.5);
   
   
       //shadow
  if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6){
      fill ("#103611");}
       else if (sky>.765) {fill ("#474747");}
     else { 
           fill("#777777");}
     noStroke();
     quad (width/2+width/7+width/24,height/1.89,width/2+width/7+width/58,height/1.75,width/2-width/7-width/15, height/1.75, width/2-width/7-width/24, height/1.89);
     rect(width/2, height/1.85, width/3.5, height/24)
     triangle (width/2+width/7+width/58,height/1.75,width/2-width/7-width/15, height/1.75, width/2-width/15, height/1.7);
      triangle (width/2+width/16+width/58,height/1.75,width/2-width/16-width/15, height/1.75, width/2-width/15, height/1.68);
   
   

   if (barnAngle>.666){
   if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6){
      fill ("#103611");}
       else if (sky>.765) {fill ("#474747");}
     else { 
           fill("#777777");}
     noStroke();
     quad (width/2-width/7-width/18, height/1.75, width/2-width/7-width/28, height/1.9, width/2-width/3.3-width/24, height/1.9, width/2-width/3.22-width/15, height/1.75);
     
       if (overgrown>.6 && snowday<.05){fill(240);}
       else {fill("rgb(124,124,124)");}
       quad(width/2, barnPeak-width/300, width/2-width/9.5, barnPeak-width/300, width/2 -width/3.5,barnPeak+width/10, width/2, barnPeak+width/10)
  
     triangle(width/2-width/7-width/24-width/7-width/24,height/2.43, width/2, height/2.45, width/2-width/9, height/2-height/5.65)
     
     if (barnCol>.75){    fill("rgb(149,150,165)"); } else if (barnCol>.2){     fill("rgb(138,37,37)"); } else {     fill("rgb(111,103,103)"); }
     rect(width/2-width/7-width/24, (barnPeak+height/2-height/30+height/16)/2+height/21.75, 1.75*(width/7+width/24), height/8.4)
     rect(width/2, (barnPeak+height/2-height/30+height/16)/2+height/21.75, width/4, height/8.5);}
   
     else if (barnAngle>.333){
    if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6){
      fill ("#103611");}
       else if (sky>.765) {fill ("#474747");}
     else { 
           fill("#777777");}
     noStroke();
     quad (width/2+width/7, height/1.75, width/2+width/7+width/28, height/1.9, width/2+width/3.3+width/24, height/1.9, width/2+width/3.05, height/1.75);
         fill("rgb(124,124,124)")
         quad(width/2, barnPeak-width/300, width/2+width/9.5, barnPeak-width/300, width/2 +width/3.5,barnPeak+width/10, width/2, barnPeak+width/10)
  
     triangle(width/2+width/7+width/24+width/7+width/24,height/2.43, width/2, height/2.45, width/2+width/9, height/2-height/5.65)
     
     if (barnCol>.75){    fill("rgb(149,150,165)"); } else if (barnCol>.2){     fill("rgb(138,37,37)"); } else {     fill("rgb(111,103,103)"); }
     rect(width/2+width/7+width/24, (barnPeak+height/2-height/30+height/16)/2+height/21.75, 1.75*(width/7+width/24), height/8.4);
       rect(width/2, (barnPeak+height/2-height/30+height/16)/2+height/21.75, width/4.25, height/8.5);
     
     
     }
     
     
     
      fill("rgb(73,51,48)")
      rect(width/2, height/2-height/35, width/4,height/10);
    if (barnCol>.75){   fill("rgb(178,179,195)"); } else if (barnCol>.2){     fill("rgb(185,83,83)"); } else {     fill("rgb(161,161,161)"); }

       rect(width/2, height/2-height/9, width/10.85,height/15);
      rect(width/2-width/7, height/2-height/30, width/12,height/8);
     rect(width/2+width/7, height/2-height/30, width/12,height/8);
    rect(width/2, height/2-height/15, (width/2+width/16+width/24)-(width/2-width/16-width/24),height/20);
     triangle(width/2, barnPeak, width/2-width/24, height/2-height/7.05, width/2+width/24, height/2-height/7.05);
       triangle(width/2-width/23.9, height/2-height/7.05, width/2-width/23.9, height/2-height/30-height/20, width/2-width/16-width/8.1, height/2 - height/30 - height/16.25);
      triangle(width/2+width/23.9, height/2-height/7.05, width/2+width/23.9, height/2-height/30-height/20, width/2+width/16+width/8.1, height/2 - height/30 - height/16.25);
     
     
     //barn doors
  
       stroke("rgb(220,227,227)")
   strokeWeight(width/250);
   line(width/2+(width/18+width/3.5)/2, height/2-height/22,width/2+(width/18+width/3.5)/2,height/2+height/50);
   line(width/2-(width/18+width/3.5)/2, height/2-height/22,width/2-(width/18+width/3.5)/2,height/2+height/50);
   line(width/2-(width/18+width/3.5)/3, height/2-height/22,width/2-(width/18+width/3.5)/3,height/2+height/50);   
   line(width/2+(width/18+width/3.5)/3, height/2-height/22,width/2+(width/18+width/3.5)/3,height/2+height/50);
    line(width/2+(width/18+width/3.5)/3, height/2+height/50,width/2+(width/18+width/3.5)/2,height/2+height/50);
    line(width/2-(width/18+width/3.5)/3, height/2+height/50,width/2-(width/18+width/3.5)/2,height/2+height/50);
    line(width/2-(width/18+width/3.5)/2, height/2+height/50,width/2-(width/18+width/3.5)/3,height/2-height/22);
       line(width/2+(width/18+width/3.5)/2, height/2+height/50,width/2+(width/18+width/3.5)/3,height/2-height/22);
     line(width/2-(width/18+width/3.5)/3, height/2+height/50,width/2-(width/18+width/3.5)/2,height/2-height/22);
       line(width/2+(width/18+width/3.5)/3, height/2+height/50,width/2+(width/18+width/3.5)/2,height/2-height/22);
     line(width/2+(width/18+width/3.5)/3, height/2+height/50,width/2+(width/18+width/3.5)/2,height/2-height/22);
     line(width/2-(width/18+width/3.5)/3, height/2-height/22,width/2-(width/18+width/3.5)/2,height/2-height/22);
     line(width/2+(width/18+width/3.5)/3, height/2-height/22,width/2+(width/18+width/3.5)/2,height/2-height/22);
     
        //frame add-on 1
     if (framer>.85){
   fill("rgb(220,227,227)")
   rect(width/2-width/24, height/2-height/9, width/200,height/16);
   rect(width/2+width/24, height/2-height/9, width/200,height/16)
   rect(width/2, height/2-height/9+height/32, width/12+width/3.5,width/200);
   rect(width/2, height/2-height/9+height/15.5, width/12+width/3.5,width/200);
   stroke("rgb(220,227,227)")
   strokeWeight(width/250);
   line(width/2, height/2-height/9+height/32, width/2, barnPeak)
   line(width/2-(width/16+width/3.5)/2, height/2-height/9+height/32, width/2-width/24, (height/2-height/9)-height/64);
     line(width/2+(width/16+width/3.5)/2, height/2-height/9+height/32, width/2+width/24, (height/2-height/9)-height/64);}
   
   
   //frame add-on 2
   if (framer>.875){
      stroke("rgb(220,227,227)")
   strokeWeight(width/250);
   line (width/2, height/2-height/9+height/32, width/2, height/2-height/9+height/15.5);}
   
   //frame add-on 3
   if (framer>.9){
      stroke("rgb(220,227,227)")
   strokeWeight(width/250);
    line (width/2-width/24, height/2-height/9+height/32, width/2-width/24, height/2-height/9+height/15.5);
     line (width/2+width/24, height/2-height/9+height/32, width/2+width/24, height/2-height/9+height/15.5);}
   
     //frame add-on 4
   if (framer>.925){
      stroke("rgb(220,227,227)")
   strokeWeight(width/250);
    line (width/2, height/2-height/9+height/32, width/2-width/24, height/2-height/9+height/15.5)
     line (width/2, height/2-height/9+height/32, width/2+width/24, height/2-height/9+height/15.5);}
     
        //barn roof
   
   strokeWeight(width/150)
   stroke("rgb(124,124,124)")
    line(width/2-(width/11+width/3.5)/2, height/2-height/9+height/50, width/2-width/24, (height/2-height/9)-height/32);
   line(width/2+(width/11+width/3.5)/2, height/2-height/9+height/50, width/2+width/24, (height/2-height/9)-height/32);
    line(width/2, barnPeak, width/2+width/24, (height/2-height/9)-height/32);
      line(width/2, barnPeak, width/2-width/24, (height/2-height/9)-height/32);
  }
  
  
  
  
  //landscape barn
  
 else if (var1>.75) {
       barnAngle=fxrand();
     barnPeak=height/2-(height/5.5);
   
       //shadow
   if (overgrown>.6 && snowday<.049){
  fill(200);}
   else if (overgrown>.6){
      fill ("#103611");}
       else if (sky>.765) {fill ("#474747");}
     else { 
           fill("#777777");}
     noStroke();
     quad (width/2+width/12+width/24,height/1.89,width/2+width/12+width/58,height/1.75,width/2-width/6.5, height/1.75, width/2-width/12-width/24, height/1.89);
     rect(width/2, height/1.85, width/5, height/24)
     triangle (width/2+width/12+width/58,height/1.75,width/2-width/6.5, height/1.75, width/2-width/15, height/1.7);
      triangle (width/2+width/16+width/58,height/1.75,width/2-width/16-width/15, height/1.75, width/2-width/15, height/1.68);
   
   
     

   if (barnAngle>.666){  
    if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6){
      fill ("#103611");}
       else if (sky>.765) {fill ("#474747");}
     else { 
           fill("#777777");}
     noStroke();
     quad (width/2-width/6.55, height/1.75, width/2-width/12-width/28, height/1.9, width/2-width/5.275-width/24, height/1.9, width/2-width/3.75, height/1.75);
     
     if (overgrown>.6 && snowday<.05){fill(240);}
       else {fill("rgb(124,124,124)");}
     quad(width/2, barnPeak-height/300, width/2-height/9.5, barnPeak-height/300, width/2 -height/3.5,barnPeak+height/10, width/2, barnPeak+height/10)
  
     triangle(width/2-height/7-height/24-height/7-height/24,height/2.43, width/2, height/2.45, width/2-height/9, height/2-height/5.65)
     
     if (barnCol>.75){    fill("rgb(149,150,165)"); } else if (barnCol>.2){     fill("rgb(138,37,37)"); } else {     fill("rgb(111,103,103)"); }
     rect(width/2-height/7-height/24, (barnPeak+height/2-height/30+height/16)/2+height/21.75, 1.75*(height/7+height/24), height/8.5)
     rect(width/2, (barnPeak+height/2-height/30+height/16)/2+height/21.75, height/4, height/8.5);}
     else if (barnAngle>.333){
        if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6){
      fill ("#103611");}
       else if (sky>.765) {fill ("#474747");}
     else { 
           fill("#777777");}
     noStroke();
     quad (width/2+width/12, height/1.75, width/2+width/12+width/28, height/1.9, width/2+width/5.275+width/24, height/1.9, width/2+width/4.85, height/1.75);
     
       if (overgrown>.6 && snowday<.05){fill(240);}
       else {fill("rgb(124,124,124)");}
         quad(width/2, barnPeak-height/300, width/2+height/9.5, barnPeak-height/300, width/2 +height/3.5,barnPeak+height/10, width/2, barnPeak+height/10)
  
     triangle(width/2+height/7+height/24+height/7+height/24,height/2.43, width/2, height/2.45, width/2+height/9, height/2-height/5.65)
     
     if (barnCol>.75){    fill("rgb(149,150,165)"); } else if (barnCol>.2){     fill("rgb(138,37,37)"); } else {     fill("rgb(111,103,103)"); }
     rect(width/2+height/7+height/24, (barnPeak+height/2-height/30+height/16)/2+height/21.75, 1.75*(height/7+height/24), height/8.5);
       rect(width/2, (barnPeak+height/2-height/30+height/16)/2+height/21.75, height/4.25, height/8.5);
     
     
     }
     
     
     
      fill("rgb(73,51,48)")
      rect(width/2, height/2-height/35, height/4,height/10);
    if (barnCol>.75){   fill("rgb(178,179,195)"); } else if (barnCol>.2){     fill("rgb(185,83,83)"); } else {     fill("rgb(161,161,161)"); }

       rect(width/2, height/2-height/9, height/10.85,height/15);
      rect(width/2-height/7, height/2-height/30, height/12,height/8);
     rect(width/2+height/7, height/2-height/30, height/12,height/8);
    rect(width/2, height/2-height/15, (width/2+height/16+height/24)-(width/2-height/16-height/24),height/20);
     triangle(width/2, barnPeak, width/2-height/24, height/2-height/7.05, width/2+height/24, height/2-height/7.05);
       triangle(width/2-height/23.9, height/2-height/7.05, width/2-height/23.9, height/2-height/30-height/20, width/2-height/16-height/8.1, height/2 - height/30 - height/16.25);
      triangle(width/2+height/23.9, height/2-height/7.05, width/2+height/23.9, height/2-height/30-height/20, width/2+height/16+height/8.1, height/2 - height/30 - height/16.25);
     
     
     //barn doors
  
       stroke("rgb(220,227,227)")
   strokeWeight(width/250);
   line(width/2+(height/18+height/3.5)/2, height/2-height/22,width/2+(height/18+height/3.5)/2,height/2+height/50);
   line(width/2-(height/18+height/3.5)/2, height/2-height/22,width/2-(height/18+height/3.5)/2,height/2+height/50);
   line(width/2-(height/18+height/3.5)/3, height/2-height/22,width/2-(height/18+height/3.5)/3,height/2+height/50);   
   line(width/2+(height/18+height/3.5)/3, height/2-height/22,width/2+(height/18+height/3.5)/3,height/2+height/50);
    line(width/2+(height/18+height/3.5)/3, height/2+height/50,width/2+(height/18+height/3.5)/2,height/2+height/50);
    line(width/2-(height/18+height/3.5)/3, height/2+height/50,width/2-(height/18+height/3.5)/2,height/2+height/50);
    line(width/2-(height/18+height/3.5)/2, height/2+height/50,width/2-(height/18+height/3.5)/3,height/2-height/22);
       line(width/2+(height/18+height/3.5)/2, height/2+height/50,width/2+(height/18+height/3.5)/3,height/2-height/22);
     line(width/2-(height/18+height/3.5)/3, height/2+height/50,width/2-(height/18+height/3.5)/2,height/2-height/22);
       line(width/2+(height/18+height/3.5)/3, height/2+height/50,width/2+(height/18+height/3.5)/2,height/2-height/22);
     line(width/2+(height/18+height/3.5)/3, height/2+height/50,width/2+(height/18+height/3.5)/2,height/2-height/22);
     line(width/2-(height/18+height/3.5)/3, height/2-height/22,width/2-(height/18+height/3.5)/2,height/2-height/22);
     line(width/2+(height/18+height/3.5)/3, height/2-height/22,width/2+(height/18+height/3.5)/2,height/2-height/22);
     
        //frame add-on 1
     if (framer>.85){
   fill("rgb(220,227,227)")
   rect(width/2-height/24, height/2-height/9, height/200,height/16);
   rect(width/2+height/24, height/2-height/9, height/200,height/16)
   rect(width/2, height/2-height/9+height/32, height/12+height/3.5,height/200);
   rect(width/2, height/2-height/9+height/15.5, height/12+height/3.5,height/200);
   stroke("rgb(220,227,227)")
   strokeWeight(width/250);
   line(width/2, height/2-height/9+height/32, width/2, barnPeak)
   line(width/2-(height/16+height/3.5)/2, height/2-height/9+height/32, width/2-height/24, (height/2-height/9)-height/64);
     line(width/2+(height/16+height/3.5)/2, height/2-height/9+height/32, width/2+height/24, (height/2-height/9)-height/64);}
   
   
   //frame add-on 2
   if (framer>.875){
      stroke("rgb(220,227,227)")
   strokeWeight(width/250);
   line (width/2, height/2-height/9+height/32, width/2, height/2-height/9+height/15.5);}
   
   //frame add-on 3
   if (framer>.9){
      stroke("rgb(220,227,227)")
   strokeWeight(width/250);
    line (width/2-height/24, height/2-height/9+height/32, width/2-height/24, height/2-height/9+height/15.5);
     line (width/2+height/24, height/2-height/9+height/32, width/2+height/24, height/2-height/9+height/15.5);}
   
     //frame add-on 4
   if (framer>.925){
      stroke("rgb(220,227,227)")
   strokeWeight(width/250);
    line (width/2, height/2-height/9+height/32, width/2-height/24, height/2-height/9+height/15.5)
     line (width/2, height/2-height/9+height/32, width/2+height/24, height/2-height/9+height/15.5);}
     
        //barn roof
   
   strokeWeight(height/160)
   stroke("rgb(124,124,124)")
    line(width/2-(height/11+height/3.5)/2, height/2-height/9+height/50, width/2-height/24, (height/2-height/9)-height/32);
   line(width/2+(height/11+height/3.5)/2, height/2-height/9+height/50, width/2+height/24, (height/2-height/9)-height/32);
    line(width/2, barnPeak, width/2+height/24, (height/2-height/9)-height/32);
      line(width/2, barnPeak, width/2-height/24, (height/2-height/9)-height/32);
  }}
  
 
  
  
  //back road front
  //square
  if (var1<.75 && var1>.35 && backRoad>.6 && snowday>.05){
    if (barn>.5){
  fill("rgba(255,255,255,0.1)");
    noStroke();
 rect(width/2, height/2+width/12, width, height/18);}
  if (overgrown>.6) {
       
        for (let i = width/14; i < width*2; i += width/1000) {
   push();
           fill(random_num(80,120), random_num(100,120),random_num(30,80));
   if (overgrown>.6 && snowday<.05){
    fill(random_num(245,250));}
          noStroke();
      rect(i, height/1.59, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
  }}}
  
  //portrait
   else if (var1<.35 && backRoad>.6 && snowday>.05){
     if (barn>.5){
  fill("rgba(255,255,255,0.1)");
    noStroke();
  rect(width/2, height/2+width/12, width, height/18);}
  if (overgrown>.6) {
       
        for (let i = width/14; i < width*2; i += width/1000) {
   push();
          fill(random_num(80,120), random_num(100,120),random_num(30,80));
   if (overgrown>.6 && snowday<.05){
    fill(random_num(245,250));}
          noStroke();
      rect(i, height/1.7, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
  }
  }}
  
  //landscape 
  
     else if (var1>.75 && backRoad>.6 && barn>.5 && snowday>.05){
  fill("rgba(255,255,255,0.1)");
    noStroke();
  rect(width/2, height/2+width/12, width, height/18);}
  if (overgrown>.6 && var1>.75 && backRoad>.6) {
        for (let i = width/14; i < width*2; i += width/1000) {
   push();
       fill(random_num(80,120), random_num(100,120),random_num(30,80));
   if (overgrown>.6 && snowday<.05){
    fill(random_num(245,250));}
          noStroke();
      rect(i, height/1.48, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
  }
  }

  
  
  
      //road
  
  if (gasStation<.175 && snowday>.05){
     fill(200)
           beginShape();
  vertex(width/2-(width-width/11)/2, height/1.125+height/32), 
    vertex(width/2+(width-width/11)/2, height/1.125+height/32),
    vertex(width/2+(width-width/11)/2, height/1.125-height/27),
  vertex(width/2-(width-width/11)/2, height/1.125-height/27); 
     endShape();
      fill(150)
      beginShape();
  vertex(width/2-(width-width/11)/2, height/1.125+height/32), 
    vertex(width/2+(width-width/11)/2, height/1.125+height/32),
    vertex(width/2+(width-width/11)/2, height/1.125-height/32),
  vertex(width/2-(width-width/11)/2, height/1.125-height/32); 
     endShape();}
  
  
    //water tower
  if (tower>.5){

    //landscape tower
   if (var1>.75){
    
  push();
     if (mover>.25){translate((random_num(-width/6, width/3)), 0);}
     
    
      //shadows
    
   if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6) {
      fill ("#103611");}
     else if (sky>.765) { 
           fill("#474747");}
     else { 
           fill("#777777");}
   if (overgrown>.6 && snowday<.05){
  stroke(200);}
   else if (overgrown>.6) {
      stroke("#103611");}
     else if (sky>.765) { 
           stroke("#474747");}
     else { 
           stroke("#777777");}
     if (structure>.5){
     strokeWeight(width/300);
     line(width/2-width/20,height/2+height/6, width/2-width/20-width/6.7, 9.25*height/10);
      line(width/2+width/20,height/2+height/6, width/2+width/20-width/6.7, 9.25*height/10);
     strokeWeight(width/550);
     line(width/3.1, 8.9*height/10, (width/2+ (width/2-width/7))/1.84, ((height/2+height/6)+9.5*height/10)/2);
     line((width/2+(width/2-width/7))/2.05, 8.9*height/10, width/2.7, ((height/2+height/6)+9.5*height/10)/2);
     line((width/2+(width/2-width/7))/1.84, ((height/2+height/6)+9.5*height/10)/2, width/2.7, ((height/2+height/6)+9.5*height/10)/2);
     line((width/2+(width/2-width/7))/2.05, 8.9*height/10, width/3.12, 8.9*height/10);}
     strokeWeight(width/70)
     line(width/2,height/2+height/6, width/2-width/6.7, 9.25*height/10);
  
       
    
     
   noStroke();
  fill("white")
    rect(width/2, height/2, width/50, height/3);
   
     
    

  
     
     if (colTone>.7){
       
       //ladder (back)
        if (frontback<.5){
          strokeWeight(width/600);
    stroke("azure")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
       
    noStroke();  
          fill("#EEEEEE")
      ellipse(width/2, height/2-height/6, width/8, height/8);  
      fill("#BDBDBD")
      
      rect(width/2, height/2-height/5, width/8,height/8);
  fill("silver")
      
      
      rect(width/2-width/36, height/2-height/5, width/16,height/8);
  
        fill("#CCCCCC")
      
      rect(width/2-width/36, height/2-height/5, width/18,height/8);
     fill ("#d9d9d9");
      
      rect(width/2-width/96, height/2-height/5, width/16,height/8);
          
      fill ("#e6e6e6");
         rect(width/2+width/48, height/2-height/5, width/18,height/8);
      
       
       
       if (structure>.5){
               strokeWeight(width/600);
    stroke("#EEEEEE")
    line(width/2, height/2, width/2+width/20, height/2+height/20);
    line(width/2, height/2, width/2-width/20, height/2+height/20);
    line(width/2, height/2, width/2+width/20, height/2-height/20);
    line(width/2, height/2, width/2-width/20, height/2-height/20);
    line(width/2+width/20, height/2+height/20, width/2-width/20, height/2+height/20);
    line(width/2+width/20, height/2-height/20, width/2-width/20, height/2-height/20);
    line(width/2-width/20, height/2, width/2+width/20, height/2);
    noStroke();
    
        strokeWeight(width/600);
   
   line(width/2, height/2, width/2+width/20, height/2+height/20);
    line(width/2, height/2, width/2-width/20, height/2+height/20);
    line(width/2, height/2, width/2+width/20, height/2-height/20);
    line(width/2, height/2, width/2-width/20, height/2-height/20);
    line(width/2+width/20, height/2+height/20, width/2-width/20, height/2+height/20);
    line(width/2+width/20, height/2-height/20, width/2-width/20, height/2-height/20);
    line(width/2-width/20, height/2, width/2+width/20, height/2);
         noStroke();
         fill("white");
        rect(width/2+width/20, height/2, width/250, height/3);
   rect(width/2-width/20, height/2, width/250, height/3);}
 
        
         //ladder (front)
        if (frontback>.5){
          strokeWeight(width/600);
    stroke("azure")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
           //walkway
      
      strokeWeight(width/600);
    stroke("azure")
      line(width/2-width/11+(2*width/100), height/3, width/2+width/11-(2*width/100), height/3);
      line(width/2-width/11+(2*width/100), height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);
       strokeWeight(width/800);
       
         if (ladder2>width/2){line(ladder2, height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);}
       else if (ladder2<width/2){line(ladder2, height/3+height/50, width/2-width/11+(2*width/100), height/3+height/50);}
      
       line(width/2-width/11+(2*width/100), height/3, width/2-width/11+(2*width/100), height/3+height/50);
      line(width/2+width/11-(2*width/100), height/3, width/2+width/11-(2*width/100), height/3+height/50);
          line(width/2-width/11+(3*width/100), height/3, width/2-width/11+(3*width/100), height/3+height/50);
      line(width/2+width/11-(3*width/100), height/3, width/2+width/11-(3*width/100), height/3+height/50);
          line(width/2-width/11+(4*width/100), height/3, width/2-width/11+(4*width/100), height/3+height/50);
      line(width/2+width/11-(4*width/100), height/3, width/2+width/11-(4*width/100), height/3+height/50);
          line(width/2-width/11+(5*width/100), height/3, width/2-width/11+(5*width/100), height/3+height/50);
      line(width/2+width/11-(5*width/100), height/3, width/2+width/11-(5*width/100), height/3+height/50);
        line(width/2-width/11+(6*width/100), height/3, width/2-width/11+(6*width/100), height/3+height/50);
      line(width/2+width/11-(6*width/100), height/3, width/2+width/11-(6*width/100), height/3+height/50);
        line(width/2-width/11+(7*width/100), height/3, width/2-width/11+(7*width/100), height/3+height/50);
      line(width/2+width/11-(7*width/100), height/3, width/2+width/11-(7*width/100), height/3+height/50);
        line(width/2-width/11+(8*width/100), height/3, width/2-width/11+(8*width/100), height/3+height/50);
      line(width/2+width/11-(8*width/100), height/3, width/2+width/11-(8*width/100), height/3+height/50);
        line(width/2, height/3, width/2, height/3+height/50);
     }
      
      
      else if (colTone>.4){
        //ladder (back)
        if (frontback<.5){
          strokeWeight(width/600);
    stroke("#E65D42")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
      noStroke();  
         fill("#D65D42")
       rect(width/2, height/2, width/50, height/3);
          fill("#E97452")
      ellipse(width/2, height/2-height/6, width/8, height/8);  
      fill("#D65D42")
      
      rect(width/2, height/2-height/5, width/8,height/8);
  fill("#9E1711")
      
      
      rect(width/2-width/36, height/2-height/5, width/16,height/8);
  
        fill("#B12E21")
      
      rect(width/2-width/36, height/2-height/5, width/16,height/8);
     fill ("#C34632");
      
      rect(width/2-width/96, height/2-height/5, width/16,height/8);
          
      fill ("#D65D42");
         rect(width/2+width/48, height/2-height/5, width/16,height/8);
      
      
      if (structure>.5){
              strokeWeight(width/600);
    stroke("#D65D42")
    line(width/2, height/2, width/2+width/20, height/2+height/20);
    line(width/2, height/2, width/2-width/20, height/2+height/20);
    line(width/2, height/2, width/2+width/20, height/2-height/20);
    line(width/2, height/2, width/2-width/20, height/2-height/20);
    line(width/2+width/20, height/2+height/20, width/2-width/20, height/2+height/20);
    line(width/2+width/20, height/2-height/20, width/2-width/20, height/2-height/20);
    line(width/2-width/20, height/2, width/2+width/20, height/2);
         noStroke();
   
   
           strokeWeight(width/600);
   stroke("#D65D42")
   line(width/2, height/2, width/2+width/20, height/2+height/20);
    line(width/2, height/2, width/2-width/20, height/2+height/20);
    line(width/2, height/2, width/2+width/20, height/2-height/20);
    line(width/2, height/2, width/2-width/20, height/2-height/20);
    line(width/2+width/20, height/2+height/20, width/2-width/20, height/2+height/20);
    line(width/2+width/20, height/2-height/20, width/2-width/20, height/2-height/20);
    line(width/2-width/20, height/2, width/2+width/20, height/2);
               noStroke();  
         fill("#D65D42")
    rect(width/2+width/20, height/2, width/250, height/3);
   rect(width/2-width/20, height/2, width/250, height/3);}
  
        
         //ladder (front)
        if (frontback>.5){
          strokeWeight(width/600);
    stroke("#E65D42")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
           //walkway
      
      strokeWeight(width/600);
    stroke("#E65D42")
      line(width/2-width/11+(2*width/100), height/3, width/2+width/11-(2*width/100), height/3);
      line(width/2-width/11+(2*width/100), height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);
       strokeWeight(width/800);
        
         if (ladder2>width/2){line(ladder2, height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);}
       else if (ladder2<width/2){line(ladder2, height/3+height/50, width/2-width/11+(2*width/100), height/3+height/50);}
      
       line(width/2-width/11+(2*width/100), height/3, width/2-width/11+(2*width/100), height/3+height/50);
      line(width/2+width/11-(2*width/100), height/3, width/2+width/11-(2*width/100), height/3+height/50);
          line(width/2-width/11+(3*width/100), height/3, width/2-width/11+(3*width/100), height/3+height/50);
      line(width/2+width/11-(3*width/100), height/3, width/2+width/11-(3*width/100), height/3+height/50);
          line(width/2-width/11+(4*width/100), height/3, width/2-width/11+(4*width/100), height/3+height/50);
      line(width/2+width/11-(4*width/100), height/3, width/2+width/11-(4*width/100), height/3+height/50);
          line(width/2-width/11+(5*width/100), height/3, width/2-width/11+(5*width/100), height/3+height/50);
      line(width/2+width/11-(5*width/100), height/3, width/2+width/11-(5*width/100), height/3+height/50);
        line(width/2-width/11+(6*width/100), height/3, width/2-width/11+(6*width/100), height/3+height/50);
      line(width/2+width/11-(6*width/100), height/3, width/2+width/11-(6*width/100), height/3+height/50);
        line(width/2-width/11+(7*width/100), height/3, width/2-width/11+(7*width/100), height/3+height/50);
      line(width/2+width/11-(7*width/100), height/3, width/2+width/11-(7*width/100), height/3+height/50);
        line(width/2-width/11+(8*width/100), height/3, width/2-width/11+(8*width/100), height/3+height/50);
      line(width/2+width/11-(8*width/100), height/3, width/2+width/11-(8*width/100), height/3+height/50);
        line(width/2, height/3, width/2, height/3+height/50);
      
      }
      
     
     
         
    else if (colTone>.03){
         
           //ladder (back)
        if (frontback<.5){
          strokeWeight(width/600);
    stroke("#9EE88E")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
      noStroke();  
         fill("#99C48D")
        rect(width/2, height/2, width/50, height/3);
          fill("#91E09A")
      ellipse(width/2, height/2-height/6, width/8, height/8);  
      fill("#9ACBA2")
      
      rect(width/2, height/2-height/5, width/8,height/8);
  fill("#88B283")
      
      
      rect(width/2-width/36, height/2-height/5, width/16,height/8);
  
        fill("#9ACBA2")
      
      rect(width/2-width/36, height/2-height/5, width/16,height/8);
     fill ("#9CCF94");
      
      rect(width/2-width/96, height/2-height/5, width/16,height/8);
          
      fill ("#8FC98F");
         rect(width/2+width/48, height/2-height/5, width/16,height/8);
      
      
      if (structure>.5){
              strokeWeight(width/600);
    stroke("#8CCC8E")
 line(width/2, height/2, width/2+width/20, height/2+height/20);
    line(width/2, height/2, width/2-width/20, height/2+height/20);
    line(width/2, height/2, width/2+width/20, height/2-height/20);
    line(width/2, height/2, width/2-width/20, height/2-height/20);
    line(width/2+width/20, height/2+height/20, width/2-width/20, height/2+height/20);
    line(width/2+width/20, height/2-height/20, width/2-width/20, height/2-height/20);
    line(width/2-width/20, height/2, width/2+width/20, height/2);
         noStroke();
   
   
            strokeWeight(width/600);
  stroke("#74A575")
   line(width/2, height/2, width/2+width/20, height/2+height/20);
    line(width/2, height/2, width/2-width/20, height/2+height/20);
    line(width/2, height/2, width/2+width/20, height/2-height/20);
    line(width/2, height/2, width/2-width/20, height/2-height/20);
    line(width/2+width/20, height/2+height/20, width/2-width/20, height/2+height/20);
    line(width/2+width/20, height/2-height/20, width/2-width/20, height/2-height/20);
    line(width/2-width/20, height/2, width/2+width/20, height/2);
         noStroke();  
        fill("#99C48D")
    rect(width/2+width/20, height/2, width/250, height/3);
   rect(width/2-width/20, height/2, width/250, height/3);}
    
        
         //ladder (front)
        if (frontback>.5){
          strokeWeight(width/600);
    stroke("#A7D190")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
           //walkway
      
      strokeWeight(width/600);
    stroke("#9AC28B")
      line(width/2-width/11+(2*width/100), height/3, width/2+width/11-(2*width/100), height/3);
      line(width/2-width/11+(2*width/100), height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);
       strokeWeight(width/800);
         
          if (ladder2>width/2){line(ladder2, height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);}
       else if (ladder2<width/2){line(ladder2, height/3+height/50, width/2-width/11+(2*width/100), height/3+height/50);}
      
       line(width/2-width/11+(2*width/100), height/3, width/2-width/11+(2*width/100), height/3+height/50);
      line(width/2+width/11-(2*width/100), height/3, width/2+width/11-(2*width/100), height/3+height/50);
          line(width/2-width/11+(3*width/100), height/3, width/2-width/11+(3*width/100), height/3+height/50);
      line(width/2+width/11-(3*width/100), height/3, width/2+width/11-(3*width/100), height/3+height/50);
          line(width/2-width/11+(4*width/100), height/3, width/2-width/11+(4*width/100), height/3+height/50);
      line(width/2+width/11-(4*width/100), height/3, width/2+width/11-(4*width/100), height/3+height/50);
          line(width/2-width/11+(5*width/100), height/3, width/2-width/11+(5*width/100), height/3+height/50);
      line(width/2+width/11-(5*width/100), height/3, width/2+width/11-(5*width/100), height/3+height/50);
        line(width/2-width/11+(6*width/100), height/3, width/2-width/11+(6*width/100), height/3+height/50);
      line(width/2+width/11-(6*width/100), height/3, width/2+width/11-(6*width/100), height/3+height/50);
        line(width/2-width/11+(7*width/100), height/3, width/2-width/11+(7*width/100), height/3+height/50);
      line(width/2+width/11-(7*width/100), height/3, width/2+width/11-(7*width/100), height/3+height/50);
        line(width/2-width/11+(8*width/100), height/3, width/2-width/11+(8*width/100), height/3+height/50);
      line(width/2+width/11-(8*width/100), height/3, width/2+width/11-(8*width/100), height/3+height/50);
        line(width/2, height/3, width/2, height/3+height/50);
      
      }
     
     
     
       else if (colTone>.2){
         
           //ladder (back)
        if (frontback<.5){
          strokeWeight(width/600);
    stroke("#FF990A")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
      noStroke();  
         fill("#DA9B07")
        rect(width/2, height/2, width/50, height/3);
          fill("#CE910A")
      ellipse(width/2, height/2-height/6, width/8, height/8);  
      fill("#C1860D")
      
      rect(width/2, height/2-height/5, width/8,height/8);
  fill("#B57C0F")
      
      
      rect(width/2-width/36, height/2-height/5, width/16,height/8);
  
        fill("#A87112")
      
      rect(width/2-width/36, height/2-height/5, width/16,height/8);
     fill ("#C1860D");
      
      rect(width/2-width/96, height/2-height/5, width/16,height/8);
          
      fill ("#DA9B07");
         rect(width/2+width/48, height/2-height/5, width/16,height/8);
      
      
      if (structure>.5){
              strokeWeight(width/600);
    stroke("#C1860D")
 line(width/2, height/2, width/2+width/20, height/2+height/20);
    line(width/2, height/2, width/2-width/20, height/2+height/20);
    line(width/2, height/2, width/2+width/20, height/2-height/20);
    line(width/2, height/2, width/2-width/20, height/2-height/20);
    line(width/2+width/20, height/2+height/20, width/2-width/20, height/2+height/20);
    line(width/2+width/20, height/2-height/20, width/2-width/20, height/2-height/20);
    line(width/2-width/20, height/2, width/2+width/20, height/2);
         noStroke();
   
   
            strokeWeight(width/600);
  stroke("#C1860D")
   line(width/2, height/2, width/2+width/20, height/2+height/20);
    line(width/2, height/2, width/2-width/20, height/2+height/20);
    line(width/2, height/2, width/2+width/20, height/2-height/20);
    line(width/2, height/2, width/2-width/20, height/2-height/20);
    line(width/2+width/20, height/2+height/20, width/2-width/20, height/2+height/20);
    line(width/2+width/20, height/2-height/20, width/2-width/20, height/2-height/20);
    line(width/2-width/20, height/2, width/2+width/20, height/2);
         noStroke();
        fill("#DA9B07")
        rect(width/2, height/2, width/50, height/3);
    rect(width/2+width/20, height/2, width/250, height/3);
   rect(width/2-width/20, height/2, width/250, height/3);}
    
        
         //ladder (front)
        if (frontback>.5){
          strokeWeight(width/600);
    stroke("#FF990A")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
           //walkway
      
      strokeWeight(width/600);
    stroke("#FF990A")
      line(width/2-width/11+(2*width/100), height/3, width/2+width/11-(2*width/100), height/3);
      line(width/2-width/11+(2*width/100), height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);
       strokeWeight(width/800);
         
          if (ladder2>width/2){line(ladder2, height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);}
       else if (ladder2<width/2){line(ladder2, height/3+height/50, width/2-width/11+(2*width/100), height/3+height/50);}
      
       line(width/2-width/11+(2*width/100), height/3, width/2-width/11+(2*width/100), height/3+height/50);
      line(width/2+width/11-(2*width/100), height/3, width/2+width/11-(2*width/100), height/3+height/50);
          line(width/2-width/11+(3*width/100), height/3, width/2-width/11+(3*width/100), height/3+height/50);
      line(width/2+width/11-(3*width/100), height/3, width/2+width/11-(3*width/100), height/3+height/50);
          line(width/2-width/11+(4*width/100), height/3, width/2-width/11+(4*width/100), height/3+height/50);
      line(width/2+width/11-(4*width/100), height/3, width/2+width/11-(4*width/100), height/3+height/50);
          line(width/2-width/11+(5*width/100), height/3, width/2-width/11+(5*width/100), height/3+height/50);
      line(width/2+width/11-(5*width/100), height/3, width/2+width/11-(5*width/100), height/3+height/50);
        line(width/2-width/11+(6*width/100), height/3, width/2-width/11+(6*width/100), height/3+height/50);
      line(width/2+width/11-(6*width/100), height/3, width/2+width/11-(6*width/100), height/3+height/50);
        line(width/2-width/11+(7*width/100), height/3, width/2-width/11+(7*width/100), height/3+height/50);
      line(width/2+width/11-(7*width/100), height/3, width/2+width/11-(7*width/100), height/3+height/50);
        line(width/2-width/11+(8*width/100), height/3, width/2-width/11+(8*width/100), height/3+height/50);
      line(width/2+width/11-(8*width/100), height/3, width/2+width/11-(8*width/100), height/3+height/50);
        line(width/2, height/3, width/2, height/3+height/50);
      
      }
      
      else {
        
         
      noStroke();  
         fill("azure")
       rect(width/2, height/2, width/50, height/3);
          fill("azure")
      ellipse(width/2, height/2-height/6, width/8, height/8);  
      fill("#9FBFF5")
      
      rect(width/2, height/2-height/5, width/8,height/8);
  fill("#5985D0")
      
      
      rect(width/2-width/36, height/2-height/5, width/16,height/8);
  
        fill("#6A96E1")
      
      rect(width/2-width/36, height/2-height/5, width/16,height/8);
     fill ("#81A9EE");
      
      rect(width/2-width/96, height/2-height/5, width/16,height/8);
          
      fill ("#9FBFF5");
         rect(width/2+width/48, height/2-height/5, width/16,height/8);
      
       fill("azure")
      
      
      rect(width/2, height/2-height/5, width/8,height/16);
      if (structure>.5){
              strokeWeight(width/600);
    stroke("white")
   line(width/2, height/2, width/2+width/20, height/2+height/20);
    line(width/2, height/2, width/2-width/20, height/2+height/20);
    line(width/2, height/2, width/2+width/20, height/2-height/20);
    line(width/2, height/2, width/2-width/20, height/2-height/20);
    line(width/2+width/20, height/2+height/20, width/2-width/20, height/2+height/20);
    line(width/2+width/20, height/2-height/20, width/2-width/20, height/2-height/20);
    line(width/2-width/20, height/2, width/2+width/20, height/2);
         noStroke();
         fill("azure");
       rect(width/2, height/2, width/50, height/3);
    rect(width/2+width/20, height/2, width/250, height/3);
   rect(width/2-width/20, height/2, width/250, height/3);}
   
        
         //ladder (front)
        if (frontback>.5){
          strokeWeight(width/600);
    stroke("azure")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
           //walkway
      
      strokeWeight(width/600);
    stroke("azure")
      line(width/2-width/11+(2*width/100), height/3, width/2+width/11-(2*width/100), height/3);
      line(width/2-width/11+(2*width/100), height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);
       strokeWeight(width/800);
        
         if (ladder2>width/2){line(ladder2, height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);}
       else if (ladder2<width/2){line(ladder2, height/3+height/50, width/2-width/11+(2*width/100), height/3+height/50);}
      
       line(width/2-width/11+(2*width/100), height/3, width/2-width/11+(2*width/100), height/3+height/50);
      line(width/2+width/11-(2*width/100), height/3, width/2+width/11-(2*width/100), height/3+height/50);
          line(width/2-width/11+(3*width/100), height/3, width/2-width/11+(3*width/100), height/3+height/50);
      line(width/2+width/11-(3*width/100), height/3, width/2+width/11-(3*width/100), height/3+height/50);
          line(width/2-width/11+(4*width/100), height/3, width/2-width/11+(4*width/100), height/3+height/50);
      line(width/2+width/11-(4*width/100), height/3, width/2+width/11-(4*width/100), height/3+height/50);
          line(width/2-width/11+(5*width/100), height/3, width/2-width/11+(5*width/100), height/3+height/50);
      line(width/2+width/11-(5*width/100), height/3, width/2+width/11-(5*width/100), height/3+height/50);
        line(width/2-width/11+(6*width/100), height/3, width/2-width/11+(6*width/100), height/3+height/50);
      line(width/2+width/11-(6*width/100), height/3, width/2+width/11-(6*width/100), height/3+height/50);
        line(width/2-width/11+(7*width/100), height/3, width/2-width/11+(7*width/100), height/3+height/50);
      line(width/2+width/11-(7*width/100), height/3, width/2+width/11-(7*width/100), height/3+height/50);
        line(width/2-width/11+(8*width/100), height/3, width/2-width/11+(8*width/100), height/3+height/50);
      line(width/2+width/11-(8*width/100), height/3, width/2+width/11-(8*width/100), height/3+height/50);
        line(width/2, height/3, width/2, height/3+height/50);
   }
     
     
     
     
     
   pop();
      
     //frame
     
     fill("white");
     noStroke();
     rect(width/2, height/16, width/1.11, height/29);
     rect(width/2, 15*height/16, width/1.11, height/29);
     rect(width/16.5, height/2, width/40, height/1.1);
     rect(15.5*width/16.5, height/2, width/40, height/1.1);
   }
  
  //square Tower
    
    else if (var1>.35){
        
     if (skinnyTower>=.75){
       
       
       push();
     if (mover>.25){translate((random_num(-width/6, width/3)), 0);}
    
     
      //shadows
 if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6) {
      fill ("#103611");}
     else if (sky>.765) { 
           fill("#474747");}
     else { 
           fill("#777777");}
   if (overgrown>.6 && snowday<.05){
  stroke(200);}
   else if (overgrown>.6) {
      stroke("#103611");}
     else if (sky>.765) { 
           stroke("#474747");}
     else { 
           stroke("#777777");}
     strokeWeight(width/300);
     line(width/2-width/20,height/2+height/6, width/2-width/20-width/6.7, 9.25*height/10);
      line(width/2+width/20,height/2+height/6, width/2+width/20-width/6.7, 9.25*height/10);
     strokeWeight(width/550);
     line(width/3.1, 8.9*height/10, (width/2+ (width/2-width/7))/1.84, ((height/2+height/6)+9.5*height/10)/2);
     line((width/2+(width/2-width/7))/2.05, 8.9*height/10, width/2.7, ((height/2+height/6)+9.5*height/10)/2);
     line((width/2+(width/2-width/7))/1.84, ((height/2+height/6)+9.5*height/10)/2, width/2.7, ((height/2+height/6)+9.5*height/10)/2);
     line((width/2+(width/2-width/7))/2.05, 8.9*height/10, width/3.12, 8.9*height/10);
     strokeWeight(width/70)
     line(width/2,height/2+height/6, width/2-width/6.7, 9.25*height/10);
  
       
    
     
   noStroke();
  fill("white")
    rect(width/2, height/2, width/50, height/3);
    rect(width/2+width/20, height/2, width/250, height/3);
   rect(width/2-width/20, height/2, width/250, height/3);
     
    

  
     
     if (colTone>.7){
       
       //ladder (back)
        if (frontback<.5){
          strokeWeight(width/600);
    stroke("azure")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
       
    noStroke();  
          fill("#EEEEEE")
      ellipse(width/2, height/2-height/6, width/8, height/8);  
      fill("#f1f1f1")
      
      rect(width/2, height/2-height/5, width/8,height/8);
  fill("silver")
      
      
      rect(width/2-width/36, height/2-height/5, width/16,height/8);
  
        fill("#CCCCCC")
      
      rect(width/2-width/36, height/2-height/5, width/18,height/8);
     fill ("#d9d9d9");
      
      rect(width/2-width/96, height/2-height/5, width/16,height/8);
          
      fill ("#e6e6e6");
         rect(width/2+width/48, height/2-height/5, width/18,height/8);
      
               strokeWeight(width/600);
    stroke("#EEEEEE")
    line(width/2, height/2, width/2+width/20, height/2+height/20);
    line(width/2, height/2, width/2-width/20, height/2+height/20);
    line(width/2, height/2, width/2+width/20, height/2-height/20);
    line(width/2, height/2, width/2-width/20, height/2-height/20);
    line(width/2+width/20, height/2+height/20, width/2-width/20, height/2+height/20);
    line(width/2+width/20, height/2-height/20, width/2-width/20, height/2-height/20);
    line(width/2-width/20, height/2, width/2+width/20, height/2);
    noStroke();
    
        strokeWeight(width/600);
   
   line(width/2, height/2, width/2+width/20, height/2+height/20);
    line(width/2, height/2, width/2-width/20, height/2+height/20);
    line(width/2, height/2, width/2+width/20, height/2-height/20);
    line(width/2, height/2, width/2-width/20, height/2-height/20);
    line(width/2+width/20, height/2+height/20, width/2-width/20, height/2+height/20);
    line(width/2+width/20, height/2-height/20, width/2-width/20, height/2-height/20);
    line(width/2-width/20, height/2, width/2+width/20, height/2);
         noStroke();
 
        
         //ladder (front)
        if (frontback>.5){
          strokeWeight(width/600);
    stroke("azure")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
           //walkway
      
      strokeWeight(width/600);
    stroke("azure")
      line(width/2-width/11+(2*width/100), height/3, width/2+width/11-(2*width/100), height/3);
      line(width/2-width/11+(2*width/100), height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);
       strokeWeight(width/800);
       
         if (ladder2>width/2){line(ladder2, height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);}
       else if (ladder2<width/2){line(ladder2, height/3+height/50, width/2-width/11+(2*width/100), height/3+height/50);}
      
       line(width/2-width/11+(2*width/100), height/3, width/2-width/11+(2*width/100), height/3+height/50);
      line(width/2+width/11-(2*width/100), height/3, width/2+width/11-(2*width/100), height/3+height/50);
          line(width/2-width/11+(3*width/100), height/3, width/2-width/11+(3*width/100), height/3+height/50);
      line(width/2+width/11-(3*width/100), height/3, width/2+width/11-(3*width/100), height/3+height/50);
          line(width/2-width/11+(4*width/100), height/3, width/2-width/11+(4*width/100), height/3+height/50);
      line(width/2+width/11-(4*width/100), height/3, width/2+width/11-(4*width/100), height/3+height/50);
          line(width/2-width/11+(5*width/100), height/3, width/2-width/11+(5*width/100), height/3+height/50);
      line(width/2+width/11-(5*width/100), height/3, width/2+width/11-(5*width/100), height/3+height/50);
        line(width/2-width/11+(6*width/100), height/3, width/2-width/11+(6*width/100), height/3+height/50);
      line(width/2+width/11-(6*width/100), height/3, width/2+width/11-(6*width/100), height/3+height/50);
        line(width/2-width/11+(7*width/100), height/3, width/2-width/11+(7*width/100), height/3+height/50);
      line(width/2+width/11-(7*width/100), height/3, width/2+width/11-(7*width/100), height/3+height/50);
        line(width/2-width/11+(8*width/100), height/3, width/2-width/11+(8*width/100), height/3+height/50);
      line(width/2+width/11-(8*width/100), height/3, width/2+width/11-(8*width/100), height/3+height/50);
        line(width/2, height/3, width/2, height/3+height/50);
     }
      
      
      else if (colTone>.4){
        //ladder (back)
        if (frontback<.5){
          strokeWeight(width/600);
    stroke("#E65D42")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
      noStroke();  
         fill("#D65D42")
       rect(width/2, height/2, width/50, height/3);
    rect(width/2+width/20, height/2, width/250, height/3);
   rect(width/2-width/20, height/2, width/250, height/3);
          fill("#E97452")
      ellipse(width/2, height/2-height/6, width/8, height/8);  
      fill("#D65D42")
      
      rect(width/2, height/2-height/5, width/8,height/8);
  fill("#9E1711")
      
      
      rect(width/2-width/36, height/2-height/5, width/16,height/8);
  
        fill("#B12E21")
      
      rect(width/2-width/36, height/2-height/5, width/16,height/8);
     fill ("#C34632");
      
      rect(width/2-width/96, height/2-height/5, width/16,height/8);
          
      fill ("#D65D42");
         rect(width/2+width/48, height/2-height/5, width/16,height/8);
      
      
      
              strokeWeight(width/600);
    stroke("#D65D42")
    line(width/2, height/2, width/2+width/20, height/2+height/20);
    line(width/2, height/2, width/2-width/20, height/2+height/20);
    line(width/2, height/2, width/2+width/20, height/2-height/20);
    line(width/2, height/2, width/2-width/20, height/2-height/20);
    line(width/2+width/20, height/2+height/20, width/2-width/20, height/2+height/20);
    line(width/2+width/20, height/2-height/20, width/2-width/20, height/2-height/20);
    line(width/2-width/20, height/2, width/2+width/20, height/2);
         noStroke();
   
   
           strokeWeight(width/600);
   stroke("#D65D42")
   line(width/2, height/2, width/2+width/20, height/2+height/20);
    line(width/2, height/2, width/2-width/20, height/2+height/20);
    line(width/2, height/2, width/2+width/20, height/2-height/20);
    line(width/2, height/2, width/2-width/20, height/2-height/20);
    line(width/2+width/20, height/2+height/20, width/2-width/20, height/2+height/20);
    line(width/2+width/20, height/2-height/20, width/2-width/20, height/2-height/20);
    line(width/2-width/20, height/2, width/2+width/20, height/2);
         noStroke();
  
        
         //ladder (front)
        if (frontback>.5){
          strokeWeight(width/600);
    stroke("#E65D42")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
           //walkway
      
      strokeWeight(width/600);
    stroke("#E65D42")
      line(width/2-width/11+(2*width/100), height/3, width/2+width/11-(2*width/100), height/3);
      line(width/2-width/11+(2*width/100), height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);
       strokeWeight(width/800);
        
         if (ladder2>width/2){line(ladder2, height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);}
       else if (ladder2<width/2){line(ladder2, height/3+height/50, width/2-width/11+(2*width/100), height/3+height/50);}
      
       line(width/2-width/11+(2*width/100), height/3, width/2-width/11+(2*width/100), height/3+height/50);
      line(width/2+width/11-(2*width/100), height/3, width/2+width/11-(2*width/100), height/3+height/50);
          line(width/2-width/11+(3*width/100), height/3, width/2-width/11+(3*width/100), height/3+height/50);
      line(width/2+width/11-(3*width/100), height/3, width/2+width/11-(3*width/100), height/3+height/50);
          line(width/2-width/11+(4*width/100), height/3, width/2-width/11+(4*width/100), height/3+height/50);
      line(width/2+width/11-(4*width/100), height/3, width/2+width/11-(4*width/100), height/3+height/50);
          line(width/2-width/11+(5*width/100), height/3, width/2-width/11+(5*width/100), height/3+height/50);
      line(width/2+width/11-(5*width/100), height/3, width/2+width/11-(5*width/100), height/3+height/50);
        line(width/2-width/11+(6*width/100), height/3, width/2-width/11+(6*width/100), height/3+height/50);
      line(width/2+width/11-(6*width/100), height/3, width/2+width/11-(6*width/100), height/3+height/50);
        line(width/2-width/11+(7*width/100), height/3, width/2-width/11+(7*width/100), height/3+height/50);
      line(width/2+width/11-(7*width/100), height/3, width/2+width/11-(7*width/100), height/3+height/50);
        line(width/2-width/11+(8*width/100), height/3, width/2-width/11+(8*width/100), height/3+height/50);
      line(width/2+width/11-(8*width/100), height/3, width/2+width/11-(8*width/100), height/3+height/50);
        line(width/2, height/3, width/2, height/3+height/50);
      
      }
      
     
     
         
    else if (colTone>.03){
         
           //ladder (back)
        if (frontback<.5){
          strokeWeight(width/600);
    stroke("#9EE88E")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
      noStroke();  
         fill("#99C48D")
        rect(width/2, height/2, width/50, height/3);
    rect(width/2+width/20, height/2, width/250, height/3);
   rect(width/2-width/20, height/2, width/250, height/3);
          fill("#91E09A")
      ellipse(width/2, height/2-height/6, width/8, height/8);  
      fill("#9ACBA2")
      
      rect(width/2, height/2-height/5, width/8,height/8);
  fill("#88B283")
      
      
      rect(width/2-width/36, height/2-height/5, width/16,height/8);
  
        fill("#9ACBA2")
      
      rect(width/2-width/36, height/2-height/5, width/16,height/8);
     fill ("#9CCF94");
      
      rect(width/2-width/96, height/2-height/5, width/16,height/8);
          
      fill ("#8FC98F");
         rect(width/2+width/48, height/2-height/5, width/16,height/8);
      
      
      
              strokeWeight(width/600);
    stroke("#8CCC8E")
 line(width/2, height/2, width/2+width/20, height/2+height/20);
    line(width/2, height/2, width/2-width/20, height/2+height/20);
    line(width/2, height/2, width/2+width/20, height/2-height/20);
    line(width/2, height/2, width/2-width/20, height/2-height/20);
    line(width/2+width/20, height/2+height/20, width/2-width/20, height/2+height/20);
    line(width/2+width/20, height/2-height/20, width/2-width/20, height/2-height/20);
    line(width/2-width/20, height/2, width/2+width/20, height/2);
         noStroke();
   
   
            strokeWeight(width/600);
  stroke("#74A575")
   line(width/2, height/2, width/2+width/20, height/2+height/20);
    line(width/2, height/2, width/2-width/20, height/2+height/20);
    line(width/2, height/2, width/2+width/20, height/2-height/20);
    line(width/2, height/2, width/2-width/20, height/2-height/20);
    line(width/2+width/20, height/2+height/20, width/2-width/20, height/2+height/20);
    line(width/2+width/20, height/2-height/20, width/2-width/20, height/2-height/20);
    line(width/2-width/20, height/2, width/2+width/20, height/2);
         noStroke();
    
        
         //ladder (front)
        if (frontback>.5){
          strokeWeight(width/600);
    stroke("#A7D190")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
           //walkway
      
      strokeWeight(width/600);
    stroke("#9AC28B")
      line(width/2-width/11+(2*width/100), height/3, width/2+width/11-(2*width/100), height/3);
      line(width/2-width/11+(2*width/100), height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);
       strokeWeight(width/800);
         
          if (ladder2>width/2){line(ladder2, height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);}
       else if (ladder2<width/2){line(ladder2, height/3+height/50, width/2-width/11+(2*width/100), height/3+height/50);}
      
       line(width/2-width/11+(2*width/100), height/3, width/2-width/11+(2*width/100), height/3+height/50);
      line(width/2+width/11-(2*width/100), height/3, width/2+width/11-(2*width/100), height/3+height/50);
          line(width/2-width/11+(3*width/100), height/3, width/2-width/11+(3*width/100), height/3+height/50);
      line(width/2+width/11-(3*width/100), height/3, width/2+width/11-(3*width/100), height/3+height/50);
          line(width/2-width/11+(4*width/100), height/3, width/2-width/11+(4*width/100), height/3+height/50);
      line(width/2+width/11-(4*width/100), height/3, width/2+width/11-(4*width/100), height/3+height/50);
          line(width/2-width/11+(5*width/100), height/3, width/2-width/11+(5*width/100), height/3+height/50);
      line(width/2+width/11-(5*width/100), height/3, width/2+width/11-(5*width/100), height/3+height/50);
        line(width/2-width/11+(6*width/100), height/3, width/2-width/11+(6*width/100), height/3+height/50);
      line(width/2+width/11-(6*width/100), height/3, width/2+width/11-(6*width/100), height/3+height/50);
        line(width/2-width/11+(7*width/100), height/3, width/2-width/11+(7*width/100), height/3+height/50);
      line(width/2+width/11-(7*width/100), height/3, width/2+width/11-(7*width/100), height/3+height/50);
        line(width/2-width/11+(8*width/100), height/3, width/2-width/11+(8*width/100), height/3+height/50);
      line(width/2+width/11-(8*width/100), height/3, width/2+width/11-(8*width/100), height/3+height/50);
        line(width/2, height/3, width/2, height/3+height/50);
      
      }
     
     
     
       else if (colTone>.2){
         
           //ladder (back)
        if (frontback<.5){
          strokeWeight(width/600);
    stroke("#FF990A")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
      noStroke();  
         fill("#DA9B07")
        rect(width/2, height/2, width/50, height/3);
    rect(width/2+width/20, height/2, width/250, height/3);
   rect(width/2-width/20, height/2, width/250, height/3);
          fill("#CE910A")
      ellipse(width/2, height/2-height/6, width/8, height/8);  
      fill("#C1860D")
      
      rect(width/2, height/2-height/5, width/8,height/8);
  fill("#B57C0F")
      
      
      rect(width/2-width/36, height/2-height/5, width/16,height/8);
  
        fill("#A87112")
      
      rect(width/2-width/36, height/2-height/5, width/16,height/8);
     fill ("#C1860D");
      
      rect(width/2-width/96, height/2-height/5, width/16,height/8);
          
      fill ("#DA9B07");
         rect(width/2+width/48, height/2-height/5, width/16,height/8);
      
      
      
              strokeWeight(width/600);
    stroke("#C1860D")
 line(width/2, height/2, width/2+width/20, height/2+height/20);
    line(width/2, height/2, width/2-width/20, height/2+height/20);
    line(width/2, height/2, width/2+width/20, height/2-height/20);
    line(width/2, height/2, width/2-width/20, height/2-height/20);
    line(width/2+width/20, height/2+height/20, width/2-width/20, height/2+height/20);
    line(width/2+width/20, height/2-height/20, width/2-width/20, height/2-height/20);
    line(width/2-width/20, height/2, width/2+width/20, height/2);
         noStroke();
   
   
            strokeWeight(width/600);
  stroke("#C1860D")
   line(width/2, height/2, width/2+width/20, height/2+height/20);
    line(width/2, height/2, width/2-width/20, height/2+height/20);
    line(width/2, height/2, width/2+width/20, height/2-height/20);
    line(width/2, height/2, width/2-width/20, height/2-height/20);
    line(width/2+width/20, height/2+height/20, width/2-width/20, height/2+height/20);
    line(width/2+width/20, height/2-height/20, width/2-width/20, height/2-height/20);
    line(width/2-width/20, height/2, width/2+width/20, height/2);
         noStroke();
    
        
         //ladder (front)
        if (frontback>.5){
          strokeWeight(width/600);
    stroke("#FF990A")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
           //walkway
      
      strokeWeight(width/600);
    stroke("#FF990A")
      line(width/2-width/11+(2*width/100), height/3, width/2+width/11-(2*width/100), height/3);
      line(width/2-width/11+(2*width/100), height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);
       strokeWeight(width/800);
         
          if (ladder2>width/2){line(ladder2, height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);}
       else if (ladder2<width/2){line(ladder2, height/3+height/50, width/2-width/11+(2*width/100), height/3+height/50);}
      
       line(width/2-width/11+(2*width/100), height/3, width/2-width/11+(2*width/100), height/3+height/50);
      line(width/2+width/11-(2*width/100), height/3, width/2+width/11-(2*width/100), height/3+height/50);
          line(width/2-width/11+(3*width/100), height/3, width/2-width/11+(3*width/100), height/3+height/50);
      line(width/2+width/11-(3*width/100), height/3, width/2+width/11-(3*width/100), height/3+height/50);
          line(width/2-width/11+(4*width/100), height/3, width/2-width/11+(4*width/100), height/3+height/50);
      line(width/2+width/11-(4*width/100), height/3, width/2+width/11-(4*width/100), height/3+height/50);
          line(width/2-width/11+(5*width/100), height/3, width/2-width/11+(5*width/100), height/3+height/50);
      line(width/2+width/11-(5*width/100), height/3, width/2+width/11-(5*width/100), height/3+height/50);
        line(width/2-width/11+(6*width/100), height/3, width/2-width/11+(6*width/100), height/3+height/50);
      line(width/2+width/11-(6*width/100), height/3, width/2+width/11-(6*width/100), height/3+height/50);
        line(width/2-width/11+(7*width/100), height/3, width/2-width/11+(7*width/100), height/3+height/50);
      line(width/2+width/11-(7*width/100), height/3, width/2+width/11-(7*width/100), height/3+height/50);
        line(width/2-width/11+(8*width/100), height/3, width/2-width/11+(8*width/100), height/3+height/50);
      line(width/2+width/11-(8*width/100), height/3, width/2+width/11-(8*width/100), height/3+height/50);
        line(width/2, height/3, width/2, height/3+height/50);
      
      }
      
      else {
        
         
      noStroke();  
         fill("azure")
       rect(width/2, height/2, width/50, height/3);
    rect(width/2+width/20, height/2, width/250, height/3);
   rect(width/2-width/20, height/2, width/250, height/3);
          fill("azure")
      ellipse(width/2, height/2-height/6, width/8, height/8);  
      fill("#9FBFF5")
      
      rect(width/2, height/2-height/5, width/8,height/8);
  fill("#5985D0")
      
      
      rect(width/2-width/36, height/2-height/5, width/16,height/8);
  
        fill("#6A96E1")
      
      rect(width/2-width/36, height/2-height/5, width/16,height/8);
     fill ("#81A9EE");
      
      rect(width/2-width/96, height/2-height/5, width/16,height/8);
          
      fill ("#9FBFF5");
         rect(width/2+width/48, height/2-height/5, width/16,height/8);
      
       fill("azure")
      
      
      rect(width/2, height/2-height/5, width/8,height/16);
      
              strokeWeight(width/600);
    stroke("white")
   line(width/2, height/2, width/2+width/20, height/2+height/20);
    line(width/2, height/2, width/2-width/20, height/2+height/20);
    line(width/2, height/2, width/2+width/20, height/2-height/20);
    line(width/2, height/2, width/2-width/20, height/2-height/20);
    line(width/2+width/20, height/2+height/20, width/2-width/20, height/2+height/20);
    line(width/2+width/20, height/2-height/20, width/2-width/20, height/2-height/20);
    line(width/2-width/20, height/2, width/2+width/20, height/2);
         noStroke();
   
        
         //ladder (front)
        if (frontback>.5){
          strokeWeight(width/600);
    stroke("azure")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
           //walkway
      
      strokeWeight(width/600);
    stroke("azure")
      line(width/2-width/11+(2*width/100), height/3, width/2+width/11-(2*width/100), height/3);
      line(width/2-width/11+(2*width/100), height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);
       strokeWeight(width/800);
        
         if (ladder2>width/2){line(ladder2, height/3+height/50, width/2+width/11-(2*width/100), height/3+height/50);}
       else if (ladder2<width/2){line(ladder2, height/3+height/50, width/2-width/11+(2*width/100), height/3+height/50);}
      
       line(width/2-width/11+(2*width/100), height/3, width/2-width/11+(2*width/100), height/3+height/50);
      line(width/2+width/11-(2*width/100), height/3, width/2+width/11-(2*width/100), height/3+height/50);
          line(width/2-width/11+(3*width/100), height/3, width/2-width/11+(3*width/100), height/3+height/50);
      line(width/2+width/11-(3*width/100), height/3, width/2+width/11-(3*width/100), height/3+height/50);
          line(width/2-width/11+(4*width/100), height/3, width/2-width/11+(4*width/100), height/3+height/50);
      line(width/2+width/11-(4*width/100), height/3, width/2+width/11-(4*width/100), height/3+height/50);
          line(width/2-width/11+(5*width/100), height/3, width/2-width/11+(5*width/100), height/3+height/50);
      line(width/2+width/11-(5*width/100), height/3, width/2+width/11-(5*width/100), height/3+height/50);
        line(width/2-width/11+(6*width/100), height/3, width/2-width/11+(6*width/100), height/3+height/50);
      line(width/2+width/11-(6*width/100), height/3, width/2+width/11-(6*width/100), height/3+height/50);
        line(width/2-width/11+(7*width/100), height/3, width/2-width/11+(7*width/100), height/3+height/50);
      line(width/2+width/11-(7*width/100), height/3, width/2+width/11-(7*width/100), height/3+height/50);
        line(width/2-width/11+(8*width/100), height/3, width/2-width/11+(8*width/100), height/3+height/50);
      line(width/2+width/11-(8*width/100), height/3, width/2+width/11-(8*width/100), height/3+height/50);
        line(width/2, height/3, width/2, height/3+height/50);
   }
       
       
      
        
       
       
       
   pop();
      
     //frame
     
     fill("white");
     noStroke();
     rect(width/2, height/16, width/1.11, height/29);
     rect(width/2, 15*height/16, width/1.11, height/29);
     rect(width/16.5, height/2, width/40, height/1.1);
     rect(15.5*width/16.5, height/2, width/40, height/1.1);
   }
      
      else{
  
      
      push();
      if (mover>.25){translate((random_num(-width/4, width/3)), 0);}
      
         //shadows
 if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6) {
      fill ("#103611");}
     else if (sky>.765) { 
           fill("#474747");}
     else { 
           fill("#777777");}
   if (overgrown>.6 && snowday<.05){
  stroke(200);}
   else if (overgrown>.6) {
      stroke("#103611");}
     else if (sky>.765) { 
           stroke("#474747");}
     else { 
           stroke("#777777");}
     strokeWeight(width/250);
     line(width/2-width/15,height/2+height/6, width/2-width/4.55, 9.25*height/10);
      line(width/2+width/15,height/2+height/6, width/2-width/4.5+width/6.35, 9.25*height/10);
     strokeWeight(width/450);
     
     line((width/2+(width/2-width/7))/1.73, ((height/2+height/6)+9.5*height/10)/2,width/3.3, 8.9*height/10);
         line(width/2.87, ((height/2+height/6)+9.5*height/10)/2,(width/2+(width/2-width/7))/1.9, 8.9*height/10);
      
     line((width/2+(width/2-width/7))/1.74, ((height/2+height/6)+9.5*height/10)/2, width/2.87, ((height/2+height/6)+9.5*height/10)/2);
     line((width/2+(width/2-width/7))/1.9, 8.9*height/10, width/3.32, 8.9*height/10);
     strokeWeight(width/60)
     line(width/2,height/2+height/6, width/2-width/7, 9.25*height/10);
  
      
      
     noStroke();
  fill("white")
    rect(width/2, height/2, width/50, height/3);
    rect(width/2+width/15, height/2, width/200, height/3);
   rect(width/2-width/15, height/2, width/200, height/3);
    ellipse(width/2, height/2-height/6, width/6, height/8);  
      rect(width/2, height/2-height/5, width/6,height/8);
          strokeWeight(width/400);
    stroke("white")
    line(width/2, height/2, width/2+width/15, height/2+height/15);
    line(width/2, height/2, width/2-width/15, height/2+height/15);
    line(width/2, height/2, width/2+width/15, height/2-height/15);
    line(width/2, height/2, width/2-width/15, height/2-height/15);
    line(width/2+width/15, height/2+height/15, width/2-width/15, height/2+height/15);
    line(width/2+width/15, height/2-height/15, width/2-width/15, height/2-height/15);
    line(width/2-width/15, height/2, width/2+width/15, height/2);
      
  
      
      
      if (colTone>.7){
        
         //ladder (back)
        if (frontback<.5){
          strokeWeight(width/600);
    stroke("white")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
    noStroke();  
          fill("#EEEEEE")
      ellipse(width/2, height/2-height/6, width/6, height/8);  
      fill("#f1f1f1")
      
      rect(width/2, height/2-height/5, width/6,height/8);
  fill("silver")
      
      
      rect(width/2-width/24, height/2-height/5, width/12,height/8);
  
        fill("#CCCCCC")
      
      rect(width/2-width/36, height/2-height/5, width/12,height/8);
     fill ("#d9d9d9");
      
      rect(width/2-width/96, height/2-height/5, width/12,height/8);
          
      fill ("#e6e6e6");
         rect(width/2+width/48, height/2-height/5, width/16,height/8);
      
      
    noStroke();
      
        //ladder (front)
        if (frontback>.5){
          strokeWeight(width/600);
    stroke("white")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
         //walkway
      
      strokeWeight(width/600);
    stroke("white")
      line(width/2-width/11, height/3, width/2+width/11, height/3);
      line(width/2-width/11, height/3+height/50, width/2+width/11, height/3+height/50);
       strokeWeight(width/800);
      line(width/2-width/11, height/3, width/2-width/11, height/3+height/50);
      line(width/2+width/11, height/3, width/2+width/11, height/3+height/50);
      line(width/2-width/11+width/100, height/3, width/2-width/11+width/100, height/3+height/50);
      line(width/2+width/11-width/100, height/3, width/2+width/11-width/100, height/3+height/50);
       line(width/2-width/11+(2*width/100), height/3, width/2-width/11+(2*width/100), height/3+height/50);
      line(width/2+width/11-(2*width/100), height/3, width/2+width/11-(2*width/100), height/3+height/50);
          line(width/2-width/11+(3*width/100), height/3, width/2-width/11+(3*width/100), height/3+height/50);
      line(width/2+width/11-(3*width/100), height/3, width/2+width/11-(3*width/100), height/3+height/50);
          line(width/2-width/11+(4*width/100), height/3, width/2-width/11+(4*width/100), height/3+height/50);
      line(width/2+width/11-(4*width/100), height/3, width/2+width/11-(4*width/100), height/3+height/50);
          line(width/2-width/11+(5*width/100), height/3, width/2-width/11+(5*width/100), height/3+height/50);
      line(width/2+width/11-(5*width/100), height/3, width/2+width/11-(5*width/100), height/3+height/50);
        line(width/2-width/11+(6*width/100), height/3, width/2-width/11+(6*width/100), height/3+height/50);
      line(width/2+width/11-(6*width/100), height/3, width/2+width/11-(6*width/100), height/3+height/50);
        line(width/2-width/11+(7*width/100), height/3, width/2-width/11+(7*width/100), height/3+height/50);
      line(width/2+width/11-(7*width/100), height/3, width/2+width/11-(7*width/100), height/3+height/50);
        line(width/2-width/11+(8*width/100), height/3, width/2-width/11+(8*width/100), height/3+height/50);
      line(width/2+width/11-(8*width/100), height/3, width/2+width/11-(8*width/100), height/3+height/50);
        line(width/2, height/3, width/2, height/3+height/50);
      
      }
      
      
      else if (colTone>.4){
        
        
        
         //ladder (back)
        if (frontback<.5){
          strokeWeight(width/600);
    stroke("#D65D42")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
      noStroke();  
         fill("#D65D42")
       rect(width/2, height/2, width/50, height/3);
    rect(width/2+width/15, height/2, width/200, height/3);
   rect(width/2-width/15, height/2, width/200, height/3);
          fill("#E97452")
      ellipse(width/2, height/2-height/6, width/6, height/8);  
      fill("#D65D42")
      
      rect(width/2, height/2-height/5, width/6,height/8);
  fill("#9E1711")
      
      
      rect(width/2-width/24, height/2-height/5, width/12,height/8);
  
        fill("#B12E21")
      
      rect(width/2-width/36, height/2-height/5, width/12,height/8);
     fill ("#C34632");
      
      rect(width/2-width/96, height/2-height/5, width/12,height/8);
          
      fill ("#D65D42");
         rect(width/2+width/48, height/2-height/5, width/12,height/8);
      
      
      
              strokeWeight(width/400);
    stroke("#D65D42")
    line(width/2, height/2, width/2+width/15, height/2+height/15);
    line(width/2, height/2, width/2-width/15, height/2+height/15);
    line(width/2, height/2, width/2+width/15, height/2-height/15);
    line(width/2, height/2, width/2-width/15, height/2-height/15);
    line(width/2+width/15, height/2+height/15, width/2-width/15, height/2+height/15);
    line(width/2+width/15, height/2-height/15, width/2-width/15, height/2-height/15);
    line(width/2-width/15, height/2, width/2+width/15, height/2);
         noStroke();
  
        
   //ladder (front)
        if (frontback>.5){
          strokeWeight(width/600);
    stroke("#D65D42")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
           //walkway
      
      strokeWeight(width/600);
    stroke("#F65D42")
      line(width/2-width/11, height/3, width/2+width/11, height/3);
      line(width/2-width/11, height/3+height/50, width/2+width/11, height/3+height/50);
       strokeWeight(width/800);
      line(width/2-width/11, height/3, width/2-width/11, height/3+height/50);
      line(width/2+width/11, height/3, width/2+width/11, height/3+height/50);
      line(width/2-width/11+width/100, height/3, width/2-width/11+width/100, height/3+height/50);
      line(width/2+width/11-width/100, height/3, width/2+width/11-width/100, height/3+height/50);
       line(width/2-width/11+(2*width/100), height/3, width/2-width/11+(2*width/100), height/3+height/50);
      line(width/2+width/11-(2*width/100), height/3, width/2+width/11-(2*width/100), height/3+height/50);
          line(width/2-width/11+(3*width/100), height/3, width/2-width/11+(3*width/100), height/3+height/50);
      line(width/2+width/11-(3*width/100), height/3, width/2+width/11-(3*width/100), height/3+height/50);
          line(width/2-width/11+(4*width/100), height/3, width/2-width/11+(4*width/100), height/3+height/50);
      line(width/2+width/11-(4*width/100), height/3, width/2+width/11-(4*width/100), height/3+height/50);
          line(width/2-width/11+(5*width/100), height/3, width/2-width/11+(5*width/100), height/3+height/50);
      line(width/2+width/11-(5*width/100), height/3, width/2+width/11-(5*width/100), height/3+height/50);
        line(width/2-width/11+(6*width/100), height/3, width/2-width/11+(6*width/100), height/3+height/50);
      line(width/2+width/11-(6*width/100), height/3, width/2+width/11-(6*width/100), height/3+height/50);
        line(width/2-width/11+(7*width/100), height/3, width/2-width/11+(7*width/100), height/3+height/50);
      line(width/2+width/11-(7*width/100), height/3, width/2+width/11-(7*width/100), height/3+height/50);
        line(width/2-width/11+(8*width/100), height/3, width/2-width/11+(8*width/100), height/3+height/50);
      line(width/2+width/11-(8*width/100), height/3, width/2+width/11-(8*width/100), height/3+height/50);
        line(width/2, height/3, width/2, height/3+height/50);
      
      }
      
       else if (colTone>.2){
         
           //ladder (back)
        if (frontback<.5){
          strokeWeight(width/600);
    stroke("#DA9B07")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
      noStroke();  
         fill("#DA9B07")
       rect(width/2, height/2, width/50, height/3);
    rect(width/2+width/15, height/2, width/200, height/3);
   rect(width/2-width/15, height/2, width/200, height/3);
          fill("#CE910A")
      ellipse(width/2, height/2-height/6, width/6, height/8);  
      fill("#C1860D")
      
      rect(width/2, height/2-height/5, width/6,height/8);
  fill("#B57C0F")
      
      
      rect(width/2-width/24, height/2-height/5, width/12,height/8);
  
        fill("#A87112")
      
      rect(width/2-width/36, height/2-height/5, width/12,height/8);
     fill ("#C1860D");
      
      rect(width/2-width/96, height/2-height/5, width/12,height/8);
          
      fill ("#DA9B07");
         rect(width/2+width/48, height/2-height/5, width/12,height/8);
      
      
      
              strokeWeight(width/400);
    stroke("#C1860D")
    line(width/2, height/2, width/2+width/15, height/2+height/15);
    line(width/2, height/2, width/2-width/15, height/2+height/15);
    line(width/2, height/2, width/2+width/15, height/2-height/15);
    line(width/2, height/2, width/2-width/15, height/2-height/15);
    line(width/2+width/15, height/2+height/15, width/2-width/15, height/2+height/15);
    line(width/2+width/15, height/2-height/15, width/2-width/15, height/2-height/15);
    line(width/2-width/15, height/2, width/2+width/15, height/2);
         noStroke();
    
   
                  //ladder (front)
        if (frontback>.5){
          strokeWeight(width/600);
    stroke("#DA9B07")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
         
            //walkway
      
      strokeWeight(width/600);
    stroke("#EAAA00")
      line(width/2-width/11, height/3, width/2+width/11, height/3);
      line(width/2-width/11, height/3+height/50, width/2+width/11, height/3+height/50);
       strokeWeight(width/800);
      line(width/2-width/11, height/3, width/2-width/11, height/3+height/50);
      line(width/2+width/11, height/3, width/2+width/11, height/3+height/50);
      line(width/2-width/11+width/100, height/3, width/2-width/11+width/100, height/3+height/50);
      line(width/2+width/11-width/100, height/3, width/2+width/11-width/100, height/3+height/50);
       line(width/2-width/11+(2*width/100), height/3, width/2-width/11+(2*width/100), height/3+height/50);
      line(width/2+width/11-(2*width/100), height/3, width/2+width/11-(2*width/100), height/3+height/50);
          line(width/2-width/11+(3*width/100), height/3, width/2-width/11+(3*width/100), height/3+height/50);
      line(width/2+width/11-(3*width/100), height/3, width/2+width/11-(3*width/100), height/3+height/50);
          line(width/2-width/11+(4*width/100), height/3, width/2-width/11+(4*width/100), height/3+height/50);
      line(width/2+width/11-(4*width/100), height/3, width/2+width/11-(4*width/100), height/3+height/50);
          line(width/2-width/11+(5*width/100), height/3, width/2-width/11+(5*width/100), height/3+height/50);
      line(width/2+width/11-(5*width/100), height/3, width/2+width/11-(5*width/100), height/3+height/50);
        line(width/2-width/11+(6*width/100), height/3, width/2-width/11+(6*width/100), height/3+height/50);
      line(width/2+width/11-(6*width/100), height/3, width/2+width/11-(6*width/100), height/3+height/50);
        line(width/2-width/11+(7*width/100), height/3, width/2-width/11+(7*width/100), height/3+height/50);
      line(width/2+width/11-(7*width/100), height/3, width/2+width/11-(7*width/100), height/3+height/50);
        line(width/2-width/11+(8*width/100), height/3, width/2-width/11+(8*width/100), height/3+height/50);
      line(width/2+width/11-(8*width/100), height/3, width/2+width/11-(8*width/100), height/3+height/50);
        line(width/2, height/3, width/2, height/3+height/50);
      
      }
      
      else {
        
                  //ladder (back)
        if (frontback<.5){
          strokeWeight(width/600);
    stroke("azure")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
      noStroke();  
         fill("azure")
       rect(width/2, height/2, width/50, height/3);
    rect(width/2+width/15, height/2, width/200, height/3);
   rect(width/2-width/15, height/2, width/200, height/3);
          fill("azure")
      ellipse(width/2, height/2-height/6, width/6, height/8);  
      fill("#9FBFF5")
      
      rect(width/2, height/2-height/5, width/6,height/8);
  fill("#5985D0")
      
      
      rect(width/2-width/24, height/2-height/5, width/12,height/8);
  
        fill("#6A96E1")
      
      rect(width/2-width/36, height/2-height/5, width/12,height/8);
     fill ("#81A9EE");
      
      rect(width/2-width/96, height/2-height/5, width/12,height/8);
          
      fill ("#9FBFF5");
         rect(width/2+width/48, height/2-height/5, width/12,height/8);
      
       fill("azure")
      
      
      rect(width/2, height/2-height/5, width/6,height/16);
      
              strokeWeight(width/400);
    stroke("white")
    line(width/2, height/2, width/2+width/15, height/2+height/15);
    line(width/2, height/2, width/2-width/15, height/2+height/15);
    line(width/2, height/2, width/2+width/15, height/2-height/15);
    line(width/2, height/2, width/2-width/15, height/2-height/15);
    line(width/2+width/15, height/2+height/15, width/2-width/15, height/2+height/15);
    line(width/2+width/15, height/2-height/15, width/2-width/15, height/2-height/15);
    line(width/2-width/15, height/2, width/2+width/15, height/2);
         noStroke();
    
        
        //ladder (front)
        if (frontback>.5){
          strokeWeight(width/600);
    stroke("azure")
      line(ladder1, (height*3.9/5)-(height/3.45/2), ladder1, height/3);
       line(ladder2, (height*3.9/5)-(height/3.45/2), ladder2, height/3);
      line(ladder1, height/2, ladder2, height/2);
  line(ladder1, height/2, ladder2, height/2);
          line(ladder1, height/2+(height/100*12), ladder2, height/2+(height/100*12));
       line(ladder1, height/2+(height/100*11), ladder2, height/2+(height/100*11));
      line(ladder1, height/2+(height/100*10), ladder2, height/2+(height/100*10));
      line(ladder1, height/2+(height/100*9), ladder2, height/2+(height/100*9));
      line(ladder1, height/2+(height/100*8), ladder2, height/2+(height/100*8));
       line(ladder1, height/2+(height/100*7), ladder2, height/2+(height/100*7));
      line(ladder1, height/2+(height/100*6), ladder2, height/2+(height/100*6));
      line(ladder1, height/2+(height/100*5), ladder2, height/2+(height/100*5));
      line(ladder1, height/2+(height/100*4), ladder2, height/2+(height/100*4));
      line(ladder1, height/2+(height/100*3), ladder2, height/2+(height/100*3));
       line(ladder1, height/2+(height/100*2), ladder2, height/2+(height/100*2));
       line(ladder1, height/2+height/100, ladder2, height/2+height/100);
   line(ladder1, height/2, ladder2, height/2);
       line(ladder1, height/2-(height/100*16), ladder2, height/2-(height/100*16));
       line(ladder1, height/2-(height/100*15), ladder2, height/2-(height/100*15));
       line(ladder1, height/2-(height/100*14), ladder2, height/2-(height/100*14));
       line(ladder1, height/2-(height/100*13), ladder2, height/2-(height/100*13));
        line(ladder1, height/2-(height/100*12), ladder2, height/2-(height/100*12));
       line(ladder1, height/2-(height/100*11), ladder2, height/2-(height/100*11));
      line(ladder1, height/2-(height/100*10), ladder2, height/2-(height/100*10));
      line(ladder1, height/2-(height/100*9), ladder2, height/2-(height/100*9));
      line(ladder1, height/2-(height/100*8), ladder2, height/2-(height/100*8));
       line(ladder1, height/2-(height/100*7), ladder2, height/2-(height/100*7));
      line(ladder1, height/2-(height/100*6), ladder2, height/2-(height/100*6));
      line(ladder1, height/2-(height/100*5), ladder2, height/2-(height/100*5));
      line(ladder1, height/2-(height/100*4), ladder2, height/2-(height/100*4));
      line(ladder1, height/2-(height/100*3), ladder2, height/2-(height/100*3));
       line(ladder1, height/2-(height/100*2), ladder2, height/2-(height/100*2));
       line(ladder1, height/2-height/100, ladder2, height/2-height/100);}
        
           //walkway
      
      strokeWeight(width/600);
    stroke("white")
      line(width/2-width/11, height/3, width/2+width/11, height/3);
      line(width/2-width/11, height/3+height/50, width/2+width/11, height/3+height/50);
       strokeWeight(width/800);
      line(width/2-width/11, height/3, width/2-width/11, height/3+height/50);
      line(width/2+width/11, height/3, width/2+width/11, height/3+height/50);
      line(width/2-width/11+width/100, height/3, width/2-width/11+width/100, height/3+height/50);
      line(width/2+width/11-width/100, height/3, width/2+width/11-width/100, height/3+height/50);
       line(width/2-width/11+(2*width/100), height/3, width/2-width/11+(2*width/100), height/3+height/50);
      line(width/2+width/11-(2*width/100), height/3, width/2+width/11-(2*width/100), height/3+height/50);
          line(width/2-width/11+(3*width/100), height/3, width/2-width/11+(3*width/100), height/3+height/50);
      line(width/2+width/11-(3*width/100), height/3, width/2+width/11-(3*width/100), height/3+height/50);
          line(width/2-width/11+(4*width/100), height/3, width/2-width/11+(4*width/100), height/3+height/50);
      line(width/2+width/11-(4*width/100), height/3, width/2+width/11-(4*width/100), height/3+height/50);
          line(width/2-width/11+(5*width/100), height/3, width/2-width/11+(5*width/100), height/3+height/50);
      line(width/2+width/11-(5*width/100), height/3, width/2+width/11-(5*width/100), height/3+height/50);
        line(width/2-width/11+(6*width/100), height/3, width/2-width/11+(6*width/100), height/3+height/50);
      line(width/2+width/11-(6*width/100), height/3, width/2+width/11-(6*width/100), height/3+height/50);
        line(width/2-width/11+(7*width/100), height/3, width/2-width/11+(7*width/100), height/3+height/50);
      line(width/2+width/11-(7*width/100), height/3, width/2+width/11-(7*width/100), height/3+height/50);
        line(width/2-width/11+(8*width/100), height/3, width/2-width/11+(8*width/100), height/3+height/50);
      line(width/2+width/11-(8*width/100), height/3, width/2+width/11-(8*width/100), height/3+height/50);
        line(width/2, height/3, width/2, height/3+height/50);
   }
        
        
        
        
           
     //stripes
   if (fxrand()>.85){
        if (fxrand()>.25){fill("rgba(255,255,255,0.5)");}
        else {fill("rgba(185,223,215,0.5)");}
        noStroke();
    rect(width/2, height/2-height/5, width/6,height/16);
      rect(width/2-width/24, height/2-height/5, width/12,height/16);
      rect(width/2-width/36, height/2-height/5, width/12,height/16);
      rect(width/2-width/96, height/2-height/5, width/12,height/16);
         rect(width/2+width/48, height/2-height/5, width/12,height/16);}
      
           //graffiti
        if (graffiti>.2){
          unordinary=3;
          strokeWeight(random_num(min(width,height)/400, min(width,height)/350));
  stroke(random_num(50,100));
  point1=min(width,height)/2-min(width,height)/random_num(88,90);
    point2=min(width,height)/2;
  point3=min(width,height)/2+min(width,height)/random_num(88,90);
        fill("rgb(86,77,77)");
        push();
        translate(-width/20,-height/4.25);
        
        
            //ARROW
      
         line (point2+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500, point2+fxrand()/min(width,height)*500,point3+fxrand()/min(width,height)*500);
     line (point2+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500,point2+fxrand()/min(width,height)*500);
     line (point2+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point2+fxrand()/min(width,height)*500);
       
          translate(width/30,0);
          //T
  
 line (point2+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500, point2+fxrand()/min(width,height)*500,point3+fxrand()/min(width,height)*500);
   line (point1+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point1+fxrand()/min(width,height)*500);
    
          translate(width/30,0);
          
          
           //H
  line (point1+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500,point3+fxrand()/min(width,height)*500);
   line (point1+fxrand()/min(width,height)*500, point2+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point2+fxrand()/min(width,height)*500);
   line (point3+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point2+fxrand()/min(width,height)*500);
   line (point3+fxrand()/min(width,height)*500, point2+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point3+fxrand()/min(width,height)*500);
          
            translate(width/30,0);
          
            //E
  
   line (point1+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500,point3+fxrand()/min(width,height)*500);
  line (point1+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point1+fxrand()/min(width,height)*500);
  line (point1+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point3+fxrand()/min(width,height)*500);
  line (point1+fxrand()/min(width,height)*500, point2+fxrand()/min(width,height)*500, point2+fxrand()/min(width,height)*500,point2+fxrand()/min(width,height)*500);
          
 translate(-3*width/30,height/25);
        
  
  //B
  line (point1+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500,point3+fxrand()/min(width,height)*500);
  line (point1+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point1+fxrand()/min(width,height)*500);
   line (point1+fxrand()/min(width,height)*500, point2+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point2+fxrand()/min(width,height)*500);
   line (point1+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point3+fxrand()/min(width,height)*500);
   line (point3+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point2+fxrand()/min(width,height)*500);
   line (point3+fxrand()/min(width,height)*500, point2+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point3+fxrand()/min(width,height)*500);
          
          translate(width/30,0);
                 
          
            //A
  line (point2+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500,point3+fxrand()/min(width,height)*500);
line (point2+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point3+fxrand()/min(width,height)*500);
  line (point1+fxrand()/min(width,height)*500, point2+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point2+fxrand()/min(width,height)*500);
          
           translate(width/30,0);
          
           //R
  
  line (point1+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500,point3+fxrand()/min(width,height)*500);
  line (point1+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point1+fxrand()/min(width,height)*500);
    line (point3+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point2+fxrand()/min(width,height)*500);
    line (point3+fxrand()/min(width,height)*500, point2+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500,point2+fxrand()/min(width,height)*500);
   line (point1+fxrand()/min(width,height)*500, point2+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point3+fxrand()/min(width,height)*500);
          
           translate(width/30,0);
          
          
          //N
  
      line (point1+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500,point3+fxrand()/min(width,height)*500);
      line (point1+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point3+fxrand()/min(width,height)*500);
      line (point3+fxrand()/min(width,height)*500, point1+fxrand()/min(width,height)*500, point3+fxrand()/min(width,height)*500,point3+fxrand()/min(width,height)*500);
          
      pop();
        }
        
        
      pop();
      
     
         //frame
     
     fill("white");
     noStroke();
     rect(width/2, height/16, width/1.11, height/29);
     rect(width/2, 15*height/16, width/1.11, height/29);
     rect(width/16.5, height/2, width/30, height/1.1);
     rect(15.5*width/16.5, height/2, width/30, height/1.1);
      
  
     
        
        
        
        
        
    }
    
    
    
    }
  
  
  
  else {
    push();
    if (mover>.25){translate((random_num(-width/4, width/4)), 0);}
    
       //shadows
 if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6) {
      fill ("#103611");}
     else if (sky>.765) { 
           fill("#474747");}
     else { 
           fill("#777777");}
   if (overgrown>.6 && snowday<.05){
  stroke(200);}
   else if (overgrown>.6) {
      stroke("#103611");}
     else if (sky>.765) { 
           stroke("#474747");}
     else { 
           stroke("#777777");}
     strokeWeight(width/200);
     line(width/2-width/10,height/2+height/6, width/2-width/4, 9.25*height/10);
      line(width/2+width/10,height/2+height/6, width/2-width/4.5+width/5.25, 9.25*height/10);
     strokeWeight(width/250);
     line(width/2.65, ((height/2+height/6)+9.5*height/10)/2.27, (width/2+(width/2-width/7))/1.8, 9.12*height/10); 
     line((width/2+(width/2-width/7))/1.48, ((height/2+height/6)+9.5*height/10)/2.27, width/3.85, 9.12*height/10);
     line((width/2+(width/2-width/7))/1.48, ((height/2+height/6)+9.5*height/10)/2.27, width/2.65, ((height/2+height/6)+9.5*height/10)/2.27);
     line((width/2+(width/2-width/7))/1.8, 9.12*height/10, width/3.85, 9.12*height/10);
     strokeWeight(width/50)
     line(width/2,height/2+height/6, width/2-width/7, 9.25*height/10);
    
    noStroke();
  fill("white")
    rect(width/2, height/2, width/50, height/3);
    rect(width/2+width/10, height/2, width/150, height/3);
   rect(width/2-width/10, height/2, width/150, height/3);
    ellipse(width/2, height/2-height/6, width/4, height/8); 
    rect(width/2, height/2-height/5, width/4,height/8);
    strokeWeight(width/200);
    stroke("white")
    line(width/2, height/2, width/2+width/10, height/2+height/10);
    line(width/2, height/2, width/2-width/10, height/2+height/10);
    line(width/2, height/2, width/2+width/10, height/2-height/10);
    line(width/2, height/2, width/2-width/10, height/2-height/10);
    line(width/2+width/10, height/2+height/10, width/2-width/10, height/2+height/10);
    line(width/2+width/10, height/2-height/10, width/2-width/10, height/2-height/10);
    line(width/2-width/10, height/2, width/2+width/10, height/2);

    

     
    
    if (colTone>.7){
      
         //ladder (back)
        if (frontback<.5){
          strokeWeight(width/600);
    stroke("snow")
      line(ladder1-width/100, (height*3.9/5)-(height/3.45/2), ladder1-width/100, height/3);
       line(ladder2+width/100, (height*3.9/5)-(height/3.45/2), ladder2+width/100, height/3);
      line(ladder1-width/100, height/2, ladder2+width/100, height/2);
  line(ladder1-width/100, height/2, ladder2+width/100, height/2);
          line(ladder1-width/100, height/2+(height/100*12), ladder2+width/100, height/2+(height/100*12));
       line(ladder1-width/100, height/2+(height/100*11), ladder2+width/100, height/2+(height/100*11));
      line(ladder1-width/100, height/2+(height/100*10), ladder2+width/100, height/2+(height/100*10));
      line(ladder1-width/100, height/2+(height/100*9), ladder2+width/100, height/2+(height/100*9));
      line(ladder1-width/100, height/2+(height/100*8), ladder2+width/100, height/2+(height/100*8));
       line(ladder1-width/100, height/2+(height/100*7), ladder2+width/100, height/2+(height/100*7));
      line(ladder1-width/100, height/2+(height/100*6), ladder2+width/100, height/2+(height/100*6));
      line(ladder1-width/100, height/2+(height/100*5), ladder2+width/100, height/2+(height/100*5));
      line(ladder1-width/100, height/2+(height/100*4), ladder2+width/100, height/2+(height/100*4));
      line(ladder1-width/100, height/2+(height/100*3), ladder2+width/100, height/2+(height/100*3));
       line(ladder1-width/100, height/2+(height/100*2), ladder2+width/100, height/2+(height/100*2));
       line(ladder1-width/100, height/2+height/100, ladder2+width/100, height/2+height/100);
   line(ladder1-width/100, height/2, ladder2, height/2);
       line(ladder1-width/100, height/2-(height/100*16), ladder2+width/100, height/2-(height/100*16));
       line(ladder1-width/100, height/2-(height/100*15), ladder2+width/100, height/2-(height/100*15));
       line(ladder1-width/100, height/2-(height/100*14), ladder2+width/100, height/2-(height/100*14));
       line(ladder1-width/100, height/2-(height/100*13), ladder2+width/100, height/2-(height/100*13));
        line(ladder1-width/100, height/2-(height/100*12), ladder2+width/100, height/2-(height/100*12));
       line(ladder1-width/100, height/2-(height/100*11), ladder2+width/100, height/2-(height/100*11));
      line(ladder1-width/100, height/2-(height/100*10), ladder2+width/100, height/2-(height/100*10));
      line(ladder1-width/100, height/2-(height/100*9), ladder2+width/100, height/2-(height/100*9));
      line(ladder1-width/100, height/2-(height/100*8), ladder2+width/100, height/2-(height/100*8));
       line(ladder1-width/100, height/2-(height/100*7), ladder2+width/100, height/2-(height/100*7));
      line(ladder1-width/100, height/2-(height/100*6), ladder2+width/100, height/2-(height/100*6));
      line(ladder1-width/100, height/2-(height/100*5), ladder2+width/100, height/2-(height/100*5));
      line(ladder1-width/100, height/2-(height/100*4), ladder2+width/100, height/2-(height/100*4));
      line(ladder1-width/100, height/2-(height/100*3), ladder2+width/100, height/2-(height/100*3));
       line(ladder1-width/100, height/2-(height/100*2), ladder2+width/100, height/2-(height/100*2));
       line(ladder1-width/100, height/2-height/100, ladder2+width/100, height/2-height/100);}
      
    noStroke();  
          fill("#EEEEEE")
       ellipse(width/2, height/2-height/6, width/4, height/8);  
      fill("#f1f1f1")
     
      
      
      rect(width/2, height/2-height/5, width/4,height/8);
  fill("silver")
      
      
      rect(width/2-width/24, height/2-height/5, width/6,height/8);
  
        fill("#CCCCCC")
      
      rect(width/2-width/36, height/2-height/5, width/12,height/8);
     fill ("#d9d9d9");
      
      rect(width/2-width/96, height/2-height/5, width/12,height/8);
          
      fill ("#e6e6e6");
         rect(width/2+width/48, height/2-height/5, width/16,height/8);
      
      
    noStroke();

        //ladder (front)
        if (frontback>.5){
          strokeWeight(width/600);
    stroke("snow")
      line(ladder1-width/100, (height*3.9/5)-(height/3.45/2), ladder1-width/100, height/3);
       line(ladder2+width/100, (height*3.9/5)-(height/3.45/2), ladder2+width/100, height/3);
      line(ladder1-width/100, height/2, ladder2+width/100, height/2);
  line(ladder1-width/100, height/2, ladder2+width/100, height/2);
          line(ladder1-width/100, height/2+(height/100*12), ladder2+width/100, height/2+(height/100*12));
       line(ladder1-width/100, height/2+(height/100*11), ladder2+width/100, height/2+(height/100*11));
      line(ladder1-width/100, height/2+(height/100*10), ladder2+width/100, height/2+(height/100*10));
      line(ladder1-width/100, height/2+(height/100*9), ladder2+width/100, height/2+(height/100*9));
      line(ladder1-width/100, height/2+(height/100*8), ladder2+width/100, height/2+(height/100*8));
       line(ladder1-width/100, height/2+(height/100*7), ladder2+width/100, height/2+(height/100*7));
      line(ladder1-width/100, height/2+(height/100*6), ladder2+width/100, height/2+(height/100*6));
      line(ladder1-width/100, height/2+(height/100*5), ladder2+width/100, height/2+(height/100*5));
      line(ladder1-width/100, height/2+(height/100*4), ladder2+width/100, height/2+(height/100*4));
      line(ladder1-width/100, height/2+(height/100*3), ladder2+width/100, height/2+(height/100*3));
       line(ladder1-width/100, height/2+(height/100*2), ladder2+width/100, height/2+(height/100*2));
       line(ladder1-width/100, height/2+height/100, ladder2+width/100, height/2+height/100);
   line(ladder1-width/100, height/2, ladder2, height/2);
       line(ladder1-width/100, height/2-(height/100*16), ladder2+width/100, height/2-(height/100*16));
       line(ladder1-width/100, height/2-(height/100*15), ladder2+width/100, height/2-(height/100*15));
       line(ladder1-width/100, height/2-(height/100*14), ladder2+width/100, height/2-(height/100*14));
       line(ladder1-width/100, height/2-(height/100*13), ladder2+width/100, height/2-(height/100*13));
        line(ladder1-width/100, height/2-(height/100*12), ladder2+width/100, height/2-(height/100*12));
       line(ladder1-width/100, height/2-(height/100*11), ladder2+width/100, height/2-(height/100*11));
      line(ladder1-width/100, height/2-(height/100*10), ladder2+width/100, height/2-(height/100*10));
      line(ladder1-width/100, height/2-(height/100*9), ladder2+width/100, height/2-(height/100*9));
      line(ladder1-width/100, height/2-(height/100*8), ladder2+width/100, height/2-(height/100*8));
       line(ladder1-width/100, height/2-(height/100*7), ladder2+width/100, height/2-(height/100*7));
      line(ladder1-width/100, height/2-(height/100*6), ladder2+width/100, height/2-(height/100*6));
      line(ladder1-width/100, height/2-(height/100*5), ladder2+width/100, height/2-(height/100*5));
      line(ladder1-width/100, height/2-(height/100*4), ladder2+width/100, height/2-(height/100*4));
      line(ladder1-width/100, height/2-(height/100*3), ladder2+width/100, height/2-(height/100*3));
       line(ladder1-width/100, height/2-(height/100*2), ladder2+width/100, height/2-(height/100*2));
       line(ladder1-width/100, height/2-height/100, ladder2+width/100, height/2-height/100);}
        
           //walkway
      
      strokeWeight(width/600);
    stroke("snow")
      line(width/2-width/7, height/3, width/2+width/7, height/3);
      line(width/2-width/7, height/3+height/50, width/2+width/7, height/3+height/50);
       strokeWeight(width/800);
       
        
    line(width/2-width/7, height/3, width/2-width/7, height/3+height/50);
      line(width/2+width/7, height/3, width/2+width/7, height/3+height/50);
       line(width/2-width/7+(1*width/100), height/3, width/2-width/7+(1*width/100), height/3+height/50);
      line(width/2+width/7-(1*width/100), height/3, width/2+width/7-(1*width/100), height/3+height/50);
       line(width/2-width/7+(2*width/100), height/3, width/2-width/7+(2*width/100), height/3+height/50);
      line(width/2+width/7-(2*width/100), height/3, width/2+width/7-(2*width/100), height/3+height/50);
          line(width/2-width/7+(3*width/100), height/3, width/2-width/7+(3*width/100), height/3+height/50);
      line(width/2+width/7-(3*width/100), height/3, width/2+width/7-(3*width/100), height/3+height/50);
          line(width/2-width/7+(4*width/100), height/3, width/2-width/7+(4*width/100), height/3+height/50);
      line(width/2+width/7-(4*width/100), height/3, width/2+width/7-(4*width/100), height/3+height/50);
          line(width/2-width/7+(5*width/100), height/3, width/2-width/7+(5*width/100), height/3+height/50);
      line(width/2+width/7-(5*width/100), height/3, width/2+width/7-(5*width/100), height/3+height/50);
        line(width/2-width/7+(6*width/100), height/3, width/2-width/7+(6*width/100), height/3+height/50);
      line(width/2+width/7-(6*width/100), height/3, width/2+width/7-(6*width/100), height/3+height/50);
        line(width/2-width/7+(7*width/100), height/3, width/2-width/7+(7*width/100), height/3+height/50);
      line(width/2+width/7-(7*width/100), height/3, width/2+width/7-(7*width/100), height/3+height/50);
        line(width/2-width/7+(8*width/100), height/3, width/2-width/7+(8*width/100), height/3+height/50);
      line(width/2+width/7-(8*width/100), height/3, width/2+width/7-(8*width/100), height/3+height/50);
    
     line(width/2-width/7+(9*width/100), height/3, width/2-width/7+(9*width/100), height/3+height/50);
      line(width/2+width/7-(9*width/100), height/3, width/2+width/7-(9*width/100), height/3+height/50);
     line(width/2-width/7+(10*width/100), height/3, width/2-width/7+(10*width/100), height/3+height/50);
      line(width/2+width/7-(10*width/100), height/3, width/2+width/7-(10*width/100), height/3+height/50);
     line(width/2-width/7+(11*width/100), height/3, width/2-width/7+(11*width/100), height/3+height/50);
      line(width/2+width/7-(11*width/100), height/3, width/2+width/7-(11*width/100), height/3+height/50);
     line(width/2-width/7+(12*width/100), height/3, width/2-width/7+(12*width/100), height/3+height/50);
      line(width/2+width/7-(12*width/100), height/3, width/2+width/7-(12*width/100), height/3+height/50);
     line(width/2-width/7+(13*width/100), height/3, width/2-width/7+(13*width/100), height/3+height/50);
      line(width/2+width/7-(13*width/100), height/3, width/2+width/7-(13*width/100), height/3+height/50);
    line(width/2, height/3, width/2, height/3+height/50);}
      
      
      else if (colTone>.4){
        
             //ladder (back)
        if (frontback<.5){
          strokeWeight(width/600);
    stroke("#EF7D42")
      line(ladder1-width/100, (height*3.9/5)-(height/3.45/2), ladder1-width/100, height/3);
       line(ladder2+width/100, (height*3.9/5)-(height/3.45/2), ladder2+width/100, height/3);
      line(ladder1-width/100, height/2, ladder2+width/100, height/2);
  line(ladder1-width/100, height/2, ladder2+width/100, height/2);
          line(ladder1-width/100, height/2+(height/100*12), ladder2+width/100, height/2+(height/100*12));
       line(ladder1-width/100, height/2+(height/100*11), ladder2+width/100, height/2+(height/100*11));
      line(ladder1-width/100, height/2+(height/100*10), ladder2+width/100, height/2+(height/100*10));
      line(ladder1-width/100, height/2+(height/100*9), ladder2+width/100, height/2+(height/100*9));
      line(ladder1-width/100, height/2+(height/100*8), ladder2+width/100, height/2+(height/100*8));
       line(ladder1-width/100, height/2+(height/100*7), ladder2+width/100, height/2+(height/100*7));
      line(ladder1-width/100, height/2+(height/100*6), ladder2+width/100, height/2+(height/100*6));
      line(ladder1-width/100, height/2+(height/100*5), ladder2+width/100, height/2+(height/100*5));
      line(ladder1-width/100, height/2+(height/100*4), ladder2+width/100, height/2+(height/100*4));
      line(ladder1-width/100, height/2+(height/100*3), ladder2+width/100, height/2+(height/100*3));
       line(ladder1-width/100, height/2+(height/100*2), ladder2+width/100, height/2+(height/100*2));
       line(ladder1-width/100, height/2+height/100, ladder2+width/100, height/2+height/100);
   line(ladder1-width/100, height/2, ladder2, height/2);
       line(ladder1-width/100, height/2-(height/100*16), ladder2+width/100, height/2-(height/100*16));
       line(ladder1-width/100, height/2-(height/100*15), ladder2+width/100, height/2-(height/100*15));
       line(ladder1-width/100, height/2-(height/100*14), ladder2+width/100, height/2-(height/100*14));
       line(ladder1-width/100, height/2-(height/100*13), ladder2+width/100, height/2-(height/100*13));
        line(ladder1-width/100, height/2-(height/100*12), ladder2+width/100, height/2-(height/100*12));
       line(ladder1-width/100, height/2-(height/100*11), ladder2+width/100, height/2-(height/100*11));
      line(ladder1-width/100, height/2-(height/100*10), ladder2+width/100, height/2-(height/100*10));
      line(ladder1-width/100, height/2-(height/100*9), ladder2+width/100, height/2-(height/100*9));
      line(ladder1-width/100, height/2-(height/100*8), ladder2+width/100, height/2-(height/100*8));
       line(ladder1-width/100, height/2-(height/100*7), ladder2+width/100, height/2-(height/100*7));
      line(ladder1-width/100, height/2-(height/100*6), ladder2+width/100, height/2-(height/100*6));
      line(ladder1-width/100, height/2-(height/100*5), ladder2+width/100, height/2-(height/100*5));
      line(ladder1-width/100, height/2-(height/100*4), ladder2+width/100, height/2-(height/100*4));
      line(ladder1-width/100, height/2-(height/100*3), ladder2+width/100, height/2-(height/100*3));
       line(ladder1-width/100, height/2-(height/100*2), ladder2+width/100, height/2-(height/100*2));
       line(ladder1-width/100, height/2-height/100, ladder2+width/100, height/2-height/100);}
        
      noStroke();  
         fill("#D65D42")
          rect(width/2, height/2, width/50, height/3);
    rect(width/2+width/10, height/2, width/150, height/3);
   rect(width/2-width/10, height/2, width/150, height/3);
          fill("#E97452")
       ellipse(width/2, height/2-height/6, width/4, height/8);  
      fill("#D65D42")
      
      rect(width/2, height/2-height/5, width/4,height/8);
  fill("#9E1711")
      
      
      rect(width/2-width/24, height/2-height/5, width/6,height/8);
  
        fill("#B12E21")
      
      rect(width/2-width/36, height/2-height/5, width/12,height/8);
     fill ("#C34632");
      
      rect(width/2-width/96, height/2-height/5, width/12,height/8);
          
      fill ("#D65D42");
         rect(width/2+width/48, height/2-height/5, width/12,height/8);
      
      
      
              strokeWeight(width/200);
    stroke("#D65D42")
    line(width/2, height/2, width/2+width/10, height/2+height/10);
    line(width/2, height/2, width/2-width/10, height/2+height/10);
    line(width/2, height/2, width/2+width/10, height/2-height/10);
    line(width/2, height/2, width/2-width/10, height/2-height/10);
    line(width/2+width/10, height/2+height/10, width/2-width/10, height/2+height/10);
    line(width/2+width/10, height/2-height/10, width/2-width/10, height/2-height/10);
    line(width/2-width/10, height/2, width/2+width/10, height/2);
         noStroke();
      
        
          //ladder (front)
        if (frontback>.5){
          strokeWeight(width/600);
    stroke("#EF7D42")
      line(ladder1-width/100, (height*3.9/5)-(height/3.45/2), ladder1-width/100, height/3);
       line(ladder2+width/100, (height*3.9/5)-(height/3.45/2), ladder2+width/100, height/3);
      line(ladder1-width/100, height/2, ladder2+width/100, height/2);
  line(ladder1-width/100, height/2, ladder2+width/100, height/2);
          line(ladder1-width/100, height/2+(height/100*12), ladder2+width/100, height/2+(height/100*12));
       line(ladder1-width/100, height/2+(height/100*11), ladder2+width/100, height/2+(height/100*11));
      line(ladder1-width/100, height/2+(height/100*10), ladder2+width/100, height/2+(height/100*10));
      line(ladder1-width/100, height/2+(height/100*9), ladder2+width/100, height/2+(height/100*9));
      line(ladder1-width/100, height/2+(height/100*8), ladder2+width/100, height/2+(height/100*8));
       line(ladder1-width/100, height/2+(height/100*7), ladder2+width/100, height/2+(height/100*7));
      line(ladder1-width/100, height/2+(height/100*6), ladder2+width/100, height/2+(height/100*6));
      line(ladder1-width/100, height/2+(height/100*5), ladder2+width/100, height/2+(height/100*5));
      line(ladder1-width/100, height/2+(height/100*4), ladder2+width/100, height/2+(height/100*4));
      line(ladder1-width/100, height/2+(height/100*3), ladder2+width/100, height/2+(height/100*3));
       line(ladder1-width/100, height/2+(height/100*2), ladder2+width/100, height/2+(height/100*2));
       line(ladder1-width/100, height/2+height/100, ladder2+width/100, height/2+height/100);
   line(ladder1-width/100, height/2, ladder2, height/2);
       line(ladder1-width/100, height/2-(height/100*16), ladder2+width/100, height/2-(height/100*16));
       line(ladder1-width/100, height/2-(height/100*15), ladder2+width/100, height/2-(height/100*15));
       line(ladder1-width/100, height/2-(height/100*14), ladder2+width/100, height/2-(height/100*14));
       line(ladder1-width/100, height/2-(height/100*13), ladder2+width/100, height/2-(height/100*13));
        line(ladder1-width/100, height/2-(height/100*12), ladder2+width/100, height/2-(height/100*12));
       line(ladder1-width/100, height/2-(height/100*11), ladder2+width/100, height/2-(height/100*11));
      line(ladder1-width/100, height/2-(height/100*10), ladder2+width/100, height/2-(height/100*10));
      line(ladder1-width/100, height/2-(height/100*9), ladder2+width/100, height/2-(height/100*9));
      line(ladder1-width/100, height/2-(height/100*8), ladder2+width/100, height/2-(height/100*8));
       line(ladder1-width/100, height/2-(height/100*7), ladder2+width/100, height/2-(height/100*7));
      line(ladder1-width/100, height/2-(height/100*6), ladder2+width/100, height/2-(height/100*6));
      line(ladder1-width/100, height/2-(height/100*5), ladder2+width/100, height/2-(height/100*5));
      line(ladder1-width/100, height/2-(height/100*4), ladder2+width/100, height/2-(height/100*4));
      line(ladder1-width/100, height/2-(height/100*3), ladder2+width/100, height/2-(height/100*3));
       line(ladder1-width/100, height/2-(height/100*2), ladder2+width/100, height/2-(height/100*2));
       line(ladder1-width/100, height/2-height/100, ladder2+width/100, height/2-height/100);}
        
           //walkway
      
      strokeWeight(width/600);
    stroke("#EF7D42")
      line(width/2-width/7, height/3, width/2+width/7, height/3);
      line(width/2-width/7, height/3+height/50, width/2+width/7, height/3+height/50);
       strokeWeight(width/800);
       
        
    line(width/2-width/7, height/3, width/2-width/7, height/3+height/50);
      line(width/2+width/7, height/3, width/2+width/7, height/3+height/50);
       line(width/2-width/7+(1*width/100), height/3, width/2-width/7+(1*width/100), height/3+height/50);
      line(width/2+width/7-(1*width/100), height/3, width/2+width/7-(1*width/100), height/3+height/50);
       line(width/2-width/7+(2*width/100), height/3, width/2-width/7+(2*width/100), height/3+height/50);
      line(width/2+width/7-(2*width/100), height/3, width/2+width/7-(2*width/100), height/3+height/50);
          line(width/2-width/7+(3*width/100), height/3, width/2-width/7+(3*width/100), height/3+height/50);
      line(width/2+width/7-(3*width/100), height/3, width/2+width/7-(3*width/100), height/3+height/50);
          line(width/2-width/7+(4*width/100), height/3, width/2-width/7+(4*width/100), height/3+height/50);
      line(width/2+width/7-(4*width/100), height/3, width/2+width/7-(4*width/100), height/3+height/50);
          line(width/2-width/7+(5*width/100), height/3, width/2-width/7+(5*width/100), height/3+height/50);
      line(width/2+width/7-(5*width/100), height/3, width/2+width/7-(5*width/100), height/3+height/50);
        line(width/2-width/7+(6*width/100), height/3, width/2-width/7+(6*width/100), height/3+height/50);
      line(width/2+width/7-(6*width/100), height/3, width/2+width/7-(6*width/100), height/3+height/50);
        line(width/2-width/7+(7*width/100), height/3, width/2-width/7+(7*width/100), height/3+height/50);
      line(width/2+width/7-(7*width/100), height/3, width/2+width/7-(7*width/100), height/3+height/50);
        line(width/2-width/7+(8*width/100), height/3, width/2-width/7+(8*width/100), height/3+height/50);
      line(width/2+width/7-(8*width/100), height/3, width/2+width/7-(8*width/100), height/3+height/50);
    
     line(width/2-width/7+(9*width/100), height/3, width/2-width/7+(9*width/100), height/3+height/50);
      line(width/2+width/7-(9*width/100), height/3, width/2+width/7-(9*width/100), height/3+height/50);
     line(width/2-width/7+(10*width/100), height/3, width/2-width/7+(10*width/100), height/3+height/50);
      line(width/2+width/7-(10*width/100), height/3, width/2+width/7-(10*width/100), height/3+height/50);
     line(width/2-width/7+(11*width/100), height/3, width/2-width/7+(11*width/100), height/3+height/50);
      line(width/2+width/7-(11*width/100), height/3, width/2+width/7-(11*width/100), height/3+height/50);
     line(width/2-width/7+(12*width/100), height/3, width/2-width/7+(12*width/100), height/3+height/50);
      line(width/2+width/7-(12*width/100), height/3, width/2+width/7-(12*width/100), height/3+height/50);
     line(width/2-width/7+(13*width/100), height/3, width/2-width/7+(13*width/100), height/3+height/50);
      line(width/2+width/7-(13*width/100), height/3, width/2+width/7-(13*width/100), height/3+height/50);
    line(width/2, height/3, width/2, height/3+height/50);
      
      }
    
    
     else if (colTone>.2){
       
            //ladder (back)
       
        if (frontback<.5){
          strokeWeight(width/600);
    stroke("#DFA60D")
      line(ladder1-width/100, (height*3.9/5)-(height/3.45/2), ladder1-width/100, height/3);
       line(ladder2+width/100, (height*3.9/5)-(height/3.45/2), ladder2+width/100, height/3);
      line(ladder1-width/100, height/2, ladder2+width/100, height/2);
  line(ladder1-width/100, height/2, ladder2+width/100, height/2);
          line(ladder1-width/100, height/2+(height/100*12), ladder2+width/100, height/2+(height/100*12));
       line(ladder1-width/100, height/2+(height/100*11), ladder2+width/100, height/2+(height/100*11));
      line(ladder1-width/100, height/2+(height/100*10), ladder2+width/100, height/2+(height/100*10));
      line(ladder1-width/100, height/2+(height/100*9), ladder2+width/100, height/2+(height/100*9));
      line(ladder1-width/100, height/2+(height/100*8), ladder2+width/100, height/2+(height/100*8));
       line(ladder1-width/100, height/2+(height/100*7), ladder2+width/100, height/2+(height/100*7));
      line(ladder1-width/100, height/2+(height/100*6), ladder2+width/100, height/2+(height/100*6));
      line(ladder1-width/100, height/2+(height/100*5), ladder2+width/100, height/2+(height/100*5));
      line(ladder1-width/100, height/2+(height/100*4), ladder2+width/100, height/2+(height/100*4));
      line(ladder1-width/100, height/2+(height/100*3), ladder2+width/100, height/2+(height/100*3));
       line(ladder1-width/100, height/2+(height/100*2), ladder2+width/100, height/2+(height/100*2));
       line(ladder1-width/100, height/2+height/100, ladder2+width/100, height/2+height/100);
   line(ladder1-width/100, height/2, ladder2, height/2);
       line(ladder1-width/100, height/2-(height/100*16), ladder2+width/100, height/2-(height/100*16));
       line(ladder1-width/100, height/2-(height/100*15), ladder2+width/100, height/2-(height/100*15));
       line(ladder1-width/100, height/2-(height/100*14), ladder2+width/100, height/2-(height/100*14));
       line(ladder1-width/100, height/2-(height/100*13), ladder2+width/100, height/2-(height/100*13));
        line(ladder1-width/100, height/2-(height/100*12), ladder2+width/100, height/2-(height/100*12));
       line(ladder1-width/100, height/2-(height/100*11), ladder2+width/100, height/2-(height/100*11));
      line(ladder1-width/100, height/2-(height/100*10), ladder2+width/100, height/2-(height/100*10));
      line(ladder1-width/100, height/2-(height/100*9), ladder2+width/100, height/2-(height/100*9));
      line(ladder1-width/100, height/2-(height/100*8), ladder2+width/100, height/2-(height/100*8));
       line(ladder1-width/100, height/2-(height/100*7), ladder2+width/100, height/2-(height/100*7));
      line(ladder1-width/100, height/2-(height/100*6), ladder2+width/100, height/2-(height/100*6));
      line(ladder1-width/100, height/2-(height/100*5), ladder2+width/100, height/2-(height/100*5));
      line(ladder1-width/100, height/2-(height/100*4), ladder2+width/100, height/2-(height/100*4));
      line(ladder1-width/100, height/2-(height/100*3), ladder2+width/100, height/2-(height/100*3));
       line(ladder1-width/100, height/2-(height/100*2), ladder2+width/100, height/2-(height/100*2));
       line(ladder1-width/100, height/2-height/100, ladder2+width/100, height/2-height/100);}
      noStroke();  
         fill("#CE910A")
          rect(width/2, height/2, width/50, height/3);
    rect(width/2+width/10, height/2, width/150, height/3);
   rect(width/2-width/10, height/2, width/150, height/3);
          fill("#CE910A")
       ellipse(width/2, height/2-height/6, width/4, height/8);  
      fill("#C1860D")
      
      rect(width/2, height/2-height/5, width/4,height/8);
  fill("#C1860D")
      
      
      rect(width/2-width/24, height/2-height/5, width/6,height/8);
  
        fill("#B57C0F")
      
      rect(width/2-width/36, height/2-height/5, width/12,height/8);
     fill ("#A87112");
      
      rect(width/2-width/96, height/2-height/5, width/12,height/8);
          
      fill ("#9C6715");
         rect(width/2+width/48, height/2-height/5, width/12,height/8);
      
      
      
              strokeWeight(width/200);
    stroke("#CE910A")
    line(width/2, height/2, width/2+width/10, height/2+height/10);
    line(width/2, height/2, width/2-width/10, height/2+height/10);
    line(width/2, height/2, width/2+width/10, height/2-height/10);
    line(width/2, height/2, width/2-width/10, height/2-height/10);
    line(width/2+width/10, height/2+height/10, width/2-width/10, height/2+height/10);
    line(width/2+width/10, height/2-height/10, width/2-width/10, height/2-height/10);
    line(width/2-width/10, height/2, width/2+width/10, height/2);
         noStroke();
  
   
              //ladder (front)
        if (frontback>.5){
          strokeWeight(width/600);
    stroke("#DFA60D")
      line(ladder1-width/100, (height*3.9/5)-(height/3.45/2), ladder1-width/100, height/3);
       line(ladder2+width/100, (height*3.9/5)-(height/3.45/2), ladder2+width/100, height/3);
      line(ladder1-width/100, height/2, ladder2+width/100, height/2);
  line(ladder1-width/100, height/2, ladder2+width/100, height/2);
          line(ladder1-width/100, height/2+(height/100*12), ladder2+width/100, height/2+(height/100*12));
       line(ladder1-width/100, height/2+(height/100*11), ladder2+width/100, height/2+(height/100*11));
      line(ladder1-width/100, height/2+(height/100*10), ladder2+width/100, height/2+(height/100*10));
      line(ladder1-width/100, height/2+(height/100*9), ladder2+width/100, height/2+(height/100*9));
      line(ladder1-width/100, height/2+(height/100*8), ladder2+width/100, height/2+(height/100*8));
       line(ladder1-width/100, height/2+(height/100*7), ladder2+width/100, height/2+(height/100*7));
      line(ladder1-width/100, height/2+(height/100*6), ladder2+width/100, height/2+(height/100*6));
      line(ladder1-width/100, height/2+(height/100*5), ladder2+width/100, height/2+(height/100*5));
      line(ladder1-width/100, height/2+(height/100*4), ladder2+width/100, height/2+(height/100*4));
      line(ladder1-width/100, height/2+(height/100*3), ladder2+width/100, height/2+(height/100*3));
       line(ladder1-width/100, height/2+(height/100*2), ladder2+width/100, height/2+(height/100*2));
       line(ladder1-width/100, height/2+height/100, ladder2+width/100, height/2+height/100);
   line(ladder1-width/100, height/2, ladder2, height/2);
       line(ladder1-width/100, height/2-(height/100*16), ladder2+width/100, height/2-(height/100*16));
       line(ladder1-width/100, height/2-(height/100*15), ladder2+width/100, height/2-(height/100*15));
       line(ladder1-width/100, height/2-(height/100*14), ladder2+width/100, height/2-(height/100*14));
       line(ladder1-width/100, height/2-(height/100*13), ladder2+width/100, height/2-(height/100*13));
        line(ladder1-width/100, height/2-(height/100*12), ladder2+width/100, height/2-(height/100*12));
       line(ladder1-width/100, height/2-(height/100*11), ladder2+width/100, height/2-(height/100*11));
      line(ladder1-width/100, height/2-(height/100*10), ladder2+width/100, height/2-(height/100*10));
      line(ladder1-width/100, height/2-(height/100*9), ladder2+width/100, height/2-(height/100*9));
      line(ladder1-width/100, height/2-(height/100*8), ladder2+width/100, height/2-(height/100*8));
       line(ladder1-width/100, height/2-(height/100*7), ladder2+width/100, height/2-(height/100*7));
      line(ladder1-width/100, height/2-(height/100*6), ladder2+width/100, height/2-(height/100*6));
      line(ladder1-width/100, height/2-(height/100*5), ladder2+width/100, height/2-(height/100*5));
      line(ladder1-width/100, height/2-(height/100*4), ladder2+width/100, height/2-(height/100*4));
      line(ladder1-width/100, height/2-(height/100*3), ladder2+width/100, height/2-(height/100*3));
       line(ladder1-width/100, height/2-(height/100*2), ladder2+width/100, height/2-(height/100*2));
       line(ladder1-width/100, height/2-height/100, ladder2+width/100, height/2-height/100);}
        
           //walkway
      
      strokeWeight(width/600);
    stroke("#DFA60D")
      line(width/2-width/7, height/3, width/2+width/7, height/3);
      line(width/2-width/7, height/3+height/50, width/2+width/7, height/3+height/50);
       strokeWeight(width/800);
       
        
    line(width/2-width/7, height/3, width/2-width/7, height/3+height/50);
      line(width/2+width/7, height/3, width/2+width/7, height/3+height/50);
       line(width/2-width/7+(1*width/100), height/3, width/2-width/7+(1*width/100), height/3+height/50);
      line(width/2+width/7-(1*width/100), height/3, width/2+width/7-(1*width/100), height/3+height/50);
       line(width/2-width/7+(2*width/100), height/3, width/2-width/7+(2*width/100), height/3+height/50);
      line(width/2+width/7-(2*width/100), height/3, width/2+width/7-(2*width/100), height/3+height/50);
          line(width/2-width/7+(3*width/100), height/3, width/2-width/7+(3*width/100), height/3+height/50);
      line(width/2+width/7-(3*width/100), height/3, width/2+width/7-(3*width/100), height/3+height/50);
          line(width/2-width/7+(4*width/100), height/3, width/2-width/7+(4*width/100), height/3+height/50);
      line(width/2+width/7-(4*width/100), height/3, width/2+width/7-(4*width/100), height/3+height/50);
          line(width/2-width/7+(5*width/100), height/3, width/2-width/7+(5*width/100), height/3+height/50);
      line(width/2+width/7-(5*width/100), height/3, width/2+width/7-(5*width/100), height/3+height/50);
        line(width/2-width/7+(6*width/100), height/3, width/2-width/7+(6*width/100), height/3+height/50);
      line(width/2+width/7-(6*width/100), height/3, width/2+width/7-(6*width/100), height/3+height/50);
        line(width/2-width/7+(7*width/100), height/3, width/2-width/7+(7*width/100), height/3+height/50);
      line(width/2+width/7-(7*width/100), height/3, width/2+width/7-(7*width/100), height/3+height/50);
        line(width/2-width/7+(8*width/100), height/3, width/2-width/7+(8*width/100), height/3+height/50);
      line(width/2+width/7-(8*width/100), height/3, width/2+width/7-(8*width/100), height/3+height/50);
    
     line(width/2-width/7+(9*width/100), height/3, width/2-width/7+(9*width/100), height/3+height/50);
      line(width/2+width/7-(9*width/100), height/3, width/2+width/7-(9*width/100), height/3+height/50);
     line(width/2-width/7+(10*width/100), height/3, width/2-width/7+(10*width/100), height/3+height/50);
      line(width/2+width/7-(10*width/100), height/3, width/2+width/7-(10*width/100), height/3+height/50);
     line(width/2-width/7+(11*width/100), height/3, width/2-width/7+(11*width/100), height/3+height/50);
      line(width/2+width/7-(11*width/100), height/3, width/2+width/7-(11*width/100), height/3+height/50);
     line(width/2-width/7+(12*width/100), height/3, width/2-width/7+(12*width/100), height/3+height/50);
      line(width/2+width/7-(12*width/100), height/3, width/2+width/7-(12*width/100), height/3+height/50);
     line(width/2-width/7+(13*width/100), height/3, width/2-width/7+(13*width/100), height/3+height/50);
      line(width/2+width/7-(13*width/100), height/3, width/2+width/7-(13*width/100), height/3+height/50);
    line(width/2, height/3, width/2, height/3+height/50);
      
      }
    
    
      
      else {
        
                //ladder (back)
        if (frontback<.5){
          strokeWeight(width/600);
    stroke("azure")
      line(ladder1-width/100, (height*3.9/5)-(height/3.45/2), ladder1-width/100, height/3);
       line(ladder2+width/100, (height*3.9/5)-(height/3.45/2), ladder2+width/100, height/3);
      line(ladder1-width/100, height/2, ladder2+width/100, height/2);
  line(ladder1-width/100, height/2, ladder2+width/100, height/2);
          line(ladder1-width/100, height/2+(height/100*12), ladder2+width/100, height/2+(height/100*12));
       line(ladder1-width/100, height/2+(height/100*11), ladder2+width/100, height/2+(height/100*11));
      line(ladder1-width/100, height/2+(height/100*10), ladder2+width/100, height/2+(height/100*10));
      line(ladder1-width/100, height/2+(height/100*9), ladder2+width/100, height/2+(height/100*9));
      line(ladder1-width/100, height/2+(height/100*8), ladder2+width/100, height/2+(height/100*8));
       line(ladder1-width/100, height/2+(height/100*7), ladder2+width/100, height/2+(height/100*7));
      line(ladder1-width/100, height/2+(height/100*6), ladder2+width/100, height/2+(height/100*6));
      line(ladder1-width/100, height/2+(height/100*5), ladder2+width/100, height/2+(height/100*5));
      line(ladder1-width/100, height/2+(height/100*4), ladder2+width/100, height/2+(height/100*4));
      line(ladder1-width/100, height/2+(height/100*3), ladder2+width/100, height/2+(height/100*3));
       line(ladder1-width/100, height/2+(height/100*2), ladder2+width/100, height/2+(height/100*2));
       line(ladder1-width/100, height/2+height/100, ladder2+width/100, height/2+height/100);
   line(ladder1-width/100, height/2, ladder2, height/2);
       line(ladder1-width/100, height/2-(height/100*16), ladder2+width/100, height/2-(height/100*16));
       line(ladder1-width/100, height/2-(height/100*15), ladder2+width/100, height/2-(height/100*15));
       line(ladder1-width/100, height/2-(height/100*14), ladder2+width/100, height/2-(height/100*14));
       line(ladder1-width/100, height/2-(height/100*13), ladder2+width/100, height/2-(height/100*13));
        line(ladder1-width/100, height/2-(height/100*12), ladder2+width/100, height/2-(height/100*12));
       line(ladder1-width/100, height/2-(height/100*11), ladder2+width/100, height/2-(height/100*11));
      line(ladder1-width/100, height/2-(height/100*10), ladder2+width/100, height/2-(height/100*10));
      line(ladder1-width/100, height/2-(height/100*9), ladder2+width/100, height/2-(height/100*9));
      line(ladder1-width/100, height/2-(height/100*8), ladder2+width/100, height/2-(height/100*8));
       line(ladder1-width/100, height/2-(height/100*7), ladder2+width/100, height/2-(height/100*7));
      line(ladder1-width/100, height/2-(height/100*6), ladder2+width/100, height/2-(height/100*6));
      line(ladder1-width/100, height/2-(height/100*5), ladder2+width/100, height/2-(height/100*5));
      line(ladder1-width/100, height/2-(height/100*4), ladder2+width/100, height/2-(height/100*4));
      line(ladder1-width/100, height/2-(height/100*3), ladder2+width/100, height/2-(height/100*3));
       line(ladder1-width/100, height/2-(height/100*2), ladder2+width/100, height/2-(height/100*2));
       line(ladder1-width/100, height/2-height/100, ladder2+width/100, height/2-height/100);}
      noStroke();  
         fill("azure")
      rect(width/2, height/2, width/50, height/3);
    rect(width/2+width/10, height/2, width/150, height/3);
   rect(width/2-width/10, height/2, width/150, height/3);
          fill("azure")
      ellipse(width/2, height/2-height/6, width/4, height/8); 
      fill("#9FBFF5")
      
      rect(width/2, height/2-height/5, width/4,height/8);
  fill("#5985D0")
      
      
      rect(width/2-width/24, height/2-height/5, width/12,height/8);
  
        fill("#6A96E1")
      
      rect(width/2-width/36, height/2-height/5, width/12,height/8);
     fill ("#81A9EE");
      
      rect(width/2-width/96, height/2-height/5, width/12,height/8);
          
      fill ("#9FBFF5");
         rect(width/2+width/48, height/2-height/5, width/12,height/8);
      
       fill("azure")
      
      
      rect(width/2, height/2-height/5, width/4,height/16);
      
              strokeWeight(width/400);
    stroke("white")
    line(width/2, height/2, width/2+width/10, height/2+height/10);
    line(width/2, height/2, width/2-width/10, height/2+height/10);
    line(width/2, height/2, width/2+width/10, height/2-height/10);
    line(width/2, height/2, width/2-width/10, height/2-height/10);
    line(width/2+width/10, height/2+height/10, width/2-width/10, height/2+height/10);
    line(width/2+width/10, height/2-height/10, width/2-width/10, height/2-height/10);
    line(width/2-width/10, height/2, width/2+width/10, height/2);
         noStroke();
   
        
               //ladder (front)
        if (frontback>.5){
          strokeWeight(width/600);
    stroke("azure")
      line(ladder1-width/100, (height*3.9/5)-(height/3.45/2), ladder1-width/100, height/3);
       line(ladder2+width/100, (height*3.9/5)-(height/3.45/2), ladder2+width/100, height/3);
      line(ladder1-width/100, height/2, ladder2+width/100, height/2);
  line(ladder1-width/100, height/2, ladder2+width/100, height/2);
          line(ladder1-width/100, height/2+(height/100*12), ladder2+width/100, height/2+(height/100*12));
       line(ladder1-width/100, height/2+(height/100*11), ladder2+width/100, height/2+(height/100*11));
      line(ladder1-width/100, height/2+(height/100*10), ladder2+width/100, height/2+(height/100*10));
      line(ladder1-width/100, height/2+(height/100*9), ladder2+width/100, height/2+(height/100*9));
      line(ladder1-width/100, height/2+(height/100*8), ladder2+width/100, height/2+(height/100*8));
       line(ladder1-width/100, height/2+(height/100*7), ladder2+width/100, height/2+(height/100*7));
      line(ladder1-width/100, height/2+(height/100*6), ladder2+width/100, height/2+(height/100*6));
      line(ladder1-width/100, height/2+(height/100*5), ladder2+width/100, height/2+(height/100*5));
      line(ladder1-width/100, height/2+(height/100*4), ladder2+width/100, height/2+(height/100*4));
      line(ladder1-width/100, height/2+(height/100*3), ladder2+width/100, height/2+(height/100*3));
       line(ladder1-width/100, height/2+(height/100*2), ladder2+width/100, height/2+(height/100*2));
       line(ladder1-width/100, height/2+height/100, ladder2+width/100, height/2+height/100);
   line(ladder1-width/100, height/2, ladder2, height/2);
       line(ladder1-width/100, height/2-(height/100*16), ladder2+width/100, height/2-(height/100*16));
       line(ladder1-width/100, height/2-(height/100*15), ladder2+width/100, height/2-(height/100*15));
       line(ladder1-width/100, height/2-(height/100*14), ladder2+width/100, height/2-(height/100*14));
       line(ladder1-width/100, height/2-(height/100*13), ladder2+width/100, height/2-(height/100*13));
        line(ladder1-width/100, height/2-(height/100*12), ladder2+width/100, height/2-(height/100*12));
       line(ladder1-width/100, height/2-(height/100*11), ladder2+width/100, height/2-(height/100*11));
      line(ladder1-width/100, height/2-(height/100*10), ladder2+width/100, height/2-(height/100*10));
      line(ladder1-width/100, height/2-(height/100*9), ladder2+width/100, height/2-(height/100*9));
      line(ladder1-width/100, height/2-(height/100*8), ladder2+width/100, height/2-(height/100*8));
       line(ladder1-width/100, height/2-(height/100*7), ladder2+width/100, height/2-(height/100*7));
      line(ladder1-width/100, height/2-(height/100*6), ladder2+width/100, height/2-(height/100*6));
      line(ladder1-width/100, height/2-(height/100*5), ladder2+width/100, height/2-(height/100*5));
      line(ladder1-width/100, height/2-(height/100*4), ladder2+width/100, height/2-(height/100*4));
      line(ladder1-width/100, height/2-(height/100*3), ladder2+width/100, height/2-(height/100*3));
       line(ladder1-width/100, height/2-(height/100*2), ladder2+width/100, height/2-(height/100*2));
       line(ladder1-width/100, height/2-height/100, ladder2+width/100, height/2-height/100);}
        
           //walkway
      
      strokeWeight(width/600);
    stroke("azure")
      line(width/2-width/7, height/3, width/2+width/7, height/3);
      line(width/2-width/7, height/3+height/50, width/2+width/7, height/3+height/50);
       strokeWeight(width/800);
       
        
    line(width/2-width/7, height/3, width/2-width/7, height/3+height/50);
      line(width/2+width/7, height/3, width/2+width/7, height/3+height/50);
       line(width/2-width/7+(1*width/100), height/3, width/2-width/7+(1*width/100), height/3+height/50);
      line(width/2+width/7-(1*width/100), height/3, width/2+width/7-(1*width/100), height/3+height/50);
       line(width/2-width/7+(2*width/100), height/3, width/2-width/7+(2*width/100), height/3+height/50);
      line(width/2+width/7-(2*width/100), height/3, width/2+width/7-(2*width/100), height/3+height/50);
          line(width/2-width/7+(3*width/100), height/3, width/2-width/7+(3*width/100), height/3+height/50);
      line(width/2+width/7-(3*width/100), height/3, width/2+width/7-(3*width/100), height/3+height/50);
          line(width/2-width/7+(4*width/100), height/3, width/2-width/7+(4*width/100), height/3+height/50);
      line(width/2+width/7-(4*width/100), height/3, width/2+width/7-(4*width/100), height/3+height/50);
          line(width/2-width/7+(5*width/100), height/3, width/2-width/7+(5*width/100), height/3+height/50);
      line(width/2+width/7-(5*width/100), height/3, width/2+width/7-(5*width/100), height/3+height/50);
        line(width/2-width/7+(6*width/100), height/3, width/2-width/7+(6*width/100), height/3+height/50);
      line(width/2+width/7-(6*width/100), height/3, width/2+width/7-(6*width/100), height/3+height/50);
        line(width/2-width/7+(7*width/100), height/3, width/2-width/7+(7*width/100), height/3+height/50);
      line(width/2+width/7-(7*width/100), height/3, width/2+width/7-(7*width/100), height/3+height/50);
        line(width/2-width/7+(8*width/100), height/3, width/2-width/7+(8*width/100), height/3+height/50);
      line(width/2+width/7-(8*width/100), height/3, width/2+width/7-(8*width/100), height/3+height/50);
    
     line(width/2-width/7+(9*width/100), height/3, width/2-width/7+(9*width/100), height/3+height/50);
      line(width/2+width/7-(9*width/100), height/3, width/2+width/7-(9*width/100), height/3+height/50);
     line(width/2-width/7+(10*width/100), height/3, width/2-width/7+(10*width/100), height/3+height/50);
      line(width/2+width/7-(10*width/100), height/3, width/2+width/7-(10*width/100), height/3+height/50);
     line(width/2-width/7+(11*width/100), height/3, width/2-width/7+(11*width/100), height/3+height/50);
      line(width/2+width/7-(11*width/100), height/3, width/2+width/7-(11*width/100), height/3+height/50);
     line(width/2-width/7+(12*width/100), height/3, width/2-width/7+(12*width/100), height/3+height/50);
      line(width/2+width/7-(12*width/100), height/3, width/2+width/7-(12*width/100), height/3+height/50);
     line(width/2-width/7+(13*width/100), height/3, width/2-width/7+(13*width/100), height/3+height/50);
      line(width/2+width/7-(13*width/100), height/3, width/2+width/7-(13*width/100), height/3+height/50);
    line(width/2, height/3, width/2, height/3+height/50);
        
   }
    
  pop();
       //frame
     
     fill("white");
     noStroke();
     rect(width/2, height/16, width/1.11, height/29);
     rect(width/2, 15*height/16, width/1.11, height/29);
     rect(width/16.5, height/2, width/30, height/1.1);
     rect(15.5*width/16.5, height/2, width/30, height/1.1);  
    

  }}
  
   
  
  
   //nothing
     
   if (barn<=.5 && tower<=.5 && gasStation>=.5 && nothing>.95){
     noStroke();
       fill ("#999999")
     rect(width/2, height/1.25, width/32, height/2);
       fill ("#7E7E7E")
     rect(width/2, height/1.25, width/64, height/2);
     if (var1>.35 && var1<.75){
       fill("rgb(208,124,124)");
     rect(width/2, height/2, max(width, height)/2, min(width, height)/4);
    
   //NO   
      stroke("white");
      strokeWeight(min(width, height)/100);
        push();
   translate(min(width,height)*.25/20, 0);
                  line(width/2-min(width, height)/15, height/2-min(width,height)/50, width/2-min(width, height)/15, height/2 - min(width,height)/16);
       line(width/2-min(width, height)/35, height/2-min(width,height)/50, width/2-min(width, height)/35, height/2 - min(width,height)/16);
         line(width/2-min(width, height)/35, height/2-min(width,height)/50, width/2-min(width, height)/15, height/2 - min(width,height)/16);
                    pop();
      push();
   translate(-min(width,height)*.25/20, 0);
        
        line(width/2+min(width, height)/15, height/2-min(width,height)/50, width/2+min(width, height)/15, height/2 - min(width,height)/16);
       line(width/2+min(width, height)/35, height/2-min(width,height)/50, width/2+min(width, height)/35, height/2 - min(width,height)/16);
         line(width/2+min(width, height)/35, height/2-min(width,height)/16, width/2+min(width, height)/15, height/2 - min(width,height)/16);
       line(width/2+min(width, height)/35, height/2-min(width,height)/50, width/2+min(width, height)/15, height/2 - min(width,height)/50);
      pop();
      
      //T
      line(width/2-min(width, height)/5.5, height/2 +min(width,height)/40, width/2-min(width, height)/5.5, height/2 +min(width,height)/15);
    push();
      translate(-min(width,height)*6.925/20, 0);
      line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
       pop();
      
         //R
       push();
      translate(-min(width,height)*5.95/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5)
        line(width/2+min(width, height)/5.5-min(width,height)/100, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
        
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
            //E
       push();
      translate(-min(width,height)*4.925/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
     
          line(width/2+min(width, height)/5.5-min(width, height)/200, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
         line(width/2+min(width, height)/5.5-min(width, height)/200, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
         line(width/2+min(width, height)/5.5-min(width, height)/200, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
           //S
       push();
      translate(-min(width,height)*4/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
      
      //P
       push();
      translate(-min(width,height)*3/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
        
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
      
      //A
       push();
      translate(-min(width,height)*2/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
        
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
      
      //S
       push();
      translate(-min(width,height)/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
      
      //S
         line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
     
      if (fxrand()>.75){ 
        
        //NO   
       stroke("rgb(208,124,124)");
      strokeWeight(min(width, height)/random_num(125,200));
            push();
   translate(min(width,height)*.25/20, 0);
                  line(width/2-min(width, height)/15, height/2-min(width,height)/50, width/2-min(width, height)/15, height/2 - min(width,height)/16);
       line(width/2-min(width, height)/35, height/2-min(width,height)/50, width/2-min(width, height)/35, height/2 - min(width,height)/16);
         line(width/2-min(width, height)/35, height/2-min(width,height)/50, width/2-min(width, height)/15, height/2 - min(width,height)/16);
                         pop();
      push();
   translate(-min(width,height)*.25/20, 0);
                     line(width/2+min(width, height)/15, height/2-min(width,height)/50, width/2+min(width, height)/15, height/2 - min(width,height)/16);
       line(width/2+min(width, height)/35, height/2-min(width,height)/50, width/2+min(width, height)/35, height/2 - min(width,height)/16);
         line(width/2+min(width, height)/35, height/2-min(width,height)/16, width/2+min(width, height)/15, height/2 - min(width,height)/16);
       line(width/2+min(width, height)/35, height/2-min(width,height)/50, width/2+min(width, height)/15, height/2 - min(width,height)/50);
      pop();
      //T
      line(width/2-min(width, height)/5.5, height/2 +min(width,height)/40, width/2-min(width, height)/5.5, height/2 +min(width,height)/15);
    push();
      translate(-min(width,height)*6.925/20, 0);
      line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
       pop();
      
         //R
       push();
      translate(-min(width,height)*5.95/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5)
        line(width/2+min(width, height)/5.5-min(width,height)/100, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
        
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
            //E
       push();
      translate(-min(width,height)*4.925/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
     
          line(width/2+min(width, height)/5.5-min(width, height)/200, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
         line(width/2+min(width, height)/5.5-min(width, height)/200, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
         line(width/2+min(width, height)/5.5-min(width, height)/200, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
           //S
       push();
      translate(-min(width,height)*4/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
      
      //P
       push();
      translate(-min(width,height)*3/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
        
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
      
      //A
       push();
      translate(-min(width,height)*2/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
        
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
      
      //S
       push();
      translate(-min(width,height)/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
      
      //S
         line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);}
     } 
    else {
      fill("rgb(208,124,124)");
     rect(width/2, height/2, max(width, height)/3, min(width, height)/4);
    
   //NO   
      stroke("white");
      strokeWeight(min(width, height)/100);
        push();
   translate(min(width,height)*.25/20, 0);
                  line(width/2-min(width, height)/15, height/2-min(width,height)/50, width/2-min(width, height)/15, height/2 - min(width,height)/16);
       line(width/2-min(width, height)/35, height/2-min(width,height)/50, width/2-min(width, height)/35, height/2 - min(width,height)/16);
         line(width/2-min(width, height)/35, height/2-min(width,height)/50, width/2-min(width, height)/15, height/2 - min(width,height)/16);
                    pop();
      push();
   translate(-min(width,height)*.25/20, 0);
        
        line(width/2+min(width, height)/15, height/2-min(width,height)/50, width/2+min(width, height)/15, height/2 - min(width,height)/16);
       line(width/2+min(width, height)/35, height/2-min(width,height)/50, width/2+min(width, height)/35, height/2 - min(width,height)/16);
         line(width/2+min(width, height)/35, height/2-min(width,height)/16, width/2+min(width, height)/15, height/2 - min(width,height)/16);
       line(width/2+min(width, height)/35, height/2-min(width,height)/50, width/2+min(width, height)/15, height/2 - min(width,height)/50);
      pop();
      
      //T
      line(width/2-min(width, height)/5.5, height/2 +min(width,height)/40, width/2-min(width, height)/5.5, height/2 +min(width,height)/15);
    push();
      translate(-min(width,height)*6.925/20, 0);
      line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
       pop();
      
         //R
       push();
      translate(-min(width,height)*5.95/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5)
        line(width/2+min(width, height)/5.5-min(width,height)/100, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
        
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
            //E
       push();
      translate(-min(width,height)*4.925/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
     
          line(width/2+min(width, height)/5.5-min(width, height)/200, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
         line(width/2+min(width, height)/5.5-min(width, height)/200, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
         line(width/2+min(width, height)/5.5-min(width, height)/200, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
           //S
       push();
      translate(-min(width,height)*4/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
      
      //P
       push();
      translate(-min(width,height)*3/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
        
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
      
      //A
       push();
      translate(-min(width,height)*2/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
        
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
      
      //S
       push();
      translate(-min(width,height)/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
      
      //S
         line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
     
      if (fxrand()>.75){ 
        
        //NO   
      stroke("rgb(208,124,124)");
      strokeWeight(min(width, height)/random_num(125,200));
            push();
   translate(min(width,height)*.25/20, 0);
                  line(width/2-min(width, height)/15, height/2-min(width,height)/50, width/2-min(width, height)/15, height/2 - min(width,height)/16);
       line(width/2-min(width, height)/35, height/2-min(width,height)/50, width/2-min(width, height)/35, height/2 - min(width,height)/16);
         line(width/2-min(width, height)/35, height/2-min(width,height)/50, width/2-min(width, height)/15, height/2 - min(width,height)/16);
                         pop();
      push();
   translate(-min(width,height)*.25/20, 0);
                     line(width/2+min(width, height)/15, height/2-min(width,height)/50, width/2+min(width, height)/15, height/2 - min(width,height)/16);
       line(width/2+min(width, height)/35, height/2-min(width,height)/50, width/2+min(width, height)/35, height/2 - min(width,height)/16);
         line(width/2+min(width, height)/35, height/2-min(width,height)/16, width/2+min(width, height)/15, height/2 - min(width,height)/16);
       line(width/2+min(width, height)/35, height/2-min(width,height)/50, width/2+min(width, height)/15, height/2 - min(width,height)/50);
      pop();
      //T
      line(width/2-min(width, height)/5.5, height/2 +min(width,height)/40, width/2-min(width, height)/5.5, height/2 +min(width,height)/15);
    push();
      translate(-min(width,height)*6.925/20, 0);
      line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
       pop();
      
         //R
       push();
      translate(-min(width,height)*5.95/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5)
        line(width/2+min(width, height)/5.5-min(width,height)/100, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
        
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
            //E
       push();
      translate(-min(width,height)*4.925/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
     
          line(width/2+min(width, height)/5.5-min(width, height)/200, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
         line(width/2+min(width, height)/5.5-min(width, height)/200, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
         line(width/2+min(width, height)/5.5-min(width, height)/200, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
           //S
       push();
      translate(-min(width,height)*4/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
      
      //P
       push();
      translate(-min(width,height)*3/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
        
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
      
      //A
       push();
      translate(-min(width,height)*2/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
        
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
      
      //S
       push();
      translate(-min(width,height)/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
      
      //S
         line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);}
    
    }
     
      for (let o = 1; o < 1000; o++) {
        let o = random_num(0,buffer)
      stroke("snow")
     noFill();
     strokeWeight(.02)
      angleMode(DEGREES)
circle(random_num(-width/2, width+width/2), random_num(-height/2, height+height/2), o);}
  
    for (let o = 1; o < 1000; o++) {
        let o = random_num(0,buffer)
      stroke("white")
     noFill();
     strokeWeight(.02)
      angleMode(DEGREES)
circle(random_num(-width/2, width+width/2), random_num(-height/2, height+height/2), o);}
   }
      

  
  else if (barn<=.5 && tower<=.5 && gasStation>=.5 && nothing>=.9){
       
     noStroke();
       fill ("#999999")
     rect(width/2, height/1.25, width/32, height/2);
       fill ("#7E7E7E")
     rect(width/2, height/1.25, width/64, height/2);
     if (var1>0){
       
       fill("gold");
      beginShape();
       vertex(width/2, height/2-min(width, height)/4.25);
       vertex(width/2-min(width, height)/4.25, height/2);
         vertex(width/2, height/2+min(width, height)/4.25);
       vertex(width/2+min(width, height)/4.25, height/2);
       endShape();
       
       fill("black");
      beginShape();
       vertex(width/2, height/2-min(width, height)/4.5);
       vertex(width/2-min(width, height)/4.5, height/2);
         vertex(width/2, height/2+min(width, height)/4.5);
       vertex(width/2+min(width, height)/4.5, height/2);
       endShape();
       
       fill("gold");
      beginShape();
       vertex(width/2, height/2-min(width, height)/4.75);
       vertex(width/2-min(width, height)/4.75, height/2);
         vertex(width/2, height/2+min(width, height)/4.75);
       vertex(width/2+min(width, height)/4.75, height/2);
       endShape();
       
   //E   
      stroke("black");
      strokeWeight(min(width, height)/100);
        push();
   translate(-min(width,height)*3.85/20, -min(width,height)*1.45/20);
               line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5)
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
                    pop();
  
      
  
           //E
       push();
      translate(-min(width,height)*4.5/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5)
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
      
      //N
       push();
      translate(-min(width,height)*3.25/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
        
      pop();
      
      //A
       push();
      translate(-min(width,height)*2.7/20, -min(width,height)*1.45/20);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/22.5, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/22.5);
        
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
      
         //d
       push();
      translate(-min(width,height)*2/20, 0);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
        
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
       
          //D
       push();
      translate(-min(width,height)*5/20, -min(width,height)*1.45/20);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
        
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();
       
        //D
       push();
      translate(-min(width,height)*1.565/20, -min(width,height)*1.45/20);
        line(width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15)
        line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5, height/2 +min(width,height)/15)
          line(width/2+min(width, height)/5.5, height/2 +min(width,height)/15, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/15);
        
         line(width/2+min(width, height)/5.5, height/2 +min(width,height)/40, width/2+min(width, height)/5.5-min(width, height)/30, height/2 +min(width,height)/40);
      pop();

  
     }
  
      for (let o = 1; o < 1000; o++) {
        let o = random_num(0,buffer)
      stroke("snow")
     noFill();
     strokeWeight(.02)
      angleMode(DEGREES)
circle(random_num(-width/2, width+width/2), random_num(-height/2, height+height/2), o);}
  
    for (let o = 1; o < 1000; o++) {
        let o = random_num(0,buffer)
      stroke("white")
     noFill();
     strokeWeight(.02)
      angleMode(DEGREES)
circle(random_num(-width/2, width+width/2), random_num(-height/2, height+height/2), o);}
   }
  
  
  
  
 if (barn<.5 && tower<.5 && gasStation>.5 && overgrown >.6 && nothing<.9){
  
   push();
   translate(0, random_num(0, min(width,height)/4));
   
   
  //square barn
  barnAngle=fxrand();
   if (var1>=.35 && var1<=.75) {
     barnPeak=height/2-(height/5.5)
      //shadow
 if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6){
      fill ("#103611");}
       else if (sky>.765) {fill ("#474747");}
     else { 
           fill("#777777");}
     noStroke();
    
     quad (width/2+width/7+width/24,height/1.89,width/2+width/7+width/58,height/1.75,width/2-width/7-width/15, height/1.75, width/2-width/7-width/24, height/1.89);
     rect(width/2, height/1.85, width/3.5, height/24)
     triangle (width/2+width/7+width/58,height/1.75,width/2-width/7-width/15, height/1.75, width/2-width/15, height/1.7);
      triangle (width/2+width/16+width/58,height/1.75,width/2-width/16-width/15, height/1.75, width/2-width/15, height/1.68);
   
   

   if (barnAngle>.666){
  if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6){
      fill ("#103611");}
       else if (sky>.765) {fill ("#474747");}
     else { 
           fill("#777777");}
     noStroke();
     quad (width/2-width/7-width/18, height/1.75, width/2-width/7-width/28, height/1.9, width/2-width/3.3-width/24, height/1.9, width/2-width/3.22-width/15, height/1.75);
     
       if (overgrown>.6 && snowday<.05){fill(240);}
       else {fill("rgb(124,124,124)");}
       quad(width/2, barnPeak-width/300, width/2-width/9.5, barnPeak-width/300, width/2 -width/3.5,barnPeak+width/10, width/2, barnPeak+width/10)
  
     triangle(width/2-width/7-width/24-width/7-width/24,height/2.43, width/2, height/2.45, width/2-width/9, height/2-height/5.65)
     
     if (barnCol>.75){    fill("rgb(149,150,165)"); } else if (barnCol>.2){     fill("rgb(138,37,37)"); } else {     fill("rgb(111,103,103)"); }
     rect(width/2-width/7-width/24, (barnPeak+height/2-height/30+height/16)/2+height/21.75, 1.75*(width/7+width/24), height/8.5)
     rect(width/2, (barnPeak+height/2-height/30+height/16)/2+height/21.75, width/4, height/8.5);}
   
     else if (barnAngle>.333){
      if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6){
      fill ("#103611");}
       else if (sky>.765) {fill ("#474747");}
     else { 
           fill("#777777");}
     noStroke();
     quad (width/2+width/7, height/1.75, width/2+width/7+width/28, height/1.9, width/2+width/3.3+width/24, height/1.9, width/2+width/3.05, height/1.75);
         if (overgrown>.6 && snowday<.05){fill(240);}
       else {fill("rgb(124,124,124)");}
         quad(width/2, barnPeak-width/300, width/2+width/9.5, barnPeak-width/300, width/2 +width/3.5,barnPeak+width/10, width/2, barnPeak+width/10)
  
     triangle(width/2+width/7+width/24+width/7+width/24,height/2.43, width/2, height/2.45, width/2+width/9, height/2-height/5.65)
     
     if (barnCol>.75){    fill("rgb(149,150,165)"); } else if (barnCol>.2){     fill("rgb(138,37,37)"); } else {     fill("rgb(111,103,103)"); }
     rect(width/2+width/7+width/24, (barnPeak+height/2-height/30+height/16)/2+height/21.75, 1.75*(width/7+width/24), height/8.5);
       rect(width/2, (barnPeak+height/2-height/30+height/16)/2+height/21.75, width/4.25, height/8.5);
     
     
     }
     
     
     
      fill("rgb(73,51,48)")
      rect(width/2, height/2-height/35, width/4,height/10);
    if (barnCol>.75){   fill("rgb(178,179,195)"); } else if (barnCol>.2){     fill("rgb(185,83,83)"); } else {     fill("rgb(161,161,161)"); }

       rect(width/2, height/2-height/9, width/10.85,height/15);
      rect(width/2-width/7, height/2-height/30, width/12,height/8);
     rect(width/2+width/7, height/2-height/30, width/12,height/8);
    rect(width/2, height/2-height/15, (width/2+width/16+width/24)-(width/2-width/16-width/24),height/20);
     triangle(width/2, barnPeak, width/2-width/24, height/2-height/7.05, width/2+width/24, height/2-height/7.05);
       triangle(width/2-width/23.9, height/2-height/7.05, width/2-width/23.9, height/2-height/30-height/20, width/2-width/16-width/8.1, height/2 - height/30 - height/16.25);
      triangle(width/2+width/23.9, height/2-height/7.05, width/2+width/23.9, height/2-height/30-height/20, width/2+width/16+width/8.1, height/2 - height/30 - height/16.25);
     
     
     //barn doors
  
       stroke("rgb(220,227,227)")
   strokeWeight(width/250);
   line(width/2+(width/18+width/3.5)/2, height/2-height/22,width/2+(width/18+width/3.5)/2,height/2+height/50);
   line(width/2-(width/18+width/3.5)/2, height/2-height/22,width/2-(width/18+width/3.5)/2,height/2+height/50);
   line(width/2-(width/18+width/3.5)/3, height/2-height/22,width/2-(width/18+width/3.5)/3,height/2+height/50);   
   line(width/2+(width/18+width/3.5)/3, height/2-height/22,width/2+(width/18+width/3.5)/3,height/2+height/50);
    line(width/2+(width/18+width/3.5)/3, height/2+height/50,width/2+(width/18+width/3.5)/2,height/2+height/50);
    line(width/2-(width/18+width/3.5)/3, height/2+height/50,width/2-(width/18+width/3.5)/2,height/2+height/50);
    line(width/2-(width/18+width/3.5)/2, height/2+height/50,width/2-(width/18+width/3.5)/3,height/2-height/22);
       line(width/2+(width/18+width/3.5)/2, height/2+height/50,width/2+(width/18+width/3.5)/3,height/2-height/22);
     line(width/2-(width/18+width/3.5)/3, height/2+height/50,width/2-(width/18+width/3.5)/2,height/2-height/22);
       line(width/2+(width/18+width/3.5)/3, height/2+height/50,width/2+(width/18+width/3.5)/2,height/2-height/22);
     line(width/2+(width/18+width/3.5)/3, height/2+height/50,width/2+(width/18+width/3.5)/2,height/2-height/22);
     line(width/2-(width/18+width/3.5)/3, height/2-height/22,width/2-(width/18+width/3.5)/2,height/2-height/22);
     line(width/2+(width/18+width/3.5)/3, height/2-height/22,width/2+(width/18+width/3.5)/2,height/2-height/22);
     
        //frame add-on 1
     if (framer>.85){
   fill("rgb(220,227,227)")
   rect(width/2-width/24, height/2-height/9, width/200,height/16);
   rect(width/2+width/24, height/2-height/9, width/200,height/16)
   rect(width/2, height/2-height/9+height/32, width/12+width/3.5,width/200);
   rect(width/2, height/2-height/9+height/15.5, width/12+width/3.5,width/200);
   stroke("rgb(220,227,227)")
   strokeWeight(width/250);
   line(width/2, height/2-height/9+height/32, width/2, barnPeak)
   line(width/2-(width/16+width/3.5)/2, height/2-height/9+height/32, width/2-width/24, (height/2-height/9)-height/64);
     line(width/2+(width/16+width/3.5)/2, height/2-height/9+height/32, width/2+width/24, (height/2-height/9)-height/64);}
   
   
   //frame add-on 2
   if (framer>.875){
      stroke("rgb(220,227,227)")
   strokeWeight(width/250);
   line (width/2, height/2-height/9+height/32, width/2, height/2-height/9+height/15.5);}
   
   //frame add-on 3
   if (framer>.9){
      stroke("rgb(220,227,227)")
   strokeWeight(width/250);
    line (width/2-width/24, height/2-height/9+height/32, width/2-width/24, height/2-height/9+height/15.5);
     line (width/2+width/24, height/2-height/9+height/32, width/2+width/24, height/2-height/9+height/15.5);}
   
     //frame add-on 4
   if (framer>.925){
      stroke("rgb(220,227,227)")
   strokeWeight(width/250);
    line (width/2, height/2-height/9+height/32, width/2-width/24, height/2-height/9+height/15.5)
     line (width/2, height/2-height/9+height/32, width/2+width/24, height/2-height/9+height/15.5);}
     
        //barn roof
   
   strokeWeight(width/160)
   stroke("rgb(124,124,124)")
    line(width/2-(width/11+width/3.5)/2, height/2-height/9+height/50, width/2-width/24, (height/2-height/9)-height/32);
   line(width/2+(width/11+width/3.5)/2, height/2-height/9+height/50, width/2+width/24, (height/2-height/9)-height/32);
    line(width/2, barnPeak, width/2+width/24, (height/2-height/9)-height/32);
      line(width/2, barnPeak, width/2-width/24, (height/2-height/9)-height/32);
     
  }
  
  //portrait barn
  
 if (var1<.35) {
       barnAngle=fxrand();
     barnPeak=height/2-(height/5.5);
   
   
       //shadow
  if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6){
      fill ("#103611");}
       else if (sky>.765) {fill ("#474747");}
     else { 
           fill("#777777");}
     noStroke();
     quad (width/2+width/7+width/24,height/1.89,width/2+width/7+width/58,height/1.75,width/2-width/7-width/15, height/1.75, width/2-width/7-width/24, height/1.89);
     rect(width/2, height/1.85, width/3.5, height/24)
     triangle (width/2+width/7+width/58,height/1.75,width/2-width/7-width/15, height/1.75, width/2-width/15, height/1.7);
      triangle (width/2+width/16+width/58,height/1.75,width/2-width/16-width/15, height/1.75, width/2-width/15, height/1.68);
   
   

   if (barnAngle>.666){
   if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6){
      fill ("#103611");}
       else if (sky>.765) {fill ("#474747");}
     else { 
           fill("#777777");}
     noStroke();
     quad (width/2-width/7-width/18, height/1.75, width/2-width/7-width/28, height/1.9, width/2-width/3.3-width/24, height/1.9, width/2-width/3.22-width/15, height/1.75);
     
       if (overgrown>.6 && snowday<.05){fill(240);}
       else {fill("rgb(124,124,124)");}
       quad(width/2, barnPeak-width/300, width/2-width/9.5, barnPeak-width/300, width/2 -width/3.5,barnPeak+width/10, width/2, barnPeak+width/10)
  
     triangle(width/2-width/7-width/24-width/7-width/24,height/2.43, width/2, height/2.45, width/2-width/9, height/2-height/5.65)
     
     if (barnCol>.75){    fill("rgb(149,150,165)"); } else if (barnCol>.2){     fill("rgb(138,37,37)"); } else {     fill("rgb(111,103,103)"); }
     rect(width/2-width/7-width/24, (barnPeak+height/2-height/30+height/16)/2+height/21.75, 1.75*(width/7+width/24), height/8.4)
     rect(width/2, (barnPeak+height/2-height/30+height/16)/2+height/21.75, width/4, height/8.5);}
   
     else if (barnAngle>.333){
    if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6){
      fill ("#103611");}
       else if (sky>.765) {fill ("#474747");}
     else { 
           fill("#777777");}
     noStroke();
     quad (width/2+width/7, height/1.75, width/2+width/7+width/28, height/1.9, width/2+width/3.3+width/24, height/1.9, width/2+width/3.05, height/1.75);
         fill("rgb(124,124,124)")
         quad(width/2, barnPeak-width/300, width/2+width/9.5, barnPeak-width/300, width/2 +width/3.5,barnPeak+width/10, width/2, barnPeak+width/10)
  
     triangle(width/2+width/7+width/24+width/7+width/24,height/2.43, width/2, height/2.45, width/2+width/9, height/2-height/5.65)
     
     if (barnCol>.75){    fill("rgb(149,150,165)"); } else if (barnCol>.2){     fill("rgb(138,37,37)"); } else {     fill("rgb(111,103,103)"); }
     rect(width/2+width/7+width/24, (barnPeak+height/2-height/30+height/16)/2+height/21.75, 1.75*(width/7+width/24), height/8.4);
       rect(width/2, (barnPeak+height/2-height/30+height/16)/2+height/21.75, width/4.25, height/8.5);
     
     
     }
     
     
     
      fill("rgb(73,51,48)")
      rect(width/2, height/2-height/35, width/4,height/10);
    if (barnCol>.75){   fill("rgb(178,179,195)"); } else if (barnCol>.2){     fill("rgb(185,83,83)"); } else {     fill("rgb(161,161,161)"); }

       rect(width/2, height/2-height/9, width/10.85,height/15);
      rect(width/2-width/7, height/2-height/30, width/12,height/8);
     rect(width/2+width/7, height/2-height/30, width/12,height/8);
    rect(width/2, height/2-height/15, (width/2+width/16+width/24)-(width/2-width/16-width/24),height/20);
     triangle(width/2, barnPeak, width/2-width/24, height/2-height/7.05, width/2+width/24, height/2-height/7.05);
       triangle(width/2-width/23.9, height/2-height/7.05, width/2-width/23.9, height/2-height/30-height/20, width/2-width/16-width/8.1, height/2 - height/30 - height/16.25);
      triangle(width/2+width/23.9, height/2-height/7.05, width/2+width/23.9, height/2-height/30-height/20, width/2+width/16+width/8.1, height/2 - height/30 - height/16.25);
     
     
     //barn doors
  
       stroke("rgb(220,227,227)")
   strokeWeight(width/250);
   line(width/2+(width/18+width/3.5)/2, height/2-height/22,width/2+(width/18+width/3.5)/2,height/2+height/50);
   line(width/2-(width/18+width/3.5)/2, height/2-height/22,width/2-(width/18+width/3.5)/2,height/2+height/50);
   line(width/2-(width/18+width/3.5)/3, height/2-height/22,width/2-(width/18+width/3.5)/3,height/2+height/50);   
   line(width/2+(width/18+width/3.5)/3, height/2-height/22,width/2+(width/18+width/3.5)/3,height/2+height/50);
    line(width/2+(width/18+width/3.5)/3, height/2+height/50,width/2+(width/18+width/3.5)/2,height/2+height/50);
    line(width/2-(width/18+width/3.5)/3, height/2+height/50,width/2-(width/18+width/3.5)/2,height/2+height/50);
    line(width/2-(width/18+width/3.5)/2, height/2+height/50,width/2-(width/18+width/3.5)/3,height/2-height/22);
       line(width/2+(width/18+width/3.5)/2, height/2+height/50,width/2+(width/18+width/3.5)/3,height/2-height/22);
     line(width/2-(width/18+width/3.5)/3, height/2+height/50,width/2-(width/18+width/3.5)/2,height/2-height/22);
       line(width/2+(width/18+width/3.5)/3, height/2+height/50,width/2+(width/18+width/3.5)/2,height/2-height/22);
     line(width/2+(width/18+width/3.5)/3, height/2+height/50,width/2+(width/18+width/3.5)/2,height/2-height/22);
     line(width/2-(width/18+width/3.5)/3, height/2-height/22,width/2-(width/18+width/3.5)/2,height/2-height/22);
     line(width/2+(width/18+width/3.5)/3, height/2-height/22,width/2+(width/18+width/3.5)/2,height/2-height/22);
     
        //frame add-on 1
     if (framer>.85){
   fill("rgb(220,227,227)")
   rect(width/2-width/24, height/2-height/9, width/200,height/16);
   rect(width/2+width/24, height/2-height/9, width/200,height/16)
   rect(width/2, height/2-height/9+height/32, width/12+width/3.5,width/200);
   rect(width/2, height/2-height/9+height/15.5, width/12+width/3.5,width/200);
   stroke("rgb(220,227,227)")
   strokeWeight(width/250);
   line(width/2, height/2-height/9+height/32, width/2, barnPeak)
   line(width/2-(width/16+width/3.5)/2, height/2-height/9+height/32, width/2-width/24, (height/2-height/9)-height/64);
     line(width/2+(width/16+width/3.5)/2, height/2-height/9+height/32, width/2+width/24, (height/2-height/9)-height/64);}
   
   
   //frame add-on 2
   if (framer>.875){
      stroke("rgb(220,227,227)")
   strokeWeight(width/250);
   line (width/2, height/2-height/9+height/32, width/2, height/2-height/9+height/15.5);}
   
   //frame add-on 3
   if (framer>.9){
      stroke("rgb(220,227,227)")
   strokeWeight(width/250);
    line (width/2-width/24, height/2-height/9+height/32, width/2-width/24, height/2-height/9+height/15.5);
     line (width/2+width/24, height/2-height/9+height/32, width/2+width/24, height/2-height/9+height/15.5);}
   
     //frame add-on 4
   if (framer>.925){
      stroke("rgb(220,227,227)")
   strokeWeight(width/250);
    line (width/2, height/2-height/9+height/32, width/2-width/24, height/2-height/9+height/15.5)
     line (width/2, height/2-height/9+height/32, width/2+width/24, height/2-height/9+height/15.5);}
     
        //barn roof
   
   strokeWeight(width/150)
   stroke("rgb(124,124,124)")
    line(width/2-(width/11+width/3.5)/2, height/2-height/9+height/50, width/2-width/24, (height/2-height/9)-height/32);
   line(width/2+(width/11+width/3.5)/2, height/2-height/9+height/50, width/2+width/24, (height/2-height/9)-height/32);
    line(width/2, barnPeak, width/2+width/24, (height/2-height/9)-height/32);
      line(width/2, barnPeak, width/2-width/24, (height/2-height/9)-height/32);
  }
  
  
  
  
  //landscape barn
  
 else if (var1>.75) {
       barnAngle=fxrand();
     barnPeak=height/2-(height/5.5);
   
       //shadow
   if (overgrown>.6 && snowday<.049){
  fill(200);}
   else if (overgrown>.6){
      fill ("#103611");}
       else if (sky>.765) {fill ("#474747");}
     else { 
           fill("#777777");}
     noStroke();
     quad (width/2+width/12+width/24,height/1.89,width/2+width/12+width/58,height/1.75,width/2-width/6.5, height/1.75, width/2-width/12-width/24, height/1.89);
     rect(width/2, height/1.85, width/5, height/24)
     triangle (width/2+width/12+width/58,height/1.75,width/2-width/6.5, height/1.75, width/2-width/15, height/1.7);
      triangle (width/2+width/16+width/58,height/1.75,width/2-width/16-width/15, height/1.75, width/2-width/15, height/1.68);
   
   
     

   if (barnAngle>.666){  
    if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6){
      fill ("#103611");}
       else if (sky>.765) {fill ("#474747");}
     else { 
           fill("#777777");}
     noStroke();
     quad (width/2-width/6.55, height/1.75, width/2-width/12-width/28, height/1.9, width/2-width/5.275-width/24, height/1.9, width/2-width/3.75, height/1.75);
     
     if (overgrown>.6 && snowday<.05){fill(240);}
       else {fill("rgb(124,124,124)");}
     quad(width/2, barnPeak-height/300, width/2-height/9.5, barnPeak-height/300, width/2 -height/3.5,barnPeak+height/10, width/2, barnPeak+height/10)
  
     triangle(width/2-height/7-height/24-height/7-height/24,height/2.43, width/2, height/2.45, width/2-height/9, height/2-height/5.65)
     
     if (barnCol>.75){    fill("rgb(149,150,165)"); } else if (barnCol>.2){     fill("rgb(138,37,37)"); } else {     fill("rgb(111,103,103)"); }
     rect(width/2-height/7-height/24, (barnPeak+height/2-height/30+height/16)/2+height/21.75, 1.75*(height/7+height/24), height/8.5)
     rect(width/2, (barnPeak+height/2-height/30+height/16)/2+height/21.75, height/4, height/8.5);}
     else if (barnAngle>.333){
        if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6){
      fill ("#103611");}
       else if (sky>.765) {fill ("#474747");}
     else { 
           fill("#777777");}
     noStroke();
     quad (width/2+width/12, height/1.75, width/2+width/12+width/28, height/1.9, width/2+width/5.275+width/24, height/1.9, width/2+width/4.85, height/1.75);
     
       if (overgrown>.6 && snowday<.05){fill(240);}
       else {fill("rgb(124,124,124)");}
         quad(width/2, barnPeak-height/300, width/2+height/9.5, barnPeak-height/300, width/2 +height/3.5,barnPeak+height/10, width/2, barnPeak+height/10)
  
     triangle(width/2+height/7+height/24+height/7+height/24,height/2.43, width/2, height/2.45, width/2+height/9, height/2-height/5.65)
     
     if (barnCol>.75){    fill("rgb(149,150,165)"); } else if (barnCol>.2){     fill("rgb(138,37,37)"); } else {     fill("rgb(111,103,103)"); }
     rect(width/2+height/7+height/24, (barnPeak+height/2-height/30+height/16)/2+height/21.75, 1.75*(height/7+height/24), height/8.5);
       rect(width/2, (barnPeak+height/2-height/30+height/16)/2+height/21.75, height/4.25, height/8.5);
     
     
     }
     
     
     
      fill("rgb(73,51,48)")
      rect(width/2, height/2-height/35, height/4,height/10);
    if (barnCol>.75){   fill("rgb(178,179,195)"); } else if (barnCol>.2){     fill("rgb(185,83,83)"); } else {     fill("rgb(161,161,161)"); }

       rect(width/2, height/2-height/9, height/10.85,height/15);
      rect(width/2-height/7, height/2-height/30, height/12,height/8);
     rect(width/2+height/7, height/2-height/30, height/12,height/8);
    rect(width/2, height/2-height/15, (width/2+height/16+height/24)-(width/2-height/16-height/24),height/20);
     triangle(width/2, barnPeak, width/2-height/24, height/2-height/7.05, width/2+height/24, height/2-height/7.05);
       triangle(width/2-height/23.9, height/2-height/7.05, width/2-height/23.9, height/2-height/30-height/20, width/2-height/16-height/8.1, height/2 - height/30 - height/16.25);
      triangle(width/2+height/23.9, height/2-height/7.05, width/2+height/23.9, height/2-height/30-height/20, width/2+height/16+height/8.1, height/2 - height/30 - height/16.25);
     
     
     //barn doors
  
       stroke("rgb(220,227,227)")
   strokeWeight(width/250);
   line(width/2+(height/18+height/3.5)/2, height/2-height/22,width/2+(height/18+height/3.5)/2,height/2+height/50);
   line(width/2-(height/18+height/3.5)/2, height/2-height/22,width/2-(height/18+height/3.5)/2,height/2+height/50);
   line(width/2-(height/18+height/3.5)/3, height/2-height/22,width/2-(height/18+height/3.5)/3,height/2+height/50);   
   line(width/2+(height/18+height/3.5)/3, height/2-height/22,width/2+(height/18+height/3.5)/3,height/2+height/50);
    line(width/2+(height/18+height/3.5)/3, height/2+height/50,width/2+(height/18+height/3.5)/2,height/2+height/50);
    line(width/2-(height/18+height/3.5)/3, height/2+height/50,width/2-(height/18+height/3.5)/2,height/2+height/50);
    line(width/2-(height/18+height/3.5)/2, height/2+height/50,width/2-(height/18+height/3.5)/3,height/2-height/22);
       line(width/2+(height/18+height/3.5)/2, height/2+height/50,width/2+(height/18+height/3.5)/3,height/2-height/22);
     line(width/2-(height/18+height/3.5)/3, height/2+height/50,width/2-(height/18+height/3.5)/2,height/2-height/22);
       line(width/2+(height/18+height/3.5)/3, height/2+height/50,width/2+(height/18+height/3.5)/2,height/2-height/22);
     line(width/2+(height/18+height/3.5)/3, height/2+height/50,width/2+(height/18+height/3.5)/2,height/2-height/22);
     line(width/2-(height/18+height/3.5)/3, height/2-height/22,width/2-(height/18+height/3.5)/2,height/2-height/22);
     line(width/2+(height/18+height/3.5)/3, height/2-height/22,width/2+(height/18+height/3.5)/2,height/2-height/22);
     
        //frame add-on 1
     if (framer>.85){
   fill("rgb(220,227,227)")
   rect(width/2-height/24, height/2-height/9, height/200,height/16);
   rect(width/2+height/24, height/2-height/9, height/200,height/16)
   rect(width/2, height/2-height/9+height/32, height/12+height/3.5,height/200);
   rect(width/2, height/2-height/9+height/15.5, height/12+height/3.5,height/200);
   stroke("rgb(220,227,227)")
   strokeWeight(width/250);
   line(width/2, height/2-height/9+height/32, width/2, barnPeak)
   line(width/2-(height/16+height/3.5)/2, height/2-height/9+height/32, width/2-height/24, (height/2-height/9)-height/64);
     line(width/2+(height/16+height/3.5)/2, height/2-height/9+height/32, width/2+height/24, (height/2-height/9)-height/64);}
   
   
   //frame add-on 2
   if (framer>.875){
      stroke("rgb(220,227,227)")
   strokeWeight(width/250);
   line (width/2, height/2-height/9+height/32, width/2, height/2-height/9+height/15.5);}
   
   //frame add-on 3
   if (framer>.9){
      stroke("rgb(220,227,227)")
   strokeWeight(width/250);
    line (width/2-height/24, height/2-height/9+height/32, width/2-height/24, height/2-height/9+height/15.5);
     line (width/2+height/24, height/2-height/9+height/32, width/2+height/24, height/2-height/9+height/15.5);}
   
     //frame add-on 4
   if (framer>.925){
      stroke("rgb(220,227,227)")
   strokeWeight(width/250);
    line (width/2, height/2-height/9+height/32, width/2-height/24, height/2-height/9+height/15.5)
     line (width/2, height/2-height/9+height/32, width/2+height/24, height/2-height/9+height/15.5);}
     
        //barn roof
   
   strokeWeight(height/160)
   stroke("rgb(124,124,124)")
    line(width/2-(height/11+height/3.5)/2, height/2-height/9+height/50, width/2-height/24, (height/2-height/9)-height/32);
   line(width/2+(height/11+height/3.5)/2, height/2-height/9+height/50, width/2+height/24, (height/2-height/9)-height/32);
    line(width/2, barnPeak, width/2+height/24, (height/2-height/9)-height/32);
      line(width/2, barnPeak, width/2-height/24, (height/2-height/9)-height/32);
  }
 pop();
 }
  
 
  
  
  if (barn<.5 && tower<.5 && gasStation>.5 && overgrown <.6 && nothing<.9){
     
     //gas station 
  
  
   if (gasStation<5){
     push();
    if (fxrand()>0){translate(gasMove, random_num(0,-min(width,height)/3));}
  
   //shadows
  if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6) {
      fill ("#103611");}
     else if (sky>.765) { 
           fill("#474747");}
     else { 
           fill("#777777");}
   if (overgrown>.6 && snowday<.05){
  stroke(200);}
   else if (overgrown>.6) {
      stroke("#103611");}
     else if (sky>.765) { 
           stroke("#474747");}
     else { 
           stroke("#777777");}
     strokeWeight(width/200);
     line(width/2-width/8, height/1.25+height/26,width/2-width/8-width/30, 9*height/10);
     line(width/2+width/8, height/1.25+height/26,width/2+width/8-width/30, 9*height/10);
     line(width/2, height/1.25+height/26,width/2-width/30, 9*height/10);
     quad(width/2-width/8-width/20, 8.75*height/10, width/2+width/8+width/300, 8.75*height/10, width/2+width/8-width/80, 9.05*height/10, width/2-width/8-width/15, 9.05*height/10);
     
    
     
     //Back Columns
     noStroke();
      fill("white");
       rect(width/2-width/9, height/1.3, width/200,height/13);
     rect(width/2+width/7.2, height/1.3, width/200,height/13);
     rect(width/2+width/72, height/1.3, width/200,height/13);
     
      //pumps 
     
  fill("#777777")
      
      rect(width/2-width/8+width/300, height/1.25+height/80, width/80,height/30);
     rect(width/2+width/300, height/1.25+height/80, width/80,height/30);
     rect(width/2+width/8+width/300, height/1.25+height/80, width/80,height/30);
     
     
     //columns
    fill("#f1f1f1");
      rect(width/2-width/8, height/1.25, width/200,height/13);
     rect(width/2, height/1.25, width/200,height/13);
     rect(width/2+width/8, height/1.25, width/200,height/13);
     
     
     
       //Canopy
     
       if (col3>.9){fill("#f1f1f1");}
     else if (col3>.8){fill("#F6C0C0");}
     else if (col3>.7){fill("#AFC1AC");}
     else if (col3>.6){fill("rgb(236,78,78)");}
     else if (col3>.4){fill("#f1f1f1");}
     else if (col3>.2){fill("#D8D4D4");}
      else if (col3>0){fill("rgb(121,208,179)");}
    
    
     rect(width/2, height/1.175-height/10, width/3,height/40);
     if (col3>.9){fill("#dddddd");}
     else if (col3>.8){fill("#F6E9E9");}
     else if (col3>.7){fill("#C2D2C0");}
      else if (col3>.6){fill("rgb(255,131,131)");}
      else if (col3>.4){fill("#dddddd");}
      else if (col3>.2){fill("#E4EBEB");}
     else if (col3>0){fill("rgb(208,239,228)");}
     if (overgrown>.6 && snowday<.05){
       fill("rgb(241,238,238)");
     }
     quad(width/2-width/7, height/1.175-height/7,width/2+width/5.5, height/1.175-height/7, width/2+width/6, height/1.175-height/10-height/80, width/2-width/6, height/1.175-height/10-height/80);
     if (col3>.9){fill("white");}
     else if (col3>.8){fill("#ECD5D5");}
     else if (col3>.7){fill("#95A493");}
      else if (col3>.6){fill("rgb(255,80,80)");}
      else if (col3>.4){fill("white");}
     else if (col3>.2){fill("#B0B0B0");}
     else if (col3>0){fill("r#908D8D247,236)");}
      quad(width/2+width/5.5, height/1.36,width/2+width/5.5, height/1.175-height/7, width/2+width/6, height/1.175-height/10-height/80, width/2+width/6, height/1.175-height/11.5);
    
     
     //Canopy Text
     push();
     if (mover>.5){translate(random_num(-width/3.85,-width/6),0);}
     if (col2>.8){fill("red");}
     else if (col2>.6) {fill("white");}
     else if (col2>.4){fill("dodgerblue");}
     else if (col2>.2){fill("maroon");}
     else {fill("teal");}
     rect(width/2+width/8, height/1.258-height/22.5, width/300,height/70);
     rect(width/2+width/7.75, height/1.258-height/20, width/100,height/300);
     rect(width/2+width/7.75, height/1.258-height/26, width/100,height/300);
     rect(width/2+width/7.09, height/1.258-height/22.5, width/300,height/70);
     rect(width/2+width/6.8, height/1.258-height/22.5, width/300,height/70);
     rect(width/2+width/7, height/1.258-height/20, width/180,height/300);
     rect(width/2+width/7, height/1.258-height/22.5, width/180,height/300);
     rect(width/2+width/6.35, height/1.258-height/22.5, width/150,height/300);
     rect(width/2+width/6.35, height/1.258-height/20, width/150,height/300);
     rect(width/2+width/6.35, height/1.258-height/26, width/150,height/300);
     rect(width/2+width/6.25, height/1.258-height/23.85, width/300,height/140);
     rect(width/2+width/6.45, height/1.258-height/20.75, width/300,height/140);
     rect(width/2+width/7.55, height/1.258-height/23.85, width/300,height/140);
     rect(width/2+width/7.65, height/1.258-height/22.95, width/250,height/300);
     pop();
     
     
     //Sign
    fill("white")
     if (gasMove<0){
     rect(width/signX, height/signY, width/200,height/4);
     if (signage>.5){
        if (fxrand()>.9){fill("rgb(241,241,241)5)");}
     else if (fxrand()>.8){fill("rgb(199,104,104)");}
     else if (fxrand()>.7){fill("white");}
     else if (fxrand()>.3){fill("coral");}
     else if (fxrand()>.1){fill("white");}
     else {fill("gold");}
       rect(width/signX, height/signY-height/8, width/18+width/100,height/15+height/100);
     if (fxrand()>.8){fill("dodgerblue");}
     else if (fxrand()>.6){fill("rgb(143,74,74)");}
     else if (fxrand()>.4){fill("teal");}
     else if (fxrand()>.2){fill("rgb(93,128,161)");}
     else if (fxrand()>.1){fill("rgb(118,100,100)");}
     else {fill("rgb(42,49,49)");}
     rect(width/signX, height/signY-height/8, width/18,height/15);}
     else {
             if (fxrand()>.9){fill("rgb(241,241,241)5)");}
     else if (fxrand()>.8){fill("rgb(199,104,104)");}
     else if (fxrand()>.7){fill("white");}
     else if (fxrand()>.3){fill("coral");}
     else if (fxrand()>.1){fill("white");}
     else {fill("gold");}
       circle(width/signX, height/signY-height/8, width/14);
        if (fxrand()>.8){fill("dodgerblue");}
     else if (fxrand()>.6){fill("rgb(134,91,146)");}
     else if (fxrand()>.4){fill("teal");}
     else if (fxrand()>.2){fill("rgb(93,128,161)");}
     else if (fxrand()>.1){fill("rgb(118,100,100)");}
     else {fill("rgb(42,49,49)");}
            circle(width/signX, height/signY-height/8, width/16);}}
     else if (gasMove>0){
     fill("white");
       rect(width/signX-width/2, height/signY, width/200,height/4)
     if (signage>.5){
            if (fxrand()>.9){fill("rgb(241,241,241)5)");}
     else if (fxrand()>.8){fill("rgb(199,104,104)");}
     else if (fxrand()>.7){fill("white");}
     else if (fxrand()>.3){fill("coral");}
     else if (fxrand()>.1){fill("white");}
     else {fill("gold");}
       rect(width/signX-width/2, height/signY-height/8, width/18+width/100,height/15+height/100);
        if (fxrand()>.8){fill("dodgerblue");}
     else if (fxrand()>.6){fill("rgb(139,83,83)");}
     else if (fxrand()>.4){fill("teal");}
     else if (fxrand()>.2){fill("rgb(93,128,161)");}
     else if (fxrand()>.1){fill("rgb(118,100,100)");}
     else {fill("rgb(42,49,49)");}
     rect(width/signX-width/2, height/signY-height/8, width/18,height/15);}
     else {
               if (fxrand()>.9){fill("rgb(241,241,241)5)");}
     else if (fxrand()>.8){fill("rgb(199,104,104)");}
     else if (fxrand()>.7){fill("white");}
     else if (fxrand()>.6){fill("coral");}
     else if (fxrand()>.3){fill("white");}
     else {fill("gold");}
       circle(width/signX-width/2, height/signY-height/8, width/14);
            if (fxrand()>.8){fill("dodgerblue");}
     else if (fxrand()>.6){fill("rgb(64,109,69)");}
     else if (fxrand()>.4){fill("teal");}
     else if (fxrand()>.2){fill("rgb(93,128,161)");}
     else if (fxrand()>.1){fill("rgb(118,100,100)");}
     else {fill("rgb(42,49,49)");}
            circle(width/signX-width/2, height/signY-height/8, width/16);}}
     
  
     //Sign Numbers
     if (gasMove<0 && numbers>0 && signage>.5){
       
       
       
       
       push();
       if (var1<.35){
       translate(width/5+width/200, height/3.85-min(width,height)/80);}
       else if (var1<.75){
         translate(width/5+width/150,height/12-min(width,height)/80);}
       else {translate(width/2.6, height/12-min(width,height)/80);}
          strokeWeight(random_num(min(width,height)/600, min(width,height)/850));
  stroke(random_num(250,255));
  point1=min(width,height)/2-min(width,height)/250;
    point2=min(width,height)/2;
  point3=min(width,height)/2+min(width,height)/250;
      
      if (fxrand()>.99){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.89){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.147){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.016){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.995){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.994){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.993){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.992){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.9991){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
     
     
       
       translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       
        translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       translate(-2*min(width, height)/80, min(width, height)/50);
       
        if (fxrand()>.99){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.89){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.47){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.016){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.995){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.994){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.993){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.992){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.9991){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
     
     
       
       translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       
        translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       
        translate(-2*min(width, height)/80, min(width, height)/50);
       
        if (fxrand()>.99){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.99){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.47){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.16){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.995){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.994){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.993){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.992){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.9991){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
     
     
       
       translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       
        translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
    pop(); 
   }
     
     
     
     
      else if (gasMove>0 && numbers>0 && signage>.5){
       
       
       
       
       push();
       if (var1<.35){
       translate(-width/4-width/21+width/250, height/3.85-min(width, height)/100);}
       else if (var1<.75){
         translate(-width/4-width/22,height/12-height/80);}
       else {translate(-width/4+width/8+width/300, height/12-min(width,height)/80);}
          strokeWeight(random_num(min(width,height)/600, min(width,height)/850));
  stroke(random_num(250,255));
  point1=min(width,height)/2-min(width,height)/250;
    point2=min(width,height)/2;
  point3=min(width,height)/2+min(width,height)/250;
      
    if (fxrand()>.99){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.89){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.147){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.016){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.995){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.994){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.993){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.992){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.9991){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
     
     
       
       translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       
        translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       translate(-2*min(width, height)/80, min(width, height)/50);
       
        if (fxrand()>.99){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.89){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.47){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.016){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.995){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.994){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.993){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.992){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.9991){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
     
     
       
       translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       
        translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       
        translate(-2*min(width, height)/80, min(width, height)/50);
       
        if (fxrand()>.99){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.99){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.47){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.16){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.995){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.994){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.993){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.992){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.9991){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
     
     
       
       translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       
        translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
    pop(); 
   }
     pop();
     
     
   }}
      
  
  
  
  
  //gas station 
  
  
   if (gasStation<.5){
     push();
    if (fxrand()>.25){translate(gasMove, 0);}
  
   //shadows
  if (overgrown>.6 && snowday<.05){
  fill(200);}
   else if (overgrown>.6) {
      fill ("#103611");}
     else if (sky>.765) { 
           fill("#474747");}
     else { 
           fill("#777777");}
   if (overgrown>.6 && snowday<.05){
  stroke(200);}
   else if (overgrown>.6) {
      stroke("#103611");}
     else if (sky>.765) { 
           stroke("#474747");}
     else { 
           stroke("#777777");}
     strokeWeight(width/200);
     line(width/2-width/8, height/1.25+height/26,width/2-width/8-width/30, 9*height/10);
     line(width/2+width/8, height/1.25+height/26,width/2+width/8-width/30, 9*height/10);
     line(width/2, height/1.25+height/26,width/2-width/30, 9*height/10);
     quad(width/2-width/8-width/20, 8.75*height/10, width/2+width/8+width/300, 8.75*height/10, width/2+width/8-width/80, 9.05*height/10, width/2-width/8-width/15, 9.05*height/10);
     
    
      if (gasMove<0){
     line(width/signX, height/signY+height/8,width/signX-width/21.865, 9.25*height/10);}
     else if (gasMove>0){line(width/signX-width/2, height/signY+height/8,width/signX-width/2-width/21.865, 9.25*height/10);}
     
     //Back Columns
     noStroke();
      fill("white");
       rect(width/2-width/9, height/1.3, width/200,height/13);
     rect(width/2+width/7.2, height/1.3, width/200,height/13);
     rect(width/2+width/72, height/1.3, width/200,height/13);
     
      //pumps 
     
  fill("#777777")
      
      rect(width/2-width/8+width/300, height/1.25+height/80, width/80,height/30);
     rect(width/2+width/300, height/1.25+height/80, width/80,height/30);
     rect(width/2+width/8+width/300, height/1.25+height/80, width/80,height/30);
     
     
     
     //columns
    fill("#f1f1f1");
      rect(width/2-width/8, height/1.25, width/200,height/13);
     rect(width/2, height/1.25, width/200,height/13);
     rect(width/2+width/8, height/1.25, width/200,height/13);
     
     
     
       //Canopy
     
       if (col3>.9){fill("#f1f1f1");}
     else if (col3>.8){fill("#F6C0C0");}
     else if (col3>.7){fill("#AFC1AC");}
     else if (col3>.6){fill("rgb(236,78,78)");}
     else if (col3>.4){fill("#f1f1f1");}
     else if (col3>.2){fill("#D8D4D4");}
      else if (col3>0){fill("rgb(121,208,179)");}
    
     
     
   
     rect(width/2, height/1.175-height/10, width/3,height/40);
     if (col3>.9){fill("#dddddd");}
     else if (col3>.8){fill("#F6E9E9");}
     else if (col3>.7){fill("#C2D2C0");}
      else if (col3>.6){fill("rgb(255,131,131)");}
      else if (col3>.4){fill("#dddddd");}
      else if (col3>.2){fill("#E4EBEB");}
     else if (col3>0){fill("rgb(208,239,228)");}
     if (overgrown>.6 && snowday<.05){
       fill("rgb(241,238,238)");
     }
     quad(width/2-width/7, height/1.175-height/7,width/2+width/5.5, height/1.175-height/7, width/2+width/6, height/1.175-height/10-height/80, width/2-width/6, height/1.175-height/10-height/80);
     if (col3>.9){fill("white");}
     else if (col3>.8){fill("#ECD5D5");}
     else if (col3>.7){fill("#95A493");}
      else if (col3>.6){fill("rgb(255,80,80)");}
      else if (col3>.4){fill("white");}
     else if (col3>.2){fill("#B0B0B0");}
     else if (col3>0){fill("r#908D8D247,236)");}
      quad(width/2+width/5.5, height/1.36,width/2+width/5.5, height/1.175-height/7, width/2+width/6, height/1.175-height/10-height/80, width/2+width/6, height/1.175-height/11.5);
     
     //Canopy Text
     push();
     if (mover>.5){translate(random_num(-width/3.85,-width/6),0);}
     if (col2>.8){fill("red");}
     else if (col2>.6) {fill("#999999");}
     else if (col2>.4){fill("dodgerblue");}
     else if (col2>.2){fill("maroon");}
     else {fill("teal");}
     rect(width/2+width/8, height/1.258-height/22.5, width/300,height/70);
     rect(width/2+width/7.75, height/1.258-height/20, width/100,height/300);
     rect(width/2+width/7.75, height/1.258-height/26, width/100,height/300);
     rect(width/2+width/7.09, height/1.258-height/22.5, width/300,height/70);
     rect(width/2+width/6.8, height/1.258-height/22.5, width/300,height/70);
     rect(width/2+width/7, height/1.258-height/20, width/180,height/300);
     rect(width/2+width/7, height/1.258-height/22.5, width/180,height/300);
     rect(width/2+width/6.35, height/1.258-height/22.5, width/150,height/300);
     rect(width/2+width/6.35, height/1.258-height/20, width/150,height/300);
     rect(width/2+width/6.35, height/1.258-height/26, width/150,height/300);
     rect(width/2+width/6.25, height/1.258-height/23.85, width/300,height/140);
     rect(width/2+width/6.45, height/1.258-height/20.75, width/300,height/140);
     rect(width/2+width/7.55, height/1.258-height/23.85, width/300,height/140);
     rect(width/2+width/7.65, height/1.258-height/22.95, width/250,height/300);
     pop();
     
     //Sign
    fill("white")
     if (gasMove<0){
     rect(width/signX, height/signY, width/200,height/4);
     if (signage>.5){
        if (fxrand()>.9){fill("rgb(241,241,241)5)");}
     else if (fxrand()>.8){fill("rgb(199,104,104)");}
     else if (fxrand()>.7){fill("white");}
     else if (fxrand()>.3){fill("coral");}
     else if (fxrand()>.1){fill("white");}
     else {fill("gold");}
       rect(width/signX, height/signY-height/8, width/18+width/100,height/15+height/100);
     if (fxrand()>.8){fill("dodgerblue");}
     else if (fxrand()>.6){fill("rgb(143,74,74)");}
     else if (fxrand()>.4){fill("teal");}
     else if (fxrand()>.2){fill("rgb(93,128,161)");}
     else if (fxrand()>.1){fill("rgb(118,100,100)");}
     else {fill("rgb(42,49,49)");}
     rect(width/signX, height/signY-height/8, width/18,height/15);}
     else {
             if (fxrand()>.9){fill("rgb(241,241,241)5)");}
     else if (fxrand()>.8){fill("rgb(199,104,104)");}
     else if (fxrand()>.7){fill("white");}
     else if (fxrand()>.3){fill("coral");}
     else if (fxrand()>.1){fill("white");}
     else {fill("gold");}
       circle(width/signX, height/signY-height/8, width/14);
        if (fxrand()>.8){fill("dodgerblue");}
     else if (fxrand()>.6){fill("rgb(134,91,146)");}
     else if (fxrand()>.4){fill("teal");}
     else if (fxrand()>.2){fill("rgb(93,128,161)");}
     else if (fxrand()>.1){fill("rgb(118,100,100)");}
     else {fill("rgb(42,49,49)");}
            circle(width/signX, height/signY-height/8, width/16);}}
     else if (gasMove>0){
     fill("white");
       rect(width/signX-width/2, height/signY, width/200,height/4)
     if (signage>.5){
            if (fxrand()>.9){fill("rgb(241,241,241)5)");}
     else if (fxrand()>.8){fill("rgb(199,104,104)");}
     else if (fxrand()>.7){fill("white");}
     else if (fxrand()>.3){fill("coral");}
     else if (fxrand()>.1){fill("white");}
     else {fill("gold");}
       rect(width/signX-width/2, height/signY-height/8, width/18+width/100,height/15+height/100);
        if (fxrand()>.8){fill("dodgerblue");}
     else if (fxrand()>.6){fill("rgb(139,83,83)");}
     else if (fxrand()>.4){fill("teal");}
     else if (fxrand()>.2){fill("rgb(93,128,161)");}
     else if (fxrand()>.1){fill("rgb(118,100,100)");}
     else {fill("rgb(42,49,49)");}
     rect(width/signX-width/2, height/signY-height/8, width/18,height/15);}
     else {
               if (fxrand()>.9){fill("rgb(241,241,241)5)");}
     else if (fxrand()>.8){fill("rgb(199,104,104)");}
     else if (fxrand()>.7){fill("white");}
     else if (fxrand()>.6){fill("coral");}
     else if (fxrand()>.3){fill("white");}
     else {fill("gold");}
       circle(width/signX-width/2, height/signY-height/8, width/14);
            if (fxrand()>.8){fill("dodgerblue");}
     else if (fxrand()>.6){fill("rgb(64,109,69)");}
     else if (fxrand()>.4){fill("teal");}
     else if (fxrand()>.2){fill("rgb(93,128,161)");}
     else if (fxrand()>.1){fill("rgb(118,100,100)");}
     else {fill("rgb(42,49,49)");}
            circle(width/signX-width/2, height/signY-height/8, width/16);}}
     
  //Sign Numbers
     if (gasMove<0 && numbers>0 && signage>.5){
       
       
       
       
       push();
       if (var1<.35){
       translate(width/5+width/200, height/3.85-min(width,height)/80);}
       else if (var1<.75){
         translate(width/5+width/150,height/12-min(width,height)/80);}
       else {translate(width/2.6, height/12-min(width,height)/80);}
          strokeWeight(random_num(min(width,height)/600, min(width,height)/850));
  stroke(random_num(250,255));
  point1=min(width,height)/2-min(width,height)/250;
    point2=min(width,height)/2;
  point3=min(width,height)/2+min(width,height)/250;
      
      if (fxrand()>.99){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.89){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.147){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.016){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.995){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.994){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.993){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.992){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.9991){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
     
     
       
       translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       
        translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       translate(-2*min(width, height)/80, min(width, height)/50);
       
        if (fxrand()>.99){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.89){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.47){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.016){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.995){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.994){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.993){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.992){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.9991){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
     
     
       
       translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       
        translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       
        translate(-2*min(width, height)/80, min(width, height)/50);
       
        if (fxrand()>.99){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.99){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.47){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.16){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.995){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.994){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.993){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.992){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.9991){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
     
     
       
       translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       
        translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
    pop(); 
   }
     
     
     
     
      else if (gasMove>0 && numbers>0 && signage>.5){
       
       
       
       
       push();
       if (var1<.35){
       translate(-width/4-width/21+width/250, height/3.85-min(width, height)/100);}
       else if (var1<.75){
         translate(-width/4-width/22,height/12-height/80);}
       else {translate(-width/4+width/8+width/300, height/12-min(width,height)/80);}
          strokeWeight(random_num(min(width,height)/600, min(width,height)/850));
  stroke(random_num(250,255));
  point1=min(width,height)/2-min(width,height)/250;
    point2=min(width,height)/2;
  point3=min(width,height)/2+min(width,height)/250;
      
    if (fxrand()>.99){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.89){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.147){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.016){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.995){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.994){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.993){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.992){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.9991){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
     
     
       
       translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       
        translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       translate(-2*min(width, height)/80, min(width, height)/50);
       
        if (fxrand()>.99){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.89){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.47){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.016){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.995){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.994){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.993){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.992){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.9991){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
     
     
       
       translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       
        translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       
        translate(-2*min(width, height)/80, min(width, height)/50);
       
        if (fxrand()>.99){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.99){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.47){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.16){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.995){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.994){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.993){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.992){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.9991){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
     
     
       
       translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
       
        translate(min(width, height)/80, 0);
       
        if (fxrand()>.9){
      
      //1
    
       line (point2, point1, point2,point3);}
      
else if (fxrand()>.8){
      //2
      
       line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point2);
       line (point1, point2, point1,point3);}
  
  
  else if (fxrand()>.7){
  //3 
  
  
        line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.6){
  
  //4
  
 line (point1, point1, point1,point2);
       line (point1, point2, point3,point2);
       line (point3, point1, point3,point3);}
  
  
  else if (fxrand()>.5){
      
      
      //5
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);}
  
  else if (fxrand()>.4){
   //6
  
   line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);}
  
  else if (fxrand()>.3){
  //7
  
  
  line (point1, point1, point3,point1);
  line (point3, point1, point3,point3);}
  
  else if (fxrand()>.2){
  
  //8
  
line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
  
  else if (fxrand()>.1){
  
  //9
  
  
  line (point1, point1, point3,point1);
       line (point1, point2, point3,point2);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
      line (point3, point1, point3,point2);}
  
  
  else {
  
  //0
  
  line (point1, point1, point3,point1);
       line (point1, point3, point3,point3);
       line (point3, point3, point3,point2);
       line (point1, point2, point1,point1);
    line (point1, point2, point1,point3);
      line (point3, point1, point3,point2);}
       
    pop(); 
   }
     
     
     
     pop();
     
 
     
     
  
     
       //page frame
    
     fill("white");
     noStroke();
     rect(width/2, height/16, width/1.11, height/29);
     rect(width/2, 15*height/16, width/1.11, height/29);
     rect(width/16.5, height/2, width/30, height/1.1);
     rect(15.5*width/16.5, height/2, width/30, height/1.1);  
     
  }
  
  //road lines
  if (gasStation<.25 && snowday>.05){
  fill("gold")
      beginShape();
  vertex(width/2-(width-width/11)/2, height/1.07-height/32), 
    vertex(width/2+(width-width/11)/2, height/1.07-height/32),
    vertex(width/2+(width-width/11)/2, height/1.072-height/32),
  vertex(width/2-(width-width/11)/2, height/1.072-height/32); 
     endShape();
         beginShape();
  vertex(width/2-(width-width/11)/2, height/1.07-height/28), 
    vertex(width/2+(width-width/11)/2, height/1.07-height/28),
    vertex(width/2+(width-width/11)/2, height/1.072-height/28),
  vertex(width/2-(width-width/11)/2, height/1.072-height/28); 
     endShape();}
  
  //road overlay
  if (var1<.75 && var1>.35){
 if (overgrown>.6 && gasStation<.175){     fill("rgba(200,200,200,0.5)")
           beginShape();
  vertex(width/2-(width-width/11)/2, height/1.125+height/32), 
    vertex(width/2+(width-width/11)/2, height/1.125+height/32),
    vertex(width/2+(width-width/11)/2, height/1.125-height/27),
  vertex(width/2-(width-width/11)/2, height/1.125-height/27); 
     endShape();}} 
  
  //Grass

   if (overgrown>.6 && wild>.8 && gasStation>.5){
     noStroke();
  fill(random_num(80,120), random_num(100,120),random_num(30,80));
   if (overgrown>.6 && snowday<.05){
    noStroke();
     fill(random_num(245,250));}

    for (let i = width/14; i < width*2; i += width/1000) {
      noStroke();
   fill(random_num(80,120), random_num(100,120),random_num(30,80));
   if (overgrown>.6 && snowday<.05){
    noStroke();
     fill(random_num(245,250));}
  noStroke();
     
      push();
       rect(i, height/1.5, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
    rect(i, height/1.475, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.45, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand()); 
      pop();
      push();
       rect(i, height/1.425, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
         rect(i, height/1.4, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
    rect(i, height/1.375, width/600, width/random_num(20,40));
    rotate(1*fxrand()-2.075*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.35, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.325, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
        rect(i, height/1.3, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
    rect(i, height/1.275, width/600, width/random_num(20,40));
    rotate(1*fxrand()-2.075*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.25, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.225, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.2, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
    rect(i, height/1.175, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.15, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
       rect(i, height/1.125, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
       pop();
      push();
         rect(i, height/1.1, width/600, width/random_num(20,40));
    rotate(8*fxrand()-10*fxrand()*fxrand())
 
      pop(); }}
  

  
  //section
  if (gasStation>.5 && section>.15 && ((tower>.5 && mover<.25 && skinnyTower<.75) || (tower<.5 && barn>.5 && barnAngle<.25 && mover<.25))){
    
    if (tower>.5 && mover<.25 && skinnyTower<.75){
    unordinary=1;
      //landscape water tower section
      
     if (var1>.75){
      fill("#333333")
    rect(width/2, height*3.9/5, width*8.5/10, height/3.45);
    fill("rgb(187,230,230)")
    rect(width/2, height/2, width/65, height/2);
    ellipse(width/2, height/2-height/6, width/8.3, height/9);
      fill ("rgb(200,200,200)");
     rect(width/2, height/2-height/6-height/24, width/8.35, height/11);
      fill ("rgb(205,205,205)");
     rect(width/2, height/2-height/6-height/24, width/10, height/11);
      fill ("rgb(210,210,210)");
     rect(width/2, height/2-height/6-height/24, width/16, height/11);
       
       fill("rgb(187,230,230)")
    rect(width/2, height*3/4, width, height/60);
       
        for (let o = 1; o < 1000; o++) {
        let o = random_num(0,buffer)
      stroke("snow")
     noFill();
     strokeWeight(.02)
      angleMode(DEGREES)
circle(random_num(-width/2, width+width/2), random_num(-height/2, height+height/2), o);}
  
    for (let o = 1; o < 1000; o++) {
        let o = random_num(0,buffer)
      stroke("white")
     noFill();
     strokeWeight(.02)
      angleMode(DEGREES)
circle(random_num(-width/2, width+width/2), random_num(-height/2, height+height/2), o);}
       
       
     } 
      
      //square water tower section
      
     else if (var1>.35) {
      fill("#333333")
    rect(width/2, height*4.1/5, width*8.5/10, height/3.45);
       ellipse(width/2, height/2-height/6, width/6.1, height/6.12);
       rect(width/2, height/2, width/50, height/2);
       rect(width/2, height/2-height/6-height/24, width/6.1, height/10.1);
    fill("rgb(187,230,230)")
    rect(width/2, height/2, width/65, height/2);
    ellipse(width/2, height/2-height/6, width/6.3, height/6.3);
       fill ("rgb(210,210,210)");
     rect(width/2, height/2-height/6-height/24, width/6.3, height/11);
       fill ("rgb(218,218,218)");
     rect(width/2, height/2-height/6-height/24, width/8, height/11);
       fill ("rgb(226,226,226)");
     rect(width/2, height/2-height/6-height/24, width/12, height/11);
        fill("rgb(187,230,230)")
    rect(width/4, 3*height/4, width, height/60);
       rect(width*3/4, height*3/4, width/60, height/10);
       rect(width*3/4+width/10-width/120, height*3/4+width/20, width/5, height/60);
       rect(width*3/4+width/10-width/120, height*3/4-width/20, width/5, height/60);
       rect(random_num(width/8, width/3), height*3/4+width/8, random_num(width/40, width/60), height/4);
       
        for (let o = 1; o < 1000; o++) {
        let o = random_num(0,buffer)
      stroke("snow")
     noFill();
     strokeWeight(.02)
      angleMode(DEGREES)
circle(random_num(-width/2, width+width/2), random_num(-height/2, height+height/2), o);}
  
    for (let o = 1; o < 1000; o++) {
        let o = random_num(0,buffer)
      stroke("white")
     noFill();
     strokeWeight(.02)
      angleMode(DEGREES)
circle(random_num(-width/2, width+width/2), random_num(-height/2, height+height/2), o);}
     } 
      
      //portrait water tower section
        else {
      fill("#333333")
    rect(width/2, height*4.1/5, width*8.5/10, height/3.45);
       ellipse(width/2, height/2-height/6, width/4.25, height/8.1);
       rect(width/2, height/2, width/50, height/2);
       rect(width/2, height/2-height/6-height/20, width/4.25, height/10);
    fill("rgb(187,230,230)")
    rect(width/2, height/2, width/65, height/2);
    ellipse(width/2, height/2-height/6, width/4.4, height/8.7);
      fill ("rgb(210,210,210)");
     rect(width/2, height/2-height/6-height/20, width/4.4, height/10);
      fill ("rgb(215,215,215)");
     rect(width/2, height/2-height/6-height/20, width/6, height/10);
      fill ("rgb(220,220,220)");
     rect(width/2, height/2-height/6-height/20, width/12, height/10);
        fill("rgb(187,230,230)")
    rect(width/4, 3*height/4, width, height/60);
       rect(width*3/4, height*3/4, width/60, height/12);
       rect(width*3/4+width/10-width/120, height*3/4+width/20, width/5, height/60);
       rect(width*3/4+width/10-width/120, height*3/4-width/20, width/5, height/60);
       rect(random_num(width/8, width/3), height*3/4+width/5, random_num(width/40, width/60), height/4);
          strokeWeight(width/200);
          stroke("#333333")
          line(width/2-width/8.8, height/2-height/6-height/20-height/20, width/2+width/8.8, height/2-height/6-height/20-height/20);
          
          for (let o = 1; o < 1000; o++) {
        let o = random_num(0,buffer)
      stroke("snow")
     noFill();
     strokeWeight(.02)
      angleMode(DEGREES)
circle(random_num(-width/2, width+width/2), random_num(-height/2, height+height/2), o);}
  
    for (let o = 1; o < 1000; o++) {
        let o = random_num(0,buffer)
      stroke("white")
     noFill();
     strokeWeight(.02)
      angleMode(DEGREES)
circle(random_num(-width/2, width+width/2), random_num(-height/2, height+height/2), o);}
     } 
    }
    
    
    
  else if (tower<.5 && barn>.5 && barnAngle<.25 && mover<.25){
    noStroke();
  
   //square barn section
    if (var1>.35 && var1<.75) {
    

    fill("rgb(230,235,237)");
      rect(width/2, height/2-height/13, width/4,height/14);
       rect(width/2, height/2-height/9, width/10.85,height/15);
      rect(width/2-width/7, height/2-height/30, width/12,height/8);
     rect(width/2+width/7, height/2-height/30, width/12,height/8);
    rect(width/2, height/2-width/10, (width/2+width/16+width/24)-(width/2-width/16-width/24),height/20);
     triangle(width/2, barnPeak, width/2-width/24, height/2-height/7.05, width/2+width/24, height/2-height/7.05);
       triangle(width/2-width/23.9, height/2-height/7.05, width/2-width/23.9, height/2-height/30-height/20, width/2-width/16-width/8.1, height/2 - height/30 - height/16.25);
      triangle(width/2+width/23.9, height/2-height/7.05, width/2+width/23.9, height/2-height/30-height/20, width/2+width/16+width/8.1, height/2 - height/30 - height/16.25);
      noStroke();
      
      
      fill("#333333")
      rect(width/2-(width/15+width/3.5)/2-width/300, height/2-height/31, width/100, height/8);
       rect(width/2+(width/15+width/3.5)/2+width/300, height/2-height/31, width/100, height/8);
      
      fill("#AAAAAA");
      rect(width/2-(width/15+width/3.5)/2, height/2-height/31, width/100, height/8);
       rect(width/2+(width/15+width/3.5)/2, height/2-height/31, width/100, height/8);
      rect(width/2-(width/35+width/6)/2, height/2-height/35, width/100, height/8);
       rect(width/2+(width/35+width/6)/2, height/2-height/35, width/100, height/8);
       rect(width/2, height/2-height/31-height/18, width/2.9, height/100);
       rect(width/2, height/2-height/25, width/2.9, height/100);
      rect(width/2, height/2-height/9, width/100, height/7.5);
    
    
     strokeWeight(width/160)
   stroke("#333333")
    line(width/2-(width/11+width/3.5)/2, height/2-height/9+height/50, width/2-width/24, (height/2-height/9)-height/32);
   line(width/2+(width/11+width/3.5)/2, height/2-height/9+height/50, width/2+width/24, (height/2-height/9)-height/32);
    line(width/2, barnPeak, width/2+width/24, (height/2-height/9)-height/32);
      line(width/2, barnPeak, width/2-width/24, (height/2-height/9)-height/32);
      
      
    
      
      
      
      fill("#333333")
    rect(width/2, height*3.9/5, width*8.5/10, height/2);
      push();
      translate(random_num(-width/3, width/3),random_num(0, height/12));
      noStroke();
      fill("snow")
      rect(width/2, height/2+height/18, width/25, height/300);
      rect(width/2+width/80, height/2+height/19, width/100, height/300);
        rect(width/2+width/80, height/2+height/17, width/100, height/300);
      rect(width/2, height/2+height/18, width/500, height/100);
      rect(width/2-width/100, height/2+height/18, width/500, height/100);
      rect(width/2-width/200, height/2+height/18, width/500, height/100);
      rect(width/2-width/70, height/2+height/18, width/500, height/60);
      rect(width/2-width/100, height/2+height/22, width/90, height/500);
       rect(width/2-width/100, height/2+height/15.5, width/90, height/500);
       ellipse(width/2-width/37, height/2+height/18, width/70, height/90);
        rect(width/2+width/300, height/2+height/22, width/100, height/500);
       rect(width/2+width/300, height/2+height/15.25, width/100, height/500);
         rect(width/2+width/28, height/2+height/19.5, width/55, height/500);
       rect(width/2+width/28, height/2+height/16, width/55, height/500);
        rect(width/2+width/60, height/2+height/20, width/60, height/500);
       rect(width/2+width/60, height/2+height/16.25, width/60, height/500);
      fill("#333333")
    circle(width/2-width/35.5, height/2+height/18+height/400, width/300);
      circle(width/2-width/35.5, height/2+height/18-height/400, width/300);
      rect(width/2-width/45, height/2+height/18+height/200, width/250, height/250);
        rect(width/2-width/45, height/2+height/18-height/200, width/250, height/250);
      pop();
      
       
    
    }
    
    //portrait barn section
     
    else if (var1<.35) {
        fill("#333333")
    rect(width/2, height*3.9/5, width*8.5/10, height/2);
   noStroke();
      fill("white");
      
       rect(width/2, height/2-height/9, width/10.85,height/15);
      rect(width/2-width/7, height/2-height/30, width/12,height/8);
     rect(width/2+width/7, height/2-height/30, width/12,height/8);
    rect(width/2, height/2-height/15, (width/2+width/16+width/24)-(width/2-width/16-width/24),height/20);
     triangle(width/2, barnPeak, width/2-width/24, height/2-height/7.05, width/2+width/24, height/2-height/7.05);
       triangle(width/2-width/23.9, height/2-height/7.05, width/2-width/23.9, height/2-height/30-height/20, width/2-width/16-width/8.1, height/2 - height/30 - height/16.25);
      triangle(width/2+width/23.9, height/2-height/7.05, width/2+width/23.9, height/2-height/30-height/20, width/2+width/16+width/8.1, height/2 - height/30 - height/16.25);
      
      
        fill("#333333")
      rect(width/2-(width/15+width/3.5)/2-width/300, height/2-height/31, width/100, height/8);
       rect(width/2+(width/15+width/3.5)/2+width/300, height/2-height/31, width/100, height/8);
      
      fill("#AAAAAA");
      rect(width/2-(width/15+width/3.5)/2, height/2-height/31, width/100, height/8);
       rect(width/2+(width/15+width/3.5)/2, height/2-height/31, width/100, height/8);
      rect(width/2-(width/35+width/6)/2, height/2-height/35, width/100, height/8);
       rect(width/2+(width/35+width/6)/2, height/2-height/35, width/100, height/8);
       rect(width/2, height/2-height/31-height/18, width/2.9, height/100);
       rect(width/2, height/2-height/25, width/2.9, height/100);
      rect(width/2, height/2-height/9, width/100, height/7.5);
      
      
      
    //roof section
      strokeWeight(width/140)
   stroke("black")
    line(width/2-(width/11+width/3.5)/2, height/2-height/9+height/50, width/2-width/24, (height/2-height/9)-height/32);
   line(width/2+(width/11+width/3.5)/2, height/2-height/9+height/50, width/2+width/24, (height/2-height/9)-height/32);
    line(width/2, barnPeak, width/2+width/24, (height/2-height/9)-height/32);
      line(width/2, barnPeak, width/2-width/24, (height/2-height/9)-height/32);
      
      
       
      //ground mass
      
      fill("#333333")
    rect(width/2, height*3.9/5, width*8.5/10, height/2);
      
      //bones
      
      push();
      translate(random_num(-width/3, width/3),random_num(0, height/12));
    
      noStroke();
      fill("snow")
      rect(width/2, height/2+height/18, width/25, height/300);
      rect(width/2+width/80, height/2+height/19, width/100, height/300);
        rect(width/2+width/80, height/2+height/17, width/100, height/300);
      rect(width/2, height/2+height/18, width/500, height/100);
      rect(width/2-width/100, height/2+height/18, width/500, height/100);
      rect(width/2-width/200, height/2+height/18, width/500, height/100);
      rect(width/2-width/70, height/2+height/18, width/500, height/60);
      rect(width/2-width/100, height/2+height/22, width/90, height/500);
       rect(width/2-width/100, height/2+height/15.5, width/90, height/500);
       ellipse(width/2-width/37, height/2+height/18, width/70, height/90);
        rect(width/2+width/300, height/2+height/22, width/100, height/500);
       rect(width/2+width/300, height/2+height/15.25, width/100, height/500);
         rect(width/2+width/28, height/2+height/19.5, width/55, height/500);
       rect(width/2+width/28, height/2+height/16, width/55, height/500);
        rect(width/2+width/60, height/2+height/20, width/60, height/500);
       rect(width/2+width/60, height/2+height/16.25, width/60, height/500);
      fill("#333333")
    circle(width/2-width/35.5, height/2+height/18+height/400, width/300);
      circle(width/2-width/35.5, height/2+height/18-height/400, width/300);
      rect(width/2-width/45, height/2+height/18+height/200, width/250, height/250);
        rect(width/2-width/45, height/2+height/18-height/200, width/250, height/250);
      pop();
      
     
    
      
    }
  
     //landscape barn section
     
    else if (var1>=.75) {
    noStroke();
        fill("#333333")
    rect(width/2, height*3.9/5, width*8.5/10, height/2);
    fill("white");
      
       rect(width/2, height/2-height/9, height/10.85,height/15);
      rect(width/2-height/7, height/2-height/30, height/12,height/8);
     rect(width/2+height/7, height/2-height/30, height/12,height/8);
    rect(width/2, height/2-height/15, (width/2+height/16+height/24)-(width/2-height/16-height/24),height/20);
     triangle(width/2, barnPeak, width/2-height/24, height/2-height/7.05, width/2+height/24, height/2-height/7.05);
       triangle(width/2-height/23.9, height/2-height/7.05, width/2-height/23.9, height/2-height/30-height/20, width/2-height/16-height/8.1, height/2 - height/30 - height/16.25);
      triangle(width/2+height/23.9, height/2-height/7.05, width/2+height/23.9, height/2-height/30-height/20, width/2+height/16+height/8.1, height/2 - height/30 - height/16.25);
      
      fill("#333333")
      rect(width/2-(height/15+height/3.5)/2-height/300, height/2-height/31, height/70, height/8);
       rect(width/2+(height/15+height/3.5)/2+height/300, height/2-height/31, height/70, height/8);
      
      fill("#AAAAAA");
      rect(width/2-(height/15+height/3.5)/2, height/2-height/31, height/100, height/8);
       rect(width/2+(height/15+height/3.5)/2, height/2-height/31, height/100, height/8);
      rect(width/2-(height/35+height/6)/2, height/2-height/35, height/100, height/8);
       rect(width/2+(height/35+height/6)/2, height/2-height/35, height/100, height/8);
       rect(width/2, height/2-height/31-height/18, height/2.9, height/100);
       rect(width/2, height/2-height/25, height/2.9, height/100);
      rect(width/2, height/2-height/9, height/100, height/7.5);
      
      //roof section
      
      strokeWeight(height/160)
   stroke("black")
    line(width/2-(height/11+height/3.5)/2, height/2-height/9+height/50, width/2-height/24, (height/2-height/9)-height/32);
   line(width/2+(height/11+height/3.5)/2, height/2-height/9+height/50, width/2+height/24, (height/2-height/9)-height/32);
    line(width/2, barnPeak, width/2+height/24, (height/2-height/9)-height/32);
      line(width/2, barnPeak, width/2-height/24, (height/2-height/9)-height/32);
  
      
     
       
      //ground mass
      
      fill("#333333")
    rect(width/2, height*3.9/5, width*8.5/10, height/2);
      
      //bones
      
      push();
      translate(random_num(-width/4, width/4),random_num(0, height/12));
 
      noStroke();
      fill("snow")
      rect(width/2, height/2+height/18, height/25, height/300);
      rect(width/2+height/80, height/2+height/19, height/100, height/300);
        rect(width/2+height/80, height/2+height/17, height/100, height/300);
      rect(width/2, height/2+height/18, height/500, height/100);
      rect(width/2-height/100, height/2+height/18, height/500, height/100);
      rect(width/2-height/200, height/2+height/18, height/500, height/100);
      rect(width/2-height/70, height/2+height/18, height/500, height/60);
      rect(width/2-height/100, height/2+height/22, height/90, height/500);
       rect(width/2-height/100, height/2+height/15.5, height/90, height/500);
       ellipse(width/2-height/37, height/2+height/18, height/70, height/90);
        rect(width/2+height/300, height/2+height/22, height/100, height/500);
       rect(width/2+height/300, height/2+height/15.25, height/100, height/500);
         rect(width/2+height/28, height/2+height/19.5, height/55, height/500);
       rect(width/2+height/28, height/2+height/16, height/55, height/500);
        rect(width/2+height/60, height/2+height/20, height/60, height/500);
       rect(width/2+height/60, height/2+height/16.25, height/60, height/500);
      fill("#333333")
    circle(width/2-height/35.5, height/2+height/18+height/400, height/300);
      circle(width/2-height/35.5, height/2+height/18-height/400, height/300);
      rect(width/2-height/45, height/2+height/18+height/200, height/250, height/250);
        rect(width/2-height/45, height/2+height/18-height/200, height/250, height/250);
      pop();
      
    
       
      
      
  
    }}
  
  }
  
  
  
  
  //More Texture
  
  for (let o = 1; o < random_num(9000, 10000); o++) {
        let o = random_num(0,buffer)
      stroke("snow")
     noFill();
     strokeWeight(min(width,height)/50000)
      angleMode(DEGREES)
circle(random_num(-width/2, width+width/2), random_num(-height/2, height+height/2), o);}
  
    for (let o = 1; o < random_num(9500,9600); o++) {
        let o = random_num(0,buffer)
      stroke("white")
     noFill();
     strokeWeight(min(width,height)/50000)
      angleMode(DEGREES)
circle(random_num(-width/2, width+width/2), random_num(-height/2, height+height/2), o);}
  
  
  //rain
  if (section<.15 && rain>.95){
     for (let o = 1; o < random_num(9000,9600); o++) {
        let o = random_num(height/2+width/12-height/36, height/2+width/12+height/36)
        stroke("rgb(92,125,160)")  
     noFill();
     strokeWeight(min(width,height)/500)
      angleMode(DEGREES)
circle(random_num(width/15, (width*14)/15), random_num(height/15, (height*14)/15), fxrand()*.1);
    
  }}
   
        if (var1<.75 && var1>.35){
   fill("white");
     noStroke();
     rect(width/2, height/16, width/1.11, height/29);
     rect(width/2, 15*height/16, width/1.11, height/29);
     rect(width/16.5, height/2, width/30, height/1.1);
     rect(15.5*width/16.5, height/2, width/30, height/1.1); }
     
  
  
    
  
  
   
  
  if (var1>.75){
     fill("white");
     noStroke();
     rect(width/27, height/2, width/12, height);
     rect(26*width/27, height/2, width/12, height);
    rect(width/2, height/26, width, height/13);
      rect(width/2, 25*height/26, width, height/13);
  }
   else if (var1>.35){
    fill("white");
     noStroke();
     rect(width/26, height/2, width/12, height);
     rect(25*width/26, height/2, width/12, height);
    rect(width/2, height/40, width, height/9.35);
      rect(width/2, 39*height/40, width, height/9.35);
  }
  else {
     fill("white");
     noStroke();
     rect(width/26, height/2, width/12, height);
     rect(25*width/26, height/2, width/12, height);
    rect(width/2, height/40, width, height/9.3);
      rect(width/2, 39*height/40, width, height/9.3);
  }
 


  noLoop();
  fxpreview();
  
  
}



window.$fxhashFeatures = {
  
   "Subject": getSubject(subject),
   "Time of Day": getTime(time),
   "Weather": getWeather(outside),
   "Out of the Ordinary": getUnordinary(unordinary)
   
  }

function keyPressed(){
  
  if (keyCode === DOWN_ARROW) {
    saveCanvas("OrdinaryPlaces", "png");
  }

  noLoop();

}