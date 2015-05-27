({
	name: "layouts.moviesGallery.viewModelParams.movie",
	getter: function () {
		"use strict";
		var $dom = app.core.dom;

		return {
			collection: {
				params: null,
				handlers: {
					"tiles": {
						"onInitComplete": function (event, moviesCollection) {
							this.render(moviesCollection);
						}
					},
					"details": {
						"onSelectMovie": function (event, moviesCollection) {
							var movie = moviesCollection.fetch(event.movieId);
							this.erase();
							this.render(movie);
						}
					}
				}
			},
			view: {
				params: {
					"tiles": {
						domContainer: $dom.getFirst("#components_movie_tiles_container"),
						listeners: {
							"click": function (event) {
								var selectedMovieId = event.target.getAttribute("tiles-item-id");

								if (selectedMovieId) {
									this.onSelectMovie({ movieId: selectedMovieId });
								}
							}
						}
					},
					"details": {
						domContainer: $dom.getFirst("#components_movie_details_container")
					}
				},
				handlers: {
					"tiles": {
						"onSelectMovie": function (event, movieTilesViewer) {
							this.select(event.movieId);
						}
					}
				}
			}
		};
	}
})