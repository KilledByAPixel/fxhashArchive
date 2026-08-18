class Plant3 {
  constructor(x, y, z, o) {
    this.x2 = x;
    this.y2 = y;
    this.z = z;
    this.o = o;
    this.stembottom = -100;
    this.stembottomx = random(-10, 10);
    this.stemtop = random(165, 205);
    this.stemtopx = random(-20, 20);
    this.stemattach = random(150, 175);
    this.stemattachx = random(-10, 10);
    this.stemattach2 = random(125, 150);
    this.stemattachx2 = random(-10, 10);
    this.stepsAmnt = int(random(20, 30));
    stroke(strokecolor);

    if (palette == 1) {
      this.sketch = color(215, 200, 222);
    }
    if (palette == 2) {
      this.sketch = color(137, 170, 140);
    }
    if (palette == 3) {
      this.sketch = color(180, 200, 222);
    }
    if (palette == 4) {
      this.sketch = color(170);
    }
    if (palette == 5) {
      this.sketch = color(255);
    }
    if (palette == 6) {
      this.sketch = color(255, 195, 0);
    }
    if (palette == 7) {
      this.sketch = color(253, 235, 186);
    }
    if (palette == 8) {
      this.sketch = color(36, 159, 126);
    }
    if (palette == 9) {
      this.sketch = color(255, 200, 163);
    }
    if (palette == 10) {
      this.sketch = color(136, 113, 165);
    }
    if (palette == 11) {
      this.sketch = color(64, 139, 111);
    }
    if (palette == 12) {
      this.sketch = color(246, 181, 113);
    }
    if (palette == 13) {
      this.sketch = color(149, 199, 236);
    }
    if (palette == 14) {
      this.sketch = color(253, 235, 186);
    }
    if (palette == 15) {
      this.sketch = color(253, 235, 186);
    }
  } ///////////////////////////////////////////////////CLOSE CONSTRUCTOR

  spawn() {
    ///////////////////////////////////////////////////STEM

    if (this.x2 < xstairstart || this.x2 > xstairend) {
      stroke(strokecolor);
      translate(0, 0, this.z);
      beginShape();
      strokeWeight(4);
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

        fill(this.sketch);
        beginShape();
        vertex(this.x, this.y - 1);
        ellipse(this.x - random(3, 6), this.y, random(7, 10));
        translate(0, 0, 1);
        ellipse(this.x + random(0, 2), this.y + random(4, 8), random(3, 6));
        endShape();
        pop();

        strokeWeight(6);
        bezier(
          this.x2 + this.stembottomx,
          this.y2 + this.stembottom - 2,
          this.x2 - this.stemattachx2 / 4,
          this.y2 + this.stemattach2 / 4,
          this.x2 - this.stemattachx2 / 4,
          this.y2 + this.stemattach2 / 4,
          this.x2 - this.stemtopx / 4,
          this.y2 + this.stemtop / 3
        );
        endShape();
      } //////////////////////////////////////CLOSE ARRAY
    }
  } ///////////////////////////////////////CLOSE SPAWN
} /////////////////////////////////////////CLOSE CLASS
