({
	type: "class",
	name: "components.movie.viewModel",
	base: "components._base.viewModel",
	deps: [
		"components.movie.collection",
		"components.movie.view"
	],
	getter: function getterOf_MovieViewModel(MovieCollection, MovieView) {
		"use strict";

		return {
			name: "MovieViewModel",

			proto: {
				_CollectionClass: MovieCollection,
				_ViewClass: MovieView,

				_bindViewToCollection: function MovieViewModel__bindViewToCollection() {
					this._collection.movieSelected.add(this.onCollectionMovieSelected, this);
					this._collection.initCompleted.add(this.onCollectionInitCompleted, this);
				},

				_bindCollectionToView: function MovieViewModel__bindCollectionToView() {
					this._view.movieSelected.add(this.onViewMovieSelected, this);
				},

				onCollectionMovieSelected: function MovieViewModel_onCollectionMovieSelected(movieId) {
					var movie = this._collection.fetch(movieId);
					this._view.erase("details");
					this._view.render("details", movie);
				},

				onCollectionInitCompleted: function MovieViewModel_onCollectionInitCompleted(collection) {
					this._view.render("tiles", collection);
				},

				onViewMovieSelected: function MovieViewModel_onViewMovieSelected(movieId) {
					this._collection.select(movieId);
				}
			}
		};
	}
})