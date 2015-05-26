({
	type: "class",
	name: "components.movie.viewModel",
	base: "components._base.viewModel",
	deps: [
		"components.movie.collection",
		"components.movie.view"
	],
	getter: function (MovieCollection, MovieView) {
		"use strict";

		return {
			name: "MovieViewModel",

			ctor: function MovieViewModel() { },

			proto: {
				_CollectionClass: MovieCollection,
				_ViewClass: MovieView
			}
		};
	}
})