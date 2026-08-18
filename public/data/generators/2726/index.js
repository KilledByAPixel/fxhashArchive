/*! For license information please see LICENSE.md */
// Caught in a Void

const D = 500,
  H = Math.max(D+1, window.innerHeight * 0.98),
  W = H / (4/3),
  U = H / D

class Random {
  dec = () => fxrand()
  num = (a, b) => a+(b-a)*this.dec()
  int = (a, b) => Math.floor(this.num(a, b+1))
  idx = (arr) => arr[this.int(0, arr.length-1)]
  min = (min, max, i) => {
    const vals = [...Array(i).keys()].map(x => R.num(min, max))
    return Math.min(...vals)
  }
}
const R = new Random()

class Features{
  constructor(){
    this.data = {}
  }

  log(tag, data, add=false){
    if(tag in this.data && add){
      this.data[tag] += data
      return
    }
    this.data[tag] = data
  }

  save(){
    window.$fxhashFeatures = this.data
  }
}
const F = new Features()

class Composition{
  constructor(){
    const mask = getPortraitMask()
    const options = [
      option1,
      option2,
      option3,
      option4,
      option5,
      option6,
      option7,
      option8,
      option9
    ]
    this.layers = R.idx(options)(mask)
  }

  render(){
    angleMode(DEGREES)
    createCanvas(W, H)
    background(225)
    this.layers.map(l => l.render())
  }
}

const option9 = (mask) => {
  F.log('Effect', 'Faded')
  return [
    new Layer([gpStroke(P.dark(20)), lines()]),
    new Layer([gpCompress(mask)]),
    new Layer([gpCompress(mask)], [mask])
  ]
}

const option8 = (mask) => {
  F.log('Effect', 'Compression')
  return [
    new Layer([gpStroke(P.dark(20)), lines()]),
    new Layer([gpCompress(mask)]),
    new Layer([gpStroke(P.light(60)), lines()], [mask])
  ]
}

const option7 = (mask) => {
  F.log('Effect', 'Tension')
  return [
    new Layer([gpBackground(P.mid(100, R.num(30, 50))), gpScribble]),
    new Layer([gpStroke(P.light(30)), lines()], [mask])
  ]
}

const option6 = (mask) => {
  F.log('Effect', 'Disorder')
  return [
    new Layer([gpBackground(P.mid(100, R.num(30, 60))), gpScribble]),
    new Layer([gpStroke(P.light(20)), lines()], [gpStrokeWeight(5), mask]),
    new Layer([gpColor(70), gpScribble], [mask])
  ]
}

const option5 = (mask) => {
  F.log('Effect', 'Fragments')
  const cnt = R.min(5, 500, 4)
  const max = R.int(80, 350)
  return [
    new Layer([gpBackground(P.light(100, 50))]),
    new Layer(
      [gpBackground(P.light(20)), gpStroke(P.dark(50)), lines(5000)],
      [triangles(cnt, 10, 100)]
    ),
    new Layer(
      [gpBackground(P.mid(20)), gpStroke(P.mid(50, 30)), lines(5000)],
      [triangles(cnt, 50, max)]
    ),
    new Layer(
      [gpBackground(P.dark())],
      [gpStrokeWeight(5), mask]
    ),
    new Layer(
      [gpBackground(P.light(100, 50)), gpStroke(P.light(20, 95)), lines(10000)],
      [mask]
    )
  ]
}

const option4 = (mask) => {
  F.log('Effect', 'Outside')
  const cnt = R.int(1, 5)
  const yVary = R.dec() < 0.25 ? 0 : 250
  const yMax = R.dec() < 0.25 ? 50 : 500
  const layer2 = R.dec() < 0.5 ? new Layer([gpBackground(P.mid()), gpStroke(P.mid()), gpFill(P.light(100)), curves()], [mask]) : new Layer([gpBackground(P.mid()), gpStroke(P.light(65)), lines(5000)], [mask])
  return [
    new Layer([gpColor()]),
    new Layer([gpStroke(P.dark()), lines()], [gpStrokeWeight(11), mask]),
    new Layer(
      [gpColor(20), lines(50000)],
      [gpFill(P.mid(50)), waves(10, yVary, 50, yMax), gpFill(color(0)), gpErase, gpStrokeWeight(10),  mask]
    ),
    layer2,
    new Layer([gpColor()], [circles(cnt, 10, 50), gpErase, gpStrokeWeight(10), mask])
  ]
}

const option3 = (mask) => {
  F.log('Effect', 'Fog')
  let cnt = R.int(50, 200),
    fog = R.num(1, 4),
    tCnt = Math.round(R.min(1, 30, 4)),
    waveCnt = R.int(10, 150)
  return [
    new Layer([gpColor(), gpRect]),
    new Layer(
      [gpColor(50), lines(16000, H, H)],
      [gpFill(P.dark(fog)), gpNoStroke, waves(waveCnt)]
      ),
    new Layer(
      new Layer([gpColor(), lines()], [triangles(tCnt, 25, 250), gpErase, gpStrokeWeight(50), mask])
    ),
    new Layer(
      new Layer([gpColor(), lines()], [triangles(cnt, 10, 250), gpNoFill, gpStrokeWeight(10), mask]),
      [mask]
    )
  ]
}

const option2 = (mask) => {
  F.log('Effect', '6 AM')
  return [
    new Layer([gpColor(100, 50), gpRect]),
    new Layer(
      [gpColor(), lines(R.num(2000, 5000),H,H)], 
      [triangles(), gpErase, mask]),
    new Layer(
      [gpColor(50), lines(R.num(2000, 5000),H,H)],
      [gpRect, gpErase, mask]),
    new Layer([gpStroke(P.light()), lines()], [gpStrokeWeight(3), mask]),
    new Layer(
      new Layer(
        [gpBackground(P.light()), gpStroke(P.dark(10)), lines(2500)],
        [waves(10)]),
      [mask])
  ]
}

const option1 = (mask) => {
  F.log('Effect', 'Another Day')
  const cnt = R.int(1,9)
  return [
    new Layer([gpColor(20), lines()]),
    new Layer(
      [gpColor(), gpFill(P.light()), gpStroke(P.mid()), curves(R.num(50, 1000))],
      [gpNoStroke, circles(cnt), gpErase, mask, gpNoErase, gpNoFill, mask]),
    new Layer(
      [gpColor(50), lines(R.num(10000,20000))],
      [mask])
    ]
}

const gpColor = (alphaDark=100, alphaLight=100) => (gp) => {
  gp.background(P.light(alphaLight))
  gp.fill(P.light(alphaLight))
  gp.stroke(P.dark(alphaDark))
}
const gpBackground = (color) => (gp) => gp.background(color)
const gpFill = (color) => (gp) => gp.fill(color)
const gpNoFill = (gp) => gp.noFill()
const gpErase = (gp) => gp.erase()
const gpNoErase = (gp) => gp.noErase()
const gpRect = (gp) => gp.rect(0,0, W,H)
const gpStroke = (color) => (gp) => gp.stroke(color)
const gpNoStroke = (gp) => gp.noStroke()
const gpStrokeWeight = (weight=1) => (gp) => gp.strokeWeight(weight*U)

const xyLoopFactory = (f, itter, x0=0, x1=W, y0=0, y1=H) => {
  return (gp) => {
    for(let i = 0; i < itter; i++){
      f(gp, R.num(x0, x1), R.num(y0, y1))
    }
  }
}

const lineUtil = (x, y, min, max) => {
  const l = R.num(min, max)*U
  const a = R.num(0, 360)
  return [x + cos(a) * l, y + sin(a) * l]
}

const lines = (iter=10000, min=10, max=150) => {
  return xyLoopFactory((gp, x, y) => {
    gp.line(x, y, ...lineUtil(x, y, min, max))
  }, iter)
}

const centeringLines = (iter=10000, cX=W/2, cY=H/2) => {
  return xyLoopFactory((gp, x, y) => {
    gp.line(x, y, cX, cY)
  }, iter, -W, W*2, -H, H*2)
}

const curves = (iter=100, xWidth=200, yWidth=200) => {
  return (gp) => {
    const f = xyLoopFactory((gp, x, y) => gp.curveVertex(x, y), iter, -xWidth*U,  W+xWidth*U, -yWidth*U, H+yWidth*U)
    gp.beginShape()
    f(gp)
    gp.endShape()
  }
}

const circles = (iter=20, min=10, max=500) => {
  return xyLoopFactory((gp, x, y) => {
    gp.circle(x, y, R.num(min, max)*U)
  }, iter)
}

const triangles = (iter=20, min=10, max=500) => {
  return xyLoopFactory((gp, x, y) => {
    gp.triangle(x, y, ...lineUtil(x, y, min, max), ...lineUtil(x, y, min, max))
  }, iter)
}

const waves = (iter=1, yVary=200, min=150, max=200) => {
  return xyLoopFactory((gp, x, y) => {
    x = -W
    let top = []
    let bottom = []
    while(x < W*2){
      y += R.num(-yVary, yVary)*U
      top.push(createVector(x, y))
      bottom.push(createVector(x, y + R.num(min, max)*U))
      x += W * R.num(0.35, 1)
    }
    bottom.reverse()
    let points = [...top, ...bottom, bottom.slice(bottom.length-3)]
    gp.beginShape()
    points.map(p => gp.curveVertex(p.x, p.y))
    gp.endShape()
  }, iter, 0, 0, -H*0.1, H*1.1)
}


const gpScribble = (gp) => {
  gp.noFill()
  let cnt = R.int(30, 50),
    cirT = R.dec()
    rectT = R.dec()
  for(let i = 0; i < cnt; i++){
    scribble(gp)
    if(R.dec() < cirT) scribbleCurve(gp)
    if(R.dec() < rectT) scribbleRect(gp)
  }
}

const scribble = (gp) => {
  let cnt = R.int(50, 100)
  gp.stroke(P.dark(15))
  gp.beginShape()
  for(let i = 0; i < cnt; i++){
    gp.curveVertex(R.num(0, W), R.num(0, H))
  }
  gp.endShape()
}

const scribbleCurve = (gp) => {
  let points = [],
    cnt = R.int(4, 10)
  for(let i = 0; i < cnt; i++){
    points.push(createVector(R.dec()*W, R.dec()*H))
  }
  gp.stroke(P.dark(R.num(1,15)))
  cnt = R.int(10,50)
  for(let i = 0; i < cnt; i++){
    gp.beginShape()
    points.map(p => {
      let x = R.num(-10, 10)*U
      let y = R.num(-10, 10)*U
      gp.curveVertex(p.x+x, p.y+y)
    })
    gp.endShape()
  }
}

const scribbleRect = (gp) => {
  let x = R.dec()*W,
    y = R.dec()*H,
    w = R.num(20, 250)*U,
    h = R.num(20, 200)*U,
    cnt = R.int(50, 100),
    iter = R.int(1, 15)
  
  gp.stroke(P.dark(15))
  for(let j = 0; j < iter; j++){
    gp.beginShape()
    for(let i = 0; i < cnt; i++){
      gp.curveVertex(R.num(x, x+w), R.num(y, y+h))
    }
    gp.endShape()
  }
}


const gpCompress = (mask) => (gp) => {
  let {x, y, w} = mask,
    cnt = 10000,
    minA = R.num(0, 180),
    maxA = R.num(200, 380)
  x += w/2
  y += w/2
  gp.noFill()
  gp.strokeWeight(1*U)
  gp.stroke(P.dark(R.num(3, 5)))
  for(let i = 0; i < cnt; i++){
    let a = R.num(minA, maxA),
      l = R.num(50, 800)*U,
      jitter = () => R.num(0, 15)*U
      x0 = x+cos(a)*w + jitter(),
      y0 = y+sin(a)*w + jitter(),
      x1 = x+cos(a)*l+w,
      y1 = y+sin(a)*l,
      c = R.int(10, 25),
    gp.beginShape()
    for(let j = 0; j < c; j++){
      let t = R.dec(),
        xt = lerp(x0, x1, t) + jitter(),
        yt = lerp(y0, y1, t) + jitter()
      gp.curveVertex(xt, yt)
    }
    gp.endShape()
  }
}

const flip = R.dec() < 0.5
class Layer{
  constructor(fill=null, mask=null){
    this.fill = fill == null ? [] : fill
    this.mask = mask == null ? [gpRect] : mask
  }

  render(){
    if(flip){
      push()
      scale(-1, 1)
      image(this.getLayerImage(), -W, 0, W, H)
      pop()
    } else {
      image(this.getLayerImage(), 0, 0, W, H)
    }
  }
 
  getLayerImage(){
    const fill = this.getFillImage()
    fill.mask(this.getMaskImage())
    return fill
  }
  getFillImage = () => this.fill instanceof Layer ? this.fill.getLayerImage() : this._makeImage(this.fill)
  getMaskImage = () => this._makeImage(this.mask)

  _makeImage(drawFuncs){
    const gp = createGraphics(W, H)
    gp.strokeWeight(1*U)
    gp.colorMode(HSL, 360,100,100,100)
    drawFuncs.map(f => f(gp))
    const img = createImage(W, H)
    img.copy(gp, 0, 0, W, H, 0, 0, W, H)
    return img
  }
}


 const getPortraitMask = () => {
  const paths = [
    {
      'name': 'Full Length Looking Down',
      'd': '516,5,549,0,574,11,587,24,600,37,611,45,609,50,608,53,605,58,600,61,597,63,600,72,600,75,601,84,601,88,599,94,597,99,592,99,590,106,587,118,598,134,592,141,587,146,586,144,580,144,575,144,578,147,576,152,573,160,576,156,585,163,595,170,626,176,639,198,658,230,654,270,661,297,667,324,669,382,669,398,669,414,675,455,673,463,670,475,668,469,664,480,661,491,654,514,648,516,644,517,640,506,637,513,626,534,624,530,620,540,618,545,622,542,616,566,613,577,599,653,591,678,584,701,582,714,581,724,577,762,589,743,580,767,575,781,570,818,554,847,548,858,556,856,563,860,569,865,567,879,561,889,554,903,630,925,595,950,566,971,545,943,529,931,504,912,487,918,496,889,503,868,500,859,498,851,491,825,508,781,514,747,520,713,517,700,514,683,511,669,515,648,516,643,518,634,513,618,511,617,509,617,501,643,494,662,487,681,473,707,473,736,473,749,460,744,463,754,469,770,453,781,460,792,465,799,463,830,453,867,444,900,448,920,449,933,451,954,421,958,409,967,396,977,364,1018,333,988,310,966,363,941,369,938,375,935,387,918,382,911,377,905,378,894,384,887,390,881,377,824,386,806,394,791,383,776,389,770,396,763,396,731,400,716,403,702,407,602,414,562,417,546,420,542,416,532,413,524,417,511,408,507,404,505,402,512,397,510,392,508,380,483,384,479,388,475,368,464,368,450,368,436,354,379,356,347,357,323,374,208,385,194,410,165,473,152,478,141,483,129,485,125,481,112,477,99,469,84,469,68,469,44,499,9,516,5',
      'w': 3,
      'x': (w) => [-w*0.4, W-w*0.8],
      'y': (w) => [H*0.1, H-w*0.4]
    },
    {
      'name': 'Full Length Looking Sideways',
      'd': '495,6,525,0,556,12,581,14,594,15,599,21,594,31,585,49,583,35,588,56,589,60,590,68,588,76,587,81,584,81,582,88,581,94,596,108,592,116,590,120,587,122,584,122,575,122,582,132,577,135,574,137,578,137,573,141,564,148,570,162,557,166,551,168,536,159,534,164,532,169,543,165,564,177,578,185,595,183,608,200,634,233,625,278,632,295,639,312,662,455,659,463,656,471,649,474,651,483,652,489,650,513,643,516,637,519,634,508,630,516,626,524,624,532,619,539,609,552,603,610,597,651,592,680,570,724,579,747,586,764,567,771,572,793,577,815,535,854,561,854,578,854,562,878,562,889,562,900,635,921,597,943,565,962,560,936,539,928,518,920,494,909,500,892,509,868,498,854,499,847,500,839,498,795,508,770,518,748,523,710,517,696,504,666,518,661,515,644,512,627,516,625,510,624,501,622,491,686,479,710,473,723,481,743,472,750,460,759,474,788,464,795,454,802,477,815,463,848,444,892,465,932,452,949,444,959,428,962,417,970,407,977,372,1015,345,988,318,961,385,951,388,931,390,918,383,904,395,896,408,888,387,865,391,842,396,818,393,782,405,733,417,685,394,648,422,556,424,549,416,542,413,533,411,525,403,537,398,532,388,522,392,501,386,498,371,490,372,462,370,443,368,421,355,390,356,304,357,264,364,216,374,206,398,182,450,163,454,155,459,147,464,137,464,126,464,115,448,94,451,69,457,50,470,16,495,6',
      'w': 3,
      'x': (w) => [-w*0.4, W-w*0.8],
      'y': (w) => [H*0.1, H-w*0.4]
    },
    {
      'name': 'Profile Looking Down',
      'd': '646,25,771,7,797,73,889,88,1007,106,1026,183,960,231,936,248,934,243,934,257,935,284,923,312,923,324,923,339,928,350,917,365,905,380,898,373,889,389,871,418,916,480,894,500,877,515,867,509,853,504,839,498,841,515,830,538,826,546,801,538,806,546,814,560,786,573,774,580,753,591,756,622,724,626,699,629,676,620,652,599,640,588,639,598,632,602,622,608,622,608,625,627,626,636,620,645,627,657,644,682,736,893,742,956,746,1002,753,1001,729,1001,705,1001,56,1001,30,1001,1,1000,2,1000,2,955,2,867,100,689,176,640,249,593,333,543,350,507,368,470,388,421,400,429,418,440,421,438,428,424,436,408,448,364,442,346,437,329,432,255,440,216,452,170,498,45,646,25',
      'w': 1.3,
      'x': (w) => [-w*0.25, W-w],
      'y': (w) => [H-w, H-w*0.8]
    },
    {
      'name': 'Profile Looking Up',
      'd': '753,7,796,13,822,57,810,83,794,120,792,109,797,125,808,155,832,175,833,198,834,218,828,216,826,238,824,268,884,289,882,321,881,335,877,341,864,343,846,346,846,342,846,356,846,367,850,377,849,385,847,395,830,393,838,401,848,411,834,431,826,439,811,454,827,491,802,505,778,518,736,499,717,512,698,525,700,538,690,556,679,576,654,579,665,594,673,604,691,655,684,674,681,681,768,803,806,949,821,1000,821,1000,776,1000,762,1000,167,1000,146,1000,104,1000,102,1000,119,951,133,911,188,740,252,682,316,624,373,588,393,555,402,540,410,552,415,542,420,533,431,467,438,464,451,458,444,456,435,419,432,405,380,309,390,250,399,191,435,111,467,86,513,50,567,43,627,29,685,15,700,0,753,7',
      'w': 1.3,
      'x': (w) => [-w*0.25, W-w],
      'y': (w) => [H-w, H-w*0.8]
    },
    {
      'name': 'Profile',
      'd': '735,3,769,6,799,33,805,43,808,48,821,64,819,52,815,21,826,38,835,73,844,106,834,175,814,190,801,200,785,206,792,216,795,221,805,256,818,280,833,309,835,332,835,344,835,355,818,359,815,377,814,385,809,392,805,404,799,423,825,445,832,456,853,487,906,529,893,561,883,586,869,590,845,587,817,583,815,580,813,595,807,631,820,641,811,648,799,658,787,664,792,668,798,675,798,691,789,701,781,710,761,737,763,769,764,801,744,839,718,845,693,851,600,825,576,839,545,857,543,902,513,916,450,945,471,961,437,984,419,996,420,1005,395,976,379,958,298,886,257,834,224,793,161,694,174,659,186,627,135,547,118,493,103,445,89,279,160,187,229,97,302,0,524,21,569,26,690,0,735,3',
      'w': 1.2,
      'x': (w) => [-w*0.43, W-w],
      'y': (w) => [H*0.15, H*0.95-w]
    },
    {
      'name': 'Three Quarters',
      'd': '559,3,610,2,698,36,701,78,708,163,668,151,698,176,718,192,757,274,775,293,811,332,771,359,773,376,775,394,765,400,772,403,776,405,767,423,766,429,765,436,778,461,785,469,800,487,826,495,820,521,814,545,814,547,797,559,779,571,784,550,780,618,778,644,760,683,756,703,750,731,766,808,742,820,712,835,677,854,636,848,604,843,591,824,590,841,589,853,580,885,554,907,538,921,539,972,523,991,511,1005,505,997,495,987,485,977,376,869,331,822,296,785,275,714,269,692,263,670,277,632,249,587,228,552,163,395,184,312,202,239,251,167,299,132,360,86,441,6,559,3',
      'w': 1.2,
      'x': (w) => [-w*0.51, W-w],
      'y': (w) => [H*0.15, H*0.95-w]
    },
    {
      'name': 'Profile Sitting',
      'd': '455,43,499,49,565,92,559,112,557,119,563,129,557,136,549,147,550,154,543,154,540,154,539,172,539,190,539,202,538,209,535,215,531,225,524,222,521,233,517,249,536,267,528,281,520,294,507,275,504,287,501,299,491,303,483,315,480,320,473,324,469,329,462,338,459,349,448,347,437,345,414,329,407,338,402,345,409,350,418,359,425,365,432,374,440,382,453,396,471,415,483,422,487,424,489,436,498,440,506,444,518,443,527,448,544,457,549,472,560,473,573,474,581,496,593,497,609,497,621,518,635,533,653,552,668,578,685,597,712,629,740,656,741,669,743,703,727,710,733,723,739,735,757,761,761,779,766,798,767,771,810,822,820,834,841,828,850,831,859,834,885,849,899,860,913,871,963,875,975,875,990,875,1008,893,981,923,953,954,881,937,861,936,838,934,735,944,719,934,699,922,685,866,675,857,669,851,659,843,650,833,641,824,628,806,621,809,606,814,591,802,581,814,575,821,576,821,593,826,610,831,635,833,646,854,657,875,669,887,664,911,660,930,615,976,581,992,549,1007,456,994,430,999,404,1004,150,991,126,981,102,970,97,964,91,963,85,961,89,960,80,968,71,976,71,971,66,950,61,929,25,867,17,841,9,815,0,720,28,624,60,528,88,426,140,379,173,349,167,330,258,277,282,263,295,246,302,237,316,221,290,195,307,135,314,96,336,27,455,43',
      'w': 1.3,
      'x': (w) => [-w*0.25, W-w],
      'y': (w) => [H-w, H-w]
    }
  ]
  let path = R.idx(paths),
    w = R.num(0.4, path.w) * W,
    x = R.num(...path.x(w)),
    y = R.num(...path.y(w)),
    mask = (gp) => {
      gp.push()
      gp.translate(x, y)
      miniSVG(path.d, gp, w/1000)
      gp.pop()
    }
  mask.w = w
  mask.x = x
  mask.y = y
  F.log('Silhouette', path.name)
  return mask
}

const miniSVG = (info, gp, u=1) => {
  info = info.split(',').map(x => parseInt(x)*u)
  gp.beginShape()
  gp.vertex(info[0], info[1])
  for(let i = 2; i < info.length; i+=6){
    gp.bezierVertex(...info.slice(i, i+6))
  }
  gp.endShape(CLOSE)
}

class Palette{
  constructor(){
    let options = [
      [16, 'B&W', color(100), color(40), color(0)],
      [12, 'Sepia', color(35,55,75), color(35,45,50), color(35,37,5)],
      [10, 'Storm', color(83,8,85), color(69,12,50), color(54,52,7)],
      [15, 'Steel', color(222,7,85), color(222,15,50), color(222,20,6)],
      [10, 'Copper', color(25,44,80), color(151,5,49), color(7,10,17)],
      [8, 'Rust', color(22,45,93), color(45,20,40), color(155,14,8)],
      [15, 'Corrosion', color(64,22,71), color(64,13,61), color(14,52,21)],
      [4, 'Clear', color(39,100,95), color(205,100,55), color(205,100,15)],
      [4, 'Cascade', color(212,85,90), color(219,47,45), color(199,39,10)],
      [4, 'Emerald', color(44,25,83), color(36,8,61), color(214,39,22)],
      [4, 'Red Castle', color(203,67,81), color(11,32,45), color(236,16,19)]
    ]
    let total = options.reduce((t, x) => t += x[0], 0),
      r = R.num(0, total),
      wSum = 0
    for(let i = 0; i < options.length; i++){
      wSum += options[i][0]
      if(r > wSum) continue
      this.colors = options[i]
      F.log('Palette', this.colors[1])
      return
    }
  }
  light = (a=100, l) => this._c(2, a, l)
  mid = (a=100, l) => this._c(3, a, l)
  dark = (a=100, l) => this._c(4, a, l)
  _c = (i, a, l) => {
    let c = this.colors[i],
      light = l ? l : lightness(c)
    return color(hue(c), saturation(c), light, a)
  }
}

let ENV
let P
function setup() {
  angleMode(DEGREES)
  colorMode(HSL, 360,100,100,100)
  P = new Palette()
  ENV = new Composition()
  ENV.render()
  F.save()
}