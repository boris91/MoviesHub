this["configProcessor"] = (function () {
	"use strict";

	var $core = app.core,
		$modules = $core.modules,
		$layouts = $core.layouts,
		$dom = $core.dom,
		_order = ["title", "defaultModules", "defaultLayout"];

	return {
		"title": function configProcessor_title(appTitle) {
			var titleNode = $dom.getFirst("TITLE", $dom.head);

			if (!titleNode) {
				titleNode = $dom.create("TITLE", null, null, $dom.head);
			}

			titleNode.innerHTML = appTitle;
		},
		"defaultModules": function configProcessor_defaultModules(modulesNames) {
			$modules.require(modulesNames);
		},
		"defaultLayout": function configProcessor_defaultLayout(layoutName) {
			$layouts.init(layoutName);
		},
		invoke: function configProcessor_invoke(invokersArgs) {
			_order.forEach(function (name) {
				if (invokersArgs.hasOwnProperty(name)) {
					this[name](invokersArgs[name]);
				}
			}, this);
		}
	};
})();