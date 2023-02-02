//@ui5-bundle sap-ui-debug.js
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/debug/ControlTree",["sap/ui/base/EventProvider","sap/ui/core/Element","sap/ui/core/UIArea","./Highlighter","sap/ui/dom/getOwnerWindow","sap/base/Log"],function(e,t,i,s,r,o){"use strict";var n=e.extend("sap.ui.debug.ControlTree",{constructor:function(t,i,r,o){e.apply(this,arguments);this.oWindow=i;this.oDocument=i.document;this.oCore=t;this.oSelectedNode=null;this.oParentDomRef=r;this.oSelectionHighlighter=new s("sap-ui-testsuite-SelectionHighlighter");this.oHoverHighlighter=new s("sap-ui-testsuite-HoverHighlighter",true,"#c8f",1);this.onclick=n.prototype.onclick.bind(this);this.onmouseover=n.prototype.onmouseover.bind(this);this.onmouseout=n.prototype.onmouseout.bind(this);this.oParentDomRef.addEventListener("click",this.onclick);this.oParentDomRef.addEventListener("mouseover",this.onmouseover);this.oParentDomRef.addEventListener("mouseout",this.onmouseout);this.enableInplaceControlSelection();this.oCore.attachUIUpdated(this.renderDelayed,this);this.sSelectedNodeId="";this.sResourcePath=window.top.sap.ui.require.toUrl("")+"/";this.sTestResourcePath=this.sResourcePath+"../test-resources/";this.sSpaceUrl=this.sResourcePath+"sap/ui/debug/images/space.gif";this.sMinusUrl=this.sResourcePath+"sap/ui/debug/images/minus.gif";this.sPlusUrl=this.sResourcePath+"sap/ui/debug/images/plus.gif";this.sLinkUrl=this.sResourcePath+"sap/ui/debug/images/link.gif"}});n.M_EVENTS={SELECT:"SELECT"};n.prototype.exit=function(){document.removeEventListener("mouseover",this.selectControlInTree);this.oParentDomRef.removeEventListener("click",this.onclick);this.oParentDomRef.removeEventListener("mouseover",this.onmouseover);this.oParentDomRef.removeEventListener("mouseout",this.onmouseout)};n.prototype.renderDelayed=function(){if(this.oTimer){this.oWindow.clearTimeout(this.oTimer)}this.oTimer=this.oWindow.setTimeout(this.render.bind(this),0)};n.prototype.render=function(){var e=this.oParentDomRef;var t=null,s=i.registry.all();e.innerHTML="";for(var r in s){var t=s[r],o=this.createTreeNodeDomRef(t.getId(),0,"UIArea",this.sTestResourcePath+"sap/ui/core/images/controls/sap.ui.core.UIArea.gif");e.appendChild(o);var n=t.getContent();for(var r=0,a=n.length;r<a;r++){this.renderNode(e,n[r],1)}}};n.prototype.createTreeNodeDomRef=function(e,t,i,s){var r=this.oParentDomRef.ownerDocument.createElement("DIV");r.setAttribute("id","sap-debug-controltree-"+e);var o=i.substring(i.lastIndexOf(".")>-1?i.lastIndexOf(".")+1:0);r.innerHTML="<img src='"+this.sSpaceUrl+"' align='absmiddle'><img src='"+s+"' align='absmiddle'>&nbsp;<span>"+o+" - "+e+"</span>";r.firstChild.style="height:12px;width:12px;display:none;";r.firstChild.nextSibling.style="height:16px;width:16px;";r.style.overflow="hidden";r.style.whiteSpace="nowrap";r.style.textOverflow="ellipsis";r.style.paddingLeft=t*16+"px";r.style.height="20px";r.style.cursor="default";r.setAttribute("sap-type",i);r.setAttribute("sap-id",e);r.setAttribute("sap-expanded","true");r.setAttribute("sap-level",""+t);r.title=i+" - "+e;return r};n.prototype.createLinkNode=function(e,t,i,s){var r=this.oParentDomRef.ownerDocument.createElement("DIV");r.setAttribute("id","sap-debug-controltreelink-"+t);var o=s?s.substring(s.lastIndexOf(".")>-1?s.lastIndexOf(".")+1:0):"";r.innerHTML="<img src='"+this.sSpaceUrl+"' align='absmiddle'><img src='"+this.sLinkUrl+"' align='absmiddle'>&nbsp;<span>"+(o?o+" - ":"")+t+"</span>";r.firstChild.style="height:12px;width:12px;display:none;";r.firstChild.nextSibling.style="height:12px;width:12px;";r.lastChild.style="color:#888;border-bottom:1px dotted #888;";r.style.overflow="hidden";r.style.whiteSpace="nowrap";r.style.textOverflow="ellipsis";r.style.paddingLeft=i*16+"px";r.style.height="20px";r.style.cursor="default";r.setAttribute("sap-type","Link");r.setAttribute("sap-id",t);r.setAttribute("sap-expanded","true");r.setAttribute("sap-level",""+i);r.title="Association to '"+t+"'";e.appendChild(r);return r};n.prototype.renderNode=function(e,i,s){if(!i){return}var r=i.getMetadata();var o=this.sTestResourcePath+r.getLibraryName().replace(/\./g,"/")+"/images/controls/"+r.getName()+".gif";var n=this.createTreeNodeDomRef(i.getId(),s,r.getName(),o);e.appendChild(n);var a=false;if(i.mAggregations){for(var l in i.mAggregations){a=true;var h=i.mAggregations[l];if(h&&h.length){for(var d=0;d<h.length;d++){var p=h[d];if(p instanceof t){this.renderNode(e,h[d],s+1)}}}else if(h instanceof t){this.renderNode(e,h,s+1)}}}if(i.mAssociations){for(var l in i.mAssociations){a=true;var u=i.mAssociations[l];if(Array.isArray(u)){for(var d=0;d<u.length;d++){var p=u[d];if(typeof p==="string"){this.createLinkNode(e,p,s+1)}}}else if(typeof u==="string"){this.createLinkNode(e,u,s+1)}}}if(a){var g=n.getElementsByTagName("IMG")[0];g.src=this.sMinusUrl;g.style.display=""}};n.prototype.onclick=function(e){var i=e.target;if(i.tagName=="IMG"){var s=i.parentNode,r=parseInt(s.getAttribute("sap-level")),o=s.nextSibling,n=s.getAttribute("sap-expanded")=="true";i=s.firstChild;if(o){var a=parseInt(o.getAttribute("sap-level"));while(o&&a>r){var l=o.getElementsByTagName("IMG")[0];if(n){o.style.display="none";o.setAttribute("sap-expanded","false");if(l&&l.src!==this.sSpaceUrl){l.src=this.sPlusUrl}}else{o.style.display="block";o.setAttribute("sap-expanded","true");if(l&&l.src!==this.sSpaceUrl){l.src=this.sMinusUrl}}o=o.nextSibling;if(o){a=parseInt(o.getAttribute("sap-level"))}}}if(n){i.src=this.sPlusUrl;s.setAttribute("sap-expanded","false")}else{i.src=this.sMinusUrl;s.setAttribute("sap-expanded","true")}}else{if(i.tagName!="SPAN"){i=i.getElementsByTagName("SPAN")[0]}var s=i.parentNode,h=s.getAttribute("sap-id"),d=this.oCore.byId(h),p=s.getAttribute("sap-type")==="Link"?"sap-debug-controltree-"+h:s.id;this.oSelectionHighlighter.hide();if(d instanceof t){this.oSelectionHighlighter.highlight(d.getDomRef());this.oHoverHighlighter.hide()}this.deselectNode(this.sSelectedNodeId);this.selectNode(p)}};n.prototype.onmouseover=function(e){var t=e.target;if(t.tagName=="SPAN"){this.oHoverHighlighter.highlight(this.getTargetDomRef(t.parentNode))}};n.prototype.onmouseout=function(e){var t=e.target;if(t.tagName=="SPAN"){if(this.getTargetDomRef(t.parentNode)){this.oHoverHighlighter.hide()}}};n.prototype.selectNode=function(e){if(!e){return}var t=(r(this.oParentDomRef)||window).document.getElementById(e);if(!t){o.warning("Control with Id '"+e.substring(22)+"' not found in tree");return}var i=t.getAttribute("sap-id");var s=t.getElementsByTagName("SPAN")[0];s.style.backgroundColor="#000066";s.style.color="#FFFFFF";this.sSelectedNodeId=e;this.fireEvent(n.M_EVENTS.SELECT,{id:e,controlId:i})};n.prototype.deselectNode=function(e){if(!e){return}var t=(r(this.oParentDomRef)||window).document.getElementById(e);var i=t.getElementsByTagName("SPAN")[0];i.style.backgroundColor="transparent";i.style.color="#000000";this.sSelectedNodeId=e};n.prototype.getTargetDomRef=function(e){var s=e.getAttribute("sap-type"),r=e.getAttribute("sap-id"),o=s==="UIArea"?i.registry.get(r):this.oCore.byId(r);while(o instanceof t){var n=o.getDomRef();if(n){return n}o=o.getParent()}if(o instanceof i){return o.getRootNode()}};n.prototype.enableInplaceControlSelection=function(){this.selectControlInTree=n.prototype.selectControlInTree.bind(this);document.addEventListener("mouseover",this.selectControlInTree)};n.prototype.selectControlInTree=function(e){if(e){if(e.ctrlKey&&e.shiftKey&&!e.altKey){var t=e.srcElement||e.target;while(t&&(!t.id||!this.oCore.byId(t.id))){t=t.parentNode}if(t&&t.id&&this.oCore.byId(t.id)){this.oHoverHighlighter.highlight(t)}else{this.oHoverHighlighter.hide()}}else{this.oHoverHighlighter.hide()}}};return n});
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/debug/DebugEnv",["sap/ui/base/Interface","./ControlTree","./LogViewer","./PropertyList","sap/base/Log","sap/ui/thirdparty/jquery","sap/ui/core/Configuration"],function(t,e,o,i,r,jQuery,s){"use strict";var n=function(){};n.prototype.startPlugin=function(t,e){this.oCore=t;this.oWindow=window;try{this.bRunsEmbedded=typeof window.top.testfwk==="undefined";r.info("Starting DebugEnv plugin ("+(this.bRunsEmbedded?"embedded":"testsuite")+")");if(!this.bRunsEmbedded||t.getConfiguration().getInspect()){this.init(e)}if(!this.bRunsEmbedded||t.getConfiguration().getTrace()){this.initLogger(r,e)}}catch(t){r.warning("DebugEnv plugin can not be started outside the Testsuite.")}};n.prototype.stopPlugin=function(){r.info("Stopping DebugEnv plugin.");this.oCore=null};n.prototype.init=function(t){this.oControlTreeWindow=this.bRunsEmbedded?this.oWindow:top.document.getElementById("sap-ui-ControlTreeWindow")||top.frames["sap-ui-ControlTreeWindow"]||top;this.oPropertyListWindow=this.bRunsEmbedded?this.oWindow:top.document.getElementById("sap-ui-PropertyListWindow")||top.frames["sap-ui-PropertyListWindow"]||top;var o=s.getRTL();var r=(this.oControlTreeWindow.document||this.oControlTreeWindow).querySelector("#sap-ui-ControlTreeRoot"),n=(this.oPropertyListWindow.document||this.oPropertyListWindow).querySelector("#sap-ui-PropertyWindowRoot");if(!r){r=this.oControlTreeWindow.document.createElement("DIV");r.setAttribute("id","sap-ui-ControlTreeRoot");r.setAttribute("tabindex",-1);r.style.position="absolute";r.style.fontFamily="Arial";r.style.fontSize="8pt";r.style.backgroundColor="white";r.style.color="black";r.style.border="1px solid gray";r.style.overflow="auto";r.style.zIndex="999999";r.style.top="1px";if(o){r.style.left="1px"}else{r.style.right="1px"}r.style.height="49%";r.style.width="200px";this.oControlTreeWindow.document.body.appendChild(r)}else{r.innerHTML=""}this.oControlTreeRoot=r;if(!n){n=this.oPropertyListWindow.document.createElement("DIV");n.setAttribute("id","sap-ui-PropertyWindowRoot");n.setAttribute("tabindex",-1);n.style.position="absolute";n.style.fontFamily="Arial";n.style.fontSize="8pt";n.style.backgroundColor="white";n.style.color="black";n.style.border="1px solid gray";n.style.overflow="auto";n.style.zIndex="99999";n.style.width="196px";n.style.height="49%";if(o){n.style.left="1px"}else{n.style.right="1px"}n.style.bottom="1px";this.oPropertyListWindow.document.body.appendChild(n)}else{n.innerHTML=""}this.oPropertyWindowRoot=n;this.oControlTree=new e(this.oCore,this.oWindow,r,this.bRunsEmbedded);this.oPropertyList=new i(this.oCore,this.oWindow,n);this.oControlTree.attachEvent(e.M_EVENTS.SELECT,this.oPropertyList.update,this.oPropertyList);if(!t){this.oControlTree.renderDelayed()}window.addEventListener("unload",function(t){this.oControlTree.exit();this.oPropertyList.exit()}.bind(this))};n.prototype.initLogger=function(t,e){this.oLogger=t;this.oLogger.setLogEntriesLimit(Infinity);if(!this.bRunsEmbedded){this.oTraceWindow=top.document.getElementById("sap-ui-TraceWindow");if(this.oTraceWindow){this.oTraceViewer=top.oLogViewer=new o(this.oTraceWindow,"sap-ui-TraceWindowRoot")}else{this.oTraceWindow=top.frames["sap-ui-TraceWindow"];this.oTraceViewer=this.oTraceWindow.oLogViewer=new o(this.oTraceWindow,"sap-ui-TraceWindowRoot")}this.oTraceViewer.sLogEntryClassPrefix="lvl";this.oTraceViewer.lock()}else{this.oTraceWindow=this.oWindow;this.oTraceViewer=new o(this.oTraceWindow,"sap-ui-TraceWindowRoot")}this.oLogger.addLogListener(this.oTraceViewer);this.oCore.attachUIUpdated(this.enableLogViewer,this);if(!e){var i=this;this.oTimer=setTimeout(function(){i.enableLogViewer()},0)}};n.prototype.enableLogViewer=function(){if(this.oTimer){clearTimeout(this.oTimer);this.oTimer=undefined}this.oCore.detachUIUpdated(this.enableLogViewer,this);if(this.oTraceViewer){this.oTraceViewer.unlock()}};n.prototype.isRunningEmbedded=function(){return this.bRunsEmbedded};n.prototype.isControlTreeShown=function(){return jQuery(this.oControlTreeRoot).css("visibility")==="visible"||jQuery(this.oControlTreeRoot).css("visibility")==="inherit"};n.prototype.showControlTree=function(){if(!this.oControlTreeRoot){this.init(false)}jQuery(this.oControlTreeRoot).css("visibility","visible")};n.prototype.hideControlTree=function(){jQuery(this.oControlTreeRoot).css("visibility","hidden")};n.prototype.isTraceWindowShown=function(){var t=this.oTraceWindow&&this.oTraceWindow.document.getElementById("sap-ui-TraceWindowRoot");return t&&(jQuery(t).css("visibility")==="visible"||jQuery(t).css("visibility")==="inherit")};n.prototype.showTraceWindow=function(){if(!this.oTraceWindow){this.initLogger(r,false)}var t=this.oTraceWindow&&this.oTraceWindow.document.getElementById("sap-ui-TraceWindowRoot");if(t){jQuery(t).css("visibility","visible")}};n.prototype.hideTraceWindow=function(){var t=this.oTraceWindow&&this.oTraceWindow.document.getElementById("sap-ui-TraceWindowRoot");if(t){jQuery(t).css("visibility","hidden")}};n.prototype.isPropertyListShown=function(){return jQuery(this.oPropertyWindowRoot).css("visibility")==="visible"||jQuery(this.oPropertyWindowRoot).css("visibility")==="inherit"};n.prototype.showPropertyList=function(){if(!this.oPropertyWindowRoot){this.init(false)}jQuery(this.oPropertyWindowRoot).css("visibility","visible")};n.prototype.hidePropertyList=function(){jQuery(this.oPropertyWindowRoot).css("visibility","hidden")};(function(){var e=new n;sap.ui.getCore().registerPlugin(e);var o=new t(e,["isRunningEmbedded","isControlTreeShown","showControlTree","hideControlTree","isTraceWindowShown","showTraceWindow","hideTraceWindow","isPropertyListShown","showPropertyList","hidePropertyList"]);n.getInstance=function(){return o}})();return n},true);
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/debug/Highlighter",["sap/ui/thirdparty/jquery","sap/base/util/uid","sap/ui/dom/jquery/rect"],function(jQuery,t){"use strict";var e=function(e,i,s,d){this.sId=e||t();this.bFilled=i==true;this.sColor=s||"blue";if(isNaN(d)){this.iBorderWidth=2}else if(d<=0){this.iBorderWidth=0}else{this.iBorderWidth=d}};e.prototype.highlight=function(t){if(!t||!t.parentNode){return}var e=this.sId?window.document.getElementById(this.sId):null;if(!e){e=t.ownerDocument.createElement("div");e.setAttribute("id",this.sId);e.style.position="absolute";e.style.border=this.iBorderWidth+"px solid "+this.sColor;e.style.display="none";e.style.margin="0px";e.style.padding="0px";if(this.bFilled){var i=t.ownerDocument.createElement("div");i.textContent=" ";i.style.backgroundColor=this.sColor;i.style.opacity="0.2";i.style.height="100%";i.style.width="100%";e.appendChild(i)}t.ownerDocument.body.appendChild(e)}var s=jQuery(t).rect();e.style.top=s.top-this.iBorderWidth+"px";e.style.left=s.left-this.iBorderWidth+"px";e.style.width=s.width+"px";e.style.height=s.height+"px";e.style.display="block"};e.prototype.hide=function(){var t=this.sId?window.document.getElementById(this.sId):null;if(!t){return}t.style.display="none"};return e},true);
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/debug/LogViewer",function(){"use strict";var t=function(e,o){this.oWindow=e;this.oDomNode=e.querySelector("#"+o);if(!this.oDomNode){var i=this.oWindow.document.createElement("DIV");i.setAttribute("id",o);i.style.overflow="auto";i.style.tabIndex="-1";i.style.position="absolute";i.style.bottom="0px";i.style.left="0px";i.style.right="202px";i.style.height="200px";i.style.border="1px solid gray";i.style.fontFamily="Arial monospaced for SAP,monospace";i.style.fontSize="11px";i.style.zIndex="999999";this.oWindow.document.body.appendChild(i);this.oDomNode=i}this.iLogLevel=3;this.sLogEntryClassPrefix=undefined;this.clear();this.setFilter(t.NO_FILTER)};t.NO_FILTER=function(t){return true};t.prototype.clear=function(){this.oDomNode.innerHTML=""};t.xmlEscape=function(t){t=t.replace(/\&/g,"&amp;");t=t.replace(/\</g,"&lt;");t=t.replace(/\"/g,"&quot;");return t};t.prototype.addEntry=function(e){var o=this.oWindow.ownerDocument.createElement("div");if(this.sLogEntryClassPrefix){o.className=this.sLogEntryClassPrefix+e.level}else{o.style.overflow="hidden";o.style.textOverflow="ellipsis";o.style.height="1.3em";o.style.width="100%";o.style.whiteSpace="noWrap"}var i=t.xmlEscape(e.time+"  "+e.message),s=this.oWindow.ownerDocument.createTextNode(i);o.appendChild(s);o.title=e.message;o.style.display=this.oFilter(i)?"":"none";this.oDomNode.appendChild(o);return o};t.prototype.fillFromLogger=function(t){this.clear();this.iFirstEntry=t;if(!this.oLogger){return}var e=this.oLogger.getLogEntries();for(var o=this.iFirstEntry,i=e.length;o<i;o++){if(e[o].level<=this.iLogLevel){this.addEntry(e[o])}}this.scrollToBottom()};t.prototype.scrollToBottom=function(){this.oDomNode.scrollTop=this.oDomNode.scrollHeight};t.prototype.truncate=function(){this.clear();this.fillFromLogger(this.oLogger.getLogEntries().length)};t.prototype.setFilter=function(e){this.oFilter=e=e||t.NO_FILTER;var o=this.oDomNode.childNodes;for(var i=0,s=o.length;i<s;i++){var r=o[i].innerText;if(!r){r=o[i].innerHTML}o[i].style.display=e(r)?"":"none"}this.scrollToBottom()};t.prototype.setLogLevel=function(t){this.iLogLevel=t;if(this.oLogger){this.oLogger.setLevel(t)}this.fillFromLogger(this.iFirstEntry)};t.prototype.lock=function(){this.bLocked=true};t.prototype.unlock=function(){this.bLocked=false;this.fillFromLogger(0)};t.prototype.onAttachToLog=function(t){this.oLogger=t;this.oLogger.setLevel(this.iLogLevel);if(!this.bLocked){this.fillFromLogger(0)}};t.prototype.onDetachFromLog=function(t){this.oLogger=undefined;this.fillFromLogger(0)};t.prototype.onLogEntry=function(t){if(!this.bLocked){var e=this.addEntry(t);if(e&&e.style.display!=="none"){this.scrollToBottom()}}};return t},true);
/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/debug/PropertyList",["sap/ui/base/DataType","sap/ui/base/EventProvider","sap/ui/core/Element","sap/ui/core/ElementMetadata","sap/base/util/isEmptyObject","sap/base/security/encodeXML"],function(e,t,a,s,n,o){"use strict";var i=t.extend("sap.ui.debug.PropertyList",{constructor:function(e,a,s){t.apply(this,arguments);this.oWindow=a;this.oParentDomRef=s;this.oCore=e;var n=window.top.document.createElement("link");n.rel="stylesheet";n.href=window.top.sap.ui.require.toUrl("sap/ui/debug/PropertyList.css");window.top.document.head.appendChild(n);this.onchange=i.prototype.onchange.bind(this);s.addEventListener("change",this.onchange);this.onfocus=i.prototype.onfocus.bind(this);s.addEventListener("focusin",this.onfocus);this.onkeydown=i.prototype.onkeydown.bind(this);s.addEventListener("keydown",this.onkeydown)}});i.prototype.exit=function(){this.oParentDomRef.removeEventListener("change",this.onchange);this.oParentDomRef.removeEventListener("focusin",this.onfocus);this.oParentDomRef.removeEventListener("keydown",this.onkeydown)};i.prototype.update=function(e){var t=this.sControlId=e.getParameter("controlId");this.oParentDomRef.innerHTML="";var a=this.oCore.byId(t);if(!a){this.oParentDomRef.innerHTML="Please select a valid control";return}var o=a.getMetadata(),i=[];i.push("Type : "+o.getName()+"<br >");i.push("Id : "+a.getId()+"<br >");i.push("<div class='sapDbgSeparator'>&nbsp;</div>");i.push("<table class='sapDbgPropertyList' cellspacing='1'><tbody>");while(o instanceof s){var r=this.getPropertyLikeSettings(o);if(!n(r)){if(o!==a.getMetadata()){i.push("<tr><td class='sapDbgPLSubheader' colspan=\"2\">BaseType: ");i.push(o.getName());i.push("</td></tr>")}this.renderSettings(i,a,r)}o=o.getParent()}i.push("</tbody></table>");this.oParentDomRef.innerHTML=i.join("");this.mHelpDocs={}};i.prototype.getPropertyLikeSettings=function(t){var a={};Object.values(t.getProperties()).forEach(function(e){a[e.name]=e});Object.values(t.getAggregations()).forEach(function(t){if(t.multiple===false&&t.altTypes&&t.altTypes.length&&e.getType(t.altTypes[0])!=null){a[t.name]=t}});return a};i.prototype.renderSettings=function(t,s,n){Object.values(n).forEach(function(n){var i=n.name,r=n.get(s),p=n.multiple===false?e.getType(n.altTypes[0]):n.getType();t.push("<tr><td>");t.push(i);t.push("</td><td>");var u="";if(p.getPrimitiveType().getName()==="boolean"){t.push("<input type='checkbox' data-name='"+i+"' ");if(r==true){t.push("checked='checked'")}t.push(">")}else if(p.isEnumType()){var l=p.getEnumValues();t.push("<select data-name='"+i+"'>");for(var h in l){t.push("<option ");if(h===r){t.push(" selected ")}t.push("value='"+o(h)+"'>");t.push(o(h));t.push("</option>")}t.push("</select>")}else{var c="";if(r===null){c="class='sapDbgComplexValue'";r="(null)"}else if(r instanceof a){c="class='sapDbgComplexValue'";if(Array.isArray(r)){r=r.join(", ")}else{r=String(r)}u=' title="This aggregation currently references an Element. You can set a '+p.getName()+' value instead"'}t.push("<input type='text' "+c+" value='"+o(""+r)+"'"+u+" data-name='"+i+"'>")}t.push("</td></tr>")})};i.prototype.onkeydown=function(e){var t=e.target;if(e.keyCode==13&&t.tagName==="INPUT"&&t.type==="text"){this.applyChange(t)}};i.prototype.onchange=function(e){var t=e.target;if(t.tagName==="SELECT"||t.tagName==="INPUT"){this.applyChange(t)}};i.prototype.onfocus=function(e){var t=e.target;if(t.tagName==="INPUT"&&t.dataset.name){if(t.style.color==="#a5a5a5"){t.style.color="";t.value=""}}};i.prototype.applyChange=function(t){var a=this.oCore.byId(this.sControlId),s=t.dataset.name,n=a.getMetadata().getPropertyLikeSetting(s);if(n){var o=t.type==="checkbox"?String(t.checked):t.value,i=n.multiple!=null?e.getType(n.altTypes[0]):n.getType();if(i){var r=i.parseValue(o);if(i.isValid(r)&&r!=="(null)"){n.set(a,r);t.classList.remove("sapDbgComplexValue")}}}};return i});
sap.ui.requireSync("sap/ui/debug/DebugEnv");
//# sourceMappingURL=sap-ui-debug.js.map
