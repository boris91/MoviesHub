/*uses config.json content and success handler function as incoming arguments*/
(function IIFE$MH (__configParams, __onSuccessHandler) {
	"use strict";

	var __win = this,
		__doc = __win.document,
		__mhName = __configParams["globalApplicationName"],
		MH$Obj, MH$Xhr, __jsFilesDirectoryPath, __mh;

	if (__win.hasOwnProperty(__mhName)) {
		return;
	} else if (__configParams["startOnDocReady"] && "complete" !== __doc.readyState) {
		__win.addEventListener("load", function MH$__win$onload$listener () {
			IIFE$MH.call(__win, __configParams, __onSuccessHandler);
			__win.removeEventListener("load", MH$__win$onload$listener);
		}, false);
		return;
	}

	__jsFilesDirectoryPath = __configParams["jsFilesDirectoryPath"];
	__mh = __win[__mhName] = {

		"win": __win,

		"Obj": (MH$Obj = __win.Object),
		"ObjProto": MH$Obj.prototype,
		"Arr": __win.Array,
		"ArrProto": __win.Array.prototype,
		"Func": __win.Function,
		"FuncProto": __win.Function.prototype,
		"Str": __win.String,
		"StrProto": __win.String.prototype,
		"Num": __win.Number,
		"NumProto": __win.Number.prototype,
		"Bool": __win.Boolean,
		"BoolProto": __win.Boolean.prototype,
		"Time": __win.Date,
		"TimeProto": __win.Date.prototype,

		"Arrbuf": __win.ArrayBuffer,
		"Dataview": __win.DataView,
		"Json": __win.JSON,
		"Domparser": __win.DomParser,
		"Docfragment": __win.DocumentFragment,
		"Maths": __win.Math,
		"Reg": __win.RegExp,
		"Evt": __win.Event,
		"Xhr": (MH$Xhr = __win.XMLHttpRequest),

		"config": {
			dbPath: __configParams["dbPath"],
			resourcesPath: __configParams["resourcesPath"],
			layoutsPath: __configParams["layoutsPath"]
		},

		"modules": (function IIFE$MH$modules () {
			var _getModuleFilePath = function MH$modules$_getModuleFilePath (moduleFullName, fileExt) {
					return __jsFilesDirectoryPath + moduleFullName.replace(/\./g, "/") + "." + fileExt;
				},
				_getModuleByFullName = function MH$modules$_getModuleByFullName (fullName) {
					var module = null;
					try {
						if (fullName) {
							module = __win.eval(__mhName + "." + fullName);
						}
					} catch (exc) {
						/*
							module does not exist - do nothing and then return NULL finally
						*/
					} finally {
						return module;
					}
				},
				_fetchModuleFileContent = function MH$modules$_fetchModuleFileContent (moduleFullName, fileExt, onSuccess) {
					var xhr = new MH$Xhr();
					xhr.open("GET", _getModuleFilePath(moduleFullName, fileExt), false);
					xhr.send(null);
					if (200 === xhr.status) {
						onSuccess(xhr.responseText);
					} else {
						__doc.write(xhr.responseText);
					}
				},
				_loaders = {
					css: function MH$modules$_loaders$css (stylesheetFullName) {
						_registerModule(stylesheetFullName, "@import url(" + _getModuleFilePath(stylesheetFullName, "css") + ");");
					},
					html: function MH$modules$_loaders$html (templateFullName) {
						_fetchModuleFileContent(templateFullName, "html", function MH$modules$_fetchModuleFileContent_onSuccess (templateString) {
							_registerModule(templateFullName, __mh.core.templateEngine(templateString));
						});
					},
					js: function MH$modules$_loaders$js (moduleFullName) {
						_fetchModuleFileContent(moduleFullName, "js", function MH$modules$_fetchModuleFileContent_onSuccess (moduleContent) {
							__win.eval(moduleContent);
						});
					}
				},
				_loadModule = function MH$modules$_loadModule (moduleFullName) {
					var loader = _loaders.js,
						loaderName;

					for (loaderName in _loaders) {
						if (0 === moduleFullName.indexOf(loaderName.toUpperCase() + ":")) {
							moduleFullName = moduleFullName.substr(loaderName.length + 1);
							loader = _loaders[loaderName];
							break;
						}
					}

					if (!_getModuleByFullName(moduleFullName)) {
						loader(moduleFullName);
					}

					return _getModuleByFullName(moduleFullName);
				},
				_loadModules = function MH$modules$_loadModules (modulesFullNames) {
					var modulesCount = modulesFullNames && modulesFullNames.length || 0,
						loadedModules = [],
						moduleFullName, module, i;

					for (i = 0; i < modulesCount; i++) {
						moduleFullName = modulesFullNames[i];
						module = _loadModule(moduleFullName);
						loadedModules.push(module);
					}

					return loadedModules;
				},
				_registerModule = function MH$modules$_registerModule (moduleFullName, module) {
					var modulePathChain = moduleFullName.split("."),
						ancestorsCount = modulePathChain.length - 1,
						moduleName = modulePathChain[ancestorsCount],
						parentObj = __mh,
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

			return {
				define: function MH$modules$define (moduleFullName, depsNames, moduleGetter) {
					var module = _getModuleByFullName(moduleFullName),
						deps;
					if (!module) {
						if ("function" === typeof moduleGetter) {
							deps = _loadModules(depsNames);
							module = moduleGetter.apply(__win, deps);
						} else {
							module = moduleGetter;
						}
						_registerModule(moduleFullName, module);
					}
					return module;
				},
				require: function MH$modules$require (requiredCode, callback) {
					var callbackArgs;

					if ("string" === typeof requiredCode) {
						callbackArgs = [_loadModule(requiredCode)];
					} else {
						callbackArgs = _loadModules(requiredCode);
					}

					if ("function" === typeof callback) {
						callback.apply(__win, callbackArgs);
					}
				},
				remove: function MH$modules$remove (moduleFullName) {
					var modulePathChain = moduleFullName.split("."),
						namespace, moduleShortName;

					do {
						moduleShortName = modulePathChain.pop();
						namespace = _getModuleByFullName(modulePathChain.join("."));
						delete namespace[moduleShortName];
					} while (0 < modulePathChain.length && 0 === MH$Obj.getOwnPropertyNames(namespace).length);
				}
			};
		}())
	};

	// +++ require default modules +++
	(function IIFE$_requireDefaultModules () {
		var defaultModules = __configParams["defaultModules"],
			mhModules, modules, modulesCount, i;

		if (defaultModules) {
			mhModules = __mh.modules;
			modulesCount = defaultModules.length;
			for (i = 0; i < modulesCount; i++) {
				mhModules.require(defaultModules[i]);
			}
		}
	})();
	// --- require default modules ---

	// +++ init default layout +++
	(function  IIFE$_initDefaultLayout () {
		var defaultLayoutName = __configParams["defaultLayout"];
		if (defaultLayoutName) {
			MH.core.layoutsManager.init(defaultLayoutName);
		}
	})();
	// --- init default layout ---

	if ("function" === typeof __onSuccessHandler) {
		__onSuccessHandler();
	}

}).call(this, configParams, onSuccessHandler);