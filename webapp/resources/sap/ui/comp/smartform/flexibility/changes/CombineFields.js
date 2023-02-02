/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/comp/smartform/flexibility/changes/RenameField"],function(e){"use strict";var n={};function t(e,n,t){return Promise.all(n.map(function(n){if(!t.found){t.index++;return e.getProperty(n,"mandatory").then(function(e){t.found=t.found||e})}return undefined}))}function r(e,n){var r={found:false,index:-1};return n.reduce(function(n,o){return n.then(e.getAggregation.bind(e,o,"fields")).then(function(n){if(!r.found){return t(e,n,r)}return undefined})},Promise.resolve()).then(function(){return r.found?r.index:-1})}n._getPreviousLabelPropertyOnControl=function(e,n,t){return Promise.resolve().then(n.getProperty.bind(n,e,t)).then(function(r){if(r&&typeof r!=="string"){t="text";e=r}return n.getPropertyBindingOrProperty(e,t)}).then(function(e){return e?e:"$$Handled_Internally$$"})};function o(e){return!!e.newElementId}function i(e,n,t){var r=e.modifier;var i=e.appComponent;var l=e.view;if(o(n)){return r.getAggregation(t,"dependents").then(function(o){var u=o.find(function(e){return r.bySelector(n.newElementId,i,l)});if(u){return r.removeAggregation(t,"dependents",u).then(function(){return u})}return r.createControl("sap.ui.comp.smartform.GroupElement",e.appComponent,e.view,n.newElementId)})}return Promise.resolve(r.bySelector(n.sourceSelector,i,l))}function l(e,n,t,r){return r.getAggregation(e,"groupElements").then(function(e){var r=e.indexOf(n);return t.reduce(function(n,t){var o=e.indexOf(t);if(o>-1&&o<r){n=n-1}return n},r)})}function u(e,n,t,r,o,i,l){if(o.newElementId||e!==n){var u=t.getParent(e);return l.reduce(function(o,l,u){return o.then(t.removeAggregation.bind(t,e,"elements",l)).then(t.insertAggregation.bind(t,n,"elements",l,i+u,r))},Promise.resolve()).then(t.removeAggregation.bind(t,u,"groupElements",e)).then(t.insertAggregation.bind(t,u,"dependents",e,0,r)).then(function(){return i+(l.length||0)})}return Promise.resolve(0)}n.applyChange=function(n,t,a){var g=n.getContent();var s=a.modifier;var c=a.appComponent;var d=a.view;var f=s.bySelector(g.sourceSelector,c,d);var m=s.getParent(f);var v=[];var p;var h;var b;var S;var C=g.combineFieldSelectors.map(function(e){return s.bySelector(e,c,d)});return i(a,g,m).then(function(e){if(e){return l(m,f,C,s).then(function(n){if(n>-1){S=n;f=e}}).then(this._collectRevertDataForElements.bind(this,s,C,c,e,m))}return this._collectRevertDataForElements(s,C,c)}.bind(this)).then(function(e){b=e}).then(function(){return r(s,C).then(function(e){if(e>0){s.setProperty(f,"elementForLabel",e)}})}).then(function(){var e=sap.ui.getCore().getConfiguration().getRTL();var t=0;return C.reduce(function(r,o,i){return r.then(function(r){t=t+r;var l="fieldLabel"+i.toString();h=n.getText(l);if(h&&h!==p){if(e){v.unshift(h)}else{v.push(h)}p=h}return s.getAggregation(o,"elements")}).then(function(e){return u(o,f,s,d,g,t,e)})},Promise.resolve(0))}).then(function(){return e.setLabelPropertyOnControl(f,v.join("/"),s,"label")}).then(function(){if(o(g)){return s.insertAggregation(m,"groupElements",f,S,d)}return undefined}).then(function(){n.setRevertData(b)})};n._collectRevertDataForElements=function(e,n,t,r,o){var i={elementStates:[]};var l=0;var u=0;var a=[];if(r){a.push(r);a=a.concat(n)}return Promise.all(a.map(function(n){var r=e.getParent(n)||o;return Promise.all([e.getAggregation(n,"elements"),e.getAggregation(r,"groupElements"),this._getPreviousLabelPropertyOnControl(n,e,"label"),e.getProperty(n,"elementForLabel")]).then(function(o){u=l+o[0].length-1;i.elementStates.push({groupElementSelector:e.getSelector(e.getId(n),t),parentSelector:e.getSelector(e.getId(r),t),groupElementIndex:o[1].indexOf(n),firstFieldIndex:l,lastFieldIndex:u,label:o[2],elementForLabel:o[3]});l=u+1})}.bind(this))).then(function(){return i})};n.revertChange=function(n,t,r){var i=n.getRevertData();var l=r.modifier;var u=r.appComponent;var a=[];i.elementStates=i.elementStates.sort(function(e,n){return e.groupElementIndex-n.groupElementIndex});return i.elementStates.reduce(function(e,t){var r=l.bySelector(t.parentSelector,u);var i=l.bySelector(t.groupElementSelector,u);return e.then(l.getAggregation.bind(l,r,"groupElements")).then(function(e){if(e.indexOf(i)===-1){return Promise.resolve().then(l.removeAggregation.bind(l,r,"dependents",i)).then(l.insertAggregation.bind(l,r,"groupElements",i,t.groupElementIndex))}else{return Promise.resolve().then(l.getAggregation.bind(l,i,"elements")).then(function(e){a=e;return l.removeAllAggregation(i,"elements")}).then(function(){if(o(n.getContent())){return l.removeAggregation(r,"groupElements",i).then(l.insertAggregation.bind(l,r,"dependents",i))}return undefined})}})},Promise.resolve()).then(function(){return i.elementStates.reduce(function(n,t){var r;var o;return n.then(function(){r=l.bySelector(t.groupElementSelector,u);var e=[];for(var n=t.firstFieldIndex;n<=t.lastFieldIndex;n++){e.push(l.insertAggregation(r,"elements",a[n],a.length))}return Promise.all(e)}).then(function(){o=t.label;if(o==="$$Handled_Internally$$"){o=undefined;return l.getAggregation(r,"fields")}return undefined}).then(function(n){if(n&&n.length){var i=n[t.elementForLabel];l.setProperty(i,"textLabel",undefined)}l.setProperty(r,"elementForLabel",t.elementForLabel);return e.setLabelPropertyOnControl(r,o,l,"label")})},Promise.resolve())}).then(n.resetRevertData.bind(n))};n.completeChangeContent=function(e,n,t){var r=t.modifier;var o=t.view;var i=t.appComponent;var l={};if(n.newElementId){l.newElementId=n.newElementId}var u=n.combineElementIds;if(u&&u.length>=2){l.combineFieldSelectors=u.map(function(e){return r.getSelector(e,i)});e.addDependentControl(u,"combinedFields",t)}else{throw new Error("oSpecificChangeInfo.combineElementIds attribute required")}if(n.sourceControlId){l.sourceSelector=r.getSelector(n.sourceControlId,i);e.addDependentControl(n.sourceControlId,"sourceControl",t)}else{throw new Error("oSpecificChangeInfo.sourceControlId attribute required")}var a;var g;var s;for(var c=0;c<l.combineFieldSelectors.length;c++){var d=l.combineFieldSelectors[c];s=r.bySelector(d,i,o);a=s.getLabelText();if(a){g="fieldLabel"+c;e.setText(g,a,"XFLD")}}e.setContent(l)};n.getChangeVisualizationInfo=function(e){var n=e.getContent();return{displayControls:[n.newElementId],affectedControls:[n.sourceSelector],descriptionPayload:{originalSelectors:n.combineFieldSelectors}}};return n},true);
//# sourceMappingURL=CombineFields.js.map