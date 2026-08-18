const W = Math.min(window.innerWidth, window.innerHeight)
const H = W
const U = W / 500

class Random {
    random_dec = () => fxrand()
    random_num = (a, b) => a+(b-a)*this.random_dec()
    random_int = (a, b) => Math.floor(this.random_num(a, b+1))
    random_idx = (arr) => arr[this.random_int(0, arr.length-1)]
}
const R = new Random()

class Environment{
    constructor(){
        const shapeArr = prepShapes()
        this.layers = [
        new Layer(
            [lines(P.shape())],
            [gpShapes(shapeArr)]
        ),
        new Layer(
            [lines(P.outline())],
            [gpOutlineShapes(shapeArr)]
        )
        ]
    }

    render(){
        createCanvas(W, H)
        background(P.background())
        this.layers.map(l => l.render())
    }
}


const lines = (colors, cnt=10000, max=150) => (gp) => {
    gp.background(R.random_idx(colors))
    for(let i = 0; i < cnt; i++){
        let x = R.random_num(0, W)
        let y = R.random_num(0, H)
        let a = R.random_num(0, 360)
        let l = R.random_num(10, max)*U
        gp.stroke(R.random_idx(colors))
        gp.line(x, y, x+cos(a)*l, y+sin(a)*l)
    }
}

class Rect{
    constructor(x, y, w, h){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
    scale = (f) => new Rect(this.x-f, this.y-f, this.w+2*f, this.h+2*f)
    render = (gp) => gp.rect(this.x, this.y, this.w, this.h)
}

class Circle{
    constructor(x, y, d){
        this.x = x
        this.y = y
        this.d = d
    }
    scale = (f) => new Circle(this.x, this.y, this.d+2*f)
    render = (gp) => gp.circle(this.x, this.y, this.d)
}

const prepShapes = () => {
    const shapes = []
    const cnt = R.random_int(5, 50)
    const cutoff = R.random_dec()
    d = (min=10) => R.random_num(5, R.random_num(min, 150))*U
    for(let i = 0; i < cnt; i++){
        const x = R.random_num(0, W)
        const y = R.random_num(0, H)
        const t = R.random_dec()
        if(t < cutoff){
        shapes.push(new Circle(x, y, d()))
        } else {
        shapes.push(new Rect(x, y, d(15), d(15)))
        }
    }
    return shapes
}


const gpShapes = (shapes) => {
    return (gp) => {
        gp.noStroke()
        shapes.map(s => s.render(gp))
    }
}


const gpOutlineShapes = (shapes) => {
    return (gp) => {
        const cnt = Math.min(R.random_int(1, 50), R.random_int(3, 50))
        const w = R.random_num(2,20)*U
        const g = R.random_num(2,15)*U
        let outer = (w + g) * cnt
        let inner = outer - w
        for(let i = 0; i < cnt; i++){
        gp.noErase()
        shapes.map(r => r.scale(outer)).map(r => r.render(gp))
        gp.erase()
        shapes.map(r => r.scale(inner)).map(r => r.render(gp))
        outer -= w + g
        inner -= w + g
        }
    }
}


class Layer{
    constructor(fill=null, mask=null){
        this.fill = fill == null ? [] : fill
        this.mask = mask == null ? [(gp) => gp.rect(0,0, W,H)] : mask
    }

    render = () => image(this.getLayerImage(), 0, 0, W, H)

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
        drawFuncs.map(f => f(gp))
        const img = createImage(W, H)
        img.copy(gp, 0, 0, W, H, 0, 0, W, H)
        return img
    }
}


class Palette{
    constructor(){
      colorMode(HSL, 360, 100, 100, 100)
      this.iOutline = R.random_int(1,2)
      this.iShape = this.iOutline == 1 ? 2 : 1
      this.colors = R.random_idx([
        [color(35,76,85), [color(89,85,32,25), color(96,63,9,25)], [color(33,75,50,45), color(35,76,85,50), color(208,64,57,15)]],
        [color(16,90,91), [color(9,75,30), color(9,72,35), color(10,68,27), color(10,61,64), color(9,47,51), color(8,65,41)], [color(161,78,23), color(164,71,38), color(165,59,60)]],
        [color(30,86,8), [color(48,84,78), color(42,92,59), color(32,85,29), color(33,81,21)], [color(5,80,33, 15), color(2,92,28, 15), color(9,66,47, 15), color(16,97,79, 20)]],
        [color(45,75,95), [color(67,79,32,20), color(60,72,36,20), color(70,80,28,20), color(51,60,47,20), color(70,83,34,20), color(53,67,45,20), color(44,68,54,20)], [color(0,0,99,25), color(111,8,65,25), color(191,26,63,25), color(193,32,74,25)]],
        [color(194,71,11), [color(194,71,21), color(2,55,37), color(5,41,61)], [color(194,71,21), color(194,71,21), color(32,86,48), color(33,87,55), color(41,87,50), color(54,29,56)]],
        [color(0,0,0), [color(0,0,100,18)], [color(0,0,100,5)]],
        [color(17,18,92), [color(214,29,45), color(218,8,41), color(214,31,47), color(214,33,25)], [color(12,64,65), color(31,40,80), color(20,46,79), color(25,77,90)]],
        [color(288,33,3), [color(248,7,21), color(0,3,76), color(240,2,42), color(15,8,60), color(18,20,46)],[color(16,72,22), color(17,75,32), color(20,74,43), color(19,66,45), color(20,87,44), color(15,85,51)]],
        [color(178,45,13), [color(177,33,35), color(176,41,42), color(176,27,50)],[color(176,65,65), color(177,60,51), color(178,62,59), color(177,73,44)]],
        [color(197,15,80), [color(215,23,45), color(214,15,36), color(217,28,52)],[color(37,88,73), color(28,77,65), color(27,68,68), color(27,54,61)]],
        [color(324,29,29), [color(11,40,18), color(25,44,45), color(27,56,57)],[color(48,88,87), color(25,44,45), color(27,56,57)]],
        [color(31,80,85), [color(70,83,34), color(58,84,35), color(45,58,46), color(46,36,71)],[color(46,36,71), color(44,68,54), color(53,67,45)]]
      ])
    }

    background = () => this.colors[0]
    outline = () => this.colors[this.iOutline]
    shape = () => this.colors[this.iShape]
  }

let ENV
let P
function setup() {
    angleMode(DEGREES)
    P = new Palette()
    ENV = new Environment()
    ENV.render()
}