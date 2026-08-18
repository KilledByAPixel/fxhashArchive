class Chevron extends Doodle {
  generate(){
    this.shapeName = "chevron";

    // Sizing and location
    this.radius = rand(special.chevrons.radius.min, special.chevrons.radius.max);
    this.center.x += rand(-dim*0.005, dim*0.005);
    this.center.y += rand(-dim*0.005, dim*0.005);
    this.sw = rand(sx.strokeWeight.min, sx.strokeWeight.max);
    this.numSides = 3;
    this.outerA = 30;

    // Choose large
    if(special.chevrons.large){
      this.radius = rand(special.chevrons.radiusLarge.min, special.chevrons.radiusLarge.max);
      this.large = true;
      this.sw = rand(sx.strokeWeight.min*2, sx.strokeWeight.max*2);
    }

    // After sizing calculations
    this.pRad = this.sw * 0.65;
    this.pathPointGap = max(sx.pathPointGap, this.sw * 0.4);

    this.angleGap = 360 / this.numSides;
    this.angles = [];
    this.sideLength = (cos(this.outerA) * this.radius) * 2;
    this.tilt = special.chevrons.a + 60 + rand(-10, 10);

    this.createShape();
    this.createPoints();

  }

  createPoints(){
    this.points = [];
    for (let i = 0; i < this.numSides-1; i++){
      let a = (180 - this.outerA) + i * this.angleGap + this.tilt;

      for (let j = 0; j < 999999; j++){
        let d = j * this.pathPointGap;
        if (d > this.sideLength) break;
        else{
          this.points.push({
            rad: this.pRad,
            position: createVector(
            this.drawPoints[i].x + sin(a) * d,
            this.drawPoints[i].y + cos(a) * d
          )});
        }
      }
    }
  }

  createShape(){
    this.drawPoints = [];
    for (let i = 0; i < this.numSides; i++){
      let a = i * this.angleGap + this.tilt;

      this.drawPoints.push(createVector(
        this.center.x + sin(a) * this.radius,
        this.center.y + cos(a) * this.radius
      ));
    }
  }

  display(cnv){
    cnv.strokeWeight(this.sw);
    cnv.stroke(this.col);
    cnv.noFill();

    cnv.beginShape();
    for(let p of this.drawPoints){
      cnv.vertex(p.x, p.y);
    }
    cnv.endShape();

  }

}
