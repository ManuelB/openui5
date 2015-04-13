/* global module start test asyncTest expect ok equal deepEqual */

sinon.config.useFakeTimers = false;

/* eslint-disable no-unused-vars */
function runODataAnnotationTests() {
/* eslint-enable no-unused-vars */
"use strict";

	var aServices = [{
		name             : "Northwind",
		service          : "fakeService://testdata/odata/northwind/",
		annotations      : "fakeService://testdata/odata/northwind-annotations-normal.xml",
		serviceValid     : true,
		annotationsValid : "all"
	}, {
		name             : "Northwind",
		service          : "fakeService://testdata/odata/northwind/",
		annotations      : "fakeService://testdata/odata/northwind-annotations-malformed.xml",
		serviceValid     : true,
		annotationsValid : "none"
	}, {
		name             : "Northwind",
		service          : "fakeService://testdata/odata/northwind/",
		annotations      : "fakeService://testdata/odata/NOT_EXISTANT",
		serviceValid     : true,
		annotationsValid : "none"
	},{
		name             : "Invalid",
		service          : "fakeService://testdata/odata/NOT_EXISTANT/",
		annotations      : "fakeService://testdata/odata/NOT_EXISTANT",
		serviceValid     : false,
		annotationsValid : "none"
	},{
		name             : "Complex EPM",
		service          : "fakeService://testdata/odata/northwind/",
		annotations      : "fakeService://testdata/odata/epm-annotations-complex.xml",
		serviceValid     : true,
		annotationsValid : "all"
	},{
		name             : "Northwind",
		service          : "fakeService://testdata/odata/northwind/",
		annotations      : "fakeService://testdata/odata/northwind-annotations-normal.xml",
		serviceValid     : true,
		annotationsValid : "all",
		sharedMetadata   : true
	}, {
		name             : "Northwind",
		service          : "fakeService://testdata/odata/northwind/",
		annotations      : "fakeService://testdata/odata/northwind-annotations-malformed.xml",
		serviceValid     : true,
		annotationsValid : "none",
		sharedMetadata   : true
	}, {
		name             : "Northwind",
		service          : "fakeService://testdata/odata/northwind/",
		annotations      : "fakeService://testdata/odata/NOT_EXISTANT",
		serviceValid     : true,
		annotationsValid : "none",
		sharedMetadata   : true
	},{
		name             : "Invalid",
		service          : "fakeService://testdata/odata/NOT_EXISTANT/",
		annotations      : "fakeService://testdata/odata/NOT_EXISTANT",
		serviceValid     : false,
		annotationsValid : "none",
		sharedMetadata   : true
	},{
		name             : "Northwind with annotated metadata",
		service          : "fakeService://testdata/odata/northwind-annotated/",
		annotations      : "fakeService://testdata/odata/northwind-annotated/$metadata",
		serviceValid     : true,
		annotationsValid : "all",
		sharedMetadata   : true
	},{
		name             : "Northwind with annotated metadata + annotations",
		service          : "fakeService://testdata/odata/northwind-annotated/",
		annotations      : [ 
			"fakeService://testdata/odata/northwind-annotated/$metadata",
			"fakeService://testdata/odata/northwind-annotations-normal.xml"
		],
		serviceValid     : true,
		annotationsValid : "some",
		sharedMetadata   : true
	},{
		name             : "Northwind with annotated metadata + annotations",
		service          : "fakeService://testdata/odata/northwind-annotated/",
		annotations      : [ 
			"fakeService://testdata/odata/northwind-annotated/$metadata",
			"fakeService://testdata/odata/northwind-annotations-malformed.xml"
		],
		serviceValid     : true,
		annotationsValid : "some",
		sharedMetadata   : true
	}];

	// Additional tests that have extra tests and should thus be referable by name. For this the name
	// of the test is not added as property of the test but as key in the map
	var mAdditionalTestsServices = {
		"Test 2014-12-08": {
			service          : "fakeService://testdata/odata/northwind/",
			annotations      : "fakeService://testdata/odata/2014-12-08-test.xml",
			serviceValid     : true,
			annotationsValid : "all"
		},
		"Multiple Property Annotations": {
			service          : "fakeService://testdata/odata/northwind/",
			annotations      : "fakeService://testdata/odata/multiple-property-annotations.xml",
			serviceValid     : true,
			annotationsValid : "all"
		},
		"Property Annotation Qualifiers": {
			service          : "fakeService://testdata/odata/northwind/",
			annotations      : "fakeService://testdata/odata/property-annotation-qualifiers.xml",
			serviceValid     : true,
			annotationsValid : "all"
		},
		"Other Property Values": {
			service          : "fakeService://testdata/odata/northwind/",
			annotations      : "fakeService://testdata/odata/other-property-values.xml",
			serviceValid     : true,
			annotationsValid : "all"
		},
		"Aliases in Namespaces": {
			service          : "fakeService://testdata/odata/northwind/",
			annotations      : "fakeService://testdata/odata/namespaces-aliases.xml",
			serviceValid     : true,
			annotationsValid : "all"
		},
		"Namespaces in Other Property Values": {
			service          : "fakeService://testdata/odata/northwind/",
			annotations      : "fakeService://testdata/odata/other-property-value-aliases.xml",
			serviceValid     : true,
			annotationsValid : "all"
		},
		"Text Properties" : {
			service          : "fakeService://testdata/odata/northwind/",
			annotations      : "fakeService://testdata/odata/other-property-textproperties.xml",
			serviceValid     : true,
			annotationsValid : "all"
		},
		"Entity Containers": {
			service          : "fakeService://testdata/odata/sapdata01/",
			annotations      : "fakeService://testdata/odata/sapdata01/$metadata",
			serviceValid     : true,
			annotationsValid : "all"
		},
		"Simple Values": {
			service          : "fakeService://testdata/odata/sapdata01/",
			annotations      : "fakeService://testdata/odata/simple-values.xml",
			serviceValid     : true,
			annotationsValid : "all"
		},
		"Collection with Namespace": {
			service          : "fakeService://testdata/odata/sapdata01/",
			annotations      : "fakeService://testdata/odata/collection-with-namespace.xml",
			serviceValid     : true,
			annotationsValid : "all"
		},
		"UrlRef": {
			service          : "fakeService://testdata/odata/sapdata01/",
			annotations      : "fakeService://testdata/odata/UrlRef.xml",
			serviceValid     : true,
			annotationsValid : "all"
		},
		"Delayed Loading": {
			service          : "fakeService://testdata/odata/sapdata01/",
			annotations      : [
				"fakeService://testdata/odata/multiple-annotations-01.xml",
				"fakeService://testdata/odata/multiple-annotations-02.xml",
				"fakeService://testdata/odata/multiple-annotations-03.xml"
			],
			serviceValid     : true,
			annotationsValid : "all"
		},
		"Alias Replacement": {
			service          : "fakeService://testdata/odata/sapdata01/",
			annotations      : "fakeService://testdata/odata/Aliases.xml",
			serviceValid     : true,
			annotationsValid : "all"
		},
	};


	// Add additional tests to stadard tests as well
	for (var sName in mAdditionalTestsServices) {
		var mTest = mAdditionalTestsServices[sName];
		mTest.name = sName;
		aServices.push(mTest);
	}

	var 
		sTestName, sServiceURI, mModelOptions, bServiceValid, bAnnotationsValid, sAnnotationsValid, bSharedMetadata,
		sTestType, fnTest, mService, oAnnotations, i;

	sap.ui.test.qunit.delayTestStart();

	module("Synchronous loading");

	fnTest = function(sServiceURI, mModelOptions, bServiceValid, sAnnotationsValid, bSharedMetadata) {
		return function() {
			if (!bSharedMetadata){
				sap.ui.model.odata.ODataModel.mServiceData = {};
			}
			var oModel = new sap.ui.model.odata.ODataModel(sServiceURI, mModelOptions);
			// Since this is synchronous, everything should be ready right now.

			var oMetadata = oModel.getServiceMetadata();
			var oAnnotations = oModel.getServiceAnnotations();

			if (bServiceValid) {
				if (sAnnotationsValid === "all" || sAnnotationsValid === "some") {
					// This should have worked.
					ok(oMetadata, "Metadata is available.");
					ok(Object.keys(oAnnotations).length > 0, "Annotations are available.");
				} else {
					// Service Metadata should be there, annotations should not be loaded
					ok(oMetadata, "Metadata is available.");
					ok(Object.keys(oAnnotations).length === 0, "Annotations are not available.");
				}
			} else {
				// Service is invalid, so both should not be there
				ok(!oMetadata, "Metadata is not available.");
				ok(Object.keys(oAnnotations).length === 0, "Metadata is not available.");
			}
		};
	};

	for (i = 0; i < aServices.length; ++i) {
		sServiceURI = aServices[i].service;
		mModelOptions = {
			annotationURI : aServices[i].annotations,
			json : true
		};
		bServiceValid     = aServices[i].serviceValid;
		sAnnotationsValid = aServices[i].annotationsValid;
		bAnnotationsValid = sAnnotationsValid === "all" || sAnnotationsValid === "some";
		bSharedMetadata = aServices[i].sharedMetadata;
		sTestName = aServices[i].name ? aServices[i].name : "";

		sTestType = 
			sTestName + " (" + 
			(bServiceValid ? "Valid Service" : "Broken Service") + "/" + 
			(bAnnotationsValid ? "Valid Annotations (" + sAnnotationsValid + ")" : "Broken Annotations") +
			(bSharedMetadata ?  "/Shared Metadata" : "") + 
			")";

		// Check synchronous loading
		mModelOptions.loadAnnotationsJoined = false;
		mModelOptions.loadMetadataAsync = false;

		// FIXME: test doesn't work in headless PhantomJS test cycle => commented out!
		//  ==> PhantomJS doesn't fail when loading malformed XML!
		if (!sap.ui.Device.browser.phantomJS || (bServiceValid && bAnnotationsValid)) {
			test(sTestType, fnTest(sServiceURI, mModelOptions, bServiceValid, sAnnotationsValid));
		}
	}

	module("Asynchronous loading");

	fnTest = function(sServiceURI, mModelOptions, bServiceValid, sAnnotationsValid, bSharedMetadata) {
		return function() {
			if (!bSharedMetadata){
				sap.ui.model.odata.ODataModel.mServiceData = {};
			}
			var oModel = new sap.ui.model.odata.ODataModel(sServiceURI, mModelOptions);

			var bMetadataLoaded = false;
			var bAnnotationsLoaded = false;

			var fnOnLoaded = function(sWhat) {

				switch (sWhat) {

					case "Metadata":
						ok(bMetadataLoaded, "Metadata loaded successfully");
						jQuery.sap.log.debug("check for metadata");
					break;

					case "Annotations":
						ok(bAnnotationsLoaded, "Annotations loaded successfully");
					break;

					case "Both":
						ok(bMetadataLoaded && bAnnotationsLoaded, "Check: Annotations and Metadata loaded");
						jQuery.sap.log.debug("check for both");
						start();
					break;

					case "MetadataFailed": 
						// Nothing should be loaded
						ok(!bServiceValid && !bAnnotationsLoaded, "Check: Invalid Service - Annotations and Metadata NOT loaded");
						jQuery.sap.log.debug("check for none");
						start();
					break;

					case "AnnotationsFailed":
						// Metadata should be loaded, but no annotations
						if (sAnnotationsValid === "none") {
						ok(bMetadataLoaded && !bAnnotationsLoaded, "Check: Invalid Annotations - Only Metadata loaded");
						} else {
							ok(bMetadataLoaded, "Check: Invalid Annotations - Metadata loaded");
						}
						jQuery.sap.log.debug("check for no annotations");
						start();
					break;

					default:
						throw "This is unexpected and should never happen...";

				}
			};

			/* eslint-disable new-cap */
			var metadataDfd = jQuery.Deferred();
			var annotationsDfd = jQuery.Deferred();
			/* eslint-enable new-cap */

			// Metadata must be loaded before annotations
			oModel.attachMetadataLoaded(function() {
				bMetadataLoaded = true;
				jQuery.sap.log.debug("metadata loaded is fired");
				fnOnLoaded("Metadata");
				metadataDfd.resolve();
			});

			oModel.attachAnnotationsLoaded(function() {
				bAnnotationsLoaded = true;
				jQuery.sap.log.debug("annotations loaded is fired");
				fnOnLoaded("Annotations");
				annotationsDfd.resolve();
			});

			oModel.attachMetadataFailed(function() {
				jQuery.sap.log.debug("metadata failed is fired");
				metadataDfd.reject();
			});

			if (bServiceValid && (sAnnotationsValid === "some" || sAnnotationsValid === "all")) {
				jQuery.when(metadataDfd, annotationsDfd).done(function(e){
						jQuery.sap.log.debug("both promises fulfilled");
						fnOnLoaded("Both");
					}).fail(function(e){
						jQuery.sap.log.debug("metadata promise failed");
						ok(false, 'Metadata promise rejected');
					}); 
			} else if (bServiceValid && sAnnotationsValid === "none"){
				jQuery.when(metadataDfd).done(function(e){
					jQuery.sap.log.debug("metadata promise fulfilled");
					//make sure annotations really don't load an we're not just too quick
					window.setTimeout(function() {
						fnOnLoaded("AnnotationsFailed");
					}, 50);
				});
			} else if (!bServiceValid){
				jQuery.when(metadataDfd).fail(function(e){
					jQuery.sap.log.debug("metadata failed fulfilled");
					fnOnLoaded("MetadataFailed");
				});
			}
		};
	};

	for (i = 0; i < aServices.length; ++i) {

		mService = 	aServices[i];

		sServiceURI = mService.service;
		mModelOptions = {
			annotationURI : mService.annotations,
			json : true
		};
		bServiceValid     = mService.serviceValid;
		sAnnotationsValid = aServices[i].annotationsValid;
		bAnnotationsValid = sAnnotationsValid === "all" || sAnnotationsValid === "some";
		bSharedMetadata = mService.sharedMetadata;
		sTestName = aServices[i].name ? aServices[i].name : "";

		// Check asynchronous loading
		mModelOptions.loadAnnotationsJoined = false;
		mModelOptions.loadMetadataAsync = true;
	
		sTestType = 
			sTestName + " (" + 
			(bServiceValid ? "Valid Service" : "Broken Service") + "/" + 
			(bAnnotationsValid ? "Valid Annotations (" + sAnnotationsValid + ")" : "Broken Annotations") +
			(bSharedMetadata ?  "/Shared Metadata" : "") + 
			")";

		jQuery.sap.log.debug("testtype: " + sTestType);

		// FIXME: test doesn't work in headless PhantomJS test cycle => commented out!
		//  ==> PhantomJS doesn't fail when loading malformed XML!
		if (!sap.ui.Device.browser.phantomJS || (bServiceValid && bAnnotationsValid)) {
			asyncTest(
				"Asynchronous loading - " + sTestType,
				fnTest(sServiceURI, mModelOptions, bServiceValid, sAnnotationsValid)
			);
		}
	}

	module("V2: Asynchronous loading");

	fnTest = function(sServiceURI, mModelOptions, bServiceValid, sAnnotationsValid, bSharedMetadata) {
		return function() {
			if (!bSharedMetadata){
				sap.ui.model.odata.v2.ODataModel.mServiceData = {};
			}
			var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceURI, mModelOptions);

			var bMetadataLoaded = false;
			var bAnnotationsLoaded = false;

			var fnOnLoaded = function(sWhat) {

				switch (sWhat) {

					case "Metadata":
						ok(bMetadataLoaded, "Metadata loaded successfully");
						jQuery.sap.log.debug("check for metadata");
					break;

					case "Annotations":
						ok(bAnnotationsLoaded, "Annotations loaded successfully");
					break;

					case "Both":
						ok(bMetadataLoaded && bAnnotationsLoaded, "Check: Annotations and Metadata loaded");
						jQuery.sap.log.debug("check for both");
						start();
					break;

					case "MetadataFailed": 
						// Nothing should be loaded
						ok(!bServiceValid && !bAnnotationsLoaded, "Check: Invalid Service - Annotations and Metadata NOT loaded");
						jQuery.sap.log.debug("check for none");
						start();
					break;

					case "AnnotationsFailed":
						// Metadata should be loaded, but no annotations
						if (sAnnotationsValid === "none") {
						ok(bMetadataLoaded && !bAnnotationsLoaded, "Check: Invalid Annotations - Only Metadata loaded");
						} else {
							ok(bMetadataLoaded, "Check: Invalid Annotations - Metadata loaded");
						}
						jQuery.sap.log.debug("check for no annotations");
						start();
					break;

					default:
						throw "This is unexpected and should never happen...";

				}
			};

			/* eslint-disable new-cap */
			var metadataDfd = jQuery.Deferred();
			var annotationsDfd = jQuery.Deferred();
			/* eslint-enable new-cap */

			// Metadata must be loaded before annotations
			oModel.attachMetadataLoaded(function() {
				bMetadataLoaded = true;
				jQuery.sap.log.debug("metadata loaded is fired");
				fnOnLoaded("Metadata");
				metadataDfd.resolve();
			});

			oModel.attachAnnotationsLoaded(function() {
				bAnnotationsLoaded = true;
				jQuery.sap.log.debug("annotations loaded is fired");
				fnOnLoaded("Annotations");
				annotationsDfd.resolve();
			});

			oModel.attachMetadataFailed(function() {
				jQuery.sap.log.debug("metadata failed is fired");
				metadataDfd.reject();
			});

			if (bServiceValid && (sAnnotationsValid === "some" || sAnnotationsValid === "all")) {
				jQuery.when(metadataDfd, annotationsDfd).done(function(e){
						jQuery.sap.log.debug("both promises fulfilled");
						fnOnLoaded("Both");
					}).fail(function(e){
						jQuery.sap.log.debug("metadata promise failed");
						ok(false, 'Metadata promise rejected');
					});
			} else if (bServiceValid && sAnnotationsValid === "none"){
				jQuery.when(metadataDfd).done(function(e){
					jQuery.sap.log.debug("metadata promise fulfilled");
					//make sure annotations really don't load an we're not just too quick
					window.setTimeout(function() {
						fnOnLoaded("AnnotationsFailed");
					}, 50);
				});
			} else if (!bServiceValid){
				jQuery.when(metadataDfd).fail(function(e){
					jQuery.sap.log.debug("metadata failed fulfilled");
					fnOnLoaded("MetadataFailed");
				});
			}
		};
	};

	for (i = 0; i < aServices.length; ++i) {

		mService = 	aServices[i];

		sServiceURI = mService.service;
		mModelOptions = {
			annotationURI : mService.annotations,
			json : true
		};
		bServiceValid     = mService.serviceValid;
		sAnnotationsValid = aServices[i].annotationsValid;
		bAnnotationsValid = sAnnotationsValid === "all" || sAnnotationsValid === "some";
		bSharedMetadata = mService.sharedMetadata;
		sTestName = aServices[i].name ? aServices[i].name : "";

		// Check asynchronous loading
		mModelOptions.loadAnnotationsJoined = false;
		mModelOptions.loadMetadataAsync = true;

		sTestType =
			sTestName + " (" +
			(bServiceValid ? "Valid Service" : "Broken Service") + "/" +
			(bAnnotationsValid ? "Valid Annotations (" + sAnnotationsValid + ")" : "Broken Annotations") +
			(bSharedMetadata ?  "/Shared Metadata" : "") +
			")";

		jQuery.sap.log.debug("testtype: " + sTestType);

		// FIXME: test doesn't work in headless PhantomJS test cycle => commented out!
		//  ==> PhantomJS doesn't fail when loading malformed XML!
		if (!sap.ui.Device.browser.phantomJS || (bServiceValid && bAnnotationsValid)) {
			asyncTest(
				"Asynchronous loading - " + sTestType,
				fnTest(sServiceURI, mModelOptions, bServiceValid, sAnnotationsValid)
			);
		}
	}


	module("Asynchronous loading (joined events)");

	fnTest = function(sServiceURI, mModelOptions, bServiceValid, sAnnotationsValid, bSharedMetadata) {
		return function() {
			if (!bSharedMetadata){
				sap.ui.model.odata.ODataModel.mServiceData = {};
			}
			var oModel = new sap.ui.model.odata.ODataModel(sServiceURI, mModelOptions);
			var that = this;
			var bMetadataLoaded = false;
			var bAnnotationsLoaded = false;
			var bInternalMetadataLoaded = false;

			var fnOnLoaded = function(sWhat) {

				switch (sWhat) {

					case "InternalMetadata":
						ok(!bAnnotationsLoaded, "Internal metadata loaded before annotations");
					break;

					case "Metadata":
						ok(bMetadataLoaded, "Metadata loaded successfully");
						ok(bAnnotationsLoaded, "Metadata loaded after annotations");
					break;

					case "Both":
						ok(bMetadataLoaded && bAnnotationsLoaded, "Check: Annotations and Metadata loaded");
						jQuery.sap.log.debug("check for both");
						start();
					break;

					case "MetadataFailed": 
						// Nothing should be loaded
						ok(!bInternalMetadataLoaded && !bAnnotationsLoaded, "Check: Invalid Service - Annotations and Metadata NOT loaded");
						jQuery.sap.log.debug("check for none");
						start();
					break;

					case "AnnotationsFailed":
						if (sAnnotationsValid === "none") {
							ok(bInternalMetadataLoaded && !bAnnotationsLoaded, "Check: Invalid Annotations - Only Metadata loaded");
						} else {
							ok(bInternalMetadataLoaded, "Check: Invalid Annotations - Metadata loaded");
						}
						// Metadata should be loaded, but no annotations
						jQuery.sap.log.debug("check for no annotations");
						start();
					break;

					default:
						throw "This is unexpected and should never happen...";
				} 

			};

			/* eslint-disable new-cap */
			var metadataDfd = jQuery.Deferred();
			var internalMetadataDfd = jQuery.Deferred();
			/* eslint-enable new-cap */

			// Use internal metadata loaded event, because in case of joined loading, the real one
			// does not fire until Annotations are there
			if (oModel.oMetadata.getServiceMetadata()){
				bInternalMetadataLoaded = true;
				fnOnLoaded("InternalMetadata");
				internalMetadataDfd.resolve();
			} else {
				oModel.oMetadata.attachLoaded(function() {
					bInternalMetadataLoaded = true;
					fnOnLoaded("InternalMetadata");
					internalMetadataDfd.resolve();
				});
			}
			// Metadata must be loaded before annotations
			oModel.attachMetadataLoaded(function() {
				bMetadataLoaded = true;
				if (oModel.bLoadMetadataAsync && oModel.bLoadAnnotationsJoined){
					// Metadata loaded event is only fired after both metadata and annotations have been loaded successfully, so we can also set bAnnotationsloaded to true
					bAnnotationsLoaded = true;
				}
				fnOnLoaded("Metadata");
				metadataDfd.resolve();
			});

			oModel.attachMetadataFailed(function() {
				metadataDfd.reject();
			});
			oModel.attachAnnotationsLoaded(function() {
				bAnnotationsLoaded = true;
			});

			if (bServiceValid && (sAnnotationsValid === "some" || sAnnotationsValid === "all")){
				jQuery.when(metadataDfd).done(function(e){
					jQuery.sap.log.debug("metadata promise fulfilled");
					fnOnLoaded("Both");
				}).fail(function(e){
				jQuery.sap.log.debug("metadata promise failed");
				ok(false, 'Metadata promise rejected');
			});
		} else if (bServiceValid && sAnnotationsValid === "none"){
				//internal metadata needs to be sucessful prior to the failed annotations
				jQuery.when(internalMetadataDfd).done(function(){
					jQuery.sap.log.debug("metadata promise rejected");
					oModel.attachAnnotationsFailed(function(){fnOnLoaded("AnnotationsFailed");}, that);
				});
			} else if (!bServiceValid){
				jQuery.when(metadataDfd).fail(function(e){
					jQuery.sap.log.debug("metadata failed fulfilled");
					fnOnLoaded("MetadataFailed");
				});
			}
		};
	};

	for (i = 0; i < aServices.length; ++i) {
		mService = 	aServices[i];

		sServiceURI = mService.service;
		mModelOptions = {
			annotationURI : mService.annotations,
			json : true
		};
		bServiceValid     = mService.serviceValid;
		sAnnotationsValid = aServices[i].annotationsValid;
		bAnnotationsValid = sAnnotationsValid === "all" || sAnnotationsValid === "some";
		bSharedMetadata = mService.sharedMetadata;
		sTestName = aServices[i].name ? aServices[i].name : "";
	
		// Check asynchronous loading
		mModelOptions.loadAnnotationsJoined = true;
		mModelOptions.loadMetadataAsync = true;


		sTestType = 
			sTestName + " (" +
			(bServiceValid ? "Valid Service" : "Broken Service") + "/" +
			(bAnnotationsValid ? "Valid Annotations (" + sAnnotationsValid + ")" : "Broken Annotations") +
			(bSharedMetadata ?  "/Shared Metadata" : "") +
			")";

		// FIXME: test doesn't work in headless PhantomJS test cycle => commented out!
		//  ==> PhantomJS doesn't fail when loading malformed XML!
		if (!sap.ui.Device.browser.phantomJS || (bServiceValid && bAnnotationsValid)) {
			asyncTest(
				"Asynchronous loading (joined events) - " + sTestType,
				fnTest(sServiceURI, mModelOptions, bServiceValid, sAnnotationsValid)
			);
		}
	}


	module("V2: Asynchronous loading (joined events)");

	fnTest = function(sServiceURI, mModelOptions, bServiceValid, sAnnotationsValid, bSharedMetadata) {
		return function() {
			if (!bSharedMetadata){
				sap.ui.model.odata.v2.ODataModel.mServiceData = {};
			}
			var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceURI, mModelOptions);
			var that = this;
			var bMetadataLoaded = false;
			var bAnnotationsLoaded = false;
			var bInternalMetadataLoaded = false;

			var fnOnLoaded = function(sWhat) {

				switch (sWhat) {

					case "InternalMetadata":
						ok(!bAnnotationsLoaded, "Internal metadata loaded before annotations");
					break;

					case "Metadata":
						ok(bMetadataLoaded, "Metadata loaded successfully");
						ok(bAnnotationsLoaded, "Metadata loaded after annotations");
					break;

					case "Both":
						ok(bMetadataLoaded && bAnnotationsLoaded, "Check: Annotations and Metadata loaded");
						jQuery.sap.log.debug("check for both");
						start();
					break;

					case "MetadataFailed": 
						// Nothing should be loaded
						ok(!bInternalMetadataLoaded && !bAnnotationsLoaded, "Check: Invalid Service - Annotations and Metadata NOT loaded");
						jQuery.sap.log.debug("check for none");
						start();
					break;

					case "AnnotationsFailed":
						if (sAnnotationsValid === "none") {
						ok(bInternalMetadataLoaded && !bAnnotationsLoaded, "Check: Invalid Annotations - Only Metadata loaded");
						} else {
							ok(bInternalMetadataLoaded, "Check: Invalid Annotations - Metadata loaded");
						}
						// Metadata should be loaded, but no annotations
						jQuery.sap.log.debug("check for no annotations");
						start();
					break;

					default:
						throw "This is unexpected and should never happen...";
				} 

			};

			/* eslint-disable new-cap */
			var metadataDfd = jQuery.Deferred();
			var internalMetadataDfd = jQuery.Deferred();
			/* eslint-enable new-cap */

			// Use internal metadata loaded event, because in case of joined loading, the real one
			// does not fire until Annotations are there
			if (oModel.oMetadata.getServiceMetadata()){
				bInternalMetadataLoaded = true;
				fnOnLoaded("InternalMetadata");
				internalMetadataDfd.resolve();
			} else {
				oModel.oMetadata.attachLoaded(function() {
					bInternalMetadataLoaded = true;
					fnOnLoaded("InternalMetadata");
					internalMetadataDfd.resolve();
				});
			}
			// Metadata must be loaded before annotations
			oModel.attachMetadataLoaded(function() {
				bMetadataLoaded = true;
				if (oModel.bLoadMetadataAsync && oModel.bLoadAnnotationsJoined){
					// Metadata loaded event is only fired after both metadata and annotations have been loaded successfully, so we can also set bAnnotationsloaded to true
					bAnnotationsLoaded = true;
				}
				fnOnLoaded("Metadata");
				metadataDfd.resolve();
			});

			oModel.attachMetadataFailed(function() {
				metadataDfd.reject();
			});
			oModel.attachAnnotationsLoaded(function() {
				bAnnotationsLoaded = true;
			});

			if (bServiceValid && (sAnnotationsValid === "some" || sAnnotationsValid === "all")){
				jQuery.when(metadataDfd).done(function(e){
					jQuery.sap.log.debug("metadata promise fulfilled");
					fnOnLoaded("Both");
				}).fail(function(e){
				jQuery.sap.log.debug("metadata promise failed");
				ok(false, 'Metadata promise rejected');
			}); 
		} else if (bServiceValid && sAnnotationsValid === "none"){
				//internal metadata needs to be sucessful prior to the failed annotations
				jQuery.when(internalMetadataDfd).done(function(){
					jQuery.sap.log.debug("metadata promise rejected");
					oModel.attachAnnotationsFailed(function(){fnOnLoaded("AnnotationsFailed");}, that);
				});
			} else if (!bServiceValid){
				jQuery.when(metadataDfd).fail(function(e){
					jQuery.sap.log.debug("metadata failed fulfilled");
					fnOnLoaded("MetadataFailed");
				});
			}
		};
	};

	for (i = 0; i < aServices.length; ++i) {
		mService = 	aServices[i];

		sServiceURI = mService.service;
		mModelOptions = {
			annotationURI : mService.annotations,
			json : true
		};
		bServiceValid     = mService.serviceValid;
		sAnnotationsValid = aServices[i].annotationsValid;
		bAnnotationsValid = sAnnotationsValid === "all" || sAnnotationsValid === "some";
		bSharedMetadata = mService.sharedMetadata;
		sTestName = aServices[i].name ? aServices[i].name : "";
	
		// Check asynchronous loading
		mModelOptions.loadAnnotationsJoined = true;
		mModelOptions.loadMetadataAsync = true;


		sTestType = 
			sTestName + " (" +
			(bServiceValid ? "Valid Service" : "Broken Service") + "/" +
			(bAnnotationsValid ? "Valid Annotations (" + sAnnotationsValid + ")" : "Broken Annotations") +
			(bSharedMetadata ?  "/Shared Metadata" : "") +
			")";

		// FIXME: test doesn't work in headless PhantomJS test cycle => commented out!
		//  ==> PhantomJS doesn't fail when loading malformed XML!
		if (!sap.ui.Device.browser.phantomJS || (bServiceValid && bAnnotationsValid)) {
			asyncTest(
				"Asynchronous loading (joined events) - " + sTestType,
				fnTest(sServiceURI, mModelOptions, bServiceValid, sAnnotationsValid)
			);
		}
	}


	module("Multiple Annotation Sources Merged");

	asyncTest("Asynchronous loading", function() {
		expect(12);
		var asyncStartsExpected = 2; // The number of asynchronous starts expected before the real start is triggered

		var oModel1 = new sap.ui.model.odata.ODataModel(
			"fakeService://testdata/odata/northwind-annotated/", 
			{
				annotationURI : [
					"fakeService://testdata/odata/northwind-annotated/$metadata",
					"fakeService://testdata/odata/northwind-annotations-normal.xml"
				],
				json : true,
				loadAnnotationsJoined : false,
				loadMetadataAsync : false
			}
		);

		oAnnotations = oModel1.getServiceAnnotations();

		ok(oAnnotations.UnitTest["Test.FromAnnotations"][0].Value.Path === "Annotations", "Annotation from correct source (Annotations)");
		ok(oAnnotations.UnitTest["Test.FromMetadata"][0].Value.Path === "Metadata", "Annotation from correct source (Metadata)");
		ok(oAnnotations.UnitTest["Test.Merged"][0].Value.Path === "Annotations", "Annotation from correct source (Annotations)");

		var oModel2 = new sap.ui.model.odata.ODataModel(
			"fakeService://testdata/odata/northwind-annotated/", 
			{
				annotationURI : [
					"fakeService://testdata/odata/northwind-annotations-normal.xml",
					"fakeService://testdata/odata/northwind-annotated/$metadata"
				],
				json : true,
				loadAnnotationsJoined : false,
				loadMetadataAsync : false
			}
		);

		oAnnotations = oModel2.getServiceAnnotations();

		ok(oAnnotations.UnitTest["Test.FromAnnotations"][0].Value.Path === "Annotations", "Annotation from correct source (Annotations)");
		ok(oAnnotations.UnitTest["Test.FromMetadata"][0].Value.Path === "Metadata", "Annotation from correct source (Metadata)");
		ok(oAnnotations.UnitTest["Test.Merged"][0].Value.Path === "Metadata", "Annotation from correct source (Metadata)");

		var oModel3 = new sap.ui.model.odata.ODataModel(
			"fakeService://testdata/odata/northwind-annotated/", 
			{
				annotationURI : [
					"fakeService://testdata/odata/northwind-annotations-normal.xml",
					"fakeService://testdata/odata/northwind-annotated/$metadata"
				],
				json : true,
				loadAnnotationsJoined : false,
				loadMetadataAsync : true
			}
		);
		oModel3.attachAnnotationsLoaded(function() {
			var oAnnotations = oModel3.getServiceAnnotations();
			ok(oAnnotations.UnitTest["Test.FromAnnotations"][0].Value.Path === "Annotations", "Annotation from correct source (Annotations)");
			ok(oAnnotations.UnitTest["Test.FromMetadata"][0].Value.Path === "Metadata", "Annotation from correct source (Metadata)");
			ok(oAnnotations.UnitTest["Test.Merged"][0].Value.Path === "Metadata", "Annotation from correct source (Metadata)");
			asyncStart();
		});

		var oModel4 = new sap.ui.model.odata.ODataModel(
			"fakeService://testdata/odata/northwind-annotated/", 
			{
				annotationURI : [
					"fakeService://testdata/odata/northwind-annotated/$metadata",
					"fakeService://testdata/odata/northwind-annotations-normal.xml"
				],
				json : true,
				loadAnnotationsJoined : false,
				loadMetadataAsync : true
			}
		);
		oModel4.attachAnnotationsLoaded(function() {
			var oAnnotations = oModel4.getServiceAnnotations();
			ok(oAnnotations.UnitTest["Test.FromAnnotations"][0].Value.Path === "Annotations", "Annotation from correct source (Annotations)");
			ok(oAnnotations.UnitTest["Test.FromMetadata"][0].Value.Path === "Metadata", "Annotation from correct source (Metadata)");
			ok(oAnnotations.UnitTest["Test.Merged"][0].Value.Path === "Annotations", "Annotation from correct source (Annotations)");
			asyncStart();
		});


		function asyncStart() {
			if (asyncStart.num === undefined) {
				asyncStart.num = 0;
			}

			if (++asyncStart.num >= asyncStartsExpected) {
				oModel1.destroy();
				oModel2.destroy();
				oModel3.destroy();
				oModel4.destroy();

				start();
			}
		}
	
	});

	module("V2: Multiple Annotation Sources Merged");

	asyncTest("Asynchronous loading", function() {
		expect(6);
		var asyncStartsExpected = 2; // The number of asynchronous starts expected before the real start is triggered

		var oModel3 = new sap.ui.model.odata.v2.ODataModel(
			"fakeService://testdata/odata/northwind-annotated/", 
			{
				annotationURI : [
					"fakeService://testdata/odata/northwind-annotations-normal.xml",
					"fakeService://testdata/odata/northwind-annotated/$metadata"
				],
				json : true,
				loadAnnotationsJoined : false,
				loadMetadataAsync : true
			}
		);
		oModel3.attachAnnotationsLoaded(function() {
			var oAnnotations = oModel3.getServiceAnnotations();
			ok(oAnnotations.UnitTest["Test.FromAnnotations"][0].Value.Path === "Annotations", "Annotation from correct source (Annotations)");
			ok(oAnnotations.UnitTest["Test.FromMetadata"][0].Value.Path === "Metadata", "Annotation from correct source (Metadata)");
			ok(oAnnotations.UnitTest["Test.Merged"][0].Value.Path === "Metadata", "Annotation from correct source (Metadata)");
			asyncStart();
		});

		var oModel4 = new sap.ui.model.odata.v2.ODataModel(
			"fakeService://testdata/odata/northwind-annotated/", 
			{
				annotationURI : [
					"fakeService://testdata/odata/northwind-annotated/$metadata",
					"fakeService://testdata/odata/northwind-annotations-normal.xml"
				],
				json : true,
				loadAnnotationsJoined : false,
				loadMetadataAsync : true
			}
		);
		oModel4.attachAnnotationsLoaded(function() {
			var oAnnotations = oModel4.getServiceAnnotations();
			ok(oAnnotations.UnitTest["Test.FromAnnotations"][0].Value.Path === "Annotations", "Annotation from correct source (Annotations)");
			ok(oAnnotations.UnitTest["Test.FromMetadata"][0].Value.Path === "Metadata", "Annotation from correct source (Metadata)");
			ok(oAnnotations.UnitTest["Test.Merged"][0].Value.Path === "Annotations", "Annotation from correct source (Annotations)");
			asyncStart();
		});


		function asyncStart() {
			if (asyncStart.num === undefined) {
				asyncStart.num = 0;
			}

			if (++asyncStart.num >= asyncStartsExpected) {
				oModel3.destroy();
				oModel4.destroy();

				start();
			}
		}

	});

	module("Additional tests for fixed bugs");


	test("Test 2014-12-08", function() {
		expect(12);

		var mTest = mAdditionalTestsServices["Test 2014-12-08"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
			loadMetadataAsync: false
		};

		var oModel = new sap.ui.model.odata.ODataModel(sServiceURI, mModelOptions);
		var oMetadata = oModel.getServiceMetadata();
		var oAnnotations = oModel.getServiceAnnotations();

		ok(!!oMetadata, "Metadata is available.");
		ok(!!oAnnotations, "Annotations are available.");

		ok(
			!!oAnnotations
				["Test.2014-12-08"],
			"Test Annotations are available"
		);
		ok(
			!!oAnnotations
				["Test.2014-12-08"]
				["com.sap.vocabularies.UI.v1.Identification"],
			"Namespace exists"
		);
		ok(
			!!oAnnotations
				["Test.2014-12-08"]
				["com.sap.vocabularies.UI.v1.Identification"]
				[0],
			"Namespace has content"
		);


		var mNamespace = oAnnotations["Test.2014-12-08"]["com.sap.vocabularies.UI.v1.Identification"][0];

		ok(
			!!mNamespace
				["com.sap.vocabularies.UI.v1.Importance"],
			"Sub-namespace exists"
		);
		ok(
			!!mNamespace
				["com.sap.vocabularies.UI.v1.Importance"]
				["EnumMember"],
			"EnumMember exists"
		);
		equal(
			mNamespace
				["com.sap.vocabularies.UI.v1.Importance"]
				["EnumMember"],
			"com.sap.vocabularies.UI.v1.Priority/High",
			"EnumMember has correct value"
		);

		ok(!!mNamespace["RecordType"], "RecordType exists");
		equal(
			mNamespace["RecordType"],
			"com.sap.vocabularies.UI.v1.DataField",
			"RecordType has correct value"
		);

		ok(!!mNamespace["Value"], "Value exists");

		var mCorrectValue = {
			"Apply": {
				"Name" : "odata.concat",
				"Parameters" : [{
					"Type" : "Path",
					"Value" : "CompanyCodeTESet/ContactPerson"
				}, {
					"Type" : "String",
					"Value" : " ("
				}, {
					"Type" : "Path",
					"Value" : "CompanyCode"
				}, {
					"Type" : "String",
					"Value" : ")"
				}]
			}
		};

		deepEqual(mNamespace["Value"], mCorrectValue, "Value has correct value");
	});

	asyncTest("V2: Test 2014-12-08", function() {
		expect(12);

		var mTest = mAdditionalTestsServices["Test 2014-12-08"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
		};

		var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceURI, mModelOptions);
		
		oModel.attachAnnotationsLoaded(function() {
			var oMetadata = oModel.getServiceMetadata();
			var oAnnotations = oModel.getServiceAnnotations();

			ok(!!oMetadata, "Metadata is available.");
			ok(!!oAnnotations, "Annotations are available.");

			ok(
				!!oAnnotations
					["Test.2014-12-08"],
				"Test Annotations are available"
			);
			ok(
				!!oAnnotations
					["Test.2014-12-08"]
					["com.sap.vocabularies.UI.v1.Identification"],
				"Namespace exists"
			);
			ok(
				!!oAnnotations
					["Test.2014-12-08"]
					["com.sap.vocabularies.UI.v1.Identification"]
					[0],
				"Namespace has content"
			);


			var mNamespace = oAnnotations["Test.2014-12-08"]["com.sap.vocabularies.UI.v1.Identification"][0];

			ok(
				!!mNamespace
					["com.sap.vocabularies.UI.v1.Importance"],
				"Sub-namespace exists"
			);
			ok(
				!!mNamespace
					["com.sap.vocabularies.UI.v1.Importance"]
					["EnumMember"],
				"EnumMember exists"
			);
			equal(
				mNamespace
					["com.sap.vocabularies.UI.v1.Importance"]
					["EnumMember"],
				"com.sap.vocabularies.UI.v1.Priority/High",
				"EnumMember has correct value"
			);

			ok(!!mNamespace["RecordType"], "RecordType exists");
			equal(
				mNamespace["RecordType"],
				"com.sap.vocabularies.UI.v1.DataField",
				"RecordType has correct value"
			);

			ok(!!mNamespace["Value"], "Value exists");

			var mCorrectValue = {
				"Apply": {
					"Name" : "odata.concat",
					"Parameters" : [{
						"Type" : "Path",
						"Value" : "CompanyCodeTESet/ContactPerson"
					}, {
						"Type" : "String",
						"Value" : " ("
					}, {
						"Type" : "Path",
						"Value" : "CompanyCode"
					}, {
						"Type" : "String",
						"Value" : ")"
					}]
				}
			};

			deepEqual(mNamespace["Value"], mCorrectValue, "Value has correct value");
			
			start();
		});
	});


	test("Multiple Property Annotations", function() {
		expect(11);

		var mTest = mAdditionalTestsServices["Multiple Property Annotations"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
			loadMetadataAsync: false
		};

		var oModel = new sap.ui.model.odata.ODataModel(sServiceURI, mModelOptions);
		var oMetadata = oModel.getServiceMetadata();
		var oAnnotations = oModel.getServiceAnnotations();

		ok(!!oMetadata, "Metadata is available.");
		ok(!!oAnnotations, "Annotations are available.");

		ok(!!oAnnotations["propertyAnnotations"], "PropertyAnnotations namespace exists");

		ok(
			!!oAnnotations["propertyAnnotations"]["MultiplePropertyAnnotations.Product"],
			"Target namespace inside PropertyAnnotations exists"
		);

		ok(
			!!oAnnotations["propertyAnnotations"]["MultiplePropertyAnnotations.Product"]["Price/Amount"],
			"Target values exist"
		);

		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["MultiplePropertyAnnotations.Product"]
				["Price/Amount"]
				["CQP.ISOCurrency"],
			"Target value 1 exists"
		);

		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["MultiplePropertyAnnotations.Product"]
				["Price/Amount"]
				["Common.Label"],
			"Target value 2 exists"
		);

		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["MultiplePropertyAnnotations.Product"]
				["Price/Amount"]
				["CQP.ISOCurrency"]
				["Path"],
			"Target value 1 property exists"
		);

		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["MultiplePropertyAnnotations.Product"]
				["Price/Amount"]
				["Common.Label"]
				["String"],
			"Target value 2 property exists"
		);

		equal(
			oAnnotations
				["propertyAnnotations"]
				["MultiplePropertyAnnotations.Product"]
				["Price/Amount"]
				["CQP.ISOCurrency"]
				["Path"],
			"Price/CurrencyCode",
			"Target value 1 property exists"
		);

		equal(
			oAnnotations
				["propertyAnnotations"]
				["MultiplePropertyAnnotations.Product"]
				["Price/Amount"]
				["Common.Label"]
				["String"],
			"Price",
			"Target value 2 property exists"
		);
	});


	asyncTest("V2: Multiple Property Annotations", function() {
		expect(11);

		var mTest = mAdditionalTestsServices["Multiple Property Annotations"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
		};

		var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceURI, mModelOptions);
		oModel.attachAnnotationsLoaded(function() {
			var oMetadata = oModel.getServiceMetadata();
			var oAnnotations = oModel.getServiceAnnotations();

			ok(!!oMetadata, "Metadata is available.");
			ok(!!oAnnotations, "Annotations are available.");

			ok(!!oAnnotations["propertyAnnotations"], "PropertyAnnotations namespace exists");

			ok(
				!!oAnnotations["propertyAnnotations"]["MultiplePropertyAnnotations.Product"],
				"Target namespace inside PropertyAnnotations exists"
			);

			ok(
				!!oAnnotations["propertyAnnotations"]["MultiplePropertyAnnotations.Product"]["Price/Amount"],
				"Target values exist"
			);

			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["MultiplePropertyAnnotations.Product"]
					["Price/Amount"]
					["CQP.ISOCurrency"],
				"Target value 1 exists"
			);

			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["MultiplePropertyAnnotations.Product"]
					["Price/Amount"]
					["Common.Label"],
				"Target value 2 exists"
			);

			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["MultiplePropertyAnnotations.Product"]
					["Price/Amount"]
					["CQP.ISOCurrency"]
					["Path"],
				"Target value 1 property exists"
			);

			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["MultiplePropertyAnnotations.Product"]
					["Price/Amount"]
					["Common.Label"]
					["String"],
				"Target value 2 property exists"
			);

			equal(
				oAnnotations
					["propertyAnnotations"]
					["MultiplePropertyAnnotations.Product"]
					["Price/Amount"]
					["CQP.ISOCurrency"]
					["Path"],
				"Price/CurrencyCode",
				"Target value 1 property exists"
			);

			equal(
				oAnnotations
					["propertyAnnotations"]
					["MultiplePropertyAnnotations.Product"]
					["Price/Amount"]
					["Common.Label"]
					["String"],
				"Price",
				"Target value 2 property exists"
			);
			
			start();
		});
	});


	test("Qualifiers in Property Annotations", function() {
		expect(8);

		var mTest = mAdditionalTestsServices["Property Annotation Qualifiers"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
			loadMetadataAsync: false
		};

		var oModel = new sap.ui.model.odata.ODataModel(sServiceURI, mModelOptions);
		var oMetadata = oModel.getServiceMetadata();
		var oAnnotations = oModel.getServiceAnnotations();

		ok(!!oMetadata, "Metadata is available.");
		ok(!!oAnnotations, "Annotations are available.");

		ok(!!oAnnotations["propertyAnnotations"], "PropertyAnnotations namespace exists");

		ok(
			!!oAnnotations["propertyAnnotations"]["PropertyAnnotationQualifiers.Product"],
			"Target namespace inside PropertyAnnotations exists"
		);

		ok(
			!!oAnnotations
				["propertyAnnotations"]["PropertyAnnotationQualifiers.Product"]["Price/Amount"],
			"Target value exists"
		);

		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["PropertyAnnotationQualifiers.Product"]
				["Price/Amount"]
				["CQP.ISOCurrency#Amount1"],
			"Target value with Qualifier exists"
		);

		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["PropertyAnnotationQualifiers.Product"]
				["Price/Amount"]
				["CQP.ISOCurrency#Amount1"]
				["Path"],
			"Target value with Qualifier value exists"
		);

		equal(
			oAnnotations
				["propertyAnnotations"]
				["PropertyAnnotationQualifiers.Product"]
				["Price/Amount"]
				["CQP.ISOCurrency#Amount1"]
				["Path"],
			"Price/CurrencyCode",
			"Target value with Qualifier value has correct content"
		);

	});

	asyncTest("V2: Qualifiers in Property Annotations", function() {
		expect(8);

		var mTest = mAdditionalTestsServices["Property Annotation Qualifiers"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
			loadMetadataAsync: false
		};

		var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceURI, mModelOptions);
		oModel.attachAnnotationsLoaded(function() {
			var oMetadata = oModel.getServiceMetadata();
			var oAnnotations = oModel.getServiceAnnotations();

			ok(!!oMetadata, "Metadata is available.");
			ok(!!oAnnotations, "Annotations are available.");

			ok(!!oAnnotations["propertyAnnotations"], "PropertyAnnotations namespace exists");

			ok(
				!!oAnnotations["propertyAnnotations"]["PropertyAnnotationQualifiers.Product"],
				"Target namespace inside PropertyAnnotations exists"
			);

			ok(
				!!oAnnotations
					["propertyAnnotations"]["PropertyAnnotationQualifiers.Product"]["Price/Amount"],
				"Target value exists"
			);

			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["PropertyAnnotationQualifiers.Product"]
					["Price/Amount"]
					["CQP.ISOCurrency#Amount1"],
				"Target value with Qualifier exists"
			);

			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["PropertyAnnotationQualifiers.Product"]
					["Price/Amount"]
					["CQP.ISOCurrency#Amount1"]
					["Path"],
				"Target value with Qualifier value exists"
			);

			equal(
				oAnnotations
					["propertyAnnotations"]
					["PropertyAnnotationQualifiers.Product"]
					["Price/Amount"]
					["CQP.ISOCurrency#Amount1"]
					["Path"],
				"Price/CurrencyCode",
				"Target value with Qualifier value has correct content"
			);
			start();
		});
	});


	test("Other Property Values", function() {
		expect(8);

		var mTest = mAdditionalTestsServices["Other Property Values"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
			loadMetadataAsync: false
		};

		var oModel = new sap.ui.model.odata.ODataModel(sServiceURI, mModelOptions);
		var oMetadata = oModel.getServiceMetadata();
		var oAnnotations = oModel.getServiceAnnotations();

		ok(!!oMetadata, "Metadata is available.");
		ok(!!oAnnotations, "Annotations are available.");

		ok(!!oAnnotations["propertyAnnotations"], "PropertyAnnotations namespace exists");

		ok(
			!!oAnnotations["propertyAnnotations"]["OtherPropertyValues.Product"],
			"Target namespace inside PropertyAnnotations exists"
		);

		ok(
			!!oAnnotations
				["propertyAnnotations"]["OtherPropertyValues.Product"]["Price/Amount"],
			"Target value exists"
		);

		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValues.Product"]
				["Price/Amount"]
				["CQP.ISOCurrency#Amount2"],
			"Target value with Qualifier exists"
		);

		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValues.Product"]
				["Price/Amount"]
				["CQP.ISOCurrency#Amount2"]
				["String"],
			"Target value with Qualifier value exists"
		);

		equal(
			oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValues.Product"]
				["Price/Amount"]
				["CQP.ISOCurrency#Amount2"]
				["String"],
			"EUR",
			"Target value with Qualifier value has correct content"
		);
	});

	asyncTest("V2: Other Property Values", function() {
		expect(8);

		var mTest = mAdditionalTestsServices["Other Property Values"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
		};

		var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceURI, mModelOptions);
		oModel.attachAnnotationsLoaded(function() {
			var oMetadata = oModel.getServiceMetadata();
			var oAnnotations = oModel.getServiceAnnotations();

			ok(!!oMetadata, "Metadata is available.");
			ok(!!oAnnotations, "Annotations are available.");

			ok(!!oAnnotations["propertyAnnotations"], "PropertyAnnotations namespace exists");

			ok(
				!!oAnnotations["propertyAnnotations"]["OtherPropertyValues.Product"],
				"Target namespace inside PropertyAnnotations exists"
			);

			ok(
				!!oAnnotations
					["propertyAnnotations"]["OtherPropertyValues.Product"]["Price/Amount"],
				"Target value exists"
			);

			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValues.Product"]
					["Price/Amount"]
					["CQP.ISOCurrency#Amount2"],
				"Target value with Qualifier exists"
			);

			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValues.Product"]
					["Price/Amount"]
					["CQP.ISOCurrency#Amount2"]
					["String"],
				"Target value with Qualifier value exists"
			);

			equal(
				oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValues.Product"]
					["Price/Amount"]
					["CQP.ISOCurrency#Amount2"]
					["String"],
				"EUR",
				"Target value with Qualifier value has correct content"
			);
			start();
		});
	});


	test("Aliases in Namespaces", function() {
		expect(8);

		var mTest = mAdditionalTestsServices["Aliases in Namespaces"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
			loadMetadataAsync: false
		};

		var oModel = new sap.ui.model.odata.ODataModel(sServiceURI, mModelOptions);
		var oMetadata = oModel.getServiceMetadata();
		var oAnnotations = oModel.getServiceAnnotations();

		ok(!!oMetadata, "Metadata is available.");
		ok(!!oAnnotations, "Annotations are available.");

		ok(!!oAnnotations["propertyAnnotations"], "PropertyAnnotations namespace exists");

		ok(
			!!oAnnotations["propertyAnnotations"]["NamespaceAliases.PurchaseOrder"],
			"Target namespace inside PropertyAnnotations exists"
		);

		ok(
			!!oAnnotations
				["propertyAnnotations"]["NamespaceAliases.PurchaseOrder"]["GrossAmount"],
			"Target value exists"
		);

		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["NamespaceAliases.PurchaseOrder"]
				["GrossAmount"]
				["com.sap.vocabularies.Common.v1.Label"],
			"Target value with correct alias replacement (none!) exists"
		);

		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["NamespaceAliases.PurchaseOrder"]
				["GrossAmount"]
				["com.sap.vocabularies.Common.v1.Label"]
				["String"],
			"Target value with String value exists"
		);

		equal(
			oAnnotations
				["propertyAnnotations"]
				["NamespaceAliases.PurchaseOrder"]
				["GrossAmount"]
				["com.sap.vocabularies.Common.v1.Label"]
				["String"],
			"Gross Amount",
			"Target value String value has correct content"
		);

	});
	
	asyncTest("V2: Aliases in Namespaces", function() {
		expect(8);

		var mTest = mAdditionalTestsServices["Aliases in Namespaces"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
			loadMetadataAsync: false
		};

		var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceURI, mModelOptions);
		oModel.attachAnnotationsLoaded(function() {
			var oMetadata = oModel.getServiceMetadata();
			var oAnnotations = oModel.getServiceAnnotations();

			ok(!!oMetadata, "Metadata is available.");
			ok(!!oAnnotations, "Annotations are available.");

			ok(!!oAnnotations["propertyAnnotations"], "PropertyAnnotations namespace exists");

			ok(
				!!oAnnotations["propertyAnnotations"]["NamespaceAliases.PurchaseOrder"],
				"Target namespace inside PropertyAnnotations exists"
			);

			ok(
				!!oAnnotations
					["propertyAnnotations"]["NamespaceAliases.PurchaseOrder"]["GrossAmount"],
				"Target value exists"
			);

			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["NamespaceAliases.PurchaseOrder"]
					["GrossAmount"]
					["com.sap.vocabularies.Common.v1.Label"],
				"Target value with correct alias replacement (none!) exists"
			);

			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["NamespaceAliases.PurchaseOrder"]
					["GrossAmount"]
					["com.sap.vocabularies.Common.v1.Label"]
					["String"],
				"Target value with String value exists"
			);

			equal(
				oAnnotations
					["propertyAnnotations"]
					["NamespaceAliases.PurchaseOrder"]
					["GrossAmount"]
					["com.sap.vocabularies.Common.v1.Label"]
					["String"],
				"Gross Amount",
				"Target value String value has correct content"
			);
			start();
		});
	});
	
	test("Namespaces in Other Property Values", function() {
		expect(22);

		var mTest = mAdditionalTestsServices["Namespaces in Other Property Values"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
			loadMetadataAsync: false
		};

		var oModel = new sap.ui.model.odata.ODataModel(sServiceURI, mModelOptions);
		var oMetadata = oModel.getServiceMetadata();
		var oAnnotations = oModel.getServiceAnnotations();

		ok(!!oMetadata, "Metadata is available.");

		ok(!!oAnnotations, "Annotations are available.");

		ok(!!oAnnotations["propertyAnnotations"], "PropertyAnnotations namespace exists");

		ok(
			!!oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"],
			"Target value exists"
		);


		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValueAliases.Test"]
				["Value"]
				["com.sap.vocabularies.UI.v1.Name"],
			"Target value's namespace has been correctly replaced"
		);
		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValueAliases.Test"]
				["Value"]
				["com.sap.vocabularies.UI.v1.Name"]
				["EnumMember"],
			"Target value's child exists"
		);
		equal(
			oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValueAliases.Test"]
				["Value"]
				["com.sap.vocabularies.UI.v1.Name"]
				["EnumMember"],
			"com.sap.vocabularies.UI.v1.Value",
			"Target value's namespace has been correctly replaced"
		);


		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValueAliases.Test"]
				["Value"]
				["com.sap.vocabularies.Communication.v1.Name"],
			"Target value's namespace has been correctly replaced"
		);
		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValueAliases.Test"]
				["Value"]
				["com.sap.vocabularies.Communication.v1.Name"]
				["EnumMember"],
			"Target value's child exists"
		);
		equal(
			oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValueAliases.Test"]
				["Value"]
				["com.sap.vocabularies.Communication.v1.Name"]
				["EnumMember"],
			"com.sap.vocabularies.Communication.v1.Value",
			"Target value's namespace has been correctly replaced"
		);


		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValueAliases.Test"]
				["Value"]
				["Org.OData.Measures.V1.Name"],
			"Target value's namespace has been correctly replaced"
		);
		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValueAliases.Test"]
				["Value"]
				["Org.OData.Measures.V1.Name"]
				["EnumMember"],
			"Target value's child exists"
		);
		equal(
			oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValueAliases.Test"]
				["Value"]
				["Org.OData.Measures.V1.Name"]
				["EnumMember"],
			"Org.OData.Measures.V1.Value",
			"Target value's namespace has been correctly replaced"
		);


		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValueAliases.Test"]
				["Value"]
				["Org.OData.Measures.V1.Name"],
			"Target value's namespace has been correctly replaced"
		);
		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValueAliases.Test"]
				["Value"]
				["Org.OData.Measures.V1.Name"]
				["EnumMember"],
			"Target value's child exists"
		);
		equal(
			oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValueAliases.Test"]
				["Value"]
				["Org.OData.Measures.V1.Name"]
				["EnumMember"],
			"Org.OData.Measures.V1.Value",
			"Target value's namespace has been correctly replaced"
		);


		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValueAliases.Test"]
				["Value"]
				["com.sap.vocabularies.Common.v1.Name"],
			"Target value's namespace has been correctly replaced"
		);
		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValueAliases.Test"]
				["Value"]
				["com.sap.vocabularies.Common.v1.Name"]
				["EnumMember"],
			"Target value's child exists"
		);
		equal(
			oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValueAliases.Test"]
				["Value"]
				["com.sap.vocabularies.Common.v1.Name"]
				["EnumMember"],
			"com.sap.vocabularies.Common.v1.Value",
			"Target value's namespace has been correctly replaced"
		);


		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValueAliases.Test"]
				["Value"]
				["FTGEN_HB_TE.Name"],
			"Target value's namespace has been correctly replaced"
		);
		ok(
			!!oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValueAliases.Test"]
				["Value"]
				["FTGEN_HB_TE.Name"]
				["EnumMember"],
			"Target value's child exists"
		);
		equal(
			oAnnotations
				["propertyAnnotations"]
				["OtherPropertyValueAliases.Test"]
				["Value"]
				["FTGEN_HB_TE.Name"]
				["EnumMember"],
			"FTGEN_HB_TE.Value",
			"Target value's namespace has been correctly replaced"
		);

	});
	
	asyncTest("V2: Namespaces in Other Property Values", function() {
		expect(22);

		var mTest = mAdditionalTestsServices["Namespaces in Other Property Values"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
		};

		var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceURI, mModelOptions);
		oModel.attachAnnotationsLoaded(function() {
			var oMetadata = oModel.getServiceMetadata();
			var oAnnotations = oModel.getServiceAnnotations();

			ok(!!oMetadata, "Metadata is available.");

			ok(!!oAnnotations, "Annotations are available.");

			ok(!!oAnnotations["propertyAnnotations"], "PropertyAnnotations namespace exists");
	
			ok(
				!!oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"],
				"Target value exists"
			);


			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValueAliases.Test"]
					["Value"]
					["com.sap.vocabularies.UI.v1.Name"],
				"Target value's namespace has been correctly replaced"
			);
			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValueAliases.Test"]
					["Value"]
					["com.sap.vocabularies.UI.v1.Name"]
					["EnumMember"],
				"Target value's child exists"
			);
			equal(
				oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValueAliases.Test"]
					["Value"]
					["com.sap.vocabularies.UI.v1.Name"]
					["EnumMember"],
				"com.sap.vocabularies.UI.v1.Value",
				"Target value's namespace has been correctly replaced"
			);


			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValueAliases.Test"]
					["Value"]
					["com.sap.vocabularies.Communication.v1.Name"],
				"Target value's namespace has been correctly replaced"
			);
			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValueAliases.Test"]
					["Value"]
					["com.sap.vocabularies.Communication.v1.Name"]
					["EnumMember"],
				"Target value's child exists"
			);
			equal(
				oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValueAliases.Test"]
					["Value"]
					["com.sap.vocabularies.Communication.v1.Name"]
					["EnumMember"],
				"com.sap.vocabularies.Communication.v1.Value",
				"Target value's namespace has been correctly replaced"
			);


			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValueAliases.Test"]
					["Value"]
					["Org.OData.Measures.V1.Name"],
				"Target value's namespace has been correctly replaced"
			);
			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValueAliases.Test"]
					["Value"]
					["Org.OData.Measures.V1.Name"]
					["EnumMember"],
				"Target value's child exists"
			);
			equal(
				oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValueAliases.Test"]
					["Value"]
					["Org.OData.Measures.V1.Name"]
					["EnumMember"],
				"Org.OData.Measures.V1.Value",
				"Target value's namespace has been correctly replaced"
			);


			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValueAliases.Test"]
					["Value"]
					["Org.OData.Measures.V1.Name"],
				"Target value's namespace has been correctly replaced"
			);
			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValueAliases.Test"]
					["Value"]
					["Org.OData.Measures.V1.Name"]
					["EnumMember"],
				"Target value's child exists"
			);
			equal(
				oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValueAliases.Test"]
					["Value"]
					["Org.OData.Measures.V1.Name"]
					["EnumMember"],
				"Org.OData.Measures.V1.Value",
				"Target value's namespace has been correctly replaced"
			);


			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValueAliases.Test"]
					["Value"]
					["com.sap.vocabularies.Common.v1.Name"],
				"Target value's namespace has been correctly replaced"
			);
			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValueAliases.Test"]
					["Value"]
					["com.sap.vocabularies.Common.v1.Name"]
					["EnumMember"],
				"Target value's child exists"
			);
			equal(
				oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValueAliases.Test"]
					["Value"]
					["com.sap.vocabularies.Common.v1.Name"]
					["EnumMember"],
				"com.sap.vocabularies.Common.v1.Value",
				"Target value's namespace has been correctly replaced"
			);


			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValueAliases.Test"]
					["Value"]
					["FTGEN_HB_TE.Name"],
				"Target value's namespace has been correctly replaced"
			);
			ok(
				!!oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValueAliases.Test"]
					["Value"]
					["FTGEN_HB_TE.Name"]
					["EnumMember"],
				"Target value's child exists"
			);
			equal(
				oAnnotations
					["propertyAnnotations"]
					["OtherPropertyValueAliases.Test"]
					["Value"]
					["FTGEN_HB_TE.Name"]
					["EnumMember"],
				"FTGEN_HB_TE.Value",
				"Target value's namespace has been correctly replaced"
			);
			start();
		});
	});
	
	test("Text Properties", function() {
		expect(14);

		var mTest = mAdditionalTestsServices["Text Properties"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
			loadMetadataAsync: false
		};

		var oModel = new sap.ui.model.odata.ODataModel(sServiceURI, mModelOptions);
		var oMetadata = oModel.getServiceMetadata();
		var oAnnotations = oModel.getServiceAnnotations();

		ok(!!oMetadata, "Metadata is available.");

		ok(!!oAnnotations, "Annotations are available.");

		ok(!!oAnnotations["propertyAnnotations"], "PropertyAnnotations group exists");
		
		ok(
			!!oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"],
			"PropertyAnnotation definition exists"
		);
		
		ok(
			!!oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"],
			"PropertyAnnotation definition value exists"
		);
		
		ok(
			!!oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"]["com.sap.vocabularies.UI.v1.Name1"],
			"Name1 with replaced alias exists"
		);
		ok(
			!!oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"]["com.sap.vocabularies.UI.v1.Name2"],
			"Name2 with replaced alias exists"
		);
		ok(
			!!oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"]["com.sap.vocabularies.UI.v1.Name3"],
			"Name3 with replaced alias exists"
		);
		
		ok(
			!!oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"]["com.sap.vocabularies.UI.v1.Name1"]["EnumMember"],
			"Name1 with replaced alias exists and has EnumMember child node"
		);
		ok(
			!!oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"]["com.sap.vocabularies.UI.v1.Name2"]["String"],
			"Name2 with replaced alias exists and has String child node"
		);
		ok(
			!!oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"]["com.sap.vocabularies.UI.v1.Name3"]["Invalid"],
			"Name3 with replaced alias exists and has Invalid child node"
		);
		
		equals(
			oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"]["com.sap.vocabularies.UI.v1.Name1"]["EnumMember"],
			"com.sap.vocabularies.UI.v1.Value",
			"Name1 with replaced alias exists and has EnumMember child node that contains alias replaced tet with trimmed white-spaces"
		);
		equals(
			oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"]["com.sap.vocabularies.UI.v1.Name2"]["String"],
			"   test test   ",
			"Name2 with replaced alias exists and has String child node that contains the exact text inclunding white-spaces"
		);
		deepEqual(
			oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"]["com.sap.vocabularies.UI.v1.Name3"]["Invalid"],
			{},
			"Name3 with replaced alias exists and has Invalid child node that only contains an empy object"
		);
	});

	asyncTest("V2: Text Properties", function() {
		expect(14);
		
		var mTest = mAdditionalTestsServices["Text Properties"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
		};

		var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceURI, mModelOptions);
		oModel.attachAnnotationsLoaded(function() {
			var oMetadata = oModel.getServiceMetadata();
			var oAnnotations = oModel.getServiceAnnotations();

			ok(!!oMetadata, "Metadata is available.");

			ok(!!oAnnotations, "Annotations are available.");

			ok(!!oAnnotations["propertyAnnotations"], "PropertyAnnotations group exists");
			
			ok(
				!!oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"],
				"PropertyAnnotation definition exists"
			);
			
			ok(
				!!oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"],
				"PropertyAnnotation definition value exists"
			);
			
			ok(
				!!oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"]["com.sap.vocabularies.UI.v1.Name1"],
				"Name1 with replaced alias exists"
			);
			ok(
				!!oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"]["com.sap.vocabularies.UI.v1.Name2"],
				"Name2 with replaced alias exists"
			);
			ok(
				!!oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"]["com.sap.vocabularies.UI.v1.Name3"],
				"Name3 with replaced alias exists"
			);
			
			ok(
				!!oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"]["com.sap.vocabularies.UI.v1.Name1"]["EnumMember"],
				"Name1 with replaced alias exists and has EnumMember child node"
			);
			ok(
				!!oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"]["com.sap.vocabularies.UI.v1.Name2"]["String"],
				"Name2 with replaced alias exists and has String child node"
			);
			ok(
				!!oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"]["com.sap.vocabularies.UI.v1.Name3"]["Invalid"],
				"Name3 with replaced alias exists and has Invalid child node"
			);

			equals(
				oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"]["com.sap.vocabularies.UI.v1.Name1"]["EnumMember"],
				"com.sap.vocabularies.UI.v1.Value",
				"Name1 with replaced alias exists and has EnumMember child node that contains alias replaced tet with trimmed white-spaces"
			);
			equals(
				oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"]["com.sap.vocabularies.UI.v1.Name2"]["String"],
				"   test test   ",
				"Name2 with replaced alias exists and has String child node that contains the exact text inclunding white-spaces"
			);
			deepEqual(
				oAnnotations["propertyAnnotations"]["OtherPropertyValueAliases.Test"]["Value"]["com.sap.vocabularies.UI.v1.Name3"]["Invalid"],
				{},
				"Name3 with replaced alias exists and has Invalid child node that only contains an empy object"
			);
			start();
		});
	});
	
	test("Entity Containers", function() {
		expect(30);

		var mTest = mAdditionalTestsServices["Entity Containers"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
			loadMetadataAsync: false
		};

		var oModel = new sap.ui.model.odata.ODataModel(sServiceURI, mModelOptions);
		var oMetadata = oModel.getServiceMetadata();
		var oAnnotations = oModel.getServiceAnnotations();

		ok(!!oMetadata, "Metadata is available.");

		ok(!!oAnnotations, "Annotations are available.");

		
		ok(!!oAnnotations["EntityContainer"], "Entity container entry exists");
		
		ok(!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"], "Entity container exists");
		
		ok(
			!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
			["SalesOrder"],
			"Entity in container exists"
		);

		ok(
			!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
			["SalesOrder"]
			["com.sap.vocabularies.Common.v1.DraftRoot"],
			"Sub Entity in container exists"
		);

		ok(
			!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
			["SalesOrder"]
			["com.sap.vocabularies.Common.v1.DraftRoot"]
			["ActivationAction"],
			"Sub Entity value in container exists"
		);
		ok(
			!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
			["SalesOrder"]
			["com.sap.vocabularies.Common.v1.DraftRoot"]
			["ActivationAction"]
			["String"],
			"Sub Entity value in container exists"
		);
		equal(
			oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
			["SalesOrder"]
			["com.sap.vocabularies.Common.v1.DraftRoot"]
			["ActivationAction"]
			["String"],
			"AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities/Activate",
			"Sub Entity value in container exists"
		);
		
		ok(
			!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
			["SalesOrder"]
			["com.sap.vocabularies.Common.v1.DraftRoot"]
			["EditAction"],
			"Sub Entity value in container exists"
		);
		ok(
			!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
			["SalesOrder"]
			["com.sap.vocabularies.Common.v1.DraftRoot"]
			["EditAction"]
			["String"],
			"Sub Entity value in container exists"
		);
		equal(
			oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
			["SalesOrder"]
			["com.sap.vocabularies.Common.v1.DraftRoot"]
			["EditAction"]
			["String"],
			"AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities/Edit",
			"Sub Entity value in container exists"
		);
		
		ok(
			!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
			["SalesOrder"]
			["com.sap.vocabularies.Common.v1.DraftRoot"]
			["ValidationFunction"],
			"Sub Entity value in container exists"
		);
		ok(
			!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
			["SalesOrder"]
			["com.sap.vocabularies.Common.v1.DraftRoot"]
			["ValidationFunction"]
			["String"],
			"Sub Entity value in container exists"
		);
		equal(
			oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
			["SalesOrder"]
			["com.sap.vocabularies.Common.v1.DraftRoot"]
			["ValidationFunction"]
			["String"],
			"AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities/Validate",
			"Sub Entity value in container exists"
		);
		
		ok(
			!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
			["SalesOrder"]
			["com.sap.vocabularies.Common.v1.DraftRoot"]
			["PreparationAction"],
			"Sub Entity value in container exists"
		);
		ok(
			!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
			["SalesOrder"]
			["com.sap.vocabularies.Common.v1.DraftRoot"]
			["PreparationAction"]
			["String"],
			"Sub Entity value in container exists"
		);
		equal(
			oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
			["SalesOrder"]
			["com.sap.vocabularies.Common.v1.DraftRoot"]
			["PreparationAction"]
			["String"],
			"AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities/Prepare",
			"Sub Entity value in container exists"
		);
		
		ok(
			!!oAnnotations["AIVS_NEW_BO_SRV.SalesOrderType"],
			"Entity in namespace exists"
		);
		ok(
			!!oAnnotations["AIVS_NEW_BO_SRV.SalesOrderType"]
			["com.sap.vocabularies.Common.v1.SemanticKey"],
			"Entity in namespace exists"
		);
		ok(
			!!oAnnotations["AIVS_NEW_BO_SRV.SalesOrderType"]
			["com.sap.vocabularies.Common.v1.SemanticKey"]
			[0],
			"Entity entries in namespace exists"
		);
		ok(
			!!oAnnotations["AIVS_NEW_BO_SRV.SalesOrderType"]
			["com.sap.vocabularies.Common.v1.SemanticKey"]
			[0]
			["PropertyPath"],
			"Property exists"
		);
		equal(
			oAnnotations["AIVS_NEW_BO_SRV.SalesOrderType"]
			["com.sap.vocabularies.Common.v1.SemanticKey"]
			[0]
			["PropertyPath"],
			"SalesOrderID",
			"Entity in namespace exists"
		);
		
		ok(
			!!oAnnotations["AIVS_NEW_BO_SRV.SalesOrderItemType"],
			"Entity in namespace exists"
		);
		ok(
			!!oAnnotations["AIVS_NEW_BO_SRV.SalesOrderItemType"]
			["com.sap.vocabularies.Common.v1.SemanticKey"],
			"Entity in namespace exists"
		);
		ok(
			!!oAnnotations["AIVS_NEW_BO_SRV.SalesOrderItemType"]
			["com.sap.vocabularies.Common.v1.SemanticKey"]
			[0],
			"Entity entries in namespace exists"
		);
		ok(
			!!oAnnotations["AIVS_NEW_BO_SRV.SalesOrderItemType"]
			["com.sap.vocabularies.Common.v1.SemanticKey"]
			[0]
			["PropertyPath"],
			"Property exists"
		);
		ok(
			!!oAnnotations["AIVS_NEW_BO_SRV.SalesOrderItemType"]
			["com.sap.vocabularies.Common.v1.SemanticKey"]
			[1]
			["PropertyPath"],
			"Property exists"
		);
		equal(
			oAnnotations["AIVS_NEW_BO_SRV.SalesOrderItemType"]
			["com.sap.vocabularies.Common.v1.SemanticKey"]
			[0]
			["PropertyPath"],
			"SalesOrderID",
			"Entity in namespace exists"
		);
		equal(
			oAnnotations["AIVS_NEW_BO_SRV.SalesOrderItemType"]
			["com.sap.vocabularies.Common.v1.SemanticKey"]
			[1]
			["PropertyPath"],
			"SalesOrderItemID",
			"Entity in namespace exists"
		);
	});

	asyncTest("V2: Entity Containers", function() {
		expect(30);

		var mTest = mAdditionalTestsServices["Entity Containers"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: true,
		};

		var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceURI, mModelOptions);
		oModel.attachMetadataLoaded(function() {
			var oMetadata = oModel.getServiceMetadata();
			var oAnnotations = oModel.getServiceAnnotations();

			ok(!!oMetadata, "Metadata is available.");

			ok(!!oAnnotations, "Annotations are available.");

			
			ok(!!oAnnotations["EntityContainer"], "Entity container entry exists");
			
			ok(!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"], "Entity container exists");
			
			ok(
				!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
				["SalesOrder"],
				"Entity in container exists"
			);

			ok(
				!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
				["SalesOrder"]
				["com.sap.vocabularies.Common.v1.DraftRoot"],
				"Sub Entity in container exists"
			);

			ok(
				!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
				["SalesOrder"]
				["com.sap.vocabularies.Common.v1.DraftRoot"]
				["ActivationAction"],
				"Sub Entity value in container exists"
			);
			ok(
				!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
				["SalesOrder"]
				["com.sap.vocabularies.Common.v1.DraftRoot"]
				["ActivationAction"]
				["String"],
				"Sub Entity value in container exists"
			);
			equal(
				oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
				["SalesOrder"]
				["com.sap.vocabularies.Common.v1.DraftRoot"]
				["ActivationAction"]
				["String"],
				"AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities/Activate",
				"Sub Entity value in container exists"
			);
			
			ok(
				!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
				["SalesOrder"]
				["com.sap.vocabularies.Common.v1.DraftRoot"]
				["EditAction"],
				"Sub Entity value in container exists"
			);
			ok(
				!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
				["SalesOrder"]
				["com.sap.vocabularies.Common.v1.DraftRoot"]
				["EditAction"]
				["String"],
				"Sub Entity value in container exists"
			);
			equal(
				oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
				["SalesOrder"]
				["com.sap.vocabularies.Common.v1.DraftRoot"]
				["EditAction"]
				["String"],
				"AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities/Edit",
				"Sub Entity value in container exists"
			);
			
			ok(
				!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
				["SalesOrder"]
				["com.sap.vocabularies.Common.v1.DraftRoot"]
				["ValidationFunction"],
				"Sub Entity value in container exists"
			);
			ok(
				!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
				["SalesOrder"]
				["com.sap.vocabularies.Common.v1.DraftRoot"]
				["ValidationFunction"]
				["String"],
				"Sub Entity value in container exists"
			);
			equal(
				oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
				["SalesOrder"]
				["com.sap.vocabularies.Common.v1.DraftRoot"]
				["ValidationFunction"]
				["String"],
				"AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities/Validate",
				"Sub Entity value in container exists"
			);
			
			ok(
				!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
				["SalesOrder"]
				["com.sap.vocabularies.Common.v1.DraftRoot"]
				["PreparationAction"],
				"Sub Entity value in container exists"
			);
			ok(
				!!oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
				["SalesOrder"]
				["com.sap.vocabularies.Common.v1.DraftRoot"]
				["PreparationAction"]
				["String"],
				"Sub Entity value in container exists"
			);
			equal(
				oAnnotations["EntityContainer"]["AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities"]
				["SalesOrder"]
				["com.sap.vocabularies.Common.v1.DraftRoot"]
				["PreparationAction"]
				["String"],
				"AIVS_NEW_BO_SRV.AIVS_NEW_BO_SRV_Entities/Prepare",
				"Sub Entity value in container exists"
			);
			
			ok(
				!!oAnnotations["AIVS_NEW_BO_SRV.SalesOrderType"],
				"Entity in namespace exists"
			);
			ok(
				!!oAnnotations["AIVS_NEW_BO_SRV.SalesOrderType"]
				["com.sap.vocabularies.Common.v1.SemanticKey"],
				"Entity in namespace exists"
			);
			ok(
				!!oAnnotations["AIVS_NEW_BO_SRV.SalesOrderType"]
				["com.sap.vocabularies.Common.v1.SemanticKey"]
				[0],
				"Entity entries in namespace exists"
			);
			ok(
				!!oAnnotations["AIVS_NEW_BO_SRV.SalesOrderType"]
				["com.sap.vocabularies.Common.v1.SemanticKey"]
				[0]
				["PropertyPath"],
				"Property exists"
			);
			equal(
				oAnnotations["AIVS_NEW_BO_SRV.SalesOrderType"]
				["com.sap.vocabularies.Common.v1.SemanticKey"]
				[0]
				["PropertyPath"],
				"SalesOrderID",
				"Entity in namespace exists"
			);
			
			ok(
				!!oAnnotations["AIVS_NEW_BO_SRV.SalesOrderItemType"],
				"Entity in namespace exists"
			);
			ok(
				!!oAnnotations["AIVS_NEW_BO_SRV.SalesOrderItemType"]
				["com.sap.vocabularies.Common.v1.SemanticKey"],
				"Entity in namespace exists"
			);
			ok(
				!!oAnnotations["AIVS_NEW_BO_SRV.SalesOrderItemType"]
				["com.sap.vocabularies.Common.v1.SemanticKey"]
				[0],
				"Entity entries in namespace exists"
			);
			ok(
				!!oAnnotations["AIVS_NEW_BO_SRV.SalesOrderItemType"]
				["com.sap.vocabularies.Common.v1.SemanticKey"]
				[0]
				["PropertyPath"],
				"Property exists"
			);
			ok(
				!!oAnnotations["AIVS_NEW_BO_SRV.SalesOrderItemType"]
				["com.sap.vocabularies.Common.v1.SemanticKey"]
				[1]
				["PropertyPath"],
				"Property exists"
			);
			equal(
				oAnnotations["AIVS_NEW_BO_SRV.SalesOrderItemType"]
				["com.sap.vocabularies.Common.v1.SemanticKey"]
				[0]
				["PropertyPath"],
				"SalesOrderID",
				"Entity in namespace exists"
			);
			equal(
				oAnnotations["AIVS_NEW_BO_SRV.SalesOrderItemType"]
				["com.sap.vocabularies.Common.v1.SemanticKey"]
				[1]
				["PropertyPath"],
				"SalesOrderItemID",
				"Entity in namespace exists"
			);
			start();
		});
	});

	test("Simple Values", function() {
		expect(3);

		var mTest = mAdditionalTestsServices["Simple Values"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
			loadMetadataAsync: false
		};

		var oModel = new sap.ui.model.odata.ODataModel(sServiceURI, mModelOptions);
		var oMetadata = oModel.getServiceMetadata();
		var oAnnotations = oModel.getServiceAnnotations();

		ok(!!oMetadata, "Metadata is available.");

		ok(!!oAnnotations, "Annotations are available.");
		
		deepEqual(
			oAnnotations["SimpleValues.Test"]["com.sap.vocabularies.UI.v1.Name1"],
			oAnnotations["SimpleValues.Test"]["com.sap.vocabularies.UI.v1.Name2"],
			"Simple value attributes have the meaning as child elements"
		);
	});

	asyncTest("V2: Simple Values", function() {
		expect(3);

		var mTest = mAdditionalTestsServices["Simple Values"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: true,
		};

		var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceURI, mModelOptions);
		oModel.attachMetadataLoaded(function() {
			var oMetadata = oModel.getServiceMetadata();
			var oAnnotations = oModel.getServiceAnnotations();
			
			ok(!!oMetadata, "Metadata is available.");
			
			ok(!!oAnnotations, "Annotations are available.");
			
			deepEqual(
				oAnnotations["SimpleValues.Test"]["com.sap.vocabularies.UI.v1.Name1"],
				oAnnotations["SimpleValues.Test"]["com.sap.vocabularies.UI.v1.Name2"],
				"Simple value attributes have the meaning as child elements"
			);
			start();
		});
	});

	
	test("Collection with Namespace", function() {
		expect(6);

		var mTest = mAdditionalTestsServices["Collection with Namespace"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
			loadMetadataAsync: false
		};

		var oModel = new sap.ui.model.odata.ODataModel(sServiceURI, mModelOptions);
		var oMetadata = oModel.getServiceMetadata();
		var oAnnotations = oModel.getServiceAnnotations();

		ok(!!oMetadata, "Metadata is available.");

		ok(!!oAnnotations, "Annotations are available.");


		ok(!!oAnnotations["propertyAnnotations"], "propertyAnnotations exists");
		ok(!!oAnnotations["propertyAnnotations"]["CollectionWithNamespace.Test"], "propertyAnnotations Entry exists");
		ok(!!oAnnotations["propertyAnnotations"]["CollectionWithNamespace.Test"]["Value"], "propertyAnnotations Entry Value exists");

		deepEqual(
			oAnnotations["propertyAnnotations"]["CollectionWithNamespace.Test"]["Value"]["UI.TestNS"],
			oAnnotations["propertyAnnotations"]["CollectionWithNamespace.Test"]["Value"]["UI.TestNoNS"],
			"Collection with and without namespace have the same values"
		);

	});

	asyncTest("V2: Collection with Namespace", function() {
		expect(6);

		var mTest = mAdditionalTestsServices["Collection with Namespace"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: true,
		};

		var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceURI, mModelOptions);
		oModel.attachMetadataLoaded(function() {
			var oMetadata = oModel.getServiceMetadata();
			var oAnnotations = oModel.getServiceAnnotations();

			ok(!!oMetadata, "Metadata is available.");

			ok(!!oAnnotations, "Annotations are available.");


			ok(!!oAnnotations["propertyAnnotations"], "propertyAnnotations exists");
			ok(!!oAnnotations["propertyAnnotations"]["CollectionWithNamespace.Test"], "propertyAnnotations Entry exists");
			ok(!!oAnnotations["propertyAnnotations"]["CollectionWithNamespace.Test"]["Value"], "propertyAnnotations Entry Value exists");

			deepEqual(
				oAnnotations["propertyAnnotations"]["CollectionWithNamespace.Test"]["Value"]["UI.TestNS"],
				oAnnotations["propertyAnnotations"]["CollectionWithNamespace.Test"]["Value"]["UI.TestNoNS"],
				"Collection with and without namespace have the same values"
			);
			start();
		});
	});

	test("UrlRef", function() {
		expect(74);

		var mTest = mAdditionalTestsServices["UrlRef"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
			loadMetadataAsync: false
		};

		var oModel = new sap.ui.model.odata.ODataModel(sServiceURI, mModelOptions);
		var oMetadata = oModel.getServiceMetadata();
		var oAnnotations = oModel.getServiceAnnotations();

		ok(!!oMetadata, "Metadata is available.");

		ok(!!oAnnotations, "Annotations are available.");

		ok(!!oAnnotations["UrlTest"], "Main entry exists");

		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"], "Main entry exists");

		ok(jQuery.isArray(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"]), "Main entry is an array");

		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][0], "First entry exists");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][0]["Label"], "First entry Label exists");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][0]["Label"]["String"], "First entry Label String exists");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][0]["Label"]["String"], "ID", "First entry Label String has correct value");

		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][0]["Value"], "First entry Value exists");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][0]["Value"]["Path"], "First entry Value String exists");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][0]["Value"]["Path"], "BusinessPartnerID", "First entry Value BusinessPartnerID has correct value");

		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][0]["RecordType"], "First entry RecordType exists");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][0]["RecordType"], "com.sap.vocabularies.UI.v1.DataField", "First entry RecordType has correct value");


		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][1], "Second entry exists");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][1]["Label"], "Second entry Label exists");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][1]["Label"]["String"], "Second entry Label String exists");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][1]["Label"]["String"], "Address", "Second entry Label String has correct value");

		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][1]["Target"], "Second entry Target exists");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][1]["Target"]["AnnotationPath"], "Second entry Target AnnotationPath exists");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][1]["Target"]["AnnotationPath"], "@com.sap.vocabularies.Communication.v1.Address", "Second entry Target AnnotationPath has correct value");

		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][1]["RecordType"], "Second entry RecordType exists");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][1]["RecordType"], "com.sap.vocabularies.UI.v1.DataFieldForAnnotation", "Second entry RecordType has correct value");


		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2], "Third entry exists");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Label"], "Third entry Label exists");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Label"]["String"], "Third entry Label String exists");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Label"]["String"], "Link to", "Third entry Label String has correct value");

		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Value"], "Third entry Value exists");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Value"]["String"], "Third entry Value String exists");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Value"]["String"], "Google Maps", "Third entry Value String has correct value");

		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["RecordType"], "Third entry RecordType exists");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["RecordType"], "com.sap.vocabularies.UI.v1.DataFieldWithUrl", "Third entry RecordType has correct value");

		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2], "Third entry exists");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"], "Third entry Url exists");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"], "Third entry Url UrlRef exists");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"], "Third entry Url UrlRef Apply exists");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Name"], "Third entry Url UrlRef Apply Name exists");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"], "Third entry Url UrlRef Apply Parameters exists");
		ok(jQuery.isArray(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"]), "Third entry Url UrlRef Apply Parameters is an array");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"].length, 3, "Third entry Url UrlRef Apply Parameters is an array with 3 entries");

		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][0]["Type"], "Third entry Url UrlRef Apply First Parameter has Type");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][0]["Type"], "String", "Third entry Url UrlRef Apply First Parameter Type has correct value");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][0]["Value"], "Third entry Url UrlRef Apply First Parameter has Value");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][0]["Value"], "https://www.google.de/maps/place/{street},{city}", "Third entry Url UrlRef Apply First Parameter Type has correct value");


		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Type"], "Third entry Url UrlRef Apply First Parameter has Type");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Type"], "LabeledElement", "Third entry Url UrlRef Apply First Parameter Type has correct value");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Name"], "Third entry Url UrlRef Apply First Parameter has Name");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Name"], "street", "Third entry Url UrlRef Apply First Parameter Name has correct value");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"], "Third entry Url UrlRef Apply First Parameter has Value");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"], "Third entry Url UrlRef Apply First Parameter Value Apply");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"]["Name"], "Third entry Url UrlRef Apply First Parameter Value Apply Name");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"]["Name"], "odata.uriEncode", "Third entry Url UrlRef Apply First Parameter Value Apply Name has correct value");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"]["Parameters"], "Third entry Url UrlRef Apply First Parameter Value Apply Parameters");
		ok(jQuery.isArray(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"]["Parameters"]), "Third entry Url UrlRef Apply First Parameter Value Apply Parameters is array");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"]["Parameters"].length, 1, "Third entry Url UrlRef Apply First Parameter Value Apply has one Parameter");

		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"]["Parameters"][0]["Type"], "Third entry Url UrlRef Apply First Parameter Value Apply Parameters has Type");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"]["Parameters"][0]["Type"], "Path", "Third entry Url UrlRef Apply First Parameter Value Apply Parameters Type is Path");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"]["Parameters"][0]["Value"], "Third entry Url UrlRef Apply First Parameter Value Apply Parameters has Value");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"]["Parameters"][0]["Value"], "Address/Street", "Third entry Url UrlRef Apply First Parameter Value Apply Parameters Value is Address/Street");


		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Type"], "Third entry Url UrlRef Apply First Parameter has Type");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Type"], "LabeledElement", "Third entry Url UrlRef Apply First Parameter Type has correct value");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Name"], "Third entry Url UrlRef Apply First Parameter has Name");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Name"], "city", "Third entry Url UrlRef Apply First Parameter Name has correct value");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"], "Third entry Url UrlRef Apply First Parameter has Value");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"], "Third entry Url UrlRef Apply First Parameter Value Apply");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"]["Name"], "Third entry Url UrlRef Apply First Parameter Value Apply Name");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"]["Name"], "odata.uriEncode", "Third entry Url UrlRef Apply First Parameter Value Apply Name has correct value");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"]["Parameters"], "Third entry Url UrlRef Apply First Parameter Value Apply Parameters");
		ok(jQuery.isArray(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"]["Parameters"]), "Third entry Url UrlRef Apply First Parameter Value Apply Parameters is array");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"]["Parameters"].length, 1, "Third entry Url UrlRef Apply First Parameter Value Apply has one Parameter");

		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"]["Parameters"][0]["Type"], "Third entry Url UrlRef Apply First Parameter Value Apply Parameters has Type");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"]["Parameters"][0]["Type"], "Path", "Third entry Url UrlRef Apply First Parameter Value Apply Parameters Type is Path");
		ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"]["Parameters"][0]["Value"], "Third entry Url UrlRef Apply First Parameter Value Apply Parameters has Value");
		equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"]["Parameters"][0]["Value"], "Address/City", "Third entry Url UrlRef Apply First Parameter Value Apply Parameters Value is Address/City");
	});


	asyncTest("V2: UrlRef", function() {
		expect(74);

		var mTest = mAdditionalTestsServices["UrlRef"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: true,
		};

		var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceURI, mModelOptions);
		oModel.attachMetadataLoaded(function() {
			var oMetadata = oModel.getServiceMetadata();
			var oAnnotations = oModel.getServiceAnnotations();

			ok(!!oMetadata, "Metadata is available.");

			ok(!!oAnnotations, "Annotations are available.");

			ok(!!oAnnotations["UrlTest"], "Main entry exists");

			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"], "Main entry exists");

			ok(jQuery.isArray(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"]), "Main entry is an array");

			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][0], "First entry exists");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][0]["Label"], "First entry Label exists");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][0]["Label"]["String"], "First entry Label String exists");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][0]["Label"]["String"], "ID", "First entry Label String has correct value");

			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][0]["Value"], "First entry Value exists");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][0]["Value"]["Path"], "First entry Value String exists");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][0]["Value"]["Path"], "BusinessPartnerID", "First entry Value BusinessPartnerID has correct value");

			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][0]["RecordType"], "First entry RecordType exists");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][0]["RecordType"], "com.sap.vocabularies.UI.v1.DataField", "First entry RecordType has correct value");


			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][1], "Second entry exists");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][1]["Label"], "Second entry Label exists");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][1]["Label"]["String"], "Second entry Label String exists");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][1]["Label"]["String"], "Address", "Second entry Label String has correct value");

			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][1]["Target"], "Second entry Target exists");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][1]["Target"]["AnnotationPath"], "Second entry Target AnnotationPath exists");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][1]["Target"]["AnnotationPath"], "@com.sap.vocabularies.Communication.v1.Address", "Second entry Target AnnotationPath has correct value");

			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][1]["RecordType"], "Second entry RecordType exists");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][1]["RecordType"], "com.sap.vocabularies.UI.v1.DataFieldForAnnotation", "Second entry RecordType has correct value");


			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2], "Third entry exists");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Label"], "Third entry Label exists");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Label"]["String"], "Third entry Label String exists");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Label"]["String"], "Link to", "Third entry Label String has correct value");

			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Value"], "Third entry Value exists");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Value"]["String"], "Third entry Value String exists");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Value"]["String"], "Google Maps", "Third entry Value String has correct value");

			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["RecordType"], "Third entry RecordType exists");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["RecordType"], "com.sap.vocabularies.UI.v1.DataFieldWithUrl", "Third entry RecordType has correct value");

			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2], "Third entry exists");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"], "Third entry Url exists");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"], "Third entry Url UrlRef exists");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"], "Third entry Url UrlRef Apply exists");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Name"], "Third entry Url UrlRef Apply Name exists");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"], "Third entry Url UrlRef Apply Parameters exists");
			ok(jQuery.isArray(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"]), "Third entry Url UrlRef Apply Parameters is an array");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"].length, 3, "Third entry Url UrlRef Apply Parameters is an array with 3 entries");

			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][0]["Type"], "Third entry Url UrlRef Apply First Parameter has Type");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][0]["Type"], "String", "Third entry Url UrlRef Apply First Parameter Type has correct value");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][0]["Value"], "Third entry Url UrlRef Apply First Parameter has Value");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][0]["Value"], "https://www.google.de/maps/place/{street},{city}", "Third entry Url UrlRef Apply First Parameter Type has correct value");


			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Type"], "Third entry Url UrlRef Apply First Parameter has Type");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Type"], "LabeledElement", "Third entry Url UrlRef Apply First Parameter Type has correct value");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Name"], "Third entry Url UrlRef Apply First Parameter has Name");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Name"], "street", "Third entry Url UrlRef Apply First Parameter Name has correct value");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"], "Third entry Url UrlRef Apply First Parameter has Value");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"], "Third entry Url UrlRef Apply First Parameter Value Apply");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"]["Name"], "Third entry Url UrlRef Apply First Parameter Value Apply Name");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"]["Name"], "odata.uriEncode", "Third entry Url UrlRef Apply First Parameter Value Apply Name has correct value");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"]["Parameters"], "Third entry Url UrlRef Apply First Parameter Value Apply Parameters");
			ok(jQuery.isArray(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"]["Parameters"]), "Third entry Url UrlRef Apply First Parameter Value Apply Parameters is array");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"]["Parameters"].length, 1, "Third entry Url UrlRef Apply First Parameter Value Apply has one Parameter");

			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"]["Parameters"][0]["Type"], "Third entry Url UrlRef Apply First Parameter Value Apply Parameters has Type");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"]["Parameters"][0]["Type"], "Path", "Third entry Url UrlRef Apply First Parameter Value Apply Parameters Type is Path");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"]["Parameters"][0]["Value"], "Third entry Url UrlRef Apply First Parameter Value Apply Parameters has Value");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][1]["Value"]["Apply"]["Parameters"][0]["Value"], "Address/Street", "Third entry Url UrlRef Apply First Parameter Value Apply Parameters Value is Address/Street");


			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Type"], "Third entry Url UrlRef Apply First Parameter has Type");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Type"], "LabeledElement", "Third entry Url UrlRef Apply First Parameter Type has correct value");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Name"], "Third entry Url UrlRef Apply First Parameter has Name");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Name"], "city", "Third entry Url UrlRef Apply First Parameter Name has correct value");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"], "Third entry Url UrlRef Apply First Parameter has Value");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"], "Third entry Url UrlRef Apply First Parameter Value Apply");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"]["Name"], "Third entry Url UrlRef Apply First Parameter Value Apply Name");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"]["Name"], "odata.uriEncode", "Third entry Url UrlRef Apply First Parameter Value Apply Name has correct value");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"]["Parameters"], "Third entry Url UrlRef Apply First Parameter Value Apply Parameters");
			ok(jQuery.isArray(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"]["Parameters"]), "Third entry Url UrlRef Apply First Parameter Value Apply Parameters is array");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"]["Parameters"].length, 1, "Third entry Url UrlRef Apply First Parameter Value Apply has one Parameter");

			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"]["Parameters"][0]["Type"], "Third entry Url UrlRef Apply First Parameter Value Apply Parameters has Type");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"]["Parameters"][0]["Type"], "Path", "Third entry Url UrlRef Apply First Parameter Value Apply Parameters Type is Path");
			ok(!!oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"]["Parameters"][0]["Value"], "Third entry Url UrlRef Apply First Parameter Value Apply Parameters has Value");
			equal(oAnnotations["UrlTest"]["com.sap.vocabularies.UI.v1.Identification"][2]["Url"]["UrlRef"]["Apply"]["Parameters"][2]["Value"]["Apply"]["Parameters"][0]["Value"], "Address/City", "Third entry Url UrlRef Apply First Parameter Value Apply Parameters Value is Address/City");
			start();
		});
	});
	
	
	asyncTest("V2 only: Delayed Loading", function() {
		expect(22);

		var mTest = mAdditionalTestsServices["Delayed Loading"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations[0],
			json : true,
			loadAnnotationsJoined: false,
			loadMetadataAsync: true
		};

		var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceURI, mModelOptions);
		
		var bFirstLoad = true;
		oModel.attachAnnotationsLoaded(function() {
			if (!bFirstLoad) {
				// Only run further tests if this is the first annotation loading...
				return;
			}
			bFirstLoad = false;
			
			var oMetadata = oModel.getServiceMetadata();
			var oAnnotations = oModel.getServiceAnnotations();
			
			ok(!!oMetadata, "Metadata is available.");
			ok(Object.keys(oAnnotations).length > 0, "Annotations are available...");
			
			ok(!!oAnnotations["internal.ui5.test.MultipleAnnotations"], "Annoation Namespace exists and Alias has been replaced");
			ok(!!oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromAll"], "FromFirst namespace exists");
			ok(!!oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromAll"]["String"], "FromFirst annotation exists");

			ok(!!oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromFirst"], "FromFirst namespace exists");
			ok(!!oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromFirst"]["String"], "FromFirst annotation exists");
			
			equal(oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromAll"]["String"], "First", "FromAll annotation filled from first source");
			equal(oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromFirst"]["String"], "First", "FromFirst annotation filled from first source");
			
			oModel.addAnnotationUrl(mTest.annotations[1]).then(function(mResults) {
				ok(mResults.annotations === oAnnotations, "Second Annotations loaded...");
				
				ok(!!oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromSecond"], "FromSecond namespace exists");
				ok(!!oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromSecond"]["String"], "FromSecond annotation exists");

				equal(oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromAll"]["String"], "Second", "FromAll annotation filled from second source");
				equal(oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromFirst"]["String"], "First", "FromFirst annotation filled from first source");
				equal(oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromSecond"]["String"], "Second", "FromFirst annotation filled from Second source");
				
				oModel.addAnnotationUrl(mTest.annotations[2]).then(function(mResults) {
					ok(mResults.annotations === oAnnotations, "Third Annotations loaded...");

					ok(!!oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromThird"], "FromThird namespace exists");
					ok(!!oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromThird"]["String"], "FromThird annotation exists");
	
					equal(oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromAll"]["String"], "Third", "FromAll annotation filled from second source");
					equal(oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromFirst"]["String"], "First", "FromFirst annotation filled from first source");
					equal(oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromSecond"]["String"], "Second", "FromFirst annotation filled from Second source");
					equal(oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromThird"]["String"], "Third", "FromFirst annotation filled from Second source");
					
					start();
					
				}).catch(function(mResults) {
					ok(false, "Third Annotations could not be loaded...")
				})	
			}).catch(function(mResults) {
				ok(false, "Second Annotations could not be loaded...")
			})
		});
	});
	
	asyncTest("V2 only: Delayed Parsing", function() {
		expect(26);

		var mTest = mAdditionalTestsServices["Delayed Loading"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : null,
			json : true,
			loadAnnotationsJoined: false,
			loadMetadataAsync: true
		};

		var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceURI, mModelOptions);


		var sFirstAnnotations  = jQuery.sap.syncGet(mTest.annotations[0]).data;
		ok(sFirstAnnotations.indexOf("<?xml") === 0, "First annotation file data loaded");

		var sSecondAnnotations = jQuery.sap.syncGet(mTest.annotations[1]).data;
		ok(sSecondAnnotations.indexOf("<?xml") === 0, "Second annotation file data loaded");

		var sThirdAnnotations  = jQuery.sap.syncGet(mTest.annotations[2]).data;
		ok(sThirdAnnotations.indexOf("<?xml") === 0, "Third annotation file data loaded");
		
		
		// TODO: Change internal access from oModel.oMetadata to offial API when available...
		oModel.oMetadata.loaded().then(function() {
			var oMetadata = oModel.getServiceMetadata();
			var oAnnotations = oModel.getServiceAnnotations();
			
			ok(!!oMetadata, "Metadata is available.");
			ok(!oAnnotations, "Annotations are not available...");
			
			oModel.addAnnotationXML(sFirstAnnotations).then(function(mResults) {
				ok(!!mResults.annotations, "First Annotations loaded...");
				oAnnotations = mResults.annotations
				
				ok(!!oAnnotations["internal.ui5.test.MultipleAnnotations"], "Annoation Namespace exists and Alias has been replaced");
				ok(!!oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromAll"], "FromFirst namespace exists");
				ok(!!oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromAll"]["String"], "FromFirst annotation exists");

				ok(!!oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromFirst"], "FromFirst namespace exists");
				ok(!!oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromFirst"]["String"], "FromFirst annotation exists");
				
				equal(oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromAll"]["String"], "First", "FromAll annotation filled from first source");
				equal(oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromFirst"]["String"], "First", "FromFirst annotation filled from first source");
				
				oModel.addAnnotationXML(sSecondAnnotations).then(function(mResults) {
					ok(mResults.annotations === oAnnotations, "Second Annotations loaded...");
					
					ok(!!oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromSecond"], "FromSecond namespace exists");
					ok(!!oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromSecond"]["String"], "FromSecond annotation exists");

					equal(oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromAll"]["String"], "Second", "FromAll annotation filled from second source");
					equal(oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromFirst"]["String"], "First", "FromFirst annotation filled from first source");
					equal(oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromSecond"]["String"], "Second", "FromFirst annotation filled from Second source");
					
					oModel.addAnnotationXML(sThirdAnnotations).then(function(mResults) {
						ok(mResults.annotations === oAnnotations, "Third Annotations loaded...");

						ok(!!oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromThird"], "FromThird namespace exists");
						ok(!!oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromThird"]["String"], "FromThird annotation exists");
		
						equal(oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromAll"]["String"], "Third", "FromAll annotation filled from second source");
						equal(oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromFirst"]["String"], "First", "FromFirst annotation filled from first source");
						equal(oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromSecond"]["String"], "Second", "FromFirst annotation filled from Second source");
						equal(oAnnotations["internal.ui5.test.MultipleAnnotations"]["internal.ui5.test.FromThird"]["String"], "Third", "FromFirst annotation filled from Second source");
						
						start();
						
					}).catch(function(mResults) {
						ok(false, "Third Annotations could not be parsed...")
						start();
					})	
				}).catch(function(mResults) {
					ok(false, "Second Annotations could not be parsed...")
					start();
				})
			}).catch(function(mResults) {
				ok(false, "First Annotations could not be parsed...")
				start();
			});
		}).catch(function() {
			ok(false, "Metadata could not be loaded...")
			start();
		});
	});


	
	test("Alias Replacement", function() {
		expect(11);

		var mTest = mAdditionalTestsServices["Alias Replacement"];
		var sServiceURI = mTest.service;
		var mModelOptions = {
			annotationURI : mTest.annotations,
			json : true,
			loadAnnotationsJoined: false,
			loadMetadataAsync: false
		};

		var oModel = new sap.ui.model.odata.ODataModel(sServiceURI, mModelOptions);
		var oMetadata = oModel.getServiceMetadata();
		var oAnnotations = oModel.getServiceAnnotations();

		ok(!!oMetadata, "Metadata is available.");

		ok(!!oAnnotations, "Annotations are available.");

		
		
		ok(!!oAnnotations["Test.AliasReplacement"], "Namespace is available.");
		ok(!!oAnnotations["Test.AliasReplacement"]["TestAnnotation"], "Annotation is available.");
		
		
		ok(!!oAnnotations["Test.AliasReplacement"]["TestAnnotation"]["NotReplaced"], "First Entry is available.");
		ok(!!oAnnotations["Test.AliasReplacement"]["TestAnnotation"]["NotReplaced"][0], "First Entry array is available.");
		ok(!!oAnnotations["Test.AliasReplacement"]["TestAnnotation"]["NotReplaced"][0]["AnnotationPath"], "First Entry value is available.");
		equal(oAnnotations["Test.AliasReplacement"]["TestAnnotation"]["NotReplaced"][0]["AnnotationPath"], "@internal.ui5.test.Value", "First Entry value is correct.");
		
		ok(!!oAnnotations["Test.AliasReplacement"]["TestAnnotation"]["Replaced"], "Second Entry is available.");
		ok(!!oAnnotations["Test.AliasReplacement"]["TestAnnotation"]["Replaced"]["AnnotationPath"], "Second Entry value is available.");
		equal(oAnnotations["Test.AliasReplacement"]["TestAnnotation"]["Replaced"]["AnnotationPath"], "@internal.ui5.test.Value", "Second Entry value is correct.");
	});
}