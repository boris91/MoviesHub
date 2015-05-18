this["classes"] = (function () {
	"use strict";

	var $Object = window.Object;

	return {
		inherit: function (ctor, base) {
			var newCtorProto = Object.create(base.prototype),
				ctorProto = ctor.prototype,
				newCtor = function newCtor() {
					base.apply(this, arguments);
					ctor.apply(this, arguments);
				},
				propName;

			for (propName in ctorProto) {
				if (!newCtorProto.hasOwnProperty(propName)) {
					newCtorProto[propName] = ctorProto[propName];
				}
			}

			newCtorProto.__base__ = base.prototype;
			newCtor.prototype = newCtorProto;

			return newCtor;
		},

		extend: function classes_extend(targetObj, sourceObj) {
			var propName;
			for (propName in sourceObj) {
				if (sourceObj.hasOwnProperty(propName)) {
					targetObj[propName] = sourceObj[propName];
				}
			}
		},

		mix: function classes_mix(targetObj, sourceObjects) {
			var sourceObjectsCount = sourceObjects.length,
				i, sourceObj, propName;

			for (i = 0; i < sourceObjectsCount; i++) {
				sourceObj = sourceObjects[i];
				for (propName in sourceObj) {
					if (sourceObj.hasOwnProperty(propName) && !targetObj.hasOwnProperty(propName)) {
						targetObj[propName] = sourceObj[propName];
					}
				}
			}
		}
	};
})();