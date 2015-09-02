({
	type: "class",
	name: "core.dataStructures.collections.dictionary",
	getter: function getterOf_Dictionary() {
		"use strict";

		return {
			name: "Dictionary",

			ctor: function Dictionary(dataArray) {
				this._items = null;
				this.count = -1;

				this.init(dataArray);
			},

			proto: {
				_ItemClass: null,

				init: function Dictionary_init(dataArray) {
					this.clear();

					if (dataArray) {
						this.addRange(dataArray);
					}
				},

				addRange: function Dictionary_addRange(datas) {
					var datasCount = datas.length,
						items, ItemClass, i, item;

					if (datasCount) {
						items = this._items;
						ItemClass = this._ItemClass;

						for (i = 0; i < datasCount; i++) {
							item = new ItemClass(datas[i]);
							items[item.id] = item;
						}

						this.count += datasCount;
					}
				},

				add: function Dictionary_add(data) {
					var item = new this._ItemClass(data);
					this._items[item.id] = item;
					this.count++;
				},

				has: function Dictionary_has(id) {
					return !!this._items[id];
				},

				fetch: function Dictionary_fetch(id) {
					return this._items[id];
				},

				get: function Dictionary_get(id, propName) {
					return this._items[id].get(propName);
				},

				set: function Dictionary_set(id, propName, value) {
					return this._items[id].set(propName, value);
				},

				forEach: function Dictionary_forEach(action, context) {
					var items = this._items,
						result = false,
						id;

					context = context || null;

					for (id in items) {
						result = action.call(context, items[id], id) || result;
					}

					return result;
				},

				update: function Dictionary_update(id, props) {
					return this._items[id].update(props);
				},

				updateRange: function Dictionary_updateRange(itemsProps) {
					var items = this._items,
						id;

					for (id in itemsProps) {
						items[id].update(itemsProps[id]);
					}
				},

				remove: function Dictionary_remove(id) {
					var removed = (delete this._items[id]);
					this.count--;
					return removed;
				},

				clear: function Dictionary_clear() {
					this._items = {};
					this.count = 0;
				},

				dispose: function Dictionary_dispose() {
					this._items = null;
					this.count = -1;
				}
			}
		};
	}
})