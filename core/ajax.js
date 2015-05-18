this["ajax"] = (function () {
	"use strict";

	var $XMLHttpRequest = window.XMLHttpRequest,
		$JSON = window.JSON,
		_idsCounter = 0,
		_xhrs = {},
		_createXmlHttpRequest = function ajax__createXmlHttpRequest(params) {
			var xhr = new $XMLHttpRequest(),
				xhrIsAsync = (false !== params.async),
				xhrHeaders = params.headers,
				xhrQueryOptions = params.queryOptions,
				xhrQuery = "",
				headerName, queryOption;

			if (xhrQueryOptions) {
				xhrQuery = "?";
				for (queryOption in xhrQueryOptions) {
					xhrQuery += queryOption + "=" + xhrQueryOptions[queryOption] + "&";
				}
			}

			xhr.id = _idsCounter + "";
			_xhrs[xhr.id] = xhr;

			xhr.open(params.method, params.url + xhrQuery, xhrIsAsync);

			if (xhrIsAsync) {
				xhr.onreadystatechange = _getAsyncReadyStateChangeHandler(xhr, params);
			}

			if (xhrHeaders) {
				for (headerName in xhrHeaders) {
					xhr.setRequestHeader(headerName, xhrHeaders[headerName]);
				}
			}

			return xhr;
		},
		_syncReadyStateChangeHandler = function ajax__syncReadyStateChangeHandler(xhr, params) {
			var xhrSucceeded = (200 === xhr.status),
				parseResultAsJson = (false !== params.handleAsJson),
				xhrResponseText = xhr.response || xhr.responseText,
				xhrResponseValue = xhrSucceeded ? (parseResultAsJson ? $JSON.parse(xhrResponseText) : xhrResponseText) : null,
				xhrResponse = {
					success: xhrSucceeded,
					value: xhrResponseValue
				},
				callback = function () { return xhrResponse; };

			if (false !== params.async) {
				if (xhrSucceeded) {
					callback = params.onSuccess || callback;
				} else {
					callback = params.onError || callback;
				}
			}

			delete _xhrs[xhr.id];

			return callback(xhrResponse.value);
		},
		_getAsyncReadyStateChangeHandler = function ajax__getAsyncReadyStateChangeHandler(xhr, params) {
			return function ajax__getAsyncReadyStateChangeHandler_asyncReadyStateChangeHandler() {
				if (4 === xhr.readyState) {
					return _syncReadyStateChangeHandler(xhr, params);
				}
			};
		};

	return {
		/*
			params: {
				method: "OPTIONS"/"GET"/"HEAD"/"POST"/"PUT"/"PATCH"/"DELETE"/"TRACE"/"CONNECT",
				async: true/false,
				url: "components/movie/",
				queryOptions: {
					fileName: "root/next/users.json",
					maxCount: 100
				},
				data: {...},
				headers: {...},
				onSuccess: function (response) {...},
				onError: function (response) {...},
				handleAsJson: true/false
			}
		*/
		send: function ajax_send(params) {
			var xhr = _createXmlHttpRequest(params);
			xhr.send(params.data || null);
			if (false === params.async) {
				return _syncReadyStateChangeHandler(xhr, params);
			}
		},
		abort: function ajax_abort(xhrId) {
			var xhr = _xhrs[xhrId];
			if (xhr) {
				xhr.abort();
				return true;
			}
			return false;
		},
		abortAll: function ajax_abortAll() {
			var xhrId;
			for (xhrId in _xhrs) {
				_xhrs[xhrId].abort();
			}
			_xhrs = {};
		}
	};
})();