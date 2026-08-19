class Face{
    constructor(base,edgelength,orientation,direction = "up"){
      this.base = base;
      this.edgelength =edgelength;
      this.points =[];
      this.debugMode = false;
      this.orientation = orientation
      this.angle;
      this.midPoint ;
      this.corners ={};
      this.direction=direction;
    }
  createFace(){
    
      if (this.orientation === "right" || this.orientation === "left") {
  
        if (this.direction === "up") {
          if (this.orientation === "right") {
            this.angle = 330;
          }
          if (this.orientation === "left") {
            this.angle = 210;
          }
        }
  
        if (this.direction === "down") {
          if (this.orientation === "right") {
            this.angle = 30;
          }
          if (this.orientation === "left") {
            this.angle = 150;
          }
        }
        let A = this.base;
        let D = createVector(A.x, A.y + this.edgelength);
        let B = getPoints(this.base.x, this.base.y, this.angle, this.edgelength)
        let C = getPoints(D.x, D.y, this.angle, this.edgelength)
        this.points = [A, B, C, D]
        this.corners = { A: A, B: B, C: C, D: D }
        this.midPoint = getPoints(this.base.x, this.base.y + this.edgelength / 2, this.angle, this.edgelength / 2)
      }
  
      if (this.orientation === "top") {
        let A, B, C, D;
  
        if (this.direction === "up") {
          A = this.base;
          B = getPoints(this.base.x, this.base.y, 210, this.edgelength);
          C = getPoints(B.x, B.y, 330, this.edgelength);
          D = getPoints(C.x, C.y, 30, this.edgelength)
          this.midPoint = createVector(this.base.x, this.base.y - this.edgelength / 2);
        }
        if (this.direction === "down") {
          A = createVector(this.base.x, this.base.y + this.edgelength);
          B = getPoints(A.x, A.y, 150, this.edgelength);
          C = getPoints(B.x, B.y, 30, this.edgelength);
          D = getPoints(C.x, C.y, 330, this.edgelength)
          this.midPoint = createVector(this.base.x, this.base.y + this.edgelength / 2);
        }
  
        this.points = [A, B, C, D]
        this.corners = { A: A, B: B, C: C, D: D }
      }
  
  
  
    }
  display(canvas,color=""){
   
    canvas.angleMode(RADIANS)
    canvas.beginShape();
  // // noStroke()
  canvas.strokeWeight(1.5*canvas.width/1000);
  canvas.stroke(color) 
  canvas.noFill();
  for(let i=0;i<this.points.length;i++){
      
        canvas.vertex(this.points[i].x,this.points[i].y)
        //vertex(this.points[i].x+10,this.points[i].y+10)
      }
   canvas.endShape(CLOSE);
   //canvas.stroke(0)
  
  
  }
  
  displayCenter(index,canvas){
  //  canvas.strokeWeight(1*width/1000);
    canvas.textSize(10);
   canvas.text(index, this.midPoint.x,this.midPoint.y)
  }
  
  logLengths(){
  console.log("A->D: "+this.points[0].dist(this.points[2]))
  }
  
  displayCorners(){
    let corners = ["A","B","C","D"];
    for(let i =0;i<this.points.length;i++){
      textAlign(CENTER);
      fill(0);
      noStroke();
      text(corners[i],this.points[i].x,this.points[i].y)
    }
  }
  
  }
  

  function getPoints(x,y,angle,length){
    return createVector(x+cos(angle)*length,
   y+sin(angle)*length)
  }