sap.ui.define(['sap/ui/core/UIComponent'], function(UIComponent) {
	"use strict";

	var Component = UIComponent.extend("sap.m.sample.GenericTileAsMonitorTile.Component", {
		metadata : {
			rootView : {
				"viewName": "sap.m.sample.GenericTileAsMonitorTile.Page",
				"type": "XML",
				"async": true
			},
			dependencies : {
				libs : ["sap.m"]
			},
			includes : [ "style.css" ],
			config : {
				sample : {
					files : ["Page.view.xml", "Page.controller.js", "style.css"]
				}
			}
		}
	});
	return Component;
});