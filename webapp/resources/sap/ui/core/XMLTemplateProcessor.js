/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/DataType","sap/ui/base/BindingInfo","sap/ui/core/CustomData","sap/ui/core/Component","./mvc/View","./mvc/ViewType","./mvc/XMLProcessingMode","./mvc/EventHandlerResolver","./ExtensionPoint","./StashedControlSupport","sap/ui/base/SyncPromise","sap/base/Log","sap/base/util/ObjectPath","sap/base/assert","sap/base/util/LoaderExtensions","sap/base/util/JSTokenizer","sap/base/util/each","sap/base/util/isEmptyObject","sap/ui/core/Configuration"],function(e,n,t,r,i,a,o,s,u,l,c,f,d,p,g,m,v,h,w){"use strict";function b(t,r,i,a,o){var s=n.parse(r,a,true,false,false,false,o);if(s&&typeof s==="object"){return s}var u=r=typeof s==="string"?s:r;var l=e.getType(t);if(l){if(l instanceof e){u=l.parseValue(r,{context:a,locals:o});if(!l.isValid(u)){f.error("Value '"+r+"' is not valid for type '"+l.getName()+"'.")}}}else{throw new Error("Property "+i+" has unknown type "+t)}return typeof u==="string"?n.escape(u):u}function y(e){return e.localName||e.nodeName}var C="http://www.w3.org/1999/xhtml";var A="http://www.w3.org/2000/xmlns/";var _="http://www.w3.org/2000/svg";var N="sap.ui.core";var M="sap.ui.core.mvc";var x="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1";var V="http://schemas.sap.com/sapui5/extension/sap.ui.core.support.Support.info/1";var I="http://schemas.sap.com/sapui5/extension/sap.ui.core.xmlcomposite/1";var E="http://schemas.sap.com/sapui5/extension/sap.ui.core.Internal/1";var S="http://schemas.sap.com/sapui5/preprocessorextension/";var P=["controllerName","resourceBundleName","resourceBundleUrl","resourceBundleLocale","resourceBundleAlias"];var R=/^(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/;function T(e,n){function t(e,t){var r,i=[];for(var a=0;a<e.childNodes.length;a++){r=n(e,e.childNodes[a],t);if(r){i.push(r.unwrap())}}return c.resolve(i)}function r(e,t){var r=Promise.resolve(),i=[t.chain];for(var a=0;a<e.childNodes.length;a++){r=r.then(n.bind(null,e,e.childNodes[a],t));i.push(r)}return Promise.all(i)}return e?r:t}var L={};L.loadTemplate=function(e,n){var t=e.replace(/\./g,"/")+("."+(n||"view")+".xml");return g.loadResource(t).documentElement};L.loadTemplatePromise=function(e,n){var t=e.replace(/\./g,"/")+("."+(n||"view")+".xml");return g.loadResource(t,{async:true}).then(function(e){return e.documentElement})};L.parseViewAttributes=function(e,n){var t,r;for(t=0;t<e.attributes.length;t++){r=e.attributes[t];if(P.includes(r.name)){n["_"+r.name]=r.value}}};L.enrichTemplateIds=function(e,n){L.enrichTemplateIdsPromise(e,n,false);return e};L.enrichTemplateIdsPromise=function(e,n,t){return q(e,n,true,t).then(function(){return e})};L.parseTemplate=function(e,n,t){return L.parseTemplatePromise(e,n,false,{settings:t}).unwrap()};L.parseTemplatePromise=function(e,n,t,r){return q(e,n,false,t,r).then(function(e){if(n.isA("sap.ui.core.mvc.View")){var t,r;for(r=e.length-1;r>=0;r--){t=e[r];if(t&&t._isExtensionPoint){var i=[r,1].concat(t._aControls);Array.prototype.splice.apply(e,i)}}}return e})};function O(e){var n,t=/^[a-zA-Z_$][a-zA-Z0-9_$]*$/;if(!e||typeof e!=="object"){n="core:require in XMLView can't be parsed to a valid object"}else{Object.keys(e).some(function(r){if(!t.test(r)){n="core:require in XMLView contains invalid identifier: '"+r+"'";return true}if(!e[r]||typeof e[r]!=="string"){n="core:require in XMLView contains invalid value '"+e[r]+"'under key '"+r+"'";return true}})}return n}function X(e,n){var t=e.getAttributeNS(N,"require"),r,i,a;if(t){try{r=m.parseJS(t)}catch(n){f.error("Require attribute can't be parsed on Node: ",e.nodeName);throw n}a=O(r);if(a){throw new Error(a+" on Node: "+e.nodeName)}if(!h(r)){i={};if(n){return new Promise(function(e,n){var t=Object.keys(r).reduce(function(e,n){i[n]=sap.ui.require(r[n]);return e&&i[n]!==undefined},true);if(t){e(i);return}sap.ui.require(Object.values(r),function(){var n=arguments;Object.keys(r).forEach(function(e,t){i[e]=n[t]});e(i)},n)})}else{Object.keys(r).forEach(function(e){i[e]=sap.ui.requireSync(r[e])});return c.resolve(i)}}}}function B(e,n,t){var r=c.resolve();if(!h(t)){var i=[];var a;if(e){r=new Promise(function(e){a=e})}Object.keys(t).forEach(function(e){var r=t[e];r.forEach(function(e){e.targetControl=n;var t=sap.ui.require(e.providerClass);if(t){i.push(t.applyExtensionPoint(e))}else{var r=new Promise(function(n,t){sap.ui.require([e.providerClass],function(e){n(e)},t)}).then(function(n){return n.applyExtensionPoint(e)});i.push(r)}})});if(e){Promise.all(i).then(a)}}return r}function j(e,n,t){var r=t;for(var i=0;i<100;i++){var a=e.lookupNamespaceURI(r);if(a==null||a===n){return r}r=t+i}throw new Error("Could not find an unused namespace prefix after 100 tries, giving up")}function q(e,g,m,O,q){var U=[],k=j(e,E,"__ui5"),F=X(e,O)||c.resolve(),W={openStart:function(e,n){U.push(["openStart",[e,n]])},voidStart:function(e,n){U.push(["voidStart",[e,n]])},style:function(e,n){U.push(["style",[e,n]])},class:function(e){U.push(["class",[e]])},attr:function(e,n){U.push(["attr",[e,n]])},openEnd:function(){U.push(["openEnd"])},voidEnd:function(){U.push(["voidEnd"])},text:function(e){U.push(["text",[e]])},unsafeHtml:function(e){U.push(["unsafeHtml",[e]])},close:function(e){U.push(["close",[e]])},renderControl:function(e){U.push(e)}};O=O&&!!g._sProcessingMode;f.debug("XML processing mode is "+(g._sProcessingMode||"default")+".","","XMLTemplateProcessor");f.debug("XML will be processed "+(O?"asynchronously":"synchronously")+".","","XMLTemplateProcessor");var H=w.getDesignMode();if(H){g._sapui_declarativeSourceInfo={xmlNode:e,xmlRootNode:g._oContainingView===g?e:g._oContainingView._sapui_declarativeSourceInfo.xmlRootNode}}if(!g.isSubView()){e.setAttributeNS(A,"xmlns:"+k,E)}var D=Y(e,F);var K=0;function z(){for(;K<U.length;K++){var e=U[K];if(e&&typeof e.then==="function"){return e.then($).then(z)}}return U}function $(e){var n=[K,1].concat(e);Array.prototype.splice.apply(U,n)}return F.then(z).then(function(n){if(D){var t=e.parentNode;t.removeChild(e);if(t.parentNode){t.parentNode.replaceChild(e,t)}}return n});function J(e){return e}function Z(e){return g._oContainingView.createId(e)}function G(e,n){var t=g.getMetadata().isA("sap.ui.core.mvc.View")?"View":"Fragment";var r=e.outerHTML?e.cloneNode(false).outerHTML:e.textContent;return"Error found in "+t+" (id: '"+g.getId()+"').\nXML node: '"+r+"':\n"+n}function Q(e){var n=y(e),t;if(g.isA("sap.ui.core.mvc.XMLView")&&(e.namespaceURI===C||e.namespaceURI===_)){t=e.ownerDocument.createElementNS(M,"View")}else if(g.isA("sap.ui.core.Fragment")&&(n!=="FragmentDefinition"||e.namespaceURI!==N)){t=e.ownerDocument.createElementNS(N,"FragmentDefinition")}if(t){var r=e.parentNode;if(r){r.replaceChild(t,e)}t.appendChild(e)}return t}function Y(e,n){var t=false,r=g.sViewName||g._sFragmentName,i,a;if(!r){var o=g;var s=0;while(++s<1e3&&o&&o!==o._oContainingView){o=o._oContainingView}r=o.sViewName}i=Q(e);if(i){e=i;t=true}a=y(e);if(g.isA("sap.ui.core.mvc.XMLView")){if(a!=="View"&&a!=="XMLView"||e.namespaceURI!==M){f.error("XMLView's root node must be 'View' or 'XMLView' and have the namespace 'sap.ui.core.mvc'"+(r?" (View name: "+r+")":""))}F=n.then(function(){return re(e,g.getMetadata().getClass(),n,null,{rootArea:true,rootNode:true})})}else{var u=T(O,function(e,n,t){if(n.nodeType===1){return ne(n,t.chain,null,undefined,{rootArea:true})}});F=n.then(function(){return u(e,{chain:n})})}return t}function ee(e,n){var t;var r=sap.ui.getCore().getLoadedLibraries();v(r,function(r,i){if(e===i.namespace||e===i.name){t=i.name+"."+(i.tagNames&&i.tagNames[n]||n)}});t=t||e+"."+n;function i(e){if(!e){f.error("Control '"+t+"' did not return a class definition from sap.ui.define.","","XMLTemplateProcessor");e=d.get(t)}if(!e){f.error("Can't find object class '"+t+"' for XML-view","","XMLTemplateProcessor")}return e}var a=t.replace(/\./g,"/");var o=sap.ui.require(a);if(!o){if(O){return new Promise(function(e,n){sap.ui.require([a],function(n){n=i(n);e(n)},n)})}else{o=sap.ui.requireSync(a);o=i(o)}}return o}function ne(e,n,t,r,i){var a=i&&i.rootArea,o=i&&i.rootNode&&g.isSubView(),s=y(e),u=a&&(g.isA("sap.ui.core.Fragment")||r&&r.name==="content"),l,d;if(e.nodeType===1){if(e.namespaceURI===C||e.namespaceURI===_){if(a){if(r&&r.name!=="content"){f.error(G(e,"XHTML nodes can only be added to the 'content' aggregation and not to the '"+r.name+"' aggregation."));return c.resolve([])}if(i&&i.contentBound){throw new Error(G(e,"No XHTML or SVG node is allowed because the 'content' aggregation is bound."))}var p=e.namespaceURI===C;var v=e.getAttribute("id");if(v!=null){v=ae(g,e)}else{v=o?g.getId():undefined}if(s==="style"){var h=e.attributes;var w=e.textContent;e=document.createElement(s);e.textContent=w;for(d=0;d<h.length;d++){var b=h[d];if(!b.prefix){e.setAttribute(b.name,b.value)}}if(v!=null){e.setAttribute("id",v)}if(o){e.setAttribute("data-sap-ui-preserve",g.getId())}W.unsafeHtml(e.outerHTML);return c.resolve([])}var A=R.test(s);if(A){W.voidStart(s,v)}else{W.openStart(s,v)}for(d=0;d<e.attributes.length;d++){var N=e.attributes[d];if(N.name!=="id"){W.attr(p?N.name.toLowerCase():N.name,N.value)}}if(o){W.attr("data-sap-ui-preserve",g.getId())}if(A){W.voidEnd();if(e.firstChild){f.error("Content of void HTML element '"+s+"' will be ignored")}}else{W.openEnd();var M=e instanceof HTMLTemplateElement?e.content:e;var x=T(O,function(e,n,t){return ne(n,t.chain,t.closestBinding,t.aggregation,t.config)});l=x(M,{chain:n,closestBinding:t,aggregation:r,config:{rootArea:a}});return l.then(function(e){W.close(s);return e.reduce(function(e,n){if(Array.isArray(n)){n.forEach(function(n){e.push(n)})}return e},[])})}}else{var V=e.attributes["id"]?e.attributes["id"].textContent||e.attributes["id"].text:null;if(m){return L.enrichTemplateIdsPromise(e,g,O).then(function(){return[]})}else{var I=function(n){var t={id:V?ae(g,e,V):undefined,xmlNode:e,containingView:g._oContainingView,processingMode:g._sProcessingMode};if(g.fnScopedRunWithOwner){return g.fnScopedRunWithOwner(function(){return new n(t)})}return new n(t)};return n.then(function(){if(O){return new Promise(function(e,n){sap.ui.require(["sap/ui/core/mvc/XMLView"],function(n){e([I(n)])},n)})}else{var e=sap.ui.requireSync("sap/ui/core/mvc/XMLView");return[I(e)]}})}}}else{l=te(e,n,t);if(u){W.renderControl(l)}return l}}else if(e.nodeType===3&&u){if(!i||!i.contentBound){W.text(e.textContent)}else if(e.textContent.trim()){throw new Error(G(e,"Text node isn't allowed because the 'content' aggregation is bound."))}}return c.resolve([])}function te(e,n,t){if(y(e)==="ExtensionPoint"&&e.namespaceURI===N){if(m){return c.resolve([])}else{var r=g instanceof i?g._oContainingView:g;var a=u._factory.bind(null,r,e.getAttribute("name"),function(){var r=c.resolve();var i=[];var a=e.childNodes;for(var o=0;o<a.length;o++){var s=a[o];if(s.nodeType===1){r=r.then(ne.bind(null,s,n,t));i.push(r)}}return c.all(i).then(function(e){var n=[];e.forEach(function(e){n=n.concat(e)});return n})},undefined,undefined,O);return c.resolve(g.fnScopedRunWithOwner?g.fnScopedRunWithOwner(a):a())}}else{var o=y(e);var s=o;var l=o.lastIndexOf(".");if(l>=0){s=o.substring(l+1,o.length)}if(/^[a-z].*/.test(s)){var d=g.sViewName||g._sFragmentName||g.getId();f.warning("View or Fragment '"+d+"' contains a Control tag that starts with lower case '"+s+"'",g.getId(),"sap.ui.core.XMLTemplateProcessor#lowerCase")}var p=ee(e.namespaceURI,o);if(p&&typeof p.then==="function"){return p.then(function(r){return re(e,r,n,t)})}else{return re(e,p,n,t)}}}function re(e,u,d,v,w){var C=e.namespaceURI,A={},_={},M="",R=[],j=null,U=null,k=e.getAttribute("stashed")==="true",F=w&&w.rootArea,W=w&&w.rootNode,D;if(!m){e.removeAttribute("stashed")}if(!u){return c.resolve([])}if(W){A.id=g.getId()}var K=u.getMetadata();var z=K.getAllSettings();var $=!F?X(e,O):undefined;if($){d=c.all([d,$]).then(function(e){return Object.assign({},e[0],e[1])})}d=d.then(function(r){if(h(r)){r=null}D=r;if(!m){for(var i=0;i<e.attributes.length;i++){var a=e.attributes[i],o=a.name,l=a.namespaceURI,c=z[o],d=a.value;if(W&&P.includes(o)){continue}if(o==="id"&&!W){A[o]=ae(g,e,d)}else if(o==="class"){M+=d}else if(o==="viewName"){A[o]=d}else if(o==="fragmentName"){A[o]=d;A["containingView"]=g._oContainingView}else if(o==="binding"&&!c||o==="objectBindings"){if(!k){var v=n.parse(d,g._oContainingView.oController);if(v){A.objectBindings=A.objectBindings||{};A.objectBindings[v.model||undefined]=v}}}else if(o==="metadataContexts"){if(!k){var w=null;try{w=L._calculatedModelMapping(d,g._oContainingView.oController,true)}catch(e){f.error(g+":"+e.message)}if(w){A.metadataContexts=w;if(L._preprocessMetadataContexts){L._preprocessMetadataContexts(u.getMetadata().getName(),A,g._oContainingView.oController)}}}}else if(o.indexOf(":")>-1){l=a.namespaceURI;if(l===x){var C=y(a);R.push(new t({key:C,value:b("any",d,C,g._oContainingView.oController,r)}))}else if(l===V){U=d}else if(l&&l.startsWith(S)){f.debug(g+": XMLView parser ignored preprocessor attribute '"+o+"' (value: '"+d+"')")}else if(l===E&&y(a)==="invisible"){c=z.visible;if(c&&c._iKind===0&&c.type==="boolean"){A.visible=false}}else if(l===N||l===E||o.startsWith("xmlns:")){}else{if(!j){j={}}if(!j.hasOwnProperty(a.namespaceURI)){j[a.namespaceURI]={}}j[a.namespaceURI][y(a)]=a.nodeValue;f.debug(g+": XMLView parser encountered unknown attribute '"+o+"' (value: '"+d+"') with unknown namespace, stored as sap-ui-custom-settings of customData")}}else if(c&&c._iKind===0){A[o]=b(c.type,d,o,g._oContainingView.oController,r)}else if(c&&c._iKind===1&&c.altTypes){if(!k){A[o]=b(c.altTypes[0],d,o,g._oContainingView.oController,r)}}else if(c&&c._iKind===2){if(!k){var v=n.parse(d,g._oContainingView.oController,false,false,false,false,r);if(v){A[o]=v}else{f.error(g+": aggregations with cardinality 0..n only allow binding paths as attribute value (wrong value: "+o+"='"+d+"')")}}}else if(c&&c._iKind===3){if(!k){A[o]=Z(d)}}else if(c&&c._iKind===4){if(!k){A[o]=d.split(/[\s,]+/g).filter(J).map(Z)}}else if(c&&c._iKind===5){if(!k){var _=[];s.parse(d).forEach(function(e){var n=s.resolveEventHandler(e,g._oContainingView.oController,r);if(n){_.push(n)}else{f.warning(g+': event handler function "'+e+'" is not a function or does not exist in the controller.')}});if(_.length){A[o]=_}}}else if(c&&c._iKind===-1){if(K.isA("sap.ui.core.mvc.View")&&o=="async"){A[o]=b(c.type,d,o,g._oContainingView.oController,r)}else{f.warning(g+": setting '"+o+"' for class "+K.getName()+" (value:'"+d+"') is not supported")}}else{p(o==="xmlns",g+": encountered unknown setting '"+o+"' for class "+K.getName()+" (value:'"+d+"')");if(L._supportInfo){L._supportInfo({context:e,env:{caller:"createRegularControls",error:true,info:"unknown setting '"+o+"' for class "+K.getName()}})}}}if(j){R.push(new t({key:"sap-ui-custom-settings",value:j}))}if(R.length>0){A.customData=R}}return r}).catch(function(n){if(!n.isEnriched){n=new Error(G(e,n));n.isEnriched=true;f.error(n)}if(O&&g._sProcessingMode!==o.SequentialLegacy){throw n}});var Q=T(O,Y);function Y(e,n,t){var r=t.aggregation,i=t.allAggregations,a=t.chain,o=t.closestBinding,s=t.config,u,f;if(n.nodeType===1){if(n.namespaceURI===I){A[y(n)]=n.querySelector("*");return undefined}u=n.namespaceURI===C&&i&&i[y(n)];if(u){return Q(n,{aggregation:u,allAggregations:null,chain:a,closestBinding:o,config:s})}else if(r){if(n.getAttribute("stashed")==="true"&&!m){var d=n;n=n.cloneNode();d.removeAttribute("stashed");f=function(){var t=ae(g,n);l.createStashedControl({wrapperId:t,fnCreate:function(){var n=O;O=false;try{return Y(e,d,{aggregation:r,allAggregations:i,chain:c.resolve(D),closestBinding:o}).unwrap()}finally{O=n}}})};if(g.fnScopedRunWithOwner){g.fnScopedRunWithOwner(f)}else{f()}n.removeAttribute("visible");ie(n,"invisible")}if(A[r.name]&&typeof A[r.name].path==="string"){o={aggregation:r.name,id:A.id};if(W&&r.name==="content"){s=s||{};s.contentBound=true}}return ne(n,a,o,r,s).then(function(e){for(var n=0;n<e.length;n++){var t=e[n];var i=r.name;if(t._isExtensionPoint){if(!A[i]){A[i]=[]}var a=_[i];if(!a){a=_[i]=[]}t.index=A[i].length;t.aggregationName=i;t.closestAggregationBindingCarrier=o&&o.id;t.closestAggregationBinding=o&&o.aggregation;var s=a[a.length-1];if(s){s._nextSibling=t}a.push(t)}else if(r.multiple){if(!A[i]){A[i]=[]}if(typeof A[i].path==="string"){p(!A[i].template,"list bindings support only a single template object");A[i].template=t}else{A[i].push(t)}}else{p(!A[i],"multiple aggregates defined for aggregation with cardinality 0..1");A[i]=t}}return e})}else{throw new Error(G(n,"Cannot add direct child without default aggregation defined for control "+K.getElementName()))}}else if(n.nodeType===3){if(s&&s.rootArea){ne(n,a,o,r,s)}else{var v=n.textContent||n.text;if(v&&v.trim()){throw new Error(G(n,"Cannot add text nodes as direct child of an aggregation. For adding text to an aggregation, a surrounding html tag is needed."))}}}}var ee=K.getDefaultAggregation();var te=K.getAllAggregations();return Q(e,{aggregation:ee,allAggregations:te,chain:d,closestBinding:v,config:w}).then(function(){var n;var t=c.resolve();var o=c.resolve();var s=e.getAttribute("type");var l=r.getOwnerComponentFor(g);var f=l&&l.isA("sap.ui.core.IAsyncContentCreation");if(m){if(!F&&e.hasAttribute("id")){oe(g,e)}}else if(!W&&u.getMetadata().isA("sap.ui.core.mvc.View")){var d=function(){if(!u._sType&&!A.viewName){A.viewName="module:"+u.getMetadata().getName().replace(/\./g,"/")}if(f&&O){if(A.async===false){throw new Error("A nested view contained in a Component implementing 'sap.ui.core.IAsyncContentCreation' is processed asynchronously by default and cannot be processed synchronously.\n"+"Affected Component '"+l.getMetadata().getComponentName()+"' and View '"+A.viewName+"'.")}A.type=u._sType||s;o=i.create(A)}else{if(u.getMetadata().isA("sap.ui.core.mvc.XMLView")&&g._sProcessingMode){A.processingMode=g._sProcessingMode}return i._create(A,undefined,u._sType||s)}};if(g.fnScopedRunWithOwner){n=g.fnScopedRunWithOwner(d)}else{n=d()}}else if(u.getMetadata().isA("sap.ui.core.Fragment")&&O){if(s!==a.JS){A.processingMode=g._sProcessingMode}var p="sap/ui/core/Fragment";var v=sap.ui.require(p);A.name=A.name||A.fragmentName;if(v){o=v.load(A)}else{o=new Promise(function(e,n){sap.ui.require([p],function(n){n.load(A).then(function(n){e(n)})},n)})}}else{var h=function(){var e;if(W){e=g;if(!O){if(q&&q.settings){Object.keys(A).forEach(function(e){if(q.settings.hasOwnProperty(e)){q.settings[e]=A[e];delete A[e]}})}}g.applySettings(A)}else if(g.fnScopedRunWithOwner){e=g.fnScopedRunWithOwner(function(){var e=new u(A);return e})}else{e=new u(A)}t=B(O,e,_);return e};if(q&&q.fnRunWithPreprocessor){n=q.fnRunWithPreprocessor(h)}else{n=h()}}return o.then(function(e){return e||n}).then(function(n){if(M&&n.addStyleClass){n.addStyleClass(M)}if(!n){n=[]}else if(!Array.isArray(n)){n=[n]}if(L._supportInfo&&n){for(var r=0,i=n.length;r<i;r++){var a=n[r];if(a&&a.getId()){var o=L._supportInfo({context:e,env:{caller:"createRegularControls",nodeid:e.getAttribute("id"),controlid:a.getId()}}),s=U?U+",":"";s+=o;L._supportInfo.addSupportInfo(a.getId(),s)}}}if(H){n.forEach(function(n){if(K.getCompositeAggregationName){var t=e.getElementsByTagName(n.getMetadata().getCompositeAggregationName());for(var r=0;r<t.length;r++){e.removeChild(t[0])}}n._sapui_declarativeSourceInfo={xmlNode:e,xmlRootNode:g._sapui_declarativeSourceInfo.xmlRootNode,fragmentName:K.getName()==="sap.ui.core.Fragment"?A["fragmentName"]:null}})}return t.then(function(){return n})})})}function ie(e,n){var t=j(e,E,k);e.setAttributeNS(E,t+":"+n,"true")}function ae(e,n,t){if(n.getAttributeNS(E,"id")){return n.getAttribute("id")}else{return Z(t?t:n.getAttribute("id"))}}function oe(e,n){n.setAttribute("id",Z(n.getAttribute("id")));ie(n,"id")}}L._preprocessMetadataContexts=null;L._calculatedModelMapping=function(e,t,r){var i,a={},o=n.parse(e,t);function s(e){if(e.length%2===0){throw new Error("The last entry is no binding")}for(var n=1;n<=e.length;n=n+2){if(typeof e[n-1]=="string"){throw new Error("Binding expected not a string")}if(e[n]){if(typeof e[n]!="string"||e[n]!=","){throw new Error("Missing delimiter ','")}}}}if(o){if(!o.formatter){i=o;o={parts:[i]}}else{s(o.formatter.textFragments)}for(var u=0;u<o.parts.length;u++){i=o.parts[u];a[i.model]=a[i.model]||(r?[]:null);if(Array.isArray(a[i.model])){a[i.model].push(i)}else{a[i.model]=i}}}return a};return L},true);
//# sourceMappingURL=XMLTemplateProcessor.js.map