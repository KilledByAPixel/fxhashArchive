// PRNG
S=Uint32Array.from([9,7,n=t=5,3]);
R=(a=1)=>a*(t=S[3],S[3]=S[2],S[2]=S[1],S[1]=n=S[0],t^=t<<11,S[0]^=(t^t>>>8)^(n>>>19),S[0]/2**32);
[...fxhash+'Kallisti'].map(c=>R(S[3]^=c.charCodeAt()*23205));

// some math defs and functions
({min,max,abs,sign,PI}=Math);TAU=PI*2;
L=(N,f)=>[...Array(N)].map((_,i)=>f(i));
T=(a=1)=>a*(R()-R());
$f={};

// parse URL params
[mres,N_frames]=location.hash.substr(1).split(';').map(v=>v-0);
mres||=2;
N_frames||=599;

NPTS=100000;
pk=c=>(t=c.split(','))[t.length*R()|0];
txt=pk('hypo,ico,ortho,iso,mono,poly,di')+pk('metric,gonal,topic,tec,tonic,lithic')+' '+pk('energy,space,time,unit,void,singularity,zero,omni,future,vacuum,plasma,mind')+' '+pk('mega,pre-,proto,re,con,post-,co,para,,')+pk('mecc,tank,gon,vex,car,kit,vec,cub,Q-,blok,bit,code')+pk('z,c,t,')+pk('er,ity,ard,oid,ix,ion,oge,on')+' '+pk(o='000,00,0,1,2,3,5,7,8,9,Q,X,A,P,O,I,U')+pk(o)+pk(o)+pk('-i,-ii,-iv,-v,-vi,-ix,-x,-xx,');
txt=txt.split(' ').map(w=>w[0].toUpperCase()+w.substr(1)).join(' ');
$f.title=txt;

// select colours
let i=5*R()*R()**.3|0;
let a=[1,2,0,3,.2+R(.2)][i];
$f.color_sat=['yes','more','clean','pop','desat'][i];

let sat=x=>{x=min(max(x,0),1);return x*x*(3-2*x)};
let G=1.8;
let cf=_=>{
  let r=R();
  let b=R(.9);
  let g=R(.2)+(.6+R(.1))*min(r,b);
  let m=(r+g+b)/3;
  return `W(${[r,g,b].map((v,i)=>(a>0?sat(m+(v-m)*a):v)**G)})`;
};

cols = [`mix(W(1),${cf()},${R(.6)})`, cf(), cf(), `mix(W(0),${cf()},${R(.6)})`];

// select fractal transformation params
let M; // array of transformation param objects
function tf({x,y}, n) {
  // applies the transformation in Javascript
  let m = M[n], 
    s0 = max(m.s[0],sign(x)), s1 = max(m.s[1],sign(y)), s2 = max(m.s[2],sign(y));
  return {
    x: m.x + x*m.xx + y*m.xy + x*x*m.xxx*s0 + y*y*m.xyy*s1 + x*y*m.xxy*s2,
    y: m.y + x*m.yx + y*m.yy + x*x*m.yxx*s0 + y*y*m.yyy*s1 + x*y*m.yxy*s2
  }
}

let p0 = _=>({x:T(.1),y:T(.1)}); // random start point
let rk = _=>R(4)|0; // random transformation index
let rs = _=>R()<.5 ? -1 : 1; // random sign

let mx,my,sz = 99,sd=99, limm=8, ti=0, md = 999, dlimm = 99,d_i=0,avg_d=0;
let v1=.2,v2=v1+.1+R(.4); // adjustment factors
while (sz>limm || md>dlimm || avg_d < .93) {
  M = [ // start with four quadrants
    {x:-.5, y: -.5},
    {x:-.5, y:  .5},
    {x: .5, y: -.5},
    {x: .5, y:  .5},
  ];
  for (let i = 0; i < 4; i++) {
    let m=M[i],a,b,aa,bb;
    m.s = L(3,_=>max(-1,(R(5)|0)-3)); // random sign flips
    if (R() < .5) { // scale by .5, mirror and/or rotate the quadrant
      m.xx = .5*rs(); m.xy = 0;
      m.yx = 0; m.yy = .5*rs();   
      a=v1;b=v2;aa=v1;bb=v2;
    } else {
      m.xx = 0; m.xy = .5*rs();
      m.yx = .5*rs(); m.yy = 0;    
      a=v2;b=v1;aa=v2;bb=v1;
    }
    m.x += T(.3); m.y += T(.3); // random offset
    m.xx += T(a); m.xy += T(b); // more random on the flip scale
    m.yx += T(b); m.yy += T(a);

    m.xxx = T(aa); m.yxx = T(bb); // non linear factors
    m.xyy = T(bb); m.yyy = T(aa);
    m.xxy = T(.3); m.yxy = T(.3);
  }

  // now to test whether the fractal is somewhat stable
  let xlo = 9999, ylo=9999, xhi=-9999,yhi=-9999;
  // check for runaway transformation sequences
  md=-9999;
  for (let ek=0; ek < 128; ek++) {
    let p = p0(),nk=2+R(2)|0,kk=L(nk,_=>rk());
    for (let i = 0; i < 150; i++) {
      p = tf(p, i<20+R(120-i)?rk():kk[i%nk]);
      let d = p.x**2+p.y**2;
      if (d>md) md=d;
      if (d>dlimm) break;
    }
    if (md>dlimm) break;
  }

  // measure size and some other things
  let d_sum=0; 
  d_i=0;
  for (let ek=0; ek < (md>dlimm?0:16); ek++) {
    let p = p0();
    for (let i = 0; i < 999; i++) {
      let k = rk();
      if (i>20){ // contraction factor
        const e = .001;
        let p0=tf({x:p.x-e,y:p.y},k),p1=tf({x:p.x+e,y:p.y},k);
        let p2=tf({x:p.x,y:p.y-e},k),p3=tf({x:p.x,y:p.y+e},k);
        let d = (p1.x-p0.x)*(p3.y-p2.y)-(p1.y-p0.y)*(p3.x-p2.x);
        d_sum+=abs(d/e/e);d_i++;
      }
      p = tf(p, k);
      if (p.x < xlo) xlo = p.x;
      if (p.y < ylo) ylo = p.y;
      if (p.x > xhi) xhi = p.x;
      if (p.y > yhi) yhi = p.y;
      if (xhi-xlo>limm || yhi-ylo>limm) break;
    } 
  }
  mx = (xlo+xhi)/2; my = (ylo+yhi)/2;
  sz = max(xhi-xlo,yhi-ylo);
  sd = max(xhi,-xlo)**2+max(yhi,-ylo)**2;
  avg_d = d_i>0?d_sum/d_i:0;
}
$f.avg_contraction = avg_d.toFixed(2);
$f.scale_ratio = ((sd/md)).toFixed(2);

// common fragment shader header
K=`#version 300 es
precision highp float;
`+`,TAU ${TAU},S smoothstep,W vec3,V vec2,X vec4,L length,N normalize,F float
`.replace(/,/g,`
#define `);

// vertex shader for the fractal points
const vc = `uniform V res;
uniform int NV;
uniform uvec4 RA;

out X col;
out F size;

// transformation params
const mat2[] mr = mat2[](${M.map(m=>`mat2(${[m.xx,m.yx,m.xy,m.yy]})`)});
const mat4x2[] mx = mat4x2[](${M.map(m=>`mat4x2(${[m.x,m.y,m.xxx,m.yxx,m.xyy,m.yyy,m.xxy,m.yxy]})`)});
const W[] ms = W[](${M.map(m=>`W(${m.s})`)});

// apply the transformation function in GLSL
V tf(V p, uint i) { 
  return mr[i]*p + mx[i]*X(1,p.xyx*p.xyy*max(sign(p.xyy),ms[i])); 
}

const V cp = V(${[mx,my]}); // centre point
const F scale = ${1.9/sz};

// the four "colours" of each transformation, in some sense
// they count the amount of hits per transform for each 
// colour channel. (except they get mixed, see below)
const X[] bas = X[](X(1,0,0,0),X(0,1,0,0),X(0,0,1,0),X(0,0,0,1));

void main() {
  // resolution aspect ratio stuff
  F px = 1/max(res.x, res.y);
  V aspect = res.yx * px;

  // brew some random numbers
  // prime numbers closest to quasi-random constants qphi(4) times 2**32
  const uvec4 H=uvec4(2313257647u,2700274807u,3152041561u,3679390633u);
  uvec4 RU = (RA+uint(gl_VertexID))*H;
  X RF = X(RU)/${2**32};

  V p = (RF.xy-RF.zw)*.1; // random start point
  X cc = X(0);
  for (F i=0; i<50; i++) {
    uint k = RU.x & 3u; // random transformation index
    p = tf(p, k);
    cc = mix(cc, bas[k], .4); // mixing occurs here, for "memory"
    RU = uvec4(RU.yzw,RU.x >> 2u); // rotate random vector by 2 bits
  }
  p -= cp; p *= scale;  // centre and scale
  col = cc;
  gl_Position = vec4(p * aspect, 1, 1);
  size = .0015/px;
  gl_PointSize = size;
}`;

// fragment shader for the points, draws a fuzzy dot
const fc = `
in F size;
in X col;
out vec4 outColor;

void main() {
  V pc = gl_PointCoord*2-1;
  F dd = length(pc);
  outColor=col*S(1,0,dd);  
}`;

// post proc vertex shader (full screen quad)
let postv = `in vec2 apos;
out vec2 u;

void main() {
  u = apos*2-1;
  gl_Position = X(u,0,1);
}`;

const RT=(n=3)=>`vec${n}(${L(n,_=>R(TAU))})`;
const RF=(n=3)=>`vec${n}(${L(n,_=>2**(R(.6)-.3))})`;

// decide background
let bgcode;
if (R()<.2) {
  // clean background
  [sr,$f.background]=R()<.3?[0,'dark']:[8,'bright'];
  $f.bg_roughness=0;
  rr=(n,a)=>`W(${(sr+R(n)+a)/13})`;
  c0=rr(3,2);c1=rr(3,1);c2=rr(3,0);c3=rr(3,1);c4=rr(0,0);
  s1=.5-R(.2);s3=.5+R(.2);
  bgcode=`F d = length(uv)*.65;
    W cc = ${c0};
    cc = mix(cc,${c1},clamp(d*${s=1/(s1-.1)}+${-.1*s},0,1)); // .1 to s1
    cc = mix(cc,${c2},clamp(d*${s=1/(.5-s1)}+${-s1*s},0,1)); // s1 to .5
    cc = mix(cc,${c3},clamp(d*${s=1/(s3-.5)}+${-.5*s},0,1)); // .5 to s3
    cc = mix(cc,${c4},clamp(d*${s=1/(1-s3)}+${-s3*s},0,1)); // s3 to 1
    cc = pow(cc,W(2.2));
    `;
} else {
  // alien background
  let ch=.1+R(.4);
  $f.background='alien';
  $f.bg_roughness=(ch*200|0);
  bgcode=`const W bc0 = W(0), // background palette
          bc1=W(.08)+.04*mix(${cols[R(4)|0]},${cols[R(4)|0]},.5), 
          bc2=W(.16)+.08*mix(${cols[R(4)|0]},${cols[R(4)|0]},.5);

  // get a lot of noise
  V w0=abs(wob2(uv)-.2), 
    w1=abs(wob2(uv*2+7)-.2), 
    w2=abs(wob2(uv*4-19)-.2);

  W cc = bc2;

  // two layers of mildly agitated noise
  F bd = box2(uv,V(.5,.75))-.2+.02*w1.y;
  bd = mix(bd+.4, bd, S(0,${ch},w0.x-.4*S(-.4,0,bd)));
  bd = mix(bd+.2, bd, S(0,${ch},w1.x-.2*S(-.2,0,bd)));
  bd = mix(bd+.1, bd, S(0,${ch},w2.x-.1*S(-.1,0,bd)));
  cc = mix(cc,bc1,aastep(0,bd));

  bd = box2(uv,V(.77))-.2+.02*w1.x;
  bd = mix(bd+.4, bd, S(0,${ch},w0.y-.4*S(-.4,0,bd)));
  bd = mix(bd+.2, bd, S(0,${ch},w1.y-.2*S(-.2,0,bd)));
  bd = mix(bd+.1, bd, S(0,${ch},w2.y-.1*S(-.1,0,bd)));
  cc = mix(cc,bc0,aastep(0,bd));

  // vignette
  cc *= .2+.8*S(1.5,.5,L(uv));`
}

// post proc frag shader
let postf = `uniform V res;
uniform F NV;
uniform F frame;
uniform sampler2D buf;
in V u;
out X outColor;

const mat4x3 pal = mat4x3(${cols})*1.2; // check it out, it's a palette matrix :D
const V H2 = V(0.5698402909980532, 0.7548776662466927);

F aastep(F d, F v) {
  F w=L(V(dFdx(v), dFdy(v)))*.8;
  return S(d-w,d+w,v);
}

V wob2(V q) {
  // 2D wobbly noise
  W p = W(q*7,5);
  return V(${L(2,_=>`dot(sin(p.xyz*${RF()}+2*sin(p.yzx*${RF()}+${RT()})+${RT()}),sin(p.zyx*${RF()}+2*sin(p.zxy*${RF()}+${RT()})+${RT()}))`)});
}

F box2(V p,V b) {
  // 2D box SDF
  V d = abs(p)-b;
  return L(max(d,0))+min(max(d.x,d.y),0);
}

void main() {
  F dens = 2523235/(523+NV*frame); // point density
  V aspect = max(res.x, res.y)/res.yx;
  W dit=fract(sin(W(u,1)*mat3(${L(9,_=>1+R())})*999)*9999);  
  V uv = u*aspect;

  // calc the background
  ${bgcode}

  // drop shadow
  F ss = 0;
  for (F i = 0; i < 32; i+=1) {
    V d = fract(i*H2+dit.zy*55);
    d *= .015*V(-1,1);
    ss += clamp(dot(texture(buf,.5*u+.5+d/aspect),X(1)),0,1);
  }
  ss *= .95/32;
  cc = mix(cc,W(0),ss);

  // colour transform
  X tx = texture(buf, .5*u+.5);
  F sum = dot(tx,X(1));
  tx /= 7/dens+sum;
  cc = mix(cc,pal*tx,clamp(sum,0,1));

  outColor = X(pow(cc,W(1/2.2))+dit/256,1);
  }`;


// here comes the boring GL setup stuff
const gl = c.getContext('webgl2',{alpha:false,preserveDrawingBuffer:true});
gl.getExtension('EXT_color_buffer_float');
gl.getExtension('OES_standard_derivatives');

const Shader = (typ, src)=>{
  const s=gl.createShader(typ);
  gl.shaderSource(s,K+src.replace(/([^a-zA-Z_0-9.])([0-9]+)(?![.0-9u])/g,'$1$2.').replace(/([0-9.]e-[0-9]+)\./gi,'$1'));
  gl.compileShader(s);
  return s;
}

const Prog = (vert_src, frag_src, uniforms) => {
  let pg = gl.createProgram();
  const vs = Shader(gl.VERTEX_SHADER, vert_src);
  const fs = Shader(gl.FRAGMENT_SHADER, frag_src);
  gl.attachShader(pg, vs);
  gl.attachShader(pg, fs);
  gl.linkProgram(pg);
  gl.useProgram(pg);

  if (!gl.getProgramParameter(pg, gl.LINK_STATUS)) {
    // something went wrong with the link
    console.log("Link failed:\n", gl.getProgramInfoLog(pg));
    console.log("VS LOG:\n", gl.getShaderInfoLog(vs));
    console.log("FS LOG:\n", gl.getShaderInfoLog(fs));
    throw ("Program failed to link (see console for error log).");
  }
  let loc = {};
  for (let uni of uniforms.split(' ')) {
    loc[uni] = gl.getUniformLocation(pg, uni);
  }
  return [pg,loc];
}

let [postprog, postloc] = Prog(postv, postf, 'res frame NV');
let postloc_a = gl.getAttribLocation(postprog, 'apos');
gl.enableVertexAttribArray(postloc_a);
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, Float32Array.of(0,1,0,0,1,1,1,0), gl.STATIC_DRAW);
gl.vertexAttribPointer(postloc_a, 2, gl.FLOAT, false, 0, 0);

let [program,loc] = Prog(vc, fc, 'res NV RA');
let fb,tex;

let res = {}, frame_count=0, running=true;
let start_time, elapsed;

let w = window.innerWidth, h = window.innerHeight;
res.x = c.width = mres * w * devicePixelRatio|0; 
res.y = c.height = mres * h * devicePixelRatio|0;
c.style.width = w+'px';
c.style.height = h+'px';

gl.deleteTexture(tex);
gl.deleteFramebuffer(fb);
tex=gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D,tex);
gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA32F,res.x,res.y,0,gl.RGBA,gl.FLOAT,null);
L(4,i=>gl.texParameteri(gl.TEXTURE_2D,10240+i,i<2?gl.NEAREST:gl.CLAMP_TO_EDGE));
fb=gl.createFramebuffer();

gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);
gl.clearColor(0,0,0,0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.viewport(0, 0, res.x, res.y);

let prev_time = performance.now();
let fps = 30;
function render(time) {
  let ga = frame_count / N_frames;
  let df = frame_count%30 == 5 || frame_count == N_frames + 1;

  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.useProgram(program); // enable the IFS program
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE);
  gl.uniform2f(loc.res, res.x, res.y);
  gl.uniform1i(loc.NV, NPTS);
  gl.uniform4uiv(loc.RA,Uint32Array.from(L(4,_=>(R(),n))));
  gl.drawArrays(gl.POINTS, 0, NPTS);

  if (df) {
    // do post processing
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.useProgram(postprog);
    gl.blendFunc(gl.ONE, gl.ZERO);
    gl.uniform2f(postloc.res, res.x, res.y);
    gl.uniform1f(postloc.frame, frame_count);
    gl.uniform1f(postloc.NV, NPTS);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  if (frame_count>N_frames && df) running=false;
  frame_count++;
  document.title = running?`${100*frame_count/N_frames|0}% -- ${txt}`:`${txt}`;
  if(running)requestAnimationFrame(render);
}
requestAnimationFrame(render);

// features
console.table($f);
$fxhashFeatures=$f;