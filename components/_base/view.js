({
	type: "class",
	name: "components._base.view",
	deps: [
		"core.dataStructures.event"
	],
	getter: function ($Event) {
		"use strict";

		var $Array_forEach = window.Array.prototype.forEach,
			$modules = app.core.modules;

		return {
			name: "BaseView",

			ctor: function BaseView() {
				this._partialViews = null;
				this.initCompleted = new $Event();
			},

			proto: {
				_componentName: null,//virtual property, override after inheritance from this class

				_addAndInit: function BaseView__addAndInit(viewName, viewParams, Viewer) {
					var viewer = new Viewer();
					this._partialViews[viewName] = viewer;
					viewer.init(viewParams);
					return viewer;
				},

				init: function BaseView_init(viewsParams) {
					var viewsNames = [],
						viewersModulesNames = [],
						viewersRequireCallback = function (/* arguments - Array of partialViews */) {
							$Array_forEach.call(arguments, function (viewer, i) {
								var name = viewsNames[i],
									params = viewsParams[name];
								this._addAndInit(name, params, viewer);
							}, this);
							this.initCompleted.trigger();
						}.bind(this),
						viewName;

					for (viewName in viewsParams) {
						viewsNames.push(viewName);
						viewersModulesNames.push("components." + this._componentName + ".partialViews." + viewName + ".viewer");
					}

					this._partialViews = {};
					$modules.require(viewersModulesNames, viewersRequireCallback);
				},

				renderRange: function BaseView_renderRange(viewsData) {
					var viewName;
					for (viewName in viewsData) {
						this.render(viewName, viewsData[viewName]);
					}
				},

				eraseRange: function BaseView_eraseRange(viewsNames) {
					viewsNames.forEach(function (viewName) {
						this.erase(viewName);
					}, this);
				},

				render: function BaseView_render(viewName, data) {
					this._partialViews[viewName].render(data);
				},

				erase: function BaseView_erase(viewName) {
					this._partialViews[viewName].erase();
				},

				dispose: function BaseView_dispose() {
					var partialViews = this._partialViews,
						viewName;

					for (viewName in partialViews) {
						partialViews[viewName].erase();
					}

					this._partialViews = null;

					$Event.clearEventsFor(this);
				},

				getPartialView: function BaseView_getPartialView(name) {
					return this._partialViews[name];
				},

				forEach: function BaseView_forEach(handler, context) {
					var partialViews = this._partialViews,
						name;

					context = context || null;

					for (name in partialViews) {
						handler.call(context, partialViews[name], name);
					}
				}
			}
		};
	}
})