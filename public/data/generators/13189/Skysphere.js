class Skysphere {
  constructor() {
    this.x = random(width);
    this.r = random(225, 550);
    this.y = random(0, height / 2 / 1.3 - this.r + 200);
    this.amnt = 25;
    this.length = this.r / 3;
    this.scale = this.r / 2;
    this.styles = [100];
    this.style = random(this.styles);
    this.angle = 1;
  }
  draw() {
    fill(spherecolor);
    noStroke();
    ellipse(this.x, this.y, this.r, this.r);
    beginShape();
    stroke(strokecolor);
    for (this.rays = 0; this.rays < 365; this.rays += 0.01) {
      this.r2 =
        this.length * pow(abs(sin((this.rays * this.amnt) / 1)), this.style) +
        this.scale;
      this.xf = this.r2 * cos(this.rays);
      this.yf = this.r2 * sin(this.rays) * this.angle;
      noFill();
      vertex(this.x + this.xf, this.y + this.yf);
    }
    endShape();
    this.y = height / 1.3 - this.y + this.r / 2 + 200;
    fill(spherecolor);
    noStroke();
    ellipse(this.x, this.y, this.r, this.r);
    beginShape();
    stroke(strokecolor);
    for (this.rays = 0; this.rays < 365; this.rays += 0.01) {
      this.r2 =
        this.length * pow(abs(sin((this.rays * this.amnt) / 1)), this.style) +
        this.scale;
      this.xf = this.r2 * cos(this.rays);
      this.yf = this.r2 * sin(this.rays) * this.angle;
      noFill();
      vertex(this.x + this.xf, this.y + this.yf);
    }
    endShape();
  }
}
