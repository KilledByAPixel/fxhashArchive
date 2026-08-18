var drawFragmentShaderSource = 
`#version 300 es

precision highp float;
precision highp int;

uniform vec3 u_c0;
uniform vec3 u_c1;
uniform vec3 u_light_dir;
uniform int u_draw_mode;
uniform int u_special;
uniform float u_stripes;

#define PI 3.14159265
#define TAU 2.0*PI

in vec3 n;
in float disc;
in vec2 uv;

out vec4 color;

void main() {
  if (u_draw_mode==0 && disc==1.0) discard;
  if (u_draw_mode==1 && disc>1.0/3.0) discard;
  vec3 c;
  float s = max(dot(n,normalize(u_light_dir)),0.0);
  vec3 u_c0 = mix(u_c0,1.0-u_c0,step(1.0,u_stripes)*step(fract(u_stripes*uv.y),0.5));
  c = mix(u_c0,u_c1,s);
  if (u_special==1){c=n;}
  color = vec4(c,1.0);
}
`