/**
 * Fusion Framework
 *
 * Powered by jQuery
 *
 * Copyright 2013 by Aaron Scherer <aequasi@gmail.com>
 */
( function( $ ) {
	var ctor = function() {},
		fusion = {
			version: '1.3.2'
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
		var ctor = function() {
			this.data = {};

			for( var arg in arguments[ 0 ] ) {
				this.data[ arg ] = arguments[ 0 ][ arg ];
			}

			this.name = null
			this.isValidEvent = true;
			this.propagationStopped = false;

		};


		ctor.prototype.stopPropagation = function() {
			this.propagationStopped = true;

			return false;
		};

		ctor.prototype.isPropagationStopped = function() {
			return this.propagationStopped;
		}

		ctor.prototype.initialize = function() {
			this.propagationStopped = false;

			for( var arg in arguments[ 0 ] ) {
				if( this.prototype[ arg ] !== undefined ) {
					this.data[ arg ] = arguments[ 0 ][ arg ];
				}
			}
		};

		ctor.prototype.getData = function( key ) {
			return key === undefined ? this.data : this.data[ key ];
		};

		ctor.prototype.extend = extendThis;
		fusion.event = new ctor();
	})( fusion );

	/**
	 * fusion.fused construction
	 */
	(function( fusion ) {
		ctor = function() {
			this.collection = [];
		};

		/**
		 *
		 * @param eventName
		 * @param handler
		 * @param priority
		 * @returns {fusion.fused}
		 */
		ctor.prototype.add = function( eventName, handler, priority, context ) {
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
				handler:  handler,
				context:  context
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
		ctor.prototype.remove = function( eventName, handler, priority, context ) {
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
					if( context === undefined ) {
						removed.push( this.collection.splice( i, 1 ) );
					} else if( context == event.context ) {
						removed.push( this.collection.splice( i, 1 ) );
					}
				}
			}

			return !!removed.length;
		};

		/**
		 * @param eventName
		 * @returns {Array}
		 */
		ctor.prototype.all = function( eventName ) {
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

		fusion.fused = new ctor();
	})( fusion );

	/**
	 * fusion.events construction
	 */
	(function( fusion ) {
		ctor = function() {
			this.collection = [];
		};

		/**
		 *
		 * @param eventName
		 * @param [eventClass={}]
		 * @returns {fusion.events}
		 */
		ctor.prototype.add = function( eventName, eventClass ) {
			if( this.collection[ eventName ] !== undefined ) {
				throw Error( "Event with name '" + eventName + "' already exists!" );
			}
			eventClass = undefined === eventClass ? {} : eventClass;
			eventClass.eventName = eventName;

			this.collection[ eventName ] = eventClass;

			return this;
		};

		/**
		 * @param eventName
		 * @returns {boolean}
		 */
		ctor.prototype.has = function( eventName ) {
			return this.collection[ eventName ] !== undefined;
		};

		/**
		 *
		 * @param eventName
		 * @returns {*}
		 */
		ctor.prototype.get = function( eventName ) {
			return this.collection[ eventName ];
		};

		fusion.events = new ctor();


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
	fusion.fuse = function( eventName, handler, priority, context ) {
		if( fusion.events.get( eventName ) === undefined ) {
			throw Error( "Fused event '" + eventName + "' does not exist." );
		}

		if( priority === null || priority === undefined ) {
			priority = 50;
		}

		fusion.fused.add( eventName, handler, priority, context );
	};
	fusion.bind = fusion.fuse;

	/**
	 * Unbinds the event
	 *
	 * @param eventName
	 * @param [handler]
	 * @param [priority]
	 */
	fusion.defuse = function( eventName, handler, priority ) {

		if( !fusion.events.has( eventName ) ) {
			throw Error( "Fused event '" + eventName + "' does not exist." );
		}

		if( priority === null || priority === undefined ) {
			priority = 50;
		}

		fusion.fused.remove( eventName, handler, priority );
	};
	fusion.unbind = fusion.defuse;

	/**
	 *
	 * Event Dispatcher
	 *
	 * @param eventName
	 * @param event
	 */
	fusion.ignite = function( eventName, event ) {
		var events = fusion.fused.all( eventName ), eventClass, i, eventResult, handler, context;

		if( !fusion.events.has( eventName ) ) {
			throw Error( "Fused event '" + eventName + "' does not exist." );
		}

		eventClass = fusion.events.get( eventName );
		if( !eventClass.isValidEvent ) {
			throw Error( "Fused event '" + eventName + "' does not have a valid event class." );
		}

		eventClass.initialize( event );

		for( i in events ) {
			if( !events.hasOwnProperty( i ) ) continue;

			handler = events[ i ].handler;
			context = events[ i ].context;
			if( context !== undefined ) {
				eventResult = jQuery.proxy( handler, context, eventClass )();
			} else {
				eventResult = handler( eventClass );
			}


			if( false === eventResult || eventClass.isPropagationStopped() ) {
				eventClass.stopPropagation();
				return eventClass;
			}
		}

		return eventClass;
	};
	fusion.trigger = fusion.ignite;

	$.fn.fusion = fusion;
	window.$f = ( window.$f === undefined ) ? $.fn.fusion : window.$f;

}( jQuery ) );


/**
 * Input Events
 *
 * Copyright 2013 by Aaron Scherer <aequasi@gmail.com>
 */
( function( fusion ) {

	var func = fusion.event.extend( {
		input: null
	} );

	fusion.events.add( 'INPUT_BLUR', func );
	fusion.events.add( 'INPUT_FOCUS', func );
	fusion.events.add( 'INPUT_CHANGE', func );


	func = fusion.event.extend( {
		input: null,
		key: null
	} );
	fusion.events.add( 'INPUT_KEYUP', func );
	fusion.events.add( 'INPUT_KEYDOWN', func );


	/**
	 * Triggers
	 */
	$( function() {
		$( document ).on( 'blur', ':input', function() {
			fusion.ignite( 'INPUT_BLUR', { input: this } );
		} );
		$( document ).on( 'focus', ':input', function() {
			fusion.ignite( 'INPUT_FOCUS', { input: this } );
		} );
		$( document ).on( 'change', ':input', function() {
			fusion.ignite( 'INPUT_CHANGE', { input: this } );
		} );
		$( document ).on( 'keyup', ':input', function( event ) {
			fusion.ignite( 'INPUT_KEYUP', { input: this, key: ( typeof event.which == "number" ) ? event.which : event.keyCode } );
		} );
		$( document ).on( 'keydown', ':input', function( event ) {
			fusion.ignite( 'INPUT_KEYDOWN', { input: this, key: ( typeof event.which == "number" ) ? event.which : event.keyCode } );
		} );
	} );

})( $.fn.fusion );/**
 * Document Events
 *
 * Copyright 2013 by Aaron Scherer <aequasi@gmail.com>
 */
( function( fusion ) {

	var func = fusion.event.extend( {
		window: window,
		document: document
	} );

	fusion.events.add( 'DOCUMENT_LOAD', func );
	fusion.events.add( 'DOCUMENT_UNLOAD', func );


	/**
	 * Triggers
	 */
	$( function() {
		fusion.ignite( 'DOCUMENT_LOAD', { window: window, document: document } );
		$( document ).unload( function() {
			fusion.ignite( 'DOCUMENT_UNLOAD', { window: window, document: document } );
		} )
	} );

})( $.fn.fusion );

