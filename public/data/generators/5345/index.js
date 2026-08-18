// extract ID from url params
const paramsUrl = new URLSearchParams(window.location.search)
const id = parseInt(paramsUrl.get("id") ?? "0")
const setRandomHash = paramsUrl.get("randomHash") === "1"

// utils
const lerp = (a, b, t) => (b-a)*t+a
const clamp = (x, a, b) => Math.max(a, Math.min(b, x))
// check if mobile (not bulletproof!)
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
// get a random item in the array
const fxrandArr = (arr, transf = (t) => t) => arr[transf(fxrand())*arr.length|0]
// random number between a and b
const fxrandRange = (a, b, transf) => lerp(a, b, transf(fxrand()))
const fxrandRange2 = (par, transf = (t) => t) => fxrandRange(par[0], par[1], transf)
// random in array with weights
const fxrandArrWeight = (arr) => {
  const r = fxrand()
  for (let i = arr.length-1; i >= 1; i--) {
    if (r < arr[i].weight) return arr[i].value
  }
  return arr[0].value
}
// generate a random hash
function randomHash() {
  const a = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
  return "oo" + Array(49).fill(0).map(_=>alphabet[(fxrand()*alphabet.length)|0]).join('')
}

// constants
const MAX_ITERATIONS = isMobile ? 4 : 20


// range of parameters
const PARAMS_RANGE = {
  colors: [
    "yellow", "red", "blue", "lime", "fuchsia", "aqua", "aquamarine", "black", "white", "blueviolet", "lightsalmon"
  ],
  bgSize1: [ 0.01, 6.0 ],
  bgSize2: [ 0.01, 6.0 ],
  borderRadius: [ false, "px", "%" ],
  borderRadiusVal: [ 0, 300 ],
  repeat: [ "repeat", "revert", "repeat-y", "repeat-x", "round", "space" ],
  backgroundGradient: [
    { weight: 0.9, value: "linear-gradient" },
    { weight: 0.1, value: "repeating-radial-gradient" },
  ],
  backgroundPos: [ 0, 1 ],
  filter: [
    { weight: 0.9, value: "hue-shift" },
    { weight: 0.1, value: "shadow" },
  ],
  hueRotate: [ 5, 40 ],
  mainTransform: [ "translate", "rotate", "scale" ],
  delay: [ 100, 300 ],
  animationSpeed: [ 7.0, 18.0 ],
}

// create parameters based on range and fxrand()
const P = {
  color1: fxrandArr(PARAMS_RANGE.colors),
  color2: fxrandArr(PARAMS_RANGE.colors),
  color3: fxrandArr(PARAMS_RANGE.colors),
  borderColor: fxrandArr(PARAMS_RANGE.colors),
  bgSize1: fxrandRange2(PARAMS_RANGE.bgSize1, t => Math.pow(t, 4)),
  bgSize2: fxrandRange2(PARAMS_RANGE.bgSize2, t => Math.pow(t, 1)),
  borderRadius: fxrandArr(PARAMS_RANGE.borderRadius),
  borderRadiusVal: fxrandRange2(PARAMS_RANGE.borderRadiusVal),
  repeat: fxrandArr(PARAMS_RANGE.repeat, t => Math.pow(t, 2)),
  backgroundGradient: fxrandArrWeight(PARAMS_RANGE.backgroundGradient),
  backgroundPosX1: fxrandRange2(PARAMS_RANGE.backgroundPos),
  backgroundPosX2: fxrandRange2(PARAMS_RANGE.backgroundPos),
  backgroundPosY1: fxrandRange2(PARAMS_RANGE.backgroundPos),
  backgroundPosY2: fxrandRange2(PARAMS_RANGE.backgroundPos),
  filter: fxrandArrWeight(PARAMS_RANGE.filter),
  hueRotate: fxrandRange2(PARAMS_RANGE.hueRotate),
  mainTransform: fxrandArr(PARAMS_RANGE.mainTransform),
  transformTranslate: fxrand() < 0.2,
  transformRotate: fxrand() < 0.2,
  transformScale: fxrand() < 0.2,
  transform3d: fxrand() < 0.01,
  transparent: fxrand() < 0.5,
  bodyHoverInvert: fxrand() < 0.05,
  delay: fxrandRange2(PARAMS_RANGE.delay),
  square: fxrand() < 0.5,
  madnessHover: fxrand() < 0.2,
  hiddenChaos: fxrand() < 0.01,
  animationSpeed: fxrandRange2(PARAMS_RANGE.animationSpeed),
}

// compute the number of transforms
let transformsNb = 1
if (P.transformTranslate && P.mainTransform !== "translate") transformsNb++
if (P.transformRotate && P.mainTransform !== "rotate") transformsNb++
if (P.transformScale && P.mainTransform !== "scale") transformsNb++
if (P.transform3d) transformsNb++

window.$fxhashFeatures = {
  "Main transform": P.mainTransform,
  "Number of transforms": transformsNb,
  "Gradient repeat": P.repeat,
  "Transparency": P.transparent,
  "Hover madness": P.madnessHover,
  "Hidden chaos": P.hiddenChaos,
}


// BUILD CSS PROPERTIES DERIVED FROM HASH
const style = document.createElement('style')
// background of the body
document.body.style.backgroundColor = P.transparent ? "transparent" : P.color1
if (P.backgroundGradient === "repeating-radial-gradient") {
  document.body.style.backgroundImage = `repeating-radial-gradient(${P.color1}, ${P.color2}, ${P.color3}, ${P.color1} 20%)`
}
else {
  document.body.style.backgroundImage = `linear-gradient(270deg, ${P.color1}, ${P.color2}, ${P.color3}, ${P.color1})`
}
document.body.style.backgroundRepeat = P.repeat
if (P.bodyHoverInvert) {
  document.body.classList.add("invert_effect")
}
// keyframes animations for the background position
style.type = 'text/css'
const kfBackground = `
  @keyframes bg_pos {
    0%{
      background-position: ${P.backgroundPosX1*100}% ${P.backgroundPosY1*100}%;
      background-size: ${P.bgSize1*100}% ${P.bgSize1*100}%;
    }
    50%{
      background-position: ${P.backgroundPosX2*100}% ${P.backgroundPosY2*100}%;
      background-size: ${P.bgSize2*100}% ${P.bgSize2*100}%;
    }
    100%{
      background-position: ${P.backgroundPosX1*100}% ${P.backgroundPosY1*100}%;
      background-size: ${P.bgSize1*100}% ${P.bgSize1*100}%;
    }
  }
`
style.innerHTML+= kfBackground
// build the animation of the iframe
// the "to" transform property
let fromTransform = ""
let toTransform = ""
if (P.mainTransform === "scale" || P.transformScale) {
  fromTransform+= " scale(1.08)"
  toTransform+= " scale(0.72)"
}
if (P.mainTransform === "rotate" || P.transformRotate) {
  if (fxrand() < 0.7) {
    fromTransform+= " rotateZ(90deg)"
    toTransform+= " rotateZ(0deg)"
  }
  else {
    fromTransform+= " rotateZ(0deg)"
    toTransform+= " rotateZ(90deg)"
  }
}
if (P.mainTransform === "translate" || P.transformTranslate) {
  if (fxrand() < 0.5) {
    fromTransform+= " translateX(-2.5vw)"
    toTransform+= " translateX(2.5vw)"
  }
  else {
    fromTransform+= " translateX(2.5vw)"
    toTransform+= " translateX(-2.5vw)"
  }
}
if (P.transform3d) {
  fromTransform+= " rotate3d(1, 0, 1, 0deg)"
  toTransform+= " rotate3d(1, 0, 1, 360deg)"
}
const kfIframe = `
@keyframes iframe {
  from {
    transform: ${fromTransform};
  }
  to {
    transform: ${toTransform};
  }
}
`
style.innerHTML+= kfIframe

// build iframe style
let styleIframe = "iframe {"
if (P.filter === "hue-shift") {
  styleIframe+= `filter: hue-rotate(${P.hueRotate}deg);`
}
else {
  styleIframe+= `filter: drop-shadow(0px 0px 20px red) invert(100%);`
}
styleIframe+= `box-shadow: 0 0 0 5px ${P.borderColor};`
styleIframe+= "}\n"
styleIframe+= "iframe:hover {"
styleIframe+= `box-shadow: 0 0 0 15px ${P.borderColor};`
if (P.madnessHover) {
  styleIframe+= `border-width: 15px;`
}
styleIframe+= "}"
style.innerHTML+= styleIframe


// inject the animation in the CSS
document.getElementsByTagName('head')[0].appendChild(style)

// CREATE IFRAME
const iframe = document.createElement("iframe")
// iframe style
iframe.style.borderRadius = P.borderRadius ? `${P.borderRadiusVal}${P.borderRadius}` : '0px'
if (P.square) {
  iframe.classList.add("square")
}
const animSpeed = P.animationSpeed * (P.transform3d ? 2 : 1)
iframe.style.animation = `iframe ${animSpeed}s ease-in-out 0s infinite alternate-reverse`
document.body.style.animation = `bg_pos ${animSpeed*1.421}s ease-in-out alternate-reverse infinite;`

const content = document.querySelector("#content")
setTimeout(() => {
  content.innerHTML = null
  content.append(iframe)

  if (id >= MAX_ITERATIONS) {
    iframe.src = "./index2.html"
    return
  }
  let targetUrl = `${window.location.origin}${window.location.pathname}?fxhash=${setRandomHash ? randomHash() : fxhash}&id=${id+1}`
  if (setRandomHash) {
    targetUrl+= "&randomHash=1"
  }
  iframe.src = targetUrl
}, P.delay)

// take the capture
let ready = 0
function capture() {
  ready++
  if (ready > 1) {
    fxpreview()
  }
}

setTimeout(() => {
  capture()
}, P.animationSpeed * 2000)

function triggerCiphrd() {
  document.body.classList.add("ciphrd")
  // content.innerHTML+= "<span>ciphrd</span>"
}

// keys
let pressed = ""
window.addEventListener("keypress", evt => {
  pressed+= evt.key
  console.log(pressed)
  if (pressed.slice(-6) === "ciphrd") {
    iframe.contentWindow.postMessage("ciphrd")
    triggerCiphrd()
  }
})

window.onmessage = (message) => {
  if (message.data === "ciphrd") {
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage("ciphrd")
    }
    triggerCiphrd()
  }
}

// we generate a second random hash, when everything gets closed
const secondHash = randomHash()

// message from children
window.addEventListener("message", (message) => {
  if (message.data === "back-close") {
    content.removeChild(iframe)
    if (id !== 0) {
      setTimeout(() => {
        parent.postMessage("back-close", "*")
      }, 100)
    }
    else {
      // re trigger process
      setTimeout(() => {
        let newHash = P.hiddenChaos ? randomHash() : secondHash
        let targetUrl = `${window.location.origin}${window.location.pathname}?fxhash=${newHash}&id=${id+1}`
        if (P.hiddenChaos) {
          targetUrl+= "&randomHash=1"
        }
        iframe.src = targetUrl
        content.appendChild(iframe)
      }, 100)
    }
  }
  else if (message.data === "take-preview") {
    if (id !== 0) {
      parent.postMessage("take-preview", "*")
    }
    else {
      capture()
    }
  }
})