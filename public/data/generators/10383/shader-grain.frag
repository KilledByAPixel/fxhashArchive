#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform float lum;
uniform float th;
uniform float ra;

//Based on code by Patricio Gonzalez Vivo - The Book of Shaders - https://thebookofshaders.com/
highp float rand(vec2 co){
  highp float a = ra;
  highp float b = 78.233;
  highp float c = 43758.5453;
  
  if(mod(co.y*1000.0, 2.0) >= 1.0){
    c = 43754.513;
  }
  if(mod(co.x*100.0, 2.0) >= 1.0){
    c += 0.023;
  }
  
  highp float dt= dot(co.xy ,vec2(a,b));
  highp float sn= mod(dt,3.14);
  if(mod(co.x*100.0, 2.0) >= 1.0){
    return fract(sin(sn) * c);
  }else{
    return fract(cos(sn) * c);
  }
}

void main() {
  vec2 coord = vTexCoord;
  float alpha = rand(coord)*th;
  if(alpha < th/4.0){
    alpha = 0.0;
  }else if(alpha < th/2.0){
    alpha = th/3.7;
  }
  if(rand(coord) > 0.998){
    alpha = 0.4;
  }
  gl_FragColor = vec4(lum, lum, lum, alpha);
}