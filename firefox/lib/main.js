const self = require("sdk/self");
const data = self.data;
const Request = require('sdk/request').Request;
const pageWorker = require('sdk/page-worker');
const timers = require('sdk/timers');
const toolbarButton = require('toolbarbutton/toolbarbutton').ToolbarButton;
const notifications = require('sdk/notifications');
const ss = require('sdk/simple-storage');
const tabs = require("sdk/tabs");

if (self.loadReason === 'install') {
    delete ss.storage.ipa;
    delete ss.storage.ipb;
    delete ss.storage.inter;
    delete ss.storage.maxnum;
    delete ss.storage.record;
}

const notifUrl = 'https://uncia.cc.ncu.edu.tw/dormnet/index.php?section=netflow';
if(!ss.storage.inter) ss.storage.inter = 10;
var updateInterval = 1000 * 60 * ss.storage.inter;
if(!ss.storage.maxnum) ss.storage.maxnum = 2.5;

var timerID = 0;

function before_openOptions(){
    var if_open = true;
    for each (var onetab in tabs){
        if(onetab.url.match('resource://ncu-antibomb-at-baconbao/')){
            if_open = false;
            onetab.activate();
            break;
        }
    }
    if(if_open) openOptions();
}

function openOptions(){
    tabs.open({
      url: data.url("options.html"),
      onReady: function(tab) {
        var worker = tab.attach({
            contentScriptFile: [data.url("options.js"), data.url("lib/javascript/jquery.min.js")]
        });
        worker.port.emit('options', {ipA: ss.storage.ipa, ipB: ss.storage.ipb, inter: ss.storage.inter, maxnum: ss.storage.maxnum, record: ss.storage.record});
        worker.port.on('settingchange', function (rd) {
            ss.storage.ipa = rd.ipA;
            ss.storage.ipb = rd.ipB;
            ss.storage.inter = rd.inter;
            ss.storage.maxnum = rd.maxnum;
            timers.clearInterval(timerID);
            updateInterval = 1000 * 60 * ss.storage.inter;
            timerID = timers.setInterval(update, updateInterval);
            update();
            tab.close();
        });
      }
    });
}

let tbb = toolbarButton({
    id: 'ncu-anti-bomb',
    label: 'ncu-anti-bomb',
    tooltiptext: '中大宿網防爆精靈',
    image: data.url('logo.ico'),
    onCommand: function () {
        update();
        before_openOptions();
    }
});

tbb.moveTo({
    toolbarID: 'nav-bar',
    forceMove: false
});

function update() {
    if(!ss.storage.ipa) ss.storage.ipa = 0;
    if(!ss.storage.ipb) ss.storage.ipb = 0;
    if(ss.storage.ipa==0 && ss.storage.ipb==0){
        before_openOptions();
        timers.clearInterval(timerID);
        notifications.notify({
            title: "初次使用請設定您的宿網IP！",
            text: "點擊本工具按鈕即可進入設定。",
            data: "點擊本工具按鈕即可進入設定。",
            iconURL: data.url('img/NCU_AntiBomb_logo.png')
        });
    }else{
        Request({
            url: notifUrl,
            content: 'ip=140.115.'+ss.storage.ipa.toString()+'.'+ss.storage.ipb.toString()+'&submit=Submit',
            onComplete: function (response) {
                if(response.statusText=='OK') {
                    worker.port.emit('render', response.text);
                }else{
                    tbb.tooltiptext = '中大宿網防爆精靈：連線有誤...';
                    tbb.badge = {
                        text: '?',
                        color: 'rgb(88, 88, 88)'
                    }
                }
            }
        }).post();
    }
};

let worker = pageWorker.Page({
    contentScriptFile: data.url('icon.js')
});

worker.port.on('fetched-count', function (count) {
    if(count.toString()=='NaN'){
        tbb.tooltiptext = '中大宿網防爆精靈：資料有誤...';
        tbb.badge = {
            text: '',
            color: 'rgb(25, 25, 25)'
        }        
    }
    if(count>=ss.storage.maxnum){
        if(count>=3){
            tbb.tooltiptext = '中大宿網防爆精靈：爆炸了T___T';
            tbb.badge = {
                text: count,
                color: 'rgb(25, 25, 25)'
            }
        }else{
            tbb.tooltiptext = '中大宿網防爆精靈：小心囉！';
            tbb.badge = {
                text: count,
                color: 'rgb(255, 0, 0)'
            }
            notifications.notify({
                title: "【小心】宿網用量達到警戒值！",
                text: "宿網校外上傳量已經到達您的警戒值，快要爆炸囉！",
                data: "宿網校外上傳量已經到達您的警戒值，快要爆炸囉！",
                iconURL: data.url('img/NCU_AntiBomb_sos_logo.png')
            });
        }
    }else{
        tbb.tooltiptext = '中大宿網防爆精靈：當前的上傳量';
        tbb.badge = {
            text: count,
            color: 'rgb(0, 180, 0)'
        }
    }
    ss.storage.record = count;
});

timerID = timers.setInterval(update, updateInterval);
update();