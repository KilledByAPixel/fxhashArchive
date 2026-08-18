// Author:Jesse Bassett
  #ifdef GL_ES
  precision mediump float;
  #endif 

  varying vec2 vTexCoord;
  uniform vec4 LF1;  uniform vec2 LF2;

  uniform vec4 LR1;  uniform vec2 LR2;
  uniform vec4 dA1;  uniform vec2 dA2;
  uniform vec4 df1;  uniform vec2 df2;
  uniform vec4 wb1;  uniform vec2 wb2;
  uniform vec4 bb1;  uniform vec2 bb2;
  uniform vec4 Nf1;  uniform vec2 Nf2;
  uniform vec4 Nn1;  uniform vec2 Nn2;
  uniform vec4 Nx1;  uniform vec2 Nx2;

  uniform float indx;
  uniform vec4 Ld;
  uniform float cBlend;
  uniform float cloudSeed; 
  uniform float N1; 
  uniform float N2; 
  uniform float horizon;
  uniform float ground;
  uniform float clear;
  uniform float night;

  uniform vec2 rez;

  const int Len = 5;
  int sel = 2;
  float time = -0.04;
  //float N1 = 4.368;
  //float N2 = 7.784;
  const int N_Octaves = 8;


  #define BlendScreen(base, blend)   (1.0 - ((1.0 - base) * (1.0 - blend)))
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = vec2(0.0);
      i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
      vec2 x1 = x0.xy + C.xx - i1;
      vec2 x2 = x0.xy + C.zz;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3( dot(x0,x0), dot(x1,x1), dot(x2,x2) ), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);
      vec3 g = vec3(0.0);
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
      return 130.0 * dot(m, g);
  }
  vec2 rotateUV(vec2 uv, float rotation)
  { return vec2( cos(rotation) * (uv.x - 0.5) + sin(rotation) * (uv.y - 0.5) + 0.5, cos(rotation) * (uv.y - 0.5) - sin(rotation) * (uv.x - 0.5) + 0.5); }
  float SmoothStep( float edge0, float edge1,float x ){
      float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
      return t;
  }





float random (in vec2 st) {
  return fract( sin( dot( st, vec2(12.9898,78.233)  )) *  43758.5453123);
}

float random3D (in vec3 st) {
  return fract( sin( dot( st, vec3(12.9898,78.233,50.169)  )) *  43758.5453123);
}



float noise (in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  // Four corners in 2D of a tile
  vec2 noff = vec2(0.00,0.0);//noise offfset // doesnt do that actually
  float a = random(i + vec2(0.0 + noff.x, 0.0 + noff.y));
  float b = random(i + vec2(1.0 + noff.x, 0.0 + noff.y));
  float c = random(i + vec2(0.0 + noff.x, 1.0 + noff.y));
  float d = random(i + vec2(1.0 + noff.x, 1.0 + noff.y));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) +   (c - a)* u.y * (1.0 - u.x) +  (d - b) * u.x * u.y;
}

#define OCTAVES 2
float fbm (in vec2 st) {
  // Initial values
  float value = 0.0;
  float amplitude = .5;
  float frequency = 0.;
  //
  // Loop of octaves
  for (int i = 0; i < OCTAVES; i++) {
      value += amplitude * noise(st);
      st *= 2.;
      amplitude *= .5;
  }
  return value;
}



float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise3d(vec3 p){
  vec3 a = floor(p);
  vec3 d = p - a;
  d = d * d * (3.0 - 2.0 * d);

  vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
  vec4 k1 = perm(b.xyxy);
  vec4 k2 = perm(k1.xyxy + b.zzww);

  vec4 c = k2 + a.zzzz;
  vec4 k3 = perm(c);
  vec4 k4 = perm(c + 1.0);

  vec4 o1 = fract(k3 * (1.0 / 41.0));
  vec4 o2 = fract(k4 * (1.0 / 41.0));

  vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
  vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

  return o4.y * d.y + o4.x * (1.0 - d.y);
}


float fbm3d (vec3 x) {
float v = 0.0;
float a = 0.5;
vec3 shift = vec3(100);
for (int i = 0; i <  N_Octaves; ++i) {
  v += a * noise3d(x);
  x = x * 2.0 + shift;
  a *= 0.2;
}
return v;
}



float sdOrientedBox( in vec2 p, in vec2 a, in vec2 b, float th )
{
    float l = length(b-a);
    vec2  d = (b-a)/l;
    vec2  q = p-(a+b)*0.5;
          q = mat2(d.x,-d.y,d.y,d.x)*q;
          q = abs(q)-vec2(l*0.5,th);
    return length(max(q,0.0)) + min(max(q.x,q.y),0.0);    
}

vec4 shadeCloud(vec2 v1,vec2 v2,float th,float r){
    vec4 R = vec4(0.0);
    vec2 V = v2-v1;
    
    V =   V.yx;
    V.x= -V.x*sign(r);
    V.y= V.y*sign(r);
    
    r=abs(r);
    V = normalize(V)*(th-th*r);
    
    R.xy = v1 + V;
    R.yw = v2 + V;
    
    R.x = v1.x + V.x;
    R.y = v1.y + V.y;
    R.z = v2.x + V.x;
    R.w = v2.y + V.y;
    
    return R;
    
}

vec3 col3d ( in vec3 P, in vec2 st, in vec2 v1, in vec2 v2, in float th, in float r, in float r2) {
  vec3 x = P * N1 ;
  //float v = fbm3d(x);

	float v = 0.0;
	float a = 0.5;
	vec3 shift = vec3(100);
	for (int i = 0; i < N_Octaves; ++i) {
		v += a * noise3d(x);
		x = x * 2.0 + shift;
		a *= 0.5;
	}
  //return v;
	//v*=N2;
  //P+= vec3(v)*N2*(sin(time));

  

  st += vec2(v)*N2*(sin(time));
	
  vec4 SH;
  vec3 c;
  float mask1 = sdOrientedBox( st, v1, v2, th );
  mask1 = 0.0 + sign(mask1)*1.;
    
  SH = shadeCloud(v1,v2,th,abs(r));
  float mask2 = sdOrientedBox( st, SH.xy, SH.zw, th*r );
  mask2 = 0.0 + sign(mask2)*1.; 
 
  SH = shadeCloud(v1,v2,th,-r2);
  float mask3 = sdOrientedBox( st, SH.xy, SH.zw, th*r2 );
  mask3 = 0.0 + sign(mask3)*1.;
  
  c = vec3(mask1,mask2,mask3);
    
  
  return c;
}

void main() {
    vec2 st = vTexCoord;

    vec3 param = vec3(0.);
    vec3 C;
  
    vec2 v1 = vec2(-0.290,0.590);
    vec2 v2 = vec2(1.880,0.710);
    float th = 0.292;
    float r = 0.362;
    float r2 = 0.234;

    //horizon ajust scaleing.
    v1.y = -2.*((horizon+0.1)*v1.y-(horizon+0.1)-v1.y+0.5);
    v2.y = -2.*((horizon+0.1)*v2.y-(horizon+0.1)-v2.y+0.5);
    //th = th*(1.5-((0.5-horizon)/.5));
    C = col3d(  vec3( st.x, st.y, cloudSeed), st, v1, v2, th, r, r2    );

  //OLD SKY + CLOUDS
  //if (st.y >= clear){
  //  C = vec3(1.0);
  //  //C.x = 1.0;
  //  //C.y = 1.0;
  //  //C.z = 1.0;
  //}





    float mask1 = C.x;
    float mask2 = C.y;
    float mask3 = C.z;

    vec2 st_1 = st;
    vec2 st_2 = st;
    vec2 st_3 = st;
    vec2 st_4 = st;
    vec2 st_5 = st;
    vec2 st_6 = st;
    vec3 color = vec3(0.0);
  st_1 = rotateUV(st,LR1.x );
    st_1.x += cos(st_1.y*dA1.x)/df1.x;
    st_1.y += sin(st_1.x*dA1.x)/df1.x;
    float pos_1 = st_1.x * LF1.x;
    float y = 0.;
    float x = pos_1;
  y =  sin( (x+Ld.z) *Ld.y);
  y += sin( (x+Ld.z) *Ld.y*2.1 + Ld.w)*4.5;
  y += sin( (x+Ld.z) *Ld.y*1.72 + Ld.w*1.121)*4.0;
  y += sin( (x+Ld.z) *Ld.y*2.221 + Ld.w*0.437)*5.0;
  y += sin( (x+Ld.z) *Ld.y*3.1122+ Ld.w*4.269)*2.5;
  y *= Ld.x*0.06;
    pos_1 = pos_1+y;
  float colL_1 =  wb1.x*bb1.x*(  (cos(pos_1*2.*3.14)+1.)/2.  )-bb1.x+1.;
  float colLC_1 = clamp(colL_1,0.090,1.0);
    vec2 posN_1 = st  * Nf1.x;
    float colN_1 = (snoise(posN_1)*.5+.5);
    float colNC_1 = smoothstep(Nn1.x,Nx1.x,colN_1);
  st_2 = rotateUV(st_2,LR1.y);
  st_2.x += cos(st_2.y*dA1.y)/df1.y;
  st_2.y += sin(st_2.x*dA1.y)/df1.y;
  float pos_2 = st_2.x * LF1.y;
  float colL_2 =  wb1.y*bb1.y*(  (cos(pos_2*2.*3.14)+1.)/2.  )-bb1.y+1.;
  float colLC_2 = clamp(colL_2,0.090,1.0);
  vec2 posN_2 = st_2 * Nf1.y;
  float colN_2 = (snoise(posN_2)*.5+.5);
    float colNC_2 = smoothstep(Nn1.y,Nx1.y,colN_2);
  st_3 = rotateUV(st_3,LR1.z);
  st_3.x += cos(st_3.y*dA1.z)/df1.z;
  st_3.y += sin(st_3.x*dA1.z)/df1.z;
  float pos_3 = st_3.x * LF1.z;
  float colL_3 =  wb1.z*bb1.z*(  (cos(pos_3*2.*3.14)+1.)/2.  )-bb1.z+1.;
  float colLC_3 = clamp(colL_3,0.090,1.0);
  vec2 posN_3 = st_3 * Nf1.z;
  float colN_3 = (snoise(posN_3)*.5+.5);
  float colNC_3 = smoothstep(Nn1.z,Nx1.z,colN_3);
  st_4 = rotateUV(st_4,LR1.w);
  st_4.x += cos(st_4.y*dA1.w)/df1.w;
  st_4.y += sin(st_4.x*dA1.w)/df1.w;
  float pos_4 = st_4.x * LF1.w;
  float colL_4 =  wb1.w*bb1.w*(  (cos(pos_4*2.*3.14)+1.)/2.  )-bb1.w+1.;
  float colLC_4 = clamp(colL_4,0.090,1.0);
  vec2 posN_4 = st_4 * Nf1.w;
  float colN_4 = (snoise(posN_4)*.5+.5);
  float colNC_4 = smoothstep(Nn1.w,Nx1.w,colN_4);
  st_5 = rotateUV(st_5,LR2.x);
  st_5.x += cos(st_5.y*dA2.x)/df2.x;
  st_5.y += sin(st_5.x*dA2.x)/df2.x;
  float pos_5 = st_5.x * LF2.x;
  float colL_5 =  wb2.x*bb2.x*(  (cos(pos_5*2.*3.14)+1.)/2.  )-bb2.x+1.;
  float colLC_5 = clamp(colL_5,0.090,1.0);
  vec2 posN_5 = st_5 * Nf2.x;
  float colN_5 = (snoise(posN_5)*.5+.5);
  float colNC_5 = smoothstep(Nn2.x,Nx2.x,colN_5);
  vec2 posN_6 = st_6 * Nf2.y;
  float colN_6 = (snoise(posN_6)*.5+.5);
  float colNC_6 = smoothstep(Nn2.y,Nx2.y,colN_6);
  if(indx == 1.0){
    colNC_5 = colNC_5 + colNC_2;
    colNC_4 = colNC_4 + colNC_3;
    colNC_1 = 0.108*(colNC_6 -0.)+ colNC_1;
    colNC_2 = 0.292*(colNC_6 -0.)+ colNC_2;
    colNC_3 = -0.448*(-colNC_6 +0.024)+ colNC_3;
  }else if (indx == 2.0){
    colNC_5 = colNC_5 + colNC_2;
    colNC_4 = 1.;
    colNC_3 = 0.664 * colNC_6 + colNC_3;
    colNC_2 = 1.664 * colNC_6 + colNC_2;
    colNC_1 = 1.;
  }else if (indx == 3.0){
    colNC_5 = colNC_5 + colNC_3;
    colNC_4 = 0.032 * colNC_6 + colNC_4;
    colNC_3 = 0.712 * colNC_6 + colNC_3;
    colNC_1 = 0.672 * colNC_6 + colNC_1;
  }else if (indx == 4.0){
    colNC_5 = colNC_5 + colNC_3;
    colNC_3= 1.680*colNC_5 + colNC_3-1.;
    colNC_4 = 0.784 * colNC_6 + colNC_4;
    colNC_3 = 0.736 * colNC_6 + colNC_3;
    colNC_1 = -0.016 * colNC_6 + colNC_1;
  }else if (indx == 5.0){
    colNC_5 = colNC_5 + colNC_3;
    colNC_4 = 0.016 * colNC_6 + colNC_4;
    colNC_3 = 0.000 * colNC_6 + colNC_3;
    colNC_2 = 0.328 * colNC_6 + colNC_2;
    colNC_1 = 0.992* (colNC_6 -0.024)+ colNC_1;
  }else if (indx == 6.0){
    colNC_5 = colNC_5 + colNC_3;
  }else if (indx == 7.0){
    colNC_5 = colNC_5 + colNC_3;
  }else if (indx == 8.0){
    colNC_5 = colNC_5 + colNC_3;
  }

  colNC_1 = -colNC_1+1.0;
  colNC_1 = colNC_1*(C.x);// NOT?
  colNC_1 = -colNC_1+1.0;

  colNC_2 = -colNC_2+1.0;
  colNC_2 = colNC_2*( (-C.x+1.0)- (-C.z+1.0));
  colNC_2 = -colNC_2+1.0;


  colNC_3 = -colNC_3+1.0;
  colNC_3 = colNC_3*(-C.x+1.0);
  colNC_3 = -colNC_3+1.0;

  colNC_4 = -colNC_4+1.0;
  colNC_4 = colNC_4*(-C.y+1.0);
  colNC_4 = -colNC_4+1.0;

  colNC_5 = -colNC_5+1.0;
  colNC_5 = colNC_5*(-C.y+1.0);
  colNC_5 = -colNC_5+1.0;


  float colB_1 = BlendScreen( colNC_1,colLC_1 );
  float colB_2 = BlendScreen( colNC_2,colLC_2 );
  float colB_3 = BlendScreen( colNC_3,colLC_3 );
  float colB_4 = BlendScreen( colNC_4,colLC_4 );
  float colB_5 = BlendScreen( colNC_5,colLC_5 );
  float colF_1 = SmoothStep( cBlend,1.,colB_1 );
  float colF_2 = SmoothStep( cBlend,1.,colB_2 );
  float colF_3 = SmoothStep( cBlend,1.,colB_3 );
  float colF_4 = SmoothStep( cBlend,1.,colB_4 );
  float colF_5 = SmoothStep( cBlend,1.,colB_5 );
  float colF = min( colF_1,colF_2 );
  colF = min( colF,colF_3 );
  colF = min( colF,colF_4 );
  colF = min( colF,colF_5 );
  color = vec3( colF );


  if (st.y >= clear){
    C = vec3(1.0);
    C.x = 1.0;
    C.y = 1.0;
    C.z = 1.0;
    color = vec3(1.0);
  }
  

  if (st.y <= horizon){
    color = vec3(ground);
  }

  if (night <= 1.0 ){
    if (st.y > horizon){
     color = mix(1.0-color,vec3(1.0-night),color);
    }
  }



  gl_FragColor = vec4(color,color.x);
}