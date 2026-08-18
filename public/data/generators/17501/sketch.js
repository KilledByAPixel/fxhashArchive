let seed = fxrand() * 1000000; //seed Hash
let globalProp = 1.414;
let pg, bg, canvas;
let heightCalculation, furtherObservation, lifeSpanCalculation, geneticProfile;

function windowResized() {
  resizeCanvas(window.innerHeight / globalProp, window.innerHeight);
  randomSeed(seed);
  noiseSeed(seed);
  canvas = createCanvas(window.innerHeight / globalProp, window.innerHeight);
  canvas.position(window.innerWidth/2 - width/2);
  PD = pixelDensity();
  hashNum = floor(random(1000000, 10000000000)); // Fill hashNum with a random large integer based on the fxhash - this number is fed into the shader to allow for randomness within the shader based on the hash
  pg = createGraphics(2400, 3396);
  noLoop();
  if(random() < 0.6) {
    paletten = 0;
    palette = colorScheme[paletten];
  }
  else {
    paletten = int(random(1, colorScheme.length));
    palette = colorScheme[paletten];
  }
  rowCount = rowCountValues[int(random(0, rowCountValues.length))];
  columnCount = colCountValues[int(random(0, colCountValues.length))];
  rowHeight = height / rowCount;
  columnWidth = width / columnCount;
  switchAmount = random(0.1, 9);
  mutation = int(random(10));
  background(palette[int(random(0, palette.length))]);
  heightCalculation = int(random(115, 220));
  furtherObservation = int(random(1000));
  lifeSpanCalculation = int(random(60, 120));
  let normalGeneticProfile = analysisAmount[int(random(0, analysisAmount.length))] +
    analysis[int(random(0, analysis.length))] +
    "suggests subject " +
    personalityDiagnosis[int(random(0, personalityDiagnosis.length))] +
    personalityFreq[int(random(0, personalityFreq.length))] +
    timeFrame[int(random(0, timeFrame.length))] +
    personalityType1[int(random(0, personalityType1.length))] +
    " and " +
    personalityType2[int(random(0, personalityType2.length))] +
    ", yet also " +
    personalityPotential[int(random(0, personalityPotential.length))] +
    " " +
    personalitySup[int(random(0, personalitySup.length))] +
    personalityPosQual1[int(random(0, personalityPosQual2.length))] +
    " and " +
    personalityPosQual2[int(random(0, personalityPosQual2.length))] +
    "." +
    " Maximum potential hereditary height (excluding nutritional and environmental factors) is estimated at " +
    heightCalculation +
    "-" +
    (heightCalculation + int(random(5, 10))) +
    "cm." +
    " Projected natural lifespan estimated at " +
    lifeSpanCalculation +
    "-" +
    (lifeSpanCalculation + int(random(12))) +
    " years. ";

  let mutationGeneticProfile = mutationPresent[int(random(0, mutationPresent.length))] +
  closerStudy[int(random(0, closerStudy.length))] +
  courseOfAction[int(random(0, courseOfAction.length))] +
  ofInterest[int(random(0, ofInterest.length))] +
  furtherObservation +
  " through " +
  (furtherObservation + int(random(250))) +
  ", as these may indicate the presence of " +
  enhancedAbilities1[int(random(0, enhancedAbilities1.length))] +
  " and or " +
  enhancedAbilities2[int(random(0, enhancedAbilities2.length))];

  geneticProfile = normalGeneticProfile;
  if(mutation >= 8) {
    geneticProfile += mutationGeneticProfile;
  }
  window.$fxhashFeatures = {
      "Palette Name": schemeNames[paletten],
      "Row Count": rowCount,
      "Column Count": columnCount,
      "Gene Status": mutation < 8 ? "Normal" : "Mutated",
      "Genetic Profile": geneticProfile,
  };
  console.log($fxhashFeatures);
  drawS();
}

function m_col(_url) {
  let slash_index = _url.lastIndexOf("/");
  let palette_str = _url.slice(slash_index + 1);
  let arr = palette_str.split("-");
  for (let i = 0; i < arr.length; i++) {
    arr[i] = "#" + arr[i];
  }
  return arr;
}

const colorScheme = [
  m_col("D7312E-ECE3D0-F0AC00-0C7E45-2c52a0-f7bab6-5ec5ee-1D1D1B"), // "Tutti"
  m_col("ECE3D0-1D1D1B"), // "Shirokuro Resurrections"
  m_col("ECE3D0-BD9C75-1D1D1B-F08E00"), // "Ikebukuro"
  m_col("B6B992-151A1b-224870-D83715"), // "Brubeck Reloaded"
  m_col("D7312E-ECE3D0-1D1D1B"), // "Marunochi Resurrections"
  m_col("D7312E-ECE3D0-F0AC00-2c52a0-1D1D1B"), // "Dessau Resurrections"
  m_col("C5C8BA-F8C1C1-2C52A0"), // "Akiba Reloaded"
  m_col("E5CFB6-E5A19A-DE3921-DF8D27-1D1D1B"), // "Toucan Reloaded"
  m_col("fab500-e94f0e-009c55-e72486-783089-bab2a8-e40d1e-2262ad-1d1d1b-ece3d0"), // Illyria
];

const schemeNames = [
  "Tutti",
  "Shirokuro Resurrections",
  "Ikebukuro",
  "Brubeck Reloaded",
  "Marunochi Resurrections",
  "Dessau Resurrections",
  "Akiba Reloaded",
  "Toucan Reloaded",
  "Illyria",
];

let palette, paletteName;
let PD;
let hashNum;
let rowHeight;
let columnWidth;
let rowCountValues = [10, 25, 50, 100];
let colCountValues = [25, 50, 75, 100];
let intervalValues = [2, 3, 5, 10, 20, 50];
let spacingValues = [1, 2, 5];
let rowCount, columnCount;
let bgPalette = ["#ECE3D0", "#1D1D1B"];
let bandsPalette = ["#ECE3D0E6", "#ECE3D0", "#1D1D1B", '#bd9c75F2'];
let accentPalette = ["#f9f6f2E6", "#bd9c75E6"];
let switchAmount;
let mutation;

let analysisAmount = [
  "Initial analysis ",
  "Cursory examination ",
  "Preliminary analysis ",
  "Extensive analysis ",
  "Evaluation ",
  "Exploration ",
  "Detailed investigation ",
  "Interpretation ",
  "Anatomization ",
  "Detailed analysis ",
];

let analysis = [
  "of the presented genetic information ",
  "of the genetic information presented ",
  "of the information provided ",
  "of the available genetic information ",
  "of the extracted genetic profile ",
  "of the information extracted from the provided genetic information ",
  "of available data indicates that ",
];

let timeFrame = [
  " bouts of ",
  " episodes of ",
  " periods of ",
  " occurences of ",
];

let personalityDiagnosis = [
  "may suffer from ",
  "may be succeptible to ",
  "may experience ",
  "experiences ",
  "may have a disposition tending towards ",
  "may develop a psychological profile prone to ",
  "may be prone to ",
  "may possess markers linked to ",
  "may posess with a high degree of certainty: ",
  "may posess with a reasonable degree of certainty: ",
  "the presence of hereditary markers linked to ",
  "may exhibit ",
  "may posess a predeliction for ",
];

let personalityFreq = [
  "sporadic",
  "occasional",
  "frequent",
  "irregular",
  "excessive",
  "infrequent",
  "rare",
  "intermittent",
];

let personalityType1 = [
  "jealousy",
  "delusions of grandeur",
  "confusion",
  "pessimism",
  "anxiety",
  "negative self-imagery",
  "emotional outbursts",
  "obsessive compulsive tendencies",
  "contrarianism",
  "disagreeableness",
  "greed",
  "paranoia",
  "disassociation",
  "grandiosity",
  "narcissism",
];

let personalityType2 = [
  "egocentricity",
  "negativity",
  "emotional overwhelm",
  "self-sabotage",
  "lack of self-confidence",
  "negative internal dialogue",
  "fear",
  "anger",
  "a thirst for power",
  "a need for control",
  "a need for constant reassurance",
  "desire for attention",
  "need to always be right",
  "an inability to see things from the perspectives of others",
  "psychological projection",
  "laughter during inappropriate moments",
  "emotional manipulation",
  "lack of assertiveness",
  "[REDACTED]",
];

let personalitySup = [
  "a good degree of ",
  "a high degree of ",
  "excellent ",
  "superior ",
  "exceptional ",
  "above average ",
  "unparalled ",
  "unrivaled ",
  "unusual ",
  "uncommon ",
  "a rare level of ",
];

let personalityPotential = [
  "has the capacity for",
  "displays the potential for",
  "is capable of",
  "has the potential to display",
  "shows signs of",
  "has the ability to show",
  "displays",
  "shows",
  "has the aptitude for",
  "posesses an aptitude for",
];

let personalityPosQual1 = [
  "friendship",
  "empathy",
  "loyalty",
  "intelligence",
  "creative problem solving abilities",
  "creativity",
  "mathematical",
  "spacial reasoning",
  "cognitive plasticity",
  "problem solving",
  "interpersonal connection",
  "interpersonal communication",
  "communication",
  "[REDACTED]",
];

let personalityPosQual2 = [
  "abstract reasoning",
  "analytical skills",
  "foresight",
  "strategic thinking",
  "out-of-the-box thinking",
  "non-linear thinking",
  "athletic ability",
  "linguistic capability",
  "leadership",
  "sensitivity",
  "determination",
  "persistence",
  "kindness",
  "[REDACTED]",
];

let mutationPresent = [
  "Additional presence of mutated markers ",
  "Presence of mutation ",
  "Mutation present ",
  "Mutation detected ",
  "Detected genetic mutation ",
];

let closerStudy = [
  "requires closer study ",
  "urgently requires closer study ",
  "demands secondary and tertiary analysis ",
  "requires exhaustive examination ",
  "would benefit from re-examination ",
  "may benefit from closer scientific study ",
  "requires remote observation ",
  "requires intermittent observation ",
  "may require supervised observation ",
  "requires regular tests and observation ",
];

let courseOfAction = [
  "to determine best course of action for this individual. ",
  "to determine the presence of any superhuman abilities. ",
  "to determine the presence of any enhanced abilities. ",
  "to evaluate any useful analytical data for research purposes. ",
  "to asses the viability of the subject as a candidate for programs for the enhanced. ",
  "to ascertain the nature of any potential security issues related to any of subjects latent super-human abilities (if existant). ",
  "to determine existence of any latent abilities. ",
];

let ofInterest = [
  "Of particular interest are markers ",
  "Particular attention should be drawn to markers ",
  "It is advised that special attention be paid to markers ",
  "Careful examination of markers ",
  "Special care should be given to markers ",
  "Further investigation is advised for markers ",
  "Closer examination of mutated markers ",
  "Markers for further investigation are present from ",
  "Unusual genetic signatures were detected at markers ",
];

let enhancedAbilities1 = [
  "telekinesis",
  "temporal manipulation",
  "[REDACTED]",
  "molecular permeability",
  "electromagnetic disruption",
  "precognition",
  "pyrokinesis",
  "extra-sensory perception",
  "psychokinesis",
  "flight abilities",
  "atmokinesis",
];

let enhancedAbilities2 = [
  "the ability to manipulate space-time and quantum structures.",
  "synaptic entanglement (telepathic) abilities.",
  "enhanced speed.",
  "enhanced strength.",
  "sub-molecular projection (teleportation) abilities.",
  "chromatic diffraction abilities (invisibility).",
  "[REDACTED].",
  "accelerated cellular regeneration.",
];

function setup() {
  windowResized();
}

function keyPressed() {
  resizeCanvas(2400, 3396);
  randomSeed(seed);
  noiseSeed(seed);
  createCanvas(2400, 3396);
  canvas.position(window.innerWidth/2 - width/2);
  PD = pixelDensity();
  hashNum = floor(random(1000000, 10000000000)); // Fill hashNum with a random large integer based on the fxhash - this number is fed into the shader to allow for randomness within the shader based on the hash
  pg = createGraphics(2400, 3396);
  noLoop();
  if(random() < 0.6) {
    paletten = 0;
    palette = colorScheme[paletten];
  }
  else {
    paletten = int(random(1, colorScheme.length));
    palette = colorScheme[paletten];
  }
  rowCount = rowCountValues[int(random(0, rowCountValues.length))];
  columnCount = colCountValues[int(random(0, colCountValues.length))];
  rowHeight = height / rowCount;
  columnWidth = width / columnCount;
  switchAmount = random(0.1, 9);
  mutation = int(random(10));
  background(palette[int(random(0, palette.length))]);
  heightCalculation = int(random(115, 220));
  furtherObservation = int(random(1000));
  lifeSpanCalculation = int(random(60, 120));
  let normalGeneticProfile = analysisAmount[int(random(0, analysisAmount.length))] +
    analysis[int(random(0, analysis.length))] +
    "suggests subject " +
    personalityDiagnosis[int(random(0, personalityDiagnosis.length))] +
    personalityFreq[int(random(0, personalityFreq.length))] +
    timeFrame[int(random(0, timeFrame.length))] +
    personalityType1[int(random(0, personalityType1.length))] +
    " and " +
    personalityType2[int(random(0, personalityType2.length))] +
    ", yet also " +
    personalityPotential[int(random(0, personalityPotential.length))] +
    " " +
    personalitySup[int(random(0, personalitySup.length))] +
    personalityPosQual1[int(random(0, personalityPosQual2.length))] +
    " and " +
    personalityPosQual2[int(random(0, personalityPosQual2.length))] +
    "." +
    " Maximum potential hereditary height (excluding nutritional and environmental factors) is estimated at " +
    heightCalculation +
    "-" +
    (heightCalculation + int(random(5, 10))) +
    "cm." +
    " Projected natural lifespan estimated at " +
    lifeSpanCalculation +
    "-" +
    (lifeSpanCalculation + int(random(12))) +
    " years. ";

  let mutationGeneticProfile = mutationPresent[int(random(0, mutationPresent.length))] +
  closerStudy[int(random(0, closerStudy.length))] +
  courseOfAction[int(random(0, courseOfAction.length))] +
  ofInterest[int(random(0, ofInterest.length))] +
  furtherObservation +
  " through " +
  (furtherObservation + int(random(250))) +
  ", as these may indicate the presence of " +
  enhancedAbilities1[int(random(0, enhancedAbilities1.length))] +
  " and or " +
  enhancedAbilities2[int(random(0, enhancedAbilities2.length))];

  geneticProfile = normalGeneticProfile;
  if(mutation >= 8) {
    geneticProfile += mutationGeneticProfile;
  }
  window.$fxhashFeatures = {
      "Palette Name": schemeNames[paletten],
      "Row Count": rowCount,
      "Column Count": columnCount,
      "Mutation": mutation < 8 ? "Normal" : "Mutated",
      "Genetic Profile": geneticProfile,
  };
  console.log($fxhashFeatures);
  drawS();
  if (key == "s") {
    save(fxhash + ".png");
  }
  windowResized();
}

function drawS() {
  for (y = 0; y <= columnCount; y++) {
    for (i = 0; i <= rowCount; i++) {
      noStroke();

      let paletteSwitch = int(random(10));
      if (paletteSwitch > switchAmount) {
        noFill();
      } else {
        fill(palette[int(random(0, palette.length))]);
      }

      if (mutation <= 8) {
        if (
          y % intervalValues[int(random(0, intervalValues.length))] ==
          5
        ) {
          let paletteSwitch = int(random(10));
          fill(bgPalette[int(random(0, bgPalette.length))]);
          rect(
            0 + y * columnWidth,
            0 + i * rowHeight,
            int(random(5)) * columnWidth,
            int(random(5)) * rowHeight
          );
        } else {
          rect(
            0 + y * columnWidth,
            0 + i * rowHeight,
            columnWidth,
            rowHeight
          );
        }
      } else {
        if (y % 5 == 0) {
          fill(palette[int(random(0, palette.length))]);
          rect(
            0 + y * columnWidth,
            0 + i * rowHeight,
            int(random(50)) * columnWidth,
            int(random(50)) * rowHeight
          );
        } else {
          rect(
            0 + y * columnWidth,
            0 + i * rowHeight,
            10 * columnWidth,
            10 * rowHeight
          );
          
          let paletteSwitch = int(random(11));
          if (paletteSwitch > switchAmount + 1) {
            noFill();
          } else {
          fill(
            accentPalette[int(random(0, accentPalette.length))]
          );
          rect(
            y * columnWidth,
            i * rowHeight,
            columnWidth,
            rowHeight
          );
        }
        }
      }
    }
  }

  let horzProbability = int(random(10));

  let vertProbability = int(random(10));

  let horzBandColor = bandsPalette[int(random(0, bandsPalette.length))];
  let vertBandColor = bandsPalette[int(random(0, bandsPalette.length))];

  let horzBandThickness = [int(columnWidth / 1.4)];
  let vertBandThickness = [int(rowHeight / 1.4)];

  // Vertical strokes
  if (horzProbability >= 6) {
    for (var x = 0; x < width; x += width / columnCount) {
      stroke(horzBandColor);
      strokeWeight(
        horzBandThickness[int(random(0, horzBandThickness.length))]
      );
      line(x, 0, x, height);
    }
  }

  // Horizontal strokes
  if (vertProbability >= 6) {
    for (var y = 0; y < height; y += height / rowCount) {
      stroke(vertBandColor);
      strokeWeight(
        vertBandThickness[int(random(0, vertBandThickness.length))]
      );
      line(0, y, width, y);
    }
  }

  // Start of GLSL Noise Solution

  let use = `precision highp float;varying vec2 vPos;`;
  let vs =
    use +
    `attribute vec3 aPosition;void main(){vPos=(gl_Position=vec4(aPosition,1.0)).xy;}`;
  let fs;
  let c = createGraphics(width, height, WEBGL);
  c.pixelDensity(PD);
  let DIR = 40;
  let QUAL = 10;
  fs =
    use +
    `
  uniform vec2 r;
  uniform float pr;
  uniform sampler2D tex;

  float H=0.` +
    hashNum +
    `;

  float N21(vec2 p){
    vec3 p3=fract(vec3(p.xyx)*H);
    p3+=dot(p3,p3.yzx+33.33);
    return fract((p3.x+p3.y)*p3.z);
  }

  float SN(vec2 uv,float x,float y){
    uv=uv*vec2(x,y);
    vec2 lv = fract(uv);
    vec2 id=floor(uv);
    lv=lv*lv*(3.-2.*lv);
    float bl=N21(id);
    float br=N21(id+vec2(1,0));
    float b=mix(bl,br,lv.x);
    float tl=N21(id+vec2(0,1));
    float tr=N21(id+vec2(1,1));
    float t=mix(tl,tr,lv.x);
    return mix(b,t,lv.y);
  }

  vec4 blur(vec2 uv,sampler2D ug,float s){
    vec2 r=vec2(s);
    vec4 c=texture2D(ug,uv);
    const float inc = 6.283185/${DIR}.0;
    for(float d=0.0; d<6.283185;d+=inc){
      vec2 ccss = vec2(cos(d),sin(d))*r;
      for(float i=0.0;i<=1.0;i+=(1.0/${QUAL}.0)){
        vec2 p=uv+ccss*i;
        c+=texture2D(ug,p);
      }
    }
    return c/(${QUAL}.0*${DIR}.0-${DIR}.0);
  }

  vec4 blend_multiply(vec4 b,vec4 l){return (b*l);}
  
  void main(){
    vec2 uv=(gl_FragCoord.xy/r.xy)/pr;
    vec4 pixelColor = blur(uv, tex, 0.00075);
    float noiseValue = SN(uv,2500.0,2500.0);
    vec4 n = mix(vec4(255.0/255.0, 255.0/255.0, 255.0/255.0, 1.0),              
                 vec4(235.0/255.0, 235.0/255.0, 235.0/255.0, 1.0),  
                 noiseValue);                                       
    n = blend_multiply(pixelColor, n);
    gl_FragColor=n;
  }`;
  let s = c.createShader(vs, fs);
  c.shader(s);
  [
    ["r", [width, height]],
    ["pr", PD],
    ["tex", get()], // Passing in a screen-grab of the image into the shader here for blurring
  ].map((i) => s.setUniform(i[0], i[1]));
  c.quad(-1, -1, 1, -1, 1, 1, -1, 1);
  image(c, 0, 0);
}