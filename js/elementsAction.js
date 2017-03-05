$(document).ready(function(){

    $(document).on("change", $("input[range]"), function() {
        
        // po odswierzeniu value na pasku jest inna niz wartosc na outpucie...
        //Change color of preview div 
        $("div#colorPreview").css("background", "rgb("+roffsetInputValue.value+","+ 
            goffsetInputValue.value+","+ boffsetInputValue.value+")");
            
    });
    
});