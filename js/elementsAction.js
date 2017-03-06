$(document).ready(function(){

    $(document).on("change", $("input[range]"), function() {
        
        //Change color of preview div 
        $("div#colorPreview").css("background", "rgb("+roffsetInputValue.value+","+ 
            goffsetInputValue.value+","+ boffsetInputValue.value+")");
            
    });
    
    
    
    
});