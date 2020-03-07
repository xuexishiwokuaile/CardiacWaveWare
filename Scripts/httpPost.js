function homeAddress(){
	var addressHead = window.location.href;
	var index = addressHead.indexOf("http://");
	if(index!=0)
		return "http://iss.whu.edu.cn/";
	addressHead = addressHead.substr(7);
	index = addressHead.indexOf("/");
	if(index<0)
		return "http://"+addressHead+"/";
	addressHead = addressHead.substr(0,index+1);
	return "http://"+addressHead;
}

//这里定义了一个构造函数
var sendHttpMessageType = function(httpObj){
    var belong=this;
    this.httpObject = httpObj;
    this.xmlhttp=null;
    this.state_Change=function(){        
        if (belong.xmlhttp.readyState==4){// 4 = "loaded"
            if (belong.xmlhttp.status==200){// 200 = OK
                belong.httpObject.callBack(belong.xmlhttp.responseText);   
            }
	    else{
                alert("Problem retrieving XML data");
	    }
        }
    };
    if (window.XMLHttpRequest){// code for all new browsers
        this.xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject){// code for IE5 and IE6
        this.xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    this.doSend = function(){
        if (this.xmlhttp!=null){
            this.xmlhttp.onreadystatechange=this.state_Change;                
            this.xmlhttp.open("POST", this.httpObject.URLStr, true);
            this.xmlhttp.setRequestHeader("Content-Type", "text/html; charset=utf-8");
            this.xmlhttp.send(this.httpObject.messageStr);
        }
        else{
            alert("Your browser does not support XMLHTTP.");
        }
    };
}

function sendMessage(httpObj){
    var obj = new sendHttpMessageType(httpObj);    
    obj.doSend();
}



//这里定义了一个构造函数
/*    var httpObjectType = function(infoType, pageNumber, pageSize,contentDiv,navigateDiv,tableWidth){
        this.messageStr = "template=showArticleListPage.template"+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"&infoType="+infoType+"&contentDiv="+contentDiv+"&navigateDiv="+navigateDiv+"&tableWidth="+tableWidth;
        this.URLStr = homeAddress()+"cgi-bin/IssService.cgi?serviceName=dynamicPage()";
	this.contentDiv=contentDiv;
        this.navigateDiv=navigateDiv;
        var passv = this;
        this.callBack = function(htmlstr){
            var pos= htmlstr.indexOf("$^@^$");
            var str1 = htmlstr.substring(0,pos);
            var str2 = htmlstr.substring(pos+5);
            $(passv.contentDiv).html(str1);          
            $(passv.navigateDiv).html(str2);          
        };
    }



function initPage1(infoType, pageNumber, pageSize,contentDiv,navigateDiv,tableWidth){
    var httpObject = new httpObjectType(infoType, pageNumber, pageSize,contentDiv,navigateDiv,tableWidth);
    sendMessage(httpObject);
}*/
