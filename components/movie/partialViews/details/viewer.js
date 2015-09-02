({
	type: "class",
	name: "components.movie.partialViews.details.viewer",
	base: "components._base.partialViewers.single",
	deps: [
		"CSS:components.movie.partialViews.details.styles",
		"HTML:components.movie.partialViews.details.template"
	],
	getter: function getterOf_MovieDetailsViewer(detailsStyles, detailsTemplate) {
		"use strict";
		var $dom = app.core.dom;

		return {
			name: "MovieDetailsViewer",

			ctor: function MovieDetailsViewer() { },

			proto: {
				_styles: detailsStyles,
				_template: detailsTemplate,

				init: function MovieDetailsViewer_init() {
					this.base.init.apply(this, arguments);
					this._domContainer = $dom.getFirst(".components_movie_details_container");
				}
			}
		};
	}
})