let colors = [
    // {
    //     name: "", // name of color scheme
    //     hsl: [], // hsl values // fill in either this, hex or rgb, the rest will get converted automatically
    //     hex: [], // hex values 
    //     rgb: [], // rgb values
    //     bgColors: [] // possible bg colors mixed with the scheme in hex format
    // }

    {
        name: "Vermeer",
        hsl: [],
        hex: ["#4366a3", "#e3a337", "#fffaf5", "#211f2c"],
        rgb: [],
        bgColors: ["#1d2024", "#FEEDDC"]
    },
    {
        name: "Katagawa",
        hsl: [],
        hex: ["#314A66", "#1F5C81", "#547890", "#C6DCD0", "#EDE9D5", "#F3C1A1"],
        rgb: [],
        bgColors: ["#1d2024", "#FEEDDC"]
    },
    {
        name: "Mondrius",
        hsl: [],
        hex: ["#FFFFFF", "#fac901", "#225095", "#dd0100", "#000000"],
        rgb: [],
        bgColors: ["#1d2024", "#FEEDDC"]
    },

    {
        name: "Andromeda",
        hsl: [],
        hex: ["#001219", "#005f73", "#0a9396", "#94d2bd", "#e9d8a6", "#ee9b00", "#ca6702", "#bb3e03", "#ae2012", "#9b2226"],
        rgb: [],
        bgColors: ["#1d2024", "#FEEDDC"]
    },
    {
        name: "Cygnus",
        hsl: [],
        hex: ["#3234FB", "#5157D0", "#B596F1", "#F87AC0", "#FBCAB1", "#FCB895", "#FCC38D"],
        rgb: [],
        bgColors: ["#1d2024", "#FEEDDC"]
    },
    // {
    //     name: "Ursa Major", // commander shepard, chris mccully
    //     hsl: [],
    //     hex: ["#3D5A80", "#98C1D9", "#E0FBFC", "#FF4D21", "#f57556", "#e07a5f", "#293241"],
    //     rgb: [],
    //     bgColors: ["#1d2024", "#FEEDDC"]
    // },
    {
        name: "McWoot",
        hsl: [],
        hex: ["#ED6A5A", "#5B9279", "#55D6C2", "#81B29A", "#636CCE", "#DFB2F4", "#a6559d"],
        rgb: [],
        bgColors: ["#1d2024", "#FEEDDC"]
    },
    // {
    //     name: "Corvus",
    //     hsl: [],
    //     hex: ["#ff8906", "#f25f4c", "#e53170", "#c81d6f", "#9a174d", "#6d0e2f", "#3f0a1d"],
    //     rgb: [],
    //     bgColors: ["#1d2024", "#FEEDDC"]
    // },
    {
        name: "Hydra",
        hsl: [],
        hex: ["#EEC88C", "#369E87", "#148A90", "#195373", "#242359", "#541B53", "#A41E4D"],
        rgb: [],
        bgColors: ["#1d2024", "#FEEDDC"]
    },
    // {
    //     name: "Borealis",
    //     hsl: [],
    //     hex: ["#013B5D", "#009CA6", "#00A5BC", "#71C7DA", "#19A674", "#00844E", "#272729"],
    //     rgb: [],
    //     bgColors: ["#1d2024", "#FEEDDC"]
    // },
    {
        name: "Centaurus",
        hsl: [],
        hex: ["#e3a337", "#EABD37", "#F0B510", "#9F5817", "#7B607C", "#4F5B66", "#2E3A4F"],
        rgb: [],
        bgColors: ["#1d2024", "#FEEDDC"]
    },
    {
        name: "Draco",
        hsl: [],
        hex: ["#E87B4B", "#F0B510", "#3BB477", "#456B8C", "#8644a6", "#BEA5A8", "#222831"],
        rgb: [],
        bgColors: ["#1d2024", "#FEEDDC"]
    },
    // {
    //     name: "Canes",
    //     hsl: [],
    //     hex: ["#00050B", "#086038", "#0B6C4B", "#6B977B", "#F18601", "#F17211", "#E94209"],
    //     rgb: [],
    //     bgColors: ["#1d2024", "#FEEDDC"]
    // },
    {
        name: "Virgo",
        hsl: [],
        hex: ["#0E0C0F", "#1F1B21", "#9F907A", "#CFC8BD", "#E4E3DE", "#D4D4D4", "#B1AEA7"],
        rgb: [],
        bgColors: ["#1d2024", "#FEEDDC"]
    },
    {
        name: "Monet",
        hsl: [],
        hex: ["#76B1D3", "#5F96C3", "#AD9361", "#C7A255", "#4B884F", "#474E24", "#A3515F", "#C35C6B"],
        rgb: [],
        bgColors: ["#1d2024", "#FEEDDC"]
    },
]

function getColorValues() { // gets missing rgb / hex values for color schemes.
    for (const colorScheme of colors) {
        let filledInType = "rgb";
        if (colorScheme.hsl.length > 0) filledInType = "hsl";
        if (colorScheme.hex.length > 0) filledInType = "hex";

        if (colorScheme.hsl.length == 0) colorScheme.hsl = convertColors(filledInType, "hsl", colorScheme);
        if (colorScheme.rgb.length == 0) colorScheme.rgb = convertColors(filledInType, "rgb", colorScheme);
        if (colorScheme.hex.length == 0) colorScheme.hex = convertColors(filledInType, "hex", colorScheme);
    }
}

function convertColors(typeIn, typeOut, scheme) {
    let filledInColors = scheme[typeIn];
    let outArr = [];
    for (const clr of filledInColors) {
        if (typeIn == "hsl" && typeOut == "rgb") outArr.push(hslToRgb(clr[0], clr[1], clr[2]));
        if (typeIn == "hsl" && typeOut == "hex") outArr.push(hslToHex(clr[0], clr[1], clr[2]));

        if (typeIn == "rgb" && typeOut == "hsl") outArr.push(rgbToHsl(clr[0], clr[1], clr[2]));
        if (typeIn == "rgb" && typeOut == "hex") outArr.push(rgbToHex(clr[0], clr[1], clr[2]));

        if (typeIn == "hex" && typeOut == "hsl") outArr.push(hexToHsl(clr));
        if (typeIn == "hex" && typeOut == "rgb") outArr.push(hexToRgb(clr));
    }

    return outArr;
}

// ------------------------------------------
//               COLOR UTILS
// ------------------------------------------

// convert rgb color to normalized hsl values
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

// hsl to rgb, takes normalized hsl values
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


// hsl to hex, takes normalized hsl values
function hslToHex(h, s, l) {
    h *= 360;
    s *= 100;

    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// get normalized hsl values from hex color
function hexToHsl(hex) {
    let rgb = [
        parseInt(hex.substr(1, 2), 16), // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
        parseInt(hex.substr(3, 2), 16),
        parseInt(hex.substr(5, 2), 16)
    ];
    return rgbToHsl(rgb[0], rgb[1], rgb[2]);
}

// used in rgb to hex function
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

// rgb to hex
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// hex to rgb
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

function colorContrast(hexcolor) {
    if (hexcolor.charAt(0) == "#") hexcolor = hexcolor.substr(1);
    if (hexcolor.length == 3) {
        hexcolor = hexcolor.charAt(0) + hexcolor.charAt(0) + hexcolor.charAt(1) + hexcolor.charAt(1) + hexcolor.charAt(2) + hexcolor.charAt(2);
    }
    hexcolor = hexcolor.toLowerCase();
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}