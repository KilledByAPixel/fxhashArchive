class Colors {
  constructor() {
    this.palette = int(random(1, 21.99));
  }
  choose() {
    if (this.palette == 1) {
      fillcolorbg = color(240, 240, 233);
      fillcolorbg2 = color(240, 240, 233);
      fillcolorblockleft = color(240, 240, 233);
      fillcolorblockright = color(240, 240, 233);
      fillcolorpattern = color(240, 240, 233);
      fillcolorpattern2 = color(240, 240, 233);
      fillcolorgrass = color(240, 240, 233);
      fillcolorplant = color(200, 200, 193);
      fillcolorflower = color(240, 240, 233);
      fillcolorflower2 = color(0);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 0;
      g = 0;
      b = 0;
      r2 = 0;
      g2 = 0;
      b2 = 0;
      strokecolor = color(r, g, b);
      strokecolorshadows = color(0, 0, 0);
      dotscolorstroke = strokecolor;
      dotscolor = strokecolor;
    } //endtestpalette

    if (this.palette == 2) {
      //sketchpad
      fillcolorbg = color(240, 240, 233);
      fillcolorbg2 = color(240, 240, 233);
      fillcolorblockleft = color(240, 240, 233);
      fillcolorblockright = color(240, 240, 233);
      fillcolorpattern = color(240, 240, 233);
      fillcolorpattern2 = color(240, 240, 233);
      fillcolorgrass = color(240, 240, 233);
      fillcolorplant = color(200, 200, 193);
      fillcolorflower = color(240, 240, 233);
      fillcolorflower2 = color(0);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 0;
      g = 0;
      b = 0;
      r2 = 0;
      g2 = 0;
      b2 = 0;
      strokecolor = color(r, g, b);
      strokecolorshadows = color(0, 0, 0);
      dotscolorstroke = strokecolor;
      dotscolor = strokecolor;
    } //endsketchpad

    if (this.palette == 3) {
      //GREY
      fillcolorbg = color(231);
      fillcolorbg2 = color(100);
      fillcolorblockleft = color(212);
      fillcolorblockright = color(231);
      fillcolorpattern = color(231);
      fillcolorpattern2 = color(100);
      fillcolorgrass = color(200);
      fillcolorplant = color(160);
      fillcolorflower = color(231);
      fillcolorflower2 = color(40);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 0;
      g = 0;
      b = 0;
      r2 = 0;
      g2 = 0;
      b2 = 0;
      strokecolor = color(r, g, b);
      strokecolorshadows = color(0, 0, 0);
      dotscolorstroke = strokecolor;
      dotscolor = strokecolor;
    } //endGREY

    if (this.palette == 4) {
      //BLUE
      fillcolorbg = color(231);
      fillcolorbg2 = color(160, 198, 203);
      fillcolorblockleft = color(215, 231, 233);
      fillcolorblockright = color(239, 245, 246);
      fillcolorpattern = color(192, 209, 211);
      fillcolorpattern2 = color(231);
      fillcolorgrass = color(177, 200, 203);
      fillcolorplant = color(137, 160, 163);
      fillcolorflower = color(231);
      fillcolorflower2 = color(177, 200, 203);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 0;
      g = 0;
      b = 0;
      r2 = 0;
      g2 = 0;
      b2 = 0;
      strokecolor = color(r, g, b);
      strokecolorshadows = color(0, 0, 0);
      dotscolorstroke = strokecolor;
      dotscolor = color(231);
    } //endBLUE

    if (this.palette == 5) {
      //sketchred
      fillcolorbg = color(240, 240, 233);
      fillcolorbg2 = color(200, 200, 193);
      fillcolorblockleft = color(240, 240, 233);
      fillcolorblockright = color(240, 240, 233);
      fillcolorpattern = color(147, 49, 49);
      fillcolorpattern2 = color(255, 243, 0);
      fillcolorgrass = color(236, 244, 221);
      fillcolorplant = color(196, 204, 181);
      fillcolorflower = color(158, 202, 255);
      fillcolorflower2 = color(0);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 0;
      g = 0;
      b = 0;
      r2 = 0;
      g2 = 0;
      b2 = 0;
      strokecolor = color(r, g, b);
      strokecolorshadows = color(0, 0, 0);
      dotscolorstroke = strokecolor;
      dotscolor = color(255, 243, 0);
    } //endsketchred

    if (this.palette == 6) {
      //Blue Lines
      fillcolorbg = color(240, 240, 233);
      fillcolorbg2 = color(0, 29, 65);
      fillcolorblockleft = color(240, 240, 233);
      fillcolorblockright = color(240, 240, 233);
      fillcolorpattern = color(240, 240, 233);
      fillcolorpattern2 = color(240, 240, 233);
      fillcolorgrass = color(240, 240, 233);
      fillcolorplant = color(240, 240, 233);
      fillcolorflower = color(240, 240, 233);
      fillcolorflower2 = color(0, 29, 65);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 13;
      g = 61;
      b = 120;
      r2 = 13;
      g2 = 61;
      b2 = 120;
      strokecolor = color(240, 240, 233);
      strokecolorshadows = color(0, 29, 65);
      dotscolorstroke = strokecolor;
      dotscolor = color(240, 240, 233);
    } //endBlue Lines

    if (this.palette == 7) {
      //Red Lines
      fillcolorbg = color(240, 240, 233);
      fillcolorbg2 = color(134, 14, 14);
      fillcolorblockleft = color(240, 240, 233);
      fillcolorblockright = color(240, 240, 233);
      fillcolorpattern = color(240, 240, 233);
      fillcolorpattern2 = color(240, 240, 233);
      fillcolorgrass = color(240, 240, 233);
      fillcolorplant = color(240, 240, 233);
      fillcolorflower = color(240, 240, 233);
      fillcolorflower2 = color(240, 240, 233);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 134;
      g = 14;
      b = 14;
      r2 = 134;
      g2 = 14;
      b2 = 14;
      strokecolor = color(65, 0, 0);
      strokecolorshadows = color(65, 0, 0);
      dotscolorstroke = strokecolor;
      dotscolor = (240, 240, 233);
    } //endRed Lines

    if (this.palette == 8) {
      //RED
      fillcolorbg = color(255, 218, 218);
      fillcolorbg2 = color(237, 170, 170);
      fillcolorblockleft = color(218, 185, 185);
      fillcolorblockright = color(234, 217, 217);
      fillcolorpattern = color(255, 238, 218);
      fillcolorpattern2 = color(255, 218, 218);
      fillcolorgrass = color(255, 218, 218);
      fillcolorplant = color(215, 178, 178);
      fillcolorflower = color(237, 170, 170);
      fillcolorflower2 = color(255, 238, 218);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 0;
      g = 0;
      b = 0;
      r2 = 0;
      g2 = 0;
      b2 = 0;
      strokecolor = color(r, g, b);
      strokecolorshadows = color(0, 0, 0);
      dotscolorstroke = strokecolor;
      dotscolor = color(255, 238, 218);
    } //endRED

    if (this.palette == 9) {
      //greenlines
      fillcolorbg = color(240, 240, 233);
      fillcolorbg2 = color(11, 59, 4);
      fillcolorblockleft = color(240, 240, 233);
      fillcolorblockright = color(240, 240, 233);
      fillcolorpattern = color(240, 240, 233);
      fillcolorpattern2 = color(240, 240, 233);
      fillcolorgrass = color(240, 240, 233);
      fillcolorplant = color(240, 240, 233);
      fillcolorflower = color(240, 240, 233);
      fillcolorflower2 = color(11, 59, 4);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 9;
      g = 55;
      b = 2;
      r2 = 11;
      g2 = 80;
      b2 = 1;
      strokecolor = color(240, 240, 233);
      strokecolorshadows = color(11, 59, 4);
      dotscolorstroke = strokecolor;
      dotscolor = color(240, 240, 233);
    } //endgreenlines

    if (this.palette == 10) {
      //sketch with grey
      fillcolorbg = color(240, 240, 233);
      fillcolorbg2 = color(61, 61, 61);
      fillcolorblockleft = color(240, 240, 233);
      fillcolorblockright = color(240, 240, 233);
      fillcolorpattern = color(240, 240, 233);
      fillcolorpattern2 = color(240, 240, 233);
      fillcolorgrass = color(240, 240, 233);
      fillcolorplant = color(200, 200, 193);
      fillcolorflower = color(240, 240, 233);
      fillcolorflower2 = color(61, 61, 61);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 0;
      g = 0;
      b = 0;
      r2 = 0;
      g2 = 0;
      b2 = 0;
      strokecolor = color(240, 240, 233);
      strokecolorshadows = color(0, 0, 0);
      dotscolorstroke = strokecolor;
      dotscolor = color(240, 240, 233);
    } //endsketch with grey

    if (this.palette == 11) {
      //green
      fillcolorbg = color(248, 249, 231);
      fillcolorbg2 = color(218, 154, 154);
      fillcolorblockleft = color(207, 240, 220);
      fillcolorblockright = color(253, 255, 237);
      fillcolorpattern = color(241, 181, 181);
      fillcolorpattern2 = color(231);
      fillcolorgrass = color(248, 249, 231);
      fillcolorplant = color(208, 209, 193);
      fillcolorflower = color(241, 181, 181);
      fillcolorflower2 = color(224, 240, 207);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 0;
      g = 0;
      b = 0;
      r2 = 0;
      g2 = 0;
      b2 = 0;
      strokecolor = color(240, 240, 233);
      strokecolorshadows = color(0, 0, 0);
      dotscolorstroke = color(0);
      dotscolor = color(231);
    } //endgreen

    if (this.palette == 12) {
      //green and blue
      fillcolorbg = color(240, 240, 233);
      fillcolorbg2 = color(160, 195, 195);
      fillcolorblockleft = color(240, 240, 233);
      fillcolorblockright = color(240, 240, 233);
      fillcolorpattern = color(160, 195, 195);
      fillcolorpattern2 = color(240, 240, 233);
      fillcolorgrass = color(192, 220, 189);
      fillcolorplant = color(152, 190, 183);
      fillcolorflower = color(160, 195, 195);
      fillcolorflower2 = color(0);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 0;
      g = 0;
      b = 0;
      r2 = 0;
      g2 = 0;
      b2 = 0;
      strokecolor = color(0);
      strokecolorshadows = color(0, 0, 0);
      dotscolorstroke = strokecolor;
      dotscolor = color(250, 251, 168);
    } //endgreen and blue

    if (this.palette == 13) {
      //goldenhour
      fillcolorbg = color(238, 215, 167);
      fillcolorbg2 = color(160, 195, 195);
      fillcolorblockleft = color(238, 194, 167);
      fillcolorblockright = color(238, 215, 167);
      fillcolorpattern = color(224, 167, 113);
      fillcolorpattern2 = color(160, 195, 195);
      fillcolorgrass = color(224, 141, 113);
      fillcolorplant = color(184, 101, 73);
      fillcolorflower = color(250, 251, 168);
      fillcolorflower2 = color(160, 195, 195);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 0;
      g = 0;
      b = 0;
      r2 = 0;
      g2 = 0;
      b2 = 0;
      strokecolor = color(0);
      strokecolorshadows = color(0, 0, 0);
      dotscolorstroke = strokecolor;
      dotscolor = color(224, 141, 113);
    } //endgoldenhour

    if (this.palette == 14) {
      //BlueLight
      fillcolorbg = color(213, 227, 199);
      fillcolorbg2 = color(240, 241, 161);
      fillcolorblockleft = color(173, 203, 231);
      fillcolorblockright = color(214, 233, 251);
      fillcolorpattern = color(199, 227, 205);
      fillcolorpattern2 = color(240, 241, 161);
      fillcolorgrass = color(176, 90, 125);
      fillcolorplant = color(136, 50, 85);
      fillcolorflower = color(250, 251, 168);
      fillcolorflower2 = color(0);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 0;
      g = 0;
      b = 0;
      r2 = 0;
      g2 = 0;
      b2 = 0;
      strokecolor = color(0);
      strokecolorshadows = color(0, 0, 0);
      dotscolorstroke = strokecolor;
      dotscolor = color(176, 90, 125);
    } //endBlueLight

    if (this.palette == 15) {
      //greenlight
      fillcolorbg = color(213, 227, 199);
      fillcolorbg2 = color(157, 199, 223);
      fillcolorblockleft = color(213, 227, 199);
      fillcolorblockright = color(236, 239, 225);
      fillcolorpattern = color(243, 234, 175);
      fillcolorpattern2 = color(213, 227, 199);
      fillcolorgrass = color(243, 201, 175);
      fillcolorplant = color(193, 161, 135);
      fillcolorflower = color(157, 199, 223);
      fillcolorflower2 = color(0);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 0;
      g = 0;
      b = 0;
      r2 = 0;
      g2 = 0;
      b2 = 0;
      strokecolor = color(0);
      strokecolorshadows = color(0, 0, 0);
      dotscolorstroke = strokecolor;
      dotscolor = color(176, 90, 125);
    } //endgreenlight

    if (this.palette == 16) {
      //redflowers
      fillcolorbg = color(240, 240, 233);
      fillcolorbg2 = color(40);
      fillcolorblockleft = color(240, 240, 233);
      fillcolorblockright = color(255, 255, 252);
      fillcolorpattern = color(240, 240, 233);
      fillcolorpattern2 = color(240, 240, 233);
      fillcolorgrass = color(240, 240, 233);
      fillcolorplant = color(200, 200, 193);
      fillcolorflower = color(185, 21, 21);
      fillcolorflower2 = color(0);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 0;
      g = 0;
      b = 0;
      r2 = 0;
      g2 = 0;
      b2 = 0;
      strokecolor = color(r, g, b);
      strokecolorshadows = color(0, 0, 0);
      dotscolorstroke = color(185, 21, 21);
      dotscolor = color(185, 21, 21);
    } //endredflowers

    if (this.palette == 17) {
      //Purplesky
      fillcolorbg = color(247, 234, 234);
      fillcolorbg2 = color(184, 154, 226);
      fillcolorblockleft = color(245, 211, 211);
      fillcolorblockright = color(247, 234, 234);
      fillcolorpattern = color(233, 214, 224);
      fillcolorpattern2 = color(247, 234, 234);
      fillcolorgrass = color(226, 199, 154);
      fillcolorplant = color(186, 159, 104);
      fillcolorflower = color(184, 154, 226);
      fillcolorflower2 = color(247, 234, 234);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 0;
      g = 0;
      b = 0;
      r2 = 0;
      g2 = 0;
      b2 = 0;
      strokecolor = color(0);
      strokecolorshadows = color(0);
      dotscolorstroke = color(245, 211, 211);
      dotscolor = color(245, 211, 211);
    } //endPurplesky

    if (this.palette == 18) {
      //purpleblue
      fillcolorbg = color(231);
      fillcolorbg2 = color(206, 226, 230);
      fillcolorblockleft = color(190, 190, 205);
      fillcolorblockright = color(219, 221, 234);
      fillcolorpattern = color(206, 226, 230);
      fillcolorpattern2 = color(30);
      fillcolorgrass = color(212, 230, 206);
      fillcolorplant = color(172, 190, 166);
      fillcolorflower = color(210, 212, 253);
      fillcolorflower2 = color(0);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 0;
      g = 0;
      b = 0;
      r2 = 0;
      g2 = 0;
      b2 = 0;
      strokecolor = color(0);
      strokecolorshadows = color(0);
      dotscolorstroke = color(245, 211, 211);
      dotscolor = color(231);
    } //endpurpleblue
    if (this.palette == 19) {
      //sketchbluegreen
      fillcolorbg = color(240, 240, 233);
      fillcolorbg2 = color(171, 204, 238);
      fillcolorblockleft = color(220, 220, 213);
      fillcolorblockright = color(240, 240, 233);
      fillcolorpattern = color(240, 240, 233);
      fillcolorpattern2 = color(219, 220, 187);
      fillcolorgrass = color(240, 246, 226);
      fillcolorplant = color(200, 206, 186);
      fillcolorflower = color(171, 204, 238);
      fillcolorflower2 = color(30);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 0;
      g = 0;
      b = 0;
      r2 = 0;
      g2 = 0;
      b2 = 0;
      strokecolor = color(0);
      strokecolorshadows = color(0);
      dotscolorstroke = color(0);
      dotscolor = color(213, 239, 234);
    } //endsketchbluegreen

    if (this.palette == 20) {
      //sketchbook2
      fillcolorbg = color(251);
      fillcolorbg2 = color(231);
      fillcolorblockleft = color(231);
      fillcolorblockright = color(251);
      fillcolorpattern = color(231);
      fillcolorpattern2 = color(231);
      fillcolorgrass = color(231);
      fillcolorplant = color(191);
      fillcolorflower = color(251);
      fillcolorflower2 = color(0);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 0;
      g = 0;
      b = 0;
      r2 = 0;
      g2 = 0;
      b2 = 0;
      strokecolor = color(0);
      strokecolorshadows = color(0);
      dotscolorstroke = 0;
      dotscolor = 231;
    } //endsketchbook2
    if (this.palette == 21) {
      //Gold
      fillcolorbg = color(255);
      fillcolorbg2 = color(233, 229, 213);
      fillcolorblockleft = color(243, 239, 223);
      fillcolorblockright = color(254, 253, 245);
      fillcolorpattern = color(233, 229, 213);
      fillcolorpattern2 = color(231);
      fillcolorgrass = color(233, 229, 213);
      fillcolorplant = color(193, 189, 173);
      fillcolorflower = color(255);
      fillcolorflower2 = color(243, 239, 223);
      //  rgb = stroke left Volume, r2g2b2 = stroke right Volume
      r = 0;
      g = 0;
      b = 0;
      r2 = 0;
      g2 = 0;
      b2 = 0;
      strokecolor = color(0);
      strokecolorshadows = color(0);
      dotscolorstroke = color(255);
      dotscolor = color(255);
    } //endGold
  }
}
