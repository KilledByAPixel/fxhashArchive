// Kunza

const SCALE = 0.98,
  H = 500,
  W = 375,
  U = Math.max(1, window.innerHeight * SCALE / H),
  HU = H*U,
  WU = W*U

class Random {
  constructor() {
    this._gaussian_previous = false
    this._y2 = 0
  }
  dec = () => fxrand()
  num = (a, b) => a+(b-a)*this.dec()
  int = (a, b) => Math.floor(this.num(a, b+1))
  idx = (arr) => arr[this.int(0, arr.length-1)]
  max = (min, max, i) => {
    const vals = [...Array(i).keys()].map(x => R.num(min, max))
    return Math.max(...vals)
  }
  min = (min, max, i) => {
    const vals = [...Array(i).keys()].map(x => R.num(min, max))
    return Math.min(...vals)
  }
  norm = (mean, sd=1) => {
    let y1, x1, x2, w
    if (this._gaussian_previous) {
      y1 = this._y2
      this._gaussian_previous = false
    } else {
      do {
        x1 = this.num(-1,1)
        x2 = this.num(-1,1)
        w = x1 * x1 + x2 * x2
      } while (w >= 1)
      w = Math.sqrt(-2 * Math.log(w) / w)
      y1 = x1 * w
      this._y2 = x2 * w
      this._gaussian_previous = true
    }
    const m = mean || 0
    return y1 * sd + m
  }
}
const R = new Random()

class Features{
  constructor(){
    const now = new Date(),
      arr = [now.getFullYear(), (now.getMonth() + 1), now.getDate(), ' - ', now.getHours(), now.getMinutes(), now.getSeconds(), String(now.getMilliseconds()).padStart(4, '0')]
    this.dt = arr.reduce((s, x) => s + String(x).padStart(2, '0'), '')
    this.data = {}
  }
  log = (tag, data, add=false) => tag in this.data && add ? this.data[tag] += data : this.data[tag] = data
  save = () => window.$fxhashFeatures = this.data
  saveImg = () => saveCanvas(this.dt + '.png')
}
const F = new Features()

class Settings{
  constructor() {
    let space = () => R.min(1, 10, 4),
      s = space()
    this.lineSpacing = R.dec() < 0.5 ? () => s : space
    this.offshootAngleThreshold = R.num(0.5, 1)
    this.lineWobble = Math.max(0, R.norm(3, 1))
    this.renderBaseLines = R.dec() < 0.9
  }
  setErasedChars(erase){
    this.erasedChars = erase
    this.bleedAngle = R.idx([90, 270])
    this.bleedMagnitude = this.erasedChars ? ()=>R.num(7,20) : ()=>R.min(3, 20, 2)
    this.watercolorLayers = this.erasedChars ? ()=>R.int(20,50) : (d)=>d < 25 ? R.min(0,10,4) : R.min(15,50,2)
  }
}
const SET = new Settings

class Environment{
  constructor(){
    const initOptions = [
        layoutSpiral,
        layoutRadial,
        layoutPolygon,
        layoutSpiralTriangles
      ],
      themes = [
        ThemePainted,
        ThemeEtched,
        ThemeWoven
      ]
    let t = R.idx(themes)
    this.theme = new t(R.idx(initOptions))
  }
  render(){
    this.theme.render()
  }
  draw(){
    return this.theme.draw()
  }
  toggle(keyCode){
    this.theme.toggle(keyCode)
  }
}

class Theme{
  constructor(initLines){
    this.gpRuins = makeGp()
    this.gpBk = makeGp()
    this.gpWeave = makeGp()

    this.lines = []
    initLines(this.lines)
    this.lines = this.lines.filter(l => lineOnCanvas(l)).map(l => cropLine(l))
    this.linesCopy = [...this.lines]
    this.chars = buildCharacterLayout()
    this.offshoots = []
    
    SET.lineColor = P.detail.bind(P)
  }
  render(){
    background(P.background())
    let gB = this.gpBk
    gB.push()
    gB.noStroke()
    this.lines.map(l => {
      gB.fill(P.base())
      watercolorLine(gB, l.p0, l.p1)
    })
    gB.pop()
    this._render()
  }
  draw(){
    background(P.background())
    let line = this.linesCopy.shift(),
      shoots = line.initOffshoots(this.lines, this.offshoots)
    shoots = shoots.filter(l => lineOnCanvas(l))
    this._draw(line, shoots)
    return this.linesCopy.length > 0
  }
}

class ThemePainted extends Theme{
  constructor(initLines){
    super(initLines)
    SET.setErasedChars(false)
    F.log('Symbol Type', 'Painted')
    this.rune = true
    this.color = true
    this.weave = true
  }
  _render(){
    let gB = this.gpBk,
      gR = this.gpRuins,
      gW = this.gpWeave
    renderCharacters(gR, this.chars)
    deteriorate(gR, R.int(1000, 10000))
    this.gpRuins = gR
    applyImg([gW, gB, gR])
  }
  _draw(line, shoots){
    let gW = this.gpWeave,
      gB = this.gpBk,
      gR = this.gpRuins
    if(SET.renderBaseLines) line.render(gW)
    if(shoots.length > 0) shoots.map(o => o.render(gW))
    applyImg([gW, gB, gR])
  }
  toggle(keyCode){
    if(! keyCode in [87,82,67]) return
    if(keyCode === 87) this.weave = !this.weave
    if(keyCode === 82) this.rune = !this.rune
    if(keyCode === 67) this.color = !this.color
    let imgs = []
    if(this.weave) imgs.push(this.gpWeave)
    if(this.color) imgs.push(this.gpBk)
    if(this.rune) imgs.push(this.gpRuins)
    background(P.background())
    applyImg(imgs)
  }
}
class ThemeEtched extends Theme{
  constructor(initLines){
    super(initLines)
    SET.setErasedChars(true)
    F.log('Symbol Type', 'Etched')
    this.rune = true
    this.color = true
    this.weave = true
    this.gpRuneWeave = makeGp()
  }
  _render(){
    let gW = this.gpWeave,
      gB = this.gpBk,
      gRB = this.gpRuins,
      gRW = this.gpRuneWeave,
      o = 2*U
    gRB.fill(0)
    gRB.rect(-o,-o,WU+o,HU+o)
    gRB.erase()
    renderCharacters(gRB, this.chars)

    gRW.copy(gRB, 0,0,WU,HU, 0,0,WU,HU)
    deteriorate(gRW, R.max(1000, 5000, 3), false)

    applyImg([maskImg(gB, gRB), maskImg(gW, gRW)])
  }
  _draw(line, shoots){
    let gW = this.gpWeave,
      gB = this.gpBk,
      gRB = this.gpRuins,
      gRW = this.gpRuneWeave
    if(SET.renderBaseLines) line.render(gW)
    if(shoots.length > 0) shoots.map(o => o.render(gW))
    applyImg([maskImg(gB, gRB), maskImg(gW, gRW)])
  }
  toggle(keyCode){
    if(! keyCode in [87,82,67]) return
    let gW = this.gpWeave,
      gB = this.gpBk,
      gRB = this.gpRuins,
      gRW = this.gpRuneWeave
    if(keyCode === 87) this.weave = !this.weave
    if(keyCode === 82) this.rune = !this.rune
    if(keyCode === 67) this.color = !this.color
    let imgs = []
    if(this.color){
      imgs.push(this.rune ? maskImg(gB, gRB) : gB)
    }
    if(this.weave){
      imgs.push(this.rune ? maskImg(gW, gRW) : gW)
    }
    background(P.background())
    applyImg(imgs)
  }
}
class ThemeWoven extends Theme{
  constructor(initLines){
    super(initLines)
    SET.setErasedChars(false)
    SET.lineColor = this.colorLookup.bind(this)
    SET.lineSpacing = () => 1
    F.log('Symbol Type', 'Woven')
    this.rune = true
    this.color = true
    this.weave = true
    this.gpRuneMask = makeGp()
    this.gpRuneLight = makeGp()
  }
  _render(){
    background(P.background())
    let gRM = this.gpRuneMask,
      gRL = this.gpRuneLight,
      gRLM = makeGp(),
      o = 4*U,
      c = P.highlight()
    gRM.fill(0)
    gRM.rect(-o,-o,WU+o*2,HU+o*2)
    gRM.erase()
    renderCharacters(gRM, this.chars)

    gRL.background(color(hue(c), saturation(c), lightness(c), 42))
    renderCharacters(gRLM, this.chars)
    gRL = maskImg(gRL, gRLM)
    this.gpRuneLight = gRL
    
    let gR = this.gpRuins
    gR.fill(P.detail())
    gR.rect(-o,-o,WU+o*2,HU+o*2)
    renderCharacters(gR, this.chars)

    applyImg([maskImg(this.gpBk, gRM), gRL])
  }
  _draw(line, shoots){
    let gW = this.gpWeave
    if(SET.renderBaseLines) line.render(gW)
    if(shoots.length > 0) shoots.map(o => o.render(gW))
    applyImg([maskImg(this.gpBk, this.gpRuneMask), this.gpRuneLight, gW])
  }
  colorLookup(x, y){
    colorMode(RGB, 255)
    const [r,g,b] = this.gpRuins.get(x, y),
    c = color(r,g,b)
    colorMode(HSL, 360,100,100,100)
    return color(hue(c), saturation(c), lightness(c)-R.num(0,10))
  }
  toggle(keyCode){
    if(! keyCode in [87,82,67]) return
    let gW = this.gpWeave,
      gB = this.gpBk,
      gRM = this.gpRuneMask,
      gRL = this.gpRuneLight
    if(keyCode === 87) this.weave = !this.weave
    if(keyCode === 82) this.rune = !this.rune
    if(keyCode === 67) this.color = !this.color
    let imgs = []
    if(this.color){
      imgs.push(this.rune ? maskImg(gB, gRM) : gB)
    }
    if(this.rune) imgs.push(gRL)
    if(this.weave) imgs.push(gW)
    background(P.background())
    applyImg(imgs)
  }
}

const makeGp = () => {
  let gp = createGraphics(WU,HU)
  gp.strokeWeight(1*U)
  gp.colorMode(HSL, 360,100,100,100)
  return gp
}
const applyImg = (imgArr) => {
  let i = (g) => image(g, 0,0,WU,HU)
  imgArr.map(g => i(g))
}
const maskImg = (base, mask) => {
  let c = (img) => {
      let i = createImage(WU,HU)
      i.copy(img, 0,0,WU,HU, 0,0,WU,HU)
      return i
    },
    b = c(base),
    m = c(mask)
  b.mask(m)
  return b
}
const deteriorate = (gp, cnt, erase=true) => {
  gp.push()
  erase ? gp.erase() : gp.noErase()
  let n = R.num(0, 360),
    ang = () => n + R.num(-5, 5),
    len = () => R.num(5, 50)*U,
    w = () => R.num(0.5, 2)*U,
    t = R.num(0.1, 0.9)
  for(let i = 0; i < cnt; i++){
    let x = R.dec()*WU,
      y = R.dec()*HU,
      l = len(),
      a = ang()
    gp.strokeWeight(w())
    R.dec() < t ? gp.point(x, y) : gp.line(x, y, x+cos(a)*l, y+sin(a)*l)
  }
  gp.pop()
}


const layoutSpiral = (lines) => {
  F.log('Design', 'Spiral')
  let f = R.num(1.01, 1.25),
    multCnt = map(f, 1, 1.2, 60, 20),
    randL = R.num(6,15),
    loop = R.idx([
      [45,15],
      [60,30],
      [80,10],
      [5,5,5,60,5,5,5],
      [30,60,30]
    ]),
    lens = [...Array(loop.length-1).keys()].map(x => 0),
    options = [
      [addSpiralPoints(R.num(5, 10), R.num(100, 110)), R.int(35,45)],
      [addSpiralPoints(R.num(2, 10), R.num(15, 175)), R.int(35,70)],
      [multSpiralPoints(R.num(1,10), R.num(30,170), f), multCnt],
      [multSpiralPoints(R.num(1,10), R.num(85,95), f), multCnt+5],
      [spiralPointsFactory(
        loopingSequence([...lens,randL]),
        loopingSequence(loop),
      ), R.int(300, 300)]
    ],
    center = createVector(R.norm(W/2, 20), R.norm(H/2, 40)),
    [func, cnt] = R.idx(options),
    points = func(center, cnt)
  for(let i = 0; i < points.length - 1; i++){
    let [p1, p2] = points.slice(i, i+2)
    lines.push(new Line(p1, p2))
  }
}
const layoutRadial = (lines) => {
  F.log('Design', 'Radial')
  const center = createVector(W/2, H/2),
    cnt = R.num(50, 150),
    minLen = 15,
    maxLen = 250,
    minOffset = 15,
    maxOffset = 60,
    addFilter = R.dec() < 0.5

  for(let i = 0; i < cnt; i++){
    let len = R.num(minLen, maxLen),
      a1 = R.num(0, 360),
      a2 = a1 + R.num(minOffset, maxOffset),
      p1 = lineEnd(center.x, center.y, a1, len),
      p2 = lineEnd(center.x, center.y, a2, len),
      line = new Line(p1, p2)
    if(lines.filter(l => lineLineCollision(l.p0, l.p1, p1, p2)).length > 0 && addFilter) continue
    lines.push(line)
  }
}
const layoutPolygon = (lines) => {
  F.log('Design', 'Polygon')
  R.idx([
    regularPolygonLines(R.int(3, 12)),
    regularPolygonLines(R.int(20, 50)),
    irregularPolygonLines()
  ])(lines)
}
const polygonLineFactory = (ainc, len, lenInc, cnt) => (lines) => {
  let center = createVector(R.num(0.2, 0.8)*W, R.num(0.2, 0.8)*H),
    a = 0,
    angles = [a],
    lens = [len()]
  while(true){
    a += ainc()
    angles.push(a)
    lens.push(len())
    if(a >= 360) break
  }

  for(let c = 0; c < cnt; c++){
    let lenOffset = lenInc(),
      ps = lineEnd(center.x, center.y, angles[0], lens[0] + lenOffset * c),
      p1 = ps.copy(),
      p2
    for(let i = 0; i < angles.length-1; i++){
      p2 = lineEnd(center.x, center.y, angles[i], lens[i] + lenOffset * c)
      lines.push(new Line(p1, p2))
      p1 = p2
    }
    lines.push(new Line(p2, ps))
  }
}
const regularPolygonLines = (sides) => {
  let ainc = () => 360 / sides,
    l = R.min(10, W/2, 2),
    len = () => l,
    i = () => R.num(15, 50),
    lInc = i(),
    lenInc = R.dec() < 0.3 ? () => lInc : i,
    cnt = R.int(7, 12)
  return polygonLineFactory(ainc, len, lenInc, cnt)
}
const irregularPolygonLines = () => {
  let ang1 = () => R.num(10, 30),
    ang2 = () => R.num(25, 110),
    angles = R.dec() < 0.1 ? ang1 : ang2,
    a = angles(),
    ainc = R.dec() < 0.25 ? () => a : angles,
    len = () => R.num(25, 250),
    lenInc = () => R.num(15, 50)
    cnt = R.int(7, 12)
  return polygonLineFactory(ainc, len, lenInc, cnt)
}

const layoutSpiralTriangles = (lines) => {
  F.log('Design', 'Triangles')
  let center = createVector(R.norm(W/2, 20), R.norm(H/2, 40)),
    cnt = 50,
    points = addSpiralPoints(R.num(5, 10), R.idx([45, 45, 15, 60, 90]))(center, cnt),
    w = R.num(50, 300),
    d = 0.25
  points.map(p => lines.push(...triangleLines(p, center, w, d)))
}
const triangleLines = (point, center, w, d) => {
  let c0 = lineOffshoot(point, center, 0, 90, w).p1,
    c1 = lineOffshoot(point, center, 0, 270, w).p0,
    c2 = p5.Vector.lerp(point, center, d)
  return [
    new Line(c0, c1),
    new Line(c1, c2),
    new Line(c2, c0)
  ]
}


const spiralPointsFactory = (lInc, aInc) => (center, cnt=100) => {
  let len = lInc(),
    ang = 0,
    p = [center]
  for(let i = 0; i < cnt; i++){
    p.push(createVector(center.x+cos(ang)*len, center.y+sin(ang)*len))
    len += lInc()
    ang += aInc()
  }
  return p
}
const addSpiralPoints = (l, a) => spiralPointsFactory(()=>l, ()=>a)
const multSpiralPoints = (l, a, f) => {
  let len = l,
    lInc = () => len *= f
  return spiralPointsFactory(lInc, ()=>a)
}

const loopingSequence = (arr) => {
  let a = [...arr],
    i = 0,
    f = () => {
      let e = a[i]
      i++
      i = i % a.length
      return e
    }
  f.reset = () => i = 0
  return f
}
const randSequence = (arr) => {
  let f = () => R.idx(arr)
  f.reset = () => null
  return f
}
const nonSequenceRuins = () => {
  let f = () => RUINS.getW()
  f.reset = () => null
  return f
}
const randArr = (n, r) => [...Array(n).keys()].map(x => r())

const renderCharacters = (gp, charLayout, a=100) => {
  gp.push()
  gp.noFill()
  let c = P.highlight()
  gp.stroke(color(hue(c), saturation(c), lightness(c), a))
  charLayout.map(c => c.render(gp))
  gp.pop()
}
const buildCharacterLayout = () => {
  let layout = R.idx([
      charBlock,
      charColumn,
      charRow
    ]),
    ruins = RUINS.get(R.min(2,25,4)),
    sequence = R.idx([
      randSequence,
      loopingSequence,
      nonSequenceRuins
    ]),
    elements = sequence(ruins),
    reset = R.dec() < 0.5,
    chars = []
  layout().forEach(col => {
    col.forEach(e => {
      let {x, y, w, h} = e,
        sw = Math.max(1, Math.min(w, h) * R.num(0.1, 0.2))
      chars.push(new Character(elements(), x, y, w, h, sw))
    })
    if(reset) elements.reset()
  })
  return chars
}
class Character{
  constructor(char, x, y, w, h, sw){
    this.char = char
    this.loc = [x, y, w, h],
    this.sw = sw
  }
  render(gp){
    gp.push()
    gp.strokeWeight(this.sw*U)
    this.char(gp, ...this.loc.map(x => x*U))
    gp.pop()
  }
}

const charGroupFactory = (x, y, w, h, row=false, justify=true) => {
  let col = [],
    d = row ? h : w,
    gR = () => d * R.num(0.01, 1),
    gArr = R.dec() < 0.5 ? [gR()] : randArr(R.int(1, 13), gR)
    gaps = loopingSequence(gArr),
    cR = row ? ()=>R.norm(d*0.9, d*0.1) : ()=>R.norm(d*1.5, d*0.2),
    cArr = R.dec() < 0.5 ? [cR()] : randArr(R.int(1, 13), cR),
    char = loopingSequence(cArr),
    loc = row ? x : y,
    end = row ? x+w : y+h
  while(loc < end){
    let dim = char(),
      data = row ? {x:loc, y, w:dim, h} : {x, y:loc, w, h:dim}
    col.push(data)
    loc += dim + gaps()
  }
  if(justify){
    let r = col.pop()
    row ? r.w = x+w-r.x : r.h = y+h-r.y
    col.push(r)
  }
  return col
}

const lineOffset = (d) => {
  let gap = ()=>d*R.min(1.5, 4, 2),
    g = gap(),
    o = R.dec() < 0.75 ? ()=>g : ()=>gap()
  return o
}

const charColumn = () => {
  F.log('Layout', 'Column')
  let x = R.num(0.05, 0.95)*W,
    y = R.num(-20,0),
    w = R.num(10, 50),
    cnt = R.min(1, 7, 3),
    cols = [],
    o = lineOffset(w)
  for(let i = 0; i < cnt; i++){
    cols.push(charGroupFactory(x, y, w, H*1.2))
    x += o()
  }
  return cols
}
const charRow = () => {
  F.log('Layout', 'Row')
  let x = R.num(-20,0),
    y = R.num(0.05, 0.95)*H,
    h = R.num(10, 50),
    cnt = R.min(1, 7, 3),
    rows = [],
    o = lineOffset(h)
  for(let i = 0; i < cnt; i++){
    rows.push(charGroupFactory(x, y, W*1.2, h, true))
    y += o()
  }
  return rows
}
const charBlock = () => {
  F.log('Layout', 'Block')
  let m = () => R.num(0.1, 0.30),
    mx = m()*W,
    my = m()*H,
    w = R.num(10, 50),
    x = mx,
    cols = [],
    justify = R.dec() < 0.5,
    o = lineOffset(w)
  while(x < W-mx){
    cols.push(charGroupFactory(x, my, w, H-2*my, false, justify))
    x += o()
  }
  return cols
}

const rectBasic = (gp, x, y, w, h) => gp.rect(x, y, w, h)
const rectBasicDot = (gp, x, y, w, h) => {
  rectBasic(gp, x, y, w, h)
  dotCenter(gp, x, y, w, h)
}
const hourglass = (gp, x, y, w, h) => {
  triangleDown(gp, x, y, w, h)
  triangleUp(gp, x, y, w, h)
}
const hourglassDotMid = (gp, x, y, w, h) => {
  hourglass(gp, x, y, w, h)
  dotMidHorz(gp, x, y, w, h)
}
const hourglassDot = (gp, x, y, w, h) => {
  hourglass(gp, x, y, w, h)
  dotCenter(gp, x, y, w, h)
}
const hourglassSide = (gp, x, y, w, h) => {
  triangleRight(gp, x, y, w, h)
  triangleLeft(gp, x, y, w, h)
}
const hourglassSideDot = (gp, x, y, w, h) => {
  hourglassSide(gp, x, y, w, h)
  dotCenter(gp, x, y, w, h)
}
const hourglassSideDotMid = (gp, x, y, w, h) => {
  hourglassSide(gp, x, y, w, h)
  dotMidVert(gp, x, y, w, h)
}
const rectDiag = (gp, x, y, w, h) => {
  gp.push()
  gp.translate(x+w/2, y+h/2)
  let wh = w/2,
    hh = h/2,
    o = 0.125,
    ow = w*o,
    oh = h*o
  gp.triangle(-wh, -hh+oh, -wh, hh, wh-ow, hh)
  gp.triangle(-wh+ow, -hh, wh, -hh, wh, hh-oh)
  gp.pop()
}
const rectDiagInv = (gp, x, y, w, h) => {
  gp.push()
  gp.translate(x+w/2, y+h/2)
  gp.scale(-1, 1)
  let wh = w/2,
    hh = h/2,
    o = 0.125,
    ow = w*o,
    oh = h*o
  gp.triangle(-wh, -hh+oh, -wh, hh, wh-ow, hh)
  gp.triangle(-wh+ow, -hh, wh, -hh, wh, hh-oh)
  gp.pop()
}
const diamondBasic = (gp, x, y, w, h) => gp.quad(x, y+h/2, x+w/2, y, x+w, y+h/2, x+w/2, y+h)
const diamondDot = (gp, x, y, w, h) => {
  diamondBasic(gp, x, y, w, h)
  dotCenter(gp, x, y, w, h)
}
const diamondFullDot = (gp, x, y, w, h) => {
  diamondDot(gp, x, y, w, h),
  dotCorners(gp, x, y, w, h)
}
const diamondCross = (gp, x, y, w, h) => {
  diamondBasic(gp, x, y, w, h)
  crossBasic(gp, x, y, w, h)
}
const diamondCorssCornerDot = (gp, x, y, w, h) => {
  diamondCross(gp, x, y, w, h)
  dotCorners(gp, x, y, w, h)
}
const dotCenter = (gp, x, y, w, h) => gp.point(x+w/2, y+h/2)
const dotTop = (gp, x, y, w, h) => {
  gp.point(x, y)
  gp.point(x+w, y)
}
const dotBottom = (gp, x, y, w, h) => {
  gp.point(x+w, y+h)
  gp.point(x, y+h)
}
const dotCorners = (gp, x, y, w, h) => {
  dotTop(gp, x, y, w, h)
  dotBottom(gp, x, y, w, h)
}
const dotMidVert = (gp, x, y, w, h) => {
  gp.point(x+w/2, y)
  gp.point(x+w/2, y+h)
}
const dotMidHorz = (gp, x, y, w, h) => {
  gp.point(x, y+h/2)
  gp.point(x+w, y+h/2)
}
const triangleDown = (gp, x, y, w, h) => gp.triangle(x, y, x+w, y, x+w/2, y+h)
const triangleUp = (gp, x, y, w, h) => gp.triangle(x, y+h, x+w, y+h, x+w/2, y)
const triangleRight = (gp, x, y, w, h) => gp.triangle(x, y, x, y+h, x+w, y+h/2)
const triangleLeft = (gp, x, y, w, h) => gp.triangle(x+w, y, x+w, y+h, x, y+h/2)
const trianggleDownDot = (gp, x, y, w, h) => {
  triangleDown(gp, x, y, w, h)
  dotBottom(gp, x, y, w, h)
  dotCenter(gp, x, y, w, h)
}
const triangleUpDot = (gp, x, y, w, h) => {
  triangleUp(gp, x, y, w, h)
  dotTop(gp, x, y, w, h)
  dotCenter(gp, x, y, w, h)
}
const crossDiag = (gp, x, y, w, h) => {
  gp.line(x, y, x+w, y+h)
  gp.line(x, y+h, x+w, y)
}
const crossDiagDot = (gp, x, y, w, h) => {
  crossDiag(gp, x, y, w, h)
  dotMidVert(gp, x, y, w, h)
  dotMidHorz(gp, x, y, w, h)
}
const crossBasic = (gp, x, y, w, h) => {
  gp.line(x+w/2, y, x+w/2, y+h)
  gp.line(x, y+h/2, x+w, y+h/2)
}
const crossBasicDot = (gp, x, y, w, h) => {
  crossBasic(gp, x, y, w, h)
  dotCorners(gp, x, y, w, h)
}
const crossTriangle = (gp, x, y, w, h) => {
  let o = 0.17,
    wo= w*o,
    ho = h*o,
    x0 = x+wo,
    x1 = x+w-wo,
    y0 = y+ho,
    y1 = y+h-ho,
    cx = x+w/2,
    cy = y+h/2
  gp.triangle(x0, y, x1, y, cx, cy-ho)
  gp.triangle(x+w, y0, x+w, y1, cx+wo, cy)
  gp.triangle(x0, y+h, x1, y+h, cx, cy+ho)
  gp.triangle(x, y0, x, y1, cx-wo, cy)
}
const crossTriangleCross = (gp, x, y, w, h) => {
  crossTriangle(gp, x, y, w, h)
  crossBasic(gp, x, y, w, h)
}
const barsBasic = (gp, x, y, w, h) => {
  let n = Math.max(1, Math.floor(h / U / 10)),
    step = h / n
  if(n == 1){
    gp.line(x, y+h/2, x+w, y+h/2)
    return
  }
  for(let i = 0; i <= n; i++){
    gp.line(x, y+step*i, x+w, y+step*i)
  }
}
const barsDotted = (gp, x, y, w, h) => {
  gp.push()
  let ctx = gp.drawingContext
  ctx.setLineDash([0, w*0.99/5])
  barsBasic(gp, x, y, w, h)
  gp.pop()
}
const zigZag = (gp, x, y, w, h) => {
  gp.push()
  gp.translate(x+w/2, y+h/2)
  let x0 = -w/2,
    x1 = w/2,
    y0 = -h/2,
    y1 = h/2
  gp.line(x0,y0, x1,y0)
  gp.line(x1,y0, x0,y1)
  gp.line(x0,y1, x1,y1)
  gp.point(x0, 0)
  gp.point(x1, 0)
  gp.pop()
}
const zigZagInv = (gp, x, y, w, h) => {
  gp.push()
  gp.translate(x+w/2, y+h/2)
  gp.scale(-1,1)
  let x0 = -w/2,
    x1 = w/2,
    y0 = -h/2,
    y1 = h/2
  gp.line(x0,y0, x1,y0)
  gp.line(x1,y0, x0,y1)
  gp.line(x0,y1, x1,y1)
  gp.point(x0, 0)
  gp.point(x1, 0)
  gp.pop()
}
const zigZagStraight = (gp, x, y, w, h) => {
  gp.push()
  gp.translate(x+w/2, y+h/2)
  let x0 = -w/2,
    x1 = w/2,
    y0 = -h/2,
    y1 = h/2
  gp.line(x0,y0, x1,y0)
  gp.line(x1,y0, x1,0)
  gp.line(x1,0, x0,0)
  gp.line(x0,0, x0,y1)
  gp.line(x0,y1, x1,y1)
  gp.point(x0, -h/4)
  gp.point(0, -h/4)
  gp.point(x1, h/4)
  gp.point(0, h/4)
  gp.pop()
}
const zigZagStraightInv = (gp, x, y, w, h) => {
  gp.push()
  gp.translate(x+w/2, y+h/2)
  gp.scale(-1,1)
  let x0 = -w/2,
    x1 = w/2,
    y0 = -h/2,
    y1 = h/2
  gp.line(x0,y0, x1,y0)
  gp.line(x1,y0, x1,0)
  gp.line(x1,0, x0,0)
  gp.line(x0,0, x0,y1)
  gp.line(x0,y1, x1,y1)
  gp.point(x0, -h/4)
  gp.point(0, -h/4)
  gp.point(x1, h/4)
  gp.point(0, h/4)
  gp.pop()
}
const zigZagStraightNine = (gp, x, y, w, h) => {
  zigZagStraight(gp, x, y, w, h)
  gp.line(x+w, y, x+w, y+h)
}
const zigZagStraightSplit = (gp, x, y, w, h) => {
  zigZagStraight(gp, x, y, w, h)
  gp.line(x+w/2, y, x+w/2, y+h)
}
const spikesHorz = (gp, x, y, w, h) => {
  let n = Math.max(1, Math.floor(h / (13*U))),
    s = h / n,
    o = 0.11,
    m0 = x+w/2-w*o,
    m1 = x+w/2+w*o
  for(let i = 0; i < n; i++){
    let y0 = y+s*i,
      y1 = y+s*(i+1),
      ym = y0+s/2
    gp.triangle(x,ym, m0,y0, m0,y1)
    gp.triangle(x+w,ym, m1,y0, m1,y1)
  }
}
const spaceChar = () => null
const SPACE = R.idx([0,1,1,5,5,100,300,300])
class Ruins{
  constructor() {
    this.ruins = [
      [SPACE, spaceChar],
      [1, rectBasic],
      [1, rectBasicDot],
      [10, hourglass],
      [10, hourglassDotMid],
      [10, hourglassDot],
      [10, hourglassSide],
      [10, hourglassSideDot],
      [10, hourglassSideDotMid],
      [10, rectDiag],
      [10, rectDiagInv],
      [1, diamondBasic],
      [10, diamondDot],
      [10, diamondFullDot],
      [10, diamondCross],
      [10, diamondCorssCornerDot],
      [1, dotCenter],
      [1, dotTop],
      [1, dotBottom],
      [1, dotCorners],
      [1, dotMidVert],
      [1, dotMidHorz],
      [5, triangleDown],
      [5, triangleUp],
      [5, triangleRight],
      [5, triangleLeft],
      [8, trianggleDownDot],
      [8, triangleUpDot],
      [10, crossDiag],
      [10, crossDiagDot],
      [10, crossBasic],
      [10, crossBasicDot],
      [10, crossTriangle],
      [10, crossTriangleCross],
      [3, barsBasic],
      [3, barsDotted],
      [7, zigZag],
      [7, zigZagInv],
      [7, zigZagStraight],
      [7, zigZagStraightInv],
      [7, zigZagStraightNine],
      [7, zigZagStraightSplit],
      [10, spikesHorz]
    ]
  }
  get(n){
    let r = []
    for(let i = 0; i < n; i++){
      r.push(this.getW())
    }
    return r
  }
  getW(){
    let a = this.ruins,
        total = a.reduce((t, x) => t += x[0], 0),
        r = R.num(0, total),
        wSum = 0
      for(let i = 0; i < a.length; i++){
        wSum += a[i][0]
        if(r > wSum) continue
        return a[i][1]
      }
    }
}
const RUINS = new Ruins()


const lineEnd = (x, y, a, l) => createVector(x + cos(a) * l, y + sin(a) * l)
const lineOffshoot = (p0, p1, t, angle, mag) => {
  let x = lerp(p0.x, p1.x, t),
    y = lerp(p0.y, p1.y, t),
    pT = createVector(x, y)
  return new Line(pT, (p0.copy().sub(p1)).setMag(mag).rotate(angle).add(pT))
}
const clipLineToCollision = (line, lines) => {
  let p0 = line.p0,
  p1 = line.p1,
  intersect = [p1, ...lines.map(l => lineLineCollision(l.p0, l.p1, p0, p1))]
  intersect = intersect.filter(i => i !== undefined)
  intersect.sort((a, b) => a.dist(p0) - b.dist(p0))
  return new Line(p0, intersect[0])
}
const lineLineCollision = (p0, p1, p2, p3) => {
  let [x0, y0, x1, y1, x2, y2, x3, y3] = [p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y],
    uA = ((x3-x2)*(y0-y2) - (y3-y2)*(x0-x2)) / ((y3-y2)*(x1-x0) - (x3-x2)*(y1-y0)),
    uB = ((x1-x0)*(y0-y2) - (y1-y0)*(x0-x2)) / ((y3-y2)*(x1-x0) - (x3-x2)*(y1-y0))
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return createVector(x0 + (uA * (x1-x0)), y0 + (uA * (y1-y0)))
  }
  return
}
const pointOnCanvas = (p, o=0) => p.x >= -o && p.x <= W+o && p.y >= -o && p.y <= H+o
const lineOnCanvas = (line) => {
  let cv = (x, y) => createVector(x, y),
    o = 90,
    w = W+o,
    h = H+o,
    c0 = cv(-o,-o),
    c1 = cv(w,-o),
    c2 = cv(w,h),
    c3 = cv(-o,h),
    col = (cS, cE) => lineLineCollision(line.p0, line.p1, cS, cE),
    top = col(c0, c1),
    right = col(c1, c2),
    bot = col(c2, c3),
    left = col(c3, c0)
  return top || right || bot || left || pointOnCanvas(line.p0, o) || pointOnCanvas(line.p1, o)
}
const cropLine = (l) => {
  let cv = (x, y) => createVector(x, y),
    o = 100,
    w = W+o,
    h = H+o,
    c0 = cv(-o,-o),
    c1 = cv(w,-o),
    c2 = cv(w,h),
    c3 = cv(-o,h),
    col = (cS, cE) => lineLineCollision(l.p0, l.p1, cS, cE),
    c = [
      col(c0, c1),
      col(c1, c2),
      col(c2, c3),
      col(c3, c0)
    ].filter(p => p !== undefined),
    p = [l.p0, l.p1].filter(p => pointOnCanvas(p, o))
  if(c.length == 2){
    l.setPoints(...c)
  }
  if(c.length == 1 && p.length == 1){
    l.setPoints(c[0], p[0])
  }
  return l
}
class Line{
  constructor(p0, p1){
    this.setPoints(p0, p1)
  }
  setPoints(p0, p1){
    p0.x = Math.round(p0.x)
    p0.y = Math.round(p0.y)
    p1.x = Math.round(p1.x)
    p1.y = Math.round(p1.y)
    this.p0 = p0
    this.p1 = p1
  }
  render(gp){
    gp.push()
    scratchLine(gp, this.p0, this.p1)
    gp.pop()
  }
  initOffshoots(lines, offshoots){
    let delta = SET.lineSpacing() / this.p0.dist(this.p1),
      shoots = [],
      mag = Math.max(H,W)*2
    for(let t = 0; t <=1; t+=delta){
      let a = R.dec() < SET.offshootAngleThreshold ? 90 : 270,
        newLine = lineOffshoot(this.p0, this.p1, t, a, mag),
        l = lines.filter(l => l !== this),
        collisionLines = [...l, ...offshoots]
      newLine = clipLineToCollision(newLine, collisionLines)
      if(newLine == null) continue
      offshoots.push(newLine)
      shoots.push(newLine)
    }
    return shoots
  }
}

const scratchLine = (gp, p0, p1) => {
  let t = 0,
    p = [p0],
    dist = p0.dist(p1)
    space = R.min(5, 100),
    step = Math.min(0.5, space / dist)
  while(t < 1){
    let r = () => R.min(0, SET.lineWobble, 3),
      x = lerp(p0.x, p1.x, t) + r(),
      y = lerp(p0.y, p1.y, t) + r()
    p.push(createVector(x, y))
    t += step
  }
  p.push(p1, p1)
  this.p = p

  gp.push()
  let max = R.num(2, 10)
  for(let i = 0; i < p.length-3; i++){
    let pnt = p.slice(i, i+4),
      cnt = pnt[1].dist(pnt[2]) * R.num(1, max)
    for(let i = 0; i < cnt; i++){
      let t = R.min(0,1,2),
        x = curvePoint(...pnt.map(p => p.x), t),
        y = curvePoint(...pnt.map(p => p.y), t)
      if(!pointOnCanvas(createVector(x, y))) continue
      gp.stroke(SET.lineColor(x*U, y*U))
      gp.strokeWeight(map(t, 0, 1, 0.5, 1.5)*U)
      gp.point(x*U, y*U)
    }
  }
  gp.pop()
}
const watercolorLine = (gp, p0, p1) => {
  let d = p0.dist(p1),
    cnt = SET.watercolorLayers(d),
    n = R.int(3, 7),
    p
  for(let i = 0; i < cnt; i++){
    let points = splitPoints([p0, p1], n)
    gp.beginShape()
    points.map(p => gp.vertex(p.x*U, p.y*U))
    gp.endShape()
    p = R.idx(points)
  }
}
const splitPoints = (points, n=3) => {
  let p = [...points]
  for(let i = 0; i < n; i++){
    let pnt = [], p0, p1
    for(let i = 0; i < p.length - 1; i++){
      [p0, p1] = p.slice(i, i+2)
      let v = p5.Vector.lerp(p0, p1, R.dec()),
      a = R.idx([R.num(0,360), SET.bleedAngle, SET.bleedAngle])
      b = (p0.copy().sub(p1).setMag(SET.bleedMagnitude())).rotate(a)
      pnt = [...pnt, p0, v.add(b)]
    }
    p = [...pnt, p1]
  }
  return p
}


class ProbabilisticPalette{
  constructor(){
    let c = (h,s,l) => color(h,s,l),
    options = [
      [1,'1',c(354,84,15),c(352,76,70),c(177,50,50),[c(346,77,39),c(355,90,49)]],
      [1,'2',c(225,0,100),c(198,12,70),c(0,100,30),[c(182,75,75),c(13,75,75)]],
      [2,'3',c(36,62,92),c(330,10,67),c(358,50,50),[c(210,45,65),c(212,41,60),c(208,41,74)]],
      [2,'4',c(49,64,94),c(38,40,75),c(338,60,55),[c(44,82,83),c(38,80,71)]],
      [0.5,'5',c(105,14,95),c(45,15,53),c(15,100,43),[c(161,16,64)]],
      [1,'6',c(0,0,100),c(171,47,50),c(209,86,20),[c(179,69,76),c(189,75,46),c(179,61,64)]],
      [1,'7',c(37,50,90),c(203,50,35),c(357,60,50),[c(203,54,60)]],
      [2,'8',c(212,44,12),c(207,60,65),c(340,100,45),[c(207,60,50),c(207,60,30),c(208,70,30)]],
      [1,'9',c(203,87,26),c(340,100,28),c(213,21,78),[c(340,65,52)]],
      [1.5,'10',c(204,57,93),c(342,32,70),c(212,41,20),[c(335,46,89),c(346,64,73),c(341,63,79)]],
      [1,'11',c(22,64,95),c(13,32,67),c(199,56,39),[c(14,66,76)]],
      [1,'12',c(180,50,95),c(155,32,65),c(207,100,30),[c(60,60,60),c(70,60,50)]],
      [1,'13',c(252,17,94),c(3,50,69),c(180,70,25),[c(25,80,80)]],
      [1,'14',c(218,23,12),c(9,100,68),c(185,68,48),[c(9,80,50)]],
      [1,'15',c(173,50,90),c(359,87,75),c(185,65,15),[c(164,55,50)]],
      [1,'16',c(217,30,17),c(344,60,68),c(30,79,90),[c(344,45,50),c(355,68,69),c(4,76,76)]],
      [1,'17',c(120,3,87),c(204,75,25),c(300,14,6),[c(356,72,26),c(354,81,34),c(353,93,34)]],
      [1,'18',c(75,12,90),c(79,40,47),c(359,47,38),[c(79,69,45)]],
      [1,'19',c(66,100,80),c(207,75,41),c(356,87,40),[c(72,65,42),c(72,100,42)]],
      [1,'20',c(196,100,90),c(196,31,45),c(0,87,35),[c(21,77,69)]],
      [1,'21',c(200,80,95),c(17,20,30),c(0,100,35),[c(36,50,80),c(34,50,80)]],
      [0.5,'22',c(4,67,6),c(0,100,37),c(50,100,45),[c(3,96,45),c(12,97,45)]]
    ],
      total = options.reduce((t, x) => t += x[0], 0),
      r = R.num(0, total),
      wSum = 0
    for(let i = 0; i < options.length; i++){
      wSum += options[i].shift()
      if(r > wSum) continue
      F.log('Palette', options[i].shift())
      let [back, weave, char, highlight] = options[i]
      this._b = back
      this._h = char
      this._d = weave
      this._w = highlight
      return
    }
  }
  background = () => this._b
  detail(){
    let c = this._d,
      r = () => R.num(0,10)
    return color(hue(c), saturation(c), lightness(c)-r())
  }
  highlight(){
    return this._h
  }
  base(){
    let a = R.num(1,5),
      c = R.idx(this._w)
    return color(hue(c), saturation(c), lightness(c), a)
  }
}

let ENV, P, FINISHED = false
function setup() {
  createCanvas(WU, HU)
  angleMode(DEGREES)
  colorMode(HSL, 360,100,100,100)
  P = new ProbabilisticPalette()
  ENV = new Environment()
  ENV.render()
  F.save()
}

function draw() {
  if(! ENV.draw()) {
    noLoop()
    FINISHED = true
  }
}

function keyPressed(){
  // w, r, c, s
  if(!FINISHED) return
  if(keyCode == 83) F.saveImg()
  ENV.toggle(keyCode)
}