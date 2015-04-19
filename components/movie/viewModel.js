MH.modules.define("components.movie.viewModel",
	[
		"components.movie.collection",
		"components.movie.view"
	],
	function MH$core$modules$define_moduleGetter_components$movie$viewModel (MovieCollection, MovieView) {
		"use strict";

		return function MovieViewModel () {
			var _collection = null,
				_view = null,

				_renderCollection = function () {
					_view.renderCollection(_collection, {
						"click": function (event) {
							var selectedItemId = event.target.getAttribute("collection-item-id");

							if (selectedItemId && selectedItemId !== _collection.getSelected()) {
								_collection.select(selectedItemId);
								_renderSelectedMovie();
							}
						}
					});
				},
				_renderSelectedMovie = function () {
					_view.renderModel(_collection.getSelected());
				},

				_bind = function () {
					//TODO: implement with eventsMap usage
				},
				_unbind = function () {
					//TODO: implement with eventsMap usage
				};

			return {
				init: function (params/*view, collection*/) {
					var dbData;

					if (_collection && _view) {
						_unbind();
					}

					_collection = new MovieCollection(params.collection);
					_view = new MovieView(params.view);

					_renderCollection();
					_renderSelectedMovie();

					_bind();
				},

				dispose: function () {
					_collection.dispose();
					_view.dispose();

					_collection = null;
					_view = null;
					_bind = null;
					_unbind = null;
				}
			};
		}
	});