/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BaseContentRenderer","../library"],function(t,e){"use strict";var i=e.AttributesLayoutType;var n=t.extend("sap.ui.integration.cards.ListContentRenderer",{apiVersion:2});n.renderContent=function(t,e){t.renderControl(e.getAggregation("_content"));if(e.getAggregation("_legend")){t.renderControl(e.getAggregation("_legend"))}};n.getMinHeight=function(t,e,i){if(e._fMinHeight){return e._fMinHeight+"px"}var n=i.getContentMinItems(t),r;if(!t||!t.item||n==null){return this.DEFAULT_MIN_HEIGHT}r=this.getItemMinHeight(t,e);return n*r+"rem"};n.getItemMinHeight=function(t,e){if(!t||!t.item){return 0}var n=this.isCompact(e),r=t.item,g=n?1:1.125,o=n?1:1.625,a;if(r.icon&&!r.description){o=n?0:.75;g=2}if(r.description){o=2;g+=n?2:1.875}if(r.attributes){o=2.25;a=r.attributes.length/2;if(r.attributesLayoutType===i.OneColumn){a=r.attributes.length}a=Math.ceil(a);g+=a*1.5}if(r.chart){g+=1}if(r.actionsStrip){o=1;g+=n?3:3.75}g+=o;return g};return n});
//# sourceMappingURL=ListContentRenderer.js.map