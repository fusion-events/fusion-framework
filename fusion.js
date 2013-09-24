( function ($) {
	var
		/**
		 * @constructor
		 */
		ctor = function () {},
		inherits = function (parent, protoProps, staticProps) {
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
		},
		fusion = {
			version: '0.1'
		};

	function extendThis(protoProps, staticProps) {
		var child = inherits(this, protoProps, staticProps);
		child.extend = extendThis;
		return child;
	}

	(function (fusion) {
		/**
		 * @constructor
		 */
		var func = function () {
			this.data = {};

			for (var arg in arguments[ 0 ]) {
				this.data[ arg ] = arguments[ 0 ][ arg ];
			}

			this.isValidEvent = true;

		};

		fusion.event = new func();

		fusion.event.__proto__.initialize = function( ) {
			for (var arg in arguments[ 0 ]) {
				if( this.prototype[ arg ] !== undefined ) {
					this.data[ arg ] = arguments[ 0 ][ arg ];
				}
			}
		};

		fusion.event.__proto__.getData = function( key ) {
			return key === undefined ? this.data : this.data[ key ];
		};

		fusion.event.extend = extendThis;
	})(fusion);


	/**
	 * @constructor
	 */
	fusion.fused = function () {
		/**
		 * @type {Array}
		 */
		this.collection = [];

		/**
		 *
		 * @param eventName
		 * @param handler
		 * @param priority
		 * @returns {fusion.fused}
		 */
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

		/**
		 *
		 * @param eventName
		 * @param [handler]
		 * @param [priority]
		 * @returns {boolean}
		 */
		this.remove = function( eventName, handler, priority ) {
			/**
			 * @type {Array}
			 */
			var removed = [], event, i;

			for( i in this.collection ) {
				event = this.collection[ i ];
				if( event.name != eventName ) continue;

				if( handler === undefined ) {
					removed.push( this.collection.splice( i, 1 ) );
				} else if( handler == event.handler ) {
					if( priority != event.priority ) continue;
					removed.push( this.collection.splice( i, 1 ) );
				}
			}

			return !!removed.length;
		};

		/**
		 * @param eventName
		 * @returns {Array}
		 */
		this.all = function (eventName) {
			if (eventName === undefined) {
				throw Error("eventName must be defined.");
			}

			var returnCollection = [], item, i;
			for (i in this.collection) {
				item = this.collection[ i ];
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
	 * @param {String} eventName string event name
	 * @param handler code to execute
	 * @param [priority] int Priority to run
	 */
	fusion.fuse = function (eventName, handler, priority) {
		if (fusion.events.get(eventName) === undefined) {
			throw Error("Fused event does not exist.");
		}

		if (priority === null || priority === undefined) {
			priority = 50;
		}

		fusion.fused.add(eventName, handler, priority);
	};

	/**
	 * Unbinds the event
	 *
	 * @param eventName
	 * @param [handler]
	 * @param [priority]
	 */
	fusion.defuse = function( eventName, handler, priority ) {

		if ( !fusion.events.has(eventName) ) {
			throw Error("Fused event does not exist.");
		}

		if (priority === null || priority === undefined) {
			priority = 50;
		}

		fusion.fused.remove( eventName, handler, priority );
	};

	/**
	 *
	 * Event Dispatcher
	 *
	 * @param eventName
	 * @param event
	 */
	fusion.ignite = function (eventName, event) {
		var events = fusion.fused.all(eventName ), eventClass, i;
		for (i in events) {
			if( !fusion.events.has( eventName ) ) {
				throw new Error( eventName + " is not a valid event." );
			}

			eventClass = fusion.events.get( eventName );

			eventClass.initialize( event );

			if( !eventClass.isValidEvent ) {
				throw new Error( eventName + " is not a valid event class." );
			}

			if( false === events[ i ].handler( eventClass ) ) {
				return false;
			}
		}

		return true;
	};

	/**
	 * @constructor
	 */
	fusion.events = function () {
		/**
		 * @type {Object}
		 */
		this.collection = {};

		/**
		 *
		 * @param eventName
		 * @param [eventClass={}]
		 * @returns {fusion.events}
		 */
		this.add = function ( eventName, eventClass ) {
			if (this.collection[ eventName ] !== undefined) {
				throw Error("Event with name '" + eventName + "' already exists!");
			}
			eventClass = undefined === eventClass ? {} : eventClass;

			this.collection[ eventName ] = eventClass;

			return this;
		};

		/**
		 * @param eventName
		 * @returns {boolean}
		 */
		this.has = function( eventName ) {
			return this.collection[ eventName ] !== undefined;
		};

		/**
		 *
		 * @param eventName
		 * @returns {*}
		 */
		this.get = function( eventName ) {
			return this.collection[ eventName ];
		};
	};

	fusion.events = new fusion.events();

	$.fn.fusion = fusion;
	window.$f = ( window.$f === undefined ) ? $.fn.fusion : window.$f;

	$(function () {
		fusion.ignite( 'DOCUMENT_LOAD', { window: window, cheese: 'cheese' } );
		$( document ).unload( function( ) {
			fusion.ignite( 'DOCUMENT_UNLOAD', { window: window } );
		} )
	});
}(jQuery) );

/**
 * @author Aaron Scherer <aaron@undergroundelephant.com>
 * @date 9/24/13
 * @copyright Underground Elephant 2013
 */
( function( fusion ) {

	var func = fusion.event.extend( {
		window: window,
		document: document
	} );

	fusion.events.add( 'DOCUMENT_LOAD', func );
	fusion.events.add( 'DOCUMENT_UNLOAD', func );


})( $.fn.fusion );

