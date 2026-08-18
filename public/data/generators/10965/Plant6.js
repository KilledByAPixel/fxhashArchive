class Plant6 {
  constructor(x, y, z, o) {
    this.x = x;
    this.y = y + 100;
    this.z = z;
    this.o = o;
    this.topleafx = random(-20, 20);
    this.middleleafx = random(20, 25);
    this.leaflength = random(150, 200);
    this.middleleafy = this.leaflength / 2;
    stroke(strokecolor);


    if (palette == 1) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(canvascolor);
    }
    if (palette == 2) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(canvascolor);
    }
    if (palette == 3) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(canvascolor);
    }
    if (palette == 4) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(canvascolor);
    }
    if (palette == 5) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(canvascolor);
    }
    if (palette == 6) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(canvascolor);
    }
    if (palette == 7) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(canvascolor);
    }
    if (palette == 8) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(canvascolor);
    }
    if (palette == 9) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(canvascolor);
    } 
    if (palette == 10) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(canvascolor);
    }  
    if (palette == 11) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(canvascolor);
    }  
    if (palette == 12) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(canvascolor);
    }
    if (palette == 13) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(canvascolor);
    } 
    if (palette == 14) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(canvascolor);
    } 
    if (palette == 15) {
      this.sketch = color(canvascolor);
      this.sketch2 = color(canvascolor);
    } 
    
  } ///////////////////////////////////////////////////CLOSE CONSTRUCTOR

  spawn() {
    if (this.x < xstairstart || this.x > xstairend) {
      translate(0, 0, this.z);
      push();
      strokeWeight(2);
      stroke(strokecolor);
      fill(this.sketch);
      stroke(0);
      beginShape();
      vertex(this.x, this.y);
      bezierVertex(
        this.x,
        this.y,
        this.x - this.middleleafx,
        this.y - this.middleleafy,
        this.x + this.topleafx,
        this.y - this.leaflength
      );
      bezierVertex(
        this.x + this.topleafx,
        this.y - this.leaflength,
        this.x + this.middleleafx,
        this.y - this.middleleafy,
        this.x + 8,
        this.y
      );
      endShape(CLOSE);

      bezier(
        this.x + 4,
        this.y,
        this.x,
        this.y - this.middleleafy,
        this.x,
        this.y - this.middleleafy,
        this.x + this.topleafx,
        this.y - this.leaflength
      );
      pop();
      ///////////////////////////////////////////////////////////////////////
      this.x = this.x - 10;
      this.y = this.y;
      this.topleafx = random(-15, -4);
      this.middleleafx = random(15, 20);
      this.leaflength = random(100, 125);
      this.middleleafy = this.leaflength / 2;

      push();
      translate(0, 0, 1);
      strokeWeight(2);

      fill(this.sketch2);
      stroke(strokecolor);
      beginShape();
      vertex(this.x + 2, this.y);
      bezierVertex(
        this.x + 2,
        this.y,
        this.x - this.middleleafx,
        this.y - this.middleleafy,
        this.x + this.topleafx,
        this.y - this.leaflength
      );
      bezierVertex(
        this.x + this.topleafx,
        this.y - this.leaflength,
        this.x + this.middleleafx,
        this.y - this.middleleafy,
        this.x + 10,
        this.y
      );
      endShape(CLOSE);

      bezier(
        this.x + 4,
        this.y,
        this.x,
        this.y - this.middleleafy,
        this.x,
        this.y - this.middleleafy,
        this.x + this.topleafx,
        this.y - this.leaflength
      );
      pop();
      //////////////////////////////////////////////////////////////////////////////////
      this.x = this.x + 18;
      this.y = this.y;
      this.topleafx = random(4, 15);
      this.middleleafx = random(15, 20);
      this.leaflength = random(100, 125);
      this.middleleafy = this.leaflength / 2;

      push();
      translate(0, 0, 1);
      strokeWeight(2);
      //fill(205 - this.o, 239 - this.o, 189 - this.o);
      fill(this.sketch);
      stroke(strokecolor);
      beginShape();
      vertex(this.x, this.y);
      bezierVertex(
        this.x,
        this.y,
        this.x - this.middleleafx,
        this.y - this.middleleafy,
        this.x + this.topleafx,
        this.y - this.leaflength
      );
      bezierVertex(
        this.x + this.topleafx,
        this.y - this.leaflength,
        this.x + this.middleleafx,
        this.y - this.middleleafy,
        this.x + 8,
        this.y
      );
      endShape(CLOSE);

      bezier(
        this.x + 4,
        this.y,
        this.x,
        this.y - this.middleleafy,
        this.x,
        this.y - this.middleleafy,
        this.x + this.topleafx,
        this.y - this.leaflength
      );
      pop();
    }
  } ///////////////////////////////////////CLOSE SPAWN
} /////////////////////////////////////////CLOSE CLASS
