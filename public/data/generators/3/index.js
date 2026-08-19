// these are the variables you can use as inputs to your algorithms
console.log(fxhash)   // the 64 chars hex number fed to your algorithm
console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()

// note about the fxrand() function 
// when the "fxhash" is always the same, it will generate the same sequence of
// pseudo random numbers, always

//----------------------
// defining features
//----------------------
// You can define some token features by populating the $fxhashFeatures property
// of the window object.
// More about it in the guide, section features:
// [https://fxhash.xyz/articles/guide-mint-generative-token#features]
//
// window.$fxhashFeatures = {
//   "Background": "Black",
//   "Number of lines": 10,
//   "Inverted": true
// }

// this code writes the values to the DOM as an example
function Head(value) {
  if (value < 0.5) return "teal"
  if (value < 0.9) return "yellow"
  else return "purple"
}
function Eyes(value) {
  if (value < 0.5) return "red"
  if (value < 0.9) return "blue"
  else return "teal"
}
function Pupils(value) {
  if (value < 0.5) return "normal"
  if (value < 0.9) return "small"
  else return "long"
}
function Mouth(value) {
  if (value < 0.5) return "yellow"
  if (value < 0.9) return "blue"
  else return "red"
}
window.$fxhashFeatures = {
  "Head": Head(fxrand()), //options teal purple yellow
  "Eyes": Eyes(fxrand()), //options red, blue, teal
  "Pupils": Pupils(fxrand()), //options small long normal
  "Mouth": Mouth(fxrand()), //options red blue yellow
  "Discount": fxrand()
}
function gethead(value){
  switch(value){
    case "teal":
      return "./img/TealHead.PNG"
    case "yellow":
      return "./img/YellowHead.PNG"
    case "purple":
      return "./img/PurpleHead.PNG"
  }
}
function geteyes(value){
  switch(value){
    case "red":
      return "./img/RedEyes.PNG"
    case "blue":
      return "./img/BlueEyes.PNG"
    case "teal":
      return "./img/TealEyes.PNG"
  }
}
function getpupils(value){
  switch(value){
    case "normal":
      return "./img/NormalPupils.PNG"
    case "small":
      return "./img/SmallPupils.PNG"
    case "long":
      return "./img/LongPupils.PNG"
  }
}
function getmouth(value){
  switch(value){
    case "yellow":
      return "./img/YellowMouth.PNG"
    case "blue":
      return "./img/BlueMouth.PNG"
    case "red":
      return "./img/RedMouth.PNG"
  }
}

const head = gethead($fxhashFeatures.Head)
const eyes = geteyes($fxhashFeatures.Eyes)
const pupils = getpupils($fxhashFeatures.Pupils)
const mouth = getmouth($fxhashFeatures.Mouth)
mergeImages([head, eyes, pupils, mouth])
  .then(b64 => document.querySelector('img').src = b64);
// const container = document.createElement("div")
// container.innerText = `
//   ${$fxhashFeatures.Head}\n
//   random hash: ${fxhash}\n
//   some pseudo random values: [ ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()},... ]\n
// `
// document.body.prepend(container)