class Plant2 {
  constructor(x, y, sc) {
    this.x = x;
    this.y = y;
    this.sc = sc / 1.3;
    this.xwidth = random(3 * this.sc, 6 * this.sc);
    this.xoffset = random(-30 * this.sc, 30 * this.sc);
    if (this.xoffset < -15 * this.sc || this.xoffset > 15 * this.sc) {
      this.ylength = random(40 * this.sc, 120 * this.sc);
    } else {
      this.ylength = random(75 * this.sc, 180 * this.sc);
    }
    if (plant2lot < 8) {
      this.canspawn = random(10);
    }
    if (plant2lot >= 8) {
      this.canspawn = 0;
    }
    if (plant2lot == 10) {
      this.canspawn = random(11.0);
    }
  }
  draw() {
    if (this.canspawn > 9.965) {
      stroke(strokecolor);
      strokeWeight(1);
      fill(plant2color);
      for (this.i = 0; this.i < 80; this.i++) {
        fill(plant2color);
        beginShape();
        vertex(this.x, this.y);
        bezierVertex(
          this.x,
          this.y,
          this.x + this.xoffset - this.xwidth,
          this.y - this.ylength / 2,
          this.x + this.xoffset * 2,
          this.y - this.ylength
        );
        bezierVertex(
          this.x + this.xoffset * 2,
          this.y - this.ylength,
          this.x + this.xoffset + this.xwidth,
          this.y - this.ylength / 2,
          this.x + this.xwidth,
          this.y
        );
        endShape(CLOSE);

        fill(strokecolor);
        beginShape();
        vertex(this.x, this.y);
        bezierVertex(
          this.x,
          this.y,
          this.x + this.xoffset - this.xwidth,
          this.y + this.ylength / 2,
          this.x + this.xoffset * 2,
          this.y + this.ylength
        );
        bezierVertex(
          this.x + this.xoffset * 2,
          this.y + this.ylength,
          this.x + this.xoffset + this.xwidth,
          this.y + this.ylength / 2,
          this.x + this.xwidth,
          this.y
        );
        endShape(CLOSE);
        fill(plant2color);
        ////////////////////////////////////////////////
        this.hasbentleaf = random(1);
        if (this.hasbentleaf > 0.7) {
          fill(plant2color);
          this.xwidth = random(5 * this.sc, 9 * this.sc);
          this.xoffset = random(-22 * this.sc, 22 * this.sc);
          this.ylength = random(80 * this.sc, 200 * this.sc);
          this.x = this.x + random(-3 * this.sc, 3 * this.sc);
          beginShape();
          vertex(this.x, this.y);
          bezierVertex(
            this.x,
            this.y,
            this.x + this.xoffset - this.xwidth,
            this.y - this.ylength / 2,
            this.x + this.xoffset * 3.5,
            this.y - this.ylength / 9
          );
          bezierVertex(
            this.x + this.xoffset * 3.5,
            this.y - this.ylength / 9,
            this.x + this.xoffset + this.xwidth,
            this.y - this.ylength / 2,
            this.x + this.xwidth,
            this.y
          );
          endShape(CLOSE);
        }
        this.xwidth = random(3 * this.sc, 5 * this.sc);
        this.xoffset = random(-30 * this.sc, 30 * this.sc);
        if (this.xoffset < -15 * this.sc || this.xoffset > 15 * this.sc) {
          this.ylength = random(40 * this.sc, 150 * this.sc);
        } else {
          this.ylength = random(75 * this.sc, 180 * this.sc);
        }
        this.x = this.x + random(-3 * this.sc, 3 * this.sc);
        this.y = this.y + random(-1, 1);
      }
    }
    noFill();
  }
}
