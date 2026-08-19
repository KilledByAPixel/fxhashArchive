
class IsoGrid {
  constructor(x, y, tileWidth, w, h, canvas, plant) {
    this.x = x
    this.y = y;
    this.w = w;
    this.h = h;
    this.tileWidth = tileWidth;
    this.points = [];
    this.divisor = 1.15;
    this.plantableZones = [];
    this.canvas = canvas;
    this.centerCell;
    this.tiles = [];
    this.plant = plant;
    this.visibleTiles = true;
    
  }

   update(){
     this.x = 0.5;
     this.y = getGridPosition(w);
     this.tileWidth=100;
     this.calculatePoints();
   }

  calculatePoints() {
    this.tiles = [];
    this.x = this.x*width;
    this.y = this.y*width;
    this.tileWidth = this.tileWidth*width/1000;
    for (let x = 0; x < this.w; x++) {
      for (let y = 0; y < this.h; y++) {
        let sx = x * this.tileWidth / this.divisor - y * this.tileWidth / this.divisor;
        let sy = x * this.tileWidth / 2 + y * this.tileWidth / 2;
        this.points.push({ x: sx + this.x, y: sy + this.y - this.tileWidth * this.w / 2, hasStem: getWeightedfromArray([30, 70], [1, 0]) });
      }
    }
    this.points.forEach((element, index) => {
      

      let f = new Face(createVector(element.x, element.y), this.tileWidth, "top", "up")

      f.createFace()
     
        this.tiles.push(f);
    //  }

    });
  }

  updatePosition(){
    
  }

  display(c) {

    this.canvas.noFill();
    this.canvas.stroke(c);
    this.canvas.strokeWeight(2*width/1000)


    
    this.tiles.forEach(tile => {
      if(this.visibleTiles)tile.display(this.canvas,c)      
    })
    this.canvas.strokeWeight(2*width/1000)
    this.displayPot2(c)

  }

 

  displayPot2(c1, potSettings = { depth1: 40, depth2: 40 }) {
    let points = [];
    this.canvas.strokeWeight(1.5*width/1000)
    this.canvas.stroke(c1)
    let top = createVector(this.points[0].x, this.points[0].y - this.tileWidth);
    let right = createVector(this.points[(this.w - 1) * this.h].x + this.tileWidth / this.divisor, this.points[(this.w - 1) * this.h].y - this.tileWidth / 2);
    let left = createVector(this.points[(this.h - 1)].x - this.tileWidth / this.divisor, this.points[(this.h - 1)].y - this.tileWidth / 2);
    let bottom = createVector(this.points[(this.h * this.w) - 1].x, this.points[(this.h * this.w) - 1].y);



    this.canvas.line(top.x, top.y, right.x, right.y);
    this.canvas.line(right.x, right.y, bottom.x, bottom.y);
    this.canvas.line(bottom.x, bottom.y, left.x, left.y)
    this.canvas.line(left.x, left.y, top.x, top.y)

    let right2 = getPoints(right.x, right.y, 105, potSettings.depth1 * width / 1000);
    let left2 = getPoints(left.x, left.y, 75, potSettings.depth1 * width / 1000);
    let bottom2 = createVector(bottom.x, bottom.y + potSettings.depth1 * width / 1000)

    this.canvas.line(right.x, right.y, right2.x, right2.y);
    this.canvas.line(left.x, left.y, left2.x, left2.y);
    this.canvas.line(left2.x, left2.y, bottom2.x, bottom2.y)
    this.canvas.line(right2.x, right2.y, bottom2.x, bottom2.y)

    this.canvas.line(bottom.x, bottom.y, bottom2.x, bottom2.y)

    this.canvas.stroke(c1);

    let bottom3 = createVector(bottom2.x, bottom2.y + potSettings.depth2 * width / 1000);
    let angle = atan2(bottom2.y - right2.y, bottom2.x - right2.x);
    let startPointRight = getPoints(right2.x, right2.y, angle, 40 * width / 1000)
    let right3 = getPoints(startPointRight.x, startPointRight.y, 105, potSettings.depth2 * width / 1000)

    let startPointLeft = getPoints(left2.x, left2.y, atan2(bottom2.y - left2.y, bottom2.x - left2.x), 40 * width / 1000)
    let left3 = getPoints(startPointLeft.x, startPointLeft.y, 75, potSettings.depth2 * width / 1000)

    this.canvas.line(bottom3.x, bottom3.y, right3.x, right3.y)
    this.canvas.line(startPointRight.x, startPointRight.y, right3.x, right3.y)


    this.canvas.line(bottom3.x, bottom3.y, left3.x, left3.y)
    this.canvas.line(startPointLeft.x, startPointLeft.y, left3.x, left3.y)

  }


}


