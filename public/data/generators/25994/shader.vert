precision mediump float;

// thank you adam ferriss + book of shaders

// uniform mat4 uModelViewMatrix;
// uniform mat4 uProjectionMatrix;

attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
    vTexCoord = aTexCoord;
    vec4 positionVec4 = vec4(aPosition, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
    gl_Position = positionVec4;
    // gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}