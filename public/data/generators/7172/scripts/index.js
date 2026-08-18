"use strict"

console.log(`

||||||||||||||||||||||
|||                |||
||| LEMON PRINCESS |||
|||                |||
||||||||||||||||||||||

After accidentally swigging from a potion of banishment (mistaking it for her moon mead) at the Annual Wizard’s Gala, Lemon Princess was instantly transformed into a colorful and rapidly modulating energy node.

For a few short moments her karmic fabric strained against extinction. It summoned every possible objection and gripped every precious memory, but alas the brew was too potent and the Princess winked out of existence never to be seen again.

To view each of Lemon Princess' final moments in context (& export them as GIFS) visit:

https://presstube.com/lemon-princess

❤️ @presstube

`)

/////////////////////////// 
/////////////////////////// 
function fxSample(arr) {
  return arr[Math.floor(fxrand()*arr.length)]
}

function fxSampleRarity(arr, rarityTarget) {
  return arr[Math.floor(fxrand() * (arr.length * rarityTarget))]
}

function fxSampleRarityID(arr, rarityTarget) {
  return Math.floor(fxrand() * (arr.length * rarityTarget))
}
///////////////////////////
///////////////////////////

// META 

let loaderLib
let lib
let libPile

let rarityTarget

let objkts
let bgRect

// MINT
let loader
let currentColorScheme
let currentBGColor
let items
let secItems
let terItems
let princessItems = []
let maxItems = 4
let minItems = 4
let numItemsPrimary
let numItemsSecondary
let numItemsTertiary
let color
let nestedColor
let terColor
let assetID
let secAssetID
let terAssetID
let xMoveRange = 150 
let yMoveRange = 150
let xMoveRangeSec = 300 
let yMoveRangeSec = 300
let xMoveRangeTer = 800 
let yMoveRangeTer = 800
let tweenWaitMax = 500
let tweenDuration = 300
let tweenEaseIn = cjs.Ease.quintInOut
let tweenEaseOut = cjs.Ease.quintInOut
let rotationRateMax = 0.5
let rate = 1


let colorschemes = [

{scheme: ["0e0004","31081f","6b0f1a","b91372","fa198b","b7ad99","ff4365","00d9c0","fffff3"], featureName: "chroma squelch"},
{scheme: ["590d22","800f2f","a4133c","c9184a","ff4d6d","ff758f","d2fd35","ffccd5","fff0f3"], featureName: "raspberry sorbet"},
{scheme: ["d8f3dc","b7e4c7","ff0a50","74c69d","52b788","40916c","2d6a4f","1b4332","081c15"], featureName: "mint strawberry"},
{scheme: ["ffd9da","ea638c","89023e","30343f","1b2021","93b7be","798071","623cea","16302b"], featureName: "vibrant prancy decepticon"},
{scheme: ["9a8f97","c3baba","e9e3e6","b2b2b2","736f72","a30b37","40bcd8","355070","49beaa"], featureName: "icy puddle"},
{scheme: ["2d2a32","ddd92a","eae151","eeefa8","fafdf6","cc2936","6b818c","eee5e9","c7e8f3"], featureName: "yacht panties"},
{scheme: ["7cfef0","6bffb8","2ceaa3","28965a","2a6041","090909","4b5043","a40e4c","2c2c54"], featureName: "dusk forest"},
{scheme: ["bbe1c3","a7cdbd","869d7a","91785d","8b5d33","433e0e","e0b0d5","ffa552","ba5624"], featureName: "cordoroy ashtray"},
{scheme: ["4d5057","4e6e5d","4da167","3bc14a","cfcfcf","ed1c24","fdfffc","f1d302","f2e2d2"], featureName: "citrus chinos"},
{scheme: ["985f99","9684a1","aaacb0","b6c9bb","bfedc1","2d0320","0d160b","5c1a1b","5c573e"], featureName: "middleaged pony"},
{scheme: ["104f55","32746d","9ec5ab","01200f","011502","885053","fe5f55","23022e","ffa69e"], featureName: "fragrant domicile"},
{scheme: ["78c0e0","449dd1","192bc2","150578","0e0e52","6eeb83","e4ff1a","ffb800","ff5714"], featureName: "vibro squinky"},
{scheme: ["0d1f2d","546a7b","9ea3b0","fae1df","e4c3ad","6d2e46","ffe74c","ff5964","f9db6d"], featureName: "pastel fruit balance"},
{scheme: ["007f5f","2b9348","55a630","80b918","aacc00","bfd200","eb4833","eeef20","ffff3f"], featureName: "mealy apple"},
{scheme: ["247ba0","70c1b3","b2dbbf","f3ffbd","ff1654","30362f","625834","da7422","8b2635"], featureName: "dashing plop"},
{scheme: ["331832","d81e5b","f0544f","c6d8d3","fdf0d5"], featureName: "grape pony harmonica"},
{scheme: ["1b2f33","28502e","47682c","8c7051","ef3054"], featureName: "forest strawberry pop"},
{scheme: ["d8e2dc","ffffff","ffcad4","f4acb7","9d8189"], featureName: "overcast barbie flesh"},
{scheme: ["5c415d","694966","74526c","dbd053","c89933"], featureName: "gentle aubergine pram"},
{scheme: ["fbc2b5","ffa8a9","f786aa","a14a76","cdb2ab"], featureName: "maxi flesh"},
{scheme: ["ea526f","070600","f7f7ff","23b5d3","279af1"], featureName: "valiant robot"},
{scheme: ["c4bbaf","a5978b","5c4742","8d5b4c","5a2a27"], featureName: "desert chocolate"},
{scheme: ["07020d","5db7de","f1e9db","a39b8b","716a5c"], featureName: "warrior raccoon"},
{scheme: ["98eb59","801912","cf1d11","ed5d53","c2534c"], featureName: "crimson acid bath"},
{scheme: ["1d1e18","6b8f71","aad2ba","d9fff5","b9f5d8"], featureName: "slightly dead princess"},
{scheme: ["f45b69","f6e8ea","22181c","5a0001","f13030"], featureName: "rouge pop"},
{scheme: ["527a2c","ebb2ce","e6177b","6b4a5a","ffc7e2"], featureName: "watermelon completion"},
{scheme: ["000000","ffffff","494949","7c7a7a","ff5d73"], featureName: "dark cupcake"},
{scheme: ["25ced1","ffffff","fceade","ff8a5b","ea526f"], featureName: "90s chapstick"},
{scheme: ["87946a","261e38","d631a2","c9bce6","381a7a"], featureName: "righteous codpiece"},

]

let primaryAssetData = [
  {featureName: "fruitful conversations", name: "UsefulConversion", playhead: "loop", fill: true, stroke:true},
  {featureName: "calculated outreaches", name: "CalculatedOutreach", playhead: "pingpong", fill: true, stroke:true},
  {featureName: "hosted portions", name: "HostPortion", playhead: "pingpong", fill: true, stroke:true},
  {featureName: "sensory influxes", name: "SensoryInflux", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "tense junctions", name: "TenseJunction", playhead: "loop", fill: false, stroke:true, pureStrokes:false},
  {featureName: "partial remembrances", name: "PartialRemembrance", playhead: "loop", fill: true, stroke:false},
  {featureName: "swift reactions", name: "SwiftReaction", playhead: "loop", fill: false, stroke:true, pureStrokes:false},
  {featureName: "completed dreams", name: "CompletedDream", playhead: "loop", fill: true, stroke:false},
  {featureName: "tactile whisps", name: "TactileWhisp", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "furtive offerings", name: "FurtiveOffering", playhead: "pingpong", fill: true, stroke:true},
  {featureName: "sweet fumbles", name: "SweetFumble", playhead: "loop", fill: true, stroke:true},
  {featureName: "captivating déjà vus", name: "PreciousDream", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "famished pupas", name: "FamishedPupa", playhead: "loop", fill: true, stroke:true},
]

let secondaryAssetData = [
  {featureName: "conversion twitches", name: "ConversionTwitch", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "preference factories", name: "PreferenceFactory", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "oscillation quads", name: "OscillationQuad", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "wonder tracts", name: "WonderTract", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "rejected transmissions", name: "RejectedTransmission", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "collaborative sequences", name: "CollabSeq", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "challenge structs", name: "ChallengeStruct", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "contentment wreaths", name: "ContentmentWreath", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "tally trades", name: "TallyTrade", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "transmution femurs", name: "TransmutionFemur", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "pulse collars", name: "PulseCollar", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "morsel gobbles", name: "MorselGobble", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "hopeful pathways", name: "HopefulPathway1", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "new idea streams", name: "HopefulPathway2", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "doubtful rivulets", name: "HopefulPathway3", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "circular wishes", name: "CircularWish", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "triongus buttles", name: "TriongusButtle", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "triadic buttuses", name: "TriadiclButtus", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
  {featureName: "kidney shimmers", name: "KidneyShimmer", playhead: "loop", fill: false, stroke:true, pureStrokes:true},
]

let manifest = []

let features = {
  "nested memories": 0
}

function prepMintValues() {
  let names = _.map(manifest, item => {
    return item.featureName
  })

  const occurrences = names.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
  }, {})

  if (features["nested memories"] == 0) delete features["nested memories"]

  features = _.merge(occurrences, features)
  window.$fxhashFeatures = features
  console.log("FXHASH ", fxhash)
  console.log("FEATURES ", features)
}

loadLoaderLib()

function loadLoaderLib() {
  let comp = AdobeAn.getComposition("6E551C23227A4C0691433EE6D5852D40")
  loaderLib = comp.getLibrary()
  kickoffLoader()
}

function loadLib() {
  let comp = AdobeAn.getComposition("1B1D331872B84B678B30A74AB80E74A9")
  lib = comp.getLibrary()
  loadLibPile()
}

function loadLibPile() {
  let comp = AdobeAn.getComposition("9DDB8738695F40A58CB0CE0618646207")
  libPile = comp.getLibrary()
  kickoffSingle()
}

function kickoffLoader() {
  cjs.Ticker.framerate = 30
  createjs.Ticker.addEventListener("tick", tick)

  bgRect = new cjs.Shape()
  container.addChild(bgRect)

  loader = new loaderLib.PTLogoSigilsSmall()
  container.addChild(loader)

  loadLib()
}

function colorBG(color) {
  bgRect.graphics.clear()
  bgRect.graphics.beginFill(color).drawRect(-5000, -5000, 10000, 10000)
}

function kickoffSingle() {
  startPrincessRaw()
}

function tick(e) {
  stage.update()
}

function startPrincessRaw() {
  spawnNewPrincess()
}

function spawnNewPrincess() {
rarityTarget = fxrand()
  let scheme = fxSample(colorschemes)
  features.palette = scheme.featureName 
  currentColorScheme = scheme.scheme
  currentBGColor = fxSample(currentColorScheme)
  numItemsPrimary = Math.floor(fxrand() * maxItems) + minItems
  numItemsSecondary = Math.floor(fxrand() * maxItems) + minItems
  assetID = fxSampleRarityID(primaryAssetData, rarityTarget)
  secAssetID = fxSampleRarityID(secondaryAssetData, rarityTarget)
  color = "#" + fxSample(currentColorScheme)
  nestedColor = "#" + fxSample(currentColorScheme)
  items = _.times(numItemsPrimary, makePulsor)
  secItems = _.times(numItemsSecondary, makeSegundo)

  prepMintValues()

  _.delay(bubble, 500)
}

function bubble() {
  colorBG("#" + currentBGColor)
  loader.visible = false
  _.map(items, bubbleItem)
  _.map(secItems, bubbleItem)
}

function bubbleItem(item) {
  cjs.Tween.get(item, {override:true})
    .wait(Math.random() * tweenWaitMax)
    .to({scaleX: item.targetScaleX, scaleY: 1}, tweenDuration, tweenEaseIn)
}

function makePulsor(index) {

  if (fxrand() < 0.4) {
    assetID = fxSampleRarityID(primaryAssetData, rarityTarget)
  }

  let itemData = primaryAssetData[assetID]
  manifest.push(itemData)
  let item = new lib[itemData.name]()

  recolor(item, itemData, color)

  item.gotoAndStop(Math.floor(fxrand() * item.totalFrames))

  let forward = true

  if (itemData.playhead == "pingpong") {
    item.addEventListener('tick', e => {
      if (forward) {
        item.gotoAndStop(item.currentFrame + rate)
      } else {
        item.gotoAndStop(item.currentFrame - rate)
      }
      if (item.currentFrame >= item.totalFrames - rate && forward) {
        forward = false
      } else if (item.currentFrame <= 0 && !forward) {
        forward = true
      }
    })
  } else {
    item.play()
  }

  item.x = fxrand() * xMoveRange - fxrand() * xMoveRange
  item.y = fxrand() * yMoveRange - fxrand() * yMoveRange
  let targetScaleX = fxrand() < 0.4 ? 1 : -1
  item.scaleX = item.scaleY = 0
  item.targetScaleX = targetScaleX
  // cjs.Tween.get(item, {override:true})
  //   .wait(Math.random() * tweenWaitMax)
  //   .to({scaleX: targetScaleX, scaleY: 1}, tweenDuration, tweenEaseIn)
  item.rotation = fxrand() * 360
  container.addChildAt(item, 1)

  if (item.anchor1) {
    makeNested(item)
  } 

  function makeNested() {
    features["nested memories"] += 1
    let nestedItemData = fxSampleRarity(primaryAssetData, rarityTarget)
    manifest.push(nestedItemData)
    let nestedItem = new lib[nestedItemData.name]()
    nestedItem.scaleX = nestedItem.scaleY = 0.5
    let nestedItemForward = true

    recolor(nestedItem, nestedItemData, nestedColor, 2)
    nestedItem.gotoAndStop(Math.floor(fxrand() * nestedItem.totalFrames)) // synchrony
    if (nestedItemData.playhead == "pingpong") {
      nestedItem.addEventListener('tick', e => {
        if (nestedItemForward) {
          nestedItem.gotoAndStop(nestedItem.currentFrame + rate)
        } else {
          nestedItem.gotoAndStop(nestedItem.currentFrame - rate)
        }
        if (nestedItem.currentFrame >= nestedItem.totalFrames - rate && nestedItemForward) {
          nestedItemForward = false
        } else if (nestedItem.currentFrame <= 0 && !nestedItemForward) {
          nestedItemForward = true
        }
      })
    } else {
      nestedItem.play()
    }
    item.anchor1.addChild(nestedItem)
  }

  return item

}

function makeSegundo(index) {
  if (fxrand() < 0.4) {
    secAssetID = fxSampleRarityID(secondaryAssetData, rarityTarget)
  }
  let itemData = secondaryAssetData[secAssetID]
  manifest.push(itemData)
  let item = new libPile[itemData.name]()
  recolor(item, itemData, color)
  item.x = fxrand() * xMoveRangeSec - fxrand() * xMoveRangeSec
  item.y = fxrand() * yMoveRangeSec - fxrand() * yMoveRangeSec
  let targetScaleX = fxrand() < 0.4 ? 1 : -1
  item.scaleX = item.scaleY = 0
  item.targetScaleX = targetScaleX
  // cjs.Tween.get(item, {override:true})
  //   .wait(Math.random() * tweenWaitMax)
  //   .to({scaleX: targetScaleX, scaleY: 1}, tweenDuration, tweenEaseIn)
  item.rotation = fxrand()*360
  container.addChildAt(item, Math.floor(fxrand()*container.children.length))
  item.gotoAndPlay(Math.floor(fxrand() * item.totalFrames))

  return item
}

function recolor(item, itemData, color, depth) {
  depth = !depth ? 1 : depth
  let tempColor = color 
  let colorShiftRange = 5
  let colorShiftAmount = fxrand()/colorShiftRange - fxrand()/colorShiftRange
  tempColor = pSBC(colorShiftAmount, tempColor)
  let strokeColor = pSBC(-0.4, tempColor)
  if (itemData.fill) recolorFill(item, tempColor)
  if (itemData.stroke) {
    recolorStroke(item, strokeColor, itemData.pureStrokes)
    setStrokeWidth(item, 2 * depth, itemData.pureStrokes)
  }
}

function recolorFill(item, color) {
  _.times(item.totalFrames, frameIndex => {
    item.gotoAndStop(frameIndex) 
    item.children[0].graphics._fill.style = color
  })
}

function recolorStroke(item, color, pure) {
  if (pure) {
    _.times(item.children.length, childIndex => {
      _.times(item.totalFrames, frameIndex => {
        item.gotoAndStop(frameIndex) 
        item.children[childIndex].graphics._stroke.style = color
      })
    })
  } else {
    _.times(item.totalFrames, frameIndex => {
      item.gotoAndStop(frameIndex) 
      item.children[1].graphics._stroke.style = color
    })
  }
}

function setStrokeWidth(item, width, pure) {
  if (pure) {
    _.times(item.children.length, childIndex => {
      _.times(item.totalFrames, frameIndex => {
        item.gotoAndStop(frameIndex)
        item.children[childIndex].graphics._strokeStyle.width = width
      })
    })
  } else {
    _.times(item.totalFrames, frameIndex => {
      item.gotoAndStop(frameIndex) 
      item.children[1].graphics._strokeStyle.width = width
    })
  }
}








