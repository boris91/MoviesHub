MH.modules.define("core.templateEngine",
	[
		"core.dom"
	],
	function MH$core$modules$define_moduleGetter_templateEngine (MH$core$dom) {
		"use strict";

		var MH$Func = MH.Func,
			_getTemplateEngine = function MH$core$templateEngine$_getTemplateEngine (processedTemplateString) {
				return new MH$Func("dataModel", "targetContainer",
					"var resultHtml = [];\n\n" +

					"resultHtml.push('" + processedTemplateString + "');\n\n" +

					"resultHtml = resultHtml.join('');\n\n" +

					"if (targetContainer) {\n" +
					"	return this.createFromOuterHtml(resultHtml, targetContainer);\n" +
					"} else {\n" +
					"	return resultHtml;\n" +
					"}").bind(MH$core$dom);
			};

		return function MH$core$templateEngine (templateString) {
			var processedTemplateString = templateString.replace(/[\r\t\n]/g, " ")
			.split("{{").join("\t")
			.replace(/((^|}})[^\t]*)'/g, "dataModel.$1\\'")
			.replace(/\t(.*?)}}/g, "',dataModel.$1,'")
			.split("\t").join("');")
			.split("}}").join("resultHtml.push('");

			return _getTemplateEngine(processedTemplateString);
		};
	});