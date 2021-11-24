/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var stageheight, overlay, canvas, imagearray, textOverlay, intervel, intervelback, intervelnxt, imgindex = 0, imageChange, stagewidth, leftview, canvasImgdata, nativerow, nativecoloum, diffrentHeight, addEventInArray, loadPixel;
var timer;
var windowleveling = true;
var bottomval = 400;
var currentzoom = 1;
var dragtool = false;
var zoomflag = false;
var wlwwflage = false;
var nxttouch = true;
var fliphoriv = true;
var rotateleftclr = true;
var wlwcenable = true;
var tagData;
var loopval = "";
var looparrayval;
var objects, sopClassUID;
var toolEvent = [], multiframeObject = false;
$(document).ready(function() {
    if (localStorage.getItem("selectedmodality") == "CT" || localStorage.getItem("selectedmodality") == "CR" || localStorage.getItem("selectedmodality") == "MR" || localStorage.getItem("selectedmodality") == "DX" || localStorage.getItem("selectedmodality") == "NM") {
        windowleveling = true;
        $("#Tbtnwindowlevel").removeClass('Tbtnnowl').addClass("Tbtnwindowlevels");

    } else {
        windowleveling = false;
    }
    if (localStorage.getItem("studyid") == undefined || localStorage.getItem("studyid") == null) {
        $.mobile.changePage("home.html");
    }
    var canRow = "500";
    var canColumn = "500";
    var objects = new Array();
    canvas = document.getElementById('imgcanvas');
    overlay = document.getElementById('overlayc');
    var imageObj = new Image();
    var bodypart = localStorage.getItem("ibodypart");
    var bodypartcombine = bodypart.split(",");
    var sex = localStorage.getItem("isex");
    var sercombine = sex.split(",");
    var DELAY = 500,
            clicks = 0,
            timer = null;
    var touchval = false;
    var orien = false;

    $.post("image.do", {
        "patientId": localStorage.getItem("patid"),
        "studyUID": localStorage.getItem("studyid"),
        "seriesUID": localStorage.getItem("seriesid")
//        ,
//        "ae":localStorage.getItem("aetitle"),
//        "host":localStorage.getItem("hostname"),
//        "port":localStorage.getItem("port"),
//        "wado":localStorage.getItem("wado")
    }, function(data) {

//        console.log($.parseJSON(data));

        tagData = new Array();
        tagData = $.parseJSON(data);
        loadtmpimages();
        init();
        alterpage();
    });
    $("#imgcanvas").rasterDrag();
    zoombind();
    $("#nxtbtn").click(function() {
        clearTimeout(intervel);
        nextImage();
    });
    $('#backbtns').click(function() {
        clearTimeout(intervel);
        if (0 == imgindex) {
            imgindex = imagearray.length - 1;
        } else {
            imgindex--;
        }
        imageChange(imgindex);
    });
    $("#nxtbtn").live("click", function(e) {
        clicks++;  //count clicks
        if (clicks === 1) {
            // clearTimeout(intervel);
            timer = setTimeout(function() {
                //  nextImage(); //perform single-click action    
                clicks = 0;             //after action performed, reset counter
            }, DELAY);
        } else {
            clearTimeout(timer);    //prevent single-click action
            loopchange();
            //perform double-click action
            clicks = 0;             //after action perforSRmed, reset counter
        }
    }).live("dblclick", function(e) {
        e.preventDefault();  //cancel system double-click event
    });
    $("#nxtbtn").bind("taphold", longTouch);
    $("#backbtns").bind("taphold", backLclick);
    $('#nxtbtn').bind('touchend', function() {
        clearTimeout(intervelnxt);
        touchval = false;
    });
    $('#backbtns').bind('touchend', function() {
        clearTimeout(intervelback);
        touchval = false;
    });
    $("#Tbtnclose").bind("touchstart", closets);
    $("#Tbtnclose").bind("touchend", closete);
    $("#Tbtnflipver").bind("touchstart", flipverts);
    $("#Tbtnflipver").bind("touchend", flipverte);
    $("#Tbtnfliphori").bind("touchstart", fliphorits);
    $("#Tbtnfliphori").bind("touchend", fliphorite);
    $("#Tbtnreset").bind("touchstart", resetts);
    $("#Tbtnreset").bind("touchend", resette);
    $("#Tbtnrotater").bind("touchstart", rotaterts);
    $("#Tbtnrotater").bind("touchend", rotaterte);
    $("#Tbtntextovly").bind("touchstart", textovlyts);
    $("#Tbtntextovly").bind("touchend", textovlyte);
    $("#Tbtnrotatel").bind("touchstart", rotatelts);
    $("#Tbtnrotatel").bind("touchend", rotatelte);
    //    $("#Tbtnfliphori").bind("touchstart",flipHtouchs);
    //    $("#Tbtnfliphori").bind("touchend",flipHtouche);
    $("#Tbtninvert").bind("touchstart", touchstinvrt);
    $("#Tbtninvert").bind("touchend", touchedinvrt);

    $("#btndefault").bind("click", defaultbtn);
    $("#btnabdomen").bind("click", abdomenbtn);
    $("#btnlung").bind("click", lungbtn);
    $("#btnbrain").bind("click", brainbtn);
    $("#btnbone").bind("click", bonebtn);
    $("#btnheadneck").bind("click", headneckbtn);


    function loopchange() {
        touchval = true;
        if (imgindex == imagearray.length - 1) {
            imgindex = 0;
        } else {
            imgindex++;
        }
        imageChange(imgindex);
        if (tagData[0]['frametime'] != undefined) {
            intervel = setTimeout(loopchange, loopval);
        } else if (tagData[0]['frametimevector'] != undefined) {
            intervel = setTimeout(loopchange, looparrayval[imgindex]);
        } else {
            intervel = setTimeout(loopchange, 200);
        }
    }
    function nextImage() {
        if (imgindex == imagearray.length - 1) {
            imgindex = 0;
        } else {
            imgindex++;
        }
        imageChange(imgindex);
    }
    $(window).bind('orientationchange', function() {
        orien = true;
        //  alert("...................."+dragtool);
        // $("#wrap").rasterDrag();
        if (!dragtool) {
            $("#imgcanvas").rasterDrag();
        }
        alterpage();
        clearCanvasData();
    });
    function alterpage()
    {
        resizewindow();
        overlaychange();
        if (orien) {
            orien = false;
            loadImage(imagearray[imgindex]);
        }
        resizeTools();
    }
    function fastDownload() {
        objects = new Array();
        var stringData = localStorage.getItem("serieLoadArray");
        objects = stringData.split(",");
        var n = objects.length;
        var nbResponses = 0;
        var t0 = new Date().getTime();
        var i = 0;
        var fastObject = new Array();
        while (i < n) {
            var xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.open("get", objects[i] + "&framedata=Empty", true);
            xmlHttpRequest.responseType = "blob";
            new function(i) {
                xmlHttpRequest.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var blob = this.response;
                        var img = document.createElement('img');
                        img.onload = function(e) {
                            window.URL.revokeObjectURL(img.src); // Clean up after yourself.
                        };
                        img.src = window.URL.createObjectURL(blob);
                        fastObject.push(img);
//                        console.log("_______________________" + fastObject.length);
                        nbResponses++;
                    }
                };
            }(i);
            xmlHttpRequest.send();
            i++;
        }
    }
    function loadtmpimages() {
//        fastDownload();
        objects = new Array();
        var stringData = localStorage.getItem("serieLoadArray");
        objects = stringData.split(",");
        //  console.log("..............frames...."+objects);
//        console.log("________________________________");
//        console.log(tagData);
//        console.log("________________________________");
//
        if (tagData[0]['numberofframes'] == "Empty") {

            if (objects.length == 1) {
                $("#foottable").hide();
            } else {
                $("#foottable").show();
            }
            $("#imgSlider").attr('min', 0);
            $("#imgSlider").attr('max', objects.length - 1);
            $("#imgSlider").attr('step', 1);
            loadfirstImage(objects[0] + "&framedata=Empty");
        } else {
            if (tagData[0]['numberofframes'] == 1) {
                $("#foottable").hide();
            } else {
                $("#foottable").show();
            }
            $("#imgSlider").attr('min', 0);
            $("#imgSlider").attr('max', tagData[0]['numberofframes']);
            $("#imgSlider").attr('step', 1);
            loadfirstImage(objects[0] + "&framedata=" + 1);
            // console.log("......"+tagData[0]['frametime']+"..frame time vector.."+tagData[0]['frametimevector']);
            if (tagData[0]['frametime'] != undefined) {
                loopval = (1000 / parseInt(tagData[0]['frametime']));
            } else if (tagData[0]['frametimevector'] != undefined) {
                looparrayval = new Array();
                looparrayval = (tagData[0]['frametimevector']);
            }
        }
        //console.log(tagData.toString()+"...");
        $("#tmpimage").html("");

        if (localStorage.getItem("selectedmodality") == "SR") {
            for (var i = 0; i < objects.length; i++) {
                var url = objects[i] + "&framedata=Empty" + "&rowsn=" + 500 + "&coloumns=" + 500 + "&type=jpg";

                $.ajax({url: url, success: function(result) {
                        var iframe = document.getElementById('iframe_sr'),
                                iframedoc = iframe.contentDocument || iframe.contentWindow.document;
                        iframedoc.body.innerHTML = result;
                        texthide();

                        $("#iframe_sr").css("background-color", "white");
                        $("#imgcanvas").hide();
                        $("#iframe_sr").show();

                    }});
            }
            return;
        } else {
            $("#iframe_sr").css("background-color", "black");
            $("#imgcanvas").show();
            $("#iframe_sr").hide();
        }

        if (tagData[0]['numberofframes'] == "Empty") {
            multiframeObject = false;
            for (var i = 0; i < objects.length; i++) {
                if (typeof tagData[i]['nativeRows'] === "undefined" || typeof tagData[i]['nativeColumns'] === "undefined") {
                    tagData[i]['nativeColumns'] = 512;
                    tagData[i]['nativeRows'] = 512;
                }
                if (tagData[i]['nativeRows'] > 700 || tagData[i]['nativeColumns'] > 700) {
                    $("#tmpimage").append("<img src='" + objects[i] + "&framedata=Empty" + "&rowsn=" + 50 + "&coloumns=" + 50 + "&type=jpg" + "'/>");
                } else {
                    $("#tmpimage").append("<img src='" + objects[i] + "&framedata=Empty" + "&rowsn=" + tagData[i]['nativeRows'] + "&coloumns=" + tagData[i]['nativeColumns'] + "&type=jpg" + "'/>");
                }
            }
        } else {
            for (var i = 0; i < parseInt(tagData[0]['numberofframes']); i++) {
                multiframeObject = true;
                $("#tmpimage").append("<img src='" + objects[0] + "&framedata=" + i + "&rowsn=" + 512 + "&coloumns=" + 512 + "&type=jpg" + "'/>");
            }
        }
    }
    function init() {
        imagearray = new Array();
        $('#tmpimage').children('img').each(function() {
            imagearray.push($(this).get(0));
        });
    }
    function clearDrawCanvas() {
        var jcanvas = document.getElementById('overlayc');
        var cxt = jcanvas.getContext('2d');
        cxt.clearRect(0, 0, jcanvas.width, jcanvas.height);
    }
    function loadImage(imageObj) {
        var jcanvas = document.getElementById('imgcanvas');
        var cxt = jcanvas.getContext('2d');
        cxt.clearRect(0, 0, jcanvas.width, jcanvas.height);
        try {
            if (nativerow > 900 || nativecoloum > 900) {
                nativecoloum = 500;
                nativerow = 500;
            }
            var jcanvas = document.getElementById('imgcanvas');
            var cxt = jcanvas.getContext('2d');
            cxt.drawImage(imageObj, 0, 0, nativerow, nativecoloum);
            //alert("...load  image..."+jcanvas.width+".."+jcanvas.height);
        } catch (err) {
            console.log("...." + err);
        }
        clearDrawCanvas();
    }
    function loadfirstImage(src) {
        $("#pixelspacingoly").html(tagData[imgindex]['pixelSpacing']);
        var wc = tagData[imgindex]['windowCenter'].split("|");
        var ww = tagData[imgindex]['windowWidth'].split("|");
        $("#wlwcoly").html("WC:" + wc[0] + ":" + "WW:" + ww[0]);
        nativerow = tagData[imgindex]['nativeRows'];
        nativecoloum = tagData[imgindex]['nativeColumns'];
        nativerow1 = tagData[imgindex]['nativeRows'];
        nativecoloum1 = tagData[imgindex]['nativeColumns'];
        $("#resolution").html("Size:" + "" + tagData[imgindex]['nativeRows'] + "x" + tagData[imgindex]['nativeColumns']);
        if (nativerow > 700 || nativecoloum > 700) {
            nativecoloum = 500;
            nativerow = 500;
        }

        var jcanvas = document.getElementById('imgcanvas');
        jcanvas.width = nativerow;
        jcanvas.height = nativecoloum;
        var cxt = jcanvas.getContext('2d');
        var imageObj = new Image();
        // alert("native row:///"+nativerow+"..."+nativecoloum+"canrow:.."+canRow+"canColoums:."+canColumn);
        imageObj.onload = function() {
            // imageObj.height(500);
            cxt.drawImage(imageObj, 0, 0, nativerow, nativecoloum);
        };
        //console.log("...."+src+"&rowsn"+nativerow+"&coloumns"+nativecoloum);
        imageObj.src = src + "&rowsn=" + nativerow + "&coloumns=" + nativecoloum + "&type=jpg";
    }
    $("#imgSlider").change(function(event) {
        clearDrawCanvas();
        resetWl();
        $("#Tbtnclose").removeClass('Tbtncloses');
        $("#Tbtnclose").addClass("Tbtnclosegrey");
        $("#Tbtnwindowlevel").removeClass('Tbtncloses');
        $("#Tbtnwindowlevel").addClass("Tbtnwindowlevels");
        imgindex = $(this).val();
        var img = (parseInt(imgindex) + 1);
        if (tagData[0]['numberofframes'] == "Empty") {
            //imgindex=imgindex+1;
            $("#imageoly").html("Image:" + (img) + "/" + parseInt((bodypartcombine[2])));
            var sliceThickness = tagData[imgindex]['sliceThickness'] == "" ? "" : "T:" + " " + tagData[imgindex]['sliceThickness'] + ":mm";
            var sliceLocation = tagData[imgindex]['sliceLocation'] == "" ? "" : "L:" + Math.round(tagData[imgindex]['sliceLocation']);
            console.log(tagData[imgindex]['sliceThickness']+'01');
            console.log(tagData[imgindex]['sliceLocation']+'02');
            $("#thicknewwoly").html(sliceThickness + " " + sliceLocation);
            $("#pixelspacingoly").html(tagData[imgindex]['pixelSpacing']);
            var wc = tagData[imgindex]['windowCenter'].split("|");
            var ww = tagData[imgindex]['windowWidth'].split("|");
            $("#wlwcoly").html("WC:" + wc[0] + ":" + "WW:" + ww[0]);
            nativerow = tagData[imgindex]['nativeRows'];
            nativecoloum = tagData[imgindex]['nativeColumns'];
            nativerow1 = tagData[imgindex]['nativeRows'];
            nativecoloum1 = tagData[imgindex]['nativeColumns'];
            $("#resolution").html("size:" + "" + tagData[imgindex]['nativeRows'] + "x" + tagData[imgindex]['nativeColumns']);
            loadImage(imagearray[imgindex]);
        }
        else {
            $("#imageoly").html("Image:" + (img) + "/" + tagData[0]['numberofframes']);
            loadImage(imagearray[imgindex]);
        }
    });
    imageChange = function imageChanger(imgindex) {

        resetWl();
        var img = (parseInt(imgindex) + 1);
        $("#imgSlider").val(imgindex).slider("refresh");
        if (tagData[0]['numberofframes'] == "Empty") {
            //imgindex=imgindex+1;
            $("#imageoly").html("Image:" + (img) + "/" + parseInt((bodypartcombine[2])));
            
            var sliceThickness = tagData[imgindex]['sliceThickness'] == "" ? "" : "T:" + " " + tagData[imgindex]['sliceThickness'] + ":mm";
            var sliceLocation = tagData[imgindex]['sliceLocation'] == "" ? "" : "L:" + Math.round(tagData[imgindex]['sliceLocation']);
            $("#thicknewwoly").html(sliceThickness + " " + sliceLocation);
            $("#pixelspacingoly").html(tagData[imgindex]['pixelSpacing']);
            var wc = tagData[imgindex]['windowCenter'].split("|");
            var ww = tagData[imgindex]['windowWidth'].split("|");
            $("#wlwcoly").html("WC:" + wc[0] + ":" + "WW:" + ww[0]);
            nativerow = tagData[imgindex]['nativeRows'];
            nativecoloum = tagData[imgindex]['nativeColumns'];
            nativerow1 = tagData[imgindex]['nativeRows'];
            nativecoloum1 = tagData[imgindex]['nativeColumns'];
            sopClassUID = tagData[imgindex]['sopclassUID'];


            $("#resolution").html("Size:" + "" + tagData[imgindex]['nativeRows'] + "x" + tagData[imgindex]['nativeColumns']);
            loadImage(imagearray[imgindex]);
        } else {
            $("#imageoly").html("Image:" + (img) + "/" + tagData[0]['numberofframes']);
            loadImage(imagearray[imgindex]);
        }
    }
    $("#popupclick1").click(function() {
        $("#slidecont").show();
    });
    $("#Tbtnflipver").click(flipV);
    $("#Tbtnfliphori").click(flipH);
    $("#Tbtnrotater").click(rotateR);
    $("#Tbtnrotatel").click(rotateL);
    $("#Tbtninvert").click(inverthandler);
    $("#Tbtnline").click(lineTool);
    $("#Tbtncircle").click(circleTool);
    $("#Tbtnzoomdrag").click(zoomTool);
    $("#Tbtnreset").click(resettool);

    $("#Tbtnwindowlevel").click(wlwcControl);

    addEventInArray = function addEventInArray(eventName) {
        toolEvent = [];
        toolEvent.push(eventName);
    }
    loadPixel = function  loadDicomImage(flag) {
        if (flag) {
            if (multiframeObject) {
                loadDicom(objects[0] + "&frameNumber=" + imgindex, nativerow1, nativecoloum1);
            } else {
                loadDicom(objects[imgindex], nativerow1, nativecoloum1);
            }
        }
    }
    function resizeTools() {
        var i = 0;
        if (toolEvent[0] == 'invert') {
            addEventInArray("invert");
            invertcanvasdata();
            closeToolbar();
        }
        if (toolEvent[0] == 'flipV') {
            flipvertical();
        }
        if (toolEvent[0] == 'flipH') {
            fliphori();
        }
        if (toolEvent[0] == 'rotateR') {
            rotateright();
        }
        if (toolEvent[0] == 'rotateL') {
            rotateleft();
        }
        if (toolEvent[0] == 'line') {
            linetool();
        }
        if (toolEvent[0] == 'circle') {
            circle();
        }
        if (toolEvent[0] == 'zoom') {
            zoomdrag();
        }
        if (toolEvent[0] == 'wlwc') {
            bindwlwc();
        }
    }
    function removeAllTools() {
        toolEvent = [];
    }
    $("#footerSlider").children("div").css("background", "rgba(255, 255, 255, 0)");
    $("#footerSlider").children("div").css("width", "100%");
    function overlaychange() {
        OrientationFlag(true);
        if (localStorage.getItem("pat_name_permnant") != 'undefined') {
            $("#patNameoly").html(localStorage.getItem("pat_name_permnant"));
        }
        if (sercombine[0] != 'undefined') {
            $("#sexoly").html("" + " " + sercombine[0]);
        }
        if (localStorage.getItem("selectedmodality") != 'undefined') {
            $("#modalityoly").html("" + " " + localStorage.getItem("selectedmodality"));
        }
        if (sercombine[1] != 'undefined') {
            $("#studydateoly").html(sercombine[1]);
        }
        if (localStorage.getItem("istudydesc") != 'undefined') {
            $("#studydesceoly").html(localStorage.getItem("istudydesc"));
        }
        if (bodypartcombine[1] != 'undefined') {
            $("#seriesdesceoly").html(bodypartcombine[1]);
        }
        if (bodypartcombine[0] != 'undefined') {
            $("#bodypartoly").html(bodypartcombine[0]);
        }
        if (bodypartcombine[2] != 'undefined') {
            //$("#thicknewwoly").html(bodypartcombine[2]+":mm");
            $("#thicknewwoly").html("0:mm");
        }
        if (imgindex != 'undefined' && parseInt((bodypartcombine[2])) != 'undefined') {
            //$("#imageoly").html("Image:"+((imgindex+1))+"/"+parseInt((bodypartcombine[2])));
            //imgindex=$(this).val ();
            $("#imageoly").html("Image:" + (imgindex + 1) + "/" + parseInt((bodypartcombine[2])));
            var sliceThickness = tagData[imgindex]['sliceThickness'] == "" ? "" : "T:" + " " + tagData[imgindex]['sliceThickness'] + ":mm";
            var sliceLocation = tagData[imgindex]['sliceLocation'] == "" ? "" : "L:" + Math.round(tagData[imgindex]['sliceLocation']);
            $("#thicknewwoly").html(sliceThickness + " " + sliceLocation);
            $("#pixelspacingoly").html(tagData[imgindex]['pixelSpacing']);
            var wc = tagData[imgindex]['windowCenter'].split("|");
            var ww = tagData[imgindex]['windowWidth'].split("|");
            $("#wlwcoly").html("WC:" + wc[0] + ":" + "WW:" + ww[0]);
            $("#resolution").html("Size:" + "" + tagData[imgindex]['nativeRows'] + "x" + tagData[imgindex]['nativeColumns']);
        }
    }
});
