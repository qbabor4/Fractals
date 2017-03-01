
//Mandelbrot fractal

//  canvas variables
var canvas = $("#myCanvas")[0] //dostaje obiekt jquery a nie canvas jak jest bez [0]
var canvasContent = canvas.getContext("2d");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var canvasData = canvasContent.getImageData(0,0, canvasWidth, canvasHeight);

var offsetx = -canvasWidth/2;
var offsety = -canvasHeight/2;
var panx = -100;
var pany = 0;
var zoom = 150;

// Palette array of 256 colors in object {r,g,b}
var palette = [];
    
// define values od a pixel
function drawPixel(x, y, r, g, b, a) {
    var index = ( x + y * canvasWidth) * 4  ; // data in canvasData ia an array, not matrix
    
    canvasData.data[index] = r;
    canvasData.data[index +1] = g;
    canvasData.data[index +2] = b;
    canvasData.data[index +3] = a;
}

// updatae data of pixels, so modyfications are taken in consideration
function updateCanvas() {
    canvasContent.putImageData(canvasData, 0, 0);
}


// Calculate the color of a specific pixel
function iterate(x, y, imageWidth, imageHeight, maxiterations) {
    // Convert the screen coordinate to a fractal coordinate
    var x0 = (x + offsetx + panx) / zoom;
    var y0 = (y + offsety + pany) / zoom;  
       
    // Iteration variables
    var a = 0;
    var b = 0;
    var rx = 0;
    var ry = 0;
        
    var iterations = 0;
    while (iterations < maxiterations && (rx * rx + ry * ry <= 4)) {
        rx = a * a - b * b + x0;
        ry = 2 * a * b + y0;
            
        a = rx;
        b = ry;
        iterations++;
    }    
    // Get palette color based on the number of iterations
    var color;
    if (iterations == maxiterations) {
        color = { r:0, g:0, b:0 }; // Black
    } else {
        var index = Math.floor((iterations / (maxiterations-1)) * 255);
        color = palette[index];
    }    
    return color;
}

// Calculate a gradient
function generatePalette() {
    var roffset = 24;
    var goffset = 16;
    var boffset = 0;
    
    for (var i=0; i<256; i++) {
        palette[i] = { r:roffset, g:goffset, b:boffset};    
        
        if (i < 64) {
            roffset += 3;
        } else if (i<128) {
            goffset += 3;
        } else if (i<192) {
            boffset += 3;
        }
    }
}

// change color of all pixels in order to create fractal
function drawFractal(){
    // draw pixels
    for (var i = 0; i < canvasHeight + 1; i++) {
        for (var j = 0; j < canvasWidth + 1; j++){
            //drawPixel(j, i, 20,200,10,255); 
            color = iterate(j, i, canvasWidth, canvasHeight, 250);
            //console.log(color.r, color.g, color.b);
            drawPixel(j, i, color.r, color.g, color.b, 255); 
        } 
    }
    updateCanvas();
}



function main(tframe){
    // Add mouse events
    canvas.addEventListener("mousedown", onMouseDown);
        
    // Request animation frames
    window.requestAnimationFrame(main);
    
    generatePalette();
}

function init(){
    main(0);
    drawFractal();
}


// Zoom the fractal
    function zoomFractal(x, y, factor, zoomin) {
        if (zoomin) {
            // Zoom in
            zoom *= factor;
            panx = factor * (x + offsetx + panx);
            pany = factor * (y + offsety + pany);
        } else {
            // Zoom out
            zoom /= factor;
            panx = (x + offsetx + panx) / factor;
            pany = (y + offsety + pany) / factor;
        }
    }
    
    // Mouse event handlers
    function onMouseDown(e) {
        var pos = getMousePos(canvas, e);
        
        // Zoom out with Control
        var zoomin = true;
        if (e.ctrlKey) {
            zoomin = false;
        }
        
        // Pan with Shift
        var zoomfactor = 2;
        if (e.shiftKey) {
            zoomfactor = 1;
        }
        
        // Zoom the fractal at the mouse position
        zoomFractal(pos.x, pos.y, zoomfactor, zoomin);
        
        // Generate a new image
        drawFractal();
}

// Get the mouse position
    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
            y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
        };
    }










init();
