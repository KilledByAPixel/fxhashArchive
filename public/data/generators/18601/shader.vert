#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aPosition;
varying vec2 vTexCoord;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  vTexCoord = vec2(aPosition);
  gl_Position = positionVec4;
}