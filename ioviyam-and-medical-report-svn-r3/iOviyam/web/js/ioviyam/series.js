$(document).bind("mobileinit", function() {
    $.mobile.defaultPageTransition = "slidefade";
});
$(document).on("pageshow", "#Seriespage", function() {
    $.mobile.loadingMessageTheme = 'b';
    $.mobile.loadingMessageTextVisible = true;
    $.mobile.loadingMessage = "Loading...";
    $.mobile.loading("show");
//    if (!seriesLoaded) {
//        seriesLoaded = true;
        pageLoadSeries();
//    }
});
$(document).on("pagebeforeshow", "#Seriespage", function() {
   // if (!seriesLoaded) {
        $('#serieslist').html('');
        $.mobile.loading("show");
    //}
});


function  pageLoadSeries() {
//    $.mobile.showPageLoadingMsg();
    var seriesLoad;
    var patientid, studyid;
    var patientArray = new Array();
    var params = null;
    var patientid_frompatient = "";
    var queryString = window.top.location.search.substring(1);
    var tmppatientid = getParameter(queryString, "patientID");
    var tmpstudyid = getParameter(queryString, "studyUID");
    var accNo = getParameter(queryString, "accessionNumber");
    if ((typeof tmpstudyid != 'undefined') || (typeof accNo != 'undefined')) {
        patientid = null;
        localStorage.removeItem("patiddata");
        if (tmpstudyid != 'null') {
            studyid = tmpstudyid;
        } else {
            studyid = '';
        }
    } else {
        patientid_frompatient = localStorage.getItem("patientid_frompatient");
        studyid = localStorage.getItem("studyid");
    }

    if (patientid == null) {

        var serverName = getParameter(queryString, "serverName");

        if (patientid_frompatient == 'null') {
            patientid_frompatient = '';
        }

        if (serverName == 'null') {
            serverName = '';
        }

        if (accNo == 'null') {
            accNo = '';
        }

        /* if(studyid == 'null') {
         window.location='home.html';
         } */

        params = {
            "PatientID": patientid_frompatient,
            "StudyID": studyid,
            "AccessionNo": accNo,
            "ServerName": serverName
        };
    } else {
//        patientArray = patientid.split(",");
        params = {
            "PatientID": patientid_frompatient,
            "StudyID": studyid
//            ,
//            "ae": localStorage.getItem("aetitle"),
//            "host": localStorage.getItem("hostname"),
//            "port": localStorage.getItem("port"),
//            "wado": localStorage.getItem("wado")
        };


    }
    $('#headingseries').html(localStorage.getItem("pat_name_permnant"));
    localStorage.setItem("ipatname", patientArray[1]);
    if (studyid == undefined || studyid == null) {
        $.mobile.changePage("#mainserch");
    }

    $("#btnback").click(function() {
        $(this).addClass($.mobile.activeBtnClass);
        $.mobile.changePage("#Patientpage");
    });
    try {
        $.urlParam = function(name) {
            var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
            return results[1] || 0;
        }
    } catch (err) {
        alert(err);
    }
    var arraylistvale;
//    console.log(params.toString());
    $.post("series.do", params, loadSeries);
    function loadSeries(data) {
        obj = $.parseJSON(data);
        localStorage.setItem("json", data);
        seriesList = new Array();
        arraylistvale = new Array();
        seriesLoad = new Array();
        $('#serieslist').html('');
        var i = 0;
        $.each(obj, function(i, row) {
            var valuurl;
            seriesList.push(row);
            viewerarray = this['url'];
            var outofnull = new Array();

            if (patientArray[0] == 'null') {
                patientArray[0] = row['patientId'];
            }

            if (typeof patientArray[1] == 'undefined') {
                patientArray[1] = row['patientName'];
                $('#headingseries').html(patientArray[1]);
                localStorage.setItem("ipatname", patientArray[1]);
                localStorage.setItem("istudydesc", row['studyDesc']);
            }

            for (var i = 0; i < row['url'].length; i++) {
                if (row['url'][i] != null) {
                    outofnull.push(row['url'][i]);
                }
            }
            arraylistvale.push(outofnull);
            //  console.log(",,,,,,,,,,,,,,,,,"+outofnull);
            if (row['url'][0] == null) {
                valuurl = row['url'];
            } else {
                valuurl = row['url'][0];
            }
            seriesLoad.push(row['url']);
            var seriesImage;
            if (row['modality'] == "SR") {
                seriesImage ="css/images/sr.png";
            } else {
                seriesImage = outofnull[0] + '&frameNumber=1&rows=82&coloumns=82&type=jpg';
            }

            $('#serieslist').append('<li data-theme="b" id=serieslistvalue' + i + ' data-theme="a"  ibodypart=' + row['bodyPart'] + ',' + row['seriesDesc'] + ' >'
                    + '<a  data-theme="b"  href="" data-transition="slide">'
                    + '<img  id="imgstudy" style="float:left;"  src='+seriesImage + '>'
                    +
                    //                    '<label style="font: bold 14px courier !important;">'+ "Series no:"+this['seriesNumber']+'</label>'+'<br>'+
                    '<label data-theme="b" style="float:left;font: bold 15px helvetica;color:#AAAAAA;">' + "" + row['seriesDesc'] + '</label>' + '<br>' +
                    '<label data-theme="b" style="float:left;font:  14px helvetica;color: #AAAAAA">' + row['modality'] + '</label>' + '<br>' +
                    //                    '<label style="font: bold 14px courier !important;">'+ "Body Part:"+this['bodyPart']+'</label>'+'<br>'+
                    '<label data-theme="b" style="float:left;font: normal 14px helvetica ;color: #AAAAAA">' + "(" + row['totalInstances'] + " " + "images)" + '</label>' +
                    '</a>' + '</li>').listview('refresh');
        });
        i++;
        $('#serieslist').children('li').on('click', function() {
            $(this).addClass($.mobile.activeBtnClass);
            var patient = $(this).index();
            localStorage.setItem("ibodypart", seriesList[patient]['bodyPart'] + ',' + seriesList[patient]['seriesDesc'] + ',' + seriesList[patient]['totalInstances'] + ',' + patientArray[2]);
            seletedindex = $(this).index();
            localStorage.setItem("patid", seriesList[patient]['patientId']);

            if (seriesList[patient]['studyUID'] == '') {
                localStorage.setItem("studyid", getParameter(arraylistvale[0][0], "studyUID"));
            } else {
                localStorage.setItem("studyid", seriesList[patient]['studyUID']);
            }

            localStorage.setItem("seriesid", seriesList[patient]['seriesUID']);
            localStorage.setItem("seriesPk", seriesList[patient]['seriesPk']);
            
            localStorage.setItem("seletedseries", seletedindex);
            localStorage.setItem("selectedmodality", seriesList[patient]['modality']);

//            console.log(seriesList[patient]['modality'] + "__________________________");

            if (localStorage.getItem("isex") == null) {
                localStorage.setItem("isex", seriesList[patient]['patientGender'] + "," + seriesList[patient]['studyDate']);
            }

            if (localStorage.getItem("patiddata") == null) {
                localStorage.setItem("patiddata", patientArray[0] + "," + patientArray[1]);
            }

            var arry = new Array();
            //arry=seriesList[patient]['url'];
            arry = arraylistvale[patient];
            localStorage.setItem("serieLoadArray", arry);
            //  console.log("....."+seriesList[patient]['url'].length);
            // jQuery.isArray(seriesList[patient]['url'])
            isBackButton = false;
//            $.mobile.changePage("#viewerPage");

            window.location = "viewer.html";
        });
        $.mobile.loading("hide");
    }
}

//Function to read query parameters
function getParameter(queryString, parameterName) {
    //Add "=" to the parameter name (i.e. parameterName=value);
    var parameterName = parameterName + "=";
    if (queryString.length > 0) {
        //Find the beginning of the string
        var begin = queryString.indexOf(parameterName);
        if (begin != -1) {
            //Add the length (integer) to the beginning
            begin += parameterName.length;
            var end = queryString.indexOf("&", begin);
            if (end == -1) {
                end = queryString.length;
            }
            return unescape(queryString.substring(begin, end));
        }

        return "null";
    }
}
