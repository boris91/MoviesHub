this["classes"] = (function () {
	"use strict";

	var $Object = window.Object,
		_emptyCtor = function EmptyCtor() {},
		_callBaseCtors = function callBaseCtors(ctorArgs) {
			var ctors = this.__bases__,
				ctorsCount = ctors.length,
				i;
			for (i = 0; i < ctorsCount; i++) {
				ctors[i].apply(this, ctorArgs);
			}
		},
		_classesCounter = 0,
		_classMarker = app.core.idsGenerator.getId();

	return {
		/*
			params: {
				name: "myClass",
				base: function () {} / class,
				ctor: function () {},
				proto: {}
			}
		*/
		create: function classes_create(params) {
			var BaseClass = params.base,
				BaseClassProto, ClassBases, ClassProto;

			function Class() {
				this.__callBase__(arguments);
				this.__ctor__.apply(this, arguments);
			};

			if (BaseClass) {
				if (!BaseClass[_classMarker]) {
					BaseClass = this.create({
						name: BaseClass.name,
						ctor: BaseClass,
						proto: BaseClass.prototype
					});
				}
				BaseClassProto = BaseClass.prototype;
				ClassBases = BaseClassProto.__bases__.slice();
				ClassBases.push(BaseClassProto.__ctor__);
				ClassProto = $Object.create(BaseClassProto);
				ClassProto.base = BaseClassProto;
			} else {
				ClassProto = Class.prototype;
				ClassBases = [];
			}

			if (params.proto) {
				this.extend(ClassProto, params.proto);
			}

			ClassProto.__bases__ = ClassBases;
			ClassProto.__callBase__ = _callBaseCtors;
			ClassProto.__ctor__ = params.ctor || _emptyCtor;
			ClassProto.__className__ = params.name || ("Class_" + _classesCounter++);

			Class.prototype = ClassProto;
			Class[_classMarker] = true;

			return Class;
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