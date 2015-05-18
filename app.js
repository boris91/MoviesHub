(function (context) {
	"use strict";

	var $Object = window.Object,
		$JSON = window.JSON,
		_initComplete = false,
		_initPending = false,
		_onInitDefaultCallback = function app__onInitDefaultCallback() {
			var $config = _appObj.config,
				$configProcessor = _appObj.core.configProcessor,
				procInvokersArgs = {},
				key, processingInvoker, value;

			for (key in $config) {
				procInvokersArgs[key] = $config[key];
			}

			$configProcessor.invoke(procInvokersArgs);
		},
		_fetchData = function app__fetchData(filePath, onComplete) {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", filePath, true);
			xhr.onreadystatechange = function () {
				if (onComplete && 4 === xhr.readyState) {
					onComplete(xhr.responseText);
				}
			};
			xhr.send(null);
		},
		_createNewApp = function app__createNewApp(proto) {
			var app = $Object.create(proto);
			app.config = null;
			app.core = null;
			return app;
		},

		appProto = {
			/*
				params: {
					configPath,
					callback
				}
			*/
			init: function app_init(params) {
				if (!_initPending && !_initComplete) {
					_initPending = true;

					_fetchData(params.configPath, function (configData) {
						_appObj.config = $JSON.parse(configData);

						_fetchData(_appObj.config.corePath, function (coreData) {
							(new Function(coreData)).call(_appObj);
							_onInitDefaultCallback.call(_appObj);
							if (params.callback) {
								params.callback.call(_appObj);
							}
						});
					});

					_initPending = false;
					_initComplete = true;
				}
			},
			dispose: function app_dispose() {
				_appObj = _createNewApp(appProto);
				_initComplete = false;
			}
		},
		_appObj = _createNewApp(appProto);

	Object.defineProperty(context, "app", {
		get: function () { return _appObj; }
	});

})(this);