/*

     ██████╗  ██████╗  ███████╗  ██████╗ ██╗   ██╗ ██████╗  ██╗   ██╗ ███╗   ███╗
    ██╔═══██╗ ██╔══██╗ ██╔════╝ ██╔════╝ ██║   ██║ ██╔══██╗ ██║   ██║ ████╗ ████║
    ██║   ██║ ██████╔╝ ███████╗ ██║      ██║   ██║ ██████╔╝ ██║   ██║ ██╔████╔██║
    ██║   ██║ ██╔══██╗ ╚════██║ ██║      ╚██╗ ██╔╝ ██╔══██╗ ╚██╗ ██╔╝ ██║╚██╔╝██║
    ╚██████╔╝ ██████╔╝ ███████║ ╚██████╗  ╚████╔╝  ██║  ██║  ╚████╔╝  ██║ ╚═╝ ██║
     ╚═════╝  ╚═════╝  ╚══════╝  ╚═════╝   ╚═══╝   ╚═╝  ╚═╝   ╚═══╝   ╚═╝     ╚═╝
                                            
     
          O B S C V R V M  |  { p r o t o c e l l : l a b s }  |  2 0 2 2
*/


//////LATTICE GENERATION//////

var gDatas = [];
var lattice_params, gData;
var composition_params;

// COMPOSITION - generate parameters for the composition of the piece
composition_params = generate_composition_params(); // all input parameters are optional, they will be chosen at random if not passed into the function

var { aspect_ratio, frame_type, center_piece_type, center_piece_factor, explosion_type, light_source_type, explosion_center_a, explosion_center_b, celestial_object_types, feature_dimension, feature_frame, feature_primitive, feature_state, feature_celestial } = composition_params; // unpacking parameters we need in main.js and turning them into globals

// LATTICE 1 - FRAME, plane primitive, full size
if (frame_type == 'narrow') {
  lattice_params = generate_frame_params(6, 'narrow'); // all input parameters are optional, they will be chosen at random if not passed into the function
  gData = generate_lattice(lattice_params);
  gDatas.push(gData);

} else if (frame_type == 'dominating') {
  lattice_params = generate_frame_params(4, 'extra_narrow');
  gData = generate_lattice(lattice_params);
  gDatas.push(gData);
  lattice_params = generate_frame_params(6, 'dominating');
  gData = generate_lattice(lattice_params);
  gDatas.push(gData);

} else if (frame_type == 'none') {
  // in this case we are not drawing a frame at all
}

// LATTICE 2 - CENTER, random primitive, smaller size
if (center_piece_type != 'none') {
  lattice_params = generate_lattice_params(center_piece_type); // all input parameters are optional, they will be chosen at random if not passed into the function
  lattice_params['start_bounds'] = lattice_params['start_bounds'] * center_piece_factor;
  gData = generate_lattice(lattice_params);
  gDatas.push(gData);

  // generate another triangle with same parameters but rotated 180 degrees
  if (center_piece_type == 'double_triangle') {
    lattice_params['start_rot'] = lattice_params['start_rot'] == -30 ? 150 : -30;
    gData = generate_lattice(lattice_params);
    gDatas.push(gData);
  }

} else if (center_piece_type == 'none') {
  // in this case we are not drawing a center piece at all
}

var nDatas = [];
var nData;

// LATTICE 3 - STARS, ordered, triangles
lattice_params = generate_lattice_params('plane', 6); // all input parameters are optional, they will be chosen at random if not passed into the function
nData = generate_lattice(lattice_params);
nDatas.push(nData);

// STARS - random
var random_starfield_bounds = 1500;
var nr_of_random_stars = 10000;


var { stage, transformation_index, steps } = lattice_params; // WORKAROUND FOR NOW - all the params we need in main.js to make it run, but in the end we will have multiple lattices with multiple params

//////FXHASH FEATURES//////

window.$fxhashFeatures = {
  'Dimension': feature_dimension,
  'Frame': feature_frame,
  'Primitive': feature_primitive,
  'State': feature_state,
  'Celestial': feature_celestial
};

//////CONSOLE LOG//////

var obscvrvm_logo = "%c                                                                         \n"
                    + "%c     O B S C V R V M  |  { p r o t o c e l l : l a b s }  |  2 0 2 2     \n"
                    + "%c                                                                         \n";

console.log( obscvrvm_logo,
            'color: white; background: #000000; font-weight: bold; font-family: "Courier New", monospace;',
            'color: white; background: #000000; font-weight: bold; font-family: "Courier New", monospace;',
            'color: white; background: #000000; font-weight: bold; font-family: "Courier New", monospace;');


console.log('%cFelix, qui potuit rerum cognoscere causas.\n', 'font-style: italic; font-family: "Courier New", monospace;');

console.log('%cTOKEN FEATURES', 'color: white; background: #000000;', '\n',
            'Dimension -> ' + feature_dimension, '\n',
            'Frame     -> ' + feature_frame, '\n',
            'Primitive -> ' + feature_primitive, '\n',
            'State     -> ' + feature_state, '\n',
            'Celestial -> ' + feature_celestial, '\n');

console.log('%cCONTROLS', 'color: white; background: #000000;', '\n',
            'a   : jump light angle', '\n',
            'f   : cycle light framerate', '\n',
            't   : cycle light tick', '\n',
            'i   : info', '\n',
            'b   : white / black background', '\n',
            'g   : start / stop gif capture', '\n',
            '1-5 : image capture 1-5x resolution', '\n');

console.log('%cPERFORMANCE', 'color: white; background: #000000;', '\n',
            'Default shadow map size is 4096 pix. On iOS devices, this was downgraded to 2048 pix due to memory limitations. This value can be changed by passing a query string to the URL with an arbitrary shadow map size of the form ?shadow=value.', '\n',
            'Examples -> ?shadow=4096, ?shadow=2048, ?shadow=1024, ?shadow=512 ...', '\n');

console.log('%cPIXELS', 'color: white; background: #000000;', '\n',
            "Change pixel density by changing your browser's zoom level (50% zoom doubles the pixels etc.)", '\n');
                                 

//////END CONSOLE LOG//////

var pre_calc = 0.000;
var viz_update = 0.00000;
var composer_pass = 0.00000;

///VIEWPORT SETUP///

var viewport = document.getElementById("viewport");
var margin_left = 0;
var margin_top = 0;
var viewportHeight;
var viewportWidth;


var light_framerate_change;
var base_light_angle_step;
var light_angle;
var background_toggle = false;

var controller;

var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true});
const composer = new THREE.EffectComposer( renderer );
let snap = false;
let quality = 0;
var capturer = null;
let recording = false;

function View(viewArea) {
  if (window.innerWidth/aspect_ratio>window.innerHeight) { //If target viewport height is larger then inner height

    viewportHeight = window.innerHeight; //Force Height to be inner Height
    viewportWidth = aspect_ratio*window.innerHeight;  //Scale width proportionally

    margin_top = 0;
    margin_left = (window.innerWidth - viewportWidth)/2;
  } else {  //If target viewport width is larger then inner width

    viewportHeight = window.innerWidth/aspect_ratio; //Scale viewport height proportionally
    viewportWidth = window.innerWidth; //Force Width  to be inner Height

    margin_top = (window.innerHeight - viewportHeight)/2;
    margin_left = 0;
  }

  viewport.style.marginTop=margin_top+'px';
  viewport.style.marginLeft=margin_left+'px';
    
  
  ///SCALING
  cam_factor_mod = cam_factor * Math.min(viewportWidth/1000, viewportHeight/1000);

  renderer.setSize( viewportWidth, viewportHeight );
  renderer.shadowMap.enabled = true;
  renderer.domElement.id = 'obscvrvmcanvas';

  viewport.appendChild(renderer.domElement);

  var scene = new THREE.Scene();

  //var camera = new THREE.PerspectiveCamera( 75, viewportWidth / viewportHeight, 0.1, 10000 );
  //camera.position.set(0,0, 100);


  //cam_factor controls the "zoom" when using orthographic camera
  var camera = new THREE.OrthographicCamera( -viewportWidth/cam_factor_mod, viewportWidth/cam_factor_mod, viewportHeight/cam_factor_mod, -viewportHeight/cam_factor_mod, 0, 5000 );
  camera.position.set(0, 0, 2000);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  //composer = new THREE.EffectComposer( renderer );
  composer.setSize(window.innerWidth, window.innerHeight)

  // change scene background to solid color
  scene.background = new THREE.Color( 0x000000 ); //0xffffff, 0x000000

  const color = 0xffffff; //0xffffff
  const intensity = 0.0; //0-1, zero works great for shadows with strong contrast

  // ADD LIGHTING
  var light = new THREE.PointLight(0xffffff);
  light.position.set(0, 0, 2000); //1000,1000,1000
 
  light.castShadow = true;
  light.shadow.camera.near = 200;
  light.shadow.camera.far = 2000;
  light.shadow.bias = - 0.000222;

  var shadow = 2048; //Default
  var paramsAssigned = false;
  // URL PARAMS
  // Usage: add this to the url ?shadow=4096
  try {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const shadowString = urlParams.get('shadow');
    
  if (shadowString!=null) {
      shadow = Math.abs(parseInt(shadowString));
      paramsAssigned = true;
    }
  } catch (error) {
    //console.log("shadow variable must be a positive integer")
  }
  if (Number.isInteger(shadow) & paramsAssigned) { //If values are overiden by urlParams  for a minimum overide add: & shadow > 2048
    console.log("Using custom url parmater for shadow map size: " + shadow.toString())
    light.shadow.mapSize.width = shadow;
    light.shadow.mapSize.height = shadow;   
  } else if (Number.isInteger(shadow) & iOS()) {
    //console.log("iOS")
    light.shadow.mapSize.width = Math.min(shadow, 2048); //increase for better quality of shadow, standard is 2048
    light.shadow.mapSize.height = Math.min(shadow, 2048); 
  } else if ((Number.isInteger(shadow) & !iOS())){
    //console.log("!iOS")
    light.shadow.mapSize.width = Math.max(shadow, 4096);
    light.shadow.mapSize.height = Math.max(shadow, 4096);
  } else {
    //console.log("Using default shadow map.")
    light.shadow.mapSize.width = 4096; 
    light.shadow.mapSize.height = 4096; 
  }

  scene.add(light);

  const amblight = new THREE.AmbientLight(color, intensity);
  scene.add(amblight);

  this.winHeight = viewportHeight;
  this.winWidth = viewportWidth;
  this.scale = 1;
  this.scene = scene;
  this.camera = camera;
  this.composer = composer;
  this.light = light;
  this.renderer = renderer;
  this.wire = null;
  this.lines = null;
  this.meshline_data = [];
  this.meshline_mesh = [];

  this.curves = [];

  // Renders the Scene
  const renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.composer.addPass( renderPass );


  //Bloom
  const bloomPass = new THREE.UnrealBloomPass();
  bloomPass.strength = 0.30;
  bloomPass.radius = 0.0;
  bloomPass.threshold = 0.0;
  this.composer.addPass(bloomPass)
}

View.prototype.addInstances = function  () {

  var c_type = "standard";
  var c_xy_scale = thickness_scale_per_stage['getting_thinner']; // how much is thickness of the member scaled for every stage

  var cull_dist_bands; // culling of members happens at different rates at each of these distance bands
  var cull_precentage_bands; // culling precentages per distance bands (first one is 100%, all members get removed)
  var explosion_strength; // overall factor for translation during explosion - will be divided with the distance from the axis (closer to the axis, stronger the offset)
  var explosion_rot_range; // maximum range for the random rotation angle (in radians) while applying explosion
  var explosion_rot_reduction; // reduction of random rotation angle for each band (closer to the axis means more chaos)

  if ((explosion_type == 1) || (explosion_type == 2) || (explosion_type == 3) || (explosion_type == 4)) {
    // explosion along an axis
    cull_dist_bands = [20, 40, 60, 80];
    cull_precentage_bands = [1.0, 0.8, 0.6, 0.4];
    explosion_strength = 1000;
    explosion_rot_range = Math.PI/2;
    explosion_rot_reduction = [1.0, 0.6, 0.3];
  } else if ((explosion_type == 5) || (explosion_type == 6)) {
    // explosion from a point
    cull_dist_bands = [40, 80, 120, 160];
    cull_precentage_bands = [1.0, 0.8, 0.6, 0.4];
    explosion_strength = 1000;
    explosion_rot_range = Math.PI/2;
    explosion_rot_reduction = [1.0, 0.6, 0.3];
  }

  var triangle_radius = 0.5;
  var debris_multiplier = 5; // multiply the number of debris particles
  var debris_spread = 50; // distance range to randomly spread out the debris particles

  for (var n = 0; n < gDatas.length; n++) {
    var gData = gDatas[n];
    var dummy = new THREE.Object3D()
    var geometry = new THREE.CylinderGeometry( cylinder_params[c_type][0], cylinder_params[c_type][1], cylinder_params[c_type][2], cylinder_params[c_type][3], cylinder_params[c_type][4], true );
    var material = new THREE.MeshPhongMaterial( {color: 0xffffff} ); //THREE.MeshBasicMaterial( {color: 0xff0000} ); THREE.MeshNormalMaterial();
    var imesh = new THREE.InstancedMesh( geometry, material, gData.links.length )
    var axis = new THREE.Vector3(0, 1, 0);
    imesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame
    var c = new THREE.Color()

    var exploded_dummies = []; // array to hold our transform matrices of exploded elements so we can use them to add more debris around the explosion area
    var debris_position_temp = new THREE.Vector3(); // temporary holder for positions of exploded members so we can use them for debris

    for (var i = 0; i < gData.links.length; i++) {
      var source_index = gData.links[i]['source'];
      var target_index = gData.links[i]['target'];
      var vector = new THREE.Vector3(gData.nodes[target_index].x-gData.nodes[source_index].x, gData.nodes[target_index].y-gData.nodes[source_index].y, gData.nodes[target_index].z-gData.nodes[source_index].z);
      dummy.scale.set(c_xy_scale[gData.nodes[source_index]['stage']], gData.links[i]['value'], c_xy_scale[gData.nodes[source_index]['stage']]); // (1, gData.links[i]['value'], 1)
      dummy.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
      dummy.position.set((gData.nodes[source_index].x+gData.nodes[target_index].x)/2, (gData.nodes[source_index].y+gData.nodes[target_index].y)/2, (gData.nodes[source_index].z+gData.nodes[target_index].z)/2)
      dummy.updateMatrix();

      
      // cull members according to their proximity to the axis
      // var cull_member_x_axis = (Math.abs((gData.nodes[source_index].x + gData.nodes[target_index].x) / 2) < cull_band_width) || (Math.abs(gData.nodes[source_index].x) < cull_band_min) || (Math.abs(gData.nodes[target_index].x) < cull_band_min); //(gene() < 0.95)
      // var cull_member_y_axis = (Math.abs((gData.nodes[source_index].y + gData.nodes[target_index].y) / 2) < cull_band_width) || (Math.abs(gData.nodes[source_index].y) < cull_band_min) || (Math.abs(gData.nodes[target_index].y) < cull_band_min); //(gene() < 0.95)

      // !cull_member_x_axis - cull members along x-axis
      // !cull_member_y_axis - cull members along y-axis
      // !(cull_member_x_axis || cull_member_y_axis) - cull members along x-axis and y-axis

      /*if (cull_member_y_axis) {
        if ( gene() < 0.05 ) { //5/(Math.abs((gData.nodes[source_index].y + gData.nodes[target_index].y) / 2))
          cull_member_y_axis = false;
        }
      }*/

      // EXPLODING LATTICE MEMBERS

      // setting default for all members not to get culled 
      var cull_member = false;
      var cull_member_x_axis = false;
      var cull_member_y_axis = false;
      
      // in case we have to calculate explosion, proceede below, otherwise skip
      if (explosion_type != 0) {

        var dist_to_x_axis = Math.abs((gData.nodes[source_index].y + gData.nodes[target_index].y) / 2); // from member mid point to axis
        var dist_to_y_axis = Math.abs((gData.nodes[source_index].x + gData.nodes[target_index].x) / 2); // from member mid point to axis
        var end_to_x_axis = Math.min(Math.abs(gData.nodes[source_index].y), Math.abs(gData.nodes[target_index].y)); // from member end point to axis
        var end_to_y_axis = Math.min(Math.abs(gData.nodes[source_index].x), Math.abs(gData.nodes[target_index].x)); // from member end point to axis

        var projected_member_cent =  new THREE.Vector3((gData.nodes[source_index].x + gData.nodes[target_index].x) / 2, (gData.nodes[source_index].y + gData.nodes[target_index].y) / 2, 0);
        var projected_source = new THREE.Vector3(gData.nodes[source_index].x, gData.nodes[source_index].y, 0);
        var projected_target = new THREE.Vector3(gData.nodes[target_index].x, gData.nodes[target_index].y, 0);

        var dist_to_cent_a = projected_member_cent.distanceTo(explosion_center_a);
        var dist_to_cent_b = projected_member_cent.distanceTo(explosion_center_b);
        var dist_source_to_cent_a = projected_source.distanceTo(explosion_center_a);
        var dist_target_to_cent_a = projected_target.distanceTo(explosion_center_a);
        var dist_end_to_cent_a = Math.min(dist_source_to_cent_a, dist_target_to_cent_a);
        var dist_source_to_cent_b = projected_source.distanceTo(explosion_center_b);
        var dist_target_to_cent_b = projected_target.distanceTo(explosion_center_b);
        var dist_end_to_cent_b = Math.min(dist_source_to_cent_b, dist_target_to_cent_b);

        var explosion_axis = new THREE.Vector3((gData.nodes[source_index].x + gData.nodes[target_index].x) / 2, (gData.nodes[source_index].y + gData.nodes[target_index].y) / 2, (gData.nodes[source_index].z + gData.nodes[target_index].z) / 2).normalize();
        var dist_to_axis_explosion;
        
        // defining parameters for each explosion type
        
        if (explosion_type == 1) {
          dist_to_axis = dist_to_x_axis;
          dist_to_axis_explosion = dist_to_x_axis;
          end_to_axis = end_to_x_axis;

        } else if (explosion_type == 2) {
          dist_to_axis = dist_to_x_axis;
          dist_to_axis_explosion = dist_to_y_axis;
          end_to_axis = end_to_x_axis;

        } else if (explosion_type == 3) {
          dist_to_axis = dist_to_y_axis;
          dist_to_axis_explosion = dist_to_y_axis;
          end_to_axis = end_to_y_axis;

        } else if (explosion_type == 4) {
          dist_to_axis = dist_to_y_axis;
          dist_to_axis_explosion = dist_to_x_axis;
          end_to_axis = end_to_y_axis;

        } else if (explosion_type == 5) {
          dist_to_axis = dist_to_cent_a;
          dist_to_axis_explosion = dist_to_cent_a;
          end_to_axis = dist_end_to_cent_a;

        } else if (explosion_type == 6) {
          dist_to_axis = Math.min(dist_to_cent_a, dist_to_cent_b);
          dist_to_axis_explosion = Math.min(dist_to_cent_a, dist_to_cent_b);
          end_to_axis = Math.min(dist_end_to_cent_a, dist_end_to_cent_b);
        }


        if ((end_to_axis < cull_dist_bands[0]) || (dist_to_axis < cull_dist_bands[0])) {
          // apply explosion offset and random rotation for member within the explosion zone
          dummy.translateOnAxis(explosion_axis, explosion_strength / dist_to_axis_explosion);
          dummy.updateMatrix();
          // first band, closest, every member gets culled
          if (gene() < cull_precentage_bands[0]) {
            cull_member_x_axis = true;
            debris_position_temp = new THREE.Vector3((gData.nodes[source_index].x+gData.nodes[target_index].x)/2, (gData.nodes[source_index].y+gData.nodes[target_index].y)/2, (gData.nodes[source_index].z+gData.nodes[target_index].z)/2);
            debris_position_temp.add(explosion_axis.multiplyScalar(explosion_strength / dist_to_axis_explosion)); // debris will be pushed away from the axis the same as the members
            for (var d = 0; d < debris_multiplier; d++) {exploded_dummies.push(debris_position_temp);}
          }

        } else if ((end_to_axis < cull_dist_bands[1]) || (dist_to_axis < cull_dist_bands[1])) {
          // apply explosion offset and random rotation for member within the explosion zone
          dummy.translateOnAxis(explosion_axis, explosion_strength / dist_to_axis_explosion);
          dummy.rotateX(explosion_rot_reduction[0] * (gene() * explosion_rot_range * 2 - explosion_rot_range));
          dummy.rotateY(explosion_rot_reduction[0] * (gene() * explosion_rot_range * 2 - explosion_rot_range));
          dummy.rotateZ(explosion_rot_reduction[0] * (gene() * explosion_rot_range * 2 - explosion_rot_range));
          dummy.updateMatrix();
          // second band, 80% of members get culled
          if (gene() < cull_precentage_bands[1]) {
            cull_member_x_axis = true;
            debris_position_temp = new THREE.Vector3((gData.nodes[source_index].x+gData.nodes[target_index].x)/2, (gData.nodes[source_index].y+gData.nodes[target_index].y)/2, (gData.nodes[source_index].z+gData.nodes[target_index].z)/2);
            debris_position_temp.add(explosion_axis.multiplyScalar(explosion_strength / dist_to_axis_explosion)); // debris will be pushed away from the axis the same as the members
            for (var d = 0; d < debris_multiplier; d++) {exploded_dummies.push(debris_position_temp);}
          }

        } else if ((end_to_axis < cull_dist_bands[2]) || (dist_to_axis < cull_dist_bands[2])) {
          // apply explosion offset and random rotation for member within the explosion zone
          dummy.translateOnAxis(explosion_axis, explosion_strength / dist_to_axis_explosion);
          dummy.rotateX(explosion_rot_reduction[1] * (gene() * explosion_rot_range * 2 - explosion_rot_range));
          dummy.rotateY(explosion_rot_reduction[1] * (gene() * explosion_rot_range * 2 - explosion_rot_range));
          dummy.rotateZ(explosion_rot_reduction[1] * (gene() * explosion_rot_range * 2 - explosion_rot_range));
          dummy.updateMatrix();
          // third band, 60% of members get culled
          if (gene() < cull_precentage_bands[2]) {
            cull_member_x_axis = true;
            debris_position_temp = new THREE.Vector3((gData.nodes[source_index].x+gData.nodes[target_index].x)/2, (gData.nodes[source_index].y+gData.nodes[target_index].y)/2, (gData.nodes[source_index].z+gData.nodes[target_index].z)/2);
            debris_position_temp.add(explosion_axis.multiplyScalar(explosion_strength / dist_to_axis_explosion)); // debris will be pushed away from the axis the same as the members
            for (var d = 0; d < debris_multiplier; d++) {exploded_dummies.push(debris_position_temp);}
          }

        } else if ((end_to_axis < cull_dist_bands[3]) || (dist_to_axis < cull_dist_bands[3])) {
          // apply explosion offset and random rotation for member within the explosion zone
          dummy.translateOnAxis(explosion_axis, explosion_strength / dist_to_axis_explosion);
          dummy.rotateX(explosion_rot_reduction[2] * (gene() * explosion_rot_range * 2 - explosion_rot_range));
          dummy.rotateY(explosion_rot_reduction[2] * (gene() * explosion_rot_range * 2 - explosion_rot_range));
          dummy.rotateZ(explosion_rot_reduction[2] * (gene() * explosion_rot_range * 2 - explosion_rot_range));
          dummy.updateMatrix();
          // third band, 40% of members get culled
          if (gene() < cull_precentage_bands[3]) {
            cull_member_x_axis = true;
            debris_position_temp = new THREE.Vector3((gData.nodes[source_index].x+gData.nodes[target_index].x)/2, (gData.nodes[source_index].y+gData.nodes[target_index].y)/2, (gData.nodes[source_index].z+gData.nodes[target_index].z)/2);
            debris_position_temp.add(explosion_axis.multiplyScalar(explosion_strength / dist_to_axis_explosion)); // debris will be pushed away from the axis the same as the members
            for (var d = 0; d < debris_multiplier; d++) {exploded_dummies.push(debris_position_temp);}
          }
        }

        cull_member = cull_member_x_axis;

      }
      // end of explosion part

      // cull_member is set per default to false, unless explosion part above defined it to be true
      if (!cull_member) {
        imesh.setMatrixAt( i, dummy.matrix );
      }

    }

    imesh.instanceMatrix.needsUpdate = true

    imesh.castShadow = true;
    imesh.receiveShadow = true;

    this.scene.add(imesh);

    //ref.current.instanceMatrix.needsUpdate = true


    // EXPLOSION DUST CLOUD

    // one triangle
    const vertices = [
      0, 1, 0, // top
      1, 0, 0, // right
      -1, 0, 0 // left
    ];
    const faces = [ 2, 1, 0 ]; // only one face
    
    var dummy = new THREE.Object3D();
    var triangle = new THREE.PolyhedronGeometry(vertices, faces, triangle_radius, 0);
    triangle.scale(0.5, 10, 0.5);
    var imesh_debris = new THREE.InstancedMesh( triangle, material, exploded_dummies.length )
    imesh_debris.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame

    //console.log('exploded_dummies.length ->', exploded_dummies.length);
    //console.log(exploded_dummies);

    for (var i = 0; i < exploded_dummies.length; i++) {
      dummy.position.set(exploded_dummies[i].x, exploded_dummies[i].y, exploded_dummies[i].z);
      var random_axis = new THREE.Vector3(gene() * 2 - 1, gene() * 2 - 1, gene() * 2 - 1).normalize();
      dummy.translateOnAxis(random_axis, gene() * debris_spread);

      var uniscale = 0.2 + gene();
      dummy.scale.set(uniscale, uniscale, uniscale); //Dynamically assign this to give different sizes (eg add attribute to nData.nodes and call it here)
      
      dummy.rotateX(gene() * Math.PI/3 - Math.PI/6);
      dummy.rotateY(gene() * Math.PI/3 - Math.PI/6);
      dummy.rotateZ(gene() * Math.PI/3 - Math.PI/6);

      dummy.updateMatrix();
      imesh_debris.setMatrixAt( i, dummy.matrix );

    }


    imesh_debris.instanceMatrix.needsUpdate = true
    //imesh_debris.castShadow = true; // remove for performance
    imesh_debris.receiveShadow = true;
    this.scene.add(imesh_debris);
  }

}

// takes as an input nData object for location of stars
View.prototype.addStarsOrdered = function ()
{
  var star_plane_distance = -2000; // z coordinate of the plane where stars reside (they also recieve no shadow)
  var star_jitter = 10; // every lattice node is randomly jittered so the stars don't align

  // one triangle
  const vertices = [
    0, 1, 0, // top
    1, 0, 0, // right
    -1, 0, 0 // left
  ];
  // only one face
  const faces = [ 2, 1, 0 ];
  const triangle_radius = 0.30; //0.5

  const geometry = new THREE.PolyhedronGeometry(vertices, faces, triangle_radius, 0);
  geometry.scale(1, 1.5, 1);
  const material = new THREE.MeshPhongMaterial( {color: 0xffffff} );
  
  for (var n = 0; n < nDatas.length; n++) {
    var nData = nDatas[n];
    const imesh = new THREE.InstancedMesh( geometry, material, nData.nodes.length )
    imesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame

    for (var i = 0; i < nData.nodes.length; i++) {
      const dummy = new THREE.Object3D();

      var uniscale = 0.5 + gene();
      dummy.scale.set(uniscale,uniscale,uniscale); // dynamically assign this to give different sizes (eg add attribute to nData.nodes and call it here)
      dummy.position.set(nData.nodes[i].x + gene_range(-star_jitter, star_jitter), nData.nodes[i].y + gene_range(-star_jitter, star_jitter), star_plane_distance);
      
      dummy.rotateX(gene() * Math.PI/3 - Math.PI/6);
      dummy.rotateY(gene() * Math.PI/3 - Math.PI/6);
      dummy.rotateZ(gene() * Math.PI/3 - Math.PI/6);

      dummy.updateMatrix();
      imesh.setMatrixAt( i, dummy.matrix );
  }

  imesh.instanceMatrix.needsUpdate = true
  //imesh.castShadow = true; // remove for performance
  //imesh.receiveShadow = true; // stars recieve no shadow
  this.scene.add(imesh);

  }

}

View.prototype.addStarsRandom = function (bounds = 100, qty = 100)
{
  var star_plane_distance = -2000; // z coordinate of the plane where stars reside (they also recieve no shadow)

  // one triangle
  const vertices = [
    0, 1, 0, // top
    1, 0, 0, // right
    -1, 0, 0 // left
  ];
  // only one face
  const faces = [ 2, 1, 0 ];
  const triangle_radius = 0.30; //0.5

  const geometry = new THREE.PolyhedronGeometry(vertices, faces, triangle_radius, 0);
  geometry.scale(1, 1.5, 1);
  const material = new THREE.MeshPhongMaterial( {color: 0xffffff} );
  
  const imesh = new THREE.InstancedMesh( geometry, material, qty )
  imesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame

  for (var i = 0; i < qty; i++) {
    const dummy = new THREE.Object3D();

    var uniscale = 0.5 + gene();
    dummy.scale.set(uniscale,uniscale,uniscale); // dynamically assign this to give different sizes (eg add attribute to nData.nodes and call it here)
    dummy.position.set(gene() * bounds - bounds/2, gene() * bounds - bounds/2,  star_plane_distance);

    dummy.rotateX(gene() * Math.PI/3 - Math.PI/6);
    dummy.rotateY(gene() * Math.PI/3 - Math.PI/6);
    dummy.rotateZ(gene() * Math.PI/3 - Math.PI/6);

    dummy.updateMatrix();
    imesh.setMatrixAt( i, dummy.matrix );
  }

  imesh.instanceMatrix.needsUpdate = true
  //imesh.castShadow = true; // remove for performance
  //imesh.receiveShadow = true; // stars recieve no shadow
  this.scene.add(imesh);

  

}

View.prototype.addCelestialObject = function (celestial_object_type)
{
  var radius_x, radius_y, radius_planet_x, radius_planet_y, radius_moon_x, radius_moon_y, radius_moon_2nd_x, radius_moon_2nd_y, r_x, r_y, radius_offset, radius_atmosphere, radius_nova_x, radius_nova_y, radius_ring_x, radius_ring_y, ring_y_scale, rapture_size, radius_rapture_x, radius_rapture_y, bounds_x, bounds_y, radius_star_x, radius_star_y, radius_factor, radius_elongation, radius_factors;
  var cent_x, cent_y, cent_planet_x, cent_planet_y, cent_moon_x, cent_moon_y, cent_moon_2nd_x, cent_moon_2nd_y, moon_offset_x, moon_offset_y, celestial_x, celestial_y, celestial_x_rot, celestial_y_rot, centers_x, centers_y;
  var angle, r, tilt_angle, comet_rot, nr_of_triangles, nr_of_meteors, nr_of_stars, star_range, constellation_bounds;
  var customGaussian, stdev, stdevs, ringGaussian, secondRingGaussian, customGaussian2nd, stdev2nd, hasDoubleRing, hasMoon, hasAtmosphere, orbitFlipped, perlin_shift, perlin_scale, hasStarShine, star_shine;

  var celestial_plane_distance = -1800; // z coordinate of the plane where stars reside (they also recieve no shadow)
  var monteCarloHit = true; // this will draw the triangle and is true by default, except for nebula case where it can become false
  var nr_of_tries = 100; // number of tries to try to displace the center of the celestial (used in a for loop)
  var cent_offset = center_piece_type != 'none' ? 100 : 0; // center offset is set if there is a lattice in the center, otherwise it's zero

  if (celestial_object_type == 'comet') {
    radius_x = 500;
    radius_y = 500;
    // here we are trying to choose the center until at least one coordinate is not close to the center (so it doesn't overlap with the lattice in the center)
    for (var i = 0; i < nr_of_tries; i++) {
      cent_x = gene_range(-100 - cent_offset/2, 100 + cent_offset/2);
      cent_y = gene_range(-100 - cent_offset/2, 100 + cent_offset/2);
      if (Math.max(Math.abs(cent_x), Math.abs(cent_y)) > cent_offset) {break;}
    }
    tilt_angle = gene_range(-Math.PI, Math.PI); // full 360 degrees
    comet_rot = gene() < 0.5 ? Math.PI/4 : -Math.PI/4; // clockwise, anti-clockwise
    nr_of_triangles = 10000;
    customGaussian = gaussian(0, gene_range(0.01, 0.20)); // used for the comet, second param determines the width of the trail
  
  } else if (celestial_object_type == 'eclipse') {
    radius_x = gene_range(10, 75);
    radius_y = radius_x;
    // here we are trying to choose the center until at least one coordinate is not close to the center (so it doesn't overlap with the lattice in the center)
    for (var i = 0; i < nr_of_tries; i++) {
      cent_x = gene_range(-100 - cent_offset/2, 100 + cent_offset/2);
      cent_y = gene_range(-100 - cent_offset/2, 100 + cent_offset/2);
      if (Math.max(Math.abs(cent_x), Math.abs(cent_y)) > cent_offset) {break;}
    }
    tilt_angle = gene_range(-Math.PI, Math.PI); // full 360 degrees
    nr_of_triangles = Math.ceil(1000 * Math.sqrt(radius_x));
    stdev = gene() < 0.25 ? 2.0 : 0.4;
    customGaussian = gaussian(0, stdev);

  } else if (celestial_object_type == 'ultra eclipse') {
    radius_x = gene_range(100, 150);
    radius_y = radius_x;
    cent_x = 0;
    cent_y = 0;
    tilt_angle = gene_range(-Math.PI, Math.PI); // full 360 degrees
    nr_of_triangles = 20000;
    stdev = gene() < 0.5 ? 2.0 : 0.4;
    customGaussian = gaussian(0, stdev);

  } else if (celestial_object_type == 'moon') {
    radius_planet_x = gene_range(10, 75);
    radius_planet_y = radius_planet_x;
    radius_x = radius_planet_x; // we have to define this here as well so that the dark disc can be positioned
    radius_y = radius_planet_x; // same as above
    // here we are trying to choose the center until at least one coordinate is not close to the center (so it doesn't overlap with the lattice in the center)
    for (var i = 0; i < nr_of_tries; i++) {
      cent_planet_x = gene_range(-100 - cent_offset/2, 100 + cent_offset/2);
      cent_planet_y = gene_range(-100 - cent_offset/2, 100 + cent_offset/2);
      if (Math.max(Math.abs(cent_planet_x), Math.abs(cent_planet_y)) > cent_offset) {break;}
    }
    cent_x = cent_planet_x; // we have to define this here as well so that the dark disc can be positioned
    cent_y = cent_planet_y; // same as above
    moon_offset_x = gene_range(-100, 100); 
    moon_offset_y = gene_range(-100, 100);
    cent_moon_x = cent_planet_x + moon_offset_x; // approximation - moon is close to the center of the planet
    cent_moon_y = cent_planet_y + moon_offset_y; // same as above
    cent_moon_2nd_x = cent_planet_x - moon_offset_x * 0.5; // second moon is right opposite the center but closer
    cent_moon_2nd_y = cent_planet_y - moon_offset_y * 0.5; // same as above
    radius_moon_x = radius_planet_x * gene_range(0.05, 0.25);
    radius_moon_y = radius_moon_x;
    radius_moon_2nd_x = radius_moon_x * 0.5; // second moon is half the size
    radius_moon_2nd_y = radius_moon_2nd_x;
    tilt_angle = gene_range(-Math.PI, Math.PI); // full 360 degrees
    nr_of_triangles = Math.ceil(1000 * Math.sqrt(radius_planet_x));
    customGaussian = gaussian(0, 0.4);
    hasMoon = gene() < 0.50 ? true : false; // chance of a planet having a moon
    has2ndMoon = gene() < 0.25 ? true : false; // chance of a planet having a second moon
    hasAtmosphere = gene() < 0.25 ? true : false; // chance of a planet having an atmosphere

  } else if (celestial_object_type == 'planet') {
    radius_x = gene_range(10, 75);
    radius_y = radius_x * 0.25;
    // here we are trying to choose the center until at least one coordinate is not close to the center (so it doesn't overlap with the lattice in the center)
    for (var i = 0; i < nr_of_tries; i++) {
      cent_x = gene_range(-100 - cent_offset/2, 100 + cent_offset/2);
      cent_y = gene_range(-100 - cent_offset/2, 100 + cent_offset/2);
      if (Math.max(Math.abs(cent_x), Math.abs(cent_y)) > cent_offset) {break;}
    }
    tilt_angle = gene_range(-Math.PI, Math.PI); // full 360 degrees
    nr_of_triangles = Math.ceil(1000 * Math.sqrt(radius_x));
    customGaussian = gaussian(0, 0.4);
    stdev = gene_range(0.01, 0.15);
    ringGaussian = gaussian(1, stdev);
    hasDoubleRing = gene() < 0.35 ? true : false; // chance of a planet having a second ring
    secondRingGaussian = gaussian(1, 0.01);
    radius_offset = gene_range(1.2, 1.4); // scale factor for the second ring

  } else if (celestial_object_type == 'orbit') {
    radius_planet_x = 1000;
    radius_planet_y = radius_planet_x;
    radius_x = radius_planet_x; // we have to define this here as well so that the dark disc can be positioned
    radius_y = radius_planet_x; // same as above
    radius_atmosphere = radius_planet_x * gene_range(1.01, 1.05);
    orbitFlipped = gene() < 0.5 ? true : false; // determines if the planet is above or below the frame
    cent_planet_x = gene_range(-100, 100);
    cent_planet_y =  orbitFlipped ? gene_range(1000, 1100) : gene_range(-1000, -1100);
    cent_x = cent_planet_x; // we have to define this here as well so that the dark disc can be positioned
    cent_y = cent_planet_y; // same as above
    cent_moon_x = gene_range(-200, 200);
    cent_moon_y = orbitFlipped ? gene_range(-150, -100) : gene_range(100, 150);
    radius_moon_x = gene_range(5, 15);
    radius_moon_y = radius_moon_x;
    tilt_angle = 0; // full 360 degrees
    nr_of_triangles = 100000; //Math.ceil(2000 * Math.sqrt(radius_planet_x));
    customGaussian = gaussian(0, 0.4);
    hasMoon = gene() < 0.70 ? true : false; // chance of a planet having a moon
    hasAtmosphere = true; // chance of a planet having an atmosphere
    
  } else if (celestial_object_type == 'meteor shower') {
    radius_x = 500;
    radius_y = 500;
    centers_x = [];
    centers_y = [];
    stdevs = []
    nr_of_meteors = generateRandomInt(20, 100);
    for (var i = 0; i < nr_of_meteors; i++) {
      centers_x.push(gene_range(-350, 350));
      centers_y.push(gene_range(-350, 350));
      stdevs.push(gene_range(0.001, 0.01));
    }
    tilt_angle = gene_range(-Math.PI, Math.PI); // full 360 degrees
    nr_of_triangles = 50000;
    
  } else if (celestial_object_type == 'quasar') {
    radius_nova_x = 500;
    radius_nova_y = radius_nova_x * gene_range(0.001, 0.02); // spread of the quasar beam
    radius_ring_y = gene_range(50, 100);
    radius_ring_x = radius_ring_y * gene_range(0.05, 0.20); // width of the cloud elipse
    cent_x = gene_range(-100, 100);
    cent_y = gene_range(-100, 100);
    tilt_angle = gene_range(-Math.PI, Math.PI); // full 360 degrees
    nr_of_triangles = 50000;
    stdev = gene_range(0.01, 0.5);
    customGaussian = gaussian(1, stdev); // spread of the cloud ring 1, 0.1

  } else if (celestial_object_type == 'nova') {
    radius_nova_x = gene_range(5, 50);
    radius_nova_y = radius_nova_x;
    radius_ring_y = gene_range(50, 100);
    ring_y_scale = gene_range(0.05, 0.20); // width of the cloud elipse
    radius_ring_x = radius_ring_y * ring_y_scale;
    radius_offset = gene_range(1.5, 3.0); // scale factor for the second ring
    cent_x = gene_range(-100, 100);
    cent_y = gene_range(-100, 100);
    tilt_angle = gene_range(-Math.PI, Math.PI); // full 360 degrees
    nr_of_triangles = 50000;
    stdev = gene_range(0.01, 0.5);
    customGaussian = gaussian(1, stdev); // spread of the cloud ring
    stdev2nd = gene_range(0.01, 0.5);
    customGaussian2nd = gaussian(1, stdev2nd); // spread of the cloud ring
    hasDoubleRing = gene() < 0.80 ? true : false; // chance of having a second ring

  } else if (celestial_object_type == 'rapture') {
    radius_rapture_x = 500;
    radius_rapture_y = 500;
    rapture_size = gene_range(0.05, 0.15);
    radius_x = radius_rapture_x * rapture_size; // we have to define this here as well so that the dark disc can be positioned
    radius_y = radius_rapture_x * rapture_size; // same as above
    cent_x = gene_range(-100, 100);
    cent_y = gene_range(-100, 100);
    tilt_angle = gene_range(-Math.PI, Math.PI); // full 360 degrees
    nr_of_triangles = 50000;
  
  } else if (celestial_object_type == 'nebula') {
    bounds_x = 400;
    bounds_y = 400;
    cent_x = 0;
    cent_y = 0;
    tilt_angle = gene_range(-Math.PI, Math.PI); // full 360 degrees
    nr_of_triangles = 50000;
    perlin_shift = gene_range(-100, 100); // this will make sure the perlin pattern is not always the same
    perlin_scale = gene_range(0.001, 0.02); // scale of perlin features
  
  } else if (celestial_object_type == 'constellation') {
    radius_star_x = 50;
    radius_star_y = 50;
    radius_x = radius_star_x;
    radius_y = radius_star_y;
    radius_elongation = 0.05;
    radius_factors = [];
    hasStarShine = [];
    centers_x = [];
    centers_y = [];
    star_range = gene() < 0.80 ? 1 : 100; // select between two extremes
    nr_of_stars = generateRandomInt(star_range, star_range + 10);
    constellation_bounds = gene_range(150, 300);
    for (var i = 0; i < nr_of_stars; i++) {
      centers_x.push(gene_range(-constellation_bounds, constellation_bounds));
      centers_y.push(gene_range(-constellation_bounds, constellation_bounds));
      radius_factors.push(gene_range(0.05, 0.95)); // every star has a different size
      star_shine = gene() < 0.25 ? true : false;
      hasStarShine.push(star_shine); // determines if the star shine (like a plus sign) will be drawn for that star
    }
    tilt_angle = 0;
    nr_of_triangles = nr_of_stars * 1000;

  }

  
  // place dark disk behind the celestial objects but in front of the stars so they are covered
  if (celestial_object_type == 'eclipse' || celestial_object_type == 'ultra eclipse' || celestial_object_type == 'moon' || celestial_object_type == 'planet' || celestial_object_type == 'orbit' || celestial_object_type == 'rapture') {
    const dark_disc_geo = new THREE.CircleGeometry(radius_x, 16);
    const dark_disc_material = new THREE.MeshBasicMaterial({color: 0x000000});
    const dark_disc_mesh = new THREE.Mesh(dark_disc_geo, dark_disc_material);
    dark_disc_mesh.position.set(cent_x, cent_y, celestial_plane_distance - 100);
    this.scene.add(dark_disc_mesh);
  }

  // one triangle
  const vertices = [
    0, 1, 0, // top
    1, 0, 0, // right
    -1, 0, 0 // left
  ];
  // only one face
  const faces = [ 2, 1, 0 ];
  const triangle_radius = 0.30; //0.5

  const geometry = new THREE.PolyhedronGeometry(vertices, faces, triangle_radius, 0);
  geometry.scale(1, 1.5, 1);
  const material = new THREE.MeshPhongMaterial( {color: 0xffffff} );
  
  const imesh = new THREE.InstancedMesh( geometry, material, nr_of_triangles )
  imesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame

  // main loop that calcupates positions of all triangles
  for (var i = 0; i < nr_of_triangles; i++) {

    // special parameters for each celestial type

    if (celestial_object_type == 'comet') {
      angle = gene_range(-Math.PI * customGaussian(), Math.PI * customGaussian()); // puts a bias on one side of the circle - angle is determined by the tilt_angle - COMET
      r = gene_range(0, gene_range(0, gene_range(0, gene_range(0, 1)))); // more dense in the middle - COMET
    
    } else if (celestial_object_type == 'eclipse' || celestial_object_type == 'ultra eclipse') {
      angle = gene_range(-Math.PI * customGaussian(), Math.PI * customGaussian()); // puts a bias on one side of the circle - angle is determined by the tilt_angle - ECLIPSE
      r = 1 / (1 - gene_range(0, gene_range(0, gene_range(0, gene_range(0, 1))))); // solar eclipse - ECLIPSE
    
    } else if (celestial_object_type == 'moon') {
      if (gene() < 0.75) {
        // spherical planet
        angle = gene_range(-Math.PI * customGaussian(), Math.PI * customGaussian()); // puts a bias on one side of the circle - angle is determined by the tilt_angle - PLANET
        r = 1 - gene_range(0, gene_range(0, gene_range(0, gene_range(0, 1)))); // more dense at the edge - PLANET
        radius_x = radius_planet_x;
        radius_y = radius_planet_y;
        cent_x = cent_planet_x;
        cent_y = cent_planet_y;

      } else if (hasAtmosphere) {
        // spherical atmosphere
        angle = gene_range(-Math.PI * customGaussian(), Math.PI * customGaussian()); // puts a bias on one side of the circle - angle is determined by the tilt_angle - PLANET
        r = 1 - gene_range(0, gene_range(0, gene_range(0, 1))); // less dense at the edge - ATMOSPHERE
        radius_x = radius_planet_x * 1.1;
        radius_y = radius_planet_y * 1.1;
        cent_x = cent_planet_x;
        cent_y = cent_planet_y;
      }
      
      if (hasMoon && (gene() < 0.1)) {
        // spherical moon
        angle = gene_range(-Math.PI * customGaussian(), Math.PI * customGaussian()); // puts a bias on one side of the circle - angle is determined by the tilt_angle - MOON
        r = 1 - gene_range(0, gene_range(0, gene_range(0, gene_range(0, 1)))); // more dense at the edge - MOON
        radius_x = radius_moon_x;
        radius_y = radius_moon_y;
        cent_x = cent_moon_x;
        cent_y = cent_moon_y;
      }

      if (has2ndMoon && (gene() < 0.05)) {
        // spherical 2nd moon
        angle = gene_range(-Math.PI * customGaussian(), Math.PI * customGaussian()); // puts a bias on one side of the circle - angle is determined by the tilt_angle - 2nd MOON
        r = 1 - gene_range(0, gene_range(0, gene_range(0, gene_range(0, 1)))); // more dense at the edge - 2nd MOON
        radius_x = radius_moon_2nd_x;
        radius_y = radius_moon_2nd_y;
        cent_x = cent_moon_2nd_x;
        cent_y = cent_moon_2nd_y;
      }

    } else if (celestial_object_type == 'planet') {
      if (gene() < 0.65) {
        // spherical planet
        angle = gene_range(-Math.PI * customGaussian(), Math.PI * customGaussian()); // puts a bias on one side of the circle - angle is determined by the tilt_angle - PLANET
        r = 1 - gene_range(0, gene_range(0, gene_range(0, gene_range(0, 1)))); // more dense at the edge
        r_x = radius_x * 0.6;
        r_y = radius_x * 0.6;

      } else {
        // elipse ring
        angle = gene_range(2 * Math.PI / 3, 7 * Math.PI / 3); // top arc taken out
        r = ringGaussian(); // cloud aroud the edge
        r_x = radius_x;
        r_y = radius_y;
      }

      if (hasDoubleRing && (gene() < 0.1)) {
        // second elipse ring
        angle = gene_range(2 * Math.PI / 3, 7 * Math.PI / 3); // top arc taken out
        r = secondRingGaussian(); // cloud aroud the edge
        r_x = radius_x * radius_offset;
        r_y = radius_y * radius_offset;
      }

    }  else if (celestial_object_type == 'orbit') {
      if (gene() < 0.75) {
        // spherical planet
        angle = orbitFlipped ? gene_range(5 * Math.PI / 4, 7 * Math.PI / 4) : gene_range(-5 * Math.PI / 4, -7 * Math.PI / 4); // bottom or top 90 degrees
        r = 1 - gene_range(0, gene_range(0, gene_range(0, gene_range(0, 1)))); // more dense at the edge - PLANET
        radius_x = radius_planet_x;
        radius_y = radius_planet_y;
        cent_x = cent_planet_x;
        cent_y = cent_planet_y;

      } else if (hasAtmosphere) {
        // spherical atmosphere
        angle = orbitFlipped ? gene_range(5 * Math.PI / 4, 7 * Math.PI / 4) : gene_range(-5 * Math.PI / 4, -7 * Math.PI / 4); // bottom or top 90 degrees
        r = 1 - gene_range(0, gene_range(0, gene_range(0, gene_range(0, 1)))); // more dense at the edge - ATMOSPHERE
        radius_x = radius_atmosphere;
        radius_y = radius_atmosphere;
        cent_x = cent_planet_x;
        cent_y = cent_planet_y;
      }

      if (hasMoon && (gene() < 0.01)) {
        // spherical moon
        angle = gene_range(-Math.PI * customGaussian(), Math.PI * customGaussian()); // puts a bias on one side of the circle - angle is determined by the tilt_angle - MOON
        r = 1 - gene_range(0, gene_range(0, gene_range(0, gene_range(0, 1)))); // more dense at the edge - MOON
        radius_x = radius_moon_x;
        radius_y = radius_moon_y;
        cent_x = cent_moon_x;
        cent_y = cent_moon_y;
      }

    } else if (celestial_object_type == 'meteor shower') {
      rand_idx = generateRandomInt(0, centers_x.length); // we choose a random index from the list that holds meteor coordinates
      customGaussian = gaussian(0, stdevs[rand_idx]); // used for the comet, second param determines the width of the trail
      angle = gene_range(-Math.PI * customGaussian(), Math.PI * customGaussian()); // puts a bias on one side of the circle - angle is determined by the tilt_angle - METEOR SHOWER
      r = gene_range(0, gene_range(0, gene_range(0, gene_range(0, 1)))); // more dense in the middle - METEOR SHOWER
      cent_x = centers_x[rand_idx]; // draw random meteor from the coordinate list
      cent_y = centers_y[rand_idx]; // same as above

    } else if (celestial_object_type == 'quasar') {
      angle = gene_range(0, Math.PI * 2); // full 360 degrees
      if (gene() < 0.75) {
        // quasar beam - elongated super nova
        r = perlin2D(radius_x * Math.cos(angle) * 1.0, radius_y * Math.sin(angle) * 1.0); // supernova - QUASAR
        radius_x = radius_nova_x;
        radius_y = radius_nova_y;
      } else {
        // elipsoid ring
        r = customGaussian(); // cloud aroud the edge
        radius_x = radius_ring_x;
        radius_y = radius_ring_y;
      }

    } else if (celestial_object_type == 'nova') {
      angle = gene_range(0, Math.PI * 2); // full 360 degrees
      if (gene() < 0.75) {
        // super nova
        r = perlin2D(radius_x * Math.cos(angle) * 1.0, radius_y * Math.sin(angle) * 1.0); // supernova - NOVA
        radius_x = radius_nova_x;
        radius_y = radius_nova_y;
      } else {
        // elipsoid ring
        r = customGaussian(); // cloud aroud the edge
        radius_x = radius_ring_x;
        radius_y = radius_ring_y;
      }

      if (hasDoubleRing && (gene() < 0.25)) {
        // second elipsoid ring
        r = customGaussian2nd(); // cloud aroud the edge
        radius_x = radius_ring_x * radius_offset;
        radius_y = radius_ring_y * radius_offset;
      }

    } else if (celestial_object_type == 'rapture') {
      angle = gene_range(0, Math.PI * 2); // full 360 degrees
      r = rapture_size / (1 - perlin2D(radius_x * Math.cos(angle) * 0.1, radius_y * Math.sin(angle) * 0.1)); // dark central object bursting with light rays - RAPTURE
      radius_x = radius_rapture_x;
      radius_y = radius_rapture_y;

    } else if (celestial_object_type == 'nebula') {
      rand_x = gene_range(-bounds_x, bounds_x);
      rand_y = gene_range(-bounds_y, bounds_y);
      monteCarloHit = gene() < perlin2D(perlin_shift + rand_x * perlin_scale, perlin_shift + rand_y * perlin_scale) * 1.0; // perlin field influences the probability of a star appearing - NEBULA

    } else if (celestial_object_type == 'constellation') {
      rand_idx = generateRandomInt(0, centers_x.length); // we choose a random index from the list that holds meteor coordinates
      angle = gene_range(0, Math.PI * 2); // full 360 degrees
      r = gene_range(0, gene_range(0, gene_range(0, gene_range(0, gene_range(0, 1))))); // more dense in the middle - CONSTELLATION
      cent_x = centers_x[rand_idx]; // draw random star from the coordinate list
      cent_y = centers_y[rand_idx]; // same as above

      if (hasStarShine[rand_idx] == true) {
        // shine part of the star (like a plus sign)
        if (gene() < 0.5) {
          radius_x = radius_star_x * radius_elongation * radius_factors[rand_idx]; // here radius_elongation is actually shortening
          radius_y = radius_star_y * radius_factors[rand_idx] * 5.0; // this last factor will additionally elongate the shine
        } else {
          radius_x = radius_star_x * radius_factors[rand_idx] * 5.0; // this last factor will additionally elongate the shine
          radius_y = radius_star_y * radius_elongation * radius_factors[rand_idx]; // here radius_elongation is actually shortening
        }
        // fuzzy spherical part of the star
        if (gene() < 0.25) {
          radius_x = radius_star_x * radius_factors[rand_idx];
          radius_y = radius_star_y * radius_factors[rand_idx];
        }

      } else {
        // fuzzy spherical part of the star
        radius_x = radius_star_x * radius_factors[rand_idx] * 0.25;
        radius_y = radius_star_y * radius_factors[rand_idx] * 0.25;
      }

    }


    // determining the position of each triangle

    if (celestial_object_type == 'nebula') {
      // not based on a circle equation, just on perlin noise
      celestial_x = rand_x;
      celestial_y = rand_y;

    } else if (celestial_object_type == 'planet') {
      // exception because we have to draw planet and its ring at the same time (one is a sphere, the other an elipse)
      celestial_x = cent_x + r * r_x * Math.cos(angle) * Math.cos(tilt_angle) - r * r_y * Math.sin(angle) * Math.sin(tilt_angle);
      celestial_y = cent_y + r * r_x * Math.cos(angle) * Math.sin(tilt_angle) + r * r_y * Math.sin(angle) * Math.cos(tilt_angle);

    } else {
      // default case
      // general parametrization for a tilted ellipse
      //https://math.stackexchange.com/questions/2645689/what-is-the-parametric-equation-of-a-rotated-ellipse-given-the-angle-of-rotatio
      celestial_x = cent_x + r * radius_x * Math.cos(angle) * Math.cos(tilt_angle) - r * radius_y * Math.sin(angle) * Math.sin(tilt_angle);
      celestial_y = cent_y + r * radius_x * Math.cos(angle) * Math.sin(tilt_angle) + r * radius_y * Math.sin(angle) * Math.cos(tilt_angle);
    }

    if (celestial_object_type == 'comet') {
      // additional rotation of points proportional to r - COMET
      celestial_x_rot = celestial_x * Math.cos(comet_rot * r) - celestial_y * Math.sin(comet_rot * r);
      celestial_y_rot = celestial_x * Math.sin(comet_rot * r) + celestial_y * Math.cos(comet_rot * r);
      celestial_x = celestial_x_rot;
      celestial_y = celestial_y_rot;
    }
    
    if (celestial_object_type == 'nebula') {
      // rotation of points proportional to tilt_angle - NEBULA
      celestial_x_rot = celestial_x * Math.cos(tilt_angle) - celestial_y * Math.sin(tilt_angle);
      celestial_y_rot = celestial_x * Math.sin(tilt_angle) + celestial_y * Math.cos(tilt_angle);
      celestial_x = celestial_x_rot;
      celestial_y = celestial_y_rot;
    }

    const dummy = new THREE.Object3D();
    var uniscale = 0.5 + gene();
    dummy.scale.set(uniscale, uniscale, uniscale); // dynamically assign this to give different sizes (eg add attribute to nData.nodes and call it here)
    dummy.position.set(celestial_x, celestial_y, celestial_plane_distance);
    
    dummy.rotateX(gene() * Math.PI/3 - Math.PI/6);
    dummy.rotateY(gene() * Math.PI/3 - Math.PI/6);
    dummy.rotateZ(gene() * Math.PI/3 - Math.PI/6);

    dummy.updateMatrix();
    // if any triangle ends up too far from the center, we don't draw it
    // also monteCarloHit == false can appear in nebula type
    if (Math.max(Math.abs(celestial_x), Math.abs(celestial_y)) < 1000 && monteCarloHit) {
      imesh.setMatrixAt( i, dummy.matrix );
    }
  }

  
  imesh.instanceMatrix.needsUpdate = true
  //imesh.castShadow = true; // remove for performance
  //imesh.receiveShadow = true; // stars recieve no shadow
  this.scene.add(imesh);

}


View.prototype.addLineMesh = function (data, dash_array, dash_ratio, line_thickness, dash_speed) {
  var temp_array = new Float32Array(6);
  //console.log(gData.nodes[data['source']].x)
  temp_array[0] = gData.nodes[data['source']].x;
  temp_array[1] = gData.nodes[data['source']].y;
  temp_array[2] = gData.nodes[data['source']].z;
  temp_array[3] = gData.nodes[data['target']].x;
  temp_array[4] = gData.nodes[data['target']].y;
  temp_array[5] = gData.nodes[data['target']].z;

  var geo = new THREE.BufferGeometry()

  geo.setAttribute( 'position', new THREE.BufferAttribute( temp_array, 3 ) );

  var g = new MeshLine();
  g.setGeometry( geo );
  //g.setFromPoints()
  this.meshline_data.push(g)

  var material = new MeshLineMaterial( {
    antialias: true,
    useMap: false,
    color: new THREE.Color( my_features.ink),
    opacity: 1,
    transparent: true, // switch to false is opacity is 1, switch to true when using dashed lines
    dashArray: dash_array, // 0.05, 0 -> no dash ; 1 -> half dashline length ; 2 -> dashline = length
    dashOffset: 0,
    dashRatio: dash_ratio, // 0.0 -> full line ; 0.5 -> balancing ; 1.0 -> full void
    //resolution: resolution,
    sizeAttenuation: false, // makes the line width constant regardless distance (1 unit is 1px on screen) (false - attenuate, true - don't attenuate)
    lineWidth: line_thickness, // 0.002, float defining width (if sizeAttenuation is true, it's world units; else is screen pixels)
  });

  var mesh = new THREE.Mesh( g.geometry, material );
  this.meshline_mesh.push(mesh);

  this.scene.add(mesh);
}



View.prototype.render = function () {

    this.composer.render();
    //this.renderer.clear();  //

    requestAnimationFrame(this.render.bind(this));

    //this.renderer.clear();  //
    if (debug){
      var start_timer = new Date().getTime();
    }

    if (debug){
      var end_timer = new Date().getTime();
      composer_pass = end_timer - start_timer
    }
    if(snap) {
      //console.log(controller)
      capture(controller);
      snap = false;
    }
    if(recording) {
      capturer.capture( renderer.domElement );
    }
    //this.renderer.render(this.scene, this.camera); // When no layers are used

};

function Controller(viewArea) {
  var view = new View(viewArea);
  view.cam_distance = 700 //1000 for ortho
  this.view = view; //referenced outside

  var ticker = 0;
  var sigmoid_ticker = 0;
  var ticker_set = [];

  for (var i = 0; i < stage; i++) {
    ticker_set.push(0);
  }

  const parallex_amplitude = view.cam_distance;
  const parallex_delay = 5000;
  const parallex_framerate = 200; //33ms for 30fps and 15fps for 60fps
  const parallex_step = 0.5*Math.PI/parallex_framerate; //0.5*Math.PI/parallex_framerate
  const stopping_angle = Math.PI/2 //Change to desired sector angle IMPORTANT: Must fit in 2Pi with no remainder to get alignment every period

  //Sigmoid Function for motion
  const sigmoid_amplitude = 0.05 //0.113; //Best range to work from -Pi ti Pi

  const mid_sector = stopping_angle/2;
  var current_stage = 0
  var current_dir = 1

  const up = new THREE.Vector3(0,1,0)

  // LIGHT TRAVEL PARAMETERS
  var light_framerate = 50; 
  light_framerate_change = 50; //Needs to be the same
  var base_light_angle = Math.PI/3; // starting angle, angle 0 is straight behind the camera
  base_light_angle_step = 0.0005; //0.05
  //var light_angle;
  var light_angle_step;

  if (light_source_type == 'west') {
    light_angle = -base_light_angle;
    light_angle_step = base_light_angle_step;
  } else if (light_source_type == 'east') {
    light_angle = base_light_angle;
    light_angle_step = -base_light_angle_step;
  } else if (light_source_type == 'north') {
    light_angle = base_light_angle;
    light_angle_step = -base_light_angle_step;
  } else if (light_source_type == 'south') {
    light_angle = -base_light_angle;
    light_angle_step = base_light_angle_step;
  }


  // LIGHT TRAVEL LOGIC
  var arc_division = 1.0;
  const lp = view.light.position;
  function update_light_position () {
    light_angle += light_angle_step*arc_division;

    if ((light_source_type == 'west') || (light_source_type == 'east')) {
      // rotation in XY plane
      view.light.position.set(Math.sin(light_angle)*parallex_amplitude, lp.y, Math.cos(light_angle)*parallex_amplitude); //1000,1000,1000
    } else if ((light_source_type == 'north') || (light_source_type == 'south')) {
    // rotation in YZ plane
    view.light.position.set(lp.x, Math.sin(light_angle)*parallex_amplitude, Math.cos(light_angle)*parallex_amplitude);
    }
    // rotation in XZ plane
    //view.light.position.set(Math.sin(light_angle)*parallex_amplitude, Math.cos(light_angle)*parallex_amplitude, lp.z);
  }
 
  var lightIntervalInstance = setInterval(function () {update_light_position()}, light_framerate);


  setTimeout(function ()  {
    setInterval(function () {
      start_timer = new Date().getTime()

      if (base_light_angle_step != Math.abs(light_angle_step)) { //if step changed update step
        //console.log(base_light_angle_step, Math.abs(light_angle_step));
        if (getKeyByValue(light_step_size_param, base_light_angle_step) == "DaySync") { //light_step_size_param.DaySync
          arc_division = base_light_angle_step*1000/light_framerate;
          //console.log("Arc Division Factor: " + arc_division.toString())
          if (light_angle_step == 0) {
            light_angle_step = base_light_angle_step;
          } else {
            light_angle_step = Math.sign(light_angle_step)*base_light_angle_step;
          }
          
          //console.log("After", Math.sign(light_angle_step) ,base_light_angle_step)
        } else {
          arc_division = 1.0;
          if (light_angle_step == 0) {
            light_angle_step = base_light_angle_step;
          } else {
            light_angle_step = Math.sign(light_angle_step)*base_light_angle_step;//use new amplitude with same sign, avoids another if statement
          }
        }
      }

      if (light_framerate != light_framerate_change) {
        clearInterval(lightIntervalInstance); //remove previous interval
        if (getKeyByValue(light_step_size_param, Math.abs(light_angle_step)) == "DaySync") { //light_step_size_param.DaySync
          arc_division = Math.abs(light_angle_step)*1000/light_framerate;
          console.log("Arc Division Factor: " + arc_division.toString())
        
        } else { arc_division = 1.0; }//Update light step as well if framerate is changed and
        light_framerate = light_framerate_change;
        lightIntervalInstance = setInterval(function () {update_light_position()}, light_framerate); //create new interval with updated framerate
      }

    
      if (debug) {
        var end_timer = new Date().getTime();
        pre_calc = (end_timer - start_timer);
      }

      if (debug) {
        end_timer = new Date().getTime();
        viz_update =  (end_timer - start_timer - pre_calc);
      }

      ticker += parallex_step; //parallex_step;

      for (var i = 0; i < stage; i++) {
        ticker_set[i] += steps[i];
      }

    }, parallex_framerate);
  }, parallex_delay)

  view.addInstances();
  view.addStarsOrdered(); // ordered stars based on lattice nodes from nDatas
  view.addStarsRandom(random_starfield_bounds, nr_of_random_stars); // random stars - parameters > (bounds, quantity)

  // all celestial objects from the celestial_object_types list will be added here
  if (celestial_object_types[0] != 'none') {
    for (var i = 0; i < celestial_object_types.length; i++) {
      view.addCelestialObject(celestial_object_types[i]);
    }
  }


  view.render();


  // remove loading screen once the app is loaded to this point and min_loading_time has elapsed
  var loading_end_time = new Date().getTime();
  var loading_time = loading_end_time - loading_start_time;
  if (loading_time > min_loading_time) {
    for (i = 0; i < 21; i++) {
      let k = i; // we need to do this because: https://codehandbook.org/understanding-settimeout-inside-for-loop-in-javascript/
      setTimeout(function () {document.querySelector("#loading").style.opacity = 1.00 - k * 0.05;}, 100 * k);
    }
    setTimeout(function () {document.querySelector("#loading").style.display = "none";}, 2000);
  } else {
    for (i = 0; i < 21; i++) {
      let k = i; // we need to do this because: https://codehandbook.org/understanding-settimeout-inside-for-loop-in-javascript/
      setTimeout(function () {document.querySelector("#loading").style.opacity = 1.00 - k * 0.05;}, min_loading_time - loading_time + 100 * k);
    }
    setTimeout(function () {document.querySelector("#loading").style.display = "none";}, min_loading_time - loading_time + 2000);
  }
  setTimeout(function () {fxpreview();}, min_loading_time+3000)

  function onWindowResize() {
    //console.log("resize")
    viewportAdjust(document.getElementById('viewport'), false);
    fitCameraToViewport(view, viewportWidth, viewportHeight);
    }
  
    window.addEventListener( 'resize', onWindowResize );
}

function obscvrvm () {
  controller = new Controller('viewport');
}


function viewportAdjust(vp, inner=true) {
  ///ADJUST SIZE AND MARGIN
  if (inner) {
    if (window.innerWidth/aspect_ratio>window.innerHeight) { //If target viewport height is larger then inner height

      viewportHeight = window.innerHeight; //Force Height to be inner Height
      viewportWidth = aspect_ratio*window.innerHeight;  //Scale width proportionally
  
      margin_top = 0;
      margin_left = (window.innerWidth - viewportWidth)/2;
    } else {  //If target viewport width is larger then inner width
  
      viewportHeight = window.innerWidth/aspect_ratio; //Scale viewport height proportionally
      viewportWidth = window.innerWidth; //Force Width  to be inner Height
  
      margin_top = (window.innerHeight - viewportHeight)/2;
      margin_left = 0;


    }

    ///SCALING
    cam_factor_mod = cam_factor * Math.min((viewportWidth/1000)*quality, (viewportHeight/1000)*quality);
    
  } else {
    if (window.innerWidth/aspect_ratio>window.innerHeight) { //If target viewport height is larger then inner height
      
      //document.documentElement.scrollWidth/scrollHeight
      viewportHeight = window.innerHeight; //Force Height to be inner Height
      viewportWidth = aspect_ratio*window.innerHeight;  //Scale width proportionally
  
      margin_top = 0;
      margin_left = (window.innerWidth - viewportWidth)/2;
    } else {  //If target viewport width is larger then inner width
  
      viewportHeight = window.innerWidth/aspect_ratio; //Scale viewport height proportionally
      viewportWidth = window.innerWidth; //Force Width  to be inner Height
  
      margin_top = (window.innerHeight - viewportHeight)/2;
      margin_left = 0;

    }

    ///SCALING
    cam_factor_mod = cam_factor * Math.min(viewportWidth/1000, viewportHeight/1000);
  }
  vp.style.marginTop=margin_top+'px';
  vp.style.marginLeft=margin_left+'px';

}

function fitCameraToViewport(view_instance, w,h, adjust=true) {
  view_instance.renderer.setSize( w, h);
  view_instance.composer.setSize( w, h);
  //view_instance.camera.aspect = w / h;
  if (adjust) {
    view_instance.camera.left = -w / cam_factor_mod;
    view_instance.camera.right = w / cam_factor_mod;
    view_instance.camera.top = h / cam_factor_mod;
    view_instance.camera.bottom = -h / cam_factor_mod;
  }

  view_instance.camera.updateProjectionMatrix();
}


function capturer_custom_save() {
  setTimeout(() => {
    capturer.save(function( blob ) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `OBSCVRVM_${parseInt(Math.random()*10000000)}.gif`;
      a.click();
      URL.revokeObjectURL(url);
      });
      setTimeout(() => {
        capturer = null; //Set capturer back to null after download
      }, 250);
    }, 0);
}

function check_drawing_buffer(q) {
  const max_side = 5500; // looks like the max buffer for Chrome on desktop is 5760, so we take a bit lower to be safe
  //console.log(window.devicePixelRatio)
  var taget_size = q*Math.max(viewportWidth, viewportHeight);
  if (taget_size > max_side) {
    var reduced_quality = q*max_side/taget_size;
    console.log("Browser drawing buffer exceed. Reverting to the following quality multiplier: " + reduced_quality.toFixed(2).toString());
    return reduced_quality;
  } else {
    return q
  }
}

// define a handler
function doc_keyUp(e) {
  // Example double key use: e.ctrlKey && e.key === 'ArrowDown'
  // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
  if (e.keyCode === 49 || e.keyCode === 97) { // 1 or NumPad 1   
    snap = true;
    quality = 1;
  } else if (e.keyCode === 50 || e.keyCode === 98) {// 2 or NumPad 2
    snap = true;
    quality = check_drawing_buffer(2);
  } else if (e.keyCode === 51 || e.keyCode === 99) {// 3 or NumPad 3
    snap = true;
    quality = check_drawing_buffer(3);
  } else if (e.keyCode === 52 || e.keyCode === 100) { // 4 or NumPad 4
    snap = true;
    quality = check_drawing_buffer(4);
  } else if (e.keyCode === 53 || e.keyCode === 101) { // 5 or NumPad 5
    snap = true;
    quality = check_drawing_buffer(5);
  } else if (e.keyCode === 71 ) {  //"g" = Gif
    recording = !recording;
    if(recording){
      //new capturer instance
      capturer = new CCapture( {
        verbose: false,
        display: false,
        //quality: 99,
        //name: variant_name,
        //framerate:,
        //autoSaveTime:, //does not work for gif
        //timeLimit: 10000,
        format: 'gif',
        workersPath: 'js/capture/src/'
      } );
      capturer.start();
      setTimeout(() => {
        if (capturer != null) {
          capturer.stop();
          capturer_custom_save();
        }
      },5000)
    }
    else if (capturer != null) { //If capturer in ongoing and button press the "g" button again
      capturer.stop();
      capturer_custom_save();

    }
  } else if (e.keyCode === 70 ) {  //"f" = increment light travel framerate
    light_framerate_change = findNextValueByValue(light_framerate_change, light_frame_speed_param)
    console.log("light framerate changed to: " + getKeyByValue(light_frame_speed_param, light_framerate_change))
  } else if (e.keyCode === 84 ) {  //"t" = increase travel speed
    base_light_angle_step = findNextValueByValue(base_light_angle_step, light_step_size_param)
    console.log("light angle step changed to: " + getKeyByValue(light_step_size_param, base_light_angle_step))
  } else if (e.keyCode === 65 ) {  //"a" = jump light angle by 30 degrees
    light_angle += Math.PI/6; //advance light angle by 30deg
    console.log("Skipped 30degrees")
  } else if (e.keyCode === 66 ) {  //"b" = flip background from black to white
    background_toggle = !background_toggle;
    if (background_toggle) {
      document.body.style.backgroundColor = "black";
      console.log("Background: black")
    } else {
      document.body.style.backgroundColor = "white";
      console.log("Background: white")
    }
    
  } 
  else if (e.keyCode === 73 && !e.ctrlKey) {  //i and not ctrl
    document.getElementById("keybinding").style.display = "block";
    document.querySelector("#keybinding").style.opacity = 1
    //Load modal with decription for all the keys for few 
    //seconds and make it fade to invisible after a few seconds. 
    //Each additional non active key press restarts the fade out animation
    if (typeof fade !== 'undefined') {
      clearInterval(fade)
      };
    var fade;
    setTimeout(function() {
      fade = setInterval(function () {
        document.querySelector("#keybinding").style.opacity -= 0.025;
        if (document.querySelector("#keybinding").style.opacity <= 0 ) {
          document.querySelector("#keybinding").style.display = "none";
          clearInterval(fade)
        }
      }, 100);
    },3000);
  }
}

const handler = (e) => {
    obscvrvm();
};

const capture = (contx) => {
  ///DOCSIZE
  document.documentElement.scrollWidth = viewportWidth*quality;
  document.documentElement.scrollHeight = viewportHeight*quality;
  ///SCALING
  cam_factor_mod = cam_factor * Math.min(viewportWidth*quality/1000, viewportHeight*quality/1000);
  ///SetMargin to 0
  document.getElementById('viewport').style.marginTop=0 +'px';
  document.getElementById('viewport').style.marginLeft=0 +'px';
  fitCameraToViewport(contx.view, viewportWidth*quality, viewportHeight*quality, true); //Projection Matrix Updated here

  composer.render();

  try {
    const urlBase64 = renderer.domElement.toDataURL('img/png'); 
    const a = document.createElement("a");
    a.href = urlBase64;
    a.download = `OBSCVRVM_${parseInt(Math.random()*10000000)}.png`;
    a.click();
    URL.revokeObjectURL(urlBase64);
  }  
  catch(e) {
    console.log("Browser does not support taking screenshot of 3d context");
    return;
  }
  // Set to standard quality
  quality = 1;

  viewportAdjust(document.getElementById('viewport'))
  cam_factor_mod = cam_factor * Math.min(viewportWidth*quality/1000, viewportHeight*quality/1000);
  
  fitCameraToViewport(contx.view, viewportWidth, viewportHeight); //Projection Matrix Updated
  
  composer.render();
};

// register the capture key handler 
document.addEventListener('keyup', doc_keyUp, false);

document.addEventListener('DOMContentLoaded', () => {
  handler();
});



