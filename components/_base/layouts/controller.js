({
	type: "class",
	name: "components._base.layouts.controller",
	deps: [
		"core.dataStructures.event"
	],
	getter: function ($Event) {
		"use strict";

		var $core = app.core,
			$dom = $core.dom,
			$domBody = $dom.body,
			$modules = $core.modules,
			$dbAccessor = $core.dbAccessor,
			$stylesManager = $core.stylesManager,

			_vmParams = null,
			_vm = null;

		return {
			name: "BaseLayoutController",

			proto: {
				_ViewModelClass: null,// virtual, gotta be overridden after inheritance from this class
				_layoutTemplate: null,// virtual, gotta be overridden after inheritance from this class
				_layoutStyles: null,// virtual, gotta be overridden after inheritance from this class
				_dbTableName: null,// virtual, gotta be overridden after inheritance from this class
				_vmParamsModuleName: null,// virtual, gotta be overridden after inheritance from this class

				_onGetDataFromDb: function BaseLayoutController__onGetDataFromDb(dbData) {
					if (dbData) {
						$modules.require(this._vmParamsModuleName, function (vmParams) {
							_vmParams = vmParams;
							_vmParams.collection.params = dbData;
							_vm.init(_vmParams);
						});
					} else {
						throw "No data provided by DB table \"" + this._dbTableName + "\"!";
					}
				},

				init: function BaseLayoutController_init() {
					$stylesManager.include(this._layoutStyles);
					this._layoutTemplate(null, $domBody);
					_vm = new this._ViewModelClass();
				
					$dbAccessor.get({
						table: this._dbTableName,
						callback: this._onGetDataFromDb,
						context: this
					});
				},

				refresh: function BaseLayoutController_refresh() {
					this.dispose();
					this.init();
				},

				dispose: function BaseLayoutController_dispose() {
					var activeViews = _vmParams.view.views,
						viewName, viewDomContainer;

					_vm.dispose();
					_vmParams.collection.data = null;

					for (viewName in activeViews) {
						viewDomContainer = activeViews[viewName].domContainer;
						$dom.remove(viewDomContainer);
					}

					$stylesManager.exclude(this._layoutStyles);
					$Event.clearEventsFor(this);
				}
			}
		};
	}
})