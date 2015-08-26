({
	type: "class",
	name: "components.movie.view",
	base: "components._base.view",
	deps: [
		"core.dataStructures.event"
	],
	getter: function ($Event) {
		"use strict";

		return {
			name: "MovieView",

			ctor: function MovieView() {
				this.movieSelected = new $Event();
			},

			proto: {
				_componentName: "movie",

				_addAndInit: function MovieView__addAndInit(viewName, viewParams, Viewer) {
					var viewer = this.base._addAndInit.apply(this, arguments);
					if (viewer.movieSelected instanceof $Event) {
						viewer.movieSelected.add(this.onMovieSelected, this);
					}
				},

				init: function MovieView_init(viewsParams) {
					this.base.init.apply(this, arguments);
				},

				onMovieSelected: function MovieView_onMovieSelected(arg) {
					this.movieSelected.trigger(arg);
				}
			}
		};
	}
})