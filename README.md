# Fractals
### Web Aplication that alows you to change shape and color of fractal with given inputs and HSV circle.

## How does it work:
Main element, that we are manipulating with, is canvas from HTML5.
It allows us to set data of pixel in an array, and then show it in our canvas.

On HSV circle we can pick color for outside or inside of fractal. See code [here](https://github.com/qbabor4/HSV-circle-js)

When we are clicking on fractal, that is shown on canvas, we can zoom it, move it or unzoom it ressing SHIFT or CTRL keys.

Program uses threads when they are available in browser. That makes calculation faster and makes page responsive while calculating new fractal (No freazes).

You can change Mandelbrot or Julia fractal. 

You can change resolution, to make fractal picture bigger and then show it as png picture.

Javascript uses JQuery framework.



You can see working code [here](http://qbabor4.ct8.pl/fractals/fractals.html)
