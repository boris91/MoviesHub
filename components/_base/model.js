({
	type: "class",
	name: "components._base.model",
	getter: function () {
		"use strict";

		var $idsGenerator = app.core.idsGenerator;

		return {
			name: "BaseModel",

			ctor: function BaseModel(props) {
				this.id = props && props.id || $idsGenerator.getId();
			},

			proto: {}
		};
	}
})