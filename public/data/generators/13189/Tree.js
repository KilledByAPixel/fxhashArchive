class Tree {
  constructor(x, y, ym) {
    this.x = x;
    this.ymult = ym;
    this.y = y;
    this.treetopoffset = random(-20, 20);
    this.treewidth = random(5, 10);
    this.treeheight = random(500, 900);
    this.treeangle = random(-35, 20);
    this.colors = [strokecolor, treetrunkcolor];
    this.colors2 = random(this.colors);
  }
  draw() {
    if (this.ymult == 1) {
      fill(treetrunkcolor);
      strokeWeight(2);
      beginShape();
      vertex(this.x, this.y);
      bezierVertex(
        this.x,
        this.y,
        this.x + 15,
        this.y - 40,
        this.x + 30 + this.treeangle,
        this.y - this.treeheight
      );
      bezierVertex(
        this.x + 30 + this.treeangle + this.treewidth / 1.5,
        this.y - this.treeheight,
        this.x + 15 + this.treewidth / 2.5,
        this.y - 40,
        this.x + this.treewidth + 15,
        this.y
      );
      endShape(CLOSE);
      ////////////////////////////////////////////////////treetrucnk lines
      for (this.i2 = 0; this.i2 < 290; this.i2++) {
        this.t = this.i2 / 290;
        this.xb = bezierPoint(
          this.x,
          this.x + 15,
          this.x + 15,
          this.x + 30 + this.treeangle,
          this.t
        );
        this.yb = bezierPoint(
          this.y,
          this.y - 40,
          this.y - 40,
          this.y - this.treeheight,
          this.t
        );
        line(
          this.xb,
          this.yb,
          this.xb + random(0, this.treewidth / 2.5),
          this.yb
        );
        stroke(this.colors2);
        this.colors2 = random(this.colors);
      }

      /////////////////////////////////////////////////add branches
      this.branchlength = 50;
      for (this.i2 = 0; this.i2 < 17; this.i2++) {
        this.t = this.i2 / 17;
        this.xb = bezierPoint(
          this.x + 15,
          this.x + 15,
          this.x + 15,
          this.x + 30 + this.treeangle,
          this.t
        );
        this.yb = bezierPoint(
          this.y - this.treeheight / 4,
          this.y - this.treeheight / 2,
          this.y - this.treeheight / 1.5,
          this.y - this.treeheight,
          this.t
        );

        if (this.yb > this.y - this.treeheight / 2.5) {
          this.branchlength += 9;
        } else {
          this.branchlength -= 6.8;
        }
        treebranchvar = new TreeBranch(
          this.xb + 5,
          this.yb + random(-5, 5),
          this.branchlength + random(35),
          1
        );

        treebranchvar.draw();
      }
    }

    /////////////////////////////////////////////////////////////////////////reflection/////////////
    else {
      // this.treeheight = random(900, 1500);
      this.treeheight = this.treeheight * 1.5;
      fill(treetrunkcolor);
      strokeWeight(2);
      beginShape();
      vertex(this.x, this.y);
      bezierVertex(
        this.x,
        this.y,
        this.x + 15,
        this.y + 40,
        this.x + 30 + this.treeangle,
        this.y + this.treeheight
      );
      bezierVertex(
        this.x + 30 + this.treeangle + this.treewidth / 1.5,
        this.y + this.treeheight,
        this.x + 15 + this.treewidth / 2.5,
        this.y + 40,
        this.x + this.treewidth + 15,
        this.y
      );
      endShape(CLOSE);
      ////////////////////////////////////////////////////treetrucnk lines
      for (this.i2 = 0; this.i2 < 290; this.i2++) {
        this.t = this.i2 / 290;
        this.xb = bezierPoint(
          this.x,
          this.x + 15,
          this.x + 15,
          this.x + 30 + this.treeangle,
          this.t
        );
        this.yb = bezierPoint(
          this.y,
          this.y + 40,
          this.y + 40,
          this.y + this.treeheight,
          this.t
        );
        line(
          this.xb,
          this.yb,
          this.xb + random(0, this.treewidth / 2.5),
          this.yb
        );
        stroke(this.colors2);
        this.colors2 = random(this.colors);
      }

      /////////////////////////////////////////////////add branches
      this.branchlength = 50;
      for (this.i2 = 0; this.i2 < 17; this.i2++) {
        this.t = this.i2 / 17;
        this.xb = bezierPoint(
          this.x + 15,
          this.x + 15,
          this.x + 15,
          this.x + 30 + this.treeangle,
          this.t
        );
        this.yb = bezierPoint(
          this.y + this.treeheight / 4,
          this.y + this.treeheight / 2,
          this.y + this.treeheight / 1.5,
          this.y + this.treeheight,
          this.t
        );

        if (this.yb < this.y + this.treeheight / 2.5) {
          this.branchlength += 9;
        } else {
          this.branchlength -= 6.8;
        }
        treebranchvar = new TreeBranch(
          this.xb + 5,
          this.yb + random(-5, 5),
          this.branchlength + random(35),
          -1
        );

        treebranchvar.draw();
      }
    } ////////////////////////////////////////////////////////////////////endreflection
  }
}
