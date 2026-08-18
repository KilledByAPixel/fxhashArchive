class Bugs {
  //repurposed flower into a butterfly
  constructor(x, y, z, o) {
    this.x2 = x;
    this.y2 = y + 200;
    this.z = z;
    this.o = o;
    this.stembottom = 50;
    this.stembottomx = random(-10, 10);
    this.stemtop = random(135, 150);
    this.stemtopx = random(-20, 20);
    this.stemattach = random(100, 125);
    this.stemattachx = random(-10, 10);
    this.stemattach2 = random(25, 50);
    this.stemattachx2 = random(-10, 10);
    this.stepsAmnt = 0.1;

    if (palette == 1) {
      this.sketch = color(181, 169, 201, 80);
    }
    if (palette == 2) {
      this.sketch = color(137, 177, 236, 80);
    }
    if (palette == 3) {
      this.sketch = color(255);
    }
    if (palette == 4) {
      this.sketch = color(100, 70, 70, 70);
    }
    if (palette == 5) {
      this.sketch = color(255);
    }
    if (palette == 6) {
      this.sketch = color(255, 14, 38, 80);
    }
    if (palette == 7) {
      this.sketch = color(181, 169, 201, 80);
    }
    if (palette == 8) {
      this.sketch = color(4, 55, 61, 80);
    }
    if (palette == 9) {
      this.sketch = color(77, 156, 209, 80);
    }
    if (palette == 10) {
      this.sketch = color(109, 36, 122, 80);
    }
    if (palette == 11) {
      this.sketch = color(8, 151, 97, 80);
    }
    if (palette == 12) {
      this.sketch = color(255, 232, 0, 80);
    }
    if (palette == 13) {
      this.sketch = color(150, 247, 231, 80);
    }
    if (palette == 14) {
      this.sketch = color(159, 68, 68, 80);
    }
    if (palette == 15) {
      this.sketch = color(100, 181, 157, 80);
    }
  } ///////////////////////////////////////////////////CLOSE CONSTRUCTOR

  spawn() {
    if (this.x2 < xstairstart || this.x2 > xstairend) {
      push();
      stroke(strokecolor);
      strokeWeight(2);
      translate(-120, -410, 11 + this.z);

      fill(this.sketch);
      rotateZ(random(10, 170));
      rotateX(random(0, 60));

      this.pedalamnt = int(random(2, 2));
      this.pedallength = int(random(8, 13));
      this.flowerscale = int(random(2, 5));
      this.pedalstyles = [1];
      this.pedalstyle = random(this.pedalstyles);
      this.flowerx = random(width);
      this.flowery = random(height);
      this.floweramnt = this.floweramnt + 1;
      this.flowerangle = random(0.4, 0.7);
      beginShape();
      for (this.flower = 0; this.flower < 365; this.flower += 2) {
        this.r =
          this.pedallength *
            pow(abs(sin((this.flower * this.pedalamnt) / 1)), this.pedalstyle) +
          this.flowerscale;
        this.xf = (this.r * cos(this.flower)) / 1.5;
        this.yf = this.r * sin(this.flower) * this.flowerangle;
        vertex(
          this.x2 + this.stemtopx + this.xf,
          this.y2 - this.stemtop + this.yf
        );
      }

      endShape();
      translate(0, 0, 2);
      fill(0);
      ellipse(
        this.x2 + this.stemtopx,
        this.y2 - this.stemtop,
        this.r * cos(this.flower) * 2,
        this.r * sin(this.flower) * (this.flowerangle * 10)
      );
      pop();
    }
  } ///////////////////////////////////////CLOSE SPAWN
} /////////////////////////////////////////CLOSE CLASS
