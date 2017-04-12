//defines values od a pixel
function drawPixel( x, y, r, g, b, a ) {
    var index = ( x + y * canvasWidth ) * 4  ; // data in canvasData ia an array, not matrix
    
    canvasData.data[ index ] = r;
    canvasData.data[ index + 1 ] = g;
    canvasData.data[ index + 2 ] = b;
    canvasData.data[ index + 3 ] = a;
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

// Calculate the color of a specific pixel
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

// chooses fractal and calculates new fractal
function chooseFractalAndCalculate( ){
    if (  fractalName == "mandelbrot" ){
        calculateColorsForMandelbrotPixels(); //color = 
    } else if ( fractalName == "julia" ){
        calculateColorsForJuliaPixels();
    }
}

// change color of all pixels in order to create fractal
function calculateColorsForMandelbrotPixels(){
    // draw pixels
    for (var i = 0; i < canvasHeight + 1; i++) {
        for (var j = 0; j < canvasWidth + 1; j++){          
            var pixelColor = calculateMandelbrotPixelColor( j, i );
            drawPixel( j, i, pixelColor.r, pixelColor.g, pixelColor.b, 255 ); 
        } 
    }
    updateCanvas();
}

//calculates colors for pixels and update
function calculateColorsForJuliaPixels(){
    // draw pixels
    for (var i = 0; i < canvasHeight + 1; i++) {
        for (var j = 0; j < canvasWidth + 1; j++){          
            var pixelColor = calculateJuliaPixelColor( j, i );
            drawPixel( j, i, pixelColor.r, pixelColor.g, pixelColor.b, 255 ); 
        } 
    }
    updateCanvas();
}

// updatae data of pixels, so modyfications are taken in consideration
function updateCanvas() {
	canvasContext.putImageData(canvasData, 0, 0); 
    hideLoadingAniamtion();
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

// sets data of canvas from each tread
function changeCanvasData( e ){
	gotThreads++;
	var threadIndex = e.data[0]; 
	var data = e.data[1];
    var dataLength = data.length;
    var start = threadIndex * dataLength;
	var stop = start+ dataLength;
	var j = 0;
    for (var i = start; i < stop; i++){ 
        canvasData.data[i] = data[j]; 
        j++	;
    }
    if (gotThreads == numOfThreads){
		updateCanvas();
	}
}

//draws fractal with workers or in normal way
function drawFractal(){
    if(typeof(Worker) !== "undefined") {
	    if ( typeof(w) == "undefined"){ 
	        var w = [];
	        gotThreads = 0;
	        for (var i=0; i < numOfThreads; i++){
	            w[i] = new Worker("js/workerFractal.js"); // Creating threads
	            w[i].postMessage([ canvasHeight, canvasWidth, fractalName , offsetX, panX, offsetY, panY, zoom, value1Iter, value2Iter, maxIterations, palette, rInside, gInside, bInside, i, numOfThreads]); // sending values to thread
	            w[i].onmessage = function( e ) {
		            changeCanvasData( e ); 
	        	}
	        }
	        w = undefined; 
	    }
	} 
	else{
		// No web workers
		chooseFractalAndCalculate();
	}     
    
}

// check is color position is inside or outside gif
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