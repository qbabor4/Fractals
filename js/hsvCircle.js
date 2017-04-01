var circleImage = $("#hsvCircle");
var circleRadius = circleImage.width()/2; 
var HSVhue = 235;
var HSVsaturation = 1;
var HSVvalue = 1;
var clicked = false;

circleImage.on("mousedown", function(e) {
        clicked = true;
        changeColor( $(this)[0] ,e );
});

circleImage.on("mousemove", function(e) {
    if (clicked) {
        changeColor( $(this)[0], e );
    }
});

circleImage.on("mouseup", function(e) {
    clicked = false;
});

function changeColor( element, e ){
    var mousePos = getMousePos( element, e ); 
    var distance = getDistanceFromCenter(mousePos.x, mousePos.y);
    var saturation = getSaturation( distance ); // float
    var angle = getAngle(mousePos.x, mousePos.y);
    if ( saturation <= 1) {
        HSVsaturation = saturation;
        HSVhue = angle;
    }
    changeHTMLoutput();
    changePreviewDivColor();
}

function getDistanceFromCenter(mouseX, mouseY){
    var middleX = circleRadius;
    var middleY = circleRadius;
    var triangleBase = Math.abs(middleX - mouseX);
    var triangleHeight = Math.abs(middleY - mouseY);
    var triangleDiagonal = Math.sqrt(triangleBase * triangleBase + triangleHeight * triangleHeight);  
    return triangleDiagonal;
}

function getSaturation( distance ){
    var saturation = ( distance / circleRadius );
    saturation = Math.round( saturation * 100) / 100;
    return saturation;   
}

function getMousePos( element, e ) {
    var rect = element.getBoundingClientRect(); // pozycja x,y lewego,gornego wierzchołka i pozycje na ekranie boków   
    return {
        x: Math.round(( e.clientX - rect.left )/( rect.right - rect.left ) * rect.width ),
        y: Math.round(( e.clientY - rect.top )/( rect.bottom - rect.top ) * rect.height )  
    }
}

function getAngle(mouseX, mouseY){
    var angle = Math.abs(( Math.atan2( mouseY - circleRadius, circleRadius - mouseX ) ) * 180 / 3.14 - 180);
    angle = parseInt((angle + 90) % 360) ;
    return angle;
}

function changeHTMLoutput(){
    $("#hue").text(HSVhue);
    $("#saturation").text(HSVsaturation);
    $("#value").text(HSVvalue);
}

$("#HSVvalueInput").on("change", function() {
    HSVvalue = parseFloat(HSVvalueInput.value);
    changeHSVcircleOpacity();
    changeHTMLoutput();
});

function mix(a, b, v)
{
    return (1-v)*a + v*b;
}

function HSVtoRGB(H, S, V) 
{
    var V2 = V * (1 - S);
    var r  = ((H>=0 && H<=60) || (H>=300 && H<=360)) ? V : ((H>=120 && H<=240) ? V2 : ((H>=60 && H<=120) ? mix(V,V2,(H-60)/60) : ((H>=240 && H<=300) ? mix(V2,V,(H-240)/60) : 0)));
    var g  = (H>=60 && H<=180) ? V : ((H>=240 && H<=360) ? V2 : ((H>=0 && H<=60) ? mix(V2,V,H/60) : ((H>=180 && H<=240) ? mix(V,V2,(H-180)/60) : 0)));
    var b  = (H>=0 && H<=120) ? V2 : ((H>=180 && H<=300) ? V : ((H>=120 && H<=180) ? mix(V2,V,(H-120)/60) : ((H>=300 && H<=360) ? mix(V,V2,(H-300)/60) : 0)));

    return {
        r : Math.round(r * 255),
        g : Math.round(g * 255),
        b : Math.round(b * 255)
    };
}

function changePreviewDivColor(){
    rgbColors = HSVtoRGB(HSVhue, HSVsaturation, HSVvalue);
    $("div#colorPreview").css("background", "rgb("+ rgbColors.r +","+ 
            rgbColors.g +","+  rgbColors.b +")");
}

function changeHSVcircleOpacity(){
    var divOpacity = 1 - HSVvalue;
    $("#blackFilter").css("opacity", divOpacity);
}
