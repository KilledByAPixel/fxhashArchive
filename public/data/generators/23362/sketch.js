
const random = (a = 1, b = 0) => fxrand()*(b - a) + a; 
// Merci Orr Kislev (@OrrKislev) pour cette courte mais précieuse ligne de code.

let p1,q1,p2,q2,p3,q3,p4,q4,p5,q5; // silhouette
let m1,n1,m2,n2,m3,n3,m4,n4,m5,n5; // monolithe
let hor1,hor2,hor3,hor4,ver1,ver2,ver3,ver4,rec1,rec2,recw,rech; // éléments de l'arrière plan
let num; // hasard 


function setup() {
    
    createCanvas(2000,2000);
    
    /* couleurs*/
    blanc = color(255);
    noir = color(40);
    grisclair = color(245);
    gris = color(170);
    grisfonce = color(100);
    rouge = color(200,100,80);
    dore = color(250,220,100);
    smoothblack1 = color(50,30);
    smoothblack2 = color(50,50);

    /* silhouette */
    //épaule gauche
    p1 = random(20,width-20);
    q1 = random(25,height-85);
    //épaule droite
    p2 = random(p1+10,p1+20);
    q2 = random(q1-11,q1+11);
    //pied droit
    p3 = random(p1+13,p1+17);
    q3 = random(q1+50,q1+80);
    //pied gauche
    p4 = random(p1+4,p1+8);
    q4 = q1+q3-q2-2;
    //sommet du cône d'ombre
    p5 = random((p3+p4)/2-200,(p3+p4)/2+200);
    q5 = random((q3+q4)/2-150,(q3+q4)/2+150);
    
    /* monolithe */
    m1 = random(0,width-65);
    n1 = random(0,height-245);
    m2 = random(m1+30,m1+60);
    n2 = n1;
    m3 = random(m2,m2+2);
    n3 = random(n2+60,n2+240);
    m4 = random(m1-2,m1);
    n4 = n3;    
    //sommet du cône d'ombre
    m5 = (m3+m4)/2+(p5-(p3+p4)/2)*3; //x
    n5 = n3+(q5-q3)*3; //y
    
    /* arrière plan */
    //ligne horizontale
    hor1 = 0;
    hor2 = random(40,height-40);
    hor3 = width;
    hor4 = hor2;    
    //ligne diagonale
    ver1 = random(0,width);
    ver2 = 0;
    ver3 = random(0,width);
    ver4 = height;
    //rectangle
    rec1 = 0;
    rec2 = random(0,height);
    recw = width;
    rech = (height-rec2);
    
    num = random(0,100);

    angleMode(DEGREES);
    strokeCap(SQUARE); 
    
    noLoop(); 
    
    fxpreview();
}


function draw() {
    
    if (num < 61) {
        background(blanc);
        bkgd();
        stroke(gris);
        fill(gris);
        silhouombre();
        stroke(rouge);
        fill(rouge);
        silhouette();
        if (num > 30) {
            monolombre();
            stroke(gris);
            fill(gris);        
            monolithe();
        } else {
            stroke(smoothblack1);
            line(hor1,hor2,hor3,hor4);
        }
    } else if (num < 91) {
        background(grisfonce);
        if (num < 77) {
            strokeWeight(random(1,3));
            stroke(rouge);
            } else {
            noStroke();
        }
        line(hor1,hor2,hor3,hor4);
        fill(blanc);
        stroke(blanc);
        silhouombre();
        silhouette();
        monolombre();
        stroke(dore);
        fill(dore);
        monolithe();
    } else if (num < 97){
        background(rouge);
        stroke(grisfonce);
        fill(grisfonce);
        silhouombre();
        stroke(noir);
        fill(noir);
        silhouette();
        stroke(grisfonce);
        fill(grisfonce);
        monolombre();
        stroke(noir);
        fill(noir);
        monolithe();
    } else {
        background(dore);
        strokeWeight(random(1,5));
        stroke(rouge);
        line(hor1,hor2,hor3,hor4);
        stroke(grisfonce);
        fill(grisfonce);
        silhouombre();
        stroke(rouge);
        fill(rouge);
        silhouette();
        stroke(grisfonce);
        fill(grisfonce);
        monolombre();
        stroke(blanc);
        fill(blanc);
        monolithe(); 
    }

    // texture
    for(let i = 0;i<width*10;i++){
        drawTexture();
    }
    
}


function bkgd () {
    fill(grisclair);
    if (num < 30) {
        //ligne horizontale
        strokeWeight(random(0.66,2));
        stroke(gris);
        line(hor1,hor2,hor3,hor4);
    } else if (num < 60){
        //ligne diagonale
        strokeWeight(random(0.66,2));
        stroke(gris);
        line(ver1,ver2,ver3,ver4);
    } else {
        //rectangle avec ou sans bordure
        if (num > 75) {
            strokeWeight(random(0.66,2));
            stroke(gris);
        } else {
            noStroke();
        }
        rect(rec1,rec2,recw,rech);
    } 
    noFill();
}


function silhouombre (){
    triangle(p4,q4,p3,q3,p5,q5);
}

function silhouette (){
    //corps
    quad(p1,q1,p2,q2,p3,q3,p4,q4);
    //nuque
    curve(p1-15,q1+50,p1,q1,p2,q2,p2+15,q2+50);
    //tête
    ellipse((p2+p1)/2,(q1+q2)/2-random(8,12),random(10,13),random(12,15));
    //bras
    curve(random(p1+30,p1+60),q1,p1,q1,p4,q4-(q4-q1)/5*random(2,3),random(p3+30,p3+60),q3);
    curve(random(p2-30,p2-60),q2,p2,q2,p3,q3-(q3-q2)/5*random(2,3),random(p4-30,p4-60),q4);
}

function monolombre () {
    triangle(m4,n4,m3,n3,m5,n5);
}

function monolithe () {
    quad(m1,n1,m2,n2,m3,n3,m4,n4);
}

function drawTexture () {   
    noFill();
    let e1 = random(-300,2300);
    let f1 = random(-300,2300);
    let e2 = random(-300,2300);
    let f2 = random(-300,2300);
    let dis = dist(e1,f1,e2,f2);
    if (dis<width*2) {
        let num = random(0,100);
        if (num < 96) {
            // texture générale
            let w1 = random(-300,width+300);
            let h1 = random(-300,height+300);
            let w2 = random(-300,width+300);
            let h2 = random(-300,height+300);              
            stroke(smoothblack1);
            strokeWeight(0.15);
            curve(f1,e1,w1,h1,w2,h2,e2,f2); 
        } else if (num < 99.99) {
            // multitude de petits traits
            let w = random(0,width/2);
            let h = random(0,height/2);
            let angle1 = random(0,360);
            let angle2 = random(angle1,angle1+angle1/15); 
            stroke(smoothblack2);
            strokeWeight(random(0.3,1.3));
            arc(e1,f1,w/2,h/2,angle1,angle2);
        } else {
            // très rares longues traces
            stroke(smoothblack2);
            strokeWeight(random(0.6,1.3));
            curve(e1/2,f1/2,e1,f1,e2,f2,f2*2,e1*2);
        }
    }
}

function keyPressed() {
    "s" === key && saveCanvas("antonio werli - thébaïde - 2023 - " + fxhash + ".png");
} 