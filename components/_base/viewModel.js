({
	type: "class",
	name: "components._base.viewModel",
	deps: [
		"core.dataStructures.event"
	],
	getter: function getterOf_BaseViewModel($Event) {
		"use strict";

		return {
			name: "BaseViewModel",

			ctor: function BaseViewModel() {
				this._collection = null;
				this._view = null;
			},

			proto: {
				_CollectionClass: null,// virtual, gotta be overridden after inheritance from this class
				_ViewClass: null,// virtual, gotta be overridden after inheritance from this class
				_bindViewToCollection: null,// virtual, gotta be overridden after inheritance from this class
				_bindCollectionToView: null,// virtual, gotta be overridden after inheritance from this class

				_getHandlerToBind: function BaseViewModel__getHandlerToBind(handler, sender) {
					return function handlerToBind(event) {
						handler.call(this, event, sender);
					};
				},

				_unbind: function BaseViewModel__unbind() {
					$Event.clearEventsFor(this._collection);
					this._view.forEach(function (partialView) {
						$Event.clearEventsFor(partialView);
					});
					$Event.clearEventsFor(this._view);
				},

				init: function BaseViewModel_init(data) {
					if (this._collection && this._view) {
						this._unbind();
					}

					this._collection = new this._CollectionClass();
					this._view = new this._ViewClass();

					this._view.initCompleted.add(this.onViewInitCompleted, this, [data]);
					this._view.init();
				},

				dispose: function BaseViewModel_dispose() {
					this._unbind();

					this._collection.dispose();
					this._view.dispose();

					this._collection = null;
					this._view = null;
					$Event.clearEventsFor(this);
				},

				onViewInitCompleted: function BaseViewModel_onViewInitCompleted(data) {
					this._bindViewToCollection();
					this._bindCollectionToView();
					this._collection.init(data);
				}
			}
		};
	}
})