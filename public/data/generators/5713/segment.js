class Segment {
  constructor(x, y, col, row, i){
    this.x = max(0, x - sx.segmentBorder);
    this.y = max(0, y - sx.segmentBorder);

    this.x2 = min(width, x + sx.segmentWidth + sx.segmentBorder);
    this.y2 = min(height, y + sx.segmentHeight + sx.segmentBorder);

    this.width = this.x2 - this.x;
    this.height = this.y2 - this.y;

    this.points = [];
    this.radiusPoints = [];

    this.col = col;
    this.row = row;

    this.i = i;

  }

  generateNeighbours(){
    this.neighbours = [];

    for (let c = -1; c < 2; c++){
      for(let r = -1; r < 2; r++){
        let cc = this.col - c;
        let rr = this.row - r;

        if (cc > 0 && cc < sx.numDivides && rr > 0 && rr < sx.numDivides){
          let i = cc + rr * sx.numDivides;
          this.neighbours.push(i);
        }
      }
    }
  }

  addPoint(p){
    this.points.push(p);
  }

  addRadiusPoint(p, r){
    this.radiusPoints.push({
      position: p,
      radius: r
    });
  }

  contains(p, rad){
    if (this.x > p.x + rad || this.y > p.y + rad || p.x - rad > this.x2 || p.y - rad > this.y2) return false;
    else return true;
  }

  pointTouches(np){
    let border = sx.pathBorder.size;
    //if (sx.varigatedMode != "off") border = sx.pathBorder.size * map(np.position.y, 0, height, 0.5, 1.0, true);

    for (let p of this.points){
      if (tooClose(p.position, np.position, border + np.rad + p.rad)){
        return true;
      }
    }
    return false;
  }

  display(){
    noFill();
    stroke(0,0,100);
    rect(this.x, this.y, this.width, this.height);
  }
}
