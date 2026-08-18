class Stairs {
  constructor(x, y) {
    this.stairdirection = random(1);
    this.x = random(-width / 2, width / 2);
    this.y = -Yoffset;
    this.stairheight = random(5, 15);
    this.stairheightangle = this.stairheight / 10;
    this.stairwidth = random(200, 275);
    if (Yoffset > 400) {
      this.stairwidth = random(150, 200);
      this.stairheight = random(2, 8);
    }
    this.stairwidthoffset = this.stairwidth - this.stairheight;
    this.stairwidthmultiply = random(1.0, 1.035);

    xstairstart = this.x;
    xstairend = this.x + this.stairwidth * 0.9 - this.stairheightangle;

    if (this.stairdirection > 0.5) {
      xstairstart = this.x - this.stairwidth * 0.9;
      xstairend = this.x - this.stairheightangle;
      stroke(40);

      if (bgstairs > 0.6) {
        this.x = random(-width / 4, width / 4);
        this.stairwidth = random(275, 300);
        this.stairwidthmultiply = 1;
        this.stairheight = 4;
      }
    }

    this.sketch = color(canvascolor); //top

    this.sketch2 = color(canvascolor); //step

    this.sketch3 = color(185, 186, 170); //shadow
  } ///////////////////////////////////////////////////CLOSE CONSTRUCTOR

  spawn() {
    if (reset == 1) {
      this.stairdirection = random(1);
      this.x = random(-width / 4, width / 4);
      this.y = -Yoffset;
      this.stairheight = this.stairheight / 2.2;
      this.stairheightangle = this.stairheight / 10;
      this.stairwidth = random(300, 325);

      this.stairwidthoffset = this.stairwidth - this.stairheight;
      this.stairwidthmultiply = random(1.0, 1.035);

      xstairstart = this.x;
      xstairend = this.x + this.stairwidth * 0.9 - this.stairheightangle;

      if (this.stairdirection > 0.5) {
        xstairstart = this.x - this.stairwidth * 0.9;
        xstairend = this.x - this.stairheightangle;
        stroke(40);
      }
      reset = 0;
    }

    if (bgstairs > 0.6) {
      push();
      stroke(strokecolor);
      strokeWeight(2);
      fill(this.sketch);

      if (this.stairdirection > 0.5) {
        beginShape();
        fill(this.sketch);
        vertex(this.x, this.y);
        vertex(this.x - this.stairwidth, this.y);
        fill(this.sketch3);
        vertex(this.x - this.stairwidth, this.y + this.stairheight);
        vertex(this.x, this.y + this.stairheight);

        endShape(CLOSE);

        x = this.x;
        this.y = this.y + this.stairheight;

        beginShape();
        fill(this.sketch2);
        vertex(this.x, this.y);
        vertex(this.x - this.stairwidth, this.y);

        vertex(
          this.x + this.stairheight / 1.9 - this.stairwidthoffset,
          this.y + this.stairheightangle
        );
        vertex(this.x + this.stairheight, this.y + this.stairheightangle);

        endShape(CLOSE);

        xstairstart = this.x + this.stairheight;
        this.x = this.x + this.stairheight;
        this.y = this.y + this.stairheightangle;
        if (this.stairheight < 30) {
          this.stairheightangle = this.stairheightangle * 1.005;
          this.stairheight = this.stairheight * 1.055;
        }
        this.stairwidth = this.stairwidth * this.stairwidthmultiply;
        ystairoffset = this.y;
        xstairstart = this.x - this.stairwidth;
        xstairend = this.x;
      } else {
        beginShape();
        fill(this.sketch);
        vertex(this.x, this.y);
        vertex(this.x + this.stairwidth, this.y);
        fill(this.sketch3);
        vertex(this.x + this.stairwidth, this.y + this.stairheight);
        vertex(this.x, this.y + this.stairheight);

        endShape(CLOSE);

        x = this.x;
        this.y = this.y + this.stairheight;

        beginShape();
        fill(this.sketch2);
        vertex(this.x, this.y);
        vertex(this.x + this.stairwidth, this.y);

        vertex(
          this.x - this.stairheight / 1.9 + this.stairwidthoffset,
          this.y + this.stairheightangle
        );
        vertex(this.x - this.stairheight, this.y + this.stairheightangle);

        endShape(CLOSE);

        xstairstart = this.x - this.stairheight;
        this.x = this.x - this.stairheight;
        this.y = this.y + this.stairheightangle;
        if (this.stairheight < 30) {
          this.stairheightangle = this.stairheightangle * 1.005;
          this.stairheight = this.stairheight * 1.055;
        }
        this.stairwidth = this.stairwidth * this.stairwidthmultiply;
        ystairoffset = this.y;
        xstairstart = this.x;
        xstairend = this.x + this.stairwidth;
      }

      pop();
    } else {
      push();
      stroke(strokecolor);
      strokeWeight(2);
      fill(this.sketch);
      if (this.stairdirection > 0.5) {
        beginShape();
        fill(this.sketch);
        vertex(this.x, this.y);
        vertex(this.x - this.stairwidth, this.y);
        fill(this.sketch3);
        vertex(this.x - this.stairwidth, this.y + this.stairheight);
        vertex(this.x, this.y + this.stairheight);

        endShape(CLOSE);

        x = this.x;
        this.y = this.y + this.stairheight;

        beginShape();
        fill(this.sketch2);
        vertex(this.x, this.y);
        vertex(this.x - this.stairwidth, this.y);

        vertex(
          this.x + this.stairheight / 1.9 - this.stairwidthoffset,
          this.y + this.stairheightangle
        );
        vertex(this.x + this.stairheight, this.y + this.stairheightangle);

        endShape(CLOSE);

        xstairstart = this.x + this.stairheight;
        this.x = this.x + this.stairheight;
        this.y = this.y + this.stairheightangle;
        if (this.stairheight < 40) {
          this.stairheightangle = this.stairheightangle * 1.055;
          this.stairheight = this.stairheight * 1.055;
        }
        this.stairwidth = this.stairwidth * this.stairwidthmultiply;
        ystairoffset = this.y;
        xstairstart = this.x - this.stairwidth;
        xstairend = this.x;
      } else {
        beginShape();
        fill(this.sketch);
        vertex(this.x, this.y);
        vertex(this.x + this.stairwidth, this.y);
        fill(this.sketch3);
        vertex(this.x + this.stairwidth, this.y + this.stairheight);
        vertex(this.x, this.y + this.stairheight);

        endShape(CLOSE);

        x = this.x;
        this.y = this.y + this.stairheight;

        beginShape();
        fill(this.sketch2);
        vertex(this.x, this.y);
        vertex(this.x + this.stairwidth, this.y);

        vertex(
          this.x - this.stairheight / 1.9 + this.stairwidthoffset,
          this.y + this.stairheightangle
        );
        vertex(this.x - this.stairheight, this.y + this.stairheightangle);

        endShape(CLOSE);

        xstairstart = this.x - this.stairheight;
        this.x = this.x - this.stairheight;
        this.y = this.y + this.stairheightangle;
        if (this.stairheight < 40) {
          this.stairheightangle = this.stairheightangle * 1.055;
          this.stairheight = this.stairheight * 1.055;
        }
        this.stairwidth = this.stairwidth * this.stairwidthmultiply;
        ystairoffset = this.y;
        xstairstart = this.x;
        xstairend = this.x + this.stairwidth;
      }

      pop();
    }
  } ///////////////////////////////////////CLOSE SPAWN
} /////////////////////////////////////////CLOSE CLASS
