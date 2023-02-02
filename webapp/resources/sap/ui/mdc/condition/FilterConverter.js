/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(["sap/ui/mdc/condition/FilterOperatorUtil","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/base/Log"],function(e,t,r,i){"use strict";var n={createConditionTypesMapFromFilterBar:function(e,t){var r={};for(var i in e){if(t){var n=t._getPropertyByName(i);var a;if(n&&n.typeConfig){a=n.typeConfig.typeInstance}else{var o=t._getFilterField(i);if(o){var l=o._getFormatOptions();if(l.originalDateType){a=l.originalDateType}else{a=l.valueType}}}r[i]={type:a}}}return r},createFilters:function(a,o,l,s){var f,u,p,h=[],v,c,d,g,y;var F=function(e,t,r){var i="L1";var n,a,o;if(e.sPath&&e.sPath.indexOf(r)>-1){n=e.sPath.split(r);if(n.length===2){a=n[0];o=n[1];e.sPath=i+"/"+o;return{path:a,operator:t,variable:i}}else{throw new Error("FilterConverter: not supported binding "+e.sPath)}}return false};var P=function(e){var t=F(e,r.Any,"*/");if(t){return t}else{return F(e,r.All,"+/")}};for(var O in a){u=[];p=[];y=null;var w=a[O];if(O==="$search"){continue}var C;var b=true;var m;if(o){if(o[O]){C=o[O].type;b=o[O].caseSensitive;m=o[O].baseType;if(!C){i.warning("FilterConverter","Not able to retrieve the type of path '"+O+"!")}}}for(f=0;f<w.length;f++){g=w[f];v=e.getOperator(g.operator);if(!v){continue}try{c=v.getModelFilter(g,O,C,b,m)}catch(e){if(e){i.error("FilterConverter",e)}else{i.error("FilterConverter","Not able to convert the condition for path '"+O+"' into a filter! The type is missing!")}continue}if(l){c=l(g,O,C,c);if(!c){continue}}if(!v.exclude){if(c.sPath==="$search"){continue}var T=/^\*(.+)\*$/.exec(c.sPath);if(T){var A=T[1].split(",");for(var x=0;x<A.length;x++){u.push(new t({path:A[x],operator:c.sOperator,value1:c.oValue1,caseSensitive:s}))}continue}y=P(c);u.push(c)}else{y=P(c);p.push(c)}}c=undefined;if(u.length===1){c=u[0]}else if(u.length>1){c=new t({filters:u,and:false})}if(c){p.unshift(c)}d=undefined;if(p.length===1){d=p[0]}else if(p.length>1){d=new t({filters:p,and:true})}if(y){y.condition=d;d=new t(y)}if(d){h.push(d)}}if(h.length===1){c=h[0]}else if(h.length>1){c=new t({filters:h,and:true})}else{c=null}i.info("FilterConverter",n.prettyPrintFilters(c));return c},prettyPrintFilters:function(e){var t;if(!e){return"no filters set"}if(e._bMultiFilter){t="";var i=e.bAnd;e.aFilters.forEach(function(e,r,a){t+=n.prettyPrintFilters(e);if(a.length-1!=r){t+=i?" and ":" or "}},this);return"("+t+")"}else{if(e.sOperator===r.Any||e.sOperator===r.All){t=e.sPath+" "+e.sOperator+" "+n.prettyPrintFilters(e.oCondition)}else{if(e.bCaseSensitive===false){t="tolower("+e.sPath+") "+e.sOperator+" tolower('"+e.oValue1+"')"}else{t=e.sPath+" "+e.sOperator+" '"+e.oValue1+"'"}if([r.BT,r.NB].indexOf(e.sOperator)>=0){t+="...'"+e.oValue2+"'"}}return t}}};return n},true);
//# sourceMappingURL=FilterConverter.js.map