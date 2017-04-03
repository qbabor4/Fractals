// Fractals generator

// Canvas variables
var canvas = $( "#myCanvas" )[ 0 ] //gets jquery object (not canvas element) without [0]
var canvasContent = canvas.getContext( "2d" );
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var canvasData = canvasContent.getImageData( 0, 0, canvasWidth, canvasHeight );

// Fractals variables
var offsetx = - canvasWidth / 2;
var offsety = - canvasHeight / 2;
var panX = -100; // move to the right for better view // -100
var panY = 0;
var zoom = 250; //150

// Maximum numbers of iterations while choosing color for pixel
maxIterations = 255; // od 10 do 1000 mandel //od 10 do 5000 julia
  
// Palette array of 256 colors in object {r,g,b}
var palette = [];

// Name of fractal that should be drawn
var fractalName = "mandelbrot";

// rgb values to create palette (outside colors)
var roffset = 0;
var goffset = 21;
var boffset = 255;
    
// rgb values for inside colors
var rInside = 0;
var gInside = 0;
var bInside = 0;

// defines what set of colors is chosen;
var colorPositionOutside = true;

//values for shape changes
value1Iter = 0;
value2Iter = 0;

//defines values od a pixel
function drawPixel( x, y, r, g, b, a ) {
    var index = ( x + y * canvasWidth ) * 4  ; // data in canvasData ia an array, not matrix
    
    canvasData.data[ index ] = r;
    canvasData.data[ index + 1 ] = g;
    canvasData.data[ index + 2 ] = b;
    canvasData.data[ index + 3 ] = a;
}

// updatae data of pixels, so modyfications are taken in consideration
function updateCanvas() {
    canvasContent.putImageData(canvasData, 0, 0);
}

function showAsPng(){
    var png = canvas.toDataURL("image/png");
    var newWindow = window.open(png);   
}

function showResolutionDiv() {
    $("#resulutionContainer").show();    
}

function hideResolutionDiv(){
    $("#resulutionContainer").hide();
}

function changeResolution(){
    // wybór jakie wymiary ( div pojawiajacy sie z radio inputami i guzikiem ok i anuluj )
    // wyczaic zaleźnosci z panX i zoom przy zmianie rezdzielczosci
    var resolutionArray = getResolutionData();
    var canvasElement = $( "#myCanvas" );
    canvasElement.attr("width", resolutionArray[0]);
    canvasElement.attr("height", resolutionArray[1]);   
    canvasWidth = resolutionArray[0];
    canvasHeight = resolutionArray[1];
    canvasData = canvasContent.getImageData( 0, 0, canvasWidth, canvasHeight );
    
    $('canvas#myCanvas').appendTo($('#biggercanvas')); // moves canvas to body
    //$('canvas#myCanvas').css("margin", "auto");
    
    drawNewFractalWithGif();
    pageScroll( canvasHeight ); 
    hideResolutionDiv();
    
}

function getResolutionData(){
    var checkedResolution =  $('input[name="canvasResolutionName"]:checked').val();
    var checkedResolutionArray = checkedResolution.split(",");
    var checkedIntResolutionArray = checkedResolutionArray.map(function (x) { return parseInt(x);});
    
    return checkedIntResolutionArray;
}

function pageScroll( numbOfPixels ) {
    $('body,html').animate({scrollTop: numbOfPixels}, 800); 
}

// Calculate the color of a specific pixel
function calculateMandelbrotPixelColor(x, y, maxIterations) { //wywalic argumenty
    // Convert the screen coordinate to a fractal coordinate
    var x0 = ( x + offsetx + panX ) / zoom;
    var y0 = ( y + offsety + panY ) / zoom;  
       
    // Iteration variables
    var a = value1Iter; //0 // zmiana tego co 0.01 //1.7 max
    var b = value2Iter; // 1.2 max co 0.01
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
        color = { r: rInside, g: gInside, b: bInside }; 
    } else {
        var index = Math.floor(( iterations / ( maxIterations-1)) * 255);
        color = palette[ index ];
    }    
    return color;
}
// zmiana zmiannych jak zmiana na inpucie

function calculateJulia( x, y, maxIterations ){
    
    var cX = value1Iter;  //-0.7 // -1.2 do 0.5 co 0.01
    var cY = value2Iter; //0.27015 // 28025 spoko  // od 0 do 0.5 co 0.0005 
 
    var zx = ( x + offsetx + panX ) / zoom;
    var zy = ( y + offsety + panY ) / zoom; 
    
	var iterations = 0; 
	while (( zx * zx + zy * zy < 4 ) && ( iterations < maxIterations )){ 
		 var temp = zx * zx - zy * zy + cX;
		 zy = 2.0 * zx * zy + cY;
         zx = temp;
		 iterations += 1;
    }
    
    // TODO: dac do funkcji (pobiera iterations)
    if ( iterations == maxIterations ) {
        var color = { r: rInside , g: gInside, b: bInside }; // Black 
    } else {
        var index = Math.floor(( iterations / ( maxIterations - 1 )) * 255);
        color = palette[ index ];
    }  
    //
    return color;             
}


// Calculate and generate colors palette
function generatePalette() {
    for ( var i = 0; i < 256; i++ ) {
        palette[ i ] = { r: roffset, g: goffset, b: boffset};    
        if ( i < 85 ) {
            roffset += 3;
        } else if ( i < 170 ) {
            goffset += 3;
        } else if ( i < 256 ) {
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
        var color = calculateMandelbrotPixelColor( x, y, maxIterations ); 
    } else if ( fractalName == "julia" ){
        var color = calculateJulia( x, y, maxIterations );
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
    var rect = canvas.getBoundingClientRect(); 
    return {
        x: Math.round(( e.clientX - rect.left )/( rect.right - rect.left ) * canvasWidth ), //zmienic na zmienną canvasWidth i height
        y: Math.round(( e.clientY - rect.top )/( rect.bottom - rect.top ) * canvasHeight )
    };
}

function changeOutsideColorsValue() { 
    rgbColors = HSVtoRGB(HSVhue, HSVsaturation, HSVvalue);
    roffset =  rgbColors.r ; 
    goffset =  rgbColors.g ;
    boffset =  rgbColors.b ;
}

function changeInsideColorsValue(){
    rgbColors = HSVtoRGB(HSVhue, HSVsaturation, HSVvalue);
    rInside = rgbColors.r ; 
    gInside = rgbColors.g;
    bInside = rgbColors.b ;
}

function drawNewFractal() {
    if (colorPositionOutside){
        changeOutsideColorsValue();
        generatePalette();
    }
    else{
        changeInsideColorsValue();
    }
    drawFractal( fractalName );
}

function drawNewFractalWithGif(){
    // asynchronicznie zrobic z settimeout jakos (albo wątki normalnie)      
    drawNewFractal();   
}

function chooseJulia(){
    fractalName = "julia";
    panX = 0;
    panY = 0;
    zoom = 250;
    value1Iter = -0.7;
    value2Iter = 0.27;
    setInuptOutputRangeParameters( value1Input, value1Output, 0.5, -1.2, 0.01, -0.7);
    setInuptOutputRangeParameters( value2Input, value2Output, 0.5, 0, 0.0005, 0.27);
    setMaxIterationsOnInputRange(30000);
    drawFractal( fractalName );    
}

function chooseMandelbrot(){    
    fractalName = "mandelbrot";
    panX = -100;
    panY = 0;
    zoom = 250;
    value1Iter = 0;
    value2Iter = 0;
    console.log(value1Input);
    setInuptOutputRangeParameters( value1Input, value1Output, 1.7, 0, 0.01, 0);
    setInuptOutputRangeParameters( value2Input, value2Output, 1.2, 0, 0.01, 0);
    setMaxIterationsOnInputRange(1000);
    drawFractal( fractalName );    
}

function setInuptOutputRangeParameters( inputId, outputId, max, min, step, value ){
    var input = $("#" + inputId.id ); 
    var output = $("#" +  outputId.id );
    
    input.attr("max", max);
    input.attr("min", min);
    input.attr("step", step);
    input.attr("value", value);
    inputId.value = value;
    outputId.value = value;
}

// set value of max iterations (in while loop) for calculating fractal
function setMaxIterations( numOfIterations ){
    maxIterations = numOfIterations;
}

function setMaxIterationsOnInputRange( numOfIterations ) {
     var input = $("#maxIterationsInput"); 
     input.attr("max", numOfIterations);
      
     setValueOnMaxIterationsInputRange( 250 );
     
}

// change value on input visually and asign to variable
function setValueOnMaxIterationsInputRange( numOfIterations ){
     var input = $("#maxIterationsInput"); 
     maxIterations =  numOfIterations ;
     input.attr("value", maxIterations);
     maxIterationsInput.value = maxIterations;
     maxIterationsOutput.value = maxIterations;
     //console.log(input.attr("value"));
}


function main(tframe){
    // Request animation frames // nie wiem po co
    //window.requestAnimationFrame(main);
    generatePalette();
}

function init(){    
    main(0);
    drawFractal( fractalName );    
}

$(document).ready(function(){    
    
    init();
    
});




