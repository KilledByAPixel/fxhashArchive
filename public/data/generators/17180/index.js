mres = (+location.hash.substr(1))||1;

// defs and useful functions
let {sin,cos,min,abs,PI}=Math;
let TAU=PI*2,PHI=.5+.5*5**.5;
let L=(N,f)=>[...Array(N)].map((_,i)=>f(i)); // for loop / map / list function

// PRNG
let S=Uint32Array.from([9,7,5,3]),n,t; // PRNG state
let R=(a=1)=>a*(t=S[3],S[3]=S[2],S[2]=S[1],S[1]=n=S[0],t^=t<<11,S[0]^=(t^t>>>8)^(n>>>19),S[0]/2**32);
[...fxhash+'SketchPiP'].map(c=>R(S[3]^=c.charCodeAt()*23205));

let RT=(a=1)=>a*(R()-R());
let RA=a=>a[R(a.length)|0]; //random item from array
let RX=(lo,hi)=>{ // exponential lerp random
  let t = R();
  return (lo**t)*(hi**(1-t));
}

// INIT RANDOM CAMERA POS
camera_pos = [R(12)-6, -R(7), -8-R(5)];

// common shader header
let K=`#version 300 es
precision highp float;
`+`,TAU ${TAU},S smoothstep,W vec3,V vec2,X vec4,L length,N normalize,F float
`.replace(/,/g,`
#define `);

// vertex shader 
let src_vert = `in vec2 a;
out vec2 u;

void main() {
  u = a * 2. - 1.;
  gl_Position = vec4(u,0,1);
}`;

// fragment shader
let src_frag = fragsrc_raymarcher();

// make a canvas and gl context
let C=(D=document).createElement('canvas');
vcenter.appendChild(C);
let gl=C.getContext('webgl2');

// initialize all the GL things
const Shader = (typ, src)=>{
  const s=gl.createShader(typ);
  gl.shaderSource(s,K+src.replace(/([^a-zA-Z_0-9.])([0-9]+)(?![.0-9u])/g,'$1$2.').replace(/([0-9.]e-[0-9]+)\./gi,'$1'));
  gl.compileShader(s);
  return s;
}

// compile the shaders and create the program
let program = gl.createProgram();
let vs = Shader(gl.VERTEX_SHADER, src_vert);
let fs = Shader(gl.FRAGMENT_SHADER, src_frag);
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);
gl.useProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(`Link failed:\n${gl.getProgramInfoLog(program)}`);
    console.log(`VS LOG:\n${gl.getShaderInfoLog(vs)}`);
    console.log(`FS LOG:\n${gl.getShaderInfoLog(fs)}`);
    throw 'AARG DED';
}

// This loads a bunch of coordinates and connects them to the`a`-attribute.
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, Float32Array.of(0,1, 0,0, 1,1, 1,0), gl.STATIC_DRAW);
let loc_a = gl.getAttribLocation(program, 'a');
gl.enableVertexAttribArray(loc_a);
gl.vertexAttribPointer(loc_a, 2, gl.FLOAT, false, 0, 0);


// get the uniform locs
let loc_res = gl.getUniformLocation(program,'res');
let loc_rb = gl.getUniformLocation(program,'rb');

// render and load the canvas textures
draw_texture().map((can,i)=>{
  gl.activeTexture(gl.TEXTURE0+i);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex); 
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); // gl.REPEAT or gl.CLAMP_TO_EDGE
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); 
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, can);
  gl.uniform1i(gl.getUniformLocation(program,'tex'+i),i);
});

// set resolution
let aspect = 2.0;
let resy = min(innerWidth / aspect,innerHeight);
let resx = aspect * resy | 0; resy |= 0;
C.style.width = resx+'px';
C.style.height = resy+'px';
C.width = resx = resx*mres*devicePixelRatio|0; 
C.height = resy = resy*mres*devicePixelRatio|0;

// render
gl.viewport(0, 0, resx, resy);
gl.uniform2f(loc_res, resx, resy);
gl.uniform2f(loc_rb, R(128)|0, R(128)|0);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

