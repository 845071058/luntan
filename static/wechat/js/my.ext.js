// var host = "http://7wc9tr.natappfree.cc"
var host = "http://ts.ghgdes.com.cn:8003"
var consts = {
	cookie_prefix: "sd_wechat_",
	cookie_expires: 2, //设置cookie的有效时间
}
function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null)
			return decodeURIComponent(r[2]);
		return null;
}
function setCookie(key, value, t) {
	var cookie_key = consts.cookie_prefix + key;
	var oDate;
	if (!t) {
		oDate = new Date(0x7fffffff * 1e3);
	} else {
		oDate = new Date();
		oDate.setHours(oDate.getHours() + Number(t));
	}
	document.cookie = cookie_key + '=' + value + ';expires=' + oDate.toGMTString() + ';path=/';
}
//删除cookie    
function delCookie(key) {ZZ
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = module.exports.getCookie(key);
	var cookie_key = consts.cookie_prefix + key;
	if (cval != null) {
		document.cookie = cookie_key + '=' + cval + ';expires=' + exp.toGMTString() + ';path=/';
	}
}

//获得cookie
function getCookie(key) {
	var cookie_key = consts.cookie_prefix + key;

	var arr1 = document.cookie.split('; ');
	for (var i = 0; i < arr1.length; i++) {
		var arr2 = arr1[i].split('=');
		if (arr2[0] == cookie_key) {
			return decodeURI(arr2[1]);
		}
	}

}