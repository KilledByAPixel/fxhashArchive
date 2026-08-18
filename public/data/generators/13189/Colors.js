class Colors {
  constructor() {
    this.palette = int(random(1, 34.99));
    if (this.palette == 12) {
      this.eclipse = random(1);
      if (this.eclipse > 0.8) {
        this.palette = 112;
      }
    }
    if (this.palette == 18) {
      this.eclipse = random(1);
      if (this.eclipse > 0.8) {
        this.palette = 118;
      }
    }
    this.cr = random(0, 50);
    this.cg = random(0, 50);
    this.cb = random(0, 50);
    this.c1r = random(0, 150);
    this.c1g = random(0, 150);
    this.c1b = random(0, 150);
    this.c2r = random(75, 200);
    this.c2g = random(75, 200);
    this.c2b = random(75, 200);
    this.c3r = random(150, 225);
    this.c3g = random(150, 225);
    this.c3b = random(150, 225);
    this.c4r = random(175, 255);
    this.c4g = random(175, 255);
    this.c4b = random(175, 255);
    this.DarkestColor = color(this.cr, this.cg, this.cb);
    this.Darkcolor = color(this.c1r, this.c1g, this.c1b);
    this.midcolor = color(this.c2r, this.c2g, this.c2b);
    this.lightcolor = color(this.c3r, this.c3g, this.c3b);
    this.lightestcolor = color(this.c4r, this.c4g, this.c4b);
    this.transparent = color(this.c1r, this.c1g, this.c1b, 5);
    this.rgbamnt = 100;
  }
  choose() {
    if (this.palette == 1) {
      //greysketch
      canvascolor = color(247, 247, 238);
      skycolor = color(247, 247, 238);
      strokecolor = color(90);
      watercolor = color(90, 90, 90, 5);
      reflectioncolor = color(247, 247, 238);
      spherecolor = color(247, 247, 238);
      treetrunkcolor = color(247, 247, 238);
      treebranchcolor = color(90);
      plantcolor = color(247, 247, 238);
      riveredgecolor = color(247, 247, 238);
      plant2color = color(247, 247, 238);
      cloudcolor = color(247, 247, 238);
      wallcolor = color(247, 247, 238);
      noisecolor = color(90);
    } //endgreysketch
    if (this.palette == 2) {
      //Sketchbook
      canvascolor = color(247, 247, 238);
      skycolor = color(247, 247, 238);
      strokecolor = color(0);
      watercolor = color(0, 0, 0, 5);
      reflectioncolor = color(247, 247, 238);
      spherecolor = color(247, 247, 238);
      treetrunkcolor = color(247, 247, 238);
      treebranchcolor = color(0);
      plantcolor = color(247, 247, 238);
      riveredgecolor = color(247, 247, 238);
      plant2color = color(247, 247, 238);
      cloudcolor = color(247, 247, 238);
      wallcolor = color(247, 247, 238);
      noisecolor = color(0);
    } //endSketchbook
    if (this.palette == 3) {
      //GoldenHour
      canvascolor = color(238, 194, 167);
      skycolor = color(160, 195, 195);
      strokecolor = color(0);
      watercolor = color(0, 0, 0, 5);
      reflectioncolor = color(160, 195, 195);
      spherecolor = color(184, 101, 73);
      treetrunkcolor = color(184, 101, 73);
      treebranchcolor = color(0);
      plantcolor = color(224, 141, 113);
      riveredgecolor = color(238, 194, 167);
      plant2color = color(184, 101, 73);
      cloudcolor = color(238, 194, 167);
      wallcolor = color(238, 194, 167);
      noisecolor = color(0);
    } //endGoldenHour
    if (this.palette == 4) {
      //Greenblueandorange
      canvascolor = color(237, 232, 209);
      skycolor = color(198, 249, 244);
      strokecolor = color(0);
      watercolor = color(198, 249, 244, 5);
      reflectioncolor = color(255, 199, 145);
      spherecolor = color(255, 224, 145);
      treetrunkcolor = color(189, 233, 218);
      treebranchcolor = color(1, 34, 29);
      plantcolor = color(94, 185, 154);
      riveredgecolor = color(189, 233, 218);
      plant2color = color(35, 138, 102);
      cloudcolor = color(255, 199, 145);
      wallcolor = color(237, 232, 209);
      noisecolor = color(0);
    } //endGreenblueandorange
    if (this.palette == 5) {
      //purple&blue
      canvascolor = color(212, 224, 255);
      skycolor = color(218, 212, 255);
      strokecolor = color(0);
      watercolor = color(249, 221, 253, 5);
      reflectioncolor = color(212, 255, 253);
      spherecolor = color(212, 255, 253);
      treetrunkcolor = color(193, 182, 213);
      treebranchcolor = color(0);
      plantcolor = color(227, 212, 255);
      riveredgecolor = color(218, 212, 255);
      plant2color = color(193, 182, 213);
      cloudcolor = color(212, 224, 255);
      wallcolor = color(211, 182, 213);
      noisecolor = color(0);
    } //endpurple&blue
    if (this.palette == 6) {
      //Night Blue and Green
      canvascolor = color(180, 208, 221);
      skycolor = color(182, 193, 213);
      strokecolor = color(0);
      watercolor = color(0, 0, 0, 5);
      reflectioncolor = color(195, 229, 245);
      spherecolor = color(247, 247, 238);
      treetrunkcolor = color(206, 238, 244);
      treebranchcolor = color(0);
      plantcolor = color(158, 207, 202);
      riveredgecolor = color(206, 238, 244);
      plant2color = color(114, 187, 180);
      cloudcolor = color(180, 208, 221);
      wallcolor = color(199, 205, 213);
      noisecolor = color(0);
    } //endNight Blue and Green
    if (this.palette == 7) {
      //Gold
      canvascolor = color(242, 241, 222);
      skycolor = color(217, 216, 187);
      strokecolor = color(0);
      watercolor = color(0, 0, 0, 5);
      reflectioncolor = color(242, 241, 198);
      spherecolor = color(242, 241, 198);
      treetrunkcolor = color(221, 220, 187);
      treebranchcolor = color(0);
      plantcolor = color(237, 236, 214);
      riveredgecolor = color(242, 241, 222);
      plant2color = color(221, 220, 187);
      cloudcolor = color(242, 241, 222);
      wallcolor = color(242, 241, 222);
      noisecolor = color(0);
    } //endGold
    if (this.palette == 8) {
      //BloodMango
      canvascolor = color(188, 49, 69);
      skycolor = color(255, 99, 66);
      strokecolor = color(0);
      watercolor = color(88, 24, 69, 5);
      reflectioncolor = color(199, 0, 57);
      spherecolor = color(199, 0, 57);
      treetrunkcolor = color(255, 113, 113);
      treebranchcolor = color(0);
      plantcolor = color(144, 12, 63);
      riveredgecolor = color(199, 0, 57);
      plant2color = color(88, 24, 69);
      cloudcolor = color(255, 99, 66);
      wallcolor = color(188, 49, 69);
      noisecolor = color(0);
    } //endBloodMango
    if (this.palette == 9) {
      //BluePen
      canvascolor = color(247, 247, 238);
      skycolor = color(247, 247, 238);
      strokecolor = color(0, 36, 87);
      watercolor = color(0, 36, 87, 5);
      reflectioncolor = color(247, 247, 238);
      spherecolor = color(247, 247, 238);
      treetrunkcolor = color(247, 247, 238);
      treebranchcolor = color(0, 36, 87);
      plantcolor = color(247, 247, 238);
      riveredgecolor = color(247, 247, 238);
      plant2color = color(247, 247, 238);
      cloudcolor = color(247, 247, 238);
      wallcolor = color(247, 247, 238);
      noisecolor = color(0, 36, 87);
    } //endBluePen
    if (this.palette == 10) {
      //Redpen
      canvascolor = color(247, 247, 238);
      skycolor = color(247, 247, 238);
      strokecolor = color(136, 0, 0);
      watercolor = color(136, 0, 0, 5);
      reflectioncolor = color(247, 247, 238);
      spherecolor = color(247, 247, 238);
      treetrunkcolor = color(247, 247, 238);
      treebranchcolor = color(136, 0, 0);
      plantcolor = color(247, 247, 238);
      riveredgecolor = color(247, 247, 238);
      plant2color = color(247, 247, 238);
      cloudcolor = color(247, 247, 238);
      wallcolor = color(247, 247, 238);
      noisecolor = color(136, 0, 0);
    } //endRedpen
    if (this.palette == 11) {
      //Melon
      canvascolor = color(212, 242, 240);
      skycolor = color(233, 244, 242);
      strokecolor = color(0);
      watercolor = color(177, 231, 235, 5);
      reflectioncolor = color(245, 226, 239);
      spherecolor = color(245, 226, 239);
      treetrunkcolor = color(247, 232, 246);
      treebranchcolor = color(0);
      plantcolor = color(188, 230, 214);
      riveredgecolor = color(224, 255, 243);
      plant2color = color(131, 210, 180);
      cloudcolor = color(212, 242, 240);
      wallcolor = color(198, 226, 221);
      noisecolor = color(0);
    } //endMelon
    if (this.palette == 12) {
      //Dark
      canvascolor = color(40, 40, 40);
      skycolor = color(66, 66, 66);
      strokecolor = color(0);
      watercolor = color(0, 0, 0, 5);
      reflectioncolor = color(247, 247, 238);
      spherecolor = color(247, 247, 238);
      treetrunkcolor = color(247, 247, 238);
      treebranchcolor = color(0);
      plantcolor = color(130, 130, 130);
      riveredgecolor = color(155, 155, 155);
      plant2color = color(78, 78, 78);
      cloudcolor = color(40, 40, 40);
      wallcolor = color(66, 66, 66);
      noisecolor = color(247, 247, 238);
    } //endDark
    if (this.palette == 13) {
      //RGB
      canvascolor = this.lightestcolor;
      skycolor = this.lightcolor;
      strokecolor = this.DarkestColor;
      watercolor = this.transparent;
      reflectioncolor = this.midcolor;
      spherecolor = this.midcolor;
      treetrunkcolor = this.lightcolor;
      treebranchcolor = this.DarkestColor;
      plantcolor = this.lightcolor;
      riveredgecolor = this.lightestcolor;
      plant2color = this.midcolor;
      cloudcolor = this.lightestcolor;
      wallcolor = this.lightestcolor;
      noisecolor = this.DarkestColor;
    } //endRGB
    if (this.palette == 14) {
      //Green
      canvascolor = color(154, 204, 193);
      skycolor = color(154, 204, 170);
      strokecolor = color(0);
      watercolor = color(58, 116, 88, 5);
      reflectioncolor = color(171, 235, 204);
      spherecolor = color(171, 235, 204);
      treetrunkcolor = color(148, 217, 185);
      treebranchcolor = color(0);
      plantcolor = color(120, 170, 128);
      riveredgecolor = color(148, 217, 185);
      plant2color = color(61, 116, 70);
      cloudcolor = color(154, 204, 193);
      wallcolor = color(91, 141, 107);
      noisecolor = color(0);
    } //endGreen
    if (this.palette == 15) {
      //Red
      canvascolor = color(234, 178, 191);
      skycolor = color(228, 78, 113);
      strokecolor = color(0);
      watercolor = color(192, 8, 51, 5);
      reflectioncolor = color(240, 92, 127);
      spherecolor = color(240, 92, 127);
      treetrunkcolor = color(225, 155, 171);
      treebranchcolor = color(0);
      plantcolor = color(239, 139, 162);
      riveredgecolor = color(234, 178, 191);
      plant2color = color(218, 75, 108);
      cloudcolor = color(234, 178, 191);
      wallcolor = color(207, 104, 128);
      noisecolor = color(0);
    } //endRed
    if (this.palette == 16) {
      //Blue
      canvascolor = color(164, 203, 250);
      skycolor = color(30, 89, 160);
      strokecolor = color(0);
      watercolor = color(10, 39, 75, 5);
      reflectioncolor = color(77, 159, 212);
      spherecolor = color(77, 159, 212);
      treetrunkcolor = color(98, 144, 199);
      treebranchcolor = color(0);
      plantcolor = color(98, 144, 199);
      riveredgecolor = color(145, 222, 233);
      plant2color = color(68, 105, 151);
      cloudcolor = color(164, 203, 250);
      wallcolor = color(145, 184, 233);
      noisecolor = color(0);
    } //endBlue
    if (this.palette == 17) {
      //Fall
      canvascolor = color(248, 227, 193);
      skycolor = color(242, 194, 116);
      strokecolor = color(0);
      watercolor = color(181, 12, 12, 5);
      reflectioncolor = color(224, 95, 0);
      spherecolor = color(224, 95, 0);
      treetrunkcolor = color(196, 162, 90);
      treebranchcolor = color(217, 176, 0);
      plantcolor = color(213, 141, 112);
      riveredgecolor = color(247, 134, 84);
      plant2color = color(196, 101, 62);
      cloudcolor = color(248, 227, 193);
      wallcolor = color(232, 203, 144);
      noisecolor = color(0);
    } //endFall
    if (this.palette == 18) {
      //greenblue
      canvascolor = color(93, 161, 167);
      skycolor = color(44, 121, 129);
      strokecolor = color(0);
      watercolor = color(11, 71, 76, 5);
      reflectioncolor = color(121, 197, 204);
      spherecolor = color(121, 197, 204);
      treetrunkcolor = color(93, 161, 167);
      treebranchcolor = color(1, 35, 39);
      plantcolor = color(0, 103, 113);
      riveredgecolor = color(93, 161, 167);
      plant2color = color(0, 70, 76);
      cloudcolor = color(93, 161, 167);
      wallcolor = color(56, 149, 153);
      noisecolor = color(0);
    } //endgreenblue
    if (this.palette == 19) {
      //normal
      canvascolor = color(247, 237, 197);
      skycolor = color(204, 242, 241);
      strokecolor = color(0);
      watercolor = color(11, 71, 76, 5);
      reflectioncolor = color(252, 229, 165);
      spherecolor = color(252, 229, 165);
      treetrunkcolor = color(247, 247, 238);
      treebranchcolor = color(0);
      plantcolor = color(219, 229, 177);
      riveredgecolor = color(252, 229, 165);
      plant2color = color(178, 190, 126);
      cloudcolor = color(209, 232, 235);
      wallcolor = color(247, 237, 197);
      noisecolor = color(0);
    } //endnormal
    if (this.palette == 20) {
      //normal2
      canvascolor = color(239, 250, 249);
      skycolor = color(204, 210, 227);
      strokecolor = color(0);
      watercolor = color(80, 81, 117, 5);
      reflectioncolor = color(2233, 176, 138);
      spherecolor = color(233, 176, 138);
      treetrunkcolor = color(237, 235, 216);
      treebranchcolor = color(0);
      plantcolor = color(181, 235, 221);
      riveredgecolor = color(198, 247, 240);
      plant2color = color(138, 207, 189);
      cloudcolor = color(239, 250, 249);
      wallcolor = color(244, 203, 203);
      noisecolor = color(0);
    } //endnormal2
    if (this.palette == 21) {
      //normal3
      canvascolor = color(247, 247, 238);
      skycolor = color(180, 208, 223);
      strokecolor = color(0);
      watercolor = color(194, 235, 230, 5);
      reflectioncolor = color(235, 243, 246);
      spherecolor = color(238, 239, 191);
      treetrunkcolor = color(247, 247, 238);
      treebranchcolor = color(0);
      plantcolor = color(198, 214, 195);
      riveredgecolor = color(235, 243, 246);
      plant2color = color(159, 184, 156);
      cloudcolor = color(247, 247, 238);
      wallcolor = color(2219, 216, 203);
      noisecolor = color(0);
    } //endnormal3
    if (this.palette == 22) {
      //yellowpink
      canvascolor = color(231, 211, 188);
      skycolor = color(242, 243, 205);
      strokecolor = color(0);
      watercolor = color(57, 43, 0, 5);
      reflectioncolor = color(242, 239, 215);
      spherecolor = color(242, 239, 215);
      treetrunkcolor = color(247, 247, 238);
      treebranchcolor = color(57, 43, 0);
      plantcolor = color(255, 255, 213);
      riveredgecolor = color(231, 211, 188);
      plant2color = color(232, 218, 186);
      cloudcolor = color(231, 211, 188);
      wallcolor = color(223, 187, 144);
      noisecolor = color(0);
    } //endyellowpink
    if (this.palette == 23) {
      //Purple
      canvascolor = color(232, 217, 249);
      skycolor = color(192, 189, 253);
      strokecolor = color(0);
      watercolor = color(4, 0, 74, 5);
      reflectioncolor = color(204, 175, 238);
      spherecolor = color(204, 175, 238);
      treetrunkcolor = color(232, 217, 249);
      treebranchcolor = color(0);
      plantcolor = color(214, 203, 243);
      riveredgecolor = color(232, 217, 249);
      plant2color = color(193, 178, 234);
      cloudcolor = color(232, 217, 249);
      wallcolor = color(205, 203, 235);
      noisecolor = color(0);
    } //endPurple
    if (this.palette == 24) {
      //Purplemint
      canvascolor = color(232, 217, 249);
      skycolor = color(178, 232, 236);
      strokecolor = color(0);
      watercolor = color(4, 0, 74, 5);
      reflectioncolor = color(204, 175, 238);
      spherecolor = color(204, 175, 238);
      treetrunkcolor = color(232, 217, 249);
      treebranchcolor = color(0);
      plantcolor = color(203, 235, 228);
      riveredgecolor = color(224, 242, 244);
      plant2color = color(160, 214, 202);
      cloudcolor = color(232, 217, 249);
      wallcolor = color(205, 203, 235);
      noisecolor = color(0);
    } //endPurplemint
    if (this.palette == 25) {
      //green&orange
      canvascolor = color(243, 242, 225);
      skycolor = color(223, 205, 168);
      strokecolor = color(0);
      watercolor = color(0, 21, 23, 5);
      reflectioncolor = color(223, 205, 168);
      spherecolor = color(203, 235, 228);
      treetrunkcolor = color(244, 244, 225);
      treebranchcolor = color(0);
      plantcolor = color(203, 235, 228);
      riveredgecolor = color(243, 242, 225);
      plant2color = color(160, 214, 202);
      cloudcolor = color(243, 242, 225);
      wallcolor = color(241, 241, 204);
      noisecolor = color(0);
    } //endgreen&orange
    if (this.palette == 26) {
      //lightblue sketch
      canvascolor = color(200, 225, 230);
      skycolor = color(200, 225, 230);
      strokecolor = color(0);
      watercolor = color(0, 0, 0, 5);
      reflectioncolor = color(200, 225, 230);
      spherecolor = color(200, 225, 230);
      treetrunkcolor = color(200, 225, 230);
      treebranchcolor = color(0);
      plantcolor = color(200, 225, 230);
      riveredgecolor = color(200, 225, 230);
      plant2color = color(200, 225, 230);
      cloudcolor = color(200, 225, 230);
      wallcolor = color(200, 225, 230);
      noisecolor = color(0);
    } //lightblue sketch
    if (this.palette == 27) {
      //lightgreensketch
      canvascolor = color(205, 230, 200);
      skycolor = color(205, 230, 200);
      strokecolor = color(0);
      watercolor = color(0, 0, 0, 5);
      reflectioncolor = color(205, 230, 200);
      spherecolor = color(205, 230, 200);
      treetrunkcolor = color(205, 230, 200);
      treebranchcolor = color(0);
      plantcolor = color(205, 230, 200);
      riveredgecolor = color(205, 230, 200);
      plant2color = color(205, 230, 200);
      cloudcolor = color(205, 230, 200);
      wallcolor = color(205, 230, 200);
      noisecolor = color(0);
    } //endlightgreensketch
    if (this.palette == 28) {
      //pinksketch
      canvascolor = color(234, 182, 182);
      skycolor = color(234, 182, 182);
      strokecolor = color(0);
      watercolor = color(0, 0, 0, 5);
      reflectioncolor = color(234, 182, 182);
      spherecolor = color(234, 182, 182);
      treetrunkcolor = color(234, 182, 182);
      treebranchcolor = color(0);
      plantcolor = color(234, 182, 182);
      riveredgecolor = color(234, 182, 182);
      plant2color = color(234, 182, 182);
      cloudcolor = color(234, 182, 182);
      wallcolor = color(234, 182, 182);
      noisecolor = color(0);
    } //endpinksketch
    if (this.palette == 29) {
      //inversegreen
      canvascolor = color(111, 154, 116);
      skycolor = color(111, 154, 116);
      strokecolor = color(247, 247, 238);
      watercolor = color(247, 247, 238, 5);
      reflectioncolor = color(111, 154, 116);
      spherecolor = color(111, 154, 116);
      treetrunkcolor = color(111, 154, 116);
      treebranchcolor = color(247, 247, 238);
      plantcolor = color(111, 154, 116);
      riveredgecolor = color(111, 154, 116);
      plant2color = color(111, 154, 116);
      cloudcolor = color(111, 154, 116);
      wallcolor = color(111, 154, 116);
      noisecolor = color(247, 247, 238);
    } //endinversegreen
    if (this.palette == 30) {
      //inversenavy
      canvascolor = color(33, 70, 106);
      skycolor = color(33, 70, 106);
      strokecolor = color(247, 247, 238);
      watercolor = color(247, 247, 238, 5);
      reflectioncolor = color(33, 70, 106);
      spherecolor = color(33, 70, 106);
      treetrunkcolor = color(33, 70, 106);
      treebranchcolor = color(247, 247, 238);
      plantcolor = color(33, 70, 106);
      riveredgecolor = color(33, 70, 106);
      plant2color = color(33, 70, 106);
      cloudcolor = color(33, 70, 106);
      wallcolor = color(33, 70, 106);
      noisecolor = color(247, 247, 238);
    } //endinversenavy
    if (this.palette == 31) {
      //peachandbluelines
      canvascolor = color(249, 233, 171);
      skycolor = color(249, 233, 171);
      strokecolor = color(67, 154, 168);
      watercolor = color(67, 154, 168, 5);
      reflectioncolor = color(249, 233, 171);
      spherecolor = color(249, 233, 171);
      treetrunkcolor = color(249, 233, 171);
      treebranchcolor = color(67, 154, 168);
      plantcolor = color(249, 233, 171);
      riveredgecolor = color(249, 233, 171);
      plant2color = color(249, 233, 171);
      cloudcolor = color(249, 233, 171);
      wallcolor = color(249, 233, 171);
      noisecolor = color(67, 154, 168);
    } //endpeachandbluelines
    if (this.palette == 32) {
      //greenandbluelines
      canvascolor = color(203, 236, 194);
      skycolor = color(203, 236, 194);
      strokecolor = color(67, 154, 168);
      watercolor = color(67, 154, 168, 5);
      reflectioncolor = color(203, 236, 194);
      spherecolor = color(203, 236, 194);
      treetrunkcolor = color(203, 236, 194);
      treebranchcolor = color(67, 154, 168);
      plantcolor = color(203, 236, 194);
      riveredgecolor = color(203, 236, 194);
      plant2color = color(203, 236, 194);
      cloudcolor = color(203, 236, 194);
      wallcolor = color(203, 236, 194);
      noisecolor = color(67, 154, 168);
    } //endgreenandbluelines
    if (this.palette == 33) {
      //purpleandredlines
      canvascolor = color(180, 188, 225);
      skycolor = color(180, 188, 225);
      strokecolor = color(153, 50, 50);
      watercolor = color(153, 50, 50, 5);
      reflectioncolor = color(180, 188, 225);
      spherecolor = color(180, 188, 225);
      treetrunkcolor = color(180, 188, 225);
      treebranchcolor = color(153, 50, 50);
      plantcolor = color(180, 188, 225);
      riveredgecolor = color(180, 188, 225);
      plant2color = color(180, 188, 225);
      cloudcolor = color(180, 188, 225);
      wallcolor = color(180, 188, 225);
      noisecolor = color(153, 50, 50);
    } //endpurpleandredlines
    if (this.palette == 34) {
      //FullRGB
      canvascolor = color(random(255), random(255), random(255));
      skycolor = color(random(255), random(255), random(255));
      strokecolor = color(random(255), random(255), random(255));
      watercolor = color(random(255), random(255), random(255), 5);
      reflectioncolor = color(random(255), random(255), random(255));
      spherecolor = color(random(255), random(255), random(255));
      treetrunkcolor = color(random(255), random(255), random(255));
      treebranchcolor = color(random(255), random(255), random(255));
      plantcolor = color(random(255), random(255), random(255));
      riveredgecolor = color(random(255), random(255), random(255));
      plant2color = color(random(255), random(255), random(255));
      cloudcolor = color(random(255), random(255), random(255));
      wallcolor = color(random(255), random(255), random(255));
      noisecolor = color(random(255), random(255), random(255));
    } //endFullRGB
    if (this.palette == 112) {
      //DarkEclipse
      canvascolor = color(40, 40, 40);
      skycolor = color(66, 66, 66);
      strokecolor = color(0);
      watercolor = color(0, 0, 0, 5);
      reflectioncolor = color(255, 65, 20);
      spherecolor = color(255, 65, 20);
      treetrunkcolor = color(247, 247, 238);
      treebranchcolor = color(0);
      plantcolor = color(130, 130, 130);
      riveredgecolor = color(155, 155, 155);
      plant2color = color(78, 78, 78);
      cloudcolor = color(40, 40, 40);
      wallcolor = color(66, 66, 66);
      noisecolor = color(247, 247, 238);
    } //endDarkEclipse
    if (this.palette == 118) {
      //greenblueEclipse
      canvascolor = color(93, 161, 167);
      skycolor = color(44, 121, 129);
      strokecolor = color(0);
      watercolor = color(89, 8, 8, 5);
      reflectioncolor = color(225, 35, 0);
      spherecolor = color(225, 35, 0);
      treetrunkcolor = color(93, 161, 167);
      treebranchcolor = color(1, 35, 39);
      plantcolor = color(0, 103, 113);
      riveredgecolor = color(93, 161, 167);
      plant2color = color(0, 70, 76);
      cloudcolor = color(93, 161, 167);
      wallcolor = color(56, 149, 153);
      noisecolor = color(0);
    } //endgreenblueEclipse
  } //////////////////////////////////////////////////////////////////////////////////////////////////////////
}
