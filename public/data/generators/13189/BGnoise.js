class BGnoise {
  constructor() {
    this.yoffset = 0;
    this.rowoffset = 1;
  }
  draw() {
    noFill();
    strokeWeight(1);
    stroke(noisecolor);
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
  }
}
