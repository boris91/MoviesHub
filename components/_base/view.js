({
	type: "class",
	name: "components._base.view",
	deps: [
		"core.dataStructures.event"
	],
	getter: function getterOf_BaseView($Event) {
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
				_partialViewsNames: null,//virtual property, override after inheritance from this class

				_addAndInit: function BaseView__addAndInit(partialViewName, PartialViewClass) {
					var partialView = new PartialViewClass();
					this._partialViews[partialViewName] = partialView;
					partialView.init();
					return partialView;
				},

				init: function BaseView_init() {
					var partialViewNames = [],
						viewersModulesNames = [],
						viewersRequireCallback = function viewerRequireCallback(/* arguments - Array of PartialViewsClasses */) {
							$Array_forEach.call(arguments, function (PartialViewClass, i) {
								this._addAndInit(partialViewNames[i], PartialViewClass);
							}, this);
							this.initCompleted.trigger();
						}.bind(this),
						partialViewName;

					if (this._partialViewsNames) {
						this._partialViewsNames.forEach(function (partialViewName) {
							partialViewNames.push(partialViewName);
							viewersModulesNames.push("components." + this._componentName + ".partialViews." + partialViewName + ".viewer");
						}, this);
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