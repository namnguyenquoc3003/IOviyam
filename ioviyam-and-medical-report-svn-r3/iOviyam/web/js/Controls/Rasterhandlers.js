var mouseLocX, mouseLocY, mouseLocX1, mouseLocY1;
var wlmovex = function(e) {
    e.preventDefault();
    var evt = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    mousePressed = 1;
//    if (imageLoaded == 1) {
    mouseLocX = evt.pageX - canvas.offsetLeft;
    mouseLocY = evt.pageY - canvas.offsetTop;
//    }
}
var wlendx = function(e) {
    e.preventDefault();
    var evt = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    mousePressed = 0;
}
var wlstartx = function(e) {
    e.preventDefault();
    var evt = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    try
    {
        if (imageLoaded == 1)
        {
            mouseLocX1 = evt.pageX - canvas.offsetLeft;
            mouseLocY1 = evt.pageY - canvas.offsetTop;
//            if (mouseLocX1 >= 0 && mouseLocY1 >= 0 && mouseLocX1 < column && mouseLocY1 < row)
//            {
            showHUvalue(mouseLocX1, mouseLocY1);
//            if (mousePressed == 1) {
            imageLoaded = 0;
            var diffX = mouseLocX1 - mouseLocX;
            var diffY = mouseLocY - mouseLocY1;
            wc = parseInt(wc) + diffY;
            ww = parseInt(ww) + diffX;
            showWindowingValue(wc, ww);
            if (ww < 1) {
                ww = 1;
            }
            //lookupObj.setWindowingdata(wc, ww);
            counti++;
            genImagex1(wc, ww);
            mouseLocX = mouseLocX1
            mouseLocY = mouseLocY1;
            imageLoaded = 1;
//            }
//            }
        }
    }
    catch (err)
    {
        console.log("error" + err);
    }
}



var wlmovey = function(e) {
//    e.preventDefault();
    var evt = e;
    mousePressed = 1;
    if (imageLoaded == 1) {

        mouseLocX = evt.pageX - canvas.offsetLeft;
        mouseLocY = evt.pageY - canvas.offsetTop;
    }
}
var wlendy = function(e) {
//    e.preventDefault();
    var evt = e;
    mousePressed = 0;
}
var wlstarty = function(e) {
//    e.preventDefault();
    var evt = e;
    try
    {
        if (imageLoaded == 1)
        {
            mouseLocX1 = evt.pageX - canvas.offsetLeft;
            mouseLocY1 = evt.pageY - canvas.offsetTop;
//            if (mouseLocX1 >= 0 && mouseLocY1 >= 0 && mouseLocX1 < column && mouseLocY1 < row)
//            {   
            showHUvalue(mouseLocX1, mouseLocY1);
            if (mousePressed == 1) {
                imageLoaded = 0;
                var diffX = mouseLocX1 - mouseLocX;
                var diffY = mouseLocY - mouseLocY1;
                wc = parseInt(wc) + diffY;
                ww = parseInt(ww) + diffX;
                showWindowingValue(wc, ww);
//                    lookupObj.setWindowingdata(wc, ww);
                counti++;
                if (ww < 1) {
                    ww = 1;
                }
                genImagex1(wc, ww);
                mouseLocX = mouseLocX1
                mouseLocY = mouseLocY1;
                imageLoaded = 1;
            }
//            }
        }
    }
    catch (err)
    {
        console.log("error" + err);
    }
}

function msgLoading() {
    $.mobile.loadingMessageTheme = 'a';
    $.mobile.loadingMessageTextVisible = true;
    $.mobile.loadingMessage = "Loading...";
}

function wlstartit() {
//    closeToolbar();
    if (windowleveling) {
//        msgLoading();
//        $('.cell').css("background-color", " #171616");
//        $('#Tbtnwindowlevel').css("background-color", "#1e5799");
        bindwlwc();
        addEventInArray("wlwc");
        closeToolbar();
        return false;
    }
}
var wlwcControl = function(e) {
    //alert("called");
    window.setTimeout(closeToolbar, 50);
//    $.mobile.loading("show", {
//        text: "Wait....",
//        textVisible: true,
//        theme: "b",
//        html: ""
//    });
//    msgLoading();
    window.setTimeout(wlstartit, 50);
    e.preventDefault();

}
function loopchangenxt() {
    touchval = true;
    if (imgindex == imagearray.length - 1) {
        imgindex = 0;
    } else {
        imgindex++;
    }
    imageChange(imgindex);
    //console.log("loop array ..."+looparrayval[imgindex]);
    if (tagData[0]['frametime'] != undefined) {
        intervelnxt = setTimeout(loopchangenxt, loopval);
        // console.log(",,,,,,frame time");
    } else if (tagData[0]['frametimevector'] != undefined) {
        intervelnxt = setTimeout(loopchangenxt, looparrayval[imgindex]);
        //console.log(",,,,,,frame vector");
    } else {
        intervelnxt = setTimeout(loopchangenxt, 200);
        //console.log(",,,,,,frame normal");
    }
}
function backloop() {
    touchval = true;
    if (0 == imgindex) {
        imgindex = imagearray.length - 1;
    } else {
        imgindex--;
    }
    imageChange(imgindex);

    //console.log("loop array ..."+looparrayval.length+"...."+loopval);

    if (tagData[0]['frametime'] != undefined) {
        intervelback = setTimeout(backloop, loopval);
    } else if (tagData[0]['frametimevector'] != undefined) {
        intervelback = setTimeout(backloop, looparrayval[imgindex]);
    } else {
        intervelback = setTimeout(backloop, 200);
    }

}
var resettool = function(e) {
    $('.cell').css("background-color", " #171616");
    $('#Tbtnreset').css("background-color", "#1e5799");
    e.preventDefault();
    resetCanvas();
    closeToolbar();
    return false;
}
var inverthandler = function(e) {
    $('.cell').css("background-color", " #171616");
    $('#Tbtninvert').css("background-color", "#1e5799");
    e.preventDefault();
    addEventInArray("invert");
    invertcanvasdata();
    closeToolbar();
    return false;
}
var flipV = function(e) {
    $('.cell').css("background-color", " #171616");
    $('#Tbtnflipver').css("background-color", "#1e5799");
    e.preventDefault();
    addEventInArray("flipV");
    flipvertical();
    closeToolbar();
    return false;
}
var flipH = function(e) {
    $('.cell').css("background-color", " #171616");
    $('#Tbtnfliphori').css("background-color", "#1e5799");
    e.preventDefault();
    addEventInArray("flipH");
    fliphori();
    closeToolbar();
    return false;
}
var rotateR = function(e) {
    $('.cell').css("background-color", " #171616");
    $('#Tbtnrotater').css("background-color", "#1e5799");
    e.preventDefault();
    addEventInArray("rotateR");
    rotateright();
    closeToolbar();
    return false;
}
var rotateL = function(e) {
    $('.cell').css("background-color", " #171616");
    $('#Tbtnrotatel').css("background-color", "#1e5799");
    e.preventDefault();
    addEventInArray("rotateL");
    rotateleft();
    closeToolbar();
    return false;
}
textOverlay = function(e) {
    //alert("....texthide textOverlay....");
    $('.cell').css("background-color", " #171616");
    $('#Tbtntextovly').css("background-color", "#1e5799");
    e.preventDefault();
    texthide();
    closeToolbar();
    return false;
}
var lineTool = function(e) {
    $('.cell').css("background-color", " #171616");
    $('#Tbtnline').css("background-color", "#1e5799");
    e.preventDefault();
    linetool();
    addEventInArray("line");
    closeToolbar();
    return false;
}
var circleTool = function(e) {
    $('.cell').css("background-color", " #171616");
    $('#Tbtncircle').css("background-color", "#1e5799");
    e.preventDefault();
    circle();
    addEventInArray("circle");
    closeToolbar();
    return false;
}
var zoomTool = function(e) {
    $('.cell').css("background-color", " #171616");
    $('#Tbtnzoomdrag').css("background-color", "#1e5799");
    e.preventDefault();
    zoomdrag();
    addEventInArray("zoom");
    closeToolbar();
    return false;
}
var editConfiguration = function(e) {
    // alert("......edit....");
    localStorage.setItem("type", 'edit');
    typedata = "edit";
};
var OrientationFlag = function overlay(Orientationchange) {
    if (Orientationchange) {
        $("#patNameoly").css("margin-top", 0);
        $("#sexoly").css("margin-top", 20);
        $("#modalityoly").css("margin-top", 40);
        $("#studydateoly").css("right", 5);
        $("#studydateoly").css("margin-top", 0);
        $("#thicknewwoly").css("right", 5);
        $("#thicknewwoly").css("margin-top", 20);
        $("#imageoly").css("margin-top", 40);
        $("#imageoly").css("right", 5);
        $("#divtools").css("top", 95);
        $("#divtools").css("right", 3);
        $("#divtools").css("height", 27);
        $("#divtools").css("width", 27);
        $("#studydesceoly").css("bottom", 5);
        $("#wlwcoly").css("bottom", 25);
        $("#seriesdesceoly").css("bottom", 25);
        //  $("#pixelspacingoly").css("bottom", $("#footerview").height()+25);
        $("#resolution").css("right", 5);
        $("#wlwcoly").css("right", 5);
        $("#resolution").css("bottom", 5);
    }
}
var longTouch = function() {
    loopchangenxt();
}
var backLclick = function() {
    backloop();
}
var wlenable = function wlenableControl(data) {
    if (data == '1') {
        $("#Tbtnwindowlevel").removeClass('Tbtnwindowlevels').addClass("btntouchwindowlevels");
        $("#Tbtnzoomdrag").removeClass('btntouchzoom').addClass("Tbtnzoomdrags");
        $("#Tbtnline").removeClass('btntouchline').addClass("Tbtnlines");
        $("#Tbtncircle").removeClass('btntouchcircle').addClass("Tbtncircles");
        $("#divtools").removeClass();
        $("#divtools").addClass("btntouchwindowlevels");
    }
    if (data == '3') {
        $("#Tbtnwindowlevel").removeClass('btntouchwindowlevels').addClass("Tbtnwindowlevels");
        $("#Tbtnzoomdrag").removeClass('btntouchzoom').addClass("Tbtnzoomdrags");
        $("#Tbtnline").removeClass('btntouchline').addClass("Tbtnlines");
        $("#Tbtncircle").removeClass('Tbtncircles').addClass("btntouchcircle");
        $("#divtools").removeClass();
        $("#divtools").addClass("btntouchcircle");
    }
    if (data == '2') {
        $("#Tbtnwindowlevel").removeClass('btntouchwindowlevels').addClass("Tbtnwindowlevels");
        $("#Tbtnzoomdrag").removeClass('btntouchzoom').addClass("Tbtnzoomdrags");
        $("#Tbtnline").removeClass('Tbtnlines').addClass("btntouchline");
        $("#Tbtncircle").removeClass('btntouchcircle').addClass("Tbtncircles");
        $("#divtools").removeClass();
        $("#divtools").addClass("btntouchline");
    }
    if (data == '4') {
        $("#Tbtnwindowlevel").removeClass('btntouchwindowlevels').addClass("Tbtnwindowlevels");
        $("#Tbtnzoomdrag").removeClass('Tbtnzoomdrags').addClass("btntouchzoom");
        $("#Tbtnline").removeClass('btntouchline').addClass("Tbtnlines");
        $("#Tbtncircle").removeClass('btntouchcircle').addClass("Tbtncircles");
        $("#divtools").removeClass();
        $("#divtools").addClass("btntouchzoom");
    }
    if (data == '0') {
        $("#Tbtnwindowlevel").removeClass('btntouchwindowlevels').addClass("Tbtnwindowlevels");
        $("#Tbtnzoomdrag").removeClass('btntouchzoom').addClass("Tbtnzoomdrags");
        $("#Tbtnline").removeClass('btntouchline').addClass("Tbtnlines");
        $("#Tbtncircle").removeClass('btntouchcircle').addClass("Tbtncircles");
        $("#divtools").removeClass();
        //$("#divtools").addClass("btntouchzoom");
    }
}
var touchstinvrt = function touchOnFh(e) {
    wlenable(0);
    $("#Tbtninvert").removeClass('Tbtninverts').addClass("btntouchinvert");
    // console.log("touch start called:");
    $("#Tbtninvert").addClass("btntouchinvert");
    $("#divtools").removeClass();
    // $("#divtools").addClass("btntouchinvert");
}
var touchedinvrt = function touchOnFh(e) {
    $("#Tbtninvert").removeClass('btntouchinvert')
    $("#Tbtninvert").addClass("Tbtninverts");
// alert("touch end called:");
}
//     var flipHtouchs=function touchOnFh(e){
//        $("#Tbtnfliphori").removeClass('Tbtnfliphoris').addClass("btntouchflipver");
//       // console.log("touch start called:");
//    }
//    var flipHtouche=function touchOnFh(e){
//        $("#Tbtnfliphori").removeClass('btntouchflipver').addClass("Tbtnfliphoris");
//       // console.log("touch start called:");
//    }
//    //Tbtnrotatel
var rotatelts = function touchOnFh(e) {
    wlenable(0);
    $("#Tbtnrotatel").removeClass('Tbtnrotaters').addClass("btntouchrotater");
    $("#Tbtnrotatel").addClass("btntouchrotater");
    $("#divtools").removeClass();
    // $("#divtools").addClass("btntouchrotater");
// console.log("touch start called:");
}
var rotatelte = function touchOnFh(e) {
    $("#Tbtnrotatel").removeClass('btntouchrotater').addClass("Tbtnrotaters");
    $("#Tbtnrotatel").addClass("Tbtnrotaters");
// console.log("touch start called:");
}
//Tbtntextovly
var textovlyts = function touchOnFh(e) {
    wlenable(0);
    $("#Tbtntextovly").removeClass('Tbtntextovlys').addClass("btntouchtextovly");
    $("#Tbtntextovly").addClass("btntouchtextovly");
    $("#divtools").removeClass();
    // $("#divtools").addClass("btntouchtextovly");
    texthide();
//closeToolbar();
// console.log("touch start called:");
}
var textovlyte = function touchOnFh(e) {
    $("#Tbtntextovly").removeClass('btntouchtextovly').addClass("Tbtntextovlys");
    $("#Tbtntextovly").addClass("Tbtntextovlys");

// console.log("touch start called:");
}
//Tbtnrotater
var rotaterts = function touchOnFh(e) {
    wlenable(0);
    $("#Tbtnrotater").removeClass('Tbtnrotaters').addClass("btntouchrotater");
    $("#divtools").removeClass();
    // $("#divtools").addClass("btntouchrotater");
// console.log("touch start called:");
}
var rotaterte = function touchOnFh(e) {
    $("#Tbtnrotater").removeClass('btntouchrotater').addClass("Tbtnrotaters");
// console.log("touch start called:");
}
//Tbtnreset
var resetts = function touchOnFh(e) {
    wlenable(0);
    $("#Tbtnreset").removeClass('Tbtnresets').addClass("btntouchreset");
    $("#divtools").removeClass();
    // $("#divtools").addClass("btntouchreset");
// console.log("touch start called:");
}
var resette = function touchOnFh(e) {
    wlenable(0);
    $("#Tbtnreset").removeClass('btntouchreset').addClass("Tbtnresets");
// console.log("touch start called:");
}
//Tbtnfliphori
var fliphorits = function touchOnFh(e) {
    wlenable(0);
    $("#Tbtnfliphori").removeClass('Tbtnfliphoris').addClass("btntouchfliphari");
    $("#divtools").removeClass();
    // $("#divtools").addClass("btntouchfliphari");
// console.log("touch start called:");
}
var fliphorite = function touchOnFh(e) {
    $("#Tbtnfliphori").removeClass('btntouchfliphari').addClass("Tbtnfliphoris");
// console.log("touch start called:");
}
//Tbtnflipver
var flipverts = function touchOnFh(e) {
    wlenable(0);
    $("#Tbtnflipver").removeClass('Tbtnflipvers').addClass("btntouchflipver");
    $("#divtools").removeClass();
    //$("#divtools").addClass("btntouchflipver");
// console.log("touch start called:");
}
var flipverte = function touchOnFh(e) {
    $("#Tbtnflipver").removeClass('btntouchflipver').addClass("Tbtnflipvers");
// console.log("touch start called:");
}
//Tbtnclose
var closets = function touchOnFh(e) {
    wlenable(0);
    $("#Tbtnclose").removeClass('Tbtncloses').addClass("btntouchclose");
    $("#divtools").removeClass();
    // $("#divtools").addClass("btntouchclose");
// console.log("touch start called:");
}
var closete = function touchOnFh(e) {
    $("#Tbtnclose").removeClass('btntouchclose').addClass("Tbtncloses");
// console.log("touch start called:");
}
var seletedradios = function getSelectedRadio() {
    
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var hour = currentDate.getHours();
    var mnts = currentDate.getMinutes();
    // subtract 3 hours
    var newdate = new Date(currentDate);
    newdate.setDate(newdate.getDate() - 1);

    var lastweek = new Date(newdate);
    var newdateyesterday = new Date(currentDate);
    newdateyesterday.setDate(newdateyesterday.getDate() - 7);
    var lastweekdate = new Date(newdateyesterday);
    var newdatemnth = new Date(currentDate);
    newdatemnth.setDate(newdatemnth.getDate() - 30);
    var lastmonthdate = new Date(newdatemnth);
    //console.log("..lastmonth date..."+lastmonthdate.getDate()+"..."+(lastmonthdate.getMonth()+1)+"..."+lastmonthdate.getFullYear());
    var today, yesterday, lastweekdated, lastmonthd, fromdate, todate;
    today = Date.today().toString("yyyy/MM/dd");
    var radioV = ($("#radioField input[type='radio']:checked").val());
    // alert("......checked values in   date picker ........"+radioV);
    if (radioV == '0') {
        $("#studydatetxt").html("Any Date");
        localStorage.setItem("localfromdate", "");
        localStorage.setItem("localtodate", "");
        localStorage.setItem("localfromtime", '000000');
        localStorage.setItem("localtotime", '235900');
    } else
    if (radioV == '1') {
        // alert(day+"/"+month+"/"+year);

        $("#studydatetxt").html("Today");
        localStorage.setItem("localfromdate", today);
        localStorage.setItem("localtodate", today);
        localStorage.setItem("localfromtime", '000000');
        localStorage.setItem("localtotime", '235900');
    } else
    if (radioV == '2') {
        $("#studydatetxt").html("Today AM");
        localStorage.setItem("localfromdate", today);
        localStorage.setItem("localtodate", today);
        localStorage.setItem("localfromtime", '00000');
        localStorage.setItem("localtotime", '115900');
    } else
    if (radioV == '3') {
        $("#studydatetxt").html("Today PM");
        localStorage.setItem("localfromdate", today);
        localStorage.setItem("localtodate", today);
        localStorage.setItem("localfromtime", '000000');
        localStorage.setItem("localtotime", '235900');
    } else
    if (radioV == '4') {
        var subbed = new Date(currentDate - 1 * 60 * 60 * 1000);
        var timedly1hour = Date.parse($.trim(subbed.getHours() + ":" + subbed.getMinutes() + ":" + subbed.getSeconds())).toString("HH:MM:00");
        $("#studydatetxt").html("Last Hour");
        localStorage.setItem("localfromdate", today);
        localStorage.setItem("localtodate", today);
        localStorage.setItem("localfromtime", timedly1hour);
        localStorage.setItem("localtotime", hour + ":" + mnts + ":" + '00');
    } else
    if (radioV == '5') {
        var subbedfour = new Date(currentDate - 4 * 60 * 60 * 1000);
        var timedly4hour = Date.parse($.trim(subbedfour.getHours() + ":" + subbedfour.getMinutes() + ":" + '00')).toString("HH:MM:00");
        $("#studydatetxt").html("Last 4 Hour's");
        localStorage.setItem("localfromdate", today);
        localStorage.setItem("localtodate", today);
        localStorage.setItem("localfromtime", timedly4hour);
        localStorage.setItem("localtotime", hour + ":" + mnts + ":" + '00');
    } else
    if (radioV == '6') {

        var newdate = new Date(currentDate);
        newdate.setDate(newdate.getDate() - 1);
        yesterday = newdate.toString("yyyy/MM/dd");
        $("#studydatetxt").html("Yesterday");
        localStorage.setItem("localfromdate", yesterday);
        localStorage.setItem("localtodate", yesterday);
        localStorage.setItem("localfromtime", '000000');
        localStorage.setItem("localtotime", '235900');
    } else
    if (radioV == '7') {
        var newdate = new Date(currentDate);
        newdate.setDate(newdate.getDate() - 7);
        lastweekdated = newdate.toString("yyyy/MM/dd");
        $("#studydatetxt").html("Last Week");
        localStorage.setItem("localfromdate", lastweekdated);
        localStorage.setItem("localtodate", today);
        // console.log("..lastweek..."+lastweekdated);
        localStorage.setItem("localfromtime", '000000');
        localStorage.setItem("localtotime", '235900');
    } else
    if (radioV == '8') {
        var newdate = new Date(currentDate);
        newdate.setDate(newdate.getDate() - 30);
        lastmonthd = newdate.toString("yyyy/MM/dd");
        $("#studydatetxt").html("Last Month");
        localStorage.setItem("localfromdate", lastmonthd);
        localStorage.setItem("localtodate", today);
        localStorage.setItem("localfromtime", '000000');
        localStorage.setItem("localtotime", '235900');
        // console.log("..lastmonth..."+lastmonthd);
    } else
    if (radioV == 'custom') {
        var datevalfrom = Date.parse($.trim($("#test_defaulta").val())).toString("yyyy/MM/dd");
        var datevalto = Date.parse($.trim($("#test_default1").val())).toString("yyyy/MM/dd");
        localStorage.setItem("localfromdate", datevalfrom);
        localStorage.setItem("localtodate", datevalto);
        localStorage.setItem("localfromtime", '000000');
        localStorage.setItem("localtotime", '235900');
        $("#studydatetxt").html(datevalfrom + "-" + datevalto);
    }
}
var studylevelquery = function touchOnFh(e) {
    //    alert("...."+localStorage.getItem("localfromdate"));
    if (localStorage.getItem("localfromdate") == null && localStorage.getItem("localtodate") == null) {
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
//        var today = Date.parse($.trim(day + "/" + month + "/" + year)).toString("yyyy/MM/dd");
        var today = Date.today().toString("yyyy/MM/dd");

        localStorage.setItem("localfromdate", today);
        localStorage.setItem("localtodate", today);
        localStorage.setItem("localfromtime", '000000');
        localStorage.setItem("localtotime", '235900');
    }
    // alert("study clicked");
    localStorage.setItem("localpatid", $.trim($("#patidtxt").val()));
    localStorage.setItem("localpatname", $.trim($("#patnametxt").val()));
    localStorage.setItem("localaccno", $.trim($("#accnotxt").val()));
    //   birthdatetxt
    var datevalto = "";
    //alert("..."+$.trim($("#birthdatetxt").val()));
    if ($.trim($("#test_default").val()) != "" && $.trim($("#test_default").val()) != null) {
        datevalto = Date.parse($.trim($("#test_default").val())).toString("yyyy/MM/dd");
    }
    // alert($("#test_default").val()+"..."+datevalto);
    localStorage.setItem("localbirthdate", datevalto);
    $.mobile.changePage("#Patientpage");
//    window.location = "patient.html"
};
var defaultbtn = function() {
    applyPreset(1);
};
var abdomenbtn = function() {
    applyPreset(2);
};
var lungbtn = function() {
    applyPreset(3);
};
var brainbtn = function() {
    applyPreset(4);
};
var bonebtn = function() {
    applyPreset(5);
};
var headneckbtn = function() {
    applyPreset(6);
};

    