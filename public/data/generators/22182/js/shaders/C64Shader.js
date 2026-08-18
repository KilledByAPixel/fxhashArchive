/**
 * @author @oosmoxiecode
 */

THREE.C64Shader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec3 c64col[27];",
			"c64col[0] = vec3(0.0,0.0,0.0);",
"c64col[1] = vec3(0.0,0.0,128.0);",
"c64col[2] = vec3(0.0,0.0,255.0);",
"c64col[3] = vec3(0.0,128.0,0.0);",
"c64col[4] = vec3(0.0,128.0,128.0);",
"c64col[5] = vec3(0.0,128.0,255.0);",
"c64col[6] = vec3(0.0,255.0,0.0);",
"c64col[7] = vec3(0.0,255.0,128.0);",
"c64col[8] = vec3(0.0,255.0,255.0);",
"c64col[9] = vec3(128.0,0.0,0.0);",
"c64col[10] = vec3(128.0,0.0,128.0);",
"c64col[11] = vec3(128.0,0.0,255.0);",
"c64col[12] = vec3(128.0,128.0,0.0);",
"c64col[13] = vec3(128.0,128.0,128.0);",
"c64col[14] = vec3(128.0,128.0,255.0);",
"c64col[15] = vec3(128.0,255.0,0.0);",
"c64col[16] = vec3(128.0,255.0,128.0);",
"c64col[17] = vec3(128.0,255.0,255.0);",
"c64col[18] = vec3(255.0,0.0,0.0);",
"c64col[19] = vec3(255.0,0.0,128.0);",
"c64col[20] = vec3(255.0,0.0,255.0);",
"c64col[21] = vec3(255.0,128.0,0.0);",
"c64col[22] = vec3(255.0,128.0,128.0);",
"c64col[23] = vec3(255.0,128.0,255.0);",
"c64col[24] = vec3(255.0,255.0,0.0);",
"c64col[25] = vec3(255.0,255.0,128.0);",
"c64col[26] = vec3(255.0,255.0,255.0);",

			"vec3 samp = texture2D(tDiffuse, vUv.xy).rgb;",
			"vec3 match = vec3(0.0,0.0,0.0);",
			"float best_dot = 8.0;",

			"for (int c=26;c>=0;c--) {",
			  "float this_dot = distance(c64col[c]/255.0,samp);",
			  "if (this_dot<best_dot) {",
			     "best_dot=this_dot;",
			     "match=c64col[c];",
			  "}",
			"}",
			"vec4 color = vec4(match/255.0,0.0);",

			"gl_FragColor = color;",

		"}"

	].join("\n")

};
