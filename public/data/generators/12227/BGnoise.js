class BGnoise {
  constructor() {
    this.yoffset = 0;
    this.rowoffset = 1;
  }
  draw() {
    noFill();
    strokeWeight(1);
    stroke(strokecolor);
    for (this.i = 0; this.i < 1000; this.i++) {
      beginShape();
      this.xoffset = 0;
      for (this.x = 0; this.x <= width * 2; this.x += 10) {
        this.y = map(
          noise(this.xoffset, this.yoffset),
          0,
          1,
          0 + this.rowoffset,
          0
        );
        vertex(this.x, this.y);
        this.xoffset += 0.001;
      }
      this.rowoffset += 40;
      this.yoffset += 0.00061;
      vertex(width, height);
      vertex(0, height);
      endShape(CLOSE);
    }
  }
}
