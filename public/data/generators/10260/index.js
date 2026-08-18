// ANGRY NOISE by Piter Pasma

// loop function
L=(N,f)=>[...Array(N)].map((_,i)=>f(i));

// PRNG
S=Uint32Array.from([9,7,n=5,t=3]);
R=(a=1)=>a*(t=S[3],S[3]=S[2],S[2]=S[1],S[1]=n=S[0],t^=t<<11,S[0]^=(t^t>>>8)^(n>>>19),S[0]/2**32);
[...fxhash+'saltNaCl'].map(c=>R(S[3]^=c.charCodeAt()*23205));

// Math
({PI,sin,cos,abs}=Math);TAU=PI*2;
A=(p,{x,y},a=1)=>({x:p.x+x*a,y:p.y+y*a}); // vec2 add
H=(p,q)=>((p.x-q.x)**2+(p.y-q.y)**2)**.5; // vec2 dist
V=p=>`V(${[p.x,p.y]})`; // vec2 GLSL str

// now we write some poetry
pk=c=>(t=c.split(','))[t.length*R()|0];
(D=document).title=txt=L(2+R(3)|0,_=>`${pk('FL,BL,WL,H,GH,')}ARG${pk('L,')}`).join('');

// generate composition
ur=_=>{ // gen random thing
    let x=0,y=0,d0=(R(3)-1|0)/4,d1=R()<.5?-.25:.25;
    R()<.5?x+=d0:y+=d0;
    R()<.5?x+=d1:y+=d1;
    return {x,y,r:(R(2.5)+1.5|0)/8,t:R(4)|0};
  };
// array of things
sps=[];
// hit function
hit=p=>sps.some(s=>H(p,s)-s.r<p.r);
// doing the iterative thing
for(i=0;i<44||!sps[1];i++) {
  let p=ur();
  if(!hit(p)) sps.push(p);
}
// find offset
zz=sps.reduce((p,{x,y,r})=>({x:p.x+x*r+x,y:p.y+y*r+y,r:p.r+r+1}),{x:0,y:0,r:0});zz.x/=zz.r;zz.y/=zz.r;

// SDF for thing
sdf=s=>[`L(uv-${V(s)})-${s.r}`,`abs(L(uv-${V(s)})-${s.r-.04})-.04`,`box2(uv-${V(s)},V(${s.r*.8}))`,`abs(box2(uv-${V(s)},V(${s.r*.8-.04})))-.04`][s.t];

// generate bar; orient bar wrt first two things
[p,q]=sps;
d=A(q,p,-1);m=A(p,d,p.r/(p.r+q.r))
dl=H(p,q);d.x/=dl;d.y/=dl;if(R()<.5)[d.x,d.y]=[d.y,-d.x];
bar=`dot(uv-${V(m)},${V(d)})`;

// pick a colour
PAL=[
  null,[0,0,0],                   // black
  undefined,[1,1,1],              // white
  'damage',[1,.65,.05],           // yellow
  'cartoon grape',[.1,.03,.6],    // purple
  'cleaning spunge',[.07,.3,.45], // cyan
  'borrowed socks',[.65,.6,.55],  // light grey
  'baby food',[.99,.32,.04],      // orange
  'revenge',[.7,.03,.02],         // red
  'tongue',[.8,.07,.27],          // pink
  'snert',[.3,.5,.2],             // green
  'impact',[.04,.15,.65],         // blue
  'ash',[.3,.3,.5],               // grey blue
  ];
j=R(11.3)+.7|0;
shaded=R()<.5&&j>0;
BG=PAL[j*2+1];

// random rotate+scale+skew matrix
rr=(n,a)=>`mat2(${s=sin(t=R(TAU))*a,c=cos(t)*a,[c*n,-s*n,s,c]})`;
// random vec3 of 0..TAU
R3 = _=>`W(${L(3,_=>R(TAU))})`;

// shader header
K=`#version 300 es
precision highp float;
`+`,S smoothstep,W vec3,V vec2,X vec4,L length,N normalize,F float
`.replace(/,/g,`
#define `);

// vertex shader 
src_vert = `in V a;out V u;uniform F E,I; // does E x E tiled rendering with index I
void main() {
  F c=fract(I/E/E)*E,r=floor(c);
  c-=r;
  u=a/E+V(c,r/E)-.5;
  gl_Position = X(a*2-1,0,1);
}`;

// fragment shader
src_frag = `in V u;out X cc;
uniform V res;uniform F E;

#define TAU ${TAU}

// quasi magic numbers
const F H1=${.5*5**.5-.5};
const V H2=V(.57,.755);
const W H3=W(.55,.67,.82);

float rmin(float a, float b, float r) {
  // round minimum
  return max(r,min(a,b))-length(max(vec2(r-a,r-b),vec2(0)));
}
F box2(V p, V b) {
  // 2D SDF for a rectangle
  V d = abs(p)-b;
  return L(max(d,0))+min(max(d.x,d.y),0);
}
F w(V q){
  // this makes wobbly noise
  W p = W(q,dot(q,V(${[R(2),R(2)]})-1));
  return dot(sin(p+2*sin(p.yzx*H3+${R3()})+${R3()}),sin(p.zyx+2*sin(p.zxy*H3.yzx+${R3()})+${R3()}));
}
F thing(F g, V uv, F band, F dd, F d, F o) {
  // this makes the angry noise
  const V r = V(1,-1)*${p=1.4+R(.6)}; // p is the fBM scale factor
  F a = 1;
  for (F i = 1; i < 8; i += 1) {
    a *= ${1/p};
    uv = uv.yx*r+fract(i*H2)*6-3; // rotate 90 deg, scale by p and shift
    g = rmin(g, -rmin(a*dd-g,-.2*(abs(w(uv*6)-o)-d),a*band), a*band); 
  }  
  return g;
}

W pix(V uv) {
  V p = uv;
  // bar goes on the background
  F bx = step(0,abs(uv.${rom=rr(1,scale=1.2+R()),(horvert=abs(d.x*c+d.y*s)<abs(d.x*s-d.y*c))?'x':'y'})-${R(.2)+.25});  
  uv=uv*${rom}+${V(zz)}; // rotate+offset everything

  // calc the SDF of all the things
  F d=9,b=9; // d = positive things, b = negative things
  ${sps.map(s=>`${t='db'[R(1.7)|0]}=min(${t},${sdf(s)});`).join('')}
  ${t='db'[R(2)|0]}=min(${t},abs(${bar})-.04);

  // apply angry noise  
  const F qq = ${2+R()-R()}*.04; // noise angryness I guess
  d = thing(  d,uv, 2*qq, 2*qq, .2, -.5);
  b = -thing(-b,uv, qq, qq, .15, -.4);

  d = min(b,d); // combine

  // calc foreground and apply outline to background
  F fg = step(0,d);
  bx = max(bx, step(d,.05));

  // calculate background wobbly noise
  const mat2 xx = ${rr(R()*R(),scalexx=30+R(150))};
  F bgcol = step(0,(uv*xx*${R((60+R(200))/scalexx/scale)}).x+w(uv*xx)${'*+'[R(2)|0]}w(34+(uv${['.yx',''][R(2)|0]}*H1*xx)${['.yx',''][R(2)|0]}))${shaded?`*S(${[R(-2)-1,1+R(2)]},uv.y*${3/scale})`:``};

  return max(bgcol*W(${BG}),W(bx))*fg; // combine everything
}

void main() {    
    V uv = u*res/min(res.x,res.y); // aspect ratio
    W col = W(0);
    const F N = 8; // AA factor
    W dit=fract(sin(W(uv,5)*mat3(${L(9,_=>R())})*999)*9999); // dither noise
    for (F i=0;i<N;i+=1) {
      V d = fract(i * H2+dit.xy)-.5;
      col+=pix(uv+d/(res.y*E));
    }
    col*=(1/N);
    cc=X(pow(col,W(1/2.2))+dit/256,1);
}`;

// let's do the features
$fxhashFeatures = {
  colour:''+PAL[j*2],
  shaded:shaded,
  orientation:horvert?'vertical':'horizontal',
  num_things:sps.length,
}
console.table($fxhashFeatures);

// now it is rendering time

// make a canvas and gl context
C=({body}=D).createElement('canvas');
body.appendChild(C);
gl=C.getContext('webgl2');

// initialize all the GL things
Shader=(typ, src)=>{
  const s=gl.createShader(typ);
  // regex to add decimal points to GLSL
  gl.shaderSource(s,K+src.replace(/([^a-zA-Z_0-9.])([0-9]+)(?![.0-9u])/g,'$1$2.').replace(/([0-9.]e-[0-9]+)\./gi,'$1'));
  gl.compileShader(s);
  return s;
}

// compile the shaders and create the program
program = gl.createProgram();
vs = Shader(gl.VERTEX_SHADER, src_vert);
fs = Shader(gl.FRAGMENT_SHADER, src_frag);
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);
gl.useProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log("Link failed:\n", gl.getProgramInfoLog(program));
    console.log("VS LOG:\n", gl.getShaderInfoLog(vs));
    console.log("FS LOG:\n", gl.getShaderInfoLog(fs));
    throw ("Program failed to link (see console for error log).");
}

// get the uniform locs
loc_res=gl.getUniformLocation(program,'res');
loc_E=gl.getUniformLocation(program,'E');
loc_I=gl.getUniformLocation(program,'I');

// This loads a bunch of coordinates and connects them to the`a`-attribute.
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, Float32Array.of(0,1,0,0,1,1,1,0), gl.STATIC_DRAW);
loc_a = gl.getAttribLocation(program, 'a');
gl.enableVertexAttribArray(loc_a);
gl.vertexAttribPointer(loc_a, 2, gl.FLOAT, false, 0, 0);

let M=1,E=1,I=0; // resolution multiplier, tiling number, tiling index
function resize_render() { 
  // resize and render
  let w = innerWidth, h = innerHeight, dpr = devicePixelRatio;
  let rx = C.width = M*w*dpr|0; 
  let ry = C.height = M*h*dpr|0;
  C.style.width = w+'px';
  C.style.height = h+'px';
  gl.viewport(0, 0, rx, ry);
  gl.uniform1f(loc_E, E);
  gl.uniform1f(loc_I, I);
  gl.uniform2f(loc_res, rx, ry);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

// resize event to resize when resized
tid=0;
onresize=_=>{
  clearTimeout(tid);
  tid=setTimeout(resize_render,150)
};

resize_render(); // start the program!

// oh wait up we also got a key handler
onkeyup=e=>{
  // this does the resolution and tiling behaviour if you press keys 1,2,3,4,5,a,b,c,d,e
  t='12345abcde'.search(e.key)+1;
  if(t>0){
    if(t<6)(t==E)?I=(I+1)%(E*E):(E=t,I=0);
    else M=t-5;
    document.title=`${I}/${E*E}x${M} ${txt}`;
    resize_render()
  }
}