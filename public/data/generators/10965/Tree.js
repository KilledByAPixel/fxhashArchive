class Tree {
  constructor(x, y, z, o) {
    this.x = x;
    this.y = y + 50;
    this.z = z;
    this.o = o;

    this.spacing = random(50, 65);
    this.xoffset1 = random(-10, 10);
    this.xoffset2 = random(-10, 10);
    this.xoffset3 = random(-5, 5);
    this.xoffset4 = random(-5, 5);
    this.xoffset5 = random(-7, 7);
    this.xoffset6 = random(-5, 5);
    this.xoffset7 = random(-7, 7);
    this.xoffset8 = random(-5, 5);
    this.xoffset9 = random(-3, 3);
    angleMode(DEGREES);

    if (palette == 1) {
      this.sketch = color(170);
    }
    if (palette == 2) {
      this.sketch = color(215, 219, 208);
    }
    if (palette == 3) {
      this.sketch = color(160, 160, 165);
    }
    if (palette == 4) {
      this.sketch = color(75);
    }
    if (palette == 5) {
      this.sketch = color(canvascolor);
    }
    if (palette == 6) {
      this.sketch = color(canvascolor);
    }
    if (palette == 7) {
      this.sketch = color(200);
    }
    if (palette == 8) {
      this.sketch = color(canvascolor);
    }
    if (palette == 9) {
      this.sketch = color(canvascolor);
    }
    if (palette == 10) {
      this.sketch = color(240, 236, 230);
    }
    if (palette == 11) {
      this.sketch = color(244, 250, 238);
    }
    if (palette == 12) {
      this.sketch = color(230, 211, 220);
    }
    if (palette == 13) {
      this.sketch = color(200);
    }
    if (palette == 14) {
      this.sketch = color(200);
    }
    if (palette == 15) {
      this.sketch = color(235, 236, 220);
    }
  } ///////////////////////////////////////////////////CLOSE CONSTRUCTOR

  spawn() {
    if (this.x < xstairstart - 20 || this.x > xstairend + 20) {
      push();
      stroke(0);
      fill(strokecolor);

      strokeWeight(31);
      // point(this.x, this.y); //Bottom

      line(this.x, this.y, this.x + this.xoffset1, this.y - this.spacing);

      strokeWeight(28);
      // point(x + this.xoffset1, this.y - this.spacing); //bend1

      line(
        this.x + this.xoffset1,
        this.y - this.spacing,
        this.x + this.xoffset2,
        this.y - this.spacing * 2
      );

      point(this.x + this.xoffset2, this.y - this.spacing * 2); //bend2
      strokeWeight(25);

      line(
        this.x + this.xoffset2,
        this.y - this.spacing * 2,
        this.x + this.xoffset3,
        this.y - this.spacing * 3
      );

      point(this.x + this.xoffset3, this.y - this.spacing * 3); //bend2
      strokeWeight(22);

      line(
        this.x + this.xoffset3,
        this.y - this.spacing * 3,
        this.x + this.xoffset4,
        this.y - this.spacing * 4
      );

      point(this.x + this.xoffset4, this.y - this.spacing * 4); //bend2
      strokeWeight(19);

      line(
        this.x + this.xoffset4,
        this.y - this.spacing * 4,
        this.x + this.xoffset5,
        this.y - this.spacing * 5
      );

      point(this.x + this.xoffset5, this.y - this.spacing * 5); //bend2
      strokeWeight(16);

      line(
        this.x + this.xoffset5,
        this.y - this.spacing * 5,
        this.x + this.xoffset6,
        this.y - this.spacing * 6
      );

      point(this.x + this.xoffset6, this.y - this.spacing * 6); //bend2
      strokeWeight(13);

      line(
        this.x + this.xoffset6,
        this.y - this.spacing * 6,
        this.x + this.xoffset7,
        this.y - this.spacing * 7
      );

      point(this.x + this.xoffset7, this.y - this.spacing * 7); //bend2
      strokeWeight(10);

      line(
        this.x + this.xoffset7,
        this.y - this.spacing * 7,
        this.x + this.xoffset8,
        this.y - this.spacing * 8
      );

      point(this.x + this.xoffset8, this.y - this.spacing * 8); //bend2
      strokeWeight(7);

      line(
        this.x + this.xoffset8,
        this.y - this.spacing * 8,
        this.x + this.xoffset9,
        this.y - this.spacing * 9
      );
      ///////////////////////////////////FILL

      //stroke(72 - this.o / 1.5, 76 - this.o / 1.5, 53 - this.o / 1.5);
      stroke(this.sketch);
      fill(0);

      strokeWeight(26);
      // point(this.x, this.y); //Bottom

      line(this.x, this.y, this.x + this.xoffset1, this.y - this.spacing);

      strokeWeight(23);
      // point(x + this.xoffset1, this.y - this.spacing); //bend1

      line(
        this.x + this.xoffset1,
        this.y - this.spacing,
        this.x + this.xoffset2,
        this.y - this.spacing * 2
      );

      point(this.x + this.xoffset2, this.y - this.spacing * 2); //bend2
      strokeWeight(20);

      line(
        this.x + this.xoffset2,
        this.y - this.spacing * 2,
        this.x + this.xoffset3,
        this.y - this.spacing * 3
      );

      point(this.x + this.xoffset3, this.y - this.spacing * 3); //bend2
      strokeWeight(17);

      line(
        this.x + this.xoffset3,
        this.y - this.spacing * 3,
        this.x + this.xoffset4,
        this.y - this.spacing * 4
      );

      point(this.x + this.xoffset4, this.y - this.spacing * 4); //bend2
      strokeWeight(14);

      line(
        this.x + this.xoffset4,
        this.y - this.spacing * 4,
        this.x + this.xoffset5,
        this.y - this.spacing * 5
      );

      point(this.x + this.xoffset5, this.y - this.spacing * 5); //bend2
      strokeWeight(11);

      line(
        this.x + this.xoffset5,
        this.y - this.spacing * 5,
        this.x + this.xoffset6,
        this.y - this.spacing * 6
      );

      point(this.x + this.xoffset6, this.y - this.spacing * 6); //bend2
      strokeWeight(8);

      line(
        this.x + this.xoffset6,
        this.y - this.spacing * 6,
        this.x + this.xoffset7,
        this.y - this.spacing * 7
      );

      point(this.x + this.xoffset7, this.y - this.spacing * 7); //bend2
      strokeWeight(5);

      line(
        this.x + this.xoffset7,
        this.y - this.spacing * 7,
        this.x + this.xoffset8,
        this.y - this.spacing * 8
      );

      point(this.x + this.xoffset8, this.y - this.spacing * 8); //bend2
      strokeWeight(2);

      line(
        this.x + this.xoffset8,
        this.y - this.spacing * 8,
        this.x + this.xoffset9,
        this.y + 2 - this.spacing * 9
      );
      pop();
    }
  }
}
