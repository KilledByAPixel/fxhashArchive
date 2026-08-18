class Vine {
  constructor() {
    this.vinelengthmult = random(0, 0.8);
    this.xoff1 = random(-12, 12) * this.vinelengthmult;
    this.xoff2 = random(-12, 12) * this.vinelengthmult;
    this.xoff3 = random(-12, 12) * this.vinelengthmult;
    this.leavesshape = random(1);
    leavesshape = this.leavesshape;
    this.noleaves = random(1);
    noleaves = this.noleaves;
    this.vineamnt = random(11, 18);
  }

  draw() {
    for (this.i = 0; this.i < this.vineamnt; this.i++) {
      this.x = random(x1, x4);
      this.y = y1 - linelength;
      this.vinelengthmax =
        dist(x1, y1 - linelength, x1, y1 + oldlinelength) * this.vinelengthmult;
      strokeWeight(6);
      stroke(strokecolor);
      bezier(
        this.x,
        this.y,
        this.x + this.xoff1,
        this.y + this.vinelengthmax / 3,
        this.x + this.xoff2,
        this.y + (this.vinelengthmax / 3) * 2,
        this.x + this.xoff3,
        this.y + this.vinelengthmax
      );

      strokeWeight(3);
      stroke(fillcolorgrass);
      bezier(
        this.x,
        this.y,
        this.x + this.xoff1,
        this.y + this.vinelengthmax / 3,
        this.x + this.xoff2,
        this.y + (this.vinelengthmax / 3) * 2,
        this.x + this.xoff3,
        this.y + this.vinelengthmax
      );
      ///////////LEAVES

      if (this.noleaves > 0.1) {
        this.leavesamnt = random(3, 5);
        this.tiploc = random(-3, 3);
        for (this.i2 = 0; this.i2 <= this.leavesamnt; this.i2++) {
          this.t = this.i2 / this.leavesamnt;
          this.x2 = bezierPoint(
            this.x,
            this.x + this.xoff1,
            this.x + this.xoff2,
            this.x + this.xoff3,
            this.t
          );
          this.y2 = bezierPoint(
            this.y,
            this.y + this.vinelengthmax / 3,
            this.y + (this.vinelengthmax / 3) * 2,
            this.y + this.vinelengthmax,
            this.t
          );
          fill(fillcolorgrass);
          stroke(strokecolor);
          strokeWeight(1);
          if (this.leavesshape < 0.2) {
            ellipse(this.x2, this.y2, 8, 8);
          }
          if (this.leavesshape >= 0.2) {
            beginShape();
            vertex(this.x2, this.y2);
            bezierVertex(
              this.x2,
              this.y2,
              this.x2 + 5,
              this.y2 - 10,
              this.x2 + 8,
              this.y2 + 16 + this.tiploc
            );
            bezierVertex(
              this.x2 + 8,
              this.y2 + 16 + this.tiploc,
              this.x2 + 2,
              this.y2 + 9,
              this.x2,
              this.y2
            );
            endShape(CLOSE);

            bezierVertex(
              this.x2,
              this.y2,
              this.x2 - 5,
              this.y2 - 10,
              this.x2 - 8,
              this.y2 + 16 + this.tiploc
            );
            bezierVertex(
              this.x2 - 8,
              this.y2 + 16 + this.tiploc,
              this.x2 - 2,
              this.y2 + 9,
              this.x2,
              this.y2
            );
            endShape(CLOSE);
            this.leavesamnt = random(3, 5);
            this.tiploc = random(-3, 3);
          }
        }
      }
      this.vinelengthmult = random(0, 0.8);
      this.xoff1 = random(-12, 12) * this.vinelengthmult;
      this.xoff2 = random(-12, 12) * this.vinelengthmult;
      this.xoff3 = random(-12, 12) * this.vinelengthmult;
    }
  }
}
