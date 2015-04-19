MH.modules.define("layouts.moviesGallery.controller",
	[
		"HTML:layouts.moviesGallery.layout",
		"components.movie.viewModel"
	],
	function MH$modules$define_moduleGetter_layouts$moviesGallery$controller (moviesGalleryLayout, MovieViewModel) {
		"use strict";
		var dom = MH.core.dom,
			dbAccessor = MH.core.dbAccessor,

			_vm = null,

			_getModelContainer = function () {
				return dom.getFirst("#components_movie_model_container");
			},
			_getCollectionContainer = function () {
				return dom.getFirst("#components_movie_collection_container");
			};

		return {
			init: function () {
				var vmParams;

				moviesGalleryLayout(null, dom.body);

				vmParams = {
					view: {
						modelDomContainer: _getModelContainer(),
						collectionDomContainer: _getCollectionContainer()
					},
					collection: dbAccessor.get("movie")
				};

				_vm = new MovieViewModel();
				_vm.init(vmParams);
			},

			dispose: function () {
				var modelContainer = _getModelContainer(),
					collectionContainer = _getCollectionContainer();

				_vm.dispose();

				dom.remove(collectionContainer);
				dom.remove(modelContainer);
			}
		};
	});