$(document).bind("mobileinit", function() {
    $.mobile.defaultPageTransition = "slidefade";

});
var ispopupOpen = false;
$(document).on("pageinit", function() {

    $("#popupPanel").on({
        popupbeforeposition: function() {
//            if (localStorage.getItem("selectedmodality") == "CR") {
//                $("#Tbtnwindowlevel").removeClass().addClass("Tbtnwlwwgrey");
//                $("#Tbtnwindowlevel").addClass("ui-content");
//
//            }
            var h = $(window).height();
            var w = $(window).width();
            var panelWidth = $("#lengthcalc").width();
            var panelHeight = $("#lengthcalc").height();
            $("#popupPanel").css("height", (panelHeight));
            $("#popupPanel").css("width", panelWidth);
            //$( "#popupPanel" ).css('top', diffrentHeight);
            //            $(this).parent().css('margin-left', '10px');
//            $(this).parent().css('margin-right', '12px');
//           $('#popupPanel .ui-icon').css('top', '25%');
        }
    });
    $("#popupclick").bind("click", function() {
        ispopupOpen = true;
    });
    $("#popupPanel button").on("click", function() {
        $("#popupPanel").popup('close');
        clearDrawCanvas();
        ispopupOpen = false;
        $("#popupPanel").popup('close');
    });

});
var presetData;
$(document).ready(function() {
    
    $("#popupPanel button").on("click", function() {
        $("#popupPanel").popup('close');
        clearDrawCanvas();
        ispopupOpen = false;
        $("#popupPanel").popup('close');
    });
    //document.getElementById("Tbtnclose").setAttribute("disabled","true") 
//    $("#ivbtnback").click(function() {
//        window.location = "series.html";
//    });
    presetData = function presetData() {
        $("#popupPanel").popup('close');
        ispopupOpen = false;
        setTimeout(function() {
            $('#popupPanelmm').popup('open');
            var j = parseInt($(document).width() * 0.8);
            $("#popupPanelmm-popup").css("left", "0");
//            $("#popupPanelmm-popup").css({"margin-left": j, "padding-left": 0});
        }, 600);
        $('#popupPanelmm').popup('close');
    }

//    $("#popupPanel-popup").css('bottom', '0 !important');
//    $("#popupPanel-popup").css('top',  'auto !important');
    
});
function closeToolbar() {
    $("#popupPanel").popup('close');
    ispopupOpen = false;
}
// $( "#popupclick1" ).on( "click", function() { 
//        $( "#popupPanel" ).popup('open');
//        ispopupOpen=false;
//    });
