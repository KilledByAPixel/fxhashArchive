class Grass {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sx = random(-10 - scgrass * 2, 10 + scgrass * 2); //randomize x
    this.sy = random(0, 24) * scgrass; //randomize y
    this.sx2 = random(-10, 10) * scgrass;
  }
  spawn() {
    fill(fillcolorgrass);
    stroke(strokecolor);
    strokeWeight(1);
    beginShape();
    vertex(this.x, this.y);
    bezierVertex(
      this.x,
      this.y,
      this.x - 3 - this.sx,
      this.y - 5 * scgrass,
      this.x + 3 + this.sx2,
      this.y - 10 - this.sy
    );
    fill(fillcolorgrass);

    bezierVertex(
      this.x + 3 + this.sx2,
      this.y - 10 - this.sy,
      this.x + 3 + this.sx,
      this.y - 5 * scgrass,
      this.x,
      this.y
    );
    endShape(CLOSE);
    scgrass = scgrass + 0.00133;
  }
}
