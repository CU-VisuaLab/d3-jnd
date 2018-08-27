// Implementation based on Maureen Stone, Danielle Albers Szafir, and Vidya
// Setlur's paper "An Engineering Model for Color Difference as a Function of
// Size" presented at the Color Imaging Conference, and can be found online at
// https://research.tableau.com/sites/default/files/2014CIC_48_Stone_v3.pdf
//
// Their paper examines target sizes (visual angle) ranging from 6 to 1/3
// degree, so note that extrapolations outside that range contain additional
// untesteed assumptions about color appearence.

// To calculate whether colors are noticeably different, colors are translated
// into CIELAB perceptual color space. Further, users must specifiy a visual
// angle for how large the colored elements are (e.g., bars in a bar chart)
// along their smallest dimension (e.g., width for 25px wide x 100px tall bars).

// Variable definitions:
// nd: noticeable difference
// p: a threshold defined as the percentage of observers who see two colors
//    separated by a particular color space interval (e.g., along L*) as
//    different.
// s: size, specified in degrees of visual angle

//----------------------------------------.
// PREDICTING DISCRIMINABILITY THRESHOLDS  \___________________________________
//=============================================================================|
// // p = V(s)*Delta_D + e (i.e., y=ax+b), where
//               s: size,
//      V(s) and D: vector values of L*, a*, b*
//               e: error term
//         Delta_D: a step in CIELAB space
//            V(s): a vector of three slopes, which differ along L*, a*, and b*
//
// Therefore, Delta_D = nd(p) = p / V(s)
//
// For calculating just noticeable differences (JND), we'll assume that p should
// be fixed at 50%, which then leaves size as the only free variable for
// calculating discriminability intervals along L*, a*, and b* color channels.
//
// ND(50, s) = C(50) + K(50)/s, where C and K are regression coefficients
//
// Stone et al. also provide a generalized formula that can support p and s both
// as free variables based on additional regressions (see paper):
//
// ND(p,s) = p(A+B/s), where
//               s: size,
//               p: % of observers who see colors as different ([0,1])
//         A and B: preset values that differ for each channel
//

import {lab} from "d3-color";
import {symbolCircle} from "d3-shape";
import {symbolCross} from "d3-shape";
import {symbolDiamond} from "d3-shape";
import {symbolSquare} from "d3-shape";
import {symbolStar} from "d3-shape";
import {symbolTriangle} from "d3-shape";
import {symbolWye} from "d3-shape";

/////////////////////////////

function nd(p, size, shape, fill_type) {
  if(shape == "none") {
    var A = {l: 10.16, a: 10.68, b: 10.70},
        B = {l:  1.50, a:  3.08, b:  5.74};

    return {
      l: p * (A.l + B.l / size),
      a: p * (A.a + B.a / size),
      b: p * (A.b + B.b / size)
    };

  } else {

    var circle_filled_C_50 = {l: 5.53, a: 5.53, b: 5.07},
        circle_filled_K_50 = {l: 0.99, a: 1.81, b: 4.16};
    var circle_unfilled_C_50 = {l: 4.98, a: 7.20, b: 3.18},
        circle_unfilled_K_50 = {l: 1.62, a: 3.45, b: 8.82};

    var cross_C_50 = {l: 6.01, a: 9.74, b: 11.02},
        cross_K_50 = {l: 0.79, a: 1.39, b: 1.87};

    var diamond_filled_C_50 = {l: 4.67, a: 6.54, b: 5.81},
        diamond_filled_K_50 = {l: 1.16, a: 2.47, b: 4.22};
    var diamond_unfilled_C_50 = {l: 5.85, a: 6.69, b: 10.45},
        diamond_unfilled_K_50 = {l: 1.23, a: 3.87, b: 5.26};

    var square_filled_C_50 = {l: 5.11, a: 5.55, b: 5.03},
        square_filled_K_50 = {l: 1.02, a: 2.00, b: 3.41};
    var square_unfilled_C_50 = {l: 5.07, a: 6.26, b: 6.08},
        square_unfilled_K_50 = {l: 2.21, a: 3.96, b: 5.63};

    var star_filled_C_50 = {l: 4.64, a: 6.59, b: 7.54},
        star_filled_K_50 = {l: 2.05, a: 2.81, b: 3.38};
    var star_unfilled_C_50 = {l: 5.02, a: 7.32, b: 6.66},
        star_unfilled_K_50 = {l: 1.56, a: 2.69, b: 6.51};

    var triangle_filled_C_50 = {l: 5.75, a: 6.59, b: 5.70},
        triangle_filled_K_50 = {l: 0.90, a: 1.61, b: 4.03};
    var triangle_unfilled_C_50 = {l: 6.20, a: 7.45, b: 9.66},
        triangle_unfilled_K_50 = {l: 1.94, a: 3.13, b: 3.73};

    var wye_C_50 = {l: 7.05, a: 11.07, b: 12.15},
        wye_K_50 = {l: 1.91, a: 1.35, b: 3.45};

    switch(shape) {
      case symbolCircle:
        if (fill_type == "filled") {
          return {
            l: circle_filled_C_50.l + (circle_filled_K_50.l / size),
            a: circle_filled_C_50.a + (circle_filled_K_50.a / size),
            b: circle_filled_C_50.b + (circle_filled_K_50.b / size)
          };
        } else {
          return {
            l: circle_unfilled_C_50.l + (circle_unfilled_K_50.l / size),
            a: circle_unfilled_C_50.a + (circle_unfilled_K_50.a / size),
            b: circle_unfilled_C_50.b + (circle_unfilled_K_50.b / size)
          };
        }
      case symbolCross:
        return {
          l: cross_C_50.l + (cross_K_50.l / size),
          a: cross_C_50.a + (cross_K_50.a / size),
          b: cross_C_50.b + (cross_K_50.b / size)
        };
      case symbolDiamond:
        if (fill_type == "filled") {
          return {
            l: diamond_filled_C_50.l + (diamond_filled_K_50.l / size),
            a: diamond_filled_C_50.a + (diamond_filled_K_50.a / size),
            b: diamond_filled_C_50.b + (diamond_filled_K_50.b / size)
          };
        } else {
          return {
            l: diamond_unfilled_C_50.l + (diamond_unfilled_K_50.l / size),
            a: diamond_unfilled_C_50.a + (diamond_unfilled_K_50.a / size),
            b: diamond_unfilled_C_50.b + (diamond_unfilled_K_50.b / size)
          };
        }
      case symbolSquare:
        if (fill_type == "filled") {
          return {
            l: square_filled_C_50.l + (square_filled_K_50.l / size),
            a: square_filled_C_50.a + (square_filled_K_50.a / size),
            b: square_filled_C_50.b + (square_filled_K_50.b / size)
          };
        } else {
          return {
            l: square_unfilled_C_50.l + (square_unfilled_K_50.l / size),
            a: square_unfilled_C_50.a + (square_unfilled_K_50.a / size),
            b: square_unfilled_C_50.b + (square_unfilled_K_50.b / size)
          };
        }
      case symbolStar:
        if (fill_type == "filled") {
          return {
            l: star_filled_C_50.l + (star_filled_K_50.l / size),
            a: star_filled_C_50.a + (star_filled_K_50.a / size),
            b: star_filled_C_50.b + (star_filled_K_50.b / size)
          };
        } else {
          return {
            l: star_unfilled_C_50.l + (star_unfilled_K_50.l / size),
            a: star_unfilled_C_50.a + (star_unfilled_K_50.a / size),
            b: star_unfilled_C_50.b + (star_unfilled_K_50.b / size)
          };
        }
      case symbolTriangle:
        if (fill_type == "filled") {
          return {
            l: triangle_filled_C_50.l + (triangle_filled_K_50.l / size),
            a: triangle_filled_C_50.a + (triangle_filled_K_50.a / size),
            b: triangle_filled_C_50.b + (triangle_filled_K_50.b / size)
          };
        } else {
          return {
            l: triangle_unfilled_C_50.l + (triangle_unfilled_K_50.l / size),
            a: triangle_unfilled_C_50.a + (triangle_unfilled_K_50.a / size),
            b: triangle_unfilled_C_50.b + (triangle_unfilled_K_50.b / size)
          };
        }
      case symbolWye:
        return {
          l: wye_C_50.l + (wye_K_50.l / size),
          a: wye_C_50.a + (wye_K_50.a / size),
          b: wye_C_50.b + (wye_K_50.b / size)
        };
      default:
        return {
          l: p * (A.l + B.l / size),
          a: p * (A.a + B.a / size),
          b: p * (A.b + B.b / size)
        };
    }

  }
}

export default function jndLabInterval(p, size, shape="none", fill_type="unfilled") {
  if(typeof size === "string") {
    if(size === "thin") size = 0.1;
    else if(size === "medium") size = 0.5;
    else if(size === "wide") size = 1.0;
    else size = 0.1;
  }
  if(typeof p === "string") {
    if(size === "conservative") p = 0.8;
    else p = 0.5;
  }
  if(typeof shape === "string") {
    switch(shape.toLowerCase()) {
      case "none":
        shape = "none";
        break;
      case "circle":
        shape = symbolCircle;
        break;
      case "cross":
        shape = symbolCross;
        break;
      case "diamond":
        shape = symbolDiamond;
        break;
      case "square":
        shape = symbolSquare;
        break;
      case "star":
        shape = symbolStar;
        break;
      case "triangle":
        shape = symbolTriangle;
        break;
      case "wye":
        shape = symbolWye;
        break;
      default:
        //console.log("Invalid shape string. Please choose from the set of allowed strings,"
        //  + " or use a d3 shape symbol (i.e. symbolCircle, symbolDiamond, etc.).");
        //console.log('Using shape == "none"');
        shape = "none";
    }
  }
  return nd(p, size, shape, fill_type);
}

export function noticeablyDifferent(c1, c2, size, p, shape="none", fill_type="unfilled") {
  if(arguments.length < 3) size = 0.1;
  if(arguments.length < 4) p = 0.5

  if((shape != "none") && (p != 0.5)) {
    //console.log("Custom p values are currently not supported when using shapes. Using p == 0.5 (50%).");
    p = 0.5;
  }

  if((fill_type != "filled") && (fill_type != "unfilled")) {
    //console.log('Invalid fill type. Please choose "filled" or "unfilled". Using fill_type == "unfilled".');
    fill_type = "unfilled";
  }

  var jnd = jndLabInterval(p, size, shape, fill_type);
  c1 = lab(c1);
  c2 = lab(c2);

  return (Math.abs(c1.l-c2.l) >= jnd.l) || (Math.abs(c1.a-c2.a) >= jnd.a) || (Math.abs(c1.b-c2.b) >= jnd.b);
}
