// LATTICE GENERATION STEPS

//subdivision rule decleration
rule_pyramid = new RulePyramid_v2();
rule_tapered = new RuleTapered_v2();

function generate_lattice(lattice_params) {

    // object destructuring - this will unpack all values from the dict and assign them variable names according to their keyes
    var { primitive, stage, start_bounds, double_sided, start_rot, deform_type, position, sub_rules, mod_rules, extrude_face, extrude_face0, contract_middle, leave_middle, triangulate } = lattice_params;

    var start_mesh;

    if (primitive == 'plane') {
    start_mesh = new Plane(position.x, position.y, position.z, start_bounds*deform_type[0], start_bounds*deform_type[1], double_sided)
    } else if (primitive == 'triangle') {
    start_mesh = new Triangle(position.x, position.y, position.z, start_bounds * 0.5, double_sided, start_rot)
    } else if (primitive == 'pentagon') {
    start_mesh = new Pentagon(position.x, position.y, position.z, start_bounds * 0.5, double_sided, start_rot)
    } else if (primitive == 'hexahedron') {
    start_mesh = new Hexahedron(position.x, position.y, position.z, start_bounds*deform_type[0], start_bounds*deform_type[1], start_bounds*deform_type[2], double_sided)
    } else if (primitive == 'dodecahedron') {
    start_mesh = new Dodecahedron(position.x, position.y, position.z, start_bounds * 0.5, double_sided)
    } else if (primitive == 'tetrahedron') {
    start_mesh = new Tetrahedron(position.x, position.y, position.z, start_bounds * 0.75, double_sided)
    } else if (primitive == 'octahedron') {
    start_mesh = new Octahedron(position.x, position.y, position.z, start_bounds, start_bounds, start_bounds, double_sided)
    }

    var lattice_mesh = start_mesh.get_mesh();
    var lattice_mesh_target = start_mesh.get_mesh(); //JSON.parse(JSON.stringify(lattice_mesh)); //Deep Copy

    for (var i = 0; i < stage; i++) {
        if (sub_rules[i] == 0) {
            // console.log("PYRAMID")
            lattice_mesh = rule_pyramid.replace(lattice_mesh, extrude_face[i], mod_rules[i]);
            lattice_mesh_target = rule_pyramid.replace(lattice_mesh_target, extrude_face0[i], mod_rules[i]);
        } else {
            //console.log("TAPER")
            lattice_mesh = rule_tapered.replace(lattice_mesh, contract_middle[i], extrude_face[i], leave_middle[i], mod_rules[i])
            lattice_mesh_target = rule_tapered.replace(lattice_mesh_target, contract_middle[i], extrude_face0[i], leave_middle[i], mod_rules[i])
        }
    }

    return mesh_to_gData(lattice_mesh, lattice_mesh_target, triangulate) //debug will be passed as a global
};