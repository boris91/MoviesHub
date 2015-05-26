({
	type: "class",
	name: "components._base.collection",
	base: "core.mediator",
	getter: function () {
		"use strict";

		return {
			name: "BaseCollection",

			ctor: function BaseCollection(dataArray) {
				this._models = {};

				if (dataArray) {
					this.init(dataArray);
				}
			},

			proto: {
				_ModelClass: null,

				init: function BaseCollection_init(dataArray) {
					this._models = {};

					dataArray.forEach(function (data) {
						this.add(data);
					}, this);

					this.onInitComplete({ models: this._models });
				},

				add: function BaseCollection_add(data) {
					var model = new this._ModelClass(data),
						existingModel = this._models[model.id];

					if (!existingModel) {
						this._models[model.id] = model;
						this.onModelAdded({ model: model });
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
						model.set(propName, value);
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
					var model = this._models[id];

					if (model) {
						model.update(props);
					}
				},

				remove: function BaseCollection_remove(id) {
					var removed = (delete this._models[id]);
					if (removed) {
						this.onModelRemoved({ id: id });
					}
					return removed;
				},

				dispose: function BaseCollection_dispose() {
					this.unsubscribeAll();
					this._models = null;
				},

				// +++ events +++
				onInitComplete: function BaseCollection_onInitComplete(args) {
					this.publish("onInitComplete", args);
				},
				onModelAdded: function BaseCollection_onModelAdded(args) {
					this.publish("onModelAdded", args);
				},
				onModelRemoved: function BaseCollection_onModelRemoved(args) {
					this.publish("onModelAdded", args);
				}
				// --- events ---
			}
		};
	}
})