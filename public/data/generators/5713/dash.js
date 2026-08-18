class Dash extends Doodle {
  generate(){
    this.shapeName = "dash";

    // Sizing
    let maxLength = map(this.attempt, 0, sx.numAttempts, sx.dash.length.max, sx.dash.length.max*0.1)
    this.length = rand(sx.dash.length.min, maxLength);
    this.sw = rand(sx.strokeWeight.min, sx.strokeWeight.max);

    this.pRad = this.sw * 0.55;
    this.pathPointGap = this.sw * 0.5;

    this.large = false;
    if(sx.varigatedMode != "off"){

      if(sx.varigatedMode == "down") {
        this.length *= map(this.center.y, 0, height, sx.varigateMinMult, sx.varigateMaxMult);
        this.sw = map(this.center.y, 0, height, sx.strokeWeight.min, sx.strokeWeight.max);
      }
      if(sx.varigatedMode == "up") {
        this.length *= map(this.center.y, height, 0, sx.varigateMinMult, sx.varigateMaxMult);
        this.sw = map(this.center.y, height, 0, sx.strokeWeight.min, sx.strokeWeight.max);

      }
      if(sx.varigatedMode == "left") {
        this.length *= map(this.center.x, width, 0, sx.varigateMinMult, sx.varigateMaxMult);
        this.sw = map(this.center.x, width, 0, sx.strokeWeight.min, sx.strokeWeight.max);

      }
      if(sx.varigatedMode == "right") {
        this.length *= map(this.center.x, 0, width, sx.varigateMinMult, sx.varigateMaxMult);
        this.sw = map(this.center.x, 0, width, sx.strokeWeight.min, sx.strokeWeight.max);
      }


      this.pathPointGap = this.sw * 0.5;
      this.pRad = this.sw * 0.55;
    }
    else if(rand(0,1) < sx.largeChance){
      this.large = true;
      this.length = rand(sx.dash.lengthLarge.min, sx.dash.lengthLarge.max);
      this.sw = rand(sx.largeStrokeWeight.min*0.5, sx.largeStrokeWeight.max*0.5);
      this.pRad = this.sw * 0.6;
    }


    // Angle
    let nx = map(this.center.x, 0, width, 0, 1000) * sx.dash.angle.res;
    let ny = map(this.center.y, 0, height, 0, 1000) * sx.dash.angle.res;
    let angleN = noise(nx, ny, 8765);
    this.angle = map(angleN, 0, 1, 0, 360);
    this.oppAngle = this.angle + 180;

    this.generatePoints();

  }

  generatePoints(){
    let halfLength = this.length * 0.5;
    this.points = [
      {
        rad: this.pRad,
        position: createVector(
        this.center.x + sin(this.angle) * halfLength,
        this.center.y + cos(this.angle) * halfLength
      )}];

    for(let i = 0; i < 99999; i++){
      let d = i * this.pathPointGap;

      if (d > this.length) break;
      else{
        this.points.push({
          rad: this.pRad,
          position: createVector(
          this.points[0].position.x + sin(this.oppAngle) * d,
          this.points[0].position.y + cos(this.oppAngle) * d
        )});
      }
    }

    this.points.push({
      rad: this.pRad,
      position: createVector(
      this.points[0].position.x + sin(this.oppAngle) * this.length,
      this.points[0].position.y + cos(this.oppAngle) * this.length
    )});
  }

  display(cnv){
    cnv.stroke(this.col);
    cnv.strokeWeight(this.sw);
    cnv.noFill();
    let l = this.points.length-1;
    cnv.line(this.points[0].position.x, this.points[0].position.y, this.points[l].position.x, this.points[l].position.y);
  }

}
