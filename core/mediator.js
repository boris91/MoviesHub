﻿MH.modules.define("core.mediator", null, function MH$core$modules$define_moduleGetter_mediator () {
	"use strict";

	var _arraySlice = MH.ArrProto.slice;

	return function MH$core$mediator () {
		var _channels = {};

		return {
			subscribe: function MH$core$mediator$subscribe (name, callback, context) {
				var channel = _channels[name] || (_channels[name] = []);
				channel.push({
					context: context || this,
					callback: callback
				});
			},
			unSubscribe: function MH$core$mediator$unSubscribe (name, context) {
				var channel = _channels[name],
					lastIndex = channel ? (channel.length - 1) : -1,
					i, subscriber;
				for (i = lastIndex; i >= 0; i--) {
					subscriber = channel[i];
					if (context === subscriber.context) {
						channel.splice(i, 1);
					}
				}
			},
			publish: function MH$core$mediator$publish (name/*, arg1, arg2, ..., argN*/) {
				var channel = _channels[name],
					subscribersCount = channel && channel.length,
					args = _arraySlice.call(arguments, 1),
					i, subscriber;
				for (i = 0; i < subscribersCount; i++) {
					subscriber = channel[i];
					subscriber.callback.apply(subscriber.context, args);
				}
			}
		};
	};
});