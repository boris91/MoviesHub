({
	type: "class",
	name: "components._base.viewModel",
	deps: [
		"core.dataStructures.event"
	],
	getter: function ($Event) {
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

				_getHandlerToBind: function BaseViewModel__getHandlerToBind(handler, sender) {
					return function (event) {
						handler.call(this, event, sender);
					};
				},

				_bindViewToCollection: function BaseViewModel__bindViewToCollection(bindingInfos) {
					var collection = this._collection,
						view = this._view,
						partialViewName, partialView, handlers, eventName, handler;

					for (partialViewName in bindingInfos) {
						partialView = view.getPartialView(partialViewName);
						handlers = bindingInfos[partialViewName];
						for (eventName in handlers) {
							handler = this._getHandlerToBind(handlers[eventName], collection);
							collection[eventName].add(handler, partialView);
						}
					}
				},

				_bindCollectionToView: function BaseViewModel__bindCollectionToView(bindingInfos) {
					var collection = this._collection,
						view = this._view,
						partialViewName, partialView, handlers, eventName, handler;

					for (partialViewName in bindingInfos) {
						partialView = view.getPartialView(partialViewName);
						handlers = bindingInfos[partialViewName];
						for (eventName in handlers) {
							handler = this._getHandlerToBind(handlers[eventName], partialView);
							partialView[eventName].add(handler, collection);
						}
					}
				},

				_unbind: function BaseViewModel__unbind() {
					$Event.clearEventsFor(this._collection);
					this._view.forEach(function (partialView) {
						$Event.clearEventsFor(partialView);
					});
					$Event.clearEventsFor(this._view);
				},

				/*
					params: {
						collection: {
							params: null,
							handlers: {
								"VIEW_0": {
									eventName: "EVENT_0",
									handler: function onComponentCollectionEvent0(event, componentCollection) { ... handle event ... }
								}
							}
						},
						view: {
							params: {
								"VIEW_0": {
									domContainer: $dom.getFirst("#components_component_view0_container")
								}
							},
							handlers: {
								"VIEW_1": {
									eventName: "EVENT_1",
									handler: function onComponentView1ViewEvent1(event, componentView1Viewer) { ... handle event ... }
								}
							}
						}
					}
				*/
				init: function BaseViewModel_init(params) {
					if (this._collection && this._view) {
						this._unbind();
					}

					this._collection = new this._CollectionClass();
					this._view = new this._ViewClass();

					this._view.initCompleted.add(this.onViewInitCompleted, this, [params]);
					this._view.init(params.view.params);
				},

				dispose: function BaseViewModel_dispose() {
					this._unbind();

					this._collection.dispose();
					this._view.dispose();

					this._collection = null;
					this._view = null;
					$Event.clearEventsFor(this);
				},

				onViewInitCompleted: function(params) {
					this._bindViewToCollection(params.collection.handlers);
					this._bindCollectionToView(params.view.handlers);
					this._collection.init(params.collection.params);
				}
			}
		};
	}
})