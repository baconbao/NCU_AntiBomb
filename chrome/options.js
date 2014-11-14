/*---
中大宿網防爆精靈 v1.0.1 by BaconBao (http://baconbao.com)
---*/

function set2default(){
	localStorage["setting-interval"] = 10;
	localStorage["setting-max"] = 2.5;
}

function set2now(){
	$('#infobox').text('');
	$('#v1').val(localStorage["setting-interval"]);
	$('#v2').val(localStorage["setting-max"]);
	$('#s1').text(localStorage["setting-interval"]);
	$('#s2').text(localStorage["setting-max"]);
}

function setIp2now(){
	$('#infobox').text('');
	$('#v0a').val(localStorage["setting-ip-a"]);
	$('#v0b').val(localStorage["setting-ip-b"]);
}

function checkIpFirst(){
	if(localStorage["setting-ip-a"]==null || localStorage["setting-ip-b"]==null || (localStorage["setting-ip-a"]==0 && localStorage["setting-ip-b"]==0)){
		localStorage["setting-ip-a"] = 0;
		localStorage["setting-ip-b"] = 0;
		$('#v0a').val(localStorage["setting-ip-a"]);
		$('#v0b').val(localStorage["setting-ip-b"]);
		$('#detailsetting').hide();
	}else{
		setIp2now();
		$('#detailsetting').show();
	}
}

function ifShowMsg(){
	if(localStorage["record"]==null){
		$('#msg').hide();
	}else{
		$('#msg').show();
		$('#msg').html('您最近一次查詢的24小時宿網校外上傳總量為 <b>'+localStorage["record"]+'GB</b>');
		$('#msg').css('margin-bottom','30px');	
	}
}

$(document).ready(function(){
	ifShowMsg();
	$('#subtit1').hide();
	$('#subtit2').hide();
	$('#btn-again').hide();
	checkIpFirst();
	if(localStorage["setting-interval"]==null){
		set2default();
	}
	set2now();
	$(".ipset").bind('input propertychange', function(){
		$('#btn-again').show();
		$('#infobox').text('');
	});
	$(".range-input").bind('input propertychange', function() {
		$('#btn-again').show();
		$('#infobox').text('');
		var val = $(this).val();
		$($(this).attr('tarSpan')).text(val);
	});
	$('#btn-again').click(function(){
		$(this).hide();
		set2now();
		setIp2now();
	});
	$('#btn-save').click(function(){
		localStorage["setting-ip-a"] = parseInt($('#v0a').val());
		localStorage["setting-ip-b"] = parseInt($('#v0b').val());
		if(localStorage["setting-ip-a"]=='NaN') localStorage.removeItem("setting-ip-a");
		if(localStorage["setting-ip-b"]=='NaN') localStorage.removeItem("setting-ip-b");
		localStorage["setting-interval"] = $('#v1').val();
		localStorage["setting-max"] = $('#v2').val();
		setIp2now();
		set2now();
		checkIpFirst();
		$('#infobox').text('完成！');
		chrome.extension.getBackgroundPage().window.location.reload();
	});
	$('#btn-reboot').click(function(){
		if( confirm("確定要恢復預設值嗎？") ){
			set2default();
			set2now();
		}else{}
	});
	$("#v1").hover(function () {
    	$('#tit1').hide();
    	$('#subtit1').show();
	},function () {
    	$('#tit1').show();
    	$('#subtit1').hide();
	});
	$("#v2").hover(function () {
    	$('#tit2').hide();
    	$('#subtit2').show();
	},function () {
    	$('#tit2').show();
    	$('#subtit2').hide();
	});
});