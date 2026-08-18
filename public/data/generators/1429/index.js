/*! For license information please see LICENSE.md */
// Lepidoptera

const D = 500,
  H = Math.max(D, window.innerHeight),
  W = H / (4/3),
  U = H / D
  
class Random {
  dec = () => fxrand()
  num = (a, b) => a+(b-a)*this.dec()
  int = (a, b) => Math.floor(this.num(a, b+1))
  idx = (arr) => arr[this.int(0, arr.length-1)]
  idxW = (arr, weights) => {
    const total = weights.reduce((t, x) => t += x, 0),
      n = this.num(0, total)
    let t = 0
    for(let i = 0; i < weights.length; i++){
      t += weights[i]
      if(n <= t){
        let index = Math.min(arr.length-1, i)
        return arr[index]
      }
    }
  }
  max = (min, max, i) => {
    const vals = [...Array(i).keys()].map(x => R.num(min, max))
    return Math.max(...vals)
  }
  min = (min, max, i) => {
    const vals = [...Array(i).keys()].map(x => R.num(min, max))
    return Math.min(...vals)
  }
  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.dec() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
}
const R = new Random()

class Fe{
  constructor(){
    this.d = {
    }
  }

  l(t, d, a=false){
    if(t in this.d && a){
      this.d[t] += d
      return
    }
    this.d[t] = d
  }

  s(){
    window.$fxhashFeatures = this.d
  }
}
const F = new Fe()

class Environment{
  constructor(){
    this.base = generateBaseImage()
    this.stippler = new Stippler(this.base)
  }

  render(){
    image(this.base, 0,0,W,H)
    this.stippler.stipple()
  }
}

class Stippler{
  constructor(base){
    this.base = base
    this.cnt = R.min(20000, 80000, 2)
    this.offset = R.min(0, 20, 7)
    F.l('Noise Offset', Math.round(this.offset))
    F.l('Noise', this.cnt < 40000 ? 'Low' : this.cnt < 60000 ? 'Medium' : 'High')
  }

  stipple(){
    for(let i = 0; i < this.cnt; i++){
      strokeWeight(R.min(1,2,10)*U)
      let x = Math.round(R.dec()*W),
        y = Math.round(R.dec()*H),
        c = this._colorLookup(x, y)
      stroke(c)
      point(x, y)
    }
  }

  _colorLookup(x, y){
    colorMode(RGB, 255)
    const n = () => R.num(-this.offset, this.offset)*U,
      [r,g,b] = this.base.get(x+n(), y+n()),
      v = (n) => R.num(-n, n),
      c = color(r,g,b)
    colorMode(HSL, 360,100,100,100)
    return color(hue(c)+v(5), saturation(c)+v(5), lightness(c)+v(5))
  }
}


const generateBaseImage = () => {
  const gp = createGraphics(W, H),
    hash = [],
    cnt = 10000
  gp.colorMode(HSL, 360,100,100,100)
  gp.strokeWeight(1*U)
  gp.background(P.background())
  for(let i = 0; i < cnt; i++){
    const h = new Hash(),
      d = R.num(1,10)
    if(hash.filter(e => e.collision(h, d)).length > 0) continue
    hash.push(h)
  }
  hash.map(h => h.render(gp))
  F.l('Medium Hatching', hash.reduce((t, h) => t += h.r > 80 && h.r <= 125 ? 1 : 0, 0))
  F.l('Large Hatching', hash.reduce((t, h) => t += h.r > 125 ? 1 : 0, 0))
  return gp
}

class Hash{
  constructor(){
    const max = 250,
      r = R.min(1,max,3)*U,
      len = () => r * R.num(0.8, 1.5),
      w = () => R.num(0.01, 0.1)*r,
      t = map(r, 1, max*U, 0, 1)

    this.r = r
    this.loc = createVector(R.dec()*W, R.dec()*H)
    this.rotation = R.num(0, 360)

    this.curves = []
    let x = -r
    while(x < r){
      this.curves.push(new Curve(x,len(), x,-len(), w(), t))
      x += r / R.num(4,11)
    }
  }

  render(gp){
    gp.push()
    gp.translate(this.loc.x, this.loc.y)
    gp.rotate(this.rotation)
    this.curves.map(c => c.render(gp))
    gp.pop()
  }

  collision(h, d){
    return this.loc.dist(h.loc) < (h.r + this.r) - d*U
  }
}

class Curve{
  constructor(x0, y0, x1, y1, weight, t){
    this.endpoints = [x0, y0, x1, y1]
    const vect = (s) => createVector(x0 + (R.num(1,2)*U * s), lerp(y0, y1, R.dec()))
    this.midpoints = [vect(), vect(-1)]
    this.weight = weight
    this.color = P.fill(t)
  }

  render(gp){
    const [x0, y0, x1, y1] = this.endpoints,
      [m0, m1] = this.midpoints,
      c = (x, y) => gp.curveVertex(x, y),
      p0 = () => c(x0, y0),
      p1 = () => c(x1, y1)
    gp.fill(this.color)
    gp.strokeWeight(this.weight)
    gp.beginShape()
    p0(); p0()
    c(m0.x, m0.y)
    p1()
    c(m1.x, m1.y)
    p0(); p0()
    gp.endShape(CLOSE)
    }
}

class Palette{
  constructor(){
    const colors = R.idx([
      ['0',color(32,94,49), color(23,80,35), color(37,94,57), color(38,94,51), color(33,89,54), color(26,94,48), color(27,28,77), color(19,9,57)],
      ['1',color(15,22,15), color(124,9,64), color(74,8,44), color(350,58,50), color(13,79,51), color(167,41,66), color(63,66,42)],
      ['2',color(250,18,56), color(8,60,51), color(25,87,55), color(88,17,83)],
      ['3',color(158,14,35), color(47,60,81), color(184,30,45), color(45,49,68), color(35,29,47), color(27,89,50)],
      ['4',color(48,11,82), color(11,82,19), color(15,82,30), color(20,74,41), color(14,88,29), color(27,93,43), color(43,75,64)],
      ['5',color(51,44,87), color(49,23,71), color(51,31,80), color(50,25,66), color(10,63,18), color(39,15,36), color(359,69,32), color(354,84,43)],
      ['6',color(34,74,94), color(39,90,61), color(7,93,43), color(167,41,66), color(32,37,77), color(14,88,57), color(167,21,62)],
      ['7',color(170,16,51), color(167,21,62), color(191,18,29), color(165,27,72), color(162,49,86), color(43,73,54), color(47,72,61), color(29,69,51)],
      ['8',color(46,58,80), color(47,37,69), color(45,77,78), color(249,12,23), color(26,81,45)],
      ['9',color(11,50,87), color(4,12,73), color(225,3,52), color(212,82,40), color(202,94,47), color(223,61,75)],
      ['10',color(30,26,35), color(103,40,54), color(14,78,48), color(103,40,54), color(14,78,48)],
      ['11',color(26,22,33), color(219,38,29), color(222,25,21), color(189,27,80), color(31,96,45)]
    ])
    this.colors = colors.slice(1, colors.length)
    R.shuffle(this.colors)
    F.l('Palette', colors.slice(0)[0])
  }
  fill(t=1){
    const f = 1 / this.colors.length,
      i = Math.floor(t * (this.colors.length - 1)),
      w = this.colors.map((c, id) => i == id ? f * R.max(10,50,3) : f),
      c = R.idxW(this.colors, w),
      r = (n) => R.num(-n, n)
    return color(hue(c)+r(10), saturation(c)+r(10), lightness(c)+r(5))
  }
  background(){
    const c = this.colors.pop()
    return color(hue(c), saturation(c)-10, lightness(c)+R.num(-20,20))
  }
}

let ENV
let P
function setup() {
  angleMode(DEGREES)
  colorMode(HSL, 360,100,100,100)
  createCanvas(W, H)
  P = new Palette()
  ENV = new Environment()
  ENV.render()
  F.s()
}