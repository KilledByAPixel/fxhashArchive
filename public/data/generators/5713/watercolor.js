class Watercolor{
  constructor(){
    this.center = createVector(rand(0, width), rand(0, height));

    this.minR = rand(dim*0.001, dim*0.01);
    this.maxR = this.minR * rand(15, 40);
    this.noiseRadius = 0.5;

    this.numPoints = 200;
    this.aGap = 360/this.numPoints;

    let nx = map(this.center.x, 0, width, 0, 1000) * sx.watercolRes;
    let ny = map(this.center.y, 0, height, 0, 1000) * sx.watercolRes;

    let colN = noise(nx, ny, 656465);
    let colChoice = int(map(colN, 0, 1, 0, sx.palette.watercolor.length));

    this.col = sx.palette.watercolor[colChoice];
    this.col = color(this.col);
    this.col.setAlpha(10);

    this.generatePoints();
  }

  resize(){
    for (let p of this.points){
      p.x = map(p.x, 0, prevDim, 0, dim);
      p.y = map(p.y, 0, prevDim, 0, dim);
    }
  }

  generatePoints(){
    this.points = [];

    for (let i = 0; i < this.numPoints; i++){
      let a = i * this.aGap;

      let nx = this.center.x + sin(a) * this.noiseRadius;
      let ny = this.center.y + cos(a) * this.noiseRadius;

      let d = map(noise(nx, ny, 4562), 0, 1, this.minR, this.maxR);

      let x = this.center.x + sin(a) * d;
      let y = this.center.y + cos(a) * d;

      this.points.push(createVector(x, y));

    }
  }

  display(){

    textureCanvas.noStroke();
    textureCanvas.fill(this.col);
    textureCanvas.beginShape();
    for(let p of this.points){
      textureCanvas.vertex(p.x, p.y);
    }
    textureCanvas.endShape();
  }
}
