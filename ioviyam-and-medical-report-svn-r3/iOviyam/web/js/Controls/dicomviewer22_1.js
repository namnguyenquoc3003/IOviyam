
var wadoURL;
var mouseLocX1;
var mouseLocX2;
var mouseLocY1;
var mouseLocY2;
var wc;
var ww;
var wcenter;
var wwidth;
var rescale_Slope;
var rescale_Intercept;
var lookupTable;
var huLookupTable;
var pixelBuffer = new Array();
var imageLoaded = 0;
var row = 512;
var column = 512;
var canRow = "256";
var canColumn = "256";
var lookupObj;
var mousePressed = 0;
var canvasImgz;
var canvas;
var ctx;
var myImageData;
var counti = 0;
var photometric_Interpretation;
var bits_Stored;
var canvasImg = document.getElementById('imgcanvas');
var invertDicom = false;
var saveLookupDetails = new Store();
String.prototype.replaceAll = function(pcFrom, pcTo) {
    var i = this.indexOf(pcFrom);
    var c = this;
    while (i > -1) {
        c = c.replace(pcFrom, pcTo);
        i = c.indexOf(pcFrom);
    }
    return c;
}
function getBrowserSize() {

//    if(document.documentElement.clientWidth >512 && document.documentElement.clientHeight >512 ){
//        canRow="513";
//        canColumn="513";
//    }else{
//        canColumn = document.documentElement.clientWidth;
//        canRow=canColumn;
//    }       
}
function mouseDownHandler(evt) {
    mousePressed = 1;
    if (imageLoaded == 1) {
        mouseLocX = evt.pageX - canvasImg.offsetLeft;
        mouseLocY = evt.pageY - canvasImg.offsetTop;
//        console.log(mouseLocX +'='+ evt.pageX +'-'+ canvasImg.offsetLeft)
    }
}
function mouseupHandler(evt) {
    mousePressed = 0;
}
function mousemoveHandler(evt) {
    try
    {
        if (imageLoaded == 1)
        {
            mouseLocX1 = evt.pageX - canvasImg.offsetLeft;
            mouseLocY1 = evt.pageY - canvasImg.offsetTop;
            if (mouseLocX1 >= 0 && mouseLocY1 >= 0 && mouseLocX1 < canColumn && mouseLocY1 < canRow)
            {
                showHUvalue(mouseLocX1, mouseLocY1);
                if (mousePressed == 1)
                {
                    imageLoaded = 0;
                    var diffX = mouseLocX1 - mouseLocX;
                    var diffY = mouseLocY - mouseLocY1;
                    wc = parseInt(wc) + diffY;
                    ww = parseInt(ww) + diffX;
                    showWindowingValue(wc, ww);
                    lookupObj.setWindowingdata(wc, ww);
                    counti++;
                    genImage();
                    mouseLocX = mouseLocX1
                    mouseLocY = mouseLocY1;
                    imageLoaded = 1;
                }
            }
        }
    }
    catch (err)
    {
        console.log(err);
    }
}
function changePreset()
{
//applyPreset(parseInt(document.getElementById("menu").options[document.getElementById("menu").selectedIndex].value));

}
function applyPreset(preset)
{
    switch (preset)
    {
        case 1:
            wc = wcenter;
            ww = wwidth;
//            lookupObj.setWindowingdata(wc, ww);
            genImagex1(wc, ww);
            break;

        case 2:
            wc = 350;
            ww = 40;
//            lookupObj.setWindowingdata(wc, ww);
            genImagex1(wc, ww);
            break;

        case 3:
            wc = -600;
            ww = 1500;
//            lookupObj.setWindowingdata(wc, ww);
            genImagex1(wc, ww);
            break;

        case 4:
            wc = 40;
            ww = 80;
//            lookupObj.setWindowingdata(wc, ww);
            genImagex1(wc, ww);
            break;

        case 5:
            wc = 480;
            ww = 2500;
//            lookupObj.setWindowingdata(wc, ww);
            genImagex1(wc, ww);
            break;

        case 6:
            wc = 90;
            ww = 350;
//            lookupObj.setWindowingdata(wc, ww);
            genImagex1(wc, ww);
            break;
    }
}
function showHUvalue(x, y)
{
//                var t=(y*column)+x;		
//                var hupanel=document.getElementById("huDisplayPanel");
//                hupanel.innerHTML="X :"+x+" Y :"+y+" HU :"+huLookupTable[pixelBuffer[t]];
//                $("#wlwcoly").html("WC:WW");

}
function showWindowingValue(wcenter, wwidth)
{
    $("#wlwcoly").html("WC:" + '' + Math.round(wcenter) + ":WW:" + '' + Math.round(wwidth));
}
function loadDicom(wado, imgRow, imgColumn)
{

    row = imgRow;
    column = imgColumn;
    wadoURL = wado;
    parseAndLoadDicom();
}
function getContextPath()
{
    var path = top.location.pathname;
    if (document.all) {
        path = path.replace(/\\/g, "/");
    }
    path = path.substr(0, path.lastIndexOf("/") + 1);
    return path;
}
function drawData(buffer) {
    var bytes = new Uint16Array(buffer, buffer.length);
    var t0 = new Date().getTime();
    try {
        var rgbImage = openjpeg(bytes, "j2k");
    } catch (err) {
        console.log(err);
    }
    console.log('---> openjpeg() total time: ', ((new Date().getTime()) - t0) + 'ms');
    var test1 = rgbImage.data;
    var pixelsPerChannel = rgbImage.width * rgbImage.height;
    var sliceSize = pixelsPerChannel;
    var int8buffer = new Int16Array(sliceSize);
    var k = 0;
    for (var p = 0; p < sliceSize; ++p) {
        int8buffer[p] = 256 * test1[k] + test1[k + 1];
        k += 2;
    }
    return int8buffer;
}
var file;

function getMinMax(storedPixelData)
{
    // we always calculate the min max values since they are not always
    // present in DICOM and we don't want to trust them anyway as cornerstone
    // depends on us providing reliable values for these
    var min = 65535;
    var max = -32768;
    var numPixels = storedPixelData.length;
    var pixelData = storedPixelData;
    for (var index = 0; index < numPixels; index++) {
        var spv = pixelData[index];
        // TODO: test to see if it is faster to use conditional here rather than calling min/max functions
        min = Math.min(min, spv);
        max = Math.max(max, spv);
    }

    return {
        min: min,
        max: max
    };
}
var dataOperation, canvasTMP, tmpctx;

function parseAndLoadDicom()
{
//    var parsedFile = getURLdata(wadoURL + "&type=dicom");
    var local = new Store();
    if (local.localFind(wadoURL) !== "undefined") {
        loadDicomProcess(local.returnImage(wadoURL), true);
    } else {

        $.mobile.loading("show", {
            text: "Wait....",
            textVisible: true,
            theme: "b",
            html: ""
        });

        var byteArray;
        worker.postMessage({'cmd': '1', 'data': wadoURL});
        worker.onmessage = function(e) {
            byteArray = e.data;
          
            var parser = new DicomParser1(byteArray.data);
            var file = parser.parse_file();
            local.save(file, wadoURL);
            $.mobile.loading("hide");
            
            loadDicomProcess(file, false);
        };
    }
}
var imageObjectDatas, invert_photo = false;
function loadDicomProcess(fileObject, local) {
    myImageData = "";
    dataOperation = new RasterImageWriter("imgcanvas", fileObject);
    dataOperation.fillValues();
    dataOperation.calWWWC();
    imageObjectDatas = dataOperation.imageObject;
    if ($.trim(imageObjectDatas.PhotometricInterpretation) == "MONOCHROME2") {
        invert_photo = true
    }
    //dataOperation.init();
    $("#Tbtnclose").removeClass('Tbtnclosegrey').addClass("Tbtncloses");
    $('#Tbtnclose').bind('click', presetData);
    canvasTMP = document.createElement("canvas");
    canvasTMP.setAttribute("width", imageObjectDatas.Columns);
    canvasTMP.setAttribute("height", imageObjectDatas.Rows);
    tmpctx = canvasTMP.getContext("2d");
    tmpctx.fillStyle = "#fff";
    tmpctx.fillRect(0, 0, imageObjectDatas.Columns, imageObjectDatas.Rows);
    wc = imageObjectDatas.WindowCenter;
    ww = imageObjectDatas.WindowWidth;
    wcenter = imageObjectDatas.WindowCenter;
    wwidth = imageObjectDatas.WindowWidth;
    myImageData = tmpctx.getImageData(0, 0, imageObjectDatas.Columns, imageObjectDatas.Rows);

    if (local) {
        genImagex1(imageObjectDatas.lastWC, imageObjectDatas.lastWW);
        wc = imageObjectDatas.lastWC;
        ww = imageObjectDatas.lastWW;
    } else {
        genImagex1(imageObjectDatas.WindowCenter, imageObjectDatas.WindowWidth);
    }
    imageLoaded = 1;
}

function genImagex1(wc, ww)
{
    var canvasImageDataIndex = 3;
    var storedPixelDataIndex = 4;

    var numPixels = imageObjectDatas.Columns * imageObjectDatas.Rows;

    var lookupTable = dataOperation.generateLookup(wc, ww, invert_photo);
//    imageObjectDatas.lut = lookupTable;
    imageObjectDatas.lastWW = ww;
    imageObjectDatas.lastWC = wc;

    var localData = myImageData.data;
    while (storedPixelDataIndex < numPixels) {
        myImageData.data[canvasImageDataIndex] = lookupTable[dataOperation.pixelbuff[storedPixelDataIndex++]];
        canvasImageDataIndex += 4;
    }
    tmpctx.putImageData(myImageData, 0, 0);
    canvasImg = document.getElementById("imgcanvas");
    var contextTemp = canvasImg.getContext('2d');
    contextTemp.save();
    contextTemp.setTransform(1, 0, 0, 1, 0, 0);
    contextTemp.clearRect(0, 0, canvasImg.width, canvasImg.height);
//    contextTemp.translate(canvasImg.width / 2, canvasImg.height / 2);
    contextTemp.drawImage(canvasTMP, 0, 0, canvasImg.width, canvasImg.height);
    contextTemp.restore();
    $.mobile.loading("hide");
}
//function genImagex2(wc, ww)
//{
//    var canvasImageDataIndex = 3;
//    var storedPixelDataIndex = 4;
//
//    var numPixels = imageObjectDatas.Columns * imageObjectDatas.Rows;
//    var lookupTable = imageObjectDatas.lut;
//    var localData = myImageData.data;
//    while (storedPixelDataIndex < numPixels) {
//        myImageData.data[canvasImageDataIndex] = lookupTable[dataOperation.pixelbuff[storedPixelDataIndex++]];
//        canvasImageDataIndex += 4;
//    }
//    tmpctx.putImageData(myImageData, 0, 0);
//    canvasImg = document.getElementById("imgcanvas");
//    var contextTemp = canvasImg.getContext('2d');
//    contextTemp.save();
//    contextTemp.setTransform(1, 0, 0, 1, 0, 0);
//    contextTemp.clearRect(0, 0, canvasImg.width, canvasImg.height);
////    contextTemp.translate(canvasImg.width / 2, canvasImg.height / 2);
//    contextTemp.drawImage(canvasTMP, 0, 0, canvasImg.width, canvasImg.height);
//    contextTemp.restore();
//    $.mobile.loading("hide");
//}




