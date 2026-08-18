#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform vec2 u_resolution;
uniform vec3 col;

//Based on code by Patricio Gonzalez Vivo - The Book of Shaders - https://thebookofshaders.com/
highp float rand(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

void main() {
  vec2 coord = vTexCoord;
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec3 color = col;
  float myTh = 0.8;
  if(st.y > myTh){
    float l = st.y - myTh;
    if(rand(coord)<l){
      color = vec3(0.75, 0.75, 0.75);
    }
  }else if(st.y < 1.0 - myTh){
    float p = 1.0 - st.y - myTh;
    if(rand(coord)<p){
      color = vec3(0.75, 0.75, 0.75);
    }
  }
  gl_FragColor = vec4(color, 0.7);
}