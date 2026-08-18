class CreateLandscape {
  constructor(y) {
    this.x = random(width);
    this.y = height / 2 - 200;
    this.riverleft = width / 2 + random(-500, 500);
    this.riverwidth = 0;
    this.riverright = this.riverleft + this.riverwidth;
    this.rl1 = -30;
    this.rl2 = 23;
    this.sc = 1;
    this.waterdepth = 5;
    this.wateroffset = random(-35, 35);
  }
  draw() {
    for (this.i2 = 0; this.i2 < 50; this.i2++) {
      this.x = random(width);
      if (this.x < this.riverleft - 75 || this.x > this.riverright + 75) {
        treevar = new Tree(this.x, this.y + random(50), 1);
        treevar.draw();
        stroke(strokecolor);
        treevar = new Tree(this.x, this.y, -1);
        treevar.draw();
      }
      fill(watercolor);
      stroke(strokecolor);
      rect(0, height / 2 - 200, width, height);
      stroke(strokecolor);
    }
    noFill();
    for (this.i = 0; this.i < 700; this.i++) {
      for (this.i2 = 0; this.i2 < 20; this.i2++) {
        this.x = random(width);

        if (this.x < this.riverleft || this.x > this.riverright) {
          plantvar = new Plant(this.x, this.y, this.sc);
          plantvar.draw();
          if (plant2lot <8) {
            plant2var = new Plant2(
              this.riverleft - random(550),
              this.y,
              this.sc
            );
            plant2var.draw();

            plant2var = new Plant2(
              this.riverright + random(550),
              this.y,
              this.sc
            );
            plant2var.draw();
          }
          if (plant2lot == 10) {
            plant2var = new Plant2(
              this.riverleft - random(1250),
              this.y,
              this.sc
            );
            plant2var.draw();

            plant2var = new Plant2(
              this.riverright + random(1250),
              this.y,
              this.sc
            );
            plant2var.draw();
          }
          plant3var = new Plant3(this.x, this.y, this.sc);
          plant3var.draw();
        } else {
          this.reedoffset = random(5 * this.sc, 30 * this.sc);
          this.reedangle = random(-30 * this.sc, 30 * this.sc);
          ////////////////////////////////////reed//////////////////////////
          this.canspawnreed = random(1);
          if (this.canspawnreed > 0.98) {
            bezier(
              this.riverleft + this.reedoffset + this.reedangle,
              this.y,
              this.riverleft + this.reedoffset + this.reedangle * 1.3,
              this.y - 65 * this.sc,
              this.riverleft + this.reedoffset + this.reedangle * 2,
              this.y - 100 * this.sc,
              this.riverleft + this.reedoffset + this.reedangle * 3.5,
              this.y - 130 * this.sc
            );
            this.reedoffset = random(5 * this.sc, 30 * this.sc);
            this.reedangle = random(-30 * this.sc, 30 * this.sc);
            bezier(
              this.riverright - this.reedoffset + this.reedangle,
              this.y,
              this.riverright - this.reedoffset + this.reedangle * 1.3,
              this.y - 65 * this.sc,
              this.riverright - this.reedoffset + this.reedangle * 2,
              this.y - 100 * this.sc,
              this.riverright - this.reedoffset + this.reedangle * 3.5,
              this.y - 130 * this.sc
            );
            this.reedoffset = random(5 * this.sc, 30 * this.sc);
            this.reedangle = random(-30 * this.sc, 30 * this.sc);
          }
          ////////////////////////////////////reed///////////////////////
          this.makewaves = random(1);
          if (this.makewaves > 0.2 + this.sc / random(4, 15)) {
            noStroke();
            fill(reflectioncolor);
            bezier(
              this.riverleft + this.riverwidth / random(2, 8),
              this.y,
              this.riverleft + (this.riverwidth / 2) * 2,
              this.y + random(4 * this.sc),
              this.riverright - (this.riverwidth / 2) * 2,
              this.y + random(4 * this.sc),
              this.riverright - this.riverwidth / random(2, 8),
              this.y
            );
            stroke(strokecolor);
            noFill();
          }
          bezier(
            this.riverleft + this.reedoffset + this.reedangle,
            this.y + 20,
            this.riverleft + this.reedoffset + this.reedangle * 1.3,
            this.y - 65 * this.sc,
            this.riverleft + this.reedoffset + this.reedangle * 2,
            this.y - 100 * this.sc
          );
          bezier(
            this.riverright - this.reedoffset + this.reedangle,
            this.y + 20,
            this.riverright - this.reedoffset + this.reedangle * 1.3,
            this.y - 65 * this.sc,
            this.riverright - this.reedoffset + this.reedangle * 2,
            this.y - 100 * this.sc
          );
          ellipse(
            this.riverleft + this.wateroffset,
            this.y + this.waterdepth,
            (15 * this.sc) / 1.5,
            (6 * this.sc) / (1.5 * this.sc)
          );
          ellipse(
            this.riverright - this.wateroffset,
            this.y + this.waterdepth,
            (15 * this.sc) / 1.5,
            (6 * this.sc) / (1.5 * this.sc)
          );
        }
      }
      this.y += 2.5 + this.sc / 5.8;
      this.riverleft += random(this.rl1, this.rl2);
      this.riverwidth += random(-17, 37);
      this.riverright = this.riverleft + this.riverwidth;
      this.sc += 0.009;
      this.rl1 = -30 - this.sc / 3.8;
      this.rl2 = 23 + this.sc / 3.8;
      this.waterdepth += 0.21;
      this.wateroffset = random(-35, 35);
    }
  }
}
