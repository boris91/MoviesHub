({
	type: "class",
	name: "components.movie.view",
	base: "components._base.view",
	getter: function () {
		"use strict";

		return {
			name: "MovieView",

			ctor: function MovieView() {
				//this.subscribe("onInitComplete");
			},

			proto: {
				_componentName: "movie",

				init: function MovieView_init(viewsParams) {
					this.base.init.apply(this, arguments);
				},

				// +++ events +++
				onSelectMovie: function MovieView_onSelectMovie(arg) {
					this.publish("onSelectMovie", arg);
				}
				// --- events ---
			}
		};
	}
})