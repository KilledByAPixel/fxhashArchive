// Boxes
// coding by erfanhoseini.xyz :)
 
let dm =1080 ;
let cubs=[];
let c ;
let canDm;
function setup() {
  canDm = min(windowWidth,windowHeight);
  createCanvas(canDm,canDm,WEBGL); 
  noiseSeed(fxrand()*10000000);
  pixelDensity(2);
  smooth();
  background(155); 
  noFill();
  noStroke();
  ortho(-canDm / 2 , canDm / 2 , canDm / 2 , -canDm / 2 , -7000, 7000);
  camera(-184,168,168,583,-535,-510,-1000,-319,-309);
  c = new colorCollection();
  let allObj =[]; 
 
  ///// compostions lines
  let arrcomp1 = [ 5,8,8,9,10,10,10,15,10,18,10,10,20,25];
  let arrcomp2 = [7,6,8,8,10,15,15,20,20,10,20,30,20];
  let arrcomp3 = [ 7,7,8,6,8,8,10,15,15,10,20,10,10,20,20];
  let arrcomp4 = [[2],[2],[2],[2],[3],[3,5],[3,5,10]];
  let compVar1 = arrcomp1[int(fxrand()*arrcomp1.length)]; 
  let compVar2 = arrcomp2[int(fxrand()*arrcomp2.length)];
  let compVar3 = arrcomp3[int(fxrand()*arrcomp3.length)];
  let compVar4 = arrcomp4[int(fxrand()*arrcomp4.length)] ;
  let randComp =  fxrand()*34; 
  let rand2 = fxrand()*20;
 
   
  if(randComp<=7){
    allObj = comp_style5(0,0,2500,2500,int(compVar1/1.6),int(compVar3/1.6)); 
  }else if(randComp>7&&randComp<=14){
    allObj = comp_style4(0,0,2500,compVar1);
  }else if(randComp>14&&randComp <=21){
    allObj = comp_style6 (0,0,2500,2500,compVar1,compVar4,compVar2,1);
  }else if(randComp>21&&randComp<=28){
    allObj =comp_style7(0,0,2500,2500);
  }else if(randComp>28){
    allObj =comp_style8(0,0,2500,2500,3,8);
    
  }
  
  let rand10 = fxrand()*8;
  if( (allObj<70|| rand10>5 ) && randComp>14){
    let arrcomp5 = [ 2,2,3,2,2,3,4,4,4,5,5,8,8,8,10,15];
    let arrcomp6 = [4,5,6,4,5,6,6,8 ];
    let comp6Var6 = arrcomp6[int(fxrand()*arrcomp6.length)] ;
    let allObj2=[];
    let num4=0;
    for(let i=0;i<allObj.length;i++){
      let rand9 = fxrand()*10;
      let comp6Var5 = arrcomp5[int(fxrand()*arrcomp5.length)] ;
      if((num4<4&&allObj[i].w>30&&allObj[i].h>30) || (rand9>4&&allObj[i].w>40&&allObj[i].h>40)){
        allObj2 = allObj2.concat(comp_style6 (allObj[i].x,allObj[i].y,allObj[i].w,allObj[i].h,comp6Var5,[2],comp6Var6,1));
        allObj.cut(i);
        num4++;
      }
       
    }
    allObj= allObj.concat(allObj2);
  }
 
  
  allObj = Smaller2D(1,0.85 ,allObj);

  allObj.shuffle();
 


  // point dist array
  let pointDistArray=[];
  let arrpointnum = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,4,5,5,6,6 ];
  let numForpda= arrpointnum[int(fxrand()*arrpointnum.length)]; 
  let powNum = 2 ; 
  for(let i=0;i<numForpda;i++){
    if(allObj.length>600){
      pointDistArray.push({x:800+fxrand()*800,y:800+fxrand()*800,s:fxrand()*2700+300}); 
    }
  }
  let varNoise ;
  
    
  
  
  

   
 
   
   let varcol1;
   let varcol4;
   let rand7 = fxrand()*(10);
   let rand8 = fxrand()*(27); 
   let rand9 = fxrand()*(16);
   let rand11 = fxrand()*(20);
   let nRangnum = int(fxrand()*(c.conArrcol.length-2));
   let varcolStroke=0; 
   let n ;
   if(rand9<1.5){
     varcol1 = c.col3Color();
   }else if(rand9>1.5&&rand9<3){
     varcol1 = color(0);
   }
   
  
  
  //// add the cube from comp Array 
  
  
  
  
  let arrscalenum = [1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,5,5,5,5,1,1,1,2,2,2,2,2,5,5,5,5,10,10,10,10,15,1,10,20 ];
  let scaleNumVar= arrscalenum[int(fxrand()*arrscalenum.length)];
  let arrdnum = [ 60,60,60,100,150,80,100,150,150,200,150,200,80,100,150,200,200,150,150,150,80,100,150,200,250,250   ];
  let d= arrdnum[int(fxrand()*arrdnum.length)];
  let noiseVarAxisX=0.005;
  let noiseVarAxisY=0.005;
  let rand6 = fxrand()*10; 
  
  
  
  for(let i=0;i<allObj.length;i++){ 
     
    
      //////////////////////////////////////////////////////////
    
    
     if(((rand6<3.3 && cubs.length>800  ) || (rand6>3.3 && cubs.length>7000))&&rand7<2.2 &&randComp <27 ){
       varcol4 = c.col1Color();
     }else{
       if(rand8<=11){
         if(rand11<10){
           n =int(abs(sin(noise((allObj[i].x+allObj[i].w/2)*0.001,(allObj[i].y+allObj[i].h/2)*0.001 )*TWO_PI)*(c.conArrcol.length-nRangnum)));
         }else if(rand11>10&&rand11<15){
           n =int(abs(sin(noise((allObj[i].x+allObj[i].w/2)*0.002)*TWO_PI)*(c.conArrcol.length-nRangnum)));
         }else if(rand11>15&&rand11<20){
           n =int(abs(sin(noise((allObj[i].y+allObj[i].h/2)*0.002)*TWO_PI)*(c.conArrcol.length-nRangnum)));
         }
         varcol4 = c.col5Color(n); 
       }else if(rand8>11&&rand8<=15){
         varcol4 = c.col4Color();
       }else if(rand8>15&&rand8<=20){
         varcol4 = c.col3Color();
       }else if(rand8>20&&rand8<=25.95){
         varcol4 = c.col2Color();
       }else if(rand8>25.95 ){
         varcol4 = c.randomColor();
       }
       
     }
     
     let varcol5= fxrand()*26-13; 
     varcol4=color(red(varcol4)-varcol5,green(varcol4)-varcol5,blue(varcol4)-varcol5);
 
 
     //////////////////////////////////////////////////////////
     
     
     let distVar=0;
 
     let noiseVar=0,waveVar=0;
     for(let j=0;j<pointDistArray.length;j++){
       distVar += pointDistArray[j].s/dist(allObj[i].x+allObj[i].w/2 ,allObj[i].y+allObj[i].h/2  ,pointDistArray[j].x,pointDistArray[j].y);
     }
 
     distVar = map( (distVar )*100   , 0, 700 ,0,6);
     if(d>60){
       waveVar = pow(( distVar)/1,powNum); 
     }
  
     noiseVar = int(noise(allObj[i].x*noiseVarAxisX,allObj[i].y*noiseVarAxisY)*d);
     
     
     varNoise = scaleNum(constrain(waveVar + noiseVar,0,d*3+noiseVar/1.5 ) +10,scaleNumVar); 
 
     cubs.push(new cube( ( -1800-varNoise)*(canDm/dm),(allObj[i].x+dm/2)*(canDm/dm),(allObj[i].y+dm/2)*(canDm/dm),(30+varNoise)*(canDm/dm),(allObj[i].w)*(canDm/dm),(allObj[i].h)*(canDm/dm),0.7*(canDm/dm),varcol4) ); 
     if((allObj[i].w>50||allObj[i].h>50)&&rand6<5.5 ){
         let fornum1=scaleNum(fxrand()*23+4,2);
         cubs[i].strokeStyle(fornum1 );
     }
 
  }
   
 
 
   for(let l=0;l<cubs.length;l++){
     strokeWeight(2.8*(canDm/dm)); 
     stroke(varcolStroke);
     cubs[l].showCube(varcol1);
   }
  
   
 
 
}
 
function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(canvas,"Boxes","png");
  }  
}
 
function draw() {
 
}











 
 
 
 
 
 
 
 
