/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/EnabledPropagator","sap/ui/core/IconPool","sap/ui/core/theming/Parameters","sap/ui/events/KeyCodes","./SwitchRenderer","sap/base/assert","sap/ui/core/Configuration"],function(t,e,i,s,o,n,a,r,p){"use strict";var u=t.touch;var h=t.SwitchType;var c=e.extend("sap.m.Switch",{metadata:{interfaces:["sap.ui.core.IFormContent","sap.m.IOverflowToolbarContent"],library:"sap.m",properties:{state:{type:"boolean",group:"Misc",defaultValue:false},customTextOn:{type:"string",group:"Misc",defaultValue:""},customTextOff:{type:"string",group:"Misc",defaultValue:""},enabled:{type:"boolean",group:"Data",defaultValue:true},name:{type:"string",group:"Misc",defaultValue:""},type:{type:"sap.m.SwitchType",group:"Appearance",defaultValue:h.Default}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{change:{parameters:{state:{type:"boolean"}}}},designtime:"sap/m/designtime/Switch.designtime"},renderer:a});s.insertFontFaceStyle();i.apply(c.prototype,[true]);c.prototype._slide=function(t){if(t>c._OFFPOSITION){t=c._OFFPOSITION}else if(t<c._ONPOSITION){t=c._ONPOSITION}if(t>this._iNoLabelFix){t=this._iNoLabelFix}if(this._iCurrentPosition===t){return}this._iCurrentPosition=t;this.getDomRef("inner").style[p.getRTL()?"right":"left"]=t+"px";this._setTempState(Math.abs(t)<c._SWAPPOINT)};c.prototype._resetSlide=function(){this.getDomRef("inner").style.cssText=""};c.prototype._setTempState=function(t){if(this._bTempState===t){return}this._bTempState=t;this.getDomRef("handle").setAttribute("data-sap-ui-swt",t?this._sOn:this._sOff)};c.prototype._getInvisibleElement=function(){return this.$("invisible")};c.prototype.getInvisibleElementId=function(){return this.getId()+"-invisible"};c.prototype.getInvisibleElementText=function(t){var e=sap.ui.getCore().getLibraryResourceBundle("sap.m");var i="";switch(this.getType()){case h.Default:if(t){i=this.getCustomTextOn().trim()||e.getText("SWITCH_ON")}else{i=this.getCustomTextOff().trim()||e.getText("SWITCH_OFF")}break;case h.AcceptReject:if(t){i=e.getText("SWITCH_ARIA_ACCEPT")}else{i=e.getText("SWITCH_ARIA_REJECT")}break}return i};var _=Object.assign({_sap_m_Switch_OnPosition:-32,_sap_m_Switch_OffPosition:0},o.get({name:["_sap_m_Switch_OnPosition","_sap_m_Switch_OffPosition"],callback:function(t){c._ONPOSITION=Number(t["_sap_m_Switch_OnPosition"]);c._OFFPOSITION=Number(t["_sap_m_Switch_OffPosition"]);c._SWAPPOINT=Math.abs((c._ONPOSITION-c._OFFPOSITION)/2)}}));c._ONPOSITION=Number(_["_sap_m_Switch_OnPosition"]);c._OFFPOSITION=Number(_["_sap_m_Switch_OffPosition"]);c._SWAPPOINT=Math.abs((c._ONPOSITION-c._OFFPOSITION)/2);c.prototype.onBeforeRendering=function(){var t=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._sOn=this.getCustomTextOn()||t.getText("SWITCH_ON");this._sOff=this.getCustomTextOff()||t.getText("SWITCH_OFF")};c.prototype.ontouchstart=function(t){var e=t.targetTouches[0],i=this.getRenderer().CSS_CLASS,s=this.$("inner");t.setMarked();if(u.countContained(t.touches,this.getId())>1||!this.getEnabled()||t.button){return}this._iActiveTouchId=e.identifier;this._bTempState=this.getState();this._iStartPressPosX=e.pageX;this._iPosition=s.position().left;this._bDragging=false;setTimeout(this["focus"].bind(this),0);this.$("switch").addClass(i+"Pressed");this._iNoLabelFix=parseInt(getComputedStyle(this.getDomRef("switch")).outlineOffset)};c.prototype.ontouchmove=function(t){t.setMarked();t.preventDefault();var e,i,s=u;if(!this.getEnabled()||t.button){return}r(s.find(t.touches,this._iActiveTouchId),"missing touchend");e=s.find(t.changedTouches,this._iActiveTouchId);if(!e||Math.abs(e.pageX-this._iStartPressPosX)<6){return}this._bDragging=true;i=(this._iStartPressPosX-e.pageX)*-1+this._iPosition;if(p.getRTL()){i=-i}this._slide(i)};c.prototype.ontouchend=function(t){t.setMarked();var e,i=u;if(!this.getEnabled()||t.button){return}r(this._iActiveTouchId!==undefined,"expect to already be touching");e=i.find(t.changedTouches,this._iActiveTouchId);if(e){r(!i.find(t.touches,this._iActiveTouchId),"touchend still active");if(!this._updateStateAndNotify()){this.$("switch").removeClass(this.getRenderer().CSS_CLASS+"Pressed");this._resetSlide()}}};c.prototype.ontouchcancel=c.prototype.ontouchend;c.prototype._handleSpaceOrEnter=function(t){if(this.getEnabled()){t.setMarked();if(!this._bDragging){this._updateStateAndNotify()}}};c.prototype.onsapspace=function(t){t.preventDefault()};c.prototype.onkeyup=function(t){if(t.which===n.SPACE){this._handleSpaceOrEnter(t)}};c.prototype.onsapenter=c.prototype._handleSpaceOrEnter;c.prototype._updateStateAndNotify=function(){var t=this.getState(),e;this.setState(this._bDragging?this._bTempState:!t);e=t!==this.getState();if(e){this.fireChange({state:this.getState()})}this._bDragging=false;return e};c.prototype.getAccessibilityInfo=function(){var t=sap.ui.getCore().getLibraryResourceBundle("sap.m"),e=this.getState(),i=this.getInvisibleElementText(e);return{role:"switch",type:t.getText("ACC_CTR_TYPE_SWITCH"),description:i,focusable:this.getEnabled(),enabled:this.getEnabled()}};c.prototype.getOverflowToolbarConfig=function(){return{propsUnrelatedToSize:["enabled","state"]}};return c});
//# sourceMappingURL=Switch.js.map