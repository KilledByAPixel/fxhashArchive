#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aPosition;

varying vec2 positionPass;

uniform float marginMultiplier;

void main() {
  vec4 positionVec4 = vec4(aPosition, marginMultiplier);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0; 
  gl_Position = positionVec4;
  positionPass = vec2(positionVec4.x, positionVec4.y);
}