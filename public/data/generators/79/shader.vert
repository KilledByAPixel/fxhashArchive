#ifdef GL_ES
precision highp float;
#endif

// our vertex data
attribute vec3 aPosition;

// lets get texcoords just for fun! 
varying vec2 vTexCoord;

void main() {
  // copy the position data into a vec4, using 1.0 as the w component
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  // copy the texcoords
  vTexCoord = vec2(aPosition);

  // send the vertex information on to the fragment shader
  gl_Position = positionVec4;
}