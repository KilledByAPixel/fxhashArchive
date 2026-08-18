/*


 /$$$$$$$$ /$$   /$$ /$$$$$$$$ /$$   /$$  /$$$$$$   /$$$$$$  /$$$$$$$$ /$$       /$$$$$$ /$$$$$$$   /$$$$$$ 
|__  $$__/| $$  | $$| $$_____/| $$  | $$ /$$$_  $$ /$$$_  $$| $$_____/| $$      |_  $$_/| $$__  $$ /$$__  $$
   | $$   | $$  | $$| $$      | $$  | $$| $$$$\ $$| $$$$\ $$| $$      | $$        | $$  | $$  \ $$| $$  \__/
   | $$   | $$$$$$$$| $$$$$   | $$$$$$$$| $$ $$ $$| $$ $$ $$| $$$$$   | $$        | $$  | $$$$$$$/|  $$$$$$ 
   | $$   | $$__  $$| $$__/   |_____  $$| $$\ $$$$| $$\ $$$$| $$__/   | $$        | $$  | $$____/  \____  $$
   | $$   | $$  | $$| $$            | $$| $$ \ $$$| $$ \ $$$| $$      | $$        | $$  | $$       /$$  \ $$
   | $$   | $$  | $$| $$$$$$$$      | $$|  $$$$$$/|  $$$$$$/| $$      | $$$$$$$$ /$$$$$$| $$      |  $$$$$$/
   |__/   |__/  |__/|________/      |__/ \______/  \______/ |__/      |________/|______/|__/       \______/ 

                            
"THE400FLIPS" BY THOMAS NOYA | GENERATIVE PROJECT FOR FX(HASH) | MAY 2022
IG: @TSNOYA | TT: @O2HT | THOMASNOYA.COM | linktr.ee/tsnoya                                                                                
Copyright (©) 2022 Thomas Noya 

Licensed under CC BY-NC-SA 4.0

"This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/ or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA."

PLEASE DO NOT STRAIGHT UP COPY MY CODE AND MINT IT AS YOUR OWN. I'VE LEFT IT EASY TO READ SO YOU CAN STUDY IT AND UNDERSTAND IT. BUILD ON TOP OF IT: EXPERIMENT, BE CREATIVE, DON'T BE AN ASSHOLE

IF YOU HAVE ANY QUESTIONS OR WOULD LIKE TO TALK ABOUT THE PROJECT, PLEASE GET IN TOUCH. I'M MORE THAN HAPPY TO.

*/

const canvasSize = 1000;
const cam_pos = 50;

let tileCount;
let tileWidth;
let tileHeight;
let tileDepth;

let main_rot_sys, main_rot_sys_string;

let which_primitive;
let primitive_string;
let size_sys_string;

let which_size_sys_1, which_size_sys_2;
let sizeX_abs_1, sizeY_abs_1, sizeZ_abs_1, sizeX_abs_2;
let sizeX_ran_1, sizeY_ran_1, sizeZ_ran_1;

let which_r1;
let r1_a_d1, r1_a_d2, r1_a_d3;
let r1_b_d1, r1_b_d2, r1_b_d3;
let r1_c_d1, r1_c_d2, r1_c_d3;
let r1_d_d1, r1_d_d2, r1_d_d3;
let r1_e_d1, r1_e_d2, r1_e_d3;

let which_r2;
let r2_a_d1, r2_a_d2, r2_a_d3, r2_a_d4;
let r2_b_d1, r2_b_d2, r2_b_d3, r2_b_d4;
let r2_c_d1, r2_c_d2, r2_c_d3, r2_c_d4;
let r2_d_d1, r2_d_d2, r2_d_d3, r2_d_d4;
let r2_e_d1, r2_e_d2, r2_e_d3, r2_e_d4;

let which_r3;
let r3_a_d1, r3_a_d2, r3_a_d3, r3_a_d4, r3_a_d5;
let r3_b_d1, r3_b_d2, r3_b_d3, r3_b_d4, r3_b_d5;
let r3_c_d1, r3_c_d2, r3_c_d3, r3_c_d4, r3_c_d5;
let r3_d_d1, r3_d_d2, r3_d_d3, r3_d_d4, r3_d_d5;
let r3_e_d1, r3_e_d2, r3_e_d3, r3_e_d4, r3_e_d5;

let which_r4;
let r4_a_d1, r4_a_d2, r4_a_d3, r4_a_d4;
let r4_b_d1, r4_b_d2, r4_b_d3, r4_b_d4;
let r4_c_d1, r4_c_d2, r4_c_d3, r4_c_d4;
let r4_d_d1, r4_d_d2, r4_d_d3, r4_d_d4;
let r4_e_d1, r4_e_d2, r4_e_d3, r4_e_d4;

let which_r5;
let r5_a_d1, r5_a_d2, r5_a_d3, r5_a_d4, r5_a_d5;
let r5_b_d1, r5_b_d2, r5_b_d3, r5_b_d4, r5_b_d5;
let r5_c_d1, r5_c_d2, r5_c_d3, r5_c_d4, r5_c_d5;
let r5_d_d1, r5_d_d2, r5_d_d3, r5_d_d4, r5_d_d5;
let r5_e_d1, r5_e_d2, r5_e_d3, r5_e_d4, r5_e_d5;

let stroke_weight, stroke_weight_string;
let stroke_c, stroke_c_string;

let colour_string;
let which_material, material_string;

let start, end, elapsed;

let lights_type, lights_OnOff, lights_type_string, lights_OnOff_string;

let light_1_r, light_1_g, light_1_b;
let light_2_r, light_2_g, light_2_b;
let light_3_r, light_3_g, light_3_b;

let light_1_posX, light_1_posY, light_1_posZ;
let light_2_posX, light_2_posY, light_2_posZ;
let light_3_posX, light_3_posY, light_3_posZ;

let which_tiles;
let myTiles = [450, 456, 460, 466, 470, 476, 484, 486, 490, 496, 502, 506, 510, 514, 520, 526, 530, 536, 540, 546, 550, 556, 560, 566, 570, 576, 580, 586, 590, 596, 600, 606, 610, 616, 620, 626, 630, 638, 642, 646, 650, 656, 660, 666, 670, 676, 680, 686, 690, 696, 700, 706, 710, 716, 720, 726, 730, 736, 740, 746, 750, 754];

function setup() {
    
    start = millis();
    createCanvas(canvasSize, canvasSize, WEBGL);
    pixelDensity(1);  
    
    which_tiles = int(map(fxrand(), 0, 1, 0, myTiles.length));
    
    // >>> 3D GRID PARAMETERS <<<
    //tileCount = int(map(fxrand(), 0, 1, 550, 650));
    tileCount = myTiles[which_tiles];
    tileWidth = width / tileCount;
    tileHeight = height / tileCount;
    tileDepth = width / tileCount;
    
    
    // >>> MAIN ROTATION SYSTEM <<<
    // 1-5
    main_rot_sys = int(map(fxrand(), 0, 1, 1, 6));
    //console.log('main_rot_sys: ' + main_rot_sys);
    
    // SUB ROTATIONS
    // 1-5
    which_r1 = int(map(fxrand(), 0, 1, 1, 6));
    //console.log('which_r1: ' + which_r1);
    
    // 1-5
    which_r2 = int(map(fxrand(), 0, 1, 1, 6));
    //console.log('which_r2: ' + which_r2);
    
    // 1-5
    which_r3 = int(map(fxrand(), 0, 1, 1, 6));
    //console.log('which_r3: ' + which_r3);
    
    // 1-5
    which_r4 = int(map(fxrand(), 0, 1, 1, 6));
    //console.log('which_r4: ' + which_r4);
    
    // 1-5
    which_r5 = int(map(fxrand(), 0, 1, 1, 6));
    //console.log('which_r5: ' + which_r5);
    
    
    // >>> ROTATION GENERAL VALUE VARS <<<
    R1_Vars();
    R2_Vars();
    R3_Vars();
    R4_Vars();
    R5_Vars();

    
    // >>> CHOOSE PRIMITIVE <<<
    // 0 = box | 1 = cylinder
    if (main_rot_sys == 5 && which_r5 == 4 ||
        main_rot_sys == 5 && which_r5 == 5) {
        
        which_primitive = int(map(fxrand(), 0, 1, 0, 2)); 
    }
    // 1 = cylinder
    else {
        
        which_primitive = 1; 
    }
    //console.log('which_primitive: ' + which_primitive);
    
    // >>> SIZE SYSTEM FOR BOX PRIMITIVE <<<
    // 0 = x & z same out loop, y diff out loop | 1 = x & z same in loop, y diff in loop
    which_size_sys_1 = int(map(fxrand(), 0, 1, 0, 2));
    //console.log('which_size_sys_1: ' + which_size_sys_1);
    
    // >>> SIZE SYSTEM FOR CYLINDER PRIMITIVE <<<
    // 0 = x & y diff outside loop | 1 = x & y diff inside loop 
    which_size_sys_2 = int(map(fxrand(), 0, 1, 0, 2));
    //console.log('which_size_sys_2: ' + which_size_sys_2);
    
    // >>> OUT OF LOOP SIZES FOR PRIMITIVES <<<
    sizeX_abs_1 = map(fxrand(), 0, 1, 1, 10); // 1
    sizeY_abs_1 = map(fxrand(), 0, 1, 350, 700);
    sizeZ_abs_1 = sizeX_abs_1;
    sizeX_abs_2 = map(fxrand(), 0, 1, 1, 10); // 1
    //console.log('sizeX_abs_1: ' + sizeX_abs_1);
    //console.log('sizeY_abs_1: ' + sizeY_abs_1);
    //console.log('sizeZ_abs_1: ' + sizeZ_abs_1);
    //console.log('sizeX_abs_2: ' + sizeX_abs_2);
    
    
    // >>> PICK MATERIAL <<<
    /*
    palettes:
    0: la croix, 1: black, 2: akira, 3: kew gardens, 4: 4th dimension, 5: sculpting time, 6: avila, 7: hockney, 8: everything now, 9: pc music, 10: miro, 11: black lake, 12: vibrations, 13: ashish accent pillow, 14: bucare
    */
    // 0-14
    which_material = int(map(fxrand(), 0, 1, 0, 15));
    //console.log('which_material: ' + which_material);
    
    
    // >>> PICK STROKE <<<
    // <= 0.5 thin | > 0.5 medium
    stroke_weight = fxrand(); 
    
    /*
    palettes:
    0 = ghosts of my life, 1 = eve, 2 = too old to die young, 3 = life 3.0, 4 = summer 2018, 5 = n22 7ay, 6 = montero, 7 = e3 5tb, 8 = ++, 9 = summer 2016, 10 = future shock, 11 = globalhead,
    12 = pastèque, 13 = forest dark, 14 = bass pro shops, 15 = versace python, 16 = jose chung from outer space, 17 = memories of green, 18 = riley, 19 = vcr
    */
    // 0-19
    stroke_c = int(map(fxrand(), 0, 1, 0, 20)); 
    //console.log('stroke_c: ' + stroke_c);
    
    
    // >>> LIGHTS <<<
    // <= 0.45 OFF | > 0.45 ON
    lights_OnOff = fxrand(); 
    
    // <= 0.5 V1 |  > 0.5 V2
    lights_type = fxrand(); 
            

    printToConsole();
    
    window.$fxhashFeatures = {
        'SYSTEM': main_rot_sys_string, 
        'PALETTE': material_string + ' + ' + stroke_c_string,
        'LIGHTS': lights_OnOff_string
    } 
    console.log(window.$fxhashFeatures);
}

function printToConsole() {
    
    // >>> TILES OBJECT <<<
    let TILES = {
        Tile_Count: tileCount
    }
    console.log(TILES);
    
    
    // >>> MAIN ROTATIONS OBJECT <<<
    // R1_A
    if (main_rot_sys == 1 && which_r1 == 1) {
        main_rot_sys_string = 'R1_A';
    }
    // R1_B
    else if (main_rot_sys == 1 && which_r1 == 2) {
        main_rot_sys_string = 'R1_B';
    }
    // R1_C
    else if (main_rot_sys == 1 && which_r1 == 3) {
        main_rot_sys_string = 'R1_C';
    }
    // R1_D
    else if (main_rot_sys == 1 && which_r1 == 4) {
        main_rot_sys_string = 'R1_D';
    }
    // R1_E
    else if (main_rot_sys == 1 && which_r1 == 5) {
        main_rot_sys_string = 'R1_E';
    }
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // R2_A
    if (main_rot_sys == 2 && which_r2 == 1) {
        main_rot_sys_string = 'R2_A';
    }
    // R2_B
    else if (main_rot_sys == 2 && which_r2 == 2) {
        main_rot_sys_string = 'R2_B';
    }
    // R2_C
    else if (main_rot_sys == 2 && which_r2 == 3) {
        main_rot_sys_string = 'R2_C';
    }
    // R2_D
    else if (main_rot_sys == 2 && which_r2 == 4) {
        main_rot_sys_string = 'R2_D';
    }
    // R2_E
    else if (main_rot_sys == 2 && which_r2 == 5) {
        main_rot_sys_string = 'R2_E';
    }
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // R3_A
    if (main_rot_sys == 3 && which_r3 == 1) {
       main_rot_sys_string = 'R3_A';
    }
    // R3_B
    else if (main_rot_sys == 3 && which_r3 == 2) {
       main_rot_sys_string = 'R3_B';
    }
    // R3_C
    else if (main_rot_sys == 3 && which_r3 == 3) {
       main_rot_sys_string = 'R3_C';
    }
    // R3_D
    else if (main_rot_sys == 3 && which_r3 == 4) {
       main_rot_sys_string = 'R3_D';
    }
    // R3_E
    else if (main_rot_sys == 3 && which_r3 == 5) {
       main_rot_sys_string = 'R3_E';
    }
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // R4_A
    if (main_rot_sys == 4 && which_r4 == 1) {
       main_rot_sys_string = 'R4_A';
    }
    // R4_B
    else if (main_rot_sys == 4 && which_r4 == 2) {
       main_rot_sys_string = 'R4_B';
    }
    // R4_C
    else if (main_rot_sys == 4 && which_r4 == 3) {
       main_rot_sys_string = 'R4_C';
    }
    // R4_D
    else if (main_rot_sys == 4 && which_r4 == 4) {
       main_rot_sys_string = 'R4_D';
    } 
    // R4_E
    else if (main_rot_sys == 4 && which_r4 == 5) {
       main_rot_sys_string = 'R4_E';
    } 
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // R5_A
    if (main_rot_sys == 5 && which_r5 == 1) {
       main_rot_sys_string = 'R5_A';
    }
    // R5_B
    else if (main_rot_sys == 5 && which_r5 == 2) {
       main_rot_sys_string = 'R5_B';
    }
    // R5_C
    else if (main_rot_sys == 5 && which_r5 == 3) {
       main_rot_sys_string = 'R5_C';
    }
    // R5_D
    else if (main_rot_sys == 5 && which_r5 == 4) {
       main_rot_sys_string = 'R5_D';
    } 
    // R5_E
    else if (main_rot_sys == 5 && which_r5 == 5) {
       main_rot_sys_string = 'R5_E';
    } 
    
    let MAIN_ROTATION = {
        Main_Rot_Sys: main_rot_sys_string
    }
    console.log(MAIN_ROTATION);
    
    
    // >>> CAMERA OBJECT <<<
    let CAMERA = {
        Camera_Dist: cam_pos
    }
    console.log(CAMERA);
    
    
    // >>> PRIMITIVE OBJECT <<<
    let PRIMITIVE = {};
    
    if (which_primitive == 0) {
        primitive_string = 'box';
        size_sys_string = which_size_sys_1;
    }
    else if (which_primitive == 1) {
        primitive_string = 'cylinder';
        size_sys_string = which_size_sys_2;
    }
    
    PRIMITIVE = {
        Primitive: primitive_string,
        Size_Sys: size_sys_string
    }
    console.log(PRIMITIVE);
    
    
    // >>> MATERIAL OBJECT <<<
    let MATERIAL = {};

    // LA CROIX
    if (which_material == 0) {
        material_string = 'LA CROIX';
    }
    // BLACK
    else if (which_material == 1) {
        material_string = 'BLACK';
    }
    // AKIRA
    else if (which_material == 2) {
        material_string = 'AKIRA';
    }
    // KEW GARDENS
    else if (which_material == 3) {
        material_string = 'KEW GARDENS';
    }
    // 4TH DIMENSION
    else if (which_material == 4) {
        material_string = '4TH DIMENSION';
    }
    // SCULPTING TIME
    else if (which_material == 5) {
        material_string = 'SCULPTING TIME';
    }
    // AVILA
    else if (which_material == 6) {
        material_string = 'AVILA';
    }
    // HOCKNEY
    else if (which_material == 7) {
        material_string = 'HOCKNEY';
    }
    // EVERYTHING NOW
    else if (which_material == 8) {
        material_string = 'EVERYTHING NOW';
    }
    // PC MUSIC
    else if (which_material == 9) {
        material_string = 'PC MUSIC';
    }
    // MIRÓ
    else if (which_material == 10) {
        material_string = 'MIRÓ';
    }
    // BLACK LAKE
    else if (which_material == 11) {
        material_string = 'BLACK LAKE';
    }
    // VIBRATIONS
    else if (which_material == 12) {
        material_string = 'VIBRATIONS';
    }
    // ASHISH ACCENT PILLOW
    else if (which_material == 13) {
        material_string = 'ASHISH ACCENT PILLOW';
    }
    // BUCARE
    else if (which_material == 14) {
        material_string = 'BUCARE';
    }
    // BLACK
    else {
        material_string = 'BLACK';
    }
    
    MATERIAL = {
        Material: material_string
    }

    console.log(MATERIAL);
    
    
    // >>> STROKE OBJECT <<<
    let STROKE = {};
    
    // STROKE WEIGHT
    if (stroke_weight <= 0.5) {
        stroke_weight_string = 'thin';
    }
    else {
        stroke_weight_string = 'medium';
    }
    
    // GHOSTS OF MY LIFE
    if (stroke_c == 0) {
        stroke_c_string = 'GHOSTS OF MY LIFE';
    }
    // EVE
    else if (stroke_c == 1) {
        stroke_c_string = 'EVE';
    }
    // TOO OLD TO DIE YOUNG
    else if (stroke_c == 2) { 
        stroke_c_string = 'TOO OLD TO DIE YOUNG';
    }
    // LIFE 3.0
    else if (stroke_c == 3) { 
        stroke_c_string = 'LIFE 3.0';
    }
    // SUMMER 2018
    else if (stroke_c == 4) {
        stroke_c_string = 'SUMMER 2018';
    }
    // N22 7AY
    else if (stroke_c == 5) {
        stroke_c_string = 'N22 7AY';
    }
    // MONTERO
    else if (stroke_c == 6) {
        stroke_c_string = 'MONTERO';
    }
    // E3 5TB
    else if (stroke_c == 7) {
        stroke_c_string = 'E3 5TB';
    }
    // ++
    else if (stroke_c == 8) {
        stroke_c_string = '++';
    }
    // SUMMER 2016
    else if (stroke_c == 9) {
        stroke_c_string = 'SUMMER 2016';
    }
    // FUTURE SHOCK
    else if (stroke_c == 10) {
        stroke_c_string = 'FUTURE SHOCK';
    }
    // GLOBALHEAD
    else if (stroke_c == 11) {
        stroke_c_string = 'GLOBALHEAD';
    }
    // PASTÈQUE
    else if (stroke_c == 12) {
        stroke_c_string = 'PASTÈQUE';
    }
    // FOREST DARK
    else if (stroke_c == 13) {
        stroke_c_string = 'FOREST DARK';
    }
    // BASS PRO SHOPS
    else if (stroke_c == 14) {
        stroke_c_string = 'BASS PRO SHOPS';
    }
    // VERSACE PYTHON
    else if (stroke_c == 15) {
        stroke_c_string = 'VERSACE PYTHON';
    }
    // JOSE CHUNG FROM OUTER SPACE
    else if (stroke_c == 16) {
        stroke_c_string = "JOSE CHUNG'S FROM OUTER SPACE";
    }
    // MEMORIES OF GREEN
    else if (stroke_c == 17) {
        stroke_c_string = 'MEMORIES OF GREEN';
    }
    // RILEY
    else if (stroke_c == 18) {
        stroke_c_string = 'RILEY';
    }
    // VCR
    else if (stroke_c == 19) {
        stroke_c_string = 'VCR';
    }
    else {
        stroke_c_string = 'GHOSTS OF MY LIFE';
    }
    
    STROKE = {
        Stroke_Type: stroke_weight_string,
        Stroke_Colour: stroke_c_string
    }
    console.log(STROKE);
    
    
    // >>> DIRECTIONAL LIGHTS OBJECT <<<
    let LIGHTS = {};
    
    if (lights_OnOff > 0.45 && lights_type <= 0.5) {
        lights_OnOff_string = 'ON';
        lights_type_string = '1';
    }
    else if (lights_OnOff > 0.45 && lights_type > 0.5) {
        lights_OnOff_string = 'ON';
        lights_type_string = '2';
    }
    else {
        lights_OnOff_string = 'OFF';
        lights_type_string = 'OFF';
    }
    
    LIGHTS = {
        Lights: lights_OnOff_string,
        Type: lights_type_string
    };  
    console.log(LIGHTS);
} 

function R1_Vars() {
    // R1_A
    r1_a_d1 = map(fxrand(), 0, 1, 5, 13); // 10
    r1_a_d2 = map(fxrand(), 0, 1, 4.5, 9); // 5
    r1_a_d3 = map(fxrand(), 0, 1, 10, 16); // 13
    //console.log('r1_a_d1: ' + r1_a_d1);
    //console.log('r1_a_d2: ' + r1_a_d2);
    //console.log('r1_a_d3: ' + r1_a_d3);
    
    // R1_B
    r1_b_d1 = map(fxrand(), 0, 1, 4.5, 10); // 6
    r1_b_d2 = map(fxrand(), 0, 1, 4.5, 10); // 6
    r1_b_d3 = map(fxrand(), 0, 1, 9.5, 14); // 10
    //console.log('r1_b_d1: ' + r1_b_d1);
    //console.log('r1_b_d2: ' + r1_b_d1);
    //console.log('r1_b_d3: ' + r1_b_d3);
    
    // R1_C
    r1_c_d1 = map(fxrand(), 0, 1, 2.5, 4); // 3
    r1_c_d2 = map(fxrand(), 0, 1, 5, 16); // 11
    r1_c_d3 = map(fxrand(), 0, 1, 14, 19); // 18
    //console.log('r1_c_d1: ' + r1_c_d1);
    //console.log('r1_c_d2: ' + r1_c_d2);
    //console.log('r1_c_d3: ' + r1_c_d3);
    
    // R1_D
    r1_d_d1 = map(fxrand(), 0, 1, 8, 16); // 12
    r1_d_d2 = map(fxrand(), 0, 1, 3, 16); // 2
    r1_d_d3 = map(fxrand(), 0, 1, 10, 25); // 20
    //console.log('r1_d_d1: ' + r1_d_d1);
    //console.log('r1_d_d2: ' + r1_d_d2);
    //console.log('r1_d_d3: ' + r1_d_d3);
    
    // R1_E
    r1_e_d1 = map(fxrand(), 0, 1, 8, 15); // 12
    r1_e_d2 = map(fxrand(), 0, 1, 10, 16); // 14
    r1_e_d3 = map(fxrand(), 0, 1, 15, 30); // 18
    //console.log('r1_e_d1: ' + r1_e_d1);
    //console.log('r1_e_d2: ' + r1_e_d2);
    //console.log('r1_e_d3: ' + r1_e_d3);
}

function R2_Vars() {
    // R2_A
    r2_a_d1 = map(fxrand(), 0, 1, 10, 16); // 13 = d2
    r2_a_d2 = map(fxrand(), 0, 1, 10, 14); // 11 = d3
    r2_a_d3 = map(fxrand(), 0, 1, 20, 30); // 23 = d4
    r2_a_d4 = map(fxrand(), 0, 1, 75, 90); // 81 = d6
    //console.log('r2_a_d1: ' + r2_a_d1);
    //console.log('r2_a_d2: ' + r2_a_d2);
    //console.log('r2_a_d3: ' + r2_a_d3);
    //console.log('r2_a_d4: ' + r2_a_d4);
    
    // R2_B
    r2_b_d1 = map(fxrand(), 0, 1, 9, 13); // 10, 11 = d2
    r2_b_d2 = map(fxrand(), 0, 1, 15, 25); // 9, 17 = d3
    r2_b_d3 = map(fxrand(), 0, 1, 10, 15); // 38, 13 = d4
    r2_b_d4 = map(fxrand(), 0, 1, 80, 86); // 67, 84 = d6
    //console.log('r2_b_d1: ' + r2_b_d1);
    //console.log('r2_b_d2: ' + r2_b_d2);
    //console.log('r2_b_d3: ' + r2_b_d3);
    //console.log('r2_b_d4: ' + r2_b_d4);
    
    // R2_C
    r2_c_d1 = map(fxrand(), 0, 1, 11, 14); // 12 = d2
    r2_c_d2 = map(fxrand(), 0, 1, 18, 28); // 22 = d3
    r2_c_d3 = map(fxrand(), 0, 1, 15, 23); // 19 = d4
    r2_c_d4 = map(fxrand(), 0, 1, 65, 79); // 77 = d6
    //console.log('r2_c_d1: ' + r2_c_d1);
    //console.log('r2_c_d2: ' + r2_c_d2);
    //console.log('r2_c_d3: ' + r2_c_d3);
    //console.log('r2_c_d4: ' + r2_c_d4);
    
    // R2_D
    r2_d_d1 = map(fxrand(), 0, 1, 12, 16); // 15 = d2
    r2_d_d2 = map(fxrand(), 0, 1, 3, 10); // 3 = d3
    r2_d_d3 = map(fxrand(), 0, 1, 8, 13); // 10 = d4
    r2_d_d4 = map(fxrand(), 0, 1, 60, 80); // 63 = d6
    //console.log('r2_d_d1: ' + r2_d_d1);
    //console.log('r2_d_d2: ' + r2_d_d2);
    //console.log('r2_d_d3: ' + r2_d_d3);
    //console.log('r2_d_d4: ' + r2_d_d4);
    
    // R2_E
    r2_e_d1 = map(fxrand(), 0, 1, 6, 14); // 10 = d2
    r2_e_d2 = map(fxrand(), 0, 1, 9, 16); // 13 = d3
    r2_e_d3 = map(fxrand(), 0, 1, 17, 30); // 22 = d4
    r2_e_d4 = map(fxrand(), 0, 1, 90, 99); // 91 = d6
    //console.log('r2_e_d1: ' + r2_e_d1);
    //console.log('r2_e_d2: ' + r2_e_d2);
    //console.log('r2_e_d3: ' + r2_e_d3);
    //console.log('r2_e_d4: ' + r2_e_d4);
}

function R3_Vars() {
    // R3_A
    r3_a_d1 = map(fxrand(), 0, 1, 6, 11); // 7 = d1
    r3_a_d2 = map(fxrand(), 0, 1, 3, 8); // 5 = d2
    r3_a_d3 = map(fxrand(), 0, 1, 17, 23); // 19 = d3
    r3_a_d4 = map(fxrand(), 0, 1, 27, 35); // 28 = d4
    r3_a_d5 = map(fxrand(), 0, 1, 70, 76); // 73 = d6
    //console.log('r3_a_d1: ' + r3_a_d1);
    //console.log('r3_a_d2: ' + r3_a_d2);
    //console.log('r3_a_d3: ' + r3_a_d3);
    //console.log('r3_a_d4: ' + r3_a_d4);
    //console.log('r3_a_d5: ' + r3_a_d5);
    
    // R3_B 
    r3_b_d1 = map(fxrand(), 0, 1, 6, 9); // 8 = d1
    r3_b_d2 = map(fxrand(), 0, 1, 8, 11); // 10 = d2
    r3_b_d3 = map(fxrand(), 0, 1, 24, 30); // 25 = d3
    r3_b_d4 = map(fxrand(), 0, 1, 16, 20); // 17 = d4
    r3_b_d5 = map(fxrand(), 0, 1, 50, 56); // 55 = d6
    //console.log('r3_b_d1: ' + r3_b_d1);
    //console.log('r3_b_d2: ' + r3_b_d2);
    //console.log('r3_b_d3: ' + r3_b_d3);
    //console.log('r3_b_d4: ' + r3_b_d4);
    //console.log('r3_b_d5: ' + r3_b_d5);
    
    // R3_C 
    r3_c_d1 = map(fxrand(), 0, 1, 6, 10); // 10 = d1 
    r3_c_d2 = map(fxrand(), 0, 1, 4, 9); // 4 = d2
    r3_c_d3 = map(fxrand(), 0, 1, 2, 6); // 5 = d3
    r3_c_d4 = map(fxrand(), 0, 1, 21, 27); // 26 = d4 
    r3_c_d5 = map(fxrand(), 0, 1, 72, 74); // 72 = d6
    //console.log('r3_c_d1: ' + r3_c_d1);
    //console.log('r3_c_d2: ' + r3_c_d2);
    //console.log('r3_c_d3: ' + r3_c_d3);
    //console.log('r3_c_d4: ' + r3_c_d4);
    //console.log('r3_c_d5: ' + r3_c_d5);
    
    // R3_D
    r3_d_d1 = map(fxrand(), 0, 1, 2, 6); // 3 = d1
    r3_d_d2 = map(fxrand(), 0, 1, 14, 20); // 17 = d2
    r3_d_d3 = map(fxrand(), 0, 1, 14, 21); // 17 = d3
    r3_d_d4 = map(fxrand(), 0, 1, 34, 39); // 35 = d4
    r3_d_d5 = map(fxrand(), 0, 1, 60, 70); // 64 = d6
    //console.log('r3_d_d1: ' + r3_d_d1);
    //console.log('r3_d_d2: ' + r3_d_d2);
    //console.log('r3_d_d3: ' + r3_d_d3);
    //console.log('r3_d_d4: ' + r3_d_d4);
    //console.log('r3_d_d5: ' + r3_d_d5);
    
    // R3_E 
    r3_e_d1 = map(fxrand(), 0, 1, 15, 21); //  = d1
    r3_e_d2 = map(fxrand(), 0, 1, 2, 6); //  = d2
    r3_e_d3 = map(fxrand(), 0, 1, 24, 35); //  = d3
    r3_e_d4 = map(fxrand(), 0, 1, 32, 35); //  = d4
    r3_e_d5 = map(fxrand(), 0, 1, 52, 60); //  = d6
    //console.log('r3_e_d1: ' + r3_e_d1);
    //console.log('r3_e_d2: ' + r3_e_d2);
    //console.log('r3_e_d3: ' + r3_e_d3);
    //console.log('r3_e_d4: ' + r3_e_d4);
    //console.log('r3_e_d5: ' + r3_e_d5);
}

function R4_Vars() {
    // R4_A
    r4_a_d1 = map(fxrand(), 0, 1, 2, 7); // 5 = d2
    r4_a_d2 = map(fxrand(), 0, 1, 5, 11); // 6 = d3
    r4_a_d3 = map(fxrand(), 0, 1, 30, 41); // 37 = d4
    r4_a_d4 = map(fxrand(), 0, 1, 45, 61); // 55 = d6
    //console.log('r4_a_d1: ' + r4_a_d1);
    //console.log('r4_a_d2: ' + r4_a_d2);
    //console.log('r4_a_d3: ' + r4_a_d3);
    //console.log('r4_a_d4: ' + r4_a_d4);
    
    // R4_B
    r4_b_d1 = map(fxrand(), 0, 1, 65, 75); // 72 = d2
    r4_b_d2 = map(fxrand(), 0, 1, 5, 21); // 15 = d3
    r4_b_d3 = map(fxrand(), 0, 1, 35, 46); // 37 = d4
    r4_b_d4 = map(fxrand(), 0, 1, 20, 46); // 33 = d6
    //console.log('r4_b_d1: ' + r4_b_d1);
    //console.log('r4_b_d2: ' + r4_b_d2);
    //console.log('r4_b_d3: ' + r4_b_d3);
    //console.log('r4_b_d4: ' + r4_b_d4);
    
    // R4_C
    r4_c_d1 = map(fxrand(), 0, 1, 15, 25); // 19 = d2
    r4_c_d2 = map(fxrand(), 0, 1, 5, 13); // 9 = d3
    r4_c_d3 = map(fxrand(), 0, 1, 8, 16); // 10 = d4
    r4_c_d4 = map(fxrand(), 0, 1, 70, 80); // 79 = d6
    //console.log('r4_c_d1: ' + r4_c_d1);
    //console.log('r4_c_d2: ' + r4_c_d2);
    //console.log('r4_c_d3: ' + r4_c_d3);
    //console.log('r4_c_d4: ' + r4_c_d4);
    
    // R4_D
    r4_d_d1 = map(fxrand(), 0, 1, 3, 10); // 3 = d2
    r4_d_d2 = map(fxrand(), 0, 1, 15, 25); // 21 = d3
    r4_d_d3 = map(fxrand(), 0, 1, 25, 35); // 32 = d4
    r4_d_d4 = map(fxrand(), 0, 1, 60, 75); // 61 = d6
    //console.log('r4_d_d1: ' + r4_d_d1);
    //console.log('r4_d_d2: ' + r4_d_d2);
    //console.log('r4_d_d3: ' + r4_d_d3);
    //console.log('r4_d_d4: ' + r4_d_d4);
    
    // R4_E
    r4_e_d1 = map(fxrand(), 0, 1, 2, 10); // 7 = d2
    r4_e_d2 = map(fxrand(), 0, 1, 8, 15); // 9 = d3
    r4_e_d3 = map(fxrand(), 0, 1, 15, 26); // 19 = d4
    r4_e_d4 = map(fxrand(), 0, 1, 75, 90); // 85 = d6
    //console.log('r4_e_d1: ' + r4_e_d1);
    //console.log('r4_e_d2: ' + r4_e_d2);
    //console.log('r4_e_d3: ' + r4_e_d3);
    //console.log('r4_e_d4: ' + r4_e_d4);
}

function R5_Vars() {
    // R5_A
    r5_a_d1 = map(fxrand(), 0, 1, 15, 25); // 19 = d2
    r5_a_d2 = map(fxrand(), 0, 1, 10, 20); // 14  = d3
    r5_a_d3 = map(fxrand(), 0, 1, 11, 16); // 11 = d4
    r5_a_d4 = map(fxrand(), 0, 1, 50, 55); // 53 = d5
    r5_a_d5 = map(fxrand(), 0, 1, 85, 100); // 90 = d6
    //console.log('r5_a_d1: ' + r5_a_d1);
    //console.log('r5_a_d2: ' + r5_a_d2);
    //console.log('r5_a_d3: ' + r5_a_d3);
    //console.log('r5_a_d4: ' + r5_a_d4);
    //console.log('r5_a_d5: ' + r5_a_d5);
    
    // R5_B
    r5_b_d1 = map(fxrand(), 0, 1, 22, 25); // 23 = d2
    r5_b_d2 = map(fxrand(), 0, 1, 15, 19); // 16  = d3
    r5_b_d3 = map(fxrand(), 0, 1, 35, 40); // 37 = d4
    r5_b_d4 = map(fxrand(), 0, 1, 27, 37); // 27 = d5
    r5_b_d5 = map(fxrand(), 0, 1, 60, 70); // 58 = d6
    //console.log('r5_b_d1: ' + r5_b_d1);
    //console.log('r5_b_d2: ' + r5_b_d2);
    //console.log('r5_b_d3: ' + r5_b_d3);
    //console.log('r5_b_d4: ' + r5_b_d4);
    //console.log('r5_b_d5: ' + r5_b_d5);
    
    // R5_C
    r5_c_d1 = map(fxrand(), 0, 1, 15, 17); // 16 = d2
    r5_c_d2 = map(fxrand(), 0, 1, 10, 20); // 11 = d3
    r5_c_d3 = map(fxrand(), 0, 1, 20, 33); // 24 = d4
    r5_c_d4 = map(fxrand(), 0, 1, 27, 40); // 27 = d5
    r5_c_d5 = map(fxrand(), 0, 1, 70, 90); // 88 = d6
    //console.log('r5_c_d1: ' + r5_c_d1);
    //console.log('r5_c_d2: ' + r5_c_d2);
    //console.log('r5_c_d3: ' + r5_c_d3);
    //console.log('r5_c_d4: ' + r5_c_d4);
    //console.log('r5_c_d5: ' + r5_c_d5);

    // R5_D
    r5_d_d1 = map(fxrand(), 0, 1, 2, 15); // 5 = d2
    r5_d_d2 = map(fxrand(), 0, 1, 9, 15); // 11 = d3
    r5_d_d3 = map(fxrand(), 0, 1, 30, 40); // 33  = d4
    r5_d_d4 = map(fxrand(), 0, 1, 35, 43); // 40 = d5
    r5_d_d5 = map(fxrand(), 0, 1, 75, 90); // 79 = d6
    //console.log('r5_d_d1: ' + r5_d_d1);
    //console.log('r5_d_d2: ' + r5_d_d2);
    //console.log('r5_d_d3: ' + r5_d_d3);
    //console.log('r5_d_d4: ' + r5_d_d4);
    //console.log('r5_d_d5: ' + r5_d_d5);
    
    // R5_E
    r5_e_d1 = map(fxrand(), 0, 1, 17, 20); // 17 = d2
    r5_e_d2 = map(fxrand(), 0, 1, 26, 30); // 26 = d3
    r5_e_d3 = map(fxrand(), 0, 1, 30, 38); // 32 = d4
    r5_e_d4 = map(fxrand(), 0, 1, 20, 40); // 24 = d5
    r5_e_d5 = map(fxrand(), 0, 1, 55, 70); // 61 = d6
    //console.log('r5_e_d1: ' + r5_e_d1);
    //console.log('r5_e_d2: ' + r5_e_d2);
    //console.log('r5_e_d3: ' + r5_e_d3);
    //console.log('r5_e_d4: ' + r5_e_d4);
    //console.log('r5_e_d5: ' + r5_e_d5);
}

function rot_sys_1(x, y, z) {
    if (which_r1 == 1) {
        rotateY(Math.cos(y - width / r1_a_d2)); 
        rotateZ(z - width / r1_a_d1); 
        rotateX(Math.tan(x + width / r1_a_d3)); 
        rotateY(Math.sin(y - width >>> r1_a_d2));
    }
    else if (which_r1 == 2) {
        rotateY(Math.cos(y - width / r1_b_d2)); 
        rotateZ(z - width / r1_b_d1); 
        rotateX(Math.tan(x + width / r1_b_d3)); 
        rotateY(Math.sin(y - width >>> r1_b_d2));
        rotateZ(z - width / r1_b_d1); 
    }
    else if (which_r1 == 3) {
        rotateY(Math.cos(y - height / r1_c_d2)); 
        rotateZ(z - width / r1_c_d1); 
        rotateX(Math.tan(x - width / r1_c_d3)); 
        rotateY(Math.sin(y - height >>> r1_c_d2)); 
        rotateZ(z && r1_c_d3);
    }
    else if (which_r1 == 4) {
        rotateY(Math.cos(y - width / r1_d_d2)); 
        rotateZ(z - width / r1_d_d1); 
        rotateX(Math.tan(x - width / r1_d_d3)); 
        rotateY(Math.sin(y - width >>> r1_d_d2));
        rotateZ(z && r1_d_d1);
    }
    else if (which_r1 == 5) {
        rotateY(Math.sin(y - width / r1_e_d2)); 
        rotateZ(z - width / r1_e_d1); 
        rotateX(Math.tan(x - width / r1_e_d3)); 
        //rotateY(Math.cos(y - width >>> r1_e_d2));
        rotateZ(z / width % r1_e_d2); 
    }
}

function rot_sys_2(x, y, z) {
    if (which_r2 == 1) {
        rotateY(y % width % r2_a_d2);
        rotateZ(z + height % r2_a_d3);
        rotateY(y % width ^ r2_a_d2);
        rotateY(y % width ^ r2_a_d4);
        rotateX(Math.cos(x % width * r2_a_d1));
        rotateX(Math.cos(x % width * r2_a_d1));
    }
    else if (which_r2 == 2) {
        rotateY(y % height % r2_b_d2);
        rotateZ(z + width % r2_b_d3);
        rotateY(y % height ^ r2_b_d2);
        rotateY(y % height ^ r2_b_d4);
        rotateX(Math.cos(x % width * r2_b_d1));
        rotateX(Math.cos(x % width * r2_b_d1));
    }
    else if (which_r2 == 3) {
        rotateY(y % height / r2_c_d2);
        rotateZ(z + width % r2_c_d3);
        rotateY(y % width + r2_c_d2);
        rotateY(y % height + r2_c_d4);
        rotateX(Math.atan(x / width * r2_c_d1));
        rotateX(Math.atan(x / width * r2_c_d1));
        rotateZ(z + width % r2_c_d3);
    }
    else if (which_r2 == 4) {
        rotateY(y % width / r2_d_d2);
        rotateZ(z + height % r2_d_d3);
        rotateY(y % width / r2_d_d2);
        rotateY(y % width / r2_d_d4);
        rotateX(Math.atan(x % width >> r2_d_d1));
        rotateX(Math.atan(x % width >> r2_d_d1));
    }
    else if (which_r2 == 5) {
        rotateY(y % x / r2_e_d2);
        rotateZ(z - width % r2_e_d3);
        rotateY(y % x / r2_e_d2);
        rotateY(y % x / r2_e_d4);
        rotateX(Math.sin(x % y >> r2_e_d1));
        rotateX(Math.sin(x % y >> r2_e_d1));
    }
}

function rot_sys_3(x, y, z) {
    if (which_r3 == 1) {
        rotateY(Math.tan(y + width % r3_a_d2)); 
        rotateZ(Math.tan(z - width / r3_a_d4));
        rotateY(Math.tan(y - width / r3_a_d1)); 
        rotateX(Math.tan(x + width / r3_a_d3));
        rotateZ(Math.tan(z - width / r3_a_d5));
    }
    else if (which_r3 == 2) {
        rotateY(Math.tan(y + width % r3_b_d2)); 
        rotateZ(z - width / r3_b_d4);
        rotateY(Math.tan(y - width / r3_b_d2)); 
        rotateX(Math.tan(x + width / r3_b_d3)); 
        rotateZ(Math.sin(z - width / r3_b_d5));
    }
    else if (which_r3 == 3) { 
        rotateY(Math.tan(y % height % r3_c_d2)); 
        rotateZ(Math.tan(z - width / r3_c_d4));
        rotateY(Math.tan(y - height / r3_c_d1)); 
        rotateX(Math.tan(x + width / r3_c_d3));
        rotateZ(Math.tan(z - width / r3_c_d5));
    }
    else if (which_r3 == 4) {
        rotateY(Math.tan(y % r3_d_d2 / x)); 
        rotateZ(Math.tan(z - width / r3_d_d4));
        rotateY(Math.tan(y - height / r3_d_d1)); 
        rotateX(Math.tan(x + width / r3_d_d3)); 
        rotateZ(Math.tan(z - width / r3_d_d4));
    }
    else if (which_r3 == 5) {
        rotateY(Math.tan(y + width % r3_e_d2)); 
        rotateZ(z - width / r3_e_d4);
        rotateY(Math.tan(y - width / r3_e_d1)); 
        rotateX(Math.tan(x + width / r3_e_d3)); 
        rotateZ(Math.sin(z - width / r3_e_d4));
    }
}

function rot_sys_4(x, y, z) {
    if (which_r4 == 1) {
        rotateY(y % height && r4_a_d1);
        rotateX(x - width / r4_a_d1);
        rotateZ(z - height / r4_a_d4);
        rotateY(Math.sin(y % height ** r4_a_d1));
        rotateX(Math.tan(x % width % r4_a_d1));
    }
    else if (which_r4 == 2) {
        rotateY(y % height && r4_b_d1);
        rotateX(x - width / r4_b_d1);
        rotateZ(z - height / r4_b_d4);
        rotateY(Math.atan(y % height >> r4_b_d1));
        rotateX(Math.atan(x % width % r4_b_d1));
        rotateZ(z - height / r4_b_d3);
    }
    else if (which_r4 == 3) {
        rotateY(y % height && r4_c_d1);
        rotateZ(z - height / r4_c_d4);
        rotateX(x - width / r4_c_d1);
        rotateX(Math.sin(x % y >> r4_c_d1));
        rotateZ(z - height / r4_c_d4);
    }
    else if (which_r4 == 4) {
        rotateY(y % height >> r4_d_d1);
        rotateZ(z - height / r4_d_d4);
        rotateX(x - width / r4_d_d1);
        rotateX(Math.cos(x % y % r4_d_d2));
        rotateZ(z - height / r4_d_d3);
    }
    else if (which_r4 == 5) {
        rotateY(y % height && r4_e_d1);
        rotateZ(z - height / r4_e_d4);
        rotateX(x - width / r4_e_d2);
        rotateX(Math.cos(x % y >> r4_e_d3));
        rotateZ(z - height / r4_e_d2);
    }
}

function rot_sys_5(x, y, z) {
    if (which_r5 == 1) {
    // h + v 1
        rotateY(Math.tan(y % height >> x));
        rotateZ(Math.atan(z + width % r5_a_d3)); 
        rotateY(y % height ^ x); 
        rotateX(Math.sin(x % width >>> y));
        rotateZ(Math.atan(z - width % r5_a_d5)); 
    }
    else if (which_r5 == 2) {
    // h
        rotateY(Math.tan(y % height >> x));
        rotateZ(Math.atan(z + width % r5_b_d3)); 
        rotateY(y % height ^ x); 
        rotateX(Math.sin(x % width >>> y));
    }
    else if (which_r5 == 3) {
    // h + v 2
        rotateY(Math.tan(y % height >> x));
        rotateZ(Math.atan(z + width % r5_c_d3)); 
        rotateY(y % height ^ x); 
        rotateX(Math.sin(x % width >>> y));
        rotateY(Math.sin(y % height >>> x));
        rotateZ(Math.atan(z - width % r5_c_d3)); 
    }
    else if (which_r5 == 4) {
    // h + v 3
        rotateY(Math.tan(y % r5_d_d1 >> x));
        rotateZ(Math.atan(z + y % r5_d_d3)); 
        rotateY(y % x ^ r5_d_d1); 
        rotateX(Math.sin(x % y >>> r5_d_d2));
        rotateY(Math.sin(y % x >>> r5_d_d4));
        rotateZ(Math.atan(z + x % r5_d_d3)); 
    }
    else if (which_r5 == 5) {
    // h + v 4
        rotateY(Math.tan(y % r5_e_d1 >> x));
        rotateZ(Math.atan(z + y % r5_e_d3)); 
        rotateY(y % x ^ r5_e_d1); 
        rotateX(Math.sin(x % y >>> r5_e_d2));
        rotateY(Math.sin(y % x >>> r5_e_d4));
        rotateZ(Math.atan(z + x % r5_e_d3)); 
    }
}

function my_Rotation(x, y, z) {
    if (main_rot_sys == 1) {
        return rot_sys_1(x, y, z);
    }
    else if (main_rot_sys == 2) {
        return rot_sys_2(x, y, z);
    }
    else if (main_rot_sys == 3) {
        return rot_sys_3(x, y, z);
    }
    else if (main_rot_sys == 4) {
        return rot_sys_4(x, y, z);
    }
    else if (main_rot_sys == 5) {
        return rot_sys_5(x, y, z);
    }
}

function my_Translate(x, y, z) {
    // R1
    if (main_rot_sys == 1) {
        // R1_A
        if (which_r1 == 1) {
            translate(Math.cos(x % width ^ r1_a_d1) % r1_a_d2, y >> r1_a_d2, z / r1_a_d3);
        }
        // R1_B
        else if (which_r1 == 2) {
            translate(Math.cos(x % y ^ r1_b_d1) % r1_b_d2, y >> r1_b_d2, z / r1_b_d3);
        }
        // R1_C
        else if (which_r1 == 3) {
            translate(Math.cos(x % width ^ r1_c_d1) % r1_c_d2, y >> r1_c_d2, z / r1_c_d3);
        }
        // R1_D
        else if (which_r1 == 4) {
            translate(x >>> y, Math.cos(y % width ^ r1_d_d1) % r1_d_d2, z / r1_d_d2);
        }
        // R1_E
        else if (which_r1 == 5) {
            translate(x >>> y, Math.cos(y % width ^ r1_e_d1) % r1_e_d2, z / r1_e_d2);
        }
    }
    // R2
    else if (main_rot_sys == 2) {
        // R2_A
        if (which_r2 == 1) {
            translate(x % width >>> r2_a_d4, Math.sin(y / r2_a_d1), x / r2_a_d4);
        }
        // R2_B
        else if (which_r2 == 2) {
            translate(Math.tan(x % width >>> r2_b_d4) % r2_b_d2, Math.sin(y >> r2_b_d1), z / r2_b_d3);
        }
        // R2_C
        else if (which_r2 == 3) {
            translate(Math.sin(x % width >>> r2_c_d4) % r2_c_d2, Math.sin(y >> r2_c_d1), z / r2_c_d3);
        }
        // R2_D
        else if (which_r2 == 4) {
            translate(x / r2_d_d3, Math.cos(y / r2_d_d3), x / r2_d_d3);
        }
        // R2_E
        else if (which_r2 == 5) {
            translate(Math.atan(x / r2_e_d3), Math.tan(y % r2_e_d3), x / r2_e_d3);
        }
    }
    // R3
    else if (main_rot_sys == 3) {
        // R3_A
        if (which_r3 == 1) {
            translate(Math.atan(x >>> y % r3_a_d2), Math.atan(y >>> r3_a_d3 % x), z / r3_a_d2);
        }
        // R3_B
        else if (which_r3 == 2) {
            translate(Math.atan(x >>> width % r3_b_d1), Math.atan(y / height && r3_b_d3), z / r3_b_d2);
        }
        // R3_C
        else if (which_r3 == 3) {
            translate(Math.atan(x >>> width % x), Math.atan(y >> r3_c_d3 % height), z / r3_c_d4);
        }
         // R3_D
        else if (which_r3 == 4) {
            translate(Math.atan(x % r3_d_d2 >> y), Math.atan(y % r3_d_d3 >>> x), z / r3_d_d2);
        }   
         // R3_E
        else if (which_r3 == 5) {
            translate(Math.atan(x >>> y % r3_e_d2), Math.atan(y >>> r3_e_d3 % x), z / r3_e_d2);
        } 
    }
    // R4
    else if (main_rot_sys == 4) {
        // R4_A
        if (which_r4 == 1) {
            translate(Math.cos(x % width ^ r4_a_d1), Math.tan(y % height ^ r4_a_d1), z / r4_a_d2);
        }
        // R4_B
        else if (which_r4 == 2) {
            translate(Math.sin(x % width ^ r4_b_d1), Math.atan(y % height ^ r4_b_d1), z / r4_b_d2);
        }
        // R4_C
        else if (which_r4 == 3) {
            translate(Math.sin(x ^ width % r4_c_d1), Math.atan(y ^ height % r4_c_d1), z / r4_c_d3);
        }
        // R4_D
        else if (which_r4 == 4) {
            translate(Math.cos(x % width ^ r4_d_d1), Math.tan(y % height ^ r4_d_d1), z / r4_d_d2);
        }
        // R4_E
        else if (which_r4 == 5) {
            translate(Math.sin(x ^ width % r4_e_d1), Math.atan(y ^ height % r4_e_d1), z / r4_e_d2);
        }
    }
    // R5
    else if (main_rot_sys == 5) {
        // R5_A
        if (which_r5 == 1) {
            translate(Math.tan(x % r5_a_d5) * r5_a_d4, y >>> r5_a_d2, z / r5_a_d5);
        }
        // R5_B
        else if (which_r5 == 2) {
            translate(Math.tan(x % r5_b_d5) * r5_b_d4, y >>> r5_b_d2, z / r5_b_d5);
        }
        // R5_C
        else if (which_r5 == 3) {
            translate(Math.tan(x % r5_c_d5) * r5_c_d4, y >>> r5_c_d2, z / r5_c_d5);
        }
        // R5_D
        else if (which_r5 == 4) {
            translate(Math.sin(x % y) * r5_d_d5, y >>> r5_d_d3, z / r5_d_d2);
        }
        // R5_E
        else if (which_r5 == 5) {
            translate(Math.sin(x % y) * r5_e_d5, y >>> r5_e_d3, z / r5_e_d2);
        }
    }
}

function draw() {
    
    clear();
    background(255);
    ambientLight(255);
    
    if (lights_OnOff > 0.45) {
       myDirectionalLights(); 
    }

    
    // >>> BACKGROUND PLANE <<<
//    push();
//    translate(0, 0, -2000);
//    noStroke();
//    emissiveMaterial(255);
//    plane(5000, 5000);
//    pop();
    
    
    // >>> CAMERA POSITION <<<
    camera(0, 0, cam_pos, 0, 0, 0);

    
    // >>> DRAW GRID LOOPS <<<
    for (let gridY = 0; gridY < tileCount; gridY++) {
        for (let gridX = 0; gridX < tileCount; gridX++) {

            let posX = tileWidth * gridX + tileWidth / 2;
            let posY = tileHeight * gridY + tileHeight / 2;
            let posZ = tileDepth * gridY + tileDepth / 2;
            
            sizeX_ran_1 = map(fxrand(), 0, 1, 1, 10); 
            sizeY_ran_1 = map(fxrand(), 0, 1, 50, 700);
            sizeZ_ran_1 = sizeX_ran_1;
            
            push();
            
            
            // >>> ROTATIONS AND TRANSLATES <<<
            my_Rotation(posX, posY, posZ);
            my_Translate(posX, posY, posZ);

            // >>> MATERIAL AND STROKE <<<
            my_Material();
            my_StrokeWeight();
            my_Stroke();

            
            // >>> DRAW PRIMITIVES <<<
            // BOX
            // size sys 0: x & z same, y diff (outside loop)
            if (which_primitive == 0 && which_size_sys_1 == 0) {
                box(sizeX_abs_1, sizeY_abs_1, sizeZ_abs_1);
            }
            // size sys 2: x & z same, y diff (inside loop)
            else if (which_primitive == 0 && which_size_sys_1 == 1) {    
                box(sizeX_ran_1, sizeY_ran_1, sizeZ_ran_1); 
            }
            // CYLINDER
            // size sys 0: x & y diff (outside loop)
            else if (which_primitive == 1 && which_size_sys_2 == 0) {
                cylinder(sizeX_abs_1, sizeY_abs_1, 1, 1);
            }
            // size sys 1: x & y diff (inside loop)
            else if (which_primitive == 1 && which_size_sys_2 == 1) {
                cylinder(sizeX_ran_1, sizeY_ran_1, 1, 1);
            }

            pop();
        }
    }  
    
    noLoop();
    
    end = millis();
    elapsed = (end - start) / 1000;
    console.log('rendered');
    console.log('render time: ' + elapsed + 's');
    console.log('hash: ' + fxhash);

    setTimeout(fxpreview, 295000);
}

function my_Material() {
    if (which_material == 0) {
        return m_LaCroix();   
    }
    else if (which_material == 1) {
        return m_Black();   
    }
    else if (which_material == 2) {
        return m_Akira();   
    }
    else if (which_material == 3) {
        return m_KewGardens();   
    }
    else if (which_material == 4) {
        return m_4Dimension();   
    }
    else if (which_material == 5) {
        return m_SculptingTime();   
    }
    else if (which_material == 6) {
        return m_Avila();   
    }
    else if (which_material == 7) {
        return m_Hockney();   
    }
    else if (which_material == 8) {
        return m_EverythingNow();   
    }
    else if (which_material == 9) {
        return m_PcMusic();   
    }
    else if (which_material == 10) {
        return m_Miro();   
    }
    else if (which_material == 11) {
        return m_BlackLake();   
    }
    else if (which_material == 12) {
        return m_Vibrations();   
    }
    else if (which_material == 13) {
        return m_Ashish();   
    }
    else if (which_material == 14) {
        return m_Bucare();   
    }
    else {
        return m_Black();
    }
}

function my_StrokeWeight() {
    // THIN
    if (stroke_weight <= 0.5) {
        strokeWeight(map(fxrand(), 0, 1, 0.01, 0.45)); 
        //strokeWeight(0.50);
    }
    // MEDIUM
    else {
        strokeWeight(map(fxrand(), 0, 1, 0.05, 1));
        //strokeWeight(1);
    }
}

function my_Stroke() {
    if (stroke_c == 0) {
        return s_GhostsOfMyLife();
    }
    else if (stroke_c == 1){
        return s_Eve();     
    }
    else if (stroke_c == 2){
        return s_TooOldToDieYoung();     
    }
    else if (stroke_c == 3){
        return s_Life();     
    }
    else if (stroke_c == 4){
        return s_Summer2018();     
    }
    else if (stroke_c == 5){
        return s_N227AY();     
    }
    else if (stroke_c == 6){
        return s_Montero();     
    }
    else if (stroke_c == 7) {
        return s_E35TB();         
    }
    else if (stroke_c == 8) {
        return s_PlusPlus();         
    }
    else if (stroke_c == 9) {
        return s_Summer2016();         
    }
    else if (stroke_c == 10) {
        return s_FutureShock();         
    }
    else if (stroke_c == 11) {
        return s_Globalhead();         
    }
    else if (stroke_c == 12) {
        return s_Pasteque();         
    }
    else if (stroke_c == 13) {
        return s_ForestDark();         
    }
    else if (stroke_c == 14) {
        return s_BassProShops();         
    }
    else if (stroke_c == 15) {
        return s_VersacePython();         
    }
    else if (stroke_c == 16) {
        return s_JoseChungFromOuterSpace();         
    }
    else if (stroke_c == 17) {
        return s_MemoriesOfGreen();        
    }
    else if (stroke_c == 18) {
        return s_Riley();        
    }
    else if (stroke_c == 19) {
        return s_VCR();        
    }
    else {
        return s_GhostsOfMyLife();
    }
}

function m_LaCroix() {
    let laCroix = fxrand();
    if (laCroix <= 0.05) {
        specularMaterial(7, 196, 197); // #07c4c5
    }
    else if (laCroix > 0.05 && laCroix <= 0.1) {
        specularMaterial(2, 127, 220); // #027fdc
    }
    else if (laCroix > 0.1 && laCroix <= 0.15) {
        specularMaterial(2, 24, 162); // #0218a2
    }
    else if (laCroix > 0.15 && laCroix <= 0.2) {
        specularMaterial(255, 183, 3); // #ffb703
    }
    else if (laCroix > 0.2 && laCroix <= 0.25) {
        specularMaterial(247, 111, 115); // #f76f73    
    }
    else if (laCroix > 0.25 && laCroix <= 0.3) {
        specularMaterial(201, 0, 123); // #C9007B
    }
    else if (laCroix > 0.3 && laCroix <= 0.35) {
        specularMaterial(241, 124, 0); // #F17C00   
    }
    else if (laCroix > 0.35 && laCroix <= 0.4) {
        specularMaterial(3, 166, 60); // #03A63C
    }
    else if (laCroix > 0.4 && laCroix <= 0.45) {
        specularMaterial(147, 222, 0); // #93DE00
    }
    else if (laCroix > 0.45 && laCroix <= 0.5) {
        specularMaterial(240, 198, 231); // #F0C6E7   
    }
    else if (laCroix > 0.5 && laCroix <= 0.55) {
        specularMaterial(245, 227, 197); // #F5E3C5 
    }
    else if (laCroix > 0.55 && laCroix <= 0.6) {
        specularMaterial(255, 47, 0); // #FF2F00
    }
    else if (laCroix > 0.6 && laCroix <= 0.65) {
        specularMaterial(233, 229, 163); // #E9E5A3 
    }
    else if (laCroix > 0.65 && laCroix <= 0.7) {
        specularMaterial(108, 107, 159); // #6C6B9F 
    }
    else if (laCroix > 0.7 && laCroix <= 0.75) {
        specularMaterial(22, 38, 107); // #16266B 
    }
    else if (laCroix > 0.75 && laCroix <= 0.8) {
        specularMaterial(0, 182, 176); // #00B6B0
    }
    else if (laCroix > 0.8 && laCroix <= 0.85) {
        specularMaterial(164, 226, 0); // #A4E200 
    }
    else if (laCroix > 0.85 && laCroix <= 0.9) {
        specularMaterial(0, 0, 0); // #000000
    }
    else if (laCroix > 0.9 && laCroix <= 0.95) {
        specularMaterial(170, 198, 161); // #AAC6A1
    }
    else {
        specularMaterial(255, 255, 255); // #ffffff    
    } 
}

function m_Black() {
    let black = fxrand();
    if (black <= 0.25) {
        emissiveMaterial(0);
    }
    else {
        specularMaterial(0);   
    }
}

function m_Akira() {
    let akira = fxrand();
    if (akira <= 0.2) {
        specularMaterial(251, 0, 2); // #FB0002
    }
    else if (akira > 0.2 && akira <= 0.3) {
        specularMaterial(173, 3, 39); // #AD0327
    }
    else if (akira > 0.3 && akira <= 0.4) {
        specularMaterial(250, 17, 13); // #FA110D
    }
    else if (akira > 0.4 && akira <= 0.5) {
        specularMaterial(255, 255, 255); // #ffffff    
    }
    else if (akira > 0.5 && akira <= 0.55) {
        specularMaterial(226, 62, 87); // #E23E57  
    }
    else if (akira > 0.55 && akira <= 0.6) {
        specularMaterial(15, 20, 23); // #0F140D   
    }
    else if (akira > 0.6 && akira <= 0.65) {
        specularMaterial(0, 0, 0); // #000000
    }
    else if (akira > 0.65 && akira <= 0.7) {
        specularMaterial(224, 22, 10); // #E0160A
    }
    else if (akira > 0.7 && akira <= 0.75) {
        specularMaterial(215, 35, 35); // #D72323   
    }
    else if (akira > 0.75 && akira <= 0.8) {
        specularMaterial(215, 45, 65); // #D72D41 
    }
    else if (akira > 0.8 && akira <= 0.85) {
        specularMaterial(255, 223, 223); // #ffdfdf 
    }
    else if (akira > 0.85 && akira <= 0.9) {
        specularMaterial(247, 247, 247); // #f7f7f7 
    }
    else if (akira > 0.9 && akira <= 0.95) {
        specularMaterial(255, 235, 187); // #ffebbb 
    }
    else {
        specularMaterial(255, 165, 165); // #FFA5A5    
    } 
}

function m_KewGardens() {
    let kg = fxrand();
    if (kg <= 0.15) {
        specularMaterial(236, 250, 220); // #ECFADC
    }
    else if (kg > 0.15 && kg <= 0.2) { 
        specularMaterial(138, 155, 15); // #8a9b0f
    }
    else if (kg > 0.2 && kg <= 0.25) { 
        specularMaterial(1, 64, 5); // #014005
    }
    else if (kg > 0.25 && kg <= 0.3) { 
        specularMaterial(190, 227, 186); // #BEE3BA   
    }
    else if (kg > 0.3 && kg <= 0.35) { 
        specularMaterial(174, 220, 174); // #AEDCAE    
    }
    else if (kg > 0.35 && kg <= 0.4) { 
        specularMaterial(159, 212, 163); // #9FD4A3    
    }
    else if (kg > 0.4 && kg <= 0.45) { 
        specularMaterial(72, 89, 47); // #48592f     
    }
    else if (kg > 0.45 && kg <= 0.5) {  
        specularMaterial(242, 226, 196); // #f2e2c4 
    }
    else if (kg > 0.5 && kg <= 0.55) { 
        specularMaterial(140, 99, 48); // #8c6330
    }
    else if (kg > 0.55 && kg <= 0.575) { 
        specularMaterial(255, 170, 100); // #ffaa64
    }
    else if (kg > 0.575 && kg <= 0.65) { 
        specularMaterial(242, 212, 61); // #f2d43d  
    }
    else if (kg > 0.65 && kg <= 0.675) { 
        specularMaterial(153, 157, 242); // #999df2
    }
    else if (kg > 0.675 && kg <= 0.7) { 
        specularMaterial(242, 27, 45); // #f21b2d
    }
    else if (kg > 0.7 && kg <= 0.725) { 
        specularMaterial(166, 27, 15); // #a61b0f  
    }
    else if (kg > 0.725 && kg <= 0.8) { 
        specularMaterial(224, 251, 252); // #e0fbfc
    }
    else if (kg > 0.8 && kg <= 0.85) { 
        specularMaterial(234, 229, 198); // #eae5c6
    }
    else { 
        specularMaterial(190, 209, 128); // #bed180  
    }    
}

function m_4Dimension() {
    let dimen = fxrand();
    if (dimen <= 0.15) {
        specularMaterial(255, 212, 0); // #FFD400
    }
    else if (dimen > 0.15 && dimen <= 0.2) {
        specularMaterial(213, 39, 183); // #d527b7
    }
    else if (dimen > 0.2 && dimen <= 0.25) {
        specularMaterial(18, 44, 145); // #122c91
    }
    else if (dimen > 0.25 && dimen <= 0.3) {
        specularMaterial(222, 224, 230); // #dee0e6
    }
    else if (dimen > 0.3 && dimen <= 0.35) {
        specularMaterial(255, 190, 0); // #ffbe00    
    }
    else if (dimen > 0.35 && dimen <= 0.4) {
        specularMaterial(250, 105, 0); // #fa6900 
    }
    else if (dimen > 0.4 && dimen <= 0.45) {
        specularMaterial(221, 28, 26); // #dd1c1a
    }
    else if (dimen > 0.45 && dimen <= 0.5) {
        specularMaterial(215, 35, 35); // #d72323    
    }
    else if (dimen > 0.5 && dimen <= 0.55) {
        specularMaterial(1, 112, 186); // #0270ba     
    }
    else if (dimen > 0.55 && dimen <= 0.6) {
        specularMaterial(68, 58, 69); // #443a45    
    }
    else if (dimen > 0.6 && dimen <= 0.7) {
        specularMaterial(255, 255, 255); // #ffffff
    }
    else {
        specularMaterial(0, 0, 0); // #000000     
    }         
}

function m_SculptingTime() {
    let sculpting = fxrand();
    if (sculpting <= 0.4) {
        specularMaterial(0, 0, 0); // #000000
    }
    else if (sculpting > 0.4 && sculpting <= 0.5) {
        specularMaterial(230, 0, 0); // #e60000
    }
    else if (sculpting > 0.5 && sculpting <= 0.6) {
        specularMaterial(255, 255, 255); // #ffffff
    }
    else if (sculpting > 0.6 && sculpting <= 0.65) {
        specularMaterial(236, 232, 223); // #ece8df
    }
    else if (sculpting > 0.65 && sculpting <= 0.7) {
        specularMaterial(204, 0, 0); // #cc0000
    }
    else if (sculpting > 0.7 && sculpting <= 0.75) {
        specularMaterial(210, 62, 49); // #d23e31
    }
    else if (sculpting > 0.75 && sculpting <= 0.8) {
        specularMaterial(245, 245, 245); // #f5f5f5
    }
    else if (sculpting > 0.8 && sculpting <= 0.85) {
        specularMaterial(235, 59, 36); // #eb3b24
    }
    else if (sculpting > 0.85 && sculpting <= 0.9) {
        specularMaterial(221, 20, 0); // #dd1400
    }
    else if (sculpting > 0.9 && sculpting <= 0.95) {
        specularMaterial(106, 16, 18); // #6a1012
    }
    else {
        specularMaterial(168, 29, 28); // #a81d1c
    }
}

function m_Avila() {
    let avila = fxrand();
    if (avila <= 0.2) {
        specularMaterial(18, 73, 47); // #12492f
    }
    else if (avila > 0.2 && avila <= 0.3) {
        specularMaterial(58, 158, 253); // #3a9efd
    }
    else if (avila > 0.3 && avila <= 0.4) {
        specularMaterial(103, 145, 134); // #679186
    }
    else if (avila > 0.4 && avila <= 0.5) {
        specularMaterial(78, 99, 55); // #4e6337
    }
    else if (avila > 0.5 && avila <= 0.55) {
        specularMaterial(187, 212, 206); // #bbd4ce 
    }
    else if (avila > 0.55 && avila <= 0.6) {
        specularMaterial(138, 155, 15); // #8a9b0f
    }
    else if (avila > 0.6 && avila <= 0.65) {
        specularMaterial(72, 89, 47); // #48592f  
    }
    else if (avila > 0.65 && avila <= 0.7) {
        specularMaterial(191, 152, 80); // #bf9850
    }
    else if (avila > 0.7 && avila <= 0.75) {
        specularMaterial(163, 222, 131); // #a3de83   
    }
    else if (avila > 0.75 && avila <= 0.775) {
        specularMaterial(244, 241, 187); // #f4f1bb
    }
    else if (avila > 0.775 && avila <= 0.8) {
        specularMaterial(255, 255, 255); // #ffffff
    }
    else if (avila > 0.8 && avila <= 0.825) {
        specularMaterial(242, 84, 27); // #f2541b
    }
    else if (avila > 0.825 && avila <= 0.85) {
        specularMaterial(242, 203, 5); // #f2cb05
    }
    else if (avila > 0.85 && avila <= 0.875) {
        specularMaterial(217, 40, 24); // #d92818
    }
    else if (avila > 0.875 && avila <= 0.9) {
        specularMaterial(239, 247, 246); // #eff7f6
    }
    else if (avila > 0.9 && avila <= 0.925) {
        specularMaterial(62, 36, 25); // #3e2419
    }
    else if (avila > 0.925 && avila <= 0.95) {
        specularMaterial(254, 242, 0); // #fef200
    }
    else if (avila > 0.95 && avila <= 0.975) {
        specularMaterial(255, 211, 182); // #ffd3b6
    }
    else {
        specularMaterial(227, 253, 253); // #e3fdfd    
    }         
}

function m_Hockney() {
    let hockney = fxrand();
    if (hockney <= 0.1) {
        specularMaterial(4, 138, 191); // #048ABF
    }
    else if (hockney > 0.1 && hockney <= 0.15) {
        specularMaterial(4, 178, 217); // #04B2D9
    }
    else if (hockney > 0.15 && hockney <= 0.2) {
        specularMaterial(236, 245, 240); // #ECF5F0
    }
    else if (hockney > 0.2 && hockney <= 0.25) {
        specularMaterial(4, 191, 191); // #04BFBF
    }
    else if (hockney > 0.25 && hockney <= 0.3) {
        specularMaterial(242, 177, 153); // #F2B199
    }
    else if (hockney > 0.3 && hockney <= 0.35) {
        specularMaterial(118, 179, 52); // #76B334
    }
    else if (hockney > 0.35 && hockney <= 0.4) {
        specularMaterial(255, 248, 244); // #FFF8F4
    }
    else if (hockney > 0.4 && hockney <= 0.45) {
        specularMaterial(242, 225, 194); // #F2E1C2    
    }
    else if (hockney > 0.45 && hockney <= 0.5) {
        specularMaterial(221, 246, 242); // #DDF6F2    
    }
    else if (hockney > 0.5 && hockney <= 0.6) {
        specularMaterial(105, 181, 109); // #69B56D   
    }
    else if (hockney > 0.6 && hockney <= 0.635) {
        specularMaterial(214, 40, 40); // #d62828   
    }
    else if (hockney > 0.635 && hockney <= 0.670) {
        specularMaterial(217, 78, 78); // #D94E4E
    }
    else if (hockney > 0.670 && hockney <= 0.7) {
        specularMaterial(224, 252, 255); // #E0FCFF
    }
    else if (hockney > 0.7 && hockney <= 0.75) {
        specularMaterial(252, 91, 73); // #fcbf49     
    } 
    else if (hockney > 0.75 && hockney <= 0.8) {
        specularMaterial(144, 242, 255); // #90F2FF     
    } 
    else if (hockney > 0.8 && hockney <= 0.85) {
        specularMaterial(34, 116, 165); // #2274a5     
    }  
    else if (hockney > 0.85 && hockney <= 0.9) {
        specularMaterial(224, 139, 75); // #E08B4B     
    }  
    else if (hockney > 0.9 && hockney <= 0.95) {
        specularMaterial(229, 229, 229); // #e5e5e5     
    }  
    else if (hockney > 0.95 && hockney <= 0.975) {
        specularMaterial(20, 33, 61); // #14213d     
    } 
    else {
        specularMaterial(237, 242, 82); // #EDF252  
    }
}

function m_EverythingNow() {
    let en = fxrand();
    if (en <= 0.1) {
        specularMaterial(95, 66, 90); // #5F425A
    }
    else if (en > 0.1 && en <= 0.125) {
        specularMaterial(250, 232, 4); // #fae804
    }
    else if (en > 0.125 && en <= 0.15) {
        specularMaterial(255, 255, 153); // #ffff8f
    }
    else if (en > 0.15 && en <= 0.2) {
        specularMaterial(206, 171, 106); // #f8ecfd
    }
    else if (en > 0.2 && en <= 0.25) {
        specularMaterial(241, 156, 156); // #F19C9C
    }
    else if (en > 0.25 && en <= 0.3) {
        specularMaterial(248, 236, 253); // #cbc9ff
    }
    else if (en > 0.3 && en <= 0.4) {
        specularMaterial(250, 188, 168); // #FABCA8
    }
    else if (en > 0.4 && en <= 0.45) {
        specularMaterial(46, 27, 43); // #2E1B2B
    }
    else if (en > 0.45 && en <= 0.5) {
        specularMaterial(112, 93, 153); // #705D99
    }
    else if (en > 0.5 && en <= 0.55) {
        specularMaterial(140, 122, 185); // #8C7AB9
    }
    else if (en > 0.55 && en <= 0.6) {
        specularMaterial(152, 81, 81); // #985151
    }
    else if (en > 0.6 && en <= 0.65) {
        specularMaterial(54, 15, 51); // #360f33
    }
    else if (en > 0.65 && en <= 0.7) {
        specularMaterial(188, 172, 212); // #BCACD4
    }
    else if (en > 0.7 && en <= 0.75) {
        specularMaterial(238, 108, 77); // #ee6c4d
    }
    else if (en > 0.75 && en <= 0.8) {
        specularMaterial(255, 191, 105); // #ffbf69
    }
    else if (en > 0.8 && en <= 0.85) {
        specularMaterial(250, 176, 114); // #fab072
    }
    else if (en > 0.85 && en <= 0.875) {
        specularMaterial(211, 63, 74); // #d33f4a
    }
    else if (en > 0.875 && en <= 0.9) {
        specularMaterial(94, 17, 61); // #5e113d
    }
    else if (en > 0.9 && en <= 0.95) {
        specularMaterial(206, 171, 176); // #ceabb0
    }
    else {
        specularMaterial(165, 125, 137); // #A57D89  
    }
}

function m_PcMusic() {
    normalMaterial();
}

function m_Miro() {
    let miro = fxrand();
    if (miro <= 0.15) {
        specularMaterial(253, 232, 203); // #fde8cb
    }
    else if (miro > 0.15 && miro <= 0.2) {
        specularMaterial(255, 253, 246); // #fffdf6
    }
    else if (miro > 0.2 && miro <= 0.3) {
        specularMaterial(141, 198, 255); // #8dc6ff
    }
    else if (miro > 0.3 && miro <= 0.35) {
        specularMaterial(240, 104, 104); // #f06868    
    }
    else if (miro > 0.35 && miro <= 0.4) {
        specularMaterial(215, 35, 35); // #d72323     
    }
    else if (miro > 0.4 && miro <= 0.45) {
        specularMaterial(0, 47, 167); // #002fa7
    }
    else if (miro > 0.45 && miro <= 0.5) {
        specularMaterial(31, 171, 137); // #1fab89    
    }
    else if (miro > 0.5 && miro <= 0.55) {
        specularMaterial(253, 253, 0); // #fdfd00     
    }
    else if (miro > 0.55 && miro <= 0.6) {
        specularMaterial(248, 241, 226); // #f8f1e2     
    }
    else if (miro > 0.6 && miro <= 0.625) {
        specularMaterial(106, 20, 12); // #6a140c
    }
    else if (miro > 0.625 && miro <= 0.65) {
        specularMaterial(187, 0, 0); // #bb0000
    }
    else if (miro > 0.65 && miro <= 0.7) {
        specularMaterial(217, 242, 255); // #d9f2ff
    }
    else {
        specularMaterial(0, 0, 0); // #000000    
    }         
}

function m_BlackLake() {
    let blackLake = fxrand();
    if (blackLake <= 0.2) {
        specularMaterial(0, 0, 0); // #000000
    }
    else if (blackLake > 0.2 && blackLake <= 0.3) {
        specularMaterial(219, 226, 239); // #dbe2ef
    }
    else if (blackLake > 0.3 && blackLake <= 0.4) {
        specularMaterial(158, 62, 50); // #9e3e32
    }
    else if (blackLake > 0.4 && blackLake <= 0.5) {
        specularMaterial(63, 64, 100); // #3f4064 
    }
    else if (blackLake > 0.5 && blackLake <= 0.6) {
        specularMaterial(35, 49, 66); // #233142     
    }
    else if (blackLake > 0.6 && blackLake <= 0.7) {
        specularMaterial(95, 91, 73); // #5f5b49
    }
    else if (blackLake > 0.7 && blackLake <= 0.75) {
        specularMaterial(255, 254, 250); // #fffefa    
    }
    else if (blackLake > 0.75 && blackLake <= 0.8) {
        specularMaterial(0, 69, 244); // #0045f4     
    }
    else if (blackLake > 0.8 && blackLake <= 0.825) {
        specularMaterial(146, 177, 255); // #92b1ff     
    }
    else if (blackLake > 0.825 && blackLake <= 0.85) {
        specularMaterial(0, 42, 146); // #002a92
    }
    else if (blackLake > 0.85 && blackLake <= 0.9) {
        specularMaterial(125, 249, 255); // #7df9ff
    }
    else if (blackLake > 0.9 && blackLake <= 0.95) {
        specularMaterial(183, 191, 133); // #b7bf85
    }
    else {
        specularMaterial(37, 27, 27); // #25251b    
    }         
}

function m_Vibrations() {
    let vibrations = fxrand();
    if (vibrations <= 0.3) {
        specularMaterial(0, 0, 0); // #000000
    }
    else if (vibrations > 0.3 && vibrations <= 0.5) {
        specularMaterial(255, 255, 255); // #ffffff
    }
    else if (vibrations > 0.5 && vibrations <= 0.55) {
        specularMaterial(57, 50, 50); // #393232
    }
    else if (vibrations > 0.55 && vibrations <= 0.6) {
        specularMaterial(220, 220, 221); // #dcdcdd
    }
    else if (vibrations > 0.6 && vibrations <= 0.625) {
        specularMaterial(242, 185, 15); // #f2b90f
    }
    else if (vibrations > 0.625 && vibrations <= 0.65) {
        specularMaterial(242, 203, 5); // #f2cb05
    }
    else if (vibrations > 0.65 && vibrations <= 0.675) {
        specularMaterial(191, 19, 4); // #bf1304
    }
    else if (vibrations > 0.675 && vibrations <= 0.7) {
        specularMaterial(211, 217, 167); // #d3d9a7
    }
    else if (vibrations > 0.7 && vibrations <= 0.725) {
        specularMaterial(38, 64, 34); // #264022
    }
    else if (vibrations > 0.725 && vibrations <= 0.75) {
        specularMaterial(21, 52, 119); // #153477
    }
    else if (vibrations > 0.75 && vibrations <= 0.8) {
        specularMaterial(0, 64, 224); // #0040e0
    }
    else if (vibrations > 0.8 && vibrations <= 0.825) {
        specularMaterial(7, 127, 146); // #077f92
    }
    else if (vibrations > 0.825 && vibrations <= 0.85) {
        specularMaterial(230, 97, 17); // #e66111
    }
    else if (vibrations > 0.85 && vibrations <= 0.9) {
        specularMaterial(161, 174, 198); // #a1aec6
    }
    else {
        specularMaterial(248, 241, 2); // #f8f1e2  
    }
}

function m_Ashish() {
    let ashish = fxrand();
    if (ashish <= 0.2) {
        specularMaterial(0, 0, 0); // #000000
    }
    else if (ashish > 0.2 && ashish <= 0.3) {
        specularMaterial(249, 198, 31); // #f9c61f
    }
    else if (ashish > 0.3 && ashish <= 0.4) {
        specularMaterial(254, 238, 126); // #feee7e
    }
    else if (ashish > 0.4 && ashish <= 0.5) {
        specularMaterial(0, 148, 62); // #00943e
    }
    else if (ashish > 0.5 && ashish <= 0.55) {
        specularMaterial(255, 0, 255); // #ff00ff     
    }
    else if (ashish > 0.55 && ashish <= 0.6) {
        specularMaterial(204, 0, 0); // #cc0000
    }
    else if (ashish > 0.6 && ashish <= 0.65) {
        specularMaterial(147, 112, 219); // #9370db    
    }
    else if (ashish > 0.65 && ashish <= 0.7) {
        specularMaterial(255, 233, 236); // #ffe9ec
    }
    else if (ashish > 0.7 && ashish <= 0.75) {
        specularMaterial(146, 180, 242); // #92b4f2     
    }
    else if (ashish > 0.75 && ashish <= 0.8) {
        specularMaterial(214, 227, 250); // #d6e3fa
    }
    else if (ashish > 0.8 && ashish <= 0.825) {
        specularMaterial(227, 250, 214); // #e3fad6
    }
    else if (ashish > 0.825 && ashish <= 0.85) {
        specularMaterial(165, 238, 124); // #a5ee7c
    }
    else if (ashish > 0.85 && ashish <= 0.9) {
        specularMaterial(0, 0, 128); // #000080
    }
    else {
        specularMaterial(204, 204, 204); // #cccccc    
    }         
}

function m_Bucare() {
    let bucare = fxrand();
    if (bucare <= 0.2) {
        specularMaterial(250, 105, 0); // #fa6900
    }
    else if (bucare > 0.2 && bucare <= 0.3) {
        specularMaterial(243, 134, 48); // #f38630
    }
    else if (bucare > 0.3 && bucare <= 0.4) {
        specularMaterial(252, 145, 58); // #fc913a
    }
    else if (bucare > 0.4 && bucare <= 0.5) {
        specularMaterial(249, 212, 35); // #f9d423
    }
    else if (bucare > 0.5 && bucare <= 0.6) {
        specularMaterial(166, 114, 68); // #a67244
    }
    else if (bucare > 0.6 && bucare <= 0.7) {
        specularMaterial(89, 48, 24); // #593018
    }
    else if (bucare > 0.7 && bucare <= 0.75) {
        specularMaterial(242, 92, 5); // #f25c05
    }
    else if (bucare > 0.75 && bucare <= 0.8) {
        specularMaterial(242, 183, 5); // #f2b705
    }
    else if (bucare > 0.8 && bucare <= 0.85) {
        specularMaterial(242, 81, 22); // #f25116
    }
    else {
        specularMaterial(0, 191, 255); // #00bfff  
    }
}

function s_GhostsOfMyLife() {
    let ghosts = fxrand();
    if (ghosts <= 0.2) {
        stroke(227, 253, 253); // #e3fdfd
    }
    else if (ghosts > 0.2 && ghosts <= 0.3) { 
        stroke(202, 222, 252); // #cadefc
    }
    else if (ghosts > 0.3 && ghosts <= 0.4) {
        stroke(152, 193, 217); // #98c1d9
    }
    else if (ghosts > 0.4 && ghosts <= 0.5) {
        stroke(220, 181, 255); // #dcb5ff
    }
    else if (ghosts > 0.5 && ghosts <= 0.6) {
        stroke(252, 200, 248); // #fcc8f8
    }
    else if (ghosts > 0.6 && ghosts <= 0.65) { 
        stroke(255, 245, 165); // #fff5a5
    }
    else if (ghosts > 0.65 && ghosts <= 0.7) {
        stroke(225, 245, 196); // #e1f5c4
    }
    else if (ghosts > 0.7 && ghosts <= 0.75) { 
        stroke(255, 209, 102); // #ffd166
    }
    else if (ghosts > 0.75 && ghosts <= 0.8) {
        stroke(227, 246, 245); // #e3f6f5
    }
    else if (ghosts > 0.8 && ghosts <= 0.85) {
        stroke(242, 233, 228); // #f2e9e4
    }
    else if (ghosts > 0.85 && ghosts <= 0.9) {
        stroke(255, 154, 60); // #ff9a3c 
    }
    else {
        stroke(255, 255, 255);  // #ffffff
    }
}

function s_Eve() {
    let eve = fxrand();
    if (eve <= 0.2) {
        stroke(0, 0, 0); // #000000
    }
    else if (eve > 0.2 && eve <= 0.3) { 
        stroke(13, 13, 13); // #0d0d0d
    }
    else if (eve > 0.3 && eve <= 0.4) {
        stroke(8, 7, 5); // #080705
    }
    else if (eve > 0.4 && eve <= 0.45) {
        stroke(219, 237, 243); // #dbedf3
    }
    else if (eve > 0.45 && eve <= 0.5) {
        stroke(255, 206, 243); // #ffcef3
    }
    else if (eve > 0.5 && eve <= 0.55) {
        stroke(213, 39, 183); // #d527b7
    }
    else if (eve > 0.55 && eve <= 0.6) {
        stroke(255, 255, 255); // #ffffff
    }
    else if (eve > 0.6 && eve <= 0.65) { 
        stroke(187, 0, 0); // #bb0000
    }
    else if (eve > 0.65 && eve <= 0.7) {
        stroke(250, 45, 25); // #fa2d19
    }
    else if (eve > 0.7 && eve <= 0.75) { 
        stroke(249, 237, 105); // #f9ed69
    }
    else if (eve > 0.75 && eve <= 0.8) {
        stroke(99, 107, 53); // #636b35
    }
    else if (eve > 0.8 && eve <= 0.85) {
        stroke(164, 217, 50); // #a4d932
    }
    else if (eve > 0.85 && eve <= 0.9) {
        stroke(0, 166, 237); // #00a6ed
    }
    else {
        stroke(222, 252, 249);  // #defcf9
    }
}

function s_TooOldToDieYoung() {
    let totdy = fxrand();
    if (totdy <= 0.2) {
        stroke(187, 0, 0); // #bb0000
    }
    else if (totdy > 0.2 && totdy <= 0.3) { 
        stroke(255, 8, 8); // #ff0808
    }
    else if (totdy > 0.3 && totdy <= 0.4) {
        stroke(255, 204, 153); // #ffcc99
    }
    else if (totdy > 0.4 && totdy <= 0.45) {
        stroke(247, 163, 37); // #f7a325
    }
    else if (totdy > 0.45 && totdy <= 0.5) {
        stroke(255, 203, 0); // #ffcb00
    }
    else if (totdy > 0.5 && totdy <= 0.55) {
        stroke(58, 158, 253); // #3a9efd
    }
    else if (totdy > 0.55 && totdy <= 0.6) {
        stroke(18, 44, 145); // #122c91
    }
    else if (totdy > 0.6 && totdy <= 0.65) {
        stroke(153, 184, 152); // #99b898
    }
    else if (totdy > 0.65 && totdy <= 0.675) {
        stroke(224, 251, 252); // #e0fbfc
    }
    else if (totdy > 0.675 && totdy <= 0.725) {
        stroke(201, 173, 167); // #c9ada7
    }
    else if (totdy > 0.725 && totdy <= 0.75) {
        stroke(255, 255, 255); // #ffffff
    }
    else if (totdy > 0.75 && totdy <= 0.8) {
        stroke(129, 22, 72); // #811648
    }
    else if (totdy > 0.8 && totdy <= 0.95) {
        stroke(0, 0, 0); // #000000
    }
    else {
        stroke(250, 232, 4);  // #fae804
    }
}

function s_Life() {
    let life = fxrand();
    if (life <= 0.1) {
        stroke(0, 47, 167); //#002fa7
    }
    else if (life > 0.1 && life <= 0.2) {
        stroke(0, 136, 204); // #0088cc
    }
    else if (life > 0.2 && life <= 0.3) {
        stroke(0, 0, 0); // #000000
    }
    else if (life > 0.3 && life <= 0.4) {
        stroke(2, 0, 1); // #020001
    }
    else if (life > 0.4 && life <= 0.5) {
        stroke(0, 14, 49); // #000e31
    }
    else if (life > 0.5 && life <= 0.55) {
        stroke(248, 175, 158); // #f8af9e
    }
    else if (life > 0.55 && life <= 0.6) {
        stroke(249, 235, 201); // #f9ebc9
    }
    else if (life > 0.6 && life <= 0.65) {
        stroke(255, 132, 123); // #ff847b
    }
    else if (life > 0.65 && life <= 0.7) {
        stroke(143, 1, 0); // #8f0100
    }
    else if (life > 0.7 && life <= 0.8) {
        stroke(216, 174, 211); // #d8aed3
    }
    else if (life > 0.8 && life <= 0.85) {
        stroke(204, 0, 0); // #cc0000
    }
    else if (life > 0.85 && life <= 0.9) {
        stroke(145, 130, 196); // #9182c4
    }
    else {
        stroke(206, 220, 255); // #cedcff
    }
}

function s_Summer2018() {
    let summer18 = fxrand();
    if (summer18 <= 0.15) {
        stroke(0, 0, 0); //#000000
    }
    else if (summer18 > 0.15 && summer18 <= 0.2) {
        stroke(239, 247, 246); // #eff7f6
    }
    else if (summer18 > 0.2 && summer18 <= 0.3) {
        stroke(224, 251, 252); // #e0fbfc
    }
    else if (summer18 > 0.3 && summer18 <= 0.4) {
        stroke(169, 188, 208); // #a9bcd0
    }
    else if (summer18 > 0.4 && summer18 <= 0.5) {
        stroke(249, 237, 105); // #f9ed69
    }
    else if (summer18 > 0.5 && summer18 <= 0.55) {
        stroke(215, 35, 35); // #d72323
    }
    else if (summer18 > 0.55 && summer18 <= 0.6) {
        stroke(125, 195, 131); // #7dc383
    }
    else if (summer18 > 0.6 && summer18 <= 0.65) {
        stroke(255, 226, 173); // #ffe2ad
    }
    else if (summer18 > 0.65 && summer18 <= 0.7) {
        stroke(255, 154, 60); // #ff9a3c
    }
    else if (summer18 > 0.7 && summer18 <= 0.75) {
        stroke(89, 13, 130); // #590d82
    }
    else if (summer18 > 0.75 && summer18 <= 0.8) {
        stroke(14, 104, 173); // #0e68ad
    }
    else if (summer18 > 0.8 && summer18 <= 0.85) {
        stroke(255, 255, 255); // #ffffff
    }
    else if (summer18 > 0.85 && summer18 <= 0.9) {
        stroke(255, 207, 223); // #ffcfdf
    }
    else {
        stroke(0, 0, 0); // #000000
    }
}

function s_N227AY() {
    let n227ay = fxrand();
    if (n227ay <= 0.2) {
        stroke(70, 136, 82); // #468852
    }
    else if (n227ay > 0.2 && n227ay <= 0.3) {
        stroke(78, 99, 55); // #4e6337
    }
    else if (n227ay > 0.3 && n227ay <= 0.4) {
        stroke(25, 68, 28); // #19441c
    }
    else if (n227ay > 0.4 && n227ay <= 0.5) {
        stroke(0, 112, 198); // #0070c6
    }
    else if (n227ay > 0.5 && n227ay <= 0.55) {
        stroke(255, 255, 255); // #ffffff
    }
    else if (n227ay > 0.55 && n227ay <= 0.575) {
        stroke(204, 0, 0); // #cc0000
    }
    else if (n227ay > 0.575 && n227ay <= 0.6) {
        stroke(220, 5, 2); // #dc0502
    }
    else if (n227ay > 0.6 && n227ay <= 0.625) {
        stroke(50, 72, 133); // #324885
    }
    else if (n227ay > 0.625 && n227ay <= 0.65) {
        stroke(162, 205, 242); // #a2cdf2
    }
    else if (n227ay > 0.65 && n227ay <= 0.7) {
        stroke(225, 245, 196); // #e1f5c4
    }
    else if (n227ay > 0.7 && n227ay <= 0.75) {
        stroke(203, 232, 107); // #cbe86b
    }
    else if (n227ay > 0.75 && n227ay <= 0.775) {
        stroke(115, 41, 68); // #732944
    }
    else if (n227ay > 0.775 && n227ay <= 0.8) {
        stroke(105, 48, 109); // #69306d
    }
    else if (n227ay > 0.8 && n227ay <= 0.9) {
        stroke(14, 16, 61); // #0e103d
    }
    else {
        stroke(243, 233, 210); // #f3e9d2
    }
}

function s_Montero() {
    let montero = fxrand();
    if (montero <= 0.2) {
        stroke(224, 228, 204); // #e0e4cc
    }
    else if (montero > 0.2 && montero <= 0.3) {
        stroke(255, 154, 0); // #ff9a00
    }
    else if (montero > 0.3 && montero <= 0.4) {
        stroke(234, 226, 183); // #eae2b7
    }
    else if (montero > 0.4 && montero <= 0.5) {
        stroke(242, 233, 228); // #f2e9e4
    }
    else if (montero > 0.5 && montero <= 0.6) {
        stroke(224, 251, 252); // #e0fbfc
    }
    else if (montero > 0.6 && montero <= 0.7) {
        stroke(184, 190, 221); // #b8bedd
    }
    else if (montero > 0.7 && montero <= 0.8) {
        stroke(7, 32, 83); // #072053
    }
    else if (montero > 0.8 && montero <= 0.85) {
        stroke(153, 157, 242); // #999df2
    }
    else if (montero > 0.85 && montero <= 0.95) {
        stroke(255, 207, 223); // #ffcfdf
    }
    else {
        stroke(255, 255, 255); // #ffffff
    }
}

function s_E35TB() {
    let e35tb = fxrand();
    if (e35tb <= 0.2) {
        stroke(228, 212, 207); // #e4d4cf
    }
    else if (e35tb > 0.2 && e35tb <= 0.3) {
        stroke(223, 28, 10); // #df1c0a
    }
    else if (e35tb > 0.3 && e35tb <= 0.35) {
        stroke(237, 210, 203); // #edd2cb
    }
    else if (e35tb > 0.35 && e35tb <= 0.4) {
        stroke(94, 92, 103); // #5e5c67
    }
    else if (e35tb > 0.4 && e35tb <= 0.45) {
        stroke(79, 93, 117); // #4f5d75
    }
    else if (e35tb > 0.45 && e35tb <= 0.5) {
        stroke(115, 2, 23); // #730217
    }
    else if (e35tb > 0.5 && e35tb <= 0.6) {
        stroke(164, 217, 50); // #a4d932
    }
    else if (e35tb > 0.6 && e35tb <= 0.7) {
        stroke(242, 135, 5); // #f28705
    }
    else if (e35tb > 0.7 && e35tb <= 0.8) {
        stroke(73, 177, 242); // #49b1f2
    }
    else if (e35tb > 0.8 && e35tb <= 0.85) {
        stroke(170, 150, 218); // #aa96da
    }
    else if (e35tb > 0.85 && e35tb <= 0.9) {
        stroke(252, 227, 138); // #fce38a
    }
    else {
        stroke(233, 239, 242); // #e9eff2
    }
}

function s_PlusPlus() {
    let plusPlus = fxrand();
    if (plusPlus <= 0.2) {
        stroke(248, 202, 0); // #f8ca00
    }
    else if (plusPlus > 0.2 && plusPlus <= 0.3) {
        stroke(242, 5, 5); // #f20505
    }
    else if (plusPlus > 0.3 && plusPlus <= 0.4) {
        stroke(140, 7, 18); // #8c0712
    }
    else if (plusPlus > 0.4 && plusPlus <= 0.45) {
        stroke(242, 92, 5); // #f25c05
    }
    else if (plusPlus > 0.45 && plusPlus <= 0.5) {
        stroke(253, 231, 76); // #fde74c
    }
    else if (plusPlus > 0.5 && plusPlus <= 0.55) {
        stroke(2, 112, 186); // #0270ba
    }
    else if (plusPlus > 0.55 && plusPlus <= 0.6) {
        stroke(227, 253, 253); // #e3fdfd
    }
    else if (plusPlus > 0.6 && plusPlus <= 0.625) {
        stroke(2, 1, 88); // #020158
    }
    else if (plusPlus > 0.625 && plusPlus <= 0.65) {
        stroke(255, 255, 255); // #ffffff
    }
    else if (plusPlus > 0.65 && plusPlus <= 0.675) {
        stroke(102, 57, 166); // #6639a6
    }
    else if (plusPlus > 0.675 && plusPlus <= 0.7) {
        stroke(105, 156, 120); // #699c78
    }
    else if (plusPlus > 0.7 && plusPlus <= 0.8) {
        stroke(255, 143, 86); // #ff8f56
    }
    else if (plusPlus > 0.8 && plusPlus <= 0.9) {
        stroke(255, 254, 228); // #fffee4
    }
    else {
        stroke(136, 48, 78); // #88304e
    }
}

function s_Summer2016() {
    let summer16 = fxrand();
    if (summer16 <= 0.2) {
        stroke(249, 207, 148); // #f9cf94
    }
    else if (summer16 > 0.2 && summer16 <= 0.3) {
        stroke(255, 211, 182); // #ffd3b6
    }
    else if (summer16 > 0.3 && summer16 <= 0.4) {
        stroke(249, 247, 247); // #f9f7f7
    }
    else if (summer16 > 0.4 && summer16 <= 0.45) {
        stroke(255, 255, 255); // #ffffff
    }
    else if (summer16 > 0.45 && summer16 <= 0.5) {
        stroke(233, 142, 16); // #e98e10
    }
    else if (summer16 > 0.5 && summer16 <= 0.55) {
        stroke(253, 214, 172); // #fdd6ac
    }
    else if (summer16 > 0.55 && summer16 <= 0.6) {
        stroke(0, 112, 198); // #0070c6
    }
    else if (summer16 > 0.6 && summer16 <= 0.625) {
        stroke(254, 233, 176); // #fee9b0
    }
    else if (summer16 > 0.625 && summer16 <= 0.65) {
        stroke(223, 28, 10); // #df1c0a
    }
    else if (summer16 > 0.65 && summer16 <= 0.675) {
        stroke(244, 111, 33); // #f46f21
    }
    else if (summer16 > 0.675 && summer16 <= 0.7) {
        stroke(254, 200, 216); // #fec8d8
    }
    else if (summer16 > 0.7 && summer16 <= 0.725) {
        stroke(110, 204, 120); // #6ecc78
    }
    else if (summer16 > 0.725 && summer16 <= 0.75) {
        stroke(203, 241, 245); // #cbf1f5
    }
    else if (summer16 > 0.75 && summer16 <= 0.775) {
        stroke(142, 166, 180); // #8ea6b4
    }
    else if (summer16 > 0.775 && summer16 <= 0.8) {
        stroke(219, 226, 239); // #dbe2ef
    }
    else if (summer16 > 0.8 && summer16 <= 0.85) {
        stroke(204, 163, 122); // #cca37a
    }
    else if (summer16 > 0.85 && summer16 <= 0.9) {
        stroke(7, 43, 89); // #072b59
    }
    else if (summer16 > 0.9 && summer16 <= 0.925) {
        stroke(72, 89, 34); // #485922
    }
    else if (summer16 > 0.925 && summer16 <= 0.95) {
        stroke(191, 188, 186); // #bfbcba
    }
    else {
        stroke(197, 126, 2); // #c57e02
    }
}

function s_FutureShock() {
    let future = fxrand();
    if (future <= 0.2) {
        stroke(0, 0, 0); // #000000
    }
    else if (future > 0.2 && future <= 0.3) {
        stroke(255, 59, 157); // #ff3b9d
    }
    else if (future > 0.3 && future <= 0.4) {
        stroke(255, 196, 226); // #ffc4e2
    }
    else if (future > 0.4 && future <= 0.5) {
        stroke(255, 137, 196); // #ff89c4
    }
    else if (future > 0.5 && future <= 0.6) {
        stroke(252, 81, 133); // #fc5185
    }
    else if (future > 0.6 && future <= 0.615) {
        stroke(27, 62, 161); // #1b3ea1
    }
    else if (future > 0.615 && future <= 0.63) {
        stroke(204, 0, 0); // #cc0000
    }
    else if (future > 0.63 && future <= 0.65) {
        stroke(255, 226, 226); // #ffe2e2
    }
    else if (future > 0.65 && future <= 0.675) {
        stroke(116, 45, 210); // #742dd2
    }
    else if (future > 0.675 && future <= 0.68) {
        stroke(255, 217, 51); // #ffd933
    }
    else if (future > 0.68 && future <= 0.7) {
        stroke(240, 166, 202); // #f0a6ca
    }
    else if (future > 0.7 && future <= 0.715) {
        stroke(219, 237, 243); // #dbedf3
    }
    else if (future > 0.715 && future <= 0.73) {
        stroke(228, 255, 254); // #e4fffe
    }
    else if (future > 0.73 && future <= 0.75) {
        stroke(255, 255, 193); // #ffffc1
    }
    else if (future > 0.75 && future <= 0.85) {
        stroke(252, 205, 226); // #fccde2
    }
    else {
        stroke(247, 130, 223); // #f782df
    }
}

function s_Globalhead() {
    let globalhead = fxrand();
    if (globalhead <= 0.15) {
        stroke(183, 33, 33); // #b72121
    }
    else if (globalhead > 0.15 && globalhead <= 0.2) {
        stroke(251, 225, 182); // #fbe1b6
    }
    else if (globalhead > 0.2 && globalhead <= 0.25) {
        stroke(218, 49, 49); // #da3131
    }
    else if (globalhead > 0.25 && globalhead <= 0.3) {
        stroke(255, 255, 255); // #ffffff
    }
    else if (globalhead > 0.3 && globalhead <= 0.35) {
        stroke(218, 134, 49); // #da8631
    }
    else if (globalhead > 0.35 && globalhead <= 0.5) {
        stroke(0, 0, 0); // #000000
    }
    else if (globalhead > 0.5 && globalhead <= 0.525) {
        stroke(255, 174, 26); // #ffae1a
    }
    else if (globalhead > 0.525 && globalhead <= 0.55) {
        stroke(231, 70, 69); // #e74645
    }
    else if (globalhead > 0.55 && globalhead <= 0.6) {
        stroke(239, 89, 75); // #ef594b
    }
    else if (globalhead > 0.6 && globalhead <= 0.65) {
        stroke(242, 190, 34); // #f2be22
    }
    else if (globalhead > 0.65 && globalhead <= 0.7) {
        stroke(140, 32, 22); // #8c2016
    }
    else if (globalhead > 0.7 && globalhead <= 0.75) {
        stroke(242, 171, 39); // #f2ab27
    }
    else if (globalhead > 0.75 && globalhead <= 0.8) {
        stroke(255, 211, 182); // #ffd3b6
    }
    else if (globalhead > 0.8 && globalhead <= 0.85) {
        stroke(217, 125, 13); // #d97d0d
    }
    else if (globalhead > 0.85 && globalhead <= 0.9) {
        stroke(217, 79, 48); // #d94f30
    }
    else if (globalhead > 0.9 && globalhead <= 0.95) {
        stroke(199, 52, 1); // #c73401
    }
    else {
        stroke(39, 6, 0); // #270600
    }
}

function s_Pasteque() {
    let pasteque = fxrand();
    if (pasteque <= 0.2) {
        stroke(251, 121, 105); // #fb7969
    }
    else if (pasteque > 0.2 && pasteque <= 0.3) {
        stroke(249, 54, 30); // #f9361e
    }
    else if (pasteque > 0.3 && pasteque <= 0.4) {
        stroke(255, 188, 180); // #fdbcb4
    }
    else if (pasteque > 0.4 && pasteque <= 0.45) {
        stroke(255, 242, 240); // #fff2f0
    }
    else if (pasteque > 0.45 && pasteque <= 0.5) {
        stroke(180, 253, 188); // #b4fdbc
    }
    else if (pasteque > 0.5 && pasteque <= 0.55) {
        stroke(0, 0, 0); // #000000
    }
    else if (pasteque > 0.55 && pasteque <= 0.575) {
        stroke(254, 255, 228); // #feffe4
    }
    else if (pasteque > 0.575 && pasteque <= 0.625) {
        stroke(243, 247, 152); // #f3f798
    }
    else if (pasteque > 0.625 && pasteque <= 0.65) {
        stroke(229, 252, 194); // #e5fcc2
    }
    else if (pasteque > 0.65 && pasteque <= 0.675) {
        stroke(240, 255, 240); // #f0fff0
    }
    else if (pasteque > 0.675 && pasteque <= 0.75) {
        stroke(253, 188, 180); // #fdbcb4
    }
    else if (pasteque > 0.75 && pasteque <= 0.8) {
        stroke(19, 90, 37); // #135a25
    }
    else if (pasteque > 0.8 && pasteque <= 0.85) {
        stroke(10, 48, 20); // #0a3014
    }
    else if (pasteque > 0.85 && pasteque <= 0.9) {
        stroke(164, 255, 164); // #a4ffa4
    }
    else {
        stroke(223, 30, 6); // #df1e06
    }
}

function s_ForestDark() {
    let forestDark = fxrand();
    if (forestDark <= 0.1) {
        stroke(225, 249, 30); // #e1f91e
    }
    else if (forestDark > 0.1 && forestDark <= 0.2) {
        stroke(235, 251, 105); // #ebfb69
    }
    else if (forestDark > 0.2 && forestDark <= 0.3) {
        stroke(223, 245, 242); // #dff5f2
    }
    else if (forestDark > 0.3 && forestDark <= 0.35) {
        stroke(130, 252, 234); // #82fcea
    }
    else if (forestDark > 0.35 && forestDark <= 0.4) {
        stroke(3, 117, 101); // #037565
    }
    else if (forestDark > 0.4 && forestDark <= 0.45) {
        stroke(255, 255, 255); // #ffffff
    }
    else if (forestDark > 0.45 && forestDark <= 0.5) {
        stroke(243, 247, 152); // #f3f798
    }
    else if (forestDark > 0.5 && forestDark <= 0.55) {
        stroke(192, 255, 194); // #c0ffc2
    }
    else if (forestDark > 0.55 && forestDark <= 0.6) {
        stroke(200, 244, 222); // #c8f4de
    }
    else if (forestDark > 0.6 && forestDark <= 0.625) {
        stroke(31, 78, 95); // #1f4e5f
    }
    else if (forestDark > 0.625 && forestDark <= 0.65) {
        stroke(34, 40, 49); // #222831
    }
    else if (forestDark > 0.65 && forestDark <= 0.675) {
        stroke(200, 121, 148); // #c87994
    }
    else if (forestDark > 0.675 && forestDark <= 0.7) {
        stroke(223, 244, 243); // #dff4f3
    }
    else if (forestDark > 0.7 && forestDark <= 0.75) {
        stroke(200, 121, 148); // #fcbad3
    }
    else if (forestDark > 0.75 && forestDark <= 0.85) {
        stroke(0, 0, 0); // #000000
    }
    else if (forestDark > 0.85 && forestDark <= 0.9) {
        stroke(249, 255, 234); // #f9ffea
    }
    else {
        stroke(239, 255, 252); // #effffc
    }
}

function s_BassProShops() {
    let bps = fxrand();
    if (bps <= 0.15) {
        stroke(217, 35, 50); // #D92332
    }
    else if (bps > 0.15 && bps <= 0.3) {
        stroke(46, 166, 76); // #2EA64C
    }
    else if (bps > 0.3 && bps <= 0.45) {
        stroke(248, 205, 34); // #F8FF22
    }
    else if (bps > 0.45 && bps <= 0.6) {
        stroke(207, 210, 211); // #CFD2D3
    }
    else if (bps > 0.6 && bps <= 0.65) {
        stroke(238, 108, 77); // #ee6c4d
    }
    else if (bps > 0.65 && bps <= 0.7) {
        stroke(201, 203, 163); // #c9cba3
    }
    else if (bps > 0.7 && bps <= 0.75) {
        stroke(248, 249, 145); // #f8f991
    }
    else if (bps > 0.75 && bps <= 0.8) {
        stroke(232, 237, 223); // #e8eddf
    }
    else if (bps > 0.8 && bps <= 0.85) {
        stroke(1, 22, 39); // #011627
    }
    else {
        stroke(13, 13, 13); // #0D0D0D  
    }
}

function s_VersacePython() {
    let versace = fxrand();
    if (versace <= 0.15) {
        stroke(249, 242, 231); // #f9f2e7
    }
    else if (versace > 0.15 && versace <= 0.2) {
        stroke(252, 239, 238); // #fcefee
    }
    else if (versace > 0.2 && versace <= 0.25) {
        stroke(252, 205, 226); // #fccde2
    }
    else if (versace > 0.25 && versace <= 0.3) {
        stroke(235, 203, 174); // #ebcbae
    }
    else if (versace > 0.3 && versace <= 0.4) {
        stroke(204, 99, 221); // #ffd700
    }
    else if (versace > 0.4 && versace <= 0.45) {
        stroke(255, 215, 0); // #cc63dd
    }
    else if (versace > 0.45 && versace <= 0.55) {
        stroke(107, 160, 131); // #ffaa64
    }
    else if (versace > 0.55 && versace <= 0.6) {
        stroke(255, 170, 100); // #6ba083
    }
    else if (versace > 0.6 && versace <= 0.65) {
        stroke(255, 211, 182); // #ffd3b6
    }
    else if (versace > 0.65 && versace <= 0.7) {
        stroke(255, 245, 165); // #fff5a5
    }
    else if (versace > 0.7 && versace <= 0.75) {
        stroke(255, 255, 255); // #ffffff
    }
    else if (versace > 0.75 && versace <= 0.8) {
        stroke(230, 194, 0); // #e6c200
    }
    else if (versace > 0.8 && versace <= 0.85) {
        stroke(230, 0, 151); // #e60097
    }
    else {
        stroke(0, 0, 0); // #000000
    }
}

function s_JoseChungFromOuterSpace() {
    let joseChung = fxrand();
    if (joseChung <= 0.1) {
        stroke(8, 31, 55); // #081f37
    }
    else if (joseChung > 0.1 && joseChung <= 0.15) {
        stroke(0, 0, 0); // #000000
    }
    else if (joseChung > 0.15 && joseChung <= 0.2) {
        stroke(43, 32, 36); // #2b2024
    }
    else if (joseChung > 0.2 && joseChung <= 0.25) {
        stroke(168, 0, 56); // #a80038
    }
    else if (joseChung > 0.25 && joseChung <= 0.3) {
        stroke(204, 0, 0); // #cc0000
    }
    else if (joseChung > 0.3 && joseChung <= 0.35) {
        stroke(27, 62, 161); // #1b3ea1
    }
    else if (joseChung > 0.35 && joseChung <= 0.4) {
        stroke(0, 0, 0); // #000000
    }
    else if (joseChung > 0.4 && joseChung <= 0.45) {
        stroke(0, 64, 96); // #004060
    }
    else if (joseChung > 0.45 && joseChung <= 0.5) {
        stroke(107, 160, 131); // #d23e31
    }
    else if (joseChung > 0.5 && joseChung <= 0.55) {
        stroke(0, 0, 0); // #000000
    }
    else if (joseChung > 0.55 && joseChung <= 0.6) {
        stroke(35, 40, 49); // #232831
    }
    else if (joseChung > 0.6 && joseChung <= 0.65) {
        stroke(255, 255, 193); // #ffffc1
    }
    else if (joseChung > 0.65 && joseChung <= 0.7) {
        stroke(112, 9, 97); // #700961
    }
    else if (joseChung > 0.7 && joseChung <= 0.75) {
        stroke(42, 54, 59); // #2a363b
    }
    else if (joseChung > 0.75 && joseChung <= 0.8) {
        stroke(255, 189, 57); // #ffbd39
    }
    else if (joseChung > 0.8 && joseChung <= 0.85) {
        stroke(254, 240, 255); // #fef0ff
    }
    else {
        stroke(0, 0, 0); // #000000
    }
}

function s_MemoriesOfGreen() {
    let memories = fxrand();
    if (memories <= 0.2) {
        stroke(18, 73, 47); // #12492f
    }
    else if (memories > 0.2 && memories <= 0.3) {
        stroke(103, 145, 134); // #679186
    }
    else if (memories > 0.3 && memories <= 0.4) {
        stroke(220, 233, 190); // #dce9be
    }
    else if (memories > 0.4 && memories <= 0.45) {
        stroke(138, 155, 15); // #8a9b0f
    }
    else if (memories > 0.45 && memories <= 0.5) {
        stroke(217, 208, 78); // #d9d04e
    }
    else if (memories > 0.5 && memories <= 0.55) {
        stroke(112, 115, 31); // #70731f
    }
    else if (memories > 0.55 && memories <= 0.575) {
        stroke(242, 230, 216); // #f2e6d8
    }
    else if (memories > 0.575 && memories <= 0.625) {
        stroke(228, 253, 225); // #e4fde1
    }
    else if (memories > 0.625 && memories <= 0.65) {
        stroke(14, 173, 105); // #0ead69
    }
    else if (memories > 0.65 && memories <= 0.675) {
        stroke(127, 115, 64); // #7f7340
    }
    else if (memories > 0.675 && memories <= 0.75) {
        stroke(23, 64, 115); // #174073
    }
    else if (memories > 0.75 && memories <= 0.8) {
        stroke(121, 157, 131); // #799d83
    }
    else if (memories > 0.8 && memories <= 0.85) {
        stroke(214, 110, 97); // #d66e61
    }
    else if (memories > 0.85 && memories <= 0.9) {
        stroke(255, 255, 255); // #ffffff
    }
    else {
        stroke(62, 69, 27); // #3e451b
    }
}

function s_Riley() {
    let riley = fxrand();
    if (riley <= 0.15) {
        stroke(255, 255, 255); // #ffffff
    }
    else if (riley > 0.15 && riley <= 0.2) {
        stroke(92, 161, 239); // #5ca1ef
    }
    else if (riley > 0.2 && riley <= 0.3) {
        stroke(250, 231, 128); // #fae780
    }
    else if (riley > 0.3 && riley <= 0.4) {
        stroke(181, 199, 255); // #b5c7ff
    }
    else if (riley > 0.4 && riley <= 0.45) {
        stroke(84, 119, 219); // #5477db
    }
    else if (riley > 0.45 && riley <= 0.5) {
        stroke(217, 168, 221); // #d9a8dd
    }
    else if (riley > 0.5 && riley <= 0.55) {
        stroke(250, 180, 90); // #fab45a
    }
    else if (riley > 0.55 && riley <= 0.6) {
        stroke(132, 207, 109); // #84cf6d
    }
    else if (riley > 0.6 && riley <= 0.65) {
        stroke(81, 215, 201); // #51d7c9
    }
    else if (riley > 0.65 && riley <= 0.7) {
        stroke(43, 155, 181); // #2b9bb5
    }
    else if (riley > 0.7 && riley <= 0.75) {
        stroke(44, 64, 64); // #2c4040
    }
    else if (riley > 0.75 && riley <= 0.8) {
        stroke(237, 113, 132); // #ed7184
    }
    else if (riley > 0.8 && riley <= 0.85) {
        stroke(243, 147, 109); // #f3936d
    }
    else if (riley > 0.85 && riley <= 0.9) {
        stroke(226, 172, 228); // #e2ace4
    }
    else {
        stroke(111, 181, 107); // #6fb56b
    }
}

function s_VCR() {
    let vcr = fxrand();
    if (vcr <= 0.25) {
        stroke(0, 0, 0); // #000000
    }
    else if (vcr > 0.25 && vcr <= 0.5) {
        stroke(255, 255, 255); // #ffffff
    }
    else if (vcr > 0.5 && vcr <= 0.6) {
        stroke(255, 0, 0); // #ff0000
    }
    else if (vcr > 0.6 && vcr <= 0.7) {
        stroke(	255, 77, 77); // #ff4d4d
    }
    else if (vcr > 0.7 && vcr <= 0.8) {
        stroke(0, 255, 0); // #00ff00
    }
    else if (vcr > 0.8 && vcr <= 0.9) {
        stroke(	77, 255, 77); // #4dff4d
    }
    else if (vcr > 0.9 && vcr <= 0.925) {
        stroke(0, 0, 255); // #0000ff
    }
    else if (vcr > 0.925 && vcr <= 0.95) {
        stroke(	77, 77, 255); // #4d4dff
    }
    else if (vcr > 0.95 && vcr <= 0.975) {
        stroke(255, 255, 0); // #ffff00
    }
    else {
        stroke(255, 255, 77); // #ffff4d
    }
}

function myDirectionalLights() {
    lightFalloff(0.97, 0.03, 0);
    // V1
    if (lights_type <= 0.5) {
        light_1_r = int(map(fxrand(), 0, 1, 0, 220));
        light_1_g = 0;
        light_1_b = 0;

        light_2_r = 0;
        light_2_g = int(map(fxrand(), 0, 1, 0, 220));
        light_2_b = 0;

        light_3_r = 0;
        light_3_g = 0;
        light_3_b = int(map(fxrand(), 0, 1, 0, 220));
    }
    // V2
    else if (lights_type > 0.5) {
        light_1_r = int(map(fxrand(), 0, 1, 45, 180));
        light_1_g = int(map(fxrand(), 0, 1, 45, 20));
        light_1_b = int(map(fxrand(), 0, 1, 45, 15));

        light_2_r = int(map(fxrand(), 0, 1, 45, 15));
        light_2_g = int(map(fxrand(), 0, 1, 45, 180));
        light_2_b = int(map(fxrand(), 0, 1, 45, 20));

        light_3_r = int(map(fxrand(), 0, 1, 45, 20));
        light_3_g = int(map(fxrand(), 0, 1, 45, 15));
        light_3_b = int(map(fxrand(), 0, 1, 45, 180));   
    }

    light_1_posX = int(map(fxrand(), 0, 1, 0, width));
    light_1_posY = int(map(fxrand(), 0, 1, 0, height));
    light_1_posZ = int(map(fxrand(), 0, 1, 0, width));
    
    light_2_posX = int(map(fxrand(), 0, 1, 0, width));
    light_2_posY = int(map(fxrand(), 0, 1, 0, height));
    light_2_posZ = int(map(fxrand(), 0, 1, 0, width));
    
    light_3_posX = int(map(fxrand(), 0, 1, 0, width));
    light_3_posY = int(map(fxrand(), 0, 1, 0, height));
    light_3_posZ = int(map(fxrand(), 0, 1, 0, width));
    
    directionalLight(light_1_r, light_1_g, light_1_b, light_1_posX, light_1_posY, light_1_posZ);
    directionalLight(light_2_r, light_2_g, light_2_b, light_2_posX, light_2_posY, light_2_posZ);
    directionalLight(light_3_r, light_3_g, light_3_b, light_3_posX, light_3_posY, light_3_posZ);
}

function keyReleased() {
    // save a PNG image by pressing the "s" or "S" key
    if (key == 's' || key == 'S') {
		save('THE400FLIPS_' +  fxhash + '.png');
	}
    
    // render higher res alternate version by pressing the "a" or "A" key
    if (key == 'a' || key == 'A') {
		pixelDensity(5);
        
        setTimeout(redraw, 1500);
	}
    
    // save alt version as PNG image by pressing the "z" or "Z" key
    if (key == 'z' || key == 'Z') {
		save('THE400FLIPS_ALT_' +  fxhash + '.png');
	}
}