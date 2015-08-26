this["dbAccessor"] = (function () {
	"use strict";

	var $ajax = app.core.ajax,
		$dbPath = app.config.dbPath;

	return {
		/*
			params: {
				table: "movie",
				callback: function (res) { ... },
				context: { ... }
			}
		*/
		get: function dbAccessor_get(params) {
			var reqCallback = params.callback && params.callback.bind(params.context),
				reqUrl = $dbPath + params.table + ".json",
				reqParams = {
					method: "GET",
					async: !!reqCallback,
					url: reqUrl,
					onSuccess: reqCallback,
					onError: reqCallback
				},
				response = $ajax.send(reqParams);

			return (!reqCallback) && (response.success ? response.value : null);
		}
	};
})();