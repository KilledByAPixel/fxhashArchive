#ifdef GL_ES
precision mediump float;
#endif
  
precision highp float;

varying vec2 vUV;

uniform sampler2D tex;
uniform vec3 Col;

void main() {
  vec4 texColor2 = texture2D(tex, vUV);
  
  vec3 C = vec3(texColor2.xyz);
  vec3 swatch = Col;
  C = mix(swatch,vec3(1.0),C);
  gl_FragColor = vec4(C,1.0);

}