var drawVertexShaderSource = 
`#version 300 es
in vec2 a_uv;

precision highp float;
precision highp int;

uniform sampler2D s_state;

uniform vec2 u_size;
uniform vec2 u_resolution;
uniform int u_draw_mode;
uniform float u_zoom;

out vec3 n;
out float disc;
out vec2 uv;

void main() {
  ivec2 pixel = ivec2(a_uv);
  vec4 state = texelFetch(s_state,pixel,0);
  uv = (vec2(pixel)+0.5)/u_size;
  vec3 pos = state.xyz;

  float hori = step(u_resolution.x,u_resolution.y);
  vec2 asp = mix(vec2(u_resolution.y/u_resolution.x,1.0),vec2(1.0,u_resolution.x/u_resolution.y),hori);

  pos.xy *= asp;

  pos.xy *= u_zoom;

  int connections = int(state.w);

  ivec2 offset = ivec2(((pixel.x > 0) ? -1 : 1),((pixel.y > 0) ? -1 : 1));
  if (connections%17!=0 && pixel.x<int(u_size.x)-1){
    offset.x = 1;
  }
  if (connections%11!=0 && pixel.y<int(u_size.y)-1){
    offset.y = 1;
  }
  vec3 nx = texelFetch(s_state,pixel+offset.x*ivec2(1,0),0).xyz;
  vec3 ny = texelFetch(s_state,pixel+offset.y*ivec2(0,1),0).xyz;
  n = normalize(cross(state.xyz-nx,state.xyz-ny));
  n *= float(offset.x)*float(offset.y);

  if ((connections%17!=0 && connections%3!=0) || (connections%7!=0 && connections%11!=0)){
    n *= 0.0;
  }

  disc = 0.0;

  if (u_draw_mode==0 && (connections%7!=0 || connections%11!=0)){
    disc = 1.0;
  }

  if (u_draw_mode==1 && (connections%17!=0 || connections%3!=0 || connections%7!=0 || connections%11!=0)){
    disc = 1.0;
  }

  gl_Position = vec4(pos.xy,0,1);
}
`