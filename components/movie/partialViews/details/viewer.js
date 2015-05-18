({
	name: "components.movie.partialViews.details.viewer",
	base: "components._base.partialViewers.single",
	deps: [
		"CSS:components.movie.partialViews.details.styles",
		"HTML:components.movie.partialViews.details.template"
	],
	getter: function (detailsStyles, detailsTemplate) {
		"use strict";

		function MovieDetailsViewer() { }

		MovieDetailsViewer.prototype = {
			_styles: detailsStyles,
			_template: detailsTemplate
		};

		return MovieDetailsViewer;
	}
})