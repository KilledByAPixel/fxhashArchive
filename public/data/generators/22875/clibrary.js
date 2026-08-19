 
 


function shapeCenter(sca1){
  this.shapeArray = sca1;
  this.scVarX1=this.shapeArray[0].x;
  this.scVarX2=this.shapeArray[0].x;
  this.scVarY1=this.shapeArray[0].y;
  this.scVarY2=this.shapeArray[0].y;
  
  for(let is=0;is<this.shapeArray.length;is++){
    
    if( this.scVarX1 >  this.shapeArray[is].x  ){
      this.scVarX1=this.shapeArray[is].x;
    }
     if( this.scVarX2 <  this.shapeArray[is].x  ){
      this.scVarX2=this.shapeArray[is].x;
    }
    if( this.scVarY1 >  this.shapeArray[is].y  ){
      this.scVarY1=this.shapeArray[is].y;
    }
     if( this.scVarY2 <  this.shapeArray[is].y  ){
      this.scVarY2=this.shapeArray[is].y;
    }

  }
  
 
  
  
  this.varX = lerp(this.scVarX1,this.scVarX2,0.5);
  this.varY = lerp(this.scVarY1,this.scVarY2,0.5);
  return inte(new vec2(this.varX,0,this.varX,this.varY*1.5),new vec2(0,this.varY,this.varX*1.5,this.varY));
   
}

 


function inte(boid1, boid2) {

  var x1 = boid1.x1, x2 = boid1.x2, x3 = boid2.x1, x4 = boid2.x2;
  var y1 = boid1.y1, y2 = boid1.y2, y3 = boid2.y1, y4 = boid2.y2;

  var dem = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (dem == 0 ) {
    return;
  }
  var ua_num = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
  var ub_num = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);

  var ua = ua_num / dem;
  var ub = ub_num / dem;


  if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
    var x =  (x1 + ua * (x2 - x1));
    var y =  (y1 + ua * (y2 - y1));
    var v = {x:limitF(x,0), y:limitF(y,0)};
  
    return v;
  }

}
 
function scaleNum(v1,v2){
  return v1-(v1%v2);
}
 
 
 
 
function Smaller2D(v1,v2,v3){
 this.aArray=v3;
 this.bArray=[];
 for(let fcre=0;fcre<this.aArray.length;fcre++){
   this.conW = constrain(this.aArray[fcre].w-v2*2,v1,this.aArray[fcre].w-v2*2);
   this.conH = constrain(this.aArray[fcre].h-v2*2,v1,this.aArray[fcre].h-v2*2);
   this.bArray.push({x:this.aArray[fcre].x+(this.aArray[fcre].w-this.conW)/2,y:this.aArray[fcre].y+(this.aArray[fcre].h-this.conH)/2,w:this.conW,h:this.conH});
 }
 
  this.aArray.replace(this.bArray);
  return this.aArray;
  
}


function SmallerObj2D(v1,v2,v3){
 this.objfunc=v3;
  
 this.conW = constrain(this.objfunc.w-v2*2,v1,this.objfunc.w-v2*2);
 this.conH = constrain(this.objfunc.h-v2*2,v1,this.objfunc.h-v2*2);
 
 return {x:this.objfunc.x+(this.objfunc.w-this.conW)/2,y:this.objfunc.y+(this.objfunc.h-this.conH)/2,w:this.conW,h:this.conH} ;
  
}



function SmallerObj3D(v1,v2,v3){
 this.objfunc=v3;
  
 this.conW = constrain(this.objfunc.w-v2*2,v1,this.objfunc.w-v2*2);
 this.conH = constrain(this.objfunc.h-v2*2,v1,this.objfunc.h-v2*2);
 this.conD = constrain(this.objfunc.d-v2*2,v1,this.objfunc.d-v2*2);
 
 return {x:this.objfunc.x+(this.objfunc.w-this.conW)/2,y:this.objfunc.y+(this.objfunc.h-this.conH)/2,z:this.objfunc.z+(this.objfunc.d-this.conD)/2,w:this.conW,h:this.conH,d:this.conD} ;
  
}

function Smaller3D(v1,v2){
 this.aArray=v2;
 this.bArray=[];
 for(let fcre=0;fcre<this.aArray.length;fcre++){
   this.bArray.push({x:this.aArray[fcre].x+v1,y:this.aArray[fcre].y+v1,z:this.aArray[fcre].z+v1,w:this.aArray[fcre].w-v1*2,h:this.aArray[fcre].h-v1*2,d:this.aArray[fcre].d-v1*2});
 }
 
  this.aArray.replace(this.bArray);
  return this.aArray;
  
}
 
 

Object.prototype.indexobj = function(n) {
  return Object.keys(this)[n];
}


 

 

function difBetNums(v1,v2){
  if(abs(v1)>abs(v2)){
    this.v3 = abs(v1)-abs(v2);
  }else if(abs(v1)<abs(v2)){
    this.v3 = abs(v2)-abs(v1);
  }else {
    this.v3 = 0;
  }
  return this.v3;
}


 


 

function digitCounter(n1) {
  this.n1=int(n1);
  console.log(this.n1);
  this.n2=0;
  while (int(abs(this.n1))!=0) {
    this.n1/=10;
    this.n2++;
  }
  return this.n2;
  
}


 


function angle(xx1, yy1, xx2, yy2) {
 
  let var1 =  dist(xx2, yy2, xx1, yy1) ;
  let var2 =  dist(xx1, yy1, xx2, yy1) ;
  let var3 ;

  if (yy2 <=yy1 && xx2 <=xx1) {
    var3 = 90 - degrees(pow((var2 ) /(var1), 2)*PI/2);
  } else if (yy2 <=yy1 && xx1 <=xx2) { 
    var3 = 90 + degrees(pow((var2 ) /(var1), 2)*PI/2);
  } else if (yy1 <=yy2 && xx1 <=xx2) {
    var3 = 270 - degrees(pow((var2) /(var1), 2)*PI/2);
  } else if (yy1 < yy2 && xx2 < xx1) {
    var3 = 270 + degrees(pow((var2) /(var1), 2)*PI/2);
  }
 
  return var3 ;
}


 

function Parangle(x1, y1, x2, y2, n1) {
  let n2 = -n1/distance(x1, y1, x2, y2)*1.4143;
  let n3 = 0;
  return {x1 :limitF(lerp( x1, x2, n2), n3), y1 :limitF(lerp( y1, y2, n2),n3), x2  :limitF(lerp( x1, x2, 1-n2), n3), y2 :limitF(lerp( y1, y2, 1-n2), n3)};
  
}

 



function linefromangle(v1,v2,v3,a1){
   this.v1=v1;
   this.v2=v2;
   this.v3=v3;
   this.v4 = radians(a1);
   return { x1 :  sin(this.v4)*this.v3+this.v1 , y1 :  cos(this.v4)*this.v3+this.v2 , x2  : sin(this.v4)*this.v3*-1+this.v1, y2 : cos(this.v4)*this.v3*-1+this.v2} ;
   
 
}

 



function limitF(n, p) {
  return Math.floor(n*Math.pow(10, p))/Math.pow(10, p) ;
}


 



Array.prototype.cut=function() {
 
  let s, e ;
  if (arguments[1]) {
    s = arguments[0];
    e = arguments[1];
  } else {
    s = arguments[0];
    e = arguments[0];
  }
 
  this.replace(this.slice(0, s).concat(this.slice(e+1, this.length)));
 
}


 


Array.prototype.displacement=function(n1,n2){

  this.var1 = this.slice(n1,n1+1);
  this.cut(n1);
  this.splice(n2,0,this.var1[0]);
}



 

Array.prototype.clear=function() {
  while (this.length>0) {
    this.pop();
  }
}

 
Array.prototype.replace=function(a) {
  while (this.length>0) {
    this.pop();
  }
  for (let i of a) {
    this.push(i);
  }
}

 


Array.prototype.shuffle=function(){
  this.Arrlen = this.length;
  this.randIdx=0;
  while(this.Arrlen>0){
    
    this.randIdx = int(fxrand() * this.Arrlen);
    this.Arrlen--;

 
    [this[this.Arrlen], this[this.randIdx]] = [this[this.randIdx], this[this.Arrlen]];
  }
  
  
  
}
 

Array.prototype.attach=function() {
  this.conArray=[];
  for (let ic=0; ic<arguments.length; ic++) {
    for (let ib=0; ib<arguments[ic].length; ib++) {
      this.conArray.push(arguments[ic][ib]);
    }
  }
  while (this.length>0) {
    this.pop();
  }
  for (let i of this.conArray) {
    this.push(i);
  }
}


 
function vec() {

  if (arguments.length==2) {
    this.x=arguments[0];
    this.y=arguments[1];
  } else if (arguments.length==3) {
    this.x=arguments[0];
    this.y=arguments[1];
    this.z=arguments[2];
  }
}

 
function vec2() {

  if (arguments.length==4) {
    this.x1=arguments[0];
    this.y1=arguments[1];
    this.x2=arguments[2];
    this.y2=arguments[3];
  } else if (arguments.length==6) {
    this.x1=arguments[0];
    this.y1=arguments[1];
    this.z1=arguments[2];
    this.x2=arguments[3];
    this.y2=arguments[4];
    this.z2=arguments[5];
  }
}


 
 
function fixTodeg(){
 
  if(arguments[0]>=0){
    this.var1= arguments[0]%360;
  }else{
    this.var1= abs(arguments[0])%360;
    this.var1= 360-this.var1;
  }
 
  return this.var1%360;
}

 
