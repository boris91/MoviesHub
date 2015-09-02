({
	type: "class",
	name: "components.movie.partialViews.tiles.viewer",
	base: "components._base.partialViewers.multi",
	deps: [
		"CSS:components.movie.partialViews.tiles.styles",
		"HTML:components.movie.partialViews.tiles.template",
		"core.dataStructures.event"
	],
	getter: function getterOf_MovieTilesViewer(tilesStyles, tilesItemTemplate, $Event) {
		"use strict";

		var $dom = app.core.dom;

		return {
			name: "MovieTilesViewer",

			ctor: function MovieTilesViewer() {
				this.movieSelected = new $Event();
			},

			proto: {
				_styles: tilesStyles,
				_template: tilesItemTemplate,
				_itemIdAttr: "tiles_item_id",

				init: function MovieTilesViewer_init() {
					this.base.init.apply(this, arguments);
					this._domContainer = $dom.getFirst(".components_movie_tiles_container");
					this._addEventListeners({
						"click": this.onClick
					});
				},

				onClick: function MovieTilesViewer_onClick(event) {
					var selectedMovieId = event.target.getAttribute(this._itemIdAttr);

					if (selectedMovieId) {
						this.movieSelected.trigger(selectedMovieId);
					}
				}
			}
		};
	}
})