function setColors() {
  let randomCheck = random(0, 20);

  black = color(0, 100, 0, 1);
  white = color(0, 0, 100, 1);
  let whiteAlpha = 0.03;
  let blackAlpha = 0.1;
  cTranslucentAlpha = 0.05;

  fillBlack = color(0, 100, 0, blackAlpha);
  fillBlack2 = color(0, 100, 0, random(0.7, 0.9));
  blackStroke = color(0, 100, 0, random(0.4, 0.5));
  blackStroke2 = color(0, 100, 0, 0.05);
  fillGray = color(0, 1, 53, 0.05);
  fillWhite = color(0, 0, 100, random(0.02, 0.1));
  fillWhite = color(0, 0, 100, whiteAlpha);
  fillTransparent = color(0, 0, 0, random(0.05, 0.15));
  
  
    // filledStrokeCol_Alpha = filledStrokeCol_Alpha;
    // emptyStrokeCol_Alpha = emptyStrokeCol_Alpha * sizeAdjustAlpha;

}


function randomColorPick(r2) {
  gc1 = random(c);
  gc2 = random(c2_9);
  gc3 = random(c);
  gc4 = random(c);
  gc5 = random(c);
  gc6 = random(c);
  gc7 = random(c);
  gc8 = random(c);
  eclosionColor = c1;
  eclosionColor.setAlpha(0.6);
  strokeColorUniform = random(c);
  strokeColorUniform = pc24l.indexOf(gc1) >=0  ? random(pc25d)
          : random(pc24l);
  strokeColorUniform2 = random(c);
  strokeColorUniform2 = pc24l.indexOf(gc1) >=0  ? random(pc25d)
          : random(pc24l);

}

function canvasColors() {
    rbackground = random(0, 1);
  if (rbackground <= 0.4) {
    backgroundColor = random(pc12A);
    canvasColorName = "Dark";
  } else if (rbackground <= 0.8) {
    backgroundColor = random(pc11A);
    canvasColorName = "Light";
  } else if (rbackground <= 1) {
    backgroundColor = black;
    canvasColorName = "Black";
  }
    backgroundColor.setAlpha(1);
}


function chooseColor(r2) {
   if (r2 <= 0.02) {
    colorName = "Black && White"; //             26
    c1 = color(0, 0, 0, col_Alpha);
    c2 = color(0, 0, 0, col_Alpha);
    c3 = color(0, 0, 0, col_Alpha);
    c4 = color(0, 0, 0, col_Alpha);
    c5 = color(0, 0, 0, col_Alpha);
    c6 = color(0, 0, 100, col_Alpha);
    c7 = color(0, 0, 100, col_Alpha);
    c8 = color(0, 0, 100, col_Alpha);
    c9 = color(0, 0, 100, col_Alpha);
    c10 = color(0, 0, 100, col_Alpha);
    c11 = color(0, 0, 100, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];

  } else if (r2 <= 0.03) {
    colorName = "Spring"; //              25
    c1 = color(231, 28, 18, col_Alpha);
    c2 = color(243, 32, 51, col_Alpha);
    c3 = color(278, 43, 64, col_Alpha);
    c4 = color(33, 68, 59, col_Alpha);
    c5 = color(210, 65, 76, col_Alpha);
    c6 = color(40, 29, 74, col_Alpha);
    c7 = color(41, 70, 98, col_Alpha);
    c8 = color(11, 62, 95, col_Alpha);
    c9 = color(180, 27, 93, col_Alpha);
    c10 = color(37, 24, 96, col_Alpha);
    c11 = color(37, 24, 96, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];
  } else if (r2 <= 0.04) {
    colorName = "Summer"; //                   24
    c1 = color(214, 58, 55, col_Alpha);
    c2 = color(20, 72, 74, col_Alpha);
    c3 = color(196, 34, 73, col_Alpha);
    c4 = color(44, 61, 98, col_Alpha);
    c5 = color(9, 26, 78, col_Alpha);
    c6 = color(197, 19, 78, col_Alpha);
    c7 = color(38, 39, 94, col_Alpha);
    c8 = color(15, 15, 84, col_Alpha);
    c9 = color(36, 24, 93, col_Alpha);
    c10 = color(37, 5, 95, col_Alpha);
    c11 = color(37, 5, 95, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];
  } else if (r2 <= 0.05) {
    colorName = "Winter"; //                   23
    c1 = color(220, 57, 33, col_Alpha);
    c2 = color(225, 23, 55, col_Alpha);
    c3 = color(223, 26, 83, col_Alpha);
    c4 = color(220, 23, 83, col_Alpha);
    c5 = color(225, 15, 86, col_Alpha);
    c6 = color(210, 14, 89, col_Alpha);
    c7 = color(204, 17, 93, col_Alpha);
    c8 = color(216, 8, 94, col_Alpha);
    c9 = color(240, 3, 96, col_Alpha);
    c10 = color(240, 3, 99, col_Alpha);
    c11 = color(240, 3, 99, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];   
    
  } else if (r2 <= 0.06) {
    colorName = "Autumn"; //      Gizzard                  22
    c1 = color(319, 39, 16, col_Alpha);
    c2 = color(71, 28, 31, col_Alpha);
    c3 = color(120, 3, 31, col_Alpha);
    c4 = color(26, 57, 40, col_Alpha);
    c5 = color(17, 65, 67, col_Alpha);
    c6 = color(79, 35, 45, col_Alpha);
    c7 = color(45, 48, 54, col_Alpha);
    c8 = color(126, 8, 47, col_Alpha);
    c9 = color(41, 58, 78, col_Alpha);
    c10 = color(65, 35, 63, col_Alpha);
    c11 = color(65, 35, 63, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];
    
   } else if (r2 <= 0.08) {
    colorName = "Pie !== PI"; //     or "Pie !== PI"    21
    c1 = color(217, 69, 36, col_Alpha);
    c2 = color(23, 44, 29, col_Alpha);
    c3 = color(206, 27, 49, col_Alpha);
    c4 = color(212, 62, 54, col_Alpha);
    c5 = color(210, 49, 64, col_Alpha);
    c6 = color(358, 67, 84, col_Alpha);
    c7 = color(48, 4, 53, col_Alpha);
    c8 = color(194, 45, 62, col_Alpha);
    c9 = color(59, 21, 82, col_Alpha);
    c10 = color(187, 37, 70, col_Alpha);
    c11 = color(187, 37, 70, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];    
     
  } else if (r2 <= 0.16) {
    colorName = "Cake Batter"; //                 12
    c1 = color(215, 63, 41, col_Alpha);
    c2 = color(286, 19, 44, col_Alpha);
    c3 = color(172, 72, 64, col_Alpha);
    c4 = color(196, 31, 71, col_Alpha);
    c5 = color(354, 18, 68, col_Alpha);
    c6 = color(33, 49, 95, col_Alpha);
    c7 = color(42, 56, 88, col_Alpha);
    c8 = color(149, 11, 82, col_Alpha);
    c9 = color(12, 33, 95, col_Alpha);
    c10 = color(33, 11, 87, col_Alpha);
    c11 = color(33, 11, 87, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];
  }   else if (r2 <= 0.24) {
    colorName = "Jocund"; //             5
    c1 = color(180, 15, 5, col_Alpha);
    c2 = color(194, 63, 55, col_Alpha);
    c3 = color(167, 96, 67, col_Alpha);
    c4 = color(319, 46, 62, col_Alpha);
    c5 = color(0, 29, 68, col_Alpha);
    c6 = color(36, 70, 93, col_Alpha);
    c7 = color(194, 61, 92, col_Alpha);
    c8 = color(345, 41, 92, col_Alpha);
    c9 = color(49, 22, 80, col_Alpha);
    c10 = color(51, 23, 95, col_Alpha);
    c11 = color(51, 23, 95, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];
    
  } else if (r2 <= 0.28) {
    colorName = "Lanna"; //               27
    c1 = color(350, 12, 38, col_Alpha);
    c2 = color(202, 35, 37, col_Alpha);
    c3 = color(3, 57, 44, col_Alpha);
    c4 = color(204, 38, 47, col_Alpha);
    c5 = color(0, 47, 67, col_Alpha);
    c6 = color(24, 4, 55, col_Alpha);
    c7 = color(197, 24, 68, col_Alpha);
    c8 = color(353, 15, 69, col_Alpha);
    c9 = color(185, 14, 69, col_Alpha);
    c10 = color(20, 5, 73, col_Alpha);
    c11 = color(20, 5, 73, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];
  
  } else if (r2 <= 0.32) {
    colorName = "Dune Lakes"; //                   20
    c1 = color(300, 5, 29, col_Alpha);
    c2 = color(210, 70, 34, col_Alpha);
    c3 = color(40, 31, 38, col_Alpha);
    c4 = color(170, 53, 40, col_Alpha);
    c5 = color(159, 22, 54, col_Alpha);
    c6 = color(180, 18, 69, col_Alpha);
    c7 = color(156, 22, 68, col_Alpha);
    c8 = color(60, 2, 72, col_Alpha);
    c9 = color(148, 8, 80, col_Alpha);
    c10 = color(42, 5, 85, col_Alpha);
    c11 = color(42, 5, 85, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];
    
  } else if (r2 <= 0.36) {
    colorName = "Water + Clay = "; //                   19
    c1 = color(160, 6, 18, col_Alpha);
    c2 = color(187, 45, 29, col_Alpha);
    c3 = color(3, 22, 41, col_Alpha);
    c4 = color(179, 45, 39, col_Alpha);
    c5 = color(189, 70, 48, col_Alpha);
    c6 = color(8, 44, 74, col_Alpha);
    c7 = color(179, 45, 58, col_Alpha);
    c8 = color(186, 71, 67, col_Alpha);
    c9 = color(7, 34, 90, col_Alpha);
    c10 = color(353, 5, 78, col_Alpha);
    c11 = color(353, 5, 78, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];

  } else if (r2 <= 0.40) {
    colorName = "Ablaze"; //                   18
    c1 = color(25, 84, 27, col_Alpha);
    c2 = color(24, 80, 47, col_Alpha);
    c3 = color(10, 97, 74, col_Alpha);
    c4 = color(16, 100, 82, col_Alpha);
    c5 = color(23, 91, 85, col_Alpha);
    c6 = color(31, 55, 68, col_Alpha);
    c7 = color(38, 94, 100, col_Alpha);
    c8 = color(46, 66, 97, col_Alpha);
    c9 = color(46, 48, 100, col_Alpha);
    c10 = color(52, 22, 97, col_Alpha);
    c11 = color(52, 22, 97, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];

  } else if (r2 <= 0.44) {
    colorName = "Velvet && Cream"; //           17
    c1 = color(323, 39, 41, col_Alpha);
    c2 = color(250, 35, 71, col_Alpha);
    c3 = color(322, 29, 52, col_Alpha);
    c4 = color(290, 32, 62, col_Alpha);
    c5 = color(158, 25, 63, col_Alpha);
    c6 = color(274, 27, 80, col_Alpha);
    c7 = color(329, 25, 85, col_Alpha);
    c8 = color(303, 22, 93, col_Alpha);
    c9 = color(282, 6, 87, col_Alpha);
    c10 = color(323, 10, 93, col_Alpha);
    c11 = color(323, 10, 93, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];
    
  } else if (r2 <= 0.48) {
    colorName = "Concrete Jungle"; //          16
    c1 = color(0, 0, 27, col_Alpha);
    c2 = color(312, 19, 41, col_Alpha);
    c3 = color(0, 0, 33, col_Alpha);
    c4 = color(250, 33, 56, col_Alpha);
    c5 = color(150, 28, 45, col_Alpha);
    c6 = color(0, 0, 39, col_Alpha);
    c7 = color(351, 23, 49, col_Alpha);
    c8 = color(0, 0, 52, col_Alpha);
    c9 = color(184, 35, 63, col_Alpha);
    c10 = color(0, 0, 71, col_Alpha);
    c11 = color(0, 0, 71, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];
    
  } else if (r2 <= 0.52) {
    colorName = "Understated"; //             15
    c1 = color(18, 24, 28, col_Alpha);
    c2 = color(359, 61, 80, col_Alpha);
    c3 = color(172, 72, 64, col_Alpha);
    c4 = color(40, 76, 95, col_Alpha);
    c5 = color(184, 18, 68, col_Alpha);
    c6 = color(9, 31, 80, col_Alpha);
    c7 = color(32, 33, 89, col_Alpha);
    c8 = color(13, 20, 87, col_Alpha);
    c9 = color(148, 14, 85, col_Alpha);
    c10 = color(30, 8, 92, col_Alpha);
    c11 = color(30, 8, 92, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];

  } else if (r2 <= 0.56) {
    colorName = "Dimmet"; //                   14
    c1 = color(292, 51, 40, col_Alpha);
    c2 = color(237, 61, 61, col_Alpha);
    c3 = color(332, 67, 62, col_Alpha);
    c4 = color(257, 62, 45, col_Alpha);
    c5 = color(298, 48, 64, col_Alpha);
    c6 = color(256, 45, 77, col_Alpha);
    c7 = color(36, 65, 98, col_Alpha);
    c8 = color(16, 56, 96, col_Alpha);
    c9 = color(316, 18, 84, col_Alpha);
    c10 = color(20, 32, 97, col_Alpha);
    c11 = color(20, 32, 97, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];
      
  } else if (r2 <= 0.60) {
    colorName = "Cerise && Smoke"; //               13
    c1 = color(173, 9, 35, col_Alpha);
    c2 = color(350, 67, 60, col_Alpha);
    c3 = color(350, 71, 77, col_Alpha);
    c4 = color(0, 20, 60, col_Alpha);
    c5 = color(0, 4, 51, col_Alpha);
    c6 = color(8, 12, 47, col_Alpha);
    c7 = color(60, 6, 52, col_Alpha);
    c8 = color(30, 9, 67, col_Alpha);
    c9 = color(0, 9, 67, col_Alpha);
    c10 = color(8, 22, 93, col_Alpha);
    c11 = color(8, 22, 93, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];

  } else if (r2 <= 0.64) {
    colorName = "Crepuscule"; //                     11
    c1 = color(120, 8, 14, col_Alpha);
    c2 = color(231, 67, 34, col_Alpha);
    c3 = color(223, 77, 46, col_Alpha);
    c4 = color(217, 49, 55, col_Alpha);
    c5 = color(202, 32, 63, col_Alpha);
    c6 = color(156, 10, 59, col_Alpha);
    c7 = color(49, 76, 76, col_Alpha);
    c8 = color(217, 32, 78, col_Alpha);
    c9 = color(133, 14, 69, col_Alpha);
    c10 = color(69, 7, 76, col_Alpha);
    c11 = color(69, 7, 76, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];
    
  } else if (r2 <= 0.68) {
    colorName = "Swell"; //                           10
    c1 = color(240, 33, 18, col_Alpha);
    c2 = color(23, 21, 33, col_Alpha);
    c3 = color(240, 2, 44, col_Alpha);
    c4 = color(217, 47, 55, col_Alpha);
    c5 = color(40, 36, 39, col_Alpha);
    c6 = color(214, 21, 78, col_Alpha);
    c7 = color(210, 1, 56, col_Alpha);
    c8 = color(40, 29, 57, col_Alpha);
    c9 = color(37, 13, 72, col_Alpha);
    c10 = color(20, 4, 81, col_Alpha);
    c11 = color(20, 4, 81, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];

  } else if (r2 <= 0.72) {
    colorName = "Ave"; //  Nerve Cord         9
    c1 = color(32, 72, 21, col_Alpha);
    c2 = color(151, 42, 20, col_Alpha);
    c3 = color(43, 67, 39, col_Alpha);
    c4 = color(127, 8, 43, col_Alpha);
    c5 = color(231, 34, 64, col_Alpha);
    c6 = color(7, 77, 89, col_Alpha);
    c7 = color(70, 45, 57, col_Alpha);
    c8 = color(90, 30, 71, col_Alpha);
    c9 = color(44, 62, 88, col_Alpha);
    c10 = color(90, 30, 71, col_Alpha);
    c11 = color(90, 30, 71, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];
  } else if (r2 <= 0.76) {
    colorName = "Caterwaul"; //       Dormal Vessel        8
    c1 = color(120, 23, 17, col_Alpha);
    c2 = color(152, 22, 34, col_Alpha);
    c3 = color(180, 22, 40, col_Alpha);
    c4 = color(42, 38, 38, col_Alpha);
    c5 = color(23, 76, 80, col_Alpha);
    c6 = color(194, 39, 62, col_Alpha);
    c7 = color(31, 51, 57, col_Alpha);
    c8 = color(17, 99, 78, col_Alpha);
    c9 = color(75, 26, 66, col_Alpha);
    c10 = color(36, 25, 93, col_Alpha);
    c11 = color(36, 25, 93, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];
  } else if (r2 <= 0.8) {
    colorName = "Pigment Nation"; //  Nerve Cord          7
    c1 = color(30, 92, 28, col_Alpha);
    c2 = color(0, 47, 45, col_Alpha);
    c3 = color(217, 42, 47, col_Alpha);
    c4 = color(342, 38, 61, col_Alpha);
    c5 = color(155, 38, 58, col_Alpha);
    c6 = color(189, 13, 56, col_Alpha);
    c7 = color(43, 85, 78, col_Alpha);
    c8 = color(35, 60, 93, col_Alpha);
    c9 = color(313, 24, 77, col_Alpha);
    c10 = color(24, 4, 87, col_Alpha);
    c11 = color(24, 4, 87, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];
  } else if (r2 <= 0.84) {
    colorName = "American Khaki"; //    - Ventral Vessel    6
    c1 = color(300, 50, 4, col_Alpha);
    c2 = color(21, 43, 21, col_Alpha);
    c3 = color(224, 54, 40, col_Alpha);
    c4 = color(120, 10, 27, col_Alpha);
    c5 = color(7, 78, 60, col_Alpha);
    c6 = color(28, 47, 40, col_Alpha);
    c7 = color(225, 53, 63, col_Alpha);
    c8 = color(221, 33, 70, col_Alpha);
    c9 = color(32, 39, 73, col_Alpha);
    c10 = color(56, 6, 97, col_Alpha);
    c11 = color(56, 6, 97, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];

  } else if (r2 <= 0.88) {
    colorName = "Sanguine"; //   - Lateral Nerve    4
    c1 = color(206, 27, 10, col_Alpha);
    c2 = color(28, 70, 24, col_Alpha);
    c3 = color(147, 17, 25, col_Alpha);
    c4 = color(216, 69, 43, col_Alpha);
    c5 = color(27, 72, 44, col_Alpha);
    c6 = color(155, 35, 48, col_Alpha);
    c7 = color(212, 71, 73, col_Alpha);
    c8 = color(3, 70, 97, col_Alpha);
    c9 = color(154, 33, 80, col_Alpha);
    c10 = color(40, 31, 98, col_Alpha);
    c11 = color(40, 31, 98, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];

  } else if (r2 <= 0.92) {
    colorName = "Eye Candy"; //           3
    c1 = color(32, 28, 24, col_Alpha);
    c2 = color(25, 49, 38, col_Alpha);
    c3 = color(60, 11, 38, col_Alpha);
    c4 = color(154, 50, 48, col_Alpha);
    c5 = color(160, 51, 55, col_Alpha);
    c6 = color(6, 70, 87, col_Alpha);
    c7 = color(37, 21, 53, col_Alpha);
    c8 = color(160, 56, 67, col_Alpha);
    c9 = color(36, 65, 93, col_Alpha);
    c10 = color(35, 19, 80, col_Alpha);
    c11 = color(35, 19, 80, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];
  } else if (r2 <= 0.96) {
    colorName = "Fete"; //               2
    c1 = color(73, 24, 15, col_Alpha);
    c2 = color(208, 69, 49, col_Alpha);
    c3 = color(129, 59, 73, col_Alpha);
    c4 = color(29, 15, 53, col_Alpha);
    c5 = color(200, 79, 83, col_Alpha);
    c6 = color(3, 72, 94, col_Alpha);
    c7 = color(16, 47, 98, col_Alpha);
    c8 = color(58, 91, 94, col_Alpha);
    c9 = color(90, 9, 74, col_Alpha);
    c10 = color(90, 6, 98, col_Alpha);
    c11 = color(90, 6, 98, cTranslucentAlpha);
    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];
  } else if (r2 <= 1) {
    colorName = "Enervated"; //               1
    c1 = color(7, 75, 41, col_Alpha);
    c2 = color(41, 24, 35, col_Alpha);
    c3 = color(60, 18, 45, col_Alpha);
    c4 = color(52, 86, 73, col_Alpha);
    c5 = color(29, 29, 58, col_Alpha);
    c6 = color(180, 41, 45, col_Alpha);  //180, 41, 45
    c7 = color(60, 22, 58, col_Alpha);
    c8 = color(18, 37, 86, col_Alpha);
    c9 = color(60, 19, 67, col_Alpha);
    c10 = color(55, 16, 83, col_Alpha);
    c11 = color(55, 16, 83, cTranslucentAlpha);

    c = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
    c2_9 = [c2, c3, c4, c5, c6, c7, c8, c9];
  }

  pc1A = [c10, c2, c3, c4, c5, c6, c7, c8, c9];
  pc2A = [c1, c10, c3, c4, c5, c6, c7, c8, c9];
  pc3A = [c1, c2, c10, c4, c5, c6, c7, c8, c9];
  pc4A = [c1, c2, c3, c10, c5, c6, c7, c8, c9];
  pc5A = [c1, c2, c3, c4, c10, c6, c7, c8, c9];
  pc6A = [c1, c2, c3, c4, c5, c10, c7, c8, c9];
  pc7A = [c1, c2, c3, c4, c5, c6, c10, c8, c9];
  pc8A = [c1, c2, c3, c4, c5, c6, c7, c10, c9];
  pc9A = [c1, c2, c3, c4, c5, c6, c7, c8, c10];
  pc10A = [c1, c2, c3, c4, c5, c6, c7, c8, c9];
  pc11A = [c6, c7, c8, c9, c10];
  pc12A = [c1, c2, c3, c4, c5];
  fillColorsA = [c2, c3, c4, c5, c6, c7, c8, c9];
  fillDark = [c2, c3, c4, c5];
  fillLight = [c6, c7, c8, c9];
  strokeColorsA = [c1, c10];

  pc24l = [c10, c6, c7, c8, c9];
  pc25d = [c1, c2, c3, c4, c5];

}
