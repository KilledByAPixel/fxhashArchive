class StraightSidedShape extends Doodle {
  generate(info){
    this.numSides = info.numSides;

    if (this.numSides == 3) {
      this.outerA = 30;
      this.shapeName = "threeside";
    }
    if (this.numSides == 4) {
      this.outerA = 45;
      this.shapeName = "fourside";
    }

    // Sizing
    let maxRadius = map(this.attempt, 0, sx.numAttempts, sx.sidedShape.radius.max, sx.sidedShape.radius.max*0.6);
    let minRadius = map(this.attempt, 0, sx.numAttempts, sx.sidedShape.radius.min, sx.sidedShape.radius.min*0.6);
    this.radius = rand(minRadius, maxRadius);
    this.sw = rand(sx.strokeWeight.min, sx.strokeWeight.max);

    this.pRad = this.sw * 0.5;

    // Choose mega and large
    this.large = false;
    if(info.large){  // mega
      this.radius = rand(special.mega.sidedShapeRad.min, special.mega.sidedShapeRad.max);
      this.large = true;
      this.sw = rand(special.mega.strokeWeight.min, special.mega.strokeWeight.max);
      this.pRad = this.sw * 0.6;
    }
    else if(sx.varigatedMode != "off"){

      if(sx.varigatedMode == "down") {
        this.radius *= map(this.center.y, 0, height, sx.varigateMinMult, sx.varigateMaxMult);
        this.sw = map(this.center.y, 0, height, sx.strokeWeight.min, sx.strokeWeight.max);
      }
      if(sx.varigatedMode == "up") {
        this.radius *= map(this.center.y, height, 0, sx.varigateMinMult, sx.varigateMaxMult);
        this.sw = map(this.center.y, height, 0, sx.strokeWeight.min, sx.strokeWeight.max);

      }
      if(sx.varigatedMode == "left") {
        this.radius *= map(this.center.x, width, 0, sx.varigateMinMult, sx.varigateMaxMult);
        this.sw = map(this.center.x, height, 0, sx.strokeWeight.min, sx.strokeWeight.max);
      }
      if(sx.varigatedMode == "right") {
        this.radius *= map(this.center.x, 0, width, sx.varigateMinMult, sx.varigateMaxMult);
        this.sw = map(this.center.x, 0, width, sx.strokeWeight.min, sx.strokeWeight.max);
      }


      this.pRad = this.sw * 0.55;
    }
    else if(rand(0,1) < sx.largeChance){
      this.radius = rand(sx.sidedShape.radiusLarge.min, sx.sidedShape.radiusLarge.max);
      this.large = true;
      this.sw = rand(sx.largeStrokeWeight.min, sx.largeStrokeWeight.max);
      this.pRad = this.sw * 0.6;
    }

    // Choose fill or stroke
    this.fill = false;
    if (rand(0,1) < 0.7 && !this.large) this.fill = true;

    // After sizing calculations
    this.pathPointGap = max(sx.pathPointGap, this.sw * 0.5);
    this.angleGap = 360 / this.numSides;
    this.angles = [];
    this.sideLength = (cos(this.outerA) * this.radius) * 2;

    // Choose angle
    let nX = map(this.center.x, 0, width, 0, 1000) * sx.sidedShape.angle.res;
    let nY = map(this.center.y, 0, height, 0, 1000) * sx.sidedShape.angle.res;
    let tiltN = noise(nX, nY);
    this.tilt = map(tiltN, 0, 1, 0, 360);
    if (rand(0, 1) < 0.5) this.tilt += 180;

    this.createShape();
    this.createPoints();
  }

  createPoints(){
    this.points = [];
    for (let i = 0; i < this.numSides; i++){
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

      if (this.large){
        let a = i * this.angleGap + this.tilt;
        let pRad = this.pRad * 1.02;
        let rad = this.radius * map(this.sw, special.mega.strokeWeight.min, special.mega.strokeWeight.max, 1.0, 1.01);
        if (this.numSides == 4) rad = this.radius;

        this.points.push({
          rad: pRad,
          position: createVector(
          this.center.x + sin(a) * rad,
          this.center.y + cos(a) * rad,
        )})
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
    if(this.fill){
      cnv.fill(this.col);
      cnv.noStroke();
    }
    else{
      cnv.strokeWeight(this.sw);
      cnv.stroke(this.col);
      cnv.noFill();
    }
    cnv.beginShape();
    for(let p of this.drawPoints){
      cnv.vertex(p.x, p.y);
    }
    cnv.endShape(CLOSE);
  }

}
