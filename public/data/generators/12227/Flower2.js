class Flower2 {
  constructor(x, y) {
    this.x2 = x;
    this.y2 = y;
    this.stembottom = 0;
    this.stembottomx = random(-4, 4);
    this.stemtop = random(45, 70) * 0.35;
    this.stemtopx = random(-4, 4);
    this.stemattach = this.stemtop * 0.7;
    this.stemattachx = random(-4, 4);
    this.stemattach2 = this.stemtop * 0.4;
    this.stemattachx2 = random(-4, 4);
    this.stepsAmnt = 0.1;
    this.colorchange = 0;
    stroke(strokecolor);
  }

  spawn() {
    this.colorchange = random(-40, 40);
    beginShape();
    strokeWeight(1);
    stroke(strokecolor);
    noFill();
    bezier(
      this.x2 + this.stembottomx,
      this.y2 + this.stembottom,
      this.x2 + this.stemattachx2,
      this.y2 - this.stemattach2,
      this.x2 + this.stemattachx,
      this.y2 - this.stemattach,
      this.x2 + this.stemtopx,
      this.y2 - this.stemtop
    );
    endShape();
    this.steps = this.stepsAmnt;
    for (this.i = 0; this.i <= this.steps; this.i++) {
      this.t = this.i / this.steps;
      this.x = bezierPoint(
        this.x2 + this.stembottomx,
        this.x2 + this.stemattachx2,
        this.x2 + this.stemattachx,
        this.x2 + this.stemtopx,
        this.t
      );
      this.y = bezierPoint(
        this.y2 + this.stembottom,
        this.y2 - this.stemattach2,
        this.y2 - this.stemattach,
        this.y2 - this.stemtop,
        this.t
      );
      this.x1 = this.x + random(-30, 30);
      this.y1 = this.y - random(50, 75);
      this.d = dist(this.x, this.y, this.x1, this.y1);
      this.bend = random(20, 25);

      strokeWeight(1);
      fill(fillcolorflower);
      this.pedalamnt = int(random(3, 7));
      this.pedallength = int(random(4, 6));
      this.flowerscale = int(random(4, 9));
      this.pedalstyles = [0.3, 0.5, 0.7, 1];
      this.pedalstyle = random(this.pedalstyles);
      this.flowerx = random(width);
      this.flowery = random(height);
      this.floweramnt = this.floweramnt + 1;
      this.flowerangle = random(0.37, 0.75);
      beginShape();
      for (this.flower = 0; this.flower < 365; this.flower += 0.01) {
        this.r =
          this.pedallength *
            pow(abs(sin((this.flower * this.pedalamnt) / 1)), this.pedalstyle) +
          this.flowerscale;
        this.xf = this.r * cos(this.flower);
        this.yf = this.r * sin(this.flower) * this.flowerangle;
        vertex(
          this.x2 + this.stemtopx + this.xf,
          this.y2 - this.stemtop + this.yf
        );
      }
      endShape();

      fill(40);
      ellipse(
        this.x2 + this.stemtopx,
        this.y2 - this.stemtop,
        this.r * cos(this.flower),
        this.r * sin(this.flower) * this.flowerangle
      );
    }
  }
}
