 
 




function comp_style4(x,y,dm,v1){
 if(arguments.length<4){console.error("comp_style4 give a 4 arguments");}
 this.objArray = []; 
 let lis1 = [1,2,3];
 let lis2 = [1,2];
 let lis3 = [1,1,2]; 
 
 this.dm = dm/v1;
 
 for(let xi=0;xi<v1;xi++){
   for(let yi=0;yi<v1;yi++){
     let num1 =  lis1[int(fxrand()*lis1.length)] ;
     let sirect =this.dm/num1;
     for(let xb=0;xb<num1;xb++){
       for(let yb=0;yb<num1;yb++){
         let num2 = lis2[int(fxrand()*lis2.length)] ;
         let sirect1 =sirect/num2;
         for(let xn=0;xn<num2;xn++){
           for(let yn=0;yn<num2;yn++){
               let num3 = lis3[int(fxrand()*lis3.length)] ;
               let sirect2 =sirect1/num3;
               for(let xt=0;xt<num3;xt++){
                 for(let yt=0;yt<num3;yt++){ 
                   this.objArray.push( {x: this.dm*xi+sirect*xb+sirect1*xn+sirect2*xt +x , y: this.dm*yi+sirect*yb+sirect1*yn+sirect2*yt +y ,w: sirect2 , h:sirect2 });
                 }
               }
             }
           }   
         }
       }
     }
   }
   
   
  return this.objArray; 
}
 




function comp_style5(x,y,w,h,v1,v2){
 if(arguments.length<6){console.error("comp_style5 give a 6 arguments");}
 this.objArray = []; 
 let lis1 = [1,2,3,4];
 this.w = w/v1;
 this.h = h/v2;
 for(let xi=0;xi<v1;xi++){
   for(let yi=0;yi<v2;yi++){
     let num1 = lis1[int(fxrand()*lis1.length)] ;
     let num2 = lis1[int(fxrand()*lis1.length)] ;
     let sirectx = this.w/num1;
     let sirecty = this.h/num2;
     for(let xb=0;xb<num1;xb++){
       for(let yb=0;yb<num2;yb++){
         let num3 = lis1[int(fxrand()*lis1.length)];
         let num4 = lis1[int(fxrand()*lis1.length)];
         let sirectx1 = sirectx/num3;
         let sirecty1 = sirecty/num4;
         for(let xn=0;xn<num3;xn++){
           for(let yn=0;yn<num4;yn++){
               let num5 = lis1[int(fxrand()*lis1.length)];
               let num6 = lis1[int(fxrand()*lis1.length)];
               let sirectx2 = sirectx1/num5;
               let sirecty2 = sirecty1/num6;
               for(let xt=0;xt<num5;xt++){
                 for(let yt=0;yt<num6;yt++){ 
                   this.objArray.push( {x: this.w*xi+sirectx*xb+sirectx1*xn+sirectx2*xt +x , y: this.h*yi+sirecty*yb+sirecty1*yn+sirecty2*yt +y ,w: sirectx2 , h:sirecty2 });
                 }
               }
             }
           }   
         }
       }
     }
   }
  return this.objArray; 
}

 
 
 
 
 
function comp_style6 (x,y,w,h,v1,v2,v3,v4) {
  if(arguments.length<8){console.error("comp_style6 give a 8 arguments");}
  this.objArray =[];
  this.objArray.push({x:x,y:y,w:w,h:h}); 
  this.limtnum = v3;
  for (let i=0; i<v1; i++) {
    let numforobj=this.objArray.length;
    for (let j=0; j<numforobj; j++) {
      
      let rand1= fxrand()*(15); 
      let rand2= v2[int(fxrand()*v2.length)];
      let rand3= fxrand()*(10);
     
      let obj1 = {x:this.objArray[j].x, y:this.objArray[j].y, w:this.objArray[j].w, h:this.objArray[j].h};
      
      if (rand1 < 5 && this.objArray[j].w >=this.limtnum*2 ) {
        if(rand3< 5){
          this.varWidth = obj1.w-obj1.w/rand2;
        }else{
          this.varWidth = obj1.w/rand2;
        }
        this.objArray[j] = {x:this.objArray[j].x, y:this.objArray[j].y, w:int(constrain(this.varWidth, this.limtnum, obj1.w-this.limtnum)), h:this.objArray[j].h};
        this.objArray.push( {x:obj1.x+this.objArray[j].w, y:this.objArray[j].y, w:int(obj1.w- this.objArray[j].w), h:this.objArray[j].h});
        
        
      } else if (rand1 < 10 && rand1 > 5 &&   this.objArray[j].h >=this.limtnum*2 ) {
        if(rand3< 5){
          this.varHeight = obj1.h-obj1.h/rand2;
        }else{
          this.varHeight = obj1.h/rand2;
        }
        
        this.objArray[j] = {x:this.objArray[j].x, y:this.objArray[j].y, w:this.objArray[j].w, h:int(constrain(this.varHeight, this.limtnum, obj1.h-this.limtnum))};
        this.objArray.push( {x:obj1.x, y:this.objArray[j].y+this.objArray[j].h, w:this.objArray[j].w, h:int(obj1.h-this.objArray[j].h)});
        
      }
      
    }
 
  }
  
 this.objArray.shuffle();
 if(v4>1){
   this.lOA =1; 
 }else if(v4<0){
   this.lOA =0; 
 }else{
   this.lOA =v4;  
 }
 this.objArray= this.objArray.slice(0,int(this.objArray.length*this.lOA));

 return this.objArray;
 
}

 
 
 
 
 
 
 
function comp_style7(vx,vy,dw,dh){
 
   this.objArray = [] ; 
   this.y =vy;
   this.floorW=7;
   this.cileW=(fxrand()*(12)+6)*10;
   this.floorH=7;
   this.cileH=(fxrand()*(12)+6)*10;
   let arrRand1 =[3,4,3,4,3,4,5,5,6,6,7,7,7,8,9,10,10,10,12,15,20,20,20,20,20,20,20,20,30,30,30,30,30,30,40,40,40,40,40 ];
   this.rhythm = arrRand1[int(fxrand()*arrRand1.length)]; 
   this.rhythmCompare =0; 
   this.limitW= dw;
   this.limitH= dh;
   
   this.Scl = int((fxrand()*(19)+1))  ;
   this.mulreducY =1; // Reducer and increaser of the scale Y varible
 
   this.h  = int((fxrand()*(this.cileH-this.floorH)+this.floorH)) ;
   this.w  = int((fxrand()*(this.cileW-this.floorW)+this.floorW)) ;





   // this to try fill shape on y axis  
   while( this.y - this.h  < this.limitH- this.h *2 ){
 
     // this to try fill shape on x axis  
     this.x  = vx;
     this.mulreducX =1; // Reducer and increaser of the scale X varible
     if(this.rhythmCompare%this.rhythm==0){
       this.randvar2 = 0; //random([0,0,0,2,1,2,0])
       this.Scl = int((fxrand()*(19)+1)) ;
     }
 
     while( this.x-this.w   < this.limitW-this.w *2  ){ 
 
      this.objArray.push({x:this.x,y:this.y,w:this.w+vx ,h:this.h+vy });
      
      this.x += this.w ;
      
      this.w += this.Scl*this.mulreducX; 
      
      if(this.w <this.floorW || this.randvar2 == 1){
        this.mulreducX = 1; 
      }else if(this.w >this.cileW|| this.randvar2 == 2){
        this.mulreducX = -1;  
      }
 
      if(this.w >this.cileW ){
       this.w=this.cileW;
      }else if(this.w < this.floorW){
       this.w=this.floorW; 
      }
      
 
    } 
  
  
  
    // this fill all demenision x axis 
    this.objArray.push({x:this.x,y:this.y,w:this.limitW+vx-this.x,h:this.h+vy });
    
    this.y +=this.h ;
    this.h +=this.Scl*this.mulreducY; 
    
    if(this.h <this.floorH || this.randvar2 == 1){
      this.mulreducY = 1; 
    }else if(this.h >this.cileH || this.randvar2 == 2){
      this.mulreducY = -1;  
    }
     
    if(this.h >this.cileH ){
      this.h =this.cileH;
    }else if(this.h < this.floorH){
      this.h =this.floorH; 
    }
 
 
    this.rhythmCompare++;
      
  }
  
  
  
  
  // this fill all demenision y axis 
  
  this.x =vx;
  this.mulreducX =1; // Reducer and increaser of the scale X varible
  while( this.x-this.w   < this.limitW-this.w *2  ){ 
    this.objArray.push({x:this.x,y:this.y,w:this.w+vx ,h:this.limitH+vy-this.y});
    this.x +=this.w ;
    this.w +=this.Scl*this.mulreducX; 
    if(this.w <this.floorW){
      this.mulreducX = 1; 
    }else if(this.w >this.cileW){
      this.mulreducX = -1;  
    }
  } 
  this.objArray.push({x:this.x,y:this.y,w:this.limitW+vx-this.x,h:this.limitH+vy-this.y});
  
 
 
 
 
 
 
  return this.objArray;
  
}
 
 
 
function comp_style8(x,y,w,h,v1,v2){
 
  
  this.objArray =[];

  let scaleArrayX=[];
  let scaleArrayY=[];
  this.scaleStyle= [2,4,2,2,4,2,2,4,2,4,2,4,6,8,2,4,6,8,10,20,20,20,15,30,30,40];
  for(let i=0;i<v1;i++){
    scaleArrayX.push(scaleNum(int(this.scaleStyle[int(fxrand()*this.scaleStyle.length)]),2)*8);
  }
  for(let i=0;i<v2;i++){
    scaleArrayY.push(scaleNum(int((fxrand()*(11)+1)),2)*8);
  }
  let idxX=0;
  let idxY=0;
  for(let ix=0;ix<w;ix+= scaleArrayX[ idxX % scaleArrayX.length ]){
    for(let iy=0;iy<h;iy+= scaleArrayY[ idxY % scaleArrayY.length ]){
      
       this.objArray.push({x:ix-scaleArrayX[ idxX % scaleArrayX.length ],y:iy-scaleArrayY[ idxY % scaleArrayY.length ],w:scaleArrayX[ idxX % scaleArrayX.length ],h:scaleArrayY[ idxY % scaleArrayY.length ]});
       idxY++;
    }
    idxX++;
  }
  
  
  return this.objArray;
  
}
 
 
 
 
 
 
 
 
 
 
 
