// Copyright © 2022 Brian Gawlik
// See LICENSE.txt for license information

function drawAll_forThisLevel(level) {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////// MASTER PRNG and SEED
    var fxrand = sfc32(...hashes)
    myrng = fxrand;
    seed = fxhash;


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////// Re-get the project params
    //////////////////////////////////////////////////////////////////////////////////// PALETTE SELECT
    let pIndex = chooseFromArray([0,0,0, 1,1,1, 2, 3,3]);
    // pIndex = 3;
    //////////////////////////////////////////////////////////////////////////////////// SCENE SELECT
    let sceneN = getRandomInt(1,6);
    // sceneN = 4;
    //////////////////////////////////////////////////////////////////////////////////// FLIP SELECT
    let flipOn = makeChoice(50);
    //////////////////////////////////////////////////////////////////////////////////// FOG SELECT
    let fogProb_Array = [30,30,0,30]
    let fogProb = fogProb_Array[pIndex]
    let fogOn = makeChoice(fogProb);
    // fogOn = 1;
    //////////////////////////////////////////////////////////////////////////////////// OTHER PARAMS
    let sky_yRange = getRandomFloat(0.5,0.8);
    let yRange_Water = getRandomFloat(0.07,0.12);
    let nFlowers = getRandomInt(3000,6000);
    let waterType = getRandomInt(1,2);











    

    /////////////////////////////////////////////////////////////////////////////////////////////////////// PARAMS
    let scaleThing  = 0.60 // just leave this...



    ////////////////////////////////// PALETTE STUFF
    let pallette = [];
    
    pallette[0] = { FG:[75,55,20], MG:[75,55,25] }  // Lush
    pallette[1] = { FG:[47,55,20], MG:[50,45,25] }  // Autumn2
    pallette[2] = { FG:[45,35,6], MG:[40,35,14] }  // Autumn Dusk
    pallette[3] = { FG:[75,55,12], MG:[75,55,10] }  // Evening
    


    ////////////////////////////////// SKY PARAMS
    let skyHues = [190, 190, 210, 190];
    let skySats = [ 50,  50,  50,  50];
    let skyLits = [ 55,  70,  10,  10];



    
    ////////////////////////////////// WATER PARAMS
    let waterHues = [];
    let waterSats = [];
    let waterLits = [];

    // console.log("waterType",waterType)
    
    if( waterType == 1 ) {
        waterHues = [ 190, 190,  53,  83];
        waterSats = [  50,  50,  11,  25];
        waterLits = [  55,  70,  52,  60];
    } else if ( waterType == 2 ) {
        waterHues = [ 190,  63, 190,  83];
        waterSats = [  40,  20,  11,  25];
        waterLits = [  55,  65,  40,  60];
    }




    ////////////////////////////////// TERRAIN PARAMS
    let [hueGrass_FG, satGrass_FG, litGrass_FG] = pallette[pIndex].FG
    let [hueGrass_MG, satGrass_MG, litGrass_MG] = pallette[pIndex].MG

    let nEllipses   = 16000
    let nGrass      = 6000 // 20000
    let rMax        = 0.05    
    let alphaDirt   = 150

    ///////////// flowers
    let hueFlower0_Array = [  35,  35,  35,   190] 
    let satFlower0_Array = [  80,  80,  80,    50] 
    let litFlower0_Array = [  60,  60,  40,    60]

    let nFlowers2 = nFlowers;
    let hueFlower0 = hueFlower0_Array[pIndex];
    let satFlower0 = satFlower0_Array[pIndex];
    let litFlower0 = litFlower0_Array[pIndex];



    ////////////////////////////////// FOG PARAMS
    let fogAlpha_MG_Array = [30,30,10,10];
    let fogAlpha_MG = fogAlpha_MG_Array[pIndex];

    let fogAlpha_FG_Array = [10,0,5,5];
    let fogAlpha_FG = fogAlpha_FG_Array[pIndex];



    ////////////////////////////////// TREE PARAMS
    // let leafHue0s = [0, 75, 35, 75, 75, 75];
    let leafHue0s = [75, 30, 30, 75];
    let leafSat0s = [50, 45, 45, 50];
    // let leafLit0s = [30, 50, 50, 99, 30, 5];
    let leafLitMinTz_Array = [30, 30, 0, 0];
    let leafLitMaxTz_Array = [40, 40, 10, 10];

    let litHighlightAdder_Array = [8,8,6,6]
    let litHighlightAdder = litHighlightAdder_Array[pIndex];

    leafLitMinTz = leafLitMinTz_Array[pIndex];
    leafLitMaxTz = leafLitMaxTz_Array[pIndex];

    leafLitMinTz_MG = leafLitMinTz;
    leafLitMaxTz_MG = leafLitMaxTz;

    leafLitMinTz_FG = leafLitMinTz;
    leafLitMaxTz_FG = leafLitMaxTz;

    // grab the leaf color for FG and MG algs
    let leafHue0 = leafHue0s[pIndex];
    let leafSat0 = leafSat0s[pIndex];
    let leafLit0_farGround = leafLitMinTz;

    // Leaf Probs are also palette dependent
    leafOnProb_Array = [100,100,100,100]
    leafOnProb = leafOnProb_Array[pIndex]

    



    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// SCENE Stuff
    let yMax_MG 

    let min1; let max1; let min2; let max2;

    // common parameters
    let nTreeLevels_FG = 6;
    let nTreeLevels_MG =  5;
    let nTreeLevels_farGround = 4;
    // let leafProb_FG = 90;
    let treeAngleRangeD = 30; //30
    let tzTreeRecessFron_FG = 0.55
    let tzTreeRecessBack_FG = 0.01
    let tree_thetaD1 = 90;
    let shootProb0_FG = 50;//50
    
    let treeAlpha = 255;
    let shadowAlpha = 35;
    let grassAlpha = 115;
    let blurLandOn = 1;
    let blurTreesOn = 1;
    let nWaterEllipses = 1000; // 500
    let waterDetails = 1;

    let nEllipsesFront = 8;

    let yRange_Water2 = yRange_Water;


    

    let txChoices_FG; let txTreeJitterMax_FG;
    let txChoices_MG; let txTreeJitterMax_MG;
    let txChoices_farGround; let txTreeJitterMax_farGround;


    // let nFlowers2 = getRandomInt(1000,6000);
    // let nFlowers2_Array = [1000,3500,6000];//6000
    // let nFlowers2 = nFlowers2_Array[flowPow];//6000
    

    
    

    /////////////////////////////////////////////////////////////////////////////////////////// SCENE 1
    if(sceneN==1) {

        leafLitMinTz_MG_Array = [30, 30, 20, 0];
        leafLitMaxTz_MG_Array = [40, 40, 30, 10];

        leafLitMinTz_FG_Array = [20, 30, 12, 12];
        leafLitMaxTz_FG_Array = [15, 20, 5,   5];

      treeScale0_farGround = 0.05 // 0.05
      treeScale0_MG = 0.20 // 0.15
      treeScale0_FG = 2.5; // 1.3

      nFlowers2 = 6000;
      
      nTreeLevels_FG = 7;
      nTreeLevels_MG =  6;
      leafProb_FG = 35 // **notice the 7 level tree with the reduced leafProb. 35
      
    //   nTreeLevels_MG = 5;
      
      yMax_MG = 0.50;
      yRange_MG = getRandomFloat(0.02,0.10);

      nTrees_FG = 3
      txChoices_FG = [0.10,0.95,1.00]//0.75
      txTreeJitterMax_FG = 0.01
      tzTreeRecessFron_FG = 0.70
      tzTreeRecessBack_FG = 0.10
      tree_thetaD1 = 90//105
      tzFracChoices_FG = [0.98,0.98,0.50]

      nTrees_MG = 8//36
      min1 = 0.18
      max1 = 0.55 // 0.40
      min2 = 0.75
      max2 = 0.83
      let txChoicesL = evenlySpacedInterval(min1,max1,Math.round(nTrees_MG/2))
      let txChoicesR = evenlySpacedInterval(min2,max2,Math.round(nTrees_MG/2)) 
      txChoices_MG = txChoicesL.concat(txChoicesR)        
      txTreeJitterMax_MG = (max1-min1)/(nTrees_MG-1)*0.33

      nTrees_farGround = 96
      min1 = 0.10
      max1 = 0.90
      txChoices_farGround = evenlySpacedInterval(min1,max1,nTrees_farGround)  
      txTreeJitterMax_farGround = (max1-min1)/(nTrees_farGround-1)*0.33;


    /////////////////////////////////////////////////////////////////////////////////////////// SCENE 2
    } else if (sceneN==2) {


        leafLitMinTz_MG_Array = [30, 30, 15,  0];
        leafLitMaxTz_MG_Array = [40, 40, 25, 10];

        leafLitMinTz_FG_Array = [30, 30, 15, 10];
        leafLitMaxTz_FG_Array = [20, 20,  5,  0];

        treeScale0_farGround = 0.07
        treeScale0_MG = 0.19; // 0.19
        treeScale0_FG = 2.1; // 2.3
        
        yMax_MG = 0.46; // 0.50
        yRange_MG = getRandomFloat(0.02,0.10);

        nTreeLevels_FG = 7;
        nTreeLevels_MG = 6;
        leafProb_FG = 15 // 35 **notice the 7 level tree with the reduced leafProb

        // nTrees_FG = getRandomInt(4,6); // 6
        nTrees_FG = 3;
        [min1,max1] = [0.60,1.00];                
        txChoices_FG = evenlySpacedInterval(min1,max1,nTrees_FG)
        // txChoices_FG = [0.65,0.90];
        // txTreeJitterMax_FG = (max1-min1)/(nTrees_FG-1)*0.15;
        txTreeJitterMax_FG = 0.03;
        tzFracChoices_FG = evenlySpacedIntervalRand( tzTreeRecessFron_FG, 1-tzTreeRecessBack_FG, nTrees_FG);

        // console.log("tzFracChoices_FG",tzFracChoices_FG)

        nTrees_MG = 6; // 6
        [min1,max1] = [0.15,0.50];
        txChoices_MG = evenlySpacedInterval(min1,max1,nTrees_MG)
        txTreeJitterMax_MG = (max1-min1)/(nTrees_MG-1)*0.33;

        nTrees_farGround = 24;//36
        [min1,max1] = [0.10,0.60];
        [min2,max2] = [0.82,0.83];
        let txChoicesL = evenlySpacedInterval(min1,max1,Math.round(20))
        let txChoicesR = evenlySpacedInterval(min2,max2,Math.round( 4)) 
        txChoices_farGround = txChoicesL.concat(txChoicesR)    
        txTreeJitterMax_farGround = (max1-min1)/(nTrees_farGround-1)*0.33;

    /////////////////////////////////////////////////////////////////////////////////////////// SCENE 3
    } else if (sceneN==3) {

        leafLitMinTz_MG_Array = [30, 30, 20,  0];
        leafLitMaxTz_MG_Array = [40, 40, 30, 10];

        leafLitMinTz_FG_Array = [25, 26, 15, 10];
        leafLitMaxTz_FG_Array = [15, 15,  5,  0];

        treeScale0_farGround = 0.05
        treeScale0_MG = 0.17 // 0.13
        treeScale0_FG = 1.9;//1.8

        nTreeLevels_FG = 7;
        nTreeLevels_MG = 6;
        leafProb_FG = 15
        
        yMax_MG = 0.50;
        yRange_MG = getRandomFloat(0.02,0.10);

        nTrees_FG = 4;
        txChoices_FG = [0.00,0.15,0.30,1.00];
        txTreeJitterMax_FG = 0.02;
        // tzFracChoices_FG = [0.98,0.78]
        tzFracChoices_FG = evenlySpacedIntervalRand( tzTreeRecessFron_FG, 1-tzTreeRecessBack_FG, nTrees_FG);
        tzFracChoices_FG[3] = 0.95;

        nTrees_MG = 12;//12
        [min1,max1] = [0.00,0.57];//0.67
        txChoices_MG = evenlySpacedInterval(min1,max1,nTrees_MG);
        let txChoices_MG_R = [0.85,0.85]
        txChoices_MG = txChoices_MG.concat(txChoices_MG_R);
        nTrees_MG = nTrees_MG + txChoices_MG_R.length;
        txTreeJitterMax_MG = (max1-min1)/(nTrees_MG-1)*0.33;

        nTrees_farGround = 36;
        [min1,max1] = [0.00,0.80];
        txChoices_farGround = evenlySpacedInterval(min1,max1,nTrees_farGround);
        txTreeJitterMax_farGround = (max1-min1)/(nTrees_farGround-1)*0.33;

    /////////////////////////////////////////////////////////////////////////////////////////// SCENE 4
    } else if (sceneN==4) {

        leafLitMinTz_MG_Array = [ 30, 30, 20,  10];
        leafLitMaxTz_MG_Array = [ 40, 40, 30,  20];
        leafLitMinTz_FG_Array = [ 30, 30, 20,  10];
        leafLitMaxTz_FG_Array = [ 20, 20, 10,   0];

        nFlowers2 = 6000;

        yRange_Water2 = 0.12;//0.12

        treeScale0_farGround = 0.05
        treeScale0_MG = 0.19
        treeScale0_FG = 1.9;//1.7

        nTreeLevels_FG = 7;
        nTreeLevels_MG = 6;

        leafProb_FG = 5; 
        
        yMax_MG = 0.55;//0.50
        yRange_MG = getRandomFloat(0.02,0.05);//0.10
        yRange_MG = 0.05

        // nTrees_FG = chooseFromArray([4,6,8]); // 8
        nTrees_FG = 6;//4
        min1 = 0.00;
        max1 = 1.00;
        txChoices_FG = evenlySpacedInterval(min1,max1,nTrees_FG);
        txTreeJitterMax_FG = (max1-min1)/(nTrees_FG-1)*0.15;
        tzFracChoices_FG = evenlySpacedIntervalRand( tzTreeRecessFron_FG, 1-tzTreeRecessBack_FG, nTrees_FG);

        // nTrees_MG = chooseFromArray([24,48,64]); // 48
        nTrees_MG = 16;//12
        min1 = 0.10 // this applies to farGround, MG, and FG
        max1 = 0.90
        // nTrees_MG = 24; // 48
        txChoices_MG = evenlySpacedInterval(min1,max1,nTrees_MG);
        txTreeJitterMax_MG = (max1-min1)/(nTrees_MG-1)*0.33;

        nTrees_farGround = 48;
        txChoices_farGround = evenlySpacedInterval(min1,max1,nTrees_farGround);
        txTreeJitterMax_farGround = (max1-min1)/(nTrees_farGround-1)*0.33;





    /////////////////////////////////////////////////////////////////////////////////////////// SCENE 5
    } else if (sceneN==5) {

        leafLitMinTz_MG_Array = [ 20, 20, 20,   0];
        leafLitMaxTz_MG_Array = [ 30, 30, 30,  10];
        leafLitMinTz_FG_Array = [ 20, 20, 15,  12];
        leafLitMaxTz_FG_Array = [ 15, 15, 10,   5];

        nFlowers2 = 6000;

      treeScale0_farGround = 0.07
      treeScale0_MG = 0.15
      treeScale0_FG = 2.8;//2.5
      
      nTreeLevels_FG = 7
      leafProb_FG = 15 // **45
      shootProb0_FG = 70;
      nTreeLevels_MG = 6
      nTreeLevels_farGround = 5;
      yMax_MG = 0.30;
      yRange_MG = 0.02; // fixed
    //   leafOnProb = 100; // this looks better with the leaves on

      nTrees_FG = 1;
    //   txChoices_FG = [0.00,0.78];
      txChoices_FG = [0.75, 0.02];
      txTreeJitterMax_FG = 0.01;
    //   tzFracChoices_FG = [0.98,0.78]
      tzFracChoices_FG = [0.88,0.98]

      nTrees_MG = 4;
      txChoices_MG = [0.17, 0.23,0.55,0.83]; //0.40
      txTreeJitterMax_MG = 0.02;

      nTrees_farGround = 24;
      [min1,max1] = [0.10,0.90];
      txChoices_farGround = evenlySpacedInterval(min1,max1,nTrees_farGround);
      txTreeJitterMax_farGround = (max1-min1)/(nTrees_farGround-1)*0.33;


    /////////////////////////////////////////////////////////////////////////////////////////// SCENE 6
    } else if (sceneN==6) {

        leafLitMinTz_MG_Array = [ 30, 30, 20,  0];
        leafLitMaxTz_MG_Array = [ 40, 40, 30, 10];
        leafLitMinTz_FG_Array = [ 30, 30, 15, 10];
        leafLitMaxTz_FG_Array = [ 20, 20,  5,  0];

        treeScale0_farGround = 0.05
        treeScale0_MG = 0.19
        treeScale0_FG = 1.9;//1.7

        nTreeLevels_FG = 7;
        nTreeLevels_MG = 6;

        leafProb_FG = 5; 
        
        yMax_MG = 0.50;
        yRange_MG = getRandomFloat(0.02,0.10);

        nTrees_FG = 5//36
        min1 = 0.00
        max1 = 0.10 // 0.40
        min2 = 0.75
        max2 = 1.00
        let txChoicesL = evenlySpacedInterval(min1,max1,Math.round(2))
        let txChoicesR = evenlySpacedInterval(min2,max2,Math.round(3)) 
        txChoices_FG = txChoicesL.concat(txChoicesR)        
        txTreeJitterMax_FG = (max1-min1)/(nTrees_FG-1)*0.33
        tzFracChoices_FG = evenlySpacedIntervalRand( tzTreeRecessFron_FG, 1-tzTreeRecessBack_FG, nTrees_FG);

        // nTrees_MG = chooseFromArray([24,48,64]); // 48
        nTrees_MG = 12;//12
        min1 = 0.10 // this applies to farGround, MG, and FG
        max1 = 0.90
        // nTrees_MG = 24; // 48
        txChoices_MG = evenlySpacedInterval(min1,max1,nTrees_MG);
        txTreeJitterMax_MG = (max1-min1)/(nTrees_MG-1)*0.33;

        nTrees_farGround = 48;
        txChoices_farGround = evenlySpacedInterval(min1,max1,nTrees_farGround);
        txTreeJitterMax_farGround = (max1-min1)/(nTrees_farGround-1)*0.33;

    }


    leafLitMinTz_MG = leafLitMinTz_MG_Array[pIndex];
    leafLitMaxTz_MG = leafLitMaxTz_MG_Array[pIndex];

    leafLitMinTz_FG = leafLitMinTz_FG_Array[pIndex];
    leafLitMaxTz_FG = leafLitMaxTz_FG_Array[pIndex];

    // if(pIndex==4){
    //     nTreeLevels_FG=6;
    // }




    //////////////////////// ANIMATION STUFF
    if(level==1) {
        nTreeLevels_farGround = 2;
        nTreeLevels_MG        = 2;
        nTreeLevels_FG        = 2;
        nEllipses=0;
        nGrass=0;
        nFlowers2=0;
        nEllipsesFront = 0;
        blurLandOn=0;
        blurTreesOn=0;
        nWaterEllipses = 0;
        waterDetails = 0;
        nTrees_farGround = 0;
    }


    if(level==2) {
        nTreeLevels_farGround = 2;
        nTreeLevels_MG        = 2;
        nTreeLevels_FG        = 2;
        nEllipses=16000;//16000
        // nGrass=0;
        // nFlowers2=0;
        nEllipsesFront = 8;
        // blurLandOn=0;
        // blurTreesOn=0;
        // nWaterEllipses = 500;
        // nTrees_farGround = 0;
    }

    if(level==0) { // TESTER LEVEL
        nTreeLevels_farGround = 2;
        nTreeLevels_MG        = 2;
        nTreeLevels_FG        = 2;
        nEllipses=16000;//16000
        // nGrass=0;
        // nFlowers2=0;
        nEllipsesFront = 8;
        // blurLandOn=0;
        // blurTreesOn=0;
        // nWaterEllipses = 500;
        // nTrees_farGround = 0;
    }


    
    /////////////////////////////////////////////////////////////////////////////////////////// txChoices_FG

   









        ////////////////////////////////////////////////////// LAND PARTITIONING
        
        // let yMax_MG = 0.30;
    
        
    
        // let yRange_MG = getRandomFloat(0.02,0.10);//0.15

        // let yRange_MG = 0.02;
    
        let yMin_MG = yMax_MG - yRange_MG;
    
        // let yRange_MG = 0.10
    
        // let yMin_MG = yMax_MG - yRange_MG
    
        // let yRange_Water2 = getRandomFloat(0.1,0.05);
        
        // yRange_Water2 = 0.12
        // console.log("yRange_Water2",yRange_Water2)
    
        let yMax_FG = yMin_MG - yRange_Water2
    
        let yMin_FG
        let yRange_FG

        if(sceneN==5) {
            yRange_FG = 0.35;
            yMin_FG = yMax_FG - yRange_FG; // change back to 0.0
        } else {
            yMin_FG = 0;
            yRange_FG = yMax_FG
        }

    
        // let yRange_FG = yMin_MG - yRange_Water2 - yMin_FG
        // let yMax_FG = yMin_FG + yRange_FG
    
        
    
    
        terrainAngleD = chooseFromArray( [-4, 4] );
        // terrainAngleD = 4;
        // let nEllipsesFrontMax = 8;
        let Fore2Mid_Ratio = 10;





    blurFxOn = 1;
    


    





    
    

    

    

    
    
    //let tzMax0_Min = 0.40;
    //let tzMax0_Max = 0.70;
    //let tzMax0 = getRandomFloat(tzMax0_Min,tzMax0_Max);
    //let tMaxGrass = (tzMax0-tzMax0_Min)/(tzMax0_Max-tzMax0_Min);

    // let tzMax0 = 0.4;

    //console.log("tzMax0",tzMax0)

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// calc BG
    // myrng = new Math.seedrandom(seed);
    myrng = sfc32(...hashes)
    
    bg = {};
    bg.hue = {value:77}
    bg.sat = {value:20}
    bg.lit = {value:70} 
    // draw_bg(bg)

    

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// calc SKY
    // myrng = new Math.seedrandom(seed);
    myrng = sfc32(...hashes)

    let skyN = 300;
    // [tUnus,skyN] = lin(tLevel,[0,35],[1,300])

    let skyHue = skyHues[pIndex];
    let skySat = skySats[pIndex];
    let skyLit = skyLits[pIndex];

    let skyX0;
    if(terrainAngleD<0)
        skyX0 =  0.7;
    else {
        skyX0 = -0.7;
    }

    // console.log("terrainAngleD",terrainAngleD)
    // console.log("skyX0",skyX0)

    // sky_yRange = getRandomFloat(0.5,0.8) // did you realize this was randomized?
    // sky_yRange = 0.8

    sky = {};
    sky.N = {value:skyN}
    sky.x0 = {value:skyX0}
    sky.xRange = {value: 1/artboardAR + Math.abs(sky.x0.value)*2 } 
    sky.y0 = {value:1}
    sky.yRange = {value:sky_yRange}
    sky.cpL = {value:0.5}
    sky.cpThetaD = {value:29}
    sky.hue = {value:skyHue}
    sky.sat = {value:skySat}
    sky.lit = {value:skyLit}
    sky.alphaMax = {value:255}




        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// calc FOG
        // myrng = new Math.seedrandom(seed);
        myrng = sfc32(...hashes)

        let fogN = 300;
        // [tUnus,fogN] = lin(tLevel,[0,35],[1,300])
    

    
        let fogHue = 190
        let fogSat = 50
        let fogLit = 85
        let fogAlphaMax = fogAlpha_MG   // 90 

    
        let fogX0;
        if(terrainAngleD<0)
            fogX0 = 0.7;
        else {
            fogX0 = 0.3;
        }
    
        let fog_yRange = 1.0
    
        fog = {};
        fog.N = {value:fogN}
        fog.x0 = {value:0}
        fog.xRange = {value: 1/artboardAR + Math.abs(fog.x0.value)*2 } 
        fog.y0 = {value:1}
        fog.yRange = {value:fog_yRange}
        fog.cpL = {value:0.5}
        fog.cpThetaD = {value:29}
        fog.hue = {value:fogHue}
        fog.sat = {value:fogSat}
        fog.lit = {value:fogLit}
        fog.alphaMax = {value:fogAlphaMax}
    


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// calc MOUNTRANGE
    // myrng = new Math.seedrandom(seed);
    myrng = sfc32(...hashes)

    let nMounts = 4;
    // let [,alphaMount_Min] = lin(tMaxGrass,[0,20],[1,50]);
    // let [,alphaMount] = lin(tLevel,[0,255],[1,alphaMount_Min])
    let alphaMount = ( 60 * 4/nMounts );
    let nLevels = 13


    // console.log("alphaMount_Min",alphaMount_Min);
    // console.log("alphaMount",alphaMount);
    //let mountHues = [75,55,35];
    //let mountHue = mountHues[pIndex];

    let mountHue = hueGrass_MG;
    let mountSat = satGrass_MG;
    let mountLit = litGrass_MG;

    let litFade;
    // if(pIndex==3) {
    //     litFade = 100;
    // } else {
        litFade = 75;
    // }

    let mount_y0Delta = 0.06;

    mountRange = {};
    mountRange.seed = {value:seed}
    mountRange.nMounts = {value:nMounts}
    mountRange.y0Delta = {value:mount_y0Delta}
    mountRange.x0 = {value:0}
    mountRange.xRange = {value:1/artboardAR}
    mountRange.y0 = {value: yMin_MG + yRange_MG + mount_y0Delta + 0.05}
    mountRange.yBottom = {value:0}
    mountRange.nLevels = {value:nLevels}
    mountRange.delta0 = {value:0.14}
    mountRange.alpha = {value:alphaMount}
    mountRange.hueStart = {value:mountHue}
    mountRange.satStart = {value:mountSat}
    mountRange.litStart = {value:mountLit}
    mountRange.hueFade  = {value:mountHue}
    mountRange.satFade  = {value:20}
    mountRange.litFade  = {value:litFade}
    mountRange.blurOn = {value:0}
    mountRange.radOffset = {value:0.01}
    mountRange.spread = {value:0.05}
    mountRange.originalOn = {value:1}

    // draw_mountRangeA(mountRange);
    

    //blurPixBez(0.02, 0.01, 0.1, 1, 1);   

    // blurPixBez(0.01, 0.01, 0.01, 1, 1);

    // draw_skyB(sky); // the sky is drawn after the mountaings to give some atmospheric fading
    








    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// calc WATER

    // myrng = new Math.seedrandom(seed+"water");

    water = {};   

    let waterHue = waterHues[pIndex];
    let waterSat = waterSats[pIndex];
    let waterLit = waterLits[pIndex];

    water.nEllipses = {value:nWaterEllipses}

    water.yMin = {value:yMax_FG-0.1}
    // water.yMax = {value: (yMax_MG+yMin_MG)/2}
    // water.yMax = {value: (yMax_MG+yMin_MG)/2 - 0.065 }
    
    water.yMax = {value: yMin_MG }

    // console.log("yMax_MG",yMax_MG)
    // console.log("yMin_MG",yMin_MG)

    water.hue = {value:waterHue}
    water.sat = {value:waterSat}
    water.lit = {value:waterLit}

    water.waterDetails = {value:waterDetails};

    

    



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// calc FARGROUND
    myrng = new Math.seedrandom(seed+"farground");
    // myrng = sfc32(...hashes+"farground")

    scaleMid2Fore = 0.5;

    scaleThing2 = scaleThing/Fore2Mid_Ratio;  

    // console.log("txChoices_farGround",txChoices_farGround)

    farGround = {};
    farGround.seed = {value:seed+"farground"}
    farGround.nTrees = {value:nTrees_farGround}
    farGround.maxEpochs = {value:6}
    farGround.x0 = {value:0}
    farGround.xRange = {value:3.0}
    farGround.yMin = {value:yMax_MG-0.05}
    farGround.yRange = {value:0.01}

    farGround.tzPerEpoch = {value:0.2};
    farGround.tzPerEpochTree = {value:1.0};

    farGround.yOffset = {value:-0.1}
    farGround.lcMax = {value:0.3}
    farGround.thetaDc1 = {value:-35}
    farGround.thetaDc2 = {value:-35}
    farGround.hueBack = {value:hueGrass_MG}
    farGround.satBack = {value:satGrass_MG}
    farGround.litBack = {value:litGrass_MG}
    farGround.txChoices = {value:txChoices_farGround}
    farGround.txTreeJitterMax = {value:txTreeJitterMax_farGround}
    farGround.tzTreeRecessFron = {value:0.10}
    farGround.tzTreeRecessBack = {value:0.00}

    farGround.treeScale0 = {value:treeScale0_farGround} // previously scaleThing2
    farGround.L0 = {value:1.00} // previously 0.65
    farGround.W0 = {value:0.05}
    farGround.nLevels = {value:nTreeLevels_farGround}
    farGround.treeAngleRangeD = {value:treeAngleRangeD}
    farGround.leafOnProb = {value:leafOnProb}
    farGround.leafHue0 = {value:leafHue0}
    farGround.leafSat0 = {value:leafSat0}
    farGround.leafLit0 = {value:leafLit0_farGround}
    farGround.hueTree = {value:26}
    farGround.satTree = {value:15}
    farGround.litTree = {value:4}
    farGround.litHighlightAdder = {value:litHighlightAdder}
    farGround.alpha = {value:treeAlpha}
    farGround.shadowScale = {value:4}
    farGround.shadowAR = {value:16}
    farGround.shadowAngleD = {value:terrainAngleD}
    farGround.shadowAlpha = {value:shadowAlpha}
    farGround.nGrass = {value:0}
    // farGround.PFgrass = {value:4}
    farGround.L0grass = {value:0.050*scaleThing2}
    farGround.W0grass = {value:0.005*scaleThing2}
    farGround.thetaDCenter = {value:125}
    farGround.thetaDRange = {value:45}
    farGround.hueGrass = {value:hueGrass_MG}
    farGround.satGrass = {value:satGrass_MG}
    farGround.litGrass = {value:litGrass_MG}
    farGround.alphaGrass = {value:grassAlpha}
    farGround.nEllipsesFront = {value:0}//nEllipsesFront/scaleMid2Fore
    farGround.nEllipses = {value:nEllipses/scaleMid2Fore}
    farGround.AR = {value:20}
    farGround.rMax = {value:rMax*scaleMid2Fore}
    farGround.alphaDirt = {value:alphaDirt}
    farGround.rotD = {value:terrainAngleD}
    farGround.blurLandOn = {value:blurLandOn}
    farGround.blurScale = {value:0.005}
    farGround.blurTreesOn = {value:blurTreesOn}
    farGround.radOffset = {value:0}
    farGround.spread = {value:0.01}
    farGround.originalOn = {value:1}








    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// calc MIDGROUND
    myrng = new Math.seedrandom(seed+"midground");
    // myrng = sfc32(...hashes+"MG")

    scaleMid2Fore = 0.5;

    scaleThing2 = scaleThing/Fore2Mid_Ratio;





    field_MG = {};
    field_MG.seed = {value:seed+"midground"}
    field_MG.nTrees = {value:nTrees_MG}
    field_MG.maxEpochs = {value:6}
    field_MG.x0 = {value:0}
    field_MG.xRange = {value:3.0}
    field_MG.yMin = {value:yMin_MG}
    field_MG.yRange = {value:yRange_MG}
    // field_MG.tzMax0 = {value:tzMax0+0.05}
    // field_MG.tzRange0 = {value:tzRange0}
    // field_MG.tzRangeBeach = {value:0.05}

    field_MG.tzPerEpoch = {value:0.2};
    field_MG.tzPerEpochTree = {value:1.0};

    field_MG.yOffset = {value:-0.1}
    field_MG.lcMax = {value:0.3}
    field_MG.thetaDc1 = {value:-35}
    field_MG.thetaDc2 = {value:-35}
    field_MG.hueBack = {value:hueGrass_MG}
    field_MG.satBack = {value:satGrass_MG}
    field_MG.litBack = {value:litGrass_MG}
    field_MG.txChoices = {value:txChoices_MG}
    field_MG.txTreeJitterMax = {value:txTreeJitterMax_MG}
    field_MG.tzTreeRecessFron = {value:0.10}
    field_MG.tzTreeRecessBack = {value:0.00}
    // field_MG.xTreeMin = {value:0}
    // field_MG.xTreeRange = {value:1}
    field_MG.treeScale0 = {value:treeScale0_MG} // previously scaleThing2
    field_MG.L0 = {value:1.00} // previously 0.65
    field_MG.W0 = {value:0.05}
    field_MG.nLevels = {value:nTreeLevels_MG}
    field_MG.treeAngleRangeD = {value:treeAngleRangeD}
    field_MG.leafOnProb = {value:leafOnProb}
    field_MG.leafHue0 = {value:leafHue0}
    field_MG.leafSat0 = {value:leafSat0}
    // field_MG.leafLit0 = {value:leafLit0}
    field_MG.leafLitMinTz = {value:leafLitMinTz_MG}
    field_MG.leafLitMaxTz = {value:leafLitMaxTz_MG}
    field_MG.hueTree = {value:26}
    field_MG.satTree = {value:15}
    field_MG.litTree = {value:4}
    field_MG.litHighlightAdder = {value:litHighlightAdder}
    field_MG.alpha = {value:treeAlpha}
    field_MG.shadowScale = {value:4}
    field_MG.shadowAR = {value:16}
    field_MG.shadowAngleD = {value:terrainAngleD}//terrainAngleD
    field_MG.shadowAlpha = {value:shadowAlpha}
    field_MG.nGrass = {value:0}
    // field_MG.PFgrass = {value:4}
    field_MG.L0grass = {value:0.050*scaleThing2}
    field_MG.W0grass = {value:0.005*scaleThing2}
    field_MG.thetaDCenter = {value:125}
    field_MG.thetaDRange = {value:45}
    field_MG.hueGrass = {value:hueGrass_MG}
    field_MG.satGrass = {value:satGrass_MG}
    field_MG.litGrass = {value:litGrass_MG}
    field_MG.alphaGrass = {value:grassAlpha}
    // Flower Props
    field_MG.nFlowers = {value:nFlowers2}
    field_MG.hueFlower0 = {value:hueFlower0}
    field_MG.satFlower0 = {value:satFlower0}
    field_MG.litFlower0 = {value:litFlower0}
    // Terrain Props
    field_MG.nEllipsesFront = {value:0}//nEllipsesFront/scaleMid2Fore
    field_MG.nEllipses = {value:nEllipses/scaleMid2Fore}
    // field_MG.nEllipses = {value:2000}
    field_MG.AR = {value:20}
    field_MG.rMax = {value:rMax*scaleMid2Fore}
    field_MG.alphaDirt = {value:alphaDirt}
    field_MG.rotD = {value:terrainAngleD}
    field_MG.blurLandOn = {value:blurLandOn}
    field_MG.blurScale = {value:0.005}
    field_MG.blurTreesOn = {value:blurTreesOn}
    field_MG.radOffset = {value:0}
    field_MG.spread = {value:0.01}
    field_MG.originalOn = {value:1}

    // if(MG_On==1){
    // draw_fieldH(field)
    
    // }






    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// calc FOREGROUND
    myrng = new Math.seedrandom(seed+"foreground");
    // myrng = sfc32(...hashes+"FG")



    field_FG = {};
    field_FG.seed = {value:seed+"FG"}
    field_FG.nTrees = {value:nTrees_FG}
    field_FG.maxEpochs = {value:6}
    field_FG.x0 = {value:0}
    field_FG.xRange = {value:2.1}
    field_FG.yMin = {value:yMin_FG}
    field_FG.yRange = {value:yRange_FG} // was yRange_FGf
    field_FG.tzPerEpoch = {value:0.2};
    field_FG.tzPerEpochTree = {value:0.5};
    // field_FG.tzPerEpochTree = {value:0.3};
    field_FG.yOffset = {value:-0.1}
    field_FG.lcMax = {value:0.30}
    field_FG.thetaDc1 = {value:-35}
    field_FG.thetaDc2 = {value:-35}
    field_FG.hueBack = {value:hueGrass_FG}
    field_FG.satBack = {value:satGrass_FG}
    field_FG.litBack = {value:litGrass_FG}
    field_FG.txChoices = {value:txChoices_FG}
    field_FG.tzFracChoices = {value:tzFracChoices_FG}
    field_FG.txTreeJitterMax = {value:txTreeJitterMax_FG}
    field_FG.tzTreeRecessFron = {value:tzTreeRecessFron_FG}//0.55
    field_FG.tzTreeRecessBack = {value:tzTreeRecessBack_FG}//0.00
    // field_FG.xTreeMin = {value:xTreeMin}
    // field_FG.xTreeRange = {value:xTreeRange}
    field_FG.treeScale0 = {value:scaleThing*treeScale0_FG}
    field_FG.tree_thetaD1 = {value:tree_thetaD1}
    field_FG.L0 = {value:1.00} // previously 0.65
    field_FG.W0 = {value:0.05}
    field_FG.treeAngleRangeD = {value:treeAngleRangeD}
    field_FG.shootProb0 = {value:shootProb0_FG}

    field_FG.nLevels = {value:nTreeLevels_FG}
    field_FG.leafOnProb = {value:leafOnProb}
    field_FG.leafProb = {value:leafProb_FG}
    field_FG.leafHue0 = {value:leafHue0}
    field_FG.leafSat0 = {value:leafSat0}
    // field_FG.leafLit0 = {value:leafLit0}
    field_FG.leafLitMinTz = {value:leafLitMinTz_FG}
    field_FG.leafLitMaxTz = {value:leafLitMaxTz_FG}
    field_FG.hueTree = {value:26}
    field_FG.satTree = {value:15}
    field_FG.litTree = {value:0}
    field_FG.litHighlightAdder = {value:litHighlightAdder}
    field_FG.alpha = {value:treeAlpha}
    field_FG.shadowScale = {value:8}
    field_FG.shadowAR = {value:16}
    field_FG.shadowAngleD = {value:terrainAngleD}//terrainAngleD
    field_FG.shadowAlpha = {value:shadowAlpha}
    field_FG.nGrass = {value:nGrass}
    // field_FG.PFgrass = {value:4}
    field_FG.L0grass = {value:0.050*scaleThing}
    field_FG.W0grass = {value:0.005*scaleThing}
    field_FG.thetaDCenter = {value:125}
    field_FG.thetaDRange = {value:45}
    field_FG.hueGrass = {value:hueGrass_FG}
    field_FG.satGrass = {value:satGrass_FG}
    field_FG.litGrass = {value:10}
    field_FG.alphaGrass = {value:grassAlpha}
    // FLOWER PROPS
    field_FG.nFlowers = {value:nFlowers2}
    field_FG.hueFlower0 = {value:hueFlower0}
    field_FG.satFlower0 = {value:satFlower0}
    field_FG.litFlower0 = {value:litFlower0}
    // TERRAIN PROPS
    // field_FG.tzPerEpochTerrain = {value:0.2};
    field_FG.nEllipsesFront = {value:nEllipsesFront}
    field_FG.nEllipses = {value:nEllipses}
    field_FG.AR = {value:20}
    field_FG.rMax = {value:rMax}
    field_FG.alphaDirt = {value:alphaDirt}
    field_FG.rotD = {value:terrainAngleD}
    field_FG.blurLandOn = {value:blurLandOn}
    field_FG.blurScale = {value:0.005}
    field_FG.blurTreesOn = {value:0}
    field_FG.radOffset = {value:0}
    field_FG.spread = {value:0.001}
    field_FG.originalOn = {value:1}

    // draw_fieldH(field)



    let loadText_x = 0.0;
    let loadText_y = 0.7;
    let loadText_size = 0.05;
    let loadText_hue = 0;
    let loadText_sat = 0;
    let loadText_lit = 0;


    IMAGES = [] //  reset this for each animation level
    

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// draw BG, Mountains
    ctxToDrawToNow = ctx_aux01;
    ctx_aux01.clearRect(0,0,artboardW,artboardH);
    ctx_aux02.clearRect(0,0,artboardW,artboardH);

    drawLayer( "bg", bg, 0 )
    drawLayer( "mountRangeA", mountRange )

    // drawText("loading...", loadText_x, loadText_y, loadText_size, loadText_hue,loadText_sat,loadText_lit);
    
    if(level!=1) {
        blurPixBez(0.010, 0.01, 0.01, 1, blurFxOn);
        blurPixBez(0.005, 0.01, 0.01, 1, blurFxOn);
    }

    let blurAmount = 3/4096;
    drawTo_ctx_aux02( auxCanvas01, flipOn, blurAmount );
    // let image = {...auxCanvas02};
    // IMAGES.push( auxCanvas02 )
    drawTo_ctx0( auxCanvas02 )

    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// draw Sky
    ctxToDrawToNow = ctx_aux01;
    ctx_aux01.clearRect(0,0,artboardW,artboardH);
    // ctx_aux02.clearRect(0,0,artboardW,artboardH);
    drawLayer( "skyB", sky )
    drawTo_ctx_aux02( auxCanvas01, flipOn, 0 )
    // IMAGES.push( auxCanvas02 )
    // drawTo_ctx0( auxCanvas02 )

    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// draw Water
    ctxToDrawToNow = ctx_aux01;
    ctx_aux01.clearRect(0,0,artboardW,artboardH);
    // ctx_aux02.clearRect(0,0,artboardW,artboardH);
    drawLayer( "waterA", water )
    // ctxToDrawToNow = ctx_aux02;
    blurPixBez(0.002, 0.01, 0.01, 1, blurFxOn);
    drawTo_ctx_aux02( auxCanvas01, flipOn, 0 )
    // IMAGES.push( auxCanvas02 )
    // drawTo_ctx0( auxCanvas02 )



    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// draw farGround
    ctxToDrawToNow = ctx_aux01;
    ctx_aux01.clearRect(0,0,artboardW,artboardH);
    // ctx_aux02.clearRect(0,0,artboardW,artboardH);
    drawLayer( "farGround", farGround)
    drawTo_ctx_aux02( auxCanvas01, flipOn, 2/4096 )
    // IMAGES.push( auxCanvas02 )
    // drawTo_ctx0( auxCanvas02 )


    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// draw Fog (farGroud)
    if(fogOn) {
        ctxToDrawToNow = ctx_aux01;
        ctx_aux01.clearRect(0,0,artboardW,artboardH);
        drawLayer( "skyB", fog )
        drawTo_ctx_aux02( auxCanvas01, flipOn )
        // IMAGES.push(ctx_aux02)
        // drawTo_ctx0( ctx_aux02 )
    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// draw Field_MG
    ctxToDrawToNow = ctx_aux01;
    ctx_aux01.clearRect(0,0,artboardW,artboardH);
    // ctx_aux02.clearRect(0,0,artboardW,artboardH);
    drawLayer( "MG", field_MG )
    drawTo_ctx_aux02( auxCanvas01, flipOn, 1/4096 )
    // IMAGES.push( auxCanvas02 )
    // drawTo_ctx0( auxCanvas02 )



    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// draw Fog
    if(fogOn) {
        ctxToDrawToNow = ctx_aux01;
        ctx_aux01.clearRect(0,0,artboardW,artboardH);
        // ctx_aux02.clearRect(0,0,artboardW,artboardH);
        drawLayer( "skyB", fog )
        drawTo_ctx_aux02( auxCanvas01, flipOn, 0 )
        // IMAGES.push( auxCanvas02 )
        // drawTo_ctx0( auxCanvas02 )
    }

  
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// draw Field_FG
    ctx_aux01.clearRect(0,0,artboardW,artboardH);
    // ctx_aux02.clearRect(0,0,artboardW,artboardH);
    drawLayer( "FG", field_FG )
    drawTo_ctx_aux02( auxCanvas01, flipOn, 0 )
    // IMAGES.push( auxCanvas02 )
    // drawTo_ctx0( auxCanvas02 );




    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// draw Fog 2
    if(fogOn) {
        ctxToDrawToNow = ctx_aux01;
        ctx_aux01.clearRect(0,0,artboardW,artboardH);
        // ctx_aux02.clearRect(0,0,artboardW,artboardH);
        fog.alphaMax.value = fogAlpha_FG;
        drawLayer( "skyB", fog )
        drawTo_ctx_aux02( auxCanvas01, flipOn, 0 )
        // IMAGES.push( auxCanvas02 )
        // drawTo_ctx0( auxCanvas02 )
    }


    IMAGES.push( auxCanvas02 )

    drawTo_ctx0( auxCanvas02 )

    

    

}


function doNothing() {}














function drawAllImages() {

    // ctx0.clearRect(0,0,artboardW,artboardH);
  
    for(let i=0; i<IMAGES.length; i++){
  
    //   console.log("drawing layer ",i)
  
      var image = IMAGES[i];
  
      ctx0.drawImage(image, 0, 0, canvas0.width, canvas0.height);
  
  
    }
  
  }
  









function drawTo_ctx_aux02( image, flipOn, blurAmount ) {

    if(blurAmount==0) {
        ctx_aux02.filter = "none";
    } else {
        blurAmountPix = blurAmount * artboardH;
        ctx_aux02.filter = "blur(" + blurAmountPix + "px)";
    }


    if(flipOn==0){

        ctx_aux02.drawImage(image, 0, 0, artboardW, artboardH);
       
    } else if (flipOn==1) {

        ctx_aux02.save();
        ctx_aux02.scale(-1, 1);
        ctx_aux02.drawImage(image, 0, 0, artboardW*-1, artboardH);
        ctx_aux02.restore();

    }    
    
}


function drawTo_ctx0( image ) {

    ctx0.drawImage(image, 0, 0, canvas0.width, canvas0.height);

}