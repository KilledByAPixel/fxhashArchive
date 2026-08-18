let srch = new URLSearchParams(window.location.search)
const _DEBUG=srch.get("debug"),_UI=0,getP=()=>{return {"title":"White","colors":{"line":{"feint":"rgba(255,255,255,0.05)","light":"rgba(255,255,255,0.4)","medium":"rgba(255,255,255,1)","dark":"rgba(255,255,255,1)"},"cloud":{"feint":"rgba(0,0,0,0.05)","light":"rgba(0,0,0,0.15)","medium":"rgba(0,0,0,0.35)","dark":"rgba(0,0,0,0.7)"},"fill":{"feint":"rgba(225,226,207,0.5)","light":"rgba(225,226,207,1)","medium":"rgba(0,0,0,0.5)","dark":"rgba(0,0,0,0.8)"},"trunk1":{"feint":"rgba(225,226,207,1)","light":"rgba(231,231,216,1)","medium":"rgba(245,245,239,1)","dark":"rgba(250,250,247,1)"},"leaf1":{"feint":"rgba(255,255,255,0.1)","light":"rgba(255,255,255.3)","medium":"rgba(255,255,255,0.5)","dark":"rgba(255,255,255,0.7)"},"treeLeaf1":{"feint":"rgba(255,255,255,0.15)","light":"rgba(255,255,255,0.3)","medium":"rgba(255,255,255,0.6)","dark":"rgba(255,255,255,0.8)"},"leaf2":{"feint":"rgba(225,226,207,1)","light":"rgba(225,226,207,1)","medium":"rgba(225,226,207,1)","dark":"rgba(225,226,207,1)"},"treeLeaf2":{"feint":"rgba(231,231,216,1)","light":"rgba(172,172,172,0.2)"},"fruits1":{"feint":"rgba(255,255,255,0.2)","light":"rgba(255,255,255,0.3)","medium":"rgba(255,255,255,0.6)","dark":"rgba(255,255,255,0.8)"},"stone1":{"feint":"rgba(225,226,207,1)","light":"rgba(225,226,207,1)","medium":"rgba(225,226,207,1)","dark":"rgba(200,200,200,0.8)"}}}} 

const strArtworkFileName="CharcoalSeeds"
const strRndParam="(random)"
console.log(`fxhash=${fxhash}`)
console.log(`fxminter=${fxminter}`)
// this is how to define parameters
$fx.params([
  {id :"pmRnd",name:"Seed variant",type:"number", default:22, options:{min:1,max:50,step:1},},
  {id: "pmFormat", name: "Format",type: "select",default: "Large square",options: {options: ["Small square", "Large square","Portrait", "Landscape",strRndParam],}},
  {id: "pmMargins", name: "Margins",type: "select",default: "6%",options: {options: ["3%","6%", "10%"],}},
  {id: "pmPaper", name: "Paper",type: "select",default: "Grey Green",options: {options: ["Sketchbook", "White", "Grey Green",strRndParam],}},
  {id: "pmTexture", name: "Texture",type: "select",default: "Canvas",options: {options: ["Paper", "Canvas"],}},
  {id: "pmPattern", name: "Sky pattern",type: "select",options: {options: ["Rain", "Sun","Fog","Cloud"],}},
  {id: "pmMonoliths",name: "Monoliths",type: "boolean",default: false},
  {id :"pmCharcoal",name:"Charcoal pattern",type:"select", default:"Lines",options:{options:["Lines","Checkerboard","Rectangles"]},},
  {id :"pmLLColor",name:"Long line color",type:"select", default:"Green", options:{options:["Green","Monochrome","Yellow"]},},
  {id :"pmFeel",name:"Movement",type:"select", default:"Wild", options:{options:["Wild","Balanced"]},},
  {id: "pmHorizon",name: "Growth",type: "number",default: 0.8,options: {min: 0,max: 1,step: 0.05}},   // documentHorizon : 1 will be mapped to 0.88
  {id: "pmCharcHorizon",name: "Ink horizon",type: "number",default: 1,options: {min: 0,max: 1,step: 0.1}},   
  
  {id :"pmSkyOrientation",name:"Sky orientation",type:"number", default:0, options:{min:-90,max:90,step:5},},
  {id :"pmRndLine",name:"Line variant",type:"select", default:"Flow", options:{options:["Flow","Vertical Flow","Horizontal Flow","Ring","Round"]},},
  
    

]);

//{id: "number_id",name: "A number/float64",type: "number",default: Math.PI,options: {min: 1,max: 10,step: 0.00000000000001,},},
//{id: "bigint_id",name: "A bigint",type: "bigint",default: BigInt(Number.MAX_SAFE_INTEGER * 2),options: {min: Number.MIN_SAFE_INTEGER * 4,max: Number.MAX_SAFE_INTEGER * 4,step: 1,},},
//{id: "color_id",name: "A color",type: "color",default: "ff0000",},
//{id: "string_id",name: "A string",type: "string",default: "hello",options: {minLength: 1,maxLength: 64}},




A = new GrassExperiments();
A.logActive=_DEBUG;
A.buildSvg=true;
A.m_isSvgBackgroundColor=false;
A.alwaysActivateGroups = true;

A.M_setArtworkTitle("Organic Matr");

let externalMargin=0;

if(srch.get('externalMargin') ) 
{
  externalMargin = Math.max(0,parseInt(srch.get('externalMargin')));
  A.m_externalMargin=externalMargin;
}
if(srch.get('noLines') )  // Skip the drawing of lines
{
  A.m_noLines=true;
}
//--------------------
// PARAMS
//-------------------
console.log("Params= "+$fx.stringifyParams($fx.getRawParams()))

let pm
if((pm=$fx.getParam("pmPaper"))!=strRndParam)
  _forceFT.Paper=pm;

if((pm=$fx.getParam("pmFormat"))!=strRndParam)
  _forceFT.Format=pm;
  
  _forceFT["Margins"]=$fx.getParam("pmMargins")
  _forceFT["Background pattern"]=$fx.getParam("pmPattern")
  _forceFT["Texture"]=$fx.getParam("pmTexture")
  _forceFT["Monoliths"]=$fx.getParam("pmMonoliths")?"Yes.":"Nope."
  _forceFT["Charcoal"]=$fx.getParam("pmCharcoal");
  _forceFT["Line color"]=$fx.getParam("pmLLColor");
  _forceFT["Movement"]=$fx.getParam("pmFeel");
  _forceFT['Seed variant']=$fx.getParam("pmRnd")
  _forceFT['pmHorizon']=$fx.getParam('pmHorizon')
  _forceFT["Thread"] = $fx.getParam("pmRndLine")
  _forceFT['Ink horizon']=$fx.getParam("pmCharcHorizon")
  _forceFT['skyOrientation']=$fx.getParam('pmSkyOrientation')
  
    //----------------------
// Definition of features
//----------------------
EventManager.M_on("VariablesSet",(v)=>{
  /*console.log('index.js - on VariablesSet')
  if(srch.get('rnd'))
    v.seed.E=0*/
  
  let refW=0+(srch.get("pixelSize")??"2500")
  

  /*if(refW<300 || refW>9000) refW=2500
  { let W = 1*v.widthMm.E
    ,H = 1*v.heightMm.E
    console.log("W="+refW);
    v.pngUpscale.E=  W>H ? refW/(W*v.u.E) : refW/(H*v.u.E);
  }*/
  
   
});
// Algorithm done
EventManager.M_on("AlgoDone",function(){
  if(isFxpreview)
    fxpreview();
  else 
  {
    this.M_doLineAnim()


  }

})
if(_DEBUG) document.body.setAttribute("class","Debug");
A.M_setVariables(getV());
A.M_setPalette(getP())
$fx.features(_FTs);

document.addEventListener("DOMContentLoaded", function(event) { 
  A.M_log("Calling A.M_init")
  A.M_init(1);
  if(!_und(ftFormat))
  {
    A.installSvgExport('a',`${strArtworkFileName}#${editionId}.matr.svg`,{splits:A.svgSplits,w:`${ftFormat.matr.w}mm`,h:`${ftFormat.matr.h}mm`,data:{hash:fxhash,feat:JSON.stringify(_forceFT)}})
    A.installSvgExport('s',`${strArtworkFileName}.plottable.svg`,{w:`${ftFormat.svg.w}mm`,h:`${ftFormat.svg.h}mm`,data:{minter:fxminter, hash:fxhash,feat:JSON.stringify(_forceFT)}})
  }



});





