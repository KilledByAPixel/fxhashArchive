const vv = `#version 300 es
  precision mediump float;
  in vec3 loc;
  out vec2 loc_xy;
  void main() {
    vec3 xyz = vec3(loc.xy * 2. - 1., loc.z);
    loc_xy = xyz.xy;
    gl_Position = vec4(xyz, 1.0);
  }`;

const ff = `#version 300 es
  precision mediump float;
  
  in vec2 loc_xy;
  out vec4 fragColor;
  
  uniform vec3 u_color[100];
  uniform float u_color_len;
  uniform float u_seed;
  uniform float u_time;
  uniform float u_aspect_ratio;
  uniform float u_boolean_modifier;

  struct Quad {
    float xmin;
    float xmax;
    float ymin;
    float ymax;
    int id;
    float uid;
  };

  vec3 permute(vec3 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
  }

  float simplex_slow(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float bnoise( float x ) {
    x *= 5.29521694;
    float i = floor(x);
    float f = fract(x);
    float s = sign(fract(x/2.0)-0.5);
    float k = fract(i*.1731);
    return s*f*(f-1.0)*((16.0*k-4.0)*f*(f-1.0)-1.0);
  }

  float simplex(vec2 v) {
    return bnoise(v.x);
  }

  float ur(vec2 v) {
    return 0.5 * (simplex(v) + 1.);
  }

  float ut(float x) {
    return ur(vec2(u_time * 0.2 + x + u_seed));
  }

  float r1(vec2 xy, float f, float s) {
    return simplex_slow(vec2(simplex_slow(vec2(xy * f + s + 5.43)), simplex_slow(vec2(xy * f + s + 8.85))));
  }

  float r2(vec2 xy, float f, float s) {
    return simplex_slow(vec2(r1(xy, f, s + 4.13), r1(xy, f, s + 1.11)));
  }

  float r3(vec2 xy, float f, float s) {
    return simplex_slow(vec2(r2(xy, f, s + 7.54), r2(xy, f, s + 6.32)));
  }

  Quad getQuad(vec2 xy, float d, float s, float xmin, float xmax, float ymin, float ymax) {

    Quad o;
    o.xmin = xmin;
    o.xmax = xmax;
    o.ymin = ymin;
    o.ymax = ymax;
    o.id = 0;
    o.uid = s;
    bool terminate = false;
    float small = 0.002;

    for (int i=0; i<int(d); i++) {
      float e = max(0.1, max(small / (o.xmax - o.xmin), small / (o.ymax - o.ymin)));
      float t = mix(e, 1. - e, ur(vec2(o.uid + 887.)));

      if ((o.xmax - o.xmin <= small * 2.) || (o.ymax - o.ymin <= small * 2.)) {
        terminate = true;
      }

      if (terminate == false) {
        if ((ur(vec2(o.uid + 771.)) < 0.4) && (i >= 3)) {
          terminate = true;
        }
        if (ur(vec2(o.uid  + 156.)) < 0.5) {
          float sp = mix(o.xmin, o.xmax, t);
          if (xy.x < sp) {
            o.uid += pow(2., float(i));
            o.id |= int(pow(2., float(i)));
            o.xmax = sp;
          }
          else {
            o.xmin = sp;
          }
        }
        else {
          float sp = mix(o.ymin, o.ymax, t);
          if (xy.y < sp) {
            o.uid += pow(2., float(i));
            o.id |= int(pow(2., float(i)));
            o.ymax = sp;
          }
          else {
            o.ymin = sp;
          }
        }
      }
    }
    return o;
  }

  vec2 rotate(vec2 c, vec2 xy, float angle) {
    return vec2(
      (cos(angle) * (xy.x - c.x)) + (sin(angle) * (xy.y - c.y)) + c.x,
      (cos(angle) * (xy.y - c.y)) - (sin(angle) * (xy.x - c.x)) + c.y
    );
  }

  float sdf_triangle(vec2 p) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0, 0.0 );
    return clamp(-length(p)*sign(p.y), 0., 2.);
  }

  float sdf_box(vec2 p ) {
    vec2 b = vec2(0.5, 0.25);
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
  }

  vec3 draw(vec2 xy, float layer_seed) {
    Quad a = getQuad(xy, 10., layer_seed + u_time * 0.1, -u_aspect_ratio, u_aspect_ratio, -1., 1.);
    vec3 color = u_color[int(floor(mod(float(a.id), u_color_len)))];

    
    Quad o = getQuad(xy, 10., float(a.id) + u_time * 0.5, a.xmin, a.xmax, a.ymin, a.ymax);
    if (ur(vec2(float(o.id) + 158.)) < 0.15) {
      color = u_color[int(floor(mod(float(o.id), u_color_len)))];
    }
    
    if (u_boolean_modifier < 4.) {
      if (ur(vec2(float(a.id))) < 0.8) {

        vec2 cen1 = vec2(
          simplex(vec2(u_time * 0.2 + 51. + layer_seed)),
          simplex(vec2(u_time * 0.2 + 12. + layer_seed)));
        vec2 cen2 = vec2(
          simplex(vec2(u_time * 0.2 + 413. + layer_seed)),
          simplex(vec2(u_time * 0.2 + 555. + layer_seed)));

        float rad1 = 1.;
        float rad2 = 1.;
        if (abs(u_boolean_modifier - 1.) < 1e-4) {
          rad1 = mix(10., 40., ur(vec2(u_time * 0.2 + 133. + layer_seed)));
          rad2 = mix(2., 6., ur(vec2(u_time * 0.2 + 615. + layer_seed)));
        }
        else if (abs(u_boolean_modifier - 2.) < 1e-4) {
          rad1 = mix(1., 4., ur(vec2(u_time * 0.2 + 133. + layer_seed)));
          rad2 = mix(2., 6., ur(vec2(u_time * 0.2 + 615. + layer_seed)));
        }
        else if (abs(u_boolean_modifier - 3.) < 1e-4) {
          rad1 = mix(1., 2., ur(vec2(u_time * 0.2 + 133. + layer_seed)));
          rad2 = mix(1., 2., ur(vec2(u_time * 0.2 + 615. + layer_seed)));
        }

        float c1 = 0.;
        float c2 = 0.;
        if (abs(u_boolean_modifier - 3.) < 1e-4) {
          c1 = floor(distance((xy + r3(xy,0.01,88.) + cen1) * rad1, vec2(0.))) + float(a.id);
          c2 = floor(distance((xy + r3(xy,0.01,74.) + cen2) * rad2, vec2(0.5))) + float(a.id);
        }
        else {
          c1 = floor(distance((xy + cen1) * rad1, vec2(0.))) + float(a.id);
          c2 = floor(distance((xy + cen2) * rad2, vec2(0.5))) + float(a.id);
        }
        
        float s1 = c1 + c2;
        color = u_color[int(mod(s1, u_color_len))];
        
        if (ur(vec2(float(o.id) + 158.)) < 0.15) {
          color = u_color[int(mod(float(o.id) + s1, u_color_len))];
        }
      }
    }

    else if (u_boolean_modifier < 8.) {
      if (ur(vec2(float(a.id))) < 0.75) {
        int nloop = 4;
        if (u_boolean_modifier < 6.) {
          nloop = 2;
        }
        float s1 = 0.;
        for (int i=1; i<nloop; i++) {

          if ((abs(u_boolean_modifier - 4.) < 1e-4) || (abs(u_boolean_modifier - 6.) < 1e-4)) {
            s1 += float(abs(floor(sdf_triangle(rotate(vec2(0.), xy, ut(143. + float(i)) * 6.28) + vec2(ut(234. + float(i)),ut(456. + float(i)))) * 8.) - float(i))) + float(a.id);
          }
          else {
            s1 += float(floor(sdf_box(rotate(vec2(0.), xy, ut(143. + float(i)) * 6.28) + vec2(ut(234. + float(i)),ut(456. + float(i)))) * 2. * float(i))) + float(a.id);
          }
        }
        color = u_color[int(mod(s1, u_color_len))];

        if (ur(vec2(float(o.id) + 158.)) < 0.15) {
          color = u_color[int(mod(float(o.id) + s1, u_color_len))];
        }
      }
    }
    
    return color;
  }

  void main() {
    fragColor = vec4(draw(loc_xy * vec2(u_aspect_ratio,1.), u_seed), 1.);
  }`;


const jcol = (...xs) => [].concat(...xs);
const rcol = (x, r) => [...Array(r).keys()].map(i => x);
const gcol = (l) => [...Array(l).keys()].map((x,i) => [256/l*i,256/l*i,256/l*i])
const choose = (o) => o[floor(fxrand() * (o.length-1e-4))];

var aspect_ratio, boolean_name, colors, color_len, color_name, speed_name, u_boolean_modifier, u_seed, u_speed;
var canvas = null;
var frame_number = 0;
var paused = false;
var scanvas = null;

function setup() {

  frameRate(30);
  canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);

  aspect_ratio = width / height;
  u_seed = fxrand() * 1e3;

  const cset_a = [[181,222,204],[52,69,76],[255,221,0],[72,155,110],[235,83,36],[253,212,189],[90,130,179]];
  const cset_c = [[235,83,36],[253,212,189],[90,130,179],[255,221,0]];
  let color_table = {
    "Cupboard" : jcol(rcol([28,66,134],48), rcol([238,240,236],12), cset_a),
    "Kite" : jcol(rcol([21,18,17],48), rcol([238,240,236],12), cset_a),
    "Radial Pleat" : jcol(rcol([67,119,66], 48), rcol([238,240,236],12), cset_a),
    "Pleat" : jcol(rcol([26,116,68], 48), rcol([238,240,236],12), cset_a),
    "Helmet" : jcol(rcol([245,236,194],16), rcol([21,18,17],8), cset_c),
    "Book" : jcol(rcol([238,240,236],16), gcol(8), cset_a),
    "Blintz" : jcol(rcol([240,235,231],8),rcol([43,43,43],8),[[240,207,13],[58,173,208],[219,82,148]]),
    "Preliminary" : jcol(rcol([237,225,212],12), rcol([30,19,6],6), [[39,88,144],[217,56,45],[231,149,40],[109,160,216]]),
    "Umbrella" : jcol(rcol([223,63,53],24), rcol([234,224,212],12), rcol([35,30,34],12), [[35,30,34],[234,224,212],[249,182,4],[209,124,155],[246,126,38],[202,145,125],[223,63,53]]),
    "Pig" : jcol(rcol([240,235,231],8),rcol([43,43,43],16)),
    "Windmill" : jcol(rcol([236,217,196],16),rcol([17,61,59],3),rcol([236,167,75],3),[[220,77,44]]),
    "Fish" : jcol(rcol([223,210,182],12),rcol([26,22,25],6),[[230,194,51],[70,103,85],[171,47,45],[90,153,167],[210,153,165]])
  };
  
  [color_name,colors] = choose(Object.entries(color_table));
  [boolean_name,u_boolean_modifier] = choose(Object.entries({
    "x^2 + y^2 = r" : 0,
    "x^2 + y^2 = r/f^2" : 1,
    "x^2 + y^2 = r/f" : 2,
    "f(f(f(x)))" : 3,
    "sohcahtoa" : 4,
    "[w,h]" : 5,
    "sohcahtoa&&" : 6,
    "[w,h]&&" : 7,
    "-" : 8,
  }));
  [speed_name,u_speed] = choose(Object.entries({
    "Grandiose" : 0.001,
    "Standard" : 0.005,
    "Accelerated" : 0.009
  }));

  color_len = 100;
  colors = [...Array(color_len).keys()].map(x => choose(colors));
  colors = [...colors.flat().map(x => x / 255.)];


  scanvas = createShader(vv, ff);

  window.$fxhashFeatures = {
    "Animation Speed" : speed_name,
    "Boolean Modifier" : boolean_name,
    "Color Palette" : color_name,
  };
}

function draw() {
  background(244);
  noStroke();
  fill(255, 0, 0);
  rect(0, 0, 100, 100);
  
  shader(scanvas);
  if (frameCount <= 1) {
    scanvas.setUniform('u_color', colors);
  }
  
  scanvas.setUniform('u_color_len', color_len);
  scanvas.setUniform('u_seed', u_seed);
  scanvas.setUniform('u_time', frame_number * u_speed);
  scanvas.setUniform('u_aspect_ratio', aspect_ratio);
  scanvas.setUniform('u_boolean_modifier', u_boolean_modifier);
  rect(0, 0, width, height);
  
  if (frameCount <= 1) {
    fxpreview();
  }
  if (paused === false) {
    frame_number += 1;
  }
}

function keyPressed() {
  if (keyCode === 80) {
    paused = !paused;
  }
  if (keyCode === 83) {
    let si = 4096;
    let c = createGraphics(si * (width / height), si, WEBGL);
    let s = c.createShader(vv, ff);
    c.pixelDensity(1);
    c.noStroke();
    c.fill(0);
    c.rect(0, 0, 1, 1);
    c.shader(s);
    s.setUniform('u_color', colors);
    s.setUniform('u_color_len', color_len);
    s.setUniform('u_seed', u_seed);
    s.setUniform('u_time', frame_number * u_speed);
    s.setUniform('u_aspect_ratio', aspect_ratio);
    s.setUniform('u_boolean_modifier', u_boolean_modifier);
    c.rect(0, 0, width, height);
    c.save();
  }
}

p5.RendererGL.prototype._initContext = function() {
  this.drawingContext =
    this.canvas.getContext('webgl2', this._pInst._glAttributes) ||
    this.canvas.getContext('experimental-webgl', this._pInst._glAttributes)
};