#ifdef GL_ES
#  ifdef GL_FRAGMENT_PRECISION_HIGH
     precision highp float;
#  else
     precision mediump float;
#  endif
  
#endif

#define PI 3.1415926
#define PI_14 PI*14.

uniform vec2 u_resolution;
uniform sampler2D u_tex;
uniform float u_resMultiplier;
uniform float u_rmax;
uniform float u_rmin;
uniform bool u_warp;
uniform float u_frame;
uniform int u_noiseType;
uniform bool u_mirror;


// standard GLSL rand.
// https://stackoverflow.com/questions/12964279/whats-the-origin-of-this-glsl-rand-one-liner
float rand(vec2 p) { 
	return fract(sin(dot(p, vec2(12.9898, 4.1414))) * 43758.5453);
}

// noise function based on Inigo Quilez's Value Noise.
// https://www.shadertoy.com/view/lsf3WH.
float noise(vec2 p){
	vec2 i = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float n = mix(
		mix(rand(i), rand(i+vec2(1.0,0.0)), u.x),
		mix(rand(i+vec2(0.0,1.0)), rand(i+vec2(1.0,1.0)), u.x),
    u.y);
  // amp.
	return n*n;
}

#define OCTAVES 3.0
float fbm (vec2 p) {
    float o = 0.;
    for (float i = 0.; i < OCTAVES; i++) {
        o += noise(vec2(1.2*p.x, 1.2*p.y))/OCTAVES;
        p *= 2.;
    }
    return o;
}

float grad1 (vec2 p) {
    float n = fbm(p+vec2(0,1));
    float s = fbm(p-vec2(0,1));
    return n-s;
}

#define rot(spin) mat2(cos(spin),-sin(spin),sin(spin),cos(spin))
void main() {
	vec2 uv = gl_FragCoord.xy/u_resolution.xy;
	uv.y = 1.-uv.y;
  if (u_mirror) {
    uv.x = 1. - uv.x;
  }
  
  vec4 col;
  float frame = u_frame * u_resMultiplier;
  bool isFrame = gl_FragCoord.x >= u_resolution.x - frame || gl_FragCoord.y >= u_resolution.y - frame || gl_FragCoord.x <= frame  || gl_FragCoord.y <= frame;
  if (u_frame > 0. && isFrame) {
    col = vec4(1.);
  } else {
    if (u_warp) {
      vec2 xy = uv*2. - 1.0;
      float r = length(xy);
      r = clamp(r, u_rmin/u_resolution.x, 10.);
      float d = r;
      float theta = (1. - d) * PI  * cos(d * PI *.5);
      xy = rot(theta) * xy;
      xy = (xy + 1.0) * .5; 
      col = texture2D(u_tex, xy);
    } else {
      col = texture2D(u_tex, uv);
    }
  }

  gl_FragColor = col;
  
  if (u_noiseType == 1) {
    gl_FragColor.xyz += .3*grad1(gl_FragCoord.xy / u_resMultiplier);
  } else if (u_noiseType == 2) {
    uv = ceil(gl_FragCoord.xy /u_resMultiplier) / 10.;
    uv.x *= sign(cos(length(floor(uv))*123.));
    uv = fract(uv*.5);
    gl_FragColor.xyz += cos(min(length(uv), length(uv - 1.))*PI_14)*.08;

  } else if (u_noiseType == 3) {
    float nn = (-0.4 + rand( floor(gl_FragCoord.xy/ u_resMultiplier) * vec2(0.25, .75)) ) * 0.08;
    gl_FragColor.xyz += nn;
  }
}