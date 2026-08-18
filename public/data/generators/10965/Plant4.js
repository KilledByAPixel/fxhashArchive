///Flower1
class Plant4 {
  constructor(x, y, z, o) {
    this.x2 = x;
    this.y2 = y;
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
    this.colorchange = 0;
    stroke(strokecolor);

    if (palette == 1) {
      this.sketch = color(
        255 + this.colorchange,
        200 + this.colorchange,
        179 + this.colorchange
      );
    }
    if (palette == 2) {
      this.sketch = color(
        253 + this.colorchange,
        241 + this.colorchange,
        162 + this.colorchange
      );
    }
    if (palette == 3) {
      this.sketch = color(
        179 + this.colorchange,
        200 + this.colorchange,
        255 + this.colorchange
      );
    }
    if (palette == 4) {
      this.sketch = color(
        177 + this.colorchange,
        14 + this.colorchange,
        14 + this.colorchange
      );
    }
    if (palette == 5) {
      this.sketch = color(255 + this.colorchange);
    }
    if (palette == 6) {
      this.sketch = color(
        255 + this.colorchange,
        114 + this.colorchange,
        38 + this.colorchange
      );
    }
    if (palette == 7) {
      this.sketch = color(
        255 + this.colorchange,
        200 + this.colorchange,
        245 + this.colorchange
      );
    }
    if (palette == 8) {
      this.sketch = color(
        152 + this.colorchange,
        209 + this.colorchange,
        194 + this.colorchange
      );
    }
    if (palette == 9) {
      this.sketch = color(
        163 + this.colorchange,
        218 + this.colorchange,
        255 + this.colorchange
      );
    } 
    if (palette == 10) {
      this.sketch = color(
        187 + this.colorchange,
        160 + this.colorchange,
        191 + this.colorchange
      );
    } 
    if (palette == 11) {
      this.sketch = color(
        231 + this.colorchange,
        242 + this.colorchange,
        167 + this.colorchange
      );
    }
    if (palette == 12) {
      this.sketch = color(
        229 + this.colorchange,
        93 + this.colorchange,
        126 + this.colorchange
      );
    } 
    if (palette == 13) {
      this.sketch = color(
        92 + this.colorchange,
        122 + this.colorchange,
        201 + this.colorchange
      );
    }  
    if (palette == 14) {
      this.sketch = color(
        190 + this.colorchange,
        13 + this.colorchange,
        13 + this.colorchange
      );
    } 
    if (palette == 15) {
      this.sketch = color(
        248 + this.colorchange,
        199 + this.colorchange,
        0 + this.colorchange
      );
    } 
    
    
  } ///////////////////////////////////////////////////CLOSE CONSTRUCTOR

  spawn() {
    ///////////////////////////////////////////////////STEM

    this.colorchange = random(-40, 40);

    if (this.x2 < xstairstart || this.x2 > xstairend) {
      
      
if (palette == 1) {
      this.sketch = color(
        255 + this.colorchange,
        200 + this.colorchange,
        179 + this.colorchange
      );
    }
    if (palette == 2) {
      this.sketch = color(
        253 + this.colorchange,
        241 + this.colorchange,
        162 + this.colorchange
      );
    }
    if (palette == 3) {
      this.sketch = color(
        179 + this.colorchange,
        200 + this.colorchange,
        255 + this.colorchange
      );
    }
    if (palette == 4) {
      this.sketch = color(
        177 + this.colorchange,
        14 + this.colorchange,
        14 + this.colorchange
      );
    }
    if (palette == 5) {
      this.sketch = color(255 + this.colorchange);
    }
    if (palette == 6) {
      this.sketch = color(
        255 + this.colorchange,
        114 + this.colorchange,
        38 + this.colorchange
      );
    }
    if (palette == 7) {
      this.sketch = color(
        255 + this.colorchange,
        200 + this.colorchange,
        245 + this.colorchange
      );
    }
    if (palette == 8) {
      this.sketch = color(
        152 + this.colorchange,
        209 + this.colorchange,
        194 + this.colorchange
      );
    }
    if (palette == 9) {
      this.sketch = color(
        163 + this.colorchange,
        218 + this.colorchange,
        255 + this.colorchange
      );
    } 
    if (palette == 10) {
      this.sketch = color(
        187 + this.colorchange,
        160 + this.colorchange,
        191 + this.colorchange
      );
    } 
    if (palette == 11) {
      this.sketch = color(
        231 + this.colorchange,
        242 + this.colorchange,
        167 + this.colorchange
      );
    }
    if (palette == 12) {
      this.sketch = color(
        229 + this.colorchange,
        93 + this.colorchange,
        126 + this.colorchange
      );
    } 
    if (palette == 13) {
      this.sketch = color(
        92 + this.colorchange,
        122 + this.colorchange,
        201 + this.colorchange
      );
    }  
    if (palette == 14) {
      this.sketch = color(
        190 + this.colorchange,
        13 + this.colorchange,
        13 + this.colorchange
      );
    } 
    if (palette == 15) {
      this.sketch = color(
        248 + this.colorchange,
        199 + this.colorchange,
        0 + this.colorchange
      );
    } 

      translate(0, 0, this.z);

      beginShape();
      strokeWeight(5);
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
      ///////////////////////////////////////////ARRAY -  PLACEMENT
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

        strokeWeight(2);

        //////////////////////////////////////////////////////////REAR LEAF
        push();
        translate(0, 0, 1);

        fill(this.sketch);
        this.pedalamnt = int(random(2, 12));
        this.pedallength = int(random(10, 15));
        this.flowerscale = int(random(6, 10));
        this.pedalstyles = [0.3, 0.5, 0.7, 1];
        this.pedalstyle = random(this.pedalstyles);
        this.flowerx = random(width);
        this.flowery = random(height);
        this.floweramnt = this.floweramnt + 1;
        this.flowerangle = random(0.37, 0.95);
        beginShape();
        for (this.flower = 0; this.flower < 365; this.flower += 2) {
          this.r =
            this.pedallength *
              pow(
                abs(sin((this.flower * this.pedalamnt) / 1)),
                this.pedalstyle
              ) +
            this.flowerscale;
          this.xf = this.r * cos(this.flower);
          this.yf = this.r * sin(this.flower) * this.flowerangle;
          vertex(
            this.x2 + this.stemtopx + this.xf,
            this.y2 - this.stemtop + this.yf
          );
        }
        endShape();
        translate(0, 0, 2);
        //fill(47, 49, 35);
        fill(40);
        ellipse(
          this.x2 + this.stemtopx,
          this.y2 - this.stemtop,
          this.r * cos(this.flower),
          this.r * sin(this.flower) * (this.flowerangle * 10)
        );
        pop();
        //////////////////////////////////////////////////////////FRONT LEAF
      } //////////////////////////////////////CLOSE ARRAY
    }
  } ///////////////////////////////////////CLOSE SPAWN
} /////////////////////////////////////////CLOSE CLASS
