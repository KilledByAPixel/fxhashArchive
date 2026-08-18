var alpha_level = null;
var border = null;
var colors = null;
var selected_color = null;
var features = null;
var canvas = null;
var buffer = null;

var color_choices = [{"name":"Rug Pull","colors":[[57,181,224],[163,26,203],[255,120,240],[245,234,90],[63,0,113],[251,37,118],[51,47,208],[0,2,161]]},{"name":"SBF","colors":[[234,4,126],[255,109,40],[252,231,0],[0,245,255],[255,248,234],[158,118,118],[129,91,91],[89,69,69],[34,34,34]]},{"name":"Cutco","colors":[[210,0,26],[255,222,0],[255,250,231],[239,239,239],[245,237,220],[207,210,207],[162,181,187],[235,29,54]]},{"name":"Ponzi","colors":[[254,118,90],[255,180,104],[75,88,143],[250,241,224],[241,50,116],[238,208,62],[64,94,127],[25,161,152],[254,118,90],[255,180,104],[75,88,143],[250,241,224],[254,118,90],[255,180,104],[75,88,143],[250,241,224],[254,118,90],[255,180,104],[75,88,143],[250,241,224],[254,118,90],[255,180,104],[75,88,143],[250,241,224],[254,118,90],[255,180,104],[75,88,143],[250,241,224],[254,118,90],[255,180,104],[75,88,143],[250,241,224]]},{"name":"Pump N' Dump","colors":[[80,151,142],[247,240,223],[238,227,211],[32,52,42],[247,71,19],[104,109,44],[233,180,166],[80,151,142],[247,240,223],[80,151,142],[247,240,223],[80,151,142],[247,240,223],[80,151,142],[247,240,223],[80,151,142],[247,240,223],[80,151,142],[247,240,223]]},{"name":"Hacked","colors":[[246,246,244],[65,105,255],[65,105,255],[241,77,66],[244,253,236],[79,190,93],[38,84,135],[246,233,22],[249,160,135],[46,153,214],[246,246,244],[65,105,255],[65,105,255],[246,246,244],[65,105,255],[65,105,255],[246,246,244],[65,105,255],[65,105,255],[246,246,244],[65,105,255],[65,105,255],[246,246,244],[65,105,255],[65,105,255],[246,246,244],[65,105,255],[65,105,255]]},{"name":"Wallet Drainer","colors":[[23,103,210],[255,255,255],[249,171,0],[33,33,33],[240,94,59],[235,222,196],[255,219,0],[23,103,210],[255,255,255],[249,171,0],[33,33,33],[23,103,210],[255,255,255],[249,171,0],[33,33,33],[23,103,210],[255,255,255],[249,171,0],[33,33,33],[23,103,210],[255,255,255],[249,171,0],[33,33,33],[23,103,210],[255,255,255],[249,171,0],[33,33,33],[23,103,210],[255,255,255],[249,171,0],[33,33,33]]},{"name":"Alameda's Backdoor","colors":[[57,94,84],[231,123,77],[5,0,6],[229,84,134],[117,151,74],[200,62,60],[243,145,64],[228,222,210],[248,197,164],[67,79,85],[57,94,84],[231,123,77],[5,0,6],[229,84,134],[57,94,84],[231,123,77],[5,0,6],[229,84,134],[57,94,84],[231,123,77],[5,0,6],[229,84,134],[57,94,84],[231,123,77],[5,0,6],[229,84,134],[57,94,84],[231,123,77],[5,0,6],[229,84,134],[57,94,84],[231,123,77],[5,0,6],[229,84,134]]},{"name":"Address Poisoning","colors":[[219,69,73],[209,225,225],[62,106,144],[46,56,83],[163,201,211],[0,73,150],[86,123,174],[96,191,60],[210,222,177],[219,69,73],[209,225,225],[62,106,144],[46,56,83],[163,201,211],[219,69,73],[209,225,225],[62,106,144],[46,56,83],[163,201,211],[219,69,73],[209,225,225],[62,106,144],[46,56,83],[163,201,211],[219,69,73],[209,225,225],[62,106,144],[46,56,83],[163,201,211],[219,69,73],[209,225,225],[62,106,144],[46,56,83],[163,201,211],[219,69,73],[209,225,225],[62,106,144],[46,56,83],[163,201,211]]},{"name":"Fraud","colors":[[39,31,71],[231,206,181],[229,28,57],[241,184,68],[54,196,183],[102,102,102],[39,31,71],[231,206,181],[39,31,71],[231,206,181],[39,31,71],[231,206,181],[39,31,71],[231,206,181],[39,31,71],[231,206,181],[39,31,71],[231,206,181]]},{"name":"Boolean","colors":[[248,248,248],[14,14,14]]}];

const pick = (x) => x[floor(fxrand() * (x.length - 1e-6))];

function setup() {
  selected_color = pick(color_choices);
  colors = selected_color.colors;
  window.$fxhashFeatures = {
    "Aspect" : pick([1,1.41]),
    "Color Scheme" : selected_color.name,
    "Compromised Seed Phrase" : pick([true,false,false,false,false,false,false,false,false,false]),
    "Grief" : pick([true,false]),
    "Loss Ratio" : pick([1,2,2,2,2,2,4]),
  }
  features = window.$fxhashFeatures;
  canvas = createCanvas(1500, 1500 * features["Aspect"]);
}

function subdivide(x, y, w, h, settings) {
  if ((min(w,h) < settings.threshold) || (fxrand() < 1e-2)) {
    if (fxrand() < settings.prob) {
      if (fxrand() < 1e-6) {
        settings.color = pick(colors);
      }
      if (settings.level === 0) {
        subdivide(x, y, w, h, {threshold: buffer.width/pick([32,64,128,256]), level: 1, prob:0.9, color:settings.color, split:0.5, nofill:settings.nofill});
      }
      else {
        if (settings.nofill) {
          buffer.noFill();
        }
        else {
          buffer.fill(...(fxrand() < 0.1 ? pick(colors) : settings.color), alpha_level);
        }
        for (let i=0; i<floor(lerp(1,10,fxrand()**4)); i++) {
          if (x+i*w + w <= buffer.width - border) {
            buffer.push();            
            buffer.translate(x + i*w, y);
            buffer.rect(0, 0, w, h);
            buffer.pop();
          }
        }
      }
    }
    return;
  }
  if (features["Compromised Seed Phrase"]) {
    settings.split = random();
  }
  if (fxrand() < 0.5) {
    subdivide(x, y, w*settings.split, h, settings);
    subdivide(x+w*settings.split, y, w*(1-settings.split), h, settings);
  }
  else {
    subdivide(x, y, w, h*settings.split, settings);
    subdivide(x, y+h*settings.split, w, h*(1-settings.split), settings);
  }
}

function make_art(size, export_image) {
  alpha_level = 256;
  fxrand = sfc32(...hashes);
  buffer = createGraphics(size, size * features["Aspect"]);
  buffer.background(...colors[colors.length-1]);
  buffer.stroke(features["Grief"] ? 11 : 247);
  buffer.strokeWeight(buffer.width/2000);
  border = buffer.width/32;
  for (let i=0; i<16; i++) {
    subdivide(border, border, buffer.width-2*border, buffer.height-2*border, {threshold:buffer.width/8, level:0, prob:features["Loss Ratio"] / 10., color:pick(colors), split:0.5, nofill:false});
    alpha_level -= 32;
  }
  if (export_image) {
    buffer.save("export.png");
  }
  else {
    image(buffer.get(), 0, 0);
  }
}

function draw() {
  make_art(1500, false);
  noLoop();
  fxpreview();
}

function keyPressed() {
  if (keyCode === 80) {
    make_art(4000, true);
  }
}