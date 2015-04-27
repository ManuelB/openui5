/*!
 * ${copyright}
 */
sap.ui.define(['jquery.sap.global', './ComboBoxBaseRenderer', 'sap/ui/core/Renderer'],
	function(jQuery, ComboBoxBaseRenderer, Renderer) {
		"use strict";

		/**
		 * ComboBox renderer.
		 *
		 * @namespace
		 */
		var ComboBoxRenderer = Renderer.extend(sap.m.ComboBoxBaseRenderer);

		/**
		 * CSS class to be applied to the root element of the ComboBox.
		 *
		 * @readonly
		 * @const {string}
		 */
		ComboBoxRenderer.CSS_CLASS = "sapMComboBox";

		/**
		 * Add classes to the ComboBox.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
		 */
		ComboBoxRenderer.addOuterClasses = function(oRm, oControl) {
			var CSS_CLASS = ComboBoxRenderer.CSS_CLASS,
				sValueState = oControl.getValueState();

			sap.m.ComboBoxBaseRenderer.addOuterClasses.apply(this, arguments);
			oRm.addClass(CSS_CLASS);
			oRm.addClass(CSS_CLASS + "Input");

			if (sValueState !== sap.ui.core.ValueState.None) {
				oRm.addClass(CSS_CLASS + "State");
				oRm.addClass(CSS_CLASS + sValueState);
			}
		};

		/**
		 * Add inner classes to the ComboBox's input element.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
		 */
		ComboBoxRenderer.addInnerClasses = function(oRm, oControl) {
			sap.m.ComboBoxBaseRenderer.addInnerClasses.apply(this, arguments);
			oRm.addClass(ComboBoxRenderer.CSS_CLASS + "InputInner");
		};

		/**
		 * Add CSS classes to the combo box arrow button, using the provided {@link sap.ui.core.RenderManager}.
		 * To be overwritten by subclasses.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
		 */
		ComboBoxRenderer.addButtonClasses = function(oRm, oControl) {
			sap.m.ComboBoxBaseRenderer.addButtonClasses.apply(this, arguments);
			oRm.addClass(ComboBoxRenderer.CSS_CLASS + "Arrow");
		};

		return ComboBoxRenderer;

	}, /* bExport= */ true);