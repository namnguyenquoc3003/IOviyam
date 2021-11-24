
var seriesList;
var seletedindex;
var obj;
var isBackButton = false;

var studyLoaded = false, seriesLoaded = false;

$(document).on("pageshow", "#mainserch", function() {
    studyLoaded = false;
    seriesLoaded = false;
});

var serverae, serverhost, serverport, serverwado;
$(document).bind("mobileinit", function() {
    $.mobile.defaultPageTransition = "slide";
});
var showSelectedNames, seletedradio;
$(document).on("pagecreate", "#mainserch", function() {

//    $("#editbtn").attr("disabled", "true");
//
//    $("#editbtn").addClass('ui-disabled');
    $("#modalitylink").click(function() {
        $.mobile.changePage("#modalitypage", {transition: "none"});
    });
    $("#studydatetxt").click(function() {
        $.mobile.changePage("#studydatepage", {transition: "none"});
    });
//    $("#editbtn").addClass('ui-disabled');
//    $("#editbtn").data('disabled');
    $(".footerContainer").css("height", $("#headerquery1").height() * .8);
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var today = Date.today().toString("dd-MM-yyyy");
    $("#studydatetxt").html("Today" + "-" + "(" + today + ")");
    // $("#queryBtn").click(studylevelquery);
    var curr = new Date().getFullYear();
    var opt = {
    }
    opt.date = {
        preset: 'date'
    };
    opt.datetime = {
        preset: 'datetime',
        minDate: new Date(2012, 3, 10, 9, 22),
        maxDate: new Date(2014, 7, 30, 15, 44),
        stepMinute: 5
    };
    opt.time = {
        preset: 'time'
    };
    $('label.changes').bind('change', function() {
        var demo = 'date';
        $(".demos").hide();
        if (!($("#demo_" + demo).length))
            demo = 'default';
        $("#demo_" + demo).show();
        $('#test_' + demo).val('').scroller('destroy').scroller($.extend(opt['date'], {
            theme: 'ios',
            mode: 'scroller',
            display: 'bottom',
            lang: ''
        }));
    });
    $('#demo').trigger('change');
    var array = [{
            name: "All",
            value: "All"
        }, {
            name: "CT",
            value: "CT"
        }, {
            name: "CR",
            value: "CR"
        }, {
            name: "DX",
            value: "DX"
        }, {
            name: "MR",
            value: "MR"
        }, {
            name: "NM",
            value: "NM"
        }, {
            name: "OT",
            value: "OT"
        }, {
            name: "PX",
            value: "PX"
        }, {
            name: "RF",
            value: "RF"
        }, {
            name: "SC",
            value: "SC"
        }, {
            name: "US",
            value: "US"
        }, {
            name: "XA",
            value: "XA"
        }];
    function createCheckboxes() {
        $("#createBtn").remove();
        $("#content").append('<fieldset id="cbFieldSet" data-role="controlgroup" class="grdiv">');
        var length = array.length;
        for (var i = 0; i < length; i++) {
            $("#cbFieldSet").append('<input type="checkbox" name="cb-" id="cb-' + i + '" value="' + array[i].name + '"/><label for="cb-' + i + '">' + array[i].name + '</label>');
        }
        $("#content").trigger("create");
        $("#showBtn").css("visibility", "visible");
    }
    showSelectedNames = function showSelectedNames() {
        var count = $("#cbFieldSet input:checked").length;
        var str = '';
        for (i = 0; i < count; i++) {
            if (i != (count - 1)) {
                str += $("#cbFieldSet input:checked")[i].value + ",";
            } else {
                str += $("#cbFieldSet input:checked")[i].value;
            }
        }
//        alert("You selected----"+str);
        if (str != "") {
            $("#modalitylink").html(str);
        } else {
            $("#modalitylink").html("All");
        }
        //  alert(",,,,,,,,,,,,,,,,,,,"+str);
        localStorage.setItem("localmodality", str);
    }
    //createCheckboxes();

    $(document).on('pageinit', '#modalitypage', function() {
        createCheckboxes();
    });
    $('#radioField input[type="radio"]').click(function() {
        if (($("#radioField input[type='radio']:checked").val()) != "custom") {
            $("#datepickerstudy").hide();
        } else {
            $("#datepickerstudy").show();
        }
        //  });
    });
    var curr = new Date().getFullYear();
    var opt = {
    }
    opt.date = {
        preset: 'date'
    };
    opt.datetime = {
        preset: 'datetime',
        minDate: new Date(2012, 3, 10, 9, 22),
        maxDate: new Date(2014, 7, 30, 15, 44),
        stepMinute: 5
    };
    opt.time = {
        preset: 'time'
    };
//    <!--Script-->

    $('label.changes').bind('change', function() {
        var demo = 'date';
        $(".demosa").hide();
        if (!($("#demo_" + demo).length))
            demo = 'defaulta';

        $("#demoa_" + demo).show();
        $('#test_' + demo).val('').scroller('destroy').scroller($.extend(opt['date'], {
            theme: 'ios',
            mode: 'scroller',
            display: 'bottom',
            lang: ''
        }));
    });

    $('#demoa').trigger('change');
    $('label.changes').bind('change', function() {
        var demo = 'date';
        $(".demos1").hide();
        if (!($("#demo_" + demo).length))
            demo = 'default1';

        $("#demo1_" + demo).show();
        $('#test_' + demo).val('').scroller('destroy').scroller($.extend(opt['date'], {
            theme: 'ios',
            mode: 'scroller',
            display: 'bottom',
            lang: ''
        }));
    });
    $('#demo1').trigger('change');
    $("#modalityselect").click(showSelectedNames);

    $("#searchdateselect").click(seletedradios);


    $('#queryBtn')
            .click(seletedradios)
            .click(showSelectedNames)
            .click(studylevelquery);

// var serverarray = [{
//        name: "All", 
//        value: "All"
//    },{
//        name: "CT", 
//        value: "CT"
//    }, {
//        name: "MR", 
//        value: "MR"
//    },{
//        name: "XA", 
//        value: "XA"
//    }, {
//        name: "CR", 
//        value: "CR"
//    }, {
//        name: "SE", 
//        value: "SE"
//    }, {
//        name: "NM", 
//        value: "NM"
//    }, {
//        name: "RF", 
//        value: "RF"
//    }, {
//        name: "DX", 
//        value: "DX"
//    }, {
//        name: "US", 
//        value: "US"
//    }, {
//        name: "PX", 
//        value: "PX"
//    },{
//        name: "OT", 
//        value: "OT"
//    }];
//    function createServerSelection(){
//        $("#servercontent").append('<fieldset id="cbFieldSetserver" data-role="controlgroup" class="grdiv">');
//        var length = serverarray.length;
//        for(var i=0;i<length;i++){
//            $("#cbFieldSetserver").append('<input type="radio" name="cb-server" id="cb-server'+i+'" value="'+serverarray[i].name+'"/><label for="cb-server'+i+'">'+serverarray[i].name+'</label>');
//        }
//        $("#servercontent").trigger("create");
//    }
// function showServer(){
//        var count = $("#cbFieldSetserver input:checked").length;
//        var str = '';
//        for(var i=0;i<count;i++){
//            str += $("#cbFieldSetserver input:checked")[i].value;
//        }
//       alert("............."+str);
//    }
//function serverSelected(e){
//    showServer();
//}
//  $(document).on('pageinit', '#serverselectpage',  function(){
//    createServerSelection();
//    $("#serverselect").bind('click',serverSelected);
//    });


    $("#editbtn").bind('click', editConfiguration);
    function showServer() {
//        var count = $("#cbFieldSetserver input:checked").length;
//        var str="Nan";
//        for(var i=0;i<count;i++){
//            str = $("#cbFieldSetserver input:checked")[i].value;
//        }
//        //alert("...."+str+"count........"+count);
//         if(count==0){
//            $.mobile.showPageLoadingMsg("a", "Please select the server!", true);
//        }else{
//        var configuration=str.split(',');
//        localStorage.setItem("aetitle",$.trim(configuration[0]));
//        localStorage.setItem("hostname",$.trim(configuration[1]));
//        localStorage.setItem("port",$.trim(configuration[2]));
//        localStorage.setItem("wado",$.trim(configuration[3]));
//        localStorage.setItem("logicalname",$.trim(configuration[4]));
//        }
        // alert("....."+configuration[0]+".."+configuration[1]+".."+configuration[2]+"..."+configuration[3]);
    }
    function addserverconfig() {
//        var selected_idarray=new Array();
//        var selected_id = $('#cbFieldSetserver input[type=radio]:checked').attr("id");
//       
//        if(selected_id==undefined){
//            $.mobile.showPageLoadingMsg("a", "Please select the server!", true);
//        }else{
//        // alert("......"+i+"......."+str+"..................."+selected_idarray[1]);
//         selected_idarray=selected_id.split('-');
//        var count = $("#cbFieldSetserver input:checked").length;
//        var str = '';
//        for(var i=0;i<count;i++){
//            str += $("#cbFieldSetserver input:checked")[i].value;
//        }
//        var cnt=$("#cbFieldSetserver").find("input[type=radio]").length;
//        var valueoflist=new Array();
//        for(var i=0;i<cnt;i++){
//            var valuearray=new Array();
//            valuearray=($("#cbFieldSetserver input[type=radio]")[i].value).split(',');
//            valueoflist.push(valuearray[4]);
//        }
//        localStorage.setItem("valueoflist",valueoflist);
//        var configuration=str.split(',');
//        localStorage.setItem("aetitle",$.trim(configuration[0]));
//        localStorage.setItem("hostname",$.trim(configuration[1]));
//        localStorage.setItem("port",$.trim(configuration[2]));
//        localStorage.setItem("wado",$.trim(configuration[3]));
//        localStorage.setItem("logicalname",$.trim(configuration[4]));
//        localStorage.setItem("selectedlist",selected_idarray[1]);
        window.location = "config.html";
//        }
    }

    $("#serverselect").bind('click', showServer);
    $("#editbtn").bind('click', addserverconfig);
    $.fn.jqmSelectedIndex = function(index) {
        var self = $(this)
        self
                .prop('selectedIndex', index)
                .selectmenu("refresh");
        return self;
    }
    $("#datesearch").jqmSelectedIndex(1);
    function initConfigData() {
        $.post("config.do", {
            "type": "read"
        }, function(data) {
            if (data.toString() == 'false') {
                window.location = 'config.html';
            } else {
                var array = $.parseJSON(data);
                $('#aetitletxt').val(array['aetitle']);
                $('#hosttxt').val(array['hostname']);
                $('#porttxt').val(array['port']);
                $('#wadotxt').val(array['wado']);
            }
        });
    }
    initConfigData();
    try {
        $.urlParam = function(name) {
            var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
            return results[1] || 0;
        }
    } catch (err) {
        console.log(err);
    }
    //loading Quick Search
//    $.ajax({
//        type: "GET",
//        url: "UserConfig.do",
//        data: {
//            'settings': 'buttons',
//            'todo': 'READ'
//        },
//        dataType: "json",
//        success: parseJson
//    });

    function parseJson(json) {
        var dg = new Array();
        dg = json;
        // alert("parse json::"+dg.length);
        // $("#collapadsearch").trigger('expand');
        if (dg != null) {
            if (dg.length > 0) {
                //             $("#quicksearchbtn").removeClass();
                //             $("#quicksearchbtn").addClass("ui-disabled");
                $("#qksearch").removeClass('ui-disabled');
                //$("#collap").show();
                $(json).each(function() {
                    //createButton(displayText, date_criteria, time_criteria, modality);
                    var title = this['label'];
                    var crit = this['dateCrit'];
                    var tCrit = this['timeCrit'];
                    var modality = this['modality'];
                    var btn = jQuery('<a/>', {
                        'data-role': "button",
                        'data-theme': "b",
                        href: '#',
                        text: title
                    });
                    btn.bind('click', function() {
                        $(this).addClass($.mobile.activeBtnClass);

                        if (modality != null) {
                            localStorage.setItem("localmodality", modality);
                        } else {
                            localStorage.setItem("localmodality", "");
                        }
                        var days = 0;
                        if (crit != null && crit != '') {
                            if (crit.indexOf("-") >= 0) {
                                days = crit.substring(crit.indexOf("t-") + 2);
                                var fromDate = Date.today().addDays(-days).toString("yyyyMMdd");
                                var toDate = Date.today().toString("yyyyMMdd");
                                localStorage.setItem("localtodate", toDate);
                                localStorage.setItem("localfromdate", fromDate);
                                localStorage.setItem("localfromtime", '000000');
                                localStorage.setItem("localtotime", '235900');

                            } else {
                                var tDate = Date.today().toString("yyyyMMdd");
                                localStorage.setItem("localtodate", tDate);
                                localStorage.setItem("localfromdate", tDate);
                                localStorage.setItem("localfromtime", '000000');
                                localStorage.setItem("localtotime", '235900');

                            }
                        } else {
                            localStorage.setItem("localtodate", "");
                            localStorage.setItem("localfromdate", "");
                            localStorage.setItem("localfromtime", '000000');
                            localStorage.setItem("localtotime", '235900');

                        }
                        if (tCrit != null) {

                            if (tCrit == '-30m') {
                                var fTime = new Date().addMinutes(-30).toString("HHmmss");
                                var tTime = new Date().toString("HHmmss");
                                // searchURL += '&fromTime=' + fTime +
                                // '&toTime=' + tTime;
                                localStorage.setItem("localfromtime", fTime);
                                localStorage.setItem("localtotime", tTime);
                                // console.log("....."+fTime+"..."+tTime);
                            } else if (tCrit.indexOf('-') == 0) {
                                var fTime = new Date().addHours(parseInt(tCrit)).toString("HHmmss");
                                var tTime = new Date().toString("HHmmss");
                                localStorage.setItem("localfromtime", fTime);
                                localStorage.setItem("localtotime", tTime);
                                //console.log("....."+fTime+"..."+tTime);
                            } else if (tCrit.indexOf('-') > 0) {
                                var tArr = tCrit.split('-');
                                localStorage.setItem("localfromtime", tArr[0]);
                                localStorage.setItem("localtotime", tArr[1]);
                                // console.log("....."+fTime+"..."+tTime);
                            }
                        } else {
                            localStorage.setItem("localfromtime", "");
                            localStorage.setItem("localtotime", "");
                        }
                        $.mobile.changePage("#Patientpage");
                    });
                    btn.appendTo('#quickSearchDiv');
                });
                //  $('#quickSearchDiv').html(btn);
                $('div[data-role=content]').trigger('create');
            } else {
                $("#qksearch").addClass('ui-disabled');
            }
        }
    }

    //serverList 
//    $.ajax({
//        type: "GET",
//        url: "UserConfig.do",
//        data: {
//            'settings': 'servers',
//            'todo': 'READ'
//        },
//        dataType: "json",
//        success: parseServers
//    });
    function parseServers(json) {
        var serverArray = new Array();
        var serverList = new Array();
        serverArray = json;
        if (serverArray != null) {
            $("#servercontent").append('<fieldset data-theme="b" id="cbFieldSetserver" data-role="controlgroup" class="grdiv">');
            if (serverArray.length > 0) {
                //  console.log("............"+json[0]['logicalname']+"...");
                var i = 0;
                $(json).each(function() {
                    var id = i;
                    //console.log(".aaaa...."+id+"...."+json[id]['logicalname']);
                    serverList.push(json);
                    if (id == 0) {
                        $("#cbFieldSetserver").append('<input data-theme="b" type="radio" name="cb-server" id="cbserver-' + id + '" value="' + json[id]['aetitle'] + "," + json[id]['hostname'] + "," + json[id]['port'] + "," + json[id]['wadoport'] + "," + json[id]['logicalname'] + '" checked/><label for="cbserver-' + id + '">' + json[id]['logicalname'] + '</label>');
                    } else {
                        $("#cbFieldSetserver").append('<input data-theme="b" type="radio" name="cb-server" id="cbserver-' + id + '" value="' + json[id]['aetitle'] + "," + json[id]['hostname'] + "," + json[id]['port'] + "," + json[id]['wadoport'] + "," + json[id]['logicalname'] + '"/><label for="cbserver-' + id + '">' + json[id]['logicalname'] + '</label>');
                    }
                    i++;
                });
            }
            $("#servercontent").trigger("create");
        }
    }
    Array.prototype.remByVal = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === val) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    }
    //    $("#queryserver").click(function(){
    //        $(this).addClass( $.mobile.activeBtnClass );
    //        var datedetails;
    //        var from;
    //        var to;
    //        datedetails=$("#datesearch").val();
    //        datedetails=$.trim(datedetails);
    //        if( $.trim(datedetails)=='Between'){
    //            from= $("#mydatefrm").val();
    //            to= $("#mydateto").val();
    //            from=$.trim(from);
    //            to=$.trim(to);
    //        }
    //        localStorage.setItem("patmenu", $.trim($("#patientmenu").val()));
    //        localStorage.setItem("pattxt", $.trim($("#patienttxt").val()));
    //        localStorage.setItem("modalitymenu", $.trim($("#modalitymenu").val()));
    //        localStorage.setItem("datedetails", datedetails);
    //        localStorage.setItem("from", from);
    //        localStorage.setItem("to", to);
    //        window.location='patient.html';
    //    });
    //    
    //    $("#btnback").click(function() {
    //        $(this).addClass( $.mobile.activeBtnClass );
    //        $('#serieslist').children().remove();
    //    });
    //    
    //    $("#frmdiv").hide();
    //    $("#todiv").hide();
    //    $("#datesearch").change(function() {
    //        $(this).addClass( $.mobile.activeBtnClass );
    //        var btween=$(this).val();
    //        if(btween!="Between"){
    //            $("#frmdiv").slideUp();
    //            $("#todiv").slideUp();  
    //        }else{        
    //            $("#frmdiv").show("slow"); 
    //            $("#todiv").show("slow"); 
    //        }
    //    });
    //    
    //    $("#patientmenu").on('change', function () {
    //        $(this).addClass( $.mobile.activeBtnClass );
    //        if($.trim($("#patientmenu").val())=='PatientId'){
    //            $('#patienttxt').attr("placeholder","PatientId");
    //        }
    //        if($.trim($("#patientmenu").val())=='PatientName'){
    //            $('#patienttxt').attr("placeholder","PatientName");
    //        }
    //        if($.trim($("#patientmenu").val())=='AccessionNo'){
    //            $('#patienttxt').attr("placeholder","AccessionNo");
    //        }
    //        if($.trim($("#patientmenu").val())=='BirthDate'){
    //            $('#patienttxt').attr("placeholder","BirthDate");
    //        }
    //    });
    //    
    $("#btnLogout").on('click', function() {
        $(this).addClass($.mobile.activeBtnClass);
        $.post("logout.do", function(data) {
            window.location = "home.html";
        });
    });

    $("#configinit").on('click', function() {
        // alert($("#cbFieldSetserver").find("input[type=radio]").length+"radio box length from newserver");
        var cnt = $("#cbFieldSetserver").find("input[type=radio]").length;
        var valueoflist = new Array();
        for (var i = 0; i < cnt; i++) {
            var valuearray = new Array();
            valuearray = ($("#cbFieldSetserver input[type=radio]")[i].value).split(',');
            valueoflist.push(valuearray[4]);
        }
        localStorage.setItem("valueoflist", valueoflist);
        $.mobile.changePage("#config", {
            transition: "slidefade"
        });
    });
    $("#clearconfig").on('click', function() {
        $(this).addClass($.mobile.activeBtnClass);
        $("#aetitletxt").val("");
        $("#porttxt").val("");
        $("#wadotxt").val("");
        $("#hosttxt").val("");
    });
    $("#configinit").on('click', function() {
        $(this).addClass($.mobile.activeBtnClass);
        localStorage.setItem("type", 'add');
        $.mobile.changePage("home.html");
        typedata = "add";
        // location.reload();
    });
    $("#logout").on('click', function() {
        $(this).addClass($.mobile.activeBtnClass);
        window.location.href = "login.html";
        // location.reload();
    });
});
function replaceAll(Source, stringToFind, stringToReplace) {
    var temp = Source;
    var index = temp.indexOf(stringToFind);
    while (index != -1) {
        temp = temp.replace(stringToFind, stringToReplace);
        index = temp.indexOf(stringToFind);
    }
    return temp;

    $.mobile.changeGlobalTheme("d");
}


