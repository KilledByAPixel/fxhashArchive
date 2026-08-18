var sx;
var cnvw;
var cnvh;

settings();

function wchoice(options){  // weighted
  let opt = [];
  for (let o of options){
    for (let i = 0; i < o[1]; i++){
      opt.push(o[0]);
    }
  }
  let choice = Math.floor(rand(0, opt.length));
  return opt[choice];
}

function echoice(options){  // equal
  let choice = Math.floor(rand(0, options.length));

  return options[choice];
}

function settings(){
  if (window.innerWidth <= window.innerHeight){
    dim = Math.min(window.innerWidth, window.innerHeight);
  }
  else{
    dim = Math.min(window.innerWidth, window.innerHeight) * 0.97;
  }
  cnvw = dim;
  cnvh = dim;

  sx = {
    // General
    numDoodles: 2000,
    numAttempts: 3,
    palette: wchoice(palettes),
    texture: wchoice([["flat", 3], ["watercolor", 20]]),
    colSelection: wchoice([["by shape", 20], ["by location",1]]),

    // Segments
    numDivides: 15,

    // Noise
    shapeDistribution: wchoice( [
      [{res: 0.05, name: "very scattered"}, 2],
      [{res: 0.01, name: "scattered"}, 3],
      [{res: 0.002, name: "smooth"}, 5],
      [{res: 0.0003, name: "very smooth"}, 2]
    ]),

    colRes: 0.003,
    watercolRes: 0.008,

    // Spacing
    pathBorder: wchoice( [
      [{size: dim*0.0005, name: "squished"}, 3],
      [{size: dim*0.001, name: "close fit"}, 5],
      [{size: dim*0.0025, name: "full"}, 10],
      [{size: dim*0.0036, name: "neat"}, 15],
      [{size: dim*0.01, name: "airy"}, 5],
      [{size: dim*0.025, name: "ultra lite"}, 3],
    ]),

    pathPointGap: dim*0.0034,

    largeChance: wchoice([[0, 3], [0.1, 10], [0.4, 1]]),

    // Doodle settings
    burstDash: {
      length: {
        min: dim*0.008,
        max: dim*0.025
      },
    },
    dash: {
      length: {
        min: dim*0.008,
        max: dim*0.025
      },
      lengthLarge: {
        min: dim*0.02,
        max: dim*0.1
      },
      angle: wchoice( [
        [{res: 0.3, name: "all over the place"}, 2],
        [{res: 0.02, name: "tight wave"}, 8],
        [{res: 0.001, name: "smooth wave"}, 13],
        [{res: 0.00002, name: "aligned"}, 2],
      ]),
    },
    sidedShape: {
      radius: {
        min: dim*0.006,
        max: dim*0.02
      },
      radiusLarge: {
        min: dim*0.03,
        max: dim*0.1
      },
      angle: wchoice( [
        [{res: 0.01, name: "zig zaggy"}, 2],
        [{res: 0.0025, name: "varied"}, 10],
        [{res: 0.00012, name: "aligned"}, 8],
        [{res: 0.00002, name: "super aligned"}, 1],
      ]),
    },
    circ: {
      dia: {
        min: dim*0.01,
        max: dim*0.03,
      },
      diaLarge: {
        min: dim*0.06,
        max: dim*0.2
      },
    },
    dot: {
      dia: {
        min: dim*0.005,
        max: dim*0.01
      }
    },
    strokeWeight: {
      min: wchoice([[dim * 0.0021, 1], [dim * 0.0025, 5]]),
      max: wchoice([[dim * 0.0042, 1], [dim * 0.006, 9]])
    },
    largeStrokeWeight: {
      min: dim * 0.01,
      max: dim * 0.016
    },

    // Loading icon
    loadingSize:{
      min: dim * 0.1,
      max: dim * 0.2,
      inc: 2,
      t: 0,
      swmin: dim*0.01,
      swmax: dim*0.05
    },
  }

  if (sx.palette.type == "light"){
    sx.strokeWeight = {
      min: dim * 0.003,
      max: dim * 0.008
    };
    sx.pathBorder = wchoice( [
      [{size: dim*0.0005, name: "squished"}, 3],
      [{size: dim*0.001, name: "close fit"}, 5],
      [{size: dim*0.0025, name: "full"}, 15],
      [{size: dim*0.0036, name: "neat"}, 10],
      [{size: dim*0.01, name: "airy"}, 3],
    ]);
  }

  sx.varigatedMode = "off";

  if (sx.pathBorder.name == "airy" || sx.pathBorder.name == "ultra lite"){
    sx.dash.length = {
      min: dim*0.015,
      max: dim*0.065
    };
    sx.burstDash.length = {
      min: dim*0.015,
      max: dim*0.05
    };
    sx.circ.dia = {
      min: dim * 0.025,
      max: dim * 0.06
    };
    sx.sidedShape.dia = {
      min: dim * 0.01,
      max: dim * 0.04
    };
    sx.dot.dia = {
      min: dim*0.01,
      max: dim*0.1
    };
  }
  else if (sx.pathBorder.name != "squished" && sx.dash.angle.name != "all over the place" && sx.dash.angle.name != "tight wave" ){
    if (rand(0, 1) < 0.22){
      let dir = rand(0,1);

      if (dir < 0.25) sx.varigatedMode = "down";
      else if (dir < 0.5) sx.varigatedMode = "up";
      else if (dir < 0.75) sx.varigatedMode = "left";
      else sx.varigatedMode = "right";

      sx.varigateMinMult = 0.3;
      sx.varigateMaxMult = 7.0;
      sx.largeChance = 0;
    }

  }

  sx.segmentWidth = cnvw / sx.numDivides;
  sx.segmentHeight = cnvh / sx.numDivides;
  sx.numSegments = sx.numDivides * sx.numDivides;
  sx.segmentBorder = sx.pathBorder.size * 1.25;

  special = {
    bursts: {
      count: 0,
      on: true,
      num: wchoice([[0, 10], [1, 40], [2, 5]]),
      start: 0,
      numDoodles: [rand(300, 800), rand(300, 800)],
      totalDoodles: 0,
      locations: [
        {
          x: rand(cnvw*0.2, cnvw*0.8),
          y: rand(cnvh*0.2, cnvh*0.8)
        },
        {
          x: rand(cnvw*0.2, cnvw*0.8),
          y: rand(cnvh*0.2, cnvh*0.8)
        }
      ],
      tilts: [rand(0, 360), rand(0, 360)],
      ranges:[rand(100, 360), rand(30, 360)],
      minRad: [rand(dim*0.01, dim*0.08), rand(dim*0.01, dim*0.08)],
      maxRad: [rand(dim*0.15, dim*0.3), rand(dim*0.15, dim*0.3)],
    },
    mega: {
      count: 0,
      on: true,
      numDoodles: wchoice([[0, 5], [1, 8], [2, 8], [3, 3] ]),
      strokeWeight: {
        min: dim * 0.02,
        max: dim * 0.05,
      },
      circDia: {
        min: wchoice([[dim * 0.2, 2], [dim * 0.25, 2], [dim * 0.35, 1]]),
        max: wchoice([[dim * 0.5, 3], [dim * 0.7, 3], [dim * 0.8, 5]]),
      },
      sidedShapeRad: {
        min: wchoice([[dim * 0.15, 2], [dim * 0.2, 2], [dim * 0.25, 1]]),
        max: wchoice([[dim * 0.2, 3], [dim * 0.4, 3], [dim * 0.5, 5]]),
      },
    },
    dots: {
      count: 0,
      on: true,
      numDoodles: wchoice([[0, 1], [2000, 8]]),
    },
    chevrons: {
      count: 0,
      on: false,
      chance: 0.75,
      large: false,
      largeChance: 0.2,
      individualChance: 0.6,
      mode: "off",
      x: rand(cnvw*0.25, cnvw*0.75),
      y: rand(cnvh*0.25, cnvh*0.75),
      radius: {
        min: dim*0.004,
        max: dim*0.015
      },
      radiusLarge: {
        min: dim*0.01,
        max: dim*0.04
      },
      row: 0,
      col: 0,
      xGap: dim*0.03,
      yGap: dim*0.08,
      rad: dim*0.01,
      rows: Math.floor(rand(5, 8)),
      cols: Math.floor(rand(10, 25)),
      a: rand(0, 360)
    }
  }

  if (special.mega.numDoodles < 1) special.mega.on = false;
  if (special.bursts.num == 0) special.bursts.on = false;
  if (special.dots.numDoodles == 0) special.dots.on = false;
  if (!special.mega.on) sx.texture = "flat";

  for (let i = 0; i < special.bursts.num; i++){
    special.bursts.totalDoodles += special.bursts.numDoodles[i];
  }

  if (rand(0, 1) < special.chevrons.chance) {
    special.chevrons.on = true;
    special.chevrons.mode = "small"
    if (sx.pathBorder.name == "airy" || sx.pathBorder.name == "ultra lite"){
      special.chevrons.radius.min *= 1.2;
      special.chevrons.radius.max *= 1.2;
    }

    special.chevrons.xGap = special.chevrons.radius.max * 1.1;
    special.chevrons.yGap = special.chevrons.radius.max * 2.2;

    if (rand(0, 1) < special.chevrons.largeChance) {
      special.chevrons.large = true;
      special.chevrons.mode = "large"
      special.chevrons.rows = Math.floor(rand(3, 6));
      special.chevrons.cols = Math.floor(rand(8, 15));
      special.chevrons.individualChance = 0.5;
    }
  }

  special.chevrons.startX = special.chevrons.x;
  special.chevrons.startY = special.chevrons.y;
  special.chevrons.numDoodles = special.chevrons.rows * special.chevrons.cols;

  special.bursts.end = special.bursts.numDoodles;

  let megaShapes = "off";
  if (special.mega.numDoodles > 0) megaShapes = "on"

  window.$fxhashFeatures = {
    "Palette": sx.palette.name,
    "Large shape Texture": sx.texture,
    "Color selection": sx.colSelection,
    "Spacing": sx.pathBorder.name,
    "Doodle distribution" : sx.shapeDistribution.name,
    "Dash angles": sx.dash.angle.name,
    "Bursts": special.bursts.num,
    "Mega Shapes": megaShapes,
    "Large Shapes Chance": sx.largeChance * 100 + "%",
    "Chevrons": special.chevrons.mode,
    "Size gradient": sx.varigatedMode
  }

  //console.log(window.$fxhashFeatures)
  // console.log(sx);
  // console.log(special);

}
