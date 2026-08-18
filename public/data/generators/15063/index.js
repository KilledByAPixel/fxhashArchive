console.log("hash="+fxhash);
fxrand();// /!\ Keep this
	// Overload the seed and random function
	PatternAlgorithm.prototype.M_seed=function(seed,i)
	{ //this.M_log("M_SEED - "+seed+" i="+i);
    if( i==undefined || i==0)
		{ this.m_seed = seed;
			this.random = fxrand; 
			for (var i2 = 0; i2 < 15; i2++) this.random();
		}
		else
		{	  this["random"+i]=fxrand;	
		}
	}	
  // Force features
  const forceFT={     
    //Style:"Lines"
    
  }
  
  
  
  // M_definitions 
  // Register colors, palettes, properties...
  PatternAlgorithm.prototype.M_definitions=function()
  {
    this.M_registerPaper('Red',hexToRGBA("#AE5050"));
  }
  

  const FT=(percent,featureValue,opts)=>{return {name:featureValue,odds:percent/100,opts:opts}}
function getRandomFeature(featureName, FTs,cbApply)
{ 
  let i,n=0,r=fxrand();
  if(forceFT.hasOwnProperty(featureName))
  { for(i=0;i<FTs.length;i++)
      { if(FTs[i].name==forceFT[featureName]) 
        { feat[featureName]=FTs[i].name;
          if(cbApply) cbApply(FTs[i].opts);
          return FTs[i].opts;
        }
      };
  
  }
  for(i=0;i<FTs.length;i++) n+=FTs[i].odds;
  
  if(n>0)
  { let a=0;
    r*=n;
    for(let i=0;i<FTs.length;i++)
    { if((r-a)<FTs[i].odds)
      { feat[featureName]=FTs[i].name;
        if(cbApply) cbApply(FTs[i].opts);
        return FTs[i].opts;
      }
      a+=FTs[i].odds;
    }
    
  }
  return {};
}
let fileName,debugPNGUpscale=1,W,H,svgSize=undefined;
;
//----------------------
// Algo inits
//----------------------
A = new TreesAlgorithm();
A.logActive=_DEBUG;

A.fxPreview = fxpreview;
if(_DEBUG)A.M_log(`<a href="${window.location+"?fxhash="+fxhash}">${fxhash}</a>`);
A.buildSvg=true;
A.m_isSvgBackgroundColor=false;
A.alwaysActivateGroups = true;
A.M_definitions();
var feat={}
A.M_forceFeatureName =(ftName,ftValue)=>{feat[ftName]=ftValue};

let srch = new URLSearchParams(window.location.search);
let isEmptyMode=false;
let emptySize;
if(srch.get('empty') ) 
{ isEmptyMode=true;
  emptySize = parseInt(srch.get('empty'));
  forceFT.Fragments="Empty";
}
let externalMargin=0;
if(srch.get('externalMargin') ) 
{
  externalMargin = Math.max(0,parseInt(srch.get('externalMargin')));
  A.m_externalMargin=externalMargin;
}
//----------------------
// Definition of features
//----------------------
A.VM_onVariablesSet=(v)=>{

  const setBgProp=(prop,value,bgType)=>{ 
    let bs=v.background.m_value;
    for(let i=0;i<bs.length;i++)
    { let b=bs[i]
      if(b.m_name==bgType)
      { 
        if(b.m_variables.hasOwnProperty(prop))
          b.m_variables[prop].m_value=value;
      }    
    }
  }
  A.setSkyProperty=(prop,value)=>setBgProp(prop,value,"BackgroundLib");
  A.setGradientProperty=(prop,value)=>setBgProp(prop,value,"BackgroundGradient");  
  A.setTextureProperty=(prop,value)=>setBgProp(prop,value,"BackgroundTexture");

  A.M_log("VM_onVariablesSet");
  let r,_W;
  // general seed
  _patternV.seed.m_value= fxrand();
  A.M_log("Init seed with "+_patternV.seed.m_value);
  
  
  // Format Feature
  const ratio1=1/1;
  const areaRef= 384*384/ratio1,upscaleRef = 10;
  let ftFormat= getRandomFeature("Format",[
    FT(90, "Square", {w:100,h:100}),
    FT(10, "Large square", {w:180,h:180,margin:5*1.2}),
 
  ],(ft)=>{
    W=v.widthMm.m_value = ft.w;   
    H=v.heightMm.m_value =ft.h;
    v.upscale.m_value = Math.round(upscaleRef*Math.sqrt(areaRef/(W*H)));
    v.documentMargin.m_value= ft.margin??5;       // margin in mm 
    v.pngUpscale.m_value    = 1;          // PNG ouput resolution multiplier

    


  });


 

 // pngUpscale 
 
 if(srch.get('fxhash') ) 
 {
   let refSize = srch.get("pixelSize")??5000;
   console.log("Using refSize="+refSize);
   
   debugPNGUpscale= Math.min(refSize/(W*v.upscale.m_value),refSize/(H*v.upscale.m_value));
   v.pngUpscale.m_value=debugPNGUpscale;

  if(isEmptyMode)
  { 
      // emptySize = margin to add on both size
      // pixel = upscale * W * PngUpscale 
      // dW --> dpixel / (upscale*PngUpscale)      
      let dW  = emptySize / (v.upscale.m_value*debugPNGUpscale);
      v.widthMm.m_value +=dW;
      v.heightMm.m_value +=dW;
  }


 }


 A.setTextureProperty("ampl",10+fxrand()*20);


  // Paper feature
  // --------------
  let ftPaper= getRandomFeature("Paper",[
      FT(10 ,"Red"            ,{paper:"Red"}),
      FT(15 ,"Black Black"    ,{paper:"Black"}),
      FT(20 ,"Sketchbook"     ,{paper:"YellowWhite"}),
      FT(20, "Bristol White"  ,{paper:"White"}), 
      FT(15 ,"Green"          ,{paper:"GreyGreen"}),
      FT(5 ,"Pink"           ,{paper:"Pink"}),
    ]
    ,(ft)=>v.paperColor.m_value=ft.paper
    );
   
    if(isEmptyMode)
      return;

  let ftStyle= getRandomFeature("Style",[
    FT(60 ,"Lines"            ,{filled:false}),
    FT(40 ,"Filled"           ,{filled:true}),
    ]
  ,(ft)=>{}
  );
      
  // Defined Palettes
let palette= A.M_definePalettes(ftPaper.paper,ftStyle.filled);

// Leaves feature
  // --------------
  let ftLeaf= getRandomFeature("Leaf",[
    FT(30 ,"Oak"           ,{leafShape:"Oak"}),
    FT(10 ,"Ash"           ,{leafShape:"Ash"}),
    FT(30 ,"Poplar"        ,{leafShape:"Default"}),
  ]
  ,(ft)=>v.leafShape.m_value=ft.leafShape
  );

  
// Changing sky feature 
  let rndOrient = fxrand();
  A.setSkyProperty("orientation",0+(rndOrient-0.5)*150);
  
/*
  let styles=v.styles.m_value;
  for(let i=0; i<styles.length; i++)
  {   let ao=styles[i];
      let aov=ao.m_variables;
      let part=aov.SvgObject.m_value;
      switch(ao.m_name)
      {case "PNGFill":
        { if(part=="BranchFill")
              aov.activate.m_value=false;
        }
        break;
        case "HatchShape":break;
        case "SVGGroup":break;
      }
  }
*/


}
if(_DEBUG) document.body.setAttribute("class","Debug");

let _patternV = isEmptyMode? getVEmpty() : getV();

A.M_setVariables(_patternV);
A.M_setPalette(getP())
let strft="Features"; for(let i in feat ) strft+=` ${i}:<b>${feat[i]}</b>`; A.M_log(strft)
window.$fxhashFeatures = feat;
document.addEventListener("DOMContentLoaded", function(event) { 
  A.M_log("Calling A.M_init")
  A.M_init(true);
;
// click to download PNG
const n=document.createElement("a");let cv=document.getElementsByTagName("canvas")[0];
let srch = new URLSearchParams(window.location.search),tokenName=srch.get('name'),owner=srch.get('owner');
fileName = (tokenName && owner)?`${tokenName}-${owner}`:`TheBuggedForest_${fxhash}`;

let maxSize = Math.max(W,H)*A.upscale*debugPNGUpscale
let filenamePng = fileName; 
if( srch.get('printFormat') )
{ filenamePng+= `-${srch.get('printFormat')}+out ${srch.get('om')}- in${srch.get('im')}`;
}
cv.onclick=t=>{n.download=`${filenamePng}.${parseInt(maxSize)}.png`,n.href=cv.toDataURL("image/png").replace("image/png","image/octet-stream"),n.click()};
// keypress to download SVG
document.body.addEventListener('keypress', function(e) {
  // Set ( or not ) custom SVG size
  svgSize = {w:"297mm",h:"297mm"}
  
  if (e.key == "s") {
    doDownloadSVG(false);
  }
});


});

function doDownloadSVG(isBtn)
{ let link = document.createElement("a");
  link.innerText="download plotter file";
  link.setAttribute("class","btnSVG")
  let size="";
  if(svgSize)
  { size=`,{w:"${svgSize.w}",h:"${svgSize.h}"}`

  }
  link.setAttribute('href',`javascript:mySVG('${fileName}.svg'${size})`);
  if(isBtn)
    document.getElementById("ARTWORK").appendChild(link);
  else
  link.click(); 
}
