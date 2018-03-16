/*!
 * ${copyright}
 */

sap.ui.define(['sap/ui/core/ValueStateSupport', 'sap/ui/core/library', 'sap/ui/Device'],
	function(ValueStateSupport, coreLibrary, Device) {
	"use strict";


	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;


	/**
	 * RadioButton renderer.
	 * @namespace
	 */
	var RadioButtonRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oRadioButton an object representation of the control that should be rendered
	 */
	RadioButtonRenderer.render = function(oRm, oRadioButton) {
		// get control properties
		var sId = oRadioButton.getId();
		var bEnabled = oRadioButton.getEnabled();
		var bEditable = oRadioButton.getEditable();
		var bReadOnly = !bEnabled || !bEditable;
		var bInErrorState = ValueState.Error == oRadioButton.getValueState();
		var bInWarningState = ValueState.Warning == oRadioButton.getValueState();
		var bUseEntireWidth = oRadioButton.getUseEntireWidth();

		// Radio Button style class
		oRm.addClass("sapMRb");

		// write the HTML into the render manager
		oRm.write("<div"); // Control - DIV
		oRm.writeControlData(oRadioButton);

		if (bUseEntireWidth) {
			oRm.addStyle("width", oRadioButton.getWidth());
			oRm.writeStyles();
		}

		var sTooltipWithStateMessage = ValueStateSupport.enrichTooltip(oRadioButton, oRadioButton.getTooltip_AsString());
		if (sTooltipWithStateMessage) {
			oRm.writeAttributeEscaped("title", sTooltipWithStateMessage);
		}

		// ARIA
		oRm.writeAccessibilityState(oRadioButton, {
			role: "radio",
			selected: null, // Avoid output aria-selected
			checked: oRadioButton.getSelected() === true ? true : undefined, // aria-checked=false is default value and must not be set explicitly
			disabled: !oRadioButton.getEditable() ? true : undefined, // Avoid output aria-disabled=false when the button is editable
			labelledby: { value: sId + "-label", append: true },
			describedby: { value: (sTooltipWithStateMessage ? sId + "-Descr" : undefined), append: true }
		});

		// Add classes and properties depending on the state
		if (oRadioButton.getSelected()) {
			oRm.addClass("sapMRbSel");
		}

		if (!bEnabled) {
			oRm.addClass("sapMRbDis");
		}

		if (!bEditable) {
			oRm.addClass("sapMRbRo");
		}

		if (bInErrorState) {
			oRm.addClass("sapMRbErr");
		}

		if (bInWarningState) {
			oRm.addClass("sapMRbWarn");
		}

		oRm.writeClasses();

		if (bEnabled) {
			oRm.writeAttribute("tabindex", oRadioButton.hasOwnProperty("_iTabIndex") ? oRadioButton._iTabIndex : 0);
		}

		oRm.write(">"); // DIV element

		oRm.write("<div class='sapMRbB'");

		oRm.write(">");

		oRm.write("<div");
		oRm.addClass("sapMRbBOut");

		//set an id on this this to be able to focus it, on ApplyFocusInfo (rerenderAllUiAreas)
		oRm.writeAttribute("id", sId + "-Button");

		if (!bReadOnly && Device.system.desktop) {
			oRm.addClass("sapMRbHoverable");
		}

		oRm.writeClasses();
		oRm.write(">"); // DIV element
		oRm.write("<div");
		oRm.addClass("sapMRbBInn");
		oRm.writeClasses();
		oRm.write(">"); // DIV element

		// Write the real - potentially hidden - HTML RadioButton element
		oRm.write("<input type='radio' tabindex='-1'");
		oRm.writeAttribute("id", sId + "-RB");
		oRm.writeAttributeEscaped("name", oRadioButton.getGroupName());
		if (oRadioButton.getSelected()) {
			oRm.writeAttribute("checked", "checked");
		}

		if (bReadOnly) {
			oRm.writeAttribute("readonly", "readonly");
			oRm.writeAttribute("disabled", "disabled");
		}

		oRm.write(" />"); // Close RadioButton-input-element

		oRm.write("</div></div>"); // Control - DIVs close

		oRm.write("</div>");
		oRm.renderControl(oRadioButton._oLabel);

		if (sTooltipWithStateMessage && sap.ui.getCore().getConfiguration().getAccessibility()) {
			// for ARIA, the tooltip must be in a separate SPAN and assigned via aria-describedby.
			// otherwise, JAWS does not read it.
			oRm.write("<span id=\"" + sId + "-Descr\" style=\"display: none;\">");
			oRm.writeEscaped(sTooltipWithStateMessage);
			oRm.write("</span>");
		}
		oRm.write("</div>"); // Control - DIVs close
	};

	return RadioButtonRenderer;

}, /* bExport= */ true);
