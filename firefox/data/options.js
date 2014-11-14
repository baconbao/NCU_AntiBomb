self.port.on('options', function (msg) {

	function set2default(){
		$('#v1').val(10);
		$('#v2').val(2.5);
		$('#s1').text(10);
		$('#s2').text(2.5);
	}

	function set2now(){
		$('#infobox').text('');
		$('#v1').val(msg.inter);
		$('#v2').val(msg.maxnum);
		$('#s1').text(msg.inter);
		$('#s2').text(msg.maxnum);
	}

	function setIp2now(){
		$('#infobox').text('');
		$('#v0a').val(msg.ipA);
		$('#v0b').val(msg.ipB);
	}

	function checkIpFirst(){
		if(msg.ipA==null || msg.ipB==null || (msg.ipA==0 && msg.ipB==0)){
			$('#v0a').val(0);
			$('#v0b').val(0);
			$('#detailsetting').hide();
		}else{
			setIp2now();
			$('#detailsetting').show();
		}
	}

	function ifShowMsg(){
		if(msg.record==null){
			$('#msg').hide();
		}else{
			$('#msg').show();
			$('#msg').html('您最近一次查詢的24小時宿網校外上傳總量為 <b>'+msg.record+' GB</b>');
			$('#msg').css('margin-bottom','30px');	
		}
	}

	$(document).ready(function(){
		ifShowMsg();
		$('#subtit1').hide();
		$('#subtit2').hide();
		$('#btn-again').hide();
		checkIpFirst();
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
			var tmpIpA = parseInt($('#v0a').val());
			var tmpIpB = parseInt($('#v0b').val());
			if(tmpIpA=='NaN') tmpIpA = 0;
			if(tmpIpB=='NaN') tmpIpB = 0;
			var tmpInter = $('#v1').val();
			var tmpMax = $('#v2').val();
			$('#infobox').text('完成！');
			self.port.emit('settingchange', {ipA: tmpIpA, ipB: tmpIpB, inter: tmpInter, maxnum: tmpMax});
		});
		$('#btn-reboot').click(function(){
			if( confirm("確定要恢復預設值嗎？") ){
				set2default();
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

});