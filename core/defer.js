this["defer"] = (function () {
	"use strict";

	var $arraySlice = Array.prototype.slice;

	function Deferred() {
		this._done = [];
		this._fail = [];
	}

	Deferred.prototype = {
		promise: function Deferred_promise() {
			return {
				done: this.done.bind(this),
				fail: this.fail.bind(this),
				then: this._thenImplForPromiseObj.bind(this)
			};
		},

		done: function Deferred_done(callback) {
			this._done.push(callback);
			return this;
		},

		fail: function Deferred_fail(callback) {
			this._fail.push(callback);
			return this;
		},

		resolve: function Deferred_resolve(/*args for all callbacks*/) {
			this._invokeCallbacks(this._done, arguments);
		},

		reject: function Deferred_reject(/*args for all callbacks*/) {
			this._invokeCallbacks(this._fail, arguments);
		},

		/* +++ private methods +++ */

		_invokeCallbacks: function Deferred__invokeCallbacks(callbacks, args) {
			var callbacksCount = callbacks.length,
				i;

			args = $arraySlice.call(args);

			for (i = 0; i < callbacksCount; i++) {
				callbacks[i].apply(null, args);
			}
		},

		_thenImplForPromiseObj: function Deferred__thenImplForPromiseObj(doneCallback, failCallback) {
			this._done.push(doneCallback);
			if (failCallback) {
				this._fail.push(failCallback);
			}
		}

		/* --- private methods --- */
	};

	return function defer() {
		return new Deferred();
	};
})();