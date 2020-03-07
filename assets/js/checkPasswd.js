<script type="text/javascript" src="/assets/js/toastr/toastr.min.js"></script>
<script type="text/javascript" src="/assets/js/md5.min.js"></script>
	var opt_passwd = {
		"closeButton": true,
		"debug": false,
		"positionClass": "toast-bottom-right",
		"onclick": null,
		"showDuration": "300",
		"hideDuration": "1000",
		"timeOut": "5000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	};
	var loginName = sessionStorage.getItem("loginName");
	var passwd = md5("123456");
	var obj = new Array();
	var process = function(){
		if(obj[0] == 1){
			toastr.success("您的密码为初始密码，请修改密码", "请修改密码", opt_passwd);
		}
	}
	getFromWS("Home/checkPasswd.template","loginName="+loginName+"$^@^$passwd="+passwd,obj,process);

