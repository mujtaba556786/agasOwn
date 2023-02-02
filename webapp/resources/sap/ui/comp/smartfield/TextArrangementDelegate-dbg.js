/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
/* global Map */

sap.ui.define([
	"sap/ui/comp/library",
	"sap/ui/core/library",
	"sap/ui/core/Core",
	"sap/ui/base/Object",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/base/assert",
	"sap/base/util/deepEqual"
], function(
	compLibrary,
	coreLibrary,
	Core,
	BaseObject,
	Filter,
	FilterOperator,
	assert,
	deepEqualUtil
) {
	"use strict";

	var TextInEditModeSource = compLibrary.smartfield.TextInEditModeSource;

	var TextArrangementDelegate = BaseObject.extend("sap.ui.comp.smartfield.TextArrangementDelegate", /** @lends sap.ui.comp.smartfield.TextArrangementDelegate.prototype */ {
		constructor: function(oFactory) {
			BaseObject.apply(this, arguments);
			this.oTextArrangementType = null;
			this.oFactory = oFactory;
			this.oSmartField = oFactory._oParent;
			this.bValidMetadata = false;
			this.sBindingContextPath = "";
			this.sAbsolutePathToVLProperty = "";

			// Cache for description request data. This is one time cache after every get the value is removed
			this._mOneTimeDescriptionCache = new Map();
			this._sTextArrangementLastReadValue = null;
			this._mTextArrangementLastReadAdditionalFilters = null;
		}
	});

	TextArrangementDelegate.prototype.setValue = function(sValue, sOldValue) {
		var oSmartField = this.oSmartField,
			oControl = oSmartField._oControl;

		// In edit mode, if the textInEditModeSource property is set to TextInEditModeSource.NavigationProperty or
		// to TextInEditModeSource.ValueList, a composite binding is used for the hosted inner control (usually a sap.m.Input).
		// So, calling .setValue() on the SmartField control, would not update all model properties of the hosted inner
		// control.
		if (this.bValidMetadata && (sValue !== sOldValue) && oControl) {
			var oInnerControl = oControl[oControl.current],
				oBinding = oInnerControl && oInnerControl.getBinding("value");

			if (!oBinding) {
				return;
			}

			// This bModelUpdate flag indicates whether the .setValue() mutator method is called by the framework
			// due to a property binding change e.g.: by calling .updateProperty("value")
			var bModelUpdate = oSmartField.isPropertyBeingUpdatedByModel("value");

			switch (oSmartField._getComputedTextInEditModeSource()) {
				case TextInEditModeSource.NavigationProperty:
					var bDescriptionForValueLoaded = !!oSmartField.getModel().getData(oBinding.getBindings()[1].getPath(), oSmartField.getBindingContext(), true);

					if ((bModelUpdate && !bDescriptionForValueLoaded) || !bModelUpdate) {
						oInnerControl.setValue(sValue);
					}

					return;

				case TextInEditModeSource.ValueList:
				case TextInEditModeSource.ValueListNoValidation:
					if (!bModelUpdate) {
						oInnerControl.setValue(sValue);
					} else if (
						// Last value for which text arrangement request was made is not the same as the new one
						this._sTextArrangementLastReadValue !== sValue
					) {
						// Upon model update we might need to update the text arrangement
						this.fetchIDAndDescriptionCollectionIfRequired();
					}

					return;

				// no default
			}
		}
	};

	TextArrangementDelegate.getPaths = function(sTextInEditModeSource, oMetadata) {
		var oValueListAnnotation = oMetadata.property && oMetadata.property.valueListAnnotation;

		switch (sTextInEditModeSource) {
			case TextInEditModeSource.NavigationProperty:
				var oNavigationPropertyMetadata = oMetadata.annotations.text;

				if (!oNavigationPropertyMetadata) {
					return {};
				}

				return {
					keyField: oNavigationPropertyMetadata.entityType.key.propertyRef[0].name,
					descriptionField: oNavigationPropertyMetadata.property.typePath,
					entitySetName: oNavigationPropertyMetadata.entitySet.name
				};

			case TextInEditModeSource.ValueList:
				if (!oValueListAnnotation) {
					return {};
				}

				return {
					keyField: oValueListAnnotation.keyField,
					descriptionField: oValueListAnnotation.descriptionField,
					entitySetName: oMetadata.property.valueListEntitySet && oMetadata.property.valueListEntitySet.name
				};
			case TextInEditModeSource.ValueListNoValidation:
				if (!oValueListAnnotation) {
					return {};
				}

				return {
					valueListNoValidation: true,
					keyField: oValueListAnnotation.keyField,
					descriptionField: oValueListAnnotation.descriptionField,
					entitySetName: oMetadata.property.valueListEntitySet.name
				};

			// no default
		}
	};

	TextArrangementDelegate.prototype.getBindingInfo = function(oSettings) {
		var	oBindSettings,
			bValueListNoValidation = oSettings.valueListNoValidation,
			oFormatOptions = {},
			oSmartField = this.oSmartField,
			oFactory = this.oFactory,
			oMetadata = oFactory._oMetaData,
			oValueListData = oMetadata &&
				oMetadata.annotations &&
				oMetadata.annotations.valueListData || null;

		this.oTextArrangementType = oSettings && oSettings.type;

		if (!this.oTextArrangementType) {
			var oBindingInfo = oSmartField.getBindingInfo("value");
			this.oTextArrangementType = (oBindingInfo && oBindingInfo.type) || {};
			var mTextArrangementBindingPaths = TextArrangementDelegate.getPaths(
				oFactory._bTextInDisplayModeValueList ? TextInEditModeSource.ValueList : oSmartField._getComputedTextInEditModeSource(),
				oMetadata
			);
			var bKeyInitialValueIsSignificant =  oValueListData && oValueListData.aInitialValueIsSignificantFields && oValueListData.aInitialValueIsSignificantFields.indexOf(mTextArrangementBindingPaths.keyField) !== -1;

			this.oTextArrangementType = oFactory._oTypes.getType(oMetadata.property, Object.assign(oFormatOptions, this.oTextArrangementType.oFormatOptions), this.oTextArrangementType.oConstraints, {
				composite: true,
				keyField: mTextArrangementBindingPaths.keyField,
				descriptionField: mTextArrangementBindingPaths.descriptionField,
				valueListNoValidation: bValueListNoValidation,
				valueList: oSmartField._getComputedTextInEditModeSource() === TextInEditModeSource.ValueList,
				keyInitialValueIsSignificant: bKeyInitialValueIsSignificant,
				delegate: this
			});
		}
		var entityID = this.oSmartField.getBinding("value").getValue(),
			sTextInEditModeSource = oSmartField._getComputedTextInEditModeSource(),
			mTextArrangementPaths = TextArrangementDelegate.getPaths(
				this.oFactory._bTextInDisplayModeValueList ? TextInEditModeSource.ValueList : sTextInEditModeSource,
				oMetadata
			);

		var sTextAnnotationPropertyPath = this.getTextAnnotationPropertyPath({
			entitySet: { name: mTextArrangementPaths.entitySetName },
			entityID: entityID
		});

		// BCP: 1970338535 - Special case where we can't calculate the description binding path so we have to use
		// not existing one to prevent issues having an empty binding path.
		if (sTextAnnotationPropertyPath === "" || sTextAnnotationPropertyPath.indexOf("undefined") !== -1) {
			sTextAnnotationPropertyPath = "__$$SmartFieldNotExistingBindingPath";
		}

		oBindSettings = {
			model: oMetadata.model,
			type: this.oTextArrangementType,
			parts: [
				{
					path: oMetadata.path
				},
				{
					path: sTextAnnotationPropertyPath
				}
			]
		};

		return oBindSettings;
	};

	TextArrangementDelegate.prototype.getTextAnnotationPropertyPath = function(oSettings) {
		oSettings = oSettings || {};
		var sTextInEditModeSource = oSettings.textInEditModeSource || this.oSmartField._getComputedTextInEditModeSource(),
			oFactory = this.oFactory,
			oMetadata = oFactory._oMetaData;

		if (oFactory._bTextInDisplayModeValueList) {
			// In this scenario we always revert to ValueList
			sTextInEditModeSource = TextInEditModeSource.ValueList;
		}

		switch (sTextInEditModeSource) {
			case TextInEditModeSource.NavigationProperty:
				var oTextAnnotation = oSettings.textAnnotation || oMetadata.annotations.text;
				return oFactory._oHelper.getTextAnnotationPropertyPath(oTextAnnotation);

			case TextInEditModeSource.ValueList:
				var oEdmValueListKeyProperty = oSettings.edmValueListKeyProperty || oMetadata.property.valueListKeyProperty,
					sBindingContextPath = oSettings.bindingContextPath || this.sBindingContextPath;

				// return the absolute path to the value list entity property e.g.: /VL_SH_H_CATEGORY('PR')/LTXT
				return oFactory._oHelper.getAbsolutePropertyPathToValueListEntity({
					property: oEdmValueListKeyProperty,
					bindingContextPath: sBindingContextPath,
					entitySet: oSettings.entitySet,
					entityID: oSettings.entityID
				});
			case TextInEditModeSource.ValueListNoValidation:
				var oEdmValueListKeyProperty = oSettings && oSettings.edmValueListKeyProperty || oMetadata.property.valueListKeyProperty,
				sBindingContextPath = oSettings && oSettings.bindingContextPath || this.sBindingContextPath,
				oTextAnnotation = oSettings && oSettings.textAnnotation || oMetadata && oMetadata.annotations && oMetadata.annotations.text;

				if (
					oTextAnnotation &&
					sBindingContextPath !== "/undefined" &&
					this.oSmartField._isValueInitial()
				) {
					var  sTextAnnotationPath = oFactory._oHelper.getTextAnnotationPropertyPath(oTextAnnotation);
					if (sTextAnnotationPath && sTextAnnotationPath !== this.oFactory.getMetaData().path) {
						return sTextAnnotationPath;
					}
				}
				// return the absolute path to the value list entity property e.g.: /VL_SH_H_CATEGORY('PR')/LTXT
				return oFactory._oHelper.getAbsolutePropertyPathToValueListEntity({
					property: oEdmValueListKeyProperty,
					bindingContextPath: sBindingContextPath,
					entitySet: oSettings.entitySet,
					entityID: oSettings.entityID
				});

			case TextInEditModeSource.None:
				return "";
			default:
				return "";
		}
	};

	TextArrangementDelegate.prototype.checkRequiredMetadata = function(sTextInEditModeSource, bSuppressErrors) {
		var oFactory = this.oFactory,
			oMetadata = oFactory._oMetaData;

		switch (sTextInEditModeSource) {
			case TextInEditModeSource.None:
				return false;

			case TextInEditModeSource.NavigationProperty:
				var oNavigationPropertyMetadata = oMetadata.annotations.text,
					oEntityTypeOfNavigationProperty;

				if (oNavigationPropertyMetadata) {
					oEntityTypeOfNavigationProperty = oNavigationPropertyMetadata.entityType;
				}

				var oCheckNavigationPropertyMetadata = {
					propertyName: oMetadata.property && oMetadata.property.property && oMetadata.property.property.name,
					entityType: oMetadata.entityType,
					entityTypeOfNavigationProperty: oEntityTypeOfNavigationProperty,
					textAnnotation: oMetadata.property && oMetadata.property.property && oMetadata.property.property["com.sap.vocabularies.Common.v1.Text"]
				};

				if (bSuppressErrors) {
					return oFactory._oHelper.checkNavigationPropertyRequiredMetadataNoAsserts(oCheckNavigationPropertyMetadata);
				} else {
					return oFactory._oHelper.checkNavigationPropertyRequiredMetadata(oCheckNavigationPropertyMetadata);
				}
			case TextInEditModeSource.ValueList:
			case TextInEditModeSource.ValueListNoValidation:
				var oValueListMetadata = {
					propertyName: oMetadata.property && oMetadata.property.property && oMetadata.property.property.name,
					entityType: oMetadata.entityType,
					valueListAnnotation: oMetadata.property && oMetadata.property.valueListAnnotation
				};

				if (bSuppressErrors) {
					return oFactory._oHelper.checkValueListRequiredMetadataForTextArrangmentNoAsserts(oValueListMetadata);
				} else {
					return oFactory._oHelper.checkValueListRequiredMetadataForTextArrangment(oValueListMetadata);
				}
			default:
				return false;
		 }
	};

	TextArrangementDelegate.prototype.onBeforeValidateValue = function(sValue, oSettings) {
		var oSmartField = this.oSmartField;

		// Prevent unnecessary requests to be sent and validation errors to be displayed,
		// if the binding context is not set
		if (!oSmartField.getBindingContext()) { // note: the binding context can be null or undefined
			return;
		}

		var fnOnFetchSuccess = this.onFetchIDAndDescriptionCollectionSuccess.bind(this, {
			success: oSettings.success
		});

		var fnOnFetchError = this.onFetchIDAndDescriptionCollectionError.bind(this, {
			error: oSettings.error
		});

		var oFetchSettings = {
			value: sValue,
			success: fnOnFetchSuccess,
			error: fnOnFetchError,
			filterFields: oSettings.filterFields,
			updateBusyIndicator: true,
			bCheckValuesValidity: oSettings.bCheckValuesValidity
		};

		return this.fetchIDAndDescriptionCollection(oFetchSettings);
	};

	TextArrangementDelegate.prototype.fetchIDAndDescriptionCollectionIfRequired = function(bForceTextArrangementFetch) {
		var oSmartField = this.oSmartField;
		var sMode = oSmartField.getMode();
		var sTextInEditModeSource = oSmartField._getComputedTextInEditModeSource();
		var oMetaData = this.oFactory && this.oFactory.getMetaData();
		var oTextAnnotation = oMetaData && oMetaData.annotations && oMetaData.annotations.text;

		// For fixed value-list we render a combobox and no TA request is needed
		if (
			sMode === "edit" &&
			oMetaData &&
			oMetaData.annotations &&
			oMetaData.annotations.valuelistType === "fixed-values"
		) {
			return;
		}

		if (
			oTextAnnotation &&
			(
				(oMetaData && oTextAnnotation.path === oMetaData.path) ||
				this.sBindingContextPath === "/undefined" ||
				!oSmartField._isValueInitial()
			)
		) {
			oTextAnnotation = null;
		}

		if (
			sTextInEditModeSource === TextInEditModeSource.ValueList ||
			(
				!oTextAnnotation &&
				sTextInEditModeSource === TextInEditModeSource.ValueListNoValidation &&
				this.oFactory._getDisplayBehaviourConfiguration() !== "idOnly"
			) ||
			this.oFactory._bTextInDisplayModeValueList
		) {
			var INNER_CONTROL_VALUE_PROP_MAP = "value",
				oModel = oSmartField.getModel(),
				oBindingContext = oSmartField.getBindingContext(),
				sPath = oSmartField.getBinding(INNER_CONTROL_VALUE_PROP_MAP).getPath(),
				vValue = oModel && oBindingContext && sPath && oModel.getProperty(sPath, oBindingContext);

			var oAdditionalFilters = this.getAdditionalFiltersData(oSmartField, oSmartField.getControlFactory().getMetaData(), {});
			var bTextArrangementLastReadFiltersDiff = this._mTextArrangementLastReadAdditionalFilters && !deepEqualUtil(this._mTextArrangementLastReadAdditionalFilters, oAdditionalFilters);

			if (((bTextArrangementLastReadFiltersDiff || this._sTextArrangementLastReadValue !== vValue || !this.oTextArrangementType) || bForceTextArrangementFetch)) {
				var aFilterFields = ["keyField"];

				var oSuccessSettings = {
					value: vValue,
					oldValue: vValue,
					initialRendering: true,
					mode: sMode
				};

				return this.fetchIDAndDescriptionCollection({
					value: vValue,
					filterFields: aFilterFields,
					updateBusyIndicator: false,
					success: this.onFetchIDAndDescriptionCollectionSuccess.bind(this, oSuccessSettings)
				});
			}
		}
	};

	TextArrangementDelegate.prototype.fetchIDAndDescriptionCollection = function(oSettings) {
		var vValue = oSettings.value;

		if (oSettings.bCheckValuesValidity) {
			oSettings.filterFields = ["keyField"];
		}

		var oInputField = this.oSmartField._oControl && this.oSmartField._oControl.edit;

		if (oInputField && oSettings.updateBusyIndicator) {
			oInputField.setBusyIndicatorDelay(300);
			oInputField.setBusy(true);
		}

		this.oSmartField._setValueInValidation(vValue);

		return this.readODataModel(oSettings).finally(function(){
			if (oInputField && oSettings.updateBusyIndicator) {
				// restore the busy and busy indicator delay states to the initial value
				oInputField.setBusyIndicatorDelay(0);
				oInputField.setBusy(false);
			}
		});
	};

	/**
	 * @private
	 * @return {Promise}
	 */
	TextArrangementDelegate.prototype.readODataModel = function(oSettings) {
			var oSmartField = this.oSmartField,
			sAbsolutePathToVLProperty,
			oVLEntitySelected,
			sFieldName,
			oAdditionalFilters,
			oCache,
			sTextInEditModeSource = oSmartField._getComputedTextInEditModeSource(),
			oMetadata = oSmartField.getControlFactory().getMetaData(),
			mTextArrangementPaths = TextArrangementDelegate.getPaths(
				this.oFactory._bTextInDisplayModeValueList ? TextInEditModeSource.ValueList : sTextInEditModeSource,
				oMetadata
			),
			sPath = "/" + mTextArrangementPaths.entitySetName,
			oValueListData = oMetadata &&
							oMetadata.annotations &&
							oMetadata.annotations.valueListData || null,
			sKeyField = mTextArrangementPaths.keyField,
			sDescriptionField = mTextArrangementPaths.descriptionField,
			oValueListProvider = this.oFactory && this.oFactory.getValueListProvider(),
			bIsValueListEntitySetRequested = oValueListData && oValueListData.valueListEntitySetName === mTextArrangementPaths.entitySetName,
			mOutParams = bIsValueListEntitySetRequested && oValueListData && oValueListData.outParams ? Object.values(oValueListData.outParams) : [],
			aAllFields = bIsValueListEntitySetRequested && oValueListData && oValueListData.fields ? oValueListData.fields : [],
			oDataModelReadSettings = {
				success: oSettings.success,
				error: oSettings.error
			};

		// BCP: 2080185890 If we cannot derive the description field we skip making the backend request as it would fail
		if (
			!sDescriptionField &&
			(
				// In display mode no validation call is needed
				this.oSmartField.getMode() === "display" ||
				// If we are not in ValueList validation mode - no exception
				!oSmartField._isValueListValidationMode()
			)
		) {
			return Promise.resolve();
		}

		this._sTextArrangementLastReadValue = oSettings.value;

		try {
			// Check if entity is selected from AutoSuggestions/ValueHelpDialog
			sAbsolutePathToVLProperty = this.getAbsolutePathToVLProperty();
			if (sAbsolutePathToVLProperty) {
				oVLEntitySelected = this.getSelectedEntity(sAbsolutePathToVLProperty);

				if (oVLEntitySelected) {
					this.clearAbsolutePathToVLProperty();
					oSettings.success(oVLEntitySelected);
					return Promise.resolve();
				}
			}

		} catch (oError) {
			return Promise.reject(oError);
		}

		// Check one time cache for data from selection - Suggestions/ValueHelpDialog
		oCache = this.getDataForNextDescriptionRequest(oSettings.value);
		if (
			oCache &&
			oCache.hasOwnProperty(sDescriptionField) &&
			oValueListProvider &&
			oValueListProvider._shouldHaveHistory &&
			!oValueListProvider._shouldHaveHistory()
		) {
			// Calling within setTimeout to match async behavior
			oSettings.success(oCache);
			return Promise.resolve();
		}

		// If the end-user has manually entered value
		oAdditionalFilters = this.getAdditionalFiltersData(oSmartField, oMetadata, oCache);

		var oFiltersSettings = {
			keyFieldPath: sKeyField,
			aFilterFields: oSettings.filterFields,
			valueListData: oValueListData
		};

		if (sDescriptionField) {
			oFiltersSettings.descriptionFieldPath = sDescriptionField;
		}

		for (sFieldName in oAdditionalFilters) {
			oSettings.filterFields.push(sFieldName);
		}

		oFiltersSettings.additionalFilters = oAdditionalFilters;

		var aFilters = this.getFilters(oSettings.value, oFiltersSettings);

		if (aFilters.length === 0) {
			return Promise.resolve();
		}

		var mUrlParameters = this.getUrlParameters({
			keyField: sKeyField,
			descriptionField: sDescriptionField,
			outParams: mOutParams,
			allFields: aAllFields
		});

		oDataModelReadSettings.filters = aFilters;
		oDataModelReadSettings.urlParameters = mUrlParameters;

		this._mTextArrangementLastReadAdditionalFilters = oAdditionalFilters;

		return oSmartField._getTextArrangementRead().read(oSmartField.getModel(), sPath, oDataModelReadSettings)
			.then(oSettings.success)
			.catch(oSettings.error);
	};

	TextArrangementDelegate.prototype.getSelectedEntity = function(sAbsolutePathToVLProperty) {
		return sAbsolutePathToVLProperty !== "" && this.oSmartField.getBindingContext().getProperty(sAbsolutePathToVLProperty);
	};

	TextArrangementDelegate.prototype.clearAbsolutePathToVLProperty = function() {
		this.sAbsolutePathToVLProperty = "";
	};

	TextArrangementDelegate.prototype.setAbsolutePathToVLProperty = function(sAbsolutePathToVLProperty) {
		this.sAbsolutePathToVLProperty = sAbsolutePathToVLProperty;
	};

	TextArrangementDelegate.prototype.getAbsolutePathToVLProperty = function() {
		return this.sAbsolutePathToVLProperty;
	};

	TextArrangementDelegate.prototype.getAdditionalFiltersData = function(oSmartField, oData, oSelectedEntity) {
		var mConstParams,
			mInParams,
			sConstFieldName,
			sInFieldName,
			sValueListFieldName,
			oAdditionalFilters = {};

		if (typeof oSelectedEntity === "undefined") {
			oSelectedEntity = {};
		}

		if (oData && oData.annotations && oData.annotations.valueListData) {
			mInParams = oData.annotations.valueListData.inParams;
			mConstParams = oData.annotations.valueListData.constParams;
		}

		if (mConstParams) {
			for (sConstFieldName in mConstParams) {
				oAdditionalFilters[sConstFieldName] = mConstParams[sConstFieldName];
			}
		}

		if (mInParams) {
			for (sInFieldName in mInParams) {
				sValueListFieldName = mInParams[sInFieldName];
				if (sValueListFieldName !== oData.annotations.valueListData.keyField) {
					oAdditionalFilters[sValueListFieldName] = oSelectedEntity[sValueListFieldName] !== undefined ? oSelectedEntity[sValueListFieldName] : oSmartField.getBindingContext().getProperty(sInFieldName);
				}
			}
		}

		return oAdditionalFilters;
	};

	TextArrangementDelegate.prototype._setBindingPath = function(oSmartField, aDataResults, sBindingProperty, oBindingControl) {
		var oODataModel = oSmartField.getModel(),
			bValueListNoValidation = oSmartField.getTextInEditModeSource() === "ValueListNoValidation" || oSmartField._getComputedTextInEditModeSource() === "ValueListNoValidation",
			vBindingContextPath;

		assert(Array.isArray(aDataResults), " - " + this.getMetadata().getName());

		if (oODataModel) {

			// We only consider textArrangement if we have only one result from the backend
			if (Array.isArray(aDataResults) && aDataResults.length === 1) {
				vBindingContextPath = oODataModel.getKey(aDataResults[0]);
			}

			if (bValueListNoValidation && aDataResults.length !== 1){
				this.sBindingContextPath = "/" + vBindingContextPath;
				this.bindPropertyForValueList(sBindingProperty, oBindingControl, true);
			} else if (typeof vBindingContextPath === "string") {
				this.sBindingContextPath = "/" + vBindingContextPath;
				this.bindPropertyForValueList(sBindingProperty, oBindingControl, false, bValueListNoValidation);
			}

		}
	};

	TextArrangementDelegate.prototype.onFetchIDAndDescriptionCollectionSuccess = function(oSettings, oData, oResponse) {
		var oOutputData,
			oValueListProvider,
			sMode,
			oInputField,
			oInputFieldBinding,
			oDisplayControl,
			aDataResults,
			oSmartField = this.oSmartField;

		// If the SmartField control is destroyed before this async callback is invoked.
		if (!oSmartField) {
			return;
		}

		sMode = oSettings.mode || oSmartField.getMode();
		oOutputData = oData && Array.isArray(oData.results) && oData.results.length === 1 ? oData.results[0] : null;
		oValueListProvider = oSmartField && oSmartField.getControlFactory() && oSmartField.getControlFactory().getValueListProvider() || null;
		oInputField = oSmartField._oControl.edit;
		oInputFieldBinding = oInputField && oInputField.getBinding("value");
		oDisplayControl = oSmartField._oControl.display;
		aDataResults = oData && oData.results === undefined ? [oData] : oData.results;

		if (oOutputData && oValueListProvider) {
			oValueListProvider._calculateAndSetODataModelOutputData(oOutputData);

			if (sMode === "edit" && !oSettings.initialRendering && oSmartField._getComputedTextInEditModeSource() !== TextInEditModeSource.NavigationProperty) {
				oValueListProvider._oHistoryValuesProvider && oValueListProvider._oHistoryValuesProvider.setFieldData([oOutputData]);
			}
		}

		if (!oSettings.initialRendering) { // Ignore model updates and initial rendering
			oSmartField.oValidation.handleValueListWarning(aDataResults);
		}

		if (typeof oSettings.success === "function") {
			oSettings.success(aDataResults);
		}

		if ((sMode === "display" || sMode === "display_uom") && oSettings.initialRendering) {
			this._setBindingPath(oSmartField, aDataResults, "text", oDisplayControl);
		}

		if (
			oInputFieldBinding &&
			sMode === "edit" &&
			oSmartField.isTextInEditModeSourceNotNone() // From display to edit mode with textInEditModeSource:None -> we should skip
		) {
			this._setBindingPath(oSmartField, aDataResults, "value", oInputField);
		}

		this.oSmartField._setValueInValidation(undefined);
	};

	TextArrangementDelegate.prototype.onFetchIDAndDescriptionCollectionError = function(oSettings, oError) {
		if (typeof oSettings.error === "function") {
			oSettings.error(oError);
		}

		this.oSmartField._setValueInValidation(undefined);
	};

	TextArrangementDelegate.prototype.bindPropertyForValueList = function(sProperty, oBindingControl, bSkipValidation, bValueListNoValidation) {
		var oSmartField = this.oSmartField,
			oSettings = {},
			oTextArrangementType,
			oBinding,
			oType,
			sTextInEditModeSource = oSmartField._getComputedTextInEditModeSource();

		if (
			sTextInEditModeSource === TextInEditModeSource.ValueList || sTextInEditModeSource === TextInEditModeSource.ValueListNoValidation ||
			this.oFactory._bTextInDisplayModeValueList
		) {
			oBinding = oBindingControl && oBindingControl.getBinding(sProperty);

			if (this.oFactory && oBinding) {
				oType = oBinding.getType();

				// In case improper type is set earlier - try to get the correct one
				if (
					(
						!oType || // We don't have no type
						!oType.isA("sap.ui.comp.smartfield.type.TextArrangement") // Or type is not TextArrangement type
					) &&
					this.oFactory._getTextArrangementType
				) {
					oTextArrangementType = this.oFactory._getTextArrangementType();
					if (oTextArrangementType) {
						oType = oTextArrangementType;
					}
				}

				if (oType) {
					oSettings = {type: oType};
				}

				oSettings.skipValidation = bSkipValidation;
				oSettings.bValueListNoValidation = bValueListNoValidation;
				oBindingControl.bindProperty(sProperty, this.getBindingInfo(oSettings));
			}
		}
	};

	TextArrangementDelegate.prototype.getUrlParameters = function(oSettings) {
		var aSelect = [oSettings.keyField];

		if (oSettings.descriptionField) {
			aSelect.push(oSettings.descriptionField);
		}

		oSettings.outParams.forEach(function(sOutParam){
			if (aSelect.indexOf(sOutParam) === -1) {
				aSelect.push(sOutParam);
			}
		});

		if (this.oSmartField._getComputedTextInEditModeSource() !== TextInEditModeSource.NavigationProperty) {
			aSelect = oSettings.allFields.map(function (oField) {
				return oField.name;
			});
		}

		return {
			"$select": aSelect.join(","),
			"$top": 2
		};
	};

	TextArrangementDelegate.prototype.getFilters = function(vValue, oSettings) {
		var aFilterFields = oSettings.aFilterFields,
			oAdditionalParamFilters;

		this.destroyFilters();

		if (Array.isArray(aFilterFields) && aFilterFields.length === 1) {

			switch (aFilterFields[0]) {
				case "keyField":
					this.oIDFilter = this.getIDFilter(vValue, oSettings);
					return this.oIDFilter ? [this.oIDFilter] : [];

				case "descriptionField":
					this.oDescriptionFilter = this.getDescriptionFilter(vValue, oSettings);
					return this.oDescriptionFilter ? [this.oDescriptionFilter] : [];

				// no default
			}
		}

		this.oIDFilter = this.getIDFilter(vValue, oSettings);

		if (!this.oIDFilter) {
			return [];
		}

		oAdditionalParamFilters = this._getAdditionalFilters(oSettings);

		this.oFilters = new Filter({
			and: true,
			filters: [
				new Filter({
					and:false,
					filters: [
						this.oIDFilter
					]
				})
			]
		});

		if (oAdditionalParamFilters.aFilters.length > 0) {
			this.oFilters.aFilters.push(oAdditionalParamFilters);
		}

		return [ this.oFilters ];
	};

	/**
	 * Sets data for the next description request in one time cache
	 * @param {string} sValue The value of the field which is used for key
	 * @param {object} oData The oData row
	 * @private
	 */
	TextArrangementDelegate.prototype.setDataForNextDescriptionRequest = function (sValue, oData) {
		this._mOneTimeDescriptionCache.set(sValue, oData);
	};

	/**
	 * Retrieves the data for the next description request from the one time cache. Once data for a key
	 * is retrieved it is removed from the cache.
	 * @param {string} sValue The value of the field which is used for key
	 * @returns {object} The cached oData row
	 * @private
	 */
	TextArrangementDelegate.prototype.getDataForNextDescriptionRequest = function (sValue) {
		var oData = this._mOneTimeDescriptionCache.get(sValue);
		this._mOneTimeDescriptionCache.delete(sValue); // One time cache
		return oData;
	};

	TextArrangementDelegate.prototype.getIDFilter = function(vValue, oSettings) {
		var bKeyInitialValueIsSignificant,
			oValueListData = oSettings.valueListData,
			sFieldName = oSettings.keyFieldPath,
			aVLFields = oValueListData && oValueListData.fields,
			oFieldMetadata = aVLFields && aVLFields.find(function (oField) {
				return oField.name === sFieldName;
			}),
			bIsNullable = oFieldMetadata && oFieldMetadata.nullable === "false";

		if (vValue === null || vValue === undefined || vValue === "") {
			bKeyInitialValueIsSignificant =  oValueListData && oValueListData.aInitialValueIsSignificantFields && oValueListData.aInitialValueIsSignificantFields.indexOf(sFieldName) !== -1;
			if (bKeyInitialValueIsSignificant) {
				return this._generateFiltersForEmptyField(sFieldName, bIsNullable);
			}
		} else {
			return new Filter({
				value1: vValue,
				path: sFieldName,
				operator: FilterOperator.EQ
			});
		}
	};

	TextArrangementDelegate.prototype.getDescriptionFilter = function(vValue, oSettings) {
		return new Filter({
			value1: vValue,
			path: oSettings.descriptionFieldPath,
			operator: FilterOperator.Contains
		});
	};

	TextArrangementDelegate.prototype._getAdditionalFilters = function (oSettings) {
		var aFilters = [],
			oValueListData = oSettings.valueListData,
			aVLFields = oValueListData && oValueListData.fields;

		Object.keys(oSettings.additionalFilters).forEach(function (sFieldName) {
			var vFieldValue = oSettings.additionalFilters[sFieldName],
				oFieldMetadata = aVLFields.find(function (oField) {
					return oField.name === sFieldName;
				}),
				bInitialValueIsSignificant = oValueListData && oValueListData.aInitialValueIsSignificantFields && oValueListData.aInitialValueIsSignificantFields.indexOf(sFieldName) !== -1,
				aGeneratedFilters = this._generateFiltersForField(vFieldValue, sFieldName, oFieldMetadata, bInitialValueIsSignificant);

			if (aGeneratedFilters) {
				aFilters.push(aGeneratedFilters);
			}
		}.bind(this));

		return new Filter({
			and: true,
			filters: aFilters
		});
	};

	/**
	 * Generates needed filters for specific filter value
	 * @returns {sap.ui.model.Filter|undefined}
	 * @private
	 */
	TextArrangementDelegate.prototype._generateFiltersForField = function (vValue, sFieldName, oFieldMetadata, bInitialValueIsSignificant) {
		if (vValue === null || vValue === undefined || vValue === "") {
			// If InitialValueIsSignificant annotation is not present and the value is initial we don't generate filters
			if (bInitialValueIsSignificant) {
				// Special handling for empty value additional parameters
				// If vValue is null or empty we might have to generate different filters
				return this._generateFiltersForEmptyField(sFieldName, (oFieldMetadata && oFieldMetadata.nullable === "false"));
			}
		} else {
			// This is the standard scenario where we have a value
			return new Filter({
				value1: vValue,
				path: sFieldName,
				operator: FilterOperator.EQ
			});
		}
	};

	/**
	 * Generate filter for empty ValueListParameterIn field.
	 * @returns {sap.ui.model.Filter}
	 * @private
	 */
	TextArrangementDelegate.prototype._generateFiltersForEmptyField = function (sFieldName, bNotNullable) {
		// For nullable=false field we only filter for initial value -> empty string
		// we should not send null to the backend in this case.
		if (bNotNullable) {
			return new Filter({
				value1: "",
				path: sFieldName,
				operator: FilterOperator.EQ
			});
		}

		// For nullable=true fields we have to filter for both initial value and null
		// as the UI does not distinguish by these two values and they are both
		// valid for empty Edm.String property in the backend.
		return new Filter([
				new Filter({
					value1: "",
					path: sFieldName,
					operator: FilterOperator.EQ
				}),
				new Filter({
					value1: null,
					path: sFieldName,
					operator: FilterOperator.EQ
				})
			],
			false
		);
	};

	TextArrangementDelegate.prototype.destroyFilters = function() {

		if (this.oIDFilter) {
			this.oIDFilter.destroy();
			this.oIDFilter = null;
		}

		if (this.oDescriptionFilter) {
			this.oDescriptionFilter.destroy();
			this.oDescriptionFilter = null;
		}

		if (this.oFilters) {
			this.oFilters.destroy();
			this.oFilters = null;
		}
	};

	TextArrangementDelegate.prototype.destroy = function() {
		this.oSmartField = null;
		this.bValidMetadata = false;
		this.sBindingContextPath = "";
		this.sAbsolutePathToVLProperty = "";
		this._mOneTimeDescriptionCache = null;
		this._mTextArrangementLastReadAdditionalFilters = null;
		this.destroyFilters();
	};

	return TextArrangementDelegate;
});
