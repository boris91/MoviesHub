MH.modules.define("components.movie.model",
	null,
	function MH$core$modules$define_moduleGetter_components$movie$model () {
		"use strict";
		var idsGenerator = MH.core.idsGenerator,
			coversPath = MH.config.resourcesPath + "movie/covers/",
			placeholdersPath = MH.config.resourcesPath + "movie/placeholders/";

		function MovieModel (props) {
			this.id = props.id || idsGenerator.getId();
			this.title = props.title || "Untitled";
			this.description = props.description || "";

			props.meta = props.meta || {};
			this.meta = {
				releaseYear: props.meta.releaseYear || (1900 + (new Date().getYear())),
				directors: props.meta.directors || [],
				actors: props.meta.actors || []
			};

			props.images = props.images || {};
			this.images = {
				cover: (props.images.cover ? coversPath + props.images.cover : ""),
				placeholder: (props.images.placeholder ? placeholdersPath + props.images.placeholder : "")
			};

			this.streams = props.streams || [];
		};

		MovieModel.prototype = {
			getActorsNames: function () {
				var names = [],
					actors = this.meta.actors,
					actorsCount = actors.length,
					name, i;

				for (i = 0; i < actorsCount; i++) {
					name = actors[i].name;
					names.push(name);
				}

				return names.join(", ");
			},
			concatStringForEachStream: function (handler/*function which returns string*/) {
				var streams = this.streams,
					streamsCount = streams.length,
					resultString = "",
					i;
				for (i = 0; i < streamsCount; i++) {
					resultString += handler(streams[i]);
				}
				return resultString;
			}
		};

		return MovieModel;
	});