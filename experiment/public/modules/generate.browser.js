require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Xl38Vh":[function(require,module,exports){
var process=require("__browserify_process");(function(exports){

var r      = parseFloat(process.argv[2]) || 0.2
  , n      = parseInt(process.argv[3]) || 100
  , m      = 0.0
  , sd     = 1
  , max    = require('numbers').basic.max
  , sum    = require('numbers').basic.sum
  , min    = require('numbers').basic.min
  , mean   = require('numbers').statistic.mean
  , sdc    = require('numbers').statistic.standardDev
  , corr   = require('numbers').statistic.correlation
  , gas    = require('science').stats.distribution.gaussian()
  , rotate = require('numbers').matrix.rotate
  , transpose = require('numbers').matrix.transpose
  , extent = 400
  , mratio = 0.5
  , sdratio = 0.2
  
  debug = false
  
exports.version = {version: "0.0.1"};

exports.trans = function(d){
	return transpose(d)
}

exports.decompress = function(d){
  return d.map(function(d) {
	 return decompress(d)
  })
}

exports.compress = function(d){
  return d.map(function(d) {
	 return compressPair(d[0], d[1])	
  })
}

exports.getPercentage = function(d){
	return getPercentage(d)
}
exports.corr = function (d){
	var arr = reform3(d)
	, arrX = arr[0]
	, arrY = arr[1]
	return corr(arrX, arrY)
}

exports.rot = function (d, dg, ws){
	return rot(d, dg, ws)
}
	
exports.setBox = function (params){
	return setBox(params)
}	

exports.aver = function (d) {         
    return mean(d);
 }

exports.variance = function (d) {
   return sdc(d) * sdc(d)
}
//input [X:[x1,x2,x3], Y:[y1,y2,y3]], output [[x1,y1],[],[]]
exports.dataviz = function (d) {
    return reform(d)
}

exports.dataviz2 = function (d) {
    return reform2(d)
}

//input  [[x1,y1],[],[]] , output [[x1,x2,x3], [y1,y2,y3]]
exports.oneToTwo = function (d) {
    return reform3(d)
}

exports.min = function (d) {
    return min(d)
}

exports.max = function (d) {
    return max(d)
}

exports.sdc = function (d) {
    return sdc(d)
}
exports.getStack = function (d) {
    return getStack(d)

}
// This generator generates x and y array respectively. 
// i.e.{X:[x1,y1],Y:[x2,y2]}. Then check func will check the result. If the result is valid, 
// it returns the result. Otherwise, it will redo.
// Remember to transform the two array into one using dataviz
exports.getCorrelatedData = function (params) {
    if (params){
      if(params.r || params.r === 0)
        r = params.r
      if(params.n)
        n = params.n
      if(params.extent)
        extent = params.extent
      if(params.mratio)
    	mratio = params.mratio
      if(params.sdratio)
      	sdratio = params.sdratio
    }
    if(debug) {console.log("r input is " + r)}
    var rsign = r       // record the raw r
        r = Math.abs(r) // in case for accident
    var flag = 0,
    	k = [];
    
    do {
    k = generate();
    k = standardize(k);
    k = adjust(k);
    //k = normalize(k)
    k = standardize(k);
    k = scale(k);
    flag = check(k);
    } while ( flag == -1 )
    	
    if (rsign < 0)
    	for(var i in k.Y)
    		k.Y[i] = extent - k.Y[i] 
    
    if(debug) {console.log("r output is " + corr(k.X, k.Y))}
    return k
}

function nextGauss() {
    var x = gas()
    while (x < -2 || x > 2)
	x = gas()

    var y = gas()
    while (y < -2 || y > 2)
	y = gas()

    return [x,y]
}

function generate() {
    var xarr = []
    var yarr = []

    for (var i = 0; i < n; i++) {
	var one = nextGauss();

	xarr.push(one[0])
	yarr.push(one[1])
    }

    return {
	"X" : xarr,
	"Y" : yarr
    }
}

function calculateLambda(d) {
    var rz = corr(d.X, d.Y), rz2 = Math.pow(rz, 2)
    , a = (2 * r * r - 2 * r * r * rz - 1 + 2 * rz - rz2)
    , b = (-2 * r * r + 2 * r * r * rz - 2 * rz + 2 * rz2)
    , c = (r * r - rz2)
    return (-1.0 * b - Math.sqrt(b * b - 4 * a * c)) / (2 * a)
}

function adjust(d) {
    var l = calculateLambda(d);
    for (var i = 0; i < n; i++) {
	d.Y[i] =
	    (l * d.X[i] + (1 - l) * d.Y[i])
		/ Math.sqrt(l * l + Math.pow(1 - l, 2))
    }
    return d
}

function normalize(d) {
    var minx = min(d.X)
    var rangex = max(d.X) - minx

    var miny = min(d.Y)
    var rangey = max(d.Y) - miny

    for (var i = 0; i < n; i++) {
	d.X[i] = (d.X[i] - minx) / rangex
	d.Y[i] = (d.Y[i] - miny) / rangey
    }
    return d
}

function standardize(d) {
    var mx = mean(d.X)
    var sdx = sdc(d.X)
    var my = mean(d.Y)
    var sdy = sdc(d.Y)

    for (var i = 0; i < n; i++) {
	d.X[i] = (d.X[i] - mx) / sdx
	d.Y[i] = (d.Y[i] - my) / sdy
    }
    return d
}

function scale(d) {
    for (var i = 0; i < n; i++) {
	d.X[i] = sdratio * d.X[i] * extent + mratio * extent;
	d.Y[i] = sdratio * d.Y[i] * extent + mratio * extent;
    }
    return d
}

// rotate the whole dataset dg degree
// ws: 'counterclockwise' or 'clockwise' 

function rot(d, dg, ws) {  
            var n = d.length
			, dnew = []
            , radians = dg * (Math.PI / 180)
            , negative = 1
            
            if (ws == 'counterclockwise')
            	negative = -1
            	
			for (var i = 0 ; i < n ; i++){
				// var rp = rotate([[d[i][0]],[d[i][1]]], dg, ws)
				// dnew.push([rp[0], rp[1]]) 
				// I don't know what's happenning here. 
				// I made these work and then I broke them and cannot fix within several hours...
				// I have to use my own codes...
				var x = d[i][0] * Math.cos(radians) + negative * d[i][1] * Math.sin(radians)
				  , y = negative * (-1) * d[i][0] * Math.sin(radians) + d[i][1] * Math.cos(radians)
				dnew.push([x, y])
			}
            
    return dnew;
 }

// set a box
// notice that this will break mean and sd
// set params.factor will break w and h
function setBox(params){	
	var w = -1
	, h = -1
	, f = -1
	, d = []
	
	if(params){
    if(params.d)
    	d = params.d
	if(params.w)
		w = params.w
    if(params.h)
    	h = params.h
    if(params.factor)
    	f = params.factor

	}
    //first rotate all points
	var n = d.length
	    , dnew = rot(d, 45, 'counterclockwise')
	    , arrin2 = reform3(dnew)
	    
	var xmean = mean(arrin2[0])
	    , ymean = mean(arrin2[1])
	    , xmax = max(arrin2[0]) 
	    , xmin = min(arrin2[0]) 
	    , ymax = max(arrin2[1]) 
	    , ymin = min(arrin2[1]) 
	    , dresult = []
	
	if(f != -1){
		w = f * (xmax - xmin)
		h = f * (ymax - ymin)
	}
	
	//rescale all x and y
	for(var i = 0; i < n; i++){
		var x = w/2 * (dnew[i][0] - xmean) / ((xmax - xmin)/2) + xmean
		  , y = h/2 * (dnew[i][1] - ymean) / ((ymax - ymin)/2) + ymean
		dresult.push([x, y])
	}
	
	//rotate back
	return rot(dresult, 45, 'clockwise')	
}

//input [X:[x1,x2,x3], Y:[y1,y2,y3]], output [[x1,y1],[],[]]
function reform(d) {
    var array=[];
    for (var i = 0; i < n; i++) {
	array[i] = [d.X[i] , d.Y[i]];
    }
    return array;
}

function reform2(d) {
    var array=[];
   
	array[0] = d.X
	array[1] = d.Y

    return array;
}
// input  [[x1,y1],[],[]] , output [[x1,x2,x3], [y1,y2,y3]]
function reform3(d){
	  var array=[[],[]];
	    for (var i = 0; i < d.length; i++) {
		   array[0].push(d[i][0])
		   array[1].push(d[i][1])
	    }
	    return array;
}

function getStack(d){
	  var array=[[],[]];
	    for (var i = 0; i < d[0].length; i++) {
		    d[1][i] = d[0][i] + d[1][i]
	    }
	    return d;
}

function getPercentage(d){
	  var array=[[],[]];
	    for (var i = 0; i < d[0].length; i++) {
	    	var x = d[0][i]/( d[0][i] + d[1][i])
		    d[0][i] = x
		    d[1][i] = 1
	    }
	    return d;
}

function check(d){
	// It is possible that y is NaN because of unknown reasons...
    for (var i = 0; i < n; i++) {
        if (d.X[i] < 0 || d.X[i] > extent || d.Y[i] < 0 || d.Y[i] > extent || isNaN(d.Y[i]))
	        return -1
    }
    // fm: I thought these can avoid y = NaN but I was wrong
    //var sdx = sdc (d.X)
    //var sdy = sdc (d.Y)
    //return (Math.abs (sdx * sdy) < 0.001) ? -1 : 1
}

var arr3 = ['00', '01', '10', '11']
var arr10 = ['0000', '0001', '0010', '0011',
             '0100', '0101', '0110', '0111',
             '1000', '1001', '1010', '1011'
             ]
/*
 * given two integers < 399, compress them into one integer
 * i.e. 231, 67
 * 2 : 10, 3 : 0011, 1 : 0001
 * 0 : 00, 6 : 0110, 7 : 0111
 * 10 00110001 00 0110011 -> an integer
 */
function compressPair(x, y){
	var ax = Math.floor( x / 100 ),
    bx = Math.floor(Math.floor( x % 100 ) / 10),
    cx = Math.floor(Math.floor( x % 100 ) % 10),
    ay = Math.floor( y / 100 ),
    by = Math.floor(Math.floor( y % 100 ) / 10),
    cy = Math.floor(Math.floor( y % 100 ) % 10),
    dx = arr3[ax] + arr10[bx] +  arr10[cx],
    dy = arr3[ay] + arr10[by] +  arr10[cy],
    d  = dx + dy
    return parseInt(d , 2)   
}

function decompress(p) {
	var x  = (p & 0xffc00) >> 10,
	    ax = (x & 0x300) >> 8,
	    bx = (x & 0xf0) >> 4,
	    cx = x & 0x0f,
	    y  = p & 0x000fff,
	    ay = (y & 0x300) >> 8,
	    by = (y & 0xf0) >> 4,
	    cy = y & 0x0f,
	    nx = ax * 100 + bx * 10 + cx,
	    ny = ay * 100 + by * 10 + cy;
	return [nx , ny];
}

})(this);

},{"__browserify_process":15,"numbers":3,"science":13}],"modules/generate.js":[function(require,module,exports){
module.exports=require('Xl38Vh');
},{}],3:[function(require,module,exports){
module.exports = require('./lib/numbers.js');

},{"./lib/numbers.js":4}],4:[function(require,module,exports){
/**
 * numbers.js
 * http://github.com/sjkaliski/numbers.js
 *
 * Copyright 2012 Stephen Kaliski
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 
var numbers = exports;


// Expose methods
numbers.basic = require('./numbers/basic');
numbers.calculus = require('./numbers/calculus');
numbers.complex = require('./numbers/complex');
numbers.dsp = require('./numbers/dsp');
numbers.matrix = require('./numbers/matrix');
numbers.prime = require('./numbers/prime');
numbers.statistic = require('./numbers/statistic');
numbers.generate = require('./numbers/generators');

/** 
 * @property {Number} EPSILON Epsilon (error bound) to be used 
 * in calculations. Can be set and retrieved freely. 
 * 
 * Given the float-point handling by JavaScript, as well as
 * the numbersal proficiency of some methods, it is common 
 * practice to include a bound by which discrepency between 
 * the "true" answer and the returned value is acceptable.
 *
 * If no value is provided, 0.001 is default.
 */
numbers.EPSILON = 0.001;

},{"./numbers/basic":5,"./numbers/calculus":6,"./numbers/complex":7,"./numbers/dsp":8,"./numbers/generators":9,"./numbers/matrix":10,"./numbers/prime":11,"./numbers/statistic":12}],5:[function(require,module,exports){
/**
 * basic.js
 * http://github.com/sjkaliski/numbers.js
 *
 * Copyright 2012 Stephen Kaliski
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var basic = exports;

/**
 * Determine the summation of numbers in a given array.
 *
 * @param {Array} collection of numbers.
 * @return {Number} sum of numbers in array.
 */
basic.sum = function (arr) {
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    var total = 0;
    for (var i = 0 ; i < arr.length ; i++) {
      if (typeof(arr[i]) === 'number') {
        total = total + arr[i];
      } else {
        throw new Error('All elements in array must be numbers');
      }
    }
    return total;
  } else {
    throw new Error('Input must be of type Array');
  }
};

/**
 * Subtracts elements from one another in array.
 *
 * e.g [5,3,1,-1] -> 5 - 3 - 1 - (-1) = 2
 *
 * @param {Array} collection of numbers.
 * @return {Number} difference.
 */
basic.subtraction = function (arr) {
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    var total = arr[arr.length - 1];
    for (var i = arr.length - 2; i >= 0; i--) {
      if (typeof(arr[i]) === 'number') {
        total -= arr[i];
      } else {
        throw new Error('All elements in array must be numbers');
      }
    }
    return total;
  } else {
    throw new Error('Input must be of type Array');
  }
};

/**
 * Product of all elements in an array.
 *
 * @param {Array} collection of numbers.
 * @return {Number} product.
 */
basic.product = function (arr) {
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    var total = arr[0];
    for (var i = 1, length = arr.length; i < length; i++) {
      if (typeof(arr[i]) === 'number') {
        total = total * arr[i];
      } else {
        throw new Error('All elements in array must be numbers');
      }
    }
    return total;
  } else {
    throw new Error('Input must be of type Array');
  }
};

/**
 * Return the square of any value.
 *
 * @param {Number} number
 * @return {Number} square of number
 */
basic.square = function (num) {
  return num * num;
};

/**
 * Calculate the binomial coefficient (n choose k)
 *
 * @param {Number} available choices
 * @param {Number} number chosen
 * @return {Number} number of possible choices
 */
basic.binomial = function (n, k) {

  var arr = [];

  function _binomial (n, k) {
    if (n >= 0 && k === 0) return 1;
    if (n === 0 && k > 0) return 0;
    if (arr[n] && arr[n][k] > 0) return arr[n][k];
    if (!arr[n]) arr[n] = [];

    return arr[n][k] = _binomial(n - 1, k - 1) + _binomial(n - 1, k);
  }

  return _binomial(n, k);
};

/**
 * Factorial for some integer.
 *
 * @param {Number} integer.
 * @return {Number} result.
 */
basic.factorial = function (num){
  var i = 2, o = 1;
  
  while (i <= num) {
    o *= i++;
  }

  return o;
};

/**
 * Calculate the greastest common divisor amongst two integers.
 * Taken from Ratio.js https://github.com/LarryBattle/Ratio.js
 * 
 * @param {Number} number A.
 * @param {Number} number B.
 * @return {Number} greatest common divisor for integers A, B.
 */
basic.gcd = function (a, b) {
  var c;
  b = (+b && +a) ? +b : 0;
  a = b ? a : 1;

  while (b) {
    c = a % b;
    a = b;
    b = c;
  }

  return Math.abs(a);
};

/**
 * Calculate the least common multiple amongst two integers.
 *
 * @param {Number} number A.
 * @param {Number} number B.
 * @return {Number} least common multiple for integers A, B.
 */
basic.lcm = function (num1, num2) {
  return Math.abs(num1 * num2) / basic.gcd(num1, num2);
};

/**
 * Retrieve a specified quantity of elements from an array, at random.
 *
 * @param {Array} set of values to select from.
 * @param {Number} quantity of elements to retrieve.
 * @param {Boolean} allow the same number to be returned twice.
 * @return {Array} random elements.
 */
basic.random = function (arr, quant, allowDuplicates) {
  if (arr.length === 0){
    throw new Error('Empty array');
  } else if (quant > arr.length  && !allowDuplicates){
    throw new Error('Quantity requested exceeds size of array');
  }
  
  if (allowDuplicates === true) {
    var result = [], i;
    for (i = 0; i < quant; i++) {
      result[i] = arr[Math.floor(Math.random() * arr.length)];
    }
    return result;    
  } else {
    return basic.shuffle(arr).slice(0, quant);
  }
};

/**
 * Shuffle an array, in place.
 *
 * @param {Array} array to be shuffled.
 * @return {Array} shuffled array.
 */
basic.shuffle = function (array) {
  var m = array.length, t, i;

  while (m) {
    i = Math.floor(Math.random() * m--);

    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
};

/**
 * Find maximum value in an array.
 *
 * @param {Array} array to be traversed.
 * @return {Number} maximum value in the array.
 */
basic.max = function (array) {
  return Math.max.apply(Math, array);
};

/**
 * Find minimum value in an array.
 *
 * @param {Array} array to be traversed.
 * @return {Number} minimum value in the array.
 */
basic.min = function (array) {
  return Math.min.apply(Math, array);
};

/**
 * Create a range of numbers.
 *
 * @param {Number} The start of the range.
 * @param {Number} The end of the range.
 * @return {Array} An array containing numbers within the range.
 */
basic.range = function (start, stop, step) {
  var array, i = 0, len;

  if (arguments.length <= 1) {
    stop = start || 0;
    start = 0;
  }

  step = step || 1;

  if (stop < start) {
    step = 0 - Math.abs(step);
  }

  len = Math.max(Math.ceil((stop - start) / step) + 1, 0);

  array = new Array(len);

  while (i < len) {
    array[i++] = start;
    start += step;
  }

  return array;
};

/**
  * Determine if the number is an integer.
  *
  * @param {Number} the number
  * @return {Boolean} true for int, false for not int.
  */
basic.isInt = function (n) {
  return n % 1 === 0;
};

/**
  * Calculate the divisor and modulus of two integers.
  *
  * @param {Number} int a.
  * @param {Number} int b.
  * @return {Array} [div, mod].
  */
basic.divMod = function (a, b) {
  if (!basic.isInt(a) || !basic.isInt(b)) return false;
  return [Math.floor(a / b), a % b];
};

/**
  * Calculate:
  * if b >= 1: a^b mod m.
  * if b = -1: modInverse(a, m).
  * if b < 1: finds a modular rth root of a such that b = 1/r.
  *
  * @param {Number} Number a.
  * @param {Number} Number b.
  * @param {Number} Modulo m.
  * @return {Number} see the above documentation for return values.
  */
basic.powerMod = function (a, b, m) {
  // If b < -1 should be a small number, this method should work for now.
  if (b < -1) return Math.pow(a, b) % m; 
  if (b === 0) return 1 % m;
  if (b >= 1) {
    var result = 1;
    while (b > 0) {
      if ((b % 2) === 1) {
        result = (result * a) % m;
      }
      
      a = (a * a) % m;
      b = b >> 1;
    }
    return result;
  }

  if (b === -1) return basic.modInverse(a, m);
  if (b < 1) {
    return basic.powerMod(a, Math.pow(b, -1), m); 
  }
};

/**
 * Calculate the extended Euclid Algorithm or extended GCD.
 *
 * @param {Number} int a.
 * @param {Number} int b.
 * @return {Array} [a, x, y] a is the GCD. x and y are the values such that ax + by = gcd(a, b) .
 */
basic.egcd = function (a, b) {
  var x = (+b && +a) ? 1 : 0,
      y = b ? 0 : 1,
      u = (+b && +a) ? 0 : 1,
      v = b ? 1 : 0;

  b = (+b && +a) ? +b : 0;
  a = b ? a : 1;

  while (b) {
    var dm = basic.divMod(a, b),
        q = dm[0], 
        r = dm[1];

    var m = x - u * q, 
        n = y - v * q;

    a = b;
    b = r;
    x = u;
    y = v;
    u = m;
    v = n;
  }

  return [a, x, y];
};

/**
  * Calculate the modular inverse of a number.
  * @param {Number} Number a.
  * @param {Number} Modulo m.
  * @return {Number} if true, return number, else throw error.
  */
basic.modInverse = function (a, m) {
  var r = basic.egcd(a, m);
  if (r[0] != 1) throw new Error('No modular inverse exists');
  return r[1] % m;
};

},{}],6:[function(require,module,exports){
/**
 * calculus.js
 * http://github.com/sjkaliski/numbers.js
 *
 * Copyright 2012 Stephen Kaliski
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var numbers = require('../numbers');
var calculus = exports;

/**
 * Calculate point differential for a specified function at a
 * specified point.  For functions of one variable.
 *
 * @param {Function} math function to be evaluated.
 * @param {Number} point to be evaluated.
 * @return {Number} result.
 */
calculus.pointDiff = function (func, point) {
  var a = func(point - 0.001);
  var b = func(point + 0.001);

  return (b - a) / (0.002);
};

/**
 * Calculate riemann sum for a specified, one variable, function
 * from a starting point, to a finishing point, with n divisions.
 *
 * @param {Function} math function to be evaluated.
 * @param {Number} point to initiate evaluation.
 * @param {Number} point to complete evaluation.
 * @param {Number} quantity of divisions.
 * @param {Function} (Optional) Function that returns which value 
 *   to sample on each interval; if none is provided, left endpoints
 *   will be used.
 * @return {Number} result.
 */
calculus.Riemann = function (func, start, finish, n, sampler) {
  var inc = (finish - start) / n;
  var totalHeight = 0;
  var i;
  
  if (typeof sampler === 'function') {
    for (i = start; i < finish; i += inc) {
      totalHeight += func(sampler(i, i + inc));
    }
  } else {
    for (i = start; i < finish; i += inc) {
      totalHeight += func(i);
    }
  }
  
  return totalHeight * inc;
};

/**
 * Helper function in calculating integral of a function
 * from a to b using simpson quadrature.
 *
 * @param {Function} math function to be evaluated.
 * @param {Number} point to initiate evaluation.
 * @param {Number} point to complete evaluation.
 * @return {Number} evaluation.
 */
function SimpsonDef (func, a, b) {
  var c = (a + b) / 2;
  var d = Math.abs(b - a) / 6;
  return d * (func(a) + 4 * func(c) + func(b));
}

/**
 * Helper function in calculating integral of a function
 * from a to b using simpson quadrature.  Manages recursive
 * investigation, handling evaluations within an error bound.
 *
 * @param {Function} math function to be evaluated.
 * @param {Number} point to initiate evaluation.
 * @param {Number} point to complete evaluation.
 * @param {Number} total value.
 * @param {Number} Error bound (epsilon).
 * @return {Number} recursive evaluation of left and right side.
 */
function SimpsonRecursive (func, a, b, whole, eps) {
  var c = a + b;
  var left = SimpsonDef(func, a, c);
  var right = SimpsonDef(func, c, b);
  
  if (Math.abs(left + right - whole) <= 15 * eps) {
    return left + right + (left + right - whole) / 15;
  } else {
    return SimpsonRecursive(func, a, c, eps / 2, left) + SimpsonRecursive(func, c, b, eps / 2, right);
  }
}

/**
 * Evaluate area under a curve using adaptive simpson quadrature.
 *
 * @param {Function} math function to be evaluated.
 * @param {Number} point to initiate evaluation.
 * @param {Number} point to complete evaluation.
 * @param {Number} Optional error bound (epsilon); 
 *   global error bound will be used as a fallback.
 * @return {Number} area underneath curve.
 */
calculus.adaptiveSimpson = function (func, a, b, eps) {
  eps = (typeof eps === 'undefined') ? numbers.EPSILON : eps;

  return SimpsonRecursive(func, a, b, SimpsonDef(func, a, b), eps);
};

/**
 * Calculate limit of a function at a given point. Can approach from
 * left, middle, or right.
 *
 * @param {Function} math function to be evaluated.
 * @param {Number} point to evaluate.
 * @param {String} approach to limit.
 * @return {Number} limit.
 */
calculus.limit = function (func, point, approach) {
  if (approach === 'left') {
    return func(point - 1e-15);
  } else if (approach === 'right') {
    return func(point + 1e-15);
  } else if (approach === 'middle') {
    return (calculus.limit(func, point, 'left') + calculus.limit(func, point, 'right')) / 2;
  } else {
    throw new Error('Approach not provided');
  }
};

/**
 * Calculate Stirling approximation gamma.
 *
 * @param {Number} number to calculate.
 * @return {Number} gamma.
 */
calculus.StirlingGamma = function (num) {
  return Math.sqrt(2 * Math.PI / num) * Math.pow((num / Math.E), num);
};

/**
 * Calculate Lanczos approximation gamma.
 *
 * @param {Number} number to calculate.
 * @return {Number} gamma.
 */
calculus.LanczosGamma = function (num) {
  var p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
  ];

  var i;
  var g = 7;

  if(num < 0.5) return Math.PI / (Math.sin(Math.PI * num) * calculus.LanczosGamma(1 - num));

  num -= 1;
  
  var a = p[0];
  var t = num + g + 0.5;

  for (i = 1; i < p.length; i++) {
    a += p[i] / (num + i);
  }

  return Math.sqrt(2 * Math.PI) * Math.pow(t, num + 0.5) * Math.exp(-t) * a;
};

},{"../numbers":4}],7:[function(require,module,exports){
/**
 * matrix.js
 * http://github.com/sjkaliski/numbers.js
 *
 * Copyright 2012 Stephen Kaliski
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var Complex = function (re, im) {
  this.re = re;
  this.im = im;
  this.r  = this.magnitude();
  this.t  = this.phase() // theta = t = arg(z)
};

/**
 * Add a complex number to this one.
 * 
 * @param {Complex} Number to add.
 * @return {Complex} New complex number (sum).
 */
Complex.prototype.add = function(addend) {
  return new Complex(this.re + addend.re, this.im + addend.im);
};

/**
 * Subtract a complex number from this one.
 * 
 * @param {Complex} Number to subtract.
 * @return {Complex} New complex number (difference).
 */
Complex.prototype.subtract = function (subtrahend) {
  return new Complex(this.re - subtrahend.re, this.im - subtrahend.im);
};

/**
 * Multiply a complex number with this one.
 * 
 * @param {Complex} Number to multiply by.
 * @return {Complex} New complex number (product).
 */
Complex.prototype.multiply = function (multiplier) {
  var re = this.re * multiplier.re - this.im * multiplier.im;
  var im = this.im * multiplier.re + this.re * multiplier.im;
  
  return new Complex(re, im);
};

/**
 * Divide this number with another complex number.
 * 
 * @param {Complex} Divisor.
 * @return {Complex} New complex number (quotient).
 */
Complex.prototype.divide = function (divisor) {
  var denominator = divisor.re * divisor.re + divisor.im * divisor.im;
  var re = (this.re * divisor.re + this.im * divisor.im) / denominator;
  var im = (this.im * divisor.re - this.re * divisor.im) / denominator;
  
  return new Complex(re,im);
};

/**
 * Get the magnitude of this number.
 * 
 * @return {Number} Magnitude.
 */
Complex.prototype.magnitude = function () {
  return Math.sqrt(this.re * this.re + this.im * this.im);
};

/**
 * Get the phase of this number.
 * 
 * @return {Number} Phase.
 */
Complex.prototype.phase = function () {
  return Math.atan2(this.im, this.re);
};

/**
 * Conjugate the imaginary part
 *
 * @param {Complex} Number to conjugate.
 * @return {Complex} Conjugated number
 */
Complex.prototype.conjugate = function () {
  return new Complex(this.re, -1 * this.im);
};

module.exports = Complex;

},{}],8:[function(require,module,exports){
/**
 * matrix.js
 * http://github.com/sjkaliski/numbers.js
 *
 * Copyright 2012 Stephen Kaliski
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var numbers = require('../numbers');
var Complex = numbers.complex
var dsp = exports;

/**
 * Returns an array composed of elements from arr, starting at index start
 * and counting by step.
 * 
 * @param {Array} Input array.
 * @param {Number} Starting array index.
 * @param {Number} Step size.
 * @return {Array} Resulting sub-array.
 */
dsp.segment = function (arr, start, step) {
  var result = [];
  
  for (var i = start; i < arr.length; i += step) {
    result.push(arr[i]);
  }

  return result;
};

/**
 * Returns an array of complex numbers representing the frequency spectrum
 * of real valued time domain sequence x. (x.length must be integer power of 2)
 * Inspired by http://rosettacode.org/wiki/Fast_Fourier_transform#Python
 * 
 * @param {Array} Real-valued series input, eg. time-series.
 * @return {Array} Array of complex numbers representing input signal in Fourier domain.
 */
dsp.fft = function (x) {
  var N = x.length;
  
  if (N <= 1) {
    return [new Complex(x[0], 0)];
  }  
  
  if (Math.log(N) / Math.LN2 % 1 !== 0) {
    throw new Error ('Array length must be integer power of 2');
  }
  
  var even = dsp.fft(dsp.segment(x, 0, 2));
  var odd = dsp.fft(dsp.segment(x, 1, 2));
  var res = [], Nby2 = N / 2;
  
  for (var k = 0; k < N; k++) {
    var tmpPhase = -2 * Math.PI * k / N;
    var phasor = new Complex(Math.cos(tmpPhase), Math.sin(tmpPhase));
    if (k < Nby2) {
      res[k] = even[k].add(phasor.multiply(odd[k]));
    } else {
      res[k] = even[k - Nby2].subtract(phasor.multiply(odd[k - Nby2]));
    }
  }
  
  return res;
};

},{"../numbers":4}],9:[function(require,module,exports){
/**
 * generators.js
 * http://github.com/sjkaliski/numbers.js
 *
 * Copyright 2012 Stephen Kaliski, Kartik Talwar
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var generate = exports;

/**
 * Fast Fibonacci Implementation
 *
 * @param {Number} number to calculate
 * @return {Number} nth fibonacci number
 */
generate.fibonacci = function (n) {
  // Adapted from
  // http://bosker.wordpress.com/2011/04/29/the-worst-algorithm-in-the-world/

  var bitSystem = function(n) {
    var bit, bits = [];

    while (n > 0) {
      bit = (n < 2) ? n : n % 2;
      n = Math.floor(n / 2);
      bits.push(bit);
    }
    
    return bits.reverse();
  };

  var a = 1;
  var b = 0;
  var c = 1;
  var system = bitSystem(n);
  var temp;
  
  for (var i = 0; i < system.length; i++) {
    var bit = system[i];
    if (bit) {
      temp = [(a + c) * b, (b * b) + (c * c)];
      a = temp[0];
      b = temp[1];
    } else {
      temp = [(a * a) + (b * b), (a + c) * b];
      a = temp[0]
      b = temp[1];
    }

    c = a + b;
  }

  return b;
};

/**
 * Populate the given array with a Collatz Sequence.
 *
 * @param {Number} first number.
 * @param {Array} arrary to be populated.
 * @return {Array} array populated with Collatz sequence
 */
generate.collatz = function (n, result) {
  result.push(n);
  
  if (n === 1) {
    return;
  } else if (n % 2 === 0) {
    generate.collatz(n / 2, result);
  } else {
    generate.collatz(3 * n + 1, result);
  }
};

},{}],10:[function(require,module,exports){
/**
 * matrix.js
 * http://github.com/sjkaliski/numbers.js
 *
 * Copyright 2012 Stephen Kaliski
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var matrix = exports;

/**
 * Return a deep copy of the input matrix.
 *
 * @param {Array} matrix to copy.
 * @return {Array} copied matrix.
 */
matrix.deepCopy = function(arr) {
  if (arr[0][0] === undefined) {
    throw new Error('Input cannot be a vector.');
  }
  
  var result = new Array(arr.length);

  for (var i = 0; i < arr.length; i++) {
    result[i] = arr[i].slice();
  }
  
  return result;
};

/**
 * Return true if matrix is square, false otherwise.
 *
 * @param {Array} arr
 */
matrix.isSquare = function(arr) {
  var rows = arr.length;
  var cols = arr[0].length;
  
  return rows === cols;
};

/**
 * Add two matrices together.  Matrices must be of same dimension.
 *
 * @param {Array} matrix A.
 * @param {Array} matrix B.
 * @return {Array} summed matrix.
 */
matrix.addition = function (arrA, arrB) {
  if ((arrA.length === arrB.length) && (arrA[0].length === arrB[0].length)) {
    var result = new Array(arrA.length);
    
    for (var i = 0; i < arrA.length; i++) {
      result[i] = new Array(arrA[i].length);
    
      for (var j = 0; j < arrA[i].length; j++) {
        result[i][j] = arrA[i][j] + arrB[i][j];
      }
    }

    return result;
  } else {
    throw new Error('Matrix mismatch');
  }
};

/**
 * Scalar multiplication on an matrix.
 *
 * @param {Array} matrix.
 * @param {Number} scalar.
 * @return {Array} updated matrix.
 */
matrix.scalar = function (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].length; j++) {
      arr[i][j] = val * arr[i][j];
    }
  }

  return arr;
};

/**
 * Transpose a matrix.
 *
 * @param {Array} matrix.
 * @return {Array} transposed matrix.
 */
matrix.transpose = function (arr) {
  var result = new Array(arr[0].length);
  
  for (var i = 0; i < arr[0].length; i++) {
    result[i] = new Array(arr.length);
    
    for (var j = 0; j < arr.length; j++) {
      result[i][j] = arr[j][i];
    }
  }

  return result;
};

/**
 * Create an identity matrix of dimension n x n.
 *
 * @param {Number} dimension of the identity array to be returned.
 * @return {Array} n x n identity matrix.
 */
matrix.identity = function (n) {
  var result = new Array(n);
  
  for (var i = 0; i < n ; i++) {
    result[i] = new Array(n);
    for (var j = 0; j < n; j++) {
      result[i][j] = (i === j) ? 1 : 0;
    }
  }

  return result;
};

/**
 * Evaluate dot product of two vectors.  Vectors must be of same length.
 *
 * @param {Array} vector.
 * @param {Array} vector.
 * @return {Array} dot product.
 */
matrix.dotproduct = function (vectorA, vectorB) {
  if (vectorA.length === vectorB.length) {
    var result = 0;
    for (var i = 0; i < vectorA.length; i++) {
      result += vectorA[i] * vectorB[i];
    }
    return result;
  } else {
    throw new Error("Vector mismatch");
  }
};

/**
 * Multiply two matrices. They must abide by standard matching.
 *
 * e.g. A x B = (m x n) x (n x m), where n, m are integers who define
 * the dimensions of matrices A, B.
 *
 * @param {Array} matrix.
 * @param {Array} matrix.
 * @return {Array} result of multiplied matrices.
 */
matrix.multiply = function (arrA, arrB) {
  if (arrA[0].length === arrB.length) {
    var result = new Array(arrA.length);
    
    for (var x = 0; x < arrA.length; x++) {
      result[x] = new Array(arrB[0].length);
    }

    var arrB_T = matrix.transpose(arrB);
    
    for (var i = 0; i < result.length; i++) {
      for (var j = 0; j < result[i].length; j++) {
        result[i][j] = matrix.dotproduct(arrA[i],arrB_T[j]);
      }
    }
    return result;
  } else {
    throw new Error("Array mismatch");
  }
};

/**
 * Evaluate determinate of matrix.  Expect speed
 * degradation for matrices over 4x4. 
 *
 * @param {Array} matrix.
 * @return {Number} determinant.
 */
matrix.determinant = function (m) {
  var numRow = m.length;
  var numCol = m[0].length;
  var det = 0;
  var row, col;
  var diagLeft, diagRight;

  if (numRow !== numCol) {
    throw new Error("Not a square matrix.")
  }

  if (numRow === 1) {
    return m[0][0];
  } 
  else if (numRow === 2) {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  }

  for (col = 0; col < numCol; col++) {
    diagLeft = m[0][col];
    diagRight = m[0][col];

    for( row=1; row < numRow; row++ ) {
      diagRight *= m[row][(((col + row) % numCol) + numCol) % numCol];
      diagLeft *= m[row][(((col - row) % numCol) + numCol) % numCol];
    }

    det += diagRight - diagLeft;
  }

  return det;
};

/**
 * Returns a LUP decomposition of the given matrix such that:
 *
 * A*P = L*U
 *
 * Where
 * A is the input matrix
 * P is a pivot matrix
 * L is a lower triangular matrix
 * U is a upper triangular matrix
 *
 * This method returns an array of three matrices such that:
 *
 * matrix.luDecomposition(array) = [L, U, P]
 *
 * @param {Array} arr
 * @return {Array} array of matrices [L, U, P]
 */
matrix.lupDecomposition = function(arr) {
  if (!matrix.isSquare(arr)) {
    throw new Error("Matrix must be square.");
  }

  var size = arr.length;

  var LU = matrix.deepCopy(arr);
  var P = matrix.transpose(matrix.identity(size));
  var currentRow;
  var currentColumn = new Array(size);

  this.getL = function(a) {
    var m = a[0].length;
    var L = matrix.identity(m);
    
    for (var i = 0; i < m; i++) {
      for (var j = 0; j < m; j++) {
        if (i > j) {
          L[i][j] = a[i][j];
        }
      }
    }
    
    return L;
  };

  this.getU = function(a) {
    var m = a[0].length;
    var U = matrix.identity(m);
    
    for (var i = 0; i < m; i++) {
      for (var j = 0; j < m; j++) {
        if (i <= j) {
          U[i][j] = a[i][j];
        }
      }
    }
    
    return U;
  };

  for (var j = 0; j < size; j++) {
    var i;
    for (i = 0; i < size; i++) {
      currentColumn[i] = LU[i][j];
    }

    for (i = 0; i < size; i++) {
      currentRow = LU[i];

      var minIndex = Math.min(i,j);
      var s = 0;
    
      for (var k = 0; k < minIndex; k++) {
        s += currentRow[k]*currentColumn[k];
      }

      currentRow[j] = currentColumn[i] -= s;
    }

    //Find pivot
    var pivot = j;
    for (i = j + 1; i < size; i++) {
      if (Math.abs(currentColumn[i]) > Math.abs(currentColumn[pivot])) {
        pivot = i;
      }
    }
    
    if (pivot != j) {
      LU = matrix.rowSwitch(LU, pivot, j);
      P = matrix.rowSwitch(P, pivot, j);
    }

    if (j < size && LU[j][j] !== 0) {
      for (i = j + 1; i < size; i++) {
        LU[i][j] /= LU[j][j];
      }
    }
  }
  
  return [this.getL(LU), this.getU(LU), P];
};

/**
 * Rotate a two dimensional vector by degree.
 *
 * @param {Array} point.
 * @param {Number} degree.
 * @param {String} direction - clockwise or counterclockwise.
 * @return {Array} vector.
 */
matrix.rotate = function (point, degree, direction) {
  if (point.length === 2) {
    var negate = direction === 'clockwise' ? -1 : 1;
    var radians = degree * (Math.PI / 180);

    var transformation = [
      [Math.cos(radians), -1 * negate * Math.sin(radians)],
      [negate * Math.sin(radians), Math.cos(radians)]
    ];

    return matrix.multiply(transformation, point);
  } else {
    throw new Error('Only two dimensional operations are supported at this time');
  }
};

/**
 * Scale a two dimensional vector by scale factor x and scale factor y.
 *
 * @param {Array} point.
 * @param {Number} sx.
 * @param {Number} sy.
 * @return {Array} vector.
 */
matrix.scale = function (point, sx, sy) {
  if (point.length === 2) {

    var transformation = [
      [sx, 0],
      [0, sy]
    ];

    return matrix.multiply(transformation, point);
  } else {
    throw new Error('Only two dimensional operations are supported at this time');
  }
};

/**
 * Shear a two dimensional vector by shear factor k.
 *
 * @param {Array} point.
 * @param {Number} k.
 * @param {String} direction - xaxis or yaxis.
 * @return {Array} vector.
 */
matrix.shear = function (point, k, direction) {
  if (point.length === 2) {
    var xplaceholder = direction === 'xaxis' ? k : 0;
    var yplaceholder = direction === 'yaxis' ? k : 0;

    var transformation = [
      [1, xplaceholder],
      [yplaceholder, 1]
    ];

    return matrix.multiply(transformation, point);
  } else {
    throw new Error('Only two dimensional operations are supported at this time');
  }
};

/**
 * Perform an affine transformation on the given vector.
 *
 * @param {Array} point.
 * @param {Number} tx.
 * @param {Number} ty.
 * @return {Array} vector.
 */
matrix.affine = function (point, tx, ty) {
  if (point.length === 2) {

    var transformation = [
      [1, 0, tx],
      [0, 1, ty],
      [0, 0, 1 ]
    ];

    var newpoint = [
      [point[0][0]],
      [point[1][0]],
      [1]
    ];

    var transformed = matrix.multiply(transformation, newpoint);
    
    return [
      [transformed[0][0]],
      [transformed[1][0]]
    ];

  } else {
    throw new Error('Only two dimensional operations are supported at this time');
  }
};

/**
 * Scales a row of a matrix by a factor and returns the updated matrix. 
 * Used in row reduction functions.
 * 
 * @param {Array} matrix.
 * @param {Number} row.
 * @param {Number} scale.
 */
matrix.rowScale = function (m, row, scale) {
  var result = new Array(m.length);
    
  for (var i = 0; i < m.length; i++) {
    result[i] = new Array(m[i].length);
  
    for (var j = 0; j < m[i].length; j++) {
      if (i === row) {
        result[i][j] = scale * m[i][j]; 
      } else {
        result[i][j] = m[i][j];
      }
    }
  }

  return result;
};

/**
 * Swaps two rows of a matrix  and returns the updated matrix. 
 * Used in row reduction functions.
 * 
 * @param {Array} matrix.
 * @param {Number} row1.
 * @param {Number} row2.
 */
matrix.rowSwitch = function (m, row1, row2) {
  var result = new Array(m.length);
  
  for (var i = 0; i < m.length; i++) {
    result[i] = new Array(m[i].length);
  
    for (var j = 0; j < m[i].length; j++) {
      if (i === row1) {
        result[i][j] = m[row2][j]; 
      } else if (i === row2) {
        result[i][j] = m[row1][j];
      } else {
        result[i][j] = m[i][j];
      }
    }
  }
  return result;
};

/**
 * Adds a multiple of one row to another row
 * in a matrix and returns the updated matrix. 
 * Used in row reduction functions.
 * 
 * @param {Array} matrix.
 * @param {Number} row1.
 * @param {Number} row2.
 */
matrix.rowAddMultiple = function (m, from, to, scale){
  var result = new Array(m.length);
  
  for (var i = 0; i < m.length; i++) {
    result[i] = new Array(m[i].length);
  
    for (var j = 0; j < m[i].length; j++) {
      if (i === to) {
        result[to][j] = m[to][j] + scale * m[from][j];
      } else {
        result[i][j] = m[i][j];
      }
    }
  }

  return result;
};

},{}],11:[function(require,module,exports){
/**
 * prime.js
 * http://github.com/sjkaliski/numbers.js
 *
 * Copyright 2012 Stephen Kaliski
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var basic = require('./basic');
var prime = exports;

/**
 * Determine if number is prime.  This is far from high performance.
 *
 * @param {Number} number to evaluate.
 * @return {Boolean} return true if value is prime. false otherwise.
 */
prime.simple = function (val) {
  if (val === 1) return false;
  else if (val === 2) return true;
  else if (val !== undefined) {
    var start = 1;
    var valSqrt = Math.ceil(Math.sqrt(val));
    while (++start <= valSqrt) {
      if (val % start === 0) {
        return false;
      }
    }
    return true;
  }
};

/**
 * Returns the prime factors of a number.
 * More info (http://bateru.com/news/2012/05/code-of-the-day-javascript-prime-factors-of-a-number/)
 * Taken from Ratio.js
 *
 * @param {Number} num
 * @return {Array} an array of numbers
 * @example prime.factorization(20).join(',') === "2,2,5"
 **/
prime.factorization = function (num) {
  num = Math.floor(num);
  var root;
  var factors = [];
  var x;
  var sqrt = Math.sqrt;
  var doLoop = 1 < num && isFinite(num);
  
  while (doLoop) {
    root = sqrt(num);
    x = 2;
    if (num % x) {
      x = 3;
      while ((num % x) && ((x += 2) < root)) {}
    }
    
    x = (root < x) ? num : x;
    factors.push(x);
    doLoop = (x !== num);
    num /= x;
  }

  return factors;
};

/**
 * Determine if a number is prime in Polynomial time, using a randomized algorithm. 
 * http://en.wikipedia.org/wiki/Miller-Rabin_primality_test
 *
 * @param {Number} number to Evaluate.
 * @param {Number} number to Determine accuracy rate (number of trials) default value = 20.
 * @return {Boolean} return true if value is prime. false otherwise.
 */
prime.millerRabin = function(n, k) {
  if (arguments.length === 1) k = 20;
  if (n === 2) return true;
  if (!basic.isInt(n) || n <= 1 || n % 2 === 0) return false;

  var s = 0;
  var d = n - 1;

  while (true) {
    var dm = basic.divMod(d, 2);
    var quotient = dm[0];
    var remainder = dm[1];

    if (remainder === 1) break;

    s += 1;
    d = quotient;
  }

  var tryComposite = function (a) {
    if (basic.powerMod(a, d, n) === 1) return false;
    
    for (var i = 0; i < s; i ++) {
      if (basic.powerMod(a, Math.pow(2, i) * d, n) === n - 1) return false;
    }
    
    return true;
  }

  for (var i = 0; i < k; i++) {
    var a = 2 + Math.floor(Math.random() * (n - 2 - 2));
    if (tryComposite(a)) return false;
  }

  return true;
};

/**
 * Return a list of prime numbers from 1...n, inclusive.
 *
 * @param {Number} upper limit of test n.
 * @return {Array} list of values that are prime up to n.
 */ 
prime.sieve = function (n) {
  if (n < 2) return [];
  var result = [2];
  for (var i = 3; i <= n; i++) {
    var notMultiple = false;
    
    for (var j in result) { 
      notMultiple = notMultiple || (0 === i % result[j]); 
    }

    if (!notMultiple) {
      result.push(i);
    }
  }

  return result;
};

},{"./basic":5}],12:[function(require,module,exports){
/**
 * statistic.js
 * http://github.com/sjkaliski/numbers.js
 *
 * Copyright 2012 Stephen Kaliski
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var basic = require('./basic');
var statistic = exports;

/**
 * Calculate the mean value of a set of numbers in array.
 *
 * @param {Array} set of values.
 * @return {Number} mean value.
 */
statistic.mean = function (arr) {
  var count = arr.length;
  var sum = basic.sum(arr);
  return sum / count;
};

/**
 * Calculate the median value of a set of numbers in array.
 *
 * @param {Array} set of values.
 * @return {Number} median value.
 */
statistic.median = function (arr) {
  return statistic.quantile(arr, 1, 2);
};

/**
 * Calculate the mode value of a set of numbers in array.
 *
 * @param {Array} set of values.
 * @return {Number} mode value.
 */
statistic.mode = function (arr) {
  var counts = {};
  for (var i = 0, n = arr.length; i < n; i++) {
    if (counts[arr[i]] === undefined) {
      counts[arr[i]] = 0;
    } else {
      counts[arr[i]]++;
    }
  }

  var highest;
  
  for (var number in counts) {
    if (counts.hasOwnProperty(number)) {
      if (highest === undefined || counts[number] > counts[highest]) {
        highest = number;
      }
    }
  }
  
  return Number(highest);
};

/**
 * Calculate the kth q-quantile of a set of numbers in an array.
 * As per http://en.wikipedia.org/wiki/Quantile#Quantiles_of_a_population
 * Ex: Median is 1st 2-quantile
 * Ex: Upper quartile is 3rd 4-quantile
 *
 * @param {Array} set of values.
 * @param {Number} index of quantile.
 * @param {Number} number of quantiles.
 * @return {Number} kth q-quantile of values.
 */
statistic.quantile = function (arr, k, q) {
  var sorted, count, index;

  if (k === 0) return Math.min.apply(null, arr);

  if (k === q) return Math.max.apply(null, arr);

  sorted = arr.slice(0);
  sorted.sort(function (a, b) { return a - b; });
  count = sorted.length;
  index = count * k / q;

  if (index % 1 === 0) return 0.5 * sorted[index - 1] + 0.5 * sorted[index];

  return sorted[Math.floor(index)];
};


/**
 * Return a set of summary statistics provided an array.
 *
 * @return {Object} summary statistics.
 */
statistic.report = function(array) {
  return {
    mean: statistic.mean(array),
    firstQuartile: statistic.quantile(array, 1, 4),
    median: statistic.median(array),
    thirdQuartile: statistic.quantile(array, 3, 4),
    standardDev: statistic.standardDev(array)
  }
};

/**
 * Return a random sample of values over a set of bounds with
 * a specified quantity.
 *
 * @param {Number} lower bound.
 * @param {Number} upper bound.
 * @param {Number} quantity of elements in random sample.
 * @return {Array} random sample.
 */
statistic.randomSample = function (lower, upper, n) {
  var sample = [];

  while (sample.length < n) {
    var temp = Math.random() * upper;
    if (lower <= temp <= upper) {
      sample.push(temp)
    }
  }

  return sample;
};

/**
 * Evaluate the standard deviation for a set of values.
 *
 * @param {Array} set of values.
 * @return {Number} standard deviation.
 */
statistic.standardDev = function (arr) {
  var count = arr.length;
  var mean = statistic.mean(arr);
  var squaredArr = [];

  for (var i = 0; i < arr.length; i++) {
    squaredArr[i] = Math.pow((arr[i] - mean),2);
  }

  return Math.sqrt((1 / count) * basic.sum(squaredArr));
};

/**
 * Evaluate the correlation amongst a set of values.
 *
 * @param {Array} set of values.
 * @return {Number} correlation.
 */
statistic.correlation = function (arrX, arrY) {
  if (arrX.length == arrY.length) {
    var covarXY = statistic.covariance(arrX, arrY);
    var stdDevX = statistic.standardDev(arrX);
    var stdDevY = statistic.standardDev(arrY);

    return covarXY / (stdDevX * stdDevY);
  } else {
    throw new Error('Array mismatch');
  }
};

/**
 * Calculate the Coefficient of Determination of a dataset and regression line.
 *
 * @param {Array} Source data.
 * @param {Array} Regression data.
 * @return {Number} A number between 0 and 1.0 that represents how well the regression line fits the data.
 */
statistic.rSquared = function (source, regression) {
  var residualSumOfSquares = basic.sum(source.map(function (d,i) {
    return basic.square(d - regression[i]);
  }));

  var totalSumOfSquares = basic.sum(source.map(function (d) {
    return basic.square(d - statistic.mean(source));
  }));
  
  return 1 - (residualSumOfSquares / totalSumOfSquares);
};

/**
 * Create a function to calculate the exponential regression of a dataset.
 *
 * @param {Array} set of values.
 * @return {Function} function to accept X values and return corresponding regression Y values.
 */
statistic.exponentialRegression = function (arrY) {
  var n = arrY.length;
  var arrX = basic.range(1,n);

  var xSum = basic.sum(arrX);
  var ySum = basic.sum(arrY);
  var yMean = statistic.mean(arrY);
  var yLog = arrY.map(function (d) { return Math.log(d); });
  var xSquared = arrX.map(function (d) { return d * d; });
  var xSquaredSum = basic.sum(xSquared);
  var yLogSum = basic.sum(yLog);
  var xyLog = arrX.map(function (d, i) { return d * yLog[i]; });
  var xyLogSum = basic.sum(xyLog);

  var a = (yLogSum * xSquaredSum - xSum * xyLogSum) / (n * xSquaredSum - (xSum * xSum));
  var b = (n * xyLogSum - xSum * yLogSum) / (n * xSquaredSum - (xSum * xSum));

  var fn = function(x) {
    if (typeof x === 'number') {
      return Math.exp(a) * Math.exp(b * x);
    } else {
      return x.map(function (d) {
        return Math.exp(a) * Math.exp(b * d);
      });
    }
  };

  fn.rSquared = statistic.rSquared(arrY, arrX.map(fn));

  return fn;
};

/**
 * Create a function to calculate the linear regression of a dataset.
 *
 * @param {Array} X array.
 * @param {Array} Y array.
 * @return {Function} A function which given X or array of X values will return Y.
 */
statistic.linearRegression = function (arrX, arrY) {
  var n = arrX.length;
  var xSum = basic.sum(arrX);
  var ySum = basic.sum(arrY);
  var xySum = basic.sum(arrX.map(function (d, i) { return d * arrY[i]; }));
  var xSquaredSum = basic.sum(arrX.map(function (d) { return d * d; }));
  var xMean = statistic.mean(arrX);
  var yMean = statistic.mean(arrY);
  var b = (xySum - 1 / n * xSum * ySum) / (xSquaredSum - 1 / n * (xSum * xSum));
  var a = yMean - b * xMean;

  return function(x) {
    if (typeof x === 'number') {
      return a + b * x;
    } else {
      return x.map(function (d) {
        return a + b * d;
      });
    }
  }
};

/**
 * Evaluate the covariance amongst 2 sets.
 *
 * @param {Array} set 1 of values.
 * @param {Array} set 2 of values.
 * @return {Number} covariance.
 */
 statistic.covariance = function (set1, set2) {
  if (set1.length == set2.length) {
    var n = set1.length;
    var total = 0;
    var sum1 = basic.sum(set1);
    var sum2 = basic.sum(set2);

    for (var i = 0; i < n; i++) {
      total += set1[i] * set2[i];
    }

    return (total - sum1 * sum2 / n) / n;
  } else {
    throw new Error('Array mismatch');
  }
};

},{"./basic":5}],13:[function(require,module,exports){
require("./science.v1");

module.exports = science;

},{"./science.v1":14}],14:[function(require,module,exports){
(function(exports){
(function(exports){
var science = exports.science = {version: "1.9.1"}; // semver
science.ascending = function(a, b) {
  return a - b;
};
// Euler's constant.
science.EULER = .5772156649015329;
// Compute exp(x) - 1 accurately for small x.
science.expm1 = function(x) {
  return (x < 1e-5 && x > -1e-5) ? x + .5 * x * x : Math.exp(x) - 1;
};
science.functor = function(v) {
  return typeof v === "function" ? v : function() { return v; };
};
// Based on:
// http://www.johndcook.com/blog/2010/06/02/whats-so-hard-about-finding-a-hypotenuse/
science.hypot = function(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  var max,
      min;
  if (x > y) { max = x; min = y; }
  else       { max = y; min = x; }
  var r = min / max;
  return max * Math.sqrt(1 + r * r);
};
science.quadratic = function() {
  var complex = false;

  function quadratic(a, b, c) {
    var d = b * b - 4 * a * c;
    if (d > 0) {
      d = Math.sqrt(d) / (2 * a);
      return complex
        ? [{r: -b - d, i: 0}, {r: -b + d, i: 0}]
        : [-b - d, -b + d];
    } else if (d === 0) {
      d = -b / (2 * a);
      return complex ? [{r: d, i: 0}] : [d];
    } else {
      if (complex) {
        d = Math.sqrt(-d) / (2 * a);
        return [
          {r: -b, i: -d},
          {r: -b, i: d}
        ];
      }
      return [];
    }
  }

  quadratic.complex = function(x) {
    if (!arguments.length) return complex;
    complex = x;
    return quadratic;
  };

  return quadratic;
};
// Constructs a multi-dimensional array filled with zeroes.
science.zeroes = function(n) {
  var i = -1,
      a = [];
  if (arguments.length === 1)
    while (++i < n)
      a[i] = 0;
  else
    while (++i < n)
      a[i] = science.zeroes.apply(
        this, Array.prototype.slice.call(arguments, 1));
  return a;
};
})(this);
(function(exports){
science.lin = {};
science.lin.decompose = function() {

  function decompose(A) {
    var n = A.length, // column dimension
        V = [],
        d = [],
        e = [];

    for (var i = 0; i < n; i++) {
      V[i] = [];
      d[i] = [];
      e[i] = [];
    }

    var symmetric = true;
    for (var j = 0; j < n; j++) {
      for (var i = 0; i < n; i++) {
        if (A[i][j] !== A[j][i]) {
          symmetric = false;
          break;
        }
      }
    }

    if (symmetric) {
      for (var i = 0; i < n; i++) V[i] = A[i].slice();

      // Tridiagonalize.
      science_lin_decomposeTred2(d, e, V);

      // Diagonalize.
      science_lin_decomposeTql2(d, e, V);
    } else {
      var H = [];
      for (var i = 0; i < n; i++) H[i] = A[i].slice();

      // Reduce to Hessenberg form.
      science_lin_decomposeOrthes(H, V);

      // Reduce Hessenberg to real Schur form.
      science_lin_decomposeHqr2(d, e, H, V);
    }

    var D = [];
    for (var i = 0; i < n; i++) {
      var row = D[i] = [];
      for (var j = 0; j < n; j++) row[j] = i === j ? d[i] : 0;
      D[i][e[i] > 0 ? i + 1 : i - 1] = e[i];
    }
    return {D: D, V: V};
  }

  return decompose;
};

// Symmetric Householder reduction to tridiagonal form.
function science_lin_decomposeTred2(d, e, V) {
  // This is derived from the Algol procedures tred2 by
  // Bowdler, Martin, Reinsch, and Wilkinson, Handbook for
  // Auto. Comp., Vol.ii-Linear Algebra, and the corresponding
  // Fortran subroutine in EISPACK.

  var n = V.length;

  for (var j = 0; j < n; j++) d[j] = V[n - 1][j];

  // Householder reduction to tridiagonal form.
  for (var i = n - 1; i > 0; i--) {
    // Scale to avoid under/overflow.

    var scale = 0,
        h = 0;
    for (var k = 0; k < i; k++) scale += Math.abs(d[k]);
    if (scale === 0) {
      e[i] = d[i - 1];
      for (var j = 0; j < i; j++) {
        d[j] = V[i - 1][j];
        V[i][j] = 0;
        V[j][i] = 0;
      }
    } else {
      // Generate Householder vector.
      for (var k = 0; k < i; k++) {
        d[k] /= scale;
        h += d[k] * d[k];
      }
      var f = d[i - 1];
      var g = Math.sqrt(h);
      if (f > 0) g = -g;
      e[i] = scale * g;
      h = h - f * g;
      d[i - 1] = f - g;
      for (var j = 0; j < i; j++) e[j] = 0;

      // Apply similarity transformation to remaining columns.

      for (var j = 0; j < i; j++) {
        f = d[j];
        V[j][i] = f;
        g = e[j] + V[j][j] * f;
        for (var k = j+1; k <= i - 1; k++) {
          g += V[k][j] * d[k];
          e[k] += V[k][j] * f;
        }
        e[j] = g;
      }
      f = 0;
      for (var j = 0; j < i; j++) {
        e[j] /= h;
        f += e[j] * d[j];
      }
      var hh = f / (h + h);
      for (var j = 0; j < i; j++) e[j] -= hh * d[j];
      for (var j = 0; j < i; j++) {
        f = d[j];
        g = e[j];
        for (var k = j; k <= i - 1; k++) V[k][j] -= (f * e[k] + g * d[k]);
        d[j] = V[i - 1][j];
        V[i][j] = 0;
      }
    }
    d[i] = h;
  }

  // Accumulate transformations.
  for (var i = 0; i < n - 1; i++) {
    V[n - 1][i] = V[i][i];
    V[i][i] = 1.0;
    var h = d[i + 1];
    if (h != 0) {
      for (var k = 0; k <= i; k++) d[k] = V[k][i + 1] / h;
      for (var j = 0; j <= i; j++) {
        var g = 0;
        for (var k = 0; k <= i; k++) g += V[k][i + 1] * V[k][j];
        for (var k = 0; k <= i; k++) V[k][j] -= g * d[k];
      }
    }
    for (var k = 0; k <= i; k++) V[k][i + 1] = 0;
  }
  for (var j = 0; j < n; j++) {
    d[j] = V[n - 1][j];
    V[n - 1][j] = 0;
  }
  V[n - 1][n - 1] = 1;
  e[0] = 0;
}

// Symmetric tridiagonal QL algorithm.
function science_lin_decomposeTql2(d, e, V) {
  // This is derived from the Algol procedures tql2, by
  // Bowdler, Martin, Reinsch, and Wilkinson, Handbook for
  // Auto. Comp., Vol.ii-Linear Algebra, and the corresponding
  // Fortran subroutine in EISPACK.

  var n = V.length;

  for (var i = 1; i < n; i++) e[i - 1] = e[i];
  e[n - 1] = 0;

  var f = 0;
  var tst1 = 0;
  var eps = 1e-12;
  for (var l = 0; l < n; l++) {
    // Find small subdiagonal element
    tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
    var m = l;
    while (m < n) {
      if (Math.abs(e[m]) <= eps*tst1) { break; }
      m++;
    }

    // If m == l, d[l] is an eigenvalue,
    // otherwise, iterate.
    if (m > l) {
      var iter = 0;
      do {
        iter++;  // (Could check iteration count here.)

        // Compute implicit shift
        var g = d[l];
        var p = (d[l + 1] - g) / (2 * e[l]);
        var r = science.hypot(p, 1);
        if (p < 0) r = -r;
        d[l] = e[l] / (p + r);
        d[l + 1] = e[l] * (p + r);
        var dl1 = d[l + 1];
        var h = g - d[l];
        for (var i = l+2; i < n; i++) d[i] -= h;
        f += h;

        // Implicit QL transformation.
        p = d[m];
        var c = 1;
        var c2 = c;
        var c3 = c;
        var el1 = e[l + 1];
        var s = 0;
        var s2 = 0;
        for (var i = m - 1; i >= l; i--) {
          c3 = c2;
          c2 = c;
          s2 = s;
          g = c * e[i];
          h = c * p;
          r = science.hypot(p,e[i]);
          e[i + 1] = s * r;
          s = e[i] / r;
          c = p / r;
          p = c * d[i] - s * g;
          d[i + 1] = h + s * (c * g + s * d[i]);

          // Accumulate transformation.
          for (var k = 0; k < n; k++) {
            h = V[k][i + 1];
            V[k][i + 1] = s * V[k][i] + c * h;
            V[k][i] = c * V[k][i] - s * h;
          }
        }
        p = -s * s2 * c3 * el1 * e[l] / dl1;
        e[l] = s * p;
        d[l] = c * p;

        // Check for convergence.
      } while (Math.abs(e[l]) > eps*tst1);
    }
    d[l] = d[l] + f;
    e[l] = 0;
  }

  // Sort eigenvalues and corresponding vectors.
  for (var i = 0; i < n - 1; i++) {
    var k = i;
    var p = d[i];
    for (var j = i + 1; j < n; j++) {
      if (d[j] < p) {
        k = j;
        p = d[j];
      }
    }
    if (k != i) {
      d[k] = d[i];
      d[i] = p;
      for (var j = 0; j < n; j++) {
        p = V[j][i];
        V[j][i] = V[j][k];
        V[j][k] = p;
      }
    }
  }
}

// Nonsymmetric reduction to Hessenberg form.
function science_lin_decomposeOrthes(H, V) {
  // This is derived from the Algol procedures orthes and ortran,
  // by Martin and Wilkinson, Handbook for Auto. Comp.,
  // Vol.ii-Linear Algebra, and the corresponding
  // Fortran subroutines in EISPACK.

  var n = H.length;
  var ort = [];

  var low = 0;
  var high = n - 1;

  for (var m = low + 1; m < high; m++) {
    // Scale column.
    var scale = 0;
    for (var i = m; i <= high; i++) scale += Math.abs(H[i][m - 1]);

    if (scale !== 0) {
      // Compute Householder transformation.
      var h = 0;
      for (var i = high; i >= m; i--) {
        ort[i] = H[i][m - 1] / scale;
        h += ort[i] * ort[i];
      }
      var g = Math.sqrt(h);
      if (ort[m] > 0) g = -g;
      h = h - ort[m] * g;
      ort[m] = ort[m] - g;

      // Apply Householder similarity transformation
      // H = (I-u*u'/h)*H*(I-u*u')/h)
      for (var j = m; j < n; j++) {
        var f = 0;
        for (var i = high; i >= m; i--) f += ort[i] * H[i][j];
        f /= h;
        for (var i = m; i <= high; i++) H[i][j] -= f * ort[i];
      }

      for (var i = 0; i <= high; i++) {
        var f = 0;
        for (var j = high; j >= m; j--) f += ort[j] * H[i][j];
        f /= h;
        for (var j = m; j <= high; j++) H[i][j] -= f * ort[j];
      }
      ort[m] = scale * ort[m];
      H[m][m - 1] = scale * g;
    }
  }

  // Accumulate transformations (Algol's ortran).
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) V[i][j] = i === j ? 1 : 0;
  }

  for (var m = high-1; m >= low+1; m--) {
    if (H[m][m - 1] !== 0) {
      for (var i = m + 1; i <= high; i++) ort[i] = H[i][m - 1];
      for (var j = m; j <= high; j++) {
        var g = 0;
        for (var i = m; i <= high; i++) g += ort[i] * V[i][j];
        // Double division avoids possible underflow
        g = (g / ort[m]) / H[m][m - 1];
        for (var i = m; i <= high; i++) V[i][j] += g * ort[i];
      }
    }
  }
}

// Nonsymmetric reduction from Hessenberg to real Schur form.
function science_lin_decomposeHqr2(d, e, H, V) {
  // This is derived from the Algol procedure hqr2,
  // by Martin and Wilkinson, Handbook for Auto. Comp.,
  // Vol.ii-Linear Algebra, and the corresponding
  // Fortran subroutine in EISPACK.

  var nn = H.length,
      n = nn - 1,
      low = 0,
      high = nn - 1,
      eps = 1e-12,
      exshift = 0,
      p = 0,
      q = 0,
      r = 0,
      s = 0,
      z = 0,
      t,
      w,
      x,
      y;

  // Store roots isolated by balanc and compute matrix norm
  var norm = 0;
  for (var i = 0; i < nn; i++) {
    if (i < low || i > high) {
      d[i] = H[i][i];
      e[i] = 0;
    }
    for (var j = Math.max(i - 1, 0); j < nn; j++) norm += Math.abs(H[i][j]);
  }

  // Outer loop over eigenvalue index
  var iter = 0;
  while (n >= low) {
    // Look for single small sub-diagonal element
    var l = n;
    while (l > low) {
      s = Math.abs(H[l - 1][l - 1]) + Math.abs(H[l][l]);
      if (s === 0) s = norm;
      if (Math.abs(H[l][l - 1]) < eps * s) break;
      l--;
    }

    // Check for convergence
    // One root found
    if (l === n) {
      H[n][n] = H[n][n] + exshift;
      d[n] = H[n][n];
      e[n] = 0;
      n--;
      iter = 0;

    // Two roots found
    } else if (l === n - 1) {
      w = H[n][n - 1] * H[n - 1][n];
      p = (H[n - 1][n - 1] - H[n][n]) / 2;
      q = p * p + w;
      z = Math.sqrt(Math.abs(q));
      H[n][n] = H[n][n] + exshift;
      H[n - 1][n - 1] = H[n - 1][n - 1] + exshift;
      x = H[n][n];

      // Real pair
      if (q >= 0) {
        z = p + (p >= 0 ? z : -z);
        d[n - 1] = x + z;
        d[n] = d[n - 1];
        if (z !== 0) d[n] = x - w / z;
        e[n - 1] = 0;
        e[n] = 0;
        x = H[n][n - 1];
        s = Math.abs(x) + Math.abs(z);
        p = x / s;
        q = z / s;
        r = Math.sqrt(p * p+q * q);
        p /= r;
        q /= r;

        // Row modification
        for (var j = n - 1; j < nn; j++) {
          z = H[n - 1][j];
          H[n - 1][j] = q * z + p * H[n][j];
          H[n][j] = q * H[n][j] - p * z;
        }

        // Column modification
        for (var i = 0; i <= n; i++) {
          z = H[i][n - 1];
          H[i][n - 1] = q * z + p * H[i][n];
          H[i][n] = q * H[i][n] - p * z;
        }

        // Accumulate transformations
        for (var i = low; i <= high; i++) {
          z = V[i][n - 1];
          V[i][n - 1] = q * z + p * V[i][n];
          V[i][n] = q * V[i][n] - p * z;
        }

        // Complex pair
      } else {
        d[n - 1] = x + p;
        d[n] = x + p;
        e[n - 1] = z;
        e[n] = -z;
      }
      n = n - 2;
      iter = 0;

      // No convergence yet
    } else {

      // Form shift
      x = H[n][n];
      y = 0;
      w = 0;
      if (l < n) {
        y = H[n - 1][n - 1];
        w = H[n][n - 1] * H[n - 1][n];
      }

      // Wilkinson's original ad hoc shift
      if (iter == 10) {
        exshift += x;
        for (var i = low; i <= n; i++) {
          H[i][i] -= x;
        }
        s = Math.abs(H[n][n - 1]) + Math.abs(H[n - 1][n-2]);
        x = y = 0.75 * s;
        w = -0.4375 * s * s;
      }

      // MATLAB's new ad hoc shift
      if (iter == 30) {
        s = (y - x) / 2.0;
        s = s * s + w;
        if (s > 0) {
          s = Math.sqrt(s);
          if (y < x) {
            s = -s;
          }
          s = x - w / ((y - x) / 2.0 + s);
          for (var i = low; i <= n; i++) {
            H[i][i] -= s;
          }
          exshift += s;
          x = y = w = 0.964;
        }
      }

      iter++;   // (Could check iteration count here.)

      // Look for two consecutive small sub-diagonal elements
      var m = n-2;
      while (m >= l) {
        z = H[m][m];
        r = x - z;
        s = y - z;
        p = (r * s - w) / H[m + 1][m] + H[m][m + 1];
        q = H[m + 1][m + 1] - z - r - s;
        r = H[m+2][m + 1];
        s = Math.abs(p) + Math.abs(q) + Math.abs(r);
        p = p / s;
        q = q / s;
        r = r / s;
        if (m == l) break;
        if (Math.abs(H[m][m - 1]) * (Math.abs(q) + Math.abs(r)) <
          eps * (Math.abs(p) * (Math.abs(H[m - 1][m - 1]) + Math.abs(z) +
          Math.abs(H[m + 1][m + 1])))) {
            break;
        }
        m--;
      }

      for (var i = m+2; i <= n; i++) {
        H[i][i-2] = 0;
        if (i > m+2) H[i][i-3] = 0;
      }

      // Double QR step involving rows l:n and columns m:n
      for (var k = m; k <= n - 1; k++) {
        var notlast = (k != n - 1);
        if (k != m) {
          p = H[k][k - 1];
          q = H[k + 1][k - 1];
          r = (notlast ? H[k + 2][k - 1] : 0);
          x = Math.abs(p) + Math.abs(q) + Math.abs(r);
          if (x != 0) {
            p /= x;
            q /= x;
            r /= x;
          }
        }
        if (x == 0) break;
        s = Math.sqrt(p * p + q * q + r * r);
        if (p < 0) { s = -s; }
        if (s != 0) {
          if (k != m) H[k][k - 1] = -s * x;
          else if (l != m) H[k][k - 1] = -H[k][k - 1];
          p += s;
          x = p / s;
          y = q / s;
          z = r / s;
          q /= p;
          r /= p;

          // Row modification
          for (var j = k; j < nn; j++) {
            p = H[k][j] + q * H[k + 1][j];
            if (notlast) {
              p = p + r * H[k + 2][j];
              H[k + 2][j] = H[k + 2][j] - p * z;
            }
            H[k][j] = H[k][j] - p * x;
            H[k + 1][j] = H[k + 1][j] - p * y;
          }

          // Column modification
          for (var i = 0; i <= Math.min(n, k + 3); i++) {
            p = x * H[i][k] + y * H[i][k + 1];
            if (notlast) {
              p += z * H[i][k + 2];
              H[i][k + 2] = H[i][k + 2] - p * r;
            }
            H[i][k] = H[i][k] - p;
            H[i][k + 1] = H[i][k + 1] - p * q;
          }

          // Accumulate transformations
          for (var i = low; i <= high; i++) {
            p = x * V[i][k] + y * V[i][k + 1];
            if (notlast) {
              p = p + z * V[i][k + 2];
              V[i][k + 2] = V[i][k + 2] - p * r;
            }
            V[i][k] = V[i][k] - p;
            V[i][k + 1] = V[i][k + 1] - p * q;
          }
        }  // (s != 0)
      }  // k loop
    }  // check convergence
  }  // while (n >= low)

  // Backsubstitute to find vectors of upper triangular form
  if (norm == 0) { return; }

  for (n = nn - 1; n >= 0; n--) {
    p = d[n];
    q = e[n];

    // Real vector
    if (q == 0) {
      var l = n;
      H[n][n] = 1.0;
      for (var i = n - 1; i >= 0; i--) {
        w = H[i][i] - p;
        r = 0;
        for (var j = l; j <= n; j++) { r = r + H[i][j] * H[j][n]; }
        if (e[i] < 0) {
          z = w;
          s = r;
        } else {
          l = i;
          if (e[i] === 0) {
            H[i][n] = -r / (w !== 0 ? w : eps * norm);
          } else {
            // Solve real equations
            x = H[i][i + 1];
            y = H[i + 1][i];
            q = (d[i] - p) * (d[i] - p) + e[i] * e[i];
            t = (x * s - z * r) / q;
            H[i][n] = t;
            if (Math.abs(x) > Math.abs(z)) {
              H[i + 1][n] = (-r - w * t) / x;
            } else {
              H[i + 1][n] = (-s - y * t) / z;
            }
          }

          // Overflow control
          t = Math.abs(H[i][n]);
          if ((eps * t) * t > 1) {
            for (var j = i; j <= n; j++) H[j][n] = H[j][n] / t;
          }
        }
      }
    // Complex vector
    } else if (q < 0) {
      var l = n - 1;

      // Last vector component imaginary so matrix is triangular
      if (Math.abs(H[n][n - 1]) > Math.abs(H[n - 1][n])) {
        H[n - 1][n - 1] = q / H[n][n - 1];
        H[n - 1][n] = -(H[n][n] - p) / H[n][n - 1];
      } else {
        var zz = science_lin_decomposeCdiv(0, -H[n - 1][n], H[n - 1][n - 1] - p, q);
        H[n - 1][n - 1] = zz[0];
        H[n - 1][n] = zz[1];
      }
      H[n][n - 1] = 0;
      H[n][n] = 1;
      for (var i = n-2; i >= 0; i--) {
        var ra = 0,
            sa = 0,
            vr,
            vi;
        for (var j = l; j <= n; j++) {
          ra = ra + H[i][j] * H[j][n - 1];
          sa = sa + H[i][j] * H[j][n];
        }
        w = H[i][i] - p;

        if (e[i] < 0) {
          z = w;
          r = ra;
          s = sa;
        } else {
          l = i;
          if (e[i] == 0) {
            var zz = science_lin_decomposeCdiv(-ra,-sa,w,q);
            H[i][n - 1] = zz[0];
            H[i][n] = zz[1];
          } else {
            // Solve complex equations
            x = H[i][i + 1];
            y = H[i + 1][i];
            vr = (d[i] - p) * (d[i] - p) + e[i] * e[i] - q * q;
            vi = (d[i] - p) * 2.0 * q;
            if (vr == 0 & vi == 0) {
              vr = eps * norm * (Math.abs(w) + Math.abs(q) +
                Math.abs(x) + Math.abs(y) + Math.abs(z));
            }
            var zz = science_lin_decomposeCdiv(x*r-z*ra+q*sa,x*s-z*sa-q*ra,vr,vi);
            H[i][n - 1] = zz[0];
            H[i][n] = zz[1];
            if (Math.abs(x) > (Math.abs(z) + Math.abs(q))) {
              H[i + 1][n - 1] = (-ra - w * H[i][n - 1] + q * H[i][n]) / x;
              H[i + 1][n] = (-sa - w * H[i][n] - q * H[i][n - 1]) / x;
            } else {
              var zz = science_lin_decomposeCdiv(-r-y*H[i][n - 1],-s-y*H[i][n],z,q);
              H[i + 1][n - 1] = zz[0];
              H[i + 1][n] = zz[1];
            }
          }

          // Overflow control
          t = Math.max(Math.abs(H[i][n - 1]),Math.abs(H[i][n]));
          if ((eps * t) * t > 1) {
            for (var j = i; j <= n; j++) {
              H[j][n - 1] = H[j][n - 1] / t;
              H[j][n] = H[j][n] / t;
            }
          }
        }
      }
    }
  }

  // Vectors of isolated roots
  for (var i = 0; i < nn; i++) {
    if (i < low || i > high) {
      for (var j = i; j < nn; j++) V[i][j] = H[i][j];
    }
  }

  // Back transformation to get eigenvectors of original matrix
  for (var j = nn - 1; j >= low; j--) {
    for (var i = low; i <= high; i++) {
      z = 0;
      for (var k = low; k <= Math.min(j, high); k++) z += V[i][k] * H[k][j];
      V[i][j] = z;
    }
  }
}

// Complex scalar division.
function science_lin_decomposeCdiv(xr, xi, yr, yi) {
  if (Math.abs(yr) > Math.abs(yi)) {
    var r = yi / yr,
        d = yr + r * yi;
    return [(xr + r * xi) / d, (xi - r * xr) / d];
  } else {
    var r = yr / yi,
        d = yi + r * yr;
    return [(r * xr + xi) / d, (r * xi - xr) / d];
  }
}
science.lin.cross = function(a, b) {
  // TODO how to handle non-3D vectors?
  // TODO handle 7D vectors?
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
};
science.lin.dot = function(a, b) {
  var s = 0,
      i = -1,
      n = Math.min(a.length, b.length);
  while (++i < n) s += a[i] * b[i];
  return s;
};
science.lin.length = function(p) {
  return Math.sqrt(science.lin.dot(p, p));
};
science.lin.normalize = function(p) {
  var length = science.lin.length(p);
  return p.map(function(d) { return d / length; });
};
// 4x4 matrix determinant.
science.lin.determinant = function(matrix) {
  var m = matrix[0].concat(matrix[1]).concat(matrix[2]).concat(matrix[3]);
  return (
    m[12] * m[9]  * m[6]  * m[3]  - m[8] * m[13] * m[6]  * m[3]  -
    m[12] * m[5]  * m[10] * m[3]  + m[4] * m[13] * m[10] * m[3]  +
    m[8]  * m[5]  * m[14] * m[3]  - m[4] * m[9]  * m[14] * m[3]  -
    m[12] * m[9]  * m[2]  * m[7]  + m[8] * m[13] * m[2]  * m[7]  +
    m[12] * m[1]  * m[10] * m[7]  - m[0] * m[13] * m[10] * m[7]  -
    m[8]  * m[1]  * m[14] * m[7]  + m[0] * m[9]  * m[14] * m[7]  +
    m[12] * m[5]  * m[2]  * m[11] - m[4] * m[13] * m[2]  * m[11] -
    m[12] * m[1]  * m[6]  * m[11] + m[0] * m[13] * m[6]  * m[11] +
    m[4]  * m[1]  * m[14] * m[11] - m[0] * m[5]  * m[14] * m[11] -
    m[8]  * m[5]  * m[2]  * m[15] + m[4] * m[9]  * m[2]  * m[15] +
    m[8]  * m[1]  * m[6]  * m[15] - m[0] * m[9]  * m[6]  * m[15] -
    m[4]  * m[1]  * m[10] * m[15] + m[0] * m[5]  * m[10] * m[15]);
};
// Performs in-place Gauss-Jordan elimination.
//
// Based on Jarno Elonen's Python version (public domain):
// http://elonen.iki.fi/code/misc-notes/python-gaussj/index.html
science.lin.gaussjordan = function(m, eps) {
  if (!eps) eps = 1e-10;

  var h = m.length,
      w = m[0].length,
      y = -1,
      y2,
      x;

  while (++y < h) {
    var maxrow = y;

    // Find max pivot.
    y2 = y; while (++y2 < h) {
      if (Math.abs(m[y2][y]) > Math.abs(m[maxrow][y]))
        maxrow = y2;
    }

    // Swap.
    var tmp = m[y];
    m[y] = m[maxrow];
    m[maxrow] = tmp;

    // Singular?
    if (Math.abs(m[y][y]) <= eps) return false;

    // Eliminate column y.
    y2 = y; while (++y2 < h) {
      var c = m[y2][y] / m[y][y];
      x = y - 1; while (++x < w) {
        m[y2][x] -= m[y][x] * c;
      }
    }
  }

  // Backsubstitute.
  y = h; while (--y >= 0) {
    var c = m[y][y];
    y2 = -1; while (++y2 < y) {
      x = w; while (--x >= y) {
        m[y2][x] -=  m[y][x] * m[y2][y] / c;
      }
    }
    m[y][y] /= c;
    // Normalize row y.
    x = h - 1; while (++x < w) {
      m[y][x] /= c;
    }
  }
  return true;
};
// Find matrix inverse using Gauss-Jordan.
science.lin.inverse = function(m) {
  var n = m.length,
      i = -1;

  // Check if the matrix is square.
  if (n !== m[0].length) return;

  // Augment with identity matrix I to get AI.
  m = m.map(function(row, i) {
    var identity = new Array(n),
        j = -1;
    while (++j < n) identity[j] = i === j ? 1 : 0;
    return row.concat(identity);
  });

  // Compute IA^-1.
  science.lin.gaussjordan(m);

  // Remove identity matrix I to get A^-1.
  while (++i < n) {
    m[i] = m[i].slice(n);
  }

  return m;
};
science.lin.multiply = function(a, b) {
  var m = a.length,
      n = b[0].length,
      p = b.length,
      i = -1,
      j,
      k;
  if (p !== a[0].length) throw {"error": "columns(a) != rows(b); " + a[0].length + " != " + p};
  var ab = new Array(m);
  while (++i < m) {
    ab[i] = new Array(n);
    j = -1; while(++j < n) {
      var s = 0;
      k = -1; while (++k < p) s += a[i][k] * b[k][j];
      ab[i][j] = s;
    }
  }
  return ab;
};
science.lin.transpose = function(a) {
  var m = a.length,
      n = a[0].length,
      i = -1,
      j,
      b = new Array(n);
  while (++i < n) {
    b[i] = new Array(m);
    j = -1; while (++j < m) b[i][j] = a[j][i];
  }
  return b;
};
/**
 * Solves tridiagonal systems of linear equations.
 *
 * Source: http://en.wikipedia.org/wiki/Tridiagonal_matrix_algorithm
 *
 * @param {number[]} a
 * @param {number[]} b
 * @param {number[]} c
 * @param {number[]} d
 * @param {number[]} x
 * @param {number} n
 */
science.lin.tridag = function(a, b, c, d, x, n) {
  var i,
      m;
  for (i = 1; i < n; i++) {
    m = a[i] / b[i - 1];
    b[i] -= m * c[i - 1];
    d[i] -= m * d[i - 1];
  }
  x[n - 1] = d[n - 1] / b[n - 1];
  for (i = n - 2; i >= 0; i--) {
    x[i] = (d[i] - c[i] * x[i + 1]) / b[i];
  }
};
})(this);
(function(exports){
science.stats = {};
// Bandwidth selectors for Gaussian kernels.
// Based on R's implementations in `stats.bw`.
science.stats.bandwidth = {

  // Silverman, B. W. (1986) Density Estimation. London: Chapman and Hall.
  nrd0: function(x) {
    var hi = Math.sqrt(science.stats.variance(x));
    if (!(lo = Math.min(hi, science.stats.iqr(x) / 1.34)))
      (lo = hi) || (lo = Math.abs(x[1])) || (lo = 1);
    return .9 * lo * Math.pow(x.length, -.2);
  },

  // Scott, D. W. (1992) Multivariate Density Estimation: Theory, Practice, and
  // Visualization. Wiley.
  nrd: function(x) {
    var h = science.stats.iqr(x) / 1.34;
    return 1.06 * Math.min(Math.sqrt(science.stats.variance(x)), h)
      * Math.pow(x.length, -1/5);
  }
};
science.stats.distance = {
  euclidean: function(a, b) {
    var n = a.length,
        i = -1,
        s = 0,
        x;
    while (++i < n) {
      x = a[i] - b[i];
      s += x * x;
    }
    return Math.sqrt(s);
  },
  manhattan: function(a, b) {
    var n = a.length,
        i = -1,
        s = 0;
    while (++i < n) s += Math.abs(a[i] - b[i]);
    return s;
  },
  minkowski: function(p) {
    return function(a, b) {
      var n = a.length,
          i = -1,
          s = 0;
      while (++i < n) s += Math.pow(Math.abs(a[i] - b[i]), p);
      return Math.pow(s, 1 / p);
    };
  },
  chebyshev: function(a, b) {
    var n = a.length,
        i = -1,
        max = 0,
        x;
    while (++i < n) {
      x = Math.abs(a[i] - b[i]);
      if (x > max) max = x;
    }
    return max;
  },
  hamming: function(a, b) {
    var n = a.length,
        i = -1,
        d = 0;
    while (++i < n) if (a[i] !== b[i]) d++;
    return d;
  },
  jaccard: function(a, b) {
    var n = a.length,
        i = -1,
        s = 0;
    while (++i < n) if (a[i] === b[i]) s++;
    return s / n;
  },
  braycurtis: function(a, b) {
    var n = a.length,
        i = -1,
        s0 = 0,
        s1 = 0,
        ai,
        bi;
    while (++i < n) {
      ai = a[i];
      bi = b[i];
      s0 += Math.abs(ai - bi);
      s1 += Math.abs(ai + bi);
    }
    return s0 / s1;
  }
};
// Based on implementation in http://picomath.org/.
science.stats.erf = function(x) {
  var a1 =  0.254829592,
      a2 = -0.284496736,
      a3 =  1.421413741,
      a4 = -1.453152027,
      a5 =  1.061405429,
      p  =  0.3275911;

  // Save the sign of x
  var sign = x < 0 ? -1 : 1;
  if (x < 0) {
    sign = -1;
    x = -x;
  }

  // A&S formula 7.1.26
  var t = 1 / (1 + p * x);
  return sign * (
    1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1)
    * t * Math.exp(-x * x));
};
science.stats.phi = function(x) {
  return .5 * (1 + science.stats.erf(x / Math.SQRT2));
};
// See <http://en.wikipedia.org/wiki/Kernel_(statistics)>.
science.stats.kernel = {
  uniform: function(u) {
    if (u <= 1 && u >= -1) return .5;
    return 0;
  },
  triangular: function(u) {
    if (u <= 1 && u >= -1) return 1 - Math.abs(u);
    return 0;
  },
  epanechnikov: function(u) {
    if (u <= 1 && u >= -1) return .75 * (1 - u * u);
    return 0;
  },
  quartic: function(u) {
    if (u <= 1 && u >= -1) {
      var tmp = 1 - u * u;
      return (15 / 16) * tmp * tmp;
    }
    return 0;
  },
  triweight: function(u) {
    if (u <= 1 && u >= -1) {
      var tmp = 1 - u * u;
      return (35 / 32) * tmp * tmp * tmp;
    }
    return 0;
  },
  gaussian: function(u) {
    return 1 / Math.sqrt(2 * Math.PI) * Math.exp(-.5 * u * u);
  },
  cosine: function(u) {
    if (u <= 1 && u >= -1) return Math.PI / 4 * Math.cos(Math.PI / 2 * u);
    return 0;
  }
};
// http://exploringdata.net/den_trac.htm
science.stats.kde = function() {
  var kernel = science.stats.kernel.gaussian,
      sample = [],
      bandwidth = science.stats.bandwidth.nrd;

  function kde(points, i) {
    var bw = bandwidth.call(this, sample);
    return points.map(function(x) {
      var i = -1,
          y = 0,
          n = sample.length;
      while (++i < n) {
        y += kernel((x - sample[i]) / bw);
      }
      return [x, y / bw / n];
    });
  }

  kde.kernel = function(x) {
    if (!arguments.length) return kernel;
    kernel = x;
    return kde;
  };

  kde.sample = function(x) {
    if (!arguments.length) return sample;
    sample = x;
    return kde;
  };

  kde.bandwidth = function(x) {
    if (!arguments.length) return bandwidth;
    bandwidth = science.functor(x);
    return kde;
  };

  return kde;
};
// Based on figue implementation by Jean-Yves Delort.
// http://code.google.com/p/figue/
science.stats.kmeans = function() {
  var distance = science.stats.distance.euclidean,
      maxIterations = 1000,
      k = 1;

  function kmeans(vectors) {
    var n = vectors.length,
        assignments = [],
        clusterSizes = [],
        repeat = 1,
        iterations = 0,
        centroids = science_stats_kmeansRandom(k, vectors),
        newCentroids,
        i,
        j,
        x,
        d,
        min,
        best;

    while (repeat && iterations < maxIterations) {
      // Assignment step.
      j = -1; while (++j < k) {
        clusterSizes[j] = 0;
      }

      i = -1; while (++i < n) {
        x = vectors[i];
        min = Infinity;
        j = -1; while (++j < k) {
          d = distance.call(this, centroids[j], x);
          if (d < min) {
            min = d;
            best = j;
          }
        }
        clusterSizes[assignments[i] = best]++;
      }

      // Update centroids step.
      newCentroids = [];
      i = -1; while (++i < n) {
        x = assignments[i];
        d = newCentroids[x];
        if (d == null) newCentroids[x] = vectors[i].slice();
        else {
          j = -1; while (++j < d.length) {
            d[j] += vectors[i][j];
          }
        }
      }
      j = -1; while (++j < k) {
        x = newCentroids[j];
        d = 1 / clusterSizes[j];
        i = -1; while (++i < x.length) x[i] *= d;
      }

      // Check convergence.
      repeat = 0;
      j = -1; while (++j < k) {
        if (!science_stats_kmeansCompare(newCentroids[j], centroids[j])) {
          repeat = 1;
          break;
        }
      }
      centroids = newCentroids;
      iterations++;
    }
    return {assignments: assignments, centroids: centroids};
  }

  kmeans.k = function(x) {
    if (!arguments.length) return k;
    k = x;
    return kmeans;
  };

  kmeans.distance = function(x) {
    if (!arguments.length) return distance;
    distance = x;
    return kmeans;
  };

  return kmeans;
};

function science_stats_kmeansCompare(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  var n = a.length,
      i = -1;
  while (++i < n) if (a[i] !== b[i]) return false;
  return true;
}

// Returns an array of k distinct vectors randomly selected from the input
// array of vectors. Returns null if k > n or if there are less than k distinct
// objects in vectors.
function science_stats_kmeansRandom(k, vectors) {
  var n = vectors.length;
  if (k > n) return null;
  
  var selected_vectors = [];
  var selected_indices = [];
  var tested_indices = {};
  var tested = 0;
  var selected = 0;
  var i,
      vector,
      select;

  while (selected < k) {
    if (tested === n) return null;
    
    var random_index = Math.floor(Math.random() * n);
    if (random_index in tested_indices) continue;
    
    tested_indices[random_index] = 1;
    tested++;
    vector = vectors[random_index];
    select = true;
    for (i = 0; i < selected; i++) {
      if (science_stats_kmeansCompare(vector, selected_vectors[i])) {
        select = false;
        break;
      }
    }
    if (select) {
      selected_vectors[selected] = vector;
      selected_indices[selected] = random_index;
      selected++;
    }
  }
  return selected_vectors;
}
science.stats.hcluster = function() {
  var distance = science.stats.distance.euclidean,
      linkage = "simple"; // simple, complete or average

  function hcluster(vectors) {
    var n = vectors.length,
        dMin = [],
        cSize = [],
        distMatrix = [],
        clusters = [],
        c1,
        c2,
        c1Cluster,
        c2Cluster,
        p,
        root,
        i,
        j;

    // Initialise distance matrix and vector of closest clusters.
    i = -1; while (++i < n) {
      dMin[i] = 0;
      distMatrix[i] = [];
      j = -1; while (++j < n) {
        distMatrix[i][j] = i === j ? Infinity : distance(vectors[i] , vectors[j]);
        if (distMatrix[i][dMin[i]] > distMatrix[i][j]) dMin[i] = j;
      }
    }

    // create leaves of the tree
    i = -1; while (++i < n) {
      clusters[i] = [];
      clusters[i][0] = {
        left: null,
        right: null,
        dist: 0,
        centroid: vectors[i],
        size: 1,
        depth: 0
      };
      cSize[i] = 1;
    }

    // Main loop
    for (p = 0; p < n-1; p++) {
      // find the closest pair of clusters
      c1 = 0;
      for (i = 0; i < n; i++) {
        if (distMatrix[i][dMin[i]] < distMatrix[c1][dMin[c1]]) c1 = i;
      }
      c2 = dMin[c1];

      // create node to store cluster info 
      c1Cluster = clusters[c1][0];
      c2Cluster = clusters[c2][0];

      newCluster = {
        left: c1Cluster,
        right: c2Cluster,
        dist: distMatrix[c1][c2],
        centroid: calculateCentroid(c1Cluster.size, c1Cluster.centroid,
          c2Cluster.size, c2Cluster.centroid),
        size: c1Cluster.size + c2Cluster.size,
        depth: 1 + Math.max(c1Cluster.depth, c2Cluster.depth)
      };
      clusters[c1].splice(0, 0, newCluster);
      cSize[c1] += cSize[c2];

      // overwrite row c1 with respect to the linkage type
      for (j = 0; j < n; j++) {
        switch (linkage) {
          case "single":
            if (distMatrix[c1][j] > distMatrix[c2][j])
              distMatrix[j][c1] = distMatrix[c1][j] = distMatrix[c2][j];
            break;
          case "complete":
            if (distMatrix[c1][j] < distMatrix[c2][j])
              distMatrix[j][c1] = distMatrix[c1][j] = distMatrix[c2][j];
            break;
          case "average":
            distMatrix[j][c1] = distMatrix[c1][j] = (cSize[c1] * distMatrix[c1][j] + cSize[c2] * distMatrix[c2][j]) / (cSize[c1] + cSize[j]);
            break;
        }
      }
      distMatrix[c1][c1] = Infinity;

      // infinity ­out old row c2 and column c2
      for (i = 0; i < n; i++)
        distMatrix[i][c2] = distMatrix[c2][i] = Infinity;

      // update dmin and replace ones that previous pointed to c2 to point to c1
      for (j = 0; j < n; j++) {
        if (dMin[j] == c2) dMin[j] = c1;
        if (distMatrix[c1][j] < distMatrix[c1][dMin[c1]]) dMin[c1] = j;
      }

      // keep track of the last added cluster
      root = newCluster;
    }

    return root;
  }

  hcluster.distance = function(x) {
    if (!arguments.length) return distance;
    distance = x;
    return hcluster;
  };

  return hcluster;
};

function calculateCentroid(c1Size, c1Centroid, c2Size, c2Centroid) {
  var newCentroid = [],
      newSize = c1Size + c2Size,
      n = c1Centroid.length,
      i = -1;
  while (++i < n) {
    newCentroid[i] = (c1Size * c1Centroid[i] + c2Size * c2Centroid[i]) / newSize;
  }
  return newCentroid;
}
science.stats.iqr = function(x) {
  var quartiles = science.stats.quantiles(x, [.25, .75]);
  return quartiles[1] - quartiles[0];
};
// Based on org.apache.commons.math.analysis.interpolation.LoessInterpolator
// from http://commons.apache.org/math/
science.stats.loess = function() {    
  var bandwidth = .3,
      robustnessIters = 2,
      accuracy = 1e-12;

  function smooth(xval, yval, weights) {
    var n = xval.length,
        i;

    if (n !== yval.length) throw {error: "Mismatched array lengths"};
    if (n == 0) throw {error: "At least one point required."};

    if (arguments.length < 3) {
      weights = [];
      i = -1; while (++i < n) weights[i] = 1;
    }

    science_stats_loessFiniteReal(xval);
    science_stats_loessFiniteReal(yval);
    science_stats_loessFiniteReal(weights);
    science_stats_loessStrictlyIncreasing(xval);

    if (n == 1) return [yval[0]];
    if (n == 2) return [yval[0], yval[1]];

    var bandwidthInPoints = Math.floor(bandwidth * n);

    if (bandwidthInPoints < 2) throw {error: "Bandwidth too small."};

    var res = [],
        residuals = [],
        robustnessWeights = [];

    // Do an initial fit and 'robustnessIters' robustness iterations.
    // This is equivalent to doing 'robustnessIters+1' robustness iterations
    // starting with all robustness weights set to 1.
    i = -1; while (++i < n) {
      res[i] = 0;
      residuals[i] = 0;
      robustnessWeights[i] = 1;
    }

    var iter = -1;
    while (++iter <= robustnessIters) {
      var bandwidthInterval = [0, bandwidthInPoints - 1];
      // At each x, compute a local weighted linear regression
      var x;
      i = -1; while (++i < n) {
        x = xval[i];

        // Find out the interval of source points on which
        // a regression is to be made.
        if (i > 0) {
          science_stats_loessUpdateBandwidthInterval(xval, weights, i, bandwidthInterval);
        }

        var ileft = bandwidthInterval[0],
            iright = bandwidthInterval[1];

        // Compute the point of the bandwidth interval that is
        // farthest from x
        var edge = (xval[i] - xval[ileft]) > (xval[iright] - xval[i]) ? ileft : iright;

        // Compute a least-squares linear fit weighted by
        // the product of robustness weights and the tricube
        // weight function.
        // See http://en.wikipedia.org/wiki/Linear_regression
        // (section "Univariate linear case")
        // and http://en.wikipedia.org/wiki/Weighted_least_squares
        // (section "Weighted least squares")
        var sumWeights = 0,
            sumX = 0,
            sumXSquared = 0,
            sumY = 0,
            sumXY = 0,
            denom = Math.abs(1 / (xval[edge] - x));

        for (var k = ileft; k <= iright; ++k) {
          var xk   = xval[k],
              yk   = yval[k],
              dist = k < i ? x - xk : xk - x,
              w    = science_stats_loessTricube(dist * denom) * robustnessWeights[k] * weights[k],
              xkw  = xk * w;
          sumWeights += w;
          sumX += xkw;
          sumXSquared += xk * xkw;
          sumY += yk * w;
          sumXY += yk * xkw;
        }

        var meanX = sumX / sumWeights,
            meanY = sumY / sumWeights,
            meanXY = sumXY / sumWeights,
            meanXSquared = sumXSquared / sumWeights;

        var beta = (Math.sqrt(Math.abs(meanXSquared - meanX * meanX)) < accuracy)
            ? 0 : ((meanXY - meanX * meanY) / (meanXSquared - meanX * meanX));

        var alpha = meanY - beta * meanX;

        res[i] = beta * x + alpha;
        residuals[i] = Math.abs(yval[i] - res[i]);
      }

      // No need to recompute the robustness weights at the last
      // iteration, they won't be needed anymore
      if (iter === robustnessIters) {
        break;
      }

      // Recompute the robustness weights.

      // Find the median residual.
      var sortedResiduals = residuals.slice();
      sortedResiduals.sort();
      var medianResidual = sortedResiduals[Math.floor(n / 2)];

      if (Math.abs(medianResidual) < accuracy)
        break;

      var arg,
          w;
      i = -1; while (++i < n) {
        arg = residuals[i] / (6 * medianResidual);
        robustnessWeights[i] = (arg >= 1) ? 0 : ((w = 1 - arg * arg) * w);
      }
    }

    return res;
  }

  smooth.bandwidth = function(x) {
    if (!arguments.length) return x;
    bandwidth = x;
    return smooth;
  };

  smooth.robustnessIterations = function(x) {
    if (!arguments.length) return x;
    robustnessIters = x;
    return smooth;
  };

  smooth.accuracy = function(x) {
    if (!arguments.length) return x;
    accuracy = x;
    return smooth;
  };

  return smooth;
};

function science_stats_loessFiniteReal(values) {
  var n = values.length,
      i = -1;

  while (++i < n) if (!isFinite(values[i])) return false;

  return true;
}

function science_stats_loessStrictlyIncreasing(xval) {
  var n = xval.length,
      i = 0;

  while (++i < n) if (xval[i - 1] >= xval[i]) return false;

  return true;
}

// Compute the tricube weight function.
// http://en.wikipedia.org/wiki/Local_regression#Weight_function
function science_stats_loessTricube(x) {
  return (x = 1 - x * x * x) * x * x;
}

// Given an index interval into xval that embraces a certain number of
// points closest to xval[i-1], update the interval so that it embraces
// the same number of points closest to xval[i], ignoring zero weights.
function science_stats_loessUpdateBandwidthInterval(
  xval, weights, i, bandwidthInterval) {

  var left = bandwidthInterval[0],
      right = bandwidthInterval[1];

  // The right edge should be adjusted if the next point to the right
  // is closer to xval[i] than the leftmost point of the current interval
  var nextRight = science_stats_loessNextNonzero(weights, right);
  if ((nextRight < xval.length) && (xval[nextRight] - xval[i]) < (xval[i] - xval[left])) {
    var nextLeft = science_stats_loessNextNonzero(weights, left);
    bandwidthInterval[0] = nextLeft;
    bandwidthInterval[1] = nextRight;
  }
}

function science_stats_loessNextNonzero(weights, i) {
  var j = i + 1;
  while (j < weights.length && weights[j] === 0) j++;
  return j;
}
// Welford's algorithm.
science.stats.mean = function(x) {
  var n = x.length;
  if (n === 0) return NaN;
  var m = 0,
      i = -1;
  while (++i < n) m += (x[i] - m) / (i + 1);
  return m;
};
science.stats.median = function(x) {
  return science.stats.quantiles(x, [.5])[0];
};
science.stats.mode = function(x) {
  x = x.slice().sort(science.ascending);
  var mode,
      n = x.length,
      i = -1,
      l = i,
      last = null,
      max = 0,
      tmp,
      v;
  while (++i < n) {
    if ((v = x[i]) !== last) {
      if ((tmp = i - l) > max) {
        max = tmp;
        mode = last;
      }
      last = v;
      l = i;
    }
  }
  return mode;
};
// Uses R's quantile algorithm type=7.
science.stats.quantiles = function(d, quantiles) {
  d = d.slice().sort(science.ascending);
  var n_1 = d.length - 1;
  return quantiles.map(function(q) {
    if (q === 0) return d[0];
    else if (q === 1) return d[n_1];

    var index = 1 + q * n_1,
        lo = Math.floor(index),
        h = index - lo,
        a = d[lo - 1];

    return h === 0 ? a : a + h * (d[lo] - a);
  });
};
// Unbiased estimate of a sample's variance.
// Also known as the sample variance, where the denominator is n - 1.
science.stats.variance = function(x) {
  var n = x.length;
  if (n < 1) return NaN;
  if (n === 1) return 0;
  var mean = science.stats.mean(x),
      i = -1,
      s = 0;
  while (++i < n) {
    var v = x[i] - mean;
    s += v * v;
  }
  return s / (n - 1);
};
science.stats.distribution = {
};
// From http://www.colingodsey.com/javascript-gaussian-random-number-generator/
// Uses the Box-Muller Transform.
science.stats.distribution.gaussian = function() {
  var random = Math.random,
      mean = 0,
      sigma = 1,
      variance = 1;

  function gaussian() {
    var x1,
        x2,
        rad,
        y1;

    do {
      x1 = 2 * random() - 1;
      x2 = 2 * random() - 1;
      rad = x1 * x1 + x2 * x2;
    } while (rad >= 1 || rad === 0);

    return mean + sigma * x1 * Math.sqrt(-2 * Math.log(rad) / rad);
  }

  gaussian.pdf = function(x) {
    x = (x - mu) / sigma;
    return science_stats_distribution_gaussianConstant * Math.exp(-.5 * x * x) / sigma;
  };

  gaussian.cdf = function(x) {
    x = (x - mu) / sigma;
    return .5 * (1 + science.stats.erf(x / Math.SQRT2));
  };

  gaussian.mean = function(x) {
    if (!arguments.length) return mean;
    mean = +x;
    return gaussian;
  };

  gaussian.variance = function(x) {
    if (!arguments.length) return variance;
    sigma = Math.sqrt(variance = +x);
    return gaussian;
  };

  gaussian.random = function(x) {
    if (!arguments.length) return random;
    random = x;
    return gaussian;
  };

  return gaussian;
};

science_stats_distribution_gaussianConstant = 1 / Math.sqrt(2 * Math.PI);
})(this);
})(this);

},{}],15:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}]},{},[])
;
