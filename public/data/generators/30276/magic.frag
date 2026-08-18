#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTexCoord;
uniform vec2 u_scarfsize;
uniform sampler2D tex0;
uniform sampler2D tex1;
uniform sampler2D tex2;
uniform sampler2D tex3;
uniform vec3 kleur;
uniform float r1;
uniform float r2;
uniform float sc;
uniform float sv;
uniform float fb;

uniform float sd;

float Bayer2(vec2 a) {
    a = floor(a);
    float n = fract(a.x / 2. + a.y * a.y * .75);
    return n;
}

#define Bayer4(a)   (Bayer2 (.5 *(a)) * .25 + Bayer2(a))
#define Bayer8(a)   (Bayer4 (.5 *(a)) * .25 + Bayer2(a))
#define Bayer16(a)  (Bayer8 (.5 *(a)) * .25 + Bayer2(a))
#define Bayer32(a)  (Bayer16(.5 *(a)) * .25 + Bayer2(a))
#define Bayer64(a)  (Bayer32(.5 *(a)) * .25 + Bayer2(a))

float hash12(vec2 p) {
	vec3 p3  = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 pos) {
  vec2 i = floor(pos);
  vec2 f = fract(pos);
  float a = hash12(i + vec2(0.0, 0.0));
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  vec2 u = vec2(1.0);
  u = f * f * (3.0 - 2.0 * f);
  float n = mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  return n;
}

vec4 blur(sampler2D txt, vec2 st, float s, float ph) {
  vec4 col = vec4(0.0);
  for (int j = 1; j < 8; j++) {
    float r = float(j)*(s/7.0);
    for (int i = 0; i<14; i++) {
      float a = float(i)*(ph/14.0);
      vec2 p = st + (vec2(cos(a),sin(a)))*r;
      vec4 cs = texture2D(txt, p);
      col += cs;
    }
  }  
  return col/(7.0*14.0); 
}

void main() { 
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  float scale = sc;

  float knit_size = u_scarfsize.x/scale; 
  float ar = u_scarfsize.y/u_scarfsize.x;

  vec2 or1 = ((uv*u_scarfsize/scale)-fract(uv*u_scarfsize/scale))/(u_scarfsize/scale); 
  vec2 or2 = or1;
  vec3 col;

  vec3 base_pattern1 = texture2D(tex0, or1).rgb;
  vec3 base_pattern11 = texture2D(tex3, or1).rgb;
  vec3 base_pattern2 = texture2D(tex1, or1).rgb;
  vec3 base_pattern3 = blur(tex2, or1, 0.03, 3.1415).rgb;

  float a = 0.05 + 0.3 * base_pattern2.x;
  float f = 4.0 + 2.0*base_pattern3.x;

  float t2 = 15.0*(1.0 + noise(2.5*(or2+vec2(10.0)+vec2(-r1,r1))));
  or2.x += a*noise(or2*f + vec2(-r1*f,r1*f) + vec2(t2))*sin(or2.x*3.1415);
  or2.y += a*noise(or2*f + vec2(r1*f,-r1*f) - vec2(t2))*sin(or2.y*3.1415);
  a /= 2.0;
  f *= 1.5;
  or2.x += a*noise(or2*f + vec2(r1*f,-r1*f) - vec2(t2))*sin(or2.x*3.1415);
  or2.y += a*noise(or2*f + vec2(-r1*f,r1*f) + vec2(t2))*sin(or2.y*3.1415);
  a /= 2.0;
  f *= 2.0;
  or2.x += a*noise(or2*f + vec2(-r1*f,r1*f) - vec2(t2))*sin(or2.x*3.1415);
  or2.y += a*noise(or2*f + vec2(-r1*f,r1*f) + vec2(t2))*sin(or2.y*3.1415);

  vec3 base1 = texture2D(tex0,or2).rgb;
  vec3 base2; 
  if (r1 < 0.5) {
    base2 = texture2D(tex0,1.0-or2).rgb;
  } else {
    base2 = base2 = texture2D(tex3,1.0-or2).rgb;
  }
  if (r2 < 0.5) {
    col = mix(base_pattern1,base2,0.85-smoothstep(0.4,0.6,base1.r));
  } else {
    col = mix(base_pattern1,base2,smoothstep(0.1,0.9,base_pattern1.r)); 
 }
 
  float dithering = (Bayer64(or1 * vec2(knit_size,floor(knit_size*ar))) * 2.0 - 1.0) * 0.5;

  int k = int(mod(or1.x*knit_size,4.0));

  float avg = (col.x + col.y + col.z)/3.0;
  avg += dithering;

  vec3 c1 = fb < 0.5 ? vec3(0.08) : vec3(0.32);
  vec3 c2 = fb < 0.5 ? vec3(0.32) : vec3(0.08);

  if (sc < 1.0) {
    c1 = vec3(0.94,0.89,0.85);
    c2 = kleur;
  }

  if (sv > 0.0) {
    c1 = vec3(1.0);
    c2 = vec3(0.0);
  }

  vec3 c = avg < 0.5 ? c2 : c1; 
  gl_FragColor = vec4(c,1.0);
}


