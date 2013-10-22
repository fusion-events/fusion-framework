/**
 * Input Events
 *
 * Copyright 2013 by Aaron Scherer <aequasi@gmail.com>
 */
 (function( fusion ) {

	fusion.events.add( 'INPUT_BLUR', fusion.event.extend( { input: null } ) );
	fusion.events.add( 'INPUT_FOCUS', fusion.event.extend( { input: null } ) );
	fusion.events.add( 'INPUT_FOCUS_IN', fusion.event.extend( { input: null } ) );
	fusion.events.add( 'INPUT_FOCUS_OUT', fusion.event.extend( { input: null } ) );
	fusion.events.add( 'INPUT_CHANGE', fusion.event.extend( { input: null } ) );
	fusion.events.add( 'INPUT_CLICK', fusion.event.extend( { input: null } ) );
	fusion.events.add( 'INPUT_DOUBLE_CLICK', fusion.event.extend( { input: null } ) );
	fusion.events.add( 'INPUT_HOVER', fusion.event.extend( { input: null } ) );
	fusion.events.add( 'INPUT_MOUSE_DOWN', fusion.event.extend( { input: null } ) );
	fusion.events.add( 'INPUT_MOUSE_ENTER', fusion.event.extend( { input: null } ) );
	fusion.events.add( 'INPUT_MOUSE_LEAVE', fusion.event.extend( { input: null } ) );
	fusion.events.add( 'INPUT_MOUSE_MOVE', fusion.event.extend( { input: null } ) );
	fusion.events.add( 'INPUT_MOUSE_OUT', fusion.event.extend( { input: null } ) );
	fusion.events.add( 'INPUT_MOUSE_OVER', fusion.event.extend( { input: null } ) );
	fusion.events.add( 'INPUT_MOUSE_UP', fusion.event.extend( { input: null } ) );

	fusion.events.add( 'INPUT_KEY_PRESS', fusion.event.extend( { input: null, key: null } ) );
	fusion.events.add( 'INPUT_KEY_UP', fusion.event.extend( { input: null, key: null } ) );
	fusion.events.add( 'INPUT_KEY_DOWN', fusion.event.extend( { input: null, key: null } ) );


	/**
	 * Triggers
	 */
	$( function() {
		$( document )
			.on( 'blur', ':input', function() { fusion.ignite( 'INPUT_BLUR', { input: this } ); } )
			.on( 'focus', ':input', function() { fusion.ignite( 'INPUT_FOCUS', { input: this } ); } )
			.on( 'focusin', ':input', function() { fusion.ignite( 'INPUT_FOCUS_IN', { input: this } ); } )
			.on( 'focusout', ':input', function() { fusion.ignite( 'INPUT_FOCUS_OUT', { input: this } ); } )
			.on( 'change', ':input', function() { fusion.ignite( 'INPUT_CHANGE', { input: this } ); } )
			.on( 'click', ':input', function() { fusion.ignite( 'INPUT_CLICK', { input: this } ); } )
			.on( 'dblclick', ':input', function() { fusion.ignite( 'INPUT_DOUBLE_CLICK', { input: this } ); } )
			.on( 'hover', ':input', function() { fusion.ignite( 'INPUT_HOVER', { input: this } ); } )
			.on( 'mousedown', ':input', function() { fusion.ignite( 'INPUT_MOUSE_DOWN', { input: this } ); } )
			.on( 'mouseenter', ':input', function() { fusion.ignite( 'INPUT_MOUSE_ENTER', { input: this } ); } )
			.on( 'mouseleave', ':input', function() { fusion.ignite( 'INPUT_MOUSE_LEAVE', { input: this } ); } )
			.on( 'mousemove', ':input', function() { fusion.ignite( 'INPUT_MOUSE_MOVE', { input: this } ); } )
			.on( 'mouseout', ':input', function() { fusion.ignite( 'INPUT_MOUSE_OUT', { input: this } ); } )
			.on( 'mouseover', ':input', function() { fusion.ignite( 'INPUT_MOUSE_OVER', { input: this } ); } )
			.on( 'mouseup', ':input', function() { fusion.ignite( 'INPUT_MOUSE_UP', { input: this } ); } )

			.on( 'keypress', ':input', function( event ) { fusion.ignite( 'INPUT_KEY_PRESS', { input: this, key: ( typeof event.which == "number" ) ? event.which : event.keyCode } ); } )
			.on( 'keyup', ':input', function( event ) { fusion.ignite( 'INPUT_KEY_UP', { input: this, key: ( typeof event.which == "number" ) ? event.which : event.keyCode } ); } )
			.on( 'keydown', ':input', function( event ) { fusion.ignite( 'INPUT_KEY_DOWN', { input: this, key: ( typeof event.which == "number" ) ? event.which : event.keyCode } ); } )
		;
	} );

})( $.fn.fusion );
