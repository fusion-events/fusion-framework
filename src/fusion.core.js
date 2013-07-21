( function ($) {
	"use strict";
	var ctor = function () {
	};
	var inherits = function (parent, protoProps, staticProps) {
		var child;
		if (protoProps && protoProps.hasOwnProperty('constructor')) {
			child = protoProps.constructor;
		} else {
			child = function () {
				return parent.apply(this, arguments);
			};
		}
		child = $.extend(true, {}, child, parent);
		ctor.prototype = parent.prototype;
		child.prototype = new ctor();
		if (protoProps) child.prototype = $.extend(true, {}, child.prototype, protoProps);
		if (staticProps) child = $.extend(true, {}, child, staticProps);
		child.prototype.constructor = child;
		child.__super__ = parent.prototype;
		return child;
	};

	function extendThis(protoProps, staticProps) {
		var child = inherits(this, protoProps, staticProps);
		child.extend = extendThis;
		return child;
	}

	// Fusion Container
	var fusion = {
		version: '0.1'
	};

	(function (fusion) {
		var func = function () {
			this.args = {};
			for (var arg in arguments[ 0 ]) {
				this.args[ arg ] = arguments[ 0 ][ arg ];
			}
			this.isValidEvent = true;
		};

		fusion.event = new func();
		fusion.event.extend = extendThis;
	})(fusion);


	fusion.fused = function () {
		this.collection = [];

		this.add = function (eventName, handler, priority) {
			if (eventName === undefined) {
				throw Error("eventName must be defined.");
			}
			if (handler === undefined) {
				throw Error("handler must be defined.");
			}
			if (priority === undefined) {
				throw Error("priority must be defined.");
			}

			this.collection.push({
				name: eventName,
				priority: priority,
				handler: handler
			});

			return this;
		};

		this.all = function (eventName) {
			if (eventName === undefined) {
				throw Error("eventName must be defined.");
			}

			var returnCollection = [];
			for (var i in this.collection) {
				var item = this.collection[ i ];
				if (item.name == eventName) {
					returnCollection.push(item);
				}
			}

			returnCollection.sort(function (a, b) {
				if (a.priority > b.priority) return 1;
				return -1;
			});

			return returnCollection;
		}
	};
	fusion.fused = new fusion.fused();

	/**
	 *
	 * EventLister Handler (Basically $.on)
	 *
	 * @param eventName string event name
	 * @param handler code to execute
	 * @param priority int Priority to run
	 */
	fusion.fuse = function (eventName, handler, priority) {
		debugger;
		if (fusion.events.get(eventName) === undefined) {
			throw Error("Fused event does not exist.");
		}

		if (priority === null || priority === undefined) {
			priority = 50;
		}

		fusion.fused.add(eventName, handler, priority);
	}

	/**
	 *
	 * Event Dispatcher
	 *
	 * @param eventName
	 * @param event
	 */
	fusion.ignite = function (eventName, event) {
		debugger;
		var events = fusion.fused.all(eventName);
		for (var i in events) {
			events[ i ].handler(event);
		}
	}

	fusion.events = function () {
		this.collection = {};

		this.add = function (eventName, eventClass) {
			if (eventClass.isValidEvent === undefined || !eventClass.isValidEvent) {
				throw Error("Passed event for '" + eventName + "' is not valid. Must extend fusion.event. ");
			}
			if (this.collection[ eventName ] !== undefined) {
				throw Error("Event with name '" + eventName + "' already exists!");
			}
			this.collection[ eventName ] = eventClass;

			return this;
		}

		this.get = function (eventName) {
			if (this.collection[ eventName ] === undefined) {
				throw Error("Event with name '" + eventName + "' doesn't exists!");
			}

			return this.collection[ eventName ];
		}
	}
	fusion.events = new fusion.events();

	fusion.events.add('DOCUMENT_LOAD', fusion.event.extend({ }));
	fusion.events.add('CLICK', fusion.event.extend({ selector: null }));

	$.fn.fusion = fusion;
	window.$f = ( window.$f === undefined ) ? $.fn.fusion : window.$f;

	$(function () {
		fusion.ignite('DOCUMENT_LOAD', fusion.events.get('DOCUMENT_LOAD'));
	});
}(jQuery) );
