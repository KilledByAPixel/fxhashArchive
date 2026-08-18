console.log(fxhash);
const seed = ~~(fxrand() * 1e9);
// console.log(seed);

let seedSlice1 = Number(seed.toString().slice(-1));
let seedSlice2 = Number(seed.toString().slice(-2));
let seedSlice3 = Number(seed.toString().slice(-3));
let seedSlice4 = Number(seed.toString().slice(-4));

let seedColors = Number(seed.toString().slice(-3));

let seedSlice3Pos = Number(seed.toString().slice(0, 3));
let seedSlice2Pos = Number(seed.toString().slice(3, 5));
let seedSlice4Pos = Number(seed.toString().slice(4, 7));


const chooser = function () {
  colorScheme = int(abs(random(1, 100)));
  if (colorScheme <= 30) {
    colorVariables = [color1];
  }
  if (colorScheme >= 31 && colorScheme <= 45) {
    colorVariables = [color2];
  }
  if (colorScheme >= 46 && colorScheme <= 55) {
    colorVariables = [color3];
  }
  if (colorScheme >= 56 && colorScheme <= 60) {
    colorVariables = [color4];
  }
  if (colorScheme >= 61 && colorScheme <= 70) {
    colorVariables = [color5];
    colorDark = true;
  }
  if (colorScheme >= 71 && colorScheme <= 100) {
    colorVariables = [color6];
  }

  // terrain qty
  let terrainQtyChooser = int(abs(random(1, 100)));
  if (terrainQtyChooser <= 10) {
    terrainQty = 1;
  }
  if (terrainQtyChooser >= 11 && terrainQtyChooser <= 30) {
    terrainQty = 2;
  }
  if (terrainQtyChooser >= 31 && terrainQtyChooser <= 60) {
    terrainQty = 3;
  }
  if (terrainQtyChooser >= 61 && terrainQtyChooser <= 85) {
    terrainQty = 4;
  }
  if (terrainQtyChooser >= 86 && terrainQtyChooser <= 100) {
    terrainQty = 5;
  }

  // bg texture type

  // let bgTextureChooser = 99;
  let bgTextureChooser = int(abs(random(1, 100)));
  if (bgTextureChooser <= 17) {
    bgLinesDiagonalPencilL = true;
    bgTextureFeatName = "Pencil strokes left";
  }
  if (bgTextureChooser >= 18 && bgTextureChooser <= 35) {
    bgLinesDiagonalPencilR = true;
    bgTextureFeatName = "Pencil strokes right";
  }
  if (bgTextureChooser >= 36 && bgTextureChooser <= 50) {
    bgLinesDiagonal = true;
    bgTextureFeatName = "Pointed lines diagonal";
  }
  if (bgTextureChooser >= 51 && bgTextureChooser <= 65) {
    bgLinesVertical = true;
    bgTextureFeatName = "Pointed lines vertical";
  }
  if (bgTextureChooser >= 66 && bgTextureChooser <= 90) {
    bgLinesCrossDiagonal = true;
    bgTextureFeatName = "Crosshatch";
  }
  if (bgTextureChooser >= 91 && bgTextureChooser <= 100) {
    bgNone = true;
    bgTextureFeatName = "Clean";
  }

  // celestial object

  // let celestialObjectChooser = 88;
  let celestialObjectChooser = int(abs(random(1, 100)));
  if (celestialObjectChooser <= 10) {
    cOFireBurstTypeA = true;
    celestialObjectFeatName = "Fire burst type A";
  }
  if (celestialObjectChooser >= 11 && celestialObjectChooser <= 40) {
    cOFireBurstTypeB = true;
    celestialObjectFeatName = "Fire burst type B";
  }
  if (celestialObjectChooser >= 41 && celestialObjectChooser <= 50) {
    cOEclipse = true;
    celestialObjectFeatName = "Eclipse";
  }
  if (celestialObjectChooser >= 51 && celestialObjectChooser <= 70) {
    cOFlare = true;
    celestialObjectFeatName = "Flare";
  }
  if (celestialObjectChooser >= 71 && celestialObjectChooser <= 100) {
    cOVoid = true;
    celestialObjectFeatName = "Void";
  }

  // frame
  let frameChooser = int(abs(random(1, 100)));
  if(frameChooser <= 20) {
    frameStatus = true
  }

  // terrainAccentChooser
  let terrainAccentChooser = int(abs(random(1, 100)));
  if(terrainAccentChooser <= 10 && terrainQty <= 3) {
    terrainAccentStatus = true
  }

  // dripping chooser
  let drippingChooser = int(abs(random(1, 100)));
  if(drippingChooser <= 10 && !terrainAccentStatus) {
    terrainDrippingStatus = true
    terrainDrippingType = "Rock"
  }
  if(drippingChooser >= 11 && drippingChooser <= 20 && !terrainAccentStatus) {
    terrainDrippingStatus = true
    terrainDrippingType = "Sand"
  }


   // terrainTypeChooser
   let terrainTypeChooser = int(abs(random(1, 100)));
   if(terrainTypeChooser <= 10) {
     terrainMode1 = true
     terrainModeFeatName = "Blasted sand"
   }
   if(terrainTypeChooser >= 11 && terrainTypeChooser <= 50) {
    terrainMode2 = true
    terrainModeFeatName = "Peaceful sand"
  }
  if(terrainTypeChooser >= 51 && terrainTypeChooser <= 100) {
    terrainMode3 = true
    terrainModeFeatName = "Rocky ridges"
  }
 
};
