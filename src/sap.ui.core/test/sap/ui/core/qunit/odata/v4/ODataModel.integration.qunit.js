/*!
 * ${copyright}
 */
sap.ui.require([
	"jquery.sap.global",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/odata/OperationMode",
	"sap/ui/model/odata/v4/ODataModel",
	"sap/ui/model/Sorter",
	"sap/ui/test/TestUtils"
], function (jQuery, Filter, FilterOperator, OperationMode, ODataModel, Sorter, TestUtils) {
	/*global QUnit, sinon */
	/*eslint max-nested-callbacks: 0, no-warning-comments: 0 */
	"use strict";

	/**
	 * Creates a V4 OData model.
	 *
	 * @param {string} sServiceUrl The service URL
	 * @param {object} [mModelParameters] Map of parameters for model construction to enhance and
	 *   potentially overwrite the parameters groupId, operationMode, serviceUrl,
	 *   synchronizationMode which are set by default
	 * @returns {sap.ui.model.odata.v4.ODataModel} The model
	 */
	function createModel(sServiceUrl, mModelParameters) {
		var mDefaultParameters = {
				groupId : "$direct",
				operationMode : OperationMode.Server,
				serviceUrl : TestUtils.proxy(sServiceUrl),
				synchronizationMode : "None"
			};

		return new ODataModel(jQuery.extend(mDefaultParameters, mModelParameters));
	}

	/**
	 * Creates a V4 OData model for <code>TEA_BUSI</code>.
	 *
	 * @param {object} [mModelParameters] Map of parameters for model construction to enhance and
	 *   potentially overwrite the parameters groupId, operationMode, serviceUrl,
	 *   synchronizationMode which are set by default
	 * @returns {sap.ui.model.odata.v4.ODataModel} The model
	 */
	function createTeaBusiModel(mModelParameters) {
		return createModel("/sap/opu/odata4/IWBEP/TEA/default/IWBEP/TEA_BUSI/0001/",
			mModelParameters);
	}

	/**
	 * Creates a V4 OData model for <code>GWSAMPLE_BASIC</code>.
	 *
	 * @param {object} [mModelParameters] Map of parameters for model construction to enhance and
	 *   potentially overwrite the parameters groupId, operationMode, serviceUrl,
	 *   synchronizationMode which are set by default
	 * @returns {ODataModel} The model
	 */
	function createSalesOrdersModel(mModelParameters) {
		return createModel(
			"/sap/opu/odata4/IWBEP/V4_SAMPLE/default/IWBEP/V4_GW_SAMPLE_BASIC/0001/",
			mModelParameters);
	}

	//*********************************************************************************************
	QUnit.module("sap.ui.model.odata.v4.ODataModel.integration", {
		beforeEach : function () {
			this.oSandbox = sinon.sandbox.create();
			TestUtils.setupODataV4Server(this.oSandbox, {
				"/sap/opu/odata4/IWBEP/TEA/default/IWBEP/TEA_BUSI/0001/$metadata"
					: {source : "metadata.xml"},
				"/sap/opu/odata4/IWBEP/V4_SAMPLE/default/IWBEP/V4_GW_SAMPLE_BASIC/0001/$metadata"
					: {source : "metadata_GW_SAMPLE_BASIC.xml"}
			});
			this.oLogMock = this.oSandbox.mock(jQuery.sap.log);
			this.oLogMock.expects("warning").never();
			this.oLogMock.expects("error").never();

			// {map<string, string[]>}
			// this.mChanges["id"] is a list of expected changes for the property "text" of the
			// control with ID "id"
			this.mChanges = {};
			// {map<string, string[][]>}
			// this.mListChanges["id"][i] is a list of expected changes for the property "text" of
			// the control with ID "id" in row i
			this.mListChanges = {};
			// A list of expected requests with the properties method, url, headers, response
			this.aRequests = [];
		},

		afterEach : function () {
			this.oSandbox.verifyAndRestore();
			// avoid calls to formatters by UI5 localization changes in later tests
			this.oView.destroy();
			this.oModel.destroy();
		},

		/**
		 * Finishes the test if no pending changes are left.
		 */
		checkFinish : function () {
			var sControlId, i;

			for (sControlId in this.mChanges) {
				if (this.mChanges[sControlId].length) {
					return;
				}
			}
			for (sControlId in this.mListChanges) {
				// Note: This may be a sparse array
				for (i in this.mListChanges[sControlId]) {
					if (this.mListChanges[sControlId][i].length) {
						return;
					}
				}
			}
			if (this.resolve) {
				this.resolve();
			}
		},

		/**
		 * Creates the view and attaches it to the model. Checks that the expected requests (see
		 * {@link #expectRequest} are fired and the controls got the expected changes (see
		 * {@link #expectChange}).
		 *
		 * @param {object} assert The QUnit assert object
		 * @param {string} sViewXML The view content as XML
		 * @param {sap.ui.model.odata.v4.ODataModel} [oModel] The model; it is attached to the view
		 *   and to the test instance.
		 *   If no model is given, the <code>TEA_BUSI</code> model is created and used.
		 * @returns {Promise} A promise that is resolved when the view is created and all expected
		 *   values for controls have been set
		 */
		createView : function (assert, sViewXML, oModel) {
			var that = this;

			/*
			 * Stub function for _Requestor.request. Checks that the expected request arrived and
			 * returns a promise for its response.
			 */
			function checkRequest(sMethod, sUrl, sGroupId, mHeaders, oPayload) {
				var oActualRequest = {
						method : sMethod,
						url : sUrl,
						headers : mHeaders,
						payload : oPayload
					},
					oExpectedRequest = that.aRequests.shift(),
					oResponse;

				if (!oExpectedRequest) {
					assert.ok(false, sMethod + " " + sUrl + " (unexpected)");
				} else {
					oResponse = oExpectedRequest.response;
					delete oExpectedRequest.response;
					assert.deepEqual(oActualRequest, oExpectedRequest, sMethod + " " + sUrl);
				}
				return Promise.resolve(oResponse);
			}

			/*
			 * Checks that the given value is the expected one for the control.
			 */
			function checkValue(sValue, sControlId, i) {
				var aExpectedValues = i === undefined ? that.mChanges[sControlId]
						: that.mListChanges[sControlId][i],
					sVisibleId = i === undefined ? sControlId : sControlId + "[" + i + "]";

				if (!aExpectedValues.length) {
					assert.ok(false, sVisibleId + ": " + JSON.stringify(sValue) + " (unexpected)");
				} else  {
					assert.strictEqual(sValue, aExpectedValues.shift(),
						sVisibleId + ": " + JSON.stringify(sValue));
				}
				that.checkFinish();
			}

			this.oModel = oModel || createTeaBusiModel();
			this.stub(this.oModel.oRequestor, "request", checkRequest);
			//assert.ok(true, sViewXML); // uncomment to see XML in output, in case of parse issues
			this.oView = sap.ui.xmlview({
				viewContent : '<mvc:View xmlns="sap.m" xmlns:form="sap.ui.layout.form" '
					+ 'xmlns:mvc="sap.ui.core.mvc">'
					+ sViewXML
					+ '</mvc:View>'
			});
			Object.keys(this.mChanges).forEach(function (sControlId) {
				that.oView.byId(sControlId).getBindingInfo("text").formatter = function (sValue) {
					checkValue(sValue, sControlId);
				};
			});
			Object.keys(this.mListChanges).forEach(function (sControlId) {
				that.oView.byId(sControlId).getBindingInfo("text").formatter = function (sValue) {
					checkValue(sValue, sControlId, this.getBindingContext().getIndex());
				};
			});

			this.oView.setModel(that.oModel);
			return this.waitForChanges(assert);
		},

		/**
		 * The following code (either {@link #createView} or anything before
		 * {@link #waitForChanges}) is expected to set a value (or multiple values) at the property
		 * "text" of the control with the given ID. <code>vValue</code> must be a list with expected
		 * values for each row if the control is created via a template in a list.
		 *
		 * You must call the function before {@link #createView}, even if you do not expect a change
		 * to the control's value initially. This is necessary because createView must attach a
		 * formatter function to the binding info before the bindings are created in order to see
		 * the change. If you do not expect a value initially, leave out the vValue parameter.
		 *
		 * Examples:
		 * this.expectChange("foo", "bar"); // expect value "bar" for the control with id "foo"
		 * this.expectChange("foo"); // listen to changes for the control with id "foo", but do not
		 *                           // expect a change (in createView)
		 * this.expectChange("foo", ["a", "b"]); // expect values for two rows of the control with
		 *                                       // id "foo"
		 * this.expectChange("foo", "c", 2); // expect value "c" for control with id "foo" in row 2
		 * this.expectChange("foo", "bar").expectChange("foo", "baz"); // expect 2 changes for "foo"
		 *
		 * @param {string} sControlId The control ID
		 * @param {string|string[]} [vValue] The expected value or a list of expected values
		 * @param {number} [iRow] The row index in case that a change is expected for a single row
		 *   of a list (in this case <code>vValue</code> must be a string)
		 * @returns {object} The test instance for chaining
		 */
		expectChange : function (sControlId, vValue, iRow) {
			var aExpectations, i;

			// Ensures that oObject[vProperty] is an array and returns it
			function array(oObject, vProperty) {
				oObject[vProperty] = oObject[vProperty] || [];
				return oObject[vProperty];
			}

			if (Array.isArray(vValue)) {
				aExpectations = array(this.mListChanges, sControlId);
				for (i = 0; i < vValue.length; i += 1) {
					array(aExpectations, i).push(vValue[i]);
				}
			} else if (arguments.length === 3) {
				// This may create a sparse array this.mListChanges[sControlId]
				array(array(this.mListChanges, sControlId), iRow).push(vValue);
			} else {
				aExpectations = array(this.mChanges, sControlId);
				if (arguments.length > 1) {
					aExpectations.push(vValue);
				}
			}
			return this;
		},

		/**
		 * The following code (either {@link #createView} or anything before
		 * {@link #waitForChanges}) is expected to perform the given request.
		 *
		 * @param {string|object} vRequest The request with the properties "method", "url" and
		 *   "headers". A string is interpreted as URL with method "GET".
		 * @param {object} [oResponse] The response message to be returned from the requestor.
		 * @returns {object} The test instance for chaining
		 */
		expectRequest : function (vRequest, oResponse) {
			if (typeof vRequest === "string") {
				vRequest = {
					method : "GET",
					url : vRequest
				};
			}
			// ensure that these properties are defined (required for deepEqual)
			vRequest.headers = vRequest.headers || undefined;
			vRequest.payload = vRequest.payload || undefined;
			vRequest.response = oResponse;
			this.aRequests.push(vRequest);
			return this;
		},

		/**
		 * Waits for the expected changes.
		 *
		 * @param {object} assert The QUnit assert object
		 * @returns {Promise} A promise that is resolved when all expected values for controls have
		 *   been set
		 */
		waitForChanges : function (assert) {
			var that = this;

			return new Promise(function (resolve) {
				that.resolve = resolve;
				// After one second everything should have run through
				// Resolve to have the missing requests and changes reported
				window.setTimeout(resolve, 1000);
				that.checkFinish();
			}).then(function () {
				var sControlId, i, j;

				// Report missing requests
				that.aRequests.forEach(function (oRequest) {
					assert.ok(false, oRequest.method + " " + oRequest.url + " (not requested)");
				});
				// Report missing changes
				for (sControlId in that.mChanges) {
					for (i in that.mChanges[sControlId]) {
						assert.ok(false, sControlId + ": " + that.mChanges[sControlId][i]
							+ " (not set)");
					}
				}
				for (sControlId in that.mListChanges) {
					// Note: This may be a sparse array
					for (i in that.mListChanges[sControlId]) {
						for (j in that.mListChanges[sControlId][i]) {
							assert.ok(false, sControlId + "[" + i + "]: "
								+ that.mListChanges[sControlId][i][j] + " (not set)");
						}
					}
				}
			});
		}
	});

	/*
	 * Creates a test with the given title and executes viewStart with the given parameters.
	 */
	function testViewStart(sTitle, sView, mResponseByRequest, mValueByControl, oModel) {

		QUnit.test(sTitle, function (assert) {
			var sControlId, sRequest;

			for (sRequest in mResponseByRequest) {
				this.expectRequest(sRequest, mResponseByRequest[sRequest]);
			}
			for (sControlId in mValueByControl) {
				this.expectChange(sControlId, mValueByControl[sControlId]);
			}
			return this.createView(assert, sView, oModel);
		});
	}

	//*********************************************************************************************
	// Scenario: Minimal test for an absolute ODataPropertyBinding. This scenario is comparable with
	// "FavoriteProduct" in the SalesOrders application.
	testViewStart("Absolute ODPB",
		'<Text id="text" text="{/EMPLOYEES(\'2\')/Name}" />',
		{"EMPLOYEES('2')/Name" : {"value" : "Frederic Fall"}},
		{"text" : "Frederic Fall"}
	);

	//*********************************************************************************************
	// Scenario: Minimal test for an absolute ODataContextBinding without own parameters containing
	// a relative ODataPropertyBinding. The SalesOrders application does not have such a scenario.
	testViewStart("Absolute ODCB w/o parameters with relative ODPB", '\
<form:SimpleForm binding="{/EMPLOYEES(\'2\')}">\
	<Text id="text" text="{Name}" />\
</form:SimpleForm>',
		{"EMPLOYEES('2')" : {"Name" : "Frederic Fall"}},
		{"text" : "Frederic Fall"}
	);

	//*********************************************************************************************
	// Scenario: Minimal test for an absolute ODataContextBinding with own parameters containing
	// a relative ODataPropertyBinding. The SalesOrders application does not have such a scenario.
	testViewStart("Absolute ODCB with parameters and relative ODPB", '\
<form:SimpleForm binding="{path : \'/EMPLOYEES(\\\'2\\\')\', parameters : {$select : \'Name\'}}">\
	<Text id="text" text="{Name}" />\
</form:SimpleForm>',
		{"EMPLOYEES('2')?$select=Name" : {"Name" : "Frederic Fall"}},
		{"text" : "Frederic Fall"}
	);

	//*********************************************************************************************
	// Scenario: Minimal test for an absolute ODataListBinding without own parameters containing
	// a relative ODataPropertyBinding. This scenario is comparable with the suggestion list for
	// the "Buyer ID" while creating a new sales order in the SalesOrders application.
	// * Start the application and click on "Create sales order" button.
	// * Open the suggestion list for the "Buyer ID"
	testViewStart("Absolute ODLB w/o parameters and relative ODPB", '\
<Table items="{/EMPLOYEES}">\
	<items>\
		<ColumnListItem>\
			<cells>\
				<Text id="text" text="{Name}" />\
			</cells>\
		</ColumnListItem>\
	</items>\
</Table>',
		{"EMPLOYEES?$skip=0&$top=100" :
			{"value" : [{"Name" : "Frederic Fall"}, {"Name" : "Jonathan Smith"}]}},
		{"text" : ["Frederic Fall", "Jonathan Smith"]}
	);

	//*********************************************************************************************
	// Scenario: Minimal test for an absolute ODataListBinding with own parameters containing
	// a relative ODataPropertyBinding. This scenario is comparable with the "Sales Orders" list in
	// the SalesOrders application.
	testViewStart("Absolute ODLB with parameters and relative ODPB", '\
<Table items="{path : \'/EMPLOYEES\', parameters : {$select : \'Name\'}}">\
	<items>\
		<ColumnListItem>\
			<cells>\
				<Text id="text" text="{Name}" />\
			</cells>\
		</ColumnListItem>\
	</items>\
</Table>',
		{"EMPLOYEES?$select=Name&$skip=0&$top=100" :
			{"value" : [{"Name" : "Frederic Fall"}, {"Name" : "Jonathan Smith"}]}},
		{"text" : ["Frederic Fall", "Jonathan Smith"]}
	);

	//*********************************************************************************************
	// Scenario: Static and dynamic filters and sorters at absolute ODataListBindings influence
	// the query. This scenario is comparable with the "Sales Orders" list in the SalesOrders
	// application.
	// * Static filters ($filter system query option) are and-combined with dynamic filters (filter
	//   parameter)
	// * Static sorters ($orderby system query option) are appended to dynamic sorters (sorter
	//   parameter)
	testViewStart("Absolute ODLB with Filters and Sorters with relative ODPB", '\
<Table items="{path : \'/EMPLOYEES\', parameters : {\
			$select : \'Name\',\
			$filter : \'TEAM_ID eq 42\',\
			$orderby : \'Name desc\'\
		},\
		filters : {path: \'AGE\', operator: \'GT\', value1: 21},\
		sorter : {path : \'AGE\'}\
	}">\
	<items>\
		<ColumnListItem>\
			<cells>\
				<Text id="text" text="{Name}" />\
			</cells>\
		</ColumnListItem>\
	</items>\
</Table>',
		{"EMPLOYEES?$select=Name&$filter=(AGE%20gt%2021)%20and%20(TEAM_ID%20eq%2042)&$orderby=AGE,Name%20desc&$skip=0&$top=100" :
			{"value" : [{"Name" : "Frederic Fall"}, {"Name" : "Jonathan Smith"}]}},
		{"text" : ["Frederic Fall", "Jonathan Smith"]}
	);

	//*********************************************************************************************
	// Scenario: Nested list binding with own parameters causes a second request.
	// This scenario is similar to the "Sales Order Line Items" in the SalesOrders application.
	testViewStart("Absolute ODCB with parameters and relative ODLB with parameters", '\
<form:SimpleForm binding="{path : \'/EMPLOYEES(\\\'2\\\')\', parameters : {$select : \'Name\'}}">\
	<Text id="name" text="{Name}" />\
	<Table items="{path : \'EMPLOYEE_2_EQUIPMENTS\', parameters : {$select : \'Category\'}}">\
		<items>\
			<ColumnListItem>\
				<cells>\
					<Text id="category" text="{Category}" />\
				</cells>\
			</ColumnListItem>\
		</items>\
	</Table>\
</form:SimpleForm>',
		{
			"EMPLOYEES('2')?$select=Name" : {"Name" : "Frederic Fall"},
			"EMPLOYEES('2')/EMPLOYEE_2_EQUIPMENTS?$select=Category&$skip=0&$top=100" :
				{"value" : [{"Category" : "Electronics"}, {"Category" : "Furniture"}]}
		},
		{"name" : "Frederic Fall", "category" : ["Electronics", "Furniture"]}
	);

	//*********************************************************************************************
	// Scenario: Function import.
	// This scenario is similar to the "Favorite product ID" in the SalesOrders application. In the
	// SalesOrders application the binding context is set programmatically. This example directly
	// triggers the function import.
	testViewStart("FunctionImport", '\
<form:SimpleForm binding="{/GetEmployeeByID(EmployeeID=\'2\')}">\
	<Text id="text" text="{Name}" />\
</form:SimpleForm>',
		{"GetEmployeeByID(EmployeeID='2')" : {"Name" : "Frederic Fall"}},
		{"text" : "Frederic Fall"}
	);

	//*********************************************************************************************
	// Scenario: inherit query options (see ListBinding sample application)
	// If there is a relative binding without an own cache and the parent binding defines $orderby
	// or $filter for that binding, then these values need to be considered if that binding gets
	// dynamic filters or sorters.
	// See ListBinding sample application:
	// * Start the application; the employee list of the team is initially sorted by "City"
	// * Sort by any other column (e.g. "Employee Name" or "Age") and check that the "City" is taken
	//   as a secondary sort criterion
	// In this test dynamic filters are used instead of dynamic sorters
	QUnit.test("Relative ODLB inherits parent OBCB's query options on filter", function (assert) {
		var sView = '\
<form:SimpleForm binding="{path : \'/TEAMS(42)\',\
		parameters : {$expand : {TEAM_2_EMPLOYEES : {$orderby : \'AGE\', $select : \'Name\'}}}}">\
	<Table id="table" items="{TEAM_2_EMPLOYEES}">\
		<items>\
			<ColumnListItem>\
				<cells>\
					<Text id="text" text="{Name}" />\
				</cells>\
			</ColumnListItem>\
		</items>\
	</Table>\
</form:SimpleForm>',
			that = this;

		this.expectRequest("TEAMS(42)?$expand=TEAM_2_EMPLOYEES($orderby=AGE;$select=Name)", {
				"TEAM_2_EMPLOYEES" : [
					{"Name" : "Frederic Fall"},
					{"Name" : "Jonathan Smith"},
					{"Name" : "Peter Burke"}
				]
			})
			.expectChange("text", ["Frederic Fall", "Jonathan Smith", "Peter Burke"]);
		return this.createView(assert, sView).then(function () {
			that.expectRequest(
					"TEAMS(42)/TEAM_2_EMPLOYEES?$orderby=AGE&$select=Name&$filter=AGE%20gt%2042"
						+ "&$skip=0&$top=100",
					{"value" : [{"Name" : "Frederic Fall"}, {"Name" : "Peter Burke"}]})
				.expectChange("text", "Peter Burke", 1);

			// code under test
			that.oView.byId("table").getBinding("items")
				.filter(new Filter("AGE", FilterOperator.GT, 42));
			return that.waitForChanges(assert);
		});
	});

	//*********************************************************************************************
	// Scenario: Sort a list and select a list entry to see details
	// See SalesOrders application:
	// * Start the application with realOData=true so that sorting by "Gross Amount" is enabled
	// * Sort by "Gross Amount"
	// * Select a sales order and see that sales order details are fitting to the selected sales
	//   order
	// This test is a simplification of that scenario with a different service.
	QUnit.test("Absolute ODLB with sort, relative ODCB resolved on selection", function (assert) {
		var sView = '\
<Table id="table" items="{path : \'/EMPLOYEES\', parameters : {$expand : \'EMPLOYEE_2_MANAGER\'}}">\
	<items>\
		<ColumnListItem>\
			<cells>\
				<Text id="name" text="{Name}" />\
			</cells>\
		</ColumnListItem>\
	</items>\
</Table>\
<form:SimpleForm id="form" binding="{EMPLOYEE_2_MANAGER}">\
	<Text id="id" text="{ID}" />\
</form:SimpleForm>',
			that = this;

		this.expectRequest("EMPLOYEES?$expand=EMPLOYEE_2_MANAGER&$skip=0&$top=100", {
				"value" : [
					{"Name" : "Jonathan Smith", "EMPLOYEE_2_MANAGER" : {"ID" : "2"}},
					{"Name" : "Frederic Fall", "EMPLOYEE_2_MANAGER" : {"ID" : "1"}}
				]
			})
			.expectChange("id")
			.expectChange("name", ["Jonathan Smith", "Frederic Fall"]);

		return this.createView(assert, sView).then(function () {
			that.expectRequest(
				"EMPLOYEES?$expand=EMPLOYEE_2_MANAGER&$orderby=Name&$skip=0&$top=100", {
					"value" : [
						{"Name" : "Frederic Fall", "EMPLOYEE_2_MANAGER" : {"ID" : "1"}},
						{"Name" : "Jonathan Smith", "EMPLOYEE_2_MANAGER" : {"ID" : "2"}}
					]
				})
				.expectChange("name", ["Frederic Fall", "Jonathan Smith"]);

			// code under test
			that.oView.byId("table").getBinding("items").sort(new Sorter("Name"));

			return that.waitForChanges(assert);
		}).then(function () {
			that.expectChange("id", "2");

			// code under test
			that.oView.byId("form").setBindingContext(
				that.oView.byId("table").getBinding("items").getCurrentContexts()[1]);

			return that.waitForChanges(assert);
		}).then(function () {
// TODO Why is formatter on property binding in form called twice for the below?
			that.expectChange("id", "1")
				.expectChange("id", "1");

			// code under test
			that.oView.byId("form").setBindingContext(
				that.oView.byId("table").getBinding("items").getCurrentContexts()[0]);

			return that.waitForChanges(assert);
		});
	});

	//*********************************************************************************************
	// Scenario: Refresh an ODataListBinding
	// See SalesOrders application:
	// * Start the application
	// * Click on "Refresh sales orders" button
	// This test is a simplification of that scenario with a different service.
	QUnit.test("Absolute ODLB refresh", function (assert) {
		var sView = '\
<Table id="table" items="{/EMPLOYEES}">\
	<items>\
		<ColumnListItem>\
			<cells>\
				<Text id="name" text="{Name}" />\
			</cells>\
		</ColumnListItem>\
	</items>\
</Table>',
			that = this;

		this.expectRequest("EMPLOYEES?$skip=0&$top=100", {
				"value" : [
					{"Name" : "Jonathan Smith"},
					{"Name" : "Frederic Fall"}
				]
			})
			.expectChange("name", ["Jonathan Smith", "Frederic Fall"]);

		return this.createView(assert, sView).then(function () {
			that.expectRequest("EMPLOYEES?$skip=0&$top=100", {
					"value" : [
						{"Name" : "Frederic Fall"},
						{"Name" : "Peter Burke"}
					]
				})
				.expectChange("name", ["Frederic Fall", "Peter Burke"]);

			// code under test
			that.oView.byId("table").getBinding("items").refresh();

			return that.waitForChanges(assert);
		});
	});

	//*********************************************************************************************
	// Scenario: Refresh an ODataContextBinding
	// The SalesOrders application does not have such a scenario.
	QUnit.test("Absolute ODCB refresh", function (assert) {
		var sView = '\
<form:SimpleForm id="form" binding="{/EMPLOYEES(\'2\')}">\
	<Text id="text" text="{Name}" />\
</form:SimpleForm>',
			that = this;

		this.expectRequest("EMPLOYEES('2')", {"Name" : "Jonathan Smith"})
			.expectChange("text", "Jonathan Smith");

		return this.createView(assert, sView).then(function () {
			that.expectRequest("EMPLOYEES('2')", {"Name" : "Jonathan Smith"})
				.expectChange("text", "Jonathan Smith");

			// code under test
			that.oView.byId("form").getObjectBinding().refresh();

			return that.waitForChanges(assert);
		});
	});

	//*********************************************************************************************
	// Scenario: Refresh an ODataPropertyBinding
	// See SalesOrders application:
	// * Start the application
	// * Click on "Refresh favorite product" button
	// This test is a simplification of that scenario with a different service.
	QUnit.test("Absolute ODPB refresh", function (assert) {
		var sView = '<Text id="name" text="{/EMPLOYEES(\'2\')/Name}" />',
			that = this;

		this.expectRequest("EMPLOYEES('2')/Name", {"value" : "Jonathan Smith"})
			.expectChange("name", "Jonathan Smith");

		return this.createView(assert, sView).then(function () {
			that.expectRequest("EMPLOYEES('2')/Name", {"value" : "Jonathan Schmidt"})
				.expectChange("name", "Jonathan Schmidt");

			// code under test
			that.oView.byId("name").getBinding("text").refresh();

			return that.waitForChanges(assert);
		});
	});

	//*********************************************************************************************
	// Scenario: Action Imports
	// See ListBinding application:
	// * Start the application
	// * Click on "Budget" button
	// * In the "Change Team Budget" dialog enter a "Budget" and press "Change" button
	QUnit.test("ActionImport", function (assert) {
		var sView = '\
<form:SimpleForm id="form" binding="{/ChangeTeamBudgetByID(...)}">\
	<Text id="name" text="{Name}" />\
</form:SimpleForm>',
			that = this;

		//TODO Why is formatter called with null and not undefined?
		this.expectChange("name", null);

		return this.createView(assert, sView).then(function () {
			that.expectRequest({
					method : "POST",
					url : "ChangeTeamBudgetByID",
					headers : {"If-Match" : undefined},
					payload : {"Budget" : "1234.1234", "TeamID" : "TEAM_01"}
				}, {"Name" : "Business Suite"})
				.expectChange("name", "Business Suite");

			// code under test
			that.oView.byId("form").getObjectBinding()
				.setParameter("TeamID", "TEAM_01")
				.setParameter("Budget", "1234.1234")
				.execute();

			return that.waitForChanges(assert);
		});
	});

	//*********************************************************************************************
	// Scenario: Changing the binding parameters causes a refresh of the table
	// The SalesOrders application does not have such a scenario.
	QUnit.test("Absolute ODLB changing parameters", function (assert) {
		var sView = '\
<Table id="table" items="{path : \'/EMPLOYEES\', parameters : {$select : \'Name\'}}">\
	<items>\
		<ColumnListItem>\
			<cells>\
				<Text id="name" text="{Name}" />\
			</cells>\
		</ColumnListItem>\
	</items>\
</Table>',
			that = this;

		this.expectRequest("EMPLOYEES?$select=Name&$skip=0&$top=100", {
				"value" : [
					{"Name" : "Jonathan Smith"},
					{"Name" : "Frederic Fall"}
				]
			})
			.expectChange("name", ["Jonathan Smith", "Frederic Fall"]);

		return this.createView(assert, sView).then(function () {
			that.expectRequest("EMPLOYEES?$select=ID,Name&$search=Fall&$skip=0&$top=100", {
					"value" : [{"ID": "2", "Name" : "Frederic Fall"}]
				})
				.expectChange("name", ["Frederic Fall"]);

			// code under test
			that.oView.byId("table").getBinding("items").changeParameters({
				"$search" : "Fall", "$select" : "ID,Name"});

			return that.waitForChanges(assert);
		});
	});

	//*********************************************************************************************
	// Scenario: Changing the binding parameters causes a refresh of the form
	// The SalesOrders application does not have such a scenario.
	QUnit.test("Absolute ODCB changing parameters", function (assert) {
		var sView = '\
<form:SimpleForm id="form" binding="{/EMPLOYEES(\'2\')}">\
	<Text id="text" text="{Name}" />\
</form:SimpleForm>',
			that = this;

		that.expectRequest("EMPLOYEES('2')", {"Name" : "Jonathan Smith"})
			.expectChange("text", "Jonathan Smith");

		return this.createView(assert, sView).then(function () {
			that.expectRequest("EMPLOYEES('2')?$apply=foo", {"Name" : "Jonathan Schmidt"})
				.expectChange("text", "Jonathan Schmidt");

			// code under test
			that.oView.byId("form").getObjectBinding().changeParameters({"$apply" : "foo"});

			return that.waitForChanges(assert);
		});
	});

	//*********************************************************************************************
	// Scenario:
	// A table uses the list binding with extended change detection, but not all key properties of
	// the displayed entity are known on the client, so that the key predicate cannot be determined.
	// In 1.44 this caused the problem that the table did not show any row. (Not reproducible with
	// Gateway services, because they always deliver all key properties, selected or not.)
	QUnit.test("Absolute ODLB with ECD, missing key column", function (assert) {
		// Note: The key property of the EMPLOYEES set is 'ID'
		var sView = '\
<Table growing="true" items="{path : \'/EMPLOYEES\', parameters : {$select : \'Name\'}}">\
	<items>\
		<ColumnListItem>\
			<cells>\
				<Text id="name" text="{Name}" />\
			</cells>\
		</ColumnListItem>\
	</items>\
</Table>';

		this.expectRequest("EMPLOYEES?$select=Name&$skip=0&$top=20", {
				"value" : [
					{"Name" : "Jonathan Smith"},
					{"Name" : "Frederic Fall"}
				]
			})
			.expectChange("name", ["Jonathan Smith", "Frederic Fall"]);

		return this.createView(assert, sView);
	});

	//*********************************************************************************************
	// Scenario: SalesOrders app
	// * Select a sales order so that items are visible
	// * Filter in the items, so that there are less
	// * See that the count decreases
	// The test simplifies it: It filters in the sales orders list directly
	QUnit.test("ODLB: $count and filter()", function (assert) {
		var sView = '\
<Text id="count" text="{$count}"/>\
<Table id="table" items="{path : \'/SalesOrderList\', parameters : {$select : \'SalesOrderID\'}}">\
	<items>\
		<ColumnListItem>\
			<cells>\
				<Text id="id" text="{SalesOrderID}" />\
			</cells>\
		</ColumnListItem>\
	</items>\
</Table>',
			that = this;

		that.expectRequest("SalesOrderList?$select=SalesOrderID&$skip=0&$top=100", {
				"value" : [
					{"SalesOrderID" : "0500000001"},
					{"SalesOrderID" : "0500000002"}
				]
			})
			.expectChange("count")
			.expectChange("id", ["0500000001", "0500000002"]);

		return this.createView(assert, sView, createSalesOrdersModel()).then(function () {
			that.expectChange("count", "2");

			// code under test
			that.oView.byId("count").setBindingContext(
				that.oView.byId("table").getBinding("items").getHeaderContext());

			return that.waitForChanges(assert);
		}).then(function () {
			that.expectRequest("SalesOrderList?$select=SalesOrderID&$filter=SalesOrderID%20gt"
					+ "%20'0500000001'&$skip=0&$top=100",
					{"value" : [{"SalesOrderID" : "0500000002"}]}
				)
				.expectChange("count", "1")
				.expectChange("id", ["0500000002"]);

			// code under test
			that.oView.byId("table").getBinding("items")
				.filter(new Filter("SalesOrderID", FilterOperator.GT, "0500000001"));

			return that.waitForChanges(assert);
		});
	});

	//*********************************************************************************************
	// Scenario: SalesOrders app
	// * Sort the sales orders
	// * Delete a sales order
	// * See that the count decreases
	// The delete is used to change the count (to see that it is still updated)
	QUnit.test("ODLB: $count and sort()", function (assert) {
		var sView = '\
<Text id="count" text="{$count}"/>\
<Table id="table" items="{path : \'/SalesOrderList\', parameters : {$select : \'SalesOrderID\'}}">\
	<items>\
		<ColumnListItem>\
			<cells>\
				<Text id="id" text="{SalesOrderID}" />\
			</cells>\
		</ColumnListItem>\
	</items>\
</Table>',
		that = this;

		this.expectRequest("SalesOrderList?$select=SalesOrderID&$skip=0&$top=100", {
				"value" : [
					{"SalesOrderID" : "0500000001"},
					{"SalesOrderID" : "0500000002"}
				]
			})
			.expectChange("count") // ensures that count is observed
			.expectChange("id", ["0500000001", "0500000002"]);

		return this.createView(assert, sView, createSalesOrdersModel()).then(function () {
			that.expectChange("count", "2");

			// code under test
			that.oView.byId("count").setBindingContext(
				that.oView.byId("table").getBinding("items").getHeaderContext());

			return that.waitForChanges(assert);
		}).then(function () {
			that.expectRequest(
				"SalesOrderList?$select=SalesOrderID&$orderby=SalesOrderID%20desc&$skip=0&$top=100",
				{
					"value" : [
						{"SalesOrderID" : "0500000002"},
						{"SalesOrderID" : "0500000001"}
					]
				})
				.expectChange("id", ["0500000002", "0500000001"]);

			// code under test
			that.oView.byId("table").getBinding("items").sort(new Sorter("SalesOrderID", true));

			return that.waitForChanges(assert);
		}).then(function () {
			that.expectRequest({
					method : "DELETE",
					url : "SalesOrderList('0500000002')",
					headers : {"If-Match" : undefined}
				})
				.expectChange("count", "1")
				.expectChange("id", ["0500000001"]);

			// code under test
			that.oView.byId("table").getItems()[0].getBindingContext().delete();

			return that.waitForChanges(assert);
		});
	});

	//*********************************************************************************************
	// Scenario: (not possible with the SalesOrders app)
	// * Add a filter to the sales orders list using changeParameters(), so that there are less
	// * See that the count decreases
	QUnit.test("ODLB: $count and changeParameters()", function (assert) {
		var sView = '\
<Text id="count" text="{$count}"/>\
<Table id="table" items="{path : \'/SalesOrderList\', parameters : {$select : \'SalesOrderID\'}}">\
	<items>\
		<ColumnListItem>\
			<cells>\
				<Text id="id" text="{SalesOrderID}" />\
			</cells>\
		</ColumnListItem>\
	</items>\
</Table>',
			that = this;

		that.expectRequest("SalesOrderList?$select=SalesOrderID&$skip=0&$top=100", {
				"value" : [
					{"SalesOrderID" : "0500000001"},
					{"SalesOrderID" : "0500000002"}
				]
			})
			.expectChange("count")
			.expectChange("id", ["0500000001", "0500000002"]);

		return this.createView(assert, sView, createSalesOrdersModel()).then(function () {
			that.expectChange("count", "2");

			// code under test
			that.oView.byId("count").setBindingContext(
				that.oView.byId("table").getBinding("items").getHeaderContext());

			return that.waitForChanges(assert);
		}).then(function () {
			that.expectRequest(
					"SalesOrderList?$select=SalesOrderID&$filter=SalesOrderID%20gt%20'0500000001'&"
						+ "$skip=0&$top=100",
					{"value" : [{"SalesOrderID" : "0500000002"}]}
				)
				.expectChange("count", "1")
				.expectChange("id", ["0500000002"]);

			// code under test
			that.oView.byId("table").getBinding("items")
				.changeParameters({$filter : "SalesOrderID gt '0500000001'"});

			return that.waitForChanges(assert);
		});
	});

	//*********************************************************************************************
	// Scenario: SalesOrders app
	// * Select a sales order
	// * Refresh the sales order list
	// * See that the count of the items is still visible
	// The key point is that the parent of the list is a ContextBinding.
	QUnit.test("ODLB: refresh via parent context binding, shared cache", function (assert) {
		var sView = '\
<form:SimpleForm id="form" binding="{path :\'/SalesOrderList(\\\'0500000001\\\')\', parameters : {$expand : {SO_2_SOITEM : {$select : \'ItemPosition\'}}}}">\
	<Text id="count" text="{headerContext>$count}"/>\
	<Table id="table" items="{SO_2_SOITEM}">\
		<items>\
			<ColumnListItem>\
				<cells>\
					<Text id="item" text="{ItemPosition}" />\
				</cells>\
			</ColumnListItem>\
		</items>\
	</Table>\
</form:SimpleForm>',
			that = this;

		this.expectRequest("SalesOrderList('0500000001')?$expand=SO_2_SOITEM($select=ItemPosition)",
			{
				"SalesOrderID" : "0500000001",
				"SO_2_SOITEM" : [
					{"ItemPosition" : "0000000010"},
					{"ItemPosition" : "0000000020"},
					{"ItemPosition" : "0000000030"}
				]
			})
			.expectChange("count")
			.expectChange("item", ["0000000010", "0000000020", "0000000030"]);

		return this.createView(assert, sView, createSalesOrdersModel()
		).then(function () {
			var oCount = that.oView.byId("count");

			that.expectChange("count", "3");

			// code under test
			that.oView.setModel(that.oView.getModel(), "headerContext");
			oCount.setBindingContext(
				that.oView.byId("table").getBinding("items").getHeaderContext(),
					"headerContext");

			return that.waitForChanges(assert);
		}).then(function () {
			// Respond with one employee less to show that the refresh must destroy the bindings for
			// the last row. Otherwise the property binding for that row will cause a "Failed to
			// drill down".
			that.expectRequest(
					"SalesOrderList('0500000001')?$expand=SO_2_SOITEM($select=ItemPosition)", {
						"SalesOrderID" : "0500000001",
						"SO_2_SOITEM" : [
							{"ItemPosition" : "0000000010"},
							{"ItemPosition" : "0000000030"}
						]
					})
				.expectChange("count", "2")
				.expectChange("item", "0000000030", 1);

			// code under test
			that.oView.byId("form").getObjectBinding().refresh();

			return that.waitForChanges(assert);
		});
	});

	//*********************************************************************************************
	// Scenario: Enable autoExpandSelect mode for an ODataContextBinding with relative
	// ODataPropertyBindings
	// The SalesOrders application does not have such a scenario.
	QUnit.test("Auto-mode: Absolute ODCB with relative ODPB", function (assert) {
		var sView = '\
<form:SimpleForm binding="{path : \'/EMPLOYEES(\\\'2\\\')\', parameters : {$select : \'AGE,ROOM_ID\'}}">\
	<Text id="name" text="{Name}" />\
	<Text id="city" text="{LOCATION/City/CITYNAME}" />\
</form:SimpleForm>';

		this.expectRequest("EMPLOYEES('2')?$select=AGE,ROOM_ID,Name,LOCATION/City/CITYNAME", {
				"Name" : "Frederic Fall",
				"LOCATION" : {"City" : {"CITYNAME" : "Walldorf"}}
			})
			.expectChange("name", "Frederic Fall")
			.expectChange("city", "Walldorf")
// TODO unexpected changes
			.expectChange("name", "Frederic Fall")
			.expectChange("city", "Walldorf");

		return this.createView(assert, sView, createTeaBusiModel({autoExpandSelect : true}));
	});

	//*********************************************************************************************
	// Scenario: Enable autoExpandSelect mode for an ODataContextBinding with relative
	// ODataPropertyBindings. Refreshing the view is also working.
	// The SalesOrders application does not have such a scenario.
	QUnit.test("Auto-mode: Absolute ODCB, refresh", function (assert) {
		var sView = '\
<form:SimpleForm id="form" binding="{path : \'/EMPLOYEES(\\\'2\\\')\', parameters : {$select : \'AGE\'}}">\
	<Text id="name" text="{Name}" />\
</form:SimpleForm>',
			that = this;

		this.expectRequest("EMPLOYEES('2')?$select=AGE,Name", {
				"Name" : "Jonathan Smith"
			})
// TODO unexpected change
			.expectChange("name", "Jonathan Smith")
			.expectChange("name", "Jonathan Smith");

		return this.createView(
			assert, sView, createTeaBusiModel({autoExpandSelect : true})
		).then(function () {
			that.expectRequest("EMPLOYEES('2')?$select=AGE,Name", {
					"Name" : "Jonathan Schmidt"
				})
				.expectChange("name", "Jonathan Schmidt");

			// code under test
			that.oView.byId("form").getObjectBinding().refresh();

			return that.waitForChanges(assert);
		});
	});
	//TODO $batch?
	//TODO test bound action
	//TODO test create
	//TODO test delete
});
