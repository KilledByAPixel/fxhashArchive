//Grass
class Plant5 {
  constructor(x, y, z, o) {
    this.x = x;
    this.y = y + 55;
    this.z = z;
    this.o = o;
    this.sx = random(-5, 5); //randomize x
    this.sy = random(20, 50); //randomize y
    this.sx2 = random(-50, 50);
    this.loops = 0;

    if (palette == 1) {
      this.sketch = color(canvascolor);
    }
    if (palette == 2) {
      this.sketch = color(canvascolor);
    }
    if (palette == 3) {
      this.sketch = color(canvascolor);
    }
    if (palette == 4) {
      this.sketch = color(canvascolor);
    }
    if (palette == 5) {
      this.sketch = color(canvascolor);
    }
    if (palette == 6) {
      this.sketch = color(canvascolor);
    }
    if (palette == 7) {
      this.sketch = color(canvascolor);
    }
    if (palette == 8) {
      this.sketch = color(canvascolor);
    }
    if (palette == 9) {
      this.sketch = color(canvascolor);
    }  
    if (palette == 10) {
      this.sketch = color(canvascolor);
    }  
    if (palette == 11) {
      this.sketch = color(canvascolor);
    } 
    if (palette == 12) {
      this.sketch = color(canvascolor);
    }  
    if (palette == 13) {
      this.sketch = color(canvascolor);
    } 
    if (palette == 14) {
      this.sketch = color(canvascolor);
    } 
    if (palette == 15) {
      this.sketch = color(canvascolor);
    } 
    
  } ///////////////////////////////////////////////////////////////

  spawn() {
    if (this.x < xstairstart + 5 || this.x > xstairend - 5) {
      translate(0, 0, this.z);

      fill(this.sketch);
      fill(250, 251, 235);
      stroke(strokecolor);
      strokeWeight(1);
      beginShape();
      vertex(this.x, this.y);
      bezierVertex(
        this.x,
        this.y,
        this.x - 10 + this.sx,
        this.y - 30,
        this.x + 5 + this.sx2,
        this.y - 45 - this.sy
      );
            fill(245, 246, 230);
  
      bezierVertex(
        this.x + 5 + this.sx2,
        this.y - 45 - this.sy,
        this.x + 10 + this.sx,
        this.y - 30,
        this.x,
        this.y
      );
          fill(215, 221, 200);
      endShape(CLOSE);
    }
  }
}
