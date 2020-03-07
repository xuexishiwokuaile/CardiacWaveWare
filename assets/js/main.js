jQuery(document).ready(function() {
	
//头部
	var header = new Array();
	var headerResult = function(){

		jQuery("#header").html(header[0]);
	}
	getFromWS("home/getHeader.template","operation=all",header,headerResult,false);


//尾部
	var footer = new Array();
	var footerResult = function(){

		jQuery("#footer").html(footer[0]);
	}
	getFromWS("home/getFooter.template","",footer,footerResult,false);


//导航栏中的新闻中心模块
	var news = new Array();
	var newsResult = function(){
		jQuery(".wp #mn_P5_menu").html(news[0]);
	    jQuery('.flexslider').flexslider({
			directionNav: true,
			pauseOnAction: false
	        });
	}
	getFromWS("home/getColumn.template","type=news",news,newsResult);

//导航栏中的地名文化模块
	var cultrue = new Array();
	var cultrueResult = function(){
		jQuery(".wp #mn_P2_menu").html(cultrue[0]);
	    jQuery('.flexslider').flexslider({
			directionNav: true,
			pauseOnAction: false
	        });
	}
	getFromWS("home/getColumn.template","type=cultrue",cultrue,cultrueResult);

//导航栏中的公众互动模块
	var publicInteraction = new Array();
	var publicInteractionResult = function(){
		jQuery(".wp #mn_P1_menu").html(publicInteraction[0]);
	    jQuery('.flexslider').flexslider({
			directionNav: true,
			pauseOnAction: false
	        });
	}
	getFromWS("home/getColumn.template","type=publicInteraction",publicInteraction,publicInteractionResult);

//导航栏中的旅游推荐模块
	var travelInfo = new Array();
	var travelInfoResult = function(){
		jQuery(".wp #mn_P3_menu").html(travelInfo[0]);
	    jQuery('.flexslider').flexslider({
			directionNav: true,
			pauseOnAction: false
	        });
	}
	getFromWS("home/getColumn.template","type=travelInfo",travelInfo,travelInfoResult);
//导航栏中的下载中心模块
	var downloadCenter = new Array();
	var downloadCenterResult = function(){
		jQuery(".wp #mn_P6_menu").html(downloadCenter[0]);
	    jQuery('.flexslider').flexslider({
			directionNav: true,
			pauseOnAction: false
	        });
	}
	getFromWS("home/getColumn.template","type=downloadCenter",downloadCenter,downloadCenterResult);

//导航栏中的地名成果模块
	var placeResult = new Array();
	var placeResultResult = function(){
		jQuery(".wp #mn_P4_menu").html(placeResult[0]);

	}
	getFromWS("home/getColumn.template","type=placeResult",placeResult,placeResultResult);


//底部新闻导航
	var newsBottom = new Array();
	var newsBottomResult = function(){
		jQuery("#newsBottom").html(newsBottom[0]);

	}
	getFromWS("home/getColumn.template","type=newsBottom",newsBottom,newsBottomResult);
//底部文化导航
	var cultureBottom = new Array();
	var cultureBottomResult = function(){
		jQuery("#cultureBottom").html(cultureBottom[0]);

	}
	getFromWS("home/getColumn.template","type=cultureBottom",cultureBottom,cultureBottomResult);
//底部公众互动导航
	var publicInteractionBottom = new Array();
	var publicInteractionBottomResult = function(){
		jQuery("#publicInteractionBottom").html(publicInteractionBottom[0]);

	}
	getFromWS("home/getColumn.template","type=publicInteractionBottom",publicInteractionBottom,publicInteractionBottomResult);

//底部旅游推荐模块
	var travelInfoBottom = new Array();
	var travelInfoBottomResult = function(){
		jQuery("#travelInfoBottom").html(travelInfoBottom[0]);

	}
	getFromWS("home/getColumn.template","type=travelInfoBottom",travelInfoBottom,travelInfoBottomResult);

//放置图片  可放在main.js里面供多个页面调用
	var searchPictures = new Array();
	var processPicResult = function () {
		jQuery("#indexPic4").html(searchPictures[3]); 
		jQuery("#indexPic1").html(searchPictures[0]);
		
	}
	getFromWS("home/getPictureList.template", "", searchPictures, processPicResult);

});
function getUrlString(name) {
   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
   var r = window.location.search.substr(1).match(reg);
   if (r!=null) return unescape(r[2]); return "";
}
function goToPage(value){
	var articleList = new Array();
	var articleListResult = function(){
		jQuery("#articleList").html(articleList[0]);
		jQuery("#deanpage").html(articleList[1]);

	}
	var type = getUrlString("id");
	var paras = "operation=getArticleList";
	paras += "$^@^$type=" + type;
	paras += "$^@^$pageNumber=" + value;
	getFromWS("home/getNews.template",paras,articleList,articleListResult);
}
function goToPage_culture(value){

	var cultureList = new Array();
	var cultureListResult = function(){
		jQuery("#cultureList").html(cultureList[0]);
		jQuery("#deanpage").html(cultureList[1]);
	}
	var type = getUrlString("id");
	var level = getUrlString("level");
	var paras = "operation=getCultureList";
	paras += "$^@^$type=" + type;
	paras += "$^@^$level=" + level;
	paras += "$^@^$pageNumber=" + value;
	//alert(paras);
	getFromWS("home/getCulture.template",paras,cultureList,cultureListResult);
}

function goToPage_search(value){

	var searchCondition = decodeURI(getUrlString("searchCondition"));
	document.getElementById("search_condition").innerHTML = searchCondition;
	var searchResult = new Array();
	var processSearchResult = function(){
		if("" == searchCondition || null == searchCondition){
			jQuery("#searchResultList").html(searchResult[0]);								
		}else{
			var reg = new RegExp("(" + searchCondition + ")", "g"); 			
			jQuery("#searchResultList").html(searchResult[0].replace(reg, "<font color=red>$1</font>"));///改				
			jQuery("#scbar_txt").val(searchCondition);
			jQuery("#scbar_txt1").val(searchCondition);
		}
		jQuery("#deanpage").html(searchResult[1]);
	}
	var parash = "operation=getSearchList";
	parash += "$^@^$searchCondition=" + searchCondition;
	parash += "$^@^$pageNumber=" + value;
	//alert(parash);
  	getFromWS("home/getSearchResult.template",parash,searchResult,processSearchResult);

}
//点击搜索按钮
function btnAction(){
		//alert("进入点击事件");
		var searchInput = jQuery("#scbar_txt").val().trim();
		window.location.href = encodeURI(encodeURI("search.html?searchCondition="+searchInput));
		
}

function goToPage_searchPlaceInfo(value){//查询地名时点击跳转页面函数
		//如果未输入任何查询内容		
		if(jQuery("#search_placeName").val()==""){
			var searchResult = new Array();
			var processSearchResult = function(){
	
					//var reg = new RegExp("(" + search_placeName + ")", "g"); 			
					jQuery("#searchResultList").html(searchResult[0]);				
					//jQuery("#search_placeName").val(search_placeName);
					jQuery("#deanpage").html(searchResult[1]);
						

			}
			var parash = "operation=" + document.getElementById("search_category").innerHTML;
			parash += "$^@^$search_placeName=" + " ";  
			parash += "$^@^$pageNumber=" + value;
		  	getFromWS("home/getSearchPlaceNameList.template",parash,searchResult,processSearchResult);	

		}
		//if(null ==search_placeName || !search_placeName || ""==search_placeName){					
		//	alert("请输入查询的地名");			
		//}
		else{	
			var search_placeName = jQuery("#search_placeName").val().trim();	
			var searchResult = new Array();
			var processSearchResult = function(){
	
					//var reg = new RegExp("(" + search_placeName + ")", "g"); 			
					jQuery("#searchResultList").html(searchResult[0]);				
					jQuery("#search_placeName").val(search_placeName);
					jQuery("#deanpage").html(searchResult[1]);
						

			}
			var parash = "operation=" + document.getElementById("search_category").innerHTML;
			parash += "$^@^$search_placeName=" + search_placeName;
			parash += "$^@^$pageNumber=" + value;
		  	getFromWS("home/getSearchPlaceNameList.template",parash,searchResult,processSearchResult);	

		}	
}



