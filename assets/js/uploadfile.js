
function eraseFileInDatabase(fileid,formfield,callback){
    if(arguments.length==0){
        alert("invalid number of arguments in eraseFileInDatabase()");
        return;
    }
    var paras = "fileid="+fileid;
    var obj = new Array();
    var processResult= function()
    {
        if(obj[0]=="ok"){
            if(!callback) alert("deleted!");
        }
        else{
            if(!cb_exist) alert("file no longer exists!");
        }
        if(formfield)
            $("#" + formfield)[0].value="";
        if(callback) callback();
    };
    getFromWS("CoreService/deleteFile",paras,obj,processResult);
}

    function updateIncFile(folder,templatef,incfile,callback){
        var refreshCurrent = function(){
            if(refreshList)  refreshList();
            if(callback)  callback();
        };
        var urlstr = "/CoreService/writeIncFile?folder="+folder+"&template="+ templatef+"&targetfolder=../inc&incfile="+incfile;
        alert(urlstr);
        getFromWS(urlstr,null,refreshCurrent);
    }

    function kindeditAfterUpload(url,data,name){
        var picIds = $("#bufferPicIds")[0];
        if(name == "image" && picIds){
                if(picIds.value==""){
                        $("#bufferPicIds")[0].value = url.substr(url.length-19);
                }else{
                        $("#bufferPicIds")[0].value += ";" + url.substr(url.length-19);
                }
        }
    }

    function showHiBox(dialogId,prmpt,modifyContentId){
//alert("here");
        var boxHeight = window.innerHeight;
        if(boxHeight>795)
            boxHeight=795;
        else
            boxHeight -= 20;
        hiBox("#"+dialogId, prmpt,1000,boxHeight,'','.a_close');
        var textareaHeight=600;
        if(boxHeight<795)
            textareaHeight -= 765-boxHeight;
        if($("#bufferPicpath").val() != ""){
            textareaHeight -= 25;
        }
        $("#popup_message #"+modifyContentId)[0].style.height = textareaHeight+"px";
    }






//the remote server may be down, so try them in turn
function oneUploadAction(server_total,server_id,current_server,taskId,paras){
    if(current_server>server_total){
        alert("None of websocket servers works!");
        return;
    }
    var started=false;
    var valid=true;
    var urlstr = get_appropriate_ws_url(server_id) + "uploadfile?taskId=" +taskId;
    alert(urlstr);
    var socket_up;
    if (typeof MozWebSocket != "undefined") {
       socket_up = new MozWebSocket(urlstr);
    }
    else {
        socket_up = new WebSocket(urlstr);
    }

    socket_up.onopen = function(evt) {
        started=true;
        if(paras.process_div_id){
            $("#"+paras.process_div_id)[0].style.backgroundColor = "#40ff40";
            $("#"+paras.process_div_id)[0].style.width = "0%";
            $("#"+paras.process_div_id)[0].innerHTML = "Uploading...";
        }
        uploadToDatabase(paras.file,paras.callback,paras.additional_args,paras.target_fileid,server_id);
    };

    socket_up.onclose = function(evt) {
        if(started)
            return;
        //alert(evt.code);
        if(!valid && evt.code==1006){  // can not connect
            server_id++;
            if(server_id>server_total)
                server_id =1;
            oneUploadAction(server_total,server_id,current_server+1,taskId,paras);
        }
    };
    
    socket_up.onmessage = function(msg) {
        if(msg.data=="heartbeat")
            return;
        var pwidth = 0.01 * msg.data * paras.process_div_id_width;
        $("#"+paras.process_div_id)[0].style.width = pwidth+"px";
        $("#"+paras.process_div_id)[0].style.textAlign = "center";
        $("#"+paras.process_div_id)[0].value = msg.data+"%";
    };

    socket_up.onerror = function(evt) {
        //alert(evt.data);
        valid=false;
    };
}


function uploadFile(input_file_id,callback,additional_args,target_fileid,process_div_id,process_div_id_width){
    var server_total=2;
    if(!target_fileid || target_fileid<1)
        target_fileid=0;
    var file_ctr = $("#"+input_file_id)[0];
    var file = file_ctr.files[0];
    var filename=file.name;
    if(filename.length>35)
        filename=filename.substr(0,35);
    var taskId="upload"+ filename + veriCode(10);
    if(additional_args)
        additional_args += "&fifoname="+taskId;
    else
        additional_args = "fifoname="+taskId;
    var server_id = 1+Math.floor(Math.random()*server_total); //1~server_total
    var paras={file:file,callback:callback,additional_args:additional_args,target_fileid:target_fileid,process_div_id:process_div_id};
    paras["process_div_id_width"]=process_div_id_width;
    oneUploadAction(server_total,server_id,1,taskId,paras);
}

function uploadToDatabase(file,callback,additional_args,target_fileid,server_id){
    if(typeof file == "string"){
        var file_ctr = $("#"+file)[0];
        file = file_ctr.files[0];
    }
    var form1 = new FormData();
    form1.append("FILE1",file);
    var url_str="";
    if(target_fileid && target_fileid>0)
        url_str = "replaceFile.spe?fileid="+target_fileid;
    else
        url_str = "uploadFile.spe";
    if(additional_args){
        if(url_str=="uploadFile.spe")
            url_str += "?"+additional_args;
        else
            url_str += "&"+additional_args;
    }
    if(server_id)
        url_str = homeAddress()+"zs"+server_id+"/"+url_str;
    else 
        url_str = homeAddress()+url_str;
    url_str += "&userId="+  localStorage.getItem('userId') + "&userToken=" + localStorage.getItem('userToken');
    //alert(url_str);
    sendForm(url_str,form1,callback);
}

    function kindeditUploadUrl(){
        var databaseType;
        var additional_args;
        var tmpEnt = $("#bufferDatabaseType");
        if(tmpEnt && tmpEnt.val() && tmpEnt.val()!="")
              databaseType = tmpEnt.val();
        else
              databaseType = "Sqldb";
        additional_args = "databaseType="+databaseType;
        tmpEnt = $("#bufferGeneratedId");
        if(tmpEnt && tmpEnt.val() && tmpEnt.val()!="" && tmpEnt.val()!="0")
              additional_args += "&relatedDoc=" + tmpEnt.val();
        additional_args  += "&userId="+  localStorage.getItem('userId') + "&userToken=" + localStorage.getItem('userToken');
        return "/uploadFile.spe?requestSource=kindeditor&" + additional_args;
    }
