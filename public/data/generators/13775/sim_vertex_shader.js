var simVertexShaderSource = 
`#version 300 es

in vec4 a_corner;

void main() {
  gl_Position = a_corner;
}
`