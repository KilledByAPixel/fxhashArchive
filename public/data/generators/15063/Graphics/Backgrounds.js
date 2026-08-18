class Backgrounds
{
    constructor()
    {

    }
    static sM_register()
    {
        //console.log("Registering Backgrounds");
        
        // M_readBackgroundVars
        // ---------------------
        PatternAlgorithm.prototype.M_readBackgroundVars = function (S)
        {
            //console.log("M_readBackgroundVars "+S.m_name);
            S.m_isActive = S.M_getBool("activate",false);
            if(S.m_isActive)
            {
                if( S.m_name=="BackgroundLib")
                {
                    S.m_bgFunc=S.M_get("bgFunc");
                    S.m_strokeColor=S.M_get("strokeColor","rgba(0,0,0,0.5)");   // Not sure here
                    this.M_log("Got background with func = "+S.m_bgFunc);
                    S.m_orientation = 90+S.M_getFloat("orientation",0);
                    S.m_yStart = S.M_getFloat("yStart",0.7);
                    S.m_spacing = S.M_getFloat("spacing",{min:0.3,max:2.5});
                    S.m_strokeMask = (S.M_getFloat("strokeMask",0)??0)*this.upscale;
                    //console.log("Got strokeMask="+S.m_strokeMask);

                    
                    S.m_groups=[];
                    let Gr=this.M_declareSvgGroup('Background',S.m_bgFunc);
                    S.m_groups[S.m_bgFunc]=this.M_getGroupInstance(Gr);
                    var addons = S.M_getVariablePack("addons",["SVGGroup","SVGGroup2"],true);
                    for(let ia=0; ia<addons.length; ia++)
                    {	//console.log(`Background lib : got addons ${RQPrintR(addons[ia])}`);
                        this.M_readSvgGroupVariable(S,addons[ia]);            
                    }
            

                }
                else if(S.m_name=="BackgroundArt")
                    this.M_includeArtwork(S,S.m_variables.artwork);
                else if(S.m_name=="BackgroundGradient")
                {
                    S.m_gradient = new RQColor(S.M_get("css","linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%);"));
                }	
                else if(S.m_name=="BackgroundTexture")
                {
                    S.m_ampl = S.M_getInt("ampl",30);
                    // for M_initOuputImage
                    let isFront = S.M_getBool("isFront",false);
                    let stack = isFront?this.m_fgFilters : this.m_bgFilters;
                    stack.push( function(){ this.M_drawGrain({ampl:S.m_ampl,isFront:isFront})})
                }	
                else if(S.m_name=="BackgroundImage")
                {
                    let isFront = S.M_getBool("isFront",false);
                    let stack = isFront?this.m_fgFilters : this.m_bgFilters;
                    stack.push( function(){ this.M_drawTexture({textureName:S.M_get("texture"),isFront:isFront})});
                    
                }
            }
    

        }
        // Draw background
        // ---------------------        
        PatternAlgorithm.prototype.M_drawBackground = async function(S)
        {        
            if( S.A)
            {  
                S.A.M_initOuputImage();			// will reset the clipping zone of the output canvas
                await S.A.M_startAlgorithm();


            }
            else if( S.m_bgFunc)
            {
                switch(S.m_bgFunc)
                {
                    case "Sky":
                        this.M_drawSkyBackground(S); 
                    break;
                }
            }
            else if(S.m_gradient)
            {
                if(this.m_outputFormat=="PNG" && this.m_outputImage)
                {
                    let ctx = this.m_outputImage.M_getContext();
                    let gradient= S.m_gradient.M_createContextGradient(ctx,new RQVec2(this.W/2,0),new RQVec2(this.W/2,this.H));

                    let lines = this.m_workArea.M_createPolyline().M_getSVGPath();
                    let path = new Path2D(lines);
                    A.m_canvasHeap.push({m:"fill",c:gradient,path:path,l:lines});
                    ctx.fill(path);
                }
            }
            /*else if(S.m_name=="BackgroundTexture")
            {
                    this.M_drawGrain({ampl:S.m_ampl});
            }*/
        }

        // M_drawTexture

        PatternAlgorithm.prototype.M_drawTexture = function(opt)
        {
            let tex = this.M_getTexture(opt.textureName);
            let O = this.m_outputImage;
            if( tex && O)
            {
                let ctx=O.M_getContext();
                ctx.drawImage(tex.m_canvas, 0, 0,this.W, this.H);
            }
        }
        // M_drawGrain
        // ---------------------        
        PatternAlgorithm.prototype.M_drawGrain = function(opt)
        {
            let O = this.m_outputImage;
            if(O)
            {
                let ctx=O.M_getContext();
                //ctx.restore();
                this.M_resetClipping();
                this.M_log("Background : M_drawGrain");
                if(this.m_isMainAlgorithm && opt.ampl>0)
                {	//O.M_fill( this.M_getPaperColor(this.m_paperColor)); 
                    
                    // Fast texturing paper background
                    let scale = this.m_pngUpscale;
                    const shift=100;
                    let W=O.m_width+2*shift,H=shift;
                    let w=W*4;
                    let int=opt.ampl;
                    let s=10;
                    let a=this.M_getPaperArrayRGBA();
                    let k=1;
                    if(!this.bgID)
                    {	let id=this.bgID=new ImageData(W,H);
                        for(let t=0;t<id.data.length;t+=4)
                        {   k=Math.random();
                            let rnd= k>0.3?2*(k-0.5):noise.simplex2((t%w)/w*40,parseInt(t/w)/2+(t%w)/120)
                            if(!opt.isFront)
                            {
                                for(let n=0;n<3;n++)id.data[t+n]= a[n]+int*rnd;
                                id.data[t+3]=255;
                            }
                            else
                            {   
                                for(let n=0;n<3;n++)id.data[t+n]=rnd>0.7?255:0;
                                if(rnd<0) rnd=-rnd;
                                id.data[t+3]=rnd*opt.ampl*2;

                            }
                        }
                        if(opt.isFront)
                        {
                            let c = document.createElement('canvas');
                            var ctx2 = c.getContext('2d');
                            c.width = id.width;
                            c.height = id.height;
                            ctx2.putImageData(id, 0, 0);
                            this.bgIDCanvas=c;
                            
                        }
                    }
                    k=1.302939490309*80000;
                    for(let y=0; y<O.m_height; y+=H)
                    {   let x=-shift+parseInt(shift*Math.cos(y/O.m_height*k));
                        if(this.bgIDCanvas)
                        {   //ctx.globalCompositeOperation = "lighter";
                            ctx.drawImage(this.bgIDCanvas, x/this.m_pngUpscale,y/this.m_pngUpscale, this.bgIDCanvas.width/this.m_pngUpscale,this.bgIDCanvas.height/this.m_pngUpscale);	
                            //ctx.globalCompositeOperation = "source-over";

                        }
                        else
                             ctx.putImageData(this.bgID,x,y);
                    }
               }
            }

        }
        // M_drawSkyBackground
        // ---------------------        
        PatternAlgorithm.prototype.M_drawSkyBackground = function(S)
        {
            //    {S:S kh:S.m_yStart,orientation:S.m_orientation,strokeMask:S.m_strokeMask,color:S.m_strokeColor,spacing:S.m_spacing/*t:"cloud"*/});
            //debugger;

            //this.M_log("Draw sky background "+RQPrintR(opt));
            let kh=1-(S.m_yStart??0);
            let r=new RQRectangle(0,0,this.W,kh*this.H);
            let F = S.m_groups.Sky;
            let u=this.upscale;
            S.m_spacing??={min:0.4,max:2.5}
            //console.log(`F = ${RQPrintR(F)}`);
            let isCloud=S.m_t && S.m_t=="cloud";//TODO
            let Fopt={
                hatchFunc		:isCloud? this.M_hatchFuncCloudLines : this.M_hatchFuncSine,
                m_amplitude		:1*u,
                m_wavelength	:isCloud?{min:4*u,max:100*u}:{min:30*u,max:100*u},
                obbMargin		:3*u+this.m_strokeWidth,
        
                //gp.m_perturbation = this.M_readParametricVariable(vars,"perturbation",1,false);
                spacing			: 1*u,
                //m_lineSpacing
                protect			: 0*u,
                jointEnds		: false,        // TODO : parameters
                alternate       : true,
                orientation		: S.m_orientation??90,
                spacingFunc 	: 	(OBB,x,opt)=>
                    {	let k=1-x/OBB.w;
                        //console.log(`SpacingFunc ${x} ${RQPrintR(opt)}`);
                        return (S.m_spacing.min*k +S.m_spacing.max*(1-k))*this.upscale;	
                    
                    }
                
        
            };
            if(S.m_strokeMask)
            {
                Fopt.strokeMask=S.m_strokeMask;
                console.log("strokeMask = "+Fopt.strokeMask);
            }
            if(isCloud)
            {
                Fopt.m_modulation = {amplitude:10*u,noiseFact:2};
                Fopt.orientation=-90;
                Fopt.m_maskFill=true;
                Fopt.m_groundCut=-1;
                Fopt.m_perturbation = {func:this.M_functionNoise,config:{min:0,max:1,isCustomNoise:true,noiseFact:{x:3,y:5},shift:{x:0,y:0}}}
            }
            //console.log(`Drawing sky with color=${F.m_strokeColor}`);
            this.M_fillShape(F,r.M_createPolyline(),Fopt);
    

        }


    }
};
Backgrounds.sM_register();  // might be a little early ! ( before A constructor )