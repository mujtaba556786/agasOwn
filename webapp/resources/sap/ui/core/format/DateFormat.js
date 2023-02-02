/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/CalendarType","sap/ui/core/Locale","sap/ui/core/LocaleData","sap/ui/core/date/UniversalDate","sap/ui/core/date/CalendarUtils","sap/ui/core/date/CalendarWeekNumbering","sap/ui/core/format/TimezoneUtil","sap/base/util/deepEqual","sap/base/strings/formatMessage","sap/base/Log","sap/base/util/extend","sap/ui/core/Configuration"],function(e,t,a,r,i,n,o,s,l,u,f,d){"use strict";var h=function(){throw new Error};var c={DATE:"date",TIME:"time",DATETIME:"datetime",DATETIME_WITH_TIMEZONE:"datetimeWithTimezone"};var m={};var g=function(e){if(typeof e!=="string"&&!(e instanceof String)&&e!=null){throw new TypeError("The given timezone must be a string.")}};h.oDateInfo={type:c.DATE,oDefaultFormatOptions:{style:"medium",relativeScale:"day",relativeStyle:"wide"},aFallbackFormatOptions:[{style:"short"},{style:"medium"},{pattern:"yyyy-MM-dd"},{pattern:"yyyyMMdd",strictParsing:true}],bShortFallbackFormatOptions:true,bPatternFallbackWithoutDelimiter:true,getPattern:function(e,t,a){return e.getDatePattern(t,a)},oRequiredParts:{text:true,year:true,weekYear:true,month:true,day:true},aRelativeScales:["year","month","week","day"],aRelativeParseScales:["year","quarter","month","week","day","hour","minute","second"],aIntervalCompareFields:["Era","FullYear","Quarter","Month","Week","Date"]};h.oDateTimeInfo={type:c.DATETIME,oDefaultFormatOptions:{style:"medium",relativeScale:"auto",relativeStyle:"wide"},aFallbackFormatOptions:[{style:"short"},{style:"medium"},{pattern:"yyyy-MM-dd'T'HH:mm:ss"},{pattern:"yyyyMMdd HHmmss"}],getPattern:function(e,t,a){var r=t.indexOf("/");if(r>0){return e.getCombinedDateTimePattern(t.substr(0,r),t.substr(r+1),a)}else{return e.getCombinedDateTimePattern(t,t,a)}},oRequiredParts:{text:true,year:true,weekYear:true,month:true,day:true,hour0_23:true,hour1_24:true,hour0_11:true,hour1_12:true},aRelativeScales:["year","month","week","day","hour","minute","second"],aRelativeParseScales:["year","quarter","month","week","day","hour","minute","second"],aIntervalCompareFields:["Era","FullYear","Quarter","Month","Week","Date","DayPeriod","Hours","Minutes","Seconds"]};h._getDateTimeWithTimezoneInfo=function(e){var t=e.showDate===undefined||e.showDate;var a=e.showTime===undefined||e.showTime;var r=e.showTimezone===undefined||e.showTimezone;var i=h.oDateTimeInfo;if(t&&!a){i=h.oDateInfo}else if(!t&&a){i=h.oTimeInfo}return Object.assign({},i,{type:c.DATETIME_WITH_TIMEZONE,getTimezonePattern:function(e){if(!t&&!a&&r){return"VV"}else if(!r){return e}else{return e+" VV"}},getPattern:function(e,n,o){if(!t&&!a&&r){return"VV"}if(!r){return i.getPattern(e,n,o)}var s=i.getPattern(e,n,o);return e.applyTimezonePattern(s)}})};h.oTimeInfo={type:c.TIME,oDefaultFormatOptions:{style:"medium",relativeScale:"auto",relativeStyle:"wide"},aFallbackFormatOptions:[{style:"short"},{style:"medium"},{pattern:"HH:mm:ss"},{pattern:"HHmmss"}],getPattern:function(e,t,a){return e.getTimePattern(t,a)},oRequiredParts:{text:true,hour0_23:true,hour1_24:true,hour0_11:true,hour1_12:true},aRelativeScales:["hour","minute","second"],aRelativeParseScales:["year","quarter","month","week","day","hour","minute","second"],aIntervalCompareFields:["DayPeriod","Hours","Minutes","Seconds"]};h.getInstance=function(e,t){return this.getDateInstance(e,t)};h.getDateInstance=function(e,t){return this.createInstance(e,t,this.oDateInfo)};h.getDateTimeInstance=function(e,t){return this.createInstance(e,t,this.oDateTimeInfo)};h.getDateTimeWithTimezoneInstance=function(e,a){if(e&&!(e instanceof t)){e=Object.assign({},e);if(typeof e.showTimezone==="string"){var r=e.showTimezone;if(e.showDate===undefined&&e.showTime===undefined){if(r==="Hide"){e.showTimezone=false}else if(r==="Only"){e.showDate=false;e.showTime=false}}e.showTimezone=r!=="Hide"}if(e.showDate===false&&e.showTime===false&&e.showTimezone===false){throw new TypeError("Invalid Configuration. One of the following format options must be true: showDate, showTime or showTimezone.")}}return this.createInstance(e,a,h._getDateTimeWithTimezoneInfo(e||{}))};h.getTimeInstance=function(e,t){return this.createInstance(e,t,this.oTimeInfo)};function p(e){var t=e.oLocaleData.getIntervalPattern("",e.oFormatOptions.calendarType);t=t.replace(/[^\{\}01 ]/,"-");return t.replace(/\{(0|1)\}/g,e.oFormatOptions.pattern)}h.createInstance=function(e,r,i){var o=Object.create(this.prototype);if(e instanceof t){r=e;e=undefined}if(!r){r=d.getFormatSettings().getFormatLocale()}o.oLocale=r;o.oLocaleData=a.getInstance(r);o.oFormatOptions=f({},i.oDefaultFormatOptions,e);if(i.type===c.DATETIME_WITH_TIMEZONE){o.oFormatOptions.interval=false;o.oFormatOptions.singleIntervalValue=false;o.oFormatOptions.UTC=false}else{o.oFormatOptions.showTimezone=undefined;o.oFormatOptions.showDate=undefined;o.oFormatOptions.showTime=undefined}o.type=i.type;if(!o.oFormatOptions.calendarType){o.oFormatOptions.calendarType=d.getCalendarType()}if(o.oFormatOptions.firstDayOfWeek===undefined&&o.oFormatOptions.minimalDaysInFirstWeek!==undefined||o.oFormatOptions.firstDayOfWeek!==undefined&&o.oFormatOptions.minimalDaysInFirstWeek===undefined){throw new TypeError("Format options firstDayOfWeek and minimalDaysInFirstWeek need both to be set, but only one was provided.")}if(o.oFormatOptions.calendarWeekNumbering&&!Object.values(n).includes(o.oFormatOptions.calendarWeekNumbering)){throw new TypeError("Illegal format option calendarWeekNumbering: '"+o.oFormatOptions.calendarWeekNumbering+"'")}if(!o.oFormatOptions.pattern){if(o.oFormatOptions.format){o.oFormatOptions.pattern=o.oLocaleData.getCustomDateTimePattern(o.oFormatOptions.format,o.oFormatOptions.calendarType)}else{o.oFormatOptions.pattern=i.getPattern(o.oLocaleData,o.oFormatOptions.style,o.oFormatOptions.calendarType)}}if(o.oFormatOptions.interval){if(o.oFormatOptions.format){o.intervalPatterns=o.oLocaleData.getCustomIntervalPattern(o.oFormatOptions.format,null,o.oFormatOptions.calendarType);if(typeof o.intervalPatterns==="string"){o.intervalPatterns=[o.intervalPatterns]}o.intervalPatterns.push(o.oLocaleData.getCustomDateTimePattern(o.oFormatOptions.format,o.oFormatOptions.calendarType))}else{o.intervalPatterns=[o.oLocaleData.getCombinedIntervalPattern(o.oFormatOptions.pattern,o.oFormatOptions.calendarType),o.oFormatOptions.pattern]}var s=p(o);o.intervalPatterns.push(s)}if(!o.oFormatOptions.fallback){if(!i.oFallbackFormats){i.oFallbackFormats={}}var l=r.toString(),u=o.oFormatOptions.calendarType,m=l+"-"+u,g,v;if(o.oFormatOptions.pattern&&i.bPatternFallbackWithoutDelimiter){m=m+"-"+o.oFormatOptions.pattern}if(o.oFormatOptions.interval){m=m+"-"+"interval"}var y=i.oFallbackFormats[m]?Object.assign({},i.oFallbackFormats[m]):undefined;if(!y){v=i.aFallbackFormatOptions;if(i.bShortFallbackFormatOptions){g=i.getPattern(o.oLocaleData,"short");v=v.concat(h._createFallbackOptionsWithoutDelimiter(g))}if(o.oFormatOptions.pattern&&i.bPatternFallbackWithoutDelimiter){v=h._createFallbackOptionsWithoutDelimiter(o.oFormatOptions.pattern).concat(v)}y=h._createFallbackFormat(v,u,r,i,o.oFormatOptions)}o.aFallbackFormats=y}o.oRequiredParts=i.oRequiredParts;o.aRelativeScales=i.aRelativeScales;o.aRelativeParseScales=i.aRelativeParseScales;o.aIntervalCompareFields=i.aIntervalCompareFields;o.init();return o};h.prototype.init=function(){var e=this.oFormatOptions.calendarType;this.aMonthsAbbrev=this.oLocaleData.getMonths("abbreviated",e);this.aMonthsWide=this.oLocaleData.getMonths("wide",e);this.aMonthsNarrow=this.oLocaleData.getMonths("narrow",e);this.aMonthsAbbrevSt=this.oLocaleData.getMonthsStandAlone("abbreviated",e);this.aMonthsWideSt=this.oLocaleData.getMonthsStandAlone("wide",e);this.aMonthsNarrowSt=this.oLocaleData.getMonthsStandAlone("narrow",e);this.aDaysAbbrev=this.oLocaleData.getDays("abbreviated",e);this.aDaysWide=this.oLocaleData.getDays("wide",e);this.aDaysNarrow=this.oLocaleData.getDays("narrow",e);this.aDaysShort=this.oLocaleData.getDays("short",e);this.aDaysAbbrevSt=this.oLocaleData.getDaysStandAlone("abbreviated",e);this.aDaysWideSt=this.oLocaleData.getDaysStandAlone("wide",e);this.aDaysNarrowSt=this.oLocaleData.getDaysStandAlone("narrow",e);this.aDaysShortSt=this.oLocaleData.getDaysStandAlone("short",e);this.aQuartersAbbrev=this.oLocaleData.getQuarters("abbreviated",e);this.aQuartersWide=this.oLocaleData.getQuarters("wide",e);this.aQuartersNarrow=this.oLocaleData.getQuarters("narrow",e);this.aQuartersAbbrevSt=this.oLocaleData.getQuartersStandAlone("abbreviated",e);this.aQuartersWideSt=this.oLocaleData.getQuartersStandAlone("wide",e);this.aQuartersNarrowSt=this.oLocaleData.getQuartersStandAlone("narrow",e);this.aErasNarrow=this.oLocaleData.getEras("narrow",e);this.aErasAbbrev=this.oLocaleData.getEras("abbreviated",e);this.aErasWide=this.oLocaleData.getEras("wide",e);this.aDayPeriodsAbbrev=this.oLocaleData.getDayPeriods("abbreviated",e);this.aDayPeriodsNarrow=this.oLocaleData.getDayPeriods("narrow",e);this.aDayPeriodsWide=this.oLocaleData.getDayPeriods("wide",e);this.oFlexibleDayPeriodsAbbrev=this.oLocaleData.getFlexibleDayPeriods("abbreviated",e);this.oFlexibleDayPeriodsNarrow=this.oLocaleData.getFlexibleDayPeriods("narrow",e);this.oFlexibleDayPeriodsWide=this.oLocaleData.getFlexibleDayPeriods("wide",e);this.oFlexibleDayPeriodsAbbrevSt=this.oLocaleData.getFlexibleDayPeriodsStandAlone("abbreviated",e);this.oFlexibleDayPeriodsNarrowSt=this.oLocaleData.getFlexibleDayPeriodsStandAlone("narrow",e);this.oFlexibleDayPeriodsWideSt=this.oLocaleData.getFlexibleDayPeriodsStandAlone("wide",e);this.aFormatArray=this.parseCldrDatePattern(this.oFormatOptions.pattern);this.sAllowedCharacters=this.getAllowedCharacters(this.aFormatArray)};h._createFallbackFormat=function(e,t,a,r,i){return e.map(function(e){var n=Object.assign({},e);n.showDate=i.showDate;n.showTime=i.showTime;n.showTimezone=i.showTimezone;if(typeof r.getTimezonePattern==="function"&&n.pattern){n.pattern=r.getTimezonePattern(n.pattern)}if(i.interval){n.interval=true}n.calendarType=t;n.fallback=true;var o=h.createInstance(n,a,r);o.bIsFallback=true;return o})};h._createFallbackOptionsWithoutDelimiter=function(e){var t=/[^dMyGU]/g,a={regex:/d+/g,replace:"dd"},r={regex:/M+/g,replace:"MM"},i={regex:/[yU]+/g,replace:["yyyy","yy"]};e=e.replace(t,"");e=e.replace(a.regex,a.replace);e=e.replace(r.regex,r.replace);return i.replace.map(function(t){return{pattern:e.replace(i.regex,t),strictParsing:true}})};var v={isNumber:function(e){return e>=48&&e<=57},findNumbers:function(e,t){var a=0;while(a<t&&this.isNumber(e.charCodeAt(a))){a++}if(typeof e!=="string"){e=e.toString()}return e.substr(0,a)},startsWithIgnoreCase:function(e,t,a){if(e.startsWith(t)){return true}try{var r=t.toLocaleUpperCase(a);var i=e.toLocaleUpperCase(a);if(r.length!==t.length||i.length!==e.length){return false}return i.startsWith(r)}catch(e){return false}},findEntry:function(e,t,a){var r=-1,i=0;for(var n=0;n<t.length;n++){if(t[n]&&t[n].length>i&&this.startsWithIgnoreCase(e,t[n],a)){r=n;i=t[n].length}}return{index:r,length:i}},parseTZ:function(e,t){var a=0;var r=e.charAt(0)=="+"?-1:1;var i;a++;i=this.findNumbers(e.substr(a),2);var n=parseInt(i);a+=2;if(t){a++}i=this.findNumbers(e.substr(a),2);var o=0;if(i){a+=2;o=parseInt(i)}return{length:a,tzDiff:(o+60*n)*60*r}},checkValid:function(e,t,a){if(e in a.oRequiredParts&&t){return false}}};h.prototype.oSymbols={"":{name:"text",format:function(e,t){return e.value},parse:function(e,t,a,r){var i;var n=true;var o=0;var s=0;var l="-~‐‑‒–—﹘﹣－～";for(;s<t.value.length;s++){i=t.value.charAt(s);if(i===" "){while(e.charAt(o)===" "){o++}}else if(l.includes(i)){if(!l.includes(e.charAt(o))){n=false}o++}else{if(e.charAt(o)!==i){n=false}o++}if(!n){break}}if(n){return{length:o}}else{var u=false;if(r.index<r.formatArray.length-1){u=r.formatArray[r.index+1].type in a.oRequiredParts}return{valid:v.checkValid(t.type,u,a)}}}},G:{name:"era",format:function(e,t,a,r){var i=t.getUTCEra();if(e.digits<=3){return r.aErasAbbrev[i]}else if(e.digits===4){return r.aErasWide[i]}else{return r.aErasNarrow[i]}},parse:function(e,t,a,r){var i=[a.aErasWide,a.aErasAbbrev,a.aErasNarrow];for(var n=0;n<i.length;n++){var o=i[n];var s=v.findEntry(e,o,a.oLocaleData.sCLDRLocaleId);if(s.index!==-1){return{era:s.index,length:s.length}}}return{era:a.aErasWide.length-1,valid:v.checkValid(t.type,true,a)}}},y:{name:"year",format:function(t,a,r,i){var n=a.getUTCFullYear();var o=String(n);var s=i.oFormatOptions.calendarType;if(t.digits==2&&o.length>2){o=o.substr(o.length-2)}if(s!=e.Japanese&&t.digits==1&&n<100){o=o.padStart(4,"0")}return o.padStart(t.digits,"0")},parse:function(t,a,i,n){var o=i.oFormatOptions.calendarType;var s;if(a.digits==1){s=v.findNumbers(t,4)}else if(a.digits==2){s=v.findNumbers(t,2)}else{s=v.findNumbers(t,a.digits)}var l=parseInt(s);if(o!=e.Japanese&&s.length<=2){var u=r.getInstance(new Date,o),f=u.getUTCFullYear(),d=Math.floor(f/100),h=d*100+l-f;if(h<-70){l+=(d+1)*100}else if(h<30){l+=d*100}else{l+=(d-1)*100}}return{length:s.length,valid:v.checkValid(a.type,s==="",i),year:l}}},Y:{name:"weekYear",format:function(t,a,r,i){var n=a.getUTCWeek(i.oLocale,D(i.oFormatOptions));var o=n.year;var s=String(o);var l=i.oFormatOptions.calendarType;if(t.digits==2&&s.length>2){s=s.substr(s.length-2)}if(l!=e.Japanese&&t.digits==1&&o<100){s=s.padStart(4,"0")}return s.padStart(t.digits,"0")},parse:function(t,a,i,n){var o=i.oFormatOptions.calendarType;var s;if(a.digits==1){s=v.findNumbers(t,4)}else if(a.digits==2){s=v.findNumbers(t,2)}else{s=v.findNumbers(t,a.digits)}var l=parseInt(s);var u=l;if(o!=e.Japanese&&s.length<=2){var f=r.getInstance(new Date,o),d=f.getUTCFullYear(),h=Math.floor(d/100),c=h*100+u-d;if(c<-70){u+=(h+1)*100}else if(c<30){u+=h*100}else{u+=(h-1)*100}}return{length:s.length,valid:v.checkValid(a.type,s==="",i),year:l,weekYear:u}}},M:{name:"month",format:function(e,t,a,r){var i=t.getUTCMonth();if(e.digits==3){return r.aMonthsAbbrev[i]}else if(e.digits==4){return r.aMonthsWide[i]}else if(e.digits>4){return r.aMonthsNarrow[i]}else{return String(i+1).padStart(e.digits,"0")}},parse:function(e,t,a,r){var i=[a.aMonthsWide,a.aMonthsWideSt,a.aMonthsAbbrev,a.aMonthsAbbrevSt,a.aMonthsNarrow,a.aMonthsNarrowSt];var n;var o;var s;if(t.digits<3){s=v.findNumbers(e,Math.max(t.digits,2));n=v.checkValid(t.type,s==="",a);o=parseInt(s)-1;if(r.strict&&(o>11||o<0)){n=false}}else{for(var l=0;l<i.length;l++){var u=i[l];var f=v.findEntry(e,u,a.oLocaleData.sCLDRLocaleId);if(f.index!==-1){return{month:f.index,length:f.length}}}n=v.checkValid(t.type,true,a)}return{month:o,length:s?s.length:0,valid:n}}},L:{name:"monthStandalone",format:function(e,t,a,r){var i=t.getUTCMonth();if(e.digits==3){return r.aMonthsAbbrevSt[i]}else if(e.digits==4){return r.aMonthsWideSt[i]}else if(e.digits>4){return r.aMonthsNarrowSt[i]}else{return String(i+1).padStart(e.digits,"0")}},parse:function(e,t,a,r){var i=[a.aMonthsWide,a.aMonthsWideSt,a.aMonthsAbbrev,a.aMonthsAbbrevSt,a.aMonthsNarrow,a.aMonthsNarrowSt];var n;var o;var s;if(t.digits<3){s=v.findNumbers(e,Math.max(t.digits,2));n=v.checkValid(t.type,s==="",a);o=parseInt(s)-1;if(r.strict&&(o>11||o<0)){n=false}}else{for(var l=0;l<i.length;l++){var u=i[l];var f=v.findEntry(e,u,a.oLocaleData.sCLDRLocaleId);if(f.index!==-1){return{month:f.index,length:f.length}}}n=v.checkValid(t.type,true,a)}return{month:o,length:s?s.length:0,valid:n}}},w:{name:"weekInYear",format:function(e,t,a,r){var i=t.getUTCWeek(r.oLocale,D(r.oFormatOptions));var n=i.week;var o=String(n+1);if(e.digits<3){o=o.padStart(e.digits,"0")}else{o=r.oLocaleData.getCalendarWeek(e.digits===3?"narrow":"wide",o.padStart(2,"0"))}return o},parse:function(e,t,a,r){var i;var n;var o;var s=0;if(t.digits<3){n=v.findNumbers(e,2);s=n.length;o=parseInt(n)-1;i=v.checkValid(t.type,!n,a)}else{n=a.oLocaleData.getCalendarWeek(t.digits===3?"narrow":"wide");n=n.replace("{0}","([0-9]+)");var l=new RegExp(n),u=l.exec(e);if(u){s=u[0].length;o=parseInt(u[u.length-1])-1}else{i=v.checkValid(t.type,true,a)}}return{length:s,valid:i,week:o}}},W:{name:"weekInMonth",format:function(e,t){return""},parse:function(){return{}}},D:{name:"dayInYear",format:function(e,t){},parse:function(){return{}}},d:{name:"day",format:function(e,t){var a=t.getUTCDate();return String(a).padStart(e.digits,"0")},parse:function(e,t,a,r){var i=v.findNumbers(e,Math.max(t.digits,2));var n=v.checkValid(t.type,i==="",a);var o=parseInt(i);if(r.strict&&(o>31||o<1)){n=false}return{day:o,length:i.length,valid:n}}},Q:{name:"quarter",format:function(e,t,a,r){var i=t.getUTCQuarter();if(e.digits==3){return r.aQuartersAbbrev[i]}else if(e.digits==4){return r.aQuartersWide[i]}else if(e.digits>4){return r.aQuartersNarrow[i]}else{return String(i+1).padStart(e.digits,"0")}},parse:function(e,t,a,r){var i;var n;var o;var s=[a.aQuartersWide,a.aQuartersWideSt,a.aQuartersAbbrev,a.aQuartersAbbrevSt,a.aQuartersNarrow,a.aQuartersNarrowSt];if(t.digits<3){o=v.findNumbers(e,Math.max(t.digits,2));i=v.checkValid(t.type,o==="",a);n=parseInt(o)-1;if(r.strict&&n>3){i=false}}else{for(var l=0;l<s.length;l++){var u=s[l];var f=v.findEntry(e,u,a.oLocaleData.sCLDRLocaleId);if(f.index!==-1){return{quarter:f.index,length:f.length}}}i=v.checkValid(t.type,true,a)}return{length:o?o.length:0,quarter:n,valid:i}}},q:{name:"quarterStandalone",format:function(e,t,a,r){var i=t.getUTCQuarter();if(e.digits==3){return r.aQuartersAbbrevSt[i]}else if(e.digits==4){return r.aQuartersWideSt[i]}else if(e.digits>4){return r.aQuartersNarrowSt[i]}else{return String(i+1).padStart(e.digits,"0")}},parse:function(e,t,a,r){var i;var n;var o;var s=[a.aQuartersWide,a.aQuartersWideSt,a.aQuartersAbbrev,a.aQuartersAbbrevSt,a.aQuartersNarrow,a.aQuartersNarrowSt];if(t.digits<3){o=v.findNumbers(e,Math.max(t.digits,2));i=v.checkValid(t.type,o==="",a);n=parseInt(o)-1;if(r.strict&&n>3){i=false}}else{for(var l=0;l<s.length;l++){var u=s[l];var f=v.findEntry(e,u,a.oLocaleData.sCLDRLocaleId);if(f.index!==-1){return{quarter:f.index,length:f.length}}}i=v.checkValid(t.type,true,a)}return{length:o?o.length:0,quarter:n,valid:i}}},F:{name:"dayOfWeekInMonth",format:function(e,t,a){return""},parse:function(){return{}}},E:{name:"dayNameInWeek",format:function(e,t,a,r){var i=t.getUTCDay();if(e.digits<4){return r.aDaysAbbrev[i]}else if(e.digits==4){return r.aDaysWide[i]}else if(e.digits==5){return r.aDaysNarrow[i]}else{return r.aDaysShort[i]}},parse:function(e,t,a,r){var i=[a.aDaysWide,a.aDaysWideSt,a.aDaysAbbrev,a.aDaysAbbrevSt,a.aDaysShort,a.aDaysShortSt,a.aDaysNarrow,a.aDaysNarrowSt];for(var n=0;n<i.length;n++){var o=i[n];var s=v.findEntry(e,o,a.oLocaleData.sCLDRLocaleId);if(s.index!==-1){return{dayOfWeek:s.index,length:s.length}}}}},c:{name:"dayNameInWeekStandalone",format:function(e,t,a,r){var i=t.getUTCDay();if(e.digits<4){return r.aDaysAbbrevSt[i]}else if(e.digits==4){return r.aDaysWideSt[i]}else if(e.digits==5){return r.aDaysNarrowSt[i]}else{return r.aDaysShortSt[i]}},parse:function(e,t,a,r){var i=[a.aDaysWide,a.aDaysWideSt,a.aDaysAbbrev,a.aDaysAbbrevSt,a.aDaysShort,a.aDaysShortSt,a.aDaysNarrow,a.aDaysNarrowSt];for(var n=0;n<i.length;n++){var o=i[n];var s=v.findEntry(e,o,a.oLocaleData.sCLDRLocaleId);if(s.index!==-1){return{day:s.index,length:s.length}}}}},u:{name:"dayNumberOfWeek",format:function(e,t,a,r){var i=t.getUTCDay();return r._adaptDayOfWeek(i)},parse:function(e,t,a,r){var i=v.findNumbers(e,t.digits);return{dayNumberOfWeek:parseInt(i),length:i.length}}},a:{name:"amPmMarker",format:function(e,t,a,r){var i=t.getUTCDayPeriod();if(e.digits<=3){return r.aDayPeriodsAbbrev[i]}else if(e.digits===4){return r.aDayPeriodsWide[i]}else{return r.aDayPeriodsNarrow[i]}},parse:function(e,t,a,r,i){var n,o,s,l,u,f,d,h=[a.aDayPeriodsWide,a.aDayPeriodsAbbrev,a.aDayPeriodsNarrow];n=/[aApP](?:\.)?[\x20\xA0]?[mM](?:\.)?/;u=e.match(n);o=u&&u.index===0;function f(e){return e.replace(/[\x20\xA0]/g,"").replace(/\./g,"")}if(o){e=f(e)}for(l=0;l<h.length;l+=1){d=h[l];if(o){d=d.map(f)}s=v.findEntry(e,d,a.oLocaleData.sCLDRLocaleId);if(s.index!==-1){return{pm:s.index===1,length:o?u[0].length:s.length}}}return{valid:false}}},B:{name:"flexibleDayPeriod",format:function(e,t,a,r){var i=r.aFormatArray.some(function(e){return"hHKk".includes(e.symbol)}),n=r.oLocaleData.getFlexibleDayPeriodOfTime(t.getUTCHours(),t.getUTCMinutes());if(i){if(e.digits<=3){return r.oFlexibleDayPeriodsAbbrev[n]}if(e.digits===4){return r.oFlexibleDayPeriodsWide[n]}return r.oFlexibleDayPeriodsNarrow[n]}if(e.digits<=3){return r.oFlexibleDayPeriodsAbbrevSt[n]}if(e.digits===4){return r.oFlexibleDayPeriodsWideSt[n]}return r.oFlexibleDayPeriodsNarrowSt[n]},parse:function(e,t,a,r){var i,n,o,s=a.aFormatArray.some(function(e){return"hHKk".includes(e.symbol)}),l=[a.oFlexibleDayPeriodsWide,a.oFlexibleDayPeriodsAbbrev,a.oFlexibleDayPeriodsNarrow];if(s){for(i=0;i<l.length;i++){o=l[i];n=v.findEntry(e,Object.values(o),a.oLocaleData.sCLDRLocaleId);if(n.index!==-1){return{flexDayPeriod:Object.keys(o)[n.index],length:n.length}}}}return{valid:false}}},H:{name:"hour0_23",format:function(e,t){var a=t.getUTCHours();return String(a).padStart(e.digits,"0")},parse:function(e,t,a,r){var i;var n=v.findNumbers(e,Math.max(t.digits,2));var o=parseInt(n);i=v.checkValid(t.type,n==="",a);if(r.strict&&o>23){i=false}return{hour:o,length:n.length,valid:i}}},k:{name:"hour1_24",format:function(e,t){var a=t.getUTCHours();var r=a===0?"24":String(a);return r.padStart(e.digits,"0")},parse:function(e,t,a,r){var i;var n=v.findNumbers(e,Math.max(t.digits,2));var o=parseInt(n);i=v.checkValid(t.type,n==="",a);if(o==24){o=0}if(r.strict&&o>23){i=false}return{hour:o,length:n.length,valid:i}}},K:{name:"hour0_11",format:function(e,t){var a=t.getUTCHours();var r=String(a>11?a-12:a);return r.padStart(e.digits,"0")},parse:function(e,t,a,r){var i;var n=v.findNumbers(e,Math.max(t.digits,2));var o=parseInt(n);i=v.checkValid(t.type,n==="",a);if(r.strict&&o>11){i=false}return{hour:o,length:n.length,valid:i}}},h:{name:"hour1_12",format:function(e,t){var a=t.getUTCHours();var r;if(a>12){r=String(a-12)}else if(a==0){r="12"}else{r=String(a)}return r.padStart(e.digits,"0")},parse:function(e,t,a,r){var i=r.dateValue.pm;var n=v.findNumbers(e,Math.max(t.digits,2));var o=parseInt(n);var s=v.checkValid(t.type,n==="",a);if(o==12){o=0;i=i===undefined?true:i}if(r.strict&&o>11){s=false}return{hour:o,length:n.length,pm:i,valid:s}}},m:{name:"minute",format:function(e,t){var a=t.getUTCMinutes();return String(a).padStart(e.digits,"0")},parse:function(e,t,a,r){var i;var n=v.findNumbers(e,Math.max(t.digits,2));var o=parseInt(n);i=v.checkValid(t.type,n==="",a);if(r.strict&&o>59){i=false}return{length:n.length,minute:o,valid:i}}},s:{name:"second",format:function(e,t){var a=t.getUTCSeconds();return String(a).padStart(e.digits,"0")},parse:function(e,t,a,r){var i;var n=v.findNumbers(e,Math.max(t.digits,2));var o=parseInt(n);i=v.checkValid(t.type,n==="",a);if(r.strict&&o>59){i=false}return{length:n.length,second:o,valid:i}}},S:{name:"fractionalsecond",format:function(e,t){var a=t.getUTCMilliseconds();var r=String(a);var i=r.padStart(3,"0");i=i.substr(0,e.digits);i=i.padEnd(e.digits,"0");return i},parse:function(e,t,a,r){var i=v.findNumbers(e,t.digits);var n=i.length;i=i.substr(0,3);i=i.padEnd(3,"0");var o=parseInt(i);return{length:n,millisecond:o}}},z:{name:"timezoneGeneral",format:function(e,t,a,r,i){if(e.digits>3&&t.getTimezoneLong&&t.getTimezoneLong()){return t.getTimezoneLong()}else if(t.getTimezoneShort&&t.getTimezoneShort()){return t.getTimezoneShort()}var n=o.calculateOffset(t,i);var s="GMT";var l=Math.abs(n/60);var u=n>0;var f=Math.floor(l/60);var d=Math.floor(l%60);if(!a&&l!=0){s+=u?"-":"+";s+=String(f).padStart(2,"0");s+=":";s+=String(d).padStart(2,"0")}else{s+="Z"}return s},parse:function(e,t,a,r){var i=0;var n;var o=e.substring(0,3);if(o==="GMT"||o==="UTC"){i=3}else if(e.substring(0,2)==="UT"){i=2}else if(e.charAt(0)==="Z"){i=1;n=0}else{return{error:"cannot be parsed correctly by sap.ui.core.format.DateFormat: The given timezone is not supported!"}}if(e.charAt(0)!=="Z"){var s=v.parseTZ(e.substr(i),true);i+=s.length;n=s.tzDiff}return{length:i,tzDiff:n}}},Z:{name:"timezoneRFC822",format:function(e,t,a,r,i){var n=o.calculateOffset(t,i);var s=Math.abs(n/60);var l=n>0;var u=Math.floor(s/60);var f=Math.floor(s%60);var d="";if(!a){d+=l?"-":"+";d+=String(u).padStart(2,"0");d+=String(f).padStart(2,"0")}return d},parse:function(e,t,a,r){return v.parseTZ(e,false)}},X:{name:"timezoneISO8601",format:function(e,t,a,r,i){var n=o.calculateOffset(t,i);var s=Math.abs(n/60);var l=n>0;var u=Math.floor(s/60);var f=Math.floor(s%60);var d="";if(!a&&s!=0){d+=l?"-":"+";d+=String(u).padStart(2,"0");if(e.digits>1||f>0){if(e.digits===3||e.digits===5){d+=":"}d+=String(f).padStart(2,"0")}}else{d+="Z"}return d},parse:function(e,t,a,r){if(e.charAt(0)==="Z"){return{length:1,tzDiff:0}}else{return v.parseTZ(e,t.digits===3||t.digits===5)}}},V:{name:"timezoneID",format:function(e,t,a,r,i){if(!a&&e.digits===2){return r.oLocaleData.getTimezoneTranslations()[i]||i}return""},parse:function(e,t,a,r,i){var n={timezone:"",length:0};if(t.digits===2){var s=a.oLocaleData.getTimezoneTranslations();if(e===s[i]){return{timezone:i,length:e.length}}var l=Object.values(s);var u=v.findEntry(e,l,a.oLocaleData.sCLDRLocaleId);if(u.index!==-1){return{timezone:Object.keys(s)[u.index],length:u.length}}var f="";for(var d=0;d<e.length;d++){f+=e[d];if(o.isValidTimezone(f)){n.timezone=f;n.length=f.length}}}return n}}};h.prototype._format=function(e,t,a){if(this.oFormatOptions.relative){var i=this.formatRelative(e,t,this.oFormatOptions.relativeRange,a);if(i){return i}}var n=this.oFormatOptions.calendarType;var o=r.getInstance(e,n);var s=[],l,u,f;for(var h=0;h<this.aFormatArray.length;h++){l=this.aFormatArray[h];f=l.symbol||"";s.push(this.oSymbols[f].format(l,o,t,this,a))}u=s.join("");if(d.getOriginInfo()){u=new String(u);u.originInfo={source:"Common Locale Data Repository",locale:this.oLocale.toString(),style:this.oFormatOptions.style,pattern:this.oFormatOptions.pattern}}return u};h.prototype.format=function(t,a){var r;if(this.type===c.DATETIME_WITH_TIMEZONE){r=a;a=false;g(r);if(r&&!o.isValidTimezone(r)){u.error("The given timezone isn't valid.");return""}}var i=this.oFormatOptions.calendarType,n;if(a===undefined){a=this.oFormatOptions.UTC}r=r||d.getTimezone();if(Array.isArray(t)){if(!this.oFormatOptions.interval){u.error("Non-interval DateFormat can't format more than one date instance.");return""}if(t.length!==2){u.error("Interval DateFormat can only format with 2 date instances but "+t.length+" is given.");return""}t=t.map(function(e){return T(e,r,a)});if(this.oFormatOptions.singleIntervalValue){if(t[0]===null){u.error("First date instance which is passed to the interval DateFormat shouldn't be null.");return""}if(t[1]===null){n=this._format(t[0],a,r)}}if(n===undefined){if(!t.every(w)){u.error("At least one date instance which is passed to the interval DateFormat isn't valid.");return""}n=this._formatInterval(t,a)}}else{if(!w(t)){if(this.type===c.DATETIME_WITH_TIMEZONE&&this.oFormatOptions.pattern.includes("VV")){return this.oLocaleData.getTimezoneTranslations()[r]||r}u.error("The given date instance isn't valid.");return""}if(this.oFormatOptions.interval){u.error("Interval DateFormat expects an array with two dates for the first argument but only one date is given.");return""}t=T(t,r,a);n=this._format(t,a,r)}if(i==e.Japanese&&this.oLocale.getLanguage()==="ja"){n=n.replace(/(^|[^\d])1年/g,"$1元年")}return n};h.prototype._formatInterval=function(e,t){var a=this.oFormatOptions.calendarType;var i=r.getInstance(e[0],a);var n=r.getInstance(e[1],a);var o;var s;var l;var u=[];var f;var d=[];var h=this._getGreatestDiffField([i,n]);if(!h){return this._format(e[0],t)}if(this.oFormatOptions.format){f=this.oLocaleData.getCustomIntervalPattern(this.oFormatOptions.format,h,a)}else{f=this.oLocaleData.getCombinedIntervalPattern(this.oFormatOptions.pattern,a)}d=this.parseCldrDatePattern(f);o=i;for(var c=0;c<d.length;c++){s=d[c];l=s.symbol||"";if(s.repeat){o=n}u.push(this.oSymbols[l].format(s,o,t,this))}return u.join("")};var y={Era:"Era",FullYear:"Year",Quarter:"Quarter",Month:"Month",Week:"Week",Date:"Day",DayPeriod:"DayPeriod",Hours:"Hour",Minutes:"Minute",Seconds:"Second"};h.prototype._getGreatestDiffField=function(e){var t=false,a={};this.aIntervalCompareFields.forEach(function(r){var i="getUTC",n=i+r,o=y[r],l=e[0][n].apply(e[0]),u=e[1][n].apply(e[1]);if(!s(l,u)){t=true;a[o]=true}});if(t){return a}return null};h.prototype._parse=function(e,t,a,r,i){var n=0,o,s,l,u,d;var h={valid:true,lastTimezonePatternSymbol:""};var c={formatArray:t,dateValue:h,strict:r};for(var m=0;m<t.length;m++){u=e.substr(n);s=t[m];c.index=m;d=this.oSymbols[s.symbol||""].parse(u,s,this,c,i)||{};if(d.tzDiff!==undefined||d.timezone){d.lastTimezonePatternSymbol=s.symbol}h=f(h,d);if(d.valid===false){break}n+=d.length||0}h.index=n;l=h.pm;if(h.flexDayPeriod&&h.hour*60+(h.minute||0)<720){o=this.oLocaleData.getFlexibleDayPeriodOfTime(h.hour+12,h.minute||0);l=h.flexDayPeriod===o}if(l){h.hour+=12}if(h.dayNumberOfWeek===undefined&&h.dayOfWeek!==undefined){h.dayNumberOfWeek=this._adaptDayOfWeek(h.dayOfWeek)}if(h.quarter!==undefined&&h.month===undefined&&h.day===undefined){h.month=3*h.quarter;h.day=1}return h};h.prototype._parseInterval=function(e,t,a,r,i){var n,o,s;this.intervalPatterns.some(function(t){var l=this.parseCldrDatePattern(t);o=undefined;for(var u=0;u<l.length;u++){if(l[u].repeat){o=u;break}}if(o===undefined){s=this._parse(e,l,a,r,i);if(s.index===0||s.index<e.length){s.valid=false}if(s.valid===false){return}n=[s,s];return true}else{n=[];s=this._parse(e,l.slice(0,o),a,r,i);if(s.valid===false){return}n.push(s);var f=s.index;s=this._parse(e.substring(f),l.slice(o),a,r,i);if(s.index===0||s.index+f<e.length){s.valid=false}if(s.valid===false){return}n.push(s);return true}}.bind(this));return n};function D(e){if(e.calendarWeekNumbering){return e.calendarWeekNumbering}else if(e.firstDayOfWeek!==undefined&&e.minimalDaysInFirstWeek!==undefined){return{firstDayOfWeek:e.firstDayOfWeek,minimalDaysInFirstWeek:e.minimalDaysInFirstWeek}}return undefined}var T=function(e,t,a){if(!a&&w(e)){return o.convertToTimezone(e,t)}return e};var b=function(e,t,a,i,n,s,l){if(!e.valid){return null}var u,f=typeof e.year==="number"?e.year:1970;u=r.getInstance(new Date(0),t);u.setUTCEra(e.era||r.getCurrentEra(t));u.setUTCFullYear(f);u.setUTCMonth(e.month||0);u.setUTCDate(e.day||1);u.setUTCHours(e.hour||0);u.setUTCMinutes(e.minute||0);u.setUTCSeconds(e.second||0);u.setUTCMilliseconds(e.millisecond||0);if(i&&(e.day||1)!==u.getUTCDate()){return null}if(e.week!==undefined&&(e.month===undefined||e.day===undefined)){u.setUTCWeek({year:e.weekYear||e.year,week:e.week},l,D(s));if(e.dayNumberOfWeek!==undefined){u.setUTCDate(u.getUTCDate()+e.dayNumberOfWeek-1)}}u=u.getJSDate();if(!a&&(e.lastTimezonePatternSymbol==="V"&&e.timezone||e.tzDiff===undefined)){if(e.timezone){n=e.timezone}if(n){e.tzDiff=o.calculateOffset(u,n)}}if(e.tzDiff){u.setUTCSeconds(u.getUTCSeconds()+e.tzDiff)}return u};function F(e,t){if(e===t){return e}var a={};Object.keys(e).forEach(function(t){a[t]=e[t]});Object.keys(t).forEach(function(e){if(!a.hasOwnProperty(e)){a[e]=t[e]}});return a}function S(e,t){if(e.getTime()>t.getTime()){return false}return true}function w(e){return e&&typeof e.getTime==="function"&&!isNaN(e.getTime())}h.prototype.parse=function(t,a,r){var i=this.oFormatOptions.showDate===undefined||this.oFormatOptions.showDate;var n=this.oFormatOptions.showTime===undefined||this.oFormatOptions.showTime;if(this.type===c.DATETIME_WITH_TIMEZONE&&(i&&!n||!i&&n)){throw new TypeError("The input can only be parsed back to date if both date and time are supplied.")}var s;if(a===undefined&&this.type!==c.DATETIME_WITH_TIMEZONE){a=this.oFormatOptions.UTC}var l=a;if(this.type===c.DATETIME_WITH_TIMEZONE){s=a;a=false;g(s);if(s&&!o.isValidTimezone(s)){u.error("The given timezone isn't valid.");return null}}t=t==null?"":String(t).trim();var f;var h=this.oFormatOptions.calendarType;s=s||d.getTimezone();if(r===undefined){r=this.oFormatOptions.strictParsing}if(h==e.Japanese&&this.oLocale.getLanguage()==="ja"){t=t.replace(/元年/g,"1年")}if(!this.oFormatOptions.interval){var m=this.parseRelative(t,a);if(m){return m}f=this._parse(t,this.aFormatArray,a,r,s);if(f.index===0||f.index<t.length){f.valid=false}m=b(f,h,a,r,s,this.oFormatOptions,this.oLocale);if(m){if(this.type===c.DATETIME_WITH_TIMEZONE){var p=this.oFormatOptions.showTimezone===undefined||this.oFormatOptions.showTimezone;if(!p&&i&&n){return[m,undefined]}else if(p&&!i&&!n){return[undefined,f.timezone]}return[m,f.timezone||undefined]}return m}}else{var v=this._parseInterval(t,h,a,r,s);var y,D;if(v&&v.length==2){var T=F(v[0],v[1]);var w=F(v[1],v[0]);y=b(T,h,a,r,s,this.oFormatOptions,this.oLocale);D=b(w,h,a,r,s,this.oFormatOptions,this.oLocale);if(y&&D){if(this.oFormatOptions.singleIntervalValue&&y.getTime()===D.getTime()){return[y,null]}var O=S(y,D);if(r&&!O){u.error("StrictParsing: Invalid date range. The given end date is before the start date.");return[null,null]}return[y,D]}}}if(!this.bIsFallback){var k;this.aFallbackFormats.every(function(e){k=e.parse(t,l,r);if(Array.isArray(k)){if(e.type===c.DATETIME_WITH_TIMEZONE){return false}return!(k[0]&&k[1])}else{return!k}});return k}if(!this.oFormatOptions.interval){return null}else{return[null,null]}};h.prototype.parseCldrDatePattern=function(e){if(m[e]){return m[e]}var t=[],a,r=false,i=null,n="",o="",s={},l=false;for(a=0;a<e.length;a++){var u=e.charAt(a),f,d,h;if(r){if(u=="'"){d=e.charAt(a-1);h=e.charAt(a-2);f=e.charAt(a+1);if(d=="'"&&h!="'"){r=false}else if(f=="'"){a+=1}else{r=false;continue}}if(n=="text"){i.value+=u}else{i={type:"text",value:u};t.push(i);n="text"}}else{if(u=="'"){r=true}else if(this.oSymbols[u]){o=this.oSymbols[u].name;if(n==o){i.digits++}else{i={type:o,symbol:u,digits:1};t.push(i);n=o;if(!l){if(s[o]){i.repeat=true;l=true}else{s[o]=true}}}}else{if(n=="text"){i.value+=u}else{i={type:"text",value:u};t.push(i);n="text"}}}}m[e]=t;return t};h.prototype.parseRelative=function(e,t){var a,r,i,n,o;if(!e){return null}a=this.oLocaleData.getRelativePatterns(this.aRelativeParseScales,this.oFormatOptions.relativeStyle);for(var s=0;s<a.length;s++){r=a[s];i=new RegExp("^\\s*"+r.pattern.replace(/\{0\}/,"(\\d+)")+"\\s*$","i");n=i.exec(e);if(n){if(r.value!==undefined){return l(r.value,r.scale)}else{o=parseInt(n[1]);return l(o*r.sign,r.scale)}}}function l(e,a){var r,i=new Date,n;if(t){r=i.getTime()}else{r=Date.UTC(i.getFullYear(),i.getMonth(),i.getDate(),i.getHours(),i.getMinutes(),i.getSeconds(),i.getMilliseconds())}n=new Date(r);switch(a){case"second":n.setUTCSeconds(n.getUTCSeconds()+e);break;case"minute":n.setUTCMinutes(n.getUTCMinutes()+e);break;case"hour":n.setUTCHours(n.getUTCHours()+e);break;case"day":n.setUTCDate(n.getUTCDate()+e);break;case"week":n.setUTCDate(n.getUTCDate()+e*7);break;case"month":n.setUTCMonth(n.getUTCMonth()+e);break;case"quarter":n.setUTCMonth(n.getUTCMonth()+e*3);break;case"year":n.setUTCFullYear(n.getUTCFullYear()+e);break}if(t){return n}else{return new Date(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate(),n.getUTCHours(),n.getUTCMinutes(),n.getUTCSeconds(),n.getUTCMilliseconds())}}};h.prototype.formatRelative=function(e,t,a,r){var i=T(new Date,r),n,o=this.oFormatOptions.relativeScale||"day",s,u,f;f=(e.getTime()-i.getTime())/1e3;if(this.oFormatOptions.relativeScale=="auto"){o=this._getScale(f,this.aRelativeScales);o=O(e,i,o,f)}if(!a){a=this._mRanges[o]}if(o=="year"||o=="month"||o=="day"){i=new Date(Date.UTC(i.getUTCFullYear(),i.getUTCMonth(),i.getUTCDate()));n=new Date(0);n.setUTCFullYear(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate());e=n}s=this._getDifference(o,[i,e]);if(this.oFormatOptions.relativeScale!="auto"&&(s<a[0]||s>a[1])){return null}u=this.oLocaleData.getRelativePattern(o,s,f>0,this.oFormatOptions.relativeStyle);return l(u,[Math.abs(s)])};h.prototype._mRanges={second:[-60,60],minute:[-60,60],hour:[-24,24],day:[-6,6],week:[-4,4],month:[-12,12],year:[-10,10]};h.prototype._mScales={second:1,minute:60,hour:3600,day:86400,week:604800,month:2592e3,quarter:7776e3,year:31536e3};h.prototype._getScale=function(e,t){var a,r;e=Math.abs(e);for(var i=0;i<t.length;i++){r=t[i];if(e>=this._mScales[r]){a=r;break}}if(!a){a=t[t.length-1]}return a};function O(e,t,a,r){var i=Math.abs(e.getUTCMonth()-t.getUTCMonth());if(a==="week"&&i===2){return"month"}else if(a==="week"&&i===1){if(e.getUTCDate()===t.getUTCDate()||r<0&&e.getUTCDate()<t.getUTCDate()||r>0&&e.getUTCDate()>t.getUTCDate()){return"month"}}else if(a==="month"&&i===1){if(r>0&&e.getUTCDate()<t.getUTCDate()||r<0&&e.getUTCDate()>t.getUTCDate()){return"week"}}return a}function k(e,t){var a=["FullYear","Month","Date","Hours","Minutes","Seconds","Milliseconds"],r;var i=new Date(e.getTime());for(var n=t;n<a.length;n++){r="setUTC"+a[t];i[r].apply(i,[0])}return i}var C={year:function(e,t){return t.getUTCFullYear()-e.getUTCFullYear()},month:function(e,t){return t.getUTCMonth()-e.getUTCMonth()+this.year(e,t)*12},week:function(e,t,a){var r=a._adaptDayOfWeek(e.getUTCDay());var i=a._adaptDayOfWeek(t.getUTCDay());e=k(e,3);t=k(t,3);return(t.getTime()-e.getTime()-(i-r)*a._mScales.day*1e3)/(a._mScales.week*1e3)},day:function(e,t,a){e=k(e,3);t=k(t,3);return(t.getTime()-e.getTime())/(a._mScales.day*1e3)},hour:function(e,t,a){e=k(e,4);t=k(t,4);return(t.getTime()-e.getTime())/(a._mScales.hour*1e3)},minute:function(e,t,a){e=k(e,5);t=k(t,5);return(t.getTime()-e.getTime())/(a._mScales.minute*1e3)},second:function(e,t,a){e=k(e,6);t=k(t,6);return(t.getTime()-e.getTime())/(a._mScales.second*1e3)}};h.prototype._adaptDayOfWeek=function(e){var t=D(this.oFormatOptions),a;if(typeof t==="object"){a=t.firstDayOfWeek}else{a=i.getWeekConfigurationValues(t,this.oLocale).firstDayOfWeek}var r=e-(a-1);if(r<=0){r+=7}return r};h.prototype._getDifference=function(e,t){var a=t[0];var r=t[1];return Math.round(C[e](a,r,this))};h.prototype.getAllowedCharacters=function(e){if(this.oFormatOptions.relative){return""}var t="";var a=false;var r=false;var i;for(var n=0;n<e.length;n++){i=e[n];switch(i.type){case"text":if(t.indexOf(i.value)<0){t+=i.value}break;case"day":case"year":case"weekYear":case"dayNumberOfWeek":case"weekInYear":case"hour0_23":case"hour1_24":case"hour0_11":case"hour1_12":case"minute":case"second":case"fractionalsecond":if(!a){t+="0123456789";a=true}break;case"month":case"monthStandalone":if(i.digits<3){if(!a){t+="0123456789";a=true}}else{r=true}break;default:r=true;break}}if(r){t=""}return t};return h},true);
//# sourceMappingURL=DateFormat.js.map