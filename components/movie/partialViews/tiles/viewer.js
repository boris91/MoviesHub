({
	name: "components.movie.partialViews.tiles.viewer",
	base: "components._base.partialViewers.multi",
	deps: [
		"CSS:components.movie.partialViews.tiles.styles",
		"HTML:components.movie.partialViews.tiles.template"
	],
	getter: function (tilesStyles, tilesItemTemplate) {
		"use strict";

		function MovieTilesViewer() { }

		MovieTilesViewer.prototype = {
			_styles: tilesStyles,
			_template: tilesItemTemplate,
			onSelectMovie: function MovieTilesViewer_onSelectMovie(event) {
				this.publish("onSelectMovie", event);
			}
		};

		return MovieTilesViewer;
	}
})