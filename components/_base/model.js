({
	type: "class",
	name: "components._base.model",
	base: "core.mediator",
	getter: function () {
		"use strict";

		var $Object = window.Object,
			$idsGenerator = app.core.idsGenerator;

		return {
			name: "BaseModel",

			ctor: function BaseModel(props) {
				this.id = props && props.id || $idsGenerator.getId();
			},

			proto: {
				set: function BaseModel_set(propName, newValue) {
					var propValue = this[propName];
					if (propValue !== newValue) {
						this[propName] = newValue;
						this.onPropChanged({
							name: propName,
							prev: propValue,
							curr: newValue
						});
					}
				},

				update: function BaseModel_update(props) {
					var propsChangedEventArgs = {},
						propName, propValue, newValue;

					for (propName in props) {
						propValue = this[propName];
						if (propValue !== newValue) {
							propsChangedEventArgs[propName] = {
								prev: propValue,
								curr: newValue
							};
						}
					}

					if (0 !== $Object.keys(propsChangedEventArgs).length) {
						this.onPropsChanged(propsChangedEventArgs);
					}
				},

				// +++ events +++
				onPropChanged: function BaseModel_onPropChanged(args) {
					this.publish("onPropChanged", args);
				},

				onPropsChanged: function BaseModel_onPropsChanged(args) {
					this.publish("onPropsChanged", args);
				}
				// --- events ---
			}
		};
	}
})