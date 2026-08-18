
let numLP, sT_var, shuffleBool, HorVer_var, gradients, layer2;

function addVoice() {
    $fx.randminter.reset();
    sd = $fx.randminter()*99999999999;
    for (let i = 0; i < $fx.getParam('scarf'); i++) {
      sd = $fx.randminter()*99999999999;
    }
    randomSeed(sd); 

    bg1.background(0);
    bg1.noStroke();
    bg11.background(0);
    bg11.noStroke();
    bg2.background(0);
    bg3.background(0);
    r1 = random().toFixed(3);
    r2 = random().toFixed(3);

    col = random([
      [0.68, 0.80, 0.90], 
      [0.11, 0.40, 0.70],   
      [0.22, 0.50, 0.25],
      [0.91, 0.19, 0.08], 
      [0.98, 0.73, 0.00],  
      [1.00, 0.41, 0.13],
      [1.00,0.49,0.68]]
    );

    palette =   {
      colors: [
        color(255),
        color(0.97*255),
        color(0.9*255),
        color(0.85*255),
        color(0.75*255),
        color(0.7*255),
        color(0.65*255),
        color(0.6*255),
        color(0.55*255),
        color(0.45*255),
        color(0.4*255),
        color(0.35*255),
        color(0.15*255),
        color(0.1*255),
        color(0.03*255),
        color(0),

      ],
      probability: [7,3,2,2,1,1,0.5,0.5,0.5,0.5,1,1,2,2,3,7],
    };

    let v = $fx.getParam('voice1');
    let rects = []; 
    let p1 = 0; 
    rects.push({
      i: p1,
      vv: 0.3,
    });
    let p2; 
    for (let i = 0; i < v.length; i++) {
      p2 = map(v[i],0,255,0,1);
      if (p1 < 0.25 && p2 > 0.25) {
        rects.push({
          i: i,
          vv: p2,
        });
      }
      if (p1 > 0.25 & p2 < 0.25) {
        rects.push({
          i: i,
          vv: p2,
        });
      }      
      if (p1 < 0.4 && p2 > 0.4) {
        rects.push({
          i: i,
          vv: p2,
        });
      }
      if (p1 > 0.4 & p2 < 0.4) {
        rects.push({
          i: i,
          vv: p2,
        });
      }
      p1 = p2;
    }

    numLP = random([0,0,0,1,1,2,2,2]);
    shuffleBool = random([true,false]);
    sT_var = random([0,1,2]);
    HorVer_var = random(); 
    gradients = random([true,false]);
    layer2 = false; 

    for (let i = 0; i < rects.length; i++) {
      let y = rects[i].i;
      let h; 
      if (i == rects.length-1) {
        h = v.length - rects[i].i;
      } else {
        h = rects[i+1].i - rects[i].i;     
      }
      let dy = bg1.height/v.length;
      let nV = floor(map(rects[i].vv,0.1,0.9,1,10));
      base_pattern(0,y*dy,bg1.width,dy*h,bg1,nV);
    }


    palette =   {
      colors: [
        color(255),
        color(0.97*255),
        color(0.9*255),
        color(0.85*255),
        color(0.15*255),
        color(0.1*255),
        color(0.03*255),
        color(0),

      ],
      probability: [5,4,3,2,2,3,4,5],
    };    

    layer2 = true;
    for (let i = 0; i < rects.length; i++) {
      let y = rects[i].i;
      let h; 
      if (i == rects.length-1) {
        h = v.length - rects[i].i;
      } else {
        h = rects[i+1].i - rects[i].i;     
      }
      let dy = bg1.height/v.length;
      let nV = floor(map(rects[i].vv,0.0,0.8,1,8));
      base_pattern(0,y*dy,bg11.width,dy*h,bg11,nV);
    }

    bg2.noStroke();
    let tim = $fx.getParam('voice2');
    let tim_tot = 0;
    for (let i = 0; i < tim.length; i++) {
      let dx = bg2.width;
      let dy = bg2.height/v.length; 
      let x = 0; 
      let y = i*dy - bg2.height/2;

      let a1 = tim[i];
      let a2 = tim[0];
      if (i < tim.length-1) {
        a2 = tim[i+1];
      }
      
      let n = 30;
      for (let j = 0; j < n; j++)  {
        let c = lerpColor(color(a1),color(a2),j/n);
        bg2.fill(c); 
        let y_s = y + j*dy/n;
        bg2.rect(x,y_s,dx,dy/n);
      }

      tim_tot += a1/255;
    }   

    let f = $fx.getParam('voice3');
    let n = tim.length;
    let m = 200;
    if (tim_tot < 9) {
      m = 75;
    }
    bg3.noStroke();
    let dx = bg3.width/n; 
    let dy = bg3.height/m; 
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        let x = (i+0.5)*dx;
        let y = (j+0.5)*dy;
        let a = map(f[j + i*1024],0,300,0,255);
        bg3.fill(a);
        bg3.rect(x,y,dx,dy); 
      }
    }
  }


function base_pattern(x,y,w,h,canvas,nV) {
    numHorizontalPatches = map(h,bg1.height/30,bg1.height,3,18);
    patchSizes = []
    if (nV < 1.1) {
      nV = 0;
    }
    if (layer2) {
      numHorizontalPatches = nV;
      nV = 0;
      numLP = 2;
    }

    for (let j = 0; j < numHorizontalPatches; j ++) {
      let horizontalPatch = {
        x: x,
        y: (h/numHorizontalPatches)*j + y,      
        w: w,
        h: (h/numHorizontalPatches),
      }
      if ((numLP != 0 || shuffleBool)) {
        patchSizes.push(horizontalPatch); 
      }
    }

    for (let j = 0; j < nV; j ++) {
      let verticalPatch = {
        x: (w/nV)*j,
        y: y,
        w: (w/nV),
        h: h,
      }
      if (!(shuffleBool && numLP == 0) || HorVer_var > 0.2) {
        patchSizes.push(verticalPatch);
      }
    }

    if (!(shuffleBool && numLP == 0) || HorVer_var < 0.35) {
      shuffleArray(patchSizes);
    } 

    let numLayersPatch = 1;
    if (numLP == 0) {
      numLayersPatch = 4;
    } else if (numLP == 1) {
      numLayersPatch = floor(random(1,2.5))
    }

    let patches = []; 
    for (let j = 0; j < patchSizes.length; j++) {
        numRowsPatch = 5 + floor(random(10));
        if (patchSizes[j].w == width || numLP == 0) {
          numRowsPatch = 1 + floor(random(3));
        }
      for (let i = 0; i < numLayersPatch; i++) {
        let stringThickness = 1 - 0.25*i;
        if (sT_var == 0) {
          stringThickness = 1;
        } else if (sT_var == 1 && random() < 0.5) {
          tringThickness = 1;
        }

        let patch = new Patch(
          patchSizes[j].x,patchSizes[j].y,patchSizes[j].w,patchSizes[j].h,
          numRowsPatch, stringThickness, canvas);  
        patches.push(patch);
      }
    }

    for (let p of patches) {
      p.display();
    }


  }
  
  class Patch {
    constructor(x_pos, y_pos, w_, h_, rows, stringThickness, canvas) {
      this.grid = [];
      this.canvas = canvas;

      this.x_pos = x_pos;
      this.y_pos = y_pos;
      this.w = w_;
      this.h = h_;
      this.sw = stringThickness;

      this.columns = 1;
      this.rows = rows;

      this.dx = this.w/this.columns;
      this.dy = this.h/this.rows;
   
      for (let i = 0; i < this.rows; i++) {
        let band = {
          x: this.x_pos,
          y: this.y_pos + i*this.dy + this.dy/2,
          C : random(TWO_PI),
          B : 1,
          dir : 1,
        };
        this.grid.push(band);    
      }
      for (let i = 0; i < this.columns; i++) {
        let band = {
          x: this.x_pos + i*this.dx + this.dx/2,
          y: this.y_pos,
          C : random(TWO_PI),
          B : 1,
          dir : 0,
        };
        this.grid.push(band);
      }
  
      if (!(shuffleBool && numLP == 0)) {
        shuffleArray(this.grid);
      } 
      
    }
  
    display() {
      for (let j = 0; j < this.grid.length; j++) {
        let g = this.grid[j];
        this.canvas.noStroke();
        let c = colorPick(palette.colors, palette.probability);
        let c2 = colorPick(palette.colors, palette.probability);
        this.canvas.push() 
        this.canvas.translate(-this.canvas.width/2,-this.canvas.height/2);
        if (g.dir > 0.5) {
            this.canvas.fill(c);
            let x = g.x + this.dx*0.5;
            let y = g.y + this.dy*0.5;
            let w = this.w*this.sw;
            let h = this.sw*this.dy;
            if (gradients && h > this.canvas.width/10) {
              for (let i = 0; i < 20; i++) {
                let dy = h/20; 
                let y_pos = dy*i
                let fc = lerpColor(color(c),color(c2),i/20);
                this.canvas.fill(fc);
                this.canvas.rect(x,y + y_pos,w,dy);
              }
            } else {
              this.canvas.rect(x,y,w,h);
            }
        } else {
            this.canvas.fill(colorPick(palette.colors, palette.probability));
            this.canvas.beginShape(); 
            this.canvas.vertex(g.x - (this.sw*this.dx)/2,g.y);
            this.canvas.vertex(g.x - (this.sw*this.dx)/2,g.y + this.h);
            this.canvas.vertex(g.x + (this.sw*this.dx)/2,g.y + this.h);
            this.canvas.vertex(g.x + (this.sw*this.dx)/2,g.y);
            this.canvas.endShape(CLOSE);
        }
        this.canvas.pop();
      }
    }
  }
  
  function shuffleArray(array) {
    var m = array.length, t, i;
    while (m) {
      i = floor(random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  function colorPick(t, i) {
    let h = random();
    let r = 0;
    let sum_i = sumArray(i);
    for (let e = 0; e < t.length - 1; e++) {
        let s = t[e];
        if (h < (r += i[e]/sum_i))
            return s
    }
    return t[t.length - 1]
  }
  
  function sumArray(array) {
    let sum = 0;
    array.forEach(item => {
      sum += item;
    });
    return sum;
  }