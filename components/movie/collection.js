MH.modules.define("components.movie.collection",
	[
		"components.movie.model"
	],
	function MH$core$modules$define_moduleGetter_components$movie$collection (MovieModel) {
		"use strict";

		return function MovieCollection (dbMovies) {
			var _movies = {},
				_selectedMovieId = null,
				_self = {
					// +++ public methods +++
					init: function (dbMovies) {
						var moviesCount = dbMovies.length,
							i;

						_movies = {};

						for (i = 0; i < moviesCount; i++) {
							this.add(dbMovies[i]);
						}

						if (0 < moviesCount) {
							this.select(dbMovies[0].id);
						}
					},

					add: function (dbMovie) {
						var movie = new MovieModel(dbMovie),
							existingMovie = _movies[movie.id];
						if (!existingMovie) {
							_movies[movie.id] = movie;
						}
					},

					get: function (id, /*?*/ propName) {
						var movie = _movies[id];

						if (movie) {
							return ('string' === typeof propName) ? movie[propName] : movie;
						} else {
							return null;
						}
					},

					getSelected: function () {
						return _movies[_selectedMovieId];
					},

					forEach: function (action) {
						var result = false,
							id;
						for (id in _movies) {
							result = action(_movies[id]) || result;
						}
						return result;
					},

					update: function (id, props) {
						var movie = _movies[id],
							propName;

						if (movie) {
							for (propName in props) {
								movie[propName] = props[propName];
							}
						}
					},

					remove: function (id) {
						return (delete _movies[id]);
					},

					dispose: function () {
						_movies = null;
						_selectedMovieId = null;
					},

					select: function (id) {
						_selectedMovieId = id;
					}
					// --- public methods ---
				};

			if (dbMovies) {
				_self.init(dbMovies);
			}

			return _self;
		};
	});