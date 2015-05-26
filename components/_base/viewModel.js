({
	type: "class",
	name: "components._base.viewModel",
	base: "core.mediator",
	getter: function () {
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

				_getHandlerToBind: function BaseViewModel__getHandlerToBind(context, handler, sender) {
					var method = handler.bind(context);
					return function (event) {
						method(event, sender);
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
							handler = this._getHandlerToBind(partialView, handlers[eventName], collection);
							collection.subscribe(eventName, handler);
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
							handler = this._getHandlerToBind(collection, handlers[eventName], partialView);
							partialView.subscribe(eventName, handler);
						}
					}
				},
				_unbind: function BaseViewModel__unbind() {
					this._collection.unsubscribeAll();
					this._view.forEach(function (partialView) {
						partialView.unsubscribeAll();
					});
					this._view.unsubscribeAll();
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

					this._view.subscribe("onInitComplete", function () {
						this._bindViewToCollection(params.collection.handlers);
						this._bindCollectionToView(params.view.handlers);
						this._collection.init(params.collection.params);
					}.bind(this));
					this._view.init(params.view.params);
				},

				dispose: function BaseViewModel_dispose() {
					this._unbind();

					this._collection.dispose();
					this._view.dispose();

					this._collection = null;
					this._view = null;

					this.unsubscribeAll();
				}
			}
		};
	}
})