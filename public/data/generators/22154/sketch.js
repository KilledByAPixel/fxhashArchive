/*
            ____           __  _            _ 
  ____ _   / __/___  _____/ /_(_)___  _____(_)
 / __ `/  / /_/ __ \/ ___/ __/ / __ \/ ___/ / 
/ /_/ /  / __/ /_/ / /  / /_/ / /_/ / /  / /  
\__,_/  /_/  \____/_/   \__/_/\____/_/  /_/   
                                              

"a fortiori" TENDER x THOMAS NOYA | GENERATIVE PROJECT FOR FX(HASH) | DEC 2022
IG: @TSNOYA | TT: @O2HT | THOMASNOYA.COM | linktr.ee/tsnoya   
TT: @tender_art | tender.art/

◉_◉

––

Artworks' copyright (©) 2022 Thomas Noya & Tender

––

a fortiori is in its core an implementation of Craig Reynold's Boids program to simulate the flocking behavior of birds. 

Source code of the Boids program adapted from The Nature of Code, as such, this work is also released under the GNU Lesser General Public License as published by the Free Software Foundation; either version 2.1 of the License, or (at your option) any later version.

https://www.gnu.org/licenses/old-licenses/lgpl-2.1.html

https://cs.stanford.edu/people/eroberts/courses/soco/projects/2008-09/modeling-natural-systems/boids.html
https://www.red3d.com/cwr/boids/
https://natureofcode.com/book/chapter-6-autonomous-agents/

––

PLEASE DO NOT STRAIGHT UP COPY THIS WORK, WE'VE LEFT IT EASY TO READ SO YOU CAN STUDY IT AND UNDERSTAND IT. BUILD ON TOP OF IT. EXPERIMENT. DON'T BE AN ASSHOLE

*/

// GENERAL
const seed = Math.floor(fxrand() * 1e9);
const size = 1000;
let pd = 2; // initial pixel density

// MOV
const counter_vals = [20, 25, 30, 35, 45, 50, 75, 90, 100, 125];
let counter, pick_counter_val; 
let draw_cycles, myStop, myStops, which_stop, myStop_string;
let brush_mov, movs;
let color_cycles;
let myLoop_1;
let syst_dist, systems, draw_mode;

// RENDER TIME VALS
let start, end, elapsed;

// FLOCKING
let flock, initial_boids, boids_start, frontera, frnt, my_frontera, my_maxspeed, maxspeed, my_maxforce, maxforce, my_sep_mult, sep_mult, my_ali_mult, ali_mult, my_coh_mult, coh_mult, my_desiredseparation, separations, my_neighbordist_1, neigh_1, my_neighbordist_2, neigh_2, my_acceleration_x1, acce_x1s, my_acceleration_y1, acce_y1s, my_loc_mult, loc_mult, my_vel_x, vel_xs, my_steer, steers;
let s_mode, follow_mode, free_mode, branch_type, branches, icon_v, icon_vs = [], loop_type, loops, l1_v, l2_v, l2_type, l3_v, l5_v, l5_type, l6_v, l7_v, l8_v, l1_mult, double_loop, mov_type, mov_string, rot_div, my_return;
let radius, rads, rad_inc, rad_incs, rad_mult_x, mult_xs, rad_mult_y, mult_ys, ang, speed, speeds, centerX, centerY;
let fp_X, fp_Y;

// POSITIONS
let start_x1 = [], start_y1 = [], start_x2 = [], start_y2 = [], start_x3 = [], start_y3 = [];;
let pick_x_1, pick_y_1, pick_x_2, pick_y_2, pick_x_3, pick_y_3;

// BRUSH 
let accent_x, accent_y, accent_type, accent_type_string;
let t_y_1, t_y_2, t_x_1, r_x_1, o_x_min, o_x_max, o_y_min, o_y_max, c_max, r_x_max, r_y_max;
let which_shape, shape_string;
let rapunzel, rapunzels, dots_1, dots_2, dots_3, dots_4, arc_1_type, arc_1_x, arc_1_y, arc_1_x2, arc_1_y2, arc_2_type, arc_2_x, arc_2_y, lg_hairs_1, lg_hairs_2, sh_hairs_1, sh_hairs_2, lg_hair_1_type, lg_hair_2_type, lg_hair_types, sh_hair_1_type, sh_hair_2_type, lg_hair_x1, lg_hair_y1, lg_hair_x2, lg_hair_y2,  sh_hair_x1, sh_hair_y1, sh_hair_x2, sh_hair_y2;
let lg_x1s, lg_y1s, lg_x2s, lg_y2s;
let skip_rapunzel = false;

// PALETTES
let b_palette_1, palettes, b_palette_2, b_palette_3, b_palette_4, b_soft, b_polks, b_polks_2, s_palette_1, s_palette_2, s_palette_3, s_palette_4, s_palette_5;
let h_palette_1, h_palette_2, h_palette_3, h_palette_R_N, h_palette_R_M, h_palette_B_N, h_palette_B_M, h_palette_Y_N, h_palette_Y_M, h_palette_O_N, h_palette_Go_N, h_palette_Gr_N, h_palette_OW_N, h_palette_CW_N, h_palette_Bck_M, h_palette_Bck_M2, which_h_palette;
let f_alpha_1, f_alpha_2, f_alpha_3, f_alpha_4, f_alpha_5, f_alpha_6, b_alpha_1, s_opa, st_we_1, we1s, st_we_2, we2s, lg_st_we_1, lg_we1s, lg_st_we_2, lg_we2s, sh_st_we_1, sh_we1s, sh_st_we_2, sh_we2s;
let opa_min, opa_max;
let blend_type_1, blend_type_2, blend_string;

let which_bg;
let my_colour, colour_string;
let is_Red_1 = false, is_Red_2 = false;
let is_Blue_1 = false, is_Blue_2 = false, is_Blue_3 = false;
let is_Yellow_1 = false, is_Yellow_2 = false, is_Yellow_3 = false, is_Yellow_4 = false;
let is_Green_1 = false, is_Green_2 = false;
let is_Orange_1 = false, is_Orange_2 = false;
let is_Gold_1 = false;
let is_Bronze_1 = false;
let is_Purple_1 = false, is_Purple_2 = false;
let is_White_1 = false, is_White_2 = false;
let is_Black_1 = false, is_Black_2 = false;
let is_Neon_1 = false, is_Neon_2 = false, is_Neon_3 = false;
let is_bg_white = false, is_bg_black = false, is_bg_blue = false, is_bg_red = false, is_bg_yellow = false;
let is_Icons = false;

function reset(pd) {
    start = millis();
    
    randomSeed(seed);
    noiseSeed(seed);
    
    pixelDensity(pd);
    createCanvas(size, size);
    background(255);
    
    startPositions();
        
    pick_counter_val = int(random(0, counter_vals.length)); // for rotation of brush strokes
    rot_div = int(random(2, 9)); // used in rots 3&5
    
    
    // 0-0.76 black, 0.76-0.9 white, 0.9-0.92 blue, 0.92-0.98 red, 0.98- yellow
    which_bg = random(); 
    my_backgrounds();
    //console.log(which_bg);

    my_colour = random();
    //console.log(my_colour);

    // PICK PALETTES
    if (is_bg_black == true) {
        if (my_colour <= 0.05) {
            is_White_1 = true; 
            colour_string = 'OFF–WHITE';
        }
        else if (my_colour > 0.05 && my_colour <= 0.1) {
            is_Black_1 = true;  
            colour_string = 'BLACK-1';
        }
        else if (my_colour > 0.1 && my_colour <= 0.22) {
            is_White_2 = true; 
            colour_string = 'COLD–WHITE';
        }
        else if (my_colour > 0.22 && my_colour <= 0.24) {
            is_Bronze_1 = true; 
            colour_string = 'BRONZE';
            is_Icons = true;
        }
        else if (my_colour > 0.24 && my_colour <= 0.28) {
            is_Neon_1 = true; 
            colour_string = 'NEON-1';
            is_Icons = true;
        }
        else if (my_colour > 0.28 && my_colour <= 0.39) {
            is_Neon_1 = true; 
            colour_string = 'NEON-1';
        }
        else if (my_colour > 0.39 && my_colour <= 0.44) {
            is_Gold_1 = true;   
            colour_string = 'GOLD';
            is_Icons = true;
        }
        else if (my_colour > 0.44 && my_colour <= 0.50) {
            is_Orange_1 = true;  
            colour_string = 'ORANGE-1';
            is_Icons = true;
        }
        else if (my_colour > 0.50 && my_colour <= 0.52) {
            is_Green_1 = true;   
            colour_string = 'GREEN–1';
            is_Icons = true;
        }
        else if (my_colour > 0.52 && my_colour <= 0.55) {
            is_Yellow_1 = true;   
            colour_string = 'YELLOW–1';
        }
        else if (my_colour > 0.55 && my_colour <= 0.57) {
            is_Yellow_4 = true;   
            colour_string = 'YELLOW–4';
        }
        else if (my_colour > 0.57 && my_colour <= 0.60) {
            is_Black_1 = true;  
            colour_string = 'BLACK-1';
        }
        else if (my_colour > 0.60 && my_colour <= 0.68) {
            is_Red_1 = true;  
            colour_string = 'RED–1';
            is_Icons = true;
        }
        else if (my_colour > 0.68 && my_colour <= 0.69) {
            is_Red_2 = true;  
            colour_string = 'RED–2';
        }
        else if (my_colour > 0.69 && my_colour <= 0.73) {
            is_Neon_3 = true; 
            colour_string = 'NEON–3';
            is_Icons = true;
        }
        else if (my_colour > 0.73 && my_colour <= 0.745) {          
            is_Purple_1 = true; 
            colour_string = 'PURPLE';
            is_Icons = true;
        }
        else if (my_colour > 0.745 && my_colour <= 0.78) {
            is_Blue_1 = true;
            colour_string = 'BLUE–1';
        }
        else if (my_colour > 0.78 && my_colour <= 0.82) {
            is_White_2 = true; 
            colour_string = 'COLD–WHITE';
            is_Icons = true;
        }
        else if (my_colour > 0.82 && my_colour <= 0.86) {
            is_Neon_2 = true; 
            colour_string = 'NEON–2';
            is_Icons = true;
        }
        else {
            is_Neon_3 = true; 
            colour_string = 'NEON–3';
            is_Icons = true;
        }
    } 
    
    if (is_bg_white == true) {
        if (my_colour <= 0.7) {
            is_Black_1 = true; 
            colour_string = 'BLACK-1';
        }
        else if (my_colour > 0.7 && my_colour <= 0.74) {
            is_Red_2 = true;  
            colour_string = 'RED–2';
        }
        else if (my_colour > 0.74 && my_colour <= 0.77) {
            is_Red_1 = true;  
            colour_string = 'RED–1';
        }
        else if (my_colour > 0.77 && my_colour <= 0.8) {
            is_Blue_2 = true;  
            colour_string = 'BLUE–2';
        }
        else if (my_colour > 0.8 && my_colour <= 0.84) {
            is_Yellow_2 = true; 
            colour_string = 'YELLOW–2';
        }
        else {
            is_Black_1 = true;  
            colour_string = 'BLACK-1';
        }
    }
    
    if (is_bg_blue == true) {
        if (my_colour <= 0.15) {
            is_Red_2 = true; 
            colour_string = 'RED–2';
        }
        else if (my_colour > 0.15 && my_colour <= 0.2) {
            is_Yellow_2 = true;   
            colour_string = 'YELLOW–2';
        }
        else if (my_colour > 0.2 && my_colour <= 0.25) {
            is_White_1 = true;   
            colour_string = 'OFF–WHITE';
        }
        else if (my_colour > 0.25 && my_colour <= 0.4) {
            is_White_2 = true;
            colour_string = 'COLD–WHITE';
        }
        else if (my_colour > 0.4 && my_colour <= 0.78) {
            is_Black_1 = true; 
            colour_string = 'BLACK-1';
        }
        else if (my_colour > 0.78 && my_colour <= 0.8) {
            is_Neon_3 = true;   
            colour_string = 'NEON–3';
        }
        else if (my_colour > 0.8 && my_colour <= 0.83) {
            is_Yellow_1 = true; 
            colour_string = 'YELLOW–1';
        }
        else if (my_colour > 0.83 && my_colour <= 0.89) {
            is_Red_1 = true;
            colour_string = 'RED–1';
        }
        else if (my_colour > 0.89 && my_colour <= 0.98) {
            is_Red_2 = true; 
            colour_string = 'RED–2';
        }
        else {
            is_Neon_3 = true;   
            colour_string = 'NEON–3';
        }
    }

    if (is_bg_red == true) {
        if (my_colour <= 0.1) {
            is_Yellow_2 = true; 
            colour_string = 'YELLOW–2';
        }
        else if (my_colour > 0.1 && my_colour <= 0.23) {
            is_Blue_2 = true; 
            colour_string = 'BLUE–2';
        }
        else if (my_colour > 0.23 && my_colour <= 0.28) {
            is_White_1 = true;  
            colour_string = 'OFF–WHITE';
        }
        else if (my_colour > 0.28 && my_colour <= 0.5) {
            is_White_2 = true;  
            colour_string = 'COLD–WHITE';
        }
        else if (my_colour > 0.5 && my_colour <= 0.9) {
            is_Black_1 = true; 
            colour_string = 'BLACK–1';
        }
        else if (my_colour > 0.9 && my_colour <= 0.95) {
            is_Yellow_1 = true; 
            colour_string = 'YELLOW–1';
        }
        else {
            is_Neon_3 = true; 
            colour_string = 'NEON–3';
        }
    }
    
    if (is_bg_yellow == true) {
        if (my_colour <= 0.15) {
            is_Red_2 = true; 
            colour_string = 'RED–2';
        }
        else if (my_colour > 0.15 && my_colour <= 0.25) {
            is_Blue_2 = true;   
            colour_string = 'BLUE–2';
        }
        else if (my_colour > 0.25 && my_colour <= 0.45) {
            is_White_2 = true;   
            colour_string = 'COLD–WHITE';
        }
        else if (my_colour > 0.45 && my_colour <= 0.85) {
            is_Black_1 = true; 
            colour_string = 'BLACK–1';
        }
        else if (my_colour > 0.85 && my_colour <= 0.93) {
            is_Red_2 = true;  
            colour_string = 'RED–2';
        }
        else if (my_colour > 0.93 && my_colour <= 0.98) {
            is_Red_1 = true;  
            colour_string = 'RED–1';
        }
        else {
            is_Neon_3 = true;  
            colour_string = 'NEON–3';
        }
    }
    
    b_palette_1 = int(random(1, 18));
    b_palette_2 = int(random(1, 19));
    b_palette_3 = int(random(1, 24));
        
    // STROKES
    s_palette_1 = int(random(1, 21));
    s_palette_2 = int(random(1, 21));
    s_palette_3 = int(random(1, 21));
    s_palette_4 = int(random(1, 21));
    
    h_palette_1 = b_palette_1;
    h_palette_2 = b_palette_2;
    h_palette_3 = int(random(1, 16));
    
    h_palette_R_N = int(random(1, 8)); // used in long hairs for RED_1
    h_palette_R_M = int(random(1, 8)); // used in long hairs for RED_2
    
    h_palette_B_N = int(random(1, 8)); // used in long hairs for BLUE_1
    h_palette_B_M = int(random(1, 8)); // used in long hairs for BLUE_2
    
    h_palette_Y_N = int(random(1, 8)); // used in long hairs for YELLOW_1
    h_palette_Y_M = int(random(1, 8)); // used in long hairs for YELLOW_2
    
    h_palette_O_N = int(random(1, 8)); // used in long hairs for ORANGE
    
    h_palette_Go_N = int(random(1, 8)); // used in long hairs for GOLD
    
    h_palette_Gr_N = int(random(1, 8)); // used in long hairs for GREEN
    
    h_palette_OW_N = int(random(1, 8)); // used in long hairs for OFF-WHITE
    h_palette_CW_N = int(random(1, 8)); // used in long hairs for COLD-WHITE
    
    h_palette_Bck_M = int(random(1, 13)); // used in long hairs for BLACK
    h_palette_Bck_M2 = int(random(1, 13)); // used in long hairs for BLACK
    
    which_h_palette = int(random(1, 6)); // 1 = set color, else = various colors
    //console.log(which_h_palette);
    

    // >>> SYSTEMS
    syst_dist = random();
    // BLACK BG – ICONS – BLACK OFF
    if (is_bg_black == true && is_Icons == true && is_Black_1 == false) {
        
        if (syst_dist <= 0.04) {
            draw_mode = 1;
        }
        else if (syst_dist > 0.04 && syst_dist <= 0.18) {
            draw_mode = 2;  
        }
        else if (syst_dist > 0.18 && syst_dist <= 0.32) {
            draw_mode = 6;  
        }
        else if (syst_dist > 0.32 && syst_dist <= 0.37) {
            draw_mode = 4;  
        }
        else if (syst_dist > 0.37 && syst_dist <= 0.42) {
            draw_mode = 5;  
        }
        else if (syst_dist > 0.42 && syst_dist <= 0.7) {
            draw_mode = 6;  
        }
        else if (syst_dist > 0.7 && syst_dist <= 0.73) {
            draw_mode = 7;  
        }
        else if (syst_dist > 0.73 && syst_dist <= 0.78) {
            draw_mode = 8;  
        }
        else if (syst_dist > 0.78 && syst_dist <= 0.86) {
            draw_mode = 9;  
        }
        else if (syst_dist > 0.86 && syst_dist <= 0.92) {
            draw_mode = 10;  
        }
        else {
            draw_mode = 6; 
        }
    }
    // BLACK BG – NO ICONS – BLACK OFF
    else if (is_bg_black == true && is_Icons == false && is_Black_1 == false) {
        
        if (syst_dist <= 0.04) {
            draw_mode = 1;
        }
        else if (syst_dist > 0.04 && syst_dist <= 0.2) {
            draw_mode = 6;  
        }
        else if (syst_dist > 0.2 && syst_dist <= 0.25) {
            draw_mode = 4;  
        }
        else if (syst_dist > 0.25 && syst_dist <= 0.31) {
            draw_mode = 5;  
        }
        else if (syst_dist > 0.31 && syst_dist <= 0.67) {
            draw_mode = 6;  
        }
        else if (syst_dist > 0.67 && syst_dist <= 0.69) {
            draw_mode = 7;  
        }
        else if (syst_dist > 0.69 && syst_dist <= 0.74) {
            draw_mode = 8;  
        }
        else if (syst_dist > 0.74 && syst_dist <= 0.82) {
            draw_mode = 9;  
        }
        else if (syst_dist > 0.82 && syst_dist <= 0.88) {
            draw_mode = 10;  
        }
        else {
            draw_mode = 6; 
        }
    }
    // BLACK BG – NO ICONS – BLACK ON
    else if (is_bg_black == true && is_Icons == false && is_Black_1 == true) {
        draw_mode = 6; 
    }
    // WHITE BG – NEON RED
    else if (is_bg_white == true && is_Red_1 == true) {
        draw_mode = 6; 
    }
    // WHITE & COLOR BGS
    else {
        
        if (syst_dist <= 0.04) {
            draw_mode = 1;
        }
        else if (syst_dist > 0.04 && syst_dist <= 0.06) {
            draw_mode = 7;  
        }
        else if (syst_dist > 0.06 && syst_dist <= 0.1) {
            draw_mode = 4;  
        }
        else if (syst_dist > 0.1 && syst_dist <= 0.15) {
            draw_mode = 5;  
        }
        else if (syst_dist > 0.15 && syst_dist <= 0.65) {
            draw_mode = 6;  
        }
        else if (syst_dist > 0.65 && syst_dist <= 0.68) {
            draw_mode = 8;  
        }
        else if (syst_dist > 0.68 && syst_dist <= 0.74) {
            draw_mode = 9;  
        }
        else if (syst_dist > 0.74 && syst_dist <= 0.79) {
            draw_mode = 10;  
        }
        else {
            draw_mode = 6; 
        }
    }
    
    //draw_mode = 6;
    
    my_systems(); 
    
    
    myLoop_1 = true;
    counter = 0;
    pause_counter = 0;
    
    draw_cycles = 0;
    color_cycles = 0;

    flock = new Flock();
    
    for (let i = 0; i < initial_boids; i++) {
        // FRANZ = DM–1
        if (draw_mode == 1) {
            let a;
            if (boids_start == 1) {
                a = new Boid(width/2 - 100, height/2);
            }
            else if (boids_start == 2) {
                a = new Boid(150, height/2);    
            }
            else if (boids_start == 3) {
                a = new Boid(width/2 + 150, height/2 - 100);    
            }
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);

            let b;
            if (boids_start == 1) {
                b = new Boid(width/2 + 100, height - 100);
            }
            else if (boids_start == 2) {
                b = new Boid(300, height - 300);  
            }
            else if (boids_start == 3) {
                b = new Boid(width/2 - 150, height/2 + 100);    
            }
            flock.addBoid(b);
        }
        
        // ICONS = DM–2
        else if (draw_mode == 2) {
            let a;
            if (boids_start == 1) {
                a = new Boid(325, height/2 - 225); 
            }
            else if (boids_start == 2) {
                a = new Boid(325, height/2 + 250);  
            }
            else if (boids_start == 3) {
                a = new Boid(250, height - 250);  
            }
            else if (boids_start == 4) {
                a = new Boid(200, 300);  
            }
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);

            let b;
            if (boids_start == 1) {
                b = new Boid(width - 325, height/2 + 50);
            }
            else if (boids_start == 2) {
                b = new Boid(width - 325, height/2 - 50);
            }
            else if (boids_start == 3) {
                b = new Boid(width - 250, 250);  
            }
            else if (boids_start == 4) {
                b = new Boid(width - 200, height - 300);  
            }
            flock.addBoid(b);
        }
        
        // BRANCHES (old) = DM–4
        else if (draw_mode == 4) {
            let a;
            if (boids_start == 1) {
                a = new Boid(width/2 - 300, height/2 - 200);
            }
            else if (boids_start == 2) {
                a = new Boid(150, 200); 
            }
            else if (boids_start == 3) {
                a = new Boid(width/2, height/2 + 100);
            }
            if (branch_type == 1) {
                flock.addBoid(a);
                flock.addBoid(a);
                flock.addBoid(a);
                flock.addBoid(a);
                flock.addBoid(a);
                flock.addBoid(a);
            }
            else if (branch_type == 2) {
                flock.addBoid(a);
                flock.addBoid(a);
                flock.addBoid(a);
                flock.addBoid(a); 
            }

            let b;
            if (boids_start == 1) {
                b = new Boid(width/2 + 350, height/2 + 200);
            }
            else if (boids_start == 2) { 
                b = new Boid(width/2 + 350, height/2 - 100);  
            }
            else if (boids_start == 3) { 
                b = new Boid(150, 350);   
            }
            if (branch_type == 2) {
                flock.addBoid(b);
            }
            
            let c;
            if (boids_start == 1) {
                c = new Boid(100, height - 200);
            }
            else if (boids_start == 2) { 
                c = new Boid(width/2, height/2 + 350);  
            }
            else if (boids_start == 3) { 
                c = new Boid(width - 150, height - 150);  
            }
            if (branch_type == 2) {
                flock.addBoid(c);
            }
            
            let d = new Boid(start_x2[pick_x_2], start_y2[pick_y_2]);
            flock.addBoid(d);
            flock.addBoid(d);
        }

        // BRANCHES (new) = DM–5
        else if (draw_mode == 5) {
            let a;
            if (boids_start == 1) {
                a = new Boid(width/2 - 300, height/2);
            }
            else if (boids_start == 2) {
                a = new Boid(width/2 - 100, height/2 + 100);  
            }
            else if (boids_start == 3) {
                a = new Boid(100, height - 200);  
            }
            else if (boids_start == 4) {
                a = new Boid(width/2 - 50, 400);  
            }
            else if (boids_start == 5) {
                a = new Boid(100, 300); 
            }
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);

            let b;
            if (boids_start == 1) {
                b = new Boid(width/2, height/2);
            }
            else if (boids_start == 2) { 
                b = new Boid(width/2 + 300, height/2 - 300);  
            }
            else if (boids_start == 3) { 
                b = new Boid(width - 100, height - 100);  
            }
            else if (boids_start == 4) {
                b = new Boid(width/2 + 50, height - 200);  
            }
            else if (boids_start == 5) {
                b = new Boid(width/2 - 100, 600);   
            }
            flock.addBoid(b);
        }
        
        // LOOPS = DM–6
        else if (draw_mode == 6) {
            let a;
            // L1
            if (loop_type == 1) {
                if (boids_start == 1) {
                   a = new Boid(width/2, height/2);
                }
                else if (boids_start == 2) {
                   a = new Boid(width/2, height + 20);
                }
                else if (boids_start == 3) {
                   a = new Boid(-20, height/2);
                }
                else if (boids_start == 4) {
                  a = new Boid(-20, -20);
                }
            }
            // L3 – L4 – L6
            else if (loop_type == 3 || loop_type == 4 || loop_type == 6) {
                if (boids_start == 1) {
                   a = new Boid(-20, height/2);
                }
                else if (boids_start == 2) {
                   a = new Boid(width/2, height + 20);
                }
                else if (boids_start == 3) {
                   a = new Boid(width + 20, -20);
                }
                else if (boids_start == 4) {
                  a = new Boid(-20, 50);
                }
            }
            // L5
            else if (loop_type == 5) {
                if (boids_start == 1) {
                   a = new Boid(-10, height/2);
                }
                else if (boids_start == 2) {
                   a = new Boid(width/2, height + 20);
                }
                else if (boids_start == 3) {
                   a = new Boid(width + 20, -20);
                }
                else if (boids_start == 4) {
                  a = new Boid(-20, 50);
                }
            }
            // L7
            else if (loop_type == 7) {
                if (boids_start == 1) {
                   a = new Boid(width + 20, -20);
                }
                else if (boids_start == 2) {
                   a = new Boid(width + 20, height + 20);
                }
                else if (boids_start == 3) {
                   a = new Boid(width + 20, height/2);
                }
                else if (boids_start == 4) {
                   a = new Boid(-20, -20);
                }
                else if (boids_start == 5) {
                   a = new Boid(-20, height/2 + height/2);
                }
                else if (boids_start == 5) {
                   a = new Boid(-20, height/2 + height + 20);
                }
                else if (boids_start == 6) {
                   a = new Boid(width/2, -20);
                }
                else if (boids_start == 7) {
                   a = new Boid(width/2, height + 20);
                }
                else if (boids_start == 8) {
                   a = new Boid(width + 20, height/2 + height/4);
                }
                else if (boids_start == 9) {
                   a = new Boid(width + 20, height/2 - height/4);
                }
                else if (boids_start == 10) {
                   a = new Boid(0, height/2 + height/4);
                }
                else if (boids_start == 11) {
                   a = new Boid(0, height/2 - height/4);
                }
                else if (boids_start == 12) {
                   a = new Boid(width/2 - width/4, height + 20);
                }
                else if (boids_start == 13) {
                   a = new Boid(width/2 + width/4, height + 20);
                }
                else if (boids_start == 14) {
                   a = new Boid(width/2 - width/4, -20);
                }
                else if (boids_start == 15) {
                   a = new Boid(width/2 + width/4, -20);
                }
            }
            // L2 – L8
            else if (loop_type == 2 || loop_type == 8) {
                if (boids_start == 1) {
                   a = new Boid(width/2, height + 20);
                }
                else if (boids_start == 2) {
                   a = new Boid(width/2, -20);
                }
                else if (boids_start == 3) {
                   a = new Boid(-20, -20);
                }
                else if (boids_start == 4) {
                  a = new Boid(width + 20, -20);
                }
            }
            
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);
            
            if (double_loop == 1) {
                let b = new Boid(width/2, height/2);
                flock.addBoid(b);
            }
        }
        
        // MOV_1 from dev5.5 = DM–7
        else if (draw_mode == 7) {
            let a;
            if (boids_start == 1) {
                a = new Boid(width/2 - 100, height/2 - 200);
            }
            else if (boids_start == 2) {
                a = new Boid(width/2 - 50, height/2 - 100);  
            }
            else if (boids_start == 3) {
                a = new Boid(width/2 + 300, height/2 + 300);  
            }
            else if (boids_start == 4) {
                a = new Boid(start_x1[pick_x_1], start_y1[pick_y_1]);
            }
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);

            let b;
            if (boids_start == 1) {
                b = new Boid(width/2 + 100, height/2 + 150);
            }
            else if (boids_start == 2) { 
                b = new Boid(width/2 + 50, height/2 + 100);  
            }
            else if (boids_start == 3) { 
                b = new Boid(width/2 + 100, height/2 + 200);  
            }
            else if (boids_start == 4) { 
                b = new Boid(start_x2[pick_x_2], start_y2[pick_y_2]);
            }
            flock.addBoid(b);
            
            let c;
            if (boids_start == 1) {
                c = new Boid(width/2 + 50, height);
            }
            else if (boids_start == 2) {
                c = new Boid(width/2, height - 100);
            }
            else if (boids_start == 3) {
                c = new Boid(width/2 - 300, height);
            }
            else if (boids_start == 4) { 
                c = new Boid(start_x3[pick_x_3], start_y3[pick_y_3]);
            }
            flock.addBoid(c);
        }
        
        // MOV_2 from dev5.5 = DM–8
        else if (draw_mode == 8) {
            let a;
            if (boids_start == 1) {
                a = new Boid(width/2 - 200, height/2 - 150);
            }
            else if (boids_start == 2) {
                a = new Boid(width/2 - 50, height/2 - 350);  
            }
            else if (boids_start == 3) {
                a = new Boid(width/2 - 400, height/2 - 50);  
            }
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);

            let b;
            if (boids_start == 1) {
                b = new Boid(width/2 + 200, height/2 + 200);
            }
            else if (boids_start == 2) { 
                b = new Boid(width/2 + 50, height/2 + 350);  
            }
            else if (boids_start == 3) { 
                b = new Boid(width/2 + 400, height/2 + 50);
            }
            flock.addBoid(b);
            
            let c = new Boid(width/2, height/2);
            flock.addBoid(c);
        }
        
        // MOV_3 from dev5.5 = DM–9
        else if (draw_mode == 9) {
            let a;
            if (boids_start == 1) {
                a = new Boid(width - 50, 100);  
            }
            else if (boids_start == 2) {
                a = new Boid(width - 50, 400);  
            }
            else if (boids_start == 3) {
                a = new Boid(width/2 - 100, height/2 - 50);  
            }
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);

            let b;
            if (boids_start == 1) { 
                b = new Boid(100, height - 200);
            }
            else if (boids_start == 2) { 
                b = new Boid(width - 100, height - 200);
            }
            else if (boids_start == 3) { 
                b = new Boid(width/2 + 100, height/2 + 50);
            }
            if (branch_type == 2) {
                flock.addBoid(a);
            }
            else {
                flock.addBoid(b);
            }
        }
        
        // MOV_4 from dev9 = DM–10
        else if (draw_mode == 10) {
            let a;
            if (boids_start == 1) {
                a = new Boid(350, height + 200);  
            }
            else if (boids_start == 2) {
                a = new Boid(250, height - 300);  
            }
            else if (boids_start == 3) {
                a = new Boid(150, height - 200);  
            }
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);
            flock.addBoid(a);

            let b;
            if (boids_start == 1) {
                b = new Boid(width/2, height/2);
            }
            else if (boids_start == 2) { 
                b = new Boid(width - 250, height - 150);   
            }
            else if (boids_start == 3) { 
                b = new Boid(width - 150, height - 100);  
            }
            flock.addBoid(b);
        }
    }
    
    printToConsole();
    loop();
}

function setup() {
    pixelDensity(pd);
    reset();
}

// >>> RANDOM START POSITIONS <<<
function startPositions() {
    start_x1 = [150, width/2 - 100, width/2, width/2 + 100, width - 150];
    start_y1 = [150, height/2 - 100, height/2, height/2 + 100, height - 150];

    start_x2 = [-500, width + 500];
    start_y2 = [-500, height + 500];

    start_x3 = [width/4, width/3, width - width/4, width - width/3];
    start_y3 = [height/4 , height/3, height - height/4, height - height/3];

    pick_x_1 = int(random(0, start_x1.length));
    pick_y_1 = int(random(0, start_y1.length));

    pick_x_2 = int(random(0, start_x2.length));
    pick_y_2 = int(random(0, start_y2.length));

    pick_x_3 = int(random(0, start_x3.length));
    pick_y_3 = int(random(0, start_y3.length));
}


// >>> DRAW SYSTEMS <<<
function my_systems() {
    // FRANZ = DM–1
    if (draw_mode == 1) {
        mov_Franz();
    }
    // ICONS = = DM–2
    else if (draw_mode == 2) {
        mov_Franz_thin();
    }
    // BRANCHES (old) = DM–3
    else if (draw_mode == 4) {
        mov_Branches_old();
    }
    // BRANCHES (new) = DM–4
    else if (draw_mode == 5) {
        mov_Branches_new(); 
    }
    // LOOPS = DM–6
    else if (draw_mode == 6) {
        mov_Loops();
    }
    // MOV_1 from dev5.5 = DM–7
    else if (draw_mode == 7) {
        mov_1_dev5();
    }
    // MOV_2 from dev5.5 = DM–8
    else if (draw_mode == 8) {
        mov_2_dev5();
    }
    // MOV_3 from dev5.5 = DM–9
    else if (draw_mode == 9) {
        mov_3_dev5();
    }
    // MOV_4 from dev9 = DM–10
    else if (draw_mode == 10) {
        mov_4_dev9();
    }
}

// FRANZ
function mov_Franz() {
    initial_boids = 30;
    boids_start = int(random(1, 4));
    
    // >>> FLOCKING CONTROLS
    maxspeed = [22.1, 22.3, 22.5, 22.7, 23, 23.1, 23.3, 23.5, 23.7, random(23, 24), 24];
    my_maxspeed = maxspeed[int(random(0, maxspeed.length))];
    
    maxforce = [1.165, 1.166, 1.167, 1.168, 1.169, 1.17, 1.171, 1.172, 1.1713, 1.1714, 1.1715];
    my_maxforce = maxforce[int(random(0, maxforce.length))];
    
    sep_mult = [0.0035, 0.004, 0.0045, 0.005, 0.006, 0.0065, 0.007, 0.0075, 0.008, 0.009, 0.01, random(0.01, 0.075), 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1];
    my_sep_mult = sep_mult[int(random(0, sep_mult.length))];
    
    ali_mult = [0.65, random(0.65, 0.75), 0.7, 0.73, 0.75, 0.77, 0.8, 0.83, 0.85, 0.853, 0.855, 0.857, 0.87, 0.9, random(0.9, 0.99), 0.95, 0.97, 1, 1.3, 1.35, 1.4, 1.45, 1.5, 1.6, 1.7];
    my_ali_mult = ali_mult[int(random(0, ali_mult.length))];
    
    coh_mult = [1.4, 1.405, 1.41, random(1.4, 1.415), 1.4135, 1.4145, 1.415, 1.417];
    my_coh_mult = coh_mult[int(random(0, coh_mult.length))];

    separations = [-85, -50];
    my_desiredseparation = separations[int(random(0, separations.length))];
    
    my_neighbordist_1 = int(random(1, 4));
    
    neigh_2 = [600, 650, 700, 750, 800, 850, int(random(1500, 1900)), 2000, 2000, 2000, 2100, 2300, 2700, 2800, 2900, 100000, 500000];
    my_neighbordist_2 = neigh_2[int(random(0, neigh_2.length))];

    my_acceleration_x1 = int(random(-1, 2)); 
    my_acceleration_y1 = int(random(-1, 2));

    vel_xs = [-500, -100, -1, 1, 10, 100, 500];
    my_vel_x = vel_xs[int(random(0, vel_xs.length))];
    
    loc_mult = [-0.012, -0.011, -0.0107, -0.0105, -0.01, -0.0097, -0.0095, -0.009, -0.008, -0.007, -0.006, -0.005, -0.004, -0.003, -0.002, -0.07, -0.05, -0.01, 0.001];
    my_loc_mult = loc_mult[int(random(0, loc_mult.length))];
    
    steers = [-1, 0, 1];
    my_steer = steers[int(random(0, steers.length))];

    free_mode = int(random(1, 3));
    s_mode = int(random(1, 3)); // 1 = +, 2 = %
    follow_mode = int(random(1, 5)); // 1 = normal, 2 = inv x, 3 = inv y, 4 = inv xy

    rads = [15, 25, 50, 75, 100, 125, 150, 175, 200, 250, 275, 300, 350, 375, 400, 450, 500, 550];
    radius = rads[int(random(0, rads.length))];
    
    rad_incs = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5]
    rad_inc = rad_incs[int(random(0, rad_incs.length))];
    
    ang = 0; 
    
    speeds = [0.11, 0.12, 0.13, 0.14, 0.15, 0.17, 0.18, 0.19, 0.2, 0.21, 0.213, 0.215, 0.217, 0.22, 0.23, 0.24, 0.25, 0.26, 0.27, 0.28, 0.29, 0.3, 0.3, 0.3, 0.3, 0.3, 0.35, 0.5];
    speed = speeds[int(random(0, speeds.length))];

    centerX = size/2;
    centerY = size/2;

    
    // >>> LONG HAIR FX
    // ON/OFF: 1 ON, else OFF
    if (is_bg_black == true) {
        rapunzels = [1, 1, 1, 2, 1];
        rapunzel = rapunzels[int(random(0, rapunzels.length))];   
    }
    else if (is_bg_white == true) {
        rapunzel = 0;  
    }
    else {
        rapunzels = [1, 1, 2, 2, 2];
        rapunzel = rapunzels[int(random(0, rapunzels.length))];   
    }

    // TYPES: 1 lines, 2 arcs
    lg_hair_types = [1, 1, 2, 2];
    lg_hair_1_type = lg_hair_types[int(random(0, lg_hair_types.length))];
    lg_hair_2_type = lg_hair_1_type;

    dots_1 = 1; // 1 ON, else OFF
    dots_2 = int(random(0, 2)); // 1 ON, else OFF

    arc_1_types = [1, 1, 2, 3, 1];
    arc_1_type = arc_1_types[int(random(0, arc_1_types.length))];
    arc_1_x = int(random(-3, 4));
    arc_1_y = int(random(-3, 4));
    arc_1_x2 = int(random(5, 16));
    arc_1_y2 = int(random(45, 71));

    arc_2_types = [1, 2, 3, 3, 1];
    arc_2_type = arc_2_types[int(random(0, arc_2_types.length))];
    arc_2_x = int(random(-2, 3)) * 10;
    arc_2_y = int(random(-3, 4)) * 100;

    // LINES
    if (rapunzel == 1 && lg_hair_1_type == 1 || rapunzel == 1 && lg_hair_2_type == 1) {
        // LONG HAIR 1
        lg_hairs_1 = 1; // 1 ON, 2 OFF

        lg_we1s = [0.065, 0.08, 0.09];
        lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

        lg_x1s = [100, 150, 200, 300, 500, 600];
        lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

        lg_y1s = [75, 85, 100, 150, 175, 250, 500];
        lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
        
        // LONG HAIR 2
        let h2_switch = [1, 1, 0, 0, 0, 0];
        lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

        lg_we2s = [0.065, 0.07, 0.08];
        lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

        lg_x2s = [100, 150, 200, 300, 400];
        lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

        lg_y2s = [75, 95, 125, 200, 300];
        lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
    }
    // ARCS
    if (rapunzel == 1 && lg_hair_1_type == 2 || rapunzel == 1 && lg_hair_2_type == 2) {
    // LONG HAIR 1
        lg_hairs_1 = 1; // 1 ON, 2 OFF

        lg_we1s = [0.061, 0.062, 0.063, 0.065, 0.068];
        lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

        lg_x1s = [75, 85, 150, 500, 650];
        lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

        lg_y1s = [75, 85, 95, 100, 115, 125];
        lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];

        // LONG HAIR 2
        let h2_switch = [1, 1, 1, 1, 0, 1];
        lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

        lg_we2s = [0.061, 0.063, 0.065, 0.066, 0.067];
        lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

        lg_x2s = [55, 65, 75, 85, 115, 350];
        lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

        lg_y2s = [65, 75, 85, 100, 115];
        lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
    }
 
    skip_rapunzel = false;
    
    // >>> SHORT HAIR FX
    sh_hair_1_type = int(random(1, 3)); // 1 line, 2 arc
    sh_hair_2_type = int(random(1, 3)); // 1 line, 2 arc
    dots_3 = int(random(0, 2)); // 1 ON, else OFF
    dots_4 = int(random(0, 3)); // 1 ON, else OFF

    // LINES
    if (sh_hair_1_type == 1 || sh_hair_2_type == 1) {
        
        sh_we1s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_1 = sh_we1s[int(random(0, sh_we1s.length))];

        sh_we2s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_2 = sh_we2s[int(random(0, sh_we2s.length))];

        sh_hairs_1 = 1;
        sh_hairs_2 = int(random(1, 3)); // 1 ON, 2 OFF

        sh_hair_x1 = int(random(10, 41));
        sh_hair_y1 = int(random(10, 41));
        sh_hair_x2 = int(random(10, 41));
        sh_hair_y2 = int(random(10, 41));
    }
    // ARCS
    else if (sh_hair_1_type == 2 || sh_hair_2_type == 2) {
        sh_we1s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_1 = sh_we1s[int(random(0, sh_we1s.length))];

        sh_we2s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_2 = sh_we2s[int(random(0, sh_we2s.length))];

        sh_hairs_1 = 1;
        sh_hairs_2 = int(random(1, 3)); // 1 ON, 2 OFF

        sh_hair_x1 = int(random(10, 35));
        sh_hair_y1 = int(random(10, 35));
        sh_hair_x2 = int(random(10, 35));
        sh_hair_y2 = int(random(10, 35));
    }
   
    
    // >>> WEIGHTS AND OPACITIES
    // WEIGHTS FOR DOTS
    we1s = [0.10, 0.11, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.185];
    st_we_1 = we1s[int(random(0, we1s.length))];

    we2s = [0.10, 0.11, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.185];
    st_we_2 = we2s[int(random(0, we2s.length))];
    
    // FILL OPACITIES
    if (is_Black_1 == true || is_Black_2 == true || is_Red_2 == true || is_Blue_2 == true || is_Yellow_2 == true) {
        opa_min = 75;
        opa_max = 145;
    }
    else {
        opa_min = 60;
        opa_max = 70; 
    }
    
    f_alpha_1 = int(random(opa_min, opa_max));
    f_alpha_2 = int(random(opa_min, opa_max));
    f_alpha_3 = int(random(opa_min, opa_max));
    
    f_alpha_4 = int(random(opa_min, opa_max));
    f_alpha_5 = int(random(opa_min, opa_max));
    f_alpha_6 = int(random(opa_min, opa_max));
    
    // STROKE OPACITY
    if (is_bg_black == true) {
        s_opa = int(random(13, 26));  
    }
    else {
        s_opa = int(random(13, 21));
    }
    
    // BLEND MODE: 1 NORMAL, 2 SCREEN, 3 LIGHTEST | used in long hair fx
    blend_type_1 = 2;
    blend_type_2 = 2;
    
    
    // >>> BRUSH: SHAPE, THICKNESS & ROTATION
    // ROT
    movs = [1, 2, 4, 6, 2, 4]; 
    brush_mov = movs[int(random(0, movs.length))];
    
    // THICKNESS
    accent_type = int(random(1, 7)); // 1 = thin, 2&3 = thick, else = medium
    
    // thin
    if (accent_type == 1) {
        accent_x = int(random(5, 12)); 
        accent_y = int(random(7, 12)); 
        accent_type_string = 'thin'
    }
    // thick
    else if (accent_type == 2 || accent_type == 3) {
        accent_x = int(random(10, 19));
        accent_y = int(random(18, 21)); 
        accent_type_string = 'thick'
    }
    // medium
    else {
        accent_x = int(random(12, 17)); // 12-20
        accent_y = int(random(12, 17)); 
        accent_type_string = 'medium'
    }
    
    // FOR SHAPES
    c_max = int(random(6, 9)); // used in shape 1: circles
    o_x_min = int(random(2, 5)); // used in shape 2: ovals
    o_x_max = int(random(5, 9)); // used in shape 2: ovals
    o_y_min = int(random(2, 6)); // used in shape 2: ovals
    o_y_max = int(random(5, 9)); // used in shape 2: ovals
    r_x_max = int(random(3, 7)); // used in shape 3: rects
    r_y_max = int(random(4, 9)); // used in shape 3: rects
    t_y_1 = int(random(4, 9)); // used in shape 4: small tri
    t_y_2 = int(random(10, 16)); // used in shape 5: mixed tri
    t_x_1 = int(random(2, 6)); // used in shape 6: big tri
    r_x_1 = int(random(5, 10)); // used in shape 7: long thin rects

    // 1: circles, 2: ovals, 3: rects, 4: tri small, 5: tri mixed, 6: tri big, 7: rects long
    let shapes = [2, 4, 4, 4, 4, 4, 4, 5, 5, 6];
    which_shape = shapes[int(random(0, shapes.length))];
    
    
    // >>> FRONTERA
    if (accent_type == 1) {
        frontera = 35; 
    }
    else if (accent_type == 2 || accent_type == 3) {
        frontera = 42;     
    }
    else {
        frontera = 40;     
    }
    
    // >>> DRAW LOOP DURATION
    which_stop = int(random(2, 6)); // not using short
    
    // short
    if (which_stop == 1) {
        myStops = [950, 975, 995]; 
        myStop_string = 'short';
    }
    // long
    else if (which_stop == 2) {
        myStops = [1075, 1100, 1150, 1200]; 
        myStop_string = 'long';
    }
    // medium
    else {
        myStops = [1000, 1025, 1050, 1100]; 
        myStop_string = 'medium';
    }

    myStop = myStops[int(random(0, myStops.length))];
}

// ICONS
function mov_Franz_thin() {
    initial_boids = int(random(30, 33));

    frnt = [120, 125, 150];
    frontera = frnt[int(random(0, frnt.length))];
    icon_vs = [1, 2];
    icon_v = icon_vs[int(random(0, icon_vs.length))];
        
    // >>> FLOCKING CONTROLS
    if (icon_v == 1) {
        let starts = [1, 1, 2, 3, 4];
        boids_start = starts[int(random(0, starts.length))];
        
        maxspeed = [18.5, 18.7, 19, 19.1, 19.15, 19.2]; 
        maxforce = [1.19, 1.191, 1.192, 1.193, 1.19401, 1.195];
        sep_mult = [0, 0, 0, 0.0001];
        ali_mult = [1.5, 2, 2, 2.5, 3];
        coh_mult = [1.23, 1.235, 1.24, 1.245, 1.25, 1.255];
        my_desiredseparation = int(random(-2, 2));
        neigh_1 = [0, 0, 0, 0, 0, 0.001];
        neigh_2 = [15000, 25000, 75000, 75000, 75000, 75000, 75000, 75000, 100000, 125000];
        acce_x1s = [-550, -550, -550, -50, -10, -5, -5, -5, 0, 100, 500, 550];
        acce_y1s = [-100, -100, -100, 10, 10, 10, 50, 100];
        vel_xs = [-1, 0, 0, 0, 1, 50, 50, 50, 100, 1000];
        loc_mult = [-0.0755, -0.075, -0.073, -0.07, -0.067, -0.065, -0.06, -0.055, -0.05]; // -0.08, -0.077
        steers = [-0.7, -0.3, -0.3, 0.1, 0.3, 0.3, 0.3, 0.7, 0.7, 0.7];
        lg_hair_types = [2, 2, 2, 1];
    }
    else {
        let starts = [1, 1, 2, 3, 4];
        boids_start = starts[int(random(0, starts.length))];
        
        maxspeed = [17.5, 17.75, 18, 18.3, 18.5, 18.7, 19, 19.1, 19.15, 19.2, 19.3, 19.4, random(19.1, 19.5)];
        maxforce = [0.98, 0.983, 0.985, random(0.985, 0.987), 0.987, 0.9873, 0.9875, 0.9875, 0.988, 0.9885, 0.99];
        sep_mult = [0, 0, 0, 0.0001, 0.001, 0.002];
        ali_mult = [0.02, 0.02001, 0.0201, 1, random(1, 2), 2];
        coh_mult = [1.5, random(1.5, 1.55), 1.55, 1.55, 1.55, 1.55001, 1.5501, random(1.56, 1.6), 1.56, 1.57, 1.58, 1.59, 1.6, 1.6];
        separations = [-50, -5, 0];
        my_desiredseparation = separations[int(random(0, separations.length))];
        neigh_1 = [0];
        neigh_2 = [650, 650, 655, 700, 750, 800, 1000, 1200, 1250, 1300, 1500, 2000, int(random(2100, 2450)), 2500, 100000];
        acce_x1s = [-5, -5, -1, 1, 3, 5];
        acce_y1s = [-5, -5, -1, 1, 3, 5];
        vel_xs = [-450, -500, -600, -650, -700, -750, -800, -850, -900, -950, -1000];
        loc_mult = [0];
        steers = [0, -100, -150, -200, -250, -300, -350, -375, -400, -450, -475, -500, -505, -515];
        lg_hair_types = [1]; 
    }

    
    my_maxspeed = maxspeed[int(random(0, maxspeed.length))];
    my_maxforce = maxforce[int(random(0, maxforce.length))];
    my_sep_mult = sep_mult[int(random(0, sep_mult.length))];
    my_ali_mult = ali_mult[int(random(0, ali_mult.length))];
    my_coh_mult = coh_mult[int(random(0, coh_mult.length))];

    my_neighbordist_1 = neigh_1[int(random(0, neigh_1.length))];
    my_neighbordist_2 = neigh_2[int(random(0, neigh_2.length))];

    my_acceleration_x1 = acce_x1s[int(random(0, acce_x1s.length))];
    my_acceleration_y1 = acce_y1s[int(random(0, acce_y1s.length))];
    
    my_vel_x = vel_xs[int(random(0, vel_xs.length))];
    my_loc_mult = loc_mult[int(random(0, loc_mult.length))];
    my_steer = steers[int(random(0, steers.length))];

    let frees = [1, 1, 2];
    free_mode = frees[int(random(0, frees.length))];
    s_mode = 1; // 1 = +, 2 = %
    follow_mode = int(random(1, 5)); // 1 = normal, 2 = inv x, 3 = inv y, 4 = inv xy
 
    rads = [400, 450, 475, 500, 505, 515, 525, 550, 575, 600, 605, 615, 625, 650, 675, 700, 725, 750, 800, 825, 850];
    radius = rads[int(random(0, rads.length))];
    rad_incs = [0.2, 0.25, 0.25, 0.3, 0.3, 0.35, 0.4, 0.45, 0.5]
    rad_inc = rad_incs[int(random(0, rad_incs.length))];
    ang = 0; 
    speeds = [0.2501, 0.301, 0.401, 0.501, 0.5501]; 
    speed = speeds[int(random(0, speeds.length))];
    
    centerX = size/2;
    centerY = size/2;
    
    // >>> LONG HAIR FX
    // ON/OFF: 1 ON, else OFF
    rapunzel = 1;
    
    // TYPES: 1 lines, 2 arcs
    lg_hair_1_type = lg_hair_types[int(random(0, lg_hair_types.length))];
    lg_hair_2_type = lg_hair_1_type;

    dots_1 = 1; // 1 ON, else OFF
    dots_2 = 1; // 1 ON, else OFF

    arc_1_types = [1, 1, 1, 2, 2];
    arc_1_type = arc_1_types[int(random(0, arc_1_types.length))];
    arc_1_x = int(random(-3, 4));
    arc_1_y = int(random(-3, 4));
    arc_1_x2 = int(random(5, 16));
    arc_1_y2 = int(random(45, 71));

    arc_2_types = [1, 1, 1, 2, 3];
    arc_2_type = arc_2_types[int(random(0, arc_2_types.length))];
    arc_2_x = int(random(-2, 3)) * 10;
    arc_2_y = int(random(-3, 4)) * 100;

    // LINES
    if (rapunzel == 1 && lg_hair_1_type == 1 || rapunzel == 1 && lg_hair_2_type == 1) {
        // LONG HAIR 1
        lg_hairs_1 = 1; // 1 ON, 2 OFF
        
        lg_we1s = [0.035, 0.04, 0.05, 0.055, 0.061, 0.062, 0.063, 0.064, 0.0645, 0.07, 0.08];
        lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

        lg_x1s = [150, 200, 250, 300, 350, 400, 450];
        lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];
        
        lg_y1s = [100, 150, 200, 250, 300, 350];
        lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
    }
    // ARCS
    else if (rapunzel == 1 && lg_hair_1_type == 2 || rapunzel == 1 && lg_hair_2_type == 2) {
        // LONG HAIR 1
        lg_hairs_1 = 1; // 1 ON, 2 OFF
        
        lg_we1s = [0.063, 0.064, 0.065, 0.067, 0.07, 0.075];
        lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

        lg_x1s = [215, 225, 235, 250, 275, 300, 325, 350, 375, 400, 415, 425, 435, 450, 475, 500, 550, 575];
        lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];
        
        lg_y1s = [175, 200, 225, 250, 275, 300, 315, 325, 335, 350, 375, 400];
        lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
        
        // LONG HAIR 2
        if (is_Icons == true && is_Neon_1 == false || is_Icons == true && is_Neon_2 == false || is_Icons == true && is_Neon_3 == false) {
            let h2_switch = [1, 0, 0, 0, 1];
            lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF  
        }
        else {
            lg_hairs_2 = 0; // 1 ON, else OFF  
        }

        lg_we2s = [0.05, 0.051, 0.052, 0.053, 0.054];
        lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

        lg_x2s = [100, 115, 125, 150, 175, 200, 215, 225, 235, 250, 275, 300, 325, 350, 375, 400, 415, 425, 435, 450];
        lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

        lg_y2s =  [100, 125, 135, 150, 175, 200, 215, 225, 250, 275, 300, 315, 325, 350, 400];
        lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
    }
    
    let skip = int(random(1, 5));
    if (icon_v == 1) {
        skip_rapunzel = true;
    }
    else if (icon_v == 2 && skip == 1) {
        skip_rapunzel = true;
    }
    else {
        skip_rapunzel = false;
    }
    
    // >>> SHORT HAIR FX
    sh_hair_1_type = int(random(1, 3)); // 1 line, 2 arc
    sh_hair_2_type = int(random(1, 3)); // 1 line, 2 arc
    dots_3 = 1; // 1 ON, else OFF
    dots_4 = int(random(0, 2)); // 1 ON, else OFF
    
    // LINES
    if (sh_hair_1_type == 1 || sh_hair_2_type == 1) {
        
        sh_we1s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1];
        sh_st_we_1 = sh_we1s[int(random(0, sh_we1s.length))];

        sh_we2s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1];
        sh_st_we_2 = sh_we2s[int(random(0, sh_we2s.length))];

        sh_hairs_1 = 1;
        sh_hairs_2 = int(random(1, 3)); // 1 ON, 2 OFF

        sh_hair_x1 = int(random(10, 30));
        sh_hair_y1 = int(random(10, 35));
        sh_hair_x2 = int(random(10, 30));
        sh_hair_y2 = int(random(10, 35));
    }
    // ARCS
    else if (sh_hair_1_type == 2 || sh_hair_2_type == 2) {
        
        sh_we1s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15];
        sh_st_we_1 = sh_we1s[int(random(0, sh_we1s.length))];

        sh_we2s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15];
        sh_st_we_2 = sh_we2s[int(random(0, sh_we2s.length))];

        sh_hairs_1 = 1;
        sh_hairs_2 = int(random(1, 3)); // 1 ON, 2 OFF

        sh_hair_x1 = int(random(5, 30));
        sh_hair_y1 = int(random(5, 30));
        sh_hair_x2 = int(random(5, 25));
        sh_hair_y2 = int(random(5, 30));
    }
    
    
    // >>> WEIGHTS AND OPACITIES
    // WEIGHTS FOR DOTS
    we1s = [0.10, 0.11, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.185];
    st_we_1 = we1s[int(random(0, we1s.length))];

    we2s = [0.10, 0.11, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.185];
    st_we_2 = we2s[int(random(0, we2s.length))];
    
    // FILL OPACITIES
    if (is_Black_1 == true || is_Black_2 == true || is_Red_2 == true || is_Blue_2 == true || is_Yellow_2 == true) {
        opa_min = 75;
        opa_max = 145;
    }
    else {
        opa_min = 45;
        opa_max = 70; 
    }

    f_alpha_1 = int(random(opa_min, opa_max));
    f_alpha_2 = int(random(opa_min, opa_max));
    f_alpha_3 = int(random(opa_min, opa_max));
    
    f_alpha_4 = int(random(opa_min, opa_max));
    f_alpha_5 = int(random(opa_min, opa_max));
    f_alpha_6 = int(random(opa_min, opa_max));
    
    // STROKE OPACITIES
    s_opa = int(random(11, 17));  
    
    
    // BLEND MODE: 1 NORMAL, 2 SCREEN, 3 LIGHTEST | used in long hair fx
    if (icon_v == 1) {
        blend_type_1 = 3;
        blend_type_2 = 3; 
    }
    else {
        blend_type_1 = 2;
        blend_type_2 = 2; 
    }

    
    // >>> BRUSH: SHAPE, THICKNESS & ROTATION
    // ROT
    if (lg_hair_1_type == 1) {
        movs = [2, 3, 5, 5, 6];
    }
    else {
        movs = [5];
    }
    brush_mov = movs[int(random(0, movs.length))];
    
    accent_x = 0;
    accent_y = 0;
    accent_type_string = 'thin';
    
    // FOR SHAPES
    c_max = int(random(7, 10)); // used in shape 1: circles
    o_x_min = int(random(4, 8)); // used in shape 2: ovals
    o_x_max = int(random(6, 10)); // used in shape 2: ovals
    o_y_min = int(random(4, 8)); // used in shape 2: ovals
    o_y_max = int(random(5, 10)); // used in shape 2: ovals
    r_x_max = int(random(3, 6)); // used in shape 3: rects
    r_y_max = int(random(4, 14)); // used in shape 3: rects
    t_y_1 = int(random(2, 8)); // used in shape 4: small tri
    t_y_2 = int(random(5, 15)); // used in shape 5: mixed tri
    t_x_1 = int(random(2, 5)); // used in shape 6: big tri
    r_x_1 = int(random(14, 18)); // used in shape 7: long thin rects

    // 1: circles, 2: ovals, 3: rects, 4: tri small, 5: tri mixed, 6: tri big, 7: rects long
    let shapes = [1, 2, 3, 4, 4, 5, 5, 6, 6, 7];
    which_shape = shapes[int(random(0, shapes.length))];
    
    
    // DRAW LOOP DURATION
    myStops = [950, 975, 985, 995, 1000, 1000, 1025, 1035, 1050, 1075, 1100, 1125, 1150]; 
    myStop_string = 'medium';
    
    myStop = myStops[int(random(0, myStops.length))];
}

// BRANCHES (old)
function mov_Branches_old() {
    initial_boids = 25;
    boids_start = int(random(1, 4));
    
    branch_type = 1;
    
    // >>> FLOCKING CONTROLS
    maxspeed = [15.3, random(15.3, 15.5), 15.5, 15.6, 15.7, 15.8, 15.9, 16, 16.2, 16.3, 16.5, 16.7, 16.8, 16.9, 17, random(17, 17.5), 17.3, 17.33, 17.35, 17.5];
    my_maxspeed = maxspeed[int(random(0, maxspeed.length))];
    
    maxforce = [1.8, 1.83, 1.85, random(1.8, 2), 1.9, 1.95, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6];
    my_maxforce = maxforce[int(random(0, maxforce.length))];
    
    ali_mult = [0.99, random(0.99, 1), 1];
    my_ali_mult = ali_mult[int(random(0, ali_mult.length))];
    
    sep_mult = [-0.1, 0, 0.2, random(0.2, 0.23), 0.23, 0.25];
    my_sep_mult = sep_mult[int(random(0, sep_mult.length))];
    
    coh_mult = [1.29, 1.293, 1.295, 1.297,1.299, 1.3, 1.31, random(1.31, 1.34), 1.32, 1.33, 1.34, 1.35, 1.355, 1.36];
    my_coh_mult = coh_mult[int(random(0, coh_mult.length))];
    
    separations = [-85, -10, -1, 0];
    
    my_desiredseparation = separations[int(random(0, separations.length))];
    
    neigh_1 = [100, 125, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000, 3500, 5000, 10000, 20000];
    my_neighbordist_1 = neigh_1[int(random(0, neigh_1.length))];
    
    neigh_2 = [450, 475, 500, 550, 575, 600, 625, 650, 675, 700, 725];
    my_neighbordist_2 = neigh_2[int(random(0, neigh_2.length))];

    acce_x1s = [-1, 0, 1];
    my_acceleration_x1 = acce_x1s[int(random(0, acce_x1s.length))];
    
    acce_y1s = [-1, 0, 1];
    my_acceleration_y1 = acce_y1s[int(random(0, acce_y1s.length))];

    vel_xs = [-1000, -750, -500, -300, -100];
    my_vel_x = vel_xs[int(random(0, vel_xs.length))];
    
    loc_mult = [-0.5, -0.4, -0.3, -0.1, -0.08, -0.01, -0.007, -0.005, -0.003, 0, 0.05, 0.1];
    my_loc_mult = loc_mult[int(random(0, loc_mult.length))];
    
    steers = [1000, -1000, -1000, -2000, -3000, -4000, -5000, -10000, -1000000];
    my_steer = steers[int(random(0, steers.length))];
        
    rads = [5, 10, 15, 25, 35, 50, 75, 100];
    radius = rads[int(random(0, rads.length))];
    
    rad_incs = [0.01, 0.05, 0.1, 0.15, 0.2, 0.25]
    rad_inc = rad_incs[int(random(0, rad_incs.length))];
    
    mult_xs = [1, 1.5, 2];
    rad_mult_x = mult_xs[int(random(0, mult_xs.length))];
    
    mult_ys = [1, 1.5, 2];
    rad_mult_y = mult_ys[int(random(0, mult_ys.length))];
    
    ang = 0; 
    
    speeds = [0.05, 0.03, 0.01, 0.001, 0, -0.01, -0.1]; 
    speed = speeds[int(random(0, speeds.length))];
    
    centerX = size/2;
    centerY = size/2; 
    
    // >>> LONG HAIR FX
    // ON/OFF: 1 ON, else OFF
    if (is_bg_black == true) {
        rapunzels = [1, 1, 1, 1, 2];
        rapunzel = rapunzels[int(random(0, rapunzels.length))];   
    }
    else if (is_bg_white == true) {
        rapunzel = 0;  
    }
    else {
        rapunzels = [1, 1, 2, 2];
        rapunzel = rapunzels[int(random(0, rapunzels.length))];   
    }

    // TYPES: 1 lines, 2 arcs
    if (is_bg_black == true) {
        lg_hair_types = [1, 1, 1, 2];  
    }
    else {
        lg_hair_types = [2];  
    }
    lg_hair_1_type = lg_hair_types[int(random(0, lg_hair_types.length))];
    lg_hair_2_type = lg_hair_1_type;

    dots_1 = int(random(0, 2)); // 1 ON, else OFF
    dots_2 = int(random(0, 2)); // 1 ON, else OFF

    arc_1_types = [1, 1, 2, 3, 1];
    arc_1_type = arc_1_types[int(random(0, arc_1_types.length))];
    arc_1_x = int(random(-3, 4));
    arc_1_y = int(random(-3, 4));
    arc_1_x2 = int(random(5, 16));
    arc_1_y2 = int(random(45, 71));

    arc_2_types = [1, 2, 3, 3, 1];
    arc_2_type = arc_2_types[int(random(0, arc_2_types.length))];
    arc_2_x = int(random(-2, 3)) * 10;
    arc_2_y = int(random(-3, 4)) * 100;

    // LINES
    if (rapunzel == 1 && lg_hair_1_type == 1 || rapunzel == 1 && lg_hair_2_type == 1) {
        // LONG HAIR 1
        lg_hairs_1 = 1; // 1 ON, 2 OFF

        if (is_bg_black == true) {
            lg_we1s = [0.063, 0.064, 0.065, 0.07, 0.08, 0.09]; 
        }
        else {
            lg_we1s = [0.061, 0.062, 0.063];
        }

        lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

        lg_x1s = [100, 150, 200, 300, 500];
        lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

        lg_y1s = [75, 85, 100, 150, 175, 250, 300];
        lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
        
        // LONG HAIR 2
        let h2_switch = [1, 1, 1, 0, 0];
        lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

        if (is_bg_black == true) {
            lg_we2s = [0.061, 0.062, 0.063];
        }
        else {
            lg_we2s = [0.061, 0.062, 0.0625];
        }

        lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

        lg_x2s = [100, 150, 200, 300, 350];
        lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

        lg_y2s = [75, 95, 125, 200, 300];
        lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
    }
    // ARCS
    if (rapunzel == 1 && lg_hair_1_type == 2 || rapunzel == 1 && lg_hair_2_type == 2) {
    // LONG HAIR 1
        lg_hairs_1 = 1; // 1 ON, 2 OFF

        if (is_bg_black == true) {
            lg_we1s = [0.064, 0.065, 0.066];
        }
        else {
            lg_we1s = [0.06, 0.061, 0.062, 0.063, 0.065];
            
        }
        lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

        lg_x1s = [55, 75, 100, 125, 150, 175, 200, 400, 450, 500];
        lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

        lg_y1s = [55, 65, 75, 85, 95, 100, 115];
        lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];

        // LONG HAIR 2
        let h2_switch = [1, 1, 1, 1, 0, 1];
        lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

        if (is_bg_black == true) {
            lg_we2s = [0.062, 0.063, 0.064, 0.065];
        }
        else {
            lg_we2s = [0.061, 0.062, 0.063];
        }
        lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

        lg_x2s = [55, 65, 115, 125, 150, 200, 300];
        lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

        lg_y2s = [65, 75, 85, 100, 115];
        lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
    }
 
    skip_rapunzel = false;
    
    // >>> SHORT HAIR FX
    sh_hair_1_type = int(random(1, 3)); // 1 line, 2 arc
    sh_hair_2_type = int(random(1, 3)); // 1 line, 2 arc
    dots_3 = int(random(0, 2)); // 1 ON, else OFF
    dots_4 = int(random(0, 3)); // 1 ON, else OFF

    // LINES
    if (sh_hair_1_type == 1 || sh_hair_2_type == 1) {
        
        sh_we1s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_1 = sh_we1s[int(random(0, sh_we1s.length))];

        sh_we2s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_2 = sh_we2s[int(random(0, sh_we2s.length))];

        sh_hairs_1 = 1;
        sh_hairs_2 = int(random(1, 3)); // 1 ON, 2 OFF

        sh_hair_x1 = int(random(5, 20));
        sh_hair_y1 = int(random(5, 20));
        sh_hair_x2 = int(random(5, 20));
        sh_hair_y2 = int(random(5, 20));
    }
    // ARCS
    else if (sh_hair_1_type == 2 || sh_hair_2_type == 2) {
        
        sh_we1s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_1 = sh_we1s[int(random(0, sh_we1s.length))];

        sh_we2s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_2 = sh_we2s[int(random(0, sh_we2s.length))];

        sh_hairs_1 = 1;
        sh_hairs_2 = int(random(1, 3)); // 1 ON, 2 OFF

        sh_hair_x1 = int(random(5, 16));
        sh_hair_y1 = int(random(5, 16));
        sh_hair_x2 = int(random(5, 16));
        sh_hair_y2 = int(random(5, 16));
    }
    
    
    // >>> WEIGHTS AND OPACITIES
    // WEIGHTS FOR DOTS
    we1s = [0.10, 0.11, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.185];
    st_we_1 = we1s[int(random(0, we1s.length))];

    we2s = [0.10, 0.11, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.185];
    st_we_2 = we2s[int(random(0, we2s.length))];
    
    // FILL OPACITIES
    if (is_Black_1 == true || is_Black_2 == true || is_Red_2 == true || is_Blue_2 == true || is_Yellow_2 == true) {
        opa_min = 75;
        opa_max = 145;
    }
    else {
        opa_min = 70;
        opa_max = 85; 
    }

    f_alpha_1 = int(random(opa_min, opa_max));
    f_alpha_2 = int(random(opa_min, opa_max));
    f_alpha_3 = int(random(opa_min, opa_max));
    
    f_alpha_4 = int(random(opa_min, opa_max));
    f_alpha_5 = int(random(opa_min, opa_max));
    f_alpha_6 = int(random(opa_min, opa_max));
    
    // STROKE OPACITY
    if (is_bg_black == true) {
        s_opa = int(random(10, 20));  
    }
    else {
        s_opa = int(random(10, 20));
    }
    
    // BLEND MODE: 1 NORMAL, 2 SCREEN, 3 LIGHTEST | used in long hairs
    blend_type_1 = 2;
    blend_type_2 = 2;

    
    // >>> BRUSH: SHAPE, THICKNESS & ROTATION
    // ROT
    if (lg_hair_1_type == 1) {
        movs = [2, 2, 4, 4, 6];
    }
    else if (lg_hair_1_type == 2) {
        movs = [5, 5, 6]; 
    }
    brush_mov = movs[int(random(0, movs.length))];
    
    // THICKNESS
    accent_type = int(random(1, 6));
    
    // medium
    if (accent_type == 1 || accent_type == 3) {
        accent_x = int(random(5, 12)); 
        accent_y = int(random(5, 14)); 
        accent_type_string = 'medium'
    }
    // thin
    else {
        accent_x = int(random(0, 7)); 
        accent_y = int(random(0, 7)); 
        accent_type_string = 'thin'
    }

    // FOR SHAPES
    c_max = int(random(4, 9)); // used in shape 1: circles
    o_x_min = int(random(2, 6)); // used in shape 2: ovals
    o_x_max = int(random(7, 8)); // used in shape 2: ovals
    o_y_min = int(random(2, 6)); // used in shape 2: ovals
    o_y_max = int(random(7, 11)); // used in shape 2: ovals
    r_x_max = int(random(2, 7)); // used in shape 3: rects
    r_y_max = int(random(4, 21)); // used in shape 3: rects
    t_y_1 = int(random(2, 10)); // used in shape 4: small tri
    t_y_2 = int(random(10, 21)); // used in shape 5: mixed tri
    t_x_1 = int(random(1, 8)); // used in shape 6: big tri
    r_x_1 = int(random(10, 21)); // used in shape 7: long thin rects

    // 1: circles, 2: ovals, 3: rects, 4: tri small, 5: tri mixed, 6: tri big, 7: rects long
    let shapes = [1, 2, 3, 4, 4, 4, 5, 5, 6, 7];
    which_shape = shapes[int(random(0, shapes.length))];
    
    
    // >>> FRONTERA        
    if (accent_type == 1) {
        frontera = 37; 
    }
    else {
        frontera = 30;     
    }
    
    
    // >>> DRAW LOOP DURATION
    which_stop = int(random(1, 5));
    // short
    if (which_stop == 1) {
        myStops = [700, 725, 750, 800, 850];
        myStop_string = 'short';
    }
    // long
    else if (which_stop == 2) {
        myStops = [950, 975, 1000, 1025, 1100, 1200];
        myStop_string = 'long';
    }
    // medium 
    else {
        myStops = [850, 875, 900, 915, 925, 950]; 
        myStop_string = 'medium';   
    }

    myStop = myStops[int(random(0, myStops.length))];
}

// BRANCHES (new)
function mov_Branches_new() {
    initial_boids = int(random(35, 41));
    boids_start = int(random(1, 6));
    
    // 1 = OFF, > 1 = ON
    my_frontera = int(random(2, 10)); // maybe remove
    
    // >>> FLOCKING CONTROLS
    maxspeed = [25, 25.1, 25.3, 25.35, 25.4, 25.45, 25.5, 25.7, 25.8, 25.85, 26, random(26, 26.5), 26.3, 26.5, 26.7, 27, 27.3, 27.5, 27.7, 27.8, 27.9, 28];
    my_maxspeed = maxspeed[int(random(0, maxspeed.length))];
    
    maxforce = [11, 11.3, 11.5, 11.7, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 17.9, 17.95, 18, 18.05, 18.15];
    my_maxforce = maxforce[int(random(0, maxforce.length))];
    
    sep_mult = [0.8, random(0.8, 0.9), 0.81, 0.82, 0.83, 0.85, 0.87, 0.9, 0.93, 0.95, 0.97, 1, 1.05, 1.07, 1.1, 1.12]
    my_sep_mult = sep_mult[int(random(0, sep_mult.length))];
    
    ali_mult = [0.96, 0.965, 0.97, 0.975, 0.98, 0.985, 0.99, 0.995, 1, 1.03, 1.05, 1.07, 1.08, 1.1, 1.105, 1.11, 1.115, 1.12, 1.125, 1.13];
    my_ali_mult = ali_mult[int(random(0, ali_mult.length))];
    
    coh_mult = [0.75, 0.76, 0.77, 0.78, 0.79, 0.8, random(0.8, 0.85), 0.83, 0.84, 0.85, 0.86, 0.87, 0.88, 0.89, 0.9, 0.905, 0.91, 0.915, 0.92, 0.93, 0.93, 0.93, 0.935, 0.94];
    my_coh_mult = coh_mult[int(random(0, coh_mult.length))];
    
    separations = [-100, -85];
    my_desiredseparation = separations[int(random(0, separations.length))];
    
    neigh_1 = [3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 12500, 15000];
    my_neighbordist_1 = neigh_1[int(random(0, neigh_1.length))];
    
    neigh_2 = [700, 750, 800, 900, 1000, 1250, 1500, 2000, 2250, 2500, 3000, 3250, 3500];
    my_neighbordist_2 = neigh_2[int(random(0, neigh_2.length))]; 

    acce_x1s = [-1, 0, 1, 1000, 0];
    my_acceleration_x1 = acce_x1s[int(random(0, acce_x1s.length))];
    
    acce_y1s = [-1, 0, 1, 0];
    my_acceleration_y1 = acce_y1s[int(random(0, acce_y1s.length))];

    vel_xs = [-3, -2, -1, 1, 2, 3];
    my_vel_x = vel_xs[int(random(0, vel_xs.length))] * 1000;
    
    loc_mult = [-0.08, -0.075, -0.07, -0.06, -0.055, -0.05, -0.04, -0.035, -0.03, -0.025, -0.02, -0.015, -0.01, -0.009, -0.007, -0.005, -0.003, -0.002, -0.001, 0, 0, 0, 0.001, 0.005, 0.1];
    my_loc_mult = loc_mult[int(random(0, loc_mult.length))];
    
    my_steer = 0;
    
    follow_mode = int(random(1, 5)); // 1 = normal, 2 = inv x, 3 = inv y, 4 = inv xy

    rads = [25, 50, 75, 100, 125, 150, 200, 225, 250, 300, 25];
    radius = rads[int(random(0, rads.length))];
    
    rad_incs = [0.15, 0.2, 0.2, 0.25, 0.25, 0.3, 0.35, 0.4]
    rad_inc = rad_incs[int(random(0, rad_incs.length))];
    
    ang = 0; 
    
    speeds = [0.01, 0.01, 0.01, 0.011, random(0.011, 0.015), 0.015, 0.05, 0.1, 0.295, 0.3]; 
    speed = speeds[int(random(0, speeds.length))];
    
    centerX = size/2;
    centerY = size/2; 
    
    // >>> LONG HAIR FX
    // ON/OFF: 1 ON, else OFF
    if (is_bg_black == true) {
        rapunzels = [1, 1, 1, 1, 2];
        rapunzel = rapunzels[int(random(0, rapunzels.length))];   
    }
    else if (is_bg_white == true) {
        rapunzel = 0;  
    }
    else {
        rapunzels = [1, 1, 2, 2, 2];
        rapunzel = rapunzels[int(random(0, rapunzels.length))];   
    }

    // TYPES: 1 lines, 2 arcs
    if (is_bg_black == true) {
        lg_hair_types = [1, 1, 2, 2];  
    }
    else {
        lg_hair_types = [2];  
    }
    lg_hair_1_type = lg_hair_types[int(random(0, lg_hair_types.length))];
    lg_hair_2_type = lg_hair_1_type;

    dots_1 = int(random(0, 2)); // 1 ON, else OFF
    dots_2 = int(random(0, 2)); // 1 ON, else OFF

    arc_1_types = [1, 1, 2, 3, 1];
    arc_1_type = arc_1_types[int(random(0, arc_1_types.length))];
    arc_1_x = int(random(-3, 4));
    arc_1_y = int(random(-3, 4));
    arc_1_x2 = int(random(5, 16));
    arc_1_y2 = int(random(45, 71));

    arc_2_types = [1, 2, 3, 3, 1];
    arc_2_type = arc_2_types[int(random(0, arc_2_types.length))];
    arc_2_x = int(random(-2, 3)) * 10;
    arc_2_y = int(random(-3, 4)) * 100;

    // LINES
    if (rapunzel == 1 && lg_hair_1_type == 1 || rapunzel == 1 && lg_hair_2_type == 1) {
        // LONG HAIR 1
        lg_hairs_1 = 1; // 1 ON, 2 OFF

        if (is_bg_black == true) {
            lg_we1s = [0.063, 0.064, 0.065]; 
        }
        else {
            lg_we1s = [0.061, 0.062, 0.063, 0.065];
        }
        lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

        lg_x1s = [100, 150, 200, 300, 500];
        lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

        lg_y1s = [75, 85, 100, 150, 175, 250, 300];
        lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
        
        // LONG HAIR 2
        let h2_switch = [1, 1, 1, 0, 0];
        lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

        if (is_bg_black == true) {
            lg_we2s = [0.061, 0.062, 0.063];
        }
        else {
            lg_we2s = [0.061, 0.062, 0.0625];
        }
        lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

        lg_x2s = [100, 150, 200, 300, 350];
        lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

        lg_y2s = [75, 95, 125, 200, 300];
        lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
    }
    // ARCS
    if (rapunzel == 1 && lg_hair_1_type == 2 || rapunzel == 1 && lg_hair_2_type == 2) {
    // LONG HAIR 1
        lg_hairs_1 = 1; // 1 ON, 2 OFF

        if (is_bg_black == true) {
            lg_we1s = [0.061, 0.062, 0.063];
        }
        else {
            lg_we1s = [0.061, 0.062, 0.063];
        }
        lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

        lg_x1s = [55, 60, 85, 100, 125, 150, 175, 200, 250, 300, 400, 500, 550, 600, 650];
        lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

        lg_y1s = [55, 65, 75, 85, 95, 100, 115];
        lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];

        // LONG HAIR 2
        let h2_switch = [1, 1, 1, 1, 0, 1];
        lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

        if (is_bg_black == true) {
            lg_we2s = [0.061, 0.062, 0.063];
        }
        else {
            lg_we2s = [0.061, 0.062, 0.063];
        }
        lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

        lg_x2s = [55, 65, 115, 150, 200, 300, 400, 450];
        lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

        lg_y2s = [65, 75, 85, 100, 115];
        lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
    }
 
    skip_rapunzel = false;
    
    // >>> SHORT HAIR FX
    sh_hair_1_type = int(random(1, 3)); // 1 line, 2 arc
    sh_hair_2_type = int(random(1, 3)); // 1 line, 2 arc
    dots_3 = int(random(0, 2)); // 1 ON, else OFF
    dots_4 = int(random(0, 3)); // 1 ON, else OFF

    // LINES
    if (sh_hair_1_type == 1 || sh_hair_2_type == 1) {
        
        sh_we1s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_1 = sh_we1s[int(random(0, sh_we1s.length))];

        sh_we2s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_2 = sh_we2s[int(random(0, sh_we2s.length))];

        sh_hairs_1 = 1;
        sh_hairs_2 = int(random(1, 3)); // 1 ON, 2 OFF

        sh_hair_x1 = int(random(5, 20));
        sh_hair_y1 = int(random(5, 20));
        sh_hair_x2 = int(random(5, 20));
        sh_hair_y2 = int(random(5, 20));
    }
    // ARCS
    else if (sh_hair_1_type == 2 || sh_hair_2_type == 2) {
        
        sh_we1s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_1 = sh_we1s[int(random(0, sh_we1s.length))];

        sh_we2s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_2 = sh_we2s[int(random(0, sh_we2s.length))];

        sh_hairs_1 = 1;
        sh_hairs_2 = int(random(1, 3)); // 1 ON, 2 OFF

        sh_hair_x1 = int(random(4, 13));
        sh_hair_y1 = int(random(5, 16));
        sh_hair_x2 = int(random(4, 13));
        sh_hair_y2 = int(random(5, 16));
    }
    
    
    // >>> WEIGHTS AND OPACITIES
    // WEIGHTS FOR DOTS
    we1s = [0.10, 0.11, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.185];
    st_we_1 = we1s[int(random(0, we1s.length))];

    we2s = [0.10, 0.11, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.185];
    st_we_2 = we2s[int(random(0, we2s.length))];
    
    // FILL OPACITIES
    if (is_Black_1 == true || is_Black_2 == true || is_Red_2 == true || is_Blue_2 == true || is_Yellow_2 == true) {
        opa_min = 75;
        opa_max = 145;
    }
    else {
        opa_min = 70;
        opa_max = 85; 
    }

    f_alpha_1 = int(random(opa_min, opa_max));
    f_alpha_2 = int(random(opa_min, opa_max));
    f_alpha_3 = int(random(opa_min, opa_max));
    
    f_alpha_4 = int(random(opa_min, opa_max));
    f_alpha_5 = int(random(opa_min, opa_max));
    f_alpha_6 = int(random(opa_min, opa_max));
    
    // STROKE OPACITY
    s_opa = int(random(7, 18));
    
    // BLEND MODE: 1 NORMAL, 2 SCREEN, 3 LIGHTEST | used in long hair fx
    blend_type_1 = 2;
    blend_type_2 = 2;
    
    
    // >>> BRUSH: SHAPE, THICKNESS & ROTATION
    // ROT
    if (lg_hair_1_type == 1) {
        movs = [1, 2, 3, 4, 5, 6];
    }
    else if (lg_hair_1_type == 2) {
        movs = [1, 3, 5, 6]; 
    }
    brush_mov = movs[int(random(0, movs.length))];
   
    // THICKNESS
    accent_type = int(random(0, 5));
    
    // medium
    if (accent_type == 1) {
        accent_x = int(random(0, 4)); 
        accent_y = int(random(0, 4)); 
        accent_type_string = 'medium';
    }
    // thin
    else {
        accent_x = int(random(0, 2));
        accent_y = int(random(0, 2)); 
        accent_type_string = 'thin';
    }
    
    // FOR SHAPES
    c_max = int(random(4, 8)); // used in shape 1: circles
    o_x_min = int(random(2, 5)); // used in shape 2: ovals
    o_x_max = int(random(7, 6)); // used in shape 2: ovals
    o_y_min = int(random(2, 6)); // used in shape 2: ovals
    o_y_max = int(random(4, 8)); // used in shape 2: ovals
    r_x_max = int(random(1, 6)); // used in shape 3: rects
    r_y_max = int(random(4, 21)); // used in shape 3: rects
    t_y_1 = int(random(2, 10)); // used in shape 4: small tri
    t_y_2 = int(random(10, 21)); // used in shape 5: mixed tri
    t_x_1 = int(random(1, 5)); // used in shape 6: big tri
    r_x_1 = int(random(5, 20)); // used in shape 7: long thin rects

    // 1: circles, 2: ovals, 3: rects, 4: tri small, 5: tri mixed, 6: tri big, 7: rects long
    let shapes = [1, 1, 2, 3, 4, 5, 5, 6, 7, 7];
    which_shape = shapes[int(random(0, shapes.length))];
    
    
    // >>> FRONTERA
    if (my_frontera > 1) {
        if (accent_type == 1) {
            frontera = 40; 
        }
        else {
            frontera = 30;     
        }
    }
    else {
        frontera = 0;
    }
    
    
    // >>>DRAW LOOP DURATION
    which_stop = int(random(1, 4));
    
    // short
    if (which_stop == 1 && my_maxforce <= 15) {
        myStops = [375, 400, 415, 425, 435, 450, 475, 500, 515, 525, 550]; 
        myStop_string = 'short';
    }
    // medium
    else {
        myStops = [550, 575, 585, 600, 605, 615, 620, 625, 630, 650, 675, 700, 725, 750]; 
        myStop_string = 'medium';
    }
    
    myStop = myStops[int(random(0, myStops.length))];
}

// LOOPS
function mov_Loops() {
    frontera = 'NO';
    
    loops = random();
    
    if (is_bg_black == true && is_Black_1 == false) {
        if (loops <= 0.14){
            loop_type = 1;
        }
        else if (loops > 0.14 && loops <= 0.34) { 
            loop_type = 2;   
        }
        else if (loops > 0.34 && loops <= 0.4) { 
            loop_type = 3;   
        }
        else if (loops > 0.4 && loops <= 0.46) {
            loop_type = 4;   
        }
        else if (loops > 0.46 && loops <= 0.68) {
            loop_type = 5;   
        }
        else if (loops > 0.68 && loops <= 0.72) {
            loop_type = 6;   
        }
        else if (loops > 0.72 && loops <= 0.94) {
            loop_type = 7;   
        }
        else {
            loop_type = 8;   
        }
    }
    else if (is_bg_black == true && is_Black_1 == true) {
        if (loops <= 0.15){
            loop_type = 1;
        }
        else if (loops > 0.15 && loops <= 0.3) { 
            loop_type = 2;   
        }
        else if (loops > 0.3 && loops <= 0.37) { 
            loop_type = 3;   
        }
        else if (loops > 0.37 && loops <= 0.45) {
            loop_type = 4;   
        }
        else if (loops > 0.45 && loops <= 0.70) {
            loop_type = 5;   
        }
        else if (loops > 0.70 && loops <= 0.74) {
            loop_type = 6;   
        }
        else if (loops > 0.74 && loops <= 0.92) {
            loop_type = 7;   
        }
        else {
            loop_type = 8;   
        }
    }
    else {
        if (loops <= 0.12){
            loop_type = 1;
        }
        else if (loops > 0.12 && loops <= 0.3) { 
            loop_type = 2;   
        }
        else if (loops > 0.3 && loops <= 0.37) {
            loop_type = 3;   
        }
        else if (loops > 0.37 && loops <= 0.42) { 
            loop_type = 4;   
        }
        else if (loops > 0.42 && loops <= 0.68) {
            loop_type = 5;   
        }
        else if (loops > 0.68 && loops <= 0.71) { 
            loop_type = 6;   
        }
        else if (loops > 0.71 && loops <= 0.93) { 
            loop_type = 7;   
        }
        else if (loops > 0.93 && loops <= 0.95) { 
            loop_type = 2;   
        }
        else {
            loop_type = 8;   
        }
    }

    //loop_type = 5;  
    
    if (loop_type == 1) {
        initial_boids = 35; 
        
        let l1_vs = [1, 1, 2, 2, 3, 3];
        l1_v = l1_vs[int(random(0, l1_vs.length))];
        
        // >>> FLOCKING CONTROLS 
        if (l1_v == 1) {
            boids_start = int(random(1, 5));
            
            let l1_mults = [1.2, 1.21, 1.22, 1.23, 1.24, 1.25, 1.26, 1.27, 1.28, 1.29, 1.3, 1.31, 1.32, 1.33, 1.34, 1.35, 1.37, 1.38, 1.39, 1.4, 1.41, 1.42, 1.43, 1.44, 1.45, 1.46];
            l1_mult = l1_mults[int(random(0, l1_mults.length))];
            
            maxspeed = [20.3, 20.4, 20.5, 20.5, 20.5, 20.55, random(20.5, 21), 21, 21.2, 21.3, 21.5, 21.7, 21.9, 22, 22.2, 22.2, 22.3];
            maxforce = [0.9, 1.05, 1.08, 1.08, 1.08, 1.083, 1.085, random(1.08, 1.1), 1.09, 1.1, 1.105, 1.107, 1.11, 1.12, 1.125];
            sep_mult = [0.05, 0.055, 0.06, random(0.06, 0.07), 0.07, 0.0705, 0.08, 0.08, 0.08, 0.083, 0.085, 0.09, 0.095, 0.1];
            ali_mult = [0.65, 0.655, 0.66, 0.665, 0.67, 0.675, 0.68, 0.69, 0.7, 0.71, 0.72, 0.73, 0.74, 0.75, 0.76, 0.76, 0.76, 0.762, 0.763, 0.765, 0.77, 0.7705, 0.771, 0.78, 0.781];
            coh_mult = [random(1.11, 1.14), 1.11, 1.11, 1.11, 1.113, 1.115, 1.12, 1.123, 1.125, 1.127, 1.13, 1.133, 1.135, 1.137, 1.14];
            separations = [-1000, -100, -50, -10, -1, 0, 0];
            
            loc_mult = [-0.1, -0.09, -0.08, -0.07, -0.06, -0.05, -0.04, -0.03, -0.008, -0.007, -0.007, -0.007, -0.007, -0.007, -0.005, -0.001, 0, 0];
            my_loc_mult = loc_mult[int(random(0, loc_mult.length))];
            
            neigh_1 = [100, 100, 100, 100, 200, 300, 400, 5000, 10000];
            neigh_2 = [550, 600, 700, 750, 800, 900, 900, 900, 900, 900, 950, 950, 800, 1000, 1200];
            speeds = [0.25, 0.25, 0.25, 0.27, 0.29, 0.299, 0.3, 0.305, 0.31];
        }
        else if (l1_v == 2 || l1_v == 3) {
            boids_start = int(random(1, 5));
            
            let l1_mults = [1.15, 1.155, 1.16, 1.17, 1.18, 1.19, 1.2, 1.205, 1.21, 1.22, 1.225, 1.23, 1.24, 1.25, 1.26, 1.27, 1.28, 1.3, 1.3, 1.31, 1.32, 1.33, 1.35, 1.35, 1.36, 1.37, 1.38, 1.4];
            l1_mult = l1_mults[int(random(0, l1_mults.length))];
            
            maxspeed = [20.5, 20.6, 20.7, 20.8, 21, 21.2, 21.3, 21.5, random(21.5, 21.7), 21.7, 22, 22.15, 22.25, 22.3, 22.4, 22.5, 22.7];
            maxforce = [0.97, 0.98, 1.04, 1.045, random(1.03, 1.08), 1.05, 1.055, 1.055, 1.055, 1.06, 1.065, 1.07, 1.075, 1.08, 1.083];
            sep_mult = [0.01, 0.02, 0.03, 0.04, 0.05, 0.055, 0.06, random(0.06, 0.07), 0.07, 0.075, 0.08, 0.085, 0.09, 0.1, 0.12, 0.13, 0.15, 0.19, 0.2];
            ali_mult = [0.65, 0.655, 0.66, 0.67, 0.69, 0.7, 0.71, 0.72, 0.73, 0.74, 0.75, 0.76, 0.77];
            coh_mult = [1.11, 1.115, 1.12, 1.12, 1.12, 1.123, 1.125, 1.127, 1.13, 1.131]; 
            separations = [-1000, -100, -50, -10, -1, 0, 0];
            
            loc_mult = [-0.1, -0.09, -0.08, -0.07, -0.06, -0.05, -0.04, -0.03, -0.008, -0.007, -0.005, -0.001, 0, 0, 0, 0];
            my_loc_mult = loc_mult[int(random(0, loc_mult.length))];
            
            neigh_1 = [150, 150, 200, 300, 400, 5000, 5000, 5000];
            neigh_2 = [550, 600, 600, 600, 700, 750, 800, 900, 950, 950, 800, 1000, 1200];
            speeds = [0.27, 0.27, 0.27, 0.29, 0.299, 0.3, 0.305, 0.31];
        }
        
        my_maxspeed = maxspeed[int(random(0, maxspeed.length))];
        my_maxforce = maxforce[int(random(0, maxforce.length))];
        
        my_sep_mult = sep_mult[int(random(0, sep_mult.length))];
        my_ali_mult = ali_mult[int(random(0, ali_mult.length))];
        my_coh_mult = coh_mult[int(random(0, coh_mult.length))];

        my_desiredseparation = separations[int(random(0, separations.length))];
        my_neighbordist_1 = neigh_1[int(random(0, neigh_1.length))];
        my_neighbordist_2 = neigh_2[int(random(0, neigh_2.length))];
        
        acce_x1s = [-500, -200, -100, 0, 0, 1, 1, 1, 1, 10, 100, 500];
        my_acceleration_x1 = acce_x1s[int(random(0, acce_x1s.length))];
        
        acce_y1s = [-1000, -500, -100, 0, 0, 1, 10, 100, 500, 500, 500, 500];
        my_acceleration_y1 = acce_y1s[int(random(0, acce_y1s.length))];

        vel_xs = [-100, 0, 100, 100, 100, 100, 100, 1000];
        my_vel_x = vel_xs[int(random(0, vel_xs.length))];

        steers = [0.5, 0.5, 0.5, 1, 5, 10, 15, 20];
        my_steer = steers[int(random(0, steers.length))];
        
        if (l1_v == 1) {
            rads = [250, 275, 300, 305, 310, 315, 325, 350, 400, 450, 500, 600, 600, 600];
        }
        else if (l1_v == 2) {
            rads = [400, 500, 515, 525, 535, 545, 550, 565, 575, 585, 600, 650, 700, 750, 800];
        }
        else {
            rads = [375, 400, 450, 500, 500, 500, 505, 515, 525, 535, 545, 555, 600, 650, 700];
        }
        radius = rads[int(random(0, rads.length))];
        
        rad_incs = [0.15, 0.17, 0.2, 0.21, 0.22, 0.23, 0.25, 0.27, 0.29, 0.3]
        rad_inc = rad_incs[int(random(0, rad_incs.length))];
        
        ang = 0; 
        
        speed = speeds[int(random(0, speeds.length))];
    
        // >>> LONG HAIR FX
        // ON/OFF: 1 ON, else OFF
        if (is_bg_black == true) {
            rapunzel = 1;
        }
        else if (is_bg_white == true) {
            rapunzel = 0;  
        }
        else {
            rapunzels = [1, 1, 2, 2, 2];
            rapunzel = rapunzels[int(random(0, rapunzels.length))];   
        }
        
        // TYPES: 1 lines, 2 arcs
        lg_hair_1_type = 2;
        lg_hair_2_type = lg_hair_1_type;
        
        let d1s = [1, 1, 1, 1, 1];
        dots_1 = d1s[int(random(0, d1s.length))];  // 1 ON, else OFF
        dots_2 = int(random(1, 1)); // 1 ON, else OFF

        arc_1_types = [1, 1, 2, 3, 1];
        arc_1_type = arc_1_types[int(random(0, arc_1_types.length))];
        arc_1_x = int(random(-3, 4));
        arc_1_y = int(random(-3, 4));
        arc_1_x2 = int(random(5, 16));
        arc_1_y2 = int(random(45, 71));
        
        arc_2_types = [1, 2, 3, 3, 1];
        arc_2_type = arc_2_types[int(random(0, arc_2_types.length))];
        arc_2_x = int(random(-2, 3)) * 10;
        arc_2_y = int(random(-3, 4)) * 100;

        // ARCS
        if (rapunzel == 1 && lg_hair_1_type == 2 || rapunzel == 1 && lg_hair_2_type == 2) {
        // LONG HAIR 1
            lg_hairs_1 = 1; // 1 ON, 2 OFF

            if (is_bg_black == true) {
                if (is_Black_1 == true) {
                    lg_we1s = [0.2, 0.2, 0.25, 0.3, 0.35, 0.4];
                }
                else {
                    lg_we1s = [0.06, 0.063, 0.065, 0.067, 0.07, 0.072, 0.075];
                }
                lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];
                    
                lg_x1s = [200, 250, 300, 350, 375, 400, 425, 450, 475, 500, 550, 600];
                lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

                lg_y1s = [75, 100, 125, 135, 150, 180, 200, 225, 250, 300, 325, 350];
                lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
            }
            else if (is_bg_white == true) {
                lg_we1s = [0.06, 0.063, 0.065, 0.067, 0.07, 0.072, 0.075];
                lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

                lg_x1s = [150, 175, 200, 225, 250, 275, 300, 325, 350, 375];
                lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

                lg_y1s = [75, 85, 95, 115, 125, 135, 180, 200, 300];
                lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
            }
            else {
                lg_we1s = [0.06, 0.063, 0.065, 0.067, 0.07, 0.072, 0.075];
                lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

                lg_x1s = [250, 300, 325, 350, 375];
                lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

                lg_y1s = [90, 100, 125, 135, 180, 200, 250];
                lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
            }

            // LONG HAIR 2
            let h2_switch =  [1, 1, 0, 1, 0, 1];
            lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

            if (is_bg_black == true) {
                if (is_Black_1 == true) {
                    lg_we2s = [0.15, 0.15, 0.2, 0.25];
                    lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];
                    
                    lg_x2s = [150, 200, 250, 300, 350];
                    lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];
                    
                    lg_y2s = [75, 85, 95, 105, 115, 125];
                    lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
                }
                else {
                    lg_we2s = [0.06, 0.062, 0.063, 0.064, 0.065];
                    lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];
                    
                    lg_x2s = [75, 100, 150, 175, 200, 250, 300, 350, 650];
                    lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

                    lg_y2s = [65, 75, 95, 100, 115, 125, 135, 150, 175, 200, 225];
                    lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
                }
            }
            else if (is_bg_white == true) {
                if (dots_1 == 1) {
                    lg_we2s = [0.075, 0.08, 0.085, 0.09, 0.095, 0.1, 0.11, 0.12];
                }
                else {
                    lg_we2s = [0.06, 0.063, 0.065, 0.067, 0.07, 0.072, 0.075, 0.08, 0.085];
                }
                lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

                lg_x2s = [75, 85, 95, 115, 125, 135, 150, 200, 250, 300, 350];
                lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

                lg_y2s = [65, 75, 95, 100, 115, 125, 135, 250];
                lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
            }
            else {
                if (dots_1 == 1) {
                    lg_we2s = [0.065, 0.07, 0.075, 0.08, 0.085, 0.09, 0.095, 0.1, 0.11, 0.12];
                }
                else {
                    lg_we2s = [0.067, 0.07, 0.072, 0.075, 0.08, 0.085, 0.09];
                }
                lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];
                
                lg_x2s = [75, 90, 100, 150, 200, 250, 300, 350];
                lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

                lg_y2s = [65, 75, 95, 100, 115, 125, 135, 200];
                lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
            }
        }
        
        let skip = int(random(1, 5));
        if (is_Black_1 == false && skip == 1) {
            skip_rapunzel = true;
        }
        else {
            skip_rapunzel = false;
        }
        
        
        // >>> OPACITIES
        if (is_bg_black == true && dots_1 != 1) {
            s_opa = int(random(13, 18)); 
        }
        else if (is_bg_black == true && dots_1 == 1) {
            s_opa = int(random(15, 26)); 
        }
        else if (is_bg_black == true && dots_1 != 1 && is_Black_1 == false) {
            s_opa = int(random(3, 11)); 
        }
        else if (is_bg_black == true && dots_1 == 1 && is_Black_1 == false) {
            s_opa = int(random(7, 16)); 
        }
        else if (is_bg_black == true && dots_1 != 1 && is_Black_1 == true) {
            s_opa = int(random(15, 26)); 
        }
        else if (is_bg_black == true && dots_1 == 1 && is_Black_1 == true) {
            s_opa = int(random(23, 33)); 
        }
        else if (is_bg_white == true) {
            s_opa = int(random(13, 17));    
        }
        else {
            s_opa = int(random(13, 19));
        }
        
        
        // >>> BLEND MODE: 1 NORMAL, 2 SCREEN, 3 LIGHTEST| used in long hair fx
        blend_type_1 = 2;
        blend_type_2 = 2;
        
        
        // >>> BRUSH STROKE ROTATION
        movs = [3, 3, 5, 5, 5, 6, 6, 6, 6, 6];
        brush_mov = movs[int(random(0, movs.length))];
        
        
        // >>> BRUSH STROKE THICKNESS 
        accent_type = int(random(1, 6));
        // medium
        if (accent_type == 1 || accent_type == 4) {
            accent_x = int(random(5, 10)); 
            accent_y = int(random(5, 10)); 
            accent_type_string = 'medium'
        }
        // thick
        else if (accent_type == 2){
            accent_x = int(random(7, 14));
            accent_y = int(random(7, 14)); 
            accent_type_string = 'thick'
        }
        // thin
        else {
            accent_x = int(random(0, 5));
            accent_y = int(random(0, 5)); 
            accent_type_string = 'thin'
        }
        
        // FOR SHAPES
        c_max = int(random(4, 8)); // used in shape 1: circles
        o_x_min = int(random(2, 5)); // used in shape 2: ovals
        o_x_max = int(random(5, 10)); // used in shape 2: ovals
        o_y_min = int(random(2, 6)); // used in shape 2: ovals
        o_y_max = int(random(5, 11)); // used in shape 2: ovals
        r_x_max = int(random(3, 8)); // used in shape 3: rects
        r_y_max = int(random(3, 15)); // used in shape 3: rects
        t_y_1 = int(random(2, 10)); // used in shape 4: small tri
        t_y_2 = int(random(8, 16)); // used in shape 5: mixed tri
        t_x_1 = int(random(2, 16)); // used in shape 6: big tri
        r_x_1 = int(random(8, 24)); // used in shape 7: long thin rects
        
        // 1: circles, 2: ovals, 3: rects, 4: tri small, 5: tri mixed, 6: tri big, 7: rects long
        if (is_bg_black == true) {
            let shapes = [1, 2, 3, 4, 4, 5, 5, 6, 7, 7];
            which_shape = shapes[int(random(0, shapes.length))]; 
        }
        else {
            let shapes = [1, 1, 3, 4, 5, 5, 5, 5, 7, 7];
            which_shape = shapes[int(random(0, shapes.length))]; 
        }
        

        // >>> DRAW LOOP DURATION
        which_stop = int(random(1, 6));
        // short
        if (which_stop == 1) {
            myStops = [900, 950, 1000];
            myStop_string = 'short';
        }
        // long
        else if (which_stop == 2) {
            myStops = [1150, 1200, 1250]; 
            myStop_string = 'long';
        }
        // medium
        else {
            myStops = [1000, 1025, 1050, 1075, 1100]; 
            myStop_string = 'medium';
        }
    }
    
    else if (loop_type == 2) {
        initial_boids = int(random(30, 38));
        boids_start = int(random(1, 5));
        
        let l2_types = [1, 1, 2, 1, 3, 2, 1, 1]; // 1 columns, 2 bands, 3 all
        l2_type = l2_types[int(random(1, l2_types.length))];
        
        // >>> FLOCKING CONTROLS
        if (l2_type == 1) {
            let l2_vs = [1, 1, 2, 4, 5, 1, 1, 1, 1];
            l2_v = l2_vs[int(random(1, l2_vs.length))];
            
            maxspeed = [21.25, 21.27, 21.28, 21.29, 21.3, 21.3, 21.3, 21.3, 21.3, 21.3, 21.33, 21.33, 21.35, 21.4, 21.45, 21.5];
            my_maxspeed = maxspeed[int(random(0, maxspeed.length))];

            maxforce = [1.1, 1.1, 1.105, 1.106, 1.106,  1.106,  1.106, 1.1063, 1.1063, 1.1065,  1.1065,  1.107, 1.107, 1.108, 1.108, 1.1085];
            my_maxforce = maxforce[int(random(0, maxforce.length))];

            sep_mult = [0.0055, 0.0055, 0.0057, 0.006, 0.0063, 0.0065, 0.0067, 0.007, 0.0073, 0.0075, 0.0075, 0.0075, 0.0075, 0.0075, 0.008, 0.0085, 0.0095, 0.01, 0.01, 0.01, 0.01, 0.01, 0.02, 0.02, 0.02, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.031, 0.032, 0.033, 0.034, 0.035, 0.035, 0.035, 0.036, 0.037, 0.038, 0.039, 0.04, 0.041, 0.042, 0.043, 0.044, 0.045, 0.047, 0.05, 0.05, 0.05, 0.055, 0.055, 0.06, 0.06, 0.06, 0.06, 0.065, 0.07, 0.075, 0.08, 0.085, 0.09];
            my_sep_mult = sep_mult[int(random(0, sep_mult.length))]; 

            ali_mult = [0.73, 0.74, 0.75, 0.75, 0.76, 0.765, 0.77, 0.77, 0.77, 0.775, 0.775, 0.78, 0.78, 0.78, 0.78, 0.78, 0.785, 0.79, 0.795, 0.8];
            my_ali_mult = ali_mult[int(random(0, ali_mult.length))];

            coh_mult = [1.07, 1.08, 1.09, 1.1, 1.1, 1.103, 1.104, 1.105, 1.105, 1.106, 1.106, 1.106, 1.106, 1.1063, 1.1063, 1.1065, 1.1065, 1.1065, 1.1065, 1.1067, 1.1068, 1.1069, 1.107, 1.107, 1.1073, 1.1075, 1.1077, 1.108, 1.1083, 1.1085, 1.1087, 1.109];
            my_coh_mult = coh_mult[int(random(0, coh_mult.length))];

            my_desiredseparation = -100; 

            neigh_1 = [150, 150, 175, 175, 175, 195, 200, 200, 200, 205, 205, 210, 215, 215, 220, 220, 225, 225, 225, 225, 225, 225, 225, 225, 225, 235, 250, 265, 275, 285, 300, 300, 305, 310, 315, 325, 350, 375, 400, 450, 500, 550, 10000, 10000];
            my_neighbordist_1 = neigh_1[int(random(0, neigh_1.length))]; 

            neigh_2 = [500, 515, 525, 550, 550, 550, 550, 550, 575, 600, 600, 600, 600, 600, 600, 650, 700, 750, 800, 800, 800, 800, 2300, 2300, 2300, 2300, 2300, 2305, 2305, 2305, 2305, 2310, 2315, 2320, 2325, 2350, 2400];
            my_neighbordist_2 = neigh_2[int(random(0, neigh_2.length))];

            acce_x1s = [-100, -75, -50, -45, -40, -40, -25, -15, -10, -10, -5, -1, 0, 1, 5, 10, 15, 25, 40, 40, 45, 50, 75, 100];
            my_acceleration_x1 = acce_x1s[int(random(0, acce_x1s.length))];

            acce_y1s = [-100, -75, -50, -45, -40, -40, -25, -15, -10, -10, -5, -1, 0, 1, 5, 10, 15, 25, 40, 40, 45, 50, 75, 100];
            my_acceleration_y1 = acce_y1s[int(random(0, acce_y1s.length))];

            vel_xs = [-10, -5, -3, -1, -0.5, 0.5, 1, 5, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 13, 13, 13, 15, 25, 75, 100, 100, 100, 100];
            my_vel_x = vel_xs[int(random(0, vel_xs.length))];

            loc_mult = [-0.009, -0.007, -0.007, -0.007, -0.007, -0.007, -0.006, -0.006, -0.0055, -0.005, -0.004, -0.003, -0.003, -0.003, -0.003, -0.003, -0.002, -0.001, -0.001, -0.001, 0, 0, 0, 0, 0];
            my_loc_mult = loc_mult[int(random(0, loc_mult.length))];

            steers = [-0.8, -0.7, -0.6, -0.5, -0.5, -0.5, -0.4, -0.35, -0.3, -0.3, -0.25, -0.2, -0.2, -0.1, -0.1, -0.1, 0, 0, 0, 0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 0.25, 0.3, 0.4, 0.5]; 
            my_steer = steers[int(random(0, steers.length))];

            ang = 0; 

            speeds = [0.1, 0.13, 0.15, 0.2, 0.25, 0.27, 0.275, 0.277, 0.29, 0.295, 0.299, 0.2999, 0.3, 0.3, 0.3, 0.3, 0.3001, 0.301, 0.301, 0.301, 0.301, 0.301, 0.301, 0.305, 0.31, 0.31, 0.31, 0.31, 0.31, 0.315, 0.315, 0.317, 0.32, 0.32, 0.32, 0.33, 0.33, 0.33, 0.33, 0.34, 0.34, 0.35, 0.35, 0.35, 0.37, 0.4];
            speed = speeds[int(random(0, speeds.length))];

            rads = [1, 5, 15, 25, 50, 75, 100, 115, 125, 150, 155, 175, 200, 225, 225, 250, 250, 255, 275, 275, 285, 295, 300, 300, 300, 300, 300, 300, 300, 300, 301, 302, 303, 304, 305, 305, 305, 305, 305, 305, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 330, 335, 340, 345, 350, 355, 360, 365, 370];
            radius = rads[int(random(0, rads.length))];

            rad_incs = [0.25, 0.27, 0.3, 0.33, 0.35, 0.37, 0.39, 0.4, 0.41, 0.43, 0.43, 0.43, 0.43, 0.43, 0.43, 0.43, 0.43, 0.43, 0.43, 0.43, 0.43, 0.435, 0.435, 0.435, 0.44, 0.45, 0.47, 0.49, 0.5, 0.53, 0.55, 0.57, 0.59, 0.6];
            rad_inc = rad_incs[int(random(0, rad_incs.length))]; 
        }
        else if (l2_type == 2) {
            let l2_vs = [1, 2, 2, 3, 4, 4, 5];
            l2_v = l2_vs[int(random(1, l2_vs.length))];
            
            maxspeed = [21, 21.3, 21.3, 21.4, 21.45, 21.5, 21.7, 21.7, 21.7, 21.75, 21.75, 21.75, 21.75, 21.75, 21.75, 22, 22, 22, 22, 22, 22.15, 22.25, 22.3, 22.5];
            my_maxspeed = maxspeed[int(random(0, maxspeed.length))];

            maxforce = [1, 1, 1.05, 1.055, 1.06, 1.06, 1.06, 1.07, 1.07, 1.07, 1.07, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.11, 1.112, 1.112, 1.112, 1.12, 1.13, 1.15, 1.15, 1.15, 1.15, 1.15, 1.2, 1.2, 1.25, 1.28, 1.29, 1.29, 1.3, 1.3, 1.3, 1.35, 1.4, 1.4, 1.4, 1.6, 1.7];
            my_maxforce = maxforce[int(random(0, maxforce.length))];

            sep_mult = [0.0055, 0.0065, 0.0075, 0.0075, 0.0075, 0.0085, 0.0095, 0.01, 0.01, 0.01, 0.02, 0.02, 0.03, 0.03, 0.03, 0.03, 0.035, 0.035, 0.04, 0.045, 0.05, 0.05, 0.055, 0.06, 0.06, 0.06, 0.07, 0.075, 0.075, 0.08, 0.08, 0.08, 0.08, 0.09, 0.09, 0.095, 0.1, 0.1, 0.105];
            my_sep_mult = sep_mult[int(random(0, sep_mult.length))]; 

            ali_mult = [0.65, 0.66, 0.67, 0.68, 0.68, 0.68, 0.68, 0.68, 0.685, 0.69, 0.695, 0.7, 0.71, 0.73, 0.75, 0.75, 0.77, 0.78, 0.79];
            my_ali_mult = ali_mult[int(random(0, ali_mult.length))];

            coh_mult = [1.15, 1.16, 1.165, 1.17, 1.17, 1.17, 1.175, 1.175, 1.175, 1.18, 1.2];
            my_coh_mult = coh_mult[int(random(0, coh_mult.length))];

            my_desiredseparation = -100; 

            neigh_1 = [100, 115, 125, 150, 150, 150, 175, 175, 174, 195, 200, 200, 200, 200, 205, 205, 215, 225, 250, 300, 350];
            my_neighbordist_1 = neigh_1[int(random(0, neigh_1.length))]; 

            neigh_2 = [500, 550, 550, 600, 600, 600, 600, 600, 600, 650, 700, 750, 800, 800, 800, 800, 800, 800, 800, 1000, 1500, 2000, 2250, 2300, 2300, 2300, 2305, 2400, 2450, 2500, 2500];
            my_neighbordist_2 = neigh_2[int(random(0, neigh_2.length))];

            my_acceleration_x1 = int(random(-5, 6)) * 10;
            my_acceleration_y1 = int(random(-5, 6)) * 10;

            vel_xs = [-100, -10, -5, -5, -1, -0.5, 0.5, 1, 1, 5, 10, 10, 10, 10, 10, 10, 10, 50, 75, 100, 100, 100, 105, 105, 500, 500];
            my_vel_x = vel_xs[int(random(0, vel_xs.length))];

            loc_mult = [-0.93, -0.92, -0.9, -0.85, -0.8, -0.7, -0.5, -0.35, -0.3, -0.1, -0.1, -0.1, -0.1, -0.1, -0.09, -0.08, -0.05, -0.03, -0.02, -0.01, -0.008, -0.007, -0.005, -0.005, -0.005, -0.003, -0.001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.01, 0.05];
            my_loc_mult = loc_mult[int(random(0, loc_mult.length))];

            steers = [-0.5, -0.5, -0.3, -0.1, -0.07, -0.05, -0.03, -0.01, 0, 0, 0, 0, 0, 0.1, 0.1, 0.1, 0.1, 0.3, 0.5]; 
            my_steer = steers[int(random(0, steers.length))];

            ang = 0; 

            speeds = [0.1, 0.1, 0.1, 0.15, 0.2, 0.25, 0.27, 0.27, 0.27, 0.299, 0.2999, 0.3, 0.3, 0.3, 0.3, 0.301, 0.301, 0.301, 0.301, 0.301, 0.305, 0.31, 0.31, 0.31, 0.31, 0.32, 0.33, 0.33, 0.34, 0.35];
            speed = speeds[int(random(0, speeds.length))];

            rads = [1, 1, 1, 5, 5, 5, 5, 5, 10, 10, 15, 15, 20, 20, 25, 25, 35, 50, 75, 75, 85, 100, 100, 115, 125, 125, 125, 125, 155, 175, 200, 225, 225, 250, 250, 275, 300, 300, 305];
            radius = rads[int(random(0, rads.length))];

            rad_incs = [0.25, 0.25, 0.25, 0.25, 0.25, 0.3, 0.33, 0.35, 0.35, 0.35, 0.37, 0.4, 0.41, 0.43, 0.43, 0.43, 0.43, 0.44, 0.45];
            rad_inc = rad_incs[int(random(0, rad_incs.length))]; 
        }
        else{
            let l2_vs = [1, 1, 2, 2, 3, 4, 5];
            l2_v = l2_vs[int(random(1, l2_vs.length))];
            
            maxspeed = [21, 21.3, 21.3, 21.3, 21.3, 21.35, 21.4, 21.45, 21.5, 21.7, 21.7, 21.7, 21.75, 21.75, 21.75, 21.75, 21.75, 21.75, 22, 22, 22, 22, 22, 22.15, 22.25, 22.3, 22.3, 22.5, 22.5, 22.5, 22.5];
            my_maxspeed = maxspeed[int(random(0, maxspeed.length))];

            maxforce = [1, 1.05, 1.055, 1.055, 1.06, 1.06, 1.06, 1.06, 1.06, 1.07, 1.07, 1.07, 1.07, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.11, 1.112, 1.112, 1.112, 1.12, 1.13, 1.15, 1.15, 1.15, 1.15, 1.15, 1.2, 1.2, 1.25, 1.28, 1.29, 1.29, 1.3, 1.3, 1.3, 1.35, 1.4, 1.4, 1.4, 1.45, 1.5, 1.6, 1.7];
            my_maxforce = maxforce[int(random(0, maxforce.length))];

            sep_mult = [0.0055, 0.0075, 0.0075, 0.0075, 0.0075, 0.0085, 0.0095, 0.01, 0.01, 0.01, 0.01, 0.01, 0.02, 0.02, 0.02, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.035, 0.035, 0.035, 0.04, 0.045, 0.05, 0.05, 0.05, 0.055, 0.055, 0.06, 0.06, 0.06, 0.06, 0.0603, 0.0605, 0.06053, 0.06055, random(0.06, 0.07), 0.07, 0.075, 0.075, 0.08, 0.08, 0.08, 0.08, 0.09, 0.09, 0.1, 0.1, 0.1];
            my_sep_mult = sep_mult[int(random(0, sep_mult.length))]; 

            ali_mult = [0.65, 0.66, 0.66, 0.67, 0.68, 0.68, 0.68, 0.68, 0.68, 0.69, 0.7, 0.7, 0.7, 0.71, 0.71, 0.72, 0.73, 0.75, 0.75, 0.75, 0.77, 0.77, 0.77, 0.77, 0.78, 0.78, 0.78, 0.79, 0.79, 0.79, 0.79, 0.79, 0.79, 0.795, 0.8, 0.8, 0.8, 0.81, 0.83];
            my_ali_mult = ali_mult[int(random(0, ali_mult.length))];

            coh_mult = [1.105, 1.107, 1.109, 1.109, 1.109, 1.109, 1.109, 1.109, 1.109, 1.1095, 1.1095, 1.1095, 1.1, 1.11, 1.11, 1.11, 1.11, 1.11, 1.11, 1.11, 1.11, 1.12, 1.12, 1.13, 1.14, 1.15, 1.15, 1.155, 1.16, 1.165, 1.17, 1.17, 1.175, 1.175, 1.175, 1.18, 1.19, 1.2, 1.2, 1.2];
            my_coh_mult = coh_mult[int(random(0, coh_mult.length))];

            my_desiredseparation = -100; 

            neigh_1 = [150, 150, 150, 175, 175, 174, 195, 200, 200, 200, 200, 205, 205, 215, 225, 225, 225, 225, 250, 300, 305, 305, 310, 325, 350, 400, 425, 450, 500, 550, 600, 600, 600, 600, 600, 10000, 100000];
            my_neighbordist_1 = neigh_1[int(random(0, neigh_1.length))]; 

            neigh_2 = [550, 550, 600, 600, 600, 600, 600, 600, 650, 700, 750, 800, 800, 800, 800, 800, 800, 800, 900, 1000, 1500, 2000, 2250, 2300, 2300, 2300, 2305, 2400, 2450, 2500, 2500];
            my_neighbordist_2 = neigh_2[int(random(0, neigh_2.length))];

            my_acceleration_x1 = int(random(-5, 6)) * 10;
            my_acceleration_y1 = int(random(-5, 6)) * 10;

            vel_xs = [-5, -1, -0.5, 0.5, 1, 5, 10, 10, 10, 10, 10, 10, 10, 10, 10, 100, 100, 100, 100];
            my_vel_x = vel_xs[int(random(0, vel_xs.length))];

            loc_mult = [-0.93, -0.93, -0.92, -0.91, -0.9, -0.8, -0.7, -0.6, -0.5, -0.4, -0.35, -0.35, -0.35, -0.3, -0.3, -0.3, -0.3, -0.3, -0.2, -0.15, -0.11, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.08, -0.05, -0.03, -0.01, -0.007, -0.005, -0.005, -0.005, 0, 0, 0, 0, 0, 0, 0];
            my_loc_mult = loc_mult[int(random(0, loc_mult.length))];

            steers = [-0.5, -0.5, -0.3, -0.1, 0, 0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3, 0.5]; 
            my_steer = steers[int(random(0, steers.length))];

            ang = 0; 

            speeds = [0.1, 0.1, 0.1, 0.1, 0.15, 0.2, 0.25, 0.27, 0.27, 0.27, 0.299, 0.2999, 0.3, 0.3, 0.3, 0.3, 0.3001, 0.301, 0.301, 0.301, 0.301, 0.301, 0.305, 0.31, 0.31, 0.31, 0.31, 0.32, 0.33, 0.33, 0.34, 0.35];
            speed = speeds[int(random(0, speeds.length))];

            rads = [1, 1, 1, 10, 5, 15, 20, 25, 35, 50, 100, 125, 125, 125, 125, 125, 155, 165, 175, 200, 225, 225, 225, 225, 250, 250, 250, 255, 265, 275, 285, 300, 305, 305, 305, 305, 310, 315, 320, 325 ,335, 345, 345, 345, 345, 350];
            radius = rads[int(random(0, rads.length))];

            rad_incs = [0.25, 0.25, 0.25, 0.25, 0.25, 0.3, 0.33, 0.35, 0.35, 0.35, 0.37, 0.4, 0.41, 0.43, 0.43, 0.43, 0.43, 0.44, 0.45];
            rad_inc = rad_incs[int(random(0, rad_incs.length))]; 
        }

        
        // >>> LONG HAIR FX
        // ON/OFF: 1 ON, else OFF
        if (is_bg_black == true && is_Black_1 == true) {
            rapunzel = 1;
        }
        else if (is_bg_black == true && is_Black_1 == false) {
            rapunzels = [1, 1, 1, 2, 2];
            rapunzel = rapunzels[int(random(0, rapunzels.length))];   
        }
        else if (is_bg_white == true) {
            rapunzel = 0;  
        }
        else {
            rapunzels = [1, 2, 1, 2];
            rapunzel = rapunzels[int(random(0, rapunzels.length))];   
        }
        
        // TYPES: 1 lines, 2 arcs
        if (is_Black_1 == true) {
            lg_hair_types = [1, 2, 2, 2, 2];
        }
        else {
            lg_hair_types = [1, 2, 2, 1, 2];
        }
        lg_hair_1_type = lg_hair_types[int(random(0, lg_hair_types.length))];
        lg_hair_2_type = lg_hair_1_type;
        
        if (is_Black_1 == true && lg_hair_1_type != 1) {
            dots_1 = 1; // 1 ON, else OFF
            dots_2 = int(random(0, 2)); // 1 ON, else OFF
        }
        else {
            dots_1 = int(random(0, 2)); // 1 ON, else OFF
            dots_2 = int(random(0, 2)); // 1 ON, else OFF
        }

        arc_1_types = [1, 1, 2, 3, 1];
        arc_1_type = arc_1_types[int(random(0, arc_1_types.length))];
        arc_1_x = int(random(-3, 4));
        arc_1_y = int(random(-3, 4));
        arc_1_x2 = int(random(5, 16));
        arc_1_y2 = int(random(45, 71));
        
        arc_2_types = [1, 2, 3, 3, 1];
        arc_2_type = arc_2_types[int(random(0, arc_2_types.length))];
        arc_2_x = int(random(-2, 3)) * 10;
        arc_2_y = int(random(-3, 4)) * 100;

        // LINES
        if (rapunzel == 1 && lg_hair_1_type == 1 || rapunzel == 1 && lg_hair_2_type == 1) {
            // LONG HAIR 1
            lg_hairs_1 = 1; // 1 ON, 2 OFF

            if (is_Black_1 == true) {
                lg_we1s = [0.3, 0.4, 0.45];
            }
            else if (is_Black_1 == false) {
                lg_we1s = [0.09, 0.095, 0.1];
            }
            else {
                lg_we1s = [0.06, 0.061, 0.065, 0.067];  
            }
            lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

            lg_x1s = [400, 450, 500, 600, 650, 700];
            lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

            lg_y1s = [250, 300, 350, 400, 450, 500, 550, 600, 650];
            lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
            
            // LONG HAIR 2
            if (is_Black_1 == true) {
                let h2_switch =  [1, 1, 0, 1, 0, 1];
                lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

                lg_we2s = [0.15, 0.2, 0.23, 0.25, 0.27, 0.3];
                lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

                lg_x2s = [100, 150, 200, 250, 300, 350, 375];
                lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

                lg_y2s = [75, 85, 95, 105, 115, 125, 175, 225, 250];
                lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
            }
        }
        // ARCS
        if (rapunzel == 1 && lg_hair_1_type == 2 || rapunzel == 1 && lg_hair_2_type == 2) {
        // LONG HAIR 1
            lg_hairs_1 = 1; // 1 ON, 2 OFF

            if (is_Black_1 == true) {
                lg_we1s = [0.3, 0.35, 0.4, 0.45];
            }
            else if (is_Black_1 == false) {
                lg_we1s = [0.06, 0.062, 0.064, 0.065, 0.066, 0.07, 0.075];
            }
            lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

            lg_x1s = [85, 95, 105, 115, 125, 150, 175, 200, 225, 250, 275, 300, 350, 400, 500, 600];
            lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

            lg_y1s = [75, 95, 100, 115, 125, 150, 175, 200, 250, 300];
            lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
            
            // LONG HAIR 2
            let h2_switch = [1, 1, 0, 1, 1, 1];
            lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF
 
            if (is_Black_1 == true) {
                lg_we2s = [0.15, 0.2, 0.25, 0.3, 0.35];
            }
            else if (is_Black_1 == false) {
                lg_we2s = [0.06, 0.062, 0.063, 0.064, 0.065, 0.066, 0.068, 0.07];
            }
            lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];
            
            lg_x2s = [85, 95, 105, 115, 125, 150, 175, 200, 225, 250, 275, 300, 350, 400];
            lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

            lg_y2s = [75, 95, 100, 115, 125, 150, 175, 200, 250, 300];
            lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
        }
        
        if (is_Black_1 == true) {
            skip_rapunzel = false;
        }
        else {
            let salto = int(random(0, 3));
            if (salto == 1) {
                skip_rapunzel = true;
            }
            else {
                skip_rapunzel = false;
            }
        }
        
        
        // >>> OPACITIES
        if (is_bg_black == true && is_Black_1 == false) {
            s_opa = int(random(10, 18));
        }
        else if (is_bg_black == true && is_Black_1 == true) {
            s_opa = int(random(19, 28));
        }
        else if (is_bg_white == true) {
            s_opa = int(random(13, 17));    
        }
        else {
            s_opa = int(random(13, 19));
        }
        
        
        // >>> BLEND MODE: 1 NORMAL, 2 SCREEN, 3 LIGHTEST| used in long hair fx
        blend_type_1 = 2;
        blend_type_2 = 2;
        
        
        // >>> BRUSH STROKE ROTATION
        if (lg_hair_1_type == 1) {
            movs = [3, 5, 5, 3, 6, 6];
        }
        else if (lg_hair_1_type == 2 && is_Black_1 == false) {
            movs = [2, 3, 3, 3, 3, 5, 5, 5, 6, 6];
        }
        else if (lg_hair_1_type == 2 && is_Black_1 == true) {
            movs = [2, 5, 3, 3, 3, 5, 5, 5, 5, 5];
        }
        brush_mov = movs[int(random(0, movs.length))];
        
        
        // >>> BRUSH STROKE THICKNESS 
        accent_type = int(random(1, 5));
        // medium
        if (accent_type == 1) {
            accent_x = int(random(0, 6)); 
            accent_y = int(random(3, 6)); 
            accent_type_string = 'medium'
        }
        // thin
        else {
            accent_x = int(random(0, 2));
            accent_y = int(random(0, 3)); 
            accent_type_string = 'thin'
        }
        
        // FOR SHAPES
        c_max = int(random(4, 8)); // used in shape 1: circles
        o_x_min = int(random(3, 7)); // used in shape 2: ovals
        o_x_max = int(random(7, 10)); // used in shape 2: ovals
        o_y_min = int(random(3, 7)); // used in shape 2: ovals
        o_y_max = int(random(7, 10)); // used in shape 2: ovals
        r_x_max = int(random(2, 6)); // used in shape 3: rects
        r_y_max = int(random(2, 15)); // used in shape 3: rects
        t_y_1 = int(random(2, 10)); // used in shape 4: small tri
        t_y_2 = int(random(10, 21)); // used in shape 5: mixed tri
        t_x_1 = int(random(3, 9)); // used in shape 6: big tri
        r_x_1 = int(random(15, 26)); // used in shape 7: long thin rects
        
        // 1: circles, 2: ovals, 3: rects, 4: tri small, 5: tri mixed, 6: tri big, 7: rects long
        let shapes = [1, 2, 3, 4, 5, 5, 6, 7, 7, 7];
        which_shape = shapes[int(random(0, shapes.length))];


        // >>> DRAW LOOP DURATION
        if (my_loc_mult == -0.97) {
            myStops = [1750, 1800, 1850, 1900, 1950]; 
            myStop_string = 'long';
        }
        else {
            myStops = [665, 685, 700, 750, 800, 1150, 1175, 1200, 1250, 1275, 1300, 1325, 1350, 1350, 1375, 1400, 1425, 1435, 1450]; 
            myStop_string = 'medium';
        }
    }
    
    else if (loop_type == 3) {
        initial_boids = int(random(30, 38));
        boids_start = int(random(1, 5));
        
        l3_v = int(random(1, 3));
        
        // >>> FLOCKING CONTROLS
        maxspeed = [20, 20.3, 20.5, 20.7, 22, 22.3, 22.5, 22.7, 23, 23.5, 24, 24.3, 24.5, 24.6, 25, 26]
        my_maxspeed = maxspeed[int(random(0, maxspeed.length))];
        
        maxforce = [0.95, 0.97, 0.99, 1, 1.03, 1.05, 1.07, 1.1, 1.12, 1.15, 1.16, 1.17, 1.18, 1.19, 1.2, 1.23, 1.25, 1.27, 1.28, 1.3, 1.35, 1.37, 1.4, random(1.3, 1.5), 1.45, 1.47, 1.5, 1.55, 1.57, 1.6, 1.62, 1.65, 1.67, 1.68, 1.69, 1.7, 1.75, 1.77, 1.78, 1.8, 1.85, 1.9, 1.95];
        my_maxforce = maxforce[int(random(0, maxforce.length))];
        
        sep_mult = [0.0035, 0.0040, 0.0055, 0.0075, 0.02, random(0.025, 0.05), 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.1];
        my_sep_mult = sep_mult[int(random(0, sep_mult.length))];
        
        ali_mult = [0.6, 0.61, 0.615, 0.62, 0.63, 0.635, 0.64, 0.65, 0.67, 0.68, 0.69, 0.7, 0.71, 0.72, 0.73, 0.75, 0.79, 0.8, random(0.8, 0.82)];
        my_ali_mult = ali_mult[int(random(0, ali_mult.length))];
        
        coh_mult = [1.11, 1.115, 1.12, 1.125, 1.13, 1.135, 1.14, 1.145, 1.15, 1.15, 1.155, random(1.155, 1.2), 1.17, 1.2, 1.3, 1.45, 1.45, 1.47, 1.48, 1.49, 1.5, random(1.55, 1.65), 1.7, 1.73];
        my_coh_mult = coh_mult[int(random(0, coh_mult.length))];
        
        separations = [-100, -90, -75, -50, -35, -10, -1, 0];
        my_desiredseparation = separations[int(random(0, separations.length))];
        
        neigh_1 = [100, 150, 200, 250, 300, 375, 400, 425, 500, 535, 585, 600, 645, 700, 777, 800, 888, 900, 965, 10000];
        my_neighbordist_1 = neigh_1[int(random(0, neigh_1.length))];
        
        neigh_2 = [500, 555, 600, 666, 700, 725, 750, 800, 828, 900, 909, 950, 1000, 1777, 2000, 2500, 10000, 100000];
        my_neighbordist_2 = neigh_2[int(random(0, neigh_2.length))];
        
        my_acceleration_x1 = int(random(-5, 6)) * 10;
        my_acceleration_y1 = int(random(-5, 6)) * 10;

        vel_xs = [-500, -300, -100, -1, 1, 100, 300, 500, 1000];
        my_vel_x = vel_xs[int(random(0, vel_xs.length))];
        
        loc_mult = [-0.91, -0.9, -0.89, -0.85, -0.8, -0.7, -0.55, -0.53, -0.5, -0.45, -0.4, -0.3, -0.2, -0.1, -0.08, -0.07, -0.05, -0.008, -0.005, -0.003, -0.001, 0];
        my_loc_mult = loc_mult[int(random(0, loc_mult.length))];
        
        steers = [-1, -0.5, 0, 0.5, 1, 5, 10];
        my_steer = steers[int(random(0, steers.length))];
        
        ang = 0; 

        speeds = [0.015, 0.02, 0.025, 0.03, 0.031, 0.032, 0.033, 0.035, 0.035, 0.036, 0.037, random(0.03, 0.06), 0.04, 0.043, 0.045, 0.048, 0.05, 0.053, 0.055, 0.057, 0.06, 0.063, 0.065, 0.07, 0.075, 0.08, 0.085, 0.09, 0.095, 0.1, 0.105, 0.11, 0.12, 0.125, 0.127, 0.13, 0.135, 0.14, 0.145, 0.15];
        speed = speeds[int(random(0, speeds.length))];
        
        rads = [5, 10, 15, 25, 35, 50, 50, 55, 60, 65, 75, 80, 85, 95, 100, 100, 115, 125, 135, 140, 145, 150, 150, 155, 160, 170, 175, 18];
        radius = rads[int(random(0,rads.length))];
        
        rad_incs = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.33, 0.35, 0.4, 0.45, 0.5];
        rad_inc = rad_incs[int(random(0, rad_incs.length))];
        
        
        // >>> LONG HAIR FX
        // ON/OFF: 1 ON, else OFF
        if (is_bg_black == true && is_Black_1 == true) {
            rapunzel = 1;
        }
        else if (is_bg_black == true && is_Black_1 == false) {
            rapunzels = [1, 1, 1, 2, 2];
            rapunzel = rapunzels[int(random(0, rapunzels.length))];   
        }
        else if (is_bg_white == true) {
            rapunzel = 0;  
        }
        else {
            rapunzels = [1, 1, 2, 2, 2];
            rapunzel = rapunzels[int(random(0, rapunzels.length))];   
        }
        
        // TYPES: 1 lines, 2 arcs
        if (is_Black_1 == true) {
            lg_hair_types = [1, 2, 2, 2, 2];
        }
        else {
            lg_hair_types = [1, 2, 2, 1];
        }
        lg_hair_1_type = lg_hair_types[int(random(0, lg_hair_types.length))];
        lg_hair_2_type = lg_hair_1_type;
        
        if (is_Black_1 == true && lg_hair_1_type != 1) {
            dots_1 = 1; // 1 ON, else OFF
            dots_2 = int(random(0, 2)); // 1 ON, else OFF
        }
        else {
            dots_1 = int(random(0, 2)); // 1 ON, else OFF
            dots_2 = int(random(0, 2)); // 1 ON, else OFF
        }
        
        arc_1_types = [1, 1, 2, 3, 1];
        arc_1_type = arc_1_types[int(random(0, arc_1_types.length))];
        arc_1_x = int(random(-3, 4));
        arc_1_y = int(random(-3, 4));
        arc_1_x2 = int(random(5, 16));
        arc_1_y2 = int(random(45, 71));
        
        arc_2_types = [1, 2, 3, 3, 1];
        arc_2_type = arc_2_types[int(random(0, arc_2_types.length))];
        arc_2_x = int(random(-2, 3)) * 10;
        arc_2_y = int(random(-3, 4)) * 100;

        // LINES
        if (rapunzel == 1 && lg_hair_1_type == 1 || rapunzel == 1 && lg_hair_2_type == 1) {
            // LONG HAIR 1
            lg_hairs_1 = 1; // 1 ON, 2 OFF

            if (is_Black_1 == true) {
                lg_we1s = [0.3, 0.4, 0.45];
            }
            else if (is_Black_1 == false) {
                lg_we1s = [0.09, 0.095, 0.1];
            }
            else {
                lg_we1s = [0.06, 0.061, 0.065, 0.067];  
            }
            lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

            lg_x1s = [400, 450, 500, 600, 650, 700];
            lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

            lg_y1s = [250, 300, 350, 400, 450, 500, 550, 600, 650];
            lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
            
            // LONG HAIR 2
            if (is_Black_1 == true) {
                let h2_switch =  [1, 1, 0, 1, 0, 1];
                lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

                lg_we2s = [0.15, 0.2, 0.23, 0.25, 0.27, 0.3];
                lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

                lg_x2s = [100, 150, 200, 250, 300, 350, 375];
                lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

                lg_y2s = [75, 85, 95, 105, 115, 125, 175, 225, 250];
                lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
            }
        }
        // ARCS
        if (rapunzel == 1 && lg_hair_1_type == 2 || rapunzel == 1 && lg_hair_2_type == 2) {
        // LONG HAIR 1
            lg_hairs_1 = 1; // 1 ON, 2 OFF

            if (is_Black_1 == true) {
                lg_we1s = [0.3, 0.35, 0.4, 0.45];
            }
            else if (is_Black_1 == false) {
                lg_we1s = [0.06, 0.062, 0.064, 0.065, 0.066, 0.07, 0.075];
            }
            lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

            lg_x1s = [85, 95, 105, 115, 125, 150, 175, 200, 225, 250, 275, 300, 350, 400, 500, 600];
            lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

            lg_y1s = [75, 95, 100, 115, 125, 150, 175, 200, 250, 300];
            lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
            
            // LONG HAIR 2
            let h2_switch = [1, 1, 0, 1, 1, 1];
            lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF
 
            if (is_Black_1 == true) {
                lg_we2s = [0.15, 0.2, 0.25, 0.3, 0.35];
            }
            else if (is_Black_1 == false) {
                lg_we2s = [0.06, 0.062, 0.063, 0.064, 0.065, 0.066, 0.068, 0.07];
            }
            lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];
            
            lg_x2s = [85, 95, 105, 115, 125, 150, 175, 200, 225, 250, 275, 300, 350, 400];
            lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

            lg_y2s = [75, 95, 100, 115, 125, 150, 175, 200, 250, 300];
            lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
        }
        
        if (is_Black_1 == true) {
            skip_rapunzel = false;
        }
        else {
            let salto = int(random(0, 3));
            if (salto == 1) {
                skip_rapunzel = true;
            }
            else {
                skip_rapunzel = false;
            }
        }
        
        
        // >>> OPACITIES
        if (is_bg_black == true && is_Black_1 == false) {
            s_opa = int(random(13, 24));
        }
        else if (is_bg_black == true && is_Black_1 == true) {
            s_opa = int(random(19, 28));
        }
        else if (is_bg_white == true) {
            s_opa = int(random(13, 17));    
        }
        else {
            s_opa = int(random(13, 19));
        }
        
        
        // >>> BLEND MODE: 1 NORMAL, 2 SCREEN, 3 LIGHTEST| used in long hair fx
        blend_type_1 = 2;
        blend_type_2 = 2;
        
        
        // >>> BRUSH STROKE ROTATION
        if (lg_hair_1_type == 1) {
            movs = [1, 2, 2, 3, 3, 4, 5, 5, 5, 6];
        }
        else if (lg_hair_1_type == 2 && is_Black_1 == false) {
            movs = [3, 3, 5, 5, 5, 5, 6, 6, 6, 6];
        }
        else if (lg_hair_1_type == 2 && is_Black_1 == true) {
            movs = [6, 5, 5, 5, 5, 5, 6, 6, 6, 6];
        }
        brush_mov = movs[int(random(0, movs.length))];
        
        
        // >>> BRUSH STROKE THICKNESS 
        accent_type = int(random(1, 8));
        // medium
        if (accent_type == 1) {
            accent_x = int(random(0, 3)); 
            accent_y = int(random(3, 9)); 
            accent_type_string = 'medium';
        }
        // thick
        else if (accent_type == 2) {
            accent_x = int(random(5, 12));
            accent_y = int(random(5, 10)); 
            accent_type_string = 'thick';
        }
        // thin
        else {
            accent_x = int(random(0, 2));
            accent_y = int(random(0, 3)); 
            accent_type_string = 'thin';
        }
        
        // FOR SHAPES
        c_max = int(random(4, 8)); // used in shape 1: circles
        o_x_min = int(random(2, 6)); // used in shape 2: ovals
        o_x_max = int(random(7, 8)); // used in shape 2: ovals
        o_y_min = int(random(2, 6)); // used in shape 2: ovals
        o_y_max = int(random(7, 11)); // used in shape 2: ovals
        r_x_max = int(random(2, 8)); // used in shape 3: rects
        r_y_max = int(random(4, 15)); // used in shape 3: rects
        t_y_1 = int(random(2, 10)); // used in shape 4: small tri
        t_y_2 = int(random(10, 21)); // used in shape 5: mixed tri
        t_x_1 = int(random(2, 7)); // used in shape 6: big tri
        r_x_1 = int(random(5, 16)); // used in shape 7: long thin rects
        
        // 1: circles, 2: ovals, 3: rects, 4: tri small, 5: tri mixed, 6: tri big, 7: rects long
        let shapes = [1, 1, 2, 3, 4, 4, 4, 5, 6, 7];
        which_shape = shapes[int(random(0, shapes.length))];
        

        // >>> DRAW LOOP DURATION
        if (my_loc_mult == -0.97) {
            myStops = [1750, 1800, 1900]; 
            myStop_string = 'long';
        }
        else {
            myStops = [665, 700, 1000, 1100, 1200, 1300, 1400]; 
            myStop_string = 'long';
        }
    }
    
    else if (loop_type == 4) {
        initial_boids = int(random(30, 38));
        boids_start = int(random(1, 5));
        
        // >>> FLOCKING CONTROLS
        maxspeed = [19, 19.5, 19.7, 20, 20.3, 20.5, 21, 21.5, 21.7, 22, 22.3, 22.5, 22.7, 23, 23.3, 23.5, 23.7, 24, 24.4, 24.5]
        my_maxspeed = maxspeed[int(random(0, maxspeed.length))];
        
        maxforce = [0.95, 0.98, 1, 1.05, 1.08, 1.12, random(1.125, 1.145), 1.13, 1.14, 1.15, 1.155, 1.16, 1.165, 1.17, 1.18, 1.185, 1.19, 1.195, 1.2, random(1.21, 1.24), 1.25, 1.28, 1.29, 1.3, 1.35, 1.4, 1.41, 1.42, 1.43, 1.44, 1.45, 1.47, 1.48, 1.49, 1.5, 1.55, 1.6, 1.65, 1.7];
        my_maxforce = maxforce[int(random(0, maxforce.length))];
        
        sep_mult = [0.0035, 0.0045, 0.0065, 0.0075, 0.02, random(0.025, 0.045), 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.095, 0.1];
        my_sep_mult = sep_mult[int(random(0, sep_mult.length))];
        
        ali_mult = [0.55, 0.57, 0.55, 0.58, 0.61, 0.615, 0.62, 0.63, 0.635, 0.64, 0.65, 0.67, random(0.675, 0.695), 0.7, 0.72, 0.78, 0.79, 0.8, 0.81, random(0.81, 0.84), 0.82, 0.85];
        my_ali_mult = ali_mult[int(random(0, ali_mult.length))];
        
        coh_mult = [1.11, 1.115, 1.12, 1.125, 1.13, 1.135, 1.14, 1.145, 1.15, 1.153, 1.155, 1.157, 1.16, 1.17, 1.18, 1.19, 1.2, random(1.25, 1.45), 1.23, 1.25, 1.27, 1.3, 1.35, 1.4, 1.45, 1.5, 1.53, 1.55, 1.57, 1.6];
        my_coh_mult = coh_mult[int(random(0, coh_mult.length))];
        
        separations = [-100, -90, -75, -50, -35, -10, -1, 0];
        my_desiredseparation = separations[int(random(0, separations.length))];
        
        neigh_1 = [100, 175, 200, 235, 300, 333, 400, 444, 500, 555, 700, 707, 800, 898, 900, 929, 10000];
        my_neighbordist_1 = neigh_1[int(random(0, neigh_1.length))];
        
        neigh_2 = [500, 555, 600, 645, 700, 725, 750, 775, 800, 848, 900, 919, 950, 975, 1000, 1150, 1333, 2000, 2333, 10000, 100000];
        my_neighbordist_2 = neigh_2[int(random(0, neigh_2.length))];
        
        my_acceleration_x1 = int(random(-5, 6)) * 10;
        my_acceleration_y1 = int(random(-5, 6)) * 10;

        vel_xs = [-500, -300, -100, -50, -1, 1, 50, 100, 300, 500, 1000];
        my_vel_x = vel_xs[int(random(0, vel_xs.length))];
        
        loc_mult = [-0.92, -0.91, -0.9, -0.88, -0.8, -0.7, -0.5, -0.4, -0.35, -0.33, -0.31, -0.3, -0.25, -0.2, -0.1, -0.08, -0.07, -0.05, -0.03, -0.01, -0.007, -0.005, -0.001];
        my_loc_mult = loc_mult[int(random(0, loc_mult.length))];
        
        steers = [-1, 0, 1, 10, 25, 50, 75, 100, 1000];
        my_steer = steers[int(random(0, steers.length))];
        
        ang = 0; 

        speeds = [0.015, 0.017, 0.025, 0.027, 0.028, 0.029, 0.03, random(0.03, 0.06), 0.033, 0.035, 0.037, 0.04, 0.043, 0.045, 0.047, 0.05, 0.053, 0.055, 0.057, 0.06, 0.063, 0.065, 0.067, 0.07, 0.075, 0.08, 0.085, 0.09, 0.095, 0.1, 0.13, 0.15, 0.2, 0.3];
        speed = speeds[int(random(0, speeds.length))];
        
        rads = [1, 5, 10, 15, 25, 75, 85, 95, 100, 115, 125, 150, 175, 195, 205, 215, 225, 250, 275, 285, 300, 303];
        radius = rads[int(random(0,rads.length))];
        
        rad_incs = [0.15, 0.2, 0.23, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.65, 0.7, 0.77, 0.8];
        rad_inc = rad_incs[int(random(0, rad_incs.length))];
        
        
        // >>> LONG HAIR FX
        // ON/OFF: 1 ON, else OFF
        if (is_bg_black == true && is_Black_1 == true) {
            rapunzel = 1;
        }
        else if (is_bg_black == true && is_Black_1 == false) {
            rapunzels = [1, 1, 1, 2, 2];
            rapunzel = rapunzels[int(random(0, rapunzels.length))];   
        }
        else if (is_bg_white == true) {
            rapunzel = 0;  
        }
        else {
            rapunzels = [1, 1, 2, 2, 2];
            rapunzel = rapunzels[int(random(0, rapunzels.length))];   
        }
        
        // TYPES: 1 lines, 2 arcs
        if (is_Black_1 == true) {
            lg_hair_types = [1, 2, 2, 2, 2];
        }
        else {
            lg_hair_types = [1, 1, 2, 2, 2];
        }
        lg_hair_1_type = lg_hair_types[int(random(0, lg_hair_types.length))];
        lg_hair_2_type = lg_hair_1_type;
        
        if (is_Black_1 == true && lg_hair_1_type != 1) {
            dots_1 = 1; // 1 ON, else OFF
            dots_2 = int(random(0, 2)); // 1 ON, else OFF
        }
        else {
            dots_1 = int(random(0, 2)); // 1 ON, else OFF
            dots_2 = int(random(0, 2)); // 1 ON, else OFF
        }
        
        arc_1_types = [1, 1, 2, 3, 1];
        arc_1_type = arc_1_types[int(random(0, arc_1_types.length))];
        arc_1_x = int(random(-3, 4));
        arc_1_y = int(random(-3, 4));
        arc_1_x2 = int(random(5, 16));
        arc_1_y2 = int(random(45, 71));
        
        arc_2_types = [1, 2, 3, 3, 1];
        arc_2_type = arc_2_types[int(random(0, arc_2_types.length))];
        arc_2_x = int(random(-2, 3)) * 10;
        arc_2_y = int(random(-3, 4)) * 100;

        // LINES
        if (rapunzel == 1 && lg_hair_1_type == 1 || rapunzel == 1 && lg_hair_2_type == 1) {
            // LONG HAIR 1
            lg_hairs_1 = 1; // 1 ON, 2 OFF

            if (is_Black_1 == true) {
                lg_we1s = [0.3, 0.4, 0.45];
            }
            else if (is_Black_1 == false) {
                lg_we1s = [0.09, 0.095, 0.1];
            }
            else {
                lg_we1s = [0.06, 0.061, 0.065, 0.067];  
            }
            lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

            lg_x1s = [400, 450, 500, 600, 650, 700];
            lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

            lg_y1s = [250, 300, 350, 400, 450, 500, 550, 600, 650];
            lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
            
            // LONG HAIR 2
            if (is_Black_1 == true) {
                let h2_switch =  [1, 1, 0, 1, 0, 1];
                lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

                lg_we2s = [0.15, 0.2, 0.23, 0.25, 0.27, 0.3];
                lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

                lg_x2s = [100, 150, 200, 250, 300, 350, 375];
                lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

                lg_y2s = [75, 85, 95, 105, 115, 125, 175, 225, 250];
                lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
            }
        }
        // ARCS
        if (rapunzel == 1 && lg_hair_1_type == 2 || rapunzel == 1 && lg_hair_2_type == 2) {
        // LONG HAIR 1
            lg_hairs_1 = 1; // 1 ON, 2 OFF

            if (is_Black_1 == true) {
                lg_we1s = [0.3, 0.35, 0.4, 0.45];
            }
            else if (is_Black_1 == false) {
                lg_we1s = [0.06, 0.062, 0.064, 0.065, 0.066, 0.07, 0.075];
            }
            lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

            lg_x1s = [85, 95, 105, 115, 125, 150, 175, 200, 225, 250, 275, 300, 350, 400, 500, 600];
            lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

            lg_y1s = [75, 95, 100, 115, 125, 150, 175, 200, 250, 300];
            lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
            
            // LONG HAIR 2
            let h2_switch = [1, 1, 0, 1, 1, 1];
            lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF
 
            if (is_Black_1 == true) {
                lg_we2s = [0.15, 0.2, 0.25, 0.3, 0.35];
            }
            else if (is_Black_1 == false) {
                lg_we2s = [0.06, 0.062, 0.063, 0.064, 0.065, 0.066, 0.068, 0.07];
            }
            lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];
            
            lg_x2s = [85, 95, 105, 115, 125, 150, 175, 200, 225, 250, 275, 300, 350, 400];
            lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

            lg_y2s = [75, 95, 100, 115, 125, 150, 175, 200, 250, 300];
            lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
        }

        if (is_Black_1 == true) {
            skip_rapunzel = false;
        }
        else {
            let salto = int(random(0, 3));
            if (salto == 1) {
                skip_rapunzel = true;
            }
            else {
                skip_rapunzel = false;
            }
        }
        
        
        // >>> OPACITIES
        if (is_bg_black == true && is_Black_1 == false) {
            s_opa = int(random(13, 24));
        }
        else if (is_bg_black == true && is_Black_1 == true) {
            s_opa = int(random(19, 28));
        }
        else if (is_bg_white == true) {
            s_opa = int(random(13, 17));    
        }
        else {
            s_opa = int(random(13, 19));
        }
        
        
        // >>> BLEND MODE: 1 NORMAL, 2 SCREEN, 3 LIGHTEST| used in long hair fx
        blend_type_1 = 2;
        blend_type_2 = 2;
        
        
        // >>> BRUSH STROKE ROTATION
        if (lg_hair_1_type == 1) {
            movs = [1, 2, 3, 3, 4, 5, 5, 6, 6, 6];
        }
        else if (lg_hair_1_type == 2 && is_Black_1 == false) {
            movs = [3, 3, 5, 5, 5, 5, 6, 6, 6, 6];
        }
        else if (lg_hair_1_type == 2 && is_Black_1 == true) {
            movs = [6, 5, 5, 5, 5, 5, 6, 6, 6, 6];
        }
        brush_mov = movs[int(random(0, movs.length))];
        
        
        // >>> BRUSH STROKE THICKNESS 
        accent_type = int(random(1, 6));
        // medium
        if (accent_type == 1) {
            accent_x = int(random(0, 3)); 
            accent_y = int(random(2, 6)); 
            accent_type_string = 'medium';
        }
        // thin
        else {
            accent_x = int(random(0, 4));
            accent_y = int(random(0, 4)); 
            accent_type_string = 'thin'
        }
        
        // FOR SHAPES
        c_max = int(random(4, 8)); // used in shape 1: circles
        o_x_min = int(random(2, 6)); // used in shape 2: ovals
        o_x_max = int(random(7, 8)); // used in shape 2: ovals
        o_y_min = int(random(2, 6)); // used in shape 2: ovals
        o_y_max = int(random(7, 10)); // used in shape 2: ovals
        r_x_max = int(random(2, 8)); // used in shape 3: rects
        r_y_max = int(random(4, 12)); // used in shape 3: rects
        t_y_1 = int(random(2, 10)); // used in shape 4: small tri
        t_y_2 = int(random(10, 21)); // used in shape 5: mixed tri
        t_x_1 = int(random(3, 7)); // used in shape 6: big tri
        r_x_1 = int(random(5, 16)); // used in shape 7: long thin rects
        
        // 1: circles, 2: ovals, 3: rects, 4: tri small, 5: tri mixed, 6: tri big, 7: rects long
        let shapes = [1, 2, 3, 4, 5, 5, 5, 6, 7, 7];
        which_shape = shapes[int(random(0, shapes.length))];
        

        // >>> DRAW LOOP DURATION
        if (radius > 500) {
            myStops = [1300, 1500, 1750, 1800, 1900]; 
            myStop_string = 'long';
        }
        else {
            myStops = [665, 700, 1000, 1100, 1200, 1250, 1300, 1400]; 
            myStop_string = 'medium';
        }
    }
    
    else if (loop_type == 5) {
        initial_boids = int(random(30, 38));
        boids_start = int(random(1, 5));
        l5_v = int(random(1, 3));
        
        let l5_types = [1, 1, 2, 2, 3, 1]; // 1 circles, 2 bands, 3 all
        l5_type = l5_types[int(random(0, l5_types.length))];
        
        // >>> FLOCKING CONTROLS
        maxspeed = [22.5, 22.6, 22.7, 22.8, 22.9, 23, 23.1, 23.2, 23.3, 23.5, random(23.6, 23.9), 24, 24, 24, 24.2, 24.3, 24.5, 24.7, random(24.8, 25.2), 25.5, 25.5, 25.7, 25.9, 26, 26.3, 26.5, 27, 27.3, 27, 27.5, 28];
        my_maxspeed = maxspeed[int(random(0, maxspeed.length))];
        
        my_desiredseparation = -100;
        
        neigh_1 = [150, 175, 185, 200, 205, 215, 225, 250, 275, 300, 315, 325, 350, 395, 400, 450, 475, 500, 525, 550, 600, 650, 675, 700, 750, 800, 850, 900, 950, 1000, 10000];
        my_neighbordist_1 = neigh_1[int(random(0, neigh_1.length))];
        
        neigh_2 = [500, 525, 550, 600, 635, 650, 675, 700, 745, 800, 815, 850, 875, 900, 925, 950, 975, 1000, 1500, 2000, 10000, 50000, 100000];
        my_neighbordist_2 = neigh_2[int(random(0, neigh_2.length))];
        
        acce_x1s = [-100, -75, -50, -45, -40, -40, -25, -15, -10, -10, -5, -1, 0, 1, 5, 10, 15, 25, 40, 40, 45, 50, 75, 100];
        my_acceleration_x1 = acce_x1s[int(random(0, acce_x1s.length))];
        
        acce_y1s = [-100, -75, -50, -45, -40, -40, -25, -15, -10, -10, -5, -1, 0, 1, 5, 10, 15, 25, 40, 40, 45, 50, 75, 100];
        my_acceleration_y1 = acce_y1s[int(random(0, acce_y1s.length))];

        vel_xs = [-10000, -1000, -500, -300, -300, -300, -250, -100, -75, -50, -25, -10, -5, -5, -1, -1, 1, 1, 5, 5, 10, 25, 50, 75, 100, 250, 300, 500, 1000, 10000];
        my_vel_x = vel_xs[int(random(0, vel_xs.length))];
        
        if (l5_type == 1) {
            maxforce = [0.85, 0.9, 0.95, 0.98, 1, 1.03, 1.05, 1.07, 1.08, 1.083, 1.085, 1.087, 1.09, 1.095, 1.1, 1.12, 1.13, 1.131, 1.133, 1.135, 1.137, 1.139, 1.14, 1.143, 1.144, 1.145, 1.147, 1.15, 1.153, 1.155, 1.157, 1.16, 1.165, 1.17, 1.173, 1.175, 1.177, 1.18, 1.183, 1.185, 1.187, 1.19, 1.195];
            
            sep_mult = [0.001, 0.002, 0.003, 0.004, 0.005, 0.006, 0.007, 0.008, 0.009, 0.0093, 0.0095, 0.0097, 0.01, random(0.015, 0.025), 0.02, 0.023, 0.025, 0.027, 0.03, 0.04, 0.05, 0.055, 0.06, 0.063, 0.065, 0.067, 0.07, 0.075, 0.08, 0.085, 0.09, 0.093, 0.0933, 0.0935, 0.0937, 0.095, 0.1, 0.101, 0.103];
            
            ali_mult = [0.55, 0.6, 0.603, 0.605, 0.607, 0.61, 0.62, 0.63, 0.64, 0.65, 0.66, 0.67, 0.68, 0.683, 0.685, 0.687, 0.69, 0.693, 0.695, 0.697, 0.7, 0.703, 0.705, 0.707, 0.71, 0.713, 0.715, 0.72, 0.73, 0.733, 0.735, 0.737, 0.74, 0.75];
            
            coh_mult = [1.13, 1.133, 1.135, random(1.145, 1.15), 1.145, 1.145, 1.15, random(1.15, 1.155), 1.155, 1.157, 1.16, 1.165, 1.17, 1.175, 1.18, 1.185, 1.19, 1.195, 1.2, 1.205, 1.21, 1.22, 1.23, 1.24, 1.25, 1.26, 1.27, 1.28, 1.3, 1.32, 1.32, 1.33, 1.35, 1.36, 1.37, 1.38, 1.39, 1.4];

            loc_mult = [0.5, 0.55, 0.6, 0.65, 0.69, random(0.7, 0.8), 0.7, 0.703, 0.705, 0.707, 0.71, 0.713, 0.715, 0.717, 0.711, 0.715, 0.716, 0.717, 0.718, 0.719, 0.72, 0.721, 0.722, 0.723, 0.725, 0.727, 0.721, 0.7215, 0.722, 0.723, 0.725, 0.727, 0.73, 0.731, 0.733, 0.735, 0.737, 0.739, 0.731, 0.732, 0.733, 0.735, 0.737, 0.737, 0.74, 0.743, 0.745, 0.747, 0.749, 0.741, 0.742, 0.7425, 0.743, 0.7431, 0.7432, 0.745, 0.7437, 0.75, 0.751, 0.755, 0.757, 0.751, 0.752, 0.7525, 0.7527, 0.753, 0.7531, 0.7532, 0.7533, 0.755, 0.757, 0.76, 0.761, 0.765, 0.77, 0.771, 0.772, 0.773, 0.775, 0.777, 0.78, 0.783, 0.785, 0.787, 0.79, 0.793, 0.795, 0.797];
            my_loc_mult = loc_mult[int(random(0, loc_mult.length))];
            
            speeds = [0.025, 0.026, 0.027, 0.028, 0.029, 0.03, 0.031, 0.032, 0.033, random(0.033, 0.037), 0.036, 0.037, 0.038, 0.039, random(0.039, 0.044), 0.05, 0.051, 0.055, 0.057, 0.06, 0.063, 0.065, 0.067, 0.07, 0.075, 0.08, 0.09, 0.1];
            
            rads = [200, 250, 275, 300, 350, 375, 400, 425, 450, 475, 500, 475, 500, int(random(500, 600)), 515, 525, 535, 550, 575, 585, 600, 605, 615, 625, 635, 645, 650, 660, 675, 685, 695, 700, 715, 725, 735, 750, 775, 800, 815, 825, 850, 875];
        }
        else if (l5_type == 2) {
            maxforce = [0.85, 0.9, 0.92, 0.93, 0.935, 0.937, 0.97, 0.98, 1, 1.03, 1.07, 1.08, 1.083, 1.085, 1.087, 1.09, 1.093, 1.095, 1.097, 1.1, 1.11, 1.12, 1.125, 1.13, 1.133, 1.135, 1.137, 1.138, 1.139, 1.14, 1.143, 1.145, 1.147, 1.15, 1.153, 1.155, 1.16, 1.165, 1.17, 1.175, 1.18, 1.185, 1.19, 1.195];
            
            sep_mult = [0.001, 0.0011, 0.0013, 0.0015, 0.0017, 0.002, 0.003, 0.004, 0.005, 0.006, 0.007, 0.008, 0.009, 0.01, 0.01, 0.01, 0.013, 0.015, 0.0155, 0.016, 0.0165, 0.017, random(0.015, 0.025), 0.02, 0.03, 0.04, 0.05, 0.055, 0.06, 0.061, 0.063, 0.065, 0.067, 0.069, 0.07, 0.075, 0.08, 0.085, 0.09, 0.093, 0.095, 0.1, 0.101, 0.103];
            
            ali_mult = [0.55, 0.57, 0.58, 0.59, 0.6, 0.61, 0.62, 0.63, 0.633, 0.635, 0.637, 0.639, random(0.625, 0.645), 0.64, 0.65, random(0.655, 0.665), 0.66, 0.67, 0.68, 0.69, 0.69, 0.69, 0.695, 0.7, 0.701, 0.703, 0.705, 0.707, 0.71, 0.71, 0.71, 0.71, 0.713, 0.715, 0.717, 0.72, 0.723, 0.725, 0.727, 0.73, 0.733, 0.735, 0.737, 0.739, 0.74, 0.743, 0.745, 0.747, 0.75];
            
            coh_mult = [1.15, random(1.15, 1.17), 1.16, 1.17, 1.18, 1.19, 1.195, 1.2, 1.205, 1.21, 1.25, 1.22, 1.225, 1.23, 1.233, 1.235, 1.237, 1.24, 1.245, 1.25, 1.255, 1.26, 1.265, 1.27, 1.275, 1.28, 1.285, 1.29, 1.295, 1.3, 1.305, 1.31, 1.315, 1.32, 1.33, 1.34, 1.345, 1.35, 1.36, 1.365, 1.37, 1.38, 1.385, 1.39, 1.395, 1.4, 1.43, 1.45, 1.47, 1.48, 1.5, 1.51, 1.52, 1.53, 1.54, 1.55, 1.56, 1.57, 1.58, 1.59, 1.6, 1.61, 1.62, 1.63, 1.64, 1.65, 1.66, 1.67, 1.68, 1.69, 1.7, 1.71, 1.72, 1.73, 1.74, 1.75, 1.76, 1.77, 1.78, 1.79, 1.8];
            
            loc_mult = [-0.94, -0.9, -0.88, -0.85, -0.83, -0.8, -0.75, -0.7, -0.65, -0.63, -0.6, -0.57, -0.55, -0.53, -0.5, -0.47, -0.45, -0.43, -0.4, -0.37, -0.35, -0.33, -0.3, -0.27, -0.25, -0.23, -0.2, -0.17, -0.15, -0.13, -0.1, -0.09, -0.08, -0.07, -0.06, -0.05, -0.04, -0.03, -0.02, -0.01, -0.007, -0.005, -0.003, 0, 0.1, 0.15, 0.153, 0.155, random(0.15, 0.5), 0.157, 0.159, 0.16, 0.163, 0.165, 0.167, 0.17, 0.173, 0.175, 0.177, 0.18, 0.181, 0.182, 0.183, 0.183, 0.185, 0.187, 0.19, 0.195, 0.2, 0.2, 0.2, 0.205, 0.21, 0.22, 0.23, 0.235, 0.24, 0.245, 0.25, 0.255, 0.26, 0.265, 0.27, 0.275, 0.28, 0.285, 0.29, 0.295, 0.3, 0.305, 0.31, 0.315, 0.32, 0.325, 0.33, 0.335, 0.34, 0.345, 0.35, 0.355, 0.36, 0.365, 0.37, 0.375, 0.38, 0.385, 0.39, 0.395, 0.4, 0.405, 0.407, 0.41, 0.42, 0.43, 0.44, 0.45];
            my_loc_mult = loc_mult[int(random(0, loc_mult.length))];
            
            speeds = [0.015, 0.017, 0.019, 0.02, 0.023, 0.025, 0.0255, 0.0257, 0.026, 0.027, 0.028, 0.03, 0.031, 0.032, 0.033, 0.035, 0.037, 0.04, 0.042, 0.045, 0.047, 0.05, random(0.055, 0.08), 0.055, 0.06, 0.063, 0.065, 0.067, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12];
            
            rads = [135, 150, 175, 180, 185, 200, 225, 250, 275, 300, 325, 350, 375, 400, int(random(400, 500)), 425, 435, 450, 465, 475, 485, 500, 515, 525, 535, 545, 550, 565, 575, 585, 600, 625, 650];
        }
        else {
            maxforce = [0.85, 0.86, 0.87, 0.88, 0.89, 0.9, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1, 1, 1, 1.01, 1.02, 1.03, 1.04, 1.05, 1.06, 1.07, 1.08, 1.09, 1.1, 1.11, 1.12, 1.125, 1.13, 1.13, 1.13, 1.135, 1.137, 1.139, 1.14, 1.143, 1.145, 1.147, 1.15, 1.153, 1.155, 1.157, 1.16, 1.165, 1.17, 1.173, 1.175, 1.177, 1.18, 1.183, 1.185, 1.187, 1.19, 1.195];
            
            sep_mult = [0.001, 0.002, 0.003, 0.004, 0.005, 0.006, 0.007, 0.008, 0.009, 0.01, random(0.015, 0.025), 0.02, 0.03, 0.04, 0.05, 0.055, 0.06, 0.065, 0.07, 0.075, 0.08, 0.085, 0.09, 0.093, 0.095, 0.1, 0.101, 0.102, 0.103, 0.0104, 0.0105];
            
            ali_mult = [0.55, 0.57, 0.58, 0.59, 0.6, 0.61, 0.62, 0.63, random(0.625, 0.645), 0.64, 0.65, random(0.655, 0.665), 0.66, 0.67, 0.68, 0.69, 0.693, 0.695, 0.697, 0.7, 0.7, 0.7, 0.705, 0.71, 0.71, 0.71, 0.72, 0.73, 0.74, 0.75];
            
            coh_mult = [1.13, 1.135, random(1.145, 1.15), 1.145, 1.145, 1.147, 1.15, random(1.15, 1.155), 1.155, 1.157, 1.16, 1.165, 1.17, 1.175, 1.18, 1.185, 1.19, 1.195, 1.2, 1.205, 1.21, 1.215, 1.22, 1.225, 1.23, 1.235, 1.24, 1.25, 1.26, 1.27, 1.28, 1.29, 1.3, 1.305, 1.31, 1.315, 1.32, 1.33, 1.34, 1.345, 1.35, 1.36, 1.365, 1.37, 1.38, 1.385, 1.39, 1.395, 1.4, 1.43, 1.45, 1.47, 1.48, 1.5, 1.51, 1.52, 1.53, 1.54, 1.55, 1.56, 1.57, 1.58, 1.59, 1.6, 1.61, 1.62, 1.63, 1.64, 1.65, 1.66, 1.67, 1.68, 1.69, 1.7, 1.71, 1.72, 1.73, 1.74, 1.75];
            
            loc_mult = [-0.95, -0.94, -0.935, -0.93, -0.925, -0.92, -0.9, -0.85, -0.8, -0.75, -0.7, -0.5, -0.4, -0.3, -0.2, -0.15, -0.1, -0.07, -0.05, -0.01, -0.007, -0.005, -0.003, -0.001, -0.0001, 0, 0, 0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.07, 0.08, 0.085, 0.09, 0.1, 0.1, 0.1, 0.15, 0.17, 0.18, 0.19, 0.2, 0.21, 0.25, 0.27, 0.3, 0.33, 0.35, 0.4, 0.41, 0.45, 0.5, 0.55, 0.56, 0.57, 0.58, 0.59, 0.6, 0.61, 0.63, 0.65, random(0.65, 0.72), 0.68, 0.683, 0.685, 0.69, 0.691, 0.695, 0.7, 0.7, 0.701, 0.703, 0.704, 0.705, 0.71, 0.711, 0.72, 0.7201, 0.7202, 0.7203, 0.721, 0.722, 0.723, 0.725, 0.73, 0.731, 0.733, 0.735, 0.74, 0.741, 0.743, 0.7431, 0.7432, 0.745, 0.75, 0.751, 0.752, 0.753, 0.7531, 0.7532, 0.7533, 0.755, 0.757, 0.76, 0.761, 0.765, 0.77, 0.771, 0.772, 0.773, 0.7735, 0.775, 0.78, 0.785, 0.79];
            my_loc_mult = loc_mult[int(random(0, loc_mult.length))];
            
            speeds = [0.015, 0.017, 0.019, 0.02, 0.023, 0.025, 0.0255, 0.0257, 0.026, 0.027, 0.028, 0.03, 0.031, 0.032, 0.033, 0.035, 0.037, 0.04, 0.042, 0.045, 0.047, 0.05, random(0.055, 0.08), 0.055, 0.06, 0.065, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12];
            
            rads = [135, 150, 175, 180, 185, 200, 225, 250, 275, 300, 325, 350, 375, 400, int(random(400, 500)), 425, 435, 450, 465, 475, 485, 500, 515, 525, 535, 545, 550, 565, 575, 585, 600, 625, 650];
        }
        
        my_maxforce = maxforce[int(random(0, maxforce.length))];
        
        my_sep_mult = sep_mult[int(random(0, sep_mult.length))];
        
        my_ali_mult = ali_mult[int(random(0, ali_mult.length))];
        
        steers = [-1000, -500, -300, -100, -75, -50, -25, -15, -10, -5, -1, 1, 5, 10, 15, 25, 50, 75, 100, 300, 500, 1000];
        my_steer = steers[int(random(0, steers.length))];
        
        ang = 0; 
        
        my_coh_mult = coh_mult[int(random(0, coh_mult.length))];
        
        speed = speeds[int(random(0, speeds.length))];
        radius = rads[int(random(0, rads.length))];
        rad_incs = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45]
        rad_inc = rad_incs[int(random(0, rad_incs.length))];
    
        // >>> LONG HAIR FX
        // ON/OFF: 1 ON, else OFF
        if (is_bg_black == true && is_Black_1 == true) {
            rapunzel = 1;
        }
        else if (is_bg_black == true && is_Black_1 == false) {
            rapunzels = [1, 1, 1, 2, 2];
            rapunzel = rapunzels[int(random(0, rapunzels.length))];   
        }
        else if (is_bg_white == true) {
            rapunzel = 0;  
        }
        else {
            rapunzels = [1, 1, 2, 2, 2];
            rapunzel = rapunzels[int(random(0, rapunzels.length))];   
        }
        
        // TYPES: 1 lines, 2 arcs
        if (is_Black_1 == true) {
            lg_hair_types = [1, 2, 2, 2, 2];
        }
        else {
            lg_hair_types = [1, 2, 2, 1];
        }
        lg_hair_1_type = lg_hair_types[int(random(0, lg_hair_types.length))];
        lg_hair_2_type = lg_hair_1_type;
        
        if (is_Black_1 == true && lg_hair_1_type != 1) {
            dots_1 = 1; // 1 ON, else OFF
            dots_2 = int(random(0, 2)); // 1 ON, else OFF
        }
        else {
            dots_1 = int(random(0, 2)); // 1 ON, else OFF
            dots_2 = int(random(0, 2)); // 1 ON, else OFF
        }
        
        arc_1_types = [1, 1, 2, 3, 1];
        arc_1_type = arc_1_types[int(random(0, arc_1_types.length))];
        arc_1_x = int(random(-3, 4));
        arc_1_y = int(random(-3, 4));
        arc_1_x2 = int(random(5, 16));
        arc_1_y2 = int(random(45, 71));
        
        arc_2_types = [1, 2, 3, 3, 1];
        arc_2_type = arc_2_types[int(random(0, arc_2_types.length))];
        arc_2_x = int(random(-2, 3)) * 10;
        arc_2_y = int(random(-3, 4)) * 100;

        // LINES
        if (rapunzel == 1 && lg_hair_1_type == 1 || rapunzel == 1 && lg_hair_2_type == 1) {
            // LONG HAIR 1
            lg_hairs_1 = 1; // 1 ON, 2 OFF

            if (is_Black_1 == true) {
                lg_we1s = [0.3, 0.4, 0.45];
            }
            else if (is_Black_1 == false) {
                lg_we1s = [0.09, 0.095, 0.1];
            }
            else {
                lg_we1s = [0.06, 0.061, 0.065, 0.067];  
            }
            lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

            lg_x1s = [150, 175, 200, 250, 300, 350, 400, 450, 500];
            lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

            lg_y1s = [100, 125, 150, 175, 200, 250, 300, 350, 400];
            lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
            
            // LONG HAIR 2
            if (is_Black_1 == true) {
                let h2_switch =  [1, 1, 0, 1, 0, 1];
                lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

                lg_we2s = [0.15, 0.2, 0.23, 0.25, 0.27, 0.3];
                lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

                lg_x2s = [100, 150, 200, 250, 300, 350, 375];
                lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

                lg_y2s = [75, 85, 95, 105, 115, 125, 175, 225, 250];
                lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
            }
        }
        // ARCS
        if (rapunzel == 1 && lg_hair_1_type == 2 || rapunzel == 1 && lg_hair_2_type == 2) {
        // LONG HAIR 1
            lg_hairs_1 = 1; // 1 ON, 2 OFF

            if (is_Black_1 == true) {
                lg_we1s = [0.3, 0.35, 0.4, 0.45];
            }
            else if (is_Black_1 == false) {
                lg_we1s = [0.06, 0.062, 0.064, 0.065, 0.066, 0.07, 0.075];
            }
            lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

            lg_x1s = [85, 95, 105, 115, 125, 150, 175, 200, 225, 250, 275, 300, 350, 400, 450];
            lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

            lg_y1s = [75, 95, 100, 115, 125, 150, 175, 200, 250, 300];
            lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
            
            // LONG HAIR 2
            let h2_switch = [1, 1, 0, 1, 1, 1];
            lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF
 
            if (is_Black_1 == true) {
                lg_we2s = [0.15, 0.2, 0.25, 0.3, 0.35];
            }
            else if (is_Black_1 == false) {
                lg_we2s = [0.06, 0.062, 0.063, 0.064, 0.065, 0.066, 0.068, 0.07];
            }
            lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];
            
            lg_x2s = [85, 95, 105, 115, 125, 150, 175, 200, 225, 250, 275, 300, 350, 400];
            lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

            lg_y2s = [75, 95, 100, 115, 125, 150, 175, 200, 250, 300];
            lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
        }

        if (is_Black_1 == true) {
            skip_rapunzel = false;
        }
        else {
            let salto = int(random(0, 3));
            if (salto == 1) {
                skip_rapunzel = true;
            }
            else {
                skip_rapunzel = false;
            }
        }
        
        
        // >>> OPACITIES
        if (is_bg_black == true && is_Black_1 == false) {
            s_opa = int(random(10, 19));
        }
        else if (is_bg_black == true && is_Black_1 == true) {
            s_opa = int(random(19, 28));
        }
        else if (is_bg_white == true) {
            s_opa = int(random(10, 17));    
        }
        else {
            s_opa = int(random(10, 19));
        }
        
        
        // >>> BLEND MODE: 1 NORMAL, 2 SCREEN, 3 LIGHTEST| used in long hair fx
        blend_type_1 = 2;
        blend_type_2 = 2;
        
        
        // >>> BRUSH STROKE ROTATION
        if (lg_hair_1_type == 1) {
            movs = [2, 3, 4, 5, 6];
        }
        else if (lg_hair_1_type == 2 && is_Black_1 == false) {
            movs = [3, 5, 5, 6];
        }
        else if (lg_hair_1_type == 2 && is_Black_1 == true) {
            movs = [3, 5, 5];
        }
        brush_mov = movs[int(random(0, movs.length))];
        
        
        // >>> BRUSH STROKE THICKNESS 
        accent_type = int(random(1, 6));
        // medium
        if (accent_type == 1) {
            accent_x = int(random(0, 3)); 
            accent_y = int(random(3, 12)); 
            accent_type_string = 'medium';
        }
        // thin
        else {
            accent_x = int(random(0, 3));
            accent_y = int(random(0, 3)); 
            accent_type_string = 'thin'
        }
        
        // FOR SHAPES
        c_max = int(random(4, 8)); // used in shape 1: circles
        o_x_min = int(random(2, 6)); // used in shape 2: ovals
        o_x_max = int(random(7, 8)); // used in shape 2: ovals
        o_y_min = int(random(2, 6)); // used in shape 2: ovals
        o_y_max = int(random(7, 11)); // used in shape 2: ovals
        r_x_max = int(random(2, 8)); // used in shape 3: rects
        r_y_max = int(random(4, 15)); // used in shape 3: rects
        t_y_1 = int(random(2, 10)); // used in shape 4: small tri
        t_y_2 = int(random(10, 21)); // used in shape 5: mixed tri
        t_x_1 = int(random(5, 11)); // used in shape 6: big tri
        r_x_1 = int(random(10, 31)); // used in shape 7: long thin rects
        
        // 1: circles, 2: ovals, 3: rects, 4: tri small, 5: tri mixed, 6: tri big, 7: rects long
        if (my_loc_mult > 0.55) {
            let shapes = [1, 1, 2, 3, 3, 4, 4, 5, 5, 7];
            which_shape = shapes[int(random(0, shapes.length))];
        }
        else {
            let shapes = [1, 1, 3, 3, 4, 5, 5, 7, 7, 7];
            which_shape = shapes[int(random(0, shapes.length))];
        }
        

        // >>> DRAW LOOP DURATION
        if (l5_type == 1) {
            myStops = [1200, 1300, 1400, 1500, 1600, 1625, 1650, 1675, 1700, 1725, 1750, 1775, 1800, 1805, 1815, 1825, 1850, 1875]; 
        }
        else if (l5_type == 2) {
            myStops = [1200, 1400, 1600, 1625, 1650, 1675, 1700, 1725, 1750, 1775, 1800, 1805, 1815, 1825, 1850, 1875]; 
        }
         else {
            myStops = [1150, 1200, 1400, 1600, 1625, 1650, 1675, 1700, 1725, 1750, 1775, 1800, 1805, 1815, 1825, 1850, 1875]; 
        }
        myStop_string = 'long';
    }
    
    else if (loop_type == 6) {
        initial_boids = int(random(33, 38));
        boids_start = int(random(1, 5));
        let l6_vs = [1, 1, 2, 3, 3];
        l6_v = l6_vs[int(random(0, l6_vs.length))]; 
        
        // >>> FLOCKING CONTROLS
        maxspeed = [20.5, 20.7, 21, 21.3, 21.5, 21.7, 21.9, 22, 22.3, 22.5, 22.7, 23, 23.3, 23.5, 23.7, 24, 24.3, 24.5];
        my_maxspeed = maxspeed[int(random(0, maxspeed.length))];
        
        maxforce = [1.02, 1.03, 1.05, 1.08, 1.09, 1.1, 1.11, 1.12, 1.125, 1.13, 1.14, 1.145, 1.15, 1.155, 1.16, 1.165, 1.17, 1.18, 1.185, 1.19, 1.195, 1.97, 1.975, 1.978, 1.98];
        my_maxforce = maxforce[int(random(0, maxforce.length))];
        
        sep_mult = [0.0035, 0.0045, 0.0055, 0.0075, 0.0085, 0.01, 0.02, 0.03, 0.04, 0.05, random(0.05, 0.08), 0.07, 0.08, 0.09, 0.1, 0.105, 0.11];
        my_sep_mult = sep_mult[int(random(0, sep_mult.length))];
        
        ali_mult = [0.53, 0.55, 0.59, 0.61, 0.62, 0.63, random(0.63, 0.65), 0.64, 0.65, 0.66, 0.67, 0.675, 0.68, 0.69, 0.7, 0.71, 0.72, 0.725, 0.73, random(0.73, 0.75), 0.75, 0.76, 0.77, 0.78, 0.79, 0.8];
        my_ali_mult = ali_mult[int(random(0, ali_mult.length))];
        
        coh_mult = [random(1.05, 1.1), 1.1, 1.115, 1.12, 1.125, 1.13, 1.135, 1.14, 1.145, 1.15, 1.155, 1.16, 1.17, 1.18, 1.19, 1.2, 1.22, 1.23, random(1.25, 1.5), 1.4, 1.45, 1.5, 1.55, 1.6, 1.6, 1.61, 1.63, 1.65, 1.7];
        my_coh_mult = coh_mult[int(random(0, coh_mult.length))];
        
        separations = [-100, -90, -85, -75, -50, -45];
        my_desiredseparation = separations[int(random(0, separations.length))];
        
        neigh_1 = [150, 175, 200, 205, 215, 265, 300, 325, 345, 375, 400, 445, 470, 485, 500, 505, 575, 590, 600, 636, 655, 700, 10000, 15000];
        my_neighbordist_1 = neigh_1[int(random(0, neigh_1.length))];
        
        neigh_2 = [550, 565, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1500, 2000, 2250, 2300, 2500];
        my_neighbordist_2 = neigh_2[int(random(0, neigh_2.length))];
        
        my_acceleration_x1 = int(random(-5, 6)) * 10;
        my_acceleration_y1 = int(random(-5, 6)) * 10;

        vel_xs = [-100, -85, -5, 0.5, 5, 85, 100, 500, 1000];
        my_vel_x = vel_xs[int(random(0, vel_xs.length))];
        
        loc_mult = [-0.91, -0.9, -0.85, -0.8, -0.7, -0.55, -0.5, -0.45, -0.4, -0.35, -0.3, -0.25, -0.2, -0.1, -0.09, -0.07, -0.05, -0.03, -0.008, -0.005, -0.003, -0.002, -0.001];
        my_loc_mult = loc_mult[int(random(0, loc_mult.length))];
        
        steers = [0, 5, 10, 50, 85, 100, 300, 500, 750, 1000];
        my_steer = steers[int(random(0, steers.length))];
        
        ang = 0;

        speeds = [0.03, random(0.03, 0.06), 0.035, 0.04, 0.045, 0.05, 0.055, 0.06, random(0.06, 0.08), 0.07, 0.08, 0.083, 0.085, 0.087, 0.088, 0.09, 0.093, 0.095, 0.1, random(0.1, 0.15), 0.14, 0.15, random(0.15, 0.25), 0.23, 0.24, 0.25, 0.26, 0.27, 0.28, 0.29, 0.3];
        speed = speeds[int(random(0, speeds.length))];
        
        rads = [1, 5, 5, 5, 10, 10, 15, 20, 25, 50, 50, 50, 55, 75, 85, 90, 100, 100, 100, 115, 125, 135, 150, 150, 175, 200, 200, 205, 215, 225, 250, 250, 275, 285, 300];
        radius = rads[int(random(0, rads.length))];
        
        rad_incs = [0.1, 0.15, 0.2, 0.23, 0.25, 0.27, 0.3, 0.4, 0.45, 0.47, 0.5, 0.55];
        rad_inc = rad_incs[int(random(0, rad_incs.length))];
        
        
        // >>> LONG HAIR FX
        // ON/OFF: 1 ON, else OFF
        if (is_bg_black == true && is_Black_1 == true) {
            rapunzel = 1;
        }
        else if (is_bg_black == true && is_Black_1 == false) {
            rapunzels = [1, 1, 1, 2, 2];
            rapunzel = rapunzels[int(random(0, rapunzels.length))];   
        }
        else if (is_bg_white == true) {
            rapunzel = 0;  
        }
        else {
            rapunzels = [1, 1, 2, 2, 2];
            rapunzel = rapunzels[int(random(0, rapunzels.length))];   
        }
        
        // TYPES: 1 lines, 2 arcs
        if (is_Black_1 == true) {
            lg_hair_types = [1, 2, 2, 2, 2];
        }
        else {
            lg_hair_types = [1, 2, 2, 1];
        }
        lg_hair_1_type = lg_hair_types[int(random(0, lg_hair_types.length))];
        lg_hair_2_type = lg_hair_1_type;
        
        if (is_Black_1 == true && lg_hair_1_type != 1) {
            dots_1 = 1; // 1 ON, else OFF
            dots_2 = int(random(0, 2)); // 1 ON, else OFF
        }
        else {
            dots_1 = int(random(0, 2)); // 1 ON, else OFF
            dots_2 = int(random(0, 2)); // 1 ON, else OFF
        }
        
        arc_1_types = [1, 1, 2, 3, 1];
        arc_1_type = arc_1_types[int(random(0, arc_1_types.length))];
        arc_1_x = int(random(-3, 4));
        arc_1_y = int(random(-3, 4));
        arc_1_x2 = int(random(5, 16));
        arc_1_y2 = int(random(45, 71));
        
        arc_2_types = [1, 2, 3, 3, 1];
        arc_2_type = arc_2_types[int(random(0, arc_2_types.length))];
        arc_2_x = int(random(-2, 3)) * 10;
        arc_2_y = int(random(-3, 4)) * 100;

        // LINES
        if (rapunzel == 1 && lg_hair_1_type == 1 || rapunzel == 1 && lg_hair_2_type == 1) {
            // LONG HAIR 1
            lg_hairs_1 = 1; // 1 ON, 2 OFF

            if (is_Black_1 == true) {
                lg_we1s = [0.3, 0.4, 0.45];
            }
            else if (is_Black_1 == false) {
                lg_we1s = [0.09, 0.095, 0.1];
            }
            else {
                lg_we1s = [0.06, 0.061, 0.065, 0.067];  
            }
            lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

            lg_x1s = [400, 450, 500, 600, 650, 700];
            lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

            lg_y1s = [250, 300, 350, 400, 450, 500, 550, 600, 650];
            lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
            
            // LONG HAIR 2
            if (is_Black_1 == true) {
                let h2_switch =  [1, 1, 0, 1, 0, 1];
                lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

                lg_we2s = [0.15, 0.2, 0.23, 0.25, 0.27, 0.3];
                lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

                lg_x2s = [100, 150, 200, 250, 300, 350, 375];
                lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

                lg_y2s = [75, 85, 95, 105, 115, 125, 175, 225, 250];
                lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
            }
        }
        // ARCS
        if (rapunzel == 1 && lg_hair_1_type == 2 || rapunzel == 1 && lg_hair_2_type == 2) {
        // LONG HAIR 1
            lg_hairs_1 = 1; // 1 ON, 2 OFF

            if (is_Black_1 == true) {
                lg_we1s = [0.3, 0.35, 0.4, 0.45];
            }
            else if (is_Black_1 == false) {
                lg_we1s = [0.06, 0.062, 0.064, 0.065, 0.066, 0.07, 0.075];
            }
            lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

            lg_x1s = [85, 95, 105, 115, 125, 150, 175, 200, 225, 250, 275, 300, 350, 400, 500, 600];
            lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

            lg_y1s = [75, 95, 100, 115, 125, 150, 175, 200, 250, 300];
            lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
            
            // LONG HAIR 2
            let h2_switch = [1, 1, 0, 1, 1, 1];
            lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF
 
            if (is_Black_1 == true) {
                lg_we2s = [0.15, 0.2, 0.25, 0.3, 0.35];
            }
            else if (is_Black_1 == false) {
                lg_we2s = [0.06, 0.062, 0.063, 0.064, 0.065, 0.066, 0.068, 0.07];
            }
            lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];
            
            lg_x2s = [85, 95, 105, 115, 125, 150, 175, 200, 225, 250, 275, 300, 350, 400];
            lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

            lg_y2s = [75, 95, 100, 115, 125, 150, 175, 200, 250, 300];
            lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
        }

        if (is_Black_1 == true) {
            skip_rapunzel = false;
        }
        else {
            let salto = int(random(0, 3));
            if (salto == 1) {
                skip_rapunzel = true;
            }
            else {
                skip_rapunzel = false;
            }
        }
        
        
        // >>> OPACITIES
        if (is_bg_black == true && is_Black_1 == false) {
            s_opa = int(random(13, 24));
        }
        else if (is_bg_black == true && is_Black_1 == true) {
            s_opa = int(random(19, 28));
        }
        else if (is_bg_white == true) {
            s_opa = int(random(13, 17));    
        }
        else {
            s_opa = int(random(13, 19));
        }
        
        
        // >>> BLEND MODE: 1 NORMAL, 2 SCREEN, 3 LIGHTEST | used in long hair fx
        blend_type_1 = 2;
        blend_type_2 = 2;
        
        
        // >>> BRUSH STROKE ROTATION
        if (lg_hair_1_type == 1) {
            movs = [1, 2, 3, 3, 4, 5, 5, 6, 6, 6];
        }
        else if (lg_hair_1_type == 2 && is_Black_1 == false) {
            movs = [3, 3, 5, 5, 5, 5, 6, 6, 6, 6];
        }
        else if (lg_hair_1_type == 2 && is_Black_1 == true) {
            movs = [6, 5, 5, 5, 5, 5, 6, 6, 6, 6];
        }
        brush_mov = movs[int(random(0, movs.length))];
        
        
        // >>> BRUSH STROKE THICKNESS 
        accent_type = int(random(1, 6));
        // medium
        if (accent_type == 1) {
            accent_x = int(random(0, 3)); 
            accent_y = int(random(2, 6)); 
            accent_type_string = 'medium';
        }
        // thin
        else {
            accent_x = int(random(0, 4));
            accent_y = int(random(0, 4)); 
            accent_type_string = 'thin'
        }
        
        // FOR SHAPES
        c_max = int(random(4, 8)); // used in shape 1: circles
        o_x_min = int(random(2, 6)); // used in shape 2: ovals
        o_x_max = int(random(7, 8)); // used in shape 2: ovals
        o_y_min = int(random(2, 6)); // used in shape 2: ovals
        o_y_max = int(random(7, 10)); // used in shape 2: ovals
        r_x_max = int(random(2, 8)); // used in shape 3: rects
        r_y_max = int(random(4, 12)); // used in shape 3: rects
        t_y_1 = int(random(2, 10)); // used in shape 4: small tri
        t_y_2 = int(random(10, 21)); // used in shape 5: mixed tri
        t_x_1 = int(random(3, 7)); // used in shape 6: big tri
        r_x_1 = int(random(5, 16)); // used in shape 7: long thin rects
        
        // 1: circles, 2: ovals, 3: rects, 4: tri small, 5: tri mixed, 6: tri big, 7: rects long
        let shapes = [1, 2, 3, 4, 4, 5, 5, 6, 7, 7];
        which_shape = shapes[int(random(0, shapes.length))];
        

        // >>> DRAW LOOP DURATION
        if (radius > 500) {
            myStops = [1300, 1500, 1750, 1800, 1900]; 
            myStop_string = 'long';
        }
        else {
            myStops = [665, 700, 1000, 1100, 1200, 1250, 1300, 1400]; 
            myStop_string = 'medium';
        }
    }
    
    else if (loop_type == 7) {
        initial_boids = 35;
        let l7_vs = [1, 1, 2, 2, 3, 3, 4, 5, 6];
        l7_v = l7_vs[int(random(0, l7_vs.length))]; // 1 l to r, 2 r to l, 3 t to b, 4 b to t, 5 dia l to r, 6 dia r t l
        boids_start = int(random(1, 16));
        
        // >>> FLOCKING CONTROLS
        maxspeed = [random(21.15, 21.2), 21.2, 21.3, 21.35, 21.4, 21.45, 21.5, 21.55, 21.6, 21.7, 21.75, 21.8, 21.8, 21.8, 21.85, 21.9, 22, 22, 22.1, 22.3, 22.35, 22.5, 22.7, 23, 23.3, 23.5, 23.7];
        my_maxspeed = maxspeed[int(random(0, maxspeed.length))];
        
        maxforce = [1.124, 1.1245, 1.125, 1.125, 1.125, 1.126, 1.127, 1.127, 1.127, 1.1275, 1.128, 1.129, 1.13, 1.1301];
        my_maxforce = maxforce[int(random(0, maxforce.length))];
        
        sep_mult = [0.001, 0.002, 0.008, 0.035, 0.035, 0.035, 0.035, 0.035, 0.045, 0.075, 0.1, 0.105, 0.11, 0.115, 0.12, 0.125, 0.13, 0.135, 0.1, 0.11];
        my_sep_mult = sep_mult[int(random(0, sep_mult.length))];
        
        ali_mult = [0.48, 0.49, 0.5, 0.53, 0.55, 0.57, 0.57, 0.573, 0.575, 0.58, 0.583, 0.585, 0.6, 0.605, 0.607, 0.61, 0.62, 0.63, 0.635, 0.64, 0.65, 0.655, 0.66, 0.67];
        my_ali_mult = ali_mult[int(random(0, ali_mult.length))];
        
        coh_mult = [1.155, 1.156, 1.157, 1.1575, 1.158, random(1.158, 1.159), 1.159, 1.159, 1.1595, 1.16];
        my_coh_mult = coh_mult[int(random(0, coh_mult.length))];
        
        separations = [-100, -100, -95, -90, -80, -75, -50];
        my_desiredseparation = separations[int(random(0, separations.length))];
        
        neigh_1 = [100, 150, 200, 250, 300, 325, 350, 400, 400, 400, 450, 475, 500, 550, 550, 550, 550, 600];
        my_neighbordist_1 = neigh_1[int(random(0, neigh_1.length))];
        
        neigh_2 = [600, 650, 700, 750, 850, 850, 850, 2000, 850, 2000, 10000];
        my_neighbordist_2 = neigh_2[int(random(0, neigh_2.length))];
        
        acce_x1s = [-50, -40, -40, -40, -10, -5, -5, -5, 0, 5, 10, 20, 30, 40, 50];
        my_acceleration_x1 = acce_x1s[int(random(0, acce_x1s.length))];
        
        acce_y1s = [-50, -40, -10, -5, 0, 5, 10, 20, 30, 40, 50];
        my_acceleration_y1 = acce_y1s[int(random(0, acce_y1s.length))];
        
        vel_xs = [1, 5, 10, 25, 50, 85, 100];
        my_vel_x = vel_xs[int(random(0, vel_xs.length))];
        
        loc_mult = [-0.97, -0.97, -0.97, -0.9699999999999, -0.97];
        my_loc_mult = loc_mult[int(random(0, loc_mult.length))];
        
        steers = [0, 0, 0.1, 0.3, 0.5, 1, 3, 5];
        my_steer = steers[int(random(0, steers.length))];
        
        speeds = [0.2, random(0.19, 0.21), 0.21, 0.22, 0.23, 0.25, 0.25, 0.25, 0.25, random(0.25, 0.27), 0.27, 0.28, 0.29, 0.3];
        speed = speeds[int(random(0, speeds.length))];
        
        rads = [0, 0, 0, 1, 1, 1, 3, 3, 5, 5, 5, 10, 15, 20, 25, 25, 25, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 125];
        radius = rads[int(random(0, rads.length))];
        
        rad_incs = [0.15, 0.17, 0.17, 0.17, 0.18, 0.2, 0.23, 0.25, 0.27, 0.28, 0.3, 0.31, 0.32]; 
        rad_inc = rad_incs[int(random(0, rad_incs.length))];
        
        ang = 0; 
        
    
        // >>> LONG HAIR FX
        // ON/OFF: 1 ON, else OFF
        if (is_bg_black == true) {
            rapunzel = 1;
        }
        else if (is_bg_white == true) {
            rapunzel = 0;  
        }
        else {
            rapunzels = [1, 1, 2, 2, 2];
            rapunzel = rapunzels[int(random(0, rapunzels.length))];   
        }
        
        // TYPES: 1 lines, 2 arcs
        lg_hair_types = [1, 1, 2, 2];
        lg_hair_1_type = lg_hair_types[int(random(0, lg_hair_types.length))];
        lg_hair_2_type = lg_hair_1_type;
        
        dots_1 = 1;
        dots_2 = int(random(0, 2)); // 1 ON, else OFF
        
        arc_1_types = [1, 1, 2, 3, 1];
        arc_1_type = arc_1_types[int(random(0, arc_1_types.length))];
        arc_1_x = int(random(-3, 4));
        arc_1_y = int(random(-3, 4));
        arc_1_x2 = int(random(5, 16));
        arc_1_y2 = int(random(45, 71));
        
        arc_2_types = [1, 2, 3, 3, 1];
        arc_2_type = arc_2_types[int(random(0, arc_2_types.length))];
        arc_2_x = int(random(-4, 3)) * 10;
        arc_2_y = int(random(-5, 7)) * 10;

        // LINES
        if (rapunzel == 1 && lg_hair_1_type == 1 || rapunzel == 1 && lg_hair_2_type == 1) {
        // LONG HAIR 1
            lg_hairs_1 = 1; // 1 ON, 2 OFF
            
            if (is_bg_black == true) {
                if (is_Black_1 == true) {
                    lg_we1s = [0.65, 0.7, 0.8];
                    lg_x1s = [300, 350, 400, 450, 500, 600, 700, 750];
                    lg_y1s = [150, 175, 200, 250, 300, 350];
                }
                else {
                    lg_we1s = [0.06, 0.065, 0.07, 0.08, 0.09, 0.095, 0.1, 0.11];
                    lg_x1s = [250, 300, 350, 400, 450, 500, 550, 600, 650];
                    lg_y1s = [250, 300, 350, 400, 450, 500, 550, 600, 650];
                }
                lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];   
                lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];
                lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))]; 
            }
            else {
                lg_we1s =[0.07, 0.08, 0.09, 0.095, 0.1, 0.11];
                lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

                lg_x1s = [200, 250, 300, 400, 500, 600, 650];
                lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

                lg_y1s = [150, 200, 250, 300, 400, 500, 600];
                lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
            }
            
            // LONG HAIR 2
            if (is_bg_black == true && is_Black_1 == true) {
                let h2_switch =  [1, 1, 0, 1, 0, 1];
                lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

                lg_we2s = [0.15, 0.2, 0.23, 0.25, 0.27, 0.3];
                lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

                lg_x2s = [100, 150, 200, 250, 300, 350, 400, 500];
                lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

                lg_y2s = [75, 85, 95, 105, 115, 125, 175, 225, 250];
                lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
            }
        }
        // ARCS
        if (rapunzel == 1 && lg_hair_1_type == 2 || rapunzel == 1 && lg_hair_2_type == 2) {
        // LONG HAIR 1
            lg_hairs_1 = 1; // 1 ON, 2 OFF

            if (is_Black_1 == false) {
                lg_we1s = [0.01, 0.03, 0.05, 0.06, 0.065, 0.07, 0.08, 0.09, 0.095, 0.1]; 
            }
            else if (is_Black_1 == true) {
                lg_we1s = [0.3, 0.4, 0.5, 0.6];
            }
            lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

            lg_x1s = [150, 175, 200, 215, 225, 250, 275, 300, 350, 400];
            lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

            lg_y1s = [75, 85, 95, 100, 125, 150, 175, 200, 215, 225, 250, 300];
            lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
            
            // LONG HAIR 2
            let h2_switch = [1, 1, 0, 1, 1, 1];
            lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF
 
            if (is_Black_1 == true) {
                lg_we2s = [0.095, 0.1, 0.11, 0.12, 0.14, 0.15, 0.17, 0.18];
            }
            else {
                lg_we2s = [0.03, 0.04, 0.05, 0.06, 0.063, 0.064, 0.065, 0.066];
            }
            lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];
            
            lg_x2s = [85, 100, 110, 115, 125, 150, 175, 200, 215, 225, 250, 275, 300, 350];
            lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

            lg_y2s = [65, 75, 85, 100, 115, 135, 175, 200, 250, 300];
            lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
        }

        skip_rapunzel = false;
        
        
        // >>> OPACITIES
        if (is_bg_black == true && is_Black_1 == false) {
            s_opa = int(random(10, 21)); 
        }
        else if (is_bg_black == true && is_Black_1 == true) {
            s_opa = int(random(11, 18)); 
        }
        else if (is_bg_white == true) {
            s_opa = int(random(13, 17));    
        }
        else {
            s_opa = int(random(13, 19));
        }
        
        // >>> BLEND MODE: 1 NORMAL, 2 SCREEN, 3 LIGHTEST| used in long hair fx
        if (is_Black_1 == true) {
            blend_type_1 = 2; // used to be 3
            blend_type_2 = 2; // used to be 3
        }
        else {
            blend_type_1 = 2; // used to be 3
            blend_type_2 = 2; // used to be 3
        }

        
        // >>> BRUSH STROKE ROTATION
        movs = [6, 6, 6, 6, 6, 6, 6];
        brush_mov = movs[int(random(0, movs.length))];
        
        
        // >>> BRUSH STROKE THICKNESS 
        accent_type = int(random(1, 6));
        // medium
        if (accent_type == 1 || accent_type == 3) {
            accent_x = int(random(7, 10)); 
            accent_y = int(random(5, 10)); 
            accent_type_string = 'medium'
        }
        // thick
        else if (accent_type == 2) {
            accent_x = int(random(14, 25)); 
            accent_y = int(random(15, 24)); 
            accent_type_string = 'thick'
        }
        // thin
        else {
            accent_x = int(random(1, 5));
            accent_y = int(random(2, 10)); 
            accent_type_string = 'thin'
        }
        
        // FOR SHAPES
        c_max = int(random(4, 9)); // used in shape 1: circles
        o_x_min = int(random(2, 6)); // used in shape 2: ovals
        o_x_max = int(random(7, 8)); // used in shape 2: ovals
        o_y_min = int(random(2, 6)); // used in shape 2: ovals
        o_y_max = int(random(7, 10)); // used in shape 2: ovals
        r_x_max = int(random(2, 7)); // used in shape 3: rects
        r_y_max = int(random(3, 8)); // used in shape 3: rects
        t_y_1 = int(random(2, 10)); // used in shape 4: small tri
        t_y_2 = int(random(7, 21)); // used in shape 5: mixed tri
        t_x_1 = int(random(3, 7)); // used in shape 6: big tri
        r_x_1 = int(random(8, 18)); // used in shape 7: long thin rects
        
        // 1: circles, 2: ovals, 3: rects, 4: tri small, 5: tri mixed, 6: tri big, 7: rects long
        let shapes = [1, 2, 2, 3, 3, 4, 5, 5, 6, 7];
        which_shape = shapes[int(random(0, shapes.length))];
        

        // >>> DRAW LOOP DURATION
        if (is_Black_1 == false && my_maxspeed >= 21.3) {
            myStops = [800, 850, 875, 900, 1725, 1750, 1775, 1800, 1825, 1850, 1900];
        }
        else {
           myStops = [900, 925, 950, 1725, 1750, 1775, 1800, 1825, 1850, 1900]; 
        }
        myStop_string = 'long';
    }
    
    else if (loop_type == 8) {     
        initial_boids = int(random(33, 38));
        boids_start = int(random(1, 5));
        let l8_vs = [1, 1, 1, 2, 2];
        l8_v = l8_vs[int(random(1, l8_vs.length))];
        
        // >>> FLOCKING CONTROLS
        maxspeed = [21.7, 21.8, 22, 22.3, 22.5, 22.55, random(22.5, 23), 22.7, 22.8, 23, 23.3];
        my_maxspeed = maxspeed[int(random(0, maxspeed.length))];

        maxforce = [0.999, 1, 1.005, 1.01, random(1.01, 1.03), 1.02, 1.03, 1.031, 1.035, 1.04, 1.045, 1.05, 1.055, 1.06, 1.07, 1.09, 1.1, 1.11];
        my_maxforce = maxforce[int(random(0, maxforce.length))];
        
        sep_mult = [0.0035, 0.0055, 0.01, 0.015, 0.02, 0.03, 0.05, 0.06, 0.08, 0.09, 0.1, 0.105, 0.11, 0.11, 0.12, 0.125, 0.13, 0.145, 0.15];
        my_sep_mult = sep_mult[int(random(0, sep_mult.length))];
        
        ali_mult = [0.6, 0.63, 0.65, 0.67, 0.7, 0.71, 0.72, 0.73, 0.75, 0.76, 0.77, 0.78, 0.79];
        my_ali_mult = ali_mult[int(random(0, ali_mult.length))];
        
        coh_mult = [1.12, 1.122, 1.123, 1.125, 1.127, 1.128, 1.13, 1.131, 1.133];
        my_coh_mult = coh_mult[int(random(0, coh_mult.length))];
        
        my_desiredseparation = -100;
        
        neigh_1 = [100, 150, 200, 250, 300, 350, 400, 450, 500, 545, 600, 700, 10000];
        my_neighbordist_1 = neigh_1[int(random(0, neigh_1.length))];
        
        neigh_2 = [500, 525, 550, 600, 636, 650, 685, 700, 735, 750, 800, 850, 900, 950, 1000, 1500, 2000, 2100];
        my_neighbordist_2 = neigh_2[int(random(0, neigh_2.length))];
        
        acce_x1s = [-100, -75, -50, -1, 0, 1, 10, 50, 75, 100];
        my_acceleration_x1 = acce_x1s[int(random(0, acce_x1s.length))];
        
        acce_y1s = [-100, -75, -50, -1, 0, 1, 10, 50, 75, 100];
        my_acceleration_y1 = acce_y1s[int(random(0, acce_y1s.length))];

        vel_xs = [-10, -5, -1.5, -1, 1, 1.5, 5, 10];
        my_vel_x = vel_xs[int(random(0, vel_xs.length))];
        
        loc_mult = [-0.94, -0.92, -0.9, -0.88, -0.8, -0.7, -0.6, -0.35, -0.3, -0.1, -0.09, -0.5, -0.009, -0.0075, -0.007, -0.005, -0.003, -0.001, 0, 0, 0]; 
        my_loc_mult = loc_mult[int(random(0, loc_mult.length))];
        
        steers = [-0.5, 0, 0.5, 1, 2, 3, 5, 10];
        my_steer = steers[int(random(0, steers.length))];
        
        ang = 0; 
        
        speeds = [0.05, random(0.05, 0.1), 0.07, 0.08, 0.09, 0.1, 0.13, 0.15, 0.2, 0.23, 0.25, 0.27, 0.295, 0.297, 0.299, 0.3, 0.305, random(0.3, 0.4), 0.35, 0.37, 0.4];
        speed = speeds[int(random(0, speeds.length))];
        
        rads = [215, 225, 235, 245, 250, 275, 300, 305, 315, 325, 335, 340, 350];
        radius = rads[int(random(0, rads.length))];
        
        rad_incs = [0.25, 0.27, 0.3, 0.33, 0.35, 0.37, 0.4, 0.43, 0.45, 0.48, 0.5];
        rad_inc = rad_incs[int(random(0, rad_incs.length))];
        
    
        // >>> LONG HAIR FX
        // ON/OFF: 1 ON, else OFF
        if (is_bg_black == true && is_Black_1 == true) {
            rapunzel = 1;
        }
        else if (is_bg_black == true && is_Black_1 == false) {
            rapunzels = [1, 1, 1, 2, 2];
            rapunzel = rapunzels[int(random(0, rapunzels.length))];   
        }
        else if (is_bg_white == true) {
            rapunzel = 0;  
        }
        else {
            rapunzels = [1, 1, 2, 2, 2];
            rapunzel = rapunzels[int(random(0, rapunzels.length))];   
        }
        
        // TYPES: 1 lines, 2 arcs
        if (is_Black_1 == true) {
            lg_hair_types = [1, 2, 2, 2, 2];
        }
        else {
            lg_hair_types = [1, 2, 2, 1, 2];
        }
        lg_hair_1_type = lg_hair_types[int(random(0, lg_hair_types.length))];
        lg_hair_2_type = lg_hair_1_type;
        
        if (is_Black_1 == true && lg_hair_1_type != 1) {
            dots_1 = 1; // 1 ON, else OFF
            dots_2 = int(random(0, 2)); // 1 ON, else OFF
        }
        else {
            dots_1 = int(random(0, 2)); // 1 ON, else OFF
            dots_2 = int(random(0, 2)); // 1 ON, else OFF
        }
        
        arc_1_types = [1, 1, 2, 3, 1];
        arc_1_type = arc_1_types[int(random(0, arc_1_types.length))];
        arc_1_x = int(random(-3, 4));
        arc_1_y = int(random(-3, 4));
        arc_1_x2 = int(random(5, 16));
        arc_1_y2 = int(random(45, 71));
        
        arc_2_types = [1, 2, 3, 3, 1];
        arc_2_type = arc_2_types[int(random(0, arc_2_types.length))];
        arc_2_x = int(random(-2, 3)) * 10;
        arc_2_y = int(random(-3, 4)) * 100;

        // LINES
        if (rapunzel == 1 && lg_hair_1_type == 1 || rapunzel == 1 && lg_hair_2_type == 1) {
            // LONG HAIR 1
            lg_hairs_1 = 1; // 1 ON, 2 OFF

            if (is_Black_1 == true) {
                lg_we1s = [0.3, 0.4, 0.45];
            }
            else if (is_Black_1 == false) {
                lg_we1s = [0.09, 0.095, 0.1];
            }
            else {
                lg_we1s = [0.06, 0.061, 0.065, 0.067];  
            }
            lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

            lg_x1s = [400, 450, 500, 600, 650, 700];
            lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

            lg_y1s = [250, 300, 350, 400, 450, 500, 550, 600, 650];
            lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
            
            // LONG HAIR 2
            if (is_Black_1 == true) {
                let h2_switch =  [1, 1, 0, 1, 0, 1];
                lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

                lg_we2s = [0.15, 0.2, 0.23, 0.25, 0.27, 0.3];
                lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

                lg_x2s = [100, 150, 200, 250, 300, 350, 375];
                lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

                lg_y2s = [75, 85, 95, 105, 115, 125, 175, 225, 250];
                lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
            }
        }
        // ARCS
        if (rapunzel == 1 && lg_hair_1_type == 2 || rapunzel == 1 && lg_hair_2_type == 2) {
        // LONG HAIR 1
            lg_hairs_1 = 1; // 1 ON, 2 OFF

            if (is_Black_1 == true) {
                lg_we1s = [0.3, 0.35, 0.4, 0.45];
            }
            else if (is_Black_1 == false) {
                lg_we1s = [0.06, 0.062, 0.064, 0.065, 0.066, 0.07, 0.075];
            }
            lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

            lg_x1s = [85, 95, 105, 115, 125, 150, 175, 200, 225, 250, 275, 300, 350, 400, 500, 600];
            lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

            lg_y1s = [75, 95, 100, 115, 125, 150, 175, 200, 250, 300];
            lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
            
            // LONG HAIR 2
            let h2_switch = [1, 1, 0, 1, 1, 1];
            lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF
 
            if (is_Black_1 == true) {
                lg_we2s = [0.15, 0.2, 0.25, 0.3, 0.35];
            }
            else if (is_Black_1 == false) {
                lg_we2s = [0.06, 0.062, 0.063, 0.064, 0.065, 0.066, 0.068, 0.07];
            }
            lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];
            
            lg_x2s = [85, 95, 105, 115, 125, 150, 175, 200, 225, 250, 275, 300, 350, 400];
            lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

            lg_y2s = [75, 95, 100, 115, 125, 150, 175, 200, 250, 300];
            lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
        }
        
        if (is_Black_1 == true) {
            skip_rapunzel = false;
        }
        else {
            let salto = int(random(0, 3));
            if (salto == 1) {
                skip_rapunzel = true;
            }
            else {
                skip_rapunzel = false;
            }
        }
        
        
        // >>> OPACITIES
        if (is_bg_black == true && is_Black_1 == false) {
            s_opa = int(random(13, 24));
        }
        else if (is_bg_black == true && is_Black_1 == true) {
            s_opa = int(random(19, 28));
        }
        else if (is_bg_white == true) {
            s_opa = int(random(13, 17));    
        }
        else {
            s_opa = int(random(13, 19));
        }
        
        
        // >>> BLEND MODE: 1 NORMAL, 2 SCREEN, 3 LIGHTEST| used in long hair fx
        blend_type_1 = 2;
        blend_type_2 = 2;
        
        
        // >>> BRUSH STROKE ROTATION
        if (lg_hair_1_type == 1) {
            movs = [1, 2, 3, 4, 5, 5, 6];
        }
        else if (lg_hair_1_type == 2 && is_Black_1 == false) {
            movs = [3, 3, 5, 5, 6, 6];
        }
        else if (lg_hair_1_type == 2 && is_Black_1 == true) {
            movs = [6, 5, 5, 5, 6, 5];
        }
        brush_mov = movs[int(random(0, movs.length))];
        
        
        // >>> BRUSH STROKE THICKNESS 
        accent_type = int(random(1, 6));
        // medium
        if (accent_type == 1) {
            accent_x = int(random(0, 3)); 
            accent_y = int(random(5, 16)); 
            accent_type_string = 'medium';
        }
        // thin
        else {
            accent_x = int(random(0, 3));
            accent_y = int(random(0, 3)); 
            accent_type_string = 'thin';
        }
        
        // FOR SHAPES
        c_max = int(random(4, 8)); // used in shape 1: circles
        o_x_min = int(random(2, 6)); // used in shape 2: ovals
        o_x_max = int(random(7, 10)); // used in shape 2: ovals
        o_y_min = int(random(2, 6)); // used in shape 2: ovals
        o_y_max = int(random(7, 10)); // used in shape 2: ovals
        r_x_max = int(random(2, 6)); // used in shape 3: rects
        r_y_max = int(random(3, 15)); // used in shape 3: rects
        t_y_1 = int(random(2, 10)); // used in shape 4: small tri
        t_y_2 = int(random(10, 21)); // used in shape 5: mixed tri
        t_x_1 = int(random(1, 4)); // used in shape 6: big tri
        r_x_1 = int(random(15, 23)); // used in shape 7: long thin rects
        
        // 1: circles, 2: ovals, 3: rects, 4: tri small, 5: tri mixed, 6: tri big, 7: rects long
        let shapes = [1, 2, 3, 4, 4, 5, 5, 6, 7, 7];
        which_shape = shapes[int(random(0, shapes.length))];
        

        // >>> DRAW LOOP DURATION
        if (my_loc_mult == -0.97) {
            myStops = [1750, 1800, 1900]; 
            myStop_string = 'long';
        }
        else if (my_loc_mult != -0.97 && l8_v == 2) {
            myStops = [950, 1000, 1100, 1200, 1300]; 
            myStop_string = 'long';
        }
        else {
            myStops = [750, 800, 1000, 1200, 1250, 1300, 1400]; 
            myStop_string = 'long';
        }
    }
    
    s_mode = int(random(1, 3)); // 1 = -, 2 = +
    
    centerX = size / 2;
    centerY = size / int(random(3, 5));
    
    // >>> SHORT HAIRS
    sh_hair_1_type = int(random(1, 3)); // 1 line, 2 arc
    sh_hair_2_type = int(random(1, 3)); // 1 line, 2 arc
    dots_3 = int(random(0, 2)); // 1 ON, else OFF
    dots_4 = int(random(0, 3)); // 1 ON, else OFF

    // LINES
    if (sh_hair_1_type == 1 || sh_hair_2_type == 1) {
        
        sh_we1s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.17];
        sh_st_we_1 = sh_we1s[int(random(0, sh_we1s.length))];

        sh_we2s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.17];
        sh_st_we_2 = sh_we2s[int(random(0, sh_we2s.length))];

        sh_hairs_1 = 1;
        sh_hairs_2 = int(random(1, 3)); // 1 ON, 2 OFF

        sh_hair_x1 = int(random(5, 26));
        sh_hair_y1 = int(random(10, 20));
        sh_hair_x2 = int(random(5, 26));
        sh_hair_y2 = int(random(10, 20));
    }
    // ARCS
    else if (sh_hair_1_type == 2 || sh_hair_2_type == 2) {
        
        sh_we1s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15];
        sh_st_we_1 = sh_we1s[int(random(0, sh_we1s.length))];

        sh_we2s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.13];
        sh_st_we_2 = sh_we2s[int(random(0, sh_we2s.length))];

        sh_hairs_1 = 1;
        sh_hairs_2 = int(random(1, 3)); // 1 ON, 2 OFF

        sh_hair_x1 = int(random(10, 30));
        sh_hair_y1 = int(random(15, 25));
        sh_hair_x2 = int(random(10, 30));
        sh_hair_y2 = int(random(15, 25));
    }
    
    // >>> WEIGHTS AND OPACITIES 
    // STROKE WEIGHTS FOR DOTS
    we1s = [0.10, 0.11, 0.13, 0.14, 0.15, 0.16, 0.17, 0.175, 0.185];
    st_we_1 = we1s[int(random(0, we1s.length))];

    we2s = [0.10, 0.11, 0.13, 0.14, 0.15, 0.16, 0.18];
    st_we_2 = we2s[int(random(0, we2s.length))]; 
    
    // BRUSH OPACITIES
    if (is_Black_1 == true || is_Black_2 == true || is_Red_2 == true || is_Blue_2 == true || is_Yellow_2 == true) {
        opa_min = 85;
        opa_max = 145;
    }
    else {
        opa_min = 65;
        opa_max = 85; 
    }

    f_alpha_1 = int(random(opa_min, opa_max));
    f_alpha_2 = int(random(opa_min, opa_max));
    f_alpha_3 = int(random(opa_min, opa_max));
    
    f_alpha_4 = int(random(opa_min, opa_max));
    f_alpha_5 = int(random(opa_min, opa_max));
    f_alpha_6 = int(random(opa_min, opa_max));

    
    myStop = myStops[int(random(0, myStops.length))];
}

// MOV_1 from dev5.5
function mov_1_dev5() {
    initial_boids = 30;
    boids_start = int(random(1, 5));
    
    // >>> FLOCKING CONTROLS
    maxspeed = [27.2, 27.3, random(27.2, 28), 27.5, random(27.5, 28), 27.7, 28, 28.2, 28.3]; 
    my_maxspeed = maxspeed[int(random(0, maxspeed.length))];
    
    maxforce = [0.95, 0.97, 1, 1.03, random(1.03, 1.05), 1.05, 1.055, 1.06, 1.065, 1.067];
    my_maxforce = maxforce[int(random(0, maxforce.length))];
    
    sep_mult = [0.06, 0.065, 0.07, 0.075, 0.08, 0.09, 0.095, 0.1, 0.105, 0.11];
    my_sep_mult = sep_mult[int(random(0, sep_mult.length))];
    
    ali_mult = [0.55, 0.65, 0.75, 0.85, 0.95, 1, 1, random(1, 1.5), 1.51, 1.52, 1.53, 1.54, 1.55, random(1.5, 2), 1.57, 1.58, 1.59, 1.6, 1.7, 1.8, 1.9, 2];
    my_ali_mult = ali_mult[int(random(0, ali_mult.length))]; 
    
    coh_mult = [1.41, 1.415, 1.4201, 1.425, 1.428];
    my_coh_mult = coh_mult[int(random(0, coh_mult.length))];
    
    separations = [-100, -50, -10, -1, 0];
    my_desiredseparation = separations[int(random(0, separations.length))];
    
    neigh_1 = [0, 0.01, 0, 0.03, 0, 0.05, 0];
    my_neighbordist_1 = neigh_1[int(random(0, neigh_1.length))];
    
    neigh_2 = [1000, 1800, 2000, 2300, 2500, 2600, 2800, 3000, 10000, 20000];
    my_neighbordist_2 = neigh_2[int(random(0, neigh_2.length))];

    acce_x1s = [-500, -300, -100, -50, -10, -5, -2, -1, 1, 2, 5, 10, 50, 100, 300, 500];
    my_acceleration_x1 = acce_x1s[int(random(0, acce_x1s.length))];
    
    acce_y1s = [-500, -300, -100, -50, -10, -5, -2, -1, 1, 2, 5, 10, 50, 100, 300, 500];
    my_acceleration_y1 = acce_y1s[int(random(0, acce_y1s.length))];

    vel_xs = [-1000, -500, -100, -5, -1, 1, 5, 100, 500, 1000];
    my_vel_x = vel_xs[int(random(0, vel_xs.length))];
    
    loc_mult = [-0.4, -0.35, -0.3, -0.25, -0.2, -0.15, -0.1, -0.09, -0.07, -0.05, -0.03, -0.008, -0.005, -0.003, -0.001, 0, 0.001];
    my_loc_mult = loc_mult[int(random(0, loc_mult.length))];
    
    steers = [-1000, -500, -300, -100, -1, 0, 1, 100, 300, 500, 1000]
    my_steer = steers[int(random(0, steers.length))];
    
    free_mode = int(random(1, 3));
    follow_mode = int(random(1, 5)); // 1 = normal, 2 = inv x, 3 = inv y, 4 = inv xy

    rads = [15, 50, 75, 100, 150, 250, 300, 500, 600, 700, 900];
    radius = rads[int(random(0, rads.length))];
    
    rad_incs = [0.15, 0.17, 0.2, 0.25, 0.3, 0.5]
    rad_inc = rad_incs[int(random(0, rad_incs.length))];
    
    ang = 0; 
    
    speeds = [0.15, 0.15, 0.2, 0.25, 0.29, 0.3, 0.35];
    speed = speeds[int(random(0, speeds.length))];
    
    centerX = size/2;
    centerY = size/2;  
    
    // >>> LONG HAIR FX
    // ON/OFF: 1 ON, else OFF
    if (is_bg_black == true) {
        rapunzels = [1, 1, 1, 1, 2];
        rapunzel = rapunzels[int(random(0, rapunzels.length))];   
    }
    else if (is_bg_white == true) {
        rapunzel = 0;  
    }
    else {
        rapunzels = [1, 1, 2, 2, 2];
        rapunzel = rapunzels[int(random(0, rapunzels.length))];   
    }

    // TYPES: 1 lines, 2 arcs
    lg_hair_types = [1, 1, 2, 2];
    lg_hair_1_type = lg_hair_types[int(random(0, lg_hair_types.length))];
    lg_hair_2_type = lg_hair_1_type;

    dots_1 = 1; // 1 ON, else OFF
    dots_2 = int(random(0, 2)); // 1 ON, else OFF

    arc_1_types = [1, 1, 2, 3, 1];
    arc_1_type = arc_1_types[int(random(0, arc_1_types.length))];
    arc_1_x = int(random(-3, 4));
    arc_1_y = int(random(-3, 4));
    arc_1_x2 = int(random(5, 16));
    arc_1_y2 = int(random(45, 71));

    arc_2_types = [1, 2, 3, 3, 1];
    arc_2_type = arc_2_types[int(random(0, arc_2_types.length))];
    arc_2_x = int(random(-2, 3)) * 10;
    arc_2_y = int(random(-3, 4)) * 100;

    // LINES
    if (rapunzel == 1 && lg_hair_1_type == 1 || rapunzel == 1 && lg_hair_2_type == 1) {
        // LONG HAIR 1
        lg_hairs_1 = 1; // 1 ON, 2 OFF

        lg_we1s = [0.062, 0.063, 0.064, 0.065];
        lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

        lg_x1s = [100, 150, 200, 300, 500, 600];
        lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

        lg_y1s = [75, 85, 100, 150, 175, 250, 500];
        lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
        
        // LONG HAIR 2
        let h2_switch = [1, 1, 0, 0, 0, 0];
        lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

        lg_we2s = [0.061, 0.062, 0.063];
        lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

        lg_x2s = [100, 150, 200, 300, 400];
        lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

        lg_y2s = [75, 95, 125, 200, 300];
        lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
    }
    // ARCS
    if (rapunzel == 1 && lg_hair_1_type == 2 || rapunzel == 1 && lg_hair_2_type == 2) {
    // LONG HAIR 1
        lg_hairs_1 = 1; // 1 ON, 2 OFF

        lg_we1s = [0.06, 0.061, 0.062, 0.063];
        lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

        lg_x1s = [75, 85, 500, 550, 600, 700];
        lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

        lg_y1s = [75, 85, 95, 100, 115];
        lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];

        // LONG HAIR 2
        let h2_switch = [1, 1, 1, 1, 0, 1];
        lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

        lg_we2s = [0.06, 0.061, 0.062];
        lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

        lg_x2s = [55, 65, 75, 85, 115, 400];
        lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

        lg_y2s = [65, 75, 85, 100, 115];
        lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
    }
 
    skip_rapunzel = false;
    
    // >>> SHORT HAIR FX
    sh_hair_1_type = int(random(1, 3)); // 1 line, 2 arc
    sh_hair_2_type = int(random(1, 3)); // 1 line, 2 arc
    dots_3 = int(random(0, 2)); // 1 ON, else OFF
    dots_4 = int(random(0, 3)); // 1 ON, else OFF

    // LINES
    if (sh_hair_1_type == 1 || sh_hair_2_type == 1) {
        
        sh_we1s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_1 = sh_we1s[int(random(0, sh_we1s.length))];

        sh_we2s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_2 = sh_we2s[int(random(0, sh_we2s.length))];

        sh_hairs_1 = 1;
        sh_hairs_2 = int(random(1, 3)); // 1 ON, 2 OFF

        sh_hair_x1 = int(random(10, 41));
        sh_hair_y1 = int(random(10, 35));
        sh_hair_x2 = int(random(10, 41));
        sh_hair_y2 = int(random(10, 35));
    }
    // ARCS
    else if (sh_hair_1_type == 2 || sh_hair_2_type == 2) {

        sh_we1s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_1 = sh_we1s[int(random(0, sh_we1s.length))];

        sh_we2s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_2 = sh_we2s[int(random(0, sh_we2s.length))];
        
        sh_hairs_1 = 1;
        sh_hairs_2 = int(random(1, 3)); // 1 ON, 2 OFF

        sh_hair_x1 = int(random(10, 31));
        sh_hair_y1 = int(random(10, 25));
        sh_hair_x2 = int(random(10, 31));
        sh_hair_y2 = int(random(10, 25));
    }
    
    // >>> WEIGHTS AND OPACITIES
    // WEIGHTS FOR DOTS
    we1s = [0.10, 0.11, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.185];
    st_we_1 = we1s[int(random(0, we1s.length))];

    we2s = [0.10, 0.11, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.185];
    st_we_2 = we2s[int(random(0, we2s.length))];
    
    // FILL OPACITIES
    // FILL OPACITIES
    if (is_Black_1 == true || is_Black_2 == true || is_Red_2 == true || is_Blue_2 == true || is_Yellow_2 == true) {
        opa_min = 75;
        opa_max = 145;
    }
    else {
        opa_min = 50;
        opa_max = 65; 
    }
    
    f_alpha_1 = int(random(opa_min, opa_max));
    f_alpha_2 = int(random(opa_min, opa_max));
    f_alpha_3 = int(random(opa_min, opa_max));
    
    f_alpha_4 = int(random(opa_min, opa_max));
    f_alpha_5 = int(random(opa_min, opa_max));
    f_alpha_6 = int(random(opa_min, opa_max));
    
    // STROKE OPACITY
    s_opa = int(random(13, 21));
    
    // BLEND MODE: 1 NORMAL, 2 SCREEN, 3 LIGHTEST | used in long hair fx
    blend_type_1 = 2;
    blend_type_2 = 2;
    
    
    // >>> BRUSH: SHAPE, THICKNESS & ROTATION
    // ROT
    if (lg_hair_1_type == 1) {
        movs = [5, 5, 6, 6]; // 1, 2, 3
    }
    else if (lg_hair_1_type == 2) {
        movs = [5, 6]; 
    }
    else {
        movs = [5, 6]; 
    }
    brush_mov = movs[int(random(0, movs.length))];
    
    // THICKNESS
    accent_x = int(random(0, 19));
    accent_y = int(random(5, 21)); 
    accent_type_string = 'medium'
    
    // FOR SHAPES
    c_max = int(random(6, 9)); // used in shape 1: circles
    o_x_min = int(random(2, 5)); // used in shape 2: ovals
    o_x_max = int(random(4, 7)); // used in shape 2: ovals
    o_y_min = int(random(2, 6)); // used in shape 2: ovals
    o_y_max = int(random(4, 7)); // used in shape 2: ovals
    r_x_max = int(random(4, 8)); // used in shape 3: rects
    r_y_max = int(random(4, 8)); // used in shape 3: rects
    t_y_1 = int(random(4, 9)); // used in shape 4: small tri
    t_y_2 = int(random(10, 16)); // used in shape 5: mixed tri
    t_x_1 = int(random(2, 6)); // used in shape 6: big tri
    r_x_1 = int(random(8, 21)); // used in shape 7: long thin rects

    // 1: circles, 2: ovals, 3: rects, 4: tri small, 5: tri mixed, 6: tri big, 7: rects long
    let shapes = [1, 2, 3, 3, 3, 4, 4, 5, 5, 6];
    which_shape = shapes[int(random(0, shapes.length))];
    
    
    // >>> FRONTERA
    frontera = 42;
    
    // >>> DRAW LOOP DURATION
    which_stop = int(random(1, 6));
    // medium
    if (which_stop == 1) {
        myStops = [1150, 1200, 1225, 1250]; 
        myStop_string = 'medium';
    }
    // long
    else if (which_stop == 2) {
        myStops = [1275, 1300, 1350, 1400]; 
        myStop_string = 'long';
    }
    // long
    else {
        myStops = [1275, 1300, 1350, 1400];
        myStop_string = 'long';
    }

    myStop = myStops[int(random(0, myStops.length))];
}

// MOV_2 from dev5.5
function mov_2_dev5() {
    initial_boids = 35;
    boids_start = int(random(1, 4));
    
    // >>> FLOCKING CONTROLS
    maxspeed = [19, 19.3, 19.5, 19.7, 19.9, 20, 20.3, 20.5, 20.7, 20.9, 21, 21.3, 21.5]; 
    my_maxspeed = maxspeed[int(random(0, maxspeed.length))];
    
    maxforce = [1.15, 1.17, 1.2, 1.35, 1.45, 1.5, 1.5, 1.5, 1.55, 1.6, 1.65, 1.7, 1.7, 1.7, 1.75, 1.77, 1.8, 1.81, 1.83, 1.83]
    my_maxforce = maxforce[int(random(0, maxforce.length))];
    
    sep_mult = [0.01, 0.0075, 0.01, 0.03, 0.04, 0.05, random(0.05, 0.078), 0.078];
    my_sep_mult = sep_mult[int(random(0, sep_mult.length))];
    
    ali_mult = [0.6, 0.61, 0.62, 0.63, 0.64, 0.65, random(0.65, 0.75), 0.7, 0.71, 0.72, 0.75, 0.77, 0.8, 0.85, random(0.85, 0.9), 0.9, 0.91, 0.92];
    my_ali_mult = ali_mult[int(random(0, ali_mult.length))];
    
    coh_mult = [1.155, 1.17, 1.2, 1.2, 1.25, 1.3, 1.35, 1.35, 1.37, 1.4, 1.45, 1.45, 1.47, 1.5, 1.5, 1.55, 1.6, 1.65, 1.7, 1.7, 1.72, 1.73];
    my_coh_mult = coh_mult[int(random(0, coh_mult.length))];
    
    separations = [-100, -85, -50, -10, -1];
    my_desiredseparation = separations[int(random(0, separations.length))];
    
    neigh_1 = [55, 60, 65, 70, 75, 95, 100]; // 10000
    my_neighbordist_1 = neigh_1[int(random(0, neigh_1.length))];
    
    neigh_2 = [700, 1000, 1500, 1800, 2000, 2100, 2150, 2250, 2300, 2500, 10000];
    my_neighbordist_2 = neigh_2[int(random(0, neigh_2.length))];
    
    acce_x1s = [-1, 0, 1, 100, 0];
    my_acceleration_x1 = acce_x1s[int(random(0, acce_x1s.length))];
    
    acce_y1s = [-1, 0, 1, 0, 10];
    my_acceleration_y1 = acce_y1s[int(random(0, acce_y1s.length))];

    vel_xs = [-10, -5, -1, 1, 5, 10, 100];
    my_vel_x = vel_xs[int(random(0, vel_xs.length))];
    
    loc_mult = [-0.65, -0.5, -0.3, -0.2, -0.15, -0.1, -0.07, -0.05, -0.03, -0.01, -0.005, 0, 0, 0, 0.001, 0.005];
    my_loc_mult = loc_mult[int(random(0, loc_mult.length))];
    
    steers = [-1000, -1, 0, 0, 1, 10]
    my_steer = steers[int(random(0, steers.length))];
    
    branch_type = int(random(1, 3)); // 1 = cos cos, 2 = atan sin

    rads = [5, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 500];
    radius = rads[int(random(0, rads.length))];
    
    rad_incs = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.5]
    rad_inc = rad_incs[int(random(0, rad_incs.length))];
    
    ang = 0; 
    
    speeds = [0.01, 0.015, 0.02, 0.03, 0.05, 0.05, 0.1, 0.3, 0.5, 0.7, 0.8, 0.9, 0.95]; 
    speed = speeds[int(random(0, speeds.length))];
    
    centerX = size/2;
    centerY = size/2; 
    
    // >>> LONG HAIR FX
    // ON/OFF: 1 ON, else OFF
    if (is_bg_black == true) {
        rapunzels = [1, 1, 1, 1, 2];
        rapunzel = rapunzels[int(random(0, rapunzels.length))];   
    }
    else if (is_bg_white == true) {
        rapunzel = 0;  
    }
    else {
        rapunzels = [1, 1, 2, 2, 2];
        rapunzel = rapunzels[int(random(0, rapunzels.length))];   
    }

    // TYPES: 1 lines, 2 arcs
    lg_hair_types = [1, 1, 2, 2];
    lg_hair_1_type = lg_hair_types[int(random(0, lg_hair_types.length))];
    lg_hair_2_type = lg_hair_1_type;

    dots_1 = 1; // 1 ON, else OFF
    dots_2 = int(random(0, 2)); // 1 ON, else OFF

    arc_1_types = [1, 1, 2, 3, 1];
    arc_1_type = arc_1_types[int(random(0, arc_1_types.length))];
    arc_1_x = int(random(-3, 4));
    arc_1_y = int(random(-3, 4));
    arc_1_x2 = int(random(5, 16));
    arc_1_y2 = int(random(45, 71));

    arc_2_types = [1, 2, 3, 3, 1];
    arc_2_type = arc_2_types[int(random(0, arc_2_types.length))];
    arc_2_x = int(random(-2, 3)) * 10;
    arc_2_y = int(random(-3, 4)) * 100;

    // LINES
    if (rapunzel == 1 && lg_hair_1_type == 1 || rapunzel == 1 && lg_hair_2_type == 1) {
        // LONG HAIR 1
        lg_hairs_1 = 1; // 1 ON, 2 OFF

        lg_we1s = [0.063, 0.064, 0.065, 0.066, 0.07, 0.075];
        lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

        lg_x1s = [100, 150, 200, 300, 500, 600];
        lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

        lg_y1s = [75, 85, 100, 150, 175, 250, 500];
        lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
        
        // LONG HAIR 2
        let h2_switch = [1, 1, 1, 0, 0];
        lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

        lg_we2s = [0.061, 0.062, 0.063, 0.064];
        lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

        lg_x2s = [100, 150, 200, 300, 400];
        lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

        lg_y2s = [75, 95, 125, 200, 300];
        lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
    }
    // ARCS
    if (rapunzel == 1 && lg_hair_1_type == 2 || rapunzel == 1 && lg_hair_2_type == 2) {
    // LONG HAIR 1
        lg_hairs_1 = 1; // 1 ON, 2 OFF
        
        lg_we1s = [0.06, 0.061, 0.062, 0.063];
        lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

        lg_x1s = [55, 60, 500, 550, 600, 650];
        lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

        lg_y1s = [55, 65, 75, 85, 95, 100, 115];
        lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];

        // LONG HAIR 2
        let h2_switch = [1, 1, 1, 1, 0, 1];
        lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

        if (is_bg_black == true) {
            lg_we2s =  [0.06, 0.061, 0.062, 0.0625];
        }
        else {
            lg_we2s = [0.061, 0.062, 0.063];
        }
        lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

        lg_x2s = [55, 65, 75, 115, 400];
        lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

        lg_y2s = [65, 75, 85, 100, 115];
        lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
    }
 
    skip_rapunzel = false;
    
    // >>> SHORT HAIR FX
    sh_hair_1_type = int(random(1, 3)); // 1 line, 2 arc
    sh_hair_2_type = int(random(1, 3)); // 1 line, 2 arc
    dots_3 = int(random(0, 2)); // 1 ON, else OFF
    dots_4 = int(random(0, 3)); // 1 ON, else OFF

    // LINES
    if (sh_hair_1_type == 1 || sh_hair_2_type == 1) {
        
        sh_we1s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_1 = sh_we1s[int(random(0, sh_we1s.length))];

        sh_we2s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_2 = sh_we2s[int(random(0, sh_we2s.length))];

        sh_hairs_1 = 1;
        sh_hairs_2 = int(random(1, 3)); // 1 ON, 2 OFF

        sh_hair_x1 = int(random(5, 20));
        sh_hair_y1 = int(random(5, 20));
        sh_hair_x2 = int(random(5, 20));
        sh_hair_y2 = int(random(5, 20));
    }
    // ARCS
    else if (sh_hair_1_type == 2 || sh_hair_2_type == 2) {
        
        sh_we1s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_1 = sh_we1s[int(random(0, sh_we1s.length))];

        sh_we2s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_2 = sh_we2s[int(random(0, sh_we2s.length))];

        sh_hairs_1 = 1;
        sh_hairs_2 = int(random(1, 3)); // 1 ON, 2 OFF

        sh_hair_x1 = int(random(5, 16));
        sh_hair_y1 = int(random(5, 16));
        sh_hair_x2 = int(random(5, 16));
        sh_hair_y2 = int(random(5, 16));
    }
    
    
    // >>> WEIGHTS AND OPACITIES
    // WEIGHTS FOR DOTS
    we1s = [0.10, 0.11, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.185];
    st_we_1 = we1s[int(random(0, we1s.length))];

    we2s = [0.10, 0.11, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.185];
    st_we_2 = we2s[int(random(0, we2s.length))];

    if (is_Black_1 == true || is_Black_2 == true || is_Red_2 == true || is_Blue_2 == true || is_Yellow_2 == true) {
        opa_min = 75;
        opa_max = 145;
    }
    else {
        opa_min = 65;
        opa_max = 80; 
    }

    f_alpha_1 = int(random(opa_min, opa_max));
    f_alpha_2 = int(random(opa_min, opa_max));
    f_alpha_3 = int(random(opa_min, opa_max));
    
    f_alpha_4 = int(random(opa_min, opa_max));
    f_alpha_5 = int(random(opa_min, opa_max));
    f_alpha_6 = int(random(opa_min, opa_max));
    
    // STROKE OPACITY
    if (is_bg_black == true) {
        s_opa = int(random(13, 26));  
    }
    else {
        s_opa = int(random(13, 21));
    }
    
    // BLEND MODE: 1 NORMAL, 2 SCREEN, 3 LIGHTEST | used in long hair fx
    blend_type_1 = 2;
    blend_type_2 = 2;
    
    
    // >>> BRUSH: SHAPE, THICKNESS & ROTATION
    // ROT
    if (lg_hair_1_type == 1) {
        movs = [2, 5, 4, 6, 2];
    }
    else if (lg_hair_1_type == 2) {
        movs = [5]; 
    }
    brush_mov = movs[int(random(0, movs.length))];
    
    // THICKNESS
    accent_type = int(random(1, 6));
    
    // medium
    if (accent_type == 1) {
        accent_x = int(random(0, 5)); 
        accent_y = int(random(3, 10)); 
        accent_type_string = 'medium'
    }
    // thin
    else {
        accent_x = int(random(0, 3)); 
        accent_y = int(random(0, 3)); 
        accent_type_string = 'thin'
    }
    
    // FOR SHAPES
    c_max = int(random(4, 7)); // used in shape 1: circles
    o_x_min = int(random(2, 5)); // used in shape 2: ovals
    o_x_max = int(random(7, 6)); // used in shape 2: ovals
    o_y_min = int(random(2, 6)); // used in shape 2: ovals
    o_y_max = int(random(4, 8)); // used in shape 2: ovals
    r_x_max = int(random(1, 6)); // used in shape 3: rects
    r_y_max = int(random(5, 21)); // used in shape 3: rects
    t_y_1 = int(random(2, 10)); // used in shape 4: small tri
    t_y_2 = int(random(8, 19)); // used in shape 5: mixed tri
    t_x_1 = int(random(2, 7)); // used in shape 6: big tri
    r_x_1 = int(random(5, 21)); // used in shape 7: long thin rects

    // 1: circles, 2: ovals, 3: rects, 4: tri small, 5: tri mixed, 6: tri big, 7: rects long
    let shapes = [1, 2, 3, 4, 4, 5, 5, 6, 7, 7];
    which_shape = shapes[int(random(0, shapes.length))];
    
    
    // >>> FRONTERA
    frontera = 30;
    
    // >>> DRAW LOOP DURATION
    which_stop = int(random(1, 3));
    
    // short
    if (which_stop == 1 && my_maxforce <= 1.4 && my_coh_mult > 1.17) {
        myStops = [425, 450, 500, 500, 550, 550, 550, 575, 600, 600, 650]; 
        myStop_string = 'short';
    }
    // short
    if (which_stop == 1 && my_maxforce > 1.4 && my_maxforce <= 1.8) {
        myStops = [600, 615, 650, 650, 650, 675, 675, 685, 700, 700, 700, 705, 715, 725, 730]; 
        myStop_string = 'short';
    }
    // medium
    else if (which_stop == 2) {
        myStops = [700, 700, 700, 715, 730, 735, 750, 750, 765, 775, 785, 800, 800, 850, 900, 1000]; 
        myStop_string = 'medium';
    }
    // medium
    else {
        myStops = [600, 615, 625, 650, 650, 685, 685, 700, 700, 700, 705, 710, 715, 725, 800]; 
        myStop_string = 'medium';
    }
    
    myStop = myStops[int(random(0, myStops.length))];
}

// MOV_3 from dev5.5
function mov_3_dev5() {
    initial_boids = 40;
    boids_start = int(random(1, 4));
    
    // >>> FLOCKING CONTROLS
    branches = [1, 1, 1, 2, 1, 2, 1, 1, 1, 1]; // 1 loopy, 2 straight
    branch_type = branches[int(random(0, branches.length))];
    
    if (branch_type == 1) {
        maxspeed = [21.2, 21.5, 22, 22.5, 22.8, 23, 23.5, 23.7, 24, 24.5, 24.9, 24.9, 25, 25.3]; 
        my_maxspeed = maxspeed[int(random(0, maxspeed.length))];
        
        maxforce = [1, 1.03, 1.04, 1.05, 1.06, 1.07, 1.08, 1.09, 1.1, 1.11, 1.12, 1.13, 1.135, 1.14];
        my_maxforce = maxforce[int(random(0, maxforce.length))];
        
        sep_mult = [0.0075, 0.01, random(0.01, 0.045), 0.045, 0.05, 0.055, 0.055, 0.055];
        my_sep_mult = sep_mult[int(random(0, sep_mult.length))];
        
        ali_mult = [0.94, 0.95, random(0.95, 0.97), 0.97, 0.98, 1];
        my_ali_mult = ali_mult[int(random(0, ali_mult.length))];
        
        coh_mult = [2.35, 2.4, 2.45, 2.47, 2.5, random(2.5, 2.55), 2.55, 2.6, 2.65, random(2.65, 2.7), 2.7, 2.7, 2.7, 2.73, 2.75];
        my_coh_mult = coh_mult[int(random(0, coh_mult.length))];
        
        my_desiredseparation = int(random(-10, 0)) * 10;
        
        neigh_1 = [800, 1500, 5000, 6000, 7000, 9000, 9000, 9000, 10000];
        my_neighbordist_1 = neigh_1[int(random(0, neigh_1.length))];
        
        neigh_2 = [700, 800, 5000, 10000, 50000, 50000, 50000];
        my_neighbordist_2 = neigh_2[int(random(0, neigh_2.length))];
    }
    else if (branch_type == 2) {
        maxspeed = [23, 23.5, 23.7, 24, 24.5, 24.9, 25, 25.3, 25.5]; 
        my_maxspeed = maxspeed[int(random(0, maxspeed.length))];
        
        maxforce = [1.05, 1.1, 1.11, 1.12, random(1.12, 1.15), 1.15, 1.171, 1.181, 1.2, 1.21, 1.3, 1.35];
        my_maxforce = maxforce[int(random(0, maxforce.length))];
        
        sep_mult = [0.03, 0.055, 0.057, 0.06, 0.061, random(0.061, 0.07), 0.07];
        my_sep_mult = sep_mult[int(random(0, sep_mult.length))];
        
        ali_mult = [1, 1.001, 1.01, 1.02, random(1.02, 1.03), 1.03, 1.05];
        my_ali_mult = ali_mult[int(random(0, ali_mult.length))];
        
        coh_mult = [2.85, 2.9, 2.95, 3, random(3, 3.05), 3.05, 3.1];
        my_coh_mult = coh_mult[int(random(0, coh_mult.length))];
        
        my_desiredseparation = -10;
        
        my_neighbordist_1 = int(random(6, 10)) * 1000;
        my_neighbordist_2 = int(random(10, 20)) * 1000;
    }
    
    // >>> FLOCKING CONTROLS
    acce_x1s = [-8000, -6000, -4000, -2000, 2000, 4000, 6000, 8000, 8000, 8000];
    my_acceleration_x1 = acce_x1s[int(random(0, acce_x1s.length))];
    
    acce_y1s = [-8000, -6000, -4000, -2000, 2000, 2000, 2000, 4000, 6000, 8000];
    my_acceleration_y1 = acce_y1s[int(random(0, acce_y1s.length))];

    vel_xs = [-3000, -2000, -1000, -1, 1, 1000, 2000, 2000, 2000, 3000];
    my_vel_x = vel_xs[int(random(0, vel_xs.length))];
    
    loc_mult = [-0.45, -0.4, -0.2, -0.1, -0.05, -0.03, -0.009, -0.007, -0.005, -0.001, 0, 0.001];
    my_loc_mult = loc_mult[int(random(0, loc_mult.length))];
    
    steers = [-5000, -3000, -2000, -1000, -1, 0, 1, 1000]
    my_steer = steers[int(random(0, steers.length))];

    rads = [75, 100, 150, 200, 250, 350, 400, 500, 550, 750, 1000, 1250, 1333, 1500, 1600, 1750, 1800, 1900];
    radius = rads[int(random(0, rads.length))];
    
    rad_incs = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4]
    rad_inc = rad_incs[int(random(0, rad_incs.length))];
    
    ang = 0; 
    
    speeds = [0.045, 0.05, 0.1, 0.15, 0.2, 0.2, 0.2, 0.25, 0.3, 0.8]; 
    speed = speeds[int(random(0, speeds.length))];
    
    centerX = size/2;
    centerY = size/2; 
    
    // >>> LONG HAIR FX
    // ON/OFF: 1 ON, else OFF
    if (is_bg_black == true) {
        rapunzels = [1, 1, 1, 1, 2];
        rapunzel = rapunzels[int(random(0, rapunzels.length))];   
    }
    else if (is_bg_white == true) {
        rapunzel = 0;  
    }
    else {
        rapunzels = [1, 1, 2, 2, 2];
        rapunzel = rapunzels[int(random(0, rapunzels.length))];   
    }

    // TYPES: 1 lines, 2 arcs
    lg_hair_types = [1, 1, 2, 2];
    lg_hair_1_type = lg_hair_types[int(random(0, lg_hair_types.length))];
    lg_hair_2_type = lg_hair_1_type;

    dots_1 = 1; // 1 ON, else OFF
    dots_2 = int(random(0, 2)); // 1 ON, else OFF

    arc_1_types = [1, 1, 2, 3, 1];
    arc_1_type = arc_1_types[int(random(0, arc_1_types.length))];
    arc_1_x = int(random(-3, 4));
    arc_1_y = int(random(-3, 4));
    arc_1_x2 = int(random(5, 16));
    arc_1_y2 = int(random(45, 71));

    arc_2_types = [1, 2, 3, 3, 1];
    arc_2_type = arc_2_types[int(random(0, arc_2_types.length))];
    arc_2_x = int(random(-2, 3)) * 10;
    arc_2_y = int(random(-3, 4)) * 100;
    
    // LINES
    if (rapunzel == 1 && lg_hair_1_type == 1 || rapunzel == 1 && lg_hair_2_type == 1) {
        // LONG HAIR 1
        lg_hairs_1 = 1; // 1 ON, 2 OFF

        if (is_bg_black == true) {
            lg_we1s = [0.063, 0.064, 0.065]; 
        }
        else {
            lg_we1s = [0.063, 0.064, 0.065];
        }
        lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

        lg_x1s = [250, 300, 500, 700, 900];
        lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

        lg_y1s = [75, 85, 100, 150, 175, 250, 500];
        lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
        
        // LONG HAIR 2
        let h2_switch = [1, 1, 1, 0, 0];
        lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

        if (is_bg_black == true) {
            lg_we2s = [0.061, 0.062, 0.063];
        }
        else {
            lg_we2s = [0.061, 0.062, 0.063];
        }
        lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

        lg_x2s = [100, 150, 200, 300, 400];
        lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

        lg_y2s = [75, 95, 125, 200, 300];
        lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
    }
    // ARCS
    if (rapunzel == 1 && lg_hair_1_type == 2 || rapunzel == 1 && lg_hair_2_type == 2) {
    // LONG HAIR 1
        lg_hairs_1 = 1; // 1 ON, 2 OFF

        if (is_bg_black == true) {
            lg_we1s = [0.064, 0.065, 0.066];
        }
        else {
            lg_we1s = [0.062, 0.063, 0.064];
        }
        lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

        lg_x1s = [55, 60, 150, 200, 250, 300, 350, 500, 550, 600];
        lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

        lg_y1s = [55, 65, 75, 85, 95, 100, 115];
        lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];

        // LONG HAIR 2
        let h2_switch = [1, 1, 1, 1, 0, 1];
        lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

        if (is_bg_black == true) {
            lg_we2s = [0.062, 0.063, 0.064, 0.065];
        }
        else {
            lg_we2s = [0.061, 0.062, 0.063];
        }
        lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

        lg_x2s = [55, 65, 115, 150, 200, 250, 300, 400];
        lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

        lg_y2s = [65, 75, 85, 100, 115];
        lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
    } 
    
    skip_rapunzel = false;
    
    // >>> SHORT HAIR FX
    sh_hair_1_type = int(random(1, 3)); // 1 line, 2 arc
    sh_hair_2_type = int(random(1, 3)); // 1 line, 2 arc
    dots_3 = int(random(0, 2)); // 1 ON, else OFF
    dots_4 = int(random(0, 3)); // 1 ON, else OFF

    // LINES
    if (sh_hair_1_type == 1 || sh_hair_2_type == 1) {
        
        sh_we1s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_1 = sh_we1s[int(random(0, sh_we1s.length))];

        sh_we2s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_2 = sh_we2s[int(random(0, sh_we2s.length))];

        sh_hairs_1 = 1;
        sh_hairs_2 = int(random(1, 3)); // 1 ON, 2 OFF

        sh_hair_x1 = int(random(5, 20));
        sh_hair_y1 = int(random(5, 20));
        sh_hair_x2 = int(random(5, 20));
        sh_hair_y2 = int(random(5, 20));
    }
    // ARCS
    else if (sh_hair_1_type == 2 || sh_hair_2_type == 2) {
        
        sh_we1s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_1 = sh_we1s[int(random(0, sh_we1s.length))];

        sh_we2s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_2 = sh_we2s[int(random(0, sh_we2s.length))];

        sh_hairs_1 = 1;
        sh_hairs_2 = int(random(1, 3)); // 1 ON, 2 OFF

        sh_hair_x1 = int(random(5, 16));
        sh_hair_y1 = int(random(5, 16));
        sh_hair_x2 = int(random(5, 16));
        sh_hair_y2 = int(random(5, 16));
    }
    
    
    // >>> WEIGHTS AND OPACITIES
    // WEIGHTS FOR DOTS
    we1s = [0.10, 0.11, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.185];
    st_we_1 = we1s[int(random(0, we1s.length))];

    we2s = [0.10, 0.11, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.185];
    st_we_2 = we2s[int(random(0, we2s.length))];
    
    // FILL OPACITITES
    if (is_Black_1 == true || is_Black_2 == true || is_Red_2 == true || is_Blue_2 == true || is_Yellow_2 == true) {
        opa_min = 75;
        opa_max = 145;
    }
    else {
        opa_min = 65;
        opa_max = 80; 
    }

    f_alpha_1 = int(random(opa_min, opa_max));
    f_alpha_2 = int(random(opa_min, opa_max));
    f_alpha_3 = int(random(opa_min, opa_max));
    
    f_alpha_4 = int(random(opa_min, opa_max));
    f_alpha_5 = int(random(opa_min, opa_max));
    f_alpha_6 = int(random(opa_min, opa_max));
    
    // STROKE OPACITY
    if (is_bg_black == true) {
        s_opa = int(random(13, 26));  
    }
    else {
        s_opa = int(random(13, 21));
    }
    
    // BLEND MODE: 1 NORMAL, 2 SCREEN, 3 LIGHTEST | used in long hair fx
    blend_type_1 = 2;
    blend_type_2 = 2;
    
    
    
    // >>> BRUSH: SHAPE, THICKNESS & ROTATION
    // ROT
    if (lg_hair_1_type == 1) {
        movs = [2, 2, 3, 4, 6];
    }
    else if (lg_hair_1_type == 2) {
        movs = [3, 5]; 
    }
    brush_mov = movs[int(random(0, movs.length))];

    // THICKNESS
    accent_type = int(random(1, 4));
    
    // medium
    if (accent_type == 1) {
        accent_x = int(random(0, 5)); 
        accent_y = int(random(2, 6)); 
        accent_type_string = 'medium'
    }
    // thin
    else {
        accent_x = int(random(0, 3)); 
        accent_y = int(random(0, 3)); 
        accent_type_string = 'thin'
    }
    
    // FOR SHAPES
    c_max = int(random(5, 9)); // used in shape 1: circles
    o_x_min = int(random(3, 7)); // used in shape 2: ovals
    o_x_max = int(random(6, 10)); // used in shape 2: ovals
    o_y_min = int(random(3, 7)); // used in shape 2: ovals
    o_y_max = int(random(6, 10)); // used in shape 2: ovals
    r_x_max = int(random(3, 7)); // used in shape 3: rects
    r_y_max = int(random(5, 21)); // used in shape 3: rects
    t_y_1 = int(random(2, 10)); // used in shape 4: small tri
    t_y_2 = int(random(8, 19)); // used in shape 5: mixed tri
    t_x_1 = int(random(2, 5)); // used in shape 6: big tri
    r_x_1 = int(random(7, 21)); // used in shape 7: long thin rects

    // 1: circles, 2: ovals, 3: rects, 4: tri small, 5: tri mixed, 6: tri big, 7: rects long
    let shapes = [1, 2, 3, 4, 4, 5, 5, 6, 7, 7];
    which_shape = shapes[int(random(0, shapes.length))];
    
    
    // >>> FRONTERA
    if (accent_type == 1) {
        frontera = 33; 
    }
    else {
        frontera = 30;     
    }
    
    
    // >>>DRAW LOOP DURATION
    which_stop = int(random(1, 6));
    
    // short
    if (which_stop == 1 || which_stop == 3) {
        myStops = [750, 800, 850]; 
        myStop_string = 'short';
    }
    // long
    else if (which_stop == 2) {
        myStops = [1000, 1025, 1050]; 
        myStop_string = 'long';
    }
    // medium
    else {
        myStops = [875, 900, 925, 950, 975, 985]; 
        myStop_string = 'medium';
    }

    myStop = myStops[int(random(0, myStops.length))];
}

// MOV_4 from dev9
function mov_4_dev9() {
    initial_boids = 30;
    boids_start = int(random(1, 4)); // 3 is the favorite, trying 1&2

    // >>> FLOCKING CONTROLS
    maxspeed = [24.1, 24.15, 24.25, 24.3, 24.5, 24.75, 25, 25, 25, 25.3, 25.5, 25.7, 26, 26, 26, 26.5, 26.8, 27, 27, 27, 27.2, 27.3, 27.5];
    my_maxspeed = maxspeed[int(random(0, maxspeed.length))];

    sep_mult = [0.71, 0.72, 0.73, 0.733, 0.735, 0.737, 0.74, 0.75, 0.76, 0.77, 0.78, 0.8, 0.83, 0.85, 0.87, 0.9, 0.91, 0.93, 0.95, 0.97, 1, 1, 1.03, 1.05];
    my_sep_mult = sep_mult[int(random(0, sep_mult.length))];
    
    ali_mult = [0.5, 0.55, 0.6, 0.6, 0.65, 1, 1, 1, 1.5, 2, 2.5, 2.7, 3, 3, 4, 4, 4.5, 4.8, 5, 5];
    my_ali_mult = ali_mult[int(random(0, ali_mult.length))];
    
    coh_mult = [1.2, 1.21, 1.22, 1.23, 1.25, 1.25, 1.257, 1.27, 1.27, 1.275, 1.28, 1.3, 1.31, random(1.3, 1.33), 1.33, 1.35];
    my_coh_mult = coh_mult[int(random(0, coh_mult.length))];
    
    my_desiredseparation = 0;
    
    neigh_1 = [0, 0.001, 0.01];
    my_neighbordist_1 = neigh_1[int(random(0, neigh_1.length))];
    
    neigh_2 = [475, 485, 500, 500, 525, 550, 550, 550, 575, 600, 650, 650, 700, 700, 725, 735];
    my_neighbordist_2 = neigh_2[int(random(0, neigh_2.length))];

    my_acceleration_x1 = int(random(-10, 10)) * 10;
    my_acceleration_y1 = int(random(-10, 10)) * 10;

    vel_xs = [-500, -600, -700, -800];
    my_vel_x = vel_xs[int(random(0, vel_xs.length))];
    
    if (is_bg_black == true) {
        loc_mult = [-0.45, -0.4, -0.25, -0.2, -0.15, -0.1, -0.1, -0.09, -0.09, -0.07, -0.05, -0.008, -0.005, -0.005, -0.003, -0.001, 0, 0, 0, 0.05, 0.1, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5];  
    }
    else {
        loc_mult = [-0.08, -0.07, -0.05, -0.03, -0.01, -0.008, -0.005, -0.003, -0.001, 0, 0, 0, 0, 0.05, 0.1, 0.2, 0.3];
    }
    my_loc_mult = loc_mult[int(random(0, loc_mult.length))];
    
    steers = [-900, -800, -700, -600, -500, 1];
    my_steer = steers[int(random(0, steers.length))];
    
    if (my_loc_mult <= -0.2) {
        maxforce = [4, 4, 4.5, 5, 5, 5.5, 6, 6.5, 7, 7, 7.5];  
    }
    else {
        maxforce = [4, 4, 4.5, 5, 5, 5.5, 6, 6.5, 6.7, 7, 7, 7.3, 7.5, 7.7, 8, 8, 8.5];  
    } 
    my_maxforce = maxforce[int(random(0, maxforce.length))];
    
    loop_type = 2;
    follow_mode = int(random(1, 5)); // 1 = normal, 2 = inv x, 3 = inv y, 4 = inv xy

    rads = [100, 150, 175, 185, 200, 215, 250, 285, 295, 300, 333, 363, 400, 444, 484, 500, 515, 550];
    radius = rads[int(random(0, rads.length))];
    
    rad_incs = [0.1, 0.13, 0.15, 0.2, 0.23, 0.25, 0.28, 0.3, 0.33, 0.35];
    rad_inc = rad_incs[int(random(0, rad_incs.length))];
    
    rad_mult_x = int(random(0, 4));
    rad_mult_y = int(random(0, 5));
    
    ang = 0; 
    
    speeds = [0.02, 0.025, 0.03, 0.035, 0.04, 0.045, 0.05, 0.055, 0.06]; 
    speed = speeds[int(random(0, speeds.length))];
    
    centerX = size/2;
    centerY = size/2;

    // >>> LONG HAIR FX
    // ON/OFF: 1 ON, else OFF
    if (is_bg_black == true) {
        rapunzels = [1, 1, 2, 1, 2];
        rapunzel = rapunzels[int(random(0, rapunzels.length))];   
    }
    else if (is_bg_white == true) {
        rapunzel = 0;  
    }
    else {
        rapunzels = [1, 1, 2, 2, 2];
        rapunzel = rapunzels[int(random(0, rapunzels.length))];   
    }

    // TYPES: 1 lines, 2 arcs
    lg_hair_types = [1, 1, 2, 2, 2];
    lg_hair_1_type = lg_hair_types[int(random(0, lg_hair_types.length))];
    lg_hair_2_type = lg_hair_1_type;

    dots_1 = 1; // 1 ON, else OFF
    dots_2 = int(random(0, 2)); // 1 ON, else OFF

    arc_1_types = [1, 1, 2, 3, 1];
    arc_1_type = arc_1_types[int(random(0, arc_1_types.length))];
    arc_1_x = int(random(-3, 4));
    arc_1_y = int(random(-3, 4));
    arc_1_x2 = int(random(5, 16));
    arc_1_y2 = int(random(45, 71));

    arc_2_types = [1, 2, 3, 3, 1];
    arc_2_type = arc_2_types[int(random(0, arc_2_types.length))];
    arc_2_x = int(random(-2, 3)) * 10;
    arc_2_y = int(random(-3, 4)) * 100;
    
    // LINES
    if (rapunzel == 1 && lg_hair_1_type == 1 || rapunzel == 1 && lg_hair_2_type == 1) {
        // LONG HAIR 1
        lg_hairs_1 = 1; // 1 ON, 2 OFF

        if (is_bg_black == true) {
            lg_we1s = [0.06, 0.065, 0.07, 0.08];
        }
        else {
            lg_we1s = [0.07, 0.08, 0.095];
        }
        lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

        lg_x1s = [100, 150, 200, 300, 600, 650];
        lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

        lg_y1s = [75, 85, 100, 150, 175, 250, 500];
        lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];
        
        // LONG HAIR 2
        let h2_switch = [1, 1, 1, 0, 0];
        lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

        if (is_bg_black == true) {
            lg_we2s = [0.06, 0.065, 0.07, 0.08];
        }
        else {
            lg_we2s = [0.065, 0.07, 0.08, 0.09];
        }
        lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

        lg_x2s = [100, 150, 200, 300, 400];
        lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

        lg_y2s = [75, 95, 125, 200, 300];
        lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
    }
    // ARCS
    if (rapunzel == 1 && lg_hair_1_type == 2 || rapunzel == 1 && lg_hair_2_type == 2) {
    // LONG HAIR 1
        lg_hairs_1 = 1; // 1 ON, 2 OFF

        if (is_bg_black == true) {
            lg_we1s = [0.06, 0.061, 0.062, 0.065, 0.067];
        }
        else {
            lg_we1s = [0.06, 0.065, 0.07, 0.075];
        }
        lg_st_we_1 = lg_we1s[int(random(0, lg_we1s.length))];

        lg_x1s = [55, 60, 100, 125, 150, 175, 200, 225, 250, 300, 350, 400, 500, 550, 600];
        lg_hair_x1 = lg_x1s[int(random(0, lg_x1s.length))];

        lg_y1s = [55, 65, 75, 85, 95, 100, 115];
        lg_hair_y1 = lg_y1s[int(random(0, lg_y1s.length))];

        // LONG HAIR 2
        let h2_switch = [1, 1, 1, 1, 0, 1];
        lg_hairs_2 = h2_switch[int(random(0, h2_switch.length))]; // 1 ON, else OFF

        if (is_bg_black == true) {
            lg_we2s = [0.06, 0.061, 0.062, 0.065, 0.067];
        }
        else {
            lg_we2s = [0.06, 0.065, 0.07, 0.075];
        }
        lg_st_we_2 = lg_we2s[int(random(0, lg_we2s.length))];

        lg_x2s = [55, 60, 100, 125, 150, 175, 200, 225, 250, 300, 350, 400];
        lg_hair_x2 = lg_x2s[int(random(0, lg_x2s.length))];

        lg_y2s = [65, 75, 85, 100, 115];
        lg_hair_y2 = lg_y2s[int(random(0, lg_y2s.length))];
    }
    
    skip_rapunzel = false;
    
    // >>> SHORT HAIR FX
    sh_hair_1_type = int(random(1, 3)); // 1 line, 2 arc
    sh_hair_2_type = int(random(1, 3)); // 1 line, 2 arc
    dots_3 = int(random(0, 2)); // 1 ON, else OFF
    dots_4 = int(random(0, 3)); // 1 ON, else OFF

    // LINES
    if (sh_hair_1_type == 1 || sh_hair_2_type == 1) {
        
        sh_we1s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_1 = sh_we1s[int(random(0, sh_we1s.length))];

        sh_we2s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_2 = sh_we2s[int(random(0, sh_we2s.length))];

        sh_hairs_1 = 1;
        sh_hairs_2 = int(random(1, 3)); // 1 ON, 2 OFF

        sh_hair_x1 = int(random(5, 20));
        sh_hair_y1 = int(random(5, 20));
        sh_hair_x2 = int(random(5, 20));
        sh_hair_y2 = int(random(5, 20));
    }
    // ARCS
    else if (sh_hair_1_type == 2 || sh_hair_2_type == 2) {
        
        sh_we1s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_1 = sh_we1s[int(random(0, sh_we1s.length))];

        sh_we2s = [0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.3];
        sh_st_we_2 = sh_we2s[int(random(0, sh_we2s.length))];

        sh_hairs_1 = 1;
        sh_hairs_2 = int(random(1, 3)); // 1 ON, 2 OFF

        sh_hair_x1 = int(random(5, 16));
        sh_hair_y1 = int(random(5, 16));
        sh_hair_x2 = int(random(5, 16));
        sh_hair_y2 = int(random(5, 16));
    }
    
    
    // >>> WEIGHTS AND OPACITIES
    // WEIGHTS FOR DOTS
    we1s = [0.10, 0.11, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.185];
    st_we_1 = we1s[int(random(0, we1s.length))];

    we2s = [0.10, 0.11, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.185];
    st_we_2 = we2s[int(random(0, we2s.length))];

    if (is_Black_1 == true || is_Black_2 == true || is_Red_2 == true || is_Blue_2 == true || is_Yellow_2 == true) {
        opa_min = 75;
        opa_max = 145;
    }
    else {
        opa_min = 65;
        opa_max = 80; 
    }

    f_alpha_1 = int(random(opa_min, opa_max));
    f_alpha_2 = int(random(opa_min, opa_max));
    f_alpha_3 = int(random(opa_min, opa_max));
    
    f_alpha_4 = int(random(opa_min, opa_max));
    f_alpha_5 = int(random(opa_min, opa_max));
    f_alpha_6 = int(random(opa_min, opa_max));
    
    // STROKE OPACITY
    s_opa = int(random(10, 17));
    
    // BLEND MODE: 1 NORMAL, 2 SCREEN, 3 LIGHTEST | used in long hair fx
    blend_type_1 = 2;
    blend_type_2 = 2;
    
    
    // >>> BRUSH: SHAPE, THICKNESS & ROTATION
    // ROT
    movs = [2, 3, 4, 5, 6]; 
    brush_mov = movs[int(random(0, movs.length))];
    
    // THICKNESS
    accent_type = int(random(1, 4));
    
    // medium
    if (accent_type == 1) {
        accent_x = int(random(0, 5)); 
        accent_y = int(random(0, 8)); 
        accent_type_string = 'medium'
    }
    // thin
    else {
        accent_x = int(random(0, 4)); 
        accent_y = int(random(0, 4)); 
        accent_type_string = 'thin'
    }
    
    // FOR SHAPES
    c_max = int(random(4, 9)); // used in shape 1: circles
    o_x_min = int(random(2, 5)); // used in shape 2: ovals
    o_x_max = int(random(7, 6)); // used in shape 2: ovals
    o_y_min = int(random(2, 6)); // used in shape 2: ovals
    o_y_max = int(random(4, 8)); // used in shape 2: ovals
    r_x_max = int(random(1, 6)); // used in shape 3: rects
    r_y_max = int(random(5, 21)); // used in shape 3: rects
    t_y_1 = int(random(2, 10)); // used in shape 4: small tri
    t_y_2 = int(random(8, 19)); // used in shape 5: mixed tri
    t_x_1 = int(random(1, 5)); // used in shape 6: big tri
    r_x_1 = int(random(5, 21)); // used in shape 7: long thin rects

    // 1: circles, 2: ovals, 3: rects, 4: tri small, 5: tri mixed, 6: tri big, 7: rects long
    let shapes = [1, 1, 2, 3, 4, 4, 5, 6, 7, 7];
    which_shape = shapes[int(random(0, shapes.length))];
    
    
    // >>> FRONTERA
    frontera = 30;
     
    
    // >>> DRAW LOOP DURATION
    which_stop = int(random(2, 5));
    
    // short
    if (which_stop == 1 && my_loc_mult != -0.7) {
        myStops = [1175, 1200, 1225]; 
        myStop_string = 'short';
    }
    // long
    else if (which_stop == 2 || my_loc_mult == -0.7) {
        myStops = [1500, 1600, 1650, 1700]; 
        myStop_string = 'long';  
    }
    // medium
    else {
        myStops = [1200, 1250, 1300, 1350, 1400, 1450]; 
        myStop_string = 'medium';
    }

    myStop = myStops[int(random(0, myStops.length))];
}


// >>> BACKGROUNDS AND PALETTES <<<
function my_backgrounds() {
    push();
    // BLACK
    if (which_bg <= 0.76) {
        fill(5);
        is_bg_black = true;
    }
    // WHITE 
    else if (which_bg > 0.76 && which_bg <= 0.9) {
        fill(253, 251, 252);
        is_bg_white = true;
    }
    // BLUE
    else if (which_bg > 0.9 && which_bg <= 0.92) {
        fill(84, 203, 255);
        is_bg_blue = true;
    }
    // RED
    else if (which_bg > 0.92 && which_bg <= 0.98) {
        fill(239, 0, 0);
        is_bg_red = true;
    }
    // YELLOW
    else if (which_bg > 0.98) {
        fill(255, 224, 82);
        is_bg_yellow = true;
    }
    noStroke();
    rect(0, 0, width, height);
    pop();
}


function printToConsole() {
    console.log('INIT PD: ' + pd);
    
    if (draw_mode == 1) {
        console.log('DRAW MODE: FRANZ');
    }
    else if (draw_mode == 2) {
        console.log('DRAW MODE: FRANZ (thin)');
    }
    else if (draw_mode == 3) {
        console.log('DRAW MODE: FRANZ (old)');
    }
    else if (draw_mode == 4) {
        console.log('DRAW MODE: BRANCHES (old)');
    }
    else if (draw_mode == 5) {
        console.log('DRAW MODE: BRANCHES (new)');
    }
    else if (draw_mode == 6) {
        console.log('DRAW MODE: CIRCLES/LOOPS (no borders)');
    }
    else if (draw_mode == 7) {
        console.log('DRAW MODE: MOV_1 from dev5.5');
    }
    else if (draw_mode == 8) {
        console.log('DRAW MODE: MOV_2 from dev5.5');
    }
    else if (draw_mode == 9) {
        console.log('DRAW MODE: MOV_3 from dev5.5');
    }
    else if (draw_mode == 10) {
        console.log('DRAW MODE: MOV_4 from dev9');
    }
    
    console.log('INIT BOIDS: ' + initial_boids);
    console.log('BOIDS START: ' + boids_start);
    
    if (draw_mode == 1 || draw_mode == 3) {
        console.log('FREE MODE: ' + free_mode);
        console.log('S MODE: ' + s_mode);
    }
    else if (draw_mode == 2) {
        console.log('FREE MODE: ' + free_mode);
        console.log('S MODE: ' + s_mode);  
        console.log('ICON V: ' + icon_v);
    }
    else if (draw_mode == 4 || draw_mode == 8 || draw_mode == 9) {
        console.log('BRANCH TYPE: ' + branch_type);
    }
    else if (draw_mode == 6) {
        console.log('LOOP TYPE: ' + loop_type);
            // L1
            if (loop_type == 1 && l1_v == 1) {
                console.log('L1 V: 1');
            }
            else if (loop_type == 1 && l1_v == 2) {
                console.log('L1 V: 2');
            }
            else if (loop_type == 1 && l1_v == 3) {
                console.log('L1 V: 3');
            }
            // L2
            else if (loop_type == 2 && l2_type == 1) {
                console.log('L2 T: 1');
            }
            else if (loop_type == 2 && l2_type == 2) {
                console.log('L2 T: 2');
            }
            else if (loop_type == 2 && l2_type == 3) {
                console.log('L2 T: 3');
            }
            if (loop_type == 2 && l2_v == 1) {
                console.log('L2 V: 1');
            }
            else if (loop_type == 2 && l2_v == 2) {
                console.log('L2 V: 2');
            }
            else if (loop_type == 2 && l2_v == 3) {
                console.log('L2 V: 3');
            }
            else if (loop_type == 2 && l2_v == 4) {
                console.log('L2 V: 4');
            }
            // L3
            else if (loop_type == 3 && l3_v == 1) {
                console.log('L3 V: 1');
            }
            else if (loop_type == 3 && l3_v == 2) {
                console.log('L3 V: 2');
            }
            // L5
            else if (loop_type == 5 && l5_type == 1) {
                console.log('L5 T: 1');
            }
            else if (loop_type == 5 && l5_type == 2) {
                console.log('L5 T: 2');
            }
            else if (loop_type == 5 && l5_type == 3) {
                console.log('L5 T: 3');
            }
            if (loop_type == 5 && l5_v == 1) {
                console.log('L5 V: 1');
            }
            else if (loop_type == 5 && l5_v == 2) {
                console.log('L5 V: 2');
            }
            // L6
            else if (loop_type == 6) {
                console.log('L6 V: ' + l6_v);
            }
            // L7
            else if (loop_type == 7 && l7_v == 1) {
                console.log('L7 V: 1');
            }
            else if (loop_type == 7 && l7_v == 2) {
                console.log('L7 V: 2');
            }
            else if (loop_type == 7 && l7_v == 3) {
                console.log('L7 V: 3');
            }
            else if (loop_type == 7 && l7_v == 4) {
                console.log('L7 V: 4');
            }
            else if (loop_type == 7 && l7_v == 5) {
                console.log('L7 V: 5');
            }
            else if (loop_type == 7 && l7_v == 6) {
                console.log('L7 V: 6');
            }
            // L8
            else if (loop_type == 8 && l8_v == 1) {
                console.log('L8 V: 1');
            }
            else if (loop_type == 8 && l8_v == 2) {
                console.log('L8 V: 2');
            }
        console.log('S MODE: ' + s_mode);
    }
    else if (draw_mode == 7) {
        console.log('FREE MODE: ' + free_mode);
        console.log('FOLLOW MODE: ' + follow_mode);
    }
    
    console.log('STOP: ' + myStop_string);
    console.log('STOP CYCLES: ' + myStop);
    console.log('BRUSH ROT: ' + brush_mov);
    console.log('ROT DIV: ' + rot_div);
    console.log('COUNTER: ' + counter_vals[pick_counter_val]);

    console.log('FRONTERA: ' + frontera);
    console.log('MAX SPEED: ' + my_maxspeed);
    console.log('MAX FORCE: ' + my_maxforce);
    console.log('SEP MULT: ' + my_sep_mult);
    console.log('ALI MULT: ' + my_ali_mult);
    console.log('COH MULT: ' + my_coh_mult);
    console.log('DES SEPA: ' + my_desiredseparation);
    console.log('NEIGHBOR 1: ' + my_neighbordist_1);
    console.log('NEIGHBOR 2: ' + my_neighbordist_2);
    
    console.log('ACCELERATION X1: ' + my_acceleration_x1);
    console.log('ACCELERATION Y1: ' + my_acceleration_y1);
    console.log('VEL X: ' + my_vel_x);
    console.log('LOC MULT: ' + my_loc_mult);
    console.log('STEER: ' + my_steer);
    console.log('RADIUS: ' + radius);
    console.log('RAD INC: ' + rad_inc);
    
    if (draw_mode == 10) {
        console.log('RAD MULT X: ' + rad_mult_x);
        console.log('RAD MULT Y: ' + rad_mult_y);
    }
    
    console.log('TARGET SPEED: ' + speed);
    console.log('COUNTER: ' + counter_vals[pick_counter_val]);
    
    
    if (which_shape == 1) {
        shape_string = 'CIRCLES';
    }
    else if (which_shape == 2) {
        shape_string = 'OVALS';
    }
    else if (which_shape == 3) {
        shape_string = 'RECTS';
    }
    else if (which_shape == 4) {
        shape_string = 'TRIANGLES SMALL';
    }
    else if (which_shape == 5) {
        shape_string = 'TRIANGLES MIXED';
    }
    else if (which_shape == 6) {
        shape_string = 'TRIANGLES BIG';
    }
    else if (which_shape == 7) {
        shape_string = 'RECTS LONG';
    }
    
    let SHAPES = {
        A1_SHAPES: shape_string,
        ACCENT_TYPE: accent_type_string,
        ACCENT_X: accent_x,
        ACCENT_Y: accent_y,
        C_MAX: c_max,
        R_X_MAX: r_x_max,
        R_Y_MAX: r_y_max,
        R_Y_MAX: r_y_max,
        O_X_MIN: o_x_min,
        O_X_MAX: o_x_max,
        O_Y_MIN: o_y_min,
        O_Y_MAX: o_y_max,
        T_Y_1: t_y_1,
        T_Y_2: t_y_2,
        T_X_1: t_x_1,
        R_X_1: r_x_1
    };
    console.log(SHAPES);
                
    console.log('NEON – F_ALPHA_1: ' + f_alpha_1);
    console.log('NEON – F_ALPHA_2: ' + f_alpha_2);
    console.log('NEON – F_ALPHA_3: ' + f_alpha_3);
    console.log('MATTE – F_ALPHA_4: ' + f_alpha_4);
    console.log('MATTE – F_ALPHA_5: ' + f_alpha_5);
    console.log('MATTE – F_ALPHA_6: ' + f_alpha_6);
    
    console.log('PALETTE: ' + colour_string);
    console.log('B1: ' + b_palette_1);
    console.log('B2: ' + b_palette_2);
    console.log('B3: ' + b_palette_3);
    console.log('S1: ' + s_palette_1);
    console.log('S2: ' + s_palette_2);
    console.log('S3: ' + s_palette_3);
    console.log('S OPA: ' + s_opa);
    
    console.log('SH_1 WEIGHT: ' + sh_st_we_1);
    console.log('SH_2 WEIGHT: ' + sh_st_we_2);
    
    if (rapunzel == 1) {
        console.log('RAPUNZEL: ON');
        console.log('SKIP: ' + skip_rapunzel);
        
        if (blend_type_1 == 1) {
            blend_string = 'NORMAL';
        }
        else if (blend_type_1 == 2) {
            blend_string = 'SCREEN';    
        }
        else if (blend_type_1 == 3) {
            blend_string = 'LIGHTEST';    
        }
        console.log('BLEND MODE: ' + blend_string);
        
        if (lg_hair_1_type == 1) {
            console.log('HAIR TYPE: LINES');
        }
        else {
            console.log('HAIR TYPE: ARCS');
        }
        if (dots_1 == 1) {
            console.log('DOTS 1: ON');
        }
        else {
            console.log('DOTS 1: OFF');
        }
        if (dots_2 == 1) {
            console.log('DOTS 2: ON');
        }
        else {
            console.log('DOTS 2: OFF');
        }
        console.log('H_1 WEIGHT: ' + lg_st_we_1);
        console.log('X1: ' + lg_hair_x1);
        console.log('Y1: ' + lg_hair_y1);
        console.log('ARC_1 TYPE: ' + arc_1_type);
        console.log('ARC_1 X: ' + arc_1_x);
        console.log('ARC_1 Y: ' + arc_1_y);
        
        if (lg_hairs_2 == 1) {
            console.log('H_2 WEIGHT: ' + lg_st_we_2);
            console.log('X2: ' + lg_hair_x2);
            console.log('Y2: ' + lg_hair_y2);
            console.log('ARC_2 TYPE: ' + arc_2_type);
            console.log('ARC_2 X: ' + arc_2_x);
            console.log('ARC_2 Y: ' + arc_2_y);
            
        }
    }
    else {
        console.log('RAPUNZEL: OFF');
    }
    
    console.log('HASH: ' + fxhash);
}


function draw() {
    //console.log("fr: " + frameRate());
    background(0, 0);
    
    counter += counter_vals[pick_counter_val];
    draw_cycles += 1;
    
    flock.run();
    
    // FRANZ | ICONS
    if (draw_mode == 1 || draw_mode == 2) {
        if (s_mode ==  1) {
            radius = radius + rad_inc;
            ang = ang + speed;
        }
        else if (s_mode ==  2) {
            radius = radius % rad_inc;
            ang = ang + speed;
        }
    }
    // BRANCHES (old)
    else if (draw_mode == 4) {
        radius = radius;
        ang = ang - speed;
    }
    // BRANCHES (new)
    else if (draw_mode == 5) {
        radius = radius + rad_inc;
        ang = ang - speed;
    }
    // LOOPS
    else if (draw_mode == 6) {
        if (s_mode ==  1) {
            radius = radius - rad_inc;
            ang = ang - speed;
        }
        else if (s_mode ==  2) {
            radius = radius + rad_inc;
            ang = ang - speed;
        }
    }
    // MOV_1 dev5.5
    else if (draw_mode == 7) {
        radius = radius;
        ang = ang - speed;
        
        //radius = radius - rad_inc;
        //ang = ang + speed;
    }
    // MOV_2 dev5.5
    else if (draw_mode == 8) {
        radius = radius;
        ang = ang + speed;
    }
    // MOV_3 dev5.5
    else if (draw_mode == 9) {
        radius = radius;
        ang = ang - speed;
    }
    // MOV_4 from dev9
    else if (draw_mode == 10) {
        radius = radius;
        ang = ang - speed;
    }
    
    //console.log("fxrand: " + random());
    
    if (draw_cycles == myStop) {
        noLoop(); 
        
        end = millis();
        elapsed = (end - start) / 1000; 
        console.log("render time: " + elapsed + " seconds");
        
        //setTimeout(my_Save, 3000);
        
        setTimeout(fxpreview, 15000);
    }
}

function Flock() {
    this.boids = [];
    
    this.run = function() {
        for (let i = 0; i < this.boids.length; i++) {
            this.boids[i].run(this.boids);
        }
    }
    
    this.addBoid = function(b) {
        this.boids.push(b);
    }
}

function Boid(x, y) {

    this.acceleration = createVector(my_acceleration_x1, my_acceleration_y1);
    this.velocity = createVector(0, my_vel_x);
    this.position = createVector(x, y);
    this.r = frontera;
    this.maxspeed = my_maxspeed;
    this.maxforce = my_maxforce;
    
    // RUN
    this.run = function(boids) {
        this.flock(boids);
        this.update();
        if (draw_mode != 6) {
            this.borders(); // off for circles/loops
        }
        this.render();
    }
    
    // ACCELERATION
    this.applyForce = function(force) {
        this.acceleration.add(force);
    }
    
    // FLOCK
    this.flock = function(boids) {
        let sep = this.separate(boids);
        let ali = this.align(boids);
        let coh = this.cohesion(boids);

        sep.mult(my_sep_mult);
        ali.mult(my_ali_mult);
        coh.mult(my_coh_mult);

        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
    }
    
    // UPDATE LOC
    this.update = function() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        this.acceleration.mult(my_loc_mult); 
    }
    
    // SEEK
    this.seek = function(target) {
        let desired = p5.Vector.sub(target, this.position);
        desired.normalize();
        desired.mult(this.maxspeed);
        desired.sub(this.velocity);
        desired.limit(this.maxforce);
        return desired;
    }
    
    // RENDER
    this.render = function() {
        let angle; 
        push();
        // >>> BRUSH MOVEMENTS
        if (brush_mov == 1) {
            angle = Math.atan(this.position.heading() - 5000);
            translate(this.position.x, this.position.y);
            rotate(angle << counter);
        }
        else if (brush_mov == 2) {
            angle = Math.atan(this.position.heading() + PI);
            translate(this.position.x, this.position.y);
            rotate(angle + counter);
        }
        else if (brush_mov == 3) {
            angle = Math.tan(this.position.heading() % PI);
            translate(this.position.x, this.position.y);
            rotate(angle * draw_cycles / rot_div);
        }
        else if (brush_mov == 4) {
            angle = Math.atan(this.position.heading() - 1000);
            translate(this.position.x, this.position.y);
            rotate(angle << counter);
        }
        else if (brush_mov == 5) {
            angle = Math.tan(this.position.heading() / TWO_PI);
            translate(this.position.x, this.position.y);
            rotate(angle * draw_cycles / rot_div); // **
        }
        else if (brush_mov == 6) {
            translate(this.position.x, this.position.y);
        }

        // >>> BRUSH 
        my_Brush_1();
        
        pop();
    }
    
    // FRONTERA
    this.borders = function() {
        if (this.position.x < this.r) this.position.x = width - this.r;
        if (this.position.y < this.r) this.position.y = height - this.r;
        if (this.position.x > width - this.r ) this.position.x = this.r;
        if (this.position.y > height - this.r) this.position.y = this.r;
    }
    
    // SEPARATION
    this.separate = function(boids) {
        let desiredseparation = my_desiredseparation;
        let steer;
        steer = createVector(0, my_steer);
        let count = 0;
        for (let i = 0; i < boids.length; i++) {
            let d = p5.Vector.dist(this.position, boids[i].position);
            if ((d > 0) && (d < desiredseparation)) {
                let diff = p5.Vector.sub(this.position, boids[i].position);
                diff.normalize();
                diff.div(d); 
                steer.add(diff);
                count++;
            }
        }
        if (count > 0) {
            steer.div(count);
        }
        if (steer.magSq() > 0) {
            steer.normalize();
            steer.mult(this.maxspeed);
            steer.sub(this.velocity);
            steer.limit(this.maxforce);
        }
        return steer;
    }
    
    // ALIGNMENT
    this.align = function(boids) {
        let neighbordist = my_neighbordist_1;
        let sum;
        sum = createVector(0, 0);
        let count = 0;
        for (let i = 0; i < boids.length; i++) {
            let d = p5.Vector.dist(this.position,boids[i].position);
            if ((d > 0) && (d < neighbordist)) {
                sum.add(boids[i].velocity);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxspeed);
            let steer = p5.Vector.sub(sum, this.velocity);
            steer.limit(this.maxforce);
            return steer;
        } 
        else {
            return createVector(0, 0);
        }
    }
    
    // COHESION
    this.cohesion = function(boids) {
        let neighbordist = my_neighbordist_2;
        let follow;
        
        // FRANZ 
        if (draw_mode == 1) {
            
            if (free_mode == 1) {
                fp_X = (centerX/2 && Math.cos(ang));
                fp_Y = int(random(-1, 2));
            }
            else if (free_mode == 2) {
                fp_X = (centerX * Math.tan(ang)) % int(random(-1, 1)); 
                fp_Y = random(-1, 1);
            }
            
            if (follow_mode == 1) {
                follow = createVector(fp_X, fp_Y); 
            }
            else if (follow_mode == 2) {
                follow = createVector(fp_X * -1, fp_Y);
            }
            else if (follow_mode == 3) {
                follow = createVector(fp_X, fp_Y * -1);  
            }
            else if (follow_mode == 4) {
                follow = createVector(fp_X * -1, fp_Y * -1);    
            }
            
            //fill(255, 0, 0);
            //ellipse(fp_X, fp_Y, 20, 20);
            
            let count = 0;
            for (let i = 0; i < boids.length; i++) {
                let d = p5.Vector.dist(this.position,boids[i].position);
                if ((d > 0) && (d < neighbordist)) {
                    follow.add(boids[i].position);
                    count++;
                }
            }
            
            if (count > 0) {
                follow.div(count);
                return this.seek(follow);
            } 
            else {
                return createVector(0, 0);
            }
        }
        
        // ICONS
        else if (draw_mode == 2) {
            
            if (free_mode == 1) {
                fp_X = 0;
                fp_Y = 0;
            }
            else if (free_mode == 2) {
                fp_X = 0;
                fp_Y = random(-1, 1);
            }
            else if (free_mode == 3) {
                fp_X = random(-100, 10);
                fp_Y = random(-10, 100);
            }
            
            if (follow_mode == 1) {
                follow = createVector(fp_X, fp_Y); 
            }
            else if (follow_mode == 2) {
                follow = createVector(fp_X * -1, fp_Y);
            }
            else if (follow_mode == 3) {
                follow = createVector(fp_X, fp_Y * -1);  
            }
            else if (follow_mode == 4) {
                follow = createVector(fp_X * -1, fp_Y * -1);    
            }
            
            //fill(255, 0, 0);
            //ellipse(fp_X, fp_Y, 20, 20);
            
            let count = 0;
            for (let i = 0; i < boids.length; i++) {
                let d = p5.Vector.dist(this.position,boids[i].position);
                if ((d > 0) && (d < neighbordist)) {
                    follow.add(boids[i].position);
                    count++;
                }
            }
            
            if (count > 0) {
                follow.div(count);
                return this.seek(follow);
            } 
            else {
                return createVector(0, 0);
            }
        }
        
        // BRANCHES (old)
        else if (draw_mode == 4) {
            
            fp_X = centerX - radius * rad_mult_x * Math.tan(ang);
            fp_Y = centerY + radius * rad_mult_y * Math.tan(ang);

            follow = createVector(fp_X, fp_Y);
            
            //fill(255, 0, 0);
            //ellipse(fp_X, fp_Y, 10, 10);
            
            let count = 0;
            for (let i = 0; i < boids.length; i++) {
                let d = p5.Vector.dist(this.position,boids[i].position);
                if ((d > 0) && (d < neighbordist)) {
                    follow.add(boids[i].position);
                    count++;
                }
            }
            if (count > 0) {
                follow.div(count);
                return this.seek(follow);
            } 
            else {
                return createVector(0, 0);
            }
        }
        
        // BRANCHES (new)
        else if (draw_mode == 5) {  
            
            fp_X = centerX ^ radius * Math.cos(ang);
            fp_Y = centerY ^ radius / Math.cos(ang);
            
            if (follow_mode == 1) {
                follow = createVector(fp_X, fp_Y); 
            }
            else if (follow_mode == 2) {
                follow = createVector(fp_X * -1, fp_Y);
            }
            else if (follow_mode == 3) {
                follow = createVector(fp_X, fp_Y * -1);  
            }
            else if (follow_mode == 4) {
                follow = createVector(fp_X * -1, fp_Y * -1);    
            }
            
            //fill(255, 0, 0);
            //ellipse(fp_X, fp_Y, 10, 10);
            
            let count = 0;
            for (let i = 0; i < boids.length; i++) {
                let d = p5.Vector.dist(this.position,boids[i].position);
                if ((d > 0) && (d < neighbordist)) {
                    follow.add(boids[i].position);
                    count++;
                }
            }
            if (count > 0) {
                follow.div(count);
                return this.seek(follow);
            } 
            else {
                return createVector(0, 0);
            }
        }
        
        // LOOPS 
        else if (draw_mode == 6) {
            // L1 V1
            if (loop_type == 1 && l1_v == 1) {
                fp_X = centerX + radius/2 * Math.cos(ang) % draw_cycles;
                fp_Y = centerY * l1_mult + radius * Math.sin(ang);
            }
            // L1 V2
            else if (loop_type == 1 && l1_v == 2) {
                fp_X = centerX + radius/2 * Math.sin(ang);
                fp_Y = centerY * l1_mult + radius/2 * Math.cos(ang);
            }
            // L1 V3
            else if (loop_type == 1 && l1_v == 3) {
                fp_X = centerX + radius/2 * Math.cos(ang);
                fp_Y = centerY * l1_mult + radius/2 * Math.cos(ang);
            }
            // L2 V1 
            else if (loop_type == 2 && l2_v == 1) {
                fp_X = centerX + radius/2 * Math.sin(ang);
                fp_Y = height + 75 + radius * Math.cos(ang) % draw_cycles - draw_cycles;
            }
            // L2 V2
            else if (loop_type == 2 && l2_v == 2) {
                fp_X = width/2 + radius/2 * Math.cos(ang >> 2);
                fp_Y = height + 75 + radius * Math.atan(ang / 2) - draw_cycles;
            }
            // L2 V3
            else if (loop_type == 2 && l2_v == 3) {
                fp_X = width + 75 + radius/2 * Math.cos(ang) % draw_cycles - draw_cycles;
                fp_Y = height/2 - radius/1.2 * Math.sin(ang) % draw_cycles; // try without the -100 too
            }
            // L2 V4
            else if (loop_type == 2 && l2_v == 4) {
                fp_X = -75 + radius/2 * Math.sin(ang) % draw_cycles + draw_cycles;
                fp_Y = height/2 - radius/1.2 * Math.cos(ang) % draw_cycles; // try without the -100 too
            }
            // L2 V5 
            else if (loop_type == 2 && l2_v == 5) {
                fp_X = centerX + radius/2 * Math.sin(ang);
                fp_Y = -75 + radius * Math.cos(ang) % draw_cycles + draw_cycles;
            }
            // L3 V1
            else if (loop_type == 3 && l3_v == 1) {
                fp_X = -60 + radius/2 * Math.sin(ang >> 2) + draw_cycles;;
                fp_Y = height + 60 + radius * Math.sin(ang / 2) - draw_cycles;
            }
            // L3 V2
            else if (loop_type == 3 && l3_v == 2) {
                fp_X = width + 60 + radius/2 * Math.sin(ang >> 2) - draw_cycles;;
                fp_Y = -60 + radius * Math.sin(ang / 2) + draw_cycles;
            }
            // L4
            else if (loop_type == 4) {
                fp_X = -60 + radius/2 * Math.cos(ang >> 2) + draw_cycles; // sin sin
                fp_Y = -60 + radius * Math.cos(ang / 2) + draw_cycles;
            }
            // L5 V1
            else if (loop_type == 5 && l5_v == 1) {
                fp_X = width + 75 + radius/1.75 * Math.sin(ang / 2) - draw_cycles;
                fp_Y = height/2 - radius * Math.cos(ang >> 2);
            }
            // L5 V2
            else if (loop_type == 5 && l5_v == 2) {
                fp_X = -75 - radius/1.75 * Math.sin(ang && 2) + draw_cycles;
                fp_Y = height/2 - radius * Math.cos(ang >> 2);
            }
            // L6 V1
            else if (loop_type == 6 && l6_v == 1) {
                fp_X = width + 50 - radius/2 * Math.sin(ang && 2) - draw_cycles; // tan (ang >> 2)
                fp_Y = height - radius * Math.cos(ang / 2) - draw_cycles;
            }
            // L6 V2
            else if (loop_type == 6 && l6_v == 2) {
                fp_X = width + 50 - radius/2 * Math.sin(ang / 2) - draw_cycles; // tan (ang >> 2)
                fp_Y = height - radius * Math.sin(ang << 2) - draw_cycles;
            } 
            // L6 V3
            else if (loop_type == 6 && l6_v == 3) {
                fp_X = width + 50 - radius/2 * Math.cos(ang / 2) - draw_cycles;
                fp_Y = height + 50 - radius * Math.cos(ang / 2) - draw_cycles;
            }
            // L7 V1
            else if (loop_type == 7 && l7_v == 1) {
                fp_X = -95 - radius/2 * Math.atan(ang >> 2) + draw_cycles;
                fp_Y = height/2 - radius / Math.sin(ang >>> 2); // >> or >>>
            }
            // L7 V2
            else if (loop_type == 7 && l7_v == 2) {
                fp_X = width + 95 - radius/2 * Math.atan(ang >>> 2) - draw_cycles;
                fp_Y = height/2 - radius / Math.sin(ang >>> 2);
            }
            // L7 V3
            else if (loop_type == 7 && l7_v == 3) {
                fp_X = width/2 - radius/2 / Math.sin(ang >> 2);
                fp_Y = -95 - radius/2 * Math.atan(ang >>> 2) + draw_cycles;
            }
            // L7 V4
            else if (loop_type == 7 && l7_v == 4) {
                fp_X = width/2 - radius/2 / Math.sin(ang >> 2);
                fp_Y = height + 95 + radius * Math.atan(ang >> 2) - draw_cycles;
            }
            // L7 V5
            else if (loop_type == 7 && l7_v == 5) {
                fp_X = -95 - radius/2 * Math.atan(ang >> 2) + draw_cycles;
                fp_Y = -95 - radius / Math.sin(ang >>> 2) + draw_cycles;
            }
            // L7 V6
            else if (loop_type == 7 && l7_v == 6) {
                fp_X = width + 50 - radius/2 * Math.atan(ang >>> 2) - draw_cycles;
                fp_Y = height + 50 - radius / Math.sin(ang >>> 2) - draw_cycles;
            }
            // L8 V1
            else if (loop_type == 8 && l8_v == 1) {
                fp_X = width/2 + radius/2 * Math.cos(ang >> 2);
                fp_Y = height + 55 + radius/2 * Math.sin(ang/2) - draw_cycles;
            }
            // L8 V2
            else if (loop_type == 8 && l8_v == 2) {
                fp_X = width/2 + radius/2 * Math.cos(ang >> 2);
                fp_Y = height/2.5 + radius/2 * Math.atan(ang) + draw_cycles;
            }
            
            follow = createVector(fp_X, fp_Y);
            
            //fill(255, 0, 0);
            //ellipse(fp_X, fp_Y, 10, 10);
            
            let count = 0;

            for (let i = 0; i < boids.length; i++) {
                let d = p5.Vector.dist(this.position,boids[i].position);

                if ((d > 0) && (d < neighbordist)) {
                    count++;
                }
            }

            if (count > 0) {
                return this.seek(follow);
            } 
            else {
                return createVector(0, 0);
            }
        }
        
        // MOV_1 from dev5.5
        else if (draw_mode == 7) {
            
            if (free_mode == 1) {
                fp_X = centerX - radius * Math.cos(ang);
                fp_Y = centerY/4 + radius/3 * Math.sin(ang) + draw_cycles;   
            }
            else if (free_mode == 2) {
                fp_X = 0;
                fp_Y = 0;   
            }
            
            if (follow_mode == 1) {
                follow = createVector(fp_X, fp_Y); 
            }
            else if (follow_mode == 2) {
                follow = createVector(fp_X * -1, fp_Y);
            }
            else if (follow_mode == 3) {
                follow = createVector(fp_X, fp_Y * -1);  
            }
            else if (follow_mode == 4) {
                follow = createVector(fp_X * -1, fp_Y * -1);    
            }
            
            //fill(255, 0, 0);
            //ellipse(fp_X, fp_XY, 50, 50);
            
            let count = 0;
            
            for (let i = 0; i < boids.length; i++) {
                let d = p5.Vector.dist(this.position,boids[i].position);
                
                if ((d > 0) && (d < neighbordist)) {
                    follow.add(boids[i].position);
                    count++;
                }
            }
            
            if (count > 0) {
                follow.div(count);
                return this.seek(follow);
            } 
            else {
                return createVector(0, 0);
            }   
        }
        
        // MOV_2 from dev5.5
        else if (draw_mode == 8) {
            
            if (branch_type == 1) {
                fp_X = centerX ^ radius * Math.cos(ang);
                fp_Y = centerY ^ radius / Math.cos(ang);
            }
            else if (branch_type == 2) {
                fp_X = centerX % radius * Math.atan(ang);
                fp_Y = centerY ^ radius / Math.sin(ang);
            }
            
            follow = createVector(fp_X, fp_Y);
            
            //fill(255, 0, 0);
            //ellipse(fp_X, fp_Y, 50, 50);
            
            let count = 0;
            for (let i = 0; i < boids.length; i++) {
                let d = p5.Vector.dist(this.position,boids[i].position);
                if ((d > 0) && (d < neighbordist)) {
                    follow.add(boids[i].position);
                    count++;
                }
            }
            if (count > 0) {
                follow.div(count);
                return this.seek(follow);
            } 
            else {
                return createVector(0, 0);
            }
        }
        
        // MOV_3 from dev5.5
        else if (draw_mode == 9) {

            fp_X = 0;
            fp_Y = 0;
            
            follow = createVector(0, 0);
            
            //fill(255, 0, 0);
            //ellipse(fp_X, fp_Y, 50, 50);
            
            let count = 0;
            for (let i = 0; i < boids.length; i++) {
                let d = p5.Vector.dist(this.position,boids[i].position);
                if ((d > 0) && (d < neighbordist)) {
                    follow.add(boids[i].position);
                    count++;
                }
            }
            if (count > 0) {
                follow.div(count);
                return this.seek(follow);
            } 
            else {
               return createVector(0, 0);
            }
        }
        
        // MOV4 from dev9
        else if (draw_mode == 10) {
            
            fp_X = centerX - radius * rad_mult_x * Math.tan(ang);
            fp_Y = centerY + radius * rad_mult_y * Math.tan(ang);
            
            if (follow_mode == 1) {
                follow = createVector(fp_X, fp_Y); 
            }
            else if (follow_mode == 2) {
                follow = createVector(fp_X * -1, fp_Y);
            }
            else if (follow_mode == 3) {
                follow = createVector(fp_X, fp_Y * -1);  
            }
            else if (follow_mode == 4) {
                follow = createVector(fp_X * -1, fp_Y * -1);    
            }
            
            //fill(255, 0, 0);
            //ellipse(fp_X, fp_Y, 10, 10);
            
            let count = 0;

            for (let i = 0; i < boids.length; i++) {
                let d = p5.Vector.dist(this.position,boids[i].position);

                if ((d > 0) && (d < neighbordist)) {
                    follow.add(boids[i].position);
                    count++;
                }
            }

            if (count > 0) {
                follow.div(count);
                return this.seek(follow);
            } 
            else {
                return createVector(0, 0);
            }
        }
    }     
}

function my_Save() {
    save('af_' + fxhash + '.png')
}

// >>> BRUSH <<<
function my_Brush_1() {
    push();
    rectMode(CENTER);
    strokeCap(PROJECT);
    //blendMode(SCREEN);
    
    // >>> LONG HAIR
    push();
    // only draw rapunzel fx on even draw cycles
    if (skip_rapunzel == true) {
        // >>> LONG HAIR-1
        if (draw_cycles % 2 == 0) {
            // LINES
            if (lg_hair_1_type == 1 && lg_hairs_1 == 1) {
                noFill();
                b_LongHair_1_cols(lg_st_we_1);
                if (dots_1 == 1) {
                    drawingContext.setLineDash([10, 10, 10, 10, 10]);
                }
                line(0, 0, int(random(1, lg_hair_x1)), int(random(1, lg_hair_y1)));
            }
            // ARCS
            else if (lg_hair_1_type == 2 && lg_hairs_1 == 1) {
                noFill();
                if (dots_1 == 1) {
                    drawingContext.setLineDash([5, 10]);
                }
                b_LongHair_1_cols(lg_st_we_1);

                if (arc_1_type == 1) {
                    arc(arc_1_x, arc_1_y, lg_hair_x1, lg_hair_y1, HALF_PI, PI);
                }
                else if (arc_1_type == 2) {
                    arc(arc_1_x, arc_1_y, lg_hair_x1, lg_hair_y1, PI, TWO_PI);
                }
                else if (arc_1_type == 3) {
                    arc(arc_1_x, arc_1_y, lg_hair_y1, lg_hair_x1, arc_1_x2, arc_1_y2);
                }
            }
        }

        // >>> LONG HAIR-2
        if (draw_cycles % 2 == 0) {
            // LINES
            if (lg_hair_2_type == 1 && lg_hairs_2 == 1) {
                noFill();
                if (which_h_palette < 2) { 
                    b_LongHair_2_cols(lg_st_we_2); // set color
                }
                else {
                    b_LongHair_3_cols(lg_st_we_2); // various colors
                }
                line(accent_x/2, accent_y/2, int(random(lg_hair_x2)), lg_hair_y2);
            }
            // ARCS
            else if (lg_hair_2_type == 2 && lg_hairs_2 == 1) {
                noFill();
                if (which_h_palette < 2) { 
                    b_LongHair_2_cols(lg_st_we_2); // set color
                }
                else {
                    b_LongHair_3_cols(lg_st_we_2); // various colors
                }

                if (dots_2 == 1) {
                    drawingContext.setLineDash([10, 5]);
                }
                if (arc_2_type == 1) {
                    arc(arc_2_x, arc_2_y, lg_hair_x2, lg_hair_y2, PI, HALF_PI);
                }
                else if (arc_2_type == 2) {
                    arc(arc_2_x, arc_2_y, lg_hair_x2, lg_hair_y2, TWO_PI, PI);
                }
                else if (arc_2_type == 3) {
                    arc(arc_2_x, arc_2_y, lg_hair_x2, lg_hair_y2, HALF_PI, PI);
                }
            }
            //pop();
        }
    }
    // draw rapunzel fx on every draw cycle
    else {
        // >>> LONG HAIR-1
        // LINES
        if (lg_hair_1_type == 1 && lg_hairs_1 == 1) {
            noFill();
            b_LongHair_1_cols(lg_st_we_1);
            if (dots_1 == 1) {
                drawingContext.setLineDash([10, 10, 10, 10, 10]);
            }
            line(0, 0, int(random(1, lg_hair_x1)), int(random(1, lg_hair_y1)));
        }
        // ARCS
        else if (lg_hair_1_type == 2 && lg_hairs_1 == 1) {
            noFill();
            if (dots_1 == 1) {
                drawingContext.setLineDash([5, 10]);
            }
            b_LongHair_1_cols(lg_st_we_1);

            if (arc_1_type == 1) {
                arc(arc_1_x, arc_1_y, lg_hair_x1, lg_hair_y1, HALF_PI, PI);
            }
            else if (arc_1_type == 2) {
                arc(arc_1_x, arc_1_y, lg_hair_x1, lg_hair_y1, PI, TWO_PI);
            }
            else if (arc_1_type == 3) {
                arc(arc_1_x, arc_1_y, lg_hair_y1, lg_hair_x1, arc_1_x2, arc_1_y2);
            }
        }

        // >>> LONG HAIR-2
        if (draw_cycles % 2 == 0) {
            // LINES
            if (lg_hair_2_type == 1 && lg_hairs_2 == 1) {
                noFill();
                if (which_h_palette < 2) { 
                    b_LongHair_2_cols(lg_st_we_2); // set color
                }
                else {
                    b_LongHair_3_cols(lg_st_we_2); // various colors
                }
                line(accent_x/2, accent_y/2, int(random(lg_hair_x2)), lg_hair_y2);
            }
            // ARCS
            else if (lg_hair_2_type == 2 && lg_hairs_2 == 1) {
                noFill();
                if (which_h_palette < 2) { 
                    b_LongHair_2_cols(lg_st_we_2); // set color
                }
                else {
                    b_LongHair_3_cols(lg_st_we_2); // various colors
                }

                if (dots_2 == 1) {
                    drawingContext.setLineDash([10, 5]);
                }
                if (arc_2_type == 1) {
                    arc(arc_2_x, arc_2_y, lg_hair_x2, lg_hair_y2, PI, HALF_PI);
                }
                else if (arc_2_type == 2) {
                    arc(arc_2_x, arc_2_y, lg_hair_x2, lg_hair_y2, TWO_PI, PI);
                }
                else if (arc_2_type == 3) {
                    arc(arc_2_x, arc_2_y, lg_hair_x2, lg_hair_y2, HALF_PI, PI);
                }
            }
        }
    }
    pop();
    
    
    // >>> SHORT HAIR-1
    // LINES
    if (sh_hair_1_type == 1 && sh_hairs_1 == 1) {
        noFill();
        b_ShortHair_1_cols(sh_st_we_1);
        line(0, 0, int(random(1, sh_hair_x1)), int(random(1, sh_hair_y1)));
    }
    // ARCS
    else if (sh_hair_1_type == 2 && sh_hairs_1 == 1) {
        noFill();
        b_ShortHair_1_cols(sh_st_we_1);
        if (dots_3 == 1) {
            drawingContext.setLineDash([2, 5]);
        }
        if (arc_1_type == 1) {
            arc(10, 10, sh_hair_x1, sh_hair_y1, HALF_PI, PI);
        }
        else if (arc_1_type == 2) {
            arc(5, 15, sh_hair_x1, sh_hair_y1, HALF_PI, PI);
        }
        else if (arc_1_type == 3) {
            arc(10, 5, sh_hair_x1, sh_hair_y1, PI, HALF_PI);
        }
    }
    
    // >>> SHORT HAIR-2
    // LINES
    if (sh_hair_2_type == 1 && sh_hairs_2 == 1) {
        noFill();
        b_ShortHair_2_cols(sh_st_we_2);
        line(accent_x/2, accent_y/2, int(random(sh_hair_x2)), sh_hair_y2);
    }
    // ARCS
    else if (sh_hair_2_type == 2 && sh_hairs_2 == 1) {
        noFill();
        b_ShortHair_2_cols(sh_st_we_2);
        if (dots_4 == 1) {
            drawingContext.setLineDash([2, 2, 2, 2, 2]);
        }
        if (arc_2_type == 1) {
            arc(10, 10, sh_hair_x2, sh_hair_y2, HALF_PI, PI);
        }
        else if (arc_2_type == 2) {
            arc(10, 15, sh_hair_x2, sh_hair_y2, PI, HALF_PI);
        }
        else if (arc_2_type == 3) {
            arc(10, 10, sh_hair_x2, sh_hair_y2, PI, TWO_PI);
        }
    }
    
    
    // >>> MAIN SHAPE
    push();
    b_MainShape_cols();
    // CIRCLES
    if (which_shape == 1) {
        ellipse(accent_x, accent_y, int(random(2, c_max))); // min used to be 1
    }
    // OVALS
    else if (which_shape == 2) {
        ellipse(accent_x, accent_y, int(random(o_x_min, o_x_max)), int(random(o_y_min, o_y_max)));     
    }
    // RECTS
    else if (which_shape == 3) {
        rect(accent_x, accent_y, int(random(2, r_x_max)), int(random(4, r_y_max)));     
    }
    // SMALL TRIANGLES
    else if (which_shape == 4) {
        triangle(0, 0, 5, 5, t_y_1, 0);
    }
    // MIXED TRIANGLES
    else if (which_shape == 5) {
        triangle(0, 0, int(random(2, 8)), int(random(2, 5)), int(random(2, t_y_2)), 0); 
    }
    // BIG TRIANGLES
    else if (which_shape == 6) {
        triangle(0, 0, t_x_1, t_x_1, 10, 0);
    }
    // LONG THIN RECTS
    else if (which_shape == 7) {
        rect(accent_x, accent_y, r_x_1, 1);
    }
    //pop();
    
    // >>> SECONDARY SHAPE
    //push();
    b_SecShape_cols();
    if (which_shape == 1) {
        ellipse(0, 0, int(random(1, 4)));
    }
    else if (which_shape == 2) {
        ellipse(0, 0, int(random(1, 5)), 2);   
    }
    else if (which_shape == 3) {
        rect(0, 0, int(random(1, 5)), 2);    
    }
    else if (which_shape == 4) {
         triangle(0, 0, 2.5, 2.5, t_y_1/2, 0);
    }
    else if (which_shape == 5) {
        triangle(0, 0, int(random(1, 10)), int(random(1, 10)), int(random(1, 5)), 0); // not with icons
    }
    else if (which_shape == 6) {
        triangle(0, 0, t_x_1/2, t_x_1/2, 5, 0); // not with icons
    }
    else if (which_shape == 7) {
        rect(0, 0, r_x_1/3, 1); // x: 35-75, y: 1-2 | not so big with icons, max 40 | any system with -0.97 max 55
    }
    //pop();
    
    
    // >>> DOTS (fill);
    //push();
    b_DotsFill_cols();
    ellipse(accent_x - 10, accent_y + 10, 2, 2);
    //pop();
    
    // >>> DOTS (stroke-1)
    //push();
    b_DotsStr1_cols();
    noFill();
    ellipse(accent_x, accent_y, 0.5, random(1));
    //pop();
    
    // >>> DOTS (stroke-2)
    //push();
    b_DotsStr2_cols();
    noFill();
    rect(accent_x - 5, accent_y + 5, random(1), 0.5);
    pop();
    
    pop();
}

function b_LongHair_1_cols(wei) {
    
    strokeWeight(wei);
    
    if (blend_type_1 == 1) {
        blendMode(NORMAL);
    }
    else if (blend_type_1 == 2) {
        blendMode(SCREEN);     
    }
    else if (blend_type_1 == 3) {
        blendMode(LIGHTEST);
    } 
    
    // RED SEMI-NEON
    if (is_Red_1 == true) { 
        s_Red_189();
    }
    // RED MATTE
    else if (is_Red_2 == true) { 
        s_Red_189();
    }
    // BLUE SEMI-NEON
    else if (is_Blue_1 == true || is_Blue_3 == true) {
        s_Klein_1();
    }
    // BLUE MATTE
    else if (is_Blue_2 == true) {
        s_Blue_189();
    }
    // PURPLE SEMI-NEON
    else if (is_Purple_1 == true || is_Purple_2 == true) {
        s_Purples();
    }
    // YELLOW SEMI-NEON
    else if (is_Yellow_1 == true || is_Yellow_3 == true || is_Yellow_4 == true) {
        s_Klein_1();
    }
    // YELLOW MATTE
    else if (is_Yellow_2 == true) {
        s_Orange();
    }
    // ORANGE NEON
    else if (is_Orange_1 == true || is_Orange_2 == true) {
        s_Orange();
    }
    // GOLD NEON
    else if (is_Gold_1 == true) {
        s_Klein_1();
    }
    // BRONZE
    else if (is_Bronze_1 == true) {
        s_Salmon();
    }
    // BLACK MATTE V1
    else if (is_Black_1 == true) {
        hair_palette_Black_2();
    }
    // BLACK MATTE V2
    else if (is_Black_2 == true) {
        hair_palette_Black_2();
    }
    // NEON V1
    else if (is_Neon_1 == true) {
        hair_palette_1();
    }
    // NEON V2
    else if (is_Neon_2 == true) {
        hair_palette_1();
    }
    // NEON V3
    else if (is_Neon_3 == true) {
        hair_palette_1();
    }
    // OFF-WHITE
    else if (is_White_1 == true && is_bg_black == true) {
        s_Blue_215();
    }
    // OFF-WHITE
    else if (is_White_1 == true && is_bg_black == false) {
        s_Reds();
    }
    // COLD WHITE
    else if (is_White_2 == true && is_bg_black == true) {
        hair_palette_ColdWhite_2();
    }
    // COLD WHITE
    else if (is_White_2 == true && is_bg_black == false) {
        hair_palette_ColdWhite_2();
    }
    // NEON GREEN
    else if (is_Green_1 == true || is_Green_2 == true) {
        s_Green_SN();
    }
}

function b_LongHair_2_cols(wei) {
    
    strokeWeight(wei);
    
    if (blend_type_1 == 1) {
        blendMode(NORMAL);
    }
    else if (blend_type_1 == 2) {
        blendMode(SCREEN);     
    }
    else if (blend_type_1 == 3) {
        blendMode(LIGHTEST);
    } 
    
    // RED SEMI-NEON
    if (is_Red_1 == true) { 
        s_Blue_189();
    }
    // RED MATTE
    else if (is_Red_2 == true) { 
        s_Blue_189();
    }
    // BLUE SEMI-NEON
    else if (is_Blue_1 == true || is_Blue_3 == true) {
        s_Purples();
    }
    // BLUE MATTE
    else if (is_Blue_2 == true) {
        s_Pink();
    }
    // PURPLE SEMI-NEON
    else if (is_Purple_1 == true || is_Purple_2 == true) {
        s_Blues();
    }
    // YELLOW SEMI-NEON
    else if (is_Yellow_1 == true || is_Yellow_3 == true || is_Yellow_4 == true) {
        s_Orange();
    }
    // YELLOW MATTE
    else if (is_Yellow_2 == true) {
        s_Blues();
    }
    // ORANGE NEON
    else if (is_Orange_1 == true || is_Orange_2 == true) {
        s_Red_189();
    }
    // GOLD NEON
    else if (is_Gold_1 == true) {
        s_Red_189();
    }
    // BRONZE
    else if (is_Bronze_1 == true) {
        s_Orange();
    }
    // BLACK MATTE V1
    else if (is_Black_1 == true) {
        hair_palette_Blue_N();
    }
    // BLACK MATTE V2
    else if (is_Black_2 == true) {
        hair_palette_Blue_N();
    }
    // NEON V1
    else if (is_Neon_1 == true) {
        hair_palette_2();
    }
    // NEON V2
    else if (is_Neon_2 == true) {
        hair_palette_2();
    }
    // NEON V3
    else if (is_Neon_3 == true) {
        hair_palette_2();
    }
    // OFF-WHITE
    else if (is_White_1 == true && is_bg_black == true) {
        s_Klein_1();
    }
    // OFF-WHITE
    else if (is_White_1 == true && is_bg_black == false) {
        s_Purples();
    }
    // COLD WHITE
    else if (is_White_2 == true && is_bg_black == true) {
        s_Red_189();
    }
    // COLD WHITE
    else if (is_White_2 == true && is_bg_black == false) {
        s_Pink();
    }
    // NEON GREEN
    else if (is_Green_1 == true || is_Green_2 == true) {
        s_MemoriesOfGreen();
    }
}

function b_LongHair_3_cols(wei) {
    
    strokeWeight(wei);
    
    if (blend_type_1 == 1) {
        blendMode(NORMAL);
    }
    else if (blend_type_1 == 2) {
        blendMode(SCREEN);     
    }
    else if (blend_type_1 == 3) {
        blendMode(LIGHTEST);
    } 
    
    // RED SEMI-NEON
    if (is_Red_1 == true) { 
        hair_palette_Red_N();
    }
    // RED MATTE
    else if (is_Red_2 == true) { 
        hair_palette_Red_M();
    }
    // BLUE SEMI-NEON
    else if (is_Blue_1 == true || is_Blue_3 == true) {
        hair_palette_Blue_N();
    }
    // BLUE MATTE
    else if (is_Blue_2 == true) {
        hair_palette_Blue_M();
    }
    // PURPLE SEMI-NEON
    else if (is_Purple_1 == true || is_Purple_2 == true) {
        hair_palette_Blue_N();
    }
    // YELLOW SEMI-NEON
    else if (is_Yellow_1 == true || is_Yellow_3 == true || is_Yellow_4 == true) {
        hair_palette_Yellow_N();
    }
    // YELLOW MATTE
    else if (is_Yellow_2 == true) {
        hair_palette_Yellow_M();
    }
    // ORANGE NEON
    else if (is_Orange_1 == true || is_Orange_2 == true) {
        hair_palette_Orange_N();
    }
    // GOLD NEON
    else if (is_Gold_1 == true) {
        hair_palette_Gold_N();
    }
    // BRONZE
    else if (is_Bronze_1 == true) {
        hair_palette_Gold_N();
    }
    // BLACK MATTE V1
    else if (is_Black_1 == true) {
        hair_palette_Black();
    }
    // BLACK MATTE V2
    else if (is_Black_2 == true) {
        hair_palette_Black();
    }
    // NEON V1
    else if (is_Neon_1 == true) {
        hair_palette_3();
    }
    // NEON V2
    else if (is_Neon_2 == true) {
        hair_palette_3();
    }
    // NEON V3
    else if (is_Neon_3 == true) {
        hair_palette_3();
    }
    // OFF-WHITE
    else if (is_White_1 == true && is_bg_black == true) {
        hair_palette_OffWhite_1();
    }
    // OFF-WHITE
    else if (is_White_1 == true && is_bg_black == false) {
        hair_palette_OffWhite_2();
    }
    // COLD WHITE
    else if (is_White_2 == true && is_bg_black == true) {
        hair_palette_ColdWhite_1();
    }
    // COLD WHITE
    else if (is_White_2 == true && is_bg_black == false) {
        hair_palette_ColdWhite_2();
    }
    // NEON GREEN
    else if (is_Green_1 == true || is_Green_2 == true) {
        hair_palette_Gren_N();
    }
}

function b_ShortHair_1_cols(wei) {
    
    strokeWeight(wei);
    
    // RED SEMI-NEON
    if (is_Red_1 == true) { 
        blendMode(NORMAL);
        s_Red_215(); 
    }
    // RED MATTE
    else if (is_Red_2 == true) { 
        blendMode(NORMAL);
        s_Red_215(); 
    }
    // ORANGE NEON
    else if (is_Orange_1 == true || is_Orange_2 == true) {
        blendMode(NORMAL);
        s_Orange();
    }
    // BLUE SEMI-NEON
    else if (is_Blue_1 == true || is_Blue_3 == true) {
        blendMode(NORMAL);
        stroke(0, 225, 255);
    }
    // BLUE MATTE
    else if (is_Blue_2 == true) {
        blendMode(NORMAL);
        s_Blue_189();
    }
    // PURPLE SEMI-NEON
    else if (is_Purple_1 == true || is_Purple_2 == true) {
        blendMode(NORMAL);
        s_Purples();
    }
    // YELLOW SEMI-NEON
    else if (is_Yellow_1 == true || is_Yellow_3 == true || is_Yellow_4 == true) {
        blendMode(NORMAL);
        stroke(255, 210, 63);
    }
    // YELLOW MATTE
    else if (is_Yellow_2 == true) {
        blendMode(NORMAL);
        stroke(255, 210, 63);
    }
    // GOLD NEON
    else if (is_Gold_1 == true) {
        blendMode(NORMAL);
        s_OnFire();
    }
    // BRONZE
    else if (is_Bronze_1 == true) {
        blendMode(SCREEN);
        s_Orange();
    }
    // BLACK MATTE V1
    else if (is_Black_1 == true) {
        blendMode(NORMAL);
        s_Black(); 
    }
    // BLACK MATTE V2
    else if (is_Black_2 == true) {
        blendMode(NORMAL);
        s_Black(); 
    }
    // NEON V1
    else if (is_Neon_1 == true) {
        blendMode(SCREEN);
        stroke_palette_1();
    }
    // NEON V2
    else if (is_Neon_2 == true) {
        blendMode(SCREEN);
        stroke_palette_1();
    }
    // NEON V3
    else if (is_Neon_3 == true) {
        blendMode(SCREEN);
        stroke_palette_1();
    }
    // OFF-WHITE
    else if (is_White_1 == true) {
        blendMode(SCREEN);
        stroke(255);
    }
    // COLD WHITE
    else if (is_White_2 == true) {
        blendMode(SCREEN);
        s_ShoulderOfOrion();
    }
    // NEON GREEN
    else if (is_Green_1 == true || is_Green_2 == true) {
        blendMode(SCREEN);
        s_Green();
    }
}

function b_ShortHair_2_cols(wei) {
    
    strokeWeight(wei);
    
    // RED SEMI-NEON
    if (is_Red_1 == true) { 
        blendMode(NORMAL);
        s_Reds(); 
    }
    // RED MATTE
    else if (is_Red_2 == true) { 
        blendMode(NORMAL);
        s_Reds(); 
    }
    // ORANGE NEON
    else if (is_Orange_1 == true || is_Orange_2 == true) {
        blendMode(NORMAL);
        s_Orange();
    }
    // BLUE SEMI-NEON
    else if (is_Blue_1 == true || is_Blue_3 == true) {
        blendMode(NORMAL);
        stroke(0, 150, 255);
    }
    // BLUE MATTE
    else if (is_Blue_2 == true) {
        blendMode(NORMAL);
        s_Blues();
    }
    // PURPLE SEMI-NEON
    else if (is_Purple_1 == true || is_Purple_2 == true) {
        blendMode(NORMAL);
        s_Lavender();
    }
    // YELLOW SEMI-NEON
    else if (is_Yellow_1 == true || is_Yellow_3 == true || is_Yellow_4 == true) {
        blendMode(NORMAL);
        s_Yellow();
    }
    // YELLOW MATTE
    else if (is_Yellow_2 == true) {
        blendMode(NORMAL);
        s_Yellow();
    }
    // GOLD NEON
    else if (is_Gold_1 == true) {
        blendMode(NORMAL);
        s_OnFire();
    }
    // BRONZE
    else if (is_Bronze_1 == true) {
        blendMode(SCREEN);
        s_MemoriesOfGreen();
    }
    // BLACK MATTE V1
    else if (is_Black_1 == true) {
        blendMode(NORMAL);
        s_OffBlack();
    }
    // BLACK MATTE V2
    else if (is_Black_2 == true) {
        blendMode(NORMAL);
        s_OffBlack();
    }
    // NEON V1
    else if (is_Neon_1 == true) {
        blendMode(SCREEN);
        stroke_palette_2();
    }
    // NEON V2
    else if (is_Neon_2 == true) {
        blendMode(SCREEN);
        stroke_palette_2();
    }
    // NEON V3
    else if (is_Neon_3 == true) {
        blendMode(SCREEN);
        stroke_palette_2();
    }
    // OFF-WHITE
    else if (is_White_1 == true) {
        blendMode(SCREEN);
        s_OffWhite();
    }
    // COLD WHITE
    else if (is_White_2 == true) {
        blendMode(SCREEN);
        s_ShoulderOfOrion();
    }
    // NEON GREEN
    else if (is_Green_1 == true || is_Green_2 == true) {
        blendMode(SCREEN);
        s_MemoriesOfGreen();
    }
}

function b_MainShape_cols() {
    
    noStroke();
    
    // RED SEMI-NEON
    if (is_Red_1 == true) {
        blendMode(SCREEN);
        fill(250, 2, 0, f_alpha_4 * 1.5);
    }
    // RED MATTE
    else if (is_Red_2 == true) {
        blendMode(NORMAL);
        fill(249, 15, 0, f_alpha_4 * 1.5);
    }
    // ORANGE
    else if (is_Orange_1 == true || is_Orange_2 == true) {
        blendMode(SCREEN);
        fill(255, 50, 0, f_alpha_4 * 1.5);
    }
    // BLUE SEMI-NEON
    else if (is_Blue_1 == true || is_Blue_3 == true) {
        blendMode(SCREEN);
        fill(0, 150, 255, f_alpha_4 * 1.5);
    }
    // BLUE MATTE
    else if (is_Blue_2 == true) {
        blendMode(NORMAL);
        fill(0, 190, 255, f_alpha_4 * 1.5);
    }
    // PURPLE SEMI-NEON
    else if (is_Purple_1 == true || is_Purple_2 == true) {
        blendMode(SCREEN);
        fill(106, 44, 112, f_alpha_4 * 1.5);
    }
    // YELLOW SEMI-NEON
    else if (is_Yellow_1 == true || is_Yellow_3 == true || is_Yellow_4 == true) {
        blendMode(SCREEN);
        fill(255, 195, 0, f_alpha_4 * 1.6);
    }
    // YELLOW MATTE
    else if (is_Yellow_2 == true) {
        blendMode(NORMAL);
        fill(255, 224, 82, f_alpha_4 * 1.6);
    }
    // GOLD NEON
    else if (is_Gold_1 == true) {
        blendMode(SCREEN);
        f_Orange(f_alpha_4);
    }
    // BRONZE
    else if (is_Bronze_1 == true) {
        blendMode(SCREEN);
        f_Salmon(f_alpha_4);
    }
    // BLACK MATTE V1
    else if (is_Black_1 == true) {
        blendMode(NORMAL);
        fill(0, f_alpha_4 * 1.5);
    }
    // BLACK MATTE V2
    else if (is_Black_2 == true) {
        blendMode(NORMAL);
        f_OffBlack(f_alpha_4 * 1.2);
    }
    // NEON V1
    else if (is_Neon_1 == true) {
        blendMode(SCREEN);
        brush_palette_1(f_alpha_1);
    }
    // NEON V2
    else if (is_Neon_2 == true) {
        blendMode(SCREEN);
        brush_palette_1(f_alpha_1);
    }
    // NEON V3
    else if (is_Neon_3 == true) {
        blendMode(SCREEN);
        brush_palette_1(f_alpha_1);
    }
    // OFF-WHITE 
    else if (is_White_1 == true) {
        blendMode(NORMAL);
        f_OffWhite(f_alpha_1);
    }
    // COLD WHITE
    else if (is_White_2 == true) {
        blendMode(SCREEN);
        fill(255, f_alpha_1 * 1.5);
    }
    // NEON GREEN
    else if (is_Green_1 == true || is_Green_2 == true) {
        blendMode(SCREEN);
        fill(144, 226, 77, f_alpha_1 * 1.5);
    }
}

function b_SecShape_cols() {
    
    // RED SEMI-NEON
    if (is_Red_1 == true) {
        blendMode(SCREEN);
        fill(225, 0, 0, f_alpha_5);
    }
    // RED MATTE
    else if (is_Red_2 == true) {
        blendMode(NORMAL);
        fill(255, 5, 0, f_alpha_5);
    }
    // ORANGE
    else if (is_Orange_1 == true || is_Orange_2 == true) {
        blendMode(SCREEN);
        fill(255, 40, 0, f_alpha_5 * 2);
    }
    // BLUE SEMI-NEON
    else if (is_Blue_1 == true || is_Blue_3 == true) {
        blendMode(NORMAL);
        fill(0, 220, 255, f_alpha_5 * 1.6);
    }
    // BLUE MATTE
    else if (is_Blue_2 == true) {
        blendMode(NORMAL);
        fill(0, 220, 255, f_alpha_5 * 1.6);
    }
    // PURPLE SEMI-NEON
    else if (is_Purple_1 == true || is_Purple_2 == true) {
        blendMode(SCREEN);
        fill(140, 97, 255, f_alpha_5 * 1.6);
    }
    // YELLOW SEMI-NEON
    else if (is_Yellow_1 == true || is_Yellow_3 == true) {
        blendMode(SCREEN);
        fill(255, 200, 0, f_alpha_5 * 2);
    }
    // YELLOW SEMI-NEON
    else if (is_Yellow_4 == true) {
        blendMode(SCREEN);
        fill(0, 220, 255, f_alpha_5 * 1.6);
    }
    // YELLOW MATTE
    else if (is_Yellow_2 == true) {
        blendMode(NORMAL);
        fill(255, 210, 73, f_alpha_5 * 1.5);
    }
    // GOLD NEON
    else if (is_Gold_1 == true) {
        blendMode(SCREEN);
        f_Orange(f_alpha_5);
    }
    // BRONZE
    else if (is_Bronze_1 == true) {
        blendMode(SCREEN);
        f_AttackShips(f_alpha_5 * 1.2);
    }
    // BLACK MATTE V1
    else if (is_Black_1 == true) {
        blendMode(NORMAL);
        fill(5, f_alpha_5 * 1.5);
    }
    // BLACK MATTE V2
    else if (is_Black_2 == true) {
        blendMode(NORMAL);
        f_OffBlack(f_alpha_5);
    }
    // NEON V1
    else if (is_Neon_1 == true) {
        blendMode(SCREEN);
        brush_palette_2(f_alpha_2);
    }
    // NEON V2
    else if (is_Neon_2 == true) {
        blendMode(SCREEN);
        brush_palette_1(f_alpha_2);
    }
    // NEON V3
    else if (is_Neon_3 == true) {
        blendMode(SCREEN);
        brush_palette_1(f_alpha_2);
    }
    // OFF-WHITE
    else if (is_White_1 == true) {
        blendMode(SCREEN);
        fill(255, f_alpha_2);
    }
    // COLD WHITE
    else if (is_White_2 == true) {
        blendMode(SCREEN);
        f_ShoulderOfOrion(f_alpha_2 * 2);
    }
    // NEON GREEN
    else if (is_Green_1 == true || is_Green_2 == true) {
        blendMode(SCREEN);
        fill(30, 155, 25, f_alpha_2 * 1.5);
    }
}

function b_DotsFill_cols() {
    
    // RED SEMI-NEON
    if (is_Red_1 == true) { 
        blendMode(NORMAL);
        f_Reds(f_alpha_6);
    }
    // RED MATTE
    else if (is_Red_2 == true) { 
        blendMode(NORMAL);
        f_Red_189(f_alpha_6);
    }
    // ORANGE
    else if (is_Orange_1 == true || is_Orange_2 == true) { 
        blendMode(OVERLAY);
        f_Orange(f_alpha_6);
    }
    // BLUE SEMI-NEON
    else if (is_Blue_1 == true || is_Blue_3 == true) {
        blendMode(NORMAL);
        fill(0, 200, 255, f_alpha_6);
    }
    // BLUE MATTE
    else if (is_Blue_2 == true) {
        blendMode(NORMAL);
        fill(0, 200, 255, f_alpha_6);
    }
    // PURPLE SEMI-NEON
    else if (is_Purple_1 == true || is_Purple_2 == true) {
        blendMode(SCREEN);
        f_Purples(f_alpha_6);
    }
    // YELLOW SEMI-NEON
    else if (is_Yellow_1 == true || is_Yellow_3 == true || is_Yellow_4 == true) {
        blendMode(NORMAL);
        fill(255, 230, 73, f_alpha_6);
    }
    // YELLOW MATTE
    else if (is_Yellow_2 == true) {
        blendMode(NORMAL);
        f_Yellow_SN(f_alpha_6);
    }
    // GOLD NEON
    else if (is_Gold_1 == true) {
        blendMode(SCREEN);
        f_Orange(f_alpha_6);
    }
    // BRONZE
    else if (is_Bronze_1 == true) {
        blendMode(SCREEN);
        f_OnFire(f_alpha_6);
    }
    // BLACK MATTE V1
    else if (is_Black_1 == true) {
        blendMode(NORMAL);
        fill(0, f_alpha_6 * 2);
    }
    // BLACK MATTE V2
    else if (is_Black_2 == true) {
        blendMode(SCREEN);
        fill(255, f_alpha_6 * 3);
    }
    // NEON V1
    else if (is_Neon_1 == true) {
        blendMode(SCREEN);
        brush_palette_3(f_alpha_3);
    }
    // NEON V2
    else if (is_Neon_2 == true) {
        blendMode(SCREEN);
        brush_palette_3(f_alpha_3);
    }
    // NEON V3
    else if (is_Neon_3 == true) {
        blendMode(SCREEN);
        brush_palette_1(f_alpha_3);
    }
    // OFF-WHITE
    else if (is_White_1 == true) {
        blendMode(SCREEN);
        f_SandBones(f_alpha_3);
    }
    // COLD WHITE
    else if (is_White_2 == true) {
        blendMode(SCREEN);
        fill(255, f_alpha_3);
    }
    // NEON GREEN
    else if (is_Green_1 == true || is_Green_2 == true) {
        blendMode(SCREEN);
        f_Green(f_alpha_3);
    }
}

function b_DotsStr1_cols() {
    
    noFill();
    strokeWeight(st_we_1);
    
    // RED 
    if (is_Red_1 == true) {
        blendMode(NORMAL);
        s_Red_189();
    }
    // RED MATTE
    else if (is_Red_2 == true) {
        blendMode(NORMAL);
        s_Red_215();
    }
    // ORANGE
    else if (is_Orange_1 == true || is_Orange_2 == true) { 
        blendMode(NORMAL);
        stroke(255, 155, 0);
    }
    // BLUE SEMI-NEON
    else if (is_Blue_1 == true || is_Blue_3 == true) {
        blendMode(NORMAL);
        stroke(0, 200, 255);
    }
    // BLUE MATTE
    else if (is_Blue_2 == true) {
        blendMode(NORMAL);
        stroke(0, 200, 255);
    }
    // PURPLE SEMI-NEON
    else if (is_Purple_1 == true || is_Purple_2 == true) {
        blendMode(SCREEN);
        s_Purples();
    }
    // YELLOW SEMI-NEON
    else if (is_Yellow_1 == true || is_Yellow_3 == true || is_Yellow_4 == true) {
        blendMode(OVERLAY);
        s_Yellow();
    }
    // YELLOW MATTE
    else if (is_Yellow_2 == true) {
        blendMode(NORMAL);
        s_Yellow();
    }
    // GOLD NEON
    else if (is_Gold_1 == true) {
        blendMode(SCREEN);
        s_OnFire();
    }
    // BRONZE
    else if (is_Bronze_1 == true) {
        blendMode(SCREEN);
        s_Pink();
    }
    // BLACK MATTE V1
    else if (is_Black_1 == true) {
        blendMode(NORMAL);
        s_Black();
    }
    // BLACK MATTE V2
    else if (is_Black_2 == true) {
        blendMode(NORMAL);
        s_Black();
    }
    // NEON V1
    else if (is_Neon_1 == true) {
        blendMode(SCREEN);
        stroke_palette_3();
    }
    // NEON V2
    else if (is_Neon_2 == true) {
        blendMode(SCREEN);
        stroke_palette_3();
    }
    // NEON V3
    else if (is_Neon_3 == true) {
        blendMode(SCREEN);
        stroke_palette_3();
    }
    // OFF-WHITE
    else if (is_White_1 == true) {
        blendMode(SCREEN);
        s_Whiteish();
    }
    // COLD WHITE
    else if (is_White_2 == true) {
        blendMode(SCREEN);
        stroke(255);
    }
    // NEON GREEN
    else if (is_Green_1 == true || is_Green_2 == true) {
        blendMode(NORMAL);
        s_Green();
    }
}

function b_DotsStr2_cols() {
    
    strokeWeight(st_we_2);
    
    // RED SEMI-NEON
    if (is_Red_1 == true) { 
        blendMode(NORMAL);
        s_Red_215();
    }
    // RED MATTE
    else if (is_Red_2 == true) { 
        blendMode(NORMAL);
        s_Reds();
    }
    // ORANGE
    else if (is_Orange_1 == true || is_Orange_2 == true) { 
        blendMode(NORMAL);
        s_Orange();
    }
    // BLUE SEMI-NEON
    else if (is_Blue_1 == true || is_Blue_3 == true) {
        blendMode(NORMAL);
        stroke(196, 240, 255);
    }
    // BLUE MATTE
    else if (is_Blue_2 == true) {
        blendMode(NORMAL);
        stroke(0, 240, 255);
    }
    // PURPLE SEMI-NEON
    else if (is_Purple_1 == true || is_Purple_2 == true) {
        blendMode(SCREEN);
        s_Lavender();
    }
    // YELLOW SEMI-NEON
    else if (is_Yellow_1 == true || is_Yellow_3 == true) {
        blendMode(SCREEN);
        s_Yellow();
    }
    // YELLOW SEMI-NEON
    else if (is_Yellow_4 == true) {
        blendMode(SCREEN);
        stroke(0, 240, 255);
    }
    // YELLOW MATTE
    else if (is_Yellow_2 == true) {
        blendMode(SCREEN);
        s_OnFire();
    }
    // GOLD NEON
    else if (is_Gold_1 == true) {
        blendMode(NORMAL);
        s_Orange();
    }
    // BRONZE
    else if (is_Bronze_1 == true) {
        blendMode(SCREEN);
        s_GlitterInTheDark();
    }
    // BLACK MATTE V1
    else if (is_Black_1 == true) {
        blendMode(NORMAL);
        s_OffBlack();
    }
    // BLACK MATTE V2
    else if (is_Black_2 == true) {
        blendMode(NORMAL);
        //s_TimeToDie();
        s_OffBlack();
    }
    // NEON V1
    else if (is_Neon_1 == true) {
        blendMode(SCREEN);
        stroke_palette_4();
    }
    // NEON V2
    else if (is_Neon_2 == true) {
        blendMode(SCREEN);
        stroke_palette_4();
    }
    // NEON V3
    else if (is_Neon_3 == true) {
        blendMode(SCREEN);
        stroke_palette_4();
    }
    // OFF-WHITE
    else if (is_White_1 == true) {
        blendMode(SCREEN);
        s_OffWhite();
    }
    // COLD WHITE
    else if (is_White_2 == true) {
        blendMode(SCREEN);
        stroke(255);
    }
    // NEON GREEN
    else if (is_Green_1 == true || is_Green_2 == true) {
        blendMode(SCREEN);
        s_Green_SN();
    }
}


// >>> STROKES <<<
function s_Montero() {
    let montero = ['#ffb84d', '#f2e9e4', '#e0fbfc', '#b8bedd', '#0d3b9a', '#999df2', '#ffcfdf'];
    let index = montero[int(random(0, montero.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_MemoriesOfGreen() {
    let memories = ['#e8f48e', '#70731f', '#7f7340', '#efeeb4', '#e0f9b5', '#3e451b'];
    let index = memories[int(random(0, memories.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_TimeToDie() {
    let time = ['#fffcca', '#132238', '#360f33', '#e0f9b5', '#f2f2ff', '#b8bedd', '#fff6f6'];
    let index = time[int(random(0, time.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_OnFire() {
    let fire = ['#fff89d', '#ffb84d', '#ffda4a', '#fcd69a', '#e98e10', '#ffe2ad', '#ffc93c', '#fefdca'];
    let index = fire[int(random(0, fire.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_ShoulderOfOrion() {
    let orion = ['#829eea', '#8dc6ff', '#677bdd', '#d6dff8', '#ffcfdf', '#0d3b9a', '#939be8', '#00dffc'];
    let index = orion[int(random(0, orion.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Lavender() {
    let lavender = ['#ddacf5', '#b693fe', '#f2d7ee', '#b8bedd', '#fec3f0', '#8971d0', '#d291bc'];
    let index = lavender[int(random(0, lavender.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Pink() {
    let pink = ['#930077', '#fc5c9c', '#ff8885', '#d527b7', '#ff165d', '#f29999'];
    let index = pink[int(random(0, pink.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Sky() {
    let sky = ['#2a6fdb', '#00dffc', '#0000BD', '#a2cdf2', '#6fffe9', '#e0fbfc', '#e1f3f6'];
    let index = sky[int(random(0, sky.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Purples() {
    let purples = ['#8c61ff', '#301551', '#613873', '#a5668b', '#f05cf2', '#9e579d', '#ba6375'];
    let index = purples[int(random(0, purples.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Salmon() {
    let salmon = ['#e03e36', '#ff847b', '#ff7c38', '#ff755e', '#e84a5f', '#ff5722', '#ff6464'];
    let index = salmon[int(random(0, salmon.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Gardenias() {
    let gardenias = ['#ffffff', '#e8ffe8', '#679436', '#f8f991', '#fefcbf', '#e4fffe', '#f7fbfc'];
    let index = gardenias[int(random(0, gardenias.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Tuscany() {
    let tuscany = ['#fefcbf', '#ecd078', '#a64521', '#d99e30', '#bf8f65', '#8fa364', '#ffb997'];
    let index = tuscany[int(random(0, tuscany.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Bucarito() {
    let bucarito = ['#ff6f3c', '#ffbd39', '#ffc7c7', '#70731f', '#102ebb', '#dcedc2', '#bf8f65'];
    let index = bucarito[int(random(0, bucarito.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Blues() {
    let blues = ['#122c91', '#2a6fdb', '#00dffc', '#022873', '#1b3da6', '#06aed5', '#0d2c54', '#1c82eb', '#ffffff'];
    let index = blues[int(random(0, blues.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_OffBlack() {
    let black = ['#000000', '#212121', '#132238', '#1c140d', '#071526', '#0d0d0d', '#323232', '#360f33', '#1b1b1e', '#080705'];
    let index = black[int(random(0, black.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_AttackShips() {
    let attack = ['#FB0002', '#f20505', '#AD0327', '#ffffff', '#ffb84d', '#D72D41', '#ff7c38', '#FFA5A5'];
    let index = attack[int(random(0, attack.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Reds() {
    let reds = ['#f20505', '#FB0002', '#dd1c1a', '#a80038', '#dd1400', '#a60303', '#dd1c1a'];
    let index = reds[int(random(0, reds.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Green() { 
    let green = ['#c7f464', '#efffcd', '#dce9be', '#f0fff0', '#fbfef5', '#d8f1a0', '#00ff00', '#e6f6c2'];
    let index = green[int(random(0, green.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Green_SN() {
    let c = color ('#aee239');
    c.setAlpha(s_opa);
    stroke(c);
}

function s_SandBones() {
    let sand = ['#f7e4be', '#faf3dd', '#fcecc3', '#d9b787', '#fee9b0', '#fff9d6', '#fcefee', '#fef2c5'];
    let index = sand[int(random(0, sand.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_OffWhite() {
    let offWhite = ['#ffffff', '#f2e9e1', '#f9f2e7', '#f2f1df', '#f2e6d8', '#fdfffc', '#f9f4e4'];
    let index = offWhite[int(random(0, offWhite.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Orange() {
    let orange = ['#ff740f', '#fa6900', '#ffa822', '#fa9300', '#ffa64c', '#fa6900'];
    let index = orange[int(random(0, orange.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_GlitterInTheDark() {
    let glitter = ['#ffff8f', '#ffbe00', '#eeeeee', '#ffdcf5', '#e3fdfd', '#fefdca', '#fdfd00', '#ffc4e1'];
    let index = glitter[int(random(0, glitter.length))];
    let c = color (index);
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Red_189() {
    let c = color ('#BD0000');
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Red_215() {
    let c = color ('#FF0000');
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Red_235() {
    let c = color ('#EB0000');
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Blue_189() {
    let c = color ('#0000BD');
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Blue_215() {
    let c = color ('#0000D7');
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Whiteish() {
    let c = color ('#F5F5F5');
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Klein_1() {
    let c = color ('#002FA7');
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Klein_2() {
    let c = color ('#0043BB');
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Yellow() {
    let c = color ('#fde74c');
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Black() {
    let c = color ('#000000');
    c.setAlpha(s_opa);
    stroke(c);
}

function s_Yellow_SN() {
    let c = color ('#ffc60c');
    c.setAlpha(s_opa);
    stroke(c);
}

function s_White() {
    let c = color ('#ffffff');
    c.setAlpha(s_opa);
    stroke(c);
}


// >>> PICK STROKES <<<
function stroke_palette_1() {
    if (s_palette_1 == 1) return s_AttackShips();
    if (s_palette_1 == 2) return s_Montero();
    if (s_palette_1 == 3) return s_MemoriesOfGreen();
    if (s_palette_1 == 4) return s_OnFire();
    if (s_palette_1 == 5) return s_ShoulderOfOrion();
    if (s_palette_1 == 6) return s_GlitterInTheDark();
    if (s_palette_1 == 7) return s_TimeToDie();
    if (s_palette_1 == 8) return s_Bucarito();
    if (s_palette_1 == 9) return s_Lavender();
    if (s_palette_1 == 10) return s_Pink();
    if (s_palette_1 == 11) return s_Sky();
    if (s_palette_1 == 12) return s_Green();
    if (s_palette_1 == 13) return s_Purples();
    if (s_palette_1 == 14) return s_Salmon();
    if (s_palette_1 == 15) return s_Blues();
    if (s_palette_1 == 16) return s_SandBones();
    if (s_palette_1 == 17) return s_Tuscany();
    if (s_palette_1 == 18) return s_OffWhite();
    if (s_palette_1 == 19) return s_Orange();
    if (s_palette_1 == 20) return s_Gardenias();
}

function stroke_palette_2() {
    if (s_palette_2 == 1) return s_AttackShips();
    if (s_palette_2 == 2) return s_Montero();
    if (s_palette_2 == 3) return s_MemoriesOfGreen();
    if (s_palette_2 == 4) return s_OnFire();
    if (s_palette_2 == 5) return s_ShoulderOfOrion();
    if (s_palette_2 == 6) return s_GlitterInTheDark();
    if (s_palette_2 == 7) return s_TimeToDie();
    if (s_palette_2 == 8) return s_Bucarito();
    if (s_palette_2 == 9) return s_Lavender();
    if (s_palette_2 == 10) return s_Pink();
    if (s_palette_2 == 11) return s_Sky();
    if (s_palette_2 == 12) return s_Green();
    if (s_palette_2 == 13) return s_Purples();
    if (s_palette_2 == 14) return s_Salmon();
    if (s_palette_2 == 15) return s_Blues();
    if (s_palette_2 == 16) return s_Tuscany();
    if (s_palette_2 == 17) return s_SandBones();
    if (s_palette_2 == 18) return s_Gardenias();
    if (s_palette_2 == 19) return s_OffWhite();
    if (s_palette_2 == 20) return s_Orange();
}

function stroke_palette_3() {
    if (s_palette_3 == 1) return s_AttackShips();
    if (s_palette_3 == 2) return s_Montero();
    if (s_palette_3 == 3) return s_MemoriesOfGreen();
    if (s_palette_3 == 4) return s_OnFire();
    if (s_palette_3 == 5) return s_ShoulderOfOrion();
    if (s_palette_3 == 6) return s_GlitterInTheDark();
    if (s_palette_3 == 7) return s_TimeToDie();
    if (s_palette_3 == 8) return s_Bucarito();
    if (s_palette_3 == 9) return s_Lavender();
    if (s_palette_3 == 10) return s_Pink();
    if (s_palette_3 == 11) return s_Sky();
    if (s_palette_3 == 12) return s_Green();
    if (s_palette_3 == 13) return s_Purples();
    if (s_palette_3 == 14) return s_Salmon();
    if (s_palette_3 == 15) return s_Blues();
    if (s_palette_3 == 16) return s_Tuscany();
    if (s_palette_3 == 17) return s_SandBones();
    if (s_palette_3 == 18) return s_Gardenias();
    if (s_palette_3 == 19) return s_OffWhite();
    if (s_palette_3 == 20) return s_Orange();
}

function stroke_palette_4() {
    if (s_palette_4 == 1) return s_AttackShips();
    if (s_palette_4 == 2) return s_Montero();
    if (s_palette_4 == 3) return s_MemoriesOfGreen();
    if (s_palette_4 == 4) return s_OnFire();
    if (s_palette_4 == 5) return s_ShoulderOfOrion();
    if (s_palette_4 == 6) return s_GlitterInTheDark();
    if (s_palette_4 == 7) return s_TimeToDie();
    if (s_palette_4 == 8) return s_Bucarito();
    if (s_palette_4 == 9) return s_Lavender();
    if (s_palette_4 == 10) return s_Pink();
    if (s_palette_4 == 11) return s_Sky();
    if (s_palette_4 == 12) return s_Green();
    if (s_palette_4 == 13) return s_Purples();
    if (s_palette_4 == 14) return s_Salmon();
    if (s_palette_4 == 15) return s_Blues();
    if (s_palette_4 == 16) return s_Tuscany();
    if (s_palette_4 == 17) return s_SandBones();
    if (s_palette_4 == 18) return s_Gardenias();
    if (s_palette_4 == 19) return s_OffWhite();
    if (s_palette_4 == 20) return s_Orange();
}

function hair_palette_1() {
    if (h_palette_1 == 1) return s_Red_189(); 
    if (h_palette_1 == 2) return s_MemoriesOfGreen();
    if (h_palette_1 == 3) return s_Pink();
    if (h_palette_1 == 4) return s_OnFire();
    if (h_palette_1 == 5) return s_Red_215();
    if (h_palette_1 == 6) return s_Pink();
    if (h_palette_1 == 7) return s_Salmon();
    if (h_palette_1 == 8) return s_Purples();
    if (h_palette_1 == 9) return s_Pink();
    if (h_palette_1 == 10) return s_Klein_2();
    if (h_palette_1 == 11) return s_Purples();
    if (h_palette_1 == 12) return s_Blue_189();
    if (h_palette_1 == 13) return s_Blue_215();
    if (h_palette_1 == 14) return s_Blues();
    if (h_palette_1 == 15) return s_Green();
    if (h_palette_1 == 16) return s_Reds();
    if (h_palette_1 == 17) return s_Klein_1();
}

function hair_palette_2() {
    if (h_palette_2 == 1) return s_Blue_215();
    if (h_palette_2 == 2) return s_MemoriesOfGreen();
    if (h_palette_2 == 3) return s_Blues();
    if (h_palette_2 == 4) return s_AttackShips();
    if (h_palette_2 == 5) return s_OnFire();
    if (h_palette_2 == 6) return s_AttackShips();
    if (h_palette_2 == 7) return s_Blue_189();
    if (h_palette_2 == 8) return s_Pink();
    if (h_palette_2 == 9) return s_Purples();
    if (h_palette_2 == 10) return s_Pink();
    if (h_palette_2 == 11) return s_Red_189();
    if (h_palette_2 == 12) return s_Purples();
    if (h_palette_2 == 13) return s_Salmon();
    if (h_palette_2 == 14) return s_Red_235();
    if (h_palette_2 == 15) return s_Orange();
    if (h_palette_2 == 16) return s_Red_215();
    if (h_palette_2 == 17) return s_Reds();
    if (h_palette_2 == 18) return s_MemoriesOfGreen();
}

function hair_palette_3() {
    if (h_palette_3 == 1) return s_Klein_1();
    if (h_palette_3 == 2) return s_Purples();
    if (h_palette_3 == 3) return s_Green();
    if (h_palette_3 == 4) return s_Pink();
    if (h_palette_3 == 5) return s_Red_189();
    if (h_palette_3 == 6) return s_OnFire();
    if (h_palette_3 == 7) return s_Salmon();
    if (h_palette_3 == 8) return s_Orange();
    if (h_palette_3 == 9) return s_Red_215();
    if (h_palette_3 == 10) return s_Reds();
    if (h_palette_3 == 11) return s_Blues();
    if (h_palette_3 == 12) return s_Blue_189();
    if (h_palette_3 == 13) return s_Klein_2();
    if (h_palette_3 == 14) return s_Red_235();
    if (h_palette_3 == 15) return s_Red_189();
}


function hair_palette_Red_N() {
    if (h_palette_R_N == 1) return s_Klein_1();
    if (h_palette_R_N == 2) return s_Klein_2();
    if (h_palette_R_N == 3) return s_Orange();
    if (h_palette_R_N == 4) return s_Blues();  
    if (h_palette_R_N == 5) return s_Reds();
    if (h_palette_R_N == 6) return s_Blue_189();
    if (h_palette_R_N == 7) return s_Black();
}

function hair_palette_Red_M() {
    if (h_palette_R_M == 1) return s_Klein_2();
    if (h_palette_R_M == 2) return s_Pink();;
    if (h_palette_R_M == 3) return s_Klein_1();
    if (h_palette_R_M == 4) return s_Orange();
    if (h_palette_R_M == 5) return s_Blues();
    if (h_palette_R_M == 6) return s_Blue_189();
    if (h_palette_R_M == 7) return s_Black();
}

function hair_palette_Blue_N() {
    if (h_palette_B_N == 1) return s_Red_215();
    if (h_palette_B_N == 2) return s_Purples();
    if (h_palette_B_N == 3) return s_Reds();
    if (h_palette_B_N == 4) return s_Pink(); 
    if (h_palette_B_N == 5) return s_Blues();
    if (h_palette_B_N == 6) return s_Red_189();
    if (h_palette_B_N == 7) return s_Black();
}

function hair_palette_Blue_M() {
    if (h_palette_B_M == 1) return s_Red_189();
    if (h_palette_B_M == 2) return s_Pink();
    if (h_palette_B_M == 3) return s_Reds();
    if (h_palette_B_M == 4) return s_Orange();
    if (h_palette_B_M == 5) return s_Klein_2();
    if (h_palette_B_M == 6) return s_Blues();
    if (h_palette_B_M == 7) return s_Black();
}

function hair_palette_Yellow_N() {
    if (h_palette_Y_N == 1) return s_Salmon();
    if (h_palette_Y_N == 2) return s_Red_215();
    if (h_palette_Y_N == 3) return s_Pink();
    if (h_palette_Y_N == 4) return s_Blues();
    if (h_palette_Y_N == 5) return s_Red_189();
    if (h_palette_Y_N == 6) return s_Reds();
    if (h_palette_Y_N == 7) return s_Black();
}

function hair_palette_Yellow_M() {
    if (h_palette_Y_M == 1) return s_Salmon();
    if (h_palette_Y_M == 2) return s_Pink();
    if (h_palette_Y_M == 3) return s_Reds();
    if (h_palette_Y_M == 4) return s_Red_189();
    if (h_palette_Y_M == 5) return s_Blues();
    if (h_palette_Y_M == 6) return s_Purples();
    if (h_palette_Y_M == 7) return s_Black();
}

function hair_palette_Orange_N() {
    if (h_palette_O_N == 1) return s_Klein_1();
    if (h_palette_O_N == 2) return s_Pink();
    if (h_palette_O_N == 3) return s_Salmon();
    if (h_palette_O_N == 4) return s_Red_215();
    if (h_palette_O_N == 5) return s_Blue_189();
    if (h_palette_O_N == 6) return s_Red_189();
    if (h_palette_O_N == 7) return s_Blues();
}

function hair_palette_Gold_N() {
    if (h_palette_Go_N == 1) return s_Klein_1();
    if (h_palette_Go_N == 2) return s_Blue_189();
    if (h_palette_Go_N == 3) return s_Pink();
    if (h_palette_Go_N == 4) return s_Red_235();
    if (h_palette_Go_N == 5) return s_Orange();
    if (h_palette_Go_N == 6) return s_Salmon();
    if (h_palette_Go_N == 7) return s_Black();
}

function hair_palette_Gren_N() {
    if (h_palette_Gr_N == 1) return s_Klein_1();
    if (h_palette_Gr_N == 2) return s_Reds();
    if (h_palette_Gr_N == 3) return s_Red_189();
    if (h_palette_Gr_N == 4) return s_Red_215();
    if (h_palette_Gr_N == 5) return s_Orange();
    if (h_palette_Gr_N == 6) return s_Blues();
    if (h_palette_Gr_N == 7) return s_Blue_189();
}

function hair_palette_OffWhite_1() {
    if (h_palette_OW_N == 1) return s_Red_189();
    if (h_palette_OW_N == 2) return s_Blue_189();
    if (h_palette_OW_N == 3) return s_Pink();
    if (h_palette_OW_N == 4) return s_Red_215();
    if (h_palette_OW_N == 5) return s_Purples();
    if (h_palette_OW_N == 6) return s_Blues();
    if (h_palette_OW_N == 7) return s_MemoriesOfGreen();
}

function hair_palette_OffWhite_2() {
    if (h_palette_OW_N == 1) return s_Klein_1();
    if (h_palette_OW_N == 2) return s_Klein_2();
    if (h_palette_OW_N == 3) return s_Pink();
    if (h_palette_OW_N == 4) return s_Red_215();
    if (h_palette_OW_N == 5) return s_Purples();
    if (h_palette_OW_N == 6) return s_Blues();
    if (h_palette_OW_N == 7) return s_Red_189();
}

function hair_palette_ColdWhite_1() {
    if (h_palette_CW_N == 1) return s_Red_189();
    if (h_palette_CW_N == 2) return s_Red_215();
    if (h_palette_CW_N == 3) return s_Purples();
    if (h_palette_CW_N == 4) return s_Blues();
    if (h_palette_CW_N == 5) return s_Klein_1(); 
    if (h_palette_CW_N == 6) return s_Blue_189();
    if (h_palette_CW_N == 7) return s_Reds();
}

function hair_palette_ColdWhite_2() {
    if (h_palette_CW_N == 1) return s_Klein_1();
    if (h_palette_CW_N == 2) return s_Klein_2();
    if (h_palette_CW_N == 3) return s_Pink();
    if (h_palette_CW_N == 4) return s_Red_215();
    if (h_palette_CW_N == 5) return s_Purples();
    if (h_palette_CW_N == 6) return s_Blues();
    if (h_palette_CW_N == 7) return s_Reds();
}

function hair_palette_Black() {
    if (h_palette_Bck_M == 1) return s_Klein_1();
    if (h_palette_Bck_M == 2) return s_Klein_2();
    if (h_palette_Bck_M == 3) return s_Pink();
    if (h_palette_Bck_M == 4) return s_Red_215();
    if (h_palette_Bck_M == 5) return s_Purples();
    if (h_palette_Bck_M == 6) return s_Blues();
    if (h_palette_Bck_M == 7) return s_AttackShips();
    if (h_palette_Bck_M == 8) return s_Salmon();
    if (h_palette_Bck_M == 9) return s_Red_189();
    if (h_palette_Bck_M == 10) return s_Reds();
    if (h_palette_Bck_M == 11) return s_Orange();
    if (h_palette_Bck_M == 12) return s_Green_SN();
}

function hair_palette_Black_2() {
    if (h_palette_Bck_M2 == 1) return s_Red_215();
    if (h_palette_Bck_M2 == 2) return s_Pink();
    if (h_palette_Bck_M2 == 3) return s_Blue_189();
    if (h_palette_Bck_M2 == 4) return s_Purples();
    if (h_palette_Bck_M2 == 5) return s_Orange();
    if (h_palette_Bck_M2 == 6) return s_Red_189();
    if (h_palette_Bck_M2 == 7) return s_Red_215();
    if (h_palette_Bck_M2 == 8) return s_Klein_2();
    if (h_palette_Bck_M2 == 9) return s_Klein_1();
    if (h_palette_Bck_M2 == 10) return s_Blues();
    if (h_palette_Bck_M2 == 11) return s_Salmon();
    if (h_palette_Bck_M2 == 12) return s_Reds();
}


// >>> FILLS <<<
function f_Montero(opa) {
    let montero = ['#ffb84d', '#f2e9e4', '#e0fbfc', '#b8bedd', '#0d3b9a', '#999df2', '#ffcfdf'];
    let index = montero[int(random(0, montero.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_MemoriesOfGreen(opa) {
    let memories = ['#e8f48e', '#70731f', '#7f7340', '#efeeb4', '#e0f9b5', '#3e451b'];
    let index = memories[int(random(0, memories.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_TimeToDie(opa) {
    let time = ['#fffcca', '#132238', '#360f33', '#e0f9b5', '#f2f2ff', '#b8bedd', '#fff6f6'];
    let index = time[int(random(0, time.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_OnFire(opa) {
    let fire = ['#fff89d', '#ffb84d', '#ffda4a', '#fcd69a', '#e98e10', '#ffe2ad', '#ffc93c', '#fefdca'];
    let index = fire[int(random(0, fire.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_ShoulderOfOrion(opa) {
    let orion = ['#829eea', '#8dc6ff', '#677bdd', '#d6dff8', '#ffcfdf', '#0d3b9a', '#939be8', '#00dffc'];
    let index = orion[int(random(0, orion.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_AllThoseMoments(opa) {
    let moments = ['#c7f3ff', '#a6fff2', '#e8f48e', '#fffefa', '#b693fe', '#e3fdfd'];
    let index = moments[int(random(0, moments.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_Monet(opa) {
    let monet = ['#aedefc', '#ffa700', '#FDDA0D', '#40826d', '#70731f', '#2a6fdb', '#1c82eb', '#e32636', '#E34234', '#1c140d'];
    let index = monet[int(random(0, monet.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_Lavender(opa) {
    let lavender = ['#ddacf5', '#b693fe', '#f2d7ee', '#b8bedd', '#fec3f0', '#8971d0', '#d291bc'];
    let index = lavender[int(random(0, lavender.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_Pink(opa) {
    let pink = ['#930077', '#fc5c9c', '#ff8885', '#d527b7', '#ff165d', '#f29999'];
    let index = pink[int(random(0, pink.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_Sky(opa) {
    let sky = ['#2a6fdb', '#00dffc', '#0000BD', '#a2cdf2', '#6fffe9', '#e0fbfc', '#e1f3f6'];
    let index = sky[int(random(0, sky.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_Purples(opa) {
    let purples = ['#8c61ff', '#301551', '#613873', '#a5668b', '#f05cf2', '#9e579d', '#ba6375'];
    let index = purples[int(random(0, purples.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_Salmon(opa) {
    let salmon = ['#e03e36', '#ff847b', '#ff7c38', '#ff755e', '#e84a5f', '#ff5722', '#ff6464'];
    let index = salmon[int(random(0, salmon.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_Gardenias(opa) {
    let gardenias = ['#ffffff', '#e8ffe8', '#679436', '#f8f991', '#fefcbf', '#e4fffe', '#f7fbfc'];
    let index = gardenias[int(random(0, gardenias.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_Tuscany(opa) {
    let tuscany = ['#fefcbf', '#ecd078', '#a64521', '#d99e30', '#bf8f65', '#8fa364', '#ffb997'];
    let index = tuscany[int(random(0, tuscany.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_Bucarito(opa) {
    let bucarito = ['#ff6f3c', '#ffbd39', '#ffc7c7', '#70731f', '#102ebb', '#dcedc2', '#bf8f65'];
    let index = bucarito[int(random(0, bucarito.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_Blues(opa) {
    let blues = ['#122c91', '#2a6fdb', '#00dffc', '#022873', '#1b3da6', '#06aed5', '#0d2c54', '#1c82eb', '#ffffff'];
    let index = blues[int(random(0, blues.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_OffBlack(opa) {
    let black = ['#000000', '#212121', '#132238', '#1c140d', '#071526', '#0d0d0d', '#323232', '#360f33', '#1b1b1e', '#080705'];
    let index = black[int(random(0, black.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_AttackShips(opa) {
    let attack = ['#FB0002', '#f20505', '#AD0327', '#ffffff', '#ffb84d', '#D72D41', '#ff7c38', '#FFA5A5'];
    let index = attack[int(random(0, attack.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_Reds(opa) {
    let reds = ['#f20505', '#FB0002', '#dd1c1a', '#a80038', '#dd1400', '#a60303', '#dd1c1a'];
    let index = reds[int(random(0, reds.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_Green(opa) {
    let green = ['#c7f464', '#efffcd', '#dce9be', '#f0fff0', '#fbfef5', '#d8f1a0', '#00ff00', '#e6f6c2'];
    let index = green[int(random(0, green.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_SandBones(opa) {
    let sand = ['#f7e4be', '#faf3dd', '#fcecc3', '#d9b787', '#fee9b0', '#fff9d6', '#fcefee', '#fef2c5'];
    let index = sand[int(random(0, sand.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_OffWhite(opa) {
    let offWhite = ['#ffffff', '#f2e9e1', '#f9f2e7', '#f2f1df', '#f2e6d8', '#fdfffc', '#f9f4e4'];
    let index = offWhite[int(random(0, offWhite.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_Orange(opa) {
    let orange = ['#ff740f', '#fa6900', '#ffa822', '#fa9300', '#ffa64c', '#fa6900'];
    let index = orange[int(random(0, orange.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_GlitterInTheDark(opa) {
    let glitter = ['#ffff8f', '#ffbe00', '#eeeeee', '#ffdcf5', '#e3fdfd', '#fefdca', '#fdfd00', '#ffc4e1'];
    let index = glitter[int(random(0, glitter.length))];
    let c = color (index);
    c.setAlpha(opa);
    fill(c);
}

function f_Yellow_SN(opa) {
    let c = color ('#ffc60c');
    c.setAlpha(s_opa);
    fill(c);
}

function f_Red_189(opa) {
    let c = color ('#BD0000');
    c.setAlpha(s_opa);
    fill(c);
}


// >>> PICK FILLS <<<
function brush_palette_1(opa) {
    if (b_palette_1 == 1) return f_Montero(opa);
    if (b_palette_1 == 2) return f_MemoriesOfGreen(opa);
    if (b_palette_1 == 3) return f_Pink(opa);
    if (b_palette_1 == 4) return f_OnFire(opa);
    if (b_palette_1 == 5) return f_ShoulderOfOrion(opa);
    if (b_palette_1 == 6) return f_AllThoseMoments(opa);
    if (b_palette_1 == 7) return f_Salmon(opa);
    if (b_palette_1 == 8) return f_Lavender(opa);
    if (b_palette_1 == 9) return f_Pink(opa);
    if (b_palette_1 == 10) return f_Sky(opa);
    if (b_palette_1 == 11) return f_Purples(opa);
    if (b_palette_1 == 12) return f_Gardenias(opa);
    if (b_palette_1 == 13) return f_Tuscany(opa);
    if (b_palette_1 == 14) return f_Blues(opa);
    if (b_palette_1 == 15) return f_Green(opa);
    if (b_palette_1 == 16) return f_SandBones(opa);
    if (b_palette_1 == 17) return f_Montero(opa);
}

function brush_palette_2(opa) {
    if (b_palette_2 == 1) return f_Montero(opa);
    if (b_palette_2 == 2) return f_MemoriesOfGreen(opa);
    if (b_palette_2 == 3) return f_Blues(opa);
    if (b_palette_2 == 4) return f_AttackShips(opa);
    if (b_palette_2 == 5) return f_OnFire(opa);
    if (b_palette_2 == 6) return f_ShoulderOfOrion(opa);
    if (b_palette_2 == 7) return f_AllThoseMoments(opa);
    if (b_palette_2 == 8) return f_OffWhite(opa);
    if (b_palette_2 == 9) return f_Lavender(opa);
    if (b_palette_2 == 10) return f_Pink(opa);
    if (b_palette_2 == 11) return f_Sky(opa); 
    if (b_palette_2 == 12) return f_Purples(opa);
    if (b_palette_2 == 13) return f_Salmon(opa);
    if (b_palette_2 == 14) return f_TimeToDie(opa);
    if (b_palette_2 == 15) return f_Orange(opa);
    if (b_palette_2 == 16) return f_Gardenias(opa);
    if (b_palette_2 == 17) return f_Tuscany(opa);
    if (b_palette_2 == 18) return f_Bucarito(opa);
}

function brush_palette_3(opa) {
    if (b_palette_3 == 1) return f_Montero(opa);
    if (b_palette_3 == 2) return f_MemoriesOfGreen(opa);
    if (b_palette_3 == 3) return f_Blues(opa);
    if (b_palette_3 == 4) return f_AttackShips(opa);
    if (b_palette_3 == 5) return f_OnFire(opa);
    if (b_palette_3 == 6) return f_ShoulderOfOrion(opa);
    if (b_palette_3 == 7) return f_AllThoseMoments(opa);
    if (b_palette_3 == 8) return f_Monet(opa);
    if (b_palette_3 == 9) return f_OffWhite(opa);
    if (b_palette_3 == 10) return f_Lavender(opa);
    if (b_palette_3 == 11) return f_Pink(opa);
    if (b_palette_3 == 12) return f_Sky(opa);
    if (b_palette_3 == 13) return f_Green(opa);
    if (b_palette_3 == 14) return f_Purples(opa);
    if (b_palette_3 == 15) return f_Salmon(opa);
    if (b_palette_3 == 16) return f_Bucarito(opa);
    if (b_palette_3 == 17) return f_Reds(opa);
    if (b_palette_3 == 18) return f_SandBones(opa);
    if (b_palette_3 == 19) return f_Orange(opa);
    if (b_palette_3 == 20) return f_GlitterInTheDark(opa);
    if (b_palette_3 == 21) return f_TimeToDie(opa);
    if (b_palette_3 == 22) return f_Gardenias(opa);
    if (b_palette_3 == 23) return f_Tuscany(opa);
}


function keyPressed() {
    
    if (keyCode == 83 || key == 's' || key == 'S') {
        save('af_' + fxhash + '.png');
    }
    
    // pause animation by pressing the "z" or "Z" key
    if (key == 'x' || key == 'X') {
        noLoop();
	}
    
    // resume animation / render another pass of layers by pressing the "x" or "X" key
    if (key == 'z' || key == 'Z') {
        loop();
	}
    
    // render at pixel densities 1-10
    if (key == 1) {
        pd = 1;
        reset(pd);
        console.log('NEW PD: ' + pixelDensity());    
	}
    else if (key == 2) {
        pd = 2;
        reset(pd);
        console.log('NEW PD: ' + pixelDensity());    
	}
    else if (key == 3) {
        pd = 3;
        reset(pd);
        console.log('NEW PD: ' + pixelDensity());    
	}
    else if (key == 4) {
        pd = 4;
        reset(pd);
        console.log('NEW PD: ' + pixelDensity());      
    }
    else if (key == 5) {
        pd = 5;
        reset(pd);
        console.log('NEW PD: ' + pixelDensity());       
    }
    else if (key == 6) {
        pd = 6;
        reset(pd);
        console.log('NEW PD: ' + pixelDensity());      
    }
    else if (key == 7) {
        pd = 7;
        reset(pd);
        console.log('NEW PD: ' + pixelDensity());       
    }
    else if (key == 8) {
        pd = 8;
        reset(pd);
        console.log('NEW PD: ' + pixelDensity());       
    }
    else if (key == 9) {
        pd = 9;
        reset(pd);
        console.log('NEW PD: ' + pixelDensity());     
    }
    else if (key == 0) {
        pd = 10;
        reset(pd);
        console.log('NEW PD: ' + pixelDensity());    
    }
    
    // render at pixel densities 12.5 & 15
    if (key == 't' || key == 'T') {
        pd = 12.5;
        reset(pd);
        console.log('NEW PD: ' + pixelDensity());   
	}
    
    if (key == 'f' || key == 'F') {
        pd = 15;
        reset(pd);
        console.log('NEW PD: ' + pixelDensity());   
	}
}