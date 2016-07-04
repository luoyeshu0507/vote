/*support old jquery $.browser for tcounter.js*/
+(function(){
	jQuery.extend({  
	    browser: function()   
	    {
	        var  
	        rwebkit = /(webkit)\/([\w.]+)/,  
	        ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,  
	        rmsie = /(msie) ([\w.]+)/,  
	        rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,      
	        browser = {},  
	        ua = window.navigator.userAgent,  
	        browserMatch = uaMatch(ua);  
	  
	        if (browserMatch.browser) {  
	            browser[browserMatch.browser] = true;  
	            browser.version = browserMatch.version;  
	        }  
	        return { browser: browser };  
	    },  
	});  
	function uaMatch(ua)   
	{  
	        ua = ua.toLowerCase();  
	  
	        var match = rwebkit.exec(ua)  
	                    || ropera.exec(ua)  
	                    || rmsie.exec(ua)  
	                    || ua.indexOf("compatible") < 0 && rmozilla.exec(ua)  
	                    || [];  
	  
	        return {  
	            browser : match[1] || "",  
	            version : match[2] || "0"  
	        };  
	}
})();

/* index page */
$(function(){
	if(!$("body").hasClass('pili-delivery')) return;
	var nowTime=new Date(backLiveData.currentTime);
	var serverDiff = new Date()-nowTime;
	var $switcher=$(".switcher");
	var $tabs=$(".tabs-wrap .tab");
	var $self=null;
	var config=null;
	var liveName='';
	var sTime=null;
	var liveData={
		video:{
			index:0,
			started:false
		},
		studio:{
			index:1,
			started:false
		}
	};
	for(var k in liveData){
		liveData[k].errorMsg=backLiveData[k].errorMsg;
		sTime=new Date(backLiveData[k].startTime)*1+serverDiff;
		sTime=new Date(sTime);
		// sTime=new Date(-(-new Date()-3000)); /* debug */
		liveData[k].startTime=''+sTime.getFullYear()+'__regexoperators___/'+(sTime.getMonth()+1)+'/'+sTime.getDate()+' '+sTime.getHours()+':'+sTime.getMinutes()+':'+sTime.getSeconds();
	}
	$switcher.on("click","span",function(){
		$self=$(this);
		if($self.hasClass('on')) return;
		for(var k in liveData){
			liveData[k].video && liveData[k].video.pause();
		}
		$self.addClass('on').siblings().removeClass('on');
		$tabs.eq($self.index()).addClass('on').siblings().removeClass('on');
	});

    $(".timer").each(function(){
    	var $self=$(this);
    	var liveName=$self.data("name");
    	var features=['playpause','progress','tracks','volume','fullscreen'];
    	// if(!!window.ActiveXObject || "ActiveXObject" in window){
     //    	features.pop();
     //    }
    	config = {
	        timeText: liveData[liveName].startTime, //倒计时时间
	        timeZone: -nowTime.getTimezoneOffset() / 60, //时区
	        style: "flip", //显示的样式，可选值有flip,slide,metal,crystal
	        color: "black", //显示的颜色，可选值white,black
	        width: 0, //倒计时宽度
	        textGroupSpace: 15, //天、时、分、秒之间间距
	        textSpace: 0, //数字之间间距
	        reflection: false, //是否显示倒影
	        dayTextNumber: 2, //倒计时天数数字个数
	        displayDay: !0, //是否显示天数
	        displayHour: !0, //是否显示小时数
	        displayMinute: !0, //是否显示分钟数
	        displaySecond: !0, //是否显示秒数
	        displayLabel: !0, //是否显示倒计时底部label
	        onFinish: function() {
	        	if(liveData[liveName].errorMsg){
	        		$self.parent().hide().next().html(liveData[liveName].errorMsg).show();
	        	} else{
	        		liveData[liveName].started=true;
	        		var $videoEle=$("#live-"+liveName);
	        		var w=$(window).width();
	        		var src=$videoEle.attr("src");
	        		if(w<700){
	        			if($videoEle.data("landscape")){
	        				$videoEle.attr({
	        					"width":w,
	        					"height":Math.round(w*450/720),
	        					"src":src.replace("pili-live-hdl","pili-live-hls").replace(".flv",".m3u8")
	        				});
	        			}
	        		}
	        		liveData[liveName].video=new MediaElementPlayer("#live-"+liveName,{
				        alwaysShowControls: false,
				        enableAutosize: true,
				        features: features,
				        success:function(){
				            console.log('success');
				        },
				        error:function(){
				            console.log('error');
				        }
				    });
	        		$self.parent().hide().next().next().show();
	        	}
	        }
        };
        $self.jCountdown(config);
    });
});
