({
	type: "class",
	name: "components._base.layouts.controller",
	deps: [
		"core.dataStructures.event"
	],
	getter: function getterOf_BaseLayoutController($Event) {
		"use strict";

		var $core = app.core,
			$dom = $core.dom,
			$domBody = $dom.body,
			$modules = $core.modules,
			$dbAccessor = $core.dbAccessor,
			$stylesManager = $core.stylesManager;

		return {
			name: "BaseLayoutController",

			ctor: function BaseLayoutController() {
				this._vm = null;
			},

			proto: {
				_ViewModelClass: null,// virtual, gotta be overridden after inheritance from this class
				_layoutTemplate: null,// virtual, gotta be overridden after inheritance from this class
				_layoutStyles: null,// virtual, gotta be overridden after inheritance from this class
				_dbTableName: null,// virtual, gotta be overridden after inheritance from this class

				_onGetDataFromDb: function BaseLayoutController__onGetDataFromDb(dbData) {
					if (dbData) {
						this._vm.init(dbData);
					} else {
						throw "No data provided by DB table \"" + this._dbTableName + "\"!";
					}
				},

				init: function BaseLayoutController_init() {
					$stylesManager.include(this._layoutStyles);
					this._layoutTemplate(null, $domBody);
					this._vm = new this._ViewModelClass();
				
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
					this._vm.dispose();

					$stylesManager.exclude(this._layoutStyles);
					$Event.clearEventsFor(this);
				}
			}
		};
	}
})