const DIM = Math.min(window.innerWidth, window.innerHeight)
const W = DIM / 1.25
const H = DIM
const U = DIM / 500
  
class Random {
    random_dec = () => fxrand()
    random_num = (a, b) => a+(b-a)*this.random_dec()
    random_int = (a, b) => Math.floor(this.random_num(a, b+1))
    random_idx = (arr) => arr[this.random_int(0, arr.length-1)]
}
const R = new Random()


const yMIN = H * 0.33
const yMAX = H * 0.95
const hasMoon = R.random_dec() < 0.6
class Environment{
constructor(){
    const forceMap = getForceMap()
    this.topo = new Topo(forceMap)
    this.grass = new Grass(forceMap)
    this.forest = new Forest(forceMap)
    this.sky = new Sky()
    this.moon = new Moon()
}

render(){
    strokeWeight(1*U)
    this.sky.render()
    if(hasMoon) this.moon.render()
    this.topo.render()
    this.grass.render()
    this.forest.render()
}
}

class Moon{
render(){
    push()
    let x = R.random_num(0, W)
    let y = R.random_num(10*U, yMIN-10*U)
    let gp = createGraphics(W, H)
    gp.strokeWeight(1*U)
    gp.background(P.moonBk())
    gp.stroke(P.moon())
    gp.noFill()
    for(let i = 0; i < 10000; i++){
    let x = R.random_num(0, W)
    let y = R.random_num(0, H)
    let a = R.random_num(0, 360)
    let l = R.random_num(2, 15)*U
    gp.line(x,y, x+cos(a)*l, y+sin(a)*l)
    gp.circle(x,y, R.random_num(2,15)*U)
    }
    const fill = createImage(W, H)
    fill.copy(gp, 0,0,W,H, 0,0,W,H)

    gp = createGraphics(W, H)
    gp.circle(x, y, R.random_num(25, 150)*U)
    const mask = createImage(W, H)
    mask.copy(gp, 0,0,W,H, 0,0,W,H)
    fill.mask(mask)
    image(fill, 0,0,W,H)
    pop()
}
}

class Sky{
render(){
    push()
    const grd = drawingContext.createLinearGradient(0,0, 0,yMIN)
    grd.addColorStop(0, P.sky())
    grd.addColorStop(1, P.background())
    drawingContext.fillStyle = grd
    const o = 10*U
    rect(-o,-o, W+o,H+o)
    pop()
}
}

class Grass{
constructor(forceMap){
    this.forceMap = forceMap
}
render(){
    push()
    stroke(P.grass())
    const groveCnt = Math.min(R.random_int(1, 25), R.random_int(1, 25))
    for(let i = 0; i < groveCnt; i++){
    const treeCnt = R.random_int(1000, 5000)
    const x = R.random_num(0, W)
    const y = R.random_num(yMIN / 2, yMAX)
    for(let t = 0; t < treeCnt; t++){
        const r = R.random_num(0, 150)*U
        const a = R.random_num(0, 360)
        let loc = createVector(x+cos(a)*r, y+sin(a)*r)
        if(loc.y < yMIN || loc.y > yMAX) continue
        loc = this.forceMap(loc)
        strokeWeight(R.random_num(1, 5)*U)
        point(loc.x, loc.y)
    }
    }
    pop()
}
}

class Forest{
constructor(forceMap){
    this.trees = []
    const groveCnt = R.random_int(1, 50)
    for(let i = 0; i < groveCnt; i++){
    const treeCnt = R.random_int(10, 50)
    const x = R.random_num(0, W)
    const y = R.random_num(yMIN, yMAX)
    for(let t = 0; t < treeCnt; t++){
        const a = R.random_num(0, 360)
        const r = R.random_num(25, 100)*U
        const loc = createVector(x+cos(a)*r, y+sin(a)*r)
        if(loc.y < yMIN || loc.y > yMAX) continue
        this.trees.push(new Tree(forceMap(loc)))
    }
    }
}
render(){
        this.trees.map(t => t.render())
    }
}

class Tree{
    constructor(loc){
        this.loc = loc
    }
    render(){
        const l = R.random_num(10, 50)*U
        const cnt = R.random_num(20, 50)
        for(let i = 0; i < cnt; i++){
        let y = R.random_num(this.loc.y, this.loc.y-l)
        let w = map(y, this.loc.y, this.loc.y - l, R.random_num(7, 2)*U, 0.5*U)
        
        stroke(P.tree())
        line(this.loc.x - w, y, this.loc.x, y)
        stroke(P.tree(15))
        line(this.loc.x, y, this.loc.x + w, y)
        }
    }
}

class Topo{
    constructor(forceMap){
        let countour = new Contour()
        this.contours = []
        let y = yMIN
        while(y < yMAX){
        this.contours.push(countour.shift(y, forceMap))
        y += R.random_num(1,3)*U
        }
    }

    render(){
        this._addGround()
        this.contours.map(c => c.render())
    }

    _addGround(){
        const topPoints = [...this.contours[0].points]
        let gp = createGraphics(W, H)
        gp.strokeWeight(1*U)
        gp.background(P.ground())
        gp.stroke(255,10)
        gp.noFill()
        for(let i = 0; i < 7000; i++){
        let x = R.random_num(0, W)
        let y = R.random_num(0, H)
        let a = R.random_num(0, 360)
        let l = R.random_num(10, 150)*U
        gp.line(x,y, x+cos(a)*l, y+sin(a)*l)
        gp.circle(x,y, R.random_num(2,15)*U)
        }
        const fill = createImage(W, H)
        fill.copy(gp, 0,0,W,H, 0,0,W,H)

        gp = createGraphics(W, H)
        gp.beginShape()
        gp.vertex(0,H)
        gp.vertex(0,H)
        topPoints.map(p => gp.curveVertex(p.x, p.y))
        gp.vertex(W,H)
        gp.vertex(W,H)
        gp.endShape()
        const mask = createImage(W, H)
        mask.copy(gp, 0,0,W,H, 0,0,W,H)
        fill.mask(mask)
        image(fill, 0,0,W,H)
    }
}

class Contour{
    constructor(points){
        this.points = points == null ? this._initPoints() : points
    }

    _initPoints(){
        let points = []
        let x = -50*U
        while(x < W+50*U){
        points.push(createVector(x, 0))
        x += 5*U
        }
        return points
    }

    shift(y, forceMap){
        let points = this.points.map(p => createVector(p.x, p.y + y))
        points = points.map(p => forceMap(p))
        return new Contour(points)
    }

    render(){
        push()
        noFill()
        stroke(P.topo())
        const d0 = R.random_num(1, 50)*U
        const d1 = R.random_num(1, 5)*U
        drawingContext.setLineDash([d0, d1])
        beginShape()
        vertex(0,H)
        vertex(0,H)
        this.points.map(p => curveVertex(p.x, p.y))
        vertex(W,H)
        vertex(W,H)
        endShape()
        pop()
    }
}


const maxForce = R.random_num(0.1, 0.20)
const hills = R.random_int(25, 150)
const hillFeature = () => {
    if(hills == 25) return '25'
    if(hills < 50) return '<50'
    if(hills < 100) return '<100'
    if(hills < 150) return '<150'
    if(hills == 150) return '150'
    return 'na'
}
class Force{
    constructor(){
        this.loc = createVector(R.random_num(0, W), R.random_num(0, H))
        this.r = R.random_num(H*0.05, maxForce*H)
        this.f = this.r * R.random_dec()
    }
    apply(v){
        const dist = this.loc.dist(v)
        if(dist > this.r) return v
        const f = map(dist / this.r, 0, 1, this.f, 0)
        return createVector(v.x, v.y - f)
    }
    }
    const getForceMap = () => {
    let forces = []
    for(let i = 0; i < hills; i++){
        forces.push(new Force())
    }
    return (point) => {
        forces.forEach(f => {
        point = f.apply(point)
        })
        return point
    }
}


class Palette{
    constructor(){
        this.colors = R.random_idx([
        [color(19,24,65), color(72,8,20), color(46,30,46), color(86,9,32), color(195,27,25), color(201,34,35), color(45,54,86), color(21,9,70), 'Wikiup'],
        [color(0,66,62), color(348,43,24), color(24,96,80), color(46,25,35), color(300,40,67), color(320,40,65), color(35,100,90), color(35,65,75), 'Bryce'],
        [color(71,16,75), color(212,25,20), color(77,37,46), color(78,30,39), color(211,80,63), color(211,82,75), color(200,75,85), color(210,65,69), 'Timp'],
        [color(51,33,28), color(80,4,16), color(60,14,8), color(44,25,10), color(240,19,45), color(239,29,65), color(280,31,94), color(259,35,78), 'Deadman'],
        [color(226,46,89), color(218,31,34), color(224,37,79), color(229,12,19), color(222,30,66), color(221,29,90), color(226,46,89), color(224,37,79), 'First Snow'],
        [color(28,29,75), color(33,31,24), color(24,69,50), color(63,18,39), color(207,58,80), color(208,44,95), color(210,74,85), color(207,58,90), 'October'],
        [color(35,30,50), color(48,13,15), color(33,62,68), color(40,48,6), color(206,44,55), color(206,44,70), color(210,9,85), color(210,9,90), 'Dry Creek'],
        [color(22,65,53), color(60,28,16), color(0,83,65), color(48,75,10), color(214,26,74), color(270,2,83), color(214,26,85), color(214,26,95), 'September'],
        [color(72,24,49), color(120,8,25), color(72,24,49), color(180,18,7), color(28,89,82), color(18,85,76), color(23,85,80), color(28,89,90), 'Dryfarm'],
        [color(217,36,45), color(226,26,26), color(227,33,19), color(227,33,19), color(325,31,60), color(321,31,50), color(19,52,85), color(19,52,78), 'Redtop']
        ])
    }
    _hsl = (i, offset=0, alpha=100, l=null) => {
        const c = this.colors[i]
        const o = R.random_num(-offset, offset)
        l = l == null ? lightness(c) : l
        return color(hue(c) + o, saturation(c) + o, l, alpha)
    }
    topo = () => this._hsl(0, 20, 75)
    ground = () => this._hsl(1, 10)
    grass = () => this._hsl(2, 5, 15)
    tree = (l) => this._hsl(3, 15, 55, l)
    sky = () => this._hsl(4)
    background = () => this._hsl(5)
    moon = () => this._hsl(6, 5, 25)
    moonBk = () => this._hsl(7, 5)
}

let ENV
let P
function setup() {
    createCanvas(W, H)
    colorMode(HSL, 360,100,100, 100)
    P = new Palette()
    background(P.background())
    angleMode(DEGREES)
    ENV = new Environment()
    ENV.render()
    
    window.$fxhashFeatures = {
        'Palette': P.colors.slice(-1)[0],
        'Moon': hasMoon,
        'Hills': hillFeature()
    }
}
