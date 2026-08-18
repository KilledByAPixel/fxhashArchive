class Patterns {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.angles = [50, 4000, 7000];
    this.angle = random(this.angles);
    this.xoffset = random(20, 40);
    this.doubleline = random(1);
    this.linewidthrandom = random(1);
    this.heightM = int(random(1, 2.99));
    this.style = random(1);
    this.chooseshape = random(1);
    this.hasnopattern = random(1);
    this.ellipsescale = random(1500, 2500);
    this.ellipseheight = random(-800, 400);
    this.sqhasdots = random(1);
    this.bgcolors = [fillcolorpattern, color(0, 0, 0, 30)];
    this.bgr = random(this.bgcolors);

    if (this.style > 0.3) {
      this.l = createGraphics(width, height);
      this.l.background(this.bgr);
      this.l.fill(fillcolorpattern);
      this.l.stroke(strokecolor);
      this.l.strokeWeight(int(random(1, 4)));

      for (let i = 0; i < 1000; i++) {
        if (this.linewidthrandom > 0.7) {
          this.l.strokeWeight(int(random(1, 4)));
        }

        this.l.stroke(strokecolor);
        this.l.line(this.x, this.y, this.x - this.angle, height * this.heightM);

        if (this.doubleline > 0.4) {
          this.l.stroke(fillcolorbg);
          this.l.strokeWeight(3);
          this.l.line(
            this.x + this.xoffset / 2,
            this.y,
            this.x + this.xoffset / 2 - this.angle,
            height
          );
        }
        this.x = this.x + this.xoffset;
      }

      this.lines = createGraphics(width, height);
    } else {
      this.l = createGraphics(width, height);
      this.l.background(this.bgr);
      this.l.fill(fillcolorpattern);
      this.l.stroke(strokecolor);
      this.l.strokeWeight(int(random(1, 4)));

      for (let i = 0; i < 1000; i++) {
        if (this.linewidthrandom > 0.7) {
          this.l.strokeWeight(int(random(1, 4)));
        }

        this.l.stroke(strokecolor);
        this.l.ellipse(this.x, this.y, this.x - 9000, height * 2.2);

        if (this.doubleline > 0.4) {
          this.l.stroke(fillcolorbg);
          this.l.strokeWeight(3);
          this.l.ellipse(
            this.x + this.xoffset / 2,
            this.y,
            this.x + this.xoffset / 2 - this.angle,
            height
          );
        }
        this.x = this.x + this.xoffset;
      }

      this.lines = createGraphics(width, height);
    }
  }
  draw() {
    if (this.hasnopattern > 0.25) {
      if (this.sqhasdots > 0.65) {
        fill(fillcolorpattern);
        rect(0, 0, width, height);
      }
      setFill(createPattern(this.l), this.lines);
      this.lines.noStroke();
      if (this.chooseshape > 0.5) {
        this.lines.rect(0, 0, width, height);
      } else {
        fill(fillcolorpattern);
        noStroke();
        ellipse(
          width / 2,
          height / 2 + this.ellipseheight,
          this.ellipsescale,
          this.ellipsescale
        );
        this.lines.ellipse(
          width / 2,
          height / 2 + this.ellipseheight,
          this.ellipsescale,
          this.ellipsescale
        );
      }
      image(this.lines, 0, 0);
    } else {
    }
  }
}
function createPattern(l, lines = this) {
  return lines.drawingContext.createPattern(l.canvas, "repeat");
}
function setFill(L, lines = this) {
  lines.fill(strokecolor);
  lines._renderer._setFill(L);
}
