this["mediator"] = (function () {
	"use strict";

	var $idsGenerator = app.core.idsGenerator;

	function Mediator() {
		this._channels = {};
	}

	Mediator.prototype = {
		subscribe: function Mediator_subscribe(name, callback) {
			var channel = this._channels[name],
				callbackId = $idsGenerator.getId();

			if (!channel) {
				channel = (this._channels[name] = {});
			}

			channel[callbackId] = callback;

			return callbackId;
		},

		unsubscribe: function Mediator_unSubscribe(name, callbackId) {
			var channel = this._channels[name];

			if (channel) {
				delete channel[callbackId];
			}
		},

		unsubscribeAll: function Mediator_unsubscribeAll() {
			this._channels = {};
		},

		publish: function Mediator_publish(name, arg) {
			var channel = this._channels[name],
				callbackId;

			if (channel) {
				for (callbackId in channel) {
					channel[callbackId](arg, this);
				}
			}
		}
	};

	return Mediator;
})();