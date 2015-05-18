({
	name: "components.movie.view",
	base: "components._base.view",
	getter: function () {
		"use strict";

		function MovieView() {
			//this.subscribe("onInitComplete");
		}

		MovieView.prototype = {
			_componentName: "movie",

			init: function MovieView_init(viewsParams) {
				this.__base__.init.apply(this, arguments);
			},

			// +++ events +++
			onSelectMovie: function MovieView_onSelectMovie(arg) {
				this.publish("onSelectMovie", arg);
			}
			// --- events ---
		};

		return MovieView;
	}
})