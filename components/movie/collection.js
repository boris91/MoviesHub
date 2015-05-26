({
	type: "class",
	name: "components.movie.collection",
	base: "components._base.collection",
	deps: [
		"components.movie.model"
	],
	getter: function (MovieModel) {
		"use strict";

		return {
			name: "MovieCollection",

			ctor: function MovieCollection() {
				this._selectedModelId = null;
			},

			proto: {
				_ModelClass: MovieModel,

				init: function MovieCollection_init(models) {
					this.base.init.apply(this, arguments);

					if (0 < models.length) {
						this.select(models[0].id);
					}
				},

				getSelected: function MovieCollection_getSelected() {
					return this._models[this._selectedModelId];
				},

				select: function MovieCollection_select(id) {
					if (id !== this._selectedModelId) {
						this._selectedModelId = id;
						this.onSelectMovie({ movieId: id });
					}
				},

				dispose: function MovieCollection_dispose() {
					this.base.dispose.apply(this, arguments);

					this._selectedMovieId = null;
				},

				// +++ events +++
				onSelectMovie: function MovieCollection_onSelectMovie(event) {
					event = event || { movieId: this._selectedModelId };
					this.publish("onSelectMovie", event);
				}
				// --- events ---
			}
		};
	}
})