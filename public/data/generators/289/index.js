const W = Math.min(window.innerWidth, window.innerHeight)
const H = W * 1.35
const U = W / 500

class Random {
    random_dec = () => fxrand()
    random_num = (a, b) => a+(b-a)*this.random_dec()
    random_int = (a, b) => Math.floor(this.random_num(a, b+1))
    random_min = (min, max, i) => {
        const vals = [...Array(i).keys()].map(x => R.random_num(min, max))
        return Math.min(...vals)
    }
    random_max = (min, max, i) => {
        const vals = [...Array(i).keys()].map(x => R.random_num(min, max))
        return Math.max(...vals)
    }
    random_idx = (arr) => arr[this.random_int(0, arr.length-1)]
    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(this.random_dec() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        }
    }
    choose_n = (arr, n) => {
        const options = [...arr]
        if(n >= arr.length) return options
        const choices = []
        while(choices.length < n){
        this.shuffle(options)
        choices.push(options.pop())
        }
        return choices
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
const FEAT = new Features()


class Environment{
    constructor(){
        this.elements = []
        let cnt = Math.floor(R.random_min(1, 5, 2))
        FEAT.log('Stars', cnt)
        for(let i = 0; i < cnt; i++){
        this.elements.push(new Star())
        }
        if(cnt < 4){
        let cnt = Math.floor(R.random_min(0,3,3))
        for(let i = 0; i < cnt; i++){
            this.elements.push(new Nebula())
        }
        }
        R.shuffle(this.elements)
    }

    render(){
        angleMode(DEGREES)
        ellipseMode(RADIUS)
        createCanvas(W, H)
        strokeWeight(1*U)
        background(P.background())
        this.elements.map(e => e.render())
    }
}


class Star{
    constructor(){
        this.x = W/2 - R.random_min(0, 0.5, 3)*W*(R.random_dec()<0.5?1:-1)
        this.y = R.random_num(0.05, 0.95)*H
        this.beams = []
        let cnt = Math.floor(R.random_min(1, 10, 3))
        FEAT.log('Layers', cnt, true)
        for(let i = 0; i < cnt; i++){
        this.beams.push(new Beams(this.x, this.y))
        }
    }

    render(){
        push()
        noFill()
        this.beams.map(b => b.render())
        this._connectedLines()
        pop()
    }

    _connectedLines(){
        stroke(P.fill(3))
        for(let i = 0; i < 10000; i++){
        let c1 = R.random_idx(this.beams)
        let c2 = R.random_idx(this.beams)
        let p1 = c1.getEdge()
        let p2 = c2.getEdge()
        line(p1.x, p1.y, p2.x, p2.y)
        }
    }
}


class Beams{
    constructor(x, y){
        this.x = x
        this.y = y
        this.r = R.random_min(5, 500, 2)*U
    }

    render(){
        const options = [
        this._dots.bind(this),
        this._lines.bind(this),
        this._curves.bind(this),
        this._ellipses.bind(this)
        ]
        const choices = R.choose_n(options, R.random_max(1, options.length, 3))
        push()
        choices.map(c => c())
        pop()
    }

    _ellipses(){
        push()
        const cnt = R.random_int(0, 9)
        const ctx = drawingContext
        for(let i = 0; i < cnt; i++){
        let d0 = R.random_min(1, 10, 2)
        let d1 = R.random_num(5,25)
        ctx.setLineDash([d0*U, d1*U])
        strokeWeight(R.random_min(0.25, 5, 6)*U)
        stroke(P.fill(R.random_num(75, 10)))
        push()
        translate(this.x, this.y)
        const a = R.random_num(0, 360)
        rotate(a)
        ellipse(0, 0, this.r*2, this.r*R.random_dec())
        pop()
        }
        pop()
    }

    _lines(){
        const cnt = R.random_int(50, 1500)
        for(let i = 0; i < cnt; i++){
        strokeWeight(R.random_min(0.25, 2,10)*U)
        stroke(P.fill(R.random_num(1, 20)))
        const a = R.random_num(0, 360)
        const p1 = this._end(a, this.r)
        const p2 = this._end(a, this.r + R.random_num(0, this.r*10))
        line(p1.x, p1.y, p2.x, p2.y)
        }
    }

    _dots(){
        const cnt = R.random_int(25, 80)
        stroke(P.fill(R.random_num(20, 20)))
        for(let i = 0; i < cnt; i++){
        const a = R.random_num(0, 360)
        const p1 = this._end(a, this.r)
        const p2 = this._end(a, this.r + R.random_num(0, this.r*4))
        const len = p1.dist(p2)
        const o = 1 / (len / (R.random_num(10, 25)*U))
        strokeWeight(R.random_num(0.25,3)*U)
        for(let t = 0; t < 1; t+=o){
            let x = lerp(p1.x, p2.x, t)
            let y = lerp(p1.y, p2.y, t)
            point(x, y)
            }
        }
    }

    _curves(){
        const cnt = R.random_int(500, 1000)
        curveTightness(R.random_num(-5,5))
        noFill()
        strokeWeight(R.random_num(0.25, 1)*U)
        stroke(P.fill(R.random_num(5, 10)))
        for(let i = 0; i < cnt; i++){
        const a = R.random_num(0, 360)
        const p1 = this._end(a, this.r)
        const p2 = this._end(a + R.random_num(-90, 90), this.r)
        curve(this.x, this.y, p1.x, p1.y, p2.x, p2.y, this.x, this.y)
        }
    }

    _end = (a, l) => createVector(this.x + cos(a) * l, this.y + sin(a) * l)

    getEdge(){
        const a = R.random_num(0, 360)
        return this._end(a, this.r)
    }
}


class Nebula{
    constructor(){
        FEAT.log('Nebula', 1, true)
        this.points = []
        this.cnt = R.random_num(10000, 50000)

        const y = R.random_num(0, 1)*H
        let x = -200*U
        while(x < W+500*U){
        let o = R.random_num(-50, 50)*U
        this.points.push(createVector(x, y+o))
        x += R.random_num(50, 150)*U
        }
    }
    render(){
        push()
        const c = P.fill()
        for(let i = 0; i < this.cnt; i++){
        const i = R.random_num(0, this.points.length-5)
        const [p0, p1, p2, p3] = this.points.slice(i, i+4)
        const t = R.random_dec()
        const x = curvePoint(p0.x, p1.x, p2.x, p3.x, t)
        const y = curvePoint(p0.y, p1.y, p2.y, p3.y, t)
        strokeWeight(R.random_num(1, 2)*U)
        stroke(hue(c), saturation(c), lightness(c), R.random_min(1,90,3))
        point(x, y + R.random_min(0, 1000, 10)*U * (R.random_dec() < 0.5 ? 1 : -1))
        }
        pop()
    }
}


class Palette{
    constructor(){
        colorMode(HSL,360, 100, 100, 100)
        const colors = R.random_idx([
        ['Flare', color(197,47,3), color(39,86,84), color(6,97,38), color(29,95,57), color(30,95,58)],
        ['Halley', color(201,61,9), color(348,50,90), color(223,50,90), color(220,50,90), color(227,50,90)],
        ['Luna', color(277,25,10), color(41,89,82), color(34,86,73), color(44,93,83), color(44,93,90)],
        ['Glare', color(308,44,10), color(48,90,80), color(48,90,91), color(45,95,70), color(41,90,62)],
        ['Pegasi', color(6,61,6), color(10,57,36), color(11,59,32), color(11,58,39), color(12,56,43), color(23,85,68), color(18,79,62), color(21,85,65), color(21,82,65)],
        ['Ghost', color(207,70,12), color(1,50,80), color(355,25,61), color(353,21,43), color(221,23,49), color(221,50,80), color(1,75,90)],
        ['Eagle', color(100,19,9), color(170,34,14), color(52,90,73), color(78,31,61), color(167,24,54), color(122,19,63), color(55,51,66), color(23,95,26)],
        ['Pillars', color(182,46,12), color(23,95,50), color(36,58,75), color(34,41,57), color(36,74,76), color(34,58,64), color(29,71,50), color(53,16,50)],
        ['Smoke', color(336,25,12), color(187,36,37), color(187,36,60), color(187,90,85), color(11,50,50), color(11,50,75), color(11,90,85), color(7,57,27)],
        ['Corona', color(0,100,0), color(49,73,93), color(52,87,76), color(52,91,56), color(50,92,49), color(40,77,51), color(49,86,50), color(6,97,60)],
        ['Sol', color(358,100,10), color(39,86,84), color(39,100,90), color(6,100,50), color(29,100,57), color(52,91,56)],
        ['Harvest', color(203,69,13), color(0,57,44), color(0,59,46), color(355,54,37), color(358,55,40), color(0,59,60)],
        ['NGC 1569', color(357,38,13), color(20,80,40), color(8,63,37), color(8,100,40), color(10,55,44), color(18,50,57), color(21,100,67), color(6,67,31), color(8,35,43), color(212,44,67), color(210,30,70), color(210,100,40)],
        ['Andromeda', color(221,63,15), color(212,74,29), color(213,58,36), color(223,30,49), color(314,45,75), color(10,45,81), color(243,25,64), color(212,51,53), color(259,40,50)],
        ['Arp 220', color(180,14,20), color(175,25,39), color(14,51,32), color(14,54,27), color(184,35,33), color(166,65,68), color(11,82,67), color(39,84,73), color(39,85,70), color(166,70,70), color(13,85,65)],
        ['Helix1', color(186,42,5), color(352,83,50), color(189,80,57), color(352,100,60), color(189,100,60), color(187,68,43), color(188,55,50)],
        ['Helix2', color(228,52,20), color(301,54,51), color(265,40,49), color(303,83,60), color(286,47,47), color(235,48,75), color(238,47,59), color(45,93,84), color(41,94,80)],
        ['Hyakutake', color(198,64,12), color(212,55,26), color(212,61,25), color(212,61,50), color(176,65,40), color(175,40,49), color(173,31,60), color(175,95,95)],
        ['Pulsar', color(237,76,24), color(198,84,75), color(204,82,62), color(207,82,57), color(198,84,85), color(210,90,53)]

        ])
        FEAT.log('Palette', colors.shift())
        this.colors = colors
    }
    background = () => this.colors[0]
    fill = (alpha=100, s=null, l=null) => {
        const c = R.random_idx(this.colors.slice(1))
        return color(hue(c), s ? s : saturation(c), l ? l : lightness(c), alpha)
    }
}


let ENV
let P
function setup() {
    P = new Palette()
    ENV = new Environment()
    ENV.render()
    FEAT.save()
}