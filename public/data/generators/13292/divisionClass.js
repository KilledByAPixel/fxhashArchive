class Line {
  constructor(a, b) {
    this.A = a;
    this.B = b;
  }
  display(sw) {
    strokeWeight(sw);
    line(this.A.x, this.A.y, this.B.x, this.B.y);
  }
}

class Cell {
  constructor(p1, p2, index) {    //P
    this.P1 = p1;
    this.P2 = p2;
    this.A, this.B, this.C, this.D;
    this.debug = false;

    this.corners;
    this.cellIndex = index;
    this.center;
    this.ratio = {};

    this.area;
    this.edgeLength = {};
    this.children = [];
    this.color;
    this.occupied = false;
    this.canvasCorners = [createVector(0, 0), createVector(width, 0), createVector(width, height), createVector(0, height)];
    this.sdLevel;
  }

  calculateProperties() {
    let lAB = this.B.x - this.A.x;//dist(this.A.x, this.A.y, this.B.x, this.B.y);
    let lBC = this.C.y - this.B.y;//dist(this.B.x, this.B.y, this.C.x, this.C.y);
    this.ratio = {
      xy: (lAB / lBC),
      yx: (lBC / lAB)

    };
    this.edgeLength = { AB: lAB, BC: lBC };
    this.area = parseFloat((lAB) * (lBC) / (width * height)).toPrecision(2);
  }

  sortPoints() {
    //randomSeed(seed)
    let P1 = this.P1;
    let P2 = this.P2;
    let P3 = createVector(this.P1.x, this.P2.y);
    let P4 = createVector(this.P2.x, this.P1.y);
    let corners = [P1, P4, P2, P3];

    let distArray = [];
    let sortedCornerIndex = [];

    for (let j = 0; j < this.canvasCorners.length; j++) {
      for (let i = 0; i < corners.length; i++) {
        let d = dist(corners[i].x, corners[i].y, this.canvasCorners[j].x, this.canvasCorners[j].y);
        distArray.push(d);
      }
      let min = Math.min(...distArray)
      sortedCornerIndex.push(distArray.indexOf(min));
      distArray = [];

    }
    //console.log(sortedCornerIndex)
    this.A = corners[sortedCornerIndex[0]];
    this.B = corners[sortedCornerIndex[1]];
    this.C = corners[sortedCornerIndex[2]];
    this.D = corners[sortedCornerIndex[3]];


    this.corners = [
      this.A,
      this.B,
      this.C,
      this.D
    ];

    this.center = createVector(this.A.x + (this.B.x - this.A.x) / 2, this.A.y + (this.D.y - this.A.y) / 2);
    this.calculateProperties();
  }

  drawBorder(sw,){
    let edges = [
      new Line(this.A, this.B),
      new Line(this.B, this.C),
      new Line(this.C, this.D),
      new Line(this.D, this.A)
    ];
    edges.forEach(element => element.display(sw * width/1000));
  
  }

 

  createChildren(points) {


    let children = [];
    let newcell = new Cell(points.p1, points.p2, this.cellIndex);
    newcell.sortPoints(this.canvasCorners);
    children.push(newcell);


    for (let i = 0; i < newcell.corners.length; i++) {
      let gcCell = new Cell(newcell.corners[i], this.corners[i], (newcell.cellIndex+1) +i);
      gcCell.sortPoints(this.canvasCorners)
     //if(gcCell.edgeLength.AB>10*width/1000 || gcCell.edgeLength.BC>width*10/1000){
      children.push(gcCell);
     //}
     

    }

    let gcc = [];
    gcc.push(new Cell(children[1].B, children[2].D, children.length + 1));
    gcc.push(new Cell(children[2].D, children[3].B, children.length + 2));
    gcc.push(new Cell(children[3].A, children[4].C, children.length + 3));
    gcc.push(new Cell(children[4].B, children[1].D, children.length + 4));

    gcc.forEach(gcc => { gcc.sortPoints(this.canvasCorners) })

    return children.concat(gcc);

  }

  createPoints(thresholdx, thresholdy, marginX, marginY) {
    this.sortPoints();
    let np1;
    let np2;;
    let counter = 0;

    do {
      np1 = createVector(randRange(this.A.x + marginX, this.B.x - marginX), randRange(this.B.y + marginY, this.C.y - marginY));
      np2 = createVector(randRange(this.A.x + marginX, this.B.x - marginX), randRange(this.B.y + marginY, this.C.y - marginY));
      counter++;
      if (counter > 100) break;
    } while (!(Math.abs(np1.x - np2.x) > thresholdx && Math.abs(np1.y - np2.y) > thresholdy))
    //console.log("Counter " + counter)
    return {
      p1: np1,
      p2: np2,
    }
  }

  // createPoints(startx,endx,starty,endy,dmin,dmax){
  //   this.sortPoints();
  //   let np1,np2;
  //   let counter = 0;
  //   do{
  //     np1=randomPoints(startx,endx,starty,endy);
  //     np2 =randomPoints(startx,endx,starty,endy);
  //     counter++;
  //     if (counter > 100) break;
  //   }while(!( isDistBetween(np1,np2,dmin,dmax)) )

  //     return { p1 : np1, p2:np2}

  // }

  subDivide(level = 1, threshXMultiplier , threshYMultiplier , xMarginDiv, yMarginDiv ) {  //0.25,0,25,4,4 uniform
    let cells = [];
    this.sdLevel=level;
    switch (level) {

      case 1:
      this.sortPoints(); 
      let newPoints = this.createPoints(
          (Math.abs(this.B.x - this.A.x)) * threshXMultiplier,
          (Math.abs(this.B.y - this.C.y)) * threshYMultiplier,
          this.edgeLength.AB/ xMarginDiv,
          this.edgeLength.BC / yMarginDiv);//, map(level,1,8,20,1) * f);

        let children = this.createChildren(newPoints);
        return children;
      case 2:
        cells = this.subDivide(1,threshXMultiplier , threshYMultiplier , xMarginDiv, yMarginDiv);
        return this.sd(cells, 1,threshXMultiplier , threshYMultiplier , xMarginDiv, yMarginDiv);
      case 3:
        cells = this.subDivide(2,threshXMultiplier , threshYMultiplier , xMarginDiv, yMarginDiv);
        return this.sd(cells, 1,threshXMultiplier , threshYMultiplier , xMarginDiv, yMarginDiv);
      case 4:
        cells = this.subDivide(3,threshXMultiplier , threshYMultiplier , xMarginDiv, yMarginDiv);
        return this.sd(cells, 1,threshXMultiplier , threshYMultiplier , xMarginDiv, yMarginDiv);
      case 5:
        cells = this.subDivide(4,threshXMultiplier , threshYMultiplier , xMarginDiv, yMarginDiv);
        return this.sd(cells, 1,threshXMultiplier , threshYMultiplier , xMarginDiv, yMarginDiv);
      case 6:
        cells = this.subDivide(5,threshXMultiplier , threshYMultiplier , xMarginDiv, yMarginDiv);
        return this.sd(cells, 1,threshXMultiplier , threshYMultiplier , xMarginDiv, yMarginDiv);
        case 7:
          cells = this.subDivide(6,threshXMultiplier , threshYMultiplier , xMarginDiv, yMarginDiv);
          return this.sd(cells, 1,threshXMultiplier , threshYMultiplier , xMarginDiv, yMarginDiv);

    }
}

  sd(cells, n,threshXMultiplier , threshYMultiplier , xMarginDiv, yMarginDiv) {
    let cs2 = [];
    cells.forEach(c => {
     
        let nc = c.subDivide(n,threshXMultiplier , threshYMultiplier , xMarginDiv, yMarginDiv);
        cs2.push(nc);
      
     
    })
    return (cs2).flat();
  }

}


function randomPoints(x1, x2, y1, y2) {
  let x = random(x1, x2);
  let y = random(y1, y2);
  return createVector(x, y)
}

let isDistBetween = (p1, p2, min, max) => {
  let angle = Math.abs(p1.x - p2.x) > min && Math.abs(p1.x - p2.x) < max && Math.abs(p1.y - p2.y) > min && Math.abs(p1.y - p2.y) < max
  console.log(angle);
  return angle
}