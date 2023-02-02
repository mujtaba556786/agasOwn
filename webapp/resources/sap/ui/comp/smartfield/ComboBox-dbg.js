/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */

sap.ui.define([
	"sap/ui/comp/library",
		"sap/m/ComboBox",
		"sap/m/ComboBoxRenderer"
	],
	function(
		library,
		BaseComboBox,
		ComboBoxRenderer
	) {
	"use strict";

	var sDefaultGUID = "00000000-0000-0000-0000-000000000000";
	function isDefaultGUID(sValue){
		return sValue === sDefaultGUID;
	}
	/**
	 * Constructor for a new <code>SmartField/ComboBox</code>.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * @class Extends the functionalities in sap.m.ComboBox
	 * @extends sap.m.ComboBox
	 * @constructor
	 * @protected
	 * @alias sap.ui.comp.smartfield.ComboBox
	 */
	var ComboBox = BaseComboBox.extend("sap.ui.comp.smartfield.ComboBox",
	{
		metadata: {

			library: "sap.ui.comp",
			properties: {
				enteredValue: {
					type: "string",
					group: "Data",
					defaultValue: ""
				},
				/**
				 * Property works the same as sap.m.Input control <code>value</code>
				 */
				realValue: {
					type: "string",
					group: "Data",
					defaultValue: ""
				}
			}
		},
		renderer: ComboBoxRenderer
	 });

	ComboBox.prototype.init = function () {
		BaseComboBox.prototype.init.apply(this, arguments);

		this.attachChange(function () {
			var sSelectedKey = this.getSelectedKey(),
				aKeys = this.getKeys(),
				oSelectedItem = this.getSelectedItem(),
				bHasSelectedKey = sSelectedKey || (sSelectedKey === "" && oSelectedItem && aKeys.indexOf(sSelectedKey) !== -1),
				sValue = bHasSelectedKey  ? sSelectedKey : this.getValue();

			this.setProperty("realValue", sValue);
		}.bind(this));
	};

	ComboBox.prototype.setRealValue = function (sValue) {
		this.setValue(sValue);
		this.setSelectedKey(sValue);

		return this.setProperty("realValue", sValue);
	};

	ComboBox.prototype.setEnteredValue = function (sValue) {
		if (typeof sValue !== "undefined") {
			this.setSelectedKey(sValue);
		}

		var oSelectedItem = this.getSelectedItem();

		if (sValue && !oSelectedItem && !isDefaultGUID(sValue)) {
			this.setValue(sValue);
		}
		var sEnteredValue = oSelectedItem ? this.getSelectedKey() : this.getValue();

		this.setProperty("enteredValue", sEnteredValue);

		return this;
	};

	/**
	 * We extend the logical expression to consider if keys array contains key with empty string
	 * @inheritDoc
	 */
	ComboBox.prototype.synchronizeSelection = function() {

		if (this.isSelectionSynchronized()) {
			return;
		}

		var sKey = this.getSelectedKey(),
			aKeys = this.getKeys(),
			vItem = this.getItemByKey("" + sKey);

		if (vItem && (sKey !== "" || aKeys.indexOf(sKey) !== -1) && sKey === this.getValue()) {
			this.setAssociation("selectedItem", vItem, true);
			this._setPropertyProtected("selectedItemId", vItem.getId(), true);

			this.setProperty("enteredValue", sKey);
			this.setProperty("realValue", sKey);
			this.setValue(vItem.getText());
			this._sValue = this.getValue();
		}
	};

	return ComboBox;

});
