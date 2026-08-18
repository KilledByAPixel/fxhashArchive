// Created by Koboljka, 2022
// these are the variables you can use as inputs to your algorithms
console.log(fxhash) // the 64 chars hex number fed to your algorithm
console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()
// note about the fxrand() function 
// when the "fxhash" is always the same, it will generate the same sequence of
// pseudo random numbers, always
//----------------------
// defining features
//----------------------
// You can define some token features by populating the $fxhashFeatures property
// of the window object.
// More about it in the guide, section features:
// [https://fxhash.xyz/articles/guide-mint-generative-token#features]
//
// window.$fxhashFeatures = {
//	 "Background": "Black",
//	 "Number of lines": 10,
//	 "Inverted": true
// }
let koboljkaWidth = 600;
let koboljkaHeight = 600;
let rotRnd;
let palettes, nagibi_array, palette, palette2, weight, centar;
let kaciga, oblik_svjetla, povirivanje, pozadina, boja_robot,boja_sunce, boja_mjesec, boja_global, boja_oko, boja_zjenica;
let global_x, global_y, global_velicina 
let mjesec_x, mjesec_y, mjesec_velicina;
let sunce_x, sunce_y, sunce_velicina;
let publika_1_od, publika_1_do, publika_2_od, publika_2_do, publika_3_od, publika_3_do, publika_4_od, publika_4_do;	
var vel;
let rnd;
let seed = Math.trunc(fxrand() * 10000000);
let phase = 0;
let zoff = 0;
let yoff = 0;
let xoff = 0;
let array_horizont = [
[1066,600, /**/0.66, /**/ 1.02, 4.0,/**/ 1.01, 1.04,/**/ 1.00, 1.02, /**/ 1.00, 1.02, /**/ 1.00, 1.01, /******/ 70, 0.40, 10, /**/ 70, 0.50, 0, /**/ 130, 0.45, 0, /**/ 140, 0.35, 0, /**/ 150, 0.25, 0], 
[1066,600, /**/0.66, /**/ 1.02, 4.0,/**/ 1.01, 1.04,/**/ 1.00, 1.02, /**/ 1.00, 1.02, /**/ 1.00, 1.01, /******/ 70, 0.40, 10, /**/ 70, 0.50, 0, /**/ 130, 0.45, 0, /**/ 140, 0.35, 0, /**/ 150, 0.25, 0], 
[600,600, /**/0.66, /**/ 1.02, 4.0,/**/ 1.01, 1.04,/**/ 1.00, 1.02, /**/ 1.00, 1.02, /**/ 1.00, 1.01, /******/ 70, 0.40, 10, /**/ 70, 0.50, 0, /**/ 130, 0.45, 0, /**/ 140, 0.35, 0, /**/ 150, 0.25, 0], 
[600,900, /**/0.66, /**/ 1.02, 4.0,/**/ 1.01, 1.06,/**/ 1.00, 1.02, /**/ 1.00, 1.02, /**/ 1.00, 1.01, /******/ 70, 0.40, 10, /**/ 70, 0.50, 0, /**/ 130, 0.45, 0, /**/ 140, 0.35, 0, /**/ 150, 0.25, 0], 
[1066,600, /**/0.75, /**/ 1.020, 4.0,/**/ 1.015, 1.070,/**/ 1.010, 1.035, /**/ 1.005, 1.015, /**/ 1.000, 1.010, /******/ 50, 0.30, 20, /**/ 70, 0.20, 0, /**/ 80, 0.10, 0, /**/ 125, 0.05, 0, /**/ 150, 0.01, 0], 
[1066,600, /**/0.75, /**/ 1.020, 4.0,/**/ 1.015, 1.070,/**/ 1.010, 1.035, /**/ 1.005, 1.015, /**/ 1.000, 1.010, /******/ 50, 0.30, 20, /**/ 70, 0.20, 0, /**/ 80, 0.10, 0, /**/ 125, 0.05, 0, /**/ 150, 0.01, 0], 
[600,600, /**/0.75, /**/ 1.020, 4.0,/**/ 1.015, 1.070,/**/ 1.010, 1.035, /**/ 1.005, 1.015, /**/ 1.000, 1.010, /******/ 50, 0.30, 20, /**/ 70, 0.20, 0, /**/ 80, 0.10, 0, /**/ 125, 0.05, 0, /**/ 150, 0.01, 0], 
[600,900, /**/0.75, /**/ 1.020, 4.0,/**/ 1.015, 1.070,/**/ 1.010, 1.035, /**/ 1.005, 1.015, /**/ 1.000, 1.010, /******/ 50, 0.30, 20, /**/ 70, 0.20, 0, /**/ 80, 0.10, 0, /**/ 125, 0.05, 0, /**/ 150, 0.01, 0], 
[1066,600, /**/0.74, /**/ 1.020, 4.0,/**/ 1.015, 1.070,/**/ 1.010, 1.035, /**/ 1.005, 1.015, /**/ 1.000, 1.010, /******/ 60, 0.30, 15, /**/ 70, 0.20, 0, /**/ 80, 0.10, 0, /**/ 125, 0.05, 0, /**/ 150, 0.01, 0],
[1066,600, /**/0.74, /**/ 1.020, 4.0,/**/ 1.015, 1.070,/**/ 1.010, 1.035, /**/ 1.005, 1.015, /**/ 1.000, 1.010, /******/ 60, 0.30, 15, /**/ 70, 0.20, 0, /**/ 80, 0.10, 0, /**/ 125, 0.05, 0, /**/ 150, 0.01, 0], 
[600,600, /**/0.74, /**/ 1.020, 4.0,/**/ 1.015, 1.070,/**/ 1.010, 1.035, /**/ 1.005, 1.015, /**/ 1.000, 1.010, /******/ 60, 0.30, 15, /**/ 70, 0.20, 0, /**/ 80, 0.10, 0, /**/ 125, 0.05, 0, /**/ 150, 0.01, 0], 
[600,900, /**/0.74, /**/ 1.020, 4.0,/**/ 1.015, 1.070,/**/ 1.010, 1.035, /**/ 1.005, 1.015, /**/ 1.000, 1.010, /******/ 60, 0.30, 15, /**/ 70, 0.20, 0, /**/ 80, 0.10, 0, /**/ 125, 0.05, 0, /**/ 150, 0.01, 0], 
[1066,600, /**/0.70, /**/ 1.020, 4.0,/**/ 1.015, 1.070,/**/ 1.010, 1.035, /**/ 1.005, 1.015, /**/ 1.000, 1.010, /******/ 60, 0.30, 15, /**/ 70, 0.20, 0, /**/ 80, 0.10, 0, /**/ 125, 0.05, 0, /**/ 150, 0.01, 0], 
[1066,600, /**/0.70, /**/ 1.020, 4.0,/**/ 1.015, 1.070,/**/ 1.010, 1.035, /**/ 1.005, 1.015, /**/ 1.000, 1.010, /******/ 60, 0.30, 15, /**/ 70, 0.20, 0, /**/ 80, 0.10, 0, /**/ 125, 0.05, 0, /**/ 150, 0.01, 0], 
[600,600, /**/0.70, /**/ 1.020, 4.0,/**/ 1.015, 1.070,/**/ 1.010, 1.035, /**/ 1.005, 1.015, /**/ 1.000, 1.010, /******/ 60, 0.30, 15, /**/ 70, 0.20, 0, /**/ 80, 0.10, 0, /**/ 125, 0.05, 0, /**/ 150, 0.01, 0], 
[600,900, /**/0.70, /**/ 1.020, 4.0,/**/ 1.015, 1.070,/**/ 1.010, 1.035, /**/ 1.005, 1.015, /**/ 1.000, 1.010, /******/ 60, 0.30, 15, /**/ 70, 0.20, 0, /**/ 80, 0.10, 0, /**/ 125, 0.05, 0, /**/ 150, 0.01, 0], 
[1066,600, /**/0.65, /**/ 1.000, 4.0,/**/ 1.000, 1.150,/**/ 1.015, 1.070, /**/ 1.010, 1.030, /**/ 1.000, 1.015, /******/ 50, 0.60, 10, /**/ 90, 0.50, 2, /**/ 136, 0.20, 1, /**/ 146, 0.10, 0, /**/ 156, 0.05, 0], 
[1066,600, /**/0.65, /**/ 1.000, 4.0,/**/ 1.000, 1.150,/**/ 1.015, 1.070, /**/ 1.010, 1.030, /**/ 1.000, 1.015, /******/ 50, 0.60, 10, /**/ 90, 0.50, 2, /**/ 136, 0.20, 1, /**/ 146, 0.10, 0, /**/ 156, 0.05, 0], 
[600,600, /**/0.65, /**/ 1.000, 4.0,/**/ 1.000, 1.150,/**/ 1.015, 1.070, /**/ 1.010, 1.030, /**/ 1.000, 1.015, /******/ 50, 0.60, 10, /**/ 90, 0.50, 2, /**/ 136, 0.20, 1, /**/ 146, 0.10, 0, /**/ 156, 0.05, 0], 
[600,900, /**/0.65, /**/ 1.000, 4.0,/**/ 1.000, 1.150,/**/ 1.015, 1.070, /**/ 1.010, 1.030, /**/ 1.000, 1.015, /******/ 50, 0.60, 10, /**/ 90, 0.50, 2, /**/ 136, 0.20, 1, /**/ 146, 0.10, 0, /**/ 156, 0.05, 0], 
[1066,600, /**/0.80, /**/ 1.030, 4.0,/**/ 1.015, 1.080,/**/ 1.010, 1.035, /**/ 1.005, 1.015, /**/ 1.000, 1.010, /******/ 50, 0.30, 6, /**/ 125, 0.20, 5, /**/ 150, 0.10, 0, /**/ 160, 0.05, 0, /**/ 170, 0.01, 0], 
[1066,600, /**/0.80, /**/ 1.030, 4.0,/**/ 1.015, 1.080,/**/ 1.010, 1.035, /**/ 1.005, 1.015, /**/ 1.000, 1.010, /******/ 50, 0.30, 6, /**/ 125, 0.20, 5, /**/ 150, 0.10, 0, /**/ 160, 0.05, 0, /**/ 170, 0.01, 0], 
[600,600, /**/0.80, /**/ 1.030, 4.0,/**/ 1.015, 1.080,/**/ 1.010, 1.035, /**/ 1.005, 1.015, /**/ 1.000, 1.010, /******/ 50, 0.30, 6, /**/ 125, 0.20, 5, /**/ 150, 0.10, 0, /**/ 160, 0.05, 0, /**/ 170, 0.01, 0], 
[600,900, /**/0.80, /**/ 1.030, 4.0,/**/ 1.015, 1.080,/**/ 1.010, 1.035, /**/ 1.005, 1.015, /**/ 1.000, 1.010, /******/ 50, 0.30, 6, /**/ 125, 0.20, 5, /**/ 150, 0.10, 0, /**/ 160, 0.05, 0, /**/ 170, 0.01, 0], 
[1066,600, /**/0.71, /**/ 1.020, 4.0,/**/ 1.015, 1.070,/**/ 1.010, 1.035, /**/ 1.005, 1.045, /**/ 1.000, 1.040, /******/ 60, 0.40, 5, /**/ 70, 0.40, 0, /**/ 80, 0.30, 0, /**/ 125, 0.20, 0, /**/ 165, 0.10, 0], 
[1066,600, /**/0.71, /**/ 1.020, 4.0,/**/ 1.015, 1.070,/**/ 1.010, 1.035, /**/ 1.005, 1.045, /**/ 1.000, 1.040, /******/ 60, 0.40, 5, /**/ 70, 0.40, 0, /**/ 80, 0.30, 0, /**/ 125, 0.20, 0, /**/ 165, 0.10, 0], 
[600,600, /**/0.71, /**/ 1.020, 4.0,/**/ 1.015, 1.070,/**/ 1.010, 1.035, /**/ 1.005, 1.045, /**/ 1.000, 1.040, /******/ 60, 0.40, 5, /**/ 70, 0.40, 0, /**/ 80, 0.30, 0, /**/ 125, 0.20, 0, /**/ 165, 0.10, 0], 
[600,900, /**/0.71, /**/ 1.020, 4.0,/**/ 1.015, 1.070,/**/ 1.010, 1.035, /**/ 1.005, 1.045, /**/ 1.000, 1.040, /******/ 60, 0.40, 5, /**/ 70, 0.40, 0, /**/ 80, 0.30, 0, /**/ 125, 0.20, 0, /**/ 165, 0.10, 0], 
[1066,600, /**/0.69, /**/ 0.95, 4.0,/**/ 1.050, 1.300,/**/ 1.050, 1.075, /**/ 1.025, 1.050, /**/ 1.000, 1.025, /******/ 70, 0.75, 3, /**/ 120, 0.15, 1, /**/ 120, -0.00, 0, /**/ 125, -0.00, 0, /**/ 140, -0.00, 0], 
[1066,600, /**/0.69, /**/ 0.95, 4.0,/**/ 1.050, 1.300,/**/ 1.050, 1.075, /**/ 1.025, 1.050, /**/ 1.000, 1.025, /******/ 70, 0.75, 3, /**/ 120, 0.15, 1, /**/ 120, -0.00, 0, /**/ 125, -0.00, 0, /**/ 140, -0.00, 0], 
[600,600, /**/0.69, /**/ 0.95, 4.0,/**/ 1.050, 1.300,/**/ 1.050, 1.075, /**/ 1.025, 1.050, /**/ 1.000, 1.025, /******/ 70, 0.75, 3, /**/ 120, 0.15, 1, /**/ 120, -0.00, 0, /**/ 125, -0.00, 0, /**/ 140, -0.00, 0], 
[600,900, /**/0.69, /**/ 0.95, 4.0,/**/ 1.050, 1.300,/**/ 1.050, 1.075, /**/ 1.025, 1.050, /**/ 1.000, 1.025, /******/ 70, 0.75, 3, /**/ 120, 0.15, 1, /**/ 120, -0.00, 0, /**/ 125, -0.00, 0, /**/ 140, -0.00, 0], 
];
let array_svjetlo = [
[/*global*/ 0.1, 0.9, -0.1, -0.1, 0.1, 0.2, 1.0, 50, /*mjesec*/ 0.25, 0.45, 1.0, 1.0, 0.00, 0.00, 1.7, 20, /*sunce*/ 0.55, 0.75, 1.0, 1.0, 0.00, 0.00, 1.8, 20],  
[/*global*/ 0.1, 0.9, -0.1, -0.2, 0.1, 0.2, 1.0, 20, /*mjesec*/ 0.25, 0.45, 1.0, 1.0, 0.00, 0.00, 1.6, 20, /*sunce*/ 0.55, 0.75, 1.0, 1.0, 0.00, 0.00, 1.7, 20], 
[/*global*/ 0.1, 0.9, -0.1, -0.2, 0.0, 0.0, 1.0, 20, /*mjesec*/ 0.35, 0.45, 1.0, 1.0, 0.00, 0.00, 1.5, 20, /*sunce*/ 0.55, 0.65, 1.0, 1.0, 0.00, 0.00, 1.6, 20],  
[/*global*/ 0.1, 0.9, -0.1, -0.2, 0.0, 0.0, 1.0, 20, /*mjesec*/ 0.01, 0.01, 1.0, 1.0, 0.00, 0.00, 1.7, 25, /*sunce*/ 0.99, 0.99, 1.0, 1.0, 0.00, 0.00, 1.8, 25],  
[/*global*/ 0.1, 0.9, -0.1, -0.2, 0.00, 0.00, 1.0, 20, /*mjesec*/ 0.35, 0.45, 1.0, 1.0, 0.00, 0.00, 1.5, 20, /*sunce*/ 0.55, 0.65, 1.0, 1.0, 0.00, 0.00, 1.6, 20],  
[/*global*/ 0.1, 0.9, -0.1, -0.2, 0.00, 0.00, 1.0, 20, /*mjesec*/ 0.11, 0.25, 1.0, 1.0, 0.00, 0.00, 1.7, 20, /*sunce*/ 0.75, 0.99, 1.0, 1.0, 0.00, 0.00, 1.8, 20],  
[/*global*/ 0.2, 0.45, -0.1, -0.1, 0.00, 0.00, 1.0, 30, /*mjesec*/ 0.1, 0.35, 1.0, 1.0, 0.00, 0.00, 1.7, 30, /*sunce*/ 0.85, 0.99, 0.6, 1.0, 0.00, 0.00, 1.7, 20], 
[/*global*/ 0.1, 0.9, -0.1, -0.1, 0.1, 0.2, 1.0, 50, /*mjesec*/ 0.25, 0.45, 1.0, 1.0, 0.00, 0.00, 1.7, 20, /*sunce*/ 0.55, 0.75, 1.0, 1.0, 0.00, 0.00, 1.8, 20],  
[/*global*/ 0.1, 0.9, -0.1, -0.2, 0.1, 0.2, 1.0, 20, /*mjesec*/ 0.25, 0.45, 1.0, 1.0, 0.00, 0.00, 1.6, 20, /*sunce*/ 0.55, 0.75, 1.0, 1.0, 0.00, 0.00, 1.7, 20],  
[/*global*/ 0.1, 0.9, -0.1, -0.2, 0.0, 0.0, 1.0, 20, /*mjesec*/ 0.35, 0.45, 1.0, 1.0, 0.00, 0.00, 1.5, 20, /*sunce*/ 0.55, 0.65, 1.0, 1.0, 0.00, 0.00, 1.6, 20],  
[/*global*/ 0.1, 0.9, -0.1, -0.2, 0.0, 0.0, 1.0, 20, /*mjesec*/ 0.01, 0.01, 1.0, 1.0, 0.00, 0.00, 1.7, 25, /*sunce*/ 0.99, 0.99, 1.0, 1.0, 0.00, 0.00, 1.8, 25],  
[/*global*/ 0.1, 0.9, -0.1, -0.2, 0.00, 0.00, 1.0, 20, /*mjesec*/ 0.35, 0.45, 1.0, 1.0, 0.00, 0.00, 1.5, 20, /*sunce*/ 0.55, 0.65, 1.0, 1.0, 0.00, 0.00, 1.6, 20], 
[/*global*/ 0.1, 0.9, -0.1, -0.2, 0.00, 0.00, 1.0, 20, /*mjesec*/ 0.11, 0.25, 1.0, 1.0, 0.00, 0.00, 1.8, 20, /*sunce*/ 0.75, 0.99, 1.0, 1.0, 0.00, 0.00, 1.7, 20],  
[/*global*/ 0.2, 0.45, -0.1, -0.1, 0.00, 0.00, 1.0, 30, /*mjesec*/ 0.1, 0.35, 1.0, 1.0, 0.00, 0.00, 1.7, 30, /*sunce*/ 0.85, 0.99, 0.6, 1.0, 0.00, 0.00, 1.7, 20],  
[/*global*/ 0.1, 0.9, -0.1, -0.1, 0.1, 0.2, 1.0, 50, /*mjesec*/ 0.25, 0.45, 1.0, 1.0, 0.00, 0.00, 1.7, 20, /*sunce*/ 0.55, 0.75, 1.0, 1.0, 0.00, 0.00, 1.8, 20],  
[/*global*/ 0.1, 0.9, -0.1, -0.2, 0.1, 0.2, 1.0, 20, /*mjesec*/ 0.25, 0.45, 1.0, 1.0, 0.00, 0.00, 1.6, 20, /*sunce*/ 0.55, 0.75, 1.0, 1.0, 0.00, 0.00, 1.7, 20],  
[/*global*/ 0.1, 0.9, -0.1, -0.2, 0.0, 0.0, 1.0, 20, /*mjesec*/ 0.35, 0.45, 1.0, 1.0, 0.00, 0.00, 1.5, 20, /*sunce*/ 0.55, 0.65, 1.0, 1.0, 0.00, 0.00, 1.6, 20],  
[/*global*/ 0.1, 0.9, -0.1, -0.2, 0.0, 0.0, 1.0, 20, /*mjesec*/ 0.01, 0.01, 1.0, 1.0, 0.00, 0.00, 1.7, 25, /*sunce*/ 0.99, 0.99, 1.0, 1.0, 0.00, 0.00, 1.8, 25],  
[/*global*/ 0.1, 0.9, -0.1, -0.2, 0.00, 0.00, 1.0, 20, /*mjesec*/ 0.35, 0.45, 1.0, 1.0, 0.00, 0.00, 1.5, 20, /*sunce*/ 0.55, 0.65, 1.0, 1.0, 0.00, 0.00, 1.6, 20], 
[/*global*/ 0.1, 0.9, -0.1, -0.2, 0.00, 0.00, 1.0, 20, /*mjesec*/ 0.11, 0.25, 1.0, 1.0, 0.00, 0.00, 1.6, 20, /*sunce*/ 0.75, 0.99, 1.0, 1.0, 0.00, 0.00, 1.5, 20],  
[/*global*/ 0.2, 0.45, -0.1, -0.1, 0.00, 0.00, 1.0, 30, /*mjesec*/ 0.1, 0.35, 1.0, 1.0, 0.00, 0.00, 1.7, 30, /*sunce*/ 0.85, 0.99, 0.6, 1.0, 0.00, 0.00, 1.7, 20],  
[/*global*/ 0.1, 0.9, -0.1, -0.2, 0.1, 0.2, 1.0, 20, /*mjesec*/ 0.15, 0.45, 1.0, 1.0, 0.080, 0.090, 1.7, 20, /*sunce*/ 0.55, 0.85, 1.0, 1.0, 0.100, 0.115, 1.6, 20], 
[/*global*/ 0.1, 0.9, -0.1, -0.2, 0.1, 0.2, 1.0, 20, /*mjesec*/ 0.15, 0.45, 1.0, 1.0, 0.3, 0.4, 1.7, 20, /*sunce*/ 0.55, 0.85, 1.0, 1.0, 0.8, 0.8, 1.6, 20], 
];
let array_polumjesec = [
[/*xxx*/15, 30, 30, /***/ 0.0, 1.0, 80, 80, /***/ 0.0, 2.0, 10, 90, /***/ 0.0, 2.0, 10, 90, /*yyy*/ 250, /*tablete*/ 0, 30, 30], 
[/*xxx*/15, 35, 35, /***/ 0.0, 1.0, 80, 80, /***/ 0.0, 2.0, 10, 90, /***/ 0.0, 2.0, 10, 90, /*yyy*/ 250, /*tablete*/ 0, 30, 30], 
];
let array_sjaj = [
[0.05],
];
let array_kutevi = [
[0, 0, 0, 0, 0, 0], 
[0, 0, -0.02, 0.01, -1.5, 1.5], 
[10, -10, 0, 0, 0, 0], 
[0, 0, 0, 0, -3, 3], 
[0, 0, 0, 0, -5, 5], 
[10, -10, 0, 0, 0, 0], 
[5, -5, 0, 0, 0, 0], 
[3, -3, 0, 0, 0, 0], 
[5, -5, 0, 0, 0, 0], 
[10, -10, 0, 0, 0, 0],
[5, -5, 0, 0, 0, 0],
[3, -3, 0, 0, 0, 0], 
[1, -1, 0, 0, 0, 0], 
[10, -10, 0, 0, 0, 0],
[5, -5, 0, 0, 0, 0], 
[3, -3, 0, 0, 0, 0], 
[1, -1, 0, 0, 0, 0],  
[-1, 1, 0, 0, 0, 0], 
[-3, 3, 0, 0, 0, 0], 
[-5, 5, 0, 0, 0, 0], 
[-10, 10, 0, 0, 0, 0], 
[0, 0, 0, 0, -20, -5],
[0, 0, 0, 0, -30, 1],  
[0, 0, 0, 0, -45, -5],  
[0, 0, 0, 0, 0, 0], 
[0, 0, -0.02, 0.01, -1.5, 1.5],
[10, -10, 0, 0, 0, 0], 
[0, 0, 0, 0, -3, 3], 
[0, 0, 0, 0, -5, 5], 
[10, -10, 0, 0, 0, 0], 
[5, -5, 0, 0, 0, 0], 
[3, -3, 0, 0, 0, 0], 
[5, -5, 0, 0, 0, 0],  
[10, -10, 0, 0, 0, 0],  
[5, -5, 0, 0, 0, 0],  
[3, -3, 0, 0, 0, 0],  
[1, -1, 0, 0, 0, 0],   
[10, -10, 0, 0, 0, 0], 
[5, -5, 0, 0, 0, 0], 
[3, -3, 0, 0, 0, 0],  
[1, -1, 0, 0, 0, 0],   
[-1, 1, 0, 0, 0, 0], 
[-3, 3, 0, 0, 0, 0], 
[-5, 5, 0, 0, 0, 0], 
[-10, 10, 0, 0, 0, 0], 
[0, 0, 0, 0, -20, -5],
[0, 0, 0, 0, -30, 1],  
[0, 0, 0, 0, -45, -5],  
[0, 0, 0, 0, 0, 0], 
[0, 0, -0.02, 0.01, -1.5, 1.5], 
[10, -10, 0, 0, 0, 0],  
[0, 0, 0, 0, -3, 3], 
[0, 0, 0, 0, -5, 5],  
[10, -10, 0, 0, 0, 0],  
[5, -5, 0, 0, 0, 0], 
[3, -3, 0, 0, 0, 0], 
[5, -5, 0, 0, 0, 0], 
[10, -10, 0, 0, 0, 0],  
[5, -5, 0, 0, 0, 0], 
[3, -3, 0, 0, 0, 0],  
[1, -1, 0, 0, 0, 0],   
[10, -10, 0, 0, 0, 0], 
[5, -5, 0, 0, 0, 0], 
[3, -3, 0, 0, 0, 0], 
[1, -1, 0, 0, 0, 0],   
[-1, 1, 0, 0, 0, 0],  
[-3, 3, 0, 0, 0, 0],  
[-5, 5, 0, 0, 0, 0],  
[-10, 10, 0, 0, 0, 0],  
[0, 0, 0, 0, -20, -5],
[0, 0, 0, 0, -30, 1],  
[0, 0, 0, 0, -45, -5],  
];
let array_zima = [
[-0.2, 0.2, 1.8, 1.2, 10, 5, 5, 0, 1, /***/ 0.0, 0.4, 1.6, 1.0, 9, 5, 5, 0, 0, /***/ 0.0, 0.6, 1.4, 1.0, 8, 10, 12, 0, 1, /***/ 0.0, 0.8, 1.2, 1.0, 9, 25, 40, 0, 0, /***/ -0.0, 0.9, 1.1, 1.1, 6, 86, 126, 0, 0, /***/ 0, 0, 0, 0, 0, /***/ 0],
[-0.2, 0.2, 1.8, 1.2, 50, 11, 13, 0, 1, /***/ 0.0, 0.4, 1.6, 1.0, 40, 11, 13, 0, 0, /***/ 0.0, 0.6, 1.4, 1.0, 30, 10, 12, 0, 1, /***/ 0.0, 0.8, 1.2, 1.0, 20, 8, 10, 0, 0, /***/ -0.0, 0.9, 1.1, 1.1, 10, 6, 8, 0, 0, /***/ 1, 1, 1, 0, 0, /***/ 0],
[-0.2, 0.2, 1.8, 1.2, 20, 3, 5, 0, 1, /***/ 0.0, 0.4, 1.6, 1.0, 15, 5, 7, 0, 0, /***/ 0.0, 0.6, 1.4, 1.0, 12, 10, 12, 0, 1, /***/ 0.0, 0.8, 1.2, 1.0, 20, 8, 10, 0, 0, /***/ -0.0, 0.7, 1.3, 1.1, 6, 50, 60, 0, 0, /***/ 1, 0, 0, 0, 0, /***/ 0],
[-0.2, 0.2, 1.8, 1.2, 20, 14, 26, 0, 1, /***/ 0.0, 0.4, 1.6, 1.0, 15, 12, 24, 0, 0, /***/ 0.0, 0.6, 1.4, 1.0, 12, 10, 22, 0, 1, /***/ 0.0, 0.8, 1.2, 1.0, 9, 8, 20, 0, 0, /***/ -0.0, 0.9, 1.1, 1.1, 6, 6, 18, 0, 0, /***/ 1, 0, 0, 0, 0, /***/ 0],
[-0.2, 0.2, 1.8, 1.2, 50, 20, 25, 0, 1, /***/ 0.0, 0.4, 1.6, 1.0, 40, 20, 25, 0, 0, /***/ 0.0, 0.6, 1.4, 1.0, 30, 10, 25, 0, 1, /***/ 0.0, 0.8, 1.2, 1.0, 20, 8, 50, 0, 0, /***/ -0.0, 0.9, 1.1, 1.1, 10, 6, 58, 0, 0, /***/ 1, 1, 1, 0, 0, /***/ 0],
[-0.2, 0.2, 1.8, 1.2, 40, 14, 26, 0, 1, /***/ 0.1, 0.4, 1.6, 0.9, 30, 12, 24, 0, 0, /***/ 0.1, 0.6, 1.4, 0.8, 20, 10, 22, 0, 1, /***/ 0.2, 0.8, 1.2, 0.7, 10, 8, 20, 0, 0, /***/ 0.3, 0.9, 1.1, 0.6, 5, 6, 18, 0, 0, /***/ 1, 1, 1, 0, 0, /***/ 0],
[-0.2, 0.2, 1.8, 1.2, 50, 14, 26, 0, 1, /***/ 0.0, 0.3, 1.7, 1.0, 40, 12, 24, 0, 0, /***/ 0.0, 0.35, 1.65, 1.0, 30, 10, 22, 0, 1, /***/ 0.0, 0.4, 1.6, 1.0, 20, 8, 20, 0, 0, /***/ -0.0, 0.5, 1.5, 1.1, 10, 6, 18, 0, 0, /***/ 1, 1, 1, 1, 1, /***/ 0],
[-0.2, 0.2, 1.8, 1.2, 20, 5, 10, 0, 1, /***/ 0.0, 0.3, 1.7, 1.0, 15, 5, 10, 0, 0, /***/ 0.0, 0.40, 1.60, 1.0, 17, 5, 10, 0, 0, /***/ 0.0, 1.0, 1.0, 1.0, 13, 5, 10, 0, 0, /***/ -0.0, 1.0, 1.0, 1.1, 8, 3, 8, 0, 0, /***/ 1, 1, 1, 1, 1, /***/ 0],
];
let array_kairo = [
[-0.2, 1, 1, 1.3, 25, 10, 10, 0.4, 1, /***/ -0.1, 1, 1, 1.2, 20, 17, 17, 0.5, 0, /***/ -0.1, 1, 1, 1.2, 15, 28, 28, 0.6, 0, /***/ -0.1, 1, 1, 1.2, 10, 50, 50, 0.7, 0, /***/ 1, 0, 0, 0, /***/ 1],
[-0.2, 1, 1, 1.3, 25, 10, 10, -0.4, 1, /***/ -0.1, 1, 1, 1.2, 20, 17, 17, -0.5, 0, /***/ -0.1, 1, 1, 1.2, 15, 26, 26, -0.6, 0, /***/ -0.1, 1, 1, 1.2, 10, 40, 40, -0.7, 0, /***/ 1, 0, 0, 0, /***/ 1],
[-0.2, 1, 1, 1.3, 25, 6, 6, -0.4, 1, /***/ -0.1, 1, 1, 1.2, 20, 11, 11, -0.5, 0, /***/ -0.1, 1, 1, 1.2, 15, 17, 17, -0.6, 0, /***/ -0.1, 1, 1, 1.2, 10, 28, 28, -0.7, 0, /***/ 1, 0, 0, 0, /***/ 1],
[-0.2, 1, 1, 1.3, 25, 6, 6, -0.4, 1, /***/ -0.1, 1, 1, 1.2, 20, 11, 11, -0.5, 0, /***/ -0.1, 1, 1, 1.2, 15, 17, 17, -0.6, 0, /***/ -0.1, 1, 1, 1.2, 10, 58, 58, 0.4, 0, /***/ 1, 0, 0, 0, /***/ 1],
[-0.2, 1, 1, 1.3, 25, 6, 6, -0.4, 1, /***/ -0.1, 1, 1, 1.2, 20, 11, 11, -0.5, 0, /***/ -0.1, 1, 1, 1.2, 15, 17, 17, -0.6, 0, /***/ -0.1, 1, 1, 1.2, 40, 16, 16, 0.4, 0, /***/ 1, 0, 0, 0, /***/ 1],
[-0.2, 1, 1, 1.3, 25, 6, 6, -0.4, 1, /***/ -0.1, 1, 1, 1.2, 20, 11, 11, -0.5, 0, /***/ -0.1, 1, 1, 1.2, 15, 17, 17, -0.6, 0, /***/ -0.1, 1, 1, 1.2, 70, 7, 7, 0.4, 0, /***/ 1, 0, 0, 0, /***/ 1],
[-0.2, 1, 1, 1.3, 50, 5, 5, 0.4, 1, /***/ -0.1, 1, 1, 1.2, 40, 8, 8, 0.5, 0, /***/ -0.1, 1, 1, 1.2, 30, 13, 13, 0.6, 0, /***/ -0.1, 1, 1, 1.2, 20, 24, 24, 0.7, 0, /***/ 1, 0, 0, 0, /***/ 1],
[-0.2, 1, 1, 1.3, 40, 6, 6, 0.4, 1, /***/ -0.1, 1, 1, 1.2, 25, 15, 15, 0.5, 0, /***/ -0.1, 1, 1, 1.2, 20, 23, 23, 0.6, 0, /***/ -0.1, 1, 1, 1.2, 12, 44, 44, 0.7, 0, /***/ 1, 0, 0, 0, /***/ 1],
[-0.2, 1, 1, 1.3, 40, 4, 4, 0.4, 1, /***/ -0.1, 1, 1, 1.2, 25, 10, 10, 0.5, 0, /***/ -0.1, 1, 1, 1.2, 20, 15, 15, 0.6, 0, /***/ -0.1, 1, 1, 1.2, 12, 30, 30, 0.7, 0, /***/ 1, 0, 0, 0, /***/ 1],
[-0.2, 0.9, 1.1, 1.3, 40, 4, 4, 0.4, 1, /***/ -0.1, 0.8, 1.2, 1.2, 25, 10, 10, 0.5, 0, /***/ -0.1, 0.7, 1.3, 1.2, 20, 15, 15, 0.6, 0, /***/ -0.1, 0.6, 1.4, 1.2, 12, 30, 30, 0.7, 0, /***/ 1, 0, 0, 0, /***/ 1],
[-0.2, 0.4, 1.6, 1.3, 40, 4, 4, 0.4, 1, /***/ -0.1, 0.5, 1.5, 1.2, 25, 10, 10, 0.5, 0, /***/ -0.1, 0.6, 1.4, 1.2, 20, 15, 15, 0.6, 0, /***/ -0.1, 0.7, 1.3, 1.2, 12, 30, 30, 0.7, 0, /***/ 1, 0, 0, 0, /***/ 1],
[-0.2, 1, 1, 1.3, 40, 4, 4, 0.4, 1, /***/ -0.1, 1, 1, 1.2, 25, 10, 10, 0.5, 0, /***/ -0.1, 1, 1, 1.2, 20, 15, 15, 0.6, 0, /***/ -0.1, 1, 1, 1.2, 60, 10, 10, 0.7, 0, /***/ 1, 0, 0, 1, /***/ 1],
[-0.2, 1, 1, 1.3, 40, 4, 4, 0.4, 1, /***/ -0.1, 1, 1, 1.2, 25, 10, 10, 0.5, 0, /***/ -0.1, 1, 1, 1.2, 20, 15, 15, 0.6, 0, /***/ -0.1, 1, 1, 1.2, 230, 2, 2, 0.7, 1, /***/ 1, 0, 0, 0, /***/ 1],
[-0.2, 1, 1, 1.3, 40, 4, 4, 0.4, 1, /***/ -0.1, 1, 1, 1.2, 25, 10, 10, 0.5, 0, /***/ -0.1, 1, 1, 1.2, 20, 15, 15, 0.6, 0, /***/ -0.1, 1, 1, 1.2, 200, 2, 2, 0.7, 1, /***/ 1, 0, 0, 0, /***/ 1],
];
let array_ljeto = [
[-0.2, 1, 1, 1.3, 20, 3, 3, 0.4, -0.2, 1, /***/ -0.1, 1, 1, 1.2, 15, 4, 4, 0.8, -0.2, 0, /***/ -0.1, 1, 1, 1.2, 50, 6, 6, 1.3, -0.3, 0, /***/ 1, 1, 1, /***/ 0.55, 0.70, 0.85, /***/ 0.015, 0.030, 0.035, /***/ 0.025, 0.030, 0.030],
[-0.2, 1, 1, 1.3, 10, 2, 5, 0.4, -0.2, 1, /***/ -0.1, 1, 1, 1.2, 7, 5, 8, 0.8, -0.2, 0, /***/ 0.45, 1, 1, 0.55, 20, 1, 1, 1.3, -0.3, 0, /***/ 1, 1, 1, /***/ 0.55, 0.70, 0.85, /***/ 0.015, 0.028, 0.035, /***/ 0.025, 0.028, 0.032],
[-0.2, 1, 1, 1.3, 20, 2, 8, 0.4, -0.2, 1, /***/ -0.1, 1, 1, 1.2, 15, 2, 6, 0.8, -0.2, 0, /***/ -0.1, 1, 1, 1.2, 10, 7, 23, 1.3, -0.3, 0, /***/ 1, 1, 1,  /***/ 0.45, 0.60, 0.85, /***/ 0.010, 0.025, 0.035, /***/ 0.025, 0.030, 0.030],
[-0.2, 1, 1, 1.3, 20, 4, 4, 0.4, -0.2, 1, /***/ -0.1, 1, 1, 1.2, 15, 6, 6, 0.8, -0.2, 0, /***/ -0.1, 1, 1, 1.2, 40, 3, 3, -1.3, 0.3, 0, /***/ 1, 1, 1, /***/ 0.55, 0.70, 0.85, /***/ 0.025, 0.030, 0.035, /***/ 0.045, 0.030, 0.030],
[0.45, 1, 1, 0.55, 20, 1, 1, 0.4, -0.2, 1, /***/ 0.45, 1, 1, 0.55, 15, 1, 1, 0.8, -0.2, 0, /***/ -0.1, 1, 1, 1.2, 80, 3, 3, -1.3, 0.3, 0, /***/ 1, 1, 1, /***/ 0.85, 0.70, 0.85, /***/ 0.025, 0.030, 0.035, /***/ 0.045, 0.030, 0.030],
[-0.2, 1, 1, 1.3, 14, 4, 9, -0.4, 0.2, 1, /***/ -0.1, 1, 1, 1.2, 8, 4, 12, -0.8, 0.3, 0, /***/ -0.1, 1, 1, 1.2, 50, 5, 7, -0.8, 0.5, 0, /***/ 1, 1, 1, /***/ 0.70, 0.90, 0.98, /***/ 0.045, 0.050, 0.060, /***/ 0.050, 0.050, 0.050],
[-0.2, 1, 1, 1.3, 20, 2, 4, 0, 0, 1, /***/ -0.1, 1, 1, 1.2, 15, 2, 4, 0.2, -0.1, 0, /***/ -0.1, 1, 1, 1.2, 10, 2, 4, 0.3, -0.1, 0, /***/ 1, 1, 1, /***/ 0.60, 0.75, 0.90, /***/ 0.020, 0.030, 0.035, /***/ 0.050, 0.030, 0.030],
];
let array_funkcije = [
[zima_1, zima_2, zima_3, zima_4, zima_5],
[proljece_1, proljece_2, proljece_3, proljece_4, proljece_5],
[proljece_1, proljece_2, proljece_3, proljece_4, proljece_5],
[ljeto_1, ljeto_2, ljeto_3, ljeto_4, ljeto_5],
];
let loading_brojac = 0;
function setup() {
	noiseSeed(seed);
	randomSeed(seed);	
	random_horizont = random(array_horizont);	
	format_w =  random_horizont[0];
	format_h =  random_horizont[1];	
	koboljkaWidth = format_w;
	koboljkaHeight = format_h;		
	colorMode(HSB, 360, 100, 100, 100)	
	initPerspektive();
	initPalettes();
	array_brojevi();
	array_glave();
}
function draw() {
	if (loading_brojac == 0) {
		createCanvas(windowWidth, windowHeight);
		background(0);
		stroke(0)
		strokeWeight(0)
		angleMode(DEGREES)  
		palette = random(palettes)
		boja_mjesec = palette [3]
		boja_global = palette [4]
		aaa = random(-0.8, 0.8)
		bbb = random(20, 50)
		vinjeta_velicina = width*1;
		od_transparencije = 20;
		for (var i = 0; i < vinjeta_velicina; i++) {
		noFill()
		  stroke(hue(boja_global), saturation(boja_global), brightness(boja_global), od_transparencije-i/(vinjeta_velicina/od_transparencije));          
			strokeWeight(1);
			ellipse(width / 2, height / 2, 100+i)   
		  }   		
		  for (var i=0; i < 2500; i++) {    
			push();
			noStroke()
			 fill(boja_mjesec); 
			circle(random (0,width), random (0,height), random (width/2000, width/600));  
		   pop(); 
		  }
		  for (var i=0; i < 100; i++) {    
		  push();
			noStroke()
			fill(boja_mjesec); 
			circle(random (0,width), random (0,height), random (width/600, width/200));  
		  pop(); 
		  }    		
		fill(boja_global)
		ellipse(width / 2, height / 2, 100);
		fill(0,20)
		loader(width / 2, height / 2, 100, aaa); 
		textAlign(CENTER, CENTER);
		fill('#fff')
		textSize(11);
		text('L O A D I N G', width / 2, height / 2);
	} else {
		let scaleFactor = min(windowWidth / koboljkaWidth, windowHeight / koboljkaHeight);
		let w = int(koboljkaWidth * scaleFactor);
		let h = int(koboljkaHeight * scaleFactor);
		resizeCanvas(w, h);
		console.log('' + w + 'x' + h);
		let img = makeImage(w, h);
		image(img, 0, 0);
		fxpreview();
		noLoop();
	}
	loading_brojac++;
}
function fxrandRange(a, b) {
	return a + fxrand() * (b - a);
}
function windowResized() {
	loading_brojac = 0;
	loop();
}
function keyPressed() {
  if (key == '4' || key == '4') {
	let img = makeImage(koboljkaWidth * 10, koboljkaHeight * 10);
	img.save('Koboljka (' + fxhash + ').png');
  }
  if (key == '3' || key == '3') {
	let img = makeImage(koboljkaWidth * 8, koboljkaHeight * 8);
	img.save('Koboljka (' + fxhash + ').png');
  }  
  if (key == '2' || key == '2') {
	let img = makeImage(koboljkaWidth * 6, koboljkaHeight * 6);
	img.save('Koboljka (' + fxhash + ').png');
  }
  if (key == '1' || key == '1') {
	let img = makeImage(koboljkaWidth * 4, koboljkaHeight * 4);
	img.save('Koboljka (' + fxhash + ').png');
  }  
  
}
function makeImage(w, h) {
	phase = 0;
	zoff = 0;
	yoff = 0;
	xoff = 0;
	let minSize = min(koboljkaWidth, koboljkaHeight);
	let img = createGraphics(w, h);
	noiseSeed(seed);
	randomSeed(seed);
	//noiseSeed(1);
	//randomSeed(1);	
	img.colorMode(HSB, 360, 100, 100, 100)
	img.angleMode(DEGREES)  
	var scaleFactor = min(w / koboljkaWidth, h / koboljkaHeight);
	img.scale(scaleFactor);
	random_funkcije = random(array_funkcije);
	random_polumjesec = random(array_polumjesec);	
	random_svjetlo = random(array_svjetlo);
	random_sjaj = random(array_sjaj);
	random_glava = random(array_glava) 
	random_glava_debeljuca = random(array_glava)
	random_zima = random(array_zima) 	
	random_kairo = random(array_kairo) 	
	random_ljeto = random(array_ljeto) 
	z_let = random_zima[50];	
	k_let = random_kairo[40];	
	lj_let = random_ljeto[34];
		random_kutevi = random(array_kutevi);
		objektiv_od =  random_kutevi[0];
		objektiv_do =  random_kutevi[1];
		translate_x =  random_kutevi[2];
		translate_y =  random_kutevi[3];
		rotiranje_od =  random_kutevi[4];
		rotiranje_do =  random_kutevi[5];	
		
	palette = random(palettes)		
	centar = random([0.3, 0.35, 0.4, 0.45, 0.48, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.52, 0.55, 0.6, 0.65, 0.7])
	povirivanje = random([2, 3]);  
	prikaz_prozora = random([0, 1, 1, 1, 1, 2, 3, 4, 1, 2, 3, 4, 5, 6, 7, 7, 7]); 
	oblik_svjetla = random([1, 2, 3, 4]);  
	kaciga = random([1, 1, 1, 1, 1, 1, 2, 2, 2, 3]);  
	format_w =  random_horizont[0];
	format_h =  random_horizont[1];
	horiz =  random_horizont[2];
	p_1_od = random_horizont[3];
	p_1_do = random_horizont[4];
	p_2_od = random_horizont[5];
	p_2_do = random_horizont[6];
	p_3_od = random_horizont[7];
	p_3_do = random_horizont[8];
	p_4_od = random_horizont[9];
	p_4_do = random_horizont[10];
	p_5_od = random_horizont[11];	
	p_5_do = random_horizont[12];	
	publika_1_velicina = random_horizont[13];
	publika_1_nagib = random_horizont[14];
	publika_1_povecanje = random_horizont[15];
	publika_2_velicina = random_horizont[16];
	publika_2_nagib = random_horizont[17];
	publika_2_povecanje = random_horizont[18];
	publika_3_velicina = random_horizont[19];
	publika_3_nagib = random_horizont[20];
	publika_3_povecanje = random_horizont[21];
	publika_4_velicina = random_horizont[22];
	publika_4_nagib = random_horizont[23];
	publika_4_povecanje = random_horizont[24];
	publika_5_velicina = random_horizont[25];
	publika_5_nagib = random_horizont[26];
	publika_5_povecanje = random_horizont[27]; 
	horizont = koboljkaHeight*horiz * random(0.90, 1.10); 
	publika_1_od = horizont * p_1_od;
	publika_1_do = koboljkaHeight*1.2;
	publika_2_od = horizont * p_2_od;
	publika_2_do = horizont * p_2_do;
	publika_3_od = horizont * p_3_od;
	publika_3_do = horizont * p_3_do;
	publika_4_od = horizont * p_4_od;
	publika_4_do = horizont * p_4_do;
	publika_5_od = horizont * p_5_od;
	publika_5_do = horizont * p_5_do;	
	global_x = random(koboljkaWidth * random_svjetlo[0], koboljkaWidth * random_svjetlo[1]);
	global_y = random(koboljkaHeight * random_svjetlo[2], koboljkaHeight * random_svjetlo[3]);
	global_velicina = random(minSize * random_svjetlo[4], minSize * random_svjetlo[5]);   
	mjesec_x = random(koboljkaWidth * random_svjetlo[8], koboljkaWidth * random_svjetlo[9]); 
	mjesec_y = random(horizont * random_svjetlo[10], horizont * random_svjetlo[11]);
	mjesec_velicina = random(minSize * random_svjetlo[12], minSize * random_svjetlo[13]);     
	sunce_x = random(koboljkaWidth * random_svjetlo[16], koboljkaWidth * random_svjetlo[17]);
	sunce_y = random(horizont * random_svjetlo[18], horizont * random_svjetlo[19]);
	sunce_velicina = random(koboljkaWidth * random_svjetlo[20], koboljkaWidth * random_svjetlo[21]);  
	pozadina = palette [0]
	boja_robot = palette [1]
	boja_sunce = palette [2]
	boja_mjesec = palette [3]
	boja_global = palette [4]
	boja_oko = palette [5]
	boja_zjenica = palette [6]
	z1_x1 =  random_zima[0];
	z1_x2 =  random_zima[1];
	z1_x3 =  random_zima[2];
	z1_x4 =  random_zima[3];
	z1_radius =  random_zima[4];
	z1_visina_od = random_zima[5];
	z1_visina_do = random_zima[6];	
	z1_vinjeta = random_zima[7];
	z1_neon = random_zima[8];	
	z2_x1 =  random_zima[9];
	z2_x2 =  random_zima[10];
	z2_x3 =  random_zima[11];
	z2_x4 =  random_zima[12];
	z2_radius =  random_zima[13];
	z2_visina_od = random_zima[14];
	z2_visina_do = random_zima[15];	
	z2_vinjeta = random_zima[16];
	z2_neon = random_zima[17];	
	z3_x1 =  random_zima[18];
	z3_x2 =  random_zima[19];
	z3_x3 =  random_zima[20];
	z3_x4 =  random_zima[21];
	z3_radius =  random_zima[22];
	z3_visina_od = random_zima[23];
	z3_visina_do = random_zima[24];	
	z3_vinjeta = random_zima[25];
	z3_neon = random_zima[26];	
	z4_x1 =  random_zima[27];
	z4_x2 =  random_zima[28];
	z4_x3 =  random_zima[29];
	z4_x4 =  random_zima[30];
	z4_radius =  random_zima[31];
	z4_visina_od = random_zima[32];
	z4_visina_do = random_zima[33];	
	z4_vinjeta = random_zima[34];
	z4_neon = random_zima[35];		
	z5_x1 =  random_zima[36];
	z5_x2 =  random_zima[37];
	z5_x3 =  random_zima[38];
	z5_x4 =  random_zima[39];
	z5_radius =  random_zima[40];
	z5_visina_od = random_zima[41];
	z5_visina_do = random_zima[42];	
	z5_vinjeta = random_zima[43];
	z5_neon = random_zima[44];		
	z1_prozor = random_zima[45];
	z2_prozor = random_zima[46];
	z3_prozor = random_zima[47];
	z4_prozor = random_zima[48];
	z5_prozor = random_zima[49];	
	k1_x1 =  random_kairo[0];
	k1_x2 =  random_kairo[1];
	k1_x3 =  random_kairo[2];
	k1_x4 =  random_kairo[3];
	k1_radius =  random_kairo[4];
	k1_visina_od = random_kairo[5];
	k1_visina_do = random_kairo[6];	
	k1_nagib = random_kairo[7];
	k1_neon = random_kairo[8];	
	k2_x1 =  random_kairo[9];
	k2_x2 =  random_kairo[10];
	k2_x3 =  random_kairo[11];
	k2_x4 =  random_kairo[12];
	k2_radius =  random_kairo[13];
	k2_visina_od = random_kairo[14];
	k2_visina_do = random_kairo[15];	
	k2_nagib = random_kairo[16];
	k2_neon = random_kairo[17];	
	k3_x1 =  random_kairo[18];
	k3_x2 =  random_kairo[19];
	k3_x3 =  random_kairo[20];
	k3_x4 =  random_kairo[21];
	k3_radius =  random_kairo[22];
	k3_visina_od = random_kairo[23];
	k3_visina_do = random_kairo[24];	
	k3_nagib = random_kairo[25];
	k3_neon = random_kairo[26];	
	k4_x1 =  random_kairo[27];
	k4_x2 =  random_kairo[28];
	k4_x3 =  random_kairo[29];
	k4_x4 =  random_kairo[30];
	k4_radius =  random_kairo[31];
	k4_visina_od = random_kairo[32];
	k4_visina_do = random_kairo[33];	
	k4_nagib = random_kairo[34];
	k4_neon = random_kairo[35];		
	k1_prozor = random_kairo[36];
	k2_prozor = random_kairo[37];
	k3_prozor = random_kairo[38];
	k4_prozor = random_kairo[39];	
	lj1_x1 =  random_ljeto[0];
	lj1_x2 =  random_ljeto[1];
	lj1_x3 =  random_ljeto[2];
	lj1_x4 =  random_ljeto[3];
	lj1_radius =  random_ljeto[4];
	lj1_visina_od = random_ljeto[5];
	lj1_visina_do = random_ljeto[6];	
	lj1_nagib = random_ljeto[7];
	lj1_nagib_brdo = random_ljeto[8];	
	lj1_neon = random_ljeto[9];	
	lj2_x1 =  random_ljeto[10];
	lj2_x2 =  random_ljeto[11];
	lj2_x3 =  random_ljeto[12];
	lj2_x4 =  random_ljeto[13];
	lj2_radius =  random_ljeto[14];
	lj2_visina_od = random_ljeto[15];
	lj2_visina_do = random_ljeto[16];	
	lj2_nagib = random_ljeto[17];
	lj2_nagib_brdo = random_ljeto[18];		
	lj2_neon = random_ljeto[19];	
	lj3_x1 =  random_ljeto[20];
	lj3_x2 =  random_ljeto[21];
	lj3_x3 =  random_ljeto[22];
	lj3_x4 =  random_ljeto[23];
	lj3_radius =  random_ljeto[24];
	lj3_visina_od = random_ljeto[25];
	lj3_visina_do = random_ljeto[26];	
	lj3_nagib = random_ljeto[27];
	lj3_nagib_brdo = random_ljeto[28];		
	lj3_neon = random_ljeto[29];	
	lj1_prozor = random_ljeto[30];
	lj2_prozor = random_ljeto[31];
	lj3_prozor = random_ljeto[32];
	b_3_visina = random_ljeto[33];
	b_2_visina = random_ljeto[34];
	b_1_visina = random_ljeto[35];
	b_3_gustoca = random_ljeto[36];
	b_2_gustoca = random_ljeto[37];
	b_1_gustoca = random_ljeto[38];
	b_3_greben = random_ljeto[39];
	b_2_greben = random_ljeto[40];
	b_1_greben = random_ljeto[41];
	img.background(pozadina);
	funkcija_zvijezde(img);
	global(img)	
	brdo(img, horizont*0.9, horizont*-0.05, koboljkaWidth*0.01, koboljkaWidth*0.02)
	random_funkcije[4](img)
	asset_publika(img, publika_5_od, publika_5_do, minSize/publika_5_velicina, publika_5_nagib, publika_5_povecanje)
	random_funkcije[3](img)
	asset_publika(img, publika_4_od, publika_4_do, minSize/publika_4_velicina, publika_4_nagib, publika_4_povecanje)
	random_funkcije[2](img)	
	mjesec(img)	
	asset_publika(img, publika_3_od, publika_3_do, minSize/publika_3_velicina, publika_3_nagib, publika_3_povecanje)
	sunce(img)	
	random_funkcije[1](img)	
	asset_publika(img, publika_2_od, publika_2_do, minSize/publika_2_velicina, publika_2_nagib, publika_2_povecanje)
	random_funkcije[0](img)
	asset_publika(img, publika_1_od, publika_1_do, minSize/publika_1_velicina, publika_1_nagib, publika_1_povecanje)
	funkcija_okvir(img);		

	return img;
}
function prazno(img) {
}  
function drobina(img) {
	likovi = random([1, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8]);
	if (likovi == 1) {   
		debeljuca(img, koboljkaWidth*centar, publika_3_od, koboljkaWidth*random(0.16, 0.18))
	} 
	if (likovi == 2) {   
		kiklop(img, xxx, koboljkaWidth*centar, publika_3_od + koboljkaWidth*0.03, koboljkaHeight*random(0.17, 0.19))
	} 	
	if (likovi == 3) {   
		zmija(img, koboljkaWidth*centar, horizont)
	} 		
	if (likovi == 4) {   
		zapovjedi(img, koboljkaWidth*centar, publika_3_od, koboljkaWidth*random(0.09, 0.10))
	}   
	if (likovi == 5) {   
		bijela_kuca(img, koboljkaWidth * centar, publika_3_od, koboljkaWidth*random(0.1,0.25))	
	}   
	if (likovi == 6) {   
		majmun(img, koboljkaWidth*centar, publika_3_od, koboljkaWidth*0.10, koboljkaWidth*0.10)	
	}  
	if (likovi == 7) {   
		pratar(img, koboljkaWidth*centar, publika_3_od, koboljkaWidth*random(0.10, 0.15))	
	}  
	if (likovi == 8) {   
		sir = random(40, 80);
		vis = koboljkaHeight*random(0.5, 0.8);
		komada = random([1, 2, 3]); 
		for (var k = 0; k < komada; k++) {
			zgrada_1_red(img, (koboljkaWidth*centar - (komada*sir/2 - sir/2))+ sir*k, publika_3_od, sir, vis, 1, 1)
			tableta(img, (koboljkaWidth*centar - (komada*sir/2 - sir/2))+ sir*k, publika_3_od, sir/4*2, sir/2)
			tableta_vrata(img, (koboljkaWidth*centar - (komada*sir/2 - sir/2))+ sir*k, publika_3_od, sir/4, sir/2)
		}  		
	}  
}  
function zima_5(img) {
	random_kutevi = array_kutevi[random([0, 1, 2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])];
		objektiv_od =  random_kutevi[0];
		objektiv_do =  random_kutevi[1];
		translate_x =  random_kutevi[2];
		translate_y =  random_kutevi[3];
		rotiranje_od =  random_kutevi[4];
		rotiranje_do =  random_kutevi[5];
	asset_publika_zgrade(img, publika_5_od, publika_5_do, z5_x1, centar*z5_x2, centar*z5_x3, z5_x4, z5_radius, z5_visina_od, z5_visina_do, publika_5_nagib, z5_vinjeta, z5_neon, z5_prozor)		
}  
function zima_4(img) {
	asset_publika_zgrade(img, publika_4_od, publika_4_do, z4_x1, centar*z4_x2, centar*z4_x3, z4_x4, z4_radius, z4_visina_od, z4_visina_do, publika_4_nagib, z4_vinjeta, z4_neon, z4_prozor)		
	mjesec_popuna(img)
} 
function zima_3(img) {
	asset_publika_zgrade(img, publika_3_od, publika_3_do, z3_x1, centar*z3_x2, centar*z3_x3, z3_x4, z3_radius, z3_visina_od, z3_visina_do, publika_5_nagib, z3_vinjeta, z3_neon, z3_prozor)		
	for (var i = 0; i < 6; i++) {
		prikazi_ledja = 0; 
		robot(img, random(koboljkaWidth*0.25, koboljkaWidth*0.75), random(horizont*0.01, horizont*0.8), random(koboljkaWidth*0.02, horizont*0.04))		
	}  	
	drobina(img)
	sunce_popuna(img)
} 
function zima_2(img) {
	asset_publika_zgrade(img, publika_2_od, publika_2_do, z2_x1, centar*z2_x2, centar*z2_x3, z2_x4, z2_radius, z2_visina_od, z2_visina_do, publika_5_nagib, z2_vinjeta, z2_neon, z2_prozor);
	broj_robota = 3
	for (var i = 0; i < broj_robota; i++) {
		velicina_robota = map(i, 0, broj_robota, koboljkaWidth*0.02, horizont*0.1)
		prikazi_ledja = 1; 
		robot(img, random(koboljkaWidth*0.10, koboljkaWidth*centar*0.9), random(horizont*0.01, horizont*0.8), velicina_robota)		
		robot(img, random(koboljkaWidth*centar*1.1, koboljkaWidth*0.90, ), random(horizont*0.01, horizont*0.8), velicina_robota)		  
	}  			
} 
function zima_1(img) {
	asset_publika_zgrade(img, publika_1_od, publika_1_do, z1_x1, centar*z1_x2, centar*z1_x3, z1_x4, z1_radius, z1_visina_od, z1_visina_do, publika_1_nagib, z1_vinjeta, z1_neon, z1_prozor)		
} 
function proljece_5(img) {
	asset_publika_zgrade(img, publika_5_od, publika_5_do, k4_x1, centar*k4_x2, centar*k4_x3, k4_x4, /***/ k4_radius, k4_visina_od, k4_visina_do, publika_5_nagib + k4_nagib, 0, k4_neon, k4_prozor)
	asset_publika_zgrade(img, publika_5_od, publika_5_do, k3_x1, centar*k3_x2, centar*k3_x3, k3_x4, /***/ k3_radius, k3_visina_od, k3_visina_do, publika_5_nagib + k3_nagib, 0, k3_neon, k3_prozor)	
	mjesec_popuna(img)	
	sunce_popuna(img)	
	asset_publika_zgrade(img, publika_5_od, publika_5_do, k2_x1, centar*k2_x2, centar*k2_x3, k2_x4, /***/ k2_radius, k2_visina_od, k2_visina_do, publika_5_nagib + k2_nagib, 0, k2_neon, k2_prozor)
	mjesec_popuna(img)	
	sunce_popuna(img)	
	asset_publika_zgrade(img, publika_5_od, publika_5_do, k1_x1, centar*k1_x2, centar*k1_x3, k1_x4, /***/ k1_radius, k1_visina_od, k1_visina_do, publika_5_nagib + k1_nagib, 0, k1_neon, k1_prozor)
} 
function proljece_4(img) {
} 
function proljece_3(img) {	
	for (var i = 0; i < 8; i++) {		
		prikazi_ledja = 0; 
		robot(img, random(koboljkaWidth*0.15, koboljkaWidth*0.85), random(horizont*0.03, horizont*0.9), random(koboljkaWidth*0.015, koboljkaWidth*0.025))		
	}  	
	drobina(img)
} 
function proljece_2(img) {
	broj_robota = 3
	for (var i = 0; i < broj_robota; i++) {
		velicina_robota = map(i, 0, broj_robota, koboljkaWidth*0.02, horizont*0.1)
		prikazi_ledja = 1; 
		robot(img, random(koboljkaWidth*0.10, koboljkaWidth*centar*0.9), random(horizont*0.01, horizont*0.8), velicina_robota)		
		robot(img, random(koboljkaWidth*centar*1.1, koboljkaWidth*0.90, ), random(horizont*0.01, horizont*0.8), velicina_robota)		  
	}  			
}
function proljece_1(img) {
} 
function ljeto_5(img) {
	random_kutevi = array_kutevi[random([0, 0])];
		objektiv_od =  random_kutevi[0];
		objektiv_do =  random_kutevi[1];
		translate_x =  random_kutevi[2];
		translate_y =  random_kutevi[3];
		rotiranje_od =  random_kutevi[4];
		rotiranje_do =  random_kutevi[5];

	brdo_3_visina = horizont * b_3_visina
	asset_publika_zgrade(img, brdo_3_visina + lj3_radius*2, brdo_3_visina*1.001 + lj3_radius*2, lj3_x1, centar*lj3_x2, centar*lj3_x3, lj3_x4, /***/ lj3_radius, lj3_visina_od, lj3_visina_do, lj3_nagib, 0, lj3_neon, lj3_prozor)
	brdo(img, brdo_3_visina, lj3_nagib_brdo * brdo_3_visina, koboljkaWidth*b_3_gustoca, koboljkaWidth*b_3_greben)
	mjesec_popuna(img)	
	sunce_popuna(img)	
	brdo_2_visina = horizont * b_2_visina
	asset_publika_zgrade(img, brdo_2_visina + lj2_radius*2, brdo_2_visina*1.001  + lj2_radius*2, lj2_x1, centar*lj2_x2, centar*lj2_x3, lj2_x4, /***/ lj2_radius, lj2_visina_od, lj2_visina_do, lj2_nagib, 0, lj2_neon, lj2_prozor)
	brdo(img, brdo_2_visina, lj2_nagib_brdo * brdo_2_visina, koboljkaWidth*b_2_gustoca, koboljkaWidth*b_2_greben)
	mjesec_popuna(img)	
	sunce_popuna(img)
	brdo_1_visina = horizont * b_1_visina
	asset_publika_zgrade(img, brdo_1_visina + lj1_radius*2, brdo_1_visina*1.001  + lj1_radius*2, lj1_x1, centar*lj1_x2, centar*lj1_x3, lj1_x4, /***/ lj1_radius, lj1_visina_od, lj1_visina_do, lj1_nagib, 0, lj1_neon, lj1_prozor)
	brdo(img, brdo_1_visina, lj1_nagib_brdo * brdo_1_visina, koboljkaWidth*b_1_gustoca, koboljkaWidth*b_1_greben)
} 
function ljeto_4(img) {
} 
function ljeto_3(img) {
	for (var i = 0; i < 8; i++) {	
		prikazi_ledja = 0; 
		robot(img, random(koboljkaWidth*0.15, koboljkaWidth*0.85), random(horizont*0.03, horizont*0.9), random(koboljkaWidth*0.015, koboljkaWidth*0.025))		
	}  	
	drobina(img)
} 
function ljeto_2(img) {
	broj_robota = 3
	for (var i = 0; i < broj_robota; i++) {
		velicina_robota = map(i, 0, broj_robota, koboljkaWidth*0.02, horizont*0.1)
		prikazi_ledja = 1; 
		robot(img, random(koboljkaWidth*0.10, koboljkaWidth*centar*0.9), random(horizont*0.01, horizont*0.8), velicina_robota)		
		robot(img, random(koboljkaWidth*centar*1.1, koboljkaWidth*0.90, ), random(horizont*0.01, horizont*0.8), velicina_robota)		  
	}  		
}
function ljeto_1(img) {
}  
function funkcija_zvijezde(img) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	debljina = koboljkaWidth/600;
	visina = horizont*1.0;
	smooth = 2.5
	vinjeta_velicina = minSize/2 * 2/smooth;
	od_transparencije = 25;
	debljina_stroke = vinjeta_velicina/od_transparencije
	img.strokeWeight(debljina_stroke);	
	img.noFill()
	for (var i = 0; i < od_transparencije*smooth; i++) {
		img.stroke(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), od_transparencije - i/smooth); 
		img.line(0, visina - i*debljina_stroke, koboljkaWidth, visina - i*debljina_stroke)		
	}   	
	for (var i=0; i < 5000; i++) {      
		push();
			img.noStroke()
			img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), random(50,100)); 
			img.circle(random (0, koboljkaWidth), random (0,koboljkaHeight), random (minSize/4000, minSize/600));  
		pop(); 
	}
	for (var i=0; i < 400; i++) {   
		push();
			img.noStroke()
			img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), random(50,100)); 
			img.circle(random (0, koboljkaWidth), random (0, koboljkaHeight), random (minSize/600, minSize/200));  
		pop(); 
	}  
	planina_od = koboljkaWidth*-0.1; 
	planina_do = koboljkaWidth*0.1;
	gustoca = koboljkaWidth/1000; 
	visina = random(koboljkaHeight*0.5,koboljkaHeight*0.50);
	for (var x = 0; x <= koboljkaWidth; x+=gustoca) {
		var nx = map(x, 0, koboljkaWidth, 0, visina);
		var y = planina_od + (visina * noise(nx));
			if (x < koboljkaWidth/2) {   
				transp = map(x, 0, koboljkaWidth/2, 50, 10)
			} else {  
				transp = map(x, koboljkaWidth/2, koboljkaWidth, 10, 50)
			}   
		img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), transp); 
		img.ellipse(x + random(-koboljkaWidth/100,koboljkaWidth/100), y, random(minSize/10000,minSize/300))
	}  
}    
function global(img) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	r = global_velicina*1.00;
	kut22 = atan2(mjesec_y - global_y, mjesec_x - global_x);
	kut33 = atan2(sunce_y - global_y, sunce_x - global_x);
	img.noStroke()
	img.fill(hue(boja_global), saturation(boja_global)-0, brightness(boja_global)-40, 100);
	img.ellipse(global_x, global_y, global_velicina)    
	var xdiv_sunce = map(20 * minSize/600, 0, koboljkaWidth/2, 1, -1, true); 
	var xdiv_mjesec = map(60 * minSize/600, 0, koboljkaWidth/2, 1, -1, true); 
	var xdiv_global = map(20 * minSize/600, 0, koboljkaWidth/2, 1, -1, true); 
	img.push()
		img.translate(global_x, global_y)
		img.rotate(kut33-180)
		img.fill(hue(boja_global), saturation(boja_global), brightness(boja_global)-30, 50); 
		polumjesec(img, 0, 0, r, xdiv_mjesec); 
	img.pop()    
	img.push()
		img.translate(global_x, global_y)
		img.rotate(kut33-180)
		img.fill(hue(boja_global), saturation(boja_global), brightness(boja_global)-20, 70); 
		polumjesec(img, 0, 0, r, xdiv_sunce); 
	img.pop()    
	img.push()
		img.translate(global_x, global_y)
		img.rotate(kut22)
		img.noStroke()
		img.fill(hue(boja_global), saturation(boja_global), brightness(boja_global)-50, 35); 
		polumjesec(img, 0, 0, r, xdiv_global); 
	img.pop()       
	smooth = 2.5
	vinjeta_velicina = minSize * random_svjetlo[6]/smooth;
	od_transparencije =  random_svjetlo[7];
	debljina_stroke = vinjeta_velicina/od_transparencije
	img.strokeWeight(debljina_stroke/2);	
	img.noFill()
	for (var i = 0; i < od_transparencije*smooth; i++) {
		img.stroke(hue(boja_global), saturation(boja_global), brightness(boja_global), od_transparencije - i/smooth);          
		img.ellipse(global_x, global_y, i*debljina_stroke)   
	}   
}  
function mjesec(img) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	img.noStroke()
	img.fill(boja_mjesec)
	if ( mjesec_velicina == 0) {
		broj_neon = 0
	} else {  
		broj_neon = 30
	}  
	debljina_neona = 0.05;  
	rotiraj = random(-10,10)
	if (oblik_svjetla == 1) {
		img.push()
		img.translate(mjesec_x, mjesec_y)
		img.rotate(rotiraj)
			img.noFill()
			img.strokeWeight(mjesec_velicina*debljina_neona)
			img.stroke(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), 100); 		
			zvjezda(img, 0, 0, mjesec_velicina/2, mjesec_velicina/2 + mjesec_velicina/5, 5)  
			for (var n = 0; n < broj_neon; n++) {
				sjaj = map(n, 0, broj_neon, 8, 0)
				img.noFill()
				img.strokeWeight(mjesec_velicina*debljina_neona + n)
				img.stroke(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), sjaj); 
				zvjezda(img, 0, 0, mjesec_velicina/2, mjesec_velicina/2 + mjesec_velicina/5, 5) 
			}  
		img.pop() 
	}  
	if (oblik_svjetla == 2) {
		img.push()
			img.noFill()
			img.stroke(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), 100); 
			img.strokeWeight(mjesec_velicina*debljina_neona)
			img.ellipse(mjesec_x, mjesec_y, mjesec_velicina)
		img.pop()	
		for (var n = 0; n < broj_neon; n++) {
			sjaj = map(n, 0, broj_neon, 8, 0)
			img.push()
				img.noFill()
				img.stroke(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), sjaj); 
				img.strokeWeight(mjesec_velicina*debljina_neona + n)
				img.ellipse(mjesec_x, mjesec_y, mjesec_velicina)
			img.pop()	  
		}   		
	}    
	if (oblik_svjetla == 3) {
		img.push()
			img.translate(mjesec_x, mjesec_y)
			img.rotate(rotiraj)	
			img.noFill()
			img.stroke(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), 100); 
			img.strokeWeight(mjesec_velicina*debljina_neona)
			rectMode(CENTER)		
			img.rect(0, 0, mjesec_velicina/5, mjesec_y - mjesec_velicina*6, mjesec_velicina/5)
			for (var n = 0; n < broj_neon; n++) {
				sjaj = map(n, 0, broj_neon, 8, 0)
				img.noFill()
				img.stroke(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), sjaj); 
				img.strokeWeight(mjesec_velicina*debljina_neona + n)
				rectMode(CENTER)				
				img.rect(0, 0, mjesec_velicina/5, mjesec_y - mjesec_velicina*6, mjesec_velicina/5)				
			}   
		img.pop()		
	}    
	if (oblik_svjetla == 4) {
		img.push()
			img.translate(mjesec_x, mjesec_y)
			img.rotate(rotiraj)	
			img.noFill()
			img.stroke(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), 100); 
			img.strokeWeight(mjesec_velicina*debljina_neona)
			rectMode(CENTER)		
			img.rect(0, 0, mjesec_velicina/5, mjesec_y - mjesec_velicina*40, mjesec_velicina/10)
			for (var n = 0; n < broj_neon; n++) {
				sjaj = map(n, 0, broj_neon, 8, 0)
				img.noFill()
				img.stroke(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), sjaj); 
				img.strokeWeight(mjesec_velicina*debljina_neona + n)
				rectMode(CENTER)				
				img.rect(0, 0, mjesec_velicina/5, mjesec_y - mjesec_velicina*40, mjesec_velicina/10)				
			}   
		img.pop()		
	}    
	smooth = 2.5
	vinjeta_velicina = koboljkaWidth/2 * random_svjetlo[14]/smooth;
	od_transparencije = random_svjetlo[15];
	debljina_stroke = vinjeta_velicina/od_transparencije
	img.strokeWeight(debljina_stroke/2);	
	img.noFill()
	for (var i = 0; i < od_transparencije*smooth; i++) {
		img.stroke(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), od_transparencije - i/smooth);          
		img.ellipse(mjesec_x, mjesec_y, i*debljina_stroke)   
	}     
}  
function mjesec_popuna(img) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	img.noStroke()
	img.fill(boja_mjesec)
	smooth = 2.5
	vinjeta_velicina = koboljkaWidth/2 * random_svjetlo[14]/smooth;
	od_transparencije = random_svjetlo[15];
	debljina_stroke = vinjeta_velicina/od_transparencije
	img.strokeWeight(debljina_stroke/2);	
	img.noFill()
	for (var i = 0; i < od_transparencije*smooth; i++) {
		img.stroke(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), od_transparencije - i/smooth);          
		img.ellipse(mjesec_x, mjesec_y, i*debljina_stroke)   
	}   
}  
function sunce(img) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	r = sunce_velicina*1.00;
	kut2 = atan2(mjesec_y - sunce_y, mjesec_x - sunce_x);
	kut3 = atan2(global_y - sunce_y, global_x - sunce_x);
	if ( sunce_velicina == 0) {
		broj_neon = 0
	} else {  
		broj_neon = 30
	}
	debljina_neona = 0.05;
	rotiraj = random(-10,10)
	if ( oblik_svjetla == 1) { 
		img.push()
		img.translate(sunce_x, sunce_y)
		img.rotate(rotiraj)
			img.noFill()
			img.strokeWeight(sunce_velicina*debljina_neona)
			img.stroke(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), 100); 		
			zvjezda(img, 0, 0, sunce_velicina/2, sunce_velicina/2 + sunce_velicina/5, 5)  
			for (var n = 0; n < broj_neon; n++) {
				sjaj = map(n, 0, broj_neon, 8, 0)
				img.noFill()
				img.stroke(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), sjaj); 
				img.strokeWeight(sunce_velicina*debljina_neona + n)
				zvjezda(img, 0, 0, sunce_velicina/2, sunce_velicina/2 + sunce_velicina/5, 5) 
			}  
		img.pop()	
	}  
	if ( oblik_svjetla == 2) { 
		img.push()
			img.noFill()
			img.stroke(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), 100); 
			img.strokeWeight(sunce_velicina*debljina_neona)
			img.ellipse(sunce_x, sunce_y, sunce_velicina)
		img.pop()	
		for (var n = 0; n < broj_neon; n++) {
			sjaj = map(n, 0, broj_neon, 8, 0)
			img.push()
				img.noFill()
				img.stroke(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), sjaj); 
				img.strokeWeight(sunce_velicina*debljina_neona + n)
				img.ellipse(sunce_x, sunce_y, sunce_velicina)
			img.pop()	
		}  
	}  
	if ( oblik_svjetla == 3) { 
		img.push()
			img.translate(sunce_x, sunce_y)
			img.rotate(rotiraj)	
			img.noFill()
			img.stroke(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), 100); 
			img.strokeWeight(sunce_velicina*debljina_neona)
			rectMode(CENTER)
			img.rect(0, 0, sunce_velicina/5, sunce_y - sunce_velicina*6, sunce_velicina/5)
			for (var n = 0; n < broj_neon; n++) {
				sjaj = map(n, 0, broj_neon, 8, 0)
					img.noFill()
					img.stroke(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), sjaj); 
					img.strokeWeight(sunce_velicina*debljina_neona + n)
					rectMode(CENTER)
					img.rect(0, 0, sunce_velicina/5, sunce_y - sunce_velicina*6, sunce_velicina/5)
			}  
		img.pop()
	}  
	if ( oblik_svjetla == 4) { 
		img.push()
			img.translate(sunce_x, sunce_y)
			img.rotate(rotiraj)	
			img.noFill()
			img.stroke(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), 100); 
			img.strokeWeight(sunce_velicina*debljina_neona)
			rectMode(CENTER)
			img.rect(0, 0, sunce_velicina/5, sunce_y - sunce_velicina*40, sunce_velicina/10)
			for (var n = 0; n < broj_neon; n++) {
				sjaj = map(n, 0, broj_neon, 8, 0)
					img.noFill()
					img.stroke(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), sjaj); 
					img.strokeWeight(sunce_velicina*debljina_neona + n)
					rectMode(CENTER)
					img.rect(0, 0, sunce_velicina/5, sunce_y - sunce_velicina*40, sunce_velicina/10)
			}  
		img.pop()
	}  
	smooth = 2.5
	vinjeta_velicina = koboljkaHeight * random_svjetlo[22]/smooth;
	od_transparencije = random_svjetlo[23];
	debljina_stroke = vinjeta_velicina/od_transparencije
	img.strokeWeight(debljina_stroke);	
	img.noFill()
	for (var i = 0; i < od_transparencije*smooth; i++) {
		img.stroke(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), od_transparencije - i/smooth);          
		img.ellipse(sunce_x, sunce_y, i*debljina_stroke)   
	}     
}
function sunce_popuna(img) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	r = sunce_velicina*1.00;
	img.noStroke()
	img.fill(boja_sunce)
	smooth = 2.5
	vinjeta_velicina = minSize * random_svjetlo[22]/smooth;
	od_transparencije = random_svjetlo[23];
	debljina_stroke = vinjeta_velicina/od_transparencije
	img.strokeWeight(debljina_stroke);	
	img.noFill()
	for (var i = 0; i < od_transparencije*smooth; i++) {
		img.stroke(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), od_transparencije - i/smooth);          
		img.ellipse(sunce_x, sunce_y, i*debljina_stroke)   
	}   
}
function zvjezda(img, x, y, radius1, radius2, npoints) {
	let minSize = min(koboljkaWidth, koboljkaHeight); 
	let angle = 360 / npoints-0.1;
	let halfAngle = angle / 2;
	img.beginShape();
		for (let a = 0; a < 360; a += angle) {
			let sx = x + cos(a) * radius2;
			let sy = y + sin(a) * radius2;
			img.curveVertex(sx, sy);
			sx = x + cos(a + halfAngle) * radius1;
			sy = y + sin(a + halfAngle) * radius1;
			img.curveVertex(sx, sy);
		}
	img.endShape(CLOSE);
}  
function bijela_kuca(img, x, y, sirina) {
	x_roma = x;
	y_roma = y;
	dodatak = random(koboljkaWidth*0.001, koboljkaWidth*0.1);
	sirina_zgrade = sirina ;
	visina_zgrade = sirina_zgrade*0.4;
	sirina_bukeri = sirina_zgrade/7.3;
	visina_bukeri = visina_zgrade*1.2;
	x_bukner = sirina_zgrade/2 - sirina_bukeri/2 + dodatak/2;
	y_kupola_bunker = y_roma - visina_bukeri*0.5;
	sirina_kupole_bunker = sirina_bukeri*0.8;
	sirina_sredine = sirina_zgrade/3.6 ;
	visina_sredine = visina_zgrade*1.5;
	y_kupola = y_roma - visina_sredine*0.5;
	sirina_kupole = sirina_sredine*0.8;
	broj_vrata = 25;
	sirina_vrata = sirina_zgrade/25;
	visina_vrata = visina_zgrade*0.5 - sirina_vrata/2;
	tableta(img, x_roma, y_roma - visina_sredine/2 - sirina_kupole, sirina_sredine*0.01, sirina_kupole*1)
	xxx(img, x_roma, y_roma - visina_sredine/2 - sirina_kupole - sirina_kupole/2, sirina_kupole*0.05)
	xxx(img, x_roma, y_kupola - sirina_kupole*0.58, sirina_kupole*0.15)
	xxx(img, x_roma, y_kupola - sirina_kupole*0.40, sirina_kupole*0.4)
	xxx(img, x_roma, y_kupola, sirina_kupole)
	xxx(img, x_roma - x_bukner, y_kupola_bunker - sirina_bukeri*0.50, sirina_kupole_bunker*0.15)
	xxx(img, x_roma - x_bukner, y_kupola_bunker - sirina_bukeri*0.35, sirina_kupole_bunker*0.4)
	xxx(img, x_roma - x_bukner, y_kupola_bunker, sirina_kupole_bunker)
	xxx(img, x_roma + x_bukner, y_kupola_bunker - sirina_bukeri*0.50, sirina_kupole_bunker*0.15)
	xxx(img, x_roma + x_bukner, y_kupola_bunker - sirina_bukeri*0.35, sirina_kupole_bunker*0.4)
	xxx(img, x_roma + x_bukner, y_kupola_bunker, sirina_kupole_bunker)
	for (var i = x_roma - sirina_zgrade/2 + sirina_vrata - dodatak/2; i < x_roma + sirina_zgrade/2 - sirina_vrata + dodatak/2; i+=sirina_zgrade/broj_vrata/2) {
		tableta(img, i, y_roma - visina_zgrade*0.25, sirina_vrata/2, visina_zgrade*0.5)
	}  		
	tableta_kocka(img, x_roma, y_roma, sirina_zgrade + dodatak, visina_zgrade)
	for (var i = x_roma - sirina_zgrade/2 + sirina_vrata - dodatak/2; i <= x_roma + sirina_zgrade/2 - sirina_vrata + dodatak/2; i+=sirina_zgrade/broj_vrata) {
		tableta_vrata(img, i, y_roma, sirina_vrata/2, visina_zgrade*0.2)
		tableta_vrata(img, i, y_roma - visina_zgrade*0.25, sirina_vrata/4, 0)
	}  		
	tableta_kocka(img, x_roma - x_bukner, y_roma, sirina_bukeri, visina_bukeri)
	tableta_vrata(img, x_roma - x_bukner, y_roma, sirina_bukeri*0.35, visina_zgrade*0.3)
	tableta_kocka(img, x_roma + x_bukner, y_roma, sirina_bukeri, visina_bukeri)
	tableta_vrata(img, x_roma + x_bukner, y_roma, sirina_bukeri*0.35, visina_zgrade*0.3)		
	tableta_kocka(img, x_roma, y_roma, sirina_sredine, visina_sredine)		
	tableta_vrata(img, x_roma, y_roma, sirina_sredine*0.25, visina_zgrade*0.50)
	tableta_vrata(img, x_roma - sirina_sredine*0.30, y_roma, sirina_sredine*0.15, visina_zgrade*0.40)
	tableta_vrata(img, x_roma + sirina_sredine*0.30, y_roma, sirina_sredine*0.15, visina_zgrade*0.40)
}  
function brdo(img, planina_od, planina_do, gustoca, visina) {
	let minSize = min(koboljkaWidth, koboljkaHeight);   
	var x_poz = [];
	var y_poz = [];
	img.noStroke()
	img.fill(hue(boja_global), saturation(boja_global)-10, brightness(boja_global)-70, 100); 
	img.beginShape();
		img.vertex(0, koboljkaHeight); 
		for (var x = 0; x <= koboljkaWidth; x+=gustoca) {
			var nx = map(x, 0, koboljkaWidth, 0, visina);
			var y = planina_od + (visina * noise(nx));
			if (x < koboljkaWidth/2) {   
				vrhovi = map(x, 0, koboljkaWidth/2, 0, planina_do)
				img.vertex(x, y-vrhovi);      
			} else {  
				vrhovi = map(x, koboljkaWidth/2, koboljkaWidth, planina_do, 0)
				img.vertex(x, y-vrhovi);      
			}   			
			x_poz.push(x);
			y_poz.push(y-vrhovi);
		}
		img.vertex(koboljkaWidth, y-vrhovi); 		
		img.vertex(koboljkaWidth, koboljkaHeight); 
	img.endShape();  
	img.fill(hue(boja_robot), saturation(boja_robot), brightness(boja_robot)+10, 100); 
	img.beginShape();
		img.vertex(0, koboljkaHeight); 
		for (var i = 0; i <= x_poz.length; i+=1) {
			img.vertex(x_poz[i], y_poz[i] + random(0, 0));
			if (i % 2 == 0) {
			img.vertex(x_poz[i], y_poz[i] + random(0, visina*2));
			}
		}  
		img.vertex(koboljkaWidth, koboljkaHeight); 
	img.endShape(CLOSE);  
	img.fill(hue(boja_robot), saturation(boja_robot), brightness(boja_robot), 100); 
	img.beginShape();
		img.vertex(0, koboljkaHeight); 
		for (var s = 0; s <= x_poz.length; s+=1) {
			img.vertex(x_poz[s], y_poz[s] + random(0,visina/40));
			if (s % 1 == 0) {
			img.vertex(x_poz[s], y_poz[s] + random(0,visina*2));
			}
		}  
		img.vertex(koboljkaWidth, koboljkaHeight); 
	img.endShape(CLOSE);  
}
function debeljuca(img, x, y, debljina) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	kosa(img, x, y, debljina, 170, 370, 20, 0.2, 0.5)	
	kosa(img, x, y, debljina, 170, 370, 13, 0.1, 0.2)		
	tableta(img, x, y+debljina*0.25, debljina, 0)
	red = 1;
	kolumna = 12;
	podjela = debljina/kolumna + debljina*0.1;
	for (var i = 0; i < kolumna; i++) {
		random_broj = random(array_broj);	
		broj(img, x - i*podjela/4 + debljina*0.25, y , debljina/16, 1)
		random_broj = random(array_broj);	
		broj(img, x - i*podjela/4 + debljina*0.25, y - debljina*0.08, debljina/16, 0)
		random_broj = random(array_broj);	
		broj(img, x - i*podjela/4 + debljina*0.25, y + debljina*0.08, debljina/16, 0)
		random_broj = random(array_broj);	
		broj(img, x - i*podjela/4 + debljina*0.25, y + debljina*0.16, debljina/16, 0)
		random_broj = random(array_broj);	
		broj(img, x - i*podjela/4 + debljina*0.25, y + debljina*0.24, debljina/16, 0)
		random_broj = random(array_broj);	
		broj(img, x - i*podjela/4 + debljina*0.25, y + debljina*0.32, debljina/16, 0)		
		random_broj = random(array_broj);	
		broj(img, x - i*podjela/4 + debljina*0.25, y + debljina*0.40, debljina/16, 0)	
	}  	
	funkcija_stablo_glava(img, x, y-debljina*random(0.35, 0.35), debljina*0.35, debljina*0.30, debljina*0.05, debljina*0.05)
}
function pratar(img, x, y, debljina) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	tableta(img, x, y, debljina, debljina)
	random(random_glava_debeljuca)(img, x, y-debljina*random(0.95, 0.95), debljina*0.50);
	xxx(img, x, y, debljina*0.40)	
	mmm(img, x, y, debljina*0.35)
}
function zapovjedi(img, x, y, debljina) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	kosa(img, x, y, debljina, 170, 370, 20, debljina*0.009, debljina*0.006)	
	tableta(img, x, y, debljina, debljina)
	red = 8;
	kolumna = 3;
	podjela = debljina/red + debljina*0.1;
	for (var i = 0; i < red; i++) {
		random_broj = random(array_broj);	
		broj(img, x, y - i*podjela + debljina*0.75, debljina/4, 1)
		random_broj = random(array_broj);	
		broj(img, x-debljina*0.18, y - i*podjela + debljina*0.75, debljina/4, 1)
		random_broj = random(array_broj);	
		broj(img, x+debljina*0.18, y - i*podjela + debljina*0.75, debljina/4, 1)	
	}  	
}
function zmija(img, x, y) {
	let minSize = min(koboljkaWidth, koboljkaHeight);  
	sirina = koboljkaWidth*0.40;  
	visina = koboljkaWidth*0.15;
	debljina_pocetak = koboljkaWidth/100;
	debljina_kraj = koboljkaWidth/15;
	gustoca = koboljkaWidth/1200; 
	noiseX = 1*random(0,100)
	for (let i = 0; i >= -visina; i -= gustoca) {
		let granica = map(i, 0, visina, 0, sirina);
		let debljina = map(i, 0, -visina, debljina_pocetak, debljina_kraj);
		let x_pomak = map(noise(noiseX), 0, 1, -granica, granica);
			if (i < -visina*0.999) { 
				xxx(img, x + x_pomak, y + i, debljina);
				oko(img, x + x_pomak, y + i, debljina*0.84);
			} else {  
				xxx(img, x + x_pomak, y + i, debljina); 
			}   
		noiseX += 0.03;
	}  
}
function kiklop(img, xxx, x_poz, y_poz, radius) {  
	let minSize = min(koboljkaWidth, koboljkaHeight);  
	kuglica = radius*random(0.25, 0.25)
	omjer = radius*0.25;
	kaos = radius*random(0, 0.001)
	for (var k = 0; k < 5; k++) {
		gustoca = 6 - k*0.5
		kiklop_krug(img, x_poz, y_poz, radius+k*omjer, kuglica+k, gustoca)
	}    
	uvijanje = random(5,10);
	funkcija_stablo(img, x_poz - radius*0.1, y_poz + radius*0.4, radius*1.1, kuglica*1.2, uvijanje, radius*0.05)
  	funkcija_stablo(img, x_poz + radius*0.1, y_poz + radius*0.5, radius*1.2, kuglica*1.2, uvijanje, radius*0.05)		
	funkcija_stablo(img, x_poz - radius*0.4, y_poz + radius*0.4, radius*0.7, kuglica*1.1, uvijanje, radius*0.05)
  	funkcija_stablo(img, x_poz + radius*0.4, y_poz + radius*0.3, radius*0.8, kuglica*0.7, uvijanje, radius*0.05)	
	funkcija_stablo(img, x_poz - radius*0.6, y_poz + radius*0.4, radius*1.3, kuglica*0.8, uvijanje, radius*0.05)
  	funkcija_stablo(img, x_poz + radius*0.6, y_poz + radius*0.4, radius*1.0, kuglica*0.9, uvijanje, radius*0.05)	
	var glavuse = random();   
	if (glavuse < 0.40) {   
		funkcija_stablo_oko(img, x_poz, y_poz, radius*2.0, kuglica*1.8, uvijanje, radius*0.05)
		funkcija_stablo_oko(img, x_poz - radius*0.4, y_poz , radius*1.5, kuglica*1.7, uvijanje, radius*0.05)
		funkcija_stablo_oko(img, x_poz + radius*0.4, y_poz , radius*1.6, kuglica*1.7, uvijanje, radius*0.05)
	} else if (glavuse < 0.40) {    
		funkcija_stablo_oko(img, x_poz, y_poz, radius*2.0, kuglica*1.8, uvijanje, radius*0.05)
		funkcija_stablo_oko(img, x_poz - radius*0.4, y_poz , radius*1.5, kuglica*1.7, uvijanje, radius*0.05)
		funkcija_stablo_oko(img, x_poz + radius*0.4, y_poz , radius*1.6, kuglica*1.7, uvijanje, radius*0.05)
		funkcija_stablo_oko(img, x_poz - radius*0.8, y_poz , radius*1.2, kuglica*1.2, uvijanje, radius*0.03)
		funkcija_stablo_oko(img, x_poz + radius*0.8, y_poz , radius*1.2, kuglica*1.2, uvijanje, radius*0.03)	
	} else {  
		funkcija_stablo_oko(img, x_poz, y_poz, radius*2.0, kuglica*1.8, uvijanje, radius*0.05)
		funkcija_stablo_oko(img, x_poz - radius*0.4, y_poz , radius*1.5, kuglica*1.7, uvijanje, radius*0.05)
		funkcija_stablo_oko(img, x_poz + radius*0.4, y_poz , radius*1.6, kuglica*1.7, uvijanje, radius*0.05)
		funkcija_stablo_oko(img, x_poz - radius*0.8, y_poz , radius*1.2, kuglica*1.2, uvijanje, radius*0.03)
		funkcija_stablo_oko(img, x_poz + radius*0.8, y_poz , radius*1.2, kuglica*1.2, uvijanje, radius*0.03)
		funkcija_stablo_oko(img, x_poz - radius*0.9, y_poz , radius*0.8, kuglica*0.9, uvijanje, radius*0.03)
		funkcija_stablo_oko(img, x_poz + radius*0.9, y_poz , radius*0.9, kuglica*0.8, uvijanje, radius*0.03)
	}   
	funkcija_stablo(img, x_poz - radius*0.1, y_poz + radius*0.4, radius*1.1, kuglica*1.2, uvijanje, radius*0.05)
  	funkcija_stablo(img, x_poz + radius*0.1, y_poz + radius*0.5, radius*1.0, kuglica*1.2, uvijanje, radius*0.05)		
	funkcija_stablo(img, x_poz - radius*0.4, y_poz + radius*0.4, radius*0.6, kuglica*1.1, uvijanje, radius*0.05)
  	funkcija_stablo(img, x_poz + radius*0.4, y_poz + radius*0.3, radius*0.5, kuglica*0.7, uvijanje, radius*0.05)	
	funkcija_stablo(img, x_poz - radius*0.6, y_poz + radius*0.4, radius*0.7, kuglica*0.8, uvijanje, radius*0.05)
  	funkcija_stablo(img, x_poz + radius*0.6, y_poz + radius*0.4, radius*1.0, kuglica*0.9, uvijanje, radius*0.05)		
}  
function kiklop_krug(img, cx, cy, r, kuglica, gustoca) {
	let minSize = min(koboljkaWidth, koboljkaHeight);  
    for (var i = 90; i < 450; i+=gustoca) {
		nered_x = random(-kaos,kaos)
		nered_y = random(-kaos,kaos)
		var x = cx + cos(i) * r / 2;
		var y = cy + sin(i) * r / 2;
		xxx(img, x + nered_x, y + nered_y, kuglica)
	}
}
function asset_publika(img, krugovi_y_od, krugovi_y_do, radius, nagib, povecanje) {
	let minSize = min(koboljkaWidth, koboljkaHeight);  
	krugovi_x_od = koboljkaWidth*0.0;
	krugovi_x_do = koboljkaWidth*1.0;
	gustoca_1 = 3;
	gustoca_2 = 1;
	for (var w = krugovi_y_od; w < krugovi_y_do; w+=radius) {
		nered_x = radius*0.5;
		nered_y = radius*0.8;   
	img.fill(hue(boja_robot), saturation(boja_robot), brightness(boja_robot), 100); 
		img.beginShape();
			img.vertex(krugovi_x_od, koboljkaHeight); 
			for (var i = krugovi_x_od; i <= krugovi_x_do; i+=radius/gustoca_1) {
				sinusoida = map(i, krugovi_x_do, krugovi_x_od, 0, nagib);
				zamjena = map (i, krugovi_x_od, krugovi_x_do, 0, krugovi_y_do)
				y = zamjena * sinusoida; 
				img.vertex(i + random(-nered_x, nered_x), y+w + random(-nered_y, nered_y));   
			} 
		img.vertex(i + random(-nered_x, nered_x), koboljkaHeight);  
		img.vertex(koboljkaWidth, koboljkaHeight);  
		img.vertex(0, koboljkaHeight); 		
		img.endShape(CLOSE);  
		for (var i = krugovi_x_od; i <= krugovi_x_do; i+=radius/gustoca_1) {
			sinusoida = map(i, krugovi_x_do, krugovi_x_od, 0, nagib);
			zamjena = map (i, krugovi_x_od, krugovi_x_do, 0, krugovi_y_do)
			y = zamjena * sinusoida; 
			xxx(img, i + random(-nered_x, nered_x), y + w + random(-nered_y, nered_y), radius)
			rizi = map(y + w, horizont, koboljkaHeight, 18, 10.3)
			rizi_od = 5;
			if (povirivanje == 1) { 
			}
			if (povirivanje == 2) { 			
				if (i + random(-nered_x, nered_x) > koboljkaWidth*0.15 && i + random(-nered_x, nered_x) < koboljkaWidth*(centar*0.8)) {
					if (random() < 0.02) {
						nemir = map (i, 0, koboljkaWidth/2, radius/10, radius/15)
						funkcija_stablo_glava(img, i + random(-nered_x, nered_x), y+w + random(-nered_y, nered_y), radius*random(rizi_od,rizi), radius, nemir, radius/6)
					}	
				}
				if (i + random(-nered_x, nered_x) > koboljkaWidth*(centar*1.2) && i + random(-nered_x, nered_x) < koboljkaWidth*0.85) {
					if (random() < 0.02) {
						nemir = map (i, 0, koboljkaWidth/2, radius/10, radius/15)
						funkcija_stablo_glava(img, i + random(-nered_x, nered_x), y+w + random(-nered_y, nered_y), radius*random(rizi_od,rizi), radius, nemir, radius/6)
					}	
				}	
				if (i + random(-nered_x, nered_x) > koboljkaWidth*centar*0.7 && i + random(-nered_x, nered_x) < koboljkaWidth*centar*1.3 && y+w > publika_3_do && y+w < publika_3_do*1.05) {
					if (random() < 0.07) {
						nemir = map (i, 0, koboljkaWidth/2, radius/10, radius/15)
						funkcija_stablo_glava(img, i + random(-nered_x, nered_x), y+w + random(-nered_y, nered_y), radius*random(3,13), radius, nemir, radius/6)
					}	
				}					
			} 		
			if (povirivanje == 3) { 			
				if (i + random(-nered_x, nered_x) > koboljkaWidth*0.05 && i + random(-nered_x, nered_x) < koboljkaWidth*(centar*0.85)) {
					if (random() < 0.03) {
						nemir = map (i, 0, koboljkaWidth/2, radius/10, radius/15)
						funkcija_stablo_glava(img, i + random(-nered_x, nered_x), y+w + random(-nered_y, nered_y), radius*random(rizi_od,rizi), radius, nemir, radius/6)
					}	
				}
				if (i + random(-nered_x, nered_x) > koboljkaWidth*(centar*1.15) && i + random(-nered_x, nered_x) < koboljkaWidth*0.95) {
					if (random() < 0.03) {
						nemir = map (i, 0, koboljkaWidth/2, radius/10, radius/15)
						funkcija_stablo_glava(img, i + random(-nered_x, nered_x), y+w + random(-nered_y, nered_y), radius*random(rizi_od,rizi), radius, nemir, radius/6)
					}	
				}	
				if (i + random(-nered_x, nered_x) > koboljkaWidth*centar*0.7 && i + random(-nered_x, nered_x) < koboljkaWidth*centar*1.3 && y+w > publika_3_do && y+w < publika_3_do*1.05) {
					if (random() < 0.07) {
						nemir = map (i, 0, koboljkaWidth/2, radius/10, radius/15)
						funkcija_stablo_glava(img, i + random(-nered_x, nered_x), y+w + random(-nered_y, nered_y), radius*random(3,13), radius, nemir, radius/6)
					}	
				}		
			} 	
		} 
		radius = radius + povecanje;
	}  
}  	
function asset_publika_zgrade(img, krugovi_y_od, krugovi_y_do, x1, x2, x3, x4, radius, visina_od, visina_do, nagib, vinjeta, neon, prozor) {
	let minSize = min(koboljkaWidth, koboljkaHeight);  	
	krugovi_x_od = koboljkaWidth*0.0;
	krugovi_x_do = koboljkaWidth*1.0;
	gustoca_1 = random(1.0, 1.0); 
	gustoca_2 = 0.00000000001;
	povecanje = 0;
	for (var w = krugovi_y_od; w < krugovi_y_do; w+=krugovi_y_do - krugovi_y_od) {
		img.fill(hue(boja_robot), saturation(boja_robot), brightness(boja_robot), 100); 
		for (var i = krugovi_x_od; i <= krugovi_x_do; i+=radius/gustoca_1) {
			visina_zgrade = random(radius*visina_od, radius*visina_do); 
			sinusoida = map(i, krugovi_x_do, krugovi_x_od, 0, nagib);
			zamjena = map (i, krugovi_x_od, krugovi_x_do, 0, krugovi_y_do)
			y = zamjena * sinusoida; 
			rot = map (i, 0, koboljkaWidth, objektiv_od, objektiv_do) 
			img.push()
				img.translate(koboljkaWidth*translate_x, koboljkaWidth*translate_y)
				img.rotate(random(rotiranje_od, rotiranje_do))
				img.rotate(rot)
				if (i > koboljkaWidth*x1 && i < koboljkaWidth*x2) {  		
					zgrada_1_red(img, i, y + w, radius, visina_zgrade, neon, prozor)
				} else {  
				}
				if (i > koboljkaWidth*x3 && i < koboljkaWidth*x4) {   
					zgrada_1_red(img, i, y + w, radius, visina_zgrade, neon, prozor)
				} else {  
				}
			img.pop()
		} 
		radius = radius + povecanje;
	}  
}  	
function prozor_brojevi(img, x, y, sirina_zgrade, visina_zgrade, neon) {
	sirina_broj = sirina_zgrade*0.50;
	broj_y = y - visina_zgrade/2;
	var slova = random();  
	if (slova < 0.50) {   
		for (var i = broj_y + sirina_broj/2; i < y - visina_vrata*1.5; i+=sirina_broj) {
			random_broj = random(array_broj);
			broj(img, x, i, sirina_broj, neon)	
		} 
	} else if (slova < 0.55) {   
		for (var i = broj_y + sirina_broj/2; i < y - visina_vrata*1.5; i+=sirina_broj) {
			random_broj = random(array_love);
			broj(img, x, i, sirina_broj, neon)	
		} 
	} else if (slova < 0.60) {  	
		for (var i = broj_y + sirina_broj/2; i < y - visina_vrata*1.5; i+=sirina_broj) {
			random_broj = random(array_peace);
			broj(img, x, i, sirina_broj, neon)	
		} 
	} else if (slova < 0.65) {  	
		for (var i = broj_y + sirina_broj/2; i < y - visina_vrata*1.5; i+=sirina_broj) {
			random_broj = random(array_exit);
			broj(img, x, i, sirina_broj, neon)	
		} 	
	} else if (slova < 0.70) {  	
		for (var i = broj_y + sirina_broj/2; i < y - visina_vrata*1.5; i+=sirina_broj) {
			random_broj = random(array_hope);
			broj(img, x, i, sirina_broj, neon)	
		} 	
	} else if (slova < 0.75) {  	
		for (var i = broj_y + sirina_broj/2; i < y - visina_vrata*1.5; i+=sirina_broj) {
			random_broj = random(array_error);
			broj(img, x, i, sirina_broj, neon)	
		} 	
	} else if (slova < 0.80) {  	
		for (var i = broj_y + sirina_broj/2; i < y - visina_vrata*1.5; i+=sirina_broj) {
			random_broj = random(array_alive);
			broj(img, x, i, sirina_broj, neon)	
		} 	
	} else if (slova < 0.85) {  	
		for (var i = broj_y + sirina_broj/2; i < y - visina_vrata*1.5; i+=sirina_broj) {
			random_broj = random(array_happy);
			broj(img, x, i, sirina_broj, neon)	
		} 	
	} else if (slova < 0.90) {  	
		for (var i = broj_y + sirina_broj/2; i < y - visina_vrata*1.5; i+=sirina_broj) {
			random_broj = random(array_heart);
			broj(img, x, i, sirina_broj, neon)	
		} 	
	} else if (slova < 0.95) {  	
		for (var i = broj_y + sirina_broj/2; i < y - visina_vrata*1.5; i+=sirina_broj) {
			random_broj = random(array_trust);
			broj(img, x, i, sirina_broj, neon)	
		} 	
	} else if (slova < 0.97) {  	
		for (var i = broj_y + sirina_broj/2; i < y - visina_vrata*1.5; i+=sirina_broj) {
			random_broj = random(array_truth);
			broj(img, x, i, sirina_broj, neon)	
		} 			
	}  
}
function prozor_naocale(img, x, y, sirina_zgrade, visina_zgrade) {
	sirina_prozora = sirina_zgrade*0.3;
	visina_prozora = sirina_zgrade*0.5;
	y_prozor = y - visina_zgrade/2
	broj_prozora = visina_zgrade / visina_prozora
	for (var i = 0; i <= broj_prozora; i++) {
		xxx(img, x, y_prozor + i*visina_prozora, sirina_prozora) 
		sss(img, x, y_prozor + i*visina_prozora, sirina_prozora*0.5) 
	}    
}
function prozor_yyy(img, x, y, sirina_zgrade, visina_zgrade) {
	sirina_prozora = sirina_zgrade*0.15;
	visina_prozora = sirina_zgrade*0.20;
	y_prozor = y - visina_zgrade/2
	broj_prozora = visina_zgrade / visina_prozora
	for (var i = 0; i <= broj_prozora/2; i++) {
		yyy(img, x, y_prozor + i*visina_prozora, sirina_prozora*0.5) 
		yyy(img, x + sirina_prozora, y_prozor + i*visina_prozora, sirina_prozora*0.5) 
		yyy(img, x - sirina_prozora, y_prozor + i*visina_prozora, sirina_prozora*0.5)
	}    
}
function prozor_xxx(img, x, y, sirina_zgrade, visina_zgrade) {
	sirina_prozora = sirina_zgrade*0.15;
	visina_prozora = sirina_zgrade*0.20;
	y_prozor = y - visina_zgrade/2
	broj_prozora = visina_zgrade / visina_prozora
	for (var i = 0; i <= broj_prozora/2; i++) {
		xxx(img, x, y_prozor + i*visina_prozora, sirina_prozora*0.5) 
		xxx(img, x + sirina_prozora, y_prozor + i*visina_prozora, sirina_prozora*0.5) 
		xxx(img, x - sirina_prozora, y_prozor + i*visina_prozora, sirina_prozora*0.5)
	}    
}
function prozor_tableta_vrata(img, x, y, sirina_zgrade, visina_zgrade) {
	sirina_prozora = sirina_zgrade*0.16;
	visina_prozora = sirina_zgrade*0.35;
	y_prozor = y - visina_zgrade/2
	broj_prozora = visina_zgrade / visina_prozora
	for (var i = 0; i <= broj_prozora*0.40; i++) {
		tableta_vrata(img, x, y_prozor + i*visina_prozora, sirina_prozora*0.5, visina_prozora/2) 
	}    
}
function prozor_linije(img, x, y, sirina_zgrade, visina_zgrade) {
	visina_prostora = visina_zgrade/2 - visina_vrata;
	broj_prozora = random([1,1,1]);
	razmak = sirina_zgrade*0.8;
	sirina_prozora = sirina_zgrade * 0.2;
	visina_prozora = visina_prostora/broj_prozora - razmak;
	prozor_y = y - visina_zgrade/2 + visina_prozora/2;	
	for (var p = 0; p < visina_prostora; p+=visina_prostora/broj_prozora) {
		tableta(img, x, prozor_y + p, sirina_prozora, visina_prozora)
		tableta_vrata(img, x, prozor_y + p, sirina_prozora*0.5, visina_prozora)
	} 
}
function prozor_lift(img, x, y, sirina_zgrade, visina_zgrade) {
	sirina_prozora = sirina_zgrade * 0.2;
	visina_prozora = visina_zgrade;
	tableta(img, x, y, sirina_prozora, visina_prozora)
	tableta_vrata(img, x, y, sirina_prozora*0.5, visina_prozora)
}
function zgrada_1_red(img, x, y, sirina_zgrade, visina_zgrade, neon, prozor) {
	let minSize = min(koboljkaWidth, koboljkaHeight); 	
	tableta(img, x, y, sirina_zgrade, visina_zgrade)
	visina_vrata = sirina_zgrade * 1.1;
	sirina_vrata = sirina_zgrade*0.25;
	if (prozor == 1) {
		if ( prikaz_prozora == 0) { 
			if (random() < 0.30) { 
				prozor_brojevi(img, x, y, sirina_zgrade, visina_zgrade, neon)
			} else if (random() < 0.40) {     
				prozor_linije(img, x, y, sirina_zgrade, visina_zgrade)
			} else if (random() < 0.50) {  
				prozor_lift(img, x, y, sirina_zgrade, visina_zgrade)	
			} else if (random() < 0.60) {  
				prozor_naocale(img, x, y, sirina_zgrade, visina_zgrade)				
			} else if (random() < 0.70) {  
				prozor_yyy(img, x, y, sirina_zgrade, visina_zgrade)							
			} else if (random() < 0.80) {  
				prozor_xxx(img, x, y, sirina_zgrade, visina_zgrade)				
			} else if (random() < 0.99) {  
				prozor_tableta_vrata(img, x, y, sirina_zgrade, visina_zgrade)				
			}  
		}  
		if ( prikaz_prozora == 1) { 
			prozor_brojevi(img, x, y, sirina_zgrade, visina_zgrade, neon)		
		}  
		if ( prikaz_prozora == 2) { 
			prozor_linije(img, x, y, sirina_zgrade, visina_zgrade)		
		}  
		if ( prikaz_prozora == 3) { 
			prozor_lift(img, x, y, sirina_zgrade, visina_zgrade)	
		}  
		if ( prikaz_prozora == 4) { 
			prozor_naocale(img, x, y, sirina_zgrade, visina_zgrade)	
		}  
		if ( prikaz_prozora == 5) { 
			prozor_yyy(img, x, y, sirina_zgrade, visina_zgrade)	
		}  	
		if ( prikaz_prozora == 6) { 
			prozor_xxx(img, x, y, sirina_zgrade, visina_zgrade)	
		}  	
		if ( prikaz_prozora == 7) { 
			prozor_tableta_vrata(img, x, y, sirina_zgrade, visina_zgrade)	
		}  		
	} else {  
	}   
	y_glave = y - visina_zgrade*0.5 - sirina_zgrade * random(1,1);
	if (random() < 0.99) {   	
		random(random_glava)(img, x, y_glave, sirina_zgrade*0.55);	
	} 
}  
function majmun(img, x, y, sirina, visina) {
	y_glave = y - visina/2 - sirina/2;
	sirina_glave = random(sirina*0.7, sirina*0.6);
	visina_glave = sirina*0.7;
	sirina_brade = sirina_glave*0.9;
	visina_brade = random(0, 0);
	y_oka = y_glave - random(sirina_brade*0.70, sirina_brade*0.80);
	y_usta = y_glave + random(sirina_brade*0.1, sirina_brade*0.5);
	usta_velicina = random(sirina/20, sirina/5);
	sirina_dugme = random(sirina/15, sirina/15);
	gustoca = random(20, 40) 
	kosa(img, x, y_glave - visina_glave*0.75, sirina_glave, 150, 390, gustoca, 0.25, 0.3)
	kosa(img, x, y_glave - visina_glave*0.75, sirina_glave, 150, 390, gustoca/2.3, 0.15, 0.2)
	tableta(img, x - sirina*0.15, y, sirina*0.9, visina) 
	tableta(img, x + sirina*0.15, y, sirina*0.9, visina) 
	tableta(img, x, y_glave, sirina_glave, visina_glave) 	
	tableta(img, x, y, sirina, visina) 
	sirina_prozora = sirina*0.20;
	visina_prozora = sirina*0.25;
	y_prozor = y - visina/2
	broj_prozora = visina / visina_prozora
	for (var i = 0; i <= broj_prozora; i++) {
		xxx(img, x, y_prozor + i*visina_prozora, sirina_prozora) 
		zzz(img, x, y_prozor + i*visina_prozora, sirina_prozora*0.5) 
		xxx(img, x - sirina_prozora, y_prozor + i*visina_prozora + sirina_prozora/2, sirina_prozora) 
		zzz(img, x - sirina_prozora, y_prozor + i*visina_prozora + sirina_prozora/2, sirina_prozora*0.5)
 		xxx(img, x + sirina_prozora, y_prozor + i*visina_prozora + sirina_prozora/2, sirina_prozora) 
		zzz(img, x + sirina_prozora, y_prozor + i*visina_prozora + sirina_prozora/2, sirina_prozora*0.5) 	
	}    
	xxx(img, x- sirina_glave/6, y_oka, sirina_glave*0.40) 	
	zzz(img, x- sirina_glave/6, y_oka, sirina_glave*0.25) 		
	xxx(img, x+ sirina_glave/6, y_oka, sirina_glave*0.40) 
	zzz(img, x+ sirina_glave/6, y_oka, sirina_glave*0.25) 	
	tableta(img, x, y_glave, sirina_brade, visina_brade) 
	zzz(img, x - sirina_glave/10, y_glave - sirina_brade*0.5, sirina/20) 	
	zzz(img, x + sirina_glave/10, y_glave - sirina_brade*0.5, sirina/20) 
	xxx(img, x, y_usta, usta_velicina*1.5) 
	zzz(img, x, y_usta, usta_velicina) 
}
function muva_naocale(img, glava_x, glava_y, glava_radius) {
	visina = random(glava_radius*0.2, glava_radius*0.7)
	sirina_brada = glava_radius*1.0
	visina_brada = sirina_brada*0.2
	y_brada = glava_y + glava_radius/2 + visina*0.4;
	sirina_oko = glava_radius/4
	visina_oko = sirina_oko*2.5
	sirina_usta = glava_radius/10
	visina_usta = sirina_usta*1.5
	y_usta = y_brada
	sirina_nos = glava_radius/12;
	y_nos = y_brada - visina_brada * 2.0
	sirina_uvo = glava_radius/10;
	visina_uvo = sirina_uvo*3;
	x_uvo = glava_radius/2 + sirina_uvo/2
	xxx(img, glava_x, glava_y - glava_radius * 0.85 - visina/2, glava_radius*0.20)
	xxx(img, glava_x, glava_y - glava_radius * 0.70 - visina/2, glava_radius*0.40)
	xxx(img, glava_x + glava_radius/3.5, glava_y - glava_radius * 0.6 - visina/2, glava_radius*0.45)
	xxx(img, glava_x - glava_radius/3.5, glava_y - glava_radius * 0.6 - visina/2, glava_radius*0.45)
	tableta(img, glava_x, glava_y, glava_radius, visina) 
	tableta(img, glava_x - glava_radius/2.5, glava_y, sirina_oko*1.5, visina_oko) // oko livo		
	tableta_vrata(img, glava_x - glava_radius/2.5, glava_y, sirina_oko, visina_oko) // oko livo	
	tableta(img, glava_x + glava_radius/2.5, glava_y, sirina_oko*1.5, visina_oko) // oko desno
	tableta_vrata(img, glava_x + glava_radius/2.5, glava_y, sirina_oko, visina_oko) // oko desno
	tableta(img, glava_x, y_brada, sirina_brada*0.8, visina_brada) // brada	
	tableta_vrata(img, glava_x - glava_radius/14, y_nos, sirina_nos, 0) // nos livo	
	tableta_vrata(img, glava_x + glava_radius/14, y_nos, sirina_nos, 0) // nos desno
	tableta_vrata(img, glava_x, y_usta, sirina_usta, visina_usta) // usta sredina	
	tableta_vrata(img, glava_x - glava_radius/6, y_usta, sirina_usta, visina_usta) // usta livo	
	tableta_vrata(img, glava_x + glava_radius/6, y_usta, sirina_usta, visina_usta) // usta desno
	tableta_vrata(img, glava_x, y_usta + visina_usta*2, sirina_usta, visina_usta) // usta sredina	
	tableta_vrata(img, glava_x - glava_radius/6, y_usta + visina_usta*2, sirina_usta, visina_usta) // usta livo	
	tableta_vrata(img, glava_x + glava_radius/6, y_usta + visina_usta*2, sirina_usta, visina_usta) // usta desno	
}
function muva(img, glava_x, glava_y, glava_radius) {
	visina = random(glava_radius*0.2, glava_radius*0.7)
	sirina_brada = glava_radius*0.7
	visina_brada = sirina_brada*0.3
	y_brada = glava_y + glava_radius/2 + visina*0.4;
	sirina_oko = glava_radius/6
	visina_oko = random(sirina_oko*1.0, sirina_oko*2.0)
	sirina_usta = glava_radius/10
	visina_usta = sirina_usta*1.5
	y_usta = y_brada
	sirina_nos = glava_radius/12;
	y_nos = y_brada - visina_brada * 2.0
	sirina_uvo = glava_radius/10;
	visina_uvo = sirina_uvo*3;
	x_uvo = glava_radius/2 + sirina_uvo/2
	xxx(img, glava_x, glava_y - glava_radius * 0.99 - visina/2, glava_radius*0.20)
	xxx(img, glava_x, glava_y - glava_radius * 0.8 - visina/2, glava_radius*0.40)
	xxx(img, glava_x, glava_y - glava_radius * 0.6 - visina/2, glava_radius*0.60)
	tableta(img, glava_x, glava_y, glava_radius, visina) 
	tableta(img, glava_x - x_uvo, glava_y, sirina_uvo, visina_uvo) // uvo livo	
	tableta(img, glava_x - x_uvo - x_uvo*0.15, glava_y, sirina_uvo, visina_uvo/3) // uvo livo		
	tableta(img, glava_x + x_uvo, glava_y, sirina_uvo, visina_uvo) // uvo desno		
	tableta(img, glava_x + x_uvo + x_uvo*0.15, glava_y, sirina_uvo, visina_uvo/3) // uvo desno	
	tableta(img, glava_x - glava_radius/3, glava_y, sirina_oko*2.5, visina_oko*1.5) // oko livo		
	tableta_vrata(img, glava_x - glava_radius/3, glava_y, sirina_oko, visina_oko) // oko livo	
	tableta(img, glava_x + glava_radius/3, glava_y, sirina_oko*2.5, visina_oko*1.5) // oko desno
	tableta_vrata(img, glava_x + glava_radius/3, glava_y, sirina_oko, visina_oko) // oko desno
	tableta(img, glava_x, y_brada, sirina_brada, visina_brada) // brada	
	tableta(img, glava_x - glava_radius/14, y_nos, sirina_nos*1.5, 0) // nos livo	
	tableta_vrata(img, glava_x - glava_radius/14, y_nos, sirina_nos, 0) // nos livo	
	tableta(img, glava_x + glava_radius/14, y_nos, sirina_nos*1.5, 0) // nos desno
	tableta_vrata(img, glava_x + glava_radius/14, y_nos, sirina_nos, 0) // nos desno
	tableta_vrata(img, glava_x, y_usta, sirina_usta, visina_usta) // usta sredina	
	tableta_vrata(img, glava_x - glava_radius/6, y_usta, sirina_usta, visina_usta) // usta livo	
	tableta_vrata(img, glava_x + glava_radius/6, y_usta, sirina_usta, visina_usta) // usta desno
	tableta_vrata(img, glava_x, y_usta + visina_usta*2, sirina_usta, visina_usta) // usta sredina	
	tableta_vrata(img, glava_x - glava_radius/6, y_usta + visina_usta*2, sirina_usta, visina_usta) // usta livo	
	tableta_vrata(img, glava_x + glava_radius/6, y_usta + visina_usta*2, sirina_usta, visina_usta) // usta desno	
}
function gas_usi(img, glava_x, glava_y, glava_radius) {
	visina = random(glava_radius*0.1, glava_radius*0.7)
	sirina_brada = glava_radius*0.7
	visina_brada = sirina_brada*0.3
	y_brada = glava_y + glava_radius/2 + visina*0.4;
	sirina_oko = glava_radius/4
	visina_oko = random(sirina_oko*1.0, sirina_oko*1.0)
	y_oko = glava_y - visina*0.35
	sirina_usta = glava_radius/13
	visina_usta = sirina_usta*0.0
	y_usta = y_brada - visina_brada * 1.2
	sirina_uvo = glava_radius/5;
	visina_uvo = sirina_uvo*7;
	x_uvo = glava_radius/2 + sirina_uvo/2
	y_uvo = glava_y - random(visina*0.15, visina*0.45) + visina_uvo/2
	tableta(img, glava_x, glava_y, glava_radius, visina) 
	xxx(img, glava_x - glava_radius/5, y_oko, sirina_oko*1.5) // oko livo	
	sss(img, glava_x - glava_radius/5, y_oko, sirina_oko) // oko livo	
	xxx(img, glava_x + glava_radius/5, y_oko, sirina_oko*1.5) // oko desno	
	sss(img, glava_x + glava_radius/5, y_oko, sirina_oko) // oko desno	
	xxx(img, glava_x, y_usta, glava_radius*0.75)	
	tableta(img, glava_x - x_uvo, y_uvo, sirina_uvo, visina_uvo) // uvo livo	
	tableta(img, glava_x + x_uvo, y_uvo, sirina_uvo, visina_uvo) // uvo desno		
	tableta_vrata(img, glava_x, y_usta - sirina_usta*2.5, sirina_usta, visina_usta) // usta sredina	
	tableta_vrata(img, glava_x - glava_radius/6, y_usta - sirina_usta*1.4, sirina_usta, visina_usta) // usta livo
	tableta_vrata(img, glava_x - glava_radius/5, y_usta + sirina_usta*1.5, sirina_usta, visina_usta) // usta livo		
	tableta_vrata(img, glava_x + glava_radius/6, y_usta + sirina_usta*1.4, sirina_usta, visina_usta) // usta desno
	tableta_vrata(img, glava_x + glava_radius/5, y_usta - + sirina_usta*1.5, sirina_usta, visina_usta) // usta desno
	tableta_vrata(img, glava_x, y_usta + sirina_usta*2.5, sirina_usta, visina_usta) // usta sredina	
}
function gas(img, glava_x, glava_y, glava_radius) {
	visina = random(glava_radius*0.3, glava_radius*0.9)
	sirina_brada = glava_radius*0.7
	visina_brada = sirina_brada*0.3
	y_brada = glava_y + glava_radius/2 + visina*0.4;
	sirina_oko = glava_radius/4
	visina_oko = random(sirina_oko*0.0, sirina_oko*0.0)
	y_oko = glava_y - visina*0.35
	sirina_usta = glava_radius/13
	visina_usta = sirina_usta*0.0
	y_usta = y_brada - visina_brada * 1.2
	sirina_uvo = glava_radius/10;
	visina_uvo = sirina_uvo*8;
	x_uvo = glava_radius/2 + sirina_uvo/2
	y_uvo = glava_y - random(visina*0.15, visina*0.45)
	tableta(img, glava_x, glava_y, glava_radius, visina) 
	xxx(img, glava_x - glava_radius/5, y_oko, sirina_oko*1.5) // oko livo	
	sss(img, glava_x - glava_radius/5, y_oko, sirina_oko) // oko livo	
	xxx(img, glava_x + glava_radius/5, y_oko, sirina_oko*1.5) // oko desno	
	sss(img, glava_x + glava_radius/5, y_oko, sirina_oko) // oko desno		
	xxx(img, glava_x, y_usta, glava_radius*0.75)	
	tableta(img, glava_x - x_uvo, y_uvo, sirina_uvo, visina_uvo) // uvo livo	
	tableta(img, glava_x - x_uvo - x_uvo*0.15, y_uvo, sirina_uvo, visina_uvo/3) // uvo livo		
	tableta(img, glava_x + x_uvo, y_uvo, sirina_uvo, visina_uvo) // uvo desno		
	tableta(img, glava_x + x_uvo + x_uvo*0.15, y_uvo, sirina_uvo, visina_uvo/3) // uvo desno	
	tableta_vrata(img, glava_x, y_usta - sirina_usta*2.5, sirina_usta, visina_usta) // usta sredina	
	tableta_vrata(img, glava_x - glava_radius/6, y_usta - sirina_usta*1.4, sirina_usta, visina_usta) // usta livo
	tableta_vrata(img, glava_x - glava_radius/5, y_usta + sirina_usta*1.5, sirina_usta, visina_usta) // usta livo		
	tableta_vrata(img, glava_x + glava_radius/6, y_usta + sirina_usta*1.4, sirina_usta, visina_usta) // usta desno
	tableta_vrata(img, glava_x + glava_radius/5, y_usta - + sirina_usta*1.5, sirina_usta, visina_usta) // usta desno
	tableta_vrata(img, glava_x, y_usta + sirina_usta*2.5, sirina_usta, visina_usta) // usta sredina	
}
function dolcevita(img, glava_x, glava_y, glava_radius) {
	visina = random(glava_radius*0.3, glava_radius*0.9)
	pomak = glava_y - glava_radius/2;
	sirina_brada = glava_radius*0.7
	visina_brada = sirina_brada*0.3
	y_brada = pomak + glava_radius/2 + visina*0.4;
	sirina_oko = glava_radius/4
	visina_oko = random(sirina_oko*1.0, sirina_oko*1.6)
	y_oko = pomak - visina*0.35
	sirina_usta = glava_radius/8
	visina_usta = sirina_usta*3.0
	y_usta = y_brada - visina_brada * 0.5
	sirina_uvo = glava_radius/10;
	visina_uvo = sirina_uvo*3;
	x_uvo = glava_radius/2 + sirina_uvo/2
	y_uvo = pomak - random(visina*0.15, visina*0.45)
	xxx(img, glava_x, pomak - glava_radius * 0.99 - visina/2, glava_radius*0.20)
	xxx(img, glava_x, pomak - glava_radius * 0.8 - visina/2, glava_radius*0.40)
	xxx(img, glava_x, pomak - glava_radius * 0.6 - visina/2, glava_radius*0.60)
	xxx(img, glava_x, pomak + glava_radius * 0.85 + visina/2, glava_radius*0.50)
	xxx(img, glava_x, pomak + glava_radius * 0.7 + visina/2, glava_radius*0.60)
	xxx(img, glava_x, pomak + glava_radius * 0.5 + visina/2, glava_radius*0.80)
	tableta(img, glava_x, pomak, glava_radius, visina) 
	tableta(img, glava_x - x_uvo, y_uvo, sirina_uvo, visina_uvo) // uvo livo	
	tableta(img, glava_x - x_uvo - x_uvo*0.15, y_uvo, sirina_uvo, visina_uvo/3) // uvo livo		
	tableta(img, glava_x + x_uvo, y_uvo, sirina_uvo, visina_uvo) // uvo desno		
	tableta(img, glava_x + x_uvo + x_uvo*0.15, y_uvo, sirina_uvo, visina_uvo/3) // uvo desno	
	tableta_vrata(img, glava_x - glava_radius/6, y_oko, sirina_oko, visina_oko) // oko livo	
	tableta_vrata(img, glava_x + glava_radius/6, y_oko, sirina_oko, visina_oko) // oko desno
	img.push()
		img.translate(glava_x, y_usta)
		img.rotate(-45)
		tableta_vrata(img, 0, 0, sirina_usta, visina_usta) // usta sredina
		img.rotate(90)
		tableta_vrata(img, 0, 0, sirina_usta, visina_usta) // usta sredina
	img.pop()
}
function antena_x(img, glava_x, glava_y, glava_radius) {
	visina = random(glava_radius*0.6, glava_radius*0.9)
	sirina_brada = glava_radius*0.7
	visina_brada = sirina_brada*0.3
	y_brada = glava_y + glava_radius/2 + visina*0.4;
	sirina_oko = glava_radius/4
	visina_oko = random(sirina_oko*1.0, sirina_oko*2.0)
	y_oko = glava_y - visina*0.35
	sirina_usta = glava_radius/8
	visina_usta = sirina_usta*3.0
	y_usta = y_brada - visina_brada * 1.2
	sirina_uvo = glava_radius/10;
	visina_uvo = sirina_uvo*3;
	x_uvo = glava_radius/2 + sirina_uvo/2
	y_uvo = glava_y - random(visina*0.15, visina*0.45)
	tableta_gore(img, glava_x, glava_y - glava_radius * 0.99 - visina/2, glava_radius/30, visina) 
	xxx(img, glava_x, glava_y - glava_radius * 0.99 - visina/2 - visina/2, glava_radius*0.15)
	xxx(img, glava_x, glava_y - glava_radius * 0.99 - visina/2, glava_radius*0.20)
	xxx(img, glava_x, glava_y - glava_radius * 0.8 - visina/2, glava_radius*0.40)
	xxx(img, glava_x, glava_y - glava_radius * 0.6 - visina/2, glava_radius*0.60)
	tableta(img, glava_x, glava_y, glava_radius, visina) 
	tableta(img, glava_x - x_uvo, y_uvo, sirina_uvo, visina_uvo) // uvo livo	
	tableta(img, glava_x - x_uvo - x_uvo*0.15, y_uvo, sirina_uvo, visina_uvo/3) // uvo livo		
	tableta(img, glava_x + x_uvo, y_uvo, sirina_uvo, visina_uvo) // uvo desno		
	tableta(img, glava_x + x_uvo + x_uvo*0.15, y_uvo, sirina_uvo, visina_uvo/3) // uvo desno	
	xxx(img, glava_x - glava_radius/5, y_oko, sirina_oko*1.4) // oko livo	
	sss(img, glava_x - glava_radius/5, y_oko, sirina_oko) // oko livo	
	xxx(img, glava_x + glava_radius/5, y_oko, sirina_oko*1.4) // oko desno
	sss(img, glava_x + glava_radius/5, y_oko, sirina_oko) // oko desno
	img.push()
		img.translate(glava_x, y_usta)
		img.rotate(-45)
		tableta_vrata(img, 0, 0, sirina_usta, visina_usta) // usta sredina
		img.rotate(90)
		tableta_vrata(img, 0, 0, sirina_usta, visina_usta) // usta sredina
	img.pop()
}
function antena(img, glava_x, glava_y, glava_radius) {
	visina = random(glava_radius*0.6, glava_radius*1.2)
	sirina_brada = glava_radius*0.7
	visina_brada = sirina_brada*0.3
	y_brada = glava_y + glava_radius/2 + visina*0.4;
	sirina_oko = glava_radius/4
	visina_oko = random(sirina_oko*1.0, sirina_oko*2.0)
	y_oko = glava_y - visina*0.35
	sirina_usta = glava_radius/13
	visina_usta = sirina_usta*6.0
	y_usta = y_brada - visina_brada * 1.2
	sirina_uvo = glava_radius/10;
	visina_uvo = sirina_uvo*3;
	x_uvo = glava_radius/2 + sirina_uvo/2
	y_uvo = glava_y - random(visina*0.15, visina*0.45)
	tableta_gore(img, glava_x, glava_y - glava_radius * 0.99 - visina/2, glava_radius/30, visina) 
	xxx(img, glava_x, glava_y - glava_radius * 0.99 - visina/2 - visina/2, glava_radius*0.15)
	xxx(img, glava_x, glava_y - glava_radius * 0.99 - visina/2, glava_radius*0.20)
	xxx(img, glava_x, glava_y - glava_radius * 0.8 - visina/2, glava_radius*0.40)
	xxx(img, glava_x, glava_y - glava_radius * 0.6 - visina/2, glava_radius*0.60)
	tableta(img, glava_x, glava_y, glava_radius, visina) 
	tableta(img, glava_x - x_uvo, y_uvo, sirina_uvo, visina_uvo) // uvo livo	
	tableta(img, glava_x - x_uvo - x_uvo*0.15, y_uvo, sirina_uvo, visina_uvo/3) // uvo livo		
	tableta(img, glava_x + x_uvo, y_uvo, sirina_uvo, visina_uvo) // uvo desno		
	tableta(img, glava_x + x_uvo + x_uvo*0.15, y_uvo, sirina_uvo, visina_uvo/3) // uvo desno	
	xxx(img, glava_x - glava_radius/4, y_oko, sirina_oko*1.8, 0) // oko livo	
	tableta_vrata(img, glava_x - glava_radius/4, y_oko, sirina_oko, 0) // oko livo	
	xxx(img, glava_x + glava_radius/4, y_oko, sirina_oko*1.8, 0) // oko desno
	tableta_vrata(img, glava_x + glava_radius/4, y_oko, sirina_oko, 0) // oko desno
	tableta_vrata(img, glava_x, y_usta, sirina_usta, visina_usta) // usta sredina	
	tableta_vrata(img, glava_x - glava_radius/8, y_usta, sirina_usta, visina_usta - random(-sirina_usta*1.0, sirina_usta*2.0)) // usta livo
	tableta_vrata(img, glava_x - glava_radius/4, y_usta, sirina_usta, visina_usta - random(-sirina_usta*1.0, sirina_usta*2.0)) // usta livo		
	tableta_vrata(img, glava_x + glava_radius/8, y_usta, sirina_usta, visina_usta - random(-sirina_usta*1.0, sirina_usta*2.0)) // usta desno
	tableta_vrata(img, glava_x + glava_radius/4, y_usta, sirina_usta, visina_usta - random(-sirina_usta*1.0, sirina_usta*2.0)) // usta desno
}
function resetka(img, glava_x, glava_y, glava_radius) {
	visina = random(glava_radius*0.2, glava_radius*0.7)
	sirina_brada = glava_radius*0.7
	visina_brada = sirina_brada*0.3
	y_brada = glava_y + glava_radius/2 + visina*0.4;
	sirina_oko = glava_radius/6
	visina_oko = random(sirina_oko*2.0, sirina_oko*4.0)
	sirina_usta = glava_radius/13
	visina_usta = sirina_usta*6.5
	y_usta = y_brada + visina_brada * 0.3
	sirina_nos = glava_radius/12;
	y_nos = y_brada - visina_brada * 2.0
	sirina_uvo = glava_radius/10;
	visina_uvo = sirina_uvo*3;
	x_uvo = glava_radius/2 + sirina_uvo/2
	xxx(img, glava_x, glava_y - glava_radius * 0.99 - visina/2, glava_radius*0.20)
	xxx(img, glava_x, glava_y - glava_radius * 0.8 - visina/2, glava_radius*0.40)
	xxx(img, glava_x, glava_y - glava_radius * 0.6 - visina/2, glava_radius*0.60)
	tableta(img, glava_x, glava_y, glava_radius, visina) 
	tableta(img, glava_x - x_uvo, glava_y, sirina_uvo, visina_uvo) // uvo livo	
	tableta(img, glava_x - x_uvo - x_uvo*0.15, glava_y, sirina_uvo, visina_uvo/3) // uvo livo		
	tableta(img, glava_x + x_uvo, glava_y, sirina_uvo, visina_uvo) // uvo desno		
	tableta(img, glava_x + x_uvo + x_uvo*0.15, glava_y, sirina_uvo, visina_uvo/3) // uvo desno	
	tableta_vrata(img, glava_x - glava_radius/6, glava_y, sirina_oko, visina_oko) // oko livo	
	tableta_vrata(img, glava_x + glava_radius/6, glava_y, sirina_oko, visina_oko) // oko desno
	tableta(img, glava_x, y_brada, sirina_brada, visina_brada) // brada	
	tableta_vrata(img, glava_x - glava_radius/14, y_nos, sirina_nos, 0) // nos livo	
	tableta_vrata(img, glava_x + glava_radius/14, y_nos, sirina_nos, 0) // nos desno
	tableta_vrata(img, glava_x, y_usta, sirina_usta, visina_usta) // usta sredina	
	tableta_vrata(img, glava_x - glava_radius/8, y_usta, sirina_usta, visina_usta) // usta livo	
	tableta_vrata(img, glava_x + glava_radius/8, y_usta, sirina_usta, visina_usta) // usta desno
}
function djecak_x(img, glava_x, glava_y, glava_radius) {
	sirina_gore = glava_radius;
	visina_gore = sirina_gore * random(0.3, 1.5);
	ddd_x = glava_x;
	ddd_y = glava_y - glava_radius/2 - visina_gore/4;
	sirina_oko = sirina_gore/5
	visina_oko = random(sirina_oko, sirina_oko*1.5)
	sirina_uvo = glava_radius/10;
	visina_uvo = sirina_uvo*3;
	x_uvo = glava_radius/2 + sirina_uvo/2
	tableta(img, glava_x - x_uvo, glava_y, sirina_uvo, visina_uvo) // uvo livo	
	tableta(img, glava_x + x_uvo, glava_y, sirina_uvo, visina_uvo) // uvo desno		
	tableta(img, ddd_x, ddd_y, random(sirina_gore/5, sirina_gore/5), sirina_gore*1) 
	tableta(img, ddd_x + sirina_gore/5, ddd_y, random(sirina_gore/5, sirina_gore/5), sirina_gore*0.8) 
	tableta(img, ddd_x + sirina_gore/5*2, ddd_y, random(sirina_gore/5, sirina_gore/5), sirina_gore*0.6) 
	tableta(img, ddd_x - sirina_gore/5, ddd_y, random(sirina_gore/5, sirina_gore/5), sirina_gore*0.8) 
	tableta(img, ddd_x - sirina_gore/5*2, ddd_y, random(sirina_gore/5, sirina_gore/5), sirina_gore*0.6) 
	tableta_dole(img, ddd_x, ddd_y, sirina_gore, visina_gore)
	img.push()
		img.translate(ddd_x, ddd_y + sirina_gore*0.65 + visina_gore/2)
		img.rotate(45)
		tableta_vrata(img, 0, 0, sirina_gore/12, sirina_gore/4) // usta
		img.rotate(-90)
		tableta_vrata(img, 0, 0, sirina_gore/12, sirina_gore/4) // usta		
	img.pop()
	tableta_vrata(img, ddd_x - sirina_gore/5, ddd_y + sirina_gore/2.5, sirina_oko, visina_oko) // oko livo	
	tableta_vrata(img, ddd_x + sirina_gore/5, ddd_y + sirina_gore/2.5, sirina_oko, visina_oko) // oko desno
}
function djecak(img, glava_x, glava_y, glava_radius) {
	sirina_gore = glava_radius;
	visina_gore = sirina_gore * random(0, 1.5);
	ddd_x = glava_x;
	ddd_y = glava_y - glava_radius/2 - visina_gore/4;
	sirina_uvo = glava_radius/10;
	visina_uvo = sirina_uvo*3;
	x_uvo = glava_radius/2 + sirina_uvo/2
	visina_friz = sirina_gore*random(1,2);
	tableta(img, glava_x - x_uvo, glava_y, sirina_uvo, visina_uvo) // uvo livo	
	tableta(img, glava_x - x_uvo - x_uvo*0.15, glava_y, sirina_uvo, visina_uvo/3) // uvo livo		
	tableta(img, glava_x + x_uvo, glava_y, sirina_uvo, visina_uvo) // uvo desno		
	tableta(img, glava_x + x_uvo + x_uvo*0.15, glava_y, sirina_uvo, visina_uvo/3) // uvo desno
	tableta(img, ddd_x, ddd_y, random(sirina_gore/5, sirina_gore/5), sirina_gore*1) 
	tableta(img, ddd_x + sirina_gore/5, ddd_y, random(sirina_gore/5, sirina_gore/5), visina_friz*0.8) 
	tableta(img, ddd_x + sirina_gore/5*2, ddd_y, random(sirina_gore/5, sirina_gore/5), visina_friz*0.6) 
	tableta(img, ddd_x - sirina_gore/5, ddd_y, random(sirina_gore/5, sirina_gore/5), visina_friz*0.8) 
	tableta(img, ddd_x - sirina_gore/5*2, ddd_y, random(sirina_gore/5, sirina_gore/5), visina_friz*0.6) 
	tableta_dole(img, ddd_x, ddd_y, sirina_gore, visina_gore)
	tableta_vrata(img, ddd_x, ddd_y + sirina_gore*0.8 + visina_gore/2, sirina_gore/7, 0) // usta
	tableta_vrata(img, ddd_x - sirina_gore/5, ddd_y + sirina_gore/2.5, sirina_gore/5, sirina_gore/5) // oko livo	
	tableta_vrata(img, ddd_x + sirina_gore/5, ddd_y + sirina_gore/2.5, sirina_gore/5, sirina_gore/5) // oko desno
}
function maska(img, glava_x, glava_y, glava_radius) {
	visina = random(glava_radius*0.6, glava_radius*1.2)
	sirina_brada = glava_radius*0.2
	visina_brada = sirina_brada*0.3
	y_brada = glava_y + glava_radius/2 + visina*0.4;
	sirina_oko = glava_radius/4
	visina_oko = random(sirina_oko*1.0, sirina_oko*2.0)
	y_oko = glava_y - visina*0.35
	sirina_usta = glava_radius/5
	visina_usta = sirina_usta*3.0
	y_usta = glava_y + sirina_usta*2
	sirina_uvo = glava_radius/10;
	visina_uvo = sirina_uvo*18;
	x_uvo = glava_radius/2 + sirina_uvo/2
	y_uvo = glava_y - random(visina*0.15, visina*0.15)
	tableta_gore(img, glava_x, glava_y, glava_radius, visina) 
	tableta(img, glava_x - x_uvo, y_uvo, sirina_uvo, visina_uvo) // uvo livo	
	tableta(img, glava_x - x_uvo - x_uvo*0.15, y_uvo, sirina_uvo, visina_uvo/5) // uvo livo		
	tableta(img, glava_x + x_uvo, y_uvo, sirina_uvo, visina_uvo) // uvo desno		
	tableta(img, glava_x + x_uvo + x_uvo*0.15, y_uvo, sirina_uvo, visina_uvo/5) // uvo desno	
	tableta_dole(img, glava_x, glava_y, glava_radius*0.8, 0) 
	xxx(img, glava_x - glava_radius/4, y_oko, sirina_oko*1.8, 0) // oko livo	
	sss(img, glava_x - glava_radius/4, y_oko, sirina_oko) // oko livo	
	xxx(img, glava_x + glava_radius/4, y_oko, sirina_oko*1.8, 0) // oko desno
	sss(img, glava_x + glava_radius/4, y_oko, sirina_oko) // oko desno
	xxx(img, glava_x, y_usta, sirina_usta*1.8) // usta
	sss(img, glava_x, y_usta, sirina_usta) // usta
}
function sljem(img, glava_x, glava_y, glava_radius) {
	visina = random(glava_radius*0.6, glava_radius*1.2)
	sirina_brada = glava_radius*0.7
	visina_brada = sirina_brada*0.3
	y_brada = glava_y + glava_radius/2 + visina*0.4;
	sirina_oko = glava_radius/4
	visina_oko = random(sirina_oko*1.0, sirina_oko*2.0)
	y_oko = glava_y - visina*0.45
	sirina_usta = glava_radius/13
	visina_usta = sirina_usta*1.5
	y_usta = y_brada - visina_brada * 2.5
	sirina_uvo = glava_radius/10;
	visina_uvo = sirina_uvo*3;
	x_uvo = glava_radius/2 + sirina_uvo/2
	y_uvo = glava_y - random(visina*0.15, visina*0.45)
	tableta_gore(img, glava_x, glava_y, glava_radius, visina) 
	tableta_dole(img, glava_x, glava_y-glava_radius*0.01, glava_radius, 0) 
	tableta(img, glava_x - x_uvo, y_uvo, sirina_uvo, visina_uvo) // uvo livo	
	tableta(img, glava_x - x_uvo - x_uvo*0.15, y_uvo, sirina_uvo, visina_uvo/3) // uvo livo		
	tableta(img, glava_x + x_uvo, y_uvo, sirina_uvo, visina_uvo) // uvo desno		
	tableta(img, glava_x + x_uvo + x_uvo*0.15, y_uvo, sirina_uvo, visina_uvo/3) // uvo desno	
	xxx(img, glava_x - glava_radius/4, y_oko, sirina_oko*1.8, 0) // oko livo	
	sss(img, glava_x - glava_radius/4, y_oko, sirina_oko) // oko livo	
	xxx(img, glava_x + glava_radius/4, y_oko, sirina_oko*1.8, 0) // oko desno
	sss(img, glava_x + glava_radius/4, y_oko, sirina_oko) // oko desno
	tableta_vrata(img, glava_x, y_usta, sirina_usta, visina_usta) // usta sredina	
	tableta_vrata(img, glava_x - glava_radius/8, y_usta, sirina_usta, visina_usta - random(-sirina_usta*1.0, sirina_usta*1.0)) // usta livo
	tableta_vrata(img, glava_x - glava_radius/4, y_usta, sirina_usta, visina_usta - random(-sirina_usta*1.0, sirina_usta*1.0)) // usta livo		
	tableta_vrata(img, glava_x + glava_radius/8, y_usta, sirina_usta, visina_usta - random(-sirina_usta*1.0, sirina_usta*1.0)) // usta desno
	tableta_vrata(img, glava_x + glava_radius/4, y_usta, sirina_usta, visina_usta - random(-sirina_usta*1.0, sirina_usta*1.0)) // usta desno
	tableta_gore(img, glava_x, glava_y-glava_radius*0.4, glava_radius*random(1.3, 1.3), 0) // sljem
}
function kostur(img, glava_x, glava_y, glava_radius) {
	ddd_x = glava_x;
	ddd_y = glava_y;
	sirina_gore = glava_radius;
	visina_gore = sirina_gore * random(0,2);
	odmak = sirina_gore/random(3,4);	
	sirina_dole = sirina_gore * random(0.5,0.8);
	visina_dole = sirina_dole * random(0,0);
	for (var i = ddd_x - sirina_gore*0.38; i < ddd_x + sirina_gore*0.40; i+=sirina_gore/random(6,10)) {
		if (random() < 0.85) {
			img.push()
				img.translate(i, ddd_y)
				img.rotate(random(-6,6))
				tableta(img, 0, 0, random(sirina_gore/12, sirina_gore/10), random(odmak/20, odmak/4)) // zubi gore
			img.pop()
		}
	}  
	for (var i = ddd_x - sirina_dole*0.4; i < ddd_x + sirina_dole*0.45; i+=sirina_dole/8) {
		if (random() < 0.85) {
			img.push()
				img.translate(i, ddd_y+odmak)
				img.rotate(random(-6,6))			
				tableta(img, 0, 0, random(sirina_dole/12, sirina_dole/8), random(odmak/20, odmak/2)) // zubi dole 
			img.pop()
		}
	}  
	tableta_gore(img, ddd_x, ddd_y, sirina_gore, visina_gore)
	tableta_vrata(img, ddd_x - sirina_gore/23, ddd_y - sirina_gore/6, sirina_gore/20, sirina_gore/10) // nos desno
	tableta_vrata(img, ddd_x + sirina_gore/23, ddd_y - sirina_gore/6, sirina_gore/20, sirina_gore/10) // nos livo
	tableta_vrata(img, ddd_x - sirina_gore/7, ddd_y - sirina_gore/2, sirina_gore/5, sirina_gore/5) // oko livo	
	tableta_vrata(img, ddd_x + sirina_gore/7, ddd_y - sirina_gore/2, sirina_gore/5, sirina_gore/5) // oko desno
	tableta_dole(img, ddd_x, ddd_y+odmak, sirina_dole, visina_dole)
}
function svjetlo_tableta(img, cx, cy, r, uvis) {
	let minSize = min(koboljkaWidth, koboljkaHeight); 
	koliki_polumjesec_global = 2*random_polumjesec[0]; 
	koliki_rect_global = r/150*random_polumjesec[0];
	koliki_polumjesec_mjesec = 2*random_polumjesec[1]; 
	koliki_rect_mjesec = r/150*random_polumjesec[1];
	koliki_polumjesec_sunce = 2*random_polumjesec[2];
	koliki_rect_sunce = r/150*random_polumjesec[2];	
	jacina_global = dist(cx,cy, global_x, global_y)
	prozirnost_global = 0;
	jacina_mjesec = dist(cx,cy, mjesec_x, mjesec_y)
	prozirnost_mjesec = map(random_polumjesec[17], jacina_mjesec * random_polumjesec[7], jacina_mjesec * random_polumjesec[8], random_polumjesec[9], random_polumjesec[10]);	
	jacina_sunce = dist(cx,cy, sunce_x, sunce_y)
	prozirnost_sunce = map(random_polumjesec[18], jacina_sunce * random_polumjesec[11], jacina_sunce * random_polumjesec[12], random_polumjesec[13], random_polumjesec[14])		
}	
function tableta(img, cx, cy, r, uvis) {
	let minSize = min(koboljkaWidth, koboljkaHeight); 
	visina = r/2 + uvis;
	boja_tableta =  boja_robot;
	svjetlo_tableta(img, cx, cy, r, uvis) 
	xxx(img, cx, cy - visina/2 - r * random_sjaj[0], r)
	xxx(img, cx, cy + visina/2 + r * random_sjaj[0], r)
	img.noStroke()
	img.fill(hue(boja_tableta), saturation(boja_tableta), brightness(boja_tableta), 100)
	img.ellipse(cx, cy-visina/2, r);
	img.ellipse(cx, cy+visina/2, r);
	if (global_x < cx) {   
		global_map = map(global_x, 0, cx, koliki_polumjesec_global*koboljkaWidth/600, 0)
		} else {  
		global_map = map(global_x, cx, koboljkaWidth, 0, koliki_polumjesec_global*koboljkaWidth/600)
	}     
	if (mjesec_x < cx) {   
		mjesec_map = map(mjesec_x, 0, cx, koliki_polumjesec_mjesec*koboljkaWidth/600,0)
		} else {  
		mjesec_map = map(mjesec_x, cx, koboljkaWidth, 0, koliki_polumjesec_mjesec*koboljkaWidth/600)
	}     
 	if (sunce_x < cx) {   
		sunce_map = map(sunce_x, 0, cx, koliki_polumjesec_sunce*koboljkaWidth/600, 0) 
		} else {  
		sunce_map = map(sunce_x, cx, koboljkaWidth, 0, koliki_polumjesec_sunce*koboljkaWidth/600) 
	}   
	var xdiv_global = map(global_map, 0, koboljkaWidth/2, 1, -1, true); // 150 je pola 
	var xdiv_mjesec = map(mjesec_map, 0, koboljkaWidth/2, 1, -1, true); // 150 je pola
	var xdiv_sunce = map(sunce_map, 0, koboljkaWidth/2, 1, -1, true); // 150 je pola
	img.fill(hue(boja_global), saturation(boja_global), brightness(boja_global), prozirnost_global);  
	if (global_x < cx) {   
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(0)
			polumjesec_www(img,0, 0, r, xdiv_global); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(0)
			polumjesec_www(img,0, 0, r, xdiv_global); 
		img.pop()   
		} else {  
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(180)
			polumjesec_www(img,0, 0, r, xdiv_global); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(180)
			polumjesec_www(img,0, 0, r, xdiv_global); 
		img.pop()      
	}       
	img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), prozirnost_mjesec);
	if (mjesec_x < cx) {   
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(0)
			polumjesec_www(img,0, 0, r, xdiv_mjesec); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(0)
			polumjesec_www(img,0, 0, r, xdiv_mjesec); 
		img.pop()   
		} else {  
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(180)
			polumjesec_www(img,0, 0, r, xdiv_mjesec); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(180)
			polumjesec_www(img,0, 0, r, xdiv_mjesec); 
		img.pop()      
	}       
	img.fill(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), prozirnost_sunce);
	if (sunce_x < cx) {   
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(0)
			polumjesec_www(img,0, 0, r, xdiv_sunce); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(0)
			polumjesec_www(img,0, 0, r, xdiv_sunce); 
		img.pop()   
		} else {  
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(180)
			polumjesec_www(img,0, 0, r, xdiv_sunce); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(180)
			polumjesec_www(img,0, 0, r, xdiv_sunce); 
		img.pop()      
	}    
	img.rectMode(CENTER);
	img.fill(hue(boja_tableta), saturation(boja_tableta), brightness(boja_tableta), 100);	
	img.rect(cx, cy, r, visina) 
	img.fill(hue(boja_global), saturation(boja_global), brightness(boja_global), prozirnost_global);
	if (global_x < cx) {   
		kocka_svjetlo = map(global_x, cx, 0, 0, koliki_rect_global)
		img.rect(cx-(r-kocka_svjetlo)/2, cy, kocka_svjetlo, visina)
		} else {  
		kocka_svjetlo = map(global_x, koboljkaWidth, cx, koliki_rect_global, 0)
		img.rect(cx+(r-kocka_svjetlo)/2, cy, kocka_svjetlo, visina)  
	}    
	img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), prozirnost_mjesec);
	if (mjesec_x < cx) {   
		kocka_svjetlo = map(mjesec_x, cx, 0, 0, koliki_rect_mjesec)
		img.rect(cx-(r-kocka_svjetlo)/2, cy, kocka_svjetlo, visina)
		} else {  
		kocka_svjetlo = map(mjesec_x, koboljkaWidth, cx, koliki_rect_mjesec, 0)
		img.rect(cx+(r-kocka_svjetlo)/2, cy, kocka_svjetlo, visina)  
	}  
	img.fill(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), prozirnost_sunce);
	if (sunce_x < cx) {   
		kocka_svjetlo = map(sunce_x, cx, 0, 0, koliki_rect_sunce)
		img.rect(cx-(r-kocka_svjetlo)/2, cy, kocka_svjetlo, visina)
	} else {  
		kocka_svjetlo = map(sunce_x, koboljkaWidth, cx, koliki_rect_sunce, 0) 
		img.rect(cx+(r-kocka_svjetlo)/2, cy, kocka_svjetlo, visina)  
	}
}
function tableta_kocka(img, cx, cy, r, uvis) {
	let minSize = min(koboljkaWidth, koboljkaHeight); 
	visina = uvis;
	svjetlo_tableta(img, cx, cy, r, uvis) 
	border_radius = minSize/100;
	img.noStroke()
	img.fill(boja_robot);
	img.rectMode(CENTER);
	img.fill(hue(boja_robot), saturation(boja_robot), brightness(boja_robot), 100);
	img.rect(cx, cy, r, visina, border_radius) 
	img.fill(hue(boja_global), saturation(boja_global), brightness(boja_global), prozirnost_global);
	if (global_x < cx) {   
		kocka_svjetlo = map(global_x, cx, 0, 0, koliki_rect_global)
		img.rect(cx-(r-kocka_svjetlo)/2, cy, kocka_svjetlo, visina, border_radius)
		} else {  
		kocka_svjetlo = map(global_x, koboljkaWidth, cx, koliki_rect_global, 0)
		img.rect(cx+(r-kocka_svjetlo)/2, cy, kocka_svjetlo, visina, border_radius)  
	}    
	img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), prozirnost_mjesec);
	if (mjesec_x < cx) {   
		kocka_svjetlo = map(mjesec_x, cx, 0, 0, koliki_rect_mjesec)
		img.rect(cx-(r-kocka_svjetlo)/2, cy, kocka_svjetlo, visina, border_radius)
		} else {  
		kocka_svjetlo = map(mjesec_x, koboljkaWidth, cx, koliki_rect_mjesec, 0)
		img.rect(cx+(r-kocka_svjetlo)/2, cy, kocka_svjetlo, visina, border_radius)  
	}  
	img.fill(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), prozirnost_sunce);
	if (sunce_x < cx) {   
		kocka_svjetlo = map(sunce_x, cx, 0, 0, koliki_rect_sunce) 
		img.rect(cx-(r-kocka_svjetlo)/2, cy, kocka_svjetlo, visina, border_radius)
	} else {  
		kocka_svjetlo = map(sunce_x, koboljkaWidth, cx, koliki_rect_sunce, 0) 
		img.rect(cx+(r-kocka_svjetlo)/2, cy, kocka_svjetlo, visina, border_radius)  
	}
}
function tableta_gore(img, cx, cy, r, visina2) {
	let minSize = min(koboljkaWidth, koboljkaHeight); 
	visina = r + visina2
	svjetlo_tableta(img, cx, cy, r, visina2) 
	xxx(img, cx, cy - visina/2 - r * random_sjaj[0], r)
	img.noStroke()
	img.fill(boja_robot);
	img.ellipse(cx, cy-visina/2, r);
	if (global_x < cx) {   
		global_map = map(global_x, 0, cx, koliki_polumjesec_global * koboljkaWidth/600, 0)
		} else {  
		global_map = map(global_x, cx, koboljkaWidth, 0, koliki_polumjesec_global * koboljkaWidth/600)
	}     
	if (mjesec_x < cx) {   
		mjesec_map = map(mjesec_x, 0, cx, koliki_polumjesec_mjesec * koboljkaWidth/600,0)
		} else {  
		mjesec_map = map(mjesec_x, cx, koboljkaWidth, 0, koliki_polumjesec_mjesec * koboljkaWidth/600)
	}     
	if (sunce_x < cx) {   
		sunce_map = map(sunce_x, 0, cx, koliki_polumjesec_sunce * koboljkaWidth/600,0)
		} else {  
		sunce_map = map(sunce_x, cx, koboljkaWidth, 0, koliki_polumjesec_sunce * koboljkaWidth/600)
	}     
	var xdiv_mjesec = map(mjesec_map, 0, koboljkaWidth/2, 1, -1, true);
	var xdiv_global = map(global_map, 0, koboljkaWidth/2, 1, -1, true); 
	var xdiv_sunce = map(sunce_map, 0, koboljkaWidth/2, 1, -1, true); 	
	img.fill(hue(boja_global), saturation(boja_global), brightness(boja_global), prozirnost_global);  
	if (global_x < cx) {   
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(0)
			polumjesec_www(img,0, 0, r, xdiv_global); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(0)
			//polumjesec_www(img,0, 0, r, xdiv_global); 
		img.pop()   
		} else {  
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(180)
			polumjesec_www(img,0, 0, r, xdiv_global); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(180)
			//polumjesec_www(img,0, 0, r, xdiv_global); 
		img.pop()      
	}       
	img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), prozirnost_mjesec);
	if (mjesec_x < cx) {   
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(0)
			polumjesec_www(img,0, 0, r, xdiv_mjesec); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(0)
			//polumjesec_www(img,0, 0, r, xdiv_mjesec); 
		img.pop()   
		} else {  
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(180)
			polumjesec_www(img,0, 0, r, xdiv_mjesec); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(180)
			//polumjesec_www(img,0, 0, r, xdiv_mjesec); 
		img.pop()      
	}       
	img.fill(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), prozirnost_sunce);
	if (sunce_x < cx) {   
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(0)
			polumjesec_www(img,0, 0, r, xdiv_sunce); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(0)
			//polumjesec_www(img,0, 0, r, xdiv_sunce); 
		img.pop()   
		} else {  
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(180)
			polumjesec_www(img,0, 0, r, xdiv_sunce); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(180)
			//polumjesec_www(img,0, 0, r, xdiv_sunce); 
		img.pop()      
	}    
	img.rectMode(CENTER);
	img.fill(hue(boja_robot), saturation(boja_robot), brightness(boja_robot), 100);
	img.push()
	img.beginShape();
		img.vertex(cx, cy);  
		img.vertex(cx-r/2, cy); 
 		img.vertex(cx-r/2, cy-visina/2); 
 		img.vertex(cx+r/2, cy-visina/2); 
		img.vertex(cx+r/2, cy); 
	img.endShape(CLOSE);  
	img.pop()
	img.fill(hue(boja_global), saturation(boja_global), brightness(boja_global), prozirnost_global);
	if (global_x < cx) {   
		kocka_svjetlo = map(global_x, cx, 0, 0, koliki_rect_global)
		img.rect(cx-(r-kocka_svjetlo)/2, cy-r/4-visina2/4, kocka_svjetlo, visina/2)
		} else {  
		kocka_svjetlo = map(global_x, koboljkaWidth, cx, koliki_rect_global, 0)
		img.rect(cx+(r-kocka_svjetlo)/2, cy-r/4-visina2/4, kocka_svjetlo, visina/2)  
	}    
	img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), prozirnost_mjesec);
	if (mjesec_x < cx) {   
		kocka_svjetlo = map(mjesec_x, cx, 0, 0, koliki_rect_mjesec)
		img.rect(cx-(r-kocka_svjetlo)/2, cy-r/4-visina2/4, kocka_svjetlo, visina/2)
		} else {  
		kocka_svjetlo = map(mjesec_x, koboljkaWidth, cx, koliki_rect_mjesec, 0)
		img.rect(cx+(r-kocka_svjetlo)/2, cy-r/4-visina2/4, kocka_svjetlo, visina/2)  
	}  
	img.fill(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), prozirnost_sunce);
	if (sunce_x < cx) {   
		kocka_svjetlo = map(sunce_x, cx, 0, 0, koliki_rect_sunce)
		img.rect(cx-(r-kocka_svjetlo)/2, cy-r/4-visina2/4, kocka_svjetlo, visina/2)
		} else {  
		kocka_svjetlo = map(sunce_x, koboljkaWidth, cx, koliki_rect_sunce, 0)
		img.rect(cx+(r-kocka_svjetlo)/2, cy-r/4-visina2/4, kocka_svjetlo, visina/2)  
	}  
}
function tableta_dole(img, cx, cy, r, visina2) {
	let minSize = min(koboljkaWidth, koboljkaHeight); 
	visina = r + visina2
	svjetlo_tableta(img, cx, cy, r, visina2) 
	xxx(img, cx, cy + visina/2 + r * random_sjaj[0], r)
	img.noStroke()
	img.fill(boja_robot);
	img.ellipse(cx, cy+visina/2, r);
	if (global_x < cx) {   
		global_map = map(global_x, 0, cx, koliki_polumjesec_global*koboljkaWidth/600, 0)
		} else {  
		global_map = map(global_x, cx, koboljkaWidth, 0, koliki_polumjesec_global*koboljkaWidth/600)
	}     
	if (mjesec_x < cx) {   
		mjesec_map = map(mjesec_x, 0, cx, koliki_polumjesec_mjesec*koboljkaWidth/600,0)
		} else {  
		mjesec_map = map(mjesec_x, cx, koboljkaWidth, 0, koliki_polumjesec_mjesec*koboljkaWidth/600)
	}     
	if (sunce_x < cx) {   
		sunce_map = map(sunce_x, 0, cx, koliki_polumjesec_sunce*koboljkaWidth/600,0)
		} else {  
		sunce_map = map(sunce_x, cx, koboljkaWidth, 0, koliki_polumjesec_sunce*koboljkaWidth/600)
	}     
	var xdiv_mjesec = map(mjesec_map, 0, koboljkaWidth/2, 1, -1, true); 
	var xdiv_global = map(global_map, 0, koboljkaWidth/2, 1, -1, true); 
	var xdiv_sunce = map(sunce_map, 0, koboljkaWidth/2, 1, -1, true); 	
	img.fill(hue(boja_global), saturation(boja_global), brightness(boja_global), prozirnost_global);  
	if (global_x < cx) {   
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(0)
			//polumjesec_www(img,0, 0, r, xdiv_global); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(0)
			polumjesec_www(img,0, 0, r, xdiv_global); 
		img.pop()   
		} else {  
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(180)
			//polumjesec_www(img,0, 0, r, xdiv_global); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(180)
			polumjesec_www(img,0, 0, r, xdiv_global); 
		img.pop()      
	}       
	img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), prozirnost_mjesec);
	if (mjesec_x < cx) {   
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(0)
			//polumjesec_www(img,0, 0, r, xdiv_mjesec); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(0)
			polumjesec_www(img,0, 0, r, xdiv_mjesec); 
		img.pop()   
		} else {  
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(180)
			//polumjesec_www(img,0, 0, r, xdiv_mjesec); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(180)
			polumjesec_www(img,0, 0, r, xdiv_mjesec); 
		img.pop()      
	}       
	img.fill(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), prozirnost_sunce);
	if (sunce_x < cx) {   
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(0)
			//polumjesec_www(img,0, 0, r, xdiv_sunce); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(0)
			polumjesec_www(img,0, 0, r, xdiv_sunce); 
		img.pop()   
		} else {  
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(180)
			//polumjesec_www(img,0, 0, r, xdiv_sunce); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(180)
			polumjesec_www(img,0, 0, r, xdiv_sunce); 
		img.pop()      
	}    
	img.rectMode(CENTER);
	img.fill(hue(boja_robot), saturation(boja_robot), brightness(boja_robot), 100);
	img.push()
	img.beginShape();
		img.vertex(cx, cy);  
		img.vertex(cx+r/2, cy); 
 		img.vertex(cx+r/2, cy+visina/2); 
 		img.vertex(cx-r/2, cy+visina/2); 
		img.vertex(cx-r/2, cy); 
	img.endShape(CLOSE);  
	img.pop()
	img.fill(hue(boja_global), saturation(boja_global), brightness(boja_global), prozirnost_global);
	if (global_x < cx) {   
		kocka_svjetlo = map(global_x, cx, 0, 0, koliki_rect_global)
		img.rect(cx-(r-kocka_svjetlo)/2, cy+r/4+visina2/4, kocka_svjetlo, visina/2)
		} else {  
		kocka_svjetlo = map(global_x, koboljkaWidth, cx, koliki_rect_global, 0)
		img.rect(cx+(r-kocka_svjetlo)/2, cy+r/4+visina2/4, kocka_svjetlo, visina/2)  
	}    
	img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), prozirnost_mjesec);
	if (mjesec_x < cx) {   
		kocka_svjetlo = map(mjesec_x, cx, 0, 0, koliki_rect_mjesec)
		img.rect(cx-(r-kocka_svjetlo)/2, cy+r/4+visina2/4, kocka_svjetlo, visina/2)
		} else {  
		kocka_svjetlo = map(mjesec_x, koboljkaWidth, cx, koliki_rect_mjesec, 0)
		img.rect(cx+(r-kocka_svjetlo)/2, cy+r/4+visina2/4, kocka_svjetlo, visina/2)  
	}  
	img.fill(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), prozirnost_sunce);
	if (sunce_x < cx) {   
		kocka_svjetlo = map(sunce_x, cx, 0, 0, koliki_rect_sunce)
		img.rect(cx-(r-kocka_svjetlo)/2, cy+r/4+visina2/4, kocka_svjetlo, visina/2)
		} else {  
		kocka_svjetlo = map(sunce_x, koboljkaWidth, cx, koliki_rect_sunce, 0)
		img.rect(cx+(r-kocka_svjetlo)/2, cy+r/4+visina2/4, kocka_svjetlo, visina/2)  
	}  
}
function tableta_vrata_broj(img, cx, cy, r, visina, postotak, neon) {
	let minSize = min(koboljkaWidth, koboljkaHeight); 
	lampice_boja_neon = boja_zjenica; 
	lampice_boja = boja_sunce; 
	u_odnosu_na_sta = koboljkaWidth/2;
	rupa = 80; 
	if (random() < postotak) { 
		rupa = 0; 
	}
	prozirnost = 80; 
	upaljena_svjetla = random(-10,10) 
	img.noStroke()
	if (neon == 1) {   
		img.fill(hue(lampice_boja_neon), saturation(lampice_boja_neon), brightness(lampice_boja_neon) - rupa + upaljena_svjetla, 100); 
	} else { 
		img.fill(hue(lampice_boja), saturation(lampice_boja), brightness(lampice_boja) - rupa + upaljena_svjetla, 100); 
	}   	
	img.ellipse(cx, cy-visina/2, r);
	img.ellipse(cx, cy+visina/2, r);
	if (u_odnosu_na_sta < cx) {   
		mjesec_map = map(u_odnosu_na_sta, 0, cx, 50*koboljkaWidth/400, 0)
		} else {  
		mjesec_map = map(u_odnosu_na_sta, cx, koboljkaWidth, 0, 50*koboljkaWidth/400)
	}     
	var xdiv_mjesec = map(mjesec_map, 0, koboljkaWidth/2, 1, -1, true); // 150 je pola
	if (neon == 1) {   
		img.fill(hue(lampice_boja_neon), saturation(lampice_boja_neon), brightness(lampice_boja_neon) - prozirnost, 100);   
		img.stroke(hue(lampice_boja_neon), saturation(lampice_boja_neon), brightness(lampice_boja_neon) - prozirnost, 100); 		
	} else { 
		img.fill(hue(lampice_boja), saturation(lampice_boja), brightness(lampice_boja) - prozirnost, 100);  
		img.stroke(hue(lampice_boja), saturation(lampice_boja), brightness(lampice_boja) - prozirnost, 100); 
	}   	
	img.strokeWeight(minSize/600)
	if (mjesec_x < cx) {   
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(180)
			polumjesec_www(img,0, 0, r, xdiv_mjesec); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(180)
			polumjesec_www(img,0, 0, r, xdiv_mjesec); 
		img.pop()   
		} else {  
		img.push()
			img.translate(cx, cy-visina/2)
			img.rotate(360)
			polumjesec_www(img,0, 0, r, xdiv_mjesec); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(360)
			polumjesec_www(img,0, 0, r, xdiv_mjesec); 
		img.pop()      
	}       
	img.noStroke()
	img.rectMode(CENTER);
	if (neon == 1) {   
		img.fill(hue(lampice_boja_neon), saturation(lampice_boja_neon), brightness(lampice_boja_neon) - rupa + upaljena_svjetla, 100); 
	} else { 
		img.fill(hue(lampice_boja), saturation(lampice_boja), brightness(lampice_boja) - rupa + upaljena_svjetla, 100); 
	} 	
	img.rect(cx, cy, r, visina) /// glavna kocka
	if (neon == 1) {   
		img.fill(hue(lampice_boja_neon), saturation(lampice_boja_neon), brightness(lampice_boja_neon) - prozirnost, 100);  
		img.stroke(hue(lampice_boja_neon), saturation(lampice_boja_neon), brightness(lampice_boja_neon) - prozirnost, 100); 		
	} else { 
		img.fill(hue(lampice_boja), saturation(lampice_boja), brightness(lampice_boja) - prozirnost, 100);  
		img.stroke(hue(lampice_boja), saturation(lampice_boja), brightness(lampice_boja) - prozirnost, 100); 
	} 
	img.strokeWeight(minSize/600)
	if (u_odnosu_na_sta < cx) {   
		kocka_svjetlo = map(u_odnosu_na_sta, cx, 0, 0, r/4.0)  
		img.rect(cx+(r-kocka_svjetlo)/2, cy, kocka_svjetlo, visina*1.01)
		} else {  
		kocka_svjetlo = map(u_odnosu_na_sta, koboljkaWidth, cx, r/4.0, 0)
		img.rect(cx-(r-kocka_svjetlo)/2, cy, kocka_svjetlo, visina*1.01)  
	}  
	if (postotak == 1) {	  
		if (random() < 0.99) {
			glow_radius = random(r*4, r*4)
			transparencija = random(20, 5) 
			for (var i = 0; i < glow_radius; i+=koboljkaWidth/600) {
				glow = map(i, 0, glow_radius, transparencija, 0)
				if (neon == 1) {  		
					img.stroke(hue(boja_zjenica), saturation(boja_zjenica), brightness(boja_zjenica), glow);					
				} else { 
					img.stroke(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), glow);
				} 				
				img.strokeWeight(koboljkaWidth/600)
				img.noFill()
			}   
		}	
	}		
}
function tableta_vrata(img, cx, cy, r, visina) {
	 let minSize = min(koboljkaWidth, koboljkaHeight); 
	u_odnosu_na_sta = koboljkaWidth*0.5;
	odstupanje_od_sredine = koboljkaWidth*0.05;
	rupa = 70; 
	if (random() < 0.75) { 
		rupa = 0; 
	}
	prozirnost = 80; 
	upaljena_svjetla = random(-30,30) 
	img.noStroke()
	img.fill(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce) - rupa + upaljena_svjetla, 100);
	img.ellipse(cx, cy-visina/2, r);
	img.ellipse(cx, cy+visina/2, r);
	mjesec_map_desno = map(u_odnosu_na_sta, cx, 0, (50*(u_odnosu_na_sta*2))/600, (50*(u_odnosu_na_sta*2))/400)
	 mjesec_map_livo = map(u_odnosu_na_sta, cx, koboljkaWidth, (50*(u_odnosu_na_sta*2))/600, (50*(u_odnosu_na_sta*2))/400)
	xdiv_mjesec_desno = map(mjesec_map_desno, 0, u_odnosu_na_sta, 1, -1, true); // 150 je pola
	  xdiv_mjesec_livo = map(mjesec_map_livo, 0, u_odnosu_na_sta, 1, -1, true); // 150 je pola
	img.fill(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce) - prozirnost, 100);   
	img.stroke(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce) - prozirnost, 100); 
	img.strokeWeight(minSize/1200)
   	if (u_odnosu_na_sta <= cx + odstupanje_od_sredine) { 	
		img.push()
			img.translate(cx, cy - visina/2)
			img.rotate(180)
			polumjesec_www(img,0, 0, r, xdiv_mjesec_desno); 
		img.pop() 
		img.push()
			img.translate(cx, cy + visina/2)
			img.rotate(180)
			polumjesec_www(img,0, 0, r, xdiv_mjesec_desno); 
		img.pop()   		
	}
   	if (u_odnosu_na_sta >= cx - odstupanje_od_sredine) { 	
		img.push()
			img.translate(cx, cy - visina/2)
			img.rotate(360)
			polumjesec_www(img,0, 0, r, xdiv_mjesec_livo); 
		img.pop()  
		img.push()
			img.translate(cx, cy+visina/2)
			img.rotate(360)
			polumjesec_www(img,0, 0, r, xdiv_mjesec_livo); 
		img.pop()   		
	}
	img.noStroke()
	img.rectMode(CENTER);
	img.fill(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce) - rupa + upaljena_svjetla, 100); 
	img.rect(cx, cy, r, visina) 
	img.fill(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce) - prozirnost, 100);  
	img.stroke(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce) - prozirnost, 100); 
	img.strokeWeight(minSize/1200)
 	if (u_odnosu_na_sta <= cx + odstupanje_od_sredine) { 	
		kocka_svjetlo_desno = map(u_odnosu_na_sta, cx, 0, r/6.0, r/4.0)  
		img.rect(cx+(r-kocka_svjetlo_desno)/2, cy, kocka_svjetlo_desno, visina*1.01)
	}
 	if (u_odnosu_na_sta >= cx - odstupanje_od_sredine) { 	
		kocka_svjetlo_livo = map(u_odnosu_na_sta, koboljkaWidth, cx, r/4.0, r/6.0)  
		img.rect(cx-(r-kocka_svjetlo_livo)/2, cy, kocka_svjetlo_livo, visina*1.01)
	}	
}
function broj(img, x, y, radius, neon) {
	raiuds_mali = radius/8
	razmak = radius/12
	tableta_vrata_broj(img, x - razmak*2, y - razmak*4, raiuds_mali, 0, random_broj[0], neon)	  
	tableta_vrata_broj(img, x, y - razmak*4, raiuds_mali, 0, random_broj[1], neon) 
  	tableta_vrata_broj(img, x + razmak*2, y - razmak*4, raiuds_mali, 0, random_broj[2], neon)
	tableta_vrata_broj(img, x - razmak*2, y - razmak*2, raiuds_mali, 0, random_broj[3], neon) 
	tableta_vrata_broj(img, x, y - razmak*2, raiuds_mali, 0, random_broj[4], neon)
	tableta_vrata_broj(img, x + razmak*2, y - razmak*2, raiuds_mali, 0, random_broj[5], neon)
	tableta_vrata_broj(img, x - razmak*2, y, raiuds_mali, 0, random_broj[6], neon)
	tableta_vrata_broj(img, x, y, raiuds_mali, 0, random_broj[7], neon)
	tableta_vrata_broj(img, x + razmak*2, y, raiuds_mali, 0, random_broj[8], neon)    
	tableta_vrata_broj(img, x - razmak*2, y + razmak*2, raiuds_mali, 0, random_broj[9], neon) 
	tableta_vrata_broj(img, x, y + razmak*2, raiuds_mali, 0, random_broj[10], neon) 	  
	tableta_vrata_broj(img, x + razmak*2, y + razmak*2, raiuds_mali, 0, random_broj[11], neon) 
	tableta_vrata_broj(img, x - razmak*2, y + razmak*4, raiuds_mali, 0, random_broj[12], neon)  
	tableta_vrata_broj(img, x, y + razmak*4, raiuds_mali, 0, random_broj[13], neon)   
	tableta_vrata_broj(img, x + razmak*2, y + razmak*4, raiuds_mali, 0, random_broj[14], neon) 
}
function kosa(img, cx, cy, r, kut_od, kut_do, gustoca, duzina, debljina) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	noiseZ = 0;
	xoff = 0;
	yoff = 0;
	for (let i = kut_od; i <= kut_do; i += gustoca) {
		let xoff = map(cos(i), -1, 1, 1, 10);
		let yoff = map(sin(i), -1, 1, 1, 10);
		radius = map(noise(xoff, yoff, noiseZ), 0, 1, r/2, r/2); 
		var x = cx + radius * cos(i);
		var y = cy + radius * sin(i);
		let v = createVector(x, y);
		let dodatak = 0;
		let noiseZ2 = 0;
		let tockice = r*duzina; 
		uvijanje = random(20, 60)
		for (let a = 0; a < tockice; a += 1) {
			xoff2 = map(cos(i), -1, 1, 1, 10);
			yoff2 = map(sin(i), -1, 1, 1, 10);
			kut1 = map(a, 0, tockice, uvijanje, 1); 
			nn = map(noise(xoff2, yoff2, noiseZ2), 0, 1, -kut1, kut1);
			var x1 = v.x + dodatak * cos(i + nn);
			var y1 = v.y + dodatak * sin(i + nn);
			let v1 = createVector(x1, y1);
			let str = map(a, 0, tockice, r*debljina, r/200); 
			xxx(img, v1.x, v1.y, str);
			dodatak += r/25; 
			noiseZ2 += 0.3;
		}
		noiseZ += 0.001;
	}
}
function funkcija_stablo(img, posX,posY, visina, sirina_debljine, tijelo) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	let y;
	for (y = posY; y > posY - visina; y-=3.0) {
		let debljina = map(y, posY, posY - visina, sirina_debljine, sirina_debljine/2)  
		xxx(img, posX, y, debljina)
		posX += map(noise(xoff), 0,1, -6,6)
		xoff += 0.1
	} 
}
function funkcija_stablo_oko(img, posX, posY, visina, sirina_debljine, uvijanje, gustoca) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	for (y = posY; y > posY - visina; y-=gustoca) {
		debljina = map(y, posY, posY - visina, sirina_debljine, sirina_debljine/2)  
		xxx(img, posX, y, debljina)
		posX += map(noise(xoff), 0,1, -uvijanje, uvijanje)
		xoff += 0.1
	} 
	xxx(img, posX, y, debljina*1.8)
	oko(img, posX, y, debljina*random(1.4,1.6))
}
function funkcija_stablo_glava(img, posX, posY, visina, sirina_debljine, uvijanje, gustoca) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	for (y = posY; y > posY - visina; y-=gustoca) {
		debljina = map(y, posY, posY - visina, sirina_debljine, sirina_debljine/2)  
		xxx(img, posX, y, debljina)
		posX += map(noise(xoff), 0,1, -uvijanje, uvijanje)
		xoff += 0.1
	} 
	if (kaciga == 1) {   
		random(random_glava)(img, posX, y, debljina*random(1.4,1.6));
	} 	
	if (kaciga == 2) {   
		xxx(img, posX, y, debljina*1.8) 
		oko(img, posX, y, debljina*random(1.25,1.25))	
		ttt(img, posX, y, debljina*1.6)	
	} 		
	if (kaciga == 3) {   
		if (random() < 0.50) {
			random(random_glava)(img, posX, y, debljina*random(1.4,1.6));
		} else {  
			xxx(img, posX, y, debljina*1.8) 
			oko(img, posX, y, debljina*random(1.25,1.25))	
			ttt(img, posX, y, debljina*1.6)	
		}   
	} 	
}
function funkcija_stablo_gradient(img, posX, posY, visina, sirina_debljine, uvijanje) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	let y;
	let debljina;
	for (y = posY; y > posY - visina; y-=1.0) {
		debljina = map(y, posY, posY - visina, sirina_debljine, sirina_debljine/2) 
		gradient = map(y, posY, posY - visina, 100, 0)
		img.noStroke()
		img.strokeWeight(0)
		img.fill(hue(boja_global), saturation(boja_global), brightness(boja_global), 100);	
		img.ellipse(posX, y, sirina_debljine)
		img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), gradient);			
		img.ellipse(posX, y, sirina_debljine)
		posX += map(noise(xoff), 0,1, -uvijanje, uvijanje)
		xoff += 0.1
	} 
}
function oko(img, cx, cy, r) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	kut3 = atan2(global_y - cy, global_x - cx);
	kut2 = atan2(mjesec_y - cy, mjesec_x - cx);  
	kut1 = atan2(sunce_y - cy, sunce_x - cx);
	img.noStroke()
	img.fill(boja_oko);
	img.ellipse(cx, cy, r);
	img.push()
		img.translate(cx, cy)
		img.rotate(kut1)
		zjenica(img, 0+r/5,0, r/1.4)
	img.pop()
	vinjeta_velicina = r/2;
	od_transparencije = 10;
    for (var i = 0; i < vinjeta_velicina; i++) {
		img.noFill()
		img.stroke(hue(pozadina), saturation(pozadina), brightness(pozadina), od_transparencije-i/(vinjeta_velicina/od_transparencije));          
		img.strokeWeight(minSize/600);
		img.ellipse(cx, cy, r-i)   
	}      
	var xdiv_sunce = map(220, 0, minSize/2, 1, -1, true); 
	var xdiv_mjesec = map(30, 0, minSize/2, 1, -1, true); 
	var xdiv_global = map(20, 0, minSize/2, 1, -1, true); 
	klapna = map(sunce_y, 0, 800, 60, 230)
	var xdiv_kapak = map(random(klapna*0.3 * minSize/600, klapna * minSize/600), 0, koboljkaWidth/2, 1, -1, true); 
	img.push()
		img.translate(cx, cy)
		img.rotate(90)
		img.scale(1.01)
		img.fill(hue(boja_robot), saturation(boja_robot), brightness(boja_robot), 100); 
		polumjesec(img, 0, 0, r, xdiv_kapak); 
	img.pop()
	img.push()
		img.translate(cx, cy)
		img.rotate(kut3-180)
		img.fill(hue(boja_global), saturation(boja_global), brightness(boja_global), 50);
		polumjesec(img, 0, 0, r, xdiv_global); 
	img.pop()     
	img.push()
		img.translate(cx, cy)
		img.rotate(kut2-180)
		img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), 30); 
		polumjesec(img, 0, 0, r, xdiv_mjesec); 
	img.pop()    
	img.push()
		img.translate(cx, cy)
		jacina = dist(cx,cy, sunce_x, sunce_y)
		transparencija = map(100, jacina*0.2, jacina*1.5, 0, 50)
		img.rotate(kut1-180)
		img.fill(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), transparencija);
		polumjesec(img, 0, 0, r, xdiv_sunce); 
	img.pop()
}
function zjenica(img, cx, cy, r) {
	img.fill(hue(boja_zjenica), saturation(boja_zjenica), brightness(boja_zjenica) - 20, 100);
	img.ellipse(cx, cy, r/2.1);
	img.fill(0)
	img.ellipse(cx, cy, r/4);  
	img.fill(0,0, 100, 25); 
	img.ellipse(cx+r/5/2, 0, r/5);
}  
function yyy(img, cx, cy, r) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	img.noStroke()
	img.fill(boja_robot);
	img.ellipse(cx, cy, r);
	var xdiv_global = map(random_polumjesec[0], 0, minSize/2, 1, -1, true);
	var xdiv_mjesec = map(random_polumjesec[1], 0, minSize/2, 1, -1, true); 
	var xdiv_sunce = map(random_polumjesec[15], 0, minSize/2, 1, -1, true); 
	img.push()
		img.translate(cx, cy)
		kut3 = atan2(global_y - cy, global_x - cx);
		jacina3 = dist(cx,cy, global_x, global_y)
		transparencija3 = map(100, jacina3 * random_polumjesec[3], jacina3 * random_polumjesec[4], random_polumjesec[5], random_polumjesec[6])
		img.rotate(kut3-180)
		img.fill(hue(boja_global), saturation(boja_global), brightness(boja_global), transparencija3);
		polumjesec(img, 0, 0, r, xdiv_global); 
	img.pop()     
	img.push()
		img.translate(cx, cy)
		kut2 = atan2(mjesec_y - cy, mjesec_x - cx);
		jacina2 = dist(cx,cy, mjesec_x, mjesec_y)
		transparencija2 = map(100, jacina2 * random_polumjesec[7], jacina2 * random_polumjesec[8], random_polumjesec[9], random_polumjesec[10])  
		img.rotate(kut2-180)
		img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), transparencija2);  
		polumjesec(img, 0, 0, r, xdiv_mjesec); 
	img.pop()    
	img.push()
		img.translate(cx, cy)
		kut1 = atan2(sunce_y - cy, sunce_x - cx);
		jacina = dist(cx,cy, sunce_x, sunce_y)
		transparencija = map(100, jacina * random_polumjesec[11], jacina * random_polumjesec[12], random_polumjesec[13], random_polumjesec[14])
		img.rotate(kut1-180)
		img.fill(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), transparencija);
		polumjesec(img, 0, 0, r, xdiv_sunce); 
	img.pop()
}
function xxx(img, cx, cy, r) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	img.noStroke()
	img.fill(hue(boja_robot), saturation(boja_robot), brightness(boja_robot), 100); 
	img.ellipse(cx, cy, r);
	var xdiv_global = map(random_polumjesec[0], 0, minSize/2, 1, -1, true); 
	var xdiv_mjesec = map(random_polumjesec[1], 0, minSize/2, 1, -1, true); 
	var xdiv_sunce = map(random_polumjesec[2], 0, minSize/2, 1, -1, true); 
	img.push()
		img.translate(cx, cy)
		kut3 = atan2(global_y - cy, global_x - cx);
		jacina3 = dist(cx,cy, global_x, global_y)
		transparencija3 = map(100, jacina3 * random_polumjesec[3], jacina3 * random_polumjesec[4], random_polumjesec[5], random_polumjesec[6])		
		img.rotate(kut3-180)
		img.fill(hue(boja_global), saturation(boja_global), brightness(boja_global), transparencija3);
		polumjesec(img, 0, 0, r, xdiv_global); 
	img.pop()     
	img.push()
		img.translate(cx, cy)
		kut2 = atan2(mjesec_y - cy, mjesec_x - cx);
		jacina2 = dist(cx,cy, mjesec_x, mjesec_y)
		transparencija2 = map(100, jacina2 * random_polumjesec[7], jacina2 * random_polumjesec[8], random_polumjesec[9], random_polumjesec[10])
		img.rotate(kut2-180)
		img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), transparencija2);
		polumjesec(img, 0, 0, r, xdiv_mjesec); 
	img.pop()    
	img.push()
		img.translate(cx, cy)
		kut1 = atan2(sunce_y - cy, sunce_x - cx);
		jacina = dist(cx,cy, sunce_x, sunce_y)
		transparencija = map(100, jacina * random_polumjesec[11], jacina * random_polumjesec[12], random_polumjesec[13], random_polumjesec[14])
		img.rotate(kut1-180)
		img.fill(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce), transparencija); 
		polumjesec(img, 0, 0, r, xdiv_sunce); 
	img.pop()
}
function sss(img, cx, cy, r) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	img.noStroke()
	img.fill(hue(boja_sunce), saturation(boja_sunce), brightness(boja_sunce) + random(-70,70), 100); 
	img.ellipse(cx, cy, r);
	var xdiv_global = map(random_polumjesec[0]*4, 0, minSize/2, 1, -1, true); 
	var xdiv_mjesec = map(random_polumjesec[1]*4, 0, minSize/2, 1, -1, true); 
	var xdiv_sunce = map(random_polumjesec[2]*4, 0, minSize/2, 1, -1, true); 
	img.push()
		img.translate(cx, cy)
		kut3 = atan2(global_y - cy, global_x - cx);
		jacina3 = dist(cx,cy, global_x, global_y)
		transparencija3 = map(100, jacina3 * random_polumjesec[3], jacina3 * random_polumjesec[4], random_polumjesec[5], random_polumjesec[6])		
		img.rotate(kut3-180)
		img.fill(hue(boja_global), saturation(boja_global), brightness(boja_global), transparencija3/2);
		polumjesec(img, 0, 0, r, xdiv_global); 
	img.pop()     
	img.push()
		img.translate(cx, cy)
		kut2 = atan2(mjesec_y - cy, mjesec_x - cx);
		jacina2 = dist(cx,cy, mjesec_x, mjesec_y)
		transparencija2 = map(100, jacina2 * random_polumjesec[7], jacina2 * random_polumjesec[8], random_polumjesec[9], random_polumjesec[10])
		img.rotate(kut2-180)
		img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), transparencija2/2);
		polumjesec(img, 0, 0, r, xdiv_mjesec); 
	img.pop()    
	img.push()
		img.translate(cx, cy)
		kut1 = atan2(sunce_y - cy, sunce_x - cx);
		jacina = dist(cx,cy, sunce_x, sunce_y)
		transparencija = map(100, jacina * random_polumjesec[11], jacina * random_polumjesec[12], random_polumjesec[13], random_polumjesec[14])
		img.rotate(kut1-180)
		img.fill(hue(boja_sunce), saturation(boja_sunce)-50, brightness(boja_sunce), transparencija/1.5); 
		polumjesec(img, 0, 0, r, xdiv_sunce); 
	img.pop()
}
function ttt(img, cx, cy, r) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	img.noStroke()
	img.fill(hue(boja_zjenica), saturation(boja_zjenica), brightness(boja_zjenica) + random(-70,70), 70); 
	img.ellipse(cx, cy, r);
	var xdiv_global = map(random_polumjesec[0]*4, 0, minSize/2, 1, -1, true); 
	var xdiv_mjesec = map(random_polumjesec[1]*4, 0, minSize/2, 1, -1, true); 
	var xdiv_sunce = map(random_polumjesec[2]*4, 0, minSize/2, 1, -1, true); 
	img.push()
		img.translate(cx, cy)
		kut3 = atan2(global_y - cy, global_x - cx);
		jacina3 = dist(cx,cy, global_x, global_y)
		transparencija3 = map(100, jacina3 * random_polumjesec[3], jacina3 * random_polumjesec[4], random_polumjesec[5], random_polumjesec[6])		
		img.rotate(kut3-180)
		img.fill(hue(boja_global), saturation(boja_global), brightness(boja_global), transparencija3/2);
		polumjesec(img, 0, 0, r, xdiv_global); 
	img.pop()     
	img.push()
		img.translate(cx, cy)
		kut2 = atan2(mjesec_y - cy, mjesec_x - cx);
		jacina2 = dist(cx,cy, mjesec_x, mjesec_y)
		transparencija2 = map(100, jacina2 * random_polumjesec[7], jacina2 * random_polumjesec[8], random_polumjesec[9], random_polumjesec[10])
		img.rotate(kut2-180)
		img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), transparencija2/2);
		polumjesec(img, 0, 0, r, xdiv_mjesec); 
	img.pop()    
	img.push()
		img.translate(cx, cy)
		kut1 = atan2(sunce_y - cy, sunce_x - cx);
		jacina = dist(cx,cy, sunce_x, sunce_y)
		transparencija = map(100, jacina * random_polumjesec[11], jacina * random_polumjesec[12], random_polumjesec[13], random_polumjesec[14])
		img.rotate(kut1-180)
		img.fill(hue(boja_sunce), saturation(boja_sunce)-50, brightness(boja_sunce), transparencija/2); 
		polumjesec(img, 0, 0, r, xdiv_sunce); 
	img.pop()
}
function zzz(img, cx, cy, r) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	img.noStroke()
	img.fill(hue(boja_zjenica), saturation(boja_zjenica), brightness(boja_zjenica) + random(-70,70), 100); 
	img.ellipse(cx, cy, r);
	var xdiv_global = map(random_polumjesec[0]*4, 0, minSize/2, 1, -1, true); 
	var xdiv_mjesec = map(random_polumjesec[1]*4, 0, minSize/2, 1, -1, true); 
	var xdiv_sunce = map(random_polumjesec[2]*4, 0, minSize/2, 1, -1, true); 
	img.push()
		img.translate(cx, cy)
		kut3 = atan2(global_y - cy, global_x - cx);
		jacina3 = dist(cx,cy, global_x, global_y)
		transparencija3 = map(100, jacina3 * random_polumjesec[3], jacina3 * random_polumjesec[4], random_polumjesec[5], random_polumjesec[6])		
		img.rotate(kut3-180)
		img.fill(hue(boja_global), saturation(boja_global), brightness(boja_global), transparencija3/2);
		polumjesec(img, 0, 0, r, xdiv_global); 
	img.pop()     
	img.push()
		img.translate(cx, cy)
		kut2 = atan2(mjesec_y - cy, mjesec_x - cx);
		jacina2 = dist(cx,cy, mjesec_x, mjesec_y)
		transparencija2 = map(100, jacina2 * random_polumjesec[7], jacina2 * random_polumjesec[8], random_polumjesec[9], random_polumjesec[10])
		img.rotate(kut2-180)
		img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), transparencija2/2);
		polumjesec(img, 0, 0, r, xdiv_mjesec); 
	img.pop()    
	img.push()
		img.translate(cx, cy)
		kut1 = atan2(sunce_y - cy, sunce_x - cx);
		jacina = dist(cx,cy, sunce_x, sunce_y)
		transparencija = map(100, jacina * random_polumjesec[11], jacina * random_polumjesec[12], random_polumjesec[13], random_polumjesec[14])
		img.rotate(kut1-180)
		img.fill(hue(boja_sunce), saturation(boja_sunce)-50, brightness(boja_sunce), transparencija/1.5); 
		polumjesec(img, 0, 0, r, xdiv_sunce); 
	img.pop()
}
function mmm(img, cx, cy, r) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	img.noStroke()
	img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec) + random(-70,70), 100); 
	img.ellipse(cx, cy, r);
	var xdiv_global = map(random_polumjesec[0]*4, 0, minSize/2, 1, -1, true); 
	var xdiv_mjesec = map(random_polumjesec[1]*4, 0, minSize/2, 1, -1, true); 
	var xdiv_sunce = map(random_polumjesec[2]*4, 0, minSize/2, 1, -1, true); 
	img.push()
		img.translate(cx, cy)
		kut3 = atan2(global_y - cy, global_x - cx);
		jacina3 = dist(cx,cy, global_x, global_y)
		transparencija3 = map(100, jacina3 * random_polumjesec[3], jacina3 * random_polumjesec[4], random_polumjesec[5], random_polumjesec[6])		
		img.rotate(kut3-180)
		img.fill(hue(boja_global), saturation(boja_global), brightness(boja_global), transparencija3/2);
		polumjesec(img, 0, 0, r, xdiv_global); 
	img.pop()     
	img.push()
		img.translate(cx, cy)
		kut2 = atan2(mjesec_y - cy, mjesec_x - cx);
		jacina2 = dist(cx,cy, mjesec_x, mjesec_y)
		transparencija2 = map(100, jacina2 * random_polumjesec[7], jacina2 * random_polumjesec[8], random_polumjesec[9], random_polumjesec[10])
		img.rotate(kut2-180)
		img.fill(hue(boja_mjesec), saturation(boja_mjesec), brightness(boja_mjesec), transparencija2/2);
		polumjesec(img, 0, 0, r, xdiv_mjesec); 
	img.pop()    
	img.push()
		img.translate(cx, cy)
		kut1 = atan2(sunce_y - cy, sunce_x - cx);
		jacina = dist(cx,cy, sunce_x, sunce_y)
		transparencija = map(100, jacina * random_polumjesec[11], jacina * random_polumjesec[12], random_polumjesec[13], random_polumjesec[14])
		img.rotate(kut1-180)
		img.fill(hue(boja_sunce), saturation(boja_sunce)-50, brightness(boja_sunce), transparencija/1.5); 
		polumjesec(img, 0, 0, r, xdiv_sunce); 
	img.pop()
}
function polumjesec(img, cx, cy, r, xdiv) {
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	img.beginShape();
		for (var i = 270; i > 90; i--) {
			var x = cx + cos(i) * r / 2 ;
			var y = cy + sin(i) * r / 2 ;
			img.vertex(x, y);
		}    
		for (var i = 90; i < 270; i++) {
			var x = cx + cos(i) * r / 2 * xdiv ;
			var y = cy + sin(i) * r / 2 ;
			img.vertex(x, y);
		}
	img.endShape(CLOSE);
}
function polumjesec_www(img, cx, cy, r, xdiv) {
	let minSize = min(koboljkaWidth, koboljkaHeight);		
	img.beginShape();
		for (var i = 270; i > 90; i--) {
			var x = cx + cos(i) * r / 2 ;
			var y = cy + sin(i) * r / 2 ;
			img.vertex(x, y);
		}   
		for (var i = 90; i < 270; i++) {
			var x = cx + cos(i) * r / 2 * xdiv ;
			var y = cy + sin(i) * r / 2 ;
			img.vertex(x, y);
		}
	img.endShape(CLOSE);
}
function robot(img, cx, cy, r) {
	let minSize = min(koboljkaWidth, koboljkaHeight);	  
	var glava = [];
	var rame_desno = [];  
	var noga_desno = [];  
	var noga_livo = [];      
	var rame_livo = [];  
	var koljeno_livo = []; 
	var koljeno_desno = [];
	var stopala_livo = [];   
	var stopala_desno = [];  
	var lakat_livo = []; 
	var lakat_desno = [];   
	var saka_livo = []; 
	var saka_desno = [];   
	var prsti_desno = [];  
	var prsti_livo = [];    
	r_glava = r*0.45 * minSize/600;
	r_rame = r*0.30 * minSize/600;
	r_noga = r*0.42 * minSize/600;
	r_koljeno = r*0.25 * minSize/600;
	r_lakat = r*0.20 * minSize/600;
	r_prsti = r*0.15 * minSize/600;
	r_stopala = r*0.20 * minSize/600;
	r_duzina_ruku = random(r_lakat * 1.5, r_lakat * 1.5);
	r_duzina_nogu = random(r_noga * 1.5, r_noga * 1.5);
	r_duzina_vrata =  random(r/2.90 * minSize/600, r/1.5 * minSize/600);
	for (var i = 360; i > 0; i-=5.0) {
		var x = cx + cos(i) * r_duzina_vrata;
		var y = cy + sin(i) * r_duzina_vrata;
		if (i >= 250 && i <= 290) { 
			var vektor_glava = createVector(x, y);
			glava.push(vektor_glava);
		}             
	}  
	for (var i = 360; i > 0; i-=5.0) {
		var x = cx + cos(i) * r/2.3 ;
		var y = cy + sin(i) * r/2.3 ;
		if (i >= 310 && i <= 320) { 
			var vektor_rame_desno = createVector(x, y);
			rame_desno.push(vektor_rame_desno);
		}    
		if (i >= 220 && i <= 230) { 
			var vektor_rame_livo = createVector(x, y);
			rame_livo.push(vektor_rame_livo);
		}          
	}    
	for (var i = 360; i > 0; i-=5.0) {
		var x = cx + cos(i) * r/2.6 ;
		var y = cy + sin(i) * r/2.6 ;
		if (i >= 50 && i <= 60) { 
			var vektor_noga_desno = createVector(x, y);
			noga_desno.push(vektor_noga_desno);
		}      
		if (i >= 110 && i <= 140) { 
			var vektor_noga_livo = createVector(x, y);
			noga_livo.push(vektor_noga_livo);
		}     
	}  
	img.noFill();
	img.stroke(0);
	var glava = random(glava);
	var rame_desno = random(rame_desno);  
	var noga_desno = random(noga_desno);   
	var noga_livo = random(noga_livo);  
	var rame_livo = random(rame_livo);  
	for (var i = 360; i > 0; i-=5.0) {
		var x = noga_livo.x + cos(i) * r_noga/2 ;
		var y = noga_livo.y + sin(i) * r_noga/2 ;
		if (i >= 90 && i <= 120) {
			var vektor_koljeno_livo = createVector(x, y);
			koljeno_livo.push(vektor_koljeno_livo);
		}       
	} 
	for (var i = 360; i > 0; i-=5.0) {
		var x = noga_desno.x + cos(i) * r_noga/2 ;
		var y = noga_desno.y + sin(i) * r_noga/2 ;
		if (i >= 60 && i <= 90) {
			var vektor_koljeno_desno = createVector(x, y);
			koljeno_desno.push(vektor_koljeno_desno);
		}       
    }   
	for (var i = 360; i > 0; i-=5.0) {
		var x = rame_livo.x + cos(i) * r_rame/2 ;
		var y = rame_livo.y + sin(i) * r_rame/2 ;
		if (i >= 130 && i <= 250) {
			var vektor_lakat_livo = createVector(x, y);
			lakat_livo.push(vektor_lakat_livo);
		}       
	} 
	for (var i = 360; i > 0; i-=5.0) {
		var x = rame_desno.x + cos(i) * r_rame/2 ;
		var y = rame_desno.y + sin(i) * r_rame/2 ;
		if (i >= 280 && i <= 360) {
			var vektor_lakat_desno = createVector(x, y);
			lakat_desno.push(vektor_lakat_desno);
		}       
	}   
	var koljeno_livo = random(koljeno_livo); 
	var koljeno_desno = random(koljeno_desno);   
	var lakat_livo = random(lakat_livo);    
	var lakat_desno = random(lakat_desno);      
	for (var i = 360; i > 0; i-=5.0) {
		var x = lakat_livo.x + cos(i) * r_lakat/2 ;
		var y = lakat_livo.y + sin(i) * r_lakat/2 ;
		if (i >= 230 && i <= 250) {
			var vektor_saka_livo = createVector(x, y);
			saka_livo.push(vektor_saka_livo);
		}          
	} 
	for (var i = 360; i > 0; i-=5.0) {
		var x = lakat_desno.x + cos(i) * r_lakat/2 ;
		var y = lakat_desno.y + sin(i) * r_lakat/2 ;
		if (i >= 300 && i <= 320) {
			var vektor_saka_desno = createVector(x, y);
			saka_desno.push(vektor_saka_desno);
		}       
    } 
	var saka_livo = random(saka_livo);  
	var saka_desno = random(saka_desno);    
	for (var i = 360; i > 0; i-=5.0) {
		var x = noga_livo.x + cos(i) * r_duzina_nogu;
		var y = noga_livo.y + sin(i) * r_duzina_nogu;
		if (i >= 100 && i <= 130) { 
			var vektor_stopala_livo = createVector(x, y);
			stopala_livo.push(vektor_stopala_livo);
		}           
	} 
	for (var i = 360; i > 0; i-=5.0) {
		var x = noga_desno.x + cos(i) * r_duzina_nogu;
		var y = noga_desno.y + sin(i) * r_duzina_nogu;
		if (i >= 60 && i <= 90) { 
			var vektor_stopala_desno = createVector(x, y);
			stopala_desno.push(vektor_stopala_desno);
		}                
	}   
	for (var i = 360; i > 0; i-=5.0) {
		var x = lakat_livo.x + cos(i) * r_duzina_ruku;
		var y = lakat_livo.y + sin(i) * r_duzina_ruku ;
		if (i >= 150 && i <= 250) { 
			var vektor_prsti_livo = createVector(x, y);
			prsti_livo.push(vektor_prsti_livo);
		}                  
	}   
	for (var i = 360; i > 0; i-=5.0) {
		var x = lakat_desno.x + cos(i) * r_duzina_ruku;
		var y = lakat_desno.y + sin(i) * r_duzina_ruku;
		if ( (i >= 0 && i <= 60) || (i >= 270 && i <= 360) ) { 
			var vektor_prsti_desno = createVector(x, y);
			prsti_desno.push(vektor_prsti_desno);
		}     
	}     
	var stopala_desno = random(stopala_desno);    
	var stopala_livo = random(stopala_livo);  
	var prsti_desno = random(prsti_desno);    
	var prsti_livo = random(prsti_livo);       
	img.stroke(boja_robot)
	img.strokeWeight(r/40*minSize/600)
	img.line(lakat_livo.x, lakat_livo.y, prsti_livo.x,prsti_livo.y); 
	img.line(lakat_desno.x, lakat_desno.y, prsti_desno.x, prsti_desno.y);   
	img.line(noga_livo.x, noga_livo.y, stopala_livo.x,stopala_livo.y); 
	img.line(noga_desno.x, noga_desno.y, stopala_desno.x, stopala_desno.y);    
	if (prikazi_ledja == 1) {   
		img.noStroke()
		xxx(img, prsti_desno.x, prsti_desno.y, r_prsti)  
		xxx(img, prsti_livo.x, prsti_livo.y, r_prsti)
		xxx(img, stopala_livo.x, stopala_livo.y, r_stopala)  
		xxx(img, stopala_desno.x, stopala_desno.y, r_stopala)  
		xxx(img, noga_livo.x, noga_livo.y, r_noga)  
		xxx(img, noga_desno.x, noga_desno.y, r_noga)    
		xxx(img, lakat_livo.x, lakat_livo.y, r_lakat)  
		xxx(img, lakat_desno.x, lakat_desno.y, r_lakat)  
		xxx(img, rame_livo.x, rame_livo.y, r_rame)  
		xxx(img, rame_desno.x, rame_desno.y, r_rame)
		xxx(img, glava.x, glava.y, r_glava)  
		xxx(img, cx, cy, r)    
	} else {  
		yyy(img, prsti_desno.x, prsti_desno.y, r_prsti)  
		yyy(img, prsti_livo.x, prsti_livo.y, r_prsti)
		yyy(img, stopala_livo.x, stopala_livo.y, r_stopala)  
		yyy(img, stopala_desno.x, stopala_desno.y, r_stopala)  
		yyy(img, noga_livo.x, noga_livo.y, r_noga)  
		yyy(img, noga_desno.x, noga_desno.y, r_noga)    
		yyy(img, lakat_livo.x, lakat_livo.y, r_lakat)  
		yyy(img, lakat_desno.x, lakat_desno.y, r_lakat)  
		yyy(img, rame_livo.x, rame_livo.y, r_rame)  
		yyy(img, rame_desno.x, rame_desno.y, r_rame)
		yyy(img, cx, cy, r)  
		yyy(img, glava.x, glava.y, r_glava)  
	}
}
function loader(cx, cy, r, xdiv) {
	beginShape();
		for (var i = 270; i > 90; i--) {
			var x = cx + cos(i) * r / 2 ;
			var y = cy + sin(i) * r / 2 ;
			vertex(x, y);
		}    
		for (var i = 90; i < 270; i++) {
			var x = cx + cos(i) * r / 2 * xdiv ;
			var y = cy + sin(i) * r / 2 ;
			vertex(x, y);
		}
	endShape(CLOSE);
}
function funkcija_okvir(img) {
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	img.push()
		img.stroke(0)
		img.strokeWeight(minSize/20)
		img.line(0, 0, koboljkaWidth, 0)
		img.line(koboljkaWidth, 0, koboljkaWidth, koboljkaHeight)
		img.line(koboljkaWidth, koboljkaHeight, 0, koboljkaHeight)
		img.line(0, koboljkaHeight, 0, 0)  
	img.pop()
}
function initPerspektive() {
	nagibi_array = [
		[0.92, 0.82, /***/ 0, 1, 1],
	];  
}
function array_glave() {
	array_glava = [
		[djecak, djecak_x, kostur, resetka, antena, antena_x, gas, gas_usi, dolcevita, muva, muva_naocale, maska, sljem], 
		[djecak, djecak_x, kostur, resetka, antena, antena_x, gas, gas_usi, dolcevita, muva, muva_naocale, maska, sljem], 
		[djecak, djecak_x, kostur, resetka, antena, antena_x, gas, gas_usi, dolcevita, muva, muva_naocale, maska, sljem], 
		[djecak, djecak_x, kostur, resetka, antena, antena_x, gas, gas_usi, dolcevita, muva, muva_naocale, maska, sljem], 		
		[djecak, djecak_x, kostur, resetka, antena, antena_x, gas, gas_usi, dolcevita, muva, muva_naocale, maska, sljem], 
		[djecak, djecak_x, kostur, resetka, antena, antena_x, gas, gas_usi, dolcevita, muva, muva_naocale, maska, sljem], 
		[djecak, djecak_x, kostur, resetka, antena, antena_x, gas, gas_usi, dolcevita, muva, muva_naocale, maska, sljem], 
		[djecak, djecak_x, kostur, resetka, antena, antena_x, gas, gas_usi, dolcevita, muva, muva_naocale, maska, sljem], 
		[djecak, djecak_x, kostur, resetka, antena, antena_x, gas, gas_usi, dolcevita, muva, muva_naocale, maska, sljem], 
		[djecak, djecak_x, kostur, resetka, antena, antena_x, gas, gas_usi, dolcevita, muva, muva_naocale, maska, sljem], 
		[djecak, djecak_x, kostur, resetka, antena, antena_x, gas, gas_usi, dolcevita, muva, muva_naocale, maska, sljem], 
		[djecak, djecak_x, kostur, resetka, antena, antena_x, gas, gas_usi, dolcevita, muva, muva_naocale, maska, sljem], 		
		[djecak, djecak_x, kostur, resetka, antena, antena_x, gas, gas_usi, dolcevita, muva, muva_naocale, maska, sljem], 
		[djecak, djecak_x, kostur, resetka, antena, antena_x, gas, gas_usi, dolcevita, muva, muva_naocale, maska, sljem], 
		[djecak, djecak_x, kostur, resetka, antena, antena_x, gas, gas_usi, dolcevita, muva, muva_naocale, maska, sljem], 
		[djecak, djecak_x, kostur, resetka, antena, antena_x, gas, gas_usi, dolcevita, muva, muva_naocale, maska, sljem], 
		[maska], 
		[sljem], 	   
		[kostur], 
		[resetka],  
		[antena],
		[antena_x],	   
		[antena, antena_x],
		[gas],
		[gas_usi],
		[dolcevita],
		[muva], 
		[muva_naocale], 
	];
}
function array_brojevi() {
	array_broj = [
	   [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1], // 2
       [1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1], // 3 
       [1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1], // 4       
       [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1], // 5 
       [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1], // 6 
       [1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1], // 7    
       [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1], // 8    
       [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1], // 9  
       [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1], // 0 
       [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1], // A
	   [1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1], // C 	   
       [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1], // E 
       [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0], // F 	  	   
       [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0], // P 	  	   
       [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1], // X
	];
	array_love = [
	   [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1], 
       [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1], 	 
	   [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0], 	
	   [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1], 
	];	
	array_peace = [
	    [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0], 
		[1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1],  	   
        [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1], 	 
		[1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1],  	   
        [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1],  
	];	
	array_exit = [
	    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1],  
        [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1], 
	    [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],    
	    [1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],  
	];	
	array_hope = [
        [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1], 	
	    [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],  
		[1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0], 	
		[1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1], 
	];	
	array_error = [
	    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1], 
        [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1], 
        [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1], 
 	    [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],  
		[1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1], 
	];		
	array_alive = [
        [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1], 
  	    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1], 
	    [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], 		   
	    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0], 
	    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1], 	
	];	
	array_happy = [
        [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1], 
        [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1], 	
		[1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0], 
		[1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0], 
	    [1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0], 
	];	
	array_heart = [
        [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1], 	
	    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1], 
        [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1], 
        [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1], 
	    [1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], 	
	];	
	array_trust = [
	    [1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], 
        [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1], 
	    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],  
        [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1], 		
	    [1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], 
	];	
	array_truth = [
	    [1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], 
        [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1], 
	    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1], 
	    [1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], 	 		
        [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1], 
	];		
}
function initPalettes() {
	palettes = [
['#004159', '#000d14', '#ff0453', '#f08757', '#039ed6', '#FFFFFF', '#fe1d22'],  
['#01316b', '#060c11', '#ff8614', '#ffa958', '#58afff', '#FFFFFF', '#00a2ff'],   
['#005e6d', '#001316', '#ff6129', '#ffe2d7', '#85e0ea', '#FFFFFF', '#00a2ff'], 
['#14484f', '#030c0d', '#ee7256', '#68d2df', '#a9bdbb', '#FFFFFF', '#ff0900'],  
['#002236', '#180000', '#ff5e00', '#ff5e00', '#c1e2ff', '#FFFFFF', '#00a2ff'], 
['#000d0f', '#060c11', '#ff6129', '#ff9974', '#85e0ea', '#FFFFFF', '#00a2ff'],  
['#00152d', '#000d0d', '#fe1d22', '#ffbf00', '#00fafe', '#FFFFFF', '#00fafe'],  
['#00152d', '#000909', '#fe1d22', '#ffbf00', '#00fafe', '#FFFFFF', '#00fafe'],  
['#081a56', '#030e17', '#ff5c03', '#03f7ff', '#184eff', '#FFFFFF', '#0de0e7'], 
['#070b0b', '#070b0b', '#fe4000', '#00fafe', '#a6feff', '#FFFFFF', '#00fafe'],  
['#160b0a', '#1e0f0e', '#fd3323', '#88feff', '#a2e1b8', '#FFFFFF', '#88feff'],  
['#2f0832', '#05061a', '#fd3323', '#2381fd', '#c9ffe7', '#FFFFFF', '#2381fd'], 
['#00070e', '#020407', '#ff5e00', '#ff2bcb', '#3ea5ff', '#ffffff', '#00a2ff'], 
['#081a56', '#030e17', '#ff0b03', '#03f7ff', '#184eff', '#FFFFFF', '#ff0b03'],  
['#080015', '#080015', '#ff3000', '#b7ddff', '#ff04f2', '#FFFFFF', '#b7ddff'], 
['#050e1f', '#0d0b11', '#09f0ff', '#fe4600', '#ff9c76', '#FFFFFF', '#fe4600'],  
['#030e17', '#020a11', '#00657a', '#ff6200', '#fffdbb', '#FFFFFF', '#ff6200'], 
['#080015', '#080015', '#0088ff', '#ff5e00', '#FFFFFF', '#FFFFFF', '#ff5e00'],  
['#00070e', '#00070e', '#ff5e00', '#ff2bcb', '#3ea5ff', '#ffffff', '#ff0900'], 
['#090300', '#0e0101', '#ce151f', '#4ea1ab', '#ffffff', '#FFFFFF', '#15cec5'], 
['#3c0c08', '#05061a', '#fd3323', '#2f7a5a', '#FFFFFF', '#FFFFFF', '#2f7a5a'], 
['#000000', '#030e17', '#ff6200', '#009dff', '#ffffff', '#FFFFFF', '#009dff'],  
['#000909', '#0d000e', '#ffbd67', '#f200ff', '#00fff2', '#FFFFFF', '#25a0ff'],  
['#080015', '#080015', '#0088ff', '#ff5e00', '#8103ff', '#FFFFFF', '#ff5e00'], 
['#080015', '#080015', '#0088ff', '#ff5e00', '#8fc0ff', '#FFFFFF', '#ff0900'], 
['#080015', '#080015', '#0088ff', '#ff7700', '#ff04f2', '#FFFFFF', '#ff7700'],   
['#000907', '#00100d', '#fe1dc1', '#ff3300', '#00ffcc', '#FFFFFF', '#1dc1fe'],   
['#030e17', '#02080d', '#ff0000', '#00657a', '#ff6200', '#FFFFFF', '#00657a'], 
['#08060f', '#0b0916', '#ff0bff', '#00aeff', '#6cd0ff', '#FFFFFF', '#00aeff'], 
['#00070e', '#00070e', '#ff5e00', '#ff0000', '#005fb2', '#FFFFFF', '#03dbd7'], 
['#00070e', '#00070e', '#ff5e00', '#0088ff', '#005fb2', '#FFFFFF', '#00a2ff'], 
['#000b0f', '#000d14', '#ff0453', '#d64603', '#039ed6', '#FFFFFF', '#fe1d22'],  
['#0f0b06', '#0f0b06', '#f96800', '#378494', '#c66520', '#FFFFFF', '#52c0d6'], 
['#0f0b06', '#0f0b06', '#f96800', '#378494', '#ffcca7', '#FFFFFF', '#00d3ff'], 
['#00070e', '#00070e', '#ff5e00', '#ff5e00', '#92ccff', '#FFFFFF', '#00a2ff'], 
['#090909', '#090909', '#b03d04', '#0477b0', '#98dbff', '#FFFFFF', '#00ccff'],  
['#0a0101', '#0a0101', '#29c6ff', '#ff2323', '#FFFFFF', '#FFFFFF', '#ff5d00'], 
['#00070e', '#00070e', '#ff5e00', '#ff009c', '#dff0ff', '#FFFFFF', '#42a4ff'], 
['#0a0000', '#0a0000', '#00ffff', '#ff0000', '#ff8000', '#FFFFFF', '#ff0000'], 
['#00060a', '#00060a', '#ffa200', '#ff006f', '#9100ff', '#FFFFFF', '#0077ff'], 
['#07080e', '#07080e', '#e04604', '#9c793e', '#00a6ed', '#FFFFFF', '#0099ff'], 
['#00152a', '#00070e', '#ff5e00', '#ff5e00', '#005fb2', '#FFFFFF', '#00a2ff'], 
['#00152d', '#000d0d', '#fe1d22', '#006bd9', '#84c1ff', '#FFFFFF', '#0381ff'],  
['#080015', '#080015', '#0088ff', '#0088ff', '#ff04f2', '#FFFFFF', '#ff04f2'], 
['#000912', '#000912', '#ff4a0b', '#00a8d1', '#006179', '#FFFFFF', '#00a8d1'], 
['#000907', '#00100d', '#ff3300', '#0294b8', '#86ffe7', '#FFFFFF', '#0294b8'], 
['#2e0a21', '#0a0200', '#ff6f01', '#24f2fd', '#24f2fd', '#FFFFFF', '#24f2fd'], 
['#00070c', '#000e18', '#ff0303', '#03ffff', '#f3fff9', '#FFFFFF', '#03ffff'],
['#00070c', '#000e18', '#03ffff', '#ff0303', '#f3fff9', '#FFFFFF', '#03ffff'],
['#00060a', '#00060a', '#ffd901', '#d901ff', '#01ffd9', '#FFFFFF', '#d901ff'], 
['#080015', '#080015', '#ff5e00', '#0088ff', '#ff5e00', '#FFFFFF', '#0088ff'],
['#004159', '#000d14', '#ff0453', '#f08757', '#039ed6', '#FFFFFF', '#fe1d22'],  
['#01316b', '#060c11', '#ff8614', '#ffa958', '#58afff', '#FFFFFF', '#00a2ff'],   
['#005e6d', '#001316', '#ff6129', '#ffe2d7', '#85e0ea', '#FFFFFF', '#00a2ff'], 
['#14484f', '#030c0d', '#ee7256', '#68d2df', '#a9bdbb', '#FFFFFF', '#ff0900'],  
['#002236', '#180000', '#ff5e00', '#ff5e00', '#c1e2ff', '#FFFFFF', '#00a2ff'], 
['#000d0f', '#060c11', '#ff6129', '#ff9974', '#85e0ea', '#FFFFFF', '#00a2ff'],  
['#00152d', '#000d0d', '#fe1d22', '#ffbf00', '#00fafe', '#FFFFFF', '#00fafe'],  
['#00152d', '#000909', '#fe1d22', '#ffbf00', '#00fafe', '#FFFFFF', '#00fafe'],  
['#081a56', '#030e17', '#ff5c03', '#03f7ff', '#184eff', '#FFFFFF', '#0de0e7'], 
['#070b0b', '#070b0b', '#fe4000', '#00fafe', '#a6feff', '#FFFFFF', '#00fafe'],  
['#160b0a', '#1e0f0e', '#fd3323', '#88feff', '#a2e1b8', '#FFFFFF', '#88feff'],  
['#2f0832', '#05061a', '#fd3323', '#2381fd', '#c9ffe7', '#FFFFFF', '#2381fd'], 
['#00070e', '#020407', '#ff5e00', '#ff2bcb', '#3ea5ff', '#ffffff', '#00a2ff'], 
['#081a56', '#030e17', '#ff0b03', '#03f7ff', '#184eff', '#FFFFFF', '#ff0b03'],  
['#080015', '#080015', '#ff3000', '#b7ddff', '#ff04f2', '#FFFFFF', '#b7ddff'], 
['#050e1f', '#0d0b11', '#09f0ff', '#fe4600', '#ff9c76', '#FFFFFF', '#fe4600'],  
['#030e17', '#020a11', '#00657a', '#ff6200', '#fffdbb', '#FFFFFF', '#ff6200'], 
['#080015', '#080015', '#0088ff', '#ff5e00', '#FFFFFF', '#FFFFFF', '#ff5e00'],  
['#00070e', '#00070e', '#ff5e00', '#ff2bcb', '#3ea5ff', '#ffffff', '#ff0900'], 
['#090300', '#0e0101', '#ce151f', '#4ea1ab', '#ffffff', '#FFFFFF', '#15cec5'], 
['#3c0c08', '#05061a', '#fd3323', '#2f7a5a', '#FFFFFF', '#FFFFFF', '#2f7a5a'], 
['#000000', '#030e17', '#ff6200', '#009dff', '#ffffff', '#FFFFFF', '#009dff'],  
['#000909', '#0d000e', '#ffbd67', '#f200ff', '#00fff2', '#FFFFFF', '#25a0ff'],  
['#080015', '#080015', '#0088ff', '#ff5e00', '#8103ff', '#FFFFFF', '#ff5e00'], 
['#080015', '#080015', '#0088ff', '#ff5e00', '#8fc0ff', '#FFFFFF', '#ff0900'], 
['#080015', '#080015', '#0088ff', '#ff7700', '#ff04f2', '#FFFFFF', '#ff7700'],   
['#000907', '#00100d', '#fe1dc1', '#ff3300', '#00ffcc', '#FFFFFF', '#1dc1fe'],   
['#030e17', '#02080d', '#ff0000', '#00657a', '#ff6200', '#FFFFFF', '#00657a'], 
['#08060f', '#0b0916', '#ff0bff', '#00aeff', '#6cd0ff', '#FFFFFF', '#00aeff'], 
['#00070e', '#00070e', '#ff5e00', '#ff0000', '#005fb2', '#FFFFFF', '#03dbd7'], 
['#00070e', '#00070e', '#ff5e00', '#0088ff', '#005fb2', '#FFFFFF', '#00a2ff'], 
['#000b0f', '#000d14', '#ff0453', '#d64603', '#039ed6', '#FFFFFF', '#fe1d22'],  
['#0f0b06', '#0f0b06', '#f96800', '#378494', '#c66520', '#FFFFFF', '#52c0d6'], 
['#0f0b06', '#0f0b06', '#f96800', '#378494', '#ffcca7', '#FFFFFF', '#00d3ff'], 
['#00070e', '#00070e', '#ff5e00', '#ff5e00', '#92ccff', '#FFFFFF', '#00a2ff'], 
['#090909', '#090909', '#b03d04', '#0477b0', '#98dbff', '#FFFFFF', '#00ccff'],  
['#0a0101', '#0a0101', '#29c6ff', '#ff2323', '#FFFFFF', '#FFFFFF', '#ff5d00'], 
['#00070e', '#00070e', '#ff5e00', '#ff009c', '#dff0ff', '#FFFFFF', '#42a4ff'], 
['#0a0000', '#0a0000', '#00ffff', '#ff0000', '#ff8000', '#FFFFFF', '#ff0000'], 
['#00060a', '#00060a', '#ffa200', '#ff006f', '#9100ff', '#FFFFFF', '#0077ff'], 
['#07080e', '#07080e', '#e04604', '#9c793e', '#00a6ed', '#FFFFFF', '#0099ff'], 
['#00152a', '#00070e', '#ff5e00', '#ff5e00', '#005fb2', '#FFFFFF', '#00a2ff'], 
['#00152d', '#000d0d', '#fe1d22', '#006bd9', '#84c1ff', '#FFFFFF', '#0381ff'],  
['#080015', '#080015', '#0088ff', '#0088ff', '#ff04f2', '#FFFFFF', '#ff04f2'], 
['#000912', '#000912', '#ff4a0b', '#00a8d1', '#006179', '#FFFFFF', '#00a8d1'], 
['#000907', '#00100d', '#ff3300', '#0294b8', '#86ffe7', '#FFFFFF', '#0294b8'], 
['#2e0a21', '#0a0200', '#ff6f01', '#24f2fd', '#24f2fd', '#FFFFFF', '#24f2fd'], 
['#00070c', '#000e18', '#ff0303', '#03ffff', '#f3fff9', '#FFFFFF', '#03ffff'],
['#00070c', '#000e18', '#03ffff', '#ff0303', '#f3fff9', '#FFFFFF', '#03ffff'],
['#00060a', '#00060a', '#ffd901', '#d901ff', '#01ffd9', '#FFFFFF', '#d901ff'], 
['#080015', '#080015', '#ff5e00', '#0088ff', '#ff5e00', '#FFFFFF', '#0088ff'],
['#000000', '#000000', '#616161', '#616161', '#ffffff', '#ffffff', '#00fffc'], 
['#000000', '#080808', '#a7a7a7', '#444444', '#ffffff', '#ffffff', '#ff8a00'], 
['#000000', '#080808', '#a7a7a7', '#444444', '#ffffff', '#ffffff', '#b8040c'], 
['#000712', '#000a1f', '#036fdb', '#0758a8', '#03b3ff', '#FFFFFF', '#ff5703'], 
['#080015', '#080015', '#f6c053', '#3ed4eb', '#eb563e', '#FFFFFF', '#3ed4eb'],  
['#000409', '#000409', '#fe1d22', '#006bd9', '#ff8b8e', '#FFFFFF', '#006bd9'],
['#1a0213', '#1a0213', '#e60ba9', '#18f0bc', '#f5e3ff', '#FFFFFF', '#18f0bc'], 
	];
}