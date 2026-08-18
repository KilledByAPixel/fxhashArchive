const H = window.innerHeight
const W = H / (4/3)
const U = H / 500

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
    this.data = {
    }
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


class Environment{
  constructor(){
    this.curves = []
    const cnt = Math.floor(R.min(3,10,3))
    F.log('Line Count', cnt)
    const options = R.idx([
      [Spiral],
      [Curve],
      [Curve,Curve,Spiral],
      [Curve,Spiral],
      [Curve,Spiral,Spiral,Spiral]
    ])
    const lt = R.dec()
    for(let i = 0; i < cnt; i++){
      const curveType = R.idx(options)
      const peprendicular = R.dec() < 0.8
      this.curves.push(new curveType(peprendicular, lt))
    }

    this.async = R.dec() < 0.5
    F.log('Rendering', this.async ? 'Asynchronous' : 'Synchronous')
  }

  setup(){
    createCanvas(W, H)
    bgGradient(P.mid())
    strokeWeight(1*U)
    stroke(0, 1)
  }

  render(){
    if(this.async){
      this.curves.filter(c => c.iter < c.cnt)[0].render()
    } else {
      this.curves.map(c => c.render())
    }
  }

  renderFinished(){
    return this.curves.filter(c => c.iter < c.cnt).length == 0
  }
}

const bgGradient = (c) => {
  const ctx = drawingContext,
    o = 10*U,
    x = () => R.dec()*W,
    v = () => R.num(-5, 5),
    hsl = (c, l=0) => color(hue(c), saturation(c)+v(), lightness(c)+v()+l),
    grd = ctx.createLinearGradient(x(), 0, x(), H)
  grd.addColorStop(0, hsl(c, R.num(0,15)))
  grd.addColorStop(1, hsl(c, R.num(-15,0)))
  ctx.fillStyle = grd
  ctx.fillRect(-o,-o,W+o,H+o)
}

class Stipple{
  constructor(peprendicular=true, lt){
    this.points = []
    this.cnt = R.num(50000, 250000)
    this.hasLines = R.dec() < 0.6
    const a = R.dec() < 0.5 ? 90 : 270
    const o = R.num(5, 15)
    this.linear = R.dec() < lt
    this.linear ? F.log('Straight Interpolation', 1, true) : F.log('Curved Interpolation', 1, true)
    this.rotation = peprendicular ? () => a : () => R.num(-o, o)
    this.lenFunc = peprendicular || this.linear ? () => R.min(0, 500, 15)*U : () => R.num(0, 50)*U
    this.color = R.idx([P.dark, P.light])
    this.iter = 0
  }

  render(){
    if(this.iter >= this.cnt) return
    push()
    const lineAlpha = R.min(0, 5, 3),
      batch = 500
    this.iter += batch
    for(let i = 0; i < batch; i++){
      const i = R.num(0, this.points.length-5),
        [p0, p1, p2, p3] = this.points.slice(i, i+4),
        [x0, y0, x1, y1] = this._end(p0, p1, p2, p3)
      stroke(P.setAlpha(this.color(), 50))
      point(x1, y1)
      stroke(P.setAlpha(this.color(), lineAlpha))
      if(this.hasLines) line(x0, y0, x1, y1)
    }
    pop()
  }

  _end(p0, p1, p2, p3){
    let t = R.dec(),
      l = this.lenFunc(),
      x,y,tx,ty,a
    if(this.linear){
      x = lerp(p1.x, p2.x, t)
      y = lerp(p1.y, p2.y, t)
      a = p1.angleBetween(p2)
    } else {
      x = curvePoint(p0.x, p1.x, p2.x, p3.x, t)
      y = curvePoint(p0.y, p1.y, p2.y, p3.y, t)
      tx = curveTangent(p0.x, p1.x, p2.x, p3.x, t)
      ty = curveTangent(p0.y, p1.y, p2.y, p3.y, t)
      a = atan2(ty, tx) - this.rotation()
    }
    return [x, y, x+cos(a)*l, y+sin(a)*l]
  }
}

class Curve extends Stipple{
  constructor(peprendicular, lt){
    F.log('Curves', 1, true)
    super(peprendicular, lt)
    const cnt = R.min(8, 50, 10)
    for(let i = 0; i < cnt; i++){
      this.points.push(createVector(R.num(0, W), R.num(0, H)))
    }
  }
}

class Spiral extends Stipple{
  constructor(peprendicular, lt){
    F.log('Spirals', 1, true)
    super(peprendicular, lt)
    const cnt = R.num(10, 50),
      x = R.num(0.1, 0.9)*W,
      y = R.num(0.1, 0.9)*H,
      aStop = R.num(0, 90),
      aIncrement = R.dec() < 0.25 ? () => R.num(10, 90) : () => aStop
    let a = R.num(0, 360),
      l = 1*U,
      lIncrement = R.num(5, 20)
    for(let i = 0; i < cnt; i++){
      this.points.push(createVector(x+cos(a)*l, y+sin(a)*l))
      a += aIncrement()
      l += lIncrement*U
    }
  }
}


class Palette{
  constructor(){
    this.colors = R.idx([
      ['B&W',[color(100)],[color(50)],[color(0)]],
      ['Iridescent',[color(173,65,75), color(38,35,82), color(38,31,77), color(36,29,95), color(36,29,90)],[color(30,15,45)],[color(342,25,48), color(120,3,7), color(120,2,12), color(60,3,18), color(43,6,25)]],
      ['Charcoal',[color(100), color(264,9,97), color(264,9,95), color(264,9,89), color(345,4,79), color(37,6,42)], [color(35,11,70)], [color(60,6,7), color(48,7,13), color(43,6,21), color(36,6,31)]],
      ['Conté',[color(25,50,45), color(27,50,50), color(25,60,44), color(41,40,74), color(39,65,69)],[color(240,33,95)],[color(3,40,15), color(15,45,20), color(20,60,25), color(3,80,19)]],
      ['Sakura',[color(356,24,55), color(0,15,65), color(0,23,75), color(0,50,75)],[color(30,61,95)],[color(345,81,19), color(345,50,12), color(345,100,5)]],
      ['Steel',[color(211,45,50), color(213,25,70), color(214,20,40)],[color(210,20,99)],[color(255,3,24), color(260,50,19), color(228,9,31)]],
      ['Iridescent',[color(173,65,75), color(38,35,82), color(38,31,77), color(36,29,95), color(36,29,90)],[color(30,15,45)],[color(342,25,48), color(120,3,7), color(120,2,12), color(60,3,18), color(43,6,25)]],
      ['Newsprint',[color(300,4,87), color(300,4,97), color(22,15,76)],[color(20,9,65)],[color(216,5,21), color(330,3,40), color(210,42,28)]],
      ['Newsprint',[color(300,4,87), color(300,4,97), color(22,15,76)],[color(20,9,65)],[color(216,5,21), color(330,3,40), color(210,42,28)]]
    ])
    F.log('Palette', this.colors.slice(0)[0])
  }
  light = (alpha=100) => this._c(1, alpha)
  mid = (alpha=100) => this._c(2, alpha)
  dark = (alpha=100) => this._c(3, alpha)
  _c(i, alpha){
    const c = R.idx(this.colors[i])
    return this.setAlpha(c, alpha)
  }
  setAlpha(c, alpha){
    return color(hue(c), saturation(c), lightness(c), alpha)
  }
}

let ENV
let P
function setup() {
  frameRate(120)
  angleMode(DEGREES)
  colorMode(HSL, 360,100,100,100)
  P = new Palette()
  ENV = new Environment()
  ENV.setup()
  F.save()
}

function draw() {
  ENV.render()
  if(ENV.renderFinished()) {
    noLoop()
  }
}