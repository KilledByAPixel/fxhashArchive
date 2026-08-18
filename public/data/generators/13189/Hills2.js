class Hills2 {
  constructor() {
    this.x = 0;
    this.x1 = 0;
    this.x2 = 0;
    this.y = 500;
    this.y1 = height / 2 - random(-500, 500);
    this.y2 = random(0, 800);
    this.y3 = 20;
    this.yamnt = 0.003;
    this.xamnt = 0.0035;
    this.haswaves = random(1);
  }
  draw() {
    if (this.haswaves > 0.5) {
      stroke(noisecolor);
      fill(skycolor);
      for (this.i = 0; this.i <= height; this.i += 0.25) {
        this.x1 = 0;

        for (this.x2 = 0; this.x2 <= width; this.x2 += 10) {
          this.y = (noise(this.x1, this.y1) * height) / 2;
          if (this.y + this.y2 < height / 2 - 100) {
            rect(this.x2, this.y + this.y2, 12, 20);
            ellipse(this.x2, this.y + this.y2, 10, 10);
            this.x1 += this.xamnt;
          }
        }
        this.y2 += this.y3;
        this.y1 += this.yamnt;
        this.yamnt -= 0.0001;
        this.xamnt -= 0.00001;
      }
    }
  }
}
