const L = (N, f) => [...Array(N)].map((_, i) => f(i));
let R=(a=1)=>fxrand()*a;

const gl = c.getContext('webgl');
gl.getExtension('OES_standard_derivatives');

const TAU = 6.283185307179586;
const H = .5 + .5 * 5 ** .5;
const src_vert = `attribute vec2 a_position; 
void main() {
  gl_Position = vec4(a_position, 1.0, 1.0);
}`;

const src_frag = `precision highp float;

uniform vec2 res;
uniform vec4 RA;
uniform vec4 RB;
uniform vec4 RC;
uniform vec4 RD;

#define S smoothstep
#define TAU 6.283185307179586

mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

const float H1 = ${H};
const vec2 H2 = vec2(0.5698402909980532, 0.7548776662466927);
const vec3 H3 = vec3(0.5497004779019702, 0.671043606703789, 0.8191725133961644);
const vec4 H4 = vec4(0.53859725722361, 0.6287067210378086, 0.733891856627126, 0.8566748838545029);

float wobl(vec3 p){
  // basic wobblies (noise like)
  return dot(
    sin(p.xyz+2.*sin(p.yzx*H3.xyz+RA.xyz)+RB.xyz),
    sin(p.zyx+2.*sin(p.zxy*H3.yzx+RC.xyz)+RD.xyz));
}

vec4 ww(vec2 uv) {
  // advanced multi wobbly
  vec3 v=vec3(
    wobl(vec3(uv,1.)),
    wobl(vec3(uv*rot(TAU*H1)*H2,31.)),
    wobl(vec3(uv*rot(TAU*H1*H1)*H2*H2,23.)));
  return vec4(v, abs(v.x*v.y*v.z));
}

float rnd(vec2 uv) {
  return fract(dot(sin(uv*(RB.xy*333.+3333.)+RA.xy),RC.xy*222.+2222.));
}

float wh(vec2 uv) {
  // wobbly height
  return 1. - exp(ww(uv).w*-12.);
}

vec3 pix(vec2 uv) {  
  // vignette
  vec2 aw = vec2(max(res.x,res.y), min(res.x,res.y));
  float as = aw.x / aw.y;
  float rr = .15 * min(as, 1.);
  vec2 kk = .48 * (res/aw.y) - rr;
  float vign = S(rr+.05, rr-.25, length(uv-clamp(uv,-kk,kk))) * .9 + .1;

  vec3 L = normalize(vec3(-1., 1.25, 1.5)); // light direction

  const vec2 e = vec2(.001,.0);
  const float scale=13.;
  uv *= scale;

  float hh = wh(uv); // height  
  vec3 n = normalize(vec3(vec2(wh(uv-e)-wh(uv+e),wh(uv-e.yx)-wh(uv+e.yx))/e.x,3.*hh)); // normal

  float col = step(.8, hh); // blob mask

  // noise where blob is not
  float ns = S(.8,.9,wh(uv+L.xy*.15));
  float nz = mix(mix(.06,.03,ns)*rnd(uv), 0., col);
  nz *= .5+.5*step(.5,wh(uv*1.5+23.)-hh*.7);
  nz *= .2+.8*S(-1.,8.,length(uv));

  float dif = max(0., dot(L, n) * col); // diffuse light
  float spec = pow(dif, 12.); 
  spec=mix(spec,spec*spec,.7); // spectacular light  

  vec3 m = step(0.,ww(uv).xyz); // material

  // pattern  
  uv += .6 * n.xy; // distort by normal for 3D "bend" effect  
  uv *= rot(TAU * (m.z * 3. - .5 - m.y * .25 + m.x * .2) / 18.); // different rotations based on pattern (todo: use dot)
  uv *= (1. + m.y * 3.2) * 1.4; // scale
  float f = .7 * m.x - .4 * m.y+.03; // when m.y=0 below, f switches between dots/squares. otherwise switches between thick/thin lines.
  f = mix(sin(uv.x*TAU)*sin(uv.y*TAU)+f, fract(uv.y)-f*.6, m.y); // m.y mixes between dot-squares and lines
  f *= m.z-.5; // inverts based on m.z

  col *= step(0.,f); // mask blob with pattern
  vec3 rgb = col * mix(vec3(1.,.9,.7), vec3(.8,.9,1.), step(.8, hh));

  rgb = S(-1., 1., rgb * dif + spec) * 2. - 1.; // apply lighting

  return vec3(rgb+nz)*vign;
}

void main()
{
    // Normalized pixel coordinates (from 0 to 1)    
    vec2 uv = gl_FragCoord.xy;
    uv = (uv.xy - .5 * res)/min(res.x,res.y);
    vec3 col = vec3(0);
    const float N = 32.;
    for (float i = 0.; i < N; i += 1.) {
      vec2 d = fract(i * H2 + H4.xy) - .5;
      col += pix(uv + 1.3 * d.xy / res.y);
    }
    vec3 dit = fract(sin(vec3(uv,1.)*mat3(${L(9,R)})*999.)*9999.)/256.;
    col *= (1. / N);
    gl_FragColor = vec4(pow(col, vec3(1./2.2))+dit,1.0);
}`;

const R4 = () => [R(TAU),R(TAU),R(TAU),R(TAU)];

const loc = {};
let RA, RB, RC, RD;

const Shader = (typ, src)=>{
  const s=gl.createShader(typ);
  gl.shaderSource(s,src);
  gl.compileShader(s);
  return s;
}

let program = gl.createProgram();
const vs = Shader(gl.VERTEX_SHADER, src_vert);
const fs = Shader(gl.FRAGMENT_SHADER, src_frag);
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  // something went wrong with the link
  console.log("Link failed:\n", gl.getProgramInfoLog(program));
  console.log("VS LOG:\n", gl.getShaderInfoLog(vs));
  console.log("FS LOG:\n", gl.getShaderInfoLog(fs));
  throw ("Program failed to link (see console for error log).");
}

const uniforms = 'res RA RB RC RD'.split(' ');
for (let uni of uniforms) {
  loc[uni] = gl.getUniformLocation(program, uni);
}

const vertices = Float32Array.of(-1, 1, -1, -1, 1, 1, 1, -1);
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
const loc_a_position = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(loc_a_position);
gl.vertexAttribPointer(loc_a_position, 2, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

RA = R4();
RB = R4();
RC = R4();
RD = R4();

const res = {};
function resize() { 
  const w = window.innerWidth;
  const h = window.innerHeight;
  res.x = c.width = w * devicePixelRatio|0; 
  res.y = c.height = h * devicePixelRatio|0;
  c.style.width = w+'px';
  c.style.height = h+'px';
  dirty = true;
}
resize();
window.addEventListener('resize', resize);

function render() {
  if (dirty) {
    gl.viewport(0, 0, c.width, c.height);
    gl.uniform2fv(loc.res, [res.x, res.y]);
    gl.uniform4fv(loc.RA, RA);
    gl.uniform4fv(loc.RB, RB);
    gl.uniform4fv(loc.RC, RC);
    gl.uniform4fv(loc.RD, RD);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    dirty = false;
  }
  requestAnimationFrame(render);
}
render();