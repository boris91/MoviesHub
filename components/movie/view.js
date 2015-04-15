MH.modules.define("components.movie.view",
	[
		"HTML:components.movie.template",
		"HTML:components.movie.collectionItemTemplate",
		"CSS:components.movie.styles",
		"CSS:components.movie.collectionStyles"
	],
	function MH$core$modules$define_moduleGetter_components$movie$view (movieTemplate, movieCollectionItemTemplate, movieStyles, movieCollectionStyles) {
		"use strict";
		var dom = MH.core.dom,
			templateEngine = MH.core.templateEngine,
			stylesManager = MH.core.stylesManager;

		return function MovieView (eventsMap) {
			var _commonDomContainer = dom.create("DIV", { id: "components_movie_common_container", style: "text-align: center;" }, null, dom.body),
				_modelDomContainer = dom.create("DIV", { id: "components_movie_model_container" }, null, _commonDomContainer),
				_collectionDomContainer = dom.create("DIV", { id: "components_movie_collection_container" }, null, _commonDomContainer);

			stylesManager.include(movieStyles, movieCollectionStyles);

			return {
				renderModel: function (model) {
					this.eraseModel();
					movieTemplate(model, _modelDomContainer);
				},

				renderCollection: function (collection, eventsHandlers) {
					var eventName, handler;

					this.eraseCollection();
					collection.forEach(function (model) {
						movieCollectionItemTemplate(model, _collectionDomContainer);
					});

					for (eventName in eventsHandlers) {
						handler = eventsHandlers[eventName];
						_collectionDomContainer.addEventListener(eventName, handler, false);
					}
				},

				eraseModel: function () {
					dom.empty(_modelDomContainer);
				},

				eraseCollection: function () {
					dom.empty(_collectionDomContainer);
				},

				dispose: function () {
					this.eraseModel();
					this.eraseCollection();
					stylesManager.exclude(movieStyles, movieCollectionStyles);

					_commonDomContainer = null;
					_modelDomContainer = null;
					_collectionDomContainer = null;
				}
			}
		};
	});