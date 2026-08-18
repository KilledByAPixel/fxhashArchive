var watercolors = [];
function createWatercolorTexture(){
  for (let i = 0; i < 1000; i++){
    watercolors[i] = new Watercolor();
  }
  for (let w of watercolors){
    w.display();
  }
}
