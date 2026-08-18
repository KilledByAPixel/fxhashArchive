class Circ extends Doodle {
  generate(info){
    this.shapeName = "circ";

    // Sizing
    let maxDia = map(this.attempt, 0, sx.numAttempts, sx.circ.dia.max, sx.circ.dia.max*0.6);
    let minDia = map(this.attempt, 0, sx.numAttempts, sx.circ.dia.min, sx.circ.dia.min*0.6);

    this.dia = rand(minDia, maxDia);
    this.sw = rand(sx.strokeWeight.min, sx.strokeWeight.max);
    this.pRad = this.sw * 0.5;


    // Choose Large
    this.large = false;
    if (info.large){  // mega
      this.large = true;
      this.mega = true;
      this.dia = rand(special.mega.circDia.min, special.mega.circDia.max);
      this.sw = rand(special.mega.strokeWeight.min, special.mega.strokeWeight.max);
      this.pRad = this.sw * 0.7;
    }
    else if(sx.varigatedMode != "off"){

      if(sx.varigatedMode == "down") {
        this.dia *= map(this.center.y, 0, height, sx.varigateMinMult, sx.varigateMaxMult);
        this.sw = map(this.center.y, 0, height, sx.strokeWeight.min, sx.strokeWeight.max);
      }
      if(sx.varigatedMode == "up") {
        this.dia *= map(this.center.y, height, 0, sx.varigateMinMult, sx.varigateMaxMult);
        this.sw = map(this.center.y, height, 0, sx.strokeWeight.min, sx.strokeWeight.max);
      }
      if(sx.varigatedMode == "left") {
        this.dia *= map(this.center.x, width, 0, sx.varigateMinMult, sx.varigateMaxMult);
        this.sw = map(this.center.x, width, 0, sx.strokeWeight.min, sx.strokeWeight.max);
      }
      if(sx.varigatedMode == "right") {
        this.dia *= map(this.center.x, 0, width, sx.varigateMinMult, sx.varigateMaxMult);
        this.sw = map(this.center.x, 0, width, sx.strokeWeight.min, sx.strokeWeight.max);
      }


      this.pRad = this.sw * 0.6;
    }
    else if(rand(0,1) < sx.largeChance){
      this.dia = rand(sx.circ.diaLarge.min, sx.circ.diaLarge.max);
      this.large = true;
      this.sw = rand(sx.largeStrokeWeight.min*0.5, sx.largeStrokeWeight.max*0.5);
      this.pRad = this.sw * 0.6;
    }

    // After sizing calcs
    this.radius = this.dia * 0.5;
    this.pathPointGap = max(sx.pathPointGap, this.sw);

    // Choose fill or stroke
    this.fill = false;
    if (rand(0,1) < 0.4 && !this.large) this.fill = true;

    this.generatePoints();
  }

  generatePoints(){
    this.points = [];
    let circumference = TWO_PI * this.radius;
    this.numPoints = (circumference / this.pathPointGap);

    let aGap = 360 / this.numPoints;

    for (let i = 0; i < this.numPoints; i++){
      let a = i * aGap;
      this.points[i] = {
        rad: this.pRad,
        position: createVector(
          this.center.x + sin(a) * this.radius,
          this.center.y + cos(a) * this.radius
        )
      }
    }


  }

  display(cnv){
    if (this.fill){
      cnv.fill(this.col);
      cnv.noStroke();
    }
    else{
      cnv.stroke(this.col);
      cnv.strokeWeight(this.sw);
      cnv.noFill();
    }

    cnv.ellipse(this.center.x, this.center.y, this.dia);

  }

}
