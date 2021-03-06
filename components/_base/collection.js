﻿({
	type: "class",
	name: "components._base.collection",
	deps: [
		"core.dataStructures.event"
	],
	getter: function getterOf_BaseCollection($Event) {
		"use strict";

		return {
			name: "BaseCollection",

			ctor: function BaseCollection(dataArray) {
				this._models = {};
				this.initCompleted = new $Event();
				this.modelAdded = new $Event();
				this.modelRemoved = new $Event();
				this.modelsUpdated = new $Event();

				if (dataArray) {
					this.init(dataArray);
				}
			},

			proto: {
				_ModelClass: null,

				_getModelEvent: function BaseCollection__getModelEvent(id, eventName) {
					var model = this._models[id];
					return model && model[eventName] || null;
				},

				init: function BaseCollection_init(dataArray) {
					this._models = {};

					dataArray.forEach(this.add, this);

					this.initCompleted.trigger(this);
				},

				add: function BaseCollection_add(data) {
					var model = new this._ModelClass(data);
					this._models[model.id] = model;
					this.modelAdded.trigger({ model: model });
				},

				fetch: function BaseCollection_fetch(id) {
					return this._models[id];
				},

				get: function BaseCollection_get(id, propName) {
					return this._models[id].get(propName);
				},

				set: function BaseCollection_set(id, propName, value, silentMode) {
					return this._models[id].set(propName, value, silentMode);
				},

				addEventHandler: function BaseCollection_addEventListener(id, eventName, handler, context, args, index) {
					var event = this._getModelEvent(id, eventName);

					if (event) {
						return event.add(han, context, args, index);
					}

					return -1;
				},

				removeEventHandler: function BaseCollection_removeEventHandler(id, eventName, handlerIndex) {
					var event = this._getModelEvent(id, eventName);

					if (event) {
						event.remove(handlerIndex);
					}
				},

				forEach: function BaseCollection_forEach(action, context) {
					var models = this._models,
						result = false,
						id;

					context = context || null;

					for (id in models) {
						result = action.call(context, models[id], id) || result;
					}

					return result;
				},

				update: function BaseCollection_update(id, props, silentMode) {
					return this._models[id].update(props, silentMode);
				},

				updateRange: function BaseCollection_updateRange(modelsProps, silentMode) {
					var models = this._models,
						modelsUpdatedEventArgs = {},
						id, propName;

					for (id in modelsProps) {
						modelsUpdatedEventArgs[id] = models[id].update(modelsProps[id], silentMode);
					}

					this.modelsUpdated.trigger(modelsUpdatedEventArgs);
				},

				remove: function BaseCollection_remove(id) {
					var removed = (delete this._models[id]);
					if (removed) {
						this.modelRemoved.trigger({ id: id });
					}
					return removed;
				},

				dispose: function BaseCollection_dispose() {
					this._models = null;

					$Event.clearEventsFor(this);
				}
			}
		};
	}
})