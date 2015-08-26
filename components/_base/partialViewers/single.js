({
	type: "class",
	name: "components._base.partialViewers.single",
	getter: function () {
		"use strict";

		var $dom = app.core.dom,
			$stylesManager = app.core.stylesManager;

		return {
			name: "BaseSingleViewer",

			ctor: function BaseSingleViewer() {
				this._domNode = null;
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

				init: function BaseSingleViewer_init(params) {
					this._domContainer = params.domContainer;
					if (params.listeners) {
						this._addEventListeners(params.listeners);
					}
					$stylesManager.include(this._styles);
				},

				render: function BaseSingleViewer_render(model) {
					this._domNode = this._template(model, this._domContainer);
				},

				erase: function BaseSingleViewer_erase() {
					if (this._domNode) {
						$dom.remove(this._domNode);
						this._domNode = null;
					}
				},

				dispose: function BaseSingleViewer_dispose() {
					this.erase();

					$stylesManager.exclude(this._styles);
					this._domNode = null;
					this._domContainer = null;
				}
			}
		};
	}
})