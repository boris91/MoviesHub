MH.modules.define("core.stylesManager",
	[
		"core.dom"
	],
	function MH$core$modules$define_moduleGetter_stylesManager (MH$core$dom) {
		"use strict";

		var _styleElem = MH$core$dom.create("STYLE");

		MH$core$dom.head.insertBefore(_styleElem, MH$core$dom.getFirst("script", MH$core$dom.head));

		return {
			include: function MH$core$stylesManager$include (cssImportString1/*, cssImportString2, ...*/) {
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

			exclude: function MH$core$stylesManager$exclude (cssImportString/*, cssImportString2, ...*/) {
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
	});