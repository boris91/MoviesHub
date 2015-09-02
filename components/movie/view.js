({
	type: "class",
	name: "components.movie.view",
	base: "components._base.view",
	deps: [
		"core.dataStructures.event"
	],
	getter: function getterOf_MovieView($Event) {
		"use strict";

		return {
			name: "MovieView",

			ctor: function MovieView() {
				this.movieSelected = new $Event();
				this.initCompleted.add(this.onViewInitCompleted, this);
			},

			proto: {
				_componentName: "movie",
				_partialViewsNames: [
					"tiles",
					"details"
				],

				onViewInitCompleted: function MovieView_onInitCompleted() {
					this._partialViews["tiles"].movieSelected.add(this.onTilesMovieSelected, this);
				},

				onTilesMovieSelected: function MovieView_onTilesMovieSelected(movieId) {
					this.movieSelected.trigger(movieId);
				}
			}
		};
	}
})