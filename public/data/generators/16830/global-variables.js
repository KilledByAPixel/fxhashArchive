let live = true
let howManyTerrains;
let texture;

let colorVariables = []

let skyBase = [];
let terrainBase = [];
let terrainBaseCapucha = [];
let celestialObjectsBase = [];
let grid;

let gridPosX = [200, 600, 1000, 1400, 1800];
let gridPosY = [];
let gridDunePosX = []
let sunAngle = 0
let orbitRadio = 0

let terrainCeiling = 0
let terrainSteps = 0
let terrainIsDone = false;
let skyIsDone = false;

let colorScheme
let terrainQty
let bgTextureType
let bgTextureFeatName

// let bgTextureChooser
let bgLinesDiagonalPencilL = false
let bgLinesDiagonalPencilR = false
let bgLinesDiagonal = false
let bgLinesVertical = false
let bgLinesCrossDiagonal = false
let bgNone = false

let celestialObjectType
let cOFireBurstTypeA
let cOFireBurstTypeB
let cOEclipse
let cOFlare
let cOVoid
let celestialObjectFeatName
let celestialObjectIsDone = false;

let terrainType
let terrainAccentStatus = false
let terrainDrippingStatus = false
let terrainDrippingType = false
let frameStatus = false


let terrainMode1 = false
let terrainMode2 = false
let terrainMode3 = false
let terrainModeFeatName

let frameProportions

let colorBack
let colorBack01
let colorBack02
let colorBack03
let colorBack04
let colorBackAccent

let colorFront
let colorFront01
let colorFront02
let colorFront04
let colorFront05
let colorFrontAccent
let colorDark = false

let gridDunePosXX