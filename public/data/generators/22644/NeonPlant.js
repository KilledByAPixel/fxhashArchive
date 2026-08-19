class NeonPlant {
  constructor(canvas, pos, givenSprites, numberOfSprites, baseLength , gapUnits = 20, varyingScale = false,ringCount,ringColor) {
    this.canvas = canvas
    this.pos = pos;
    this.baseLengthUnits = baseLength;
    this.numberOfSprites = numberOfSprites;
    this.givenSprites = givenSprites;
    this.sprites = [];
    this.scaleArray = [];
    this.flowerPoints = []
    this.gapUnits = gapUnits;
    this.numSprites = this.sprites.length;
    this.animators = [];
    this.speed = 66;
    this.scale = varyingScale;
    this.ringCount = ringCount;
    this.ringColor = ringColor;
    this.baseLength = this.baseLengthUnits*width/1000;
    this.gap = this.gapUnits*width/1000;
  }

  update(){
    this.baseLength = this.baseLengthUnits*width/1000;
    this.gap = this.gapUnits*width/1000;
  }
  

  initPlant() {
    for (let i = 0; i < this.numberOfSprites; i++) {
    let spriteIndex = Math.floor(random(0, this.givenSprites.length))
      this.sprites.push(this.givenSprites[spriteIndex])

      if (typeof (this.scale) === 'object') {
        this.scaleArray.push(random(this.scale.min, this.scale.max));
      } else if (typeof (this.scale === 'number')) {
        this.scaleArray.push(this.scale)
      }
    }

    let firstPoint = createVector(this.pos.x, this.pos.y - this.baseLength);
    let firstAnimator = new SpriteAnimator(this.canvas, this.sprites[0], firstPoint, this.speed, this.scaleArray[0]);
    this.animators.push(firstAnimator);
    let currentAnimator = firstAnimator;
    for (let i = 1; i < this.sprites.length; i++) {
      let animator = new SpriteAnimator(this.canvas, this.sprites[i], createVector(currentAnimator.spTop.x, currentAnimator.spTop.y - this.gap), this.speed, this.scaleArray[i])
      this.animators.push(animator);
      currentAnimator = animator;
    }
    
  }


  initSymmetric() {

    for (let i = 0; i < this.numberOfSprites; i++) {
      this.sprites.push(this.givenSprites[i])

      if (typeof (this.scale) === 'object') {
        this.scaleArray.push(random(this.scale.min, this.scale.max));
      } else if (typeof (this.scale === 'number')) {
        this.scaleArray.push(this.scale)
      }
    }

    let firstPoint = createVector(this.pos.x, this.pos.y - this.baseLength);
    let firstAnimator = new SpriteAnimator(this.canvas, this.sprites[0], firstPoint, this.speed, this.scaleArray[0]);
    this.animators.push(firstAnimator);
    let currentAnimator = firstAnimator;
    for (let i = 1; i < this.sprites.length; i++) {
      let animator = new SpriteAnimator(this.canvas, this.sprites[i], createVector(currentAnimator.spTop.x, currentAnimator.spTop.y - this.gap), this.speed, this.scaleArray[i])
      this.animators.push(animator);
      currentAnimator = animator;
    }
    
  }


  getSumofSpriteHeights() {
    let sum = 0;
    for (let i = 0; i < this.scaleArray.length; i++) {
      sum += 200 * this.scaleArray[i] * width / 1000
    }
    return sum;
  }



  display() {

    this.animators.forEach(animator => {
      animator.display();
    })
    this.canvas.strokeWeight(1.5 * width / 1000);
    this.canvas.stroke(this.ringColor)
   
   for(let i =1;i<this.ringCount;i++){
    this.canvas.ellipse(this.pos.x, this.pos.y, 3 * i * width / 100, 14 * i * width / 1000)
   }

    this.canvas.line(this.pos.x, this.pos.y, this.animators[this.animators.length - 1].spBottom.x, this.animators[this.animators.length - 1].spPos.y)

    for (let i = 0; i < this.scaleArray.length; i++) {
      this.canvas.noFill();
    }
  }

}