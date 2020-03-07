var totalPages = 0;
var curPage = 1;
var serviceURL;
var templateFileDir;
$(function() {
    var xmlDoc = null;//loadXml("Scripts/conf.xml");
    serviceURL = readNode(xmlDoc, "serviceURL");
    templateFileDir = readNode(xmlDoc, "templateFileDir");
})
function initPage(type, pageSize, contentPos, pagePos) {
    if (curPage == null) {
        curPage = 1;
    } else {
        curPage = parseInt(curPage);
    }
    show(type, pageSize, contentPos, pagePos);
}
function show(type1, pageSize1, contentPos, pagePos) {
    var soapBody = new SOAPObject("ns1:getTotalPageByType"); //Create a new request object
    var type = new SOAPObject("ns1:type")
    type.val(type1);
    var pageSize = new SOAPObject("ns1:pageSize")
    pageSize.val(pageSize1);

    soapBody.appendChild(type);
    soapBody.appendChild(pageSize);
    var sr = new SOAPRequest("MyAction", soapBody); //Request is ready to be sent
    sr.addNamespace("ns1", "http://service.mt.iss")
    //Lets send it
    SOAPClient.Proxy = serviceURL+"PublishArticleService"; //Specify web-service address or a proxy file
    //alert(sr);
    SOAPClient.SendRequest(sr, processResponse); //Send request to server and assign a callback
    function processResponse(respObj) {
        totalPages = parseInt(respObj);
        showOnePageArticleList(type1, pageSize1, curPage, templateFileDir+"showArticleListByType.template", contentPos);
        var pagestr = "";
        //var selectedIndex = document.getElementById("selectPage").selectedIndex+1;
        if (totalPages <= 1)
            pagestr += "<span>首页</span>   <span>上一页</span>   <span>第" + curPage + "页/共" + totalPages + "页</span>   <span>下一页</span>   <span>尾页</span>";
        else if (curPage == 1) {
            pagestr += "<span>首页</span>   <span>上一页</span>   <span>第" + curPage + "页/共" + totalPages + "页</span>   <span><a href=\"javascript:" + "this" + ".page_onclick(" + (this.curPage + 1) + ",'" + type1 + "'," + pageSize1 + ",'" + contentPos + "','" + pagePos + "')\">下一页</a></span>   <span><a href=\"javascript:" + "this" + ".page_onclick(" + (this.totalPages) + ",'" + type1 + "'," + pageSize1 + ",'" + contentPos + "','" + pagePos + "')\">尾页</a></span>";
        }
        else if (curPage == totalPages) {
            pagestr += "<span><a href=\"javascript:" + "this" + ".page_onclick(1" + ",'" + type1 + "'," + pageSize1 + ",'" + contentPos + "','" + pagePos + "')\">首页</a></span>   <span><a href=\"javascript:" + "this" + ".page_onclick(" + (this.curPage - 1) + ",'" + type1 + "'," + pageSize1 + ",'" + contentPos + "','" + pagePos + "')\">上一页</a></span>   <span>第" + curPage + "页/共" + totalPages + "页</span>   <span>下一页</span>   <span>尾页</span>";
        }
        else {
            pagestr += "<span><a href=\"javascript:" + "this" + ".page_onclick(1" + ",'" + type1 + "'," + pageSize1 + ",'" + contentPos + "','" + pagePos + "')\">首页</a></span>   <span><a href=\"javascript:" + "this" + ".page_onclick(" + (this.curPage - 1) + ",'" + type1 + "'," + pageSize1 + ",'" + contentPos + "','" + pagePos + "')\">上一页</a></span>   <span>第" + curPage + "页/共" + totalPages + "页</span>   <span><a href=\"javascript:" + "this" + ".page_onclick(" + (this.curPage + 1) + ",'" + type1 + "'," + pageSize1 + ",'" + contentPos + "','" + pagePos + "')\">下一页</a></span>   <span><a href=\"javascript:" + "this" + ".page_onclick(" + (this.totalPages) + ",'" + type1 + "'," + pageSize1 + ",'" + contentPos + "','" + pagePos + "')\">尾页</a></span>";
        }
        pagestr += "<span><select id=\"selectPage\" onchange=\"chg('" + type1 + "'," + pageSize1 + ",'" + contentPos + "','" + pagePos + "')\">";
        //alert(totalPages);
        for (i = 1; i <= totalPages; i++) {
            if (i == curPage)
                pagestr += "<option selected>" + i + "</option>";
            else
                pagestr += "<option>" + i + "</option>";
        }
        pagestr += "</select></span>";
        $(pagePos).html(pagestr);
    }


}
this.page_onclick = function(num, type, pageSize, contentPos, pagePos) {
    this.curPage = num;
    this.initPage(type, pageSize, contentPos, pagePos);
}
this.chg = function(type, pageSize, contentPos, pagePos) {
    var page = document.getElementById("selectPage").selectedIndex + 1;
    page_onclick(page, type, pageSize, contentPos, pagePos);
}
function showOnePageArticleList(type1, linesInPage1, pageNum1, templateFile1, position1) {
	//alert(templateFile1);
    var soapBody = new SOAPObject("ns1:showArtListByPage"); //Create a new request object
    var type = new SOAPObject("ns1:type")
    type.val(type1);
    var linesInPage = new SOAPObject("ns1:linesInPage")
    linesInPage.val(linesInPage1);
    var pageNum = new SOAPObject("ns1:pageNum")
    pageNum.val(pageNum1);
    var templateFile = new SOAPObject("ns1:templateFile")
    templateFile.val(templateFile1);
    soapBody.appendChild(type);
    soapBody.appendChild(linesInPage);
    soapBody.appendChild(pageNum);
    soapBody.appendChild(templateFile);
    var sr = new SOAPRequest("MyAction", soapBody); //Request is ready to be sent
    sr.addNamespace("ns1", "http://service.mt.iss")
    //Lets send it
    SOAPClient.Proxy = serviceURL+"ShowArticleService"; //Specify web-service address or a proxy file
    SOAPClient.SendRequest(sr, processResponse); //Send request to server and assign a callback
    function processResponse(respObj) {
        $(position1).html(respObj);
    }
}
