MH.modules.define("core.layoutsManager",
	null,
	function MH$modules$define_moduleGetter_dbAccessor () {
		"use strict";
		var modules = MH.modules,
			layoutsPath = MH.config.layoutsPath,

			_controllers = {},

			_getControllerFullName = function (layoutName) {
				return (layoutsPath + layoutName + "/controller").replace(/\//g, ".");
			},
			_onControllerLoaded = function (layoutName, controller) {
				_controllers[layoutName] = controller;
				controller.init();
			};

		return {
			init: function (layoutName) {
				var controller = _controllers[layoutName],
					controllerFullName;

				if (controller) {
					controller.init();
				} else {
					controllerFullName = _getControllerFullName(layoutName);
					modules.require(controllerFullName, _onControllerLoaded.bind(this, layoutName));
				}
			},

			dispose: function (layoutName) {
				var controller = _controllers[layoutName];
				if (controller) {
					controller.dispose();
				}
			}
		};
	});