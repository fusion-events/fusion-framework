/**
 * @author Aaron Scherer <aequasi@gmail.com>
 * @date 9/24/13
 * @copyright Aaron Scherer 2013
 */
( function( $ ) {
	var ctor = function() {},
		fusion = {
			version: '1.0.0'
		},
		/**
		 *
		 * @param parent
		 * @param protoProps
		 * @param staticProps
		 * @returns {jQuery.extend|*}
		 */
		inherits = function( parent, protoProps, staticProps ) {
			var child;
			if( protoProps && protoProps.hasOwnProperty( 'constructor' ) ) {
				child = protoProps.constructor;
			} else {
				child = function() {
					return parent.apply( this, arguments );
				};
			}
			child = $.extend( true, {}, child, parent );
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			if( protoProps ) {
				child.prototype = $.extend( true, {}, child.prototype, protoProps );
			}
			if( staticProps ) {
				child = $.extend( true, {}, child, staticProps );
			}
				child.prototype.constructor = child;
				child.__super__ = parent.prototype;
				return child;
		},
		/**
	 *
	 * @param protoProps
	 * @param staticProps
	 * @returns {jQuery.extend|*}
	 */
		extendThis = function( protoProps, staticProps ) {
			var child = inherits( this, protoProps, staticProps );
			child.extend = extendThis;
			return child;
		};

	/************************* Models *********************************/

	/**
	 * fusion.event construction
	 */
	(function( fusion ) {
		/**
		 * @constructor
		 */
		ctor = function() {
			this.data = {};

			for( var arg in arguments[ 0 ] ) {
				this.data[ arg ] = arguments[ 0 ][ arg ];
			}

			this.isValidEvent = true;

		};

		fusion.event = new ctor();

		fusion.event.__proto__.initialize = function() {
			for( var arg in arguments[ 0 ] ) {
				if( this.prototype[ arg ] !== undefined ) {
					this.data[ arg ] = arguments[ 0 ][ arg ];
				}
			}
		};

		fusion.event.__proto__.getData = function( key ) {
			return key === undefined ? this.data : this.data[ key ];
		};

		fusion.event.extend = extendThis;
	})( fusion );

	/**
	 * fusion.fused construction
	 */
	(function( fusion ) {
		ctor = function() {
			this.collection = [];
		};

		fusion.fused = new ctor();

		/**
		 *
		 * @param eventName
		 * @param handler
		 * @param priority
		 * @returns {fusion.fused}
		 */
		fusion.fused.__proto__.add = function( eventName, handler, priority ) {
			if( eventName === undefined ) {
				throw Error( "eventName must be defined." );
			}
			if( handler === undefined ) {
				throw Error( "handler must be defined." );
			}
			if( priority === undefined ) {
				throw Error( "priority must be defined." );
			}

			this.collection.push( {
				                      name:     eventName,
				                      priority: priority,
				                      handler:  handler
			                      } );

			return this;
		};

		/**
		 *
		 * @param eventName
		 * @param [handler]
		 * @param [priority]
		 * @returns {boolean}
		 */
		fusion.fused.__proto__.remove = function( eventName, handler, priority ) {
			/**
			 * @type {Array}
			 */
			var removed = [], event, i;

			for( i in this.collection ) {
				event = this.collection[ i ];
				if( event.name != eventName ) {
					continue;
				}

				if( handler === undefined ) {
					removed.push( this.collection.splice( i, 1 ) );
				} else if( handler == event.handler ) {
					if( priority != event.priority ) {
						continue;
					}
					removed.push( this.collection.splice( i, 1 ) );
				}
			}

			return !!removed.length;
		};

		/**
		 * @param eventName
		 * @returns {Array}
		 */
		fusion.fused.__proto__.all = function( eventName ) {
			if( eventName === undefined ) {
				throw Error( "eventName must be defined." );
			}

			var returnCollection = [], item, i;
			for( i in this.collection ) {
				item = this.collection[ i ];
				if( item.name == eventName ) {
					returnCollection.push( item );
				}
			}

			returnCollection.sort( function( a, b ) {
				if( a.priority > b.priority ) {
					return 1;
				}
				return -1;
			} );

			return returnCollection;
		};
	})( fusion );

	/**
	 * fusion.events construction
	 */
	(function( fusion ) {
		ctor = function() {
			this.collection = [];
		};

		fusion.events = new ctor();

		/**
		 *
		 * @param eventName
		 * @param [eventClass={}]
		 * @returns {fusion.events}
		 */
		fusion.events.__proto__.add = function( eventName, eventClass ) {
			if( this.collection[ eventName ] !== undefined ) {
				throw Error( "Event with name '" + eventName + "' already exists!" );
			}
			eventClass = undefined === eventClass ? {} : eventClass;

			this.collection[ eventName ] = eventClass;

			return this;
		};

		/**
		 * @param eventName
		 * @returns {boolean}
		 */
		fusion.events.__proto__.has = function( eventName ) {
			return this.collection[ eventName ] !== undefined;
		};

		/**
		 *
		 * @param eventName
		 * @returns {*}
		 */
		fusion.events.__proto__.get = function( eventName ) {
			return this.collection[ eventName ];
		};


	})( fusion );

	/*********************************** Functions *******************************/

	/**
	 *
	 * EventLister Handler (Basically $.on)
	 *
	 * @param {String} eventName string event name
	 * @param handler code to execute
	 * @param [priority] int Priority to run
	 */
	fusion.fuse = function( eventName, handler, priority ) {
		if( fusion.events.get( eventName ) === undefined ) {
			throw Error( "Fused event does not exist." );
		}

		if( priority === null || priority === undefined ) {
			priority = 50;
		}

		fusion.fused.add( eventName, handler, priority );
	};

	/**
	 * Unbinds the event
	 *
	 * @param eventName
	 * @param [handler]
	 * @param [priority]
	 */
	fusion.defuse = function( eventName, handler, priority ) {

		if( !fusion.events.has( eventName ) ) {
			throw Error( "Fused event does not exist." );
		}

		if( priority === null || priority === undefined ) {
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
	fusion.ignite = function( eventName, event ) {
		var events = fusion.fused.all( eventName ), eventClass, i;
		for( i in events ) {
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

	$.fn.fusion = fusion;
	window.$f = ( window.$f === undefined ) ? $.fn.fusion : window.$f;

	$( function() {
		fusion.ignite( 'DOCUMENT_LOAD', { window: window, cheese: 'cheese' } );
		$( document ).unload( function() {
			fusion.ignite( 'DOCUMENT_UNLOAD', { window: window } );
		} )
	} );
}( jQuery ) );