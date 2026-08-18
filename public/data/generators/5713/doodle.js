class Doodle{
  constructor(locX, locY, attempt, a, numSides, large, burstNum){
    this.valid = true;
    this.center = createVector(locX, locY);
    this.attempt = attempt;
    let info = {numSides, large, burstNum}
    this.generate(info);
    this.assignSegments();
    this.valid = this.testValidity();


    if (this.valid){
      this.chooseColor(this.shapeName);
      this.addToSegments();
    }
  }

  resize(){
    this.center.x = map(this.center.x, 0, prevDim, 0, dim);
    this.center.y = map(this.center.y, 0, prevDim, 0, dim);

    this.sw = map(this.sw, 0, prevDim, 0, dim);

    for (let p of this.points){
      p.position.x = map(p.position.x, 0, prevDim, 0, dim);
      p.position.y = map(p.position.y, 0, prevDim, 0, dim);
    }

    if (this.drawPoints != null){
      for (let p of this.drawPoints){
        p.x = map(p.x, 0, prevDim, 0, dim);
        p.y = map(p.y, 0, prevDim, 0, dim);
      }
    }

    if (this.shapeName = "circ") this.dia = map(this.dia, 0, prevDim, 0, dim);

  }

  assignSegments(){
    for(let p of this.points){
      p.segments = [];
      for(let s of segments){
        if(s.contains(p.position, p.rad)){
          p.segments.push(s.i);
        }
      }
    }
  }

  chooseColor(shape){
    if (sx.colSelection == "by shape" || shape == "burst"|| shape == "dot") this.col = color(echoice(sx.palette[shape]));
    else {
      let nx = map(this.center.x, 0, width, 0, 1000) * sx.colRes;
      let ny = map(this.center.y, 0, height, 0, 1000) * sx.colRes;

      let colN = noise(nx, ny, 65465);
      let colChoice = int(map(colN, 0, 1, 0, sx.palette.doodle.length));

      this.col = sx.palette.doodle[colChoice];
    }

  }

  addToSegments(){
    for (let p of this.points){
      for (let s of p.segments){
        segments[s].addPoint(p);
      }
    }
  }

  testValidity(){
    let valid = true;
    for (let p of this.points){
      for (let s of p.segments){
        if (segments[s].pointTouches(p)){
          valid = false;
          break;
        }
      }
      if (!valid) break;
    }
    return valid;
  }

}
