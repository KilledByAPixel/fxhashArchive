function createSpike(x, y, s, t) {

  h = (1/steps);

  let loc = createVector(x, y, 0);
  var angle = n/leavesNumber * PI * 2;

  tendrils[n]= new Tendril(loc, h, n, angle, s, t);
  n ++;
}

class Tendril {
  constructor(_loc, _h, _id, _angle, _s, _stem) {
    this.loc = _loc;
    this.org = _loc;
    this.angle = _angle;


    this.stemId = _stem;
    this.speed = _h;
    this.life = 1 + 1/steps;
    this.id = _id;

    this.size = _s;
  }
  run() {
    this.update();
  }

  reset() {
    this.life = 1 + 1/steps;
    this.loc = this.org;
  }

  update() {
    this.life = this.life - this.speed*1.5;

    if (this.life > maxGrow)
    {

      let isSpike = false;
      if (noise(this.id*500, this.life*20) > 0.55) isSpike = true;


      let tempCol = color(colors[ this.id % 3]);
      if (isSpike) tempCol = color(colors[3]);

      let q = pow(1-this.life, 2.7)*6;

      let tempRed = red(tempCol)*q + red(bgCol) *(1-q);
      let tempGreen = green(tempCol)*q + green(bgCol) *(1-q);
      let tempBlue = blue(tempCol)*q + blue(bgCol) *(1-q);

      let col = color(tempRed, tempGreen, tempBlue);

      let s = (sin( pow(this.life, 2) * PI ) * this.size * (wWidth * 0.0075)) * prop;
 
      let r = this.life*PI*3.2 + this.angle + noise(this.life*1.2)*PI*1 + noise(this.id*1000+this.life*1)*0.0;


      if (this.life < 0.35)
      {

        s = s * 1.1;
        let tempBloom = color(blooms[ this.stemId % 5 ]);
        let tempBloom2 = color(blooms[ (this.stemId+2) % 5 ]);
        let m = pow( this.life/0.3, 2);
        //m = 1;
        tempRed = red(tempBloom)*m + red(tempBloom2)*(1-m);
        tempGreen = green(tempBloom)*m + green(tempBloom2)*(1-m);
        tempBlue = blue(tempBloom)*m + blue(tempBloom2)*(1-m);


        paintImage.fill(color(tempRed, tempGreen, tempBlue));
      } else
      {

        paintImage.fill(col);
      }


      let w = 0.33 + noise(this.id*1.1, this.life*5 )*0.5 + this.life*0.0;
      w = pow(w, 1.7);

      if (isSpike && this.life > 0.3)
      {
        s = s * 1.6;
 
        w = 0.03;
      }


      let j = currentStep % int(jumps+noise(currentStep+this.stemId*10)*3) ;

      if (this.life < 0.3) j = 0;



      if (j == 0)
      {
        paintImage.push();
        paintImage.translate((this.loc.x*prop)*wWidth, this.loc.y*wHeight, 0);


        paintImage.push();


        paintImage.scale(30);
        if (this.life < 0.3) r = r * noise(time*2) * leavesNumber;
        paintImage.rotateZ(r);
        paintImage.rotateX(PI);
        paintImage.translate(s*1+this.life*0+0, 0, 0);

        if (this.life < 0.3)  paintImage.translate(0, 0, 140 * pow((this.life-0.3)*3.333, 1.83) * masterMult);

        paintImage.push();

        if (!isSpike)
        {
          paintImage.scale(1, w, w);
        } else
        {
          paintImage.scale(1, w, w);
        }

        paintImage.scale(s);

        if (this.life < 0.06)
        {
          paintImage.fill(30);
        }

        let d = int(11*(1-this.life));
        paintImage.sphere(1, d, d  );

        paintImage.pop();
        paintImage.pop();
        paintImage.pop();
      }
    }
  }
}
