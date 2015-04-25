This is the video playing web-application.

To run it in browser (FF last version, Chrome last version, IE last version) you should:
	1. Copy this GIT-repository in your local folder ("D:\MoviesHub\", for example).
	2. Create IIS application directed to this folder and call it as you want ("MoviesHubApp", for example).
	3. Then you may run application by going to "http://localhost/MoviesHubApp".
	4. You can click on images downstairs the page to switch between existing movies.


Project structure:
	1. layouts/index.html - main view of application, uses app.js file, initializes "movie"-component ViewModel.
	2. app.js - main javascript file of application, reads configuration settings from config.json file and runs MH.js using them.
	3. MH.js - file with main global namespace of application, loads and initializes all default modules (this is part of my own framework).
	4. web.config - includes MIME-type for JSON files.
	5. core folder - provides all core modules for application (developed previously by myself in my own framework).
	6. data folder - consists of static content - db (emulated with set of json-files, now there's only one file - movie.json) and resources (images for movies covers and placeholders).
	7. components folder - provides components for application; right now there's only one component - "movie", which consists of ViewModel, Collection, Model, View js-files and also css-styles and html-templates.

Principles of work:
	1. layouts/index.html inits MovieViewModel.
	2. MovieViewModel reads movies data from "DB" (json-file) using MH.core.dbAccessor-helper.
	3. MovieViewModel inits MovieCollection with fetched movies data (MovieCollection consists of set of MovieModel-instances).
	4. MovieViewModel create MovieView.
	5. MovieView renders MovieCollection and MovieModel-instance of first movie.