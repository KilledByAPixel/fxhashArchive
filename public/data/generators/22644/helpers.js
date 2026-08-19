function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
        h = h << 13 | h >>> 19;
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507),
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
  }
  
  function randRange(mn, mx) {
    return random(0,1) * (mx - mn) + mn;
  }
  
  function IntRandRange(mn, mx) {
    return Math.floor(random(mx,mn));
  }
  
  
  
  function fxrand_weighted(w) {
    // Normalize
    let w_sum = 0;
    for (i = 0; i < w.length; i++) {
        w_sum += w[i];
    }
    for (i = 0; i < w.length; i++) {
        w[i] = w[i] / w_sum;
    }
    //
  
    // Cumulative sum
    csum = [];
    tsum = 0;
    for (i = 0; i < w.length; i++) {
        tsum += w[i];
        csum[i] = tsum;
    }
    //
  
    // Run fxrand, return value it is nearest, but not greater than
    droll = randRange(0, 1);
    for (i = 0; i < csum.length; i++) {
        if (droll <= csum[i]) {
            return i
        }
    }
    //
  }

  function evenRandRange(min,max){
      return Math.ceil(IntRandRange(min,max)/2)*2
  }

  function randBool(){
      let m  = IntRandRange(0,2);
      return m<1? false:true;
  }

  
  function getWeightedfromArray(wArray,selArray){
      let w = fxrand_weighted(wArray);
      return selArray[w];
  }

 

  let  randomFromArray= (array)=>{

    return array[Math.floor(random(0,array.length))]
  }
  
  


function multiDuo(multicolors,gradientCount){
  colorObjects = []
      let mc = multicolors[IntRandRange(0,multicolors.length)];
      let colorstoChoose = mc.colors;
      for(let i=0;i<gradientCount;i++){
        cObj = {};
        let c3 = colorstoChoose[i%colorstoChoose.length]
        
        cObj.color1 = hexToRgb(c3),
        cObj.color2 = hexToRgb("#000000"),
        cObj.mixRatio = 0.9;
        colorObjects.push(cObj);
        
      }
      let background = {color1: hexToRgb(mc.b1),
                color2: hexToRgb(mc.b2),
                mixRatio:0.9          
      }
      colorObjects.unshift(background)
      return colorObjects
}



function hexToRgb(hex) {
  hex = hex.replace('#', '');

  var bigint = parseInt(hex, 16);

  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return color(r, g, b);
}

function getPoints(x,y,angle,length){
  return createVector(x+cos(angle)*length,
 y+sin(angle)*length)
}

function setOriginFromFace(face){
 
  if(face.orientation ==="right"){
    return "rightBack"
  }
  if(face.orientation ==="left"){
    return "leftBack"
  } if(face.orientation ==="top"){
    return "bottom"
  }
  // if(face.orientation ==="bottom"){
  //   return "top"
  // }
 }


 function getColor(x,y){
  let c = get(x,y);
  return RGBtoHSB(c[0],c[1],c[2])
  
}



function RGBtoHSB (r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const v = Math.max(r, g, b),
    n = v - Math.min(r, g, b);
  const h =
    n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
  return color(60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100);
};

function addArrElements(arr){
  const initialValue = 0;
const sum = arr.reduce(
  (accumulator, currentValue) => accumulator + currentValue,
  initialValue
);
return sum;
}