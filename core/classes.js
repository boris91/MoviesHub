MH.modules.define("core.classes", null, function MH$core$modules$define_moduleGetter_classes () {
	"use strict";

	var _mhModules = MH.modules,
		_ctorReservedProps = {
			"__ctor__": true,
			"__superclassCtor__": true,
			"prototype": true
		},
		MH$core$classes = {
			declare: function MH$core$classes$declare (name, superclassCtor, ctor, ctorProto, ctorOwnProps) {
				return _mhModules.define(name, null, function MH$core$classes$declare_moduleGetter () {
					var propName;

					if (superclassCtor) {
						ctor = MH$core$classes.inherit(ctor, superclassCtor);
					}

					ctor.prototype = ctorProto || {};

					if (undefined !== ctorOwnProps) {
						for (propName in ctorOwnProps) {
							ctor[propName] = ctorOwnProps[propName];
						}
					}

					return ctor;
				});
			},
			inherit: function MH$core$classes$inherit (ctor, superclassCtor) {
				var newCtor = function () {
						this.__superclassCtor__.apply(this, arguments);
						return this.__ctor__.apply(this, arguments);
					},
					newCtorProto = newCtor.prototype = {},
					propName;

				this.extend(newCtorProto, superclassCtor.prototype);
				newCtorProto.__superclassCtor__ = superclassCtor;
				newCtorProto.__ctor__ = ctor;

				for (propName in superclassCtor) {
					if (superclassCtor.hasOwnProperty(propName) && !_ctorReservedProps[propName]) {
						newCtor[propName] = superclassCtor[propName];
					}
				}

				return newCtor;
			},
			extend: function MH$core$classes$extend (targetObj, sourceObj) {
				var propName;
				for (propName in sourceObj) {
					if (sourceObj.hasOwnProperty(propName)) {
						targetObj[propName] = sourceObj[propName];
					}
				}
			},
			mix: function MH$core$classes$mix (targetObj, sourceObjects) {
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

	return MH$core$classes;
});