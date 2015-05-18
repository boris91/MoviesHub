this["layouts"] = (function () {
	"use strict";

	var $modules = app.core.modules,
		$layoutsPath = app.config.layoutsPath,

		_controllers = {},

		_getControllerFullName = function layouts__getControllerFullName(layoutName) {
			return ($layoutsPath + layoutName + "/controller").replace(/\//g, ".");
		},
		_onControllerLoaded = function layouts__onControllerLoaded(layoutName, controller) {
			_controllers[layoutName] = controller;
			controller.init();
		};

	return {
		init: function layouts_init(layoutName) {
			var controller = _controllers[layoutName],
				controllerFullName;

			if (controller) {
				controller.init();
			} else {
				controllerFullName = _getControllerFullName(layoutName);
				$modules.require(controllerFullName, _onControllerLoaded.bind(null, layoutName));
			}
		},

		dispose: function layouts_dispose(layoutName) {
			var controller = _controllers[layoutName];
			if (controller) {
				controller.dispose();
			}
		}
	};
})();