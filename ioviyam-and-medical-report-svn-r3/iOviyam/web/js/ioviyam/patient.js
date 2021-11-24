
var LoadPatient = false;
var studyLoaded = false;

$(document).on("pageshow", "#Patientpage", function() {
    seriesLoaded = false;
    if (!studyLoaded) {
        $.mobile.loadingMessageTheme = 'b';
        $.mobile.loadingMessageTextVisible = true;
        $.mobile.loadingMessage = "Loading...";
        $.mobile.loading("show");
        patientList();
    }
});

$(document).on("pagebeforeshow", "#Patientpage", function() {
    if (!studyLoaded) {
        $('#listviewuldata').html('');
        $.mobile.loading("show");
    }
});

function patientList() {
    studyLoaded = true;



    var param = null;
//    $.mobile.showPageLoadingMsg();
    $("#patientback").click(function() {
        $(this).addClass($.mobile.activeBtnClass);
        $.mobile.changePage("#mainserch");
    });
    param = {
        "patientID": localStorage.getItem("localpatid"),
        "patientName": localStorage.getItem("localpatname"),
        "Acc-no": localStorage.getItem("localaccno"),
        "Birthdate": localStorage.getItem("localbirthdate"),
        "Modality": localStorage.getItem("localmodality"),
        "From": localStorage.getItem("localfromdate"),
        "To": localStorage.getItem("localtodate"),
//        "ae":localStorage.getItem("aetitle"),
        "tfrom": localStorage.getItem("localfromtime"),
        "tto": localStorage.getItem("localtotime"),
//        "host":localStorage.getItem("hostname"),
//        "port":localStorage.getItem("port"),
//        "wadoport":localStorage.getItem("wado")

    }

console.log(param);


    $.get("study.do", param
            , function(data) {
                var i = 0;
                $('#listviewuldata').html('');
                $('#numbrofstdy').html(data.length + "-" + 'Records');
                $.each(data, function(i, row) {

                    var modalitySplit = $.trim(row['Modality'].toString());
                    var modalityarray = new Array();
                    modalityarray = modalitySplit.split(/[\s,]+/);
                    var seriesCount = row['seriesno'];
                    var modality = modalityarray[0];
                    if (modalityarray.length >= 2) {
                        modality = "";
                        for (var t = 0; t < modalityarray.length; t++) {
                            if (modalityarray[t].toString() != 'PR') {

                                if (t === (modalityarray.length - 1)) {
                                    modality += modalityarray[t];
                                } else {
                                    modality += modalityarray[t] + "," + modality;
                                }
                            } else if (modalityarray[t].toString() == 'PR') {
                                seriesCount = (seriesCount - (t + 1));
                            }
                        }
                    }


                    $('#listviewuldata').append(' <li style="color:#AAAAAA;" id=studylist' + i + ' data-theme="b"   patid="' + row['PatientId'] + ',' + row['PatientName'] + ',' + row['thickness'] + '" ' + 'studyid="' + row['studyid'] + '" ' + 'isex=' + row['sex'] + ',' + row['StudyDate'] + ' ' + 'imodality=' + modality + ' ' + 'istudydesc=' + row['studydesc'] + ' >' + ' <a href=' + "#" + " " + '"data-transition="none">' +
                            '<label style="font: bold  15px helvetica;color:#AAAAAA;">'
                            + row['PatientName'] +
                            '</label>' + '<label style=" font:  14px helvetica;color:#AAAAAA;">'
                            + row['StudyDate'] +
                            '</label>' + '<label style=" font:  14px helvetica;color:#AAAAAA;">' +
                            ' ' + "(" + seriesCount + " series)" +
                            '</label>' + '<span style="font: bold 12px helvetica !important;border-color:grey;color:#AAAAAA;" class="ui-li-count">' +
                            modality
                            + '</span>' + '</a>' +
                            '<input type="hidden"  id=patidconcat' + i + ' name="name"  value="' + row['PatientId'] + '"  />'
                            +
                            '<input type="hidden"  id=pat_name_pat' + i + ' name="name"  value="' + row['PatientName'] + '"  />'
                            + '</li>').listview('refresh');
                });
                i++;
                $('#listviewuldata').children('li').on('click', function() {
                    $(this).addClass($.mobile.activeBtnClass);
                    var patient = $(this).index();
                    localStorage.setItem("patientid_frompatient", $('#patidconcat' + patient).val());
                    localStorage.setItem("patiddata", $('#studylist' + patient).attr('patid'));
                    localStorage.setItem("studyid", $('#studylist' + patient).attr('studyid'));
                    localStorage.setItem("isex", $('#studylist' + patient).attr('isex'));
                    localStorage.setItem("imodality", $('#studylist' + patient).attr('imodality'));
                    localStorage.setItem("istudydesc", $('#studylist' + patient).attr('istudydesc'));
                    localStorage.setItem("pat_name_permnant", $('#pat_name_pat' + patient).val());
                    $.mobile.changePage("#Seriespage");
//                    console.log($('#studylist' + patient).attr('studyid'));
                });
                $.mobile.loading("hide");
            });
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
}