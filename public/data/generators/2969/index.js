//----------------------
// defining features
//----------------------
A = new GrassAlgorithm();
A.logActive=_DEBUG;
if(_DEBUG)A.M_log(`<a href="${window.location+"?hash="+fxhash}">${fxhash}</a>`);
A.buildSvg=true;
var feat={}
A.VM_onVariablesSet=(v)=>{
  let r,_W;
  // general seed
  _patternV.seed.m_value= fxrand();
  
  // Format
  let rFormat=fxrand();
  let _format = rFormat<0.1 ?[{w:148,h:0.8,m:2,upscale:18,},"A5 fit"] : rFormat<0.4 ?[{w:210,h:0.7,m:3, upscale:12},"A4 fit"] : rFormat<0.9?[{w:297,h:0.6,m:7,upscale:9},"A3 fit"] : [{w:390,h:0.6,m:7,upscale:7},"Oversized"];
  
  feat.Format=_format[1];
 let W=v.heightMm.m_value=v.widthMm.m_value = _format[0].w;
  v.upscale.m_value = _format[0].upscale;
  v.documentMargin.m_value=_format[0].m;
 
 
  // Paper feature
  r=fxrand();
  let _paper = r<0.2? ["White","Bristol White"] : r<0.5? ["Watercolor","Watercolor"] : r<0.8? ["YellowWhite","Old Sketchbook"] : r<0.97? ["GreyGreen","Gray Green"]:["Pink","Pink"];
  feat.Paper = _paper[1];
  let isWhitePaper=r<0.7;
  let isSketchPaper=_paper[0]=="YellowWhite"
  let isBristol=_paper[0]=="White"
  let isGreenPaper=_paper[0]=="GreyGreen"
  let isPinkPaper=_paper[0]=="Pink"
  v.paperColor.m_value = _paper[0];
  if(_paper[0]=="Watercolor" || isGreenPaper || isPinkPaper || isSketchPaper)
    A.bgTextured=isPinkPaper?80:isSketchPaper?20:35;

  

// Horizon feature
r=fxrand();
_horiz = r<0.4? [{h:_format[0].h},"Horizon"] : [{h:1},"Whole"];
v.depthScaleFactor.m_value = 0.3+fxrand()*0.4;
feat.Implantation = _horiz[1];
v.documentHorizon.m_value=1;//_horiz[0].h;
let h=_horiz[0].h;
v.yFracStop.m_value=h;
if(h<1)
{ if(r<0.25)
  { A.m_sky={kh:h}
    feat.Sky="Lines";
  }
  else
  {
    A.m_sky={kh:h,orientation:45/*t:"cloud"*/}
    feat.Sky="Slope";

  }
}

// fracStop
//let rnd=fxrand();
//v.yFracStop.m_value  = rnd<0.5?1 : rnd<0.2? 0.8 : 0.5;



// Relief feature ( no need for a feature it is not obvious)
  r=fxrand(); 
  _W = r<0.4? [{is:false,amp:0},"None"] : r<0.7 ?[{is:true,amp:20},"Mild"] : r<=1 ?[{is:true,amp:W/8},"Stiff"] : [{is:false},"wut?"];
 //feat.Relief=_W[1];
  if(_W[0].is)
  {  v.relief.m_value = "true";
     v.reliefParam.m_value.ampl = _W[0].amp;
    if(A.m_sky)
    {   A.m_sky.kh-=_W[0].amp/W;
    }  
  }
  
// leaning
r=fxrand();
let _lean = r<0.3? [{f:-1},"Left"] : r<0.6?[ {f:0},"Stable"] : [{f:1},"Right"]
feat.Inclinaison=_lean[1];
let leanF=_lean[0].f;
if(feat.Sky=="Slope")
  A.m_sky.orientation=leanF*30;


// rare occurences of a circle crop
r=fxrand();
if( r<(1/50))
{  feat.Gem ="Circle crop";
   v.workareaShape.m_value="Circle";
}


// style
r=fxrand();
_linestyle = r<0.3? ["Fine","Fineliner"] : r<=1? ["Bold","Variable stroke width"] : ["",""];
let isStrokeBold=_linestyle[0]=="Bold";
feat.LineStyle = _linestyle[1];

// Theme
r=fxrand();  // no cotton on pure white
_theme = (r<0.2 && !isBristol)?[{t:"Cotton"},"Cotton"] : r<0.5? [{t:"Lineart"},"Lineart"] : r<0.8? [{t:"Mint"},"Mint"] : isPinkPaper? [{t:"Lineart"},"Lineart"]:[{t:"Dark"},"Smoke"];
feat.Theme = _theme[1];
let theme={};
let hatches={}
let hidePNGFills=false;
switch(_theme[0].t)
{
    case "Lineart":
      hidePNGFills=true;
      //if(!isMonolith)
      v.strokeWidth.m_value=0.1;
      break;
    case "Cotton":
    {  let c="rgba(255,255,255,0.15)";
      theme={FernLeaf:c, MintLeaf:c, MintLeaf1:c,DaisyHearts:"paper*rgba(0,0,0,0.7)",DaisyPetals:"rgba(255,255,255,0.3)"
      ,PoppyPetals:r<0.1?"rgba(0,0,0,0.3)":"rgba(255,255,255,0.3)",Faces:"paper", HerbHatches:c ,Fruits:"rgba(0,0,0,0.6)"
      ,Branches:isGreenPaper?"paper*rgba(255,255,255,0.9)/0.7":isSketchPaper?"paper*rgba(255,255,255,0.8)/0.8":"paper"};
      hatches={MintLeaf: isSketchPaper?rFormat<0.1: {color:"rgba(0,0,0,0.3)"},MintLeaf1:{color:"rgba(0,0,0,0.5)"}}

    }
    break;
    case "Mint":
    {  let c = isPinkPaper? "rgba(140,20,60,0.14)" :`rgba(0,70,0,${isWhitePaper?(isMonolith?0.11:0.15): isGreenPaper? (isMonolith? 0.12:0.18) : (isMonolith? 0.09 : 0.10)})`
        if(isPinkPaper)feat.Theme="Pink";
        theme={FernLeaf:c, MintLeaf: isMonolith?"paper/0.7":c, MintLeaf1:isPinkPaper?"paper/0.4":"paper/0.7", CloverFill: c,HerbHatches:c,DaisyPetals:isPinkPaper?"paper*rgba(255,255,255,0.7)/0.8":"rgba(255,255,255,0.3)",DaisyHearts:isPinkPaper?"paper*rgba(90,0,0,0.8)":isGreenPaper?"paper*rgba(0,30,0,0.8)/0.8":"rgba(0,0,0,0.8)",PoppyPetals:"rgba(255,255,255,0.3)",Faces:"paper", Fruits:"rgba(121,25,52,0.7)",Branches:isPinkPaper?"paper*rgba(255,255,255,0.8)/0.3":isGreenPaper?"paper*rgba(240,255,240,0.6)/0.5":"paper"};
        hatches={MintLeaf:{color:"rgba(0,40,0,0.5)"},MintLeaf1:rFormat<0.1?true:false}
    }
    break;
    case "Dark":
      {  let c=`rgba(0,0,0,${isMonolith?0.11:0.15})`
        theme={FernLeaf:c, MintLeaf: isMonolith? "paper":c, MintLeaf1:isMonolith?c: "paper*rgba(0,0,0,0.1)/0.3",CloverFill:c,HerbHatches:c, DaisyPetals:"rgba(255,255,255,0.8)",DaisyHearts:(isGreenPaper||isSketchPaper)?"rgba(0,0,0,0.8)": isWhitePaper?"rgba(0,0,0,0.9)": "paper",PoppyPetals:"rgba(0,0,0,0.3)",Faces:"paper", Fruits:"rgba(0,0,0,0.8)",Branches:isSketchPaper?"paper*rgba(255,255,255,0.7)/0.9":"paper"};
        hatches={MintLeaf:true,MintLeaf1:isGreenPaper?false:true}
        if( isMonolith)
        {
          let treasure=fxrand(); if( treasure<0.05 && !feat.Gem)  {theme.PoppyPetals="rgba(255,0,0,0.4)"; feat.Gem="Red Poppies"}
        }
      }
      break;
    
}

//v.isGlobalFuncDensity.m_value=true;
//v.globalFuncScale.m_value=0.5;

// monoliths size
let _monolith;
let isTower=false;
if( isMonolith)
{
  r=fxrand();
  _monolith = r<0.2? [{is:true,size:{min:"95",max:"299"}},"Tower"] : r<0.4 ?[{is:true,size:{min:"85",max:"200"}},"Chiseled"] : r<0.6 ?[{is:true,type:"Box",size:{min:"85",max:"230"}},"Block"] : r<0.8 ?[{is:true,type:"Rock",size:{min:"85",max:"230"}},"Boulder"] : [{is:true,type:"Trunk",size:{min:"100",max:"199"}},"Wobbly Column"];
  feat.Object=_monolith[1];
  isTower = _monolith[1]=="Tower";
  if(isTower)
      leanF*=0.3;
}
  if(A.logActive)
    doDownloadSVG(true);

  // Strokes and colors
  // species 
  let Spc = v.species.m_value;
  let cnt={};for(let a in theme) cnt[a]=0;
  let hcnt={};for(let a in hatches) hcnt[a]=0;

  for(let is=0; is<Spc.length;is++)
  { let S =Spc[is];
    if(S.m_variables.addons ) //S.m_name=="GrassObject3D")
    { 
      let isTree=false;
      let isObj=false;
      let isHerb=false;
      S.m_variables.yRange.m_value.min=-0.5;
      if( S.m_variables.torsion)
      { 
         S.m_variables.torsion.m_value.min*=leanF;
         S.m_variables.torsion.m_value.max*=leanF;
      }
      switch(S.m_name)
      {
        case "GrassObject3D":
          isObj=true;
          S.m_variables.isActive.m_value = _monolith[0].is?"true":"false";
          if(_monolith[0].is)
            S.m_variables.height.m_value=_monolith[0].size;
          if(_monolith[0].type)
          {  S.m_variables.objShape.m_value = _monolith[0].type;
            if(_monolith[0].type=="Rock")
                S.m_variables.size.m_value.min*=5;
          } 
            S.m_variables.segmentHeight.m_value=8+Math.pow(fxrand(),2)*25;

            // allow buildings to stabilize
           /*   let leanObj =fxrand();
              S.m_variables.torsion.m_value.min*=leanObj;
              S.m_variables.torsion.m_value.max*=leanObj;
            */
      
            break;
        case "TreeGrass":
          //S.m_variables.isFruits.m_value = false;
          isTree=true;
          break;
        case 'GrassHerb':
          isHerb=true;
          break;
      }
      let addons=S.m_variables.addons.m_value;
      for(let i=0; i<addons.length; i++)
      {   let ao=addons[i];
          let part=ao.m_variables.SvgObject.m_value;
          //A.M_log("Got addon "+ao.m_name+" - "+part);
          switch(ao.m_name)
          {

            case "PNGFill":
            {   
              let n=part+(cnt[part]?cnt[part]:"");
              if(hidePNGFills)
                ao.m_variables.activate.m_value=false;
              else if(theme.hasOwnProperty(n))
              {   
                //A.M_log(S.m_name+" Part = "+n); 
                ao.m_variables.paletteTag.m_value ="custom";
                  ao.m_variables.strokeColor.m_value=theme[n];
              }
              cnt[part]++;
            }
            break;
            case "HatchShape":
            {
              let n=part+(hcnt[part]?hcnt[part]:"");
              A.M_log(S.m_name+" hPart = "+n); 

             if(_theme[0].t!=="Lineart" && part!="Faces")
              {
                  if(hatches.hasOwnProperty(n))
                  {
                    if(!hatches[n])
                       ao.m_variables.activate.m_value=false;
                    if(typeof hatches[n]==="object")
                    {   if( hatches[n].hasOwnProperty('color'))
                        {   ao.m_variables.paletteTag.m_value ="custom";
                            ao.m_variables.strokeColor.m_value=hatches[n].color;
                        } 
                        A.M_log(" -->"+RQPrintR(hatches[n]));
                    }
                  }
                  else ao.m_variables.activate.m_value=false;
                  
              }
              hcnt[part]++;
            }  
            break;
            case "SVGGroup":
              if(isStrokeBold)
              {   let strk = 0.3;
                  if(isTree && part=="Branches")
                  { strk= isMonolith? 0.2:0.1;
                  }
                  else if(isObj&&part=="Edges")
                    strk=0.6;
                  else if(part=="Herb")
                    strk= 0.1;
                  if(isStrokeBold)
                    ao.m_variables.strokeWidth.m_options.scale=1;

                  ao.m_variables.strokeWidth.m_value=strk;
              
               }
              else 
              {    ao.m_variables.strokeWidth.m_value="inherit";
              
              }
              break;
          
          
          }
      }
    }
  }
  //v.strokeWidth.m_value=0.4; 
  
  
  
}
let ph="Monoliths";
feat.Series = fxrand()<0.5?ph:"Garden";
let isMonolith=(feat.Series==ph);
let _patternV = isMonolith? getVa1() : getV();
A.M_setVariables(_patternV);
A.M_setPalette(getP())

A.M_log("<b>Features</b>="+RQPrintR(feat,1));
window.$fxhashFeatures = feat;
document.addEventListener("DOMContentLoaded", function(event) { 
A.M_init(true);
;
// click to download PNG
const n=document.createElement("a");let cv=document.getElementsByTagName("canvas")[0];
cv.onclick=t=>{n.download="zancan_"+fxhash+".png",n.href=cv.toDataURL("image/png").replace("image/png","image/octet-stream"),n.click()};
// keypress to download SVG
document.body.addEventListener('keypress', function(e) {
  if (e.key == "s") {
    doDownloadSVG(false);
  }
});


});
function doDownloadSVG(isBtn)
{ let link = document.createElement("a");
  link.innerText="download plotter file";
  link.setAttribute("class","btnSVG")
  link.setAttribute('href',`javascript:mySVG('zancan_${fxhash}.svg');`);
  if(isBtn)
    document.getElementById("ARTWORK").appendChild(link);
  else
  link.click(); 
}
