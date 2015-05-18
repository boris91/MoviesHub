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