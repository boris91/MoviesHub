this["modules"] = (function () {
	"use strict";

	var $Object = window.Object,
		$Function = window.Function,
		$Array_slice = window.Array.prototype.slice,
		$app = app,
		$ajax = $app.core.ajax,
		$classes = $app.core.classes,
		$templateEngine = $app.core.templateEngine,
		$modules = null,

		_getModuleFilePath = function modules__getModuleFilePath(moduleFullName, fileExt) {
			return moduleFullName.replace(/\./g, "/") + "." + fileExt;
		},

		_getModuleByFullName = function modules__getModuleByFullName(fullName) {
			var namesChain, chainLength, name, module, i;

			if (fullName) {
				namesChain = fullName.split(".");
				chainLength = namesChain.length;
				module = $app;

				for (i = 0; i < chainLength; i++) {
					name = namesChain[i];
					module = module[name];
					if (!module) {
						return null;
					}
				}

				return module;
			} else {
				return null;
			}
		},

		_fetchModuleFileContent = function modules__fetchModuleFileContent(moduleFullName, fileExt, callback) {
			$ajax.send({
				method: "GET",
				async: true,
				url: _getModuleFilePath(moduleFullName, fileExt),
				onSuccess: callback,
				onError: callback,
				handleAsJson: false
			});
		},

		_loaders = {
			css: function modules__loaders_css(stylesheetFullName, callback) {
				var module = "@import url(" + _getModuleFilePath(stylesheetFullName, "css") + ");";
				_registerModule(stylesheetFullName, module);
				if (callback) {
					callback(module);
				}
			},
			html: function modules__loaders_html(templateFullName, callback) {
				_fetchModuleFileContent(templateFullName, "html", function (templateString) {
					var module = $templateEngine(templateString);
					_registerModule(templateFullName, module);
					if (callback) {
						callback(module);
					}
				});
			},
			js: function modules__loaders_js(moduleFullName, callback) {
				_fetchModuleFileContent(moduleFullName, "js", function (moduleContent) {
					var moduleWrapper = (new $Function("return " + moduleContent + ";"))(),
						moduleCallbacks = moduleWrapper.callbacks || (moduleWrapper.callbacks = []);
					moduleCallbacks.push(callback);
					$modules.define(moduleWrapper);
				});
			}
		},

		_loadModule = function modules__loadModule(moduleFullName, callback) {
			var loader = _loaders.js,
				loaderName, module;

			if (moduleFullName) {
				for (loaderName in _loaders) {
					if (0 === moduleFullName.indexOf(loaderName.toUpperCase() + ":")) {
						moduleFullName = moduleFullName.substr(loaderName.length + 1);
						loader = _loaders[loaderName];
						break;
					}
				}

				module = _getModuleByFullName(moduleFullName);
				if (module) {
					callback(module);
				} else {
					loader(moduleFullName, callback);
				}
			} else {
				callback();
			}
		},

		_loadModules = function modules__loadModules(modulesFullNames, callback) {
			var modulesCount = modulesFullNames && modulesFullNames.length,
				loadedModulesCount, loadedModules;

			if (modulesCount) {
				loadedModulesCount = 0;
				loadedModules = [];

				modulesFullNames.forEach(function (moduleFullName, i) {
					_loadModule(moduleFullName, function (module) {
						loadedModules[i] = module;
						++loadedModulesCount;
						if (callback && loadedModulesCount === modulesCount) {
							callback.apply(null, loadedModules);
						}
					});
				});
			} else if (callback) {
				callback();
			}
		},

		_registerModule = function modules__registerModule(moduleFullName, module) {
			var modulePathChain = moduleFullName.split("."),
				ancestorsCount = modulePathChain.length - 1,
				moduleName = modulePathChain[ancestorsCount],
				parentObj = $app,
				i, ancestorName;

			for (i = 0; i < ancestorsCount; i++) {
				ancestorName = modulePathChain[i];
				if (ancestorName) {
					if (!parentObj[ancestorName]) {
						parentObj[ancestorName] = {};
					}
					parentObj = parentObj[ancestorName];
				}
			}

			parentObj[moduleName] = module;
		};

	return $modules = {
		/*
			moduleWrapper: {
				//?OPTIONAL?
				name: "ns1.ns2.ns3.XXX",

				//?OPTIONAL? (if set to "true" - module shall not be registered in "app" namespace)
				private: true/false/undefined,

				//?OPTIONAL? (for [object Function])
				base: "ns4.DDD",

				//?OPTIONAL? (for [object Object] OR [object Function].prototype)
				mixes: [
					"ns5.EEE",
					"ns6.FFF"
				],

				//?OPTIONAL?
				deps: [
					"ns5.AAA",
					"ns6.BBB",
					"ns7.CCC"
				],

				//!REQUIRED!
				getter: function (aaaModule, bbbModule, cccModule) {
					// ...
					return xxxModule;
				},

				//?OPTIONAL?
				callbacks: [
					function cb1(xxxModule) {
						//operations with loaded module
					},
					function cb2(xxxModule) {
						//operations with loaded module
					}
				]
			}
		*/
		define: function modules_define(moduleWrapper) {
			var moduleCallbacks = moduleWrapper.callbacks;

			_loadModules(moduleWrapper.deps, function (/*deps*/) {
				var module = moduleWrapper.getter.apply(null, $Array_slice.call(arguments));

				_loadModule(moduleWrapper.base, function (base) {
					if (base) {
						module = $classes.inherit(module, base);
					}

					_loadModules(moduleWrapper.mixes, function (/*mixes*/) {
						if (arguments.length) {
							$classes.mix(module, $Array_slice.call(arguments));
						}
						if (!moduleWrapper.private && moduleWrapper.name) {
							_registerModule(moduleWrapper.name, module);
						}
						if (moduleCallbacks) {
							moduleCallbacks.forEach(function (callback) {
								callback(module);
							});
						}
					});
				});
			});
		},

		require: function modules_require(requiredCode, callback) {
			if ("string" === typeof requiredCode) {
				requiredCode = [requiredCode];
			}

			_loadModules(requiredCode, callback);
		},

		remove: function modules_remove(moduleFullName) {
			var modulePathChain = moduleFullName.split("."),
				namespace, moduleShortName;

			do {
				moduleShortName = modulePathChain.pop();
				namespace = _getModuleByFullName(modulePathChain.join("."));
				delete namespace[moduleShortName];
			} while (0 < modulePathChain.length && 0 === $Object.getOwnPropertyNames(namespace).length);
		}
	};
})();