/*
 * Vanilla Mandelbrot Set renderer with canvas and javascript
 *
 * Written by Christian Stigen Larsen
 * http://csl.sublevel3.org
 *
 * Put in the public domain by the author
 * 2012-02-22
 *
 */

function plot(img, x, y, r, g, b, a)
{
  var off = x + y*img.width;
  off <<= 2;
  img.data[off+0] = r;
  img.data[off+1] = g;
  img.data[off+2] = b;
  img.data[off+3] = a;
}

var canvas = document.getElementById('canvasMandelbrot');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//canvas.width = 640; canvas.height = 480;
var ctx = canvas.getContext('2d');
var img = ctx.getImageData(0, 0, canvas.width, canvas.height);

window.onresize = function(event)
{
  canvas = document.getElementById('canvasMandelbrot');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext('2d');
  img = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function draw()
{
  var steps = parseInt(document.getElementById('steps').value);
  var threshold = parseFloat(document.getElementById('threshold').value);
  threshold *= threshold; // optimization trick

  var x_start = -2.0;
  var x_stop = 1.0;
  var x_step = (x_stop - x_start) / (0.5 + (canvas.width-1));

  var y_start = -1.0;
  var y_stop = 1.0;
  var y_step = (y_stop - y_start) / (canvas.height - 1);

  var ploty = y_start;
  var y=0;

  var drawLine = function(Ci, off, x_start, x_step, pixels)
  {
    var Zr = 0;
    var Zi = 0;
    var Tr = 0;
    var Ti = 0;
    var Cr = x_start;
    var col = 0;

    for ( var x=0; x<img.width; ++x, Cr += x_step ) {
      Zr = Zi = Tr = Ti = 0;

      for ( var i=0; i<steps && (Tr+Ti)<=threshold; ++i ) {
        Zi = 2 * Zr * Zi + Ci;
        Zr = Tr - Ti + Cr;
        Tr = Zr * Zr;
        Ti = Zi * Zi;
      }

      img.data[off++] =
      img.data[off++] =
      img.data[off++] = (i>0)*Math.sqrt(Tr+Ti)*100;
      img.data[off++] = 255;
    }
  };

  var start = (new Date).getTime();
  var pixels = 0;

  (function animation() {
    if ( y++ < canvas.height ) {
      drawLine(ploty, (y*img.width)<<2, x_start, x_step);
      ploty  += y_step;
      pixels += img.width;
      ctx.putImageData(img, 0, 0);
      setTimeout(animation);
    }

    var stop = (new Date).getTime();
    var elapsedMS = stop - start;
    document.getElementById('renderMS').innerHTML = elapsedMS;
    document.getElementById('renderSpeed').innerHTML = Math.floor(1000.0*pixels/elapsedMS);
  })();

}
