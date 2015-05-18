({
	name: "components.movie.viewModel",
	base: "components._base.viewModel",
	deps: [
		"components.movie.collection",
		"components.movie.view"
	],
	getter: function (MovieCollection, MovieView) {
		"use strict";

		function MovieViewModel() { }

		MovieViewModel.prototype = {
			_CollectionClass: MovieCollection,
			_ViewClass: MovieView
		};

		return MovieViewModel;
	}
})