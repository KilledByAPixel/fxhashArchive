// Chrysalis
// Copyright (c) 2022 Arsiliath & Monotau

// Normal only
let styles = [
  { "white": 0.35, "warmCool": 0.05, "warmCoolBalance": 0, "colors": ['#e95600', '#0048f8', '#006398', '#0048f8', '#006398'] },
  { "white": 0.35, "warmCool": 0.05, "warmCoolBalance": 0, "colors": ['#b62525', '#b58112', '#ababab', '#ffffff', '#ffffff'] },
  { "white": 0.35, "warmCool": 0.05, "warmCoolBalance": 0, "colors": ['#a97600', '#2068d8', '#207398', '#00867c', '#be0cff'] },
  { "white": 0.35, "warmCool": 0.05, "warmCoolBalance": 0, "colors": ['#ad180e', '#7da3bf', '#410434', '#b59ad7', '#030126'] },
  { "lightBrightness": 1.1, "warmCoolBalance": 0.04, "warmCool": 0.05, "white": 0, "colors": ["#709424", "#164630", "#11171a", "#2a69cb", "#9bb6b3"] },
  { "warmCoolBalance": 0.00, "warmCool": 0.05, "white": 0, "colors": ["#e86d1b", "#8bbc8f", "#d87ff8", "#bcdf49", "#aaaba7"] },
  { "warmCoolBalance": 0.06, "warmCool": 0.05, "white": 0.1, "colors": ["#2037ac", "#fec35d", "e93a3c", "#8ba6f2", "141414"] },
  { "warmCoolBalance": 0.05, "warmCool": 0.05, "white": 0.24, "colors": ["#ad3d01", "#352975", "#76bc2c", "#fda56c", "#4e6dcb"] },
  { "warmCoolBalance": 0.04, "warmCool": 0.05, "white": 0, "colors": ["#394f0c", "#d99f20", "#5f4f74", "#c0f3f8", "#897c8f"] },
  { "warmCoolBalance": 0, "warmCool": 0.00, "white": 0, "colors": ["#690202", "#ffffff", "#bdbdbd", "#dbb700", "#ff0000"] },
  { "warmCoolBalance": 0, "warmCool": 0.00, "white": 0, "colors": ["#690202", "#ffffff", "#bdbdbd", "#ffffff", "#ff0000"] },
]

// BW Only
styles.bwStart = styles.length;
styles.push(
  { "warmCoolBalance": 0, "warmCool": 0, "white": 0.16, "colors": ["#e0e0e0", "#000000", "#bdbdbd", "#ffffff", "#808080"] }
)

styles.bwLength = styles.length - styles.bwStart
