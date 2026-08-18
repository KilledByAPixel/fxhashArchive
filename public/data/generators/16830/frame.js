class Frame {
  constructor(leftRightMargin) {
    this.inc = 0;
    this.ceilingY = height
    this.leftRightMargin = leftRightMargin
    this.topBottomMargin = constrain(this.leftRightMargin, 100, 300)

  }
  frameSequence() {
    this.incrementals()
    strokeWeight(2)
    stroke(colorBackAccent)
    for (let x = this.leftRightMargin; x < width - this.leftRightMargin; x++) {
      point(x, this.topBottomMargin)
      point(x, height-this.topBottomMargin)
    }
    for (let y = this.topBottomMargin; y < height - this.topBottomMargin; y++) {
      point(this.leftRightMargin, y)
      point(width-this.leftRightMargin, y)
    }
    

  }
  incrementals() {
    if (this.up && this.inc <= this.ceilingY) {
      this.inc += 2;
      if (this.inc === this.ceilingY) {
        this.up = false;
      }
    } else {
      this.up = false;
      this.inc -= 2;
      if (this.inc <= 0) {
        this.up = true;
      }
    }
  }
}