precision mediump float;
varying vec2 vTexCoord;
attribute vec3 aPosition;
attribute vec2 aTexCoord;
void main() {
    vTexCoord = aTexCoord;
    vec4 positionVec4 = vec4(aPosition, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
    gl_Position = positionVec4;
}