({
	type: "class",
	name: "components.movie.partialViews.tiles.viewer",
	base: "components._base.partialViewers.multi",
	deps: [
		"CSS:components.movie.partialViews.tiles.styles",
		"HTML:components.movie.partialViews.tiles.template",
		"core.dataStructures.event"
	],
	getter: function (tilesStyles, tilesItemTemplate, $Event) {
		"use strict";

		return {
			name: "MovieTilesViewer",

			ctor: function MovieTilesViewer() {
				this.movieSelected = new $Event();
			},

			proto: {
				_styles: tilesStyles,
				_template: tilesItemTemplate,
				onSelectMovie: function MovieTilesViewer_onSelectMovie(event) {
					this.movieSelected.trigger(event);
				}
			}
		};
	}
})