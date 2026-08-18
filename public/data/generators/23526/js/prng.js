// PRNG by piterpasma
// Thanks Piter!
S=Uint32Array.from([n=9,t=7,5,3]);
R=(a=1)=>a*(t=S[3],S[3]=S[2],S[2]=S[1],S[1]=n=S[0],t^=t<<11,S[0]^=(t^t>>>8)^(n>>>19),S[0]);
[...fxhash+'ThxPiter'].map(c=>R(S[3]^=c.charCodeAt()*23205));
