var extraFragmentShaderSource = 
`#version 300 es

precision highp float;

uniform vec2 u_time;
uniform vec2 u_resolution;
uniform vec3 u_c;
uniform vec3 u_bg;
uniform int u_extra;

#define PI 3.14159265
#define TAU 2.0*PI

float rectangle(vec2 v)
{
  vec2 w = abs(v) - vec2(0.35);
  return length(max(w,0.0)) + min(max(w.x,w.y),0.0);
}

out vec4 color;
void main() { 
  ivec2 pixel = ivec2(gl_FragCoord.xy);

  vec2 uv = vec2(pixel)/u_resolution;
  float hori = step(u_resolution.x,u_resolution.y);
  vec2 asp = mix(vec2(u_resolution.x/u_resolution.y,1.0),vec2(1.0,u_resolution.y/u_resolution.x),hori);
  uv = (uv-0.5)*asp+0.5;
 
  float drawed = 0.0;

  if (u_extra==1){
    drawed = step(abs(rectangle(uv-0.5)),0.001);
  }

  if (u_extra==2){
    drawed = step(abs(length(uv-0.5)-0.35),0.001);
  }  

  vec3 c = mix(u_bg,u_c,drawed);

  color = vec4(c,1.0);
}
`