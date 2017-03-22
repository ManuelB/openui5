sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = UIComponent.extend("sap.m.sample.Feed.Component", {

		metadata : {
			rootView : "sap.m.sample.Feed.V",
			dependencies : {
				libs : [
					"sap.m"
				]
			},
			config : {
				sample : {
					files : [
						"V.view.xml",
						"C.controller.js",
						"feed.json"
					]
				}
			}
		}
	});

	return Component;

});
