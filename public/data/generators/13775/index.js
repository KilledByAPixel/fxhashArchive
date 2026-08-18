function mix(a, b, s){
	return a+s*(b-a);
}

const C0s = [[0.0,0.0,0.0],[1.0,1.0,1.0],[1.0,0.95,0.9],[0.1,0.2,0.025],[0.76, 0.71, 0.6]];
const C1s = [[0.5,0.5,0.5],[0.5,0.5,0.5],[0.45,0.05,0.025],[0.6,0.55,0.45],[0.17, 0.13, 0.11]];
const BGs = [[1.0,1.0,1.0],[0.0,0.0,0.0],[0.0,0.02,0.075],[1.0,0.9,0.85],[0.095, 0.05, 0.05]];

const pallette = Math.floor(Math.min(C0s.length*fxrand(),C0s.length-1));

const drawMode = (fxrand()<0.95) ? 0 : 1;
const randLines = fxrand();
const nLines = Math.floor(mix(128,384,randLines));
const pointsPerLine = nLines;
const skipFrames = 150;
const substeps = 25;
var stepSize = 0.025;
var lastStepSize = stepSize;
const extra = Math.floor(Math.min(Math.pow(fxrand(),3.0)*3.0,2.0));
const special = (fxrand()>0.98) ? 1 : 0;
var stripes = (fxrand()>((drawMode==1) ? 0.35 : 0.75)) ? Math.floor(5+fxrand()*20.0) : 0;
if ([0,2,3,4].includes(pallette)) {stripes=0;}

const pins = (fxrand()<0.6) ? 0 : 1;
const drag = 0.25;
const stiffness = mix(mix(0.1,0.5,pins),1.25,fxrand());
const stressResistance = mix(1,1.125,drawMode)*((pins==0) ? mix(15.0, 25.0,fxrand()) : mix(50.0, mix(100,150.0,randLines),stiffness));
const wind = 0.5;
const windPeriod = mix(0.75, 5.0,fxrand());
const pullback = (pins==0) ? 0.1 : 0.0;
const gravity = (pins==0) ? 0.0 : -0.1;;
var playing = 0;
const timeShift = 645.6321*fxrand();
const reconnect = (fxrand()<0.7) ? 0 : 1;
const c0 = C0s[pallette];
const c1 = C1s[pallette];
const bg = BGs[pallette];
const lightAngle = 2*Math.PI*fxrand();
const ld = [Math.cos(lightAngle),Math.sin(lightAngle),mix(0.1,0.25,fxrand())];
var timestep = 0.001;
var zoom = 0.85;
var resetRequest = 0;