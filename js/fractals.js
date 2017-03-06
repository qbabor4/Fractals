// Fractals generator


// Canvas variables
var canvas = $( "#myCanvas" )[ 0 ] //gets jquery objest (not canvas) without [0]
var canvasContent = canvas.getContext( "2d" );
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var canvasData = canvasContent.getImageData( 0, 0, canvasWidth, canvasHeight );

// Fractals variables
var offsetx = - canvasWidth / 2;
var offsety = - canvasHeight / 2;
var panX = - 100; // movet to right for better view // -100
var panY = 0;
var zoom = 250; //150

// Maximum numbers of iterations while choosing color for pixel
mandelbrotMaxIterations = 250;
juliaMaxIterations = 250;

// Palette array of 256 colors in object {r,g,b}
var palette = [];

// Name of fractal that should be drawn
var fractalName = "mandelbrot";

// rgb values to create palette
var roffset, goffset, boffset;
    
//defines values od a pixel
function drawPixel( x, y, r, g, b, a ) {
    var index = ( x + y * canvasWidth ) * 4  ; // data in canvasData ia an array, not matrix
    
    canvasData.data[ index ] = r;
    canvasData.data[ index +1 ] = g;
    canvasData.data[ index +2 ] = b;
    canvasData.data[ index +3 ] = a;
}

// updatae data of pixels, so modyfications are taken in consideration
function updateCanvas() {
    canvasContent.putImageData(canvasData, 0, 0);
}

// Calculate the color of a specific pixel
function calculateMandelbrotPixelColor(x, y, maxIterations) { //wywalic argumenty
    // Convert the screen coordinate to a fractal coordinate
    var x0 = ( x + offsetx + panX ) / zoom;
    var y0 = ( y + offsety + panY ) / zoom;  
       
    // Iteration variables
    var a = 0;
    var b = 0;
    var rx = 0;
    var ry = 0;
        
    var iterations = 0;
    while ( iterations < maxIterations && ( rx * rx + ry * ry <= 4 )) {
        rx = a * a - b * b + x0;
        ry = 2 * a * b + y0;
            
        a = rx;
        b = ry;
        iterations++;
    }    
    // Get palette color based on the number of iterations
    var color;
    if ( iterations == maxIterations ) {
        color = { r:0, g:0, b:0 }; // Black
    } else {
        var index = Math.floor(( iterations / ( maxIterations-1)) * 255);
        color = palette[ index ];
    }    
    return color;
}

function calculateJulia( x, y, maxIterations ){
    
    var cX = -0.7; //zmieniac zeby dstac inne kształty //0.7
    var cY = 0.27015; //0.27015
 
    var zx = ( x + offsetx + panX ) / zoom;
    var zy = ( y + offsety + panY ) / zoom; 
    
	var iterations = 0; 
	while (( zx * zx + zy * zy < 4 ) && ( iterations < maxIterations )){ 
		 var temp = zx * zx - zy * zy + cX;
		 zy = 2.0 * zx * zy + cY;
         zx = temp;
		 iterations += 1;
    }

    if ( iterations == maxIterations ) {
        var color = { r:0, g:0, b:0 }; // Black
    } else {
        var index = Math.floor(( iterations / ( maxIterations - 1 )) * 255);
        color = palette[ index ];
    }  
    return color;           
    // kolory wzgledem zy i zx (experyment)    
}


// Calculate gradient
function generatePalette() {
    for ( var i = 0; i < 256; i++ ) {
        palette[ i ] = { r: roffset, g: goffset, b: boffset};    
        
        if ( i < 85 ) {
            roffset += 3;
        } else if ( i<170 ) {
            goffset += 3;
        } else if ( i<256 ) {
            boffset += 3;
        }
    }
}

// change color of all pixels in order to create fractal
function drawFractal( fractalName ){
    // draw pixels
    for (var i = 0; i < canvasHeight + 1; i++) {
        for (var j = 0; j < canvasWidth + 1; j++){
            var pixelColor = chooseFractal( j, i, fractalName );
            drawPixel( j, i, pixelColor.r, pixelColor.g, pixelColor.b, 255 ); 
        } 
    }
    updateCanvas();
}

function chooseFractal( x, y, fractalName ){
    if ( fractalName == "mandelbrot" ){
        var color = calculateMandelbrotPixelColor( x, y, mandelbrotMaxIterations ); 
    } else if ( fractalName == "julia" ){
        var color = calculateJulia( x, y, juliaMaxIterations );
    }
    return color;
}


// Zoom the fractal
function zoomFractal(x, y, factor, zoomin) {
    if ( zoomin ) {
        // Zoom in
        zoom *= factor;
        panX = factor * ( x + offsetx + panX );
        panY = factor * ( y + offsety + panY );
    } else {
    // Zoom out
        zoom /= factor;
        panX = ( x + offsetx + panX ) / factor;
        panY = ( y + offsety + panY ) / factor;
    }
}
    
// Get the mouse position
function getMousePos( canvas, e ) {
    var rect = canvas.getBoundingClientRect(); // zobaczyc jak działa
    return {
        x: Math.round(( e.clientX - rect.left )/( rect.right - rect.left ) * canvas.width ), //zmienic na zmienną canvasWidth i height
        y: Math.round(( e.clientY - rect.top )/( rect.bottom - rect.top ) * canvas.height )
    };
}

function changeColorsValue() { // to w generate value, a zmienne roffset itd w srodku funkcji
    roffset = parseInt( roffsetOutputValue.value );
    goffset = parseInt( goffsetOutputValue.value );
    boffset = parseInt( boffsetOutputValue.value );
    //console.log(roffset, goffset, boffset);
}

function drawNewColorFractal() {
    changeColorsValue();
    generatePalette();
    drawFractal( fractalName );
}

function zoomFrame(){
    $( "canvas#myCanvas" ).on( 'mousedown', function(e) {
        var pos = getMousePos( canvas, e );
        
        // Zoom out with Control
        var zoomin = true;
        if ( e.ctrlKey ) {
            zoomin = false;
        }
        
        // Move to sides with Shift
        var zoomfactor = 2;
        if ( e.shiftKey ) {
            zoomfactor = 1;
        }
        
        // Zoom the fractal at the mouse position
        zoomFractal( pos.x, pos.y, zoomfactor, zoomin );
        
        // Generate new image
        drawFractal( fractalName );
    });
}

function chooseJulia(){
    fractalName = "julia";
    panX = 0;
    panY = 0;
    zoom = 250;
    drawFractal( fractalName );    
}

function chooseMandelbrot(){    
    fractalName = "mandelbrot";
    panX = -100;
    panY = 0;
    zoom = 250;
    drawFractal( fractalName );    
}


function main(tframe){
    // Request animation frames // nie wiem po co i jak uzyc
    //window.requestAnimationFrame(main);
    
    zoomFrame();
    changeColorsValue();
    generatePalette();    
}

function init(){    
    main(0);
    drawFractal( fractalName );    
}

$(document).ready(function(){    
    
    init();
   
});




