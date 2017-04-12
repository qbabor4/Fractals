$(document).ready(function(){

    $( "input[id='maxIterationsInput']" ).change( function(){
        // seting maxIterations value for fractals
        maxIterations = parseInt( maxIterationsOutput.value );
        greenChageFractalButton();
    });
    
    $( "input[id='value1Input']" ).change( function(){
    	// chnaging variablee for value 1 
        value1Iter = parseFloat( value1Input.value );
        greenChageFractalButton();
    });
    
    $( "input[id='value2Input']" ).change( function(){
        // seting maxIterations value for fractals
        value2Iter = parseFloat( value2Input.value );  
        greenChageFractalButton(); 
    });
    
    
    $( "canvas#myCanvas" ).on( 'mousedown', function(e) {
    	// on left mouse button click draws new fractal zoomed
    	if (e.which == 1){
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
	        drawNewFractalWithGif();
		}
    });
    
    $('input[name="colorPositionName"]').on("change", function(){
    	// sets variable to define if outside colors or inside are changed
        colorPosition =  $('input[name="colorPositionName"]:checked').val(); // outside or inside
        if (colorPosition == "outside"){
            colorPositionOutside = true;
        }
        else{
            colorPositionOutside = false;
        }
    });
    
    setAnimationPosition();
    
});

function setAnimationPosition(){
	// sets new animation position on canvas
	var leftMove = canvasWidth/2 -20+"px"; //Aniamtion is 40X40px
    var topMove = canvasHeight/2 -20+"px";
    // zmieniać wielkość animacji
    $(".sk-cube-grid").css({"top": topMove, "left": leftMove});
}

function greenChageFractalButton(){
	// makes button green
    $("input[id=drawNewFractal]").addClass("greenDiv");      
}
    
function resetChangeFractalButton(){
	// back to normal
    $("input[id=drawNewFractal]").removeClass("greenDiv");
}