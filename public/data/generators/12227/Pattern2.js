class Pattern2 {
  constructor() {
    this.dotdensity = random(600, 1000);
    this.hasdots = random(1);
    this.shape = int(random(1, 3.99));
  }
  draw() {
    if (this.hasdots > 0.4) {
      for (let i = 0; i < this.dotdensity; i++) {
        let x = random(width);
        let y = random(height);
        stroke(dotscolorstroke);
        fill(dotscolor);
        if (this.shape == 1) {
          ellipse(x, y, random(3, 11));
        }
        if (this.shape == 2) {
          rect(x, y, random(3, 11));
        }
        if (this.shape == 3) {
          this.tr = random(3, 11);
          triangle(x, y, x + this.tr, y, x + this.tr / 2, y + this.tr);
        }
      }
    }
  }
}
