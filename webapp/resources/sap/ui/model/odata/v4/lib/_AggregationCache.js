/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_AggregationHelper","./_Cache","./_ConcatHelper","./_GroupLock","./_Helper","./_MinMaxHelper","sap/base/Log","sap/ui/base/SyncPromise"],function(e,t,n,r,i,a,o,s){"use strict";function l(r,a,o,l,u){var d=function(){},c=null,f=this;t.call(this,r,a,l,true);this.oAggregation=o;this.sDownloadUrl=o.hierarchyQualifier?"n/a":t.prototype.getDownloadUrl.call(this,"");this.aElements=[];this.aElements.$byPredicate={};this.aElements.$count=undefined;this.aElements.$created=0;this.oLeavesPromise=undefined;if(l.$count&&o.groupLevels.length){l.$$leaves=true;this.oLeavesPromise=new s(function(e){c=function(t){e(parseInt(t.UI5__leaves))}})}this.oFirstLevel=this.createGroupLevelCache(null,u||!!c);this.requestSideEffects=this.oFirstLevel.requestSideEffects;this.oGrandTotalPromise=undefined;if(u){this.oGrandTotalPromise=new s(function(t){n.enhanceCache(f.oFirstLevel,o,[c,function(n){var r;if(o["grandTotal like 1.84"]){e.removeUI5grand__(n)}e.setAnnotations(n,true,true,0,e.getAllProperties(o));if(o.grandTotalAtBottomOnly===false){r=Object.assign({},n,{"@$ui5.node.isExpanded":undefined});i.setPrivateAnnotation(n,"copy",r);i.setPrivateAnnotation(r,"predicate","($isTotal=true)")}i.setPrivateAnnotation(n,"predicate","()");t(n)},d])})}else if(c){n.enhanceCache(f.oFirstLevel,o,[c,d])}}l.prototype=Object.create(t.prototype);l.prototype.addElements=function(t,n,r,a){var o=this.aElements;function l(t,l){var u=o[n+l],d,c=i.getPrivateAnnotation(t,"predicate");if(u){if(u===t){return}e.beforeOverwritePlaceholder(u,t,r,a+l)}else if(n+l>=o.length){throw new Error("Array index out of bounds: "+(n+l))}d=o.$byPredicate[c];if(d&&d!==t&&!(d instanceof s)){throw new Error("Duplicate predicate: "+c)}o.$byPredicate[c]=o[n+l]=t;if(r){i.setPrivateAnnotation(t,"index",a+l);i.setPrivateAnnotation(t,"parent",r)}}if(n<0){throw new Error("Illegal offset: "+n)}if(Array.isArray(t)){t.forEach(l)}else{l(t,0)}};l.prototype.beforeRequestSideEffects=function(e){if(!this.oAggregation.hierarchyQualifier){throw new Error("Missing recursive hierarchy")}delete e.$apply};l.prototype.collapse=function(t){var n,a=0,o,s=this.aElements,l=this.fetchValue(r.$cached,t).getResult(),u=l["@$ui5.node.level"],d=s.indexOf(l),c=d+1;function f(e){delete s.$byPredicate[i.getPrivateAnnotation(s[e],"predicate")];a+=1}n=e.getCollapsedObject(l);i.updateAll(this.mChangeListeners,t,l,n);o=i.getPrivateAnnotation(l,"descendants");if(o){u=this.oAggregation.expandTo}while(c<s.length){if(s[c]["@$ui5.node.level"]<=u){if(!o){break}o-=1;if(s[c]["@$ui5.node.isExpanded"]===false){o-=i.getPrivateAnnotation(s[c],"descendants")||0}}f(c);c+=1}if(this.oAggregation.subtotalsAtBottomOnly!==undefined&&Object.keys(n).length>1){f(c)}i.setPrivateAnnotation(l,"spliced",s.splice(d+1,a));s.$count-=a;return a};l.prototype.createGroupLevelCache=function(n,r){var a=this.oAggregation,o=n?n["@$ui5.node.level"]+1:1,s,u,d,c,f,h;if(a.hierarchyQualifier){f=Object.assign({},this.mQueryOptions)}else{s=e.getAllProperties(a);c=o>a.groupLevels.length;d=c?a.groupLevels.concat(Object.keys(a.group).sort()):a.groupLevels.slice(0,o);f=e.filterOrderby(this.mQueryOptions,a,o);h=!c&&Object.keys(a.aggregate).some(function(e){return a.aggregate[e].subtotals})}if(n){f.$$filterBeforeAggregate=i.getPrivateAnnotation(n,"filter")+(f.$$filterBeforeAggregate?" and ("+f.$$filterBeforeAggregate+")":"")}if(!r){delete f.$count;f=e.buildApply(a,f,o)}f.$count=true;u=t.create(this.oRequestor,this.sResourcePath,f,true);u.calculateKeyPredicate=a.hierarchyQualifier?l.calculateKeyPredicateRH.bind(null,n,a):l.calculateKeyPredicate.bind(null,n,d,s,c,h);return u};l.prototype.expand=function(t,n){var a,o,l=this.aElements,u=typeof n==="string"?this.fetchValue(r.$cached,n).getResult():n,d,c=i.getPrivateAnnotation(u,"spliced"),f,h=this;if(n!==u){i.updateAll(this.mChangeListeners,n,u,e.getOrCreateExpandedObject(this.oAggregation,u))}if(c){i.deletePrivateAnnotation(u,"spliced");f=c.$stale;d=l.indexOf(u)+1;this.aElements=l.concat(c,l.splice(d));this.aElements.$byPredicate=l.$byPredicate;o=c.length;this.aElements.$count=l.$count+o;c.forEach(function(e,t){var n=i.getPrivateAnnotation(e,"predicate");if(!i.hasPrivateAnnotation(e,"placeholder")){if(f){h.replaceByPlaceholder(d+t,e,n)}else{h.aElements.$byPredicate[n]=e;if(i.hasPrivateAnnotation(e,"expanding")){i.deletePrivateAnnotation(e,"expanding");o+=h.expand(r.$cached,e).getResult()}}}});return s.resolve(o)}a=i.getPrivateAnnotation(u,"cache");if(!a){a=this.createGroupLevelCache(u);i.setPrivateAnnotation(u,"cache",a)}return a.read(0,this.iReadLength,0,t).then(function(t){var r=h.aElements.indexOf(u)+1,s=u["@$ui5.node.level"],l=e.getCollapsedObject(u),d=h.oAggregation.subtotalsAtBottomOnly!==undefined&&Object.keys(l).length>1,c;if(!u["@$ui5.node.isExpanded"]){i.deletePrivateAnnotation(u,"spliced");return 0}if(!r){i.setPrivateAnnotation(u,"expanding",true);return 0}o=t.value.$count;if(i.hasPrivateAnnotation(u,"groupLevelCount")&&i.getPrivateAnnotation(u,"groupLevelCount")!==o){throw new Error("Unexpected structural change: groupLevelCount")}i.setPrivateAnnotation(u,"groupLevelCount",o);i.updateAll(h.mChangeListeners,n,u,{"@$ui5.node.groupLevelCount":o});if(d){o+=1}if(r===h.aElements.length){h.aElements.length+=o}else{for(c=h.aElements.length-1;c>=r;c-=1){h.aElements[c+o]=h.aElements[c];delete h.aElements[c]}}h.addElements(t.value,r,a,0);for(c=r+t.value.length;c<r+t.value.$count;c+=1){h.aElements[c]=e.createPlaceholder(s+1,c-r,a)}if(d){l=Object.assign({},l);e.setAnnotations(l,undefined,true,s,e.getAllProperties(h.oAggregation));i.setPrivateAnnotation(l,"predicate",i.getPrivateAnnotation(u,"predicate").slice(0,-1)+",$isTotal=true)");h.addElements(l,r+o-1)}h.aElements.$count+=o;return o},function(t){i.updateAll(h.mChangeListeners,n,u,e.getCollapsedObject(u));throw t})};l.prototype.fetchValue=function(e,t,n,r){var i=this;if(t==="$count"){if(this.oLeavesPromise){return this.oLeavesPromise}if(this.oAggregation.hierarchyQualifier||this.oAggregation.groupLevels.length){o.error("Failed to drill-down into $count, invalid segment: $count",this.toString(),"sap.ui.model.odata.v4.lib._Cache");return s.resolve()}return this.oFirstLevel.fetchValue(e,t,n,r)}return s.resolve(this.aElements.$byPredicate[t.split("/")[0]]).then(function(){i.registerChangeListener(t,r);return i.drillDown(i.aElements,t,e)})};l.prototype.filterVisibleElements=function(t){var n={},r=this;t.forEach(function(e){n[e]=true});return this.aElements.filter(function(t,a){var o=i.getPrivateAnnotation(t,"predicate");if(n[o]){e.markSplicedStale(t);return true}r.replaceByPlaceholder(a,t,o)})};l.prototype.getAllElements=function(e){var t;if(e){throw new Error("Unsupported path: "+e)}t=this.aElements.map(function(e){return i.hasPrivateAnnotation(e,"placeholder")?undefined:e});t.$count=this.aElements.$count;return t};l.prototype.getCreatedElements=function(e){return[]};l.prototype.getDownloadQueryOptions=function(t){return e.buildApply(this.oAggregation,e.filterOrderby(t,this.oAggregation),0,true)};l.prototype.getDownloadUrl=function(e,t){return this.sDownloadUrl};l.prototype.isDeletingInOtherGroup=function(e){return false};l.prototype.read=function(e,t,n,r,a){var o,l,u=e,d=t,c,f,h=this.oGrandTotalPromise&&this.oAggregation.grandTotalAtBottomOnly!==true,p=[],g,v,m=this;function E(e,t){p.push(m.readGap(c,e,t,r.getUnlockedCopy(),a))}if(h&&!e&&t===1){if(n!==0){throw new Error("Unsupported prefetch length: "+n)}r.unlock();return this.oGrandTotalPromise.then(function(e){return{value:[e]}})}if(this.aElements.$count===undefined){this.iReadLength=t+n;if(h){if(u){u-=1}else{d-=1}}p.push(this.readFirst(u,d,n,r,a))}else{for(g=e,v=Math.min(e+t,this.aElements.length);g<v;g+=1){l=this.aElements[g];o=i.hasPrivateAnnotation(l,"placeholder")?i.getPrivateAnnotation(l,"parent"):undefined;if(o!==c){if(f!==undefined){E(f,g);c=f=undefined}if(o){f=g;c=o}}else if(f!==undefined&&i.getPrivateAnnotation(l,"index")!==i.getPrivateAnnotation(this.aElements[g-1],"index")+1){E(f,g);f=g}}if(f!==undefined){E(f,g)}r.unlock()}return s.all(p).then(function(){var n=m.aElements.slice(e,e+t);n.$count=m.aElements.$count;return{value:n}})};l.prototype.readFirst=function(t,n,r,a,o){var s=this;return this.oFirstLevel.read(t,n,r,a,o).then(function(n){var r,a,o=0,l;s.aElements.length=s.aElements.$count=n.value.$count;if(s.oGrandTotalPromise){s.aElements.$count+=1;s.aElements.length+=1;r=s.oGrandTotalPromise.getResult();switch(s.oAggregation.grandTotalAtBottomOnly){case false:o=1;s.aElements.$count+=1;s.aElements.length+=1;s.addElements(r,0);a=i.getPrivateAnnotation(r,"copy");s.addElements(a,s.aElements.length-1);break;case true:s.addElements(r,s.aElements.length-1);break;default:o=1;s.addElements(r,0)}}s.addElements(n.value,t+o,s.oFirstLevel,t);for(l=0;l<s.aElements.$count;l+=1){if(!s.aElements[l]){s.aElements[l]=e.createPlaceholder(s.oAggregation.expandTo>1?0:1,l-o,s.oFirstLevel)}}})};l.prototype.readGap=function(e,t,n,r,a){var o,s,l=e.getQueryOptions(),u=i.getPrivateAnnotation(this.aElements[t],"index"),d=this.aElements[t],c,f=this;if(l.$count){delete l.$count;e.setQueryOptions(l,true)}s=e.read(u,n-t,0,r,a).then(function(n){var r=false,i;if(d!==f.aElements[t]&&n.value[0]!==f.aElements[t]){r=true;t=f.aElements.indexOf(d);if(t<0){t=f.aElements.indexOf(n.value[0]);if(t<0){i=new Error("Collapse before read has finished");i.canceled=true;throw i}}}f.addElements(n.value,t,e,u);if(r){i=new Error("Collapse or expand before read has finished");i.canceled=true;throw i}});if(s.isPending()){for(c=t;c<n;c+=1){o=i.getPrivateAnnotation(this.aElements[c],"predicate");if(o){this.aElements.$byPredicate[o]=s}}}return s};l.prototype.refreshKeptElements=function(){};l.prototype.replaceByPlaceholder=function(t,n,r){if(i.hasPrivateAnnotation(n,"placeholder")){return}e.markSplicedStale(n);this.aElements[t]={"@$ui5._":Object.assign(n["@$ui5._"],{placeholder:true}),"@$ui5.node.isExpanded":n["@$ui5.node.isExpanded"],"@$ui5.node.level":n["@$ui5.node.level"]};delete this.aElements.$byPredicate[r];i.getPrivateAnnotation(n,"parent").drop(i.getPrivateAnnotation(n,"index"),r)};l.prototype.toString=function(){return this.sDownloadUrl};l.calculateKeyPredicate=function(t,n,r,a,o,s,l,u){var d;if(!(u in l)){return undefined}if(t){r.forEach(function(e){if(Array.isArray(e)){i.inheritPathValue(e,t,s)}else if(!(e in s)){s[e]=t[e]}})}d=a&&i.getKeyPredicate(s,u,l)||i.getKeyPredicate(s,u,l,n,true);i.setPrivateAnnotation(s,"predicate",d);if(!a){i.setPrivateAnnotation(s,"filter",i.getKeyFilter(s,u,l,n))}e.setAnnotations(s,a?undefined:false,o,t?t["@$ui5.node.level"]+1:1,t?null:r);return d};l.calculateKeyPredicateRH=function(t,n,r,a,o){var s=n.$DistanceFromRootProperty,l=n.$DrillStateProperty,u,d=1,c=n.$LimitedDescendantCountProperty,f=i.getKeyPredicate(r,o,a);i.setPrivateAnnotation(r,"predicate",f);switch(r[l]){case"expanded":u=true;break;case"collapsed":u=false;i.setPrivateAnnotation(r,"filter",i.getKeyFilter(r,o,a));break;default:}if(t){d=t["@$ui5.node.level"]+1}else if(r[s]){d=parseInt(r[s])+1}e.setAnnotations(r,u,undefined,d);if(r[c]&&r[c]!=="0"){i.setPrivateAnnotation(r,"descendants",parseInt(r[c]))}delete r[s];delete r[l];delete r[c];return f};l.create=function(n,r,i,o,s,u,d,c){var f,h;function p(){if("$expand"in s){throw new Error("Unsupported system query option: $expand")}if("$select"in s){throw new Error("Unsupported system query option: $select")}}if(o){f=e.hasGrandTotal(o.aggregate);h=o.groupLevels&&!!o.groupLevels.length;if(e.hasMinOrMax(o.aggregate)){if(f){throw new Error("Unsupported grand totals together with min/max")}if(h){throw new Error("Unsupported group levels together with min/max")}if(o.hierarchyQualifier){throw new Error("Unsupported recursive hierarchy together with min/max")}if(d){throw new Error("Unsupported $$sharedRequest together with min/max")}p();return a.createCache(n,r,o,s)}if(s.$filter&&(f&&!o["grandTotal like 1.84"]||h)){throw new Error("Unsupported system query option: $filter")}if(f||h||o.hierarchyQualifier){if(s.$search){throw new Error("Unsupported system query option: $search")}if(!o.hierarchyQualifier){p()}if(c){throw new Error("Unsupported grouping via sorter")}if(d){throw new Error("Unsupported $$sharedRequest")}return new l(n,r,o,s,f)}}if(s.$$filterBeforeAggregate){s.$apply="filter("+s.$$filterBeforeAggregate+")/"+s.$apply;delete s.$$filterBeforeAggregate}return t.create(n,r,s,u,i,d)};return l},false);
//# sourceMappingURL=_AggregationCache.js.map