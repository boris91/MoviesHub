({
	type: "class",
	name: "core.dataStructures.event",
	getter: function () {
		"use strict";

		return {
			name: "Event",

			ctor: function Event() {
				this._handlers = [];
			},

			stat: {
				clearEventsFor: function Event_clearEventsFor(object) {
					var propName, prop;
					for (propName in object) {
						if (object.hasOwnProperty(propName)) {
							prop = object[propName];
							if (prop instanceof this) {
								prop.removeAll();
							}
						}
					}
				}
			},

			proto: {
				_count: 0,

				_addFromIndex: function Event__addRangeFromIndex(context, args, startIndex, indexes, handler, index) {
					this.add(handler, context, args, startIndex + index);
					indexes.push(startIndex + index);
				},

				addRange: function Event_addRange(handlers, context, args, startIndex) {
					var indexes = [];
					handlers.forEach(this._addFromIndex.bind(this, context, args, startIndex, indexes));
					return indexes;
				},

				add: function Event_add(handler, context, args, index) {
					if (context && "object" === typeof context) {
						args = args && args.slice() || [];
						args.unshift(context);
						handler = handler.bind.apply(handler, args);
					}

					if ("number" === typeof index) {
						this._handlers.splice(index, 0, handler);
					} else {
						index = this._handlers.length;
						this._handlers[index] = handler;
					}

					return index;
				},

				remove: function Event_remove(index) {
					if (index > -1) {
						this._handlers.splice(index, 1);
					}
				},

				removeAll: function Event_removeAll() {
					this._handlers = [];
				},

				trigger: function Event_trigger(argument) {
					var handlers = this._handlers,
						handlersCount = handlers.length,
						i;

					for (i = 0; i < handlersCount; i++) {
						handlers[i](argument);
					}
				}
			}
		};
	}
})