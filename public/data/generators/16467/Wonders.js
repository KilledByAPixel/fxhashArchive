function createWonder(i, x, y) {


  let loc = createVector(x, y, 0);

  wonders[i]= new Wonder(loc, i);
}

class Wonder {
  constructor(_loc, _id) {
    this.loc = _loc;
    this.org = this.loc;
    this.old = createVector(0, 0, 0);
    this.vel = createVector(0, 0, 0);
    this.life = 1;
    this.id = _id;
  }
  run() {

    this.update();
  }

  reset() {
    this.life = 1;
    this.loc = createVector(this.org.x, this.org.y, this.org.z);
    this.vel = createVector(0, 0, 0);
  }


  update() {
    this.life = this.life - 0.00291 ;

    let start = 1;
    let end = 0.74;
    if (this.life > end && noise(this.life*100, this.id) > 0.0 && this.life < start)
    {


      paintImage.noLights();

      let nx = (this.loc.x * wWidth * prop) * wonderNoiseSize;
      let ny = (this.loc.y * wHeight) * wonderNoiseSize;

      nx = (this.loc.x * prop) * wonderNoiseSize * 1000;
      ny = (this.loc.y ) * wonderNoiseSize * 1000;

      let velStep =  0.02; ///(0.004)

      this.vel.x = this.vel.x + (noise(nx + this.life*0.2, ny + this.life*1.5)-0.5) * velStep;
      this.vel.y = this.vel.y + (noise(nx + this.life*0.2+122, ny + this.life*1.5+122)-0.5) * velStep;

      this.vel.mult(0.3);
      this.loc.add(this.vel);

      let l = noise(this.id+this.life) * 0.4;
      let tempC = colors[4];

      if (isMonochrome == "Yes") tempC = BWcolor;
      
      let mult = 0.01;
      let s = noise(this.id * this.life * 0.1) * (this.life-end) * wWidth * 0.02 * prop ;
      if (s<0) s = 0;

      paintImage.fill(red(tempC)*l, green(tempC)*l, blue(tempC)*l);

      if (this.life < end + 0.13)
      {
        l = 0.75;
        paintImage.fill(red(bgCol)*l, green(bgCol)*l, blue(bgCol)*l);
        if (isMonochrome == "Yes") paintImage.fill(red(BWcolor)*l, green(BWcolor)*l, blue(BWcolor)*l);
        s *= 1.5;
      
      }

        paintImage.push();
 
        paintImage.translate(this.loc.x*prop*wWidth, this.loc.y*wHeight, 0);

        paintImage.sphere(s*2.5, 3, 3);

        paintImage.pop();
  

    }
  }
}
