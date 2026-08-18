class Frame {
  constructor() {
    this._frame = SET.frame;
    this._filledFrame = SET.filledFrame;
    this._multiFrame = SET.multiFrame;
  }
  render(y) {
    const off = 30;
    if (!this._frame || y < H * 0.6 || y > H - off) return;
    const c = PALETTE.sky.frame();

    push();
    if (this._filledFrame && !this._multiFrame) {
      stroke(c);
      strokeWeight(R.num(1, 4) * U);
      fill(hue(c), saturation(c), lightness(c), 85);
      rect(off * U, off * U, (W - off * 2) * U, (H - off * 2) * U);
      this._frame = false;
    } else if (this._filledFrame && this._multiFrame) {
      noStroke();
      fill(hue(c), saturation(c), lightness(c), 5);
      rect(off * U, off * U, (W - off * 2) * U, (H - off * 2) * U);
    } else {
      noFill();
      stroke(c);
      strokeWeight(R.num(1, 4) * U);
      rect(off * U, off * U, (W - off * 2) * U, (H - off * 2) * U);
      this._frame = false;
    }
    pop();
  }
}
