function localStorageArgs(){
    var userId;
    var userToken;
    var retV="";
    userId = localStorage.getItem('userId');
    if(userId && userId!="")
        retV += "$^@^$userId=" + userId;
    userToken = localStorage.getItem('userToken');
    if(userToken && userToken!="")
        retV += "$^@^$userToken=" + userToken;
    return retV;
}

function localStorageArgsIntoFormData(form1){
    if(form1+""!="[object FormData]")
        return;
    var userId;
    var userToken;
    userId = localStorage.getItem('userId');
    if(userId && userId!="")
        form1.append("userId",userId);
    userToken = localStorage.getItem('userToken');
    if(userToken && userToken!="")
        form1.append("userToken",userToken);
}

//invoke a web method, and then pass values to several variables
//in in-parameter, '$^@^$' is used to separate parameters
//in response data, '$_@_$' is used to separate values
function getFromWS(url_str,post_data_,outargs_,callback_){
    var argc = arguments.length;
    if(argc<3){
        alert("no enough arguments in getFromWS()");
        return;
    }
    var post_data = post_data_;
    var outargs = outargs_;
    var callback = callback_;
    if(typeof post_data_ !=="string" && argc==3){
        post_data="";
        outargs = post_data_;
        callback = outargs_;        
    }
    var xmlhttp=null;
    var state_Change=function(){
        if (xmlhttp.readyState==4){// 4 = "loaded"
            if (xmlhttp.status==200){// 200 = OK
                if(outargs){
                    var htmlstr =  xmlhttp.responseText;
                    var q = htmlstr.split('$_@_$');
                    for(var i=0;i<q.length;i++){            
                        outargs[i] = q[i];
                    }
                }
                if(callback)
                    callback();
            }
	    else{
                //alert("in getfromws("+url_str+")");
                //alert("Problem retrieving XML data");
	    }
        }
    };
    if (window.XMLHttpRequest){// code for all new browsers
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject){// code for IE5 and IE6
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlhttp!=null){
        try{
            xmlhttp.onreadystatechange=state_Change;
            xmlhttp.open("POST", homeAddress()+"one/"+url_str, true);
            if(typeof post_data ==="string")
                post_data += localStorageArgs();
            else
                localStorageArgsIntoFormData(post_data);
            xmlhttp.send(post_data);
        }
        catch(exception){
            alert("xmlHttp Fail");
        }
    }
    else{
        alert("Your browser does not support XMLHTTP.");
    }
}

//之所以要使用回调函数，是因为调用web service本身采用的是异步模式
//弃用, 与station.js重复
function _logout(){

    var obj = new Array();
    var passResult = function(){
        if(obj[0]=="ok"){
            var result = new Array();
            var processResult = function(){
                if(result[0]=="ok"){
                    for(var i=1;i<result.length;i++)
                        localStorage.removeItem(result[i]);
                    location.href = "default.html";
                }
            };
            getFromWS("/CoreService/logout","",result,processResult);
        }else{
            localStorage.removeItem("userId");
            localStorage.removeItem("userToken");
            localStorage.removeItem("classification");
            localStorage.removeItem("loginName");
            location.href = "login.html";
        }
    }
    getFromWS("maintain/security.template",localStorageArgs(),obj,passResult);


}


//send loginname and password, to get userid and usertoken and classification
//returning data are:id token classification
//弃用,与station.js重复
function _login(loginName,passwd,callback){
    if(arguments.length<3){
        alert("no enough arguments in login()");
        return;
    }
    var obj = new Array();
    var processResult = function(){
        for(var i=0;i<obj.length;i++){
            if(obj[i]){
                var idx = obj[i].indexOf("=");
                var key = obj[i].substring(0,idx);
                var val = obj[i].substring(idx+1);
                localStorage.setItem(key,val);
                obj[i] = val;
            }
        }
        //obj[3]=loginName;
        callback(obj);
    };
    getFromWS("/CoreService/login","loginName="+loginName+"$^@^$passwd="+passwd,obj,processResult);
}

//用随机数产生验证码
function veriCode(retlen){
    var now=new Date();
    var veri="i"+now;
    var len = veri.length;
    var vcode="";
    var vlen=6;
    if(retlen)
        vlen=retlen;
    for(var i=0;i<vlen;i++){
        var posi = Math.floor(Math.random()*len);//0-(len-1)
        var ch = veri.substr(posi,1);
        if(ch!==" " && ch!=="+" && ch!==":" && ch!=="o" && ch!=="O" && ch.charCodeAt(0)<=127 && ch!="(" && ch!=")" ){
            vcode += ch;
        }
        else
            i--;
    }
    return vcode.toUpperCase();
}

function normalContentType(){
    return "text/xml; charset=utf-8";
}

function homeAddress(){
    var addressHead = window.location.href;
    var buf;
    buf = addressHead.substr(0,6);
    if(buf=="https:"){
        buf = addressHead.substr(8);
        addressHead="https://";
    }
    else{
        buf = addressHead.substr(7);
        addressHead="http://";
    }
    var index = buf.indexOf("/");
    if(index<0)
        return addressHead+buf+"/";
    buf = buf.substr(0,index+1);
    return addressHead+buf;
}

// invoke a web method, and then pass html to several DIVs
// in post-data arguments for templates, '$^@^$' is used to separate values. If post-data is empty, we can skip it.
// in response data, '$_@_$' is used to separate html-blocks
// the last parameter can be a callback function
// below are some examples:
// loadFromWS(url, "base_hd");
// loadFromWS("Home/leftsidemenu.template","type=个人中心$^@^$item=主页","sidebar-menu-inner");
// loadFromWS(url, paras, "list", callback);
function loadFromWS(url_str,pst_data,target_id){
    var args = arguments;
    if(args.length<2){
        alert("no enough arguments in loadFromWS()");
        return;
    }
    var fromPos=2;
    var post_data=pst_data;
    if(typeof pst_data ==="string" && pst_data!=""){
        var posi = pst_data.indexOf("=");
        if(posi==-1){
            fromPos=1;
            post_data="";
        }
    }
    var divIds= new Array();
    for(var i=fromPos;i<args.length;i++)
        divIds[i-fromPos]=args[i];
    var xmlhttp=null;
    var state_Change=function(){
        if (xmlhttp.readyState==4){// 4 = "loaded"
            if (xmlhttp.status==200){// 200 = OK
                var htmlstr =  xmlhttp.responseText;     
                var q = htmlstr.split('$_@_$');
                for(var i=0;i<divIds.length;i++){
                    if(typeof divIds[i] === "function")
                        divIds[i]();
                    else{
                        var ctl = $('#'+divIds[i]);
                        if(ctl){
                            ctl = ctl[0];                        
                            if(typeof ctl.value === 'undefined'){
                                if(i<q.length)
                  	            $('#'+divIds[i]).html(q[i]);
                            }
                            else 
                                ctl.value = q[i];
                        }
                        else  if(typeof divIds[i] === "string" && divIds[i].substr(0,3)==="id:"){
                            var idstr=divIds[i].substr(3);
                  	    var enti=document.getElementById(idstr);
                            enti.innerHTML = q[i];
                        }
                    }
                }
            }
	    else{
                //alert("in loadfromws("+url_str+")");
                //alert("Problem retrieving XML data");
	    }
        }
    };
    if (window.XMLHttpRequest){// code for all new browsers
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject){// code for IE5 and IE6
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlhttp!=null){
        xmlhttp.onreadystatechange=state_Change;
        xmlhttp.open("POST", homeAddress()+"one/"+url_str, true);
        if(typeof post_data ==="string")
            post_data += localStorageArgs();
        else
            localStorageArgsIntoFormData(post_data);
        xmlhttp.send(post_data);
    }
    else{
        alert("Your browser does not support XMLHTTP.");
    }
}

//从URL中获取相应参数的值。获取到的参数值存放在arguVal[0]中，而去除这个参数之后的URLstr被返回
function oneArguFromList(arguName,getParameters,arguVal){
    var posi=getParameters.indexOf(arguName+"=");
    if(posi==-1){
        arguVal[0]="";
        return getParameters;
    }
    var retVal="";
    if(posi!==0)
        retVal= getParameters.substr(0,posi-1);
    arguVal[0]=getParameters.substr(posi);
    posi=arguVal[0].indexOf("&");
    if(posi==-1){
        arguVal[0]= arguVal[0].substr(arguName.length+1);
        return retVal;
    }
    retVal += arguVal[0].substr(posi);
    arguVal[0] = arguVal[0].substring(arguName.length+1,posi);
    return retVal;
}

//第三个参数如果不是回调函数，则是某个div的id，可以设置多个div。返回的内容用$_@_$分隔，然后赋予各个div
//form1也可以不是FormData对象，而是一个形如“key1=val1&key2=val2”的字符串
function sendForm(urlstr,form1,callback){
    var xrq = new XMLHttpRequest();
    var divN = arguments.length-2;
    var args = arguments;
    xrq.onreadystatechange=function(){
        if(xrq.readyState==4){// 4 = "loaded"
            if(xrq.status==200){// 200 = OK
                if(typeof args[2]==="function"){
                    //返回文件id
                    //alert(xrq.responseText);
                    callback(xrq.responseText);
                }else{
                    var divcontent=xrq.responseText.split('$_@_$');
                    if(divN>divcontent.length)
                        divN=divcontent.length;
                    for(var i=0;i<divN;i++)
                        $(args[i+2]).html(divcontent[i]);
                }
            }
            else{
                // alert("in sendform");
                // alert("Problem retrieving XML data:"+xrq.status);
        }}};

    // alert(urlstr);

    xrq.open("POST",urlstr);
    xrq.send(form1);
}

function get_appropriate_ws_url(server_id)
{
	var pcol;
	var u = document.URL;

	/*
	 * We open the websocket encrypted if this page came on an
	 * https:// url itself, otherwise unencrypted
	 */

	if (u.substring(0, 5) == "https") {
		pcol = "wss://";
		u = u.substr(8);
	} else {
		pcol = "ws://";
		if (u.substring(0, 4) == "http")
			u = u.substr(7);
	}

	u = u.split('/');

	/* + "/xxx" bit is for IE10 workaround */

	var urlstr = pcol + u[0] + "/ws"+server_id+"/";
        //alert(urlstr);
	return urlstr;
}

//the remote server may be down, so try them in turn
function oneUploadAction(server_total,server_id,current_server,taskId,paras){
    if(current_server>server_total){
        alert("None of websocket servers works!");
        return;
    }
    var valid=true;
    //var urlstr = get_appropriate_ws_url(server_id) + taskId;
    var urlstr = get_appropriate_ws_url(server_id) + "uploadfile?taskId=" +taskId;
    //alert(urlstr);
    var socket_up;
    if (typeof MozWebSocket != "undefined") {
       socket_up = new MozWebSocket(urlstr);
    }
    else {
        socket_up = new WebSocket(urlstr);
    }

    socket_up.onopen = function(evt) {
        if(paras.process_div_id){
            $("#"+paras.process_div_id)[0].style.backgroundColor = "#40ff40";
            $("#"+paras.process_div_id)[0].style.width = "0%";
            $("#"+paras.process_div_id)[0].innerHTML = "Uploading...";
        }
        uploadToDatabase(paras.file,paras.callback,paras.additional_args,paras.target_fileid,server_id);
    };

    socket_up.onclose = function(evt) {
        if(!valid && evt.code!=1000){
            server_id++;
            if(server_id>server_total)
                server_id =1;
            oneUploadAction(server_total,server_id,current_server+1,taskId,paras);
        }
    };
    
    socket_up.onmessage = function(msg) {
        var pwidth = 0.01 * msg.data * paras.process_div_id_width;
        $("#"+paras.process_div_id)[0].style.width = pwidth+"px";
        $("#"+paras.process_div_id)[0].style.textAlign = "center";
        $("#"+paras.process_div_id)[0].value = msg.data+"%";
    };

    socket_up.onerror = function(evt) {
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
    var server_id = 1+Math.floor(Math.random()*server_total); //1-server_total
    var paras={file:file,callback:callback,additional_args:additional_args,target_fileid:target_fileid,process_div_id:process_div_id};
    paras["process_div_id_width"]=process_div_id_width;
    oneUploadAction(server_total,server_id,1,taskId,paras);
}

function uploadToDatabase(file,callback,additional_args,target_fileid,server_id){

    var userId = localStorage.getItem('userId');
    var userToken = localStorage.getItem('userToken');
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
    url_str += "&userId="+  userId + "&userToken=" + userToken;
    sendForm(url_str,form1,callback);
}


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
//        alert(urlstr);
        getFromWS(urlstr,null,refreshCurrent);
    }

    function kindeditUploadUrl(){
	var userId = localStorage.getItem('userId');
	var userToken = localStorage.getItem('userToken');
	var obj = new Array();
	var processResult = function(){
	    if(obj[0]!="ok"){
//		alert("登陆超时，请重新登陆！");
//		ry_logout();
		return;
	    }
	}
	var paras = "$^@^$userId="+userId;
    	paras += "$^@^$userToken="+userToken;
	// getFromWS("zyMooc/security.template",paras,obj,processResult);
        var databaseType;
        var additional_args;
        var tmpEnt = $("#bufferDatabaseType");
        if(tmpEnt && tmpEnt.val() && tmpEnt.val()!="")
              databaseType = tmpEnt.val();
        else
              databaseType = "PostgresXL";
        additional_args = "databaseType="+databaseType;
        tmpEnt = $("#bufferGeneratedId");
        if(tmpEnt && tmpEnt.val() && tmpEnt.val()!="" && tmpEnt.val()!="0")
              additional_args += "&relatedDoc=" + tmpEnt.val();
        additional_args  += "&userId="+  userId + "&userToken=" + userToken;
        return "/uploadFile.spe?requestSource=kindeditor&" + additional_args;
    }

    function kindeditAfterUpload(url,data,name){
        var picIds = $("#bufferPicIds")[0];
        if(picIds){
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
            boxHeight=770;
        else
            boxHeight -= 45;
        hiBox("#"+dialogId, prmpt,1000,boxHeight,'','.a_close');
        var textareaHeight=600;
        if(boxHeight<765)
            textareaHeight -= 765-boxHeight;
        if($("#bufferPicpath").val() != ""){
            textareaHeight -= 25;
        }
        $("#popup_message #"+modifyContentId)[0].style.height = textareaHeight+"px";
    }
