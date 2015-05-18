({
	name: "components._base.collection",
	base: "core.mediator",
	getter: function () {
		"use strict";

		function BaseCollection(dataArray) {
			this._models = {};

			if (dataArray) {
				this.init(dataArray);
			}
		};

		BaseCollection.prototype = {
			_ModelClass: null,

			init: function BaseCollection_init(dataArray) {
				this._models = {};

				dataArray.forEach(function (data) {
					this.add(data);
				}, this);

				this.onInitComplete();
			},

			add: function BaseCollection_add(data) {
				var model = new this._ModelClass(data),
					existingMovie = this._models[model.id];

				if (!existingMovie) {
					this._models[model.id] = model;
				}
			},

			get: function BaseCollection_get(id, /*?*/ propName) {
				var model = this._models[id];

				if (model) {
					return ("string" === typeof propName) ? model[propName] : model;
				} else {
					return null;
				}
			},

			set: function BaseCollection_set(id, propName, value) {
				var model = this._models[id];

				if (model) {
					model[propName] = value;
				}
			},

			forEach: function BaseCollection_forEach(action, context) {
				var result = false,
					id;

				context = context || null;

				for (id in this._models) {
					result = action.call(context, this._models[id], id) || result;
				}

				return result;
			},

			update: function BaseCollection_update(id, props) {
				var model = this._models[id],
					propName;

				if (model) {
					for (propName in props) {
						model[propName] = props[propName];
					}
				}
			},

			remove: function BaseCollection_remove(id) {
				return (delete this._models[id]);
			},

			dispose: function BaseCollection_dispose() {
				this.unsubscribeAll();
				this._models = null;
			},

			// +++ events +++
			onInitComplete: function BaseCollection_onInitComplete() {
				this.publish("onInitComplete");
			}
			// --- events ---
		};

		return BaseCollection;
	}
})