({
	type: "class",
	name: "layouts.moviesGallery.controller",
	base: "components._base.layouts.controller",
	deps: [
		"HTML:layouts.moviesGallery.template",
		"CSS:layouts.moviesGallery.styles",
		"components.movie.viewModel"
	],
	getter: function (moviesGalleryTemplate, moviesGalleryStyles, MovieViewModel) {
		"use strict";

		return {
			name: "MoviesGalleryLayoutController",

			proto: {
				_ViewModelClass: MovieViewModel,
				_layoutTemplate: moviesGalleryTemplate,
				_layoutStyles: moviesGalleryStyles,
				_dbTableName: "movie",
				_vmParamsModuleName: "layouts.moviesGallery.viewModelParams.movie"
			}
		};
	}
})