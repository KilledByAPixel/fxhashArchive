// Author: Nathaniel Sarkissian
// Date: July 8, 2022
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

function setPalette(ind) {
  // print("palette ind", ind);
    if (ind == 0) {
        grassContrast = 0.4;
        shadowCol = color('#001c16');
        highlightCol = color('#ffc90f');
        rockHighlightCol = color('#fffbdd');;
        rockShadowCol = color('#011b16');

        thirdCol = color('#a372fe');
        fourthCol = color('#000000');

        waterCol = color('#26003e11');

        grassCols[0] = color('#1F1A38');
        grassCols[1] = lerpColor(color('#1F1A38'), color('#243E36'), 0.5);
        grassCols[2] = color('#243E36');
        grassCols[3] = lerpColor(color('#243E36'), color('#6dab99'), 0.5);
        grassCols[4] = color('#6dab99');
        grassCols[5] = color('#EAD7D1');

        poppyCols[0] = color('#EA526F');
        poppyCols[1] = color('#947EB0');

        tallCols[0] = color('#f71a1f');
        tallCols[1] = color('#f400dc');

        floofCols[0] = color('#ffeeb3');

        daisyCols[0] = color('#ff7c1c');
        daisyCols[1] = color('#fb9700');
        daisyMid1 = color('#29180c');
        daisyMid2 = color('#372206');

        roseCols[0] = color('#7c25f3');
        roseCols[1] = color('#e73ab7');
        roseMid1 = color('#29180c');
        roseMid2 = color('#372206');

        thistleCols[0] = color('#6d27ef');
        thistleCols[1] = color('#3204bb');
        thistleCols[2] = color('#5e06ff');

        lavenderCols[0] = color('#fff4a6');
        lavenderCols[1] = color('#fff4ce');

        sageCols[0] = color('#243E36');
        sageCols[1] = color('#0e2e24');

        waterLevel = 0;
    } else if (ind == 1) {
        shadowCol = color('#000');
        highlightCol = color('#fff');
        rockShadowCol = color('#111');
        rockHighlightCol = color('#ddd');

        thirdCol = color('#aaa');
        fourthCol = color('#555');

        waterCol = color('#bccfcf11');
        sageContrast = 0.5;

        grassCols[0] = color('#111');
        grassCols[1] = color('#111');
        grassCols[2] = color('#444');
        grassCols[3] = color('#444');
        grassCols[4] = color('#999');
        grassCols[5] = color('#aaa');
        grassCols[6] = color('#fff');

        poppyCols[0] = color('#333');
        poppyCols[1] = color('#292929');

        daisyCols[0] = color('#222');
        daisyCols[1] = color('#333');
        daisyMid1 = color('#111');
        daisyMid2 = color('#444');

        roseCols[0] = color('#b1b1b1');
        roseCols[1] = color('#6c6c6c');
        roseCols[2] = color('#3e3e3e');
        roseMid1 = color('#444');
        roseMid2 = color('#999');

        thistleCols[0] = color('#eee');
        thistleCols[1] = color('#333');
        thistleCols[2] = color('#363636');

        lavenderCols[0] = color('#4f4f4f');
        lavenderCols[1] = color('#2c2c2c');

        floofCols[0] = color('#aaa');
        floofCols[1] = color('#bbb');

        sageCols[0] = color('#333');
        sageCols[1] = color('#222');

        waterLevel = 0;
    } else if (ind == 2) {
        grassContrast = 0.45;
        sageContrast = 0.35;

        shadowCol = color('#070046');
        highlightCol = color('#ffc742');
        // highlightCol = lerpColor(color('#ffc742'), color('#22b037'), 0.5);
        rockShadowCol = color('#131a20');
        rockHighlightCol = color('#f8edcb');

        thirdCol = color('#fceeba');
        fourthCol = color('#392f17');

        waterCol = color('#bccfcf11');

        grassCols[0] = color('#141812');
        grassCols[1] = lerpColor(color('#141812'), color('#222f26'), 0.5);
        grassCols[2] = color('#222f26');
        grassCols[3] = color('#222f26');
        grassCols[4] = lerpColor(color('#222f26'), color('#1f5a6b'), 0.5);
        grassCols[5] = color('#1f5a6b');
        grassCols[6] = color('#1f5a6b');
        grassCols[7] = lerpColor(color('#1f5a6b'), color('#238d58'), 0.5);
        grassCols[8] = color('#238d58');
        grassCols[9] = lerpColor(color('#238d58'), color('#95c6bf'), 0.33);
        grassCols[10] = lerpColor(color('#238d58'), color('#95c6bf'), 0.66);
        grassCols[11] = color('#95c6bf');

        // grassCols[0] = color('#1c221a');
        // grassCols[1] = lerpColor(color('#1c221a'), color('#013635'), 0.5);
        // grassCols[2] = color('#013635');
        // grassCols[3] = color('#013635');
        // grassCols[4] = lerpColor(color('#013635'), color('#00565e'), 0.5);
        // grassCols[5] = color('#00565e');
        // grassCols[6] = color('#00565e');
        // grassCols[7] = lerpColor(color('#00565e'), color('#3a177b'), 0.5);
        // grassCols[8] = color('#3a177b');
        // grassCols[9] = lerpColor(color('#3a177b'), color('#38bad6'), 0.33);
        // grassCols[10] = lerpColor(color('#3a177b'), color('#38bad6'), 0.66);
        // grassCols[11] = color('#38bad6');

        // ORIG
        // grassCols[0] = color('#1c221a');
        // grassCols[1] = lerpColor(color('#1c221a'), color('#013635'), 0.5);
        // grassCols[2] = color('#013635');
        // grassCols[3] = color('#013635');
        // grassCols[4] = lerpColor(color('#013635'), color('#00565e'), 0.5);
        // grassCols[5] = color('#00565e');
        // grassCols[6] = color('#00565e');
        // grassCols[7] = lerpColor(color('#00565e'), color('#3a177b'), 0.5);
        // grassCols[8] = color('#3a177b');
        // grassCols[9] = color('#3a177b');
        // grassCols[10] = color('#38bad6');


        poppyCols[0] = color('#4f52d5');
        poppyCols[1] = color('#4d25c0');

        tallCols[0] = color('#e6006d');
        tallCols[1] = color('#ff97b6');

        daisyCols[0] = color('#f8deec');
        daisyCols[1] = color('#ffffff');
        daisyMid1 = color('#29180c');
        daisyMid2 = color('#422806');


        roseCols[0] = color('#6b1cff');
        roseCols[1] = color('#ffffff');
        roseCols[2] = color('#81a0f3');
        roseMid1 = color('#29180c');
        roseMid2 = color('#2e1d05');

        thistleCols[0] = color('#6627e9');
        thistleCols[1] = color('#8b23ad');
        thistleCols[2] = color('#d733ee');

        lavenderCols[0] = color('#8840ff');
        lavenderCols[1] = color('#fb46ff');

        floofCols[0] = color('#ffedae');
        floofCols[1] = color('#ffd295');
        // floofCols[2] = color('#e631af');

        sageCols[0] = color('#180345');
        sageCols[1] = color('#032438');

        waterLevel = 0;
    } else if (ind == 3) {
        grassContrast = 0.45;
        // Yello grass, yellow sun
        shadowCol = color('#150079');
        highlightCol = color('#ffaa0d');
        rockHighlightCol = color('#ffedca');
        rockShadowCol = lerpColor(color('#05001c'), color('#ffaa0d'), 0.1);

        thirdCol = color('#fceeba');
        fourthCol = color('#392f17');

        waterCol = color('#aeece211');

        grassCols[0] = color('#43280e');
        grassCols[1] = lerpColor(color('#43280e'), color('#734517'), 0.5);
        grassCols[2] = color('#734517');
        grassCols[3] = lerpColor(color('#734517'), color('#d5802b'), 0.5);
        grassCols[4] = color('#d5802b');
        grassCols[5] = color('#d5802b');
        grassCols[6] = lerpColor(color('#d5802b'), color('#ffeeb9'), 0.5);
        grassCols[7] = lerpColor(color('#d5802b'), color('#ffeeb9'), 0.5);
        grassCols[8] = color('#ffeeb9');

        poppyCols[0] = color('#f52eab');
        poppyCols[1] = color('#e4acf7');
        poppyCols[2] = color('#fdee84');

        tallCols[0] = color('#ff2429');
        tallCols[1] = color('#e41673');
        tallCols[2] = color('#e322c7');

        daisyCols[0] = color('#e4459d');
        daisyCols[1] = color('#d172f1');
        daisyMid1 = color('#29180c');
        daisyMid2 = color('#2f1d04');

        roseCols[0] = color('#8204ff');
        roseCols[1] = color('#cd06ff');
        roseCols[2] = color('#d1a4ff');
        roseMid1 = color('#29180c');
        roseMid2 = color('#311b04');

        thistleCols[0] = color('#6d27ef');
        thistleCols[1] = color('#3204bb');
        thistleCols[2] = color('#b91afd');

        lavenderCols[0] = color('#8840ff');
        lavenderCols[1] = color('#fb46ff');

        floofCols[0] = color('#ffeeb3');
        floofCols[1] = color('#f9c142');

        sageCols[0] = color('#242d09');
        sageCols[1] = color('#0d2822');
    } else if (ind == 4) {
        grassContrast = 0.4;
        // spring
        shadowCol = color('#062824');
        highlightCol = color('#ffd11c');
        rockShadowCol = color('#1c1e1a');
        rockHighlightCol = color('#fff3c4');
        // rockShadowCol = color('#141c0d');
        // rockHighlightCol = color('#fff3c4');

        thirdCol = color('#fceeba');
        fourthCol = color('#392f17');

        waterCol = color('#bccfcf11');
        grassCols[0] = color('#1f2914');
        grassCols[1] = color('#1f2914');
        grassCols[2] = color('#476130');
        grassCols[3] = color('#476130');
        grassCols[4] = color('#99b43d');
        grassCols[5] = color('#99b43d');
        grassCols[6] = lerpColor(color('#99b43d'), color('#f4e995'), 0.33);
        grassCols[7] = lerpColor(color('#99b43d'), color('#f4e995'), 0.66);
        grassCols[8] = color('#ffed71');

        poppyCols[0] = color('#f5cd2e');
        poppyCols[1] = color('#f5a62e');
        poppyCols[2] = color('#ed5a36');

        tallCols[0] = color('#f56be1');
        tallCols[1] = color('#f1b0f9');
        tallCols[2] = color('#ff2429');

        daisyCols[0] = color('#e73dd6');
        daisyCols[1] = color('#ef92c5');

        daisyMid1 = color('#29180c');
        daisyMid2 = color('#281a04');

        roseCols[0] = color('#fec5fe');
        roseCols[1] = color('#ffcef3');
        roseMid1 = color('#29180c');
        roseMid2 = color('#352000');

        thistleCols[0] = color('#5717ff');
        thistleCols[1] = color('#4545de');
        // thistleCols[2] = color('#b91afd');
        // thistleCols[0] = color('#ef2782');
        // thistleCols[1] = color('#bb04bb');
        // thistleCols[2] = color('#b91afd');

        lavenderCols[0] = color('#fcdfd8');
        lavenderCols[1] = color('#f8cde4');

        floofCols[0] = color('#ffe8b3');
        floofCols[1] = color('#f5cd2e');

        sageCols[0] = color('#242d09');
        sageCols[1] = color('#2d2809');
        sageCols[2] = color('#09152d');

        waterLevel = 0;
    } else if (ind == 5) {
        grassContrast = 0.45;
        sageContrast = 0.5;

        shadowCol = color('#0f2175');
        highlightCol = color('#ffc109');
        rockShadowCol = color('#0c1b29');
        rockHighlightCol = color('#fdefc6');

        thirdCol = color('#fceeba');
        fourthCol = color('#392f17');

        waterCol = color('#bccfcf11');

        grassCols[0] = color('#1c221a');
        grassCols[1] = lerpColor(color('#1c221a'), color('#0a3f24'), 0.15);
        grassCols[2] = lerpColor(color('#1c221a'), color('#0a3f24'), 0.3);
        grassCols[3] = lerpColor(color('#1c221a'), color('#0a3f24'), 0.45);
        grassCols[4] = color('#0a3f24');
        grassCols[5] = lerpColor(color('#0a3f24'), color('#3d7711'), 0.33);
        grassCols[6] = lerpColor(color('#0a3f24'), color('#3d7711'), 0.66);
        grassCols[7] = color('#3d7711');
        grassCols[8] = lerpColor(color('#3d7711'), color('#cbdd64'), 0.5);
        grassCols[9] = color('#cbdd64');
        grassCols[10] = color('#f8f9ca');

        poppyCols[0] = color('#e66200');
        poppyCols[1] = color('#ff97b6');
        poppyCols[2] = color('#ffc6e3');

        tallCols[0] = color('#e66200');
        tallCols[1] = color('#ff97b6');

        daisyCols[0] = color('#f2b628');
        daisyCols[1] = color('#ffffff');
        daisyMid1 = color('#29180c');
        daisyMid2 = color('#422806');


        roseCols[0] = color('#f2b628');
        roseCols[1] = color('#e66200');
        roseMid1 = color('#29180c');
        roseMid2 = color('#443726');

        thistleCols[0] = color('#6627e9');
        thistleCols[1] = color('#8b23ad');
        thistleCols[2] = color('#d733ee');

        lavenderCols[0] = color('#8840ff');
        lavenderCols[1] = color('#fb46ff');

        floofCols[0] = color('#f0b324');
        floofCols[1] = color('#d1e2c5');

        sageCols[0] = color('#1a4215');
        sageCols[1] = color('#292d0f');

        waterLevel = 0;
    } else if (ind == 6) {
        grassContrast = 0.45;
        // sageContrast = 0.1;
        shadowCol = color('#0e0051'); // #0e004f
        highlightCol = color('#ffae1a');
        rockHighlightCol = color('#ffedcc');
        rockShadowCol = color('#16143d');

        thirdCol = color('#fff0b7');
        fourthCol = color('#510000');

        waterCol = color('#aeece211');

        grassCols[0] = color('#060051');
        grassCols[1] = lerpColor(color('#060051'), color('#3e0385'), 0.33);
        grassCols[2] = lerpColor(color('#060051'), color('#3e0385'), 0.66);
        grassCols[3] = color('#3e0385');
        grassCols[4] = lerpColor(color('#3e0385'), color('#0a3347'), 0.33);
        grassCols[5] = lerpColor(color('#3e0385'), color('#0a3347'), 0.66);
        grassCols[6] = color('#0a3347');
        grassCols[7] = lerpColor(color('#0a3347'), color('#044d49'), 0.33);
        grassCols[8] = lerpColor(color('#0a3347'), color('#044d49'), 0.66);
        grassCols[9] = color('#044d49');
        grassCols[10] = lerpColor(color('#044d49'), color('#a6ffc2'), 0.33);
        grassCols[11] = lerpColor(color('#044d49'), color('#a6ffc2'), 0.66);
        grassCols[12] = color('#a6ffc2');


        poppyCols[0] = color('#fff200');
        poppyCols[1] = color('#ffa620');

        tallCols[0] = color('#ff8000');
        tallCols[1] = color('#ff4d20');

        daisyCols[0] = color('#d5e6ff');
        daisyCols[1] = color('#f4dcfc');

        daisyMid1 = color('#0c1b07');
        daisyMid2 = color('#152703');

        roseCols[0] = color('#c14262');
        roseCols[1] = color('#f21127');

        roseMid1 = color('#170257');
        roseMid2 = color('#410e63');

        thistleCols[0] = color('#701dfa');
        thistleCols[1] = color('#1c0bb5');

        lavenderCols[0] = color('#7c1fe4');
        lavenderCols[1] = color('#fa1cff');

        floofCols[0] = color('#ffb653');

        sageCols[0] = color('#092d2d');
        sageCols[1] = color('#1a0d28');
    }
}