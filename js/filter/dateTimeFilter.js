var filterService = angular.module('projectTool.dateTimeFilter', []);

filterService.filter('timeElapsed', function() {
	var timeElapsedFilter = function(input) {
		return (new Date()).getDiff(input);
	};
	return timeElapsedFilter;
});

filterService.filter('duration', function() {
	var curationFilter = function(input) {
		return getDuration(input);
	};
	return curationFilter;
});


filterService.filter('dateTime', function() {
	var dateTimeFilter = function(input) {
		if (input == undefined)
			return "";
		return (new Date(input)).customFormat( "#YYYY#-#MM#-#DD# #hh#:#mm#:#ss#" );
	};
	return dateTimeFilter;
});

Date.prototype.customFormat = function(formatString){
    var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
    var dateObject = this;
    YY = ((YYYY=dateObject.getFullYear())+"").slice(-2);
    MM = (M=dateObject.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
    DD = (D=dateObject.getDate())<10?('0'+D):D;
    DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dateObject.getDay()]).substring(0,3);
    th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);

    h=(hhh=dateObject.getHours());
    if (h==0) h=24;
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
    mm=(m=dateObject.getMinutes())<10?('0'+m):m;
    ss=(s=dateObject.getSeconds())<10?('0'+s):s;
    return formatString.replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
};

var getDuration = function(time) {
	var duration = "";
	var cd = 24 * 60 * 60 * 1000;
    var ch = 60 * 60 * 1000;
    var d = Math.floor(time / cd);
    if (d == 1) {
    	duration += d + " day ";
    } else if (d > 1) {
    	duration += d + " days ";
    }
    var h = Math.floor( (time - d * cd) / ch);
    if (h == 1) {
    	duration += h + " hour ";
    } else if (h > 1) {
    	duration += h + " hours ";
    }
    var m = Math.floor( (time - d * cd - h * ch) / 60000);
    if (m == 1) {
    	duration += m + " minute ";
    } else if (m > 1) {
    	duration += m + " minutes ";
    }
    var s = Math.round( (time - d * cd - h * ch - m * 60000) / 1000);
    if (s == 1) {
    	duration += s + " second ";
    } else if (s > 1) {
    	duration += s + " seconds ";
    }
    return duration;

};

Date.prototype.getDiff = function(date) {
	var dateObject = this;
	var diff = date - dateObject.getTime();

};
