let DEGTORAD = Math.PI/180.;
const FLOATPRECISION = 2;

class RQVariables
{
	constructor(name)
	{	this.m_name = name;
		this.m_variables={};
		this.m_pathPrefix= "../";

	}
	M_convertVariables()
	{
		for( var varname in this.m_variables)
		{	let V = this.m_variables[varname];
			let isObjectValue = V.m_value!==null &&  typeof V.m_value=== 'object';
			//console.log(varname+" => "+V.m_value+" isObjectValue?"+(isObjectValue?"true":"false" ));
			if( Array.isArray(V.m_value ))
			{
				for( let i=0; i<V.m_value.length; i++)
				{
					var V2 = V.m_value[i];
					if( typeof V2==="object" && V2.m_templateName) // this is a Template
					{	//console.log("GOT template object "+V2.m_templateName);
						let rqVarObj = new RQVariables(V2.m_templateName);
						rqVarObj.m_variables = {...V2.m_variables};
						rqVarObj.M_convertVariables();
						V.m_value[i] = rqVarObj;
					}				
				}			
			}
		}
	}
	M_dumpVariables(tab)
	{	if(tab==undefined)
		tab="";
		var s=tab+"/*"+this.m_name+"*/\n";
		for( var varname in this.m_variables)
		{
			var V=this.m_variables[varname];
			s+=tab+varname;
			if( Array.isArray(V.m_value))
			{	s+=" = Array\n";
				for(let i=0; i<V.m_value.length; i++)
				{	s+=tab+"("+i+") ";
					let Vitem = V.m_value[i];
					if( typeof Vitem==="object" )
					{
						if(Vitem.constructor.name=="RQVariables")
							s+="\n"+Vitem.M_dumpVariables(tab+"  ");
						else
							s+=RQPrintR(Vitem)+"\n";
					}
					else 
						s+= Vitem+"\n"; 
				}
			}
			else 
				s+=" = "+RQPrintR(V.m_value)+"\n";
		}
		return s;	
	}
	// --------------------------------------------------
	// get variables values
	// --------------------------------------------------
/*	M_get(varname,defaultValue)
	{
		var v = this.m_variables[varname];
		if(v)
			return v.m_value??(defaultValue??"");
		return "";
	}
*/
	M_get(varname,defaultValue)
	{
		var v = this.m_variables[varname];
		if(v)
			return v.m_value;
		else if(defaultValue!=undefined)
			return defaultValue;
		return "";
	}

	M_getFloat(varname,defaultValue)
	{
		if( varname in this.m_variables)
		{	
			var v = this.m_variables[varname];		
			if( typeof v.m_value==="object")
			{	var a={}
				for(var k in v.m_value)
				{	a[k] = parseFloat(v.m_value[k])
				}
				return a;
				
			}
			else 
			{	let f =  Number(v.m_value);
				if( isNaN(f))
					f=0;
				return f;
			}
		}
		else if(defaultValue!=undefined)
			return defaultValue;
		return 0.0;
	}
	M_getInt(varname,defaultValue)
	{
		var v = this.m_variables[varname];
		if(v!=undefined)
		{	if( typeof v.m_value==="object")
			{	var a={}
				for(var k in v.m_value)
				{	a[k] = parseInt(v.m_value[k])
				}
				return a;
				
			}
			else 
			{	let f =  parseInt(v.m_value);
				if( isNaN(f))
					f=0;
				return f;
			}
		}
		else if(defaultValue!=undefined)
			return defaultValue;
		return 0;	
		
	}
	M_getBool(varname,defaultValue)
	{
		if(this.m_variables.hasOwnProperty(varname))
		{	
			return this.m_variables[varname].m_value=="true";
		}
		else
		{ if( typeof defaultValue!=='undefined')
				return defaultValue?true:false;
		}
		return false;
	}
	M_getPath(varname)
	{
		var v = this.m_variables[varname];
		if(v && v.m_value)
		{		
			return this.m_pathPrefix + v.m_options["PATH"] + v.m_value;
		}
		return 0;
	}
	M_getVarName(varname)
	{
		var v = this.m_variables[varname];
		if(v && v.m_options)
		{	return v.m_options['VARNAME'];
		}
		return null;
	}
	M_getVarOption(varname,optname)
	{
		var v = this.m_variables[varname];
		if(v && v.m_options)
		{	return v.m_options[optname];
		}
		return null;
	}


	M_getVariablePack(varName,templateName,getAll)
	{
		var all=[];		
		var V=this.m_variables[varName];
		if( V!=undefined && Array.isArray(V.m_value ))
		{
			if( !Array.isArray(templateName))
				templateName=[templateName];
			for(let i=0; i<V.m_value.length;i++)
			{
				let C =V.m_value[i]; 
				let found=false;
				for(let i2=0;i2<templateName.length; i2++)
				{	if( C.m_name ==templateName[i2] )
					{	found=true;
						break;
					}
				
				}
				if( found)
				{
					if(getAll)
						all.push(C);
					else 
						return C;
				
				}
			}		
		}
		return getAll?all : null;
	}
}
class Animated
{
	constructor()
	{
		this.rnd = 0;
	
	}

};
class PatternAlgorithm extends RQVariables
{
	constructor(name)
	{
		//console.log("PatternAlgorithm Constructor");
		super(name);
		this.m_dt = 20;
		this.upscale = 10.0;
		this.m_pngUpscale = 1;
		this.m_workArea = new RQRectangle();
		this.m_sizeMm = {width:100,height:100};
		this.W = this.m_sizeMm.width*this.upscale;
		this.H = this.m_sizeMm.height*this.upscale;
		this.m_strokeWidth = 1.0;
		this.m_strokeColor="#000000";
		this.m_isSvgBackgroundColor=true;
		this.m_mask= null;
		this.m_stencil= null;
		this.m_maskImage=null;
		this.m_outputImage=null;
		this.m_canvasHeap=[];	// PNG / shapes heap
		this.m_canvasHeapL=[];	// PNG / lines heap
		this.m_isMainAlgorithm=true;
		this.m_clipThreshold = 128;
		this.m_logObj=null;
		this.logActive=true;
		this.m_abort = false;
		this.m_paperColor = "";
		this.m_paperColors=[];
		this.m_lines 	= [];
		this.m_groupsDeclared =[];
		this.m_groupsInstances =[];
		this.m_groups ={};
		this.m_isMakeSvgGroups = false;
		this.alwaysActivateGroups = false;
		this.m_allowLiveFillShape = false;
		this.m_lineCount = 0; 
		this.m_animated = [];
		this.m_nbImagesLoading = 0;			
		this.m_nbImagesLoaded = 0;
		this.m_version = 0;	
		this.m_textures=[];
		this.m_deformersActive = true;
		this.m_isOwnPalette = false;
		this.m_bgFilters=[];
		this.m_fgFilters=[];
		this.M_registerPaperColors();
	}
	M_isUseVersion($v)
	{
		if( this.m_useVersion <=0 || this.m_useVersion>=$v)
		{
			return true;
		}
		return false;
	
	}
	M_setArtworkTitle($t)
	{
		this.m_title = $t;
	}
	M_setVariables(jsonVariables)
	{
		//console.log("Got variables : "+jsonVariables);
		this.m_variables = jsonVariables;
		this.M_convertVariables();
		//console.log(this.M_dumpVariables());
		this.VM_onVariablesSet(this.m_variables);
		this.M_getSizeMm();
		this.M_getDefaultStyle();
		this.M_getMathsVariables();
		this.M_getClipParameters();
		//console.log("End variables");

	}
	VM_onVariablesSet(){}
	// --------------------------------------------------
	// M_createMaskCanvas M_createClipCanvas M_createOutputCanvas
	// --------------------------------------------------
	M_createMaskCanvas()
	{
	
		if( this.m_mask==null)
		{	this.m_mask = new Texture({width:this.W, height: this.H});
			this.m_mask.M_fill("black");
		}
	}
	M_createClipCanvas()
	{
	
		if( this.m_stencil==null)
		{	this.m_stencil = new Texture({width:this.W, height: this.H});
			this.m_stencil.M_fill("black");
		}
	}
	M_createOutputCanvas()
	{
	
		if( this.m_outputImage==null)
		{	

			this.m_outputImage = new Texture({width:this.W*this.m_pngUpscale, height: this.H*this.m_pngUpscale});
			//this.M_log("M_createOutputCanvas - ctx.save");
			let ctx=this.m_outputImage.M_getContext();
			ctx.scale(this.m_pngUpscale,this.m_pngUpscale);
			this.m_outputImage.M_pushState();
			this.M_initOuputImage();
		}
	}
	M_drawFilters(filters)
	{
		if(filters)
		{
			for( let i=0; i<filters.length; i++)
			{	let f=filters[i];
				f.call(this);
			}
		}

	}
	M_initOuputImage()
	{	
		if(this.m_outputImage )
		{
			//this.M_log("M_initOutputImage for "+this.m_name+" with workarea="+this.m_workArea.M_getString()+" shape="+this.M_get("workareaShape"));
			let ctx=this.m_outputImage.M_getContext();
			if(this.m_isMainAlgorithm)
			{	this.m_outputImage.M_fill( this.M_getPaperColor(this.m_paperColor)); 
				this.M_drawFilters(this.m_bgFilters);
			}
			let shape = this.M_get("workareaShape");
			if( this.m_documentMargin || shape=="Circle")
			{
				this.m_outputImage.M_popState(1);
				this.m_outputImage.M_pushState();
				ctx.beginPath();
				switch(shape)
				{
					default:
						ctx.rect(this.m_workArea.x,this.m_workArea.y,this.m_workArea.w,this.m_workArea.h);
						break;
					case "Circle":
						ctx.arc(this.m_workArea.center().x,this.m_workArea.center().y,this.m_workArea.w/2,0,Math.PI*2);
						break;
				}
				ctx.clip();
				ctx.closePath();

			}
			//ctx.save();
		}

	}
	M_resetClipping()
	{

		if(this.m_outputImage )
		{
			let ctx=this.m_outputImage.M_getContext();
			this.m_outputImage.M_popState(1);

		}
	}
   // --------------------------------------------------
   // M_showWorkCanvases
   // --------------------------------------------------
	M_showWorkCanvases()
	{
		if(this.logActive)
		{	this.M_showMaskCanvas();
			this.M_showStencilCanvas();
		}	
		this.M_showOutputImage();
	
	}
	M_createControlImg(id,title,content,out)
	{
		let dv =NewElt("div",{id:id,appendTo:out??GetEltBody()});
		if(title) NewElt("h4",{text:title,appendTo:dv});
		dv.appendChild(content);
		return dv;
	}
	M_showMaskCanvas()
	{
		if( this.maskDiv == undefined)
	   		this.maskDiv = this.M_createControlImg("mask","Mask",this.m_mask.m_canvas,document.getElementById("logContainer"));
	}
	M_showStencilCanvas()
	{
		if( this.stencilDiv == undefined)
	   		this.stencilDiv = this.M_createControlImg("stencil","Stencil",this.m_stencil.m_canvas,document.getElementById("logContainer"));
	}
	M_showOutputImage()
	{	//this.M_log("M_showOutputImage");
		if( this.m_outputImage && this.m_outputImageDiv == undefined)
	   		this.m_outputImageDiv = this.M_createControlImg("outputImage",0,this.m_outputImage.m_canvas,document.getElementById("ARTWORK"));

		}

	
   // --------------------------------------------------
   // M_getClipParameters  
	M_getClipParameters()
	{	
		this.m_clipMinSegment = this.M_get("clipMinSegment")*this.upscale;
		this.m_clipThreshold = this.M_get("clipThreshold",128);
		//console.log(`this.m_clipThreshold=${this.m_clipThreshold}`);
		this.m_isClipImageToWorkArea =  this.M_getBool("isMapClipImageToWorkArea",false);
		this.m_protectionStrokeWidth = this.M_getFloat("protectionStrokeWidth",0.1)*this.upscale;
		this.m_isShortenJunctions = this.m_protectionStrokeWidth >= 1; 
		this.m_isUseMask=this.M_getBool("isUseMask");
	
	}


	// M_getMathsVariables
	M_getMathsVariables()
	{
		// seed 
		var seed = this.M_getInt("seed",0);
		if( seed)
		{	this.M_seed(seed);
		}
		else
			this.M_seed( parseInt(Math.random()*1000) );

		this.m_useVersion = this.M_getFloat("useVersion",0);
		this.m_noiseFactor = this.M_getFloat("noiseFactor",{x:1,y:1});
		this.m_documentHorizon = this.M_getFloat("documentHorizon",0.9);
		this.m_perspectiveFactor = this.M_getFloat("perspectiveFactor",0.5);
		let l = this.M_getFloat("lightSource",{x:-1,y:2,z:0.6});
		this.m_lightSource = new RQVec3(l.x,l.y,l.z); this.m_lightSource.M_normalize();
		this.m_toEyeVector = new RQVec3(0,this.m_perspectiveFactor,1);
		this.m_toEyeVector.M_normalize();



	}
	M_setOrigin2D(o)
	{
		A.m_origin2D =o;
	}
	M_projection( P, Porigin2D)
	{
		let Pproj = new RQVec2(P.x, -P.y + P.z*this.m_perspectiveFactor);				
		if( typeof Porigin2D==="object")
		{	Pproj.M_add(Porigin2D);
		}
		else if(A.m_origin2D)
			Pproj.M_add(A.m_origin2D);
		else
			Pproj.y+=this.m_workArea.top();
		return Pproj;
	}
	M_getProjectionFunc()
	{
		return this.M_projection;
	}
	// Compute a projected orientation ( in deg ) of a 3D vector
	M_projectedOrientation(P)
	{	let dirProj = this.M_projection(P,0); 
		return Math.atan2(dirProj.y,dirProj.x)/DEGTORAD;
	}
	
	// --------------------------------------------------
	// M_getSizeMm
	// reads the size from the dimensions variables  
	// --------------------------------------------------
	M_getSizeMm()
	{
		var upsc = this.M_getInt("upscale");
		if( upsc>0)
			this.upscale = upsc;
		this.m_sizeMm = {width:this.M_getInt("widthMm"),height:this.M_getInt("heightMm")};
		this.W = this.m_sizeMm.width*this.upscale;
		this.H = this.m_sizeMm.height*this.upscale;

				
		let Art = getObj('ARTWORK');
		Art.setAttribute("width", ""+(this.m_sizeMm.width*148/98)+"mm")		
		this.m_documentMargin = this.M_getFloat("documentMargin",0)*this.upscale;
		
		this.M_makeWorkArea();



	}

	M_makeWorkArea()
	{	
		let m = this.m_documentMargin;
		this.m_documentArea = new RQRectangle(0,0,this.W,this.H); 
		let workareaShape = this.M_get("workareaShape","Rectangle");
		//console.log("M_makeWorkArea on "+this.m_name+" shape="+workareaShape);
		let workareaCenter = this.M_getFloat("workareaCenter",{x:0.5,y:0.5});
		let minDim = Math.min(this.W,this.H)-2*m;
		let shift = {x:(workareaCenter.x-0.5)*this.W, y:-(workareaCenter.y-0.5)*this.H};
		switch(workareaShape)
		{
			case "Rectangle":
			default:
				this.m_workArea  = new RQRectangle(m+shift.x,m+shift.y,this.W-2*m,this.H-2*m);
				break;
			case "Square":
				this.m_workArea  = new RQRectangle( shift.x+(this.W-minDim)*0.5,shift.y+(this.H-minDim)*0.5,minDim,minDim);
				break;
			case "Circle":
				this.m_workArea  = new RQCircle( this.W*workareaCenter.x,this.H*(1-workareaCenter.y),minDim/2);
				break;
		
		}



		//Art.css({minWidth:this.m_sizeMm.width+"mm", minHeight:this.m_sizeMm.height+"mm"})

	}
	// --------------------------------------------------
	// M_getDefaultStyle
	// reads the default stroke style  
	// --------------------------------------------------
	M_getDefaultStyle()
	{
		this.m_strokeWidth = this.M_getFloat("strokeWidth",0.5)*this.upscale;
	
		this.m_strokeColor = this.M_get("strokeColor","black");
		
		this.m_paperColor = this.M_get("paperColor");
		//this.M_log("this.m_paperColor="+this.m_paperColor);
		
	}
	// --------------------------------------------------
	M_getStyle(S,vars)
	{
		 if( S==undefined)
			S=this;
		 if(vars==undefined)
			vars=S;
		   S.m_strokeColor = this.M_getColor(vars.M_get("strokeColor",this.m_strokeColor));
		   S.m_strokeWidth = vars.M_getFloat("strokeWidth"); if( S.m_strokeWidth<=0 ) S.m_strokeWidth = this.m_strokeWidth; else S.m_strokeWidth = Number(S.m_strokeWidth)*this.upscale;
		   S.m_isStrokeScale = vars.M_getVarOption("strokeWidth","scale");

		   S.m_paletteTag = vars.M_get("paletteTag","line");
		   S.m_paletteVariant = vars.M_getVarOption("paletteTag","variant");

		   S.m_isFill = vars.M_getBool("isFill",false);
			
	}

   M_getStyleAsString(S)
   {	if( S==undefined)
			S=this;
		var s = "stroke:"+S.m_strokeColor+";stroke-linecap:round;stroke-linejoin:round;stroke-width:"+S.m_strokeWidth+";fill:none";
		return s;
   }

	M_getSvgProperties()
	{
	
		this.m_isMakeSvgGroups = this.M_getBool("makeSvgGroups",false);
		this.m_outputFormat  = this.M_getBool("outputFormat",false)? "PNG":"SVG";
		this.m_pngUpscale		= this.M_getFloat("pngUpscale",1);
		if( !this.m_pngUpscale)
			this.m_pngUpscale = 1;
		if( this.m_outputFormat=="PNG")
		{
			this.M_createOutputCanvas();
			
			let b;if(b=getObj("btnDownloadSVG")) b.setAttribute("style","display:none");
			
		}
		else
		{
			let b;
			if(b=getObj("btnDownloadPNG")) b.setAttribute("style","display:none");
			if(b=getObj("btnDownloadPNGasSVG")) b.setAttribute("style","display:none");
		}	

		//this.M_log("M_getSvgProperties make groups="+this.m_isMakeSvgGroups+" output:"+this.m_outputFormat+" pngUpscale:"+this.m_pngUpscale);
	}
	M_getAnimationParameters()
	{
		this.m_isAnimation = this.M_getBool("isAnimation",false);
		if(this.m_isAnimation)
		{
			this.m_animation = { frameNb: this.M_getInt("nbAnimationFrames",30), frameId: 0} 
		}
		else
		{	let b;if(b=getObj("btnAnimate")) b.setAttribute("style","display:none");}
		this.m_animated[0] = {t:0,tsin:0}
	}
	M_setPalette(palette)
	{
		this.m_palette = palette.colors;
		//console.group("M_setPalette");
		//console.log("Name = "+palette.title);	
		for(let tag in palette.colors)
		{	let c=palette.colors[tag];
			//console.log(" - "+tag+" light = "+c.light+" medium = "+c.medium+" dark = "+c.dark);
			// if( c.isMix) ...
		}
		//console.groupEnd();
	}
	M_getPaletteColor(tag, variant,color)
	{	if( tag && tag!='custom' && this.m_palette)
		{
			if(!this.m_palette.hasOwnProperty(tag))
				tag="fill"
			if(variant===undefined) variant="medium"; 
			//console.log("M_getPaletteColor "+tag+" "+variant+" ("+color+")="+this.M_getColor(this.m_palette[tag][variant]));
			if( this.m_palette[tag].isMix)
			{	let rnd=Math.round(Math.random()*3);	// TEMP
				switch(rnd)
				{
					default:
					case 0: return this.M_getColor(this.m_palette[tag]['medium']); break;
					case 1: return this.M_getColor(this.m_palette[tag]['light']); break;
					case 2: return this.M_getColor(this.m_palette[tag]['dark']); break;
					case 3: return this.M_getColor(this.m_palette[tag]['feint']); break;
				}

			}
			else
			return this.M_getColor(this.m_palette[tag][variant]);
		}
		else
		{
			//console.log("M_getPaletteColor "+tag+" "+variant+" ("+color+")=> fails");
			
		}
		if(color!=undefined)
			return this.M_getColor(color);
		return "black";
		
	
	}
	M_getColor(color)
	{
		const reg = /[0-9\.]+\)/;
		if(color)
		{
			if(color.includes('paper*'))		// mix with paper
			{	let m=color.match(/\/([0-9\.]+)/);
				let a=m?parseFloat(m[1]):1;
				if( m = color.match(/\*rgba\(([0-9\.]+),([0-9\.]+),([0-9\.]+),([0-9\.]+)\)/))
				{	let t=this.M_getPaperArrayRGBA();
					let k=parseFloat(m[4]);
					color="rgba(";
					for(let i=0;i<3;i++)
					{	color+=parseInt( t[i]*(1-k)+parseFloat(m[i+1])*k)+","; 						
					}
					color+=`${a})`;
										
				}

			}
			else if(color.includes('/'))
			{
				let matches = color.match(/(.*)\/([0-9\.]+)/);
				if( matches!=null)
				{
					let opacity = matches[2]+")";
					color=this.M_getColor(matches[1]).replace(reg,opacity);
										
				}
			}
			switch(color)
			{
				case 'inherit':
					color=this.m_strokeColor;
					break;
				case "paper":
					color = A.M_getPaperColor(A.m_paperColor);
					break;
				case "MayGreen_":
					color="rgba(106,158,44,0.75)";
					break;
				case "MayGreen__":
					color="rgba(70,100,38,0.8)";
					break;
				case "MayGreenDark":
					color="rgba(151,165,29,0.7)";
					break;
				case "MayGreen":
					color="rgba(179,198,35,0.75)";
					break;
				case "CitrusBlack":
					color="rgba(100,122,0,0.75)";
					break;
			}
		}
		return color;
	
	}	
	M_registerPaperColors()
	{
		this.M_registerPaper('White'		,"rgba(255,255,255,1)");
		this.M_registerPaper('YellowWhite'	,"rgba(225,226,207,1)");
		this.M_registerPaper('Watercolor'	,"rgba(245,246,243,1)");
		this.M_registerPaper('Black'		,"rgba(0,0,0,1)");
		this.M_registerPaper('Pink'			,"rgba(214,96,134,1)");
		this.M_registerPaper('GreyGreen'	,"rgba(158,182,154,1)");
	}
	M_registerPaper(tag,color)
	{
		this.m_paperColors[tag]={color:color};
	}
	M_getPaperColor(colorName)
	{
		let c = this.m_paperColors[colorName]??{color:"rgba(255,255,255,1)"};
		return c.color;
	
	}
	M_getPaperArrayRGBA()
	{	const reg=/rgba?\(([0-9\.]+),([0-9\.]+),([0-9\.]+),?([0-9\.]*)\)/
		let color = this.M_getPaperColor(this.m_paperColor);
		if( color)
		{
			let m = color.match(reg);
			if(m && m.length>=4)
			{
				return [parseInt(m[1]),parseInt(m[2]),parseInt(m[3]),parseFloat(m[4]??"1")];
			}
			else
				console.warn(`Paper color ${color} doesn't match regexp (length:${m?m.length:"null"})`);
		}
		return [255,128,128,1];
	}
	M_applyPaperColor()
	{
		if( this.m_paperColor.length)
		{	
			var color = this.M_getPaperColor(this.m_paperColor); 
			if( color!=undefined)
			{	if( this.svg && this.m_isSvgBackgroundColor)
					this.svg.style.backgroundColor=color;	
			}
		}
	
	
	}
	
	// M_seed
	// replica of the math function so that algorithms carry their own seed and Random function
	M_seed(seed,i)
	{
		if( i==undefined || i==0)
		{
			this.m_seed = seed;
			this.M_log("seed="+this.m_seed);
			// https://en.wikipedia.org/wiki/Nothing-up-my-sleeve_number
			this.random = sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, seed);
			for (var i2 = 0; i2 < 15; i2++) this.random();
		}
		else
		{	
			this["random"+i]=sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, seed);
			
		}

	}	

   // ---------------------------------------------
   // M_readParametricVariable
   // loading an type Array variable with min and max  
   // ---------------------------------------------
   M_readMinMaxVar(S,varname,scale,isSign)
   {
	   return this.M_readParametricVariable(S,varname,scale,isSign,false);
   }
   M_readParametricVariable(S,varname,scale,isSign,noStore) 
   {	
   		//console.log("M_readParametricVariable "+varname+" "+scale+" "+isSign);
		var val	 = S.M_getFloat(varname);
		if(!noStore)
			S["m_"+varname]=val;
	   if( val.min==undefined)
	   {	val = {min:val,max:val,average:val}
	   }
	   if( scale )
	   {	val.min *=scale;
		   val.max *=scale;
	   }
		val.average = 0.5*(val.min+val.max);
	   val.method	= S.M_get(varname+"Method","Random");
	   val.func 	= this.M_getNamedFunction( val.method); //console.log("val.func="+val.func);
	   val.config 	= { min: val.min, max:val.max
		   , isCustomNoise  : S.M_getBool(varname+"IsCustomNoise",false)
		   , noiseFact : S.M_getFloat(varname+"NoiseFactor",{x:1,y:1})
		   , shift : S.M_getFloat(varname+"Shift",{x:0,y:0})
		   , sign:isSign
		   , isMapRange: S.M_getBool(varname+"IsMapRange",false)
		   , mapRange: S.M_getFloat(varname+"MapRange",{min:0,max:1})
		   , isAnimated  : S.M_getBool(varname+"IsAnimated",false)
		   , centricScale : S.M_getFloat(varname+"CentricScale",{x:1,y:1})
		   , texName : S.M_get(varname+"textureName")
	   }; 
		val.config.tex = this.M_getTexture(val.config.texName);		   


		if(val.config.isAnimated)
		{
			val.config.rnd = this.random();
		}

	   // add a show/hide control next to the variable
	   var inputName = S.M_getVarName(varname);
	   var inputElt = document.querySelector(`[name=${inputName}Method]`);
	   var group = inputElt? $(inputElt).parents("[group-name=MinMaxParameters]") : null; 
	   var o=group? group.get() : null;
	   if( o )
	   {
		var chk = $("<a class=\"btnShowVarOptions\">options</a>");
		var me=this;
		   chk.toggleOptions = function(){
			   group.toggle();
			   if( group.is(':visible'))
			   {	val.fillCanvas.apply(me);
			   }
		   }

			// show/hide related controls
			group.showHideControls=function(method){
				group.find(".forminput").each(function(){
					
					if($(this).is(".method"+method))
						$(this).show();
					else if($(this).is(".not"+method))
						$(this).hide();
					else if( $(this).attr('class').includes("method"))
					{	$(this).hide();
					
					}
					else $(this).show();
				})  
			}
			group.showHideControls(val.method);

		   // title
		   group.find(".RQGroupTitle").click().append(" <b>"+varname+"</b>");

			// texture name
		   group.find("select").each(function() {
				let inpName =$(this).attr('name').replace(inputName,"");
				if(inpName=="textureName")
					me.M_fillTextureSelect( $(this),val.config.texName);
			});

		   // add a live change callback to all variables in the group
		   group.find("input,select").change(function() {
				   let newVal = $(this).val();
				   let inpName =$(this).attr('name').replace(inputName,"");
				   let sub  = $(this).attr("data-key");
				   //alert(inpName+" newVal="+newVal+" typeof="+typeof newVal);
				   switch(inpName)
				   {	case 'IsCustomNoise' : val.config.isCustomNoise = newVal=="true"?true:false; break; 
					   case 'NoiseFactor[]': val.config.noiseFact[sub]=newVal; break;
					   case 'Shift[]': val.config.shift[sub]=parseFloat(newVal); break;
					   case 'CentricScale[]': val.config.centricScale[sub]=newVal; break;
					   case 'IsMapRange':  val.config.isMapRange = newVal=="true"?true:false; break;  
					   case 'MapRange[]': val.config.mapRange[sub]=parseFloat(newVal); break;
					   case 'Method': val.method=newVal; val.func=me.M_getNamedFunction(val.method);group.showHideControls(val.method);break;
					   case 'textureName': val.config.texName =  newVal;val.config.tex = me.M_getTexture(newVal);break;
				   
				   }
				   val.fillCanvas.apply(me);
			   });


		   // adding the noise preview to the group
		   if( this.W>0 && this.H>0)
		   {
			   let dim = 300;
			   let rect = new RQRectangle(0,0,this.W,this.H);
			   rect.M_fitIn(new RQRectangle(0,0,300,300));
			   val.previewTexture = new Texture({width:parseInt(rect.w), height: parseInt(rect.h)});
			   val.previewTexture.scaleToDoc = this.W/rect.w; 
			   val.previewTexture.M_fill("black");
			  let canvasDiv = $("<div class=\"previewCanvas\"></div>");
			  canvasDiv.append(val.previewTexture.m_canvas);

			   group.append(canvasDiv);
		   
			   val.fillCanvas = function()
			   {	let T = val.previewTexture; 
				   if(T)
				   {	let context = T.M_getContext();
					   let Conf = {...val.config};
					   Conf.min=0;
					   Conf.max=255;
					   Conf.sign=false;
					   let s = T.scaleToDoc;
					   var id = context.getImageData(0, 0, T.m_width, T.m_height);
					   var pixels = id.data;
					   let t=0;
					   for( let j=0; j<T.m_height; j++)
					   {
						   for( let i=0; i<T.m_width; i++)
						   {
							   let n = parseInt(val.func.apply(this,[i*s,j*s,Conf] ));
							   pixels[t] =n;
							   pixels[t+1]=n;
							   pixels[t+2] = n;
						   		t+=4;
							}
					   }
					   context.putImageData(id,0, 0);
				   }

			   };
		   }
				   
		   // insert the "option" toggle after the variable
		   chk.on("click",chk.toggleOptions.bind(chk) );
		   chk.insertAfter($("[name=\""+inputName+"[]\"]").last());
		   
		   // call click to fold the group		
		   chk.click();
	   }
	   return val;
   }
	   // ---------------------------------------------
	   // M_getNamedFunction   
	   // ---------------------------------------------
	   M_getNamedFunction(name)
	   {
		   if(name=="Noise")
		   {	return this.M_functionNoise;
		   }
		   else if(name== "Random")
		   {
			   return this.M_functionRandom;
		   }
			else if(name=="Centric")
			{	return this.M_functionCentric;	
			}
			else if(name=="Constant")
			{	return this.M_functionAverage;	
			}
			else if(name=="Texture")
			{	return this.M_functionTexture;	
			}


		   else if(name=="GlobalFunction")
		   {	return this.M_globalFunction;	
		   }
		   else if(name== "Height")
		   {		
			   return this.M_functionHeight;
		   }
		   else 
			   return function(x,y,o){ return 1;}
		   
	   
	   }
	   M_functionMap(val,min,max)
	   {
		   if(val<min)
			   return 0;
		   if(val>max)
			   return 0;
			
		   let x = 2*(val-0.5*(min+max))/(max-min); // [-1;1]
			return 1+2*Math.pow(Math.abs(x),3)-3*x*x;
		  // return 1-x*x;
	   }
	   
	   M_functionNoise(x,y,o)
	   {
		   let noiseFact = o.isCustomNoise?  o.noiseFact : this.m_noiseFactor;
		   //console.log("FunctionNoise : "+x+","+y+" noiseFact: "+noiseFactX+","+noiseFactY+" o="+RQPrintR(o));
		   if( o.isAnimated)
		   {	let dir = Math.PI*2*(o.rnd+this.m_animated[0].t);
		   		let r = this.m_animated[0].tsin *this.W;
		   		x+= r*Math.cos(dir) ; y+r*Math.sin(dir);
		   }
		   let rnd = 0.5*(1+noise.simplex2(x/this.W*noiseFact.x-o.shift.x,y/this.H*noiseFact.y+o.shift.y)); 
		   if( o.isMapRange)
		   {	rnd = this.M_functionMap(rnd,o.mapRange.min,o.mapRange.max);		
		   }
		   var s=  (o.min + (o.max-o.min)* rnd);
		   
		   if( o.sign )
			   s*=Math.sign(this.random() -0.5);
		   return s;
	   }
	   M_functionCentric(x,y,o)
	   {
			if(o===undefined)
				o={min:0,max:1,isMapRange:false}
			if( o.isAnimated)
			{	let dir = Math.PI*2*(o.rnd+this.m_animated[0].t);
				 let r = this.m_animated[0].tsin *this.W;
				 x+= r*Math.cos(dir) ; y+r*Math.sin(dir);
			}
			var zone = this.m_workArea; 
			var C = zone.center();
			let scale=o.centricScale;
			var h = Math.hypot( (x-C.x)/(zone.w*0.5*scale.x)+o.shift.x,(y-C.y)/(zone.h*0.5*scale.y)+o.shift.y); 
			h= RQMaths.M_clamp(h,0,1);
			var rnd=h*h;
			if( o.isMapRange)
			{	rnd = this.M_functionMap(rnd,o.mapRange.min,o.mapRange.max);		
			}
			return o.min + (o.max-o.min)*rnd;
	   
	   }
	   M_functionAverage(x,y,o)
	   {
	   	return (o.min + o.max)*0.5;
	   }
	   M_functionTexture(x,y,o)
	   {
			let rnd=0;
			if( o.tex)
			{
				if( !o.texData)
				{
					o.texData =o.tex.M_getContext().getImageData(0,0,o.tex.m_width,o.tex.m_height);
				
				}
				if(o.texData)
				{	rnd = o.texData.data[ o.texData.width*4*Math.floor(y*o.tex.m_height/this.H+o.shift.y)+4*Math.floor(x*o.tex.m_width/this.W+o.shift.x) ]/255;
					
	   			}
	   			//let rnd = o.tex.M_getPixelIntensity( Math.floor(x*o.tex.m_width/this.W), Math.floor(y*o.tex.m_height/this.H)  );
				return o.min + (o.max-o.min)*rnd;
					
	   		}
	   		return 0.5*(o.max+o.min);
	   }

	   M_functionRandom(x,y,o)
	   {
		   var rnd =this.random(); 
		   if( o.isAnimated)
		   {	rnd=(rnd+o.rnd*this.m_animated[0].tsin)/(1+o.rnd);
		   }

		   if( o.isMapRange)
		   {	rnd = this.M_functionMap(rnd,o.mapRange.min,o.mapRange.max);		
		   }
		   var s=  o.min + (o.max-o.min)*rnd;
		   if( o.sign )
			   s*=Math.sign(this.random() -0.5);
		   return s;
	   }

	   M_functionHeight(x,y,o)
	   {
		   var rnd = RQMaths.M_map(y,this.H*(1-o.shift.y),(1-this.m_documentHorizon)*this.H,1, 0.0);
		   if( o.isMapRange)
		   {	rnd = this.M_functionMap(rnd,o.mapRange.min,o.mapRange.max);		
		   }
		   if(o.rndMultiplier!=undefined)
		   		rnd*=o.rndMultiplier;
		   var s= o.min + (o.max-o.min) * rnd;
		   
		   if( o.sign)
			   s*=(RQMaths.random()>0.5? 1:-1);
		   return s;
	   }

	// --------------------------------------------------
	//  M_getHatchFunctionsList  
	// --------------------------------------------------
	M_getHatchFunctionsList()
	{
	 	return ["HatchShape","TreeHatchShape","HatchFlowField","HatchCirclePacking","HatchCloudLines","PNGFill"];
	}

	// --------------------------------------------------
	// M_getHatchFunction 
	// --------------------------------------------------
	M_getHatchFunction(name,H, vars)
	{
		if(H==undefined) H = this;
		if(vars==undefined) vars = H;
		if( name )
		{
			switch(name)	
			{	
				case 'None':
					return this.M_nullHatchFunc;
				case 'Line':
					break;	
				case 'SineFreq':
					H.m_amplitude	= vars.M_getFloat("amplitude",0.5); H.m_amplitude*=this.upscale; 		
					H.m_wavelength	= vars.M_getFloat("wavelength",{min:4,max:20}); H.m_wavelength.min*=this.upscale; H.m_wavelength.max*=this.upscale;
					H.obbMargin		= H.m_amplitude+this.m_strokeWidth; 

					return this.M_hatchFuncSine;
				case 'Leaf':
					return this.M_hatchFuncLeaf;
				case 'TreeBranch':
					H.m_amplitude	= vars.M_getFloat("amplitude",0.5); H.m_amplitude*=this.upscale; 	
					H.m_barkNoiseFactor = vars.M_getFloat("barkNoiseFactor",{x:120, y:28});	
					H.m_torsion= vars.M_getFloat("barkTorsion",30);
					H.inStencilLineCut = vars.M_getBool("inStencilLineCut",true);
					H.lightingAmplitude = vars.M_getBool("lightingAmplitude",false);
					H.expand = 0.2*this.upscale;	// TEMP TEST
					//console.log("amplitude = "+H.m_amplitude);
					//console.log("barkNoiseFactor = "+RQPrintR(H.m_barkNoiseFactor));
					H.distrFunc = this.M_distFuncTreeBranch;		
					return this.M_hatchFuncTreeBranch;

				case "FlowField":
				case "HatchFlowField":
					{
						//H.m_maxStep		= vars.M_getFloat("maxStep",8); if( (H.m_maxStep) == undefined || (H.m_maxStep<0.1)) {H.m_maxStep = 0.8;} else if( H.m_maxStep>1) {H.m_maxStep*=this.upscale;} 		
						H.m_maxStep = this.M_readParametricVariable(vars,"maxStep",this.upscale,false);
					

						
						let w; 
						H.m_wavelength	=w= vars.M_getFloat("wavelength",{min:8,max:40}); w.min*=this.upscale; w.max*=this.upscale; w.average = (w.min+w.max)*0.5;
						H.m_contribution= vars.M_getFloat("contribution",{damping:0.5,perturbation:0.5});
						H.m_lineSpacing = vars.M_getFloat("lineSpacing",{min:0.3,max:1.5});	for(let m in H.m_lineSpacing) H.m_lineSpacing[m]*=this.upscale;
						//H.m_lineSpacing.average = (H.m_lineSpacing.max +H.m_lineSpacing.min)/2;
						//H.spacing = H.m_lineSpacing.average;
						H.m_stopCollide = vars.M_getBool("stopCollide",false);
						H.m_perturbationSample = vars.M_getBool("perturbationSample",false);	// true = slope , false = direct
						H.m_maskStrokeWidth = vars.M_getFloat("maskStrokeWidth",0); H.m_maskStrokeWidth*=this.upscale;
	
						return this.M_hatchFuncFlowField;
					}
					break;
				case "HatchCirclePacking":
					H.m_size = this.M_readParametricVariable(vars,"size",this.upscale,false);
					H.jointEnds = false;
					H.m_angle = this.M_readParametricVariable(vars,"angle",1.,false);
					H.m_maskStrokeWidth = vars.M_getFloat("maskStrokeWidth",0); H.m_maskStrokeWidth*=this.upscale;
					H.m_modulation = vars.M_getFloat("modulation",{amplitude:0.3,noiseFact:1});
					H.m_maskFill = vars.M_getBool("maskFill",false);
					H.m_shape = vars.M_get("shape","circle");
					switch(H.m_shape)
					{	case "circle":
						default:
							H.m_shapeFunc = this.M_radialFuncCircle;
							break;
						case "square":					
							H.m_shapeFunc = this.M_radialFuncSquare;
							break;
						case "leaf":					
							H.m_shapeFunc = this.M_radialFuncLeaf;
							break;
					}
					H.postProcessing = this.M_hatchPostProcessDrawLinesInMack;
					let texName =vars.M_get("textureName","Mask"); 
					H.m_tex = this.M_getTexture(texName);
					this.M_fillTextureSelect( $(`select[name=${vars.M_getVarName("textureName")}]`),texName);

					return this.M_hatchFuncCirclePacking;
					break;
				case "HatchCloudLines":
					H.m_maskStrokeWidth = vars.M_getFloat("maskStrokeWidth",0); H.m_maskStrokeWidth*=this.upscale;
					H.m_modulation = vars.M_getFloat("modulation",{amplitude:0.3,noiseFact:1}); H.m_modulation.amplitude*=this.upscale;
					H.m_groundCut = vars.M_getFloat("groundCut",0);H.m_groundCut*=this.upscale
					H.m_wavelength	= vars.M_getFloat("wavelength",{min:4,max:20}); H.m_wavelength.min*=this.upscale; H.m_wavelength.max*=this.upscale;
					H.m_maskFill = vars.M_getBool("maskFill",false);
					return this.M_hatchFuncCloudLines;					
					break;
				case "PNGFill":
					H.m_isFill = true;
					H.m_isFront = vars.M_getBool("isFront",false);
					return this.M_nullHatchFunc;
					break;
			}
		}
		return null;
	}
	M_hatchPostProcessDrawLinesInMack(Ls,OBB,H)
	{
		if( (H.m_maskFill || H.m_maskStrokeWidth>0) && Array.isArray(Ls) )
		{
			var context;
			if( H.m_tex)			
				context=H.m_tex.M_getContext();
			else
				context = this.m_mask.M_getContext();			
			context.strokeStyle = "white";
			context.fillStyle="white";





			context.lineWidth = H.m_maskStrokeWidth;
			for( let i=0; i<Ls.length; i++)
			{	let p = new Path2D(Ls[i].M_getSVGPath(false));
				if(H.m_maskStrokeWidth>0)
					context.stroke(p);
				if( H.m_maskFill && Ls[i].m_points)
				{	
					let G = RQMaths.M_getPointsBarycenter(Ls[i].m_points);
					let grad = context.createRadialGradient( G.g.x, G.g.y, 10, G.g.x,G.g.y,G.size/2 );

					grad.addColorStop(0, "white" );
					grad.addColorStop(1, "black" );

					context.fillStyle = grad;


					context.fill(p);
				}
			}
		
		}	
	}
	M_hatchFuncCirclePacking(OBB,x,opts )
	{
		if(OBB.done)
			return null;
		var Ls=[];
		var L = new RQPolyLine();
		Ls.push(L); // TEMP
		if(OBB.cList===undefined)
			OBB.cList=[];
		let CList = OBB.cList;
		let isFree = false;
		let radiusMin = 0.5;
		let C;
		let nbAttempts=0;
		let modFact=opts.m_modulation.noiseFact;
		let scale=new RQVec2(1,1);
		if( opts.normal)
		{
			let Y =new RQVec3(0,1,0);
			let X = this.m_toEyeVector.M_cross(Y);
			X.M_normalize();
			Y = X.M_cross(this.m_toEyeVector);
			Y.M_normalize();
			let N = opts.normal.M_normalized();
			//let cross = opts.normal.M_cross(this.m_toEyeVector);
			scale.x = 1-0.8*Math.abs( N.M_dot(X));
			scale.y = 1-0.8*Math.abs( N.M_dot(Y));
		}
		while(!isFree)
		{
			nbAttempts++;
			if( nbAttempts>=100)
				break;
			let coord =  { x: (this.random()-0.5)*OBB.w, y:(this.random()-0.5)*OBB.h}
			let center = new RQVec2(OBB.o.x+ coord.x*OBB.I.x + coord.y*OBB.J.x, OBB.o.y+ coord.x*OBB.I.y + coord.y*OBB.J.y );		
			let radius =  0.5* opts.m_size.func.apply(this,[center.x,center.y,opts.m_size.config] );
			let orientation =  opts.m_angle.func.apply(this,[center.x,center.y,opts.m_angle.config] );
			C = {p:center, r:radius,co:Math.cos(orientation*DEGTORAD), si:Math.sin(orientation*DEGTORAD)}
			isFree = true;
			for(let i=0; i<CList.length; i++)
			{	let C2 = CList[i];
				let d = C.p.M_dist( C2.p); 
				if( d<(C2.r+radiusMin) )
				{	isFree=false;
					break;
				}
			}
			if( isFree)
			{	// find the minimum radius
				for(let i=0; i<CList.length; i++)
				{	let C2 = CList[i];
					let u = C2.p.M_minus(C.p);
					let dist=u.M_length();
					// find angle of C2, then deduc shape at that point
					
					let a 	= Math.atan2(-u.x*C.si + u.y*C.co  , u.x*C.co +u.y*C.si );		// rotation of -orientation
					let a2 	= Math.atan2( u.x*C2.si- u.y*C2.co ,-u.x*C2.co-u.y*C2.si );		// rotation of -orientation2 with -u
					let A 	= opts.m_shapeFunc.apply(this,[a]);
					let A2 	= opts.m_shapeFunc.apply(this,[a2]);
					let V	= new RQVec2(  C.co*A.x - C.si*A.y ,  C.si*A.x + C.co*A.y);
					let V2	= new RQVec2( C2.co*A2.x-C2.si*A2.y, C2.si*A2.x+C2.co*A2.y);
					
					V.M_mul(scale);
					V2.M_mul(scale);
					let modAmp=opts.m_modulation.amplitude*C.r;
					let modAmp2=opts.m_modulation.amplitude*C2.r;
					

					let rnd = 0.5*(1+noise.simplex2(C.p.x+V.x*modFact,C.p.y+V.y*modFact)); 				
					let rnd2 = 0.5*(1+noise.simplex2(C2.p.x+V2.x*modFact,C2.p.y+V2.y*modFact)); 				

					let r = C.r-modAmp*rnd;					
					let r2 = C2.r-modAmp2*rnd2;					

					let p = new RQVec2(C.p.x + r*V.x, C.p.y+r*V.y );
					let p2 = new RQVec2(C2.p.x + r2*V2.x, C2.p.y+r2*V2.y );
					//r=p.M_dist(C.p);
					//r2=p2.M_dist(C2.p);



					 
					let d = dist-r-r2; 
					if( d<0)
					{
						r= dist-r2;
						
						C.r = r/Math.hypot(V.x,V.y)/(1-opts.m_modulation.amplitude*rnd); 
						if( false )	// TEMP
						{
							let L2 = new RQPolyLine();
							L2.M_addPoint(p2.M_plus(0,-10) );
							L2.M_addPoint(p2.M_plus(0,10) );
							Ls.push(L2);
							L2 = new RQPolyLine();
							L2.M_addPoint(p2.M_plus(-10,0) );
							L2.M_addPoint(p2.M_plus(10,0) );
							Ls.push(L2);
							L2 = new RQPolyLine();
							L2.M_addPoint(C2.p );
							L2.M_addPoint(C.p );
							Ls.push(L2);
						}
					
					}
					/*let d = C.p.M_dist( C2.p); 
					if( (d-C2.r)<C.r)
						C.r = d-C2.r;*/					
				}		
			}
			
		}
		if( isFree)
		{	
			CList.push(C);		
			let nbPoints = 100;
			let aStep = Math.PI*2/nbPoints;
			let a=0; 
			let modAmp=opts.m_modulation.amplitude*C.r;
			let V;
			for( let i=0; i<nbPoints; i++)
			{	
				let r = C.r;
				let A=opts.m_shapeFunc.apply(this,[a]);
				let V = new RQVec2( C.co*A.x-C.si*A.y, C.si*A.x+C.co*A.y);
				V.M_mul(scale);

				if(modAmp!=0)
				{
					let rnd = 0.5*(1+noise.simplex2(C.p.x+V.x*modFact,C.p.y+V.y*modFact)); 				
					r-= modAmp*rnd;
				}
				let P = new RQVec2(C.p.x + r*V.x, C.p.y+r*V.y );
				L.M_addPoint(P);
				a+=aStep;
			}
			L.M_closePath();	
			//return L;
			return Ls; // temp
		}
		else
		{	OBB.done = true;
			return null;
		}
	}	
	M_radialFuncCircle(a)
	{
		return {x:Math.cos(a),y:Math.sin(a)}
	}
	M_radialFuncSquare(a)
	{	const sq = Math.sqrt(2)/2;
		let x=Math.cos(a); let y=Math.sin(a);
		if( Math.abs(x)>Math.abs(y))
			return {x:sq*Math.sign(x),y:y}
		else
			return {x:x,y:sq*Math.sign(y)}
	}
	M_radialFuncLeaf(a)
	{
		let y=0.5*(1+Math.sin(a));
		let x= Math.sin(Math.pow(y,1.4)*Math.PI);
		// wave 
		let oakSpikes = 12;
		x-= Math.pow( (1+Math.sin(y*Math.PI*oakSpikes))*0.5,1.9)*x*0.5;
		return {x:Math.sign(Math.cos(a))*x*0.65,y:y*2-1};	

	
	}
	
	M_hatchFuncSine(OBB, x ,opts)
	{
		var L = new RQPolyLine();
		let P1 = new RQVec2( OBB.o.x+x*OBB.I.x-OBB.h*0.5*OBB.J.x,  OBB.o.y+x*OBB.I.y-OBB.h*0.5*OBB.J.y);
		let P2 = new RQVec2( OBB.o.x+x*OBB.I.x+OBB.h*0.5*OBB.J.x,  OBB.o.y+x*OBB.I.y+OBB.h*0.5*OBB.J.y);
		//return new RQLine(P1,P2);
		let dist = OBB.h;

		let prevAngle = 0;
		let periodLength = opts.m_wavelength.max;
		let angleFact = (2*Math.PI)/periodLength;
		let step = 0.5*this.upscale;
		let angle = prevAngle;
		let nbPointsPerWavelength = 30;
		for( let x=0; x<dist; x+=step)
		{
			let P = new RQVec2( P1.x+OBB.J.x*x , P1.y+OBB.J.y*x );
			let rnd;
			let decal;
			if( opts.m_perturbation)
				rnd = opts.m_perturbation.func.apply(this,[P.x,P.y,opts.m_perturbation.config] )
			else 
				rnd = 0.5*(1+noise.simplex2(P.x/this.W*this.m_noiseFactor.x,P.y/this.H*this.m_noiseFactor.y)); 

			decal = opts.m_amplitude * Math.sin(x*angleFact*(1+rnd));
			P.M_add(OBB.I.x*decal,OBB.I.y*decal); 
			L.M_addPoint(P);

			// next 
			periodLength = RQMaths.M_map(rnd,0,1,opts.m_wavelength.max,opts.m_wavelength.min);		// TEMP, modulation freq	  	
			step = periodLength / nbPointsPerWavelength;
			angle+= (2*Math.PI)/nbPointsPerWavelength;


		}
		return L;
		
	}
	M_hatchFuncCloudLines(OBB, x ,opts)
	{
		let isDrawInMask = opts.m_maskStrokeWidth>0 || opts.m_maskFill;
		if( isDrawInMask && OBB.prevLines )
		{
			this.M_drawInPixels(OBB,OBB.prevLines,opts.m_maskStrokeWidth,opts.m_maskFill,opts.m_maskFill);
			
			// draw in the OBB 
			/*var context = this.m_stencil.M_getContext();			
			context.strokeStyle = "white";
			context.fillStyle="white";
			let p = new Path2D(OBB.prevLines[0].M_getSVGPath(true));
			context.fill(p);*/
			
			OBB.prevLines = null;
		}



		var L = new RQPolyLine();
		let P1 = new RQVec2( OBB.o.x+x*OBB.I.x-OBB.h*0.5*OBB.J.x,  OBB.o.y+x*OBB.I.y-OBB.h*0.5*OBB.J.y);
		let P2 = new RQVec2( OBB.o.x+x*OBB.I.x+OBB.h*0.5*OBB.J.x,  OBB.o.y+x*OBB.I.y+OBB.h*0.5*OBB.J.y);
		//return new RQLine(P1,P2);
		let dist = OBB.h;

		let prevAngle = 0;
		let periodLength = opts.m_wavelength.max;
		let step = 0.5*this.upscale;
		let angle = prevAngle;
		let nbPointsPerWavelength = 60;
		let angleNoise = 0;
		let ampl  =opts.m_modulation.amplitude;
		for( let x=0; x<dist; x+=step)
		{
			let P = new RQVec2( P1.x+OBB.J.x*x , P1.y+OBB.J.y*x );
			let rnd;
			let decalY,decalX;
			rnd = opts.m_perturbation.func.apply(this,[P.x,P.y,opts.m_perturbation.config] )

			
			let noiz=noise.simplex2(Math.cos(angleNoise)*opts.m_modulation.noiseFact,Math.sin(angleNoise)*opts.m_modulation.noiseFact);
			decalX = 0;//opts.m_modulation.amplitude * 0*0.5*Math.sin(0.8*noiz);
			decalY = ampl*Math.pow(Math.max((noiz-opts.m_groundCut/ampl)/(1-opts.m_groundCut/ampl),0),0.4);
			decalY += 0.1*opts.m_modulation.amplitude *Math.sin(Math.PI*noiz*5)
			P.M_add(OBB.I.x*decalY,OBB.I.y*decalY); 
			P.M_add(OBB.J.x*decalX,OBB.J.y*decalX); 
			
			
			L.M_addPoint(P);

			// next 
			periodLength = RQMaths.M_map(rnd,0,1,opts.m_wavelength.max,opts.m_wavelength.min);		// TEMP, modulation freq	  	
			step = periodLength / nbPointsPerWavelength;
			angle+= (2*Math.PI)/nbPointsPerWavelength;
			angleNoise+=0.01;


		}
		if(isDrawInMask)
		{	let decalY = -(ampl*1.5-opts.m_groundCut) // opts.m_groundCut;
			P1.M_add(OBB.I.x*decalY,OBB.I.y*decalY); 
			P2.M_add(OBB.I.x*decalY,OBB.I.y*decalY); 
			let Lshape = L.clone();
			/*for( let i=0; i<Lshape.M_nb(); i++)
			{	Lshape.M_getPoint(i).M_add(OBB.I.x*opts.m_maskStrokeWidth,OBB.I.y*opts.m_maskStrokeWidth);

			}*/
			Lshape.M_addPoint(P2);
			Lshape.M_addPoint(P1);
			OBB.prevLines = [Lshape];
		
		}

		return L;
		
	}
   M_hatchFuncLeaf(OBB,x,opts)
   {
		let OL = opts.leaves;
		if(!OL) return;	
		let profile		= OL.profile;
		let invProfile	= OL.invProfile;
		let decalX = OBB.o.M_minus(OL.C).M_dot(OBB.I)-OBB.w/2; 
 	    let yNorm = (x-decalX)/OBB.w+0.5;
 	    if( yNorm<0) 
 	    	return null; 
		let XT = invProfile.apply(this,[yNorm,OL]);
		
		let leafLen = OL.length;
		let leafW = OL.width * 1.5;
		let bendAlpha = OL.bend*DEGTORAD;
	   	let bendR  = Math.abs(bendAlpha)>0.02 ? leafLen/bendAlpha : 0;

		let dz = (1-Math.cos( yNorm*bendAlpha))*bendR; 
		let y = bendR*Math.sin(yNorm*bendAlpha);

		let segLen = 0.5*this.upscale;
		let nbSeg = Math.max(Math.ceil(leafW/segLen),1);
		segLen = leafW/nbSeg;
		
		let PLocal = new RQVec3();
		let PWorld;
		var L = new RQPolyLine();
		for( let i=0; i<=nbSeg; i++)
		{
			PLocal.M_set( XT.x*2*(i-nbSeg/2)*segLen, y,dz)
			let dec = Math.cos( (i/nbSeg-0.5)*Math.PI*0.9 );
			PLocal.y+= (0.5-Math.pow(dec,5))*opts.spacing*5*Math.sin( Math.PI*yNorm);
			PWorld = OL.MV.M_mutlipliedByVector(PLocal);
			let Pproj = new RQVec2(PWorld.x + OL.C.x,-PWorld.y + PWorld.z*this.m_perspectiveFactor+OL.C.y);				
			L.M_addPoint(Pproj);

		}
		return L;
	}
	M_hatchFuncFlowField(OBB, x ,opts)
	{
		let isDrawInMask = opts.m_maskStrokeWidth>0;
		if( isDrawInMask && OBB.prevLines )
		{
			this.M_drawInPixels(OBB,OBB.prevLines,opts.m_maskStrokeWidth);
			OBB.prevLines = null;
		}

		var Ls=[];
		var L =null;
		x=-0.1*OBB.h+x*1.2;
		let P1 = new RQVec2( OBB.o.x+x*OBB.I.x-OBB.h*0.5*OBB.J.x,  OBB.o.y+x*OBB.I.y-OBB.h*0.5*OBB.J.y);
		let P2 = new RQVec2( OBB.o.x+x*OBB.I.x+OBB.h*0.5*OBB.J.x,  OBB.o.y+x*OBB.I.y+OBB.h*0.5*OBB.J.y);
		let P;
		let k = 20;
		let dist = 0;
		let step = 0.5*this.upscale;

		let speed=OBB.J.clone();
		let strokeDist;
		let strokeLen;
		let Jdist = 0;
		let allJdist = 0;
			if( opts.m_maxStep.func)
			{	opts.m_maxStep.config.rndMultiplier = this.random();
				allJdist -= opts.m_maxStep.func.apply(this,[P1.x,P1.y,opts.m_maxStep.config] );
			}
			else
			{
				allJdist-=this.random()*opts.m_maxStep.max;
			}

		let done = false;
		P = P1.clone();
		let isSampleSlope = opts.m_perturbationSample?true:false;
		let angle0 = opts.orientation;
		while(!done)
		{
			if( L==null)
			{
				L=new RQPolyLine();
				//allJdist+=Jdist;
				P1 = new RQVec2( OBB.o.x+x*OBB.I.x+(-OBB.h*0.5+allJdist)*OBB.J.x,  OBB.o.y+x*OBB.I.y+(-OBB.h*0.5+allJdist)*OBB.J.y);
				P=P1.clone();
				strokeDist = 0;
				speed = new RQVec2(0,0);
				if(opts.m_wavelength)
				{ 	if(opts.m_wavelength.func)
						strokeLen = opts.m_wavelength.func.apply(this,[P.x,P.y,opts.m_wavelength.config] );
					else 
						strokeLen = opts.m_wavelength.average;
				}
				else 
					strokeLen = 40;
				
				let maxStep;
				if( opts.m_maxStep.func)
				{	opts.m_maxStep.config.rndMultiplier = this.random();
					maxStep = opts.m_maxStep.func.apply(this,[P.x,P.y,opts.m_maxStep.config] );
				}
				else
					maxStep = Math.max( (opts.m_maxStep.min<=1)? strokeLen*opts.m_maxStep.min :  Math.min(opts.m_maxStep.min, strokeLen),1*this.upscale); 
				allJdist+=maxStep;
			}
			
			L.M_addPoint(P.clone());
			let rnd00,rnd01,rnd11,rnd10,slope;
			if(this.m_hatchTexture)
			{	let context = this.m_hatchTexture.M_getContext();  
				if(isSampleSlope)
				{
					let id =context.getImageData(P.x-k, P.y-k, 1, 1);
					rnd00 = (id.data[0]/255-0.5)*2;
					
					id =context.getImageData(P.x+k, P.y-k, 1, 1);
					rnd10 = (id.data[0]/255-0.5)*2;
					id =context.getImageData(P.x+k, P.y+k, 1, 1);
					rnd11 = (id.data[0]/255-0.5)*2;
					id =context.getImageData(P.x-k, P.y+k, 1, 1);
					rnd01 = (id.data[0]/255-0.5)*2;
				}
				else
				{	let id =context.getImageData(P.x, P.y, 1, 1);
					rnd00 = (id.data[0]/255-0.5)*2;
				}	
			}
			else 
			{	
				if( opts.m_perturbation)
				{	if(isSampleSlope)
					{
						rnd00 = opts.m_perturbation.func.apply(this,[P.x-k,P.y-k,opts.m_perturbation.config] )
						rnd10 = opts.m_perturbation.func.apply(this,[P.x+k,P.y-k,opts.m_perturbation.config] )
						rnd11 = opts.m_perturbation.func.apply(this,[P.x+k,P.y+k,opts.m_perturbation.config] )
						rnd01 = opts.m_perturbation.func.apply(this,[P.x-k,P.y+k,opts.m_perturbation.config] )
					}
					else
						rnd00 = opts.m_perturbation.func.apply(this,[P.x,P.y,opts.m_perturbation.config] )
						
				}
				else 
				{	
					if( isSampleSlope)			
					{	rnd00 = noise.simplex2((P.x-k)/this.W*this.m_noiseFactor.x,(P.y-k)/this.H*this.m_noiseFactor.y); 
						rnd10 = noise.simplex2((P.x+k)/this.W*this.m_noiseFactor.x,(P.y-k)/this.H*this.m_noiseFactor.y); 
						rnd11 = noise.simplex2((P.x+k)/this.W*this.m_noiseFactor.x,(P.y+k)/this.H*this.m_noiseFactor.y); 
						rnd01 = noise.simplex2((P.x-k)/this.W*this.m_noiseFactor.x,(P.y+k)/this.H*this.m_noiseFactor.y); 
					}
					else
						rnd00 = noise.simplex2(P.x/this.W*this.m_noiseFactor.x,P.y/this.H*this.m_noiseFactor.y); 
						
				}
			}
			if(isSampleSlope)
			{	slope = new RQVec2(rnd10-rnd11,rnd01-rnd11);
				slope.M_mul(opts.m_contribution.perturbation);
			}
			else 
			{	let ang = angle0 + rnd00*Math.PI*opts.m_contribution.perturbation; 
				slope = new RQVec2(Math.cos(ang),Math.sin(ang));
			}
			speed = OBB.J.M_multipliedBy(opts.m_contribution.damping);
			speed.M_add(slope);
			speed.M_normalize();
			P.M_add(speed.x*step,speed.y*step);
			dist+=step;
			strokeDist +=step;
			//this.M_log("step="+step+" dist="+dist+" strokeLen="+strokeLen);
			if(  strokeDist===undefined || isNaN(strokeDist) || strokeDist<=0 )
				return Ls;
			let AP = P.M_minus(P1);
			Jdist = AP.M_dot(OBB.J);
			if( Jdist>=strokeLen || strokeDist>=2*strokeLen)
			{	L.M_addPoint(P.clone() );
				if(opts.m_stopCollide)
				{
					OBB.clipOpts.stopCollide =true;
					let Ls2 = this.M_computeLineMask(L,OBB.clipOpts);
					OBB.clipOpts.stopCollide =false;
					if( Ls2.length>0)
						Ls.push(...Ls2);
				
				}
				else 
					Ls.push(L);
				L = null;
				if( allJdist>=OBB.h*1.2)
				{	done=true;
					if(isDrawInMask)
					{	OBB.prevLines = Ls;
					
					}
				
				}
			}

		}

		
		return Ls;

	}	
	M_copyContextToClipOptsData( context,clipOpts )
	{
		if( context && clipOpts )
		{
			let d=clipOpts.data;
			let data = context.getImageData(d.x, d.y,d.id.width,d.id.height);
			if( data )
			{	clipOpts.data.id = data;
				//this.M_log("Source : "+d.x+","+d.y+" "+d.id.width+"x"+d.id.height+" --> "+data.width+"x"+data.height);
			}
		}
	
	
	}
	M_drawInPixels(OBB, PL,strokeWidth,useSvgDrawing,isFill)
	{	
			var Copt;
			if( (Copt=OBB.clipOpts) && Copt.data)
			{
				if( useSvgDrawing)
				{
					let d = Copt.data;
					var context = this.m_stencil.M_getContext();			
					if(isFill)
						context.fillStyle = "white";
					if( strokeWidth>=1)
					{	context.strokeStyle = "white";
						context.lineWidth = strokeWidth;
					}
					for( let i=0; i<PL.length; i++)
					{	
						if( isFill)
							context.fill( new Path2D(PL[i].M_getSVGPath(true) ));
						if( strokeWidth>0)
							context.stroke( new Path2D(PL[i].M_getSVGPath(false) ));
					}
					// get back the stencil data
					this.M_copyContextToClipOptsData(context,Copt);
					
				}
				else
				{
					let kernelSize = strokeWidth-1;
					let kernelStart = -kernelSize/2;	


					let x0= Copt.data.x;
					let y0 = Copt.data.y;
					let w0 = Copt.data.id.width;
					let h0 = Copt.data.id.height;
					Copt.data.changed = true;
					let rowBytes = w0*4;
					let data = Copt.data.id.data; 
					for( let iL=0; iL<PL.length; iL++)
					{	let L = PL[iL];
						if( L && L.m_points)
						for( let ip=0; ip<(L.m_points.length-1); ip++)
						{	let P0 = L.m_points[ip].clone(); 
							let I = L.m_points[ip+1].clone().M_minus( P0);
							let dist= I.M_length();
							if( dist>=1)
							{	I.M_mul(1/dist);
								let J = new RQVec2(-I.y,I.x); //new RQVec2( -I.y,I.x); 
								for(let i=0;i<dist;i++)
								{	let P = new RQVec2( P0.x+kernelStart*J.x,P0.y+kernelStart*J.y);
									for(let k=0; k<=kernelSize; k++)
									{	let x=Math.round(P.x-x0);
										let y=Math.round(P.y-y0);
										if( x>=0 && x<w0 && y>=0 && y<h0)
										{ 
											let ind = x*4+ y*rowBytes;
											data[ind]=data[ind+1]=data[ind+2]=255;
										}
										P.M_add(J.x,J.y);
									}
									P0.M_add(I);													
								}
							}
						}
					}
				}
			}	
	
	}



	// --------------------------------------------------
	// M_makeObjectSVG
	// creates a jquery SVG object   
	// --------------------------------------------------
	M_makeObjectSVG(id,W,H)
	{
		var cdata= ""; //<zancanpatterns:namedview >\n//<![CDATA[\n"+JSON.stringify(this.m_variables)+"\n//]]></zancanpatterns>\n";
		let svg= NewEltNs("svg",{
			style:`fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;`,
			xmlns:"http://www.w3.org/2000/svg",
			"xmlns:inkscape":"http://www.inkscape.org/namespaces/inkscape",
			zancanpatterns:"http:www.zancan.fr/zancanpatterns.dtd",
			version:"1.1",
			"xmlns:xlink":"http://www.w3.org/1999/xlink",
			"xml:space":"preserve",
			"xmlns:serif":"http://www.serif.com/",			
			width:`${(W/this.upscale)}mm`,
			height:`${(H/this.upscale)}mm`,
			viewBox:`0 0 ${W} ${H}`,
			id:`${id}`
		});

		return svg;

	}
	M_getTagSVG(svg)
	{
		var svgElt = NewElt("div");
		svgElt.appendChild(svg);
		return svgElt.innerHtml;
	}	
	// --------------------------------------------------
	// SVG Groups
	// --------------------------------------------------

	M_makeDefaultSvgGroup(name,style)
	{ 	
		this.m_defaultSvgGroup = NewEltNs("g",{name:name, style:style, "inkscape:groupmode":"layer", "inkscape:label":name}); 
		var grp = this.M_declareSvgGroup(this.m_name,name,true,style,true);
		
		return this.m_defaultSvgGroup;
	}
	


	// 
	M_findGroupDeclaration(bundleName, tagName)
	{
		let D=A.m_groupsDeclared;
		for( let i=0; i<D.length; i++)
		{	let Gr = D[i];
			if( Gr.bundle==bundleName && Gr.name==tagName)
				return Gr;
		
		}	
		return null;		
	}

	// Declare svg group
	// the defaultSvgGroup must have been created first
	// by default, a Svg group will fill the main algorithm's m_lines structure
	// unless it is customized by calling M_getSvgGroups
	
	M_declareSvgGroup(bundleName,tagName,isInstanciate,style,isDefault)
	{
		if( tagName )
		{

			//this.M_log("M_declareSvgGroup("+bundleName+","+tagName+ (isDefault?" isDefault.":""));
			var Gr=A.M_findGroupDeclaration(bundleName,tagName);
			if( Gr==null)
			{
				Gr 		= {	bundle		:bundleName,
							name		:tagName,
							id			:tagName,
							strokeWidth	:this.m_strokeWidth,
							strokeColor : this.m_strokeColor,
							style		:this.M_getStyleAsString(this), 
							m_lines		:A.m_lines,
							instances	:0,
							isInstance	:false,
							m_svgGroup	:A.m_defaultSvgGroup,
							nbLines		:0 
						}
				
				if( isDefault)
					Gr.isDefault = true;
				A.m_groupsDeclared.push(Gr);
			} 	
			let hasObjStyle=false;
			if( style!=undefined && style!=null)
			{	if(typeof style==='string')
					Gr.style = style;
				else if(typeof style==='object')
				{
					Gr.style=this.M_getStyleAsString(style);
					hasObjStyle = true;
				}
			}
			// instance
			// create a named instance in this.m_groups
			if(isInstanciate)
			{
				if( this.m_groups[tagName]==undefined)
				{
					let gr = this.m_groups[tagName] = A.M_getGroupInstance(Gr);	
					if( isDefault)
						gr.m_active = true;
					else if( this.m_isMakeSvgGroups )
					{	gr.m_active = true;
						gr.m_lines=[];
						let name;
						if( gr.id.length>=1) name=gr.bundle+"/"+gr.id;
						else name = gr.bundle+" "+gr.name+gr.instances;
						let gElt = NewEltNs("g",{name:name,style:gr.style,"inkscape:groupmode":"layer","inkscape:label":name});
						A.svg.appendChild(gElt);
						gr.m_svgGroup = gElt;

						if(hasObjStyle)
						{
								if( style.m_paletteTag ) gr.m_paletteTag=style.m_paletteTag;
								if( style.m_strokeColor ) gr.m_strokeColor=style.m_strokeColor;
								if( style.m_strokeWidth ) gr.m_strokeWidth=style.m_strokeWidth;
						}

					}

				}
			}
			return Gr;
		}
		return null;
	}
	// create an instance of a declared group
	M_getGroupInstance(Gr)
	{	const log=false;
		if(log)console.group("M_getGroupInstance "+Gr.bundle+"/"+Gr.name);
		let gr=null;
		if(Gr)
		{ 	Gr.instances++;
		
			// create a copy
			gr = {...Gr};
			gr.M_applyScale=function(s){if(this.m_isStrokeScale) this.strokeScale=s;}
			gr.isInstance=true;
			if(log)console.log(" --> new group instance "+gr.bundle+"/"+gr.name+"("+gr.instances+")");

			// save the instance in a global array
			A.m_groupsInstances.push(gr);

		   
		}
		if(log)console.groupEnd();
		return gr;
	}
	
	
	
	// M_getSvgGroups - will create a new instance of the group each time the function is called. Beware
	//M_getSvgGroups(bundleName,isActivate)
	M_makeBundleInstances(S,bundleName)
	{	let log=false;
		let D=A.m_groupsDeclared;
		if(log)console.group("M_makeBundleInstances "+bundleName+" declared:"+D.length);
		for( let i=0; i<D.length; i++)
		{	let Gr = D[i];
			//console.log(" ["+i+"] "+Gr.bundle+"/"+Gr.name);
			if( Gr.bundle==bundleName)
			{	if(log)console.log(" + Found group "+Gr.bundle+"/"+Gr.name);
				if( S.m_groups==undefined)
					S.m_groups={};
				if( S.m_groups[Gr.name]==undefined)
				{
					if(log)console.log(" + Adding S.m_groups["+Gr.name+"]");
					let gp = S.m_groups[Gr.name] = A.M_getGroupInstance(Gr);	

										
					if(gp && this.m_isMakeSvgGroups)
					{
						gp.m_active = true;
						gp.m_lines = [];

						let name = gp.id.length>=1 ? `${gp.bundle}/${gp.id}` : `${gp.bundle}/${gp.name}${gp.instances}`;
						A.svg.appendChild( gp.m_svgGroup=NewEltNs("g", {name:name,style:gp.style,"inkscape:groupmode":"layer","inkscape:label":name}));

					}


				}

			}
		}
		if(log)console.groupEnd();
	
	}

	M_isGroupBundle(bundleName)
	{
		let D=A.m_groupsDeclared;

		for( let i=0; i<D.length; i++)
		{	let Gr = D[i];
			if( Gr.bundle==bundleName)
				return true;
		}
		return false;
	
	}
	M_declareSvgGroups()		
	{
		this.VM_declareSvgGroups();
		this.M_applySvgGroupsToSelect();
	
	}
	VM_declareSvgGroups() // virtual
	{
	
	}

	// M_applySvgGroupsToSelect
	// finds all the SVG group selector inputs and add the various groups available to them
	// ------------------------
	M_applySvgGroupsToSelect(inSelect)
	{	let log=false;
		if(log)console.group("M_applySvgGroupsToSelect");
		// templates have the attribute data-template-name="GrassClover"
		let selects=inSelect??document.querySelectorAll(".SvgObjectEnum select");
		if(log)console.log("selects.length="+selects.length);
		for(let is=0; is<selects.length; is++)  
		{ 	let sel=selects[is];
			var tName="";
			var addAll = true; 
		    // find the parent block / get the group name in data-template-name
			let parents = $(sel).parents(".templateClassItem");	// TODO Vanilla
			parents.each(function(){
				if(A.M_isGroupBundle( tName = $(this).attr('data-template-name')))
				{	addAll= false; 
					//console.log("Found tName="+tName);
					return false; // will break the each function				
				}				
			})
			let D=A.m_groupsDeclared;

			for( let i=0; i<D.length; i++)
			{	let Gr = D[i];

	   			if( addAll || tName==Gr.bundle)
	   			{	if( !sel.querySelector(`option[value="${Gr.name}"]`)) 
						NewElt("option", {value:Gr.name,text:Gr.name,appendTo:sel});			   			
				}
	   		
			}
	   
	   }
	   if(log)console.groupEnd();
	   
   
   }
   //  M_readSvgGroupVariable
   M_readSvgGroupVariable(S, vars)
   {	let log=false;
		var groupName = vars.M_get("SvgObject");
		if(log)console.group("M_readSvgGroupVariable - "+groupName);
		
		// find the corresponding SELECT 
		let elts= document.querySelectorAll(`select[name=${vars.M_getVarName('SvgObject')}]`);
		
		// In UI the groups must be added to this select first
		if(elts.length)
			this.M_applySvgGroupsToSelect(elts);

		// and set their value
		// it must have the M_applySvgGroupsToSelect done before that 
		if(elts) for(let i=0;i<elts.length;i++) {elts[i].value=groupName;}

		if(  typeof A.m_groups==="object" && groupName.length) 
		{   let gr = S.m_groups[groupName]; 
			if(gr!=undefined)
			{
				if(this.m_isMakeSvgGroups)
				{	
					gr.m_active = true;
					gr.m_lines = [];
					this.M_getStyle(gr,vars);
					gr.m_svgGroup = NewEltNs("g",{name: vars.M_get("SvgGroupId",gr.id),style:this.M_getStyleAsString(gr),appendTo:A.svg})


				}
			} 

		}
	   if(log)console.groupEnd();
	}
	M_readHatchVariable(S,vars)
	{
		
		var groupName = vars.M_get("SvgObject");
		const debug=false;
		if(debug)console.group("M_readHatchVariable "+groupName);
		var svgObjectName = vars.M_getVarName('SvgObject');

		// Find the corresponding select
		let elts= document.querySelectorAll(`select[name=${svgObjectName}]`);
		
		// In UI the groups must be added to this select first
		if(elts.length)
			this.M_applySvgGroupsToSelect(elts);


		for(let i=0;i<elts.length;i++) {elts[i].value=groupName;}
 
		if( S.m_groups==undefined)
			S.m_groups={};
		
		{   let Gr = S.m_groups[groupName]; 
			let Gref; 
			if(Gr!=undefined && (Gref = this.M_findGroupDeclaration(Gr.bundle, Gr.name)) )
			{	
				var groupActive = ('activate' in vars.m_variables === false) || vars.M_getBool("activate",true);
				if(debug)console.log("groupActive="+groupActive);
				Gr.m_active = true;	// TEST TEMP
				
				if(groupActive||this.alwaysActivateGroups)
				{
					if( Gr.fills==undefined)
					{	Gr.fills = [];
						if(debug)console.log("Creating fills array");
					}
					let gp = A.M_getGroupInstance(Gref);
					if(Gr.fill==undefined)
					{	Gr.fill = gp;
						if(debug)console.log("Setting fill variable");
					}
					Gr.fills.push(gp);

					// Commong stuff
					if( "perturbation" in vars.m_variables )
					{	gp.m_perturbation = this.M_readParametricVariable(vars,"perturbation",1,false);
					}
					gp.m_spacing= gp.m_lineSpacing = this.M_readParametricVariable(vars,"lineSpacing",this.upscale,false);
					gp.protect = vars.M_getFloat("protect",0); gp.protect*=this.upscale;
					gp.jointEnds = vars.M_getBool("jointEnds",true);
					gp.orientation = vars.M_getFloat("orientation",0);
				   if(this.m_isMakeSvgGroups)
				   {   
					   gp.m_active = groupActive;
					   gp.m_lines = [];
					   this.M_getStyle(gp,vars);
					   gp.m_svgGroup = NewEltNs("g",{name:vars.M_get("SvgGroupId",gp.id),style:this.M_getStyleAsString(gp),appendTo:A.svg})
					}
				   let hf = vars.M_get('hatchFunc');
				   if( !hf) hf=vars.m_name;
				   gp.hatchFunc = this.M_getHatchFunction(hf,gp,vars)
				   
				}
			}
		}
		if(debug)console.groupEnd();
	}


	M_clearMask()
	{
		if( this.m_mask)
		{
			this.m_mask.M_fill("black");
		}
	}
	M_clearDrawing()
	{
		this.m_lines=[];
		let Grs = A.m_groupsInstances;
		for( let ig=0; ig<Grs.length; ig++)
		{
			let group = Grs[ig];
			if( group.m_svgGroup)
				group.m_svgGroup.innerHTML="";
			group.nbLines = 0;
		}
		this.m_canvasHeap=[];
		this.m_canvasHeapL=[];
		this.M_initOuputImage();
	
	}
	M_makeSvgGroupsCheckboxes()
	{
		if( this.m_outputFormat!="SVG")
			return;

		this.m_isGroupChkDone = true;
		console.group("M_makeSvgGroupsCheckboxes");
		// Create Panel if it doesn't exist
		var p = getObj('groupChks');
		if( !p)
		{	p = NewElt("div",{class:"PanelM", id:"groupChks"}); 
			let panel=document.querySelector('#RQSitePanelArtwork .PanelM');
			panel.parentNode.insertBefore(p, panel.nextSibling);
			//p.insertAfter('#RQSitePanelArtwork .PanelM');
			panel.parentNode.insertBefore( NewElt("div",{class:"RQPanelTitle",text:"SVG groups"}),p );
		}		
		let Grs = A.m_groupsInstances;
		for( let ig=0; ig<Grs.length; ig++)
		{
			let group = Grs[ig];
			let groupBundleId="groupBundle"+group.bundle;
			//console.log("["+ig+"] group "+group.bundle+"/"+group.name+"("+group.instances+") "+(group.m_active?"ACTIVE":"(inactive)") );
			if( group.m_active)
			{
				let b = p.querySelectorAll("#"+groupBundleId)[0];
				if( !b)
				  b = NewElt("ul",{class:"bundle",id:groupBundleId,html:`<div class="title">${group.bundle.length?group.bundle:"-"}</div>`,appendTo:p});

				  
				let grpName = group.bundle+ group.name+(group.instances>1?group.instances:"");
				var id= "chkGroup"+grpName; 
				//console.log("Chk : "+id);
				if( !b.querySelectorAll('#'+id)[0])
				{
					if( group.m_lines.length>0 || group.nbLines>0)
					{	
						let li=NewElt("li",{appendTo:b});
						var chk = NewElt("input",{type:"checkbox", id:id, checked:"CHECKED", value:"on",appendTo:li});
						NewElt("label",{for:id,text:grpName,appendTo:li});

						let sw = group.m_strokeWidth?group.m_strokeWidth : A.m_strokeWidth;
						if( sw )
							NewElt("span",{class:"stroke", text:(sw/A.upscale),appendTo:li});

						chk.onchange= function(){
							if(A.svg)
							{
								if( group.m_svgGroup)
								{	if( this.checked )
										A.svg.appendChild(group.m_svgGroup); 
									else
										group.m_svgGroup.remove();
									
								}
								A.M_applyArtwork();
							}
						};
					}
				}
			}
		}
		console.groupEnd();		
	}

	// --------------------------------------------------
	// Logging
	// --------------------------------------------------
	M_log = (s,id) => new Promise((resolve, reject) => 
	{
		if(!A.logActive)
		{	resolve(); return;}
		if( !A.m_logObj)
		{
			let Art = getObj('ARTWORK');
			A.m_logObj = getObj("artworkLog");
			if( !A.m_logObj)
			{
				let container = NewElt("div",{id:"logContainer"});
				let btns=NewElt("div",{class:"buttons",appendTo:container})
				A.m_logObj =NewElt("div",{id:"artworkLog",appendTo:container}); 
				NewElt("a", {class:"btnClearLog",text:"Clear",appendTo:btns}).onclick=function(){A.m_logObj.innerHTML=""};
				NewElt("a", {class:"btnHideLog",text:"Hide",appendTo:btns}).onclick=function(){ 
					[A.m_logObj,getObj("mask"),getObj("stencil"),...(document.querySelectorAll("#impl")??[])].map((p)=>{if(p) {if(A.isLogHidden) p.removeAttribute("style"); else p.setAttribute("style","display:none;");}  })
					A.isLogHidden=!(A.isLogHidden??false);
				};
				
				Art.parentNode.insertBefore(container, Art.nextSibling);
			}
		}
		var o;
		if( id!=undefined && (A.m_logObj && (o=getObj(id))))
		{	o.innerHTML=s;
		}
		else 
		{	let dv = NewElt("div",{html:s,appendTo:A.m_logObj});
			if(id!=undefined) dv.setAttribute("id",id);
		}
		resolve();
	});
	M_clearLog()
	{
		if(A.m_logObj)
		{
			A.m_logObj.find("div:not([id])").remove();
		}
	
	}

	M_isAbort()
	{
		if(this.m_abort)
		{
			this.M_log("Aborted.","aborted");
			return true;
		}
		return false;
	}

	// --------------------------------------------------
	// Images & Textures
	// --------------------------------------------------
	M_getTexture(name)
	{
		if( name )
			return this.m_textures[name];
		return null;	
	}
	async M_createTextures()
	{
	
		var textures = this.M_getVariablePack("textureList","Texture",true);
		if( !Array.isArray(textures))
			textures=[];
		
		
		
		// this.m_isUseMask
		// add the mask 
		this.m_textures["Mask"]=this.m_mask;
		this.m_textures["Stencil"]=this.m_stencil;

		let clipImage0 = this.M_getPath("clipImage");
		if( clipImage0)
			textures.push({name:"Mask",imagePath:clipImage0});
			
		if(Array.isArray(textures))
		{
			for(let i=0; i<textures.length; i++)
			{	let S = textures[i];
				let name = S.name || S.M_get('name');
				if(name.length )
				{
					let isGen = false;
					if(this.m_textures[name]==undefined)
					{
						isGen = S.M_getBool("isGenerative",false);
						if( isGen )
						{	this.m_textures[name] = new Texture({width:this.W, height:this.H});
							// todo : fill
							this.m_textures[name].M_fill("black");

						}
					}
					{
						let imagePath = S.imagePath || S.M_getPath("image");
						if( imagePath)
						{	await this.M_loadImage( S,"img",imagePath ).then(img=>{
								this.M_log("Ok loaded image at texture "+name);
								// Create a canvas with this image
								if(this.m_textures[name] == undefined)
									this.m_textures[name] = new Texture({image:S.img});
								let opts={img:S.img};
								this.m_textures[name].M_drawImage(opts);
									
							}).catch(e=>{console.error(`Error M_loadImage ${imagePath}`);console.error(e);}); 
						}
					}
				}
			}
		}
		//this.M_log(RQPrintR(this.m_textures,1));
	}
	M_fillTextureSelect(select,selected)
	{
		if( select && select.is("select"))
		{	select.html("");
			for(let name in this.m_textures)
			{	let opt = $("<option value=\""+name+"\">"+name+"</option>");
				if( name==selected)
					opt.attr("selected","SELECTED");
				select.append(opt);				
			}
		
		}
	
	}

	
  

		M_loadImage = (S,varname,filepath)=>
		 new Promise((resolve, reject) => {
			if( filepath )
			{
				this.m_nbImagesLoading++;

				if( S[varname]==undefined) 
					S[varname] = new Image();
					S[varname].onload = function(){
						this.M_log("Image "+varname+" loaded");
						this.m_nbImagesLoaded++;
						resolve(S[varname]);
					}.bind(this);
				S[varname].onerror = reject;
				S[varname].src=filepath;

			}
			else
			{	console.log("No path for "+varname);

				resolve(null);
			}
	  	});  


	// --------------------------------------------------
	// M_includeArtwork(S,art)
	// --------------------------------------------------

	M_includeArtwork(S,art)
	{
		this.M_log("selected algorithm = "+art.m_options['selectedAlgorithm']);
		let opts =art.m_options;
		if( opts['JSClass']!==undefined )
		{
			let c = getClass(opts['JSClass']); 
		   if( c!=undefined)
			   S.A = new c();  
		   if( S.A)
		   {
				S.A.m_isMainAlgorithm = false;
				S.A.m_isOwnPalette=opts['ownPalette']?true:false;
				if(S.A.m_isOwnPalette && opts['palette']!==undefined)
				{	try{
						console.log("opts['palette']="+opts['palette']);
						S.A.M_setPalette(JSON.parse(opts['palette']));
					}
					catch(e)
					{
						console.error(e);
						console.error(opts['palette']);
					}
		   		}
				S.A.M_setVariables(JSON.parse(opts['JSONVars'] ));
			   this.M_initIncludedAlgorithm(S.A, false);
			   
			   // Init variables
			   S.A.M_initVariables();

			   this.M_log("Init OK on algorithm "+opts['JSClass']);
		   }
		}			
	}
	M_initIncludedAlgorithm(Algo,isMainVars)
	{
		   Algo.svg= this.svg;
		   Algo.m_lines = A.m_lines;
		   Algo.m_mask = this.m_mask;
		   Algo.m_stencil = this.m_stencil;
		   Algo.m_outputImage = this.m_outputImage;
		   Algo.m_outputFormat = this.m_outputFormat;
		   Algo.m_canvasHeap = this.m_canvasHeap;
		   Algo.m_canvasHeapL=this.m_canvasHeapL;
		   if(!Algo.m_isOwnPalette)
		   		Algo.m_palette = this.m_palette;
		   Algo.W =this.W;
		   Algo.H =this.H;
		   Algo.M_makeWorkArea();


		   Algo.upscale =this.upscale;
		   Algo.m_isUseMask = true;
		   Algo.m_isMakeSvgGroups = this.m_isMakeSvgGroups;
		   if(isMainVars)
		   {	Algo.m_clipMinSegment = this.m_clipMinSegment;
				Algo.m_documentMargin = this.m_documentMargin;
				Algo.m_documentArea = this.m_documentArea;
				Algo.m_workArea = this.m_workArea;

		   		Algo.m_protectionStrokeWidth = this.m_protectionStrokeWidth;
		   		Algo.m_noiseFactor = this.m_noiseFactor;
				Algo.m_documentHorizon = this.m_documentHorizon;
				Algo.m_perspectiveFactor = this.m_perspectiveFactor;
				Algo.m_lightSource = this.m_lightSource;
				Algo.m_toEyeVector = this.m_toEyeVector;
				Algo.m_strokeWidth = this.m_strokeWidth;
				Algo.m_strokeColor = this.m_strokeColor;		   		
		   }
		   Algo.m_defaultSvgGroup = A.m_defaultSvgGroup;
		   //S.A.m_groups = A.m_groups;	// ?
		   Algo.M_declareSvgGroups();
	
	}

	// input : a RQLine or a RQPolyLine
	// TODO : replace with a Bresenham
	// opts : 
	// bounds: RQRectangle or default to workarea
	// thres: intensity [0,255]
	M_computeLineMask(input,options)
	{
		let outLines=[];
			if(input==null) return outLines;
		let opts=options??{}
		var multipleLines = input.m_isPolyLine;
		let bounds = opts.bounds??this.m_workArea;
		let stopCollide = opts.stopCollide; 
		let clipThres = opts.thres??this.m_clipThreshold;
		var outputLine = function(L)
		{ 
			if( multipleLines)
			{
				// compare with last point to output a polyline if needed
				var last =outLines.pop();
				if( last!=undefined && last.M_endPoint().M_equals(L.A))
				{
					// is it already a polyline ?
					if( last.m_isPolyLine)
					{	last.M_addPoint(L.B);
						outLines.push(last);
					}
					// else replace line with a polyline 
					else
					{
						var poly = new RQPolyLine();
						poly.M_addPoint(last.A);
						poly.M_addPoint(last.B);
						poly.M_addPoint(L.B);
						outLines.push(poly);
					}
				}
				else
				{	if( last!=undefined)
						outLines.push(last);
					outLines.push(L);
				}
			}
			else
				outLines.push(L.clone());
		}
		var mask = opts.mask??this.m_mask;
		if( mask && (this.m_isUseMask || opts.active))
		{
			var context = mask.M_getContext();
			var thres3 = clipThres*clipThres*clipThres;
			let currentLine;
			var nbLines = 1;
			if( multipleLines)
			{	
				nbLines = input.M_nb()-1;			
			}	
			else currentLine = input;		
			
			let data;
			let rowBytes;
			let x0;
			let y0;
			if(opts.data)
			{ 	data = opts.data.id.data; 
				x0= opts.data.x;
				y0 = opts.data.y;
				rowBytes = opts.data.id.width*4;
			} 
			else
			{
				// aabb of line and get data for all
				let aabb = RQMaths.M_getAABB(multipleLines ? input.m_points : [input.A,input.B]);
				if( !aabb)
					return outLines;
				aabb.M_inset(-2*this.upscale)
				aabb.M_limitToRectangle(bounds);
				if( aabb.w>=1 && aabb.h>=1)
				{
					let imgdata = context.getImageData(aabb.x,aabb.y,aabb.w,aabb.h ); 
					data = imgdata.data;
					x0 = aabb.x;
					y0 = aabb.y;
					rowBytes = imgdata.width*4;
				
				}
			}
			
			for( let iLine = 0; iLine<nbLines; iLine++)
			{
				var newLine= new RQLine()
				var wasOut=-1;
				if( multipleLines)
					currentLine = input.M_getLine(iLine);

				var slope= new RQVec2(currentLine.B.x-currentLine.A.x,currentLine.B.y-currentLine.A.y);
				var len = slope.M_length();
				if( len>0)
				{	let P=currentLine.A.clone();
					let penUp = currentLine.A.penUp??false;
					let d= new RQVec2( slope.x/len, slope.y/len);
					
					for(let l=0.0; l<=len; l+=1.0)
					{
						var isOut; 
						if( (!penUp) && bounds.M_isPointInside(P) && this.m_workArea.M_isPointInside(P) )
						{
							if( data)
							{
								let ind = Math.round(P.x-x0)*4+ Math.round(P.y-y0)*rowBytes;
								isOut= (data[ind]*data[ind+1]*data[ind+2]>=thres3 || data[ind+3]<clipThres )?1:0;
							
							}
							else 
							{
								var p = context.getImageData(P.x,P.y, 1, 1).data;
								isOut= (p[0]*p[1]*p[2]>=thres3 || p[3]<clipThres )?1:0;
							}
						} else isOut = 1;
						if( wasOut==-1)
						{	wasOut=isOut;
							if( isOut==0)
							{	newLine.A.M_set(P);
							}
						}	
						else
						{	if( wasOut!=isOut)
							{
								if( wasOut==1)	// we enter the zone
								{	newLine= new RQLine(P.clone(),P.clone());
								}
								else	// a line is finished 
								{	newLine.B.M_set(P.x-d.x,P.y-d.y);

									outputLine(newLine);							
									if( stopCollide)
										return outLines;
								}
								wasOut=isOut;
							}
						
						}
						if(penUp)
							break;
						P.x += d.x;
						P.y += d.y;
					}
					// end it
					if( wasOut==0)
					{	newLine.B.M_set(currentLine.B);
						outputLine(newLine);							
					}

				} // end len>0 
			} // end for

			// filter by size
			for(var i = outLines.length -1; i >= 0 ; i--){
				if(outLines[i].M_length()<this.m_clipMinSegment)
					outLines.splice(i, 1);
			}

			

			//this.M_log("returning outlines : "+outLines.length,"maskout");
			return outLines;

		}
		else
		{	return [input];
		}
	}
	// --------------------------------------------------
	//  M_hatchShape  
	//  returns the lines
	// --------------------------------------------------
	M_nullHatchFunc(OBB,x,opts)
	{
		return null;
	}
	M_defaultHatchFunc(OBB,x,opts)
	{
		let p={x:OBB.o.x+x*OBB.I.x, y:OBB.o.y+x*OBB.I.y}
		let h = OBB.h*0.5;
		let P1 = new RQVec2( p.x - h*OBB.J.x,  p.y - h*OBB.J.y);
		let P2 = new RQVec2( p.x + h*OBB.J.x,  p.y + h*OBB.J.y);
		
		return new RQLine(P1,P2);
	}
	M_defaultSpacingFunc(OBB,x,opts)
	{
		return opts.spacing;	
	
	}
	M_defaultDistributionFunc(OBB,x,opts)
	{
		
		if( x<(OBB.w-this.m_strokeWidth/2))	// TODO: is it not opts.m_strokeWidth?
		{
			let hatchFunc = opts.hatchFunc?? this.M_defaultHatchFunc;	
			var L = hatchFunc.apply(this, [OBB,x-OBB.w/2,opts] );

			let spacingFunc = opts.spacingFunc?? this.M_defaultSpacingFunc;
			let spc = spacingFunc.apply(this, [OBB,x,opts] );
			x+=Math.max(spc,this.m_strokeWidth);


			return { x:x, L:L}
		}
		return null;

	}
	M_makeClipOBB(polyline,opts)
	{
		let points = polyline.m_points;
		let aabb0;
		opts??={}
		let angleDeg=opts.orientation??0; 
		let augmentOBB = opts.obbMargin;

		if( opts.clipImage)
		{	aabb0 =RQMaths.M_getAABB(points);
		}
		var OBB = RQMaths.M_getOBB(points,angleDeg);
		if( augmentOBB)
		{
			OBB.w+=2*augmentOBB;
			OBB.h+=2*augmentOBB;
		}
		var obbContour = RQMaths.M_polylineFromOBB(OBB);  
		var aabb = RQMaths.M_getAABB(obbContour.m_points);
		aabb.M_limitToRectangle(this.m_workArea);

		let clipOpts = {mask:this.m_stencil,active:true,bounds:aabb.clone()};
		if( opts.thres!==undefined)
		{	clipOpts.thres= opts.thres;
		}
		// bounds are shrinked of half a pixel
		clipOpts.bounds.M_inset(0.5);

		aabb.M_inset(-this.upscale)
		aabb.M_limitToRectangle(this.m_workArea);
		aabb.M_rounding();
		if( isNaN(aabb.w) || aabb.w<1 || aabb.h<1)
			return null;

		var pathPoints = polyline.M_getSVGPath(true);		
		var path = new Path2D(pathPoints);
		if(this.m_stencil)
		{	
			//console.log("Got clip Mask. PathPoints="+pathPoints);
			var context = this.m_stencil.M_getContext();			
			//this.m_stencil.M_fill("white");
			context.fillStyle = "white";
			context.fillRect(aabb.x, aabb.y, aabb.w, aabb.h);

			if(opts.clipImage)
			{	this.M_log("Filling clip "+opts.clipImage+" at "+aabb0.M_getString());
				context.drawImage(opts.clipImage,aabb0.x, aabb0.y, aabb0.w, aabb0.h);			
			}
			else
			{	context.fillStyle = "black";
				if(opts.noFillShape)
					context.fillRect(aabb.x, aabb.y, aabb.w, aabb.h);				
				else 
				{
					context.fill(path);
					// protection stroke width
					if(opts.expand)
					{	//console.log("Expanding !");
						context.lineWidth = opts.expand*2;
						context.strokeStyle = "black";
						context.stroke(path);

					}
					else if(opts.protect)
					{
						context.lineWidth = opts.protect*2;
							context.strokeStyle = "white";
							context.stroke(path);
					}
					
				}
			}
			// draw mask image
			if(this.m_mask)
			{	context.globalCompositeOperation = "lighter";

					//context.drawImage(this.m_mask.m_canvas, 0,0,this.m_stencil.m_width,this.m_stencil.m_height);	
				context.drawImage(this.m_mask.m_canvas, aabb.x, aabb.y, aabb.w, aabb.h,aabb.x, aabb.y, aabb.w, aabb.h);	
				context.globalCompositeOperation = "source-over";
			}

			// get the data from the aabb zone once for all to speed up queries
			let data = context.getImageData(aabb.x,aabb.y,aabb.w,aabb.h ); 
			clipOpts.data = { id : data, x:aabb.x,y:aabb.y }
			OBB.clipOpts=clipOpts;	// Test
		}
		OBB.end = ()=>{
			if(clipOpts && clipOpts.data.changed)
			{
				// put the data back into canvas for display
				let context = this.m_stencil.M_getContext();
				context.putImageData(clipOpts.data.id,clipOpts.data.x, clipOpts.data.y);
				
			}
		}
		return OBB;
	}

	
	// opts.orientation
	// opts.spacing 
	// opts.hatchFunc
	// opts.spacingFunc
	// opts.distrFunc
	// opts.alternate   true/false : alternate lines directions to optimize plotting
	// opts.jointEnds
	// opts.obbMargin;
	// opts.clipImage
	// opts.noFillShape
	// opts.protect		inner protection stroke width 
	// opts.postProcessing  // post processing function
	// opt.thres : mask threshold for clip line function
	M_hatchShape(polyline,opts)
	{
		if(this.m_abort)
			return;
		var augmentOBB = opts.obbMargin;
		var outputLines = []; 
		var points = polyline.m_points;
		var nb =  points.length;
		if( nb<2)
			return;
		var angleDeg=opts.orientation; 

		let alternate = opts.alternate || opts.jointEnds;
		let jointEnds = opts.jointEnds;
		let OBB = this.M_makeClipOBB(polyline,opts);
		if(!OBB)
			return [];
		

		// draw strokes		
		var sign = 1;
		var hasPrev = false;

		let distributionFunc = opts.distrFunc? opts.distrFunc : this.M_defaultDistributionFunc; 
		var x=0;
		let D,L;
				
		while(D=distributionFunc.apply(this,[OBB,x,opts]))
		{
			x=D.x;
			L = D.L;

			// if case of array of lines, we can't perform reversing / jointing lines
			if( Array.isArray(L))
			{
			
				for(let i=0; i<L.length; i++)
				{				
					outputLines.push(...this.M_computeLineMask( L[i] , OBB.clipOpts	));
				}
			}
			// Single line : performing reverse / jointing 
			else if(L)
			{	
				if( sign<0)
				{
					L.M_reverseOrder();
				}
				let Ls = this.M_computeLineMask( L , OBB.clipOpts);
				
				if( Ls.length>=1)
				{	if( jointEnds)
					{
						if( hasPrev)
						{
							let Lprev = outputLines.pop();
							let Lnext = Ls[0];
							if( Lprev && Lprev.M_nb()>=2)
							{
								if( Lprev.M_endPoint().M_dist( Lnext.M_getPoint(0)) <= (opts.spacing+2*this.m_strokeWidth)  )		// TODO : comparaison with real end points ( how to get them ? )  
								{ 
									/*let newL = new RQLine(Lprev.M_endPoint().clone(),Lnext.M_getPoint(0).clone() );
									let newLs = this.M_computeLineMask( newL , clipOpts);
									if(newLs.length==1 &&  newLs[0].M_nb()==2 && newLs[0].M_getPoint(0).M_dist( Lprev.M_endPoint() )<0.1 && newLs[0].M_endPoint().M_dist( Lnext.M_getPoint(0) )<0.1)
									{ 
										newL=new RQPolyLine();
										newL.M_append(Lprev);
										newL.M_append(Lnext);
										Ls[0] = newL;
									}
									else outputLines.push(Lprev);
									*/
									let newL  = new RQPolyLine();
									for(let i=0; i<Lprev.M_nb(); i++)
									{	newL.M_addPoint(Lprev.M_getPoint(i));
									
									}
									for(let i=0; i<Lnext.M_nb(); i++)
									{	newL.M_addPoint(Lnext.M_getPoint(i));							
									}
									Ls[0] = newL;
								}
								else outputLines.push(Lprev);
							}
						}
					}
					outputLines.push(...Ls);
					hasPrev = true;
				}
				else 
					hasPrev = false;
			
			}
			else 
				hasPrev = false;

			if( alternate)
				sign=-sign;			
		}
		OBB.end();
		if(opts.postProcessing)
		{
			opts.postProcessing.apply(this,[outputLines,OBB,opts])
		}
		
		// mark a group
		if( opts.group)
		{
			return [{group:true,lines:outputLines}];
		}
		
		return outputLines;
 
	
	}
	
	M_putWorkareaInStack()
	{
		let o = {m:'workarea',shape:this.m_workArea,type:this.M_get("workareaShape") }; 
		this.M_log("M_putWorkareaInStack "+RQPrintR(o,1)+" canvasHeap size="+this.m_canvasHeap.length );
		this.m_canvasHeap.push(o);

	}
	M_drawDebugPoints(pts,opt)
	{
		if(Array.isArray(pts))
		{
			if(!opt) opt={};
			let isMask = opt && opt.mask;
			let l=this.upscale*0.5;
			let grp = opt.group??A.m_groups.Debug;
			let prevColor;
			if(!opt.group)
			{	prevColor= grp.m_strokeColor;
				grp.m_strokeColor = opt.color??"black";
			}
	
			for( let i=0; i<pts.length; i++)
			{	let C=pts[i];
				this.M_drawLines(grp,new RQLine(C.M_plus(0,-l),C.M_plus(0,l) ),isMask);
				this.M_drawLines(grp.Debug,new RQLine(C.M_plus(-l,0),C.M_plus(l,0) ),isMask);
			}				
			if(prevColor)
			{	grp.m_strokeColor = prevColor;
			}

		}
	}
	M_drawDebugText(str,C,opt)
	{	if(!opt) opt={};
		if(!opt.color)opt.color="black";
		if(!opt.fontSize)opt.fontSize=3;
		opt.fontSize*=this.upscale;
		let heap = this.m_canvasHeapL; 
		heap.push({m:'text',str:str,x:C.x,y:C.y,c:opt.color,sz:opt.fontSize});
	}
	M_drawDebugVector2D(u,C,opt)
	{
		let lu = u? u.M_length() : 0;
		let l = 10*this.upscale;
		let prevColor = A.m_groups.Debug.m_strokeColor;
		let isMask = opt && opt.mask;
		if(opt && opt.color)
		{	A.m_groups.Debug.m_strokeColor = opt.color;
		}
		if( lu>0)
		{	let L = new RQLine( C, C.M_plus( u.M_multipliedBy(l/lu) ));
			this.M_drawLines(A.m_groups.Debug,L,isMask);
		}	
		else 
		{	this.M_drawLines(A.m_groups.Debug,new RQLine(C.M_plus(0,-this.upscale),C.M_plus(0,this.upscale) ),isMask);
			this.M_drawLines(A.m_groups.Debug,new RQLine(C.M_plus(-this.upscale,0),C.M_plus(this.upscale,0) ),isMask);
		}
		A.m_groups.Debug.m_strokeColor = prevColor;

	}
	M_drawDebugVector(P,u,C,opt)
	{	opt??={}
		if(!C) C=undefined;
		let l = opt.l??10*this.upscale;
		let p1 = this.M_projection(P,C);
		let u2 = this.M_projection(P.M_plus(u),C).M_minus(p1);
		let lu = u2.M_length();
		let prevColor = A.m_groups.Debug.m_strokeColor;
		let isMask = opt && opt.mask;
		if(opt && opt.color)
		{
			A.m_groups.Debug.m_strokeColor = opt.color;
		}
		if( lu>0)
		{	let L = new RQLine( p1, p1.M_plus( u2.M_multipliedBy(l/lu) ));
			this.M_drawLines(A.m_groups.Debug,L,isMask);
		}	
		else 
		{	this.M_drawLines(A.m_groups.Debug,new RQLine(p1.M_plus(0,-this.upscale),p1.M_plus(0,this.upscale) ),isMask);
			this.M_drawLines(A.m_groups.Debug,new RQLine(p1.M_plus(-this.upscale,0),p1.M_plus(this.upscale,0) ),isMask);
		}
		A.m_groups.Debug.m_strokeColor = prevColor;
	}
	M_drawDebugBasis(B,C,opt)
	{
		let l = opt.l??5*this.upscale;
		if(!C) C=undefined;
		let isMask = opt && opt.mask;
		let O = this.M_projection(B.O,C);
		let uI = this.M_projection(B.O.M_plus(B.I.M_multipliedBy(l)),C).M_minus(O);
		let uJ = this.M_projection(B.O.M_plus(B.J.M_multipliedBy(l)),C).M_minus(O);
		let uK = this.M_projection(B.O.M_plus(B.K.M_multipliedBy(l)),C).M_minus(O);
		let prevColor = A.m_groups.Debug.m_strokeColor;

		A.m_groups.Debug.m_strokeColor="red";
		this.M_drawLines(A.m_groups.Debug,new RQLine( O, O.M_plus( uI)),isMask);
		A.m_groups.Debug.m_strokeColor="green";
		this.M_drawLines(A.m_groups.Debug,new RQLine( O, O.M_plus( uJ)),isMask);
		A.m_groups.Debug.m_strokeColor="blue";
		this.M_drawLines(A.m_groups.Debug,new RQLine( O, O.M_plus( uK)),isMask);


		A.m_groups.Debug.m_strokeColor = prevColor;

	}
// M_drawInMask
// adds a shape to the mask
// opts.protect : protection stroke
// opt.intensity : [0-255]
M_drawInMask(shape,opts)
{
	if( shape)
	{
		let o=opts??{}
		let protect=o.protect??this.m_protectionStrokeWidth;
		let path = new Path2D(shape.M_getSVGPath(true));
		let context = this.m_mask.M_getContext();
		let color = o.intensity? `rgba(255,255,255,${o.intensity/255})`:"white";
		context.fillStyle = color;
		context.fill(path);
		if( protect)
		{
			context.lineWidth = protect*2;
			context.strokeStyle = color;
			context.stroke(path);
		}
	}
}
M_drawLinesInMask(L,strokeWidth)
{
	if(strokeWidth && L)
	{
		let Ls = Array.isArray(L)? L : [L];
		let context = this.m_mask.M_getContext();
		context.strokeStyle = "white";
		context.lineWidth=strokeWidth;
		for( let i=0; i<Ls.length; i++)
		{	let path = new Path2D(Ls[i].M_getSVGPath(false));			
			context.stroke(path);

		}


	}
}

	M_drawImage(canvas,aabb,mode)
	{
		if( this.m_outputImage)
		{	let context = this.m_outputImage.M_getContext();
			if(mode)
				context.globalCompositeOperation=mode;
			context.drawImage(canvas, aabb.x, aabb.y,aabb.w, aabb.h);
			if(mode)
				context.globalCompositeOperation="source-over";
		}
		this.m_canvasHeap.push({m:'canvas',c:canvas,aabb:aabb});

	}
	M_drawPoints(group,pointsArray)
	{
		if( group && group.m_lines && pointsArray && Array.isArray(pointsArray))
		{	
			if( this.m_outputFormat=="SVG")
			{
				// todo. How ? 
			}
			else if( this.m_outputImage)
			{
				let context = this.m_outputImage.M_getContext();
				let color=this.M_getGroupColor(group);
				let heap = this.m_canvasHeapL; 
				context.fillStyle = color;	
				let PI2=2 * Math.PI;
				for(let i=0; i<pointsArray.length;i++)
				{
					let pt = pointsArray[i];
					context.beginPath();
					context.arc(pt.x, pt.y, pt.r, 0, PI2, false);
					context.fill();
										
					heap.push({m:"round",c:color,x:pt.x,y:pt.y,r:pt.r});
				}

			}
		
		}

	}

	M_drawLines(group,lines,isMask,opt)
	{
		if( lines==undefined || !group)
			return;
		let Ls = Array.isArray(lines)? lines : [lines];
		if( this.m_outputFormat=="SVG")
		{
			if( group && group.m_lines)
			{	
				if( isMask)
					group.m_lines.push( ...this.M_computeLineMask(lines,opt));
				else
					group.m_lines.push( ...Ls);
			
			}	
		}
		else
		{	if( this.m_outputImage)
			{
				/*let A2 = this.m_isOwnPalette? this:A;
				let color =  A2.M_getPaletteColor(group.m_paletteTag,group.m_paletteVariant,group.m_strokeColor);*/
				let color;
				if(group.m_strokeColor && group.m_strokeColor.includes('func('))
				{	let m=group.m_strokeColor.match(/\(([a-zA-Z0-9_]+),([0-9\.]+),([0-9\.]+),([0-9\.]+),([0-9\.]+),([0-9\.]+)\)/);
					let a=m?m[1]:"";
					//console.log("a="+a+" "+RQPrintR(opt));	// opt.orientation can be useful too
					if(a && (typeof this[a] === "function"))
					{	color = this[a](Ls[0].M_getPoint(0),m[2],m[3],m[4],m[5],m[6]);
					}
				}
				else
				 color = this.M_getGroupColor(group);

				let stroke = group.m_strokeWidth|| this.m_strokeWidth; 
				let context = this.m_outputImage.M_getContext();
				if(group.m_isFill)
				{
					context.fillStyle = color;	
					for(let i=0; i<Ls.length;i++)
					{
						let lines = Ls[i].M_getSVGPath(false);
						let path = new Path2D(lines);
						let heap = group.m_isFront? this.m_canvasHeapL : this.m_canvasHeap; 
						heap.push({m:"fill",c:color,path:path,l:lines});
						context.fill(path);
					}
					
				}
				else
				{

					if(group.strokeScale)
						stroke*=group.strokeScale;
					context.strokeStyle = color;
					context.lineWidth = stroke;
					if( isMask)
						Ls= this.M_computeLineMask(lines,opt);  
					let nb=Ls.length;
					let sortFunc=(opt&&opt.svgSort)?opt.svgSort.func:null;
					for(let i=0; i<nb;i++)
					{	
						if(sortFunc)
							Ls[i].sortOpt=opt.svgSort.param;
						let lines = Ls[i].M_getSVGPath(false); 
						let path = new Path2D(lines);
						A.m_canvasHeapL.push({m:"stroke",w:stroke,c:color,path:path,l:lines});
						context.stroke(path);
						
					
					}
					if( A.buildSvg)
					{	if(sortFunc)
						{	
							group.sortFunc??=sortFunc;
						}
						group.m_lines.push( ...Ls);
					}

				}		
			
			}
		}
	}
	M_getGroupColor(group)
	{
		let A2 = this.m_isOwnPalette? this:A;
		let color = A2.M_getPaletteColor(group.m_paletteTag,group.m_paletteVariant,group.m_strokeColor);
		return color;
	}
	ColorAlphaCentric(p,r,g,b,a,a0)
	{
		let t = Math.min(1,p.M_dist(this.W/2,this.H/2)/(this.H/2));
		t=Math.pow(t,3);
		let s= `rgba(${r},${g},${b},${a*t+a0*(1-t)})`; 	
		//console.log(s);
		return s;
	}
	M_fillShape(group,L,opt) 
	{	
		if( this.m_outputFormat=="SVG")
		{
			if( opt.hatchFunc==this.M_nullHatchFunc)
				return;
			//console.log("M_fillShape - group.m_lines.length="+group.m_lines.length+" L="+L.M_getString());
			let Ls = this.M_hatchShape( L ,opt);
			if( Array.isArray(Ls))
			group.m_lines.push(...Ls); 
			if(opt.strokeMask)
			{	this.M_drawLinesInMask(Ls,opt.strokeMask)

			}
		}
		else if( this.m_outputImage)
		{	let liveFill = opt.liveFill??this.m_allowLiveFillShape;
			let context = this.m_outputImage.M_getContext();
			let color;
			if(group.m_strokeColor && group.m_strokeColor.includes('func('))
			{	let m=group.m_strokeColor.match(/\(([a-zA-Z0-9_]+),([0-9\.]+),([0-9\.]+),([0-9\.]+),([0-9\.]+),([0-9\.]+)\)/);
				let a=m?m[1]:"";
				// console.log("a="+a+" "+RQPrintR(opt));	// opt.orientation can be useful too
				if(a && (typeof this[a] === "function"))
				{	color = this[a](L.M_getPoint(0),m[2],m[3],m[4],m[5],m[6]);
				}
			}
			else
				color = this.M_getGroupColor(group);			
			if(group.m_isFill)
			{
				let Ls = Array.isArray(L)? L : [L];
				if(liveFill)
					context.fillStyle = color;	
				for(let i=0; i<Ls.length;i++)
				{	let lines =Ls[i].M_getSVGPath(false); 
					let path = new Path2D(lines);
					let heap = group.m_isFront? A.m_canvasHeapL : A.m_canvasHeap; 
					heap.push({m:"fill",c:color,path:path,l:lines});
					if(liveFill)
						context.fill(path);
				}
				
			}
			
			else
			{

				let Ls = this.M_hatchShape( L ,opt);
				if( Ls)
				{
					context.strokeStyle = color;
					context.lineWidth = group.m_strokeWidth;
					for(let i=0; i<Ls.length;i++)
					{	if( Ls[i].group)
						{	let lines = Ls[i].lines;
							for(let il=0; il<lines.length;il++)
							{
								let _l =lines[il].M_getSVGPath(false); 
								let path = new Path2D(_l);							
								A.m_canvasHeapL.push({m:"stroke",w:group.m_strokeWidth,c:color,path:path,l:_l});
								context.stroke(path);
							
							}
						}
						else
						{
							let _l = Ls[i].M_getSVGPath(false);
							let path = new Path2D(_l);
						
							A.m_canvasHeapL.push({m:"stroke",w:group.m_strokeWidth,c:color,path:path,l:_l});
							context.stroke(path);
						}
					}
					if(opt.strokeMask)
					{	console.log("Calling stroke mask");
						this.M_drawLinesInMask(Ls,opt.strokeMask)
		
					}
					if( A.buildSvg)
						group.m_lines.push( ...Ls);
		
					
				}
			
			
			}
		
		
		}
	}

   async M_drawLinesToSvg(isForceSVG)
   {	
		if( this.M_isAbort())
			return;
		if(this.m_outputFormat=="SVG" || isForceSVG)
		{
			var hasLinesLeft = false;
			//for(var groupName in this.m_groups)
			let Grs = A.m_groupsInstances;
			for( let ig=0; ig<Grs.length; ig++)
			{
				let group = Grs[ig];
				if( group.m_active)
				{	if(group.sortFunc)
					{	group.m_lines.sort((la,lb)=>{
							if(la.sortOpt && lb.sortOpt)
								return group.sortFunc(la.sortOpt,lb.sortOpt);
							else 
								return la.sortOpt? -1 : lb.sortOpt? 1 : 0;
						});
						group.sortFunc=null;
					}
					
					let groupElt=group.m_svgGroup;
					var linesNb = group.m_lines.length;
					if( linesNb>0)
					{
						for( let ib=0; ib<1000 && linesNb; ib++)
						{  
							var line =group.m_lines.pop(); 
							if( line )
							{

								if( line.group==true)
								{
									if( group.groupCount==undefined)
											group.groupCount = 0;
									let s="";
										let gElt = document.createElementNS(_NS,"g");
										gElt.setAttribute("c",group.groupCount++);
										// "<g c=\""+(group.groupCount++)+"\">"+s+"</g>\n";

										if( Array.isArray(line.lines))
										{	let line2;
											while(line2 = line.lines.pop() )
											{
												this.m_lineCount ++;
												group.nbLines++;
												let elt=line2.M_toSVGElement();
												if( elt)
												{
													gElt.insertBefore(elt,gElt.childNodes[0]);
												}
												//s=line2.M_toSVG()+s;
											}
										}
										groupElt.insertBefore(gElt,groupElt.childNodes[0]);
									
									}
									else 
									{
										//group.m_svgGroup.prepend(line.M_toSVG());
										this.m_lineCount ++;
										group.nbLines++;

										try{
											let elt=line.M_toSVGElement();

											//group.m_svgGroup.get(0).appendChild(elt);
											if( elt)
												groupElt.insertBefore(elt,groupElt.childNodes[0]);
											}
										catch(e)
										{
											console.error(e);
										}
									}
								}
						}
						if( group.m_lines.length)
							hasLinesLeft = true;
						}
					}
			}		

			if(!hasLinesLeft)
			{
				for( let ib=0; ib<30 && this.m_lines.length; ib++)
				{  
					var line =this.m_lines.pop(); 
					this.m_lineCount++;
					this.m_defaultSvgGroup.prepend(line.M_toSVG());
				}
				if( this.m_lines.length)
					hasLinesLeft = true;
			}  
			if( hasLinesLeft)
				await this.M_drawLinesToSvg(isForceSVG);
			else 
			{	
				//this.M_getTagSVG(this.svg);
				//this.M_log(this.m_name+" DONE. Nb lines = "+this.m_lineCount);
			}

		}
		else
			await this.M_drawLinesToPNG()

	}
	async M_drawLinesToPNG()
	{

		{
			if( this.m_outputImage && this.m_isMainAlgorithm)
			{
		   		this.M_log("M_drawLinesToPNG ("+this.m_name+") main algorithm + PNG");
				this.M_initOuputImage(); 
				let ctx = this.m_outputImage.M_getContext();
				//ctx.lineCap="round";
				ctx.lineCap="butt";
				let g;
				let PI2=2*Math.PI;
				for( let i=this.m_canvasHeap.length-1; i>=0; i--)
				//while( (g=this.m_canvasHeap.pop()))
				{			
					g=this.m_canvasHeap[i];
					switch(g.m)
					{
						case 'fill':
							ctx.fillStyle = g.c;
							// test
							/*var gradient = ctx.createLinearGradient(this.W/2, 0, this.W/2, this.H/2);
							gradient.addColorStop(0, "rgba(255,255,255,0)");
							gradient.addColorStop(1, g.c);
							ctx.fillStyle = gradient;*/
			


							ctx.fill(g.path);
							break;
						case 'stroke':
								ctx.strokeStyle = g.c;
								ctx.lineWidth = g.w;
								ctx.stroke(g.path);
								break;
						case 'canvas':
							if(g.mode)
								ctx.globalCompositeOperation=g.mode;
							ctx.drawImage(g.c,g.aabb.x,g.aabb.y,g.aabb.w, g.aabb.h);
							if(g.mode)
								ctx.globalCompositeOperation="source-over";
							break;
						case 'workarea':
							
							this.M_log("M_drawLinesToPNG - heap i="+i+"setting clip mask to "+g.type+" shape="+g.shape.M_getString()+" ctx.save()");
							this.m_outputImage.M_popState(1);
							this.m_outputImage.M_pushState();
							ctx.beginPath();
							switch(g.type)
							{
								default:
									ctx.rect(g.shape.x,g.shape.y,g.shape.w,g.shape.h);
									break;
								case "Circle":
									ctx.arc(g.shape.center().x,g.shape.center().y,g.shape.w/2,0,Math.PI*2);
									break;
							}
							ctx.clip();
							ctx.closePath();
							break;
					
					}

				}
				for( let i=this.m_canvasHeapL.length-1; i>=0; i--)
				//while(g=this.m_canvasHeapL.pop())
				{
					g=this.m_canvasHeapL[i];	
					switch(g.m)
					{
						case 'fill':
							ctx.fillStyle = g.c;
							ctx.fill(g.path);
							break;
						case 'stroke':
							ctx.strokeStyle = g.c;
							ctx.lineWidth = g.w;
							ctx.stroke(g.path);
							break;
						case 'round':
							ctx.fillStyle = g.c;
							ctx.beginPath();
							ctx.arc(g.x, g.y, g.r, 0, PI2, false);
							ctx.fill();
		
							break;
						case 'text':
							ctx.font = `${g.sz}px sans-serif`;
							ctx.fillStyle = g.c;
							ctx.fillText(g.str, g.x, g.y);
							console.log("Drawing text to context="+RQPrintR(g));
							break;

					}
				}
				
				// Foreground filters
				this.M_drawFilters(this.m_fgFilters);

			
			}
			else this.M_log("(not main algorithm)");
		}
	}

	M_downloadPNGasSVG(filename)
	{
		// create a SVG and draw the heap in it

		var div = document.createElement("div");
		let svgpng=this.M_makeObjectSVG("svgpng",this.W,this.H);
		div.appendChild(svgpng);
		let svg=svgpng;

		let paper = this.M_getColor("paper");

		let defs = NewEltNs("defs",{appendTo:svg});
		let clipId=0; 
		let svgGrp = svg;
		let g;
		for( let i=this.m_canvasHeap.length-1; i>=0; i--)
		{			
			g= this.m_canvasHeap[i];
			switch(g.m)
			{
				case 'fill':
					{
						if(g.l)
						{
							NewEltNs("path",{d:g.l, style:`fill:${g.c===paper?"white":g.c}`, appendTo:svgGrp});
						}
					}
					break;
				case 'workarea':
					switch(g.type)
					{
						default:
						case "Circle":
							//ctx.rect(g.shape.x,g.shape.y,g.shape.w,g.shape.h);
							clipId++;
							let clip = NewEltNs("clipPath",{id:`_clip${clipId}`, html:g.shape.M_toSVG(false), appendTo:defs});
							svgGrp = NewEltNs("g", {"clip-path":`url(#_clip${clipId})`,id:`group${clipId}`, appendTo:svg});

							break;
					}
					//ctx.clip();
					break;
			
			}

		}
		for( let i=this.m_canvasHeapL.length-1; i>=0; i--)
		{			
			g=this.m_canvasHeapL[i];
			switch(g.m)
			{
				case 'fill':
					NewEltNs("path",{d:g.l,style:`fill:${g.c===paper?"white":g.c}`,appendTo:svgGrp});
					break;
				case 'stroke':
					NewEltNs("path", {d:g.l,"stroke-width":g.w, stroke:g.c===paper?"white":g.c, fill:"none",appendTo:svgGrp});
					break;
			}
		}
		downloadSVG(div.innerHTML,filename);	
	
	}
	M_applyArtwork()
	{	
		if( this.m_outputFormat=="SVG")
		{	
			let a=getObj('ARTWORK');
			if(a && A.svg) 
				a.appendChild(A.svg);

		}
		else if( this.m_outputFormat=="PNG" && this.m_outputImage)
		{
		}		
	
	}
	M_init(isAutoRun)
	{
		this.M_applyPaperColor();
		this.M_applyArtwork();
		
	}	
	M_run()
	{
		this.m_timer= 	window.setInterval(this.M_update.bind(this), this.dt); 

	
	
	}
	M_launchAnimation()
	{
		if(this.M_startAlgorithm)
			this.M_startAlgorithm();
	
	}

	M_update()
	{
	
	}

	M_onAlgorithmDone()
	{
	
		if( !this.m_isGroupChkDone)
			this.M_makeSvgGroupsCheckboxes();
	}
};

var A;
