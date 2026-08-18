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
    // Paper : "Blueprint",
    // "Sky pattern":"Grid"
    // Fragments : "2",
    // Format: "Portrait A4 ",
    // "Sky pattern": "chevron",//"abstract leaves" "hashed sun" "grid"
     
  }
  
  
  
  // M_definitions 
  // Register colors, palettes, properties...
  PatternAlgorithm.prototype.M_definitions=function()
  {
    this.M_registerPaper('Blue',hexToRGBA("#3269ba"));
    this.M_registerPaper('Mondrian',"rgba(241,241,241,1)");
    this.M_registerPaper('AndyFlowers',hexToRGBA("#161616"));
    this.M_registerPaper('Cream',hexToRGBA("#f7d9d0"));
    this.M_registerPaper('Red',hexToRGBA(true?"#AE5050":"#C23C3C"));
    this.M_registerPaper('Risograph',hexToRGBA("#e4e4e2"));
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
  
//----------------------
// Algo inits
//----------------------
A = new YZAlgo();
A.logActive=_DEBUG;

A.fxPreview = fxpreview;
if(_DEBUG)A.M_log(`<a href="${window.location+"?fxhash="+fxhash}">${fxhash}</a>`);
A.buildSvg=true;
A.m_isSvgBackgroundColor=false;
A.alwaysActivateGroups = true;
A.M_definitions();
var feat={}
A.M_forceFeatureName =(ftName,ftValue)=>{feat[ftName]=ftValue};
//----------------------
// Definition of features
//----------------------
A.VM_onVariablesSet=(v)=>{

  A.M_log("VM_onVariablesSet");
  let r,_W;
  // general seed
  _patternV.seed.m_value= fxrand();
  A.M_log("Init seed with "+_patternV.seed.m_value);
  
  
  // Format Feature
  let W,H;
  const ratio169=16/9;
  const areaRef= 384*384/ratio169,upscaleRef = 10;
  let ftFormat= getRandomFeature("Format",[
    FT(10, "Small square", {w:148,h:148}),
    FT(10, "Medium square", {w:210,h:210}),
    FT(20, "Large square", {w:297,h:297}),
    FT(20, "Portrait A4", {w:210,h:297}),
    FT(20, "Landscape A4", {w:297,h:210}),
    FT(20, "Landscape A5", {w:210,h:148}),
    FT(20, "Wide screen", {w:297,h:297/ratio169}),

  ],(ft)=>{
    W=v.widthMm.m_value = ft.w;   
    H=v.heightMm.m_value =ft.h;
    v.upscale.m_value = Math.round(upscaleRef*Math.sqrt(areaRef/(W*H)));
    v.documentMargin.m_value= 0.00;       // margin in mm 
    v.pngUpscale.m_value    = 1;          // PNG ouput resolution multiplier
    
  });

  // Paper feature
  // --------------
  let ftPaper= getRandomFeature("Paper",[
      FT(15 ,"Red"           ,{paper:"Red"}),
      FT(20 ,"Blueprint"     ,{paper:"Blue"}),
      FT(15 ,"Blackboard"    ,{paper:"Black"}),
      FT(20 ,"Sketchbook"    ,{paper:"YellowWhite"}),
      FT(30, "Inked White"   ,{paper:"White"}), 
      FT(20 ,"Green"         ,{paper:"GreyGreen"}),
      FT(25 ,"Biro Drawing"  ,{paper:"Cream"}),
      FT(20 ,"Mondrian"      ,{paper:"Mondrian"}),
      FT(10 ,"Risograph CMYK",{paper:"Risograph"}),
      FT(10 ,"Pink Garden"   ,{paper:"Pink"}),
      // FT(5  ,"Andy's Flowers",{paper:"AndyFlowers"}),
    ]
    ,(ft)=>v.paperColor.m_value=ft.paper
    );
   

  // Number of worlds
  // --------------
  let ftWorlds= getRandomFeature("Fragments",[
    FT(50 ,"Single"            ,{count:1}),
    FT(20 ,"Two"              ,{count:2}),
    FT(15 ,"Three"            ,{count:3}),
    FT(3  ,"Four"            ,{count:4}),
    ]
    ,(ft)=>v.nbWorlds.m_value = ft.count
    );
  

  // Defined worlds 
  A.M_defineWorlds(ftPaper.paper);

  // After defining words, we pick the random groups now
  A.M_choseWorldsIds(fxrand);

  // Sky Pattern
  // ------------
  let ftSkyPattern= getRandomFeature("Sky pattern",[
    // FT(50, "random strokes" , {tag:"default"}),
    // FT(50, "dummy"          , {tag:"dummy"}),

    FT(15, "Hashed sun"     , {tag:"sun"}),
    FT(30, "Grid"           , {tag:"grid"}),
    FT(25, "Abstract leaves", {tag:"leaves"}),
    FT(20, "Polka dots"     , {tag:"dots"}),
    FT(20, "Chevron"        , {tag:"chevron"}),
    FT(10, "Jellybeans"     , {tag:"jellybeans"}),
    FT(10, "Ocean"          , {tag:"ocean"}),
    FT(20, "Abstract flowers",{tag:"flowers"}),
    FT(10, "Full moon"      , {tag:"none"}),
  ],
  (ft)=>{
    v.hasSkyPattern.m_value = ft.tag.length?"true":"false";
    v.skyPattern.m_value = ft.tag;  
    }
  );

  // Crop / frame
  //-----------------
  let ftCrop = getRandomFeature("Crop",[
      FT(70  , "None"        , {}),
      FT(10  , "Circle crop" , {crop:1}),
      FT(15  , "Frame"      , {crop:2})
  ],
  (ft)=>{
      if(ft.crop==1) v.workareaShape.m_value="Circle"
      else if(ft.crop==2) v.skyPatternShape.m_value = "frame";
    }
  );

  // Case Full moon + circle crop doesn't work well --> no skyPattern drawing (but we keep the ft not to compromise rarity)
  if(ftCrop.crop==1 && ftSkyPattern.tag=="none")
  {
    v.hasSkyPattern.m_value ="false"; // or maybe position it smaller and slightly off-centered ? 
  }
  

  // Distributions
  let ftPlan = getRandomFeature("Main plan",[
    FT(25  , "Pretty random"    , {distribution:"random"}),
    FT(30  , "Round"            , {distribution:"circular"}),
    FT(20  , "Spiral"           , {distribution:"spiral"}),
    FT(30  , "Manhattan"        , {distribution:"grid"}),
    FT(15  , "Wall"             , {distribution:"single-row"}),
    FT(15  , "Citadel"          , {distribution:"citadel"})
  ],
  (ft)=>{
      v.blocksDistribution.m_value=ft.distribution;
    }
  );

// Changing sky feature 
const setSkyProperty=(prop,value)=>{ 
    let bs=v.background.m_value;
    for(let i=0;i<bs.length;i++)
    { let b=bs[i]
      if(b.m_name=="BackgroundLib")
      { 
        if(b.m_variables.hasOwnProperty(prop))
          b.m_variables[prop].m_value=value;
      }    
    }
  }
  let rndOrient = fxrand();
  setSkyProperty("orientation",90+(rndOrient-0.5)*150);
  


  // Test on changing the perspective amount 
  //v.perspectiveFactor.m_value = 0.2+fxrand()*0.4;


  let Spc = v.species.m_value;
  // Per specie setup
  for(let is=0; is<Spc.length;is++)
  { let S =Spc[is];
    switch(S.m_name)
    {
      case "___":
      //case "RootsHerb":
      //case "RootsFern":
      //case "RootsHerb":
      //case "RootsExamples":
      case "RootsFlower":
        S.m_variables.nbPetals.m_value=ftPaper.paper=="AndyFlowers" ? 5: 5+15*fxrand();
        break;
      case "RootsYazid":
        S.m_variables.isActive.m_value = false;
      break;
      }
  } 

}
if(_DEBUG) document.body.setAttribute("class","Debug");

let _patternV = getV();
// Gradient test 
A.activateGradient = (gradient)=>{ 
  let bs=_patternV.background.m_value;
  for(let i=0;i<bs.length;i++)
  { let b=bs[i]
    if(b.m_name=="BackgroundGradient")
    { if(gradient===false)
          b.m_variables.activate.m_value="false";
      else 
      { b.m_variables.activate.m_value="true";
        b.m_variables.css.m_value=gradient;
      }
    }    
  }
}

A.M_setVariables(_patternV);
A.M_setPalette(getP())
A.M_preInit();
let strft="Features"; for(let i in feat ) strft+=` ${i}:<b>${feat[i]}</b>`; A.M_log(strft)
window.$fxhashFeatures = feat;
document.addEventListener("DOMContentLoaded", function(event) { 
  A.M_log("Calling A.M_init")
  A.M_init(true);
;
// click to download PNG
const n=document.createElement("a");let cv=document.getElementsByTagName("canvas")[0];
cv.onclick=t=>{n.download="YZ"+fxhash+".png",n.href=cv.toDataURL("image/png").replace("image/png","image/octet-stream"),n.click()};
// keypress to download SVG
document.body.addEventListener('keypress', function(e) {
  if (e.key == "s") {
    doDownloadSVG(false);
  }
});


});
