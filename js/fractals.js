/*TODO:
	-http://usefuljs.net/fractals/ (wiecej fraktali)
    - canvas w internet explorer nie działą
    - dopisek przy zmianie maxymalnej wartosci ze jak duzo to bedzie wolniej 
    - jak pierwszy raz ktos przychodzi ( ciasteczka ), to wyswietla sie instrukcja jak uzywac
    - jak sie zapisze zdjecie a potem z zakładek wejdzie, to ucina spód ( adres jest długo to moze ucina )( pokazac zdj jako stronę ) 
*/

// Fractals generator

// Canvas variables
var canvas = $( "#myCanvas" )[ 0 ] //gets jquery object (not canvas element) without [0]
var canvasContext = canvas.getContext( "2d" );
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var canvasData = canvasContext.getImageData( 0, 0, canvasWidth, canvasHeight ); 

// Fractals variables
var offsetX = - canvasWidth / 2;
var offsetY = - canvasHeight / 2;
var panX = -100; // move to the right for better view // -100
var panY = 0;
var zoom = 250; 

// Maximum numbers of iterations while choosing color for pixel
var maxIterations = 255; 

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

//Number of threads to run
var numOfThreads = 4;

//How many arrays function got from threads
var gotThreads = 0;

// shows canvas picture as image in different tab
function showAsPng(){
    var png = canvas.toDataURL("image/png");
    var newWindow = window.open(png);   
}

// shows available resolutions to pick
function showResolutionDiv() {
    $("#resulutionContainer").show();    
}

// hides resolution div
function hideResolutionDiv(){
    $("#resulutionContainer").hide();
}

// shows loading animation (while calculating canvas)
function showLoadingAnimation(){
	$("#blackFilterAnimation").show();
}

// hides -||-
function hideLoadingAniamtion(){
	$("#blackFilterAnimation").hide();
}

// changes resolution of canvas
function changeResolution(){
    // wybór jakie wymiary ( div pojawiajacy sie z radio inputami i guzikiem ok i anuluj )
    // wyczaic zaleźnosci z panX i zoom przy zmianie rezdzielczosci
    var resolutionArray = getResolutionData();
    var canvasElement = $( "#myCanvas" );
    canvasElement.attr("width", resolutionArray[0]);
    canvasElement.attr("height", resolutionArray[1]);   
    canvasWidth = resolutionArray[0];
    canvasHeight = resolutionArray[1];
    canvasData = canvasContext.getImageData( 0, 0, canvasWidth, canvasHeight );
    
    setAnimationPosition();
    
    drawNewFractalWithGif();
    pageScroll( canvasHeight ); 
    hideResolutionDiv();
    
}

// returns resolution data in array for egsample [800,600]
function getResolutionData(){
    var checkedResolution =  $('input[name="canvasResolutionName"]:checked').val();
    var checkedResolutionArray = checkedResolution.split(",");
    var checkedIntResolutionArray = checkedResolutionArray.map(function (x) { return parseInt(x);});
    
    return checkedIntResolutionArray;
}

// scrolling page to view fractal
function pageScroll( numbOfPixels ) {
    $('body,html').animate({scrollTop: numbOfPixels}, 800); 
}

// Zoom the fractal
function zoomFractal(x, y, factor, zoomin) {
    if ( zoomin ) {
        // Zoom in
        zoom *= factor;
        panX = factor * ( x + offsetX + panX );
        panY = factor * ( y + offsetY + panY );
    } else {
    // Zoom out
        zoom /= factor;
        panX = ( x + offsetX + panX ) / factor;
        panY = ( y + offsetY + panY ) / factor;
    }
}
    
// Get the mouse position on canvas
function getMousePos( canvas, e ) {
    var rect = canvas.getBoundingClientRect(); 
    return {
        x: Math.round(( e.clientX - rect.left )/( rect.right - rect.left ) * canvasWidth ), //zmienic na zmienną canvasWidth i height
        y: Math.round(( e.clientY - rect.top )/( rect.bottom - rect.top ) * canvasHeight )
    };
}

// changes color variables that defines outside colors of fractal
function changeOutsideColorsValue() { 
    rgbColors = HSVtoRGB(HSVhue, HSVsaturation, HSVvalue);
    roffset =  rgbColors.r ; 
    goffset =  rgbColors.g ;
    boffset =  rgbColors.b ;
}

// changes color variables that defines inside colors of fractal
function changeInsideColorsValue(){
    rgbColors = HSVtoRGB(HSVhue, HSVsaturation, HSVvalue);
    rInside = rgbColors.r; 
    gInside = rgbColors.g;
    bInside = rgbColors.b;
}

// sets variables to show new julia fractal on canvas
function chooseJulia(){
    fractalName = "julia";
    panX = 0;
    panY = 0;
    zoom = 250;
    value1Iter = -0.7;
    value2Iter = 0.27;
    setInuptOutputRangeParameters( value1Input, value1Output, 0.5, -1.2, 0.01, -0.7);
    setInuptOutputRangeParameters( value2Input, value2Output, 0.5, 0, 0.0005, 0.27);
    setMaxIterationsOnInputRange(5000);
    drawNewFractalWithGif();
    resetChangeFractalButton();   
}

// sets variables to show new mandelbrot fractal on canvas
function chooseMandelbrot(){    
    fractalName = "mandelbrot";
    panX = -100;
    panY = 0;
    zoom = 250;
    value1Iter = 0;
    value2Iter = 0;
    setInuptOutputRangeParameters( value1Input, value1Output, 1.7, 0, 0.01, 0);
    setInuptOutputRangeParameters( value2Input, value2Output, 1.2, 0, 0.01, 0);
    setMaxIterationsOnInputRange(1000); 
    drawNewFractalWithGif();
    resetChangeFractalButton();
}

// changes input range atributs
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

// sets max iterations on input range
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

// draws new fractal with animation
function drawNewFractalWithGif(){
	showLoadingAnimation();
    resetChangeFractalButton();
    checkColorsPositionAndDrawNewFractal();
}

function main(tframe){
    generatePalette();
}

function init(){    
    main(0);
    drawNewFractalWithGif();   
}

$(document).ready(function(){    
    
    init();
    
});




