# fx(hatch)

## What is this?

This is highly experimental code.

This is a version of my [rayhatcher framework](https://www.fxhash.xyz/article/rayhatching-evolution) that can do literally everything. Or, at least anything you can do within 512 characters of Javascript code. Which is slightly more than a mortal brain can comprehend.

This is my answer to the question: What is the least restrictive set of parameters for fx(params)?

## Should I be minting this?

Depends if you know and like building SDF formulas. Otherwise probably not. Like I said, this is highly experimental code. But it's definitely worth checking the collection and/or secondary for cool stuff that is already minted.

## How does it work?

You design an SDF (Signed Distance Function) and then it renders it using my rayhatcher algorithm. If this confuses you, please refer to the [previous section](#should-I-be-minting-this).

You enter the SDF formula in the [SDF Code](#sdf-code) parameter. It's not very complicated to write, just efficient. I have provided a great deal of [useful functions](#list-of-functions-and-definitions) to help you define your SDF formulas.

## Description of the params

### Title Seed

The **Title Seed** seeds the pseudo-random number generator. The camera viewpoint and light source position are randomly generated. Modifying this parameter will select a different one. It is always combined with the minter seed (so it's not really possible to mint the same exact scene from different wallets).

The **Title Seed** also seeds the provided [noise function](#list-of-functions-and-definitions).

When minted, the **Title Seed** is saved as the **"Title"** feature! So make it count! 

### SDF code

**SDF code** is the best param ever. This is how you specify the SDF for the scene being rendered. The SDF function is made of Javascript code, and will be initialized like this:

```js
    SDF=Function(`[x,y,z],`+INIT,`return `+BACK.replace('$',`(${FUNC})`));
``` 

The `INIT` and `FUNC` expressions are specified in the **SDF code** parameter, separated by a semicolon `;`.

The parameters `[x,y,z]` are the location in 3D space where the SDF is to be evaluated. It is passed as a 3-element Array, and [unpacked](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) into local variables `x`, `y` and `z` for ease of calculation. 

After that the (optional) `INIT` expression is evaluated, which you can use to define your own local variables (for instance for rotated coordinates, see example in the [rotation params section](#a0--r0-and-a1--r1)). 

Finally the function returns the value of the `BACK` expression with the `FUNC` expression inserted into it (see [background parameter](#background)).

There are many [pre-defined functions](#list-of-functions-and-definitions) available. For the following example, it helps to know that `B=abs` and `L` means the length of a vector (distance to the origin). Subtracting a value from the length of a vector gives the SDF of a sphere of that radius, centered on the origin.

```js
b=B(y-12)-6;
L(x,b,z)-6`
```

In the above example the local variable `b` is initialized to `B(y-12)-6`. The `FUNC` expression describes a sphere of radius 6, using the `L` length function. However because it uses the newly defined `b` variable for the 2nd coordinate, this results in a duplicated/reflected sphere in the y-direction.

Of course you don't really _need_ the `INIT` expression in above example (just `L(x,B(y-12)-6,z)-6` would also work). But sometimes you might want to have some local variables to efficiently re-use certain calculations, or for other reasons. The `INIT` expression is also useful when used together with the `r0` or `r1` [rotation functions](#a0--r0-and-a1--r1). 

Throughout the program, vectors are represented as Arrays of length 2 or 3. Some provided functions do not accept Arrays, but separate `x`, `y` and `z` parameters. If you need to pass them an Array vector anyway, use Javascript's [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax): `L(...p)`.

This syntax and the destructuring assignment (especially for function parameters) makes working with length 2 or 3 Arrays as vectors a breeze, and is therefore my preferred vector representation in Javascript. And of course don't forget [Array literal notation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Array#array_literal_notation) to quickly create Arrays on the spot. My experience is that they're pretty performant, I'm not sure how much of the packing/unpacking is getting optimized away, but I get the feeling it's quite a whole lot. Also, the Garbage Collector in modern JS engines is really good and I wouldn't worry about it.

#### Repetition macro

_I'm not going to say this is "advanced", because you are already advanced, because you're writing SDFs. But if you want, you can [skip](#background) this section for now and return to it later._

In order to facilitate creation of fractal SDFs, as well as compactness of formulas, a repetition macro is provided for both the `INIT` and the `FUNC` expressions. It modifies and repeats part of the code before compilation. This macro generally looks like this:

```js
@RANGE{CODE}
```

Here, `RANGE` can be a positive integer. In this case, the `CODE` is repeated that many times. Inside `CODE` the special macro variable `$` will be replaced with the loop index (zero based).

However, `RANGE` can also be a string of alphabetic characters. In this case, `CODE` is repeated for each character in the string, and the macro variable `$` will be replaced with that character. Additionally, the macro variable `@` will be replaced with the numerical loop index. This can be especially useful if you want to do the same thing to the `x`, `y` and `z` variables, such as in this example, which creates eight mirrored spheres:

```js
@xyz{$=B($)-6,}
L(x,y,z)-5
```

The above code macro expands to the following:

```js
x=B(x)-6,y=B(y)-6,z=B(z)-6,
L(x,y,z)-5
```

Notice the comma at the end of the `CODE` string, this is important, otherwise the formula wouldn't compile. The [comma operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_operator) in JS is a bit of a weird operator, in an expression like `q=2,w=3,x=5+6,a=5,99`, the result of the full expression is just the last value (99). But it still evaluates all sub-expressions and assigns the values to the variables (because of the comma's low precedence, variable `a` will contain 5, not 99). This makes the comma function a little bit like the semicolon `;`, except for separating expressions instead of statements.

You can also nest these macros, for even more repetition. Check out this more complex example making a cool fractal cloud of spheres:

```js
s=1;
@5{
  [x,y]=r0(x,y),
  [x,z]=r1(x,z),
  @xyz{$=B($*2)-8,}
  s*=.5,
}
(L(x,y,z)-8)*s
``` 

This example uses both rotation functions `r0` and `r1` to transform the space, and then applies a mirroring operation (remember, `B=abs`) to each of the `x`,`y` and `z` axes. It also scales each coordinate by 2 (making everything smaller). In order to account for this scaling, the local variable `s=1` is used, and multiplied by .5 on every step. This procedure is then repeated 5 times. Then, in this folded and scaled space, we evaluate a sphere of radius 8 (which subsequently gets repeated all over the place). Finally the result is multiplied by the scalling correction `s`.

Bonus variations: Try using one of the "smooth abs" functions `qB` or `sB` (see [below]((#list-of-functions-and-definitions))) instead of the regular abs `B` instead, for the mirroring. Don't forget to add the smoothness parameter. This can create wild organic shapes, especially with smoothness values around or even exceeding the sphere radius. Of course don't forget to tweak the rotation angles `r0` and `r1` with the sliders, as well.

But wait, there is more! :) When in a repetition macro, `$` is replaced with the current element of the range. But `$$` will be replaced with the _next_ element, and `$$$` with the one after that. All this happens modulo the length of the range. So in a range like `xyz` for the first repetition, `$` would become `x`, and `$$` would become `y`, and so on. You can use it to efficiently define a cool Menger Sponge fractal like this: 

```js
r=bx3(x,y,z,9),s=1;
@3{
@xyz{$=(mod($+9,18)-9)*3,}
s/=3,
r=k(r,-U(@xyz{bx2($,$$,9),})*s),
}r
```

(Thanks to [Ivan](https://twitter.com/i_dianov) for the fractal idea and requesting a feature like this)

### Background

The **Background** parameter picks from a couple of predefined backgrounds, used as the `BACK` expression:

* podium: `min(k(L(x,z)-12-y/5,y+1)-1,$)`,
* plane: `min(y,$)`,
* wall: `min(z+12,$)`,
* none: `$`

Here `$` would be replaced by the `FUNC` expression. Feel free to use the "none" option though, and create your own backgrounds (for instance you might prefer a smooth minimum with the plane). 

### a0 / r0 and a1 / r1

`a0` and `a1` are numerical parameters that range from 0..1 for use in your formula as slider-adjustable values. 

Additionally, they are used as the angles for the rotation functions `r0` and `r1`. Unlike in shaders/GLSL, evaluating the `sin` and `cos` functions is relatively slow in Javascript. When rotating coordinates by a constant angle, it helps to precalculate the sine and cosine of that angle, so they don't need to be evaluated on every call to the SDF.

To facilitate this, two rotation functions `r0` and `r1` are provided, which perform a precalculated 2D rotation over the angles defined by `a0` and `a1`. The functions accept two parameters `x` and `y`. The return value is a vec2 Array containing the rotated coordinates.

Note the `r0` and `r1` rotation angles range from 0..1, measured in turns, not radians or degrees. So, 0.5 turns = 180 degrees = PI radians.

Here's an example for a rotated cube (`bx3` is the 3D cube SDF, see [below](#list-of-functions-and-definitions)):

```js
[a,b]=r0(x,y-9);
bx3(a,b,z,4)-.5
```

This example uses the `INIT` expression to assign the rotated coordinates to local variables `a` and `b`. The `FUNC` expression then uses these to define a rotated box (with slightly rounded edges).

Here's an example of a rotated cube that uses both `r0` and `r1` to rotate over two axes:

```js
[a,b]=r0(x,y-9),
[c,d]=r1(b,z);
bx3(a,c,d,4)-.5
```

The above example is probably confusing and might equivalently be rewritten without the `INIT` expression and local variables, instead overwriting `x`, `y` and `z` directly, like this:

```js
[x,y]=r0(x,y-9),
[y,z]=r1(y,z),
bx3(x,y,z,4)-.5
```

(notice the lack of semicolon `;` in above formula)

### Cam dist mult

Increasing the **Cam dist mult** parameter puts the camera farther away. You can also consider this as scaling the entire scene.

### Cam zoom

The **Cam zoom** parameter zooms in at the image, changing the field of view. Low values = "wide angle", higher values = "tele-lens" (flattening perspective).

### Max march dist

**Max march dist** is the distance the raymarcher will march before it decides it hasn't hit anything. This is how big your scene can be. Larger values may slow rendering, but usually not by very much.

### Mist start dist

In order to make everything look nice, the scene is smoothly faded to the [mist shade](#mist-shade) at a certain distance. The mist amount is calculated as a smoothstep between the **Mist start dist** and the [maximum marching distance](#max-march-dist).

### Fudge factor

If your SDF isn't entirely a correct distance function, rendering errors may occur. These can show up as dark blotches, because the shadow casting often fails first. Additionally parts of your scene may be missed entirely.

Fortunately the raymarching algorithm doesn't _need_ a perfect SDF, what it really needs is an _upper bound_ of that SDF. Rendering errors will only occur if you _overestimate_ the distance at some point. Of course the closer it is to the exact distance, the more efficient it will render.

One way to fix overestimation, is to multiply the entire SDF with a factor smaller than 1. This will decrease the distances everywhere, making it less likely that one of them is an overestimate. This will make rendering more accurate but slower, because all raymarching steps get smaller by that factor.

This factor is called the **Fudge factor**. By default it is set to 0.7, to start out with a little bit of leeway. If you start seeing errors in your render, try setting it to a lower value such as 0.3. If you are really sure about never overestimating the distance and you want slightly faster rendering, set it to 1.

The fudge factor can be a rather blunt tool but it works well. If you set it low enough you should be able to render highly distorted SDFs or even implicit functions--a.k.a. "signed functions" without the "distance" part, continuous functions that only have the correct sign to indicate inside/outside, and are zero on the surface. Their values don't indicate a particular distance. Would render very slowly of course.

In principle the fudge factor would be equivalent to multiplying your entire SDF expression with that factor, so this is a way to apply it manually, or only to parts of your formula. However unlike manual multiplication, the fudge factor param is not applied when casting the shadow ray (for a bit more performance).

### Shadows

The **Shadows** slider sets the amount of shadow. 0.0 are (nearly) black shadows. Set to 1.0 to turn off shadows entirely. You might want to turn off shadows to increase rendering speed, or because they got [rendering errors](#fudge-factor), or because you just don't like the look of them.

### Mist shade

Objects between the [Mist start dist](#mist-start-dist) and the [Max march dist](#max-march-dist) are faded into the **Mist shade**. By default, this value is 1.0, fading into a white mist in the distance.

### Background color

The **Background color** determines the background colour of the image.

### Hatch color

The **Hatch color** determines the stroke colour with which the image is hatched.

If the [Background color](#background-color) is set to a colour darker than the **Hatch color**, the shading will automatically be inverted to make everything look right. In this case it might be useful to also set the [mist shade](#mist-shade) to 0, to fade into the darkness.

### Line width

The **Line width** sets the stroke width with which the image is hatched, in millimetres. The default is 0.25, lowering this number will increase the amount of detail, but also increase rendering time. Set to a larger for a more abstract, cartoonish effect.

In case you intend this piece to be plottable, remember that the plotted piece will only look right if a [pen with the right line width](https://piterpasma.nl/articles/line-test) is used. Unless you scale it. Same goes if you use bright hatching on a dark background--it might be hard to find a suitable pen that works well with a plotter on dark paper.

## List of functions and definitions

I made all sorts of useful functions for SDFs available.

`max`,`floor`,`abs`,`sin`,`cos`,`min`,`imul`,`atan2`,`log`,`exp`,`sign`,`PI`  
These functions come from the JS `Math` object and are put in the global scope. Of course if you need to you can access any other ones from the `Math` object.

`TAU=PI*2`  
I hope you like TAU.

`F=(N,f)=>[...Array(N)].map((_,i)=>f(i))`  
Loop function. Used elsewhere in the program, not sure if it's useful for SDFs.

`L=(x,y,z=0)=>(x*x+y*y+z*z)**.5`  
Vec2/3 length (adapted from: Elements, Euclid 300 BC).

`H=([x,y,z=0],[a,b,c=0])=>L(x-a,y-b,z-c)`  
Vec2/3 distance (H=hypothenuse).

`A=([x,y,z=0],[a,b,c=0],t=1)=>[x+a*t,y+b*t,z+c*t]`  
Vec3 add + scalar multiply. A(p, q, t) = p + q * t. When unspecified, `t=1` for regular addition.

`mix=(a,b,p)=>a+(b-a)*p`  
Mix. Linearly interpolates between `a` and `b`, per parameter `p`.

`N=([x,y,z=0])=>[x/(m=1e-99+(x*x+y*y+z*z)**.5),y/m,z/m]`  
Vec3 normalize. You can access the length of the vector in global variable `m`.

`X=([x,y,z],[a,b,c])=>[y*c-z*b,z*a-x*c,x*b-y*a]`  
Vec3 cross product.

`D=([x,y,z=0],[a,b,c=0])=>x*a+y*b+z*c`  
Vec2/3 dot product.

`mod=(x,m)=>(x%=m,x<0?x+m:x)`  
Proper modulo that works for negative values. You can use it to repeat a coordinate like this: `x=mod(x,8)-4`. The `mod` function looks like a sawtooth wave, ramping up from 0 to `m` repeatedly, we subtract half of `m` to centre it around 0. 

`cl=(x,a,b)=>x<a?a:x>b?b:x`  
Clamp. You can use it (among other things) to stretch space like this: `x=x-cl(x,-2,2)`.

`B=abs`  
B is short for absolute. You can use it to mirror coordinates, and create reflected duplicates of things, for example `x=B(x)-3` puts the centre of the object at `x` -3 and 3.

`B(some_sdf)-r`  
Creates a hollow shell of `some_sdf` with width `r`. You usually can't see that it is hollow, unless you cut a hole in the shape. Notice how this formula looks exactly like mirroring a coordinate, in essence, it mirrors the surface. 

`U=min`  
U is short for minimum. It can be used to create the union of two or more SDFs (tip: unlike in GLSL, the Javascript minimum function accepts any number of arguments).

`G=max`  
G is short for maximum. It can be used to create the intersection of two or more SDFs. Also see the `k` 2D corner SDF below for another way of doing an intersection.

`Z=floor`  
Z is short for floor. Can be useful if you need the index of a modulo-repeated value.

`FR=fract=x=>x-floor(x)`  
FR is short for fract, which gives the fractional value of a number, or the number modulo 1. The fract function looks like a sawtooth wave, ramping up from 0 to 1 repeatedly. You can use it to repeat things, just like with the `mod` function, except you may need to scale `FR`.

`TR=x=>abs(x-floor(x/4)*4-2)-1`  
TR is short for triangle. The triangle function looks like a triangle wave, ramping from 1 to -1 and back to 1, repeatedly. Like `FR`, you can use it to repeat things, except every other thing will be mirrored. This mirroring helps keep the SDF continuous along the domain boundaries, which again helps with overestimation and possible rendering errors. If you can't get `mod` or `FR` based repetition without errors (happens at certain camera angles), perhaps give `TR` a try.

`x>threshold`  
There is no step function because in in JS, in a numerical context, `true` evaluates to 1 and `false` evaluates to 0, so you can do this instead.

`SM=(a,b,x)=>(x-=a,x/=b-a,x<0?0:x>1?1:x*x*(3-2*x))`  
[Smoothstep](https://en.wikipedia.org/wiki/Smoothstep) function. One of the most, possibly _the_ [most useful function](https://www.youtube.com/watch?v=60VoL-F-jIQ).

`g=x=>(x=abs(x-floor(x)-.5)*2)*x*(6-4*x)-1`  
Fast fake sine wave. It's made from alternating smoothsteps. Its period is 0..1 not 0..2π (again, turns not radians). Try this if you need a true sin/cos in your formula and see if it's faster.

`k=(a,b)=>a>0&&b>0?L(a,b):a>b?a:b`  
2D corner SDF. This is an extremely useful function for making distance functions. You can use combinations of it to create all sorts of shapes with right angled corners. See the "podium" [background SDF](#background) for a nice example. As you play with it, you may find it acts very similar to the `max` function, and it does. After all, a corner is the intersection of two planes at right angles. The difference, however, is if you "inflate" a corner formed by the `max` function (by subtracting a small value from it), it will stay a sharp corner (indicating it was not a 100% correct SDF). Whereas the inflated version of this 2D corner SDF will have a rounded corner (this is the expected behaviour).

`k3=(a,b,c)=>k(a,k(b,c))`  
3D corner SDF. Slightly less useful than the 2D one. Applies the 2D corner SDF `k` twice, creating a 3D right angled corner. Think of it like the corner point of an infinite cube.

`rG=rmax=(a,b,r)=>-a<r&&-b<r?L(r+a,r+b)-r:a>b?a:b`  
Round maximum. Uses the 2D corner SDF `k` as a maximum function, and offsets distances `a` and `b` by `r`, in order to create an intersection with a rounded edge of radius `r`.

`rU=rmin=(a,b,r)=>a<r&&b<r?r-L(r-a,r-b):b>a?a:b`  
Round minimum. If you can make a maximum, you can always calculate a minimum with the identity `min(a,b)=-max(-a,-b)`. This is a slightly rewritten/optimized version of that formula.

`bx2=(x,y,a,b=a)=>(x=abs(x)-a,y=abs(y)-b,x>0&&y>0?L(x,y):x>y?x:y)`  
2D square/rectangle SDF. It is equivalent to `k(B(x)-a,B(y)-b)`.

`bx3=(a,b,c,d,e=d,f=d)=>k(abs(a)-d,k(abs(b)-e,abs(c)-f))`  
3D cube/box SDF. Uses the 2D corner SDF `k`.

`don=(x,y,z,a,b)=>L(L(x,y)-a,z)-b;`  
3D donut SDF. `a`=donut radius, `b`=donut width. Swap coordinates to make donuts in different orientations. 

Consider writing out the donut formula yourself though. It's the second simplest shape after the sphere (imho). Because this allows you to replace `L(...)-c` (the 2D circle SDF) with other 2D SDFs such as the 2D square function. Try rewriting `L(L(x,y)-8,z)-2` to `bx2(L(x,y)-8,z,2)`, for a cool squared donut / "wheel". Also experiment with replacing the other `L` function (replace both and you get a "square frame"), or using different 2D shapes than the 2D square.

`L(x,y)-r`  
3D Cylinder SDF. `r`=radius. Use other coordinates to orient differently. Also, it's the 2D circle SDF, how about that. 

`L(k(x,y),z)-r`  
3D bent cylinder SDF. `r`=radius. Swap coordinates to orient differently. You can subtract or add to a coordinate to bend it at a different position. You can nest the `k` functions in all sorts of fun and interesting ways to create pipes. This is an example of the cool things you can do with the `k` function.

`sB=sabs=(x,p=.5)=>(x*x+p)**.5`  
Smooth absolute. Like the absolute function but smooth around 0. `p` is the amount of smoothness.

`qB=(x,m)=>(x=x<0?-x:x)>m?x:(2-x/m)*x*x/m`  
Smooth absolute, polynomial version. Probably slightly faster than `sB`. `m` is the amount of smoothness.

`scl=(x,p,a,b)=>(sB(x-a,p)-sB(x-b,p)+b+a)/2`  
Smooth clamp. Did you know you can build the clamp function out of absolute functions? Well, if you do that with a smooth absolute, you get a smooth clamp!

`qcl=(x,p,a,b)=>(qB(x-a,p)-qB(x-b,p)+b+a)/2`  
Smooth clamp, using polynomial version smooth absolute.

`nz=(x,y,z,s,i,o=1)=>/* noise function, see source code */`  
3D value noise function that returns values in the range -.5 to .5. Parameter `s` is for scale, it simply multiplies `x`, `y` and `z` parameters. Integer parameter `i` means "index" and selects different random (non-integer) 3D offsets into the noise field. The noise field is periodic with dimensions 1024x1024x1024. At non-integer locations, the noise field is interpolated using the cubic smoothstep polynomial. 

The noise function is very fast and it is recommended to add two or more "octaves" of it, to get more organic looking noise. This is what the final parameter `o` is for, if it is larger than 1, several layers of noise are added, each layer with double the scale `s` and multiplied to half the amplitude. Note that this (slightly) increases the amplitude of your noise, for `o=2` your range is ± (1/2+1/4)=0.75, and for `o=3` the range is ± (1/2+1/4+1/8)=0.875. As you add more and more octaves, this range approaches the limit of ±1.

`ri=(i,j,k)=>/* random values (see code) */`  
Random values on a 3D integer grid, ranging from -.5 to .5. Casts coordinates to integer. This function is used internally by the value noise function, but can also be useful for SDFs (such as for random variations of domain repetitions).

`r0=rotator(a0=par.a0); // rotate 2D coordinate by angle a0`  
`r1=rotator(a1=par.a1); // rotate 2D coordinate by angle a1`  
2D rotation functions. Rotate vec2 by a constant angle, see section about [a0/a1/r0/r1 rotation params](#a0--r0-and-a1--r1), above.

`rot=(x,y,c,s)=>[c*x+s*y,c*y-s*x]`  
Arbitrary 2D rotation function. If you want to precalc your own constant rotation, `c` and `s` are the cosine and sine of the angle, respectively.

In a pinch, most of the vec3 functions should also work for vec2. The third coordinate defaults `z=0`. If it returns a vec3, it will have the 3rd coordinate set to `0`. Exceptions are the cross product and the 3D SDFs.

## Security considerations

Yes. Good question. You [can't really filter JS expressions](https://en.wikipedia.org/wiki/JSFuck). I'm not sure if this is bad, but I think with some creativity, it could be.

So this is what I came up with. 

I allowlist a set of chars from ASCII 33-127, no funny unicode business, no quotes, no braces, no backslash, no $ or @.

```!%&()*+,-./0123456789:<=>?ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_abcdefghijklmnopqrstuvwxyz|~```

Any identifiers longer than 2 chars must also be from an allowlist. The allowlist is all the functions and identifiers in this document and also the `Math` object and all its properties and methods. This means that your local variables are going to have to be 1 or 2 chars. Here is the full allowlist:

```Math LN10 LN2 LOG10E LOG2E SQRT1_2 SQRT2 abs acos acosh asin asinh atan atan2 atanh cbrt ceil clz32 cos cosh exp expm1 floor fround hypot imul log log10 log1p log2 max min pow round sign sin sinh sqrt tan tanh trunc mix mod fract rmax rmin bx2 bx3 don sabs scl qcl rot Infinity map reduce```

Any white space ASCII 32 will be removed from the code.

Denylist `//`, `/*`, `*/`, `+[`, `](`, `to`, `of`, `in` and `--`. Yes, that last one is the decrement operator, because it is also part of HTML and SVG comments, which would break stuff because your SDF code is also [included as a comment inside the output SVG](https://twitter.com/piterpasma/status/1649071912742420482).

Finally we trap the toString method of these primitives:

```js
  let typ=[Array,Function,Object,RegExp,Uint32Array];
  let org=typ.map(v=>v.prototype.toString);
  let str=b=>typ.map(b?(v,i)=>v.prototype.toString=org[i]:v=>v.prototype.toString=_=>{throw Error('HAX')});
  str(0); // trap toString
  // ...
  str(1); // restore toString
```

Without this last trick it would be possible to cast these types to strings, which would allow you to maybe construct nasty String values such as `x="constructor"`, which would allow you to call `B[x]`, yielding the `Function` constructor, allowing for arbitrary code execution. And I want you to write arbitrary SDFs but not arbitrary code :-)

If you still manage to wriggle your way out of this, let's collab. Make art not hax ;-)


