/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device","sap/ui/layout/library"],function(e,s){"use strict";var a=s.GridPosition;var i={apiVersion:2};i.render=function(s,i){var r=/^([X][L](?:[0-9]|1[0-1]))? ?([L](?:[0-9]|1[0-1]))? ?([M](?:[0-9]|1[0-1]))? ?([S](?:[0-9]|1[0-1]))?$/i;var t=/^([X][L](?:[1-9]|1[0-2]))? ?([L](?:[1-9]|1[0-2]))? ?([M](?:[1-9]|1[0-2]))? ?([S](?:[1-9]|1[0-2]))?$/i;s.openStart("div",i);s.class("sapUiRespGrid");var p=i._getCurrentMediaContainerRange(e.media.RANGESETS.SAP_STANDARD_EXTENDED).name;s.class("sapUiRespGridMedia-Std-"+p);var n=i.getHSpacing();if(n===.5){n="05"}else if(n!==0&&n!==1&&n!==2){n=1}s.class("sapUiRespGridHSpace"+n);var l=i.getVSpacing();if(l===.5){l="05"}else if(l!==0&&l!==1&&l!==2){l=1}s.class("sapUiRespGridVSpace"+l);var d=i.getPosition();if(d){d=d.toUpperCase();if(d===a.Center.toUpperCase()){s.class("sapUiRespGridPosCenter")}else if(d===a.Right.toUpperCase()){s.class("sapUiRespGridPosRight")}}var f=i.getWidth();if(f!=="100%"&&f!=="auto"&&f!=="inherit"){if(n===0){s.style("width",f)}else{s.style("width","-webkit-calc("+f+" - "+n+"rem)");s.style("width","calc("+f+" - "+n+"rem)")}}var v=i._getAccessibleRole();var c;if(v){c={role:v}}s.accessibilityState(i,c);s.openEnd();var g=i.getContent();var o=i.getDefaultSpan();var L=["","XL3","L3","M6","S12"];var S=["","XL0","L0","M0","S0"];var U=t.exec(o);var u=i._getSpanXLChanged();var R=i._getIndentXLChanged();var G=i.getDefaultIndent();var b=r.exec(G);for(var X=0;X<g.length;X++){s.openStart("div",i.getId()+"-wrapperfor-"+g[X].getId());var h=i._getLayoutDataForControl(g[X]);var C=false;if(!g[X].getVisible()){s.class("sapUiRespGridSpanInvisible")}if(h){var I=false;if(h.getLinebreak()===true){s.class("sapUiRespGridBreak")}else{if(h.getLinebreakXL()===true){I=true;s.class("sapUiRespGridBreakXL")}if(h.getLinebreakL()===true){if(!I&&!h._getLinebreakXLChanged()){s.class("sapUiRespGridBreakXL")}s.class("sapUiRespGridBreakL")}if(h.getLinebreakM()===true){s.class("sapUiRespGridBreakM")}if(h.getLinebreakS()===true){s.class("sapUiRespGridBreakS")}}var M;var k;var y=h.getSpan();if(!y){M=U}else{M=t.exec(y);if(/XL/gi.test(y)){C=true}}if(M){for(var _=1;_<M.length;_++){var w=M[_];if(!w){w=U[_];if(!w){w=L[_]}}if(w.substr(0,1)==="L"){k=w.substr(1,2)}var B=h.getSpanXL();var D=h.getSpanL();var V=h.getSpanM();var x=h.getSpanS();w=w.toUpperCase();if(w.substr(0,2)==="XL"&&B>0&&B<13){s.class("sapUiRespGridSpanXL"+B);C=true}else if(w.substr(0,1)==="L"&&D>0&&D<13){s.class("sapUiRespGridSpanL"+D);k=D}else if(w.substr(0,1)==="M"&&V>0&&V<13){s.class("sapUiRespGridSpanM"+V)}else if(w.substr(0,1)==="S"&&x>0&&x<13){s.class("sapUiRespGridSpanS"+x)}else{if(w.substr(0,2)!=="XL"||u||C){s.class("sapUiRespGridSpan"+w)}}}if(!u&&!C){s.class("sapUiRespGridSpanXL"+k)}}var E;var H;var A=h.getIndent();if(!A||A.length==0){E=b}else{E=r.exec(A);if(/XL/gi.test(A)){R=true}}if(!E){E=b;if(!E){E=undefined}}var P=h.getIndentXL();var m=h.getIndentL();var F=h.getIndentM();var N=h.getIndentS();if(E){for(var _=1;_<E.length;_++){var T=E[_];if(!T){if(b&&b[_]){T=b[_]}else{T=S[_]}}if(T){T=T.toUpperCase();if(T.substr(0,1)==="L"){H=T.substr(1,2)}if(T.substr(0,2)==="XL"&&P>0&&P<12){s.class("sapUiRespGridIndentXL"+P);R=true}else if(T.substr(0,1)==="L"&&m>0&&m<12){s.class("sapUiRespGridIndentL"+m);H=m}else if(T.substr(0,1)==="M"&&F>0&&F<12){s.class("sapUiRespGridIndentM"+F)}else if(T.substr(0,1)==="S"&&N>0&&N<12){s.class("sapUiRespGridIndentS"+N)}else{if(!/^(XL0)? ?(L0)? ?(M0)? ?(S0)?$/.exec(T)){s.class("sapUiRespGridIndent"+T)}}}}if(!R){if(H&&H>0){s.class("sapUiRespGridIndentXL"+H)}}}if(!h.getVisibleXL()){s.class("sapUiRespGridHiddenXL")}if(!h.getVisibleL()){s.class("sapUiRespGridHiddenL")}if(!h.getVisibleM()){s.class("sapUiRespGridHiddenM")}if(!h.getVisibleS()){s.class("sapUiRespGridHiddenS")}var $=h.getMoveBackwards();if($&&$.length>0){var W=r.exec($);if(W){for(var _=1;_<W.length;_++){var j=W[_];if(j){s.class("sapUiRespGridBwd"+j.toUpperCase())}}}}var q=h.getMoveForward();if(q&&q.length>0){var z=r.exec(q);if(z){for(var _=1;_<z.length;_++){var J=z[_];if(J){s.class("sapUiRespGridFwd"+J.toUpperCase())}}}}if(typeof h._sStylesInternal==="string"){var K=h._sStylesInternal.split(" ");for(var O=0;O<K.length;O++){s.class(K[O])}}}if(!h){var w="";if(U){for(var _=1;_<U.length;_++){w=U[_];if(!w){if(_===1&&U[_+1]){w="X"+U[_+1]}else{w=L[_]}}s.class("sapUiRespGridSpan"+w.toUpperCase())}}else{for(var _=1;_<L.length;_++){w=L[_];s.class("sapUiRespGridSpan"+w.toUpperCase())}}var T="";if(b){for(var _=1;_<b.length;_++){T=b[_];if(!T){if(_===1&&b[_+1]){T="X"+b[_+1]}else{T=S[_]}}if(T.substr(0,1)!=="X"&&T.substr(1,1)!=="0"||T.substr(0,1)=="X"&&T.substr(2,1)!=="0"){s.class("sapUiRespGridIndent"+T.toUpperCase())}}}}s.openEnd();s.renderControl(g[X]);s.close("div")}s.close("div")};return i},true);
//# sourceMappingURL=GridRenderer.js.map