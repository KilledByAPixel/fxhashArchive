//////UTILS//////

function iOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}


function getKeyByValue(obj, value) {
  return Object.keys(obj).find(key => obj[key] === value);
}

function findNextValueByValue(value, obj) {
  var keys = Object.keys(obj);
  return obj[keys[(keys.indexOf(getKeyByValue(obj, value)) + 1) % keys.length]];
}


function memcpy(src, srcOffset, dst, dstOffset, length) {
    var i
    src = src.subarray || src.slice ? src : src.buffer
    dst = dst.subarray || dst.slice ? dst : dst.buffer

    src = srcOffset
      ? src.subarray
        ? src.subarray(srcOffset, length && srcOffset + length)
        : src.slice(srcOffset, length && srcOffset + length)
      : src

    if (dst.set) {
      dst.set(src, dstOffset)
    } else {
      for (i = 0; i < src.length; i++) {
        dst[i + dstOffset] = src[i]
      }
    }

    return dst
  }


//FXHASH random function for specific implimentation
gene = fxrand;

//rand functions for random generator. Assumes generator producing float point between 0 and 1
function generateRandomInt(min,max){
  return Math.floor((gene() * (max-min)) +min);
}

function gene_range(min, max){
  return (gene() * (max - min)) + min;
}

function gene_pick_n(min, max, n){
  var unique_list = [];
  for (var i = 0; i < n; i++) {
    unique_list.push(Math.floor((gene() * (max-min)) + min));
  }
  return unique_list
}

function gene_weighted_choice(data){
  let total = 0;
  for (let i = 0; i < data.length; ++i) {
      total += data[i][1];
  }
  const threshold = gene() * total;
  total = 0;
  for (let i = 0; i < data.length - 1; ++i) {
      total += data[i][1];
      if (total >= threshold) {
          return data[i][0];
      }
  }
  return data[data.length - 1][0];
}

function calculate_size(mode, node) {
    if (mode == 0) {
      return gene() * 50 + 25
    } else if (mode == 1) {
      return (node.connectivity/5) * 50 + 25
    } else if (mode == 2) {
      return in_case_of_common_size * 50 + 25
    } else if (mode == 3) {
      return gene() * 50 + 25
    }
  }

function sigmoid(z, k) {
  return 1 / (1 + Math.exp(-z/k));
}

function createCircleTexture(color, size) {
  var matCanvas = document.createElement('canvas');
  matCanvas.width = matCanvas.height = size;
  var matContext = matCanvas.getContext('2d');
  // create texture object from canvas.
  var texture = new THREE.Texture(matCanvas);
  // Draw a circle
  var center = size / 2;
  matContext.beginPath();
  matContext.arc(center, center, size/2, 0, 2 * Math.PI, false);
  matContext.closePath();
  matContext.fillStyle = color;
  matContext.fill();
  // need to set needsUpdate
  texture.needsUpdate = true;
  // return a texture made from the canvas
  return texture;
}


// returns a gaussian random function with the given mean and standard deviation (normal distribution has a mean of 0 and the standard deviation of 1)
function gaussian(mean, stdev) {
  var y2;
  var use_last = false;
  return function() {
    var y1;
    if (use_last) {
      y1 = y2;
      use_last = false;
    } else {
      var x1, x2, w;
      do {
        x1 = 2.0 * gene() - 1.0;
        x2 = 2.0 * gene() - 1.0;
        w = x1 * x1 + x2 * x2;
      } while (w >= 1.0);
      w = Math.sqrt((-2.0 * Math.log(w)) / w);
      y1 = x1 * w;
      y2 = x2 * w;
      use_last = true;
    }
    var retval = mean + stdev * y1;
    if (retval > 0)
      return retval;
    return -retval;
  }
}

// calculates a number between two numbers at a specific increment
function lerp(start, end, amt){
  return (1 - amt) * start + amt * end;
}
