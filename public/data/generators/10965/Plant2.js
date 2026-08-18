class Plant2 {
  constructor(x, y, z, o) {
    this.x2 = x;
    this.y2 = y;
    this.z = z;
    this.o = o;
    this.stembottom = 50;
    this.stembottomx = random(-10, 10);
    this.stemtop = random(135, 175);
    this.stemtopx = random(-50, 50);
    this.stemattach = random(100, 125);
    this.stemattachx = random(-10, 10);
    this.stemattach2 = random(25, 50);
    this.stemattachx2 = random(-10, 10);
    this.stepsAmnt = int(random(10, 12));
    stroke(strokecolor);

    if (palette == 1) {
      this.sketch = color(155, 111, 111);
    }
    if (palette == 2) {
      this.sketch = color(20);
    }
    if (palette == 3) {
      this.sketch = color(111, 111, 155);
    }

    if (palette == 4) {
      this.sketch = color(155, 111, 111);
    }
    if (palette == 5) {
      this.sketch = color(20);
    }
    if (palette == 6) {
      this.sketch = color(199, 0, 57);
    }
    if (palette == 7) {
      this.sketch = color(155, 111, 190);
    }
    if (palette == 8) {
      this.sketch = color(17, 106, 134);
    }
    if (palette == 9) {
      this.sketch = color(255, 163, 173);
    }
    if (palette == 10) {
      this.sketch = color(188, 166, 215);
    }
    if (palette == 11) {
      this.sketch = color(242, 222, 167);
    }
    if (palette == 12) {
      this.sketch = color(246, 227, 113);
    }
    if (palette == 13) {
      this.sketch = color(149, 236, 224);
    }
    if (palette == 14) {
      this.sketch = color(159, 68, 68);
    }
    if (palette == 15) {
      this.sketch = color(198, 95, 52);
    }
  } ///////////////////////////////////////////////////CLOSE CONSTRUCTOR

  spawn() {
    ///////////////////////////////////////////////////STEM
    if (this.x2 < xstairstart || this.x2 > xstairend) {
      translate(0, 0, this.z);
      beginShape();
      strokeWeight(6);
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
      ///////////////////////////////////////////ARRAY - LEAF PLACEMENT
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

        //////////////////////////////////////////////////////////REAR LEAF
        push();

        //fill(215 + this.o / 2, 200 + this.o / 2, 179 + this.o / 2);
        fill(this.sketch);
        beginShape();
        vertex(this.x, this.y - 1);
        ellipse(this.x - random(3, 6), this.y, random(7, 10));
        translate(0, 0, 2);
        ellipse(this.x + random(1, 3), this.y + random(4, 8), random(8, 9));
        endShape();
        pop();
      } //////////////////////////////////////CLOSE ARRAY
    }
  } ///////////////////////////////////////CLOSE SPAWN
} /////////////////////////////////////////CLOSE CLASS
