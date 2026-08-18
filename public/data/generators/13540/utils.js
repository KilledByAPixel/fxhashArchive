function randitem(lst) {
  return lst[randint(0,lst.length)];
}

function randfloat(min,max) {
  return random() * (max - min) + min;
}

function randint(min,max) {
  return Math.floor(min + ((max-0.00001) - min) * random());
}

function hexToRgb(hex) {
  var x = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return [parseInt(x[1],16),parseInt(x[2],16), parseInt(x[3],16)];
}

const pick = (arr) => arr[(random() * arr.length) | 0];
function getWeightedOption(options) {
  let choices = [];
  for (let i in options)
    choices = choices.concat(new Array(options[i][1]).fill(options[i][0]));
  return pick(choices);
};

function rgbToHsv(r, g, b) {
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;
  var d = max - min;
  s = max === 0 ? 0 : d / max;
  if(max == min) {
      h = 0; // achromatic
  }
  else {
      switch(max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }
  return [h*360, s*100, v/255 * 100];
}

function parseHexStrings(hs) {
  let hexs = []
  hs = hs.replace(/\s/g, '');
  for (let i=0; i<hs.length/6; i++) {
    hexs.push( hexToRgb(hs.substring(i*6,(i+1)*6)) );
  }
  return hexs;
}

function adjust_color(h, s, v) {
  let cc = 5;
  return [
    h + random(-cc,cc) * 0.1,
    s + random(-cc,cc) * 0.1,
    v + random(-cc,cc) * 0.5
  ];
}