class Texture1 {
  constructor() {
    this.yoffset = 1;
    this.rowoffset = 25;
    this.pattern = int(random(1, 3.99));
  }
  draw() {
    if (this.pattern == 3) {
    }
    if (this.pattern == 1) {
      noFill();
      strokeWeight(1);
      stroke(0, 0, 0, 10);
      for (this.i = 0; this.i < 1000; this.i++) {
        beginShape();
        this.xoffset = 0;
        for (this.x = 0; this.x <= width; this.x += 20) {
          this.y = map(
            noise(this.xoffset, this.yoffset),
            0,
            1,
            0 + this.rowoffset,
            0
          );
          line(
            this.x + this.yoffset,
            this.y + this.yoffset,
            this.x + this.yoffset * 1 * this.rowoffset * 1,
            this.y + this.rowoffset * 1 + this.yoffset * 1
          );

          this.xoffset += 0.001;
        }
        this.rowoffset += 40 * this.yoffset;
        this.yoffset += 0.00061;
        endShape(CLOSE);
      }
    } /////pattern1
    if (this.pattern == 2) {
      noFill();
      strokeWeight(1);
      stroke(skycolor);
      for (this.i = 0; this.i < 1000; this.i++) {
        beginShape();
        this.xoffset = 0;
        for (this.x = 0; this.x <= width; this.x += 10) {
          this.y = map(
            noise(this.xoffset, this.yoffset),
            0,
            1,
            0 + this.rowoffset,
            0
          );

          line(
            this.x,
            this.y,
            this.x - this.rowoffset / 500,
            this.y - this.rowoffset / 100
          );
          line(
            this.x,
            this.y,
            this.x + this.rowoffset / 500,
            this.y - this.rowoffset / 100
          );

          this.xoffset += 0.001;
        }
        this.rowoffset += 40;
        this.yoffset += 0.00061;

        endShape(CLOSE);
      }
    } ////pattern2
  }
}
