class Plant {
  constructor() {
    this.x2 = 0;
    this.y2 = 0;
    this.xoffset = random(-10, 10);
    this.yoffset = random(-30, 20) * scgrass * 0.6;
    this.ylength = random(15, 40);
    this.plantsamnt = int(random(1, 3.5));
    this.shape = int(random(1, 3.99));
    this.xoffsetleaves = random(-10, 10);
  }
  draw() {
    if (hasplant > 0.35) {
      for (this.i = 0; this.i < this.plantsamnt; this.i++) {
        this.x = random(0, width);
        if (sc < 1) {
          this.x = random(0, width * 2);
        }
        this.y = grasslocy;
        this.x2 = this.x;
        this.y2 = this.y;

        for (this.i2 = 0; this.i2 < 8; this.i2++) {
          this.x1 = this.x2;
          this.y1 = this.y2;
          strokeWeight(6 + scgrass / 3);
          stroke(strokecolor);
          line(
            this.x1,
            this.y1,
            this.x1 + this.xoffset * (1 + scgrass / 2),
            this.y1 - this.ylength * scgrass * 0.8 - this.yoffset
          );
          strokeWeight(3 + scgrass / 3);
          stroke(fillcolorplant);
          line(
            this.x1,
            this.y1,
            this.x1 + this.xoffset * (1 + scgrass / 2),
            this.y1 - this.ylength * scgrass * 0.8 - this.yoffset
          );
          stroke(strokecolor);
          strokeWeight(1);

          if (this.shape == 1) {
            fill(fillcolorplant);
            ellipse(
              this.x1 + this.xoffset * (1 + scgrass / 2),
              this.y1 - this.ylength * scgrass * 0.8 - this.yoffset,
              9 + scgrass / 3,
              9 + scgrass / 3
            );
          }
          if (this.shape == 2) {
            beginShape();
            fill(fillcolorplant);
            vertex(
              this.x1 + this.xoffset * (1 + scgrass / 2),
              this.y1 - this.ylength * scgrass * 0.8 - this.yoffset + 5
            );
            bezierVertex(
              this.x1 + this.xoffset * (1 + scgrass / 2),
              this.y1 - this.ylength * scgrass * 0.8 - this.yoffset + 5,
              this.x1 + this.xoffset * (1 + scgrass / 2) - 3 * (1 + scgrass),
              this.y1 -
                this.ylength * scgrass * 0.8 -
                this.yoffset -
                3 * (1 + scgrass),
              this.x1 + this.xoffset * (1 + scgrass / 2) + this.xoffsetleaves,
              this.y1 -
                this.ylength * scgrass * 0.8 -
                this.yoffset -
                6 * (1 + scgrass)
            );

            bezierVertex(
              this.x1 + this.xoffset * (1 + scgrass / 2) + this.xoffsetleaves,
              this.y1 -
                this.ylength * scgrass * 0.8 -
                this.yoffset -
                6 * (1 + scgrass),
              this.x1 + this.xoffset * (1 + scgrass / 2) + 3 * (1 + scgrass),
              this.y1 -
                this.ylength * scgrass * 0.8 -
                this.yoffset -
                3 * (1 + scgrass),
              this.x1 + this.xoffset * (1 + scgrass / 2),
              this.y1 - this.ylength * scgrass * 0.8 - this.yoffset + 5
            );

            endShape(CLOSE);
            line(
              this.x1 + this.xoffset * (1 + scgrass / 2),
              this.y1 - this.ylength * scgrass * 0.8 - this.yoffset + 5,
              this.x1 + this.xoffset * (1 + scgrass / 2) + this.xoffsetleaves,
              this.y1 -
                this.ylength * scgrass * 0.8 -
                this.yoffset -
                6 * (1 + scgrass) +
                8
            );
          }

          this.xoffset = random(-10, 10);
          this.yoffset = random(-30, 20) * scgrass * 0.6;
          this.ylength = random(15, 40);
          this.xoffsetleaves = random(-10, 10);
        } /////////endarray this.i2
      } //////endarray this.i
    }
  }
}
