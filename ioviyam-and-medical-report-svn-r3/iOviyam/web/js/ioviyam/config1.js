var logicallist = true;
$(document).ready(function() {
    if (localStorage.getItem("type") == "add") {
        $('#aetitletxt').val("");
        $('#hosttxt').val("");
        $('#porttxt').val("");
        $('#wadotxt').val("");
        $('#logicalnametxt').val("");
    }
    $("#btnbackconfig").click(function() {
       $.mobile.changePage("home.html");
    });
    function removeA(arr) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax = arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    }
    $('#aetitletxt').val(localStorage.getItem("aetitle"));
    $('#hosttxt').val(localStorage.getItem("hostname"));
    $('#porttxt').val(localStorage.getItem("port"));
    $('#wadotxt').val(localStorage.getItem("wado"));
    $('#logicalnametxt').val(localStorage.getItem("logicalname"));
    if (localStorage.getItem("type") == "add") {
        $('#aetitletxt').val("");
        $('#hosttxt').val("");
        $('#porttxt').val("");
        $('#wadotxt').val("");
        $('#logicalnametxt').val("");
    }
    var radiolist;
    var addConfiguration = function(e) {
        if ($('#aetitletxt').val() == "" || $('#hosttxt').val() == "" || $('#porttxt').val() == "" || $('#wadotxt').val() == "") {
            $.mobile.loading("show", {
                text: "Above fields should't be empty",
                textVisible: true,
                theme: "b",
                html: ""
            });
            window.timeOutId = window.setTimeout(function() {
                $.mobile.loading("hide");

            }, 1200);
        } else {
            // alert("...."+ localStorage.getItem("type"));
//            if(localStorage.getItem("type")=="add"){
//                radiolist=new Array();
//                radiolist=localStorage.getItem("valueoflist").split(',');
//                if(jQuery.inArray($.trim($('#logicalnametxt').val()), radiolist)!=-1){
//                    logicallist=false;
//                    //console.log(".....-1");
//                }else{
//                    logicallist=true;  
//                    //console.log("......not -1");
//                }
//                doService();
//            }else if(localStorage.getItem("type")=="edit"){
//                radiolist=new Array();
//                radiolist=localStorage.getItem("valueoflist").split(',');
//                removeA(radiolist,localStorage.getItem("logicalname"));
//                for(var i=0;i<radiolist.length;i++){
//                    if(radiolist[i]==$.trim($('#logicalnametxt').val())){
//                        logicallist=false;
//                    }else{
//                        logicallist=true;
//                    }
//                }
            doService();
//            }
        }
    };
    function doService() {
//        if(logicallist){
        $.post("config.do", {
            "ae": $('#aetitletxt').val(),
            "host": $('#hosttxt').val(),
            "port": $('#porttxt').val(),
            "wado": $('#wadotxt').val(),
            "listener": $('#listener').val(),
            "type": "write",
        }, function(data) {
            $.mobile.changePage("home.html");
        });
//        }else{
//            $.mobile.showPageLoadingMsg("a", "Description already exists!", true);
        window.timeOutId = window.setTimeout(function() {
         $.mobile.loading("hide");

        }, 1200);

//        }
    }
    ;

    function getService() {
//        if(logicallist){
        $.post("config.do", {
            "type": "read"
        }, function(data) {
            var array = $.parseJSON(data);
            $('#aetitletxt').val(array['aetitle']);
            $('#hosttxt').val(array['hostname']);
            $('#porttxt').val(array['port']);
            $('#wadotxt').val(array['wado']);
            $('#listener').val(array['listener']);
        });
//        }else{
//            $.mobile.showPageLoadingMsg("a", "Description already exists!", true);
        window.timeOutId = window.setTimeout(function() {
            $.mobile.loading("hide");

        }, 1200);

//        }
    }
    ;



    var configclr = function() {
        $('#aetitletxt').val("");
        $('#hosttxt').val("");
        $('#porttxt').val("");
        $('#wadotxt').val("");
        $('#listener').val();
//        $('#logicalnametxt').val("");
    }
    $("#configuration").bind('click', addConfiguration);
    $("#clearconfig").bind('click', configclr);
    var echobtncheck = function() {
        $.post("echo.do", {
            "ae": $.trim($('#aetitletxt').val()),
            "host": $.trim($('#hosttxt').val()),
            "port": $.trim($('#porttxt').val()),
            "wado": $.trim($('#wadotxt').val())
        }, function(data) {
            // alert(data);
            if (data == "true") {
                $.mobile.loading("show", {
                    text: "Echo Success !",
                    textVisible: true,
                    theme: "b",
                    html: ""
                });
                f


                window.timeOutId = window.setTimeout(function() {
                    $.mobile.loading("hide");

                }, 1200);
            } else {
                $.mobile.loading("show", {
                    text: "Echo Failed !",
                    textVisible: true,
                    theme: "b",
                    html: ""
                });
                window.timeOutId = window.setTimeout(function() {
                   $.mobile.loading("hide");

                }, 1200);
            }
        });
    }
    $("#echobtn").bind('click', echobtncheck);
    getService();
});