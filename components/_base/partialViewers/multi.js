﻿({
	type: "class",
	name: "components._base.partialViewers.multi",
	getter: function getterOf_BaseMultiViewer() {
		"use strict";

		var $dom = app.core.dom,
			$stylesManager = app.core.stylesManager;

		return {
			name: "BaseMultiViewer",

			ctor: function BaseMultiViewer() {
				this._domNodes = null;
				this._domContainer = null;
			},

			proto: {
				_styles: null,
				_template: null,

				_addEventListeners: function BaseSingleViewer__addEventListeners(listeners) {
					var domContainer = this._domContainer,
						eventName;

					for (eventName in listeners) {
						domContainer.addEventListener(eventName, listeners[eventName].bind(this), false);
					}
				},

				init: function BaseMultiViewer_init() {
					this._domNodes = [];
					this._domContainer = null;
					$stylesManager.include(this._styles);
				},

				render: function BaseMultiViewer_render(collection) {
					var template = this._template,
						domContainer = this._domContainer,
						domNodes = this._domNodes;

					collection.forEach(function (model) {
						var node = template(model, domContainer);
						domNodes.push(node);
					});
				},

				erase: function BaseMultiViewer_erase() {
					if (this._domNodes) {
						this._domNodes.forEach(function (node) {
							$dom.remove(node);
						});
					}

					this._domNodes = [];
				},

				dispose: function BaseMultiViewer_dispose() {
					this.erase();

					$stylesManager.exclude(this._styles);
					this._domNodes = null;
					this._domContainer = null;

					$Event.clearEventsFor(this);
				}
			}
		};
	}
})