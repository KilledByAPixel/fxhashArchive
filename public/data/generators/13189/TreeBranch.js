class TreeBranch {
  constructor(x, y, branchlength, ym) {
    this.x = x;
    this.y = y;
    this.ymult = ym;
    stroke(0);
    strokeWeight(5);
    this.smallbranchlength = random(-20, 20);
    this.branchlength = branchlength;
    this.branchcurve = random(10, 15);
    this.branchtip = random(-5, 15);
  }
  draw() {
    if (this.ymult == 1) {
      stroke(treebranchcolor);
      strokeWeight(2);
      noFill();
      bezier(
        this.x,
        this.y,
        this.x - this.branchlength * 0.5,
        this.y - this.branchcurve,
        this.x - this.branchlength * 0.8,
        this.y - this.branchcurve * 3,
        this.x - this.branchlength,
        this.y - this.branchcurve * 5 + this.branchtip
      );

      for (this.i = 0; this.i < 25; this.i++) {
        this.t = this.i / 25;
        this.x2 = bezierPoint(
          this.x,
          this.x - this.branchlength * 0.5,
          this.x - this.branchlength * 0.8,
          this.x - this.branchlength,
          this.t
        );
        this.y2 = bezierPoint(
          this.y,
          this.y - this.branchcurve,
          this.y - this.branchcurve * 3,
          this.y - this.branchcurve * 5 + this.branchtip,
          this.t
        );
        ellipse(this.x2, this.y2, 3, 3);
        bezier(
          this.x2,
          this.y2,
          this.x2 + random(-5, 3),
          this.y2 + this.smallbranchlength / 3,
          this.x2 + random(-8, 3),
          this.y2 + this.smallbranchlength / 3,
          this.x2 + random(-10, 3),
          this.y2 + this.smallbranchlength
        );
        ///////////////////////////////////////////////rightside branches
        this.branchcurve = random(10, 15);
        this.smallbranchlength = random(-20, 20);
        this.branchtip = random(-5, 15);
      }
      this.branchcurve = random(10, 15);
      this.smallbranchlength = random(-20, 20);
      this.branchtip = random(-5, 15);
      this.branchlength = this.branchlength + random(-10, 10);
      this.y = this.y + random(-15, 15);
      bezier(
        this.x,
        this.y,
        this.x + this.branchlength * 0.5,
        this.y - this.branchcurve,
        this.x + this.branchlength * 0.8,
        this.y - this.branchcurve * 3,
        this.x + this.branchlength,
        this.y - this.branchcurve * 5 + this.branchtip
      );

      for (this.i = 0; this.i < 25; this.i++) {
        this.t = this.i / 25;
        this.x2 = bezierPoint(
          this.x,
          this.x + this.branchlength * 0.5,
          this.x + this.branchlength * 0.8,
          this.x + this.branchlength,
          this.t
        );
        this.y2 = bezierPoint(
          this.y,
          this.y - this.branchcurve,
          this.y - this.branchcurve * 3,
          this.y - this.branchcurve * 5 + this.branchtip,
          this.t
        );
        ellipse(this.x2, this.y2, 3, 3);
        bezier(
          this.x2,
          this.y2,
          this.x2 + random(-5, 3),
          this.y2 + this.smallbranchlength / 3,
          this.x2 + random(-8, 3),
          this.y2 + this.smallbranchlength / 3,
          this.x2 + random(-10, 3),
          this.y2 + this.smallbranchlength
        );
        this.branchcurve = random(10, 15);
        this.smallbranchlength = random(-20, 20);
        this.branchtip = random(-5, 15);
      }
    }
    //////////////////////////////////////////////////////////////////////////
    else {
      stroke(treebranchcolor);
      strokeWeight(2);
      noFill();
      bezier(
        this.x,
        this.y,
        this.x - this.branchlength * 0.5,
        this.y + this.branchcurve,
        this.x - this.branchlength * 0.8,
        this.y + this.branchcurve * 3,
        this.x - this.branchlength,
        this.y + this.branchcurve * 5 + this.branchtip
      );

      for (this.i = 0; this.i < 25; this.i++) {
        this.t = this.i / 25;
        this.x2 = bezierPoint(
          this.x,
          this.x - this.branchlength * 0.5,
          this.x - this.branchlength * 0.8,
          this.x - this.branchlength,
          this.t
        );
        this.y2 = bezierPoint(
          this.y,
          this.y + this.branchcurve,
          this.y + this.branchcurve * 3,
          this.y + this.branchcurve * 5 + this.branchtip,
          this.t
        );
        ellipse(this.x2, this.y2, 3, 3);
        bezier(
          this.x2,
          this.y2,
          this.x2 + random(-5, 3),
          this.y2 + this.smallbranchlength / 3,
          this.x2 + random(-8, 3),
          this.y2 + this.smallbranchlength / 3,
          this.x2 + random(-10, 3),
          this.y2 + this.smallbranchlength
        );
        ///////////////////////////////////////////////rightside branches
        this.branchcurve = random(10, 15);
        this.smallbranchlength = random(-20, 20);
        this.branchtip = random(-5, 15);
      }
      this.branchcurve = random(10, 15);
      this.smallbranchlength = random(-20, 20);
      this.branchtip = random(-5, 15);
      this.branchlength = this.branchlength + random(-10, 10);
      this.y = this.y + random(-15, 15);
      bezier(
        this.x,
        this.y,
        this.x + this.branchlength * 0.5,
        this.y + this.branchcurve,
        this.x + this.branchlength * 0.8,
        this.y + this.branchcurve * 3,
        this.x + this.branchlength,
        this.y + this.branchcurve * 5 + this.branchtip
      );

      for (this.i = 0; this.i < 25; this.i++) {
        this.t = this.i / 25;
        this.x2 = bezierPoint(
          this.x,
          this.x + this.branchlength * 0.5,
          this.x + this.branchlength * 0.8,
          this.x + this.branchlength,
          this.t
        );
        this.y2 = bezierPoint(
          this.y,
          this.y + this.branchcurve,
          this.y + this.branchcurve * 3,
          this.y + this.branchcurve * 5 + this.branchtip,
          this.t
        );
        ellipse(this.x2, this.y2, 3, 3);
        bezier(
          this.x2,
          this.y2,
          this.x2 + random(-5, 3),
          this.y2 + this.smallbranchlength / 3,
          this.x2 + random(-8, 3),
          this.y2 + this.smallbranchlength / 3,
          this.x2 + random(-10, 3),
          this.y2 + this.smallbranchlength
        );
        this.branchcurve = random(10, 15);
        this.smallbranchlength = random(-20, 20);
        this.branchtip = random(-5, 15);
      }
    }
  }
}
