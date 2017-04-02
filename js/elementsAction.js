$(document).ready(function(){

    $(document).on("change", $("input[range][id='maxIterationsInput']"), function(){
        // seting maxIterations value for fractals
        maxIterations = parseInt( maxIterationsOutput.value );
        
    });
    
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
    
    $('input[name="colorPositionName"]').on("change", function(){
        colorPosition =  $('input[name="colorPositionName"]:checked').val(); // outside or inside
        if (colorPosition == "outside"){
            colorPositionOutside = true;
        }
        else{
            colorPositionOutside = false;
        }
    });
    
    
});