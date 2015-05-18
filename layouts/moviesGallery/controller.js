({
	name: "layouts.moviesGallery.controller",
	deps: [
		"HTML:layouts.moviesGallery.template",
		"CSS:layouts.moviesGallery.styles",
		"components.movie.viewModel"
	],
	getter: function (moviesGalleryTemplate, moviesGalleryStyles, MovieViewModel) {
		"use strict";

		var $core = app.core,
			$dom = $core.dom,
			$domBody = $dom.body,
			$modules = $core.modules,
			$dbAccessor = $core.dbAccessor,
			$stylesManager = $core.stylesManager,

			_movieViewModelParams = null,
			_vm = new MovieViewModel(),

			_getMoviesFromDb = function moviesGallery__getMoviesFromDb(callback) {
				$dbAccessor.get({
					table: "movie",
					callback: callback
				});
			};

		return {
			init: function moviesGallery_init() {
				$stylesManager.include(moviesGalleryStyles);
				moviesGalleryTemplate(null, $domBody);

				_getMoviesFromDb(function onMoviesDbTableGet(dbData) {
					$modules.require("layouts.moviesGallery.viewModelParams.movie", function (movieVMParams) {
						_movieViewModelParams = movieVMParams;
						_movieViewModelParams.collection.params = dbData;
						_vm.init(_movieViewModelParams);
					});
				});
			},

			refresh: function moviesGallery_refresh() {
				this.dispose();
				this.init();
			},

			dispose: function moviesGallery_dispose() {
				var activeViews = _movieViewModelParams.view.views,
					viewName, viewDomContainer;

				_vm.dispose();
				_movieViewModelParams.collection.data = null;

				for (viewName in activeViews) {
					viewDomContainer = activeViews[viewName].domContainer;
					$dom.remove(viewDomContainer);
				}

				$stylesManager.exclude(moviesGalleryStyles);
			}
		};
	}
})