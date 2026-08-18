class Plant3 {
  constructor(x, y, sc) {
    this.x = x;
    this.y = y;
    this.sc = sc;
    this.canspawn = random(10);
    this.x1 = this.x + random(-2 * this.sc, 2 * this.sc);
    this.x2 = this.x + random(-3 * this.sc, 3 * this.sc);
    this.x3 = this.x + random(-3 * this.sc, 3 * this.sc);
    this.x4 = this.x + random(-3 * this.sc, 3 * this.sc);
    this.y1 = this.y + random(-3 * this.sc, 3 * this.sc);
    this.y2 = this.y - random(10 * this.sc, 15 * this.sc);
    this.y3 = this.y - random(25 * this.sc, 35 * this.sc);
    this.y4 = this.y - random(38 * this.sc, 50 * this.sc);
  }
  draw() {
    if (canhaveplant3 > 0.5) {
      if (this.canspawn > 9.55) {
        stroke(strokecolor);
        strokeWeight(1);
        noFill();
        for (this.i = 0; this.i < 10; this.i++) {
          bezier(
            this.x1,
            this.y1,
            this.x2,
            this.y2,
            this.x3,
            this.y3,
            this.x4,
            this.y4
          );
          noStroke();
          fill(plantcolor3);
          ellipse(this.x4, this.y4, 6 * (this.sc * 0.75), 6 * (this.sc * 0.75));
          noFill();
          stroke(strokecolor);
          this.x1 = this.x + random(-2 * this.sc, 2 * this.sc);
          this.x2 = this.x + random(-3 * this.sc, 3 * this.sc);
          this.x3 = this.x + random(-3 * this.sc, 3 * this.sc);
          this.x4 = this.x + random(-3 * this.sc, 3 * this.sc);
          this.y1 = this.y + random(-3 * this.sc, 3 * this.sc);
          this.y2 = this.y - random(10 * this.sc, 15 * this.sc);
          this.y3 = this.y - random(25 * this.sc, 35 * this.sc);
          this.y4 = this.y - random(38 * this.sc, 50 * this.sc);
        } ///endarray
      } //endifcanspawn
    } ///endhasplant3
  } ////enddraw
} ////close
