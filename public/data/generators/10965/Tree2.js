class Tree2 {
  constructor(x, y, z, o) {
    this.x2 = x;
    this.y2 = y;
    this.z = z;
    this.o = o;
    this.stembottom = 50;
    this.stembottomx = random(-10, 10);
    this.stemtop = random(175, 250);
    this.stemtopx = random(-50, 50);
    this.stemattach = random(80, 110);
    this.stemattachx = random(-10, 10);
    this.stemattach2 = random(25, 50);
    this.stemattachx2 = random(-10, 10);
    this.stepsAmnt = int(random(1, 4));
    this.topformap = this.y2 - this.stemtop;

    if (palette == 1) {
      this.stroke = color(200);
    }
    if (palette == 2) {
      this.stroke = color(199, 195, 183);
    }
    if (palette == 3) {
      this.stroke = color(200);
    }
    if (palette == 4) {
      this.stroke = color(200);
    }
    if (palette == 5) {
      this.stroke = color(170);
    }
    if (palette == 6) {
      this.stroke = color(200);
    }
    if (palette == 7) {
      this.stroke = color(canvascolor);
    }
    if (palette == 8) {
      this.stroke = color(170);
    }
    if (palette == 9) {
      this.stroke = color(canvascolor);
    }
    if (palette == 10) {
      this.stroke = color(200);
    }
    if (palette == 11) {
      this.stroke = color(canvascolor);
    }
    if (palette == 12) {
      this.stroke = color(170);
    }
    if (palette == 13) {
      this.stroke = color(canvascolor);
    }
    if (palette == 14) {
      this.stroke = color(canvascolor);
    }
    if (palette == 15) {
      this.stroke = color(200);
    }
  } ///////////////////////////////////////////////////CLOSE CONSTRUCTOR

  spawn() {
    if (this.x2 < xstairstart || this.x2 > xstairend) {
      translate(0, 0, this.z);
      stroke(strokecolor);
      beginShape();
      strokeWeight(15);
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
      stroke(this.stroke);
      beginShape();
      strokeWeight(4);
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
      ///////////////////////////////////////////ARRAY
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
        this.x1 = this.x + random(-75, 30);
        this.y1 = this.y - random(80, 180);
        this.d = dist(this.x, this.y, this.x1, this.y1);
        this.bend = random(40, 70);

        //////////////////////////////////////////////////////////
        push();
        beginShape();
        strokeWeight(14);
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
        stroke(this.stroke);
        strokeWeight(7);
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
        stroke(strokecolor);
        strokeWeight(2);
        ellipse(this.x1, this.y1, 4, 4); //----------end of branches
        pop();
        //////////////////////////////////////////////////////////
        this.x1 = this.x + random(-75, 75);
        this.y1 = this.y - random(50, 100);
        this.d = dist(this.x, this.y, this.x1, this.y1);
        this.bend = random(40, 70);

        push();
        beginShape();
        strokeWeight(8);
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
        stroke(strokecolor);
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
        stroke(this.stroke);
        strokeWeight(4);
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
        stroke(strokecolor);
        strokeWeight(2);
        ellipse(this.x1, this.y1, 4, 4); //----------end of branches
        pop();
      } //////////////////////////////////////CLOSE ARRAY

      this.x2 = this.x2 + random(-20, 20);

      this.stembottom = 50;
      this.stembottomx = random(-10, 10);
      this.stemtop = random(100, 125);
      this.stemtopx = random(-50, 50);
      this.stemattach = random(50, 75);
      this.stemattachx = random(-10, 10);
      this.stemattach2 = random(25, 50);
      this.stemattachx2 = random(-10, 10);
      this.stepsAmnt = int(random(1, 4));
      this.topformap = this.y2 - this.stemtop;

      ///////////////////////////////////////////////////CLOSE CONSTRUCTOR

      stroke(strokecolor);
      beginShape();
      strokeWeight(15);
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
      stroke(this.stroke);
      beginShape();
      strokeWeight(4);
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
      ///////////////////////////////////////////ARRAY
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
        this.x1 = this.x + random(-75, 30);
        this.y1 = this.y - random(80, 180);
        this.d = dist(this.x, this.y, this.x1, this.y1);
        this.bend = random(40, 70);

        //////////////////////////////////////////////////////////
        push();
        beginShape();
        strokeWeight(14);
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
        stroke(this.stroke);
        strokeWeight(7);
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
        stroke(strokecolor);
        strokeWeight(2);
        ellipse(this.x1, this.y1, 3, 3); //----------end of branches
        pop();
        //////////////////////////////////////////////////////////
        this.x1 = this.x + random(-75, 75);
        this.y1 = this.y - random(50, 100);
        this.d = dist(this.x, this.y, this.x1, this.y1);
        this.bend = random(40, 70);

        push();
        beginShape();
        strokeWeight(8);
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
        stroke(strokecolor);
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
        stroke(this.stroke);
        strokeWeight(4);
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
        stroke(0);
        strokeWeight(2);
        ellipse(this.x1, this.y1, 3, 3); //----------end of branches
        pop();
      } //////////////////////////////////////////CLOSE ARRAY 2
    }
  } ///////////////////////////////////////CLOSE SPAWN
} /////////////////////////////////////////CLOSE CLASS
