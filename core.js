(function (appContext, name) {
	var self = (appContext[name] = {});

	(function () {
		/* +++ CORE_MODULES +++ */

		//extend context with hand-copied modules (later use GRUNTJS to concatenate JS-files)
		this["defer"] = (function () {
			"use strict";

			var $arraySlice = Array.prototype.slice;

			function Deferred() {
				this._done = [];
				this._fail = [];
			}

			Deferred.prototype = {
				promise: function Deferred_promise() {
					return {
						done: this.done.bind(this),
						fail: this.fail.bind(this),
						then: this._thenImplForPromiseObj.bind(this)
					};
				},

				done: function Deferred_done(callback) {
					this._done.push(callback);
					return this;
				},

				fail: function Deferred_fail(callback) {
					this._fail.push(callback);
					return this;
				},

				resolve: function Deferred_resolve(/*args for all callbacks*/) {
					this._invokeCallbacks(this._done, arguments);
				},

				reject: function Deferred_reject(/*args for all callbacks*/) {
					this._invokeCallbacks(this._fail, arguments);
				},

				/* +++ private methods +++ */

				_invokeCallbacks: function Deferred__invokeCallbacks(callbacks, args) {
					var callbacksCount = callbacks.length,
						i;

					args = $arraySlice.call(args);

					for (i = 0; i < callbacksCount; i++) {
						callbacks[i].apply(null, args);
					}
				},

				_thenImplForPromiseObj: function Deferred__thenImplForPromiseObj(doneCallback, failCallback) {
					this._done.push(doneCallback);
					if (failCallback) {
						this._fail.push(failCallback);
					}
				}

				/* --- private methods --- */
			};

			return function defer() {
				return new Deferred();
			};
		})();

		this["ajax"] = (function () {
			"use strict";

			var $XMLHttpRequest = window.XMLHttpRequest,
				$JSON = window.JSON,
				_idsCounter = 0,
				_xhrs = {},
				_createXmlHttpRequest = function ajax__createXmlHttpRequest(params) {
					var xhr = new $XMLHttpRequest(),
						xhrIsAsync = (false !== params.async),
						xhrHeaders = params.headers,
						xhrQueryOptions = params.queryOptions,
						xhrQuery = "",
						headerName, queryOption;

					if (xhrQueryOptions) {
						xhrQuery = "?";
						for (queryOption in xhrQueryOptions) {
							xhrQuery += queryOption + "=" + xhrQueryOptions[queryOption] + "&";
						}
					}

					xhr.id = _idsCounter + "";
					_xhrs[xhr.id] = xhr;

					xhr.open(params.method, params.url + xhrQuery, xhrIsAsync);

					if (xhrIsAsync) {
						xhr.onreadystatechange = _getAsyncReadyStateChangeHandler(xhr, params);
					}

					if (xhrHeaders) {
						for (headerName in xhrHeaders) {
							xhr.setRequestHeader(headerName, xhrHeaders[headerName]);
						}
					}

					return xhr;
				},
				_syncReadyStateChangeHandler = function ajax__syncReadyStateChangeHandler(xhr, params) {
					var xhrSucceeded = (200 === xhr.status),
						parseResultAsJson = (false !== params.handleAsJson),
						xhrResponseText = xhr.response || xhr.responseText,
						xhrResponseValue = xhrSucceeded ? (parseResultAsJson ? $JSON.parse(xhrResponseText) : xhrResponseText) : null,
						xhrResponse = {
							success: xhrSucceeded,
							value: xhrResponseValue
						},
						callback = function () { return xhrResponse; };

					if (false !== params.async) {
						if (xhrSucceeded) {
							callback = params.onSuccess || callback;
						} else {
							callback = params.onError || callback;
						}
					}

					delete _xhrs[xhr.id];

					return callback(xhrResponse.value);
				},
				_getAsyncReadyStateChangeHandler = function ajax__getAsyncReadyStateChangeHandler(xhr, params) {
					return function ajax__getAsyncReadyStateChangeHandler_asyncReadyStateChangeHandler() {
						if (4 === xhr.readyState) {
							return _syncReadyStateChangeHandler(xhr, params);
						}
					};
				};

			return {
				/*
					params: {
						method: "OPTIONS"/"GET"/"HEAD"/"POST"/"PUT"/"PATCH"/"DELETE"/"TRACE"/"CONNECT",
						async: true/false,
						url: "components/movie/",
						queryOptions: {
							fileName: "root/next/users.json",
							maxCount: 100
						},
						data: {...},
						headers: {...},
						onSuccess: function (response) {...},
						onError: function (response) {...},
						handleAsJson: true/false
					}
				*/
				send: function ajax_send(params) {
					var xhr = _createXmlHttpRequest(params);
					xhr.send(params.data || null);
					if (false === params.async) {
						return _syncReadyStateChangeHandler(xhr, params);
					}
				},
				abort: function ajax_abort(xhrId) {
					var xhr = _xhrs[xhrId];
					if (xhr) {
						xhr.abort();
						return true;
					}
					return false;
				},
				abortAll: function ajax_abortAll() {
					var xhrId;
					for (xhrId in _xhrs) {
						_xhrs[xhrId].abort();
					}
					_xhrs = {};
				}
			};
		})();

		this["templateEngine"] = (function () {
			"use strict";

			var $Function = window.Function,
				_getTemplateEngine = function templateEngine__getTemplateEngine(processedTemplateString) {
					return new $Function("dataModel", "targetContainer",
						"var resultHtml = [];\n\n" +

						"resultHtml.push('" + processedTemplateString + "');\n\n" +

						"resultHtml = resultHtml.join('');\n\n" +

						"if (targetContainer) {\n" +
						"	return app.core.dom.createFromOuterHtml(resultHtml, targetContainer);\n" +
						"} else {\n" +
						"	return resultHtml;\n" +
						"}");
				};

			return function templateEngine(templateString) {
				var processedTemplateString = templateString.replace(/[\r\t\n]/g, " ")
				.split("{{").join("\t")
				.replace(/((^|}})[^\t]*)'/g, "dataModel.$1\\'")
				.replace(/\t(.*?)}}/g, "',dataModel.$1,'")
				.split("\t").join("');")
				.split("}}").join("resultHtml.push('");

				return _getTemplateEngine(processedTemplateString);
			};
		})();

		this["idsGenerator"] = (function () {
			"use strict";

			var $Math = window.Math,
				_idLength = 32,
				_portionCount = 100,
				_ids = [],
				CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
				CHARS_COUNT = CHARS.length,
				_simpleCounter = -1,
				_generateGuid = function idsGenerator__generateGuid() {
					var id = "",
						i;
					for (i = 0; i < _idLength; i++) {
						id += CHARS[$Math.floor($Math.random() * CHARS_COUNT)];
					}
					_ids[_ids.length] = id;
				},
				_generatePortion = function idsGenerator__generatePortion(portionCount) {
					var i;
					portionCount = portionCount || _portionCount;
					for (i = 0; i < portionCount; i++) {
						_generateGuid();
					}
				};

			_generatePortion(1000);

			return {
				setIdLength: function idsGenerator_setIdLength(value) {
					_idLength = value;
				},
				setPortionCount: function idsGenerator_setPortionCount(value) {
					_portionCount = value;
				},
				getIdForDomElement: function idsGenerator_getIdForDomElement(prefix) {
					return prefix ? prefix + "_" + (++_simpleCounter) : (++_simpleCounter);
				},
				getId: function idsGenerator_getId() {
					if (1 === _ids.length) {
						_generatePortion();
					}
					return _ids.pop();
				},
				getRange: function idsGenerator_getRange(count) {
					count = ("number" === typeof count && count > 0) ? count : _portionCount;
					if (count > _ids.length) {
						_generatePortion(count - _ids.length + 1);
					}
					return _ids.splice(_ids.length - count, count);
				}
			};
		})();

		this["classes"] = (function () {
			"use strict";

			var $Object = window.Object,
				_emptyCtor = function EmptyCtor() {},
				_callBaseCtors = function callBaseCtors(ctorArgs) {
					var ctors = this.__bases__,
						ctorsCount = ctors.length,
						i;
					for (i = 0; i < ctorsCount; i++) {
						ctors[i].apply(this, ctorArgs);
					}
				},
				_classesCounter = 0,
				_classMarker = app.core.idsGenerator.getId();

			return {
				/*
					params: {
						name: "myClass",
						base: function () {} / class,
						ctor: function () {},
						proto: {}
					}
				*/
				create: function classes_create(params) {
					var BaseClass = params.base,
						BaseClassProto, ClassBases, ClassProto;

					function Class() {
						this.__callBase__(arguments);
						this.__ctor__.apply(this, arguments);
					};

					if (BaseClass) {
						if (!BaseClass[_classMarker]) {
							BaseClass = this.create({
								name: BaseClass.name,
								ctor: BaseClass,
								proto: BaseClass.prototype
							});
						}
						BaseClassProto = BaseClass.prototype;
						ClassBases = BaseClassProto.__bases__.slice();
						ClassBases.push(BaseClassProto.__ctor__);
						ClassProto = $Object.create(BaseClassProto);
						ClassProto.base = BaseClassProto;
					} else {
						ClassProto = Class.prototype;
						ClassBases = [];
					}

					if (params.proto) {
						this.extend(ClassProto, params.proto);
					}

					ClassProto.__bases__ = ClassBases;
					ClassProto.__callBase__ = _callBaseCtors;
					ClassProto.__ctor__ = params.ctor || _emptyCtor;
					ClassProto.__className__ = params.name || ("Class_" + _classesCounter++);

					Class.prototype = ClassProto;
					Class[_classMarker] = true;

					return Class;
				},

				extend: function classes_extend(targetObj, sourceObj) {
					var propName;
					for (propName in sourceObj) {
						if (sourceObj.hasOwnProperty(propName)) {
							targetObj[propName] = sourceObj[propName];
						}
					}
				},

				mix: function classes_mix(targetObj, sourceObjects) {
					var sourceObjectsCount = sourceObjects.length,
						i, sourceObj, propName;

					for (i = 0; i < sourceObjectsCount; i++) {
						sourceObj = sourceObjects[i];
						for (propName in sourceObj) {
							if (sourceObj.hasOwnProperty(propName) && !targetObj.hasOwnProperty(propName)) {
								targetObj[propName] = sourceObj[propName];
							}
						}
					}
				}
			};
		})();

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
							if ("class" === moduleWrapper.type) {
								module.name = module.name || moduleWrapper.name;
								module.base = base;
								module = $classes.create(module);
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

		this["dom"] = (function () {
			"use strict";

			var $window = window,
				$document = $window.document,
				$dom = null,
				_docHead = $document.head,
				_docBody = $document.body,
				_tempNode = $document.createElement("tmp");

			if ("complete" !== $document.readyState) {
				$window.addEventListener("load", function window_onload_listener() {
					_docHead = _docHead || ($dom.head = $document.head);
					_docBody = _docBody || ($dom.body = $document.body);
					$window.removeEventListener("load", window_onload_listener);
				});
			}

			return $dom = {
				doc: $document,
				head: _docHead,
				body: _docBody,

				getAll: function dom_getAll(selector, targetNode) {
					return (targetNode || $document).querySelectorAll(selector);
				},
				getFirst: function dom_getFirst(selector, targetNode) {
					return (targetNode || $document).querySelector(selector);
				},

				create: function dom_create(tagName, properties, children, parentNode) {
					var node = $document.createElement(tagName),
						propName, i, childrenCount, childData;

					if (properties) {
						for (propName in properties) {
							node[propName] = properties[propName];
						}
					}

					if (children) {
						childrenCount = children.length;
						for (i = 0; i < childrenCount; i++) {
							childData = children[i];
							this.create(childData.tagName, childData.properties, childData.children, node);
						}
					}

					if (undefined !== parentNode) {
						parentNode.appendChild(node);
					}

					return node;
				},
				createFromOuterHtml: function dom_createFromString(nodeOuterHtml, parentNode) {
					var nodes = [],
						node, tempNodes, i;

					_tempNode.innerHTML = nodeOuterHtml;
					tempNodes = _tempNode.childNodes;

					if (parentNode) {
						for (i = 0; i < tempNodes.length; i++) {
							node = parentNode.appendChild(tempNodes[i]);
							nodes.push(node);
						}
					} else {
						for (i = 0; i < tempNodes.length; i++) {
							node = this.copy(tempNodes[i], null, true);
							nodes.push(node);
						}
					}

					_tempNode.innerHTML = "";

					return (1 === nodes.length) ? nodes[0] : nodes;
				},
				createFragment: function dom_createFragment(nodesData /* Array of objects: { tagName, properties, children } */, parentNode) {
					var docFragment = $document.createDocumentFragment(),
						nodesCount = nodesData.length,
						i, nodeData;

					for (i = 0; i < nodesCount; i++) {
						nodeData = nodesData[i];
						this.create(nodeData.tagName, nodeData.properties, nodeData.children, docFragment);
					}

					if (parentNode) {
						parentNode.appendChild(docFragment);
					}

					return docFragment;
				},

				copy: function dom_copy(node, parentNode, makeItShallow) {
					var nodeCopy = node.cloneNode(!makeItShallow);
					if (parentNode) {
						parentNode.appendChild(nodeCopy);
					}
					return nodeCopy;
				},

				empty: function dom_empty(node) {
					node.innerHTML = "";
				},

				remove: function (node) {
					var parentNode = node.parentNode;
					if (parentNode) {
						parentNode.removeChild(node);
					}
				}
			};
		})();

		this["stylesManager"] = (function () {
			"use strict";

			var $dom = app.core.dom,
				_styleElem = $dom.create("STYLE");

			$dom.head.insertBefore(_styleElem, $dom.getFirst("script", $dom.head));

			return {
				include: function stylesManager_include(cssImportString1/*, cssImportString2, ...*/) {
					var importsCount = arguments.length,
						imports = _styleElem.innerHTML,
						newImports = "",
						importStr, i;

					for (i = 0; i < importsCount; i++) {
						importStr = arguments[i];
						if (-1 === imports.indexOf(importStr)) {
							newImports += importStr;
						}
					}

					_styleElem.innerHTML += newImports;
				},

				exclude: function stylesManager_exclude(cssImportString/*, cssImportString2, ...*/) {
					var importsCount = arguments.length,
						newImports = _styleElem.innerHTML,
						i, importStr;

					for (i = 0; i < importsCount; i++) {
						importStr = arguments[i];
						newImports = newImports.replace(importStr, "");
					}

					_styleElem.innerHTML = newImports;
				}
			};
		})();

		this["mediator"] = (function () {
			"use strict";

			var $idsGenerator = app.core.idsGenerator;

			function Mediator() {
				this._channels = {};
			}

			Mediator.prototype = {
				subscribe: function Mediator_subscribe(name, callback) {
					var channel = this._channels[name],
						callbackId = $idsGenerator.getId();

					if (!channel) {
						channel = (this._channels[name] = {});
					}

					channel[callbackId] = callback;

					return callbackId;
				},

				unsubscribe: function Mediator_unSubscribe(name, callbackId) {
					var channel = this._channels[name];

					if (channel) {
						delete channel[callbackId];
					}
				},

				unsubscribeAll: function Mediator_unsubscribeAll() {
					this._channels = {};
				},

				publish: function Mediator_publish(name, arg) {
					var channel = this._channels[name],
						callbackId;

					if (channel) {
						for (callbackId in channel) {
							channel[callbackId](arg, this);
						}
					}
				}
			};

			return Mediator;
		})();

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

		this["keyCodes"] = (function () {
			"use strict";

			return {
				BACKSPACE: 8,
				TAB: 9,
				CLEAR: 12,
				ENTER: 13,
				SHIFT: 16,
				CTRL: 17,
				ALT: 18,
				PAUSE: 19,
				CAPS_LOCK: 20,
				ESCAPE: 27,
				SPACE: 32,
				PAGE_UP: 33,
				PAGE_DOWN: 34,
				END: 35,
				HOME: 36,
				LEFT_ARROW: 37,
				UP_ARROW: 38,
				RIGHT_ARROW: 39,
				DOWN_ARROW: 40,
				INSERT: 45,
				DELETE: 46,
				HELP: 47,
				LEFT_WINDOW: 91,
				RIGHT_WINDOW: 92,
				SELECT: 93,
				NUMPAD_0: 96,
				NUMPAD_1: 97,
				NUMPAD_2: 98,
				NUMPAD_3: 99,
				NUMPAD_4: 100,
				NUMPAD_5: 101,
				NUMPAD_6: 102,
				NUMPAD_7: 103,
				NUMPAD_8: 104,
				NUMPAD_9: 105,
				NUMPAD_MULTIPLY: 106,
				NUMPAD_PLUS: 107,
				NUMPAD_ENTER: 108,
				NUMPAD_MINUS: 109,
				NUMPAD_PERIOD: 110,
				NUMPAD_DIVIDE: 111,
				F1: 112,
				F2: 113,
				F3: 114,
				F4: 115,
				F5: 116,
				F6: 117,
				F7: 118,
				F8: 119,
				F9: 120,
				F10: 121,
				F11: 122,
				F12: 123,
				F13: 124,
				F14: 125,
				F15: 126,
				NUM_LOCK: 144,
				SCROLL_LOCK: 145,
				UP_DPAD: 175,
				DOWN_DPAD: 176,
				LEFT_DPAD: 177,
				RIGHT_DPAD: 178
			};
		})();

		this["dbAccessor"] = (function () {
			"use strict";

			var $ajax = app.core.ajax,
				$dbPath = app.config.dbPath;

			return {
				/*
					params: {
						table: "movie",
						callback: function (res) { ... }
					}
				*/
				get: function dbAccessor_get(params) {
					var reqCallback = params.callback,
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

		//configProcessor - last loaded module, processes configuration settings for the app
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

		/* --- CORE_MODULES --- */
	}).call(self);

	return self;

})(this, "core");