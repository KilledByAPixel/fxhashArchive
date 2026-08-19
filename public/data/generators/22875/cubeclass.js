











class cube{
  constructor(x,y,z,w,h,d,n1,fil){
  this.x=x;
  this.y=y;
  this.z=z;
  this.w=w;
  this.h=h;
  this.d=d;
  this.fillcol =fil;
  this.obj = [];
  this.e = [];
  this.f = [];
  this.f.push([],[],[],[],[],[]);
  for(let ff=0;ff<6;ff++){this.f[ff].push([]);}
  this.inSideCubs=[];
  this.outSideCubs=[]; 
  this.n1=n1;
  this.n2=this.n1  ; 
  this.e.push(new vec(0+this.x-this.n2,0+this.y-this.n1,0+this.z-this.n1));
  this.e.push(new vec(this.w+this.x+this.n2,0+this.y-this.n1,0+this.z-this.n1));
  
  this.e.push(new vec(this.w+this.x+this.n1,0+this.y+this.n1,0+this.z-this.n2));
  this.e.push(new vec(this.w+this.x+this.n1,0+this.y+this.n1,this.d+this.z+this.n2));
  
  this.e.push(new vec(this.w+this.x+this.n2,0+this.y-this.n1,this.d+this.z+this.n1));
  this.e.push(new vec(0+this.x-this.n2,0+this.y-this.n1,this.d+this.z+this.n1));
  
  this.e.push(new vec(0+this.x-this.n1,0+this.y-this.n1,this.d+this.z+this.n2));
  this.e.push(new vec(0+this.x-this.n1,0+this.y-this.n1,0+this.z-this.n2));
  
  this.e.push(new vec(0+this.x-this.n1,0+this.y-this.n2,0+this.z-this.n1));
  this.e.push(new vec(0+this.x-this.n1,this.h+this.y+this.n2,0+this.z-this.n1));
  
  this.e.push(new vec(this.w+this.x+this.n1,0+this.y-this.n1,0+this.z-this.n1));
  this.e.push(new vec(this.w+this.x+this.n1,this.h+this.y+this.n1,0+this.z-this.n1));
  
  this.e.push(new vec(this.w+this.x+this.n1,0+this.y-this.n2,this.d+this.z+this.n1));
  this.e.push(new vec(this.w+this.x+this.n1,this.h+this.y+this.n2,this.d+this.z+this.n1));
  
  this.e.push(new vec(0+this.x-this.n1,this.h+this.y+this.n2,this.d+this.z+this.n1));
  this.e.push(new vec(0+this.x-this.n1,0+this.y-this.n2,this.d+this.z+this.n1));
  
  
  this.e.push(new vec(0+this.x-this.n2,this.h+this.y+this.n1,this.d+this.z+this.n1));
  this.e.push(new vec(this.w+this.x+this.n2,this.h+this.y+this.n1,this.d+this.z+this.n1));
  
  this.e.push(new vec(this.w+this.x+this.n1,this.h+this.y+this.n1,0+this.z-this.n2));
  this.e.push(new vec(this.w+this.x+this.n1,this.h+this.y+this.n1,this.d+this.z+this.n2));
  
  this.e.push(new vec(this.w+this.x+this.n2,this.h+this.y+this.n1,0+this.z-this.n1));
  this.e.push(new vec(0+this.x-this.n2, this.h+this.y+this.n1,0+this.z-this.n1));
  
  this.e.push(new vec(0+this.x-this.n1,this.h+this.y+this.n1,this.d+this.z+this.n2));
  this.e.push(new vec(0+this.x-this.n1,this.h+this.y+this.n1,0+this.z-this.n2));
  
 
 
 
 
  // Right
 
  this.f[0][0].push(new vec(0+this.x,0+this.y,0+this.z));
  this.f[0][0].push(new vec(this.w+this.x,0+this.y,0+this.z));
  this.f[0][0].push(new vec(this.w+this.x,this.h+this.y,0+this.z));
  this.f[0][0].push(new vec(0+this.x,this.h+this.y,0+this.z));
  this.f[0][0].push(new vec(0+this.x,0+this.y,0+this.z));
 
 
  // Left
  this.f[1][0].push(new vec(0+this.x,0+this.y,this.d+this.z));
  this.f[1][0].push(new vec(this.w+this.x,0+this.y,this.d+this.z));
  this.f[1][0].push(new vec(this.w+this.x,this.h+this.y,this.d+this.z));
  this.f[1][0].push(new vec(0+this.x,this.h+this.y,this.d+this.z));
  this.f[1][0].push(new vec(0+this.x,0+this.y,this.d+this.z));
  
 
  // Back
  this.f[2][0].push(new vec(0+this.x,this.h+this.y,0+this.z));
  this.f[2][0].push(new vec(this.w+this.x,this.h+this.y,0+this.z));
  this.f[2][0].push(new vec(this.w+this.x,this.h+this.y,this.d+this.z));
  this.f[2][0].push(new vec(0+this.x,this.h+this.y,this.d+this.z));
  this.f[2][0].push(new vec(0+this.x,this.h+this.y,0+this.z));
 
 
  // Front
  this.f[3][0].push(new vec(0+this.x,0+this.y,0+this.z));
  this.f[3][0].push(new vec(this.w+this.x,0+this.y,0+this.z));
  this.f[3][0].push(new vec(this.w+this.x,0+this.y,this.d+this.z));
  this.f[3][0].push(new vec(0+this.x,0+this.y,this.d+this.z));
  this.f[3][0].push(new vec(0+this.x,0+this.y,0+this.z));
 
 
  // Top
  this.f[4][0].push(new vec(0+this.x,0+this.y,0+this.z));
  this.f[4][0].push(new vec(0+this.x,0+this.y,this.d+this.z));
  this.f[4][0].push(new vec(0+this.x,this.h+this.y,this.d+this.z));
  this.f[4][0].push(new vec(0+this.x,this.h+this.y,0+this.z));
  this.f[4][0].push(new vec(0+this.x,0+this.y,0+this.z));
 
 
  // Down
  this.f[5][0].push(new vec(this.w+this.x,0+this.y,0+this.z));
  this.f[5][0].push(new vec(this.w+this.x,0+this.y,this.d+this.z));
  this.f[5][0].push(new vec(this.w+this.x,this.h+this.y,this.d+this.z));
  this.f[5][0].push(new vec(this.w+this.x,this.h+this.y,0+this.z));
  this.f[5][0].push(new vec(this.w+this.x,0+this.y,0+this.z));
 
  }
  
  
  removefRight(){
    this.f[0] = [];
  }
  removefLeft(){
    this.f[1] = [];
  }
  removefBack(){
    this.f[2] = [];
  }
  removefFront(){
    this.f[3] = [];
  }
  removefTop(){
    this.f[4] = [];
  }
  removefDown(){
    this.f[5] = [];
  }
  
  
  removeFaces(){
    this.removefRight();
    this.removefLeft();
    this.removefBack();
    this.removefFront();
    this.removefTop();
    this.removefDown(); 
  }
  removeLines(){
    this.e.clear();
    
  }
  
 
  
  strokeStyle(v1 ){
    this.forNum1 = v1;
 
    
    
    for(let ei=1;ei<500;ei++){
      let xyVar = SmallerObj3D(0,ei*this.forNum1*(canDm/dm),this) ; 
      if( xyVar.h>0&&xyVar.d>0){  
        this.e.push(new vec(0+this.x-this.n1  ,0+xyVar.y ,xyVar.d+xyVar.z ));
        this.e.push(new vec(0+this.x-this.n1  ,0+xyVar.y ,0+xyVar.z ));
        this.e.push(new vec(0+this.x-this.n1  ,0+xyVar.y ,0+xyVar.z ));
        this.e.push(new vec(0+this.x-this.n1  ,xyVar.h+xyVar.y ,0+xyVar.z ));
        this.e.push(new vec(0+this.x-this.n1  ,xyVar.h+xyVar.y ,xyVar.d+xyVar.z ));
        this.e.push(new vec(0+this.x-this.n1  ,0+xyVar.y   ,xyVar.d+xyVar.z ));
        this.e.push(new vec(0+this.x-this.n1  ,xyVar.h+xyVar.y ,xyVar.d+xyVar.z ));
        this.e.push(new vec(0+this.x-this.n1  ,xyVar.h+xyVar.y ,0+xyVar.z ));
      }
 
    }
 
    for(let ei=1;ei<500;ei++){
      let xyVar = SmallerObj3D( 0,ei*this.forNum1*(canDm/dm),this) ;
      if( xyVar.h>0&&xyVar.w>0){  
        this.e.push(new vec(  xyVar.w+xyVar.x   ,0+xyVar.y  ,this.d+this.z+this.n1));
        this.e.push(new vec(  0+xyVar.x  ,0+xyVar.y   ,this.d+this.z+this.n1));
        this.e.push(new vec(  xyVar.w+xyVar.x   ,0+xyVar.y   ,this.d+this.z+this.n1));
        this.e.push(new vec(  xyVar.w+xyVar.x   ,xyVar.h+xyVar.y ,this.d+this.z+this.n1));
        this.e.push(new vec(  0+xyVar.x  ,xyVar.h+xyVar.y  ,this.d+this.z+this.n1));
        this.e.push(new vec(  0+xyVar.x  ,0+xyVar.y  ,this.d+this.z+this.n1));
        this.e.push(new vec(  0+xyVar.x  ,xyVar.h+xyVar.y   ,this.d+this.z+this.n1));
        this.e.push(new vec(  xyVar.w+xyVar.x   ,xyVar.h+xyVar.y   ,this.d+this.z+this.n1));
      }
    
    }
 
    for(let ei=1;ei<500;ei++){
      let xyVar = SmallerObj3D(  0,ei*this.forNum1*(canDm/dm),this) ;
      if( xyVar.d>0&&xyVar.w>0){  
        this.e.push(new vec(  0+xyVar.x     ,  this.h+this.y+this.n1  ,  xyVar.d+xyVar.z   ));
        this.e.push(new vec(  xyVar.w+xyVar.x   ,  this.h+this.y+this.n1  ,  xyVar.d+xyVar.z   ));
        this.e.push(new vec(  xyVar.w+xyVar.x   ,  this.h+this.y+this.n1  ,  0+xyVar.z       ));
        this.e.push(new vec(  xyVar.w+xyVar.x   ,  this.h+this.y+this.n1  ,  xyVar.d+xyVar.z  ));
        this.e.push(new vec(  xyVar.w+xyVar.x  ,  this.h+this.y+this.n1  ,  0+xyVar.z        ));
        this.e.push(new vec(  0+xyVar.x      ,   this.h+this.y+this.n1  ,  0+xyVar.z       ));
        this.e.push(new vec(  0+xyVar.x        ,  this.h+this.y+this.n1  ,  xyVar.d+xyVar.z   ));
        this.e.push(new vec(  0+xyVar.x       ,  this.h+this.y+this.n1  ,  0+xyVar.z        ));
      }
    }
    
   
    
  }
  
  
  
  
  
 
  
  
  
   
   showCube(){   
        fill(this.fillcol);
        for(let i=0;i<this.f.length;i++){
           push();
           noStroke();
         if(i==1 && arguments[0]){
           fill(arguments[0]);
         }else if(i==2 && arguments[1]){
           fill(arguments[1]);
         }else if(i==4 && arguments[2]){
           fill(arguments[2]);
         }
        
         for(let j=0;j<this.f[i].length;j++){
           beginShape();
           for(let k=0;k< this.f[i][j].length   ;k++){
             let p =this.f[i][j][k];
             vertex(p.x,p.y,p.z);
           }
           endShape(CLOSE);
         
         }
          pop(); 
        }
     
    
        
        for(let i=0;i<this.e.length;i+=2){
           let p1 =this.e[i];
           let p2 =this.e[i+1];
           line(p1.x,p1.y,p1.z,p2.x,p2.y,p2.z);
        }
 
   
        
        
   }
   
   
   
 
   
  
}
















 
