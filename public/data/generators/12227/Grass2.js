class Grass2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sx = random(-10, 10); //randomize x
    this.sy = random(0, 24); //randomize y
    this.sx2 = random(-10, 10);
  } ///////////////////////////////////////////////////////////////

  spawn() {
    fill(fillcolorgrass);
    stroke(strokecolor);
    strokeWeight(1);
    beginShape();
    vertex(this.x, this.y);
    bezierVertex(
      this.x,
      this.y,
      this.x - 7 - this.sx,
      this.y - 10,
      this.x + 5 + this.sx2,
      this.y - 20 - this.sy
    );
    fill(fillcolorgrass);

    bezierVertex(
      this.x + 5 + this.sx2,
      this.y - 20 - this.sy,
      this.x + 7 - this.sx,
      this.y - 10,
      this.x,
      this.y
    );
    endShape(CLOSE);
  }
}
