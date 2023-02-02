/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/core/Configuration","sap/ui/core/Locale","sap/ui/core/LocaleData","./_Calendars","./CalendarUtils","./CalendarWeekNumbering"],function(e,t,r,a,n,o,i){"use strict";var s=e.extend("sap.ui.core.date.UniversalDate",{constructor:function(){var e=s.getClass();return this.createDate(e,arguments)}});s.UTC=function(){var e=s.getClass();return e.UTC.apply(e,arguments)};s.now=function(){return Date.now()};s.prototype.createDate=function(e,t){switch(t.length){case 0:return new e;case 1:return new e(t[0]instanceof Date?t[0].getTime():t[0]);case 2:return new e(t[0],t[1]);case 3:return new e(t[0],t[1],t[2]);case 4:return new e(t[0],t[1],t[2],t[3]);case 5:return new e(t[0],t[1],t[2],t[3],t[4]);case 6:return new e(t[0],t[1],t[2],t[3],t[4],t[5]);case 7:return new e(t[0],t[1],t[2],t[3],t[4],t[5],t[6])}};s.getInstance=function(e,r){var a,n;if(e instanceof s){e=e.getJSDate()}else if(!e){e=new Date}if(isNaN(e.getTime())){throw new Error("The given date object is invalid")}if(!r){r=t.getCalendarType()}a=s.getClass(r);n=Object.create(a.prototype);n.oDate=e;n.sCalendarType=r;return n};s.getClass=function(e){if(!e){e=t.getCalendarType()}return n.get(e)};["getDate","getMonth","getFullYear","getYear","getDay","getHours","getMinutes","getSeconds","getMilliseconds","getUTCDate","getUTCMonth","getUTCFullYear","getUTCDay","getUTCHours","getUTCMinutes","getUTCSeconds","getUTCMilliseconds","getTime","valueOf","getTimezoneOffset","toString","toDateString","setDate","setFullYear","setYear","setMonth","setHours","setMinutes","setSeconds","setMilliseconds","setUTCDate","setUTCFullYear","setUTCMonth","setUTCHours","setUTCMinutes","setUTCSeconds","setUTCMilliseconds"].forEach(function(e){s.prototype[e]=function(){return this.oDate[e].apply(this.oDate,arguments)}});s.prototype.getJSDate=function(){return this.oDate};s.prototype.getCalendarType=function(){return this.sCalendarType};s.prototype.getEra=function(){return s.getEraByDate(this.sCalendarType,this.oDate.getFullYear(),this.oDate.getMonth(),this.oDate.getDate())};s.prototype.setEra=function(e){};s.prototype.getUTCEra=function(){return s.getEraByDate(this.sCalendarType,this.oDate.getUTCFullYear(),this.oDate.getUTCMonth(),this.oDate.getUTCDate())};s.prototype.setUTCEra=function(e){};s.prototype.getWeek=function(e,t){f(t);return s.getWeekByDate(this.sCalendarType,this.getFullYear(),this.getMonth(),this.getDate(),e,t)};s.prototype.setWeek=function(e,t,r){f(r);var a=s.getFirstDateOfWeek(this.sCalendarType,e.year||this.getFullYear(),e.week,t,r);this.setFullYear(a.year,a.month,a.day)};s.prototype.getUTCWeek=function(e,t){f(t);return s.getWeekByDate(this.sCalendarType,this.getUTCFullYear(),this.getUTCMonth(),this.getUTCDate(),e,t)};s.prototype.setUTCWeek=function(e,t,r){f(r);var a=s.getFirstDateOfWeek(this.sCalendarType,e.year||this.getFullYear(),e.week,t,r);this.setUTCFullYear(a.year,a.month,a.day)};s.prototype.getQuarter=function(){return Math.floor(this.getMonth()/3)};s.prototype.getUTCQuarter=function(){return Math.floor(this.getUTCMonth()/3)};s.prototype.getDayPeriod=function(){if(this.getHours()<12){return 0}else{return 1}};s.prototype.getUTCDayPeriod=function(){if(this.getUTCHours()<12){return 0}else{return 1}};s.prototype.getTimezoneShort=function(){if(this.oDate.getTimezoneShort){return this.oDate.getTimezoneShort()}};s.prototype.getTimezoneLong=function(){if(this.oDate.getTimezoneLong){return this.oDate.getTimezoneLong()}};var u=7*24*60*60*1e3;s.getWeekByDate=function(e,r,a,n,o,i){f(i);o=o||t.getFormatSettings().getFormatLocale();var s=this.getClass(e);var u=p(s,r,o,i);var l=new s(s.UTC(r,a,n));var c,h,T,C,D;var m=g(i,o);if(m){c=y(u,l)}else{h=r-1;T=r+1;C=p(s,h,o,i);D=p(s,T,o,i);if(l>=D){r=T;c=0}else if(l<u){r=h;c=y(C,l)}else{c=y(u,l)}}return{year:r,week:c}};s.getFirstDateOfWeek=function(e,r,a,n,o){f(o);n=n||t.getFormatSettings().getFormatLocale();var i=this.getClass(e);var s=p(i,r,n,o);var l=new i(s.valueOf()+a*u);var c=g(o,n);if(c&&a===0&&s.getUTCFullYear()<r){return{year:r,month:0,day:1}}return{year:l.getUTCFullYear(),month:l.getUTCMonth(),day:l.getUTCDate()}};function g(e,r){r=r||t.getFormatSettings().getFormatLocale();var n=a.getInstance(r);return(!l(e)||e===i.Default)&&n.firstDayStartsFirstWeek()}function f(e){if(typeof e==="object"){if(!l(e)){throw new TypeError("Week config requires firstDayOfWeek and minimalDaysInFirstWeek to be set")}}else if(e&&!Object.values(i).includes(e)){throw new TypeError("Illegal format option calendarWeekNumbering: '"+e+"'")}}function l(e){if(typeof e==="object"){return typeof e.firstDayOfWeek==="number"&&typeof e.minimalDaysInFirstWeek==="number"}else if(e){return true}return false}function c(e,t){if(typeof e==="object"&&typeof e.firstDayOfWeek==="number"&&typeof e.minimalDaysInFirstWeek==="number"){return e}return o.getWeekConfigurationValues(e,t)}function p(e,r,a,n){a=a||t.getFormatSettings().getFormatLocale();var o=c(n,a);var i=o.minimalDaysInFirstWeek;var s=o.firstDayOfWeek;var u=new e(e.UTC(r,0,1));var g=7;if(isNaN(u.getTime())){throw new Error("Could not determine the first day of the week, because the date "+"object is invalid")}while(u.getUTCDay()!==s){u.setUTCDate(u.getUTCDate()-1);g--}if(g<i){u.setUTCDate(u.getUTCDate()+7)}return u}function y(e,t){return Math.floor((t.valueOf()-e.valueOf())/u)}var h={};s.getEraByDate=function(e,t,r,a){var n=T(e),o=new Date(0).setUTCFullYear(t,r,a),i;for(var s=n.length-1;s>=0;s--){i=n[s];if(!i){continue}if(i._start&&o>=i._startInfo.timestamp){return s}if(i._end&&o<i._endInfo.timestamp){return s}}};s.getCurrentEra=function(e){var t=new Date;return this.getEraByDate(e,t.getFullYear(),t.getMonth(),t.getDate())};s.getEraStartDate=function(e,t){var r=T(e),a=r[t]||r[0];if(a._start){return a._startInfo}};function T(e){var r=t.getFormatSettings().getFormatLocale(),n=a.getInstance(r),o=h[e];if(!o){var o=n.getEraDates(e);if(!o[0]){o[0]={_start:"1-1-1"}}for(var i=0;i<o.length;i++){var s=o[i];if(!s){continue}if(s._start){s._startInfo=C(s._start)}if(s._end){s._endInfo=C(s._end)}}h[e]=o}return o}function C(e){var t=e.split("-"),r,a,n;if(t[0]==""){r=-parseInt(t[1]);a=parseInt(t[2])-1;n=parseInt(t[3])}else{r=parseInt(t[0]);a=parseInt(t[1])-1;n=parseInt(t[2])}return{timestamp:new Date(0).setUTCFullYear(r,a,n),year:r,month:a,day:n}}return s});
//# sourceMappingURL=UniversalDate.js.map