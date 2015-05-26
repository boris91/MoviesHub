({
	type: "class",
	name: "components._base.view",
	base: "core.mediator",
	getter: function () {
		"use strict";

		var $Array_forEach = window.Array.prototype.forEach,
			$modules = app.core.modules;

		return {
			name: "BaseView",

			ctor: function BaseView() {
				this._partialViews = null;
			},

			proto: {
				_componentName: null,//virtual property, override after inheritance from this class

				_addAndInit: function BaseView__addAndInit(viewName, viewParams, Viewer) {
					var viewer = new Viewer();
					this._partialViews[viewName] = viewer;
					viewer.init(viewParams);
					viewer.subscribe("onViewerEvent", this.onViewerEvent.bind(this));
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
							this.onInitComplete();
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
					this.unsubscribeAll();
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
				},

				// +++ events +++
				onInitComplete: function BaseView_onInitComplete() {
					this.publish("onInitComplete");
				},

				onViewerEvent: function BaseView_onViewerEvent(event) {
					this.publish("onViewerEvent", event);
				}
				// --- events ---
			}
		};
	}
})