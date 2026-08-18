class Clouds {
  constructor(y) {
    this.x = random(0, width / 1.3);
    this.start = this.x;
    this.y = random(0, height / 2 - 300);
    this.r = random(10, 30);
    this.r2 = this.r;
    this.amnt = random(10, 35);
    this.amnt2 = this.amnt / 2;
    this.loops = 0;
    this.yoffset = random(3, 8);
    this.cloudsamnt = int(random(0, 30.99));
    if (isbehindclouds >= 0.5) {
      this.cloudsamnt = this.cloudsamnt / 2;
    }
  }
  draw() {
    for (this.i3 = 0; this.i3 < this.cloudsamnt; this.i3++) {
      this.x = random(width / 1.3);
      this.start = this.x;
      this.y = random(0, height / 2 - 200);
      this.r = random(10, 30);
      this.r2 = this.r;
      this.amnt = random(10, 35);
      this.amnt2 = this.amnt / 2;
      this.loops = 0;
      this.yoffset = random(3, 8);
      for (this.i2 = 0; this.i2 < this.amnt2; this.i2++) {
        for (this.i = 0; this.i < this.amnt; this.i++) {
          noStroke();
          fill(cloudcolor);
          ellipse(this.x, this.y, this.r, this.r);
          this.loops += 1;
          this.r2 = this.r;
          if (this.loops < this.amnt / 2) {
            this.r += 3;
          } else {
            this.r -= 3;
          }
          this.x = this.x + (this.r + this.r2) / 3;
          this.y += random(-6, 6);
        }
        this.start += this.r + random(-this.r * 2, this.r * 1.5);
        this.x = this.start;
        this.y += this.yoffset;
        this.loops = 0;
        this.r = random(10, 30);
        this.amnt -= 1;
      }
    }
  }
}
