let MetropolisStyles = [
    {
        name: "Hazy ",                //0
        func: coloredCitySoftDay,
        palette: palettes,
        cycle : "Day",
        rs: 18
    },
    {
        name: "Hazy ",              //1
        func: coloredCitySoftNight,
        palette: palettes,
        cycle : "Night",
        rs: 10
    },
    {
        name: "Crystal ",            //2
        func: crystalCityDay,
        palette: palettes,
        cycle: "Day",
        rs: 8
    },
    {
        name: "Crystal ",        //3
        func: crystalCityNight,
        palette: palettes,
        cycle : "Night",
        rs: 3
    },
    {
        name: "Mondrian",         //
        func: MondrianCityDay,
        palette: mondrianPalette,
        cycle:"Day",
        rs: 3
    },
    {
        name: "Mondrian ",       //5
        func: MondrianCityNight,
        palette: mondrianPalette,
        cycle: "Night",
        rs: 3
    },
    {
        name: "Bauhaus ",       //6
        func: BauhausCityDay,
        palette: bauHausPalette,
        cycle : "Day",
        rs: 2
    },
    {
        name: "Bauhaus ",        //7
        func: BauhausCityNight,
        palette: bauHausPalette,
        cycle : "Night",
        rs: 2
    },
    {
        name: "1 Chroma",         //8
        func: BlacknSingle,
        palette: singlePalettes,
        cycle : "Day",
        rs: 4
    },
    {
        name: "Mondrian Crystal Light",         //9
        func: MondrianCrystalDay,
        palette: mondrianCrystal,
        cycle: "Day",
        rs: 2
    },

    {
        name: "Mondrian Crystal Dark",         //10
        func: MondrianCrystalNight,
        palette: mondrianCrystal,
        cycle:"Night",
        rs: 2
    },
    {
        name: "Monochrome",         //11
        func: dayCityMonochrome,
        palette: monochrome,
        cycle:"Day",
        rs: 3
    },
    {
        name: "Monochrome",         //12
        func: nightCityMonochrome,
        palette: monochrome,
        cycle:"Night",
        rs: 3
    },
    {
        name: "Vibrant",         //13
        func: vibrantCityDay,
        palette: palettes,
        cycle:"Day",
        rs: 14
    },
    {
        name: "Vibrant",         //14
        func: vibrantCityNight,
        palette: palettes,
        cycle:"Night",
        rs: 12
    },
    {
        name: "Rainbow",         //15
        func: rainbowCityDay,
        palette: palettes,
        cycle:"Day",
        rs: 5
    },
    {
        name: "Rainbow",         //16
        func: rainbowCityNight,
        palette: palettes,
        cycle:"Night",
        rs: 3
    },
    {
        name: "Chaotic",         //17
        func: Chaotic,
        palette: palettes,
        cycle : "Day",
        rs: 3
    },


]






function coloredCitySoftDay() {
    let light = intRandRange(80, 120);
    let dark = intRandRange(10, 20);
    let satMin = intRandRange(0, 20);
    let satMax = intRandRange(50, 110);
    let hasStroke = getBoolWeighted([50, 50]);
    let sky = randRange(0.3, 0.7);
    let isStrokeInverted = getBoolWeighted([20, 80]);
    let hasDots = getBoolWeighted([50, 50]);
    let hl_height = randRange(0.4, 0.7);
    let threeProb = getBoolWeighted([50, 50]);

    cell = new Cell(createVector(width * 0.01, width * 0.01), createVector(width * 0.99, height - width * 0.01), 0);
    cell.sortPoints();
    let cells = cell.subDivide(divLevel, 0.1, 0.7, 16, 40); //cell.subDivide(intRandRange(2,6),random(0.1,1),random(0.1,1),intRandRange(4,40),(intRandRange(4,40)));
    decorator = new Decorator(canvas, cells, palette);
    if (sprawl) decorator.addChaos(randRange(1, 2));

    if (threeProb) {
        decorator.fillColorGeneric(gradientDirection, gradient.gradient[0], gradient.gradient[1], light, dark, satMin, satMax, sky)
    } else {
        decorator.fillColorGeneric(gradientDirection, gradient.gradient[0], gradient.gradient[1] + 30, light, dark, satMin, satMax, sky)

    }

    decorator.paintCells();
    decorator.fillWithCircles(hasStroke, isStrokeInverted, areCirclesBlack, false, surpiseColor(), BLEND);
    decorator.fillwithTriangles(BLEND);
    if (hasHorizontalLines) decorator.fillHorizontalLines(false, false, hasDots, false, hl_count, hl_height, 0.7);
    if (hasCellStroke) decorator.displayDebugView(color(255, 255, 0), 0.15);

    this.printHiddenFeatures(hasStroke, isStrokeInverted, hasDots);

    return true
}

function coloredCitySoftNight() {
    let light = intRandRange(10, 20);
    let dark = intRandRange(80, 120);
    let satMin = intRandRange(0, 20);
    let satMax = intRandRange(50, 80);
    let hasStroke = getBoolWeighted([50, 50]);
    let sky = randRange(0.5, 0.2);
    let isStrokeInverted = getBoolWeighted([20, 80]);
    let hasDots = getBoolWeighted([50, 50]);
    let hl_height = randRange(0.4, 0.6);
  
    let hlDot_add = getBoolWeighted([30, 70]);
    

    cell = new Cell(createVector(width * 0.01, width * 0.01), createVector(width * 0.99, height - width * 0.01), 0);
    cell.sortPoints();
    let cells = cell.subDivide(divLevel, 0.1, 0.7, 16, 40); //cell.subDivide(intRandRange(2,6),random(0.1,1),random(0.1,1),intRandRange(4,40),(intRandRange(4,40)));
    decorator = new Decorator(canvas, cells, palette);
    if (sprawl) decorator.addChaos(randRange(1, 2));
    decorator.fillColorGeneric(gradientDirection, gradient.gradient[0], gradient.gradient[1], light, dark, satMin, satMax, sky)
    decorator.paintCells();

    decorator.fillWithCircles(hasStroke, isStrokeInverted, areCirclesBlack, false, surpiseColor(), BLEND);
    decorator.fillwithTriangles(BLEND);
    if (hasHorizontalLines) decorator.fillHorizontalLines(false, hlDot_add, hasDots, false, getHorizontalCount(divLevel), hl_height,0.7);
    if (hasCellStroke) decorator.displayDebugView(color(255, 255, 0), 0.15);

    this.printHiddenFeatures(hasStroke, isStrokeInverted, hasDots);
    return true
}

function crystalCityDay() {
    let light = intRandRange(80, 100);
    let dark = intRandRange(0, 20);
    let satMin = intRandRange(0, 20);
    let satMax = 100 //intRandRange(50, 110);
    let hasStroke = getBoolWeighted([50, 50]);
    let sky = randRange(0.4, 0);
    let isStrokeInverted = getBoolWeighted([20, 80]);
    let hasDots = getBoolWeighted([50, 50]);
    let hl_height = randRange(0.4, 0.7);
   
    
    cell = new Cell(createVector(width * 0.01, width * 0.01), createVector(width * 0.99, height - width * 0.01), 0);
    cell.sortPoints();
    let cells = cell.subDivide(divLevel, 0.1, 0.7, 16, 40); //cell.subDivide(intRandRange(2,6),random(0.1,1),random(0.1,1),intRandRange(4,40),(intRandRange(4,40)));
    decorator = new Decorator(canvas, cells, palette);
    if (sprawl) decorator.addChaos(randRange(2, 3));
    decorator.fillColorGeneric(gradientDirection, gradient.gradient[0], gradient.gradient[1], light, dark, satMin, satMax, sky)


    decorator.paintCells();

    decorator.fillWithCircles(hasStroke, isStrokeInverted, false, false, surpiseColor(), ADD);

    decorator.fillwithTriangles(ADD);
    decorator.fillHorizontalLines(true, true, hasDots, false, getHorizontalCount(divLevel), hl_height, 0.8);
    this.printHiddenFeatures(hasStroke, isStrokeInverted, hasDots);
   
    return true
}

function crystalCityNight() {
    let light = intRandRange(10, 25);
    let dark = intRandRange(35, 65);
    let satMin = intRandRange(50, 70); //60
    let satMax = intRandRange(80, 110);  //100
    let hasStroke = getBoolWeighted([50, 50]);
    let sky = randRange(0.2, 0.5);
    let isStrokeInverted = getBoolWeighted([20, 80]);
    let hasDots = getBoolWeighted([50, 50]);
    
    cell = new Cell(createVector(width * 0.01, width * 0.01), createVector(width * 0.99, height - width * 0.01), 0);
    cell.sortPoints();
    let cells = cell.subDivide(divLevel, 0.1, 0.7, 16, 80); //cell.subDivide(intRandRange(2,6),random(0.1,1),random(0.1,1),intRandRange(4,40),(intRandRange(4,40)));
    decorator = new Decorator(canvas, cells, palette);
    
    if (sprawl) decorator.addChaos(randRange(2, 3));
    decorator.fillColorGeneric(gradientDirection, gradient.gradient[0], gradient.gradient[1], light, dark, satMin, satMax, sky)


    decorator.paintCells();

    decorator.fillWithCircles(hasStroke, isStrokeInverted, areCirclesBlack, false, surpiseColor(), BLEND);
    decorator.fillwithTriangles(BLEND);
    decorator.fillHorizontalLines(true, true, hasDots, false, getHorizontalCount(divLevel), randRange(0.3, 0.5), 0.8);
    this.printHiddenFeatures(hasStroke, isStrokeInverted, hasDots);
   
    return true
}

function MondrianCityDay() {
    let light = intRandRange(70, 110);
    let dark = intRandRange(20, 40);
    let satMin = intRandRange(0, 20);
    let satMax = intRandRange(50, 110);
    let hasStroke = getBoolWeighted([50, 50]);
    let sky = randRange(0.3, 0.6);
    let isStrokeInverted = getBoolWeighted([20, 80]);
    let hasDots = getBoolWeighted([50, 50]);
    let hl_height = randRange(0.2, 0.7);
    let hl_add = getBoolWeighted([30, 70]);
    let hlDot_add = getBoolWeighted([30, 70]);
    let cellStroke = getCellStrokeWeight(divLevel)

    cell = new Cell(createVector(width * 0.01, width * 0.01), createVector(width * 0.99, height - width * 0.01), 0);
    cell.sortPoints();
    let cells = cell.subDivide(divLevel, 0.1, 0.7, 16, 40); //cell.subDivide(intRandRange(2,6),random(0.1,1),random(0.1,1),intRandRange(4,40),(intRandRange(4,40)));
    decorator = new Decorator(canvas, cells, palette);
    if(sprawl) decorator.addChaos(1,3);
    decorator.fillColorGeneric(gradientDirection, gradient.gradient[0], gradient.gradient[1], light, dark, 0, 0, 0.6)
    
    decorator.paintCells();

    decorator.fillWithCircles(hasStroke, isStrokeInverted, false, false, surpiseColor(),BLEND);
    decorator.fillwithTriangles(BLEND);
    if (hasHorizontalLines) decorator.fillHorizontalLines(false, false, hasDots, false, getHorizontalCount(divLevel), hl_height,0.8);
    decorator.displayDebugView(color(255, 255, 0), cellStroke);
    
    this.printHiddenFeatures(hasStroke, isStrokeInverted, hasDots);

    return true
}

function MondrianCityNight() {
    let light = intRandRange(20, 50);
    let dark = intRandRange(80, 100);
    let satMin = intRandRange(0, 20);
    let satMax = intRandRange(50, 110);
    let hasStroke = getBoolWeighted([50, 50]);
    let sky = randRange(0.3, 0.7);
    let isStrokeInverted = getBoolWeighted([20, 80]);
    let hasDots = getBoolWeighted([50, 50]);
    let hl_height = randRange(0.4, 0.7);
    let hl_add = getBoolWeighted([30, 70]);
    let hlDot_add = getBoolWeighted([30, 70]);
    let cellStroke = getCellStrokeWeight(divLevel)

    cell = new Cell(createVector(width * 0.01, width * 0.01), createVector(width * 0.99, height - width * 0.01), 0);
    cell.sortPoints();
    let cells = cell.subDivide(divLevel, 0.1, 0.7, 16, 40); 
    decorator = new Decorator(canvas, cells, palette);
    if(sprawl) decorator.addChaos(1,3);
    decorator.fillColorGeneric(gradientDirection, gradient.gradient[0], gradient.gradient[1], light, dark, 0, 0, 0.6)

    decorator.paintCells();

    decorator.fillWithCircles(hasStroke, isStrokeInverted, false, false, surpiseColor(),BLEND);
    decorator.fillwithTriangles(BLEND);
    if (hasHorizontalLines) decorator.fillHorizontalLines(false, false, hasDots, false, getHorizontalCount(divLevel), hl_height,0.8);
    decorator.displayDebugView(color(255, 255, 0), cellStroke);
    this.printHiddenFeatures(hasStroke, isStrokeInverted, hasDots);
    return true
}

function BauhausCityDay() {
    let light = intRandRange(60, 75); //40 55
    let dark = intRandRange(0, 20);
    let satMin = intRandRange(10, 20);
    let satMax = intRandRange(5, 10);
    let hasStroke = getBoolWeighted([50, 50]);
    let sky = randRange(0.3, 0.7);
    let isStrokeInverted = getBoolWeighted([20, 80]);
    let hasDots = getBoolWeighted([50, 50]);
    let hl_height = randRange(0.4, 0.7);
   
    let cellStroke = getCellStrokeWeight(divLevel)

    cell = new Cell(createVector(width * 0.01, width * 0.01), createVector(width * 0.99, height - width * 0.01), 0);
    cell.sortPoints();
    let cells = cell.subDivide(divLevel, 0.1, 0.7, 16, 40); 
    decorator = new Decorator(canvas, cells, palette);
    if(sprawl) decorator.addChaos(1,3);
    decorator.fillColorGeneric(gradientDirection, gradient.gradient[0], gradient.gradient[1], light, dark, satMin, satMax, sky)

    decorator.paintCells();

    decorator.fillWithCircles(hasStroke, isStrokeInverted, false, false, surpiseColor(), BLEND);
    decorator.fillwithTriangles(BLEND);
    if (hasHorizontalLines) decorator.fillHorizontalLines(false, false, hasDots, false, getHorizontalCount(divLevel), hl_height, 0.7);
    if (hasCellStroke) decorator.displayDebugView(color(255, 255, 0), cellStroke);
    this.printHiddenFeatures(hasStroke, isStrokeInverted, hasDots);
    return true
}

function BauhausCityNight() {
    let light = intRandRange(25, 35);
    let dark = intRandRange(50, 70);
    let satMin = intRandRange(7, 12);
    let satMax = intRandRange(15, 25);
    let hasStroke = getBoolWeighted([50, 50]);
    let sky = randRange(0.3, 0.7);
    let isStrokeInverted = getBoolWeighted([20, 80]);
    let hasDots = getBoolWeighted([50, 50]);
    let hl_height = randRange(0.4, 0.7);
    let hl_add = getBoolWeighted([30, 70]);
    let hlDot_add = getBoolWeighted([30, 70]);
    let cellStroke = getCellStrokeWeight(divLevel)

    cell = new Cell(createVector(width * 0.01, width * 0.01), createVector(width * 0.99, height - width * 0.01), 0);
    cell.sortPoints();
    let cells = cell.subDivide(divLevel, 0.1, 0.7, 16, 40); 
    decorator = new Decorator(canvas, cells, palette);
    if(sprawl) decorator.addChaos(1,3);
    decorator.fillColorGeneric(gradientDirection, gradient.gradient[0], gradient.gradient[1], light, dark, satMin, satMax, 0.6)

    decorator.paintCells();

    decorator.fillWithCircles(hasStroke, isStrokeInverted, false, false, surpiseColor());
    decorator.fillwithTriangles();
    if (hasHorizontalLines) decorator.fillHorizontalLines(false, hlDot_add, hasDots, false, getHorizontalCount(divLevel), hl_height, 1);
    if (hasCellStroke) decorator.displayDebugView(color(255, 255, 0), cellStroke);
    this.printHiddenFeatures(hasStroke, isStrokeInverted, hasDots);
    return true
}

function BlacknSingle() {
    let light = intRandRange(40, 60);
    let dark = 0;
    let satMin = intRandRange(0, 20);
    let satMax = intRandRange(50, 110);
    let hasStroke = getBoolWeighted([50, 50]);
    let sky = randRange(0.3, 0.7);
    let isStrokeInverted = getBoolWeighted([20, 80]);
    let hasDots = getBoolWeighted([50, 50]);
    let hl_height = randRange(0.4, 0.5);
    
    let hlDot_add = getBoolWeighted([30, 70]);
   



    cell = new Cell(createVector(width * 0.01, width * 0.01), createVector(width * 0.99, height - width * 0.01), 0);
    cell.sortPoints();
    let cells = cell.subDivide(divLevel, 0.1, 0.7, 16, 40); //cell.subDivide(intRandRange(2,6),random(0.1,1),random(0.1,1),intRandRange(4,40),(intRandRange(4,40)));
    decorator = new Decorator(canvas, cells, palette);


    decorator.fillColorGeneric(gradientDirection, gradient.gradient[0], gradient.gradient[1], light, dark, 0, 0, randRange(0.1, 0.3))


    decorator.paintCells();

    decorator.fillWithCircles(hasStroke, isStrokeInverted, areCirclesBlack, false, surpiseColor(), BLEND);
    decorator.fillwithTriangles(BLEND);
    if (hasHorizontalLines) decorator.fillHorizontalLines(false, hlDot_add, hasDots, false, hl_count, hl_height, 0.7);
    if (hasCellStroke) decorator.displayDebugView(color(255, 255, 0), 0.15);
    this.printHiddenFeatures(hasStroke, isStrokeInverted, hasDots);
    return true
}

function MondrianCrystalDay() {
    let light = intRandRange(80, 120); //100
    let dark = 20//intRandRange(0, 20);
    let satMin = 60//intRandRange(0, 20);
    let satMax = 100//intRandRange(50, 110);
    
    let sky = randRange(0.2, 0);
    let isStrokeInverted = getBoolWeighted([20, 80]);
    
    let hl_height = randRange(0.3, 0.6);
   
    let cellStroke = getCellStrokeWeight(divLevel)

    cell = new Cell(createVector(width * 0.01, width * 0.01), createVector(width * 0.99, height - width * 0.01), 0);
    cell.sortPoints();
    let cells = cell.subDivide(divLevel, 0.1, 0.8, 16, 40); //cell.subDivide(intRandRange(2,6),random(0.1,1),random(0.1,1),intRandRange(4,40),(intRandRange(4,40)));
    decorator = new Decorator(canvas, cells, palette);
    if(sprawl)decorator.addChaos(1,3);
    decorator.fillColorGeneric(gradientDirection, gradient.gradient[0], gradient.gradient[1], light, dark, satMin, satMax, sky)


    decorator.paintCells();

    decorator.fillWithCircles(false, isStrokeInverted, false, false, surpiseColor(), BLEND);

    decorator.fillwithTriangles(BLEND);
    decorator.fillHorizontalLines(true, true, true, false, getHorizontalCount(divLevel), hl_height, 0.8);

    if (hasCellStroke) decorator.displayDebugView(color(255, 0, 0), cellStroke);
    this.printHiddenFeatures(false, isStrokeInverted, true);
    return true
}

function MondrianCrystalNight() {
    let light = intRandRange(0, 20);
    let dark = 60//intRandRange(0, 20);
    let satMin = 0//intRandRange(0, 20);
    let satMax = 100//intRandRange(50, 110);
    let sky = randRange(0.5, 0);
    let isStrokeInverted = getBoolWeighted([20, 80]);
   

    cell = new Cell(createVector(width * 0.01, width * 0.01), createVector(width * 0.99, height - width * 0.01), 0);
    cell.sortPoints();
    let cells = cell.subDivide(divLevel, 0.1, 0.7, 16, 40); 
    decorator = new Decorator(canvas, cells, palette);
    if(sprawl)  decorator.addChaos(1,3);
    decorator.fillColorGeneric(gradientDirection, gradient.gradient[0], gradient.gradient[1], light, dark, satMin, satMax, sky)


    decorator.paintCells();

    decorator.fillWithCircles(false, isStrokeInverted, false, false, surpiseColor(), BLEND);

    decorator.fillwithTriangles(BLEND);
    decorator.fillHorizontalLines(true, true, true, false, getHorizontalCount(divLevel), randRange(0.4, 0.2), 0.8);

    this.printHiddenFeatures(false, isStrokeInverted, true);
    return true
}





function nightCityMonochrome() {
    cell = new Cell(createVector(width * 0.01, height * 0.01), createVector(width * 0.99, height * 0.99), 0);

    cell.sortPoints();

    let cells = cell.subDivide(divLevel, 0.1, 0.8, 16, 60); //cell.subDivide(intRandRange(2,6),random(0.1,1),random(0.1,1),intRandRange(4,40),(intRandRange(4,40)));

    decorator = new Decorator(canvas, cells, palette);
    decorator.setStyle("monochrome");
    decorator.setTime("night");
    decorator.fillMonochromeNight(0, 40, 0, 60, 0.3);
    if(sprawl) decorator.addChaos(randRange(1,3));
    decorator.paintCells();

    decorator.fillWithCircles(false, true, true, false, surpiseColor(), BLEND);
    decorator.fillwithTriangles(BLEND);
    if (hasHorizontalLines) decorator.fillHorizontalLines(false, true, false, false, getHorizontalCount(divLevel), randRange(0.1, 0.5), 1);
    if (hasCellStroke) decorator.displayDebugView(color(255, 0, 60), 0.45);
    this.printHiddenFeatures(false, false, false);
}

function dayCityMonochrome() {

    cell = new Cell(createVector(width * 0.01, height * 0.01), createVector(width * 0.99, height * 0.99), 0);

    cell.sortPoints();

    let cells = cell.subDivide(divLevel, 0.1, 0.8, 16, 60); //cell.subDivide(intRandRange(2,6),random(0.1,1),random(0.1,1),intRandRange(4,40),(intRandRange(4,40)));

    decorator = new Decorator(canvas, cells, palette);
    decorator.setStyle("monochrome");
    decorator.setTime("dayTime");
    decorator.fillMonochromeDay(0, 40, 100, 0, 0.3);
    if(sprawl) decorator.addChaos(randRange(1,3))
    decorator.paintCells();

    decorator.fillWithCircles(false, true, true, false, surpiseColor(), BLEND);
    decorator.fillwithTriangles(BLEND);
    if (hasHorizontalLines) decorator.fillHorizontalLines(false, true, false, false, getHorizontalCount(divLevel), randRange(0.1, 0.5), 1);
    if (hasCellStroke) decorator.displayDebugView(color(255, 0, 100), 0.45);

    this.printHiddenFeatures(false, false, false);
    return true;
}

function vibrantCityDay() {
    let light = intRandRange(80, 120);
    let dark = intRandRange(10, 20);
    let satMin = intRandRange(60, 80);
    let satMax = intRandRange(90, 110);
    let hasStroke = getBoolWeighted([50, 50]);
    let sky = randRange(0.3, 0.7);
    let isStrokeInverted = getBoolWeighted([20, 80]);
    let hasDots = getBoolWeighted([50, 50]);
    let hl_height = randRange(0.3, 0.6);
    



    cell = new Cell(createVector(width * 0.01, width * 0.01), createVector(width * 0.99, height - width * 0.01), 0);
    cell.sortPoints();
    let cells = cell.subDivide(divLevel, 0.1, 0.7, 16, 40); //cell.subDivide(intRandRange(2,6),random(0.1,1),random(0.1,1),intRandRange(4,40),(intRandRange(4,40)));
    decorator = new Decorator(canvas, cells, palette);
    if (sprawl) decorator.addChaos(randRange(1, 2));

    
    decorator.fillColorGeneric(gradientDirection, gradient.gradient[0] - 10, gradient.gradient[1] + 10, light, dark, satMin, satMax, sky)

    decorator.paintCells();

    decorator.fillWithCircles(hasStroke, isStrokeInverted, areCirclesBlack, false, surpiseColor(), BLEND);
    decorator.fillwithTriangles(BLEND);
    if (hasHorizontalLines) decorator.fillHorizontalLines(false, false, hasDots, false, hl_count, hl_height, 0.7, 0.7);
    if (hasCellStroke) decorator.displayDebugView(color(255, 255, 0), randRange(0.15, 0.35));
    
    this.printHiddenFeatures(hasStroke, isStrokeInverted, hasDots);
    return true
}


function vibrantCityNight() {
    let light = intRandRange(30, 40);
    let dark = intRandRange(100, 120);
    let satMin = intRandRange(80, 100); // 60 /80
    let satMax = intRandRange(0, 20);
    let hasStroke = getBoolWeighted([50, 50]);
    let sky = randRange(0.2, 0.5);
    let isStrokeInverted = getBoolWeighted([20, 80]);
    let hasDots = getBoolWeighted([50, 50]);
    let hl_height = randRange(0.2, 0.5);
    
    let hlDot_add = getBoolWeighted([30, 70]);




    cell = new Cell(createVector(width * 0.01, width * 0.01), createVector(width * 0.99, height - width * 0.01), 0);
    cell.sortPoints();
    let cells = cell.subDivide(divLevel, 0.1, 0.7, 16, 40); 
    decorator = new Decorator(canvas, cells, palette);
    if (sprawl) decorator.addChaos(randRange(1, 2));

   


    decorator.fillColorGeneric(gradientDirection, gradient.gradient[0], gradient.gradient[1], light, dark, satMax, satMin, sky)

    decorator.paintCells();

    decorator.fillWithCircles(hasStroke, isStrokeInverted, areCirclesBlack, false, surpiseColor(), BLEND);
    decorator.fillwithTriangles(BLEND);
    if (hasHorizontalLines) decorator.fillHorizontalLines(false, hlDot_add, hasDots, false, hl_count, hl_height, 0.7);
    if (hasCellStroke) decorator.displayDebugView(color(gradient.gradient[0], 50, intRandRange(20, 60)), randRange(0.35, 0.55)); //
    this.printHiddenFeatures(hasStroke, isStrokeInverted, hasDots);
    return true
}


function rainbowCityDay() {
    let hasStroke = getBoolWeighted([50, 50]);
    let isStrokeInverted = getBoolWeighted([50, 50]);
    let hasDots = getBoolWeighted([50, 50]);
    cell = new Cell(createVector(width * 0.01, width * 0.01), createVector(width * 0.99, height - width * 0.01), 0);
    cell.sortPoints();
    let cells = cell.subDivide(divLevel, 0.1, 0.7, 16, 40); //cell.subDivide(intRandRange(2,6),random(0.1,1),random(0.1,1),intRandRange(4,40),(intRandRange(4,40)));
    decorator = new Decorator(canvas, cells, palette);
    if (sprawl) decorator.addChaos(randRange(1, 2));
    decorator.fillColorGeneric(gradientDirection, 0, 360, 200, 0, 0, 80, randRange(0, 0.2))

    decorator.paintCells();

    decorator.fillWithCircles(hasStroke, isStrokeInverted, false, surpiseColor(), BLEND);
    decorator.fillwithTriangles(BLEND);
    if (hasHorizontalLines) decorator.fillHorizontalLines(false, false, hasDots, false, hl_count, 0.4);
    if (hasCellStroke) decorator.displayDebugView(color(intRandRange(0, 360), 100, 100), 0.15);
    this.printHiddenFeatures(hasStroke, isStrokeInverted, hasDots);
    return true
}


function rainbowCityNight() {
    let hasStroke = getBoolWeighted([50, 50]);
    let isStrokeInverted = getBoolWeighted([50, 50]);
    let hasDots = getBoolWeighted([50, 50]);
    cell = new Cell(createVector(width * 0.01, width * 0.01), createVector(width * 0.99, height - width * 0.01), 0);
    cell.sortPoints();
    let cells = cell.subDivide(divLevel, 0.1, 0.7, 16, 40); //cell.subDivide(intRandRange(2,6),random(0.1,1),random(0.1,1),intRandRange(4,40),(intRandRange(4,40)));
    decorator = new Decorator(canvas, cells, palette);
    if (sprawl) decorator.addChaos(randRange(1, 2));

    decorator.fillColorGeneric(gradientDirection, 0, 360, 0, 90, 25, 80, randRange(0, 0.4))

    decorator.paintCells();

    decorator.fillWithCircles(hasStroke, isStrokeInverted, false, surpiseColor(), BLEND);
    decorator.fillwithTriangles(BLEND);
    if (hasHorizontalLines) decorator.fillHorizontalLines(false, false, hasDots, false, hl_count, randRange(0.4, 0.6), 1);
    if (hasCellStroke) decorator.displayDebugView(color(intRandRange(0, 360), 100, 100), 0.15);
    this.printHiddenFeatures(hasStroke, isStrokeInverted, hasDots);
    return true
}

function Chaotic() {
    
    let hasStroke = getBoolWeighted([50, 50]);
   
    let isStrokeInverted = getBoolWeighted([30, 70]);
    let hasDots = getBoolWeighted([50, 50]);
    let hl_height = randRange(0.4, 0.7);
    
    let hlDot_add = getBoolWeighted([30, 70]);

    let orig_prob = getBoolWeighted([25, 75])



    cell = new Cell(createVector(width * 0.01, width * 0.01), createVector(width * 0.99, height - width * 0.01), 0);
    cell.sortPoints();
    let cells = cell.subDivide(divLevel, 0.1, 0.7, 16, 40); 
    decorator = new Decorator(canvas, cells, palette);
    if (sprawl) decorator.addChaos(randRange(1, 2));

    if (orig_prob === true) {
        decorator.fillColorX(intRandRange(10, 20), intRandRange(30, 50));
    } else {
        decorator.fillColorGenesis(gradientDirection, intRandRange(0, 360), intRandRange(180, 360));
    }




    decorator.paintCells();

    decorator.fillWithCircles(hasStroke, isStrokeInverted, areCirclesBlack, false, surpiseColor(), BLEND);
    decorator.fillwithTriangles(BLEND);
    decorator.fillHorizontalLines(false, hlDot_add, hasDots, false, getHorizontalCount(divLevel), hl_height, 1);
    if (hasCellStroke) decorator.displayDebugView(color(255, 255, 0), 0.15);
    this.printHiddenFeatures(hasStroke, isStrokeInverted, hasDots);
    if(orig_prob){
        console.log("This is the first Metropolis IX created on 10/05/2022")
    }
    return true
}

printHiddenFeatures = (hasStroke, isStrokeInverted, hasDots, ) => {
    console.log("Hidden Features:")
    console.log("Circle Stroke:" + hasStroke + "\n" + "Inverted Circle Stroke: " + isStrokeInverted + "\n" );
    if (hasHorizontalLines) {
        console.log("Dots on Buildings:" + hasDots)
    }
}