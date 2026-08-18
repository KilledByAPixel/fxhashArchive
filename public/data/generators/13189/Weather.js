class Weather {
  constructor() {
    this.dotdensity = random(1000, 5000);
    this.hasdots = random(1);
    this.shape = int(random(1, 4.99));
  }
  draw() {
    if (this.hasdots > 0.65) {
      for (let i = 0; i < this.dotdensity; i++) {
        let x = random(width);
        let y = random(height);
        noStroke();
        fill(plantcolor3);
        if (this.shape == 1) {
          ellipse(x, y, random(2, 5));
        }
        if (this.shape == 2) {
          rect(x, y, random(2, 5));
        }
        if (this.shape == 3) {
          this.tr = random(2, 5);
          triangle(x, y, x + this.tr, y, x + this.tr / 2, y + this.tr);
        }
        if (this.shape == 4) {
          stroke(plantcolor3);
          strokeWeight(1);
          line(x, y, x + 5, y + 5);
          noStroke();
        }
      }
    }
  }
}
