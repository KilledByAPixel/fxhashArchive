TreesAlgorithm.prototype.M_startAlgorithm=async function()
{
    this.m_stemLinesBack=false;
    this.M_setupCamera({fov:45,zcam:this.W/2})

    // Hook the projection
    PatternAlgorithm.prototype.M_projection = myProjection.bind(this);
    
    // call main algorithm
    await this.M_doTreeAlgorithm().then(
        function(){
            console.log("Ok ! A bugged tree is planted.");
            if(A.fxPreview)
                A.fxPreview();
    
        },
        function(error){console.log("Ooops error in the async function");}
    );

}
PatternAlgorithm.prototype.M_setupCamera = function(Copt)
{
    let C=this.m_cam ={
        fov:Copt.fov??45,
        pos:new RQVec3(this.m_workArea.center().x,this.m_workArea.center().y,Copt.zcam??this.W/2),
        ratio:this.W/this.H,
        near:1,
        far:this.W
     }    
     C.fovTan=Math.tan(C.fov*DEGTORAD); 
     C.Mproj = this.M_makeProjectionMatrixFrustum(C);


}
PatternAlgorithm.prototype.M_makeProjectionMatrixFrustum=function(C)
{   let l=-C.near*C.fovTan,r=-l,b=-C.near*C.fovTan/C.ratio,t=-b;
    if(C.shift)
    {   l+=C.shift.x;
        r+=C.shift.x;
        t+=C.shift.y;
        b+=C.shift.y;
    }

    // Create projection matrix
    let P=new RQMatrix4(),a=P.m_a;
    a[0 ] = 2*C.near/(r-l);
    a[5 ] = 2*C.near/(t-b);
    a[8 ] = (r+l)/(r-l);
    a[9 ] = (t+b)/(t-b);
    a[10] = -(C.far+C.near)/(C.far-C.near);
    a[11] = -1;
    a[12] = 0;
    a[13] = 0;
    a[14] = -2*C.far*C.near/(C.far-C.near);
    a[15] = 0;
    return P;
}

function myProjection(P,Porigin2D)
{
    const iso = false;
    let Pproj,Pref;
    if(iso)
    {   
        Pref= (typeof Porigin2D==="object")? Porigin2D : (A.m_origin2D?A.m_origin2D : new RQVec2(0,this.m_workArea.top()) );
        Pproj = new RQVec2(P.x+Pref.x,Pref.y -P.y + P.z*this.m_perspectiveFactor);
    }
    else
    {   
        

        // wonderful bugged code
        Pref= (typeof Porigin2D==="object")? Porigin2D : (A.m_origin2D?A.m_origin2D : new RQVec2(0,this.m_workArea.top()) );
        Pproj = new RQVec2(P.x+Pref.x,Pref.y -P.y + P.z*this.m_perspectiveFactor);
        let p3= new RQVec3(P.x+Pref.x-this.m_cam.pos.x, -(-P.y+Pref.y-this.m_cam.pos.y),P.z-this.m_cam.pos.z); 
        if(-p3.z > this.m_cam.near)
        {
            let screenP3=this.m_cam.Mproj.M_mutlipliedByVector(p3);
            Pproj=new RQVec2( (0.5-screenP3.x/p3.z*0.5)*this.W , (0.5-screenP3.y/p3.z*0.5)*this.H);
        }

       

    }
    return Pproj;
}


// -------------------------
// M_registerPalette
// -------------------------
PatternAlgorithm.prototype.M_registerPalette=function(variant)
{   this.m_paletteVariants??=[]
    this.m_paletteVariants.push(variant);
    return variant;
}

PatternAlgorithm.prototype.M_applyPaletteVariant=function(world )
{   if(!world) return;
    let log=false;
    // Store the world into the main algorithm
    this.world=world;
    // Function to read settings
    let readColorAndFill=(set,path)=>{
        if(set)
        {   set.path=""; set.path+=path;
            set.strokeColorComputed = set.strokeColor ? this.M_getColor(set.strokeColor):null;
            set.strokeWidthComputed = set.strokeWidth ? set.strokeWidth*this.upscale : null;
            if(log&&set.strokeColorComputed)console.log(`(${path}) got stroke color=${set.strokeColor} => ${set.strokeColorComputed}`)

            if(set.fill)
            {   set.fill.colorComputed = set.fill.color ? this.M_getColor(set.fill.color):null;
                if(log && set.fill.colorComputed)console.log(`(${path}) got FILL color=${set.fill.color} => ${set.fill.colorComputed}`)
            }
        }
    }
    // Function to apply settings to a group
    let applySettings=(F,sets)=>{
        if(F && Array.isArray(sets))
        {
            // stroke width
            for(let i=0; i<sets.length;i++)
            {   if( sets[i] && sets[i].strokeWidthComputed)
                {   F.m_strokeWidth =sets[i].strokeWidthComputed;
                    if(log)console.log(`Applying strokeWidth (priority ${i+1}) : ${F.m_strokeWidth}`);
                    break;
                }
            }
            // stroke color
            for(let i=0; i<sets.length;i++)
            {   if( sets[i] && sets[i].strokeColorComputed)
                {   F.m_paletteTag="custom"; 
                    F.m_strokeColor =sets[i].strokeColorComputed;
                    if(log)console.log(`Applying strokeColor (priority ${i+1}) : ${F.m_strokeColor}`);
                    break;
                }
            }
            
            // stroke active
            for(let i=0; i<sets.length;i++)
            {   if(sets[i] && sets[i].strokeActive!=undefined)
                {
                    F.m_active=sets[i].strokeActive;
                    break;
                    // TODO :reset to default value if needed
                }

            }
            // svgColor
            for(let i=0; i<sets.length;i++)
            {   if(sets[i] && sets[i].svgColor!=undefined && F.m_svgGroup)
                {
                    let strokeColor = sets[i].svgActive===false ? "none":sets[i].svgColor;
                    F.m_svgGroup.setAttribute("style",`stroke:${strokeColor};stroke-linecap:round;stroke-linejoin:round;stroke-width:${F.m_strokeWidth};fill:none`);
                    
                    break;
                   // if(F.m_group)
                }
            }
            // Fill color 
            let Fs=F.fills;
            if( Array.isArray(Fs))
            {   if(log)console.log(`Got array of fills for group ${F.name}`);
                for( let f=0; f<Fs.length; f++)
                {   let fillGroup=Fs[f];
                    let hasSetColor=false;
                    for(let i=0; i<sets.length;i++)
                    {   
                        if(sets[i]&&sets[i].fill)
                        {   fillGroup.m_savedColor??={tag:fillGroup.m_paletteTag,color:fillGroup.m_strokeColor,active:fillGroup.m_active}
                            if(sets[i].fill.colorComputed)
                            {   fillGroup.m_paletteTag="custom"; 
                                fillGroup.m_strokeColor =sets[i].fill.colorComputed;
                                if(log)console.log(`Applying fill color (priority ${i+1}) ${fillGroup.m_strokeColor} active:${fillGroup.m_active} `);
                                hasSetColor=true;
                            }
                            if(sets[i].fill.active!==undefined)
                            {   fillGroup.m_active = sets[i].fill.active;
                                if(log)console.log(`Applying fill active (priority ${i+1}) ${fillGroup.m_active}`);
                                hasSetColor=true;
                            }
                            break;
                        } 
                    }
                    // restore default
                    if((!hasSetColor)&& fillGroup.m_savedColor)
                    {
                        fillGroup.m_paletteTag=fillGroup.m_savedColor.tag; 
                        fillGroup.m_strokeColor =fillGroup.m_savedColor.color;
                        fillGroup.m_active = fillGroup.m_savedColor.active;
                    }
    
                }
            }else
            {
                if(log)console.warn(`no array of fills for group ${F.name} - and F.fill=${F.fill}`);
            }
    
        }
    }

    if(log)console.group(`M_applyPaletteVariant(${world.name})`);
    let settings=[world.tree,world.background]
    let path;
    for(let i=0; i<settings.length;i++)
    {   let set=settings[i];
        if(set)
        {   
            path = ["tree","world"][i];
            if(log)console.log(`Reading set ${path}`);
            readColorAndFill(set,path);

            for(let groupName in set)
            {   if( !["strokeColor","strokeColorComputed","strokeWidth","strokeWidthComputed","fill","path"].includes(groupName))
                {   let path2=path+"/"+groupName;
                    
                    let customSet = set[groupName];
                    if(typeof customSet==="object")
                        readColorAndFill(customSet,path2)
                    else
                        if(log)console.warn(`Not an object at path "${path2}" : ${customSet}`);
                }                                            
            }
        }

    }
    if(true)
    {   

        for(let i=0; i<settings.length;i++)
        {   let set=settings[i];
            if(set)
            {   
                let group=[this.m_groups,0][i];
                if(group)
                for(let n in group)
                {   let F=group[n];
                    if(log)console.group(`group ${n} Nb fill groups=${F.fills? F.fills.length : 0}`);
                    
                    // Fill in a group name if it's missing ( for SVG )
                    if(F.m_svgGroup)
                    {   let s=F.m_svgGroup.getAttribute("name");
                        if((!s)||s.length==0)
                            F.m_svgGroup.setAttribute("name",`${F.bundle}/${F.name}`);
                        if(log)console.log("SvgGoup="+RQPrintR(F.m_svgGroup.getAttribute("name")))

                        if( set.hasOwnProperty(F.name))
                        {
                            applySettings(F,[set[n]])

                        }
                    }
                    
                    
                    
                    if(log)console.groupEnd();
                }
            }
        }
    }
    // Sky 
    if( world.sky && this.m_backgrounds)
    {
        for(let i=0; i<this.m_backgrounds.length; i++)
        {   let B = this.m_backgrounds[i];
            if(B && B.m_name=="BackgroundLib")
            {   let F= B.m_groups.Sky;
                if(F)
                {   if(world.sky.strokeColor) 
                    {   F.m_strokeColor = this.M_getColor(world.sky.strokeColor);
                        F.m_paletteTag="custom";
                    }
                    if(world.sky.strokeWidth) 
                    {   F.m_strokeWidth = world.sky.strokeWidth*this.upscale;
                    }
                }
            }
        }

        //strokeColor

    }
        


    if(log)console.groupEnd();

}

