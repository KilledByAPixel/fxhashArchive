  // M_definePalettes
  PatternAlgorithm.prototype.M_definePalettes=function(paper,isFilled)
  {
    
    const white=(a)=>`rgba(255,255,255,${a})`
    const black=(a)=>`rgba(0,0,0,${a})`
    const _=undefined;
    const defaultTreeLines=(color,branches,stem,feat)=>{
        let a={ Leaves:{fill:{active:false}},BranchFill:{fill:{active:false}}   }
        if(color)
          a.Leaves.strokeColor=color;
          a.Branches={strokeColor:branches??color};
          a.Stem={strokeColor:stem??color};
          a.LeavesFeat={strokeColor:feat??color};

        return a;
      };
      const gradient1="linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(136,163,144,0.7) 40%, rgba(136,163,144,0) 70%)";
      const gradient2="linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(136,163,144,0.7) 40%, rgba(136,163,144,0) 70%), rgba(0,0,0,0.3) 98%)";

      let P={name:"whatever"}
      switch(paper)
      {
          case 'Black':
            P.tree=isFilled?
            {
                  Leaves : {strokeColor:white(0.8),
                            fill:{active:true,color:black(0.6)}},
                  Branches : {strokeColor:white(1), strokeWidth:0.1},
                  BranchFill:{fill:{active:true,color:white(0.1)}},
                  Stem : {strokeColor:white(0.5)}
            } : defaultTreeLines(white(1),white(0.8),white(0.3));
            P.sky={strokeColor:white(0.2)}
            if(!isFilled)
            {
              A.setGradientProperty("activate",false);
              P.tree.Branches.strokeWidth=0.13;
            }
          break;

          case "Red":
            P.tree=isFilled?
            {
              Leaves : {strokeColor:black(0.8),fill:{active:true,color:"rgba(90,0,0,0.3)"}},
              Branches : {strokeColor:black(1), strokeWidth:0.1},
              BranchFill : {fill:{active:true,color:`paper*rgba(${fxrand()<0.5?"255,200,200":"80,0,0"},${0.4*fxrand()})/0.6`}},
              Stem : {strokeColor:white(0.5)}

            }:defaultTreeLines(white(1),_,white(0.5))
            if(!isFilled)
            {
              A.setGradientProperty("activate",false);
              P.tree.Branches.strokeWidth=0.12;
              P.tree.Leaves.strokeWidth=0.05;
              A.setTextureProperty("isFront","false");
            }
            else
            { if( fxrand()<0.35 )
                P.sky={strokeColor:white(0.8)}
            }


            break;
          case "YellowWhite":
          {
            P.tree = isFilled?
              {
                  Leaves : {strokeColor:black(0.8),
                            fill:{active:true,color:black(0.3)}},
                  Branches : {strokeColor:black(1), strokeWidth:0.1},
                  BranchFill : {fill:{active:true,color:`paper`}},
                  Stem : {strokeColor:black(0.5)}
              }:defaultTreeLines(black(1),_,black(0.2))
              if(!isFilled)
              {  A.setGradientProperty("activate",false);
                 P.tree.Branches.strokeWidth=0.15;
                 A.setTextureProperty("ampl",30);
                 A.setTextureProperty("isFront","false");
                }
              else
              { A.setGradientProperty("css",fxrand()>0.5 ? gradient1 :gradient2);
              }

          }
          break;
          case "White":
          if(!isFilled)
          {  P.tree=defaultTreeLines();
            A.setGradientProperty("activate",false);

          }
          else
          { P.tree={BranchFill:{fill:{active:true,color:white(1)}} }
            if(fxrand()<0.3)
                P.tree.Leaves={ fill:{active:true,color:white(1)}}
            let r = fxrand();
            if(r<0.1)
              P.tree.Leaves={fill:{color:"rgba(200,0,0,0.4)"}};
            else if(r<0.4)
                P.tree.BranchFill.fill.color=`paper*${black(0.5)}/0.3`;
          }

          break;
          case "GreyGreen":

            if(!isFilled)
            { let green=(a)=>`rgba(0,40,0,${a})`
              P.tree = defaultTreeLines(green(1),green(1),fxrand()<0.5?green(0.4):white(0.5)); 
              P.tree.Branches.strokeWidth=0.15;
              A.setGradientProperty("activate",true);
              A.setGradientProperty("css",`linear-gradient(90deg, ${white(0)} 20%, ${white(0.3)} 70%)`);
              P.sky={strokeColor:`rgba(0,50,0,0.3)`};
              A.setTextureProperty("isFront","false");
            }
            else
            {  let isGreenLeaves = fxrand()<0.5;
                let green=(a)=>`rgba(0,70,0,${a})`
                P.tree={ BranchFill:{fill:{active:true,color:`paper*${white(0.1)}/0.7`}},
                  Leaves:{fill:{active:true,color:isGreenLeaves? green(0.2) : black(0.05+fxrand()*0.6 )}}
              }
              P.sky={strokeColor: fxrand()<0.5? white(1): black(0.3)}
              A.setGradientProperty("css",`linear-gradient(90deg, rgba(220,255,230,0.3) 20%,  ${green(0.3)} 90%)`);
            }

          break;
          case "Pink":
            {
              let darkPink = (a)=>`rgba(64,10,27,${a})`
            if(!isFilled)
            {   let theme1=fxrand()>0.5;
                P.tree=defaultTreeLines(darkPink(1),theme1?_:darkPink(1),theme1?white(0.4):darkPink(0.3));
                P.tree.Branches.strokeWidth=0.13;
                P.sky=theme1? {strokeColor: darkPink(0.5), strokeWidth:0.15}:{strokeColor: white(1), strokeWidth:0.05}
                A.setGradientProperty("activate",false);
                A.setTextureProperty("ampl",30);
                A.setTextureProperty("isFront","false");

            }
            else
              P.tree={BranchFill:{fill:{active:true, color:"paper"}}}
          }
          break;    

        }  
        this.M_registerPalette(P);
 
  }
