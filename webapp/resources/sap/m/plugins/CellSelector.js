/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./PluginBase","sap/ui/events/KeyCodes","sap/ui/core/Core","sap/ui/thirdparty/jquery","sap/base/Log"],function(e,o,t,jQuery,n){"use strict";var i={NEXT:1,PREVIOUS:2};var s={ABOVE:0,RIGHT:1,BELOW:2,LEFT:3,IN:4};var r="sapMPluginsCellSelector";var l=e.extend("sap.m.plugins.CellSelector",{metadata:{library:"sap.m",properties:{},events:{}}});l.prototype.onActivate=function(e){e.addDelegate(this,true,this);this._oSession={};this._oSession.oCanvas={};this._oSession.oEdge={};this._oSession.oBorderLine={};var o=this.getConfig("scrollEvent");o&&e.attachEvent(o,this._handleScroll,this);this._fnMouseupHandler=this._onmouseup.bind(this);document.addEventListener("mouseup",this._fnMouseupHandler);var t=this.getControl().getDomRef(this.getConfig("scrollContainer"));if(t){this._fnMouseleaveHandler=this._onMouseLeave.bind(this);t.addEventListener("mouseleave",this._fnMouseleaveHandler)}};l.prototype.onDeactivate=function(e){e.removeDelegate(this,this);this._oSession={};this._oSession.oCanvas={};this._oSession.oEdge={};this._oSession.oBorderLine={};var o=this.getConfig("scrollEvent");o&&e.detachEvent(o,this._handleScroll,this);document.removeEventListener("mouseup",this._fnMouseupHandler);var t=this.getControl().getDomRef(this.getConfig("scrollContainer"));if(t){t.removeEventListener("mouseleave",this._fnMouseleaveHandler)}};l.prototype.onAfterRendering=function(){this._fnMouseupHandler=this._onmouseup.bind(this);document.addEventListener("mouseup",this._fnMouseupHandler);var e=this.getControl().getDomRef(this.getConfig("scrollContainer"));if(e){this._fnMouseleaveHandler=this._onMouseLeave.bind(this);e.addEventListener("mouseleave",this._fnMouseleaveHandler)}};l.prototype.getSelectedCells=function(){if(!this._bSelecting){return{}}var e=a(this._oSession.mSource,this._oSession.mTarget);var o={};for(var t=e.from.rowIndex;t<e.to.rowIndex;t++){var n=this.getConfig("contextByIndex",this.getControl(),t),i=[];for(var s=e.from.colIndex;s<e.to.colIndex;s++){var r=this.getConfig("columnByIndex",this.getControl(),s);if(r){i.push(s)}}o[t]={rowContext:n,columnIndices:i}}return o};l.prototype.onsapspace=function(e){if(e.isMarked()){return}else if(!this.getConfig("isSelectionEnabled",this.getControl())){n.error("Cell selection is inactive, because preconditions are not met.");return}var o=e.target;var t=this.getConfig("getCellInfo",this.getControl(),o);if(t){this._bSelecting=true;if(this._oSession.mSource){if(this._oSession.mSource.rowIndex!==t.rowIndex||this._oSession.mSource.colIndex!==t.colIndex){this._oSession.mSource=null;this._oSession.mTarget=null}}this._oSession.mSource=t;this._oSession.mStart=t;this._selectCells(this._oSession.mSource,t,{info:{focus:t}});e.preventDefault();e.setMarked()}};l.prototype.onsapnext=l.prototype.onsapprevious=function(e){if(!this._bSelecting){return}this.clearSelection()};l.prototype.onsaphome=l.prototype.onsapend=l.prototype.onsapnext;l.prototype.onsapnextmodifiers=function(e){this._selectNextCell(e,false,1)};l.prototype.onsappreviousmodifiers=function(e){this._selectNextCell(e,true.valueOf,-1)};l.prototype._selectNextCell=function(e,t,n){if(!this._bSelecting||!e.shiftKey||e.isMarked()||!this._isInSelectionArea(e.target)){return}var s=this.getConfig("getCellInfo",this.getControl(),e.target);var r=Object.assign({},this._oSession.mSource);var l=Object.assign({},this._oSession.mTarget);var a=t?o.ARROW_UP:o.ARROW_DOWN,h=t?i.PREVIOUS:i.NEXT;var d=e.keyCode==a?"row":"col";l[d+"Index"]+=n;s[d+"Index"]+=n;if(!this.getConfig("isNavigatableCell",this.getControl(),l)){return}this._selectCells(r,l,{info:{focus:s,direction:h}});e.preventDefault();e.setMarked()};l.prototype.onsapspacemodifiers=function(e){if(!this._bSelecting||e.isMarked()){return}var o=Object.assign({},this._oSession.mTarget);var t=this.getConfig("getCellInfo",this.getControl(),e.target);if(e.shiftKey){this._oSession.mSource.colIndex=-Infinity;o.colIndex=Infinity;this._selectCells(this._oSession.mSource,o,{info:{focus:t,boundaryChange:true}})}else if(e.ctrlKey||e.metaKey){this._oSession.mSource.rowIndex=-Infinity;o.rowIndex=Infinity;this._selectCells(this._oSession.mSource,o,{info:{focus:t,boundaryChange:true}})}e.preventDefault();e.setMarked()};l.prototype.onsaphomemodifiers=function(e){if(!this._bSelecting||e.isMarked()||!e.shiftKey||!this._isInSelectionArea(e.target)){return}var o=Object.assign({},this._oSession.mTarget);o.colIndex=-Infinity;this._selectCells(this._oSession.mSource,o,{info:{focus:o,boundaryChange:true}});e.setMarked()};l.prototype.onsapendmodifiers=function(e){if(!this._bSelecting||e.isMarked()||!e.shiftKey||!this._isInSelectionArea(e.target)){return}var o=Object.assign({},this._oSession.mTarget);o.colIndex=Infinity;this._selectCells(this._oSession.mSource,o,{info:{focus:o,boundaryChange:true}});e.setMarked()};l.prototype.onkeydown=function(e){if(this._bSelecting){if(h(e,o.A,true,true)){this.clearSelection()}e.preventDefault();e.setMarked()}};l.prototype.onkeyup=function(e){if(!this._bSelecting){return}e.setMarked()};l.prototype.ontouchstart=function(e){var o=this._getSelectableCell(e.target);if(e.isMarked()||!o){return}else if(!this.getConfig("isSelectionEnabled",this.getControl())){n.error("Cell selection is inactive, because preconditions are not met.");return}var t=this.getConfig("getCellInfo",this.getControl(),o);if(t){this._bSelecting=true;this._bMouseDown=true;this._bByEdge=false;if(this._oSession.mSource){if(this._oSession.mSource.rowIndex!==t.rowIndex||this._oSession.mSource.colIndex!==t.colIndex){this._oSession.mSource=null;this._oSession.mTarget=null}}this._oSession.mSource=t;this._oSession.mStart=t;this._selectCells(this._oSession.mSource,t,{info:{focus:t}});e.preventDefault()}e.setMarked()};l.prototype.ontouchmove=function(e){if(!this._bMouseDown||!this._bSelecting){return}var o=this._getMousePosition(this.getConfig("scrollContainer"),e.clientX,e.clientY);if(o.x==s.IN&&o.y==s.IN){this._bScrollSelecting=false}var t=this._getSelectableCell(e.target);if(!t){return}var n=this.getConfig("getCellInfo",this.getControl(),t);if(n){if(n.rowIndex==this._oSession.mTarget.rowIndex&&n.colIndex==this._oSession.mTarget.colIndex){return}var i=a(this._oSession.mSource,this._oSession.mTarget);if(this._oEdgeInfo&&this._oEdgeInfo.isActive&&this._oEdgeInfo.moveStart){this._oEdgeInfo.moveStart=false;if(this._oEdgeInfo.edgePosition==="NE"){this._oSession.mStart.rowIndex=i.to.rowIndex;this._oSession.mStart.colIndex=i.from.colIndex}else if(this._oEdgeInfo.edgePosition==="SE"){this._oSession.mStart=i.from}else if(this._oEdgeInfo.edgePosition==="SW"){this._oSession.mStart.rowIndex=i.from.rowIndex;this._oSession.mStart.colIndex=i.to.colIndex}else if(this._oEdgeInfo.edgePosition==="NW"){this._oSession.mStart=i.to}}else if(this._oBorderMoveInfo&&this._oBorderMoveInfo.isActive){var r=this._oBorderMoveInfo.direction,l=this._oBorderMoveInfo.moveStart;if(r==="N"){this._oSession.mStart=l?i.to:this._oSession.mStart;n.colIndex=i.from.colIndex}else if(r==="E"){this._oSession.mStart=l?i.from:this._oSession.mStart;n.rowIndex=i.to.rowIndex}else if(r==="S"){this._oSession.mStart=l?i.from:this._oSession.mStart;n.colIndex=i.to.colIndex}else if(r==="W"){this._oSession.mStart=l?i.to:this._oSession.mStart;n.rowIndex=i.from.rowIndex}this._oBorderMoveInfo.moveStart=false}var h=this._oSession.mStart,d=n;this._selectCells(h,d,{info:{focus:n}})}};l.prototype._onMouseLeave=function(e){if(this._bMouseDown&&this._bSelecting){this._bScrollSelecting=true;var o=this._getMousePosition(this.getConfig("scrollContainer"),e.clientX,e.clientY);this._onScrollSelect(o)}};l.prototype._onScrollSelect=function(e){return new Promise(function(o,t){if(!this._bScrollSelecting){o();return}setTimeout(function(){if(!this.getControl()){o();return}var t=this.getControl().getDomRef(this.getConfig("container"));if(e.x===s.LEFT){if(this._oSession.mSource.colIndex<this._oSession.mTarget.colIndex&&this._oSession.mSource.colIndex>0){this._oSession.mSource.colIndex--}else if(this._oSession.mTarget.colIndex>0){this._oSession.mTarget.colIndex--}t.dispatchEvent(new WheelEvent("wheel",{deltaX:-1,deltaMode:window.WheelEvent.DOM_DELTA_LINE}));this._selectCells(this._oSession.mSource,this._oSession.mTarget)}else if(e.x===s.RIGHT){this._oSession.mTarget.colIndex++;t.dispatchEvent(new WheelEvent("wheel",{deltaX:1,deltaMode:window.WheelEvent.DOM_DELTA_LINE}));this._selectCells(this._oSession.mSource,this._oSession.mTarget)}if(e.y===s.ABOVE){if(this._oSession.mSource.rowIndex<this._oSession.mTarget.rowIndex&&this._oSession.mSource.rowIndex>0){this._oSession.mSource.rowIndex--}else if(this._oSession.mTarget.rowIndex>0){this._oSession.mTarget.rowIndex--}t.dispatchEvent(new WheelEvent("wheel",{deltaY:-1,deltaMode:window.WheelEvent.DOM_DELTA_LINE}))}else if(e.y===s.BELOW){this._oSession.mTarget.rowIndex++;t.dispatchEvent(new WheelEvent("wheel",{deltaY:1,deltaMode:window.WheelEvent.DOM_DELTA_LINE}))}o()}.bind(this),100)}.bind(this)).then(function(){if(!this._bScrollSelecting){return}this._onScrollSelect(e)}.bind(this))};l.prototype._onHandleMove=function(e,o){if(this._oBorderMoveInfo&&this._oBorderMoveInfo.isActive){return}this._bSelecting=true;this._bMouseDown=true;if(o){this._oBorderMoveInfo={isActive:true,direction:e,moveStart:true}}else{this._oEdgeInfo={isActive:true,moveStart:true,edgePosition:e}}};l.prototype._onmouseup=function(e){this._bMouseDown=false;this._oEdgeInfo=null;this._oBorderMoveInfo=null;this._bScrollSelecting=false};l.prototype._getSelectableCell=function(e){return e&&e.closest(this.getConfig("selectableCells"))};l.prototype._isInSelectionArea=function(e){var o=this.getConfig("getCellInfo",this.getControl(),e);var t=false;if(o){var n=a(this._oSession.mSource,this._oSession.mTarget);var i=this.getControl().getRows();t=!(o.rowIndex<n.from.rowIndex||o.rowIndex>n.to.rowIndex||o.colIndex<n.from.colIndex||o.colIndex>n.to.colIndex)||o.rowIndex==i[0].getIndex()||o.rowIndex==i[i.length-1].getIndex()}return t};l.prototype._selectCells=function(e,o,t){if(!this._bSelecting){return}this._oSession.aCells=[];this._savePreviousSelectionAreas();this._eraseSelection();if(!this._oSession.mTarget){this._oSession.mTarget=o}if(!e){this._oSession.mSource=e=o}if(!t){t={}}var n=a(e,o);var i=this.getConfig("selectCells",this.getControl(),n,t);var s=this._getDrawableBounds(n);if(!s.from||!s.to){return}var r=this._getBorderOptions(n,s);this._oSession.aCells=i.cells;this._drawSelection(s,r);if(!t.info||t.info&&!t.info.boundaryChange){this._oSession.mSource=e;this._oSession.mTarget=o}else{this._oSession.mSource=n.from;this._oSession.mTarget=n.to}};l.prototype._getDrawableBounds=function(e){var o={from:{},to:{}};var t=this.getConfig("getVisibleRange",this.getControl(),e);if(e.to.rowIndex<t.from.rowIndex||e.from.rowIndex>t.to.rowIndex){o={}}else{o.from.rowIndex=Math.max(e.from.rowIndex,t.from.rowIndex);o.from.colIndex=Math.max(e.from.colIndex,t.from.colIndex);o.to.rowIndex=Math.min(e.to.rowIndex,t.to.rowIndex);o.to.colIndex=Math.min(e.to.colIndex,t.to.colIndex)}return o};l.prototype._getBorderOptions=function(e,o){var t={top:true,bottom:true};if(o.from.rowIndex>e.from.rowIndex){t.top=false}if(o.to.rowIndex<e.to.rowIndex){t.bottom=false}return t};l.prototype._drawSelection=function(e,o){if(!e.from||!e.to){return}var t=this.getConfig("getSelectionAreas",this.getControl(),e.from,e.to);t.forEach(function(e,n){var i=this.getControl().getDomRef(e.container),s=this.getConfig("getCellRef",this.getControl(),e.from),r=this.getConfig("getCellRef",this.getControl(),e.to);var l,a,h;var d={};if(!s||!r){return}l=s.getBoundingClientRect();a=r.getBoundingClientRect();h=i.getBoundingClientRect();var c=e.hasOffset?h.left:0;d.left=Math.min(l.left,a.left)-c;d.top=Math.min(l.top,a.top)-h.top;d.width=Math.max(a.right,l.right)-d.left-c;d.height=Math.max(a.bottom,l.bottom)-d.top-h.top;d.noBorderTop=!o.top;d.noBorderBottom=!o.bottom;d.noBorderRight=t.length>1&&n<t.length-1?true:false;d.noBorderLeft=t.length>1&&n>0?true:false;this._drawSelectionArea(d,e.container);if(!this._oSession.oEdge[e.container]){this._oSession.oEdge[e.container]={}}this._drawEdgeHandle(d,e.container,"NE");this._drawEdgeHandle(d,e.container,"SE");this._drawEdgeHandle(d,e.container,"SW");this._drawEdgeHandle(d,e.container,"NW");if(!this._oSession.oBorderLine[e.container]){this._oSession.oBorderLine[e.container]={}}this._drawBorderLine(d,e.container,"N");this._drawBorderLine(d,e.container,"E");this._drawBorderLine(d,e.container,"S");this._drawBorderLine(d,e.container,"W")}.bind(this))};l.prototype._drawSelectionArea=function(e,o){if(!this._oSession.oCanvas[o]){this._oSession.oCanvas[o]=document.createElement("div");this._oSession.oCanvas[o].className=r+"Canvas"}if(!this._oSession.oCanvas[o].isConnected){this.getControl().getDomRef(o).append(this._oSession.oCanvas[o])}var t=this._oSession.oCanvas[o].style;t.left=e.left+"px";t.top=e.top+"px";t.width=e.width+"px";t.height=e.height+"px";t.display="block";t.borderTop=e.noBorderTop?"0px":"";t.borderBottom=e.noBorderBottom?"0px":"";t.borderRight=e.noBorderRight?"0px":"";t.borderLeft=e.noBorderLeft?"0px":""};l.prototype._drawEdgeHandle=function(e,o,t){if(!this._oSession.oEdge[o][t]){this._oSession.oEdge[o][t]={};this._oSession.oEdge[o][t].wrapper=document.createElement("div");this._oSession.oEdge[o][t].wrapper.className=r+"EdgeWrapper"}if(!this._oSession.oEdge[o][t].wrapper.isConnected){this._oSession.oCanvas[o].append(this._oSession.oEdge[o][t].wrapper);this._oSession.oEdge[o][t].wrapper.addEventListener("mousedown",this._onHandleMove.bind(this,t,false))}this._oSession.oEdge[o][t].wrapper.classList.add("sapMPluginsEdge"+t)};l.prototype._drawBorderLine=function(e,o,t){if(!this._oSession.oBorderLine[o][t]){this._oSession.oBorderLine[o][t]=document.createElement("div");this._oSession.oBorderLine[o][t].className=r+"BorderLine"}if(!this._oSession.oBorderLine[o][t].isConnected){this._oSession.oCanvas[o].append(this._oSession.oBorderLine[o][t]);this._oSession.oBorderLine[o][t].addEventListener("mousedown",this._onHandleMove.bind(this,t,true))}var n=this._oSession.oBorderLine[o][t].style;this._oSession.oBorderLine[o][t].classList.add("sapMPluginsBorder"+t);if(t==="N"||t==="S"){n.width=e.width+"px"}else{n.height=e.height+"px"}n.display="block"};l.prototype.clearSelection=function(){this._bSelecting=false;this._eraseSelection();this._oSession.mSource=null;this._oSession.mTarget=null};l.prototype._eraseSelection=function(){Object.values(this._oSession.oCanvas).forEach(function(e){e.style=""});Object.values(this._oSession.oBorderLine).forEach(function(e){Object.values(e).forEach(function(e){e.style=""})});Object.values(this._oSession.oEdge).forEach(function(e){Object.values(e).forEach(function(e){Object.values(e).forEach(function(e){e.style=""})})})};l.prototype._handleScroll=function(e){if(!this._bSelecting){return}this._selectCells(this._oSession.mSource,this._oSession.mTarget)};l.prototype._savePreviousSelectionAreas=function(){Object.entries(this._oSession.oCanvas).forEach(function(e){var o=e[0],t=e[1];if(t.style.left&&t.style.top&&t.style.width&&t.style.height){if(!this._oSession.previousSelection){this._oSession.previousSelection={}}this._oSession.previousSelection[o]={top:parseFloat(t.style.top),left:parseFloat(t.style.left),width:parseFloat(t.style.width),height:parseFloat(t.style.height)}}}.bind(this))};l.prototype._getMousePosition=function(e,o,t){var n=this.getControl().getDomRef(e);var i={x:s.IN,y:s.IN};if(n){var r=n.getBoundingClientRect();if(t>r.bottom){i.y=s.BELOW}else if(t<r.top){i.y=s.ABOVE}if(o>r.right){i.x=s.RIGHT}else if(o<r.left){i.x=s.LEFT}}return i};function a(e,o){return{from:{rowIndex:Math.min(e.rowIndex,o.rowIndex),colIndex:Math.min(e.colIndex,o.colIndex)},to:{rowIndex:Math.max(e.rowIndex,o.rowIndex),colIndex:Math.max(e.colIndex,o.colIndex)}}}function h(e,o,t,n){return e.keyCode==o&&e.shiftKey==t&&(e.ctrlKey==n||e.metaKey==n)}e.setConfigs({"sap.ui.table.Table":{container:"tableCCnt",scrollContainer:"sapUiTableCtrlScr",selectableCells:".sapUiTableDataCell",scrollEvent:"firstVisibleRowChanged",onActivate:function(e,o){var t="rowSelectionChange";var n=e;e.getPlugins().forEach(function(e){if(e.isA("sap.ui.table.plugins.SelectionPlugin")){t="selectionChange";n=e}});n.attachEvent(t,o.clearSelection,o)},onDeactivate:function(e,o){var t="rowSelectionChange";var n=e;e.getPlugins().forEach(function(e){if(e.isA("sap.ui.table.plugins.SelectionPlugin")){t="selectionChange";n=e;return}});n.detachEvent(t,o.clearSelection,o)},isSelectionEnabled:function(e){return!(e.getSelectionBehavior()!=="RowSelector"||e.getSelectionMode()=="None")},getCellRef:function(e,o){var t=this._getRowByIndex(e,o.rowIndex);if(t){var n=this._getColumns(e)[o.colIndex];var i=n&&t.getCells()[o.colIndex];if(i){return i.$().closest(this.selectableCells)[0]}}},getCellInfo:function(e,o){return{rowIndex:this.rowIndex(null,o),colIndex:this.colIndex(e,o)}},getVisibleRange:function(e){var o=e.getRows();return{from:{rowIndex:o[0].getIndex(),colIndex:0},to:{rowIndex:o[o.length-1].getIndex(),colIndex:this._getColumns(e).length-1}}},getSelectionAreas:function(e,o,t){var n=[],i=e.getFixedColumnCount();if(i>0&&(o.colIndex<i||o.colIndex===-Infinity)){var s=t.colIndex===Infinity?i-1:Math.min(t.colIndex,i-1);var r={rowIndex:o.rowIndex,colIndex:o.colIndex},l={rowIndex:t.rowIndex,colIndex:s};n.push({container:"sapUiTableCtrlScrFixed",from:r,to:l})}if(t.colIndex>=i||t.colIndex===Infinity){n.push({container:"tableCtrlCnt",from:o,to:t,hasOffset:true})}return n},selectCells:function(e,o,t){var n={},i={top:true,bottom:true};var s=e.getBinding("rows").getLength();n.from=Object.assign({},o.from);n.to=Object.assign({},o.to);n.from.rowIndex=Math.max(n.from.rowIndex,0);n.from.colIndex=Math.max(n.from.colIndex,0);n.to.rowIndex=Math.min(n.to.rowIndex,s);n.to.colIndex=Math.min(n.to.colIndex,this._getColumns(e).length-1);var r=[];if(t&&t.info){t.info.focus.rowIndex=Math.min(Math.max(t.info.focus.rowIndex,0),s);t.info.focus.colIndex=Math.min(Math.max(t.info.focus.colIndex,0),this._getColumns(e).length-1);this._focusCell(e,t.info.focus,t.info.direction)}if(n.from.colIndex===0&&n.to.colIndex===this._getColumns(e).length-1&&e.getSelectionMode()=="Single"){n.from.rowIndex=o.from.rowIndex=t.info.focus.rowIndex;n.to.rowIndex=o.to.rowIndex=t.info.focus.rowIndex}for(var l=n.from.rowIndex;l<=n.to.rowIndex;l++){var a=this._getRowByIndex(e,l);if(a){for(var h=n.from.colIndex;h<=n.to.colIndex;h++){r.push([l,h])}}}return{borderOptions:i,cells:r}},rowIndex:function(e,o){return jQuery(o).control(0,true).getIndex()},colIndex:function(e,o){return this._getColumns(e).indexOf(t.byId(o.getAttribute("data-sap-ui-colid")))},contextByIndex:function(e,o){return e.getContextByIndex(o)},columnByIndex:function(e,o){var t=this._getColumns(e)[o];if(!t.getVisible()){return}return t},isNavigatableCell:function(e,o){if((o.rowIndex<0||o.rowIndex>=e.getBinding("rows").getLength()||o.colIndex<0||o.colIndex>=this._getColumns(e).length)&&!(o.rowIndex==-Infinity||o.rowIndex==Infinity||o.colIndex==-Infinity||o.colIndex==Infinity)){return false}return true},_scrollRow:function(e,o,t){var n=e.getFirstVisibleRow();if(t>=0&&t<e.getBinding("rows").getLength()){if(e.getFixedRowCount()>0&&t==e.getFixedRowCount()){e.setFirstVisibleRow(0)}else{o==i.NEXT?n++:n--;n=n<0?0:n;e.setFirstVisibleRow(n)}}},_focusCell:function(e,o,t){var n=this.getCellRef(e,o);if(!n){this._scrollRow(e,t,o.rowIndex);n=this.getCellRef(e,o);if(!n){e.setFirstVisibleRow(o.rowIndex);n=this.getCellRef(e,o)}}n&&n.focus()},_getColumns:function(e){return e.getColumns().filter(function(e){return e.getDomRef()})},_getRowByIndex:function(e,o){var t=e.getRows();for(var n=0;n<t.length;n++){if(t[n].getIndex()==o){return t[n]}}}}},l);return l});
//# sourceMappingURL=CellSelector.js.map