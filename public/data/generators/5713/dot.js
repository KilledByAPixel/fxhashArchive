class Dot extends Doodle {
  generate(){
    this.shapeName = "dot";

    // Sizing
    this.dia = rand(sx.dot.dia.min, sx.dot.dia.max);

    this.checkRadius = true;

    if(sx.varigatedMode == "down") this.dia *= map(this.center.y, 0, height, sx.varigateMinMult, sx.varigateMaxMult*0.5);
    if(sx.varigatedMode == "up") this.dia *= map(this.center.y, height, 0, sx.varigateMinMult, sx.varigateMaxMult*0.5);
    if(sx.varigatedMode == "left") this.dia *= map(this.center.x, width, 0, sx.varigateMinMult, sx.varigateMaxMult*0.5);
    if(sx.varigatedMode == "right") this.dia *= map(this.center.x, 0, width, sx.varigateMinMult, sx.varigateMaxMult*0.5);

    this.radius = this.dia * 0.5;

    this.generatePoints();
  }

  generatePoints(){
    this.points = [];
    this.points.push({
      rad: this.radius * 1.2,
      position: createVector(
      this.center.x,
      this.center.y
    )});
  }

  display(cnv){
    cnv.fill(this.col);
    cnv.noStroke();
    cnv.ellipse(this.center.x, this.center.y, this.dia);
  }

}
