
onmessage = function(e) {
    var event = e.data;
    switch (event.cmd) {
        case "1":
            var objects = event.data;
            var xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.open("get", objects + "&type=dicom", true);
            xmlHttpRequest.responseType = "arraybuffer";
            xmlHttpRequest.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var dicomPart10AsArrayBuffer = this.response;
                    var byteArray = new Uint8Array(dicomPart10AsArrayBuffer);
                    postMessage({"data": byteArray});
                }
            };
            xmlHttpRequest.send();
            break;
    }
};