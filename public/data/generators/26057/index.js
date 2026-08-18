/* global preloadImagesTmr noise $fx fxhash fxrand fxpreview paper1Loaded page PAPER */

//
//  fxhash - YYYSEED
//
//
//  HELLO!! Code is copyright revdancatt (that's me), so no sneaky using it for your
//  NFT projects.
//  But please feel free to unpick it, and ask me questions. A quick note, this is written
//  as an artist, which is a slightly different (and more storytelling way) of writing
//  code, than if this was an engineering project. I've tried to keep it somewhat readable
//  rather than doing clever shortcuts, that are cool, but harder for people to understand.
//
//  You can find me at...
//  https://twitter.com/revdancatt
//  https://instagram.com/revdancatt
//  https://youtube.com/revdancatt
//

const ratio = 4 / 3
// const startTime = new Date().getTime() // so we can figure out how long since the scene started
let drawn = false
let highRes = false // display high or low res
let drawPaper = true
const features = {}
const nextFrame = null
let resizeTmr = null
let thumbnailTaken = false
const finalLines = []
const dumpOutputs = false

// let's define some tiles tiles
const HORIZONTAL = 0
const VERTICAL = 1
const NE_CURVE = 2
const NW_CURVE = 3
const SE_CURVE = 4
const SW_CURVE = 5
const NE_CORNER = 6
const NW_CORNER = 7
const SE_CORNER = 8
const SW_CORNER = 9
const NE_REFLECT = 10
const NW_REFLECT = 11
const SE_REFLECT = 12
const SW_REFLECT = 13
// const straights = [HORIZONTAL, VERTICAL]
const curves = [NE_CURVE, NW_CURVE, SE_CURVE, SW_CURVE]
const corners = [NE_CORNER, NW_CORNER, SE_CORNER, SW_CORNER]
const reflects = [NE_REFLECT, NW_REFLECT, SE_REFLECT, SW_REFLECT]
const turns = [...curves, ...corners, ...reflects]
// const tiles = [...straights, ...turns]
const palettes = [
  { h: 351, s: 83, l: 49 },
  { h: 20, s: 22, l: 18 },
  { h: 42, s: 95, l: 52 },
  { h: 42, s: 10, l: 40 },
  { h: 26, s: 59, l: 48 },
  { h: 208, s: 61, l: 42 },
  { h: 111, s: 30, l: 28 },
  { h: 150, s: 82, l: 27 },
  { h: 197, s: 80, l: 65 },
  { h: 60, s: 3, l: 10 },
  { h: 207, s: 100, l: 32 },
  { h: 290, s: 36, l: 20 },
  { h: 300, s: 2, l: 16 },
  { h: 345, s: 6, l: 11 },
  { h: 354, s: 30, l: 41 },
  { h: 230, s: 9, l: 12 },
  { h: 20, s: 96, l: 30 },
  { h: 210, s: 50, l: 13 },
  { h: 72, s: 41, l: 24 },
  { h: 139, s: 50, l: 15 },
  { h: 178, s: 90, l: 16 },
  { h: 329, s: 49, l: 50 },
  { h: 171, s: 49, l: 34 },
  { h: 206, s: 16, l: 37 },
  { h: 162, s: 17, l: 38 },
  { h: 96, s: 6, l: 51 },
  { h: 295, s: 70, l: 24 },
  { h: 338, s: 54, l: 16 },
  { h: 330, s: 100, l: 0 },
  { h: 79, s: 29, l: 64 }
]

class SeededRandom {
  constructor (seed) {
    this.m = 0x80000000 // 2**31
    this.a = 1103515245
    this.c = 12345

    this.state = this.hashStringToNumber(seed)
  }

  hashStringToNumber (str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash |= 0 // Convert to 32-bit integer
    }
    return hash
  }

  next () {
    this.state = (this.a * this.state + this.c) % this.m
    return Math.abs(this.state / (this.m - 1))
  }
}

let useSeed = false
let random = null
const getRandom = () => {
  if (useSeed) {
    return random.next()
  }
  return fxrand()
}

const getfxRandom = () => {
  if (useSeed) {
    return random.next()
  }
  const rand = randomNumbers[randomNumbersIndex]
  randomNumbersIndex++
  return rand
}

const shuffleArray = (array) => {
  const arr = array.slice() // Create a copy of the array to avoid modifying the original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(getfxRandom() * (i + 1))
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}

const randomNumbers = []
let randomNumbersIndex = 0

window.$fxhashFeatures = {}

$fx.params([
  {
    id: 'gridSize',
    name: 'Grid Size',
    type: 'select',
    default: 'Random for hash',
    options: {
      options: [
        'Random for hash',
        '3x4',
        '6x8',
        '9x12'
      ]
    }
  }, {
    id: 'layers',
    name: 'Layers',
    type: 'select',
    default: 'Weighted random',
    options: {
      options: [
        'Weighted random',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8'
      ]
    }
  },
  {
    id: 'colourStrategy',
    name: 'Colour Strategy',
    type: 'select',
    default: 'Random for hash',
    options: {
      options: [
        'Random for hash',
        'Single Colour',
        'By Layer',
        'By Line'
      ]
    }
  },
  {
    id: 'numberOfLines',
    name: 'Use suggested lines',
    type: 'boolean',
    default: true
  },
  {
    id: 'forcedLineNumbers',
    name: 'Overide suggested lines',
    type: 'number',
    default: 12,
    options: {
      min: 4,
      max: 60,
      step: 1
    }
  },
  {
    id: 'lengthThreshold',
    name: 'Length Threshold',
    type: 'select',
    default: 'Suggested',
    options: {
      options: [
        'Suggested',
        'Random for hash',
        'Short',
        'Medium',
        'Long'
      ]
    }
  },
  {
    id: 'suggestDestroyer',
    name: 'Use suggested destroyer',
    type: 'boolean',
    default: true
  },
  {
    id: 'destroyLines',
    name: 'Override suggested line destroyer',
    type: 'number',
    default: 0,
    options: {
      min: 0,
      max: 99,
      step: 1
    }
  },
  {
    id: 'lineThickness',
    name: 'Line Thickness',
    type: 'select',
    default: 'Suggested',
    locked: true,
    options: {
      options: [
        'Suggested',
        'Random for hash',
        'Hairline',
        'Thin',
        'Medium',
        'Thick'
      ]
    }
  },
  {
    id: 'dangerSeed',
    name: 'DANGER SEED \'YYY\'',
    type: 'string',
    options: {
      minLength: 4,
      maxLength: 64
    }
  }
])

// We need a function that when passed an array of options and an array of weights
// will return a random option based on the weights
const weightedRandom = (options, weights) => {
  const total = weights.reduce((a, b) => a + b)
  const rand = getRandom() * total
  let weight = 0
  for (let i = 0; i < options.length; i++) {
    weight += weights[i]
    if (rand < weight) {
      return options[i]
    }
  }
}

// Same as above but using fx rand version, so we don't mess with the random counds
const weightedfxRandom = (options, weights) => {
  const total = weights.reduce((a, b) => a + b)
  const rand = randomNumbers[randomNumbersIndex] * total
  randomNumbersIndex++
  if (randomNumbersIndex >= randomNumbers.length) randomNumbersIndex = 0
  let weight = 0
  for (let i = 0; i < options.length; i++) {
    weight += weights[i]
    if (rand < weight) {
      return options[i]
    }
  }
}

//  Work out what all our features are
const makeFeatures = () => {
  // randomNumbersIndex = 0
  // Usage
  const DANGERSEED = $fx.getParam('dangerSeed')
  // If the first three characters are YYY then we will use the seed
  if (DANGERSEED.substring(0, 3) === 'YYY') {
    useSeed = true
    random = new SeededRandom(DANGERSEED)
  }
  for (let i = 0; i < 100220; i++) randomNumbers.push(getRandom())

  // features.background = 1
  features.paperOffset = {
    paper1: {
      x: getRandom(),
      y: getRandom()
    },
    paper2: {
      x: getRandom(),
      y: getRandom()
    }
  }

  // Now we need to define a whole bunch of chances for the different features
  const typeChances = {
    options: ['Straight', 'Turn'],
    weights: [40, 60]
  }

  const featuresObject = {}
  // First we have the number of tiles, which can by [3 by 4], so far just the one choice, and we also have a number of layers
  // for the moment that will be just one as well.
  let gridSize = weightedfxRandom(['3x4', '6x8', '9x12'], [70, 20, 10])
  if ($fx.getParam('gridSize') !== 'Random for hash') gridSize = $fx.getParam('gridSize')
  if (useSeed) gridSize = weightedfxRandom(['3x4', '6x8', '9x12'], [70, 20, 10])
  featuresObject['Grid Size'] = gridSize

  features.tilesAcross = parseInt(gridSize.split('x')[0], 10)
  features.tilesDown = parseInt(gridSize.split('x')[1], 10)
  let layers = weightedfxRandom([1, 2, 3, 4], [25, 40, 25, 10])
  if ($fx.getParam('layers') !== 'Weighted random') layers = parseInt($fx.getParam('layers'), 10)
  if (useSeed) gridSize = layers = weightedfxRandom([1, 2, 3, 4], [25, 55, 15, 5])
  featuresObject.Layers = layers

  // We also want to have a number of lines per tile, and the margin at the edge of the tile
  features.linesPerTile = 28
  if (features.tilesAcross === 6) features.linesPerTile = 18
  if (features.tilesAcross === 9) features.linesPerTile = 12
  // If we are NOT using the suggested lined, then we use the forcedLineNumbers
  if (!$fx.getParam('numberOfLines')) features.linesPerTile = $fx.getParam('forcedLineNumbers')
  if (useSeed) features.linesPerTile = Math.floor(((getRandom() * 56 + 4) + (getRandom() * 56 + 4)) / 2)
  featuresObject['Lines Per Tile'] = features.linesPerTile
  features.tileMargin = 0.1

  const colRandoPick = weightedfxRandom(['Single Colour', 'By Layer', 'By Line'], [10, 25, 65])
  let colourStrategy = colRandoPick
  if ($fx.getParam('colourStrategy') !== 'Random for hash') colourStrategy = $fx.getParam('colourStrategy')
  if (useSeed) colourStrategy = colRandoPick
  featuresObject['Colour Strategy'] = colourStrategy

  if (colourStrategy === 'By Layer') {
  // Colour stuff happens here!!
    features.colourLayersOverLines = true
  }
  if (colourStrategy === 'By Line') {
    features.colourLayersOverLines = false
  }
  if (colourStrategy === 'Single Colour') {
    if (getfxRandom() < 0.2) {
      features.singleColour = { h: 0, s: 0, l: 0 }
    } else {
      // pick a single colour from the palette
      features.singleColour = palettes[Math.floor(getfxRandom() * palettes.length)]
    }
  } else {
    // Now we need to grab the colours we're going to use, first properly shuffle the palettes array
    const shuffledPalettes = shuffleArray(palettes)
    // Now we need to work out how many colours we're using
    let colourCount = 1
    features.colourChord = []
    features.svgLayer = []
    // If we are in colourLayersOverLines mode, then we'll have one colour per layer
    if (features.colourLayersOverLines) {
      colourCount = layers
      features.colours = shuffledPalettes.slice(0, colourCount)
    } else {
      // Otherwise we'll have between 2 and 4 colours
      colourCount = Math.floor(getfxRandom() * 4) + 2
      // Now we need to grab the colours we're going to use
      features.colours = shuffledPalettes.slice(0, colourCount)
      // We want to build up a colour "Chord" , by which I mean, instead of randomly picking colours, we want to
      // sensibly randomly pick colours. We're going to do this by picking two points on a noise field, and then
      // stepping between them based on the number of colours we want to use. Then use the noise value at each
      // to pick a colour from the shuffledPalettes array.
      const resolution = 500
      const start = {
        x: (getfxRandom() * 5000 + 1000) / resolution,
        y: (getfxRandom() * 5000 + 1000) / resolution
      }
      const end = {
        x: (getfxRandom() * 5000 + 1000) / resolution,
        y: (getfxRandom() * 5000 + 1000) / resolution
      }
      for (let i = 0; i < features.linesPerTile; i++) {
        const x = start.x + (end.x - start.x) * (i / features.linesPerTile)
        const y = start.y + (end.y - start.y) * (i / features.linesPerTile)
        let noiseValue = noise.perlin2(x, y)
        // We want to make sure that the noise value is between 0 and 1
        noiseValue = (noiseValue + 1) / 2
        // Now we want to use this to pick a colour from the shuffledPalettes array
        const colourIndex = Math.floor(noiseValue * colourCount)
        features.colourChord.push(shuffledPalettes[colourIndex])
        features.svgLayer.push(colourIndex)
      }
    }
  }

  features.destroyLines = parseInt($fx.getParam('destroyLines'), 10) / 100
  if ($fx.getParam('suggestDestroyer')) {
    features.destroyLines = weightedfxRandom([0, 0.1, 0.25], [70, 20, 10])
  }
  if (useSeed) features.destroyLines = Math.floor(Math.abs((getRandom() * 100 + getRandom() * 100 + getRandom() * 100) - 75)) / 100
  featuresObject['Destroy Lines'] = 'Untouched'
  if (features.destroyLines > 0) featuresObject['Destroy Lines'] = 'Lightly Thinned'
  if (features.destroyLines > 0.2) featuresObject['Destroy Lines'] = 'Balanced Removal'
  if (features.destroyLines > 0.4) featuresObject['Destroy Lines'] = 'Ample Reduction'
  if (features.destroyLines > 0.6) featuresObject['Destroy Lines'] = 'Deep Clearance'
  if (features.destroyLines > 0.8) featuresObject['Destroy Lines'] = 'Near Elimination'

  // We also need to build up an array of which lines we are going to destroy
  // Once again we're going to use a noise field to do this, and then pick two points and step between them
  // to get the values for each line.
  const resolution = 500
  const start = {
    x: (getfxRandom() * 5000 + 1000) / resolution,
    y: (getfxRandom() * 5000 + 1000) / resolution
  }
  const end = {
    x: (getfxRandom() * 5000 + 1000) / resolution,
    y: (getfxRandom() * 5000 + 1000) / resolution
  }
  const destroyLines = []
  for (let i = 0; i < features.linesPerTile; i++) {
    const x = start.x + (end.x - start.x) * (i / features.linesPerTile)
    const y = start.y + (end.y - start.y) * (i / features.linesPerTile)
    let noiseValue = noise.perlin2(x, y)
    // We want to make sure that the noise value is between 0 and 1
    noiseValue = (noiseValue + 1) / 2
    destroyLines.push(noiseValue)
  }
  // Now we want to build up a map of the destroy lines, so we can easily look up if a line is destroyed or not
  features.destroyLinesMap = {}
  for (let i = 0; i < destroyLines.length; i++) {
    features.destroyLinesMap[destroyLines[i]] = i
  }
  // Now I want to sort the destory lines in order
  destroyLines.sort((a, b) => a - b)
  // Now work out how many lines we're going to destroy base on features.destroyLines
  const linesToDestroy = Math.floor(features.linesPerTile * features.destroyLines)
  // Remove than number of lines from the end of the array
  destroyLines.splice(destroyLines.length - linesToDestroy, linesToDestroy)
  // Now create a new array the length of the number of linesPerTile and set all the values to false
  features.showLine = new Array(features.linesPerTile).fill(false)
  // Now loop through the destroyLines array, grabbing the index from the destroyLinesMap and setting the value to true
  for (let i = 0; i < destroyLines.length; i++) {
    features.showLine[features.destroyLinesMap[destroyLines[i]]] = true
  }
  // Check that there is at least one line that is not destroyed
  if (features.showLine.filter((value) => value).length === 0) {
    // If not, then pick a random line and set it to true
    features.showLine[Math.floor(getfxRandom() * features.linesPerTile)] = true
  }
  features.lineThickness = $fx.getParam('lineThickness')
  if (!useSeed) {
    const randoPick = weightedfxRandom(['Hairline', 'Thin', 'Medium', 'Thick'], [10, 60, 20, 10])
    if (features.lineThickness === 'Random for hash') features.lineThickness = randoPick
    if (features.lineThickness === 'Suggested') features.lineThickness = 'Thin'
  } else {
    features.lineThickness = weightedfxRandom(['Hairline', 'Thin', 'Medium', 'Thick'], [10, 60, 20, 10])
  }
  featuresObject['Line Thickness'] = features.lineThickness

  // We also want to break the line up into a number of points (so we have add the 'wiggle' to the line),
  // we'll do this as pointsPerTile, and then we'll work out the pointsPerLine from that.
  features.pointsPerTile = 64
  // Now loop through the layers, and then the tiles, and create a type of each one.
  features.layers = []
  let thresholdMod = getRandom() * 0.55 + 0.2
  let pathLengthThreshold = features.tilesAcross * features.tilesDown * thresholdMod
  if (!useSeed) {
    if ($fx.getParam('lengthThreshold') === 'Suggested') {
      if (features.tilesAcross === 3) thresholdMod = weightedfxRandom([0.2, 0.5, 0.75], [5, 35, 60])
      if (features.tilesAcross === 3 && featuresObject.Layers < 2) weightedfxRandom([0.2, 0.5, 0.75], [0, 20, 80])
      if (features.tilesAcross === 6) thresholdMod = weightedfxRandom([0.2, 0.5, 0.75], [5, 25, 70])
      if (features.tilesAcross === 6 && featuresObject.Layers < 2) weightedfxRandom([0.2, 0.5, 0.75], [0, 20, 80])
      if (features.tilesAcross === 9) thresholdMod = weightedfxRandom([0.2, 0.5, 0.75], [5, 15, 80])
      if (features.tilesAcross === 9 && featuresObject.Layers < 3) thresholdMod = weightedfxRandom([0.2, 0.5, 0.75], [0, 15, 85])
    } else {
      if ($fx.getParam('lengthThreshold') === 'Short') thresholdMod = 0.2
      if ($fx.getParam('lengthThreshold') === 'Medium') thresholdMod = 0.5
      if ($fx.getParam('lengthThreshold') === 'Long') thresholdMod = 0.75
    }
  } else {
    thresholdMod = getRandom() * 0.55 + 0.2
  }
  pathLengthThreshold = Math.ceil(features.tilesAcross * features.tilesDown * thresholdMod)
  if (featuresObject.Layers === 1) pathLengthThreshold += 2
  if (featuresObject.Layers === 2) pathLengthThreshold += 1

  if (thresholdMod <= 0.75) featuresObject['Length Threshold'] = 'Long'
  if (thresholdMod <= 0.5) featuresObject['Length Threshold'] = 'Medium'
  if (thresholdMod <= 0.2) featuresObject['Length Threshold'] = 'Short'

  for (let layer = 0; layer < layers; layer++) {
    features.layers[layer] = {}

    // Okay, what we're going to do is pick a random tile to be the start tile, and then we'll
    // do a random walk around the tiles, and pick a random tile to go to next, we'll keep going
    // until we've reached a position where we can't move to another tile, or we've reached a
    // length threshold.
    // From each tile we will check what the valid other tiles are, and then pick one of those
    // at random to go to next.
    // If we can't move to another tile we are either finished (if we've reached the length threshold)
    // or we need to pick a new start tile and start again.
    // We'll keep the path in an array. Once the path is made we'll work out the type of tiles
    // we need to draw. First though lets make the path.
    let validPath = false
    // const pathLengthThreshold = features.tilesAcross * features.tilesDown * 0.75

    let path = []
    let map = {}
    let longestPath = []
    let escapeCounter = 0
    while (!validPath) {
      validPath = true
      path = []
      map = {}
      // First pick a random tile to start at
      let x = Math.floor(getRandom() * features.tilesAcross)
      let y = Math.floor(getRandom() * features.tilesDown)
      let index = `${x}-${y}`
      // Push the start tile onto the path and add it to the map
      path.push(index)
      map[index] = true
      // Non we keep moving from one tile to the next until we run out of valid moves
      let validMoves = true
      while (validMoves && path.length < pathLengthThreshold) {
        // Now we need to work out what the valid next tiles are
        const validNextTiles = []
        // See if we can move up
        if (y > 0) {
          index = `${x}-${y - 1}`
          if (!map[index]) validNextTiles.push(index)
        }
        // See if we can move down
        if (y < features.tilesDown - 1) {
          index = `${x}-${y + 1}`
          if (!map[index]) validNextTiles.push(index)
        }
        // See if we can move left
        if (x > 0) {
          index = `${x - 1}-${y}`
          if (!map[index]) validNextTiles.push(index)
        }
        // See if we can move right
        if (x < features.tilesAcross - 1) {
          index = `${x + 1}-${y}`
          if (!map[index]) validNextTiles.push(index)
        }
        // If we can't move to another tile we need to check if we've reached the length threshold
        // if we have then we're done, if not we need to pick a new start tile and start again
        if (validNextTiles.length === 0) {
          validMoves = false
        } else {
          // We can move to another tile, so pick one at random and add it to the path
          index = validNextTiles[Math.floor(getRandom() * validNextTiles.length)]
          path.push(index)
          map[index] = true
          // Now we need to update x and y
          const parts = index.split('-')
          x = Number(parts[0])
          y = Number(parts[1])
        }
      }
      if (path.length > longestPath.length) {
        longestPath = path
      }
      // If we've reached the length threshold then we're done, if not we need to pick a new start tile and start again
      if (path.length < pathLengthThreshold) {
        validPath = false
      }
      escapeCounter++
      if (escapeCounter > 100) {
        console.log(`Escaped on layer ${layer} with longest path length ${longestPath.length}!`)
        console.log('Threshold was', pathLengthThreshold)
        path = longestPath
        validPath = true
      }
    }

    // Now we have a path, we need to work out what type of tiles we need to draw
    const newPath = []
    for (let i = 0; i < path.length; i++) {
      const index = path[i]
      const parts = index.split('-')
      const x = Number(parts[0])
      const y = Number(parts[1])
      const tile = {
        x,
        y
      }
      // If we are the first tile, then we need to work out if we're going to be a straight or a turn
      let validNextTiles = []
      if (i === 0) {
        if (weightedRandom(typeChances.options, typeChances.weights) === 'Straight') {
          // If the next tile is to the left or right then we're a horizontal straight
          if (path[i + 1] === `${x - 1}-${y}` || path[i + 1] === `${x + 1}-${y}`) {
            validNextTiles = [HORIZONTAL]
          } else {
            validNextTiles = [VERTICAL]
          }
        } else {
          // make an array that have valid next tiles in it, start it empty
          // If the next tile is to the right...
          if (path[i + 1] === `${x + 1}-${y}`) validNextTiles = [NE_CORNER, SE_CORNER, NE_CURVE, SE_CURVE, NE_REFLECT, SE_REFLECT]
          // If the next tile is to the left...
          if (path[i + 1] === `${x - 1}-${y}`) validNextTiles = [NW_CORNER, SW_CORNER, NW_CURVE, SW_CURVE, NW_REFLECT, SW_REFLECT]
          // If the next tile is above...
          if (path[i + 1] === `${x}-${y - 1}`) validNextTiles = [NE_CORNER, NW_CORNER, NE_CURVE, NW_CURVE, NE_REFLECT, NW_REFLECT]
          // If the next tile is below...
          if (path[i + 1] === `${x}-${y + 1}`) validNextTiles = [SE_CORNER, SW_CORNER, SE_CURVE, SW_CURVE, SE_REFLECT, SW_REFLECT]
        }
      }
      // If we are not the first or last tile, then work out what type of tile we need to be
      if (i > 0 && i < path.length - 1) {
        // If the previous tile is the left and the next tile is to the right, or
        // the previous tile is to the right and the next tile is to the left, then we're a horizontal straight
        if ((path[i - 1] === `${x - 1}-${y}` && path[i + 1] === `${x + 1}-${y}`) || (path[i - 1] === `${x + 1}-${y}` && path[i + 1] === `${x - 1}-${y}`)) validNextTiles = [HORIZONTAL]
        // If the previous tile is the top and the next tile is to the bottom, or
        // the previous tile is to the bottom and the next tile is to the top, then we're a vertical straight
        if ((path[i - 1] === `${x}-${y - 1}` && path[i + 1] === `${x}-${y + 1}`) || (path[i - 1] === `${x}-${y + 1}` && path[i + 1] === `${x}-${y - 1}`)) validNextTiles = [VERTICAL]
        // If the previous tile is to the top...
        if (path[i - 1] === `${x}-${y - 1}`) {
          // If the next tile is to the right...
          if (path[i + 1] === `${x + 1}-${y}`) validNextTiles = [NE_CORNER, NE_CURVE, NE_REFLECT]
          // If the next tile is to the left...
          if (path[i + 1] === `${x - 1}-${y}`) validNextTiles = [NW_CORNER, NW_CURVE, NW_REFLECT]
        }
        // If the previous tile is to the bottom...
        if (path[i - 1] === `${x}-${y + 1}`) {
          // If the next tile is to the right...
          if (path[i + 1] === `${x + 1}-${y}`) validNextTiles = [SE_CORNER, SE_CURVE, SE_REFLECT]
          // If the next tile is to the left...
          if (path[i + 1] === `${x - 1}-${y}`) validNextTiles = [SW_CORNER, SW_CURVE, SW_REFLECT]
        }
        // If the previous tile is to the right...
        if (path[i - 1] === `${x + 1}-${y}`) {
          // If the next tile is to the top...
          if (path[i + 1] === `${x}-${y - 1}`) validNextTiles = [NE_CORNER, NE_CURVE, NE_REFLECT]
          // If the next tile is to the bottom...
          if (path[i + 1] === `${x}-${y + 1}`) validNextTiles = [SE_CORNER, SE_CURVE, SE_REFLECT]
        }
        // If the previous tile is to the left...
        if (path[i - 1] === `${x - 1}-${y}`) {
          // If the next tile is to the top...
          if (path[i + 1] === `${x}-${y - 1}`) validNextTiles = [NW_CORNER, NW_CURVE, NW_REFLECT]
          // If the next tile is to the bottom...
          if (path[i + 1] === `${x}-${y + 1}`) validNextTiles = [SW_CORNER, SW_CURVE, SW_REFLECT]
        }
      }
      // If we are the last tile, then we need to work out what type of tile we need to be
      if (i === path.length - 1) {
        // If the previous tile is to the right...
        if (path[i - 1] === `${x + 1}-${y}`) validNextTiles = [HORIZONTAL, HORIZONTAL, HORIZONTAL, NE_CORNER, SE_CORNER, NE_CURVE, SE_CURVE, NE_REFLECT, SE_REFLECT]
        // If the previous tile is to the left...
        if (path[i - 1] === `${x - 1}-${y}`) validNextTiles = [HORIZONTAL, HORIZONTAL, HORIZONTAL, NW_CORNER, SW_CORNER, NW_CURVE, SW_CURVE, NW_REFLECT, SW_REFLECT]
        // If the previous tile is above...
        if (path[i - 1] === `${x}-${y - 1}`) validNextTiles = [VERTICAL, VERTICAL, VERTICAL, NE_CORNER, NW_CORNER, NE_CURVE, NW_CURVE, NE_REFLECT, NW_REFLECT]
        // If the previous tile is below...
        if (path[i - 1] === `${x}-${y + 1}`) validNextTiles = [VERTICAL, VERTICAL, VERTICAL, SE_CORNER, SW_CORNER, SE_CURVE, SW_CURVE, SE_REFLECT, SW_REFLECT]
      }
      // Now pick a tile at random from the valid next tiles
      tile.type = validNextTiles[Math.floor(getRandom() * validNextTiles.length)]
      newPath.push(tile)
      map[index] = tile
    }
    features.layers[layer].path = newPath
    features.layers[layer].map = map

    // Add in the noise offsets for this layer
    features.layers[layer].noiseOffset = {
      x: Math.floor(getRandom() * 5000) + 5000,
      y: Math.floor(getRandom() * 5000) + 5000
    }
  }

  // Now we are going to loop through all the tiles, and check the contents of the layer map
  // for each layer to see if we have a "turn" tile in more than one layer, if we do then
  // we need to make the turn tiles all the same type
  for (let y = 0; y < features.tilesDown; y++) {
    for (let x = 0; x < features.tilesAcross; x++) {
      const index = `${x}-${y}`
      const hasTurn = []
      // Loop through the layers
      for (let layer = 0; layer < features.layers.length; layer++) {
        // If we have a turn tile, then set the hasTurn flag
        if (features.layers[layer].map[index] && turns.includes(features.layers[layer].map[index].type)) {
          hasTurn.push({
            type: features.layers[layer].map[index].type,
            layer
          })
        }
      }
      // If we have more than one turns on the spot, log it to the console
      if (hasTurn.length > 1) {
        // grab the types of the turns
        const types = hasTurn.map(turn => turn.type)
        let hasCurve = false
        let hasReflect = false
        let hasCorner = false
        // Loop through the types and see if we have a curve, reflect or corner
        for (let i = 0; i < types.length; i++) {
          if (curves.includes(types[i])) hasCurve = true
          if (reflects.includes(types[i])) hasReflect = true
          if (corners.includes(types[i])) hasCorner = true
        }
        // If we have more than one type of turn, then we need to make them all the same
        // add up how many different types we have
        const typeCount = hasCurve + hasReflect + hasCorner
        // If we have more than one type, then we need to make them all the same
        let doItAnyway = false
        // If there's only one type of turn, then we need to check to see if it's a corner
        // or a curve, and if it is, then we need to make sure they aren't in opposite directions
        // if they are then we need to change things anyway
        if (typeCount === 1) {
          if (hasCurve || hasCorner) {
            let neCount = 0
            let nwCount = 0
            let seCount = 0
            let swCount = 0
            // Go through the layer map and count the number of each type of turn
            for (let layer = 0; layer < features.layers.length; layer++) {
              if (features.layers[layer].map[index] && features.layers[layer].map[index].type === NE_CURVE) neCount++
              if (features.layers[layer].map[index] && features.layers[layer].map[index].type === NW_CURVE) nwCount++
              if (features.layers[layer].map[index] && features.layers[layer].map[index].type === SE_CURVE) seCount++
              if (features.layers[layer].map[index] && features.layers[layer].map[index].type === SW_CURVE) swCount++
              if (features.layers[layer].map[index] && features.layers[layer].map[index].type === NE_CORNER) neCount++
              if (features.layers[layer].map[index] && features.layers[layer].map[index].type === NW_CORNER) nwCount++
              if (features.layers[layer].map[index] && features.layers[layer].map[index].type === SE_CORNER) seCount++
              if (features.layers[layer].map[index] && features.layers[layer].map[index].type === SW_CORNER) swCount++
            }
            // if we have opposite directions, then we need to change things
            if (neCount > 0 && swCount > 0) doItAnyway = true
            if (nwCount > 0 && seCount > 0) doItAnyway = true
          }
        }
        if (typeCount > 1 || doItAnyway) {
          // We allow the tiles to become a curve only if the curves aren't in opposite directions
          // check to see if any of them are NW_CURVE
          let allowCurve = true
          const nwCurves = hasTurn.filter(turn => turn.type === NW_CURVE)
          const neCurves = hasTurn.filter(turn => turn.type === NE_CURVE)
          const swCurves = hasTurn.filter(turn => turn.type === SW_CURVE)
          const seCurves = hasTurn.filter(turn => turn.type === SE_CURVE)
          if (nwCurves.length > 0 && seCurves.length > 0) allowCurve = false
          if (neCurves.length > 0 && swCurves.length > 0) allowCurve = false
          // Do the same again for the corners
          let allowCorners = true
          const nwCorners = hasTurn.filter(turn => turn.type === NW_CORNER)
          const neCorners = hasTurn.filter(turn => turn.type === NE_CORNER)
          const swCorners = hasTurn.filter(turn => turn.type === SW_CORNER)
          const seCorners = hasTurn.filter(turn => turn.type === SE_CORNER)
          if (nwCorners.length > 0 && seCorners.length > 0) allowCorners = false
          if (neCorners.length > 0 && swCorners.length > 0) allowCorners = false
          const allowTypes = ['reflect']
          if (allowCorners) allowTypes.push('corner')
          if (allowCurve) allowTypes.push('curve')
          // Randomly pick a type
          const newType = allowTypes[Math.floor(getRandom() * allowTypes.length)]
          // Go through the layers for this index and change the tiles to the new type in the map
          for (let i = 0; i < features.layers.length; i++) {
            const thisLayer = features.layers[i]
            if (features.layers[i].map[index]) {
              const thisTurn = thisLayer.map[index].type
              // If we are converting to curves
              if (newType === 'curve') {
                // If we have a reflect, then we need to make it a curve
                if (thisTurn === NW_REFLECT) features.layers[i].map[index].type = NW_CURVE
                if (thisTurn === NE_REFLECT) features.layers[i].map[index].type = NE_CURVE
                if (thisTurn === SW_REFLECT) features.layers[i].map[index].type = SW_CURVE
                if (thisTurn === SE_REFLECT) features.layers[i].map[index].type = SE_CURVE
                // If we have a corner, then we need to make it a curve
                if (thisTurn === NW_CORNER) features.layers[i].map[index].type = NW_CURVE
                if (thisTurn === NE_CORNER) features.layers[i].map[index].type = NE_CURVE
                if (thisTurn === SW_CORNER) features.layers[i].map[index].type = SW_CURVE
                if (thisTurn === SE_CORNER) features.layers[i].map[index].type = SE_CURVE
              }
              // If we are converting to reflects
              if (newType === 'reflect') {
                // If we have a curve, then we need to make it a reflect
                if (thisTurn === NW_CURVE) features.layers[i].map[index].type = NW_REFLECT
                if (thisTurn === NE_CURVE) features.layers[i].map[index].type = NE_REFLECT
                if (thisTurn === SW_CURVE) features.layers[i].map[index].type = SW_REFLECT
                if (thisTurn === SE_CURVE) features.layers[i].map[index].type = SE_REFLECT
                // If we have a corner, then we need to make it a reflect
                if (thisTurn === NW_CORNER) features.layers[i].map[index].type = NW_REFLECT
                if (thisTurn === NE_CORNER) features.layers[i].map[index].type = NE_REFLECT
                if (thisTurn === SW_CORNER) features.layers[i].map[index].type = SW_REFLECT
                if (thisTurn === SE_CORNER) features.layers[i].map[index].type = SE_REFLECT
              }
              // If we are converting to corners
              if (newType === 'corner') {
                // If we have a curve, then we need to make it a corner
                if (thisTurn === NW_CURVE) features.layers[i].map[index].type = NW_CORNER
                if (thisTurn === NE_CURVE) features.layers[i].map[index].type = NE_CORNER
                if (thisTurn === SW_CURVE) features.layers[i].map[index].type = SW_CORNER
                if (thisTurn === SE_CURVE) features.layers[i].map[index].type = SE_CORNER
                // If we have a reflect, then we need to make it a corner
                if (thisTurn === NW_REFLECT) features.layers[i].map[index].type = NW_CORNER
                if (thisTurn === NE_REFLECT) features.layers[i].map[index].type = NE_CORNER
                if (thisTurn === SW_REFLECT) features.layers[i].map[index].type = SW_CORNER
                if (thisTurn === SE_REFLECT) features.layers[i].map[index].type = SE_CORNER
              }
            }
          }
        }
      }
    }
  }

  // Now that we've corrected the tiles, we need to put the types from the map into the path, so
  // loop around the layers again
  for (let i = 0; i < features.layers.length; i++) {
    const path = features.layers[i].path
    // Loop through the path
    for (let j = 0; j < path.length; j++) {
      // If we have a map entry for this path index, then we need to update the type
      const index = `${path[j].x}-${path[j].y}`
      if (features.layers[i].map[index]) {
        features.layers[i].path[j].type = features.layers[i].map[index].type
      }
    }
  }

  featuresObject['Hardcore Mode'] = $fx.getParam('gridSize') === 'Random for hash' && $fx.getParam('layers') === 'Weighted random' && $fx.getParam('colourStrategy') === 'Random for hash' && $fx.getParam('numberOfLines') && ($fx.getParam('lengthThreshold') === 'Suggested' || $fx.getParam('lengthThreshold') === 'Random for hash') && $fx.getParam('suggestDestroyer') && ($fx.getParam('lineThickness') === 'Suggested' || $fx.getParam('lineThickness') === 'Random for hash')
  featuresObject['DANGER SEEDED'] = useSeed
  $fx.features(featuresObject)
}

//  Call the above make features, so we'll have the window.$fxhashFeatures available
//  for fxhash
makeFeatures()

const init = async () => {
  //  I should add a timer to this, but really how often to people who aren't
  //  the developer resize stuff all the time. Stick it in a digital frame and
  //  have done with it!
  window.addEventListener('resize', async () => {
    //  If we do resize though, work out the new size...
    clearTimeout(resizeTmr)
    resizeTmr = setTimeout(async () => {
      await layoutCanvas()
    }, 100)
  })

  //  Now layout the canvas
  await layoutCanvas()
}

const layoutCanvas = async () => {
  //  Kill the next animation frame
  window.cancelAnimationFrame(nextFrame)

  const wWidth = window.innerWidth
  const wHeight = window.innerHeight
  let cWidth = wWidth
  let cHeight = cWidth * ratio
  if (cHeight > wHeight) {
    cHeight = wHeight
    cWidth = wHeight / ratio
  }
  const canvas = document.getElementById('target')
  if (highRes) {
    canvas.height = 8192
    canvas.width = 8192 / ratio
  } else {
    canvas.width = Math.min((8192 / 2), cWidth * 2)
    canvas.height = Math.min((8192 / ratio / 2), cHeight * 2)
    //  Minimum size to be half of the high rez cersion
    if (Math.min(canvas.width, canvas.height) < 8192 / 2) {
      if (canvas.width < canvas.height) {
        canvas.height = 8192 / 2
        canvas.width = 8192 / 2 / ratio
      } else {
        canvas.width = 8192 / 2
        canvas.height = 8192 / 2 / ratio
      }
    }
  }

  canvas.style.position = 'absolute'
  canvas.style.width = `${cWidth}px`
  canvas.style.height = `${cHeight}px`
  canvas.style.left = `${(wWidth - cWidth) / 2}px`
  canvas.style.top = `${(wHeight - cHeight) / 2}px`

  //  Re-Create the paper pattern
  const paper1 = document.createElement('canvas')
  paper1.width = canvas.width / 2
  paper1.height = canvas.height / 2
  const paper1Ctx = paper1.getContext('2d')
  await paper1Ctx.drawImage(paper1Loaded, 0, 0, 1920, 1920, 0, 0, paper1.width, paper1.height)
  features.paper1Pattern = paper1Ctx.createPattern(paper1, 'repeat')

  const paper2 = document.createElement('canvas')
  paper2.width = canvas.width / (22 / 7)
  paper2.height = canvas.height / (22 / 7)
  const paper2Ctx = paper2.getContext('2d')
  await paper2Ctx.drawImage(paper1Loaded, 0, 0, 1920, 1920, 0, 0, paper2.width, paper2.height)
  features.paper2Pattern = paper2Ctx.createPattern(paper2, 'repeat')

  //  And draw it!!
  drawCanvas()
}

// write out own lerp function
const lerp = (a, b, t) => {
  return a + (b - a) * t
}

// A function to check if two points are supposed to be joined based on the distance
// taking the w into account
const pointsJoined = (p1, p2, stepSize) => {
  // make the distance check be the square of hald the step size
  const threshold = stepSize / 2
  // check the distance between the points to see if it's less than the threshold
  if (Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y) < threshold) return true
  return false
}

const makeLine = (tl, tr, bl, br, tileWidth, tileMargin, line, type) => {
  // Work out the steps size between lines
  const stepSize = (tileWidth - (tileMargin * 2)) / (features.linesPerTile - 1)
  const points = []
  if (type === HORIZONTAL || type === VERTICAL) {
    let start = {}
    let end = {}
    if (type === HORIZONTAL) {
      start = {
        x: tl.x,
        y: tl.y + tileMargin + (stepSize * line)
      }
      end = {
        x: tr.x,
        y: tr.y + tileMargin + (stepSize * line)
      }
    }
    if (type === VERTICAL) {
      start = {
        x: tl.x + tileMargin + (stepSize * line),
        y: tl.y
      }
      end = {
        x: bl.x + tileMargin + (stepSize * line),
        y: bl.y
      }
    }
    // Now we need to divide the lines into segments based on features.pointsPerTile
    // So loop through the features.pointsPerTile
    for (let i = 0; i <= features.pointsPerTile; i++) {
      // Work out the percentage of the line we're at
      const t = i / features.pointsPerTile
      // Work out the x and y of the point
      const x = lerp(start.x, end.x, t)
      const y = lerp(start.y, end.y, t)
      // Add the point to the points array
      points.push({
        x,
        y
      })
    }
  }

  // Okay, if we're doing a sharp corner then we have three main points
  if (type === SE_CORNER || type === SW_CORNER || type === NE_CORNER || type === NW_CORNER) {
    let start = {}
    let end = {}
    let corner = {}
    if (type === SW_CORNER) {
      start = {
        x: bl.x,
        y: bl.y - tileMargin - (stepSize * line)
      }
      end = {
        x: bl.x + tileMargin + (stepSize * line),
        y: bl.y
      }
      corner = {
        x: bl.x + tileMargin + (stepSize * line),
        y: bl.y - tileMargin - (stepSize * line)
      }
    }
    if (type === SE_CORNER) {
      start = {
        x: br.x - tileMargin - (stepSize * line),
        y: br.y
      }
      end = {
        x: br.x,
        y: br.y - tileMargin - (stepSize * line)
      }
      corner = {
        x: br.x - tileMargin - (stepSize * line),
        y: br.y - tileMargin - (stepSize * line)
      }
    }
    if (type === NW_CORNER) {
      start = {
        x: tl.x,
        y: tl.y + tileMargin + (stepSize * line)
      }
      end = {
        x: tl.x + tileMargin + (stepSize * line),
        y: tl.y
      }
      corner = {
        x: tl.x + tileMargin + (stepSize * line),
        y: tl.y + tileMargin + (stepSize * line)
      }
    }
    if (type === NE_CORNER) {
      start = {
        x: tr.x - tileMargin - (stepSize * line),
        y: tr.y
      }
      end = {
        x: tr.x,
        y: tr.y + tileMargin + (stepSize * line)
      }
      corner = {
        x: tr.x - tileMargin - (stepSize * line),
        y: tr.y + tileMargin + (stepSize * line)
      }
    }
    // Add the start point
    points.push(start)

    // Work out the distance between the start and corner
    const startToCorner = Math.sqrt(Math.pow(corner.x - start.x, 2) + Math.pow(corner.y - start.y, 2))
    // Work out the percent of the tileWidth the start to corner is
    const startToCornerPercent = startToCorner / tileWidth
    // Work out how many points we need to add to the start to corner
    const startToCornerPoints = Math.ceil(startToCornerPercent * features.pointsPerTile)
    //  Now draw from the start to the corner
    for (let i = 1; i <= startToCornerPoints; i++) {
      // Work out the percentage of the line we're at
      const t = i / startToCornerPoints
      const x = lerp(start.x, corner.x, t)
      const y = lerp(start.y, corner.y, t)
      // Add the point to the points array
      points.push({
        x,
        y
      })
    }

    // Now do the same for the corner to end
    // Work out the distance between the corner and end
    const cornerToEnd = Math.sqrt(Math.pow(end.x - corner.x, 2) + Math.pow(end.y - corner.y, 2))
    // Work out the percent of the tileWidth the corner to end is
    const cornerToEndPercent = cornerToEnd / tileWidth
    // Work out how many points we need to add to the corner to end
    const cornerToEndPoints = Math.ceil(cornerToEndPercent * features.pointsPerTile)
    //  Now draw from the corner to the end
    for (let i = 1; i < cornerToEndPoints; i++) {
      // Work out the percentage of the line we're at
      const t = i / cornerToEndPoints
      const x = lerp(corner.x, end.x, t)
      const y = lerp(corner.y, end.y, t)
      // Add the point to the points array
      points.push({
        x,
        y
      })
    }

    // Add the end point
    points.push(end)
  }

  // If we are doing the reflect corners then we have three main points
  if (type === SW_REFLECT || type === SE_REFLECT || type === NW_REFLECT || type === NE_REFLECT) {
    let start = {}
    let end = {}
    let corner = {}
    if (type === SW_REFLECT) {
      start = {
        x: bl.x,
        y: tl.y + tileMargin + (stepSize * line)
      }
      end = {
        x: bl.x + tileMargin + (stepSize * line),
        y: br.y
      }
      corner = {
        x: bl.x + tileMargin + (stepSize * line),
        y: tl.y + tileMargin + (stepSize * line)
      }
    }
    if (type === SE_REFLECT) {
      start = {
        x: br.x,
        y: tr.y + tileMargin + (stepSize * line)
      }
      end = {
        x: br.x - tileMargin - (stepSize * line),
        y: br.y
      }
      corner = {
        x: br.x - tileMargin - (stepSize * line),
        y: tr.y + tileMargin + (stepSize * line)
      }
    }
    if (type === NW_REFLECT) {
      start = {
        x: tl.x,
        y: bl.y - tileMargin - (stepSize * line)
      }
      end = {
        x: tl.x + tileMargin + (stepSize * line),
        y: tl.y
      }
      corner = {
        x: tl.x + tileMargin + (stepSize * line),
        y: bl.y - tileMargin - (stepSize * line)
      }
    }
    if (type === NE_REFLECT) {
      start = {
        x: tr.x,
        y: br.y - tileMargin - (stepSize * line)
      }
      end = {
        x: tr.x - tileMargin - (stepSize * line),
        y: tr.y
      }
      corner = {
        x: tr.x - tileMargin - (stepSize * line),
        y: br.y - tileMargin - (stepSize * line)
      }
    }
    // Add the start point
    points.push(start)

    // Work out the distance between the start and corner
    const startToCorner = Math.sqrt(Math.pow(corner.x - start.x, 2) + Math.pow(corner.y - start.y, 2))
    // Work out the percent of the tileWidth the start to corner is
    const startToCornerPercent = startToCorner / tileWidth
    // Work out how many points we need to add to the start to corner
    const startToCornerPoints = Math.ceil(startToCornerPercent * features.pointsPerTile)
    //  Now draw from the start to the corner
    for (let i = 1; i <= startToCornerPoints; i++) {
      // Work out the percentage of the line we're at
      const t = i / startToCornerPoints
      const x = lerp(start.x, corner.x, t)
      const y = lerp(start.y, corner.y, t)
      // Add the point to the points array
      points.push({
        x,
        y
      })
    }

    // Now do the same for the corner to end
    // Work out the distance between the corner and end
    const cornerToEnd = Math.sqrt(Math.pow(end.x - corner.x, 2) + Math.pow(end.y - corner.y, 2))
    // Work out the percent of the tileWidth the corner to end is
    const cornerToEndPercent = cornerToEnd / tileWidth
    // Work out how many points we need to add to the corner to end
    const cornerToEndPoints = Math.ceil(cornerToEndPercent * features.pointsPerTile)
    //  Now draw from the corner to the end
    for (let i = 1; i < cornerToEndPoints; i++) {
      // Work out the percentage of the line we're at
      const t = i / cornerToEndPoints
      const x = lerp(corner.x, end.x, t)
      const y = lerp(corner.y, end.y, t)
      // Add the point to the points array
      points.push({
        x,
        y
      })
    }

    // Add the end point
    points.push(end)
  }

  if (type === SW_CURVE || type === SE_CURVE || type === NW_CURVE || type === NE_CURVE) {
    let start = {}
    let end = {}
    let startAngle = 0
    let endAngle = 0
    let centerPoint = null
    if (type === SW_CURVE) {
      start = {
        x: bl.x,
        y: bl.y - tileMargin - (stepSize * line)
      }
      end = {
        x: bl.x + tileMargin + (stepSize * line),
        y: br.y
      }
      startAngle = 1.5
      endAngle = 2
      centerPoint = bl
    }
    if (type === SE_CURVE) {
      start = {
        x: br.x - tileMargin - (stepSize * line),
        y: br.y
      }
      end = {
        x: br.x,
        y: br.y - tileMargin - (stepSize * line)
      }
      startAngle = 1
      endAngle = 1.5
      centerPoint = br
    }
    if (type === NW_CURVE) {
      start = {
        x: tl.x + tileMargin + (stepSize * line),
        y: tl.y
      }
      end = {
        x: tl.x,
        y: tl.y + tileMargin + (stepSize * line)
      }
      startAngle = 0
      endAngle = 0.5
      centerPoint = tl
    }
    if (type === NE_CURVE) {
      start = {
        x: tr.x,
        y: tr.y + tileMargin + (stepSize * line)
      }
      end = {
        x: tr.x - tileMargin - (stepSize * line),
        y: tr.y
      }
      startAngle = 0.5
      endAngle = 1
      centerPoint = tr
    }
    // Work out the radius of the curve
    const radius = tileMargin + (stepSize * line)
    // Now we know the radius, work out the length of a 90 arc, this is 1/4 of the circumference
    const arcLength = (radius * Math.PI) / 2
    // Work out the length of the arc compared to the tileWidth
    const arcPercentage = arcLength / tileWidth
    // Work out the number of points we need to draw
    const pointsToDraw = Math.ceil(features.pointsPerTile * arcPercentage)
    // Add the start point
    points.push(start)
    // Now loop through the pointsToDraw starting at 1 and finishing at pointsToDraw - 1
    for (let i = 1; i <= pointsToDraw - 1; i++) {
      // Work out the percentage of the line we're at
      const t = i / pointsToDraw
      // Work out the angle of the point
      const angle = lerp(startAngle, endAngle, t)
      // Work out the x and y of the point
      const x = centerPoint.x + radius * Math.cos(angle * Math.PI)
      const y = centerPoint.y + radius * Math.sin(angle * Math.PI)
      // Add the point to the points array
      points.push({
        x,
        y
      })
    }
    // push the end point
    points.push(end)
  }

  return points
}

const drawCanvas = async () => {
  //  Let the preloader know that we've hit this function at least once
  drawn = true
  //  Make sure there's only one nextFrame to be called
  window.cancelAnimationFrame(nextFrame)

  // Grab all the canvas stuff
  const canvas = document.getElementById('target')
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height
  const midX = w / 2
  const midY = h / 2

  //  Lay down the paper texture
  if (drawPaper) {
    ctx.fillStyle = features.paper1Pattern
    ctx.save()
    ctx.translate(-w * features.paperOffset.paper1.x, -h * features.paperOffset.paper1.y)
    ctx.fillRect(0, 0, w * 2, h * 2)
    ctx.restore()
  } else {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, w, h)
  }

  if (finalLines.length === 0) {
    // Work out the size of each tile
    const tileWidth = w / features.tilesAcross
    const tileMargin = tileWidth * features.tileMargin
    const stepSize = (tileWidth - (tileMargin * 2)) / (features.linesPerTile - 1)

    // Now loop through the layers
    const allLines = []
    for (let layer = 0; layer < features.layers.length; layer++) {
      const thisLayer = features.layers[layer]
      // Loop through the tiles in the layer object
      thisLayer.tileLines = {}
      thisLayer.path.forEach(tile => {
        thisLayer.tileLines[`${tile.x}-${tile.y}`] = []
        // Calculate the position of the tile
        const tl = {
          x: tile.x * tileWidth - midX,
          y: tile.y * tileWidth - midY
        }
        const tr = {
          x: (tile.x + 1) * tileWidth - midX,
          y: tile.y * tileWidth - midY
        }
        const bl = {
          x: tile.x * tileWidth - midX,
          y: (tile.y + 1) * tileWidth - midY
        }
        const br = {
          x: (tile.x + 1) * tileWidth - midX,
          y: (tile.y + 1) * tileWidth - midY
        }
        // Now loop through the lines in the tile turning it into a bunch of points
        for (let line = 0; line < features.linesPerTile; line++) {
          const points = makeLine(tl, tr, bl, br, tileWidth, tileMargin, line, tile.type)
          thisLayer.tileLines[`${tile.x}-${tile.y}`].push(points)
        }
      })
    }

    // Now go through all the layers and put the lines into the allLines array
    const layerLines = []
    for (let layer = 0; layer < features.layers.length; layer++) {
      const thisLayer = features.layers[layer]
      // What we are going to do now is create joined up lines, we're going to start with the
      // first set of lines in the path, and try and connect them to the next set of lines
      // Will will need to check both ends of the lines, and switch them around if needed
      // and also remove the duplicate points created when we join them up
      // Start with an empty array to hold the lines from the first tile on the path
      const joinedLines = []
      const pathIndex = 0
      // Loop through the lines in the first tile
      thisLayer.tileLines[`${thisLayer.path[pathIndex].x}-${thisLayer.path[pathIndex].y}`].forEach(line => {
        // Add the line to the firstTileLines array
        joinedLines.push(line)
      })

      // Now we are going to loop through the rest of the tiles in the path
      for (let i = 1; i < thisLayer.path.length; i++) {
        // Get the tile we're working on
        const tile = thisLayer.path[i]
        // Get the lines from the tile
        const lines = thisLayer.tileLines[`${tile.x}-${tile.y}`]
        // Loop through the joinedLines
        joinedLines.forEach(joinedLine => {
          // Now we need to check the end points of the line and the joinedLine
          // First check the start of the line
          const joinedLineStart = joinedLine[0]
          const joinedLineEnd = joinedLine[joinedLine.length - 1]
          // Now loop through the lines in the tile
          lines.forEach(line => {
            // Grab the start and end points of the line
            const lineStart = line[0]
            const lineEnd = line[line.length - 1]
            let doneJoin = false
            // If the end of the joinedLine is the same as the start of the line, then we can join them up
            if (pointsJoined(joinedLineEnd, lineStart, stepSize) && !doneJoin) {
              // Remove the first point of the line
              line.shift()
              // Add the line to the joinedLine
              joinedLine.push(...line)
              doneJoin = true
            }
            // If the end of the joinedLine is the same as the end of the line, then we can join them up,
            // but reverse the line first
            if (pointsJoined(joinedLineEnd, lineEnd, stepSize) && !doneJoin) {
              // Reverse the line
              line.reverse()
              // Remove the first point of the line
              line.shift()
              // Add the line to the joinedLine
              joinedLine.push(...line)
              doneJoin = true
            }
            // If the start of the joinedLine is the same as the end of the line, then we can join them up,
            // but we need to reverse both the line and the joinedLine
            if (i < thisLayer.path.length - 1) {
              if (pointsJoined(joinedLineStart, lineEnd, stepSize) && !doneJoin) {
              // Reverse the joinedLine
                joinedLine.reverse()
                // Reverse the line
                line.reverse()
                // Remove the first point of the line
                line.shift()
                // Add the line to the joinedLine
                joinedLine.push(...line)
                doneJoin = true
              }
              // If the start of the joinedLine is the same as the start of the line, then we can join them up,
              // but reverse the joinedLine first
              if (pointsJoined(joinedLineStart, lineStart, stepSize) && !doneJoin) {
              // Reverse the joinedLine
                joinedLine.reverse()
                // Remove the first point of the line
                line.shift()
                // Add the line to the joinedLine
                joinedLine.push(...line)
                doneJoin = true
              }
            }
          })
        })
      }
      layerLines.push(joinedLines)
    }

    // Go through the lines and add some noise
    for (let layer = 0; layer < features.layers.length; layer++) {
      const thisLayer = features.layers[layer]
      const joinedLines = layerLines[layer]
      // Now loop through the lines adding the noise
      const amplitude = w / 600
      const resolution = 0.03
      joinedLines.forEach(line => {
        // Loop through the points in the line
        line.forEach(point => {
          const newX = point.x + noise.perlin2((point.x + thisLayer.noiseOffset.x) * resolution, (point.y + thisLayer.noiseOffset.x) * resolution) * amplitude
          const newY = point.y + noise.perlin2((point.x + thisLayer.noiseOffset.y) * resolution, (point.y + thisLayer.noiseOffset.y) * resolution) * amplitude
          // Add some noise to the points
          point.x = newX
          point.y = newY
        })
      })
    }

    for (let layer = 0; layer < features.layers.length; layer++) {
      const joinedLines = layerLines[layer]
      // Now loop through the joinedLines adding them to the allLines array
      let index = 0
      joinedLines.forEach(line => {
        line.points = line
        line.index = index
        if (features.singleColour) {
          line.colourIndex = 0
          line.svgLayer = 0
        } else {
          if (features.colourLayersOverLines) {
            line.colourIndex = layer
            line.svgLayer = layer
          } else {
            // Pick a random colour from the colours array
            line.colourIndex = index
            line.svgLayer = features.svgLayer[index]
          }
        }
        // Only add it if the showLines flag is true
        if (features.showLine[index]) allLines.push(line)
        index++
      })
    }

    // Now loop through all the lines and add them to the finalLines array, but adjust the points by the midX and midY
    // Then store them as a percent of the width and height
    const scale = 0.925
    allLines.forEach(line => {
      const finalLine = {
        points: [],
        colourIndex: line.colourIndex,
        index: line.index,
        svgLayer: line.svgLayer
      }
      line.points.forEach(point => {
        finalLine.points.push({
          x: ((point.x * scale) + midX) / w,
          y: ((point.y * scale) + midY) / h

        })
      })
      finalLines.push(finalLine)
    })
  }

  // const colours = ['rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 1)', 'rgba(0, 0, 255, 1)']
  // const colours = ['black', 'black', 'black']
  // Set the fill colour to black

  ctx.lineWidth = w / 400
  if (features.lineThickness === 'Hairline') ctx.lineWidth = w / 800
  if (features.lineThickness === 'Medium') ctx.lineWidth = w / 200
  if (features.lineThickness === 'Thick') ctx.lineWidth = w / 100
  ctx.lineJoin = 'bevel'
  // set the origin to the middle of the canvas, after saving the current state
  // ctx.save()
  // ctx.translate(midX, midY)
  // ctx.scale(0.95, 0.95)

  // Now draw all allLines
  if (!features.singleColour) ctx.globalCompositeOperation = 'multiply'
  finalLines.forEach(line => {
    const points = line.points
    // ctx.strokeStyle = colours[line.colourIndex]
    if (features.singleColour) {
      ctx.strokeStyle = `hsl(${features.singleColour.h}, ${features.singleColour.s}%, ${features.singleColour.l}%)`
    } else {
      if (features.colourLayersOverLines) {
        ctx.strokeStyle = `hsl(${features.colours[line.colourIndex].h}, ${features.colours[line.colourIndex].s}%, ${features.colours[line.colourIndex].l}%)`
      } else {
        ctx.strokeStyle = `hsl(${features.colourChord[line.colourIndex].h}, ${features.colourChord[line.colourIndex].s}%, ${features.colourChord[line.colourIndex].l}%)`
      }
    }
    ctx.beginPath()
    // Move to the first point
    ctx.moveTo(points[0].x * w, points[0].y * h)
    // lineTo all the rest
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x * w, points[i].y * h)
    }
    ctx.stroke()
  })

  // Set the composite mode back to normal
  ctx.globalCompositeOperation = 'source-over'

  // If we haven't triggered the the canvas catching
  if (!thumbnailTaken) {
    fxpreview()
    thumbnailTaken = true
  }

  if (dumpOutputs) await autoDownloadCanvas()
}

const downloadSVG = async size => {
  // We need an arry to hold the id of the svg layers
  const svgLayers = []
  // Loop through the lines and add the svg layer index to the array if it isn't already there
  finalLines.forEach(line => {
    if (!svgLayers.includes(line.svgLayer)) svgLayers.push(line.svgLayer)
  })
  // Now sort the svgLayers array
  svgLayers.sort((a, b) => a - b)
  // Now loop through the svgLayers array and create a new svg for each one
  // we want to use a for in loop so we can use await
  for (const svgLayer of svgLayers) {
    // Create a new array to hold the lines for this svgLayer
    const svgLines = []
    // Loop through the finalLines array and add the lines to the svgLines array if they match the svgLayer
    finalLines.forEach(line => {
      if (line.svgLayer === svgLayer) svgLines.push(line)
    })
    await page.wrapSVG(svgLines, PAPER[size], `YYYSEED_${size}_${fxhash}_${svgLayer}`, 1)
  }
}

const autoDownloadCanvas = async (showHash = false) => {
  const element = document.createElement('a')
  element.setAttribute('download', `YYYSEED_${fxhash}`)
  element.style.display = 'none'
  document.body.appendChild(element)
  let imageBlob = null
  imageBlob = await new Promise(resolve => document.getElementById('target').toBlob(resolve, 'image/png'))
  element.setAttribute('href', window.URL.createObjectURL(imageBlob, {
    type: 'image/png'
  }))
  element.click()
  document.body.removeChild(element)
  // If we are dumping outputs then reload the page
  if (dumpOutputs) {
    window.location.reload()
  }
}

//  KEY PRESSED OF DOOM
document.addEventListener('keypress', async (e) => {
  e = e || window.event
  // Save
  if (e.key === 's') autoDownloadCanvas()

  //   Toggle highres mode
  if (e.key === 'h') {
    highRes = !highRes
    console.log('Highres mode is now', highRes)
    await layoutCanvas()
  }

  // Toggle the paper texture
  if (e.key === 't') {
    drawPaper = !drawPaper
    await layoutCanvas()
  }

  if (e.key === '1') downloadSVG('A1')
  if (e.key === '2') downloadSVG('A2')
  if (e.key === '3') downloadSVG('A3')
  if (e.key === '4') downloadSVG('A4')
  if (e.key === '5') downloadSVG('A5')
  if (e.key === '6') downloadSVG('A6')
})
//  This preloads the images so we can get access to them
// eslint-disable-next-line no-unused-vars
const preloadImages = () => {
  //  If paper1 has loaded and we haven't draw anything yet, then kick it all off
  if (paper1Loaded !== null && !drawn) {
    clearInterval(preloadImagesTmr)
    init()
  }
}
