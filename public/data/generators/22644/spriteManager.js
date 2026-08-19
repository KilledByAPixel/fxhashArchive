
class SpriteImporter {
    constructor(spriteSheets, spriteWidth, spriteHeight, offsets) {
        this.spriteSheets = spriteSheets;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.spriteGroups = [];
        this.offsets = offsets;

    }

    loadSprites() {
        let sprites = [];
        this.spriteSheets.forEach((spriteSheet,index) => {
            let sheetWidth = spriteSheet.width;
            let sheetHeight = spriteSheet.height;
            let numSpritesCol = sheetWidth / this.spriteWidth;
            let numSpritesRow = sheetHeight / this.spriteHeight
            
            sprites = [];
                for (let y = 0; y < numSpritesRow; y++) {
                    for (let x = 0; x < numSpritesCol; x++) {
                    let sprite = spriteSheet.get(x * this.spriteWidth, y * this.spriteHeight, this.spriteWidth, this.spriteHeight);
                    sprites.push(sprite)
                   

                }
            }
            this.spriteGroups.push(sprites)
        })
        
    }

    getSprite(index) {
        return { array: this.spriteGroups[index], offset: this.offsets[index] }
    }
    getAllSprites(){
        let arr = [];
        this.spriteGroups.forEach((e,i)=>{
            arr.push({array:e,offset:this.offsets[i]})
        })

    return arr
    }
}


class SpriteAnimator {
    constructor(canvas, spriteObj, position, speed, scale) { // constructor(spriteArray,offset,position,speed,scale){
      
        this.canvas = canvas;
        this.spriteArray = spriteObj.array;
        this.offset = spriteObj.offset;
        this.pos = position;
        this.speed = speed;
        this.scale = scale;
        this.numFrames = this.spriteArray.length;
        this.currentFrame = 0;
        this.previousDisplayTime = 0;
        this.spPos = createVector(this.pos.x , this.pos.y  + this.offset * width / 1000 * this.scale+(100*width/1000-100*this.scale*width/1000));
        this.spTop = createVector(this.pos.x,this.pos.y-((200-2*this.offset))*width/1000*this.scale);
        this.spBottom  = createVector(this.spPos.x,this.spPos.y+((100-this.offset))*width/1000*this.scale);
        this.debugMode = false;
        
    }

    display() {
        
        // if(pos !== undefined){
        //     this.pos = pos;
        // }
        // if(scale !== undefined){
        //     this.pos = pos;
        // }

        // if (millis() > this.previousDisplayTime + this.speed) {
        //     this.currentFrame++;
        //     if (this.currentFrame > this.numFrames-1 ) {
        //         this.currentFrame = 0;
        //     }
        //     this.previousDisplayTime = millis();
        // }
//let sprite = this.spriteArray[this.currentFrame];
        let index = frameCount%this.spriteArray.length
        let sprite = this.spriteArray[index];
        this.canvas.image(sprite, this.spPos.x, this.spPos.y, 200 * this.scale * width / 1000, 200 * this.scale * width / 1000);
        

       if(this.debugMode) this.canvas.rect(this.spPos.x,this.spPos.y,200*width/1000*this.scale,200*width/1000*this.scale)
        
    }
}


function loadFrames(destination, filename, fileCount) {
    let seq = [];
    for (let i = 0; i < fileCount; i++) {
      let gImg = loadImage(destination + filename + i + ".png")
  
      seq.push(gImg)
    }
    return seq;
  }
  