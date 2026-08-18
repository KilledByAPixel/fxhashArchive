/*                                       
  _____                      _                   
  / ___| | ___ _ __ ___  ___| |_ ___  _ __ _   _ 
 | |   | |/ _ \ '__/ _ \/ __| __/ _ \| '__| | | |
 | |___| |  __/ | |  __/\__ \ || (_) | |  | |_| |
  \____|_|\___|_|  \___||___/\__\___/|_|   \__, |
                                           |___/ 
                
  noun. - the upper part of the nave, choir, and transepts of a large church, containing a series of windows. It is clear of the roofs of the aisles and admits light to the central parts of the building.
             
                - made with <3 by Michael R Perusse  */

var chosenPalette = [];
var shuffledPal = [];
var sampledBg;
var w;
var h;
var renderer;

function setUniforms(shade) {
  shade.setUniform("u_resolution", [w * 1.0, h * 1.0]);
  shade.setUniform("seedA", seedA);
  shade.setUniform("seedB", seedB);
  shade.setUniform("seedC", seedC);
  shade.setUniform("seedD", seedD);
  shade.setUniform("seedE", seedE);
  shade.setUniform("seedF", seedF);
  shade.setUniform("PI", 3.141592);
  shade.setUniform("time", millis());

  var mirror = true;
  shade.setUniform("mirror", mirror);

  var structure = fxRandomFromList([0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 14, 14]);
  shade.setUniform("structure", structure);

  var yResMultiplier = -1.0 * map(fxrand() + 0.75, 0.75, 1.75, 0.25, 1.5);
  shade.setUniform("yResMultiplier", yResMultiplier);

  const NONE = 0;
  const SUPERXY = 1;
  const XBEND = 2;
  const YBEND = 3;

  var bendiness;

  bendiness = fxRandomFromList([NONE, NONE, SUPERXY, XBEND, YBEND]);
  if (structure == 14) {
    bendiness = fxRandomFromList([
      NONE,
      NONE,
      NONE,
      NONE,
      SUPERXY,
      XBEND,
      YBEND,
    ]);
  }
  shade.setUniform("bendiness", bendiness);

  var colorMirrorShift = fxRandomFromList([
    false,
    false,
    false,
    false,
    false,
    false,
    true,
  ]);

  if (!mirror) {
    colorMirrorshift = false;
  }
  if (bendiness == XBEND) {
    colorMirrorShift = false;
  }

  shade.setUniform("colorMirrorShift", colorMirrorShift);

  var useWebbing = false;
  shade.setUniform("useWebbing", useWebbing);

  var angled = fxRandomFromList([true, false, false, false]);
  shade.setUniform("angled", angled);

  var rotated = fxRandomFromList([true, false, false]);
  shade.setUniform("rotated", rotated);

  var zoomDirectionX = fxRandomFromList([-1.0, 1.0]);
  shade.setUniform("zoomDirectionX", zoomDirectionX);

  var zoomDirectionY = fxRandomFromList([-1.0, 1.0]);
  shade.setUniform("zoomDirectionY", zoomDirectionY);

  var marginMultiplier = fxRandomFromList([
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    0.9,
  ]);

  var removeBgColor = fxRandomFromList([true, true, false, false]);

  shade.setUniform("removeBgColor", removeBgColor);

  shade.setUniform("marginMultiplier", marginMultiplier);

  var useOutline = fxRandomFromList([true, true, false]);

  if (structure == 1) {
    useOutline = false;
  }

  var outlineType = fxRandomFromList([
    0.0, // black or white
    0.0,
    1.0, // space in between
    2.0, // other color
    2.0,
    2.0,
    3.0, // shadow Only
    3.0,
    3.0,
  ]);

  shade.setUniform("useOutline", useOutline);
  shade.setUniform("outlineType", outlineType);

  var internalBlurLayering = fxRandomFromList([true, false, false, false]);
  if (useOutline) {
    internalBlurLayering = false;
  }

  shade.setUniform("internalBlurLayering", internalBlurLayering);

  var coloredIn;
  if (removeBgColor) {
    coloredIn = fxRandomFromList(["fully", "mostly", "mostly", "half"]);
  } else {
    coloredIn = fxRandomFromList([
      "fully",
      "mostly",
      "mostly",
      "half",
      "half",
      "barely",
      "barely",
      "barely",
    ]);
  }

  var shatterType = fxRandomFromList([
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    2.0,
  ]);

  shade.setUniform("shatterType", shatterType);

  var addOffsetLayering;
  if (outlineType == 0.0) {
    addOffsetLayering = false;
  } else if (outlineType == 3.0) {
    addOffsetLayering = fxRandomFromList([true, false, false]);
  } else {
    addOffsetLayering = true;
  }

  var hideBorderChunks = true;

  shade.setUniform("hideBorderChunks", hideBorderChunks);

  var dirtyBorders = fxRandomFromList([
    true,
    true,
    true,
    true,
    true,
    true,
    false,
  ]);
  shade.setUniform("dirtyBorders", dirtyBorders);

  shade.setUniform("addOffsetLayering", addOffsetLayering);

  NEWINGTON_PALETTE = [
    color(map(40, 0, 360, 0, 100), 5, 98),

    [
      color(hue360to100(44), 21, 91),
      color(hue360to100(70), 22, 62),
      color(hue360to100(110), 22, 79),
      color(hue360to100(293), 43, 36),
      color(hue360to100(198), 47, 61),
      color(hue360to100(43), 71, 91),
      color(hue360to100(60), 3, 89),
      color(hue360to100(18), 84, 41),
      color(hue360to100(0), 76, 57),
      color(hue360to100(0), 63, 80),
      color(hue360to100(27), 30, 84),
      color(hue360to100(343), 56, 81),
      color(hue360to100(0), 13, 22),
      color(hue360to100(60), 8, 22),
      color(hue360to100(11), 52, 75),
      color(hue360to100(6), 92, 69),
      color(hue360to100(27), 72, 58),
      color(hue360to100(65), 32, 74),
      color(hue360to100(18), 24, 87),
      color(hue360to100(86), 46, 51),
    ],
  ];

  DOTHAN_PALETTE = [
    color(map(40, 0, 360, 0, 100), 5, 98),

    [
      color(hue360to100(0), 0, 19),
      color(hue360to100(41), 27, 81),
      color(hue360to100(178), 61, 37),
      color(hue360to100(7), 70, 82),
      color(hue360to100(54), 61, 84),
      color(hue360to100(301), 45, 39),
      color(hue360to100(234), 80, 61),
      color(hue360to100(4), 95, 75),
      color(hue360to100(36), 37, 78),
      color(hue360to100(142), 16, 68),
      color(hue360to100(0), 65, 80),
      color(hue360to100(16), 7, 78),
      color(hue360to100(329), 32, 58),
      color(hue360to100(343), 60, 81),
      color(hue360to100(237), 40, 55),
      color(hue360to100(8), 18, 71),
      color(hue360to100(24), 88, 78),
      color(hue360to100(55), 13, 74),
      color(hue360to100(46), 97, 81),
      color(hue360to100(158), 61, 47),
      color(hue360to100(19), 20, 79),
      color(hue360to100(56), 57, 75),
    ],
  ];

  var JADE_HUE_OFFSET = 0.0;
  if (fxrand() > 0.5) {
    JADE_HUE_OFFSET = map(fxrand(), 0, 1, -140, 150);
  }

  JADE_PALETTE = [
    color(map(43, 0, 360, 0, 100), 12, 93),

    [
      color(map(161 + JADE_HUE_OFFSET, 0, 360, 0, 100), 50, 45),
      color(map(149 + JADE_HUE_OFFSET, 0, 360, 0, 100), 25, 67),
      color(map(149 + JADE_HUE_OFFSET, 0, 360, 0, 100), 24, 71),
      color(map(160 + JADE_HUE_OFFSET, 0, 360, 0, 100), 48, 42),
      color(map(149 + JADE_HUE_OFFSET, 0, 360, 0, 100), 29, 59),
      color(map(139 + JADE_HUE_OFFSET, 0, 360, 0, 100), 23, 63),
      color(map(146 + JADE_HUE_OFFSET, 0, 360, 0, 100), 25, 69),
      color(hue360to100(39), 11, 96),
      color(hue360to100(35), 12, 98),
      color(hue360to100(48), 11, 93),
      color(hue360to100(35), 14, 96),
    ],
  ];

  TRIPLETS_PALETTE = [
    color(hue360to100(54), 4, 97),

    [
      color(hue360to100(45), 60, 88),
      color(hue360to100(213), 72, 44),
      color(hue360to100(8), 99, 59),
      color(hue360to100(45), 71, 89),
      color(hue360to100(213), 85, 47),
      color(hue360to100(8), 76, 74),
      color(hue360to100(20), 2, 94),
      color(hue360to100(70), 55, 9),
    ],
  ];

  PARTY_PALETTE = [
    color(map(54, 0, 360, 0, 100), 9, 85),

    [
      color(hue360to100(50), 21, 11),
      color(hue360to100(7), 63, 69),
      color(hue360to100(150), 53, 37),
      color(hue360to100(140), 52, 46),
      color(hue360to100(330), 5, 16),
      color(hue360to100(345), 56, 49),
      color(hue360to100(45), 56, 91),
      color(hue360to100(216), 67, 66),
      color(hue360to100(241), 43, 53),
      color(hue360to100(45), 5, 91),
      color(hue360to100(317), 45, 71),
      color(hue360to100(215), 51, 78),
      color(hue360to100(46), 15, 90),
      color(hue360to100(178), 23, 68),
      color(hue360to100(90), 39, 63),
      color(hue360to100(45), 5, 92),
      color(hue360to100(39), 67, 85),
    ],
  ];

  BLACK_RED_PALETTE = [
    color(map(40, 0, 360, 0, 100), 5, 98),
    [
      color(map(358, 0, 360, 0, 100), 72, 76),
      color(map(0, 0, 360, 0, 100), 0, 0),
    ],
  ];

  BW_PALETTE = [
    color(map(42, 0, 360, 0, 100), 9, 2),

    [
      color(hue360to100(42), 3, 92),
      color(hue360to100(42), 2, 98),
      color(hue360to100(42), 4, 88),
      color(hue360to100(42), 2, 98),
    ],
  ];

  PAPER_PALETTE = [
    color(map(43, 0, 360, 0, 100), 7, 96),

    [
      color(hue360to100(0), 23, 5),
      color(hue360to100(0), 0, 17),
      color(hue360to100(43), 7, 90),
      color(hue360to100(0), 0, 95),
    ],
  ];

  CARNIVAL_PALETTE = [
    color(hue360to100(270), 27, 38),

    [
      color(hue360to100(235), 25, 38),
      color(hue360to100(2), 28, 55),
      color(hue360to100(164), 16, 62),
      color(hue360to100(345), 56, 55),
      color(hue360to100(98), 17, 51),
      color(hue360to100(19), 40, 67),
      color(hue360to100(347), 54, 53),
      color(hue360to100(0), 39, 72),
      color(hue360to100(49), 23, 77),
      color(hue360to100(2700), 27, 32),
      color(hue360to100(13), 16, 88),
      color(hue360to100(52), 22, 40),
      color(hue360to100(235), 35, 38),
      color(hue360to100(2), 38, 55),
      color(hue360to100(164), 26, 62),
      color(hue360to100(345), 66, 55),
      color(hue360to100(98), 27, 51),
      color(hue360to100(19), 60, 67),
      color(hue360to100(347), 64, 53),
      color(hue360to100(0), 49, 72),
      color(hue360to100(49), 33, 77),
      color(hue360to100(270), 37, 32),
    ],
  ];

  JAZZCLUB_PALETTE = [
    color(hue360to100(25), 15, 90),

    [
      color(hue360to100(345), 21, 78),
      color(hue360to100(157), 28, 61),
      color(hue360to100(184), 43, 55),
      color(hue360to100(43), 49, 93),
      color(hue360to100(204), 41, 64),
      color(hue360to100(21), 44, 33),
      color(hue360to100(20), 25, 73),
      color(hue360to100(344), 45, 80),
      color(hue360to100(45), 2, 92),
      color(hue360to100(167), 25, 79),
      color(hue360to100(48), 6, 89),
      color(hue360to100(156), 10, 88),
    ],
  ];

  SHIMMER_PALETTE = [
    color(hue360to100(48), 73, 75),

    [
      color(hue360to100(3), 55, 13),
      color(hue360to100(6), 87, 54),
      color(hue360to100(47), 55, 96),
      color(hue360to100(45), 56, 91),
      color(hue360to100(36), 75, 65),
      color(hue360to100(37), 75, 30),
      color(hue360to100(39), 61, 53),
      color(hue360to100(47), 70, 93),
      color(hue360to100(47), 69, 29),
      color(hue360to100(51), 70, 53),
      color(hue360to100(56), 73, 33),
      color(hue360to100(43), 73, 79),
      color(hue360to100(49), 47, 96),
      color(hue360to100(31), 68, 55),
      color(hue360to100(16), 78, 68),
    ],
  ];
  if (fxrand() > 0.6) {
    SHIMMER_PALETTE[0] = color(map(10, 0, 360, 0, 100), 78, 65);
  }

  LILIES_PALETTE = [
    color(hue360to100(348), 28, 82),

    [
      color(hue360to100(8), 57, 76),
      color(hue360to100(6), 64, 57),
      color(hue360to100(210), 44, 54),
      color(hue360to100(16), 62, 72),
      color(hue360to100(38), 65, 83),
      color(hue360to100(14), 31, 88),
      color(hue360to100(348), 28, 76),
      color(hue360to100(25), 53, 65),
      color(hue360to100(210), 47, 82),
      color(hue360to100(48), 59, 71),
      color(hue360to100(56), 46, 51),
      color(hue360to100(84), 33, 60),
      color(hue360to100(193), 21, 26),
    ],
  ];

  WET_PALETTE = [
    color(hue360to100(24), 5, 90),

    [
      color(hue360to100(240), 8, 84),
      color(hue360to100(35), 17, 77),
      color(hue360to100(166), 11, 47),
      color(hue360to100(345), 2, 71),
      color(hue360to100(133), 13, 27),
      color(hue360to100(110), 16, 56),
      color(hue360to100(237), 11, 86),
      color(hue360to100(44), 5, 90),
      color(hue360to100(180), 10, 69),
      color(hue360to100(36), 16, 73),
      color(hue360to100(161), 14, 60),
      color(hue360to100(209), 27, 71),
      color(hue360to100(36), 7, 84),
      color(hue360to100(211), 28, 58),
      color(hue360to100(185), 7, 60),
    ],
  ];

  FORESTFIRE_PALETTE = [
    color(hue360to100(38), 59, 90),

    [
      color(hue360to100(149), 40, 34),
      color(hue360to100(21), 65, 52),
      color(hue360to100(31), 33, 34),
      color(hue360to100(17), 17, 16),
      color(hue360to100(26), 86, 31),
      color(hue360to100(78), 21, 76),
      color(hue360to100(0), 69, 37),
      color(hue360to100(16), 73, 83),
      color(hue360to100(138), 32, 50),
      color(hue360to100(46), 46, 79),
      color(hue360to100(131), 13, 52),
      color(hue360to100(42), 50, 79),
      color(hue360to100(13), 49, 76),
      color(hue360to100(38), 66, 95),
      color(hue360to100(124), 12, 51),
      color(hue360to100(58), 25, 62),
    ],
  ];

  WICKER_PALETTE = [
    color(hue360to100(209), 27, 79),

    [
      color(hue360to100(10), 56, 35),
      color(hue360to100(186), 32, 52),
      color(hue360to100(48), 71, 84),
      color(hue360to100(6), 81, 85),
      color(hue360to100(44), 36, 84),
      color(hue360to100(198), 92, 23),
      color(hue360to100(53), 49, 62),
      color(hue360to100(46), 69, 65),
      color(hue360to100(40), 24, 91),
      color(hue360to100(34), 70, 91),
      color(hue360to100(64), 59, 72),
      color(hue360to100(158), 62, 36),
      color(hue360to100(32), 37, 76),
      color(hue360to100(149), 46, 36),
      color(hue360to100(25), 43, 60),
      color(hue360to100(21), 53, 24),
    ],
  ];

  if (fxrand() > 0.6) {
    WICKER_PALETTE[0] = color(hue360to100(34), 70, 91); // 8,
  }

  const COLORS = 1;
  var palettes = [
    PARTY_PALETTE,
    PARTY_PALETTE,
    PARTY_PALETTE,
    PARTY_PALETTE,
    WICKER_PALETTE,
    NEWINGTON_PALETTE,
    DOTHAN_PALETTE,
    JADE_PALETTE,
    TRIPLETS_PALETTE,
    LILIES_PALETTE,
    WET_PALETTE,
    CARNIVAL_PALETTE,
    BLACK_RED_PALETTE,
    SHIMMER_PALETTE,
    JAZZCLUB_PALETTE,
    FORESTFIRE_PALETTE,
  ];
  if (bendiness != SUPERXY) {
    palettes.push(PAPER_PALETTE);
  }
  chosenPalette = fxRandomFromList(palettes);

  var chosenPaletteColors = chosenPalette[COLORS];

  if (chosenPalette == PARTY_PALETTE) {
    sampledBg = fxRandomFromList([true, true, false, true, true]);
  } else if (chosenPalette == PAPER_PALETTE) {
    sampledBg = false;
  } else {
    sampledBg = fxRandomFromList([true, false]);
  }

  if (chosenPalette == PAPER_PALETTE) {
    coloredIn = fxRandomFromList(["half", "mostly", "barely"]);
  }

  if (coloredIn == "half") {
    for (var i = 0; i < chosenPalette.length * 2; i++) {
      chosenPaletteColors.push(chosenPalette[0]); //add the bg
    }
  } else if (coloredIn == "mostly") {
    for (var i = 0; i < int(chosenPalette.length * 1.2 + 1); i++) {
      chosenPaletteColors.push(chosenPalette[0]); //add the bg
    }
  } else if (coloredIn == "barely") {
    for (var i = 0; i < chosenPalette.length * 8; i++) {
      chosenPaletteColors.push(chosenPalette[0]); //add the bg
    }
  }

  var shuffleSeed = map(fxrand(), 0, 1, 0, 100000000);
  randomSeed(shuffleSeed);
  shuffledPal = shuffle(chosenPaletteColors); // Shuffle order of palette

  shade.setUniform("numColors", float(shuffledPal.length));
  shade.setUniform(
    "palettePreCleaning",
    colorsToArrayOfFloatTriples(shuffledPal)
  );

  if (sampledBg) {
    shade.setUniform("bgColor", colorsToArrayOfFloatTriples([shuffledPal[0]]));
  } else {
    shade.setUniform(
      "bgColor",
      colorsToArrayOfFloatTriples([chosenPalette[0]])
    );
  }

  var debug = false;
  if (debug) {
    print(
      "yResMultiplier: " +
        str(yResMultiplier) +
        "\n" +
        "structure: " +
        str(structure) +
        "\n" +
        "bendiness: " +
        str(bendiness) +
        "\n" +
        "mirror: " +
        str(mirror) +
        "\n" +
        "sampledBg: " +
        str(sampledBg) +
        "\n" +
        "colorMirrorShift: " +
        str(colorMirrorShift) +
        "\n" +
        "marginMultiplier: " +
        str(marginMultiplier) +
        "\n" +
        "angled: " +
        str(angled) +
        "\n" +
        "zoomDirection: " +
        str(zoomDirectionX, zoomDirectionY) +
        "\n" +
        "addOffsetLayering: " +
        str(addOffsetLayering) +
        "\n" +
        "removeBgColor: " +
        str(removeBgColor) +
        "\n" +
        "coloredIn: " +
        str(coloredIn) +
        "\n" +
        "useOutline: " +
        str(useOutline) +
        "\n" +
        "hideBorderChunks: " +
        str(hideBorderChunks) +
        "\n" +
        "dirtyBorders: " +
        str(dirtyBorders) +
        "\n" +
        "internalBlurLayering: " +
        str(internalBlurLayering) +
        "\n" +
        "rotated: " +
        str(rotated) +
        "\n" +
        "shatterType: " +
        str(shatterType) +
        "\n" +
        "outlineType: " +
        str(outlineType)
    );
  }
}

function fxRandomFromList(entityList) {
  var chosenIndex = int(map(fxrand(), 0, 1, 0, entityList.length));
  return entityList[chosenIndex];
}

function hue360to100(val) {
  return map(val, 0, 360, 0, 100);
}

function pointsToFlatList(points) {
  var flatPoints = [];

  for (var i = 0; i < points.length; i++) {
    flatPoints.push(points[i][0]);
    flatPoints.push(points[i][1]);
  }

  return flatPoints;
}

// Converts an array of p5 colors to floats for vec3 glsl assembly, unpacked later
function colorsToArrayOfFloatTriples(colors) {
  var arrayOfFloatTriples = [];

  colors.forEach(function (color) {
    arrayOfFloatTriples.push(map(red(color), 0, 256, 0, 1));
    arrayOfFloatTriples.push(map(green(color), 0, 256, 0, 1));
    arrayOfFloatTriples.push(map(blue(color), 0, 256, 0, 1));
  });

  return arrayOfFloatTriples;
}

function preload() {
  shade = loadShader("assets/shader.vert", "assets/shader.frag");
}

function setup() {
  noLoop();
  noStroke();
  noFill();
  seedA = float(int(fxrand() * 1000) / 1000);
  seedB = float(int(fxrand() * 1000) / 1000);
  seedC = float(int(fxrand() * 1000) / 1000);
  seedD = float(int(fxrand() * 1000) / 1000);
  seedE = float(int(fxrand() * 1000) / 1000);
  seedF = float(int(fxrand() * 1000) / 1000);
  print(
    "seeds: " +
      str(fxhash) +
      " " +
      str(seedA) +
      " " +
      str(seedB) +
      " " +
      str(seedC) +
      " " +
      str(seedD) +
      " " +
      str(seedE) +
      " " +
      str(seedF)
  );
  colorMode(HSB, 100);
  noStroke();
}

function keyPressed() {
  if (key == "s") {
    save("Clerestory.png");
  }
}

function draw() {
  if (windowWidth >= windowHeight / 1.3) {
    h = windowHeight * 0.98;
    w = h / 1.3;
  } else {
    w = windowWidth * 0.9;
    h = w * 1.3;
  }

  var resolutionMult = 1.0;
  canvasW = w * resolutionMult;
  canvasH = h * resolutionMult;

  smooth();
  createCanvas(canvasW, canvasH, WEBGL);
  setAttributes("antialias", true);

  pg = createGraphics(w * 2.0, h * 2.0, WEBGL);
  pg.smooth();
  pg.shader(shade);
  setUniforms(shade);

  if (sampledBg) {
    background(shuffledPal[0]);
  } else {
    background(chosenPalette[0]);
  }

  var divisions = 1.;
  for (var x = 0; x < divisions; x++) {
    for (var y = 0; y < divisions; y++) {
      shade.setUniform("sectionX", float(x));
      shade.setUniform("sectionY", float(y));
      pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);

      image(
        pg,
        ((width / divisions) * x * -1.) / 2. - width / 2.,
        (height / divisions) * y * -1. - height / 2.,
        width / divisions,
        height / divisions
      );
    }
  }

  fxpreview();
}