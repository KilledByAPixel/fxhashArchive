//////PARAMS//////


//Settings
var dynamic_track = false;
var linewidth_scale = 0.00001; // 0.00001, line width to line length ratio
var loading_start_time = new Date().getTime();
var min_loading_time = 2000; // this is the minimum that the loading screen will be shown, in miliseconds
var debug = true;
var cam_factor = 4; //controls the "zoom" when using orthographic camera, default was 4
var cam_factor_mod;



//////COMPOSITION ALLEL DEFINITION//////

const daily_arc_second = 2*Math.PI/86400;

const allel_aspect_ratio = [
  [0.75, 1],
  [1.0, 1],
  [1.5, 1]
];

const allel_frame_type = [
  ['none', 10],
  ['narrow', 50],
  ['dominating', 40]
];

const allel_center_piece_type = [
  ['none', 10],
  ['plane', 15],
  ['triangle', 15],
  ['double_triangle', 5],
  ['tetrahedron', 5],
  ['pentagon', 10],
  ['octahedron', 10],
  ['hexahedron', 10],
  ['dodecahedron', 10],
  ['station_h', 3],
  ['station_t', 3],
  ['station_o', 2],
  ['station_d', 2]
];

// explosion_type
// 0 - no explosion
// 1 - along X axis, more dynamic blast along the axis
// 2 - along X axis, screen center is prioritized, in other places debris stays more in place
// 3 - along Y axis, otherwise same as 1
// 4 - along Y axis, otherwise same as 2
// 5 - in the explosion center A, which is random
// 6 - in the explosion center A and B, which are random but symmetrical
const allel_explosion_type = [
  [0, 70],
  [1, 4],
  [2, 4],
  [3, 4],
  [4, 4],
  [5, 4],
  [6, 10]
];

const allel_light_source_type = [
  ['west', 1],
  ['east', 1],
  ['north', 1],
  ['south', 1]
];

// all celestial types - 'none', 'comet', 'eclipse', 'ultra eclipse', 'moon', 'planet', 'orbit', 'meteor shower', 'quasar', 'nova', 'rapture', 'nebula', 'constellation'
const allel_celestial_object_types = [
  [['none'], 35],
  [['comet'], 5],
  [['eclipse'], 10],
  [['moon'], 10],
  [['planet'], 10],
  [['orbit'], 5],
  [['meteor shower'], 10],
  [['constellation'], 15]
];

const allel_celestial_object_types_explosion = [
  [['none'], 20],
  [['constellation'], 10],
  [['ultra eclipse'], 5],
  [['meteor shower'], 12], [['meteor shower', 'ultra eclipse'], 2], [['meteor shower', 'quasar'], 2], [['meteor shower', 'nova'], 2], [['meteor shower', 'rapture'], 2],
  [['quasar'], 10], [['quasar', 'constellation'], 5],
  [['nova'], 10], [['nova', 'constellation'], 5],
  [['rapture'], 15]
];

const allel_celestial_object_types_empty = [
  [['none'], 10],
  [['comet'], 5], [['comet', 'eclipse'], 2], [['comet', 'moon'], 2], [['comet', 'planet'], 2], [['comet', 'orbit'], 2], [['comet', 'meteor shower'], 2],
  [['eclipse'], 10],
  [['ultra eclipse'], 3],
  [['moon'], 15],
  [['planet'], 5],
  [['orbit'], 5],
  [['meteor shower'], 10], [['meteor shower', 'eclipse'], 2], [['meteor shower', 'moon'], 2], [['meteor shower', 'planet'], 2], [['meteor shower', 'orbit'], 1],
  [['quasar'], 5],
  [['nova'], 5],
  [['rapture'], 5],
  [['constellation'], 5]
];

//////LATTICE ALLEL DEFINITION//////

// in OBSCVRVM, it is allel_center_piece_type which determines the central lattice primitive type, so these probabilites don't matter
const allel_primitive = [
  ['plane', 1],
  ['triangle', 1],
  ['tetrahedron', 1],
  ['pentagon', 1],
  ['octahedron', 1],
  ['hexahedron', 1],
  ['dodecahedron', 1],
];

function get_start_bounds(primitive) { 
  var start_bounds;
  if (primitive == 'plane') {start_bounds = 500.0;} // checked
  else if (primitive == 'triangle') {start_bounds = 500.0;} // checked
  else if (primitive == 'tetrahedron') {start_bounds = 500.0;} // checked
  else if (primitive == 'pentagon') {start_bounds = 500.0;} // checked
  else if (primitive == 'octahedron') {start_bounds = 400.0;} // checked
  else if (primitive == 'hexahedron') {start_bounds = 500.0;}  // checked
  else if (primitive == 'dodecahedron') {start_bounds = 400.0;} // sometimes out of bounds
  else if (primitive == 'station_h') {start_bounds = 50.0;}
  else if (primitive == 'station_t') {start_bounds = 50.0;}
  else if (primitive == 'station_o') {start_bounds = 50.0;}
  else if (primitive == 'station_d') {start_bounds = 50.0;}
  return start_bounds
}

function get_allel_stage(primitive) {
    if (primitive == 'plane' || primitive == 'triangle' || primitive == 'tetrahedron' || primitive == 'pentagon' || primitive == 'octahedron') {
    var allel_stage = [
      [5, 20],
      [6, 80]
    ];
    } else if (primitive == 'dodecahedron' || primitive == 'hexahedron' || primitive == 'station_h' || primitive == 'station_t' || primitive == 'station_o' || primitive == 'station_d'){
    var allel_stage = [
      [5, 100],
      [6, 0]
    ];
    }
    return allel_stage
}

function get_double_sided(primitive) {
  var double_sided = gene() < 0.5 ? false : true;
  //if (primitive == 'plane' || primitive == 'triangle' || primitive == 'pentagon') {double_sided = true} // exceptions - only allowed to be double sided
  if (primitive == 'pentagon' || primitive == 'octahedron'|| primitive == 'hexahedron' || primitive == 'dodecahedron' || primitive == 'station_h' || primitive == 'station_t' || primitive == 'station_o' || primitive == 'station_d') {double_sided = false} // exception - only allowed to be single sided
  return double_sided
}

function get_start_rot(primitive) {
  var start_rot = 0; // this parameter is only used with triangle and pentagon primitives
  if (primitive == 'pentagon') {var start_rot = gene() < 0.5 ? -54 : 126;} // in 50% of cases pentagon will be rotated 180 deg
  if (primitive == 'triangle') {var start_rot = gene() < 0.5 ? -30 : 150;} // in 50% of cases triangle will be rotated 180 deg
  return start_rot
}

function get_steps(stage) {
  var steps = [];
  for (var i = 0; i < stage; i++) {
    steps.push(Math.PI/gene_range(50, 200))
  }
  return steps
}

function get_sub_rules(bias) {
  return [gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1]
}

function get_extrude_bounds(primitive) { 
  var extrude_bounds;
  if (primitive == 'plane') {extrude_bounds = 100;}
  else if (primitive == 'triangle') {extrude_bounds = 100;}
  else if (primitive == 'tetrahedron') {extrude_bounds = 50;}
  else if (primitive == 'pentagon') {extrude_bounds = 100;}
  else if (primitive == 'octahedron') {extrude_bounds = 50;}
  else if (primitive == 'hexahedron') {extrude_bounds = 50;}
  else if (primitive == 'dodecahedron') {extrude_bounds = 100;}
  else if (primitive == 'station_h') {extrude_bounds = 25;}
  else if (primitive == 'station_t') {extrude_bounds = 25;}
  else if (primitive == 'station_o') {extrude_bounds = 25;}
  else if (primitive == 'station_d') {extrude_bounds = 25;}
  return extrude_bounds
}

const allel_extrude_bounds = [
  [50, 25],
  [100, 25],
  [200, 50]
];

function get_extrude_face(range, factors) {
  return [gene_range(range[0] * factors[0], range[1] * factors[0]),
          gene_range(range[0] * factors[1], range[1] * factors[1]),
          gene_range(range[0] * factors[2], range[1] * factors[2]),
          gene_range(range[0] * factors[3], range[1] * factors[3]),
          gene_range(range[0] * factors[4], range[1] * factors[4]),
          gene_range(range[0] * factors[5], range[1] * factors[5]),
          gene_range(range[0] * factors[6], range[1] * factors[6]),
          gene_range(range[0] * factors[7], range[1] * factors[7])]
}

function get_contract_middle(range) {
  return [gene_range(range[0], range[1]), 
          gene_range(range[0], range[1]),
          gene_range(range[0], range[1]),
          gene_range(range[0], range[1]),
          gene_range(range[0], range[1]),
          gene_range(range[0], range[1]),
          gene_range(range[0], range[1]),
          gene_range(range[0], range[1])]
}

function get_leave_middle(bias) {
  return [gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1]
}

const allel_transformation = [
  ['none', 1],    //Stay in original mesh
  ['synchronous', 3],     //All stages transform at the same rate
  ['sequential', 1],    //Each stage waits for the previous to transform
  ['asynchronous',3],   //Each stage has it's own period and speed
  ['temporal',3],  //Transforming over longer period of times
  ['modal',3]  //Transforming with random mutations
  ];

function get_transformation_index(transformation_type) {
  var transformation_index = null
  for (var i = 0; i < allel_transformation.length; i++) {
    if (allel_transformation[i][0] == transformation_type) { transformation_index = i }
  }
  return transformation_index
}

const cylinder_params = {
  'standard' : [0.5, 0.5, 1, 6, 1] 
};

// how much is thickness of the member scaled for every stage
const thickness_scale_per_stage = {
  'getting_thinner' : [1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.6, 0.6, 0.6]
};



//////GENERAL PIECE COMPOSITION CHOOSING//////

// all input parameters are optional, they will be chosen at random if not passed into the function
function generate_composition_params(aspect_ratio, frame_type, center_piece_type, center_piece_factor, explosion_type, light_source_type, celestial_object_types) {

  if (aspect_ratio == undefined) {aspect_ratio = gene_weighted_choice(allel_aspect_ratio);}
  if (frame_type == undefined) {frame_type = gene_weighted_choice(allel_frame_type);}
  if (center_piece_type == undefined) {center_piece_type = gene_weighted_choice(allel_center_piece_type);}
  if (center_piece_factor == undefined) {center_piece_factor = 0.5;} // default scale is 0.5
  if (explosion_type == undefined) {explosion_type = gene_weighted_choice(allel_explosion_type);}
  if (light_source_type == undefined) {light_source_type = gene_weighted_choice(allel_light_source_type);}
  if (celestial_object_types == undefined) {celestial_object_types = gene_weighted_choice(allel_celestial_object_types);}
  
  var explosion_center_a = new THREE.Vector3(gene_range(-200, 200), gene_range(-200, 200), 0);
  var explosion_center_b = new THREE.Vector3(-explosion_center_a.x, -explosion_center_a.y, 0);

  // EXCEPTIONS AND OVER-RIDES
  if (center_piece_type == 'none') {frame_type = 'narrow'; explosion_type = 0;} // we never want to have a completely empty piece, also if frame is empty, there is no explosion
  if (explosion_type != 0) {celestial_object_types = gene_weighted_choice(allel_celestial_object_types_explosion);} // second choice priority for celestial object types
  if (center_piece_type == 'none') {celestial_object_types = gene_weighted_choice(allel_celestial_object_types_empty);} // first choice priority for celestial object types
  if (center_piece_type == 'triangle' && (explosion_type == 1 || explosion_type == 2 || explosion_type == 3 || explosion_type == 4)) {center_piece_factor = 0.75;} // make triangle bigger for horizontal and vertical explosions
  if (center_piece_type == 'triangle' && (explosion_type == 5 || explosion_type == 6)) {center_piece_factor = 0.65;} // make triangle bigger for point explosions
  if (center_piece_type == 'octahedron' && explosion_type != 0) {center_piece_factor = 0.65;} // make octahedron bigger for explosions
  if (center_piece_type == 'tetrahedron' && explosion_type != 0) {center_piece_factor = 0.75;} // make tetrahedron bigger for explosions
  if (center_piece_type == 'dodecahedron' && explosion_type != 0) {center_piece_factor = 0.75;} // make dodecahedron bigger for explosions

  // FXHASH FEATURES DEFINITION
  var feature_dimension
  var feature_frame
  var feature_primitive
  var feature_state
  var feature_celestial

  // 0.75, 1.0, 1.5
  if (aspect_ratio < 1.0) {feature_dimension = 'portrait';}
  else if (aspect_ratio > 1.0) {feature_dimension = 'landscape';}
  else {feature_dimension = 'square';}

  // 'none', 'narrow', 'dominating'
  feature_frame = frame_type;

  // 'none', 'plane', 'triangle', 'double_triangle', 'tetrahedron', 'pentagon', 'octahedron', 'hexahedron', 'dodecahedron', 'station_h', 'station_t', 'station_o', 'station_d'
  if (center_piece_type == 'double_triangle') {feature_primitive = 'star';}
  else if (center_piece_type == 'station_h' || center_piece_type == 'station_t' || center_piece_type == 'station_o' || center_piece_type == 'station_d') {feature_primitive = 'station';}
  else {feature_primitive = center_piece_type;}

  // 0, 1, 2, 3, 4, 5, 6
  if (explosion_type >= 1 && explosion_type <= 4) {feature_state = 'sliced';}
  else if (explosion_type >= 5 && explosion_type <= 6) {feature_state = 'pierced';}
  else {feature_state = 'pristine';}

  // 'none', 'comet', 'eclipse', 'ultra eclipse', 'moon', 'planet', 'orbit', 'meteor shower', 'quasar', 'nova', 'rapture', 'nebula', 'constellation'
  if (celestial_object_types.length == 1) {feature_celestial = celestial_object_types[0];}
  else if (celestial_object_types.length == 2) {feature_celestial = celestial_object_types[0] + ' and ' + celestial_object_types[1];}


  // this object will hold all of our composition parameters which we can unpack when we need them
  var composition_params = {
    aspect_ratio: aspect_ratio,
    frame_type: frame_type,
    center_piece_type: center_piece_type,
    center_piece_factor: center_piece_factor,
    explosion_type: explosion_type,
    light_source_type: light_source_type,
    explosion_center_a: explosion_center_a,
    explosion_center_b: explosion_center_b,
    celestial_object_types: celestial_object_types,
    feature_dimension: feature_dimension,
    feature_frame: feature_frame,
    feature_primitive: feature_primitive,
    feature_state: feature_state,
    feature_celestial: feature_celestial
  }

  return composition_params
}


//////LATTICE PARAMETER CHOOSING//////

// all input parameters are optional, they will be chosen at random if not passed into the function
function generate_lattice_params(type, stage, position) {

  if (type == undefined) {var primitive = gene_weighted_choice(allel_primitive);}
  else {var primitive = type;}

  if (type == 'double_triangle') {primitive = 'triangle';} // draw as single triangle, and handle the second one in main.js

  var start_bounds = get_start_bounds(primitive);
  var deform_type = [1, 1, 1]; /// lattice is not deformed

  if (position == undefined) {var position = new THREE.Vector3(0, 0, 0);}

  if (stage == undefined) {var stage = gene_weighted_choice(get_allel_stage(primitive));}

  var double_sided = get_double_sided(primitive);
  var start_rot = get_start_rot(primitive); // this parameter is only used with triangle and pentagon primitives

  var sub_rules = get_sub_rules(0.5); //bias - how much due the rules weight towards pyramid or tapered (0.5 is equal probability)
  var mod_rules = [1, 1, 1, 1, 1, 1, 1, 1]; // we only draw symmetrical lattices so mod_rules are fixed
  
  var extrude_bounds = get_extrude_bounds(primitive);
  var extrude_face = get_extrude_face([-extrude_bounds, extrude_bounds], [1.0, 0.5, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25]); // range, factors of range reduction for every stage
  var extrude_face0 = get_extrude_face([-extrude_bounds, extrude_bounds], [1.0, 0.5, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25]); // range, factors of range reduction for every stage
  var contract_middle = get_contract_middle([0.0, 0.95]); //range between [0, 1] 
  var leave_middle = get_leave_middle(0.5); // bias - weight towards leaving the middle quad vs removing it (0.5 is equal probability)

  var flip_dash = gene() < 0.5 ? false : true; // flip full and dashed lines

  var steps = get_steps(stage);
  var transformation_type = gene_weighted_choice(allel_transformation);
  var transformation_index = get_transformation_index(transformation_type);
  var triangulate = false;


  if (type == 'station_h') {
    primitive = 'hexahedron';
    sub_rules[0] = 1; // force rule tapered for the first iteration
    extrude_face[0] = gene() < 0.75 ? 150 : 1000; // first extrusion will be very large
    contract_middle[0] = gene() < 0.75 ? 0.01 : 0.95; // small contraction of the first face creates long "arms" at the side of the cube
  }

  if (type == 'station_t') {
    primitive = 'tetrahedron';
    sub_rules[0] = 1; // force rule tapered for the first iteration
    extrude_face[0] = gene() < 0.75 ? 200 : 1000; // first extrusion will be very large
    contract_middle[0] = gene() < 0.75 ? 0.01 : 0.95; // small contraction of the first face creates long "arms" at the side of the cube
  }

  if (type == 'station_o') {
    primitive = 'octahedron';
    sub_rules[0] = 1; // force rule tapered for the first iteration
    extrude_face[0] = gene() < 0.75 ? 150 : 1000; // first extrusion will be very large
    contract_middle[0] = gene() < 0.75 ? 0.01 : 0.95; // small contraction of the first face creates long "arms" at the side of the cube
  }

  if (type == 'station_d') {
    primitive = 'dodecahedron';
    sub_rules[0] = 1; // force rule tapered for the first iteration
    extrude_face[0] = gene() < 0.75 ? 200 : 1000; // first extrusion will be very large
    contract_middle[0] = gene() < 0.75 ? 0.01 : 0.95; // small contraction of the first face creates long "arms" at the side of the cube
  }

  // this object will hold all of our lattice parameters which we can unpack when we need them
  var lattice_params = {
    start_bounds: start_bounds,
    primitive: primitive,
    deform_type: deform_type,
    position: position,
    stage: stage,
    double_sided: double_sided,
    start_rot: start_rot,
    sub_rules: sub_rules,
    mod_rules: mod_rules,
    extrude_face: extrude_face,
    extrude_face0, extrude_face0,
    contract_middle: contract_middle,
    leave_middle: leave_middle,
    flip_dash: flip_dash,
    steps: steps,
    transformation_type: transformation_type,
    transformation_index: transformation_index,
    triangulate: triangulate,
  }

  return lattice_params
}



// used only for the frame lattice
function generate_frame_params(stage, frame_type, position) {

  // frame lattice is always a plane primitve
  var primitive = 'plane';
  var start_bounds = get_start_bounds(primitive);

  // canvas aspect ratio will deform the frame lattice so it fits the canvas
  if (aspect_ratio < 1) {
    var deform_type = [1, 1/aspect_ratio, 1];
  } else {
    var deform_type = [1*aspect_ratio, 1, 1];
  }

  if (position == undefined) {var position = new THREE.Vector3(0, 0, 0);}
  else if (frame_type == 'extra_narrow') {var position = new THREE.Vector3(0, 0, 1000);} // this will make the extra narrow frame come in front of the dominating lattice below

  if (stage == undefined) {var stage = gene_weighted_choice(get_allel_stage(primitive));}

  var double_sided = get_double_sided(primitive);
  if (frame_type == 'dominating') {double_sided = gene() < 0.65 ? false : true;} // dominating frame has less chance of being double sided, this will reduce these messy, overpowering lattices

  var start_rot = get_start_rot(primitive); // this parameter is only used with triangle and pentagon primitives

  var sub_rules = get_sub_rules(0.5); //bias - how much due the rules weight towards pyramid or tapered (0.5 is equal probability)
  if ((frame_type == 'narrow') || (frame_type == 'extra_narrow')) {sub_rules[0] = 1;} // force rule tapered for the first iteration

  var mod_rules = [1, 1, 1, 1, 1, 1, 1, 1]; // we only draw symmetrical lattices so mod_rules are fixed

  var extrude_bounds;
  if (frame_type == 'dominating') {extrude_bounds = gene_weighted_choice(allel_extrude_bounds);} // more variety for dominating frame lattice
  else {extrude_bounds = 100;}

  var extrude_face = get_extrude_face([-extrude_bounds, extrude_bounds], [1.0, 0.5, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25]); // range, factors of range reduction for every stage
  var extrude_face0 = get_extrude_face([-extrude_bounds, extrude_bounds], [1.0, 0.5, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25]); // range, factors of range reduction for every stage
  var contract_middle = get_contract_middle([0.0, 0.95]); //range between [0, 1] 
  if (frame_type == 'narrow') {contract_middle[0] = gene_range(0.05, 0.25);} // force small contraction of the middle face which forms the inside of the frame composition
  else if (frame_type == 'extra_narrow') {contract_middle[0] = gene_range(0.05, 0.10);}

  var leave_middle = get_leave_middle(0.5); // bias - weight towards leaving the middle quad vs removing it (0.5 is equal probability)
  if ((frame_type == 'narrow') || (frame_type == 'extra_narrow')) {leave_middle[0] = 0;} // force removal of the middle face which forms the inside of the frame composition

  var steps = get_steps(stage);
  var transformation_type = gene_weighted_choice(allel_transformation);
  var transformation_index = get_transformation_index(transformation_type);

  // this object will hold all of our lattice parameters which we can unpack when we need them
  var lattice_params = {
    start_bounds: start_bounds,
    primitive: primitive,
    deform_type: deform_type,
    position: position,
    stage: stage,
    double_sided: double_sided,
    start_rot: start_rot,
    sub_rules: sub_rules,
    mod_rules: mod_rules,
    extrude_face: extrude_face,
    extrude_face0, extrude_face0,
    contract_middle: contract_middle,
    leave_middle: leave_middle,
    steps: steps,
    transformation_index: transformation_index
  }

  return lattice_params
}

//////ANIMATION SETTINGS CHOOSING//////
const light_frame_speed_param = {
  Fast: 25, // light increment per 1/100 of a second
  Normal: 50, // light increment per 1/30 of a second
  Slow: 500, // light increment per half-second
  SuperSlow: 1000, // light increment per second
}

const light_step_size_param = {
  Paused: 0,
  DaySync: 0.000072,//2*Math.PI/86400,
  SuperSmall: 0.00025,
  Small: 0.0005,
  Medium: 0.0010,
  Large: 0.0015
}