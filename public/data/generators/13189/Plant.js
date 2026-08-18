class Plant {
  constructor(x, y, sc) {
    this.x = x;
    this.y = y;
    this.sc = sc;
  }
  draw() {
    strokeWeight(1);
    stroke(riveredgecolor);
    for (this.i3 = 0; this.i3 < 30; this.i3++) {
      ellipse(
        this.x + random(-15 * this.sc, 15 * this.sc),
        this.y + random(3 * this.sc, 15 * this.sc),
        3 * this.sc,
        3 * this.sc
      );
    }
    stroke(plantcolor);
    for (this.i = 0; this.i < 65; this.i++) {
      bezier(
        this.x + random(-15 * this.sc, 15 * this.sc),
        this.y + random(-3 * this.sc, 3 * this.sc),
        this.x + random(-15 * this.sc, 15 * this.sc),
        this.y + random(-3 * this.sc, 3 * this.sc),
        this.x + random(-15 * this.sc, 15 * this.sc),
        this.y + random(-3 * this.sc, 3 * this.sc),
        this.x + random(-20 * this.sc, 20 * this.sc),
        this.y - random(20 * this.sc, 40 * this.sc)
      );
    }
    stroke(strokecolor);
    for (this.i = 0; this.i < 20; this.i++) {
      bezier(
        this.x + random(-15 * this.sc, 15 * this.sc),
        this.y + random(-3 * this.sc, 3 * this.sc),
        this.x + random(-15 * this.sc, 15 * this.sc),
        this.y + random(-3 * this.sc, 3 * this.sc),
        this.x + random(-15 * this.sc, 15 * this.sc),
        this.y + random(-3 * this.sc, 3 * this.sc),
        this.x + random(-20 * this.sc, 20 * this.sc),
        this.y - random(20 * this.sc, 37 * this.sc)
      );
    }
    this.sc += 1;
  }
}
