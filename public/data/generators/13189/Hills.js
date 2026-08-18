class Hills {
  constructor(y) {
    this.yoff = 0.0;
    this.xoff = this.yoff;
    this.yheight = height / 2 - 275;
    this.yheight2 = this.yheight - 50;
  }
  draw() {
    strokeWeight(1);
    stroke(strokecolor);
    fill(wallcolor);
    beginShape();
    for (this.i = 0; this.i <= 10; this.i += 15) {
      for (this.x = 0; this.x <= width; this.x += 10) {
        this.y = map(
          noise(this.xoff, this.yoff),
          0,
          1,
          this.yheight,
          this.yheight2
        );
        this.yoff2 = 0;
        for (this.i2 = 0; this.i2 <= 200; this.i2 += 10) {
          rect(this.x + random(-4, 4), this.y + this.yoff2, random(12, 22), 12);
          this.yoff2 += 10;
        }
        this.xoff += 0.05;
      }
      this.yoff += 0.01;
      endShape(CLOSE);
      this.yheight += 50;
      this.yheight2 = this.yheight - 50;
    }
  }
}
