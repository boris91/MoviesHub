({
	name: "components._base.model",
	getter: function () {
		"use strict";

		var $idsGenerator = app.core.idsGenerator;

		function BaseModel(props) {
			this.id = props && props.id || $idsGenerator.getId();
		};

		BaseModel.prototype = {};

		return BaseModel;
	}
})