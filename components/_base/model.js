({
	type: "class",
	name: "components._base.model",
	deps: [
		"core.dataStructures.event"
	],
	getter: function ($Event) {
		"use strict";

		var $Object = window.Object,
			$idsGenerator = app.core.idsGenerator;

		return {
			name: "BaseModel",

			ctor: function BaseModel(props) {
				this.id = props && props.id || $idsGenerator.getId();
				this.propChanged = new $Event();
				this.propsChanged = new $Event();
			},

			proto: {
				get: function BaseModel_get(propName) {
					return this[propName];
				},

				set: function BaseModel_set(propName, newValue, silentMode) {
					var propChangedEventArgs;

					if (newValue !== this[propName]) {
						this[propName] = newValue;
						if (!silentMode) {
							propChangedEventArgs = {};
							propChangedEventArgs[propName] = newValue;
							this.propChanged.trigger(propChangedEventArgs);
						}

						return true;
					}

					return false;
				},

				update: function BaseModel_update(props, silentMode) {
					var changedProps = {},
						propName, propValue, newValue;

					for (propName in props) {
						newValue = props[propName];
						if (newValue !== this[propName]) {
							this[propName] = changedProps[propName] = newValue;
						}
					}

					if (!silentMode && 0 !== $Object.keys(changedProps).length) {
						this.propsChanged.trigger(changedProps);
					}

					return changedProps;
				}
			}
		};
	}
})