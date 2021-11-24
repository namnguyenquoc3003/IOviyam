/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function RasterImageWriter(canvasId, imageObject) {
    this.ww;
    this.wc;
    this.slope;
    this.intercept;
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.height;
    this.width;
    this.min;
    this.max;
    this.imageObject = imageObject;
    this.myImageData;
    this.canvasTMP = document.createElement("canvas");
    this.tmpctx;
    this.pixelbuff = imageObject.PixelData;
    this.lut = [];
    this.lastWW=171;
    this.lastWC=85;

}

RasterImageWriter.prototype.fillValues = function() {

    if (typeof this.imageObject === 'undefined') {
        throw ("Image Object undefined !!");
    }
    if (typeof this.imageObject.RescaleSlope === 'undefined') {
        this.imageObject.RescaleSlope = 1;
    }
    if (typeof this.imageObject.RescaleIntercept === 'undefined') {
        this.imageObject.RescaleIntercept = 0;
    }
   
    if (typeof this.imageObject.WindowWidth === 'undefined') {
        this.imageObject.WindowWidth = this.ww;
    }
    if ($.isArray(this.imageObject.WindowCenter)) {
        this.imageObject.WindowCenter = this.imageObject.WindowCenter[0];
    }
    if ($.isArray(this.imageObject.WindowWidth)) {
        this.imageObject.WindowWidth = this.imageObject.WindowWidth[0];
    }

    if (typeof this.imageObject.WindowCenter === 'undefined'||typeof this.imageObject.WindowWidth === 'undefined') {

    var minmax = getMinMax(this.imageObject.PixelData);
    var maxVoi = minmax.max * this.imageObject.RescaleSlope + this.imageObject.RescaleIntercept;

    var minVoi = minmax.min * this.imageObject.RescaleSlope + this.imageObject.RescaleIntercept;
    this.min = minmax.min;
    this.max = minmax.max;
    this.imageObject.WindowWidth = Math.round(maxVoi - minVoi)/10;
    this.imageObject.WindowCenter = Math.round((maxVoi + minVoi)/10);

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
    }
    console.log(this.imageObject);
};

RasterImageWriter.prototype.calWWWC = function() {
//     this.imageObject.PixelData=new Uint8Array(this.imageObject.PixelData);
    var minmax = getMinMax(this.imageObject.PixelData);
    var maxVoi = minmax.max * this.imageObject.RescaleSlope + this.imageObject.RescaleIntercept;

    var minVoi = minmax.min * this.imageObject.RescaleSlope + this.imageObject.RescaleIntercept;
    this.min = minmax.min;
    this.max = minmax.max;
    this.ww = Math.round(maxVoi - minVoi);
    this.wc = Math.round((maxVoi + minVoi) / 2);

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
};

RasterImageWriter.prototype.generateLookup = function(winc, windoww, invert) {
    this.lut = [];
    var modalityLutValue;
    var voiLutValue;
    var clampedValue;
    var storedValue;
    if (invert) {
        for (storedValue = this.min; storedValue <= this.max; storedValue++)
        {
            //console.log("______1_______invert data details_______________XC____"+invert);
            modalityLutValue = storedValue * this.imageObject.RescaleSlope + this.imageObject.RescaleIntercept;
            voiLutValue = (((modalityLutValue - (winc)) / (windoww) + 0.5) * 255.0);
            clampedValue = Math.min(Math.max(voiLutValue, 0), 255);
            this.lut[storedValue] = Math.round(clampedValue);
        }
    }
    else {
        for (storedValue = this.min; storedValue <= this.max; storedValue++)
        {   // console.log("____2_________invert data details_______________XC____"+invert);
            modalityLutValue = storedValue * this.imageObject.RescaleSlope + this.imageObject.RescaleIntercept;
            voiLutValue = (((modalityLutValue - (winc)) / (windoww) + 0.5) * 255.0);
            clampedValue = Math.min(Math.max(voiLutValue, 0), 255);
            this.lut[storedValue] = Math.round(255 - clampedValue);
        }
    }
    return this.lut;
};

RasterImageWriter.prototype.init = function() {
    this.height = this.imageObject.Rows;
    this.width = this.imageObject.Columns;
    this.canvasTMP.setAttribute("width", this.imageObject.Columns);
    this.canvasTMP.setAttribute("height", this.imageObject.Rows);
    this.tmpctx = this.canvasTMP.getContext("2d");
    this.tmpctx.fillStyle = "white";
    this.tmpctx.fillRect(0, 0, this.imageObject.Columns, this.imageObject.Rows);
    this.myImageData = this.tmpctx.getImageData(0, 0, this.imageObject.Columns, this.imageObject.Rows);
    console.log(this.imageObject.Rows + "_______" + this.imageObject.Columns + "++++++++++++++++++++++++++++++++++++++++++___" + this.myImageData.length);
    return this.myImageData;
};

//RasterImageWriter.prototype.initDrawImage = function() {
//    this.canvasTMP.setAttribute("width", this.ImageObject.Columns);
//    this.canvasTMP.setAttribute("height", this.ImageObject.Rows);
//    var ctx = this.canvasTMP.getContext("2d");
//    ctx.fillStyle = "white";
//    ctx.fillRect(0, 0, this.ImageObject.Columns, this.ImageObject.Rows);
//    this.myImageData = ctx.getImageData(0, 0, this.ImageObject.Columns, this.ImageObject.Rows);
//    return this.myImageData;
//};