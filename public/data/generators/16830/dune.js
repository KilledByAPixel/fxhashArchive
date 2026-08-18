
;
class Dune {
  constructor(
    terrainInitTopHorizontal, 
    terrainInitTopVertical, 
    bezierControlTop, 
    bezierControlBottom,
    cx3Mod,
    pathNoise,
    cx1,
    cx3,
    cy3,
    cy1,
    cx2,
    cy2,
    cx4,
    cy4,
    ) {
    this.lx1 = 0;
    this.ly1 = 0;
    this.lx2 = 0;
    this.ly2 = 0;
    this.lx3 = 0;
    this.ly3 = 0;
    
    this.rx1 = 0;
    this.ry1 = 0;
    this.rx2 = 0;
    this.ry2 = 0;
    this.rx3 = 0;
    this.ry3 = 0;
    this.inc = 0;
    this.up = true;
    this.widthSegments;
    this.heightSegments;

    //altura duna
    this.terrainInitTopHorizontal = terrainInitTopHorizontal
    this.terrainInitTopVertical = terrainInitTopVertical

    // ruido 
    this.noiseScale=0.02;
    this.pathNoise = pathNoise

    // bezier modificators
    this.bezierControlTop = bezierControlTop
    this.bezierControlBottom = bezierControlBottom,
    this.cx3Mod = cx3Mod
    this.cx1 = cx1
    this.cy1 = cy1
    this.cx2 = cx2
    this.cy2 = cy2
    this.cx3 = cx3
    this.cy3 = cy3
    this.cx4 = cx4
    this.cy4 = cy4

    this.timesCounter = 0
    this.celestialObjPosition = random(width)
  }

  mountainGenerator() {
    this.axis = {
      lx1: this.lx1,
      ly1: this.ly1,
      lx2: this.lx2,
      ly2: this.ly2,
      lx3: this.lx3,
      ly3: this.ly3,

      rx1: this.rx1,
      ry1: this.ry1,
      rx2: this.rx2,
      ry2: this.ry2,
      rx3: this.rx3,
      ry3: this.ry3,
    };

    this.duneHeights = {
      h1: 0.5,
      h2: 0.6,
      h3: 0.7,
      h4: 0.8,
      h5: 0.9,
    }

    this.widthSegmentation = ()=> {
      
      // Init
      this.widthSegments = 
        this.terrainInitTopHorizontal 
      this.heightSegments = 
        this.terrainInitTopVertical
        // + random([-100, 0, 100, 200])
      
      // Left (centro duna)
      this.axis.lx3 = 
        this.widthSegments * 0.5
        + map(seedSlice3, 100, 999, 100, 200)
      this.axis.ly3 = 
        this.heightSegments 
      
      this.axis.lx1Init =
      map(seedSlice3, 100, 999, -400, -200)

      
      this.axis.lx1 =
      map(seedSlice3, 100, 999, 200, 300)

      
      this.axis.ly1 = 
        map(seedSlice2, 0, 99, -10, 99)
        + this.axis.ly3
        * map(seedSlice1, 0, 9, 1, 1.5)
        
      this.axis.ly1Init = 
        this.axis.ly1 
        * 1.1
        // * map(seedSlice1, 0, 9, 0.7, 0.8)
        // * map(seedSlice1, 0, 9, 1, 1.1)
      // console.log(this.axis.ly1Init)
      // this.axis.lx2 = -400+this.widthSegments * 0.4
      this.axis.lx2 = 
        this.widthSegments/2 
        + map(seedSlice1, 0, 9, -300, -150)
      this.axis.ly2 = 
        this.axis.ly1 
        * map(seedSlice1, 0, 9, 0.8, 1)
        // + map(seedSlice2, 0, 99, -99, 99)
        // * map(seedSlice1, 0, 9, 0.8, 1)

      // Right
      this.axis.rx3 = 
        map(seedSlice3, 100, 999, -400, 200)
        + this.widthSegments 
        + 500
      this.axis.ry3 = 
        this.axis.ly3 
        + map(seedSlice2, 0, 99, 600, 900)
      
      this.axis.rx1 = 
        // map(seedSlice3, 100, 999, -10, 100)
        ((this.axis.lx3 + this.axis.rx3)/2.9)
        + 0
      
      this.axis.ry1 = 
        this.axis.ry3 
        * 0.95
      
      this.axis.rx2 = 
      map(seedSlice3, 100, 999, -100, 100)
        + ((this.axis.lx3 + this.axis.rx3)/2)
        // this.axis.rx3 * 0.9
        // + map(seedSlice3, 100, 999, 50, 100)
      this.axis.ry2 = 
        this.axis.ry3
        + map(seedSlice3, 100, 999, 150, 200)

      // column

      this.axis.cx4 = 
        this.widthSegments

      this.axis.cy4 = 
        this.heightSegments

      this.axis.cx3 = 
        this.axis.cx4
        + this.cx3
        
      this.axis.cy3 = 
        height
        + this.cy3
      

      this.axis.cx1 = 
       this.axis.cx3 
       + map(seedSlice3, 100, 999, 0, 500)

      this.axis.cy1 = 
        this.axis.cy3
        + map(seedSlice3, 100, 999, -100, -500)
        
      
      this.axis.cx2 = 
        this.axis.lx2
        + map(seedSlice2, 0, 99, -99, 99)
      
      this.axis.cy2 = 
      + this.axis.cy4
      + this.cy2

      

      // this.axis.cx3 = 0
      // this.axis.cy3 = this.axis.ry3*1.2

      // this.axis.cx1 = this.axis.lx3 * 2
      // this.axis.cy1 = this.axis.ry3*1.1

      // this.axis.cx2 = this.axis.lx3*0.1
      // this.axis.cy2 = this.axis.ly3  * 1.1

      // this.axis.cx4 = this.axis.lx3
      // this.axis.cy4 = this.heightSegments
      
    }
    this.widthSegmentation()

    // strokeWeight(0)
    // fill('rgba(64, 51, 43, 1)')

    // CONTROLES BEZIER
    strokeWeight(3)
    // // 1️⃣
    fill('#E4C8A0')
    // line(
    //   this.axis.lx1Init, 
    //   this.axis.ly1Init,
    //   this.axis.lx1, 
    //   this.axis.ly1, 
    // )
    // circle(
    //   this.axis.lx1,
    //   this.axis.ly1,
    //   50
    // )
    fill('black')
    textSize(32)
    // text('1', -10+this.axis.lx1,
    // 10+this.axis.ly1,)

    // // 2️⃣
    // fill('#E4C8A0')
    // line(
    //   this.axis.lx2,
    //   this.axis.ly2,
    //   this.axis.lx3,
    //   this.axis.ly3,
    // )
    // textSize(32)
    // circle(
    //   this.axis.lx2,
    //   this.axis.ly2,
    //   50 
    // )
    // fill('black')
    // text('2', -10+this.axis.lx2,
    // 10+this.axis.ly2,)
    
    // // 3️⃣
    // fill('#E4C8A0')
    // line(this.axis.rx1,
    //   this.axis.ry1,
    //   this.axis.rx3,
    //   this.axis.ry3)
    // circle(
    //   this.axis.rx1,
    //   this.axis.ry1,
    //   50 
    // )
    // fill('black')
    // text('3', -10+this.axis.rx1,
    // 10+this.axis.ry1)
    
    // // 4️⃣
    // fill('#E4C8A0')
    // line(
    //   this.axis.lx3,
    //   this.axis.ly3,

    //   this.axis.rx2,
    //   this.axis.ry2
    // )
    
    // circle(
    //   this.axis.rx2,
    //   this.axis.ry2,
    //   50 
    //   )
    // fill('black')
    // text('4', -10+this.axis.rx2,
    // 10+this.axis.ry2)

    // 5️⃣
    fill('#E4C8A0')
    line(
      this.axis.cx4,
      this.axis.cy4,

      this.axis.cx2,
      this.axis.cy2
    )
    circle(
      this.axis.cx2,
      this.axis.cy2,
      50 
      )
    fill('black')
    text(
      '5', 
      -10 + this.axis.cx2,
       10 + this.axis.cy2,
    )

    // 6️⃣
    fill('#E4C8A0')
    line(
      this.axis.cx3,
      this.axis.cy3,

      this.axis.cx1,
      this.axis.cy1
    )
    circle(
      this.axis.cx1,
      this.axis.cy1,
      50 
    )
    fill('black')
    text(
      '6', 
      -10 + this.axis.cx1,
       10 + this.axis.cy1,
    )
    // END CONTROLES BEZIER


    // circle( 
    //   this.axis.lx3,
    //   this.axis.ly3,
    //   50 
    // )

    noFill()
    // strokeWeight(5)
    
    // bezier(
    //   0, 
    //   this.axis.ly1,
    //   this.axis.lx1, 
    //   this.axis.ly1, 
    //   this.axis.lx2, 
    //   this.axis.ly2, 
    //   this.axis.lx3, 
    //   this.axis.ly3
    // )
    // bezier(
    //   this.axis.lx3, 
    //   this.axis.ly3,
    //   this.axis.rx1, 
    //   this.axis.ry1, 
    //   this.axis.rx2, 
    //   this.axis.ry2, 
    //   this.axis.rx3, 
    //   this.axis.ry3 
    // )
    // stroke('red')
    // bezier(
    //   this.axis.cx3, 
    //   this.axis.cy3,
      
    //   this.axis.cx1, 
    //   this.axis.cy1,

    //   this.axis.cx2, 
    //   this.axis.cy2, 
      
    //   this.axis.cx4,
    //   this.axis.cy4,
    // )
  
    
    
    
    // this.steps = 600
    this.steps = map(seedSlice3, 100, 999, 300, 600) * (this.inc*0.1)
    

    // let this.steps = map(noise(this.inc), 0,1,1,30);
    for (this.i = 0; this.i <= this.steps; this.i++) {
      // let t = i*random(random(random())) * this.steps;
      this.t = this.i / this.steps;
      // let t = i / this.steps*map(noise(this.inc),0,1,0.1,8);
      
      this.lx = bezierPoint(
        this.axis.lx1Init+this.inc*random(-1,random(random(random(3)))), 
        this.axis.lx1*map(this.noiseVal, 0, 1, 1.1, 2)*map(this.noiseVal, 0, 1, 0.5, 1.01), 
        this.axis.lx2*map(this.noiseVal, 0, 1, 1.1, 2)*map(this.noiseVal, 0, 1, 0.5, 1.01), 
        this.axis.lx3+this.inc*random(-1,random(random(random(3)))), 
        this.t);
        
      this.ly = bezierPoint(
        this.axis.ly1Init+this.inc*10*random(random(random(random(map(noise(this.inc),0,1,5,10))))), 
        this.axis.ly1+this.inc*10*map(this.noiseVal, 0, 1, 1.1, 2)*map(this.noiseVal, 0, 1, 0.5, 1.01), 
        this.axis.ly2+this.inc*10*map(this.noiseVal, 0, 1, 1.1, 2)*map(this.noiseVal, 0, 1, 0.5, 1.01), 
        this.axis.ly3+this.inc*10*random(random(random(random(map(noise(this.inc),0,1,5,10))))), 
        this.t);
      
      this.rx = bezierPoint(
        this.axis.lx3, 
        this.axis.rx1+this.inc*randomGaussian(), 
        this.axis.rx2+this.inc*randomGaussian(), 
        this.axis.rx3, 
        this.t);
      this.ry = bezierPoint(
        this.axis.ly3+this.inc*10*random(random(random(random(map(noise(this.inc),0,1,5,10))))), 
        this.axis.ry1+this.inc*10*map(this.noiseVal, 0, 1, 1.1, 2)*map(this.noiseVal, 0, 1, 0.5, 1.01), 
        this.axis.ry2+this.inc*10*map(this.noiseVal, 0, 1, 1.1, 2)*map(this.noiseVal, 0, 1, 0.5, 1.01), 
        this.axis.ry3+this.inc*10*random(random(random(random(map(noise(this.inc),0,1,5,10))))), 
        this.t);
       
        // stroke('red')
        this.noiseVal = noise((this.inc*4+this.rx)*this.noiseScale, this.rx*this.noiseScale);
  
        this.mxX = bezierPoint(
          this.axis.cx3+this.noiseVal, 
          this.axis.cx1*this.noiseVal, 
          this.axis.cx2*this.noiseVal, 
          this.axis.cx4+this.noiseVal, 
          this.t);

        this.mx = bezierPoint(
          this.axis.cx3+this.noiseVal*map(this.noiseVal, 0, 1, 1.1, 2)*map(this.noiseVal, 0, 1, 0.5, 1.01), 
          this.axis.cx1*this.pathNoise*this.noiseVal, 
          this.axis.cx2*this.pathNoise*this.noiseVal, 
          this.axis.cx4+this.noiseVal*map(this.noiseVal, 0, 1, 1.1, 2)*map(this.noiseVal, 0, 1, 0.5, 1.01), 
          this.t);
  
        this.my = bezierPoint(
          this.axis.cy3+this.noiseVal, 
          this.axis.cy1+this.noiseVal*map(this.noiseVal, 0, 1, 1.1, 2)*map(this.noiseVal, 0, 1, 0.5, 1.01), 
          this.axis.cy2+this.noiseVal*map(this.noiseVal, 0, 1, 1.1, 2)*map(this.noiseVal, 0, 1, 0.5, 1.01), 
          this.axis.cy4+this.noiseVal+this.inc, 
          this.t);


          this.tmx = bezierTangent(
            this.axis.cx3+this.noiseVal*randomGaussian(randomGaussian()), 
            this.axis.cx1+this.noiseVal*randomGaussian(randomGaussian()), 
            this.axis.cx2+this.noiseVal*randomGaussian(randomGaussian()), 
            this.axis.cx4+this.noiseVal*randomGaussian(randomGaussian()), 
            this.t);
    
          this.tmy = bezierTangent(
            this.axis.cy3+this.noiseVal, 
            this.axis.cy1+this.noiseVal, 
            this.axis.cy2+this.noiseVal, 
            this.axis.cy4+this.noiseVal, 
            this.t);

      let a = atan2(this.tmy, this.tmx);
      a += PI;
      
      if(this.timesCounter < 600) {
        stroke('rgba(64, 51, 43, 0.5)')
        strokeWeight(map(noise(this.inc),0,1,0.1,1))
        // point(this.lx, this.ly);
        // point(this.rx, this.ry);


        // MEDIO
        

        
      strokeWeight(random(2, 5))
      stroke('rgba(228, 200, 160, 0.3)')
      point(
        this.mx-this.inc*this.noiseVal*this.inc, 
        this.my);
      stroke('rgba(64, 51, 43, 0.2)')
      // stroke('blue')
      point(
        this.mx+this.inc*this.noiseVal*this.inc, 
        this.my+this.inc*8*this.noiseVal+map(this.noiseVal, 0,1,3,this.inc*9)
      );


        

      strokeWeight(random(0.5, 1))
      point(
        this.mx+this.inc*this.noiseVal*this.inc, 
        this.my+this.inc*8*this.noiseVal+map(this.noiseVal, 0,1,3,this.inc*9)
      );
      strokeWeight(random(2, 7))
      point(
        this.mx-this.inc*this.noiseVal*this.inc + cos(a) * 8, 
        this.my+this.inc*16*this.noiseVal+map(this.noiseVal, 0,1,3,this.inc*9)
      );

      
      

      // LUCES
      // stroke('rgba(64, 51, 43, 0.2)')
      // strokeWeight(random(1, 5))
      // point(
      //   this.lx-map(noise(this.inc), 0,1,3,this.inc)*this.noiseVal, 
      //   this.ly+this.inc*8*this.noiseVal+map(this.noiseVal, 0,1,3,10)
      // );
      // point(
      //   this.rx+map(noise(this.inc), 0,1,3,this.inc)*this.noiseVal, 
      //   this.ry+this.inc*8*this.noiseVal+map(this.noiseVal, 0,1,3,10));

      





        // if(this.timesCounter < 20) {
        //   strokeWeight(random(1, 5))
        //   stroke('rgba(64, 51, 43, 0.1)')
        //   // stroke('red')
        //   point(
        //     this.lx+random(random(random(random(map(noise(this.inc),0,1,-100,100))))), 
        //     this.ly+random(random(random(random(map(noise(this.inc),0,1,-500,100))))));
        //   point(
        //     this.rx+random(random(random(random(map(noise(this.inc),0,1,-100,100))))), 
        //     this.ry+random(random(random(random(map(noise(this.inc),0,1,-500,100))))));
        // }
      }

      this.timesCounter += 0.001  
    }
  

    // if(frameCount<30) {
    //   this.ceiling = 40*this.noise

    //  } else {
    // }
    this.ceiling = 35
      // this.ceiling = 30*map(this.noiseVal, 0, 1, 1.1, 2)*map(this.noiseVal, 0, 1, 0.5, 1.01);
      if (this.up && this.inc <= this.ceiling) {
        this.inc += 0.05 * map(noise(this.inc*5), 0, 1, 0.1, map(noise(this.inc), 0, 1, 3, 10));
        if (this.inc === this.ceiling) {
          this.up = false;
        }
      } else {
        // this.inc = 10
        this.up = false;
        this.inc -= 0.05 * map(noise(this.inc*5), 0, 1, 0.1, map(noise(this.inc), 0, 1, 3, 10));
        if (this.inc <= 0) {
          this.up = true;
        }
      }
    //   this.ceiling = 40*map(this.noiseVal, 0, 1, 1.1, 2)*map(this.noiseVal, 0, 1, 0.5, 1.01);
    // } else {
    // }
    // console.log(this.inc);
  }

}