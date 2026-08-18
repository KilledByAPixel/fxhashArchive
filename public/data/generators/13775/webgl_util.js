function playPause(){
  if (playing == 1){
    playing = 0;
  }
  else{
    playing = 1;
  }
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


function exportSVG(){
var text = `<?xml version="1.0" encoding="utf-8" ?>
<svg baseProfile="tiny" height="297mm" version="1.2" width="210mm" xmlns="http://www.w3.org/2000/svg" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xlink="http://www.w3.org/1999/xlink"><defs />"
`
gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
var pixelData = new Float32Array(nLines*pointsPerLine*4);
gl.readPixels(0,0, nLines, pointsPerLine, gl.RGBA, gl.FLOAT, pixelData);
var posx;
var posy;
for(var i = 0; i<nLines; i++){
  text += `<polyline fill="none" points="`
  for (var j = 0; j < pointsPerLine-1; j++) {
    if (pixelData[4*(j*nLines+i)+3]%7!=0 || pixelData[4*(j*nLines+i)+3]%11!=0){
      text += `" stroke-linejoin="round" stroke="black" stroke-width="0.5" /><polyline fill="none" points="`
    }
    posx = 396.850395*(zoom*pixelData[4*(j*nLines+i)]+1);
    posy = 396.850395*(-zoom*pixelData[4*(j*nLines+i)+1]+1.4142);
    text += posx.toString()+",";
    text += posy.toString();
    if (j!=pointsPerLine-1){
      text += " "
    }
  }
  text += `" stroke-linejoin="round" stroke="black" stroke-width="0.5" />`
}
text += "</svg>"
download('fabric.svg',text);
}

function keyboardEventHandler(e) {
  if (e.key=="p"){
    playPause();
  }
  if (e.key=="s"){
    exportSVG();
  }
  if (e.key=="i"){
    zoom += 0.05;
  }
  if (e.key=="o"){
    zoom -= 0.05;
  }
  if (e.key=="r"){
    resetRequest = 1;
  }
}

function reset(){
  const level = 0;
  const internalFormat = gl.RGBA32F;
  const border = 0;
  const format = gl.RGBA;
  const type = gl.FLOAT;
  for (var i = 0; i<3; i++){
    gl.bindTexture(gl.TEXTURE_2D, textures[i]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, 512, 512, border, format, type, initialState);
  }
  gl.bindTexture(gl.TEXTURE_2D,restTexture);
  time = 0;
  cycle = 0;
  resetRequest = 0;
}

window.ontouchend = playPause;

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function resizeCanvas() {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
}

function createTexture(data){
  texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA32F;
  const border = 0;
  const format = gl.RGBA;
  const type = gl.FLOAT;
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, 512, 512, border, format, type, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return texture;
}

function createInitialState(m,n) {
  var positions = [];
  var x,y,z;
  for (i = 0; i<512; i++){
    for (j = 0; j<512; j++){
      x = 2*(j/m-0.5);
      y = 2*(i/n-0.5);
      z = 0.0;
      if(i>=n || j>=m){
        x=0;
        y=0;
      }
      positions.push(x);
      positions.push(y);
      positions.push(z);
      positions.push(9699690);
    }  
  }
  return positions;
}

function linesVertices(m,n){
  var gridUVs = [];

  for (i = 0; i<nLines; i++){
    for (j = 0; j<pointsPerLine-1; j++){
      gridUVs.push(i);
      gridUVs.push(j);

      gridUVs.push(i);
      gridUVs.push(j+1);
    }  
  }
  return gridUVs;
}

function gridVertices(m,n){
  var gridUVs = [];

  for (i = 0; i<nLines-1; i++){
    for (j = 0; j<pointsPerLine-1; j++){
      gridUVs.push(i);
      gridUVs.push(j);

      gridUVs.push(i);
      gridUVs.push(j+1);

      gridUVs.push(i+1);
      gridUVs.push(j+1);

      gridUVs.push(i+1);
      gridUVs.push(j+1);

      gridUVs.push(i+1);
      gridUVs.push(j);

      gridUVs.push(i);
      gridUVs.push(j); 
   
    }  
  }
  return gridUVs;
}

function draw(){
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(bg[0], bg[1], bg[2], 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(extraProgram);

  gl.enableVertexAttribArray(extraPosAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, extraPosBuffer);
  var size = 2;
  var type = gl.FLOAT;
  var normalize = false; 
  var stride = 0;
  var offset = 0; 
  gl.vertexAttribPointer(extraPosAttributeLocation, size, type, normalize, stride, offset);

  gl.uniform2f(extraResolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform1f(extraTimeUniformLocation, time);
  gl.uniform3f(extraCUniformLocation, c0[0],c0[1],c0[2]);
  gl.uniform1i(extraUniformLocation, extra);
  gl.uniform3f(extraBGUniformLocation, bg[0], bg[1], bg[2]);

  var primitiveType = gl.TRIANGLE_FAN;
  var offset = 0;
  var count = 4;
  gl.drawArrays(primitiveType, offset, count);

  gl.useProgram(drawProgram);

  gl.enableVertexAttribArray(gridUVAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, gridUVBuffer);
  var size = 2;
  var type = gl.FLOAT;
  var normalize = false; 
  var stride = 0;
  var offset = 0; 
  gl.vertexAttribPointer(gridUVAttributeLocation, size, type, normalize, stride, offset);

  gl.uniform2f(drawResolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform2f(drawSizeUniformLocation, nLines, pointsPerLine);
  gl.uniform1f(drawTimeUniformLocation, time);
  gl.uniform3f(drawC0UniformLocation, c0[0],c0[1],c0[2]);  
  gl.uniform3f(drawC1UniformLocation, c1[0],c1[1],c1[2]);  
  gl.uniform3f(drawLightDirUniformLocation, ld[0],ld[1],ld[2]);  
  gl.uniform1i(drawModeUniformLocation, drawMode);  
  gl.uniform1f(drawZoomUniformLocation, zoom);  
  gl.uniform1i(drawSpecialUniformLocation, special);  
  gl.uniform1f(drawStripesUniformLocation, stripes);  

  gl.uniform1i(drawStateUniformLocation, (cycle+2)%3);
  var primitiveType = vertType;
  var offset = 0;
  var count = nVertices;
  gl.drawArrays(primitiveType, offset, count);
}

function simulationStep(){
  gl.useProgram(simProgram);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, textures[cycle], level);
  gl.viewport(0, 0, nLines, pointsPerLine);
  gl.enableVertexAttribArray(cornerAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, cornerBuffer); 

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var size = 2;
  var type = gl.FLOAT;
  var normalize = false; 
  var stride = 0;
  var offset = 0; 
  gl.vertexAttribPointer(gridUVAttributeLocation, size, type, normalize, stride, offset);

  gl.uniform2f(simResolutionUniformLocation, nLines, pointsPerLine);
  gl.uniform2f(simTimeUniformLocation, time, timeShift);
  gl.uniform2f(simStepSizeUniformLocation, stepSize/substeps, lastStepSize/substeps);
  gl.uniform1f(simDragUniformLocation, drag);
  gl.uniform2f(simStiffnessUniformLocation, stiffness*nLines*pointsPerLine, stressResistance);
  gl.uniform1f(simPullbackUniformLocation, pullback);
  gl.uniform1f(simGravityUniformLocation, gravity);
  gl.uniform2f(simWindUniformLocation, wind, windPeriod);
  gl.uniform1f(simReconnectUniformLocation, reconnect);
  gl.uniform1i(simPinsUniformLocation, pins);

  gl.uniform1i(simLastStateUniformLocation, (cycle+2)%3);
  gl.uniform1i(simPenultimateStateUniformLocation, (cycle+1)%3);
  gl.uniform1i(simRestUniformLocation, 3);

  var primitiveType = gl.TRIANGLE_FAN;
  var offset = 0;
  var count = 4;
  gl.drawArrays(primitiveType, offset, count);
  cycle = (cycle+1)%3;
  time = time + timestep/substeps;
  lastStepSize = stepSize;
  if (resetRequest==1){
    reset();
  }
}

function update() {
  if (playing!=0){
    for (i = 0; i < substeps; i++){
      simulationStep();
    }
  }
  draw();
  window.requestAnimationFrame(update);
}

var canvas = document.querySelector("#c");

var gl = canvas.getContext("webgl2");

if (!gl) {
  console.log("webgl2 not supported!")
}

const ext = gl.getExtension("EXT_color_buffer_float");
if (!ext) {
  console.log("sorry, can't render to floating point textures");
}

window.onresize = resizeCanvas;
window.onkeydown = keyboardEventHandler;


const initialState = new Float32Array(createInitialState(nLines,pointsPerLine));

var texture0 = createTexture(initialState);
var texture1 = createTexture(initialState);
var texture2 = createTexture(initialState);
var restTexture = createTexture(initialState);

const textures = [texture0,texture1,texture2];

//draw program setup
{
var drawVertexShader = createShader(gl, gl.VERTEX_SHADER, drawVertexShaderSource);
var drawFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, drawFragmentShaderSource);
var drawProgram = createProgram(gl, drawVertexShader, drawFragmentShader);

var gridUVAttributeLocation = gl.getAttribLocation(drawProgram, "a_uv");
var gridUVBuffer = gl.createBuffer();

var vertices;
if (drawMode == 0) vertices = linesVertices(nLines,pointsPerLine);
else vertices = gridVertices(nLines,pointsPerLine);

var nVertices = [(nLines)*(pointsPerLine-1)*2,(nLines-1)*(pointsPerLine-1)*6][drawMode];
var vertType = [gl.LINES,gl.TRIANGLES][drawMode];

gl.bindBuffer(gl.ARRAY_BUFFER, gridUVBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

var drawResolutionUniformLocation = gl.getUniformLocation(drawProgram, "u_resolution");
var drawTimeUniformLocation = gl.getUniformLocation(drawProgram, "u_time");
var drawSizeUniformLocation = gl.getUniformLocation(drawProgram, "u_size");
var drawC0UniformLocation = gl.getUniformLocation(drawProgram, "u_c0");
var drawC1UniformLocation = gl.getUniformLocation(drawProgram, "u_c1");
var drawLightDirUniformLocation = gl.getUniformLocation(drawProgram, "u_light_dir");
var drawModeUniformLocation = gl.getUniformLocation(drawProgram, "u_draw_mode");
var drawZoomUniformLocation = gl.getUniformLocation(drawProgram, "u_zoom");
var drawSpecialUniformLocation = gl.getUniformLocation(drawProgram, "u_special");
var drawStripesUniformLocation = gl.getUniformLocation(drawProgram, "u_stripes");

var drawStateUniformLocation = gl.getUniformLocation(drawProgram, "s_state");
}

{
var extraVertexShader = createShader(gl, gl.VERTEX_SHADER, extraVertexShaderSource);
var extraFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, extraFragmentShaderSource);
var extraProgram = createProgram(gl, extraVertexShader, extraFragmentShader);

var extraPosAttributeLocation = gl.getAttribLocation(extraProgram, "a_corner");
var extraPosBuffer = gl.createBuffer();

const extraCorners = [-1,-1,1,-1,1,1,-1,1];

gl.bindBuffer(gl.ARRAY_BUFFER, extraPosBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(extraCorners), gl.STATIC_DRAW);

var extraResolutionUniformLocation = gl.getUniformLocation(extraProgram, "u_resolution");
var extraTimeUniformLocation = gl.getUniformLocation(extraProgram, "u_time");
var extraCUniformLocation = gl.getUniformLocation(extraProgram, "u_c");
var extraUniformLocation = gl.getUniformLocation(extraProgram, "u_extra");
var extraBGUniformLocation = gl.getUniformLocation(extraProgram, "u_bg");

}

//sim program setup
{
var simVertexShader = createShader(gl, gl.VERTEX_SHADER, simVertexShaderSource);
var simFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, simFragmentShaderSource);
var simProgram = createProgram(gl, simVertexShader, simFragmentShader);

var cornerAttributeLocation = gl.getAttribLocation(simProgram, "a_corner");
var cornerBuffer = gl.createBuffer();
const corners = [-1,-1,1,-1,1,1,-1,1];

gl.bindBuffer(gl.ARRAY_BUFFER, cornerBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corners), gl.STATIC_DRAW);

var simResolutionUniformLocation = gl.getUniformLocation(simProgram, "u_resolution");
var simTimeUniformLocation = gl.getUniformLocation(simProgram, "u_time");
var simStepSizeUniformLocation = gl.getUniformLocation(simProgram, "u_step_size");
var simDragUniformLocation = gl.getUniformLocation(simProgram, "u_drag");
var simStiffnessUniformLocation = gl.getUniformLocation(simProgram, "u_stiffness");
var simPullbackUniformLocation = gl.getUniformLocation(simProgram, "u_pullback");
var simGravityUniformLocation = gl.getUniformLocation(simProgram, "u_gravity");
var simWindUniformLocation = gl.getUniformLocation(simProgram, "u_wind");
var simReconnectUniformLocation = gl.getUniformLocation(simProgram, "u_reconnect");
var simPinsUniformLocation = gl.getUniformLocation(simProgram, "u_pins");


var simLastStateUniformLocation = gl.getUniformLocation(simProgram, "s_last_state");
var simPenultimateStateUniformLocation = gl.getUniformLocation(simProgram, "s_penultimate_state");
var simRestUniformLocation = gl.getUniformLocation(simProgram, "s_rest_state");

var cycle = 0;
}

gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D,texture0);

gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_2D,texture1);

gl.activeTexture(gl.TEXTURE2);
gl.bindTexture(gl.TEXTURE_2D,texture2);

gl.activeTexture(gl.TEXTURE3);
gl.bindTexture(gl.TEXTURE_2D,restTexture);

var fb = gl.createFramebuffer();
const level = 0;
const attachmentPoint = gl.COLOR_ATTACHMENT0;
var time = 0;

resizeCanvas();

for (i = 0; i < skipFrames*substeps; i++){
  simulationStep();
}

draw();
fxpreview();
stepSize = 0.005;

window.requestAnimationFrame(update);

