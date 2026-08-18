"use strict";
const g_variables = {
	'wire_locations':[],
	'wall_base_locations':[],
};

window.$fxhashFeatures = {};
window.$gen_art = {};

let s_verts_main = [];
let s_cols_main = [];
let frame_verts_sent = [];
let z_section_saved = [];

let canvas_amount = 0;
window.perlin_horizon_arr = null; 
window.perlin_horizon_arr_max = null;

//-----------------
// draw switches
//-----------------
window.use_shadow = true;
$gen_art.perlin_pixels = null;
$gen_art.perlin_paint_direc_pixels = null;

window.color_perlin_detail_amounts = {
    'a':0.6,
    'b':0.2,
    'c':0.2,
};


//----------------------
const sunlight_dropout_chance = 0.7;
const sunlight_dropout_min = 0.1;

//----------------------
const precision_test = Math.pow(2, 16);
const gl_prec = 1/precision_test;

//----------------------
// z axis / perspective / horizon
//----------------------
const z_scale_min = 0.2; // min scaling for the z axis. will be a multiplier of the brush size etc, 0 would make the brush size 0
let z_scale_amount = {
	'pos': 1,
	'col': 0.5,
};; // amount of depth into the distance to apply

let w_h_ratio = null;
let elements_multi = null;
let walkers = [];
let removed_walkers = 0;
let ground_p_scale = {'x':0.0005, 'y':0.002, };

// const canvas_orientation = randGen() > 0.5 ? 'vert' : 'horiz';
const canvas_orientation = 'vert'; //console.log('warning canvas_orientation OVERRIDE!!!!!');
const canvas_multi = 1.5; //1.5
const canvas_orientation_multi = canvas_multi;
const canvas_orientation_multi_inv = 1 / canvas_multi;
// window.$fxhashFeatures['Canvas orientation'] = canvas_orientation === 'vert' ? 'vertical' : 'horizontal';

let scale_multi = 1;
let user_input_locked = true;


//----------------------
// entity switches
//----------------------
let draw_outlines = true;
let draw_gradient_bg = true;
let draw_ground_bgs = true;
let draw_light_beam = true;
let draw_divers = true;
let draw_buildings = true;
let draw_fish = true;
let draw_bridges = true;
let draw_bio_domes = true;

/*---------------------------*/
let draw_diver_pipe = false;
if( draw_divers === true ){	
	// if( randGen() <= 0.113 ){
	if( randGen() <= 0.061 ){
		draw_diver_pipe = true;
	} else {
		draw_divers = false;
	}		
}
window.$fxhashFeatures['ADS diver inspection'] = draw_divers ? "Yes" : 'None';


//----------------------
// let lighting_scenario = shuffle_random([0, 0, 0, 1, 1, 2])[0];
// let lighting_scenario = getRandInt(-3, 2);
let lighting_scenario = getRandInt( 0, 2);
lighting_scenario = Math.max( lighting_scenario, 0 );
// lighting_scenario = 0; console.log('warning lighting_scenario hardcoded');
let diver_light_brightness_amount = 0.05;
let diver_light_saturation_amount = 0;
let depth_name = '< 500m';
switch(lighting_scenario) {	
	case 1:
		depth_name = '> 500m';
		diver_light_brightness_amount = 0.25;
		diver_light_saturation_amount = 0.025;
		break;
	case 2:
		depth_name = '> 1000m';
		diver_light_brightness_amount = 0.5;
		diver_light_saturation_amount = 0.05;
		break;
}
window.$fxhashFeatures['Depth'] = depth_name;

//-----------------
let force_palette_round = shuffle_random([0,2,3])[0];
// force_palette_round = 0; console.log('warning force_palette_round hardcoded');
window.$fxhashFeatures['Colours on pallete'] = force_palette_round > 0 ? force_palette_round+" Variants" : 'Water Based';

//-----------------
// let paint_angle_type = getRandInt(0, 1, 2 );
let paint_angle_type = shuffle_random([0,1])[0];
// paint_angle_type = 0; console.log('warning paint_angle_type hardcoded');
window.$fxhashFeatures['Paint Density'] = (paint_angle_type + 1) +" Bodies Of Water";

//-----------------
let mist_layer_amount = shuffle_random([0.035, 0.055, 0.065])[0];
let particle_density_name = '';
// mist_layer_amount = 0.045; console.log('warning mist_layer_amount hardcoded');
switch(mist_layer_amount) {
	case 0:
		particle_density_name = 'N/A';
		break;
	case 0.01:
		particle_density_name = 'Very Low';
		break;
	case 0.035:
		particle_density_name = 'Low';
		break;
	case 0.055:
		particle_density_name = 'Medium';
		break;
	case 0.065:
		particle_density_name = 'High';
		break;
}
window.$fxhashFeatures['Particle Bulk Density'] = particle_density_name +" - "+mist_layer_amount+" g/cm3";

//-----------------
let diver_conn_loc = null;
let diver_z_axis = 0.98;
let detail_layer_z_axis = 0.95;
const paint_force_multi_bg = 1.5;
let ran_paint_once = false;
let loop_state = 0;
