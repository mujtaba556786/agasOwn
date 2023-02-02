/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/semantic/SemanticPage","sap/m/semantic/SemanticPageRenderer","sap/m/library"],function(e,t,a){"use strict";var i=a.semantic.SemanticRuleSetType;var s=e.extend("sap.m.semantic.MasterPage",{metadata:{library:"sap.m",aggregations:{addAction:{type:"sap.m.semantic.AddAction",multiple:false},mainAction:{type:"sap.m.semantic.MainAction",multiple:false},positiveAction:{type:"sap.m.semantic.PositiveAction",multiple:false},negativeAction:{type:"sap.m.semantic.NegativeAction",multiple:false},multiSelectAction:{type:"sap.m.semantic.MultiSelectAction",multiple:false},forwardAction:{type:"sap.m.semantic.ForwardAction",multiple:false},editAction:{type:"sap.m.semantic.EditAction",multiple:false},saveAction:{type:"sap.m.semantic.SaveAction",multiple:false},deleteAction:{type:"sap.m.semantic.DeleteAction",multiple:false},cancelAction:{type:"sap.m.semantic.CancelAction",multiple:false},sort:{type:"sap.m.semantic.ISort",multiple:false},filter:{type:"sap.m.semantic.IFilter",multiple:false},group:{type:"sap.m.semantic.IGroup",multiple:false},messagesIndicator:{type:"sap.m.semantic.MessagesIndicator",multiple:false}}},renderer:t});s.prototype.init=function(){e.prototype.init.call(this);this._getPage().getLandmarkInfo().setRootLabel(sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("SEMANTIC_MASTER_PAGE_TITLE"))};s.prototype.getSemanticRuleSet=function(){return i.Classic};return s});
//# sourceMappingURL=MasterPage.js.map