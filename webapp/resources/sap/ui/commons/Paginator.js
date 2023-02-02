/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/ui/core/Control","./PaginatorRenderer","sap/ui/dom/jquery/Selectors"],function(jQuery,e,t,i){"use strict";var a=e.PaginatorEvent;var r=t.extend("sap.ui.commons.Paginator",{metadata:{library:"sap.ui.commons",deprecated:true,properties:{currentPage:{type:"int",group:"Misc",defaultValue:1},numberOfPages:{type:"int",group:"Misc",defaultValue:null}},events:{page:{parameters:{srcPage:{type:"int"},targetPage:{type:"int"},type:{type:"sap.ui.commons.PaginatorEvent"}}}}}});r.MAX_NUMBER_PAGES=5;r.prototype.init=function(){this.bShowAnimation=true};r.prototype.onclick=function(e){this._handleSelect(e)};r.prototype.setCurrentPage=function(e,t){this.setProperty("currentPage",e,t);if(this.getDomRef()){i.updateBackAndForward(this)}return this};r.prototype.triggerPaginatorAnimation=function(){var e=[];var t=[];var a=this.$("pages").children();var r=this._calculatePagesRange();var s;if(this._oOldRange){s=this._oOldRange}else{s={};var n=a[0].id.split("--");s.firstPage=parseInt(n[n.length-1]);n=a[a.length-1].id.split("--");s.lastPage=parseInt(n[n.length-1])}var g;for(g=r.firstPage;g<=r.lastPage;g++){if(g<s.firstPage||g>s.lastPage){t.push(g)}}var o={firstPage:t[0],lastPage:t[t.length-1]};for(g=s.firstPage;g<=s.lastPage;g++){if(g<r.firstPage||g>r.lastPage){e.push(g)}}var f=i.getPagesHtml(this.getId(),s,this.getCurrentPage(),true);var u=i.getPagesHtml(this.getId(),o,this.getCurrentPage(),false);if(s.firstPage<o.firstPage){u=f+u}else{u=u+f}var l=document.activeElement;var p=l?l.id:undefined;this.getDomRef("pages").innerHTML=u;if(p){l=document.getElementById(p)}else{l=document.getElementById("testPaginator-a--"+this.getCurrentPage())}if(l){l.focus()}var h="li--";this._oOldRange=r;function d(){var e=document.getElementById(this.id);if(e){e.parentNode.removeChild(e)}}for(g=0;g<e.length;g++){this.$(h+e[g]).hide(400,d)}for(g=0;g<t.length;g++){this.$(h+t[g]).show(400)}};r.prototype._calculatePagesRange=function(){var e=1;var t=this.getNumberOfPages();var i=this.getCurrentPage();var a=this.getNumberOfPages();if(i<4){e=1;if(t>r.MAX_NUMBER_PAGES){t=r.MAX_NUMBER_PAGES}}else if(i==t){if(a<5){e=1}else{e=t-4}}else if(t-i<3){e=t-4}else{e=i-2;t=i+2}return{firstPage:e,lastPage:t}};r.prototype.onkeydown=function(e){var t=e.getPseudoTypes();if(t.indexOf("saptabnext")!=-1){this.triggerTabbingNavigation(e,false)}else if(t.indexOf("saptabprevious")!=-1){this.triggerTabbingNavigation(e,true)}else if(t.indexOf("sapincrease")!=-1){this.triggerInternalNavigation(e,"next")}else if(t.indexOf("sapdecrease")!=-1){this.triggerInternalNavigation(e,"previous")}else if(t.indexOf("sapenter")!=-1){this._handleSelect(e)}};r.prototype.triggerInternalNavigation=function(e,t){var i=this.$().find(":sapFocusable");var a=jQuery(i).index(e.target);var r,s;if(t=="next"){r=a+1;if(jQuery(e.target).hasClass("sapUiPagCurrentPage")){r=r+1}s=i[r];if(s){jQuery(s).trigger("focus");e.preventDefault();e.stopPropagation()}}else if(t=="previous"&&i[a-1]){r=a-1;s=i[r];if(s&&jQuery(s).hasClass("sapUiPagCurrentPage")){s=i[r-1]}if(s){jQuery(s).trigger("focus");e.preventDefault();e.stopPropagation()}}};r.prototype.triggerTabbingNavigation=function(e,t){var i=this.$().find(":sapFocusable");if(!t){jQuery(i[i.length-1]).trigger("focus")}else{var a=jQuery(i).index(e.target);if(a!=0){jQuery(i[0]).trigger("focus")}}};r.prototype.getFocusInfo=function(){var e=this.$().find(":focus").attr("id");if(e){return{customId:e}}else{return t.prototype.getFocusInfo.apply(this,arguments)}};r.prototype.applyFocusInfo=function(e){if(e&&e.customId){this.$().find("#"+e.customId).trigger("focus")}else{t.prototype.getFocusInfo.apply(this,arguments)}return this};r.prototype._handleSelect=function(e){if(e&&e.target){e.preventDefault();var t=e.target;if(!t.id){t=t.parentNode}if(t.id&&t.id!=this.getId()+"-pages"){var i=t.id.split("--");if(i.length>1){var r=i[i.length-1];var s=null;var n=this.getCurrentPage();var g=n;if(r.match(/^\d+$/)){s=a.Goto;g=parseInt(r)}else if(r=="firstPageLink"){s=a.First;g=1}else if(r=="backLink"){s=a.Previous;g=Math.max(n-1,1)}else if(r=="forwardLink"){s=a.Next;g=Math.min(n+1,this.getNumberOfPages())}else if(r=="lastPageLink"){s=a.Last;g=this.getNumberOfPages()}if(g!=n){if(this.bShowAnimation){this.setCurrentPage(g,true);this.triggerPaginatorAnimation()}else{this.setCurrentPage(g)}this.firePage({srcPage:n,targetPage:g,type:s})}}}}};return r});
//# sourceMappingURL=Paginator.js.map