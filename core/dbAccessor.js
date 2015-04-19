MH.modules.define("core.dbAccessor",
	null,
	function MH$modules$define_moduleGetter_dbAccessor () {
		"use strict";
		var ajax = MH.core.ajax,
			dbPath = MH.config.dbPath;

		return {
			get: function (tableName) {
				var reqParams = {
						method: "GET",
						async: false,
						url: dbPath + tableName + ".json",
						handleAsJson: true
					},
					response = ajax.send(reqParams);

				return (response.success ? response.value : null);
			},
		};
	});