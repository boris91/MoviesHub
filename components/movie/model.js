({
	type: "class",
	name: "components.movie.model",
	base: "components._base.model",
	getter: function () {
		"use strict";

		var $idsGenerator = app.core.idsGenerator,
			$coversPath = app.config.resourcesPath + "movie/covers/",
			$placeholdersPath = app.config.resourcesPath + "movie/placeholders/";

		return {
			name: "MovieModel",

			ctor: function MovieModel(props) {
				var metaInfo, imagesData;

				props = props || {};

				metaInfo = props.meta || {};
				imagesData = props.images || {};

				this.title = props.title || "";
				this.description = props.description || "";

				this.meta = {
					releaseYear: metaInfo.releaseYear || (1900 + (new Date().getYear())),
					directors: metaInfo.directors || [],
					actors: metaInfo.actors || []
				};

				this.images = {
					cover: (imagesData.cover ? $coversPath + imagesData.cover : ""),
					placeholder: (imagesData.placeholder ? $placeholdersPath + imagesData.placeholder : "")
				};

				this.streams = props.streams || [];
			},

			proto: {
				getActorsNames: function MovieModel_getActorsNames() {
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
				concatStringForEachStream: function MovieModel_concatStringForEachStream(handler/*function which returns string*/) {
					var streams = this.streams,
						streamsCount = streams.length,
						resultString = "",
						i;
					for (i = 0; i < streamsCount; i++) {
						resultString += handler(streams[i]);
					}
					return resultString;
				}
			}
		};
	}
})