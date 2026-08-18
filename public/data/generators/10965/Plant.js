class Plant {
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
    this.stepsAmnt = int(random(2, 5));

    if (palette == 1) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(40);
    }
    if (palette == 2) {
      this.sketch = color(205, 239, 189);
      this.sketch2 = color(40);
    }
    if (palette == 3) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(40);
    }
    if (palette == 4) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(40);
    }
    if (palette == 5) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(40);
    }
    if (palette == 6) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(40);
    }
    if (palette == 7) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(40);
    }

    if (palette == 8) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(4, 55, 61);
    }
    if (palette == 9) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(40);
    }
    if (palette == 10) {
      this.sketch = color(216, 215, 230);
      this.sketch2 = color(34, 33, 67);
    }
    if (palette == 11) {
      this.sketch = color(200, 238, 202);
      this.sketch2 = color(34, 72, 60);
    }
    if (palette == 12) {
      this.sketch = color(245, 236, 220);
      this.sketch2 = color(40);
    }
    if (palette == 13) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(40);
    }
    if (palette == 14) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(40);
    }
    if (palette == 15) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(40);
    }
  } ///////////////////////////////////////////////////CLOSE CONSTRUCTOR

  spawn() {
    ///////////////////////////////////////////////////STEM
    if (this.x2 < xstairstart || this.x2 > xstairend) {
      translate(0, 0, this.z);
      beginShape();
      stroke(strokecolor);
      strokeWeight(6);
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
        //fill(155 + this.o / 2, 180 + this.o / 2, 139 + this.o / 2);
        fill(this.sketch2);
        stroke(strokecolor);
        beginShape();
        vertex(this.x, this.y + 3);
        bezierVertex(
          this.x,
          this.y,
          this.x - this.bend,
          this.y - this.d / 2,
          this.x1,
          this.y1
        );
        bezierVertex(
          this.x1,
          this.y1,
          this.x + this.bend,
          this.y - this.d / 2,
          this.x,
          this.y
        );
        endShape(CLOSE);

        beginShape();
        noFill();
        bezier(
          this.x,
          this.y,
          this.x,
          this.y - this.d / 2,
          this.x,
          this.y - this.d / 2,
          this.x1,
          this.y1
        );
        endShape();
        pop();
        //////////////////////////////////////////////////////////FRONT LEAF
        this.x1 = this.x + random(-30, 30);
        this.y1 = this.y - random(40, 65);
        this.d = dist(this.x, this.y, this.x1, this.y1);
        this.bend = random(20, 25);

        push();
        //fill(205 - this.o, 239 - this.o, 189 - this.o);
        fill(this.sketch);
        stroke(strokecolor);
        beginShape();
        translate(0, 0, 2);
        vertex(this.x, this.y + 3);
        bezierVertex(
          this.x,
          this.y,
          this.x - this.bend,
          this.y - this.d / 2,
          this.x1,
          this.y1
        );
        bezierVertex(
          this.x1,
          this.y1,
          this.x + this.bend,
          this.y - this.d / 2,
          this.x,
          this.y
        );
        endShape(CLOSE);

        beginShape();
        noFill();
        bezier(
          this.x,
          this.y,
          this.x,
          this.y - this.d / 2,
          this.x,
          this.y - this.d / 2,
          this.x1,
          this.y1
        );
        endShape();
        pop();
      } //////////////////////////////////////CLOSE ARRAY
    }
  } ///////////////////////////////////////CLOSE SPAWN
} /////////////////////////////////////////CLOSE CLASS
