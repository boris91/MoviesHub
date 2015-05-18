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