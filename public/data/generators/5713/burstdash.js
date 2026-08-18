class BurstDash extends Dash{
  generate(info){
    this.shapeName = "burst";

    // Sizing
    this.length = rand(sx.burstDash.length.min, sx.burstDash.length.max);
    this.sw = rand(sx.strokeWeight.min, sx.strokeWeight.max*1.2);
    this.pRad = this.sw * 0.5;
    this.pathPointGap = this.sw * 0.6;

    // Angle
    this.angle = getAngle(this.center, special.bursts.locations[info.burstNum], true);
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

    for(let i = 0; i < 1000; i++){
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
    cnv.beginShape();
    for(let p of this.points){
      cnv.vertex(p.position.x, p.position.y);
    }
    cnv.endShape();
  }

}
