class Vineshadow {
  constructor() {
    this.vinelengthmult = random(0, 0.8);
    this.xoff1 = random(-8, 8) * this.vinelengthmult;
    this.xoff2 = random(-8, 8) * this.vinelengthmult;
    this.xoff3 = random(-8, 8) * this.vinelengthmult;
    this.leavesshape = leavesshape;
    this.noleaves = noleaves;
    this.vineamnt = random(5, 8);
  }

  draw() {
    for (this.i = 0; this.i < xdist / 80; this.i++) {
      this.x = random(x1 + 10, x4 - 20);
      if (this.x < oldx1 || this.x > oldx4) {
        this.y = y + 2;
        this.vinelengthmax =
          (dist(x1, y1 - linelength, x1, y1 + oldlinelength) *
            this.vinelengthmult) /
          3.7;
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
        ////////LEAVES

        if (this.noleaves > 0.1) {
          this.leavesamnt = random(1, 2);
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
              ellipse(this.x2, this.y2, 6, 6);
            }
            if (this.leavesshape >= 0.2) {
              beginShape();
              vertex(this.x2, this.y2);
              bezierVertex(
                this.x2,
                this.y2,
                this.x2 + 3,
                this.y2 - 8,
                this.x2 + 6,
                this.y2 + 14 + this.tiploc
              );
              bezierVertex(
                this.x2 + 6,
                this.y2 + 14 + this.tiploc,
                this.x2 + 0,
                this.y2 + 7,
                this.x2,
                this.y2
              );
              endShape(CLOSE);
              bezierVertex(
                this.x2,
                this.y2,
                this.x2 - 3,
                this.y2 - 8,
                this.x2 - 6,
                this.y2 + 14 + this.tiploc
              );
              bezierVertex(
                this.x2 - 6,
                this.y2 + 14 + this.tiploc,
                this.x2 - 0,
                this.y2 + 7,
                this.x2,
                this.y2
              );
              endShape(CLOSE);
              this.leavesamnt = random(1, 2);
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
  } //////////////////closedraw
}
