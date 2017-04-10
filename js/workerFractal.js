var canvasData = []; // to return // sprawdzic wielość tablicy w kilku miejscach
var palette;
var canvasHeight;
var canvasWidth;
var fractalName;
var offsetX;
var panX;
var offsetY;
var panY;
var zoom;
var value1Iter;
var value2Iter;
var maxIterations;
var palette;
var rInside;
var gInside;
var bInside;
var threadIndex;
var numOfThreads;

onmessage = function (e) {
    setVariables( e );
    calculateCanvasData(); 
    postMessage( [ threadIndex, canvasData ]);
}

function setVariables( e ){
    // TODO: zrobic forem 
    canvasHeight = e.data[0];
    canvasWidth = e.data[1];
    fractalName = e.data[2];
    offsetX = e.data[3];
    panX = e.data[4];
    offsetY = e.data[5];
    panY = e.data[6];
    zoom = e.data[7];
    value1Iter = e.data[8];
    value2Iter = e.data[9];
    maxIterations = e.data[10];
    palette = e.data[11];
    rInside = e.data[12];
    gInside = e.data[13];
    bInside = e.data[14]; 
    threadIndex = e.data[15];  
    numOfThreads = e.data[16];    
}

function calculateCanvasData(){
    chooseFractalAndCalculate( fractalName ); //TODO: zobaczy czy da sie bez parametru
}

// counts pixels only for part of data 
function calculateColorsForMandelbrotPixels(){
	var start = threadIndex * canvasHeight / numOfThreads;
	var stop = (threadIndex + 1) * canvasHeight / numOfThreads;
    for (var i = start; i < stop; i++) {
        for (var j = 0; j < canvasWidth; j++){          
            var pixelColor = calculateMandelbrotPixelColor( j, i ); 
            setPixelData( j, i - start, pixelColor.r, pixelColor.g, pixelColor.b, 255 );  
        } 
    }
}

function calculateColorsForJuliaPixels(){ // zamienic zmienne tak jak w mandelbrocie
    var start = threadIndex * canvasHeight / numOfThreads;
	var stop = (threadIndex + 1) * canvasHeight / numOfThreads;
    for (var i = start; i < stop; i++) {
        for (var j = 0; j < canvasWidth; j++){          
            var pixelColor = calculateJuliaPixelColor( j, i ); 
            setPixelData( j, i - start , pixelColor.r, pixelColor.g, pixelColor.b, 255 );
        } 
    }
}

function  chooseFractalAndCalculate( fractalName ){
    var color;
    if ( fractalName == "mandelbrot" ){
        color = calculateColorsForMandelbrotPixels();
    } else if ( fractalName == "julia" ){
        color = calculateColorsForJuliaPixels();
    }
    return color;
}

function setPixelData( x, y, r, g, b, a ) {
    var pixelIndex = ( x + y * canvasWidth ) * 4  ; // data in canvasData ia an array, not matrix
    canvasData[ pixelIndex ] = r;
    canvasData[ pixelIndex + 1 ] = g;
    canvasData[ pixelIndex + 2 ] = b;
    canvasData[ pixelIndex + 3 ] = a; 
}

// Calculate the color of a specific pixel
function calculateMandelbrotPixelColor( x, y ) { 
    // Convert the screen coordinate to a fractal coordinate
    var x0 = ( x + offsetX + panX ) / zoom;
    var y0 = ( y + offsetY + panY ) / zoom;  
       
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
    
    return getColorFromIterations( iterations );
}

function calculateJuliaPixelColor( x, y ){
    var cX = value1Iter;  //-0.7 // -1.2 do 0.5 co 0.01
    var cY = value2Iter; //0.27015 // 28025 spoko  // od 0 do 0.5 co 0.0005 
 
    var zx = ( x + offsetX + panX ) / zoom;
    var zy = ( y + offsetY + panY ) / zoom; 
    
	var iterations = 0; 
	while (( zx * zx + zy * zy < 4 ) && ( iterations < maxIterations )){ 
		 var temp = zx * zx - zy * zy + cX;
		 zy = 2.0 * zx * zy + cY;
         zx = temp;
		 iterations += 1;
    }
    
    return getColorFromIterations( iterations );     
}

// Get palette color based on the number of iterations
function getColorFromIterations( iterations ){
    var color;
    if ( iterations == maxIterations ) { 
        color = { r: rInside, g: gInside, b: bInside }; 
    } else {
        var index = Math.floor(( iterations / ( maxIterations-1)) * 255);
        color = palette[ index ];
    }    
    return color;
    
}

