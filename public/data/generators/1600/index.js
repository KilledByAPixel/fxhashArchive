// these are the variables you can use as inputs to your algorithms
console.log(fxhash);   // the 64 chars hex number fed to your algorithm

// [https://fxhash.xyz/articles/guide-mint-generative-token#features]
//
window.$fxhashFeatures = {
  "steps": randweighted([[1, 'Short'], [2, 'Medium'], [2, 'Long'], [1, 'Ultra']]),
  "norms": randweighted([[0.75, 'Sparse'], [2, 'Many'], [1, 'Fat']]),
  "colors": randweighted([[1, 'Ori'], [1.5, 'Mondrian'], [1, 'Bang'], [1, 'Meadow'], [1, 'Inverted'], [1, 'Pearl']]),
  "normmotion": randweighted([[3, 'Small'], [3, 'Regular'], [1, 'Hectic']]),
  "strokeweight": randweighted([[1, 'Fine'], [1, 'Moderate'], [1, 'Chonky']]),
  "repeats": randweighted([[2, 'Single'], [1, 'Mirror'], [0.3, 'Double']]),
  "motion": randweighted([[4, 'Small'], [4, 'Regular'], [2, 'Hectic']]),
  "renorm": randweighted([[1, 'None'], [2, 'Slight'], [1, 'Max']]),
  "fade": randweighted([[3, 'Yes'], [1, 'No']]),
}

function features_make() {
  const features = window.$fxhashFeatures;
  console.log(JSON.stringify(features));
  let steps;
  switch(features.steps) {
    case 'Short':
      steps = 200;
      break;
    case 'Medium':
      steps = 300;
      break;
    case 'Long':
      steps = 600;
      break;
    case 'Ultra':
      steps = 900;
      break;
    default:
      console.warn('uh oh!');
  }

  let norms;
  let normscale
  switch(features.norms) {
    case 'Sparse':
      norms = 500;
      normscale = 0.15;
      break;
    case 'Many':
      norms = 1333;
      normscale = 0.04;
      break;
    case 'Fat':
      norms = 2600;
      normscale = 0.04;
      break;
    default:
      console.warn('uh oh!');
  }

  let colors;
  switch(features.colors) {
    case 'Ori':
      colors = ORI;
      break;
    case 'Mondrian':
      colors = MONDRIAN;
      break;
    case 'Bang':
      colors = BANG;
      break;
    case 'Meadow':
      colors = MEADOW;
      break;
    case 'Inverted':
      colors = INVERTED;
      break;
    case 'Pearl':
      colors = PEARL;
      break;
    default:
      console.warn('uh oh!');
  }


  let noisescale;
  let reshuffle = true;
  switch (features.motion) {
    case 'Small':
      noisescale = 0.003;
      stepsize = 1.0;
      reshuffle = false;
      break;
    case 'Regular':
      noisescale = 0.009;
      stepsize = 0.3;
      break;
    case 'Hectic':
      noisescale = 0.03;
      stepsize = 0.1;
      break;
    default:
      console.warn('uh oh!');
  }

  let normnoisescale;
  switch (features.normmotion) {
    case 'Small':
      normnoisescale = 0.001;
      break;
    case 'Regular':
      normnoisescale = 0.003;
      break;
    case 'Hectic':
      normnoisescale = 0.005;
      break;
    default:
      console.warn('uh oh!');
  }

  let normjiggle = randfloat(0.1);

  let strokeweight;
  switch(features.strokeweight) {
    case 'Fine':
      strokeweight = 1.5;
      break;
    case 'Moderate':
      strokeweight = 4.0;
      break;
    case 'Chonky':
      strokeweight = 7.0;
      break;
    default:
      console.warn('uh oh!');
  }

  let repeats;
  const scaleoffset = randfloat(1) > 0.5 ? 1.3 : 0.8;
  switch(features.repeats) {
    case 'Single':
      repeats = [{scale: randfloat(1) > 0.5 ? 1 : -1, offset: 0, scaleoffset}];
      break;
    case 'Mirror':
      repeats = [{scale: 1, offset: 10, scaleoffset}, {scale: -1, offset: 10, scaleoffset}];
      break;
    case 'Double':
      repeats = [{scale: 1, offset: 0, scaleoffset}, {scale: -1, offset: 0, scaleoffset}];
      break;
    default:
      console.warn('uh oh!');
  }

  let renorm = 0;
  switch(features.renorm) {
    case 'None':
      renorm = 0;
      break;
    case 'Slight':
      renorm = 1;
      break;
    case 'Max':
      renorm = 5;
      break;
    default:
      console.warn('uh oh!');
  }

  renorm = 0;

  const rescale = randfloat(0.3, 1.2);
  const truncate = features.fade === 'Yes';

  return {
    steps,
    stepsize,
    norms,
    colors,
    noisescale,
    reshuffle,
    normscale,
    normnoisescale,
    normjiggle,
    strokeweight,
    repeats,
    renorm,
    rescale,
    truncate,
  }
}

const NOISE_OFFSET = 1000;
const BIGNUM = 1000000000000;
let FEATURES;

function setup() {
  const SEED = fxrand() * BIGNUM
  noiseSeed(SEED);
  randomSeed(SEED);

  FEATURES = features_make();

  noLoop();

  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.id('maincanvas');
}

/* Rand */

function randfloat(min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }

  const range = max - min;

  return fxrand() * range + min;
}

function randint(min, max) {
  return Math.floor(randfloat(min, max));
}

function randbool(success) {
  return fxrand() < success;
}

function randweighted(pairs) {
  let total = pairs.map(([a, b]) => a).reduce((a, b) => a + b);
  let choice = randfloat(total);
  for (let [weight, value] of pairs) {
    if (weight >= choice) {
      return value;
    }

    choice -= weight;
  }

  return pairs[pairs.length - 1][1];
}

/* Colors */

const MONDRIAN = {
  lines: [
    '#C62828', // red
    '#2196F3', // blue
    '#FBC02D', // yellow
    '#212121', // black
    '#EEEEEE', // bluegrey
  ],
  background: '#FFF9F3'
};

const ORI = {
  lines: [
    '#4CAF50', // green
    '#F1F8E9', // light green
    '#004D40', // dark teal
    '#F06292', // pink
    '#FCE4EC', // light pink
    '#CE93D8', // purple
    '#33691E', // dark light green
  ],
  background: '#FFFAF9'
};

const BANG = {
  lines: [
    '#B71C1C', // red
    '#D32F2F', // ligher red
    '#FFEBEE', // lightest red
    '#424242', // dark grey
    '#0288D1', // lightest light blue
    '#212121', // black
    '#EEEEEE', // bluegrey
  ],
  background: '#EFEBE9'
};

const MEADOW = {
  lines: [
    '#7CB342', // light green 
    '#689F38', // darker light green
    '#33691E', // darkest light green
    '#DCEDC8', // lightest light green
    '#9CCC65', // moderate light green
    '#fafafa', // light grey
    '#212121', // dark grey
    '#43A047', // green

    //'#7986cb', // indigo
    //'#e53935', // red
    //'#F06292', // pink 
    //'#ffee58', // amber
  ],
  background: '#fff8ea'
};

const INVERTED = {
  lines: [
    '#f9a825', // yellow
    '#303f9f', // indigo
    '#c62828', // red
    '#fafafa', // light grey
    '#212121', // dark grey
  ],
  background: '#313131'
};

const PEARL = {
  lines: [
    '#fafafa', 
    '#f5f5f5', 
    '#eeeeee', 
    '#e0e0e0', 
    '#bdbdbd', 
    '#727272', 
  ],
  background: randweighted([[1, '#bf360c'], [1, '#004d40'], [1, '#1B5e20'], [1, '#b71c1c']]),
};

const SHADOW = 'rgba(20, 20, 20, 0.15)';

function getColor(scheme, idx) {
  return scheme.lines[idx % scheme.lines.length];
}

function getBackground(scheme, idx) {
  return scheme.background;
}


/* Noise */

function noise2d(pt, scale = 0.005) {
  const {x, y} = mul(pt, scale);
  return {
    x: noise(x, y), 
    y: noise(x + NOISE_OFFSET, y + NOISE_OFFSET),
  };
}

function noiseToVec(pt) {
  const {x, y} = pt;
  const theta = x * 4 * Math.PI;
  return {x: Math.cos(theta) * y, y: Math.sin(theta) * y};
}

/* Geo */

function lerp_t(pt1, pt2, t) {
  return add(mul(pt1, 1 - t), mul(pt2, t));
}

function lerp_d(pt1, pt2, d) {
  const D = distbetween(pt1, pt2);
  if (D === 0) {
    return pt1;
  } else {
    return lerp_t(pt1, pt2, d / D);
  }
}

function add(pt1, pt2) {
  const {x: x1, y: y1} = pt1;
  const {x: x2, y: y2} = pt2;
  return {x: x1 + x2, y: y1 + y2};
}

function sub(pt1, pt2) {
  const {x: x1, y: y1} = pt1;
  const {x: x2, y: y2} = pt2;
  return {x: x1 - x2, y: y1 - y2};
}

function mul(pt, s) {
  const {x, y} = pt;
  return {x: x * s, y: y * s};
}

function rotate90(pt) {
  const {x, y} = pt;
  return {x: y, y: -x};
}

function rotate180(pt) {
  const {x, y} = pt;
  return {x: -x, y: -y};
}

function rotate270(pt) {
  const {x, y} = pt;
  return {x: -y, y: x};
}

function distbetween(pt1, pt2) {
  if (pt2 == null) {
    pt2 = {x: 0, y: 0};
  }

  const {x: x1, y: y1} = pt1;
  const {x: x2, y: y2} = pt2;
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

function normalize(pt) { 
  const mag = distbetween(pt);
  if (mag === 0) {
    return pt;
  } else {
    return mul(pt, 1 / mag);
  }
}

function line_length(line) {
  let accum = 0;
  for (let i = 1; i < line.points.length; i++) {
    const lp = line.points[i - 1];
    const cp = line.points[i];
    accum += distbetween(lp, cp);
  }

  return accum;
}

function lineset_bb(lineset) {
  let tl = {x: Number.MAX_VALUE, y: Number.MAX_VALUE};
  let br = {x: Number.MIN_VALUE, y: Number.MIN_VALUE};
  for (const line of lineset.lines) {
    const [ltl, lbr] = line_bb(line);

    tl.x = Math.min(tl.x, ltl.x);
    tl.y = Math.min(tl.y, ltl.y);

    br.x = Math.max(br.x, lbr.x);
    br.y = Math.max(br.y, lbr.y);
  }

  return [tl, br];

}

function line_bb(line) {
  let tl = {x: Number.MAX_VALUE, y: Number.MAX_VALUE};
  let br = {x: Number.MIN_VALUE, y: Number.MIN_VALUE};
  for (const pt of line.points) {
    tl.x = Math.min(tl.x, pt.x);
    tl.y = Math.min(tl.y, pt.y);

    br.x = Math.max(br.x, pt.x);
    br.y = Math.max(br.y, pt.y);
  }

  return [tl, br];
}

function line_make(points) {
  return {
    stroke: undefined,
    stroke_weight: undefined,
    points: points || [],
  };
}

function line_copy_props(other) {
  return {
    stroke: other.stroke,
    stroke_weight: other.stroke_weight,
    points: [],
  };
}

function lineset_make(lines) {
  return {
    stroke: undefined,
    stroke_weight: undefined,
    lines: lines || [],
  };
}

function lineset_copy_props(other) {
  return {
    stroke: other.stroke,
    stroke_weight: other.stroke_weight,
    lines: [],
  };
}

function lineset_flatten(self) {
  const top_stroke = self.stroke;
  const top_stroke_weight = self.stroke_weight;

  const result = [];
  for (const line of self.lines) {
    line.stroke = line.stroke ?? top_stroke;
    line.stroke_weight = line.stroke_weight ?? top_stroke_weight;

    result.push(line);
  }

  return result;
}

function lineset_extend(self, other) {
  const top_stroke = other.stroke;
  const top_stroke_weight = other.stroke_weight;

  for (const line of other.lines) {
    line.stroke = line.stroke ?? top_stroke;
    line.stroke_weight = line.stroke_weight ?? top_stroke_weight;

    self.lines.push(line);
  }

  return self;
}

/* Transforms */

function lineset_center(lineset, ptl, pbr, margin) {
  const [ctl, cbr] = lineset_bb(lineset);

  const result = lineset_copy_props(lineset);
  result.lines = lineset.lines.map(line => line_center(line, ptl, pbr, margin, ctl, cbr));
  return result;
}

function line_center(line, ptl, pbr, margin, ctl, cbr) {
  if (ctl == null || cbr == null) {
    [ctl, cbr] = linebb(line);
  }

  pmargin = {x: margin, y: margin};

  cdiag = sub(cbr, ctl);
  pdiag = sub(sub(pbr, ptl), mul(pmargin, 2));

  ratiox = pdiag.x / cdiag.x
  ratioy = pdiag.y / cdiag.y

  scale_factor = min(ratiox, ratioy)

  scale_diagonal = mul(cdiag, scale_factor); 
  scale_delta = mul(sub(pdiag, scale_diagonal), 0.5)

  offset = add(scale_delta, pmargin)

  const result = line_copy_props(line);
  result.points = line.points.map(pt => add(mul(sub(pt, ctl), scale_factor), offset));
  return result;
}

function line_norm(line, scale, ft, fd) {
  const len = line_length(line);

  if (len === 0) {
    console.warn("cannot take norm of length == 0 line");
    return line;
  }

  if (fd == null && ft == null) {
    fd = (d) => 1
  } else if (fd == null && ft != null) {
    fd = (d) => ft(d / len)
  }

  let lastdir = undefined;
  let accum = 0;
  const result = line_copy_props(line);
  for (let i = 0; i < line.points.length - 1; i++) {
    const cp = line.points[i]; 
    const np = line.points[i + 1]; 
    const dir = normalize(rotate90(sub(np, cp)));
    const offset = mul(dir, scale * fd(accum))
    result.points.push(add(cp, offset));
    lastdir = dir;
    accum += distbetween(cp, np);
  }

  const lastoffset = mul(lastdir, scale * fd(accum))
  result.points.push(add(line.points[line.points.length - 1], lastoffset));

  return result;
}

function line_truncate(line, t1) {
  const D = line_length(line);
  if (D === 0 || t1 === 1) {
    return line;
  }

  const d = t1 * D;
  const result = line_copy_props(line);
  let accum = 0;

  let idx = 0;
  let lastpt = undefined;
  while (idx < line.points.length && accum < d) {
    const pt = line.points[idx];
    result.points.push(pt);

    if (lastpt != null) {
      const tonext = distbetween(pt, lastpt);

      if (accum + tonext >= d) {
        const finalpt = lerp_d(lastpt, pt, d - accum);
        result.points.push(finalpt);
        return result;
      }

      accum += tonext;
    }

    lastpt = pt;
    idx += 1;
  }

  return result
}

function line_dash(line, pattern) {
  let switches = 0;
  const currpattern = () => pattern[switches % pattern.length];
  const active = () => switches % 2 === 0;
  const advance = () => switches += 1;

  let remlen = currpattern();

  const result = lineset_copy_props(line);
  let buffer = [];

  for (let i = 0; i < line.points.length - 1; i++) {
    const start = line.points[i];
    const end = line.points[i + 1];
    if (active()) {
      buffer.push(start);
    }

    let pt = start;
    let d = distbetween(pt, end);

    while (d > remlen) {
      pt = lerp_d(pt, end, remlen);
      advance();
      remlen = currpattern();

      buffer.push(pt);
      if (!active()) {
        const next_line = line_make(buffer);
        next_line.end = d;
        result.lines.push(next_line);
        buffer = [];
      }

      d = distbetween(pt, end);
    }

    remlen -= d;
  }

  if (active()) {
    buffer.push(line.points[line.points.length - 1]);
  }

  if (buffer.length > 0) {
    const next_line = line_make(buffer);
    next_line.end = line_length(line);
    result.lines.push(next_line);
  }

  return result;
}

/* QT */

const QT_ENTRY_CAP = 256;

function quadtree_make(tl, br) {
  return {
    tl: tl ?? {x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY},
    br: br ?? {x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY},
    entries: [],
    children: [],
    splittable: false,
  };
}

function quadtree_in_bounds(qt, pt) {
  return qt.tl.x < pt.x && qt.tl.y < pt.y && qt.br.x >= pt.x && qt.br.y >= pt.y;
}

function quadtree_insert(qt, pt, value) {
  if (!quadtree_in_bounds(qt, pt)) {
    console.error('invalid qt insert: ', qt, pt, value);
    alert('bug');
  }

  if (qt.children.length > 0) {
    for (const child of qt.children) {
      if (quadtree_in_bounds(child, pt)) {
        quadtree_insert(child, pt, value);
        return;
      }
    }

    console.error('no matching child for qt to insert', qt, pt, value);
    alert('bug');
  }

  if (!qt.splittable && qt.entries.length > 0) {
    const fp = qt.entries[0].pt;
    qt.splittable = fp.x !== pt.x || fp.y !== pt.y;
  }

  qt.entries.push({pt, value});

  if (qt.entries.length <= QT_ENTRY_CAP) {
    return;
  }

  const xsort = qt.entries.map(et => et.pt).sort((pt1, pt2) => pt1.x - pt2.x);
  const ysort = qt.entries.map(et => et.pt).sort((pt1, pt2) => pt1.y - pt2.y);

  const midx = xsort[Math.floor(xsort.length / 2)].x;
  const midy = ysort[Math.floor(ysort.length / 2)].y;
  const mid = {x: midx, y: midy};

  qt.children = [
    quadtree_make(qt.tl, mid),
    quadtree_make({x: mid.x, y: qt.tl.y}, {x: qt.br.x, y: mid.y}),
    quadtree_make({x: qt.tl.x, y: mid.y}, {x: mid.x, y: qt.br.y}),
    quadtree_make(mid, qt.br),
  ];

  for (const entry of qt.entries) {
    for (const child of qt.children) {
      if (quadtree_in_bounds(child, entry.pt)) {
        quadtree_insert(child, entry.pt, entry.value);
        continue;
      }
    }
  }

  qt.entries = [];
}

function quadtree_lookup(qt, tl, br) {
  if (qt.br.x < tl.x || br.x < qt.tl.x || qt.br.y < tl.y || br.y < qt.tl.y) {
    return [];
  }

  if (qt.children.length > 0) {
    return [
      ...quadtree_lookup(qt.children[0], tl, br),
      ...quadtree_lookup(qt.children[1], tl, br),
      ...quadtree_lookup(qt.children[2], tl, br),
      ...quadtree_lookup(qt.children[3], tl, br),
    ];
  }

  return qt.entries.filter(e => tl.x < e.pt.x && tl.y < e.pt.y && br.x >= e.pt.x && br.y >= e.pt.y);
}

/* Draw */

function lineset_draw(lineset) {
  if (lineset.stroke != null) {
    stroke(lineset.stroke);
  }

  if (lineset.stroke_weight != null) {
    strokeWeight(lineset.stroke_weight);
  }

  for (const line of lineset.lines) {
    line_draw(line);
  }
}

function line_draw(line) {
  if (line.stroke != null) {
    stroke(line.stroke);
  }

  if (line.stroke_weight != null) {
    strokeWeight(line.stroke_weight);
  }

  noFill();
  beginShape();
  for (const pt of line.points) {
    const {x, y} = pt;
    vertex(x, y);
  }
  endShape();
}

const INSERT_INTO_QT = 10;

function draw() {
  background(getBackground(FEATURES.colors)); 

  let lineset = lineset_make();
  let stroke_rescale = Math.min(windowWidth, windowHeight) / 1500;

  const start = {x: 0, y: 0};
  let pt = start;
  let line = line_make();
  line.points.push(pt);
  const steps = Math.ceil(FEATURES.steps / FEATURES.stepsize);
  let keep = false;
  for (let i = 0; i < steps; i++) {
    let offset = mul(noiseToVec(noise2d(pt, FEATURES.noisescale)), FEATURES.stepsize);
    let nxt = add(offset, pt);
    pt = nxt;
    line.points.push(pt);
  }

  if (FEATURES.renorm > 0) {
    line = line_norm(line, FEATURES.renorm);
  }

  line.end = 100000;
  line.stroke = 'red';
  line.stroke_weight = 10;
  //lineset.lines.push(line);

  for (let k = 0; k < FEATURES.norms; k++) {
    const randrescale = randfloat(0.5, 1.)
    const color = getColor(FEATURES.colors, k);
    const strokeweight = randfloat(FEATURES.strokeweight / 10, FEATURES.strokeweight);
    const trunct1 = FEATURES.truncate ? randfloat(0.67, 1.0) ** 2 : 1.0;

    for (const repeat of FEATURES.repeats) {
      const fd = (t) => (repeat.scaleoffset + Math.sin(noise(t * FEATURES.normnoisescale) * 2 * Math.PI)) * repeat.scale + Math.sin(noise(t / 100)) * FEATURES.normjiggle
      // const fd = (t) => (repeat.scaleoffset + Math.sin(t * FEATURES.normnoisescale)) * repeat.scale + Math.sin(noise(t / 100)) * FEATURES.normjiggle
      const normed = line_norm(line, FEATURES.rescale * (k + 1) * randrescale * FEATURES.normscale + repeat.offset, undefined, fd);
      const trunced = line_truncate(normed, trunct1);
      const dashed = line_dash(trunced, [randfloat(1, 12), randfloat(1, 12), randfloat(1, 12)]);
      dashed.stroke = color;
      dashed.stroke_weight = strokeweight * stroke_rescale;

      lineset_extend(lineset, dashed);
    }
  }


  if (FEATURES.reshuffle) {
    lineset.lines.sort((line1, line2) => line1.end - line2.end);
  }

  lineset = lineset_center(lineset, {x: 0, y: 0}, {x: windowWidth, y: windowHeight}, Math.min(windowWidth, windowHeight) / 10);
  lineset_draw(lineset);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

