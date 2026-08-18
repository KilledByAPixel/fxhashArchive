class Background {
  constructor(x, y) {
    this.x1 = 55;
    this.y1 = 55;
    this.s = width / 2;
    this.x2 = this.s / this.x1;
    this.y2 = 0.01;
    this.m = int(random(2, 6));
    this.m2 = random(10, 75);
  } ///////////////////////////////////////////////////CLOSE CONSTRUCTOR

  spawn() {
    push();

    stroke(200, 201, 185);
    if (canvascolor == canvas8) {
      stroke(210);
    }
    noFill();
    strokeWeight(1);
    for (this.y = 0; this.y < this.y1; this.y++) {
      for (this.x = -height / 2; this.x < this.x1; this.x++) {
        this.noise = noise(this.x * this.y2, this.y * this.y2) * this.m;
        this.noise = (this.noise - int(this.noise)) * this.m;
        rect(
          random(-width / 2, width / 2),
          this.x * this.x2 * 2 + this.m,
          this.y * this.x2,
          this.m2
        );
      }
    }
    pop();
  } ///////////////////////////////////////CLOSE SPAWN
} /////////////////////////////////////////CLOSE CLASS
