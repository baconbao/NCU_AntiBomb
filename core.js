/*---
中大宿網防爆精靈 v1.0.0 by BaconBao (http://baconbao.com)
---*/

var interval;
var min;
run();

function run(){
	if(localStorage["setting-interval"]==null){
		set2default();
	}
	min = parseInt(localStorage["setting-interval"]);
	if(localStorage["setting-ip-a"]==null || localStorage["setting-ip-b"]==null || (localStorage["setting-ip-a"]==0 && localStorage["setting-ip-b"]==0)){
		chrome.tabs.create({ url:chrome.extension.getURL('options.html') });
		chrome.notifications.create('ncuAntiBomb'+new Date().getTime(),
			{
			  type: "basic",
			  title: "初次使用請設定您的宿網IP！",
			  message: "點擊本工具按鈕即可進入設定。",
			  iconUrl: "img/NCU_AntiBomb_logo.png"
			},function(){}
		)
	}else{
		getData();
	}
	if(min<=0||!min) clearInterval(interval);
	interval = setInterval(run, min*60*1000);
}

function getData(){
	var ajax = new XMLHttpRequest();
	var ip_a = parseInt(localStorage["setting-ip-a"]);
	var ip_b = parseInt(localStorage["setting-ip-b"]);
	var params = 'ip=140.115.'+ip_a.toString()+'.'+ip_b.toString()+'&submit=Submit';
	ajax.open("POST", 'https://uncia.cc.ncu.edu.tw/dormnet/index.php?section=netflow', true);
	ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	ajax.onreadystatechange = function() {
		if (ajax.readyState == 4) {
			var t_end = ajax.responseText.toString().indexOf(' GB');
			var t_start = ajax.responseText.toString().lastIndexOf('(', t_end);
			var needText = ajax.responseText.toString().substring(t_start+1, t_end);
			needText = parseFloat(needText);
			if(needText>=localStorage["setting-max"]){
				if(needText>=3){
					chrome.browserAction.setBadgeBackgroundColor({color:[25, 25, 25, 255]});
				}else{
					chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 255]});
					chrome.notifications.create('ncuAntiBomb'+new Date().getTime(),
						{
						  type: "basic",
						  title: "【小心】宿網用量達到警戒值！",
						  message: "宿網用量已經到達您的警戒值，快要爆炸囉！",
						  iconUrl: "img/NCU_AntiBomb_sos_logo.png"
						},function(){}
					)
				}
			}else{
				chrome.browserAction.setBadgeBackgroundColor({color:[0, 180, 0, 255]});
			}
			if(needText.toString()=='NaN'){
				chrome.browserAction.setBadgeBackgroundColor({color:[25, 25, 25, 255]});
			}else{
				localStorage["record"] = needText.toString();
			}
			chrome.browserAction.setBadgeText({text: needText.toString()});
		}
	}
	ajax.send(params);
}

function set2default(){
	localStorage["setting-interval"] = 10;
	localStorage["setting-max"] = 2.5;
}

chrome.browserAction.onClicked.addListener(function(tab) {
	run();
	var pageTab={ url:chrome.extension.getURL('options.html')};
	if(tab) pageTab.index = tab.index+1;
	chrome.tabs.create(pageTab);
});
