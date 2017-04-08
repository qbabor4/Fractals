// Fractals generator

// Canvas variables
var canvas = $( "#myCanvas" )[ 0 ] //gets jquery object (not canvas element) without [0]
var canvasContent = canvas.getContext( "2d" );
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var canvasData = canvasContent.getImageData( 0, 0, canvasWidth, canvasHeight );

// Fractals variables
var offsetX = - canvasWidth / 2;
var offsetY = - canvasHeight / 2;
var panX = -100; // move to the right for better view // -100
var panY = 0;
var zoom = 250; //150

// Maximum numbers of iterations while choosing color for pixel
var maxIterations = 255; // od 10 do 1000 mandel //od 10 do 5000 julia

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
    
    $('canvas#myCanvas').appendTo($('#biggercanvas')); // moves canvas to #biggercanvas div
    
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

function changeOutsideColorsValue() { 
    rgbColors = HSVtoRGB(HSVhue, HSVsaturation, HSVvalue);
    roffset =  rgbColors.r ; 
    goffset =  rgbColors.g ;
    boffset =  rgbColors.b ;
}

function changeInsideColorsValue(){
    rgbColors = HSVtoRGB(HSVhue, HSVsaturation, HSVvalue);
    rInside = rgbColors.r; 
    gInside = rgbColors.g;
    bInside = rgbColors.b;
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

//////////////////////////////////////////////Generating Fractal////////////////////////

function checkColorsPositionAndDrawNewFractal() {
    if (colorPositionOutside){
        changeOutsideColorsValue();
        generatePalette();
    }
    else{
        changeInsideColorsValue();
    }
    drawFractal();
}

function drawFractal(){
    var w;
    
    if ( typeof(w) == "undefined"){
        w = new Worker("js/worker.js"); // Creating thread
        w.postMessage([ canvasHeight, canvasWidth, fractalName , offsetX, panX, offsetY, panY, zoom, value1Iter, value2Iter, maxIterations, palette, rInside, gInside, bInside ]); // sending values to thread
        w.onmessage = function( e ) { 
            changeCanvasData( e );
            updateCanvas();
        }
        w = undefined; 
    }      
    
}

function changeCanvasData( e ){
    var dataLength = e.data.length;
    for (var i=0; i < dataLength; i++){
        canvasData.data[i] = e.data[i];
    }
}

function drawNewFractalWithGif(){
    resetChangeFractalButton();
     checkColorsPositionAndDrawNewFractal();
    
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

//////////////////////////////////////////////////////////////////////////////////////////////////

function main(tframe){
    // Request animation frames // nie wiem po co
    //window.requestAnimationFrame(main);
    generatePalette();
}

function init(){    
    main(0);
    //drawFractal( fractalName );
    drawNewFractalWithGif();   
}

$(document).ready(function(){    
    
    init();
    
});




