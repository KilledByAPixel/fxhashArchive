  // M_defineWorlds
  PatternAlgorithm.prototype.M_defineWorlds=function(paper)
  {
    
    const white=(a)=>`rgba(255,255,255,${a})`
    const black="rgba(0,0,0,1)"
    const bluebiro="rgba(44,69,203,1)"
    
    switch(paper)
      {
          case 'White':
            this.M_registerWorld("Black",  { 
                bgColor:"paper",
                earthColor:black,
                sky: {strokeColor:black},
                skyPattern : {strokeColor:black},
                plants: {strokeColor:black,fill:{active:false},
            
                    species:{
                        RootsHerb:{ strokeWidth:0.1},
                        RootsBush:{ Branches:{strokeWidth:0.15}},
                        RootsFern:{ Stem:{strokeWidth:0.15}},
                        RootsBigFlower:{ Stamen:{strokeWidth:0.1}},
                        RootsSunflower:{ HeartFeat:{strokeWidth:0.1}}

                    }
                },
                blocks:{
                    strokeColor:black,
                    fill:{active:false},
                    fill:{active:false},
                    colors:{
                        Lines1:{strokeColor:black}}
                }
  
              });
              break;
          case 'Black':
          {  let world=this.M_registerWorld("White",  { 
              bgColor:"paper",
              earthColor:"rgba(255,255,255,0.5)",
              sky: {strokeColor:"rgba(255,255,255,0.8)"},
              skyPattern : {strokeColor:"rgba(255,255,255,1)"}

            });
            world.plants={ strokeColor:white(1),fill:{active:false},
                species:
                {   RootsHerb:{ Herb:{strokeWidth:0.15}},
                    RootsBush:{ Branches:{strokeWidth:0.1}},
                }

            };
            world.blocks={ strokeColor:white(1),strokeActive:false,fill:{active:false}};
            /* // a test with black outlines
            world.blocks={ strokeColor:black,strokeActive:true,fill:{active:false},
              colors: 
              {   Lines1:{strokeColor:"white"}
              }
            }*/
            world.yazid={ strokeColor:white(1),fill:{active:false}};
          }
            break;
          case 'Blue':
          { 
            let skyPattern = {strokeColor: (fxrand()<0.7?"rgba(0,0,0,0.8)":"rgba(255,255,255,0.6)")};  
            let world=this.M_registerWorld("Black",
            { bgColor:"paper", earthColor:white(1), skyPattern: skyPattern});
            world.plants={ strokeColor:black, fill:{active:false}};
            world.blocks={ strokeColor:white(1),fill:{active:false}};
            world.yazid={ strokeColor:white(1),fill:{active:false}};

            world=this.M_registerWorld("White",  { bgColor:"paper", earthColor:black,skyPattern: skyPattern});
            world.plants={ strokeColor:white(1), fill:{active:false}};
            world.blocks={ strokeColor:black,fill:{active:false}};
            world.yazid={ strokeColor:white(1),fill:{active:false}};
          }
            break;
          
          // RED
          case 'Red':  /*almost white*/
          { 
            let red=(a)=>`rgba(200,0,15,${a})`;
            let mediumred=(a)=>`rgba(150,0,10,${a})`;
            let darkred=(a)=>`rgba(50,0,10,${a})`;
            let gradient1= `linear-gradient(90deg, ${white(0.1)}  0%, ${red(0.5)} 40%, ${hexToRGBA("#C23C3CB0")} 100%)`;
            let gradient2= `linear-gradient(90deg, ${red(0.1)}  0%, ${white(0.8)} 60%)`;
            A.m_allowLiveFillShape=true;
            let  world=this.M_registerWorld("Red",
            {
                bgGradient  : gradient2,
                bgColor     :false?"paper/0.4":`paper*${white(0.9)}`,
                earthColor  : mediumred(0.8),
                sky         : {strokeColor:darkred(0.9)},
                skyPattern  : {strokeColor:mediumred(0.9)},
                plants      :
                { 
                    fill:{active:false},
                    species:
                    {
                        RootsBigFlower:{
                            Petals : {fill:{color:white(0.4), active:true}},
                            Hearts : {fill:{color:red(0.4), active:true}},
                            HeartFeat : {fill:{color:red(0.7), active:true}},
                            Stamen : {strokeColor:darkred(0.9),strokeWidth:0.1}
                        },
                        RootsSunflower:{
                            Petals : {fill:{color:white(0.4), active:true}},
                            Hearts : {fill:{color:red(0.5), active:true}},
                            HeartFeat : {fill:{color:red(0.2), active:true}},
                            Leaf   : {strokeColor:mediumred(1) , fill:{color:`paper*${white(0.5)/0.3}`, active:true}},
                        },
                        RootsBush:{
                            Fruits : {fill:{color:`${red(0.4)}`, active:true}},
                            Branches : {strokeColor:darkred(0.7),fill:{color:white(0.4), active:true}}
                        },
                        RootsFlower:{
                            Petals : {fill:{color:red(0.7), active:true}},
                            Hearts : {fill:{color:white(0.5), active:true}},
                        },
                        RootsHerb:{
                            Herb : {strokeColor:darkred(0.8), fill:{color:"paper/0.2", active:true}}
                        },
                        RootsFern:{
                            //Leaf : {strokeColor:black, fill:{color:`paper*${white(0.4)}/0.3`, active:true}}
                            Leaf : {strokeColor:black, fill:{color:`${red(0.2)}`, active:true}},
                            Stem : {strokeColor:mediumred(0.7), fill:{color:white(0.5), active:true}}
                        }
                    }
                
                },
                blocks:{
                    strokeColor:mediumred(1),
                    fill:{active:true, color :`paper*${white(1)}/0.8`},
                    colors:{
                        Lines1 : {strokeColor:red(0.9)},
                        Lines2 : {strokeColor:red(0.3)}
                    }
                }
            });
          }
            break;
          // SKETCHBOOK
          case 'YellowWhite':
          {  
            let world=this.M_registerWorld("Green", 
            {
                bgColor:"paper",
                earthColor:"rgba(0,0,0,0.5)",
                earthFill:{active:true,color:"paper"},
                sky:{strokeColor:"rgba(20,100,0,0.8)"},
                skyPattern : {strokeColor:"rgba(20,100,0,0.8)"},
                plants:{
                  strokeColor:"rgba(30,40,0,0.8)",
                  fill:{color:"paper"}
                },
                blocks: 
                {
                    fill:{color:"paper*rgba(255,255,230,0.8)"},
                    strokeColor:"rgba(20,80,0,0.8)",
                    colors: 
                    {   Lines1:{strokeColor:"white"},
                        Lines2:{}

                    }
              
                }
            });          
            world=this.M_registerWorld("Red", 
            {
                bgColor:"paper",
                earthColor:"rgba(100,20,0,0.8)",
                earthFill:{active:true,color:"paper"},
                sky:{strokeColor:"rgba(100,20,0,0.8)"},
                skyPattern : {strokeColor:"rgba(170,20,0,0.2)"},
                plants:{
                  strokeColor:"rgba(30,40,0,0.8)",
                  fill:{active:false}
                },
                blocks: 
                {
                    fill:{active:false},
                    strokeColor:"rgba(170,20,0,1)",
                    colors: 
                    {   Lines1:{strokeColor:"white"},
                        Lines2:{}

                    }
              
                }
            });   
            world=this.M_registerWorld("Blue", 
            {
                bgColor:"paper",
                earthColor:"rgba(0,0,40,0.7)",
                earthFill:{active:true,color:"paper"},
                sky:{strokeColor:"rgba(0,20,100,0.8)"},
                skyPattern : {strokeColor:"rgba(0,20,100,0.8)"},
                plants:{
                  strokeColor:"rgba(30,40,40,0.8)",
                  fill:{color:"paper"},
                  species :{
                    RootsBigFlower : {
                        HeartFeat: { fill:{color:"paper*rgba(180,180,250,0.5)",active:true}}
                    },
                  }
              },
                blocks: 
                {
                    fill:{color:"paper*rgba(240,255,250,0.8)"},
                    strokeColor:"rgba(0,20,120,0.8)",
                    colors: 
                    {   Lines1:{strokeColor:"white"},
                        Lines2:{}

                    }
              
                }
            });                    
          }
            break;
          // GREEN
          //--------------------
          case 'GreyGreen':
          { let greenLines="#003000";
            
          
              // Line art 
              let world=this.M_registerWorld("LineArt",{
                bgColor:"paper",
                earthColor:greenLines,
                plants: {
                    strokeColor:greenLines,
                    fill:{color:"paper",active:true}
                },
                blocks : {
                    strokeColor:greenLines,
                    fill:       {color:"paper",active:true},
                    colors:     {
                        Lines1 : { strokeColor:"white"}
                    }
                }              
              
              })
          
              
            // Green filled
            world=this.M_registerWorld("Chlorophyll",{
                bgGradient: "linear-gradient(90deg, rgba(9,121,19,0)  0%, rgba(197,252,196,0.5) 50%)",
                bgColor:"paper",
                earthColor:greenLines,
                plants: {
                    strokeColor:greenLines
                },
                blocks : {
                    strokeColor:greenLines,
                    fill:       {color:"paper*rgba(0,0,0,0.2)"},
                    colors:     {
                        Lines1 : { strokeColor:"white"}
                    }
                }              
              
              });

              // Cotton green
              world=this.M_registerWorld("CottonGreen",{
              bgColor:"paper*rgba(255,255,255,0.1)",
              earthColor:"rgba(0,40,0,0.8)",
              sky:"rgba(255,255,255,0.8)",
              plants : {
                  strokeColor :"rgba(0,40,0,0.8)",
                  fill        :{color:"rgba(255,255,255,0.3)", active:true},
              
                  species :{
                      RootsSunflower : {
                          Hearts: { fill:{color:"rgba(0,80,0,0.5)",active:true}}
                      },
                      RootsFern:{
                          Branches:{fill:{color:"paper"},active:true},
                          Leaf:{fill:{color:"rgba(255,255,255,0.3)"}}
                      },
                      RootsFlower:{
                          fill:{color:"white"},
                          Hearts:{ fill:{color:"rgba(0,80,0,0.5)",active:true}}
                      }
                  }
              },
              blocks: {
                  strokeColor: 0?"rgba(0,60,0,0.99)":"rgba(250,255,250,1)",
                  fill:{active:true,color: 0?"paper":1?"paper*rgba(0,60,0,0.7)":0?"paper*rgba(240,255,240,0.2)":"paper"},
              }
            });
          }
          break;
          // PINK 
          //--------------------
          case 'Pink':
          { 
            // White Pink  
            let world=this.M_registerWorld("White",
            { 
                bgColor:"paper*rgba(0,0,0,0.1)",
                earthColor:"rgba(255,255,255,0.5)",
                blocks:{
                    strokeColor:white(1),
                    fill:{active:true,color:"paper*rgba(80,0,40,0.6)"},
                    colors : {
                        Lines1:{ fill:{ active:true, color:"paper*rgba(80,0,40,0.2)"}},
                        Lines2:{ fill:{ active:true, color:"paper"}}
                    }
                },
                plants:
                {
                    strokeColor:white(1),
                    fill:{active:true,color:`paper*${white(0.6)}/0.2`},
                    species : {
                        RootsFern     : { strokeColor:"rgba(80,0,40,0.8)",fill:{color:`paper*${white(0.8)}/0.7`,active:true}},
                        RootsBush     : { strokeColor:"rgba(80,0,40,0.8)",fill:{color:`paper*${white(0.8)}/0.7`,active:true}},
                        RootsHerb     : { strokeColor:"rgba(80,0,40,0.8)",fill:{color:`paper*${white(0.8)}/0.3`,active:true}}
                        }
                }
            });
            
            
            // Black Pink
            world=this.M_registerWorld("Black",  { bgColor:"paper", earthColor:"rgba(0,0,0,0.9)"});          
            world.plants={  strokeColor:black,fill:{active:false}};
            world.blocks={ strokeColor:black, fill:{active:false}};
          }
          break;

          // MONDRIAN
          //--------------------
          case 'Mondrian':  
          { 
            A.m_worldsMixable = false;
            let colors={
                blue    :(a)=>`rgba(34,80,149,${a})`,
                red     :(a)=>`rgba(221,1,0,${a})`,
                yellow  :(a)=>`rgba(253,184,39,${a})`,
                white   :(a)=>`rgba(241,241,241,${a})`,
                black   :(a)=>`rgba(35,18,11,${a})`
            }
            let world;
        
            // Mondrian line art
            if(false)
            {
                world=this.M_registerWorld("LineArt",  { 
                bgColor:"paper", 
                earthColor:"rgba(35,18,11,0.3)",
                sky:"rgba(35,18,11,0.3)",
                skyPattern:"rgba(35,18,11,0.3)"});
                
                world.plants={ 
                strokeColor:black,
                fill:{active:false,color:"rgba(18,119,64,0.2)"} // green
                };
                world.blocks={
                strokeColor:black,
                fill:{active:false,color:"paper"},
                colors: {
                    Lines1 : { strokeColor: colors.red(1)}, // red
                    Lines2 : { strokeColor: colors.blue(1)}, // blue 
                    Lines3 : { strokeColor: colors.yellow(1)}, // yellow
                    Lines4 : { strokeColor: colors.white(1)}, // "white"
                    Lines5 : { strokeColor: colors.black(1)}, // "black"
                }
                };

            }
            
            
            // Mondrian filled
            world=this.M_registerWorld("Colorful",
            { 
                earthColor:"rgba(35,18,11,0.3)",
                bgColor:"paper", 
                sky:"rgba(35,18,11,0.3)",
                skyPattern: {strokeColor: rndRange([colors.blue(1),colors.red(1),colors.yellow(1)],fxrand)}, 
                plants:{ 
                    strokeColor:black,
                    fill:{active:true,color:"paper/0.8"},
                    species:
                    {   RootsFern:{ Stem:{strokeWidth:0.1}},
                        RootsBush:{ Branches:{strokeWidth:0.1}},
                        RootsBigFlower:{ Stamen:{strokeWidth:0.1}},
                        RootsHerb:{ Herb:{strokeWidth:0.15}},
                    }
                },
                blocks:{
                    strokeColor:black,
                    strokeActive:true,
                    colors: {
                        Lines1 : { strokeColor:colors.red(1),           fill:{active:true,color:`paper*${colors.red(0.3)}`}}, // red
                        Lines2 : { strokeColor:colors.blue(1),          fill:{active:true,color:`paper*${colors.blue(0.5)}/0.8`}}, // blue 
                        Lines3 : { strokeColor:colors.yellow(1),        fill:{active:true,color:`paper*${colors.yellow(0.2)}`}}, // yellow
                        Lines4 : { strokeColor:"rgba(255,255,255,1.0)", fill:{active:true,color:"paper*rgba(0,0,0,0.1)"} }, // "white"
                        Lines5 : { strokeColor:"rgba(255,255,255,0.8)"   , fill:{active:true,color:"rgba(0,0,0,1)"}}, // "black"
                    }
                }
            });

          }
          break;
          
          // RISOGRAPH
          //--------------------
          case 'Risograph':  
          { 
            A.m_worldsMixable = false;
            let colors={
                cyan    :(a)=>`rgba(0,126,233,${a})`,
                magenta :(a)=>`rgba(252,114,225,${a})`,
                yellow  :(a)=>`rgba(240,229,77,${a})`,
                black   :(a)=>`rgba(42,44,56,${a})`,
                green   :(a)=>`rgba(93,185,138,${a})`,
                grey    :(a)=>`rgba(146,146,146,${a})`,
            }
            let world;
            
            
            // CMYK filled
            world=this.M_registerWorld("CMYK",
            { 
                earthColor:colors.black(0.6),
                bgColor:"paper", 
                sky:colors.black(0.2),
                skyPattern: {strokeColor: colors.black(0.3)}, 
                plants:{ 
                    strokeColor:colors.green(0.7),//"paper/0.5",
                    fill:{active:true,color:colors.green(0.2)}, //color:"paper/0.8"} 
                    species : {
                      RootsFern: {
                        Stem        : { strokeColor:colors.green(0.9)}
                      },
                      RootsHerb     : { strokeColor:colors.green(0.6),fill:{color:"paper/0.2",active:true}},
                      RootsBush     : { strokeColor:colors.green(0.4),fill:{color:"paper/0.4",active:true}}
                    }
                },
                blocks:{
                    strokeColor:"paper/0.3",
                    // strokeColor:colors.grey(0.2),//"paper/0.2",
                    strokeActive:true,
                    colors: {
                      /*
                        Lines1 : { strokeColor:colors.cyan(0.8),           fill:{active:true,color:`paper*${colors.cyan(0.9)}`}}, 
                        Lines2 : { strokeColor:colors.magenta(0.8),          fill:{active:true,color:`paper*${colors.magenta(0.9)}`}},
                        Lines3 : { strokeColor:colors.yellow(0.8),        fill:{active:true,color:`paper*${colors.yellow(0.9)}`}}, 
                        Lines4 : { strokeColor:colors.black(0.8),           fill:{active:true,color:`paper*${colors.black(0.9)}`}},
                        */
                        Lines1 : { strokeColor:colors.cyan(0.8),           fill:{active:true,color:colors.cyan(0.5)}}, 
                        Lines2 : { strokeColor:colors.magenta(0.8),          fill:{active:true,color:colors.magenta(0.5)}}, 
                        Lines3 : { strokeColor:colors.yellow(0.8),        fill:{active:true,color:colors.yellow(0.5)}}, 
                        Lines4 : { strokeColor:colors.black(0.8),           fill:{active:true,color:colors.black(0.5)}}, 
                    }
                }
            });

          }
          break;

          // ANDY'S FLOWERS
          //--------------------
          case 'AndyFlowers':  
          { A.m_allowLiveFillShape = true;

            let world=this.M_registerWorld("Black",  
            { 
            bgColor:"paper", 
            earthColor:"rgba(116,188,78,0.6)",
            sky:{strokeColor:"rgba(255,255,255,0.3)"},
            skyPattern:{strokeColor:"rgba(255,255,255,0.3)"},
            plants : {
              strokeColor :"rgba(0,0,0,0.0)",
              fill        :{color:"rgba(116,188,78,0.7)", active:true},
          
              species :{
                  RootsSunflower : {
                    fill:{color:"rgba(253,194,58,0.8)", active:true},
                      // Hearts: { fill:{color:"rgba(0,80,0,0.5)",active:true}}
                  },
                  RootsFern:{
                    fill:{color:"rgba(145,134,202,0.8)", active:true},
                      // Branches:{fill:{color:"paper"},active:true},
                      // Leaf:{fill:{color:"rgba(255,255,255,0.3)"}}
                  },
                  RootsFlower:{
                      fill:{color:"rgba(255,48,139,0.8)", active:true},
                      // Hearts:{ fill:{color:"rgba(0,80,0,0.5)",active:true}}
                  },
                  RootsBigFlower:{
                    fill:{color:"rgba(253,194,58,0.8)", active:true},
                  },
                  RootsBush:{
                      fill:{color:"rgba(255,48,139,0.8)", active:true},
                  }
              }
            },
            }
          );
          world.blocks={
            strokeColor:hexToRGBA("#f1ede4"),
            fill:{color:hexToRGBA("#161616")},
            // colors: {
              // Lines1 : { strokeColor:"rgba(221,1,0,0.8)"}, // red
              // Lines2 : { strokeColor:"rgba(34,80,149,0.8)"}, // blue 
              // Lines3 : { strokeColor:"rgba(253,184,39,0.8)"}, // yellow
              // Lines4 : { strokeColor:"rgba(241,241,241,0.8)"}, // "white"
              // Lines5 : { strokeColor:"rgba(35,18,11,0.8)"}, // "black"
            // }
          };
          } 
          // BIRO DRAWING
          //--------------------
          break;
          case 'Cream':
          { let world=this.M_registerWorld("Cream",  { 
              bgColor:"paper",
              earthColor:bluebiro,
              sky: {strokeColor:bluebiro},
              skyPattern : {strokeColor:bluebiro}
            });
            world.plants={ strokeColor:bluebiro,fill:{active:false}};
            world.blocks={ strokeColor:bluebiro,fill:{active:false}};
          }
          break;
      }  

      //  RootsSunflower : Hearts, Petals, Stem, Leaf
 
  }
